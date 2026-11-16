#!/usr/bin/env node
// PRUEBA DEL PAQUETE PD DE LA ENMIENDA E6 (Papel y Despachos: docs/guion2/ENMIENDA_E6.md §10, fila PD), con RATÓN REAL.
//   · §5.1 D2 · Teodoro a tres asaltos: Hablar con Teodoro (verbo y PNJ con clic), la opción del duelo con clic, R06 y R02
//     con clic; en el tercer ataque (R09) el menú trae la larga y la corta; la larga (clic) enseña el corte a 38 en el
//     cuerpo, Teodoro contesta «NO CABE…» y el marcador de fallos sigue a 0; guardar a mitad del duelo y cargar (el
//     duelo vuelve a empezar y la 1.ª larga vuelve a dar «NO CABE…»); 2.ª larga → el taunt, sin fallo; la corta gana y
//     suena «...CABE.» (y ya no tras la R02); marcador «ACIERTOS 3/3»; remate con el manual (clic en [Usar objeto] y en el
//     inventario) → firma. Perder con señuelos (la larga en otro ataque SÍ es fallo); sin la R09: aviso `notReady`, ni
//     larga ni corta, y la abuela (nivel 2) da `DONDE.rep_09`. Fuera de orden: sin papel no hay duelo; la ficha antes de
//     ganar, «Gánatela».
//   · §5.2 D3 · Gervasio a dos asaltos: R07 (clic) → su línea; segundo ataque «El acta se necesitaba para... para...»; la
//     R03 (clic) gana y entra el remate sin línea de en medio; «ACIERTOS 2/2»; fotocopia (clic) → acta. Antes del Acto III,
//     sin duelo.
//   · Textos: las 40 filas de §4.1 de catacumba.js y pajarera.js (ninguna «actual» queda en el fichero, todas las nuevas
//     están), B4 (escena de la chaqueta sin la línea de Bruno), B5 (pósit azul, una línea), E177 (Hablar con el Lector
//     con Gervasio delante: sin su comentario; la opción M25 sigue), X1, X4 y una muestra jugada.
//   Capturas: tools/shots/e6-pd-*.png.      node tools/test-e6-pd.mjs
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from './serve.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const shots = path.join(here, 'shots');
fs.mkdirSync(shots, { recursive: true });
const server = createServer(root);
await new Promise(r => server.listen(0, r));
const base = `http://localhost:${server.address().port}/`;
const browser = await chromium.launch();
let failures = 0, checks = 0;
const ok = (c, m) => { checks++; if (c) console.log('  ✓ ' + m); else { failures++; console.log('  ✗ ' + m); } };
const consoleErrors = [];
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const page = await browser.newPage({ viewport: { width: 960, height: 600 } });
page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));
await page.goto(base + '?room=pecera');
await page.waitForFunction(() => window.__game && __game.state().mode === 'play');
const G = (fn, a) => page.evaluate(fn, a);
const idle = () => G(() => __game.waitIdle());
const flag = (k) => G(k => __game.getFlag(k), k);
const clearLog = () => G(() => __game.clearLog());
const logHas = (t) => G(t => __game.log.some(l => String(l.text).includes(t)), t);
const logCount = (t) => G(t => __game.log.filter(l => String(l.text).includes(t)).length, t);
const logTexts = () => G(() => __game.log.map(l => String(l.text)));
const shot = (name) => page.screenshot({ path: path.join(shots, `e6-pd-${name}.png`) });
const until = async (fn, arg, ms = 15000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await G(fn, arg)) return true; await sleep(40); } return false; };
const inv = () => G(() => __game.state().inventory);

const BASE = { intro_vista: true, torno_abierto: true, inigo_presentado: true, gertrudis_saludada: true, cafetera_viral: true,
  cafetera_viral_vista: true, abuela_viral: true, chaqueta_cogida: true, silla_libre: true, chaqueta_en_lector: true };
async function partida(room, flags = {}, items = []) {
  await G(() => __game.skipText(true));
  await G(() => __game.newGame());
  await G(([F, I]) => { for (const [k, v] of Object.entries(F)) __game.setFlag(k, v); for (const i of I) __game.giveItem(i); }, [{ ...BASE, ...flags }, items]);
  await G(r => __game.gotoRoom(r), room);
  await G(() => { __game.skipSpeech(); return __game.waitIdle(); });
  await G(() => { __game.skipText(false); __game.skipSpeech(); __game.game.speeches.length = 0; });
  await clearLog();
}
async function verb(v, t, i) {
  await G(() => __game.skipText(true));
  await G(([v, t, i]) => __game.doVerb(v, t, i), [v, t, i || null]);
  await idle();
  await G(() => __game.skipText(false));
}

// ------------------------------------------------------------------ ratón real
async function vclick(x, y) {
  const p = await G(([x, y]) => __game.virtualToClient(x, y), [x, y]);
  await page.mouse.move(p.x, p.y); await sleep(40);
  await page.mouse.click(p.x, p.y); await sleep(50);
}
async function clickClient(p) { await page.mouse.move(p.x, p.y); await sleep(40); await page.mouse.click(p.x, p.y); await sleep(50); }
async function clickVerb(v) { await clickClient(await G(v => __game.verbPos(v), v)); }
async function pointFor(id) {
  return G((id) => {
    const g = __game.game, cam = Math.round(g.camX);
    const o = __game.objects().find(o => o.id === id && o.visible !== false);
    if (!o) return null;
    const cx = o.x + o.w / 2, cy = o.y + o.h / 2;
    let best = null, bd = Infinity;
    for (let y = Math.max(0, Math.floor(o.y)); y < Math.min(144, o.y + o.h); y++) for (let x = Math.max(cam, Math.floor(o.x)); x < Math.min(cam + 320, o.x + o.w); x++) {
      const t = g.pickAt(x - cam, y);
      if (t && t.id === id) { const d = Math.hypot(x - cx, y - cy); if (d < bd) { bd = d; best = [x - cam, y]; } }
    }
    return best;
  }, id);
}
/** Verbo con clic y objetivo con clic. */
async function clicVerboEn(v, id) {
  const p = await pointFor(id);
  if (!p) throw new Error(`no se puede apuntar a ${id} con el ratón`);
  await clickVerb(v);
  await vclick(...p);
}
/** Opción i del menú en pantalla, con clic real. */
async function clickOpt(i) { await sleep(250); await clickClient(await G(i => __game.optionPos(i), i)); }
async function clickOptText(sub) {
  if (!(await until(t => !!__game.game.choice && __game.game.choice.options.some(o => o.includes(t)), sub))) throw new Error(`no sale la opción «${sub}»`);
  const i = await G(t => __game.game.choice.options.findIndex(o => o.includes(t)), sub);
  await clickOpt(i);
}
/** Espera a un menú de réplica del duelo (o al remate, o al final). */
const menuD = () => until(() => { const g = __game.game, d = g.duelInfo; return !d ? !!g.lastDuel && !g.duelActive : !!(g.choice && (d.phase === 'reply' || d.phase === 'finisher') && (d.options || d.phase === 'finisher')); }, null, 30000);
const info = () => G(() => { const d = __game.game.duelInfo; return d && { phase: d.phase, attack: d.attack, options: d.options, pairs: d.optionPairs, ci: d.correctIndex, wi: d.weakIndex,
  hits: d.hits, misses: d.misses, subject: d.subject, score: d.score, body: d.body }; });
/** Remate: [Usar objeto] con clic y el objeto con clic en el inventario. */
async function rematar(obj) {
  await clickOptText('[Usar objeto]');
  if (!(await until(() => !!__game.game.itemPick))) throw new Error('[Usar objeto] no abre el selector');
  await sleep(200);
  await clickClient(await G(id => __game.invPos(id), obj));
}
/** Pasa los globos con clic hasta que el juego quede quieto (o haya menú). */
async function settle(ms = 40000) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    const s = await G(() => { const g = __game.game; return { busy: g.busy > 0 || !!g.acting, choice: !!g.choice, sp: g.speeches.filter(x => x.blocking).length }; });
    if (s.choice) return;
    if (!s.busy && !s.sp) { await sleep(80); if (!(await G(() => __game.game.busy || __game.game.acting))) return; continue; }
    if (s.sp) { await sleep(250); await vclick(302, 147); continue; }
    await sleep(80);
  }
  throw new Error('settle: tiempo agotado');
}

const FAX = 'TEODORO (fax): ';
const ATQ_R09 = 'DATO SIN CONTEXTO. CONTESTA EN UNA LÍNEA: TREINTA Y OCHO CARACTERES.';
const CORTA = 'Tráeme el contexto.';
const NO_CABE = 'NO CABE. REPITA EN TREINTA Y OCHO.';
const TAUNT = 'TREINTA Y OCHO CARACTERES DE NADA.';
const D2_FLAGS = { acto_2_iniciado: true, aurora_conto_pasos: true, fax_con_papel: true, rep_06: true, rep_02: true, rep_09: true, rep_07: true, rep_03: true };

/** Abre D2 con ratón real: Hablar + clic en Teodoro, y la opción del duelo con clic. */
async function abrirD2() {
  await clicVerboEn('hablar', 'teodoro_cuerpodoce');
  await clickOptText('Quiero firmar en tu página 7.');
  return menuD();
}

try {
  const pairs = await G(() => Object.fromEntries(__game.game.content.duels.pairs.map(p => [p.id, p.reply])));
  const opp2 = await G(() => { const o = __game.game.content.duels.opponents.teodoro; return { deck: o.deck, at: o.finishers.map(f => f.atScore), cabe: o.cabe, r09: o.attackText.R09, taunt0: o.taunt[0] }; });
  console.log('§5.1 D2 · datos');
  ok(JSON.stringify(opp2.deck) === '["R06","R02","R09"]' && opp2.at[0] === 3, `mazo ${JSON.stringify(opp2.deck)}, remate en atScore ${opp2.at[0]}`);
  ok(opp2.r09 === ATQ_R09 && opp2.taunt0 === 'Treinta y ocho caracteres de nada.', 'attackText.R09 (N7) y taunt[0] de hoy');
  ok(opp2.cabe && opp2.cabe.R09 && opp2.cabe.R09.max === 38 && opp2.cabe.R09.corta === CORTA && opp2.cabe.R09.noCabe === NO_CABE, '`cabe.R09` = { max: 38, corta (N8), noCabe (N9) }');
  ok(CORTA.length <= 38 && pairs.R09.length > 38, `la corta cabe (${CORTA.length}) y la larga no (${pairs.R09.length})`);

  // ================================================================ fuera de orden
  console.log('\n§5.1 fuera de orden');
  await partida('catacumba', { ...D2_FLAGS, fax_con_papel: false }, ['ficha_pagina_7', 'manual_fax']);
  await clicVerboEn('hablar', 'teodoro_cuerpodoce');
  await settle();
  ok(!(await G(() => !!__game.game.duelInfo || !!__game.game.choice)) && await logHas('Sin papel no habla. Es su mejor época.'), 'sin papel: Hablar con Teodoro no abre duelo ni menú (Aurora, E217)');
  await G(() => __game.setFlag('fax_con_papel', true));
  await clearLog(); await verb('dar', 'teodoro_cuerpodoce', 'ficha_pagina_7');
  ok(await logHas(FAX + 'UNA FICHA NO ES UNA FIRMA. GÁNATELA.') && !(await flag('casilla_firma')), 'Dar la ficha antes del duelo: «Gánatela», sin firma');

  // ================================================================ D2 completo, ratón real
  console.log('\n§5.1 D2 completo (ratón real)');
  await partida('catacumba', D2_FLAGS, ['ficha_pagina_7', 'manual_fax']);
  await G(() => __game.skipText(true));
  ok(await abrirD2(), 'Hablar con Teodoro (clic) → «Quiero firmar…» (clic) → primer ataque');
  let I = await info();
  ok(I.attack === 'R06' && !I.pairs.includes('larga'), `1.º ataque R06, sin larga (${JSON.stringify(I.pairs)})`);
  await clickOpt(I.ci); ok(await menuD(), 'R06 contestada (clic)');
  I = await info();
  ok(I.attack === 'R02' && I.hits === 1 && !I.pairs.includes('larga'), `2.º ataque R02 (aciertos ${I.hits})`);
  await clickOpt(I.ci); ok(await menuD(), 'R02 contestada (clic)');
  let log = await logTexts();
  ok(log.some(t => t === FAX + 'ESO ME LO DIJO ELLA. EN 1996.') && !log.some(t => t.includes('...CABE.')), 'tras la R02, «ESO ME LO DIJO ELLA. EN 1996.» y ya no «...CABE.»');
  I = await info();
  ok(I.attack === 'R09' && I.hits === 2 && I.body === ATQ_R09, `3.er ataque R09: «${I.body}»`);
  const iL = I.pairs.indexOf('larga');
  ok(iL >= 0 && I.options[iL] === pairs.R09 && I.options[I.ci] === CORTA, 'el menú trae la larga entera y la corta («Tráeme el contexto.»)');
  ok(I.options.filter(o => o === CORTA).length === 1 && I.pairs.filter(p => p === 'larga').length === 1, 'una larga y una corta');
  ok(log.some(t => t === FAX + ATQ_R09), 'Teodoro lo dice por el fax (N7)');
  await shot('d2-menu-cabe');
  // larga, 1.ª vez (texto normal, para ver el corte 1,2 s)
  await G(() => { __game.clearLog(); __game.skipText(false); });
  const cortado = pairs.R09.toUpperCase().slice(0, 38) + '—';
  await clickOpt(iL);
  ok(await until(c => { const d = __game.game.duelInfo; return d && d.phase === 'larga' && d.body === c; }, cortado, 20000), `la larga (clic): el cuerpo enseña lo que cabe «${cortado}»`);
  await sleep(250);
  await shot('d2-larga-cortada');
  await G(() => __game.skipText(true));
  ok(await menuD(), 'tras la larga, el mismo ataque vuelve');
  I = await info();
  log = await logTexts();
  ok(log.includes(FAX + NO_CABE), 'larga, 1.ª vez: «NO CABE. REPITA EN TREINTA Y OCHO.»');
  ok(I.attack === 'R09' && I.misses === 0 && I.hits === 2 && !/^RE: RE:/.test(I.subject), `larga, 1.ª vez: sin fallo (${I.score}; «${I.subject}»)`);
  // guardar a mitad del duelo y cargar: el duelo vuelve a empezar
  await G(() => __game.save(7));
  await G(() => __game.load(7));
  ok(await menuD(), 'cargar a mitad del duelo: se reabre');
  I = await info();
  ok(I.attack === 'R06' && I.hits === 0 && I.misses === 0, `tras cargar: empieza de 0 por la R06 (${I.score})`);
  ok(!(await flag('duelo_teodoro_ganado')) && (await inv()).includes('manual_fax') && (await inv()).includes('ficha_pagina_7'), 'tras cargar: sin ganar y con la ficha y el manual');
  await clickOpt(I.ci); await menuD(); I = await info();
  await clickOpt(I.ci); await menuD(); I = await info();
  ok(I.attack === 'R09' && I.hits === 2, 'otra vez en la R09 con dos aciertos');
  await clearLog();
  await clickOpt(I.pairs.indexOf('larga')); await menuD(); I = await info();
  ok(await logHas(FAX + NO_CABE) && I.misses === 0, 'tras cargar, la 1.ª larga vuelve a dar «NO CABE…» (sin fallo)');
  // larga, 2.ª vez → taunt
  await clearLog();
  await clickOpt(I.pairs.indexOf('larga')); await menuD(); I = await info();
  log = await logTexts();
  ok(log.includes(FAX + TAUNT) && !log.includes(FAX + NO_CABE), 'larga, 2.ª vez: el taunt «Treinta y ocho caracteres de nada.»');
  ok(I.misses === 0 && I.attack === 'R09', `larga, 2.ª vez: tampoco es fallo (${I.score})`);
  // la corta gana
  await clearLog();
  await clickOpt(I.ci);
  ok(await menuD(), 'la corta (clic)');
  I = await info();
  log = await logTexts();
  ok(log.includes(CORTA) && log.includes(FAX + '...CABE.'), 'Bruno: «Tráeme el contexto.» → Teodoro: «...CABE.»');
  ok(log.indexOf(FAX + '...CABE.') > log.indexOf(CORTA), '«...CABE.» va detrás de la corta');
  ok(I.phase === 'finisher' && I.hits === 3 && /^ACIERTOS 3\/3 · FALLOS 0\/3$/.test(I.score), `remate a los tres aciertos: «${I.score}»`);
  await shot('d2-remate');
  await G(() => __game.skipText(false));
  await rematar('manual_fax');
  await G(() => __game.skipText(true));
  await settle();
  await idle();
  ok(await flag('duelo_teodoro_ganado') && await flag('casilla_firma'), 'manual (clic en el inventario) → D2 ganado y la ficha sellada');
  ok(await logHas('BRUNO PELLEJO. TRECE CON ESPACIOS. CABE.') && await logHas('...Lo ha escrito bien.'), 'la firma de hoy');
  const ld = await G(() => __game.game.lastDuel);
  ok(ld && ld.result === 'won' && ld.misses === 0 && ld.hits === 3, `resultado ${JSON.stringify(ld)}`);
  await G(() => __game.skipText(false));

  // ================================================================ perder con señuelos
  console.log('\n§5.1 perder con señuelos');
  await partida('catacumba', D2_FLAGS, ['ficha_pagina_7', 'manual_fax']);
  await G(() => __game.skipText(true));
  await abrirD2();
  let usoLargaFuera = false;
  for (let k = 0; k < 6; k++) {
    I = await info(); if (!I || I.phase !== 'reply') break;
    // un señuelo: otra réplica aprendida (la larga de la R09 en el ataque de la R06 o la R02 es un señuelo más)
    let w = I.pairs.findIndex((p, j) => j !== I.ci && p !== 'larga' && /^R\d+$/.test(p) && p !== I.attack);
    if (I.attack !== 'R09' && I.pairs.includes('R09') && I.options[I.pairs.indexOf('R09')] === pairs.R09) { w = I.pairs.indexOf('R09'); usoLargaFuera = true; }
    if (w < 0) w = I.wi;
    const m0 = I.misses;
    await clickOpt(w);
    await menuD();
    const I2 = await info();
    if (I2 && I2.phase === 'reply') ok(I2.misses === m0 + 1, `señuelo en ${I.attack} («${I.options[w].slice(0, 28)}…»): fallo ${I2.misses}`);
  }
  await settle(); await idle();
  const ld2 = await G(() => __game.game.lastDuel);
  ok(ld2 && ld2.result === 'lost' && !(await flag('duelo_teodoro_ganado')), `con tres señuelos se pierde (${JSON.stringify(ld2)})`);
  ok(usoLargaFuera, 'la R09 entera, en el ataque de otra pareja, cuenta como señuelo (fallo)');
  ok(await logHas('Ha perdido usted con dos faltas, en cuerpo 72; se ven desde la escalera.'), 'la derrota de hoy («VUELVE» y Aurora)');
  await G(() => __game.skipText(false));

  // ================================================================ sin la R09
  console.log('\n§5.1 sin la R09');
  await partida('catacumba', { ...D2_FLAGS, rep_09: false }, ['ficha_pagina_7', 'manual_fax']);
  await G(() => __game.skipText(true));
  await abrirD2();
  ok(await logHas('Aún no tengo con qué contestarle. Debería cotillear más.'), 'aviso `notReady` (con dos de tres ya no basta)');
  for (let k = 0; k < 8; k++) {
    I = await info(); if (!I || I.phase !== 'reply') break;
    if (I.attack === 'R09') { ok(!I.pairs.includes('larga') && !I.options.includes(CORTA) && I.ci === -1, `sin la R09: en su ataque ni larga ni corta (${JSON.stringify(I.pairs)})`); break; }
    await clickOpt(I.ci); await menuD();
  }
  // retirarse a base de flojas
  for (let k = 0; k < 6; k++) { I = await info(); if (!I || I.phase !== 'reply') break; await clickOpt(I.wi); await menuD(); }
  await settle(); await idle();
  ok(!(await flag('duelo_teodoro_ganado')), 'sin la R09 no se gana');
  // la abuela: nivel 2 dice dónde está la R09
  const DONDE09 = await G(async () => (await import('/content/pistas.js')).DONDE.rep_09);
  await G(() => { __game.setFlag('abuela_obj', null); __game.setFlag('abuela_nivel', 0); __game.setFlag('nota_gasto_presentada', true); __game.setFlag('casilla_fuente', true); });
  const llamada = () => G(async () => { __game.clearLog(); await __game.scene('pistas'); return { obj: __game.getFlag('abuela_obj'), l: __game.log.filter(l => l.who === 'abuela_remedios' || l.who === 'bruno').map(l => (l.who === 'bruno' ? 'B: ' : 'A: ') + l.text) }; });
  const L1 = await llamada(), L2 = await llamada(), L3 = await llamada();
  ok(L2.obj === 'firma' && L2.l.includes('A: ' + DONDE09[0]), `abuela, nivel 2 (objetivo ${L2.obj}): «${DONDE09[0]}»`);
  ok(L3.l.includes('B: ' + DONDE09[1]), `nivel 3: Bruno, «${DONDE09[1]}»`);
  void L1;
  await G(() => __game.skipText(false));

  // ================================================================ D3 · Gervasio
  console.log('\n§5.2 D3 · Gervasio');
  const opp3 = await G(() => { const o = __game.game.content.duels.opponents.gervasio; return { deck: o.deck, at: o.finishers.map(f => f.atScore), win: o.winScore, r03: o.attackText.R03 }; });
  ok(JSON.stringify(opp3.deck) === '["R07","R03","R01","R05"]' && opp3.at[0] === 2 && opp3.win === 2, `mazo ${JSON.stringify(opp3.deck)}, sigue a dos (${opp3.win}/${opp3.at[0]})`);
  ok(opp3.r03 === 'El acta se necesitaba para... para...', 'attackText.R03 (N10)');
  // antes del Acto III: sin duelo
  await partida('pajarera', { acto_2_iniciado: true, reunion_terminada: true, rep_07: true, rep_03: true }, ['fotocopia_nota_direccion']);
  await clicVerboEn('hablar', 'gervasio_acta');
  ok(await until(() => !!__game.game.choice), 'Acto II: Hablar con Gervasio (clic) abre su árbol');
  ok(!(await G(() => __game.game.choice.options.some(o => o.includes('Necesito el acta')))), 'Acto II: sin la opción del duelo');
  await clickOptText('Me voy.'); await settle();
  // Acto III, ratón real
  await partida('pajarera', { acto_2_iniciado: true, reunion_terminada: true, acto_3_iniciado: true, ruben_encontrado: true, rep_07: true, rep_03: true }, ['fotocopia_nota_direccion']);
  await G(() => __game.skipText(true));
  await clicVerboEn('hablar', 'gervasio_acta');
  await clickOptText('Necesito el acta de la última reunión.');
  ok(await menuD(), 'Hablar con Gervasio (clic) → «Necesito el acta…» (clic) → primer ataque');
  I = await info();
  ok(I.attack === 'R07', `1.er ataque R07 (${I.body})`);
  await clickOpt(I.ci); await menuD();
  ok(await logHas('Me consta que... Bueno. Se constaba.'), 'R07 → «Me consta que... Bueno. Se constaba.»');
  I = await info();
  ok(I.attack === 'R03' && I.body === 'El acta se necesitaba para... para...' && I.options[I.ci] === pairs.R03, `2.º ataque, la frase a medias; la R03 en el menú («${pairs.R03}»)`);
  ok(await logHas('El acta se necesitaba para... para...') && !(await logHas('Por alguien. No digo quién.')), 'Gervasio lo dice a medias (la de antes ya no)');
  await shot('d3-frase-a-medias');
  await clearLog();
  await clickOpt(I.ci); await menuD();
  I = await info();
  log = await logTexts();
  const iR = log.indexOf(pairs.R03), iF = log.findIndex(t => t.includes('Yo con Hidrovoltia no he comido en mi vida.'));
  ok(iR >= 0 && iF === iR + 1, `la R03 (clic) y el remate justo detrás, sin línea en medio (${JSON.stringify(log.slice(iR, iF + 1))})`);
  ok(I.phase === 'finisher' && /^ACIERTOS 2\/2 · FALLOS 0\/3$/.test(I.score), `remate: «${I.score}»`);
  await shot('d3-remate');
  await rematar('fotocopia_nota_direccion');
  await settle(); await idle();
  ok(await flag('duelo_gervasio_ganado') && (await inv()).includes('acta_reunion') && !(await inv()).includes('fotocopia_nota_direccion'), 'fotocopia (clic) → D3 ganado, acta en la mano');
  await G(() => __game.skipText(false));

  // ================================================================ textos (§4.1, B4, B5, E177, X1, X4)
  console.log('\n§4.1 Textos');
  const { T } = await import(path.join(root, 'docs/guion2/e6/tabla.mjs'));
  // ENMIENDA E7 (tabla_e7.mjs) restaura o cambia algunas de estas filas: las que E7 sustituye ya no son de E6
  const E7 = new Set((await import(path.join(root, 'docs/guion2/e7/tabla_e7.mjs'))).filas.map(r => r.fichero + '|' + r.actual));
  const todas = T.filter(r => r[0] === 'rooms/catacumba.js' || r[0] === 'rooms/pajarera.js');
  const mios = todas.filter(r => !E7.has(r[0] + '|' + r[2]));
  const src = Object.fromEntries(['rooms/catacumba.js', 'rooms/pajarera.js'].map(f => [f, fs.readFileSync(path.join(root, 'content', f), 'utf8')]));
  // E177 se borra solo en `grabacion` (en la opción de Gervasio, M25, se queda): se mira el cuerpo de esa función
  const grabacionSrc = (src['rooms/pajarera.js'].match(/async function grabacion[\s\S]*?\n}/) || [''])[0];
  const sigue = (f, act, id) => (id === 'E177' ? /sayAs\(G|gv\(/.test(grabacionSrc) || grabacionSrc.includes(`'${act}'`) : src[f].includes(act));
  const malos = mios.filter(([f, act, nuevo, , id]) => sigue(f, act, id) || (nuevo !== null && !src[f].includes(nuevo)));
  ok(todas.length === 40 && malos.length === 0, `las ${mios.length} filas de §4.1 (+ ${todas.length - mios.length} que cambia E7): ninguna «actual» queda y todas las nuevas están${malos.length ? ' — mal: ' + malos.map(r => r[4]).join(', ') : ''}`);
  ok(!src['rooms/catacumba.js'].includes('DATO SIN CONTEXTO. Y DE LA WEB') && !src['rooms/pajarera.js'].includes('No digo quién.'), 'los ataques viejos (R09 de D2, R03 de D3) ya no están');
  // muestra jugada (Papel)
  await partida('catacumba', {}, []);
  const TX = async (v, t, i, nuevo, viejo, msg) => { await clearLog(); await verb(v, t, i); ok(await logHas(nuevo) && (!viejo || !(await logHas(viejo))), `${msg}: «${nuevo}»`); };
  await TX('mirar', 'mesa_teodoro', null, 'La mesa de Teodoro, ordenada al milímetro.', 'Muy ordenada.', 'E223');
  await TX('coger', 'catacumba_a_pecera', null, 'No la cojo: esta puerta separa el papel del clic.', '1994', 'E222');
  await TX('coger', 'fax', null, 'Pesa lo que pesa una década.', 'de 1992', 'E241');
  await TX('mirar', 'aurora_galerada', null, 'Aurora, correctora. Tiene un boli rojo clavado en el moño. Por si acaso.', null, 'E237 (E7: vuelve «Por si acaso.»)');
  await TX('mirar', 'fax_enmarcado', null, 'Un fax enmarcado: «¿Esto lo has contrastado?».', '2003', 'E242');
  // X1 (Aurora antes del café), con clic en la opción
  await G(() => __game.skipText(true));
  await clicVerboEn('hablar', 'aurora_galerada');
  await clearLog();
  await clickOptText('Puedo hablar yo por los dos, si quiere.');
  await settle(); await idle();
  ok(await logHas('Me ha corregido sin hablar.') && !(await logHas('Es buenísima.')), 'X1: «Me ha corregido sin hablar.» (sin «Es buenísima.»)');
  await G(() => __game.skipText(false));
  // Teodoro con papel: E219 (remate equivocado) por el árbol; E238 con el táper
  await partida('catacumba', { acto_2_iniciado: true, fax_con_papel: true }, ['taper_huerfano']);
  await TX('dar', 'teodoro_cuerpodoce', 'taper_huerfano', FAX + 'VACÍO. CABE TODO. NO LO QUIERO.', 'UN TÁPER', 'E236');
  await TX('usar', 'fax', 'taper_huerfano', 'Eso no se faxea, y vacío todavía menos.', 'Un táper', 'E238');
  await clearLog(); await G(() => __game.skipText(true));
  await G(() => __game.doVerb('hablar', 'teodoro_cuerpodoce'));
  if (await until(() => !!__game.game.choice)) { await G(() => __game.chooseText('¿Qué le pasa con la web?')); await until(() => !!__game.game.choice); }
  ok(await logHas(FAX + 'SI FIRMA UNO DE LA WEB, EL PAPEL SE ACABA.') && !(await logHas('LO NOTO')), 'E214: «Si firma uno de la web, el papel se acaba.»');
  await G(() => __game.chooseText('Me voy.')); await idle(); await G(() => __game.skipText(false));
  // Despachos: B5, E177, X4, B4
  await partida('pajarera', { acto_2_iniciado: true, reunion_terminada: true });
  await clearLog(); await verb('mirar', 'posit_evaristo');
  log = await logTexts();
  ok(log.includes('Un pósit azul: "EVARISTO (CONTROLLING). PESADO. BAJO IMPACTO".') && !log.some(t => t.includes('Íñigo le ha puesto en excusas')), 'B5: el pósit azul, una línea (sin «Azul. Excusas…»)');
  await clearLog(); await clicVerboEn('hablar', 'lector_medio'); await settle(); await idle();
  log = await logTexts();
  ok(log.includes('A mí lo que me interesa es la economía. Y ahorrar.') && !log.includes('Lo que diga el Lector Medio.') && !log.includes('...Pues ya está decidido.'),
    'E177: Hablar con el Lector (clic) con Gervasio delante: su frase, sin el comentario de Gervasio');
  await G(() => __game.skipText(true));
  G(() => __game.doVerb('hablar', 'gervasio_acta'));
  await until(() => !!__game.game.choice);
  await clearLog();
  await G(() => __game.chooseText('¿Quién decide lo del Plan Cero Papel?')); await until(() => !!__game.game.choice);
  ok(await logHas('Lo que diga el Lector Medio.') && await logHas('...Pues ya está decidido.'), 'M25 se queda en la opción de Gervasio');
  await G(() => __game.chooseText('Me voy.')); await idle(); await G(() => __game.skipText(false));
  await TX('empujar', 'pajarera_a_pecera', null, 'Empujo el cristal. Desde la Redacción parece que pido auxilio. Un poco sí.', null, 'E155 (E7: vuelve «Un poco sí.»)');
  await G(() => __game.setFlag('acto_3_iniciado', true));
  await TX('mirar', 'hoja_reservas', null, 'Ha pisado la reserva de un hombre que no está.', 'Eso es nivel.', 'X4');
  await TX('cerrar', 'puerta_sala', null, 'Cerrada por dentro. Se oye pasar una diapositiva. Muy despacio.', null, 'E165 (E7: vuelve el original)');
  // B4: la escena de la chaqueta
  await partida('pecera', { bruno_con_chaqueta: true, chaqueta_en_lector: false });
  await G(() => { __game.game.state.once = {}; __game.clearLog(); });
  await G(() => __game.gotoRoom('pajarera'));
  await settle(); await idle();
  log = await logTexts();
  ok(log.includes('¿Ve? Él sí sabe estar.') && !log.some(t => t.includes('mangas de camisa')), 'B4: tras «¿Ve? Él sí sabe estar.», sin la línea de Bruno');
  ok(await flag('bruno_con_chaqueta') === false, 'B4: Bruno se quita la chaqueta (el gesto)');
  await shot('despachos');
} catch (e) {
  failures++;
  console.log('  ✗ EXCEPCIÓN: ' + (e && e.stack || e));
  await shot('error').catch(() => {});
}

const errs = consoleErrors.concat(await G(() => (__game.errors || []).map(String)).catch(() => []));
ok(!errs.length, `sin errores de consola${errs.length ? ': ' + errs.slice(0, 5).join(' | ') : ''}`);
console.log(`\n${checks - failures}/${checks} comprobaciones OK`);
await browser.close();
server.close();
process.exit(failures ? 1 : 0);
