// SALA DE DEMOSTRACIÓN DE LOS SISTEMAS COMUNES DEL PLAN DE COMEDIA (paquete P0). NO está en el juego: la registra en
// caliente tools/test-fase0.mjs. Sirve de EJEMPLO para los autores de sala (docs/guion2-impl/GUIA_AUTORES.md):
//   · ambiente con solo líneas (`ambient: [{ id, discusiones, voces }]`) y reglas propias (`ambientRules`)
//   · duelo con el cuerpo visible, CC que crece, `hurtByPair` con otro actor, `onHit`, `defeatLine`, escena de derrota
//     (`defeatScene`) y titular de derrota (`defeatHeadline`)
//   · apagón, estampida con atasco, megafonía, ráfaga viral, titular y la tarjeta final (escenas `demo_*`)
//   · dos salidas (doble clic = salir ya) y suelo ancho (doble clic = correr; mantener pulsado = seguir al puntero)
//   ENMIENDA E2 (paquete común):
//   · despedida que solo se oye la primera vez (árbol `demo_desp`: «Me voy.» con `reply` y un `do` con efectos)
//   · anuncios con `api.detalle`: el pop-up de la X que mengua (`cerrarX` 3 → 1 → sin X + `cuenta`) y el «anuncio
//     antes de entrar» con cuenta atrás que no se cierra con un clic (`cuenta` + `ms`)  → escenas demo_popup, demo_anuncio
//   · la pantalla de un objeto con prefijo registrado: api.pantalla('herminia_portatil', …) → «HERMINIA (IA) › …»
//   · Bruno con el adhesivo «SU ANUNCIO AQUÍ» (flag `bruno_con_banner`; con la chaqueta, `con_chaqueta_banner`)
import { buildRoom } from '../content/lib/room.js';
import { PAL, rect, hline, gradV, wall, frameRect } from '../engine/draw.js';
import { drawText } from '../engine/font.js';

/** Dibujo de ejemplo de un anuncio (el de verdad, `popupComercial`/`interstitialComercial`, es de P4): la X y la cuenta
 *  atrás las pinta el motor encima (`cerrarX`, `cuenta`). */
function anuncioDemo(g, r) {
  rect(g, r.x, r.y, r.w, r.h, '#fbfaf2'); frameRect(g, r.x, r.y, r.w, r.h, '#c8c0b0');
  drawText(g, '¿Le interesa anunciarse', r.x + r.w / 2, r.y + 8, '#2a2430', { align: 'center', outline: null });
  drawText(g, 'en esta conversación?', r.x + r.w / 2, r.y + 18, '#2a2430', { align: 'center', outline: null });
  rect(g, r.x + r.w / 2 - 24, r.y + 32, 48, 16, '#ff7a20'); frameRect(g, r.x + r.w / 2 - 24, r.y + 32, 48, 16, '#b04a10');
  drawText(g, '¡SÍ!', r.x + r.w / 2, r.y + 36, '#ffffff', { align: 'center', outline: null });
}
function interstitialDemo(g, r) {
  rect(g, r.x, r.y, r.w, r.h, '#1c2a48');
  for (let y = r.y + 4; y < r.y + r.h; y += 9) hline(g, r.x, y, r.w, '#22345a');
  drawText(g, 'COLCHONES SIESTATÓN', r.x + r.w / 2, r.y + 20, '#ffffff', { align: 'center', outline: null });
  drawText(g, 'DUERMA YA', r.x + r.w / 2, r.y + 34, '#9FD0FF', { align: 'center', outline: null });
}

const W = 640, FL = 92;
function drawSala(g) {
  gradV(g, 0, 0, W, 16, [PAL.ink[1], PAL.metal[1], PAL.metal[2]]);
  wall(g, 0, 16, W, FL - 16, [PAL.teal[2], PAL.teal[3], PAL.teal[4], PAL.teal[5]], { seed: 5 });
  for (let x = 0; x < W; x += 2) rect(g, x, FL, 2, 52, (x >> 4) % 2 ? PAL.wood[3] : PAL.wood[4]);
  hline(g, 0, FL, W, PAL.wood[1]);
  // dos puertas: izquierda (a la Redacción) y derecha (al fondo de la sala)
  rect(g, 20, 34, 30, FL - 34, PAL.ink[1]); rect(g, 22, 36, 26, FL - 36, PAL.gold[3]);
  rect(g, 590, 34, 30, FL - 34, PAL.ink[1]); rect(g, 592, 36, 26, FL - 36, PAL.gold[3]);
  // una pantalla que sigue encendida durante el apagón (foco)
  rect(g, 300, 30, 40, 26, PAL.ink[0]); rect(g, 302, 32, 36, 22, '#3a8ad0');
}

export const art = {
  room: 'demo_fase0',
  width: W,
  walkboxes: [{ id: 'suelo', poly: [[4, 100], [636, 100], [636, 142], [4, 142]] }],
  entries: { pecera: [70, 124, 'right'], fondo: [570, 124, 'left'] },
  layout: {
    puerta_izq: { rect: [20, 34, 30, 58], walkTo: [35, 110], face: 'up' },
    puerta_der: { rect: [590, 34, 30, 58], walkTo: [605, 110], face: 'up' },
    pantalla_demo: { rect: [300, 30, 40, 26], walkTo: [320, 112], face: 'up' },
    herminia_portatil: { rect: [140, 66, 20, 12], walkTo: [150, 116], face: 'up' },
    paco_ticket: { at: [400, 120, 'left'] },
    celestino: { at: [460, 122, 'left'] },
    gervasio_acta: { at: [200, 118, 'right'] },
    yoli_tendencias: { at: [240, 126, 'right'] },
    anselmo_monolito: { at: [280, 120, 'right'] },
  },
  draw: drawSala,
};

const R1 = 'pantalla_demo';
export const logic = {
  id: 'demo_fase0',
  name: 'Demo del paquete común',
  music: null,
  flags: { demo_fase0_hit: 'str · demo · última pareja acertada (onHit)', demo_fase0_derrota: 'int · demo · escena de derrota vista',
    demo_fase0_despedidas: 'int · demo · veces que se ha elegido «Me voy.» (el `do` corre aunque la despedida se calle)',
    demo_fase0_popup_n: 'int · demo · pop-ups vistos (la X mengua: 3 px, 1 px, sin X + cuenta atrás)' },
  objects: [
    { id: 'puerta_izq', name: 'puerta de la Redacción', exit: { room: 'pecera', entry: 'ascensor' } },
    { id: 'puerta_der', name: 'puerta del fondo', exit: { room: 'demo_fase0', entry: 'pecera' } },
    { id: R1, name: 'pantalla', desc: 'Una pantalla que no se apaga nunca.' },
    { id: 'herminia_portatil', name: 'Herminia, la IA de Infografía', desc: 'Un portátil de demostración.' },
  ],
  actors: [
    { id: 'paco_ticket', handlers: { hablar: async (api) => { await api.duel('demo'); } } },
    { id: 'celestino', handlers: { hablar: async (api) => { await api.dialog('demo_desp'); } } },
    { id: 'gervasio_acta' }, { id: 'yoli_tendencias' }, { id: 'anselmo_monolito' },
  ],
  // E2 §7.2: la despedida («Me voy.», exit) se oye la primera vez; las siguientes cierran en silencio, pero su `do` se
  // ejecuta igual (aquí: suma el contador y suena el beep; su línea, callada).
  dialogs: {
    demo_desp: { actor: 'celestino', start: 'D0', nodes: { D0: { options: [
      { text: '¿Qué tal el Ibex?', reply: 'Plano, chaval.' },
      { text: 'Me voy.', exit: true, reply: 'Abrígate, que refresca.',
        do: async (api) => { api.inc('demo_fase0_despedidas'); api.sfx('beep'); await api.sayAs('celestino', '¡Y cierra al salir!'); } },
    ] } } },
  },
  // AMBIENTE: solo líneas. El motor decide cuándo (nunca encima de otro globo, menú, aviso, móvil o plano detalle).
  ambientRules: { every: [2500, 3500], first: [1200, 1600], max: 3 },
  ambient: [
    { id: 'coro_demo', voces: { D1: 'paco_ticket', D2: { from: 'celestino', prefijo: 'D2: ' } }, discusiones: [
      [['D1', 'Internet está mal hecho.'], ['D2', 'Desde el principio.']],
      [['D1', 'Ha llovido y ha bajado el tráfico.'], ['D2', '¡Abrid una incidencia a la lluvia!']],
      [['D1', '¿Quién ha puesto este margen?'], ['D2', 'No se lo digas.']],
      [['D1', 'Esta no sale: es la cuarta.']],
    ] },
  ],
  duels: {
    demo: {
      actor: 'paco_ticket', from: 'Paco Ticket', subject: 'Demo del duelo (no es del guion)', assigned: 'B. Pellizco',
      deck: ['R05', 'R03', 'R13'], winScore: 3, maxMisses: 3, cc1: 'Sistemas',
      attackText: { R05: 'Esto, entre tú y yo. Que no salga de la rejilla.' },
      intro: ['Te abro un ticket por escrito.'], hurt: ['Estado: tocado.'], taunt: ['Estado: no procede.'],
      hurtByPair: { R13: [['paco_ticket', 'Eso lo escribió alguien brillante.'], ['celestino', 'Yo. Perdón.']] },
      onHit: async (api, duel, par) => { api.setFlag('demo_fase0_hit', par); },
      defeatLine: 'RESPUESTA AUTOMÁTICA DE SISTEMAS: «Su ticket es importante para nosotros.»',
      defeatLines: ['Asignado a ti. Estado: becario.'],
      defeatScene: 'demo_derrota',
      defeatHeadline: (n) => (n > 1 ? `UN BECARIO PIERDE ${n} VECES CONTRA UN TICKET` : 'UN BECARIO PIERDE CONTRA UN TICKET. EL TICKET, ABIERTO'),
    },
  },
  scenes: {
    // escena de derrota (≤ 6 líneas, < 15 s): recibe { duel, perdidos, ctl }
    demo_derrota: async (api, info) => {
      api.inc('demo_fase0_derrota');
      await api.sayAs('paco_ticket', info.perdidos > 1 ? 'Otra vez. Ticket duplicado.' : 'Ticket 48.213. Para ti.');
      await api.say('Me han abierto un ticket. Es lo más parecido a un contrato.');
    },
    demo_apagon: async (api) => { await api.apagon({ ms: 1600, spots: [[320, 43, 30, 20]] }); },
    demo_estampida: async (api) => {
      await api.estampida(['gervasio_acta', 'yoli_tendencias', 'anselmo_monolito'], { puerta: [35, 112], atascoMs: 700,
        enAtasco: async (api) => { await api.sayAs('gervasio_acta', '¡Usted primero!'); } });
    },
    demo_megafonia: async (api) => { await api.megafonia('celestino', '¡Vacante encara la planta 2! ¡Atención, que va!', { blocking: true }); },
    demo_viral: async (api) => { await api.viral({ avisos: ['Gertrudis: BUENAS NOCHES, PAÍS', 'abrígate comentó tu vídeo', '+300 compartidos'], contador: [3418, 11302], etiqueta: 'en directo', ms: 2600 }); },
    demo_titular: async (api) => { await api.titular('UN BECARIO VIVE EN UN ARMARIO. EL 4 TE SORPRENDERÁ'); },
    // E2 §4.2.1: el pop-up de la X menguante (como el de Maripaz: 1.ª 3 px, 2.ª 1 px, 3.ª sin X y «Podrá cerrar en 3»)
    demo_popup: async (api) => {
      const n = api.inc('demo_fase0_popup_n');
      const opts = { titulo: 'PUBLICIDAD', w: 150, h: 60, draw: anuncioDemo };
      if (n === 1) await api.detalle({ ...opts, cerrarX: 3 }, async (api) => {
        await api.say('¿Dónde se cierra esto?'); await api.sayAs('celestino', 'En la X, chaval.');
      });
      else if (n === 2) await api.detalle({ ...opts, cerrarX: 1 }, async (api) => { await api.say('Ahora la X es un punto.'); });
      else await api.detalle({ ...opts, cerrarX: 0, cuenta: { ms: 3000, texto: 'Podrá cerrar en {n}' } });
    },
    // E2 §4.2.4: el anuncio antes de entrar (a toda la caja; el clic no lo cierra antes de los 5 s)
    demo_anuncio: async (api) => {
      await api.detalle({ titulo: 'ANUNCIO', w: 200, h: 70, draw: interstitialDemo, ms: 6500,
        cuenta: { ms: 5000, texto: 'Podrá continuar en {n}', fin: 'Saltar anuncio ›' } });
    },
    // E2 §2.2: pantalla de objeto con prefijo registrado en game.js `pantallas`
    demo_herminia: async (api) => {
      await api.pantalla('herminia_portatil', ['saludo recibido · hola: 100 %', '› quesito de Desarrollo · suma: 130 %']);
    },
    demo_tarjeta: async (api) => {
      await api.tarjeta({ titulo: 'FE DE ERRATAS', minMs: 6000, lineas: ['En la edición de ayer, donde decía «inteligencia artificial»',
        'debía decir «Rubén».', 'Donde decía «Por Bruno Pellejo»', 'debía decir «Por Bruno Pellejo».', '', 'Lamentamos el acierto.'] });
    },
  },
};

export default buildRoom(logic, art);
