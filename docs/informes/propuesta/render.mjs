#!/usr/bin/env node
// PROPUESTA ALTERNATIVA · genera todas las imágenes de docs/informes/propuesta/img/ a partir del código de la propuesta
// (lib/*.js, arte/*.js, piezas.js), que importa en lectura los helpers y la paleta del juego (engine/draw.js, sprites, actores).
//   node docs/informes/propuesta/render.mjs            todas las piezas
//   node docs/informes/propuesta/render.mjs sala       solo las piezas cuyo nombre contiene «sala»
// No toca nada fuera de docs/informes/propuesta/. Las capturas «actual-*.png» se hicieron con tools/shot.mjs --out.
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '..', '..', '..');
const { chromium } = createRequire(path.join(repo, 'tools', 'x.mjs'))('playwright');
const { createServer } = await import(path.join(repo, 'tools', 'serve.mjs'));
const filtro = process.argv[2] || '';
const out = path.join(here, 'img');
fs.mkdirSync(out, { recursive: true });

const server = createServer(repo);
await new Promise(r => server.listen(0, r));
const base = `http://localhost:${server.address().port}/`;
const browser = await chromium.launch();
const page = await browser.newPage();
const errores = [];
page.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
page.on('pageerror', e => errores.push(e.message));
await page.goto(base + 'docs/informes/propuesta/lab.html');
await page.waitForFunction(() => window.__listo, null, { timeout: 15000 });
const lista = await page.evaluate(() => LAB.lista());
for (const n of lista) {
  if (filtro && !n.includes(filtro)) continue;
  const t0 = Date.now();
  const r = await page.evaluate((n) => LAB.pieza(n), n);
  const f = path.join(out, n + '.png');
  fs.writeFileSync(f, Buffer.from(r.url.split(',')[1], 'base64'));
  console.log(`  ${n}.png  ${r.w}×${r.h}  ${(fs.statSync(f).size / 1024).toFixed(0)} KB  ${Date.now() - t0} ms`);
}
if (errores.length) console.log('ERRORES:\n  ' + errores.join('\n  '));
await browser.close();
server.close();
process.exit(errores.length ? 1 : 0);
