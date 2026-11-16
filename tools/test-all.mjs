#!/usr/bin/env node
// TODAS LAS PRUEBAS con una tabla de resumen. Cada herramienta levanta su propio servidor en un puerto libre, así que
// varios agentes pueden lanzarlas a la vez (y este script las lanza en paralelo: --jobs).
//
//   node tools/test-all.mjs                      todo (25 pruebas; ≈ 30 min con 3 en paralelo: test-e5, test-e6 y test-bloqueos pasan de 10)
//   node tools/test-all.mjs --rapido             muestra: smoke sin dispositivos ni llamadas en tiempo real, play-mouse
//                                                solo geometría, fuzz --rapido (≈ 2 min)
//   node tools/test-all.mjs --sala=pecera        lo que toca a esa sala: check, motor, vista previa (tools/sala.mjs),
//                                                geometría de esa sala, fuzz de objetos en esa sala, walkthroughs, el test
//                                                de comedia del paquete que la cubre (tools/test-comedia-p1..p4.mjs),
//                                                text-audit (con las reglas del plan, de E2, de E5 y de E6 como fallo),
//                                                contraste y las pruebas de E6 de los paquetes de esas salas (test-e6 --sala)
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

// test de comedia del paquete que reescribió cada sala (tools/test-comedia-p<n>.mjs; plan §11)
const PAQ = { vestibulo: 'p1', cpd: 'p1', pecera: 'p2', pajarera: 'p2', office: 'p3', catacumba: 'p3', administracion: 'p3', sala_amazonas: 'p4', ecosistema: 'p4', eventos: 'p4' };

const T = [];
const add = (name, file, a = [], timeout = 900) => T.push({ name, file, args: a, timeout });
if (salas) {
  add('check', 'check.mjs');
  add('motor', 'test-motor.mjs');
  add('fase0', 'test-fase0.mjs');
  for (const s of salas) add('sala ' + s, 'sala.mjs', [s, '--sin-imagenes']);
  add('geometria', 'play-mouse.mjs', ['--solo=geometria', '--sala=' + salas.join(',')]);
  add('walkthrough', 'walkthrough.mjs');
  add('walkthrough --alt', 'walkthrough.mjs', ['--alt']);
  add('extras', 'extras.mjs');
  add('fuzz (objetos)', 'fuzz.mjs', ['--solo=objetos', '--sala=' + salas.join(','), ...(rapido ? ['--rapido'] : [])]);
  for (const p of [...new Set(salas.map(s => PAQ[s]).filter(Boolean))]) add('comedia-' + p, `test-comedia-${p}.mjs`);
  if (salas.some(s => ['pecera', 'catacumba'].includes(s))) add('e4', 'test-e4.mjs', ['--sin-capturas'], 1500);   // ENMIENDA E4
  add('text-audit', 'text-audit.mjs', ['--plan', '--e2', '--e5', '--e6']);
  add('contrast', 'contrast.mjs');
  add('e6', 'test-e6.mjs', ['--sala=' + salas.join(',')], 2700);   // ENMIENDA E6 §10 I2 (4)
} else {
  add('check', 'check.mjs');
  add('motor', 'test-motor.mjs');
  add('smoke', 'smoke.mjs', rapido ? ['--rapido'] : []);
  add('movil', 'test-movil.mjs');                     // el móvil de Bruno con ratón y dedo (menú, correo, abuela)
  add('fase0', 'test-fase0.mjs');                     // sistemas comunes del plan de comedia (duelo, objetivo, pistas, hora, ambiente, movimiento, efectos)
  add('walkthrough', 'walkthrough.mjs');
  add('walkthrough --alt', 'walkthrough.mjs', ['--alt']);
  add('extras', 'extras.mjs');
  add('play-mouse', 'play-mouse.mjs', rapido ? ['--solo=geometria'] : [], 2400);   // la partida entera con ratón + conexiones + geometría
  add('fuzz', 'fuzz.mjs', rapido ? ['--rapido'] : [], 2400);
  add('text-audit', 'text-audit.mjs', ['--plan', '--e2', '--e5', '--e6']);   // reglas del plan de comedia (§6.1, §12.2, topes §2.4), de E2 (§12.4, §7.6), de E5 (§8) y de E6 (§8) como FALLO
  add('contrast', 'contrast.mjs');
  for (const p of ['p1', 'p2', 'p3', 'p4']) add('comedia-' + p, `test-comedia-${p}.mjs`);
  add('heredado', 'test-heredado.mjs');               // lo que comprobaban los test-paquete-a/b/c/d retirados y sigue valiendo
  add('critica3', 'test-critica3.mjs');               // arreglos de la crítica 3 (N1-N11, revanchas de Maripaz sin pop-up)
  add('e4', 'test-e4.mjs', [], 1500);                 // ENMIENDA E4: titulador contra el generador de referencia, ratón, móvil, secretos, pasos 34/40, epílogo, hoja, ráfaga
  add('e5', 'test-e5.mjs', [], 2700);                 // ENMIENDA E5 §11.2: test-e5-motor y test-e5-pa…pe, frase de Anselmo y medida del camino, ascensor, topes
  add('e6', 'test-e6.mjs', [], 2700);                 // ENMIENDA E6 §11.2: test-e6-motor, -i1 y -pa…pf; armario, columna, tele, duelos, COMODÍN, medida (49 pasos), topes E6
  add('e7-motor', 'test-e7-motor.mjs', [], 900);      // ENMIENDA E7 §5: `aTiempo` del duelo (D3) con ratón y dedo, D1/D2/D4 sin cambios, F3
  add('e7', 'test-e7.mjs', [], 1800);                 // ENMIENDA E7 §10: nudo del Acto II, tele, D3 por su camino, F4, F6, golpes restaurados, camino principal, topes E7
  add('bloqueos', 'test-bloqueos.mjs', [], 2400);
  add('coherencia', 'test-coherencia.mjs', [], 1200);  // lo que el juego da por hecho, pasa (Evaristo y su L2, correos que llegan, presuposiciones, sillas, Gervasio que insiste, partidas sin L2)     // puertas ocultas: cada paso sin cada requisito, pistas por sub-estado, los tres casos del dueño, partidas antiguas
}
const solo = args.solo ? String(args.solo).split(',') : null;
const plan = solo ? T.filter(t => solo.some(s => t.name.startsWith(s) || t.file.startsWith(s))) : T;
// las largas primero (mejor reparto en paralelo)
const WEIGHT = { e6: 7, e5: 6, bloqueos: 6, e7: 5, fuzz: 5, 'play-mouse': 4, smoke: 4, e4: 3, motor: 2, fase0: 2, 'comedia-p1': 2, 'comedia-p2': 2, 'text-audit': 3 };
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
