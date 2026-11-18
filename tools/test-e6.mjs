#!/usr/bin/env node
// ENMIENDA E6 · PRUEBA DE INTEGRACIÓN (paquete I2; docs/guion2/ENMIENDA_E6.md §11.2). Reúne las pruebas de los paquetes
// (cada una en su propio proceso, con su servidor y su navegador) y añade las comprobaciones que no son de ningún paquete:
//   motor  tools/test-e6-motor.mjs  §6 (P0): `cabe` (la larga nunca suma fallo), etiqueta COMODÍN, N4, N5, N11
//   i1     tools/test-e6-i1.mjs     comunes (I1): L4 tras el armario, Hablar con Bruno, Valentín `casco_fuera`, «...CABE.»
//                                   en la R09, walk-lib con 'R09:larga', pistas `turno`/`columna`, SIN_DESTINO, §4.3
//   pa     tools/test-e6-pa.mjs     §11.2.2 atasco anunciado, §11.2.3 la tele (y la vía del Vending: XE6-3, XE6-5)
//   pb     tools/test-e6-pb.mjs     §2.1.4 camino del registro con Yoli, §2.5.1, §2.6 (B1, B2, B6, B7), §2.9.2-3, Valentín
//   pc     tools/test-e6-pc.mjs     §11.2.1 el corte «MIENTRAS, EN LA REDACCIÓN» (≈ 9 s), B8, §4.1 de Sistemas y Vestíbulo
//   pd     tools/test-e6-pd.mjs     §11.2.4 D2 de tres asaltos (larga ×2 sin fallo; notReady sin R09), §11.2.5 D3
//   pe     tools/test-e6-pe.mjs     §11.2.9 el rotulador colgado del cordel (hotspot propio), B9
//   pf     tools/test-e6-pf.mjs     §11.2.8 el titulador: la 5.ª espera, «LA CASA: 225.000», «· TÚ: n» y el fogonazo (≈ 10 min)
// Propias (modo rápido, recorrido de walk-data.mjs, 49 pasos):
//   §11.2.6  armario: en 40-41 ni «compañero», ni «Con coma», ni «atunes»; en el primer cambio de sala (42), «Se llama Brais.»
//   §11.2.7  columna: sin «despide a la gente»; Brais «SEGUIREMOS INFORMANDO.»
//   §7.1     28: la pregunta por la tele («BUENAS NOCHES, SALA AMAZONAS.», «¿Necesitan ayuda?»), sin pisar el Vending (E-53);
//            36: «Tráeme el contexto.» y «...CABE.»; 46: «El acta se necesitaba para... para...»; la frase de Anselmo, una vez (37)
//   §11.2.10 el menú de D1 lleva la etiqueta COMODÍN (una sola opción)
//   §11.2.11 medida del camino principal (contra la de E5 con este mismo método, 552 líneas: tope +6 de §1; §9.1 preveía
//            −2, ver la nota en el código) y topes: `text-audit --estatico --plan --e2 --e5 --e6 --recuento` sin
//            fallos, remate seco ≤ 17,9 % (E7 §7) y ninguna sala > 26 % (aviso a cero; E7 §7)
//   node tools/test-e6.mjs [--solo=motor,i1,pa,pb,pc,pd,pe,pf,propias] [--sala=pecera,…] [--jobs=2]
//     --sala: solo las pruebas de los paquetes que tocan esas salas, y las propias
// Registros completos de cada prueba en tools/shots/test-e6/<nombre>.log; el camino en tools/shots/test-e6/camino-principal.tsv.
// Sale con 1 si algo falla. Tarda ≈ 15-20 min (la de PF, ≈ 10, va primero).
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from './serve.mjs';
import { STEPS } from './walk-data.mjs';
import { createRunner, StepFail } from './walk-lib.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = Object.fromEntries(process.argv.slice(2).filter(a => a.startsWith('--')).map(a => { const [k, v] = a.slice(2).split('='); return [k, v ?? true]; }));
const solo = args.solo ? String(args.solo).split(',') : null;
const jobs = Math.max(1, Number(args.jobs || 2));
// qué paquete toca cada sala (E6 §10)
const PAQ_SALA = { sala_amazonas: ['pa'], office: ['pa'], pecera: ['pb', 'pf'], cpd: ['pc'], vestibulo: ['pc'], catacumba: ['pd'],
  pajarera: ['pd'], ecosistema: ['pe'], administracion: ['pe'] };
const salas = args.sala ? String(args.sala).split(',') : null;
const porSala = salas ? new Set(salas.flatMap(s => PAQ_SALA[s] || [])) : null;
const quiere = (k) => (!solo || solo.includes(k)) && (!porSala || k === 'propias' || porSala.has(k));
const logDir = path.join(here, 'shots', 'test-e6');
fs.mkdirSync(logDir, { recursive: true });
let failures = 0, checks = 0;
const ok = (c, m) => { checks++; if (c) console.log('  ✓ ' + m); else { failures++; console.log('  ✗ ' + m); } };

// ------------------------------------------------------------------ las de los paquetes (la más larga primero)
const HIJAS = [['pf', 'test-e6-pf.mjs', 1500], ['pa', 'test-e6-pa.mjs', 900], ['pd', 'test-e6-pd.mjs', 900], ['pc', 'test-e6-pc.mjs', 900],
  ['pb', 'test-e6-pb.mjs', 900], ['pe', 'test-e6-pe.mjs', 900], ['motor', 'test-e6-motor.mjs', 900], ['i1', 'test-e6-i1.mjs', 600]].filter(([k]) => quiere(k));
function correr([name, file, timeout]) {
  return new Promise(res => {
    const t0 = Date.now();
    const p = spawn(process.execPath, [path.join(here, file)], { cwd: path.resolve(here, '..'), env: process.env });
    let out = '';
    p.stdout.on('data', d => { out += d; }); p.stderr.on('data', d => { out += d; });
    const kill = setTimeout(() => { out += `\n[test-e6] TIEMPO AGOTADO (${timeout} s)`; p.kill('SIGKILL'); }, timeout * 1000);
    p.on('close', (code) => {
      clearTimeout(kill);
      fs.writeFileSync(path.join(logDir, name + '.log'), out);
      const lines = out.split('\n').filter(l => l.trim());
      const malas = lines.filter(l => /^\s*✗/.test(l));
      res({ name, file, code, s: Math.round((Date.now() - t0) / 1000), malas, fin: (lines[lines.length - 1] || '').trim() });
    });
  });
}
if (HIJAS.length) {
  console.log(`Pruebas de los paquetes de E6 (${HIJAS.length}, de ${jobs} en ${jobs}; registros en tools/shots/test-e6/)\n`);
  const cola = HIJAS.slice(), res = [];
  await Promise.all(Array.from({ length: Math.min(jobs, cola.length) }, async () => { while (cola.length) { const r = await correr(cola.shift()); res.push(r); console.log(`    ${r.code === 0 ? '·' : '!'} ${r.file} (${r.s} s): ${r.fin.slice(0, 90)}`); } }));
  for (const r of HIJAS.map(h => res.find(x => x.name === h[0]))) ok(r.code === 0, `${r.file}: ${r.code === 0 ? 'OK' : 'FALLA'} (${r.s} s)${r.malas.length ? '\n      ' + r.malas.slice(0, 8).map(l => l.trim()).join('\n      ') : ''}`);
}

// ------------------------------------------------------------------ las propias
if (quiere('propias')) {
  const { chromium } = createRequire(import.meta.url)('playwright');
  const server = createServer(path.resolve(here, '..'));
  await new Promise(r => server.listen(0, r));
  const base = `http://localhost:${server.address().port}/`;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 960, height: 600 } });
  const consoleErrors = [];
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));
  const R = createRunner(page);
  const G = R.G;
  try {
    console.log('\n§11.2.6-7, §7.1 y §9.1 · el recorrido de 49 pasos (modo rápido): lo que cambia y la medida del camino principal\n');
    await page.goto(base);
    await page.evaluate(() => { try { localStorage.clear(); } catch (e) { /* ignore */ } });
    await page.reload();
    await page.waitForFunction(() => !!window.__game);
    await G(() => __game.skipText(true));
    await R.startDismisser();
    await G(() => __game.newGame());
    const porPaso = {}, salasPaso = {};
    for (const s of STEPS) {
      const k0 = await G(() => __game.log.length);
      salasPaso[s.n] = new Set();
      for (const a of s.acc) { await R.run(a); salasPaso[s.n].add(await G(() => __game.state().room)); }
      await G(() => __game.waitIdle());
      await R.check(s.esp);
      porPaso[s.n] = await G((k) => __game.log.slice(k).map(l => ({ who: l.who, text: String(l.text) })), k0);
      if (s.n === 28) await G(() => __game.save('e6_28'));          // (tras la estampida: para el menú de D1)
    }
    const L = (n) => porPaso[n] || [];
    const tiene = (n, t, who) => L(n).some(l => l.text.includes(t) && (!who || l.who === who));
    const enCamino = (t) => Object.entries(porPaso).filter(([, X]) => X.some(l => l.text.includes(t))).map(([n, X]) => [Number(n), X.filter(l => l.text.includes(t)).length]);

    // §7.1 · 28: la tele de la Sala, sin ida y vuelta al Vending
    // (el 15 es el tablón del mismo Vending del 14, y el 16 sale de allí: cuenta adónde se llega tras cada acción)
    const pisaVending = Object.entries(salasPaso).filter(([n, S]) => n > 15 && n <= 28 && S.has('office')).map(([n]) => n);
    ok(tiene(28, 'Buenas noches, Gertrudis.', 'bruno') && tiene(28, 'BUENAS NOCHES, SALA AMAZONAS.', 'tele_amazonas') && tiene(28, '¿Necesitan ayuda?', 'bruno') && tiene(28, 'PREGUNTA DEL PÚBLICO'),
      '28: «Buenas noches, Gertrudis.» → «BUENAS NOCHES, SALA AMAZONAS.» → la pregunta en directo → atasco con «¿Necesitan ayuda?»');
    ok(!pisaVending.length && !enCamino('E-53').length, `28: el Vending no se pisa en el Acto II tras el 14 (ni E-53)${pisaVending.length ? ': pasos ' + pisaVending.join(', ') : ''}`);
    // §5 · duelos
    ok(tiene(36, 'DATO SACADO DE CONTEXTO. CONTESTA EN UNA LÍNEA: TREINTA Y OCHO CARACTERES.') && tiene(36, 'Lo saqué yo. No cabía.', 'bruno') && tiene(36, '...CABE.') && !tiene(36, 'NO CABE'),
      '36: D2 de tres asaltos; el tercero, la R09 corta («Lo saqué yo. No cabía.» → «...CABE.»; [P9])');
    ok(tiene(46, 'El acta se necesitaba para... para... para ayer.') && tiene(46, 'Ayer fue cuando empezaste la frase.', 'bruno'), '46: D3, la frase a medias y la R03 que la termina');
    // la frase de Anselmo, una vez y en el 37 (E6 cabecera)
    const f1 = enCamino('El modelo es de fuera. El prompt es de dentro.');
    ok(f1.length === 1 && f1[0][0] === 37 && f1[0][1] === 1, `«El modelo es de fuera. El prompt es de dentro.»: una vez, en el paso 37 (${JSON.stringify(f1)})`);
    // §11.2.6 · armario
    const armario = [40, 41].flatMap(n => L(n)).filter(l => /compañero|Con coma|atunes/.test(l.text));
    ok(!armario.length, `40-41: sin «compañero», «Con coma» ni «atunes»${armario.length ? ': ' + armario.map(l => l.text).join(' | ') : ''}`);
    const brais = enCamino('Se llama Brais.');
    ok(brais.length === 1 && brais[0][0] === 42 && tiene(42, 'Alguien come ahí abajo y no cobra.', 'evaristo_salvedad'),
      `42: la L4 suena en el primer cambio de sala tras el armario y Bruno contesta «Se llama Brais.» (${JSON.stringify(brais)})`);
    // §11.2.7 · columna
    ok(!enCamino('despide a la gente').length && !enCamino('Y la escribí yo').length && tiene(45, 'SEGUIREMOS INFORMANDO.', 'ruben'),
      '45: la columna acaba en Brais «SEGUIREMOS INFORMANDO.» (sin la explicación de Bruno)');

    // §9.1 · medida: cadenas dichas (opciones elegidas incluidas), sin avisos ni tarjeta; minutos = Σ speechDuration (texto ×1)
    const todo = Object.values(porPaso).flat();
    const dichas = todo.filter(l => l.who !== 'aviso' && l.who !== 'tarjeta');
    const ms = (t) => Math.max(1100, 900 + t.length * 55);
    const lineas = dichas.length, chars = dichas.reduce((a, l) => a + l.text.length, 0), min = dichas.reduce((a, l) => a + ms(l.text), 0) / 60000;
    const bruno = dichas.filter(l => l.who === 'bruno').length;
    const remate = (await import('./plan-rules.mjs')).esRemateSeco;
    const secos = dichas.filter(l => remate(l.text)).length;
    // (el registro antepone «TEODORO (fax): » a los ataques del duelo, que se leen en la ventana del fax: no cuenta)
    const largas = dichas.filter(l => l.text.replace(/^[A-ZÁÉÍÓÚÑ ]+ \((?:fax|correo)\): /, '').length > 80);
    const E5 = { lineas: 552, chars: 26533, min: 32.6 };       // la última medida de E5 con este mismo método (test-e5, 50 pasos)
    console.log(`    camino principal (49 pasos, modo rápido): ${lineas} líneas · ${chars.toLocaleString('es-ES')} caracteres · ${min.toFixed(1).replace('.', ',')} min de lectura · Bruno ${bruno} · remate seco ${secos} (${(100 * secos / lineas).toFixed(1).replace('.', ',')} %)`);
    console.log(`    frente a E5 (${E5.lineas} líneas · ${E5.chars.toLocaleString('es-ES')} caracteres · ${String(E5.min).replace('.', ',')} min): ${lineas - E5.lineas >= 0 ? '+' : ''}${lineas - E5.lineas} líneas · ${chars - E5.chars >= 0 ? '+' : ''}${(chars - E5.chars).toLocaleString('es-ES')} caracteres · ${(min - E5.min >= 0 ? '+' : '') + (min - E5.min).toFixed(1).replace('.', ',')} min (§9.1 prevé −2)`);
    const tramos = [[1, 18], [19, 23], [24, 29], [30, 39], [40, 45], [46, 49]].map(([a, b]) => `${a}-${b}: ${Object.entries(porPaso).filter(([n]) => n >= a && n <= b).reduce((x, [, X]) => x + X.filter(l => l.who !== 'aviso' && l.who !== 'tarjeta').length, 0)}`);
    console.log(`    por tramos de pasos: ${tramos.join(' · ')}`);
    fs.writeFileSync(path.join(logDir, 'camino-principal.tsv'), Object.entries(porPaso).flatMap(([n, X]) => X.filter(l => l.who !== 'aviso' && l.who !== 'tarjeta').map(l => `${n}\t${l.who}\t${l.text}`)).join('\n') + '\n');
    // §9.1 preveía −2, pero contaba la L4 como ya oída en E5 (en el recorrido de E5 se perdía: +4 en este) y la grabación
    // de Gervasio del paso 10 (en modo rápido no salía: 0), y E-53 como una línea (eran tres, más el titular del viaje al
    // Vending: −5 con la ida y vuelta). Con este método el saldo real es +1 (553): lo que manda es el tope de §1, +6.
    // [guion3 t1]: +2 por el guion nuevo aprobado ([P9]: R07 y R11, una línea más de Bruno cada una)
    ok(lineas <= E5.lineas + 8, `camino principal: tope de §1 (+8 sobre las ${E5.lineas} de E5; +6 de E6 y +2 del guion nuevo): ${lineas} (${lineas - E5.lineas >= 0 ? '+' : ''}${lineas - E5.lineas}; §9.1 preveía −2)`);
    ok(!largas.length, `ninguna línea dicha en el camino pasa de 80 caracteres${largas.length ? ': ' + largas.map(l => `«${l.text}» (${l.text.length})`).join(' · ') : ''}`);

    // §11.2.10 · el menú de D1 con la etiqueta COMODÍN
    await G(() => __game.load('e6_28')); await G(() => __game.waitIdle());
    await G(() => __game.skipText(true));
    // la floja del menú rota entre las flojas y el comodín (el último del montón): se pone la cuenta para que toque él
    await G(() => { const D = __game.game.content.duels, W = [].concat(D.weakReplies || []).filter(w => !w.only || [].concat(w.only).includes('maripaz')); __game.setFlag('duel:maripaz:floja', W.length); });
    await R.run(['verbo', 'hablar', 'maripaz_remitido']); await R.run(['opcion', 'Siestatón no ha confirmado la página 7.']);
    let tags = null;
    for (let i = 0; i < 100 && !tags; i++) { tags = await G(() => (__game.state().duel && __game.game.choice ? __game.game.choice.tags || [] : null)); if (!tags) await page.waitForTimeout(50); }
    ok(Array.isArray(tags) && tags.filter(t => t === 'COMODÍN').length === 1, `D1: el menú lleva la etiqueta COMODÍN en una sola opción (${JSON.stringify(tags)})`);
  } catch (e) {
    failures++;
    console.log('  ✗ ' + (e instanceof StepFail ? e.message : (e && e.stack || e)));
    try { await page.screenshot({ path: path.join(logDir, 'fallo.png') }); } catch (_) { /* ignore */ }
  }
  ok(!consoleErrors.length, 'sin errores de consola' + (consoleErrors.length ? ': ' + consoleErrors.slice(0, 5).join(' | ') : ''));
  await browser.close();
  server.close();

  // §11.2.11 · topes
  console.log('\n§11.2.11 · topes (text-audit --estatico --plan --e2 --e5 --e6 --recuento)\n');
  const ta = await new Promise(res => { const p = spawn(process.execPath, [path.join(here, 'text-audit.mjs'), '--estatico', '--plan', '--e2', '--e5', '--e6', '--recuento'], { cwd: path.resolve(here, '..') }); let o = ''; p.stdout.on('data', d => { o += d; }); p.stderr.on('data', d => { o += d; }); p.on('close', c => res({ c, o })); });
  fs.writeFileSync(path.join(logDir, 'text-audit.log'), ta.o);
  const rec = ta.o.split('\n').filter(l => /E6 §8\)/.test(l) && /\d+ \/ /.test(l)).map(l => l.trim().replace(/^· /, ''));
  ok(ta.c === 0 && /PLAN: OK/.test(ta.o) && /E2: OK/.test(ta.o) && /E5: OK/.test(ta.o) && /E6: OK/.test(ta.o), `text-audit --estatico --plan --e2 --e5 --e6: OK${rec.length ? '\n      ' + rec.join('\n      ') : ''}`);
  const sala26 = (ta.o.match(/Remate seco por fichero de sala > 26 %[^:]*: (\d+)/) || [])[1];
  ok(sala26 === '0', `ninguna sala pasa del 26 % de remate seco (E7 §7; aviso: ${sala26})`);
  const dups = (ta.o.match(/Duplicados audibles[^:]*: (\d+)/) || [])[1];
  ok(dups === '0', `sin duplicados audibles entre salas (§4.3; aviso: ${dups})`);
}

console.log(failures ? `\nE6: ${failures} FALLOS (${checks} comprobaciones)` : `\nE6: OK (${checks} comprobaciones)`);
process.exit(failures ? 1 : 0);
