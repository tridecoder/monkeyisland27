#!/usr/bin/env node
// Test del paquete P2 del PLAN DE COMEDIA (Redacción `pecera` + Despachos `pajarera`; docs/guion2/PLAN_COMEDIA.md §4.1-4.3,
// §5.4, §5.5, §5.10, §5.11, §5.14, §5.15, §7.4-7.7, §8.3 y ENMIENDA E1). Juega la parte de P2 vía window.__game, simulando
// con setFlag / giveItem lo que viene de otros paquetes, y comprueba flags, objetos, presencia de PNJ, líneas clave del
// log, reglas de la casa (Lector Medio, Diseño/Infografía, coro) y que no haya errores de consola ni del motor.
//   node tools/test-comedia-p2.mjs              modo rápido
//   node tools/test-comedia-p2.mjs --capturas   además, capturas de los momentos nuevos en tools/shots/comedia-p2-*.png
//   node tools/test-comedia-p2.mjs --solo-capturas
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from './serve.mjs';
import { createRunner, StepFail } from './walk-lib.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const capturas = process.argv.includes('--capturas');
const soloCapturas = process.argv.includes('--solo-capturas');

const server = createServer(path.resolve(here, '..'));
await new Promise(r => server.listen(0, r));
const base = `http://localhost:${server.address().port}/`;
const browser = await chromium.launch();
const consoleErrors = [];
let n = 0, failed = null;
const ok = (msg) => console.log(`  ✓ ${String(++n).padStart(2)} ${msg}`);
const must = (c, msg) => { if (!c) throw new StepFail(msg); };

async function abrir() {
  const page = await browser.newPage({ viewport: { width: 960, height: 600 } });
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));
  await page.goto(base + '?room=vestibulo');
  await page.waitForFunction(() => !!window.__game && __game.state().room === 'vestibulo', null, { timeout: 30000 });
  const R = createRunner(page);
  await R.startDismisser();
  const { G } = R;
  const T = {
    page, R, G,
    flag: (k) => G(k => __game.getFlag(k), k),
    setFlag: (k, v = true) => G(([k, v]) => __game.setFlag(k, v), [k, v]),
    give: (id) => G(id => __game.giveItem(id), id),
    take: (id) => G(id => __game.takeItem(id), id),
    verb: (v, t, i) => G(([v, t, i]) => __game.doVerb(v, t, i), [v, t, i || null]),
    idle: () => G(() => __game.waitIdle()),
    logHas: (txt) => G(t => __game.log.some(l => String(l.text).includes(t)), txt),
    log: () => G(() => __game.log.map(l => ({ who: l.who, text: String(l.text) }))),
    clearLog: () => G(() => __game.clearLog()),
    roomOf: async (id) => { const s = await R.state(); return s.actors[id] && s.actors[id].room; },
    actor: (id) => G(id => { const a = __game.game.actors[id]; return a ? { room: a.room, x: a.x, y: a.y, visible: a.visible } : null; }, id),
    inRoom: (id) => G(id => __game.objects().some(o => o.id === id && o.visible !== false), id),
    goto: async (room, entry) => { await G(([r, e]) => __game.gotoRoom(r, e), [room, entry]); await G(() => __game.waitIdle()); },
    hablar: async (id) => { await G(([v, t]) => __game.doVerb(v, t, null), ['hablar', id]); await G(() => __game.waitIdle()); },
    opcion: async (t) => { await R.chooseByText(t); await G(() => __game.waitIdle()); },
    opciones: async () => (await R.state()).dialog || [],
  };
  T.expectFlags = async (obj, ctx) => {
    for (const [k, v] of Object.entries(obj)) { const got = await T.flag(k); must(v === false ? !got : got === v, `${ctx}: flag ${k} = ${JSON.stringify(got)}, se esperaba ${JSON.stringify(v)}`); }
  };
  T.expectInv = async (tiene = [], notiene = [], ctx = '') => {
    const inv = (await R.state()).inventory;
    for (const i of tiene) must(inv.includes(i), `${ctx}: falta ${i} en el inventario`);
    for (const i of notiene) must(!inv.includes(i), `${ctx}: ${i} sigue en el inventario`);
  };
  T.musts = async (lines, ctx) => { for (const l of lines) must(await T.logHas(l), `${ctx}: falta «${l}»`); };
  return T;
}
const BASE_FLAGS = ['intro_vista', 'celestino_dio_chicle', 'tarjeta_con_chicle', 'foto_en_organigrama', 'torno_abierto'];
const INFOGRAFIA = /Infograf|Herminia|PORTÁTIL:|Leoncio/;

try {
  if (!soloCapturas) await principal();
  if (capturas || soloCapturas) await sacarCapturas();
} catch (e) {
  failed = e;
}
await browser.close();
server.close();
if (failed) { console.log(`\n✗ FALLO: ${failed.message}`); if (!(failed instanceof StepFail)) console.log(failed.stack); process.exit(1); }
console.log(`\nP2 OK (${n} comprobaciones)`);

async function principal() {
  const T = await abrir();
  const { G, R } = T;
  await G(() => __game.skipText(true));
  console.log('Paquete P2 (plan de comedia) · Redacción + Despachos\n');

  // ------------------------------------------------------------ 7.2 (§5.11): sin Valentín, sin Leoncio ni Anselmo
  for (const f of BASE_FLAGS) await T.setFlag(f);
  await T.clearLog();
  await T.goto('pecera', 'vestibulo');
  await T.expectFlags({ inigo_presentado: true }, '7.2');
  await T.musts(['Vengo a reimaginar el perímetro.', 'No hay despidos, Yoli. Hay noticias mal posicionadas.',
    'Coste cero, disponibilidad total. Te tengo en la matriz, Vacante.', 'Te ha puesto en rosa. Yo me preocuparía'], '7.2');
  let lg = await T.log();
  must(lg.filter(l => /Diseño/.test(l.text)).length === 1, '7.2: «Diseño» debe sonar exactamente una vez');
  const mal72 = lg.filter(l => ['valentin_reticula', 'leoncio_quesitos', 'anselmo_monolito', 'herminia_portatil'].includes(l.who) || INFOGRAFIA.test(l.text));
  must(!mal72.length, '7.2: habla Valentín o Infografía: ' + JSON.stringify(mal72));
  must(!(await T.logHas('El rosa es "emociones"')), '7.2: el rosa se sigue explicando en la escena');
  ok('7.2 retocada: «noticias mal posicionadas», rosa sin explicar, un solo «Diseño», sin Valentín ni Infografía');

  // ------------------------------------------------------------ §4.3 la chaqueta: Redacción → Despachos → matriz
  await T.verb('coger', 'chaqueta_ramirez_hotspot');
  await T.expectInv(['chaqueta_ramirez', 'sobre_azucar'], [], 'paso 9');
  await T.clearLog();
  await T.verb('usar', 'chaqueta_ramirez');
  await T.expectFlags({ bruno_con_chaqueta: true }, '4.3 ponérsela');
  await T.musts(['Por un segundo te he respetado.', '¿Viene a por el yogur?'], '4.3 Redacción');
  await T.verb('usar', 'silla_ramirez');
  must(await T.logHas('la silla sigue siendo suya. Y yo, encima.'), '4.3: silla con la chaqueta puesta');
  ok('4.3 Redacción: Usar chaqueta → bruno_con_chaqueta; Yoli y el coro; la silla');
  await T.clearLog();
  await R.travel('pajarera'); await T.idle();
  await T.musts(['Siéntese donde no se vea.', 'Confunde a la matriz.', 'Aquí manda el que asiente.'], '4.3 Despachos');
  await T.expectFlags({ bruno_con_chaqueta: false }, '4.3 Despachos (se la quita)');
  await T.expectInv(['chaqueta_ramirez'], [], '4.3 Despachos');
  lg = await T.log();
  must(lg.some(l => l.who === 'pantalla_titulator' && l.text.includes('ORGANIGRAMA')), '§8.3: el Titulator no anuncia la hazaña al entrar');
  ok('4.3 Despachos: Íñigo le confunde con Ramírez y Bruno se la quita; §8.3 titular al entrar');
  await T.clearLog();
  await T.verb('usar', 'lector_medio', 'chaqueta_ramirez');
  await T.expectFlags({ chaqueta_en_lector: true, silla_libre: true }, 'paso 10');
  await T.expectInv([], ['chaqueta_ramirez'], 'paso 10');
  await T.musts(['...Ramírez. Ha vuelto. Y asiente.', 'Lo subo a «Ideal».', 'Por tradición, es mía. Por antigüedad, también.'], 'paso 10');
  await T.verb('mirar', 'matriz_2x2'); await T.verb('mirar', 'perchero'); await T.verb('mirar', 'postits');
  await T.musts(['«VACANTE» y «RAMÍREZ (LECTOR)»', 'Aquí colgada no asiente nadie.', 'Uno por estado de ánimo.'], 'matriz/perchero/pósits');
  // el Lector Medio nunca presidiendo ni tras la mesa de un jefe (tampoco con la chaqueta)
  const lec = await G(() => { const g = __game.game, a = g.actors.lector_medio, objs = g.roomObjects();
    const mesa = objs.find(o => o.id === 'mesa_direccion'), gv = objs.find(o => o.id === 'ordenador_gervasio');
    return { x: a.x, y: a.y, mesa: [mesa.x, mesa.x + mesa.w], gv: [gv.x, gv.x + gv.w] }; });
  must(lec.x + 12 < lec.mesa[0] && lec.x + 12 < lec.gv[0], `el Lector Medio está junto a una mesa de mando (${JSON.stringify(lec)})`);
  ok('paso 10: Íñigo levanta la vista y lo sube a «Ideal»; matriz con pósit beige; el Lector, lejos de las mesas de mando');
  await T.verb('mirar', 'ordenador_gervasio');
  for (let i = 0; i < 3; i++) await T.verb('mirar', 'pantalla_titulator');
  await T.expectFlags({ rep_07: true, vio_armario_27: true }, 'pasos 11-12');
  await T.hablar('inigo_sinergia');
  const io = await T.opciones();
  must(!io.some(o => o.includes('Herminia')), 'Íñigo: sigue la opción «¿Conoces a Herminia?»');
  await T.opcion('¿El Titulator escribe solo?');
  await T.opcion('¿Me puede poner en otro cuadrante? Aunque sea "Caro".');
  await T.opcion('Me voy.');
  await T.musts(['Y algo de atún. Lo estamos optimizando.', '«Vacante (histórico)»', 'Eso libera sinergias.'], 'Íñigo §5.11');
  ok('pasos 11-12 y árbol de Íñigo (§5.11)');

  // ------------------------------------------------------------ Redacción, Acto I: Valentín mudo, portátil, Leoncio
  await R.travel('pecera'); await T.idle();
  must(!(await G(() => __game.objects().some(o => o.id === 'monitor_valentin'))), 'monitor_valentin sigue siendo un hotspot');
  must(!(await G(() => !!__game.game.content.dialogs.valentin)), 'Valentín sigue teniendo árbol');
  await T.clearLog();
  await T.verb('mirar', 'valentin_reticula'); await T.hablar('valentin_reticula'); await T.hablar('valentin_reticula');
  await T.verb('dar', 'valentin_reticula', 'sobre_azucar');
  await T.musts(['Cascos puestos. Sin música.', '...Nada. Perdone.', 'Está en la bandeja.', 'Lo alinea con el borde sin mirarlo.'], 'Valentín');
  lg = await T.log();
  must(lg.filter(l => l.who === 'valentin_reticula').length === 1, 'Valentín habla más de una línea');
  ok('§5.14 Valentín: cameo mudo (casco, «Está en la bandeja.»), sin árbol ni monitor');
  await T.clearLog();
  await T.verb('mirar', 'herminia_portatil'); await T.verb('usar', 'herminia_portatil'); await T.verb('hablar', 'herminia_portatil');
  await T.musts(['pegatina «INFOGRAFÍA». Y una tira de cinta encima.', 'PORTÁTIL: › quesito de Desarrollo · suma: 130 %', 'PORTÁTIL: › saludo recibido'], 'portátil');
  lg = await T.log();
  must(!lg.some(l => l.who === 'herminia'), 'Herminia habla como personaje');
  must(lg.filter(l => l.text.startsWith('PORTÁTIL:')).every(l => l.who === 'herminia_portatil' && l.text.startsWith('PORTÁTIL: ›')), 'PORTÁTIL: formato o emisor mal');
  ok('E1.6 portátil (cinta_1): Mirar, Usar, Hablar → «PORTÁTIL: › …» desde el objeto');
  await T.clearLog();
  await T.hablar('leoncio_quesitos');
  await T.opcion('¿Qué es Herminia?');
  await T.opcion('¿Me hace un gráfico a mí?');                                       // XE1
  must(!(await T.opciones()).some(o => o.includes('invade') || o.includes('Anselmo pone')), 'Leoncio: la opción del Acto II sale en el Acto I');
  await T.opcion('Me voy.');
  await T.musts(['un quesito muy fino. Pero se te ve.', 'PORTÁTIL: › Bruno · aportación a la planta: 0,3 %', 'Al currículum.', 'cuidado con Anselmo'], 'Leoncio');
  await T.clearLog();
  await T.hablar('anselmo_monolito');
  await T.opcion('¿Por qué no integras a Herminia?');
  await T.opcion('¿Quién arregla esto de madrugada?');
  await T.opcion('Me voy.');
  await T.musts(['¿De dónde vienes?', 'Lo de fuera que funciona crea precedente.', 'Paco abre ticket. Bajo yo.'], 'Anselmo');
  lg = await T.log();
  must(!lg.some(l => ['leoncio_quesitos', 'anselmo_monolito'].includes(l.who) && /Diseño/.test(l.text)), 'Leoncio o Anselmo dicen «Diseño»');
  ok('E1.6 árboles de Leoncio (XE1) y Anselmo; ninguno dice «Diseño»');

  // ------------------------------------------------------------ §4.2 el apagón (sin vio_ticket_3): la escalada
  await T.clearLog();
  for (let i = 0; i < 4; i++) await T.verb('tirar', 'enchufe_pantalla');
  await T.expectFlags({ apagon_n: 4, cms_vivo: false }, '4.2 apagones');
  await T.musts(['¡Estamos ciegos! ¿Hay alguien leyendo?', 'Ese enchufe está en mis sistemas.', '¿Y si va sin pantalla? Peor.',
    'Si no veo la gráfica, no sé si estoy contenta.', 'Tercera vez. Te paso a BLOQUEADO.', 'Y mira la brida.', 'Eso huele a Paco.',
    'Sin número, a su enchufe.'], '4.2');
  must(!(await G(() => !!__game.game.apagon)), '4.2: la sala se queda a oscuras');
  for (const [id, x] of [['anselmo_monolito', 1082], ['nerea_backlog', 1008], ['yoli_tendencias', 719]]) {
    const a = await T.actor(id);
    must(a.room === 'pecera' && Math.abs(a.x - x) < 3, `4.2: ${id} no vuelve a su sitio (${JSON.stringify(a)})`);
  }
  await T.verb('mirar', 'enchufe_pantalla');
  must(await T.logHas('Etiqueta de la brida: «R-3, SISTEMAS. PACO».'), '4.2: Mirar enchufe');
  ok('4.2 apagón ×4: Anselmo (E1.7), Yoli, Nemesio (no se muda) y «Sin número»; todos vuelven a su mesa');
  await T.clearLog();
  await R.travel('pajarera'); await T.idle();
  lg = await T.log();
  must(lg.some(l => l.who === 'pantalla_titulator' && l.text.includes('TRES VECES')), '§8.3: falta el titular de los tres apagones');
  await R.travel('pecera'); await T.idle();
  ok('§8.3 titular «ALGUIEN DESENCHUFA UNA PANTALLA TRES VECES» al entrar en los Despachos');

  // ------------------------------------------------------------ Yoli y Nemesio
  await T.clearLog();
  await T.hablar('yoli_tendencias');
  must(!(await R.state()).dialog, 'Yoli sin cms_vivo abre menú');
  must(await T.logHas('Ahora no. Se nos cae el CMS.'), 'Yoli sin cms_vivo');
  await T.hablar('nerea_backlog');
  const no = await T.opciones();
  must(no.includes('¿Por qué está bloqueado lo de Herminia?') && !no.some(o => /cinta|madrugada|envuelto/i.test(o)), 'Nemesio: N0 no es el de E1 ' + JSON.stringify(no));
  await T.opcion('¿Por qué está bloqueado lo de Herminia?');
  await T.opcion('¿Qué tal con Yoli?');
  await T.opcion('Me voy.');
  await T.expectFlags({ rep_09: true }, 'paso 24');
  await T.musts(['Si no está en el tablero, no existe. Tú, por ejemplo, en POR HACER.', 'Y a Anselmo lo bloquea Anselmo.', 'No te vengas arriba'], 'Nemesio');
  ok('§5.4 Yoli sin CMS; §5.5 Nemesio (N0 de E1) → rep_09');

  // ------------------------------------------------------------ camino antiguo del enchufe (vio_ticket_3) y entradas
  await T.setFlag('vio_ticket_3');
  await T.clearLog();
  await T.verb('tirar', 'enchufe_pantalla');
  await T.expectFlags({ cms_vivo: true }, '4.2 camino antiguo');
  must((await G(() => __game.game.getObjState('enchufe_pantalla').state)) === 'con_ticket', 'enchufe sin estado con_ticket');
  await T.musts(['¿Tiene número?', 'Lo pongo en HECHO (PERO NO). Desde 2017.', 'He sido yo. Pero gracias.'], 'camino antiguo');
  await T.setFlag('cafetera_viral');
  await R.travel('office'); await T.clearLog(); await R.travel('pecera'); await T.idle();
  must(await T.logHas('Creo que esto es estar tranquila.'), 'primera entrada con cms_vivo');
  await R.travel('office'); await T.clearLog(); await R.travel('pecera'); await T.idle();
  await T.musts(['¡Once mil concurrentes!', 'Tengo don de gentes.', '«abrígate». La cuenta de siempre.'], '4.1 Redacción');
  await R.travel('office'); await T.clearLog(); await R.travel('pecera'); await T.idle();
  must(!(await T.logHas('¡Once mil')) && !(await T.logHas('estar tranquila')), 'las escenas de entrada se repiten');
  ok('camino antiguo → cms_vivo (con_ticket); entradas con cms_vivo y cafetera_viral (§4.1), una vez cada una');
  await T.hablar('yoli_tendencias');
  await T.opcion('¿Algún hilo bueno esta noche?');
  await T.opcion('¿Y tú cómo estás? Tú, no la audiencia.');
  await T.opcion('Me voy.');
  await T.expectFlags({ rep_08: true }, 'paso 23');
  must(await T.logHas('Me ha puesto en copia a mi madre.'), 'Yoli: falta la última línea nueva');
  await T.hablar('coro_desarrollo');
  const co = await T.opciones();
  must(co.length === 4 && co.includes('El CMS lo he arreglado yo.'), 'coro: no son 3 opciones + salida ' + JSON.stringify(co));
  await T.opcion('Me voy.');
  ok('§5.4 Yoli → rep_08; §5.14 coro: 3 opciones + salida');

  // ------------------------------------------------------------ §5.14 ambiente del coro (por datos)
  const amb = await G(() => { const r = __game.game.content.rooms.pecera; return {
    ambient: (r.ambient || []).map(a => ({ id: a.id, every: a.every, n: (a.discusiones || []).length, run: !!a.run })),
    rules: r.ambientRules, src: (r.ambient || []).map(a => String(a.run || '')).join(' ') }; });
  must(amb.ambient.find(a => a.id === 'coro').n === 4, 'coro: no son 4 discusiones');
  must(amb.ambient.every(a => !a.every) && !/setInterval/.test(amb.src), 'coro: quedan `every` o setInterval');
  must(amb.rules.max <= 3 && amb.rules.every[0] >= 60000, 'coro: reglas de ambiente ' + JSON.stringify(amb.rules));
  const diseno = await G(() => { const r = __game.game.content.rooms.pecera; const c = r.ambient.find(a => a.id === 'coro');
    return c.discusiones.map(d => (typeof d === 'function' ? d({ flag: () => false }) : d)).flat().filter(l => /Diseño/.test(l[1])).length; });
  must(diseno === 1, `coro: «Diseño» suena ${diseno} veces en las discusiones`);
  ok('§5.14 coro por el ambiente del motor: 4 discusiones, una sobre Diseño, sin setInterval');

  // ------------------------------------------------------------ E1.4.1 paso 32: Herminia mide la pieza
  await T.setFlag('casilla_fuente'); await T.setFlag('acto_2_iniciado');
  await T.clearLog();
  await T.verb('usar', 'ordenador_bruno');
  await T.expectFlags({ pieza_escrita: true, herminia_midio: true }, 'paso 32');
  await T.expectInv(['pieza_opa'], [], 'paso 32');
  await T.musts(['PORTÁTIL: › pieza_opa · 31 líneas · faldón de la página 7: 23 · sobra: 26 %', 'Yo ya no leo. Superviso.',
    'Quitar siempre es de otro departamento.', '¿De dónde viene esa imagen?', 'Encintar, no. Aislar el componente.',
    'Me han medido antes que Teodoro.'], 'paso 32');
  lg = await T.log();
  must(lg.filter(l => l.text.startsWith('PORTÁTIL:')).length <= 3, 'paso 32: más de tres salidas del portátil');
  must(!lg.some(l => /Diseño/.test(l.text) || l.who === 'valentin_reticula'), 'paso 32: Diseño en una escena de Infografía');
  const an = await T.actor('anselmo_monolito');
  must(Math.abs(an.x - 1082) < 3, 'paso 32: Anselmo no vuelve a su mesa');
  await T.clearLog();
  await T.verb('mirar', 'herminia_portatil'); await T.verb('usar', 'herminia_portatil', 'pieza_opa'); await T.verb('dar', 'leoncio_quesitos', 'pieza_opa');
  await T.musts(['Dos tiras de cinta.', '› pieza_opa · ya medida · sobra: 26 %', 'Te la ha medido ella. Yo te la sostengo'], 'tras el paso 32');
  await T.hablar('anselmo_monolito');
  await T.opcion('¿Por qué invades la sección de Leoncio?');                         // XE2
  await T.opcion('Me voy.');
  must(await T.logHas('Invadir, no. Desplegar capacidad.'), 'XE2 Anselmo');
  ok('E1.4.1 paso 32 → pieza_opa, herminia_midio (cinta_2), pista del 26 %; XE2');

  // ------------------------------------------------------------ E1.4.2 momento 8: Dos IAs
  await T.setFlag('pieza_recortada'); await T.setFlag('acto_3_iniciado'); await T.setFlag('pagina_cerrada');
  await T.take('pieza_opa'); await T.take('ficha_pagina_7');
  await R.travel('catacumba'); await T.clearLog(); await R.travel('pecera'); await T.idle();
  await T.expectFlags({ dos_ias_vista: true, anselmo_dijo_regla: true }, 'momento 8');
  await T.musts(['Última vuelta. Sellado.', 'PORTÁTIL: › titulares por hora · picos: 14:00 y 14:30', 'PORTÁTIL: › origen: Sistemas, armario 27 · consumo: atún',
    'Lo que tiene alta es de la casa. Lo de fuera, a la cinta.', 'Eso no es un modelo. Eso es un compañero.'], 'momento 8');
  lg = await T.log();
  must(!lg.some(l => /Diseño/.test(l.text) || l.who === 'valentin_reticula'), 'momento 8: Diseño en una escena de Infografía');
  await T.verb('mirar', 'herminia_portatil'); await T.verb('usar', 'herminia_portatil');
  await T.musts(['Envuelta entera. «PENDIENTE DE INTEGRAR».', 'La han integrado en un paquete.'], 'portátil en paquete');
  ok('E1.4.2 momento 8 → dos_ias_vista, anselmo_dijo_regla (portátil en paquete)');

  // ------------------------------------------------------------ §5.10 Gervasio en la puerta + D3 (derrota y victoria)
  for (const f of ['reunion_terminada', 'rep_01', 'rep_14', 'ruben_encontrado']) await T.setFlag(f);
  await T.give('fotocopia_nota_direccion');
  await R.travel('pajarera'); await T.idle();
  const gvp = await T.actor('gervasio_acta');
  must(gvp.room === 'pajarera' && Math.abs(gvp.x - 276) < 3, 'Acto III: Gervasio no está en la puerta ' + JSON.stringify(gvp));
  must((await T.roomOf('inigo_sinergia')) !== 'pajarera' && (await T.roomOf('lector_medio')) !== 'pajarera', 'Acto III: Íñigo o el Lector siguen aquí');
  await T.clearLog();
  await T.verb('usar', 'puerta_sala');
  must(await T.logHas('Sin acta de la anterior no se abre la siguiente.'), 'puerta sin acta');
  await T.hablar('gervasio_acta');
  await T.opcion('¿Usted ha escrito alguna vez algo?');
  await T.opcion('Si quiere, le escribo yo el acta.');
  await T.musts(['Se te iba a llamar. Por alguien.', 'Se firmó un acuse de recibo. En 2007.', 'Se agradece la iniciativa igual. Se archiva.'], 'GV_PUERTA');
  // derrota: tres flojas
  await T.opcion('Necesito el acta de la última reunión.');
  for (let g = 0; g < 60; g++) {
    const st = await R.state();
    if (!st.duel) break;
    if (st.duel.phase === 'reply' && st.dialog) await G(k => __game.chooseDialog(k), st.duel.weakIndex);
    else await T.page.waitForTimeout(30);
  }
  await T.idle();
  must((await T.flag('duel:gervasio:perdido_n')) === 1, 'D3: no cuenta la derrota');
  await T.musts(['«Lo que diga Gervasio.»', '...¿Yo? Asignado a ti. El acta, digo.', 'Mi primera acta.', 'Es un diario.', 'LA ARCHIVA EN "DIARIOS"'], 'D3 derrota');
  ok('§5.10 Gervasio en la puerta (Acto III) y D3 perdido: línea, escena del acta-diario y titular (§7.7)');
  await R.closeDialog(); await T.idle();
  await T.clearLog();
  await T.hablar('gervasio_acta');
  await T.opcion('Necesito el acta de la última reunión.');
  await R.playDuel(['R07', 'R01', 'R14', { objeto: 'fotocopia_nota_direccion' }]);
  await T.idle();
  await T.expectFlags({ duelo_gervasio_ganado: true, sala_abierta: true }, 'paso 39');
  await T.expectInv(['acta_reunion'], ['fotocopia_nota_direccion'], 'paso 39');
  await T.musts(['Mejor por escrito. Que conste que lo has pedido tú.', 'Yo con Hidrovoltia no he comido en mi vida.', '312 euros',
    'Se habló un poco.', 'uno, pedir más café. Dos, ninguno más.'], 'D3 victoria');
  must((await T.roomOf('gervasio_acta')) !== 'pajarera', 'tras D3 Gervasio sigue en los Despachos');
  ok('paso 39: D3 (R07, R01, R14 + remate fotocopia) → acta_reunion, sala_abierta; Gervasio se va');

  // ------------------------------------------------------------ §5.5 N_SALIDA (paso 38) con E1.4.3
  await R.travel('pecera'); await T.idle();
  await T.setFlag('rep_13'); await T.give('album_eventos');
  await T.clearLog();
  await T.verb('dar', 'nerea_backlog', 'album_eventos');
  await T.opcion('No es un despido: es una salida en valor.');
  await R.closeDialog(); await T.idle();
  await T.expectFlags({ posit_descopeado: true, ruben_libre: true }, 'paso 38');
  await T.expectInv(['ticket_n1'], ['album_eventos'], 'paso 38');
  await T.musts(['Es consultoría.', 'Columna nueva. La primera desde 1998.', 'No se lo digas a Anselmo.', 'No subo. Nunca subo. Paco.',
    'Estoy esperando a que salga el sol.', 'Revocado. Con fecha de hoy. Y de julio.', 'Integró una IA que era un becario.',
    'SEGUIREMOS INFORMANDO. Perdón.'], 'N_SALIDA');
  must((await T.roomOf('ruben')) === 'pecera', 'N_SALIDA: Rubén no está en la Redacción');
  ok('§5.5 N_SALIDA → ticket_n1, ruben_libre, Rubén a la ventana; E1.4.3 (Revocado, Leoncio, «No se lo digas a Anselmo»)');

  // ------------------------------------------------------------ E1.5 anexión (MP1) y titular
  await T.setFlag('herminia_de_alta');
  await R.travel('office'); await T.clearLog(); await R.travel('pecera'); await T.idle();
  await T.expectFlags({ infografia_integrada: true }, 'anexión');
  await T.musts(['Entonces es estupenda.', 'Quitar, no. Absorber en plataforma.', 'PORTÁTIL: › propietario: Desarrollo',
    'Todo esto es Desarrollo.', 'Me han anexionado. Pero integrada'], 'anexión');
  lg = await T.log();
  must(!lg.some(l => /Diseño/.test(l.text) || l.who === 'valentin_reticula'), 'anexión: Diseño en una escena de Infografía');
  await T.verb('mirar', 'herminia_portatil'); await T.verb('mirar', 'frontera_carrocero'); await T.hablar('ruben');
  await T.musts(['Pegatina nueva: «DESARROLLO».', 'Queda la marca del pegamento.', 'Yo también. Pero sin pegatina.'], 'tras la anexión');
  await T.clearLog();
  await R.travel('pajarera'); await T.idle();
  must(await T.logHas('UNA HERRAMIENTA CONSIGUE CONTRATO EN 40 SEGUNDOS'), '§8.3: falta el titular de herminia_de_alta');
  ok('E1.5 anexión → infografia_integrada; Rubén; titular «UNA HERRAMIENTA CONSIGUE CONTRATO» (§8.3)');

  // ------------------------------------------------------------ errores
  const engineErrors = await G(() => __game.log.filter(l => l.who === 'error' || /^\[motor\]/.test(String(l.text))).map(l => l.text));
  must(!engineErrors.length, 'errores del motor: ' + engineErrors.join(' | '));
  must(!consoleErrors.length, 'errores de consola: ' + consoleErrors.join(' | '));
  ok('sin errores de consola ni del motor');

}

// ================================================================== capturas
async function sacarCapturas() {
  const dir = path.join(here, 'shots');
  fs.mkdirSync(dir, { recursive: true });
  const shotWhen = async (T, texto, nombre, ms = 400) => {
    for (let i = 0; i < 400; i++) {
      if (await T.logHas(texto)) { await T.page.waitForTimeout(ms); await T.page.screenshot({ path: path.join(dir, `comedia-p2-${nombre}.png`) }); return; }
      await T.page.waitForTimeout(100);
    }
    throw new StepFail(`captura ${nombre}: no aparece «${texto}»`);
  };
  const sin = (T, fn) => { const p = fn(); p.catch(() => {}); T.pend = p; };
  const prep = async (flags, items = []) => {
    const T = await abrir();
    await T.G(() => __game.skipText(true));
    for (const f of [...BASE_FLAGS, 'inigo_presentado', ...flags]) await T.setFlag(f);
    for (const i of items) await T.give(i);
    return T;
  };
  const lento = async (T) => { await T.G(() => __game.skipText(false)); };
  // 1. apagón vez 1
  let T = await prep(['silla_libre', 'chaqueta_cogida']);
  await T.goto('pecera', 'vestibulo'); await lento(T);
  sin(T, () => T.verb('tirar', 'enchufe_pantalla'));
  await shotWhen(T, '¡Ha entrado una pieza!', 'apagon');
  await shotWhen(T, 'Ese enchufe está en mis sistemas.', 'apagon-anselmo');
  if (T.pend) await T.pend.catch(() => {});
  await T.idle(); await T.page.close();
  // 2. paso 32 y momento 8, anexión
  T = await prep(['silla_libre', 'chaqueta_cogida', 'casilla_fuente', 'acto_2_iniciado', 'cafetera_viral']);
  await lento(T);
  sin(T, () => T.goto('pecera', 'vestibulo'));
  await shotWhen(T, '¡Once mil concurrentes!', 'viral');
  await T.pend; await T.idle();
  sin(T, () => T.verb('usar', 'ordenador_bruno'));
  await shotWhen(T, 'sobra: 26 %', 'paso32-portatil');
  await shotWhen(T, '¿De dónde viene esa imagen?', 'paso32-anselmo');
  await T.idle();
  await T.G(() => __game.skipText(true));
  await T.setFlag('acto_3_iniciado'); await T.setFlag('reunion_terminada');
  await T.R.travel('catacumba'); await T.idle(); await lento(T);
  sin(T, () => T.R.travel('pecera'));
  await shotWhen(T, 'consumo: atún', 'dos-ias');
  await T.idle();
  await T.G(() => __game.skipText(true));
  await T.setFlag('herminia_de_alta');
  await T.R.travel('office'); await T.idle(); await lento(T);
  sin(T, () => T.R.travel('pecera'));
  await shotWhen(T, 'propietario: Desarrollo', 'anexion');
  await T.idle();
  if (T.pend) await T.pend.catch(() => {});
  await T.idle(); await T.page.close();
  // 3. Despachos: matriz con la chaqueta, Gervasio en la puerta, titular
  T = await prep(['chaqueta_cogida'], ['chaqueta_ramirez']);
  await T.goto('pajarera', 'pecera'); await T.idle(); await lento(T);
  sin(T, () => T.verb('usar', 'lector_medio', 'chaqueta_ramirez'));
  await shotWhen(T, 'Lo subo a «Ideal».', 'matriz-ramirez');
  await T.idle();
  await T.G(() => __game.skipText(true));
  for (const f of ['acto_3_iniciado', 'reunion_terminada', 'ruben_encontrado', 'cms_vivo']) await T.setFlag(f);
  await T.R.travel('pecera'); await T.idle(); await lento(T);
  sin(T, () => T.R.travel('pajarera'));
  await shotWhen(T, 'LOS SIGUIENTES PASOS. HAY HERIDOS', 'titular-gervasio-puerta', 300);
  if (T.pend) await T.pend.catch(() => {});
  await T.idle(); await T.page.close();
}
