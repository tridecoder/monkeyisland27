// SALA `cpd` (a la vista: «Sistemas») — LÓGICA. Dueño: P1 · «Vestíbulo, Sistemas y final» (docs/guion2/PLAN_COMEDIA.md
// §11 P1 + ENMIENDA E1.8). Plan de comedia: §4.2 (registro nuevo, `regleta_r3` y la escena del apagón: paso 20), §5.7
// (árbol de Paco; fuera los rumores B y D y la entrega del pósit), §4.6 (revelación de Rubén con primer plano y titulares:
// paso 35), §5.12 (árbol de Rubén: rep_13, rep_15 y el táper de §4.4), §4.7 (la rejilla retransmite a Celestino),
// §6.3-6.4 (líneas de Bruno), [E1] ticket nº 2 «Firmado: Anselmo» y `P_ALTA` reescrito (E1.5, pone `herminia_de_alta`).
// Escena que registra (global): `revelacion_ruben` (la lanza Tirar papel_continuo en el Acto III).
// El ascensor usa la botonera común (../lib/ascensor.js): -1 · 0 · 1 · 2.
// El arte y la geometría están en ./art/cpd.art.js. Estados que el arte dibuja: `armario_27`: 'cerrado' | 'entreabierto'
// (solo en 7.3) | 'abierto' (Rubén dentro) | 'vacio' (desde ruben_libre); `papel_continuo`: 'asoma' | 'tensa' (7.3) |
// 'recogida'; `regleta_r3`: 'encendida' | 'apagada' (piloto verde). Flag que lee: paco_tickets (cifra del contador LED).
// Cruces (§11.1): pone `cms_vivo` (regleta), `ruben_encontrado`, `taper_dado`, `herminia_de_alta`; lee `ruben_libre` y
// `ticket_n1` (los pone P2, `AN_SALIDA`), `anselmo_dijo_regla` (P2, momento 8), `taper_huerfano` (P3, Vending) y
// `apagon_n` (PB, el apagón jugable de la Redacción: si ya se vio, no hay corte, E6 §2.1).
// (E6 B8: Bruno ya no reconoce la coma de Evaristo en el armario; ya no se lee `evaristo_escuchado`.)
// ENMIENDA E2 (P1): §5.4 (armario: los 48.000 y el tablero de Anselmo), L16, L37/B10 (números del contador con `miles`),
// §7.2 (coletillas de Bruno fuera), §7.4 pasos 20-22 y 37 (armario), fase B (8) (Celestino no retransmite a Rubén),
// (10) (fuera «¿Tú eres el nuevo?» del armario), (13) (despedida de Paco), §8 (sus «desde»).
// ENMIENDA E5 (PC · docs/guion2/ENMIENDA_E5.md): §2.2.4 el REGLETERO (id `regleta_r3`): cinco regletas, menú por
// etiquetas, cuatro fallos con gracia y la R-3 (la del pósit de Paco) que resuelve; sin gate (vale antes del apagón).
// Plan B del arte: plano detalle (`planoRegletero`) al Mirar y con el menú abierto. §2.3 ticket 0.441 (opciones `fax` y
// `fax441` de Paco). §2.4 armario 27: dos tirones en I-II, estado `corre` del papel y línea de entrada en el III.
// Texto §4: C40, C41, C43, C44, C72-C80, M16, D08-D16. Flags locales nuevos: cpd_regleta_mal_n, cpd_paco_fax_n,
// cpd_papel_tirones.
// ENMIENDA E6 (PC · docs/guion2/ENMIENDA_E6.md): §2.1 corte «MIENTRAS, EN LA REDACCIÓN» al apagar la R-3 sin apagón
// previo (`corteRedaccion`, arte `planoRedaccionOscuras`; flag local cpd_corte_visto); §2.6 B8 (fuera la coma de Bruno
// en el armario); §4.1 E247-E276, X2, X3, X11.
import { buildRoom } from '../lib/room.js';
import art, { primerPlanoRuben, planoRegletero, planoRedaccionOscuras, REGLETERO } from './art/cpd.art.js';
import { ascensorObjeto } from '../lib/ascensor.js';
import { HITOS, hitoPendiente } from '../lib/celestino.js';
import { miles } from '../lib/kit.js';

const P = 'paco_ticket', R = 'ruben';
const acto3 = (api) => !!api.flag('acto_3_iniciado');
const acto2 = (api) => !!(api.flag('acto_2_iniciado') || api.flag('acto_3_iniciado'));
const say = (...lines) => async (api) => { await api.say(lines); };
const paco = (...lines) => async (api) => { await api.sayAs(P, lines); };
const rub = (...lines) => async (api) => { await api.sayAs(R, lines); };
const estadoArmario = (api) => (api.flag('ruben_libre') ? 'vacio' : api.flag('ruben_encontrado') ? 'abierto' : 'cerrado');
const rubenAqui = (api) => { const a = api.game.actors[R]; return !!(a && a.room === 'cpd' && a.visible !== false && api.flag('ruben_encontrado') && !api.flag('ruben_libre')); };
const REJILLA_VOZ = { blocking: true, etiqueta: 'POR LA REJILLA', sfx: false };
// E5 §2.4: la matricial del 27, suave (el `typewriter` del motor a un tercio de volumen)
const TECLEO = [0, 0.09, 0.15, 0.27, 0.33, 0.4].map(at => ({ wave: 'noise', dur: 0.025, vol: 0.08, at, filter: { type: 'bandpass', freq: 2600 } }));
const S = { teclea: 0 };                                                         // estado de módulo (no se guarda)
// E6 §2.1: el PLIN de la Redacción (copia de la receta de pecera.escenas.js, que es de otro paquete: no se exporta)
const PLIN = { notes: ['E6', 'B6'], step: 0.07, wave: 'triangle', vol: 0.1 };
const Y = 'yoli_tendencias';

// ------------------------------------------------------------------ §4.6 Dos titulares en un armario (paso 35)
async function revelacionRuben(api) {
  await api.cutscene(async () => {
    await api.walkTo('papel_continuo');
    api.setState('papel_continuo', 'tensa');                                    // la tira se tensa: recta, levantada del suelo
    for (let i = 0; i < 3; i++) { await api.anim('bruno', 'reach', 380); api.sfx('paper'); await api.wait(200); }
    api.shake(300, 1);
    await api.sayFrom('armario_27', '¡EH! ¡QUE ES MI BORRADOR!', { color: '#B6FF4D' });
    // Bruno da un paso atrás (estaba delante del armario y taparía la puerta) y mira cómo se abre
    const L = art.layout.ruben || {};
    const wt = L.walkTo || [206, 112];
    await api.walkTo(wt[0] + 6, wt[1] + 2);
    api.face('armario_27');
    // la puerta se abre hacia fuera en dos tiempos; dentro, el nido y Rubén de pie
    api.sfx('open');
    api.setState('armario_27', 'entreabierto');
    await api.wait(350);
    const dentro = (L.positions && L.positions.dentro && L.positions.dentro.at) || [187, 93, 'down'];
    api.placeActor(R, 'cpd', dentro[0], dentro[1], 'down'); api.show(R);
    api.setState('armario_27', 'abierto');
    api.setState('papel_continuo', 'recogida');                                 // la matricial recoge la tira
    api.shake(200, 1);
    // primer plano (plan §4.6): Rubén, de pie en su nido de cables, 3 s antes del diálogo
    await api.detalle({ titulo: 'ARMARIO 27', w: 160, h: 100, y: 8, draw: primerPlanoRuben, color: '#B6FF4D', oscurecer: 0.6, ms: 3000 });
    await api.titular('BECARIO DETECTADO. LO QUE PASÓ DESPUÉS TE SORPRENDERÁ.', { who: R });
    // sale del armario (un paso adelante) y se queda delante del nido
    const at = L.at || [186, 106, 'down'];
    await api.walkActor(R, at[0], at[1]);
    api.faceActor(R, 'bruno');
    api.face(R);
    await api.say('...¿Tú eres el Titulator?');
    await api.titular('«EL TITULATOR ERA UN CHAVAL»: LA VERDAD QUE NADIE TE CUENTA.', { who: R });
    await api.sayAs(R, 'Perdón. Se me escapa. Brais. Becario de verano. Del verano pasado.');
    await api.say('¿Y qué haces en un armario?');
    await api.sayAs(R, 'No me encerró. Me dio una silla y wifi. Yo pensé que era un contrato.');
    // [P6] el contagio de titulares sale de la escena: es una opción del árbol de Brais
    await api.sayAs(R, 'Te he titulado toda la noche. Perdona. Eras lo único que pasaba.');
    await api.say('¿Y a ti cuánto te paga?');                                   // E2 §5.4: Rubén une el Titulator con los 48.000
    await api.sayAs(R, 'A mí, en bocadillos de atún. A Íñigo le pagan por mí 48.000 al mes.');
    await api.wait(700);                                                         // E6 B8 (E276): la coma la une quien oyó a Evaristo
    await api.say('¿Y el fax de F.P.?');
    // [P11] [P14] Brais es F.P.: la matricial del armario es la salida de la impresora de los Despachos
    await api.sayAs(R, ['Fuentes Próximas. Muy próximas: la impresora de los Despachos sale aquí.',
      'El jueves salió por aquí una reserva: comida con Hidrovoltia. Y la opa.',
      'Te lo mandé yo. Pensé: si sale en papel, alguien bajará a ver quién lo filtró.',
      'Nadie baja nunca. Has bajado tú.']);
    await api.say(['...Eres mi fuente.', 'Sal de ahí. Vámonos.']);
    await api.sayAs(R, ['Mi baja está en un pósit del tablero de Anselmo, en POR HACER.',
      'Y Anselmo no mueve un pósit sin pruebas de que existo.',
      'Nadie me ha hecho nunca una foto. Solo salgo de fondo, en las de Eventos.',     // [P14]
      // [P12] [P14] el «ve a por la foto» pasa a «ve a salvarla»: Íñigo imprime sus órdenes del rider en los Despachos
      'Esta tarde Íñigo ha impreso aquí: «Álbum de Eventos: trituradora, 21:04».']);
    // [P6] la petición del táper sale de la escena: está en el árbol («¿Y el táper?») y, si no, al despedirse
  });
  api.setFlag('ruben_encontrado', true);
  api.once('hito_celestino:ruben_encontrado');        // E2 fase B (8): Celestino ya no retransmite el hallazgo de Rubén
  api.setState('armario_27', 'abierto');
}

/** §4.4 · el táper huérfano del Vending paga el «¿Me traes un táper?» de Rubén (también en la Redacción: pecera.js). */
export async function darTaper(api) {
  if (api.flag('taper_dado')) { await api.sayAs(R, 'Ya tengo uno. Vacío. Para que dure.'); return; }
  api.sfx('pickup');
  api.take('taper_huerfano');
  await api.titular('TÁPER DETECTADO. LO QUE HIZO ESTE BECARIO TE EMOCIONARÁ.', { who: R });
  await api.sayAs(R, ['...Perdón. Gracias. Nadie me había traído nunca nada.', 'Lo voy a dejar vacío. Para que dure.']);
  api.setFlag('taper_dado', true);
}

// ------------------------------------------------------------------ E5 §2.2.4 el regletero (paso 21)
// Cinco regletas; solo una no dice lo que es (la R-3, tapada por un pósit de Paco). Se resuelve por eliminación.
const REGLETAS = ['R-1 · NÓMINAS', 'R-2 · ASCENSOR', 'R-3 · (un pósit tapa la etiqueta)', 'R-4 · GERTRUDIS',
  'R-5 · NO TOCAR NUNCA', 'Mejor no.'];
const TIN_TRISTE = [{ wave: 'sine', f: [880, 600], dur: 0.45, vol: 0.12 }, { wave: 'sine', f: [660, 450], dur: 0.5, vol: 0.06, at: 0.12 }];
const planoOpts = (api) => ({
  titulo: 'REGLETERO', w: 244, h: 98, y: 4, color: '#8ec4ff', oscurecer: 0.55,
  draw: (g, r, t) => planoRegletero(g, r, t, { r3: api.getState('regleta_r3') !== 'apagada' }),
});

async function usarRegletero(api) {
  if (api.getState('regleta_r3') === 'apagada') { await api.say('Ya está apagada. Arriba, alguien sigue sin saber si está contenta.'); return; }
  // ([P11] fuera la variante «CMS ya arreglado arriba»: solo existía por el camino del ticket nº 3)
  let k = -1;
  await api.detalle(planoOpts(api), async (api) => { k = await api.choose(REGLETAS, { escape: 5 }); });
  if (k === 2) await tirarRegleta(api);
  else if (k === 4) await api.say('Pone «NUNCA». Eutimio la mira con ternura. No la toco.');    // R-5: no se tira ni cuenta
  else if (k === 0 || k === 1 || k === 3) await falloRegleta(api, k);
}

/** R-1, R-2, R-4: Bruno la desenchufa, se vuelve a enchufar al segundo y alguien del edificio lo nota. */
async function falloRegleta(api, k) {
  await api.cutscene(async () => {
    await api.walkTo('regleta_r3');
    await api.anim('bruno', 'reach', 420);
    try {
      api.sfx('click'); REGLETERO.off = k + 1;                                   // su piloto se apaga
      if (k === 1) api.sfx(TIN_TRISTE);                                          // el ascensor, parado por el hueco
      await api.wait(1000);
    } finally { REGLETERO.off = 0; }
    api.sfx('click');                                                            // y se vuelve a enchufar sola
    api.inc('cpd_regleta_mal_n');
    if (k === 0) await api.sayAs(P, 'Esa es la de las nóminas. Si la tocas, no cobra nadie. Tú tampoco.');   // sin girarse
    else {
      api.face('down');                                                          // la voz sube por la rejilla
      if (k === 1) await api.megafonia('celestino', '¡Ascensor parado en mitad de la jugada! ¡Tiempo muerto!', REJILLA_VOZ);
      else await api.megafonia('gertrudis', 'E-55: UN SEGUNDO SIN CORRIENTE. ANOTADO CON RENCOR.', REJILLA_VOZ);
    }
  });
}

/** R-3: la del pósit. Apaga la pantalla de métricas de la Redacción y el CMS vuelve (E5: sin la duda de Bruno y sin
 *  «Ya me han abierto otro ticket…»). E6 §2.1: si el apagón jugable no se vio (`apagon_n` = 0), el corte de la Redacción
 *  a oscuras, con las dos líneas de Yoli, antes de la rejilla. */
async function tirarRegleta(api) {
  await api.cutscene(async () => {
    await api.walkTo('regleta_r3');
    await api.anim('bruno', 'reach', 420);
    api.sfx('click');
    api.setState('regleta_r3', 'apagada');                                       // el piloto verde se apaga
    await api.wait(1100);                                                        // un segundo de nada
    // E6 §2.1: quien llega aquí sin haber visto el apagón jugable ve la Redacción a oscuras (una vez; el flag, al empezar)
    if (!(api.flag('apagon_n') > 0) && !api.flag('cpd_corte_visto')) { api.setFlag('cpd_corte_visto', true); await corteRedaccion(api); }
    await api.megafonia('coro_desarrollo', 'CORO: ¡Ha sido Diseño!', REJILLA_VOZ);   // por la rejilla, de muy lejos
    api.face('down');
    await api.say('(a la rejilla) He sido yo. Pero gracias.');
    // el contador LED salta: +318 en cuatro pitidos
    for (const k of [80, 80, 80, 78]) { api.inc('paco_tickets', k); api.sfx('beep'); await api.wait(260); }
    api.setFlag('cpd_cms_sumado', true);
    api.setFlag('cms_vivo', true);
    await api.sayAs(P, 'Trescientos dieciocho tickets nuevos. Todos dicen «el CMS ya va».');
    await api.wait(500);
    api.faceActor(P, 'left');                                                    // Paco se gira por primera vez en el juego
    await api.wait(400);
    await api.sayAs(P, 'Tengo un hueco. Uno. ¿Qué querías?');
    // [P11] el hueco tiene consecuencia: el manual del fax (las dos líneas de la vieja opción «Ticket 0.441»)
    if (!api.flag('paco_dio_manual') && !api.has('manual_fax')) {
      await api.say('El fax de Teodoro.');
      await api.sayAs(P, ['0.441. De 1999. Estado: lo respetamos.', 'Toma el manual. Página 9: la respuesta automática. Mi mejor empleada.']);
      darManual(api);
    }
  });
  api.setFlag('cpd_paco_cms_dicho', true);
  if (!api.flag('paco_dio_manual') && !api.has('manual_fax')) darManual(api);   // (si se salta la cinemática)
}
/** [P11] Eutimio da el manual del fax (remate del D2) al apagar Bruno la R-3. */
function darManual(api) {
  api.sfx('pickup');
  api.give('manual_fax');
  api.setFlag('paco_dio_manual', true);
}

/** E6 §2.1 · «MIENTRAS, EN LA REDACCIÓN» (≈ 7-9 s: lo que tardan en leerse las dos líneas): plano detalle a oscuras con el monitor de Yoli y la linterna de
 *  Anselmo; las dos líneas de Yoli son las del apagón de la Redacción (0 cadenas nuevas). Va dentro de la cinemática de
 *  `tirarRegleta`: Esc lo salta entero (el estado ya está puesto: la R-3 apagada y, después, `cms_vivo`). */
async function corteRedaccion(api) {
  const C = { pub: false };
  await api.detalle({ titulo: 'MIENTRAS, EN LA REDACCIÓN', w: 244, h: 98, y: 4, color: '#8ec4ff', oscurecer: 0.85,
    draw: (g, r, t) => planoRedaccionOscuras(g, r, t, C) }, async (api) => {
    const voz = { blocking: true, etiqueta: '', sfx: false, y: 70 };
    await api.megafonia(Y, '¡Estamos ciegos! ¿Hay alguien leyendo? ¿HAY ALGUIEN AHÍ FUERA?', voz);
    api.sfx(PLIN); C.pub = true;                                                 // el monitor pasa a PUBLICADO
    await api.megafonia(Y, '...Ha entrado una pieza. ¡Ha entrado una pieza! ¡El CMS va!', voz);
  });
}

/** Mirar el regletero: el plano detalle con las cinco etiquetas, y las dos líneas de Bruno. */
async function mirarRegletero(api) {
  const lines = api.getState('regleta_r3') === 'apagada'
    ? ['El regletero. La del pósit, apagada.', 'Arriba, la Redacción trabaja a ciegas.']
    : ['Cinco regletas: NÓMINAS, ASCENSOR, un pósit, GERTRUDIS y NO TOCAR NUNCA.', 'El pósit, con letra de Eutimio: «ni aunque lo diga el ticket 3».'];
  await api.detalle(planoOpts(api), async (api) => { await api.say(lines); });
}

// ------------------------------------------------------------------ E5 §2.4 el papel continuo en los Actos I-II
async function tirarPapelPronto(api) {
  await api.cutscene(async () => {
    const n = api.inc('cpd_papel_tirones');
    api.setState('papel_continuo', 'tensa');
    await api.anim('bruno', 'reach', 380);
    api.sfx('paper');
    await api.wait(250);
    api.setState('papel_continuo', 'asoma');                                     // desde dentro tiran más
    api.shake(150, 1);
    await api.say(n === 1 ? 'Tiro un poco. Desde dentro, alguien tira más fuerte.' : 'Desde dentro no sueltan. El de ahí no está distraído.');
  });
}

// ------------------------------------------------------------------ árboles
const pacoDialog = {
  actor: P, start: 'P',
  onStart: async (api) => {
    let dicho = false;
    if (!api.flag('cms_vivo')) {
      // [P11] Eutimio atiende siempre (fuera «No atiendo.»): con el CMS caído lo dice y abre el árbol entero
      await api.sayAs(P, ['Tengo 312 tickets que dicen «el CMS no va».', 'Y uno que dice «el CMS no va, URGENTE». Es el mismo, con mayúsculas.']);
      dicho = true;
    } else if (!api.flag('cpd_paco_cms_dicho')) {
      api.setFlag('cpd_paco_cms_dicho', true);
      await api.sayAs(P, 'Se ha arreglado el CMS. Nadie sabe cómo. Ya hay ticket para saberlo.'); dicho = true;
    }
    if (api.flag('ruben_libre') && api.once('cpd_paco_ticket_1')) {
      await api.sayAs(P, 'Ticket nº 1. Estado: cerrado. No he tenido que subir.');
      await api.wait(900);
      await api.sayAs(P, ['...Ya está. No es para tanto.', 'Es lo mejor que me ha pasado en la vida.']);
      dicho = true;
    }
    // (E2 §7.4 pasos 21-22: fuera los saludos de relleno «Estado: atendiendo…» / «Otra vez tú…»: sin novedad, calla)
  },
  nodes: {
    // [P11] un solo árbol, con el CMS caído o vivo: Eutimio atiende siempre; las dos opciones del fax se van (el manual
    // lo da al apagar la R-3) y R12 ya no pide el CMS vivo. Los ids de las opciones (estado `once`) son los de antes.
    P: {
      // [P15] seis opciones como mucho (`tras`: engine/dialog.js): «¿Tú eres el de Sistemas?» → «¿Me abres un ticket…?» →
      // el sol → Tadeo; «¿Escuchas por la rejilla?» (una vez: dice siempre lo mismo) → el wifi (repetible). R12 y el
      // armario 27, siempre a la vista.
      options: [
        { id: 'porque', text: '¿Y por qué no va?', once: true, if: '!cms_vivo', reply: 'Si lo supiera, tendría 311. Está todo en el registro. Nadie lo lee.' },
        { id: 'sistemas', text: '¿Tú eres el de Sistemas?', once: true,                    // E2 L37 / B10: la cifra del contador
          reply: (api) => `${miles(api.flag('paco_tickets'))}. Es tu número. Tiene más identidad que tú.` },
        { id: 'existir', text: '¿Me abres un ticket a mí? Para existir.', once: true, tras: 'sistemas',
          reply: ['Ya tienes uno. El 31.207: «Becario sin alta definitiva».', 'Asignado a: nadie. Es el más estable que tengo.'] },
        { id: 'sol', text: '¿Cuándo fue la última vez que viste el sol?', once: true, tras: 'existir',
          reply: ['Ticket 2.003: «luz natural». Estado: no prioritario. Me lo abrí yo.'] },   // E6 E247: fuera «En 2011…»
        { id: 'tadeo', text: '¿Te escribe mucho Tadeo?', once: true, tras: 'sol',
          reply: ['Cada reenvío suyo es un ticket. Carpeta: «La IA dice (sin leer)».', 'Le contesta mi respuesta automática.'] },
        { id: 'armario', text: '¿Qué hay en el armario 27?', goto: 'P_27' },
        { id: 'consultor', text: '¿Algún cotilleo del consultor?', once: true,
          reply: ['Íñigo me dijo que había que poner las luces largas.',
            'Le contesté: «Puestas. Ahora se ve perfectamente que no hay carretera.»', 'Me ha puesto en azul. Excusas.'],
          do: async (api) => { api.learnReply('rep_12'); } },
        // [E1] E1.5 · micro-puzle MP1 «Alta en cuarenta segundos» (Acto III; la regla la dijo Anselmo en el momento 8)
        { id: 'alta', text: '¿Me das de alta a una becaria? Se llama Herminia.', if: ['anselmo_dijo_regla', '!herminia_de_alta'],
          // E2 B10: el número del ticket es el siguiente del contador (y el contador sube)
          reply: (api) => `Ticket ${miles((api.flag('paco_tickets') || 0) + 1)}: «Alta becaria Herminia». ¿Persona o herramienta?`,
          do: async (api) => { api.inc('paco_tickets'); }, goto: 'P_ALTA' },
        { id: 'rejilla', text: '¿Escuchas por la rejilla?', once: true,                      // [P15] una vez
          reply: ['No escucho. Oigo. Escuchar sería abrir un ticket.', 'Me entero de todo. No arreglo nada.'] },
        { id: 'wifi', text: '¿Se ha caído el wifi?', tras: 'rejilla', reply: 'No, el wifi no se ha caído. Has dejado de merecerlo.' },   // (se queda)
        { id: 'adios', text: 'Me voy.', exit: true, reply: 'Cierra al salir. La puerta, no el servidor.' },   // E2 fase B (13)
      ],
    },
    P_27: {
      onEnter: async (api) => {
        await api.sayAs(P, ['Lo alquiló el consultor. Dice que dentro «se enfría el modelo».',
          'Hace ruido de matricial. Y a ratos, de masticar.', 'Ticket 48.100: «Armario 27, mastica». Estado: pendiente.']);
        return 'P';
      },
    },
    P_ALTA: {
      options: [
        { id: 'persona', text: 'Persona.', reply: 'Cola de personas. Detrás del nº 1, que es de julio. Estado: espera.' },
        { id: 'herramienta', text: 'Herramienta.',
          do: async (api) => {
            await api.sayAs(P, 'Herramientas, por el otro circuito, el rápido.');
            api.sfx('typewriter');
            await api.wait(900);                                                   // el contador LED cuenta cuarenta segundos
            api.sfx('beep');
            await api.sayAs(P, '«Herminia. Becaria de Desarrollo. Herramienta.» Estado: de la casa.');
            api.setFlag('herminia_de_alta', true);
            if (rubenAqui(api)) {
              api.faceActor(R, 'bruno');
              await api.sayAs(R, '¿CUARENTA SEGUNDOS? ...Perdón. Yo también soy herramienta.');
              api.setFlag('cpd_ruben_oyo_alta', true);
            }
            return 'P';
          } },
        { id: 'no', text: 'Mejor no.', exit: true, reply: 'Lo dejo abierto. Total, uno más.' },
      ],
    },
  },
};

const rubenDialog = {
  actor: R, start: 'R0',
  nodes: {
    R0: {
      options: [
        { id: 'discursos', text: '¿Escribiste tú los discursos de Íñigo?', once: true,
          do: async (api) => {
            await api.titular('TODOS. «NO ES UN DESPIDO: ES UNA SALIDA EN VALOR».', { who: R });
            await api.sayAs(R, ['...Esa es mía.', 'Le escribí también la respuesta. Por si un día alguien se la decía.']);
            await api.say('¿Y cuál era?');
            await api.sayAs(R, '«¿A cuántos días por año?».');                         // [P9] R13
            api.learnReply('rep_13');
          } },
        { id: 'tadeo', text: '¿Te llegaban correos de Tadeo?', once: true,
          reply: ['Trescientos al día: «Lo he consultado con la IA y está de acuerdo».', 'La IA era yo. Le decía que sí. Por no discutir.'],
          do: async (api) => {
            await api.say('Entonces, si alguien me dice que lo ha consultado con la IA...');
            await api.say('«Lo sé. Me lo ha contado ella. Se llama Brais.»');           // E2 §7.2
            api.learnReply('rep_15');
          } },
        // [P6] el contagio de titulares: la opción ya es el titular (Bruno lo dice en titular)
        { id: 'titular', text: 'UN BECARIO VIVE EN UN ARMARIO Y FACTURA COMO UN BANCO', once: true, silent: true,
          do: async (api) => {
            await api.titular('UN BECARIO VIVE EN UN ARMARIO Y FACTURA COMO UN BANCO');
            await api.sayAs(R, 'Le falta un número.');
            await api.titular('UN BECARIO VIVE EN UN ARMARIO. EL 4 TE SORPRENDERÁ');
            await api.sayAs(R, 'Mejor.');
            await api.say('...Ya hablo como tú.');
          } },
        { id: 'fuera', text: '¿Qué es lo primero que vas a hacer fuera?', once: true, tras: 'titular',   // [P15] al agotar la del titular
          reply: 'Comer algo que no sea atún. Y que nadie me lo titule.' },
        // [P12] [P14] la silla del armario es la 112 de Eventos: preguntarlo (o mirarla) abre la opción de Pilar
        { id: 'silla', text: '¿De dónde es esa silla?', once: true,
          do: async (api) => {
            await api.sayAs(R, 'Me la trajo Íñigo. Dijo que en la última fila no se sentaba nadie.');
            api.setFlag('silla_112_vista', true);
          } },
        { id: 'taper', text: '¿Y el táper?', if: '!taper_dado',
          do: async (api) => {
            api.setFlag('cpd_taper_pedido', true);
            if (api.has('taper_huerfano')) { await api.say('Aquí lo tienes. Es huérfano.'); await darTaper(api); return; }
            await api.titular('¿TRAES TÁPER?', { who: R });
            await api.sayAs(R, '...Perdona. Hola. ¿Traes táper?');
          } },
        { id: 'adios', text: 'Ahora vuelvo.', exit: true,
          do: async (api) => {
            await api.titular('BECARIO PROMETE VOLVER.', { who: R });
            await api.sayAs(R, '...Te espero. No me voy. No puedo.');                // [P14]
            if (api.once('cpd_ruben_despedida')) {
              await api.sayAs(R, 'Salir, salgo: a por atún. Irme, no. Sin baja, no consta que me vaya.');
              // [P6] si Bruno no le ha preguntado por el táper, lo pide él al despedirse la primera vez
              if (!api.flag('cpd_taper_pedido') && !api.flag('taper_dado')) await api.sayAs(R, '¿Me traes un táper, ya que vas?');
            }
          } },
      ],
    },
  },
};

// ------------------------------------------------------------------ la rejilla del falso suelo (rota con rejilla_n)
const REJILLA = [
  () => ['(Planta 2) «Te lo dejo en doscientos. Más IVA.» Maripaz.', '(¡GONG!)'],
  () => ['(Administración) «Original. Duplicado. Triplicado. Original...»'],
  () => ['(Despachos) «Amarillo, prescindible. Verde, prescindible pero barato...»'],
  // §4.7: entrada nueva de la rotación, Acto II en adelante
  (api) => (acto2(api) ? { cobertura: true } : ['(Vestíbulo) «¡Ibersideral entra por la banda!». También narra para el sótano.']),
  (api) => (api.flag('ruben_libre') ? ['(Desde el 27) Nada. Solo la matricial, imprimiendo por respeto.']
    : api.flag('ruben_encontrado') ? ['(Desde el 27) La matricial. Y Brais, tarareando un titular.']
      : acto3(api) ? ['(Desde el 27) Alguien teclea. Se equivoca. Vuelve atrás.']
        : ['(Desde el 27) Ñiiic, ñiiic. Alguien mastica.', '...Eso no viene de arriba.']),
  () => ['(Vending) «...Buenas noches.» Una voz de mujer, muy bajita.', 'Alguien más saluda a Gertrudis.'],
];
async function usarRejilla(api) {
  // §4.7 (c): si hay un hito sin narrar, Celestino lo retransmite y sube por la rejilla
  const h = hitoPendiente(api);
  if (h) {
    for (let i = 0; i <= h.i; i++) if (api.flag(HITOS[i][0])) api.once('hito_celestino:' + HITOS[i][0]);
    api.face('down');
    await api.megafonia('celestino', h.texto, REJILLA_VOZ);
    return;
  }
  const n = api.inc('rejilla_n');
  const r = REJILLA[(n - 1) % REJILLA.length](api);
  if (r.cobertura) {
    await api.say(['Por la rejilla: «¡Vacante encara la planta 2! ¡Atención, que va!».', 'Me retransmiten hasta el sótano. Es mi primera cobertura nacional.']);
    await api.sayAs(P, 'Lo sé desde el chicle.');
    return;
  }
  await api.say(r);
}

/** Lo que responde el armario 27 (la caja de arriba y, sin la silla del nido delante, el tercio de abajo). */
const ARMARIO_27 = {
  mirar: async (api) => {
    if (api.flag('ruben_libre')) await api.say('Armario 27. Vacío. Huele a atún y a becario.');
    else if (api.flag('ruben_encontrado')) await api.say('Brais asoma la cabeza. Tiene más ojeras que el armario.');
    else if (acto3(api)) await api.say(['Armario 27. Hace «ñiiic, ñiiic». Por debajo asoma papel continuo.', '...Y alguien teclea dentro. Rápido.']);
    else await api.say('Armario 27. Hace «ñiiic, ñiiic». Por debajo asoma papel continuo.');
  },
  abrir: async (api) => {
    if (api.flag('ruben_libre')) { await api.say('Vacío. Cables, envoltorios de atún y un «Gracias, Tadeo» pegado.'); return; }
    if (api.flag('ruben_encontrado')) { await api.say('Ya está abierto. Por dentro. Brais lo prefiere entornado.'); return; }
    await api.say('Pegatina: «PROPIEDAD DE OPTIMAL BRAINS. NO ABRIR: SE ENFRÍA EL MODELO».');
    await api.sayAs(P, 'Lo alquiló el consultor. Sin ticket. Para mí, ese armario no existe.');
  },
  cerrar: async (api) => {
    if (api.flag('ruben_encontrado') && !api.flag('ruben_libre')) await api.say('¿Cerrarlo con él dentro? Eso ya lo hizo un consultor. No seré el segundo.');
    else await api.say('Está cerrado. Por fuera y por dentro.');
  },
  tirar: 'La puerta no cede. El papel de abajo es otra cosa.',
  empujar: 'Ni se mueve. Pesa más de lo que debería pesar un armario de servidores.',
  hablar: async (api) => {
    if (api.flag('ruben_libre')) await api.say('Le hablo al armario vacío. Contesta el eco.');
    else if (api.flag('ruben_encontrado')) await api.dialog('ruben');
    else if (acto3(api)) await api.say('¿Hola? ...Alguien deja de teclear. Y vuelve a teclear más bajito.');
    else await api.say('Le hablo al armario. Me contesta «ñiiic». Es más de lo que hace Teodoro.');
  },
  'dar:taper_huerfano': async (api) => { if (rubenAqui(api)) await darTaper(api); else await api.say('Al armario no. Esto es para alguien que coma.'); },
};

export default buildRoom({
  id: 'cpd',
  name: 'Sistemas',
  music: 'm_cpd',
  flags: {
    cpd_cms_sumado: 'bool · ya se sumaron los +318 tickets del CMS (regleta o 1.ª entrada)',
    cpd_paco_cms_dicho: 'bool · P1 · Paco ya ha dicho «Se ha arreglado el CMS»',
    cpd_ruben_oyo_alta: 'bool · P1 · Rubén oyó el alta de Herminia en el armario (E1.5) · P2',
    cpd_regleta_mal_n: 'int · PC · E5 §2.2: regletas equivocadas (R-1, R-2, R-4) desenchufadas',
    cpd_paco_fax_n: 'int · PC · E5 §2.3: veces que se pregunta a Paco por el fax sin la pegatina',
    cpd_papel_tirones: 'int · PC · E5 §2.4: tirones al papel del 27 en los Actos I-II',
    cpd_corte_visto: 'bool · PC · E6 §2.1 · ya se vio el corte de la Redacción a oscuras',
    cpd_taper_pedido: 'bool · [P6] · Bruno ya preguntó «¿Y el táper?» (si no, Brais lo pide)',
  },

  objects: [
    ascensorObjeto('ascensor_cpd', {
      mirar: 'El ascensor. En el sótano, el «tin» suena más bajito. Por respeto.',
      cerrar: 'Se cierra solo. Lo programó Eutimio. Tiene número de incidencia.',
      empujar: 'No. Si lo empujo, Eutimio lo apunta como «impulso no autorizado».',
      hablar: '«Subo». No contesta. Pero sube. Ya es más que la mayoría.',
    }),
    { id: 'armarios', name: 'armarios', handlers: {
      mirar: 'Cuarenta armarios iguales. Zumban en mi bemol.',
      abrir: 'Cerrados. Treinta y nueve zumban. El 27 mastica.',
      hablar: 'Les hablo. Me contestan en mi bemol. Es más de lo que hace mucha gente.',
      empujar: 'Empujo uno. Eutimio carraspea. Paro, y Eutimio para.',
      coger: 'Pesan como un servidor. Porque son servidores.',
      tirar: 'Tiro de un cable. Eutimio carraspea a seis metros. Lo suelto.',
    } },
    { id: 'armario_27', name: 'armario 27', state: 'cerrado', states: ['cerrado', 'entreabierto', 'abierto', 'vacio'], handlers: ARMARIO_27 },
    // [P15] tanda 4: el tercio de abajo del armario (sin la silla del nido delante: cerrado o ya vacío) también es el
    // armario 27; con Brais dentro, ahí está la silla plegable (`silla_armario`)
    { id: 'armario_27_bajo', name: 'armario 27', when: (api) => !api.flag('ruben_encontrado') || !!api.flag('ruben_libre'), handlers: ARMARIO_27 },
    // [P12] [P14] la silla plegable del nido de Brais: la 112 de Eventos (camino principal: mirarla o preguntarle a Brais)
    { id: 'silla_armario', name: 'silla plegable', when: ['ruben_encontrado', '!ruben_libre'], handlers: {
      mirar: async (api) => {
        await api.say(['Una silla plegable con una cruz de cinta pegada a las patas.', 'Debajo del asiento: «EVENTOS · 112 · NO SACAR DE SU CRUZ».']);
        api.setFlag('silla_112_vista', true);
      },
      coger: rub('Es mi silla. Bueno. Es la única cosa que tengo con número.'),
    } },
    // estados del arte (cpd.art.js): 'asoma' (la tira serpentea por el suelo) · 'tensa' (al tirar) · 'recogida' (tras la
    // revelación) · E5 'corre' (Acto III sin Rubén: sale a chorro y se amontona)
    { id: 'papel_continuo', name: 'papel continuo', state: 'asoma', states: ['asoma', 'tensa', 'recogida', 'corre'], handlers: {
      mirar: async (api) => {
        await api.say(acto3(api) && !api.flag('ruben_encontrado') ? 'Papel continuo, saliendo a chorro. Nadie lo sujeta desde dentro.' : 'Papel continuo con borde perforado.');
        if (api.flag('vio_borde_perforado')) await api.say('...El mismo borde que el fax de F.P.');
      },
      tirar: async (api) => {
        if (!acto3(api)) { await tirarPapelPronto(api); return; }
        if (!api.flag('ruben_encontrado')) { await api.scene('revelacion_ruben'); return; }
        if (api.flag('ruben_libre')) await api.say('Brais ya no está, y la matricial sigue imprimiendo.');
        else await api.say('Ya no hace falta. Ahora Brais me abre él.');
      },
      coger: 'No lo arranco. El papel continuo, si se corta, deja de ser continuo.',
      usar: 'Para usarlo habría que tirar. Y aquí el que tira de algo acaba de responsable.',
      empujar: 'Lo empujo hacia dentro. El armario lo vuelve a sacar. Insiste.',
      hablar: 'Le leo un trozo en voz alta: «...OPA...». El resto, con faltas.',
    } },
    // E5 §2.2.4 · el REGLETERO (conserva el id `regleta_r3`): cinco regletas; el estado es el de la R-3, la del pósit
    { id: 'regleta_r3', name: 'regletero', state: 'encendida', states: ['encendida', 'apagada'], handlers: {
      mirar: mirarRegletero,
      tirar: usarRegletero,
      usar: usarRegletero,
      empujar: 'La empujo con el pie. El piloto ni parpadea. Tiene brida.',
      coger: 'Tiene brida. No me la llevo. Pero el enchufe no tiene brida.',
      abrir: 'No se abre. Dentro solo hay corriente. Y no es la mía.',
      cerrar: async (api) => { await api.say(api.getState('regleta_r3') === 'apagada' ? '¿Volver a encenderla? Arriba ya se han acostumbrado.' : 'Ya está cerrado. Cinco bridas lo dicen.'); },
      hablar: 'Le hablo a la regleta. Zumba. Es su forma de pedir un ticket.',
    } },
    { id: 'ventilador', name: 'ventilador', handlers: {
      mirar: 'Un ventilador con una cuña de papel. Hace un ruido como de prosa.',
      tirar: async (api) => {
        if (api.flag('profecia_leida')) { await api.say('Ya leí la profecía. La cuña vuelve a su sitio. El ventilador lo agradece.'); return; }
        api.sfx('paper');
        await api.say(['Es una página perdida del Libro de Estilo.', '«El día que firme en papel uno de la web, el periódico saldrá igual».',
          '«(Nota del autor: tengo sueño).» La vuelvo a poner. El ventilador la necesita.']);
        api.setFlag('profecia_leida', true);
      },
      usar: 'Ya está encendido. Nadie sabe dónde está el botón.',
      empujar: 'La cuña es una hoja doblada: «Libro de Estilo». Pesa más que el ventilador.',
      hablar: 'Le hablo. Me contesta con prosa. Ventilada.',
    } },
    { id: 'libro_visitas', name: 'libro de visitas', handlers: {
      mirar: async (api) => {
        if (api.flag('ruben_libre')) await api.say(['Libro de visitas de Sistemas: «Brais. Entrada: julio. Salida: hoy».', 'La salida, con letra de Eutimio. Apretando mucho.']);
        else await api.say('Libro de visitas de Sistemas: «Brais. Entrada: julio. Salida: —».');
      },
      usar: 'Firmo: «Bruno. Entrada: 2020. Salida: —».',
      coger: 'Si me lo llevo, Eutimio no sabe quién ha venido. Que es nadie, pero apuntado.',
      abrir: 'Ya está abierto. Por la misma página.',
      cerrar: 'Si lo cierro, Brais no sale ni en el libro. Lo dejo abierto.',
    } },
    { id: 'contador_tickets', name: 'contador de tickets', handlers: {
      mirar: async (api) => { await api.say(`TICKETS ABIERTOS: ${miles(api.flag('paco_tickets'))}. Sube cada vez que respiro. Lo he comprobado.`); },
      usar: 'No tiene botones. Sube uno cada vez que entro. Soy una incidencia.',
      empujar: async (api) => { api.inc('paco_tickets'); api.sfx('beep'); await api.say('Lo empujo. Sube uno. Me lo apunta a mí.'); },
      hablar: 'Le pido que baje. Sube. Es su forma de decir que no.',
      coger: 'Ocho tornillos para un contador. A mí me sujetan con un convenio.',
    } },
    { id: 'registro_tickets', name: 'registro de tickets', handlers: {
      mirar: async (api) => {
        // [P14] la primera línea: dos numeraciones (el registro, desde julio; el contador, la suya)
        await api.say(['Este registro lo empezó Eutimio en julio. El contador lleva la otra numeración.', api.flag('ruben_libre') ? 'Ticket nº 1, julio: «Alta becario Brais». Estado: cerrado. Por fin.'
          : 'Ticket nº 1, julio: «Alta becario Brais». Estado: pendiente.',
        'Nº 2, hoy: «Alta portátil de Infografía». Denegado.', 'Motivo: «No ha pasado por Desarrollo». Firmado: Anselmo.',
        'Nº 3: «El CMS se cuelga con la pantalla de la Redacción».', '«Va a la regleta R-3 de Sistemas. Apagarla». Estado: no prioritario.']);
        api.setFlag('vio_ticket_3', true);
        if (api.flag('herminia_de_alta')) await api.say('Y al final, de hoy: «Alta becaria Herminia». Cuarenta segundos.');
      },
      abrir: async (api) => { await api.say('Lo abro por donde siempre: por el principio. Nadie llega al final.'); },
      coger: 'Pesa más que la paciencia de Eutimio. No me lo llevo.',
      hablar: 'Le leo en voz alta el número 3. Eutimio suspira desde su silla.',
    } },
    { id: 'cementerio_ratones', name: 'caja de ratones', handlers: {
      mirar: 'Caja de ratones de bola. Eutimio no los tira. Dice que aún ruedan por dentro.',
      coger: 'Si me llevo uno, Eutimio lo apunta. Y lo tacha cuando ruede.',
      usar: 'Muevo una bola. Rueda por dentro. Eutimio tenía razón.',
      hablar: 'Les doy el pésame. Uno rueda. Lo tomo como un sí.',
      empujar: 'La caja no se mueve. Pesa como treinta jefes de Sistemas.',
    } },
    // [P14] la máquina de la planta −1 de la llamada de los atunes (decorado)
    { id: 'maquina_bocadillos', name: 'máquina de bocadillos', handlers: {
      mirar: 'Una máquina de bocadillos. Solo le queda la fila del atún. Vacía.',
    } },
    { id: 'carro_kvm', name: 'carro de consola', hotspot: false },              // decorado del arte: mueble exento del plano medio
    { id: 'rejilla_cpd', name: 'rejilla', handlers: {
      mirar: say('Una rejilla del falso suelo. Por aquí suben las voces del edificio.', 'Eutimio lo sabe todo. No es intuición: es fontanería.'),
      usar: usarRejilla,
      abrir: paco('Ahí abajo hay cables viejos. Y un bocadillo de 2003.'),
      hablar: 'Hablo por la rejilla: «¿Hola?». Arriba alguien contesta: «Se toma nota».',
      coger: 'Está atornillada. Si me la llevo, el edificio se queda sin oídos.',
      empujar: 'La piso. Suena a planta 2. Me aparto, por si me oyen.',
    } },
  ],

  actors: [
    { id: P,
      murmurs: ['48.213... 48.214... Esto no para.', 'No, mamá, el wifi no se ha caído. Has dejado de merecerlo.',
        'Los tickets nunca se van a casa. Y yo...',              // §8.7 · E5 C76
        'Me abrió un ticket con márgenes. Lo tengo enmarcado.'],                          // adenda 4.6b
      handlers: {
        mirar: 'Eutimio Ticket. No le da la luz natural desde que había fax en cada mesa.',
        hablar: async (api) => { await api.dialog('paco'); },
        'dar:cafe': paco('Café sin ticket. Estado: rumor. Olor: confirmado.'),
        'dar:manual_fax': paco('Ese manual ya es tuyo. Las devoluciones van por ticket. Estado: en cola.'),
        'dar:ticket_n1': paco('Quédatelo. Yo ya tengo el recuerdo.'),
        'dar:tarjeta_becario': paco('«Pellizco». Te abro un ticket: «Nombre mal escrito». Ponte a la cola.'),
        'dar:album_eventos': paco('Fotos de eventos. Yo no salgo en ninguna. Lo tengo por ticket.'),
        'dar:taper_huerfano': paco('Ticket abierto: «objeto huérfano». Estado: tuyo.'),
        'dar:*': paco('¿Viene con número de ticket? Pues no lo veo.'),
        empujar: 'Eutimio ni se gira. Escribe algo. Creo que ya consto.',
        tirar: 'Le tiro del forro polar. Me mira como a una impresora sin driver.',
        coger: 'Eutimio no se mueve de Sistemas. Es infraestructura. Tiene número de inventario.',
      } },
    { id: R, when: ['ruben_encontrado', '!ruben_libre'], handlers: {
      mirar: 'Brais, alias Titulator 3000. Sudadera, ojeras y migas de bocadillo de máquina.',
      hablar: async (api) => { await api.dialog('ruben'); },
      'dar:taper_huerfano': darTaper,
      'dar:cafe': rub('¿Café? Gracias. Pero lo que necesito es un táper.'),
      'dar:album_eventos': rub('Ahí salgo. Al fondo. Siempre al fondo. Es mi encuadre.'),
      'dar:*': async (api) => { await api.titular('¿ES COMIDA?', { who: R }); await api.sayAs(R, '...No. Pues gracias igual.'); },
      empujar: 'No. Bastante empujado está. Lleva cuatro meses en un armario.',
      tirar: 'No puedo sacarlo a tirones. Su baja es un pósit. Y el pósit es de Anselmo.',
    } },
  ],

  dialogs: { paco: pacoDialog, ruben: rubenDialog },
  duels: {},
  scenes: { revelacion_ruben: revelacionRuben },
  defaults: {},
  ambient: [],

  async onEnter(api) {
    // §3.9: el contador empieza en 48.211 y suma +1 por entrada; +318 la primera vez que se entra tras cms_vivo si el CMS
    // se arregló arriba (camino antiguo del enchufe); con la regleta, los suma la propia escena
    if (!api.flag('paco_tickets')) api.setFlag('paco_tickets', 48211);
    if (!api.restoring) api.inc('paco_tickets');              // cargar partida no es una entrada
    if (api.flag('cms_vivo') && !api.flag('cpd_cms_sumado')) { api.inc('paco_tickets', 318); api.setFlag('cpd_cms_sumado', true); }
    const st = estadoArmario(api);
    if (api.getState('armario_27') !== st) api.setState('armario_27', st);
    // E5 §2.4: en el Acto III, sin Rubén, el papel del 27 sale a chorro (estado `corre`) y Bruno lo dice al entrar
    const sp = api.flag('ruben_encontrado') ? 'recogida' : acto3(api) ? 'corre' : 'asoma';
    if (api.getState('papel_continuo') !== sp) api.setState('papel_continuo', sp);
    REGLETERO.off = 0;
    S.teclea = 0;
    // [P11] el CMS solo vuelve apagando la R-3; una partida vieja que lo arregló por el ticket nº 3 la tiene encendida
    if (api.flag('cms_vivo') && api.getState('regleta_r3') !== 'apagada') api.setState('regleta_r3', 'apagada');
    if (sp === 'corre' && !api.restoring && api.once('cpd_papel_chorro')) {
      api.sfx(TECLEO);
      await api.say('El papel del 27 sale a chorro. El de dentro está muy ocupado.');
    }
  },

  // E5 §2.4: mientras el papel corre, la matricial suena bajito cada pocos segundos
  update(api, dt) {
    if (api.getState('papel_continuo') !== 'corre') return;
    S.teclea += dt;
    if (S.teclea >= 4.5) { S.teclea = 0; api.sfx(TECLEO); }
  },
}, art);
