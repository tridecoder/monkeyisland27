// FE DE ERRATAS — definición global del juego. ARCHIVO COMPARTIDO: no lo edita ningún autor de sala.
// Título, sala inicial, respuestas por defecto (§8.2), pistas de la abuela (§5.6), cuarta pared (§8.6),
// aviso de réplica aprendida (§5.5), avisos comunes de la adenda §2 (llamadas de Evaristo, «RV:» de Tadeo), música y
// fondo de los créditos (la lista está en content/escenas/final.js). ENMIENDA E2: §5.7 (llamadas), §7.4 (RV sin aviso),
// §10.2 (migración), `pantallas` (prefijos de objetos que hablan).
// Hora de juego (biblia v2): viernes, de las 18:30 al cierre de las 21:00; los relojes del edificio, parados en las 20:59.
import { PAL, rect, px, hline, vline, gradV, glow, rng, ditherPick, frameRect, line, ditherOverlay, vignette } from '../engine/draw.js';
import { drawText, measure } from '../engine/font.js';
import music from './music.js';
import flags, { ADENDA_FLAGS } from './flags.js';
import { RV_TADEO } from './lib/movil.js';
import { OBJETIVOS, SALUDOS, OTRA_VEZ, ABUELA_VIRAL, DESPEDIDA, horaMovil } from './pistas.js';

// ------------------------------------------------------------------ §8.2 respuestas por defecto (rotan en orden)
const DEFAULTS = {
  mirar: ['Es exactamente lo que parece. En esta casa, eso ya es noticia.', 'Lo miro con intensidad de periodista sin cenar. No descubro nada.', 'Nada que contrastar.', 'Si lo miro más, Yoli me lo cuenta como tiempo de permanencia.', 'Visto. Ni una errata. Sospechoso.'],
  coger: ['Está inventariado. Aquí todo está inventariado menos yo.', 'Si lo cojo, alguien me pedirá una nota de gasto por tocarlo.', 'No es mío. Aquí nada es mío. Ni la silla, hasta hace poco.', 'Mejor no. Luego desaparece algo y el becario es el primero en la lista.', 'No me cabe. Mi mochila ya va llena de chapas de eventos.'],
  usar: ['No veo cómo. El manual lo tiene alguien que se jubiló en 2011.', 'Usarlo así sería innovación. Y la innovación la cobra la consultora.', 'No funciona. Lo añado a mis competencias: «equipos averiados».', 'No se me ocurre para qué. Y eso que he hecho un máster.', 'Mejor no lo toco. Si se rompe, sale en el parte con mi nombre mal escrito.'],
  dar: ['No creo que lo quiera. Y si lo acepta, luego hay que declararlo.', 'Aquí si das algo sin acta, te lo devuelven con tareas.', 'Lo rechazaría. Tiene cara de quien ya tiene uno.', 'Regalar cosas en una redacción se considera soborno o despedida.', 'No. Si le doy eso, me pide factura.'],
  hablar: ['No contesta. O es un objeto o está en una videollamada.', 'Le hablo. No me contesta. Es lo más parecido a una fuente oficial.', 'Hablarle a eso sería como responder a todos: posible, pero imperdonable.', 'Silencio. Al menos no me ha dicho «lo hablamos».', 'No me contesta. Bueno, no me ha llamado Pellizco. Algo es algo.'],
  abrir: ['No se abre. Lo apunto como «acceso restringido». Suena a ascenso.', 'Cerrado. Hay una pegatina: «No forzar». Me ha convencido.', 'No tiene por dónde. Lo ha montado alguien que no quería visitas.', 'Si lo abro, me hacen responsable de lo que salga.', 'No se abre. Lo dejo así: está en su derecho.'],
  cerrar: ['Ya está cerrado. Aquí lo único que no cierra a tiempo es la edición.', 'Cerrarlo no cierra nada. Bueno, cerraría el tema, que aquí es lo difícil.', 'No hay nada que cerrar. Lo apunto en «tareas completadas».', 'Lo cierro. No pasa nada. Igual que en las reuniones.', '¿Cerrar algo yo? ¿Con qué cargo?'],
  empujar: ['Empujo con las dos manos. Nada. Sigo un poco, por si alguien mira.', 'No pienso empujar eso. Saldría en el próximo comité. En diapositiva.', 'Ni se inmuta. Tiene más estabilidad laboral que yo.', 'Empujo. Nada. Es como empujar la prima de riesgo con la mirada.', 'No, que luego se cae y el becario es el último que lo tocó.'],
  tirar: ['Tiro. Nada. Tiene más resistencia que el papel.', 'Aquí el que tira de algo se convierte en el responsable.', 'No pienso tirar de eso. En esta empresa ya tira siempre el becario.', 'Tiro. No sale. Le pido perdón. Me parece lo correcto.', 'Mejor no. Si viene con cable, Paco me lo factura.'],
};
// §8.6: «Combinar 10 cosas seguidas sin éxito»
const COMBO_GAG = '¿Estás probando todo con todo? Así trabajan en Administración. Y no funciona.';
const rotation = {};
function rotating(verb) {
  return async (api) => {
    if (api.item && api.comboFails >= 10) { api.resetComboFails(); await api.say(COMBO_GAG); return; }
    const list = DEFAULTS[verb];
    const i = rotation[verb] = ((rotation[verb] ?? -1) + 1) % list.length;
    await api.say(list[i]);
  };
}
const defaults = {};
for (const v of Object.keys(DEFAULTS)) defaults[v] = rotating(v);
defaults.combine = rotating('usar');      // objeto con objeto sin combinación: las de Usar
defaults['*'] = rotating('mirar');

// ------------------------------------------------------------------ plan §8.5: la abuela, tres niveles por objetivo
// Textos: content/pistas.js. Elección del objetivo y del nivel: engine/objetivos.js (api.objetivo.pista()). Nivel 3: la
// abuela dice su línea y, AL COLGAR, Bruno traduce la acción en voz alta. Nunca dos llamadas idénticas seguidas.
async function pistas(api) {
  const n = api.inc('abuela_llamadas');
  const A = 'abuela_remedios';
  const P = api.objetivo.pista();                       // { obj, nivel, repetida, def }
  const N = P.def ? P.def.niveles : null;
  const tres = N && P.nivel >= 3 ? N[2] : null;
  // Bruno llama a su abuela: primer plano del móvil (api.phone) con su retrato; ella habla desde el móvil
  await api.phone.call({ caller: A, label: 'Abuela', outgoing: true }, async () => {
    await api.phone.say(SALUDOS[(n - 1) % SALUDOS.length]);
    // adenda 2.1: una sola vez, en la primera llamada con evaristo_llamadas >= 2, antes de la pista (la pista no cambia)
    if ((api.flag('evaristo_llamadas') || 0) >= 2 && api.once('abuela_evaristo')) {
      await api.phone.say(['Me ha llamado un señor de tu trabajo, muy educado.', 'Quería saber si "Remedios" lleva tilde. Le he dicho que no.', 'Y que te abrigues. Me ha dicho que era solo eso.']);
    }
    // plan §4.1: la cafetera viral, una vez, antes de la pista
    if (api.flag('cafetera_viral') && api.once('abuela_viral')) {
      for (const [w, t] of ABUELA_VIRAL) { if (w === 'A') await api.phone.say(t); else await api.say(t); }
    }
    if (N) {
      if (P.repetida) await api.phone.say(OTRA_VEZ);
      const pre = P.def.previa;
      if (pre && P.nivel === (pre.nivel || 1) && api.cond(pre.si)) await api.phone.say(pre.abuela);
      await api.phone.say(tres ? tres[0] : N[P.nivel - 1]);
      const ex = P.def.extra;
      if (tres && ex && api.cond(ex.si)) await api.phone.say(ex.abuela);
    }
    await api.phone.say(DESPEDIDA);
  });
  if (tres) await api.say(tres[1]);                     // nivel 3: Bruno, al colgar, dice la acción
}

// ------------------------------------------------------------------ ADENDA §2 + ENMIENDA E2 §5.7: avisos al entrar en sala
// Llamadas de Evaristo (E2: L1, L3, L4 y L5; la L2 y la LC ya no existen) — contador `evaristo_llamadas`.
// Mecánica única: el MOTOR llama a `afterEnter` (abajo) tras el `onEnter` de CADA sala; los autores de sala NO tienen
// que hacer nada. No salta si la entrada ya ha lanzado una escena / diálogo / duelo / cinemática, ni al cargar partida,
// ni en `sala_amazonas` con `acto_3_iniciado`, ni tras el final. Como mucho UN aviso por entrada (también si alguien
// invoca `api.scene('avisos')` a mano). Las llamadas salen en orden y esperan a su condición; una llamada cuya
// condición ya no se puede cumplir (`salta`) se da por perdida (L4 si Rubén ya ha aparecido; L5 dentro del clímax).
// E2 §7.4 (paso 13): los «RV:» de Tadeo YA NO SON AVISOS: llegan solos al correo del móvil (content/lib/movil.js) al
// entrar en una sala con su condición (`tadeo_rv_n` cuenta los llegados), sin globo ni «¡ding!».
const EV = 'evaristo_salvedad';
const callLine = async (api, who, text) => {
  const g = api.game, t0 = g.time, dur = g.speechDuration(text);
  await api.phone.say(text);
  // «No se puede colgar a Evaristo»: un clic temprano sobre el globo durante una llamada (una vez en toda la partida)
  if (!g.instant && g.time - t0 < dur * 0.4 && api.once('evaristo_colgar')) {
    await api.say(['No se puede colgar a Evaristo. Lo he intentado. Me ha anotado.']);
  }
};
// Las llamadas de Evaristo: el móvil de Bruno en primer plano con el retrato de don Evaristo (api.phone). Cortas.
const EV_CALL = { caller: EV, label: 'Evaristo', sub: 'Controlling', ringMs: 1000 };
const llamada = (id, cond, guion, salta = null) => ({ id, cond, salta, run: async (api) => {
  await api.phone.call(EV_CALL, async () => {
    for (const [who, text] of (typeof guion === 'function' ? guion(api) : guion)) {
      if (who === 'E') await callLine(api, EV, text);
      else if (who === 'B') await api.say(text);
      else if (who === 'ring') { await api.phone.close(); await api.wait(250); await api.phone.open({ ...EV_CALL, ringMs: 700 }); }   // cuelga y vuelve a llamar
    }
  });
} });
/** E2 §5.7 (textos literales; L1 recortada en §7.4, paso 10). Una sola trama de la coma: la del contrato del Titulator. */
export const LLAMADAS = [
  llamada('L1', 'torno_abierto', [
    ['E', 'Una cosita. Evaristo Salvedad, Controlling. Su tarjeta pone «Pellizco».'], ['B', 'Es Pellejo. Con dos eles.'],
    ['E', 'Anotado. Era solo eso.'], ['ring'],
    ['E', 'Perdone. ¿Pellejo con jota o con ge?'], ['B', 'Con jota.'], ['E', 'Ahora sí era solo eso.'],
    ['B', 'Es el primero que me lo pregunta.']]),
  // (L2 eliminada, fase B (4): a Evaristo le manda Begoña al cerrar el paso 27)
  llamada('L3', 'pieza_recortada', [
    ['E', 'Una cosita. Begoña me manda el triplicado de su recorte.'],
    ['E', 'Ella recorta sin leer. Yo leo sin recortar. Somos un sistema.'],
    ['E', 'Veintitrés líneas. Ni una coma fuera de sitio. Era solo eso.']]),
  llamada('L4', ['acto_3_iniciado', '!ruben_encontrado'], [
    ['E', 'Una cosita. La máquina de la planta -1 vende veinticuatro atunes al mes.'],
    ['E', 'En Sistemas no come atún nadie. Lo he cruzado con las nóminas.'],
    ['E', 'Alguien come ahí abajo y no cobra. Era solo eso.'],
    ['B', 'Alguien que come y no cobra. Eso es un becario.']], 'ruben_encontrado'),
  llamada('L5', ['ruben_libre', '!climax_entrada'], [
    ['E', 'Una cosita. Me dicen que va a la Sala. ¿Lleva mi correo?'], ['B', 'En el bolsillo.'],
    ['E', 'Envíelo en el momento oportuno. Usted lo notará. Era solo eso.']], 'climax_entrada'),
];
const oida = (api, L) => !!(api.game.state.once && api.game.state.once['once:evaristo_' + L.id]);
/** La siguiente llamada pendiente (en orden; las que ya no pueden sonar se saltan) o null. El contador manda: con
 *  `evaristo_llamadas` a 0 (partida nueva, o una prueba que lo pone a 0) no ha sonado ninguna. */
function siguienteLlamada(api) {
  const once = api.game.state.once || {};
  if (!Number(api.flag('evaristo_llamadas') || 0)) for (const k of Object.keys(once)) if (k.startsWith('once:evaristo_L')) delete once[k];
  for (const L of LLAMADAS) {
    if (oida(api, L)) continue;
    if (L.salta && api.cond(L.salta)) continue;
    return L;
  }
  return null;
}
/** E2 §7.4: los RV: de Tadeo llegan solos al correo (sin aviso). Devuelve cuántos han llegado. */
function rvAlCorreo(api) {
  let n = Number(api.flag('tadeo_rv_n') || 0);
  while (n < RV_TADEO.length && api.cond(RV_TADEO[n][0])) n++;
  if (n !== Number(api.flag('tadeo_rv_n') || 0)) api.setFlag('tadeo_rv_n', n);
  return n;
}
/** [E2: retirar en integración] puentes mientras las salas no estén adaptadas a E2. */
function puenteE2(api) {
  // la opción «¿Para qué me ha llamado?» de Evaristo (Administración, P3) aún pide `evaristo_convoco`, que ponía la L2
  if (api.flag('acto_2_iniciado') && !api.flag('evaristo_convoco')) api.setFlag('evaristo_convoco', true);
}
/** Escena común `avisos`: un aviso como mucho por entrada en sala. La lanza el motor (`afterEnter`); también se puede
 *  invocar a mano con `await api.scene('avisos')` (p. ej. al acabar una escena larga que quieras dejar pasar). */
async function avisos(api) {
  const g = api.game;
  if (api.flag('juego_terminado')) return false;
  rvAlCorreo(api);
  puenteE2(api);
  if (g.avisoEntryN === g.entryN) return false;                               // ya ha salido uno en esta entrada
  if (g.cutscene > 0 || g.inDialog) return false;
  if (api.room === 'sala_amazonas' && api.flag('acto_3_iniciado')) return false;
  const call = siguienteLlamada(api);
  if (!call || !api.cond(call.cond)) return false;
  g.avisoEntryN = g.entryN;
  g.avisoActive = true;
  try {
    api.once('evaristo_' + call.id);
    api.inc('evaristo_llamadas');
    await call.run(api);
    // la primera vez que suena el móvil: cómo se usa (orden del director: que se descubra)
    if (api.once('movil_pista_uso')) api.notice('Usa el móvil para llamar a la abuela o leer el correo', { color: '#9fd8ff', ms: 4200 });
  } finally { g.avisoActive = false; }
  return true;
}
const afterEnter = (api) => avisos(api);

// ------------------------------------------------------------------ plan §3.4 + E2 §10.2: partidas guardadas antiguas
// Objetos y flags retirados en la reescritura de comedia y en la E2. Idempotente: el motor la llama en cada carga.
const FLAGS_RETIRADOS = ['leoncio_acepta_alta', 'bandeja_diseno_abierta', 'rumor_atun_n', 'rumor_plaza_n', 'gertrudis_error_indice',
  'evaristo_lc'];                                         // E2 §5.3: la LC ya no existe
/** [E2: retirar en integración] se borrarán de las partidas cuando ninguna sala los lea (§10.2): pasarlos a FLAGS_RETIRADOS. */
export const FLAGS_E2_PENDIENTES = ['rumor_firma_n', 'planta_oyo', 'evaristo_convoco'];
function migrarPartida(st) {
  const inv = Array.isArray(st.inventory) ? st.inventory : (st.inventory = []);
  const fl = st.flags || (st.flags = {});
  const once = st.once || (st.once = {});
  const quitar = (id) => { const i = inv.indexOf(id); if (i >= 0) { inv.splice(i, 1); return true; } return false; };
  quitar('planillo');                                     // Maripaz ya está en la Sala por su `when` (sala_amazonas.js)
  if (quitar('posit_baja_ruben')) {                       // el pósit lo cerraba Paco: ahora lo da la escena del tablero
    if (!inv.includes('ticket_n1')) inv.push('ticket_n1');
    fl.ruben_libre = true; fl.posit_descopeado = true;
  }
  // E2 §5.7: las llamadas antiguas (L1-L5 por contador, y la LC) pasan a marcas por llamada
  const n = Number(fl.evaristo_llamadas) || 0;
  if (n > 0 && !Object.keys(once).some(k => k.startsWith('once:evaristo_L'))) {
    const k = n - (fl.evaristo_lc ? 1 : 0);                // las antiguas L1..Lk ya sonaron
    for (const [id, min] of [['L1', 1], ['L3', 3], ['L4', 4], ['L5', 5]]) if (k >= min) once['once:evaristo_' + id] = true;
  }
  // E2 §5.3: con la coma cerrada por la vía antigua (LC o E_ENVIO), el correo impreso que ahora es objeto
  if (fl.correo_evaristo_listo && !fl.duelo_inigo_ganado && !inv.includes('correo_evaristo')) inv.push('correo_evaristo');
  if (fl.correo_evaristo_listo) fl.coma_bendecida = true;
  for (const k of FLAGS_RETIRADOS) delete fl[k];
  return st;
}

// flags de la adenda: contadores a 0, booleanos a false (adenda 11.2)
const startFlags = Object.fromEntries(ADENDA_FLAGS.map(k => [k, String(flags[k]).startsWith('int') ? 0 : false]));

// ------------------------------------------------------------------ title screen: a front page at night
function frontPage(g, t, { x0 = 34, y0 = 4, w = 252, h = 136, credits = false } = {}) {
  // paper with soft light from the upper left
  for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) {
    g.fillStyle = ditherPick(x, y, [PAL.paper[3], PAL.paper[4], PAL.paper[5], PAL.paper[6]], 0.95 - (x - x0) / (w * 2.4) - (y - y0) / (h * 2.6));
    g.fillRect(x, y, 1, 1);
  }
  vline(g, x0 + w, y0 + 2, h, PAL.ink[0]); hline(g, x0 + 2, y0 + h, w, PAL.ink[0]);
  ditherOverlay(g, x0 + w, y0 + 3, 3, h, PAL.ink[0], 0.5);
  const ink = PAL.ink[2];
  if (!credits) {
    drawText(g, 'FE DE ERRATAS', x0 + w / 2, y0 + 4, ink, { align: 'center', scale: 3, outline: null });
    hline(g, x0 + 8, y0 + 40, w - 16, ink); hline(g, x0 + 8, y0 + 42, w - 16, ink);
    drawText(g, 'Una aventura de cierre', x0 + 10, y0 + 43, PAL.paper[1], { outline: null });
    drawText(g, 'elContable.es · Sáb. · Pág. 7', x0 + w - 10, y0 + 43, PAL.paper[1], { outline: null, align: 'right' });
    hline(g, x0 + 8, y0 + 54, w - 16, PAL.paper[2]);
  }
  const top = credits ? y0 + 6 : y0 + 58;
  if (!credits) {
    // headline + byline with Aurora's red correction (G1)
    drawText(g, 'UN BECARIO QUIERE FIRMAR EN PAPEL', x0 + 10, top, ink, { outline: null, bold: true });
    const by = 'Por Bruno Pellizco';
    drawText(g, by, x0 + 10, top + 12, PAL.paper[1], { outline: null });
    const bw = measure(by), pw = measure('Pellizco');
    line(g, x0 + 10 + bw - pw - 1, top + 18, x0 + 10 + bw + 1, top + 16, PAL.red[3], 1);
    drawText(g, 'Pellejo', x0 + 14 + bw, top + 10, PAL.red[3], { outline: null });
    line(g, x0 + 12 + bw, top + 20, x0 + 14 + bw + measure('Pellejo'), top + 20, PAL.red[3]);
  }
  // body columns
  const cols = 3, cw = Math.floor((w - 24) / cols);
  const r = rng(7);
  for (let c = 0; c < cols; c++) {
    const cx = x0 + 10 + c * (cw + 2);
    for (let y = top + (credits ? 0 : 26); y < y0 + h - 6; y += 3) {
      const lw = (y % 17 === 0) ? Math.floor(cw * 0.5) : cw - 3 - Math.floor(r() * 4);
      hline(g, cx, y, lw, r() < 0.06 ? PAL.paper[1] : PAL.paper[2]);
    }
    if (c < cols - 1) vline(g, cx + cw, top + (credits ? 0 : 24), y0 + h - top - (credits ? 6 : 30), PAL.paper[3]);
  }
  if (!credits) {
    // photo of the turnstile, right column
    const px0 = x0 + 10 + 2 * (cw + 2), py0 = top + 26;
    rect(g, px0, py0, cw - 3, 28, PAL.metal[2]);
    for (let y = py0; y < py0 + 28; y++) for (let x = px0; x < px0 + cw - 3; x++) if ((x + y) % 3 === 0) px(g, x, y, PAL.metal[3]);
    rect(g, px0 + 8, py0 + 6, 3, 22, PAL.metal[5]); rect(g, px0 + cw - 14, py0 + 6, 3, 22, PAL.metal[5]);
    rect(g, px0 + 11, py0 + 14, cw - 25, 2, PAL.teal[5]); rect(g, px0 + 12, py0 + 8, 6, 3, PAL.red[4]);
    // fe de erratas box (bottom left)
    const bx = x0 + 10, byy = y0 + h - 38, bw2 = 2 * cw - 2;
    rect(g, bx, byy, bw2, 32, PAL.paper[6]); frameRect(g, bx, byy, bw2, 32, ink);
    drawText(g, 'FE DE ERRATAS', bx + 4, byy + 1, PAL.red[3], { outline: null, bold: true });
    drawText(g, 'Donde dice «becario»', bx + 4, byy + 11, PAL.paper[1], { outline: null });
    drawText(g, 'debe decir «Bruno Pellejo».', bx + 4, byy + 20, PAL.paper[1], { outline: null });
  }
}
function titleDraw(g, t) {
  gradV(g, 0, 0, 320, 200, [PAL.ink[0], PAL.night[0], PAL.night[1], PAL.purple[1], PAL.ink[1], PAL.ink[0]]);
  glow(g, 60, 20, 140, 90, PAL.gold[5], 0.12);
  frontPage(g, t);
  // red pen lying on the page
  line(g, 230, 135, 272, 121, PAL.red[2], 2); line(g, 230, 134, 270, 121, PAL.red[4]); rect(g, 270, 119, 4, 3, PAL.metal[5]);
  // the building's clocks are stopped at 20:59 (one minute to the 21:00 closing; bible v2)
  const blink = Math.floor(t / 700) % 2 === 0;
  rect(g, 272, 150, 40, 14, '#0c0606'); frameRect(g, 271, 149, 42, 16, PAL.metal[2]);
  drawText(g, blink ? '20:59' : '20 59', 292, 151, PAL.red[4], { align: 'center', outline: null });
  vignette(g, 320, 200, 0.5);
  g.save(); g.globalAlpha = 0.5; rect(g, 100, 144, 120, 40, PAL.ink[0]); g.restore();
}
function endingDraw(g, t) {
  gradV(g, 0, 0, 320, 200, [PAL.ink[0], PAL.ink[1], PAL.night[0]]);
  // a newspaper page slowly rising behind the credits
  const off = Math.floor((t / 1000) * 6) % 214;
  frontPage(g, t, { x0: 40, y0: 40 - off, w: 240, h: 200, credits: true });
  frontPage(g, t, { x0: 40, y0: 254 - off, w: 240, h: 200, credits: true });
  g.save(); g.globalAlpha = 0.72; rect(g, 0, 0, 320, 200, PAL.ink[0]); g.restore();
}
/** Gertrudis' LCD in a corner (§7.5), drawn OVER the scrolling text (ending.overlay); the text stops at y 18 (topY). */
function endingOverlay(g) {
  const msg = 'E-00: HOY SÍ. DISFRUTADLO, QUE NO SE REPITE.';
  const mw = measure(msg) + 8;
  rect(g, 0, 0, 320, 17, PAL.ink[0]);
  rect(g, 316 - mw, 3, mw, 12, '#06140a'); frameRect(g, 315 - mw, 2, mw + 2, 14, PAL.metal[3]);
  drawText(g, msg, 320 - mw, 3, '#39ff14', { outline: null });
}

export default {
  id: 'fe_de_erratas',
  title: {
    music: 'm_titulo',
    menuY: 148,
    footer: 'Viernes, 18:30. Cierre de la edición del sábado.',
    draw: titleDraw,
  },
  player: 'bruno',
  startRoom: 'vestibulo',
  startEntry: 'inicio',
  startInventory: ['tarjeta_becario', 'libreta_replicas', 'movil'],
  startFlags,
  narratorColor: '#F0E0B0',
  noWalkVerbs: [],

  // La intro (§7.1) es del paquete A: escena 'intro' registrada por content/rooms/vestibulo.js (scenes.intro).
  async onStart(api) { await api.scene('intro'); },

  defaults,

  // plan §8: objetivos (ficha, «Mirar a Bruno», abuela) y hora del móvil por hitos — datos en content/pistas.js
  objetivos: OBJETIVOS,
  hora: horaMovil,
  metaFinal: 'Lo hemos conseguido. Bueno: lo he conseguido. Lo pongo en «logros».',

  // ---------------------------------------------------------------- §8.6 cuarta pared
  idle: { ms: 60000, run: async (api) => { await api.say('Tranquilo. Yo también me quedo así en las reuniones.'); } },
  saveMessages: ['Guardando... (original)', 'Guardando... (duplicado)', 'Guardando... (triplicado)'],
  saveFirstLine: { text: 'BEGOÑA: «Por triplicado, como debe ser.»', color: '#C0A2F6' },
  // menú de pausa → «Cómo se juega» (motor: game.G.help)
  help: [
    'Elige un verbo y haz clic en algo. Sin verbo, el clic anda o mira.',
    'Clic derecho (o pulsación larga): la acción más obvia.',
    'H, Espacio o el ojo del panel: ver los objetos de la sala.',
    '· El MÓVIL: clic en su icono (o clic derecho): llamar a la abuela,',
    '  que da pistas, o leer el correo.',
    '· La LIBRETA: clic en su icono para repasar las réplicas.',
    'Esc: pausa. F: pantalla completa. Toque largo: ver objetos.',
  ],
  quitConfirm: { text: '¿Seguro que quiere salir?', yes: 'Sí', no: 'Lo hablamos' },

  // §5.5: aviso al aprender una réplica (api.learnReply('rep_XX')); solo la primera vez
  learnReply: { notice: 'Réplica apuntada en la libreta.', sfx: 'good', color: '#F2D468' },

  // escenas comunes (Usar movil → api.scene('pistas'))
  scenes: { pistas, avisos },
  // ENMIENDA E2: pantallas y objetos que «hablan» con prefijo y color fijos (api.pantalla(objeto, texto), engine/script.js)
  pantallas: {
    herminia_portatil: { prefijo: 'HERMINIA (IA) › ', color: '#FF8C3C' },   // §2.2: «HERMINIA (IA) › …» (texto tras el prefijo ≤ 64)
    aro_borja: { color: '#4FD8E8' },                                        // §3.1: sin prefijo; el texto empieza por «Publicando:»
    eventos_a_ecosistema: { color: '#4FD8E8' },                             // §3.5: el móvil de Borja oído desde Eventos
    pantalla_comercial: { color: '#FF8A60' },                               // §4.4: el vídeo que se pone solo
  },
  afterEnter,           // motor: tras el onEnter de cada sala (avisos de la adenda §2)
  migrarPartida,        // motor (core.load): partidas guardadas con objetos/flags retirados (plan §3.4)

  music,

  // ---------------------------------------------------------------- créditos (§7.5): la lista y el poscréditos están en
  // content/escenas/final.js (api.credits + api.ending); aquí solo el fondo común y el LCD de Gertrudis.
  ending: { music: 'm_creditos', speed: 14, draw: endingDraw, overlay: endingOverlay, topY: 18, theEnd: 'FIN' },
};
