package com.appdaniel.rutab

import com.appdaniel.rutab.data.Card
import com.appdaniel.rutab.data.Progress
import com.appdaniel.rutab.data.Srs
import com.appdaniel.rutab.data.today
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test

class LogicTest {
    private val content = TestSupport.content

    @Test fun contentIsConsistent() {
        assertEquals(11, content.units.size)
        val ids = content.questions.map { it.id }
        assertEquals(ids.size, ids.toSet().size)
        content.units.forEach { u ->
            u.lessons.indices.forEach { li ->
                assertTrue("${u.id} lección $li vacía", content.questions.any { it.unit == u.id && it.lesson == li })
            }
        }
        content.questions.forEach { q ->
            when (q.type) {
                "mc", "sign" -> assertEquals(q.id, 4, q.options.toSet().size)
                "tf" -> assertNotNull(q.id, q.answer)
                "match" -> assertTrue(q.id, q.pairs.size >= 3 && q.pairs.all { it.size == 2 })
                "order" -> assertTrue(q.id, q.items.size >= 3)
                else -> error("tipo desconocido ${q.type}")
            }
            assertTrue(q.id, q.page in 1..170)
        }
    }

    @Test fun srsMovesBoxesAndSchedules() {
        val t = 1000L
        var c: Card? = null
        c = Srs.update(c, true, t); assertEquals(1, c.box); assertEquals(t + 1, c.due)
        c = Srs.update(c, true, t); assertEquals(2, c.box); assertEquals(t + 3, c.due)
        c = Srs.update(c, false, t); assertEquals(0, c.box); assertEquals(t, c.due)
        repeat(10) { c = Srs.update(c, true, t) }
        assertEquals(Srs.MAX_BOX, c!!.box)
        assertEquals(t + 30, c!!.due)
    }

    @Test fun wrongAnswersComeBackUntilCorrect() {
        val vm = TestSupport.vm()
        vm.startNode(vm.nodes.first())
        val s = vm.session!!
        val total = s.total
        val firstId = s.current!!.id
        vm.submit(false)
        assertFalse(s.feedback!!.correct)
        vm.next()
        // la que fallé vuelve al final
        repeat(total - 1) { vm.submit(true); vm.next() }
        assertEquals(firstId, vm.session!!.current!!.id)
        assertTrue(vm.session!!.isRetry)
        vm.submit(true); vm.next()
        // terminó
        val r = vm.result!!
        assertEquals(Screen.Result, vm.screen)
        assertFalse(r.perfect)
        assertEquals((total - 1) * 100 / total, r.accuracy)
        assertTrue("u1:0" in vm.progress.completed)
        assertEquals(0, vm.progress.cards[firstId]!!.box)
        assertEquals(1, vm.progress.currentStreak())
        assertTrue("first" in vm.progress.achievements)
    }

    @Test fun perfectLessonGivesBonusAndUnlocksNext() {
        val vm = TestSupport.vm()
        assertFalse(vm.isUnlocked("u1:1"))
        vm.startNode(vm.nodes.first())
        val n = vm.session!!.total
        repeat(n) { vm.submit(true); vm.next() }
        val r = vm.result!!
        assertTrue(r.perfect)
        assertTrue(r.xp >= n * 10 + 10)
        assertTrue(vm.isUnlocked("u1:1"))
        assertFalse(vm.isUnlocked("u1:test"))
        assertTrue("perfect" in vm.progress.achievements)
    }

    @Test fun streakContinuesFromYesterdayAndResetsAfterGap() {
        val t = today()
        val vm1 = TestSupport.vm(Progress(onboarded = true, streak = 4, bestStreak = 4, lastStudyDay = t - 1))
        assertEquals(4, vm1.progress.currentStreak())
        vm1.startNode(vm1.nodes.first()); repeat(vm1.session!!.total) { vm1.submit(true); vm1.next() }
        assertEquals(5, vm1.progress.streak)

        val vm2 = TestSupport.vm(Progress(onboarded = true, streak = 9, bestStreak = 9, lastStudyDay = t - 3))
        assertEquals(0, vm2.progress.currentStreak())
        vm2.startNode(vm2.nodes.first()); repeat(vm2.session!!.total) { vm2.submit(true); vm2.next() }
        assertEquals(1, vm2.progress.streak)
        assertEquals(9, vm2.progress.bestStreak)
    }

    @Test fun examHas35QuestionsAndScoresDoubles() {
        val vm = TestSupport.vm()
        vm.startExam()
        val s = vm.session!!
        assertEquals(35, s.total)
        assertEquals(3, s.doubles.size)
        val units = mutableSetOf<String>()
        var failed = 0
        while (vm.session != null) {
            val q = vm.session!!.current!!
            units += q.unit
            val ok = !(q.id !in s.doubles && failed < 2)
            if (!ok) failed++
            vm.submit(ok)
        }
        val r = vm.result!!
        assertEquals(11, units.size)
        assertEquals(38, r.maxPoints)
        assertEquals(36, r.points)
        assertTrue(r.passed)
        assertEquals(2, r.wrong.size)
        assertTrue("exam" in vm.progress.achievements)
    }

    @Test fun examFailsBelow33() {
        val vm = TestSupport.vm()
        vm.startExam()
        var n = 0
        while (vm.session != null) { vm.submit(n++ >= 6); }
        val r = vm.result!!
        assertTrue(r.points <= 32)
        assertFalse(r.passed)
    }

    @Test fun reviewUsesDueCards() {
        val t = today()
        val ids = content.questions.take(8).map { it.id }
        val cards = ids.associateWith { Card(box = 1, due = t - 1, seen = 1, right = 0, wrong = 1) }
        val vm = TestSupport.vm(Progress(onboarded = true, cards = cards))
        assertEquals(8, vm.dueCount())
        vm.startReview(weakOnly = false)
        val s = vm.session!!
        assertEquals(8, s.total)
        repeat(8) { vm.submit(true); vm.next() }
        assertEquals(0, vm.dueCount())
        assertEquals(8, vm.progress.reviewAnswered)
    }
}
