// PROPUESTA · mini-renderizador que reproduce el orden de pintado de Game.renderRoom (engine/core.js) para una definición
// de arte con el contrato de content/rooms/art: draw → animate → objetos 'back' → objetos 'sorted' + actores por z →
// foreground → overlay → objetos 'front'. Así las pruebas pintadas se ven como se verían en el juego.
import { actor, sentado, escalaSala } from './actores.js';

export function vista(flags = {}, objStates = {}, t = 1200) {
  return {
    flags, t,
    flag: (n) => flags[n],
    has: () => false,
    objState: (id) => objStates[id],
    state: undefined, visible: true,
  };
}

/**
 * def: arte; o: { flags, objStates, actores: [{ id, x, y, dir, variante, sentado, escala, rot, anim }], t, ocultar: [ids] }
 * Devuelve un canvas 1x de def.width × 144 (o el recorte camX..camX+320 si o.cam está definido).
 */
export function renderSala(def, o = {}) {
  const W = def.width || 320, H = 144;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d'); g.imageSmoothingEnabled = false;
  const t = o.t ?? 1200;
  const v = vista(o.flags || {}, o.objStates || {}, t);
  def.draw && def.draw(g, v, 0);
  def.animate && def.animate(g, v, t);
  const objs = Object.entries(def.layout || {}).filter(([id, L]) => L.draw && !(o.ocultar || []).includes(id));
  const sorted = [];
  for (const [id, L] of objs) {
    const vv = { ...v, state: (o.objStates || {})[id], visible: true };
    const layer = L.layer || 'back';
    const fn = () => L.draw(g, vv, t);
    if (layer === 'back') fn();
    else if (layer === 'sorted') sorted.push({ z: L.zy ?? ((L.rect ? L.rect[1] + L.rect[3] : 0)), fn });
  }
  for (const a of (o.actores || [])) {
    const s = a.escala ?? escalaSala(def.scale, a.y);
    sorted.push({ z: a.z ?? a.y, fn: () => (a.sentado ? sentado(g, a.id, a.x, a.y, { escala: s, dir: a.dir, variante: a.variante, anim: a.anim, doll: a.doll, cadera: a.cadera }) : actor(g, a.id, a.x, a.y, { escala: s, dir: a.dir, variante: a.variante, rot: a.rot, anim: a.anim, frame: a.frame, extra: a.extra, doll: a.doll })) });
  }
  sorted.sort((a, b) => a.z - b.z);
  for (const s of sorted) s.fn();
  def.foreground && def.foreground(g, v, t);
  def.overlay && def.overlay(g, v, t);
  for (const [id, L] of objs) if (L.layer === 'front') L.draw(g, { ...v, state: (o.objStates || {})[id] }, t);
  if (o.cam != null) {
    const k = document.createElement('canvas'); k.width = 320; k.height = H;
    k.getContext('2d').drawImage(c, -o.cam, 0);
    return k;
  }
  return c;
}

/** escala entera sin suavizado */
export function ampliar(c, s = 3) {
  const k = document.createElement('canvas'); k.width = c.width * s; k.height = c.height * s;
  const g = k.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(c, 0, 0, k.width, k.height);
  return k;
}
export function cargarImg(url) { return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; }); }
