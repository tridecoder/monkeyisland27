#!/usr/bin/env node
// Smoke test de FE DE ERRATAS: sirve el juego y lo recorre con Playwright (clics reales + window.__game):
// título, intro, ratón, las 9 salas por sus salidas, inventario (los 19 objetos), combinación común, pistas,
// un duelo de prueba completo (fallo, comodín, acierto, remate con objeto equivocado y correcto), derrota,
// retirada, guardar/cargar, menú de pausa, créditos, depuración y táctil.
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
const step = (s) => console.log('\n» ' + s);

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
  ['torno', 'pecera'], ['pecera_a_office', 'office'], ['office_a_catacumba', 'catacumba'], ['catacumba_a_office', 'office'],
  ['office_a_pecera', 'pecera'], ['pecera_a_pajarera', 'pajarera'], ['puerta_sala', 'sala_amazonas'], ['sala_a_pajarera', 'pajarera'],
  ['pajarera_a_pecera', 'pecera'], ['pecera_a_ecosistema', 'ecosistema'], ['ecosistema_a_administracion', 'administracion'],
  ['administracion_a_ecosistema', 'ecosistema'], ['ecosistema_a_pecera', 'pecera'], ['pecera_a_vestibulo', 'vestibulo'],
  ['ascensor_vestibulo', 'cpd'], ['ascensor_cpd', 'vestibulo'],
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
  await clickVirtual(200, 130);
  await wait(1600);
  const after = (await state()).player;
  ok(Math.abs(after.x - before.x) > 20, `el jugador camina (${before.x},${before.y}) → (${after.x},${after.y})`);
  const cp = await G(() => __game.screenPos('celestino'));
  await page.mouse.move(cp.x, cp.y); await wait(150);
  ok((await state()).sentence === 'Ir a Celestino', 'frase «Ir a Celestino» al pasar el ratón');
  await shot('03-vestibulo-hover');

  step('Ratón: Mirar + clic en el organigrama (respuesta por defecto §8.2, en orden)');
  await clickClient(await G(() => __game.verbPos('mirar')));
  await clickClient(await G(() => __game.screenPos('organigrama')));
  ok(await waitFor(() => __game.state().speaking.length > 0), 'Bruno habla');
  await wait(400);
  await shot('04-texto-hablado');
  await fast(true); await G(() => __game.waitIdle());
  ok(await G(() => __game.log.some(l => l.text.startsWith('Es exactamente lo que parece'))), 'primera respuesta por defecto de Mirar');
  await G(() => __game.doVerb('mirar', 'logo_pared'));
  ok(await G(() => __game.log.some(l => l.text.startsWith('Lo miro con intensidad'))), 'la segunda Mirar rota a la 2.ª respuesta');
  await G(() => __game.doVerb('mirar', 'bruno'));
  ok(await G(() => __game.log.some(l => l.text.startsWith('Soy yo. Joven'))), 'Mirar a Bruno (cuarta pared §8.6)');

  // ---------------------------------------------------------------- the 9 rooms
  step('Recorrido por las 9 salas (stubs) por sus salidas');
  const seen = new Set(['vestibulo']);
  for (const [exit, room] of ROUTE) {
    await G(e => __game.doVerb('ir', e), exit);
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
  ok(seen.size === 9, 'visitadas las 9 salas: ' + [...seen].join(', '));
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

  step('Pistas: Usar móvil (§5.6)');
  await G(() => __game.doVerb('usar', 'movil'));
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

  step('Créditos (esqueleto)');
  G(() => __game.game.runScript(api => api.ending(), { label: 'créditos' }));
  ok(await waitFor(() => __game.state().mode === 'ending'), 'pantalla de créditos');
  await wait(3500);
  await shot('12-creditos');
  for (let i = 0; i < 12 && (await state()).mode === 'ending'; i++) { await clickVirtual(160, 100); await wait(400); }
  ok(await waitFor(() => __game.state().mode === 'title', null, 8000), 'vuelve al título');

  step('Robustez: errores de contenido no bloquean');
  expectErrors = true;
  await G(() => __game.newGame());
  await fast(true);
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
