#!/usr/bin/env node
// CONTRASTE / LEGIBILIDAD (problema 5 del director). Calcula la razón de contraste WCAG 2.x de cada color de texto:
//   1. Texto hablado de cada PNJ / presencia / objeto que habla / narrador: contra su contorno negro (≥ 7:1) y contra el
//      «fondo ajustado» (la banda translúcida del motor, SPEECH_BACKING, compuesta sobre el fondo real de cada sala,
//      muestreado en la zona donde salen los globos, percentil 98 de luminancia): ≥ 4.5:1 en TODAS las salas.
//   2. Colores de hablantes que coinciden en una sala: distinguibles entre sí (distancia RGB ≥ 60).
//   3. Panel (verbos, frase, opciones normal/hover/deshabilitada, flechas), menú/título/créditos y ventana de duelo
//      (etiquetas, valores, líneas del hilo): ≥ 4.5:1 sobre su fondo.
// Uso: node tools/contrast.mjs [--todo] (con --todo lista todos los valores, no solo los peores)
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from './serve.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const todo = process.argv.includes('--todo');
const server = createServer(path.resolve(here, '..'));
await new Promise(r => server.listen(0, r));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 960, height: 600 } });
const consoleErrors = [];
page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
page.on('pageerror', e => consoleErrors.push(e.message));
await page.goto(`http://localhost:${server.address().port}/`);
await page.waitForFunction(() => !!window.__game);

const r = await page.evaluate(async () => {
  const g = __game.game;
  const core = await import('./engine/core.js');
  const ui = await import('./engine/ui.js');
  const scr = await import('./engine/screens.js');
  const SB = g.G.speechBacking === undefined ? core.SPEECH_BACKING : g.G.speechBacking;
  const rgb = (h) => { h = String(h).replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join(''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); };
  const lum = ([r, gg, b]) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(gg) + 0.0722 * f(b); };
  const ratio = (a, b) => { const la = lum(a), lb = lum(b); return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05); };
  const mixc = (a, b, t) => a.map((v, i) => Math.round(v * (1 - t) + b[i] * t));
  // ---- fondos: zona de globos de cada sala (y 0-110), percentil 98 de luminancia
  await __game.newGame(); __game.skipText(true); await __game.waitIdle();
  const bgs = {};
  for (const id of Object.keys(g.content.rooms)) {
    await g.runScript(async () => { await g.enterRoom(id, null, { restore: true }); }, { label: 'contraste' });
    g.paintRoom();
    const c = g.room.bg, d = c.getContext('2d').getImageData(0, 0, c.width, 110).data;
    const px = [];
    for (let i = 0; i < d.length; i += 4 * 3) px.push([d[i], d[i + 1], d[i + 2]]);
    px.sort((a, b) => lum(a) - lum(b));
    bgs[id] = { p98: px[Math.floor(px.length * 0.98)], p50: px[Math.floor(px.length * 0.5)] };
  }
  // fondo «oscurecido» del clímax (sala_amazonas con su capa) y el negro de los fundidos (narrador)
  bgs.negro = { p98: [0, 0, 0], p50: [0, 0, 0] };
  // ---- hablantes: actores (con o sin sprite), objetos que hablan (color), narrador, avisos
  const speakers = [];
  for (const [id, a] of Object.entries(g.content.actors)) if (a.color) speakers.push({ id, color: a.color });
  for (const [rid, room] of Object.entries(g.content.rooms)) for (const o of room.objects || []) if (o.color) speakers.push({ id: rid + '.' + o.id, color: o.color, room: rid });
  speakers.push({ id: 'narrador', color: g.G.narratorColor || '#ffffff' });
  const textRes = [];
  for (const s of speakers) {
    const c = rgb(s.color);
    const vsOutline = ratio(c, [0, 0, 0]);
    let worst = Infinity, where = '';
    for (const [rid, b] of Object.entries(bgs)) {
      if (s.room && rid !== s.room) continue;
      const eff = mixc(b.p98, rgb(SB ? SB.color : '#000000'), SB ? SB.alpha : 0);
      const k = ratio(c, eff);
      if (k < worst) { worst = k; where = rid; }
    }
    textRes.push({ id: s.id, color: s.color, vsOutline, worst, where });
  }
  // ---- hablantes de una misma sala: que no se confundan
  const near = [];
  const dist = (a, b) => Math.hypot(...a.map((v, i) => v - b[i]));
  for (const [rid, room] of Object.entries(g.content.rooms)) {
    const ids = new Set(['bruno', ...(room.actors || []).map(p => p.id)]);
    const list = [...ids].filter(id => g.content.actors[id] && g.content.actors[id].color).map(id => [id, g.content.actors[id].color]);
    // objetos que CONVERSAN (no los que sueltan una frase suelta, como el torno o el ascensor)
    const TALKERS = ['herminia_portatil', 'portatil_tadeo', 'fax', 'coro_desarrollo', 'custodia_precinto', 'pantalla_titulator'];
    for (const o of room.objects || []) if (o.color && !ids.has(o.id) && TALKERS.includes(o.id)) list.push([o.id, o.color]);
    for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
      // el mismo personaje con dos voces (Teodoro habla por su fax; el coro y sus DEV) no cuenta como «confusión»
      if (list[i][1].toLowerCase() === list[j][1].toLowerCase() && /coro|dev_|teodoro.*fax|fax.*teodoro/.test(list[i][0] + ' ' + list[j][0])) continue;
      const d = dist(rgb(list[i][1]), rgb(list[j][1]));
      if (d < 60) near.push(`${rid}: ${list[i][0]} ${list[i][1]} ≈ ${list[j][0]} ${list[j][1]} (distancia ${Math.round(d)})`);
    }
  }
  // ---- interfaz
  const U = ui.COL, S = scr.C, pbg = rgb(U.bg[2]), mbox = rgb(S.box);
  const uiPairs = [
    ['verbo', U.verb, pbg], ['verbo (hover)', U.verbHover, pbg], ['verbo por defecto', U.verbDefault, pbg], ['verbo/flecha deshabilitado', U.verbOff, pbg],
    ['frase', U.sentence, pbg], ['frase con verbo', U.sentenceVerb, pbg],
    ['opción', U.opt, pbg], ['opción (hover)', U.optHover, pbg], ['opción deshabilitada', U.optDisabled, pbg],
    ['menú: item', S.item, mbox], ['menú: hover', S.hover, mbox], ['menú: deshabilitado', S.dis, mbox], ['menú: título', S.title, mbox], ['pie / «clic para volver»', S.faint, [4, 3, 10]],
    ['duelo: etiqueta', '#94a6d4', rgb('#141a30')], ['duelo: texto', '#e8ecf8', rgb('#141a30')], ['duelo: barra', '#e8f0ff', rgb('#2c5098')],
    ['duelo: asignado', '#f2d468', rgb('#141a30')], ['duelo: +1 / hilo', '#9cf0a4', rgb('#0c1020')],
    ['fax: etiqueta', '#564c3e', rgb('#e8dfc6')], ['fax: texto', '#2a2218', rgb('#e8dfc6')], ['fax: asignado', '#952a24', rgb('#e8dfc6')], ['fax: hilo', '#2a2218', rgb('#d2c6a8')],
    ['aviso (banda)', '#ffffff', mixc([255, 255, 255], [8, 6, 14], 0.82)], ['créditos', '#d8d0f0', [16, 14, 28]],
  ].map(([n, c, b]) => ({ n, c, k: ratio(rgb(c), b) }));
  return { textRes, near, uiPairs, SB };
});

let fails = 0;
const fmt = (k) => k.toFixed(1) + ':1';
console.log(`Banda bajo el texto hablado: ${JSON.stringify(r.SB)}\n`);
console.log('1. Texto hablado (contra el contorno negro ≥ 7:1; contra el fondo ajustado de cada sala ≥ 4.5:1)');
const bad = r.textRes.filter(t => t.vsOutline < 7 || t.worst < 4.5);
const worst = [...r.textRes].sort((a, b) => a.worst - b.worst);
for (const t of (todo ? worst : worst.slice(0, 8))) console.log(`   ${t.vsOutline < 7 || t.worst < 4.5 ? '✗' : '·'} ${t.id.padEnd(34)} ${t.color}  contorno ${fmt(t.vsOutline).padStart(7)}  peor fondo ${fmt(t.worst).padStart(7)} (${t.where})`);
if (bad.length) { fails += bad.length; console.log(`   ✗ ${bad.length} colores por debajo del umbral`); } else console.log(`   ✓ ${r.textRes.length} colores de hablante legibles en todas las salas`);
console.log('\n2. Hablantes de una misma sala distinguibles (distancia RGB ≥ 60)');
if (r.near.length) { fails += r.near.length; for (const n of r.near) console.log('   ✗ ' + n); } else console.log('   ✓ sin colores gemelos en una misma sala');
console.log('\n3. Interfaz (≥ 4.5:1)');
for (const u of r.uiPairs) { const okk = u.k >= 4.5; if (!okk) fails++; if (!okk || todo) console.log(`   ${okk ? '·' : '✗'} ${u.n.padEnd(28)} ${u.c} ${fmt(u.k)}`); }
const wu = [...r.uiPairs].sort((a, b) => a.k - b.k).slice(0, 3);
console.log(`   peores: ${wu.map(u => `${u.n} ${fmt(u.k)}`).join(' · ')}`);
if (consoleErrors.length) { fails++; console.log('\nErrores de consola:\n  ' + consoleErrors.join('\n  ')); }
console.log(fails ? `\nCONTRASTE: ${fails} FALLOS` : '\nCONTRASTE: OK');
await browser.close();
server.close();
process.exit(fails ? 1 : 0);
