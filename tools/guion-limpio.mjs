#!/usr/bin/env node
// Copia limpia del guion propuesto: node tools/guion-limpio.mjs
//   Lee docs/GUION_PROPUESTA.md y escribe docs/GUION_PROPUESTA_LIMPIO.md sin nada de lo tachado:
//   - fuera las líneas tachadas enteras (texto, viñetas, filas de tabla, el diagrama viejo);
//   - fuera los trozos tachados dentro de una línea, y los separadores « · » o « / » que quedan huérfanos;
//   - fuera las secciones cuyo encabezado está tachado (lo que queda dentro son notas sobre lo quitado);
//   - fuera las notas que solo cuentan qué texto viejo se ha tachado (lista NOTAS_FUERA, abajo);
//   - fuera los encabezados que se quedan sin contenido y las viñetas o números vacíos;
//   - listas numeradas renumeradas.
// No toca la propuesta. Con --check solo comprueba que la copia está al día (exit 1 si no).
// No está en test-all: es una herramienta del guion, no del juego.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(root, 'docs', 'GUION_PROPUESTA.md');
const DST = path.join(root, 'docs', 'GUION_PROPUESTA_LIMPIO.md');

// Notas que solo dicen qué se ha tachado (se identifican por un trozo literal de su texto).
// Las notas que explican una regla nueva, una condición o un motivo se quedan.
const NOTAS_FUERA = [
  'El micropuzle de la silla 113 se va: la silla que importa ahora',
  'Este primer esquema es el de hoy y queda sustituido entero',
  'En el diagrama, el nodo de Pilar decía',
  'El ejemplo cambia porque «Encintar, no: aislar el componente»',
  'Se quita «Sistemas no atiende»: el CMS ya no es su llave.',
  'Se quita «Sistemas no atiende»: Sistemas atiende siempre.',
  'Fuera la nota «La coma de Evaristo, a Aurora»',
  'Fuera el camino alternativo del ticket nº 3 (ver *II.1*)',
  'Fuera la variante del ticket nº 3.',
  'Fuera la variante de la otra palabra: la columna solo puede ser',
  'Inalcanzable: el rotulador llega siempre con el D1',
  'Fuera los tirones 3.º y 4.º',
  'Fuera la variante «CMS ya arreglado arriba»',
  'Referencia: el clímax es la III.6',
  'La línea del medio cruasán, que era una de las cuatro salidas',
  'Se va con el micropuzle de la silla 113.',
  'Evaristo entrega el correo él mismo: fuera «dudo de mi propia coma»',
  'Fuera «Envíelo» (Evaristo ya lo ha dado)',
  'Fuera el faldón de Comercial: era el cuarto golpe',
  'El contagio de titulares sale de la escena automática',
  'La L4 se adelanta al principio del Acto III (antes de encontrar a Brais).',
  '«Bueno, una» chocaba con el álbum',
  'La crisis de la 113 se va con su micropuzle',
  'Fuera la cena de Navidad: Brais entró en julio. Ya estaba en el juego.',
  'Brais entró en julio: no pudo salir en la cena de Navidad.',
  'El «cincuenta y seis» chocaba con el recuento nuevo',
  'Fuera la opción de la otra palabra.',
  'Solo queda una palabra buena.',
  'Fuera la variante de la otra palabra; las líneas de SALIDA EN VALOR',
  'El pósit ya está en «Prescindible» desde la FIRMA (ver *II.7*): fuera el gesto.',
  'Quedan tres llamadas: fuera la L3 y la L5',
  'Fuera la L3: no aportaba nada',
  'Fuera la L5: «el momento oportuno»',
  'Fuera: es uno de los cinco avisos del armario 27',
  'El título decía «tres» y la lista tiene ya cuatro',
  'Variante inalcanzable: el atasco ya no es jugable',
  'Dos variantes inalcanzables: el rotulador llega siempre',
  'El titular contaba el tercer tirón',
  // [P9]: notas de la lista de réplicas que solo dicen que la réplica (o el ataque) ha cambiado
  'Cambian ataque y réplica. El sitio no cambia (Aurora).',
  'Cambia la réplica. En el chisme ataca Gervasio; en el D3',
  'Cambian ataque y réplica. En el chisme ataca Maripaz (antes Gervasio).',
  'Cambia la réplica. El chisme de Celestino pasa a ser un correo',
  'Cambian ataque y réplica. El sitio no cambia (el fax enmarcado',
  '> NOTA: [P9] Cambia la réplica.',
  'Cambia la réplica, larga y corta (antes, corta',
  'Cambian ataque y réplica, y el rótulo del sitio',
  'Cambia la réplica. En el chisme ataca Maripaz y contesta Begoña.',
];

const STRUCK_LINE = /^(\s*)(?:- |\d+\. |\| )?~~.*~~(?: \|)?\s*$/;       // línea tachada entera
const STRUCK_HEADING = /^(#{1,6}) ~~.*~~\s*$/;                           // encabezado tachado: fuera la sección
const HEADING = /^(#{1,6}) /;
const NOTE = /^\s*> NOTA:/;

function limpiar(src) {
  const lines = src.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  const informe = { seccionesFuera: [], notasFuera: 0, restosEnSecciones: [] };
  let inFence = false;
  for (let i = 0; i < lines.length; i++) {
    let l = lines[i];
    // Sección con encabezado tachado: se salta hasta el siguiente encabezado del mismo nivel o superior.
    const sh = l.match(STRUCK_HEADING);
    if (sh) {
      const lvl = sh[1].length;
      informe.seccionesFuera.push(l);
      let j = i + 1;
      for (; j < lines.length; j++) {
        const h = lines[j].match(HEADING);
        if (h && h[1].length <= lvl) break;
        const t = lines[j].trim();
        if (t && !STRUCK_LINE.test(lines[j]) && !NOTE.test(lines[j]) && !t.startsWith('<!--')) informe.restosEnSecciones.push(lines[j]);
      }
      i = j - 1;
      continue;
    }
    if (/^\s*```/.test(l)) inFence = !inFence;
    if (STRUCK_LINE.test(l)) continue;
    if (NOTE.test(l) && NOTAS_FUERA.some(n => l.includes(n))) { informe.notasFuera++; continue; }
    if (!inFence && l.includes('~~')) {
      // La instrucción de cómo tachar no tiene sentido en la copia limpia.
      if (l.includes('`~~así~~`')) {
        out.push('- Esta es la **copia limpia** de `docs/GUION_PROPUESTA.md`: lo tachado allí no aparece aquí. Se regenera con `node tools/guion-limpio.mjs`; no se edita a mano.');
        continue;
      }
      // El trozo tachado deja una marca; solo se limpian los separadores pegados a ella
      // (« · » entre respuestas, « / » entre variantes; « // » separa globos y no se toca).
      const M = '\u0000', SEP = '(?:·|(?<!/)/(?!/))';
      l = l.replace(/~~.*?~~/g, M);
      l = l.replace(new RegExp(`(${SEP})\\s*${M}\\s*${SEP}`, 'g'), '$1');
      l = l.replace(new RegExp(`\\s*${SEP}\\s*${M}\\s*$`), '');
      l = l.replace(new RegExp(`^(\\s*(?:- |\\d+\\. )?)${M}\\s*(?:${SEP}\\s*)?`), '$1');
      l = l.replace(new RegExp(`\\s*${M}\\s*`, 'g'), ' ');
      l = l.replace(/(\S) {2,}/g, '$1 ').replace(/\s+$/, '');
      if (/^\s*(?:- |\d+\. |-|\d+\.)?\s*$/.test(l)) continue;
    }
    out.push(l);
  }

  // Encabezados vacíos (sin contenido propio ni subsecciones): fuera, con su comentario HTML.
  let changed = true;
  let res = out;
  while (changed) {
    changed = false;
    const next = [];
    for (let i = 0; i < res.length; i++) {
      const h = res[i].match(HEADING);
      if (h) {
        let j = i + 1, vacio = true;
        for (; j < res.length; j++) {
          const t = res[j].trim();
          if (HEADING.test(res[j])) break;
          if (t && !t.startsWith('<!--')) { vacio = false; break; }
        }
        const sig = j < res.length ? res[j].match(HEADING) : null;
        const tieneHijos = sig && sig[1].length > h[1].length;
        if (vacio && !tieneHijos) {
          informe.seccionesFuera.push(res[i] + '  (vacío)');
          i = j - 1; changed = true; continue;
        }
      }
      next.push(res[i]);
    }
    res = next;
  }

  // Listas numeradas renumeradas (por sangría; se reinician en línea en blanco, encabezado o texto suelto).
  const count = new Map();
  inFence = false;
  for (let i = 0; i < res.length; i++) {
    const l = res[i];
    if (/^\s*```/.test(l)) { inFence = !inFence; count.clear(); continue; }
    if (inFence) continue;
    const m = l.match(/^(\s*)(\d+)\. (.*)$/);
    if (m) {
      const ind = m[1].length;
      for (const k of [...count.keys()]) if (k > ind) count.delete(k);
      const n = (count.get(ind) || 0) + 1;
      count.set(ind, n);
      res[i] = `${m[1]}${n}. ${m[3]}`;
      continue;
    }
    const t = l.trim();
    if (!t || HEADING.test(l)) { count.clear(); continue; }
    if (NOTE.test(l) || /^\s/.test(l) || t.startsWith('<!--')) continue;   // notas y texto sangrado no cortan la lista
    count.clear();
  }

  // Cabecera: aviso de copia limpia, debajo del recuadro de la propuesta.
  const k = res.findIndex(l => l.startsWith('> **PROPUESTA (sin aplicar al juego).**'));
  if (k >= 0) res[k] = res[k] + ' Esta es la copia limpia: sin lo tachado.';

  let text = res.join('\n').replace(/\n{3,}/g, '\n\n');
  if (!text.endsWith('\n')) text += '\n';
  return { text, informe };
}

const { text, informe } = limpiar(fs.readFileSync(SRC, 'utf8'));
if (process.argv.includes('--check')) {
  const cur = fs.existsSync(DST) ? fs.readFileSync(DST, 'utf8') : '';
  if (cur !== text) { console.error('GUION_PROPUESTA_LIMPIO.md no está al día: node tools/guion-limpio.mjs'); process.exit(1); }
  console.log('GUION_PROPUESTA_LIMPIO.md al día.');
} else {
  fs.writeFileSync(DST, text);
  console.log(`Escrito ${path.relative(root, DST)} (${text.split('\n').length - 1} líneas).`);
  console.log(`Secciones quitadas (${informe.seccionesFuera.length}):`);
  for (const s of informe.seccionesFuera) console.log('  ' + s);
  console.log(`Notas quitadas por la lista: ${informe.notasFuera}`);
  if (informe.restosEnSecciones.length) {
    console.log('AVISO: texto sin tachar dentro de secciones tachadas (revisar):');
    for (const s of informe.restosEnSecciones) console.log('  ' + s.slice(0, 120));
  }
}
