// LA SECRETARÍA DE REDACCIÓN (Custodia Precinto, adenda §1.5, §3.5, §4.4): el ventanuco con la persiana a media altura,
// las dos manos (lo único que se le ve), el timbre con la pegatina «NO», el cartel «EL MATERIAL NO SE PIDE. SE MERECE.»
// y la cajonera de archivadores. Orden de dirección 3: vive en la REDACCIÓN (`pecera`), en la bisagra con la Redacción
// de papel; antes estaba en el Office (hoy Vending). El dibujo se escribió en las coordenadas del Office: la Redacción lo
// pinta con un desplazamiento (SECRETARIA_DX) y su layout suma lo mismo a los rects.
import { PAL, rect, hline, vline, frameRect, line, px, poly, ellipse, gradV, gradH, noise, ditherOverlay, ditherPick, glow, shadowEllipse } from '../../../engine/draw.js';
import * as kit from '../../lib/kit.js';

const FL = 94;
export const HATCH = { x: 91, y: 40, w: 36, h: 18 };          // hueco del ventanuco (en coordenadas de origen)
/** rects de los hotspots (coordenadas de origen; súmales el desplazamiento) */
export const SECRETARIA_RECTS = {
  cartel_material: [86, 14, 46, 22], custodia_precinto: [87, 37, 44, 16], timbre_secretaria: [107, 52, 14, 10],
};
/** El cartel, en su sitio de la Redacción (hall rediseñado): A LA DERECHA del ventanuco, a la altura del hueco (encima
 *  va ahora la placa «SECRETARÍA / DE REDACCIÓN»). Coordenadas de origen. */
export const CARTEL_LADO = [135, 42];

/** Marco del ventanuco y el cartel. o.cartel = [x, y] (coordenadas de origen) para colgar el cartel en otro sitio. */
export function hatchFrame(g, o = {}) {
  const { x, y, w, h } = HATCH;
  // cartel «EL MATERIAL NO SE PIDE. SE MERECE.» (no de Gertrudis)
  const [cx, cy] = o.cartel || [86, 14], cw = 46, ch = 21;
  ditherOverlay(g, cx + 2, cy + 2, cw, ch, PAL.ink[0], 0.45);
  rect(g, cx, cy, cw, ch, PAL.paper[6]); frameRect(g, cx, cy, cw, ch, PAL.metal[2]); frameRect(g, cx + 1, cy + 1, cw - 2, ch - 2, PAL.red[3]);
  kit.micro(g, 'EL MATERIAL', cx + (cw >> 1), cy + 3, PAL.ink[1], { align: 'center' });
  kit.micro(g, 'NO SE PIDE.', cx + (cw >> 1), cy + 9, PAL.ink[1], { align: 'center' });
  kit.micro(g, 'SE MERECE.', cx + (cw >> 1), cy + 14, PAL.red[3], { align: 'center' });
  kit.cantoVivo(g, cx, cy, cw, ch);
  // marco metálico y sombra interior
  rect(g, x - 3, y - 3, w + 6, h + 9, PAL.metal[2]); frameRect(g, x - 3, y - 3, w + 6, h + 9, PAL.metal[1]);
  hline(g, x - 2, y - 2, w + 4, PAL.metal[5]); vline(g, x - 2, y - 2, h + 8, PAL.metal[4]);
  // interior oscuro con estantes y archivadores a la luz de un flexo verde
  rect(g, x, y, w, h, PAL.ink[0]);
  gradH(g, x, y, w, h, [PAL.ink[0], '#10281a', PAL.ink[0]]);
  for (let sy = y + 2; sy < y + h - 4; sy += 5) {
    hline(g, x, sy + 4, w, PAL.metal[1]);
    for (let k = 0; k < 11; k++) rect(g, x + 2 + k * 3, sy, 2, 4, [PAL.wood[2], PAL.green[2], PAL.paper[2], PAL.red[2]][(k * 7 + sy) % 4]);
  }
  glow(g, x + 28, y + 6, 12, 6, '#c8f0a0', 0.25, 3);
  // alféizar de madera (mostrador estrecho)
  rect(g, x - 4, y + h, w + 8, 5, PAL.wood[4]); hline(g, x - 4, y + h, w + 8, PAL.wood[7]); hline(g, x - 4, y + h + 4, w + 8, PAL.wood[1]);
  ditherOverlay(g, x - 2, y + h + 5, w + 4, 3, PAL.ink[0], 0.5);
}

function drawBell(g) {
  // timbre de mostrador con pegatina «NO», con su canto vivo (es interactivo)
  const bx = 108, by = 53;
  rect(g, bx, by + 7, 12, 3, PAL.metal[4]); hline(g, bx, by + 7, 12, PAL.metal[7]); hline(g, bx, by + 9, 12, PAL.metal[1]);
  ellipse(g, bx + 6, by + 5, 5, 3, (xx, yy, d) => ditherPick(xx, yy, [PAL.gold[6], PAL.gold[4], PAL.gold[3]], d));
  px(g, bx + 6, by + 1, PAL.metal[7]); px(g, bx + 5, by + 2, PAL.gold[6]);
  rect(g, bx + 3, by + 6, 6, 3, PAL.paper[7]); kit.micro(g, 'N', bx + 3, by + 4, PAL.red[3], { registrar: false }); px(g, bx + 8, by + 8, PAL.red[3]);
  kit.cantoVivo(g, bx, by, 12, 10);
}

export function drawCustodia(g, view, t) {
  const { x, y, w } = HATCH;
  const T = t || 0;
  // persiana metálica a media altura (lamas, tope inferior y asa)
  for (let ly = y - 1; ly < y + 7; ly += 2) { hline(g, x - 1, ly, w + 2, PAL.metal[4]); hline(g, x - 1, ly + 1, w + 2, PAL.metal[2]); }
  rect(g, x - 1, y + 7, w + 2, 2, PAL.metal[5]); hline(g, x - 1, y + 7, w + 2, PAL.metal[7]); hline(g, x - 1, y + 9, w + 2, PAL.ink[0]);
  rect(g, x + 15, y + 8, 5, 2, PAL.metal[3]);
  ditherOverlay(g, x, y + 10, w, 2, PAL.ink[0], 0.5);
  // llave con cinta roja colgando
  line(g, x + 31, y + 10, x + 31, y + 14, PAL.red[4], 2);
  rect(g, x + 30, y + 14, 3, 2, PAL.gold[5]); px(g, x + 31, y + 16, PAL.gold[4]);
  // esquina del libro negro
  poly(g, [[x + 1, y + 15], [x + 8, y + 15], [x + 8, y + 12], [x + 1, y + 11]], PAL.ink[1]); hline(g, x + 1, y + 11, 7, PAL.metal[3]);
  // manos con guantes de punto sin dedos: tamborilean; de vez en cuando cuentan con los dedos (dedos de 2 px, bien visibles)
  const cyc = T % 11000;
  const counting = cyc > 8000 && cyc < 10200;
  const nfing = counting ? 1 + Math.floor((cyc - 8000) / 700) : 0;
  const tap = Math.floor(T / 140);
  const hand = (hx, hy, right, ph) => {
    rect(g, hx, hy, 9, 5, PAL.purple[4]);
    for (let k = 0; k < 9; k += 2) vline(g, hx + k, hy, 5, PAL.purple[5]);
    hline(g, hx, hy + 4, 9, PAL.purple[2]); hline(g, hx, hy, 9, PAL.purple[6]);
    rect(g, hx + (right ? 8 : -1), hy + 1, 2, 4, PAL.purple[3]);
    for (let f = 0; f < 4; f++) {
      const up = counting && right ? (f < nfing ? 3 : 0) : ((tap + f * 2 + ph) % 6 === 0 ? 1 : 0);
      const fx = hx + f * 2 + (right ? 1 : 0);
      rect(g, fx, hy - 3 - up, 2, 3 + up, PAL.skin[4]); px(g, fx, hy - 3 - up, PAL.skin[5]); px(g, fx + 1, hy - 3 - up, PAL.skin[3]);
    }
  };
  hand(x + 3, y + 10, false, 0);
  hand(x + 24, y + 10, true, 3);
  glow(g, x + 22, y + 14, 18, 4, '#c8f0a0', 0.12, 3);
  kit.cantoVivo(g, x - 4, y - 3, w + 8, HATCH.h + 9);
  drawBell(g);
}

export function secretaria(g) {
  const x = 88, y = 66, w = 42;
  shadowEllipse(g, x + w / 2, FL + 1, w / 2 + 3, 2.5, 0.8);
  gradV(g, x, y + 3, w, FL - y - 3, [PAL.wood[4], PAL.wood[3], PAL.wood[2]]);
  noise(g, x, y + 3, w, FL - y - 3, PAL.wood[1], 0.05, 7);
  for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) {
    const px0 = x + 3 + i * 19, py0 = y + 6 + j * 12;
    frameRect(g, px0, py0, 17, 10, PAL.wood[1]); hline(g, px0 + 1, py0 + 1, 15, PAL.wood[5]); vline(g, px0 + 1, py0 + 1, 8, PAL.wood[5]);
    rect(g, px0 + 6, py0 + 4, 5, 1, PAL.metal[6]);
    rect(g, px0 + 2, py0 + 2, 5, 3, PAL.paper[6]); px(g, px0 + 3, py0 + 3, PAL.ink[2]); px(g, px0 + 5, py0 + 3, PAL.ink[2]);   // etiquetas
  }
  rect(g, x, FL - 3, w, 3, PAL.ink[2]);
  rect(g, x - 1, y, w + 2, 3, PAL.metal[4]); hline(g, x - 1, y, w + 2, PAL.metal[7]);
}
