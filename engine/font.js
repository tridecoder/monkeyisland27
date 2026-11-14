// Original bitmap pixel font with full Spanish support, outlined rendering and caching.
// Glyph box is 12 rows tall:
//   rows 0-1  accents for capitals
//   rows 2-3  accents for lowercase
//   rows 3-9  cap height (7 rows), x-height rows 5-9
//   rows 10-11 descenders
// Glyph spec: array of strings ('#' = pixel). 5 rows => x-height letter, 7 rows => cap/ascender
// (or descender letter if listed in DESC), 9 rows => rows 3..11. [rows, yOffset] for explicit placement.

const DESC = new Set(['g', 'p', 'q', 'y']);

const RAW = {
  'A': ['.##.', '#..#', '#..#', '####', '#..#', '#..#', '#..#'],
  'B': ['###.', '#..#', '#..#', '###.', '#..#', '#..#', '###.'],
  'C': ['.##.', '#..#', '#...', '#...', '#...', '#..#', '.##.'],
  'D': ['###.', '#..#', '#..#', '#..#', '#..#', '#..#', '###.'],
  'E': ['####', '#...', '#...', '###.', '#...', '#...', '####'],
  'F': ['####', '#...', '#...', '###.', '#...', '#...', '#...'],
  'G': ['.##.', '#..#', '#...', '#.##', '#..#', '#..#', '.###'],
  'H': ['#..#', '#..#', '#..#', '####', '#..#', '#..#', '#..#'],
  'I': ['###', '.#.', '.#.', '.#.', '.#.', '.#.', '###'],
  'J': ['..##', '...#', '...#', '...#', '#..#', '#..#', '.##.'],
  'K': ['#..#', '#..#', '#.#.', '##..', '#.#.', '#..#', '#..#'],
  'L': ['#...', '#...', '#...', '#...', '#...', '#...', '####'],
  'M': ['#...#', '##.##', '#.#.#', '#.#.#', '#...#', '#...#', '#...#'],
  'N': ['#...#', '##..#', '#.#.#', '#.#.#', '#..##', '#...#', '#...#'],
  'O': ['.##.', '#..#', '#..#', '#..#', '#..#', '#..#', '.##.'],
  'P': ['###.', '#..#', '#..#', '###.', '#...', '#...', '#...'],
  'Q': ['.##.', '#..#', '#..#', '#..#', '#..#', '#.#.', '.#.#'],
  'R': ['###.', '#..#', '#..#', '###.', '#.#.', '#..#', '#..#'],
  'S': ['.###', '#...', '#...', '.##.', '...#', '...#', '###.'],
  'T': ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..'],
  'U': ['#..#', '#..#', '#..#', '#..#', '#..#', '#..#', '.##.'],
  'V': ['#...#', '#...#', '#...#', '.#.#.', '.#.#.', '.#.#.', '..#..'],
  'W': ['#...#', '#...#', '#...#', '#.#.#', '#.#.#', '##.##', '#...#'],
  'X': ['#...#', '#...#', '.#.#.', '..#..', '.#.#.', '#...#', '#...#'],
  'Y': ['#...#', '#...#', '.#.#.', '..#..', '..#..', '..#..', '..#..'],
  'Z': ['####', '...#', '..#.', '.#..', '#...', '#...', '####'],

  'a': ['.##.', '...#', '.###', '#..#', '.###'],
  'b': ['#...', '#...', '###.', '#..#', '#..#', '#..#', '###.'],
  'c': ['.##', '#..', '#..', '#..', '.##'],
  'd': ['...#', '...#', '.###', '#..#', '#..#', '#..#', '.###'],
  'e': ['.##.', '#..#', '####', '#...', '.##.'],
  'f': ['.##', '#..', '###', '#..', '#..', '#..', '#..'],
  'g': ['.###', '#..#', '#..#', '#..#', '.###', '...#', '.##.'],
  'h': ['#...', '#...', '###.', '#..#', '#..#', '#..#', '#..#'],
  'i': ['#', '.', '#', '#', '#', '#', '#'],
  'ı': ['#', '#', '#', '#', '#'],
  'j': [['.#', '..', '.#', '.#', '.#', '.#', '.#', '.#', '#.'], 3],
  'k': ['#...', '#...', '#..#', '#.#.', '##..', '#.#.', '#..#'],
  'l': ['#.', '#.', '#.', '#.', '#.', '#.', '.#'],
  'm': ['####.', '#.#.#', '#.#.#', '#.#.#', '#.#.#'],
  'n': ['###.', '#..#', '#..#', '#..#', '#..#'],
  'o': ['.##.', '#..#', '#..#', '#..#', '.##.'],
  'p': ['###.', '#..#', '#..#', '#..#', '###.', '#...', '#...'],
  'q': ['.###', '#..#', '#..#', '#..#', '.###', '...#', '...#'],
  'r': ['#.##', '##..', '#...', '#...', '#...'],
  's': ['.###', '#...', '.##.', '...#', '###.'],
  't': ['.#.', '.#.', '###', '.#.', '.#.', '.#.', '..#'],
  'u': ['#..#', '#..#', '#..#', '#..#', '.###'],
  'v': ['#...#', '#...#', '.#.#.', '.#.#.', '..#..'],
  'w': ['#...#', '#...#', '#.#.#', '#.#.#', '.#.#.'],
  'x': ['#..#', '#..#', '.##.', '#..#', '#..#'],
  'y': ['#..#', '#..#', '#..#', '#..#', '.###', '...#', '.##.'],
  'z': ['####', '..#.', '.#..', '#...', '####'],

  '0': ['.##.', '#..#', '#.##', '##.#', '#..#', '#..#', '.##.'],
  '1': ['.#.', '##.', '.#.', '.#.', '.#.', '.#.', '###'],
  '2': ['.##.', '#..#', '...#', '..#.', '.#..', '#...', '####'],
  '3': ['###.', '...#', '...#', '.##.', '...#', '...#', '###.'],
  '4': ['..#.', '.##.', '#.#.', '#.#.', '####', '..#.', '..#.'],
  '5': ['####', '#...', '###.', '...#', '...#', '#..#', '.##.'],
  '6': ['.##.', '#...', '#...', '###.', '#..#', '#..#', '.##.'],
  '7': ['####', '...#', '..#.', '..#.', '.#..', '.#..', '.#..'],
  '8': ['.##.', '#..#', '#..#', '.##.', '#..#', '#..#', '.##.'],
  '9': ['.##.', '#..#', '#..#', '.###', '...#', '...#', '.##.'],

  '.': [['#'], 9],
  ',': [['.#', '.#', '#.'], 9],
  ':': [['#', '.', '.', '.', '#'], 5],
  ';': [['.#', '..', '..', '..', '.#', '.#', '#.'], 5],
  '!': ['#', '#', '#', '#', '#', '.', '#'],
  '¡': [['#', '.', '#', '#', '#', '#', '#'], 5],
  '?': ['.##.', '#..#', '...#', '..#.', '.#..', '....', '.#..'],
  '¿': [['..#.', '....', '..#.', '.#..', '#...', '#..#', '.##.'], 5],
  '-': [['###'], 7],
  '—': [['#####'], 7],
  '_': [['####'], 10],
  '+': [['.#.', '###', '.#.'], 6],
  '=': [['###', '...', '###'], 6],
  '\'': [['#', '#'], 3],
  '"': [['#.#', '#.#'], 3],
  '(': ['.#', '#.', '#.', '#.', '#.', '#.', '.#'],
  ')': ['#.', '.#', '.#', '.#', '.#', '.#', '#.'],
  '[': ['##', '#.', '#.', '#.', '#.', '#.', '##'],
  ']': ['##', '.#', '.#', '.#', '.#', '.#', '##'],
  '/': ['...#', '...#', '..#.', '.##.', '.#..', '#...', '#...'],
  '*': [['#.#', '.#.', '#.#'], 4],
  '%': ['##.#', '##.#', '..#.', '.#..', '#.##', '#.##', '....'],
  '&': ['.#..', '#.#.', '#.#.', '.#..', '#.##', '#..#', '.##.'],
  '#': [['.#.#.', '#####', '.#.#.', '#####', '.#.#.'], 4],
  '@': ['.###.', '#...#', '#.###', '#.#.#', '#.###', '#....', '.###.'],
  '€': ['.###', '#...', '###.', '#...', '###.', '#...', '.###'],
  '$': [['..#..', '.####', '#.#..', '.###.', '..#.#', '####.', '..#..'], 3],
  '<': [['..#', '.#.', '#..', '.#.', '..#'], 5],
  '>': [['#..', '.#.', '..#', '.#.', '#..'], 5],
  '«': [['.#.#', '#.#.', '.#.#'], 6],
  '»': [['#.#.', '.#.#', '#.#.'], 6],
  '›': [['#..', '.#.', '#..'], 4],
  'º': [['###', '#.#', '###', '...', '###'], 3],
  'ª': [['.##', '#.#', '.##', '...', '###'], 3],
  '·': [['#'], 6],
  '|': ['#', '#', '#', '#', '#', '#', '#'],
  '✓': [['....#', '...#.', '#.#..', '.#...'], 5],
  '→': [['..#.', '####', '..#.'], 6],
  '×': [['#.#', '.#.', '#.#'], 6],
};

// Accent marks: rows of the 2-row accent box.
const ACC = {
  acute: ['.#', '#.'],
  grave: ['#.', '.#'],
  diaer: ['..', '#.#'],  // special: placed at glyph extremes
  tilde: ['.#.#', '#.#.'],
  circ: ['.#.', '#.#'],
};

const COMPOSED = {
  'á': ['a', 'acute'], 'é': ['e', 'acute'], 'í': ['ı', 'acute'], 'ó': ['o', 'acute'], 'ú': ['u', 'acute'],
  'à': ['a', 'grave'], 'è': ['e', 'grave'], 'ò': ['o', 'grave'],
  'ü': ['u', 'diaer'], 'ï': ['ı', 'diaer'], 'ñ': ['n', 'tilde'],
  'Á': ['A', 'acute'], 'É': ['E', 'acute'], 'Í': ['I', 'acute'], 'Ó': ['O', 'acute'], 'Ú': ['U', 'acute'],
  'Ü': ['U', 'diaer'], 'Ñ': ['N', 'tilde'], 'ç': ['c', null], 'Ç': ['C', null],
};

const ALIASES = { '“': '"', '”': '"', '«': '«', '’': '\'', '‘': '\'', '–': '-', '…': '...', ' ': ' ' };

export const GLYPH_H = 12;
export const LINE_H = 11;
const SPACE_W = 3;

const glyphs = new Map(); // char -> {w, px: Uint8Array(w*12)}

function makeGlyph(spec, ch) {
  let rows, y0;
  if (Array.isArray(spec) && Array.isArray(spec[0])) { rows = spec[0]; y0 = spec[1]; }
  else {
    rows = spec;
    if (rows.length === 5) y0 = 5;
    else if (rows.length === 7) y0 = DESC.has(ch) ? 5 : 3;
    else y0 = 3;
  }
  const w = Math.max(...rows.map(r => r.length));
  const px = new Uint8Array(w * GLYPH_H);
  rows.forEach((r, ry) => { for (let x = 0; x < r.length; x++) if (r[x] === '#') px[(y0 + ry) * w + x] = 1; });
  return { w, px };
}

for (const [ch, spec] of Object.entries(RAW)) glyphs.set(ch, makeGlyph(spec, ch));

for (const [ch, [base, acc]] of Object.entries(COMPOSED)) {
  const b = glyphs.get(base);
  const isCap = base === base.toUpperCase() && base !== 'ı';
  const ay = isCap ? 0 : 2;
  if (!acc) { // cedilla: add tail pixel under
    const g = { w: b.w, px: b.px.slice() };
    g.px[10 * b.w + 1] = 1;
    glyphs.set(ch, g); continue;
  }
  if (acc === 'diaer') {
    const w = Math.max(b.w, 3);
    const g = { w, px: new Uint8Array(w * GLYPH_H) };
    for (let y = 0; y < GLYPH_H; y++) for (let x = 0; x < b.w; x++) g.px[y * w + x] = b.px[y * b.w + x];
    g.px[(ay + 1) * w + 0] = 1; g.px[(ay + 1) * w + (w - 1)] = 1;
    glyphs.set(ch, g); continue;
  }
  const a = ACC[acc];
  const aw = a[0].length;
  const w = Math.max(b.w, aw);
  const g = { w, px: new Uint8Array(w * GLYPH_H) };
  const bx = Math.floor((w - b.w) / 2);
  for (let y = 0; y < GLYPH_H; y++) for (let x = 0; x < b.w; x++) g.px[y * w + x + bx] = b.px[y * b.w + x];
  const ax = Math.ceil((w - aw) / 2);
  a.forEach((r, ry) => { for (let x = 0; x < r.length; x++) if (r[x] === '#') g.px[(ay + ry) * w + ax + x] = 1; });
  glyphs.set(ch, g);
}

function glyph(ch) {
  if (ch === ' ') return null;
  return glyphs.get(ch) || glyphs.get(ch.normalize('NFD')[0]) || glyphs.get('?');
}

function normalize(text) {
  let s = String(text);
  for (const [k, v] of Object.entries(ALIASES)) if (s.includes(k)) s = s.split(k).join(v);
  return s;
}

/** Width in pixels of a single line (no outline). */
export function measure(text, opts = {}) {
  const bold = opts.bold ? 1 : 0;
  let w = 0;
  const s = normalize(text);
  for (let i = 0; i < s.length; i++) {
    const g = glyph(s[i]);
    w += g ? g.w + bold : SPACE_W;
    if (i < s.length - 1) w += 1;
  }
  return w;
}

/** Word-wrap text to lines of at most maxW pixels. '\n' forces a break. */
export function wrap(text, maxW, opts = {}) {
  const out = [];
  for (const para of normalize(text).split('\n')) {
    const words = para.split(' ');
    let line = '';
    for (const word of words) {
      const t = line ? line + ' ' + word : word;
      if (measure(t, opts) <= maxW || !line) line = t;
      else { out.push(line); line = word; }
    }
    out.push(line);
  }
  return out;
}

function parseColor(c) {
  if (!c) return null;
  if (c[0] === '#') {
    let h = c.slice(1);
    if (h.length === 3) h = h.split('').map(x => x + x).join('');
    const n = parseInt(h.slice(0, 6), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255, h.length === 8 ? parseInt(h.slice(6), 16) : 255];
  }
  return [255, 255, 255, 255];
}

const cache = new Map();
const CACHE_MAX = 600;

/**
 * Render one line of text to a canvas (cached). Returns canvas whose top-left includes a 1px
 * outline margin when outline is set.
 */
export function renderLine(text, color = '#ffffff', opts = {}) {
  const outline = opts.outline === undefined ? '#000000' : opts.outline;
  const bold = !!opts.bold;
  const shadow = opts.shadow || null;
  const key = text + '\u0001' + color + '\u0001' + outline + '\u0001' + bold + '\u0001' + shadow;
  let c = cache.get(key);
  if (c) { cache.delete(key); cache.set(key, c); return c; }
  const s = normalize(text);
  const pad = outline ? 1 : 0;
  const sh = shadow ? 1 : 0;
  const tw = Math.max(1, measure(s, { bold }));
  const W = tw + pad * 2 + sh, H = GLYPH_H + pad * 2 + sh;
  const mask = new Uint8Array(W * H);
  let x = pad;
  for (let i = 0; i < s.length; i++) {
    const g = glyph(s[i]);
    if (!g) { x += SPACE_W + 1; continue; }
    for (let gy = 0; gy < GLYPH_H; gy++) for (let gx = 0; gx < g.w; gx++) {
      if (!g.px[gy * g.w + gx]) continue;
      mask[(gy + pad) * W + x + gx] = 2;
      if (bold) mask[(gy + pad) * W + x + gx + 1] = 2;
    }
    x += g.w + (bold ? 1 : 0) + 1;
  }
  const img = new Uint8ClampedArray(W * H * 4);
  const fc = parseColor(color), oc = parseColor(outline), sc = parseColor(shadow);
  const put = (i, col) => { img[i * 4] = col[0]; img[i * 4 + 1] = col[1]; img[i * 4 + 2] = col[2]; img[i * 4 + 3] = col[3]; };
  if (sc) for (let y = 0; y < H - 1; y++) for (let xx = 0; xx < W - 1; xx++) if (mask[y * W + xx] === 2) put((y + 1) * W + xx + 1, sc);
  if (oc) {
    for (let y = 0; y < H; y++) for (let xx = 0; xx < W; xx++) {
      if (mask[y * W + xx] !== 2) continue;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const ny = y + dy, nx = xx + dx;
        if (ny < 0 || nx < 0 || ny >= H || nx >= W) continue;
        if (mask[ny * W + nx] !== 2) put(ny * W + nx, oc);
      }
    }
  }
  for (let i = 0; i < W * H; i++) if (mask[i] === 2) put(i, fc);
  c = document.createElement('canvas');
  c.width = W; c.height = H;
  c.getContext('2d').putImageData(new ImageData(img, W, H), 0, 0);
  cache.set(key, c);
  if (cache.size > CACHE_MAX) cache.delete(cache.keys().next().value);
  return c;
}

/**
 * Draw text. x,y = top-left of glyph box (outline drawn 1px outside).
 * opts: { outline: color|null (default black), bold, align: 'left'|'center'|'right', scale: int, shadow: color }
 * Returns the drawn width.
 */
export function drawText(ctx, text, x, y, color = '#ffffff', opts = {}) {
  const c = renderLine(text, color, opts);
  const scale = opts.scale || 1;
  const pad = (opts.outline === null ? 0 : 1);
  const w = (c.width) * scale;
  let dx = x - pad * scale;
  if (opts.align === 'center') dx = Math.round(x - w / 2);
  else if (opts.align === 'right') dx = x - w + pad * scale;
  ctx.drawImage(c, Math.round(dx), Math.round(y - pad * scale), c.width * scale, c.height * scale);
  return w;
}

/** Draw multiple lines centered at cx with top y. */
export function drawLines(ctx, lines, cx, y, color, opts = {}) {
  const lh = opts.lineHeight || LINE_H;
  lines.forEach((l, i) => drawText(ctx, l, cx, y + i * lh, color, { ...opts, align: opts.align || 'center' }));
}

export const font = { measure, wrap, drawText, drawLines, renderLine, LINE_H, GLYPH_H };
