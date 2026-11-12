#!/usr/bin/env node
// Iconos de la web app (180 apple-touch-icon, 192 y 512 del manifest). ÚNICA excepción a «no hay imágenes»: se generan
// con el propio código de dibujo del juego (paleta PAL, el sprite de Bruno y una portada de elContable.es), a 48x48 px
// «virtuales» escalados sin suavizado. Uso: node tools/make-icons.mjs  → icons/icon-{180,192,512}.png
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from './serve.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(here, '..', 'icons');
fs.mkdirSync(outDir, { recursive: true });
const server = createServer(path.resolve(here, '..'));
await new Promise(r => server.listen(0, r));
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`http://localhost:${server.address().port}/`);
await page.waitForFunction(() => !!window.__game);
const urls = await page.evaluate(async () => {
  const D = await import('./engine/draw.js');
  const { getFrame, paperDoll } = await import('./engine/sprites.js');
  const { drawText } = await import('./engine/font.js');
  const { microCenter } = await import('./content/rooms/art/lib-vestibulo-micro.js');
  const { PAL, rect, hline, gradV, ditherOverlay, glow, frameRect } = D;
  const N = 64;
  const c = document.createElement('canvas'); c.width = N; c.height = N;
  const g = c.getContext('2d'); g.imageSmoothingEnabled = false;
  // fondo: noche de cierre (la de la lluvia del vestíbulo) y una portada de papel
  gradV(g, 0, 0, N, N, [PAL.night[0], PAL.night[2], PAL.dusk[3]]);
  rect(g, 5, 4, 54, 56, PAL.paper[6]); frameRect(g, 5, 4, 54, 56, PAL.paper[3]);
  rect(g, 7, 6, 50, 9, PAL.ink[1]);
  microCenter(g, 'FE DE ERRATAS', 32, 8, PAL.paper[7]);
  for (let y = 19; y < 46; y += 3) { hline(g, 8, y, 14, PAL.paper[2]); hline(g, 44, y, 12, PAL.paper[2]); }
  // Bruno (el sprite del juego): cabeza y hombros a doble tamaño, en el centro de la portada
  const def = __game.game.content.actors.bruno;
  const fr = getFrame(def.sprite || paperDoll(def.doll), 'idle', 'down', 0).canvas;
  const d = fr.getContext('2d').getImageData(0, 0, fr.width, fr.height).data;
  let top = fr.height, minX = fr.width, maxX = 0;
  for (let y = 0; y < fr.height; y++) for (let x = 0; x < fr.width; x++) if (d[(y * fr.width + x) * 4 + 3] > 0) { top = Math.min(top, y); minX = Math.min(minX, x); maxX = Math.max(maxX, x); }
  const cw = maxX - minX + 1, ch = 22;
  ditherOverlay(g, 20, 18, 24, 30, PAL.paper[3], 0.25);
  g.drawImage(fr, minX, top, cw, ch, Math.round(32 - cw), 16, cw * 2, ch * 2);
  // banda roja de la fe de erratas
  rect(g, 0, 50, N, 14, PAL.red[3]); hline(g, 0, 50, N, PAL.red[5]); hline(g, 0, 63, N, PAL.red[1]);
  drawText(g, 'elContable.es', 32, 53, PAL.paper[7], { align: 'center', outline: null });
  glow(g, 32, 30, 30, 26, '#ffe2a0', 0.06, 3);
  const out = {};
  for (const size of [180, 192, 512]) {
    const o = document.createElement('canvas'); o.width = size; o.height = size;
    const og = o.getContext('2d'); og.imageSmoothingEnabled = false;
    og.fillStyle = '#000'; og.fillRect(0, 0, size, size);
    og.drawImage(c, 0, 0, N, N, 0, 0, size, size);     // vecino más próximo: píxeles gordos, sin borde negro
    out[size] = o.toDataURL('image/png');
  }
  return out;
});
for (const [size, url] of Object.entries(urls)) {
  const f = path.join(outDir, `icon-${size}.png`);
  fs.writeFileSync(f, Buffer.from(url.split(',')[1], 'base64'));
  console.log('Guardado:', f);
}
await browser.close();
server.close();
