#!/usr/bin/env node
// VISTA PREVIA DE UNA SALA PARA LOS ARTISTAS (rediseño, docs/GUIA_REDISENO.md §9): la pinta en TODOS sus estados de acto
// (jugando el walkthrough de la biblia hasta cada punto de control) en tres versiones —limpia, depuración y «ver
// hotspots»— y saca el informe de geometría (aproximación, alcance, cobertura, PNJ visibles con Bruno en su punto de
// conversación, reglas del rediseño). Panorámica completa en las salas anchas (pecera, ecosistema, eventos).
//
//   node tools/sala.mjs <sala> [--actos=a0,a1,a2,a3,a3r,a3b] [--escala=2] [--out=<dir>] [--estricto] [--sin-imagenes]
//
// Salida: tools/shots/sala/<sala>/<sala>-<acto>[-debug|-hotspots].png y <sala>-hoja.png (todas juntas), y por consola
// la tabla de PNJ (visibilidad de cabeza+torso sola / con Bruno hablándole) y los errores y avisos. Sale con 1 si hay
// errores (en una sala con `rediseno: true` en su arte, las reglas del rediseño también son errores).
// Puntos de control: a0 inicio (torno cerrado) · a1 Acto I tras la escena 7.2 · a1b inicio del Acto II · a2 Acto II
// tras el duelo D1 · a3 inicio del Acto III · a3r Rubén en el armario · a3b Rubén libre.
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from './serve.mjs';
import { STEPS } from './walk-data.mjs';
import { createRunner, StepFail } from './walk-lib.mjs';
import { auditRoom } from './geo-audit.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const args = Object.fromEntries(argv.filter(a => a.startsWith('--')).map(a => { const [k, v] = a.slice(2).split('='); return [k, v ?? true]; }));
const room = argv.find(a => !a.startsWith('--'));
const ROOMS = ['vestibulo', 'pecera', 'office', 'catacumba', 'pajarera', 'sala_amazonas', 'ecosistema', 'eventos', 'administracion', 'cpd'];
if (!room || !ROOMS.includes(room)) { console.log('uso: node tools/sala.mjs <sala> [--actos=a0,a1,...] [--escala=2] [--out=dir] [--estricto]\nsalas: ' + ROOMS.join(', ')); process.exit(2); }
const CPS = [['a0', 0, 'inicio (torno cerrado)'], ['a1', 8, 'Acto I, tras 7.2'], ['a1b', 16, 'Acto II, inicio'], ['a2', 29, 'Acto II, tras D1'],
  ['a3', 37, 'Acto III, inicio'], ['a3r', 39, 'Acto III, Rubén en el armario'], ['a3b', 42, 'Acto III, Rubén libre']];
const want = args.actos ? String(args.actos).split(',') : CPS.map(c => c[0]);
const scale = Number(args.escala || 2);
const outDir = path.resolve(args.out || path.join(here, 'shots', 'sala', room));
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

/** Pinta la sala entera (panorámica) en un modo: 'limpia' | 'debug' | 'hotspots'. Devuelve un PNG en base64. */
const render = (mode, scale) => G(({ mode, scale }) => {
  const g = __game.game, W = g.room.width;
  const cv = document.createElement('canvas'); cv.width = W; cv.height = 144;
  const c2 = document.createElement('canvas'); c2.width = 320; c2.height = 144;
  const x2 = c2.getContext('2d'); x2.imageSmoothingEnabled = false;
  const S = { cam: g.camX, on: g.debug.on, ov: g.debug.overlay, hs: g.hsShow, sh: g.shakeUntil };
  g.shakeUntil = 0; g.speeches.length = 0; g.notices.length = 0;
  if (mode === 'debug') { g.debug.on = true; g.debug.overlay = true; }
  if (mode === 'hotspots') { g.hsShow = { t0: g.realTime, until: g.realTime + 1e9 }; g.hsCentro = true; }
  try {
    for (let x = 0; x < W; x += 320) {
      const cam = Math.min(x, W - 320); g.camX = cam;
      x2.setTransform(1, 0, 0, 1, 0, 0); x2.clearRect(0, 0, 320, 144);
      g.renderRoom(x2);
      cv.getContext('2d').drawImage(c2, cam, 0);
    }
  } finally { g.camX = S.cam; g.debug.on = S.on; g.debug.overlay = S.ov; g.hsShow = S.hs; g.shakeUntil = S.sh; g.hsCentro = false; }
  const big = document.createElement('canvas'); big.width = W * scale; big.height = 144 * scale;
  const bg = big.getContext('2d'); bg.imageSmoothingEnabled = false; bg.drawImage(cv, 0, 0, big.width, big.height);
  return big.toDataURL('image/png').split(',')[1];
}, { mode, scale });

let failures = 0;
const sheet = [];
try {
  await page.goto(base);
  await page.waitForFunction(() => !!window.__game);
  await G(() => { try { localStorage.clear(); } catch (e) { /* ignore */ } __game.skipText(true); });
  await R.startDismisser();
  await G(() => __game.newGame());
  await G(() => __game.waitIdle());
  let done = 1;
  console.log(`Sala ${room} → ${path.relative(process.cwd(), outDir)}/\n`);
  for (const [id, n, txt] of CPS) {
    if (n > 0) for (const s of STEPS.filter(s => s.n > done && s.n <= n)) { for (const a of s.acc) await R.run(a); await G(() => __game.waitIdle()); await R.check(s.esp); }
    done = Math.max(done, n);
    if (!want.includes(id)) continue;
    await G(() => __game.save('sala-preview'));
    await G(async (room) => {
      const g = __game.game; g.state.room = room;
      await g.runScript(async () => { await g.enterRoom(room, null, { restore: true }); }, { label: 'vista previa' });
      const e0 = Object.values(g.room.def.entries || {})[0]; const e = Array.isArray(e0) ? { x: e0[0], y: e0[1], dir: e0[2] } : e0;
      g.player.room = room; g.player.x = e.x; g.player.y = e.y; g.player.dir = e.dir || 'down'; g.player.path = [];
    }, room);
    await G(() => __game.waitIdle());
    const files = [];
    if (!args['sin-imagenes']) for (const mode of ['limpia', 'debug', 'hotspots']) {
      const f = path.join(outDir, `${room}-${id}${mode === 'limpia' ? '' : '-' + mode}.png`);
      fs.writeFileSync(f, Buffer.from(await render(mode, scale), 'base64'));
      files.push(path.basename(f));
    }
    const r = await G(auditRoom, { tag: id, estricto: !!args.estricto, kit: base + 'content/lib/kit.js' });
    const poses = await G(() => __game.state().poses);
    console.log(`■ ${id} · ${txt}${r.estricto ? ' · REGLAS ESTRICTAS (rediseño)' : ''}`);
    console.log(`  PNJ (cabeza+torso visibles / zona de clic / hablando): ${r.vis.join(' · ') || '—'}${Object.keys(poses).length ? '\n  poses: ' + JSON.stringify(poses) : ''}`);
    if (r.cerrados.length) console.log(`  walkboxes condicionales cerrados: ${r.cerrados.join(', ')} → al otro lado (a propósito): ${r.condicionales.length ? r.condicionales.join(' · ') : '—'}`);
    // el torno del vestíbulo: en a0 (cerrado) el núcleo queda al otro lado; desde a1, todo se alcanza
    if (room === 'vestibulo') {
      const sep = r.condicionales.filter(c => /desde 'inicio'/.test(c));
      if (id === 'a0' && !(r.cerrados.includes('paso_torno') && ['ascensor_vestibulo', 'vestibulo_a_redaccion'].every(h => sep.some(c => c.includes(`«${h}»`))))) r.issues.push(`${id} vestibulo: con el torno cerrado, el ascensor y la escalera deberían quedar al otro lado (${sep.join(' · ') || 'nada separado'})`);
      if (id !== 'a0' && (r.cerrados.length || r.condicionales.length)) r.issues.push(`${id} vestibulo: con el torno abierto todo debe alcanzarse (cerrados: ${r.cerrados.join(', ') || '—'}; separados: ${r.condicionales.join(' · ') || '—'})`);
      if (!r.issues.length) console.log(`  ✓ torno ${id === 'a0' ? 'cerrado: núcleo inalcanzable desde la calle' : 'abierto: todo alcanzable desde todas las entradas'}`);
    }
    for (const m of r.issues) { failures++; console.log('  ✗ ' + m); }
    for (const m of r.avisos) console.log('  · aviso: ' + m);
    if (!r.issues.length) console.log(`  ✓ ${r.n} hotspots/PNJ sin errores de geometría`);
    if (files.length) console.log('  ' + files.join('  '));
    sheet.push({ id, txt, files });
    await G(() => __game.load('sala-preview'));
    await G(() => __game.waitIdle());
  }
  // hoja de contactos: limpia + hotspots de cada acto, una debajo de otra
  if (!args['sin-imagenes'] && sheet.length) {
    const imgs = [];
    for (const s of sheet) for (const f of s.files.filter(f => !/-debug/.test(f))) imgs.push({ label: `${s.id} · ${s.txt}${/-hotspots/.test(f) ? ' · ver hotspots' : ''}`, b64: fs.readFileSync(path.join(outDir, f)).toString('base64') });
    const b64 = await G(async (imgs) => {
      const loaded = await Promise.all(imgs.map(i => new Promise(res => { const im = new Image(); im.onload = () => res({ im, label: i.label }); im.src = 'data:image/png;base64,' + i.b64; })));
      const W = Math.max(...loaded.map(l => l.im.width)), H = loaded.reduce((s, l) => s + l.im.height + 18, 0);
      const c = document.createElement('canvas'); c.width = W; c.height = H;
      const x = c.getContext('2d'); x.fillStyle = '#16141f'; x.fillRect(0, 0, W, H); x.imageSmoothingEnabled = false;
      let y = 0; x.font = '12px monospace';
      for (const l of loaded) { x.fillStyle = '#f2d468'; x.fillText(l.label, 6, y + 13); y += 18; x.drawImage(l.im, 0, y); y += l.im.height; }
      return c.toDataURL('image/png').split(',')[1];
    }, imgs);
    fs.writeFileSync(path.join(outDir, `${room}-hoja.png`), Buffer.from(b64, 'base64'));
    console.log(`\nHoja de contactos: ${path.relative(process.cwd(), path.join(outDir, room + '-hoja.png'))}`);
  }
} catch (e) {
  failures++;
  console.log('\n  ✗ ' + (e instanceof StepFail ? e.message : (e && e.stack || e)));
}
if (errors.length) { failures++; console.log('\nErrores de consola:\n  ' + errors.join('\n  ')); }
console.log(failures ? `\nSALA ${room}: ${failures} ERRORES` : `\nSALA ${room}: OK`);
await browser.close();
server.close();
process.exit(failures ? 1 : 0);
