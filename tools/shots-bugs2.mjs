#!/usr/bin/env node
// Capturas de los bugs B1, B2 y B7 de la crítica 2: node tools/shots-bugs2.mjs <prefijo>   (antes | despues)
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from './serve.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const pre = process.argv[2] || 'despues';
const server = createServer(path.resolve(here, '..'));
await new Promise(r => server.listen(0, r));
const base = `http://localhost:${server.address().port}/`;
const browser = await chromium.launch();
const out = n => path.join(here, 'shots', `bugs2-${pre}-${n}.png`);
async function open(opts) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  await page.goto(base);
  await page.waitForFunction(() => !!window.__game);
  return page;
}
const VP = { desk: { viewport: { width: 960, height: 600 } }, ios: { viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 } };
for (const [k, o] of Object.entries(VP)) {
  const p = await open(o);
  await p.evaluate(() => { localStorage.clear(); __game.skipText(true); });
  await p.evaluate(() => __game.newGame());
  await p.evaluate(() => __game.skipText(false));
  await p.reload(); await p.waitForFunction(() => !!window.__game); await p.waitForTimeout(500);
  await p.screenshot({ path: out('titulo-' + k) });
  await p.evaluate(() => { __game.skipText(true); return __game.newGame(); });
  await p.evaluate(() => __game.gotoRoom('vestibulo'));
  await p.evaluate(() => __game.skipText(false));
  p.evaluate(() => __game.doVerb('hablar', 'celestino'));
  await p.waitForFunction(() => __game.state().dialog, null, { timeout: 8000 });
  await p.waitForTimeout(300);
  await p.screenshot({ path: out('dialogo-' + k) });
  await p.close();
}
{
  const p = await open(VP.desk);
  await p.evaluate(() => { __game.skipText(true); return __game.newGame(); });
  await p.evaluate(() => __game.gotoRoom('pecera'));
  await p.evaluate(() => __game.skipText(false));
  p.evaluate(() => __game.doVerb('usar', 'movil'));
  await p.waitForFunction(() => __game.state().dialog, null, { timeout: 8000 });
  await p.evaluate(() => __game.chooseText('Correo'));
  await p.waitForTimeout(500);
  await p.screenshot({ path: out('correo') });
}
await browser.close(); server.close();
