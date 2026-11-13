#!/usr/bin/env node
// TODAS LAS PRUEBAS con una tabla de resumen. Cada herramienta levanta su propio servidor en un puerto libre, así que
// varios agentes pueden lanzarlas a la vez (y este script las lanza en paralelo: --jobs).
//
//   node tools/test-all.mjs                      todo (≈ 5 min con 3 en paralelo; antes ≈ 12 en serie)
//   node tools/test-all.mjs --rapido             muestra: smoke sin dispositivos ni llamadas en tiempo real, play-mouse
//                                                solo geometría, fuzz --rapido (≈ 2 min)
//   node tools/test-all.mjs --sala=pecera        lo que toca a esa sala: check, motor, vista previa (tools/sala.mjs),
//                                                geometría de esa sala, fuzz de objetos en esa sala, walkthroughs, el test
//                                                del paquete antiguo que la cubre, text-audit y contraste
//   node tools/test-all.mjs --solo=smoke,fuzz    solo esas
//   --jobs=3 (en paralelo) · --log=<dir> (registros; por defecto tools/shots/test-all/) · --lista (enseña el plan)
// Sale con 1 si algo falla. Los registros completos de cada prueba quedan en <log>/<nombre>.log.
import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = Object.fromEntries(process.argv.slice(2).filter(a => a.startsWith('--')).map(a => { const [k, v] = a.slice(2).split('='); return [k, v ?? true]; }));
const rapido = !!args.rapido;
const salas = args.sala ? String(args.sala).split(',') : null;
const jobs = Math.max(1, Number(args.jobs || 3));
const logDir = path.resolve(args.log || path.join(here, 'shots', 'test-all'));
fs.mkdirSync(logDir, { recursive: true });

// paquete antiguo de pruebas que cubre cada sala (tools/test-paquete-*.mjs)
const PAQ = { vestibulo: 'a', cpd: 'a', pecera: 'b', pajarera: 'b', office: 'c', catacumba: 'c', ecosistema: 'd', eventos: 'd', administracion: 'd', sala_amazonas: 'd' };

const T = [];
const add = (name, file, a = [], timeout = 900) => T.push({ name, file, args: a, timeout });
if (salas) {
  add('check', 'check.mjs');
  add('motor', 'test-motor.mjs');
  for (const s of salas) add('sala ' + s, 'sala.mjs', [s, '--sin-imagenes']);
  add('geometria', 'play-mouse.mjs', ['--solo=geometria', '--sala=' + salas.join(',')]);
  add('walkthrough', 'walkthrough.mjs');
  add('walkthrough --alt', 'walkthrough.mjs', ['--alt']);
  add('extras', 'extras.mjs');
  add('fuzz (objetos)', 'fuzz.mjs', ['--solo=objetos', '--sala=' + salas.join(','), ...(rapido ? ['--rapido'] : [])]);
  for (const p of [...new Set(salas.map(s => PAQ[s]).filter(Boolean))]) add('test-paquete-' + p, `test-paquete-${p}.mjs`);
  add('text-audit', 'text-audit.mjs');
  add('contrast', 'contrast.mjs');
} else {
  add('check', 'check.mjs');
  add('motor', 'test-motor.mjs');
  add('smoke', 'smoke.mjs', rapido ? ['--rapido'] : []);
  add('walkthrough', 'walkthrough.mjs');
  add('walkthrough --alt', 'walkthrough.mjs', ['--alt']);
  add('extras', 'extras.mjs');
  add('play-mouse', 'play-mouse.mjs', rapido ? ['--solo=geometria'] : []);
  add('fuzz', 'fuzz.mjs', rapido ? ['--rapido'] : []);
  add('text-audit', 'text-audit.mjs');
  add('contrast', 'contrast.mjs');
  for (const p of ['a', 'b', 'c', 'd']) add('test-paquete-' + p, `test-paquete-${p}.mjs`);
}
const solo = args.solo ? String(args.solo).split(',') : null;
const plan = solo ? T.filter(t => solo.some(s => t.name.startsWith(s) || t.file.startsWith(s))) : T;
// las largas primero (mejor reparto en paralelo)
const WEIGHT = { fuzz: 5, 'play-mouse': 4, smoke: 4, motor: 2, 'test-paquete-a': 2, 'text-audit': 2 };
plan.sort((a, b) => (WEIGHT[b.name.split(' ')[0]] || 1) - (WEIGHT[a.name.split(' ')[0]] || 1));
if (args.lista) { for (const t of plan) console.log(`${t.name.padEnd(22)} node tools/${t.file} ${t.args.join(' ')}`); process.exit(0); }

const lastLine = (txt) => {
  const lines = txt.split('\n').map(l => l.trim()).filter(Boolean);
  const verdict = [...lines].reverse().find(l => /OK|FALL|ERROR|COMPLETO|TODO|✗|Guardado/.test(l));
  return (verdict || lines[lines.length - 1] || '').slice(0, 70);
};
function run(t) {
  return new Promise(res => {
    const t0 = Date.now();
    const p = spawn(process.execPath, [path.join(here, t.file), ...t.args], { cwd: path.resolve(here, '..'), env: process.env });
    let out = '';
    p.stdout.on('data', d => { out += d; });
    p.stderr.on('data', d => { out += d; });
    const kill = setTimeout(() => { out += `\n[test-all] TIEMPO AGOTADO (${t.timeout} s)`; p.kill('SIGKILL'); }, t.timeout * 1000);
    p.on('close', (code) => {
      clearTimeout(kill);
      const s = Math.round((Date.now() - t0) / 1000);
      const log = path.join(logDir, t.name.replace(/[^\w-]+/g, '_') + '.log');
      fs.writeFileSync(log, out);
      const fallos = (out.match(/^\s*✗/gm) || []).length;
      const r = { ...t, code, s, log, fallos, resumen: lastLine(out) };
      console.log(`${code === 0 ? '✓' : '✗'} ${t.name.padEnd(22)} ${String(s).padStart(4)} s  ${r.resumen}`);
      res(r);
    });
  });
}

console.log(`test-all: ${plan.length} pruebas, ${jobs} en paralelo${rapido ? ' (rápido)' : ''}${salas ? ' · salas: ' + salas.join(', ') : ''}\n`);
const T0 = Date.now();
const queue = plan.slice(), results = [];
await Promise.all(Array.from({ length: Math.min(jobs, queue.length) }, async () => { while (queue.length) results.push(await run(queue.shift())); }));
const total = Math.round((Date.now() - T0) / 1000);
const bad = results.filter(r => r.code !== 0);
console.log('\n┌────────────────────────┬────────┬──────┬────────────────────────────────────────────────────────────────────────┐');
console.log('│ prueba                 │ estado │  s   │ resumen                                                                │');
console.log('├────────────────────────┼────────┼──────┼────────────────────────────────────────────────────────────────────────┤');
for (const t of plan) {
  const r = results.find(x => x === t || (x.name === t.name && x.file === t.file && x.args.join() === t.args.join()));
  if (!r) continue;
  console.log(`│ ${r.name.padEnd(22)} │ ${(r.code === 0 ? 'OK' : 'FALLA').padEnd(6)} │ ${String(r.s).padStart(4)} │ ${r.resumen.padEnd(70)} │`);
}
console.log('└────────────────────────┴────────┴──────┴────────────────────────────────────────────────────────────────────────┘');
console.log(`\n${bad.length ? `FALLAN ${bad.length} de ${results.length}` : `TODO OK (${results.length})`} en ${total} s · registros en ${path.relative(process.cwd(), logDir)}/`);
for (const r of bad) console.log(`  ✗ ${r.name}: ${path.relative(process.cwd(), r.log)}`);
process.exit(bad.length ? 1 : 0);
