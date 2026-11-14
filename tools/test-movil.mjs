#!/usr/bin/env node
// PRUEBA DEL MÓVIL DE BRUNO (objeto `solo: true`, content/lib/movil.js): con RATÓN y DEDO de verdad (Playwright).
//   1. Verbo «Usar» + clic en el icono del móvil → se abre su menú ya (sin «Usar móvil con…»)
//   2. Sin verbo, clic en el icono → igual
//   3. «Usar móvil con Bruno» (el gesto natural: el verbo, el icono… y clic en Bruno) → igual
//   4. Clic derecho en el icono → igual
//   5. Táctil (iPhone en horizontal): doble toque en el icono → se abre y el segundo toque NO elige nada por accidente
//   6. Correo: leer uno marca solo `movil_leidos`; ningún otro flag cambia; «Volver», Esc y un toque en la sala cierran
//   7. «Llamar a la abuela» → la pista de siempre (abuela_llamadas + 1, acaba en «Abrígate.»)
//   8. Usar móvil CON otra cosa: sigue la negativa de siempre; la libreta también se abre sola
//   9. Guardar/cargar con el móvil abierto: nunca queda la entrada bloqueada
//   node tools/test-movil.mjs
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from './serve.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const server = createServer(path.resolve(here, '..'));
await new Promise(r => server.listen(0, r));
const base = `http://localhost:${server.address().port}/`;
const browser = await chromium.launch();
let fails = 0;
const ok = (c, m) => { console.log(`  ${c ? '✓' : '✗'} ${m}`); if (!c) fails++; };
const errors = [];

async function open(opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 960, height: 600 }, ...opts });
  const page = await ctx.newPage();
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  await page.goto(base);
  await page.waitForFunction(() => !!window.__game);
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) { /* */ } });
  const G = (fn, a) => page.evaluate(fn, a);
  await G(() => __game.skipText(true));
  await G(() => __game.newGame());
  await G(() => __game.waitIdle());
  await G(() => __game.gotoRoom('pecera'));
  await G(() => __game.skipText(false));
  return { page, ctx, G };
}
const wait = (ms) => new Promise(r => setTimeout(r, ms));
async function waitFor(G, fn, ms = 4000) { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await G(fn)) return true; await wait(60); } return false; }
const menuAbierto = (G) => waitFor(G, () => { const s = __game.state(); return !!(s.phone && s.phone.mode === 'app' && s.dialog && s.dialog[0] === 'Llamar a la abuela'); });
async function guardar(T) {
  // Esc = «Guardar el móvil»
  await wait(300);
  await T.page.keyboard.press('Escape');
  return waitFor(T.G, () => !__game.state().phone && !__game.state().dialog && !__game.state().busy);
}
const clic = async (T, p, o = {}) => { await T.page.mouse.click(p.x, p.y, o); };

try {
  console.log('Ratón (escritorio)');
  const T = await open();
  const icono = await T.G(() => __game.invPos('movil'));
  // 1. Usar + icono
  await clic(T, await T.G(() => __game.verbPos('usar')));
  await clic(T, icono);
  ok(await menuAbierto(T.G), '1. Usar + clic en el móvil → menú del móvil, sin «con…»');
  ok(await T.G(() => !/ con\b/.test(__game.state().sentence || '')), '   la línea de frase no se queda en «Usar móvil con»');
  ok(await guardar(T), '   Esc lo guarda');
  // 2. sin verbo
  await clic(T, icono);
  ok(await menuAbierto(T.G), '2. Clic en el icono sin verbo → menú');
  // un toque en la sala (fuera del móvil y del panel) lo cierra
  await wait(300);                                                 // (los toques de los primeros 250 ms no cuentan)
  const s = await T.G(() => __game.state().phone.side);
  await clic(T, await T.G((side) => __game.virtualToClient(side === 'right' ? 40 : 280, 60), s));
  ok(await waitFor(T.G, () => !__game.state().phone && !__game.state().dialog), '   un clic en la sala lo guarda');
  // 3. Usar móvil con Bruno: verbo «Usar», el icono... y Bruno. Con `solo`, el icono ya actúa; probamos también el camino
  //    «Dar»→no: el gesto «con Bruno» lo forzamos dejando el móvil elegido como objeto (ui.item) y haciendo clic en Bruno
  await T.G(() => { const g = __game.game; g.ui.verb = 'usar'; g.ui.item = 'movil'; });
  const bruno = await T.G(() => { const g = __game.game, p = g.player, b = g.actorBox(p); return __game.roomPointToClient(b.x + b.w / 2, b.y + b.h / 2); });
  await clic(T, bruno);
  ok(await menuAbierto(T.G), '3. «Usar móvil con Bruno» → menú (antes: «No le hago fotos…»)');
  ok(await T.G(() => !__game.log.some(l => l.text.startsWith('No le hago fotos'))), '   sin la negativa de las fotos');
  await guardar(T);
  // 4. clic derecho
  await clic(T, icono, { button: 'right' });
  ok(await menuAbierto(T.G), '4. Clic derecho en el icono → menú');
  // 6. correo
  const antes = await T.G(() => ({ ...__game.state().flags }));
  const iCorreo = await T.G(() => __game.state().dialog.findIndex(o => o.startsWith('Correo')));
  await wait(300);
  await clic(T, await T.G((i) => __game.optionPos(i), iCorreo));
  ok(await waitFor(T.G, () => { const s = __game.state(); return s.phone && /^Correo/.test(s.phone.title || '') && s.dialog && s.dialog.some(o => o.includes('Eventos')); }), '6. «Correo» → bandeja con los correos fijos');
  // B7: la cabecera del correo (negrita) cabe entera en la pantalla del móvil (sw 86 - 6): sin «sin le» cortado
  const cab = await T.G(async () => { const f = await import('./engine/font.js'); const t = __game.state().phone.title; return { t, w: f.measure(t, { bold: true }) }; });
  ok(cab.w <= 80 && !/…$/.test(cab.t), `   cabecera del correo «${cab.t}» cabe entera (${cab.w} px ≤ 80)`);
  await T.G(() => __game.clearLog());
  const iEv = await T.G(() => __game.state().dialog.findIndex(o => o.includes('Eventos')));
  await wait(300);
  await clic(T, await T.G((i) => __game.optionPos(i), iEv));
  await T.G(() => __game.skipText(true));
  ok(await waitFor(T.G, () => __game.log.some(l => l.text === 'Recordatorio: la presentación empieza en 5 minutos.')), '   se lee el correo de Eventos (texto entero, en un globo junto al móvil)');
  await waitFor(T.G, () => !!__game.state().dialog);
  const despues = await T.G(() => ({ ...__game.state().flags }));
  const cambiados = Object.keys({ ...antes, ...despues }).filter(k => JSON.stringify(antes[k]) !== JSON.stringify(despues[k]));
  ok(cambiados.length === 1 && cambiados[0] === 'movil_leidos', `   leer solo cambia movil_leidos (cambiados: ${cambiados.join(', ') || 'ninguno'})`);
  ok(await T.G(() => __game.state().dialog[__game.state().dialog.length - 1] === 'Volver'), '   la bandeja acaba en «Volver»');
  await T.G(() => __game.chooseText('Volver'));
  await waitFor(T.G, () => !!__game.state().dialog && __game.state().dialog[0] === 'Llamar a la abuela');
  // 7. la abuela
  const n0 = await T.G(() => __game.state().flags.abuela_llamadas || 0);
  await T.G(() => __game.chooseText('Llamar a la abuela'));
  await T.G(() => __game.waitIdle());
  ok(await T.G((n0) => (__game.state().flags.abuela_llamadas || 0) === n0 + 1 && __game.log.some(l => l.who === 'abuela_remedios' && l.text === 'Abrígate.'), n0), '7. «Llamar a la abuela» → la pista de siempre (… «Abrígate.»)');
  ok(await T.G(() => !__game.state().phone && !__game.state().busy), '   y el móvil se retira');
  // 8. usar móvil con otra cosa
  await T.G(() => __game.clearLog());
  await T.G(() => __game.doVerb('usar', 'kanban', 'movil'));
  ok(await T.G(() => __game.log.some(l => l.text.startsWith('No le hago fotos'))), '8. Usar móvil con el kanban → la negativa de siempre');
  await T.G(() => __game.doVerb('usar', 'libreta_replicas'));
  ok(await T.G(() => __game.log.some(l => l.text.startsWith('Mi libreta de réplicas'))), '   la libreta se usa sola');
  await T.G(async () => { if (__game.state().dialog) await __game.chooseDialog(__game.state().dialog.length - 1); });
  // 9. cargar con el móvil abierto
  await T.G(() => __game.save('movil'));
  await T.G(() => __game.skipText(false));
  await clic(T, icono);
  await menuAbierto(T.G);
  await T.G(() => __game.load('movil'));
  ok(await waitFor(T.G, () => !__game.state().phone && !__game.state().dialog && !__game.state().busy), '9. Cargar con el móvil abierto: se retira y la entrada queda libre');
  await clic(T, icono);
  ok(await menuAbierto(T.G), '   y se vuelve a abrir sin problema');
  await guardar(T);
  await T.ctx.close();

  console.log('Táctil (iPhone en horizontal)');
  const M = await open({ viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
  const ic = await M.G(() => __game.invPos('movil'));
  await M.page.touchscreen.tap(ic.x, ic.y);
  await wait(90);
  await M.page.touchscreen.tap(ic.x, ic.y);                      // doble toque
  ok(await menuAbierto(M.G), '5. Doble toque en el icono → menú');
  await wait(500);
  ok(await M.G(() => !!__game.state().phone && (__game.state().flags.abuela_llamadas || 0) === 0), '   el segundo toque no elige ninguna opción por accidente');
  const p0 = await M.G(() => __game.optionPos(3));
  await M.page.touchscreen.tap(p0.x, p0.y);
  ok(await waitFor(M.G, () => !__game.state().phone && !__game.state().dialog), '   «Guardar el móvil» con el dedo');
  await M.ctx.close();
} catch (e) {
  fails++;
  console.log('  ✗ excepción: ' + (e && e.stack || e));
}
const errs = [...new Set(errors)];
if (errs.length) { console.log('Errores de consola:\n  ' + errs.join('\n  ')); fails += errs.length; }
console.log(fails ? `\nMÓVIL: ${fails} FALLOS` : '\nMÓVIL: OK');
await browser.close();
server.close();
process.exit(fails ? 1 : 0);
