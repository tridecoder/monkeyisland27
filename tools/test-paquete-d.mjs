#!/usr/bin/env node
// Test del PAQUETE D («Planta noble y Consejo»): ecosistema, administracion, sala_amazonas, duelos D1 y D4, clímax 7.4.
//   node tools/test-paquete-d.mjs            (modo rápido)
//   node tools/test-paquete-d.mjs --shots    además guarda capturas en tools/shots/paquete-d-*.png
// Simula con setFlag/giveItem lo que viene de otros paquetes y juega la parte D de principio a fin vía window.__game.
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from './serve.mjs';
import { createRunner, StepFail } from './walk-lib.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const args = Object.fromEntries(process.argv.slice(2).filter(a => a.startsWith('--')).map(a => { const [k, v] = a.slice(2).split('='); return [k, v ?? true]; }));
const shotsDir = path.join(here, 'shots');
fs.mkdirSync(shotsDir, { recursive: true });

const server = createServer(path.resolve(here, '..'));
await new Promise(r => server.listen(0, r));
const base = `http://localhost:${server.address().port}/`;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 960, height: 600 } });
const consoleErrors = [];
page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));
const G = (fn, arg) => page.evaluate(fn, arg);
const state = () => G(() => __game.state());
const R = createRunner(page);

let pass = 0, failN = 0;
const ok = (c, msg) => { if (c) { pass++; console.log('  ✓ ' + msg); } else { failN++; console.log('  ✗ ' + msg); } };
const step = (t) => console.log('\n' + t);
const logHas = (t) => G(t => __game.log.filter(l => String(l.text).includes(t)).length, t);
// tras el final (api.ending) el juego está en el título: la partida terminada queda en state().finished
const flag = (k) => G(k => { const f = __game.state().finished; return __game.game.state ? __game.getFlag(k) : (f ? f.flags[k] : undefined); }, k);
const setFlags = (o) => G(o => { for (const [k, v] of Object.entries(o)) __game.setFlag(k, v); }, o);
const give = (...ids) => G(ids => ids.forEach(i => __game.giveItem(i)), ids);
const verb = (v, t, i) => G(([v, t, i]) => __game.doVerb(v, t, i || null), [v, t, i]);
const opts = () => G(() => __game.currentDialogOptions());
const choose = (t) => R.chooseByText(t);
const shot = async (name) => {
  if (!args.shots) return;
  await G(() => __game.skipText(false));
  await page.waitForTimeout(350);
  await page.screenshot({ path: path.join(shotsDir, `paquete-d-${name}.png`) });
  await G(() => __game.skipText(true));
};
const inRoom = async (id) => (await state()).actors[id] && (await state()).actors[id].room;
async function pickWeak() {
  const st = await state();
  const i = st.dialog.findIndex(o => o === '¿Me lo pones por escrito?');
  await G(i => __game.chooseDialog(i), i);
}
async function finisher(item) {           // [Usar objeto] → item (fase de remate)
  await choose('[Usar objeto]');
  await G(id => __game.chooseItem(id), item);
}
async function enterClimax() {       // gotoRoom espera a que acabe el script (y el duelo): no se espera aquí
  await G(() => { __game.gotoRoom('sala_amazonas'); });
  for (let i = 0; i < 300; i++) { const s = await state(); if (s.duel && s.dialog) return; await page.waitForTimeout(40); }
  throw new Error('el clímax no abre el duelo D4');
}
async function fresh() {
  await G(() => __game.newGame());
  await G(() => __game.waitIdle());
}
const D4_REPS = { rep_10: true, rep_12: true, rep_13: true, rep_05: true, rep_01: true, rep_07: true };
const ACTO3 = { torno_abierto: true, inigo_presentado: true, chaqueta_en_lector: true, silla_libre: true, acto_2_iniciado: true,
  aurora_conto_pasos: true, reunion_terminada: true, casilla_hueco: true, duelo_maripaz_ganado: true, acto_3_iniciado: true,
  pagina_cerrada: true, ruben_encontrado: true, oyo_descopear: true, ruben_libre: true, sala_abierta: true, duelo_gervasio_ganado: true };

try {
  await page.goto(base);
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) { /* ignore */ } });
  await page.reload();
  await page.waitForFunction(() => !!window.__game);
  await G(() => __game.skipText(true));
  await R.startDismisser();
  await fresh();
  await setFlags({ torno_abierto: true, inigo_presentado: true });

  // ================================================================ SALA AMAZONAS · Actos I-II (P06)
  step('Sala Amazonas, Actos I-II: la reunión infinita (P06)');
  await G(() => __game.gotoRoom('sala_amazonas'));
  ok((await inRoom('gervasio_acta')) === 'sala_amazonas', 'Gervasio preside la reunión');
  ok((await G(() => __game.objects().some(o => o.id === 'figurantes_mercados' && o.visible))), 'figurantes de Mercados en la sala');
  await verb('mirar', 'orden_del_dia');
  ok(await logHas('Previsión de la previsión') > 0, 'Mirar orden del día');
  await verb('hablar', 'gervasio_acta');
  ok(!(await opts()).some(o => o.includes('siguientes pasos')), 'sin aurora_conto_pasos no hay «siguientes pasos»');
  await choose('¿Quién tiene reservada la sala?');
  ok(await logHas('Desayunando. Desde 2019.') === 1, 'opción nueva de Gervasio (adenda 4.7)');
  await R.closeDialog();
  for (let i = 0; i < 6; i++) await verb('usar', 'tele_amazonas');
  ok((await flag('tele_n')) === 6 && (await logHas('Celestino le narra el Ibex al ficus')) === 2, 'tele de videollamadas: rota y vuelve a la 1 (tele_n=6)');
  await verb('usar', 'caja_cables');
  ok((await flag('tele_n')) === 7, 'Usar la caja de cables avanza la tele');
  await verb('mirar', 'carteles_amazonas'); await verb('mirar', 'carteles_amazonas');
  ok(await logHas('LAS TAZAS SON DE DIRECCIÓN') === 1, 'carteles en guerra (rotación)');
  await verb('empujar', 'figurantes_mercados');
  ok(await logHas('a la espera de resultados') === 1, 'Empujar figurantes (8.1)');
  await shot('sala-reunion');
  await setFlags({ aurora_conto_pasos: true, acto_2_iniciado: true });
  await give('ficha_pagina_7');
  await verb('hablar', 'gervasio_acta');
  await choose('¿y cuáles son los siguientes pasos?');
  await R.closeDialog();
  await G(() => __game.waitIdle());
  ok((await flag('reunion_terminada')) === true, 'P06 → reunion_terminada');
  ok((await inRoom('gervasio_acta')) !== 'sala_amazonas', 'Gervasio se ha ido de la sala');
  ok(!(await G(() => __game.objects().some(o => o.id === 'figurantes_mercados' && o.visible))), 'los de Mercados han salido como palomas');
  await verb('coger', 'planillo_mesa');
  ok((await state()).inventory.includes('planillo'), 'Coger planillo_mesa → planillo');
  await verb('ir', 'sala_a_pajarera');
  ok((await state()).room === 'pajarera', 'en el Acto II se sale de la sala sin bloqueo');

  // ================================================================ ECOSISTEMA
  step('Ecosistema: ambiente, portátil de Tadeo, rumores, plátano');
  await G(() => __game.clearLog());
  await G(() => __game.gotoRoom('ecosistema'));
  ok(await logHas('¡Gracias! ¡Eso es contenido!') >= 1, '¡FLASH! de Borja al entrar');
  await verb('mirar', 'portatil_tadeo'); await verb('mirar', 'portatil_tadeo');
  ok((await flag('portatil_tadeo_n')) === 2 && (await flag('rep_15')) === true, 'Mirar portátil ×2 → portatil_tadeo_n=2, rep_15 (X16)');
  for (let i = 0; i < 8; i++) await verb('mirar', 'portatil_tadeo');
  ok(await logHas('Lo más grande de la web es el logo') === 2, 'tras la (9) la rotación vuelve a la (3)');
  await verb('cerrar', 'portatil_tadeo');
  ok(await logHas('RV: Me han cerrado') === 1, 'Cerrar portátil en el Acto II');
  await verb('hablar', 'portatil_tadeo');
  await choose('Deja de reenviar.'); await choose('Me voy.');
  ok(await logHas('Reenviada.') === 1, 'árbol del asistente de Tadeo (4.5)');
  await setFlags({ rumor_firma_n: 2 });
  await verb('hablar', 'borja_engagement'); await R.closeDialog();
  ok((await flag('rumor_firma_n')) === 3 && (await flag('rumor_plaza_n')) === 0, 'rumor A3 de Borja (uno por conversación)');
  await verb('hablar', 'borja_engagement'); await R.closeDialog();
  ok((await flag('rumor_plaza_n')) === 1 && await logHas('¡Se ha comprado una bici!') === 1, 'rumor D1 de Borja en la conversación siguiente');
  await verb('mirar', 'piel_platano'); await verb('coger', 'piel_platano');
  ok((await flag('piel_platano_n')) === 1 && await logHas('inversión a largo plazo') === 1, 'piel de plátano (8bis)');
  await verb('usar', 'gong');
  ok(await logHas('lo facturo') >= 1, 'gong + Maripaz');
  await give('copias_rechazadas');
  await verb('usar', 'impresora_tercera', 'copias_rechazadas');
  ok(await logHas('es de principios') === 1, 'Usar copias con la impresora (8.1)');
  await G(() => __game.takeItem('copias_rechazadas'));
  await setFlags({ rumor_teodoro_n: 2 });
  await verb('hablar', 'maripaz_remitido');
  ok((await flag('rumor_teodoro_n')) === 3, 'rumor C3 de Maripaz');
  ok((await opts()).includes('La página 7 está pendiente desde marzo.'), 'opción M0-2 con el planillo');
  await choose('Me voy.');
  await shot('ecosistema');

  step('Duelo D1 (Maripaz): perder y ganar');
  await setFlags({ rep_08: true, rep_04: true, rep_11: true });
  await G(() => __game.takeItem('ficha_pagina_7'));
  await verb('dar', 'maripaz_remitido', 'planillo');
  ok(!(await state()).duel && await logHas('Sin ficha no te firmo') === 1, 'Dar planillo sin ficha: no hay duelo');
  await give('ficha_pagina_7');
  await verb('dar', 'maripaz_remitido', 'planillo');
  ok((await state()).duel && (await state()).duel.attack === 'R08', 'Dar planillo → D1, ataque R08');
  await shot('duelo-d1');
  for (let i = 0; i < 3; i++) await pickWeak();
  await G(() => __game.waitIdle());
  let st = await state();
  ok(!st.duel && st.lastDuel.id === 'maripaz' && st.lastDuel.result === 'lost', 'tres fallos = derrota');
  ok(!st.flags.duelo_maripaz_ganado && st.inventory.includes('planillo'), 'perder no cuesta nada (planillo sigue)');
  ok(await logHas('El teléfono de Siestatón es este') === 1, 'línea de victoria de Maripaz');
  await verb('hablar', 'maripaz_remitido');
  await choose('La página 7 está pendiente desde marzo.');
  await R.playDuel(['R08', 'R04', 'R11']);
  await G(() => __game.waitIdle());
  st = await state();
  ok(st.flags.duelo_maripaz_ganado && st.flags.casilla_hueco && !st.inventory.includes('planillo'), 'D1 ganado: duelo_maripaz_ganado, casilla_hueco, −planillo');
  ok(await logHas('Impar, cariño: que se vea.') === 1, 'remate de Maripaz');
  await verb('dar', 'maripaz_remitido', 'ficha_pagina_7');
  ok(await logHas('Firmar dos veces es un contrato') === 1, 'Dar ficha con hueco (8.1)');

  step('P14a: el álbum de Borja');
  await verb('coger', 'album_borja_hotspot');
  ok(await logHas('Pídemelo con un motivo') === 1, 'Coger álbum sin ruben_encontrado');
  await verb('hablar', 'borja_engagement');
  ok(!(await opts()).includes('¿Me prestas el álbum?'), 'sin ruben_encontrado no se pide el álbum');
  await R.closeDialog();
  await setFlags({ ruben_encontrado: true, acto_3_iniciado: true });
  await verb('hablar', 'borja_engagement');
  await choose('¿Me prestas el álbum?');
  await R.closeDialog();
  st = await state();
  ok(st.inventory.includes('album_borja') && st.flags.oyo_descopear, 'Borja presta el álbum → album_borja, oyo_descopear');
  ok(!(await G(() => __game.objects().some(o => o.id === 'album_borja_hotspot' && o.visible))), 'el álbum ya no está en el puf');
  await verb('cerrar', 'portatil_tadeo');
  ok((await flag('ecosistema_portatil_cerrado')) === true && await logHas('ATASCO EN BANDEJA DE SALIDA') === 1, 'Cerrar portátil en el Acto III: reenvía la impresora');
  await setFlags({ acto_3_iniciado: false, ruben_encontrado: false });

  // ================================================================ ADMINISTRACIÓN
  step('Administración: Begoña (P08, P11)');
  await G(() => __game.gotoRoom('administracion'));
  await verb('hablar', 'begona_triplicado');
  await choose('Quiero presentar una nota de gasto.');
  await choose('Varios.');
  ok((await flag('bruno_sellado_frente')) === true, '«Varios.» → bruno_sellado_frente');
  await choose('Quiero presentar una nota de gasto.');
  await choose('Café para entender el capitalismo.');
  await choose('Lo que sea.');
  ok((await opts()).some(o => o.startsWith('Lo busco y vuelvo')), 'sin sobre de azúcar: «Lo busco y vuelvo.»');
  await choose('Lo busco y vuelvo.');
  ok(!(await flag('nota_gasto_presentada')), 'sin sobre no se presenta la nota');
  await give('sobre_azucar');
  await verb('hablar', 'begona_triplicado');
  await choose('Quiero presentar una nota de gasto.');
  await choose('Café para entender el capitalismo.');
  await choose('Lo que sea.');
  await choose('Aquí tiene. Un sobre de azúcar. Es casi un ticket.');
  await choose('Esto es un puzle, ¿verdad?');
  ok(await logHas('Para usted es lo mismo, pero con multa.') === 1, 'B_INSULTO: opción que se queda');
  await choose('Pues enséñeme cómo es una nota bien hecha');
  await choose('¿Me hace una cuarta copia, para mi abuela?');
  await R.closeDialog();
  st = await state();
  ok(st.inventory.includes('fotocopia_nota_direccion') && st.inventory.includes('copias_rechazadas') && !st.inventory.includes('sobre_azucar') && st.flags.nota_gasto_presentada,
    'P08: fotocopia + copias, −sobre, nota_gasto_presentada');
  ok(await logHas('la cuarta copia siempre acaba en un juzgado') === 1, '«No existe el CUADRUPLICADO»');
  await give('pieza_opa'); await setFlags({ pieza_escrita: true });
  await verb('dar', 'begona_triplicado', 'pieza_opa');
  ok((await flag('pieza_recortada')) === true && (await state()).inventory.includes('pieza_opa'), 'P11: Dar pieza → pieza_recortada (la pieza se queda)');
  await verb('dar', 'begona_triplicado', 'pieza_opa');
  ok(await logHas('Recortar dos veces es de Marketing.') === 1, 'recortar dos veces');
  for (let i = 0; i < 3; i++) await verb('mirar', 'pared_rechazadas');
  ok((await flag('administracion_pared_n')) === 3 && await logHas('el ministro pagó') >= 1, 'pared de rechazadas rota');
  await give('cafe'); await verb('dar', 'begona_triplicado', 'cafe');
  ok(await logHas('este café no ha existido') === 1, 'Dar café a Begoña');
  await verb('hablar', 'begona_triplicado');
  await choose('¿Le han pedido algo raro hoy?');
  ok(await logHas('Concepto: «Sucesión, plaza 7».') === 1, 'el yunque (8bis)');
  await R.closeDialog();
  await shot('administracion');

  step('Administración: don Evaristo (R16, MP2)');
  await setFlags({ evaristo_convoco: false });     // (la llamada L2 ya pudo ponerlo al entrar en una sala)
  await verb('usar', 'puerta_controlling');
  ok(!(await opts()).some(o => o.startsWith('¿Para qué me ha llamado')), 'sin evaristo_convoco no hay opción 1');
  await choose('¿Algún cotilleo?');
  await R.closeDialog();
  ok((await flag('rep_16')) === true, 'Evaristo «¿Algún cotilleo?» → rep_16 (X18)');
  ok(await logHas('Llevas RECHAZADO') + await logHas('Lleva RECHAZADO') >= 1, 'comentario opcional de bruno_sellado_frente');
  await setFlags({ evaristo_convoco: true });
  await verb('hablar', 'evaristo_salvedad');
  await choose('¿Para qué me ha llamado?');
  await choose('¿Falta mucho?');
  await G(() => __game.waitIdle());
  ok(!(await state()).dialog && !(await flag('evaristo_escuchado')), 'MP2: con prisa vuelve a su mesa (sin coste)');
  await verb('hablar', 'evaristo_salvedad');
  ok(await logHas('Son tres.') >= 1, 'saludo de las siguientes veces');
  await choose('¿Para qué me ha llamado?');
  await choose('¿De qué trata?');
  await choose('Siga.');
  await choose('Siga, siga.');
  await choose('¿Y eso qué significa?');
  await choose('No pare.');
  await G(() => __game.waitIdle());
  ok((await flag('evaristo_escuchado')) === true && await logHas('Pagamos 47.952 euros de más') === 1, 'MP2 paso 1 → evaristo_escuchado (X19)');
  await verb('hablar', 'evaristo_salvedad');
  ok(!(await opts()).some(o => o.startsWith('¿Para qué me ha llamado')), 'la opción 1 desaparece tras escucharle');
  await R.closeDialog();
  await setFlags({ coma_bendecida: true });
  await verb('hablar', 'evaristo_salvedad');
  await choose('Aurora dice que su coma está bien.');
  await G(() => __game.waitIdle());
  ok((await flag('correo_evaristo_listo')) === true, 'MP2 paso 3 → correo_evaristo_listo (X22)');
  await give('acta_consejo'); await verb('dar', 'evaristo_salvedad', 'acta_consejo');
  ok(await logHas('Casi es poesía') === 1, 'combinación de la adenda 4.8');
  await verb('empujar', 'puerta_controlling');
  ok(await logHas('Se le espera.') === 1, 'Empujar la puerta de Controlling');
  await verb('ir', 'administracion_a_ecosistema');
  ok((await state()).room === 'ecosistema', 'salida a ecosistema');

  // ================================================================ CLÍMAX · versión B (sin correo) + objetos equivocados
  step('Clímax 7.4 sin el correo de Evaristo; remates con objeto equivocado y correcto');
  await fresh();
  await setFlags({ ...ACTO3, ...D4_REPS });
  await give('ticket_n1', 'acta_consejo');
  await G(() => __game.clearLog());
  await enterClimax();
  st = await state();
  ok(st.duel && st.duel.id === 'inigo' && st.duel.attack === 'R10', 'al entrar: escena 7.4 y duelo D4 (ataque R10)');
  ok(await logHas('la 247 tiene mucho recorrido') === 1 && await logHas('Respondo a todos.') === 1, 'inserto 9.4 y entrada 7.4');
  ok(st.duel.assigned === 'Vacante (perfil ideal)', '«Asignado a: Vacante (perfil ideal)»');
  await shot('duelo-d4');
  const pairs = await G(() => Object.fromEntries(__game.game.content.duels.pairs.map(p => [p.id, p.reply])));
  const reply = async (pid) => { const s = await state(); await G(k => __game.chooseDialog(k), s.dialog.indexOf(pairs[pid])); };
  await reply('R10'); await reply('R12');
  ok((await state()).duel.phase === 'finisher', 'a 2 puntos: REMATE A');
  await shot('duelo-d4-remate');
  await finisher('acta_consejo');
  ok(await logHas('Un acta. Muy analógico. Luego la leemos.') === 1 && (await state()).duel.phase === 'finisher', 'acta en el remate A: línea propia, no es fallo');
  await finisher('movil');
  ok(await logHas('te facturo los derechos de imagen') === 1, 'móvil en el remate (duelo.js)');
  await finisher('ticket_n1');
  ok(await logHas('Hola. Soy la inversión.') === 1, 'ticket_n1 → entra Rubén');
  ok((await inRoom('ruben')) === 'sala_amazonas', 'Rubén está en la Sala');
  ok((await state()).duel.phase === 'reply' && (await state()).duel.attack === 'R13', 'el duelo continúa (R13)');
  await reply('R13'); await reply('R05');
  await finisher('ticket_n1');
  ok(await logHas('Eso ya me lo has enseñado. No escala dos veces.') === 1, 'ticket en el remate B: línea propia');
  ok((await state()).duel.misses === 0, 'los objetos equivocados no cuentan como fallo');
  await finisher('acta_consejo');
  await G(() => __game.waitIdle());
  st = await state();
  ok(!st.duel && st.flags.duelo_inigo_ganado && st.lastDuel.result === 'won', 'D4 ganado → duelo_inigo_ganado');
  ok(await logHas('El mejor lector que he tenido.') === 1, 'líneas de Íñigo tras ganar');
  await verb('ir', 'sala_a_pajarera');
  ok((await state()).room === 'sala_amazonas', 'no se sale de la Sala hasta acabar');
  await shot('climax-antes-empujon');
  await G(() => __game.clearLog());
  await verb('empujar', 'lector_medio');
  await G(() => __game.waitIdle());
  st = await state();
  if (st.mode === 'title' && st.finished) st = { ...st, ...st.finished };
  ok(st.flags.lector_derribado === true, 'Empujar lector_medio → lector_derribado');
  ok(await logHas('...¿Y quién ha validado la fase 1?') === 1 && await logHas('EL VIAJE CONTINÚA') === 1, 'empujón + inserto 9.5 (diapositiva 248)');
  ok(await logHas('Al lado del ministro.') === 1, 'Begoña rechaza la factura');
  ok(await logHas('Es Evaristo. Dice que nos va a escribir un correo.') === 1 && await logHas('Les anuncié un correo') === 0, 'versión B del inserto 9.6');
  ok(await logHas('Goyita. Tira.') === 1 && await logHas('Eso es el papel.') === 1, '«Goyita. Tira.» y final de 7.4');
  ok(st.actors.begona_triplicado.room === 'administracion', 'Begoña vuelve a su ventanilla');
  ok(await logHas('Sábado, 6:00.') === 1, 'se lanza la escena final 7.5 (paquete A)');
  ok(st.flags.juego_terminado === true, 'juego_terminado (lo pone la escena final del paquete A)');

  // ================================================================ CLÍMAX · perder y retirarse
  step('Clímax: perder D4, reintentar hablando con Íñigo, retirarse del hilo');
  await fresh();
  await setFlags({ ...ACTO3, ...D4_REPS });
  await give('ticket_n1', 'acta_consejo');
  await enterClimax();
  for (let i = 0; i < 3; i++) await pickWeak();
  await G(() => __game.waitIdle());
  st = await state();
  ok(!st.duel && st.lastDuel.id === 'inigo' && st.lastDuel.result === 'lost' && !st.flags.duelo_inigo_ganado, 'tres fallos = derrota sin castigo');
  ok(await logHas('Es un perfil ideal para despedir.') === 1 && await logHas('Ni hablar. Lo vuelvo a intentar.') === 1, 'líneas de derrota');
  await verb('ir', 'sala_a_pajarera');
  ok((await state()).room === 'sala_amazonas', 'sabiendo las réplicas, la puerta sigue cerrada');
  await verb('empujar', 'lector_medio');
  ok(await logHas('Todavía no. Primero, por escrito.') === 1 && !(await flag('lector_derribado')), 'Empujar antes de ganar: «Todavía no»');
  await verb('hablar', 'inigo_sinergia');
  st = await state();
  ok(st.duel && st.duel.attack === 'R10' && st.duel.hits === 0, 'Hablar con Íñigo: el duelo vuelve a empezar desde 0');
  await reply('R10'); await reply('R12');
  await choose('[Retirarse del hilo]');
  await G(() => __game.waitIdle());
  st = await state();
  ok(!st.duel && st.lastDuel.result === 'retired' && !st.flags.duelo_inigo_ganado, '[Retirarse del hilo] = derrota sin castigo');
  await setFlags({ rep_12: false, rep_13: false, rep_05: false });
  await verb('ir', 'sala_a_pajarera');
  ok((await state()).room === 'pajarera', 'sin réplicas suficientes se puede salir (sin callejones)');

  // ================================================================ CLÍMAX · versión A (con el correo de Evaristo)
  step('Clímax con el correo de Evaristo (versión A, refuerzo opcional)');
  await fresh();
  await setFlags({ ...ACTO3, ...D4_REPS, evaristo_convoco: true, evaristo_escuchado: true, coma_bendecida: true, correo_evaristo_listo: true });
  await give('ticket_n1', 'acta_consejo');
  await G(() => __game.clearLog());
  await enterClimax();
  await R.playDuel(['R10', 'R12', { objeto: 'ticket_n1' }, 'R13', 'R05', { objeto: 'acta_consejo' }]);
  await G(() => __game.waitIdle());
  ok((await flag('duelo_inigo_ganado')) === true, 'walkthrough §5.4 paso 45');
  ok(await logHas('«RV: Resumen IA: todos de acuerdo»!!') >= 0, 'cameo de Tadeo (motor)');
  await verb('empujar', 'lector_medio');
  await G(() => __game.waitIdle());
  ok(await logHas('Les anuncié un correo. Lo envío ahora. Con todos en copia.') === 1, 'versión A: Evaristo por el teléfono de conferencias');
  ok(await logHas('Nos deben 191.808 euros') === 1 && await logHas('...Y ahorrar.') === 1, 'versión A completa (191.808 €; «...Y ahorrar.»)');
  ok(await logHas('Es Evaristo. Dice que nos va a escribir un correo.') === 0, 'no sale la versión B');
  ok((await flag('lector_derribado')) === true, 'lector_derribado en la versión A');
} catch (e) {
  failN++;
  console.log('\n  ✗ ERROR: ' + (e instanceof StepFail ? e.message : (e && e.stack || e)));
  const st = await state().catch(() => null);
  const log = await G(() => __game.log.slice(-8).map(l => `${l.who || '—'}: ${l.text}`)).catch(() => []);
  if (st) console.log(`    contexto: sala=${st.room} diálogo=${JSON.stringify(st.dialog)} duelo=${JSON.stringify(st.duel)}`);
  if (log.length) console.log('    últimas líneas:\n      ' + log.join('\n      '));
}

const gameErrors = await G(() => __game.errors.filter(e => !e.warn).map(e => e.msg || e.message || String(e))).catch(() => []);
ok(gameErrors.length === 0, 'sin errores del motor' + (gameErrors.length ? ': ' + JSON.stringify(gameErrors) : ''));
ok(consoleErrors.length === 0, 'sin errores de consola' + (consoleErrors.length ? ':\n    ' + consoleErrors.join('\n    ') : ''));
console.log(`\nPAQUETE D: ${pass} OK, ${failN} fallos`);
await browser.close();
server.close();
process.exit(failN ? 1 : 0);
