// E7 · CONTRA — comprobación de la tabla única y de su aplicación en una COPIA (nunca en el repo).
//   node verifica_e7.mjs        → 1) cada «actual» existe literal HOY en content/ (y cuántas veces), sin solapes, ≤ 80,
//                                   sin «Como…», sin coletilla nueva, sin fórmula con tope nueva; altas ≤ 80.
//                                 2) copia el repo a ./copia, aplica la tabla y luego el código del diseño (disenio_patch.mjs),
//                                   `node --check` de lo tocado. 3) en la copia: check.mjs y text-audit (lo lanza aparte run.sh).
import fs from 'node:fs'; import path from 'node:path'; import { execSync } from 'node:child_process';
const ROOT = '/home/user/monkeyisland27';
const HERE = path.dirname(new URL(import.meta.url).pathname);
const PR = await import(ROOT + '/tools/plan-rules.mjs');
const { filas, altas } = await import(HERE + '/../tabla_e7.mjs?' + Date.now());
const { PARCHES, MOTOR } = await import(HERE + '/disenio_patch.mjs?' + Date.now());
const src = (root, f) => fs.readFileSync(path.join(root, 'content', f), 'utf8');
let mal = 0; const out = [];
const VETO = /\b(cariño|criatura|chaval|niño)\b/i, COMO = /^Como\s|[.!?…]\s+Como\s/;
const TOPRE = [...PR.TOPES_E2_JUEGO, ...PR.TOPES_E5_JUEGO, ...PR.TOPES_E6_JUEGO].filter(t => t.re).map(t => [new RegExp(t.re.source, t.re.flags.replace('g', '')), t.txt]);
const extra = [[/por triplicado/i, '«triplicado»'], [/\bpor si acaso\b/i, '«por si acaso»'], [/\bplantilla\b/i, '«plantilla»'], [/se fue(ron)? a las seis/i, '«se fue a las seis»'], [/, por \p{L}+\.$/u, '«, por X.»']];
// 1) existencia, solapes y reglas
const vistos = new Map();
for (const r of filas) {
  const k = PR.literales(src(ROOT, r.fichero)).filter(x => x === r.actual).length;
  if (!k) { mal++; out.push(`NO EXISTE  ${r.id} ${r.fichero}: ${r.actual}`); continue; }
  if (k > 1) out.push(`(${k} claves iguales, cambian todas) ${r.id} ${r.fichero}: ${r.actual}`);
  const key = r.fichero + '|' + r.actual;
  if (vistos.has(key)) { mal++; out.push(`SOLAPE ${r.id} y ${vistos.get(key)}: ${r.actual}`); }
  vistos.set(key, r.id);
  const n = r.nuevo; if (n == null) continue;
  const pro = [];
  if (n.length > 80) { pro.push('>80'); mal++; }
  if (PR.COLETILLA_RE.test(n) && !PR.COLETILLA_RE.test(r.actual)) pro.push('coletilla(+1)');
  if (VETO.test(n) && !VETO.test(r.actual)) { pro.push('VETO'); mal++; }
  if (COMO.test(n)) { pro.push('COMO'); mal++; }
  for (const [re, txt] of [...TOPRE, ...extra]) if (re.test(n) && !re.test(r.actual)) pro.push('+1 ' + txt);
  if (PR.esRemateSeco(n) !== PR.esRemateSeco(r.actual)) pro.push(PR.esRemateSeco(n) ? 'remate +1' : 'remate −1');
  if (pro.length) out.push(`  ${r.id.padEnd(9)} ${pro.join(', ')}  · ${n}`);
}
// una fila cuyo «actual» está dentro del «actual» de otra del mismo fichero (sustitución que pisaría a otra)
for (const a of filas) for (const b of filas) if (a !== b && a.fichero === b.fichero && b.actual.includes(a.actual) && a.actual !== b.actual) { const qa = `'${a.actual}'`; if (b.actual.includes(qa)) { out.push(`CONTENIDA ${a.id} ⊂ ${b.id}`); mal++; } else out.push(`(nota) ${a.id} es subcadena de ${b.id}, pero no con comillas: no se pisan`); }
for (const a of altas) {
  const pro = [];
  if (a.texto.length > 80) { pro.push('>80'); mal++; }
  if (COMO.test(a.texto)) { pro.push('COMO'); mal++; }
  if (VETO.test(a.texto)) { pro.push('VETO'); mal++; }
  if (PR.COLETILLA_RE.test(a.texto)) pro.push('coletilla');
  for (const [re, txt] of [...TOPRE, ...extra]) if (re.test(a.texto)) pro.push(txt);
  if (PR.esRemateSeco(a.texto)) pro.push('remate');
  if (pro.length) out.push(`  alta ${a.id.padEnd(7)} ${pro.join(', ')}  · ${a.texto}`);
}
console.log(out.join('\n'));
console.log(`\nfilas ${filas.length} · altas ${altas.length} · errores: ${mal}`);
// 2) copia, tabla y código
const COPIA = path.join(HERE, 'copia');
fs.rmSync(COPIA, { recursive: true, force: true }); fs.mkdirSync(COPIA);
for (const d of ['content', 'engine', 'icons']) fs.cpSync(path.join(ROOT, d), path.join(COPIA, d), { recursive: true });
fs.mkdirSync(path.join(COPIA, 'tools'));
for (const f of fs.readdirSync(path.join(ROOT, 'tools'))) if (/\.(mjs|js)$/.test(f)) fs.copyFileSync(path.join(ROOT, 'tools', f), path.join(COPIA, 'tools', f));
for (const f of ['index.html', 'style.css', 'manifest.webmanifest', 'README.md']) fs.copyFileSync(path.join(ROOT, f), path.join(COPIA, f));
try { fs.symlinkSync(path.join(ROOT, 'node_modules'), path.join(COPIA, 'node_modules')); } catch (e) { /* sin node_modules */ }
const q = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
let fallo = 0; const tocados = new Set();
for (const r of filas) {
  const p = path.join(COPIA, 'content', r.fichero); let s = fs.readFileSync(p, 'utf8');
  const forms = [`'${q(r.actual)}'`, `"${r.actual.replace(/"/g, '\\"')}"`, '`' + r.actual + '`'];
  const form = forms.find(x => s.includes(x));
  if (!form) { fallo++; console.log('NO APLICA', r.id); continue; }
  if (r.nuevo == null) {
    const F = esc(form);
    const reglas = [new RegExp(`^[ \\t]*\\[\\s*\\w+\\s*,\\s*${F}\\s*\\],?[ \\t]*(//.*)?\\n`, 'm'),                // [X, '…'], en su línea
      new RegExp(`^[ \\t]*await api\\.say(?:As)?\\(\\s*(?:\\w+\\s*,\\s*)?${F}\\s*\\);[ \\t]*(//.*)?\\n`, 'm'),  // await api.say*(…, '…');
      new RegExp(`\\[\\s*\\w+\\s*,\\s*${F}\\s*\\]`),                                                           // [X, '…'] dentro de una lista
      new RegExp(`,\\s*${F}`), new RegExp(`${F},\\s*`)];
    const re = reglas.find(x => x.test(s));
    if (!re) { fallo++; console.log('NO SÉ QUITAR', r.id); continue; }
    s = s.replace(re, '');
  } else {
    const nf = form[0] === "'" ? `'${q(r.nuevo)}'` : form[0] === '"' ? `"${r.nuevo.replace(/"/g, '\\"')}"` : '`' + r.nuevo + '`';
    s = s.split(form).join(nf);
  }
  fs.writeFileSync(p, s); tocados.add(p);
}
console.log(`tabla aplicada en la copia: ${filas.length - fallo} de ${filas.length}`);
for (const [f, viejo, nuevo] of [...PARCHES, ...MOTOR]) {
  const p = path.join(COPIA, f); const s = fs.readFileSync(p, 'utf8');
  const n = s.split(viejo).length - 1;
  if (n !== 1) { fallo++; console.log(`PARCHE ${f}: «${viejo.slice(0, 70).replace(/\n/g, '⏎')}» aparece ${n} veces`); continue; }
  fs.writeFileSync(p, s.replace(viejo, () => nuevo)); tocados.add(p);
}
console.log(`código del diseño: ${PARCHES.length + MOTOR.length} parches; fallos totales ${fallo}`);
for (const p of tocados) execSync(`node --check ${p}`);
console.log('sintaxis de lo tocado: OK (' + tocados.size + ' ficheros)');
process.exitCode = (mal || fallo) ? 1 : 0;
