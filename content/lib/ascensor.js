// EL ASCENSOR CON BOTONERA (común a vestibulo, cpd, pecera y ecosistema).
// Un mismo ascensor une cuatro plantas. Usarlo (Ir a / Usar / Abrir) abre el menú de plantas (api.choose): la planta
// actual sale en gris, hay opción de quedarse. Viaje: puertas, cabina con el indicador contando plantas (hud), una frase
// del ascensor (rota en orden, `ascensor_viajes_n`) y llegada por la entrada `ascensor` de la sala de destino, que corre
// su onEnter y los avisos comunes igual que por la ruta de siempre (escena 7.2 en la Pecera, ticket del CPD...; el ¡FLASH! de Eventos es de su sala, `eventos`, junto al Ecosistema).
//
// BLOQUEOS: cada planta obedece exactamente la misma condición que la ruta antigua a esa sala:
//   -1 cpd        torno_abierto (antes: ascensor del vestíbulo, «al otro lado del torno»)
//    0 vestibulo  siempre (desde la Pecera y la escalera nunca hubo bloqueo de vuelta)
//    1 pecera     torno_abierto (antes: el torno)
//    2 ecosistema torno_abierto (antes: escalera de la Pecera, sin bloqueo propio, detrás del torno)
// Si no se cumple, el botón contesta con una negativa (rota, `ascensor_negativas_n`) y no se viaja.
//
// Cada sala con ascensor tiene un objeto con `ascensor: { planta, label }` (lo leen los tests y tools/check.mjs para el
// grafo de salidas) y la entrada `ascensor` en su arte. Los objetos se crean con `ascensorObjeto(id, handlers)`.
import { narrarHito } from './celestino.js';
import { rect, hline, vline, frameRect, gradV, paint, ditherPick, glow, PAL } from '../../engine/draw.js';
import { drawText } from '../../engine/font.js';

export const ASCENSOR_COLOR = '#9FD8FF';

export const PLANTAS = [
  { n: 2, room: 'ecosistema', obj: 'ascensor_ecosistema', label: 'Planta 2 · Marketing · Eventos · Comercial · Administración' },
  { n: 1, room: 'pecera', obj: 'ascensor_pecera', label: 'Planta 1 · Redacción · Despachos · Vending' },
  { n: 0, room: 'vestibulo', obj: 'ascensor_vestibulo', label: 'Planta 0 · Vestíbulo' },
  { n: -1, room: 'cpd', obj: 'ascensor_cpd', label: 'Planta -1 · Sistemas' },
];
export const QUEDARSE = 'Nada, me quedo en esta planta.';

/** La misma condición que la ruta antigua a cada sala (ver cabecera). */
export function plantaPermitida(api, room) {
  if (room === 'vestibulo') return true;
  return !!api.flag('torno_abierto');
}

// frases del ascensor durante el viaje (rotan en orden)
export const FRASES = [
  'Su planta ha quedado registrada con el ticket 48.216. Paco le atenderá.',
  'Este ascensor tiene espejo. Para que el becario se vea subir, aunque sea aquí.',
  'Le recordamos que lo que se dice en el ascensor no sale. Ni el wifi.',
  'Hilo musical: el Ibex en diferido. Narra Celestino, desde el mostrador.',
  'Capacidad: ocho personas o una reunión que pudo ser un correo.',
  'Prohibido hablar de plazas de garaje. La rejilla del sótano lo oye todo.',
  'RV de Tadeo: «La IA dice que subir es lo contrario de bajar. Por si os sirve!!».',
  'Este ascensor no consta en el organigrama. Funciona igual. O por eso.',
  'Optimal Brains propone sustituirme por una escalera. Más escalable.',
  'Si al abrir oye un gong, alguien ha vendido algo. No se asuste.',
];
// negativas de los botones bloqueados (solo con el torno cerrado)
export const NEGATIVAS = {
  cpd: 'Planta -1: solo personal de Sistemas. Abra un ticket desde el torno.',
  pecera: 'Planta 1: usuario no consta en organigrama. Pruebe a constar.',
  ecosistema: 'Planta 2: se requiere acreditación. Pilar tiene seis. Usted, ninguna.',
};

/** Cabina vista por dentro mientras el ascensor viaja: puertas de acero cerradas e indicador que cuenta plantas. */
function cabina(from, to, t0, game) {
  return (g) => {
    const t = Math.min(1, (game.time - t0) / 900);
    const n = Math.round(from + (to - from) * t);
    rect(g, 0, 0, 320, 144, PAL.ink[0]);
    paint(g, 96, 18, 128, 118, (x, y) => ditherPick(x, y, [PAL.metal[2], PAL.metal[3], PAL.metal[4], PAL.metal[3]], 0.2 + Math.abs(((x - 96) % 64) - 32) / 64 + ((x * 7 + (y >> 2) * 13) % 11 === 0 ? 0.15 : 0)));
    vline(g, 159, 18, 118, PAL.ink[0]); vline(g, 160, 18, 118, PAL.metal[6]);
    frameRect(g, 95, 17, 130, 120, PAL.ink[1]);
    hline(g, 96, 18, 128, PAL.metal[6]);
    rect(g, 140, 4, 40, 11, PAL.ink[1]); frameRect(g, 140, 4, 40, 11, PAL.metal[4]);
    const s = String(n);
    drawText(g, s, 164, 5, '#ff5a3a', { align: 'center', outline: null });
    const up = to > from, ax = 148;
    for (let k = 0; k < 4; k++) hline(g, ax - k, up ? 7 + k : 12 - k, 1 + k * 2, '#ff5a3a');
    glow(g, 160, 9, 22, 7, '#ff5a3a', 0.25, 3);
    // botonera a la derecha
    rect(g, 232, 50, 14, 52, PAL.metal[3]); frameRect(g, 232, 50, 14, 52, PAL.metal[1]);
    [2, 1, 0, -1].forEach((k, i) => {
      const lit = k === to;
      rect(g, 236, 54 + i * 12, 6, 6, lit ? '#ffcc66' : PAL.metal[5]);
      if (lit) glow(g, 239, 57 + i * 12, 6, 6, '#ffcc66', 0.4, 2);
      drawText(g, String(k), 249, 54 + i * 12, PAL.paper[6], { outline: null });
    });
    gradV(g, 96, 128, 128, 8, [PAL.metal[1], PAL.ink[0]]);
  };
}

/** El ascensor: menú de plantas, bloqueo y viaje. `api.room` es la planta de salida. */
export async function usarAscensor(api) {
  const aqui = PLANTAS.find(p => p.room === api.room);
  const opts = PLANTAS.map(p => (p.room === api.room ? { text: p.label + ' (aquí)', disabled: true } : p.label));
  opts.push(QUEDARSE);
  api.sfx('beep');
  const i = await api.choose(opts);
  if (i == null || i < 0 || i >= PLANTAS.length) return false;
  const dest = PLANTAS[i];
  if (dest.room === api.room) return false;
  if (!plantaPermitida(api, dest.room)) {
    api.sfx('error');
    api.inc('ascensor_negativas_n');
    await api.sayFrom(aqui ? aqui.obj : dest.obj, NEGATIVAS[dest.room] || 'Planta no disponible.', { color: ASCENSOR_COLOR });
    return false;
  }
  const n = api.inc('ascensor_viajes_n');
  const game = api.game;
  api.sfx('doorClose');
  await api.fadeOut(260);
  game.hud = cabina(aqui ? aqui.n : 0, dest.n, game.time, game);
  try {
    api.sfx('machine');
    // plan §4.7: si Bruno tiene una hazaña sin narrar, Celestino la retransmite por la megafonía de la cabina
    if (!(await narrarHito(api, { via: 'megafonia' }))) await api.narrate(FRASES[(n - 1) % FRASES.length], { color: ASCENSOR_COLOR });
    await api.wait(250);
    api.sfx('beep');
  } finally { game.hud = null; }
  api.sfx('open');
  await api.goto(dest.room, 'ascensor');
  return true;
}

/** Objeto «ascensor» de una sala: Ir a / Usar / Abrir abren la botonera. `extra` = Mirar y demás textos de la sala;
 *  `bloqueo(api)` opcional devuelve true si ya ha contestado él (p. ej. el ascensor del vestíbulo, detrás del torno). */
export function ascensorObjeto(id, extra = {}, bloqueo = null) {
  const planta = PLANTAS.find(p => p.obj === id);
  const go = async (api) => { if (bloqueo && await bloqueo(api)) return; await usarAscensor(api); };
  return {
    id, name: 'ascensor', defaultVerb: 'ir', color: ASCENSOR_COLOR,
    ascensor: { planta: planta ? planta.n : 0, label: planta ? planta.label : '' },
    handlers: { ir: go, usar: go, abrir: go, ...extra },
  };
}
