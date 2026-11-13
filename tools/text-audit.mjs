#!/usr/bin/env node
// AUDITORÍA DE TEXTOS (QA): juega el walkthrough 5.4 en modo rápido y, en tres momentos (Actos I, II y III), prueba los
// 9 verbos con TODO lo visible de las 10 salas (saliendo de diálogos con su despedida); recoge cada línea dicha
// (`__game.log`) y comprueba:
//   · ninguna intervención de más de 80 caracteres (biblia §0);
//   · ningún globo de más de 3 renglones a 210 px (se saldría por arriba / taparía la escena);
//   · signos de apertura: cada «?» / «!» con su «¿» / «¡» en la misma frase;
//   · nombres: elContable.es, Íñigo, Begoña, Rubén, Ramírez... con sus tildes;
//   · horas: lista de todas las horas que aparecen (18:30 → 21:00, relojes en 20:59, Begoña 19:00-19:15 / 19:07);
//   · palabras prohibidas en lo que ve u oye el jugador (órdenes de dirección): «Pajarera» (es «Dirección») y «Office»
//     (es «Vending»), en cualquier mayúscula: en las líneas dichas, los nombres de salas/objetos/PNJ, la botonera y TODAS
//     las cadenas literales de content/ (pintadas incluidas), salvo ids (`office_a_pecera`, `GV_OFFICE`, `m_office`) y
//     las descripciones de flags; los comentarios no cuentan;
//   · el gag de Desarrollo es VELADO (adenda §17): ni «feminista/machista», «igualdad», «brecha», «compañeras», «8 de
//     marzo»/«8M»/«logo morado» ni «dar voz», en nada de lo que se ve o se oye (dicho, nombres y cadenas de content/);
//   · «Nerea» (el desarrollador es Nemesio; el id `nerea_backlog` no cuenta) y «Dirección» como NOMBRE DE LA SALA (es
//     «Despachos»): en los nombres de salas/objetos/PNJ y la botonera no puede salir «Dirección»; en lo dicho y en las
//     cadenas de content/, ni «puerta/pasillo/cristal/placa/despacho/perchero/mueble de Dirección» ni la placa «DIRECCIÓN»
//     (la «Reunión de Dirección», la «PANTALLA DE DIRECCIÓN» y la «Dirección de arte» sí valen);
//   · textos con temporizador (avisos, globos con `ms`, el hilo del duelo, mensajes del menú): cada uno dura al menos
//     el tiempo de lectura del motor (`speechDuration`, que escala con la velocidad del texto) — engine `timedTexts`;
//   · puesta en escena (problema C del director): quien dice una línea no puede estar tapado por otro actor que esté
//     delante de él (más de un 20 % de su cabeza y torso bajo la figura de otro, por cajas de sprite).
//   node tools/text-audit.mjs
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from './serve.mjs';
import { STEPS } from './walk-data.mjs';
import { createRunner, FAREWELLS } from './walk-lib.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const server = createServer(path.resolve(here, '..'));
await new Promise(r => server.listen(0, r));
const browser = await chromium.launch();
const page = await browser.newPage();
const consoleErrors = [];
page.on('console', m => { if (m.type() === 'error' && !/doVerb: objetivo desconocido/.test(m.text())) consoleErrors.push(m.text()); });
const R = createRunner(page);
const G = R.G;
const norm = s => String(s).toLowerCase().replace(/[«»"“”'’]/g, '').replace(/\s+/g, ' ').trim();
const lines = new Map();       // texto → { who, room }
const collect = async () => {
  const L = await G(() => { const l = __game.log.slice(); __game.clearLog(); return l; });
  for (const l of L) if (l.who !== 'aviso' && !lines.has(l.text)) lines.set(l.text, { who: l.who, room: l.room });
};
async function escape() {
  for (let k = 0; k < 40; k++) {
    await G(() => __game.waitIdle());
    const st = await G(() => __game.state());
    if (st.pickItem) { await G(() => __game.chooseItem(null)); continue; }
    if (st.duel && st.dialog) { const i = st.dialog.findIndex(o => o.startsWith('Te lo miro') || o === '[Retirarse del hilo]'); await G(i => __game.chooseDialog(i), Math.max(0, i)); continue; }
    if (st.dialog) {
      let i = FAREWELLS.map(f => st.dialog.findIndex(o => norm(o).startsWith(f))).find(x => x >= 0);
      if (i == null || i < 0) { i = st.dialog.length - 1; while ((st.dialogDisabled || []).includes(i) && i > 0) i--; }
      await G(i => __game.chooseDialog(i), i); continue;
    }
    return;
  }
}
const ROOMS = ['vestibulo', 'pecera', 'office', 'catacumba', 'pajarera', 'sala_amazonas', 'ecosistema', 'eventos', 'administracion', 'cpd'];
const VERBS = ['mirar', 'coger', 'usar', 'abrir', 'cerrar', 'empujar', 'tirar', 'hablar', 'dar'];
async function everything() {
  await G(() => __game.save('ta'));
  for (const room of ROOMS) {
    await G(() => __game.load('ta'));
    await G(async (room) => { const g = __game.game; g.state.room = room; await g.runScript(async () => { await g.enterRoom(room, null, { restore: true }); }); }, room);
    const targets = await G(() => __game.objects().filter(o => o.visible !== false && !/^.*_a_|ascensor|torno|puerta/.test(o.id)).map(o => o.id));
    for (const id of targets) for (const v of VERBS) {
      if (await G(() => __game.state().room) !== room) { await G(() => __game.load('ta')); await G(async (room) => { const g = __game.game; g.state.room = room; await g.runScript(async () => { await g.enterRoom(room, null, { restore: true }); }); }, room); }
      await G(([v, t]) => __game.doVerb(v, t), [v, id]);
      await escape();
    }
    await collect();
  }
  await G(() => __game.load('ta'));
}

await page.goto(`http://localhost:${server.address().port}/`);
await page.evaluate(() => { try { localStorage.clear(); } catch (e) { /* ignore */ } });
await page.reload();
await page.waitForFunction(() => !!window.__game);
await G(() => __game.skipText(true));
await R.startDismisser();
// puesta en escena: al empezar cada línea, ¿tapa alguien (por delante) a quien habla?
await G(() => {
  const g = __game.game; window.__ocl = [];
  const orig = g.speak.bind(g);
  g.speak = (who, text, opts) => {
    try {
      const a = who && g.actors[who];
      if (a && g.room && a.room === g.room.def.id && a.visible && !(opts && opts.at) && !g.phone) {
        const shrink = (b) => { const w = b.w * 0.7; return { x: b.x + (b.w - w) / 2, y: b.y, w, h: b.h }; };
        const b = shrink(g.actorBox(a)); const top = { x: b.x, y: b.y, w: b.w, h: (b.h - 2) * 0.6 };
        let cov = 0; const by = [];
        for (const o of Object.values(g.actors)) {
          if (o === a || o.room !== a.room || !o.visible || o.y <= a.y + 1) continue;
          const c = shrink(g.actorBox(o));
          const ix = Math.max(0, Math.min(top.x + top.w, c.x + c.w) - Math.max(top.x, c.x));
          const iy = Math.max(0, Math.min(top.y + top.h, c.y + c.h) - Math.max(top.y, c.y));
          if (ix * iy > 0) { cov += ix * iy; by.push(`${o.id}@${Math.round(o.x)},${Math.round(o.y)}`); }
        }
        const f = cov / Math.max(1, top.w * top.h);
        if (f > 0.2) window.__ocl.push(`${g.room.def.id}: ${who}@${Math.round(a.x)},${Math.round(a.y)} (${Math.round(f * 100)} % tapado por ${by.join(', ')}): ${text}`);
      }
    } catch (e) { /* ignore */ }
    return orig(who, text, opts);
  };
});
await G(() => __game.newGame());
await collect();
for (const s of STEPS) {
  if (s.n > 1) { for (const a of s.acc) await R.run(a); await G(() => __game.waitIdle()); }
  await collect();
  if ([13, 29, 42].includes(s.n)) await everything();
}
await collect();

// ------------------------------------------------------------------ comprobaciones
const texts = [...lines.keys()];
const widths = await G(async (texts) => { const F = await import('/engine/font.js'); return texts.map(t => F.wrap(t, 210).length); }, texts);
const long = [], tall = [], punct = [], names = [], times = new Map();
const NAME_RULES = [[/\bInigo\b/, 'Íñigo'], [/\bÍnigo\b/, 'Íñigo'], [/\bBegona\b/, 'Begoña'], [/\bRuben\b/, 'Rubén'], [/\bRamirez\b/, 'Ramírez'], [/\bValentin\b/, 'Valentín'],
  [/\bReticula\b/, 'Retícula'], [/\belcontable|\bEl ?Contable\.es|\bElContable/, 'elContable.es / «el Contable»'], [/\bCatacumbas\b/, 'Catacumba'], [/\bTeodor\b/, 'Teodoro']];
texts.forEach((t, i) => {
  const who = lines.get(t).who;
  if (t.length > 80) long.push(`[${t.length}] ${who}: ${t}`);
  if (widths[i] > 3) tall.push(`[${widths[i]} renglones] ${who}: ${t}`);
  // signos de apertura, frase a frase (los rótulos del narrador y las pantallas en MAYÚSCULAS también cuentan)
  for (const sent of t.split(/(?<=[?!»]|[^.]\.)\s+/)) {
    const q = (sent.match(/\?/g) || []).length, oq = (sent.match(/¿/g) || []).length;
    const e = (sent.match(/!/g) || []).length, oe = (sent.match(/¡/g) || []).length;
    if ((q && !oq) || (e && !oe && !/!!/.test(sent))) punct.push(`${who}: ${t}`);
  }
  for (const [re, good] of NAME_RULES) if (re.test(t)) names.push(`«${good}»: ${who}: ${t}`);
  for (const m of t.matchAll(/\b(\d{1,2})[:.](\d{2})\b(?!\s*(€|euros|%))/g)) { const h = +m[1]; if (h <= 24 && m[0].includes(':')) times.set(m[0], (times.get(m[0]) || []).concat(who)); }
});
const out = [];
const sec = (title, arr) => { out.push(`\n${title}: ${arr.length}`); arr.slice(0, 80).forEach(x => out.push('  · ' + x)); };
out.push(`Líneas distintas recogidas: ${texts.length}`);
sec('Intervenciones de más de 80 caracteres', long);
sec('Globos de más de 3 renglones', tall);
sec('Signos de apertura que faltan (¿ ¡)', [...new Set(punct)]);
sec('Nombres mal escritos', names);
// palabras prohibidas (órdenes de dirección 1 e i): en lo dicho, en los nombres y en las cadenas literales de content/
const PROHIBIDAS = /pajarera|office|nerea/i;
// «Dirección» como nombre de la sala de los despachos (orden del director: se llama «Despachos»)
const DIR_FRASE = /\b(puerta|pasillo|cristal|placa|despacho|perchero|mueble) de (la )?Direcci[oó]n\b/i, DIR_PLACA = /^\s*(1 )?DIRECCIÓN\s*$/;
const DIR_SALA = { test: (t) => DIR_FRASE.test(t) || DIR_PLACA.test(t) };
const esId = (t) => /^[A-Za-z0-9_.:\-/]+$/.test(t) || /^(bool|int|str|num|flag)\b.*·/.test(t);
// el gag de Desarrollo es VELADO (adenda §17, orden del director): nada visible puede nombrar el tema ni ponerlo sobre la mesa
const VELADO = /feminis|machis|igualdad|brecha|compañeras|8 de marzo|\b8M\b|en morado|logo morado|\bda[rn]? voz\b/i;
const prohibidas = [];
for (const t of texts) if (PROHIBIDAS.test(t) || DIR_SALA.test(t) || VELADO.test(t)) prohibidas.push(`dicho (${lines.get(t).who}): ${t}`);
const visibles = await G(() => {
  const g = __game.game, out = [];
  for (const [rid, r] of Object.entries(g.content.rooms)) {
    out.push(['sala ' + rid, r.name || '']);
    for (const o of r.objects || []) { if (typeof o.name === 'string') out.push([`${rid}.${o.id}`, o.name]); if (o.ascensor && o.ascensor.label) out.push([`${rid}.${o.id} (botonera)`, o.ascensor.label]); }
  }
  for (const [id, a] of Object.entries(g.actors)) out.push(['actor ' + id, (a.def && a.def.name) || a.name || '']);
  return out;
});
for (const [k, t] of visibles) if (PROHIBIDAS.test(t) || VELADO.test(t) || /direcci[oó]n/i.test(t)) prohibidas.push(`nombre ${k}: «${t}»`);
/** Cadenas literales de un archivo JS, sin comentarios (tokenizador mínimo: '…', "…", `…`, // y /* *\/). */
function literales(src) {
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
for (const f of walk(path.join(here, '..', 'content'))) {
  if (/content[\\/]flags\.js$/.test(f)) continue;                        // descripciones internas de flags
  for (const t of literales(fs.readFileSync(f, 'utf8'))) if (((PROHIBIDAS.test(t) && !esId(t)) || DIR_SALA.test(t) || VELADO.test(t))) prohibidas.push(`${path.relative(path.join(here, '..'), f)}: «${t}»`);
}
sec('Palabras prohibidas a la vista (Pajarera / Office / Nerea / «Dirección» como sala / el gag velado de Desarrollo)', [...new Set(prohibidas)]);
// textos con temporizador: nunca menos que el tiempo de lectura (con la velocidad del texto de la partida)
const timed = await G(() => (__game.game.timedTexts || []).map(x => ({ ...x })));
const cortos = [...new Set(timed.filter(x => x.ms < x.need).map(x => `[${x.kind}] ${x.ms} ms < ${x.need} ms: ${x.text}`))];
sec(`Textos con temporizador más cortos que su tiempo de lectura (${timed.length} medidos)`, cortos);
const ocl = [...new Set(await G(() => window.__ocl || []))];
sec('Quien habla queda tapado por otro actor', ocl);
out.push('\nHoras que aparecen: ' + [...times.keys()].sort().join(', '));
console.log(out.join('\n'));
fs.mkdirSync(path.join(here, 'shots'), { recursive: true });
fs.writeFileSync(path.join(here, 'shots', 'textos.json'), JSON.stringify(texts.map(t => ({ ...lines.get(t), text: t })), null, 1));
if (consoleErrors.length) console.log('\nErrores de consola:\n  ' + [...new Set(consoleErrors)].join('\n  '));
const bad = long.length + tall.length + punct.length + names.length + ocl.length + consoleErrors.length + new Set(prohibidas).size + cortos.length;
console.log(bad ? `\nTEXTOS: ${bad} AVISOS` : '\nTEXTOS: OK');
await browser.close();
server.close();
process.exit(bad ? 1 : 0);
