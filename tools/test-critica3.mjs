#!/usr/bin/env node
// ARREGLOS DE LA CRÍTICA 3 (docs/informes/critica3/CRITICA_JUEGO_3.md §7, fallos N1-N11, y el punto 7 de §9):
//   · N1  Usar el ordenador (sentado) da la réplica R11 como Mirar, una sola vez; la abuela dice dónde está cada réplica
//         que falta para el duelo del objetivo (nivel 2: la primera; nivel 3: Bruno, sitio y objeto) en los cuatro duelos.
//   · N2  «Mirar a Bruno» dice la meta del acto en curso (Actos II y III), aunque quede pendiente un objetivo viejo.
//   · N3  el fax enmarcado de la Redacción de papel: todo su rectángulo es suyo (nadie delante, Aurora tampoco).
//   · N4  Usar la tarjeta con la rama del organigrama = con el organigrama.
//   · N5  la salida de los Despachos a la Redacción se llama «Redacción».
//   · N6  el ambiente guarda un margen tras cerrar una conversación (`trasDialogo`).
//   · N7  retirarse del hilo: Bruno lo dice y el hilo queda en el registro.
//   · N8  ganar a Maripaz con la ficha sellada por Teodoro: «Sellada por Teodoro».
//   · N9  la libreta: «…» fuera y “…” dentro (nunca «… «…» …»).
//   · N10 el titular de la derrota de un duelo es del Titulator (no de Bruno) en el registro.
//   · N11 el coro de Desarrollo solo habla con Bruno cerca de su mesa.
//   · §9.7 revanchas de Maripaz sin pop-up (solo antes del primer intento).
//   node tools/test-critica3.mjs
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from './serve.mjs';
import { createRunner, StepFail } from './walk-lib.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
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
const { G, state, chooseByText } = R;

let n = 0, failed = null;
const ok = (msg) => console.log(`  ✓ ${String(++n).padStart(2)} ${msg}`);
const must = (c, msg) => { if (!c) throw new StepFail(msg); };
const wait = (ms) => new Promise(r => setTimeout(r, ms));
const flag = (k) => G(k => __game.getFlag(k), k);
const setFlags = (o) => G(o => { for (const [k, v] of Object.entries(o)) __game.setFlag(k, v); }, o);
const verb = (v, t, i) => G(([v, t, i]) => __game.doVerb(v, t, i), [v, t, i || null]);
const idle = () => G(() => __game.waitIdle());
const clearLog = () => G(() => __game.clearLog());
const logCount = (txt) => G(t => __game.log.filter(l => String(l.text).includes(t)).length, txt);
const goto = async (room, entry) => { await G(([r, e]) => __game.gotoRoom(r, e), [room, entry]); await idle(); };
const until = async (fn, arg, ms = 15000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await G(fn, arg)) return true; await wait(40); } return false; };
const brunoDice = async () => G(async () => { __game.clearLog(); await __game.doVerb('mirar', 'bruno'); return __game.log.filter(l => l.who === 'bruno').map(l => l.text); });
const llamada = () => G(async () => { __game.clearLog(); await __game.scene('pistas'); return __game.log.filter(l => l.who === 'abuela_remedios' || l.who === 'bruno').map(l => (l.who === 'bruno' ? 'B: ' : 'A: ') + l.text); });
const DONDE = (rep) => G(async (r) => { const m = await import('/content/pistas.js'); return m.DONDE[r]; }, rep);

const BASE_ACTO2 = { torno_abierto: true, inigo_presentado: true, silla_libre: true, gertrudis_saludada: true, acto_2_iniciado: true };

/** Tres llamadas seguidas a la abuela en `sala` (empezando en nivel 1): [L1, L2, L3]. */
async function tresLlamadas(sala) {
  await goto(sala);
  await setFlags({ abuela_obj: null, abuela_nivel: 0 });
  return [await llamada(), await llamada(), await llamada()];
}

/** Un duelo abierto con api.duel: contesta bien hasta el remate y entonces `alRemate` ('retirarse' | id de objeto). */
async function jugarDuelo(id, alRemate) {
  G(i => { __game.game.runScript(api => api.duel(i), { label: 'test' }); }, id);
  for (let k = 0; k < 60; k++) {
    await idle();
    const st = await state();
    if (!st.duel) return;
    if (st.duel.phase === 'reply' && st.dialog) await G(() => __game.chooseDialog(__game.state().duel.correctIndex));
    else if (st.duel.phase === 'finisher' && st.dialog) {
      if (alRemate === 'retirarse') await chooseByText('[Retirarse del hilo]');
      else { await chooseByText('[Usar objeto]'); await G(o => __game.chooseItem(o), alRemate); }
    } else await wait(30);
  }
  await idle();
  must(!(await state()).duel, `el duelo ${id} no termina`);
}

try {
  await page.goto(base);
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) { /* ignore */ } });
  await page.reload();
  await page.waitForFunction(() => !!window.__game, null, { timeout: 30000 });
  await G(() => __game.skipText(true));
  await R.startDismisser();
  console.log('Arreglos de la crítica 3 (N1-N11 y revanchas de Maripaz)\n');
  await G(() => __game.newGame());
  await idle();

  // ------------------------------------------------------------ N4 rama del organigrama
  await G(() => __game.giveItem('tarjeta_becario'));
  await setFlags({ tarjeta_con_chicle: true });
  await verb('usar', 'rama_diseno', 'tarjeta_becario');
  must(await flag('foto_en_organigrama') === true, 'N4: Usar tarjeta con la rama del organigrama no pega la foto');
  ok('N4: Usar la tarjeta (con chicle) con la rama del organigrama pega la foto, igual que con el organigrama');

  // ------------------------------------------------------------ N1 Usar el ordenador = Mirar (una vez)
  await setFlags({ torno_abierto: true, inigo_presentado: true, silla_libre: true });
  await goto('pecera');
  await clearLog();
  await verb('usar', 'ordenador_bruno');
  must(await flag('rep_11') === true, 'N1: Usar el ordenador sentado no da rep_11');
  must(await logCount('Respuesta: «Espera sentado. Si encuentras silla».') === 1, 'N1: Usar el ordenador no enseña el correo de Ramírez');
  await verb('usar', 'ordenador_bruno'); await verb('mirar', 'ordenador_bruno');
  must(await logCount('Respuesta: «Espera sentado. Si encuentras silla».') === 1, 'N1: el correo de Ramírez se repite (debe salir una sola vez)');
  ok('N1: Usar el ordenador (sentado) da la réplica R11 como Mirar; una sola vez');

  // ------------------------------------------------------------ N2 Mirar a Bruno por acto (con objetivos viejos pendientes)
  await setFlags({ ...BASE_ACTO2, rep_11: false });
  const M = await G(async () => { const m = await import('/content/pistas.js'); return Object.fromEntries(m.OBJETIVOS.map(o => [o.id, o.meta])); });
  for (const sala of ['pecera', 'vestibulo', 'catacumba']) {
    await goto(sala);
    const d = await brunoDice();
    must(!d.includes(M.correo) && !d.includes(M.silla), `N2: en el Acto II (${sala}) Bruno dice una meta del Acto I: ${JSON.stringify(d)}`);
  }
  await goto('pecera');
  let d = await brunoDice();
  must(d.includes(M.cms), `N2: Acto II en la Redacción, sin CMS: «${M.cms}» (dice ${JSON.stringify(d)})`);
  ok('N2: Acto II con R11 sin aprender: «Mirar a Bruno» ya no dice «Tengo silla…», dice la meta del acto');
  await setFlags({ acto_3_iniciado: true });           // CMS, coma y R11 siguen pendientes
  for (const sala of ['pecera', 'vestibulo', 'administracion', 'cpd']) {
    await goto(sala);
    d = await brunoDice();
    must(d.includes(M.armario), `N2: Acto III (${sala}): se esperaba «${M.armario}» (dice ${JSON.stringify(d)})`);
  }
  ok('N2: Acto III (CMS, coma y R11 pendientes): «Mirar a Bruno» dice la meta del Acto III en todas partes');
  await setFlags({ acto_3_iniciado: false });

  // ------------------------------------------------------------ N1 la abuela dice dónde está cada réplica que falta
  await setFlags({ reunion_terminada: true, rep_08: false, rep_04: true, rep_14: true, rep_11: false });
  let [, L2, L3] = await tresLlamadas('sala_amazonas');
  const d08 = await DONDE('rep_08'), d11 = await DONDE('rep_11');
  must(L2.includes('A: ' + d08[0]), `N1: nivel 2 (D1) sin la primera réplica que falta (R08): ${JSON.stringify(L2)}`);
  must(L3.includes('B: Me faltan réplicas.') && L3.includes('B: ' + d08[1]) && L3.includes('B: ' + d11[1]), `N1: nivel 3 (D1): Bruno no dice dónde están R08 y R11: ${JSON.stringify(L3)}`);
  must(!L3.some(l => l.includes('Cotillea, que es gratis')), 'N1: sigue la pista vaga «Cotillea, que es gratis»');
  await setFlags({ rep_08: true });
  [, L2, L3] = await tresLlamadas('sala_amazonas');
  must(L3.includes('B: ' + d11[1]) && !L3.includes('B: ' + d08[1]), `N1: nivel 3 (D1) con solo R11 pendiente: ${JSON.stringify(L3)}`);
  must(d11[1].includes('ordenador'), 'N1: el nivel 3 de R11 no nombra el ordenador');
  await setFlags({ rep_11: true });
  [, L2, L3] = await tresLlamadas('sala_amazonas');
  must(!L3.includes('B: Me faltan réplicas.') && !L2.some(l => Object.values({ d08, d11 }).some(x => l === 'A: ' + x[0])), `N1: con todas las réplicas, la abuela sigue mandando a buscarlas: ${JSON.stringify(L3)}`);
  ok('N1: D1 (Maripaz): nivel 2 la abuela dice dónde está la que falta; nivel 3 Bruno nombra sitio y objeto de cada una');
  // D2 (Teodoro, objetivo firma): falta R06 (el fax enmarcado)
  await setFlags({ nota_gasto_presentada: true, fax_con_papel: true, casilla_fuente: true, rep_06: false, rep_02: true, rep_09: true });
  [, L2, L3] = await tresLlamadas('catacumba');
  const d06 = await DONDE('rep_06');
  must(L2.includes('A: ' + d06[0]) && L3.includes('B: ' + d06[1]), `N1: D2 sin R06: ${JSON.stringify(L3)}`);
  await setFlags({ rep_06: true });
  ok('N1: D2 (Teodoro): falta R06 → «' + d06[1] + '»');
  // D3 (Gervasio, objetivo acta): falta R07 (el ordenador de Gervasio)
  await setFlags({ acto_3_iniciado: true, ruben_encontrado: true, posit_descopeado: true, ruben_libre: true, rep_07: false, rep_01: true, rep_03: true, rep_05: true });
  [, L2, L3] = await tresLlamadas('pajarera');
  const d07 = await DONDE('rep_07');
  must(L2.includes('A: ' + d07[0]) && L3.includes('B: ' + d07[1]), `N1: D3 sin R07: ${JSON.stringify(L3)}`);
  ok('N1: D3 (Gervasio): falta R07 → «' + d07[1] + '»');
  // D4 (Íñigo, objetivo inigo): faltan R15 y R16
  await setFlags({ sala_abierta: true, rep_07: true, rep_10: true, rep_12: true, rep_13: true, rep_15: false, rep_16: false });
  [, L2, L3] = await tresLlamadas('pajarera');   // (en la Sala, sala_abierta lanza el clímax)
  const d15 = await DONDE('rep_15'), d16 = await DONDE('rep_16');
  must(L2.includes('A: ' + d16[0]) && L3.includes('B: ' + d16[1]) && L3.includes('B: ' + d15[1]), `N1: D4 sin R15 ni R16: ${JSON.stringify(L3)}`);
  ok('N1: D4 (Íñigo): faltan R16 y R15 → Evaristo y Rubén, con sitio y objeto');

  // ------------------------------------------------------------ N5 salida de los Despachos
  const nombre = await G(() => (__game.game.content.rooms.pajarera.objects || []).find(o => o.id === 'pajarera_a_pecera').name);
  must(nombre === 'Redacción', `N5: la salida de los Despachos se llama «${nombre}»`);
  ok('N5: la salida de los Despachos a la Redacción se llama «Redacción» (como las demás salidas)');

  // ------------------------------------------------------------ N9 la libreta, comillas
  await G(() => __game.newGame()); await idle();
  await setFlags({ rep_09: true, rep_01: true });
  await verb('usar', 'libreta_replicas');
  const lib = await G(() => __game.currentDialogOptions());
  must(lib && lib.includes('«Tráeme el contexto. Le hago una pieza aparte: “El contexto, explicado”.»'), `N9: la libreta no cambia las comillas de dentro: ${JSON.stringify(lib)}`);
  must(lib.every(o => (o.match(/«/g) || []).length <= 1), `N9: comillas «» anidadas en la libreta: ${JSON.stringify(lib)}`);
  await chooseByText('[Cerrar la libreta]'); await idle();
  ok('N9: la libreta cita con «…» y lo de dentro con “…”');

  // ------------------------------------------------------------ N3 el fax enmarcado, despejado
  await setFlags({ torno_abierto: true, inigo_presentado: true, acto_2_iniciado: true });
  await goto('catacumba');
  const fax = await G(() => {
    const g = __game.game, r = g.room.def.layout.fax_enmarcado.rect; let suyos = 0, total = 0; const otros = {};
    for (let y = r[1]; y < r[1] + r[3]; y++) for (let x = r[0]; x < r[0] + r[2]; x++) {
      const t = g.pickAt(x - Math.round(g.camX), y); total++;
      if (t && t.id === 'fax_enmarcado') suyos++; else otros[t ? t.id : '—'] = (otros[t ? t.id : '—'] || 0) + 1;
    }
    const a = g.actors.aurora_galerada;
    return { suyos, total, otros, aurora: a && a.room === 'catacumba' && a.visible };
  });
  must(fax.aurora, 'N3: Aurora no está en la Redacción de papel');
  must(fax.suyos === fax.total, `N3: el fax enmarcado no es suyo en ${fax.total - fax.suyos} de ${fax.total} puntos (${JSON.stringify(fax.otros)})`);
  await clearLog();
  const fr = await G(() => __game.game.room.def.layout.fax_enmarcado.rect);
  await G(([x, y]) => __game.doVerb('mirar', __game.game.pickAt(x - Math.round(__game.game.camX), y).id), [fr[0] + (fr[2] >> 1), fr[1] + (fr[3] >> 1)]);
  must(await flag('rep_06') === true, 'N3: Mirar el centro del fax enmarcado no da R06');
  ok(`N3: el fax enmarcado es suyo en ${fax.total} de ${fax.total} puntos (con Aurora en la sala); su centro da R06`);

  // ------------------------------------------------------------ N6 margen del ambiente tras cerrar una conversación
  await setFlags({ tadeo_rv_n: 1, 'ambient:catacumba.aurora_tadeo': 0 });
  await G(() => __game.skipText(false));
  G(() => { __game.game.runScript(api => api.dialog({ id: 'test_n6', actor: 'aurora_galerada', nodes: { a: { options: [{ text: 'Adiós.', exit: true, silent: true }] } } }), { label: 'test' }); });
  await until(() => !!__game.currentDialogOptions());
  await G(() => __game.chooseDialog(0));
  await G(() => { const g = __game.game; g.speeches.slice().forEach(s => g.endSpeech(s)); g.room.amb.count = 0; g.room.amb.next = g.time; });
  await wait(2500);
  must(await logCount('Dos exclamaciones de cierre') === 0, 'N6: el ambiente de Aurora suena justo al cerrar un diálogo');
  await G(() => { const g = __game.game; g.finDialogo = g.time - 60000; g.room.amb.next = g.time; });
  must(await until(() => __game.log.some(l => String(l.text).includes('Dos exclamaciones de cierre')), null, 8000), 'N6: pasado el margen, el ambiente de Aurora no sale');
  await G(() => __game.skipText(true)); await idle();
  ok('N6: tras cerrar un diálogo el ambiente espera su margen (trasDialogo); pasado el margen, sale');

  // ------------------------------------------------------------ N11 el coro, solo cerca
  await goto('pecera');
  const coro = await G(() => {
    const g = __game.game, api = g.condApi(), am = g.room.def.ambient.find(a => a.id === 'coro'), p = g.player, x0 = p.x;
    const r = g.room.def.layout.coro_desarrollo.rect, cx = r[0] + r[2] / 2;
    const en = (x) => { p.x = x; return g.cond(am.if, api); };
    const out = { cerca: en(cx), borde: en(cx - 190), lejos: en(cx - 260), otraPunta: en(100), cx };
    p.x = x0; return out;
  });
  must(coro.cerca && coro.borde && !coro.lejos && !coro.otraPunta, `N11: umbral del coro mal (${JSON.stringify(coro)})`);
  await G(() => __game.skipText(false));
  const sinCoro = await G(async () => {
    const g = __game.game; g.player.x = 90; g.player.path = []; g.snapCamera(); g.finDialogo = -1e9;
    const n0 = g.log.length;
    for (let k = 0; k < 3; k++) { g.room.amb.count = 0; g.room.amb.next = g.time; await new Promise(r => setTimeout(r, 1400)); }
    return g.log.slice(n0).filter(l => /^DEV [123]: /.test(String(l.text))).map(l => l.text);
  });
  must(!sinCoro.length, `N11: el coro habla desde la otra punta: ${JSON.stringify(sinCoro)}`);
  await G(() => { const g = __game.game; g.speeches.slice().forEach(s => g.endSpeech(s)); });
  await G(x => { const g = __game.game; g.player.x = x; g.player.path = []; g.snapCamera(); }, Math.round(coro.cx));
  const conCoro = await G(async () => {
    const g = __game.game; const n0 = g.log.length;
    for (let k = 0; k < 6; k++) {
      g.room.amb.count = 0; g.room.amb.next = g.time;
      await new Promise(r => setTimeout(r, 1500));
      if (g.log.slice(n0).some(l => /^DEV [123]: /.test(String(l.text)))) return true;
    }
    return false;
  });
  await G(() => __game.skipText(true)); await idle();
  must(conCoro, 'N11: con Bruno junto a su mesa el coro no habla');
  ok(`N11: el coro solo habla con Bruno a ≤ 200 px de su mesa (x ${Math.round(coro.cx)}); desde la otra punta, nada`);

  // ------------------------------------------------------------ D1 en la Sala: N10, revancha sin pop-up, N7, N8
  await G(() => __game.newGame()); await idle();
  await setFlags({ ...BASE_ACTO2, reunion_terminada: true, rep_08: true, rep_04: true, rep_11: true, rep_14: true });
  await G(() => __game.giveItem('ficha_pagina_7'));
  await goto('sala_amazonas');
  // N10: perder D1 → el titular es del Titulator
  await clearLog();
  G(() => { __game.game.runScript(api => api.duel('maripaz'), { label: 'test' }); });
  await until(() => !!__game.state().duel);
  await R.loseDuel();
  const tit = await G(() => __game.log.filter(l => String(l.text).includes('BECARIO LLAMA A UN COLCHÓN')).map(l => l.who));
  must(tit.length === 1 && tit[0] !== 'bruno' && tit[0] === 'titulator', `N10: el titular de la derrota lo dice ${JSON.stringify(tit)}`);
  ok('N10: el titular de la derrota de D1 queda en el registro como del Titulator, no de Bruno');
  // revancha: sin pop-up
  const pn0 = (await flag('maripaz_popup_n')) || 0;
  await clearLog();
  await verb('hablar', 'maripaz_remitido');
  must(((await flag('maripaz_popup_n')) || 0) === pn0 && await logCount('Plano detalle: PUBLICIDAD') === 0, 'revancha de D1: sigue saliendo el pop-up');
  must(!!(await G(() => __game.currentDialogOptions())), 'revancha de D1: no se abre el árbol de Maripaz');
  await chooseByText('Luego vuelvo.'); await idle();
  ok('§9.7: tras perder D1, hablar con Maripaz va directo al árbol (sin pop-up obligatorio)');
  // N7: retirarse en el remate
  await clearLog();
  await jugarDuelo('maripaz', 'retirarse');
  const ret = await G(() => __game.log.map(l => `${l.who}:${l.text}`));
  must(ret.some(l => l === 'aviso:RV: Bruno ha abandonado el hilo.'), `N7: «RV: Bruno ha abandonado el hilo.» no queda en el registro: ${JSON.stringify(ret.slice(-4))}`);
  const lineaRet = await G(() => __game.game.content.duels.texts.retireLine);
  must(ret.some(l => l === 'bruno:' + lineaRet) && lineaRet.length <= 80, `N7: Bruno no dice nada al retirarse: ${JSON.stringify(ret.slice(-4))}`);
  must(await flag('casilla_hueco') !== true && (await state()).lastDuel.result === 'retired', 'N7: retirarse cambia el resultado');
  ok(`N7: retirarse del hilo: «RV: Bruno ha abandonado el hilo.» en el registro y Bruno: «${lineaRet}»`);
  // N8: ganar D1 con la ficha sellada por Teodoro
  await setFlags({ casilla_firma: true, duelo_teodoro_ganado: true });
  await clearLog();
  await jugarDuelo('maripaz', 'ficha_pagina_7');
  must(await flag('casilla_hueco') === true, 'N8: no se gana D1 con la ficha');
  must(await logCount('Ficha de la página 7. Sellada por Teodoro. Impar.') === 1 && await logCount('Sellada por Aurora') === 0, 'N8: con el sello de Teodoro, Bruno sigue diciendo «Sellada por Aurora»');
  must(await logCount('Aurora no sella nada sin café') === 0, 'N8: Maripaz sigue hablando del sello de Aurora');
  ok('N8: ganada D2 antes que D1, el remate dice «Sellada por Teodoro» (y Maripaz no habla del café de Aurora)');

  const errs = await G(() => __game.errors.filter(e => !e.warn).map(e => e.msg));
  must(!errs.length, 'errores del motor: ' + errs.join(' | '));
  ok('Sin errores del motor');
} catch (e) {
  failed = e instanceof StepFail ? e.message : (e && e.stack || String(e));
}

if (failed) {
  const log = await G(() => __game.log.slice(-8).map(l => `${l.who || '—'}: ${l.text}`)).catch(() => []);
  console.log(`\n  ✗ FALLO: ${failed}`);
  if (log.length) console.log('    últimas líneas:\n      ' + log.join('\n      '));
  try { await page.screenshot({ path: path.join(here, 'shots', 'critica3-fallo.png') }); } catch (_) { /* ignore */ }
}
if (consoleErrors.length) console.log('\nErrores de consola:\n  ' + consoleErrors.join('\n  '));
console.log(failed || consoleErrors.length ? '\nCRÍTICA 3: FALLA' : `\nCRÍTICA 3: OK (${n} comprobaciones)`);
await browser.close();
server.close();
process.exit(failed || consoleErrors.length ? 1 : 0);
