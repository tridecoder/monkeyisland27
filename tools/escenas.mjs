#!/usr/bin/env node
// REVISIÓN DE ESCENAS (cierre del rediseño): juega el walkthrough en modo rápido y, en los pasos con escena (intro,
// 7.2, duelos, 7.3a, 7.3, clímax, epílogo, créditos, poscréditos), a velocidad normal: en CADA línea dicha saca una
// captura (pantalla entera, 2×) y mide al que habla: % de su caja dentro de la cámara y % de cabeza+torso tapado por
// otro actor que esté delante. Falla si alguien habla con < 80 % de su cuerpo en pantalla o tapado > 20 %.
//   node tools/escenas.mjs [--pasos=1,8,29,...] [--out=dir] [--sin-imagenes]
// Salida: tools/shots/escenas/<paso>-<nn>.png y escenas.txt (una línea por captura).
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
const PASOS = args.pasos ? String(args.pasos).split(',').map(Number) : [1, 8, 29, 35, 37, 38, 43, 44, 45, 46];
const outDir = path.resolve(args.out || path.join(here, 'shots', 'escenas'));
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
const report = [];
let fallos = 0, n = 0;

/** Mide al que habla en la línea actual. */
const medir = () => G(() => {
  const g = __game.game;
  const sp = g.speeches.find(s => s.blocking) || g.speeches[0];
  if (!sp) return null;
  const out = { text: sp.text, actor: sp.actor, room: g.state && g.state.room, mode: g.mode, cam: Math.round(g.camX) };
  if (!sp.actor || g.mode !== 'play') return out;
  const a = g.actors[sp.actor];
  if (g.phone || sp.phone || sp.at) { out.voz = 'teléfono / voz en off'; return out; }
  if (!a || !a.visible || a.room !== g.state.room) { out.fuera = 'no está en la sala'; return out; }
  const b = g.actorBox(a), cam = g.camX;
  const ix = Math.max(0, Math.min(b.x + b.w, cam + 320) - Math.max(b.x, cam));
  const iy = Math.max(0, Math.min(b.y + b.h, 144) - Math.max(b.y, 0));
  out.pantalla = (ix * iy) / Math.max(1, b.w * b.h);
  // cabeza+torso (60 % superior) tapado por otro actor que esté delante (pies más abajo)
  const top = { x: b.x + b.w * 0.2, y: b.y, w: b.w * 0.6, h: b.h * 0.6 };
  let tapado = 0;
  for (const o of Object.values(g.actors)) {
    if (o === a || !o.visible || o.room !== a.room || o.y <= a.y) continue;
    const c = g.actorBox(o);
    const cx = { x: c.x + c.w * 0.2, w: c.w * 0.6 };
    const ox = Math.max(0, Math.min(top.x + top.w, cx.x + cx.w) - Math.max(top.x, cx.x));
    const oy = Math.max(0, Math.min(top.y + top.h, c.y + c.h) - Math.max(top.y, c.y));
    tapado = Math.max(tapado, (ox * oy) / Math.max(1, top.w * top.h));
    if ((ox * oy) / Math.max(1, top.w * top.h) > 0.2) out.tapa = o.id;
  }
  out.tapado = tapado;
  out.pos = [Math.round(a.x), Math.round(a.y)];
  return out;
});

async function verPaso(s) {
  await G(() => { clearInterval(window.__dismisser); window.__dismisser = null; __game.skipText(false); });
  let done = false, err = null;
  const acc = (async () => { for (const a of s.acc) await R.run(a); })().then(() => { done = true; }, e => { err = e; done = true; });
  let last = null, k = 0, quietSince = Date.now();
  while (true) {
    const st = await G(() => { const g = __game.game; return { sp: g.speeches.some(x => x.blocking), mode: g.mode, busy: g.busy > 0 || !!g.acting, choice: !!g.choice, aviso: __game.state().aviso }; });
    if (st.sp) {
      quietSince = Date.now();
      await page.waitForTimeout(260);                       // globo ya pintado
      const m = await medir();
      if (m && m.text !== last) {
        last = m.text; k++; n++;
        const f = `${String(s.n).padStart(2, '0')}-${String(k).padStart(2, '0')}.png`;
        if (!args['sin-imagenes']) await page.locator('canvas').screenshot({ path: path.join(outDir, f) });
        let mal = '';
        if (m.pantalla != null && m.pantalla < 0.8) mal += ` ✗ en pantalla ${Math.round(m.pantalla * 100)} %`;
        if (m.tapado != null && m.tapado > 0.2) mal += ` ✗ tapado ${Math.round(m.tapado * 100)} % por ${m.tapa}`;
        if (m.fuera) mal += ` ✗ ${m.fuera}`;
        if (mal) fallos++;
        report.push(`${f} [${m.room} cam ${m.cam}] ${m.actor || '(narrador/objeto)'}${m.pos ? ' @' + m.pos.join(',') : ''}${m.pantalla != null ? ` ${Math.round(m.pantalla * 100)}%` : ''}: ${String(m.text).slice(0, 70)}${mal}`);
      }
      await G(() => __game.skipSpeech());
      continue;
    }
    if (st.mode === 'ending') {
      quietSince = Date.now();
      k++;
      const f = `${String(s.n).padStart(2, '0')}-${String(k).padStart(2, '0')}-creditos.png`;
      if (!args['sin-imagenes'] && k % 2) await page.locator('canvas').screenshot({ path: path.join(outDir, f) });
      if (k % 2) report.push(`${f} (créditos / imagen final)`);
      const fin = await G(() => { const e = __game.game.ending; if (!e) return false; if (e.doneAt && !e.keep) return true; e.t += 2500; return false; });
      if (fin) await page.locator('canvas').click({ position: { x: 320, y: 200 } });
      await page.waitForTimeout(120);
      continue;
    }
    if (done && !st.busy) break;
    if (Date.now() - quietSince > 45000) { report.push(`${s.n}: sin globos en 45 s; acelero`); await G(() => __game.skipText(true)); quietSince = Date.now(); }
    await page.waitForTimeout(80);
  }
  if (err) throw err;
  await R.check(s.esp);
  await G(() => __game.skipText(true));
  await R.startDismisser();
}

try {
  await page.goto(base);
  await page.waitForFunction(() => !!window.__game);
  await G(() => { try { localStorage.clear(); } catch (e) { /* ignore */ } });
  if (PASOS.includes(1)) {
    await G(() => { __game.newGame(); });
    await verPaso({ n: 1, acc: [], esp: STEPS[0].esp });
  } else {
    await G(() => __game.skipText(true)); await R.startDismisser(); await G(() => __game.newGame()); await G(() => __game.waitIdle());
  }
  await G(() => __game.skipText(true)); await R.startDismisser();
  for (const s of STEPS.filter(s => s.n > 1)) {
    if (PASOS.includes(s.n)) { console.log(`▶ paso ${s.n} ${s.txt}`); await verPaso(s); }
    else { for (const a of s.acc) await R.run(a); await G(() => __game.waitIdle()); await R.check(s.esp); }
  }
} catch (e) { fallos++; report.push('✗ ' + (e && e.stack || e)); }
fs.writeFileSync(path.join(outDir, 'escenas.txt'), report.join('\n') + '\n');
console.log(report.filter(l => /✗/.test(l)).join('\n'));
if (errors.length) { fallos++; console.log('Errores de consola:\n  ' + errors.join('\n  ')); }
console.log(`\nESCENAS: ${n} líneas capturadas, ${fallos} problemas → ${path.relative(process.cwd(), outDir)}/escenas.txt`);
await browser.close();
server.close();
process.exit(fallos ? 1 : 0);
