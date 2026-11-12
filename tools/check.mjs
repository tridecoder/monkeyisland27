#!/usr/bin/env node
// Comprobación estática del contenido (sin navegador): node tools/check.mjs
//  ERRORES (exit 1): imports que no resuelven; ids de lógica y arte que no casan (buildRoom); sala sin archivo de arte;
//    salidas a salas/entradas inexistentes; flags usados en content/ que no están en content/flags.js ni en los
//    `flags` locales de una sala; items/actores/escenas/réplicas referenciados que no existen; mazos de duelo
//    con parejas u objetos inexistentes.
//  AVISOS: líneas habladas de más de 80 caracteres (biblia §0); flags locales sin el prefijo de su sala.
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const C = path.join(root, 'content');
const errors = [], warnings = [];
const err = (m) => errors.push(m), warn = (m) => warnings.push(m);
const rel = (f) => path.relative(root, f);

// Node has no DOM: content may only touch `document` inside draw functions (true for the engine helpers).
globalThis.window = globalThis.window || undefined;

// ------------------------------------------------------------------ 1. imports
const files = [];
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else if (f.endsWith('.js')) files.push(p); } })(C);
for (const f of files) {
  if (path.basename(f).startsWith('_plantilla')) continue;
  try { await import(pathToFileURL(f).href); } catch (e) { err(`${rel(f)}: no se puede importar: ${e.message.split('\n')[0]}`); }
}
let content = null, roomWarnings = [];
try {
  content = (await import(pathToFileURL(path.join(C, 'index.js')).href)).default;
  roomWarnings = (await import(pathToFileURL(path.join(C, 'lib', 'room.js')).href)).roomWarnings;
} catch (e) { err('content/index.js no se puede importar: ' + e.message); }

if (content) {
  const asArray = x => x == null ? [] : Array.isArray(x) ? x : [x];
  const rooms = Object.fromEntries(asArray(content.rooms).map(r => [r.id, r]));
  const items = Object.assign({}, content.game.items, ...asArray(content.items));
  const actors = Object.assign({}, ...asArray(content.actors));
  const flagsKnown = Object.assign({}, ...asArray(content.flags));
  const duelData = asArray(content.duels)[0] || {};
  const pairs = new Map((duelData.pairs || []).map(p => [p.id, p]));
  const scenes = new Set(Object.keys(content.game.scenes || {}));
  for (const r of Object.values(rooms)) for (const k of Object.keys(r.scenes || {})) scenes.add(k);

  // ---------------------------------------------------------------- 2. logic/art ids, files, exits
  for (const w of roomWarnings) err(w);
  for (const id of Object.keys(rooms)) {
    if (!fs.existsSync(path.join(C, 'rooms', id + '.js'))) err(`sala ${id}: no existe content/rooms/${id}.js`);
    if (!fs.existsSync(path.join(C, 'rooms', 'art', id + '.art.js'))) err(`sala ${id}: no existe content/rooms/art/${id}.art.js`);
    const r = rooms[id];
    for (const o of r.objects || []) if (o.exit) {
      if (!rooms[o.exit.room]) err(`sala ${id}: la salida ${o.id} lleva a una sala inexistente (${o.exit.room})`);
      else if (!(rooms[o.exit.room].entries || {})[o.exit.entry]) err(`sala ${id}: la salida ${o.id} usa la entrada '${o.exit.entry}', que no existe en ${o.exit.room}`);
    }
    for (const p of r.actors || []) if (!actors[p.id]) err(`sala ${id}: PNJ desconocido ${p.id}`);
    for (const k of Object.keys(r.flags || {})) {
      if (!k.startsWith(id + '_')) warn(`sala ${id}: el flag local '${k}' no empieza por '${id}_'`);
      if (k in flagsKnown) err(`sala ${id}: el flag local '${k}' ya es global (content/flags.js)`);
      flagsKnown[k] = r.flags[k];
    }
    // duels defined by this room
    for (const [did, d] of Object.entries(r.duels || {})) {
      if (d.actor && !actors[d.actor]) err(`duelo ${did} (${id}): actor desconocido ${d.actor}`);
      for (const p of d.deck || []) if (!pairs.has(p)) err(`duelo ${did} (${id}): pareja desconocida ${p}`);
      for (const f of d.finishers || []) if (f.object && !items[f.object]) err(`duelo ${did} (${id}): el remate pide un objeto inexistente ${f.object}`);
    }
  }
  // ascensor con botonera (content/lib/ascensor.js): cada sala con un objeto `ascensor` es una planta; une con todas
  const { PLANTAS } = await import(pathToFileURL(path.join(C, 'lib', 'ascensor.js')).href);
  const liftRooms = Object.entries(rooms).filter(([, r]) => (r.objects || []).some(o => o.ascensor)).map(([rid]) => rid);
  for (const p of PLANTAS) {
    if (!rooms[p.room]) { err(`ascensor: la planta ${p.n} apunta a una sala inexistente (${p.room})`); continue; }
    if (!(rooms[p.room].objects || []).some(o => o.id === p.obj && o.ascensor)) err(`ascensor: la sala ${p.room} no tiene el objeto ${p.obj} (ascensorObjeto)`);
    if (!(rooms[p.room].entries || {}).ascensor) err(`ascensor: la sala ${p.room} no tiene la entrada 'ascensor' en su arte`);
  }
  const reachedBy = (rid) => Object.values(rooms).some(o => (o.objects || []).some(x => x.exit && x.exit.room === rid)) || (liftRooms.includes(rid) && liftRooms.length > 1);
  for (const [rid] of Object.entries(rooms)) if (rid !== content.game.startRoom && !reachedBy(rid)) warn(`sala ${rid}: ninguna salida lleva a ella`);
  if (!rooms[content.game.startRoom]) err('game.startRoom desconocida: ' + content.game.startRoom);

  // ---------------------------------------------------------------- 3. static scan of the sources
  const ENGINE_PREFIX = /^(duel:|walkbox:)/;
  const flagUses = [], itemUses = [], actorUses = [], sceneUses = [], replyUses = [];
  const strRe = (inner) => new RegExp(inner, 'g');
  const condParts = (s) => s.split(/\s*,\s*/).map(x => x.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
  for (const f of files) {
    if (f.endsWith(path.join('content', 'flags.js')) || path.basename(f).startsWith('_plantilla')) continue;
    // comments are not scanned (line comments and /* */ blocks)
    const src = fs.readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ' ')).split('\n').map(l => l.replace(/(^|\s)\/\/.*$/, '$1')).join('\n');
    const lines = src.split('\n');
    const at = (idx) => `${rel(f)}:${src.slice(0, idx).split('\n').length}`;
    const scan = (re, cb) => { let m; while ((m = re.exec(src))) cb(m, at(m.index)); };
    scan(strRe(String.raw`\b(?:flag|setFlag|inc|getFlag)\(\s*['"]([^'"]+)['"]`), (m, w) => flagUses.push([m[1], w]));
    scan(strRe(String.raw`\b(?:if|when|cond)\s*[:(]\s*['"]([^'"]+)['"]`), (m, w) => condParts(m[1]).forEach(c => flagUses.push([c, w, true])));
    scan(strRe(String.raw`\b(?:if|when)\s*:\s*\[([^\]]*)\]`), (m, w) => (m[1].match(/['"][^'"]+['"]/g) || []).forEach(c => flagUses.push([c.slice(1, -1), w, true])));
    scan(strRe(String.raw`setFlag\s*:\s*['"]([^'"]+)['"]`), (m, w) => flagUses.push([m[1], w]));
    scan(strRe(String.raw`setFlag\s*:\s*\{([^}]*)\}`), (m, w) => (m[1].match(/([a-z0-9_]+)\s*:/g) || []).forEach(k => flagUses.push([k.replace(/\s*:$/, ''), w])));
    scan(strRe(String.raw`\b(?:give|take|has|giveItem|takeItem)\(\s*['"]([^'"]+)['"]`), (m, w) => itemUses.push([m[1], w]));
    scan(strRe(String.raw`['"](?:usar|dar):([a-z0-9_]+)['"]\s*:`), (m, w) => itemUses.push([m[1], w, 'handler']));
    scan(strRe(String.raw`\bpickup\s*:\s*['"]([^'"]+)['"]`), (m, w) => itemUses.push([m[1], w]));
    scan(strRe(String.raw`\bsayAs\(\s*['"]([^'"]+)['"]`), (m, w) => actorUses.push([m[1], w]));
    scan(strRe(String.raw`\bscene\(\s*['"]([^'"]+)['"]`), (m, w) => sceneUses.push([m[1], w]));
    scan(strRe(String.raw`\b(?:learnReply|knowsReply)\(\s*['"]([^'"]+)['"]`), (m, w) => replyUses.push([m[1], w]));
    // ---- spoken lines longer than 80 characters (string literals that look like sentences)
    lines.forEach((ln, i) => {
      const t = ln.trim();
      if (t.startsWith('//') || t.startsWith('*') || t.startsWith('import ')) return;
      const re = /'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"|`([^`$]*)`/g;
      let m;
      while ((m = re.exec(ln))) {
        const s = (m[1] ?? m[2] ?? m[3] ?? '').replace(/\\(.)/g, '$1');
        if (s.length > 80 && (s.match(/ /g) || []).length >= 4 && /[a-záéíóúñ]/i.test(s)) warn(`${rel(f)}:${i + 1}: línea de ${s.length} caracteres (> 80): «${s.slice(0, 60)}…»`);
      }
    });
  }
  const reported = new Set();
  for (const [raw, where, isCond] of flagUses) {
    let n = raw.replace(/^!/, '').split('=')[0].trim();
    if (!n || (isCond && n.startsWith('has:'))) {
      if (n.startsWith('has:') && !items[n.slice(4)]) err(`${where}: condición con objeto inexistente '${n}'`);
      continue;
    }
    if (ENGINE_PREFIX.test(n) || n in flagsKnown) continue;
    if (!/^[a-z0-9_]+$/.test(n)) continue;          // not a flag literal
    const key = n + '@' + where;
    if (!reported.has(key)) { reported.add(key); err(`${where}: flag '${n}' no declarado en content/flags.js (ni local de la sala)`); }
  }
  for (const [i, where, kind] of itemUses) if (!items[i] && !(kind === 'handler' && (rooms[i] || Object.values(rooms).some(r => (r.objects || []).some(o => o.id === i)) || actors[i]))) err(`${where}: objeto de inventario inexistente '${i}'`);
  for (const [a, where] of actorUses) if (!actors[a]) err(`${where}: actor inexistente '${a}'`);
  for (const [s, where] of sceneUses) if (!scenes.has(s)) warn(`${where}: escena '${s}' no implementada todavía`);
  for (const [r, where] of replyUses) if (![...pairs.values()].some(p => p.flag === r || p.id === r)) err(`${where}: réplica desconocida '${r}'`);

  // ---------------------------------------------------------------- 4. summary
  const nObj = Object.values(rooms).reduce((s, r) => s + (r.objects || []).length, 0);
  console.log(`Contenido: ${Object.keys(rooms).length} salas, ${nObj} hotspots, ${Object.keys(actors).length} actores, ${Object.keys(items).length} objetos, ${Object.keys(flagsKnown).length} flags, ${pairs.size} parejas de duelo.`);
}

if (warnings.length) { console.log(`\nAVISOS (${warnings.length}):`); warnings.forEach(w => console.log('  · ' + w)); }
if (errors.length) { console.log(`\nERRORES (${errors.length}):`); errors.forEach(e => console.log('  ✗ ' + e)); }
console.log(errors.length ? '\nCHECK: FALLA' : '\nCHECK: OK');
process.exit(errors.length ? 1 : 0);
