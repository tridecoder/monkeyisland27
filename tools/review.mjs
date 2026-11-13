#!/usr/bin/env node
// Revisión visual (QA): juega el walkthrough 5.4 en modo rápido hasta varios puntos de control, recorre TODAS las salas en
// cada estado de acto (normal y con el overlay de depuración) y captura los momentos clave (intro, villano, duelos,
// revelación, clímax, epílogo, créditos, poscréditos) fotograma a fotograma (uno por cada línea hablada).
// Compone hojas de contactos 2×3 en tools/shots/review/*.png (cada viñeta = pantalla 320×200 a escala 2 + rótulo).
//   node tools/review.mjs                 todo
//   node tools/review.mjs --solo=salas    solo el recorrido de salas   (--solo=momentos: solo los momentos)
//   node tools/review.mjs --sala=pecera   solo esa sala en el recorrido
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from './serve.mjs';
import { STEPS } from './walk-data.mjs';
import { createRunner } from './walk-lib.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const args = Object.fromEntries(process.argv.slice(2).filter(a => a.startsWith('--')).map(a => { const [k, v] = a.slice(2).split('='); return [k, v ?? true]; }));
const outDir = path.join(here, 'shots', 'review');
fs.mkdirSync(outDir, { recursive: true });

const server = createServer(path.resolve(here, '..'));
await new Promise(r => server.listen(0, r));
const base = `http://localhost:${server.address().port}/`;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 640, height: 400 } });
const consoleErrors = [];
page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));
const R = createRunner(page);
const G = R.G;
const wait = (ms) => page.waitForTimeout(ms);
const state = () => G(() => __game.state());

// ------------------------------------------------------------------ frames & contact sheets
const sheets = {};
async function grab(sheet, label) {
  const url = await G(() => __game.game.buf.toDataURL('image/png'));
  (sheets[sheet] = sheets[sheet] || []).push({ url, label: String(label).slice(0, 70) });
}
async function writeSheets() {
  for (const [name, frames] of Object.entries(sheets)) {
    for (let k = 0; k * 6 < frames.length; k++) {
      const part = frames.slice(k * 6, k * 6 + 6);
      const png = await G(async (part) => {
        const S = 2, W = 320 * S, H = 200 * S, LH = 14;
        const c = document.createElement('canvas'); c.width = W * 2 + 6; c.height = (H + LH) * Math.ceil(part.length / 2) + 4;
        const g = c.getContext('2d'); g.fillStyle = '#303030'; g.fillRect(0, 0, c.width, c.height); g.imageSmoothingEnabled = false;
        for (let i = 0; i < part.length; i++) {
          const img = new Image(); img.src = part[i].url; await img.decode();
          const x = (i % 2) * (W + 6), y = Math.floor(i / 2) * (H + LH);
          g.fillStyle = '#ffff90'; g.font = '12px monospace'; g.fillText(part[i].label, x + 2, y + 11);
          g.drawImage(img, x, y + LH, W, H);
        }
        return c.toDataURL('image/png');
      }, part);
      const file = path.join(outDir, `${name}${frames.length > 6 ? '-' + (k + 1) : ''}.png`);
      fs.writeFileSync(file, Buffer.from(png.split(',')[1], 'base64'));
      console.log('  📷 ' + path.relative(path.resolve(here, '..'), file));
    }
  }
  for (const k of Object.keys(sheets)) delete sheets[k];
}

// ------------------------------------------------------------------ walkthrough helpers
let done = 0;
async function playTo(n) {
  for (const s of STEPS) {
    if (s.n <= done) continue;
    if (s.n > n) break;
    for (const a of s.acc) await R.run(a);
    await G(() => __game.waitIdle());
    await R.check(s.esp);
    done = s.n;
  }
}
async function fresh() {
  await page.goto(base);
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) { /* ignore */ } });
  await page.reload();
  await page.waitForFunction(() => !!window.__game);
  await G(() => __game.skipText(true));
  await R.startDismisser();
  await G(() => __game.newGame());
  done = 1;
}
const ROOMS = ['vestibulo', 'pecera', 'office', 'catacumba', 'pajarera', 'sala_amazonas', 'ecosistema', 'eventos', 'administracion', 'cpd'];
async function tourRooms(tag) {
  await G(() => __game.save('rev'));
  for (const room of ROOMS) {
    if (args.sala && args.sala !== room) continue;
    await G(() => __game.load('rev'));
    await G(() => __game.skipText(true));
    // viajar sin escenas: colocar al jugador en la entrada «default» de la sala (como cargar partida allí)
    await G(async (room) => {
      const g = __game.game;
      g.state.room = room;
      const def = g.content.rooms[room], e0 = Object.values(def.entries || {})[0];
      const p = g.player; const e = Array.isArray(e0) ? { x: e0[0], y: e0[1] } : e0;
      await g.runScript(async () => { await g.enterRoom(room, null, { restore: true }); }, { label: 'review' });
      p.room = room; p.x = e.x; p.y = e.y; g.snapCamera();
    }, room);
    await G(() => __game.waitIdle());
    await G(() => __game.skipText(false));
    const width = await G(() => __game.game.room.width);
    const xs = width > 320 ? [160, 480] : [null];
    for (const x of xs) {
      for (const dbg of [false, true]) {
        await G(([x, dbg]) => { const g = __game.game; if (x != null) { g.camFollow = null; g.camTarget = null; g.camX = x - 160; } g.debug.on = dbg; g.debug.overlay = dbg; }, [x, dbg]);
        await wait(350);
        await grab(`sala-${room}`, `${tag} ${room}${x != null ? ' x=' + x : ''}${dbg ? ' DEBUG' : ''}`);
      }
    }
    await G(() => { const g = __game.game; g.debug.on = false; g.debug.overlay = false; g.camFollow = g.G.player; });
  }
}

/** Run `startFn` (not awaited) in normal speed and grab a frame for every new spoken line; auto-plays duels/dialogs. */
async function capture(sheet, startFn, { max = 18, choose = [] } = {}) {
  await G(() => { __game.skipText(false); __game.clearLog(); });
  await G(startFn);
  let seen = 0, idleSince = 0, frames = 0, lastChoice = '';
  const picks = [...choose];
  for (let guard = 0; guard < 1500; guard++) {
    await wait(90);
    const st = await state();
    if (st.mode === 'ending') {
      for (const t of [3000, 20000, 45000, 70000, 95000]) {
        const ok = await G(t => { const e = __game.game.ending; if (!e) return false; e.t = t; return true; }, t);
        if (!ok) break;
        await wait(120); await grab(sheet, `créditos t=${t / 1000}s`); frames++;
      }
      await G(() => { const e = __game.game.ending; if (e) e.t = 1e7; });
      await wait(400);
      await G(() => { const e = __game.game.ending; if (e && !e.keep) { const p = __game.virtualToClient(160, 100); return p; } return null; }).then(async p => { if (p) { await page.mouse.click(p.x, p.y); await wait(300); } });
      continue;
    }
    if (st.mode === 'title') break;
    const logLen = await G(() => __game.log.length);
    if (logLen > seen) {
      seen = logLen;
      const last = await G(() => { const l = __game.log[__game.log.length - 1]; return `${l.who || '—'}: ${l.text}`; });
      await wait(260);
      if (frames < max) { await grab(sheet, last); frames++; }
      await wait(200);
      await G(() => __game.skipSpeech());
      idleSince = 0;
      continue;
    }
    if (st.dialog) {
      const key = JSON.stringify(st.dialog) + (st.duel ? st.duel.phase + st.duel.hits + st.duel.misses : '');
      if (key !== lastChoice) { lastChoice = key; if (frames < max) { await wait(150); await grab(sheet, st.duel ? `duelo ${st.duel.id} fase ${st.duel.phase}` : 'opciones'); frames++; } }
      if (st.duel && st.duel.phase === 'reply') await G(() => __game.chooseDialog(__game.state().duel.correctIndex));
      else if (st.duel && st.duel.phase === 'finisher') await G(() => __game.chooseText('[Usar objeto]'));
      else {
        const want = picks.shift();
        const ok = want ? await G(w => __game.chooseText(w), want) : false;
        if (!ok) await R.closeDialog().catch(async () => { await G(() => __game.chooseDialog(0)); });
      }
      continue;
    }
    if (st.pickItem) { await G(() => __game.chooseItem(__game.state().duel.correctItem)); continue; }
    if (!st.busy) { if (++idleSince > 8) break; } else idleSince = 0;
  }
  await G(() => __game.skipText(true));
}

try {
  const solo = args.solo;
  await fresh();
  if (!solo || solo === 'momentos') {
    // intro (nueva partida en velocidad normal)
    await capture('m01-intro', () => { __game.game.newGame(); }, { max: 12 });
    await G(() => __game.waitIdle());
    await playTo(7);
    await capture('m02-villano-7.2', () => { __game.doVerb('ir', 'torno'); }, { max: 18 });
    done = 8;
  }
  if (!solo || solo === 'salas') { await playTo(13); await tourRooms('ACTO I'); await G(() => __game.load('rev')); await G(() => __game.skipText(true)); }
  if (!solo || solo === 'momentos') {
    await playTo(28);
    await R.travel('ecosistema');
    await capture('m03-duelo-D1', () => { __game.doVerb('dar', 'maripaz_remitido', 'planillo'); }, { max: 14 });
    done = 29; await R.closeDialog().catch(() => {});
  }
  if (!solo || solo === 'salas') { await playTo(29); await tourRooms('ACTO II'); await G(() => __game.load('rev')); await G(() => __game.skipText(true)); }
  if (!solo || solo === 'momentos') {
    await playTo(34);
    await R.travel('catacumba');
    await capture('m04-duelo-D2', async () => { __game.doVerb('hablar', 'teodoro_cuerpodoce'); }, { max: 14, choose: ['Quiero firmar en tu página 7.'] });
    done = 35; await R.closeDialog().catch(() => {});
    await playTo(36);
    await R.travel('catacumba');
    await capture('m05-acto3-7.3a', () => { __game.doVerb('dar', 'teodoro_cuerpodoce', 'ficha_pagina_7'); }, { max: 14 });
    done = 37; await R.closeDialog().catch(() => {});
    await R.travel('cpd');
    await capture('m06-revelacion-7.3', () => { __game.doVerb('tirar', 'papel_continuo'); }, { max: 18 });
    done = 38;
  }
  if (!solo || solo === 'salas') { await playTo(42); await tourRooms('ACTO III'); await G(() => __game.load('rev')); await G(() => __game.skipText(true)); }
  if (!solo || solo === 'momentos') {
    await playTo(42);
    await R.travel('office');
    await capture('m07-duelo-D3', () => { __game.doVerb('hablar', 'gervasio_acta'); }, { max: 14, choose: ['Necesito el acta de la última reunión.'] });
    done = 43; await R.closeDialog().catch(() => {});
    await R.travel('pajarera');
    await capture('m08-climax-7.4', () => { __game.doVerb('usar', 'puerta_sala'); }, { max: 40 });
    done = 45;
    await capture('m09-final-7.5', () => { __game.doVerb('empujar', 'lector_medio'); }, { max: 60 });
  }
  await writeSheets();
} catch (e) {
  console.error('ERROR', e);
  try { await writeSheets(); } catch (_) { /* ignore */ }
}
if (consoleErrors.length) console.log('Errores de consola:\n  ' + consoleErrors.join('\n  '));
await browser.close();
server.close();
