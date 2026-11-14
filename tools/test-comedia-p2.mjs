#!/usr/bin/env node
// Test del paquete P2 (Redacción `pecera` + Despachos `pajarera`): plan de comedia (§4.1-4.3, §5.4, §5.10, §5.11, §5.14,
// §5.15, §7.4-7.7, §8.3), ENMIENDA E1 y ENMIENDA E2 (§2 entero: 7.2 con la IA de Leoncio, paso 34 «El modelo es de fuera.
// El prompt es de dentro.», momento 8, paso 40 con la salida en valor de Anselmo, árboles, fusión Nemesio → Anselmo,
// Yoli; §4.2.3 el adhesivo; §6, §7, §8, §9 en estas salas). Juega la parte de P2 vía window.__game, simulando con
// setFlag / giveItem lo que viene de otros paquetes, y comprueba flags, objetos, presencia de PNJ, líneas clave del log,
// reglas de la casa (Lector Medio, Diseño/Infografía, coro, Desarrollo) y que no haya errores de consola ni del motor.
//   node tools/test-comedia-p2.mjs              modo rápido
//   node tools/test-comedia-p2.mjs --capturas   además, capturas de las escenas nuevas en tools/shots/e2-p2-*.png
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
const HERMINIA = 'HERMINIA (IA) › ';

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
  console.log('Paquete P2 (E2) · Redacción + Despachos\n');
  const sinNemesio = async (ctx) => {
    const lg = await T.log();
    must(!lg.some(l => l.who === 'nerea_backlog' || /Nemesio|PORTÁTIL:/.test(l.text)), `${ctx}: aparece Nemesio o «PORTÁTIL:»`);
    must(lg.filter(l => l.text.startsWith(HERMINIA)).every(l => l.who === 'herminia_portatil' && l.text.length <= 80), `${ctx}: línea de Herminia mal`);
  };

  // ------------------------------------------------------------ 7.2 (E2 §2.3.1): Íñigo, el Titulator y la IA de Leoncio
  for (const f of BASE_FLAGS) await T.setFlag(f);
  must((await T.roomOf('nerea_backlog')) !== 'pecera', 'Nemesio sigue en la Redacción');
  await T.clearLog();
  await T.goto('pecera', 'vestibulo');
  await T.expectFlags({ inigo_presentado: true }, '7.2');
  await T.musts(['¡No entra nada! El CMS, el programa de publicar, lleva dos horas colgado.', 'Vengo a reimaginar el perímetro.',
    'Trescientos titulares esta tarde. Sin CMS. Sin silla. Sin convenio.', 'Aquí ya tenemos una IA. Herminia. Hace sola las infografías.',
    '¿Cuánto factura?', 'Entonces no es una IA. Es un hobby.', 'Y no ha pasado por mis sistemas.',
    HERMINIA + 'cinta de Desarrollo · tiras: 1 · motivo: no consta', 'Coste cero, disponibilidad total. Te tengo en la matriz, Vacante.'], '7.2');
  let lg = await T.log();
  must(lg.length <= 19, `7.2: ${lg.length} líneas (guion: 17)`);
  must(!lg.some(l => /Diseño/.test(l.text) || l.who === 'valentin_reticula' || l.who === 'coro_desarrollo'), '7.2: Diseño, Valentín o el coro en la escena');
  must(!(await T.logHas('Las seis y media. Se ha ido todo el mundo.')), '7.2: sigue el cierre de Bruno');
  await sinNemesio('7.2');
  must(Math.abs((await T.actor('anselmo_monolito')).x - 1082) < 3, '7.2: Anselmo no vuelve a su sitio');
  ok('7.2 E2: 17 líneas; Leoncio presenta a Herminia como IA, Íñigo «hobby», Anselmo la encinta; sin Diseño ni coro');

  // ------------------------------------------------------------ §4.3 la chaqueta: Redacción → Despachos → matriz
  await T.verb('mirar', 'silla_ramirez');
  must(await T.logHas('En el bolsillo, un tique: «1 cruasán. Para tomar aquí».'), 'L10');
  await T.verb('hablar', 'chaqueta_ramirez_hotspot');
  must(await T.logHas('Uno de la guardia, sin mirar: «Presente».'), 'L12');
  await T.verb('coger', 'chaqueta_ramirez_hotspot');
  await T.expectInv(['chaqueta_ramirez', 'sobre_azucar'], [], 'paso 9');
  must(await T.logHas('Es casi un ticket de gasto.'), 'L11');
  await T.clearLog();
  await T.verb('usar', 'chaqueta_ramirez');
  await T.expectFlags({ bruno_con_chaqueta: true }, '4.3 ponérsela');
  await T.musts(['Por un segundo te he respetado.', '¿Viene a por el yogur?'], '4.3 Redacción');
  await T.verb('usar', 'silla_ramirez');
  must(await T.logHas('la silla sigue siendo suya. Y yo, encima.'), '4.3: silla con la chaqueta puesta');
  ok('L10-L12 (silla, chaqueta, sobre) y 4.3 Redacción');
  await T.clearLog();
  await R.travel('pajarera'); await T.idle();
  await T.musts(['Ramírez. Bolsa. «Prescindible». Siéntese donde no se vea.', 'Confunde a la matriz.', 'Aquí manda el que asiente.'], '4.3 Despachos');
  await T.expectFlags({ bruno_con_chaqueta: false }, '4.3 Despachos (se la quita)');
  lg = await T.log();
  must(lg.some(l => l.who === 'pantalla_titulator' && l.text.includes('ORGANIGRAMA')), '§8.3: el Titulator no anuncia la hazaña al entrar');
  ok('4.3 Despachos (sin «desde 2019»); §8.3 titular al entrar');
  await T.clearLog();
  await T.verb('usar', 'lector_medio', 'chaqueta_ramirez');
  await T.expectFlags({ chaqueta_en_lector: true, silla_libre: true }, 'paso 10');
  await T.musts(['...Ramírez. Ha vuelto. Y asiente.', 'Lo subo a «Ideal».'], 'paso 10');
  const lec = await G(() => { const g = __game.game, a = g.actors.lector_medio, objs = g.roomObjects();
    const mesa = objs.find(o => o.id === 'mesa_direccion'), gv = objs.find(o => o.id === 'ordenador_gervasio');
    return { x: a.x, y: a.y, mesa: [mesa.x, mesa.x + mesa.w], gv: [gv.x, gv.x + gv.w] }; });
  must(lec.x + 12 < lec.mesa[0] && lec.x + 12 < lec.gv[0], `el Lector Medio está junto a una mesa de mando (${JSON.stringify(lec)})`);
  ok('paso 10; el Lector Medio, lejos de las mesas de mando');
  await T.clearLog();
  await T.verb('mirar', 'ordenador_gervasio');
  for (let i = 0; i < 3; i++) await T.verb('mirar', 'pantalla_titulator');
  await T.expectFlags({ rep_07: true, vio_armario_27: true }, 'pasos 11-12');
  must(await T.logHas('Enviados. Gervasio a Teodoro: "Me consta que esto ya lo hablamos".') && !(await T.logHas('Sesión abierta.')) && !(await T.logHas('Me la apunto.')), 'paso 11 (E2 §7.4)');
  await T.verb('mirar', 'persiana'); await T.verb('mirar', 'puerta_sala'); await T.verb('cerrar', 'puerta_sala');
  await T.musts(['Persiana a media altura. Mitad transparencia', 'Debajo, a boli: "Y EN CURSO".', 'Tiene una cuña. Si la quito'], '§8 Despachos');
  await T.hablar('inigo_sinergia');
  await T.opcion('¿Me puede poner en otro cuadrante? Aunque sea "Caro".');
  await T.opcion('¿Y si en la Reunión de Dirección dicen que no?');
  must(!(await T.opciones()).includes('¿Y si en la Reunión de Dirección dicen que no?'), '§7.6: la de la Reunión de Dirección no es once');
  await T.opcion('Me voy.');
  await T.musts(['«Vacante (histórico)»', 'Siguiente.', 'Eso libera sinergias.'], 'Íñigo');
  must(!(await T.logHas('Primer ascenso en seis años')), 'L15: sigue la línea de Bruno');
  ok('pasos 11-12 (E2: «Enviados.» sin coletilla), §8 Despachos, Íñigo (L15 «Siguiente.», §7.6 once)');

  // ------------------------------------------------------------ Redacción, Acto I: Valentín mudo, Herminia, Leoncio, Anselmo
  await R.travel('pecera'); await T.idle();
  await T.clearLog();
  await T.verb('mirar', 'valentin_reticula'); await T.hablar('valentin_reticula'); await T.hablar('valentin_reticula');
  await T.musts(['Cascos puestos. Sin música.', '...Nada. Perdone.', 'Está en la bandeja.'], 'Valentín');
  lg = await T.log();
  must(lg.filter(l => l.who === 'valentin_reticula').length === 1, 'Valentín habla más de una línea');
  ok('§5.14 Valentín: cameo mudo');
  await T.clearLog();
  must((await G(() => __game.objects().find(o => o.id === 'herminia_portatil').name)) === 'Herminia, la IA de Infografía', 'E2 §2.2: nombre del portátil');
  await T.verb('mirar', 'herminia_portatil'); await T.verb('usar', 'herminia_portatil'); await T.verb('hablar', 'herminia_portatil');
  await T.musts(['Herminia, la IA de Leoncio: un portátil que hace solo las infografías.', 'Mirándola. Encima, una tira de cinta.',
    HERMINIA + 'quesito de Desarrollo · suma: 130 % · corregir: bloqueado', 'Ella lo arreglaría en una décima.',
    HERMINIA + 'saludo recibido · hola: 100 %', 'Me ha entendido a la primera. Aquí eso no pasa.'], 'portátil');
  lg = await T.log();
  must(!lg.some(l => l.who === 'herminia'), 'Herminia habla como personaje');
  await sinNemesio('portátil');
  ok('E2 §2.2 «Herminia, la IA de Infografía» (cinta_1): Mirar, Usar, Hablar → «HERMINIA (IA) › …»');
  await T.clearLog();
  await T.hablar('leoncio_quesitos');
  await T.opcion('¿Qué es Herminia?');
  await T.opcion('¿Y tu departamento?');
  await T.opcion('¿Por qué no se publica lo que hace?');
  await T.opcion('¿Me hace un gráfico a mí?');                                       // XE1
  must(!(await T.opciones()).some(o => o.includes('gráficos de Anselmo')), 'Leoncio: la opción del Acto II sale en el Acto I');
  await T.opcion('Me voy.');
  await T.musts(['Vacante. En tarta, eres un quesito muy fino.', 'Mi IA. La hice yo, en tres fines de semana.', 'Me duele, pero me incluyo.',
    'Dejaron las chaquetas en las sillas, mirándola. Por respeto.', 'Le he mandado cuarenta y un pósits.', 'En su tipografía, que es fea.',
    HERMINIA + 'Bruno · aportación a la planta: 0,3 % · tendencia: plana', 'Cuidado con la cinta. Se ha movido desde que has llegado.'], 'Leoncio');
  must(!(await T.logHas('Al currículum.')), 'L14: sigue la línea de Bruno');
  await T.clearLog();
  await T.hablar('anselmo_monolito');
  const ao = await T.opciones();
  must(ao.length === 4 && ao[0] === '¿Por qué bloqueas a Herminia?' && ao.includes('¿Qué tal con Yoli?'), 'Anselmo, Acto I: 4 opciones ' + JSON.stringify(ao));
  await T.opcion('¿Por qué bloqueas a Herminia?');
  await T.opcion('¿Qué tal con Yoli?');                                              // paso 24 (E2)
  await T.opcion('Me voy.');
  await T.expectFlags({ rep_09: true }, 'paso 24');
  await T.musts(['Alto. Esto es Desarrollo. ¿Traes algo de fuera?', 'Solo a mí.', 'Lo vacío no se integra, pero tampoco molesta.',
    'Peor. Si funciona, la gente se acostumbra.', 'Paco abre ticket. Bajo yo.', 'Tráeme el contexto. Le hago una pieza aparte',
    'Cierra la frontera al salir. No tiene puerta. Ciérrala igual.'], 'Anselmo');
  must(!(await T.logHas('Bueno, ella no come. Mide.')), 'sigue «ella no come»');
  await T.hablar('anselmo_monolito'); await T.opcion('Me voy.');
  must(await T.logHas('¿Otra vez cruzando? Te voy a pedir visado.'), 'Anselmo: saludo de las siguientes veces');
  lg = await T.log();
  must(!lg.some(l => ['leoncio_quesitos', 'anselmo_monolito'].includes(l.who) && /Diseño/.test(l.text)), 'Leoncio o Anselmo dicen «Diseño»');
  ok('E2 §2.5 Leoncio (P5-P7, L14) y Anselmo (saludo, [1], paso 24 → rep_09, despedida); ninguno dice «Diseño»');

  // ------------------------------------------------------------ E2 §2.6.5: la mesa de guardia y los hotspots de Nemesio
  await T.clearLog();
  for (const [v, o] of [['mirar', 'mesa_guardia'], ['usar', 'mesa_guardia'], ['coger', 'mesa_guardia'], ['coger', 'kanban'],
    ['empujar', 'kanban'], ['tirar', 'calendario_ferreteria'], ['mirar', 'calendario_ferreteria'], ['tirar', 'semaforo_ruido'], ['coger', 'bandeja_diseno']]) await T.verb(v, o);
  await T.musts(['Pósit: «GUARDIA: ANSELMO».', '«GUARDIA DE LA GUARDIA: ANSELMO».', 'Hasta el polvo pasa por sus sistemas.',
    'Anselmo me abre expediente. Mental.', 'De mi tablero se sale hecho o muerto.', 'Anselmo lo devuelve con la mirada.',
    'Es lo único de fuera que dejo entrar. Por los tacos.', 'Anselmo solo se fía de este.'], 'mesa de guardia');
  lg = await T.log();
  must(lg.filter(l => l.who === 'anselmo_monolito').length === 4, 'hotspots: no los contesta Anselmo');
  await sinNemesio('hotspots');
  ok('E2 §2.6.5: mesa_guardia (Mirar, Usar, Coger) y kanban, calendario, semáforo y bandeja con Anselmo');

  // ------------------------------------------------------------ §4.2 el apagón (sin vio_ticket_3): la escalada
  await T.clearLog();
  for (let i = 0; i < 4; i++) await T.verb('tirar', 'enchufe_pantalla');
  await T.expectFlags({ apagon_n: 4, cms_vivo: false }, '4.2 apagones');
  await T.musts(['¡Estamos ciegos! ¿Hay alguien leyendo?', 'Ese enchufe está en mis sistemas.', 'Si no veo la gráfica, no sé si estoy contenta.',
    'Tercera vez. Te paso a BLOQUEADO.', 'Y mira la brida.', 'Eso huele a Paco.', 'Sin número, a su enchufe.'], '4.2');
  lg = await T.log();
  must(lg.filter(l => l.who === 'anselmo_monolito').length === 6, '4.2: las veces 3 y 4 no son de Anselmo');
  must(!(await G(() => !!__game.game.apagon)), '4.2: la sala se queda a oscuras');
  for (const [id, x] of [['anselmo_monolito', 1082], ['yoli_tendencias', 719]]) {
    const a = await T.actor(id);
    must(a.room === 'pecera' && Math.abs(a.x - x) < 3, `4.2: ${id} no vuelve a su sitio (${JSON.stringify(a)})`);
  }
  await sinNemesio('apagón');
  ok('4.2 apagón ×4: Anselmo (veces 1, 3 y 4) y Yoli; todos vuelven a su sitio');

  // ------------------------------------------------------------ Yoli sin CMS (B4) y camino antiguo del enchufe
  await T.clearLog();
  await T.hablar('yoli_tendencias');
  must(!(await R.state()).dialog, 'Yoli sin cms_vivo abre menú');
  await T.musts(['becario con silla... ¿Con silla? Ahora no. Se cae el CMS.', 'Vuelve con un titular con número. El siete convierte.'], 'B4');
  must(!(await T.logHas('Teodoro vive en la Redacción de papel')) && !(await T.logHas('nuevo dueño del Contable')), 'Yoli sigue con rumores');
  await T.setFlag('vio_ticket_3');
  await T.clearLog();
  await T.verb('tirar', 'enchufe_pantalla');
  await T.expectFlags({ cms_vivo: true }, '4.2 camino antiguo');
  await T.musts(['¿Tiene número?', '...Entonces existe. A HECHO (PERO NO). Con número.'], 'camino antiguo');
  await T.verb('mirar', 'enchufe_pantalla'); await T.verb('mirar', 'pantalla_metricas');
  await T.musts(['la excepción de Anselmo. Con número.', 'Apagada. Y la web publica. Nadie se atreve a decirlo en voz alta.'], 'enchufe / L8');
  ok('B4 (Yoli con silla), sin rumores; camino antiguo con Anselmo; L8');
  await T.setFlag('cafetera_viral');
  await R.travel('office'); await T.clearLog(); await R.travel('pecera'); await T.idle();
  must(await T.logHas('Creo que esto es estar tranquila.'), 'primera entrada con cms_vivo');
  await R.travel('office'); await T.clearLog(); await R.travel('pecera'); await T.idle();
  await T.musts(['¡Once mil concurrentes!', '«abrígate». La cuenta de siempre.'], '4.1 Redacción');
  await T.clearLog();
  await T.hablar('yoli_tendencias');
  await T.opcion('¿Algún hilo bueno esta noche?');
  await T.opcion('¿Y tú cómo estás? Tú, no la audiencia.');
  await T.opcion('¿Cuántos me leen a mí?');
  must(!(await T.opciones()).includes('Íñigo va a cerrar el papel.'), 'Yoli: la del Acto III sale antes');
  await T.opcion('Me voy.');
  await T.expectFlags({ rep_08: true }, 'paso 23');
  await T.musts(['Le contesté: «Y yo te leo desde el más absoluto modo avión».', 'Me ha puesto en copia a mi madre.',
    '...bien. Bajando, pero bien.', 'Menos una lectora: cuarenta y siete minutos. Comenta «abrígate». En todo.',
    'Vuelve con un titular con número. El siete convierte.'], 'Yoli E2 §2.7');
  lg = await T.log();
  must(!lg.some(l => l.who === 'yoli_tendencias' && /— ?\d/.test(l.text)), 'Yoli: cifras entre rayas');
  must(lg.filter(l => l.text.includes('modo avión')).length === 1, 'B5: línea duplicada');
  ok('E2 §2.7 Yoli (B5, C6, sin cifras entre rayas) → rep_08');
  await T.clearLog();
  await T.hablar('coro_desarrollo');
  await T.opcion('¿Por qué gritáis tanto?');
  await T.opcion('El CMS lo he arreglado yo.');
  const co = await T.opciones();
  must(co.length === 2, '§7.6: las opciones del coro no son once ' + JSON.stringify(co));
  await T.opcion('Me voy.');
  lg = await T.log();
  must(lg.some(l => l.who === 'anselmo_monolito' && l.text === 'Juntos son un incendio. Por separado, santos.'), 'coro: «Juntos son un incendio» no es de Anselmo');
  const amb = await G(() => { const r = __game.game.content.rooms.pecera; return {
    ambient: (r.ambient || []).map(a => ({ id: a.id, every: a.every, n: (a.discusiones || []).length })), rules: r.ambientRules }; });
  must(amb.ambient.find(a => a.id === 'coro').n === 4 && amb.ambient.every(a => !a.every) && amb.rules.max <= 3, 'coro: ambiente ' + JSON.stringify(amb));
  ok('coro: §7.6 once; «Juntos son un incendio» de Anselmo; ambiente por el motor');

  // ------------------------------------------------------------ E2 §2.3.2 paso 34: Herminia mide la pieza
  await T.setFlag('casilla_fuente'); await T.setFlag('acto_2_iniciado');
  await T.clearLog();
  await T.verb('usar', 'ordenador_bruno');
  await T.expectFlags({ pieza_escrita: true, herminia_midio: true }, 'paso 34');
  await T.expectInv(['pieza_opa'], [], 'paso 34');
  await T.musts([HERMINIA + 'tu pieza · 31 líneas · hueco de la página 7: 23 · sobra: 26 %', 'Ya te la ha leído. Yo no, ¿eh? Yo ya no leo. Superviso.',
    '¿Y quién quita un 26 %?', 'Ella no. Ella mide. Quitar siempre es de otro departamento.',
    HERMINIA + 'infografía de la opa · hecha en 0,4 s · publicar: bloqueado', 'Cuatro décimas. Yo tardaba una semana. Bien hecha, eso sí.',
    'Hecha con una IA de fuera. No entra en ninguna pieza.', 'Encintar, no. Aislar el componente.', '¿Y vosotros no usáis IA de fuera?',
    'El modelo es de fuera. El prompt es de dentro.', 'Eso lo hace nuestro.', 'El prompt de Herminia lo escribí yo. En esta mesa.',
    'A un metro de mi cinta. Fuera.'], 'paso 34');
  lg = await T.log();
  must(lg.filter(l => l.text.startsWith(HERMINIA)).length <= 3, 'paso 34: más de tres salidas de Herminia');
  must(!lg.some(l => /Diseño/.test(l.text) || ['valentin_reticula', 'coro_desarrollo'].includes(l.who)), 'paso 34: Diseño o el coro en la escena');
  must(!(await T.logHas('Me han medido antes que Teodoro')), 'paso 34: sigue el cierre de Bruno');
  must(Math.abs((await T.actor('anselmo_monolito')).x - 1082) < 3, 'paso 34: Anselmo no vuelve a su mesa');
  await T.clearLog();
  await T.verb('mirar', 'herminia_portatil'); await T.verb('usar', 'herminia_portatil', 'pieza_opa');
  await T.hablar('anselmo_monolito');
  await T.opcion('¿Y tú no usas IA?');
  await T.opcion('¿Por qué invades la sección de Leoncio?');                         // XE2
  await T.opcion('Me voy.');
  await T.hablar('leoncio_quesitos');
  await T.opcion('¿Y esos gráficos de Anselmo en tu sección?');
  await T.opcion('Me voy.');
  await T.musts(['Dos tiras de cinta de Desarrollo. Por debajo, la IA sigue haciendo gráficos.', HERMINIA + 'pieza_opa · ya medida · sobra: 26 %',
    'Notas de gasto generativas para Begoña.', 'Ya te lo he dicho. El prompt es de dentro. Lo escribí yo. En mayúsculas.',
    'Invadir, no. Desplegar capacidad.', 'Un quesito que suma 130 % no es un gráfico. Es una aspiración.'], 'tras el paso 34');
  await sinNemesio('paso 34');
  ok('E2 §2.3.2 paso 34 → herminia_midio (cinta_2), «El modelo es de fuera. El prompt es de dentro.»; árboles [2], [4], [5]');

  // ------------------------------------------------------------ E2 §2.3.3 momento 8: Dos IAs
  await T.setFlag('pieza_recortada'); await T.setFlag('acto_3_iniciado'); await T.setFlag('pagina_cerrada');
  await T.take('pieza_opa');
  await R.travel('catacumba'); await T.clearLog(); await R.travel('pecera'); await T.idle();
  await T.expectFlags({ dos_ias_vista: true, anselmo_dijo_regla: true }, 'momento 8');
  await T.musts(['Última vuelta. Integración: en la próxima versión.', 'Envuelta. Parece un regalo. De nadie.',
    'Antes de que la envolviera le pedí un gráfico del Titulator. Por curiosidad.',
    HERMINIA + 'titulares por hora · picos: 14:00 y 14:30 · pausas de 5 min: 11', HERMINIA + 'origen: Sistemas, armario 27 · consumo: atún',
    'Una IA que come a las dos y va once veces al baño.', 'Tiene alta de usuario interno. Lo que tiene alta es de la casa.',
    'Eso no es un modelo. Eso es un compañero.'], 'momento 8');
  lg = await T.log();
  must(lg.length <= 10, `momento 8: ${lg.length} líneas (guion: 9)`);
  must(!lg.some(l => /Diseño/.test(l.text) || ['valentin_reticula', 'coro_desarrollo'].includes(l.who)), 'momento 8: Diseño o el coro');
  await T.verb('mirar', 'herminia_portatil');
  must(await T.logHas('Envuelta entera. «PENDIENTE DE INTEGRAR». Por un hueco, la pantalla trabaja.'), 'portátil en paquete');
  await T.verb('mirar', 'kanban');
  must(await T.logHas('En POR HACER, amarillo de puro viejo: "Baja becario Rubén".'), '§8 kanban');
  await T.hablar('yoli_tendencias');
  await T.opcion('Íñigo va a cerrar el papel.');
  await T.opcion('Me voy.');
  must(await T.logHas('Si cierra el papel, ¿quién me va a odiar con criterio?'), 'Yoli, Acto III');
  ok('E2 §2.3.3 momento 8 → dos_ias_vista, anselmo_dijo_regla (paquete); Yoli P20');

  // ------------------------------------------------------------ §5.10 Gervasio en la puerta + D3 (E2 fase B (15)) + adhesivo
  for (const f of ['reunion_terminada', 'rep_01', 'ruben_encontrado', 'bruno_con_banner']) await T.setFlag(f);
  await T.give('fotocopia_nota_direccion');
  await R.travel('pajarera'); await T.idle();
  must((await T.roomOf('gervasio_acta')) === 'pajarera', 'Acto III: Gervasio no está en la puerta');
  await T.clearLog();
  await T.hablar('gervasio_acta');
  await T.opcion('¿Usted ha escrito alguna vez algo?');
  await T.opcion('Me voy.');
  await T.hablar('gervasio_acta');
  await T.opcion('Me voy.');
  lg = await T.log();
  must(lg.filter(l => l.text === 'Ese anuncio en la espalda... se agradece. Pero lo hablamos.').length === 1, '§4.2.3: Gervasio y el adhesivo, una vez');
  must(lg.filter(l => l.text.startsWith('Vacante. Se te iba a llamar.')).length === 1, 'Gervasio: el saludo');
  ok('§4.2.3 Gervasio ve el adhesivo (una vez, en lugar del saludo)');
  await T.clearLog();
  await T.hablar('gervasio_acta');
  await T.opcion('Necesito el acta de la última reunión.');
  for (let g = 0; g < 60; g++) {
    const st = await R.state();
    if (!st.duel) break;
    if (st.duel.phase === 'reply' && st.dialog) await G(k => __game.chooseDialog(k), st.duel.weakIndex);
    else await T.page.waitForTimeout(30);
  }
  await T.idle();
  must((await T.flag('duel:gervasio:perdido_n')) === 1, 'D3: no cuenta la derrota');
  await T.musts(['«Fuera de la oficina hasta nueva acta.»', 'Mi primera acta.', 'Es un diario.'], 'D3 derrota');
  await R.closeDialog(); await T.idle();
  await T.clearLog();
  await T.hablar('gervasio_acta');
  await T.opcion('Necesito el acta de la última reunión.');
  await R.playDuel(['R07', 'R01', { objeto: 'fotocopia_nota_direccion' }]);
  await T.idle();
  await T.expectFlags({ duelo_gervasio_ganado: true, sala_abierta: true }, 'paso 41');
  await T.expectInv(['acta_reunion'], ['fotocopia_nota_direccion'], 'paso 41');
  await T.musts(['Yo con Hidrovoltia no he comido en mi vida.', 'uno, pedir más café. Dos, ninguno más.'], 'D3 victoria');
  must(!(await T.log()).some(l => /reunión rápida/.test(l.text)), 'D3: sigue R14');
  ok('paso 41: D3 sin R14 (R07, R01 + remate a los dos aciertos) → acta_reunion, sala_abierta');

  // ------------------------------------------------------------ §4.2.3 Yoli y el adhesivo, una vez al entrar
  await T.clearLog();
  await R.travel('pecera'); await T.idle();
  must(await T.logHas('¿Llevas un banner en la espalda? ...Pues convierte. Me han mirado.'), '§4.2.3 Yoli');
  await R.travel('office'); await T.clearLog(); await R.travel('pecera'); await T.idle();
  must(!(await T.logHas('¿Llevas un banner')), '§4.2.3 Yoli se repite');
  await T.setFlag('bruno_con_banner', false);
  ok('§4.2.3 Yoli ve el adhesivo al entrar (una vez)');

  // ------------------------------------------------------------ E2 §2.6.3-2.6.4 álbum y salida en valor (paso 40)
  await T.give('album_eventos');
  await T.clearLog();
  await T.verb('dar', 'anselmo_monolito', 'album_eventos');
  await T.opcion('¿Y si lo damos por hecho?');
  await T.opcion('¿Y si le hacemos un funeral? Con flores. Y diapositivas.');
  await T.opcion('Lo pienso y vuelvo.');
  await T.musts(['¿De dónde vienen estas fotos? De Eventos. De fuera.', 'Es de la casa: sale en todas.', 'Y despedir no es una columna de mi tablero.',
    'Nadie lo ha hecho.', 'Ya tengo la plantilla.', 'Tráeme algo que no sea ni hecho ni muerto. Eso no existe.', 'Eso dijo Rubén en julio.'], 'AN_ALBUM');
  must(!(await T.logHas('¿Otra vez cruzando?')), 'Dar el álbum: saluda antes de mirar las fotos');
  await T.setFlag('rep_13');
  await T.clearLog();
  await T.verb('dar', 'anselmo_monolito', 'album_eventos');
  await T.opcion('No es un despido: es una salida en valor.');
  await R.closeDialog(); await T.idle();
  await T.expectFlags({ posit_descopeado: true, ruben_libre: true }, 'paso 40');
  await T.expectInv(['ticket_n1'], ['album_eventos'], 'paso 40');
  await T.musts(['...Eso no es ni hecho ni muerto. Es consultoría.', 'Despedir, no. Salida en valor. ...Eso sí lo sé hacer yo.',
    'Columna nueva. La primera que no dice que no.', 'Lo único integrado de la casa.', 'Y en nuestros corazones, Rubén está en HECHO.',
    'No subo. Nunca subo. Paco.', 'Estoy esperando a que salga el sol.', 'Revocado. Con fecha de hoy. Y de julio.',
    'Integró una IA que era un becario.', 'Nos hemos quedado sin IA de la casa.', HERMINIA + 'alta de usuario: no · propietaria: Infografía',
    '...Lo miro en la próxima versión.', 'SEGUIREMOS INFORMANDO. Perdón.'], 'AN_SALIDA');
  lg = await T.log();
  must(!lg.some(l => ['coro_desarrollo'].includes(l.who) || /Diseño/.test(l.text)), 'paso 40: coro o Diseño');
  must((await T.roomOf('ruben')) === 'pecera', 'paso 40: Rubén no está en la Redacción');
  must(Math.abs((await T.actor('anselmo_monolito')).x - 1082) < 3, 'paso 40: Anselmo no vuelve a su sitio');
  await sinNemesio('paso 40');
  ok('E2 §2.6.4 paso 40: salida en valor de Anselmo → ticket_n1, posit_descopeado, ruben_libre; Leoncio tapa a Herminia');

  // ------------------------------------------------------------ E1.5 anexión (MP1) y titular
  await T.setFlag('herminia_de_alta');
  await R.travel('office'); await T.clearLog(); await R.travel('pecera'); await T.idle();
  await T.expectFlags({ infografia_integrada: true }, 'anexión');
  await T.musts(['Entonces es estupenda.', 'Quitar, no. Absorber en plataforma.', HERMINIA + 'propietario: Desarrollo', 'Todo esto es Desarrollo.'], 'anexión');
  lg = await T.log();
  must(!lg.some(l => /Diseño/.test(l.text) || l.who === 'valentin_reticula'), 'anexión: Diseño en una escena de Infografía');
  await T.verb('mirar', 'herminia_portatil');
  must(await T.logHas('Pegatina nueva: «DESARROLLO».'), 'tras la anexión');
  await T.clearLog();
  await R.travel('pajarera'); await T.idle();
  must(await T.logHas('UNA HERRAMIENTA CONSIGUE CONTRATO EN 40 SEGUNDOS'), '§8.3: falta el titular de herminia_de_alta');
  ok('E1.5 anexión → infografia_integrada; titular (§8.3)');

  // ------------------------------------------------------------ errores
  const engineErrors = await G(() => __game.log.filter(l => l.who === 'error' || /^\[motor\]/.test(String(l.text))).map(l => l.text));
  must(!engineErrors.length, 'errores del motor: ' + engineErrors.join(' | '));
  must(!consoleErrors.length, 'errores de consola: ' + consoleErrors.join(' | '));
  ok('sin errores de consola ni del motor');
}

// ================================================================== capturas (tools/shots/e2-p2-*.png)
async function sacarCapturas() {
  const dir = path.join(here, 'shots');
  fs.mkdirSync(dir, { recursive: true });
  const shotWhen = async (T, texto, nombre, ms = 450) => {
    for (let i = 0; i < 600; i++) {
      if (await T.logHas(texto)) { await T.page.waitForTimeout(ms); await T.page.screenshot({ path: path.join(dir, `e2-p2-${nombre}.png`) }); return; }
      await T.page.waitForTimeout(100);
    }
    const st = await T.R.state();
    throw new StepFail(`captura ${nombre}: no aparece «${texto}» (sala ${st.room}; log: ${JSON.stringify((await T.log()).slice(-4))})`);
  };
  const sin = (T, fn) => { const p = fn(); p.catch(() => {}); T.pend = p; };
  const prep = async (flags, items = [], conInigo = true) => {
    const T = await abrir();
    await T.G(() => __game.skipText(true));
    for (const f of [...BASE_FLAGS, ...(conInigo ? ['inigo_presentado'] : []), ...flags]) await T.setFlag(f);
    for (const i of items) await T.give(i);
    return T;
  };
  const lento = async (T) => { await T.G(() => __game.skipText(false)); };
  const rapido = async (T) => { await T.G(() => __game.skipText(true)); };
  const fin = async (T) => { if (T.pend) await T.pend.catch(() => {}); await T.idle(); await T.page.close(); };
  // 1. escena 7.2
  let T = await prep([], [], false);
  await lento(T);
  sin(T, () => T.goto('pecera', 'vestibulo'));
  await shotWhen(T, '¡No entra nada!', '72-yoli');
  await shotWhen(T, 'Aquí ya tenemos una IA.', '72-leoncio');
  await shotWhen(T, 'Entonces no es una IA. Es un hobby.', '72-hobby');
  await shotWhen(T, 'cinta de Desarrollo · tiras: 1', '72-cinta');
  await shotWhen(T, 'Te tengo en la matriz, Vacante.', '72-matriz');
  await fin(T);
  // 2. paso 34, momento 8, salida en valor
  T = await prep(['silla_libre', 'chaqueta_cogida', 'casilla_fuente', 'acto_2_iniciado', 'cms_vivo']);
  await T.goto('pecera', 'vestibulo'); await T.idle();
  await T.verb('mirar', 'mesa_guardia');
  await T.G(() => __game.waitIdle());
  await lento(T);
  sin(T, () => T.verb('mirar', 'mesa_guardia'));
  await shotWhen(T, 'GUARDIA DE LA GUARDIA', 'mesa-guardia', 300);
  await T.pend; await T.idle();
  sin(T, () => T.verb('usar', 'ordenador_bruno'));
  await shotWhen(T, 'tu pieza · 31 líneas', 'paso34-mide');
  await shotWhen(T, 'El modelo es de fuera. El prompt es de dentro.', 'paso34-prompt');
  await shotWhen(T, 'El prompt de Herminia lo escribí yo.', 'paso34-leoncio');
  await T.pend; await T.idle();
  await rapido(T);
  await T.setFlag('acto_3_iniciado'); await T.setFlag('reunion_terminada'); await T.setFlag('ruben_encontrado');
  await T.R.travel('catacumba'); await T.idle(); await lento(T);
  sin(T, () => T.R.travel('pecera'));
  await shotWhen(T, 'Última vuelta.', 'dos-ias-paquete');
  await shotWhen(T, 'consumo: atún', 'dos-ias');
  await shotWhen(T, 'Tiene alta de usuario interno.', 'dos-ias-anselmo');
  await T.pend; await T.idle();
  await rapido(T);
  await T.setFlag('rep_13'); await T.give('album_eventos');
  await lento(T);
  sin(T, () => T.verb('dar', 'anselmo_monolito', 'album_eventos'));
  await shotWhen(T, 'Y despedir no es una columna de mi tablero.', 'album');
  for (let i = 0; i < 100 && !(await T.opciones()).length; i++) await T.page.waitForTimeout(100);
  sin(T, () => T.opcion('No es un despido: es una salida en valor.'));
  await shotWhen(T, 'Columna nueva. La primera que no dice que no.', 'salida-tablero');
  await shotWhen(T, 'Estoy esperando a que salga el sol.', 'salida-ruben');
  await shotWhen(T, 'Integró una IA que era un becario.', 'salida-revocado');
  await shotWhen(T, 'alta de usuario: no', 'salida-manos', 300);
  await shotWhen(T, 'La frase con la que Íñigo', 'salida-bruno');
  await fin(T);
  // 3. el adhesivo: Yoli y Gervasio
  T = await prep(['silla_libre', 'chaqueta_cogida', 'chaqueta_en_lector', 'acto_2_iniciado', 'reunion_terminada', 'bruno_con_banner']);
  await T.goto('pajarera', 'pecera'); await T.idle(); await lento(T);
  sin(T, () => T.hablar('gervasio_acta'));
  await shotWhen(T, 'Ese anuncio en la espalda', 'gervasio-banner');
  for (let i = 0; i < 100 && !(await T.opciones()).length; i++) await T.page.waitForTimeout(100);
  await T.R.closeDialog(); await T.pend; await T.idle();
  sin(T, () => T.R.travel('pecera'));
  await shotWhen(T, '¿Llevas un banner en la espalda?', 'yoli-banner');
  await fin(T);
}
