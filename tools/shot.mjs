#!/usr/bin/env node
// Screenshot a room for art review: node tools/shot.mjs <roomId> [entry] [--debug] [--x=<roomX>] [--y=<roomY>] [--out=file.png] [--scale=3]
//   [--flags=a,b=3,c] (set flags before the shot: name or name=JSON) [--verb=hablar:obj] (do a verb first, shot mid-dialog)
// Saves to tools/shots/room-<roomId>.png by default. Prints content errors, exits 1 if any.
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from './serve.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const flags = Object.fromEntries(args.filter(a => a.startsWith('--')).map(a => { const [k, v] = a.slice(2).split('='); return [k, v ?? true]; }));
const [room = 'vestibulo', entry] = args.filter(a => !a.startsWith('--'));
const scale = Number(flags.scale || 3);
const out = path.resolve(flags.out || path.join(here, 'shots', `room-${room}${flags.debug ? '-debug' : ''}.png`));
fs.mkdirSync(path.dirname(out), { recursive: true });

const server = createServer(path.resolve(here, '..'));
await new Promise(r => server.listen(0, r));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 320 * scale, height: 200 * scale } });
const errors = [];
page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.text()); });
page.on('pageerror', e => errors.push(e.message));
const q = `?room=${encodeURIComponent(room)}${entry ? '&entry=' + encodeURIComponent(entry) : ''}${flags.debug ? '&debug=1' : ''}`;
await page.goto(`http://localhost:${server.address().port}/${q}`);
await page.waitForFunction(() => window.__game && __game.state().mode === 'play', null, { timeout: 10000 });
await page.evaluate(() => { __game.skipText(true); return __game.waitIdle(); });
await page.evaluate(() => __game.skipText(false));
if (flags.flags) await page.evaluate(list => { for (const kv of String(list).split(',')) { const [k, v] = kv.split('='); __game.setFlag(k, v === undefined ? true : JSON.parse(v)); } const g = __game.game; g.applyPresence(); g.repaint(); }, flags.flags);
if (flags.verb) { const [v, o] = String(flags.verb).split(':'); await page.evaluate(([v, o]) => { __game.doVerb(v, o); }, [v, o]); await page.waitForTimeout(Number(flags.wait || 2500)); }
if (flags.x !== undefined) await page.evaluate(x => { const g = __game.game; g.player.x = Number(x); g.snapCamera(); }, flags.x);
if (flags.y !== undefined) await page.evaluate(y => { __game.game.player.y = Number(y); }, flags.y);
await page.waitForTimeout(400);
await page.screenshot({ path: out });
console.log('Guardado:', out);
if (errors.length) console.log('Errores/avisos:\n  ' + errors.join('\n  '));
await browser.close();
server.close();
process.exit(errors.some(e => !/^\[contenido\]/.test(e)) ? 1 : 0);
