#!/usr/bin/env node
// PROTOTIPO de la contra (se copia a copia/tools y se lanza allí): D3 con `aTiempo` (interrupción, espera, acierto,
// guardar/cargar a mitad, remate), F3, la tele con Usar y la entrada del nudo (sobre → B_NOTA, Aurora, Begoña, ficha).
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
async function open(room, flags, inv = []) {
  const ctx = await browser.newContext({ viewport: { width: 960, height: 600 } });
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
  const clickOpt = async (i) => { const p = await G(i => __game.optionPos(i), i); await page.mouse.click(p.x, p.y); };
  const logHas = (t) => G(t => __game.log.some(l => l.text === t || l.text.endsWith(t)), t);
  return { ctx, page, G, until, clickOpt, logHas };
}
try {
  // ======================================================================== D3
  console.log('D3 con aTiempo');
  { const { page, G, until, clickOpt, logHas } = await open('pajarera', { ...BASE, acto_3_iniciado: true, rep_07: true, rep_03: true, rep_01: true, rep_05: true }, ['fotocopia_nota_direccion']);
    const D = () => G(() => { const d = __game.game.duelInfo; return d && { phase: d.phase, attack: d.attack, body: d.body, esc: d.escribiendo, inter: d.interrumpeN, hits: d.hits, misses: d.misses, ci: d.correctIndex, subject: d.subject, options: d.options }; });
    const menuReply = () => until(() => { const g = __game.game; return !!(g.choice && g.duelInfo && g.duelInfo.phase === 'reply' && g.duelInfo.options); });
    await G(() => { __game.game.runScript(api => api.duel('gervasio'), { label: 'd3' }); });
    ok(await menuReply(), 'primer menú abierto');
    let I = await D();
    ok(I.attack === 'R07' && I.esc === true && I.body === 'Esto se necesitaba para...', `R07 escribiendo, cuerpo = primer trozo (${I.body})`);
    await sleep(500); await page.screenshot({ path: path.join(shots, 'e7-proto-escribiendo.png') });
    const iR03 = I.options.indexOf('Ayer no puedo. Te miro hueco para anteayer.');
    await clickOpt(iR03 >= 0 ? iR03 : 0);
    ok(await until(() => __game.log.some(l => l.text === 'Me has interrumpido. Se apunta.')), '«Me has interrumpido. Se apunta.»');
    ok(await logHas('Ayer no puedo...'), 'Bruno, cortado: «Ayer no puedo...»');
    ok(await menuReply(), 'el mismo ataque vuelve');
    I = await D();
    ok(I.misses === 0 && I.inter === 1 && I.attack === 'R07' && !/RE: RE:/.test(I.subject), `0 fallos, 1 interrupción, sin RE: de más (${I.subject})`);
    await sleep(300); await clickOpt(0);
    ok(await until(() => __game.game.duelInfo && __game.game.duelInfo.interrumpeN === 2), 'segunda interrupción (taunt)');
    ok(await menuReply(), 'menú otra vez');
    ok(await until(() => __game.game.duelInfo && __game.game.duelInfo.escribiendo === false && !!__game.game.choice, null, 15000), 'deja de escribir');
    I = await D();
    ok(I.body === 'Esto se necesitaba para... para cuando... me consta que ya lo hablamos.', `frase entera: ${I.body}`);
    await page.screenshot({ path: path.join(shots, 'e7-proto-acabada.png') });
    ok(await G(() => __game.log.some(l => l.who === 'aviso' && l.text === 'Esto se necesitaba para... para cuando... me consta que ya lo hablamos.')), 'la frase entera va al log como aviso');
    await clickOpt(I.ci);
    ok(await until(() => __game.game.duelInfo && __game.game.duelInfo.hits === 1), 'R07 acierto');
    ok(await menuReply(), 'R03');
    I = await D(); ok(I.attack === 'R03' && I.esc === true, 'R03 escribiendo');
    await G(() => __game.game.save(3));
    await G(() => __game.game.load(3));
    ok(await until(() => !!__game.game.duelInfo && __game.game.duelInfo.phase === 'reply' && !!__game.game.choice), 'al cargar, el duelo se reanuda');
    I = await D(); ok(I.hits === 0 && I.misses === 0 && I.attack === 'R07', `reanudado desde 0 (${I.attack}, ${I.hits}/${I.misses})`);
    await sleep(4500);
    ok(await G(() => __game.log.filter(l => l.who === 'aviso' && /^El acta/.test(l.text)).length) === 0, 'ninguna escritura huérfana del duelo anterior');
    // un fallo de verdad, con la frase acabada
    ok(await until(() => __game.game.duelInfo && __game.game.duelInfo.escribiendo === false && !!__game.game.choice, null, 15000), 'espera');
    I = await D(); const mal = I.options.findIndex((o, i) => i !== I.ci); await clickOpt(mal);
    ok(await until(() => __game.game.duelInfo && __game.game.duelInfo.misses === 1), 'contestar mal con la frase acabada sí es fallo');
    for (const pid of ['R07', 'R03']) {
      ok(await until(() => __game.game.duelInfo && __game.game.duelInfo.escribiendo === false && !!__game.game.choice && __game.game.duelInfo.phase === 'reply', null, 15000), `espera (${pid})`);
      I = await D(); await clickOpt(I.ci);
      await until(() => __game.game.duelInfo && (!__game.game.choice));
    }
    ok(await until(() => __game.game.duelInfo && __game.game.duelInfo.phase === 'finisher' && !!__game.game.choice), 'remate');
    I = await D(); await clickOpt(I.options.indexOf('[Usar objeto]'));
    ok(await until(() => !!__game.game.itemPick), 'elige objeto');
    const ip = await G(() => __game.invPos('fotocopia_nota_direccion'));
    await page.mouse.move(ip.x, ip.y); await sleep(100); await page.mouse.click(ip.x, ip.y);
    ok(await until(() => !__game.game.duelActive, null, 20000), 'duelo acabado');
    ok(await G(() => !!__game.game.state.flags['duel:gervasio:won']), 'ganado');
    await until(() => __game.state().mode === 'play' && !__game.game.busy, null, 8000);
    const st = await G(() => __game.game.sentenceText());
    ok(!/^Usar/.test(st), `F3: la barra no se queda con «Usar …» (${st})`);
  }
  // ======================================================================== nudo (E1-E5)
  console.log('Nudo del Acto II');
  { const { G, until, logHas } = await open('catacumba', { ...BASE, aurora_conto_pasos: true, aurora_hablo_fax: true }, ['ficha_pagina_7', 'sobre_azucar']);
    const actual = await G(async () => { const m = await import('./engine/objetivos.js'); return m.actual(__game.game); });
    ok(actual === 'nota', `delante del fax, el objetivo es «nota» (${actual})`);
    const meta = await G(async () => { const m = await import('./engine/objetivos.js'); return m.meta(__game.game); });
    ok(meta === 'Teodoro no habla sin papel. Y en esta casa no queda un folio sin sellar.', `Mirar a Bruno: ${meta}`);
    await G(() => { __game.skipText(true); __game.game.runScript(api => api.dialog('aurora')); });
    await until(() => !!__game.game.choice);
    await G(() => __game.chooseText('¿De dónde saco papel para el fax?'));
    ok(await until(() => __game.log.some(l => l.text === 'Papel, en esta casa, solo gasta Begoña. Lo devuelve por triplicado.')), 'Aurora: N2');
    ok(await G(() => !!__game.game.state.flags.oyo_papel_begona), 'oyo_papel_begona');
    const F = await G(async () => { const m = await import('./content/items.js'); return m.fichaViva(__game.game.condApi()); });
    ok(F.includes('FIRMA: el fax no tiene papel. El papel, en esta casa, sale de Begoña.') && F.includes('Al margen, a lápiz: «CMS en coma. Sistemas no atiende a nadie».'), 'ficha: FIRMA con el papel y el margen nuevo');
    await G(() => __game.game.choice && __game.game.choice.resolve(-1));
    await until(() => !__game.game.choice && !__game.game.busy, null, 4000);
    await G(() => __game.gotoRoom('administracion', null)); await G(() => __game.waitIdle());
    await G(() => __game.clearLog());
    await G(() => __game.doVerb('dar', 'begona_triplicado', 'sobre_azucar'));
    ok(await until(() => !!__game.game.choice), 'dar el sobre: se abre un menú');
    ok(await G(() => __game.log.some(l => l.text === '¿Un sobre de azúcar? Sin nota de gasto, esto es azúcar.') && !__game.log.some(l => /19:07. Te quedan/.test(l.text)) && __game.log.some(l => /Uno: concepto/.test(l.text))), 'línea de siempre, sin saludo, y el impreso (B_NOTA)');
    await G(() => __game.chooseText('Nada. Importe cero. No he gastado nada.'));
    ok(await until(() => __game.log.some(l => l.text === 'Un trámite bien hecho, y ni un papel. Lo pongo en «logros».')), '«Importe cero» → N5');
    ok(await until(() => !!__game.game.choice && __game.game.choice.options.includes('Quiero presentar una nota de gasto.')), 'vuelve a B0 con la nota aún disponible');
    ok(await G(() => __game.game.choice.options.includes('¿Me da unos folios? Son para el fax de Teodoro.')), 'B0: «¿Me da unos folios?»');
    await G(() => __game.chooseText('¿Me da unos folios? Son para el fax de Teodoro.'));
    ok(await until(() => __game.log.some(l => l.text === 'Folios no doy. De esta ventanilla solo sale papel rechazado.')), 'Begoña: N4');
    await until(() => !!__game.game.choice);
    await G(() => __game.chooseText('Quiero presentar una nota de gasto.'));
    for (const t of ['Café para entender el capitalismo.', 'Lo que sea.', 'Aquí tiene. Un sobre de azúcar. Es casi un ticket.', 'Pues enséñeme cómo es una nota bien hecha, si tan lista es.']) {
      await until(() => !!__game.game.choice); await G((t) => __game.chooseText(t), t);
    }
    ok(await until(() => __game.game.state.flags.nota_gasto_presentada === true, null, 15000), 'nota presentada: fotocopia y copias');
  }
  // ======================================================================== tele (F2)
  console.log('Tele con Usar');
  { const { G, until, logHas } = await open('sala_amazonas', { ...BASE, sala_becario_sin_turno: true });
    await G(() => { __game.skipText(true); __game.clearLog(); });
    await G(() => __game.doVerb('mirar', 'tele_amazonas')); await G(() => __game.waitIdle());
    ok(await logHas('«BUSCANDO SEÑAL». Alguien con wifi y rencor la encontraría enseguida.'), 'Mirar tele con «sin turno»: wifi y rencor');
    await G(() => __game.doVerb('usar', 'tele_amazonas'));
    ok(await until(() => !!__game.game.choice && __game.game.choice.options.includes('Buenas noches, Gertrudis.')), 'Usar tele: el árbol de la tele');
    await G(() => __game.chooseText('Buenas noches, Gertrudis.'));
    await until(() => !!__game.game.choice);
    await G(() => __game.chooseText('¿Y cuáles son los siguientes pasos?'));
    ok(await until(() => __game.game.state.flags.reunion_terminada === true, null, 20000), 'Usar tele → estampida (reunion_terminada)');
  }
} catch (e) { failures++; console.log('EXCEPCIÓN', e); }
ok(errs.length === 0, 'sin errores de consola ' + errs.slice(0, 3).join(' | '));
console.log(`\n${checks - failures}/${checks}`);
await browser.close(); server.close();
process.exit(failures ? 1 : 0);
