#!/usr/bin/env node
// Hoja de contactos del reparto: node tools/actors.mjs [--scale=4] [--out=tools/shots/actores.png]
// Dibuja cada actor de content/actors.js (de frente, de perfil andando, de espaldas y hablando) con su nombre
// en su color de texto, y las variantes (p. ej. el Lector Medio con chaqueta / caído). Las presencias sin sprite de la
// adenda (`presence` en actors.js: Custodia, Tadeo, Herminia, el coro, el altavoz) salen como una ficha de color con su
// descripción, al final. Falla si hay errores.
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from './serve.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const args = Object.fromEntries(process.argv.slice(2).filter(a => a.startsWith('--')).map(a => { const [k, v] = a.slice(2).split('='); return [k, v ?? true]; }));
const scale = Number(args.scale || 4);
const out = path.resolve(args.out || path.join(here, 'shots', 'actores.png'));
fs.mkdirSync(path.dirname(out), { recursive: true });

const server = createServer(path.resolve(here, '..'));
await new Promise(r => server.listen(0, r));
const base = `http://localhost:${server.address().port}/`;
const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', e => errors.push(e.message));
await page.goto(base + 'tools/serve.mjs');   // any same-origin page, then replace the document
await page.setContent(`<!doctype html><html><body style="margin:0;background:#000"><canvas id="c"></canvas>
<script type="module">
  import actors from '${base}content/actors.js';
  import { paperDoll, getFrame } from '${base}engine/sprites.js';
  import { drawText } from '${base}engine/font.js';
  const S = ${scale};
  const list = [], pres = [];
  for (const [id, def] of Object.entries(actors)) {
    if (def.presence) { list.push({ id, def, presence: def.presence, label: def.name }); continue; }
    list.push({ id, def, sprite: def.sprite || paperDoll(def.doll || {}), label: def.name });
    for (const [k, v] of Object.entries(def.variants || {})) list.push({ id: id + ':' + k, def, sprite: v.sprite || paperDoll({ ...(def.doll || {}), ...(v.doll || {}) }), label: (def.name.length > 9 ? def.name.split(' ')[0] : def.name) + ' (' + k + ')' });
  }
  list.sort((a, b) => (a.presence ? 1 : 0) - (b.presence ? 1 : 0));
  const COLS = 5, CW = 92, CH = 96;
  const W = COLS * CW + 8, H = Math.ceil(list.length / COLS) * CH + 8;
  const c = document.getElementById('c'); c.width = W * S; c.height = H * S;
  const low = document.createElement('canvas'); low.width = W; low.height = H;
  const g = low.getContext('2d');
  g.fillStyle = '#2a2a3a'; g.fillRect(0, 0, W, H);
  list.forEach((a, i) => {
    const x0 = 4 + (i % COLS) * CW, y0 = 4 + Math.floor(i / COLS) * CH;
    g.fillStyle = (i + Math.floor(i / COLS)) % 2 ? '#3a3a50' : '#34344a'; g.fillRect(x0, y0, CW - 2, CH - 2);
    g.fillStyle = '#4a4a62'; g.fillRect(x0, y0 + 70, CW - 2, 1);
    if (a.presence) {
      g.fillStyle = a.def.color; g.fillRect(x0 + 3, y0 + 4, 8, 3);
      drawText(g, 'sin sprite', x0 + 14, y0 + 2, '#9a98b8', { outline: null });
      const words = a.presence.split(' '); let ln = '', yy = y0 + 14;
      for (const w of words) { if ((ln + ' ' + w).trim().length > 17) { drawText(g, ln, x0 + 3, yy, '#c8c4d8', { outline: null }); yy += 9; ln = w; } else ln = (ln + ' ' + w).trim(); }
      if (ln) drawText(g, ln, x0 + 3, yy, '#c8c4d8', { outline: null });
      drawText(g, a.label, x0 + 3, y0 + 72, a.def.color || '#fff');
      drawText(g, a.id, x0 + 3, y0 + 83, '#9a98b8', { outline: null });
      return;
    }
    const views = [['idle', 'down', 0], ['walk', 'right', 1], ['idle', 'up', 0], ['talk', 'down', 1]];
    const step = Math.max(22, a.sprite.w + 4);
    views.slice(0, Math.max(1, Math.floor((CW - 4) / step))).forEach(([anim, dir, fr], k) => {
      const { canvas, flip } = getFrame(a.sprite, anim, dir, fr);
      const fx = x0 + 3 + k * step + Math.round(step / 2), fy = y0 + 70;
      const dx = Math.round(fx - (a.sprite.ox + 1)), dy = Math.round(fy - (a.sprite.oy + 1));
      if (flip) { g.save(); g.translate(fx * 2, 0); g.scale(-1, 1); g.drawImage(canvas, dx, dy); g.restore(); }
      else g.drawImage(canvas, dx, dy);
    });
    drawText(g, a.label, x0 + 3, y0 + 72, a.def.color || '#fff');
    drawText(g, a.id, x0 + 3, y0 + 83, '#9a98b8', { outline: null });
  });
  const cg = c.getContext('2d'); cg.imageSmoothingEnabled = false; cg.drawImage(low, 0, 0, W * S, H * S);
  window.__done = { W: W * S, H: H * S, n: list.length };
</script></body></html>`);
await page.waitForFunction(() => window.__done, null, { timeout: 10000 }).catch(() => {});
const done = await page.evaluate(() => window.__done);
if (done) {
  await page.setViewportSize({ width: done.W, height: done.H });
  await page.locator('#c').screenshot({ path: out });
  console.log(`Guardado: ${out} (${done.n} figuras)`);
}
if (errors.length) console.log('Errores:\n  ' + errors.join('\n  '));
await browser.close();
server.close();
process.exit(errors.length || !done ? 1 : 0);
