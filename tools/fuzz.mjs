#!/usr/bin/env node
// AUDITORÍA DE CALLEJONES Y ROBUSTEZ (QA). Tres partidas en modo rápido sobre el walkthrough 5.4 (walk-data.mjs):
//  1. GUARDAR / CARGAR en mitad de cada acto: en varios puntos guarda, empieza una partida nueva, carga, comprueba que el
//     estado es idéntico (inventario sin duplicados, flags, sala), que cargar NO relanza escenas de una vez (ni una línea
//     nueva en el registro) y sigue hasta el final (juego_terminado).
//  2. PERDER CADA DUELO UNA VEZ (D1-D4: tres flojas seguidas): sin castigo, sin perder objetos, y luego se gana.
//  3. DAR / USAR CADA OBJETO con cada PNJ y con cada hotspot de cada sala (con el inventario completo), en tres momentos
//     de la partida: ninguna excepción, ningún diálogo/duelo del que no se pueda salir, y lista de los objetos que se
//     gastan (para revisar que solo se gastan con su uso correcto).
//   node tools/fuzz.mjs [--solo=guardar|duelos|objetos] [--sala=pecera,office] [--rapido]
//     --sala: «todos los objetos con todo» solo en esas salas · --rapido: 3 puntos de guardado, sin la tanda de duelos y
//     objetos solo en el Acto II (muestra: 1 de cada 2 objetos del inventario)
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from './serve.mjs';
import { STEPS } from './walk-data.mjs';
import { createRunner, FAREWELLS, StepFail } from './walk-lib.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const args = Object.fromEntries(process.argv.slice(2).filter(a => a.startsWith('--')).map(a => { const [k, v] = a.slice(2).split('='); return [k, v ?? true]; }));
const server = createServer(path.resolve(here, '..'));
await new Promise(r => server.listen(0, r));
const base = `http://localhost:${server.address().port}/`;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 640, height: 400 } });
const consoleErrors = [];
page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));
const R = createRunner(page);
const G = R.G;
const state = () => G(() => __game.state());
const norm = s => String(s).toLowerCase().replace(/[«»"“”'’]/g, '').replace(/\s+/g, ' ').trim();
let failures = 0, checks = 0;
const ok = (c, m) => { checks++; if (c) console.log('  ✓ ' + m); else { failures++; console.log('  ✗ ' + m); } };

async function fresh() {
  await page.goto(base);
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) { /* ignore */ } });
  await page.reload();
  await page.waitForFunction(() => !!window.__game);
  await G(() => __game.skipText(true));
  await R.startDismisser();
  await G(() => __game.newGame());
}
async function step(n) {
  const s = STEPS.find(s => s.n === n);
  for (const a of s.acc) await R.run(a);
  await G(() => __game.waitIdle());
  await R.check(s.esp);
}
const engineErrors = () => G(() => __game.errors.filter(e => !e.warn).length);
/** Sale de cualquier diálogo / duelo / selector. Devuelve false si no se puede (callejón). */
async function escape() {
  for (let k = 0; k < 40; k++) {
    await G(() => __game.waitIdle());
    const st = await state();
    if (st.pickItem) { await G(() => __game.chooseItem(null)); continue; }
    if (st.duel && st.dialog) {
      const i = st.duel.phase === 'reply' ? st.duel.weakIndex : st.dialog.findIndex(o => o === '[Retirarse del hilo]');
      await G(i => __game.chooseDialog(i), i < 0 ? st.dialog.length - 1 : i);
      continue;
    }
    if (st.dialog) {
      let i = FAREWELLS.map(f => st.dialog.findIndex(o => norm(o).startsWith(f))).find(x => x >= 0);
      if (i == null || i < 0) { const en = st.dialogDisabled || []; i = st.dialog.length - 1; while (en.includes(i) && i > 0) i--; }
      await G(i => __game.chooseDialog(i), i);
      continue;
    }
    return true;
  }
  return false;
}
async function teleport(room) {
  await G(async (room) => {
    const g = __game.game; g.state.room = room;
    await g.runScript(async () => { await g.enterRoom(room, null, { restore: true }); }, { label: 'fuzz' });
    const e0 = Object.values(g.room.def.entries || {})[0]; const e = Array.isArray(e0) ? { x: e0[0], y: e0[1] } : e0;
    g.player.room = room; g.player.x = e.x; g.player.y = e.y;
  }, room);
  await G(() => __game.waitIdle());
}
const snap = () => G(() => { const s = __game.state(); return { room: s.room, inv: s.inventory, flags: s.flags, objects: s.objects, actors: Object.fromEntries(Object.entries(s.actors).map(([k, a]) => [k, a.room])) }; });

// ================================================================== 1. guardar / cargar
async function saveLoad() {
  console.log('\n1. Guardar / cargar en mitad de cada acto y seguir hasta el final\n');
  await fresh();
  const CP = args.rapido ? [13, 29, 42] : [5, 9, 13, 20, 21, 25, 27, 29, 33, 34, 37, 38, 40, 42, 43];
  for (const s of STEPS) {
    if (s.n === 1) continue;
    await step(s.n);
    if (!CP.includes(s.n)) continue;
    const a = await snap();
    await G(() => __game.save(1));
    await G(() => __game.newGame());
    await G(() => __game.clearLog());
    await G(() => __game.load(1));
    await G(() => __game.load(1));                 // dos veces seguidas: nada se duplica
    const b = await snap();
    const lines = await G(() => __game.log.filter(l => l.who !== 'aviso').map(l => `${l.who}: ${l.text}`));
    const same = JSON.stringify(a) === JSON.stringify(b);
    const diff = same ? '' : ` — antes ${JSON.stringify({ room: a.room, inv: a.inv })}, después ${JSON.stringify({ room: b.room, inv: b.inv })}; flags distintos: ${Object.keys({ ...a.flags, ...b.flags }).filter(k => a.flags[k] !== b.flags[k]).join(', ')}`;
    ok(same && !lines.length, `paso ${String(s.n).padStart(2)} (${a.room}): guardar → partida nueva → cargar ×2: estado idéntico, sin escenas repetidas${diff}${lines.length ? ' — líneas tras cargar: ' + lines.slice(0, 3).join(' | ') : ''}`);
  }
  const st = await state();
  ok(st.mode === 'title' && st.finished && st.finished.flags.juego_terminado, 'tras las cargas, la partida llega al final (juego_terminado)');
}

// ================================================================== 2. perder cada duelo una vez
async function loseDuel(label) {
  const inv0 = (await state()).inventory;
  for (let k = 0; k < 8; k++) {
    await G(() => __game.waitIdle());
    const st = await state();
    if (!st.duel) break;
    if (st.duel.phase === 'reply') await G(i => __game.chooseDialog(i), st.duel.weakIndex);   // la floja del asalto (plan §7.5)
    else if (st.duel.phase === 'finisher') await R.chooseByText('[Retirarse del hilo]');
  }
  await G(() => __game.waitIdle());
  const st = await state();
  ok(st.lastDuel && ['lost', 'retired'].includes(st.lastDuel.result) && !st.duel, `${label}: se pierde (${st.lastDuel && st.lastDuel.result}) sin bloquear`);
  ok(JSON.stringify(inv0) === JSON.stringify(st.inventory), `${label}: perder no quita ni da objetos`);
  ok(await escape(), `${label}: se puede salir del diálogo tras perder`);
}
async function duels() {
  console.log('\n2. Perder cada duelo una vez y volver a intentarlo\n');
  await fresh();
  for (const s of STEPS) {
    if (s.n === 1) continue;
    if (s.n === 29) { await R.travel('ecosistema'); await R.run(['dar', 'planillo', 'maripaz_remitido']); await loseDuel('D1 Maripaz'); }
    if (s.n === 35) { await R.travel('catacumba'); await R.run(['verbo', 'hablar', 'teodoro_cuerpodoce']); await R.run(['opcion', 'Quiero firmar en tu página 7.']); await loseDuel('D2 Teodoro'); }
    if (s.n === 43) { await R.travel('office'); await R.run(['verbo', 'hablar', 'gervasio_acta']); await R.run(['opcion', 'Necesito el acta de la última reunión.']); await loseDuel('D3 Gervasio'); }
    if (s.n === 45) {
      await loseDuel('D4 Íñigo');
      await R.run(['verbo', 'hablar', 'inigo_sinergia']);
      ok(!!(await state()).duel, 'D4: Hablar con Íñigo reabre el duelo');
    }
    await step(s.n);
    if ([29, 35, 43, 45].includes(s.n)) ok(true, `paso ${s.n}: el duelo se gana al segundo intento`);
  }
  const st = await state();
  ok(st.mode === 'title' && st.finished && st.finished.flags.juego_terminado, 'con los cuatro duelos perdidos una vez, la partida llega al final');
}

// ================================================================== 3. todos los objetos con todo
const ROOMS = ['vestibulo', 'pecera', 'office', 'catacumba', 'pajarera', 'sala_amazonas', 'ecosistema', 'eventos', 'administracion', 'cpd'];
async function everyItem(tag) {
  await G(() => __game.save('fz'));
  const consumed = new Map(), stuck = [], thrown = [];
  let actions = 0;
  const reset = async (room) => { await G(() => __game.load('fz')); await G(() => __game.giveAll()); await teleport(room); };
  for (const room of (args.sala ? String(args.sala).split(',') : ROOMS)) {
    await reset(room);
    const targets = await G(() => __game.objects().filter(o => o.visible !== false).map(o => [o.kind, o.id]));
    const items = (await G(() => Object.keys(__game.game.content.items))).filter((_, i) => !args.rapido || i % 2 === 0);
    for (const [kind, id] of targets) {
      for (const item of items) for (const verb of kind === 'actor' ? ['dar', 'usar'] : ['usar']) {
        if (item === id) continue;
        const before = await snap();
        if (before.room !== room || !before.inv.includes(item)) await reset(room);
        const present = await G((id) => !!__game.objects().find(o => o.id === id && o.visible !== false), id);
        if (!present) continue;
        const e0 = await engineErrors();
        await G(([v, t, i]) => __game.doVerb(v, t, i), [verb, id, item]);
        actions++;
        if (!(await escape())) stuck.push(`${room}: ${verb} ${item} → ${id}`);
        const e1 = await engineErrors();
        if (e1 > e0) thrown.push(`${room}: ${verb} ${item} → ${id}: ${await G(() => __game.errors.filter(e => !e.warn).slice(-1)[0].msg)}`);
        const after = await snap();
        const lost = before.inv.filter(i => !after.inv.includes(i));
        for (const i of lost) { const k = `${i} ← ${verb} → ${room}.${id}`; consumed.set(k, (consumed.get(k) || 0) + 1); }
        if (lost.length || after.room !== room) await reset(room);
      }
    }
  }
  await G(() => __game.load('fz'));
  ok(!thrown.length, `${tag}: ${actions} acciones Dar/Usar sin excepciones${thrown.length ? '\n      ' + thrown.slice(0, 20).join('\n      ') : ''}`);
  ok(!stuck.length, `${tag}: siempre se puede salir del diálogo/duelo${stuck.length ? '\n      ' + stuck.join('\n      ') : ''}`);
  console.log(`    objetos que se gastan (${consumed.size}):\n      ` + ([...consumed.keys()].join('\n      ') || 'ninguno'));
  return [...consumed.keys()];
}
async function objects() {
  console.log('\n3. Dar / Usar cada objeto con cada PNJ y hotspot\n');
  await fresh();
  const at = args.rapido ? { 29: 'ACTO II' } : { 13: 'ACTO I', 29: 'ACTO II', 42: 'ACTO III' };
  for (const s of STEPS) {
    if (s.n === 1) continue;
    await step(s.n);
    if (at[s.n]) await everyItem(at[s.n]);
    if (s.n === (args.rapido ? 29 : 42)) break;
  }
}

try {
  if (!args.solo || args.solo === 'guardar') await saveLoad();
  if ((!args.solo && !args.rapido) || args.solo === 'duelos') await duels();
  if (!args.solo || args.solo === 'objetos') await objects();
} catch (e) {
  failures++;
  console.log('\n  ✗ ' + (e instanceof StepFail ? e.message : (e && e.stack || e)));
  try { const st = await state(); console.log(`    sala=${st.room} diálogo=${JSON.stringify(st.dialog)}`); } catch (_) { /* ignore */ }
}
const errs = consoleErrors.filter(e => !/doVerb: objetivo desconocido/.test(e));
if (errs.length) { failures++; console.log('\nErrores de consola:\n  ' + [...new Set(errs)].join('\n  ')); }
console.log(failures ? `\nFUZZ: ${failures} FALLOS (${checks} comprobaciones)` : `\nFUZZ: OK (${checks} comprobaciones)`);
await browser.close();
server.close();
process.exit(failures ? 1 : 0);
