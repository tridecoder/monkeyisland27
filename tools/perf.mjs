#!/usr/bin/env node
// RENDIMIENTO EN UN MÓVIL MEDIO EMULADO: CPU ×4 más lenta (CDP), ventana de iPhone en horizontal; en cada sala, Bruno
// cruza la sala andando (la cámara se desplaza) y se mide el tiempo entre fotogramas (requestAnimationFrame) y el coste
// del render de la sala (Game.renderRoom) durante ~5 s.
//   node tools/perf.mjs [--salas=pecera,eventos] [--cpu=4] [--ms=5000]
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from './serve.mjs';

const { chromium, devices } = createRequire(import.meta.url)('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const args = Object.fromEntries(process.argv.slice(2).filter(a => a.startsWith('--')).map(a => { const [k, v] = a.slice(2).split('='); return [k, v ?? true]; }));
const SALAS = args.salas ? String(args.salas).split(',') : ['pecera', 'eventos', 'ecosistema', 'vestibulo', 'sala_amazonas', 'catacumba'];
const CPU = Number(args.cpu || 4), MS = Number(args.ms || 5000);
const server = createServer(path.resolve(here, '..'));
await new Promise(r => server.listen(0, r));
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices['iPhone 13 landscape'] });
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
await page.goto(`http://localhost:${server.address().port}/`);
await page.waitForFunction(() => !!window.__game);
await page.evaluate(() => { __game.skipText(true); return __game.newGame(); });
await page.evaluate(() => { __game.setFlag('torno_abierto', true); __game.setFlag('intro_vista', true); __game.skipText(false); });
let peor = Infinity;
const out = [];
for (const sala of SALAS) {
  await page.evaluate((s) => __game.gotoRoom(s), sala);
  await page.evaluate(() => __game.waitIdle());
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU });
  const r = await page.evaluate(async (ms) => {
    const g = __game.game, W = g.room.width;
    // render de la sala cronometrado
    const orig = g.renderRoom.bind(g); const rt = [];
    g.renderRoom = (c) => { const t0 = performance.now(); const v = orig(c); rt.push(performance.now() - t0); return v; };
    const oR = g.render.bind(g), oU = g.update.bind(g); const tr = [], tu = [];
    g.render = () => { const t0 = performance.now(); oR(); tr.push(performance.now() - t0); };
    g.update = (dt) => { const t0 = performance.now(); oU(dt); tu.push(performance.now() - t0); };
    // Bruno cruza la sala de punta a punta (y vuelve)
    const P = g.player, ends = [g.room.walk.nearest(20, 124), g.room.walk.nearest(W - 20, 124)];
    let k = 0; const go = () => { const [x, y] = ends[k++ % 2]; P.path = g.room.walk.findPath([P.x, P.y], [x, y]); };
    go();
    const ft = []; let last = performance.now();
    await new Promise(res => { const t0 = performance.now(); const tick = (t) => { ft.push(t - last); last = t; if (!P.path.length) go(); if (t - t0 < ms) requestAnimationFrame(tick); else res(); }; requestAnimationFrame(tick); });
    g.renderRoom = orig; g.render = oR; g.update = oU;
    const m = (a) => a.reduce((x, y) => x + y, 0) / Math.max(1, a.length);
    ft.shift();
    const sorted = ft.slice().sort((a, b) => a - b), avg = ft.reduce((a, b) => a + b, 0) / ft.length;
    const rAvg = rt.reduce((a, b) => a + b, 0) / Math.max(1, rt.length), rS = rt.slice().sort((a, b) => a - b);
    return { total: m(tr), upd: m(tu), fps: 1000 / avg, p95: sorted[Math.floor(sorted.length * 0.95)], render: rAvg, render95: rS[Math.floor(rS.length * 0.95)] || 0, n: ft.length };
  }, MS);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  peor = Math.min(peor, r.fps);
  out.push(`${sala.padEnd(14)} ${r.fps.toFixed(1).padStart(5)} fps · fotograma p95 ${r.p95.toFixed(1)} ms · render ${r.total.toFixed(1)} ms · update ${r.upd.toFixed(1)} ms · renderRoom ${r.render.toFixed(2)} ms (p95 ${r.render95.toFixed(2)}) · ${r.n} fotogramas`);
  console.log(out[out.length - 1]);
}
console.log(`\nCPU ×${CPU}, ${devices['iPhone 13 landscape'].viewport.width}×${devices['iPhone 13 landscape'].viewport.height}: peor sala ${peor.toFixed(1)} fps ${peor >= 30 ? '(≥ 30: OK)' : '(< 30: CACHEAR CAPAS)'}`);
await browser.close();
server.close();
process.exit(peor >= 30 ? 0 : 1);
