// Titulador de Discover · juego de piezas definitivo (segunda vuelta: moldes reales con un hueco).
// Uso: node gen.mjs N SEMILLA     → N titulares al azar (combinación · usuarios · etiqueta · lo que dice Yoli)
//      node gen.mjs --todas       → valida TODAS las combinaciones (ancho a 190 px, gramática básica, topes, muletillas)
//      node gen.mjs --hitos       → hitos de la escala
// Lo que dice Yoli se simula como una partida: el «anterior» de la primera es 3 (el titular de Bruno) y cada línea
// se dice una sola vez; después, «(muda)».
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
export const P = JSON.parse(readFileSync(join(here, 'piezas.json'), 'utf8'));
export const { autoridades: A, asuntos: S, ganchos: G } = P;
const byId = (L, id) => L.find(x => x.id === id);

const fill = (t, s) => t
  .replaceAll('{S}', s.S).replaceAll('{C}', s.C).replaceAll('{P}', s.P).replaceAll('{ES}', s.ES)
  .replaceAll('{E}', s.E).replaceAll('{N}', s.N).replaceAll('{s}', s.s ?? '')
  .replace(/\ba el\b/g, 'al').replace(/\bde el\b/g, 'del');
const cap = t => t[0].toUpperCase() + t.slice(1);

export function titular(a, s, g) {
  const k = `${a.id}|${s.id}|${g.id}`;
  if (P.especiales[k]) return P.especiales[k];
  const t = (s.dom === 'casa' && a.tObj && a.tObj[g.id]) || a.t[g.id];
  return cap(fill(t, s));
}

const redondeo = u => u < 100 ? Math.max(3, Math.round(u)) : u < 10000 ? Math.round(u / 10) * 10 : Math.round(u / 100) * 100;
export function usuarios(a, s, g) {
  let u = s.B * a.k * g.k;
  for (const f of P.afinidades) if (f.a === a.id && f.s === s.id && (!f.g || f.g === g.id)) u *= f.k;
  if (/\bopa\b/i.test(titular(a, s, g))) u *= P.formula.castigo_opa;
  return redondeo(u);
}

// Categoría: la primera que se cumpla (orden de P.categorias).
export function categoria(a, s, g, u, uPrev) {
  const k = `${a.id}|${s.id}|${g.id}`;
  const sec = P.secretos.find(x => x.combo === k);
  if (sec) return { id: 'secreto:' + k, etiqueta: sec.etiqueta, linea: sec.linea };
  const t = titular(a, s, g);
  const G2 = { corte: 'corte', obvio: 'obvio', senales: 'senales', probe: 'probe', prisa: 'prisa', curioso: 'curioso', truco: 'truco' };
  const id = k === 'hidro|robledal|punto' ? 'honesto'
    : /\bopa\b/i.test(t) ? 'opa'
    : g.id === 'punto' ? 'dato'
    : u >= 200000 ? 'pico'
    : P.sentimentales.includes(a.id) && s.dom === 'eco' ? 'corazon'
    : s.dom === 'eco' && u < 20000 ? 'economia'
    : G2[g.id] ? G2[g.id]
    : u > uPrev ? 'sube' : u < uPrev ? 'baja' : 'igual';
  const c = P.categorias.find(x => x.id === id);
  return { id, etiqueta: c.etiqueta, linea: c.linea };
}
// Lo que dice Yoli (regla de P.voz). dichas: Set de ids ya dichos.
export function voz(cat, u, uPrev, dichas) {
  for (const id of [cat.linea, u > uPrev ? 'C7' : u < uPrev ? 'C8' : null])
    if (id && !dichas.has(id)) { dichas.add(id); return id; }
  return null;
}

const miles = n => n.toLocaleString('es-ES').replace(/^(\d)(\d{3})$/, '$1.$2');
export const TOPES = [/\bdesde\s+(?:(?:19|20)\d\d|enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|hace)/i,
  /(?<!\p{L})(?:lo|la|el|los|las|su|sus|mi|mis)\s+(?:\p{L}+\s+)?únic[oa]s?(?!\p{L})/iu,
  /\bno se (?:l[aeo]s? |me |te )?\p{L}+(?: \p{L}+){0,5}\s*[.:;,]\s*(?:y )?se (?:l[aeo]s? |me |te )?\p{L}+/iu,
  /\bprimera vez\b/i, /\bmi primer[oa]?\b/i, /\bno (?:es|son|era)\s[^.!?;:]{1,45}[.:;,]\s*(?:es|son|era)\s/iu, /factur/i, /\(\*/,
  /Diseño/, /Infograf/i, /(^|[.!?]\s)Como [^.]*\.$/, /Emoji de fuego/, /criatura/i, /chaval/i, /Google/, /abuel/i, /abr[ií]g/i,
  /\bdirector\b/i, /\bConsejo\b/];

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain && process.argv.includes('--todas')) {
  const { wrap } = await import('/home/user/monkeyisland27/engine/font.js');
  const rows = [];
  for (const a of A) for (const s of S) for (const g of G) rows.push({ a, s, g, t: titular(a, s, g), u: usuarios(a, s, g) });
  let mal = 0; const err = (m, r) => { mal++; console.log('MAL', m, '·', `${r.a.id}|${r.s.id}|${r.g.id}`, '·', r.t); };
  for (const r of rows) {
    const n = wrap(r.t, 190).length;
    if (n > 3) err(`${n} líneas`, r);
    if (/[{}]/.test(r.t)) err('marca sin rellenar', r);
    if (/\b(a|de) el\b/.test(r.t)) err('contracción', r);
    if (/ {2}| [,.:;)]|\( |\.\.\.\.|,,|::/.test(r.t)) err('espacios/puntuación', r);
    if (/\b(el|la|los|las) (el|la|los|las)\b/.test(r.t)) err('artículo doble', r);
    if (/\b(las|los) \S+ (\S+[^sn]) /.test(r.t) && false) err('concordancia', r);
    if (/^[a-záéíóú]/.test(r.t)) err('minúscula inicial', r);
    if (/\bhabrá (el|la|los|las)\b/.test(r.t)) err('haber + artículo', r);
    if (/(?<!(?:sin|cenar|con|a|limpiar|en) (?:las|los) )(persianas|mejillones( de lata)?) (está|es|sube|baja|engorda|gotea|hace|tiene|piensa|te ignora|se baja|sabe|cuesta|puede|entra|tocará|estará|se queda|se purga|se tiende|pierde|no se come|te escribe)\b(?!n)/.test(r.t)) err('concordancia plural', r);
    for (const re of TOPES) if (re.test(r.t)) err('tope ' + re, r);
  }
  const N = rows.length, pct = f => (100 * rows.filter(f).length / N).toFixed(1) + ' %';
  console.log(`largos > 80: ${(100*rows.filter(r=>r.t.length>80).length/N).toFixed(1)} % · mediana ${[...rows].map(r=>r.t.length).sort((x,y)=>x-y)[N>>1]}`);
  console.log(`total ${N} (${A.length} autoridades × ${S.length} asuntos × ${G.length} ganchos) · fallos ${mal}`);
  console.log('más largo:', Math.max(...rows.map(r => r.t.length)), 'caracteres; menús ≤', Math.max(...[...A, ...S, ...G].map(p => p.menu.length)));
  console.log('Muletillas y mecanismos (tope 20 %):');
  const M = { 'psicólog/psicología': /psicolog/i, 'señal(es)': /señal/i, 'corte «...»': /\.\.\.$/, 'esto es lo que / esto pasó': /esto (es lo que|pasó)/,
    'las ocho': /las ocho/, 'según los expertos/los expertos': /expertos/, 'en el cajón / en casa': /en el cajón|en casa|en un cajón/, 'el truco': /truco/i,
    'tu madre': /tu madre/i, 'tu banco': /tu banco/i, 'Hacienda': /Hacienda/, '(fuente:': /\(fuente/, 'sentimental (psicología + pareja)': r => P.sentimentales.includes(r.a.id) };
  for (const [k, re] of Object.entries(M)) console.log(`  ${k.padEnd(34)} ${pct(r => typeof re === 'function' ? re(r) : re.test(r.t))}`);
  const ps = P.sentimentales.length / A.length; console.log(`  P(al menos una sentimental en 5) = ${(100 * (1 - (1 - ps) ** 5)).toFixed(0)} %`);
  for (const id of ['hidro|robledal|punto', 'atencion|robledal|corte', 'cocineros|mejillones|corte', 'expertos|persianas|obvio', 'confirmado|euribor|obvio', 'psicologia|euribor|probe', 'psicologia|prima|prisa', 'psicologia|euribor|senales', 'confirmado|ibex|prisa', 'expertos|prima|obvio', 'pueblo|euribor|curioso', 'analistas|prima|truco'])
    console.log('  hito', id, rows.find(r => `${r.a.id}|${r.s.id}|${r.g.id}` === id).u, '·', rows.find(r => `${r.a.id}|${r.s.id}|${r.g.id}` === id).t);
  const top = [...rows].sort((x, y) => y.u - x.u);
  console.log('  máximo:', top[0].u, top[0].t, '· segundo:', top[1].u, top[1].t);
  console.log('  máximo con «opa»:', Math.max(...rows.filter(r => /\bopa\b/i.test(r.t)).map(r => r.u)));
  const lin = Object.entries(P.lineas); let ml = 0;
  for (const [id, t] of lin) if (t.length > 80 || TOPES.some(re => re.test(t))) { ml++; console.log('LÍNEA MAL', id, t.length, t); }
  console.log(`líneas habladas de Yoli: ${lin.length} (tope 14) · fallos ${ml} · secretos ${P.secretos.length}`);
  for (const sc of P.secretos) if (!rows.find(r => `${r.a.id}|${r.s.id}|${r.g.id}` === sc.combo)) console.log('SECRETO SIN COMBINACIÓN', sc.combo);
  const lit = ['Los expertos coinciden: esta tarde hay que cerrar las puertas y bajar las persianas', 'Los cocineros coinciden: los mejillones de lata están mejor si los preparas con...',
    'Le conté a mi psicóloga lo del Euríbor y se quedó callada', 'Según la psicología, si la prima de riesgo te escribe pasadas las ocho, no es amor',
    'Las 7 señales de que tu relación con el Euríbor es tóxica', 'Confirmado: el Ibex 35 se tiende antes de las ocho o pierde valor',
    'Los expertos coinciden: esta tarde hay que cerrar las puertas y bajar la prima de riesgo', 'El pueblo de España que todavía paga el Euríbor en pesetas',
    'Los analistas recomiendan comprar la prima de riesgo y dejarla en remojo'];
  for (const l of lit) console.log('  literal del dueño:', rows.some(r => r.t === l) ? 'sí' : 'NO', '·', l);
  // escala
  const us = rows.map(r => r.u), b = [10, 100, 1000, 10000, 100000, 1e9]; let lo = 0;
  console.log('Escala:', b.map(h => { const n = us.filter(u => u >= lo && u < h).length; const s = `${lo}-${h === 1e9 ? '∞' : h}: ${n}`; lo = h; return s; }).join(' · '));
} else if (isMain) {
  const nums = process.argv.slice(2).filter(x => /^\d+$/.test(x));
  const n = Number(nums[0] || 20); let seed = Number(nums[1] || 1);
  const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
  const pick = L => L[Math.floor(rnd() * L.length)];
  let prev = 3; const dichas = new Set();
  for (let i = 1; i <= n; i++) {
    const a = pick(A), s = pick(S), g = pick(G), u = usuarios(a, s, g), c = categoria(a, s, g, u, prev), v = voz(c, u, prev, dichas);
    console.log(`${String(i).padStart(3)} | ${a.id}·${s.id}·${g.id} | ${miles(u)} | ${titular(a, s, g)} | ${c.etiqueta} | ${v ? `${v} «${P.lineas[v]}»` : '(muda)'}`);
    prev = u;
  }
}
