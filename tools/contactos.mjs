#!/usr/bin/env node
// HOJA DE CONTACTOS DEL EDIFICIO (cierre del rediseño): juega el walkthrough hasta cada punto de control y pinta las 10
// salas enteras (panorámica) en cada uno; además, los cuatro NÚCLEOS lado a lado (P2, P1, P0, P−1) para comparar.
//   node tools/contactos.mjs [--actos=a0,a1,a1b,a2,a3,a3r,a3b] [--escala=2] [--hotspots] [--out=dir]
// Salida (por defecto tools/shots/rediseno/final/): hoja-<acto>.png (las 10 salas), nucleos.png, y <sala>-<acto>.png.
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from './serve.mjs';
import { STEPS } from './walk-data.mjs';
import { createRunner } from './walk-lib.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const args = Object.fromEntries(process.argv.slice(2).filter(a => a.startsWith('--')).map(a => { const [k, v] = a.slice(2).split('='); return [k, v ?? true]; }));
const ROOMS = ['vestibulo', 'pecera', 'office', 'catacumba', 'pajarera', 'sala_amazonas', 'ecosistema', 'eventos', 'administracion', 'cpd'];
const CPS = [['a0', 0, 'inicio (torno cerrado)'], ['a1', 8, 'Acto I, tras 7.2'], ['a1b', 16, 'Acto II, inicio'], ['a2', 29, 'Acto II, tras D1'],
  ['a3', 37, 'Acto III, inicio'], ['a3r', 39, 'Acto III, Rubén en el armario'], ['a3b', 42, 'Acto III, Rubén libre']];
const want = args.actos ? String(args.actos).split(',') : CPS.map(c => c[0]);
const scale = Number(args.escala || 2);
const outDir = path.resolve(args.out || path.join(here, 'shots', 'rediseno', 'final'));
fs.mkdirSync(outDir, { recursive: true });

const server = createServer(path.resolve(here, '..'));
await new Promise(r => server.listen(0, r));
const base = `http://localhost:${server.address().port}/`;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 640, height: 400 } });
const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', e => errors.push('pageerror: ' + e.message));
const R = createRunner(page);
const G = R.G;

const renderRoom = (room, mode) => G(async ({ room, mode }) => {
  const g = __game.game; g.state.room = room;
  await g.runScript(async () => { await g.enterRoom(room, null, { restore: true }); }, { label: 'contactos' });
  const e0 = Object.values(g.room.def.entries || {})[0]; const e = Array.isArray(e0) ? { x: e0[0], y: e0[1], dir: e0[2] } : e0;
  g.player.room = room; g.player.x = e.x; g.player.y = e.y; g.player.dir = e.dir || 'down'; g.player.path = [];
  await __game.waitIdle();
  const W = g.room.width;
  const cv = document.createElement('canvas'); cv.width = W; cv.height = 144;
  const c2 = document.createElement('canvas'); c2.width = 320; c2.height = 144;
  const x2 = c2.getContext('2d'); x2.imageSmoothingEnabled = false;
  const S = { cam: g.camX, hs: g.hsShow, sh: g.shakeUntil };
  g.shakeUntil = 0; g.speeches.length = 0; g.notices.length = 0;
  if (mode === 'hotspots') { g.hsShow = { t0: g.realTime, until: g.realTime + 1e9 }; g.hsCentro = 0; }
  try {
    for (let x = 0; x < W; x += 320) {
      const cam = Math.min(x, W - 320); g.camX = cam;
      if (g.hsCentro !== false && g.hsCentro != null) g.hsCentro = x;      // rótulos: solo los del tramo nuevo
      x2.setTransform(1, 0, 0, 1, 0, 0); x2.clearRect(0, 0, 320, 144);
      g.renderRoom(x2);
      cv.getContext('2d').drawImage(c2, x - cam, 0, 320 - (x - cam), 144, x, 0, 320 - (x - cam), 144);   // el último tramo, solo lo nuevo
    }
  } finally { g.camX = S.cam; g.hsShow = S.hs; g.shakeUntil = S.sh; g.hsCentro = false; }
  return { w: W, url: cv.toDataURL('image/png') };
}, { room, mode });

/** Compone imágenes { label, url, w } una debajo de otra (o en fila con `fila`) a la escala pedida. */
const compose = (imgs, fila = false) => G(async ({ imgs, scale, fila }) => {
  const L = await Promise.all(imgs.map(i => new Promise(res => { const im = new Image(); im.onload = () => res({ im, ...i }); im.src = i.url; })));
  const lab = 14;
  const W = fila ? L.reduce((s, l) => s + l.im.width * scale + 6, 0) : Math.max(...L.map(l => l.im.width * scale));
  const H = fila ? Math.max(...L.map(l => l.im.height * scale)) + lab : L.reduce((s, l) => s + l.im.height * scale + lab, 0);
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d'); x.fillStyle = '#16141f'; x.fillRect(0, 0, W, H); x.imageSmoothingEnabled = false; x.font = '11px monospace';
  let p = 0;
  for (const l of L) {
    const w = l.im.width * scale, h = l.im.height * scale;
    if (fila) { x.fillStyle = '#f2d468'; x.fillText(l.label, p + 2, 11); x.drawImage(l.im, p, lab, w, h); p += w + 6; }
    else { x.fillStyle = '#f2d468'; x.fillText(l.label, 4, p + 11); x.drawImage(l.im, 0, p + lab, w, h); p += h + lab; }
  }
  return c.toDataURL('image/png').split(',')[1];
}, { imgs, scale: fila ? 3 : scale, fila });
const crop = (url, x, w) => G(async ({ url, x, w }) => {
  const im = await new Promise(res => { const i = new Image(); i.onload = () => res(i); i.src = url; });
  const c = document.createElement('canvas'); c.width = w; c.height = im.height; c.getContext('2d').drawImage(im, -x, 0);
  return c.toDataURL('image/png');
}, { url, x, w });

try {
  await page.goto(base);
  await page.waitForFunction(() => !!window.__game);
  await G(() => { try { localStorage.clear(); } catch (e) { /* ignore */ } __game.skipText(true); });
  await R.startDismisser();
  await G(() => __game.newGame());
  await G(() => __game.waitIdle());
  let done = 1;
  for (const [id, n, txt] of CPS) {
    if (n > 0) for (const s of STEPS.filter(s => s.n > done && s.n <= n)) { for (const a of s.acc) await R.run(a); await G(() => __game.waitIdle()); await R.check(s.esp); }
    done = Math.max(done, n);
    if (!want.includes(id)) continue;
    await G(() => __game.save('contactos'));
    const imgs = [];
    for (const room of ROOMS) {
      await G(() => __game.load('contactos')); await G(() => __game.waitIdle());
      const r = await renderRoom(room, args.hotspots ? 'hotspots' : 'limpia');
      imgs.push({ label: `${room} · ${id} ${txt}`, url: r.url, w: r.w, room });
      fs.writeFileSync(path.join(outDir, `${room}-${id}.png`), Buffer.from(r.url.split(',')[1], 'base64'));
    }
    fs.writeFileSync(path.join(outDir, `hoja-${id}${args.hotspots ? '-hotspots' : ''}.png`), Buffer.from(await compose(imgs), 'base64'));
    if (id === 'a1') {
      // los cuatro núcleos (P2 ecosistema, P1 pecera, P0 vestíbulo, P−1 cpd) lado a lado, a 3×
      const pick = (room) => imgs.find(i => i.room === room);
      const N = [];
      for (const [room, x0, lab] of [['ecosistema', 0, 'P2 ecosistema'], ['pecera', 0, 'P1 pecera'], ['vestibulo', 224, 'P0 vestíbulo'], ['cpd', 0, 'P-1 cpd']]) N.push({ label: lab, url: await crop(pick(room).url, x0, 96) });
      fs.writeFileSync(path.join(outDir, 'nucleos.png'), Buffer.from(await compose(N, true), 'base64'));
    }
    await G(() => __game.load('contactos')); await G(() => __game.waitIdle());
    console.log(`✓ ${id} · ${txt}`);
  }
} catch (e) { errors.push(String(e && e.stack || e)); }
if (errors.length) console.log('Errores:\n  ' + errors.join('\n  '));
console.log(`Hojas en ${path.relative(process.cwd(), outDir)}/`);
await browser.close();
server.close();
process.exit(errors.length ? 1 : 0);
