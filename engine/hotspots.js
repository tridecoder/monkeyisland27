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
  // rótulos: cerca de su caja, SIN PISARSE y siempre dentro de la vista. Se colocan de los pequeños a los grandes
  // probando posiciones cada vez más lejos (encima, dentro, debajo, más arriba/abajo, corridas a los lados); el primero
  // libre gana. Si el rótulo queda despegado de su caja, una línea guía (1 px) los une. En las salas llenas (Desarrollo,
  // Marketing) así se leen todos, también en el iPhone en horizontal (la pantalla virtual es la misma: 320 × 144).
  const placed = [];
  const hit = (r) => placed.some(p => r.x < p.x + p.w + 1 && r.x + r.w + 1 > p.x && r.y < p.y + p.h && r.y + r.h > p.y);
  // (tools/sala.mjs pinta panorámicas por tramos de 320 px: con game.hsCentro = x cada rótulo sale solo en el tramo de su
  // centro, que empieza en x; `true` = el tramo de la cámara)
  const c0 = typeof game.hsCentro === 'number' ? game.hsCentro : cam;
  const L = (game.hsCentro != null && game.hsCentro !== false) ? T.filter(t => t.box.x + t.box.w / 2 >= c0 && t.box.x + t.box.w / 2 < cam + 320) : T;
  const order = L.slice().sort((a, b) => a.box.w * a.box.h - b.box.w * b.box.h);   // los pequeños primero
  const out = [];
  for (const t of order) {
    const txt = String(t.name || t.id);
    const tw = measure(txt) + 4, th = 11;
    const { x: bx, y: by, w: bw, h: bh } = t.box;
    const cx = bx + bw / 2;
    const clampX = (x) => Math.round(Math.max(cam + 1, Math.min(cam + 319 - tw, x)));
    const clampY = (y) => Math.round(Math.max(1, Math.min(133, y)));
    const cands = [];
    const dys = [-th - 1, 2, bh + 2];
    for (let k = 1; k <= 7; k++) dys.push(-th - 1 - k * (th + 1), bh + 2 + k * (th + 1), 2 + k * (th + 1));
    const dxs = [0, -(tw / 2 + 2), tw / 2 + 2, -(tw + 4), tw + 4];
    for (const dy of dys) for (const dx of dxs) {
      const c = { x: clampX(cx - tw / 2 + dx), y: clampY(by + dy), w: tw, h: th };
      const ax = c.x + c.w / 2, ay = c.y + c.h / 2;
      c.d = Math.hypot(ax - cx, ay - (by + Math.min(bh, 20) / 2)) + Math.abs(dx) * 0.4;
      cands.push(c);
    }
    cands.sort((a, b) => a.d - b.d);
    let r = cands.find(c => !hit(c));
    if (!r) r = cands[0];
    placed.push(r);
    out.push({ t, r, txt });
  }
  // líneas guía primero (por debajo de los rótulos), luego los rótulos
  for (const { t, r } of out) {
    const { x: bx, y: by, w: bw, h: bh } = t.box;
    const toca = r.x < bx + bw + 1 && r.x + r.w > bx - 1 && r.y < by + bh + 1 && r.y + r.h > by - 1;
    if (toca) continue;
    const c = t.kind === 'actor' ? (t.color || COL.actor) : COL[t.kind];
    const lx = Math.max(r.x + 2, Math.min(r.x + r.w - 3, bx + bw / 2)), ly = r.y + r.h / 2 < by ? r.y + r.h : r.y - 1;
    const tx = Math.max(bx + 1, Math.min(bx + bw - 2, lx)), ty = ly < by ? by : by + bh - 1;
    g.globalAlpha = 0.9 * fade;
    const n = Math.max(Math.abs(tx - lx), Math.abs(ty - ly)) || 1;
    for (let i = 0; i <= n; i++) R(lx + (tx - lx) * i / n, ly + (ty - ly) * i / n, 1, 1, c);
    R(tx - 1, ty - 1, 3, 3, c);
  }
  for (const { t, r, txt } of out) {
    g.globalAlpha = 0.88 * fade; R(r.x, r.y, r.w, r.h, '#08060e');
    g.globalAlpha = fade;
    const c = t.kind === 'actor' ? (t.color || COL.actor) : COL[t.kind];
    drawText(g, txt, r.x + 2, r.y, c, {});
  }
  g.restore();
}
