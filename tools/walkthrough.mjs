#!/usr/bin/env node
// Walkthrough automático de la biblia §5.4 (46 pasos), con datos: cada paso = acciones + resultado esperado.
//   node tools/walkthrough.mjs              orden de la tabla
//   node tools/walkthrough.mjs --alt        orden alternativo «CMS primero → FUENTE → FIRMA → HUECO → acta antes que Rubén» (§5.4/§10)
//   node tools/walkthrough.mjs --hasta=20   se para (con éxito) tras el paso 20
//   node tools/walkthrough.mjs --lento      sin modo rápido (ver el texto) y con capturas de cada sala
// Mientras falten salas por implementar FALLARÁ en el primer paso pendiente: es lo esperado. Dice qué paso,
// qué acción y por qué (opción que no existe, flag que no se puso, objeto que no entró...), con el contexto.
//
// Acciones (todas por id o por TEXTO de opción, nunca por índice):
//   ['ir', sala]                          viaja por las salidas (grafo de `exit:` de las salas; prueba los bloqueos)
//   ['verbo', verbo, objetivo]            p. ej. ['verbo', 'mirar', 'tablon']
//   ['usar', item, objetivo]              «Usar item con objetivo» (objetivo puede ser otro item)
//   ['dar', item, actor]                  «Dar item a actor»
//   ['opcion', 'texto']                   elige la opción de diálogo que contiene ese texto (sin comillas)
//   ['cerrar']                            sale del diálogo abierto con una opción de despedida
//   ['duelo', ['R08', 'R04', {objeto: 'manual_fax'}, ...]]   juega el duelo: réplica por TEXTO para cada ataque
//                                         esperado (en ese orden) y [Usar objeto] → objeto en cada remate
// Avisos automáticos (adenda §2) y rumores: salen solos al entrar en salas / hablar; el test los cierra y sigue (walk-lib.mjs).
// Esperado: { flags: { nombre: valor } | ['nombre', ...], tiene: [...items], notiene: [...items], sala }
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from './serve.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const args = Object.fromEntries(process.argv.slice(2).filter(a => a.startsWith('--')).map(a => { const [k, v] = a.slice(2).split('='); return [k, v ?? true]; }));

import { STEPS } from './walk-data.mjs';
import { createRunner, StepFail } from './walk-lib.mjs';
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const ALT = [...range(1, 8), ...range(21, 26), ...range(9, 20), ...range(30, 34), 35, 36, ...range(27, 29), 37, 43, ...range(38, 42), ...range(44, 46)];
const order = args.alt ? ALT.map(n => STEPS.find(s => s.n === n)) : STEPS;
const stopAt = args.hasta ? Number(args.hasta) : null;

// ------------------------------------------------------------------ runner
const server = createServer(path.resolve(here, '..'));
await new Promise(r => server.listen(0, r));
const base = `http://localhost:${server.address().port}/`;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 960, height: 600 } });
const consoleErrors = [];
page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));
const G = (fn, arg) => page.evaluate(fn, arg);
const state = () => G(() => __game.state());
const R = createRunner(page);
const { run, check } = R;

let lastOk = 0, failed = null;
try {
  await page.goto(base);
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) { /* ignore */ } });
  await page.reload();
  await page.waitForFunction(() => !!window.__game);
  if (!args.lento) await G(() => __game.skipText(true));
  await R.startDismisser();      // avisos automáticos (adenda §2): llamadas de Evaristo / «RV:» de Tadeo; se cierran solos
  await G(() => __game.newGame());
  console.log(`Walkthrough §5.4 — orden ${args.alt ? 'alternativo (FUENTE → FIRMA → HUECO)' : 'de la tabla'}\n`);
  for (const s of order) {
    if (stopAt && s.n > stopAt) break;
    try {
      for (const a of s.acc) await run(a);
      await G(() => __game.waitIdle());
      await check(s.esp);
      console.log(`  ✓ ${String(s.n).padStart(2)} [${s.sala}] ${s.txt}`);
      lastOk = s.n;
      if (args.lento) await page.screenshot({ path: path.join(here, 'shots', `walk-${String(s.n).padStart(2, '0')}.png`) });
    } catch (e) {
      if (!(e instanceof StepFail)) throw e;
      failed = { s, msg: e.message };
      break;
    }
  }
} catch (e) {
  failed = failed || { s: null, msg: 'error del script: ' + (e && e.stack || e) };
}

if (failed) {
  const st = await state().catch(() => null);
  const log = await G(() => __game.log.slice(-6).map(l => `${l.who || '—'}: ${l.text}`)).catch(() => []);
  console.log(`\n  ✗ ${failed.s ? `PASO ${failed.s.n} [${failed.s.sala}] ${failed.s.txt}` : 'FALLO'}`);
  console.log(`    motivo: ${failed.msg}`);
  if (st) console.log(`    contexto: sala=${st.room} inventario=[${st.inventory.join(', ')}] diálogo=${JSON.stringify(st.dialog)}`);
  if (log.length) console.log('    últimas líneas:\n      ' + log.join('\n      '));
  try { await page.screenshot({ path: path.join(here, 'shots', 'walk-fallo.png') }); console.log('    captura: tools/shots/walk-fallo.png'); } catch (_) { /* ignore */ }
}
if (consoleErrors.length) console.log('\nErrores de consola:\n  ' + consoleErrors.join('\n  '));
const total = order.filter(s => !stopAt || s.n <= stopAt).length;
console.log(failed ? `\nLlegó hasta el paso ${lastOk} (${order.findIndex(s => s.n === lastOk) + 1} de ${total}). Fallo esperado mientras haya salas sin implementar.` : `\nWALKTHROUGH COMPLETO (${total} pasos)`);
fs.mkdirSync(path.join(here, 'shots'), { recursive: true });
await browser.close();
server.close();
process.exit(failed || consoleErrors.length ? 1 : 0);
