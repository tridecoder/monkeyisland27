#!/usr/bin/env node
// ENMIENDA E5 · PRUEBA DE INTEGRACIÓN (paquete I2; docs/guion2/ENMIENDA_E5.md §11.2). Reúne las pruebas de los paquetes
// y añade lo que ninguna de ellas cubre:
//   motor  tools/test-e5-motor.mjs  §6 (P0): walkTo/run, apagón con focos/nombres/interceptor, sinCongelar, estampida con
//          espera, quieto, sinGuardar, holgura táctil, doble clic, crujido, ascensor con submenú (ratón y dedo)
//   pa     tools/test-e5-pa.mjs     §11.2.1 estampida y atasco (cuatro vías, guardar/cargar, Acto III), §11.2.7 señal
//   pb     tools/test-e5-pb.mjs     §11.2.2 apagón jugable, §11.2.6 columna del kanban, §11.2.10 F4, F9, coro K01-K04
//   pc     tools/test-e5-pc.mjs     §11.2.3 regletero, §11.2.4 ticket 0.441, §11.2.5 armario 27
//   pd     tools/test-e5-pd.mjs     §11.2.4 la pegatina del fax, §11.2.10 N6, §5.4 el Lector asiente (Despachos)
//   pe     tools/test-e5-pe.mjs     §2.5.1 el rotulador de objetivos; Begoña sin «¿Usted ha sido feliz…?»
//   propias (aquí):
//     §11.2.9  el recorrido vigente (E6: 49 pasos) en modo rápido: «El modelo es de fuera. El prompt es de dentro.» UNA vez (paso 37)
//              y «…Entonces es de la casa.» UNA vez (paso 46); y la MEDIDA del camino principal (§9.1: líneas, caracteres,
//              minutos de lectura con `speechDuration`, Bruno) frente a la referencia de E4 (561 líneas · 33,0 min; tope 576)
//     §11.2.8  ascensor: desde Sistemas, Planta 1 → «Redacción de papel» → `catacumba` por su entrada `pecera`; en el
//              Acto III la Sala no sale en el submenú; a la planta 0, sin submenú
//     §11.2.11 topes: `text-audit --estatico --plan --e2 --e5 --recuento` sin fallos
//   node tools/test-e5.mjs [--solo=motor,pa,pb,pc,pd,pe,propias] [--jobs=2]
// Las de los paquetes van como procesos aparte (cada una con su servidor en un puerto libre), de dos en dos. Registros
// completos en tools/shots/test-e5/<nombre>.log. Sale con 1 si algo falla. Tarda ≈ 12-15 min (la de PA, ≈ 5).
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from './serve.mjs';
import { STEPS } from './walk-data.mjs';
import { createRunner, StepFail } from './walk-lib.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = Object.fromEntries(process.argv.slice(2).filter(a => a.startsWith('--')).map(a => { const [k, v] = a.slice(2).split('='); return [k, v ?? true]; }));
const solo = args.solo ? String(args.solo).split(',') : null;
const quiere = (k) => !solo || solo.includes(k);
const jobs = Math.max(1, Number(args.jobs || 2));
const logDir = path.join(here, 'shots', 'test-e5');
fs.mkdirSync(logDir, { recursive: true });

let failures = 0, checks = 0;
const ok = (c, m) => { checks++; if (c) console.log('  ✓ ' + m); else { failures++; console.log('  ✗ ' + m); } };

// ------------------------------------------------------------------ las pruebas de los paquetes
const HIJAS = [['pa', 'test-e5-pa.mjs', 1200], ['pb', 'test-e5-pb.mjs', 900], ['motor', 'test-e5-motor.mjs', 900],
  ['pc', 'test-e5-pc.mjs', 900], ['pd', 'test-e5-pd.mjs', 900], ['pe', 'test-e5-pe.mjs', 900]].filter(([k]) => quiere(k));
function correr([name, file, timeout]) {
  return new Promise(res => {
    const t0 = Date.now();
    const p = spawn(process.execPath, [path.join(here, file)], { cwd: path.resolve(here, '..'), env: process.env });
    let out = '';
    p.stdout.on('data', d => { out += d; });
    p.stderr.on('data', d => { out += d; });
    const kill = setTimeout(() => { out += `\n[test-e5] TIEMPO AGOTADO (${timeout} s)`; p.kill('SIGKILL'); }, timeout * 1000);
    p.on('close', (code) => {
      clearTimeout(kill);
      fs.writeFileSync(path.join(logDir, name + '.log'), out);
      const malas = out.split('\n').filter(l => /^\s*✗/.test(l));
      const fin = out.split('\n').map(l => l.trim()).filter(Boolean).reverse().find(l => /OK|FALL|comprobaciones|✗/.test(l)) || '';
      res({ name, file, code, s: Math.round((Date.now() - t0) / 1000), malas, fin });
    });
  });
}
if (HIJAS.length) {
  console.log(`Pruebas de los paquetes de E5 (${HIJAS.length}, de ${jobs} en ${jobs}; registros en tools/shots/test-e5/)\n`);
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
    // §11.2.9 + §9.1: el recorrido (hoy el de E6, 49 pasos; modo rápido) y su medida. La medida contra el saldo de E6
    // (§9.1: 568 ± 2) la hace tools/test-e6.mjs; aquí, el tope de E5 (≤ 576) sigue valiendo.
    console.log('\n§11.2.9 y §9.1 · el recorrido vigente (E6, 49 pasos): la frase de Anselmo y la medida del camino principal\n');
    await page.goto(base);
    await page.evaluate(() => { try { localStorage.clear(); } catch (e) { /* ignore */ } });
    await page.reload();
    await page.waitForFunction(() => !!window.__game);
    await G(() => __game.skipText(true));
    await R.startDismisser();
    await G(() => __game.newGame());
    const porPaso = {};
    for (const s of STEPS) {
      const k0 = await G(() => __game.log.length);
      for (const a of s.acc) await R.run(a);
      await G(() => __game.waitIdle());
      await R.check(s.esp);
      porPaso[s.n] = await G((k) => __game.log.slice(k).map(l => ({ who: l.who, text: String(l.text) })), k0);
      if (s.n === 23) await G(() => __game.save('e5_asc_23'));    // (Sistemas, Acto II: para §11.2.8)
      if (s.n === 40) await G(() => __game.save('e5_asc_41'));    // (Sistemas, Acto III; E6: paso 40)
    }
    const todo = Object.values(porPaso).flat();
    const en = (t) => Object.entries(porPaso).filter(([, L]) => L.some(l => l.text.includes(t))).map(([n, L]) => [Number(n), L.filter(l => l.text.includes(t)).length]);
    const f1 = en('El modelo es de fuera. El prompt es de dentro.'), f2 = en('Entonces es de la casa.');
    ok(f1.length === 1 && f1[0][0] === 37 && f1[0][1] === 1, `«El modelo es de fuera. El prompt es de dentro.»: una vez, en el paso 37 de E6 (${JSON.stringify(f1)})`);
    ok(f2.length === 1 && f2[0][0] === 45 && f2[0][1] === 1, `«…Entonces es de la casa.»: una vez, en el paso 45 de E6 (${JSON.stringify(f2)})`);
    // medida: cadenas dichas (opciones elegidas incluidas), sin avisos ni tarjeta; minutos = Σ speechDuration (texto ×1)
    const dichas = todo.filter(l => l.who !== 'aviso' && l.who !== 'tarjeta');
    const ms = (t) => Math.max(1100, 900 + t.length * 55);
    const lineas = dichas.length, chars = dichas.reduce((a, l) => a + l.text.length, 0), min = dichas.reduce((a, l) => a + ms(l.text), 0) / 60000;
    const bruno = dichas.filter(l => l.who === 'bruno').length;
    // (E6: el prefijo de quien habla por fax, «TEODORO (fax): », es una etiqueta, no texto de la línea)
    const largas = dichas.filter(l => l.text.replace(/^[A-ZÁÉÍÓÚÑ ]+ \((?:fax|correo)\): /, '').length > 80);
    console.log(`    camino principal (49 pasos de E6, modo rápido): ${lineas} líneas · ${chars.toLocaleString('es-ES')} caracteres · ${min.toFixed(1).replace('.', ',')} min de lectura · Bruno ${bruno}`);
    console.log(`    frente a E4 (561 líneas · 33,0 min): ${lineas - 561 >= 0 ? '+' : ''}${lineas - 561} líneas · ${(min - 33).toFixed(1).replace('.', ',')} min (§9.1 prevé +7 → 568; la megafonía de los 10 s no sale en modo rápido)`);
    const tramos = [[1, 18], [19, 23], [24, 29], [30, 39], [40, 45], [46, 49]].map(([a, b]) => `${a}-${b}: ${Object.entries(porPaso).filter(([n]) => n >= a && n <= b).reduce((x, [, L]) => x + L.filter(l => l.who !== 'aviso' && l.who !== 'tarjeta').length, 0)}`);
    console.log(`    por tramos de pasos: ${tramos.join(' · ')}`);
    fs.writeFileSync(path.join(logDir, 'camino-principal.tsv'), Object.entries(porPaso).flatMap(([n, L]) => L.filter(l => l.who !== 'aviso' && l.who !== 'tarjeta').map(l => `${n}\t${l.who}\t${l.text}`)).join('\n') + '\n');
    ok(lineas <= 576, `camino principal ≤ 576 líneas (tope de §9.1): ${lineas}`);
    ok(!largas.length, `ninguna línea dicha en el camino pasa de 80 caracteres${largas.length ? ': ' + largas.map(l => `«${l.text}» (${l.text.length})`).join(' · ') : ''}`);

    // §11.2.8: ascensor con atajos
    console.log('\n§11.2.8 · ascensor con atajos\n');
    await G(() => __game.load('e5_asc_23')); await G(() => __game.waitIdle());
    const viaje = async (planta) => {
      await G(() => { __game.doVerb('usar', 'ascensor_cpd'); });
      for (let i = 0; i < 40 && !(await G(() => __game.currentDialogOptions())); i++) await page.waitForTimeout(50);
      await R.chooseByText(planta);
      await page.waitForTimeout(200);
      return G(() => ({ room: __game.state().room, opts: __game.currentDialogOptions() }));
    };
    let v = await viaje('Planta 1');
    ok(v.room === 'cpd' && Array.isArray(v.opts) && v.opts[0] === 'Redacción' && v.opts.includes('Redacción de papel') && v.opts.includes('Despachos'), `Acto II, Sistemas → Planta 1: submenú ${JSON.stringify(v.opts)}`);
    await R.chooseByText('Redacción de papel'); await G(() => __game.waitIdle());
    const lleg = await G(() => { const g = __game.game, e = g.room.def.entries.pecera, p = g.player; const ep = Array.isArray(e) ? e : [e.x, e.y]; return { room: g.state.room, at: [Math.round(p.x), Math.round(p.y)], ep }; });
    ok(lleg.room === 'catacumba' && Math.hypot(lleg.at[0] - lleg.ep[0], lleg.at[1] - lleg.ep[1]) < 12, `«Redacción de papel» → catacumba, por su entrada «pecera» (${JSON.stringify(lleg)})`);
    await G(() => __game.load('e5_asc_23')); await G(() => __game.waitIdle());
    v = await viaje('Planta 0');
    ok(v.room === 'vestibulo' && !v.opts, `Sistemas → Planta 0: sin submenú (${v.room})`);
    await G(() => __game.load('e5_asc_41')); await G(() => __game.waitIdle());
    v = await viaje('Planta 1');
    ok(Array.isArray(v.opts) && v.opts[0] === 'Redacción' && !v.opts.some(o => /Sala Amazonas/.test(o)), `Acto III, Sistemas → Planta 1: la Sala no sale (${JSON.stringify(v.opts)})`);
    await page.keyboard.press('Escape'); await G(() => __game.waitIdle());
    ok((await G(() => __game.state().room)) === 'pecera' && !(await G(() => __game.currentDialogOptions())), 'Escape en el submenú → el rellano de la Redacción');
  } catch (e) {
    failures++;
    console.log('  ✗ ' + (e instanceof StepFail ? e.message : (e && e.stack || e)));
    try { await page.screenshot({ path: path.join(logDir, 'fallo.png') }); } catch (_) { /* ignore */ }
  }
  ok(!consoleErrors.length, 'sin errores de consola' + (consoleErrors.length ? ': ' + consoleErrors.slice(0, 5).join(' | ') : ''));
  await browser.close();
  server.close();

  // §11.2.11: topes
  console.log('\n§11.2.11 · topes (text-audit --estatico --plan --e2 --e5 --recuento)\n');
  const ta = await new Promise(res => { const p = spawn(process.execPath, [path.join(here, 'text-audit.mjs'), '--estatico', '--plan', '--e2', '--e5', '--recuento'], { cwd: path.resolve(here, '..') }); let o = ''; p.stdout.on('data', d => { o += d; }); p.stderr.on('data', d => { o += d; }); p.on('close', c => res({ c, o })); });
  fs.writeFileSync(path.join(logDir, 'text-audit.log'), ta.o);
  const rec = ta.o.split('\n').filter(l => /E5 §8\)/.test(l) && /\d+ \/ \d+/.test(l)).map(l => l.trim().replace(/^· /, ''));
  ok(ta.c === 0 && /PLAN: OK/.test(ta.o) && /E2: OK/.test(ta.o) && /E5: OK/.test(ta.o), `text-audit --estatico --plan --e2 --e5: OK${rec.length ? '\n      ' + rec.join('\n      ') : ''}`);
}

console.log(failures ? `\nE5: ${failures} FALLOS (${checks} comprobaciones)` : `\nE5: OK (${checks} comprobaciones)`);
process.exit(failures ? 1 : 0);
