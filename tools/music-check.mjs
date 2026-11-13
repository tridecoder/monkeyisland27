#!/usr/bin/env node
// Validates content/music.js against the sequencer format and plays every track in headless Chromium.
// Usage: node tools/music-check.mjs [--no-browser]
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from './serve.mjs';
import { noteFreq, parseNotes } from '../engine/audio.js';
import music from '../content/music.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const WAVES = new Set(['square', 'triangle', 'sawtooth', 'sine', 'noise']);
const REQUIRED = ['m_titulo', 'm_vestibulo', 'm_pecera', 'm_office', 'm_catacumba', 'm_pajarera', 'm_sala_amazonas',
  'm_ecosistema', 'm_eventos', 'm_administracion', 'm_cpd', 'm_duelo', 'm_climax', 'm_final', 'm_creditos'];
let failures = 0, warnings = 0;
const fail = (id, msg) => { failures++; console.log(`  FAIL [${id}] ${msg}`); };
const warn = (id, msg) => { warnings++; console.log(`  warn [${id}] ${msg}`); };

for (const id of REQUIRED) if (!music[id]) fail(id, 'missing track');

const seen = new Set();
console.log('track'.padEnd(18), 'bpm'.padStart(4), 'steps', 'bars'.padStart(4), 'secs'.padStart(6), 'ch');
for (const [id, t] of Object.entries(music)) {
  if (seen.has(t)) continue; // alias
  seen.add(t);
  const issues0 = failures;
  if (!(t.bpm >= 50 && t.bpm <= 200)) fail(id, `bpm ${t.bpm} out of range 50..200`);
  if (![1, 2, 3, 4].includes(t.steps)) fail(id, `steps ${t.steps} invalid`);
  if (t.vol !== undefined && !(t.vol > 0 && t.vol <= 1)) fail(id, `vol ${t.vol}`);
  if (!t.channels || t.channels.length < 3) fail(id, 'needs at least 3 channels');
  let len = null, barLen = null;
  (t.channels || []).forEach((ch, ci) => {
    const tag = `${id}#${ci}`;
    if (!WAVES.has(ch.wave)) fail(tag, `bad wave ${ch.wave}`);
    if (!(ch.vol >= 0.01 && ch.vol <= 0.25)) fail(tag, `vol ${ch.vol} outside 0.01..0.25`);
    const raw = Array.isArray(ch.notes) ? ch.notes.join(' ') : String(ch.notes);
    const toks = parseNotes(raw);
    if (len === null) len = toks.length;
    else if (toks.length !== len) fail(tag, `length ${toks.length} != ${len}`);
    // bar segments
    const segs = raw.split('|').map(s => s.trim()).filter(Boolean).map(s => s.split(/\s+/).length);
    if (new Set(segs).size > 1) fail(tag, `uneven bar lengths: ${[...new Set(segs)].join(',')}`);
    if (barLen === null) barLen = segs[0];
    else if (segs[0] !== barLen) fail(tag, `bar length ${segs[0]} != ${barLen}`);
    let high = 0, notes = 0;
    toks.forEach((tok, i) => {
      if (tok === '.' || tok === '-') {
        if (tok === '-' && (i === 0 ? false : toks[i - 1] === '.')) warn(tag, `hold after rest at step ${i}`);
        return;
      }
      if (/^[xokhs]$/.test(tok)) {
        if (ch.wave !== 'noise') fail(tag, `drum token '${tok}' on non-noise channel`);
        return;
      }
      if (ch.wave === 'noise') { fail(tag, `non-drum token '${tok}' in noise channel`); return; }
      const f = noteFreq(tok);
      if (!f) { fail(tag, `invalid note '${tok}' at step ${i}`); return; }
      const hz = f * Math.pow(2, (ch.transpose || 0) / 12);
      notes++;
      if (hz > 1100) high++;
      if (hz < 40) warn(tag, `very low note ${tok}`);
    });
    if (notes && high / notes > 0.1) warn(tag, `${Math.round(100 * high / notes)}% of notes above ~C6`);
  });
  const bars = len / barLen;
  const secs = len * 60 / t.bpm / t.steps;
  if (bars < 8 || bars > 32) fail(id, `${bars} bars outside 8..32`);
  if (!Number.isInteger(bars)) fail(id, `non-integer bar count ${bars}`);
  console.log(id.padEnd(18), String(t.bpm).padStart(4), String(t.steps).padStart(5), String(bars).padStart(4), secs.toFixed(1).padStart(6), t.channels.length, failures === issues0 ? '' : ' <-- problems');
}

if (!process.argv.includes('--no-browser')) {
  const require = createRequire(import.meta.url);
  const { chromium } = require('playwright');
  const server = createServer(root);
  await new Promise(r => server.listen(0, r));
  const base = `http://localhost:${server.address().port}/`;
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage();
  const errs = [];
  page.on('console', m => { if (['error', 'warning'].includes(m.type())) errs.push(`${m.type()}: ${m.text()}`); });
  page.on('pageerror', e => errs.push('pageerror: ' + e.message));
  await page.goto(base);
  await page.waitForFunction(() => window.__game, null, { timeout: 10000 });
  await page.mouse.click(300, 300); // user gesture -> unlock audio
  const res = await page.evaluate(async ids => {
    const a = window.__game.game.audio;
    const music = (await import('/content/music.js')).default;
    a.register(music);
    a.unlock();
    const out = [];
    for (const id of ids) {
      a.currentId = undefined; a.current = null;
      a.play(id, 0.05);
      await new Promise(r => setTimeout(r, 700));
      out.push({ id, playing: !!a.current && a.currentId === id, step: a.current ? a.current.step : -1, state: a.ctx && a.ctx.state });
    }
    a.play(null, 0.05);
    return out;
  }, REQUIRED);
  for (const r of res) {
    const good = r.playing && r.step > 0;
    if (!good) fail(r.id, `did not start/advance in browser: ${JSON.stringify(r)}`);
  }
  console.log(`\nbrowser: ${res.length} tracks started (audio ctx: ${res[0] && res[0].state})`);
  if (errs.length) { for (const e of errs) fail('console', e); } else console.log('browser console: no errors/warnings');
  await browser.close(); server.close();
}
console.log(failures ? `\nFAILURES: ${failures}` : `\nALL OK (${warnings} warnings)`);
process.exit(failures ? 1 : 0);
