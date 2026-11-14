// Title screen, pause/save/load menu, ending credits.
import { drawText, measure, wrap, LINE_H } from './font.js';
import { rect, ditherOverlay, frameRect, gradV, PAL, hline } from './draw.js';
import { toggleFullscreen, fullscreenLabel, isStandalone } from './fullscreen.js';

export const C = { item: '#9cbcec', hover: '#ffe27a', dis: '#8e8a9e', title: '#f4e6c0', box: '#0e0c1a', boxLine: '#4a4070', faint: '#a49ec4' };

// ------------------------------------------------------------- generic menu
function layoutItems(items, cx, y0, lh = 13) {
  return items.map((it, i) => {
    const w = measure(it.label, { bold: !!it.bold });
    return { ...it, x: Math.round(cx - w / 2), y: y0 + i * lh, w, h: lh };
  });
}
function drawItems(g, game, lay) {
  const m = game.mouse;
  for (const it of lay) {
    const hov = it.enabled !== false && m.inside && !m.touch && m.x >= it.x - 4 && m.x < it.x + it.w + 4 && m.y >= it.y && m.y < it.y + it.h;
    const col = it.enabled === false ? C.dis : hov ? C.hover : (it.color || C.item);
    drawText(g, it.label, it.x, it.y, col, { bold: !!it.bold });
  }
}
function hitItems(lay, x, y) {
  return lay.find(it => it.enabled !== false && x >= it.x - 4 && x < it.x + it.w + 4 && y >= it.y && y < it.y + it.h);
}
function fmtDate(ts) {
  const d = new Date(ts);
  const p = n => String(n).padStart(2, '0');
  return `${p(d.getDate())}/${p(d.getMonth() + 1)} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

// ------------------------------------------------------------- title
function titleItems(game) {
  const items = [{ label: game.G.title && game.G.title.newGame || 'Nueva partida', act: 'new' }];
  if (game.slotInfo('auto')) items.push({ label: 'Continuar', act: 'continue' });
  items.push({ label: 'Cargar partida', act: 'load', enabled: [1, 2, 3].some(s => game.slotInfo(s)) });
  if (!isStandalone()) items.push({ label: fullscreenLabel(), act: 'fullscreen' });
  return items;
}
export function drawTitle(game, g) {
  const T = game.G.title || {};
  try {
    if (T.draw) T.draw(g, game.realTime);
    else { gradV(g, 0, 0, 320, 200, [PAL.night[0], PAL.night[2], PAL.dusk[3]]); drawText(g, T.text || game.G.name || 'Aventura', 160, 60, C.title, { align: 'center', scale: 2 }); }
  } catch (e) { game.error('title.draw falló', e); T.draw = null; }
  if (game.titleSub === 'load') { drawSlotPicker(game, g, 'load'); return; }
  const items = titleItems(game);
  // con pie (lema) en y=187, la última opción debe acabar antes de él: el menú sube si tiene más de tres entradas (B1)
  const y0 = T.footer ? Math.min(T.menuY ?? 150, 176 - (items.length - 1) * 12) : (T.menuY ?? 150);
  const lay = layoutItems(items, 160, y0, 12);
  game.titleLayout = lay;
  drawItems(g, game, lay);
  if (T.footer) drawText(g, T.footer, 160, 187, C.faint, { align: 'center' });
}
export function titleClick(game, x, y) {
  game.audio.unlock();
  if (game.titleSub === 'load') { slotPickerClick(game, x, y, 'load'); return; }
  const it = hitItems(game.titleLayout || [], x, y);
  if (!it) return;
  game.audio.sfx('select');
  if (it.act === 'new') game.newGame();
  else if (it.act === 'continue') game.load('auto');
  else if (it.act === 'load') game.titleSub = 'load';
  else if (it.act === 'fullscreen') toggleFullscreen(game);
}
export function goTitle(game) {
  game.resetRuntime();
  game.mode = 'title';
  game.titleSub = null;
  game.state = null;
  const T = game.G.title || {};
  game.audio.play(T.music || null, 1);
}

// ------------------------------------------------------------- slot picker (title + menu)
function slotItems(game, kind) {
  const items = [];
  const slots = kind === 'load' ? ['auto', 1, 2, 3] : [1, 2, 3];
  for (const s of slots) {
    const inf = game.slotInfo(s);
    const name = s === 'auto' ? 'Autoguardado' : 'Ranura ' + s;
    items.push({ label: inf ? `${name}: ${inf.roomName} (${fmtDate(inf.date)})` : `${name}: vacía`, slot: s, enabled: kind === 'save' || !!inf });
  }
  items.push({ label: 'Volver', act: 'back' });
  return items;
}
function drawBox(g, x, y, w, h) {
  g.save(); g.globalAlpha = 0.6; rect(g, 0, 0, 320, 200, '#04030a'); g.restore();
  rect(g, x, y, w, h, C.box);
  frameRect(g, x, y, w, h, C.boxLine);
  frameRect(g, x + 2, y + 2, w - 4, h - 4, '#241e3a');
}
function drawSlotPicker(game, g, kind) {
  drawBox(g, 20, 40, 280, 110);
  drawText(g, kind === 'save' ? 'Guardar partida' : 'Cargar partida', 160, 47, C.title, { align: 'center', bold: true });
  const lay = layoutItems(slotItems(game, kind), 160, 66, 14);
  game.slotLayout = lay;
  drawItems(g, game, lay);
}
function slotPickerClick(game, x, y, kind) {
  const it = hitItems(game.slotLayout || [], x, y);
  if (!it) return;
  game.audio.sfx('select');
  if (it.act === 'back') { if (game.menu) game.menu.page = 'main'; else game.titleSub = null; return; }
  if (kind === 'save') {
    game.save(it.slot); game.menu.page = 'main';
    // optional gag (game.saveMessages, game.saveFirstLine): messages shown one after another
    const seq = (game.G.saveMessages || []).map((t, i) => ({ text: t, at: game.realTime + i * 450 }));
    let tEnd = game.realTime + seq.length * 450;
    if (game.G.saveFirstLine && !game.settings.savedOnce) {
      const ms = game.timedMs('menú', game.G.saveFirstLine.text, 2600);
      seq.push({ text: game.G.saveFirstLine.text, color: game.G.saveFirstLine.color, at: tEnd, ms }); tEnd += ms;
      game.settings.savedOnce = true; game.saveSettings();
    }
    seq.push({ text: 'Partida guardada.', at: tEnd });
    game.menu.msg = null; game.menu.msgSeq = seq;
    return;
  }
  game.titleSub = null;
  game.menu = null;
  game.load(it.slot);
}

// ------------------------------------------------------------- pause menu
const SPEEDS = [[1.6, 'Lenta'], [1, 'Normal'], [0.6, 'Rápida']];
function menuItems(game) {
  const s = game.settings;
  const sp = SPEEDS.reduce((b, x) => Math.abs(x[0] - s.textSpeed) < Math.abs(b[0] - s.textSpeed) ? x : b)[1];
  const items = [
    { label: 'Continuar', act: 'resume' },
    { label: 'Ver objetos de la sala (H)', act: 'hotspots', enabled: !!game.room && game.mode === 'play' },
    { label: 'Guardar partida', act: 'save', enabled: !game.busy },
    { label: 'Cargar partida', act: 'load', enabled: !game.busy },
    ...(game.G.help ? [{ label: 'Cómo se juega', act: 'help' }] : []),
    { label: `Velocidad del texto: ${sp}`, act: 'speed' },
    { label: `Música: ${Math.round(s.music * 100)}%`, act: 'music' },
    { label: `Efectos: ${Math.round(s.sfx * 100)}%`, act: 'sfx' },
  ];
  // (el selector de dificultad decorativo se quitó: no hacía nada y la crítica lo señaló como engaño, §6.7)
  items.push({ label: fullscreenLabel(), act: 'fullscreen', enabled: !isStandalone() });
  items.push({ label: 'Salir al título', act: 'quit' });
  return items;
}
export function drawMenu(game, g) {
  const m = game.menu;
  if (m.page === 'save' || m.page === 'load') { drawSlotPicker(game, g, m.page); return; }
  if (m.page === 'quit') {
    const Q = game.G.quitConfirm || {};
    drawBox(g, 40, 62, 240, 66);
    wrap(Q.text || '¿Salir al título?', 220).forEach((l, i) => drawText(g, l, 160, 72 + i * 11, C.title, { align: 'center' }));
    const lay = [{ label: '[ ' + (Q.yes || 'Sí') + ' ]', act: 'yes' }, { label: '[ ' + (Q.no || 'No') + ' ]', act: 'no' }]
      .map((it, i) => { const w = measure(it.label); return { ...it, x: Math.round(i ? 196 - w / 2 : 124 - w / 2), y: 104, w, h: 12 }; });
    m.layout = lay;
    drawItems(g, game, lay);
    return;
  }
  if (m.page === 'help') {
    const H = game.G.help || [];
    drawBox(g, 16, 14, 288, 172);
    drawText(g, 'Cómo se juega', 160, 20, C.title, { align: 'center', bold: true });
    hline(g, 36, 34, 248, '#2a2444');
    let yy = 38;
    for (const l of H) for (const w of wrap(l, 270)) { drawText(g, w, 26, yy, /^[·\s]/.test(l) ? C.item : '#c8c4d8'); yy += 11; }
    const lab = '[ Volver ]', w = measure(lab);
    m.layout = [{ label: lab, act: 'back', x: Math.round(160 - w / 2), y: 168, w, h: 12 }];
    drawItems(g, game, m.layout);
    return;
  }
  const items = menuItems(game);
  const lh = items.length > 10 ? 12 : 13, by = items.length > 10 ? 14 : 24;
  const bh = 30 + items.length * lh + 6;
  drawBox(g, 60, by, 200, bh);
  drawText(g, 'Pausa', 160, by + 6, C.title, { align: 'center', bold: true });
  hline(g, 80, by + 20, 160, '#2a2444');
  const lay = layoutItems(items, 160, by + 25, lh);
  m.layout = lay;
  drawItems(g, game, lay);
  let msg = m.msg, col = '#9cf0a4';
  if (m.msgSeq) { const cur = m.msgSeq.filter(x => x.at <= game.realTime).pop(); if (cur) { msg = cur.text; col = cur.color || col; } }
  if (msg) wrap(msg, 300).forEach((l, i) => drawText(g, l, 160, Math.min(188 - i * 11, by + bh + 4 + i * 11), col, { align: 'center' }));
}
export function menuClick(game, x, y) {
  const m = game.menu;
  if (m.page === 'save' || m.page === 'load') { slotPickerClick(game, x, y, m.page); return; }
  const it = hitItems(m.layout || [], x, y);
  if (!it) return;
  game.audio.sfx('select');
  const s = game.settings;
  m.msg = null; m.msgSeq = null;
  if (m.page === 'quit') { if (it.act === 'yes') { game.menu = null; goTitle(game); } else m.page = 'main'; return; }
  if (m.page === 'help') { m.page = 'main'; return; }
  switch (it.act) {
    case 'help': m.page = 'help'; break;
    case 'resume': game.toggleMenu(); break;
    case 'hotspots': game.toggleMenu(); game.showHotspots(); break;
    case 'save': m.page = 'save'; break;
    case 'load': m.page = 'load'; break;
    case 'speed': { const i = SPEEDS.findIndex(x => Math.abs(x[0] - s.textSpeed) < 0.01); s.textSpeed = SPEEDS[(i + 1) % SPEEDS.length][0]; game.saveSettings(); break; }
    case 'music': s.music = Math.round(((s.music + 0.2) > 1.01 ? 0 : s.music + 0.2) * 10) / 10; game.saveSettings(); break;
    case 'sfx': s.sfx = Math.round(((s.sfx + 0.2) > 1.01 ? 0 : s.sfx + 0.2) * 10) / 10; game.saveSettings(); game.audio.sfx('pickup'); break;
    case 'fullscreen': toggleFullscreen(game); break;
    case 'quit': if (game.G.quitConfirm) m.page = 'quit'; else { game.menu = null; goTitle(game); } break;
  }
}

// ------------------------------------------------------------- iPhone: cómo jugar a pantalla completa
/** Panel que sale al pulsar «Pantalla completa» en el Safari del iPhone (no tiene Fullscreen API): instalar la web app. */
export function drawIosHelp(game, g) {
  g.save(); g.globalAlpha = 0.75; rect(g, 0, 0, 320, 200, '#04030a'); g.restore();
  const x = 24, y = 22, w = 272, h = 152;
  rect(g, x, y, w, h, C.box); frameRect(g, x, y, w, h, C.boxLine); frameRect(g, x + 2, y + 2, w - 4, h - 4, '#241e3a');
  drawText(g, 'Pantalla completa en el iPhone', 160, y + 8, C.title, { align: 'center', bold: true });
  hline(g, x + 20, y + 21, w - 40, '#2a2444');
  const L = [
    ['El Safari del iPhone no deja poner', C.item], ['un juego a pantalla completa. Pero se puede', C.item], ['instalar como una app:', C.item], ['', ''],
    ['1. Toca Compartir (el cuadrado con la flecha).', '#eee2ff'], ['2. Elige «Añadir a pantalla de inicio».', '#eee2ff'],
    ['3. Abre FE DE ERRATAS desde su icono', '#eee2ff'], ['   con el móvil en horizontal.', '#eee2ff'], ['', ''],
    ['Se juega sin barras y se guarda la partida.', C.faint],
  ];
  L.forEach(([t, c], i) => { if (t) drawText(g, t, x + 14, y + 28 + i * 10, c); });
  // icono de Compartir dibujado: cuadrado con flecha hacia arriba
  const sx = x + w - 30, sy = y + 66;
  frameRect(g, sx, sy + 4, 11, 10, '#9cbcec'); rect(g, sx + 4, sy + 4, 3, 1, C.box);
  rect(g, sx + 5, sy - 2, 1, 10, '#ffe27a'); rect(g, sx + 3, sy, 5, 1, '#ffe27a'); rect(g, sx + 4, sy - 1, 3, 1, '#ffe27a');
  drawText(g, '[ Entendido ]', 160, y + h - 14, C.hover, { align: 'center' });
}

// ------------------------------------------------------------- ending / credits
// Two flavours share the same scrolling screen:
//   api.ending(opts)  → the game is over: when the player clicks at the end it returns to the title (the finished
//                       game's state is kept in game.finished for tests: __game.state().finished).
//   api.credits(opts) → credits INSIDE the game (keep: true): when the text has scrolled away (+ opts.holdMs, default
//                       1200 ms) it resolves by itself and the game goes back to 'play' in the same room, so a script
//                       can carry on (post-credits scene). A click fast-forwards.
// In fast mode (tests, __game.skipText(true)) both resolve at once.
// opts: { credits: [...], draw(g, t) background, overlay(g, t) drawn OVER the text, speed (px/s), startY, holdY,
//         theEnd ('FIN' | false), music, topY (lines above this y are not drawn; default 0), holdMs }
export function startEnding(game, opts = {}, keep = false) {
  return new Promise(resolve => {
    const E = { ...(game.G.ending || {}), ...opts };
    E.speed = (E.speed || 14) / (game.settings.textSpeed || 1);     // los créditos van al ritmo de la velocidad del texto
    game.ending = { def: E, t: 0, resolve, lines: [], keep, prevMode: game.mode };
    for (const c of E.credits || game.G.credits || []) {
      if (typeof c === 'string') game.ending.lines.push(...(c ? wrap(c, E.textW || 280).map(t => ({ t, col: '#d8d0f0' })) : [{ t: '', col: '' }]));
      else game.ending.lines.push(...wrap(c.text, E.textW || 280).map(t => ({ t, col: c.color || (c.title ? '#f2d468' : '#d8d0f0'), bold: !!c.title })));
    }
    game.mode = 'ending';
    if (E.music !== undefined) game.audio.play(E.music, 1.5);
    if (game.fast) { finishEnding(game); }
  });
}
function endingDone(e) {
  const speed = e.def.speed || 14;
  const y0 = 200 - e.t / 1000 * speed + (e.def.startY ?? 0);
  const endY = y0 + e.lines.length * (LINE_H + 2);
  if (endY < (e.def.holdY ?? 90) && !e.doneAt) e.doneAt = e.t;
  return { y0, endY };
}
export function updateEnding(game, dt) {
  const e = game.ending; if (!e) return;
  e.t += dt * 1000;
  endingDone(e);
  if (e.keep && e.doneAt && e.t - e.doneAt > (e.def.holdMs ?? 1200)) finishEnding(game);
}
function finishEnding(game) {
  const e = game.ending; if (!e) return;
  game.ending = null;
  if (e.keep) { game.mode = e.prevMode === 'ending' ? 'play' : (e.prevMode || 'play'); game.ui.hover = null; }
  else {
    try { game.finished = game.state ? JSON.parse(JSON.stringify(game.state)) : null; } catch (err) { game.finished = null; }
    goTitle(game);
  }
  e.resolve();
}
export function drawEnding(game, g) {
  const e = game.ending; if (!e) return;
  try { if (e.def.draw) e.def.draw(g, e.t); else gradV(g, 0, 0, 320, 200, [PAL.ink[0], PAL.night[1], PAL.night[2]]); }
  catch (err) { game.error('ending.draw falló', err); e.def.draw = null; }
  const { y0 } = endingDone(e);
  const topY = e.def.topY ?? 0;
  e.lines.forEach((l, i) => {
    const y = Math.round(y0 + i * (LINE_H + 2));
    if (y < Math.max(-12, topY) || y > 200) return;
    drawText(g, l.t, 160, y, l.col, { align: 'center', bold: l.bold });
  });
  try { if (e.def.overlay) e.def.overlay(g, e.t); } catch (err) { game.error('ending.overlay falló', err); e.def.overlay = null; }
  if (e.doneAt) {
    if (e.def.theEnd !== false) drawText(g, e.def.theEnd || 'FIN', 160, 92, '#f2d468', { align: 'center', scale: 2 });
    if (!e.keep && e.t - e.doneAt > 1200) drawText(g, 'Haz clic para volver al título', 160, 180, C.faint, { align: 'center' });
  }
}
export function endingClick(game) {
  const e = game.ending; if (!e) return;
  if (e.doneAt && e.t - e.doneAt > 1200) finishEnding(game);
  else e.t += 4000; // fast-forward
}
