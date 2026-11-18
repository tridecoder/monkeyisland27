#!/usr/bin/env node
// GUION NUEVO · TANDA 2 (docs/GUION_PROPUESTA_LIMPIO.md): LA HISTORIA ([P11] entero salvo Eventos, [P4], [P6] y lo que
// toca de [P14]). Cada puerta nueva o movida se juega (ratón donde importa) y se comprueba:
//   (a) que si se intenta antes de tiempo hay una respuesta que orienta; (b) que la abuela y la nota de Bruno mandan al
//   sitio correcto en cada estado; (c) que se puede hacer en los órdenes que el juego permite (walk-data: STEPS, ALT y
//   ALT2, aquí la FIRMA como último requisito); (d) que las partidas del juego ANTERIOR, a mitad de cada bloque, cargan y
//   se terminan (`migrarPartida`).
//   · CMS → HUECO: Maripaz avisa antes de la estampida («Si la web publicara.») y se niega al D1 con la web caída; ficha
//     («Si la web publica.», la nota al margen solo tras oírla), meta y abuela del CMS; con la R-3, el D1 de siempre.
//   · Sistemas atiende siempre (fuera «No atiendo»); R12 con el CMS caído; el manual, de Eutimio al apagar la R-3 (fuera la
//     pegatina como paso y «Ticket 0.441»); pista de la FIRMA sin el manual.
//   · Evaristo da el correo tras «Siga.» y explica el momento oportuno; la coma con Aurora, opcional y sin papel; la tecla 3
//     ya no da el correo; fuera la L3 y la L5; la L4 (los atunes) al abrir el Acto III, antes de Brais; sin «RV x5».
//   · El rotulador lo da Maripaz al perder el D1; el termómetro (cordel con rotulador en el Acto I, vacío desde el II).
//   · El atasco de la puerta, escena automática. Íñigo: el pósit a «Prescindible», la matriz, la amenaza en persona (con
//     su línea de respaldo si la FIRMA es lo último) y «Prescindible» en el D4.
//   · El hallazgo de la opa con Begoña; el fax de F.P.; Brais es F.P.; Celestino y Hidrovoltia; Herminia mide (corta);
//     «Dos IAs» sin el armario; fuera el ticket nº 3 y los tirones 3.º y 4.º; [P4] el parpadeo; [P6] Brais recortado
//     (el titular, opción del árbol; el táper al despedirse); el clímax con Begoña en cuatro líneas y «Tira, Teodoro.»;
//     el D4 perdido sin réplicas solo con «Me faltan réplicas…»; la máquina de bocadillos; «Baja como Titulator…».
//   node tools/test-guion3-t2.mjs        (capturas en tools/shots/guion3-t2-*.png)
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from './serve.mjs';
import { createRunner, StepFail } from './walk-lib.mjs';
import { STEPS, ALT2 } from './walk-data.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const shots = path.join(here, 'shots');
fs.mkdirSync(shots, { recursive: true });
const server = createServer(root);
await new Promise(r => server.listen(0, r));
const base = `http://localhost:${server.address().port}/`;
const browser = await chromium.launch();
let failures = 0, checks = 0;
const ok = (c, m) => { checks++; if (c) console.log('  ✓ ' + m); else { failures++; console.log('  ✗ ' + m); } };
const T0 = Date.now();
const step = (t) => console.log(`\n[${Math.round((Date.now() - T0) / 1000)} s] ` + t);
const consoleErrors = [];
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const page = await browser.newPage({ viewport: { width: 960, height: 600 } });
page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));
const G = (fn, a) => page.evaluate(fn, a);
const R = createRunner(page);
const until = async (fn, arg, ms = 8000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await G(fn, arg)) return true; await sleep(40); } return false; };
const idle = () => G(() => __game.waitIdle());
const state = () => G(() => __game.state());
const flag = (k) => G(k => __game.getFlag(k), k);
const tiene = (i) => G(i => __game.state().inventory.includes(i), i);
const cuantos = (i) => G(i => __game.state().inventory.filter(x => x === i).length, i);
const logHas = (t) => G(t => __game.log.some(l => String(l.text).includes(t)), t);
const logIdx = (t) => G(t => __game.log.findIndex(l => String(l.text).includes(t)), t);
const logOf = (who) => G(w => __game.log.filter(l => l.who === w).map(l => String(l.text)), who);
const clearLog = () => G(() => __game.clearLog());
const rapido = (on) => G(on => __game.skipText(on), on);
const shot = (n) => page.screenshot({ path: path.join(shots, `guion3-t2-${n}.png`) });
const verb = (v, t, i) => G(([v, t, i]) => __game.doVerb(v, t, i || null), [v, t, i]);
const objState = (id) => G(id => __game.game.getObjState(id).state, id);
const opciones = () => G(() => __game.currentDialogOptions() || []);
const sinDismisser = () => G(() => { if (window.__dismisser) clearInterval(window.__dismisser); window.__dismisser = null; });
const conDismisser = () => R.startDismisser();
/** Lanza una acción sin esperarla (texto real) y hace la captura cuando sale la línea `t`. */
async function capturaEn(lanzar, t, nombre, ms = 60000, extra = 350) {
  await rapido(false);
  await clearLog();
  await G(lanzar);
  const visto = await until(t => __game.log.some(l => String(l.text).includes(t)), t, ms);
  if (visto) { await sleep(extra); await shot(nombre); }
  await rapido(true);
  await idle();
  return visto;
}

// ---- ratón
const verA = (id) => G((id) => {
  const g = __game.game, o = __game.objects().find(o => o.id === id) || (g.actors[id] && { x: g.actors[id].x - 10, w: 20 });
  if (!o) return;
  g.camFollow = null; g.camTarget = null; g.camX = Math.max(0, Math.min(g.room.width - 320, Math.round(o.x + o.w / 2 - 160)));
}, id);
const seguir = () => G(() => { __game.game.camFollow = __game.game.G.player; });
const clicVerbo = async (v) => { const c = await G(v => __game.verbPos(v), v); await page.mouse.click(c.x, c.y); await sleep(40); };
const clicInv = async (it) => { const c = await G(i => __game.invPos(i), it); await page.mouse.click(c.x, c.y); await sleep(40); };
async function raton(verbo, id, item, esperar = true) {
  await clicVerbo(verbo);
  if (item) await clicInv(item);
  await verA(id); await sleep(60);
  const c = await G(id => __game.screenPos(id), id);
  await page.mouse.click(c.x, c.y);
  if (esperar) { await sleep(150); await idle(); await seguir(); }
}
async function clicOpcion(texto, esperar = true) {
  if (!(await until(() => !!__game.currentDialogOptions(), null, 15000))) return false;
  await sleep(330);
  const o = await opciones();
  const i = o.findIndex(x => x.replace(/^› /, '') === texto || x.includes(texto));
  if (i < 0) return false;
  const p = await G(i => __game.optionPos(i), i);
  await page.mouse.click(p.x, p.y + 2);
  if (!esperar) return true;                             // (para capturar una línea a mitad de la escena)
  await sleep(150);
  await idle();
  return true;
}
async function salir() {
  for (let k = 0; k < 4; k++) {
    const o = await opciones(); if (!o.length) return;
    const i = o.findIndex(x => /^(Me voy|Nada|Luego vuelvo|Ahora vuelvo|Mejor no|Gracias)/.test(x));
    await G(i => __game.chooseDialog(i), i < 0 ? o.length - 1 : i); await idle();
  }
}

// ---- partidas
const paso = (n) => STEPS.find(s => s.n === n);
async function jugar(lista) {
  await rapido(true);
  for (const n of lista) {
    const s = paso(n);
    for (const a of s.acc) await R.run(a);
    await idle();
    await R.check(s.esp);
  }
}
const pasos = (a, b) => STEPS.filter(s => s.n >= a && s.n <= b).map(s => s.n);
async function nueva() { await rapido(true); await G(() => __game.newGame()); await idle(); }
const guardar = (slot) => G(s => __game.save(s), slot);
const cargar = async (slot) => { await G(s => __game.load(s), slot); await idle(); };
/** Copia de una ranura retocada como partida del juego ANTERIOR (flags/objetos/inventario/once). */
async function partidaVieja(slot, nuevaSlot, cambio) {
  await G(([s, n, c]) => {
    const k = __game.game.slotKey(s), d = JSON.parse(localStorage.getItem(k));
    const st = d.state, fn = new Function('st', c);
    fn(st);
    localStorage.setItem(__game.game.slotKey(n), JSON.stringify(d));
  }, [slot, nuevaSlot, cambio]);
  await cargar(nuevaSlot);
}
/** Pista de la abuela en la sala `sala` (llamada entera, en modo rápido): sus líneas y las de Bruno al colgar. */
async function abuela(sala) {
  return G(async (sala) => {
    const g = __game.game, real = g.state.room;
    if (sala) g.state.room = sala;
    __game.clearLog(); __game.skipText(true);
    try { await __game.scene('pistas'); } finally { g.state.room = real; }
    return { abuela: __game.log.filter(l => l.who === 'abuela_remedios').map(l => String(l.text)), bruno: __game.log.filter(l => l.who === 'bruno').map(l => String(l.text)),
      obj: g.state.flags.abuela_obj, nivel: g.state.flags.abuela_nivel };
  }, sala);
}
const meta = (sala) => G(async (sala) => { const m = await import('./engine/objetivos.js'); return m.meta(__game.game, sala); }, sala);
const ficha = () => G(async () => { const m = await import('./content/items.js'); const g = __game.game; return m.fichaViva({ flag: (k) => g.state.flags[k], has: (i) => g.state.inventory.includes(i) }); });
const fin = () => G(() => __game.state().finished);

try {
  await page.goto(base);
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) { /* ignore */ } });
  await page.reload();
  await page.waitForFunction(() => !!window.__game && __game.state().mode === 'title');
  await R.startDismisser();

  // ====================================================================== textos estáticos (pistas, DONDE, duelo)
  step('Datos: pistas, la libreta (R12), el D4 y el móvil');
  {
    const P = await import('../content/pistas.js');
    const D = (await import('../content/duelo.js')).default;
    const mov = await import('../content/lib/movil.js');
    const o = (id) => P.OBJETIVOS.find(x => x.id === id);
    ok(P.DONDE.rep_12[1] === 'Sistemas: a Eutimio, «¿Algún cotilleo del consultor?».', 'R12: la nota de Bruno (y la pista de la libreta) ya no pide el CMS vivo');
    ok(o('cms').meta === 'Sin web, Maripaz no pasa a Siestatón. Y la web no publica desde las cuatro.' && [].concat(o('cms').activo).includes('maripaz_pide_web'),
      'objetivo CMS: la meta nueva; cuenta desde que Maripaz lo dice');
    ok(o('cms').niveles[2][1] === 'Sistemas: Tirar de la R-3 del regletero. La del pósit de Eutimio.', 'objetivo CMS: las pistas de siempre');
    const firma = o('firma').sub.find(s => s.si === '!has:manual_fax');
    ok(firma.niveles[1] === 'El de los cables guarda el manual de esa máquina. Arréglale lo suyo.'
      && firma.niveles[2][0] === 'Apaga la regleta que no dice lo que es, y el de los cables te da el manual.'
      && firma.niveles[2][1] === 'Sistemas: el manual lo tiene Eutimio. Me lo da con su hueco, al apagar la R-3.', 'FIRMA sin el manual: las pistas nuevas (Eutimio, la R-3)');
    ok(o('coma').niveles[2][1] === 'Administración: escuchar a Evaristo, «¿De qué trata?» y «Siga». Y su correo.', 'Escuchar a Evaristo: Bruno nombra el correo al colgar');
    ok(!o('bendicion'), 'fuera el objetivo de la coma con Aurora (es opcional, sin pista)');
    ok(!(o('turno').sub || []).some(s => s.si === 'sala_amazonas_atasco'), 'fuera la variante del atasco (ya no es jugable)');
    ok(!(o('columna').sub || []).some(s => s.si === '!has:rotulador_rojo'), 'fuera la variante «sin el rotulador» (llega con el D1)');
    ok(D.wrongObject.inigo.tarjeta_becario === 'Sin foto no estás en mi matriz. Ah, sí: en «Prescindible».' && JSON.stringify(D).includes('Sin foto no estás en mi matriz. Ah, sí: en «Prescindible».'), 'D4: la tarjeta de becario, «en «Prescindible»»');
    ok(mov.RV_TADEO.length === 2 && !mov.RV_TADEO.some(r => /ARMARIO 27/.test(r[1])), 'fuera el «RV x5» del armario 27 de Tadeo');
    const G2 = await import('../content/game.js');
    ok(G2.LLAMADAS.map(l => l.id).join() === 'L1,L2,L4', 'llamadas de Evaristo: L1, L2 y L4');
  }

  // ====================================================================== Acto I · termómetro con el rotulador
  step('Acto I: el termómetro de ventas, con el rotulador en su cordel; Maripaz no lo suelta');
  await nueva();
  await jugar(pasos(1, 15));
  await guardar('t2_a1');
  await R.run(['ir', 'ecosistema']); await idle();
  await clearLog();
  await raton('coger', 'termometro_ventas');
  ok(await logHas('Ese rotulador pinta objetivos. Cuando tengas uno, hablamos.') && !(await tiene('rotulador_rojo')), 'Acto I · Coger el termómetro: «Ese rotulador pinta objetivos. Cuando tengas uno, hablamos.» (no lo da)');
  await raton('coger', 'rotulador_cordel');
  ok(!(await tiene('rotulador_rojo')), 'Acto I · Coger el rotulador del cordel: tampoco');
  await verA('termometro_ventas'); await sleep(200);
  await shot('termometro-acto1');
  await seguir();

  // ====================================================================== Acto II, bloque A: la Sala con la web caída
  step('Acto II · [P4] la pantalla parpadea (primera entrada en la Redacción con el CMS colgado)');
  await cargar('t2_a1');
  await jugar([16, 17, 18]);
  await guardar('t2_a2');
  await sinDismisser();
  await rapido(false); await clearLog();
  await G(() => { __game.doVerb('ir', 'catacumba_a_pecera'); });
  const vGuard = await until(() => __game.game.getObjState('monitor_yoli').state === 'guardando' && __game.game.room.def.id === 'pecera', null, 30000);
  await sleep(500);
  if (vGuard) await shot('parpadeo-guardando');
  const vPub = await until(() => __game.game.getObjState('monitor_yoli').state === 'publicado', null, 20000);
  await sleep(250);
  if (vPub) await shot('parpadeo-publicado');
  await until(() => __game.log.some(l => String(l.text) === '...Ya no va.'), null, 20000);
  await rapido(true); await idle(); await conDismisser();
  ok(vGuard && vPub, 'el monitor de Yoli: GUARDANDO… y, con la pantalla en negro, PUBLICADO');
  ok(await logHas('¡Ha entrado una pieza!') && await logHas('...Ya no va.') && !(await flag('cms_vivo')), '«¡Ha entrado una pieza!» / «...Ya no va.» (no lo dice nadie más: se ve)');
  ok((await objState('pantalla_metricas')) == null && (await objState('monitor_yoli')) == null, 'la pantalla vuelve a encenderse');
  await clearLog();
  await R.run(['ir', 'office']); await R.run(['ir', 'pecera']); await idle();
  ok(!(await logHas('¡Ha entrado una pieza!')), 'una sola vez');

  step('Acto II · Celestino: la de Hidrovoltia, la primera vez en el Vestíbulo');
  await clearLog();
  await R.run(['ir', 'vestibulo']); await idle();
  const cel = await logOf('celestino');
  ok(cel.includes('¡Hidrovoltia calienta en la banda! ¡Algo trama el míster!'), `primera entrada del Acto II: «${cel.join(' | ')}»`);
  await clearLog();
  await R.run(['ir', 'pecera']); await R.run(['ir', 'vestibulo']); await idle();
  ok(!(await logOf('celestino')).includes('¡Hidrovoltia calienta en la banda! ¡Algo trama el míster!'), 'después, la rotación de siempre (sin repetirla)');

  step('Acto II · la Sala con la web caída: Maripaz avisa antes de la estampida');
  await R.run(['ir', 'sala_amazonas']); await idle();
  ok((await ficha()).every(l => !l.includes('CMS en coma')), 'antes de oír a Maripaz, la ficha no tiene nota al margen del CMS');
  const a0 = await abuela('sala_amazonas');
  ok(a0.obj === 'reunion', `antes de oír a Maripaz, la abuela manda a la reunión (${a0.obj})`);
  await clearLog();
  await raton('hablar', 'gervasio_acta');
  await until(() => !!__game.currentDialogOptions(), null, 20000);
  ok(await logHas('Siestatón se va a la web. Si la web publicara.') && await flag('maripaz_pide_web') === true, 'Maripaz: «Siestatón se va a la web. Si la web publicara.»');
  ok((await logIdx('Y yo, esperando a Siestatón.')) < (await logIdx('Si la web publicara.')), 'después de «Y yo, esperando a Siestatón…»');
  await salir();
  const f1 = await ficha();
  ok(f1.includes('Al margen, a lápiz: «CMS en coma. Sin web, Maripaz no suelta la página».') && f1.includes('HUECO: Siestatón se va a la web. Si la web publica.'),
    'ficha: HUECO «Si la web publica.» y la nota al margen, ya oída Maripaz');
  ok(await meta('sala_amazonas') === 'Sin web, Maripaz no pasa a Siestatón. Y la web no publica desde las cuatro.', 'Mirar a Bruno (en la Sala): la meta del CMS');
  const a1 = await abuela('sala_amazonas');
  ok(a1.obj === 'cms' && a1.abuela.includes('La tele de tu abuelo no iba si él la miraba. Apágale algo a alguien.'), 'la abuela: la pista del CMS (nivel 1)');
  await clearLog();
  await jugar([26, 27]);
  ok(!(await logHas('Si la web publicara.')), 'la segunda vez Gervasio no repite a Maripaz');

  step('Acto II · la estampida y el atasco automático');
  await sinDismisser();
  const vAt = await capturaEn(() => { __game.doVerb('hablar', 'tele_amazonas').then(() => __game.chooseText('Buenas noches, Gertrudis.')).then(() => __game.chooseText('¿Y cuáles son los siguientes pasos?')); },
    '¡Un momento! ¡Antes de salir, un anuncio de cinco segundos!', 'atasco', 90000, 500);
  await until(() => __game.getFlag('reunion_terminada') === true && !__game.state().busy, null, 60000);
  await idle(); await conDismisser();
  ok(vAt, 'la escena sigue sola: el anuncio de cinco segundos de Maripaz');
  const sal = await G(() => __game.game.salaAtasco);
  ok(await flag('reunion_terminada') && !(await flag('sala_amazonas_atasco')) && sal && sal.via === 'anuncio', 'reunion_terminada sin tocar nada (sin vías: empujar, cruasán, hablar)');
  for (const t of ['¡Ese medio cruasán es mío! ¡Lo he cobrado dos veces!', 'Se levanta la sesión. Lo hablamos.', '¿Usted no huye?', 'Y estoy sentada en el planillo. La página 7 no se mueve sin mí.'])
    ok(await logHas(t), `atasco: «${t}»`);
  ok(!(await logHas('Les doy un empujoncito.')) && !(await logHas('¿Y la próxima reunión, cuándo es?')), 'fuera las otras salidas');
  ok((await logIdx('¡Un momento!')) < (await logIdx('¡Ese medio cruasán es mío!')) && (await logIdx('¡Ese medio cruasán es mío!')) < (await logIdx('Se levanta la sesión.')), 'orden: el anuncio, el cruasán de Jacinto, «Se levanta la sesión»');

  step('Acto II · Maripaz no juega el D1 con la web caída');
  await clearLog();
  await raton('hablar', 'maripaz_remitido', null, false);
  await until(() => !!__game.currentDialogOptions(), null, 30000);
  await sinDismisser(); await rapido(false);
  await clicOpcion('Siestatón no ha confirmado la página 7.', false);
  const vNeg = await until(() => __game.log.some(l => String(l.text) === 'Arréglala y te lo pongo por escrito.'), null, 30000);
  await sleep(500); if (vNeg) await shot('maripaz-sin-web');
  await rapido(true); await idle(); await conDismisser();
  ok(await logHas('Aunque la web no publica desde las cuatro.') && vNeg && !(await state()).duel && !(await G(() => __game.game.lastDuel)), '«Aunque la web no publica desde las cuatro.» / «Arréglala y te lo pongo por escrito.» y no hay duelo');
  ok(await logHas('Es un exnovio.'), 'la primera vez, también lo del exnovio');
  await clearLog();
  await verb('hablar', 'maripaz_remitido'); await G(() => __game.chooseText('Siestatón no ha confirmado')); await idle();
  ok(await logHas('Aunque la web no publica desde las cuatro.') && !(await logHas('Es un exnovio.')) && !(await state()).duel, 'otra vez: solo la negativa');
  await salir();

  step('Acto II · Sistemas atiende con el CMS caído (R12) y no hay «Ticket 0.441»');
  await R.run(['ir', 'cpd']); await idle();
  await clearLog();
  await raton('hablar', 'paco_ticket', null, false);
  await until(() => !!__game.currentDialogOptions(), null, 20000);
  const op = await opciones();
  ok(!(await logHas('No atiendo')) && await logHas('Tengo 312 tickets que dicen «el CMS no va».'), 'Eutimio con el CMS caído: sin «No atiendo»');
  ok(op.includes('¿Algún cotilleo del consultor?') && op.includes('¿Y por qué no va?') && !op.some(x => /0\.441|fax/.test(x)), `el árbol entero, sin las opciones del fax (${op.length} opciones)`);
  await clicOpcion('¿Algún cotilleo del consultor?');
  ok(await flag('rep_12') === true, 'R12 con el CMS caído');
  await salir();
  await raton('mirar', 'maquina_bocadillos');
  ok(await logHas('Una máquina de bocadillos. Solo le queda la fila del atún. Vacía.'), '[P14] la máquina de bocadillos, junto al ascensor');
  await verA('maquina_bocadillos'); await sleep(150); await shot('maquina-bocadillos'); await seguir();
  // la FIRMA sin el manual: la abuela y Bruno mandan a la R-3
  {
    const r = await G(async () => { const m = await import('./engine/objetivos.js'); const g = __game.game; const o = m.variante(g, g.G.objetivos.find(o => o.id === 'firma')); return o.niveles[2][1]; });
    ok(r === 'Sistemas: el manual lo tiene Eutimio. Me lo da con su hueco, al apagar la R-3.', 'sin el manual, la FIRMA manda a la R-3');
  }
  await guardar('t2_r3');

  step('Acto II · el regletero: la R-3 y el manual de Eutimio (ratón)');
  await clearLog();
  await sinDismisser(); await rapido(false);
  await raton('tirar', 'regleta_r3', null, false);
  await clicOpcion('R-3', false);
  const vMan = await until(() => __game.log.some(l => String(l.text).startsWith('Toma el manual.')), null, 60000);
  await sleep(500); if (vMan) await shot('eutimio-manual');
  await rapido(true); await idle(); await conDismisser();
  ok(await flag('cms_vivo') && await tiene('manual_fax') && await flag('paco_dio_manual'), 'CMS vivo y el manual del fax en el bolsillo');
  for (const t of ['Tengo un hueco. Uno. ¿Qué querías?', 'El fax de Teodoro.', '0.441. De 1999. Estado: lo respetamos.', 'Toma el manual. Página 9: la respuesta automática. Mi mejor empleada.'])
    ok(await logHas(t), `R-3: «${t}»`);
  await clearLog();
  await verb('hablar', 'paco_ticket');
  ok(!(await opciones()).some(x => /0\.441|fax/.test(x)), 'después, el árbol sigue sin las opciones del fax');
  await salir();
  await guardar('t2_cms');

  step('Acto II · Despachos: el titular del primer apagón');
  {
    await cargar('t2_r3');
    await jugar([20]);
    await clearLog();
    await R.run(['ir', 'pajarera']); await idle();
    ok(await logHas('ALGUIEN DESENCHUFA UNA PANTALLA. LA WEB PUBLICA A OSCURAS') && !(await logHas('TRES VECES')), '«ALGUIEN DESENCHUFA UNA PANTALLA. LA WEB PUBLICA A OSCURAS»');
    await R.run(['ir', 'pecera']); await idle();
    await clearLog();
    await verb('tirar', 'enchufe_pantalla');
    await until(() => !__game.getFlag('pecera_oscuras') && !__game.state().busy, null, 30000); await idle();
    await verb('tirar', 'enchufe_pantalla');
    await until(() => !__game.getFlag('pecera_oscuras') && !__game.state().busy, null, 30000); await idle();
    ok(await flag('apagon_n') === 3 && !(await logHas('BLOQUEADO')) && !(await logHas('huele a Eutimio')) && !(await logHas('Sin número, a su enchufe.')), 'tercer tirón: solo el gesto (fuera «BLOQUEADO» y «Sin número…»)');
    await G(() => __game.setFlag('vio_ticket_3', true));
    await verb('tirar', 'enchufe_pantalla');
    await until(() => !__game.getFlag('pecera_oscuras') && !__game.state().busy, null, 30000); await idle();
    ok(!(await flag('cms_vivo')) && !(await logHas('SALVO TICKET')), 'con el registro leído (ticket nº 3), el enchufe ya no arregla el CMS');
  }

  step('Acto II · con el CMS vivo, el D1 de siempre; ganarlo da el rotulador (y el cordel queda vacío)');
  await cargar('t2_cms');
  await jugar([24, 25]);   // (el 23, la R12, ya está hecho con el CMS caído)
  await R.run(['ir', 'sala_amazonas']); await idle();
  await sinDismisser(); await rapido(false); await clearLog();
  // (el árbol y el duelo, como el paso 29, con texto real para la captura del rotulador)
  const d1 = (async () => { for (const a of paso(29).acc.filter(a => a[0] !== 'ir' && a[0] !== 'cerrar')) await R.run(a); })();
  const vRot = await until(() => __game.log.some(l => String(l.text).startsWith('Y llévate mi rotulador de objetivos.')), null, 240000);
  await sleep(600); if (vRot) await shot('maripaz-rotulador');
  await rapido(true);
  await d1; await idle(); await salir(); await conDismisser();
  ok(vRot && await tiene('rotulador_rojo') && await flag('casilla_hueco'), 'Maripaz: «Y llévate mi rotulador de objetivos. Lo que pintes, lo cobro como espacio.» → rotulador');
  ok((await logIdx('Tenías la espalda desaprovechada.')) < (await logIdx('Y llévate mi rotulador')), 'después del adhesivo');
  await R.run(['ir', 'ecosistema']); await idle();
  await clearLog();
  await verb('mirar', 'termometro_ventas');
  ok(await logHas('El cordel, vacío. El 3 % que falta se lo lleva el gong de al lado.'), 'Acto II · Mirar el termómetro: «El cordel, vacío…»');
  await verA('termometro_ventas'); await sleep(200); await shot('termometro-cordel-vacio'); await seguir();
  await clearLog();
  await verb('usar', 'termometro_ventas');
  ok(await logHas('Le pinto un poquito más de rojo.') && await cuantos('rotulador_rojo') === 1, 'con el rotulador, «Usar» pinta (y no da otro)');
  await guardar('t2_d1');
  // Acto II sin el D1 y sin Maripaz en la planta: el cordel vacío
  await cargar('t2_cms');
  await R.run(['ir', 'ecosistema']); await idle();
  await clearLog();
  await verb('coger', 'termometro_ventas');
  ok(await logHas('Solo queda el cordel, cortado. El rotulador se lo ha llevado Maripaz.') && !(await tiene('rotulador_rojo')), 'Acto II, antes del D1 · Coger: «Solo queda el cordel, cortado…»');

  // ====================================================================== bloque B: Administración
  step('Acto II · Begoña: el hallazgo de la opa · Evaristo da el correo');
  await cargar('t2_d1');
  await R.run(['ir', 'administracion']); await idle();
  await sinDismisser();
  const nb = paso(30).acc.filter(a => a[0] !== 'ir');
  await rapido(false); await clearLog();
  const pB = (async () => { for (const a of nb) await R.run(a); })();
  const vOpa = await until(() => __game.log.some(l => String(l.text) === 'Es lo primero que leo hoy que no quieren que lea.'), null, 120000);
  await sleep(400); if (vOpa) await shot('begona-opa');
  await rapido(true); await pB; await idle();
  ok(vOpa && await logHas('Por detrás, a boli: «OPA ROBLEDAL — jueves — NO PUBL.»'), 'Bruno le da la vuelta: «OPA ROBLEDAL — jueves — NO PUBL.» / «Es lo primero que leo hoy…»');
  ok((await logIdx('Te la fotocopio')) < (await logIdx('OPA ROBLEDAL')) && (await logIdx('OPA ROBLEDAL')) < (await logIdx('Original. Duplicado. Triplicado.')), 'tras la fotocopia y antes de los tres sellos');
  await rapido(false); await clearLog();
  const pE = (async () => { for (const a of paso(31).acc) await R.run(a); })();
  const vCor = await until(() => __game.log.some(l => String(l.text).startsWith('Le dejo el correo programado.')), null, 120000);
  await sleep(400); if (vCor) await shot('evaristo-correo');
  await rapido(true); await pE; await idle(); await conDismisser();
  ok(vCor && await tiene('correo_evaristo') && await flag('correo_evaristo_listo') && await flag('evaristo_escuchado'), 'Evaristo, tras «Siga.»: el correo, de su mano');
  for (const t of ['Le dejo el correo programado. Lo envía usted, en el momento oportuno.', '¿Y cuándo es el momento oportuno?', 'Cuando alguien dé por firmados los cuarenta y ocho mil.', 'Gracias por escucharme hasta el final.'])
    ok(await logHas(t), `«${t}»`);
  ok(!(await logHas('dudo de mi propia coma')) && !(await logHas('segunda opinión')), 'fuera «dudo de mi propia coma»');
  ok((await ficha()).includes('Al margen, a lápiz: «El correo, en el momento oportuno».') && !(await ficha()).some(l => l.includes('a Aurora')), 'ficha: «El correo, en el momento oportuno» (fuera «La coma de Evaristo, a Aurora»)');
  await guardar('t2_b');

  // ====================================================================== bloque C: la coma (opcional), FUENTE y FIRMA
  step('Acto II · la coma con Aurora: opcional y sin papel en el fax');
  await R.run(['ir', 'catacumba']); await idle();
  ok(!(await flag('fax_con_papel')), '(el fax aún no tiene papel)');
  await clearLog();
  await raton('hablar', 'aurora_galerada', null, false);
  await until(() => !!__game.currentDialogOptions(), null, 20000);
  ok((await opciones()).includes('¿Está bien la coma de don Evaristo?'), 'con el correo, la opción «¿Está bien la coma de don Evaristo?»');
  await clicOpcion('¿Está bien la coma de don Evaristo?');
  await idle();
  ok(await logHas('«La coma está bien. A.G.»') && await flag('coma_bendecida') && await cuantos('correo_evaristo') === 1, 'Aurora la manda por el fax de Teodoro, sin papel: «La coma está bien. A.G.» (no imprime otro correo)');
  ok(!(await logHas('Envíelo')) && !(await logHas('ese fax no tiene papel')), 'fuera «Envíelo» y la respuesta «sin papel»');
  await salir();
  await clearLog();
  await verb('dar', 'aurora_galerada', 'correo_evaristo');
  ok(await logHas('Ya lo he leído. Está perfecto. Guárdalo.'), 'después, dárselo: «Ya lo he leído. Está perfecto. Guárdalo.»');
  // dárselo la primera vez abre la escena
  await cargar('t2_b');
  await R.run(['ir', 'catacumba']); await idle();
  await clearLog();
  await verb('dar', 'aurora_galerada', 'correo_evaristo');
  ok(await logHas('¿Evaristo? ¿El de las comas?') && await flag('coma_bendecida'), 'darle el correo la primera vez: la escena de la coma');
  await cargar('t2_b');

  step('Acto II · el fax de F.P., la FUENTE y el D2 (sin la coma, que es opcional)');
  await jugar([32]);
  await clearLog();
  await verb('mirar', 'mensaje_fp');
  ok(await logHas('«La segunda fuente comió con ellos el jueves. — F.P.»') && !(await logHas('mira las notas de gasto')), 'fax de F.P.: «La segunda fuente comió con ellos el jueves. — F.P.»');
  await jugar([34, 36]);
  ok(!(await flag('coma_bendecida')), 'la FIRMA sin haber hecho la coma con Aurora');
  await guardar('t2_firma');

  step('Acto II · Íñigo pasa a Bruno a «Prescindible» (primera entrada en la Redacción con la FIRMA)');
  await sinDismisser();
  const vPos = await capturaEn(() => { __game.doVerb('ir', 'catacumba_a_pecera'); }, 'Una firma en papel. Ya haces cosas, Vacante.', 'posit-prescindible', 60000, 500);
  await until(() => __game.getFlag('inigo_prescindible') === true && !__game.state().busy, null, 30000); await idle(); await conDismisser();
  ok(vPos && await logHas('Bienvenido a la plantilla.') && await flag('inigo_prescindible'), 'Íñigo: «Una firma en papel. Ya haces cosas, Vacante.» / «Bienvenido a la plantilla.»');
  await clearLog();
  await R.run(['ir', 'office']); await R.run(['ir', 'pecera']); await idle();
  ok(!(await logHas('Una firma en papel.')), 'una sola vez');
  await R.run(['ir', 'pajarera']); await idle();
  await clearLog();
  await raton('mirar', 'matriz_2x2');
  ok(await logHas('Mi pósit ya no está en «Ideal». Está en «Prescindible», con toda la plantilla.') && await logHas('En «Ideal» solo queda el cartón con chaqueta.'), 'la matriz: «Mi pósit… en «Prescindible»» (y el cartón con chaqueta)');
  await verA('matriz_2x2'); await sleep(200); await shot('matriz-prescindible'); await seguir();
  await clearLog();
  await verb('coger', 'matriz_2x2'); await verb('usar', 'matriz_2x2');
  ok((await G(() => __game.log.filter(l => String(l.text) === 'Busco mi pósit para volver a «Ideal». No hay forma: ya he hecho algo.').length)) === 2, 'Usar/Coger: «No hay forma: ya he hecho algo.»');

  step('Acto II · Herminia mide la pieza (corta) · la tecla 3 · el recorte sin faldón y sin L3');
  await clearLog();
  await jugar([37]);
  ok(await logHas('tu pieza · 31 líneas') && await logHas('Quitar siempre es de otro departamento.') && await logHas('A un metro de mi cinta. Fuera.'), 'la medición, «Quitar siempre…» y «A un metro de mi cinta. Fuera.»');
  ok(!(await logHas('infografía de la opa')) && !(await logHas('Encintar')) && !(await logHas('Lo que cuenta es lo de dentro')) && !(await logHas('Ya te la ha leído')), 'fuera la infografía de la opa, «Encintar» y la repetición de «lo de dentro»');
  const herm = (await logIdx('A un metro de mi cinta. Fuera.')) - (await logIdx('tu pieza · 31 líneas')) + 1;
  ok(herm === 7, `la escena, en 7 líneas (con la frase de Anselmo, que no se había oído): ${herm}`);
  await R.run(['ir', 'catacumba']); await idle();
  await clearLog();
  await verb('usar', 'fax', 'pieza_opa'); await G(() => __game.chooseText('3: CONTROLLING')); await idle();
  ok(await logHas('Diecisiete comas. Todas en su sitio.') && await cuantos('correo_evaristo') === 1, 'tecla 3: Evaristo lee la pieza; ya no da el correo');
  await clearLog();
  await jugar([38]);
  ok(!(await logHas('faldón de Comercial')) && await logHas('Me ha facturado el recorte.'), 'tecla 2: la factura de 0,26 € se queda; fuera el faldón');
  await R.run(['ir', 'pecera']); await R.run(['ir', 'catacumba']); await idle();
  ok(!(await logHas('Begoña me manda el triplicado')), 'tras el recorte, no suena la L3');

  step('Acto II → III · 7.3a: Íñigo trae la amenaza en persona');
  await sinDismisser();
  const vAm = await capturaEn(() => { __game.doVerb('dar', 'teodoro_cuerpodoce', 'ficha_pagina_7'); }, 'A las nueve, la Reunión de Dirección apaga la rotativa.', 'inigo-amenaza', 90000, 500);
  await until(() => __game.getFlag('acto_3_iniciado') === true && !__game.state().busy, null, 60000); await idle(); await conDismisser();
  ok(vAm && await logHas('Enhorabuena por tu página 7, Vacante. Es la última.'), 'Íñigo: «Enhorabuena por tu página 7, Vacante. Es la última.» / «A las nueve, la Reunión de Dirección apaga la rotativa.»');
  ok(await logHas('SI NO HAY ROTATIVA, NO HAY FIRMA.') && !(await logHas('Y con buena letra')), 'Teodoro, por fax: «Si no hay rotativa, no hay firma.»; fuera «Y con buena letra, criatura»');
  ok(!(await logHas('Y tú, a «Prescindible».')), 'con la escena del pósit vista, sin la línea de respaldo');
  ok((await logIdx('Ha hablado. En voz alta.')) < (await logIdx('Es la última.')) && (await logIdx('apaga la rotativa')) < (await logIdx('ACTO III')), 'tras «Ha hablado…» y antes del rótulo del Acto III');
  await clearLog();
  await verb('hablar', 'aurora_galerada');
  ok((await opciones()).includes('Íñigo dice que en la reunión van a apagar la rotativa.'), 'Aurora: «Íñigo dice que en la reunión van a apagar la rotativa.»');
  await salir();
  await guardar('t2_a3');

  // ====================================================================== Acto III
  step('Acto III · «Dos IAs» (consumo: atún) y la llamada de los atunes, antes de Brais');
  await clearLog();
  await R.run(['ir', 'pecera']); await idle();
  ok(await logHas('consumo: atún') && !(await logHas('armario 27')), 'Herminia: «consumo: atún» (fuera «origen: Sistemas, armario 27»)');
  await sinDismisser();
  const vL4 = await capturaEn(() => { __game.doVerb('ir', 'pecera_a_office'); }, 'Alguien come ahí abajo y no cobra.', 'llamada-atunes', 60000, 300);
  await until(() => !__game.state().aviso && !__game.state().busy, null, 30000); await idle(); await conDismisser();
  ok(vL4 && await logHas('...El armario 27.') && !(await flag('ruben_encontrado')), 'la L4, en la siguiente entrada: «…veinticuatro atunes…» → «...El armario 27.» (antes de encontrar a Brais)');
  const bandeja = await G(async () => { const m = await import('./content/lib/movil.js'); return JSON.stringify(m.RV_TADEO); });
  ok(!bandeja.includes('ARMARIO 27'), 'sin el «RV x5» de Tadeo');

  step('Acto III · Brais en el armario ([P6], [P11]: F.P.)');
  await clearLog();
  await R.run(['ir', 'cpd']); await R.run(['verbo', 'tirar', 'papel_continuo']); await idle();
  for (const t of ['Fuentes Próximas. Muy próximas: la impresora de los Despachos sale aquí.', 'El jueves salió por aquí una reserva: comida con Hidrovoltia. Y la opa.',
    'Te lo mandé yo. Pensé: si sale en papel, alguien bajará a ver quién lo filtró.', 'Nadie baja nunca. Has bajado tú.', '...Eres mi fuente.',
    'Nadie me ha hecho nunca una foto. Solo salgo de fondo, en las de Eventos.'])
    ok(await logHas(t), `revelación: «${t}»`);
  ok(!(await logHas('UN BECARIO VIVE EN UN ARMARIO')) && !(await logHas('la impresora de Íñigo')) && !(await logHas('¿Me traes un táper')), 'fuera de la escena: el contagio de titulares, «la impresora de Íñigo» y el táper');
  const nRev = (await logIdx('Solo salgo de fondo, en las de Eventos.')) - (await logIdx('BECARIO DETECTADO')) + 1;
  ok(nRev > 0 && nRev <= 21, `la escena automática, de «BECARIO DETECTADO» a la foto de Eventos: ${nRev} líneas (21 con las de Eventos de la tanda 3)`);
  await clearLog();
  await raton('hablar', 'ruben', null, false);
  await until(() => !!__game.currentDialogOptions(), null, 20000);
  await sleep(350);
  ok((await opciones()).includes('UN BECARIO VIVE EN UN ARMARIO Y FACTURA COMO UN BANCO'), 'el titular, opción del árbol');
  await shot('brais-titular');
  await clicOpcion('UN BECARIO VIVE EN UN ARMARIO Y FACTURA COMO UN BANCO');
  ok(await logHas('Le falta un número.') && await logHas('UN BECARIO VIVE EN UN ARMARIO. EL 4 TE SORPRENDERÁ') && await logHas('...Ya hablo como tú.'), 'el contagio, en el árbol');
  await clicOpcion('Ahora vuelvo.');
  ok(await logHas('...Te espero. No me voy. No puedo.') && await logHas('Salir, salgo: a por atún. Irme, no. Sin baja, no consta que me vaya.') && await logHas('¿Me traes un táper, ya que vas?'),
    'al despedirse: «No me voy. No puedo.», «Salir, salgo…» y, sin preguntarle por el táper, lo pide él');
  await clearLog();
  await verb('hablar', 'ruben'); await G(() => __game.chooseText('Ahora vuelvo.')); await idle();
  ok(!(await logHas('Salir, salgo')) && !(await logHas('¿Me traes un táper')), 'la segunda vez, solo «No me voy. No puedo.»');
  await jugar([41, 43, 44, 45]);
  ok(await logHas('Baja como Titulator. Alta como becario.'), '[P14] el ticket nº 1: «Baja como Titulator. Alta como becario.»');
  await jugar([46]);
  await guardar('t2_d4');                                // (antes de entrar a la Sala: el paso 47 abre el D4)

  step('Clímax · el D4 perdido sin réplicas: solo «Me faltan réplicas…»');
  {
    await partidaVieja('t2_d4', 't2_d4b', "for (const k of ['rep_10','rep_12','rep_13','rep_05','rep_16','rep_01','rep_07','rep_15']) st.flags[k] = false; st.flags.libreta_pistas = 0;");
    await clearLog();
    await G(() => { __game.doVerb('usar', 'puerta_sala'); });
    ok(await until(() => !!__game.state().duel, null, 60000), 'el clímax abre el D4 sin réplicas');
    await R.run(['perder']);
    await idle();
    ok(await logHas('Me faltan réplicas. Están apuntadas en la libreta.') && !(await logHas('Le vuelvo a hablar.')), 'sin réplicas: «Me faltan réplicas. Están apuntadas en la libreta.» (y no «Le vuelvo a hablar…» seguido)');
  }

  step('Clímax · Begoña en cuatro líneas y «Tira, Teodoro.»');
  await cargar('t2_d4');
  await jugar([47, 48]);
  await sinDismisser();
  const vTira = await capturaEn(() => { __game.doVerb('empujar', 'lector_medio'); }, 'Tira, Teodoro.', 'tira-teodoro', 120000, 450);
  await rapido(true);
  await until(() => __game.state().mode === 'title' || __game.getFlag('juego_terminado') === true, null, 120000);
  await conDismisser();
  ok(vTira, '«Tira, Teodoro.» (Aurora, en el inserto)');
  const L = await G(() => __game.log.map(l => String(l.text)));
  const iT = L.indexOf('Tira, Teodoro.'), iB = L.indexOf('Benita. Tira.');
  ok(iT >= 0 && iB === iT + 1, '«Tira, Teodoro.» justo antes de «Benita. Tira.»');
  const beg = (await G(() => __game.log.map(l => [l.who, String(l.text)]))).slice(0, iB).filter(([w]) => w === 'begona_triplicado').map(([, t]) => t);
  ok(beg.length === 3 && beg.includes('Factura de Optimal Brains. Cuarenta y ocho euros. Con coma.') && beg.includes('Con ticket.'), `Begoña: tres globos (más «¿Con táper?» de Brais, cuatro líneas): ${beg.join(' | ')}`);
  ok(!L.some(t => /taxi|ministro|treinta y cinco euros|Es lo que me como en atún/.test(t)), 'fuera el taxi, el recorte a 35,52, el ministro y el atún de Brais');

  // ====================================================================== (c) la FIRMA como último requisito
  step('Otro orden (ALT2): Administración antes que la reunión, la web caída, y la FIRMA la última');
  {
    await nueva();
    const hasta = ALT2.slice(0, ALT2.indexOf(36));           // todo hasta el D2 (que va tras el recorte)
    await jugar(hasta);
    ok(await flag('pieza_recortada') && !(await flag('casilla_firma')) && !(await flag('inigo_prescindible')), 'FUENTE, HUECO y recorte hechos; sin la FIRMA ni la escena del pósit');
    await clearLog();
    await jugar([36, 39]);
    ok(await logHas('Y tú, a «Prescindible». Con el resto de la plantilla.') && await flag('inigo_prescindible'), 'la FIRMA, lo último: en la 7.3a, Íñigo lo dice en persona («Y tú, a «Prescindible»…»)');
    await clearLog();
    await R.run(['ir', 'pecera']); await idle();
    ok(!(await logHas('Una firma en papel.')) && await flag('dos_ias_vista'), 'y en el Acto III no sale la escena del pósit');
    await jugar(ALT2.slice(ALT2.indexOf(40)));
    ok(!!((await fin()) && (await fin()).flags.juego_terminado), 'el orden ALT2 se termina');
  }

  // ====================================================================== (d) partidas del juego ANTERIOR
  step('Partidas guardadas del juego anterior, a mitad de cada bloque: cargan y se terminan');
  // las ranuras son del juego nuevo retocadas como las dejaba el anterior; cada una sigue el recorrido hasta el final
  // [nombre, ranura, primer paso, retoque (cuerpo de función sobre `st`), comprobación al cargar, comprobación al final]
  const inv = async (i) => ((await fin()) ? (await fin()).inventory : []).filter(x => x === i).length;
  const viejas = [
    ['rotulador ya cogido de Marketing (Acto I)', 't2_a1', 16,
      "st.inventory.push('rotulador_rojo'); st.flags.ecosistema_rotulador_dado = true;",
      async () => ok(await tiene('rotulador_rojo'), '  carga con el rotulador'),
      async () => ok(await inv('rotulador_rojo') === 1, '  el D1 no da un segundo rotulador')],
    ['manual por la vía vieja (pegatina + «Ticket 0.441», CMS vivo)', 't2_cms', 24,
      "st.flags.vio_pegatina_fax = true; st.dialogs = st.dialogs || {}; st.dialogs['paco.P1.fax441'] = true; st.dialogs['paco.P0.consultor'] = true;",
      async () => ok(await cuantos('manual_fax') === 1 && await G(() => !!__game.game.state.dialogs['paco.P.consultor']), '  un solo manual; las opciones gastadas de Eutimio se conservan'),
      async () => ok(await inv('manual_fax') === 1, '  sigue con un solo manual')],
    ['CMS arreglado por el ticket nº 3, sin la R-3 ni el manual', 't2_r3', 24,
      "st.flags.cms_vivo = true; st.flags.vio_ticket_3 = true; st.flags.paco_dio_manual = false; st.inventory = st.inventory.filter(i => i !== 'manual_fax'); st.objects['pecera.enchufe_pantalla'] = { state: 'con_ticket' };",
      async () => ok(await tiene('manual_fax') && await objState('regleta_r3') === 'apagada', '  recibe el manual; la R-3, apagada (la escena no se repite)'),
      async () => ok(await inv('manual_fax') === 1, '  el D2 se remata con él')],
    ['la coma con Aurora a medias (Evaristo escuchado, sin correo)', 't2_b', 32,
      "st.flags.correo_evaristo_listo = false; st.flags.coma_bendecida = false; st.inventory = st.inventory.filter(i => i !== 'correo_evaristo');",
      async () => ok(await cuantos('correo_evaristo') === 1 && await flag('correo_evaristo_listo'), '  recibe el correo (remate C del D4)'),
      async () => ok(!!(await fin()).flags.duelo_inigo_ganado, '  el D4 se gana con él')],
    ['la L3 pendiente (pieza por recortar) y la L5 por sonar', 't2_firma', 37,
      "delete st.once['once:evaristo_L3']; delete st.once['once:evaristo_L5'];",
      async () => ok(true, '  carga'),
      async () => ok(!(await logHas('Begoña me manda el triplicado')) && !(await logHas('¿Lleva mi correo?')), '  no suenan ni la L3 ni la L5')],
    ['en pleno atasco de la puerta', 't2_a2', 20,
      "Object.assign(st.flags, { sala_becario_sin_turno: true, gertrudis_pregunta: true, sala_amazonas_atasco: true, sala_amazonas_orden_visto: true }); st.room = 'sala_amazonas'; if (st.actors) delete st.actors.bruno;",
      async () => ok(await flag('reunion_terminada') === true && !(await flag('sala_amazonas_atasco')), '  el atasco se resuelve al cargar'),
      async () => ok(!!(await fin()).flags.casilla_hueco, '  y el D1 se juega')],
  ];
  for (const [nom, slot, desde, cambio, alCargar, alFinal] of viejas) {
    await partidaVieja(slot, 't2_vieja', cambio);
    await alCargar();
    await clearLog();
    let terminada = true;
    try {
      // con la reunión ya terminada (atasco resuelto, o la ranura es de después), los pasos 26-28 sobran
      const reunionHecha = await flag('reunion_terminada');
      const resto = STEPS.map(s => s.n).filter(n => n >= desde && !(reunionHecha && [26, 27, 28].includes(n)));
      await jugar(resto);
    } catch (e) { terminada = false; console.log('    ' + (e instanceof StepFail ? e.message : e)); }
    ok(terminada && !!((await fin()) && (await fin()).flags.juego_terminado), `${nom}: carga y se termina`);
    if (terminada) await alFinal();
  }

  const errs = await G(() => __game.errors.filter(e => !e.warn).map(e => e.msg));
  ok(!errs.length, 'sin errores del motor ' + errs.join(' | '));
} catch (e) {
  failures++;
  console.log('\n  ✗ FALLO: ' + (e instanceof StepFail ? e.message : (e && e.stack) || e));
  try {
    const log = await G(() => __game.log.slice(-12).map(l => `${l.who || '—'}: ${l.text}`));
    console.log('    últimas líneas:\n      ' + log.join('\n      '));
    await shot('fallo');
  } catch (_) { /* ignore */ }
}
if (consoleErrors.length) { failures++; console.log('\nErrores de consola:\n  ' + consoleErrors.join('\n  ')); }
console.log(failures ? `\nGUION3-T2: FALLA (${failures} de ${checks})` : `\nGUION3-T2: OK (${checks} comprobaciones)`);
await browser.close();
server.close();
process.exit(failures ? 1 : 0);
