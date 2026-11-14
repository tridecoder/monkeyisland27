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
  [/\bPecera\b/i, 'Pecera'], [/\bEcosistema\b/i, 'Ecosistema'], [/director del periódico/i, 'director del periódico'],
  [/\bLCP\b/, 'LCP'], [/Core Web Vitals/i, 'Core Web Vitals'], [/\bINP\b/, 'INP'], [/\bCPD\b/, '«CPD» (es Sistemas)'],
];

/** Topes de muletilla por personaje (§2.4), contados en las líneas distintas que se oyen. who = id de actor (o 'bruno');
 *  `fuera` = salas que no cuentan. Herminia no tiene tope: deja de hablar (pasa a objeto). */
export const TOPES = [
  { who: 'bruno', re: /\bVacante\b/, max: 2, txt: '«Vacante» en boca de Bruno' },
  { who: 'bruno', re: /\bticket\b/i, max: 4, txt: '«ticket» en boca de Bruno' },
  { who: 'bruno', re: /lo hablamos|cariño|acreditad|cinco minutos/i, max: 0, txt: 'muletillas ajenas en boca de Bruno' },
  { who: 'celestino', re: /¿Tú eres el nuevo\?/, max: 5, txt: '«¿Tú eres el nuevo?»' },
  { who: 'nerea_backlog', re: /Si no está en el tablero, no existe/i, max: 2, txt: '«Si no está en el tablero, no existe»' },
  { who: 'teodoro_cuerpodoce', re: /\bchaval\b/i, max: 6, txt: '«chaval» (Teodoro)', also: ['fax'] },
  { who: 'teodoro_cuerpodoce', re: /\bCABE\b/, max: 4, txt: '«CABE»', also: ['fax'] },
  { who: 'aurora_galerada', re: /\bcriatura\b/i, max: 6, txt: '«criatura»' },
  { who: 'gervasio_acta', re: /lo hablamos/i, max: 5, txt: '«Lo hablamos» (Gervasio)' },
  { who: 'gervasio_acta', re: /diecinueve años/i, max: 4, txt: '«Diecinueve años»' },
  { who: 'begona_triplicado', re: /triplicado/i, max: 6, txt: '«triplicado» (Begoña)' },
  { who: 'begona_triplicado', re: /\bniño\b/i, max: 4, txt: '«niño» (Begoña)' },
  { who: 'inigo_sinergia', re: /no escala/i, max: 3, txt: '«no escala»' },
  { who: 'inigo_sinergia', re: /\bSiguiente\b/, max: 6, txt: '«Siguiente» (Íñigo)' },
  { who: 'maripaz_remitido', re: /\bcariño\b/i, max: 8, txt: '«cariño» (Maripaz; hoy ~35)' },
  { who: 'borja_engagement', re: /en vertical/i, max: 2, txt: '«en vertical»' },
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
      && !(T.fuera && T.fuera.includes(l.room)) && T.re.test(l.text));
    if (hits.length > T.max) out.push(`${T.txt}: ${hits.length} (tope ${T.max}) · p. ej. «${hits[0].text}»`);
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
      for (const [re, name] of VETADAS) if (re.test(t)) vetadas.push(`${rel}: [${name}] ${t}`);
    }
  }
  return { como: [...new Set(como)], vetadas: [...new Set(vetadas)] };
}
