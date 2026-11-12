// buildRoom(logic, art): une la LÓGICA de una sala (content/rooms/<id>.js, del autor del paquete) con su ARTE
// y GEOMETRÍA (content/rooms/art/<id>.art.js, del artista de fondos), casando por id.
// ARCHIVO COMPARTIDO (motor de contenido): no lo edita ningún autor; si necesitas algo, descríbelo en tu informe.
//
// - Avisa por consola ([sala <id>] ...) de ids que están en un lado y no en el otro; la lista queda en
//   `roomWarnings` (la usa tools/check.mjs).
// - Un objeto de la lógica sin entrada en `layout` recibe un rectángulo provisional visible (con su id).
// - Salidas: `exit: { room }` sin `entry` usa como entrada el id de la sala de origen
//   (convención: las `entries` del arte se llaman como la sala de la que se viene).
// - Música por defecto: 'm_<id>'.
// Documentación completa: docs/CONTENT_SCHEMA.md §3 y docs/ART_GUIDE.md §1.
import { drawText, measure } from '../../engine/font.js';

export const roomWarnings = [];

// keys an art `layout` entry may give to an OBJECT (everything else about the object is logic)
const ART_OBJ_KEYS = ['walkTo', 'face', 'walk', 'priority', 'layer', 'zy', 'cache', 'cachePad', 'draw'];

const toPoint = (at) => (Array.isArray(at) ? { x: at[0], y: at[1], dir: at[2] || 'down' } : at ? { x: at.x, y: at.y, dir: at.dir || 'down' } : null);

function placeholderGeom(n) {
  const x = 6 + (n % 7) * 44, y = 18 + Math.floor(n / 7) * 22;
  return { x, y, w: 40, h: 18 };
}

export function buildRoom(logic, art = {}) {
  const id = logic.id;
  const L = art.layout || {};
  const warn = (m) => { const s = `[sala ${id}] ${m}`; console.warn(s); roomWarnings.push(s); };
  if (art.room && art.room !== id) warn(`el archivo de arte declara room '${art.room}'`);
  const used = new Set();
  let ph = 0;

  const objects = (logic.objects || []).map(o => {
    const a = L[o.id];
    const obj = { ...o };
    if (o.exit && !o.exit.entry) obj.exit = { ...o.exit, entry: id };
    if (!a) {
      warn(`objeto '${o.id}' no tiene entrada en layout (arte): rectángulo provisional`);
      const r = placeholderGeom(ph++);
      Object.assign(obj, r, { placeholder: true });
      obj.draw = (g) => drawPlaceholderBox(g, r.x, r.y, r.w, r.h, o.id, '#ff60c0');
      obj.layer = 'front';
      return obj;
    }
    used.add(o.id);
    if (a.rect) { const [x, y, w, h] = a.rect; Object.assign(obj, { x, y, w, h }); }
    else if (a.poly) obj.poly = a.poly;
    else warn(`'${o.id}' en layout no tiene rect ni poly`);
    for (const k of ART_OBJ_KEYS) if (a[k] !== undefined && obj[k] === undefined) obj[k] = a[k];
    if (a.sprites) {
      // one draw function per object state: sprites: { <state>: fn, default: fn }
      const S = a.sprites;
      if (o.states) for (const k of Object.keys(S)) if (k !== 'default' && !o.states.includes(k)) warn(`'${o.id}': sprite para el estado '${k}', que la lógica no declara en states`);
      obj.draw = (g, view, t) => { const f = S[String(view.state)] || S.default; if (f) f(g, view, t); };
    }
    return obj;
  });

  const actors = (logic.actors || []).map((p, i) => {
    const a = L[p.id];
    if (!a) {
      warn(`PNJ '${p.id}' no tiene entrada en layout (arte): lo pongo en un sitio provisional`);
      return { x: 60 + i * 40, y: 124, dir: 'down', ...p };
    }
    used.add(p.id);
    const at = toPoint(a.at) || { x: 160, y: 124, dir: 'down' };
    const out = { ...p, x: at.x, y: at.y, dir: at.dir };
    if (a.walkTo && !p.walkTo) out.walkTo = a.walkTo;
    if (a.face && !p.face) out.face = a.face;
    if (a.positions) {
      out.positions = {};
      for (const [k, v] of Object.entries(a.positions)) {
        const pt = toPoint(v.at) || at;
        out.positions[k] = { x: pt.x, y: pt.y, dir: pt.dir, ...(v.walkTo ? { walkTo: v.walkTo } : {}), ...(v.face ? { face: v.face } : {}) };
      }
    }
    if (p.pos && typeof p.pos === 'string' && !(a.positions && a.positions[p.pos])) warn(`PNJ '${p.id}' usa pos '${p.pos}', que el arte no define en positions`);
    return out;
  });

  for (const k of Object.keys(L)) if (!used.has(k)) warn(`'${k}' está en el layout del arte pero no en la lógica`);

  const { objects: _o, actors: _a, ...rest } = logic;
  const width = art.width || 320;
  return {
    ...rest,
    objects, actors,
    music: logic.music !== undefined ? logic.music : 'm_' + id,
    width,
    scale: art.scale || { yFar: 100, far: 0.85, yNear: 142, near: 1.0 },
    walkboxes: art.walkboxes || [{ id: 'suelo', poly: [[4, 104], [width - 4, 104], [width - 2, 142], [2, 142]] }],
    entries: art.entries || { default: { x: width / 2, y: 124, dir: 'down' } },
    draw: art.draw || ((g) => drawPlaceholderRoom(g, width, id)),
    animate: art.animate, foreground: art.foreground, overlay: art.overlay,
    dynamic: !!(logic.dynamic || art.dynamic),
    art, layout: L,
  };
}

// ------------------------------------------------------------------ placeholder drawing (stubs)
export function drawPlaceholderBox(g, x, y, w, h, label, color = '#c0b8e0') {
  g.fillStyle = color; for (let i = 0; i < w; i += 2) { g.fillRect(x + i, y, 1, 1); g.fillRect(x + i, y + h - 1, 1, 1); }
  for (let i = 0; i < h; i += 2) { g.fillRect(x, y + i, 1, 1); g.fillRect(x + w - 1, y + i, 1, 1); }
  if (label && w > 10) {
    let t = String(label);
    while (t.length > 2 && measure(t) > w - 3) t = t.slice(0, -1);
    g.save(); g.beginPath(); g.rect(x + 1, y + 1, w - 2, h - 2); g.clip();
    drawText(g, t, x + 2, y + 1, color, { outline: '#000000' });
    g.restore();
  }
}
/** Flat placeholder room: wall, floor line, the room id. */
export function drawPlaceholderRoom(g, width, label, { wall = '#3a3450', floor = '#2a2638', line = '#5a5478' } = {}) {
  g.fillStyle = '#1c1828'; g.fillRect(0, 0, width, 16);
  g.fillStyle = wall; g.fillRect(0, 16, width, 82);
  g.fillStyle = floor; g.fillRect(0, 98, width, 46);
  g.fillStyle = line; g.fillRect(0, 98, width, 1);
  for (let x = 0; x < width; x += 32) { g.fillStyle = '#24202f'; g.fillRect(x, 99, 1, 45); }
  if (label) drawText(g, label, 4, 2, '#8a84a8', { outline: null });
}
/** Stub helper for art files: placeholder room + a dashed box with its id for every layout rect/poly. */
export function drawLayoutPlaceholders(g, layout, color = '#a8a0c8') {
  for (const [k, a] of Object.entries(layout || {})) {
    if (a.rect) drawPlaceholderBox(g, a.rect[0], a.rect[1], a.rect[2], a.rect[3], k, color);
    else if (a.poly) {
      const xs = a.poly.map(p => p[0]), ys = a.poly.map(p => p[1]);
      drawPlaceholderBox(g, Math.min(...xs), Math.min(...ys), Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys), k, color);
    }
  }
}
