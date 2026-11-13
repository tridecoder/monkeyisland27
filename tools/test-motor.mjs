#!/usr/bin/env node
// PRUEBA DEL MOTOR Y DEL KIT DEL REDISEÑO (docs/GUIA_REDISENO.md): registra en caliente la sala de demostración
// tools/demo-rediseno.js (no está en el juego) y comprueba, con capturas en tools/shots/motor-*.png:
//   pose sentada y «tras la mesa» (colocación y api.pose), walkbox en U (camino alrededor de la mesa, z-orden), zona
//   con escala propia, penumbra con foco y actor exento, plano detalle (líneas, Esc, modo rápido, guardar/cargar),
//   «ver hotspots» (tecla H, Espacio, botón del panel, menú de pausa, pulsación larga táctil), margen de toque de los
//   objetos pequeños (12×10 con ratón, 16×12 al tacto), filas de diálogo de 14 px al tacto, objeto en la mano y el
//   registro del kit (placas y rótulos enteros). Además, en el juego real: Gervasio sentado en la Sala Amazonas y
//   «ver hotspots» en las 10 salas.
//   node tools/test-motor.mjs
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from './serve.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const shots = path.join(here, 'shots');
fs.mkdirSync(shots, { recursive: true });
const server = createServer(path.resolve(here, '..'));
await new Promise(r => server.listen(0, r));
const base = `http://localhost:${server.address().port}/`;
const browser = await chromium.launch();
let failures = 0, checks = 0;
const ok = (c, m) => { checks++; if (c) console.log('  ✓ ' + m); else { failures++; console.log('  ✗ ' + m); } };
const consoleErrors = [];

async function open(ctxOpts = { viewport: { width: 960, height: 600 } }) {
  const ctx = await browser.newContext(ctxOpts);
  const page = await ctx.newPage();
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));
  await page.goto(base + '?room=pecera');
  await page.waitForFunction(() => window.__game && __game.state().mode === 'play');
  await page.evaluate(() => { __game.skipText(true); return __game.waitIdle(); });
  await page.evaluate(() => __game.skipText(false));
  // registra la sala de demostración y pone a sus PNJ en ella
  await page.evaluate(async (base) => {
    const m = await import(base + 'tools/demo-rediseno.js');
    const g = __game.game, R = m.default;
    g.content.rooms[R.id] = R;
    Object.assign(g.content.flags, R.flags || {});
    for (const p of R.actors) { const a = g.actors[p.id]; a.room = R.id; a.x = p.x; a.y = p.y; a.dir = p.dir; a.visible = true; a.path = []; }
    await __game.gotoRoom(R.id, 'pecera');
  }, base);
  return { ctx, page, G: (fn, a) => page.evaluate(fn, a) };
}
const shot = (page, name) => page.screenshot({ path: path.join(shots, `motor-${name}.png`) });

try {
  console.log('Motor del rediseño (sala de demostración tools/demo-rediseno.js)\n');
  const { ctx, page, G } = await open();
  await page.waitForTimeout(300);
  await shot(page, 'demo');

  // ---------------------------------------------------------------- poses
  const poses = await G(() => __game.state().poses);
  ok(poses.paco_ticket === 'sentado' && poses.celestino === 'tras_mesa', `pose por colocación: Paco sentado, Celestino tras la mesa (${JSON.stringify(poses)})`);
  const boxes = await G(() => { const g = __game.game, a = g.actors.paco_ticket; const b1 = g.actorBox(a); const p = a.pose; a.pose = 'de_pie'; const b0 = g.actorBox(a); a.pose = p; return { b0, b1 }; });
  ok(boxes.b1.y > boxes.b0.y + 4, `sentado, la cabeza baja (caja ${Math.round(boxes.b0.y)} → ${Math.round(boxes.b1.y)})`);
  await G(() => __game.game.runScript(async api => { api.pose('paco_ticket', 'de_pie'); }));
  ok(!(await G(() => __game.state().poses)).paco_ticket, 'api.pose(id, "de_pie") lo levanta');
  await G(() => __game.game.runScript(async api => { api.pose('paco_ticket', null); }));
  ok((await G(() => __game.state().poses)).paco_ticket === 'sentado', 'api.pose(id, null) vuelve a la pose de su colocación');
  await G(() => __game.game.runScript(async api => { api.pose('bruno', 'sentado'); }));
  ok((await G(() => __game.state().poses)).bruno === 'sentado', 'api.pose en un guion (Bruno sentado)');
  await G(() => __game.game.runScript(async api => { await api.walkTo(120, 126); }));
  ok(!(await G(() => __game.state().poses)).bruno, 'al andar se levanta solo');
  await G(() => __game.save(3));
  await G(() => __game.game.runScript(async api => { api.pose('paco_ticket', 'tras_mesa'); }));
  await G(() => __game.save(2));
  await G(() => __game.load(2));
  ok((await G(() => __game.state().poses)).paco_ticket === 'tras_mesa', 'la pose explícita se guarda y se carga');
  await G(() => __game.load(3));

  // ---------------------------------------------------------------- walkbox en U, z-orden y escala por zona
  const path1 = await G(() => {
    const g = __game.game, w = g.room.walk;
    const p = w.findPath([60, 130], [250, 101]);
    const pts = [[60, 130], ...p];
    let inside = true;
    for (let i = 1; i < pts.length; i++) if (!w.clear(pts[i - 1], pts[i])) inside = false;
    const end = p[p.length - 1];
    return { n: p.length, inside, end, behind: end[1] < 104 };
  });
  ok(path1.inside && path1.behind && path1.n >= 2, `walkbox en U: camino de delante a DETRÁS de la mesa rodeándola (${path1.n} tramos, siempre dentro del suelo)`);
  const z = await G(() => { const g = __game.game; const m = g.room.def.objects.find(o => o.id === 'mesa_demo'); return { zy: m.zy, celestino: g.actors.celestino.y }; });
  ok(z.celestino < z.zy, `z-orden: Celestino (pies y=${z.celestino}) queda DETRÁS de la mesa (zy=${z.zy})`);
  const sc = await G(() => { const g = __game.game; return { normal: g.roomScale(130, 100), tarima: g.roomScale(135, 170) }; });
  ok(Math.abs(sc.tarima - 1.12) < 1e-6 && Math.abs(sc.normal - 1.12) > 0.05, `escala por zona (walkbox con scale): tarima ${sc.tarima}, suelo ${sc.normal.toFixed(3)}`);

  // ---------------------------------------------------------------- margen de toque de objetos pequeños
  const slop = await G(() => {
    const g = __game.game, cam = Math.round(g.camX);
    g.mouse.touch = false;
    const inMouse = g.pickAt(212 + 3 - cam, 52 + 3 + 4); const outMouse = g.pickAt(212 + 3 - cam, 52 + 3 + 7);
    g.mouse.touch = true;
    const inTouch = g.pickAt(212 + 3 - cam, 52 + 3 + 5);
    g.mouse.touch = false;
    return { inMouse: inMouse && inMouse.id, outMouse: outMouse && outMouse.id, inTouch: inTouch && inTouch.id };
  });
  ok(slop.inMouse === 'taza_demo' && slop.outMouse !== 'taza_demo', `objeto de 6×6: con ratón se acierta hasta 12×10 (a 4 px: ${slop.inMouse}; a 7 px: ${slop.outMouse})`);
  ok(slop.inTouch === 'taza_demo', 'al tacto, hasta 16×12 (a 5 px del centro, tras el borde)');

  // ---------------------------------------------------------------- ver hotspots
  await page.mouse.click(10, 10);
  await page.keyboard.press('h');
  let hs = await G(() => __game.state().hotspotsShown);
  await shot(page, 'ver-hotspots');
  ok(hs, 'tecla H: «ver hotspots»');
  await page.waitForTimeout(1700);
  ok(!(await G(() => __game.state().hotspotsShown)), 'se apaga solo a los 1,5 s');
  await page.keyboard.down(' ');
  await page.waitForTimeout(2000);
  hs = await G(() => __game.state().hotspotsShown);
  await page.keyboard.up(' ');
  ok(hs, 'mantener Espacio: se ve mientras se pulsa');
  const eye = await G(() => __game.virtualToClient(294, 149));
  await page.mouse.click(eye.x, eye.y);
  ok(await G(() => __game.state().hotspotsShown), 'botón del ojo en el panel');
  await page.waitForTimeout(1700);
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => __game.game.menu && __game.game.menu.layout);
  const it = await G(() => { const i = __game.game.menu.layout.find(i => i.act === 'hotspots'); return __game.virtualToClient(i.x + 6, i.y + 5); });
  await page.mouse.click(it.x, it.y);
  ok(await G(() => !__game.game.menu && __game.state().hotspotsShown), 'menú de pausa: «Ver objetos de la sala (H)»');
  const list = await G(() => __game.showHotspots());
  ok(['taza_demo', 'expositor_demo', 'paco_ticket', 'celestino', 'puerta_demo'].every(id => list.some(t => t.id === id)), `resalta objetos, salidas y PNJ (${list.length})`);

  // ---------------------------------------------------------------- penumbra con actor exento
  await G(() => { __game.setFlag('demo_penumbra', true); });
  await page.waitForTimeout(200);
  await shot(page, 'penumbra');
  const pen = await G(() => {
    const g = __game.game, c = document.createElement('canvas'); c.width = 320; c.height = 144; const x = c.getContext('2d');
    g.camFollow = null; g.camTarget = 80; g.camX = 80;
    g.renderRoom(x);
    const lum = (px, py) => { const d = x.getImageData(px - Math.round(g.camX), py, 1, 1).data; return d[0] + d[1] + d[2]; };
    const L = g.actors.lector_medio, b = g.actorBox(L);
    const lx = Math.round(L.x), ly = Math.round(b.y + b.h * 0.4);
    const onActor = lum(lx, ly);
    g.state.flags.demo_penumbra = false; x.clearRect(0, 0, 320, 144); g.renderRoom(x);
    const offActor = lum(lx, ly), offBg = lum(390, 30);
    g.state.flags.demo_penumbra = true; x.clearRect(0, 0, 320, 144); g.renderRoom(x);
    const onBg = lum(390, 30);
    g.camTarget = null; g.camFollow = g.G.player;
    return { onActor, offActor, onBg, offBg };
  });
  ok(pen.onBg < pen.offBg * 0.7, `penumbra: el fondo se oscurece (${pen.offBg} → ${pen.onBg})`);
  ok(Math.abs(pen.onActor - pen.offActor) <= 3, `penumbra: el actor exento (luz: 1) no se oscurece (${pen.offActor} → ${pen.onActor})`);
  await G(() => { __game.setFlag('demo_penumbra', false); });

  // ---------------------------------------------------------------- objeto en la mano
  await G(() => __game.game.runScript(async api => { api.sostener('celestino', 'cafe'); }, { blocking: false }));
  ok(await G(() => !!__game.game.actors.celestino.hold), 'api.sostener: objeto (icono de un item) en la mano');
  await G(() => __game.game.runScript(async api => { api.sostener('celestino', null); }));

  // ---------------------------------------------------------------- plano detalle
  const det = (opts) => `api.detalle(${opts})`;
  void det;
  page.evaluate(() => __game.game.runScript(async api => {
    await api.detalle({ titulo: 'ATREZO', w: 150, h: 60, lines: [['inigo_sinergia', 'Primera línea con el inserto abierto.'], 'Segunda, del narrador.'],
      draw(g, r) { g.fillStyle = '#f4f0e0'; g.fillRect(r.x, r.y, r.w, r.h); g.fillStyle = '#c83a3a'; g.fillRect(r.x + 10, r.y + 20, r.w - 20, 14); } });
  })).catch(() => {});
  await page.waitForTimeout(700);
  ok((await G(() => __game.state().detalle)) && (await G(() => __game.state().detalle.titulo)) === 'ATREZO', 'api.detalle abre el inserto con su rótulo');
  await shot(page, 'detalle');
  await G(() => __game.skipSpeech());
  await page.waitForTimeout(150);
  await G(() => __game.skipSpeech());
  await G(() => __game.waitIdle());
  ok(!(await G(() => __game.state().detalle)) && (await G(() => __game.log.some(l => /Segunda, del narrador/.test(l.text)))), 'se cierra al acabar sus líneas (clic = siguiente globo)');
  // sin líneas: espera ms o un clic
  page.evaluate(() => __game.game.runScript(async api => { await api.detalle({ ms: 60000, draw() {} }); })).catch(() => {});
  await page.waitForTimeout(400);
  const c = await G(() => __game.virtualToClient(160, 100));
  await page.mouse.click(c.x, c.y);
  await G(() => __game.waitIdle());
  ok(!(await G(() => __game.state().detalle)), 'sin líneas: un clic lo cierra');
  // Esc en una cinemática
  page.evaluate(() => __game.game.runScript(async api => { await api.cutscene(async () => { await api.detalle({ ms: 60000, lines: ['Una línea larga que nadie va a leer entera.'] }); await api.wait(60000); }); })).catch(() => {});
  await page.waitForTimeout(400);
  await page.keyboard.press('Escape');
  await G(() => __game.waitIdle());
  ok(!(await G(() => __game.state().detalle)) && !(await G(() => __game.state().busy)), 'Esc (cinemática saltada) lo cierra y libera la entrada');
  // modo rápido
  await G(() => __game.skipText(true));
  const t0 = Date.now();
  await G(() => __game.game.runScript(async api => { await api.detalle({ ms: 30000, lines: ['En modo rápido no se espera.'] }); }));
  ok(Date.now() - t0 < 1500 && !(await G(() => __game.state().detalle)), 'modo rápido: instantáneo y cerrado');
  await G(() => __game.skipText(false));
  // guardar/cargar con el inserto abierto
  await G(() => __game.save(2));
  page.evaluate(() => __game.game.runScript(async api => { await api.detalle({ ms: 60000 }); }, { blocking: false })).catch(() => {});
  await page.waitForTimeout(300);
  await G(() => __game.load(2));
  ok(!(await G(() => __game.state().detalle)), 'cargar partida retira el plano detalle');

  // ---------------------------------------------------------------- registro del kit
  const reg = await G(async (base) => { const K = await import(base + 'content/lib/kit.js'); K.registro.reset(); __game.game.paintRoom(); return { items: K.registro.items.map(i => i.tipo + ':' + i.texto), mal: K.registro.problemas }; }, base);
  ok(reg.items.some(i => /placa:DIRECCIÓN/.test(i)) && !reg.items.some(i => /PAJARERA/i.test(i)), `placa de la sala «pajarera» = «DIRECCIÓN» (${reg.items.filter(i => i.startsWith('placa')).join(', ')})`);
  ok(!reg.mal.length, 'todos los textos del kit caben enteros' + (reg.mal.length ? ': ' + reg.mal.join(' | ') : ''));
  await shot(page, 'demo-final');
  await ctx.close();

  // ---------------------------------------------------------------- táctil: filas de 14 px y pulsación larga
  console.log('\nTáctil (iPhone)\n');
  const T = await open({ viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
  const geo = await T.G(async () => { const ui = await import('./engine/ui.js'); return ui.optGeom(__game.game); });
  ok(geo.big && geo.h >= 14, `filas de diálogo al tacto: ${geo.h} px (${geo.n} visibles)`);
  T.page.evaluate(() => __game.game.runScript(async api => { await api.choose(['Primera opción', 'Segunda opción', 'Tercera', 'Cuarta', 'Quinta', 'Sexta']); })).catch(() => {});
  await T.page.waitForTimeout(300);
  const o2 = await T.G(() => __game.optionPos(1));
  await T.page.touchscreen.tap(o2.x, o2.y + 5);       // 5 px (de pantalla) por debajo del centro: sigue dentro de la fila
  await T.G(() => __game.waitIdle());
  ok(!(await T.G(() => __game.state().dialog)), 'tocar una fila de 14 px elige la opción');
  await T.page.screenshot({ path: path.join(shots, 'motor-tactil.png') });
  // pulsación larga en zona vacía = ver hotspots
  const empty = await T.G(() => __game.roomPointToClient(20, 136));
  const cdp = await T.ctx.newCDPSession(T.page);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: empty.x, y: empty.y }] });
  await T.page.waitForTimeout(800);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  ok(await T.G(() => __game.state().hotspotsShown), 'pulsación larga en una zona vacía: «ver hotspots»');
  await T.ctx.close();

  // ---------------------------------------------------------------- en el juego real
  console.log('\nEn el juego real\n');
  const R = await open();
  const rooms = ['vestibulo', 'pecera', 'office', 'catacumba', 'pajarera', 'sala_amazonas', 'ecosistema', 'eventos', 'administracion', 'cpd'];
  const per = [];
  for (const r of rooms) {
    await R.G((r) => __game.gotoRoom(r), r);
    const l = await R.G(() => __game.showHotspots());
    per.push(`${r} ${l.length}`);
    if (r === 'pecera' || r === 'sala_amazonas') await R.page.screenshot({ path: path.join(shots, `motor-ver-hotspots-${r}.png`) });
  }
  ok(per.every(p => +p.split(' ')[1] > 3), '«ver hotspots» en las 10 salas: ' + per.join(' · '));
  await R.G(async () => { __game.setFlag('reunion_terminada', false); __game.setFlag('acto_3_iniciado', false); await __game.gotoRoom('sala_amazonas'); });
  await R.page.waitForTimeout(300);
  await R.page.screenshot({ path: path.join(shots, 'motor-sala-gervasio-sentado.png') });
  ok((await R.G(() => __game.state().poses)).gervasio_acta === 'sentado', 'Sala Amazonas (Actos I-II): Gervasio preside SENTADO en la cabecera');
  await R.ctx.close();
} catch (e) {
  failures++;
  console.log('\n  ✗ ' + (e && e.stack || e));
}
if (consoleErrors.length) { failures++; console.log('\nErrores de consola:\n  ' + consoleErrors.join('\n  ')); }
console.log(failures ? `\nMOTOR: ${failures} FALLOS (${checks} comprobaciones)` : `\nMOTOR: OK (${checks} comprobaciones)`);
await browser.close();
server.close();
process.exit(failures ? 1 : 0);
