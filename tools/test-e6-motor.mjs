#!/usr/bin/env node
// PRUEBA DEL PAQUETE P0 DE LA ENMIENDA E6 (motor, docs/guion2/ENMIENDA_E6.md §6.1-6.4 y §6.6), con ratón y dedo reales
// donde importa. Capturas en tools/shots/e6-motor-*.png. Cubre:
//   6.1 `cabe` del duelo (duelo de demostración `demo_cabe` con el fax de Teodoro, en la Redacción de papel): la larga y
//       la corta en el menú, `optionPairs` dice 'larga', `correctIndex` apunta a la corta; larga 1.ª vez → `noCabe`, 2.ª →
//       taunt, NINGUNA suma fallo (ni RE:, ni CC); el cuerpo enseña el corte a `max` + «—»; la corta gana; sin la pareja
//       aprendida no hay ni larga ni corta; un fallo de verdad sí cuenta; guardar a mitad y cargar → el duelo empieza de 0
//       (y la larga vuelve a dar `noCabe`); ≤ 5 líneas siempre.
//   6.2 etiqueta COMODÍN (choose con { text, tag }): en `choice.tags`, pintada en gris a la derecha, fuera de `options`.
//   6.3 N4 Mirar + clic real en Bruno de pie sobre un hotspot → Bruno («Mirar a Bruno» al pasar el ratón); con Coger, el
//       objeto de debajo (como antes).
//   6.4 N5 Hablar + clic real en el borde de un actor tapado por Bruno → el actor; con Mirar, Bruno.
//   6.6 N11 táctil a DPR 1 (844 × 390 y 800 × 360): el lienzo ocupa ≥ 97 % del alto; escritorio a DPR 1, escala entera.
//   node tools/test-e6-motor.mjs
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from './serve.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const shots = path.join(here, 'shots');
fs.mkdirSync(shots, { recursive: true });
const server = createServer(path.resolve(here, '..'));
await new Promise(r => server.listen(0, r));
const base = `http://localhost:${server.address().port}/`;
const browser = await chromium.launch();
let failures = 0, checks = 0;
const ok = (c, m) => { checks++; if (c) console.log('  ✓ ' + m); else { failures++; console.log('  ✗ ' + m); } };
const consoleErrors = [];
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const FLAGS = { intro_vista: true, torno_abierto: true, inigo_presentado: true, acto_2_iniciado: true, silla_libre: true,
  gertrudis_saludada: true, cafetera_viral: true, cafetera_viral_vista: true, chaqueta_cogida: true, chaqueta_en_lector: true };

async function open(ctxOpts = { viewport: { width: 960, height: 600 } }, room = 'pecera') {
  const ctx = await browser.newContext(ctxOpts);
  const page = await ctx.newPage();
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));
  await page.goto(base + '?room=' + room);
  await page.waitForFunction(() => window.__game && __game.state().mode === 'play');
  const G = (fn, a) => page.evaluate(fn, a);
  await G(() => { __game.skipText(true); return __game.waitIdle(); });
  await G((F) => { for (const [k, v] of Object.entries(F)) __game.setFlag(k, v); }, FLAGS);
  await G(() => __game.skipText(false));
  return { ctx, page, G };
}
const shot = (page, name) => page.screenshot({ path: path.join(shots, `e6-motor-${name}.png`) });
const until = async (G, fn, arg, ms = 8000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await G(fn, arg)) return true; await sleep(40); } return false; };
async function goto(G, room, entry) {
  await G(() => __game.skipText(true));
  await G(([r, e]) => __game.gotoRoom(r, e), [room, entry]);
  await G(() => { __game.skipSpeech(); return __game.waitIdle(); });
  await G(() => { __game.skipText(false); __game.skipSpeech(); __game.game.speeches.length = 0; });
}

try {
  // ================================================================ 6.1 + 6.2: duelo de demostración con `cabe`
  console.log('§6.1 `cabe` del duelo y §6.2 etiqueta COMODÍN (duelo de demostración en la Redacción de papel)');
  const { ctx, page, G } = await open();
  await goto(G, 'catacumba', null);
  await G(() => __game.skipText(true));                            // texto rápido: los globos no esperan (las esperas, sí)
  const CABE = { max: 38, corta: 'Tráeme el contexto.', noCabe: 'NO CABE. REPITA EN TREINTA Y OCHO.' };
  const prep = await G((CABE) => {
    const g = __game.game, D = g.content.duels, T = D.opponents.teodoro;
    D.opponents.demo_cabe = { ...T, deck: ['R09', 'R06'], finishers: [], winScore: 2, cabe: { R09: CABE },
      attackText: { ...T.attackText, R09: 'DATO SIN CONTEXTO. CONTESTA EN UNA LÍNEA: TREINTA Y OCHO CARACTERES.' },
      intro: null, onWin: null, onHit: null, onLose: null, defeatScene: null, defeatHeadline: null, defeatLine: null, defeatLines: null,
      hurtByPair: {}, taunt: ['Treinta y ocho caracteres de nada.', 'Respuesta a otro fax. Devuelto.'] };
    // aprendidas: R09, R06 y una de señuelo; el comodín sale en el primer menú (la rotación de flojas, a su sitio)
    for (const f of ['rep_09', 'rep_06', 'rep_02']) g.state.flags[f] = true;
    const pool = (D.weakReplies || []).filter(w => !w.only || [].concat(w.only).includes('demo_cabe')).length;
    g.state.flags['duel:demo_cabe:floja'] = pool;                   // el comodín es el último del grupo
    window.__duelo = g.runScript(api => api.duel('demo_cabe'), { label: 'demo cabe' });
    return { reply: D.pairs.find(p => p.id === 'R09').reply, comodin: D.comodin.text };
  }, CABE);
  const menu = () => until(G, () => { const g = __game.game; return !!(g.choice && g.duelInfo && g.duelInfo.phase === 'reply' && g.duelInfo.options); });
  const info = () => G(() => { const g = __game.game, d = g.duelInfo; return d && { options: d.options, pairs: d.optionPairs, ci: d.correctIndex, wi: d.weakIndex,
    hits: d.hits, misses: d.misses, subject: d.subject, cc: d.cc, body: d.body, attack: d.attack, tags: g.choice && g.choice.tags, chOpts: g.choice && g.choice.options }; });
  const clickOpt = async (i) => { await sleep(300); const p = await G(i => __game.optionPos(i), i); await page.mouse.click(p.x, p.y); };
  const lineas = () => G(async () => { const { wrap } = await import('./engine/font.js'); return __game.game.choice.options.reduce((n, o) => n + wrap(o, 288).length, 0); });

  ok(await menu(), 'el duelo de demostración abre su primer menú');
  let I = await info();
  const iL = I.pairs.indexOf('larga');
  ok(I.attack === 'R09' && iL >= 0 && I.options[iL] === prep.reply, `menú del ataque R09: la larga entera («${(I.options[iL] || '').slice(0, 30)}…»), optionPairs 'larga'`);
  ok(I.options[I.ci] === CABE.corta && I.pairs[I.ci] === 'R09', `correctIndex apunta a la corta («${I.options[I.ci]}»), no a la larga`);
  ok(I.options.filter(o => o === CABE.corta).length === 1 && I.pairs.filter(p => p === 'larga').length === 1, 'una larga y una corta, nada más');
  ok(await lineas() <= 5, `≤ 5 líneas en el menú (${await lineas()})`);
  // 6.2 etiqueta
  const iC = I.chOpts.indexOf(prep.comodin);
  ok(iC >= 0 && I.tags && I.tags[iC] === 'COMODÍN' && I.tags.filter(Boolean).length === 1, `el comodín lleva la etiqueta COMODÍN (tags: ${JSON.stringify(I.tags)})`);
  ok(I.options[iC] === prep.comodin && !I.options.some(o => /COMODÍN/.test(o)), 'info.options y choice.options siguen dando solo los textos');
  await sleep(250);
  const px = await G(() => {
    const g = __game.game, ch = g.choice, L = ch.layout, li = L.findIndex(l => l.tag);
    const big = g.touchUI(); const y0 = big ? 144 : 145, h = big ? 14 : 10;
    const row = y0 + (li - (ch.scroll || 0)) * h;
    const d = g.ctx.getImageData(240, row, 60, h).data; let gris = 0, gx0 = 999;
    for (let i = 0; i < d.length; i += 4) if (d[i] === 0x8a && d[i + 1] === 0x8a && d[i + 2] === 0x9a) { gris++; gx0 = Math.min(gx0, 240 + ((i / 4) % 60)); }
    const tx = L[li].text;
    return { gris, gx0, tx, li };
  });
  ok(px.gris >= 20 && px.gx0 >= 268 && px.gx0 < 296, `la etiqueta se pinta en gris #8a8a9a a la derecha de la línea del comodín (${px.gris} px desde x=${px.gx0})`);
  await shot(page, 'comodin');

  // larga, 1.ª vez (clic real) → «NO CABE…», sin fallo; el cuerpo enseña el corte
  const sub0 = I.subject, cc0 = I.cc;
  await G(() => { __game.clearLog(); __game.skipText(false); });   // con texto normal, para ver los 1,2 s del corte
  await clickOpt(iL);
  const cortado = (prep.reply.toUpperCase()).slice(0, 38) + '—';
  ok(await until(G, (c) => { const d = __game.game.duelInfo; return d && d.body === c && d.phase === 'larga'; }, cortado, 15000), `el cuerpo enseña lo que cabe: «${cortado}»`);
  await sleep(300);
  await shot(page, 'larga');
  await G(() => __game.skipText(true));
  ok(await menu(), 'tras la larga, el mismo ataque vuelve con su menú');
  I = await info();
  let log = await G(() => __game.log.map(l => l.text));
  ok(log.some(t => t.includes(CABE.noCabe)), 'larga, 1.ª vez: el rival contesta «NO CABE. REPITA EN TREINTA Y OCHO.»');
  ok(I.misses === 0 && I.hits === 0 && I.subject === sub0 && I.cc === cc0 && I.attack === 'R09', `larga, 1.ª vez: ningún fallo, ni RE: ni CC (fallos ${I.misses}, «${I.subject}»)`);
  ok(I.body === 'DATO SIN CONTEXTO. CONTESTA EN UNA LÍNEA: TREINTA Y OCHO CARACTERES.', 'el cuerpo vuelve al ataque');
  ok(I.pairs.indexOf('larga') !== iL, `la larga cambia de sitio en la ronda siguiente (${iL} → ${I.pairs.indexOf('larga')})`);
  // guardar a mitad del duelo y cargar: empieza de 0 y la larga vuelve a dar «NO CABE»
  await G(() => __game.save(7));
  await G(() => __game.load(7));
  ok(await menu(), 'cargar a mitad del duelo: se retoma el hilo desde el principio');
  I = await info();
  ok(I.attack === 'R09' && I.misses === 0 && I.hits === 0, 'tras cargar: R09 de nuevo, marcador a 0');
  await G(() => __game.clearLog());
  await clickOpt(I.pairs.indexOf('larga'));
  ok(await menu(), 'larga tras cargar: vuelve el menú');
  log = await G(() => __game.log.map(l => l.text));
  ok(log.some(t => t.includes(CABE.noCabe)), 'tras cargar, la 1.ª larga vuelve a dar «NO CABE…» (el contador no se guarda)');
  // larga, 2.ª vez → taunt, sin fallo
  await G(() => __game.clearLog());
  I = await info();
  await clickOpt(I.pairs.indexOf('larga'));
  ok(await menu(), 'larga, 2.ª vez: vuelve el menú');
  I = await info();
  log = await G(() => __game.log.map(l => l.text));
  ok(log.some(t => /TREINTA Y OCHO CARACTERES DE NADA/i.test(t)) && !log.some(t => t.includes(CABE.noCabe)), 'larga, 2.ª vez: el taunt de hoy («Treinta y ocho caracteres de nada.»)');
  ok(I.misses === 0 && I.subject === sub0, `larga, 2.ª vez: tampoco suma fallo (fallos ${I.misses})`);
  ok(await lineas() <= 5, `≤ 5 líneas con la larga y la corta (${await lineas()})`);
  // la corta gana
  await G(() => __game.clearLog());
  await clickOpt(I.ci);
  ok(await menu(), 'la corta gana: siguiente ataque');
  I = await info();
  ok(I.hits === 1 && I.misses === 0 && I.attack === 'R06', `marcador tras la corta: aciertos ${I.hits}, fallos ${I.misses}, ataque ${I.attack}`);
  ok(!I.pairs.includes('larga'), 'en un ataque sin `cabe`, no hay larga');
  // un fallo de verdad sí cuenta (fuera de orden: un señuelo)
  const wrong = I.pairs.findIndex((p, k) => k !== I.ci && p !== 'floja' && p !== 'comodin');
  const wrongI = wrong >= 0 ? wrong : I.wi;
  await clickOpt(wrongI);
  ok(await menu(), 'tras un señuelo, el duelo sigue');
  I = await info();
  ok(I.misses === 1 && I.subject !== sub0, `un señuelo sí es fallo (fallos ${I.misses}, «${I.subject}»)`);
  // R09 vuelve (el fallo movió R06 al final) o R06 sigue: ganar
  for (let k = 0; k < 4; k++) {
    I = await info(); if (!I) break;
    await clickOpt(I.ci);
    const fin = await until(G, () => !__game.game.duelInfo || (__game.game.choice && __game.game.duelInfo.phase === 'reply'));
    if (!fin || !(await G(() => !!__game.game.duelInfo))) break;
  }
  await until(G, () => !__game.game.duelInfo && !__game.game.duelActive, null, 15000); await G(() => __game.waitIdle());
  const res = await G(() => __game.game.lastDuel);
  ok(res && res.result === 'won' && res.misses === 1, `el duelo de demostración se gana (${JSON.stringify(res)})`);

  // sin la R09 aprendida: ni larga ni corta
  await G(() => { const g = __game.game; g.state.flags.rep_09 = false; window.__duelo = g.runScript(api => api.duel('demo_cabe'), { label: 'demo cabe 2' }); });
  ok(await menu(), 'sin la R09: el duelo abre');
  I = await info();
  ok(I.attack === 'R09' && !I.pairs.includes('larga') && !I.options.includes(CABE.corta) && I.ci === -1, `sin la R09 aprendida: ni larga ni corta (${JSON.stringify(I.pairs)})`);
  // salir: fallar hasta perder (la derrota no es fatal)
  for (let k = 0; k < 6; k++) {
    I = await info(); if (!I) break;
    await clickOpt(Math.max(0, I.wi));
    const fin = await until(G, () => !__game.game.duelInfo || (__game.game.choice && __game.game.duelInfo.phase === 'reply'));
    if (!fin || !(await G(() => !!__game.game.duelInfo))) break;
  }
  await until(G, () => !__game.game.duelInfo && !__game.game.duelActive, null, 15000); await G(() => __game.waitIdle());
  ok(await G(() => __game.game.lastDuel && __game.game.lastDuel.result === 'lost'), 'y se puede perder como siempre');
  await G(() => { delete __game.game.content.duels.opponents.demo_cabe; });

  // choose con `tag` fuera del duelo, línea larga: se acorta lo pintado, no lo dicho
  const largo = 'Una opción muy larga que llena la primera línea del menú de punta a punta, y que sigue en la segunda.';
  await G((t) => { window.__ch = __game.game.choose([{ text: t, tag: 'COMODÍN' }, 'Otra']); }, largo);
  await sleep(150);
  const lay = await G(async () => { const { measure } = await import('./engine/font.js'); const L = __game.game.choice.layout; return { l0: L[0].text, w0: measure(L[0].text), tag: L[0].tag, l1tag: L[1].tag, opt: __game.game.choice.options[0] }; });
  ok(lay.tag === 'COMODÍN' && !lay.l1tag && lay.l0.endsWith('…') && lay.w0 <= 288 - 27 - 4 && lay.opt === largo, `etiqueta en una opción larga: la 1.ª línea se acorta con «…» (${lay.w0} px), el texto no cambia`);
  await G(() => __game.chooseDialog(1));
  ok((await G(() => window.__ch)) === 1, 'choose con objetos { text, tag } sigue devolviendo el índice');
  await ctx.close();

  // ================================================================ 6.3 N4 y 6.4 N5 (ratón real)
  console.log('\n§6.3 N4 Mirar a Bruno sobre un hotspot · §6.4 N5 Hablar con un actor tapado por Bruno');
  const T = await open();
  await goto(T.G, 'pecera', 'ascensor');
  // Bruno de pie delante de un objeto: busca un sitio donde el centro de su caja caiga sobre un hotspot y en ningún actor
  const sitio = await T.G(() => {
    const g = __game.game, p = g.player;
    const acts = Object.values(g.actors).filter(a => a.room === g.room.def.id && a.visible && a.id !== g.G.player);
    const enActor = (x, y) => acts.some(a => { const b = g.actorBox(a); return x >= b.x - 8 && x < b.x + b.w + 8 && y >= b.y - 8 && y < b.y + b.h + 8; });
    for (const o of g.roomObjects()) {
      if (o.exit || o.poly || o.hotspot === false || !(o.w > 14 && o.h > 14) || !g.getObjState(o.id).visible) continue;
      for (let py = o.y + o.h + 30; py >= o.y + 20; py -= 2) {
        p.x = o.x + o.w / 2; p.y = py; p.path = [];
        const b = g.actorBox(p), cx = Math.round(p.x), cy = Math.round(b.y + b.h / 2);
        if (cx < 170 || cx > g.room.width - 170) break;
        const sinBruno = g.roomObjects().filter(q => g.hitObject(q, cx, cy));
        if (sinBruno.length === 1 && sinBruno[0].id === o.id && !enActor(cx, cy)) return { id: o.id, x: p.x, y: p.y, cx, cy };
      }
    }
    return null;
  });
  ok(!!sitio, `sitio de prueba: Bruno delante de «${sitio && sitio.id}»`);
  if (sitio) {
    await T.G((s) => { const g = __game.game, p = g.player; p.x = s.x; p.y = s.y; p.path = []; g.snapCamera(); window.__ex = [];
      const orig = g.execute.bind(g); g.__exOrig = orig;
      g.execute = (v, t, i) => { window.__ex.push([v, t && t.id]); return window.__exPasar ? orig(v, t, i) : Promise.resolve(); }; }, sitio);
    await sleep(100);
    const cli = async (x, y) => T.G(([x, y]) => __game.game.toClient(x - Math.round(__game.game.camX), y), [x, y]);
    const verbo = async (v) => { const vp = await T.G(v => __game.verbPos(v), v); await T.page.mouse.click(vp.x, vp.y); await sleep(80); };
    const c = await cli(sitio.cx, sitio.cy);
    await verbo('coger');
    await T.page.mouse.move(c.x, c.y); await sleep(120);
    const sCoger = await T.G(() => __game.game.sentenceText());
    await T.page.mouse.click(c.x, c.y); await sleep(200);
    let ex = await T.G(() => window.__ex.splice(0));
    ok(ex.length && ex[0][0] === 'coger' && ex[0][1] === sitio.id, `Coger + clic sobre Bruno: el objeto de debajo, como hoy («${sCoger}», ${JSON.stringify(ex)})`);
    await verbo('mirar');
    await T.page.mouse.move(c.x, c.y + 1); await sleep(40); await T.page.mouse.move(c.x, c.y); await sleep(120);
    const sMirar = await T.G(() => __game.game.sentenceText());
    ok(sMirar === 'Mirar a Bruno', `al pasar el ratón con Mirar: «${sMirar}»`);
    await shot(T.page, 'mirar-bruno');
    await T.G(() => { window.__exPasar = true; __game.clearLog(); });
    await T.page.mouse.click(c.x, c.y); await sleep(300);
    await T.G(() => __game.waitIdle());
    ex = await T.G(() => window.__ex.splice(0));
    const dice = await T.G(() => __game.log.filter(l => l.who === 'bruno').map(l => l.text));
    ok(ex.length && ex[0][0] === 'mirar' && ex[0][1] === 'bruno', `Mirar + clic real sobre Bruno delante de «${sitio.id}»: Bruno (${JSON.stringify(ex)})`);
    ok(dice.length >= 1, `y dice la meta («${(dice[0] || '').slice(0, 50)}»)`);
    await T.G(() => { window.__exPasar = false; });

    // N5: un actor detrás de Bruno; clic en el borde (dentro de la caja de Bruno, a ≤ 6 px de la del actor)
    const n5 = await T.G(() => {
      const g = __game.game, p = g.player;
      const a = Object.values(g.actors).find(a => a.room === g.room.def.id && a.visible && a.id !== g.G.player && a.def.hotspot !== false && (a.def.dialog || (a.def.handlers && a.def.handlers.hablar) || true));
      if (!a) return null;
      const pose0 = { x: a.x, y: a.y };
      p.x = a.x + 6; p.y = a.y + 3; p.path = []; g.snapCamera();
      const ab = g.actorBox(a), pb = g.actorBox(p);
      // un punto dentro de Bruno (sin los pies), fuera de la caja exacta del actor y a ≤ 6 px de ella
      for (let x = ab.x + ab.w; x < ab.x + ab.w + 6; x++) for (let y = pb.y + 4; y < pb.y + pb.h - 6; y++) {
        if (x >= pb.x && x < pb.x + pb.w && y >= ab.y && y < ab.y + ab.h) return { id: a.id, x, y, pose0 };
      }
      return { id: a.id, x: null, pose0 };
    });
    ok(n5 && n5.x != null, `sitio de N5: ${n5 && n5.id} detrás de Bruno`);
    if (n5 && n5.x != null) {
      await sleep(100);
      const c5 = await cli(n5.x, n5.y);
      console.log('    DEBUG0', JSON.stringify(await T.G(([id, x, y]) => { const g = __game.game; return { yb: g.actorBox(g.actors[id]), pb: g.actorBox(g.player), x, y }; }, [n5.id, n5.x, n5.y])));
      await verbo('hablar');
      await T.page.mouse.move(c5.x, c5.y); await sleep(120);
      const sH = await T.G(() => __game.game.sentenceText());
      await T.page.mouse.click(c5.x, c5.y); await sleep(200);
      ex = await T.G(() => window.__ex.splice(0));
      ok(ex.length && ex[0][0] === 'hablar' && ex[0][1] === n5.id, `Hablar + clic en el borde de ${n5.id} tapado por Bruno: gana el de detrás («${sH}», ${JSON.stringify(ex)})`);
      await shot(T.page, 'hablar-tapado');
      await verbo('mirar');
      console.log('    DEBUG', JSON.stringify(await T.G(([id, x, y]) => { const g = __game.game; return { yb: g.actorBox(g.actors[id]), pb: g.actorBox(g.player), x, y, path: g.actors[id].path.length, ppath: g.player.path.length, verb: g.ui.verb }; }, [n5.id, n5.x, n5.y])));
      await T.page.mouse.click(c5.x, c5.y); await sleep(200);
      ex = await T.G(() => window.__ex.splice(0));
      ok(ex.length && ex[0][1] === 'bruno', `en el mismo punto, Mirar → Bruno (${JSON.stringify(ex)})`);
      const lejos = await T.G(([x, y]) => { const g = __game.game; g.ui.verb = 'hablar'; const t = g.pickAt(x + 9 - Math.round(g.camX), y); return t && t.id; }, [n5.x, n5.y]);
      ok(lejos !== n5.id, `a más de 6 px del actor, Hablar no lo coge (${lejos})`);
    }
    await T.G(() => { const g = __game.game; g.execute = g.__exOrig; g.ui.verb = null; });
  }
  await T.ctx.close();

  // ================================================================ 6.6 N11 táctil a DPR 1
  console.log('\n§6.6 N11 resize táctil a DPR 1');
  for (const [w, h, dpr, tactil] of [[844, 390, 1, true], [800, 360, 1, true], [844, 390, 2, true], [960, 600, 1, false], [1280, 720, 1, false]]) {
    const M = await open(tactil ? { viewport: { width: w, height: h }, hasTouch: true, isMobile: true, deviceScaleFactor: dpr } : { viewport: { width: w, height: h }, deviceScaleFactor: dpr });
    await sleep(400);
    const r = await M.G(() => { const d = document.getElementById('screen') || document.querySelector('canvas'); const b = d.getBoundingClientRect();
      const st = d.parentElement, cs = getComputedStyle(st);
      const H = innerHeight - (parseFloat(cs.paddingTop) || 0) - (parseFloat(cs.paddingBottom) || 0);
      const W = innerWidth - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0);
      return { cw: d.width, ch: d.height, bh: b.height, bw: b.width, H, W, coarse: matchMedia('(pointer: coarse)').matches, dpr: devicePixelRatio }; });
    const llena = Math.max(r.bh / r.H, r.bw / r.W);
    if (tactil) ok(r.coarse && llena >= 0.97, `${w}×${h} táctil a DPR ${dpr}: el lienzo llena el ${(llena * 100).toFixed(1)} % (${Math.round(r.bw)}×${Math.round(r.bh)} de ${r.W}×${r.H})`);
    else ok(!r.coarse && r.cw % 320 === 0 && r.ch % 200 === 0, `${w}×${h} escritorio a DPR ${dpr}: escala entera (${r.cw}×${r.ch})`);
    if (tactil && dpr === 1 && w === 844) await shot(M.page, 'tactil-dpr1');
    await M.ctx.close();
  }
} catch (e) {
  failures++;
  console.log('  ✗ excepción: ' + (e && e.stack || e));
}
const errs = [...new Set(consoleErrors)];
if (errs.length) { console.log('\nErrores de consola:\n  ' + errs.join('\n  ')); failures += errs.length; }
console.log(failures ? `\nE6 MOTOR: ${failures} FALLOS (${checks} comprobaciones)` : `\nE6 MOTOR: OK (${checks} comprobaciones)`);
await browser.close();
server.close();
process.exit(failures ? 1 : 0);
