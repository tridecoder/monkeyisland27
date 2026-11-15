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
  // «Ticket nº 1», «Ticket 0.441» (E5 §3.4, la opción del fax: un número, no la muletilla) y «Eutimio Ticket» (antes
  // «Paco Ticket») son nombres (de objeto y de persona), no la muletilla; lo citado no cuenta
  { who: 'bruno', re: /(?<!(?:Paco|Eutimio) )\bticket\b(?! n[ºo°]| \d)/i, max: 4, txt: '«ticket» en boca de Bruno', sinComillas: true },
  // excepción: la línea de Eventos (sala protegida) en la que Bruno CITA a Comercial (eventos.js, aro de luz)
  // §6.1.2: «Bruno solo cita»: lo que va entre comillas no cuenta (sinComillas)
  { who: 'bruno', re: /lo hablamos|cariño|acreditad|cinco minutos/i, max: 0, txt: 'muletillas ajenas en boca de Bruno', sinComillas: true, fuera: ['eventos'] },   // Eventos, sala protegida: los «cinco minutos» son de la sala (Pilar)
  { who: 'celestino', re: /¿Tú eres el nuevo\?/, max: 5, txt: '«¿Tú eres el nuevo?»' },
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
  { who: 'anselmo_monolito', re: /Si no está en el tablero, no existe/i, max: 2, txt: '«Si no está en el tablero, no existe» (heredado de Nemesio)' },
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
/** ENMIENDA E4 §3bis/§5: ficheros de DATOS cuyo bloque marcado `// @solo-pantalla:inicio` … `// @solo-pantalla:fin` solo se
 *  VE (titulares del titulador, de la hoja «lo más leído» y de la ráfaga de avisos, menús y etiquetas): no son líneas
 *  habladas, así que no cuentan para los topes «en todo el juego» (TOPES_E2_JUEGO) ni para el límite de 80 caracteres
 *  de tools/check.mjs. Solo se salta el bloque marcado, y solo en estos ficheros: lo de fuera (las líneas que dice Yoli
 *  al publicar, `PIEZAS.lineas`) pasa por todas las reglas. Las palabras vetadas a la vista y los «Como X.» se siguen
 *  comprobando también dentro del bloque (se ven). */
export const SOLO_PANTALLA = [/content[\\/]rooms[\\/]pecera\.titulador\.datos\.js$/, /content[\\/]rooms[\\/]pecera\.titulares\.datos\.js$/];
const MARCA_SP = /\/\/ @solo-pantalla:inicio[\s\S]*?\/\/ @solo-pantalla:fin/g;
/** El código de `rel` sin su bloque «solo pantalla» (si es uno de los ficheros de SOLO_PANTALLA); los saltos de línea
 *  se conservan para que los números de línea no cambien. */
export function sinSoloPantalla(rel, src) {
  if (!SOLO_PANTALLA.some(re => re.test(rel))) return src;
  return src.replace(MARCA_SP, (m) => m.replace(/[^\n]/g, ' '));
}
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.js') ? [path.join(d, e.name)] : []);
// ENMIENDA E3 §1.5: sin el espacio en la clase (antes descartaba toda frase sin tildes, eñes ni comas, y con ella
// fórmulas y remates «Como X.»); los ids (`fax_enmarcado`, `ecosistema/maripaz`) siguen fuera porque no llevan espacio
const esTexto = (t) => /\s/.test(t) && /[a-záéíóúñ]/i.test(t) && !/^[\w.:\-/]+$/.test(t) && !/^(bool|int|str|num)\b.*·/.test(t);
/** E3 §1.5: el campo `apodo:` de la tabla `SALA` de content/lib/edificio.js (ids internos, nada los enseña). */
const APODO = /^(?:la|el) (?:Pecera|Catacumba|Ecosistema|Ventanilla)$/;

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
      if (APODO.test(t)) continue;
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
// text-audit los enseña siempre; con `--e2` cuentan como fallo (integración de E2: `test-all` pasa `--plan --e2`).
//   · TOPES_E2_JUEGO: «en todo el juego», contados en TODAS las cadenas literales de content/ (sin comentarios, sin
//     arte, sin descripciones de flags): cada aparición cuenta, aunque esté en una rama rara.
//   · TOPES_E2: por personaje, sobre las líneas que se oyen en la partida automática (como TOPES).
//   · opcionesRepetibles(content): §7.6, opción del menú principal de un árbol sin `once`, sin `if` y sin `exit` (ni
//     `goto` a un subnodo) que no está en la lista de repetibles declaradas (clases 2 y 3).
const MESES = 'enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre';
/** «desde» + año, mes o «hace N años/meses» (la muletilla, §8). No cuentan las horas del día («desde las seis») ni
 *  «Desde el Mundial del 82». */
export const DESDE_FECHA = new RegExp(`\\bdesde\\s+(?:(?:19|20)\\d\\d\\b|(?:${MESES})\\b|hace\\s+\\S+\\s+(?:años|meses|semanas)\\b)`, 'gi');
/** Cadenas de Eventos (sala protegida): fuera de «cariño» (E2) y de los topes de fórmulas (E3 §2). */
const FUERA_EVENTOS = /[\\/]eventos[.\w]*\.js$/;
export const TOPES_E2_JUEGO = [
  { re: DESDE_FECHA, max: 6, txt: '«desde [fecha]» (§8: quedan seis)' },
  // integración (orden del director): el tope global sube de 14 a 20 para devolver a Maripaz sus mejores «cariño»; las
  // cadenas de Eventos (sala protegida) no cuentan para este tope (`fuera`)
  { re: /\bcariño\b/gi, max: 20, txt: '«cariño» (§4.1; tope global 20, sin Eventos)', fuera: FUERA_EVENTOS },
  { re: /\(\*/g, max: 0, txt: 'letra pequeña «(*…)» (§4.1)' },
  { re: /\binterstitial/gi, max: 2, txt: '«interstitial» (§4.1, M6)' },
  { re: /\bpop-?up/gi, max: 8, txt: '«pop-up» (§12.4)' },
  { re: /Emoji de fuego/g, max: 8, txt: '«Emoji de fuego» (§3.1)' },
  { re: /PORTÁTIL:/g, max: 0, txt: '«PORTÁTIL:» (§2.2: ahora «HERMINIA (IA) › »)' },
  { re: /\bDiseño\b/g, max: 11, txt: '«Diseño» (cadenas; el tope de lo que se oye está en TOPES)' },
  // ENMIENDA E3 §2 (revisión 2) · fórmulas de remate: en todo el juego salvo Eventos (sala protegida, `fuera`);
  // flag `u` para que «ÚNICO» y las tildes cuenten. Requiere el arreglo de esTexto() (E3 §1.5).
  { re: /(?<!\p{L})(?:lo|la|el|los|las|su|sus|mi|mis)\s+(?:\p{L}+\s+)?únic[oa]s?(?!\p{L})/giu, max: 8, fuera: FUERA_EVENTOS,
    txt: '«lo único / la única…» (E3 §2)' },
  { re: /\bno se (?:l[aeo]s? |me |te )?\p{L}+(?: \p{L}+){0,5}\s*[.:;,]\s*(?:y )?se (?:l[aeo]s? |me |te )?\p{L}+/giu, max: 6,
    fuera: FUERA_EVENTOS, txt: '«X no se coge. Se Y.» (E3 §2)' },
  { re: /\bprimera vez\b/gi, max: 5, fuera: FUERA_EVENTOS, txt: '«primera vez» (E3 §2)' },
  { re: /\bmi primer[oa]?\b/gi, max: 6, fuera: FUERA_EVENTOS, txt: '«Mi primer/a…» (E3 §2)' },
  { re: /\bno (?:es|son|era)\s[^.!?;:]{1,45}[.:;,]\s*(?:es|son|era)\s/giu, max: 12, fuera: FUERA_EVENTOS,
    txt: '«No es X. Es Y.» (E3 §1, cuarta fórmula)' },
  { re: /factur/gi, max: 11, fuera: FUERA_EVENTOS, txt: '«factur…» (E3 §4)' },
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
  return cuentaE2Juego(root).filter(T => T.hits.length > T.max).map(T => `${T.txt}: ${T.hits.length} (tope ${T.max}):\n      ${[...new Set(T.hits)].join('\n      ')}`);
}
/** Recuento de cada tope «en todo el juego», pase o no (text-audit --estatico --recuento). */
export const recuentoE2Juego = (root) => cuentaE2Juego(root).map(T => ({ txt: T.txt, n: T.hits.length, max: T.max }));
function cuentaE2Juego(root) {
  const cuenta = TOPES_E2_JUEGO.map(T => ({ ...T, hits: [] }));
  for (const f of walk(path.join(root, 'content'))) {
    const rel = path.relative(root, f);
    if (/[\\/]art[\\/]/.test(rel) || /flags\.js$/.test(rel) || /_plantilla/.test(rel)) continue;
    for (const t of literales(sinSoloPantalla(rel, fs.readFileSync(f, 'utf8')))) {
      if (!esTexto(t)) continue;
      for (const T of cuenta) { if (T.fuera && T.fuera.test(rel)) continue; const n = (t.match(T.re) || []).length; for (let i = 0; i < n; i++) T.hits.push(`${rel}: ${t}`); }
    }
  }
  return cuenta;
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

// ======================================================================================== ENMIENDA E5 §8 (I1)
// Topes nuevos. text-audit los enseña siempre como AVISO; con `--e5` cuentan como fallo (se activan cuando los paquetes
// de sala PA-PE hayan aplicado la poda de §4; hasta entonces el texto de hoy los pasa a propósito). Mismas cadenas que
// los de E2 (literales de content/ sin comentarios, sin art/, flags.js ni plantilla, y sin los bloques `@solo-pantalla`
// de los datos del titulador de E4).
/** La coletilla «frase + Y/Con/Sin/Ni + 1-3 palabras» (crítica 4 §4.5). Sin `g`: una cadena cuenta una vez. Las
 *  preguntas y las frases que no terminan («...») no cuentan. Hoy 160 sin Eventos → tras E5, 40. */
export const COLETILLA_RE =
  /(?:[.!?…][»"”)]?\s+|^)(?:\.\.\.|…)?¡?(?:Y|Con|Sin|Ni)\s+[^\s.!?…¿]+(?:\s+[^\s.!?…¿]+){0,2}(?:\.|!+)[»"”)]?\s*$/u;
/** `porCadena: true`: cada cadena cuenta 0 o 1 (la regex no lleva `g`). `max: null`: solo recuento (sin tope). */
export const TOPES_E5_JUEGO = [
  { re: COLETILLA_RE, porCadena: true, max: 46, fuera: FUERA_EVENTOS, txt: 'coletilla «Y/Con/Sin/Ni + 1-3 palabras» (E5 §8)' },   // 160 → 40
  { re: /\bchaval\b/gi, max: 12, txt: '«chaval» en todo el juego (E5 §8)' },                                       // 22 → 11
  { re: /\bcriatura\b/gi, max: 6, txt: '«criatura» en todo el juego (E5 §8)' },                                   // 13 → 6
  { re: /RECHAZADO[»,]? en la frente/g, max: 2, fuera: FUERA_EVENTOS, txt: 'la frente sellada (E5 §8)' },          // 4 → 2
  // vigilar, sin tope (§8 «Además»): la columna suma una «de la casa» a propósito; «mis sistemas» de Anselmo (las oídas
  // tienen tope 5 en TOPES_E2; si pasa, «Ese enchufe está en mis sistemas.» → «Ese enchufe es de Desarrollo.»)
  { re: /\bde (?:la|esta) casa\b/gi, max: null, txt: '«de la/esta casa» (E5 §8, solo recuento)' },
  { re: /\bmis sistemas\b/gi, max: null, txt: '«mis sistemas» en cadenas (E5 §8, solo recuento; las oídas, TOPES_E2)' },
];
function cuentaJuego(root, lista) {
  const cuenta = lista.map(T => ({ ...T, hits: [] }));
  for (const f of walk(path.join(root, 'content'))) {
    const rel = path.relative(root, f);
    if (/[\\/]art[\\/]/.test(rel) || /flags\.js$/.test(rel) || /_plantilla/.test(rel)) continue;
    for (const t of literales(sinSoloPantalla(rel, fs.readFileSync(f, 'utf8')))) {
      if (!esTexto(t)) continue;
      for (const T of cuenta) {
        if (T.fuera && T.fuera.test(rel)) continue;
        const n = T.porCadena ? (T.re.test(t) ? 1 : 0) : (t.match(T.re) || []).length;
        for (let i = 0; i < n; i++) T.hits.push(`${rel}: ${t}`);
      }
    }
  }
  return cuenta;
}
/** Topes de E5 «en todo el juego» que se pasan (los de solo recuento no fallan nunca). */
export function topesE5Juego(root) {
  return cuentaJuego(root, TOPES_E5_JUEGO).filter(T => T.max != null && T.hits.length > T.max)
    .map(T => `${T.txt}: ${T.hits.length} (tope ${T.max}):\n      ${[...new Set(T.hits)].join('\n      ')}`);
}
/** Recuento de cada tope de E5, pase o no (text-audit --estatico --recuento). */
export const recuentoE5Juego = (root) => cuentaJuego(root, TOPES_E5_JUEGO).map(T => ({ txt: T.txt, n: T.hits.length, max: T.max }));

/** E5 §8 · la coletilla por personaje (guionista §7) sobre las líneas OÍDAS [{ who, text, room }]: quien diga ≥ 20 líneas
 *  distintas no puede pasar del 10 % con coletilla. Sin `lector_medio` ni Eventos. Tras E5, el más alto es Begoña (≈ 8 %). */
export const COLETILLA_PERSONAJE = { minimo: 20, max: 0.10 };
export function coletillaPorPersonaje(lines) {
  const por = new Map();
  for (const l of lines) {
    if (!l.who || l.who === 'lector_medio' || l.room === 'eventos' || l.who === 'aviso') continue;
    const p = por.get(l.who) || { n: 0, hits: [] };
    p.n++; if (COLETILLA_RE.test(l.text)) p.hits.push(l.text);
    por.set(l.who, p);
  }
  const out = [];
  for (const [who, p] of por) {
    if (p.n < COLETILLA_PERSONAJE.minimo || p.hits.length / p.n <= COLETILLA_PERSONAJE.max) continue;
    out.push(`coletilla de ${who}: ${p.hits.length} de ${p.n} (${Math.round(100 * p.hits.length / p.n)} %, tope ${COLETILLA_PERSONAJE.max * 100} %):\n      ${p.hits.join('\n      ')}`);
  }
  return out;
}

// ======================================================================================== ENMIENDA E6 §8 (I1)
// Topes nuevos. text-audit los enseña siempre como AVISO; con `--e6` cuentan como fallo (se activan cuando los paquetes
// de sala hayan aplicado la tabla de E6 §4; hasta entonces el texto de hoy no los pasa: es lo esperado). Mismas cadenas
// que los de E5, y sin `content/music.js` (sus «cadenas» son notas: «A4 C5 F5 - -»).
// ENMIENDA E6 §8 · REMATE SECO: cadena de ≥ 2 frases cuya última frase tiene 1-3 palabras y acaba en «.» o «!».
// Frase = tras [.!?…] (+ cierre »"”') y espacio, empezando por mayúscula, ¡, «, " o cifra. No cuentan las preguntas, las
// frases cortadas («...», «…») ni las cadenas de una frase. Hoy 727 de 3.591 (20,2 %); tras E6 (rev. 2), 513 de 3.561
// (14,4 %). El tope deja dos puntos de margen sobre lo que queda (16,5 %); el objetivo del director era ≤ 15 %.
export const REMATE_SECO_RE = /[.!?…][»"”')]*\s+(?=[¡«"(]*[\p{Lu}\p{N}])[¡«"(]*(?:[\p{L}\p{N}][\p{L}\p{N}'’,%.\-]*\s*){1,3}(?:\.|!+)[»"”')]*\s*$/u;
const frasesE6 = (t) => t.trim().split(/(?<=[.!?…][»"”')]*)\s+(?=[¡¿«"(]*[\p{Lu}\p{N}])/u).filter(Boolean);
export const esRemateSeco = (t) => frasesE6(t).length >= 2 && !/(?:\.\.\.|…)[»"”')]*\s*$/.test(t) && !/\?[»"”')]*\s*$/.test(t)
  && REMATE_SECO_RE.test(t.trim());
const FUERA_MUSICA = /[\\/]music\.js$/;

/** TOPES_E6_JUEGO (mismas cadenas que TOPES_E5_JUEGO, + `fuera` de music.js). `test`: función en lugar de `re`;
 *  `pct`: tope sobre el total de cadenas del mismo filtro (`base`). */
export const TOPES_E6_JUEGO = [
  { test: esRemateSeco, pct: 0.165, fuera: FUERA_MUSICA, txt: 'remate seco (E6 §8): ≤ 16,5 % de las cadenas' },      // 20,2 % → 14,4 %
  { re: /t[áa]per/i, porCadena: true, max: 17, txt: '«táper» (E6 §8)' },                                             // 32 → 17
  { re: /\b(?:19|20)\d\d\b/, porCadena: true, max: 35, fuera: FUERA_MUSICA, txt: 'año 19xx/20xx (E6 §8)' },         // 64 → 33
  { re: /Huele a 2019/, porCadena: true, max: 1, txt: '«Huele a 2019» (E6 §8)' },                                    // 3 → 1
  { re: /Diecinueve años/, porCadena: true, max: 4, txt: '«Diecinueve años» (E6 §8)' },                              // 9 → 4
  { re: /Lo que diga el Lector Medio/, porCadena: true, max: 5, txt: '«Lo que diga el Lector Medio» (E6 §8)' },      // 7 → 5
  { re: /Era solo eso/, porCadena: true, max: 5, txt: '«Era solo eso» (E6 §8)' },                                    // 7 → 5
];
/** Aviso (no fallo, E6 §8): remate seco por fichero de sala > 22 % (salvo Eventos y los datos del titulador). Rev. 2: la
 *  peor queda en 21,9 % (ecosistema.js); el aviso salta si una sala vuelve a pasar del 22 %. */
export const REMATE_SALA_AVISO = { pct: 0.22, fuera: /eventos|titulador\.datos/ };
/** Sobre el CÓDIGO (sin comentarios), no sobre cadenas: «D3: No.» ≤ 6 (cuenta ['D3', 'No.'] y ['D3', '...No.']). */
export const TOPES_E6_FUENTE = [
  { re: /\[\s*'D3'\s*,\s*'(?:\.\.\.)?No\.'\s*\]/g, max: 6, ficheros: /content[\\/]rooms[\\/]pecera/, txt: '«D3: No.» (E6 §8)' },   // 12 → 6
];
/** Duplicados audibles (aviso): cadena > 25 caracteres en dos SALAS distintas (ficheros de content/rooms/, agrupados por
 *  sala: `pecera.js` y `pecera.dialogos.js` son la misma), sin las de DUP_PERMITIDAS. actors.js, pistas.js, duelo.js y
 *  escenas/ no son salas: no cuentan. */
export const DUP_PERMITIDAS = ['Bruno Pellejo. Trece con espacios. Cabe.', '¿Y cuáles son los siguientes pasos?', 'Buenas noches, Gertrudis.',
  'Nada. Gracias, Gertrudis.',
  // las del propio E6 (§2.1: las dos de Yoli en el corte de Sistemas y en el camino del registro, dos ramas que no se oyen
  // en la misma partida; §2.3: la despedida de Gertrudis en el Vending y en la tele) y §4.3 (`once` compartido)
  '¡Estamos ciegos! ¿Hay alguien leyendo? ¿HAY ALGUIEN AHÍ FUERA?', '...Ha entrado una pieza. ¡Ha entrado una pieza! ¡El CMS va!',
  'E-00: DE NADA. ESO TAMBIÉN SE DICE.', 'Ese anuncio en la espalda... se agradece. Pero lo hablamos.',
  // §2.8 (tope «Lo que diga el Lector Medio» ≤ 5): se quedan M25 (opción de la puerta de Despachos) y M24 (Hablar con el
  // Lector en la Sala, con Gervasio delante): dos gestos distintos del mismo personaje, decididos en la tabla de tics
  'Lo que diga el Lector Medio.'];

const filtroCadenas = (rel) => !(/[\\/]art[\\/]/.test(rel) || /flags\.js$/.test(rel) || /_plantilla/.test(rel));
/** Cadenas de content/ con su fichero (el corpus de los topes «en todo el juego»). */
function corpus(root) {
  const out = [];
  for (const f of walk(path.join(root, 'content'))) {
    const rel = path.relative(root, f);
    if (!filtroCadenas(rel)) continue;
    for (const t of literales(sinSoloPantalla(rel, fs.readFileSync(f, 'utf8')))) if (esTexto(t)) out.push({ rel, t });
  }
  return out;
}
function cuentaE6(root) {
  const C = corpus(root);
  return TOPES_E6_JUEGO.map(T => {
    const base = C.filter(c => !(T.fuera && T.fuera.test(c.rel)));
    const hits = base.filter(c => (T.test ? T.test(c.t) : T.porCadena ? T.re.test(c.t) : false)).map(c => `${c.rel}: ${c.t}`);
    const pasa = T.pct != null ? hits.length / Math.max(1, base.length) > T.pct : hits.length > T.max;
    return { ...T, hits, base: base.length, pasa };
  });
}
const pctTxt = (n, b) => (100 * n / Math.max(1, b)).toFixed(1).replace('.', ',') + ' %';
/** El código de un fichero sin comentarios (las cadenas se conservan). */
function sinComentarios(src) {
  let out = '', i = 0;
  while (i < src.length) {
    const c = src[i], n = src[i + 1];
    if (c === '/' && n === '/') { const j = src.indexOf('\n', i); i = j < 0 ? src.length : j; continue; }
    if (c === '/' && n === '*') { const j = src.indexOf('*/', i + 2); i = j < 0 ? src.length : j + 2; continue; }
    if (c === "'" || c === '"' || c === '`') {
      let j = i + 1;
      while (j < src.length && src[j] !== c) j += src[j] === '\\' ? 2 : 1;
      out += src.slice(i, j + 1); i = j + 1; continue;
    }
    out += c; i++;
  }
  return out;
}
function cuentaE6Fuente(root) {
  return TOPES_E6_FUENTE.map(T => {
    const hits = [];
    for (const f of walk(path.join(root, 'content'))) {
      const rel = path.relative(root, f);
      if (!T.ficheros.test(rel)) continue;
      for (const m of sinComentarios(fs.readFileSync(f, 'utf8')).matchAll(T.re)) hits.push(`${rel}: ${m[0]}`);
    }
    return { ...T, hits, pasa: hits.length > T.max };
  });
}
/** Topes de E6 que se pasan (globales y de código). `salas`: con filtro de sala, solo los de código de esas salas. */
export function topesE6Juego(root, salas = null) {
  const fmt = (T) => `${T.txt}: ${T.hits.length}${T.pct != null ? ` de ${T.base} = ${pctTxt(T.hits.length, T.base)} (tope ${pctTxt(T.pct * 100, 100)})` : ` (tope ${T.max})`}:\n      ${[...new Set(T.hits)].slice(0, 80).join('\n      ')}${T.hits.length > 80 ? '\n      …' : ''}`;
  const fuente = cuentaE6Fuente(root).filter(T => !salas || salas.some(s => T.ficheros.test(`content/rooms/${s}.js`)));
  return [...(salas ? [] : cuentaE6(root)), ...fuente].filter(T => T.pasa).map(fmt);
}
/** Recuento de cada tope de E6, pase o no (text-audit --estatico --recuento). */
export const recuentoE6Juego = (root) => [...cuentaE6(root), ...cuentaE6Fuente(root)].map(T => ({
  txt: T.txt, n: T.hits.length, max: T.pct != null ? `${pctTxt(T.pct * 100, 100)} (${T.hits.length} de ${T.base} = ${pctTxt(T.hits.length, T.base)})` : T.max }));
/** Aviso: remate seco por fichero de sala (content/rooms/, sin art/) por encima del 22 %. Devuelve también la tabla entera
 *  para el recuento: [{ rel, n, rem, pct, pasa }]. `salas`: solo los ficheros de esas salas. */
export function rematePorSala(root, salas = null) {
  const por = new Map();
  for (const c of corpus(root)) {
    if (!/^content[\\/]rooms[\\/]/.test(c.rel) || REMATE_SALA_AVISO.fuera.test(c.rel)) continue;
    if (salas && !salas.some(s => path.basename(c.rel).startsWith(s))) continue;
    const p = por.get(c.rel) || { rel: c.rel, n: 0, rem: 0 };
    p.n++; if (esRemateSeco(c.t)) p.rem++;
    por.set(c.rel, p);
  }
  return [...por.values()].map(p => ({ ...p, pct: p.rem / Math.max(1, p.n), pasa: p.rem / Math.max(1, p.n) > REMATE_SALA_AVISO.pct }))
    .sort((a, b) => b.pct - a.pct);
}
/** Aviso: duplicados audibles entre salas distintas (> 25 caracteres, fuera de DUP_PERMITIDAS). */
export function duplicadosAudibles(root) {
  const ok = new Set(DUP_PERMITIDAS), donde = new Map();
  for (const c of corpus(root)) {
    if (!/^content[\\/]rooms[\\/]/.test(c.rel) || c.t.length <= 25 || ok.has(c.t)) continue;
    const sala = path.basename(c.rel).split('.')[0];
    (donde.get(c.t) || donde.set(c.t, new Map()).get(c.t)).set(sala, c.rel);
  }
  return [...donde].filter(([, m]) => m.size > 1).map(([t, m]) => `${t}  ←  ${[...m.values()].join(', ')}`);
}
