// PLANTILLA DE ARTE Y GEOMETRÍA DE SALA (pareja de content/rooms/_plantilla.js; no registrada).
// Las 9 salas ya tienen su archivo de arte stub: edita content/rooms/art/<id>.art.js directamente.
// Referencia: docs/ART_GUIDE.md («Guía para artistas de fondo»). Vista previa: node tools/shot.mjs <id> --debug
import { PAL, rect, gradV, wall, wainscot, baseboard, floorTiles, glow, vignette, door, filingCabinet, shadowEllipse } from '../../../engine/draw.js';

const W = 320;

const layout = {
  // OBJETOS: rect [x, y, w, h] o poly [[x,y],...]; walkTo [x, y] y face: dónde se coloca Bruno y hacia dónde mira.
  // Opcional: priority (solapes), walk:false, layer ('back' | 'sorted' | 'front'), zy, cache, y el dibujo:
  //   draw(g, view, t)              → dibujo propio cada frame (view.state, view.flag('x') de solo lectura)
  //   sprites: { <estado>: fn, default: fn }   → un dibujo por estado del objeto (estados en la lógica: `states`)
  cajon: {
    rect: [200, 70, 30, 28], walkTo: [214, 112], face: 'up', cache: true,
    sprites: {
      cerrado: (g) => filingCabinet(g, 200, 70, 30, 28, { drawers: 2 }),
      abierto: (g) => filingCabinet(g, 200, 70, 30, 28, { drawers: 2, open: 0 }),
    },
  },
  papel: { rect: [150, 92, 14, 6], walkTo: [156, 114], face: 'up', priority: 1, draw: (g) => rect(g, 150, 92, 14, 6, PAL.paper[6]) },
  plantilla_a_vestibulo: { rect: [10, 30, 36, 68], walkTo: [30, 112], face: 'left' },
  // PNJ: at = [x, y (pies), dir]; walkTo/face para hablarle; positions = sitios con nombre (la lógica elige con `pos`)
  gervasio_acta: { at: [120, 110, 'right'], positions: { mesa: { at: [120, 110, 'right'] }, rincon: { at: [290, 112, 'left'] } } },
};

export default {
  room: 'plantilla',
  width: W,                                          // > 320 = scroll horizontal
  scale: { yFar: 100, far: 0.86, yNear: 142, near: 1.0 },
  walkboxes: [{ id: 'suelo', poly: [[6, 104], [W - 6, 104], [W - 2, 142], [2, 142]] }],
  entries: {                                         // se llaman como la sala de la que se viene
    vestibulo: [30, 118, 'right'],
  },
  layout,
  draw(g) {                                          // fondo estático: se pinta UNA vez (cacheado)
    gradV(g, 0, 0, W, 16, [PAL.ink[1], PAL.metal[2]]);
    wall(g, 0, 16, W, 56, PAL.green.slice(2, 6));
    wainscot(g, 0, 72, W, 24);
    baseboard(g, 0, 96, W, 4);
    floorTiles(g, { x: 0, y: 100, w: W, h: 44, vpx: W / 2, vpy: 20 });
    door(g, 10, 30, 36, 68, { sign: 'SALIDA' });
    shadowEllipse(g, 215, 99, 18, 3);
    glow(g, 160, 30, 90, 30, PAL.light, 0.15);
    vignette(g, W, 144, 0.5);
  },
  // dynamic: true,                                   // repintar draw() tras cada setFlag (si el fondo depende de flags)
  // animate(g, view, t) {},                          // cada frame, detrás de los actores
  // foreground(g, view, t) {},                       // una vez, delante de los actores (columnas, plantas)
  // overlay(g, view, t) {},                          // cada frame, delante de todo (lluvia, luz)
};
