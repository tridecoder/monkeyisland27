// Verb panel, sentence line, inventory, dialog options, cursor.
import { drawText, measure, wrap, LINE_H } from './font.js';
import { rect, hline, vline, ditherOverlay, gradV, bayer } from './draw.js';

export const PANEL_Y = 144;
export const LAYOUT = {
  sentenceY: 145,
  verbX: [6, 57, 107], verbY: [157, 171, 185], verbW: 50, verbH: 14,
  arrowX: 162, arrowW: 15, arrowUpY: 157, arrowDownY: 178, arrowH: 20,
  invX: 181, invY: 156, cellW: 34, cellH: 21, cols: 4, rows: 2,
  menuX: 305, menuY: 145, menuW: 13, menuH: 10,
  eyeX: 287, eyeY: 144, eyeW: 16, eyeH: 12,          // botón «ver hotspots» (16×12: objetivo táctil mínimo)
  optX: 8, optY: 145, optLines: 5, optLineH: 10,
  iconW: 28, iconH: 18,
};

// Colores del panel. Legibilidad (problema 5, tools/contrast.mjs): todo texto ≥ 4.5:1 sobre el fondo del panel, incluidas
// las opciones deshabilitadas (gris neutro, legible pero distinto del azul de las opciones normales).
export const COL = {
  bg: ['#06050b', '#0c0a16', '#121022'],
  border: '#2a2444',
  verb: '#86a8dc', verbHover: '#dcecff', verbDefault: '#f2d468', verbSel: '#ffffff', verbOff: '#8a86ac',
  sentence: '#c4aae6', sentenceVerb: '#eee2ff',
  opt: '#94b6ee', optHover: '#ffe27a', optDisabled: '#8e8a9e',
  cell: '#15122a', cellLine: '#252040', cellHover: '#2a2448',
};

const iconCache = new Map();
function itemIcon(game, id) {
  const it = game.content.items[id];
  // items may change their icon with the game state: iconKey(view) → string (part of the cache key)
  let variant = '';
  if (it && it.iconKey) { try { variant = String(it.iconKey(game.viewFor())); } catch (e) { variant = ''; } }
  const key = id + '|' + variant;
  let c = iconCache.get(key);
  if (c) return c;
  c = document.createElement('canvas');
  c.width = LAYOUT.iconW + 2; c.height = LAYOUT.iconH + 2;
  const g = c.getContext('2d');
  try { if (it && it.icon) { g.translate(1, 1); it.icon(g, 0, 0, game.viewFor(), variant); } else { g.fillStyle = '#a080c0'; g.fillRect(8, 4, 12, 10); } }
  catch (e) { game.error('icon() del item ' + id + ' falló', e); g.fillStyle = '#f0f'; g.fillRect(0, 0, 28, 18); }
  // dark outline for legibility
  const d = g.getImageData(0, 0, c.width, c.height), o = new ImageData(c.width, c.height);
  for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) {
    const i = (y * c.width + x) * 4;
    if (d.data[i + 3]) { o.data.set(d.data.slice(i, i + 4), i); o.data[i + 3] = 255; continue; }
    const n = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => { const nx = x + dx, ny = y + dy; return nx >= 0 && ny >= 0 && nx < c.width && ny < c.height && d.data[(ny * c.width + nx) * 4 + 3]; });
    if (n) { o.data[i] = 6; o.data[i + 1] = 4; o.data[i + 2] = 12; o.data[i + 3] = 255; }
  }
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.putImageData(o, 0, 0);
  iconCache.set(key, c);
  return c;
}
export function clearIconCache() { iconCache.clear(); }
/** Icono (lienzo 30×20 con contorno) de un item: lo usa api.sostener. */
export function itemIconCanvas(game, id) { return itemIcon(game, id); }

function verbAt(x, y) {
  const L = LAYOUT;
  for (let c = 0; c < 3; c++) for (let r = 0; r < 3; r++) {
    if (x >= L.verbX[c] - 2 && x < L.verbX[c] + L.verbW && y >= L.verbY[r] - 1 && y < L.verbY[r] + L.verbH - 1) return c * 3 + r;
  }
  return -1;
}

export function panelHit(game, x, y) {
  const L = LAYOUT;
  if (y < PANEL_Y) return null;
  if (x >= L.menuX && x < L.menuX + L.menuW && y >= L.menuY && y < L.menuY + L.menuH) return { type: 'menu' };
  if (x >= L.eyeX && x < L.eyeX + L.eyeW && y >= L.eyeY && y < L.eyeY + L.eyeH) return { type: 'hotspots' };
  const vi = verbAt(x, y);
  if (vi >= 0 && game.verbs[vi]) return { type: 'verb', id: game.verbs[vi].id };
  if (x >= L.arrowX && x < L.arrowX + L.arrowW) {
    if (y >= L.arrowUpY && y < L.arrowUpY + L.arrowH) return { type: 'arrow', dir: -1 };
    if (y >= L.arrowDownY && y < L.arrowDownY + L.arrowH) return { type: 'arrow', dir: 1 };
  }
  if (x >= L.invX && y >= L.invY && y < L.invY + L.rows * L.cellH) {
    const c = Math.floor((x - L.invX) / L.cellW), r = Math.floor((y - L.invY) / L.cellH);
    if (c >= 0 && c < L.cols) return { type: 'inv', index: (game.ui.invScroll + r) * L.cols + c };
  }
  return null;
}

export function scrollInventory(game, dir) {
  const rows = Math.ceil(game.state.inventory.length / LAYOUT.cols);
  const max = Math.max(0, rows - LAYOUT.rows);
  const ns = Math.max(0, Math.min(max, game.ui.invScroll + dir));
  if (ns !== game.ui.invScroll) { game.ui.invScroll = ns; game.audio.sfx('click'); }
}

// Rendimiento (móvil): el fondo del panel (degradado con trama, píxel a píxel) se pinta una vez en un lienzo aparte, y
// el panel entero en modo normal se reutiliza mientras no cambie nada de lo que enseña (frase, verbo, ratón encima,
// inventario…). Antes costaba ~5 ms por fotograma en un móvil medio (20 ms con la CPU ×4).
let bgCache = null;
function panelBg(g) {
  if (!bgCache && typeof document !== 'undefined') {
    bgCache = document.createElement('canvas'); bgCache.width = 320; bgCache.height = 56;
    const c = bgCache.getContext('2d'); c.translate(0, -PANEL_Y);
    gradV(c, 0, PANEL_Y, 320, 56, COL.bg);
    hline(c, 0, PANEL_Y, 320, COL.border);
    ditherOverlay(c, 0, PANEL_Y + 1, 320, 2, COL.border, 0.5);
  }
  if (bgCache) { g.drawImage(bgCache, 0, PANEL_Y); return; }
  gradV(g, 0, PANEL_Y, 320, 56, COL.bg);
  hline(g, 0, PANEL_Y, 320, COL.border);
  ditherOverlay(g, 0, PANEL_Y + 1, 320, 2, COL.border, 0.5);
}
let panelCache = null;

function arrow(g, x, y, w, h, up, enabled, hover) {
  const c = !enabled ? COL.verbOff : hover ? COL.verbHover : COL.verb;
  rect(g, x, y, w, h, hover && enabled ? '#1c1834' : '#100e1e');
  hline(g, x, y, w, '#26203c'); vline(g, x, y, h, '#26203c');
  const cx = x + (w >> 1), cy = y + (h >> 1);
  for (let i = 0; i < 5; i++) {
    const yy = up ? cy - 3 + i : cy + 3 - i;
    rect(g, cx - i, yy, i * 2 + 1, 1, c);
  }
  rect(g, cx - 1, up ? cy + 2 : cy - 4, 3, 3, c);
}

export function drawPanel(game, g) {
  panelBg(g);
  if (game.itemPick) { drawItemPick(game, g); return; }
  if ((game.cutscene > 0 || game.inDialog > 0) && !game.choice) return;
  if (game.choice) { drawChoice(game, g); return; }
  const L = LAYOUT;
  const hit = !game.busy && game.mouse.inside ? panelHit(game, game.mouse.x, game.mouse.y) : null;
  const sent = game.sentenceText();
  const hov = game.ui.hover;
  const defVerb = !game.busy && hov && !game.ui.verb ? game.defaultVerbFor(hov) : null;
  const key = [sent, !!game.ui.sentence, game.ui.verb, game.ui.item, defVerb, !!game.hsShow, game.ui.invScroll, game.state.inventory.map(id => { const it = game.content.items[id]; let v = ''; if (it && it.iconKey) { try { v = String(it.iconKey(game.viewFor())); } catch (e) { v = ''; } } return id + '/' + v; }).join(','),
    hit ? [hit.type, hit.id, hit.index, hit.dir].join(':') : ''].join('|');
  if (typeof document !== 'undefined') {
    if (!panelCache) { const cv = document.createElement('canvas'); cv.width = 320; cv.height = 56; panelCache = { cv, ctx: cv.getContext('2d'), key: null }; }
    if (panelCache.key !== key) {
      const c = panelCache.ctx;
      c.setTransform(1, 0, 0, 1, 0, -PANEL_Y); c.clearRect(0, PANEL_Y, 320, 56);
      panelBg(c);
      drawPanelBody(game, c, hit, sent, defVerb);
      panelCache.key = key;
    }
    g.drawImage(panelCache.cv, 0, PANEL_Y);
    return;
  }
  drawPanelBody(game, g, hit, sent, defVerb);
}
function drawPanelBody(game, g, hit, sent, defVerb) {
  const L = LAYOUT;
  // sentence
  drawText(g, sent, 160, L.sentenceY, game.ui.sentence ? COL.sentenceVerb : COL.sentence, { align: 'center' });
  // menu icon
  const mh = hit && hit.type === 'menu';
  for (let i = 0; i < 3; i++) rect(g, L.menuX + 2, L.menuY + 2 + i * 3, 9, 1, mh ? COL.verbHover : COL.verbOff);
  drawEye(g, hit && hit.type === 'hotspots', !!game.hsShow);
  // verbs
  game.verbs.forEach((v, i) => {
    const c = Math.floor(i / 3), r = i % 3;
    let col = COL.verb;
    if (game.ui.verb === v.id) col = COL.verbSel;
    else if (hit && hit.type === 'verb' && hit.id === v.id) col = COL.verbHover;
    else if (defVerb === v.id) col = COL.verbDefault;
    drawText(g, v.label, L.verbX[c], L.verbY[r], col, { bold: true, outline: '#000000' });
  });
  drawInventory(game, g, hit);
}

/** Botón «ver hotspots»: un ojo de 11×7 en una tecla de 16×12. */
function drawEye(g, hover, on) {
  const L = LAYOUT, x = L.eyeX, y = L.eyeY;
  rect(g, x + 1, y + 1, L.eyeW - 2, L.eyeH - 2, on ? '#2a2448' : hover ? '#1c1834' : '#100e1e');
  const c = on ? COL.verbDefault : hover ? COL.verbHover : COL.verbOff;
  const cx = x + 8, cy = y + 6;
  rect(g, cx - 3, cy - 3, 7, 1, c); rect(g, cx - 3, cy + 3, 7, 1, c);
  rect(g, cx - 5, cy - 2, 2, 1, c); rect(g, cx + 4, cy - 2, 2, 1, c); rect(g, cx - 5, cy + 2, 2, 1, c); rect(g, cx + 4, cy + 2, 2, 1, c);
  rect(g, cx - 6, cy - 1, 1, 3, c); rect(g, cx + 6, cy - 1, 1, 3, c);
  rect(g, cx - 1, cy - 1, 3, 3, c);
}

function drawInventory(game, g, hit) {
  const L = LAYOUT;
  // arrows
  const rows = Math.ceil(game.state.inventory.length / L.cols);
  arrow(g, L.arrowX, L.arrowUpY, L.arrowW, L.arrowH, true, game.ui.invScroll > 0, hit && hit.type === 'arrow' && hit.dir < 0);
  arrow(g, L.arrowX, L.arrowDownY, L.arrowW, L.arrowH, false, game.ui.invScroll < rows - L.rows, hit && hit.type === 'arrow' && hit.dir > 0);
  // inventory
  for (let r = 0; r < L.rows; r++) for (let c = 0; c < L.cols; c++) {
    const x = L.invX + c * L.cellW, y = L.invY + r * L.cellH;
    const idx = (game.ui.invScroll + r) * L.cols + c;
    const id = game.state.inventory[idx];
    const isHover = hit && hit.type === 'inv' && hit.index === idx && id;
    const sel = id && game.ui.item === id;
    rect(g, x + 1, y + 1, L.cellW - 2, L.cellH - 2, isHover ? COL.cellHover : COL.cell);
    hline(g, x + 1, y + 1, L.cellW - 2, '#0a0814'); vline(g, x + 1, y + 1, L.cellH - 2, '#0a0814');
    hline(g, x + 1, y + L.cellH - 2, L.cellW - 2, COL.cellLine); vline(g, x + L.cellW - 2, y + 1, L.cellH - 2, COL.cellLine);
    if (id) {
      const ic = itemIcon(game, id);
      g.drawImage(ic, x + ((L.cellW - ic.width) >> 1), y + ((L.cellH - ic.height) >> 1));
      if (sel) { for (let k = 0; k < L.cellW - 2; k += 2) { g.fillStyle = COL.verbDefault; g.fillRect(x + 1 + k, y + 1, 1, 1); g.fillRect(x + 2 + k, y + L.cellH - 2, 1, 1); } }
    }
  }
}

// --------------------------------------------------------------- item picker (duel finishers: "[Usar objeto]")
const PICK_BACK = { x: 8, y: 182, w: 120, h: 12 };
function drawItemPick(game, g) {
  const L = LAYOUT, ip = game.itemPick;
  const hit = game.mouse.inside ? panelHit(game, game.mouse.x, game.mouse.y) : null;
  const h = game.ui.hover;
  drawText(g, ip.prompt + (h && h.kind === 'inv' ? ' ' + h.name : ''), 160, L.sentenceY, COL.sentenceVerb, { align: 'center' });
  wrap('Elige un objeto del inventario para adjuntarlo al hilo.', 140).forEach((l, i) => drawText(g, l, 8, 158 + i * 10, COL.sentence));
  const m = game.mouse;
  const hb = m.inside && m.x >= PICK_BACK.x && m.x < PICK_BACK.x + PICK_BACK.w && m.y >= PICK_BACK.y && m.y < PICK_BACK.y + PICK_BACK.h;
  drawText(g, '[Volver al hilo]', PICK_BACK.x, PICK_BACK.y, hb ? COL.optHover : COL.opt);
  drawInventory(game, g, hit);
}
export function itemPickClick(game, x, y) {
  const ip = game.itemPick; if (!ip) return;
  if (x >= PICK_BACK.x && x < PICK_BACK.x + PICK_BACK.w && y >= PICK_BACK.y && y < PICK_BACK.y + PICK_BACK.h) { game.audio.sfx('click'); ip.resolve(null); return; }
  const hit = panelHit(game, x, y);
  if (!hit) return;
  if (hit.type === 'arrow') { scrollInventory(game, hit.dir); return; }
  if (hit.type === 'inv') { const id = game.state.inventory[hit.index]; if (id) { game.audio.sfx('select'); ip.resolve(id); } }
}

// --------------------------------------------------------------- dialog options
/** Geometría de las filas de opciones. Al tacto (iPhone), filas de 14 px (4 visibles) en vez de 10 (5 visibles):
 *  objetivo táctil mínimo de la propuesta (§1.10). */
export function optGeom(game) {
  const big = !!(game.touchUI ? game.touchUI() : game.mouse && game.mouse.touch);
  // menú compacto (el del duelo, ≤ 5 líneas, plan §7.1.3): al tacto, 5 filas de 11 px en vez de 4 de 14 (sin scroll)
  const ch = game.choice;
  if (big && ch && ch.compact && ch.layout && ch.layout.length <= 5) return { big: true, y: 144, h: 11, n: 5, dy: 1 };
  return big ? { big, y: 144, h: 14, n: 4, dy: 1 } : { big, y: LAYOUT.optY, h: LAYOUT.optLineH, n: LAYOUT.optLines, dy: 0 };
}
function choiceLayout(game) {
  const ch = game.choice;
  const G = optGeom(game);
  if (ch.layout && ch.big === G.big) return ch.layout;
  ch.big = G.big;
  const L = { ...LAYOUT, optLines: G.n };
  const lines = [];
  ch.options.forEach((o, i) => {
    wrap(o, 288).forEach((l, k) => lines.push({ opt: i, text: (k ? '  ' : '') + l }));   // 288: never under the scroll arrows (x ≥ 304)
  });
  ch.layout = lines;
  ch.maxScroll = Math.max(0, lines.length - optGeom(game).n);      // (compact menus get 5 rows once laid out)
  void L;
  return lines;
}
function drawChoice(game, g) {
  const L = LAYOUT, ch = game.choice;
  const lines = choiceLayout(game);
  const G = optGeom(game);
  ch.scroll = Math.max(0, Math.min(ch.scroll || 0, ch.maxScroll));
  for (let i = 0; i < G.n; i++) {
    const ln = lines[ch.scroll + i];
    if (!ln) break;
    const col = ch.disabled && ch.disabled.has(ln.opt) ? COL.optDisabled : ln.opt === ch.hover ? COL.optHover : COL.opt;
    if (G.big && ln.opt === ch.hover) rect(g, 2, G.y + i * G.h + 1, 298, G.h - 1, '#1c1834');
    drawText(g, ln.text, L.optX, G.y + i * G.h + G.dy, col);
  }
  if (ch.maxScroll > 0) {
    arrow(g, 304, 146, 13, 24, true, ch.scroll > 0, false);
    arrow(g, 304, 173, 13, 24, false, ch.scroll < ch.maxScroll, false);
  }
}
export function hoverChoice(game, x, y) {
  const ch = game.choice; if (!ch) return;
  const lines = choiceLayout(game);
  const G = optGeom(game);
  ch.hover = -1;
  if (y < G.y || x > 300) return;
  const li = G.big ? Math.floor((y - G.y) / G.h) : Math.floor((y - G.y - 2) / G.h);
  if (li < 0 || li >= G.n) return;
  const ln = lines[(ch.scroll || 0) + li];
  if (ln && !(ch.disabled && ch.disabled.has(ln.opt))) ch.hover = ln.opt;
}
export function choiceClick(game, x, y) {
  const ch = game.choice; if (!ch) return;
  if (ch.maxScroll > 0 && x >= 304) {
    if (y < 172) ch.scroll = Math.max(0, ch.scroll - 1); else ch.scroll = Math.min(ch.maxScroll, ch.scroll + 1);
    return;
  }
  hoverChoice(game, x, y);
  if (ch.hover >= 0) { game.audio.sfx('select'); ch.resolve(ch.hover); }
}
/** Virtual coords of the centre of option i (for automated tests). */
export function optionPos(game, i) {
  const ch = game.choice; if (!ch) return null;
  const lines = choiceLayout(game);
  const G = optGeom(game);
  const li = lines.findIndex(l => l.opt === i);
  if (li < 0) return null;
  if (li < ch.scroll) ch.scroll = li;
  if (li >= ch.scroll + G.n) ch.scroll = li - G.n + 1;
  ch.scroll = Math.max(0, Math.min(ch.maxScroll, ch.scroll));
  return { x: LAYOUT.optX + 10, y: G.y + (li - ch.scroll) * G.h + (G.big ? 7 : 7) };
}
export function verbPos(game, id) {
  const i = game.verbs.findIndex(v => v.id === id);
  if (i < 0) return null;
  return { x: LAYOUT.verbX[Math.floor(i / 3)] + 8, y: LAYOUT.verbY[i % 3] + 6 };
}
export function invPos(game, id) {
  const idx = game.state.inventory.indexOf(id);
  if (idx < 0) return null;
  const row = Math.floor(idx / LAYOUT.cols);
  if (row < game.ui.invScroll) game.ui.invScroll = row;
  if (row >= game.ui.invScroll + LAYOUT.rows) game.ui.invScroll = row - LAYOUT.rows + 1;
  const r = row - game.ui.invScroll, c = idx % LAYOUT.cols;
  return { x: LAYOUT.invX + c * LAYOUT.cellW + 17, y: LAYOUT.invY + r * LAYOUT.cellH + 10 };
}

// --------------------------------------------------------------- cursor
export function drawCursor(game, g) {
  const m = game.mouse;
  if (!m.inside || m.touch) return;
  if (game.mode === 'play' && game.busy && !game.choice && !game.menu) return;
  const t = game.realTime;
  const cols = ['#ffffff', '#e0e0f0', '#b8b8d8', '#9090b8', '#b8b8d8', '#e0e0f0'];
  const c = cols[Math.floor(t / 90) % cols.length];
  const x = m.x, y = m.y;
  const arm = (dx, dy) => { for (let i = 2; i <= 5; i++) { g.fillStyle = '#000'; g.fillRect(x + dx * i - (dy ? 1 : 0), y + dy * i - (dx ? 1 : 0), dy ? 3 : 1, dx ? 3 : 1); } };
  arm(1, 0); arm(-1, 0); arm(0, 1); arm(0, -1);
  g.fillStyle = c;
  for (let i = 2; i <= 5; i++) { g.fillRect(x + i, y, 1, 1); g.fillRect(x - i, y, 1, 1); g.fillRect(x, y + i, 1, 1); g.fillRect(x, y - i, 1, 1); }
  g.fillRect(x, y, 1, 1);
  void bayer;
}
