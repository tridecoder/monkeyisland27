#!/usr/bin/env node
// Test del PAQUETE C (office + catacumba): juega su parte de principio a fin vía window.__game, simulando con
// giveItem/setFlag lo que viene de otros paquetes. Comprueba flags, objetos, duelos (ganar, perder, retirarse,
// remate con objeto equivocado y correcto), micro-puzle del boli (adenda MP3), rumores y que no hay errores de consola.
//   node tools/test-paquete-c.mjs            (rápido)
//   node tools/test-paquete-c.mjs --shots    además, capturas de las salas y de los duelos en tools/shots/c-*.png
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from './serve.mjs';
import { createRunner, StepFail } from './walk-lib.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const SHOTS = process.argv.includes('--shots');

const server = createServer(path.resolve(here, '..'));
await new Promise(r => server.listen(0, r));
const base = `http://localhost:${server.address().port}/`;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 960, height: 600 } });
const consoleErrors = [];
page.on('console', m => { if (m.type() === 'error' || /\[(contenido|motor|flags|sala)/.test(m.text())) consoleErrors.push(m.text()); });
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
const choose = (txt) => R.chooseByText(txt);
const close = () => R.closeDialog();
const shot = async (name) => { if (!SHOTS) return; await G(() => __game.skipText(false)); await page.waitForTimeout(350); await page.screenshot({ path: path.join(here, 'shots', `c-${name}.png`) }); await G(() => __game.skipText(true)); };
async function waitDuelChoice() {
  for (let k = 0; k < 200; k++) { const st = await state(); if (!st.duel) return null; if (st.dialog || st.pickItem) return st; await page.waitForTimeout(20); }
  throw new Error('el duelo no pide respuesta');
}
async function duelWeak(n) {         // n respuestas flojas seguidas
  // la floja del asalto (plan §7.5: rota; el comodín, la 1.ª vez, no cuenta como fallo: se repite el asalto)
  for (let i = 0; i < n; i++) { const st = await waitDuelChoice(); if (!st) return; if (st.dialog[st.duel.weakIndex].startsWith('Enviado desde mi')) i--; await G(k => __game.chooseDialog(k), st.duel.weakIndex); }
}
async function duelCorrect(n) {
  for (let i = 0; i < n; i++) { const st = await waitDuelChoice(); if (!st || st.duel.phase !== 'reply') return; await G(k => __game.chooseDialog(k), st.duel.correctIndex); }
}
async function finisherObject(id) {
  const st = await waitDuelChoice();
  if (!st || st.duel.phase !== 'finisher') throw new StepFail('no hay remate (fase ' + (st && st.duel.phase) + ')');
  await R.chooseByText('[Usar objeto]');
  await G(id => __game.chooseItem(id), id);
}

try {
  await page.goto(base);
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) { /* */ } });
  await page.reload();
  await page.waitForFunction(() => !!window.__game);
  await G(() => __game.skipText(true));
  await R.startDismisser();
  await G(() => __game.newGame());
  await idle();
  // lo que viene del paquete A (torno) y el estado inicial: sin escenas de otros paquetes
  await setFlags({ intro_vista: true, torno_abierto: true, inigo_presentado: true });
  await G(() => __game.gotoRoom('office')); await idle();
  ok((await state()).room === 'office', 'se entra en el Vending (id office)');
  await shot('office');

  // ------------------------------------------------------------ P02 · Gertrudis: errores y buenas noches
  step('P02 · Gertrudis: «Un café, por favor» (errores G2) y «Buenas noches» (café + chisme)');
  await clearLog();
  for (let i = 0; i < 4; i++) { await verb('hablar', 'gertrudis'); await choose('Un café, por favor.'); await idle(); }
  ok(await flag('gertrudis_error_indice') === 4, 'gertrudis_error_indice = 4 tras cuatro peticiones');
  ok(await logHas('E-47: LLAMAR A SISTEMAS.') && await logHas('E-48: SISTEMAS NO CONTESTA.') && await logHas('E-49: YA SÉ QUE ERES TÚ OTRA VEZ.') && await logHas('E-50: ESTOY EN UNA REUNIÓN.'), 'errores E-47 → E-50 en orden');
  ok(!(await has('cafe')) && !(await flag('gertrudis_saludada')), 'sin saludar no hay café');
  await verb('hablar', 'gertrudis'); await choose('Un café, por favor.'); await idle();
  ok(await logHas('E-50: ESTOY EN UNA REUNIÓN.') && !(await logHas('E-51')), 'Acto I: a partir de 4 sigue en E-50');
  // rumor A, paso 2 (simulado: Celestino ya contó el paso 1)
  await setFlags({ rumor_firma_n: 1 });
  await clearLog();
  await R.run(['verbo', 'hablar', 'gertrudis']); await R.run(['opcion', 'Buenas noches, Gertrudis.']); await R.run(['cerrar']); await idle();
  await R.check({ tiene: ['cafe'], flags: { gertrudis_saludada: true, rep_03: true, chisme_indice: 1, rumor_firma_n: 2 } });
  ok(true, 'paso 14: café, gertrudis_saludada, rep_03, chisme_indice=1 (+ rumor A2 → rumor_firma_n=2)');
  ok(await logHas('NADIE ME SALUDABA DESDE 2019.') && await logHas('RUMOR: EL BECARIO VA A FIRMAR EL CIERRE DEL PAPEL.'), 'LCD del primer saludo y rumor A2');
  await R.run(['verbo', 'mirar', 'tablon']); await idle();
  ok(await flag('rep_01') === true, 'paso 15: Mirar tablón → rep_01');
  await clearLog();
  await verb('hablar', 'gertrudis'); await choose('Nada, solo miraba.'); await idle();
  ok(await logHas('ESO DICEN TODOS.'), '«Nada, solo miraba.» → «ESO DICEN TODOS.»');

  // ------------------------------------------------------------ Catacumba, Acto I: Aurora sin café, Teodoro sin papel
  step('Catacumba antes del café (P03 precondición) y Teodoro sin papel');
  await R.run(['ir', 'catacumba']); await idle();
  ok((await state()).room === 'catacumba', 'Vending → Redacción → Redacción de papel');
  await shot('catacumba');
  await verb('hablar', 'aurora_galerada');
  ok(JSON.stringify(await opts()) === JSON.stringify(['Buenas noches, Aurora.', '¿Usted es la correctora?', 'Nada, ya me voy.']), 'A_SIN_CAFE: tres opciones');
  await choose('Buenas noches, Aurora.'); await idle();
  ok(!(await flag('acto_2_iniciado')) && !(await has('ficha_pagina_7')), 'hablar sin café no da nada');
  await clearLog();
  await verb('hablar', 'teodoro_cuerpodoce');
  ok(!(await flag('aurora_hablo_fax')) && await logHas('Aurora señala su cartel'), 'Teodoro sin papel en el Acto I: pita; Aurora no habla antes del café');
  await verb('coger', 'bolis_aurora');
  ok(!(await has('boli_muerto')), 'Coger bolis antes del Acto II: golpecito, no da nada');

  // ------------------------------------------------------------ P03 · el café de Aurora
  step('P03 · Dar café a Aurora (paso 16), réplicas de Aurora y del fax enmarcado (17-19)');
  await clearLog();
  await R.run(['dar', 'cafe', 'aurora_galerada']); await R.run(['cerrar']); await idle();
  await R.check({ tiene: ['ficha_pagina_7'], flags: ['aurora_conto_pasos', 'acto_2_iniciado'], notiene: ['cafe'] });
  ok(await logHas('ACTO II: HUECO, FUENTE, FIRMA'), 'paso 16: ficha, aurora_conto_pasos, acto_2_iniciado, −café, rótulo del Acto II');
  await R.run(['verbo', 'hablar', 'aurora_galerada']); await R.run(['opcion', '¿Por qué no se hablan usted y Teodoro?']); await R.run(['cerrar']); await idle();
  ok(await flag('rep_02') === true && await flag('rumor_teodoro_n') === 1, 'paso 17: rep_02 (+ rumor C1 → rumor_teodoro_n=1)');
  await R.run(['verbo', 'hablar', 'aurora_galerada']); await R.run(['opcion', '¿Cómo convenzo a Teodoro?']); await R.run(['cerrar']); await idle();
  ok(await flag('aurora_hablo_fax') === true && await flag('rumor_teodoro_n') === 1, 'paso 18: aurora_hablo_fax (el rumor no se repite)');
  await R.run(['verbo', 'mirar', 'fax_enmarcado']); await idle();
  ok(await flag('rep_06') === true, 'paso 19: Mirar fax_enmarcado → rep_06');

  // ------------------------------------------------------------ paso 20: tres saludos más
  step('Paso 20 · Gertrudis ×3 (rep_04, rep_10, rep_14) y chismes de relleno; E-51/E-52 en el Acto II');
  await R.run(['ir', 'office']); await idle();
  for (let i = 0; i < 3; i++) { await R.run(['verbo', 'hablar', 'gertrudis']); await R.run(['opcion', 'Buenas noches, Gertrudis.']); await R.run(['cerrar']); }
  await idle();
  await R.check({ flags: { rep_04: true, rep_10: true, rep_14: true, chisme_indice: 4 }, tiene: ['cafe'] });
  ok(true, 'paso 20: rep_04, rep_10, rep_14, chisme_indice=4, café');
  await clearLog();
  await verb('hablar', 'gertrudis'); await choose('Buenas noches, Gertrudis.'); await idle();
  ok(await logHas('CHISME: EL MICROONDAS Y YO NO NOS HABLAMOS. ÉL SABE POR QUÉ.') && await logHas('BUENAS NOCHES, VACANTE.'), 'chisme de relleno nº 5');
  await clearLog();
  await verb('hablar', 'gertrudis'); await choose('Un café, por favor.'); await idle();
  await verb('hablar', 'gertrudis'); await choose('Un café, por favor.'); await idle();
  ok(await logHas('E-51: ESTAMOS ANALIZANDO TODAS LAS OPCIONES.') && await logHas('E-52: ESE CAFÉ ESTÁ SACADO DE CONTEXTO.') && await logHas('gabinete de prensa'), 'Acto II: E-51 (con la línea de Bruno) y E-52');

  // ------------------------------------------------------------ MP3 · Custodia, el boli muerto
  step('Adenda MP3 · Custodia Precinto y el boli muerto (Secretaría de Redacción, en la Redacción: orden 3)');
  await R.run(['ir', 'pecera']); await idle();
  await clearLog();
  await verb('hablar', 'custodia_precinto');
  ok(await logHas('¿Qué quiere.'), 'CU0: «¿Qué quiere.» la primera vez');
  await choose('¿Me deja un boli?'); await choose('Para escribir.'); await idle();
  ok(!(await flag('custodia_regla')), 'CU_PARAQUE: «Para escribir.» no da la regla');
  await give('boli_muerto');                      // simulación: un muerto antes de saber la regla
  await clearLog();
  await verb('dar', 'custodia_precinto', 'boli_muerto');
  ok(await logHas('Un muerto sin que se lo pida. Qué raro. Siguiente.') && await has('boli_muerto'), 'sin la regla: el muerto no se gasta');
  await take('boli_muerto');
  await clearLog();
  await R.run(['verbo', 'hablar', 'custodia_precinto']); await R.run(['opcion', '¿Me deja un boli?']); await R.run(['opcion', '¿Y cómo se consigue un boli aquí?']); await R.run(['cerrar']); await idle();
  ok(await flag('custodia_regla') === true && await logHas('Otra vez usted. ¿Qué quiere.'), 'X6: custodia_regla');
  await verb('mirar', 'timbre_secretaria'); await verb('usar', 'timbre_secretaria'); await verb('usar', 'timbre_secretaria');
  ok(await logHas('Estoy delante.') && await logHas('le apunto en el libro'), 'timbre: 1.ª y 2.ª vez');
  await R.run(['ir', 'catacumba']); await idle();
  await R.run(['verbo', 'coger', 'bolis_aurora']); await idle();
  await R.check({ tiene: ['boli_muerto'], flags: ['boli_muerto_cogido'] });
  ok(true, 'X20: Coger bolis_aurora → boli_muerto, boli_muerto_cogido');
  await clearLog();
  await verb('coger', 'bolis_aurora');
  ok(await logHas('Los demás están vivos. Y son míos.'), 'el muerto no se da dos veces');
  await R.run(['ir', 'pecera']); await idle();
  await verb('dar', 'custodia_precinto', 'boli_muerto');
  await choose('Para mi abuela.'); await idle();
  let o = await opts();
  ok(o && !o.includes('Para mi abuela.') && o.includes('Para apuntar lo que me digan. Sin grabadora.'), 'CU_CADAVER_2: desaparece la razón que ha fallado');
  await choose('Para lo que surja.'); await choose('Para firmar en papel.'); await idle();
  o = await opts();
  ok(o && o.length === 1, 'tras tres fallos solo queda la buena');
  ok(await has('boli_muerto'), 'el muerto no se gasta hasta CU_DA');
  await choose('Para apuntar lo que me digan. Sin grabadora.'); await idle(); await close();
  ok(await flag('custodia_ablandada') === true && !(await has('boli_muerto')) && await logHas('Ya ha firmado. Ya lo ha usado. Devuélvamelo.'), 'X23 (MP3): custodia_ablandada, −boli_muerto');
  await verb('hablar', 'custodia_precinto'); await choose('¿Dónde está...?');
  ok((await opts()).includes('¿Dónde está la bandeja 2 de la impresora de la tercera?'), 'CU_DONDE disponible tras ablandarla');
  await choose('Ya está.'); await idle(); await close();

  // ------------------------------------------------------------ P09 / P10a · fax con papel y dos fuentes
  step('P09 · el fax sin papel · P10a · dos fuentes (pasos 31-33)');
  await R.run(['ir', 'catacumba']); await idle();
  await clearLog();
  await verb('usar', 'fax', 'ficha_pagina_7');
  ok(await logHas('La ficha no se faxea. Se sella.'), 'Usar ficha con fax: línea propia');
  await verb('dar', 'teodoro_cuerpodoce', 'ficha_pagina_7');
  ok(!(await flag('casilla_firma')) && await logHas('Sin papel, Teodoro es un mimo.'), 'Dar ficha sin papel: Teodoro no puede contestar');
  await clearLog();
  await verb('hablar', 'teodoro_cuerpodoce');
  ok(await logHas('Sin papel no habla. Lleva así desde las seis.'), 'Hablar a Teodoro sin papel en el Acto II: Aurora lo explica');
  // de D (Begoña, P08)
  await give('copias_rechazadas', 'fotocopia_nota_direccion');
  await R.run(['usar', 'copias_rechazadas', 'fax']); await idle();
  await R.check({ flags: ['fax_con_papel'], tiene: ['mensaje_fp'], notiene: ['copias_rechazadas'] });
  ok((await G(() => __game.state().objects['catacumba.fax'])).state === 'con_papel', 'paso 31: fax_con_papel, mensaje_fp, −copias (estado del fax: con_papel)');
  await take('mensaje_fp');
  await clearLog();
  await verb('dar', 'aurora_galerada', 'fotocopia_nota_direccion');
  ok(!(await flag('casilla_fuente')) && await logHas('Con una fuente se hace un rumor.'), 'con una sola fuente: rumor, no sella');
  await give('mensaje_fp');
  await R.run(['dar', 'fotocopia_nota_direccion', 'aurora_galerada']); await R.run(['cerrar']); await idle();
  await R.check({ flags: ['casilla_fuente'], notiene: ['fotocopia_nota_direccion', 'mensaje_fp'] });
  ok(true, 'paso 33: casilla_fuente; −fotocopia, −mensaje_fp');

  // ------------------------------------------------------------ D2 · Teodoro por fax
  step('D2 · Teodoro (por fax): perder, retirarse, objeto equivocado y remate con manual_fax');
  // de B (pieza) y A (manual): se simulan
  await setFlags({ pieza_escrita: true, rumor_teodoro_n: 3 });
  await give('pieza_opa');
  await clearLog();
  await R.run(['verbo', 'hablar', 'teodoro_cuerpodoce']); await idle();
  ok(await logHas('NO ESTOY EMPADRONADO.') && await logHas('ESTOY MAQUETADO.'), 'desmentido del rumor C al empezar T0');
  await R.run(['opcion', 'Quiero firmar en tu página 7.']);
  let st = await waitDuelChoice();
  ok(st && st.duel.id === 'teodoro' && st.duel.attack === 'R06' && /Firma de la web en papel/.test(st.duel.subject) && st.duel.assigned === 'EL DE LA WEB', 'D2 abre: ataque R06, asunto y «Asignado a: EL DE LA WEB»');
  await shot('duelo-teodoro');
  await duelWeak(3); await idle();
  st = await state();
  ok(st.lastDuel && st.lastDuel.result === 'lost' && !st.flags.duelo_teodoro_ganado, 'tres flojas = derrota sin castigo');
  // plan §7.5: cada floja tiene contestación propia de Teodoro (content/duelo.js answers.teodoro)
  ok(await G(() => __game.game.content.duels.weakReplies.some(w => w.answers && w.answers.teodoro && __game.log.some(l => l.text.includes(w.answers.teodoro)))), 'contestación a la floja (la de Teodoro)');
  ok(await logHas('Lo que está cerrado no se abre. Vuelve cuando sepas escribir.'), 'línea de victoria de Teodoro');
  await close().catch(() => {});
  // segundo intento sin manual: remate → objeto equivocado → retirarse
  await clearLog();
  await setFlags({ 'duel:teodoro:empieza': false });                 // (la revancha empezaría por la carta que ganó, plan §7.1.9)
  await verb('hablar', 'teodoro_cuerpodoce'); await choose('Quiero firmar en tu página 7.');
  ok(!(await logHas('NO ESTOY EMPADRONADO.')), 'el desmentido solo sale una vez');
  await duelCorrect(3);
  st = await waitDuelChoice();
  ok(st.duel.phase === 'finisher' && await logHas('Esto está cerrado. Y lo que está cerrado no tiene respuesta.'), 'a 3 puntos: REMATE T');
  await shot('duelo-teodoro-remate');
  await finisherObject('movil'); await waitDuelChoice();
  await finisherObject('ficha_pagina_7'); await waitDuelChoice();
  ok(await logHas('¿Me vas a llamar? Estoy aquí. A dos metros.') && await logHas('La ficha, después. Primero, contéstame.'), 'objetos equivocados: líneas propias (no son fallo)');
  st = await state();
  ok(st.duel && st.duel.misses === 0, 'los objetos equivocados no suman fallos');
  await R.chooseByText('[Retirarse del hilo]'); await idle();
  st = await state();
  ok(st.lastDuel.result === 'retired' && !st.flags.duelo_teodoro_ganado, '[Retirarse del hilo] = derrota sin castigo');
  await close().catch(() => {});
  // tercer intento: el walkthrough (paso 35)
  await give('manual_fax'); await setFlags({ paco_dio_manual: true });
  await R.run(['verbo', 'hablar', 'teodoro_cuerpodoce']); await R.run(['opcion', 'Quiero firmar en tu página 7.']);
  await R.run(['duelo', ['R06', 'R02', 'R03', { objeto: 'manual_fax' }]]); await R.run(['cerrar']); await idle();
  await R.check({ flags: ['duelo_teodoro_ganado', 'casilla_firma'], tiene: ['manual_fax'] });
  ok(await logHas('ESTOY FUERA DE LA OFICINA HASTA QUE EL PAPEL DEJE DE EXISTIR.') && await logHas('Bruno Pellejo. Trece con espacios. Cabe.'), 'paso 35: remate con manual_fax → duelo_teodoro_ganado, casilla_firma (no se gasta el manual)');
  ok(!(await opts()), 'diálogo cerrado');
  await verb('hablar', 'teodoro_cuerpodoce');
  ok(!(await opts()).some(t => t.includes('Quiero firmar')), 'tras ganar, «Quiero firmar...» desaparece');
  await close();

  // ------------------------------------------------------------ P12b · el cierre (7.3a)
  step('P12b · Dar la ficha a Teodoro: qué falta y escena 7.3a (paso 37)');
  await clearLog();
  await verb('dar', 'teodoro_cuerpodoce', 'ficha_pagina_7');
  ok(await logHas('Sin hueco no hay página. Hay un deseo.') && !(await flag('pagina_cerrada')), 'sin casilla_hueco: «Sin hueco no hay página»');
  await setFlags({ casilla_hueco: true });
  await verb('dar', 'teodoro_cuerpodoce', 'ficha_pagina_7');
  ok(await logHas('Me sobran ocho líneas. No recorto: yo solo mido.') && !(await flag('pagina_cerrada')), 'sin pieza_recortada: «Me sobran ocho líneas»');
  await setFlags({ pieza_recortada: true, evaristo_llamadas: 3 });
  await clearLog();
  ok((await G(() => __game.objects().find(o => o.id === 'telefono_rojo').state)) === 'colgado', 'el teléfono rojo está colgado antes de 7.3a');
  // problema D del director: Teodoro habla AL teléfono (descolgado, auricular en la oreja, junto a su mesa)
  await G(() => {
    const g = __game.game; window.__probe = [];
    g.__speakOrig = g.speak.bind(g);
    g.speak = (who, text, opts) => {
      const t = g.actors.teodoro_cuerpodoce;
      window.__probe.push({ who, text, tel: g.getObjState('telefono_rojo', 'catacumba').state, auricular: !!t.auricular, x: Math.round(t.x), y: Math.round(t.y) });
      return g.__speakOrig(who, text, opts);
    };
  });
  await R.run(['dar', 'ficha_pagina_7', 'teodoro_cuerpodoce']); await R.run(['cerrar']); await idle();
  const probe = await G(() => { const g = __game.game; g.speak = g.__speakOrig; delete g.__speakOrig; return window.__probe; });
  const goy = probe.find(p => p.text.startsWith('Goyita. Página 7 cerrada'));
  ok(goy && goy.who === 'teodoro_cuerpodoce' && goy.tel === 'descolgado' && goy.auricular && Math.abs(goy.x - 141) < 24,
    `7.3a: «Goyita...» con el teléfono rojo DESCOLGADO, el auricular en la oreja y Teodoro junto a él (${JSON.stringify(goy)})`);
  const otras = probe.filter(p => p !== goy);
  ok(otras.every(p => p.tel === 'colgado' && !p.auricular), '7.3a: el resto de la escena, el teléfono colgado (descuelga solo para hablar con la Goyita)');
  ok((await G(() => __game.objects().find(o => o.id === 'telefono_rojo').state)) === 'colgado', 'tras 7.3a el teléfono vuelve a estar colgado');
  await R.check({ flags: ['pagina_cerrada', 'acto_3_iniciado'], notiene: ['ficha_pagina_7', 'pieza_opa'] });
  ok(await logHas('Goyita. Página 7 cerrada. Esta noche firma un chaval.') && await logHas('ACTO III: CIERRE') && await logHas('Y la coma de Controlling, en su sitio. Ese hombre lee.'), 'paso 37: escena 7.3a (con el inserto 9.3)');
  const inigo = await G(() => __game.game.actors.inigo_sinergia.room);
  ok(inigo !== 'catacumba', 'Íñigo sale de la Catacumba al acabar la escena');
  await R.run(['verbo', 'hablar', 'aurora_galerada']);
  ok((await opts()).includes('Íñigo dice que en la reunión van a apagar la rotativa.'), 'Aurora, opción del Acto III');
  await close();

  // ------------------------------------------------------------ D3 · Gervasio en el Vending
  step('D3 · Gervasio en el Vending (Acto III): perder y ganar (paso 43)');
  await R.run(['ir', 'office']); await idle();
  st = await state();
  ok(st.actors.gervasio_acta && st.actors.gervasio_acta.room === 'office', 'Gervasio está en el Vending en el Acto III');
  await shot('office-acto3');
  await clearLog();
  await verb('hablar', 'gertrudis'); await choose('Nada, solo miraba.'); await idle();
  ok(await logHas('E-27: AYÚDAME. NO ES UN ERROR.'), 'Gertrudis en el Acto III: E-27');
  await setFlags({ rep_07: true, rep_05: true });
  await verb('hablar', 'gervasio_acta'); await choose('Necesito el acta de la última reunión.');
  st = await waitDuelChoice();
  ok(st.duel.id === 'gervasio' && st.duel.attack === 'R07' && st.duel.assigned === 'Vacante (becario)', 'D3 abre: R07, «Asignado a: Vacante (becario)»');
  await shot('duelo-gervasio');
  await duelCorrect(1); await duelWeak(3); await idle();
  st = await state();
  ok(st.lastDuel.result === 'lost' && !st.flags.duelo_gervasio_ganado && !(st.inventory.includes('acta_reunion')), 'D3 perdido: sin acta, sin castigo');
  ok(await logHas('Asignada a ti. El acta, digo. Tráemela mañana. Lo hablamos.'), 'línea de victoria de Gervasio');
  await close().catch(() => {});
  await R.run(['verbo', 'hablar', 'gervasio_acta']); await R.run(['opcion', 'Necesito el acta de la última reunión.']);
  await R.run(['duelo', ['R07', 'R01', 'R14']]); await R.run(['cerrar']); await idle();
  await R.check({ flags: ['duelo_gervasio_ganado', 'sala_abierta'], tiene: ['acta_reunion'] });
  ok(await logHas('Acuerdos de la última reunión: uno, pedir más café. Dos, ninguno más.'), 'paso 43: duelo_gervasio_ganado, sala_abierta, acta_reunion');
  await clearLog();
  await verb('hablar', 'gervasio_acta');
  ok(!(await opts()) && await logHas('Estoy esperando a que la máquina me salude.'), 'Gervasio tras perder el duelo');
  await R.run(['ir', 'pecera']); await idle();                    // la Secretaría está en la Redacción (orden 3)
  await verb('hablar', 'custodia_precinto'); await choose('¿Dónde está...?'); await choose('¿Dónde está el Titulator?'); await choose('Ya está.'); await idle(); await close();
  ok(await logHas('No me preguntó nadie.'), 'X24: Custodia sabe dónde está el Titulator');

  // ------------------------------------------------------------ hotspots: cada uno responde a Mirar sin el texto por defecto
  step('Hotspots: Mirar propio y verbos con respuesta propia (≥ 3 por hotspot)');
  const src = fs.readFileSync(path.join(here, '..', 'content', 'game.js'), 'utf8');
  const lit = src.slice(src.indexOf('const DEFAULTS = {') + 'const DEFAULTS = '.length, src.indexOf('};', src.indexOf('const DEFAULTS = {')) + 1);
  const DEF = new Function('return ' + lit)();
  const defaultLines = new Set(Object.values(DEF).flat());
  defaultLines.add('¿Estás probando todo con todo? Así trabajan en Administración. Y no funciona.');
  const VERBS = ['mirar', 'coger', 'usar', 'abrir', 'cerrar', 'empujar', 'tirar', 'hablar'];
  const EXITS = ['office_a_pecera', 'catacumba_a_pecera'];
  for (const [room, ids] of [['office', ['office_a_pecera', 'nevera', 'maquina_vending', 'microondas', 'tablon', 'hoja_firmas', 'cartel_cortado', 'fregadero', 'porra_plazas', 'gertrudis', 'gervasio_acta']],
    ['pecera', ['custodia_precinto', 'cartel_material', 'timbre_secretaria']],
    ['catacumba', ['catacumba_a_pecera', 'galeradas', 'camastro', 'fax', 'telefono_rojo', 'tipometro', 'reloj_2147', 'fotos_jefes_cierre', 'fax_enmarcado', 'cartel_aurora', 'libro_estilo', 'bolis_aurora', 'corrector_aurora', 'teodoro_cuerpodoce', 'aurora_galerada']]]) {
    const bad = [], few = [];
    for (const id of ids) {
      let own = 0, mirarOwn = false;
      for (const v of VERBS) {
        if (EXITS.includes(id) && ['abrir', 'usar', 'empujar'].includes(v)) continue;     // salen de la sala
        if (v === 'hablar' && ['custodia_precinto', 'gertrudis', 'gervasio_acta', 'teodoro_cuerpodoce', 'aurora_galerada'].includes(id)) { own++; continue; }
        await G(r => { if (__game.state().room !== r) return __game.gotoRoom(r); }, room); await idle();
        await clearLog();
        await verb(v, id);
        if ((await state()).dialog) await close().catch(() => {});
        await idle();
        const said = await G(() => __game.log.filter(l => l.who !== 'aviso').map(l => l.text));
        const isOwn = said.length > 0 && !said.some(t => defaultLines.has(t));
        if (isOwn) own++;
        if (v === 'mirar') mirarOwn = isOwn;
      }
      if (!mirarOwn) bad.push(id);
      if (own < 3) few.push(`${id}(${own})`);
    }
    ok(!bad.length, `${room}: Mirar propio en ${ids.length} hotspots${bad.length ? ' — faltan: ' + bad.join(', ') : ''}`);
    ok(!few.length, `${room}: al menos 3 verbos con respuesta propia por hotspot${few.length ? ' — cortos: ' + few.join(', ') : ''}`);
  }
  await G(() => __game.gotoRoom('catacumba')); await idle();
  await clearLog(); await verb('mirar', 'galeradas');
  ok(await logHas('Has contado. Sin que te lo pida. Hijo mío.'), 'galeradas, 2.ª mirada: el titular de los áridos (87) y Teodoro');
  await G(() => __game.gotoRoom('office')); await idle();
  await clearLog(); await verb('mirar', 'porra_plazas');
  ok(await logHas('Prohibido apostar por la salud'), 'porra_plazas, 2.ª mirada');
  await clearLog(); await verb('mirar', 'microondas');
  ok(await logHas('Sus dueños se fueron a las seis y media.'), 'microondas, 2.ª mirada (§8.7)');

  // ------------------------------------------------------------ guardar / cargar en la Catacumba
  step('Guardar / cargar');
  await G(() => __game.gotoRoom('catacumba')); await idle();
  await G(() => __game.save(2));
  await G(() => __game.load(2)); await idle();
  st = await state();
  ok(st.room === 'catacumba' && st.objects['catacumba.fax'].state === 'con_papel' && st.flags.acto_3_iniciado, 'cargar en la Catacumba conserva el estado del fax y los flags');
} catch (e) {
  failedN++;
  console.log('\n  ✗ ERROR: ' + (e instanceof StepFail ? e.message : (e && e.stack || e)));
  try {
    const log = await G(() => __game.log.slice(-8).map(l => `${l.who || '—'}: ${l.text}`));
    console.log('    últimas líneas:\n      ' + log.join('\n      '));
    console.log('    estado: ' + JSON.stringify(await G(() => { const s = __game.state(); return { room: s.room, dialog: s.dialog, duel: s.duel && s.duel.phase, inv: s.inventory }; })));
  } catch (_) { /* */ }
}
const relevant = consoleErrors.filter(e => !/favicon/.test(e));
if (relevant.length) { failedN++; console.log('\nErrores/avisos de consola:\n  ' + relevant.join('\n  ')); }
fs.mkdirSync(path.join(here, 'shots'), { recursive: true });
await browser.close();
server.close();
console.log(`\nPAQUETE C: ${passed} comprobaciones OK, ${failedN} fallos`);
process.exit(failedN ? 1 : 0);
