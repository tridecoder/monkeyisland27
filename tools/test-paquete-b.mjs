#!/usr/bin/env node
// Test del PAQUETE B (Pecera + Pajarera): juega la parte de B de principio a fin vía window.__game, simulando con
// setFlag / giveItem lo que viene de otros paquetes (torno_abierto, vio_ticket_3, casilla_fuente, actos, Rubén...).
// Comprueba flags, objetos, presencia de PNJ, líneas clave del log y que no haya errores de consola ni del motor.
//   node tools/test-paquete-b.mjs            modo rápido
//   node tools/test-paquete-b.mjs --lento    sin modo rápido + capturas en tools/shots/paqB-*.png
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from './serve.mjs';
import { createRunner, StepFail } from './walk-lib.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const lento = process.argv.includes('--lento');

const server = createServer(path.resolve(here, '..'));
await new Promise(r => server.listen(0, r));
const base = `http://localhost:${server.address().port}/`;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 960, height: 600 } });
const consoleErrors = [];
page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));
const R = createRunner(page);
const { G, state, chooseByText, closeDialog } = R;

let n = 0, failed = null;
const ok = (msg) => console.log(`  ✓ ${String(++n).padStart(2)} ${msg}`);
const must = (c, msg) => { if (!c) throw new StepFail(msg); };
const flag = (k) => G(k => __game.getFlag(k), k);
const setFlag = (k, v = true) => G(([k, v]) => __game.setFlag(k, v), [k, v]);
const give = (id) => G(id => __game.giveItem(id), id);
const verb = (v, t, i) => G(([v, t, i]) => __game.doVerb(v, t, i), [v, t, i || null]);
const idle = () => G(() => __game.waitIdle());
const logHas = (txt) => G(t => __game.log.some(l => String(l.text).includes(t)), txt);
const clearLog = () => G(() => __game.clearLog());
const roomOf = async (id) => (await state()).actors[id] && (await state()).actors[id].room;
const inRoom = (id) => G(id => __game.objects().some(o => o.id === id && o.visible !== false), id);
const shot = async (name) => { if (lento) await page.screenshot({ path: path.join(here, 'shots', `paqB-${name}.png`) }); };
async function hablar(id) { await verb('hablar', id); await idle(); }
async function opcion(t) { await chooseByText(t); await idle(); }
async function expectFlags(obj, ctx) {
  for (const [k, v] of Object.entries(obj)) { const got = await flag(k); must(v === false ? !got : got === v, `${ctx}: flag ${k} = ${JSON.stringify(got)}, se esperaba ${JSON.stringify(v)}`); }
}
async function expectInv(tiene = [], notiene = [], ctx = '') {
  const inv = (await state()).inventory;
  for (const i of tiene) must(inv.includes(i), `${ctx}: falta ${i} en el inventario`);
  for (const i of notiene) must(!inv.includes(i), `${ctx}: ${i} sigue en el inventario`);
}

try {
  await page.goto(base + '?room=vestibulo');
  await page.waitForFunction(() => !!window.__game && __game.state().room === 'vestibulo', null, { timeout: 30000 });
  if (!lento) await G(() => __game.skipText(true));
  await R.startDismisser();
  console.log('Paquete B · Pecera + Pajarera\n');

  // ------------------------------------------------------------ 7.2 presentación del villano
  for (const f of ['intro_vista', 'celestino_dio_chicle', 'tarjeta_con_chicle', 'foto_en_organigrama', 'torno_abierto']) await setFlag(f);
  await clearLog();
  await G(() => __game.gotoRoom('pecera', 'vestibulo'));
  await idle();
  await expectFlags({ inigo_presentado: true }, '7.2');
  must(await logHas('Vengo a reimaginar el perímetro.'), '7.2: falta la línea de Íñigo');
  must(await logHas('CORO: ¡Ha sido Diseño!'), '7.2: falta el inserto 9.1 del coro');
  must(await logHas('Paco dice muchas cosas. Por ticket.'), '7.2: falta el cierre de Nerea');
  must(await logHas('Las pantallas no se han enterado.'), '7.2: falta la línea de entrada 8.7');
  must((await roomOf('inigo_sinergia')) !== 'pecera', '7.2: Íñigo sigue en la Pecera');
  must((await flag('evaristo_llamadas')) === 0, '7.2: salió un aviso en la entrada de la escena');
  ok('7.2 presentación del villano → inigo_presentado (+ inserto 9.1, entrada 8.7, sin avisos)');
  await shot('01-pecera');
  // segunda entrada: no se repite
  await clearLog();
  await G(() => __game.gotoRoom('pecera', 'vestibulo')); await idle();
  must(!(await logHas('Vengo a reimaginar el perímetro.')), '7.2 se repite en la segunda entrada');
  ok('7.2 no se repite');

  // ------------------------------------------------------------ P04a la chaqueta
  await verb('mirar', 'ordenador_bruno');
  await expectFlags({ rep_11: false }, 'ordenador sin silla');
  await verb('usar', 'silla_ramirez');
  await verb('coger', 'chaqueta_ramirez_hotspot');
  await expectFlags({ chaqueta_cogida: true }, 'P04a');
  await expectInv(['chaqueta_ramirez', 'sobre_azucar'], [], 'P04a');
  must(!(await inRoom('chaqueta_ramirez_hotspot')), 'P04a: el hotspot de la chaqueta sigue visible');
  must(await logHas('que sea para dejarla en un sitio con más autoridad'), 'P04a: falta la pista de Yoli');
  ok('P04a Coger chaqueta → chaqueta_ramirez + sobre_azucar, chaqueta_cogida');

  // ------------------------------------------------------------ enchufe sin ticket, bandeja de Diseño, coro
  await verb('tirar', 'enchufe_pantalla');
  await expectFlags({ cms_vivo: false }, 'enchufe sin vio_ticket_3');
  await verb('abrir', 'bandeja_diseno');
  await expectFlags({ bandeja_diseno_abierta: true }, 'Abrir bandeja');
  await clearLog();
  await verb('tirar', 'enchufe_pantalla');
  must(await logHas('Diseño avisó, pero un aviso no es un ticket.'), 'enchufe: falta la línea de la adenda 3.3');
  await expectFlags({ cms_vivo: false }, 'enchufe sin vio_ticket_3 (2)');
  ok('enchufe bloqueado sin vio_ticket_3 (biblia y adenda); bandeja → bandeja_diseno_abierta');
  await hablar('coro_desarrollo');
  must((await state()).dialog, 'coro: no abre diálogo');
  await opcion('Diseño os avisó de lo del CMS. En 2017.');
  must(await logHas('Perdón, Diseño.'), 'CO_BANDEJA: falta «Perdón, Diseño.»');
  must(!(await state()).dialog, 'CO_BANDEJA no termina el diálogo');
  await hablar('coro_desarrollo');
  must(!(await state()).dialog.some(o => o.includes('En 2017')), 'CO_BANDEJA: la opción 6 no desaparece');
  await closeDialog(); await idle();
  must(await logHas('Ya lo sé.'), 'CO_BANDEJA: Valentín no contesta «Ya lo sé.» desde su mesa');
  ok('coro: CO_BANDEJA una vez (y Valentín, a dos metros, «Ya lo sé.»)');

  // ------------------------------------------------------------ cameo: Valentín Retícula, ahora en la Pecera junto a Diseño
  must((await roomOf('valentin_reticula')) === 'pecera', 'Valentín no está en la Pecera');
  must(!(await G(() => Object.keys(__game.game.content.rooms.cpd.layout).includes('valentin_reticula'))), 'Valentín sigue en el arte del CPD');
  await clearLog();
  await hablar('valentin_reticula');
  must((await state()).dialog, 'Valentín: Hablar no abre su diálogo');
  await opcion('¿Qué está dirigiendo?');
  await opcion('¿Por qué trabaja aquí, al lado de Desarrollo?');
  await opcion('Desarrollo dice que todo es culpa de Diseño.');
  await opcion('¿Es verdad que le quieren fusionar con Infografía?');
  must(!(await state()).dialog.some(o => o.includes('Titulator')), 'Valentín: la opción del Titulator sale sin ruben_encontrado');
  must(!(await state()).dialog.some(o => o.includes('pantalla tumbaba')), 'Valentín: la opción del CMS sale sin cms_vivo');
  await opcion('¿Algún truco?');
  await opcion('Me voy.');
  await verb('usar', 'monitor_valentin'); await verb('mirar', 'monitor_valentin'); await verb('mirar', 'valentin_reticula');
  for (const l of ['Eres un sprite muy bien resuelto.', 'La bandeja está a dos metros.', 'Es aislamiento por diseño.', 'Lo dicen a dos metros.',
    'Se la devolví alineada.', 'Lo he rediseñado.', 'Con un empujón. Con educación.', 'Es esta Redacción. En pequeño.', 'Va mejor vestido que la planta entera.']) must(await logHas(l), `Valentín: falta «${l}»`);
  const vb = await G(() => { const g = __game.game, a = g.actors.valentin_reticula, b = g.actorBox(a); const others = Object.values(g.actors).filter(o => o.room === 'pecera' && o.visible && o.id !== a.id && o.id !== 'bruno').map(o => [o.id, g.actorBox(o)]);
    return { x: a.x, y: a.y, overl: others.filter(([, o]) => o.x < b.x + b.w && b.x < o.x + o.w).map(([id]) => id), hs: g.roomObjects().filter(o => o.hotspot !== false && o.w && o.x < b.x + b.w && b.x < o.x + o.w && o.y + o.h > b.y + b.h * 0.3).map(o => o.id) }; });
  must(!vb.overl.length, `Valentín se solapa con ${vb.overl.join(', ')}`);
  must(!vb.hs.length, `Valentín tapa/está tapado por hotspots: ${vb.hs.join(', ')}`);
  ok('cameo en la Pecera: diálogo de Valentín (nuevo «aquí, al lado de Desarrollo»), monitor con la Pecera en miniatura, sin solapes');

  // ------------------------------------------------------------ Yoli y Nerea sin CMS + rumor C2
  await setFlag('rumor_teodoro_n', 1);
  await hablar('yoli_tendencias');
  must(!(await state()).dialog, 'Yoli sin cms_vivo no debería abrir menú');
  await expectFlags({ rumor_teodoro_n: 2 }, 'rumor C2 (Yoli)');
  await hablar('nerea_backlog');
  must(!(await state()).dialog, 'Nerea sin cms_vivo no debería abrir menú');
  ok('Yoli/Nerea sin cms_vivo: solo su línea; rumor C paso 2 → rumor_teodoro_n = 2');

  // ------------------------------------------------------------ Pajarera, Actos I-II
  await R.travel('pajarera'); await idle();
  must((await state()).room === 'pajarera', 'no llego a la Pajarera');
  must((await roomOf('inigo_sinergia')) === 'pajarera' && (await roomOf('lector_medio')) === 'pajarera', 'Pajarera: faltan Íñigo o el Lector Medio');
  must((await roomOf('gervasio_acta')) !== 'pajarera', 'Pajarera: Gervasio no debería estar sin reunion_terminada');
  await verb('usar', 'perchero', 'chaqueta_ramirez');
  await expectInv(['chaqueta_ramirez'], [], 'perchero');
  await verb('usar', 'lector_medio', 'chaqueta_ramirez');
  await expectFlags({ chaqueta_en_lector: true, silla_libre: true }, 'P04b');
  await expectInv([], ['chaqueta_ramirez'], 'P04b');
  ok('P04b Usar chaqueta con lector_medio → chaqueta_en_lector, silla_libre; −chaqueta');
  await verb('mirar', 'ordenador_gervasio');
  await expectFlags({ rep_07: true }, 'ordenador_gervasio');
  ok('Mirar ordenador_gervasio (sin Gervasio) → rep_07');
  await clearLog();
  for (let i = 0; i < 3; i++) await verb('mirar', 'pantalla_titulator');
  await expectFlags({ titulator_mirar_n: 3, vio_armario_27: true }, 'Titulator ×3');
  const tit = await G(() => __game.log.filter(l => l.who === 'pantalla_titulator').map(l => l.text));
  must(tit[0].includes('LA CHAQUETA QUE LO CAMBIÓ TODO') && tit[1].includes('ORGANIGRAMA') && tit[2] === 'AYÚDAME ESTOY EN EL ARMARIO 27', 'Titulator: orden inesperado ' + JSON.stringify(tit));
  must(await logHas('Alucinaciones. Es normal en modelos tan avanzados.'), 'Titulator: falta Íñigo');
  for (let i = 0; i < 8; i++) await verb('mirar', 'pantalla_titulator');
  must(await logHas('Son nueve razones. La séptima está repetida.'), 'Titulator: falta la línea del titular 7');
  ok('Titulator: hazañas (más reciente primero), 3.ª mirada AYÚDAME → vio_armario_27, genéricos y titular 7');
  await setFlag('rumor_atun_n', 2);
  await hablar('inigo_sinergia');
  await expectFlags({ rumor_atun_n: 3 }, 'rumor B3 (Íñigo)');
  await opcion('¿Qué es eso del armario 27?');
  await opcion('¿Conoces a Herminia?');
  await opcion('Me voy.');
  must(!(await state()).dialog, 'Íñigo: «Me voy.» no cierra');
  ok('Íñigo I0: rumor B paso 3, opción del armario 27 y de la adenda');
  await hablar('lector_medio');
  must(await logHas('A mí lo que me interesa es la economía. Y ahorrar.'), 'Lector Medio: falta la grabación');
  for (let i = 0; i < 2; i++) await verb('mirar', 'hoja_reservas');
  await expectFlags({ hoja_reservas_n: 2 }, 'hoja_reservas');
  await verb('coger', 'posit_evaristo');
  ok('Lector Medio, hoja de reservas (hoja_reservas_n = 2), pósit de Evaristo');
  await shot('02-pajarera');

  // ------------------------------------------------------------ vuelta a la Pecera: correo, P05b
  await R.travel('pecera'); await idle();
  await verb('mirar', 'ordenador_bruno');
  await expectFlags({ rep_11: true }, 'ordenador con silla');
  await verb('usar', 'ordenador_bruno');
  await expectInv([], ['pieza_opa'], 'ordenador sin fuentes');
  ok('Mirar ordenador_bruno con silla_libre → rep_11; Usar sin casilla_fuente no escribe');
  await setFlag('vio_ticket_3');
  await clearLog();
  await verb('tirar', 'enchufe_pantalla');
  await expectFlags({ cms_vivo: true }, 'P05b');
  must(await logHas('He sido yo. Pero gracias.'), 'P05b: falta el inserto 9.2');
  ok('P05b Tirar enchufe con vio_ticket_3 → cms_vivo (+ inserto 9.2)');
  await hablar('yoli_tendencias');
  await opcion('¿Algún hilo bueno esta noche?');
  await expectFlags({ rep_08: true }, 'Yoli Y2');
  await closeDialog(); await idle();
  await hablar('nerea_backlog');
  await opcion('¿Qué tal con Yoli?');
  await expectFlags({ rep_09: true }, 'Nerea N3');
  await opcion('¿Por qué está bloqueado lo de Herminia?');
  await closeDialog(); await idle();
  ok('Yoli «¿Algún hilo bueno esta noche?» → rep_08; Nerea «¿Qué tal con Yoli?» → rep_09');

  // ------------------------------------------------------------ MP1 · la becaria Herminia (partes de B)
  await hablar('leoncio_quesitos'); await opcion('¿Qué es Herminia?'); await closeDialog(); await idle();
  await hablar('anselmo_monolito'); await opcion('¿Y el Titulator? Ese sí entró.'); await opcion('Me voy.');
  await expectFlags({ anselmo_dijo_regla: true }, 'MP1 paso 1');
  await hablar('leoncio_quesitos'); await opcion('¿Y si Herminia tuviera alta en Sistemas?'); await closeDialog(); await idle();
  await expectFlags({ leoncio_acepta_alta: true }, 'MP1 paso 2');
  await setFlag('herminia_de_alta');                             // paso 3: Paco (paquete A)
  await hablar('anselmo_monolito'); await opcion('Hay una becaria nueva en Desarrollo.'); await closeDialog(); await idle();
  await expectFlags({ infografia_integrada: true }, 'MP1 paso 4');
  await hablar('coro_desarrollo'); await opcion('Herminia ahora es de Desarrollo.'); await closeDialog(); await idle();
  must(await logHas('CULPAS A DISEÑO: 3.112. CON RAZÓN: 0.'), 'CO_HERMINIA: falta el rótulo');
  must(((await G(() => __game.state().objects))['pecera.semaforo_ruido'] || {}).state !== 'verde', 'el semáforo se queda en verde');
  ok('MP1: anselmo_dijo_regla → leoncio_acepta_alta → (A) herminia_de_alta → infografia_integrada; CO_HERMINIA');
  await setFlag('rumor_atun_n', 1);
  await hablar('nerea_backlog'); await closeDialog(); await idle();
  await expectFlags({ rumor_atun_n: 2 }, 'rumor B2 (Nerea)');
  ok('Nerea: rumor B paso 2');

  // ------------------------------------------------------------ P10b escribir la pieza
  await setFlag('acto_2_iniciado'); await setFlag('casilla_fuente');
  await verb('usar', 'ordenador_bruno');
  await expectFlags({ pieza_escrita: true }, 'P10b');
  await expectInv(['pieza_opa'], [], 'P10b');
  await verb('usar', 'ordenador_bruno');
  ok('P10b Usar ordenador_bruno con casilla_fuente → pieza_opa, pieza_escrita');

  // ------------------------------------------------------------ Pajarera, Acto II con Gervasio; puerta libre
  await setFlag('reunion_terminada');
  await R.travel('pajarera'); await idle();
  must((await roomOf('gervasio_acta')) === 'pajarera', 'Gervasio no está en la Pajarera con reunion_terminada');
  await clearLog();
  await hablar('lector_medio');
  must(await logHas('...Pues ya está decidido.'), 'Lector Medio + Gervasio: falta «Pues ya está decidido»');
  await verb('mirar', 'ordenador_gervasio');
  must(await logHas('periodismo de investigación'), 'ordenador_gervasio con Gervasio delante');
  await hablar('gervasio_acta'); await opcion('¿Cuántos marrones lleva este año?'); await idle();
  must(!(await state()).dialog, 'GV_PAJARERA no termina');
  await clearLog();
  await verb('mirar', 'pantalla_titulator');
  must(await logHas('HAY HERIDOS') || await logHas('UNA HERRAMIENTA'), 'Titulator: no sale una hazaña nueva');
  ok('Acto II: Gervasio en su mesa (GV_PAJARERA, 7.7.4), ordenador vetado, titular de hazaña nuevo');
  await verb('usar', 'puerta_sala'); await idle();
  must((await state()).room === 'sala_amazonas', 'puerta_sala en el Acto II no lleva a la Sala');
  await R.travel('pajarera'); await idle();
  ok('Actos I-II: Usar puerta_sala → sala_amazonas');

  // ------------------------------------------------------------ Acto III
  await setFlag('acto_3_iniciado'); await setFlag('ruben_encontrado');
  await R.travel('pecera'); await idle();
  await give('album_eventos'); await setFlag('oyo_descopear');
  await setFlag('rumor_plaza_n', 2);
  await hablar('nerea_backlog');
  await expectFlags({ rumor_plaza_n: 3 }, 'rumor D3 (Nerea)');
  await closeDialog(); await idle();
  await verb('dar', 'nerea_backlog', 'album_eventos');
  await opcion('¿Y si... lo descopeamos?');
  await expectFlags({ posit_descopeado: true }, 'P14b');
  await expectInv(['posit_baja_ruben'], ['album_eventos'], 'P14b');
  await closeDialog(); await idle();
  await clearLog(); await verb('mirar', 'kanban');
  must(await logHas('Descopeado con amor'), 'kanban tras posit_descopeado');
  ok('P14b Dar album_eventos a Nerea → «¿Y si... lo descopeamos?» → posit_baja_ruben, posit_descopeado; rumor D3');
  await setFlag('ruben_libre'); await G(() => __game.takeItem('posit_baja_ruben')); await give('ticket_n1');
  await R.travel('pajarera'); await R.travel('pecera'); await idle();
  must((await roomOf('ruben')) === 'pecera', 'Rubén no está en la ventana con ruben_libre');
  await clearLog(); await hablar('ruben');
  must(await logHas('Yo también. Pero sin pegatina.'), 'Rubén: falta la línea de Herminia (adenda 3.3)');
  await setFlag('rumor_firma_n', 3);
  await hablar('yoli_tendencias');
  await expectFlags({ rumor_firma_n: 4 }, 'rumor A4 (Yoli)');
  await opcion('Íñigo va a cerrar el papel.'); await closeDialog(); await idle();
  await clearLog(); await verb('mirar', 'frontera_carrocero');
  must(await logHas('Queda la marca del pegamento.'), 'frontera con infografia_integrada');
  ok('Acto III: Rubén en la Pecera, rumor A paso 4, cinta retirada');
  await shot('03-pecera-acto3');

  await R.travel('pajarera'); await idle();
  must((await roomOf('inigo_sinergia')) !== 'pajarera' && (await roomOf('lector_medio')) !== 'pajarera' && (await roomOf('gervasio_acta')) !== 'pajarera', 'Pajarera no está vacía en el Acto III');
  await G(() => __game.takeItem('ticket_n1'));
  await setFlag('ruben_libre', false);
  await verb('usar', 'puerta_sala'); await idle();
  must((await state()).room === 'pajarera', 'puerta_sala sin sala_abierta deja pasar');
  await setFlag('sala_abierta'); await give('acta_reunion');
  await clearLog(); await verb('usar', 'puerta_sala'); await idle();
  must((await state()).room === 'pajarera' && await logHas('Íñigo me desapalanca'), 'puerta_sala sin Rubén');
  await setFlag('ruben_libre'); await give('ticket_n1');
  await verb('usar', 'puerta_sala'); await idle();
  must((await state()).room === 'sala_amazonas', 'puerta_sala con todo no entra en la Sala');
  ok('Acto III: Pajarera vacía; puerta_sala bloqueada (OCUPADO / sin Rubén) y abierta con todo → sala_amazonas');

  const engineErrors = await G(() => __game.errors.filter(e => !e.warn).map(e => String(e.msg || e.message || e)));
  must(!engineErrors.length, 'errores del motor: ' + engineErrors.join(' | '));
} catch (e) {
  failed = e instanceof StepFail ? e.message : 'error del script: ' + (e && e.stack || e);
}

if (failed) {
  const log = await G(() => __game.log.slice(-8).map(l => `${l.who || '—'}: ${l.text}`)).catch(() => []);
  console.log(`\n  ✗ FALLO tras ${n} comprobaciones: ${failed}`);
  if (log.length) console.log('    últimas líneas:\n      ' + log.join('\n      '));
  try { fs.mkdirSync(path.join(here, 'shots'), { recursive: true }); await page.screenshot({ path: path.join(here, 'shots', 'paqB-fallo.png') }); } catch (_) { /* ignore */ }
}
if (consoleErrors.length) console.log('\nErrores de consola:\n  ' + consoleErrors.join('\n  '));
console.log(failed || consoleErrors.length ? '\nPAQUETE B: FALLA' : `\nPAQUETE B: OK (${n} comprobaciones)`);
await browser.close();
server.close();
process.exit(failed || consoleErrors.length ? 1 : 0);
