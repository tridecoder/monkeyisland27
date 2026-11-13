#!/usr/bin/env node
// PARTIDA CON RATÓN REAL (QA): juega la partida ENTERA (pasos 1-46 de la biblia §5.4: Actos I-III, los cuatro duelos,
// el clímax y el final) SOLO con
// eventos de ratón reales sobre el canvas (clic en verbo, clic en objeto / icono del inventario, clic en opciones de
// diálogo con sus flechas de scroll, clic derecho = verbo por defecto, clics para pasar los globos). `window.__game` solo
// se LEE para calcular dónde hacer clic (geometría de los hotspots) y para comprobar resultados.
// Detecta: hotspots inalcanzables o tapados por otro, puntos walkTo fuera del suelo, menús de diálogo que no caben y no
// se pueden desplazar, y entrada bloqueada (ocupado sin hablar ni andar).
// Además, AUDITORÍA DE GEOMETRÍA de TODAS las salas en cada estado de acto: para cada hotspot y PNJ visible, que su punto
// de aproximación esté en el suelo y sea alcanzable desde cada entrada de la sala, y que su área no quede tapada entera
// por otro hotspot (o PNJ).
//   node tools/play-mouse.mjs                    todo
//   node tools/play-mouse.mjs --solo=geometria   solo la auditoría      (--solo=raton: solo la partida)
//   (C) y cada PNJ con Hablar sigue visible (≥ 80 % de cabeza y torso) con Bruno de pie en su punto de conversación
//   node tools/play-mouse.mjs --lento            capturas de cada paso en tools/shots/raton-*.png
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from './serve.mjs';
import { STEPS } from './walk-data.mjs';
import { createRunner, FAREWELLS, StepFail, fail } from './walk-lib.mjs';
import { auditRoom } from './geo-audit.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const args = Object.fromEntries(process.argv.slice(2).filter(a => a.startsWith('--')).map(a => { const [k, v] = a.slice(2).split('='); return [k, v ?? true]; }));
fs.mkdirSync(path.join(here, 'shots'), { recursive: true });

const server = createServer(path.resolve(here, '..'));
await new Promise(r => server.listen(0, r));
const base = `http://localhost:${server.address().port}/`;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 960, height: 600 } });
const consoleErrors = [];
page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));
const R = createRunner(page);
const G = R.G;
const state = () => G(() => __game.state());
const wait = (ms) => page.waitForTimeout(ms);
const norm = s => String(s).toLowerCase().replace(/[«»"“”'’]/g, '').replace(/\s+/g, ' ').trim();
let failures = 0, checks = 0;
const ok = (c, m) => { checks++; if (c) console.log('  ✓ ' + m); else { failures++; console.log('  ✗ ' + m); } };

// ================================================================== AUDITORÍA DE GEOMETRÍA (en la página)
async function auditCurrentRoom(tag) {
  return G(auditRoom, { tag, estricto: !!args.estricto, kit: base + 'content/lib/kit.js' });
}
const ROOMS = ['vestibulo', 'pecera', 'office', 'catacumba', 'pajarera', 'sala_amazonas', 'ecosistema', 'eventos', 'administracion', 'cpd'];
async function auditAllRooms(tag) {
  await G(() => __game.save('geo'));
  const issues = [], warns = []; let n = 0;
  for (const room of (args.sala ? String(args.sala).split(',') : ROOMS)) {
    await G(() => __game.load('geo'));
    await G(async (room) => {
      const g = __game.game; g.state.room = room;
      await g.runScript(async () => { await g.enterRoom(room, null, { restore: true }); }, { label: 'auditoría' });
      const e0 = Object.values(g.room.def.entries || {})[0]; const e = Array.isArray(e0) ? { x: e0[0], y: e0[1] } : e0;
      g.player.room = room; g.player.x = e.x; g.player.y = e.y;
    }, room);
    await G(() => __game.waitIdle());
    const r = await auditCurrentRoom(tag);
    n += r.n; issues.push(...r.issues); warns.push(...r.avisos);
    if (args.vis) console.log(`    ${tag} ${room}: ${r.vis.join(' · ')}`);
  }
  await G(() => __game.load('geo'));
  ok(!issues.length, `${tag}: ${n} hotspots/PNJ — suelo, alcance desde cada entrada, cobertura y PNJ visibles/clicables${issues.length ? '\n      ' + issues.join('\n      ') : ''}`);
  if (warns.length) console.log(`    (${warns.length} avisos de las reglas del rediseño en salas aún no rediseñadas${args.avisos ? ':\n      ' + warns.join('\n      ') : '; --avisos para verlos'})`);
}

// ================================================================== RATÓN REAL
const SAFE = [302, 147];                 // punto del panel que nunca hace nada salvo pasar el globo (si hay uno)
async function vclick(x, y, button = 'left') {
  const p = await G(([x, y]) => __game.virtualToClient(x, y), [x, y]);
  await page.mouse.move(p.x, p.y);
  await wait(35);
  await page.mouse.click(p.x, p.y, { button });
  await wait(45);
}
let maxOptLines = 0, scrolledMenus = 0;
/** Deja correr el juego: pasa cada globo con un clic real; vuelve cuando hay opciones / selector o está libre. */
async function settle(timeout = 90000) {
  const t0 = Date.now(); let stuckSince = 0, lastLog = -1;
  while (Date.now() - t0 < timeout) {
    const s = await G(() => { const g = __game.game; return { mode: g.mode, busy: g.busy > 0 || !!g.acting, choice: !!g.choice, pick: !!g.itemPick, speaking: g.speeches.filter(x => x.blocking).length, walking: Object.values(g.actors).some(a => a.path.length), fades: g.fades.length, timers: g.timers.length, log: g.log.length, menu: !!g.menu }; });
    if (s.mode === 'ending') { await vclick(160, 100); await wait(150); continue; }
    if (s.mode !== 'play') return s;
    if (s.choice || s.pick) return s;
    if (!s.busy) { await wait(60); const s2 = await G(() => __game.game.busy || __game.game.acting || __game.game.choice); if (!s2) return s; continue; }
    if (s.speaking) { await wait(140); await vclick(...SAFE); stuckSince = 0; continue; }
    if (s.walking || s.fades || s.timers || s.log !== lastLog) { lastLog = s.log; stuckSince = 0; await wait(80); continue; }
    if (!stuckSince) stuckSince = Date.now();
    if (Date.now() - stuckSince > 12000) fail('ENTRADA BLOQUEADA: el juego está ocupado sin hablar, andar ni esperar');
    await wait(80);
  }
  fail('settle: tiempo agotado');
}
/** Un punto de pantalla (virtual) donde un clic elige exactamente este objetivo; mueve la cámara andando si hace falta. */
async function pointFor(id) {
  for (let k = 0; k < 16; k++) {          // la Redacción mide 1270 px: hasta 4-5 tramos de pantalla andando
    const r = await G((id) => {
      const g = __game.game, cam = Math.round(g.camX);
      const objs = __game.objects();
      const o = objs.find(o => o.id === id && o.visible !== false);
      if (!o) {
        const inv = g.state.inventory.indexOf(id);
        return inv >= 0 ? { inv } : { missing: true };
      }
      const cx = o.x + o.w / 2;
      if (cx - cam < 6 || cx - cam > 314) return { off: cx };
      let best = null, bd = Infinity;
      for (let y = Math.max(0, Math.floor(o.y)); y < Math.min(144, o.y + o.h); y++) for (let x = Math.max(cam, Math.floor(o.x)); x < Math.min(cam + 320, o.x + o.w); x++) {
        const t = g.pickAt(x - cam, y);
        if (t && t.id === id) { const d = Math.hypot(x - cx, y - (o.y + o.h * 0.5)); if (d < bd) { bd = d; best = [x - cam, y]; } }
      }
      return best ? { pt: best } : { covered: true };
    }, id);
    if (r.pt || r.inv != null) return r;
    if (r.missing) fail(`«${id}» no está en la sala ni en el inventario`);
    if (r.covered) fail(`«${id}» está en pantalla pero ningún píxel lo elige (tapado por otro hotspot)`);
    // fuera de pantalla: andar hacia él (clic real en el suelo, en el borde de la pantalla)
    const dest = await G((x) => { const g = __game.game, cam = Math.round(g.camX); const sx = Math.max(12, Math.min(308, x - cam)); const p = g.room.walk.nearest(sx + cam, 120); return [Math.round(p[0] - cam), Math.round(p[1])]; }, r.off);
    await vclick(dest[0], dest[1]);
    await settle();
    await wait(900);                     // la cámara alcanza al jugador
  }
  fail(`no consigo poner «${id}» en pantalla`);
}
async function clickInventory(item) {
  for (let k = 0; k < 10; k++) {
    const r = await G((item) => {
      const g = __game.game, L = { invX: 181, invY: 156, cellW: 34, cellH: 21, cols: 4, rows: 2 };
      const idx = g.state.inventory.indexOf(item); if (idx < 0) return { missing: true };
      const row = Math.floor(idx / L.cols);
      if (row < g.ui.invScroll) return { arrow: [169, 165] };
      if (row >= g.ui.invScroll + L.rows) return { arrow: [169, 188] };
      return { pt: [L.invX + (idx % L.cols) * L.cellW + 17, L.invY + (row - g.ui.invScroll) * L.cellH + 10] };
    }, item);
    if (r.missing) fail(`${item} no está en el inventario`);
    if (r.pt) { await vclick(...r.pt); return; }
    await vclick(...r.arrow);
  }
  fail(`no consigo ver ${item} en el inventario (flechas)`);
}
async function clickVerb(v) { const p = await G(v => { const i = __game.game.verbs.findIndex(x => x.id === v); return [[6, 57, 107][Math.floor(i / 3)] + 10, [157, 171, 185][i % 3] + 6]; }, v); await vclick(...p); }
async function clickTarget(id, button = 'left') {
  const r = await pointFor(id);
  if (r.inv != null) { await clickInventory(id); return; }
  await vclick(r.pt[0], r.pt[1], button);
}
async function verbOn(v, id) {
  await settle();
  await pointFor(id).catch(() => {});    // primero poner el objetivo en pantalla (andar con un clic cancela el verbo)
  await clickVerb(v); await clickTarget(id); await settle();
}
async function itemOn(v, item, id) {
  await settle();
  await pointFor(id).catch(() => {});    // primero poner el objetivo en pantalla (andar puede cancelar la selección)
  await clickVerb(v); await clickInventory(item);
  const sel = await G(() => __game.game.ui.item);
  if (sel !== item) fail(`al hacer clic en ${item} no queda seleccionado (ui.item = ${sel})`);
  await clickTarget(id);
  await settle();
}
/** Elegir una opción de diálogo por texto: desplaza el menú con sus flechas (clic real) si no cabe. */
async function chooseOption(want) {
  await settle();
  for (let k = 0; k < 30; k++) {
    const r = await G((want) => {
      const g = __game.game, ch = g.choice; if (!ch) return { none: true };
      const nrm = s => String(s).toLowerCase().replace(/[«»"“”'’]/g, '').replace(/\s+/g, ' ').trim();
      const i = ch.options.findIndex(o => nrm(o).includes(nrm(want)));
      if (i < 0) return { notfound: ch.options };
      if (ch.disabled.has(i)) return { disabled: true };
      const lines = ch.layout; if (!lines) return { wait: true };
      const li = lines.findIndex(l => l.opt === i);
      const sc = ch.scroll || 0;
      if (li < sc) return { arrow: [310, 152], lines: lines.length };
      if (li >= sc + 5) return { arrow: [310, 186], lines: lines.length };
      return { pt: [24, 145 + (li - sc) * 10 + 6], lines: lines.length, scrolled: sc > 0 };
    }, want);
    if (r.none) fail(`no hay opciones en pantalla para «${want}»`);
    if (r.notfound) fail(`no existe la opción «${want}»: ${JSON.stringify(r.notfound)}`);
    if (r.disabled) fail(`la opción «${want}» está deshabilitada`);
    if (r.wait) { await wait(60); continue; }
    maxOptLines = Math.max(maxOptLines, r.lines);
    if (r.pt) { if (r.scrolled) scrolledMenus++; await vclick(...r.pt); await settle(); return; }
    await vclick(...r.arrow);
  }
  fail(`no consigo llegar a la opción «${want}» con las flechas`);
}
async function closeDialogMouse() {
  for (let k = 0; k < 6; k++) {
    await settle();
    const opts = await G(() => __game.currentDialogOptions());
    if (!opts) return;
    const f = FAREWELLS.map(f => opts.find(o => norm(o).startsWith(f))).find(Boolean);
    if (!f) fail('no encuentro una despedida: ' + JSON.stringify(opts));
    await chooseOption(f);
  }
}
async function travelMouse(to) {
  for (let hop = 0; hop < 8; hop++) {
    const next = await G((to) => {
      const g = __game.game, rooms = g.content.rooms, from = g.state.room;
      if (from === to) return null;
      const lifts = Object.entries(rooms).map(([rid, r]) => [rid, (r.objects || []).find(o => o.ascensor)]).filter(([, o]) => o);
      const edges = (r0) => { const out = []; for (const o of rooms[r0].objects || []) { if (o.exit) out.push([o.exit.room, o.id, null]); if (o.ascensor) for (const [rid, lo] of lifts) if (rid !== r0) out.push([rid, o.id, lo.ascensor.label]); } return out; };
      const prev = { [from]: null }, q = [from];
      while (q.length) { const r0 = q.shift(); for (const [d, id, label] of edges(r0)) if (!(d in prev)) { prev[d] = [r0, id, label]; q.push(d); } }
      let r1 = to; while (prev[r1] && prev[r1][0] !== from) r1 = prev[r1][0];
      return prev[r1] ? { id: prev[r1][1], label: prev[r1][2] } : 'NO';
    }, to);
    if (next === null) return;
    if (next === 'NO') fail(`sin camino a ${to}`);
    const before = (await state()).room;
    await settle();
    await clickTarget(next.id);          // sin verbo: «Ir a»
    await settle();
    if (next.label) await chooseOption(next.label);   // el ascensor: botonera con clic real
    if ((await state()).room === before) fail(`la salida ${next.id} de ${before} no me ha llevado a ninguna parte`);
  }
}
async function duelMouse(seq) {
  const pairs = await G(() => Object.fromEntries(__game.game.content.duels.pairs.map(p => [p.id, p.reply])));
  let i = 0;
  for (let guard = 0; guard < 60; guard++) {
    const s = await settle();
    const st = await state();
    if (!st.duel) { if (i < seq.length) fail(`el duelo acabó tras ${i} jugadas`); return; }
    if (st.pickItem) { await clickInventory(seq[i - 1].objeto); continue; }
    if (!st.dialog) { void s; continue; }
    const want = seq[i];
    if (st.duel.phase === 'reply') {
      if (st.duel.attack !== want) fail(`el rival ataca con ${st.duel.attack}; tocaba ${want}`);
      await chooseOption(pairs[want]); i++;
    } else if (st.duel.phase === 'finisher') { await chooseOption('[Usar objeto]'); i++; }
  }
  fail('el duelo no termina');
}
async function runMouse(a) {
  const [k, x, y] = a;
  if (k === 'ir') return travelMouse(x);
  if (k === 'verbo') return verbOn(x, y);
  if (k === 'usar' || k === 'dar') return itemOn(k, x, y);
  if (k === 'opcion') return chooseOption(x);
  if (k === 'cerrar') return closeDialogMouse();
  if (k === 'duelo') return duelMouse(x);
  fail('acción desconocida ' + JSON.stringify(a));
}

// ================================================================== guion
try {
  await page.goto(base);
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) { /* ignore */ } });
  await page.reload();
  await page.waitForFunction(() => !!window.__game);
  await wait(400);

  if (!args.solo || args.solo === 'raton') {
    console.log('Partida con ratón real: pasos 1-46 (la partida entera)\n');
    // título: clic real en «Nueva partida»
    const it = await G(() => { const it = __game.game.titleLayout[0]; return [it.x + 8, it.y + 5]; });
    await vclick(...it);
    await settle(120000);
    await R.check(STEPS[0].esp);
    ok(true, ' 1 intro vista pasando los globos con clics');
    // clic derecho = verbo por defecto (Hablar con Celestino) y salir del diálogo
    await clickTarget('celestino', 'right');
    await settle();
    ok(!!(await state()).dialog, 'clic derecho en Celestino abre su diálogo (verbo por defecto: Hablar)');
    await closeDialogMouse();
    // geografía del vestíbulo: con el torno cerrado, el ascensor y la escalera están al otro lado (clics reales)
    const inner = async () => G(() => { const g = __game.game, p = g.player, b = g.room.walk.boxes.find(b => b.id === 'interior'); const P = b.poly; let ins = false;
      for (let i = 0, j = P.length - 1; i < P.length; j = i++) if ((P[i][1] > p.y) !== (P[j][1] > p.y) && p.x < (P[j][0] - P[i][0]) * (p.y - P[i][1]) / (P[j][1] - P[i][1]) + P[i][0]) ins = !ins; return ins; });
    await vclick(290, 128); await settle(); await wait(2500);
    ok(!(await inner()), 'clic real en la moqueta de detrás de los tornos: Bruno se queda del lado de la calle');
    await clickTarget('ascensor_vestibulo'); await settle();
    ok(!(await inner()) && !(await G(() => __game.currentDialogOptions())) && (await state()).room === 'vestibulo', 'clic real en el ascensor antes de abrir el torno: no llega, no hay botonera');
    await clickTarget('vestibulo_a_redaccion'); await settle();
    ok(!(await inner()) && (await state()).room === 'vestibulo', 'clic real en la escalera de la Redacción antes de abrir el torno: no llega');
    for (const s of STEPS.filter(s => s.n >= 2)) {
      for (const a of s.acc) await runMouse(a);
      await settle();
      await R.check(s.esp);
      ok(true, `${String(s.n).padStart(2)} [${s.sala}] ${s.txt}`);
      if (s.n === 7) {                   // torno abierto: ahora sí se llega al ascensor andando (clic real)
        await clickTarget('ascensor_vestibulo'); await settle();
        ok(await inner() && !!(await G(() => __game.currentDialogOptions())), 'torno abierto: clic real en el ascensor → Bruno cruza el carril y se abre la botonera');
        await chooseOption('Nada, me quedo en esta planta.');
      }
      if (s.n === 16) {                  // clic derecho sobre una salida = Ir a (y vuelta, con clics)
        await settle();
        const r0 = (await state()).room;
        await clickTarget('catacumba_a_pecera', 'right'); await settle();
        ok((await state()).room === 'pecera' && r0 === 'catacumba', 'clic derecho en una salida = «Ir a» (Redacción de papel → Redacción)');
        await travelMouse('catacumba');
      }
      if (args.lento) await page.screenshot({ path: path.join(here, 'shots', `raton-${String(s.n).padStart(2, '0')}.png`) });
    }
    ok(maxOptLines > 5 && scrolledMenus > 0, `menús más largos que el panel se desplazan con sus flechas (máx. ${maxOptLines} líneas; ${scrolledMenus} elecciones tras desplazar)`);
    ok(true, 'partida COMPLETA con el ratón: Actos I-III, los cuatro duelos, el clímax, el epílogo y los créditos');
  }

  if (!args.solo || args.solo === 'conexiones') {
    // CONEXIONES: cada salida de cada sala (y cada parada del ascensor) con un clic real; se llega a la sala que dice la
    // salida, en su entrada (la que se llama como la sala de origen), y esa entrada está junto a la salida de vuelta
    console.log('\nConexiones (clic real en cada salida, Acto III con Rubén libre)\n');
    await page.goto(base);
    await page.waitForFunction(() => !!window.__game);
    await G(() => __game.skipText(true));
    await R.startDismisser();
    await G(() => __game.newGame());
    for (const s of STEPS.filter(s => s.n > 1 && s.n <= 42)) { for (const a of s.acc) await R.run(a); await G(() => __game.waitIdle()); await R.check(s.esp); }
    await G(() => { clearInterval(window.__dismisser); window.__dismisser = null; });
    const exits = await G(() => { const out = []; for (const [rid, r] of Object.entries(__game.game.content.rooms)) for (const o of r.objects || []) { if (o.exit) out.push({ room: rid, id: o.id, to: o.exit.room, entry: o.exit.entry || rid }); if (o.ascensor) out.push({ room: rid, id: o.id, lift: true }); } return out; });
    const lifts = exits.filter(e => e.lift);
    const malC = [];
    for (const e of exits) {
      const dests = e.lift ? lifts.filter(l => l.room !== e.room).map(l => ({ to: l.room, entry: 'ascensor' })) : [{ to: e.to, entry: e.entry }];
      for (const d of dests) {
        await G(() => __game.skipText(true));
        try { await R.travel(e.room); }
        catch (err) {   // la lógica no deja entrar ahora (la Sala, con la reunión en curso): se entra directamente
          await G(async (room) => { const g = __game.game; await g.runScript(async () => { await g.enterRoom(room, Object.keys(g.content.rooms[room].entries || {})[0]); }, { label: 'conexiones' }); }, e.room);
        }
        await G(() => __game.waitIdle()); await G(() => __game.skipText(false));
        await settle();
        await clickTarget(e.id);
        await settle();
        if (e.lift) { const label = await G((to) => (__game.game.content.rooms[to].objects.find(o => o.ascensor) || {}).ascensor.label, d.to); await chooseOption(label); }
        await settle();
        const r = await G(({ d, from }) => {
          const g = __game.game, p = g.player, def = g.room.def;
          const en = (def.entries || {})[d.entry]; const ep = Array.isArray(en) ? en : en ? [en.x, en.y] : null;
          // la salida de vuelta: la que lleva a la sala de origen (o el ascensor)
          // (si hay varias —el torno y la escalera del vestíbulo—, la más cercana)
          const cands = (def.objects || []).filter(o => (d.entry === 'ascensor' ? o.ascensor : o.exit && o.exit.room === from)).map(o => { const ap = g.approachPoint(g.objectTarget(o)); return { o, ap, d: Math.hypot(ap.x - p.x, ap.y - p.y) }; }).sort((a, b) => a.d - b.d);
          const back = cands.length ? cands[0].o : null; const ap = cands.length ? cands[0].ap : null;
          return { room: g.state.room, at: [Math.round(p.x), Math.round(p.y)], ep, back: back && back.id, ap: ap && [Math.round(ap.x), Math.round(ap.y)], inside: g.room.walk.inside(p.x, p.y) };
        }, { d, from: e.room });
        const tag = `${e.room} —${e.id}${e.lift ? ' → ' + d.to : ''}→ ${r.room}`;
        if (r.room === e.room && !e.lift) { console.log(`    ${tag}: cerrada ahora por la lógica (se comprueba en la partida)`); continue; }
        const errs = [];
        if (r.room !== d.to) errs.push(`llega a ${r.room}, la salida dice ${d.to}`);
        if (!r.ep) errs.push(`${d.to} no tiene la entrada '${d.entry}'`);
        else if (Math.hypot(r.at[0] - r.ep[0], r.at[1] - r.ep[1]) > 12) errs.push(`aparece en ${r.at} y la entrada '${d.entry}' es ${r.ep}`);
        if (!r.inside) errs.push(`aparece fuera del suelo (${r.at})`);
        if (!r.back) errs.push(`${d.to} no tiene salida de vuelta a ${e.room}`);
        else if (r.ap && Math.hypot(r.at[0] - r.ap[0], r.at[1] - r.ap[1]) > 40) errs.push(`aparece a ${Math.round(Math.hypot(r.at[0] - r.ap[0], r.at[1] - r.ap[1]))} px de la salida de vuelta «${r.back}» (${r.ap})`);
        if (errs.length) malC.push(`${tag}: ${errs.join('; ')}`);
        else console.log(`    ${tag} en ${r.at} (vuelta «${r.back}» en ${r.ap})`);
      }
    }
    ok(!malC.length, `conexiones: ${exits.filter(e => !e.lift).length} salidas y ${lifts.length}×${lifts.length - 1} viajes en ascensor con clic real${malC.length ? '\n      ' + malC.join('\n      ') : ''}`);
  }

  if (!args.solo || args.solo === 'geometria') {
    console.log('\nAuditoría de geometría (todas las salas, en cada acto)\n');
    await page.goto(base);
    await page.waitForFunction(() => !!window.__game);
    await G(() => __game.skipText(true));
    await R.startDismisser();
    await G(() => __game.newGame());
    const cps = [[8, 'ACTO I (tras 7.2)'], [16, 'ACTO II (inicio)'], [29, 'ACTO II (tras D1)'], [37, 'ACTO III (inicio)'], [39, 'ACTO III (Rubén en el armario)'], [42, 'ACTO III (Rubén libre)']];
    let done = 1;
    for (const [n, tag] of cps) {
      for (const s of STEPS.filter(s => s.n > done && s.n <= n)) { for (const a of s.acc) await R.run(a); await G(() => __game.waitIdle()); await R.check(s.esp); }
      done = n;
      await auditAllRooms(tag);
    }
  }
} catch (e) {
  failures++;
  console.log('\n  ✗ ' + (e instanceof StepFail ? e.message : (e && e.stack || e)));
  try { const st = await state(); console.log(`    sala=${st.room} diálogo=${JSON.stringify(st.dialog)} frase=${st.sentence}`); } catch (_) { /* ignore */ }
  try { await page.screenshot({ path: path.join(here, 'shots', 'raton-fallo.png') }); console.log('    captura: tools/shots/raton-fallo.png'); } catch (_) { /* ignore */ }
}
if (consoleErrors.length) { failures++; console.log('\nErrores de consola:\n  ' + consoleErrors.join('\n  ')); }
console.log(failures ? `\nPLAY-MOUSE: ${failures} FALLOS (${checks} comprobaciones)` : `\nPLAY-MOUSE: OK (${checks} comprobaciones)`);
await browser.close();
server.close();
process.exit(failures ? 1 : 0);
