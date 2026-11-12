// Acciones del walkthrough (ir, verbo, usar, dar, opcion, cerrar, duelo) y comprobación de resultados esperados.
// Uso: const R = createRunner(page); await R.run(['verbo','mirar','tablon']); await R.check({ flags: [...] });
// AVISOS AUTOMÁTICOS (adenda §2: llamadas de Evaristo, «RV:» de Tadeo, que salen al entrar en una sala): `startDismisser`
// cierra su globo (como un clic) en cuanto `state().aviso` es true, de modo que el test los acepta y sigue.
export class StepFail extends Error {}
export const fail = (msg) => { throw new StepFail(msg); };
export const FAREWELLS = ['nada, celestino', 'nada, aurora', 'nada. me iba', 'nada, ya me voy', 'nada, solo miraba', 'me voy', 'ahora vuelvo', 'lo pienso y vuelvo', 'gracias, begoña', 'prometo cuidarlo', 'nada'];
export function createRunner(page) {
  const G = (fn, arg) => page.evaluate(fn, arg);
  const state = () => G(() => __game.state());
  const norm = s => String(s).toLowerCase().replace(/[«»"“”'’]/g, '').replace(/\s+/g, ' ').trim();

async function options() { return G(() => __game.currentDialogOptions()); }
async function chooseByText(want) {
  const opts = await options();
  if (!opts) fail(`no hay opciones de diálogo en pantalla para elegir «${want}» (¿diálogo sin implementar?)`);
  const i = opts.findIndex(o => norm(o).includes(norm(want)));
  if (i < 0) fail(`no existe la opción «${want}». Opciones: ${JSON.stringify(opts)}`);
  await G(i => __game.chooseDialog(i), i);
}
async function closeDialog() {
  for (let k = 0; k < 6; k++) {
    const st = await state();
    if (st.duel) fail('hay un duelo abierto donde se esperaba cerrar el diálogo');
    const opts = st.dialog;
    if (!opts) return;
    const i = FAREWELLS.map(f => opts.findIndex(o => norm(o).startsWith(f))).find(x => x >= 0);
    if (i == null || i < 0) fail(`no encuentro una despedida para salir del diálogo. Opciones: ${JSON.stringify(opts)}`);
    await G(i => __game.chooseDialog(i), i);
  }
  fail('el diálogo no se cierra');
}
async function travel(to) {
  const r = await G(async (to) => {
    const g = __game.game, rooms = g.content.rooms;
    const from = g.state.room;
    if (from === to) return { ok: true, path: [] };
    // BFS over `exit:` hotspots
    const prev = { [from]: null }; const q = [from];
    while (q.length) {
      const r0 = q.shift();
      for (const o of rooms[r0].objects || []) if (o.exit && !(o.exit.room in prev)) { prev[o.exit.room] = [r0, o.id]; q.push(o.exit.room); }
    }
    if (!(to in prev)) return { ok: false, msg: `no hay camino de salidas de ${from} a ${to}` };
    const path = []; for (let r1 = to; prev[r1]; r1 = prev[r1][0]) path.unshift(prev[r1]);
    for (const [r0, exit] of path) {
      if (g.state.room !== r0) return { ok: false, msg: `esperaba estar en ${r0} y estoy en ${g.state.room}` };
      await __game.doVerb('ir', exit);
      if (__game.currentDialogOptions()) return { ok: true, dialog: true, path };
      if (g.state.room === r0) return { ok: false, msg: `la salida ${exit} de ${r0} no lleva a ninguna parte (¿bloqueada?)` };
    }
    return { ok: g.state.room === to, msg: `acabé en ${g.state.room}`, path };
  }, to);
  if (!r.ok) fail(r.msg);
}
async function playDuel(seq) {
  const pairs = await G(() => Object.fromEntries(__game.game.content.duels.pairs.map(p => [p.id, p.reply])));
  let i = 0;
  for (let guard = 0; guard < 80; guard++) {
    const st = await state();
    if (!st.duel) {
      if (i < seq.length) fail(`el duelo terminó (resultado: ${st.lastDuel && st.lastDuel.result}) tras ${i} de ${seq.length} jugadas`);
      return;
    }
    if (!st.dialog && !st.pickItem) { await page.waitForTimeout(30); continue; }
    const want = seq[i];
    if (want === undefined) fail(`el duelo sigue tras las ${seq.length} jugadas previstas (fase ${st.duel.phase})`);
    if (st.duel.phase === 'reply') {
      if (typeof want !== 'string') fail(`se esperaba un remate (objeto ${want.objeto}) y el rival ataca con ${st.duel.attack}`);
      if (st.duel.attack !== want) fail(`el rival ataca con ${st.duel.attack}; según la biblia tocaba ${want} (orden del mazo, §6.4)`);
      const k = st.dialog.findIndex(o => o === pairs[want]);
      if (k < 0) fail(`la réplica de ${want} no está en el menú (¿no se aprendió? flag rep_${want.slice(1)}). Menú: ${JSON.stringify(st.dialog)}`);
      await G(k => __game.chooseDialog(k), k);
      i++;
    } else if (st.duel.phase === 'finisher') {
      if (typeof want === 'string') fail(`llegó un remate y se esperaba el ataque ${want}`);
      await chooseByText('[Usar objeto]');
      if (!(await state()).pickItem) fail('[Usar objeto] no abrió el selector de objetos');
      const has = (await state()).inventory.includes(want.objeto);
      if (!has) fail(`el remate necesita ${want.objeto} y no está en el inventario`);
      await G(id => __game.chooseItem(id), want.objeto);
      i++;
    } else if (st.pickItem) {
      fail('selector de objetos abierto fuera de un remate');
    } else await page.waitForTimeout(30);
  }
  fail('el duelo no termina');
}
async function run(a) {
  const [k, x, y, z] = a;
  if (k === 'ir') return travel(x);
  if (k === 'verbo' || k === 'usar' || k === 'dar') {
    const verb = k === 'verbo' ? x : k;
    const target = k === 'verbo' ? y : y;
    const item = k === 'verbo' ? null : x;
    if (item && !(await state()).inventory.includes(item)) fail(`${item} no está en el inventario`);
    const okv = await G(([v, t, i]) => __game.doVerb(v, t, i), [verb, target, item]);
    if (okv === false) fail(`«${verb} ${item ? item + ' → ' : ''}${target}»: el objetivo no existe o no está en esta sala (${(await state()).room})`);
    return;
  }
  if (k === 'opcion') return chooseByText(x);
  if (k === 'cerrar') return closeDialog();
  if (k === 'duelo') return playDuel(x);
  void z;
  fail('acción desconocida ' + JSON.stringify(a));
}
async function check(esp) {
  let st = await state();
  // tras el final (api.ending) el juego vuelve al título: se comprueba la partida terminada (__game.state().finished)
  if (st.mode === 'title' && st.finished) st = { ...st, ...st.finished };
  const errs = [];
  if (esp.sala && st.room !== esp.sala) errs.push(`sala: ${st.room}, se esperaba ${esp.sala}`);
  const flags = Array.isArray(esp.flags) ? Object.fromEntries(esp.flags.map(f => [f, true])) : (esp.flags || {});
  for (const [f, v] of Object.entries(flags)) if (st.flags[f] !== v) errs.push(`flag ${f} = ${JSON.stringify(st.flags[f])}, se esperaba ${JSON.stringify(v)}`);
  for (const i of esp.tiene || []) if (!st.inventory.includes(i)) errs.push(`falta ${i} en el inventario`);
  for (const i of esp.notiene || []) if (st.inventory.includes(i)) errs.push(`${i} sigue en el inventario (debía gastarse)`);
  if (errs.length) fail(errs.join('; '));
}


  async function startDismisser() {
    await page.evaluate(() => { if (window.__dismisser) return; window.__dismisser = setInterval(() => { try { if (__game.state().aviso) __game.skipSpeech(); } catch (e) { /* ignore */ } }, 120); });
  }
  return { run, check, state, travel, chooseByText, closeDialog, playDuel, startDismisser, G, norm };
}
