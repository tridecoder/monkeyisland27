#!/usr/bin/env node
// AUDITORÍA DE TEXTOS (QA): juega el walkthrough 5.4 en modo rápido y, en tres momentos (Actos I, II y III), prueba los
// 9 verbos con TODO lo visible de las 9 salas (saliendo de diálogos con su despedida); recoge cada línea dicha
// (`__game.log`) y comprueba:
//   · ninguna intervención de más de 80 caracteres (biblia §0);
//   · ningún globo de más de 3 renglones a 210 px (se saldría por arriba / taparía la escena);
//   · signos de apertura: cada «?» / «!» con su «¿» / «¡» en la misma frase;
//   · nombres: elContable.es, Íñigo, Begoña, Rubén, Ramírez... con sus tildes;
//   · horas: lista de todas las horas que aparecen (18:30 → 21:00, relojes en 20:59, Begoña 19:00-19:15 / 19:07).
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
const ROOMS = ['vestibulo', 'pecera', 'office', 'catacumba', 'pajarera', 'sala_amazonas', 'ecosistema', 'administracion', 'cpd'];
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
out.push('\nHoras que aparecen: ' + [...times.keys()].sort().join(', '));
console.log(out.join('\n'));
fs.mkdirSync(path.join(here, 'shots'), { recursive: true });
fs.writeFileSync(path.join(here, 'shots', 'textos.json'), JSON.stringify(texts.map(t => ({ ...lines.get(t), text: t })), null, 1));
if (consoleErrors.length) console.log('\nErrores de consola:\n  ' + [...new Set(consoleErrors)].join('\n  '));
const bad = long.length + tall.length + punct.length + names.length + consoleErrors.length;
console.log(bad ? `\nTEXTOS: ${bad} AVISOS` : '\nTEXTOS: OK');
await browser.close();
server.close();
process.exit(bad ? 1 : 0);
