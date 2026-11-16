#!/usr/bin/env node
// PRUEBA DEL PAQUETE P0 DE LA ENMIENDA E7 (motor, docs/guion2/ENMIENDA_E7.md §5): `aTiempo` en engine/duel.js y F3 en
// engine/core.js, con ratón y dedo reales. Capturas en tools/shots/e7-motor-*.png. Cubre (sobre el D3 de Gervasio, que es
// el único rival que declara `aTiempo`; prototipo de la contra: docs/guion2/e7/contra/test-e7-proto.mjs):
//   · el menú se abre con el rival escribiendo (`duelInfo.escribiendo`, el primer trozo en el cuerpo, el móvil en la mano);
//   · clic real antes de tiempo → Bruno, cortado (`cortada`), «Me has interrumpido. Se apunta.», 0 fallos, sin RE: ni CC de
//     más, el mismo ataque desde el primer trozo; la segunda interrupción → la rotación `taunt`;
//   · el comodín elegido mientras escribe es una interrupción y NO se gasta (luego contesta «Te espero.», no el `again`);
//   · esperar → la frase entera en el cuerpo y como aviso en el registro (`name` aparte), el móvil fuera; acierto;
//   · un fallo de verdad con la frase acabada sí cuenta;
//   · guardar y cargar a mitad de la escritura → el duelo empieza de 0 y NINGUNA escritura huérfana en 4,5 s;
//   · Esc durante la escritura → menú de pausa: la escritura se congela y sigue al volver;
//   · remate con la fotocopia por clic real y, con el ratón quieto, la barra no se queda con «Usar …» (F3);
//   · modo rápido: sin trozos (la frase entera de golpe, al registro como aviso), contestar en seguida es acierto;
//   · D1 (Maripaz), D2 (Teodoro, con `cabe`) y D4 (Íñigo, el clímax) no declaran `aTiempo`: el cuerpo es el ataque entero
//     al abrir el menú, nunca `escribiendo`, contestar en seguida acierta; F3 en D1 y D4 con el ratón quieto;
//   · táctil 844 × 390 (dedo): interrumpir una y dos veces sin fallo y acertar esperando.
//   node tools/test-e7-motor.mjs
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
const BASE = { intro_vista: true, torno_abierto: true, inigo_presentado: true, acto_2_iniciado: true, silla_libre: true,
  gertrudis_saludada: true, cafetera_viral: true, cafetera_viral_vista: true, chaqueta_cogida: true, chaqueta_en_lector: true };
const D3F = { ...BASE, acto_3_iniciado: true, rep_07: true, rep_03: true, rep_01: true, rep_05: true };
const R07 = 'Esto se necesitaba para... para cuando... me consta que ya lo hablamos.';
const R03 = 'El acta se necesitaba para... para...';

async function open(room, flags, inv = [], ctxOpts = { viewport: { width: 960, height: 600 } }) {
  const ctx = await browser.newContext(ctxOpts);
  const page = await ctx.newPage();
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', e => errs.push('pageerror: ' + e.message));
  await page.goto(base + '?room=' + room);
  await page.waitForFunction(() => window.__game && __game.state().mode === 'play');
  const G = (fn, a) => page.evaluate(fn, a);
  await G(() => { __game.skipText(true); return __game.waitIdle(); });
  await G((F) => { for (const [k, v] of Object.entries(F)) __game.setFlag(k, v); }, flags);
  await G((inv) => { for (const i of inv) if (!__game.game.state.inventory.includes(i)) __game.game.state.inventory.push(i); __game.skipText(false); }, inv);
  const until = async (fn, arg, ms = 12000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { await G(() => __game.skipSpeech()); if (await G(fn, arg)) return true; await sleep(40); } return false; };
  const tactil = !!ctxOpts.hasTouch;
  const clickOpt = async (i) => { const p = await G(i => __game.optionPos(i), i); if (tactil) await page.touchscreen.tap(p.x, p.y + 2); else await page.mouse.click(p.x, p.y); };
  const logHas = (t) => G(t => __game.log.some(l => l.text === t || String(l.text).endsWith(t)), t);
  const D = () => G(() => { const d = __game.game.duelInfo; return d && { phase: d.phase, attack: d.attack, body: d.body, esc: d.escribiendo, inter: d.interrumpeN, hits: d.hits, misses: d.misses,
    ci: d.correctIndex, wi: d.weakIndex, pairs: d.optionPairs, subject: d.subject, cc: d.cc, options: d.options }; });
  const menuReply = () => until(() => { const g = __game.game; return !!(g.choice && g.duelInfo && g.duelInfo.phase === 'reply' && g.duelInfo.options); });
  const shot = (name) => page.screenshot({ path: path.join(shots, `e7-motor-${name}.png`) });
  return { ctx, page, G, until, clickOpt, logHas, D, menuReply, shot };
}
const comodinPrimero = (G, id) => G((id) => {
  const g = __game.game, D = g.content.duels;
  g.state.flags['duel:' + id + ':floja'] = (D.weakReplies || []).filter(w => !w.only || [].concat(w.only).includes(id)).length;
}, id);

try {
  // ====================================================================== D3 con ratón
  console.log('D3 (Gervasio) con `aTiempo`, ratón real');
  {
    const T = await open('pajarera', D3F, ['fotocopia_nota_direccion']);
    const { page, G, until, clickOpt, logHas, D, menuReply, shot } = T;
    const cm = await G(() => __game.game.content.duels.comodin);
    const taunt = await G(() => __game.game.content.duels.opponents.gervasio.taunt);
    await comodinPrimero(G, 'gervasio');
    await G(() => { __game.game.runScript(api => api.duel('gervasio'), { label: 'd3' }); });
    ok(await menuReply(), 'primer menú abierto');
    let I = await D();
    ok(I.attack === 'R07' && I.esc === true && I.body === 'Esto se necesitaba para...', `R07: el menú se abre con Gervasio escribiendo y el primer trozo en el cuerpo («${I.body}»)`);
    ok(await G(() => { const h = __game.game.actors.gervasio_acta.hold; return !!(h && h.item === 'movil'); }), 'Gervasio sostiene el móvil mientras escribe');
    const sub0 = I.subject, cc0 = I.cc;
    await sleep(450); await shot('escribiendo');
    // 1) el comodín, antes de tiempo: interrupción (no se gasta)
    const iC = I.options.indexOf(cm.text);
    ok(iC >= 0 && I.pairs[iC] === 'comodin', 'en el primer menú está el comodín');
    await G(() => __game.clearLog());
    await clickOpt(iC);
    ok(await until(() => __game.log.some(l => l.text === 'Me has interrumpido. Se apunta.')), '1.ª interrupción (con el comodín): «Me has interrumpido. Se apunta.»');
    ok(await logHas('Enviado desde mi...'), 'Bruno, cortado (tres palabras): «Enviado desde mi...»');
    ok(!(await logHas(cm.answer)) && !(await logHas(cm.again)), 'el comodín no contesta: ha sido una interrupción');
    ok(await menuReply(), 'el mismo ataque vuelve');
    I = await D();
    ok(I.misses === 0 && I.inter === 1 && I.attack === 'R07' && I.hits === 0 && I.subject === sub0 && I.cc === cc0 && I.body === 'Esto se necesitaba para...',
      `0 fallos, 1 interrupción, ni RE: ni CC de más, R07 desde el primer trozo (${I.subject} · ${I.cc})`);
    // 2) la segunda: la réplica del R03 (la trampa), antes de tiempo → taunt
    const iR03 = I.pairs.indexOf('R03');                  // la que «termina» la frase a medias: la trampa
    await comodinPrimero(G, 'gervasio');                 // el comodín, en el menú que se abre tras esta interrupción
    await sleep(200); await clickOpt(iR03 >= 0 ? iR03 : 0);
    ok(await until(() => __game.game.duelInfo && __game.game.duelInfo.interrumpeN === 2), '2.ª interrupción');
    ok(await until((t) => __game.log.some(l => l.text === t), taunt[0]), `la 2.ª contesta con la rotación «taunt» («${taunt[0]}»)`);
    ok(await menuReply(), 'menú otra vez');
    I = await D(); ok(I.misses === 0 && I.hits === 0 && I.subject === sub0, `la trampa del R07 no cuenta fallo (${I.misses})`);
    // 3) esperar: la frase entera, el aviso y el móvil fuera; el comodín, ahora con la frase acabada, contesta «Te espero.»
    ok(await until(() => __game.game.duelInfo && __game.game.duelInfo.escribiendo === false && !!__game.game.choice, null, 15000), 'Gervasio deja de escribir');
    I = await D();
    ok(I.body === R07, `la frase entera en el cuerpo: «${I.body}»`);
    ok(await G((t) => __game.log.some(l => l.who === 'aviso' && l.name === 'Gervasio Acta' && l.text === t), R07), 'la frase entera va al registro como aviso (name aparte)');
    ok(await G(() => !__game.game.actors.gervasio_acta.hold), 'al acabar de escribir suelta el móvil');
    await shot('acabada');
    const iC2 = I.options.indexOf(cm.text);
    if (iC2 >= 0) {
      await clickOpt(iC2);
      ok(await until((t) => __game.log.some(l => l.text === t), cm.answer), `el comodín no se había gastado: contesta «${cm.answer}»`);
      ok(await menuReply(), 'tras el comodín, el mismo ataque');
      ok(await until(() => __game.game.duelInfo && __game.game.duelInfo.escribiendo === false && !!__game.game.choice, null, 15000), 'espera');
      I = await D();
    } else ok(false, 'el comodín no salió en el menú tras la espera');
    await clickOpt(I.ci);
    ok(await until(() => __game.game.duelInfo && __game.game.duelInfo.hits === 1), 'R07, esperando: acierto');
    I = await D(); ok(I.misses === 0, `sin fallos (${I.misses})`);
    ok(await menuReply(), 'R03');
    I = await D(); ok(I.attack === 'R03' && I.esc === true && I.body === 'El acta se necesitaba para...', 'R03 escribiendo');
    // 4) guardar y cargar a mitad
    await G(() => __game.game.save(3));
    await G(() => __game.game.load(3));
    ok(await until(() => !!__game.game.duelInfo && __game.game.duelInfo.phase === 'reply' && !!__game.game.choice), 'al cargar, el duelo se reanuda');
    I = await D(); ok(I.hits === 0 && I.misses === 0 && I.attack === 'R07' && I.inter === 0, `reanudado desde 0 (${I.attack}, ${I.hits}/${I.misses}, interrupciones ${I.inter})`);
    const n0 = await G(() => __game.log.length);
    await sleep(4500);
    ok(await G((k) => __game.log.slice(k).filter(l => l.who === 'aviso' && /^El acta/.test(l.text)).length, n0) === 0, 'ninguna escritura huérfana del duelo de antes (ni aviso del R03 en 4,5 s)');
    // 5) Esc a mitad de la escritura: la pausa la congela
    ok(await until(() => __game.game.duelInfo && __game.game.duelInfo.escribiendo === false && !!__game.game.choice, null, 15000), 'R07 acabado (tras cargar)');
    I = await D(); await clickOpt(I.ci);
    ok(await until(() => __game.game.duelInfo && __game.game.duelInfo.hits === 1 && __game.game.duelInfo.escribiendo === true && !!__game.game.choice), 'R03 escribiendo otra vez');
    await page.keyboard.press('Escape');
    ok(await G(() => !!__game.game.menu), 'Esc abre el menú de pausa');
    const b0 = (await D()).body;
    await sleep(3000);
    I = await D();
    ok(I.esc === true && I.body === b0, `en pausa no escribe (${I.body})`);
    await shot('pausa');
    await page.keyboard.press('Escape');
    ok(await G(() => !__game.game.menu), 'Esc otra vez: vuelve al duelo');
    ok(await until(() => __game.game.duelInfo && __game.game.duelInfo.escribiendo === false, null, 8000), 'y la escritura sigue hasta el final');
    // 6) fallo de verdad
    I = await D(); const mal = I.pairs.findIndex((p, k) => k !== I.ci && p !== 'comodin' && p !== 'floja');
    await clickOpt(mal >= 0 ? mal : (I.ci + 1) % I.options.length);
    ok(await until(() => __game.game.duelInfo && __game.game.duelInfo.misses === 1), 'contestar mal con la frase acabada sí es un fallo');
    // 7) hasta el remate
    for (let k = 0; k < 4; k++) {
      if (!(await until(() => !!__game.game.duelInfo && !!__game.game.choice && (__game.game.duelInfo.phase === 'finisher' || __game.game.duelInfo.escribiendo === false), null, 15000))) break;
      I = await D(); if (I.phase === 'finisher') break;
      await clickOpt(I.ci); await until(() => !__game.game.choice || !__game.game.duelInfo);
    }
    ok(await until(() => __game.game.duelInfo && __game.game.duelInfo.phase === 'finisher' && !!__game.game.choice), 'remate (2 aciertos)');
    I = await D(); await clickOpt(I.options.indexOf('[Usar objeto]'));
    ok(await until(() => !!__game.game.itemPick), 'elige objeto');
    const ip = await G(() => __game.invPos('fotocopia_nota_direccion'));
    await page.mouse.move(ip.x, ip.y); await sleep(120); await page.mouse.click(ip.x, ip.y);
    ok(await until(() => !__game.game.duelActive, null, 20000), 'duelo acabado');
    ok(await G(() => !!__game.game.state.flags['duel:gervasio:won']), 'ganado');
    await until(() => __game.state().mode === 'play' && !__game.game.busy, null, 8000);
    const st = await G(() => __game.game.sentenceText());
    ok(!/^Usar/.test(st), `F3 (D3): con el ratón quieto, la barra no se queda con «Usar …» («${st}»)`);
    await T.ctx.close();
  }

  // ====================================================================== modo rápido
  console.log('\nD3 en modo rápido: sin trozos');
  {
    const T = await open('pajarera', D3F, ['fotocopia_nota_direccion']);
    const { G, until, clickOpt, D, menuReply } = T;
    await G(() => { __game.skipText(true); __game.clearLog(); __game.game.runScript(api => api.duel('gervasio'), { label: 'd3' }); });
    ok(await menuReply(), 'menú');
    let I = await D();
    ok(I.esc === false && I.body === R07, `la frase entera de golpe, sin «escribiendo» («${I.body}»)`);
    ok(await G((t) => __game.log.some(l => l.who === 'aviso' && l.text === t), R07), 'también va al registro como aviso');
    await clickOpt(I.ci);
    ok(await until(() => __game.game.duelInfo && __game.game.duelInfo.hits === 1), 'contestar en seguida es acierto');
    ok(await menuReply(), 'R03');
    I = await D(); ok(I.esc === false && I.body === R03 && I.inter === 0, `R03 entera («${I.body}»), 0 interrupciones`);
    await T.ctx.close();
  }

  // ====================================================================== D1, D2, D4: sin `aTiempo`
  console.log('\nD1, D2 y D4 (clímax) sin `aTiempo`: lo de siempre; F3 en D1 y D4');
  const sinCambio = async (T, id, nombre) => {
    const { G, until, clickOpt, D, menuReply } = T;
    const datos = await G((id) => { const D = __game.game.content.duels, o = D.opponents[id];
      return { aTiempo: !!o.aTiempo, deck: o.deck, attack: Object.fromEntries((o.deck || []).map(p => [p, (o.attackText && o.attackText[p]) || D.pairs.find(x => x.id === p).attack])) }; }, id);
    ok(!datos.aTiempo, `${nombre}: no declara aTiempo`);
    await G((id) => { __game.clearLog(); window.__d = __game.game.runScript(api => api.duel(id), { label: id }); }, id);
    ok(await menuReply(), `${nombre}: primer menú`);
    const I = await D();
    ok(I.esc === false && I.inter === 0 && I.body === datos.attack[I.attack], `${nombre}: el cuerpo es el ataque entero al abrir el menú, sin «escribiendo» («${String(I.body).slice(0, 40)}…»)`);
    await clickOpt(I.ci);
    ok(await until(() => __game.game.duelInfo && __game.game.duelInfo.hits === 1), `${nombre}: contestar en seguida es acierto`);
    ok(await G(() => (__game.game.duelInfo || {}).interrumpeN === 0 && !__game.log.some(l => l.who === 'aviso' && l.name)), `${nombre}: ni interrupciones ni avisos de escritura`);
    return datos;
  };
  const remateRaton = async (T, obj, nombre) => {
    const { page, G, until, clickOpt, D } = T;
    for (let k = 0; k < 6; k++) {
      if (!(await until(() => !!__game.game.duelInfo && !!__game.game.choice, null, 15000))) break;
      const I = await D(); if (I.phase === 'finisher') break;
      await clickOpt(I.ci); await until(() => !__game.game.choice);
    }
    const I = await D();
    ok(I && I.phase === 'finisher', `${nombre}: remate`);
    await clickOpt(I.options.indexOf('[Usar objeto]'));
    ok(await until(() => !!__game.game.itemPick), `${nombre}: elige objeto`);
    const ip = await G((o) => __game.invPos(o), obj);
    await page.mouse.move(ip.x, ip.y); await sleep(120); await page.mouse.click(ip.x, ip.y);
    await until(() => !__game.game.itemPick, null, 4000);
    const st = await G(() => __game.game.sentenceText());
    ok(!/^Usar/.test(st), `F3 (${nombre}): tras adjuntar, con el ratón quieto, la barra no dice «Usar …» («${st}»)`);
  };
  {
    const T = await open('sala_amazonas', { ...BASE, reunion_terminada: true, rep_08: true, rep_04: true, rep_11: true, rep_14: true }, ['ficha_pagina_7']);
    await sinCambio(T, 'maripaz', 'D1');
    await remateRaton(T, 'ficha_pagina_7', 'D1');
    await T.ctx.close();
  }
  {
    const T = await open('catacumba', { ...BASE, fax_con_papel: true, rep_06: true, rep_02: true, rep_09: true }, ['manual_fax']);
    await sinCambio(T, 'teodoro', 'D2');
    await T.ctx.close();
  }
  {
    const T = await open('sala_amazonas', { ...BASE, acto_3_iniciado: true, sala_abierta: true, ruben_libre: true, reunion_terminada: true,
      rep_10: true, rep_12: true, rep_13: true, rep_05: true, rep_16: true }, ['ticket_n1', 'acta_reunion', 'correo_evaristo']);
    await sinCambio(T, 'inigo', 'D4');
    await remateRaton(T, 'ticket_n1', 'D4');
    await T.ctx.close();
  }

  // ====================================================================== táctil
  console.log('\nD3 con el dedo (844 × 390, horizontal)');
  {
    const T = await open('pajarera', D3F, ['fotocopia_nota_direccion'], { viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
    const { G, until, clickOpt, D, menuReply, shot } = T;
    await G(() => { __game.game.runScript(api => api.duel('gervasio'), { label: 'd3' }); });
    ok(await menuReply(), 'menú');
    let I = await D(); ok(I.esc === true, 'escribiendo');
    await sleep(350); await shot('tactil');
    await clickOpt(I.ci);
    ok(await until(() => __game.game.duelInfo && __game.game.duelInfo.interrumpeN === 1), 'un toque antes de tiempo: interrupción');
    ok(await menuReply(), 'menú otra vez');
    await sleep(300);
    I = await D(); await clickOpt(I.ci);
    ok(await until(() => __game.game.duelInfo && __game.game.duelInfo.interrumpeN === 2), 'segundo toque antes de tiempo: segunda interrupción');
    ok(await menuReply(), 'menú');
    ok(await until(() => __game.game.duelInfo && __game.game.duelInfo.escribiendo === false, null, 15000), 'espera');
    I = await D(); ok(I.misses === 0, `0 fallos con dos interrupciones (${I.misses})`);
    await clickOpt(I.ci);
    ok(await until(() => __game.game.duelInfo && __game.game.duelInfo.hits === 1), 'toque con la frase acabada: acierto');
    await T.ctx.close();
  }
} catch (e) { failures++; console.log('EXCEPCIÓN', e); }
ok(errs.length === 0, 'sin errores de consola ' + errs.slice(0, 3).join(' | '));
console.log(`\n${checks - failures}/${checks} ${failures ? 'FALLAN ' + failures : 'MOTOR E7: OK'}`);
await browser.close(); server.close();
process.exit(failures ? 1 : 0);
