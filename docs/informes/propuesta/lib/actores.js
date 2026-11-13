// PROPUESTA · dibujar el reparto REAL (content/actors.js + engine/sprites.js) en las maquetas y en las pruebas pintadas.
// Reproduce Game.drawActor (engine/core.js): sombra, escala por profundidad y espejo; añade la POSE SENTADA que se propone
// al motor (recorte por la cadera + desplazamiento al asiento) y la caída en 3 fotogramas del Lector Medio.
import actors from '../../../../content/actors.js';
import { paperDoll, getFrame } from '../../../../engine/sprites.js';
import { shadowEllipse } from '../../../../engine/draw.js';

const cache = {};
export function sprite(id, variante, doll) {
  const k = id + ':' + (variante || '') + (doll ? JSON.stringify(doll) : '');
  if (cache[k]) return cache[k];
  if (doll) { cache[k] = paperDoll(doll); return cache[k]; }
  const def = actors[id];
  if (!def) throw new Error('actor desconocido ' + id);
  let sp = def.sprite || paperDoll(def.doll || {});
  if (variante && def.variants && def.variants[variante]) { const v = def.variants[variante]; sp = v.sprite || paperDoll({ ...(def.doll || {}), ...(v.doll || {}) }); }
  cache[k] = sp;
  return sp;
}
export const escalaSala = (sc, y) => {
  const { yFar = 0, far = 1, yNear = 144, near = 1 } = sc || {};
  const t = Math.max(0, Math.min(1, (y - yFar) / ((yNear - yFar) || 1)));
  return far + (near - far) * t;
};
export function color(id) { return (actors[id] && actors[id].color) || '#ffffff'; }
export function nombre(id) { return (actors[id] && actors[id].name) || id; }

/** Dibuja un actor de pie. o: { dir, anim, frame, variante, escala, sombra } */
export function actor(g, id, x, y, o = {}) {
  const sp = sprite(id, o.variante, o.doll);
  const s = o.escala ?? 1;
  const def = actors[id] || {};
  if (o.sombra !== false && sp.shadow !== false) shadowEllipse(g, Math.round(x), Math.round(y), Math.max(3, 8 * s), Math.max(1.2, 2.2 * s), 0.55);
  const { canvas, flip } = getFrame(sp, o.anim || 'idle', o.dir || 'down', o.frame || 0);
  const dw = Math.round(canvas.width * s), dh = Math.round(canvas.height * s);
  const dx = Math.round(x - (sp.ox + 1) * s), dy = Math.round(y - (sp.oy + 1) * s);
  g.save();
  g.imageSmoothingEnabled = false;
  if (o.alpha != null) g.globalAlpha = o.alpha;
  if (o.rot) {
    // rotación alrededor de los pies (solo para la caída del Lector Medio: storyboard)
    g.translate(Math.round(x), Math.round(y)); g.rotate(o.rot); g.translate(-Math.round(x), -Math.round(y));
  }
  if (flip) { g.translate(Math.round(x) * 2, 0); g.scale(-1, 1); }
  g.drawImage(canvas, dx, dy, dw, dh);
  g.restore();
  if (def.drawExtra && o.extra) def.drawExtra(g, { x, y, dir: o.dir || 'down' }, 0, { s, box: { x: dx, y: dy, w: dw, h: dh } });
  return { x: dx, y: dy, w: dw, h: dh };
}

/** POSE SENTADA propuesta: se dibuja solo de la cadera hacia arriba (fila `cadera` del sprite) con la cadera en `ySeat`.
 *  El asiento/la mesa que se pinten DELANTE tapan el regazo. Paper doll: cadera ≈ fila 42 de 64. */
export function sentado(g, id, x, ySeat, o = {}) {
  const sp = sprite(id, o.variante, o.doll);
  const s = o.escala ?? 1;
  const { canvas, flip } = getFrame(sp, o.anim || 'idle', o.dir || 'down', o.frame || 0);
  const cadera = o.cadera ?? Math.round((sp.h || 64) * 0.66);
  const sw = canvas.width, sh = cadera + 1;
  const dw = Math.round(sw * s), dh = Math.round(sh * s);
  const dx = Math.round(x - (sp.ox + 1) * s), dy = Math.round(ySeat - dh);
  g.save(); g.imageSmoothingEnabled = false;
  if (flip) { g.translate(Math.round(x) * 2, 0); g.scale(-1, 1); }
  g.drawImage(canvas, 0, 0, sw, sh, dx, dy, dw, dh);
  g.restore();
  return { x: dx, y: dy, w: dw, h: dh };
}

/** caja (en píxeles de sala) que ocupa un actor de pie: para comprobar oclusiones en las maquetas */
export function cajaActor(id, x, y, escala = 1, variante) {
  const sp = sprite(id, variante);
  return { x: Math.round(x - (sp.ox + 1) * escala), y: Math.round(y - (sp.oy + 1) * escala), w: Math.round((sp.w + 2) * escala), h: Math.round((sp.h + 2) * escala) };
}
export { actors };
