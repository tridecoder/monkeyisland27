// FE DE ERRATAS — definición global del juego. ARCHIVO COMPARTIDO: no lo edita ningún autor de sala.
// Título, sala inicial, respuestas por defecto (§8.2), pistas de la abuela (§5.6), cuarta pared (§8.6),
// aviso de réplica aprendida (§5.5), avisos comunes de la adenda §2 (llamadas de Evaristo, «RV:» de Tadeo), música y
// fondo de los créditos (la lista está en content/escenas/final.js).
// Hora de juego (biblia v2): viernes, de las 18:30 al cierre de las 21:00; los relojes del edificio, parados en las 20:59.
import { PAL, rect, px, hline, vline, gradV, glow, rng, ditherPick, frameRect, line, ditherOverlay, vignette } from '../engine/draw.js';
import { drawText, measure } from '../engine/font.js';
import music from './music.js';
import flags, { ADENDA_FLAGS } from './flags.js';

// ------------------------------------------------------------------ §8.2 respuestas por defecto (rotan en orden)
const DEFAULTS = {
  mirar: ['Es exactamente lo que parece. En esta casa, eso ya es noticia.', 'Lo miro con intensidad de periodista sin cenar. No descubro nada.', 'Nada que contrastar.', 'Si lo miro más, Yoli me lo cuenta como tiempo de permanencia.', 'Visto. Ni una errata. Sospechoso.'],
  coger: ['Está inventariado. Aquí todo está inventariado menos yo.', 'Si lo cojo, alguien me pedirá una nota de gasto por tocarlo.', 'No es mío. Aquí nada es mío. Ni la silla, hasta hace poco.', 'Mejor no. Luego desaparece algo y el becario es el primero en la lista.', 'No me cabe. Mi mochila ya va llena de chapas de eventos.'],
  usar: ['No veo cómo. El manual lo tiene alguien que se jubiló en 2011.', 'Usarlo así sería innovación. Y la innovación la cobra la consultora.', 'No funciona. Como casi todo lo que se enchufa en esta planta.', 'No se me ocurre para qué. Y eso que he hecho un máster.', 'Mejor no lo toco. Si se rompe, abren un ticket con mi nombre mal escrito.'],
  dar: ['No creo que lo quiera. Y si lo acepta, luego hay que declararlo.', 'Aquí si das algo sin acta, te lo devuelven con tareas.', 'Lo rechazaría. Tiene cara de quien ya tiene uno.', 'Regalar cosas en una redacción se considera soborno o despedida.', 'No. Si le doy eso, me pide factura.'],
  hablar: ['No contesta. O es un objeto o está en una videollamada.', 'Le hablo. No me contesta. Es lo más parecido a una fuente oficial.', 'Hablarle a eso sería como responder a todos: posible, pero imperdonable.', 'Silencio. Al menos no me ha dicho «lo hablamos».', 'No me contesta. Bueno, no me ha llamado Pellizco. Algo es algo.'],
  abrir: ['No se abre. Como las plazas de redactor.', 'Cerrado. Como el plazo. Como el cierre. Como mi futuro.', 'No tiene por dónde. Es un diseño muy de Dirección.', 'Si lo abro, me hacen responsable de lo que salga.', 'No se abre. Lo dejo así: está en su derecho.'],
  cerrar: ['Ya está cerrado. Aquí lo único que no cierra a tiempo es la edición.', 'Cerrarlo no cierra nada. Bueno, cerraría el tema, que aquí es lo difícil.', 'No hay nada que cerrar. Salvo un ticket. Y eso es cosa de Paco.', 'Lo cierro. No pasa nada. Igual que en las reuniones.', 'Prefiero dejarlo abierto. Como mi contrato.'],
  empujar: ['Lo empujo. No se mueve. Como un correo pidiendo aumento de sueldo.', 'No pienso empujar eso. Saldría en el próximo comité. En diapositiva.', 'Ni se inmuta. Tiene más estabilidad laboral que yo.', 'Empujo. Nada. Es como empujar la prima de riesgo con la mirada.', 'No, que luego se cae y el becario es el último que lo tocó.'],
  tirar: ['Tiro. Nada. Tiene más resistencia que el papel.', 'Aquí el que tira de algo se convierte en el responsable.', 'No pienso tirar de eso. En esta empresa ya tira siempre el becario.', 'Tiro. Se resiste. Como Teodoro a la web.', 'Mejor no. Si viene con cable, Paco me lo factura.'],
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

// ------------------------------------------------------------------ §5.6 pistas de la abuela (Usar movil)
const SALUDOS = ['¿Bruno? ¿Has comido?', 'Hijo, ¿ya sales en el periódico?', 'Te llamo porque no me llamas.'];
const PISTAS = [
  ['torno_abierto', (api) => ['En el pueblo, el que no sale en la foto no existe. Ponte en la foto, hijo.',
    ...(api.has('chicle') || api.flag('tarjeta_con_chicle') ? ['Y pégala bien, que se cae. Con eso que llevas, hijo.']
      : ['Y pégala bien, que se cae. Pídele algo que pegue al del mostrador.', 'Ese siempre está mascando algo.'])]],
  ['gertrudis_saludada', ['¿Has saludado a todo el mundo? A las máquinas también. Son las que trabajan.']],
  ['acto_2_iniciado', ['A la señora que corrige llévale un café.', 'Los que corrigen siempre están cansados.']],
  ['silla_libre', ['¿Estás de pie? Siéntate. Y si hay una chaqueta, que la lleve alguien importante.']],
  ['reunion_terminada', ['Las reuniones se acaban cuando alguien pregunta qué hay que hacer.', 'Por eso tu tío no pregunta nunca.']],
  ['casilla_hueco', ['Si alguien tiene algo apartado desde marzo, ya no es suyo. Díselo por escrito.']],
  ['cms_vivo', ['A veces las cosas no van porque hay otra cosa mirándolas todo el rato.']],
  ['nota_gasto_presentada', ['¿Has hecho la cuenta de gastos? Hazla mal. Así te enseñan una bien hecha.']],
  ['fax_con_papel', ['Las máquinas viejas son como yo: sin papel no dicen nada.']],
  ['casilla_fuente', ['Lo que me cuenta una vecina no me lo creo hasta que me lo cuenta otra.']],
  ['pieza_escrita', ['¿Y has escrito ya? Siéntate en tu silla y escribe. Sin palabras raras.']],
  ['paco_dio_manual', ['Pregúntale al de los ordenadores por ese fax. Esos saben de cacharros viejos.']],
  ['casilla_firma', ['El que no contesta, contesta solo. Como el contestador de tu tío.']],
  ['pieza_recortada', ['Si te sobra, recorta por abajo. Como los pantalones.']],
  ['pagina_cerrada', ['¿Y a qué esperas para darle los papeles a ese señor del fax?']],
  ['ruben_encontrado', ['Si de un armario sale papel, es que alguien escribe dentro, hijo.']],
  ['ruben_libre', ['Para que dejen irse a alguien, hay que demostrar que estuvo. Busca fotos.']],
  ['sala_abierta', ['En una reunión manda el que escribe el acta. Haz que la escriba otro.']],
  ['juego_terminado', ['A los que nunca dicen nada, hijo, un empujoncito. Con educación.']],
];
async function pistas(api) {
  const n = api.inc('abuela_llamadas');
  const A = 'abuela_remedios';
  // Bruno llama a su abuela: primer plano del móvil (api.phone) con su retrato; ella habla desde el móvil
  await api.phone.call({ caller: A, label: 'Abuela', outgoing: true }, async () => {
    await api.phone.say(SALUDOS[(n - 1) % SALUDOS.length]);
    // adenda 2.1: una sola vez, en la primera llamada con evaristo_llamadas >= 2, antes de la pista (la pista no cambia)
    if ((api.flag('evaristo_llamadas') || 0) >= 2 && api.once('abuela_evaristo')) {
      await api.phone.say(['Me ha llamado un señor de tu trabajo, muy educado.', 'Quería saber si "Remedios" lleva tilde. Le he dicho que no.', 'Y que te abrigues. Me ha dicho que era solo eso.']);
    }
    const hit = PISTAS.find(([flag]) => !api.flag(flag));
    if (hit) await api.phone.say(typeof hit[1] === 'function' ? hit[1](api) : hit[1]);
    await api.phone.say('Abrígate.');
  });
}

// ------------------------------------------------------------------ ADENDA §2: avisos al entrar en sala
// Llamadas de Evaristo (L1-L5, contador `evaristo_llamadas`) y «RV:» de Tadeo (RV1-RV5, contador `tadeo_rv_n`).
// Mecánica única (adenda 2): el MOTOR llama a `afterEnter` (abajo) tras el `onEnter` de CADA sala; los autores de sala
// NO tienen que hacer nada. No salta si la entrada ya ha lanzado una escena / diálogo / duelo / cinemática, ni al cargar
// partida, ni en `sala_amazonas` con `acto_3_iniciado`, ni tras el final. Como mucho UN aviso por entrada (también si
// alguien invoca `api.scene('avisos')` a mano): primero la siguiente llamada cuya condición se cumpla; si no hay,
// el siguiente RV:. Salen en orden numérico y esperan a su condición. Ninguno pone ni lee flags de la biblia (solo
// condiciones) ni bloquea nada: el jugador cierra cada globo con un clic. Sus textos son literales de la adenda.
const EV = 'evaristo_salvedad', TA = 'tadeo_adjunto';
const topAt = (api) => [api.game.camX + 160, 34];            // el teléfono siempre habla arriba, aunque el actor esté en la sala
const callLine = async (api, who, text) => {
  const g = api.game, t0 = g.time, dur = g.speechDuration(text);
  await api.phone.say(text);
  // «No se puede colgar a Evaristo»: un clic temprano sobre el globo durante una llamada (una vez en toda la partida)
  if (!g.instant && g.time - t0 < dur * 0.4 && api.once('evaristo_colgar')) {
    await api.say(['No se puede colgar a Evaristo. Lo he intentado. Me ha anotado.']);
  }
};
// Las llamadas de Evaristo (L1-L5): el móvil de Bruno en primer plano con el retrato de don Evaristo (api.phone). Cortas.
const EV_CALL = { caller: EV, label: 'Evaristo', sub: 'Controlling', ringMs: 1000 };
const llamada = (cond, guion) => ({ cond, run: async (api) => {
  await api.phone.call(EV_CALL, async () => {
    for (const [who, text] of (typeof guion === 'function' ? guion(api) : guion)) {
      if (who === 'E') await callLine(api, EV, text);
      else if (who === 'B') await api.say(text);
      else if (who === 'ring') { await api.phone.close(); await api.wait(250); await api.phone.open({ ...EV_CALL, ringMs: 700 }); }   // cuelga y vuelve a llamar
    }
  });
} });
const LLAMADAS = [
  llamada('torno_abierto', [                                                                              // L1
    ['E', 'Una cosita. Muy pequeña. Evaristo Salvedad, Controlling.'], ['E', 'Su tarjeta pone "Pellizco". ¿Es correcto?'],
    ['B', 'No. Es Pellejo.'], ['E', '¿Con una ele o con dos?'], ['B', 'Con dos.'], ['E', 'Anotado. Era solo eso.'], ['ring'],
    ['E', 'Perdone. ¿Pellejo con jota o con ge?'], ['B', 'Con jota.'], ['E', 'Ahora sí era solo eso.'],
    ['B', 'Es el primero que me lo pregunta.']]),
  llamada('acto_2_iniciado', [                                                                            // L2
    ['E', 'Una cosita. ¿Puede pasarse por mi despacho? Es un segundo.'], ['B', '¿Ahora?'], ['E', 'Cuando pueda. Pero ahora.'],
    ['E', 'Planta 2, al fondo de Administración. Era solo eso.']]),
  llamada('pieza_recortada', [                                                                            // L3
    ['E', 'Una cosita. Begoña me manda el triplicado de lo que recorta.'], ['E', 'Ella recorta sin leer. Yo leo sin recortar. Somos un sistema.'],
    ['E', 'Línea dos de su pieza: "a 4,15 euros por acción".'], ['E', 'Le han quitado la coma. Pone "415".'],
    ['B', '...Una opa a cuatrocientos quince euros la acción.'], ['E', 'Mañana se nos ríe la Bolsa. Y Celestino lo narra.'],
    ['E', 'Le he mandado la coma a Teodoro. Por fax. Era solo eso.']]),
  llamada('acto_3_iniciado', (api) => (api.flag('ruben_encontrado') ? [                                // L4
    ['E', 'Una cosita. Ya sé quién comía el atún de la -1.'], ['E', 'Veinticuatro al mes, a dos euros. Enhorabuena por encontrarle.'],
    ['E', 'Era solo eso.']] : [
    ['E', 'Una cosita. La máquina de la planta -1 vende atún desde julio.'], ['E', 'Veinticuatro bocadillos al mes. En Sistemas no come atún nadie.'],
    ['E', 'Lo he cruzado con las nóminas. No cuadra con ninguna.'], ['E', 'Alguien come ahí abajo y no cobra. Era solo eso.'],
    ['B', 'Alguien que come y no cobra. Eso es un becario.']])),
  llamada('acto_3_iniciado', (api) => (api.flag('correo_evaristo_listo') ? [                          // L5
    ['E', 'Una cosita. El correo está programado. Para el momento oportuno.'], ['E', 'Era solo eso.']] : [
    ['E', 'Una cosita. ¿Le ha llegado mi correo?'], ['B', 'No.'], ['E', 'Correcto. Aún no lo he enviado. Quería ver si funcionaba.'],
    ['E', 'Lleva una coma que me tiene en vela.']])),
];
const rv = (cond, asunto, bruno) => ({ cond, run: async (api) => {
  api.sfx('beep');
  api.notice('¡ding!  Correo nuevo: Tadeo Adjunto', { color: '#FFCC99', ms: 1800 });
  await api.wait(500);
  await api.sayAs(TA, asunto, { at: topAt(api) });
  await api.say(bruno);
} });
const RVS = [
  rv('inigo_presentado', 'RV: Mejora tus Core Web Vitals en 5 pasos (40 págs.). Por si os sirve!!', 'Para Redacción, Sistemas, Papel y Conserjería. Celestino, en copia.'),
  rv('gertrudis_saludada', 'RV: RV: Cómo instalar una bandeja 2 en una impresora sin bandeja 2.', 'La impresora de la tercera está en copia. Me identifico con ella.'),
  rv('acto_2_iniciado', 'RV: RV: RV: La IA dice que el LCP baja quitando lo más grande!!', 'Lo más grande de un periódico es la portada. Mal asunto.'),
  rv('cms_vivo', 'RV x4: ¿Qué es un CMS? Lo reenvío a los del CMS!!', 'Paco tendrá un ticket nuevo. Le contestará su mejor empleada.'),
  rv('acto_3_iniciado', 'RV x5: Reflexión sobre armarios: "AYÚDAME ESTOY EN EL ARMARIO 27"', 'Lo ha visto toda la empresa. Y nadie lo ha leído.'),
];
/** Escena común `avisos`: un aviso como mucho por entrada en sala. La lanza el motor (`afterEnter`); también se puede
 *  invocar a mano con `await api.scene('avisos')` (p. ej. al acabar una escena larga que quieras dejar pasar). */
async function avisos(api) {
  const g = api.game;
  if (g.avisoEntryN === g.entryN) return false;                               // ya ha salido uno en esta entrada
  if (api.flag('juego_terminado') || g.cutscene > 0 || g.inDialog) return false;
  if (api.room === 'sala_amazonas' && api.flag('acto_3_iniciado')) return false;
  const call = LLAMADAS[api.flag('evaristo_llamadas') || 0];
  const mail = RVS[api.flag('tadeo_rv_n') || 0];
  const pick = call && api.cond(call.cond) ? ['evaristo_llamadas', call] : mail && api.cond(mail.cond) ? ['tadeo_rv_n', mail] : null;
  if (!pick) return false;
  g.avisoEntryN = g.entryN;
  g.avisoActive = true;
  try {
    api.inc(pick[0]);
    if (pick[0] === 'evaristo_llamadas' && api.flag('evaristo_llamadas') === 2) api.setFlag('evaristo_convoco', true);   // L2
    await pick[1].run(api);
  } finally { g.avisoActive = false; }
  return true;
}
const afterEnter = (api) => avisos(api);

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

  // ---------------------------------------------------------------- §8.6 cuarta pared
  idle: { ms: 60000, run: async (api) => { await api.say('Tranquilo. Yo también me quedo así en las reuniones.'); } },
  saveMessages: ['Guardando... (original)', 'Guardando... (duplicado)', 'Guardando... (triplicado)'],
  saveFirstLine: { text: 'BEGOÑA: «Por triplicado, como debe ser.»', color: '#C0A2F6' },
  difficulty: ['Normal', 'Difícil', 'Cierre en viernes'],
  quitConfirm: { text: '¿Seguro que quiere salir?', yes: 'Sí', no: 'Lo hablamos' },

  // §5.5: aviso al aprender una réplica (api.learnReply('rep_XX')); solo la primera vez
  learnReply: { notice: 'Réplica apuntada en la libreta.', sfx: 'good', color: '#F2D468' },

  // escenas comunes (Usar movil → api.scene('pistas'))
  scenes: { pistas, avisos },
  afterEnter,           // motor: tras el onEnter de cada sala (avisos de la adenda §2)

  music,

  // ---------------------------------------------------------------- créditos (§7.5): la lista y el poscréditos están en
  // content/escenas/final.js (api.credits + api.ending); aquí solo el fondo común y el LCD de Gertrudis.
  ending: { music: 'm_creditos', speed: 14, draw: endingDraw, overlay: endingOverlay, topY: 18, theEnd: 'FIN' },
};
