// POSES de los actores (pose sentada y «tras la mesa») y objeto en la mano. Lo usa engine/core.js (drawActor, actorBox).
//
//   'sentado'    de frente/espaldas: el tronco baja (cadera a la altura del asiento), 2 filas de regazo y las
//                pantorrillas en su sitio; de perfil: muslo horizontal hacia donde mira y pantorrillas adelantadas.
//                Los pies (`y` del actor) siguen en el suelo: ordena en profundidad igual que de pie.
//   'tras_mesa'  solo de la cadera para arriba, bajado igual que sentado: el mueble que la sala pinta DELANTE (objeto
//                `layer: 'sorted'` con su `zy` mayor que los pies, o `foreground`) tapa el resto. Sin sombra.
// Se elige por colocación (art: `at: [x, y, dir], pose: 'sentado'` o en `positions`), o desde un guion con
// api.pose(id, 'sentado' | 'tras_mesa' | 'de_pie' | null). Al andar, el actor se levanta solo.
import { getFrame } from './sprites.js';

/** Geometría del asiento de un sprite (filas del sprite, sin el margen de 1 px del lienzo). */
export function seat(sp) {
  if (sp._seat) return sp._seat;
  const h = sp.h || 64, oy = sp.oy ?? h - 1;
  const hip = sp.hipY ?? Math.round(h * 0.64);
  const leg = sp.legLen ?? Math.max(6, oy - hip - 2);
  const half = Math.round(leg / 2);
  const knee = hip + 1 + half;                      // primera fila de la pantorrilla
  const drop = Math.max(3, half - 2);               // cuánto baja el tronco al sentarse
  sp._seat = { hip, knee, drop, leg };
  return sp._seat;
}

function blit(g, cv, sy, sh, dx, dy, s) {
  if (sh <= 0) return;
  g.drawImage(cv, 0, sy, cv.width, sh, dx, Math.round(dy + sy * s + 0), Math.round(cv.width * s), Math.max(1, Math.round(sh * s)));
}

/** Dibuja el fotograma `cv` (lienzo de getFrame, con 1 px de margen) en pose. dx, dy = esquina como de pie. */
export function drawPosed(g, sp, cv, dx, dy, s, pose, dir) {
  const P = seat(sp);
  const H = P.hip + 1, K = P.knee + 1;               // filas en el lienzo (margen de 1 px)
  const D = P.drop;
  const side = dir === 'left' || dir === 'right';
  if (pose === 'tras_mesa') { blit(g, cv, 0, H + 3, dx, dy + D * s, s); return; }
  if (!side) {
    blit(g, cv, K, cv.height - K, dx, dy, s);                                 // pantorrillas y zapatos, en su sitio
    // regazo: 2 filas de la parte alta de la pierna, justo bajo la cintura bajada
    g.drawImage(cv, 0, H + 1, cv.width, 2, dx, Math.round(dy + (H + 1 + D) * s), Math.round(cv.width * s), Math.max(1, Math.round(2 * s)));
    blit(g, cv, 0, H + 1, dx, dy + D * s, s);                                 // tronco y cabeza, bajados
    return;
  }
  // de perfil (el lienzo mira a la derecha; core.js ya ha volteado si mira a la izquierda)
  const fwd = Math.round(P.leg * 0.45);
  g.drawImage(cv, 0, K, cv.width, cv.height - K, Math.round(dx + fwd * s), Math.round(dy + K * s), Math.round(cv.width * s), Math.round((cv.height - K) * s));
  // muslo: la franja de cadera (filas H+1..H+3) estirada hacia delante
  for (let i = 0; i <= fwd; i += 1) {
    g.drawImage(cv, 0, H + 1, cv.width, 3, Math.round(dx + i * s), Math.round(dy + (H + 1 + D) * s), Math.round(cv.width * s), Math.max(1, Math.round(3 * s)));
  }
  blit(g, cv, 0, H + 1, dx, dy + D * s, s);
}

/** Objeto en la mano (api.sostener): un icono de inventario a media escala o una función propia. */
export function drawHold(g, game, a, sp, s, pose) {
  const h = a.hold; if (!h) return;
  const P = seat(sp);
  const hy = sp.handY ?? Math.round((sp.oy ?? 63) * 0.62);
  const hx = sp.handX ?? 6;
  const dirX = a.dir === 'left' ? -1 : a.dir === 'right' ? 1 : (h.lado === 'izq' ? -1 : 1);
  const x = Math.round(a.x + dirX * hx * s), y = Math.round(a.y - ((sp.oy ?? 63) - hy - (pose ? P.drop : 0)) * s);
  if (typeof h.draw === 'function') { h.draw(g, x, y, s, a.dir); return; }
  if (h.icon) {
    const w = Math.round(h.icon.width * 0.5 * s), hh = Math.round(h.icon.height * 0.5 * s);
    g.drawImage(h.icon, Math.round(x - w / 2), Math.round(y - hh + 2), w, hh);
  }
}
void getFrame;
