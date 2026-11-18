package com.appdaniel.rutab

import android.annotation.SuppressLint
import android.graphics.Color
import android.os.Bundle
import android.view.ViewGroup
import android.view.WindowManager
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout
import androidx.activity.ComponentActivity
import androidx.activity.SystemBarStyle
import androidx.activity.enableEdgeToEdge
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.activity.OnBackPressedCallback

/**
 * Ruta B muestra el diseño aprobado (mapa-camino, sesiones con tutor, práctica, repaso, prueba y
 * simulacro), que vive como páginas web en assets/web. Todo funciona sin conexión.
 * Las páginas se generan con tools/demo-app/build.py y tools/sesiones/build.py (ver docs/CONTINUAR.md).
 */
class MainActivity : ComponentActivity() {
    private lateinit var web: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        // Barras de estado y navegación oscuras, del color de fondo de la app (sin franjas blancas)
        val fondo = Color.parseColor("#131F24")
        enableEdgeToEdge(SystemBarStyle.dark(fondo), SystemBarStyle.dark(fondo))
        super.onCreate(savedInstanceState)
        web = WebView(this).apply {
            layoutParams = ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT)
            setBackgroundColor(Color.parseColor("#131F24"))
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true // progreso y preferencias (localStorage)
            settings.mediaPlaybackRequiresUserGesture = false // la voz del tutor avanza sola entre frases
            webViewClient = object : WebViewClient() {
                // Solo se navega dentro de la app; los enlaces externos no se abren.
                override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest) =
                    !request.url.toString().startsWith("file:///android_asset/")

                // En las sesiones con tutor (c<capítulo>s<sesión>.html, a1s<n>.html de señales y f<n>.html de figuras) la pantalla no se apaga por inactividad:
                // la sesión avanza sola, como un video, sin que se toque la pantalla.
                override fun doUpdateVisitedHistory(view: WebView, url: String?, isReload: Boolean) {
                    super.doUpdateVisitedHistory(view, url, isReload)
                    pantallaEncendida(url != null && SESION.containsMatchIn(url))
                }
            }
        }
        // La página no queda debajo de las barras: se deja su espacio, pintado del mismo fondo
        val raiz = FrameLayout(this).apply { setBackgroundColor(fondo); addView(web) }
        ViewCompat.setOnApplyWindowInsetsListener(raiz) { v, insets ->
            val b = insets.getInsets(WindowInsetsCompat.Type.systemBars() or WindowInsetsCompat.Type.displayCutout())
            v.setPadding(b.left, b.top, b.right, b.bottom); WindowInsetsCompat.CONSUMED
        }
        setContentView(raiz)
        if (savedInstanceState != null) web.restoreState(savedInstanceState)
        else web.loadUrl("file:///android_asset/web/index.html")

        // Atrás: primero cierra lo abierto dentro de la página (práctica, prueba, aviso);
        // si no hay nada, vuelve a la página anterior; si no, sale de la app.
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                web.evaluateJavascript("(window.atras&&window.atras())||false") { cerro ->
                    when {
                        cerro == "true" -> Unit
                        web.canGoBack() -> web.goBack()
                        else -> { isEnabled = false; onBackPressedDispatcher.onBackPressed() }
                    }
                }
            }
        })
    }

    private fun pantallaEncendida(si: Boolean) {
        if (si) window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        else window.clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
    }

    private companion object { val SESION = Regex("/(c\\d+s\\d+|a\\d+s\\d+|f\\d+)\\.html") }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        web.saveState(outState)
    }

    override fun onPause() { web.onPause(); super.onPause() }
    override fun onResume() { super.onResume(); web.onResume() }
}
