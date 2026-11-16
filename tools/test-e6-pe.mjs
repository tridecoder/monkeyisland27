#!/usr/bin/env node
// PRUEBA DEL PAQUETE PE DE LA ENMIENDA E6 (Planta 2; docs/guion2/ENMIENDA_E6.md §2.9.1, B9, §4.1), con ratón real.
// Capturas en tools/shots/e6-pe-*.png. Cubre:
//   §2.9.1 el rotulador se VE colgando de un cordel junto al termómetro (hotspot `rotulador_cordel`):
//     · se ve desde el Acto I (con y sin Maripaz) y desaparece del dibujo al cogerlo (píxeles distintos);
//     · cogerlo por el cordel (clic) y por el termómetro (clic): uno solo, sin duplicar, con la línea de Maripaz si está;
//     · Mirar el termómetro: la 2.ª línea habla del cordel hasta cogerlo, y después, la de hoy; Mirar el cordel; Usar el cordel;
//     · sin `torno_abierto`, el cordel no da nada; guardar/cargar antes y después.
//   B9 (E326): «Le he mirado el reloj y se ha dado cuenta.» ya no se dice. E307: «Teodoro es el dueño…» ya no se dice.
//   Textos nuevos de §4.1 de Marketing y Comercial y de Administración (muestra).
//   node tools/test-e6-pe.mjs
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

const ACTO1 = { intro_vista: true, torno_abierto: true, inigo_presentado: true, ecosistema_interstitial: true };
const ACTO2 = { ...ACTO1, acto_2_iniciado: true, chaqueta_cogida: true, chaqueta_en_lector: true, silla_libre: true,
  gertrudis_saludada: true, cafetera_viral: true, cafetera_viral_vista: true };
const ACTO3 = { ...ACTO2, duelo_maripaz_ganado: true, casilla_hueco: true, acto_3_iniciado: true, pagina_cerrada: true,
  casilla_fuente: true, casilla_firma: true };

const MARIPAZ_ROT = '¿Mi rotulador de objetivos? Llévatelo. Lo que pintes, lo cobro como espacio.';
const CORDEL = 'bruno: El rotulador cuelga al lado, de un cordel, como el boli de un banco.';
const GONG = 'bruno: El 3 % que falta se lo lleva el gong de al lado.';

async function open(flags, room = 'ecosistema') {
  const ctx = await browser.newContext({ viewport: { width: 960, height: 600 } });
  const page = await ctx.newPage();
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));
  await page.goto(base + '?room=vestibulo');
  await page.waitForFunction(() => window.__game && __game.state().mode === 'play');
  const G = (fn, a) => page.evaluate(fn, a);
  await G(() => { __game.skipText(true); return __game.waitIdle(); });
  await G((F) => { for (const [k, v] of Object.entries(F)) __game.setFlag(k, v); }, flags);
  await G(() => __game.skipText(true));
  await G((r) => __game.gotoRoom(r), room);
  await G(() => { __game.skipSpeech(); return __game.waitIdle(); });
  await G(() => { __game.skipText(false); __game.skipSpeech(); __game.game.speeches.length = 0; __game.clearLog(); });
  return { ctx, page, G };
}
const shot = (page, name) => page.screenshot({ path: path.join(shots, `e6-pe-${name}.png`) });
const until = async (G, fn, arg, ms = 8000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await G(fn, arg)) return true; await sleep(50); } return false; };
const log = (G) => G(() => __game.log.filter(l => l.who !== 'aviso').map(l => l.who + ': ' + l.text));
const inv = (G) => G(() => __game.state().inventory.slice());
const flag = (G, k) => G((k) => __game.getFlag(k), k);
const idle = (G) => G(() => __game.waitIdle());
const cuenta = (arr, x) => arr.filter(i => i === x).length;
const visible = (G, id) => G((id) => { const o = __game.objects().find(o => o.id === id); return !!(o && o.visible); }, id);
async function clicVerbo(page, G, verbo, id) {
  const v = await G((v) => __game.verbPos(v), verbo);
  await page.mouse.click(v.x, v.y); await sleep(80);
  // el rotulador se pincha donde se VE (x 284-285, y 70-76: Bruno, parado junto al termómetro, no debe taparlo)
  const c = id === 'rotulador_cordel' ? await G(() => __game.roomPointToClient(285, 74)) : await G((id) => __game.screenPos(id), id);
  await page.mouse.click(c.x, c.y);
}
/** recorte en bruto (PNG) de la zona del termómetro, para comparar el dibujo antes/después */
async function zonaTermometro(page, G) {
  const a = await G(() => __game.virtualToClient(262, 56)), b = await G(() => __game.virtualToClient(294, 84));
  return (await page.screenshot({ clip: { x: a.x, y: a.y, width: b.x - a.x, height: b.y - a.y } })).toString('base64');
}
/** Coge el rotulador con el ratón por `via` (id del hotspot) con el verbo `verbo`. */
async function coger(page, G, via, verbo = 'coger') {
  await clicVerbo(page, G, verbo, via);
  await sleep(300); await G(() => __game.skipSpeech()); await idle(G);
}

try {
  // ================================================================ por el cordel (Acto I, con Maripaz)
  console.log('§2.9.1 Acto I: el rotulador se ve colgado y se coge por el cordel');
  {
    const { ctx, page, G } = await open(ACTO1);
    ok(await visible(G, 'rotulador_cordel'), 'el punto de clic `rotulador_cordel` existe y está visible (rotulador a la vista)');
    ok(await G(() => __game.objects().find(o => o.id === 'rotulador_cordel').name === 'rotulador'), 'se llama «rotulador»');
    const antes = await zonaTermometro(page, G);
    await shot(page, 'cordel-colgado');
    await G(() => __game.save(2));
    // Mirar el termómetro: segunda línea del cordel
    await G(() => __game.clearLog()); await G(() => __game.doVerb('mirar', 'termometro_ventas'));
    let L = await log(G);
    ok(L.includes('bruno: Un termómetro pintado a rotulador: «OBJETIVO Q3». Rojo hasta el 97 %.') && L.includes(CORDEL) && !L.includes(GONG),
      'Mirar el termómetro (sin coger): 1.ª línea de hoy y 2.ª «El rotulador cuelga al lado, de un cordel…»');
    await G(() => __game.skipSpeech()); await idle(G);
    await G(() => __game.clearLog()); await clicVerbo(page, G, 'mirar', 'rotulador_cordel');
    await until(G, (t) => __game.log.some(l => l.text === t), 'El rotulador cuelga al lado, de un cordel, como el boli de un banco.', 6000); await idle(G);
    ok((await log(G)).includes(CORDEL), 'Mirar el rotulador (ratón): la línea del cordel');
    // Coger por el cordel (ratón)
    await G(() => __game.clearLog());
    await clicVerbo(page, G, 'coger', 'rotulador_cordel');
    const hablo = await until(G, (t) => __game.state().speaking.some(s => s.text === t), MARIPAZ_ROT);
    if (hablo) { await sleep(300); await shot(page, 'maripaz-regala'); }
    await sleep(200); await G(() => __game.skipSpeech()); await idle(G);
    L = await log(G); let I = await inv(G);
    ok(L.includes('maripaz_remitido: ' + MARIPAZ_ROT), 'Coger el rotulador por el cordel: Maripaz «¿Mi rotulador de objetivos? Llévatelo…»');
    ok(cuenta(I, 'rotulador_rojo') === 1 && await flag(G, 'ecosistema_rotulador_dado') === true, 'rotulador_rojo en el inventario y flag puesto');
    ok(!(await visible(G, 'rotulador_cordel')), 'el punto de clic del cordel desaparece');
    await sleep(300);
    const despues = await zonaTermometro(page, G);
    ok(antes !== despues, 'el dibujo cambia: el rotulador ya no cuelga');
    await shot(page, 'cordel-vacio');
    // no se duplica
    await G(() => __game.clearLog());
    await clicVerbo(page, G, 'coger', 'termometro_ventas'); await sleep(300); await G(() => __game.skipSpeech()); await idle(G);
    ok(cuenta(await inv(G), 'rotulador_rojo') === 1 && !(await log(G)).some(l => l.includes('rotulador de objetivos')), 'Coger el termómetro después: no se duplica (lo genérico)');
    await G(() => __game.clearLog()); await G(() => __game.doVerb('mirar', 'termometro_ventas'));
    L = await log(G);
    ok(L.includes(GONG) && !L.includes(CORDEL), 'Mirar el termómetro con el rotulador cogido: «El 3 % que falta se lo lleva el gong de al lado.»');
    // guardar/cargar: la partida de antes vuelve a tener el rotulador colgado; la de después, no
    await G(() => __game.save(3));
    await G(() => __game.load(2)); await sleep(400);
    ok(await visible(G, 'rotulador_cordel') && cuenta(await inv(G), 'rotulador_rojo') === 0, 'cargar la partida de antes: el rotulador vuelve a colgar y no está en el inventario');
    ok(await zonaTermometro(page, G) === antes, 'cargar la partida de antes: el dibujo vuelve a mostrarlo');
    await G(() => __game.load(3)); await sleep(400);
    ok(!(await visible(G, 'rotulador_cordel')) && cuenta(await inv(G), 'rotulador_rojo') === 1 && await flag(G, 'ecosistema_rotulador_dado') === true,
      'cargar la partida de después: sin rotulador colgado, uno en el inventario y el flag puesto');
    ok(await zonaTermometro(page, G) !== antes, 'cargar la partida de después: el dibujo ya no muestra el rotulador');
    await ctx.close();
  }

  // ================================================================ por el termómetro, y Usar el cordel
  console.log('\n§2.9.1 por el termómetro: el rotulador sale del dibujo');
  {
    const { ctx, page, G } = await open(ACTO1);
    const antes = await zonaTermometro(page, G);
    await coger(page, G, 'termometro_ventas');
    ok(cuenta(await inv(G), 'rotulador_rojo') === 1 && !(await visible(G, 'rotulador_cordel')), 'Coger el termómetro: un rotulador y el cordel vacío');
    ok(await zonaTermometro(page, G) !== antes, 'el dibujo cambia también por esta vía');
    await G(() => __game.clearLog());
    await coger(page, G, 'rotulador_cordel');
    ok(cuenta(await inv(G), 'rotulador_rojo') === 1, 'el cordel ya no está: un solo rotulador');
    await ctx.close();
  }
  console.log('\n§2.9.1 Usar el cordel (Acto III, con Maripaz)');
  {
    const { ctx, page, G } = await open(ACTO3);
    ok(await visible(G, 'rotulador_cordel'), 'Acto III: el rotulador cuelga');
    await coger(page, G, 'rotulador_cordel', 'usar');
    const L = await log(G);
    ok(L.includes('maripaz_remitido: ' + MARIPAZ_ROT) && cuenta(await inv(G), 'rotulador_rojo') === 1, 'Usar el cordel = Coger: Maripaz lo regala y un rotulador');
    await G(() => __game.save(4)); await G(() => __game.load(4)); await sleep(300);
    ok(cuenta(await inv(G), 'rotulador_rojo') === 1 && !(await visible(G, 'rotulador_cordel')), 'guardar/cargar: un rotulador y el cordel vacío');
    await ctx.close();
  }
  console.log('\n§2.9.1 Acto II sin Maripaz: en silencio');
  {
    const { ctx, page, G } = await open({ ...ACTO2 });
    await coger(page, G, 'rotulador_cordel');
    ok(cuenta(await inv(G), 'rotulador_rojo') === 1 && (await log(G)).length === 0, 'Coger por el cordel sin Maripaz: sin líneas y con el rotulador');
    await ctx.close();
  }
  console.log('\n§2.9.1 sin torno_abierto (forzado): el cordel no da nada');
  {
    const { ctx, page, G } = await open(ACTO1);
    await G(() => __game.setFlag('torno_abierto', false));
    await coger(page, G, 'rotulador_cordel');
    ok(cuenta(await inv(G), 'rotulador_rojo') === 0 && !(await flag(G, 'ecosistema_rotulador_dado')), 'sin torno_abierto no hay rotulador');
    await ctx.close();
  }

  // ================================================================ textos de Marketing y Comercial (muestra §4.1)
  console.log('\nTextos nuevos de Marketing y Comercial');
  {
    const { ctx, G } = await open(ACTO3);
    const dice = async (verbo, id, item, esperado) => {
      await G(() => __game.clearLog()); await G(([v, o, i]) => __game.doVerb(v, o, i), [verbo, id, item]);
      const L = await log(G); ok(L.some(l => l.includes(esperado)), `${verbo} ${id}: «${esperado}»`);
    };
    await dice('usar', 'pizarra_sinergia', null, 'Debajo escribo «¿Y qué es?». Se borra solo. Por vergüenza.');   // E7 E286
    await dice('coger', 'lema_enmarcado', null, 'Si lo descuelgo, detrás habrá un módulo.');
    await dice('abrir', 'impresora_tercera', null, 'Dentro hay un folio que pone «PRUEBA».');
    await dice('coger', 'rollup_comercial', null, 'El roll-up no se toca: está contratado.');
    await G(() => __game.setFlag('ecosistema_portatil_cerrado', true));
    await dice('cerrar', 'portatil_tadeo', null, 'Ya está cerrado. Por fin descansa.');
    await dice('coger', 'maripaz_remitido', null, '¿Cogerme? Rellena antes el formulario: catorce campos, ocho obligatorios.');
    await G(() => { __game.setFlag('rumor_teodoro_n', 1); __game.clearLog(); __game.skipText(true); });
    await G(() => __game.doVerb('hablar', 'maripaz_remitido'));
    await G(() => __game.chooseText('Me voy.')).catch(() => {}); await idle(G);
    const L = await log(G);
    ok(!L.some(l => /dueño del edificio/.test(l)), 'E307: «Teodoro es el dueño del edificio…» ya no se dice');
    ok(await flag(G, 'rumor_teodoro_n') === 2, 'el rumor sigue subiendo a 2 (lo necesita Teodoro)');
    await ctx.close();
  }

  // ================================================================ Administración: B9 y textos
  console.log('\nAdministración: B9 y textos nuevos');
  {
    const { ctx, page, G } = await open({ ...ACTO2 }, 'administracion');
    const dice = async (verbo, id, item, esperado) => {
      await G(() => __game.clearLog()); await G(([v, o, i]) => __game.doVerb(v, o, i), [verbo, id, item]);
      const L = await log(G); ok(L.some(l => l.includes(esperado)), `${verbo} ${id}: «${esperado}»`);
    };
    await dice('mirar', 'evaristo_salvedad', null, 'Don Evaristo Salvedad, Controlling, con corbata de comas y lupa al cuello.');
    // B9: «¿Falta mucho?» → «Si tiene prisa…», sin «Le he mirado el reloj…»
    await G(() => { __game.skipText(true); __game.clearLog(); __game.setFlag('evaristo_convoco', 'llamada'); });   // [coherencia] le ha llamado (L2)
    await G(() => __game.doVerb('hablar', 'evaristo_salvedad'));
    await G(() => __game.chooseText('¿Para qué me ha llamado?'));
    await G(() => __game.chooseText('¿Falta mucho?')); await idle(G);
    const L = await log(G);
    ok(L.some(l => l.endsWith('Si tiene prisa, se lo pongo por escrito.')), 'B9: sale «Si tiene prisa, se lo pongo por escrito.»');
    ok(!L.some(l => /mirado el reloj/.test(l)), 'B9: «Le he mirado el reloj y se ha dado cuenta.» ya no se dice');
    ok(await G(() => __game.log.some(l => l.who === 'aviso' && l.text === 'Correo nuevo de Evaristo Salvedad: «Una cosita (1 de 3)».')), 'E7 F4: el aviso del correo de Evaristo, en el log');
    ok(L.some(l => l.includes('Pase un segundo, que es una cosita muy pequeña.')), 'E322: «Pellejo, con jota. Pase un segundo, que es una cosita muy pequeña.»');
    await shot(page, 'administracion');
    await ctx.close();
  }
  const src = fs.readFileSync(path.resolve(here, '../content/rooms/administracion.dialogos.js'), 'utf8');
  ok(/await api\.anim\(api\.player, 'reach', 700\);[^\n]*\n\s*await sayEv\(api, 'Si tiene prisa/.test(src), 'B9 (E7 F4: 700 ms): el gesto va justo antes de «Si tiene prisa…»');
} catch (e) {
  failures++; console.log('  ✗ excepción: ' + (e && e.stack || e));
} finally {
  ok(consoleErrors.length === 0, `sin errores de consola${consoleErrors.length ? ': ' + consoleErrors.slice(0, 5).join(' | ') : ''}`);
  await browser.close(); server.close();
  console.log(`\n${checks - failures}/${checks} comprobaciones OK`);
  process.exit(failures ? 1 : 0);
}
