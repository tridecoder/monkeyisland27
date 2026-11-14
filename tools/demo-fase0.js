// SALA DE DEMOSTRACIÓN DE LOS SISTEMAS COMUNES DEL PLAN DE COMEDIA (paquete P0). NO está en el juego: la registra en
// caliente tools/test-fase0.mjs. Sirve de EJEMPLO para los autores de sala (docs/guion2-impl/GUIA_AUTORES.md):
//   · ambiente con solo líneas (`ambient: [{ id, discusiones, voces }]`) y reglas propias (`ambientRules`)
//   · duelo con el cuerpo visible, CC que crece, `hurtByPair` con otro actor, `onHit`, `defeatLine`, escena de derrota
//     (`defeatScene`) y titular de derrota (`defeatHeadline`)
//   · apagón, estampida con atasco, megafonía, ráfaga viral, titular y la tarjeta final (escenas `demo_*`)
//   · dos salidas (doble clic = salir ya) y suelo ancho (doble clic = correr; mantener pulsado = seguir al puntero)
import { buildRoom } from '../content/lib/room.js';
import { PAL, rect, hline, gradV, wall } from '../engine/draw.js';

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
    paco_ticket: { at: [400, 120, 'left'] },
    celestino: { at: [460, 122, 'left'] },
    gervasio_acta: { at: [200, 118, 'right'] },
    yoli_tendencias: { at: [240, 126, 'right'] },
    nerea_backlog: { at: [280, 120, 'right'] },
  },
  draw: drawSala,
};

const R1 = 'pantalla_demo';
export const logic = {
  id: 'demo_fase0',
  name: 'Demo del paquete común',
  music: null,
  flags: { demo_fase0_hit: 'str · demo · última pareja acertada (onHit)', demo_fase0_derrota: 'int · demo · escena de derrota vista' },
  objects: [
    { id: 'puerta_izq', name: 'puerta de la Redacción', exit: { room: 'pecera', entry: 'ascensor' } },
    { id: 'puerta_der', name: 'puerta del fondo', exit: { room: 'demo_fase0', entry: 'pecera' } },
    { id: R1, name: 'pantalla', desc: 'Una pantalla que no se apaga nunca.' },
  ],
  actors: [
    { id: 'paco_ticket', handlers: { hablar: async (api) => { await api.duel('demo'); } } },
    { id: 'celestino' }, { id: 'gervasio_acta' }, { id: 'yoli_tendencias' }, { id: 'nerea_backlog' },
  ],
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
      await api.estampida(['gervasio_acta', 'yoli_tendencias', 'nerea_backlog'], { puerta: [35, 112], atascoMs: 700,
        enAtasco: async (api) => { await api.sayAs('gervasio_acta', '¡Usted primero!'); } });
    },
    demo_megafonia: async (api) => { await api.megafonia('celestino', '¡Vacante encara la planta 2! ¡Atención, que va!', { blocking: true }); },
    demo_viral: async (api) => { await api.viral({ avisos: ['Gertrudis: BUENAS NOCHES, PAÍS', 'abrígate comentó tu vídeo', '+300 compartidos'], contador: [3418, 11302], etiqueta: 'en directo', ms: 2600 }); },
    demo_titular: async (api) => { await api.titular('UN BECARIO VIVE EN UN ARMARIO. EL 4 TE SORPRENDERÁ'); },
    demo_tarjeta: async (api) => {
      await api.tarjeta({ titulo: 'FE DE ERRATAS', minMs: 6000, lineas: ['En la edición de ayer, donde decía «inteligencia artificial»',
        'debía decir «Rubén».', 'Donde decía «Por Bruno Pellejo»', 'debía decir «Por Bruno Pellejo».', '', 'Lamentamos el acierto.'] });
    },
  },
};

export default buildRoom(logic, art);
