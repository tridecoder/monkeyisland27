#!/usr/bin/env node
// PRUEBA DEL PAQUETE PE DE LA ENMIENDA E5 (Planta 2: Marketing y Comercial + Administración; docs/guion2/ENMIENDA_E5.md
// §2.5.1 y §10), con ratón real donde importa. Capturas en tools/shots/e5-pe-*.png. Cubre:
//   §2.5.1 el rotulador de objetivos: Coger el termómetro con el ratón en el Acto I (Maripaz lo regala) y en el III; en el
//   II antes de D1 (sin Maripaz) en silencio; no se duplica (la 2.ª vez, lo genérico); sin `torno_abierto`, nada;
//   guardar/cargar (antes y después de cogerlo).
//   Decisión del dueño: el árbol de Begoña sin «¿Usted ha sido feliz alguna vez?» (y el resto del árbol, entero).
//   Textos de PE: C45, C47-C52, M17; C53-C57, C81-C83, R2.
//   E3 M1 («La lectora del inventario»: Dar la pieza a Maripaz) sigue funcionando.
//   node tools/test-e5-pe.mjs
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
const ACTO2_D1 = { ...ACTO2, duelo_maripaz_ganado: true, casilla_hueco: true };
const ACTO3 = { ...ACTO2_D1, acto_3_iniciado: true, pagina_cerrada: true, casilla_fuente: true, casilla_firma: true };

const MARIPAZ_ROT = '¿Mi rotulador de objetivos? Llévatelo. Lo que pintes, lo cobro como espacio.';

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
  await goto(G, room);
  return { ctx, page, G };
}
const shot = (page, name) => page.screenshot({ path: path.join(shots, `e5-pe-${name}.png`) });
const until = async (G, fn, arg, ms = 8000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await G(fn, arg)) return true; await sleep(50); } return false; };
async function goto(G, room, entry) {
  await G(() => __game.skipText(true));
  await G(([r, e]) => __game.gotoRoom(r, e), [room, entry]);
  await G(() => { __game.skipSpeech(); return __game.waitIdle(); });
  await G(() => { __game.skipText(false); __game.skipSpeech(); __game.game.speeches.length = 0; __game.clearLog(); });
}
const log = (G) => G(() => __game.log.filter(l => l.who !== 'aviso').map(l => l.who + ': ' + l.text));
const inv = (G) => G(() => __game.state().inventory.slice());
const flag = (G, k) => G((k) => __game.getFlag(k), k);
const idle = (G) => G(() => __game.waitIdle());
/** Verbo + objeto con el ratón real (clic en el verbo y en el objeto de la sala). */
async function clicVerbo(page, G, verbo, id) {
  const v = await G((v) => __game.verbPos(v), verbo);
  await page.mouse.click(v.x, v.y); await sleep(80);
  const c = await G((id) => __game.screenPos(id), id);
  await page.mouse.click(c.x, c.y);
}
/** Coge el rotulador con el ratón; si `foto`, captura mientras habla Maripaz. */
async function cogerRotulador(page, G, foto) {
  await clicVerbo(page, G, 'coger', 'termometro_ventas');
  if (foto) {
    const hablo = await until(G, (t) => __game.state().speaking.some(s => s.text === t), MARIPAZ_ROT);
    if (hablo) { await sleep(400); await shot(page, foto); }
  }
  await sleep(200); await idle(G);
}
const cuenta = (arr, x) => arr.filter(i => i === x).length;

try {
  // ================================================================ Acto I: Maripaz lo regala
  console.log('§2.5.1 Acto I: Coger el termómetro con el ratón → Maripaz da el rotulador');
  {
    const { ctx, page, G } = await open(ACTO1);
    ok(await G(() => __game.state().room === 'ecosistema'), 'en Marketing y Comercial, Acto I');
    await G(() => __game.save(2));                                          // partida sin rotulador
    await cogerRotulador(page, G, 'rotulador-acto1');
    let L = await log(G), I = await inv(G);
    ok(L.includes('maripaz_remitido: ' + MARIPAZ_ROT), 'Maripaz: «¿Mi rotulador de objetivos? Llévatelo…»');
    ok(cuenta(I, 'rotulador_rojo') === 1 && await flag(G, 'ecosistema_rotulador_dado') === true, 'rotulador_rojo en el inventario y ecosistema_rotulador_dado');
    // inventario: el icono a la vista (y su Mirar, de I1)
    await G(() => __game.clearLog());
    const vm = await G(() => __game.verbPos('mirar')); await page.mouse.click(vm.x, vm.y); await sleep(80);
    const ip = await G(() => __game.invPos('rotulador_rojo')); await page.mouse.click(ip.x, ip.y);
    await until(G, () => __game.state().speaking.length > 0, null, 3000); await sleep(300);
    await shot(page, 'inventario');
    await idle(G);
    ok((await log(G)).includes('bruno: Rotulador rojo de Comercial. Solo ha pintado objetivos.'), 'Mirar el rotulador (clic en el inventario) → su línea');
    // no se duplica: la 2.ª vez, lo genérico
    await G(() => __game.clearLog());
    await cogerRotulador(page, G);
    L = await log(G); I = await inv(G);
    ok(cuenta(I, 'rotulador_rojo') === 1 && !L.some(l => l.includes('rotulador de objetivos')) && L.some(l => l.startsWith('bruno: ')),
      `2.º Coger: no se duplica y suena lo genérico («${(L.find(l => l.startsWith('bruno: ')) || '').slice(7, 60)}…»)`);
    // Usar el termómetro sigue como hoy (con Maripaz)
    await G(() => __game.clearLog()); await G(() => __game.doVerb('usar', 'termometro_ventas'));
    ok((await log(G)).includes('maripaz_remitido: Así lo pinto yo los viernes. Pero con más pulso.'), 'Usar el termómetro: lo de hoy');
    // guardar con el rotulador / cargar sin él / cargar con él
    await G(() => __game.save(3));
    await G(() => __game.load(2));
    ok(cuenta(await inv(G), 'rotulador_rojo') === 0 && !(await flag(G, 'ecosistema_rotulador_dado')), 'cargar la partida de antes: sin rotulador ni flag');
    await G(() => { __game.skipText(true); }); await cogerRotulador(page, G); await G(() => __game.skipText(false));
    ok(cuenta(await inv(G), 'rotulador_rojo') === 1, 'tras cargar, se puede volver a coger (una vez)');
    await G(() => __game.load(3));
    await G(() => __game.clearLog()); await cogerRotulador(page, G);
    ok(cuenta(await inv(G), 'rotulador_rojo') === 1 && await flag(G, 'ecosistema_rotulador_dado') === true && !(await log(G)).some(l => l.includes('rotulador de objetivos')),
      'cargar la partida con el rotulador: lo conserva y no vuelve a darlo');
    // C52 y C51 no aplican aquí (Maripaz está); M17: sin la frente en el árbol de Maripaz
    await G(() => { __game.setFlag('bruno_sellado_frente', true); __game.clearLog(); });
    await G(() => __game.doVerb('hablar', 'maripaz_remitido'));
    ok(!(await log(G)).some(l => /frente/.test(l)), 'M17: con la frente sellada, Maripaz ya no dice «Llevas RECHAZADO en la frente.»');
    await G(() => __game.chooseText('Me voy.')); await idle(G);
    await ctx.close();
  }

  // ================================================================ Acto II antes de D1: Bruno lo coge en silencio
  console.log('\n§2.5.1 Acto II (Maripaz en la Sala): Bruno lo coge sin decir nada');
  {
    const { ctx, page, G } = await open(ACTO2);
    ok(await G(() => { const p = __game.game.actors.maripaz_remitido; return !(p && p.room === 'ecosistema'); }), 'Maripaz no está en la planta');
    await cogerRotulador(page, G);
    const L = await log(G);
    ok(cuenta(await inv(G), 'rotulador_rojo') === 1 && L.length === 0, `en silencio (${L.length} líneas) y con el rotulador`);
    await G(() => __game.clearLog()); await G(() => __game.doVerb('usar', 'termometro_ventas'));
    ok((await log(G)).includes('bruno: Rojo hasta el 98 %. Nadie lo nota.'), 'C52: «Rojo hasta el 98 %. Nadie lo nota.»');
    await ctx.close();
  }

  // ================================================================ sin torno_abierto: nada
  console.log('\n§2.5.1 sin torno_abierto (forzado): lo genérico, sin rotulador');
  {
    const { ctx, page, G } = await open(ACTO1);
    await G(() => __game.setFlag('torno_abierto', false));
    await cogerRotulador(page, G);
    ok(cuenta(await inv(G), 'rotulador_rojo') === 0 && !(await flag(G, 'ecosistema_rotulador_dado')), 'sin torno_abierto no hay rotulador');
    await ctx.close();
  }

  // ================================================================ Acto III: Maripaz lo regala; textos de ecosistema; M1 de E3
  console.log('\n§2.5.1 Acto III: Coger el termómetro → Maripaz da el rotulador');
  {
    const { ctx, page, G } = await open(ACTO3);
    await cogerRotulador(page, G, 'rotulador-acto3');
    ok((await log(G)).includes('maripaz_remitido: ' + MARIPAZ_ROT) && cuenta(await inv(G), 'rotulador_rojo') === 1, 'Acto III: la línea de Maripaz y el rotulador');
    await G(() => __game.save(4)); await G(() => __game.load(4));
    ok(cuenta(await inv(G), 'rotulador_rojo') === 1, 'guardar/cargar en el III: un rotulador');

    console.log('\nTextos de Marketing y Comercial (C45, C47-C50)');
    const dice = async (verbo, id, item, esperado) => {
      await G(() => __game.clearLog()); await G(([v, o, i]) => __game.doVerb(v, o, i), [verbo, id, item]);
      const L = await log(G); ok(L.includes('bruno: ' + esperado), `${verbo}${item ? ' ' + item : ''} → ${id}: «${esperado}»`);
    };
    await G(() => __game.doVerb('mirar', 'aro_borja'));
    await dice('mirar', 'aro_borja', null, 'Mi primera firma en redes. Pone «[NOMBRE]».');
    await dice('coger', 'aro_borja', null, 'No. Si lo cojo, publica que me lo llevo.');
    await dice('coger', 'embudo_marketing', null, 'Si lo descuelgo, el móvil de Borja lo publica.');
    await G(() => __game.giveItem('movil'));
    await dice('usar', 'portatil_tadeo', 'movil', 'Le hago una foto. Me la reenvía.');
    await dice('usar', 'piel_platano', null, 'No. Yo quiero una plaza de bici.');

    console.log('\nE3 M1: Dar la pieza a Maripaz (la lee y la tasa)');
    await G(() => { __game.giveItem('pieza_opa'); __game.clearLog(); });
    await G(() => __game.doVerb('dar', 'maripaz_remitido', 'pieza_opa'));
    const L = await log(G);
    ok(L.includes('maripaz_remitido: Línea nueve: «Hidrovoltia, a por el Robledal». Quita el sueño. Siestatón.') &&
      L.includes('maripaz_remitido: Y la conclusión vale un faldón entero. Que no te la recorten.') && (await inv(G)).includes('pieza_opa'),
      'M1: «Línea nueve…» y «…Que no te la recorten.»; la pieza vuelve al inventario');
    await G(() => __game.clearLog()); await G(() => __game.doVerb('dar', 'maripaz_remitido', 'pieza_opa'));
    ok((await log(G)).includes('maripaz_remitido: ¿Toda esta noticia sin un anuncio en medio? Se ve demasiado.'), 'M1, segunda vez: la línea corta');
    await ctx.close();
  }

  // ================================================================ C51: entrada del Acto I
  console.log('\nC51: la entrada de las 18:30');
  {
    const { ctx, G } = await open(ACTO1, 'pecera');
    await G(() => __game.skipText(true)); await G(() => __game.clearLog());
    await G(() => __game.gotoRoom('ecosistema', 'pecera')); await idle(G);
    ok((await log(G)).includes('bruno: La planta 2 a las seis y media: moqueta, pufs y nadie.'), '«La planta 2 a las seis y media: moqueta, pufs y nadie.»');
    await ctx.close();
  }

  // ================================================================ Administración: Begoña sin «feliz», textos
  console.log('\nAdministración: el árbol de Begoña sin «¿Usted ha sido feliz alguna vez?»');
  {
    const { ctx, page, G } = await open({ ...ACTO2, chaqueta_cogida: true }, 'administracion');
    await G(() => __game.giveItem('sobre_azucar'));
    // árbol con el ratón: nota de gasto completa (paso 31)
    await clicVerbo(page, G, 'hablar', 'begona_triplicado');
    await until(G, () => !!__game.currentDialogOptions(), null, 15000);
    const opts0 = await G(() => __game.currentDialogOptions());
    ok(!opts0.some(o => /feliz/i.test(o)), 'antes de la nota: no hay opción «feliz»');
    const clicOpcion = async (txt) => {
      await until(G, () => !!__game.currentDialogOptions(), null, 15000); await sleep(150);
      const i = (await G(() => __game.currentDialogOptions())).findIndex(o => o.includes(txt));
      if (i < 0) return false;
      const p = await G((i) => __game.optionPos(i), i); await page.mouse.click(p.x, p.y + 3); return true;
    };
    await G(() => __game.skipText(true));
    for (const t of ['Quiero presentar una nota de gasto.', 'Café para entender el capitalismo.', 'Lo que sea.', 'Una foto mental.',
      'Aquí tiene. Un sobre de azúcar.', 'Pues enséñeme cómo es una nota bien hecha', '¿Y qué hago yo con dos copias']) {
      ok(await clicOpcion(t), `clic en «${t}»`);
    }
    await until(G, () => !!__game.currentDialogOptions(), null, 15000);
    const optsB0 = await G(() => __game.currentDialogOptions());
    await G(() => __game.skipText(false));
    await shot(page, 'begona-sin-feliz');
    ok(await flag(G, 'nota_gasto_presentada') === true && (await inv(G)).includes('copias_rechazadas'), 'la nota de gasto sigue funcionando (nota_gasto_presentada, copias)');
    ok(!optsB0.some(o => /feliz/i.test(o)), `tras la nota, B0 sin «feliz»: ${JSON.stringify(optsB0)}`);
    ok(optsB0.at(-1) === 'Nada. Me iba.', 'la despedida sigue al final');
    const L = await log(G);
    ok(L.includes('begona_triplicado: Las fotos mentales solo se aceptan con NIF.'), 'C82: «Las fotos mentales solo se aceptan con NIF.»');
    ok(L.includes('begona_triplicado: Un sobre de azúcar. Caducado en 2021. Del bolsillo de Ramírez, por el olor.') && !L.some(l => /sánscrito/.test(l)), 'R2: sin «…un ticket en sánscrito.»');
    ok(!L.some(l => /F-1|Felicidad|1987/.test(l)), 'ninguna línea del F-1 de Felicidad');
    await clicOpcion('Nada. Me iba.'); await idle(G);
    // «Varios.» → la frente (C57)
    await G(() => { __game.setFlag('nota_gasto_presentada', false); __game.clearLog(); __game.skipText(true); });
    await G(() => __game.doVerb('hablar', 'begona_triplicado'));
    await G(() => __game.chooseText('Quiero presentar una nota de gasto.'));
    await G(() => __game.chooseText('Varios.'));
    await G(() => __game.chooseText('Nada. Me iba.')); await idle(G);
    ok((await log(G)).includes('bruno: RECHAZADO, en la frente. Mi primer documento oficial.'), 'C57: «RECHAZADO, en la frente. Mi primer documento oficial.»');
    await G(() => __game.setFlag('nota_gasto_presentada', true));

    console.log('\nTextos de Administración (C53-C56, C81, C83)');
    const dice = async (verbo, id, item, esperado) => {
      await G(() => __game.clearLog()); await G(([v, o, i]) => __game.doVerb(v, o, i), [verbo, id, item]);
      const L = await log(G); ok(esperado.every(e => L.includes(e)), `${verbo}${item ? ' ' + item : ''} → ${id}: ${esperado.map(e => '«' + e.split(': ')[1] + '»').join(' / ')}`);
    };
    await G(() => { __game.giveItem('cafe'); __game.giveItem('movil'); __game.giveItem('tarjeta_becario'); });
    await dice('mirar', 'administracion_a_ecosistema', null, ['bruno: El pasillo, de vuelta a Marketing. Al fondo suena un gong.']);
    await dice('usar', 'tazas_begona', 'cafe', ['bruno: Lleno la del original y la dejo ahí. Begoña la mira con sospecha.']);
    await dice('usar', 'coma_enmarcada', null, ['bruno: Ya está en su sitio. Evaristo me mira hasta que aparto la mano.']);
    await dice('usar', 'evaristo_salvedad', 'movil', ['bruno: No le llamo. Está a un metro.', 'evaristo_salvedad: Puede llamarme. Lo cogería.']);
    await dice('dar', 'begona_triplicado', 'tarjeta_becario', ['begona_triplicado: «Pellizco». ¿Viene a justificarse? Usted no tiene ticket.']);
    await G(() => __game.clearLog());
    await G(() => __game.doVerb('hablar', 'evaristo_salvedad'));
    await G(() => __game.chooseText('¿Por qué llama tanto?'));
    ok((await log(G)).includes('evaristo_salvedad: Por escrito se pierden matices. En persona, comas. Por teléfono, nada.'), 'C83: «Por escrito se pierden matices. En persona, comas. Por teléfono, nada.»');
    await G(() => __game.chooseText('Me voy.')); await idle(G);
    await ctx.close();
  }
} catch (e) {
  failures++; console.log('  ✗ excepción: ' + (e && e.stack || e));
} finally {
  ok(consoleErrors.length === 0, `sin errores de consola${consoleErrors.length ? ': ' + consoleErrors.slice(0, 5).join(' | ') : ''}`);
  await browser.close(); server.close();
  console.log(`\n${checks - failures}/${checks} comprobaciones OK`);
  process.exit(failures ? 1 : 0);
}
