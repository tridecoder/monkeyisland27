// SALA DE DEMOSTRACIÓN del kit y del motor del rediseño (NO está en el juego: la registran en caliente
// tools/test-motor.mjs y tools/demo.mjs). Sirve también de EJEMPLO para los artistas: núcleo, zonas con suelo/filete/
// pilastra/rótulo colgado, placas, umbral y marco de puerta, mesa exenta con walkbox en U y z-orden, PNJ sentado y
// «tras la mesa», penumbra con foco y actor exento, zona con escala propia, objeto pequeño (margen de toque) y un
// plano detalle. Coordenadas como en cualquier content/rooms/art/<sala>.art.js.
import { buildRoom } from '../content/lib/room.js';
import * as kit from '../content/lib/kit.js';
import { PAL, rect, hline, gradV, wall, shadowEllipse, ditherOverlay, label } from '../engine/draw.js';

const W = 400, FL = 92;
const MESA = { x: 196, y: 84, w: 104, h: 14 };        // tablero (la mesa exenta del plano medio)

function drawSala(g) {
  // techo y paredes por zona
  gradV(g, 0, 0, W, 16, [PAL.ink[1], PAL.metal[1], PAL.metal[2]]);
  wall(g, 96, 16, 304, FL - 16, [PAL.teal[2], PAL.teal[3], PAL.teal[4], PAL.teal[5]], { seed: 3 });
  rect(g, 250, 16, 150, FL - 16, '#3e3656');
  // el NÚCLEO (izquierda, como en la Pecera): escalera que sube/baja + ascensor + placas + umbrales
  kit.nucleo(g, 'pecera', FL, { width: W });
  // suelos de zona (con canto de goma), filetes de departamento y pilastra en el cambio de zona
  kit.zonaSuelo(g, 96, 250, FL, 'web', { vpx: 200, vpy: 24, borde: true });
  kit.zonaSuelo(g, 250, W, FL, 'desarrollo', { vpx: 200, vpy: 24, borde: true });
  kit.filete(g, 96, 250, 66, 'web');
  kit.filete(g, 250, W, 66, 'desarrollo');
  kit.pilastra(g, 247, 16, FL);
  // rótulos de zona colgados del techo, centrados sobre su zona
  kit.rotuloZona(g, 205, 20, 'web', { colgado: 4 });
  kit.rotuloZona(g, 325, 20, 'desarrollo', { colgado: 4 });
  // puerta interior con marco común, placa de destino (nombre llano: «DIRECCIÓN», nunca «Pajarera») y umbral
  kit.marcoPuerta(g, 112, 36, 30, FL - 36);
  kit.huecoAbierto(g, 112, 36, 30, FL - 36, { luz: PAL.gold[5] });
  kit.placaSala(g, 104, 20, 'pajarera');
  kit.umbral(g, 110, FL + 1, 34, 5, kit.DEPTO.direccion.c);
  // un cartel con texto ajustado a su soporte (fuente del juego si cabe; si no, 3×5)
  rect(g, 352, 40, 40, 20, PAL.paper[6]);
  kit.texto(g, 'SOLO CÓDIGO', 352, 40, 40, 20, { color: PAL.red[3] });
  kit.mampara(g, 360, 120, 34, 18, '#6a6a80', { texto: 'SISTEMAS' });
}
function drawMesa(g) {
  const { x, y, w, h } = MESA;
  shadowEllipse(g, x + w / 2, y + h + 4, w / 2 + 4, 3, 0.7);
  rect(g, x, y, w, h, PAL.wood[4]); hline(g, x, y, w, PAL.wood[6]); hline(g, x, y + h - 1, w, PAL.wood[2]);
  rect(g, x + 2, y + h, 4, 8, PAL.wood[2]); rect(g, x + w - 6, y + h, 4, 8, PAL.wood[2]);
  ditherOverlay(g, x + 10, y + 2, 40, 2, '#fff4c8', 0.3);
}
function drawTaza(g) {          // objeto PEQUEÑO a propósito (6×6): el motor le da margen de toque (12×10 / 16×12)
  rect(g, 212, 52, 6, 6, PAL.paper[7]); rect(g, 218, 54, 1, 2, PAL.paper[7]); hline(g, 212, 52, 6, '#fff2c0');
}
function drawExpositor(g) {     // interactivo con canto vivo
  rect(g, 160, 60, 20, 30, PAL.red[3]); label(g, 'A', 166, 66, PAL.paper[7]);
  kit.cantoVivo(g, 160, 60, 20, 30);
}

export const art = {
  room: 'demo_rediseno',
  width: W,
  rediseno: true,
  scale: { yFar: 100, far: 0.88, yNear: 142, near: 1.02 },
  // walkbox en U alrededor de la mesa (la mesa queda en la muesca: se puede estar delante, a los lados y, por la franja
  // de atrás, DETRÁS de ella) + una zona con escala propia. La unión de varios polígonos es el suelo.
  walkboxes: [
    { id: 'suelo', poly: [[50, 100], [190, 100], [190, 114], [306, 114], [306, 100], [396, 100], [398, 142], [2, 142], [2, 118], [50, 118]] },
    { id: 'tras_mesa', poly: [[186, 99], [310, 99], [310, 104], [186, 104]] },
    { id: 'tarima', poly: [[150, 128], [190, 128], [190, 142], [150, 142]], scale: 1.12 },
  ],
  entries: { pecera: [40, 124, 'right'], ascensor: [69, 108, 'down'] },
  layout: {
    ascensor_demo: { rect: [50, 26, 42, 66], walkTo: [69, 106], face: 'up' },
    puerta_demo: { rect: [110, 34, 34, 58], walkTo: [127, 106], face: 'up' },
    mesa_demo: { rect: [MESA.x, MESA.y, MESA.w, MESA.h], walkTo: [248, 122], face: 'up', layer: 'sorted', zy: MESA.y + MESA.h + 4, prop: true, draw: drawMesa },
    taza_demo: { rect: [212, 52, 6, 6], walkTo: [215, 118], face: 'up', draw: drawTaza },
    expositor_demo: { rect: [160, 60, 20, 30], walkTo: [170, 108], face: 'up', draw: drawExpositor },
    // PNJ: uno sentado de cara (en una silla que pinta la sala), otro «tras la mesa» (la mesa le tapa de cintura abajo)
    paco_ticket: { at: [330, 120, 'down'], pose: 'sentado', walkTo: [300, 126], face: 'right' },
    celestino: { at: [248, 101, 'down'], pose: 'tras_mesa', walkTo: [222, 110], face: 'right' },
    lector_medio: { at: [370, 110, 'down'], luz: 1 },
  },
  draw: drawSala,
  // penumbra con un foco sobre el expositor; el Lector Medio exento (luz: 1), los demás a ×0,22
  penumbra(view) {
    if (!view.flag('demo_penumbra')) return null;
    return { color: '#080c24', alpha: 0.6, spots: [[170, 74, 24, 30]] };
  },
};

export const logic = {
  id: 'demo_rediseno',
  name: 'Demo del rediseño',
  music: null,
  flags: { demo_penumbra: 'bool · demo · penumbra encendida' },
  objects: [
    { id: 'ascensor_demo', name: 'ascensor', desc: 'Ascensor del núcleo.' },
    { id: 'puerta_demo', name: 'puerta de Dirección', exit: { room: 'pecera' } },
    { id: 'mesa_demo', name: 'mesa', desc: 'Una mesa exenta.' },
    { id: 'taza_demo', name: 'taza', desc: 'Una taza diminuta.' },
    { id: 'expositor_demo', name: 'expositor', desc: 'Interactivo: canto vivo.' },
  ],
  actors: [
    { id: 'paco_ticket', handlers: { hablar: 'Hola.' } },
    { id: 'celestino', handlers: { hablar: 'Buenas.' } },
    { id: 'lector_medio' },
  ],
};

export default buildRoom(logic, art);
