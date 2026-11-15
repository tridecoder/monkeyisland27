#!/usr/bin/env node
// GENERADOR DEL MÓDULO DE DATOS DEL TITULADOR (ENMIENDA E4 §3bis.3).
//
//   node tools/gen-titulador.mjs                 lee docs/guion2/e4/piezas.json y escribe content/rooms/pecera.titulador.datos.js
//   node tools/gen-titulador.mjs --comprobar     no escribe: sale con 1 si el módulo del juego no coincide con el JSON
//   node tools/gen-titulador.mjs <piezas.json> [<salida.js>]   otras rutas
//
// El juego de piezas (autoridades, asuntos, ganchos, plantillas, afinidades, especiales, secretos, categorías, líneas de
// Yoli, demo del paso 34 y ganador por defecto) es DATO: la lógica (content/rooms/pecera.titulador.js) no nombra ningún
// id. Para sustituir el juego entero: copiar el piezas.json nuevo (mismo formato) a docs/guion2/e4/, ejecutar este script y
// pasar `node tools/test-e4.mjs` (compara las combinaciones con docs/guion2/e4/gen.mjs, el generador de referencia).
//
// El módulo sale en dos bloques: todo lo que SOLO SE VE (titulares, menús, etiquetas) va entre las marcas
// `@solo-pantalla:inicio` / `@solo-pantalla:fin`, que tools/plan-rules.mjs y tools/check.mjs se saltan en los ficheros
// declarados en `SOLO_PANTALLA` (no son líneas habladas: ni topes de fórmula ni límite de 80 caracteres). Las líneas que
// dice Yoli (`lineas`) quedan FUERA de las marcas y pasan por todos los topes.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const pos = process.argv.slice(2).filter(a => !a.startsWith('--'));
const src = path.resolve(pos[0] || path.join(root, 'docs/guion2/e4/piezas.json'));
const dst = path.resolve(pos[1] || path.join(root, 'content/rooms/pecera.titulador.datos.js'));
const P = JSON.parse(fs.readFileSync(src, 'utf8'));

// comprobaciones de formato (lo que la lógica del juego necesita)
const falta = [];
for (const k of ['autoridades', 'asuntos', 'ganchos', 'afinidades', 'especiales', 'lineas', 'categorias', 'secretos', 'demo_paso_34', 'ganador_por_defecto', 'sentimentales', 'formula'])
  if (P[k] == null) falta.push(k);
if (falta.length) { console.error('piezas.json: faltan claves: ' + falta.join(', ')); process.exit(1); }
const ids = (L) => new Set(L.map(p => p.id));
const [IA, IS, IG] = [ids(P.autoridades), ids(P.asuntos), ids(P.ganchos)];
const combo = (k) => { const [a, s, g] = String(k).split('|'); return IA.has(a) && IS.has(s) && IG.has(g); };
for (const d of P.demo_paso_34) if (!combo(d.join('|'))) falta.push('demo_paso_34 ' + d.join('|'));
if (!combo(P.ganador_por_defecto)) falta.push('ganador_por_defecto ' + P.ganador_por_defecto);
for (const s of P.secretos) { if (!combo(s.combo)) falta.push('secreto ' + s.combo); if (s.linea && !P.lineas[s.linea]) falta.push('línea ' + s.linea); }
for (const c of P.categorias) if (c.linea && /^[CX]\d+$/.test(c.linea) && !P.lineas[c.linea]) falta.push('línea ' + c.linea);
for (const a of P.autoridades) for (const g of P.ganchos) if (!(a.t && a.t[g.id])) falta.push(`plantilla ${a.id}·${g.id}`);
if (falta.length) { console.error('piezas.json incoherente:\n  ' + falta.join('\n  ')); process.exit(1); }

const { lineas, ...pantalla } = P;
const J = (o) => JSON.stringify(o, null, 1);
const out = `// GENERADO por tools/gen-titulador.mjs desde docs/guion2/e4/piezas.json (versión «${P.version || '?'}»). NO SE EDITA A MANO:
// se cambia el JSON y se vuelve a generar (docs/guion2-impl/GUIA_AUTORES.md §E4). Lo lee content/rooms/pecera.titulador.js.
// Bloque «solo pantalla»: titulares, plantillas, menús y etiquetas que solo se ven en el monitor de Yoli; no son líneas
// habladas (tools/plan-rules.mjs SOLO_PANTALLA los deja fuera de los topes y del límite de 80 caracteres).
// @solo-pantalla:inicio
const PIEZAS = ${J(pantalla)};
// @solo-pantalla:fin
// Lo que DICE Yoli al publicar (una vez cada una por partida): líneas habladas, pasan por todos los topes.
PIEZAS.lineas = ${J(lineas)};
export default PIEZAS;
`;
if (process.argv.includes('--comprobar')) {
  const cur = fs.existsSync(dst) ? fs.readFileSync(dst, 'utf8') : '';
  if (cur !== out) { console.error(`✗ ${path.relative(root, dst)} no coincide con ${path.relative(root, src)}: node tools/gen-titulador.mjs`); process.exit(1); }
  console.log(`✓ ${path.relative(root, dst)} al día (${P.autoridades.length} × ${P.asuntos.length} × ${P.ganchos.length})`);
} else {
  fs.writeFileSync(dst, out);
  console.log(`Escrito ${path.relative(root, dst)}: ${P.autoridades.length} autoridades × ${P.asuntos.length} asuntos × ${P.ganchos.length} ganchos = ${P.autoridades.length * P.asuntos.length * P.ganchos.length} titulares; ${Object.keys(lineas).length} líneas de Yoli; ${P.secretos.length} secretos.`);
}
