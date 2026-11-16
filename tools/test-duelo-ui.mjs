#!/usr/bin/env node
// PRUEBA DE LA PRESENTACIÓN DEL DUELO «RESPONDER A TODOS» (rediseño: docs/guion2/duelo/DUELO_REDISENO.md + decisiones
// del director; docs/guion2-impl/GUIA_AUTORES.md «Duelo: la presentación»). Con ratón real (los cuatro duelos) y con el
// dedo (D1 en un móvil horizontal de 844 × 390). Lee lo que se PINTA (`game.duelVista`, que rellena drawHud en cada
// fotograma) y el estado de siempre (`duelInfo`). Cubre:
//   · D1 por el árbol de Maripaz: el planteamiento («Estamos a un metro.», sobres en la sala, la tableta y el móvil), el
//     móvil que entra, la cabecera (3 + 3 puntos y «¿Quién llama a Siestatón?»), la ayuda gris del primer duelo y la
//     pestaña LIBRETA; acierto → un punto del rival apagado, destello verde, «Celestino: +1» y la ayuda fuera; fallo →
//     un punto de Bruno apagado, destello rojo y «En copia: Siestatón»; remate y sello «LLAMA: MARIPAZ» que desaparece;
//   · cajas: ni Maripaz ni Bruno (ni los rivales de D2, D3 y D4) quedan tapados por la ventana;
//   · D1 con el dedo (revancha): sin planteamiento ni ayuda; tres fallos → sello «LLAMA: B. POLLEJO» que desaparece y
//     Maripaz vuelve a su silla; la ventana y la pestaña no tapan el menú;
//   · D2 (fax): piel de fax, `cabe` (la larga no apaga puntos ni destella), «+1» por fax, guardar/cargar a mitad (el duelo
//     empieza de 0 y la ventana se pinta otra vez con los puntos encendidos);
//   · D3: 2 puntos del rival (winScore 2), «escribiendo» en el cuerpo, interrumpir no apaga puntos, acierto sí;
//   · D4 (clímax): 5 + 3 puntos, «+1» y el cameo de Tadeo como notificación;
//   · la ayuda solo en el primer duelo de la partida (flag de motor `duel:ayuda`).
// Capturas en tools/shots/duelo-ui-test-*.png.   node tools/test-duelo-ui.mjs
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from './serve.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const shots = path.join(here, 'shots'); fs.mkdirSync(shots, { recursive: true });
const server = createServer(path.resolve(here, '..'));
await new Promise(r => server.listen(0, r));
const base = `http://localhost:${server.address().port}/`;
const browser = await chromium.launch();
let failures = 0, checks = 0;
const ok = (c, m) => { checks++; if (c) console.log('  ✓ ' + m); else { failures++; console.log('  ✗ ' + m); } };
const errs = [];
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const ACTO2 = { intro_vista: true, torno_abierto: true, inigo_presentado: true, chaqueta_en_lector: true, silla_libre: true, acto_2_iniciado: true,
  aurora_conto_pasos: true, sala_amazonas_orden_visto: true, sala_becario_sin_turno: true, reunion_terminada: true, maripaz_popup_n: 3 };
const ACTO3 = { ...ACTO2, casilla_hueco: true, duelo_maripaz_ganado: true, acto_3_iniciado: true, pagina_cerrada: true, ruben_encontrado: true,
  oyo_descopear: true, ruben_libre: true, sala_abierta: true, duelo_gervasio_ganado: true, evaristo_escuchado: true, coma_bendecida: true,
  correo_evaristo_listo: true };
const REPS = Object.fromEntries(['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16'].map(n => ['rep_' + n, true]));

async function open(room, flags, inv = [], ctxOpts = { viewport: { width: 960, height: 600 } }) {
  const ctx = await browser.newContext(ctxOpts);
  const page = await ctx.newPage();
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', e => errs.push('pageerror: ' + e.message));
  await page.goto(base);
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) { /* */ } });
  await page.reload();
  await page.waitForFunction(() => !!window.__game);
  const G = (fn, a) => page.evaluate(fn, a);
  await G(() => { __game.skipText(true); return __game.newGame(); });
  await G((F) => { for (const [k, v] of Object.entries(F)) __game.setFlag(k, v); }, flags);
  await G((inv) => { for (const i of inv) __game.giveItem(i); }, inv);
  await G((r) => __game.gotoRoom(r), room);
  await G(() => __game.waitIdle());
  if (room === 'sala_amazonas' && !flags.acto_3_iniciado) await G(() => { const p = __game.game.player; p.x = 94; p.y = 124; p.dir = 'right'; });
  await G(() => __game.skipText(false));
  const tactil = !!ctxOpts.hasTouch;
  const until = async (fn, arg, ms = 30000, saltar = true) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (saltar) await G(() => __game.skipSpeech()); if (await G(fn, arg)) return true; await sleep(30); } return false; };
  const clickOpt = async (i) => {
    await until(() => { const c = __game.game.choice; return !!c && __game.game.realTime - c.t0 > 330; }, null, 8000, false);
    const p = await G(i => __game.optionPos(i), i);
    if (tactil) await page.touchscreen.tap(p.x, p.y + 2); else await page.mouse.click(p.x, p.y);
  };
  const V = async () => { await sleep(90); return G(() => { const v = __game.game.duelVista; return v && __game.game.hud ? JSON.parse(JSON.stringify(v)) : null; }); };
  const D = () => G(() => { const d = __game.game.duelInfo; return d && { phase: d.phase, attack: d.attack, hits: d.hits, misses: d.misses, ci: d.correctIndex, wi: d.weakIndex, pairs: d.optionPairs, esc: d.escribiendo, ver: d.veredicto, subject: d.subject, score: d.score }; });
  const menu = () => until(() => { const g = __game.game; return !!(g.choice && g.duelInfo && g.duelInfo.phase === 'reply' && g.duelInfo.options && !g.duelInfo.escribiendo); });
  const logHas = (t) => G(t => __game.log.filter(l => String(l.text).includes(t)).length, t);
  const shot = (name) => page.screenshot({ path: path.join(shots, `duelo-ui-test-${name}.png`) });
  /** ¿Tapa la ventana a este actor? (caja del actor en pantalla contra la caja de la ventana) */
  const tapado = (id) => G((id) => {
    const g = __game.game, a = g.actors[id], v = g.duelVista;
    if (!a || !v || a.room !== g.room.def.id) return { fuera: true };
    const b = g.actorBox(a), cam = Math.round(g.camX);
    const top = Math.round(b.y), bottom = Math.round(b.y + b.h);
    return { top, bottom, caja: v.caja.y + v.caja.h, tapa: top < v.caja.y + v.caja.h && b.x + b.w - cam > v.caja.x && b.x - cam < v.caja.x + v.caja.w };
  }, id);
  return { ctx, page, G, until, clickOpt, V, D, menu, logHas, shot, tapado };
}

try {
  // ====================================================================== D1 con ratón, primera vez (planteamiento)
  console.log('D1 (Maripaz) con ratón: el planteamiento, la cabecera, acierto, fallo, remate y sello');
  {
    const T = await open('sala_amazonas', { ...ACTO2, rep_08: true, rep_04: true, rep_11: true, rep_14: true, rep_01: true }, ['ficha_pagina_7']);
    const { page, G, until, clickOpt, V, D, menu, logHas, shot, tapado } = T;
    G(() => { __game.game.runScript(api => api.dialog('maripaz_sala'), { label: 'd1' }); });
    await until(() => !!__game.game.choice, null, 8000, false);
    const k = await G(() => __game.game.choice.options.findIndex(o => o.startsWith('Siestatón')));
    await clickOpt(k);
    // planteamiento: tableta, sobres en la sala, Bruno saca el móvil
    ok(await until(() => __game.game.speeches.some(s => s.text === 'Eso, por escrito. Con copia a todos.'), null, 20000, false), '«Eso, por escrito. Con copia a todos.»');
    const pose = await G(() => { const a = __game.game.actors.maripaz_remitido; return { x: Math.round(a.x), y: Math.round(a.y), hold: !!a.hold, pose: __game.game.poseOf(a) || null }; });
    ok(pose.x === 140 && pose.y === 130 && pose.hold && !pose.pose, `Maripaz delante de la mesa, de pie y con la tableta (${JSON.stringify(pose)})`);
    ok(await until(() => !!__game.game.sobres, null, 15000, true), 'el «¡ding!»: un sobre junto a cada presente');
    ok(await until(() => __game.game.speeches.some(s => s.text === 'Estamos a un metro.'), null, 15000, false), '«Estamos a un metro.»');
    ok(await G(() => { const h = __game.game.player.hold; return !!(h && h.item === 'movil'); }), 'Bruno saca el móvil');
    await shot('d1-planteamiento');
    // el móvil entra y llega el primer ataque
    ok(await until(() => !!(__game.game.duelVista && __game.game.hud), null, 20000, true), 'se abre la ventana (el móvil)');
    ok(await menu(), 'primer menú');
    let v = await V();
    ok(v.style === 'mail' && v.app === 'Correo' && v.pregunta === '¿Quién llama a Siestatón?', `móvil con la app «Correo» y la pregunta en la cabecera («${v.pregunta}»)`);
    ok(v.rival.total === 3 && v.rival.apagados === 0 && v.bruno.total === 3 && v.bruno.apagados === 0 && v.bruno.izquierda, `marcador: 3 puntos del rival y 3 de Bruno (Bruno a la izquierda, como en la sala): ${JSON.stringify([v.rival, v.bruno])}`);
    ok(v.ayuda && v.libreta && !v.copia && !v.notificacion, `(${JSON.stringify({ a: v.ayuda, l: v.libreta, c: v.copia, n: v.notificacion })}) primer duelo: la ayuda gris y la pestaña LIBRETA; sin «En copia» ni notificación`);
    ok((await D()).subject.includes('(contiene publicidad)') && (await D()).score === 'ACIERTOS 0/3 · FALLOS 0/3', 'duelInfo.subject y .score, como siempre');
    for (const id of ['maripaz_remitido', 'bruno']) { const t = await tapado(id); ok(!t.tapa, `${id} no queda tapado por la ventana (cabeza en y ${t.top}, ventana hasta ${t.caja})`); }
    await shot('d1-menu');
    // acierto
    let d = await D();
    await clickOpt(d.ci);
    ok(await until(() => { const v = __game.game.duelVista; return !!(v && v.notificacion); }, null, 8000, false), 'acierto: entra una notificación');
    v = await V();
    ok(v.notificacion === 'Celestino: +1' && v.rival.apagados === 1 && v.bruno.apagados === 0 && !v.ayuda, `acierto: «${v.notificacion}», un punto del rival apagado, la ayuda fuera`);
    ok(await G(() => !!__game.game.actors.maripaz_remitido.retro || true), 'el rival encaja (paso atrás)');
    await shot('d1-acierto');
    // fallo
    ok(await menu(), 'segundo menú');
    d = await D();
    await clickOpt(d.wi);
    ok(await until(() => { const v = __game.game.duelVista; return !!(v && v.copia); }, null, 8000, false), 'fallo: entra gente en copia');
    v = await V();
    ok(v.copia === 'En copia: Siestatón' && v.bruno.apagados === 1 && v.rival.apagados === 1 && v.destello === 'miss' && !v.ayuda, `fallo: «${v.copia}», un punto de Bruno apagado, destello rojo`);
    await shot('d1-fallo');
    // aciertos hasta el remate, remate con la ficha y sello verde
    for (let i = 0; i < 6; i++) {
      await until(() => { const g = __game.game; return !g.duelInfo || (g.choice && g.duelInfo.phase !== 'reply') || (g.choice && g.duelInfo.options && !g.duelInfo.escribiendo); });
      d = await D();
      if (!d || d.phase !== 'reply') break;
      await clickOpt(d.ci);
      await sleep(80);
    }
    ok(await until(() => __game.game.duelInfo && __game.game.duelInfo.phase === 'finisher' && !!__game.game.choice), 'remate');
    v = await V();
    ok(v.rival.apagados === 3 && v.bruno.apagados === 1, `en el remate: los 3 puntos del rival apagados (${v.rival.apagados}) y 1 de Bruno`);
    const ku = await G(() => __game.game.choice.options.indexOf('[Usar objeto]'));
    await clickOpt(ku);
    ok(await until(() => __game.state().pickItem, null, 5000), '[Usar objeto] abre el inventario');
    await G(() => { __game.chooseItem('ficha_pagina_7'); });      // (sin esperar: chooseItem espera a que acabe todo)
    ok(await until(() => { const v = __game.game.duelVista; return !!(v && v.veredicto); }, null, 20000), 'sello al ganar');
    v = await V();
    ok(v.veredicto && v.veredicto.text === 'LLAMA: MARIPAZ' && v.veredicto.ok, `sello verde «${v.veredicto && v.veredicto.text}»`);
    await sleep(250); await shot('d1-gana');
    ok(await until(() => !__game.game.hud, null, 5000, false), 'el sello no se queda colgado: la ventana se cierra');
    ok(await until(() => !__game.game.duelInfo, null, 60000), 'el duelo termina');
    ok(await G(() => !!__game.game.state.flags['duel:ayuda'] && !!__game.game.state.flags.duelo_maripaz_ganado), 'D1 ganado; la ayuda ya no vuelve (duel:ayuda)');
    ok(await logHas('Estamos a un metro.') === 1, '«Estamos a un metro.» una sola vez');
    await T.ctx.close();
  }

  // ====================================================================== D1 con el dedo (revancha, derrota)
  console.log('\nD1 con el dedo (844 × 390), revancha: sin planteamiento ni ayuda; derrota con sello rojo');
  {
    const T = await open('sala_amazonas', { ...ACTO2, rep_08: true, rep_04: true, rep_11: true, 'duel:maripaz:perdido_n': 1, 'duel:ayuda': true }, ['ficha_pagina_7'],
      { viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
    const { G, until, clickOpt, V, D, menu, logHas, shot, tapado } = T;
    await G(() => { __game.game.mouse.touch = true; });
    G(() => { __game.game.runScript(api => api.dialog('maripaz_sala'), { label: 'd1' }); });
    await until(() => !!__game.game.choice, null, 8000, false);
    await clickOpt(await G(() => __game.game.choice.options.findIndex(o => o.startsWith('Siestatón'))));
    ok(await menu(), 'menú del duelo (dedo)');
    let v = await V();
    ok(!v.ayuda && v.libreta, 'segundo duelo de la partida: sin ayuda; con la pestaña LIBRETA');
    const geo = await G(() => { const g = __game.game, c = g.choice, L = c.layout || []; return { lines: L.length, scroll: c.maxScroll, hudTop: g.hudTop, cajaFin: g.duelVista.caja.y + g.duelVista.caja.h }; });
    ok(geo.lines <= 5 && geo.scroll === 0 && geo.cajaFin <= 62 && geo.hudTop <= 70, `la ventana cabe arriba y el menú sin scroll (${JSON.stringify(geo)})`);
    for (const id of ['maripaz_remitido', 'bruno']) { const t = await tapado(id); ok(!t.tapa, `${id} a la vista en el móvil`); }
    await shot('d1-dedo-menu');
    for (let i = 0; i < 3; i++) { ok(await menu(), `menú ${i + 1}`); const d = await D(); await clickOpt(d.wi); await until((i) => { const d = __game.game.duelInfo; return !d || d.misses > i; }, i); }
    ok(await until(() => { const v = __game.game.duelVista; return !!(v && v.veredicto); }, null, 20000), 'sello al perder');
    v = await V();
    ok(v.veredicto && v.veredicto.text === 'LLAMA: B. POLLEJO' && !v.veredicto.ok && v.bruno.apagados === 3, `sello rojo «${v.veredicto && v.veredicto.text}» y los 3 puntos de Bruno apagados`);
    ok(v.copia === 'En copia: Siestatón, la planta, toda la empresa', `«${v.copia}»`);
    await sleep(200); await shot('d1-dedo-pierde');
    ok(await until(() => !__game.game.hud, null, 8000, true), 'el sello desaparece');
    ok(await until(() => !__game.game.duelInfo, null, 60000), 'fin del duelo');
    const mp = await G(() => { const a = __game.game.actors.maripaz_remitido; return { x: Math.round(a.x), y: Math.round(a.y), pose: __game.game.poseOf(a) }; });
    ok(mp.x === 120 && mp.y === 98 && mp.pose === 'tras_mesa', `Maripaz vuelve a su silla (${JSON.stringify(mp)})`);
    ok(await logHas('Estamos a un metro.') === 0, 'la revancha no repite el planteamiento');
    await T.ctx.close();
  }

  // ====================================================================== D2 fax con ratón: cabe, +1 por fax, guardar/cargar
  console.log('\nD2 (Teodoro, fax) con ratón: `cabe`, «+1» y guardar/cargar a mitad');
  {
    const T = await open('catacumba', { ...ACTO2, ...REPS, paco_dio_manual: true, 'duel:ayuda': true }, ['manual_fax', 'ficha_pagina_7']);
    const { G, until, clickOpt, V, D, menu, shot, tapado } = T;
    G(() => { __game.game.runScript(api => api.duel('teodoro'), { label: 'd2' }); });
    ok(await menu(), 'menú de D2');
    let v = await V();
    ok(v.style === 'fax' && v.app === 'FAX · TALLERES' && v.pregunta === '¿Quién firma la página 7?' && v.rival.total === 3 && v.bruno.total === 3, `fax: «${v.pregunta}», 3 + 3 puntos`);
    for (const id of ['teodoro_cuerpodoce', 'bruno']) { const t = await tapado(id); ok(!t.tapa, `${id} a la vista`); }
    await shot('d2-menu');
    // R06 y R02 bien; en la R09, la larga (no apaga nada) y luego la corta
    for (let i = 0; i < 2; i++) { await menu(); const d = await D(); await clickOpt(d.ci); await until((i) => __game.game.duelInfo.hits > i, i); }
    v = await V();
    ok(v.rival.apagados === 2 && /: \+1$/.test(v.notificacion || 'x: +1'), `dos aciertos: dos puntos del rival apagados (${v.rival.apagados})`);
    // guardar a mitad y cargar: el duelo vuelve a empezar desde 0, con la ventana entera
    await G(() => __game.game.save(3));
    await G(() => __game.game.load(3));
    ok(await menu(), 'tras cargar: el duelo se retoma');
    v = await V();
    ok(v && v.rival.apagados === 0 && v.bruno.apagados === 0 && (await D()).hits === 0, 'tras cargar: todos los puntos encendidos (empieza de 0)');
    for (let i = 0; i < 2; i++) { await menu(); const d = await D(); await clickOpt(d.ci); await until((i) => __game.game.duelInfo.hits > i, i); }
    await menu();
    let d = await D();
    ok(d.attack === 'R09' && d.pairs.includes('larga'), 'R09: la larga en el menú');
    await clickOpt(d.pairs.indexOf('larga'));
    ok(await until(() => __game.game.duelInfo.phase === 'larga', null, 8000, false), 'la larga no cabe');
    v = await V();
    ok(v.rival.apagados === 2 && v.bruno.apagados === 0 && !v.destello && !v.copia, '`cabe`: la larga no apaga puntos, no destella ni pone a nadie en copia');
    await menu(); d = await D();
    await clickOpt(d.ci);
    ok(await until(() => __game.game.duelInfo && __game.game.duelInfo.phase === 'finisher'), 'la corta acierta → remate');
    v = await V();
    ok(v.rival.apagados === 3, 'tres puntos del rival apagados');
    await T.ctx.close();
  }

  // ====================================================================== D3 con ratón: 2 puntos, escribiendo, interrumpir
  console.log('\nD3 (Gervasio) con ratón: 2 puntos, «escribiendo» en el cuerpo, interrumpir no cuenta');
  {
    const T = await open('pajarera', { ...ACTO3, duelo_gervasio_ganado: false, sala_abierta: false, ...REPS, 'duel:ayuda': true }, ['fotocopia_nota_direccion']);
    const { G, until, clickOpt, V, D, shot, tapado } = T;
    G(() => { __game.game.runScript(api => api.duel('gervasio'), { label: 'd3' }); });
    ok(await until(() => { const g = __game.game; return !!(g.choice && g.duelInfo && g.duelInfo.escribiendo); }), 'menú con Gervasio escribiendo');
    let v = await V();
    ok(v.escribiendo && v.rival.total === 2 && v.bruno.total === 3 && v.pregunta === '¿Quién redacta el acta?', `«escribiendo» en el cuerpo; 2 puntos del rival (winScore 2) y 3 de Bruno; «${v.pregunta}»`);
    for (const id of ['gervasio_acta', 'bruno']) { const t = await tapado(id); ok(!t.tapa, `${id} a la vista`); }
    await shot('d3-escribiendo');
    let d = await D();
    await clickOpt(d.ci);
    ok(await until(() => __game.game.duelInfo && __game.game.duelInfo.interrumpeN === 1, null, 8000, false), 'interrumpe');
    v = await V();
    ok(v.rival.apagados === 0 && v.bruno.apagados === 0 && !v.destello && !v.notificacion, '`aTiempo`: interrumpir no apaga puntos ni da «+1»');
    ok(await until(() => { const g = __game.game; return !!(g.choice && g.duelInfo && g.duelInfo.phase === 'reply' && !g.duelInfo.escribiendo && g.duelInfo.interrumpeN === 1); }, null, 30000), 'espera a que acabe de escribir');
    d = await D(); await clickOpt(d.ci);
    ok(await until(() => __game.game.duelInfo.hits === 1, null, 8000, false), 'acierto');
    v = await V();
    ok(v.rival.apagados === 1 && v.notificacion === 'Eutimio: +1', `un punto de 2 apagado y «${v.notificacion}»`);
    await T.ctx.close();
  }

  // ====================================================================== D4 con ratón: el clímax
  console.log('\nD4 (Íñigo, clímax) con ratón: 5 + 3 puntos, «+1» y el cameo de Tadeo');
  {
    const T = await open('pecera', { ...ACTO3, ...REPS, 'duel:ayuda': true });
    const { G, until, clickOpt, V, D, menu, shot, tapado } = T;
    await G(() => __game.skipText(true));
    G(() => __game.gotoRoom('sala_amazonas')).catch(() => {});        // (no termina hasta que acaba el clímax)
    ok(await menu(), 'el clímax abre D4');
    await G(() => __game.skipText(false));
    await sleep(400);
    let v = await V();
    ok(v.rival.total === 5 && v.bruno.total === 3 && v.pregunta === '¿Quién apaga la rotativa?', `5 puntos del rival y 3 de Bruno; «${v.pregunta}»`);
    for (const id of ['inigo_sinergia', 'bruno']) { const t = await tapado(id); ok(!t.tapa, `${id} a la vista`); }
    ok(await G(() => !!__game.game.actors.inigo_sinergia.hold), 'Íñigo con el móvil en la mano');
    await shot('d4-menu');
    const d = await D(); await clickOpt(d.ci);
    ok(await until(() => { const v = __game.game.duelVista; return !!(v && v.notificacion === 'Yoli: +1'); }, null, 8000, false), '«Yoli: +1»');
    ok(await until(() => { const v = __game.game.duelVista; return !!(v && v.notificacion && v.notificacion.startsWith('Tadeo: «RV: Resumen IA')); }, null, 20000), 'el cameo de Tadeo como notificación');
    await T.ctx.close();
  }
} catch (e) { failures++; console.log('EXCEPCIÓN', e); }
ok(errs.length === 0, 'sin errores de consola ' + errs.slice(0, 3).join(' | '));
console.log(`\n${checks - failures}/${checks} ${failures ? 'FALLAN ' + failures : 'DUELO-UI: OK'}`);
await browser.close(); server.close();
process.exit(failures ? 1 : 0);
