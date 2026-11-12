// Procedural pixel-art drawing helpers: palette, dithering, gradients, primitives and props.
// All helpers draw with integer fillRect calls (no anti-aliasing). Coordinates are in room pixels.
import { drawText, measure } from './font.js';

// ---------------------------------------------------------------- palette
// Ramps go dark -> light. Use ramp[i] indices; keep a room to 3-5 ramps for coherence.
export const PAL = {
  ink: ['#08060e', '#120e1c', '#1c1729', '#272036'],
  night: ['#121630', '#1b2244', '#26305c', '#344478', '#4a5e98', '#6a82b8', '#96acd6', '#c4d2ec'],
  dusk: ['#24152f', '#3e1f48', '#5e2a5a', '#873a64', '#b25060', '#d87462', '#eea46c', '#f8d290'],
  wood: ['#1e100b', '#331c12', '#4e2c1a', '#6c3e22', '#8c552c', '#ad713c', '#cc9354', '#e6b878'],
  green: ['#141f1a', '#1f3127', '#2c4535', '#3b5a45', '#4f7358', '#6a8f6e', '#8eaf8c', '#b7cfae'],
  teal: ['#0e2024', '#163236', '#20474a', '#2d5f60', '#3f7b78', '#5a9a92', '#80bab0', '#b0dad0'],
  paper: ['#4e463c', '#6e6454', '#92856e', '#b4a68a', '#d2c6a8', '#e8dfc6', '#f6f1e2', '#fffcf4'],
  metal: ['#1a1b22', '#2a2c36', '#3e414c', '#565a66', '#727682', '#9296a0', '#b6b9c0', '#dcdee2'],
  red: ['#260a10', '#441216', '#6a1c1c', '#952a24', '#bd4230', '#dc6a46', '#f09a6a'],
  leaf: ['#0b1c10', '#123018', '#1a4520', '#265e2a', '#367a32', '#4e963c', '#74b44e', '#a2d06c'],
  skin: ['#3e2318', '#653a26', '#8c5436', '#b5734c', '#d69468', '#ecb88c', '#f8d8b4'],
  gold: ['#3a2408', '#664414', '#94681c', '#c09028', '#e0b844', '#f6dc7a', '#fff4b8'],
  crt: ['#06140a', '#0e3018', '#185626', '#268a3a', '#4cc060', '#9cf0a4', '#e0ffe4'],
  blue: ['#0c1430', '#14224e', '#1e3672', '#2c5098', '#406ebc', '#6292d4', '#90b8e8', '#c8def6'],
  purple: ['#160e22', '#251838', '#382450', '#4e346a', '#684a88', '#8868a8', '#ae90c8'],
  black: '#08060e',
  white: '#fffcf4',
  light: '#fff4c8',
  shadow: '#08060e',
};

// ---------------------------------------------------------------- colour utils
export function hexToRgb(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
export function rgbToHex(r, g, b) {
  const c = v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
  return '#' + c(r) + c(g) + c(b);
}
/** Mix two hex colours (t=0 -> a, t=1 -> b). */
export function mix(a, b, t) {
  const A = hexToRgb(a), B = hexToRgb(b);
  return rgbToHex(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t);
}
/** Darken (amt<0) toward cool purple or lighten (amt>0) toward warm light. amt in -1..1 */
export function shade(hex, amt) {
  if (amt < 0) return mix(hex, '#100a1c', Math.min(1, -amt));
  return mix(hex, '#fff6dc', Math.min(1, amt));
}
/** 3-step ramp [dark, base, light] from a base colour. */
export function ramp3(hex) { return [shade(hex, -0.32), hex, shade(hex, 0.22)]; }

// ---------------------------------------------------------------- random
/** Deterministic PRNG. rng(seed)() -> [0,1) */
export function rng(seed = 1) {
  let s = (seed >>> 0) || 1;
  return () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
}
export function hash2(x, y, seed = 0) {
  let h = (x * 374761393 + y * 668265263 + seed * 2147483647) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

// ---------------------------------------------------------------- dithering
export const BAYER4 = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
/** Threshold in [0,1) for absolute pixel position (patterns align across shapes). */
export function bayer(x, y) { return (BAYER4[y & 3][x & 3] + 0.5) / 16; }
/** Pick colour from a ramp at position t (0..1) with ordered dithering between steps. */
export function ditherPick(x, y, ramp, t) {
  const n = ramp.length - 1;
  const p = Math.max(0, Math.min(1, t)) * n;
  const i = Math.floor(p);
  if (i >= n) return ramp[n];
  return bayer(x, y) < p - i ? ramp[i + 1] : ramp[i];
}

// ---------------------------------------------------------------- primitives
export function px(ctx, x, y, c) { ctx.fillStyle = c; ctx.fillRect(x | 0, y | 0, 1, 1); }
export function rect(ctx, x, y, w, h, c) {
  if (w <= 0 || h <= 0) return;
  ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}
export function hline(ctx, x, y, w, c) { rect(ctx, x, y, w, 1, c); }
export function vline(ctx, x, y, h, c) { rect(ctx, x, y, 1, h, c); }
/** Outline rectangle (1px). */
export function frameRect(ctx, x, y, w, h, c) { hline(ctx, x, y, w, c); hline(ctx, x, y + h - 1, w, c); vline(ctx, x, y, h, c); vline(ctx, x + w - 1, y, h, c); }
/** Bresenham line. */
export function line(ctx, x0, y0, x1, y1, c, thick = 1) {
  x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
  const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  ctx.fillStyle = c;
  for (let guard = 0; guard < 4000; guard++) {
    ctx.fillRect(x0, y0, thick, thick);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) { err += dy; x0 += sx; }
    if (e2 <= dx) { err += dx; y0 += sy; }
  }
}

/** Paint pixels of a region using fn(x,y) -> colour|null, batching horizontal runs. */
export function paint(ctx, x, y, w, h, fn) {
  x = Math.round(x); y = Math.round(y);
  for (let yy = y; yy < y + h; yy++) {
    let run = 0, runC = null, runX = x;
    for (let xx = x; xx <= x + w; xx++) {
      const c = xx < x + w ? fn(xx, yy) : undefined;
      if (c !== runC) {
        if (runC) { ctx.fillStyle = runC; ctx.fillRect(runX, yy, run, 1); }
        runC = c; run = 1; runX = xx;
      } else run++;
    }
  }
}

/** Two-colour ordered dither fill; t = share of c2 (0..1). */
export function dither(ctx, x, y, w, h, c1, c2, t = 0.5) {
  paint(ctx, x, y, w, h, (xx, yy) => (bayer(xx, yy) < t ? c2 : c1));
}
/** Overlay colour c on existing pixels at density t (0..1) — dithered shadow / light. */
export function ditherOverlay(ctx, x, y, w, h, c, t = 0.5) {
  if (t <= 0) return;
  paint(ctx, x, y, w, h, (xx, yy) => (bayer(xx, yy) < t ? c : null));
}
/** Translucent glaze (smooth VGA-style tint). */
export function glaze(ctx, x, y, w, h, c, alpha = 0.3) {
  ctx.save(); ctx.globalAlpha = alpha; rect(ctx, x, y, w, h, c); ctx.restore();
}
/** Vertical dithered gradient across a ramp (top = ramp[0] unless reverse). */
export function gradV(ctx, x, y, w, h, colors, reverse = false) {
  const cs = reverse ? [...colors].reverse() : colors;
  paint(ctx, x, y, w, h, (xx, yy) => ditherPick(xx, yy, cs, h <= 1 ? 0 : (yy - y) / (h - 1)));
}
/** Horizontal dithered gradient. */
export function gradH(ctx, x, y, w, h, colors, reverse = false) {
  const cs = reverse ? [...colors].reverse() : colors;
  paint(ctx, x, y, w, h, (xx, yy) => ditherPick(xx, yy, cs, w <= 1 ? 0 : (xx - x) / (w - 1)));
}
/** Speckle noise texture: colour c on ~density of pixels (deterministic). */
export function noise(ctx, x, y, w, h, c, density = 0.08, seed = 7) {
  paint(ctx, x, y, w, h, (xx, yy) => (hash2(xx, yy, seed) < density ? c : null));
}

/** Scanline polygon fill. fill = colour string or fn(x,y)->colour|null. pts = [[x,y],...] */
export function poly(ctx, pts, fill) {
  if (!pts || pts.length < 3) return;
  const ys = pts.map(p => p[1]);
  const y0 = Math.floor(Math.min(...ys)), y1 = Math.ceil(Math.max(...ys));
  const fn = typeof fill === 'function' ? fill : null;
  for (let y = y0; y < y1; y++) {
    const sy = y + 0.5, xs = [];
    for (let i = 0; i < pts.length; i++) {
      const [ax, ay] = pts[i], [bx, by] = pts[(i + 1) % pts.length];
      if ((ay <= sy && by > sy) || (by <= sy && ay > sy)) xs.push(ax + (sy - ay) / (by - ay) * (bx - ax));
    }
    xs.sort((a, b) => a - b);
    for (let i = 0; i + 1 < xs.length; i += 2) {
      const xa = Math.round(xs[i]), xb = Math.round(xs[i + 1]);
      if (xb <= xa) continue;
      if (fn) paint(ctx, xa, y, xb - xa, 1, fn);
      else { ctx.fillStyle = fill; ctx.fillRect(xa, y, xb - xa, 1); }
    }
  }
}
/** Filled ellipse. fill = colour or fn(x,y,d) with d = normalized distance 0..1 from centre. */
export function ellipse(ctx, cx, cy, rx, ry, fill) {
  const fn = typeof fill === 'function' ? fill : null;
  for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) {
    const dy = (y + 0.5 - cy) / ry;
    if (Math.abs(dy) > 1) continue;
    const hw = rx * Math.sqrt(1 - dy * dy);
    const xa = Math.round(cx - hw), xb = Math.round(cx + hw);
    if (xb <= xa) continue;
    if (fn) paint(ctx, xa, y, xb - xa, 1, (xx, yy) => fn(xx, yy, Math.hypot((xx + 0.5 - cx) / rx, (yy + 0.5 - cy) / ry)));
    else { ctx.fillStyle = fill; ctx.fillRect(xa, y, xb - xa, 1); }
  }
}
/** Dithered soft shadow ellipse (on floor under props/actors). */
export function shadowEllipse(ctx, cx, cy, rx, ry, strength = 0.6, c = PAL.shadow) {
  ellipse(ctx, cx, cy, rx, ry, (x, y, d) => (bayer(x, y) < strength * (1 - d * d) * 1.4 ? c : null));
}
/** Dithered light pool (lamp light on floor/wall). */
export function lightPool(ctx, cx, cy, rx, ry, c = PAL.light, strength = 0.5) {
  ellipse(ctx, cx, cy, rx, ry, (x, y, d) => (bayer(x, y) < strength * (1 - d) ? c : null));
}
/** Trapezoid light cone from (x, y): top width tw, bottom width bw, height h (banded translucent). */
export function lightCone(ctx, x, y, tw, bw, h, c = PAL.light, strength = 0.35) {
  ctx.save();
  const bands = 4;
  for (let b = 0; b < bands; b++) {
    const k = 1 - b / bands;
    ctx.globalAlpha = strength / bands;
    poly(ctx, [[x - tw / 2 * k, y], [x + tw / 2 * k, y], [x + bw / 2 * k, y + h], [x - bw / 2 * k, y + h]], c);
  }
  ctx.restore();
}
/** Banded translucent glow (VGA-style smooth light): nested ellipses, centre alpha = alpha. */
export function glow(ctx, cx, cy, rx, ry, c = PAL.light, alpha = 0.3, bands = 5) {
  ctx.save();
  ctx.globalAlpha = alpha / bands;
  for (let i = bands; i >= 1; i--) ellipse(ctx, cx, cy, rx * i / bands, ry * i / bands, c);
  ctx.restore();
}
/** Darken edges of the region with banded translucent rings (vignette). */
export function vignette(ctx, w, h, strength = 0.5, c = PAL.shadow, x0 = 0, y0 = 0) {
  ctx.save();
  const n = 6, step = Math.max(2, Math.round(Math.min(w, h) / 22));
  ctx.fillStyle = c;
  for (let k = 0; k < n; k++) {
    ctx.globalAlpha = strength * 0.22 * (1 - k / n);
    const i = k * step;
    ctx.fillRect(x0, y0, w, step + i);           // top
    ctx.fillRect(x0, y0 + h - step - i, w, step + i); // bottom
    ctx.fillRect(x0, y0, step + i, h);           // left
    ctx.fillRect(x0 + w - step - i, y0, step + i, h); // right
  }
  ctx.restore();
}
/** Smooth vertical darkening (alpha per row band) — e.g. fade the far floor. */
export function fadeRows(ctx, x, y, w, h, c, alphaTop = 0.5, alphaBottom = 0, bands = 8) {
  ctx.save(); ctx.fillStyle = c;
  const bh = Math.ceil(h / bands);
  for (let i = 0; i < bands; i++) { ctx.globalAlpha = alphaTop + (alphaBottom - alphaTop) * (i / (bands - 1 || 1)); ctx.fillRect(x, y + i * bh, w, Math.min(bh, h - i * bh)); }
  ctx.restore();
}
/** Bevelled box: fill with light top/left edge and dark bottom/right edge. */
export function bevel(ctx, x, y, w, h, base, light, dark) {
  rect(ctx, x, y, w, h, base);
  hline(ctx, x, y, w, light || shade(base, 0.25)); vline(ctx, x, y, h, light || shade(base, 0.25));
  hline(ctx, x, y + h - 1, w, dark || shade(base, -0.35)); vline(ctx, x + w - 1, y, h, dark || shade(base, -0.35));
}
/** Small pixel text helper (uses engine font). */
export function label(ctx, text, x, y, color = PAL.ink[0], opts = {}) {
  return drawText(ctx, text, x, y, color, { outline: null, ...opts });
}
export { measure as measureText };

// ---------------------------------------------------------------- architecture
/** Wall with vertical dithered gradient + subtle grain. ramp dark->light; top is lighter by default. */
export function wall(ctx, x, y, w, h, ramp = PAL.green.slice(2, 6), opts = {}) {
  gradV(ctx, x, y, w, h, opts.topDark ? ramp : [...ramp].reverse());
  noise(ctx, x, y, w, h, shade(ramp[0], -0.1), opts.grain ?? 0.04, opts.seed || 3);
}
/** Wood wainscot / lower wall panelling with rail. */
export function wainscot(ctx, x, y, w, h, ramp = PAL.wood, opts = {}) {
  const panel = opts.panel || 24;
  gradV(ctx, x, y, w, h, [ramp[4], ramp[3], ramp[2]]);
  for (let px0 = x; px0 < x + w; px0 += panel) {
    vline(ctx, px0, y + 3, h - 4, ramp[1]);
    vline(ctx, px0 + 1, y + 3, h - 4, ramp[5]);
    frameRect(ctx, px0 + 4, y + 6, panel - 7, h - 11, ramp[2]);
    hline(ctx, px0 + 5, y + h - 6, panel - 8, ramp[4]);
  }
  hline(ctx, x, y, w, ramp[6]); hline(ctx, x, y + 1, w, ramp[5]); hline(ctx, x, y + 2, w, ramp[2]);
}
/** Skirting board along the wall/floor seam. */
export function baseboard(ctx, x, y, w, h = 4, ramp = PAL.wood) {
  rect(ctx, x, y, w, h, ramp[2]); hline(ctx, x, y, w, ramp[4]); hline(ctx, x, y + h - 1, w, ramp[0]);
}
/** Perspective tiled floor (checker). y..y+h is the floor; tiles converge to (vpx, vpy). */
export function floorTiles(ctx, o) {
  const { x = 0, y, w, h, vpx = x + w / 2, vpy = y - 60, tile = 24, rowPx = 9 } = o;
  const colors = o.colors || [PAL.paper[3], PAL.paper[1]];
  const grout = o.grout || shade(colors[1], -0.3);
  const far = o.far || PAL.ink[1];
  const H0 = y + h - vpy;
  const tileD = rowPx * tile / H0;
  paint(ctx, x, y, w, h, (px0, py) => {
    const d = py + 0.5 - vpy;
    const Z = H0 * tile / d;
    const wx = (px0 + 0.5 - vpx) * (Z / tile);
    const r = Z / tileD, c = wx / tile;
    const fr = r - Math.floor(r), fc = c - Math.floor(c);
    const lineW = 0.05 * (H0 / d);
    let col = ((Math.floor(r) + Math.floor(c)) & 1) ? colors[1] : colors[0];
    if (o.colors3 && hash2(Math.floor(r), Math.floor(c), 9) < 0.12) col = o.colors3;
    if (fr * tileD * d * d / (H0 * tile) < 0.9 || fc * tile * tile / Z < 0.9) col = grout;
    return col;
  });
  fadeRows(ctx, x, y, w, Math.ceil(h * 0.7), far, o.fade ?? 0.45, 0, 7);
}
/** Perspective wooden plank floor. */
export function floorPlanks(ctx, o) {
  const { x = 0, y, w, h, vpx = x + w / 2, vpy = y - 80, plank = 10, ramp = PAL.wood, seed = 5 } = o;
  const H0 = y + h - vpy;
  const far = o.far || PAL.ink[1];
  paint(ctx, x, y, w, h, (px0, py) => {
    const d = py + 0.5 - vpy;
    const Z = H0 / d;
    const wx = (px0 + 0.5 - vpx) * Z;
    const c = Math.floor(wx / plank), fc = wx / plank - c;
    const len = 6 + (hash2(c, 0, seed) * 3);
    const zr = Z * 4 + hash2(c, 1, seed) * 10;
    const r = Math.floor(zr / len * 2), fr = zr / len * 2 - r;
    const v = hash2(c, r, seed);
    let col = ramp[3 + Math.floor(v * 3)];
    if (fc * plank / Z < 1) col = ramp[1];
    else if (fc * plank / Z < 2) col = ramp[Math.min(ramp.length - 1, 5 + Math.floor(v * 2))];
    else if (fr * (len / 2) * H0 / (4 * Z * Z) < 1) col = ramp[2];
    else if (hash2(Math.floor(wx * 3), Math.floor(zr * 0.5), seed + 2) < 0.05) col = ramp[3];
    return col;
  });
  fadeRows(ctx, x, y, w, Math.ceil(h * 0.7), far, o.fade ?? 0.45, 0, 7);
}
/** Ceiling strip with fluorescent light panels every `spacing` px. */
export function ceiling(ctx, x, y, w, h, opts = {}) {
  gradV(ctx, x, y, w, h, opts.ramp || [PAL.ink[2], PAL.metal[2], PAL.metal[3]]);
  const spacing = opts.spacing || 96;
  for (let lx = x + (opts.offset ?? 30); lx < x + w; lx += spacing) fluorescent(ctx, lx, y + h - 4, opts.lampW || 36, opts.on !== false);
}
/** Fluorescent tube fixture. */
export function fluorescent(ctx, x, y, w = 36, on = true) {
  rect(ctx, x - 1, y - 1, w + 2, 5, PAL.metal[2]);
  rect(ctx, x, y, w, 3, on ? '#fbfff0' : PAL.metal[4]);
  if (on) { hline(ctx, x, y + 3, w, '#dfeee0'); ditherOverlay(ctx, x - 6, y + 4, w + 12, 3, '#eef4e0', 0.25); }
}

// ---------------------------------------------------------------- windows & doors
/** Window showing a dusk/night city. opts: { sky:'dusk'|'night'|'day', blinds:bool, frame:ramp, seed, city:bool } */
export function cityWindow(ctx, x, y, w, h, opts = {}) {
  const fr = opts.frame || PAL.metal;
  const sky = opts.sky || 'dusk';
  const r = rng(opts.seed || 11);
  const skyRamp = sky === 'night' ? [PAL.night[0], PAL.night[1], PAL.night[2], PAL.night[3]]
    : sky === 'day' ? [PAL.blue[4], PAL.blue[5], PAL.blue[6], PAL.blue[7]]
      : [PAL.dusk[1], PAL.dusk[2], PAL.dusk[3], PAL.dusk[4], PAL.dusk[5], PAL.dusk[6]];
  const gy = opts.skyTop ?? (opts.worldY ?? y);
  const gh = opts.skyH ?? h;
  paint(ctx, x, y, w, h, (xx, yy) => ditherPick(xx, yy, skyRamp, (yy - gy) / gh));
  if (sky === 'night') noise(ctx, x, y, w, h * 0.5, PAL.night[6], 0.012, opts.seed || 11);
  if (opts.city !== false) {
    // far skyline
    let bx = x - 4;
    while (bx < x + w) {
      const bw = 6 + Math.floor(r() * 14), bh = Math.floor(h * (0.2 + r() * 0.35));
      rect(ctx, bx, y + h - bh, bw, bh, sky === 'day' ? PAL.blue[3] : PAL.purple[2]);
      bx += bw;
    }
    // near skyline with lit windows
    bx = x - 6;
    while (bx < x + w) {
      const bw = 10 + Math.floor(r() * 18), bh = Math.floor(h * (0.12 + r() * 0.4));
      const top = y + h - bh;
      rect(ctx, bx, top, bw, bh, sky === 'day' ? PAL.blue[2] : PAL.ink[2]);
      hline(ctx, bx, top, bw, sky === 'day' ? PAL.blue[4] : PAL.purple[3]);
      if (r() < 0.3) { vline(ctx, bx + (bw >> 1), top - 5, 5, PAL.ink[1]); px(ctx, bx + (bw >> 1), top - 6, '#ff6060'); }
      for (let wy = top + 3; wy < y + h - 1; wy += 3) for (let wx = bx + 2; wx < bx + bw - 1; wx += 3) {
        if (wx < x || wx >= x + w) continue;
        if (r() < (sky === 'day' ? 0.15 : 0.35)) px(ctx, wx, wy, r() < 0.5 ? PAL.gold[5] : PAL.gold[4]);
      }
      bx += bw + Math.floor(r() * 3);
    }
  }
  // glass reflection: two soft diagonal bands
  ctx.save();
  ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  for (let i = 0; i < 2; i++) {
    const sx = x + Math.floor(w * (0.12 + i * 0.5)), bw = i ? 4 : 7;
    ctx.globalAlpha = 0.07;
    poly(ctx, [[sx, y + h], [sx + bw, y + h], [sx + bw + h * 0.6, y], [sx + h * 0.6, y]], '#ffffff');
  }
  ctx.restore();
  if (opts.blinds) {
    for (let by = y + 1; by < y + (opts.blindsDown ?? h); by += 4) { hline(ctx, x, by, w, PAL.paper[4]); hline(ctx, x, by + 1, w, PAL.paper[2]); }
    vline(ctx, x + (w >> 2), y, opts.blindsDown ?? h, PAL.paper[1]);
  }
  // frame
  frameRect(ctx, x - 1, y - 1, w + 2, h + 2, fr[1]);
  frameRect(ctx, x - 2, y - 2, w + 4, h + 4, fr[4]);
  frameRect(ctx, x - 3, y - 3, w + 6, h + 6, fr[2]);
  if (opts.mullions !== false) {
    const mx = x + (w >> 1);
    rect(ctx, mx - 1, y, 2, h, fr[3]); vline(ctx, mx - 1, y, h, fr[5]);
    if (h > 40) { rect(ctx, x, y + (h >> 1) - 1, w, 2, fr[3]); hline(ctx, x, y + (h >> 1) - 1, w, fr[5]); }
  }
  // sill
  rect(ctx, x - 5, y + h + 2, w + 10, 3, fr[5]); hline(ctx, x - 5, y + h + 2, w + 10, fr[6]); hline(ctx, x - 5, y + h + 5, w + 10, fr[1]);
}
/** Door. opts: { color ramp, glass:bool, sign:'TEXT', open:bool, knob:'left'|'right', frame ramp } */
export function door(ctx, x, y, w, h, opts = {}) {
  const rp = opts.ramp || PAL.wood;
  const fr = opts.frame || PAL.wood;
  rect(ctx, x - 3, y - 3, w + 6, h + 3, fr[1]);
  rect(ctx, x - 2, y - 2, w + 4, h + 2, fr[3]); vline(ctx, x - 2, y - 2, h + 2, fr[5]); hline(ctx, x - 2, y - 2, w + 4, fr[5]);
  if (opts.open) {
    gradV(ctx, x, y, w, h, [PAL.ink[0], PAL.ink[1], PAL.ink[2]]);
    if (opts.inside) lightPool(ctx, x + w / 2, y + h - 4, w / 2, 6, PAL.gold[4], 0.4);
    // open door leaf seen edge-on
    const lx = opts.knob === 'left' ? x + w - 4 : x;
    rect(ctx, lx, y, 4, h, rp[2]); vline(ctx, lx, y, h, rp[4]);
    return;
  }
  gradH(ctx, x, y, w, h, [rp[5], rp[4], rp[3]]);
  // panels
  const glassH = opts.glass ? Math.floor(h * 0.38) : 0;
  if (opts.glass) {
    const gx = x + 4, gy = y + 5, gw = w - 8;
    rect(ctx, gx - 1, gy - 1, gw + 2, glassH + 2, rp[1]);
    paint(ctx, gx, gy, gw, glassH, (xx, yy) => ditherPick(xx, yy, opts.glassRamp || [PAL.teal[3], PAL.teal[5], PAL.teal[6], PAL.paper[5]], 0.3 + 0.5 * ((xx - gx) / gw) * 0.6 + (yy - gy) / glassH * 0.2));
    noise(ctx, gx, gy, gw, glassH, PAL.teal[7], 0.07, 4);
    if (opts.sign) {
      const tw = measure(opts.sign);
      label(ctx, opts.sign, gx + ((gw - tw) >> 1), gy + ((glassH - 12) >> 1) + 1, opts.signColor || PAL.ink[1]);
    }
  } else if (opts.sign) {
    const tw = measure(opts.sign) + 6;
    const sx = x + ((w - tw) >> 1);
    bevel(ctx, sx, y + 8, tw, 12, PAL.gold[4], PAL.gold[6], PAL.gold[2]);
    label(ctx, opts.sign, sx + 3, y + 7, PAL.ink[1]);
  }
  const py0 = y + glassH + (opts.glass ? 10 : 6);
  const ph = (y + h - 5 - py0);
  if (ph > 8) {
    frameRect(ctx, x + 4, py0, w - 8, ph, rp[2]);
    hline(ctx, x + 5, py0 + ph - 1, w - 9, rp[6]); vline(ctx, x + w - 5, py0, ph, rp[6]);
  }
  const kx = opts.knob === 'left' ? x + 3 : x + w - 5;
  const ky = y + Math.floor(h * 0.55);
  rect(ctx, kx, ky, 2, 3, PAL.gold[3]); px(ctx, kx, ky, PAL.gold[6]); px(ctx, kx + 1, ky + 2, PAL.gold[1]);
  vline(ctx, x + w - 1, y, h, rp[1]);
}

// ---------------------------------------------------------------- furniture & props
/** Desk seen from the front-above. top surface depth `depth` px. Returns {topY} for placing items. */
export function desk(ctx, x, y, w, h, opts = {}) {
  const rp = opts.ramp || PAL.wood;
  const depth = opts.depth ?? 8;
  shadowEllipse(ctx, x + w / 2, y + h, w / 2 + 6, 5, 0.7);
  // top
  poly(ctx, [[x + 3, y], [x + w - 3, y], [x + w, y + depth], [x, y + depth]], (xx, yy) => ditherPick(xx, yy, [rp[5], rp[6]], 0.3 + (yy - y) / depth * 0.6));
  hline(ctx, x, y + depth, w, rp[7]);
  // front
  const fy = y + depth + 1;
  gradV(ctx, x, fy, w, h - depth - 1, [rp[4], rp[3], rp[2]]);
  hline(ctx, x, fy, w, rp[2]);
  if (opts.drawers !== false) {
    const dw = Math.floor(w * 0.32);
    for (const dx0 of opts.drawersBoth ? [x + 3, x + w - dw - 3] : [x + w - dw - 3]) {
      const n = 3, dh = Math.floor((h - depth - 6) / n);
      for (let i = 0; i < n; i++) {
        const dy = fy + 2 + i * dh;
        bevel(ctx, dx0, dy, dw, dh - 1, rp[4], rp[5], rp[1]);
        rect(ctx, dx0 + (dw >> 1) - 3, dy + (dh >> 1) - 1, 6, 1, PAL.gold[3]);
      }
    }
    // knee hole
    if (opts.kneeHole !== false && !opts.drawersBoth) gradV(ctx, x + 6, fy + 3, w - dw - 14, h - depth - 4, [rp[1], rp[0]]);
  }
  vline(ctx, x, fy, h - depth - 1, rp[5]); vline(ctx, x + w - 1, fy, h - depth - 1, rp[1]);
  return { topY: y + Math.floor(depth / 2) };
}
/** Beige CRT monitor (approx 24x20) with keyboard. opts.on, opts.screen 'text'|'blue'|'off', opts.t */
export function monitor(ctx, x, y, opts = {}) {
  const b = [PAL.paper[1], PAL.paper[2], PAL.paper[3], PAL.paper[4], PAL.paper[5]];
  const w = opts.w || 24, h = opts.h || 19;
  rect(ctx, x + 4, y + h, w - 8, 3, b[1]); rect(ctx, x + 2, y + h + 2, w - 4, 2, b[2]);
  bevel(ctx, x, y, w, h, b[3], b[4], b[0]);
  const sx = x + 3, sy = y + 3, sw = w - 6, sh = h - 7;
  rect(ctx, sx - 1, sy - 1, sw + 2, sh + 2, PAL.ink[1]);
  if (opts.on === false) {
    gradV(ctx, sx, sy, sw, sh, [PAL.metal[2], PAL.metal[1]]);
    px(ctx, sx + 1, sy + 1, PAL.metal[4]);
  } else if (opts.screen === 'blue') {
    gradV(ctx, sx, sy, sw, sh, [PAL.blue[4], PAL.blue[3]]);
    for (let ly = sy + 1; ly < sy + sh - 1; ly += 2) hline(ctx, sx + 1, ly, Math.floor(sw * (0.4 + hash2(ly, x) * 0.5)), PAL.blue[7]);
  } else {
    gradV(ctx, sx, sy, sw, sh, [PAL.crt[1], PAL.crt[0]]);
    for (let ly = sy + 1; ly < sy + sh - 1; ly += 2) hline(ctx, sx + 1, ly, Math.floor((sw - 2) * (0.3 + hash2(ly, x + 3) * 0.7)), PAL.crt[4]);
    if (opts.cursor !== false && ((opts.t || 0) % 1000) < 500) rect(ctx, sx + 1, sy + sh - 2, 2, 1, PAL.crt[6]);
  }
  ditherOverlay(ctx, sx, sy, sw, 2, '#ffffff', 0.12);
  rect(ctx, x + w - 5, y + h - 3, 2, 1, opts.on === false ? PAL.metal[3] : PAL.crt[5]);
  hline(ctx, x + 3, y + h - 3, 8, b[1]);
  if (opts.keyboard !== false) {
    const kx = x - 2 + (opts.kbdX || 0), ky = y + h + 4;
    poly(ctx, [[kx + 2, ky], [kx + w + 2, ky], [kx + w + 4, ky + 4], [kx, ky + 4]], b[3]);
    for (let i = 0; i < w; i += 2) px(ctx, kx + 2 + i, ky + 1, b[1]);
    for (let i = 1; i < w; i += 2) px(ctx, kx + 2 + i, ky + 2, b[1]);
    hline(ctx, kx, ky + 4, w + 4, b[0]);
  }
}
/** Potted plant. size ~ height in px. */
export function plant(ctx, x, y, opts = {}) {
  const size = opts.size || 28;
  const r = rng(opts.seed || 3);
  const potW = opts.potW || Math.max(8, Math.round(size * 0.42)), potH = Math.round(potW * 0.9);
  const lr = opts.leaf || PAL.leaf;
  const pr = opts.pot || PAL.red;
  shadowEllipse(ctx, x, y, potW * 0.8, 3, 0.7);
  // leaves
  const n = opts.leaves || 14;
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (r() - 0.5) * 2.6;
    const len = size * (0.45 + r() * 0.55);
    const bx = x, by = y - potH;
    const steps = Math.ceil(len);
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      const droop = t * t * len * 0.35;
      const lx = bx + Math.cos(a) * len * t, ly = by + Math.sin(a) * len * t + droop;
      const wdt = Math.max(1, Math.round(Math.sin(t * Math.PI) * 2.2));
      const lit = Math.cos(a) < 0 ? 2 : 0;
      const ci = Math.min(lr.length - 1, 2 + Math.floor(t * 3) + lit);
      rect(ctx, Math.round(lx - wdt / 2), Math.round(ly), wdt, 1, lr[ci]);
      if (wdt > 1) px(ctx, Math.round(lx + wdt / 2 - 1), Math.round(ly), lr[Math.max(0, ci - 2)]);
    }
  }
  // pot
  const px0 = x - (potW >> 1);
  poly(ctx, [[px0, y - potH], [px0 + potW, y - potH], [px0 + potW - 2, y], [px0 + 2, y]], (xx, yy) => ditherPick(xx, yy, [pr[5], pr[4], pr[3], pr[2]], (xx - px0) / potW));
  rect(ctx, px0 - 1, y - potH - 2, potW + 2, 3, pr[4]); hline(ctx, px0 - 1, y - potH - 2, potW + 2, pr[6]); hline(ctx, px0, y - potH, potW, pr[2]);
}
/** Bookshelf with random books. */
export function bookshelf(ctx, x, y, w, h, opts = {}) {
  const rp = opts.ramp || PAL.wood;
  const r = rng(opts.seed || 9);
  const shelves = opts.shelves || Math.max(2, Math.floor(h / 16));
  rect(ctx, x, y, w, h, rp[2]);
  frameRect(ctx, x, y, w, h, rp[1]); vline(ctx, x + 1, y + 1, h - 2, rp[4]);
  const sh = (h - 4) / shelves;
  const bookCols = [PAL.red[3], PAL.red[4], PAL.blue[3], PAL.blue[4], PAL.green[4], PAL.gold[3], PAL.paper[4], PAL.purple[4], PAL.teal[4], PAL.wood[5]];
  for (let s = 0; s < shelves; s++) {
    const sy = Math.round(y + 2 + s * sh), sb = Math.round(y + 2 + (s + 1) * sh) - 2;
    gradV(ctx, x + 2, sy, w - 4, sb - sy, [rp[0], rp[1]]);
    let bx = x + 3;
    while (bx < x + w - 4) {
      if (r() < 0.08) { bx += 3; continue; }
      const bw = 2 + Math.floor(r() * 3), bh = Math.floor((sb - sy) * (0.6 + r() * 0.38));
      if (bx + bw > x + w - 3) break;
      const c = bookCols[Math.floor(r() * bookCols.length)];
      rect(ctx, bx, sb - bh, bw, bh, c); vline(ctx, bx, sb - bh, bh, shade(c, 0.2)); vline(ctx, bx + bw - 1, sb - bh, bh, shade(c, -0.35));
      if (bh > 6 && r() < 0.6) hline(ctx, bx, sb - bh + 2, bw, PAL.gold[4]);
      bx += bw;
    }
    rect(ctx, x + 1, sb, w - 2, 2, rp[4]); hline(ctx, x + 1, sb, w - 2, rp[6]);
  }
}
/** Metal filing cabinet. opts.drawers, opts.open (index of open drawer or -1). */
export function filingCabinet(ctx, x, y, w, h, opts = {}) {
  const m = opts.ramp || PAL.metal;
  shadowEllipse(ctx, x + w / 2, y + h, w / 2 + 3, 3, 0.7);
  gradH(ctx, x, y, w, h, [m[5], m[4], m[3]]);
  frameRect(ctx, x, y, w, h, m[1]);
  hline(ctx, x + 1, y + 1, w - 2, m[6]);
  const n = opts.drawers || 3, dh = Math.floor((h - 4) / n);
  for (let i = 0; i < n; i++) {
    const dy = y + 2 + i * dh;
    if (opts.open === i) {
      rect(ctx, x + 2, dy, w - 4, dh - 1, PAL.ink[1]);
      // pulled drawer (front-down perspective)
      rect(ctx, x - 1, dy + 3, w + 2, dh + 2, m[4]); frameRect(ctx, x - 1, dy + 3, w + 2, dh + 2, m[1]);
      for (let f = 0; f < 4; f++) rect(ctx, x + 2 + f * ((w - 4) / 4 | 0), dy, 3, 4, [PAL.paper[5], PAL.gold[4], PAL.paper[4], PAL.teal[5]][f]);
      rect(ctx, x + (w >> 1) - 3, dy + 6, 6, 2, m[1]);
      continue;
    }
    bevel(ctx, x + 2, dy, w - 4, dh - 1, m[4], m[6], m[2]);
    rect(ctx, x + (w >> 1) - 4, dy + 3, 8, 2, m[1]); hline(ctx, x + (w >> 1) - 4, dy + 3, 8, m[6]);
    rect(ctx, x + (w >> 1) - 3, dy + 7, 6, 3, PAL.paper[5]);
  }
}
/** Cork notice board with pinned papers. */
export function corkboard(ctx, x, y, w, h, opts = {}) {
  const r = rng(opts.seed || 21);
  rect(ctx, x - 2, y - 2, w + 4, h + 4, PAL.wood[2]); frameRect(ctx, x - 2, y - 2, w + 4, h + 4, PAL.wood[1]);
  hline(ctx, x - 1, y - 1, w + 2, PAL.wood[5]);
  paint(ctx, x, y, w, h, (xx, yy) => { const v = hash2(xx, yy, 5); return v < 0.3 ? PAL.wood[4] : v < 0.85 ? PAL.wood[5] : PAL.wood[6]; });
  const n = opts.notes || Math.floor(w * h / 120);
  const cols = [PAL.paper[6], PAL.paper[5], PAL.gold[5], '#f4c0c8', PAL.teal[6], PAL.paper[6]];
  for (let i = 0; i < n; i++) {
    const nw = 7 + Math.floor(r() * 8), nh = 6 + Math.floor(r() * 8);
    const nx = x + 1 + Math.floor(r() * (w - nw - 2)), ny = y + 1 + Math.floor(r() * (h - nh - 2));
    const c = cols[Math.floor(r() * cols.length)];
    ditherOverlay(ctx, nx + 1, ny + 1, nw, nh, PAL.wood[1], 0.5);
    rect(ctx, nx, ny, nw, nh, c);
    for (let ly = ny + 3; ly < ny + nh - 1; ly += 2) hline(ctx, nx + 1, ly, nw - 2 - Math.floor(r() * 3), PAL.paper[2]);
    px(ctx, nx + (nw >> 1), ny + 1, [PAL.red[4], PAL.blue[5], PAL.gold[4]][i % 3]);
  }
}
/** Wall clock. time in hours (e.g. 18.5). */
export function wallClock(ctx, cx, cy, rad = 6, time = 20 + 59 / 60) {      // default: the building's clocks are stopped at 20:59
  ellipse(ctx, cx, cy, rad + 1, rad + 1, PAL.metal[1]);
  ellipse(ctx, cx, cy, rad, rad, PAL.paper[6]);
  ditherOverlay(ctx, cx, cy, rad, rad, PAL.paper[3], 0.3);
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; px(ctx, Math.round(cx + Math.cos(a) * (rad - 1.5)), Math.round(cy + Math.sin(a) * (rad - 1.5)), PAL.ink[2]); }
  const ha = ((time % 12) / 12) * Math.PI * 2 - Math.PI / 2, ma = ((time % 1)) * Math.PI * 2 - Math.PI / 2;
  line(ctx, cx, cy, cx + Math.cos(ha) * rad * 0.5, cy + Math.sin(ha) * rad * 0.5, PAL.ink[0]);
  line(ctx, cx, cy, cx + Math.cos(ma) * rad * 0.8, cy + Math.sin(ma) * rad * 0.8, PAL.ink[0]);
  px(ctx, cx, cy, PAL.red[4]);
}
/** Framed picture; inner(ctx, x, y, w, h) draws the content. */
export function framed(ctx, x, y, w, h, inner, opts = {}) {
  const fr = opts.ramp || PAL.gold;
  ditherOverlay(ctx, x + 1, y + 2, w + 1, h + 1, PAL.shadow, 0.5);
  rect(ctx, x - 2, y - 2, w + 4, h + 4, fr[2]); frameRect(ctx, x - 2, y - 2, w + 4, h + 4, fr[1]);
  hline(ctx, x - 1, y - 1, w + 2, fr[4]); vline(ctx, x - 1, y - 1, h + 2, fr[4]);
  rect(ctx, x, y, w, h, PAL.paper[5]);
  if (inner) inner(ctx, x, y, w, h);
}
/** Miniature newspaper front page (fits in any w,h >= 12). */
export function newspaperPage(ctx, x, y, w, h, opts = {}) {
  const r = rng(opts.seed || 2);
  rect(ctx, x, y, w, h, PAL.paper[5]);
  rect(ctx, x + 1, y + 1, w - 2, Math.max(2, Math.floor(h * 0.12)), PAL.ink[2]);
  const hy = y + Math.floor(h * 0.12) + 3;
  rect(ctx, x + 1, hy, w - 2, 2, PAL.ink[3]);
  const cols = Math.max(2, Math.floor(w / 6));
  const cw = (w - 2) / cols;
  if (h > 16) { rect(ctx, x + 2, hy + 4, Math.floor(w * 0.45), Math.floor(h * 0.3), PAL.paper[2]); ditherOverlay(ctx, x + 2, hy + 4, Math.floor(w * 0.45), Math.floor(h * 0.3), PAL.paper[0], 0.4); }
  for (let c = 0; c < cols; c++) for (let ly = hy + 4; ly < y + h - 1; ly += 2) {
    const lx = Math.round(x + 1 + c * cw);
    if (h > 16 && lx < x + 2 + w * 0.45 && ly < hy + 4 + h * 0.3) continue;
    hline(ctx, lx, ly, Math.max(1, Math.floor(cw - 1 - r() * 1.5)), PAL.paper[2]);
  }
  if (opts.accent) rect(ctx, x + w - 4, y + 2, 2, 2, opts.accent);
}
/** Office chair (front or side). */
export function officeChair(ctx, x, y, opts = {}) {
  const c = opts.color || PAL.blue;
  shadowEllipse(ctx, x, y, 9, 2, 0.7);
  hline(ctx, x - 6, y - 1, 13, PAL.metal[2]); px(ctx, x - 6, y, PAL.ink[1]); px(ctx, x + 6, y, PAL.ink[1]); px(ctx, x, y, PAL.ink[1]);
  vline(ctx, x, y - 7, 6, PAL.metal[3]);
  rect(ctx, x - 7, y - 10, 14, 3, c[3]); hline(ctx, x - 7, y - 10, 14, c[5]);
  if (opts.back !== false) {
    rect(ctx, x - 6, y - 24, 12, 13, c[3]); rect(ctx, x - 5, y - 23, 10, 11, c[4]); vline(ctx, x - 5, y - 23, 11, c[5]); frameRect(ctx, x - 6, y - 24, 12, 13, c[1]);
    vline(ctx, x, y - 12, 2, PAL.metal[3]);
  }
}
/** Desk lamp; returns lamp head position for light cone. */
export function deskLamp(ctx, x, y, opts = {}) {
  const c = opts.color || PAL.teal;
  rect(ctx, x - 4, y - 2, 9, 2, c[2]); hline(ctx, x - 4, y - 2, 9, c[4]);
  line(ctx, x, y - 2, x - 3, y - 10, PAL.metal[5]);
  line(ctx, x - 3, y - 10, x + 3, y - 16, PAL.metal[5]);
  poly(ctx, [[x + 1, y - 18], [x + 7, y - 17], [x + 10, y - 11], [x + 2, y - 13]], c[3]);
  line(ctx, x + 1, y - 18, x + 7, y - 17, c[5]);
  if (opts.on !== false) { hline(ctx, x + 3, y - 12, 7, PAL.light); }
  return { lx: x + 6, ly: y - 11 };
}
/** Scatter of papers on a surface. */
export function papers(ctx, x, y, w, opts = {}) {
  const r = rng(opts.seed || 5);
  for (let i = 0; i < (opts.n || 4); i++) {
    const pw = 6 + Math.floor(r() * 5), ph = 3 + Math.floor(r() * 2);
    const ppx = x + Math.floor(r() * Math.max(1, w - pw)), ppy = y + Math.floor(r() * 3);
    rect(ctx, ppx, ppy, pw, ph, i % 2 ? PAL.paper[6] : PAL.paper[5]);
    hline(ctx, ppx + 1, ppy + 1, pw - 2, PAL.paper[3]);
    hline(ctx, ppx, ppy + ph, pw, PAL.paper[2]);
  }
}
/** Wire wastepaper bin with crumpled paper. */
export function trashBin(ctx, x, y, opts = {}) {
  const w = opts.w || 10, h = opts.h || 11;
  shadowEllipse(ctx, x, y, w / 2 + 2, 2, 0.7);
  const x0 = x - (w >> 1);
  if (opts.full !== false) { ellipse(ctx, x - 1, y - h, 3, 2, PAL.paper[6]); ellipse(ctx, x + 2, y - h + 1, 2.5, 2, PAL.paper[5]); }
  poly(ctx, [[x0, y - h], [x0 + w, y - h], [x0 + w - 1, y], [x0 + 1, y]], (xx, yy) => ((xx + yy) % 3 === 0 || (xx - yy) % 3 === 0) ? PAL.metal[5] : ((xx - x0) / w < 0.5 ? PAL.metal[2] : PAL.metal[1]));
  hline(ctx, x0, y - h, w, PAL.metal[6]); hline(ctx, x0 + 1, y - 1, w - 2, PAL.metal[3]);
}
/** Red fire extinguisher on the wall/floor. */
export function extinguisher(ctx, x, y) {
  shadowEllipse(ctx, x + 2, y, 4, 1.5, 0.6);
  rect(ctx, x, y - 13, 5, 13, PAL.red[3]); vline(ctx, x + 1, y - 12, 11, PAL.red[5]); vline(ctx, x + 4, y - 13, 13, PAL.red[1]);
  rect(ctx, x + 1, y - 16, 3, 3, PAL.metal[2]); hline(ctx, x + 3, y - 15, 3, PAL.ink[1]); vline(ctx, x + 6, y - 15, 6, PAL.ink[1]);
  rect(ctx, x + 1, y - 9, 3, 3, PAL.paper[6]);
}
/** Office water cooler. */
export function waterCooler(ctx, x, y) {
  shadowEllipse(ctx, x, y, 8, 2, 0.7);
  bevel(ctx, x - 6, y - 24, 12, 24, PAL.paper[5], PAL.paper[6], PAL.paper[2]);
  rect(ctx, x - 4, y - 18, 3, 2, PAL.blue[4]); rect(ctx, x + 1, y - 18, 3, 2, PAL.red[4]);
  rect(ctx, x - 4, y - 12, 8, 1, PAL.metal[2]);
  ellipse(ctx, x, y - 32, 6, 8, (xx, yy, d) => ditherPick(xx, yy, [PAL.blue[3], PAL.blue[5], PAL.blue[6], PAL.blue[7]], 1 - d - (xx - x) * 0.04));
  ditherOverlay(ctx, x - 3, y - 38, 2, 10, '#ffffff', 0.5);
  rect(ctx, x - 2, y - 25, 4, 2, PAL.blue[2]);
}
/** Generic hanging sign plate with text. */
export function signPlate(ctx, x, y, text, opts = {}) {
  const tw = measure(text) + 8;
  const c = opts.ramp || PAL.metal;
  ditherOverlay(ctx, x + 1, y + 1, tw, 13, PAL.shadow, 0.5);
  bevel(ctx, x, y, tw, 13, c[5], c[7], c[2]);
  label(ctx, text, x + 4, y, opts.color || PAL.ink[1]);
  return tw;
}
/** Rug/carpet seen in perspective: quad points [[x,y]x4] (top-left, top-right, bottom-right, bottom-left). */
export function rug(ctx, quad, ramp = PAL.red, opts = {}) {
  poly(ctx, quad, (xx, yy) => {
    const v = hash2(xx >> 1, yy, 3);
    return v < 0.12 ? ramp[1] : ditherPick(xx, yy, [ramp[2], ramp[3]], 0.5);
  });
  // border
  const [a, b, c, d] = quad;
  const inset = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
  const tl = inset(a, c, 0.06), tr = inset(b, d, 0.06), br = inset(c, a, 0.06), bl = inset(d, b, 0.06);
  for (const [p, q] of [[tl, tr], [tr, br], [br, bl], [bl, tl]]) line(ctx, p[0], p[1], q[0], q[1], opts.border || PAL.gold[3]);
}
/** Telephone (desk, ~12x7). ringing offsets handset. */
export function telephone(ctx, x, y, opts = {}) {
  const c = opts.color || PAL.red;
  const up = opts.ringing ? -1 : 0;
  poly(ctx, [[x + 1, y - 5], [x + 11, y - 5], [x + 12, y], [x, y]], c[3]);
  hline(ctx, x + 1, y - 5, 10, c[5]); hline(ctx, x, y, 13, c[1]);
  ellipse(ctx, x + 6, y - 3, 2, 1.5, PAL.paper[6]); px(ctx, x + 6, y - 3, PAL.ink[2]);
  rect(ctx, x - 1, y - 8 + up, 14, 3, c[3]); hline(ctx, x - 1, y - 8 + up, 14, c[5]);
  rect(ctx, x - 1, y - 6 + up, 3, 2, c[2]); rect(ctx, x + 10, y - 6 + up, 3, 2, c[2]);
}
/** Coffee mug (~6x6). */
export function mug(ctx, x, y, opts = {}) {
  const c = opts.color || PAL.paper;
  rect(ctx, x, y - 6, 5, 6, c[5]); vline(ctx, x + 4, y - 6, 6, c[3]); vline(ctx, x, y - 6, 6, c[6] || c[5]);
  hline(ctx, x, y - 6, 5, opts.full ? PAL.wood[1] : c[2]);
  px(ctx, x + 5, y - 5, c[3]); px(ctx, x + 6, y - 4, c[3]); px(ctx, x + 5, y - 3, c[3]);
  if (opts.logo) px(ctx, x + 2, y - 3, opts.logo);
}
/** Stack of newspapers bound with string. */
export function newspaperStack(ctx, x, y, w = 16, n = 5) {
  for (let i = 0; i < n; i++) {
    const yy = y - (i + 1) * 2;
    rect(ctx, x + (i % 2), yy, w, 2, i % 2 ? PAL.paper[4] : PAL.paper[5]);
    hline(ctx, x + (i % 2), yy + 1, w, PAL.paper[2]);
  }
  vline(ctx, x + (w >> 1), y - n * 2, n * 2, PAL.wood[3]);
}
