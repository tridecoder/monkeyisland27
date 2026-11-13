// «Primer plano del móvil» para LLAMADAS DE TELÉFONO (api.phone). Genérico: el contenido solo da el id del actor que llama.
//   await api.phone.open({ caller: 'abuela_remedios', label: 'Abuela' })   // desliza el móvil, suena, Bruno descuelga
//   await api.phone.say('¿Bruno? ¿Has comido?')                            // habla quien llama, anclado al móvil
//   await api.say('He comido.')                                           // Bruno sigue hablando sobre Bruno
//   await api.phone.close()                                               // cuelga y el móvil se desliza fuera
//   await api.phone.call(opts, async (api) => { ... })                    // open + try/finally close
// Estado: game.phone (no se guarda; los scripts en marcha tampoco). Se retira SIEMPRE: al cerrar, al saltar la cinemática,
// al acabar el script que lo abrió (aunque lance una excepción) y al cargar partida.
import { PAL, rect, hline, vline, px, line, ellipse, ditherOverlay, gradV, glow } from './draw.js';
import { drawText, measure } from './font.js';
import { getFrame } from './sprites.js';

export const PW = 96, PH = 146, PY = 2;       // cuerpo del móvil (px), y de su borde superior
const SLIDE_MS = 380, HANG_MS = 520;
const PORT_W = 72, PORT_H = 54;

const SFX = {
  pick: [{ wave: 'square', f: [900, 1500], dur: 0.05, vol: 0.1 }, { wave: 'square', f: [1500, 1500], dur: 0.05, vol: 0.08, at: 0.08 }],
  hang: [{ wave: 'square', f: [900, 900], dur: 0.07, vol: 0.09 }, { wave: 'square', f: [700, 700], dur: 0.07, vol: 0.09, at: 0.1 }, { wave: 'square', f: [520, 380], dur: 0.16, vol: 0.09, at: 0.2 }],
  dial: [{ wave: 'triangle', f: [425, 425], dur: 0.45, vol: 0.12 }],
  buzz: [{ wave: 'square', f: [110, 100], dur: 0.14, vol: 0.09, duty: 0.3 }, { wave: 'square', f: [110, 100], dur: 0.14, vol: 0.09, duty: 0.3, at: 0.2 }],
};

const ease = {
  outBack: (k) => { const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); },
  inCubic: (k) => k * k * k,
};

/** Posición (px de pantalla) del borde izquierdo del móvil en reposo. */
const restX = (P) => (P.side === 'right' ? 320 - PW - 6 : 6);
/** Zona de pantalla libre (donde hablan los demás) mientras el móvil está abierto: [x0, x1]. */
export function freeRange(game) {
  const P = game.phone;
  if (!P) return [3, 317];
  return P.side === 'right' ? [3, restX(P) - 5] : [restX(P) + PW + 5, 317];
}
/** Dónde sale el texto del que llama: junto al móvil, en el hueco libre, con un piquito que apunta a su retrato. */
export function anchor(game) {
  const P = game.phone;
  if (!P) return null;
  const [lo, hi] = freeRange(game);
  const cx = Math.round((lo + hi) / 2), width = Math.min(168, hi - lo - 8);
  const tx = P.side === 'right' ? restX(P) + 4 : restX(P) + PW - 4;
  return { at: [cx + Math.round(game.camX), 56], width, tail: [tx, PY + 70], phone: true };
}
export const talking = (game) => !!(game.phone && game.isTalking(game.phone.caller));

// ------------------------------------------------------------------ ciclo de vida
export async function open(game, ctx, opts = {}) {
  const a = game.actors[opts.caller];
  if (!a) { game.error('phone.open: actor desconocido ' + opts.caller); return false; }
  if (game.phone) kill(game);
  const pl = game.player;
  const sx = pl ? pl.x - game.camX : 160;
  const P = game.phone = {
    caller: a.id, label: opts.label || a.name, sub: opts.sub || null, color: opts.color || a.color,
    side: opts.side || (sx < 165 ? 'right' : 'left'),          // al lado contrario de Bruno
    state: 'ring', t0: game.time, tState: game.time, callT0: 0, outgoing: !!opts.outgoing, ear: false, owner: ctx,
  };
  game.log.push({ who: 'aviso', name: null, text: (P.outgoing ? 'Llamada a ' : 'Llamada de ') + P.label, room: game.state && game.state.room, t: Math.round(game.time) });
  if (game.instant) { P.state = 'talk'; P.t0 = game.time - SLIDE_MS * 2; P.callT0 = game.time; P.ear = true; return true; }
  const ringMs = opts.ringMs ?? (P.outgoing ? 1500 : 1600);
  game.audio.sfx(P.outgoing ? SFX.dial : 'phone');
  if (!P.outgoing) game.audio.sfx(SFX.buzz);
  await game.sleep(SLIDE_MS + 350);
  if (game.phone !== P) return false;
  if (ringMs > 1100) {
    game.audio.sfx(P.outgoing ? SFX.dial : 'phone');
    await game.sleep(ringMs - 1100 + 450);
    if (game.phone !== P) return false;
  }
  P.state = 'talk'; P.tState = game.time; P.callT0 = game.time; P.ear = true;
  game.audio.sfx(SFX.pick);
  await game.sleep(320);
  return game.phone === P;
}
export async function close(game, opts = {}) {
  const P = game.phone;
  if (!P) return false;
  game.log.push({ who: 'aviso', name: null, text: 'Cuelga: ' + P.label, room: game.state && game.state.room, t: Math.round(game.time) });
  if (game.instant || opts.instant) { game.phone = null; return true; }
  P.state = 'hang'; P.tState = game.time; P.ear = false;
  P.endSec = Math.floor((game.time - P.callT0) / 1000);
  game.audio.sfx(SFX.hang);
  await game.sleep(HANG_MS);
  if (game.phone !== P) return true;
  P.state = 'out'; P.tState = game.time;
  await game.sleep(SLIDE_MS);
  if (game.phone === P) game.phone = null;
  return true;
}
/** Retira el móvil ya, sin animación (fin de script, carga de partida, excepciones). */
export function kill(game) { game.phone = null; }

// ------------------------------------------------------------------ dibujo
function rrect(g, x, y, w, h, c, r = 4) {
  const inset = [4, 2, 1, 1, 0].slice(0, r + 1);
  g.fillStyle = c;
  for (let i = 0; i < h; i++) {
    const di = i < inset.length ? inset[i] : (h - 1 - i) < inset.length ? inset[h - 1 - i] : 0;
    g.fillRect(x + di, y + i, w - di * 2, 1);
  }
}
const mmss = (s) => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');

/** Retrato genérico: recorta la cabeza del sprite del actor y la amplía ×3. */
function retratoDeSprite(g, w, h, canvas) {
  rect(g, 0, 0, w, h, '#2a2c3c');
  if (!canvas) return;
  const sw = Math.min(24, canvas.width), sh = Math.round(h / 3);
  g.drawImage(canvas, Math.max(0, (canvas.width - sw) >> 1), 0, sw, sh, (w - sw * 3) >> 1, 0, sw * 3, sh * 3);
}
/** Retrato del que llama (72×54) en un canvas fuera de pantalla; se repinta al cambiar mouth/blink. */
function portraitCanvas(game, P, st) {
  const a = game.actors[P.caller];
  const key = st.mouth + '|' + (st.blink ? 1 : 0) + '|' + (a && a.def.portrait ? Math.floor(st.t / 140) : 0);
  if (P._pc && P._pck === key) return P._pc;
  const cv = P._pc || document.createElement('canvas');
  cv.width = PORT_W; cv.height = PORT_H;
  const pg = cv.getContext('2d'); pg.imageSmoothingEnabled = false;
  const def = a && a.def;
  if (def && def.portrait) def.portrait(pg, PORT_W, PORT_H, st);
  else retratoDeSprite(pg, PORT_W, PORT_H, a ? getFrame(game.spriteOf(a), 'idle', 'down', 0).canvas : null);
  P._pc = cv; P._pck = key;
  return cv;
}

function handset(g, x, y, c, flip = false) {          // auricular de 7×5 px
  g.fillStyle = c;
  if (!flip) { g.fillRect(x, y + 3, 2, 2); g.fillRect(x + 1, y + 2, 5, 1); g.fillRect(x + 5, y + 3, 2, 2); g.fillRect(x + 2, y + 1, 3, 1); }
  else { g.fillRect(x, y, 2, 2); g.fillRect(x + 1, y + 2, 5, 1); g.fillRect(x + 5, y, 2, 2); g.fillRect(x + 2, y + 3, 3, 1); }
}

export function draw(g, game) {
  const P = game.phone;
  if (!P) return;
  const t = game.time;
  // posición del deslizamiento: 0 fuera … 1 dentro
  let pos;
  if (P.state === 'out') pos = 1 - ease.inCubic(Math.min(1, (t - P.tState) / SLIDE_MS));
  else if (P.state === 'hang') pos = 1;
  else pos = ease.outBack(Math.min(1, (t - P.t0) / SLIDE_MS));
  const s = Math.max(0, Math.min(1, pos));
  const away = (PW + 14) * (1 - Math.min(1.04, pos));
  const vib = P.state === 'ring' && !P.outgoing && (Math.floor(t / 60) % 2) ? 1 : 0;
  const x0 = Math.round(restX(P) + (P.side === 'right' ? away : -away)) + (P.state === 'ring' && !P.outgoing ? (vib ? 1 : -1) : 0);
  const y0 = PY + (P.state === 'ring' && !P.outgoing ? (Math.floor(t / 90) % 2 ? 1 : 0) : 0);

  g.save();
  g.beginPath(); g.rect(0, 0, 320, 144); g.clip();
  // la sala se apaga detrás del móvil
  g.globalAlpha = 0.5 * Math.max(0, Math.min(1, s)); g.fillStyle = '#05040a'; g.fillRect(0, 0, 320, 144); g.globalAlpha = 1;
  const cx = x0 + PW / 2;
  glow(g, cx, y0 + 66, 68, 74, '#8cc8ff', 0.1 * Math.min(1, s), 4);

  // sombra y cuerpo
  g.globalAlpha = 0.4; rrect(g, x0 + 3, y0 + 3, PW, PH, '#000000', 4); g.globalAlpha = 1;
  rrect(g, x0, y0, PW, PH, '#17151f', 4);
  vline(g, x0 + 1, y0 + 3, PH - 6, '#4c4a62'); hline(g, x0 + 3, y0 + 1, PW - 6, '#4c4a62'); vline(g, x0 + PW - 2, y0 + 4, PH - 8, '#0c0b12');
  rect(g, x0 + PW, y0 + 34, 2, 12, '#5a5870'); rect(g, x0 + PW, y0 + 50, 2, 7, '#5a5870');         // botones laterales
  rect(g, x0 + 34, y0 + 4, 26, 3, '#08070c'); hline(g, x0 + 35, y0 + 4, 24, '#2a2838');             // altavoz
  rect(g, x0 + 66, y0 + 4, 4, 4, '#08070c'); px(g, x0 + 67, y0 + 5, '#3a4a90');                      // cámara
  // pantalla
  const sx = x0 + 5, sy = y0 + 10, sw = PW - 10, sh = PH - 14;
  g.save(); g.beginPath(); g.rect(sx, sy, sw, sh); g.clip();
  const hang = P.state === 'hang';
  gradV(g, sx, sy, sw, sh, hang ? [PAL.red[1], PAL.ink[1], PAL.ink[0]] : [PAL.night[2], PAL.night[1], PAL.night[0], PAL.ink[1]]);
  // barra de estado: cobertura · nombre · batería casi muerta
  for (let i = 0; i < 4; i++) rect(g, sx + 3 + i * 2, sy + 9 - i * 2, 1, 1 + i * 2, i < 3 ? '#e8ecf8' : '#4a5070');
  rect(g, sx + sw - 12, sy + 3, 9, 5, '#e8ecf8'); rect(g, sx + sw - 11, sy + 4, 7, 3, '#10101a'); rect(g, sx + sw - 11, sy + 4, 1, 3, '#ff5040'); rect(g, sx + sw - 3, sy + 4, 1, 3, '#e8ecf8');
  const label = P.label;
  drawText(g, label, Math.round(cx), sy + 1, '#ffffff', { align: 'center', bold: true });
  // línea de estado
  const talk = talking(game);
  const blink = Math.floor(t / 450) % 2 === 0;
  let status, scol = '#9cf0a4';
  if (P.state === 'ring') { status = P.outgoing ? 'Llamando...' : 'Te llama...'; scol = '#ffffff'; }
  else if (hang) { status = mmss(P.endSec || 0); scol = '#ff9a8a'; }
  else status = mmss(Math.floor((t - P.callT0) / 1000));
  const stW = measure(status);
  if (P.state === 'ring' && !blink) scol = '#9aa4c8';
  const gx = Math.round(cx - (stW + 12) / 2);
  const gc = hang || P.state === 'ring' ? (hang ? '#c8402c' : '#3a9a54') : '#2ec060';
  ellipse(g, gx + 4, sy + 21, 4.5, 4.5, gc); handset(g, gx + 1, sy + 19, '#ffffff', hang);
  drawText(g, status, gx + 12, sy + 15, scol);
  // retrato
  const px0 = Math.round(cx - PORT_W / 2), py0 = sy + 30;
  const st = { mouth: talk ? [0, 1, 2, 1, 0, 2, 1, 1][Math.floor(t / 105) % 8] : 0, blink: Math.floor(t / 1000 + P.caller.length) % 4 === 0 && (t % 1000) < 140, t };
  rect(g, px0 - 2, py0 - 2, PORT_W + 4, PORT_H + 4, P.color);
  rect(g, px0 - 1, py0 - 1, PORT_W + 2, PORT_H + 2, '#10101a');
  g.drawImage(portraitCanvas(game, P, st), px0, py0);
  if (P.state === 'ring' && !blink) ditherOverlay(g, px0, py0, PORT_W, PORT_H, '#05040a', 0.15);
  // ecualizador junto al nombre del estado y rótulo «en llamada»
  const ry = py0 + PORT_H + 5;
  if (P.state === 'talk') {
    drawText(g, 'en llamada', Math.round(cx), ry, '#9cf0a4', { align: 'center' });
    for (let i = 0; i < 3; i++) {                                    // ondas de voz a ambos lados del rótulo
      const hgt = talk ? 1 + Math.floor(3 + 3 * Math.sin(t / 70 + i * 1.7)) : 1, col = talk ? '#2ec060' : '#2a5a3a';
      rect(g, sx + 2 + i * 3, ry + 8 - hgt, 2, hgt, col);
      rect(g, sx + sw - 4 - i * 3, ry + 8 - hgt, 2, hgt, col);
    }
  } else if (hang) {
    const lab = 'fin de llamada', lw = measure(lab);
    drawText(g, lab, Math.round(cx), ry, '#ff9a8a', { align: 'center' });
  }
  // botones
  const by = ry + 15;
  if (P.state === 'ring' && !P.outgoing) {
    const pulse = Math.floor(t / 200) % 2;
    ellipse(g, cx - 20, by + 6, 7 + pulse, 7 + pulse, '#2ec060'); handset(g, Math.round(cx - 23), by + 4, '#ffffff');
    ellipse(g, cx + 20, by + 6, 7, 7, '#d83a2a'); handset(g, Math.round(cx + 17), by + 4, '#ffffff', true);
  } else {
    if (P.state !== 'ring') for (let i = 0; i < 3; i++) {
      const bx = Math.round(cx - 27 + i * 27);
      ellipse(g, bx, by + 5, 6, 6, '#3a4468');
      if (i === 0) { rect(g, bx - 1, by + 2, 3, 4, '#c4cce8'); hline(g, bx - 2, by + 6, 5, '#c4cce8'); }                // micro
      else if (i === 1) { for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) px(g, bx - 3 + c * 3, by + 2 + r * 3, '#c4cce8'); }   // teclado
      else { rect(g, bx - 3, by + 3, 3, 4, '#c4cce8'); line(g, bx + 1, by + 2, bx + 3, by, '#c4cce8'); line(g, bx + 1, by + 7, bx + 3, by + 9, '#c4cce8'); }   // altavoz
    }
    ellipse(g, cx, by + 19, 17, 6, hang ? '#7a1c14' : '#d83a2a'); handset(g, Math.round(cx - 3), by + 17, '#ffffff', true);
  }
  g.restore();
  // pantalla rota: esquina superior derecha
  const cxk = sx + sw - 1, cyk = sy;
  g.fillStyle = '#17151f'; g.fillRect(cxk - 7, cyk, 8, 1); g.fillRect(cxk - 5, cyk + 1, 6, 1); g.fillRect(cxk - 3, cyk + 2, 4, 1); g.fillRect(cxk - 1, cyk + 3, 2, 1);
  const crack = '#d8def0', crack2 = '#7d86a8';
  line(g, cxk - 3, cyk + 3, cxk - 20, cyk + 14, crack); line(g, cxk - 3, cyk + 3, cxk - 9, cyk + 22, crack2); line(g, cxk - 2, cyk + 4, cxk - 2, cyk + 28, crack);
  line(g, cxk - 14, cyk + 10, cxk - 24, cyk + 6, crack2); line(g, cxk - 7, cyk + 14, cxk - 18, cyk + 22, crack2); line(g, cxk - 2, cyk + 14, cxk - 12, cyk + 17, crack2);
  px(g, cxk - 6, cyk + 9, '#ffffff'); px(g, cxk - 11, cyk + 12, '#ffffff');
  g.restore();
}

/** Bruno con el móvil en la oreja: brazo levantado y teléfono sobre el sprite (a = actor, s = escala). */
export function drawEar(g, game, a, box) {
  const P = game.phone;
  if (!P || !P.ear || a.dir === 'up') return;
  const s = box.s, f = a.dir === 'left' ? -1 : 1;
  const R = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(w)), Math.max(1, Math.round(h))); };
  const top = box.y, sideX = a.x + f * 7 * s;
  // brazo: manga hasta el codo, antebrazo piel hasta la mano
  const sh = a.def.doll && a.def.doll.shirt || '#9cc8ec';
  const bx = a.x + f * 6 * s;
  R(bx - (f < 0 ? 1.5 * s : 0), top + 21 * s, 3 * s, 7 * s, sh);
  R(bx - (f < 0 ? 1.5 * s : 0) + f * 2 * s, top + 14 * s, 3 * s, 8 * s, sh);
  R(sideX - (f < 0 ? 3 * s : 0), top + 8 * s, 3 * s, 6 * s, '#e8b48c');
  // móvil
  R(sideX + f * 2 * s - (f < 0 ? 3 * s : 0), top + 2 * s, 3 * s, 8 * s, '#17151f');
  R(sideX + f * 2 * s - (f < 0 ? 3 * s : 0) + (f < 0 ? 0 : 2 * s), top + 3 * s, Math.max(1, s), 6 * s, '#7ab8ff');
  R(sideX + f * 2 * s - (f < 0 ? 3 * s : 0), top + 2 * s, 3 * s, 1, '#4c4a62');
}
