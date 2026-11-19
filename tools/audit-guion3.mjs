#!/usr/bin/env node
// AUDITORÍA LÍNEA A LÍNEA del juego contra la copia limpia del guion (docs/GUION_PROPUESTA_LIMPIO.md) · guion nuevo, tanda 4.
//   node tools/audit-guion3.mjs            informe completo (a, b, c)
//   node tools/audit-guion3.mjs --restos   solo (c): restos de lo eliminado (exit 1 si queda alguno)
//   node tools/audit-guion3.mjs --json     el informe en JSON (lo lee tools/test-guion3-t4.mjs)
// (a) líneas habladas o visibles del guion que no están en el juego; (b) textos del juego (contenido, móvil, pistas,
// duelos, titulador, créditos, rótulos del arte) que no están en el guion; (c) restos de lo que el guion ha quitado.
// Se compara texto normalizado (minúsculas, sin acentos ni puntuación): un fragmento del guion cuenta como «está» si
// aparece dentro de algún texto del juego, y al revés. Los huecos variables del guion ({hora}, {cifra…}) y del juego
// (`${…}`) parten el texto en trozos que se buscan por separado. Lo que es a propósito distinto se lista en
// `ACEPTADO` (con el motivo) y no cuenta. No está en test-all: lo usa tools/test-guion3-t4.mjs (solo los restos).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = new Set(process.argv.slice(2));
const GUION = fs.readFileSync(path.join(root, 'docs', 'GUION_PROPUESTA_LIMPIO.md'), 'utf8');

export const norm = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  .replace(/\.\.\.|…/g, ' ').replace(/[^a-z0-9ñ%€]+/g, ' ').replace(/\s+/g, ' ').trim();
const palabras = (s) => (norm(s).match(/[a-z0-9ñ]+/g) || []).length;

// ------------------------------------------------------------------ el guion
/** Una nota («> …») que trae una línea con quién la dice (**BRUNO:** …) es texto aprobado, no un comentario. */
const HABLA_EN_NOTA = /\*\*[A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ .()]*:\*\*/;
/** Fragmentos hablados o visibles de la copia limpia (desde «El guion, escena a escena» y las descripciones). */
export function lineasGuion(md = GUION) {
  const out = [];
  const L = md.split('\n');
  let dentro = false;
  for (let n = 0; n < L.length; n++) {
    let l = L[n];
    if (/^## El guion, escena a escena|^### Descripciones \(Mirar\)|^### La ficha de la página 7/.test(l)) dentro = true;
    if (/^## (Personajes|La historia|Estructura|Índice|Cómo usar)/.test(l)) dentro = false;
    if (!dentro) continue;
    if (/^\s*>/.test(l) && HABLA_EN_NOTA.test(l)) l = l.replace(/^\s*>\s*(-\s*)?/, '');   // líneas aprobadas dentro de una nota
    const t = l.trim();
    if (!t || t.startsWith('>') || t.startsWith('<!--') || t.startsWith('#') || t.startsWith('|')) continue;
    // fuera las acotaciones en cursiva y las condiciones entre paréntesis en cursiva
    l = l.replace(/_\([^_]*_/g, ' ¦ ').replace(/(^|[\s(])\*(?!\*)[^*]+\*(?!\*)/g, ' ¦ ');
    // trozos: «**ETIQUETA:** texto» y «**▸** opción»
    const re = /\*\*([^*]+?)\*\*\s*([^*]*)/g;
    let m;
    while ((m = re.exec(l))) {
      const lab = m[1].trim();
      let txt = m[2];
      if (!/:$/.test(lab) && lab !== '▸') continue;
      if (/^(Cuándo|Cómo se juega|Quién hay|Pie|Menú|Estado|Se ven|Máx|Camino principal)/i.test(lab)) continue;
      txt = txt.replace(/\s+(—|→)\s.*$/, '').replace(/\s+·\s*$/, '');
      for (let f of txt.split(/\s+\/\/\s+|\s+·\s+|\s*¦\s*|\s+\/\s+(?=[A-ZÁÉÍÓÚ¿¡«"(])/)) {
        f = f.replace(/^\(Desde el 27\)\s*/, '').replace(/\s*\/+\s*$/, '').replace(/^\/+\s*/, '').replace(/^[«"]|[»"]$/g, '').trim();
        if (palabras(f) >= 2) out.push({ n: n + 1, quien: lab.replace(/:$/, ''), texto: f });
      }
    }
  }
  return out;
}

// ------------------------------------------------------------------ el juego
const scan = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap(d => d.isDirectory() ? scan(path.join(dir, d.name)) : /\.m?js$/.test(d.name) ? [path.join(dir, d.name)] : []);
/** Quita los comentarios de un fuente JS (sin tocar las cadenas). */
function sinComentarios(src) {
  let o = '', i = 0, q = null;
  while (i < src.length) {
    const c = src[i], d = src[i + 1];
    if (q) { o += c; if (c === '\\') { o += d; i += 2; continue; } if (c === q) q = null; i++; continue; }
    if (c === "'" || c === '"' || c === '`') { q = c; o += c; i++; continue; }
    if (c === '/' && d === '/') { while (i < src.length && src[i] !== '\n') i++; continue; }
    if (c === '/' && d === '*') { i += 2; while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) i++; i += 2; continue; }
    o += c; i++;
  }
  return o;
}
/** Cadenas literales (las de plantilla, partidas por sus `${…}`). */
function cadenas(src) {
  const out = [];
  const re = /'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\]|\\.)*)`/g;
  let m;
  while ((m = re.exec(src))) {
    const s = (m[1] ?? m[2] ?? m[3] ?? '').replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\n/g, ' ');
    if (m[3] != null) for (const p of s.split(/\$\{[^}]*\}/)) out.push(p); else out.push(s);
  }
  return out;
}
// fuera: descripciones de flags, música, el kit y el montador de salas (sus cadenas son avisos del motor), la plantilla
const FUERA = /content\/(flags|music)\.js$|content\/lib\/(kit|room|edificio)\.js$|content\/rooms\/_plantilla\.js$/;
const FICHEROS = [...scan(path.join(root, 'content')).filter(f => !FUERA.test(f)), path.join(root, 'engine', 'screens.js'), path.join(root, 'engine', 'duel.js'), path.join(root, 'engine', 'phone.js')];
export function textosJuego() {
  const out = [];
  for (const f of FICHEROS) {
    if (!fs.existsSync(f)) continue;
    const src = sinComentarios(fs.readFileSync(f, 'utf8'));
    for (const s of cadenas(src)) out.push({ f: path.relative(root, f), texto: s });
  }
  return out;
}
/** ¿Parece texto que se ve o se oye? (no ids, rutas, colores, claves de flags…) */
const visible = (s) => palabras(s) >= 3 && /[a-záéíóúñ]/i.test(s) && !/^[\w.:\/#@-]+$/.test(s) && !/\b[a-z]+_[a-z_0-9]+\b/.test(s)
  && !/^(rgba?|#|\.\/|https?:)/.test(s) && !/[{};=]|=>/.test(s)
  && !/^(bool|int|str|lista) · /.test(s) && !/ falló$|^(duelo|fax): |desconocid/.test(s);

// ------------------------------------------------------------------ (c) restos de lo eliminado
/** Restos de lo que el guion ha quitado: { re, que, solo?: ficheros donde se busca, acepta?: (texto, fichero) => bool }. */
export const RESTOS = [
  // el nombre viejo: solo queda el chiste del logo («Si me llevo el "in"…», que dice «elcontable.es». Una gestoría.)
  { re: /el ?contable(?!\.es»\. Una gestor)/i, que: 'el nombre viejo del periódico, salvo el chiste del logo' },
  { re: /G[o]yita/i, que: 'el nombre viejo de la rotativa (ahora «la Benita», [P16])' },
  { re: /descope/i, que: '«descopear»' },
  { re: /silla 113|Ciento trece|ciento trece/i, que: 'la silla 113' },
  // la pegatina del fax sigue en el «Mirar» de la copia limpia (catacumba): lo que se va es la cadena del ticket
  { re: /0\.441/, que: '«Ticket 0.441»', acepta: (t) => ['Un fax de 1992: «SIN PAPEL». Pegatina: «Mantenimiento: Sistemas. Ticket 0.441».',
    '0.441. De 1999. Estado: lo respetamos.'].includes(t) },
  { re: /SALVO T(ICKET Nº )?\.? ?3|ticket n[º°] ?3\b(?! *\.)/i, que: 'el camino del ticket nº 3' },
  { re: /móvil de Borja|Lo publicó a las nueve/i, que: 'el crédito del móvil de Borja', solo: ['content/escenas/final.js'] },
  { re: /No atiendo\./, que: 'el «No atiendo.» de Eutimio' },
  // (los ids 'L3'/'L5' solo quedan en la migración de partidas viejas)
  { re: /\bL[35]\b/, que: 'las llamadas L3 y L5 de Evaristo', solo: ['content/game.js'], acepta: (t) => /^L[35]$/.test(t) },
  { re: /EL IBEX ABRE|¿POR QUÉ NADIE/, que: 'el titular viejo del Ibex ([P17])' },
  { re: /no sale de Desarrollo/, que: 'la línea muerta de Anselmo sin rotulador' },
];
/** Ids técnicos que se quedan (no son texto). */
const ID = /^!?(posit_descopeado|oyo_descopear|descopeado|silla_torcida|teclaGoyita)$/;
export function restos() {
  const out = [];
  const files = [...scan(path.join(root, 'content')), ...scan(path.join(root, 'engine')), path.join(root, 'index.html')]
    .filter(f => !/content\/flags\.js$/.test(f));                                   // (descripciones internas de flags)
  for (const f of files) {
    const rel = path.relative(root, f);
    const lim = /\.html$/.test(f) ? fs.readFileSync(f, 'utf8') : sinComentarios(fs.readFileSync(f, 'utf8'));
    const cs = /\.html$/.test(f) ? [lim] : cadenas(lim);
    for (const r of RESTOS) {
      if (r.solo && !r.solo.includes(rel)) continue;
      for (const s of cs) {
        if (!r.re.test(s) || ID.test(s) || (r.acepta && r.acepta(s, rel))) continue;
        out.push({ f: rel, que: r.que, texto: s });
      }
    }
  }
  return out;
}

// ------------------------------------------------------------------ informe
const ACEPTADO_LISTA = [
  // (a) el guion lo dice de otra manera (no es una línea, o lleva un número que el juego calcula)
  ['Mi libreta de réplicas: {n} de 16. En otra empresa esto sería un máster.', 'el 16 lo pone N_REPLICAS (items.js)'],
  ['Y {n} correos de Tadeo. Todos «RV:». Ninguno leído.', '«Ninguno leído.» solo si no ha leído ninguno (items.js)'],
  ['[Usar objeto] / [Retirarse del hilo]', 'botones del duelo (content/duelo.js texts.useObject / retire)'],
  ['la primera vez, la escena opcional de la coma (ver', 'acotación del guion, no una línea'],
  ['(Sin texto: el segundo tirón ya ha dicho lo que había que decir.)', 'acotación del guion: no se dice nada'],
  ['el rotulador ya lo lleva Bruno; el «Mirar» del cordel vacío, arriba, no cambia.', 'acotación del guion, no una línea'],
  // (b) internos: no se ven ni se oyen
  ['manos bajo una persiana metálica (Secretaría de Redacción, en la Redacción)', 'interno: `presence` del actor (no se ve)'],
  ['los tres devs, a la vez', 'interno: `presence` del actor'], ['del coro: indignado', 'interno: `presence` del actor'],
  ['del coro: más indignado', 'interno: `presence` del actor'], ['del coro: solo dice «No.»', 'interno: `presence` del actor'],
  ['voz de objeto (vestibulo)', 'interno: `presence` del actor'], ['voz por teléfono (derrota de D1)', 'interno: `presence` del actor'],
  ['Vacante (perfil ideal)', 'interno: `assigned` del D4 (el campo ya no se dibuja; E6)'],
  ['opp.cabe[pid]', 'mensaje de error del motor'],
];
/** Diferencias aceptadas a propósito (texto normalizado → motivo). */
export const ACEPTADO = Object.fromEntries(ACEPTADO_LISTA.map(([t, m]) => [norm(t), m]));

export function auditar() {
  const G = lineasGuion();
  const J = textosJuego();
  const corpusJ = '|' + J.map(x => norm(x.texto)).join('|') + '|';
  // (sin las notas «> NOTA:», que citan también lo que se ha quitado)
  const sinNotas = GUION.split('\n').filter(l => !/^\s*>/.test(l) || HABLA_EN_NOTA.test(l)).join('\n');
  const corpusG = '|' + norm(sinNotas.replace(/\{[^}]*\}/g, '|')) + '|';
  const faltan = [];                                         // (a)
  for (const g of G) {
    const trozos = g.texto.split(/\{[^}]*\}|\.\.\.(?=\s*$)/).map(norm).filter(t => t.split(' ').length >= 2);
    if (!trozos.length) continue;
    if (trozos.every(t => corpusJ.includes(t))) continue;
    if (ACEPTADO[norm(g.texto)]) continue;
    faltan.push(g);
  }
  // (a') está, pero con otra puntuación, acentos o mayúsculas (se compara el texto tal cual, solo con las comillas
  // y los puntos suspensivos unificados)
  const crudo = (t) => String(t).replace(/[“”"]/g, '«').replace(/…/g, '...').replace(/\s+/g, ' ').trim();
  const corpusJc = '\u0001' + J.map(x => crudo(x.texto).replace(/[«»]/g, '«')).join('\u0001') + '\u0001';
  const puntuacion = [];
  for (const g of G) {
    if (faltan.includes(g) || ACEPTADO[norm(g.texto)]) continue;
    const trozos = g.texto.split(/\{[^}]*\}/).map(t => crudo(t).replace(/[«»]/g, '«').replace(/^«|«$/g, '').trim()).filter(t => t.split(' ').length >= 2);
    if (!trozos.length || trozos.every(t => corpusJc.includes(t))) continue;
    puntuacion.push(g);
  }
  const sobran = [];                                         // (b)
  const visto = new Set();
  for (const j of J) {
    if (!visible(j.texto)) continue;
    const t = norm(j.texto);
    if (t.split(' ').length < 3 || visto.has(t)) continue;
    visto.add(t);
    if (corpusG.includes(t) || ACEPTADO[t]) continue;
    sobran.push(j);
  }
  return { faltan, puntuacion, sobran, restos: restos() };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (args.has('--restos')) {
    const r = restos();
    for (const x of r) console.log(`  ✗ ${x.f}: ${x.que}: «${x.texto}»`);
    console.log(r.length ? `\nRESTOS: ${r.length}` : 'RESTOS: ninguno');
    process.exit(r.length ? 1 : 0);
  }
  const A = auditar();
  if (args.has('--json')) { console.log(JSON.stringify(A, null, 1)); process.exit(0); }
  console.log(`(a) Líneas del guion que no están en el juego: ${A.faltan.length}`);
  for (const g of A.faltan) console.log(`  L${g.n} ${g.quien}: ${g.texto}`);
  console.log(`\n(a') Están, pero con otra puntuación, acentos o mayúsculas: ${A.puntuacion.length}`);
  for (const g of A.puntuacion) console.log(`  L${g.n} ${g.quien}: ${g.texto}`);
  console.log(`\n(b) Textos del juego que no están en el guion: ${A.sobran.length} (rótulos del arte, nombres de objetos e interfaz: los decide el dueño)`);
  for (const j of A.sobran) console.log(`  ${j.f}: ${j.texto}`);
  console.log(`\n(c) Restos de lo eliminado: ${A.restos.length}`);
  for (const x of A.restos) console.log(`  ${x.f}: ${x.que}: «${x.texto}»`);
  console.log(`\nAceptados a propósito: ${ACEPTADO_LISTA.length}`);
  for (const [t, m] of ACEPTADO_LISTA) console.log(`  «${t}» — ${m}`);
  if (false)
  for (const x of A.restos) console.log(`  ${x.f}: ${x.que}: «${x.texto}»`);
}
