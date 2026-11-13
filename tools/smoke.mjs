#!/usr/bin/env node
// Smoke test de FE DE ERRATAS: sirve el juego y lo recorre con Playwright (clics reales + window.__game):
// título, intro, ratón, las 10 salas por sus salidas, inventario (los 19 objetos), combinación común, pistas,
// un duelo de prueba completo (fallo, comodín, acierto, remate con objeto equivocado y correcto), derrota,
// retirada, guardar/cargar, menú de pausa, créditos (api.credits / api.ending), depuración y táctil.
// Capturas en tools/shots/. Falla si hay errores de consola. Uso: node tools/smoke.mjs
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from './serve.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const shots = path.join(here, 'shots');
fs.mkdirSync(shots, { recursive: true });

const server = createServer(root);
await new Promise(r => server.listen(0, r));
const base = `http://localhost:${server.address().port}/`;

const consoleErrors = [];
let expectErrors = false;
let failures = 0;
const ok = (cond, msg) => { if (cond) console.log('  ✓ ' + msg); else { failures++; console.log('  ✗ ' + msg); } };
const T0 = Date.now();
const step = (s) => console.log(`\n» ${s}  [${Math.round((Date.now() - T0) / 1000)} s]`);
// --rapido: se salta los encuadres de dispositivo (iPhone ×4 + escritorio/pantalla completa), la parte más lenta
const RAPIDO = process.argv.includes('--rapido');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on('console', m => { if (m.type() === 'error' && !expectErrors) consoleErrors.push(m.text()); });
page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));

const G = (fn, arg) => page.evaluate(fn, arg);
const shot = async (name) => { await page.screenshot({ path: path.join(shots, name + '.png') }); console.log('  📷 ' + name + '.png'); };
const state = () => G(() => __game.state());
const wait = (ms) => page.waitForTimeout(ms);
const fast = (on) => G(o => __game.skipText(o), on);
async function clickVirtual(x, y, button = 'left') {
  const p = await G(([x, y]) => __game.virtualToClient(x, y), [x, y]);
  await page.mouse.move(p.x, p.y); await wait(30);
  await page.mouse.click(p.x, p.y, { button });
}
async function clickClient(p, button = 'left') { await page.mouse.move(p.x, p.y); await wait(40); await page.mouse.click(p.x, p.y, { button }); }
async function waitFor(fn, arg, timeout = 15000) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeout) { if (await G(fn, arg)) return true; await wait(50); }
  return false;
}
async function chooseText(substr) {
  const r = await G(s => __game.chooseText(s), substr);
  if (r === false) throw new Error(`Opción no encontrada: "${substr}" en ${JSON.stringify(await G(() => __game.currentDialogOptions()))}`);
}

const ROUTE = [
  ['torno', 'pecera'], ['pecera_a_office', 'office'], ['office_a_pecera', 'pecera'], ['pecera_a_catacumba', 'catacumba'],
  ['catacumba_a_pecera', 'pecera'], ['pecera_a_pajarera', 'pajarera'], ['puerta_sala', 'sala_amazonas'], ['sala_a_pajarera', 'pajarera'],
  ['pajarera_a_pecera', 'pecera'], ['pecera_a_ecosistema', 'ecosistema'], ['ecosistema_a_eventos', 'eventos'],
  ['eventos_a_ecosistema', 'ecosistema'], ['ecosistema_a_administracion', 'administracion'],
  ['administracion_a_ecosistema', 'ecosistema'], ['ecosistema_a_pecera', 'pecera'], ['pecera_a_vestibulo', 'vestibulo'],
  ['ascensor_vestibulo', 'cpd', 'Planta -1'], ['ascensor_cpd', 'pecera', 'Planta 1'], ['ascensor_pecera', 'ecosistema', 'Planta 2'],
  ['ascensor_ecosistema', 'vestibulo', 'Planta 0'],
];

// test duel: uses Celestino (in the vestíbulo) and test data (deck R05, R03 + a finisher that wants manual_fax)
const TEST_DUEL = `({
  id: 'prueba', actor: 'celestino', from: 'Celestino', subject: 'Prueba del módulo de duelo (no es de la biblia)',
  assigned: 'B. Pellizco', deck: ['R05', 'R03'],
  intro: ['Te lo pongo por escrito.'], hurt: ['¡Uy!'], taunt: ['¡Ja!'], defeatLines: ['Asignado a ti.'],
  finishers: [{ atScore: 2, text: 'Esto está cerrado y no tiene respuesta.', object: 'manual_fax', wrongObject: { movil: 'Ese no.' },
    script: async (api, d) => { await api.say('Página 9: respuesta automática.'); } }],
  onWin: async (api) => { api.setFlag('cpd_prueba', true); },
})`;

try {
  // ---------------------------------------------------------------- title
  step('Pantalla de título');
  await page.goto(base);
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) { /* ignore */ } });
  await page.reload();
  await waitFor(() => !!window.__game);
  await wait(800);
  await shot('01-titulo');
  ok((await state()).mode === 'title', 'arranca en el título');

  // ---------------------------------------------------------------- new game with a real click
  step('Nueva partida (clic real); la intro se salta con Esc');
  const item = await G(() => { const it = __game.game.titleLayout[0]; return __game.virtualToClient(it.x + 8, it.y + 6); });
  await clickClient(item);
  await waitFor(() => __game.state().mode === 'play' && __game.state().cutscene);
  await wait(900);
  await shot('02-intro');
  await page.keyboard.press('Escape');
  ok(await waitFor(() => !__game.state().busy), 'la intro se puede saltar con Esc');
  const s0 = await state();
  ok(s0.room === 'vestibulo', 'empieza en el vestíbulo');
  ok(s0.flags.intro_vista === true, 'flag intro_vista');
  ok(['tarjeta_becario', 'libreta_replicas', 'movil'].every(i => s0.inventory.includes(i)), 'inventario inicial: tarjeta, libreta, móvil');
  ok(s0.music === 'm_vestibulo', 'la sala pide su música m_vestibulo (silencio si no existe)');

  step('Ratón: caminar y pasar por encima de Celestino');
  const before = (await state()).player;
  await clickVirtual(90, 130);
  await wait(1600);
  const after = (await state()).player;
  ok(Math.abs(after.x - before.x) > 20, `el jugador camina (${before.x},${before.y}) → (${after.x},${after.y})`);
  const cp = await G(() => __game.screenPos('celestino'));
  await page.mouse.move(cp.x, cp.y); await wait(150);
  ok((await state()).sentence === 'Ir a Celestino', 'frase «Ir a Celestino» al pasar el ratón');
  await shot('03-vestibulo-hover');

  step('Ratón: Abrir + clic en el organigrama (respuesta por defecto §8.2: rotan EN ORDEN, sin handler propio)');
  await clickClient(await G(() => __game.verbPos('abrir')));
  await clickClient(await G(() => __game.screenPos('organigrama')));
  ok(await waitFor(() => __game.state().speaking.length > 0), 'Bruno habla');
  await wait(400);
  await shot('04-texto-hablado');
  await fast(true); await G(() => __game.waitIdle());
  const DEF_ABRIR = await G(() => ['No se abre. Lo apunto como «acceso restringido». Suena a ascenso.', 'Cerrado. Hay una pegatina: «No forzar». Me ha convencido.']);
  ok(await G(t => __game.log.some(l => l.who === 'bruno' && l.text === t), DEF_ABRIR[0]), 'primera respuesta por defecto de Abrir (organigrama)');
  await G(() => __game.doVerb('abrir', 'logo_pared'));
  ok(await G(t => __game.log.some(l => l.who === 'bruno' && l.text === t), DEF_ABRIR[1]), 'Abrir el logo rota a la 2.ª respuesta por defecto');
  await G(() => __game.doVerb('mirar', 'bruno'));
  ok(await G(() => __game.log.some(l => l.text.startsWith('Soy yo. Joven'))), 'Mirar a Bruno (cuarta pared §8.6)');

  // ---------------------------------------------------------------- the 10 rooms
  step('Recorrido por las 10 salas por sus salidas (juego real)');
  await G(() => __game.doVerb('ir', 'torno'));
  ok((await state()).room === 'vestibulo', 'el torno está cerrado sin torno_abierto (P01)');
  await G(() => __game.setFlag('torno_abierto', true));
  await G(() => __game.clearLog());
  await G(() => __game.doVerb('ir', 'torno'));
  let st7 = await state();
  ok(st7.room === 'pecera' && st7.flags.inigo_presentado === true, 'primera entrada en la Pecera con torno_abierto: escena 7.2 → inigo_presentado');
  ok(await G(() => __game.log.some(l => l.who === 'inigo_sinergia')), 'en la 7.2 habla Íñigo');
  await G(() => __game.doVerb('ir', 'pecera_a_vestibulo'));
  await G(() => __game.clearLog());
  await G(() => __game.doVerb('ir', 'torno'));
  ok(!(await G(() => __game.log.some(l => l.who === 'inigo_sinergia' && /Optimal Brains/.test(l.text)))), 'la 7.2 no se repite en la segunda entrada');
  const seen = new Set(['vestibulo', 'pecera']);
  for (const [exit, room, floor] of ROUTE.slice(1)) {
    await G(e => __game.doVerb('ir', e), exit);
    if (floor) {                                   // el ascensor abre su botonera: la planta actual sale en gris
      const opts = await G(() => __game.currentDialogOptions());
      ok(!!opts && opts.some(o => o.endsWith('(aquí)')) && opts.some(o => o.startsWith('Nada, me quedo')), `botonera del ${exit}: plantas, la actual en gris y «quedarse»`);
      await chooseText(floor);
      await G(() => __game.waitIdle());
    }
    const st = await state();
    ok(st.room === room, `${exit} → ${room}`);
    if (!seen.has(room)) {
      seen.add(room);
      ok(st.music === 'm_' + room, `música pedida m_${room}`);
      await fast(false); await wait(250);
      await shot('sala-' + room);
      await fast(true);
    }
  }
  ok(seen.size === 10, 'visitadas las 10 salas: ' + [...seen].join(', '));

  // ---------------------------------------------------------------- geografía del edificio (docs/CONTENT_SCHEMA.md §2.6)
  step('Geografía: plantas, escaleras, ascensor y entradas coherentes');
  const geo = await G(() => {
    const rooms = __game.game.content.rooms;
    const PLANTA = { cpd: -1, vestibulo: 0, pecera: 1, office: 1, catacumba: 1, pajarera: 1, sala_amazonas: 1, ecosistema: 2, eventos: 2, administracion: 2 };
    const bad = [];
    for (const [rid, r] of Object.entries(rooms)) for (const o of r.objects || []) {
      if (o.ascensor && o.ascensor.planta !== PLANTA[rid]) bad.push(`${rid}.${o.id}: ascensor dice planta ${o.ascensor.planta}, la sala está en la ${PLANTA[rid]}`);
      if (!o.exit) continue;
      const a = PLANTA[rid], b = PLANTA[o.exit.room];
      const nombre = typeof o.name === 'function' ? '' : String(o.name || '');
      if (a !== b && !(/escalera/i.test(nombre) || o.id === 'torno')) bad.push(`${rid}.${o.id} → ${o.exit.room}: cambia de planta (${a} → ${b}) y no es una escalera («${nombre}»)`);
      if (Math.abs(a - b) > 1) bad.push(`${rid}.${o.id}: salta de la planta ${a} a la ${b}`);
    }
    const ep = rooms.pecera.entries.vestibulo, ev = rooms.vestibulo.entries.pecera;
    const ex = rooms.pecera.layout.pecera_a_vestibulo, er = rooms.vestibulo.layout.vestibulo_a_redaccion;
    return { bad, ep, ev, exX: ex.rect || ex.poly, erX: er.rect || er.poly, pname: rooms.pecera.objects.find(o => o.id === 'pecera_a_vestibulo').name };
  });
  ok(!geo.bad.length, 'cada salida entre plantas es una escalera (o el torno + escalera) y cada ascensor marca su planta' + (geo.bad.length ? ': ' + geo.bad.join(' · ') : ''));
  ok(/escalera/i.test(geo.pname), `la salida de la Redacción (planta 1) al vestíbulo (planta 0) es una escalera que baja («${geo.pname}»)`);
  ok(geo.ep[0] <= geo.exX[0] + geo.exX[2] + 10, `llegando del vestíbulo se aparece arriba de esa escalera (x=${geo.ep[0]})`);
  ok(geo.ev[0] >= 234 && Math.abs(geo.ev[0] - (geo.erX[0] + geo.erX[2] / 2)) < 30, `llegando de la Redacción se aparece al pie de la escalera «REDAC. 1», detrás de los tornos (x=${geo.ev[0]})`);
  // orden de dirección 2: la Redacción de papel, AL LADO de la Redacción (puerta doble, mismo nivel), sin pasar por el
  // Vending; el Vending solo tiene la puerta a la Redacción
  const vecinos = await G(() => { const R = __game.game.content.rooms; const ex = (r) => (R[r].objects || []).filter(o => o.exit).map(o => o.exit.room).sort(); return { cat: ex('catacumba'), off: ex('office'), pec: ex('pecera') }; });
  ok(JSON.stringify(vecinos.cat) === '["pecera"]' && JSON.stringify(vecinos.off) === '["pecera"]' && vecinos.pec.includes('catacumba'),
    `la Redacción de papel sale solo a la Redacción y el Vending solo a la Redacción (catacumba → ${vecinos.cat}; office → ${vecinos.off})`);
  await G(() => __game.gotoRoom('pecera', 'vestibulo')); await G(() => __game.waitIdle());
  await G(() => __game.doVerb('ir', 'pecera_a_vestibulo'));
  const llegaV = await state();
  ok(llegaV.room === 'vestibulo' && llegaV.player.x >= 234, `bajando desde la Pecera se llega al vestíbulo interior, detrás de los tornos (x=${Math.round(llegaV.player.x)})`);
  await G(() => __game.doVerb('ir', 'vestibulo_a_redaccion'));
  const llegaP = await state();
  ok(llegaP.room === 'pecera' && llegaP.player.x < 70, `subiendo «REDAC. 1» se llega a la Pecera arriba de la escalera de bajada (x=${Math.round(llegaP.player.x)})`);
  // partidas de antes del rediseño (v1): PNJ con las posiciones viejas y el jugador fuera del suelo → al cargar, cada PNJ a
  // su sitio nuevo y el jugador al suelo más cercano (engine/core.js migrarPosiciones / anclarJugador)
  const vieja = await G(async () => {
    const g = __game.game;
    await __game.gotoRoom('pecera', 'vestibulo'); await __game.waitIdle();
    g.syncState();
    const st = JSON.parse(JSON.stringify(g.state));
    st.actors.yoli_tendencias = { ...st.actors.yoli_tendencias, room: 'pecera', x: 309, y: 116 };     // sitio de la sala de 800 px
    st.actors.valentin_reticula = { ...st.actors.valentin_reticula, room: 'pecera', x: 780, y: 97, pose: 'sentado' };
    st.actors.bruno = { ...st.actors.bruno, room: 'pecera', x: 330, y: 92 };                          // dentro de una mesa / la pared
    localStorage.setItem(g.slotKey('vieja'), JSON.stringify({ v: 1, date: Date.now(), roomName: 'La Pecera', state: st }));
    await __game.load('vieja'); await __game.waitIdle();
    const A = g.actors, L = g.content.rooms.pecera.layout, P = g.player;
    return { yoli: [A.yoli_tendencias.x, A.yoli_tendencias.y], yoliAt: L.yoli_tendencias.at, val: [A.valentin_reticula.x, A.valentin_reticula.y, A.valentin_reticula.pose || null],
      valAt: L.valentin_reticula.at, p: [Math.round(P.x), Math.round(P.y)], dentro: g.room.walk.inside(P.x, P.y) };
  });
  ok(vieja.yoli[0] === vieja.yoliAt[0] && vieja.val[0] === vieja.valAt[0] && !vieja.val[2], `partida vieja: los PNJ vuelven a su sitio nuevo (Yoli ${vieja.yoli}, Valentín ${vieja.val})`);
  ok(vieja.dentro, `partida vieja: el jugador fuera del suelo vuelve al suelo (${vieja.p})`);
  const presence = await G(async () => {
    await __game.gotoRoom('pajarera'); const a = __game.objects().filter(o => o.kind === 'actor').map(o => o.id);
    __game.setFlag('acto_3_iniciado', true);
    await __game.gotoRoom('sala_amazonas'); const b = __game.objects().filter(o => o.kind === 'actor').map(o => o.id);
    __game.setFlag('acto_3_iniciado', false);
    await __game.gotoRoom('vestibulo');
    return { a, b };
  });
  ok(presence.a.includes('inigo_sinergia') && presence.a.includes('lector_medio'), 'Pajarera (Actos I-II): Íñigo y el Lector Medio');
  ok(presence.b.includes('inigo_sinergia') && presence.b.includes('lector_medio') && presence.b.includes('gervasio_acta'), 'Sala Amazonas (Acto III, `when`): Íñigo, Lector Medio y Gervasio');
  await G(() => __game.newGame());          // partida limpia (modo rápido) para el resto de pruebas

  // ---------------------------------------------------------------- inventory
  step('Inventario: los 19 objetos (18 de la biblia + boli_muerto; give-all de depuración)');
  const inv = await G(() => __game.giveAll());
  ok(inv.length === 19, `19 objetos en el inventario (${inv.length})`);
  await fast(false);
  await clickClient(await G(() => __game.verbPos('mirar')));
  await clickClient(await G(() => __game.invPos('tarjeta_becario')));
  await waitFor(() => __game.state().speaking.length > 0);
  await wait(300);
  const ip = await G(() => __game.invPos('ficha_pagina_7'));
  await page.mouse.move(ip.x, ip.y); await wait(150);
  await shot('05-inventario');
  await fast(true); await G(() => __game.waitIdle());
  // contact sheet of all 19 icons (each item's icon at 1:1, shown ×4)
  await G(() => {
    const g0 = __game.game, items = g0.content.items, ids = Object.keys(items);
    const c = document.createElement('canvas'); c.id = 'iconsheet';
    const cols = 6, cw = 52, ch = 34;
    c.width = cols * cw; c.height = Math.ceil(ids.length / cols) * ch;
    const g = c.getContext('2d'); g.fillStyle = '#121022'; g.fillRect(0, 0, c.width, c.height);
    ids.forEach((id, i) => {
      const x = (i % cols) * cw + 12, y = Math.floor(i / cols) * ch + 2;
      g.fillStyle = '#15122a'; g.fillRect(x - 3, y, 34, 21);
      g.save(); g.translate(x, y + 1); items[id].icon(g, 0, 0, g0.viewFor(), ''); g.restore();
      g.fillStyle = '#9a98b8'; g.font = '7px monospace'; g.fillText(id.slice(0, 12), x - 10, y + 30);
    });
    c.style.cssText = 'position:fixed;left:0;top:0;width:' + c.width * 4 + 'px;height:' + c.height * 4 + 'px;image-rendering:pixelated;z-index:9;background:#000';
    document.body.appendChild(c);
  });
  await page.locator('#iconsheet').screenshot({ path: path.join(shots, '06-iconos.png') }); console.log('  📷 06-iconos.png');
  await G(() => document.getElementById('iconsheet').remove());
  for (const id of await G(() => Object.keys(__game.game.content.items))) await G(i => __game.doVerb('mirar', i), id);
  ok(await G(() => __game.state().flags.vio_borde_perforado === true), 'Mirar mensaje_fp pone vio_borde_perforado');

  step('Combinación común: Usar chicle con tarjeta_becario (P01b)');
  await G(() => __game.doVerb('usar', 'tarjeta_becario', 'chicle'));
  const sc = await state();
  ok(sc.flags.tarjeta_con_chicle === true && !sc.inventory.includes('chicle'), 'tarjeta_con_chicle y el chicle se gasta');
  await G(() => __game.doVerb('usar', 'cafe', 'sobre_azucar'));
  ok((await state()).inventory.includes('sobre_azucar'), 'combinación tonta: no se gasta nada');

  step('Pistas: Usar móvil (§5.6) → menú del móvil → «Llamar a la abuela»');
  await G(() => __game.doVerb('usar', 'movil'));
  ok(await G(() => !!__game.state().dialog && __game.state().dialog[0] === 'Llamar a la abuela'), 'Usar móvil abre su menú (sin «con…»)');
  await G(() => __game.chooseText('Llamar a la abuela'));
  const sp = await state();
  ok(sp.flags.abuela_llamadas === 1, 'abuela_llamadas = 1');
  ok(await G(() => __game.log.some(l => l.who === 'abuela_remedios' && l.text.startsWith('En el pueblo'))), 'primera pista: sin torno_abierto');
  ok(await G(() => __game.log.some(l => l.who === 'abuela_remedios' && l.text === 'Abrígate.')), 'acaba con «Abrígate.»');

  // ---------------------------------------------------------------- duel
  step('Duelo de prueba (datos de prueba, no de la biblia)');
  await G(() => __game.gotoRoom('vestibulo'));
  await G(async () => { const a = __game.game.condApi(); a.learnReply('rep_05'); a.learnReply('rep_03'); a.learnReply('rep_03'); });
  const st1 = await state();
  ok(st1.flags.rep_05 && st1.flags.rep_03, 'learnReply pone los flags rep_05 y rep_03');
  ok(await G(() => __game.log.filter(l => l.who === 'aviso' && l.text === 'Réplica apuntada en la libreta.').length === 2), 'aviso «Réplica apuntada» solo la primera vez de cada una');
  await fast(false);
  G(code => __game.game.runScript(api => api.duel(eval(code)), { label: 'duelo de prueba' }), TEST_DUEL);
  ok(await waitFor(() => __game.state().duel && __game.state().dialog), 'se abre el duelo con opciones');
  let d = (await state()).duel;
  ok(d.attack === 'R05' && d.correctIndex === 1, 'primer ataque del mazo: R05; su réplica es la 2.ª opción (orden de número)');
  const opts = (await state()).dialog;
  ok(opts.length === 2 + 5 + 1, `menú = 2 réplicas + 5 flojas (3 de la biblia + 2 de la adenda) + comodín (${opts.length})`);
  await wait(200);
  await shot('07-duelo');
  await fast(true);
  await chooseText('Te lo miro y te digo');                         // weak → miss
  await waitFor(() => __game.state().dialog);
  d = (await state()).duel;
  ok(d.misses === 1 && d.subject.startsWith('RE: RE: ') && d.attack === 'R03', 'floja = fallo: +RE: y el ataque fallado va al final (ahora R03)');
  await chooseText('Enviado desde mi móvil');                         // comodín: no change
  await waitFor(() => __game.state().dialog);
  d = (await state()).duel;
  ok(d.misses === 1 && d.hits === 0 && d.attack === 'R03', 'comodín: ni suma ni resta, repite el ataque');
  await G(() => __game.chooseDialog(__game.state().duel.correctIndex));   // R03 ok
  await waitFor(() => __game.state().dialog);
  await G(() => __game.chooseDialog(__game.state().duel.correctIndex));   // R05 ok → finisher
  await waitFor(() => __game.state().dialog);
  d = (await state()).duel;
  const fs1 = await state();
  ok(d.phase === 'finisher' && d.hits === 2, 'a 2 puntos llega el REMATE');
  ok(fs1.dialogDisabled.length === 2 && fs1.dialog.includes('[Usar objeto]') && fs1.dialog.includes('[Retirarse del hilo]'), 'réplicas en gris + [Usar objeto] + [Retirarse del hilo]');
  await fast(false); await wait(150); await shot('08-duelo-remate'); await fast(true);
  await chooseText('[Usar objeto]');
  ok(await waitFor(() => __game.state().pickItem), 'se abre el selector de objetos');
  await fast(false); await wait(150);
  const mp = await G(() => __game.invPos('manual_fax'));
  await page.mouse.move(mp.x, mp.y); await wait(120);
  await shot('09-duelo-objeto'); await fast(true);
  await G(() => __game.chooseItem('movil'));                         // wrong object: line, no miss
  await waitFor(() => __game.state().dialog);
  d = (await state()).duel;
  ok(d.misses === 1 && await G(() => __game.log.some(l => l.text === 'Ese no.')), 'objeto equivocado: su línea y NO cuenta como fallo');
  await chooseText('[Usar objeto]');
  await waitFor(() => __game.state().pickItem);
  await G(() => __game.chooseItem('manual_fax'));
  await G(() => __game.waitIdle());
  const sw = await state();
  ok(sw.lastDuel && sw.lastDuel.result === 'won', 'objeto correcto: duelo ganado');
  ok(sw.flags['duel:prueba:won'] === true && sw.flags.cpd_prueba === true, 'flags de resultado (duel:prueba:won + script de victoria)');

  step('Duelo de prueba: derrota a 3 fallos y retirada');
  G(code => __game.game.runScript(api => api.duel(eval(code)), { label: 'duelo de prueba 2' }), TEST_DUEL.replace("id: 'prueba'", "id: 'prueba2'"));
  for (let i = 0; i < 3; i++) { await waitFor(() => __game.state().dialog); await chooseText('Te lo miro y te digo'); }
  await G(() => __game.waitIdle());
  const sl = await state();
  ok(sl.lastDuel.result === 'lost' && !sl.flags['duel:prueba2:won'], 'tres fallos = derrota sin castigo');
  ok(await G(() => __game.log.some(l => l.who === 'narrador' && l.text.includes('Lo que diga Gervasio.'))), 'RESPUESTA AUTOMÁTICA DE DIRECCIÓN: «Lo que diga Gervasio.»');
  G(code => __game.game.runScript(api => api.duel(eval(code)), { label: 'duelo de prueba 3' }), TEST_DUEL.replace("id: 'prueba'", "id: 'prueba3'"));
  for (let i = 0; i < 2; i++) { await waitFor(() => __game.state().dialog); await G(() => __game.chooseDialog(__game.state().duel.correctIndex)); }
  await waitFor(() => __game.state().dialog);
  await chooseText('[Retirarse del hilo]');
  await G(() => __game.waitIdle());
  ok((await state()).lastDuel.result === 'retired', '[Retirarse del hilo] = derrota sin castigo');

  // ---------------------------------------------------------------- adenda: datos comunes
  step('Adenda: flojas nuevas, R15/R16, hurt por pareja, cameo de Tadeo, off del coro (duelo con id `inigo`)');
  await G(() => { for (const f of ['rep_01', 'rep_05', 'rep_15', 'rep_16']) __game.setFlag(f, true); __game.clearLog(); });
  const ADU = `({ id: 'inigo', actor: 'celestino', from: 'Íñigo', subject: 'Prueba adenda (no es de la biblia)', deck: ['R05', 'R15', 'R16', 'R01'],
    winScore: 4, maxMisses: 4, intro: ['Te lo pongo por escrito.'], hurt: ['¡Uy!'], taunt: ['¡Ja!'], defeatLines: ['x'] })`;
  G(code => __game.game.runScript(api => api.duel(eval(code)), { label: 'duelo adenda' }), ADU);
  await waitFor(() => __game.state().dialog);
  { const st = await state(); ok(st.dialog.length === st.learnedReplies.length + 5 + 1, `menú del duelo: ${st.learnedReplies.length} réplicas + 5 flojas + comodín`); }
  const logHas = (t) => G(txt => __game.log.filter(l => l.text === txt).length, t);
  await chooseText('Eso es cosa de Diseño');                          // ataque R05 → floja nueva 1
  await waitFor(() => __game.state().dialog);
  ok(await logHas('CORO: ¡ESO! ¡DISEÑO!') === 1, 'floja «Diseño»: el coro grita en off la 1.ª vez');
  ok(await logHas('Diseño entrega a tiempo. No sé en qué cuadrante ponerlos.') === 1, '... y Íñigo contesta con su línea propia (answers.inigo)');
  ok((await state()).duel.attack === 'R15', 'tras el fallo el ataque va al final: ahora R15');
  await G(() => __game.chooseDialog(__game.state().duel.correctIndex));   // R15 ok
  await waitFor(() => __game.state().dialog);
  ok(await logHas('...Lo pongo en azul.') === 1, 'hurt de Íñigo al recibir R15 (duelo.js hurtByPair)');
  await G(() => __game.chooseDialog(__game.state().duel.correctIndex));   // R16 ok
  await waitFor(() => __game.state().dialog);
  ok(await logHas('Esa coma no estaba en mi framework.') === 1, 'hurt de Íñigo al recibir R16');
  await chooseText('Eso es cosa de Diseño');                          // R01 → floja 1 otra vez
  await waitFor(() => __game.state().dialog);
  ok(await logHas('CORO: ¡ESO! ¡DISEÑO!') === 1, 'el coro NO grita una segunda vez');
  await chooseText('¿Y usted cómo se encuentra');                     // R05 → floja nueva 2
  await waitFor(() => __game.state().dialog);
  ok(await logHas('Yo no tengo plaza. Tengo chófer. Es escalable.') === 1, 'floja «de salud»: contestación de Íñigo');
  for (let i = 0; i < 2; i++) { await G(() => __game.chooseDialog(__game.state().duel.correctIndex)); await waitFor(() => __game.state().dialog || !__game.state().duel); }
  await G(() => __game.waitIdle());
  ok((await state()).lastDuel.result === 'won' && (await state()).lastDuel.misses === 3, 'el duelo de prueba se gana (3 fallos de 4 permitidos)');
  ok(await G(() => __game.state().flags['once:cameo:inigo'] === undefined && !!__game.game.state.once['once:cameo:inigo']), 'cameo de Tadeo consumido (api.once)');

  step('Adenda: avisos al entrar en sala (llamadas de Evaristo, «RV:» de Tadeo)');
  await G(() => { __game.setFlag('torno_abierto', true); __game.setFlag('evaristo_llamadas', 0); __game.setFlag('tadeo_rv_n', 0); __game.clearLog(); });
  await G(() => __game.gotoRoom('office'));
  let av = await state();
  ok(av.flags.evaristo_llamadas === 1 && !av.aviso, 'L1 al entrar en una sala con torno_abierto (evaristo_llamadas = 1)');
  ok(await G(() => __game.log.some(l => l.who === 'evaristo_salvedad' && l.text === 'Una cosita. Muy pequeña. Evaristo Salvedad, Controlling.')), 'texto literal de L1');
  await G(() => __game.gotoRoom('pecera'));
  ok((await state()).flags.evaristo_llamadas === 1 && !(await state()).flags.tadeo_rv_n, 'sin condición cumplida (L2 / RV1) no sale nada');
  await G(() => { __game.setFlag('inigo_presentado', true); });
  await G(() => __game.gotoRoom('office'));
  av = await state();
  ok(av.flags.tadeo_rv_n === 1 && av.flags.evaristo_llamadas === 1, 'RV1 con inigo_presentado (una sola cosa por entrada)');
  await G(() => __game.gotoRoom('pecera'));
  ok((await state()).flags.tadeo_rv_n === 1, 'RV2 espera a gertrudis_saludada (no salta a otro)');
  await G(() => { __game.setFlag('acto_2_iniciado', true); __game.setFlag('acto_3_iniciado', true); __game.clearLog(); });
  await G(() => __game.gotoRoom('sala_amazonas'));
  ok((await state()).flags.evaristo_llamadas === 1, 'nunca en sala_amazonas con acto_3_iniciado');
  await G(() => __game.gotoRoom('office'));
  ok((await state()).flags.evaristo_llamadas === 2 && (await state()).flags.evaristo_convoco === true, 'L2 (acto_2_iniciado): pone evaristo_convoco');
  await G(() => { __game.doVerb('mirar', 'movil'); });
  ok(await G(() => __game.log.some(l => l.text.startsWith('Y 1 correos de Tadeo'))), 'Mirar móvil con tadeo_rv_n >= 1: «Y 1 correos de Tadeo...»');
  await G(() => { for (const f of ['torno_abierto', 'inigo_presentado', 'acto_2_iniciado', 'acto_3_iniciado']) __game.setFlag(f, false); __game.setFlag('evaristo_llamadas', 0); __game.setFlag('tadeo_rv_n', 0); __game.setFlag('evaristo_convoco', false); });

  step('Llamadas: primer plano del móvil (api.phone) en pista, aviso e intro; se retira siempre');
  const phoneState = () => G(() => __game.state().phone);
  if (RAPIDO) console.log('  (--rapido: se salta la parte en tiempo real)');
  else {
  await fast(false);
  await G(async () => { __game.setFlag('torno_abierto', true); __game.clearLog(); await __game.doVerb('usar', 'movil'); __game.chooseText('Llamar a la abuela'); });
  ok(await waitFor(() => !!__game.state().phone && __game.state().phone.caller === 'abuela_remedios', null, 4000), 'pista: se abre el móvil con la abuela');
  await waitFor(() => __game.state().phone && __game.state().phone.state === 'talk', null, 6000);
  await G(() => __game.waitIdle());
  ok((await phoneState()) === null, 'pista: el móvil se cierra al colgar');
  ok(await G(() => __game.log.some(l => l.who === 'aviso' && l.text === 'Cuelga: Abuela')), 'pista: cuelga');
  await G(() => { __game.setFlag('evaristo_llamadas', 0); __game.gotoRoom('office'); });
  ok(await waitFor(() => !!__game.state().phone && __game.state().phone.caller === 'evaristo_salvedad', null, 8000), 'aviso: se abre el móvil con Evaristo');
  await G(() => __game.waitIdle());
  ok((await phoneState()) === null, 'aviso: el móvil se cierra al acabar');
  await G(() => { __game.setFlag('evaristo_llamadas', 0); __game.skipText(true); __game.setFlag('torno_abierto', true); });
  await G(() => __game.gotoRoom('pecera')); await G(() => __game.gotoRoom('office'));
  ok((await phoneState()) === null, 'modo rápido: sin móvil colgado');
  await G(() => __game.skipText(false));
  }
  await G(() => { for (const f of ['torno_abierto']) __game.setFlag(f, false); __game.setFlag('evaristo_llamadas', 0); __game.setFlag('tadeo_rv_n', 0); });

  // ---------------------------------------------------------------- save / load
  step('Guardar / cargar');
  await G(() => __game.gotoRoom('catacumba'));
  await G(() => __game.save(1));
  await G(() => { __game.takeItem('cafe'); __game.setFlag('torno_abierto', true); });
  await G(() => __game.load(1));
  const sll = await state();
  ok(sll.inventory.includes('cafe') && sll.room === 'catacumba' && !sll.flags.torno_abierto, 'cargar restaura inventario, flags y sala');

  step('Menú de pausa (guardar por triplicado, dificultad, salir con «Lo hablamos»)');
  await fast(false);
  await page.keyboard.press('Escape');
  await wait(150);
  ok((await state()).menu === 'main', 'Esc abre el menú');
  await shot('10-menu-pausa');
  const saveItem = await G(() => { const it = __game.game.menu.layout.find(i => i.act === 'save'); return __game.virtualToClient(it.x + 6, it.y + 5); });
  await clickClient(saveItem); await wait(100);
  const slot = await G(() => { const it = __game.game.slotLayout.find(i => i.slot === 2); return __game.virtualToClient(it.x + 6, it.y + 5); });
  await clickClient(slot); await wait(1700);
  await shot('11-guardando-por-triplicado');
  const quit = await G(() => { const it = __game.game.menu.layout.find(i => i.act === 'quit'); return __game.virtualToClient(it.x + 6, it.y + 5); });
  await clickClient(quit); await wait(100);
  ok((await G(() => __game.game.menu && __game.game.menu.page)) === 'quit', '«Salir» pide confirmación');
  const no = await G(() => { const it = __game.game.menu.layout.find(i => i.act === 'no'); return __game.virtualToClient(it.x + 6, it.y + 5); });
  await clickClient(no); await wait(100);
  ok((await state()).mode === 'play', '«Lo hablamos» cancela');
  await page.keyboard.press('Escape');

  step('Créditos dentro de la partida (api.credits) y final (api.ending)');
  const roomBefore = (await state()).room;
  G(() => __game.game.runScript(async api => { await api.credits({ credits: [{ text: 'PRUEBA', title: true }, 'Asignado a: el smoke test', ''] }); api.setFlag('cpd_prueba', 'tras-creditos'); }, { label: 'créditos (keep)' }));
  ok(await waitFor(() => __game.state().mode === 'ending'), 'pantalla de créditos');
  await wait(2500);
  await shot('12-creditos');
  await G(() => { __game.game.ending.t = 60000; });
  ok(await waitFor(() => __game.state().mode === 'play' && __game.state().flags.cpd_prueba === 'tras-creditos', null, 8000), 'api.credits vuelve sola a la partida (el script sigue)');
  ok((await state()).room === roomBefore, 'misma sala tras los créditos');
  G(() => __game.game.runScript(api => api.ending({ credits: ['FIN de prueba'] }), { label: 'final' }));
  ok(await waitFor(() => __game.state().mode === 'ending'), 'api.ending: pantalla final');
  for (let i = 0; i < 14 && (await state()).mode === 'ending'; i++) { await clickVirtual(160, 100); await wait(400); }
  ok(await waitFor(() => __game.state().mode === 'title', null, 8000), 'api.ending vuelve al título con un clic al acabar');
  ok(await G(() => !!__game.state().finished && __game.state().finished.room === 'catacumba'), 'la partida terminada queda en state().finished');

  step('Robustez: errores de contenido no bloquean');
  expectErrors = true;
  await fast(true);                           // la intro, en modo rápido (antes se veía entera en tiempo real: 70 s)
  await G(() => __game.newGame());
  await G(() => __game.waitIdle());
  ok(await G(() => __game.doVerb('mirar', 'objeto_que_no_existe')) === false, 'doVerb con objeto inexistente devuelve false');
  await G(() => __game.game.runScript(async () => { throw new Error('fallo de prueba'); }, { label: 'prueba' }));
  ok(!(await state()).busy, 'un script que lanza excepción libera la entrada');
  expectErrors = false;
  const gameErrors = await G(() => __game.errors.filter(e => !e.warn && !/fallo de prueba|objetivo desconocido/.test(e.msg)).map(e => e.msg));
  ok(!gameErrors.length, 'sin errores de contenido: ' + (gameErrors.join(' | ') || 'ninguno'));
  const warns = await G(() => __game.errors.filter(e => e.warn).map(e => e.msg));
  ok(!warns.length, 'sin avisos de contenido: ' + (warns.join(' | ') || 'ninguno'));

  step('Modo depuración');
  await page.goto(base + '?debug=1&room=pecera');
  await waitFor(() => window.__game && __game.state().room === 'pecera');
  await G(() => { __game.skipText(true); return __game.waitIdle(); });
  await fast(false);
  await page.mouse.move(640, 300);
  await wait(300);
  await shot('13-debug');
  const fw = await G(() => { __game.game.condApi().flag('flag_inventado_de_prueba'); return __game.errors.some(e => /flag no declarado.*flag_inventado_de_prueba/.test(e.msg)); });
  ok(fw, 'en depuración, leer un flag no declarado avisa en consola');

  step('Táctil: tocar verbo y luego objeto');
  const tctx = await browser.newContext({ viewport: { width: 960, height: 600 }, hasTouch: true, isMobile: true });
  const tpage = await tctx.newPage();
  tpage.on('pageerror', e => consoleErrors.push('pageerror (táctil): ' + e.message));
  await tpage.goto(base + '?room=vestibulo');
  await tpage.waitForFunction(() => window.__game && __game.state().mode === 'play' && !__game.state().busy);
  const vp = await tpage.evaluate(() => __game.verbPos('mirar'));
  await tpage.touchscreen.tap(vp.x, vp.y);
  const wp = await tpage.evaluate(() => __game.screenPos('organigrama'));
  await tpage.touchscreen.tap(wp.x, wp.y);
  const spoke = await tpage.waitForFunction(() => __game.log.some(l => l.who === 'bruno'), null, { timeout: 8000 }).then(() => true, () => false);
  ok(spoke, 'en táctil, «Mirar» + tocar el organigrama funciona');
  await tctx.close();

  // ---------------------------------------------------------------- móvil (problema 6): iPhone vertical/horizontal,
  // instalada (standalone) o en Safari, escritorio y pantalla completa en Chromium
  step('Móvil: iPhone 13 en vertical y en horizontal, en Safari y como app instalada; escritorio; pantalla completa');
  if (RAPIDO) console.log('  (--rapido: se salta)');
  else {
  const { devices } = require('playwright');
  const IP = devices['iPhone 13'];
  const standaloneInit = () => {
    Object.defineProperty(navigator, 'standalone', { get: () => true });
    const mm = window.matchMedia.bind(window);
    window.matchMedia = (q) => (/display-mode:\s*(fullscreen|standalone)/.test(q) ? { matches: true, media: q, addEventListener() {}, removeEventListener() {} } : mm(q));
  };
  for (const [tag, orient, standalone] of [['iphone-vertical', 'portrait', false], ['iphone-horizontal', 'landscape', false], ['iphone-horizontal-app', 'landscape', true], ['iphone-vertical-app', 'portrait', true]]) {
    const vpo = orient === 'portrait' ? IP.viewport : { width: IP.viewport.height, height: IP.viewport.width };
    const ctx = await browser.newContext({ ...IP, viewport: vpo, screen: vpo });
    if (standalone) await ctx.addInitScript(standaloneInit);
    const pg = await ctx.newPage();
    pg.on('pageerror', e => consoleErrors.push(`pageerror (${tag}): ` + e.message));
    pg.on('console', m => { if (m.type() === 'error') consoleErrors.push(`(${tag}) ` + m.text()); });
    await pg.goto(base);
    await pg.waitForFunction(() => window.__game && __game.state().mode === 'title');
    await pg.waitForTimeout(500);
    const m = await pg.evaluate(() => {
      const r = document.getElementById('screen').getBoundingClientRect();
      const hint = document.getElementById('rotate-hint');
      return { w: r.width, h: r.height, left: r.left, top: r.top, iw: innerWidth, ih: innerHeight, scrollW: document.documentElement.scrollWidth, scrollH: document.documentElement.scrollHeight,
        hint: !hint.hidden, items: __game.game.titleLayout.map(i => i.label), meta: !!document.querySelector('meta[name=apple-mobile-web-app-capable]'), manifest: !!document.querySelector('link[rel=manifest]'),
        vp: document.querySelector('meta[name=viewport]').content };
    });
    ok(m.scrollW <= m.iw + 1 && m.scrollH <= m.ih + 1, `${tag}: sin desplazamiento de página (${m.scrollW}x${m.scrollH} en ${m.iw}x${m.ih})`);
    if (orient === 'landscape') ok(m.h >= m.ih * 0.97 && m.w <= m.iw, `${tag}: el lienzo llena el alto (${Math.round(m.w)}x${Math.round(m.h)} en ${m.iw}x${m.ih})`);
    else ok(m.w >= m.iw * 0.97, `${tag}: en vertical, el lienzo ocupa el ancho (${Math.round(m.w)} de ${m.iw})`);
    ok(m.hint === (orient === 'portrait'), `${tag}: pista «gira el móvil» ${orient === 'portrait' ? 'visible' : 'oculta'}`);
    ok(m.meta && m.manifest && /viewport-fit=cover/.test(m.vp), `${tag}: metas de web app, manifest y viewport-fit=cover`);
    const hasFs = m.items.some(l => /Pantalla completa/.test(l));
    ok(standalone ? !hasFs : hasFs, `${tag}: opción «Pantalla completa» en el título ${standalone ? 'oculta (ya es app)' : 'visible'}`);
    if (!standalone) {
      const it = await pg.evaluate(() => { const it = __game.game.titleLayout.find(i => /Pantalla completa/.test(i.label)); return __game.virtualToClient(it.x + 6, it.y + 5); });
      await pg.touchscreen.tap(it.x, it.y);
      await pg.waitForTimeout(300);
      ok(await pg.evaluate(() => !!__game.game.iosHelp), `${tag}: en el Safari del iPhone, «Pantalla completa» explica cómo instalarla`);
      await pg.screenshot({ path: path.join(shots, `movil-${tag}-ayuda.png`) });
      await pg.waitForTimeout(400);
      await pg.touchscreen.tap(it.x, it.y);
      ok(await pg.evaluate(() => !__game.game.iosHelp), `${tag}: el panel de ayuda se cierra con un toque`);
    }
    // a jugar: verbos y objetos con toques, objetivos táctiles de tamaño cómodo
    await pg.goto(base + '?room=vestibulo');
    await pg.waitForFunction(() => window.__game && __game.state().mode === 'play' && !__game.state().busy);
    const tgt = await pg.evaluate(() => { const r = document.getElementById('screen').getBoundingClientRect(); const k = r.height / 200; return { verbW: 50 * k, verbH: 14 * k, cellW: 34 * k, cellH: 21 * k, optH: 10 * k }; });
    if (orient === 'landscape') ok(tgt.verbW >= 44 && tgt.verbH >= 26 && tgt.cellH >= 40, `${tag}: objetivos táctiles: verbo ${Math.round(tgt.verbW)}x${Math.round(tgt.verbH)} pt, casilla ${Math.round(tgt.cellW)}x${Math.round(tgt.cellH)} pt, opción ${Math.round(tgt.optH)} pt de alto`);
    const vp2 = await pg.evaluate(() => __game.verbPos('mirar'));
    await pg.touchscreen.tap(vp2.x, vp2.y);
    const op = await pg.evaluate(() => __game.screenPos('organigrama'));
    await pg.touchscreen.tap(op.x, op.y);
    ok(await pg.waitForFunction(() => __game.log.some(l => l.who === 'bruno'), null, { timeout: 8000 }).then(() => true, () => false), `${tag}: «Mirar» + tocar el organigrama`);
    await pg.waitForTimeout(300);
    await pg.screenshot({ path: path.join(shots, `movil-${tag}.png`) });
    console.log(`  📷 movil-${tag}.png`);
    await ctx.close();
  }
  // escritorio: escala entera nítida; tecla F = pantalla completa (Fullscreen API) y otra vez para salir
  const dctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const dp = await dctx.newPage();
  await dp.goto(base);
  await dp.waitForFunction(() => window.__game && __game.state().mode === 'title');
  const dm = await dp.evaluate(() => { const c = document.getElementById('screen'); return { cw: c.width, ch: c.height, label: __game.game.titleLayout.map(i => i.label) }; });
  ok(dm.cw % 320 === 0 && dm.ch % 200 === 0, `escritorio: escala entera (${dm.cw}x${dm.ch})`);
  await dp.mouse.click(10, 10);
  await dp.keyboard.press('f');
  await dp.waitForTimeout(500);
  const fsOn = await dp.evaluate(() => !!document.fullscreenElement);
  ok(fsOn, 'escritorio (Chromium): tecla F → pantalla completa (Fullscreen API)');
  await dp.screenshot({ path: path.join(shots, 'movil-escritorio-pantalla-completa.png') });
  await dp.keyboard.press('f');
  await dp.waitForTimeout(400);
  ok(!(await dp.evaluate(() => !!document.fullscreenElement)), 'escritorio: tecla F otra vez → sale de pantalla completa');
  await dctx.close();
  }

  step('Intro: el móvil de la abuela y Esc');
  await G(() => { __game.newGame(); });
  ok(await waitFor(() => __game.state().phone && __game.state().cutscene, null, 40000), 'intro: el móvil se abre durante la llamada de la abuela');
  await G(() => __game.skipCutscene());
  await G(() => __game.waitIdle());
  ok((await phoneState()) === null, 'intro: Esc salta la cinemática y no deja el móvil');
  ok((await state()).busy === false, 'intro: entrada liberada tras saltar');
} catch (e) {
  failures++;
  console.error('\nERROR:', e);
  try { await shot('99-error'); } catch (_) { /* ignore */ }
}

console.log('\nErrores de consola:', consoleErrors.length ? consoleErrors : 'ninguno');
if (consoleErrors.length) failures++;
console.log(failures ? `\nFALLOS: ${failures}` : '\nTODO OK');
await browser.close();
server.close();
process.exit(failures ? 1 : 0);
