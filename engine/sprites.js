// Sprite system + "paper-doll" procedural character generator.
// A sprite definition is a plain object:
//   { w, h, ox, oy,                     // frame size and origin (feet) inside the frame
//     anims: { idle:{frames,fps}, walk:{frames,fps}, talk:{frames,fps}, ... },
//     dirs: ['down','up','right'],      // directions drawn; 'left' mirrors 'right' when mirrorLeft
//     mirrorLeft: true, outline: '#140e1a' | null,
//     draw(ctx, anim, dir, frame) }     // draws one frame at local coords 0..w,0..h
// The engine caches every frame in a canvas (with optional 1px outline) — see getFrame().
import { shade, mix } from './draw.js';

const frameCache = new WeakMap();

function outlineCanvas(src, color) {
  const w = src.width, h = src.height;
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d');
  const id = src.getContext('2d').getImageData(0, 0, w, h);
  const d = id.data;
  const out = g.createImageData(w, h);
  const o = out.data;
  const n = parseInt(color.slice(1), 16);
  const R = (n >> 16) & 255, G = (n >> 8) & 255, B = n & 255;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = (y * w + x) * 4;
    if (d[i + 3] > 0) { o[i] = d[i]; o[i + 1] = d[i + 1]; o[i + 2] = d[i + 2]; o[i + 3] = 255; continue; }
    let near = false;
    for (let k = 0; k < 4 && !near; k++) {
      const nx = x + [1, -1, 0, 0][k], ny = y + [0, 0, 1, -1][k];
      if (nx >= 0 && ny >= 0 && nx < w && ny < h && d[(ny * w + nx) * 4 + 3] > 0) near = true;
    }
    if (near) { o[i] = R; o[i + 1] = G; o[i + 2] = B; o[i + 3] = 255; }
  }
  g.putImageData(out, 0, 0);
  return c;
}

/** Get a cached canvas for a sprite frame. Returns {canvas, flip}. */
export function getFrame(sprite, anim, dir, frame) {
  let m = frameCache.get(sprite);
  if (!m) { m = new Map(); frameCache.set(sprite, m); }
  const anims = sprite.anims || {};
  if (!anims[anim]) anim = anims.idle ? 'idle' : Object.keys(anims)[0];
  const nf = (anims[anim] && anims[anim].frames) || 1;
  frame = ((frame % nf) + nf) % nf;
  const dirs = sprite.dirs || ['down', 'up', 'right'];
  let flip = false, d = dir;
  if (!dirs.includes(d)) {
    if (d === 'left' && sprite.mirrorLeft !== false && dirs.includes('right')) { d = 'right'; flip = true; }
    else if (d === 'right' && dirs.includes('left')) { d = 'left'; flip = true; }
    else if ((d === 'up' || d === 'down') && dirs.includes('right')) d = 'right';
    else d = dirs[0];
  }
  const key = anim + '|' + d + '|' + frame;
  let c = m.get(key);
  if (!c) {
    c = document.createElement('canvas');
    c.width = sprite.w + 2; c.height = sprite.h + 2;
    const g = c.getContext('2d');
    g.save(); g.translate(1, 1);
    try { sprite.draw(g, anim, d, frame); } catch (e) { console.error('[sprite] draw error', e); g.fillStyle = '#f0f'; g.fillRect(0, 0, sprite.w, sprite.h); }
    g.restore();
    if (sprite.outline !== null) c = outlineCanvas(c, sprite.outline || '#140e1a');
    m.set(key, c);
  }
  return { canvas: c, flip };
}

// ---------------------------------------------------------------- paper doll

const HAIR_STYLES = ['short', 'parted', 'long', 'bob', 'bald', 'balding', 'ponytail', 'bun', 'curly', 'afro', 'mohawk', 'spiky', 'buzz',
  'cowlick', 'combover', 'bouffant', 'quiff', 'highponytail', 'mane', 'curlybun'];
export const DOLL_OPTIONS = {
  hairStyle: HAIR_STYLES,
  build: ['slim', 'normal', 'heavy'],
  glasses: [null, 'round', 'square', 'sun', 'half', 'thick'],
  beard: [null, 'full', 'goatee', 'stubble', 'long'],
  hat: [null, 'cap', 'fedora', 'beanie', 'visor'],
  prop: [null, 'folder', 'camera', 'mallet', 'stamps', 'postits', 'eyedrops', 'laptop', 'phone'],
  pocketKind: ['pen', 'ruler', 'phones', 'radio'],
};

/**
 * Create a character sprite from parameters. See docs/CONTENT_SCHEMA.md#paper-doll.
 */
export function paperDoll(p = {}) {
  const P = {
    skin: '#e0a47a', hair: '#3a2418', hairStyle: 'short', eyes: '#1a1010',
    shirt: '#d8d4c8', jacket: null, vest: null, pants: '#3a3f58', shoes: '#2a1c18', skirt: null,
    tie: null, bowtie: null, glasses: null, glassesColor: '#2a2030', headphones: null, beard: null, mustache: false,
    hat: null, hatColor: '#4a5a8c', badge: null, earrings: null, lipstick: null, scarf: null,
    sleeves: 'long', height: 1, build: 'normal', belly: false, stripes: null, pencil: false,
    // accessories added for FE DE ERRATAS (see docs/CONTENT_SCHEMA.md §5)
    hairStreak: null, hairPencil: null, pencilColor: '#e8c040', glassesChain: null, glassesTape: null, eyebags: false,
    suspenders: null, cuffs: null, armbands: null, bracelets: null, sleeveNotes: null, hood: null, neckphones: null,
    headset: null, earpiece: null, backpack: null, pocketItem: null, pocketKind: 'pen', prop: null, propColor: null,
    badges: 1, emblem: null, keys: null, epaulettes: null, scarfStripe: null, crumbs: null, dots: null, untucked: false,
    tieDots: null, loupe: null,       // tieDots: little marks on the tie (Evaristo's commas); loupe: magnifier on a cord
    ...p,
  };
  const W = 28, H = 64, cx = 14;
  const legLen = Math.round(20 * P.height);
  const torsoLen = Math.round(16 * P.height);
  const feetY = H - 1;
  const waist = feetY - 2 - legLen;               // first row of legs is waist+1
  const top = waist - torsoLen;                   // shoulder row
  const headTop = top - 11;
  const sw = { slim: 10, normal: 12, athletic: 12, heavy: 14 }[P.build] || 12;      // athletic: shoulders of `normal`, waist of `slim`
  const ww = { slim: 8, normal: 10, athletic: 8, heavy: 14 }[P.build] || 10;
  const sideW = { slim: 6, normal: 7, athletic: 7, heavy: 10 }[P.build] || 7;
  const skin = [shade(P.skin, -0.3), P.skin, shade(P.skin, 0.18)];
  const lip = P.lipstick || shade(P.skin, -0.4);
  const hair = [shade(P.hair, -0.35), P.hair, shade(P.hair, 0.2)];
  const r3 = c => c ? [shade(c, -0.33), c, shade(c, 0.2)] : null;
  const shirt = r3(P.shirt), jacket = r3(P.jacket), vest = r3(P.vest), pants = r3(P.pants), shoes = r3(P.shoes), skirt = r3(P.skirt);
  const sleeve = jacket || shirt;
  const sleeveShort = !jacket && P.sleeves === 'short';

  let g;
  const R = (x, y, w, h, c) => { if (w > 0 && h > 0 && c) { g.fillStyle = c; g.fillRect(x, y, w, h); } };
  const D = (x, y, c) => R(x, y, 1, 1, c);

  // ---------- head (front/back/side) -----------
  function headFront(back, anim, frame) {
    const y = headTop;
    const L = cx - 4; // head spans L..L+7
    // neck
    R(cx - 2, top - 2, 4, 2, skin[0]);
    // ears
    R(L - 1, y + 4, 1, 2, skin[1]); R(L + 8, y + 4, 1, 2, skin[0]);
    // head shape
    R(L + 1, y, 6, 1, skin[1]);
    R(L, y + 1, 8, 7, skin[1]);
    R(L + 1, y + 8, 6, 1, skin[1]);
    R(L + 2, y + 9, 4, 1, skin[1]);
    R(L + 7, y + 1, 1, 7, skin[0]); D(L + 6, y + 8, skin[0]); D(L + 5, y + 9, skin[0]);
    if (!back) {
      R(L + 1, y + 2, 1, 3, skin[2]);
      const blink = anim === 'idle' && frame === 1;
      // brows
      if (!['bald'].includes(P.hairStyle) || true) { R(L + 1, y + 3, 2, 1, hair[0]); R(L + 5, y + 3, 2, 1, hair[0]); }
      // eyes
      if (blink) { D(L + 2, y + 4, skin[0]); D(L + 5, y + 4, skin[0]); }
      else { D(L + 2, y + 4, P.eyes); D(L + 5, y + 4, P.eyes); D(L + 1, y + 4, '#f4f0ea'); D(L + 6, y + 4, '#e4e0da'); }
      // nose
      D(L + 4, y + 5, skin[0]); D(L + 4, y + 6, skin[0]); D(L + 3, y + 6, skin[2]);
      // mouth
      const talk = anim === 'talk' ? frame : 0;
      if (talk === 1) { R(L + 3, y + 7, 2, 2, '#3a1218'); D(L + 3, y + 8, '#c04a50'); }
      else if (talk === 2) { R(L + 2, y + 7, 4, 1, '#3a1218'); }
      else R(L + 3, y + 7, 2, 1, lip);
      // beard / mustache
      if (P.beard === 'full') { R(L, y + 5, 1, 3, hair[1]); R(L + 7, y + 5, 1, 3, hair[0]); R(L, y + 8, 8, 1, hair[1]); R(L + 1, y + 8, 6, 1, hair[1]); R(L + 2, y + 9, 4, 1, hair[0]); R(L + 1, y + 6, 1, 2, hair[1]); R(L + 6, y + 6, 1, 2, hair[0]); D(L + 2, y + 7, hair[1]); D(L + 5, y + 7, hair[1]); if (talk !== 1) R(L + 3, y + 8, 2, 1, hair[0]); }
      if (P.beard === 'goatee') { R(L + 3, y + 8, 2, 2, hair[1]); }
      if (P.beard === 'stubble') { for (let i = 0; i < 6; i++) D(L + 1 + i, y + 8 - (i % 2), mix(P.skin, P.hair, 0.5)); R(L + 2, y + 9, 4, 1, mix(P.skin, P.hair, 0.45)); }
      if (P.mustache || P.beard === 'full') R(L + 2, y + 6, 4, 1, hair[1]);
      if (P.mustache) D(L + 4, y + 6, hair[0]);
      // glasses
      if (P.glasses && P.glasses !== 'half' && P.glasses !== 'thick') {
        const fc = P.glasses === 'sun' ? '#14101c' : P.glassesColor;
        if (P.glasses === 'sun') { R(L + 1, y + 4, 6, 1, fc); R(L + 1, y + 5, 2, 1, fc); R(L + 5, y + 5, 2, 1, fc); D(L + 2, y + 4, '#5a6a8a'); }
        else {
          const lens = '#d8e8f4';
          D(L + 1, y + 4, lens); D(L + 6, y + 4, lens);
          D(L + 3, y + 4, fc); D(L + 4, y + 4, fc);
          if (P.glasses === 'square') { R(L + 1, y + 5, 3, 1, fc); R(L + 4, y + 5, 3, 1, fc); }
          else { D(L + 2, y + 5, fc); D(L + 5, y + 5, fc); D(L + 1, y + 5, fc); D(L + 6, y + 5, fc); }
          D(L, y + 4, fc); D(L + 7, y + 4, fc);
        }
      }
      if (P.earrings) { D(L - 1, y + 6, P.earrings); D(L + 8, y + 6, P.earrings); }
    }
    hairFront(back);
    if (P.pencil && !back) { R(L + 8, y + 1, 1, 4, P.pencilColor); D(L + 8, y + 5, '#3a2a20'); }
    hat(back ? 'back' : 'front');
    if (!back) faceExtras();
    if (P.headset) { const hc = r3(P.headset); R(L, y - 2, 8, 1, hc[0]); D(L - 1, y - 1, hc[0]); R(L - 2, y + 3, 2, 3, hc[1]); if (!back) { D(L - 1, y + 6, hc[1]); D(L, y + 7, hc[1]); D(L + 1, y + 7, hc[2]); } }
    if (P.earpiece && !back) { D(L - 1, y + 5, P.earpiece); vline2(L - 1, y + 6, top - (y + 6) + 3, shade(P.earpiece, -0.2)); }
    if (P.headphones) {
      const hc = r3(P.headphones);
      R(L, y - 2, 8, 1, hc[1]); D(L - 1, y - 1, hc[1]); D(L + 8, y - 1, hc[0]);
      R(L - 2, y + 3, 2, 4, hc[1]); R(L + 8, y + 3, 2, 4, hc[0]); D(L - 2, y + 3, hc[2]);
      R(L - 1, y, 1, 3, hc[1]); R(L + 8, y, 1, 3, hc[0]);
    }
  }
  function vline2(x, y, h, c) { R(x, y, 1, h, c); }
  function faceExtras() {
    const y = headTop, L = cx - 4;
    if (P.eyebags) { const eb = shade(P.skin, -0.28); D(L + 2, y + 5, eb); D(L + 5, y + 5, eb); D(L + 1, y + 5, eb); D(L + 6, y + 5, eb); }
    if (P.glasses === 'half') {
      const fc = P.glassesColor;
      R(L + 1, y + 5, 2, 1, fc); R(L + 5, y + 5, 2, 1, fc); D(L + 3, y + 4, fc); D(L + 4, y + 4, fc); D(L, y + 4, fc); D(L + 7, y + 4, fc);
    }
    if (P.glasses === 'thick') {
      const fc = P.glassesColor, lens = '#dce8f4';
      R(L, y + 3, 3, 1, fc); R(L + 5, y + 3, 3, 1, fc); R(L + 1, y + 5, 2, 1, fc); R(L + 5, y + 5, 2, 1, fc);
      D(L, y + 4, fc); D(L + 3, y + 4, fc); D(L + 4, y + 4, fc); D(L + 7, y + 4, fc);
      D(L + 1, y + 4, lens); D(L + 6, y + 4, lens); D(L + 2, y + 4, P.eyes); D(L + 5, y + 4, P.eyes);
    }
    if (P.glassesChain && P.glasses) { const cc = P.glassesChain; for (let i = 0; i < 6; i += 2) { D(L - 1, y + 5 + i, cc); D(L + 8, y + 5 + i, cc); } D(L, y + 11, cc); D(L + 7, y + 11, cc); }
    if (P.glassesTape && P.glasses) { D(L + 3, y + 4, P.glassesTape); D(L + 4, y + 4, P.glassesTape); D(L + 3, y + 3, P.glassesTape); }
    if (P.beard === 'long') { R(L + 1, y + 9, 6, 3, hair[1]); R(L + 2, y + 12, 4, 2, hair[1]); D(L + 3, y + 14, hair[0]); D(L + 4, y + 14, hair[0]); D(L + 2, y + 10, hair[2]); R(L + 6, y + 9, 1, 3, hair[0]); }
  }
  function hairFront(back) {
    const y = headTop, L = cx - 4;
    const s = P.hairStyle;
    if (s === 'combover') {
      R(L, y + 1, 1, 5, hair[1]); R(L + 7, y + 1, 1, 5, hair[0]); D(L + 5, y + 1, '#fff4e0');
      for (let i = 0; i < 7; i += 2) D(L + i, y, hair[1]); for (let i = 1; i < 6; i += 2) D(L + i, y + 1, hair[0]);
      if (back) R(L, y + 2, 8, 5, hair[1]);
      return;
    }
    if (s === 'bouffant' || s === 'mane') {
      R(L - 1, y - 3, 10, 2, hair[1]); R(L, y - 4, 8, 1, hair[1]); R(L - 2, y - 1, 12, 3, hair[1]);
      R(L + 5, y - 3, 3, 4, hair[0]); D(L + 1, y - 3, hair[2]); D(L + 2, y - 4, hair[2]); D(L + 3, y - 2, hair[2]);
      const len = s === 'mane' ? 12 : 5;
      R(L - 2, y + 2, 2, len, hair[1]); R(L + 8, y + 2, 2, len, hair[0]);
      if (s === 'mane') { R(L - 3, y + 5, 1, len - 4, hair[1]); R(L + 10, y + 5, 1, len - 4, hair[0]); D(L - 2, y + 4, hair[2]); }
      if (back) { R(L - 2, y, 12, len + 2, hair[1]); R(L + 5, y, 5, len + 2, hair[0]); }
      if (P.hairStreak) { D(L + 2, y - 3, P.hairStreak); D(L + 1, y - 1, P.hairStreak); D(L - 2, y + 4, P.hairStreak); }
      return;
    }
    if (s === 'bald') { D(L + 2, y + 1, '#fff4e0'); if (back) R(L, y + 5, 8, 2, hair[1]); else { R(L - 0, y + 3, 1, 3, hair[1]); R(L + 7, y + 3, 1, 3, hair[0]); } return; }
    if (s === 'balding') { R(L, y + 1, 1, 5, hair[1]); R(L + 7, y + 1, 1, 5, hair[0]); D(L + 3, y + 1, '#fff4e0'); if (back) R(L, y + 3, 8, 4, hair[1]); return; }
    if (s === 'buzz') { R(L + 1, y - 1, 6, 1, hair[1]); R(L, y, 8, 2, hair[1]); D(L, y + 2, hair[1]); D(L + 7, y + 2, hair[0]); if (back) R(L, y, 8, 6, mix(P.hair, P.skin, 0.25)); return; }
    if (s === 'afro') {
      R(L - 3, y - 4, 14, 8, hair[1]); R(L - 2, y - 5, 12, 1, hair[1]); R(L - 3, y + 4, 2, 3, hair[1]); R(L + 9, y + 4, 2, 3, hair[0]);
      R(L + 6, y - 4, 4, 9, hair[0]);
      for (let i = 0; i < 10; i++) D(L - 2 + ((i * 5) % 12), y - 4 + ((i * 3) % 6), hair[2]);
      if (back) R(L - 3, y + 2, 14, 6, hair[1]);
      return;
    }
    if (s === 'mohawk') { R(L + 3, y - 4, 2, 5, hair[1]); D(L + 3, y - 4, hair[2]); R(L, y + 1, 1, 3, hair[0]); R(L + 7, y + 1, 1, 3, hair[0]); if (back) R(L + 3, y, 2, 7, hair[1]); return; }
    // common cap of hair
    R(L + 1, y - 1, 6, 1, hair[1]);
    R(L, y, 8, 2, hair[1]);
    R(L - 1, y + 1, 1, 3, hair[1]); R(L + 8, y + 1, 1, 3, hair[0]);
    R(L + 5, y - 1, 2, 3, hair[0]);
    D(L + 2, y - 1, hair[2]); D(L + 3, y, hair[2]);
    if (back) { R(L - 1, y, 10, 8, hair[1]); R(L + 5, y, 4, 8, hair[0]); D(L + 1, y + 1, hair[2]); }
    if (s === 'short' || s === 'parted') { D(L, y + 2, hair[1]); if (s === 'parted') { R(L, y + 2, 3, 1, hair[1]); D(L + 2, y, skin[2]); } }
    if (s === 'spiky') { for (let i = 0; i < 4; i++) { D(L + i * 2, y - 2, hair[1]); } D(L + 1, y - 3, hair[2]); D(L + 5, y - 3, hair[1]); }
    if (s === 'curly') { R(L - 1, y - 2, 10, 2, hair[1]); for (let i = 0; i < 5; i++) D(L - 1 + i * 2, y - 2, hair[2]); R(L - 2, y, 2, 6, hair[1]); R(L + 8, y, 2, 6, hair[0]); }
    if (s === 'long' || s === 'bob') {
      const len = s === 'long' ? 14 : 8;
      R(L - 2, y + 1, 2, len, hair[1]); R(L + 8, y + 1, 2, len, hair[0]);
      R(L, y + 2, 2, 1, hair[1]); R(L + 6, y + 2, 2, 1, hair[0]);
      if (back) R(L - 2, y + 1, 12, len, hair[1]), R(L + 5, y + 1, 5, len, hair[0]);
    }
    if (s === 'ponytail' || s === 'bun') {
      R(L, y + 2, 1, 2, hair[1]); R(L + 7, y + 2, 1, 2, hair[0]);
      if (back) { if (s === 'ponytail') R(cx - 1, y + 6, 3, 9, hair[1]); else R(cx - 2, y - 3, 5, 4, hair[1]); }
      else if (s === 'bun') { R(cx - 2, y - 4, 4, 3, hair[1]); D(cx - 1, y - 4, hair[2]); }
    }
    if (s === 'cowlick') { D(L, y + 2, hair[1]); D(L + 4, y - 2, hair[1]); D(L + 5, y - 3, hair[1]); D(L + 6, y - 4, hair[2]); D(L + 3, y - 2, hair[0]); }
    if (s === 'quiff') { R(L + 1, y - 3, 6, 2, hair[1]); R(L + 3, y - 4, 5, 1, hair[1]); D(L + 8, y - 4, hair[1]); D(L + 4, y - 4, hair[2]); D(L + 2, y - 3, hair[2]); R(L + 6, y - 3, 2, 2, hair[0]); }
    if (s === 'highponytail') {
      R(L, y + 2, 1, 2, hair[1]); R(L + 7, y + 2, 1, 2, hair[0]);
      R(cx - 1, y - 4, 3, 3, hair[1]); D(cx, y - 4, hair[2]);
      if (back) R(cx - 1, y - 2, 3, 12, hair[1]); else { R(L + 8, y - 3, 2, 3, hair[1]); R(L + 9, y, 2, 8, hair[0]); D(L + 10, y + 8, hair[0]); }
      if (P.hairStreak) { if (back) { R(cx, y, 1, 10, P.hairStreak); } else { R(L + 10, y + 1, 1, 6, P.hairStreak); D(cx - 1, y - 3, P.hairStreak); } }
    }
    if (s === 'curlybun') {
      R(L - 1, y - 2, 10, 2, hair[1]); for (let i = 0; i < 5; i++) D(L - 1 + i * 2, y - 2, hair[2]);
      R(L - 2, y, 2, 4, hair[1]); R(L + 8, y, 2, 4, hair[0]);
      R(cx - 3, y - 6, 6, 4, hair[1]); D(cx - 2, y - 6, hair[2]); D(cx + 1, y - 5, hair[2]); D(cx - 3, y - 3, hair[0]);
      if (back) R(L - 2, y, 12, 6, hair[1]);
    }
    if (P.hairStreak && s !== 'highponytail') { D(L + 2, y - 1, P.hairStreak); D(L + 1, y, P.hairStreak); D(L + 5, y, P.hairStreak); }
    if (P.hairPencil) { const by = (s === 'curlybun' ? y - 4 : y - 3); R(cx - 5, by, 10, 1, P.hairPencil); D(cx + 5, by, '#3a2a20'); D(cx - 5, by, shade(P.hairPencil, 0.3)); }
  }
  function hat(view) {
    if (!P.hat) return;
    const hc = r3(P.hatColor);
    const y = headTop, L = cx - 4;
    if (P.hat === 'cap') {
      R(L, y - 2, 8, 3, hc[1]); R(L + 1, y - 3, 6, 1, hc[1]); D(L + 2, y - 2, hc[2]);
      if (view === 'front') R(L - 1, y + 1, 10, 1, hc[0]);
      if (view === 'side') R(cx + 2, y + 1, 4, 1, hc[0]);
    } else if (P.hat === 'fedora') {
      R(L - 2, y + 0, 12, 1, hc[0]); R(L, y - 4, 8, 4, hc[1]); R(L, y - 1, 8, 1, '#1a1018'); D(L + 1, y - 3, hc[2]);
    } else if (P.hat === 'beanie') {
      R(L - 1, y - 3, 10, 4, hc[1]); R(L - 1, y, 10, 1, hc[0]); D(cx, y - 4, hc[2]);
    } else if (P.hat === 'visor') {
      R(L - 1, y, 10, 1, hc[1]); if (view !== 'back') R(L, y + 1, 8, 1, hc[0]);
    }
  }
  function headSide(anim, frame) {
    const y = headTop;
    const L = cx - 3; // head spans L..L+6, face at right
    R(cx - 1, top - 2, 3, 2, skin[0]);
    R(L + 1, y, 5, 1, skin[1]);
    R(L, y + 1, 7, 7, skin[1]);
    R(L + 1, y + 8, 6, 1, skin[1]);
    R(L + 3, y + 9, 3, 1, skin[1]);
    D(L + 7, y + 5, skin[1]); D(L + 7, y + 6, skin[0]);
    R(L, y + 5, 1, 3, skin[0]);
    const blink = anim === 'idle' && frame === 1;
    D(L + 5, y + 4, blink ? skin[0] : P.eyes);
    R(L + 4, y + 3, 3, 1, hair[0]);
    D(L + 1, y + 4, skin[0]); D(L + 1, y + 5, skin[0]); // ear
    const talk = anim === 'talk' ? frame : 0;
    if (talk === 1) { R(L + 5, y + 7, 2, 2, '#3a1218'); } else if (talk === 2) R(L + 5, y + 7, 2, 1, '#3a1218'); else D(L + 6, y + 7, lip);
    if (P.beard === 'full') { R(L + 1, y + 5, 5, 4, hair[1]); R(L + 3, y + 9, 3, 1, hair[0]); D(L + 6, y + 8, hair[1]); if (talk) D(L + 6, y + 7, '#3a1218'); }
    if (P.beard === 'goatee') R(L + 5, y + 8, 2, 2, hair[1]);
    if (P.beard === 'stubble') R(L + 3, y + 8, 4, 1, mix(P.skin, P.hair, 0.45));
    if (P.mustache || P.beard === 'full') R(L + 5, y + 6, 3, 1, hair[1]);
    if (P.glasses) { const fc = P.glasses === 'sun' ? '#14101c' : P.glassesColor; R(L + 3, y + 4, 5, 1, fc); D(L + 5, y + 4, P.glasses === 'sun' ? '#14101c' : P.eyes); D(L + 6, y + 5, fc); if (P.glasses !== 'sun') D(L + 6, y + 3, fc); }
    if (P.earrings) D(L + 1, y + 6, P.earrings);
    // hair side
    const s = P.hairStyle;
    if (s === 'bald') { R(L, y + 3, 2, 4, hair[1]); D(L + 3, y + 1, '#fff4e0'); }
    else if (s === 'balding' || s === 'combover') { R(L, y + 2, 3, 4, hair[1]); }
    else if (s === 'buzz') { R(L, y - 1, 6, 2, hair[1]); R(L, y + 1, 2, 4, hair[1]); }
    else if (s === 'afro') { R(L - 4, y - 5, 12, 10, hair[1]); R(L - 4, y + 5, 4, 3, hair[1]); R(L + 2, y - 5, 6, 2, hair[2]); R(L + 7, y + 1, 1, 3, hair[1]); }
    else if (s === 'mohawk') { R(L + 1, y - 4, 4, 4, hair[1]); D(L + 4, y - 4, hair[2]); R(L, y + 1, 2, 3, hair[0]); }
    else {
      R(L, y - 1, 6, 2, hair[1]); R(L - 1, y, 3, 6, hair[1]); R(L + 2, y + 1, 1, 2, hair[1]); D(L + 3, y - 1, hair[2]); D(L + 6, y, hair[1]); D(L + 6, y + 1, hair[1]);
      R(L - 1, y + 3, 1, 4, hair[0]);
      if (s === 'spiky') { D(L + 1, y - 2, hair[1]); D(L + 3, y - 2, hair[1]); D(L + 5, y - 2, hair[1]); }
      if (s === 'curly') { R(L - 2, y - 2, 9, 2, hair[1]); R(L - 2, y, 2, 7, hair[1]); D(L + 2, y - 2, hair[2]); }
      if (s === 'long') { R(L - 2, y + 1, 4, 13, hair[1]); R(L - 2, y + 9, 3, 5, hair[0]); }
      if (s === 'bob') { R(L - 2, y + 1, 4, 8, hair[1]); }
      if (s === 'ponytail') { R(L - 3, y + 3, 2, 3, hair[1]); R(L - 4, y + 5, 2, 7, hair[1]); D(L - 4, y + 11, hair[0]); }
      if (s === 'bun') { R(L - 3, y - 1, 3, 4, hair[1]); D(L - 2, y - 1, hair[2]); }
    }
    if (s === 'combover') { R(L, y - 1, 6, 1, hair[1]); D(L + 2, y, '#fff4e0'); }
    if (s === 'bouffant' || s === 'mane') { R(L - 2, y - 4, 9, 4, hair[1]); D(L + 2, y - 4, hair[2]); R(L - 2, y, 3, s === 'mane' ? 13 : 7, hair[1]); if (P.hairStreak) D(L, y - 2, P.hairStreak); }
    if (s === 'quiff') { R(L + 1, y - 4, 6, 3, hair[1]); D(L + 7, y - 4, hair[1]); D(L + 3, y - 4, hair[2]); }
    if (s === 'cowlick') { D(L + 2, y - 2, hair[1]); D(L + 3, y - 3, hair[2]); }
    if (s === 'highponytail') { R(L - 1, y - 4, 3, 3, hair[1]); R(L - 3, y - 3, 2, 10, hair[1]); D(L - 3, y + 7, hair[0]); if (P.hairStreak) R(L - 3, y - 2, 1, 7, P.hairStreak); }
    if (s === 'curlybun') { R(L - 2, y - 2, 9, 2, hair[1]); R(L - 2, y, 2, 6, hair[1]); R(L - 3, y - 5, 5, 4, hair[1]); D(L - 2, y - 5, hair[2]); }
    if (P.hairPencil) R(L - 4, y - 3, 7, 1, P.hairPencil);
    if (P.glasses === 'half' || P.glasses === 'thick') { R(L + 4, y + (P.glasses === 'half' ? 5 : 4), 3, 1, P.glassesColor); }
    if (P.glassesChain && P.glasses) { D(L + 2, y + 6, P.glassesChain); D(L + 2, y + 8, P.glassesChain); }
    if (P.beard === 'long') { R(L + 2, y + 8, 5, 4, hair[1]); R(L + 3, y + 12, 3, 2, hair[0]); }
    if (P.eyebags) D(L + 5, y + 5, shade(P.skin, -0.28));
    if (P.pencil) { R(L + 1, y + 1, 1, 4, P.pencilColor); }
    hat('side');
    if (P.headset) { R(L, y - 2, 6, 1, P.headset); R(L + 1, y + 3, 2, 3, P.headset); D(L + 3, y + 7, P.headset); D(L + 4, y + 7, P.headset); }
    if (P.earpiece) D(L + 1, y + 5, P.earpiece);
    if (P.headphones) { const hc = r3(P.headphones); R(L, y - 2, 6, 1, hc[1]); R(L + 1, y + 3, 2, 4, hc[1]); D(L + 1, y + 3, hc[2]); }
  }

  // ---------- body ----------
  function torsoFront(back, walkF, reach) {
    const L = cx - (sw >> 1);
    const tl = top;
    // torso base
    const body = jacket || vest || shirt;
    R(L + 1, tl, sw - 2, 1, body[1]);
    for (let yy = tl + 1; yy < waist + 1; yy++) {
      const t = (yy - tl) / torsoLen;
      let w = Math.round(sw + (ww - sw) * t);
      if (P.belly && P.build === 'heavy' && t > 0.4 && t < 0.95) w += 2;
      const x0 = cx - (w >> 1);
      R(x0, yy, w, 1, body[1]);
      D(x0, yy, body[2]); R(x0 + w - 2, yy, 2, 1, body[0]);
    }
    if (P.stripes && !jacket) for (let yy = tl + 2; yy < waist; yy += 3) R(cx - (sw >> 1) + 1, yy, sw - 2, 1, P.stripes);
    if (!back) {
      if (jacket || vest) {
        // open front showing shirt
        const ins = vest ? 4 : 4;
        for (let yy = tl; yy < waist; yy++) {
          const wv = yy < tl + 7 ? ins - Math.floor((yy - tl) / 3) : 1;
          R(cx - (wv >> 1) - (wv & 1 ? 0 : 0), yy, Math.max(1, wv), 1, shirt[1]);
        }
        D(cx - 3, tl + 1, body[2]); D(cx + 2, tl + 1, body[0]); D(cx - 2, tl + 3, body[2]); D(cx + 1, tl + 3, body[0]);
        if (jacket) { D(cx - 1, tl + 10, '#d8c8a0'); D(cx - 1, tl + 13, '#d8c8a0'); }
      }
      R(cx - 2, tl, 1, 2, shirt[2]); R(cx + 1, tl, 1, 2, shirt[2]);
      if (P.tie) { const tc = r3(P.tie); R(cx - 1, tl, 2, 2, tc[0]); R(cx - 1, tl + 2, 2, 7, tc[1]); D(cx, tl + 3, tc[0]); D(cx - 1, tl + 9, tc[0]);
        if (P.tieDots) { D(cx, tl + 2, P.tieDots); D(cx - 1, tl + 4, P.tieDots); D(cx, tl + 6, P.tieDots); D(cx - 1, tl + 8, P.tieDots); } }
      if (P.loupe) {     // lupa colgada de un cordón: cordón al cuello y lente con aro y reflejo
        const lc = P.loupe;
        D(cx + 2, tl - 1, '#3a3030'); R(cx + 2, tl, 1, 6, '#3a3030');
        R(cx + 1, tl + 6, 4, 4, lc); R(cx + 2, tl + 7, 2, 2, '#dff0ff'); D(cx + 2, tl + 7, '#ffffff'); D(cx + 4, tl + 10, shade(lc, -0.35));
      }
      if (P.bowtie) { R(cx - 2, tl, 4, 1, P.bowtie); D(cx - 2, tl + 1, P.bowtie); D(cx + 1, tl + 1, P.bowtie); }
      if (P.scarf) { const sc = r3(P.scarf); R(cx - 3, tl - 1, 6, 2, sc[1]); R(cx + 1, tl + 1, 2, 6, sc[0]); }
      if (P.scarfStripe && P.scarf) { R(cx - 3, tl - 1, 2, 2, P.scarfStripe); D(cx + 2, tl, P.scarfStripe); R(cx + 1, tl + 3, 2, 1, P.scarfStripe); R(cx + 1, tl + 6, 2, 1, P.scarfStripe); }
      if (P.suspenders) { R(cx - 3, tl, 1, torsoLen, P.suspenders); R(cx + 2, tl, 1, torsoLen, P.suspenders); D(cx - 3, waist - 1, shade(P.suspenders, 0.3)); D(cx + 2, waist - 1, shade(P.suspenders, 0.3)); }
      if (P.emblem) { R(cx - 3, tl + 5, 4, 2, P.emblem); D(cx - 2, tl + 5, shade(P.emblem, 0.35)); }
      if (P.dots) { for (let yy = tl + 2; yy < waist; yy += 3) for (let xx = cx - (sw >> 1) + 1 + ((yy >> 1) & 1); xx < cx + (sw >> 1) - 1; xx += 3) D(xx, yy, P.dots); }
      if (P.crumbs) { D(cx - 2, tl + 5, P.crumbs); D(cx + 1, tl + 7, P.crumbs); D(cx - 1, tl + 9, P.crumbs); D(cx + 2, tl + 4, P.crumbs); }
      if (P.backpack) { const bc = r3(P.backpack); R(cx - 5, tl, 1, 9, bc[0]); R(cx + 4, tl, 1, 9, bc[0]); D(cx - 5, tl + 4, bc[2]); D(cx + 4, tl + 4, bc[1]); }
      if (P.epaulettes) { R(cx - (sw >> 1) - 2, tl, 4, 1, P.epaulettes); R(cx + (sw >> 1) - 2, tl, 4, 1, P.epaulettes); }
      if (P.pocketItem) {
        const px0 = cx + 2, py0 = tl + 3, pc = P.pocketItem;
        R(px0, py0 + 2, 3, 1, shade((jacket || shirt)[1], -0.25));
        if (P.pocketKind === 'ruler') { R(px0 + 1, py0 - 2, 1, 4, pc); D(px0 + 1, py0 - 2, '#2a2218'); }
        else if (P.pocketKind === 'phones') { R(px0, py0, 1, 2, pc); R(px0 + 1, py0 - 1, 1, 3, shade(pc, 0.3)); R(px0 + 2, py0, 1, 2, shade(pc, -0.2)); }
        else if (P.pocketKind === 'radio') { R(px0, py0, 3, 2, pc); D(px0 + 2, py0 - 2, pc); D(px0 + 2, py0 - 1, pc); D(px0, py0, '#c04030'); }
        else R(px0 + 1, py0 - 1, 1, 3, pc);
      }
      if (P.badge) {
        const n = Math.max(1, P.badges | 0);
        const cols = ['#c03030', '#3070c0', '#e0b030', '#30a050', '#a040b0', '#e07030', '#40b0c0', '#d04080', '#8080a0'];
        R(cx - 3, tl + 1, 1, 6, P.badge); R(cx + 2, tl + 1, 1, 6, P.badge);
        for (let i = n - 1; i >= 0; i--) {
          const ox = n > 1 ? ((i % 3) - 1) * 2 : 0, oy = n > 1 ? Math.floor(i / 3) * 2 : 0;
          if (i) { D(cx - 3 + ox, tl + 1 + oy, cols[i % cols.length]); }
          R(cx - 2 + ox, tl + 7 + oy, 4, 3, i ? '#e8e4d8' : '#f4f0e0'); D(cx - 1 + ox, tl + 8 + oy, i ? cols[i % cols.length] : '#3a4a8a');
        }
      }
      if (P.neckphones) { const hc = r3(P.neckphones); R(cx - 4, tl - 1, 8, 1, hc[1]); R(cx - 5, tl, 2, 2, hc[1]); R(cx + 3, tl, 2, 2, hc[0]); D(cx - 5, tl, hc[2]); }
      if (P.hood) { const hc = r3(P.hood); R(cx - 5, tl - 1, 2, 2, hc[1]); R(cx + 3, tl - 1, 2, 2, hc[0]); R(cx - 3, waist - 5, 6, 3, hc[0]); hline2(cx - 3, waist - 5, 6, hc[2]); }
      if (P.prop === 'camera') { const pc = P.propColor || '#2a2a30'; R(cx - 3, tl + 6, 6, 4, pc); R(cx - 1, tl + 7, 2, 2, '#6080a0'); D(cx - 1, tl + 7, '#c0e0ff'); R(cx - 3, tl + 5, 2, 1, '#d0d0d8'); }
    } else {
      R(cx - 2, tl, 4, 1, (jacket || shirt)[0]);
      if (P.scarf) R(cx - 3, tl - 1, 6, 2, P.scarf);
      if (P.suspenders) { for (let i = 0; i < torsoLen; i++) { const o = Math.round(i * 0.25); D(cx - 3 + o, tl + i, P.suspenders); D(cx + 2 - o, tl + i, P.suspenders); } }
      if (P.hood) { const hc = r3(P.hood); R(cx - 4, tl - 2, 8, 4, hc[1]); R(cx - 3, tl + 2, 6, 1, hc[0]); D(cx - 3, tl - 2, hc[2]); }
      if (P.backpack) {
        const bc = r3(P.backpack);
        R(cx - 5, tl + 1, 10, 11, bc[1]); R(cx - 4, tl, 8, 1, bc[1]); R(cx + 3, tl + 1, 2, 11, bc[0]); R(cx - 5, tl + 11, 10, 1, bc[0]); D(cx - 4, tl + 1, bc[2]);
        R(cx - 3, tl + 6, 6, 4, bc[0]); hline2(cx - 3, tl + 6, 6, bc[2]);
        const ch = ['#e0b030', '#c03030', '#30a0d0', '#f0f0f0'];
        [[-3, 2], [1, 3], [-1, 4], [2, 8], [-3, 9]].forEach(([dx, dy], i) => D(cx + dx, tl + dy, ch[i % ch.length]));
      }
    }
    // belt
    if (P.untucked && !jacket && !skirt) { R(cx - (ww >> 1), waist, ww, 2, body[1]); R(cx + (ww >> 1) - 2, waist, 2, 2, body[0]); D(cx - 2, waist + 1, body[0]); }
    else if (!skirt) { R(cx - (ww >> 1), waist, ww, 1, shade(P.pants, -0.45)); if (!back) D(cx, waist, '#c8a040'); }
    if (P.keys && !back) { R(cx + 3, waist + 1, 2, 2, P.keys); D(cx + 4, waist + 3, shade(P.keys, -0.3)); D(cx + 2, waist + 2, shade(P.keys, 0.3)); }
    // arms
    const armLen = torsoLen + 1;
    const swingA = [0, 1, 0, -1][walkF] || 0;
    for (const side of [-1, 1]) {
      const ax = side < 0 ? cx - (sw >> 1) - 2 : cx + (sw >> 1) - 1;
      const sl = side < 0 ? sleeve[1] : sleeve[0];
      const off = side < 0 ? swingA : -swingA;
      if (reach && side > 0 && !back) {
        // arm raised forward
        R(ax, top + 1, 3, 5, sl); R(ax - 1, top + 5, 3, 3, sl); R(ax - 2, top + 7, 3, 2, skin[1]);
        continue;
      }
      const len = armLen + off;
      if (sleeveShort) { R(ax, top + 1, 3, 5, sl); R(ax, top + 6, 3, len - 7, side < 0 ? skin[1] : skin[0]); }
      else R(ax, top + 1, 3, len - 2, sl);
      if (side < 0) D(ax, top + 1, (jacket || shirt)[2]);
      R(ax, top + len - 1, 3, 2, side < 0 ? skin[1] : skin[0]);
      armExtras(ax, top, len, side, back);
    }
    if (!back && P.prop && P.prop !== 'camera') propFront(cx + (sw >> 1) - 1, top + armLen, cx - (sw >> 1) - 2);
  }
  function hline2(x, y, w, c) { R(x, y, w, 1, c); }
  function armExtras(ax, tp, len, side, back) {
    if (P.armbands) { const c = r3(P.armbands); R(ax, tp + len - 8, 3, 6, side < 0 ? c[1] : c[0]); D(ax, tp + len - 8, c[2]); }
    if (P.cuffs) { R(ax, tp + len - 3, 3, 1, P.cuffs); D(ax + 1, tp + len - 4, P.cuffs); }
    if (P.bracelets) { R(ax, tp + len - 2, 3, 1, P.bracelets); D(ax + (side < 0 ? 0 : 2), tp + len - 1, shade(P.bracelets, 0.3)); }
    if (P.sleeveNotes && !back) { const c = P.sleeveNotes; R(ax, tp + 4, 2, 2, c); R(ax + 1, tp + 8, 2, 2, side < 0 ? '#f080b0' : '#80d0f0'); }
  }
  /** Prop held in the hand (front view). hx,hy = the viewer-right hand; lx = the other arm x. */
  function propFront(hx, hy, lx) {
    const pc = P.propColor;
    if (P.prop === 'folder') { const c = r3(pc || '#c0a060'); R(lx - 1, top + 4, 2, 10, c[1]); D(lx - 1, top + 4, c[2]); R(lx - 1, top + 13, 2, 1, c[0]); }
    else if (P.prop === 'laptop') { R(lx - 1, top + 4, 2, 11, pc || '#c8ccd4'); D(lx - 1, top + 9, '#f0e040'); }
    else if (P.prop === 'mallet') { const c = r3(pc || '#8c552c'); R(hx + 1, hy - 7, 1, 8, '#6c3e22'); R(hx, hy - 10, 3, 3, c[1]); D(hx, hy - 10, c[2]); }
    else if (P.prop === 'stamps') { const c = pc || '#952a24'; R(hx - 1, hy + 1, 5, 2, '#2a2020'); D(hx - 1, hy, c); D(hx + 1, hy, '#406ebc'); D(hx + 3, hy, '#4cc060'); }
    else if (P.prop === 'postits') { R(hx - 1, hy, 4, 3, '#f0e050'); D(hx + 2, hy, '#f080b0'); D(hx + 2, hy + 1, '#60c070'); D(hx + 2, hy + 2, '#5090e0'); }
    else if (P.prop === 'eyedrops') { R(hx + 1, hy - 1, 2, 3, '#f4f8ff'); D(hx + 1, hy - 2, pc || '#40a0e0'); }
    else if (P.prop === 'phone') { R(hx, hy - 1, 2, 3, pc || '#202028'); D(hx, hy - 1, '#80c0ff'); }
  }
  function legsFront(walkF, back) {
    const lift = [0, 2, 0, 0][walkF] || 0, lift2 = [0, 0, 0, 2][walkF] || 0;
    const lw = Math.max(3, (ww >> 1) - 1);
    const lx = cx - lw - 0, rx = cx;
    if (skirt) {
      const sh = Math.round(legLen * 0.55);
      for (let i = 0; i < sh; i++) { const w = ww + Math.floor(i / 3); R(cx - (w >> 1), waist + i, w, 1, skirt[1]); D(cx + (w >> 1) - 1, waist + i, skirt[0]); }
      R(lx + 1, waist + sh, 2, legLen - sh - lift, skin[1]);
      R(rx + 1, waist + sh, 2, legLen - sh - lift2, skin[0]);
    } else {
      R(lx, waist + 1, lw, legLen - lift, pants[1]);
      R(rx, waist + 1, lw, legLen - lift2, pants[1]);
      R(rx + lw - 1, waist + 1, 1, legLen - lift2, pants[0]);
      D(lx, waist + 2, pants[2]);
      R(rx, waist + 2, 1, legLen - 3 - lift2, pants[0]);
    }
    // shoes
    const sy = feetY - 1;
    R(lx - 1, sy - lift, lw + 1, 2, shoes[1]); D(lx - 1, sy - lift, shoes[2]);
    R(rx, sy - lift2, lw + 1, 2, shoes[0]);
    if (back) { R(lx - 1, sy - lift + 1, lw + 1, 1, shoes[0]); }
  }
  function bodySide(walkF, reach, anim) {
    const L = cx - (sideW >> 1) - 1;
    // legs: [frontFootX, backFootX, liftFront, liftBack]
    const poses = [[5, -4, 0, 0], [1, -1, 0, 2], [-4, 5, 0, 0], [-1, 1, 2, 0]];
    const pose = anim === 'walk' ? poses[walkF] : [1, -1, 0, 0];
    const hipY = waist + 1;
    const lw = Math.max(3, Math.round(sideW * 0.5));
    const leg = (footDX, lift, cols) => {
      const steps = legLen;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const xx = Math.round(cx - 1 + footDX * t);
        const yy = hipY + i - (t > 0.5 ? Math.round(lift * (t - 0.5) * 2) : 0);
        if (skirt && i < legLen * 0.55) continue;
        R(xx - (lw >> 1), yy, lw, 1, skirt ? cols.skin : cols.p);
        D(xx - (lw >> 1) + lw - 1, yy, skirt ? cols.skinD : cols.pd);
      }
      const fx = Math.round(cx - 1 + footDX) - (lw >> 1), fy = feetY - 1 - lift;
      R(fx, fy, lw + 3, 2, cols.s); D(fx + lw + 2, fy, cols.sd);
    };
    // far leg (darker) then near leg
    leg(pose[1], pose[3], { p: pants[0], pd: shade(P.pants, -0.5), s: shoes[0], sd: shoes[0], skin: skin[0], skinD: skin[0] });
    leg(pose[0], pose[2], { p: pants[1], pd: pants[0], s: shoes[1], sd: shoes[2], skin: skin[1], skinD: skin[0] });
    if (skirt) { const sh = Math.round(legLen * 0.55); for (let i = 0; i < sh; i++) { const w = sideW + 1 + Math.floor(i / 3); R(cx - (w >> 1) - 1, waist + i, w, 1, skirt[1]); D(cx - (w >> 1) - 1 + w - 1, waist + i, skirt[0]); } }
    // torso
    const body = jacket || vest || shirt;
    for (let yy = top; yy <= waist; yy++) {
      const t = (yy - top) / torsoLen;
      let w = sideW, x0 = L;
      if (P.build === 'heavy' && t > 0.3) { w += 2; }
      if (yy === top) { x0 += 1; w -= 2; }
      R(x0, yy, w, 1, body[1]);
      D(x0, yy, body[0]); D(x0 + w - 1, yy, body[2]);
    }
    if (P.stripes && !jacket) for (let yy = top + 2; yy < waist; yy += 3) R(L, yy, sideW, 1, P.stripes);
    // shirt front + tie
    if (jacket || vest) { R(L + sideW - 2, top, 2, 6, shirt[1]); }
    else R(L + sideW - 3, top, 2, 1, shirt[2]);
    if (P.tie) R(L + sideW - 1, top + 1, 1, 7, P.tie);
    if (P.scarf) R(L + 1, top - 1, sideW, 2, P.scarf);
    if (P.badge) { R(L + sideW - 1, top + 6, 2, 3, '#f4f0e0'); }
    if (!skirt) R(L, waist, sideW, 1, shade(P.pants, -0.45));
    // arm (near) with swing
    const swing = anim === 'walk' ? [-3, 0, 3, 0][walkF] : 0;
    const armLen = torsoLen + 1;
    const ax = cx - 1;
    if (reach) {
      R(ax - 1, top + 1, 3, 3, sleeve[1]);
      R(ax, top + 3, 7, 3, sleeve[1]); R(ax, top + 5, 7, 1, sleeve[0]);
      R(ax + 7, top + 3, 2, 3, skin[1]);
    } else {
      for (let i = 0; i < armLen; i++) {
        const t = i / armLen;
        const xx = Math.round(ax + swing * t);
        const isSkin = i >= armLen - 2 || (sleeveShort && i > 5);
        R(xx - 1, top + 1 + i, 3, 1, isSkin ? skin[1] : sleeve[1]);
        D(xx + 1, top + 1 + i, isSkin ? skin[0] : sleeve[0]);
      }
      const hx = Math.round(ax + swing), hy = top + armLen;
      if (P.armbands) R(hx - 1, hy - 7, 3, 5, P.armbands);
      if (P.cuffs) R(hx - 1, hy - 2, 3, 1, P.cuffs);
      if (P.bracelets) R(hx - 1, hy - 1, 3, 1, P.bracelets);
      if (P.prop === 'mallet') { R(hx + 1, hy - 6, 1, 8, '#6c3e22'); R(hx, hy - 9, 3, 3, P.propColor || '#8c552c'); }
      else if (P.prop === 'stamps') R(hx, hy + 1, 3, 2, '#2a2020');
      else if (P.prop === 'postits') R(hx, hy, 3, 3, '#f0e050');
      else if (P.prop === 'eyedrops') R(hx + 1, hy - 1, 1, 3, '#f4f8ff');
      else if (P.prop === 'phone') R(hx + 1, hy - 1, 2, 3, '#202028');
    }
    if (P.backpack) { const bc = r3(P.backpack); R(L - 3, top + 1, 4, 10, bc[1]); R(L - 3, top + 10, 4, 1, bc[0]); D(L - 3, top + 1, bc[2]); D(L - 2, top + 4, '#e0b030'); D(L - 3, top + 7, '#c03030'); }
    if (P.hood) { const hc = r3(P.hood); R(L - 1, top - 2, 3, 4, hc[1]); D(L - 1, top - 2, hc[2]); }
    if (P.suspenders) R(L + sideW - 3, top, 1, torsoLen, P.suspenders);
    if (P.prop === 'folder' || P.prop === 'laptop') { const c = P.propColor || (P.prop === 'laptop' ? '#c8ccd4' : '#c0a060'); R(cx - 3, top + 5, 6, 2, c); }
    if (P.prop === 'camera') { R(L + sideW - 1, top + 6, 3, 4, P.propColor || '#2a2a30'); D(L + sideW + 1, top + 7, '#c0e0ff'); }
    if (P.badge) { const n = Math.max(1, P.badges | 0); for (let i = 1; i < Math.min(n, 4); i++) R(L + sideW - 1, top + 6 + i * 2, 2, 2, ['#c03030', '#3070c0', '#e0b030'][i % 3]); }
    if (P.neckphones) R(L + 1, top - 1, sideW - 1, 2, P.neckphones);
    if (P.untucked && !jacket && !skirt) R(L, waist, sideW, 2, (shirt)[1]);
  }

  function draw(ctx, anim, dir, frame) {
    g = ctx;
    const walkF = anim === 'walk' ? frame : 0;
    const reach = anim === 'reach';
    if (dir === 'right') {
      const bob = anim === 'walk' && (frame === 1 || frame === 3) ? -1 : 0;
      ctx.save(); ctx.translate(0, bob);
      bodySide(walkF, reach, anim);
      headSide(anim, frame);
      ctx.restore();
    } else {
      const back = dir === 'up';
      const bob = anim === 'walk' && (frame === 1 || frame === 3) ? -1 : 0;
      ctx.save(); ctx.translate(0, bob);
      legsFront(walkF, back);
      torsoFront(back, walkF, reach);
      headFront(back, anim, frame);
      ctx.restore();
    }
  }

  return {
    w: W, h: H, ox: cx, oy: feetY,
    headY: headTop - 4,               // pixel row of top of head (for speech placement)
    hipY: waist, legLen,              // cadera (fila del cinturón) y largo de pierna: pose sentada (engine/pose.js)
    handY: top + torsoLen + 1, handX: (sw >> 1) + 2,   // mano (para api.sostener): fila y distancia al eje
    anims: { idle: { frames: 2, fps: 0 }, walk: { frames: 4, fps: 8 }, talk: { frames: 3, fps: 9 }, reach: { frames: 1, fps: 0 } },
    dirs: ['down', 'up', 'right'],
    mirrorLeft: true,
    outline: p.outline === undefined ? '#140e1a' : p.outline,
    params: P,
    draw,
  };
}

/**
 * Helper for authors: build a custom sprite from a single draw function.
 * defineSprite({ w, h, ox, oy, anims, dirs, draw(ctx, anim, dir, frame) })
 */
export function defineSprite(def) {
  return {
    ox: def.w >> 1, oy: def.h - 1, anims: { idle: { frames: 1, fps: 0 } }, dirs: ['down'], mirrorLeft: true,
    headY: 0, ...def,
  };
}
