#!/usr/bin/env node
// PRUEBA DEL PAQUETE PA DE LA ENMIENDA E6 (Sala Amazonas y Vending; docs/guion2/ENMIENDA_E6.md §2.2, §2.3, §3 N1-N6),
// con RATÓN REAL en los pasos clave. Capturas en tools/shots/e6-pa-*.png. Cubre:
//   §2.3 la tele que sintoniza a Gertrudis: con «sin turno», clic en Hablar tele → «Buenas noches, Gertrudis.» →
//   «BUENAS NOCHES, SALA AMAZONAS.» → «¿Y cuáles son los siguientes pasos?» → la escena de hoy sin «BUSCANDO SEÑAL» y sin
//   cambiar de sala; «Nada.» (TV0) y «Nada. Gracias, Gertrudis.» (TV1) dejan la tele en `normal` y se repite; antes de
//   Gervasio, sin árbol; la vía del Vending entera (pregunta en el Vending → Hablar tele → escena sin árbol); guardar con
//   la pregunta hecha (sin estampida) y cargar → Usar tele → escena; guardar tras «Nada. Gracias» y cargar → el árbol;
//   Esc en la escena (atasco abierto, control devuelto, sin guardar); el paso 28 del recorrido de 49 en modo rápido.
//   §2.2 el atasco se anuncia: plano de la puerta, los tres se giran hacia Bruno, «¿Necesitan ayuda?»; [P11] y se
//   resuelve solo (escena: el anuncio de Maripaz y el cruasán de Jacinto; fuera las vías, el reloj de 20 s y N2).
//   node tools/test-e6-pa.mjs            (≈ 3 min; usa tiempo real para el reloj del atasco)
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

// Acto II con el café a Aurora hecho (paso 16): la Sala con Gervasio, Mercados y Maripaz
const FLAGS_A2 = { intro_vista: true, torno_abierto: true, inigo_presentado: true, acto_2_iniciado: true, silla_libre: true,
  gertrudis_saludada: true, cafetera_viral: true, cafetera_viral_vista: true, chaqueta_cogida: true, chaqueta_en_lector: true,
  aurora_conto_pasos: true, aurora_hablo_fax: true, chisme_indice: 4, cafetera_en_directo: true, cms_vivo: true,
  office_e53_visto: true, office_agotada: true };
const SIN_TURNO = { ...FLAGS_A2, sala_amazonas_orden_visto: true, sala_becario_sin_turno: true };

async function open(flags = SIN_TURNO, room = 'sala_amazonas', entry = 'pajarera') {
  const ctx = await browser.newContext({ viewport: { width: 960, height: 600 } });
  const page = await ctx.newPage();
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));
  await page.goto(base + '?room=pecera');
  await page.waitForFunction(() => window.__game && __game.state().mode === 'play');
  const G = (fn, a) => page.evaluate(fn, a);
  await G(() => { __game.skipText(true); return __game.waitIdle(); });
  await G((F) => { for (const [k, v] of Object.entries(F)) __game.setFlag(k, v); __game.giveItem('movil'); }, flags);
  const T = { ctx, page, G };
  await goto(T, room, entry);
  await G(() => __game.clearLog());
  return T;
}
async function goto({ G }, room, entry) {
  await G(() => __game.skipText(true));
  await G(([r, e]) => __game.gotoRoom(r, e), [room, entry]);
  await G(() => { __game.skipSpeech(); return __game.waitIdle(); });
  await G(() => { __game.skipSpeech(); __game.game.speeches.length = 0; });
}
async function saltando(G, cond, keep = null, ms = 40000) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    const r = await G(([c, k]) => { const g = __game.game; if (new Function('return ' + c)()) return true;
      if (g.speeches.length && !(k && g.speeches.some(s => String(s.text).includes(k)))) __game.skipSpeech(); return false; }, [cond, keep]);
    if (r) return true;
    await sleep(80);
  }
  return false;
}
const shot = (page, name) => page.screenshot({ path: path.join(shots, `e6-pa-${name}.png`) });
const until = async (G, fn, arg, ms = 8000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await G(fn, arg)) return true; await sleep(60); } return false; };
const flag = (G, k) => G((k) => __game.getFlag(k), k);
const logHas = (G, t) => G((t) => __game.log.some(l => String(l.text).includes(t)), t);
const logCount = (G, t) => G((t) => __game.log.filter(l => String(l.text).includes(t)).length, t);
const logIdx = (G, t) => G((t) => __game.log.findIndex(l => String(l.text).includes(t)), t);
const idle = (G) => until(G, () => !__game.state().busy && !__game.game.speeches.some(s => s.blocking), null, 60000);
const rapido = (G, on = true) => G((on) => __game.skipText(on), on);
const tele = (G) => G(() => __game.game.getObjState('tele_amazonas').state || 'normal');

async function clic({ page, G }, verbo, id, button = 'left') {
  if (verbo) { const vp = await G((v) => __game.verbPos(v), verbo); await page.mouse.click(vp.x, vp.y); await sleep(80); }
  const c = await G((id) => __game.screenPos(id), id);
  if (!c) { ok(false, `clic: ${id} no está en pantalla`); return; }
  await page.mouse.click(c.x, c.y, { button }); await sleep(120);
}
const opciones = (G) => G(() => __game.currentDialogOptions() || []);
async function clicOpcion({ page, G }, txt) {
  if (!await until(G, () => !!__game.game.choice, null, 15000)) return false;
  await sleep(250);
  const i = (await opciones(G)).findIndex(o => o === txt);
  if (i < 0) return false;
  const p = await G((i) => __game.optionPos(i), i);
  await page.mouse.click(p.x, p.y + 3);
  await sleep(120);
  return true;
}
// [P11] el atasco ya no es jugable: escena automática con el anuncio de Maripaz y el medio cruasán de Jacinto
const viaLines = {
  empujar: 'Les doy un empujoncito.', hablar: '¿Y la próxima reunión, cuándo es?', anuncio: '¡Un momento! ¡Antes de salir, un anuncio',
};
async function comprobarVia(T, via) {
  const { G } = T;
  await rapido(G, true);
  await until(G, () => __game.getFlag('reunion_terminada') && !__game.state().busy, null, 60000);
  const n = {}; for (const [k, t] of Object.entries(viaLines)) n[k] = await logCount(G, t);
  ok(n[via] === 1 && Object.entries(n).every(([k, c]) => k === via || c === 0) && await logCount(G, '¡Ese medio cruasán es mío!') === 1, `vía ${via}: el anuncio y el cruasán de Jacinto, sin otras vías ${JSON.stringify(n)}`);
  const st = await G(() => { const s = __game.state(); return { rt: s.flags.reunion_terminada, at: s.flags.sala_amazonas_atasco, room: s.room,
    merc: ['mercados_1', 'mercados_2', 'mercados_3'].filter(id => s.actors[id] && s.actors[id].room === 'sala_amazonas'), noSave: __game.game.noSave }; });
  ok(st.rt && !st.at && !st.merc.length && !st.noSave && st.room === 'sala_amazonas', `vía ${via}: reunión terminada, atasco cerrado, se puede guardar, Bruno en la Sala ${JSON.stringify(st)}`);
}
/** Clic en Hablar tele → «Buenas noches, Gertrudis.» → «¿Y cuáles…?» (texto real; salta globos hasta el atasco). */
async function porLaTele(T, { capturas = false } = {}) {
  const { page, G } = T;
  await rapido(G, false);
  await G(() => { const g = __game.game; g.__teleSt = []; g.__teleT = setInterval(() => { const s = g.getObjState('tele_amazonas').state || 'normal'; if (g.__teleSt[g.__teleSt.length - 1] !== s) g.__teleSt.push(s); }, 30); });
  await clic(T, 'hablar', 'tele_amazonas');
  ok(await until(G, () => !!__game.game.choice, null, 15000), 'clic en Hablar tele → árbol');
  const o0 = await opciones(G);
  ok(JSON.stringify(o0) === JSON.stringify(['Buenas noches, Gertrudis.', 'Nada.']), `TV0: las opciones del Vending ${JSON.stringify(o0)}`);
  ok(await clicOpcion(T, 'Buenas noches, Gertrudis.'), 'clic en «Buenas noches, Gertrudis.»');
  await saltando(G, "__game.game.speeches.some(s => String(s.text).includes('BUENAS NOCHES, SALA AMAZONAS.'))");
  if (capturas) { await sleep(600); await shot(page, 'tele-buenas-noches'); }
  await saltando(G, '!!__game.game.choice');
  ok(await logHas(G, 'BUENAS NOCHES, SALA AMAZONAS.') && (await tele(G)) === 'gertrudis', 'la tele la sintoniza: «BUENAS NOCHES, SALA AMAZONAS.» y Gertrudis en pantalla');
  const who = await G(() => { const l = __game.log.find(l => String(l.text).includes('BUENAS NOCHES, SALA AMAZONAS.')); return l && l.who; });
  ok(who !== 'player' && who !== 'bruno', `N3 la dice la tele (${who})`);
  const o1 = await opciones(G);
  ok(JSON.stringify(o1) === JSON.stringify(['¿Y cuáles son los siguientes pasos?', 'Nada. Gracias, Gertrudis.']), `TV1: ${JSON.stringify(o1)}`);
  ok(await clicOpcion(T, '¿Y cuáles son los siguientes pasos?'), 'clic en «¿Y cuáles son los siguientes pasos?»');
  await saltando(G, "__game.game.speeches.some(s => String(s.text).includes('PREGUNTA DEL PÚBLICO'))");
  if (capturas) { await sleep(600); await shot(page, 'tele-pregunta'); }
  await saltando(G, "__game.game.speeches.some(s => String(s.text) === '¿Necesitan ayuda?')", '¿Necesitan');
  if (capturas) { await sleep(500); await shot(page, 'necesitan-ayuda'); }
  const enLinea = await G(() => { const g = __game.game, b = g.actors[g.G.player]; return { cut: g.cutscene,
    caras: ['mercados_1', 'mercados_2', 'mercados_3'].map(id => [g.actors[id].dir, Math.sign(b.x - g.actors[id].x)]), cam: g.camTarget, fol: g.camFollow }; });
  ok(enLinea.cut > 0 && enLinea.caras.every(([d, s]) => d === (s < 0 ? 'left' : 'right')), `«¿Necesitan ayuda?» dentro de la cinemática, con los tres girados hacia Bruno ${JSON.stringify(enLinea)}`);
  // [P11] el atasco se resuelve solo (escena): el control vuelve con la reunión ya terminada
  await saltando(G, "__game.getFlag('reunion_terminada') && !__game.state().busy && !__game.game.cutscene");
  const sts = await G(() => { const g = __game.game; clearInterval(g.__teleT); return g.__teleSt; });
  ok(!sts.slice(sts.indexOf('gertrudis')).includes('buscando'), `la escena, sintonizada: sin «BUSCANDO SEÑAL» tras el saludo (${sts.join(' → ')})`);
}

try {
  // ================================================================ §2.3 + §2.2 la vía nueva, con ratón, y el atasco
  console.log('\n§2.3 Hablar tele (clic) → saludo → pregunta → escena; §2.2 el atasco se anuncia y espera 20 s');
  {
    const T = await open();
    const { page, G } = T;
    await porLaTele(T, { capturas: true });
    const s = await G(() => ({ room: __game.state().room, busy: __game.state().busy, ns: __game.game.noSave, rt: __game.getFlag('reunion_terminada'),
      at: __game.getFlag('sala_amazonas_atasco'), gp: __game.getFlag('gertrudis_pregunta'), fol: __game.game.camFollow,
      merc: ['mercados_1', 'mercados_2', 'mercados_3'].map(id => __game.game.actors[id].room) }));
    ok(s.room === 'sala_amazonas' && !s.busy && !s.ns && s.rt && !s.at && s.gp && s.merc.every(r => r !== 'sala_amazonas'), `[P11] el control vuelve con el atasco ya resuelto (escena), se puede guardar ${JSON.stringify(s)}`);
    ok(await logHas(G, '¿Necesitan ayuda?') && await logIdx(G, '¿Necesitan ayuda?') > await logIdx(G, '¡Tengo doble prioridad!'), '«¿Necesitan ayuda?» tras las tres líneas del atasco');
    ok(await logIdx(G, viaLines.anuncio) > await logIdx(G, '¿Necesitan ayuda?'), '[P11] y justo después, el anuncio de Maripaz (sin esperar)');
    ok(await logCount(G, 'LA MANDO A LA PRÓXIMA PANTALLA') === 0, 'no ha hecho falta el Vending');
    ok(!!s.fol, 'la cámara vuelve a seguir a Bruno');
    await comprobarVia(T, 'anuncio');
    // tras la estampida: Hablar tele = lo de siempre (sin árbol) y Mirar a Mercados ya no aplica (se han ido)
    await G(() => __game.clearLog());
    await G(() => __game.doVerb('hablar', 'tele_amazonas'));
    ok(!(await G(() => !!__game.game.choice)) && await logHas(G, '¿Me veis la pantalla?'), 'tras la estampida, Hablar tele: lo de hoy, sin árbol');
    await T.ctx.close();
  }

  // [P11] fuera las otras vías del atasco (Usar puerta, hablar, Coger cruasanes): ya no es jugable

  // ================================================================ §2.3 salidas, repeticiones y orden
  console.log('\n§2.3 «Nada.» en TV0 y «Nada. Gracias, Gertrudis.» en TV1: la tele vuelve a normal y se repite');
  {
    const T = await open();
    const { page, G } = T;
    await rapido(G, true);
    await G(() => __game.doVerb('hablar', 'tele_amazonas'));
    await G(() => __game.chooseText('Nada.'));
    await idle(G);
    ok((await tele(G)) === 'normal' && !(await G(() => !!__game.game.choice)) && !(await flag(G, 'gertrudis_pregunta')), 'TV0 «Nada.»: la tele como estaba, sin pregunta');
    ok(await G(() => !__game.log.some(l => l.text === 'Nada.')), '«Nada.» es silenciosa');
    await G(() => __game.doVerb('hablar', 'tele_amazonas'));
    await G(() => __game.chooseText('Buenas noches, Gertrudis.'));
    await until(G, () => !!__game.game.choice && __game.currentDialogOptions().includes('Nada. Gracias, Gertrudis.'), null, 8000);
    await G(() => __game.chooseText('Nada. Gracias, Gertrudis.'));
    await idle(G);
    ok(await logHas(G, 'E-00: DE NADA. ESO TAMBIÉN SE DICE.') && (await tele(G)) === 'normal' && !(await flag(G, 'gertrudis_pregunta')), 'TV1 «Nada. Gracias, Gertrudis.»: E-00 y la tele a normal');
    // guardar aquí y cargar: el árbol vuelve a salir (repetir TV0)
    await G(() => __game.save(4));
    await G(() => { __game.setFlag('sala_becario_sin_turno', false); });
    await G(() => __game.load(4));
    await idle(G);
    await G(() => __game.clearLog());
    await clic(T, 'hablar', 'tele_amazonas');
    ok(await until(G, () => !!__game.game.choice, null, 8000) && (await opciones(G))[0] === 'Buenas noches, Gertrudis.', 'guardar tras la despedida y cargar → clic en Hablar tele: el árbol (TV0) otra vez');
    await G(() => __game.chooseText('Buenas noches, Gertrudis.'));
    await until(G, () => !!__game.game.choice && __game.currentDialogOptions().includes('Nada. Gracias, Gertrudis.'), null, 8000);
    ok(await logCount(G, 'BUENAS NOCHES, SALA AMAZONAS.') === 1, 'repetido: la tele vuelve a saludar (sin pista nueva)');
    await G(() => __game.chooseText('Nada. Gracias, Gertrudis.'));
    await idle(G);
    ok((await tele(G)) === 'normal' && !(await flag(G, 'sala_amazonas_atasco')), 'segunda despedida: tele a normal, sin atasco');
    void page;
    await T.ctx.close();
  }

  console.log('\n§2.3 antes de Gervasio: sin árbol; Usar tele con «sin turno»: la pista de siempre');
  {
    const T = await open({ ...FLAGS_A2, sala_amazonas_orden_visto: true });
    const { G } = T;
    await G(() => __game.doVerb('hablar', 'tele_amazonas'));
    ok(!(await G(() => !!__game.game.choice)) && await logHas(G, '¿Me veis la pantalla?'), 'Hablar tele antes del «sin turno»: lo de hoy');
    await G(() => __game.setFlag('sala_becario_sin_turno', true));
    await G(() => __game.clearLog());
    await G(() => __game.doVerb('mirar', 'tele_amazonas'));   // E7 F2: la pista pasa a Mirar (y Cerrar); Usar = Hablar
    ok(await logHas(G, 'Alguien con wifi y rencor la encontraría enseguida.') && !(await flag(G, 'sala_amazonas_atasco')) && !(await G(() => !!__game.game.choice)), 'Mirar tele con «sin turno»: «wifi y rencor» (pista de las dos vías; E7)');
    // Mirar a Mercados sin atasco: su línea de siempre
    await G(() => __game.doVerb('mirar', 'mercados_1'));
    ok(await logHas(G, 'Fermín Plazofijo, de Mercados. Cuando empezó') && !(await logHas(G, 'encajados en el marco')), 'Mirar a Fermín sin atasco: lo de siempre');
    await T.ctx.close();
  }

  console.log('\n§2.3 la vía del Vending entera (XE6-3): pregunta en el Vending → Hablar tele → escena sin árbol');
  {
    const T = await open(SIN_TURNO, 'office', 'pecera');
    const { G } = T;
    await clic(T, 'hablar', 'gertrudis');
    ok(await clicOpcion(T, '¿Y cuáles son los siguientes pasos?'), 'Vending: clic en «¿Y cuáles son los siguientes pasos?»');
    await rapido(G, true); await idle(G);
    ok(await flag(G, 'gertrudis_pregunta') && await logHas(G, 'LA MANDO A LA PRÓXIMA PANTALLA QUE ME SINTONICE.'), 'Gertrudis la reenvía (LCD de hoy)');
    await goto(T, 'sala_amazonas', 'pajarera');
    await G(() => __game.clearLog());
    await rapido(G, false);
    await G(() => { const g = __game.game; g.__sawChoice = false; g.__sawBusca = false; g.__t = setInterval(() => { if (g.choice) g.__sawChoice = true; if (g.getObjState('tele_amazonas').state === 'buscando') g.__sawBusca = true; }, 20); });
    await clic(T, 'hablar', 'tele_amazonas');
    await saltando(G, "__game.getFlag('reunion_terminada') && !__game.state().busy && !__game.game.cutscene");
    const s = await G(() => { const g = __game.game; clearInterval(g.__t); return { ch: g.__sawChoice, bus: g.__sawBusca }; });
    ok(!s.ch && s.bus && await logHas(G, 'PREGUNTA DEL PÚBLICO') && !(await logHas(G, 'BUENAS NOCHES, SALA AMAZONAS.')), `Hablar tele: escena directa, con «BUSCANDO SEÑAL», sin árbol ni N3 ${JSON.stringify(s)}`);
    ok(await logHas(G, '¿Necesitan ayuda?'), 'por el Vending también se anuncia el atasco');
    await comprobarVia(T, 'anuncio');
    await T.ctx.close();
  }

  console.log('\n§2.3 guardar con la pregunta hecha (sin estampida), cargar, Usar tele → escena');
  {
    const T = await open({ ...SIN_TURNO, gertrudis_pregunta: true });
    const { G } = T;
    await G(() => __game.save(5));
    await G(() => { __game.setFlag('gertrudis_pregunta', false); });
    await G(() => __game.load(5));
    await idle(G);
    await G(() => __game.clearLog());
    ok(await flag(G, 'gertrudis_pregunta') && !(await flag(G, 'reunion_terminada')), 'cargada: la pregunta hecha y la reunión en marcha');
    await rapido(G, false);
    await clic(T, 'usar', 'tele_amazonas');
    await saltando(G, "__game.getFlag('reunion_terminada') && !__game.state().busy && !__game.game.cutscene");
    ok(await logHas(G, 'PREGUNTA DEL PÚBLICO') && await logHas(G, '¿Necesitan ayuda?'), 'Usar tele → escena y atasco');
    await comprobarVia(T, 'anuncio');
    await T.ctx.close();
  }

  console.log('\n§2.3 [P11] Esc durante la escena sintonizada: el atasco (escena) se resuelve igual');
  {
    const T = await open();
    const { page, G } = T;
    await rapido(G, false);
    await clic(T, 'hablar', 'tele_amazonas');
    ok(await clicOpcion(T, 'Buenas noches, Gertrudis.'), 'clic en el saludo');
    await saltando(G, '!!__game.game.choice');
    ok(await clicOpcion(T, '¿Y cuáles son los siguientes pasos?'), 'clic en la pregunta');
    await until(G, () => __game.game.cutscene > 0, null, 5000);
    await sleep(500);
    await page.keyboard.press('Escape');
    await saltando(G, "__game.getFlag('reunion_terminada') && !__game.state().busy && !__game.game.cutscene");
    const s = await G(() => ({ at: __game.getFlag('sala_amazonas_atasco'), rt: __game.getFlag('reunion_terminada'), ns: __game.game.noSave,
      cut: __game.game.cutscene, fol: !!__game.game.camFollow, menu: !!__game.game.menu,
      merc: ['mercados_1', 'mercados_2', 'mercados_3'].filter(id => __game.game.actors[id].room === 'sala_amazonas').length }));
    ok(!s.at && s.rt && !s.ns && s.merc === 0 && !s.cut && s.fol && !s.menu, `Esc: reunión terminada, cinemática cerrada, cámara con Bruno, se puede guardar ${JSON.stringify(s)}`);
    await T.ctx.close();
  }

  console.log('\n§7 paso 28 del recorrido de 49 en modo rápido (atasco por la vía del anuncio, tras «¿Necesitan ayuda?»)');
  {
    const T = await open();
    const { G } = T;
    await rapido(G, true);
    await G(() => __game.doVerb('hablar', 'tele_amazonas'));
    await G(() => __game.chooseText('Buenas noches, Gertrudis.'));
    await until(G, () => !!__game.game.choice && __game.currentDialogOptions().includes('¿Y cuáles son los siguientes pasos?'), null, 8000);
    await G(() => __game.chooseText('¿Y cuáles son los siguientes pasos?'));
    await until(G, () => __game.getFlag('reunion_terminada') && !__game.state().busy, null, 60000);
    const s = await G(() => ({ f: ['gertrudis_pregunta', 'reunion_terminada', 'sala_amazonas_estampida'].map(k => !!__game.getFlag(k)), room: __game.state().room }));
    ok(s.f.every(Boolean) && s.room === 'sala_amazonas', `flags del paso 28 y Bruno en la Sala ${JSON.stringify(s)}`);
    const ia = await logIdx(G, '¿Necesitan ayuda?'), ib = await logIdx(G, 'anuncio de cinco segundos');
    ok(ia >= 0 && ib > ia, `modo rápido: «¿Necesitan ayuda?» y después el anuncio (${ia} < ${ib})`);
    await T.ctx.close();
  }
} catch (e) {
  failures++; console.log('  ✗ excepción: ' + (e && e.stack || e));
} finally {
  const errs = consoleErrors.filter(e => !/favicon/.test(e));
  ok(errs.length === 0, `sin errores de consola${errs.length ? ': ' + errs.slice(0, 5).join(' | ') : ''}`);
  await browser.close();
  server.close();
  console.log(`\n${checks - failures}/${checks} comprobaciones OK`);
  process.exit(failures ? 1 : 0);
}
