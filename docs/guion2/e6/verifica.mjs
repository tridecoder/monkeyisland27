// E6 · comprobación de la tabla (REVISIÓN 2, la contra). Uso: node verifica.mjs   (y después: node personas3.mjs)
// 1) cada cadena «actual» de T, TUMBADAS, CORO y NUEVOS existe literal HOY en content/;
// 2) lo nuevo cumple reglas: ≤ 80, sin coletilla del auditor, sin «Como…»/vetadas, sin fórmulas con tope;
//    el remate seco se PERMITE en filas M/X (voz de un solo golpe, decidido a mano) y se lista; en filas A, no;
// 3) recuento del remate seco antes/después (con las bajas de actors.js de §4.3 y las constantes) y tics de §8.
import fs from 'node:fs'; import path from 'node:path';
const ROOT = '/home/user/monkeyisland27';
const PR = await import(ROOT + '/tools/plan-rules.mjs');
const { esRemate } = await import('./medida2.mjs');
const { T, TUMBADAS, CORO, CONSTANTES } = await import('./tabla.mjs?' + Date.now());
const { NUEVOS } = await import('./nuevos.mjs?' + Date.now());
const lit = (f) => PR.literales(fs.readFileSync(path.join(ROOT, f.startsWith('engine/') ? '' : 'content', f), 'utf8'));
const todos = new Set(); for (const f of ['game.js', 'items.js', 'actors.js', 'pistas.js', 'duelo.js', 'lib/movil.js', 'rooms/office.js', 'rooms/sala_amazonas.js']) for (const s of lit(f)) todos.add(s);
const VETO = /\b(cariño|criatura|chaval)\b|^Como\s|[.!?…]\s+Como\s/i;
const TOPRE = PR.TOPES_E2_JUEGO.filter(t => !/cariño|Diseño|interstitial|pop-?up|Emoji|PORTÁTIL|\(\*/.test(t.txt)).map(t => [new RegExp(t.re.source, t.re.flags.replace('g', '')), t.txt]);
let mal = 0, conNombre = 0; const out = [], remVoz = [];
const reglas = (n, a = '') => {
  const pro = [];
  if (n.length > 80) pro.push('>80');
  if (PR.COLETILLA_RE.test(n)) pro.push('COLETILLA');
  if (VETO.test(n) && !VETO.test(a)) pro.push('VETO');
  for (const [re, txt] of TOPRE) if (re.test(n) && !re.test(a)) pro.push('TOPE ' + txt);
  return pro;
};
for (const [f, a, n, nota, id, est] of T) {
  const k = lit(f).filter(x => x === a).length;
  if (!k) { mal++; out.push(`NO EXISTE  ${id} ${f}: ${a}`); continue; }
  if (/Brais|Eutimio/.test(a)) conNombre++;
  if (n != null) {
    const pro = reglas(n, a);
    if (esRemate(n)) { if (est === 'A') pro.push('REMATE en fila A'); else remVoz.push(`${id} ${n}`); }
    if (pro.length) { mal++; out.push(`${pro.join(',')}  ${id} ${f}: ${n}`); }
  }
  if (k > 1) out.push(`(${k} claves) ${id} ${f}: ${a}`);
}
for (const [f, a, , , id] of TUMBADAS) if (!lit(f).includes(a)) { mal++; out.push(`TUMBADA NO EXISTE ${id} ${f}: ${a}`); }
for (const [f, a] of CORO) { const s = fs.readFileSync(path.join(ROOT, 'content', f), 'utf8'); if (!s.includes(a)) { mal++; out.push('CORO NO EXISTE ' + f + ': ' + a); } }
for (const x of NUEVOS) {
  const n = x.texto; const pro = x.cuenta === false ? [] : reglas(n);
  if (x.cuenta !== false && !x.reusa && esRemate(n)) pro.push('REMATE');
  if (x.actual && !lit(x.f).includes(x.actual)) pro.push('ACTUAL NO EXISTE');
  if (x.reusa && !todos.has(n)) pro.push('REUSA PERO NO EXISTE');
  if (pro.length) { mal++; out.push(`NUEVO ${pro.join(',')}  ${x.id}: ${n}`); }
}
console.log(out.join('\n'));
console.log(`\nfilas T ${T.length} (A ${T.filter(t => t[5] === 'A').length} · M ${T.filter(t => t[5] === 'M').length} · X ${T.filter(t => t[5] === 'X').length}) · tumbadas ${TUMBADAS.length} · coro ${CORO.length} · nuevos ${NUEVOS.length}; problemas ${mal}; con nombre nuevo ${conNombre}`);
console.log(`remates de voz que quedan en filas M/X (a propósito): ${remVoz.length}`);
// ---- recuento antes / después sobre el corpus (sin music.js)
const C = JSON.parse(fs.readFileSync(new URL('./corpus.json', import.meta.url))).filter(c => !c.file.endsWith('music.js'));
const map = new Map(); for (const [f, a, n] of T) map.set('content/' + f + '\u0000' + a, n);
for (const x of NUEVOS) if (x.actual) map.set('content/' + x.f + '\u0000' + x.actual, x.texto);
let after = []; for (const c of C) { const k = c.file + '\u0000' + c.text; if (map.has(k)) { const n = map.get(k); if (n != null) after.push({ ...c, text: n }); } else after.push(c); }
// §4.3: los murmullos de actors.js que la sala ya declara se borran (NO la línea 224: es el Mirar de Bruno por defecto)
const fuera = new Set(C.filter(c => c.file !== 'content/actors.js').map(c => c.text));   // §4.3 decide sobre el texto de HOY
after = after.filter(c => !(c.file === 'content/actors.js' && fuera.has(c.text) && !/Respondo a todos/.test(c.text)));
// constantes: el segundo literal desaparece
for (const [f, t] of CONSTANTES) { const i = after.findIndex(c => c.file === 'content/' + f && c.text === t); const j = after.findIndex((c, k) => k > i && c.file === 'content/' + f && c.text === t); if (i >= 0 && j >= 0) after.splice(j, 1); }
for (const x of NUEVOS) if (!x.actual && x.cuenta !== false) after.push({ file: 'content/' + x.f, text: x.texto, ctx: 'say(' });
const rem = (A) => A.filter(c => esRemate(c.text)).length;
const r0 = rem(C), r1 = rem(after);
console.log(`REMATE SECO  antes ${r0}/${C.length} = ${(100 * r0 / C.length).toFixed(1)} %  ·  después ${r1}/${after.length} = ${(100 * r1 / after.length).toFixed(1)} %`);
const sinEv = (A) => A.filter(c => !/eventos/.test(c.file));
console.log(`  sin Eventos: antes ${rem(sinEv(C))}/${sinEv(C).length}  después ${rem(sinEv(after))}/${sinEv(after).length}`);
const cnt = (A, re) => A.filter(c => re.test(c.text)).length;
for (const [re, nom] of [[/t[áa]per/i, 'táper'], [/\b(19|20)\d\d\b/, 'año 19xx/20xx'], [/Huele a 2019/, '«Huele a 2019»'], [/Diecinueve años/, '«Diecinueve años»'], [/Lo que diga el Lector Medio/, '«Lo que diga el Lector Medio»'], [/Era solo eso/, '«Era solo eso»'], [/\bPerd[óo]n\b/, '«Perdón»'], [/próxima versión/, '«próxima versión»'], [/[Pp]or respeto/, '«por respeto»']])
  console.log(`  ${nom.padEnd(32)} ${cnt(C, re)} → ${cnt(after, re)}`);
const porF = (A) => { const o = {}; for (const c of A) { const k = c.file.replace('content/', ''); o[k] = o[k] || [0, 0]; o[k][0]++; if (esRemate(c.text)) o[k][1]++; } return o; };
const a0 = porF(C), a1 = porF(after);
fs.writeFileSync(new URL('./porfichero.tsv', import.meta.url), 'fichero\tantes_n\tantes_rem\tantes_%\tdespués_n\tdespués_rem\tdespués_%\n' + Object.keys(a0).sort().map(k => [k, a0[k][0], a0[k][1], (100 * a0[k][1] / a0[k][0]).toFixed(1), (a1[k] || [0, 0])[0], (a1[k] || [0, 0])[1], a1[k] ? (100 * a1[k][1] / a1[k][0]).toFixed(1) : '-'].join('\t')).join('\n'));
const malas = Object.keys(a1).filter(k => k.startsWith('rooms/') && !/eventos|titulador\.datos/.test(k) && a1[k][1] / a1[k][0] > 0.22);
console.log(`  salas por encima del 22 %: ${malas.length ? malas.join(', ') : 'ninguna'} (Eventos y los datos del titulador, protegidos, fuera)`);
fs.writeFileSync(new URL('./after2.json', import.meta.url), JSON.stringify(after));
