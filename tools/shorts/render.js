// Renderiza cuadro a cuadro la escena animada y la une con el audio en un MP4 vertical.
// Uso: node render.js <carpeta_con_timeline> <salida.mp4> [escala]
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

(async () => {
  const [dir, outFile, scaleArg] = process.argv.slice(2);
  const scale = parseFloat(scaleArg || '1.5');
  const tl = JSON.parse(fs.readFileSync(path.join(dir, 'timeline.json'), 'utf8'));
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 720, height: 1280 }, deviceScaleFactor: scale });
  await page.addInitScript(t => { window.TL = t; }, tl);
  await page.goto('file://' + path.join(__dirname, 'scene.html'));
  await page.evaluate(() => document.fonts.ready);
  const frames = Math.ceil(tl.total * tl.fps);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(tl.fps), '-i', '-',
    '-i', path.join(dir, 'audio.wav'), '-c:v', 'libx264', '-preset', 'medium', '-crf', '22', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '128k', '-shortest', '-movflags', '+faststart', outFile], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let f = 0; f < frames; f++) {
    await page.evaluate(t => window.render(t), f / tl.fps);
    const buf = await page.screenshot({ type: 'jpeg', quality: 90 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close();
  console.log(`${outFile}: ${frames} cuadros en ${((Date.now() - t0) / 1000).toFixed(0)} s`);
})();
