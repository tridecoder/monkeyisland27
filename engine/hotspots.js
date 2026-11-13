// «VER HOTSPOTS» (decisión D7 de la propuesta): resalta TODO lo interactivo de la sala con el lenguaje del kit
// («canto vivo»: 1 px de luz cálida arriba a la izquierda + sombra de 2 px abajo a la derecha) y su nombre.
// Se pide con: el botón del ojo del panel, «Ver objetos» del menú de pausa, la tecla H (1,5 s), mantener Espacio,
// o una pulsación larga en una zona vacía de la sala (táctil). Game.showHotspots(ms, hold).
import { drawText, measure } from './font.js';

/** Caja (coordenadas de sala) de un objeto con rect o poly. */
export function bbox(o) {
  if (o.poly) {
    const xs = o.poly.map(p => p[0]), ys = o.poly.map(p => p[1]);
    const x = Math.min(...xs), y = Math.min(...ys);
    return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y };
  }
  if (o.w == null) return null;
  return { x: o.x, y: o.y, w: o.w, h: o.h };
}

export function active(game) {
  const H = game.hsShow;
  if (!H) return false;
  if (game.hsHold) { H.until = Math.max(H.until, game.realTime + 400); return true; }
  if (game.realTime > H.until || game.mode !== 'play' || game.menu) { game.hsShow = null; return false; }
  return true;
}

/** Lista de objetivos interactivos visibles: { id, name, box, kind: 'obj' | 'exit' | 'actor' }. */
export function targets(game) {
  const out = [];
  const rid = game.room.def.id;
  for (const o of game.roomObjects()) {
    if (o.hotspot === false || o.placeholder) continue;
    const st = game.getObjState(o.id);
    if (!st.visible) continue;
    const b = bbox(o); if (!b) continue;
    out.push({ id: o.id, name: game.nameOf(o, st), box: b, kind: (o.exit || o.ascensor) ? 'exit' : 'obj' });
  }
  for (const a of Object.values(game.actors)) {
    if (a.room !== rid || !a.visible || a.id === game.G.player || a.def.hotspot === false) continue;
    const b = game.actorBox(a);
    out.push({ id: a.id, name: game.actorTarget(a).name, box: { x: b.x, y: b.y, w: b.w, h: b.h }, kind: 'actor', color: a.color });
  }
  return out;
}

const COL = { obj: '#ffe8a0', exit: '#9fd8ff', actor: '#ffffff' };

export function draw(game, g, cam) {
  const H = game.hsShow;
  const left = H.until - game.realTime;
  const fade = game.hsHold ? 1 : Math.max(0, Math.min(1, left / 300));
  // solo lo que está a la vista (en las salas anchas, la cámara enseña 320 px)
  const T = targets(game).filter(t => t.box.x + t.box.w > cam && t.box.x < cam + 320);
  g.save();
  g.globalAlpha = 0.35 * fade; g.fillStyle = '#05040a'; g.fillRect(cam, 0, 320, 144);
  g.globalAlpha = fade;
  const R = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(w)), Math.max(1, Math.round(h))); };
  for (const t of T) {
    const { x, y, w, h } = t.box;
    const c = t.kind === 'actor' ? (t.color || COL.actor) : COL[t.kind];
    // sombra de contacto (2 px abajo y a la derecha) y canto vivo (luz cálida arriba y a la izquierda)
    R(x + 1, y + h, w, 2, '#000000'); R(x + w, y + 1, 1, h, '#000000');
    R(x, y, w, 1, '#fff2c0'); R(x, y, 1, h, '#ffe8a0');
    R(x, y + h - 1, w, 1, c); R(x + w - 1, y, 1, h, c);
    // esquinas marcadas
    for (const [cx, cy] of [[x, y], [x + w - 2, y], [x, y + h - 2], [x + w - 2, y + h - 2]]) R(cx, cy, 2, 2, '#fff2c0');
  }
  // rótulos: encima de la caja (o dentro si no cabe), sin pisarse, siempre dentro de la vista
  const placed = [];
  const hit = (r) => placed.some(p => r.x < p.x + p.w && r.x + r.w > p.x && r.y < p.y + p.h && r.y + r.h > p.y);
  // (tools/sala.mjs pinta panorámicas por tramos de 320 px: con game.hsCentro cada rótulo sale solo en el tramo de su centro)
  const L = game.hsCentro ? T.filter(t => t.box.x + t.box.w / 2 >= cam && t.box.x + t.box.w / 2 < cam + 320) : T;
  const order = L.slice().sort((a, b) => a.box.w * a.box.h - b.box.w * b.box.h);   // los pequeños primero
  for (const t of order) {
    const txt = String(t.name || t.id);
    const tw = measure(txt) + 4, th = 11;
    const cx = t.box.x + t.box.w / 2;
    let r = null;
    for (const dy of [-th - 1, 2, t.box.h + 2, -2 * th - 2, t.box.h + th + 3, 2 + th + 1]) {
      const c = { x: Math.round(Math.max(cam + 1, Math.min(cam + 319 - tw, cx - tw / 2))), y: Math.round(Math.max(1, Math.min(134, t.box.y + dy))), w: tw, h: th };
      if (!hit(c)) { r = c; break; }
    }
    if (!r) r = { x: Math.round(Math.max(cam + 1, Math.min(cam + 319 - tw, cx - tw / 2))), y: Math.round(Math.max(1, Math.min(134, t.box.y + 2))), w: tw, h: th };
    placed.push(r);
    g.globalAlpha = 0.85 * fade; R(r.x, r.y, r.w, r.h, '#08060e');
    g.globalAlpha = fade;
    const c = t.kind === 'actor' ? (t.color || COL.actor) : COL[t.kind];
    drawText(g, txt, r.x + 2, r.y, c, {});
  }
  g.restore();
}
