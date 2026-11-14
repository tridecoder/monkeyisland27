#!/usr/bin/env node
// Test del paquete P1 de la reescritura de comedia (docs/guion2/PLAN_COMEDIA.md §11 P1 + ENMIENDA E1 + ENMIENDA E2 §11
// P1): Vestíbulo, Sistemas y final. Juega lo de P1 vía window.__game, simulando con setFlag / giveItem lo que viene de
// otros paquetes.
//   node tools/test-comedia-p1.mjs             comprobaciones en modo rápido + capturas de los momentos nuevos
//   node tools/test-comedia-p1.mjs --sin-capturas
// Capturas: tools/shots/e2-p1-*.png
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from './serve.mjs';
import { createRunner, StepFail } from './walk-lib.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const capturas = !process.argv.includes('--sin-capturas');
fs.mkdirSync(path.join(here, 'shots'), { recursive: true });

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
const shots = [];
const ok = (msg) => console.log(`  ✓ ${String(++n).padStart(2)} ${msg}`);
const must = (c, msg) => { if (!c) throw new StepFail(msg); };
const flag = (k) => G(k => __game.getFlag(k), k);
const setFlag = (k, v = true) => G(([k, v]) => __game.setFlag(k, v), [k, v]);
const give = (id) => G(id => __game.giveItem(id), id);
const verb = (v, t, i) => G(([v, t, i]) => __game.doVerb(v, t, i), [v, t, i || null]);
const idle = () => G(() => __game.waitIdle());
const logHas = (txt) => G(t => __game.log.some(l => String(l.text).includes(t)), txt);
const logWho = (txt) => G(t => { const l = __game.log.find(l => String(l.text).includes(t)); return l ? l.who : null; }, txt);
const clearLog = () => G(() => __game.clearLog());
const miles = (n) => String(Math.round(n || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const roomOf = async (id) => { const a = (await state()).actors[id]; return a && a.visible !== false ? a.room : null; };
const goto = async (room, entry) => { await G(([r, e]) => __game.gotoRoom(r, e), [room, entry]); await idle(); };
const opts = () => G(() => __game.currentDialogOptions());
const objState = (id) => G(id => { const o = __game.objects().find(o => o.id === id); return o && o.state; }, id);
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
async function expectLog(lines, ctx) { for (const l of lines) must(await logHas(l), `${ctx}: falta en el log «${l}»`); }
async function expectNoLog(lines, ctx) { for (const l of lines) must(!(await logHas(l)), `${ctx}: sobra en el log «${l}»`); }

/** Ejecuta `start` (código del juego) a velocidad normal y hace una captura cuando aparece en el log cada texto de
 *  `marcas` ([texto, nombre]); entre marca y marca adelanta los globos. Al final vuelve al modo rápido. */
async function capturar(start, marcas, arg) {
  if (!capturas) { await G(start, arg); await idle(); return; }
  await G(() => { __game.skipText(false); });
  await G(start, arg).catch(() => {});
  for (const [txt, name, extra] of marcas) {
    const t0 = Date.now();
    while (!(await logHas(txt))) {
      if (Date.now() - t0 > 60000) throw new StepFail(`captura ${name}: no aparece «${txt}»`);
      await G(() => __game.skipSpeech());
      await page.waitForTimeout(90);
    }
    await page.waitForTimeout(extra ?? 450);
    const f = path.join(here, 'shots', `e2-p1-${name}.png`);
    await page.screenshot({ path: f });
    shots.push(f);
  }
  await G(() => { __game.skipText(true); });
  await G(() => { const g = __game.game; if (g.card) g.card.resolve(); });
  await idle();
}

try {
  await page.goto(base);
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) { /* ignore */ } });
  await page.reload();
  await page.waitForFunction(() => !!window.__game, null, { timeout: 30000 });
  await G(() => __game.skipText(true));
  await R.startDismisser();
  console.log('P1 · Vestíbulo, Sistemas y final (plan de comedia + ENMIENDA E2)\n');

  // ------------------------------------------------------------ intro y bloqueos
  await G(() => __game.newGame()); await idle();
  let st = await state();
  must(st.room === 'vestibulo' && st.flags.intro_vista === true, 'intro: no acaba en el vestíbulo con intro_vista');
  must(await logHas('¿Tú eres el nuevo?'), 'intro: Celestino no dice «¿Tú eres el nuevo?»');
  await expectNoLog(['A las 18:30 ya se ha ido casi todo el mundo.'], 'E2 §7.4 paso 1');
  must(!(await G(() => __game.log.some(l => l.who === 'bruno' && l.text === '...'))), 'E2 §7.4 paso 1: Bruno dice «...» en la intro');
  await clearLog();
  await verb('ir', 'ascensor_vestibulo');
  await expectLog(['Le saludo desde aquí. Por si acaso.'], 'ascensor bloqueado (§6.3)');
  await verb('hablar', 'torno'); await verb('abrir', 'torno'); await verb('hablar', 'logo_pared'); await verb('empujar', 'puerta_calle');
  await expectLog(['A los veinte, pita.', 'La mía dice «Pellizco».', 'Lo tomo como un sí.', 'mi abuela se entera antes que yo'], '§6.3 vestíbulo');
  ok('Intro, ascensor bloqueado y líneas nuevas de §6.3 (torno, logo, puerta)');

  // ------------------------------------------------------------ Celestino §5.1
  await clearLog();
  await hablar('celestino');
  must(!(await logHas('¿Tú eres el nuevo?')), 'E2 C1: la 1.ª conversación repite «¿Tú eres el nuevo?» de la intro');
  must(!(await G(() => __game.log.some(l => l.who === 'celestino'))), 'E2 §7.4 pasos 3-4: saludo de Celestino nada más acabar la intro');
  must(!(await opts()).some(o => o.includes('narrador automático')), 'Celestino: [7] sale antes del Acto II');
  for (const o of ['El torno no me deja pasar.', '¿Tiene algo para los nervios?', '¿Dónde hay café en esta casa?', '¿Algún cotilleo?',
    '¿Cómo va el Ibex?', '¿Y usted no se aburre aquí?', '¿Cómo se consigue una plaza de garaje?']) await opcion(o);
  must(!(await opts()).some(o => o.includes('nervios')), 'Celestino: la opción del chicle no desaparece');
  must(!(await opts()).some(o => o.includes('plaza de garaje')), 'E2 §7.6: «¿Cómo se consigue una plaza de garaje?» no es once');
  must((await opts()).some(o => o.includes('Ibex')), 'E2 §7.6: el Ibex debe seguir (rotativa)');
  await opcion('Nada, Celestino.');
  must(!(await opts()), 'Celestino: «Nada, Celestino.» no cierra');
  await expectFlags({ celestino_dio_chicle: true, celestino_pista_gertrudis: true, rep_05: true }, 'Celestino');
  await expectInv(['chicle'], [], 'Celestino');
  await expectLog(['¡Y nada! ¡No consta!', 'La web no tiene pared, chaval.', 'Desde el Mundial del 82.', '¡Algo trama el míster!',
    'Se saluda. Dale las buenas noches.', 'Nadie se las da. Yo sí. Por eso a mí me pone espuma.',
    '¡Jugada de ascensor! Gervasio, al de Mercados: «Que esto no salga de aquí».', '«Tranquilo: de aquí no sale ni el wifi»!',
    '¡Tres años sin hablarse! ¡Y el wifi sigue sin salir!', '¿El Ibex? ¿Me preguntas a mí por el Ibex?',
    'Treinta años en este mostrador y eres el primero.', '¡Partidazo!', 'Pero se entrena mucho.', '¡Y el chaval se retira al vestuario sin marcar!'], 'Celestino §5.1 + E2 L1-L3');
  await expectNoLog(['Porque aquí no sale.', '¡No oigo el final!', '¿En treinta años?', 'Desde 2019'], 'E2 L1-L3');
  // E2 §7.4 pasos 3-4: el saludo solo tras ≥ 2 entradas en la sala desde el último (aquí, desde la intro)
  await clearLog(); await hablar('celestino'); await closeDialog();
  must(!(await G(() => __game.log.some(l => l.who === 'celestino'))), 'E2 pasos 3-4: saludo en dos diálogos seguidos');
  await goto('pecera', 'vestibulo'); await goto('vestibulo', 'pecera');
  await clearLog(); await hablar('celestino'); await closeDialog();
  must(!(await logHas('¡Vuelve el chaval')), 'E2 pasos 3-4: saludo tras una sola entrada');
  await goto('pecera', 'vestibulo'); await goto('vestibulo', 'pecera');
  await clearLog(); await hablar('celestino'); await closeDialog();
  await expectLog(['¡Vuelve el chaval al vestíbulo! ¡Sin balón, pero con ganas!'], 'Celestino: saludo tras dos entradas');
  await clearLog(); await hablar('celestino'); await closeDialog();
  must(!(await logHas('¡Vuelve el chaval')) && !(await logHas('pisa más área')), 'E2 pasos 3-4: saludo repetido sin entradas');
  must(!(await logHas('¿Tú eres el nuevo?')), 'Celestino: «¿Tú eres el nuevo?» se repite');
  ok('Celestino §5.1 + E2: L1-L3, sin «¿Tú eres el nuevo?» repetido (C1), saludo cada ≥ 2 entradas, plaza once (§7.6)');

  // ------------------------------------------------------------ torno + hito
  await verb('usar', 'tarjeta_becario', 'chicle');
  await clearLog();
  await capturar(() => { __game.doVerb('usar', 'organigrama', 'tarjeta_becario'); },
    [['Me parece justo.', 'organigrama-resbala', 300]]);
  await expectLog(['Ya consto.', '...Un centímetro por debajo de donde la puse. Me parece justo.'], 'E2 L5');
  await expectFlags({ foto_en_organigrama: true, vestibulo_foto_resbalo: true }, 'E2 L5');
  await clearLog();
  await verb('usar', 'torno', 'tarjeta_becario');
  await expectFlags({ torno_abierto: true }, 'torno');
  await expectLog(['BIENVENIDO, VACANTE.', '...Vacante. Bueno. Es un cargo.'], 'torno');
  await expectNoLog(['¡Vacante supera al torno!', 'Celestino, el Ibex.', 'El Ibex está plano'], 'E2 fase B (8): sin retransmisión del torno (ni L4)');
  await goto('pecera', 'vestibulo'); await clearLog(); await goto('vestibulo', 'pecera');
  must(!(await logHas('¡Vacante supera al torno!')), 'E2 fase B (8): el hito del torno se narra al volver');
  await verb('mirar', 'pantalla_ibex');
  await expectLog(['Celestino grita «¡uy!» en cada rojo.'], 'E2 L6');
  await give('cafe'); await clearLog(); await verb('dar', 'celestino', 'cafe');
  await expectLog(['Gertrudis y yo somos solo amigos.'], 'E2 L7');
  ok('E2: L5 (la foto resbala), torno sin retransmisión de Celestino ni L4 (fase B (8)), L6, L7');

  // ------------------------------------------------------------ rumor A1 sí, rumor D no
  await hablar('planta_plastico');
  await setFlag('rumor_plaza_n', 3);
  await clearLog(); await hablar('celestino'); await closeDialog();
  await expectFlags({ rumor_firma_n: false, planta_oyo: false, vestibulo_planta_oyo: true }, 'E2 fase B (1)');
  await expectNoLog(['¡Me informa la planta!', 'Y yo oigo a la planta.', 'Las plazas dejan a la gente'], 'E2 fase B (1): rumor A fuera');
  await clearLog(); await verb('mirar', 'planta_plastico');
  await expectLog(['La de la oreja.'], 'ficus (flag local)');
  for (let i = 0; i < 3; i++) await verb('mirar', 'cuadro_plazas');
  await expectLog(['«Plaza 3: Ramírez. Libre. Ocupada por su ausencia».', '«Sucesión plaza 3: Maripaz, Yoli, el ficus y el móvil de Borja».'], 'E2 §8 y §3.3 (plazas)');
  ok('E2 fase B (1): sin rumor A (la planta ya no pone planta_oyo); plazas 3 de §3.3 y §8');

  // ------------------------------------------------------------ torno viral (4.1)
  await setFlag('cafetera_viral');
  await clearLog();
  await capturar(() => { __game.doVerb('hablar', 'torno'); },
    [['GRACIAS POR PREGUNTAR.', 'torno-viral']]);
  await expectLog(['Buenas noches, torno.', 'BUENAS NOCHES, VACANTE. GRACIAS POR PREGUNTAR.', 'No he preguntado nada.', 'YA. NADIE PREGUNTA.'], '4.1 torno');
  await clearLog(); await verb('hablar', 'torno');
  must(!(await logHas('GRACIAS POR PREGUNTAR')), '4.1: el torno viral se repite');
  ok('4.1: el torno saluda con la cafetera viral (una vez)');

  // ------------------------------------------------------------ hitos al entrar
  await setFlag('chaqueta_en_lector');
  await goto('pecera', 'vestibulo'); await clearLog(); await goto('vestibulo', 'pecera');
  await expectLog(['¡Buenas noches a la cafetera! ¡Juego limpio!'], 'hito al entrar (el más reciente)');
  must(!(await logHas('¡El chaval viste al Lector Medio!')), 'hitos: se narra uno viejo');
  await goto('pecera', 'vestibulo'); await clearLog(); await goto('vestibulo', 'pecera');
  must(await G(() => __game.log.some(l => l.who === 'celestino')), 'sin hito pendiente, Celestino no dice el Ibex');
  must(!(await logHas('¡Buenas noches a la cafetera!')), 'hitos: se repite el ya narrado');
  ok('§4.7: al entrar, el hito más reciente sin narrar; si no hay, el Ibex');

  // ------------------------------------------------------------ Sistemas: registro, Paco P0
  await setFlag('chisme_indice', 1);
  await goto('cpd', 'ascensor');
  await clearLog();
  await verb('mirar', 'registro_tickets');
  await expectFlags({ vio_ticket_3: true }, 'registro');
  await expectLog(['«Alta becario Rubén». Estado: pendiente.', '«Alta portátil de Infografía». Denegado.', 'Firmado: Anselmo.',
    '«El CMS se cuelga con la pantalla de la Redacción».', '«Va a la regleta R-3 de Sistemas. Apagarla».'], 'registro §4.2 [E1]');
  const atun0 = await flag('rumor_atun_n');
  await hablar('paco_ticket');
  must((await flag('rumor_atun_n')) === atun0, 'Paco: sigue contando el rumor B');
  await expectLog(['No atiendo. Tengo 312 tickets'], 'Paco sin CMS');
  must(!(await opts()).some(o => o.includes('fax')), 'Paco P0 ofrece el manual sin cms_vivo');
  const nTk = await flag('paco_tickets');
  for (const o of ['¿Y por qué no va?', '¿Tú eres el de Sistemas?', '¿Cuándo fue la última vez que viste el sol?', '¿Me abres un ticket a mí? Para existir.',
    '¿Qué hay en el armario 27?', '¿Escuchas por la rejilla?']) await opcion(o);
  await opcion('Me voy.');
  await expectLog(['Nadie lo lee.', `${miles(nTk)}. Es tu número. Tiene más identidad que tú.`, 'En 2011. Sigo en cola.',
    'Ya tienes uno. El 31.207: «Becario sin alta definitiva».', 'Es el más estable que tengo.',
    'Ticket 48.100: «Armario 27, mastica».', 'Escuchar sería abrir un ticket.', 'Cierra al salir. La puerta, no el servidor.'], 'Paco P0 §5.7 + E2 B10, §8, fase B (13)');
  await expectNoLog(['Ticket propio', 'Esa es un servidor.'], 'E2 Paco P0');
  await clearLog(); await hablar('paco_ticket'); await opcion('Me voy.');
  await expectNoLog(['Cierra al salir.', 'Estado: atendiendo', 'Otra vez tú.'], 'E2 §7.2 / pasos 21-22: despedida una vez, sin saludo de relleno');
  await verb('mirar', 'regleta_r3'); await verb('abrir', 'armarios'); await verb('empujar', 'ventilador'); await verb('mirar', 'libro_visitas');
  await verb('usar', 'ventilador'); await verb('abrir', 'libro_visitas');
  await expectLog(['«PANTALLA DE MÉTRICAS. NO TOCAR».', 'Letra de Paco.', 'El 27 mastica.', 'Pesa más que el ventilador.', 'Libro de visitas de Sistemas',
    'Nadie sabe dónde está el botón. Paco no pregunta.', 'Por la misma página. Con la esquina doblada.'], '§6.3 Sistemas + E2 §8');
  ok('Sistemas: registro (nº 2 de Anselmo) → vio_ticket_3; Paco P0 con la cifra del contador (B10), despedida nueva; §8');

  // ------------------------------------------------------------ la regleta (paso 20)
  const t0 = await flag('paco_tickets');
  await clearLog();
  await capturar(() => { __game.doVerb('tirar', 'regleta_r3'); },
    [['¡ESTAMOS CIEGOS!', 'regleta-rejilla'], ['Tengo un hueco. Uno.', 'regleta-paco']]);
  await expectFlags({ cms_vivo: true, cpd_cms_sumado: true }, 'regleta');
  must((await flag('paco_tickets')) === t0 + 318, `regleta: el contador no salta +318 (${await flag('paco_tickets')})`);
  must((await objState('regleta_r3')) === 'apagada', 'regleta: estado apagada');
  await expectLog(['CORO: ¡Ha sido Diseño!', 'He sido yo. Pero gracias.', 'Trescientos dieciocho tickets nuevos.',
    'Ya me han abierto otro ticket para saber por qué.', 'Tengo un hueco. Uno. ¿Qué querías?'], 'regleta §4.2 + E2 paso 20');
  await expectNoLog(['Manda el más antiguo.', 'Se ha arreglado el CMS. Nadie sabe cómo.', 'Ya me han abierto un ticket para saberlo.'], 'E2 §7.2 / paso 20');
  must((await logWho('¡ESTAMOS CIEGOS!')) === 'yoli_tendencias', 'regleta: la voz de la rejilla no es de Yoli');
  await goto('vestibulo', 'cpd'); await goto('cpd', 'vestibulo');
  must((await flag('paco_tickets')) === t0 + 318 + 1, 'regleta: el +318 se suma dos veces');
  await clearLog();
  await hablar('paco_ticket');
  must(!(await logHas('Se ha arreglado el CMS')), 'Paco repite «Se ha arreglado el CMS» tras la escena');
  must(!(await opts()).some(o => o.includes('Herminia')), 'MP1 sin anselmo_dijo_regla');
  await opcion('¿Sabes algo del fax de la Redacción de papel?');
  await opcion('¿Algún cotilleo del consultor?');
  await opcion('¿Te escribe mucho Tadeo?');
  await opcion('¿Se ha caído el wifi?');
  await opcion('Me voy.');
  await expectFlags({ paco_dio_manual: true, rep_12: true }, 'Paco P1');
  await expectInv(['manual_fax'], [], 'Paco P1');
  await expectLog(['Ticket 0.441, de 1999.', 'Es mi mejor empleada.', 'Ahora se ve perfectamente que no hay carretera.', 'Hacen buena pareja.',
    'Has dejado de merecerlo.'], 'Paco P1');
  await expectNoLog(['Menú 9.', 'Estado: atendiendo'], 'E2 paso 21');
  ok('Paso 20: Tirar regleta_r3 → cms_vivo, rejilla (Yoli, coro), +318, Paco se gira; P1 con manual y R12 nueva');

  // ------------------------------------------------------------ rejilla (§4.7)
  await setFlag('acto_2_iniciado'); await setFlag('reunion_terminada');
  await clearLog();
  await capturar(() => { __game.doVerb('usar', 'rejilla_cpd'); },
    [['¡Desbandada en la Sala Amazonas!', 'rejilla-hito']]);
  must((await logWho('¡Desbandada en la Sala Amazonas!')) === 'celestino', 'rejilla: el hito no lo narra Celestino');
  await clearLog();
  for (let i = 0; i < 6; i++) await verb('usar', 'rejilla_cpd');
  await expectLog(['¡Vacante encara la planta 2!', 'Es mi primera cobertura nacional.', 'Lo sé desde el chicle.', 'Original. Duplicado.'], 'rejilla, rotación');
  must(!(await logHas('¡Desbandada')), 'rejilla: repite el hito');
  ok('Rejilla: retransmite el hito pendiente; rotación con la cobertura de Celestino (Acto II)');

  // ------------------------------------------------------------ MP1 · P_ALTA [E1.5]
  await setFlag('acto_3_iniciado'); await setFlag('anselmo_dijo_regla');
  await clearLog();
  await hablar('paco_ticket');
  const nAlta = await flag('paco_tickets');
  await opcion('¿Me das de alta a una becaria? Se llama Herminia.');
  must((await flag('paco_tickets')) === nAlta + 1, 'E2 B10: el ticket del alta no sube el contador');
  await opcion('Persona.');
  must((await opts()).some(o => o === 'Herramienta.'), 'P_ALTA: «Persona.» no vuelve al nodo');
  await opcion('Mejor no.');
  must(!(await flag('herminia_de_alta')), 'P_ALTA: «Mejor no.» da el alta');
  await expectLog([`Ticket ${miles(nAlta + 1)}: «Alta becaria Herminia». ¿Persona o herramienta?`, 'Detrás del nº 1, que es de julio.', 'Total, uno más.'], 'P_ALTA (E2 B10)');
  ok('MP1: P_ALTA con «Persona.» (vuelve) y «Mejor no.» (sale sin alta)');

  // ------------------------------------------------------------ revelación de Rubén (4.6, paso 35)
  await setFlag('vio_borde_perforado');
  await setFlag('evaristo_escuchado');                                        // E2 §5.4 (lo pone P3 en el paso 28)
  await clearLog();
  await verb('mirar', 'papel_continuo');
  await expectLog(['El mismo borde que el fax de F.P.'], 'pista del papel');
  await G(() => {
    const g = __game.game; window.__probe = [];
    g.__speakOrig = g.speak.bind(g);
    g.speak = (who, text, opts) => {
      const r = g.actors.ruben;
      window.__probe.push({ who, text, style: opts && opts.style, armario: g.getObjState('armario_27', 'cpd').state, ruben: r.room === 'cpd' && r.visible ? [Math.round(r.x), Math.round(r.y)] : null });
      return g.__speakOrig(who, text, opts);
    };
  });
  await capturar(() => { __game.doVerb('tirar', 'papel_continuo'); },
    [['Plano detalle: ARMARIO 27', 'ruben-primer-plano', 1400], ['BECARIO DETECTADO.', 'ruben-titular'], ['FACTURA COMO UN BANCO', 'bruno-titular'],
      ['...Ya hablo como tú.', 'bruno-contagiado'], ['Esa coma la conozco.', 'armario-coma'], ['tablero de Anselmo', 'armario-anselmo']]);
  const probe = await G(() => { const g = __game.game; g.speak = g.__speakOrig; delete g.__speakOrig; return window.__probe; });
  const grito = probe.find(p => p.text === '¡EH! ¡QUE ES MI BORRADOR!'), primera = probe.find(p => p.text.startsWith('BECARIO DETECTADO'));
  must(grito && grito.armario === 'cerrado' && !grito.ruben, `4.6: al gritar, armario cerrado (${JSON.stringify(grito)})`);
  must(primera && primera.armario === 'abierto' && primera.ruben && primera.ruben[1] < 100 && primera.style === 'titular', `4.6: 1.ª línea de Rubén, titular y dentro (${JSON.stringify(primera)})`);
  const tras = probe.slice(probe.indexOf(primera) + 1);
  must(tras.length > 10 && tras.every(p => p.armario === 'abierto' && p.ruben && p.ruben[1] >= 104), '4.6: el resto, armario abierto y Rubén fuera');
  must(probe.filter(p => p.style === 'titular' && p.who === 'bruno').length === 2, '4.6: Bruno no dice sus dos titulares');
  await expectFlags({ ruben_encontrado: true }, '4.6');
  await expectLog(['Plano detalle: ARMARIO 27', '«EL TITULATOR ERA UN CHAVAL»: LA VERDAD QUE NADIE TE CUENTA.', 'Del verano pasado.',
    'Yo pensé que era un contrato.', 'EL 4 TE SORPRENDERÁ', '...Ya hablo como tú.', 'Eras lo único que pasaba.',
    'A mí, en bocadillos de atún. A Íñigo le pagan por mí 48.000 al mes.', 'Cuarenta y ocho mil. Con coma. Esa coma la conozco.',
    'la impresora de Íñigo sale aquí.', 'Mi baja es un pósit en el tablero de Anselmo. En POR HACER.',
    'Y Anselmo no mueve un pósit sin pruebas de que existo.', 'Bueno, una. En Eventos. Al fondo.', '¿Me traes un táper, ya que vas?'], '4.6 + E2 §5.4');
  await expectNoLog(['Nemesio', 'Seis años en la web. Se pega.', 'Entonces el nuevo soy yo.', 'Qué ilusión.', '¿Tú eres el nuevo?', 'Bocadillos de máquina',
    '¿Lo has hecho tú?', '¿Cuál es el 4?'], 'E2 armario (§7.2, §7.4 paso 37, fase B (10))');
  await clearLog(); await verb('tirar', 'ruben');
  await expectLog(['Y el pósit es de Anselmo.'], 'E2 §2.6.5 (cpd.js:477)');
  must((await roomOf('ruben')) === 'cpd' && (await objState('armario_27')) === 'abierto', '4.6: Rubén en Sistemas con el armario abierto');
  await goto('vestibulo', 'cpd'); await goto('cpd', 'vestibulo');
  must(!(await logHas('¡Sale un chaval del banquillo')), 'E2 fase B (8): Celestino retransmite el hallazgo de Rubén');
  ok('4.6 + E2: grito → armario → primer plano → titulares; los 48.000 y la coma (§5.4), tablero de Anselmo; sin retransmisión');

  // ------------------------------------------------------------ árbol de Rubén §5.12 + táper (4.4) + MP1 con Rubén
  await clearLog();
  await hablar('ruben');
  await opcion('¿Escribiste tú los discursos de Íñigo?');
  await opcion('¿Te llegaban correos de Tadeo?');
  await opcion('¿Qué es lo primero que vas a hacer fuera?');
  await opcion('¿Y el táper?');
  await opcion('Ahora vuelvo.');
  await expectFlags({ rep_13: true, rep_15: true, taper_dado: false }, 'Rubén R0');
  await expectLog(['«NO ES UN DESPIDO: ES UNA SALIDA EN VALOR».', 'newsletter personalizada', 'La IA era yo.', 'Me lo ha contado ella. Se llama Rubén.',
    'Comer algo que no sea atún.', '¿TRAES TÁPER?', 'BECARIO PROMETE VOLVER.'], 'Rubén §5.12');
  await give('taper_huerfano');
  await clearLog();
  await capturar(() => { __game.doVerb('dar', 'ruben', 'taper_huerfano'); }, [['TÁPER DETECTADO', 'taper']]);
  await expectFlags({ taper_dado: true }, '4.4 táper');
  await expectInv([], ['taper_huerfano'], '4.4 táper');
  await expectLog(['LO QUE HIZO ESTE BECARIO TE EMOCIONARÁ.', 'Ni la baja.', 'Para que dure.'], '4.4 táper');
  await clearLog();
  await hablar('paco_ticket');
  await opcion('¿Me das de alta a una becaria? Se llama Herminia.');
  await capturar(() => { __game.chooseText('Herramienta.'); }, [['Esta casa da de alta antes', 'alta-paco'], ['¿CUARENTA SEGUNDOS?', 'alta-herminia']]);
  await closeDialog();
  await expectFlags({ herminia_de_alta: true, cpd_ruben_oyo_alta: true }, 'MP1');
  await expectLog(['Herramientas, por el otro circuito. El rápido.', '«Herminia. Becaria de Desarrollo. Herramienta.» Estado: de la casa.',
    'Esta casa da de alta antes a un portátil que a un chaval.', 'Yo también soy herramienta. Sin pegatina.'], 'MP1 E1.5 + E2 L16');
  must((await logWho('Esta casa da de alta antes')) === 'paco_ticket', 'E2 L16: la línea no la dice Paco');
  await expectNoLog(['Lo apunto en «injusticias».', 'Me lo apunto.'], 'E2 §7.2 / L16');
  ok('Rubén §5.12: rep_13, rep_15 (R15 nueva), táper → taper_dado; MP1 «Herramienta.» → herminia_de_alta con Rubén');

  // ------------------------------------------------------------ ruben_libre (lo pone P2) → Paco y armario vacío
  await setFlag('ruben_libre');
  await goto('vestibulo', 'cpd'); await goto('cpd', 'vestibulo');
  must((await objState('armario_27')) === 'vacio' && (await roomOf('ruben')) !== 'cpd', 'ruben_libre: armario vacío y sin Rubén');
  await clearLog(); await hablar('paco_ticket'); await closeDialog();
  await expectLog(['Ticket nº 1: cerrado. Por el tablero. Sin subir.', 'Es lo mejor que me ha pasado en la vida.'], 'Paco: ticket nº 1');
  await clearLog(); await hablar('paco_ticket'); await closeDialog();
  must(!(await logHas('Ticket nº 1: cerrado.')), 'Paco: repite lo del ticket nº 1');
  ok('ruben_libre: Paco celebra el ticket nº 1 (una vez); armario vacío');

  // ------------------------------------------------------------ final §9 (modo rápido, versión con todo)
  for (const f of ['duelo_inigo_ganado', 'lector_derribado', 'correo_evaristo_listo', 'sala_abierta', 'pagina_cerrada', 'cafetera_viral']) await setFlag(f);
  await setFlag('rumor_firma_n', 4);                                           // partida antigua: el rumor A ya no sale (fase B (1))
  await goto('sala_amazonas', 'pajarera');
  await clearLog();
  await G(() => __game.scene('final'));
  st = await state();
  must(st.mode === 'title' && st.finished, `final: no llega al título (modo ${st.mode})`);
  must(st.finished.flags.juego_terminado === true, 'final: sin juego_terminado');
  must(st.finished.room === 'vestibulo', `final: acaba en ${st.finished.room} (debe acabar en el vestíbulo, sin poscréditos)`);
  must(st.finished.objects['vestibulo.cuadro_plazas'] && st.finished.objects['vestibulo.cuadro_plazas'].state === 'tachado', 'final: el cuadro no queda tachado');
  const orden = ['Sábado, 6:00.', '¡Y sale el consultor por la banda!', '¡Te dejaste la taza!',
    'Fui un perfil junior con mucho recorrido.', 'Saliste por esa puerta con un táper.', '...Me la quedo.', 'Me fui. Y volví facturando.',
    'Suerte, Bruno.', '¡Todavía manchan!', 'Bien escrito. Bruno. Pellejo. Con jota y dos eles.', '¡Eso es opa, árbitro!', 'No. Soy Bruno Pellejo.',
    'Ya te ve hasta el torno.', 'Página 7. Tu noticia, entera. Ni un anuncio. Me ha dolido, cariño.',
    'Aunque mira: entre línea y línea todavía cabía un banner.', 'Es papel. No se le puede hacer clic.', 'Eso te lo arreglo con un pop-up. De cartulina.',
    'Pellejo. Lo he revisado en el periódico. Con jota y dos eles.', 'Gracias, don Evaristo.', '...Felicidades. Es la primera vez que lo digo sin adjunto.',
    'Buenos días. ¿Me he perdido algo?', 'Del desayuno más largo', 'Con el Lector Medio.',
    'De la Redacción de papel. Para ti.', 'QUE NADIE ME DESEE NADA.', 'Ni bici.',
    'La portada dura nueve.', 'Una. Pero se lo lee TODO. La he puesto de objetivo de empresa.', 'gracias por sacarme',
    '¿Has comido?', 'Te pongo un corazoncito.', 'Y te pongo «abrígate». Que nunca contestas.', 'Bruno Pellejo ha respondido: «Abrígate tú.»',
    '¡Me ha contestado el periódico!', 'FE DE ERRATAS / En la edición de ayer, donde decía / «inteligencia artificial» / debía decir «Rubén».'];
  const pos = await G(o => { const L = __game.log.map(l => l.text); return o.map(s => L.findIndex(t => t.includes(s))); }, orden);
  pos.forEach((p, i) => must(p >= 0, `final: falta «${orden[i]}»`));
  pos.forEach((p, i) => must(i === 0 || p > pos[i - 1], `final: «${orden[i]}» fuera de orden`));
  must(await G(() => { const L = __game.log; const i = L.findIndex(l => l.who === 'tarjeta'); return i >= 0 && L.slice(i + 1).every(l => l.who !== 'ramirez' && !/BANDEJA/.test(l.text)); }), 'final: hay algo tras la fe de erratas');
  await expectNoLog(['Diseño', 'Infografía', 'Herminia', 'TODA LA REDACCIÓN', 'BANDEJA 2', 'Catacumba'], 'final sin Diseño / Infografía / poscréditos');
  await expectNoLog(['¿Sigue gobernando el mismo?', 'Qué bien suena', 'beca en Mercados', 'Lo estamos hablando', 'se retiran los dos',
    '¿Y qué ha decidido?', 'Que la rotativa no se apaga.', 'Siempre fue muy sensata.', 'La línea de sucesión', 'KPI', 'Ese chico está flaco',
    '¿En todo?', 'Euríbor', 'muy bonito', 'eres el dueño', 'Hidrovoltia lanza una opa sobre Banco Robledal', 'Le escribiré un correo para felicitarle',
    '¿Y si me lo dice ahora?'], 'E2: recortes del epílogo (fase B (1), (5), (10)-(12), (16), (17); §7.4; B9; §5.8)');
  must((await G(() => __game.log.filter(l => l.who === 'celestino' && l.text === '¿Tú eres el nuevo?').length)) === 1, 'final: «¿Tú eres el nuevo?» ×1 en el epílogo (E2 fase B (10))');
  must(!(await G(() => __game.log.some(l => l.who === 'gervasio_acta'))), 'E2 fase B (5): Gervasio habla en el epílogo');
  must((await logWho('Me ha dolido, cariño.')) === 'maripaz_remitido', 'E2 §4.5: la línea del periódico no es de Maripaz');
  ok('Final §9 + E2 (con todo): Íñigo abre, Maripaz y su banner, Evaristo en tres, Ramírez, Yoli, abuela → «Abrígate tú.» → tarjeta → créditos');

  // versión mínima
  await G(() => __game.newGame()); await idle();
  for (const f of ['torno_abierto', 'duelo_inigo_ganado', 'lector_derribado', 'ruben_libre']) await setFlag(f);
  await clearLog();
  await G(() => __game.scene('final'));
  must(await G(() => !!(__game.state().finished && __game.state().finished.flags.juego_terminado)), 'final mínimo: falta juego_terminado');
  await expectNoLog(['eres el dueño', 'Ese chico está flaco'], 'final mínimo');
  await expectLog(['De cartulina.', 'Es la primera vez que lo digo sin adjunto.', '¿Me he perdido algo?', 'Lamentamos el acierto.', '¡Me ha contestado el periódico!'], 'final mínimo');
  ok('Final §9 (mínimo): Maripaz, Evaristo (siempre, E2 §5.8), Ramírez y la fe de erratas');

  // ------------------------------------------------------------ final a velocidad normal: capturas y créditos
  if (capturas) {
    await G(() => __game.newGame()); await idle();
    for (const f of ['torno_abierto', 'duelo_inigo_ganado', 'lector_derribado', 'ruben_libre', 'correo_evaristo_listo', 'cafetera_viral', 'chaqueta_en_lector']) await setFlag(f);
    await clearLog();
    await G(() => __game.skipText(false));
    G(() => { __game.game.runScript(api => api.scene('final'), { label: 'final (test)' }); });
    const marcas = [['¡Te dejaste la taza!', 'final-taza'], ['Plano detalle: PÁGINA 7', 'final-pagina7', 900], ['Ya te ve hasta el torno.', 'final-bienvenido'],
      ['Me ha dolido, cariño.', 'final-maripaz'], ['No se le puede hacer clic.', 'final-maripaz-banner', 200], ['De cartulina.', 'final-maripaz-popup'],
      ['sin adjunto', 'final-evaristo'], ['¿Me he perdido algo?', 'final-ramirez'], ['Ni bici.', 'final-plaza'], ['objetivo de empresa', 'final-yoli'],
      ['Que nunca contestas.', 'final-abuela'], ['ha respondido: «Abrígate tú.»', 'final-abrigate-tu'], ['¡Me ha contestado el periódico!', 'final-periodico']];
    for (const [txt, name, extra] of marcas) {
      const t1 = Date.now();
      while (!(await logHas(txt))) {
        if (Date.now() - t1 > 60000) throw new StepFail(`final: no aparece «${txt}»`);
        await G(() => __game.skipSpeech()); await page.waitForTimeout(90);
      }
      await page.waitForTimeout(extra ?? 450);
      const f = path.join(here, 'shots', `e2-p1-${name}.png`); await page.screenshot({ path: f }); shots.push(f);
    }
    // la tarjeta: fija, espera al clic tras 6 s
    const t2 = Date.now();
    while (!(await G(() => !!__game.game.card))) {
      if (Date.now() - t2 > 30000) throw new StepFail('final: no sale la tarjeta de la fe de erratas');
      await G(() => __game.skipSpeech()); await page.waitForTimeout(120);
    }
    await page.waitForTimeout(800);
    let f = path.join(here, 'shots', 'e2-p1-fe-de-erratas.png'); await page.screenshot({ path: f }); shots.push(f);
    const clic = async () => { const p = await G(() => __game.virtualToClient(160, 100)); await page.mouse.click(p.x, p.y); };
    await clic(); await page.waitForTimeout(300);
    must(await G(() => !!__game.game.card), 'tarjeta: se cierra antes de 6 s');
    await page.waitForTimeout(6200);
    f = path.join(here, 'shots', 'e2-p1-fe-de-erratas-clic.png'); await page.screenshot({ path: f }); shots.push(f);
    await clic(); await page.waitForTimeout(400);
    must((await state()).mode === 'ending', 'tras la tarjeta no salen los créditos');
    const lines = await G(() => __game.game.ending.lines.map(l => l.t));
    for (const l of ['Una aventura de cierre', 'Asignado a: quien no se escaqueó', 'Asignado a: Gertrudis. Se lo había ganado.',
      'Asignado a: don Evaristo Salvedad. Leyó hasta el final.', 'Asignado a: el móvil de Borja. Lo publicó a las nueve.',
      'Atrezo. Focus group 2014. Asintió.', 'Gracias por jugar.', 'Abrígate.']) must(lines.includes(l), `créditos: falta «${l}»`);
    must(!lines.some(l => /Borja Engagement/.test(l)), 'créditos: sale Borja Engagement (E2 §3.3)');
    must(!lines.some(l => /Diseño|Infografía|Valentín|Herminia/.test(l)), 'créditos: sale Diseño, Infografía, Valentín o Herminia');
    const lineH = 13, speed = await G(() => __game.game.ending.def.speed);
    const im = lines.findIndex(l => l.startsWith('Asignado a: un secuenciador'));
    for (const [k, py] of [['creditos-1', null], ['creditos-aurora', 40], ['creditos-final', 'fin']]) {
      const t = py === null ? 3500 : py === 'fin' ? (200 + lines.length * lineH) / speed * 1000 + 2500 : ((im + 1) * lineH + 6 + 200 - py) / speed * 1000;
      await G(t => { __game.game.ending.t = t; }, t); await page.waitForTimeout(200);
      f = path.join(here, 'shots', `e2-p1-${k}.png`); await page.screenshot({ path: f }); shots.push(f);
    }
    for (let i = 0; i < 6 && (await state()).mode === 'ending'; i++) { await clic(); await page.waitForTimeout(600); }
    must((await state()).mode === 'title', 'tras los créditos no vuelve al título');
    await G(() => __game.skipText(true));
    ok('Final a velocidad normal: capturas del epílogo, tarjeta fija ≥ 6 s con clic, créditos cortos → título');
  }

  const errs = await G(() => __game.errors.filter(e => !e.warn).map(e => e.msg));
  must(!errs.length, 'errores del motor: ' + errs.join(' | '));
  ok('Sin errores del motor');
} catch (e) {
  failed = e instanceof StepFail ? e.message : (e && e.stack || String(e));
}

if (failed) {
  const log = await G(() => __game.log.slice(-8).map(l => `${l.who || '—'}: ${l.text}`)).catch(() => []);
  console.log(`\n  ✗ FALLO: ${failed}`);
  if (log.length) console.log('    últimas líneas:\n      ' + log.join('\n      '));
  try { await page.screenshot({ path: path.join(here, 'shots', 'e2-p1-fallo.png') }); } catch (_) { /* ignore */ }
}
if (shots.length) console.log(`\nCapturas (${shots.length}): tools/shots/e2-p1-*.png`);
if (consoleErrors.length) console.log('\nErrores de consola:\n  ' + consoleErrors.join('\n  '));
console.log(failed || consoleErrors.length ? '\nP1: FALLA' : `\nP1: OK (${n} comprobaciones)`);
await browser.close();
server.close();
process.exit(failed || consoleErrors.length ? 1 : 0);
