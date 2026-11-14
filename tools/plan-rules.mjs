// REGLAS AUTOMATIZABLES DEL PLAN DE COMEDIA (docs/guion2/PLAN_COMEDIA.md §2.2, §2.4, §6.1, §12.2). Las usa
// tools/text-audit.mjs: por ahora son AVISOS (el texto actual aún no está reescrito); con `--plan` cuentan como fallo.
//   node tools/text-audit.mjs --estatico [--plan] [--sala=pecera]   solo el repaso estático de content/ (segundos)
//   node tools/text-audit.mjs [--plan]                              partida completa + estático
import fs from 'node:fs';
import path from 'node:path';

/** Remate «… Como X.»: la ÚLTIMA frase de la línea empieza por «Como» (no la primera: «Como ya comenté…» es la fórmula
 *  del correo, R01). Excepción del plan: las comparaciones con sujeto propio («son como el periódico») no empiezan así. */
export const COMO_RE = /([.!?…»]\s+(¡|¿)?Como\s+[^.!?]*[.!?»]*\s*$)|(^Como\s+[^.!?]{0,40}\.$)/;
export const COMO_PERMITIDAS = 3;                                // tope del plan una vez reescrito (§6.1: «0 en líneas nuevas»)

/** Palabras vetadas a la vista (§12.2): apodos internos de sala, cargos inexistentes y jerga sin traducir. */
export const VETADAS = [
  [/\bConsejo\b/, 'Consejo'], [/\bCatacumba\b/i, 'Catacumba'], [/\bPajarera\b/i, 'Pajarera'], [/\bOffice\b/i, 'Office'],
  [/\bPecera\b/i, 'Pecera'], [/\bEcosistema\b|ECOSISTEMA/, 'Ecosistema (con mayúscula: el apodo de la sala; «un ecosistema», nombre común, vale)'], [/director del periódico/i, 'director del periódico'],
  [/\bLCP\b/, 'LCP'], [/Core Web Vitals/i, 'Core Web Vitals'], [/\bINP\b/, 'INP'], [/\bCPD\b/, '«CPD» (es Sistemas)'],
  // orden del director (integración): «Dirección» solo como nombre de la reunión («Reunión de Dirección»); nunca como
  // alguien que manda ni como blanco de la burla (la «dirección» en minúscula, la de las señas, sí vale)
  [(t) => /\bDirecci[oó]n\b|DIRECCI[OÓ]N/.test(t.replace(/Reuni[oó]n de Direcci[oó]n|REUNI[OÓ]N DE DIRECCI[OÓ]N/g, '')), '«Dirección» fuera de «Reunión de Dirección»'],
  // reglas del dueño: Diseño (y Producto) e Infografía nunca en la misma línea
  [(t) => /Diseño|DISEÑO/.test(t) && /Infograf[ií]a|INFOGRAF[IÍ]A/.test(t), 'Diseño e Infografía en la misma línea'],
];
/** El nombre del periódico real (el que NO es elContable) no aparece en NINGÚN fichero del repositorio: se busca sin
 *  escribirlo (el patrón va codificado para que este archivo tampoco lo contenga). */
// Opcional y fuera del repositorio: MARCA_VETADA=<expresión> node tools/text-audit.mjs comprueba que no aparece en ningún fichero.
export const MARCA_REAL = process.env.MARCA_VETADA ? new RegExp(process.env.MARCA_VETADA, 'i') : null;
const prueba = (re, t) => (typeof re === 'function' ? re(t) : re.test(t));

/** Topes de muletilla por personaje (§2.4), contados en las líneas distintas que se oyen. who = id de actor (o 'bruno');
 *  `fuera` = salas que no cuentan. Herminia no tiene tope: deja de hablar (pasa a objeto). */
export const TOPES = [
  { who: 'bruno', re: /\bVacante\b/, max: 2, txt: '«Vacante» en boca de Bruno' },
  // «Ticket nº 1» y «Paco Ticket» son nombres (de objeto y de persona), no la muletilla; lo citado no cuenta
  { who: 'bruno', re: /(?<!Paco )\bticket\b(?! n[ºo°])/i, max: 4, txt: '«ticket» en boca de Bruno', sinComillas: true },
  // excepción: la línea de Eventos (sala protegida) en la que Bruno CITA a Comercial (eventos.js, aro de luz)
  // §6.1.2: «Bruno solo cita»: lo que va entre comillas no cuenta (sinComillas)
  { who: 'bruno', re: /lo hablamos|cariño|acreditad|cinco minutos/i, max: 0, txt: 'muletillas ajenas en boca de Bruno', sinComillas: true, fuera: ['eventos'] },   // Eventos, sala protegida: los «cinco minutos» son de la sala (Pilar)
  { who: 'celestino', re: /¿Tú eres el nuevo\?/, max: 5, txt: '«¿Tú eres el nuevo?»' },
  { who: 'nerea_backlog', re: /Si no está en el tablero, no existe/i, max: 2, txt: '«Si no está en el tablero, no existe»' },   // [E2: retirar en integración]
  { who: 'teodoro_cuerpodoce', re: /\bchaval\b/i, max: 6, txt: '«chaval» (Teodoro)', also: ['fax'] },
  { who: 'teodoro_cuerpodoce', re: /\bCABE\b/, max: 4, txt: '«CABE»', also: ['fax'] },
  { who: 'aurora_galerada', re: /\bcriatura\b/i, max: 6, txt: '«criatura»' },
  { who: 'gervasio_acta', re: /lo hablamos/i, max: 5, txt: '«Lo hablamos» (Gervasio)' },
  { who: 'gervasio_acta', re: /diecinueve años/i, max: 4, txt: '«Diecinueve años»' },
  { who: 'begona_triplicado', re: /triplicado/i, max: 6, txt: '«triplicado» (Begoña)' },
  { who: 'begona_triplicado', re: /\bniño\b/i, max: 4, txt: '«niño» (Begoña)' },
  { who: 'inigo_sinergia', re: /no escala/i, max: 3, txt: '«no escala»' },
  { who: 'inigo_sinergia', re: /\bSiguiente\b/, max: 6, txt: '«Siguiente» (Íñigo)' },
  { who: 'maripaz_remitido', re: /\bcariño\b/i, max: 14, txt: '«cariño» (Maripaz; E2 §4.1: condimento, tope 14)' },
  { who: 'borja_engagement', re: /en vertical/i, max: 2, txt: '«en vertical»' },   // [E2: retirar en integración] (Borja)
  { who: 'borja_engagement', re: /engagement/i, max: 1, txt: '«engagement»' },
  { who: 'pilar_escaleta', re: /cinco minutos/i, max: 5, txt: '«cinco minutos» fuera de Eventos', fuera: ['eventos'] },
  { who: 'evaristo_salvedad', re: /una cosita/i, max: 7, txt: '«Una cosita»' },
  { who: 'evaristo_salvedad', re: /era solo eso/i, max: 6, txt: '«Era solo eso»' },
  { who: 'custodia_precinto', re: /\bSiguiente\./, max: 4, txt: '«Siguiente.» (Custodia)' },
  { who: 'gertrudis', re: /2019/, max: 2, txt: '«2019» (Gertrudis)' },
  { who: 'lector_medio', re: /lo que me interesa es la economía/i, max: 6, txt: 'la grabación del Lector Medio' },
  { who: '*', re: /\bDiseño\b/, max: 11, txt: '«Diseño» en todo el juego (§5.14)' },
];

/** Cuenta los topes sobre [{ who, text, room }]. Devuelve los avisos (los que se pasan). */
export function topes(lines) {
  const out = [];
  for (const T of TOPES) {
    const hits = lines.filter(l => (T.who === '*' || l.who === T.who || (T.also && T.also.includes(l.who)))
      && !(T.fuera && T.fuera.includes(l.room)) && !(T.excepto && T.excepto.test(l.text))
      && T.re.test(T.sinComillas ? l.text.replace(/«[^»]*»|"[^"]*"|“[^”]*”/g, '') : l.text));
    if (hits.length > T.max) out.push(`${T.txt}: ${hits.length} (tope ${T.max}):\n      ${hits.map(h => `[${h.room}] ${h.text}`).join('\n      ')}`);
  }
  return out;
}

/** Cadenas literales de un archivo JS, sin comentarios (tokenizador mínimo). */
export function literales(src) {
  const out = []; let i = 0;
  while (i < src.length) {
    const c = src[i], n = src[i + 1];
    if (c === '/' && n === '/') { i = src.indexOf('\n', i); if (i < 0) break; continue; }
    if (c === '/' && n === '*') { i = src.indexOf('*/', i + 2); if (i < 0) break; i += 2; continue; }
    if (c === "'" || c === '"' || c === '`') {
      let j = i + 1, t = '';
      while (j < src.length && src[j] !== c) { if (src[j] === '\\') { t += src[j + 1]; j += 2; continue; } t += src[j]; j++; }
      out.push(t); i = j + 1; continue;
    }
    i++;
  }
  return out;
}
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.js') ? [path.join(d, e.name)] : []);
const esTexto = (t) => /\s/.test(t) && /[a-záéíóúñ]/i.test(t) && !/^[\w.:\-/ ]+$/.test(t) && !/^(bool|int|str|num)\b.*·/.test(t);

/** Repaso estático de content/ (sin art/ ni flags.js): remates «Como…» y palabras vetadas, por archivo. */
export function estatico(root, salas = null) {
  const como = [], vetadas = [];
  for (const f of walk(path.join(root, 'content'))) {
    const rel = path.relative(root, f);
    if (/[\\/]art[\\/]/.test(rel) || /flags\.js$/.test(rel) || /_plantilla/.test(rel)) continue;
    if (salas && !salas.some(s => path.basename(f).startsWith(s))) continue;
    for (const t of literales(fs.readFileSync(f, 'utf8'))) {
      if (!esTexto(t)) continue;
      if (COMO_RE.test(t)) como.push(`${rel}: ${t}`);
      for (const [re, name] of VETADAS) if (prueba(re, t)) vetadas.push(`${rel}: [${name}] ${t}`);
    }
  }
  // el nombre del periódico real, en cualquier fichero de texto del repositorio (salvo node_modules y .git)
  const todo = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => (e.name === 'node_modules' || e.name.startsWith('.')) ? []
    : e.isDirectory() ? todo(path.join(d, e.name)) : /\.(js|mjs|md|html|css|json|webmanifest|txt)$/.test(e.name) ? [path.join(d, e.name)] : []);
  if (!salas && MARCA_REAL) for (const f of todo(root)) if (MARCA_REAL.test(fs.readFileSync(f, 'utf8'))) vetadas.push(`${path.relative(root, f)}: [nombre del periódico real]`);
  return { como: [...new Set(como)], vetadas: [...new Set(vetadas)] };
}

// ======================================================================================== ENMIENDA E2 §12.4 y §7.6
// AVISOS por ahora: text-audit los enseña siempre y NO cuentan como fallo ni con `--plan`; con `--e2` (lo pondrá el
// integrador cuando las cuatro salas hayan entregado) cuentan como fallo.
//   · TOPES_E2_JUEGO: «en todo el juego», contados en TODAS las cadenas literales de content/ (sin comentarios, sin
//     arte, sin descripciones de flags): cada aparición cuenta, aunque esté en una rama rara.
//   · TOPES_E2: por personaje, sobre las líneas que se oyen en la partida automática (como TOPES).
//   · opcionesRepetibles(content): §7.6, opción del menú principal de un árbol sin `once`, sin `if` y sin `exit` (ni
//     `goto` a un subnodo) que no está en la lista de repetibles declaradas (clases 2 y 3).
const MESES = 'enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre';
/** «desde» + año, mes o «hace N años/meses» (la muletilla, §8). No cuentan las horas del día («desde las seis») ni
 *  «Desde el Mundial del 82». */
export const DESDE_FECHA = new RegExp(`\\bdesde\\s+(?:(?:19|20)\\d\\d\\b|(?:${MESES})\\b|hace\\s+\\S+\\s+(?:años|meses|semanas)\\b)`, 'gi');
export const TOPES_E2_JUEGO = [
  { re: DESDE_FECHA, max: 6, txt: '«desde [fecha]» (§8: quedan seis)' },
  { re: /\bcariño\b/gi, max: 14, txt: '«cariño» (§4.1)' },
  { re: /\(\*/g, max: 0, txt: 'letra pequeña «(*…)» (§4.1)' },
  { re: /\binterstitial/gi, max: 2, txt: '«interstitial» (§4.1, M6)' },
  { re: /\bpop-?up/gi, max: 8, txt: '«pop-up» (§12.4)' },
  { re: /Emoji de fuego/g, max: 8, txt: '«Emoji de fuego» (§3.1)' },
  { re: /PORTÁTIL:/g, max: 0, txt: '«PORTÁTIL:» (§2.2: ahora «HERMINIA (IA) › »)' },
  { re: /\bDiseño\b/g, max: 11, txt: '«Diseño» (cadenas; el tope de lo que se oye está en TOPES)' },
];
export const TOPES_E2 = [
  { who: 'bruno', re: /\bMe l[ao] apunto\b/i, max: 0, txt: '«Me la/lo apunto» en boca de Bruno (§7.2)' },
  { who: 'anselmo_monolito', re: /mis sistemas/i, max: 5, txt: '«mis sistemas» (Anselmo, §2.5)' },
  { who: 'anselmo_monolito', re: /próxima versión/i, max: 4, txt: '«próxima versión» (Anselmo, §2.5)' },
  { who: 'anselmo_monolito', re: /¿De dónde vienen?\?/i, max: 4, txt: '«¿De dónde viene/n?» (Anselmo, §2.5)' },
  { who: 'leoncio_quesitos', re: /\bYo ya no\b/i, max: 2, txt: '«Yo ya no…» (Leoncio, §2.5)' },
  { who: 'maripaz_remitido', re: /cabe(n)? (un|otro|tres) banner|cabe un banner/i, max: 5, txt: '«todavía cabe un banner» (Maripaz, M1)' },
  { who: 'maripaz_remitido', re: /arreglo con un pop-?up/i, max: 4, txt: '«Eso te lo arreglo con un pop-up» (Maripaz, M2)' },
  { who: 'maripaz_remitido', re: /se ve demasiado/i, max: 3, txt: '«se ve demasiado la noticia» (Maripaz, M3)' },
  { who: 'maripaz_remitido', re: /branded content|contenido que paga/i, max: 3, txt: 'branded content (Maripaz, M4)' },
];
/** Repetibles declaradas (§7.6, clases 2 y 3): texto de la opción (sin signos ni mayúsculas). */
export const REPETIBLES_E2 = ['¿Cómo va el Ibex?', '¿Cuántas sillas hay?', '¿Y de qué va el evento?', 'Buenas noches, Gertrudis.',
  'Buenas noches otra vez.', '¿Me da un café sin saludar?', '¿Ha enviado ya el correo?', '¿Qué tal ahora con Anselmo?', '¿Qué noticia puedo traer?'];
const normOp = (t) => String(t).toLowerCase().replace(/[¿?¡!.,«»"“”]/g, '').replace(/\s+/g, ' ').trim();

/** Topes de E2 «en todo el juego» sobre las cadenas literales de content/ (sin arte, flags ni plantilla). */
export function topesE2Juego(root) {
  const cuenta = TOPES_E2_JUEGO.map(T => ({ ...T, hits: [] }));
  for (const f of walk(path.join(root, 'content'))) {
    const rel = path.relative(root, f);
    if (/[\\/]art[\\/]/.test(rel) || /flags\.js$/.test(rel) || /_plantilla/.test(rel)) continue;
    for (const t of literales(fs.readFileSync(f, 'utf8'))) {
      if (!esTexto(t)) continue;
      for (const T of cuenta) { const n = (t.match(T.re) || []).length; for (let i = 0; i < n; i++) T.hits.push(`${rel}: ${t}`); }
    }
  }
  return cuenta.filter(T => T.hits.length > T.max).map(T => `${T.txt}: ${T.hits.length} (tope ${T.max}):\n      ${[...new Set(T.hits)].join('\n      ')}`);
}
/** Topes de E2 por personaje sobre [{ who, text, room }] (las líneas oídas). */
export function topesE2(lines) {
  const out = [];
  for (const T of TOPES_E2) {
    const hits = lines.filter(l => l.who === T.who && T.re.test(l.text.replace(/«[^»]*»|"[^"]*"/g, (m) => (T.who === 'bruno' ? '' : m))));
    if (hits.length > T.max) out.push(`${T.txt}: ${hits.length} (tope ${T.max}):\n      ${hits.map(h => `[${h.room}] ${h.text}`).join('\n      ')}`);
  }
  return out;
}
/** §7.6: opciones del menú principal sin `once`, sin `if`, sin `exit` y sin `goto` que no son repetibles declaradas. */
export function opcionesRepetibles(content) {
  const out = [];
  const arr = (x) => (x == null ? [] : Array.isArray(x) ? x : [x]);
  const trees = [];
  for (const D of arr(content.dialogs)) for (const [id, d] of Object.entries(D || {})) trees.push([id, d, 'común']);
  for (const r of arr(content.rooms)) for (const [id, d] of Object.entries(r.dialogs || {})) trees.push([id, d, r.id]);
  const ok = new Set(REPETIBLES_E2.map(normOp));
  for (const [id, d, sala] of trees) {
    const start = d && d.nodes && d.nodes[d.start || Object.keys(d.nodes)[0]];
    for (const o of (start && start.options) || []) {
      if (o.once || o.if != null || o.exit || o.goto) continue;
      let t; try { t = typeof o.text === 'function' ? '(texto calculado)' : String(o.text); } catch (e) { t = '?'; }
      if (ok.has(normOp(t))) continue;
      out.push(`[${sala}] ${id}: «${t}»`);
    }
  }
  return out;
}
