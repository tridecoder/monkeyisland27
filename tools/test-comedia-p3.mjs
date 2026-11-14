#!/usr/bin/env node
// Test del PAQUETE P3 de la reescritura de comedia (docs/guion2/PLAN_COMEDIA.md §11 P3): Vending (`office`),
// Redacción de papel (`catacumba`) y Administración (`administracion`). Juega cada sala vía window.__game, simulando
// con setFlag/giveItem lo que viene de otros paquetes, y comprueba los pasos 14-16, 17, 18, 27-31, 33, 34 del recorrido
// nuevo (§3.1), los momentos 4.1 (cafetera viral), 4.4 (fugitivo y táper) y 4.5 (fax: golpes A y B), D2 con su
// derrota (§7.7), Begoña (§5.8) y la entrada nueva de la pared. Sin errores de consola.
//   node tools/test-comedia-p3.mjs            (rápido)
//   node tools/test-comedia-p3.mjs --shots    además, capturas de los momentos en tools/shots/comedia-p3-*.png
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from './serve.mjs';
import { createRunner } from './walk-lib.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const SHOTS = process.argv.includes('--shots');

const server = createServer(path.resolve(here, '..'));
await new Promise(r => server.listen(0, r));
const base = `http://localhost:${server.address().port}/`;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 960, height: 600 } });
const consoleErrors = [];
page.on('console', m => { if (m.type() === 'error' || /\[(contenido|motor|flags|sala (office|catacumba|administracion))/.test(m.text())) consoleErrors.push(m.text()); });
page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));
const G = (fn, arg) => page.evaluate(fn, arg);
const state = () => G(() => __game.state());
const R = createRunner(page);

let passed = 0, failedN = 0;
const ok = (cond, msg) => { if (cond) { passed++; console.log('  ✓ ' + msg); } else { failedN++; console.log('  ✗ ' + msg); } };
const step = (t) => console.log('\n' + t);
const setFlags = (o) => G(o => { for (const [k, v] of Object.entries(o)) __game.setFlag(k, v); }, o);
const give = (...ids) => G(ids => ids.forEach(i => __game.giveItem(i)), ids);
const take = (...ids) => G(ids => ids.forEach(i => __game.takeItem(i)), ids);
const flag = (f) => G(f => __game.getFlag(f), f);
const has = async (i) => (await state()).inventory.includes(i);
const idle = () => G(() => __game.waitIdle());
const logHas = (txt) => G(t => __game.log.some(l => l.text.includes(t)), txt);
const clearLog = () => G(() => __game.clearLog());
const verb = async (v, t, i) => { await G(([v, t, i]) => __game.doVerb(v, t, i), [v, t, i || null]); await idle(); };
const opts = () => G(() => __game.currentDialogOptions());
const choose = async (txt) => { await R.chooseByText(txt); await idle(); };
const goto = async (room) => { await G(r => __game.gotoRoom(r), room); await idle(); };
const visible = (id) => G(id => { const a = __game.state().actors && __game.state().actors[id]; return a ? a.room : null; }, id);

/** Captura de un momento: lanza `start` sin esperar, deja correr el texto a velocidad real `ms` y fotografía. */
async function shotDuring(name, start, ms) {
  if (!SHOTS) { await start(); await idle(); return; }
  await G(() => __game.skipText(false));
  const p = start();
  const lista = Array.isArray(ms) ? ms : [ms];
  let t = 0;
  for (const [i, m] of lista.entries()) {
    await page.waitForTimeout(m - t); t = m;
    await page.screenshot({ path: path.join(here, 'shots', `comedia-p3-${name}${i ? '-' + (i + 1) : ''}.png`) });
  }
  await G(() => __game.skipText(true));
  await p; await idle();
}
const chooseNoWait = (txt) => G(t => {
  const o = __game.currentDialogOptions() || [];
  const n = s => String(s).toLowerCase().replace(/[«»"]/g, '');
  const i = o.findIndex(x => n(x).includes(n(t)));
  if (i >= 0) __game.chooseDialog(i);
  return i;
}, txt);
async function waitDuelChoice() {
  for (let k = 0; k < 300; k++) { const st = await state(); if (!st.duel) return null; if (st.dialog || st.pickItem) return st; await page.waitForTimeout(20); }
  throw new Error('el duelo no pide respuesta');
}
async function duelWeak(n) {
  for (let i = 0; i < n; i++) {
    const st = await waitDuelChoice(); if (!st) return;
    if (st.dialog[st.duel.weakIndex].startsWith('Enviado desde mi')) i--;
    await G(k => __game.chooseDialog(k), st.duel.weakIndex);
  }
}
async function duelCorrect(n) {
  for (let i = 0; i < n; i++) { const st = await waitDuelChoice(); if (!st || st.duel.phase !== 'reply') return; await G(k => __game.chooseDialog(k), st.duel.correctIndex); }
}
async function finisherObject(id) {
  const st = await waitDuelChoice();
  if (!st || st.duel.phase !== 'finisher') throw new Error('no hay remate (fase ' + (st && st.duel.phase) + ')');
  await R.chooseByText('[Usar objeto]');
  await G(id => __game.chooseItem(id), id);
}
async function nueva(flags = {}) {
  await G(() => __game.newGame()); await idle();
  await setFlags({ intro_vista: true, torno_abierto: true, inigo_presentado: true, ...flags });
}

try {
  await page.goto(base);
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) { /* */ } });
  await page.reload();
  await page.waitForFunction(() => !!window.__game);
  await G(() => __game.skipText(true));
  await R.startDismisser();

  // ================================================================ VENDING
  step('Vending · Gertrudis (§5.2) y la cafetera viral (§4.1) · paso 14');
  await nueva();
  await goto('office');
  ok((await state()).room === 'office', 'se entra en el Vending (id office)');
  await clearLog();
  await verb('hablar', 'gertrudis');
  let o = await opts();
  ok(JSON.stringify(o) === JSON.stringify(['Buenas noches, Gertrudis.', '¿Me da un café sin saludar?', 'Nada. Gracias, Gertrudis.']), 'G0 antes de saludar: saludo, café sin saludar, despedida');
  await choose('¿Me da un café sin saludar?');
  ok(await logHas('E-31: SIN SALUDO NO HAY CAFÉ') && !(await has('cafe')), '«¿Me da un café sin saludar?» → E-31, sin café');
  await shotDuring('cafetera-saludo', () => chooseNoWait('Buenas noches, Gertrudis.'), [2500, 9000]);
  await R.check({ tiene: ['cafe'], flags: { gertrudis_saludada: true, cafetera_viral: true, rep_03: true, chisme_indice: 1 } });
  ok(await logHas('AYER NO PUEDO. TE MIRO HUECO PARA ANTEAYER'), '1.er saludo: café, cafetera_viral, rep_03 con la réplica NUEVA de R03');
  o = await opts();
  ok(o && o.includes('Buenas noches otra vez.') && !o.includes('¿Me da un café sin saludar?'), 'aparece «Buenas noches otra vez.» (sin cerrar el diálogo)');
  await shotDuring('cafetera-en-directo', () => chooseNoWait('Buenas noches otra vez.'), [4300, 6000, 10500]);
  await R.check({ flags: { cafetera_en_directo: true, rep_04: true, rep_10: true, rep_14: true, chisme_indice: 4 } });
  ok(await logHas('POR ESO ME ESCRIBES A MÍ') && await logHas('¿TE VA EN MARZO? ES CUANDO ACABAN LAS RÁPIDAS') && await logHas('EN TABLA DINÁMICA'),
    'el bis: R04, R10 y R14 con las réplicas nuevas');
  ok(await logHas('VIRAL:') && await logHas('Récord personal de taquigrafía'), 'ráfaga viral y remate de Bruno');
  ok(!(await flag('office_emision')), 'el piloto EN DIRECTO se apaga al acabar');
  o = await opts();
  ok(o && !o.includes('Buenas noches otra vez.'), 'tras el bis desaparece «otra vez»');
  await choose('Gracias, Gertrudis.');
  ok(await logHas('E-00: DE NADA') && !(await state()).dialog, '«Nada. Gracias, Gertrudis.» cierra con E-00');
  await clearLog();
  await verb('hablar', 'gertrudis'); await choose('Buenas noches, Gertrudis.');
  ok(await logHas('ESTOY AGOTADA') && await logHas('CELESTINO. EXTENSIÓN 0.'), '3.er saludo: «agotada», representante Celestino');
  await choose('Buenas noches, Gertrudis.');
  ok(await logHas('CHISME: EL MICROONDAS'), 'después: chismes de relleno');
  await choose('Gracias, Gertrudis.');
  await take('cafe');
  await verb('hablar', 'gertrudis'); await choose('Buenas noches, Gertrudis.'); await choose('Gracias, Gertrudis.');
  ok(await has('cafe'), 'seguro anticallejón: sin café y sin Acto II, otro café');
  await take('cafe'); await setFlags({ acto_2_iniciado: true }); await clearLog();
  await verb('hablar', 'gertrudis'); await choose('Buenas noches, Gertrudis.'); await choose('Gracias, Gertrudis.');
  ok(!(await has('cafe')) && await logHas('YA TE DI UNO. NO SOY UNA FUENTE'), 'fuera el segundo café inútil: «YA TE DI UNO...»');
  await verb('mirar', 'tablon');
  ok(await flag('rep_01') === true, 'paso 15: Mirar tablón → rep_01');

  step('Vending · el público se va (cms_vivo) · el fugitivo de Mercados y su táper (§4.4)');
  await setFlags({ cms_vivo: true, reunion_terminada: true });
  await clearLog();
  await goto('pecera'); await goto('office');
  ok(await logHas('E-53: SE HA IDO EL PÚBLICO') && await logHas('ERES EL ÚNICO'), 'primera entrada con cms_vivo: Gertrudis sin público');
  ok(await visible('mercados_1') === 'office', 'con reunion_terminada, uno de Mercados en la cola del microondas');
  if (SHOTS) { await G(() => __game.skipText(false)); await page.waitForTimeout(300); await page.screenshot({ path: path.join(here, 'shots', 'comedia-p3-mercados-cola.png') }); await G(() => __game.skipText(true)); }
  await clearLog();
  await verb('hablar', 'mercados_1');
  ok(await logHas('Aquí la cola tiene orden'), 'Mercados 1: «Chsss...»');
  await choose('¿Qué tal la reunión?');
  ok(await logHas('No me la nombres'), '«¿Qué tal la reunión?»');
  await shotDuring('mercados-huida', () => chooseNoWait('¿Y cuáles son los siguientes pasos?'), 2200);
  ok(await flag('mercados_huido') === true && await logHas('¡ESTO ES EL VENDING!'), '«siguientes pasos» → huye (mercados_huido)');
  ok(await visible('mercados_1') !== 'office', 'el de Mercados ya no está');
  ok(await G(() => __game.state().objects['office.taper_suelo'] ? __game.state().objects['office.taper_suelo'].visible !== false : true), 'el táper está en el suelo');
  if (SHOTS) { await G(() => __game.skipText(false)); await page.waitForTimeout(300); await page.screenshot({ path: path.join(here, 'shots', 'comedia-p3-taper-suelo.png') }); await G(() => __game.skipText(true)); }
  await verb('coger', 'taper_suelo');
  ok(await has('taper_huerfano') && await logHas('Este, ahora, es mío'), 'Coger el táper → taper_huerfano');
  await goto('pecera'); await goto('office');
  ok(await visible('mercados_1') !== 'office', 'el de Mercados no vuelve');

  step('Vending · Gervasio solo tras D3 (§5.10): gag con Gertrudis; el duelo D3 ya no vive aquí');
  ok(await visible('gervasio_acta') !== 'office', 'sin sala_abierta, Gervasio no está en el Vending (ni en el Acto III)');
  ok(!/duels:\s*\{[^}]*gervasio/.test(fs.readFileSync(path.join(here, '..', 'content', 'rooms', 'office.js'), 'utf8')), 'office.js no define el duelo D3');
  await setFlags({ acto_3_iniciado: true, sala_abierta: true, duelo_gervasio_ganado: true });
  await clearLog();
  await goto('pecera');
  await shotDuring('gervasio-gertrudis', () => goto('office'), [2600, 5200]);
  ok(await visible('gervasio_acta') === 'office' && await logHas('E-54: ¿Y TÚ QUIÉN ERES?') && await logHas('Y no consto'), 'tras D3: Gervasio ante Gertrudis, «¿Y TÚ QUIÉN ERES?»');
  await clearLog();
  await verb('hablar', 'gervasio_acta');
  ok(await logHas('Diecinueve años esperando cosas') && !(await state()).duel, 'hablar con Gervasio: línea, sin duelo');

  // ================================================================ REDACCIÓN DE PAPEL
  step('Redacción de papel · Aurora sin café (§5.3), Teodoro sin papel (teodoro_intentos_n)');
  await nueva({ gertrudis_saludada: true, chisme_indice: 4 });
  await give('cafe');
  await goto('catacumba');
  await clearLog();
  await verb('hablar', 'aurora_galerada');
  o = await opts();
  ok(o && o.length === 4 && o.includes('Puedo hablar yo por los dos, si quiere.'), 'A_SIN_CAFE: cuatro opciones (con la NO)');
  await choose('Buenas noches, Aurora.');
  ok(await logHas('No hablo antes del café'), 'el golpecito lleva texto de Bruno');
  await clearLog();
  await verb('coger', 'bolis_aurora');
  ok(await logHas('¡Au! Me ha corregido la mano. En rojo.') && !(await has('boli_muerto')), 'Coger bolis antes del café: «¡Au!» (con texto)');
  await clearLog();
  await verb('mirar', 'libro_estilo');
  ok(!(await logHas('Novecientas')) && await logHas('Libro de Estilo'), 'Libro de Estilo sin «Novecientas páginas»');
  await verb('hablar', 'teodoro_cuerpodoce');
  await verb('dar', 'teodoro_cuerpodoce', 'tarjeta_becario');
  await verb('coger', 'tipometro');
  await verb('hablar', 'teodoro_cuerpodoce');
  ok(await flag('teodoro_intentos_n') === 3, 'cuatro intentos sin papel → teodoro_intentos_n = 3 (tope)');

  step('Pasos 16-18 · el café de Aurora, rep_02, rep_06');
  await clearLog();
  await R.run(['dar', 'cafe', 'aurora_galerada']); await R.run(['cerrar']); await idle();
  await R.check({ tiene: ['ficha_pagina_7'], flags: ['aurora_conto_pasos', 'aurora_hablo_fax', 'acto_2_iniciado'], notiene: ['cafe'] });
  ok(await logHas('siguientes pasos') && await logHas('ACTO II: HUECO, FUENTE, FIRMA'), 'paso 16: ficha, aurora_hablo_fax (ahora en A_CAFE), Acto II');
  await R.run(['verbo', 'hablar', 'aurora_galerada']); await R.run(['opcion', '¿Por qué no se hablan usted y Teodoro?']); await R.run(['cerrar']); await idle();
  ok(await flag('rep_02') === true && await flag('rumor_teodoro_n') === 1, 'paso 17: rep_02 (+ rumor C1)');
  await R.run(['verbo', 'mirar', 'fax_enmarcado']);
  ok(await flag('rep_06') === true, 'paso 18: Mirar fax_enmarcado → rep_06');
  await clearLog();
  await verb('hablar', 'aurora_galerada'); await choose('¿Usted ha cometido alguna errata?');
  ok(await logHas('Una. En 1989.'), 'Aurora [4·desc]: la errata de 1989');
  await choose('En la web eso lo arregla el corrector automático.');
  ok(await logHas('para sufrir con método'), 'Aurora [6·NO]: el corrector automático');
  await choose('Nada, Aurora. Gracias.');

  step('Paso 28 · golpe A: el fax vomita la tarde (§4.5)');
  await give('copias_rechazadas', 'fotocopia_nota_direccion');
  await clearLog();
  await shotDuring('fax-vomita', () => G(() => __game.doVerb('usar', 'fax', 'copias_rechazadas')), [3400, 7000]);
  await R.check({ flags: ['fax_con_papel'], tiene: ['mensaje_fp'], notiene: ['copias_rechazadas'] });
  ok(await logHas('18:01. RESPUESTA A AURORA') && await logHas('18:42.') && await logHas('18:55.') && await logHas('19:10. RESPUESTA A TODO LO DEMÁS') && await logHas('19:12. GOYITA'),
    'con tres intentos: las cuatro respuestas atrasadas + la Goyita');
  ok(await logHas('nadie le había dado papel') && await logHas('MÍO, TODO LO DEMÁS'), 'Aurora y el «ESE NO ES MÍO» de F.P.');
  ok((await G(() => __game.state().objects['catacumba.fax'])).state === 'con_papel', 'el fax queda con_papel');
  await R.run(['verbo', 'mirar', 'mensaje_fp']);
  ok(await flag('vio_borde_perforado') === true, 'paso 29: borde perforado');
  await clearLog();
  await verb('mirar', 'fax');
  ok(await logHas('1 GOYITA, 2 ADMINISTRACIÓN, 3 CONTROLLING'), 'Mirar fax con papel: las tres teclas');

  step('Paso 30 · dos fuentes: la fotocopia VUELVE a Bruno');
  await R.run(['dar', 'fotocopia_nota_direccion', 'aurora_galerada']); await R.run(['cerrar']); await idle();
  await R.check({ flags: ['casilla_fuente'], notiene: ['mensaje_fp'], tiene: ['fotocopia_nota_direccion'] });
  ok(await logHas('las fuentes no se quedan, se citan'), 'paso 30: casilla_fuente, −mensaje_fp, la fotocopia se queda');
  await verb('hablar', 'aurora_galerada');
  o = await opts();
  ok(o && !o.includes('Tengo una fuente.') && !o.includes('Tengo dos fuentes.'), 'tras citar, no vuelve «Tengo una fuente»');
  await choose('Nada, Aurora. Gracias.');

  step('Paso 31 · D2 (Teodoro): derrota con «VUELVE» (§7.7) y victoria con el manual');
  await give('manual_fax');
  await setFlags({ rep_03: true, rep_09: true });
  await clearLog();
  await verb('hablar', 'teodoro_cuerpodoce'); await R.chooseByText('Quiero firmar en tu página 7.');
  await duelWeak(3); await idle();
  ok(await flag('duel:teodoro:perdido_n') === 1 && !(await flag('duelo_teodoro_ganado')), 'tres flojas: derrota (perdido_n = 1)');
  ok(await logHas('SIN PAPEL PARA USTED') && await logHas('cuerpo 72') && await logHas('Seis folios para una palabra'), 'derrota: línea, «VUELVE» y Aurora');
  ok(await logHas('¿EL DE LA WEB? ¿EN MI PÁGINA? CONTESTA.'), 'entrada nueva de D2');
  await clearLog();
  await R.run(['verbo', 'hablar', 'teodoro_cuerpodoce']); await R.run(['opcion', 'Quiero firmar en tu página 7.']);
  await R.run(['duelo', ['R06', 'R02', 'R03', { objeto: 'manual_fax' }]]); await R.run(['cerrar']); await idle();
  await R.check({ flags: ['duelo_teodoro_ganado', 'casilla_firma'] });
  ok(await logHas('ESTOY FUERA DE LA OFICINA'), 'paso 31: D2 ganado con el remate del manual, casilla_firma');

  step('Paso 33 · golpe B: la pieza viaja por fax (teclas 1, 3 y 2) y la factura');
  await setFlags({ casilla_hueco: true, pieza_escrita: true });
  await give('pieza_opa');
  await clearLog();
  await verb('dar', 'teodoro_cuerpodoce', 'pieza_opa');
  ok(await logHas('ME SOBRAN OCHO. NO RECORTO: YO SOLO MIDO.'), 'Dar pieza a Teodoro: «ME SOBRAN OCHO» por fax');
  await G(() => __game.doVerb('usar', 'fax', 'pieza_opa'));
  for (let k = 0; k < 50 && !(await opts()); k++) await page.waitForTimeout(20);
  ok(JSON.stringify(await opts()) === JSON.stringify(['1: GOYITA', '2: ADMINISTRACIÓN', '3: CONTROLLING', 'Mejor no.']), 'menú de las tres teclas');
  await choose('1: GOYITA');
  ok(await flag('fax_tecla_n') === 1 && await logHas('LA GOYITA NO TIRA BORRADORES'), 'tecla 1: la Goyita ofende a Teodoro (fax_tecla_n = 1)');
  await verb('usar', 'fax', 'pieza_opa'); await choose('1: GOYITA');
  ok(await logHas('TE MIDO LA MANO') && await flag('fax_tecla_n') === 1, 'tecla 1 otra vez: «TE MIDO LA MANO»');
  await clearLog();
  await verb('usar', 'fax', 'pieza_opa'); await choose('3: CONTROLLING');
  ok(await flag('fax_tecla_n') === 2 && await logHas('No recorto: yo solo leo') && await logHas('recorte sin leer'), 'tecla 3: Evaristo llama; «alguien que recorte sin leer»');
  ok(!(await flag('pieza_recortada')), 'sin pieza_recortada tras 1 y 3 (XM5)');
  await verb('usar', 'fax', 'pieza_opa'); await choose('Mejor no.');
  ok(await logHas('Un fax mal marcado no se borra'), '«Mejor no.»');
  await clearLog();
  await shotDuring('fax-begona', async () => { await R.run(['usar', 'pieza_opa', 'fax']); await chooseNoWait('2: ADMINISTRACIÓN'); }, [3600, 7800, 16000]);
  await R.check({ flags: ['pieza_recortada', 'catacumba_factura'], tiene: ['pieza_opa'] });
  ok(await logHas('BEGOÑA (fax): ADMINISTRACIÓN. RECIBIDO A LAS 19:07') && await logHas('CABE, CABE Y CABE') && await logHas('0,26 euros') && await logHas('acaba en un juzgado'),
    'paso 33: Begoña recorta por fax, triplicado, cuarta hoja con la factura');
  ok(await G(() => __game.state().objects['catacumba.factura_fax'] ? __game.state().objects['catacumba.factura_fax'].visible !== false : true), 'la factura queda grapada en la pared');
  if (SHOTS) { await G(() => __game.skipText(false)); await page.waitForTimeout(300); await page.screenshot({ path: path.join(here, 'shots', 'comedia-p3-factura.png') }); await G(() => __game.skipText(true)); }
  await clearLog();
  await verb('usar', 'fax', 'pieza_opa');
  ok(await logHas('me la facturan dos veces'), 'la pieza recortada no se vuelve a enviar');

  step('Paso 34 · Dar ficha a Teodoro → 7.3a');
  await R.run(['dar', 'ficha_pagina_7', 'teodoro_cuerpodoce']); await R.run(['cerrar']); await idle();
  await R.check({ flags: ['pagina_cerrada', 'acto_3_iniciado'], notiene: ['ficha_pagina_7', 'pieza_opa'] });
  ok(true, 'paso 34: pagina_cerrada, acto_3_iniciado');

  // ================================================================ ADMINISTRACIÓN
  step('Administración · Begoña (§5.8): recorte en directo y paso 27');
  await nueva({ acto_2_iniciado: true });
  await give('sobre_azucar');
  await goto('administracion');
  await clearLog();
  await verb('hablar', 'begona_triplicado');
  ok(await logHas('Te quedan ocho minutos'), 'onStart: las 19:07');
  await choose('Begoña, con todo el respeto, yo solo venía a preguntarle si...');
  ok(await logHas('¿Me ha recortado una pregunta?') && await logHas('No lo sabremos nunca'), '[3·desc]: el recorte del 26 % en directo');
  await choose('Vengo a ver la pared. Dicen que es un museo de facturas.');
  ok(await logHas('el ministro pagó') && !(await logHas('Dirección')), '[4·abs]: la pared, sin «Dirección»');
  await choose('Nada. Me iba.');
  await clearLog();
  await R.run(['verbo', 'hablar', 'begona_triplicado']);
  for (const t of ['Quiero presentar una nota de gasto.', 'Café para entender el capitalismo.', 'Lo que sea.',
    'Aquí tiene. Un sobre de azúcar. Es casi un ticket.', 'Pues enséñeme cómo es una nota bien hecha']) await R.run(['opcion', t]);
  await R.run(['cerrar']); await idle();
  await R.check({ tiene: ['fotocopia_nota_direccion', 'copias_rechazadas'], flags: ['nota_gasto_presentada'], notiene: ['sobre_azucar'] });
  ok(await logHas('En número no cabe'), 'paso 27 (las cinco opciones WT): fotocopia, copias, nota_gasto_presentada, −azúcar');
  await clearLog();
  await verb('hablar', 'begona_triplicado'); await choose('¿Usted ha sido feliz alguna vez?');
  ok(await logHas('Hay uno de 1987.'), '[5·NO]: el F-1 de Felicidad');
  await choose('Nada. Me iba.');
  await clearLog();
  await verb('mirar', 'cartel_recorte');
  ok(await logHas('Firmado: Administración') && !(await logHas('Dirección')), 'el cartel del recorte lo firma Administración');

  step('Administración · camino antiguo del recorte, la pared con la factura y Evaristo (§5.13, §6.4)');
  await give('pieza_opa');
  await clearLog();
  await verb('dar', 'begona_triplicado', 'pieza_opa');
  ok(await flag('pieza_recortada') === true && await logHas('Recortado.') && await logHas('Ni un céntimo menos'), 'Dar la pieza a Begoña en persona sigue valiendo');
  await setFlags({ catacumba_factura: true });
  await clearLog();
  await verb('mirar', 'pared_rechazadas');
  ok(await logHas('Fax de la Redacción de papel, 0,26 €. Motivo: lo pagó Teodoro'), 'pared: entrada nueva con la factura del fax');
  await clearLog();
  await verb('mirar', 'administracion_a_ecosistema');
  ok(await logHas('de vuelta a Marketing'), 'pasillo: «Marketing», sin apodo');
  await setFlags({ evaristo_convoco: true, bruno_sellado_frente: true });
  await clearLog();
  await verb('hablar', 'evaristo_salvedad');
  ok(await logHas('Bien centrado. Begoña tiene pulso.'), 'Evaristo y la frente sellada (§6.4)');
  await choose('¿Para qué me ha llamado?'); await choose('¿Falta mucho?');
  ok(await logHas('Le he mirado el reloj y se ha dado cuenta.'), 'Evaristo vuelve a su mesa (línea nueva, §6.4)');
  await setFlags({ coma_bendecida: true });
  await verb('hablar', 'evaristo_salvedad'); await choose('Aurora dice que su coma está bien.');
  ok(await flag('correo_evaristo_listo') === true && await logHas('Esto sí lo digo sin adjunto') && !(await logHas('Como debe ser')), 'E_ENVIO (camino antiguo): correo listo, sin «Como…»');
} catch (e) {
  failedN++;
  console.log('  ✗ EXCEPCIÓN: ' + (e && e.stack || e));
}

const errs = consoleErrors.filter(e => !/favicon/.test(e));
ok(errs.length === 0, 'sin errores de consola' + (errs.length ? ': ' + errs.slice(0, 5).join(' | ') : ''));
console.log(`\n${passed} OK, ${failedN} fallos`);
await browser.close();
server.close();
process.exit(failedN ? 1 : 0);
