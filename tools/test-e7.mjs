#!/usr/bin/env node
// PRUEBA DE INTEGRACIÓN DE LA ENMIENDA E7 (I2, docs/guion2/ENMIENDA_E7.md §10), con ratón y dedo reales donde importa.
// Capturas en tools/shots/e7-*.png (MIRARLAS). Cubre:
//   §2.1 el nudo del Acto II: objetivo `nota` y meta N6 delante del fax (`catacumba`), `cms` y N7 en la Redacción; Mirar a
//        Bruno y la abuela delante del fax sin papel hablan del papel, no del CMS; Aurora N1-N2 (flag `oyo_papel_begona`),
//        la ficha con N11 y N9; Begoña N3-N4 (una vez); el sobre de azúcar abre el impreso sin el saludo (Dar a Begoña y
//        Usar con la ventanilla); «Importe cero» → N5 sin dar la nota por presentada; la nota entera por el sobre.
//   §2.2 la tele: Mirar y Cerrar con «sin turno» → «wifi y rencor»; Usar tele = Hablar (árbol, estampida); Usar la caja
//        de cables, igual; la vía del Vending intacta (con `gertrudis_pregunta`, la escena sin árbol).
//   §2.3 D3 (Gervasio) por su camino (Hablar → «Necesito el acta…»), con ratón: «escribiendo…», interrumpir una y dos veces
//        sin fallo (la trampa del R07), ganar con el remate, perder, retirarse en el remate, cargar a mitad una partida de
//        antes del duelo (ninguna escritura viva), Esc; y con el dedo (844 × 390). F3 tras el remate.
//   §2.4 F4 (Evaristo se va a escribir; el aviso del correo, una vez), F6 (dos tiempos; fuera las tres; dentro «Nos hemos
//        quedado sin IA de la casa.»).
//   §3-4 una muestra de 20 golpes restaurados, oídos en el juego; la tabla entera aplicada en el código; EXP-4 y E103
//        intactas; escenas/final.js sin tocar.
//   §7-8 el recorrido de 49 pasos (modo rápido): medida del camino principal frente a E6 (553 líneas · 32,4 min) y el
//        aviso de remate seco por personaje (≤ 30 % de lo oído); `text-audit --estatico --plan --e2 --e5 --e6 --recuento`.
//   node tools/test-e7.mjs [--solo=nudo,tele,d3,f4,f6,golpes,camino]
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createServer } from './serve.mjs';
import { STEPS } from './walk-data.mjs';
import { createRunner } from './walk-lib.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const shots = path.join(here, 'shots'); fs.mkdirSync(shots, { recursive: true });
const args = Object.fromEntries(process.argv.slice(2).filter(a => a.startsWith('--')).map(a => { const [k, v] = a.slice(2).split('='); return [k, v ?? true]; }));
const solo = args.solo ? String(args.solo).split(',') : null;
const toca = (k) => !solo || solo.includes(k);
const server = createServer(root);
await new Promise(r => server.listen(0, r));
const base = `http://localhost:${server.address().port}/`;
const browser = await chromium.launch();
let failures = 0, checks = 0;
const ok = (c, m) => { checks++; if (c) console.log('  ✓ ' + m); else { failures++; console.log('  ✗ ' + m); } };
const errs = [];
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const ACTO1 = { intro_vista: true, torno_abierto: true, inigo_presentado: true, ecosistema_interstitial: true };
const ACTO2 = { ...ACTO1, acto_2_iniciado: true, chaqueta_cogida: true, chaqueta_en_lector: true, silla_libre: true,
  gertrudis_saludada: true, cafetera_viral: true, cafetera_viral_vista: true };
const D3F = { ...ACTO2, acto_3_iniciado: true, rep_07: true, rep_03: true, rep_01: true, rep_05: true };
const PL = (s) => s.replace(/'/g, "\\'");

async function open(flags, room, inv = [], ctxOpts = { viewport: { width: 960, height: 600 } }) {
  const ctx = await browser.newContext(ctxOpts);
  const page = await ctx.newPage();
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', e => errs.push('pageerror: ' + e.message));
  await page.goto(base + '?room=vestibulo');
  await page.waitForFunction(() => window.__game && __game.state().mode === 'play');
  const G = (fn, a) => page.evaluate(fn, a);
  await G(() => { __game.skipText(true); return __game.waitIdle(); });
  await G((F) => { for (const [k, v] of Object.entries(F)) __game.setFlag(k, v); }, flags);
  await G((inv) => { for (const i of inv) if (!__game.game.state.inventory.includes(i)) __game.game.state.inventory.push(i); }, inv);
  await G((r) => __game.gotoRoom(r), room);
  await G(() => { __game.skipSpeech(); return __game.waitIdle(); });
  await G(() => { __game.skipText(false); __game.skipSpeech(); __game.game.speeches.length = 0; __game.clearLog(); });
  const tactil = !!ctxOpts.hasTouch;
  const until = async (fn, arg, ms = 12000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await G(fn, arg)) return true; await sleep(40); } return false; };
  const untilSkip = async (fn, arg, ms = 12000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { await G(() => __game.skipSpeech()); if (await G(fn, arg)) return true; await sleep(40); } return false; };
  const tap = async (x, y) => { if (tactil) await page.touchscreen.tap(x, y); else await page.mouse.click(x, y); };
  const clickOpt = async (i) => { const p = await G(i => __game.optionPos(i), i); await tap(p.x, p.y + 2); };
  const clicOpcion = async (txt) => {
    if (!(await until(() => !!__game.currentDialogOptions()))) return false;
    await sleep(300);
    const i = (await G(() => __game.currentDialogOptions())).findIndex(o => o.includes(txt));
    if (i < 0) return false;
    await clickOpt(i); await sleep(120); return true;
  };
  const verA = (id) => G((id) => {
    const g = __game.game, o = __game.objects().find(o => o.id === id) || (g.actors[id] && { x: g.actors[id].x - 10, w: 20 });
    if (!o) return; const cx = o.x + o.w / 2;
    g.camFollow = null; g.camTarget = null; g.camX = Math.max(0, Math.min(g.room.width - 320, Math.round(cx - 160)));
  }, id);
  const seguir = () => G(() => { __game.game.camFollow = __game.game.G.player; });
  const raton = async (verbo, id, item) => {
    const v = await G(v => __game.verbPos(v), verbo); await tap(v.x, v.y); await sleep(50);
    if (item) { const c = await G(i => __game.invPos(i), item); await tap(c.x, c.y); await sleep(50); }
    await verA(id); await sleep(60);
    const c = await G(id => __game.screenPos(id), id); await tap(c.x, c.y);
  };
  const logHas = (t) => G(t => __game.log.some(l => String(l.text).includes(t)), t);
  const logIs = (t) => G(t => __game.log.some(l => String(l.text) === t), t);
  const logIdx = (t) => G(t => __game.log.findIndex(l => String(l.text).includes(t)), t);
  const D = () => G(() => { const d = __game.game.duelInfo; return d && { phase: d.phase, attack: d.attack, body: d.body, esc: d.escribiendo, inter: d.interrumpeN, hits: d.hits, misses: d.misses,
    ci: d.correctIndex, pairs: d.optionPairs, subject: d.subject, options: d.options }; });
  const menuReply = () => untilSkip(() => { const g = __game.game; return !!(g.choice && g.duelInfo && g.duelInfo.phase === 'reply' && g.duelInfo.options); }, null, 20000);
  const shot = (name) => page.screenshot({ path: path.join(shots, `e7-${name}.png`) });
  const idle = () => G(() => __game.waitIdle());
  return { ctx, page, G, until, untilSkip, clickOpt, clicOpcion, raton, seguir, logHas, logIs, logIdx, D, menuReply, shot, idle, tap };
}
const objetivo = (G, sala) => G(async (sala) => { const m = await import('./engine/objetivos.js'); return { actual: m.actual(__game.game, sala), meta: m.meta(__game.game, sala) }; }, sala);
const llamada = (G) => G(async () => { __game.clearLog(); await __game.scene('pistas'); return __game.log.filter(l => l.who === 'abuela_remedios' || l.who === 'bruno').map(l => (l.who === 'bruno' ? 'B: ' : 'A: ') + l.text); });

try {
  // ====================================================================== código: tabla, vetos, final
  console.log('§3-4 · la tabla de E7 en el código; EXP-4, E103 y la cadena final, intactas');
  {
    const { filas } = await import('../docs/guion2/e7/tabla_e7.mjs');
    const lit = (await import('./plan-rules.mjs')).literales;
    const src = (f) => fs.readFileSync(path.join(root, 'content', f), 'utf8');
    const malas = [];
    // [bloqueos] filas de pistas.js que la ronda de bloqueos rehace a propósito (el nivel 3 de Bruno dice sitio y verbo)
    const SUSTITUIDAS = new Set(['P-nota3b', 'P-turno3', 'P-acta3b',
      'E183', 'X10',     // [guion3 t1] [P10] «Por eso lleva pop-up.» y [P13] el murmullo de Yoli del nombre nuevo
      'E124', 'N7', 'N9']);   // [guion3 t2] [P11] Herminia mide, corta (fuera «Ya te la ha leído…»); el CMS, condición del HUECO:
                              // la meta y la nota al margen nuevas (comprobadas abajo, en el nudo, y en test-guion3-t2)
    for (const r of filas) {
      if (SUSTITUIDAS.has(r.id)) continue;
      const L = lit(src(r.fichero));
      if (L.includes(r.actual) && !filas.some(o => o !== r && o.fichero === r.fichero && o.nuevo === r.actual)) malas.push(`${r.id}: sigue «${r.actual}»`);
      if (r.nuevo != null && !L.includes(r.nuevo)) malas.push(`${r.id}: falta «${r.nuevo}»`);
    }
    ok(!malas.length, `las ${filas.length} filas de tabla_e7.mjs, aplicadas (cada «actual» fuera, cada «nuevo» dentro)${malas.length ? ': ' + malas.slice(0, 6).join(' · ') : ''}`);
    const esc = src('rooms/pecera.escenas.js'), dia = src('rooms/pecera.dialogos.js'), fin = src('escenas/final.js');
    ok(esc.includes(`[Y, 'Y un comentario: «abrígate». La cuenta de siempre.']`), 'EXP-4 (veto): «Y un comentario: «abrígate». La cuenta de siempre.», tal cual');
    ok(dia.includes(`'Menos una lectora: cuarenta y siete minutos, y comenta «abrígate» en todo.'`) && !dia.includes('Comenta «abrígate». En todo.'), 'E103 no vuelve: «…y comenta «abrígate» en todo.»');
    ok(fin.includes(`'Menos esa cuenta que comenta «abrígate» en todo...'`) && fin.includes(`'Y te pongo «abrígate». Que nunca contestas.'`), 'escenas/final.js: la cadena final y el epílogo, como estaban');
    ok(!esc.includes('Él cree que avanza.') && !fs.readFileSync(path.join(root, 'content/escenas/climax.js'), 'utf8').includes('Él cree que avanza.'), 'EXP-3 fuera del clímax');
  }

  // ====================================================================== el nudo del Acto II
  if (toca('nudo')) {
    console.log('\n§2.1 · el nudo del Acto II (delante del fax sin papel)');
    const NUDO = { ...ACTO2, aurora_conto_pasos: true, aurora_hablo_fax: true, cms_vivo: false };
    const T = await open(NUDO, 'catacumba', ['ficha_pagina_7', 'sobre_azucar']);
    const { page, G, until, untilSkip, clicOpcion, raton, seguir, logHas, logIs, shot, idle } = T;
    let O = await objetivo(G, 'catacumba');
    ok(O.actual === 'nota' && O.meta === 'Teodoro no habla sin papel. Y en esta casa no queda un folio sin sellar.', `delante del fax: objetivo «nota» y meta N6 («${O.meta}»)`);
    O = await objetivo(G, 'pecera');
    // [P11] el CMS cuelga del HUECO: sin haber oído a Maripaz, en la Redacción manda la reunión; tras oírla, el CMS
    ok(O.actual === 'reunion' && O.meta === 'La página 7 se decide en esa reunión. Y esa reunión no se acaba nunca.', `[P11] en la Redacción, sin haber oído a Maripaz: la reunión («${O.meta}»)`);
    await G(() => __game.setFlag('maripaz_pide_web', true));
    O = await objetivo(G, 'pecera');
    ok(O.actual === 'cms' && O.meta === 'Sin web, Maripaz no pasa a Siestatón. Y la web no publica desde las cuatro.', `[P11] tras oír a Maripaz: el CMS, con la meta nueva («${O.meta}»)`);
    await G(() => { __game.skipText(true); __game.clearLog(); });
    await G(() => __game.doVerb('mirar', 'bruno')); await idle();
    ok(await logIs('Teodoro no habla sin papel. Y en esta casa no queda un folio sin sellar.') && !(await logHas('CMS')), 'Mirar a Bruno delante del fax: el papel (N6), ni una palabra del CMS');
    const L = await llamada(G);
    ok(L.includes('A: En las oficinas sin papel siempre hay una que lo gasta en decir que no.') && !L.some(l => /CMS|apágale|Apágale|tele de tu abuelo/.test(l)), `la abuela delante del fax: el papel, no el CMS (${L.filter(l => l.startsWith('A: ')).slice(-2).join(' / ')})`);
    // Aurora (ratón real)
    await G(() => { __game.skipText(false); __game.clearLog(); });
    await raton('hablar', 'aurora_galerada');
    ok(await untilSkip(() => (__game.currentDialogOptions() || []).includes('¿De dónde saco papel para el fax?'), null, 15000), 'Aurora: opción «¿De dónde saco papel para el fax?»');
    const ops = await G(() => __game.currentDialogOptions());
    ok(ops.indexOf('¿De dónde saco papel para el fax?') === ops.indexOf('¿Cómo convenzo a Teodoro?') + 1 || ops.indexOf('¿Cómo convenzo a Teodoro?') < 0, `justo después de «¿Cómo convenzo a Teodoro?» (${ops.join(' | ')})`);
    await page.mouse.move(5, 5); await sleep(250); await shot('nudo-aurora');
    await clicOpcion('¿De dónde saco papel para el fax?');
    ok(await until(() => __game.game.speeches.some(s => s.text === 'Papel, en esta casa, solo gasta Begoña. Lo devuelve por triplicado.'), null, 15000), 'Aurora: N2, en pantalla');
    await sleep(500); await shot('nudo-aurora-n2');
    await G(() => __game.skipText(true));
    ok(await untilSkip(() => !!__game.currentDialogOptions(), null, 8000) && !(await G(() => __game.currentDialogOptions().includes('¿De dónde saco papel para el fax?'))), 'la opción no vuelve (once)');
    ok(await G(() => __game.getFlag('oyo_papel_begona') === true), 'oyo_papel_begona');
    await G(() => __game.closeDialog ? __game.closeDialog() : null).catch(() => {});
    await G(() => { if (__game.game.choice) __game.game.choice.resolve(-1); });
    await until(() => !__game.game.choice && !__game.game.busy, null, 6000); await seguir();
    // la ficha
    await G(() => __game.clearLog());
    await G(() => __game.doVerb('mirar', 'ficha_pagina_7')); await idle();
    const F = await G(() => __game.log.filter(l => l.who === 'bruno').map(l => l.text));
    ok(F.includes('FIRMA: el fax no tiene papel. El papel, en esta casa, sale de Begoña.') && F.includes('Al margen, a lápiz: «CMS en coma. Sin web, Maripaz no suelta la página».') && !F.includes('FIRMA: Teodoro solo habla por fax. Y el fax no tiene papel.'),
      `ficha: N11 y el margen ([P14] el de Maripaz, ya oída) (${F.slice(-2).join(' / ')})`);
    await G(() => __game.skipText(false));
    G(() => __game.doVerb('mirar', 'ficha_pagina_7'));
    await until(() => __game.game.speeches.some(s => /^FIRMA: el fax no tiene papel/.test(s.text)), null, 20000);
    await sleep(500); await shot('nudo-ficha');
    await G(() => __game.skipText(true)); await idle();
    // Begoña: los folios
    await G(() => __game.gotoRoom('administracion')); await idle(); await seguir();
    await G(() => { __game.skipSpeech(); __game.game.speeches.length = 0; __game.clearLog(); __game.skipText(false); });
    await raton('hablar', 'begona_triplicado');
    ok(await untilSkip(() => (__game.currentDialogOptions() || []).includes('¿Me da unos folios? Son para el fax de Teodoro.'), null, 20000), 'Begoña: «¿Me da unos folios? Son para el fax de Teodoro.»');
    const ob = await G(() => __game.currentDialogOptions());
    ok(ob.indexOf('¿Me da unos folios? Son para el fax de Teodoro.') === ob.indexOf('Quiero presentar una nota de gasto.') + 1, `justo debajo de «Quiero presentar una nota de gasto.» (${ob.join(' | ')})`);
    await page.mouse.move(5, 5); await sleep(250); await shot('nudo-begona');
    await clicOpcion('¿Me da unos folios?');
    ok(await until(() => __game.game.speeches.some(s => s.text === 'Folios no doy. De esta ventanilla solo sale papel rechazado.'), null, 15000), 'Begoña: N4, en pantalla');
    await sleep(400); await shot('nudo-begona-n4');
    await G(() => __game.skipText(true));
    ok(await untilSkip(() => !!__game.currentDialogOptions(), null, 8000) && !(await G(() => __game.currentDialogOptions().some(o => o.startsWith('¿Me da unos folios?')))), 'la de los folios no vuelve');
    // «Importe cero» → N5, sin dar la nota por presentada
    await clicOpcion('Quiero presentar una nota de gasto.');
    await clicOpcion('Nada. Importe cero. No he gastado nada.');
    ok(await untilSkip(() => __game.log.some(l => l.text === 'Un trámite bien hecho, y ni un papel. Lo pongo en «logros».'), null, 10000), '«Importe cero» → N5');
    ok(await untilSkip(() => (__game.currentDialogOptions() || []).includes('Quiero presentar una nota de gasto.'), null, 8000) && !(await G(() => __game.getFlag('nota_gasto_presentada'))), 'vuelve a B0 con la nota aún en el menú (aprobar no da papel)');
    await G(() => { if (__game.game.choice) __game.game.choice.resolve(-1); });
    await until(() => !__game.game.choice && !__game.game.busy, null, 6000); await seguir();
    // el sobre de azúcar: Dar a Begoña (ratón) → impreso sin saludo
    await G(() => { __game.clearLog(); __game.skipText(true); });
    await raton('dar', 'begona_triplicado', 'sobre_azucar');
    ok(await untilSkip(() => (__game.currentDialogOptions() || []).includes('Café para entender el capitalismo.'), null, 15000), 'Dar el sobre a Begoña: se abre el impreso (B_NOTA)');
    ok(await logIs('¿Un sobre de azúcar? Sin nota de gasto, esto es azúcar.') && await logHas('Uno: concepto. Dos: importe. Tres: justificante.') && !(await logHas('Son las 19:07')), 'la línea de siempre, sin «Son las 19:07…», y el impreso');
    await G(() => { if (__game.game.choice) __game.game.choice.resolve(-1); });
    await until(() => !__game.game.choice && !__game.game.busy, null, 6000); await seguir();
    await G(() => { __game.clearLog(); });
    await G(() => __game.doVerb('hablar', 'begona_triplicado'));
    ok(await untilSkip(() => !!__game.currentDialogOptions(), null, 8000) && await logHas('Son las 19:07'), 'después, Hablar con Begoña conserva su saludo (ENTRADA no se queda puesta)');
    await G(() => { if (__game.game.choice) __game.game.choice.resolve(-1); });
    await until(() => !__game.game.choice && !__game.game.busy, null, 6000); await seguir();
    // Usar el sobre con la ventanilla → el mismo impreso, y la nota entera por ahí
    await G(() => __game.clearLog());
    await raton('usar', 'ventanilla', 'sobre_azucar');
    ok(await untilSkip(() => (__game.currentDialogOptions() || []).includes('Café para entender el capitalismo.'), null, 15000) && !(await logHas('Son las 19:07')), 'Usar el sobre con la ventanilla: el impreso, sin saludo');
    for (const t of ['Café para entender el capitalismo.', 'Lo que sea.', 'Aquí tiene. Un sobre de azúcar. Es casi un ticket.', 'Pues enséñeme cómo es una nota bien hecha']) ok(await clicOpcion(t), `clic en «${t}»`);
    ok(await untilSkip(() => __game.getFlag('nota_gasto_presentada') === true, null, 20000), 'la nota entera por el sobre: nota_gasto_presentada');
    const inv = await G(() => __game.game.state.inventory.slice());
    ok(inv.includes('fotocopia_nota_direccion') && inv.includes('copias_rechazadas') && !inv.includes('sobre_azucar'), 'fotocopia de Gervasio y copias rechazadas');
    await G(() => { if (__game.game.choice) __game.game.choice.resolve(-1); });
    await until(() => !__game.game.choice && !__game.game.busy, null, 6000);
    await G(() => __game.clearLog());
    await G(() => __game.doVerb('dar', 'begona_triplicado', 'ficha_pagina_7')); await idle();
    ok(await logHas('Tres casillas. Bien. Pero ninguna dice «importe».'), 'Dar la ficha a Begoña: la de siempre');
    await T.ctx.close();
  }

  // ====================================================================== la tele
  if (toca('tele')) {
    console.log('\n§2.2 · la tele: Usar = Hablar; «wifi y rencor» con Mirar y Cerrar');
    const SALA = { ...ACTO2, sala_amazonas_orden_visto: true, sala_becario_sin_turno: true };
    {
      const T = await open(SALA, 'sala_amazonas');
      const { page, G, until, untilSkip, clicOpcion, raton, logHas, shot, idle } = T;
      await G(() => { __game.skipText(true); __game.clearLog(); });
      await G(() => __game.doVerb('mirar', 'tele_amazonas')); await idle();
      ok(await logHas('«BUSCANDO SEÑAL». Alguien con wifi y rencor la encontraría enseguida.') && !(await G(() => !!__game.game.choice)), 'Mirar tele con «sin turno»: «wifi y rencor», sin árbol');
      await G(() => __game.clearLog());
      await G(() => __game.doVerb('cerrar', 'tele_amazonas')); await idle();
      ok(await logHas('Alguien con wifi y rencor la encontraría enseguida.') && !(await G(() => !!__game.game.choice)), 'Cerrar tele: «wifi y rencor» (igual que antes)');
      await G(() => { __game.clearLog(); __game.skipText(false); });
      await raton('usar', 'tele_amazonas');
      ok(await untilSkip(() => (__game.currentDialogOptions() || []).includes('Buenas noches, Gertrudis.'), null, 15000), 'Usar tele (ratón real): el árbol de la tele');
      ok(!(await logHas('wifi y rencor')), 'sin «wifi y rencor» al Usar');
      await page.mouse.move(5, 5); await sleep(300); await shot('tele-usar');
      await G(() => __game.skipText(true));
      await clicOpcion('Buenas noches, Gertrudis.');
      await clicOpcion('¿Y cuáles son los siguientes pasos?');
      ok(await untilSkip(() => __game.getFlag('reunion_terminada') === true && __game.getFlag('gertrudis_pregunta') === true, null, 30000), 'Usar tele → «¿Y cuáles son los siguientes pasos?» → estampida (reunion_terminada)');
      await T.ctx.close();
    }
    {
      const T = await open(SALA, 'sala_amazonas');
      const { G, untilSkip, logHas, idle } = T;
      await G(() => { __game.skipText(true); __game.clearLog(); });
      await G(() => __game.doVerb('usar', 'caja_cables'));
      ok(await untilSkip(() => (__game.currentDialogOptions() || []).includes('Buenas noches, Gertrudis.'), null, 15000) && !(await logHas('wifi y rencor')), 'Usar la caja de cables: el mismo árbol');
      await G(() => { if (__game.game.choice) __game.game.choice.resolve(-1); }); await idle();
      await G(() => { __game.clearLog(); });
      await G(() => __game.doVerb('hablar', 'tele_amazonas'));
      ok(await untilSkip(() => (__game.currentDialogOptions() || []).includes('Buenas noches, Gertrudis.'), null, 15000), 'Hablar con la tele: el árbol (igual que en E6)');
      await G(() => { if (__game.game.choice) __game.game.choice.resolve(-1); }); await idle();
      // la vía del Vending: con la pregunta hecha, Usar la tele lanza la escena sin árbol
      await G(() => { __game.setFlag('gertrudis_pregunta', true); __game.clearLog(); });
      await G(() => __game.doVerb('usar', 'tele_amazonas'));
      ok(await untilSkip(() => __game.getFlag('reunion_terminada') === true, null, 30000) && await logHas('PREGUNTA DEL PÚBLICO') && !(await logHas('BUENAS NOCHES, SALA AMAZONAS.')), 'vía del Vending intacta: con la pregunta, la escena sin árbol');
      await T.ctx.close();
    }
    {
      const T = await open({ ...ACTO2, sala_amazonas_orden_visto: true }, 'sala_amazonas');
      const { G, logHas, idle } = T;
      await G(() => { __game.skipText(true); __game.clearLog(); });
      await G(() => __game.doVerb('usar', 'tele_amazonas')); await idle();
      ok(!(await G(() => !!__game.game.choice)) && !(await logHas('wifi y rencor')), 'antes del «sin turno», Usar tele: la rotación de siempre (sin árbol ni pista)');
      await T.ctx.close();
    }
  }

  // ====================================================================== D3 por su camino
  if (toca('d3')) {
    console.log('\n§2.3 · D3 (Gervasio) por su camino, con ratón: escribiendo, interrupciones, ganar, perder, retirarse, cargar, Esc');
    const empezar = async (T) => {
      const { G, untilSkip, clicOpcion, raton } = T;
      await raton('hablar', 'gervasio_acta');
      ok(await untilSkip(() => (__game.currentDialogOptions() || []).some(o => o.startsWith('Necesito el acta de la última reunión.')), null, 20000), 'Hablar con Gervasio: «Necesito el acta de la última reunión.»');
      await clicOpcion('Necesito el acta de la última reunión.');
    };
    {
      const T = await open(D3F, 'pajarera', ['fotocopia_nota_direccion']);
      const { page, G, until, untilSkip, clickOpt, logIs, D, menuReply, shot } = T;
      await empezar(T);
      ok(await menuReply(), 'el duelo abre su menú');
      let I = await D();
      ok(I.attack === 'R07' && I.esc === true, 'R07 con Gervasio escribiendo');
      await page.mouse.move(5, 5); await sleep(700); await shot('d3-escribiendo');
      const px = await G(() => { const g = __game.game, d = g.ctx.getImageData(0, 0, 320, 200).data; let n = 0;
        for (let y = 26; y < 48; y++) for (let x = 0; x < 320; x++) { const i = (y * 320 + x) * 4; if (d[i] === 0x9a && d[i + 1] === 0xa4 && d[i + 2] === 0xc8) n++; } return n; });   // rediseño del duelo: en el cuerpo, COL.mail.label
      ok(px > 20, `«escribiendo…» pintado en el cuerpo del correo, detrás del trozo (#9aa4c8, ${px} px)`);
      // la trampa del R07: contestar la del R03 en cuanto se ve «Esto se necesitaba para...»
      const i03 = I.pairs.indexOf('R03');
      await clickOpt(i03 >= 0 ? i03 : 0);
      ok(await until(() => __game.game.speeches.some(s => s.text === 'Me has interrumpido. Se apunta.'), null, 15000), 'la trampa (R03 antes de tiempo): «Me has interrumpido. Se apunta.»');
      await sleep(400); await shot('d3-interrumpe');
      ok(await menuReply(), 'el mismo ataque vuelve');
      I = await D(); ok(I.misses === 0 && I.inter === 1 && I.attack === 'R07' && !/RE: RE:/.test(I.subject), `caer en la trampa no cuenta fallo (fallos ${I.misses}, «${I.subject}»)`);
      await sleep(250); await clickOpt(I.ci);
      ok(await untilSkip(() => __game.game.duelInfo && __game.game.duelInfo.interrumpeN === 2, null, 10000), 'interrumpir con la buena también corta (2.ª)');
      ok(await menuReply(), 'menú');
      ok(await until(() => __game.game.duelInfo && __game.game.duelInfo.escribiendo === false, null, 15000), 'esperar a que acabe');
      I = await D(); ok(I.misses === 0, `dos interrupciones, 0 fallos`);
      await page.mouse.move(5, 5); await sleep(200); await shot('d3-acabada');
      await clickOpt(I.ci);
      ok(await untilSkip(() => __game.game.duelInfo && __game.game.duelInfo.hits === 1, null, 10000), 'R07 esperando: acierto');
      ok(await menuReply(), 'R03');
      // Esc a mitad de la escritura
      await page.keyboard.press('Escape');
      ok(await G(() => !!__game.game.menu), 'Esc: menú de pausa');
      const b0 = (await D()).body; await sleep(2600);
      ok((await D()).body === b0 && (await D()).esc === true, 'en pausa, Gervasio no escribe');
      await page.keyboard.press('Escape');
      ok(await until(() => __game.game.duelInfo && __game.game.duelInfo.escribiendo === false, null, 10000), 'al volver, acaba la frase');
      I = await D();
      ok(I.body === 'El acta se necesitaba para... para... para ayer.', `R03 entera: «${I.body}»`);
      await clickOpt(I.ci);
      ok(await untilSkip(() => __game.game.duelInfo && __game.game.duelInfo.phase === 'finisher' && !!__game.game.choice, null, 15000), 'remate');
      I = await D(); await clickOpt(I.options.indexOf('[Usar objeto]'));
      ok(await until(() => !!__game.game.itemPick), 'elige objeto');
      const ip = await G(() => __game.invPos('fotocopia_nota_direccion'));
      await page.mouse.move(ip.x, ip.y); await sleep(120); await page.mouse.click(ip.x, ip.y);
      ok(await untilSkip(() => !__game.game.duelActive, null, 25000) && await G(() => !!__game.game.state.flags['duel:gervasio:won']), 'ganado con la nota de la comida');
      await untilSkip(() => __game.state().mode === 'play' && !__game.game.busy && !__game.game.choice, null, 15000);
      const st = await G(() => __game.game.sentenceText());
      ok(!/^Usar/.test(st), `F3: tras adjuntar con el ratón quieto, la barra dice «${st}»`);
      ok(await G(() => !__game.game.actors.gervasio_acta.hold), 'Gervasio, sin el móvil en la mano');
      await T.ctx.close();
    }
    {
      // perder: tres fallos de verdad (esperando cada vez)
      const T = await open(D3F, 'pajarera', ['fotocopia_nota_direccion']);
      const { G, until, untilSkip, clickOpt, D, menuReply } = T;
      await G(() => __game.skipText(true));
      await empezar(T);
      await G(() => __game.skipText(false));
      for (let k = 0; k < 3; k++) {
        if (!(await menuReply())) break;
        await until(() => __game.game.duelInfo && __game.game.duelInfo.escribiendo === false, null, 15000);
        const I = await D(); const mal = I.pairs.findIndex((p, j) => j !== I.ci && p !== 'comodin');
        await clickOpt(mal);
        await untilSkip((n) => !__game.game.duelInfo || __game.game.duelInfo.misses === n, k + 1, 10000);
      }
      ok(await untilSkip(() => !__game.game.duelActive, null, 40000), 'tres fallos: el duelo acaba');
      ok(await G(() => (__game.state().lastDuel || {}).result === 'lost'), 'perdido');
      const n0 = await G(() => __game.log.length); await sleep(3000);
      ok(await G((k) => !__game.log.slice(k).some(l => l.who === 'aviso' && l.name === 'Gervasio Acta'), n0) && await G(() => !__game.game.actors.gervasio_acta.hold), 'tras perder, ninguna escritura viva ni móvil en la mano');
      await T.ctx.close();
    }
    {
      // retirarse en el remate; cargar a mitad de la escritura una partida de antes del duelo
      const T = await open(D3F, 'pajarera', ['fotocopia_nota_direccion']);
      const { G, until, untilSkip, clickOpt, D, menuReply } = T;
      await G(() => __game.game.save(4));
      await empezar(T);
      for (let k = 0; k < 2; k++) {
        await menuReply(); await until(() => __game.game.duelInfo && __game.game.duelInfo.escribiendo === false, null, 15000);
        const I = await D(); await clickOpt(I.ci); await untilSkip((n) => __game.game.duelInfo && __game.game.duelInfo.hits === n, k + 1, 10000);
      }
      ok(await untilSkip(() => __game.game.duelInfo && __game.game.duelInfo.phase === 'finisher' && !!__game.game.choice, null, 15000), 'remate');
      const I = await D(); await clickOpt(I.options.indexOf('[Retirarse del hilo]'));
      ok(await untilSkip(() => !__game.game.duelActive, null, 20000) && await G(() => (__game.state().lastDuel || {}).result === 'retired'), 'retirarse del hilo en el remate');
      ok(await G(() => !__game.game.actors.gervasio_acta.hold), 'tras retirarse, sin móvil');
      await untilSkip(() => !__game.game.busy && !__game.game.choice, null, 10000);
      await empezar(T);
      ok(await menuReply() && (await D()).esc === true, 'otra vez: Gervasio escribiendo');
      await G(() => __game.game.load(4));
      await untilSkip(() => __game.state().mode === 'play' && !__game.game.busy, null, 10000);
      const n0 = await G(() => __game.log.length);
      await sleep(4500);
      ok(await G((k) => !__game.game.duelActive && !__game.log.slice(k).some(l => l.who === 'aviso' && l.name === 'Gervasio Acta') && !__game.game.actors.gervasio_acta.hold, n0), 'cargar una partida de antes del duelo a mitad de la escritura: ninguna tarea viva (ni aviso ni móvil en 4,5 s)');
      await T.ctx.close();
    }
    {
      console.log('  (con el dedo, 844 × 390)');
      const T = await open(D3F, 'pajarera', ['fotocopia_nota_direccion'], { viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
      const { page, G, until, untilSkip, clickOpt, D, menuReply, shot, tap } = T;
      await empezar(T);
      ok(await menuReply(), 'menú (táctil)');
      let I = await D(); await sleep(300); await clickOpt(I.ci);
      ok(await untilSkip(() => __game.game.duelInfo && __game.game.duelInfo.interrumpeN === 1, null, 10000), 'un toque antes de tiempo: interrupción');
      await menuReply(); await sleep(300); I = await D(); await clickOpt(I.ci);
      ok(await untilSkip(() => __game.game.duelInfo && __game.game.duelInfo.interrumpeN === 2, null, 10000), 'dos');
      await menuReply(); await sleep(500); await shot('d3-tactil');
      for (let k = 0; k < 2; k++) {
        await menuReply(); await until(() => __game.game.duelInfo && __game.game.duelInfo.escribiendo === false, null, 15000);
        I = await D(); await clickOpt(I.ci); await untilSkip((n) => __game.game.duelInfo && __game.game.duelInfo.hits === n, k + 1, 10000);
      }
      I = await D(); ok(I.misses === 0 && I.hits === 2, `dos aciertos y 0 fallos con el dedo (${I.hits}/${I.misses})`);
      ok(await untilSkip(() => __game.game.duelInfo && __game.game.duelInfo.phase === 'finisher' && !!__game.game.choice, null, 15000), 'remate');
      I = await D(); await clickOpt(I.options.indexOf('[Usar objeto]'));
      await until(() => !!__game.game.itemPick);
      const ip = await G(() => __game.invPos('fotocopia_nota_direccion')); await tap(ip.x, ip.y);
      ok(await untilSkip(() => !__game.game.duelActive, null, 25000) && await G(() => !!__game.game.state.flags['duel:gervasio:won']), 'ganado con el dedo');
      void page;
      await T.ctx.close();
    }
  }

  // ====================================================================== F4
  if (toca('f4')) {
    console.log('\n§2.4 · F4: «¿Falta mucho?» (Evaristo se va a escribir)');
    const T = await open({ ...ACTO2, nota_gasto_presentada: true, evaristo_convoco: 'begona' }, 'administracion');   // [coherencia] Begoña le manda
    const { page, G, until, untilSkip, clicOpcion, raton, logHas, shot } = T;
    await raton('hablar', 'evaristo_salvedad');
    await clicOpcion('¿Para qué me ha llamado?');
    await G(() => __game.skipText(true)); await untilSkip(() => (__game.currentDialogOptions() || []).includes('¿Falta mucho?'), null, 15000);
    await G(() => { __game.skipText(false); __game.clearLog(); });
    await clicOpcion('¿Falta mucho?');
    ok(await until(() => __game.game.speeches.some(s => s.text === 'Si tiene prisa, se lo pongo por escrito.'), null, 15000), '«Si tiene prisa, se lo pongo por escrito.»');
    await G(() => __game.skipSpeech());
    ok(await until(() => __game.game.actors.evaristo_salvedad.dir === 'up', null, 6000), 'Evaristo se vuelve de espaldas (a escribir)');
    await page.mouse.move(5, 5); await sleep(450); await shot('f4-evaristo');
    ok(await until(() => __game.game.notices.some(n => /Correo nuevo de Evaristo Salvedad/.test(n.text)), null, 6000), 'el aviso: «Correo nuevo de Evaristo Salvedad: «Una cosita (1 de 3)».»');
    await sleep(250); await shot('f4-aviso');
    ok(!(await logHas('mirado el reloj')), 'E326 no vuelve');
    await G(() => __game.skipText(true));
    await untilSkip(() => (__game.currentDialogOptions() || []).includes('¿Falta mucho?') || !__game.game.choice, null, 8000);
    if (!(await G(() => (__game.currentDialogOptions() || []).includes('¿Falta mucho?')))) { await G(() => { if (__game.game.choice) __game.game.choice.resolve(-1); }); await G(() => __game.waitIdle()); await G(() => __game.doVerb('hablar', 'evaristo_salvedad')); await clicOpcion('¿Para qué me ha llamado?'); }
    await G(() => __game.clearLog());
    await clicOpcion('¿Falta mucho?'); await G(() => __game.waitIdle());
    // [coherencia] lo pone por escrito DE VERDAD: la segunda prisa, la segunda parte (llega a la bandeja), sin repetir la 1
    ok(await logHas('Correo nuevo de Evaristo Salvedad: «Una cosita (2 de 3)».') && !(await logHas('«Una cosita (1 de 3)»')), 'la segunda vez, la parte 2 (no otra vez la 1)');
    ok(await G(() => String(__game.getFlag('evaristo_correos')).split(',').filter(t => /^[12]@/.test(t)).length === 2), 'las dos partes, en la bandeja');
    await T.ctx.close();
  }

  // ====================================================================== F6
  if (toca('f6')) {
    console.log('\n§2.4 · F6: la escena de Anselmo tras el kanban, en dos tiempos');
    const III = { ...ACTO2, cms_vivo: true, acto_3_iniciado: true, ruben_encontrado: true, dos_ias_vista: true, anselmo_dijo_regla: true, herminia_midio: true,
      pieza_escrita: true, discover_ganador: 'opa', album_validado: true, rep_13: true, oyo_descopear: true };
    const T = await open(III, 'pecera', ['rotulador_rojo']);
    const { page, G, until, clicOpcion, raton, logIdx, logHas, shot } = T;
    await raton('usar', 'kanban', 'rotulador_rojo');
    await until(() => !!__game.currentDialogOptions(), null, 15000);
    await clicOpcion('SALIDA EN VALOR');
    const enPantalla = (t) => until((t) => __game.game.speeches.some(s => String(s.text).includes(t)), t, 90000);
    const sk = async () => { await G(() => __game.skipSpeech()); };
    for (let k = 0; k < 400 && !(await G(() => __game.game.speeches.some(s => /Revocado\. Fecha: hoy/.test(s.text)))); k++) { await sk(); await sleep(60); }
    await sleep(500); await shot('f6-revocado');
    ok(await enPantalla('Revocado. Fecha: hoy. Efectos: julio.'), 'primer tiempo: «Revocado. Fecha: hoy. Efectos: julio.»');
    await sk();
    ok(await enPantalla('Nos hemos quedado sin IA de la casa.'), 'segundo tiempo: «Nos hemos quedado sin IA de la casa.»');
    await sleep(500); await shot('f6-sinia');
    await sk();
    await until(() => __game.game.actors.anselmo_monolito.dir === 'right', null, 6000);
    await sleep(250); await shot('f6-mira');
    ok(await enPantalla('alta de usuario: no'), 'la pantalla de Herminia');
    await sleep(600); await shot('f6-herminia');
    for (let k = 0; k < 400 && !(await G(() => __game.getFlag('ruben_libre') && !__game.game.busy && __game.log.some(l => l.text === 'SEGUIREMOS INFORMANDO.'))); k++) { await sk(); await sleep(60); }
    const iR = await logIdx('Revocado. Fecha: hoy. Efectos: julio.'), iN = await logIdx('Nos hemos quedado sin IA de la casa.'), iH = await logIdx('alta de usuario: no'), iS = await logIdx('SEGUIREMOS INFORMANDO.');
    ok(iR >= 0 && iR < iN && iN < iH && iH < iS, `orden: Revocado → sin IA de la casa → Herminia → SEGUIREMOS INFORMANDO (${[iR, iN, iH, iS].join(' < ')})`);
    const entre = await G(([a, b]) => __game.log.slice(a + 1, b).filter(l => l.who === 'anselmo_monolito').map(l => l.text), [iH, iS]);
    ok(!entre.length, `Anselmo vuelve sin decir nada${entre.length ? ': ' + entre.join(' | ') : ''}`);
    for (const t of ['Y en nuestros corazones, Brais está en HECHO.', 'Integró una IA que era un becario.', '...Lo miro en la próxima versión.']) ok(!(await logHas(t)), `fuera: «${t}»`);
    void page;
    await T.ctx.close();
  }

  // ====================================================================== 20 golpes restaurados, oídos
  if (toca('golpes')) {
    console.log('\n§3 · una muestra de 20 golpes restaurados, oídos en el juego');
    const M = [
      ['vestibulo', 'usar', 'buzon_sugerencias', 'Escribo «Más becarios con contrato». La ranura la escupe. Polvo y principios.'],
      ['vestibulo', 'usar', 'planta_plastico', 'La riego con la mirada. No necesita más. Es de plástico.'],
      ['office', 'usar', 'maquina_vending', 'Pulso la B4. Las pipas se asoman y se quedan colgando. Las animo. Nada.'],
      ['office', 'coger', 'fregadero', 'La taza del Foro de Innovación no se mueve. Ha echado raíces. Disruptivas.'],
      ['office', 'cerrar', 'office_a_pecera', 'Para cerrar un arco hace falta una puerta y un presupuesto. No hay ninguno.'],
      ['pecera', 'empujar', 'pecera_a_vestibulo', 'Empujar a alguien escaleras abajo sería una salida en valor. No.'],
      ['pecera', 'mirar', 'taza_abandonada', 'Una taza con costra de café de la crisis de la deuda. Debería cotizar.'],
      ['pecera', 'mirar', 'semaforo_ruido', 'Semáforo de ruido de Prevención. Rojo.'],
      ['pajarera', 'empujar', 'pajarera_a_pecera', 'Empujo el cristal. Desde la Redacción parece que pido auxilio. Un poco sí.'],
      ['catacumba', 'mirar', 'fotos_jefes_cierre', 'Jefes de cierre en blanco y negro. Todos con bigote.'],
      ['catacumba', 'mirar', 'aurora_galerada', 'Aurora, correctora. Tiene un boli rojo clavado en el moño. Por si acaso.'],
      ['catacumba', 'mirar', 'libro_estilo', 'El Libro de Estilo.'],
      ['cpd', 'coger', 'armarios', 'Pesan como un servidor. Porque son servidores.'],
      ['cpd', 'tirar', 'armarios', 'Tiro de un cable. Eutimio carraspea a seis metros. Lo suelto.'],
      ['cpd', 'empujar', 'regleta_r3', 'La empujo con el pie. El piloto ni parpadea. Tiene brida.'],
      ['cpd', 'usar', 'contador_tickets', 'No tiene botones. Sube uno cada vez que entro. Soy una incidencia.'],
      ['cpd', 'usar', 'cementerio_ratones', 'Muevo una bola. Rueda por dentro. Eutimio tenía razón.'],
      ['ecosistema', 'usar', 'pizarra_sinergia', 'Debajo escribo «¿Y qué es?». Se borra solo. Por vergüenza.'],
      ['administracion', 'mirar', 'tazas_begona', 'Tres tazas vacías. Una por copia.'],
      ['administracion', 'mirar', 'archivador_ejemplares', '«EJEMPLARES». Once notas bien hechas en cuarenta años. Una por cuatrienio.'],
    ];
    const T = await open(ACTO2, 'vestibulo');
    const { G, logHas, idle } = T;
    await G(() => __game.skipText(true));
    let sala = 'vestibulo', bien = 0; const mal = [];
    for (const [s, v, o, t] of M) {
      if (s !== sala) { await G((s) => __game.gotoRoom(s), s); await idle(); await G(() => __game.skipSpeech()); await idle(); sala = s; }
      await G(() => __game.clearLog());
      await G(([v, o]) => __game.doVerb(v, o), [v, o]); await idle();
      if (await logHas(t)) bien++; else mal.push(`${v} ${o} (${s}): ${JSON.stringify(await G(() => __game.log.slice(-2).map(l => l.text)))}`);
    }
    ok(bien === M.length, `${bien}/${M.length} golpes restaurados oídos${mal.length ? ' · faltan: ' + mal.join(' · ') : ''}`);
    await T.ctx.close();
  }

  // ====================================================================== el camino principal y el aviso por personaje
  if (toca('camino')) {
    console.log('\n§7-8 · el recorrido de 49 pasos (modo rápido): medida del camino principal y remate seco por personaje');
    const ctx = await browser.newContext({ viewport: { width: 960, height: 600 } });
    const page = await ctx.newPage();
    page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    page.on('pageerror', e => errs.push('pageerror: ' + e.message));
    const R = createRunner(page); const G = R.G;
    await page.goto(base);
    await page.evaluate(() => { try { localStorage.clear(); } catch (e) { /* ignore */ } });
    await page.reload();
    await page.waitForFunction(() => !!window.__game);
    await G(() => __game.skipText(true));
    await R.startDismisser();
    await G(() => __game.newGame());
    const porPaso = {};
    for (const s of STEPS) {
      const k0 = await G(() => __game.log.length);
      for (const a of s.acc) await R.run(a);
      await G(() => __game.waitIdle());
      await R.check(s.esp);
      porPaso[s.n] = await G((k) => __game.log.slice(k).map(l => ({ who: l.who, text: String(l.text), room: l.room })), k0);
    }
    ok(Object.keys(porPaso).length === STEPS.length && STEPS.length === 45, `los ${Object.keys(porPaso).length} pasos ([P11]: 45), cada uno con su resultado (hasta juego_terminado)`);
    const dichas = Object.values(porPaso).flat().filter(l => l.who !== 'aviso' && l.who !== 'tarjeta');
    const ms = (t) => Math.max(1100, 900 + t.length * 55);
    const lineas = dichas.length, chars = dichas.reduce((a, l) => a + l.text.length, 0), min = dichas.reduce((a, l) => a + ms(l.text), 0) / 60000;
    const E6 = { lineas: 553, min: 32.4 };
    console.log(`    camino principal (49 pasos, modo rápido): ${lineas} líneas · ${chars.toLocaleString('es-ES')} caracteres · ${min.toFixed(1).replace('.', ',')} min de lectura`);
    console.log(`    frente a E6 (${E6.lineas} líneas · ${String(E6.min).replace('.', ',')} min): ${lineas - E6.lineas >= 0 ? '+' : ''}${lineas - E6.lineas} líneas · ${(min - E6.min >= 0 ? '+' : '') + (min - E6.min).toFixed(1).replace('.', ',')} min (§8 prevé −4 líneas y ≈ −5 s; el rediseño del duelo suma +3: el planteamiento del D1)`);
    fs.mkdirSync(path.join(shots, 'test-e7'), { recursive: true });
    fs.writeFileSync(path.join(shots, 'test-e7', 'camino-principal.tsv'), Object.entries(porPaso).flatMap(([n, X]) => X.filter(l => l.who !== 'aviso' && l.who !== 'tarjeta').map(l => `${n}\t${l.who}\t${l.text}`)).join('\n') + '\n');
    // [guion3 t1]: +2 por el guion nuevo aprobado ([P9] R07 y R11 una línea más cada una; [P14] el registro no va en el camino)
    ok(lineas <= E6.lineas + 8 && min <= E6.min + 1, `saldo de §8: ${lineas - E6.lineas >= 0 ? '+' : ''}${lineas - E6.lineas} líneas (≤ +8) y ${(min - E6.min).toFixed(1).replace('.', ',')} min (≤ +1)`);
    ok(porPaso[46].some(l => l.who === 'aviso' && l.text === 'El acta se necesitaba para... para... para ayer.'), '46 en modo rápido: la R03 entera, al registro como aviso');
    const F6 = ['Y en nuestros corazones, Brais está en HECHO.', 'Integró una IA que era un becario. Y rechaza una IA que es una IA.', '...Lo miro en la próxima versión.'];
    ok(!porPaso[45].some(l => F6.includes(l.text)) && porPaso[45].some(l => l.text === 'Nos hemos quedado sin IA de la casa.'), '45: F6 (fuera las tres; «Nos hemos quedado sin IA de la casa.» dentro)');
    const { rematePorPersonaje, REMATE_PERSONAJE_AVISO } = await import('./plan-rules.mjs');
    const per = rematePorPersonaje(Object.values(porPaso).flat());
    const top = per.filter(p => p.n >= REMATE_PERSONAJE_AVISO.minimo);
    console.log('    remate seco por personaje (camino, ≥ 20 líneas): ' + top.slice(0, 6).map(p => `${p.who} ${p.rem}/${p.n} (${(100 * p.pct).toFixed(1).replace('.', ',')} %)`).join(' · '));
    ok(!per.some(p => p.pasa), `aviso por personaje (> 32 % con ≥ 20 líneas oídas): ${per.filter(p => p.pasa).map(p => p.who).join(', ') || 'nadie'}`);
    await R.stopDismisser?.();
    await ctx.close();
  }

  // ====================================================================== topes (§7)
  console.log('\n§7 · topes: text-audit --estatico --plan --e2 --e5 --e6 --recuento');
  {
    const r = spawnSync(process.execPath, [path.join(here, 'text-audit.mjs'), '--estatico', '--plan', '--e2', '--e5', '--e6', '--recuento'], { cwd: root, encoding: 'utf8' });
    const o = r.stdout + r.stderr;
    fs.mkdirSync(path.join(shots, 'test-e7'), { recursive: true });
    fs.writeFileSync(path.join(shots, 'test-e7', 'text-audit.log'), o);
    const rem = o.match(/(\d+) \/ 17,9 % \((\d+) de (\d+) = ([\d,]+) %\)/);
    ok(r.status === 0 && /PLAN: OK/.test(o) && /E2: OK/.test(o) && /E5: OK/.test(o) && /E6: OK/.test(o), 'PLAN OK · E2 OK · E5 OK · E6 OK');
    ok(!!rem && parseFloat(rem[4].replace(',', '.')) <= 17.9, `remate seco ≤ 17,9 %: ${rem ? `${rem[2]}/${rem[3]} = ${rem[4]} %` : '(no se lee)'}`);
    const s26 = (o.match(/Remate seco por fichero de sala > 26 %[^:]*: (\d+)/) || [])[1];
    ok(s26 === '0', `ninguna sala por encima del 26 % (aviso: ${s26})`);
    for (const [re, txt] of [[/(\d+) \/ 46\s+coletilla/, 'coletilla'], [/(\d+) \/ 12\s+«chaval»/, '«chaval»'], [/(\d+) \/ 36\s+año/, 'año'], [/(\d+) \/ 17\s+«táper»/, '«táper»']]) {
      const m = o.match(re); ok(!!m, `${txt}: ${m ? m[1] : '?'}`);
    }
  }
} catch (e) { failures++; console.log('EXCEPCIÓN', e); }
ok(errs.length === 0, 'sin errores de consola ' + errs.slice(0, 3).join(' | '));
console.log(`\n${checks - failures}/${checks} ${failures ? 'FALLAN ' + failures : 'E7: OK'}`);
await browser.close(); server.close();
process.exit(failures ? 1 : 0);
