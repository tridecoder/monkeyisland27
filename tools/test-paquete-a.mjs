#!/usr/bin/env node
// Test del PAQUETE A (vestíbulo + CPD + intro 7.1 + revelación 7.3 + final 7.5 / créditos / poscréditos): juega la parte
// de A de principio a fin vía window.__game, simulando con setFlag / giveItem lo que viene de otros paquetes.
// Comprueba flags, objetos, presencia de PNJ, líneas clave del log, bloqueos y que no haya errores de consola/motor.
//   node tools/test-paquete-a.mjs            modo rápido (+ créditos y poscréditos en modo normal, acelerados)
//   node tools/test-paquete-a.mjs --lento    capturas en tools/shots/paqA-*.png
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from './serve.mjs';
import { createRunner, StepFail } from './walk-lib.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const lento = process.argv.includes('--lento');
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
const ok = (msg) => console.log(`  ✓ ${String(++n).padStart(2)} ${msg}`);
const must = (c, msg) => { if (!c) throw new StepFail(msg); };
const flag = (k) => G(k => __game.getFlag(k), k);
const setFlag = (k, v = true) => G(([k, v]) => __game.setFlag(k, v), [k, v]);
const give = (id) => G(id => __game.giveItem(id), id);
const verb = (v, t, i) => G(([v, t, i]) => __game.doVerb(v, t, i), [v, t, i || null]);
const idle = () => G(() => __game.waitIdle());
const logHas = (txt) => G(t => __game.log.some(l => String(l.text).includes(t)), txt);
const clearLog = () => G(() => __game.clearLog());
const roomOf = async (id) => { const a = (await state()).actors[id]; return a && a.visible !== false ? a.room : null; };
const goto = async (room, entry) => { await G(([r, e]) => __game.gotoRoom(r, e), [room, entry]); await idle(); };
const opts = () => G(() => __game.currentDialogOptions());
const shot = async (name, always = false) => { if (lento || always) await page.screenshot({ path: path.join(here, 'shots', `paqA-${name}.png`) }); };
async function hablar(id) { await verb('hablar', id); await idle(); }
async function opcion(t) { await chooseByText(t); await idle(); }
/** Ascensor con botonera: Usar el ascensor de la sala y pulsar la planta (texto del botón). */
async function ascensor(id, planta) { await verb('usar', id); must(!!(await opts()), `${id}: no abre la botonera`); await opcion(planta); }
async function expectFlags(obj, ctx) {
  for (const [k, v] of Object.entries(obj)) { const got = await flag(k); must(v === false ? !got : got === v, `${ctx}: flag ${k} = ${JSON.stringify(got)}, se esperaba ${JSON.stringify(v)}`); }
}
async function expectInv(tiene = [], notiene = [], ctx = '') {
  const inv = (await state()).inventory;
  for (const i of tiene) must(inv.includes(i), `${ctx}: falta ${i} en el inventario`);
  for (const i of notiene) must(!inv.includes(i), `${ctx}: ${i} sigue en el inventario`);
}
async function expectLog(lines, ctx) { for (const l of lines) must(await logHas(l), `${ctx}: falta en el log «${l}»`); }

try {
  await page.goto(base);
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) { /* ignore */ } });
  await page.reload();
  await page.waitForFunction(() => !!window.__game, null, { timeout: 30000 });
  await G(() => __game.skipText(true));
  await R.startDismisser();
  console.log('Paquete A · Vestíbulo + CPD + intro / revelación / final\n');

  // ------------------------------------------------------------ 7.1 intro
  await G(() => __game.newGame());
  await idle();
  let st = await state();
  must(st.room === 'vestibulo' && st.flags.intro_vista === true, 'intro: no acaba en el vestíbulo con intro_vista');
  await expectLog(['Viernes, 18:30. Cierre de la edición del sábado: 21:00.', 'Cero en papel.', 'Se te nota en la voz que no has comido.',
    'Lo he dicho en el grupo del pueblo. Abrígate.', 'USUARIO NO CONSTA EN ORGANIGRAMA.', 'Pues no te ha visto ni el torno.'], 'intro 7.1');
  must((await flag('celestino_ibex_n')) === 0 || (await flag('celestino_ibex_n')) == null, 'intro: el Ibex no debe sonar en la entrada inicial');
  ok('7.1 intro → intro_vista, en el vestíbulo, con la abuela, el LED y Celestino');

  // ------------------------------------------------------------ bloqueos sin torno_abierto
  await clearLog();
  await verb('ir', 'torno');
  must((await state()).room === 'vestibulo', 'el torno deja pasar sin torno_abierto');
  await verb('ir', 'ascensor_vestibulo');
  must((await state()).room === 'vestibulo', 'el ascensor deja pasar sin torno_abierto');
  await expectLog(['El ascensor está al otro lado del torno. Como todo lo bueno.'], 'bloqueo del ascensor');
  must(!(await opts()), 'sin torno_abierto el ascensor del vestíbulo no debe abrir la botonera');
  // geografía física: sin torno abierto, no hay camino del lado de la calle al ascensor ni a la escalera
  const geo = await G(() => {
    const g = __game.game, w = g.room.walk, L = g.room.def.layout, p = g.player;
    const reach = (pt) => { const path = w.findPath([p.x, p.y], pt); const e = path[path.length - 1] || [p.x, p.y]; return Math.hypot(e[0] - pt[0], e[1] - pt[1]) < 3; };
    const inBox = (id) => { const b = w.boxes.find(b => b.id === id); let ins = false; const P = b.poly; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { if ((P[i][1] > p.y) !== (P[j][1] > p.y) && p.x < (P[j][0] - P[i][0]) * (p.y - P[i][1]) / (P[j][1] - P[i][1]) + P[i][0]) ins = !ins; } return ins; };
    return { lift: reach(L.ascensor_vestibulo.walkTo), stairs: reach(L.vestibulo_a_redaccion.walkTo), x: p.x, y: p.y, street: inBox('entrada'), inner: inBox('interior'), gate: w.boxes.find(b => b.id === 'paso_torno').enabled };
  });
  must(!geo.lift && !geo.stairs && !geo.gate, `vestíbulo: con el torno cerrado se puede llegar al interior (${JSON.stringify(geo)})`);
  must(geo.street && !geo.inner, `vestíbulo: Bruno ha cruzado la línea de tornos sin abrirla (${JSON.stringify(geo)})`);
  await verb('usar', 'torno', 'tarjeta_becario');
  await expectLog(['Consto en la web. 4.112 veces.'], 'P01 sin foto');
  await verb('usar', 'organigrama', 'tarjeta_becario');
  await expectLog(['Se cae. Ni mi foto quiere estar en el organigrama.'], 'P01 sin chicle');
  await expectFlags({ torno_abierto: false, foto_en_organigrama: false }, 'bloqueos');
  ok('Bloqueos: torno y ascensor cerrados (sin camino físico al interior); tarjeta sin foto y sin chicle no cambian flags');

  // ------------------------------------------------------------ Mirar del organigrama (1.ª / siguientes)
  await clearLog();
  await verb('mirar', 'organigrama'); await verb('mirar', 'organigrama');
  await expectLog(['Un árbol genealógico en el que todos son primos', 'Con hueco de becario.'], 'Mirar organigrama');
  await verb('mirar', 'logo_pared'); await verb('mirar', 'logo_pared');
  await expectLog(['A la «e» le falta un tornillo.', 'Es lo más honesto que ha hecho nunca un periódico económico.'], 'Mirar logo (8.8)');
  ok('Mirar organigrama y logo: 1.ª vez y siguientes (8.8)');

  // ------------------------------------------------------------ P01: Celestino y el chicle
  await clearLog();
  await hablar('celestino');
  must((await opts()).some(o => o === 'El torno no me deja pasar.'), 'Celestino: falta «El torno no me deja pasar.»');
  await opcion('El torno no me deja pasar.');
  await opcion('¿Tiene algo para los nervios?');
  await opcion('¿Dónde hay café en esta casa?');
  await opcion('¿Algún cotilleo?');
  await opcion('¿Cómo va el Ibex?');
  await opcion('¿Cómo se consigue una plaza de garaje?');
  must(!(await opts()).some(o => o.includes('nervios')), 'Celestino: la opción del chicle no desaparece');
  await opcion('Nada, Celestino.');
  must(!(await opts()), 'el diálogo de Celestino no se cierra con «Nada, Celestino.»');
  await expectFlags({ celestino_dio_chicle: true, celestino_pista_gertrudis: true, rep_05: true }, 'Celestino');
  await expectInv(['chicle'], [], 'Celestino');
  await expectLog(['El torno se fía más del organigrama que de mí.', 'Dale las buenas noches. Nadie se las da.', 'de aquí no sale ni el wifi',
    '¡Ibersideral entra por la banda!', 'Hay dos formas: jubilarse o un «accidente».', 'Nada es lo que más entra por ese torno.'], 'Celestino');
  ok('Celestino C0: chicle, pista de Gertrudis, rep_05, Ibex, plaza de garaje (8bis), despedida');

  await verb('usar', 'torno', 'chicle');
  await expectLog(['Pegarlo en el organigrama, gestión.'], '8.1 chicle con torno');
  await verb('usar', 'tarjeta_becario', 'chicle');
  await expectFlags({ tarjeta_con_chicle: true }, 'P01b'); await expectInv([], ['chicle'], 'P01b');
  await verb('usar', 'organigrama', 'tarjeta_becario');
  await expectFlags({ foto_en_organigrama: true }, 'P01c');
  await verb('ir', 'torno');
  must((await state()).room === 'vestibulo', 'con la foto pero sin pasar la tarjeta el torno ya deja pasar');
  await verb('usar', 'torno', 'tarjeta_becario');
  await expectFlags({ torno_abierto: true }, 'P01d');
  must((await state()).room === 'vestibulo', 'P01d: Bruno no debe cruzar solo al abrir el torno');
  await expectLog(['BIENVENIDO, VACANTE.', '...Vacante. Bueno. Es un cargo.', 'Ya consto. Pegado con chicle'], 'P01');
  ok('P01: chicle → tarjeta_con_chicle → foto_en_organigrama → torno_abierto («BIENVENIDO, VACANTE.»)');
  await shot('01-vestibulo');

  // ------------------------------------------------------------ adenda vestíbulo
  await clearLog();
  await hablar('planta_plastico');
  await expectFlags({ planta_oyo: true }, 'X1');
  await verb('mirar', 'planta_plastico');
  await expectLog(['La de la oreja.'], 'Mirar planta con planta_oyo');
  for (let i = 0; i < 3; i++) await verb('empujar', 'planta_plastico');
  await expectFlags({ planta_empujada_n: 3 }, 'X2');
  await expectLog(['un micrófono de 1994', 'Esa planta lo oye todo.', 'De ahí saco los cotilleos de ascensor.', 'No quiero que me oiga empujar.'], 'Empujar planta');
  await hablar('celestino');
  await expectFlags({ rumor_firma_n: 1 }, 'X3 rumor A1');
  await expectLog(['Me ha dicho la planta que quieres firmar en papel.', '¡Hombre, Vacante!'], 'rumor A1');
  await closeDialog();
  await verb('mirar', 'rama_diseno'); await verb('usar', 'altavoz_ibex'); await verb('coger', 'altavoz_ibex');
  await expectLog(['Y colgando, mi foto.', 'El índice muestra una volatilidad moderada.', 'Sin alma.', 'Bajo la bufanda no molesta.'], 'X4');
  for (let i = 0; i < 6; i++) await verb('mirar', 'cuadro_plazas');
  await expectFlags({ cuadro_plazas_n: 6 }, 'X4b');
  await expectLog(['Doce plazas. Ciento doce aspirantes.', 'Ocupada por su ausencia', '«Vacante (bici)». Tachado.', 'Ni a desearle nada.'], 'cuadro de plazas');
  must(!(await logHas('Plaza 9: Optimal Brains')), 'cuadro de plazas: la 5.ª línea solo en el Acto III');
  await verb('coger', 'cuadro_plazas'); await verb('usar', 'cuadro_plazas', 'tarjeta_becario');
  await expectLog(['Las custodio yo.', 'ni plaza de bici'], 'cuadro de plazas: Coger / tarjeta');
  ok('Adenda vestíbulo: planta_oyo, micrófono (×3), rumor A1, rama de Diseño, altavoz, cuadro de plazas (8bis)');

  // ------------------------------------------------------------ CPD: contador, P05a, Paco sin CMS
  await clearLog();
  must(await G(() => __game.game.room.walk.boxes.find(b => b.id === 'paso_torno').enabled), 'torno_abierto: el carril del torno no se abre');
  await ascensor('ascensor_vestibulo', 'Planta -1');
  must((await state()).room === 'cpd', 'el ascensor no baja al CPD con torno_abierto');
  must((await roomOf('valentin_reticula')) !== 'cpd', 'Valentín sigue en el CPD (debe estar en la Pecera)');
  await expectFlags({ paco_tickets: 48212 }, 'contador (48.211 + 1)');
  await verb('mirar', 'contador_tickets');
  await expectLog(['TICKETS ABIERTOS: 48.212.'], 'contador');
  await verb('mirar', 'registro_tickets');
  await expectFlags({ vio_ticket_3: true }, 'P05a');
  await expectLog(['Ticket nº 3, 2017', 'Ticket nº 1, julio: «Alta becario Rubén». Pendiente.', 'Ticket nº 0, 1997'], 'registro');
  await hablar('paco_ticket');
  await expectFlags({ rumor_atun_n: 1 }, 'rumor B1');
  await expectLog(['Por la rejilla del 27 se oye masticar.', 'No atiendo. Tengo 312 tickets'], 'Paco P0');
  must(!(await opts()).some(o => o.includes('fax de la Catacumba')), 'Paco P0: ofrece el manual sin cms_vivo');
  await opcion('¿Qué hay en el armario 27?');
  await expectLog(['Imprime sola desde julio.'], 'P_27');
  await opcion('¿Escuchas por la rejilla?');
  await opcion('¿Y por qué no va?');
  must(!(await opts()), 'P0 «¿Y por qué no va?» debe cerrar el diálogo');
  await expectLog(['Si lo supiera, tendría 311.', 'Escuchar sería abrir un ticket.'], 'Paco P0');
  ok('CPD: contador 48.212, registro → vio_ticket_3, Paco P0 (rumor B1, armario 27, rejilla, ¿por qué no va?)');
  await shot('02-cpd');

  // ------------------------------------------------------------ CPD con cms_vivo: Paco P1 + MP1 + rumor D2
  await goto('vestibulo', 'cpd');
  await expectFlags({ celestino_ibex_n: 1 }, 'G3 Ibex al entrar');
  await setFlag('cms_vivo'); await setFlag('rumor_plaza_n', 1); await setFlag('leoncio_acepta_alta');
  await clearLog();
  await goto('cpd', 'vestibulo');
  await expectFlags({ paco_tickets: 48212 + 1 + 318 }, 'contador +318 tras cms_vivo');
  await give('cafe');
  await verb('dar', 'paco_ticket', 'cafe');
  await expectLog(['es un rumor.'], '8.1 café a Paco');
  await expectInv(['cafe'], [], 'el café a Paco no se gasta');
  await hablar('paco_ticket');
  await expectFlags({ rumor_plaza_n: 2 }, 'rumor D2');
  await opcion('¿Sabes algo del fax de la Catacumba?');
  await opcion('¿Algún cotilleo del consultor?');
  await opcion('Quiero dar de alta a una becaria.');
  await opcion('Persona.');
  await opcion('Quiero dar de alta a una becaria.');
  await opcion('Herramienta.');
  must(!(await opts()).some(o => o.includes('dar de alta')), 'MP1: la opción del alta no desaparece');
  await opcion('¿Te escribe mucho Tadeo?');
  await opcion('¿Se ha caído el wifi?');
  await opcion('Me voy.');
  await expectFlags({ paco_dio_manual: true, rep_12: true, herminia_de_alta: true }, 'Paco P1');
  await expectInv(['manual_fax'], [], 'Paco P1');
  await expectLog(['Se ha arreglado el CMS. Nadie sabe cómo.', 'Es mi mejor empleada.', 'no pasa la ITV', 'Mejor no. Por Herminia.',
    'Esta casa da de alta antes a un portátil que a un chaval.', 'Tengo una carpeta: «La IA dice».', 'Has dejado de merecerlo.',
    'Gervasio se va a vivir al garaje'], 'Paco P1');
  ok('Paco P1: manual_fax, rep_12, alta de Herminia (MP1), Tadeo, wifi, rumor D2, contador +318');

  // ------------------------------------------------------------ rejilla, ventilador, varios (Valentín: test-paquete-b, Pecera)
  await clearLog();
  for (let i = 0; i < 7; i++) await verb('usar', 'rejilla_cpd');
  await expectFlags({ rejilla_n: 7 }, 'rejilla');
  await expectLog(['Maripaz.', 'Original. Duplicado.', 'Amarillo, facturación.', 'También narra para el sótano.', 'Y alguien mastica.', 'Alguien más saluda a Gertrudis.'], 'rejilla');
  await verb('tirar', 'ventilador'); await verb('tirar', 'ventilador');
  await expectFlags({ profecia_leida: true }, 'profecía');
  await verb('tirar', 'papel_continuo');
  await expectFlags({ ruben_encontrado: false }, 'P13 sin Acto III');
  await expectLog(['Igual es la nómina.'], 'papel continuo antes del Acto III');
  await verb('abrir', 'armario_27');
  await expectLog(['SE ENFRÍA EL MODELO', 'que me factura.'], 'armario 27');
  ok('CPD: rejilla ×7, profecía, papel continuo bloqueado, armario 27 (sin Valentín ni su monitor)');

  // ------------------------------------------------------------ 7.3 revelación de Rubén (P13)
  await setFlag('acto_2_iniciado'); await setFlag('acto_3_iniciado'); await setFlag('vio_borde_perforado'); await setFlag('rumor_atun_n', 3);
  await clearLog();
  await verb('mirar', 'papel_continuo'); await verb('mirar', 'armario_27');
  await expectLog(['...Como el del fax de F.P.', 'Con faltas.'], 'pistas de P13');
  await verb('tirar', 'papel_continuo');
  await expectFlags({ ruben_encontrado: true }, 'P13');
  must((await roomOf('ruben')) === 'cpd', 'P13: Rubén no está en el CPD');
  await expectLog(['¡EH! ¡QUE ES MI BORRADOR!', 'BECARIO DETECTADO.', 'Eras lo único que pasaba.', 'Entonces el nuevo soy yo.',
    'Pero salgo al fondo. Yendo al baño.', '¿Me traes un táper, ya que vas?'], '7.3');
  await hablar('ruben');
  await expectLog(['Es atún. Del de máquina.'], 'desmentido B de Rubén');
  await opcion('¿Escribiste tú los discursos de Íñigo?');
  await opcion('¿Te llegaban correos de Tadeo?');
  await opcion('¿Cómo te encerró aquí Íñigo?');
  await opcion('¿Qué es lo primero que vas a hacer al salir?');
  await opcion('Ahora vuelvo.');
  await expectFlags({ rep_13: true }, 'Rubén R2');
  await expectLog(['newsletter personalizada', 'Somos un equipo.', 'SEGUIREMOS INFORMANDO.'], 'Rubén');
  await clearLog(); await hablar('ruben'); await closeDialog();
  must(!(await logHas('Es atún. Del de máquina.')), 'el desmentido B se repite');
  await verb('tirar', 'papel_continuo');
  await expectLog(['Ahora Rubén me abre él.'], 'papel continuo tras P13');
  ok('7.3 revelación: ruben_encontrado, Rubén en el armario, R0 (rep_13, Tadeo, desmentido B una vez)');
  await shot('03-revelacion');

  // ------------------------------------------------------------ P14c: la baja de Rubén
  await setFlag('posit_descopeado'); await give('posit_baja_ruben');
  await clearLog();
  await verb('dar', 'paco_ticket', 'posit_baja_ruben');
  await expectFlags({ ruben_libre: true }, 'P14c');
  await expectInv(['ticket_n1'], ['posit_baja_ruben'], 'P14c');
  await expectLog(['Me repugna, pero es reglamentario.', 'Estado: CERRADO.', 'El primer ticket que cierro en mi vida.', 'Voy a buscar una ventana.'], 'P_BAJA');
  must((await roomOf('ruben')) !== 'cpd', 'P14c: Rubén sigue en el CPD');
  await verb('mirar', 'armario_27');
  await expectLog(['Vacío. Huele a atún y a becario.'], 'armario vacío');
  must((await G(() => __game.objects().find(o => o.id === 'armario_27').state)) === 'vacio', 'armario_27: estado vacio');
  ok('P14c: Dar pósit a Paco → ticket_n1, ruben_libre; Rubén sale; armario vacío');

  // ------------------------------------------------------------ vestíbulo, Acto III: desmentido D, cuadro 5, Ibex III
  await setFlag('rumor_plaza_n', 3);
  await clearLog();
  await ascensor('ascensor_cpd', 'Planta 0');
  must((await state()).room === 'vestibulo', 'el ascensor del CPD no sube');
  must((await logHas('¡Prórroga!')) || (await logHas('¡El Robledal pide la hora!')), 'Ibex del Acto III: falta la línea de Celestino');
  await hablar('celestino');
  await expectLog(['Las plazas dejan a la gente. Cuando se jubilan.'], 'desmentido D');
  await closeDialog();
  await setFlag('cuadro_plazas_n', 4);
  await verb('mirar', 'cuadro_plazas');
  await expectLog(['«Plaza 9: Optimal Brains, hasta 2031».'], 'cuadro de plazas, Acto III');
  await verb('ir', 'torno');
  must((await state()).room === 'pecera', 'el torno abierto no lleva a la Pecera');
  ok('Acto III: Ibex de prórroga, desmentido D, plaza 9, torno → Pecera');

  // ------------------------------------------------------------ ASCENSOR con botonera: todas las rutas en los dos sentidos
  const FLOORS = { cpd: ['ascensor_cpd', 'Planta -1'], vestibulo: ['ascensor_vestibulo', 'Planta 0'], pecera: ['ascensor_pecera', 'Planta 1'], ecosistema: ['ascensor_ecosistema', 'Planta 2'] };
  for (const from of Object.keys(FLOORS)) for (const to of Object.keys(FLOORS)) {
    if (from === to) continue;
    await goto(from, 'ascensor');
    await verb('usar', FLOORS[from][0]);
    const o = await opts();
    must(o && o.length === 5, `${from}: la botonera no tiene 4 plantas + quedarse (${JSON.stringify(o)})`);
    must(o.some(x => x.startsWith(FLOORS[from][1]) && x.endsWith('(aquí)')), `${from}: la planta actual no sale marcada (aquí)`);
    const t0 = await flag('paco_tickets');
    await clearLog();
    await opcion(FLOORS[to][1]);
    st = await state();
    must(st.room === to, `ascensor ${from} → ${to}: acabo en ${st.room}`);
    const L = await G(r => __game.game.content.rooms[r].art.entries.ascensor, to);
    must(Math.abs(st.player.x - L[0]) < 2, `ascensor ${from} → ${to}: no salgo por la puerta del ascensor`);
    if (to === 'cpd') must((await flag('paco_tickets')) === t0 + 1, 'ascensor → CPD: el onEnter del CPD no suma el ticket');
    // planta 2: el ascensor sigue llegando al Ecosistema; el ¡FLASH! de Eventos es de su sala (`eventos`), no de la llegada
    if (to === 'ecosistema') must(!(await G(() => __game.log.some(l => l.who === 'pilar_escaleta'))), 'ascensor → planta 2: Pilar acredita en el Ecosistema (debería estar en su sala)');
    must(await G(() => __game.log.some(l => l.who === 'narrador' && /ticket|Diseño|ascensor|wifi|Ibex|reunión|garaje|Tadeo|organigrama|escalera|gong/i.test(l.text))), `ascensor ${from} → ${to}: sin frase de viaje`);
  }
  // cancelar: se queda
  await goto('pecera', 'ascensor');
  await verb('usar', 'ascensor_pecera'); await opcion('Nada, me quedo en esta planta.');
  must((await state()).room === 'pecera', 'ascensor: «quedarse» me ha movido');
  ok('Ascensor: 12 trayectos (-1, 0, 1, 2 en los dos sentidos), planta actual en gris, llegada por su puerta, onEnter, cancelar');
  // bloqueo: sin torno_abierto solo deja bajar al vestíbulo (mismas condiciones que las rutas antiguas)
  await setFlag('torno_abierto', false);
  for (const [to, line] of [['cpd', 'solo personal de Sistemas'], ['ecosistema', 'se requiere acreditación']]) {
    await clearLog();
    await verb('usar', 'ascensor_pecera'); await opcion(FLOORS[to][1]);
    must((await state()).room === 'pecera' && (await logHas(line)), `bloqueo del ascensor hacia ${to}: no contesta «${line}»`);
  }
  await verb('usar', 'ascensor_pecera'); await opcion('Planta 0');
  must((await state()).room === 'vestibulo', 'sin torno_abierto, el ascensor no deja bajar al vestíbulo');
  must(!(await G(() => __game.game.room.walk.boxes.find(b => b.id === 'paso_torno').enabled)), 'sin torno_abierto el carril del torno sigue abierto');
  await setFlag('torno_abierto', true);
  ok('Ascensor: sin torno_abierto, -1 y 2 contestan con una negativa; 0 siempre');
  // la escena 7.2 también salta llegando a la Pecera en ascensor
  await G(() => __game.newGame()); await idle();
  await setFlag('torno_abierto', true);
  await goto('cpd', 'ascensor');
  await clearLog();
  await ascensor('ascensor_cpd', 'Planta 1');
  must((await state()).room === 'pecera' && (await flag('inigo_presentado')) === true, 'ascensor → Pecera (1.ª vez): no salta la escena 7.2');
  must(await G(() => __game.log.some(l => l.who === 'inigo_sinergia')), 'ascensor → Pecera: Íñigo no habla en la 7.2');
  ok('Ascensor: la 1.ª llegada a la Pecera por el ascensor dispara la presentación del villano (7.2)');

  // ------------------------------------------------------------ 7.5 final (modo rápido: de principio a fin, créditos, poscréditos e impresora
  // incluidos; el juego acaba en el título y la partida terminada queda en state().finished)
  for (const f of ['duelo_inigo_ganado', 'lector_derribado', 'correo_evaristo_listo', 'infografia_integrada', 'sala_abierta', 'pagina_cerrada']) await setFlag(f);
  await setFlag('rumor_firma_n', 4);
  await goto('sala_amazonas', 'pajarera');
  await clearLog();
  await G(() => __game.scene('final'));
  st = await state();
  must(st.mode === 'title' && st.finished, `7.5: el final en modo rápido no llega al título (modo ${st.mode})`);
  st = { ...st, ...st.finished };
  must(st.flags.juego_terminado === true, '7.5: juego_terminado sin estado');
  must(st.room === 'pecera', '7.5: el final (poscréditos) no acaba en la Pecera');
  await expectLog(['¿Me he perdido algo?', 'TODA LA REDACCIÓN: «No.»'], '7.5 (poscréditos en modo rápido)');
  must(st.objects['vestibulo.cuadro_plazas'] && st.objects['vestibulo.cuadro_plazas'].state === 'tachado', '8bis.2: el cuadro no queda tachado');
  await expectLog(['Sábado, 6:00.', '¿Sigue gobernando el mismo?', '¿El becario de marzo del 98?', 'Lo estamos hablando, ¿no?',
    'Hidrovoltia lanza una opa sobre Banco Robledal', 'Por Bruno Pellejo', 'Con las dos eles.', '¡Eso es opa, árbitro!',
    'Es la primera vez que lo digo sin adjunto.', '«PLAZA 1. NO LA USO DESDE 1997. ES TUYA, CHAVAL.»', 'La línea de sucesión acaba de enloquecer.',
    'El papel lo dejé en 2011', 'En el pueblo digo que eres el dueño.', 'Si lo dice mucha gente, sale.', 'Que nunca contestas.',
    'cuarenta y siete minutos', 'gracias por sacarme', 'más de un 40 %', 'DEV 1: La web ha publicado la opa a las 00:01.', 'CORO: Enhorabuena, Diseño.',
    'Y es el que tenía razón.', 'mejor que el de la portada.'], '7.5');
  // orden de los insertos: Evaristo (9.8a) antes que la plaza (8bis.2), y ambos antes de la abuela
  const order = await G(() => { const L = __game.log.map(l => l.text); const i = s => L.findIndex(t => t.includes(s)); return [i('Celestino, que la noticia es mía.'), i('sin adjunto'), i('PLAZA 1'), i('¿Has comido?'), i('Que nunca contestas.')]; });
  must(order.every((v, i) => v >= 0 && (i === 0 || v > order[i - 1])), '7.5: orden de los insertos 9.8a / 8bis.2 / abuela incorrecto ' + JSON.stringify(order));
  ok('7.5 final (versión «con todo»): vestíbulo, 9.8a, 8bis.2, abuela + 9.8b, Pecera + 9.8c, coro → juego_terminado');

  // versión «sin extras»
  await G(() => __game.newGame()); await idle();
  for (const f of ['torno_abierto', 'duelo_inigo_ganado', 'lector_derribado', 'ruben_libre']) await setFlag(f);
  await clearLog();
  await G(() => __game.scene('final'));
  must(await G(() => !!(__game.state().finished && __game.state().finished.flags.juego_terminado)), '7.5 sin extras: falta juego_terminado');
  must(!(await logHas('sin adjunto')) && !(await logHas('eres el dueño')) && !(await logHas('más de un 40 %')), '7.5 sin extras: salen insertos condicionados');
  await expectLog(['ES TUYA, CHAVAL.', 'CORO: Enhorabuena, Diseño.'], '7.5 sin extras');
  ok('7.5 final (versión mínima): sin 9.8a/9.8b/infografía; 8bis.2 y el coro siempre');

  // ------------------------------------------------------------ créditos + poscréditos (modo normal, acelerado)
  await G(() => __game.newGame()); await idle();
  for (const f of ['torno_abierto', 'duelo_inigo_ganado', 'lector_derribado', 'ruben_libre', 'correo_evaristo_listo', 'chaqueta_en_lector']) await setFlag(f);
  await G(() => __game.skipText(false));
  await clearLog();
  G(() => { __game.game.runScript(api => api.scene('final'), { label: 'final (test)' }); });
  // saltar la cinemática del final (Esc)
  const t0 = Date.now();
  while (Date.now() - t0 < 30000) {
    const s = await state();
    if (s.mode === 'ending') break;
    if (s.cutscene) await G(() => __game.skipCutscene());
    await page.waitForTimeout(60);
  }
  must((await state()).mode === 'ending', 'créditos: no se llega a la pantalla de créditos');
  must(await flag('juego_terminado'), 'créditos: juego_terminado no está puesto');
  const lines = await G(() => __game.game.ending.lines.map(l => l.t));
  for (const l of ['Lamentamos el acierto.', 'Asignado a: Herminia.', 'Integración: pendiente de revisión (marzo).', 'Asignado a: el único que leyó hasta el final.',
    'Asignado a: Bruno Pellejo (plaza 1, sin coche).', 'Asignado a: Valentín Retícula (lo entregó a las 18:29).', 'Asignado a: quien no se escaqueó'])
    must(lines.includes(l), `créditos: falta «${l}»`);
  // capturas a distintos tiempos (recuadro, plano de Aurora, hilo de Tadeo)
  const total = await G(() => { const e = __game.game.ending; return (200 + e.lines.length * 13 + 14) / (e.def.speed || 14) * 1000; });
  const tPlano = (py) => G(py => { const e = __game.game.ending; const im = e.lines.findIndex(l => l.t.startsWith('Asignado a: un secuenciador')); return ((im + 1) * 13 + 6 + 200 - py) / 14 * 1000; }, py);
  for (const [k, ms] of [['creditos-1', 4000], ['creditos-aurora-1', await tPlano(70)], ['creditos-aurora-2', await tPlano(40)], ['creditos-aurora-3', await tPlano(-10)], ['creditos-hilo', total - 3500]]) {
    const t = ms;
    await G(t => { __game.game.ending.t = t; }, t);
    await page.waitForTimeout(150);
    await shot(k, true);
  }
  // acabar el scroll → poscréditos dentro del juego
  await G(t => { __game.game.ending.t = t; }, total);
  const t1 = Date.now();
  while (Date.now() - t1 < 8000 && (await state()).mode !== 'play') await page.waitForTimeout(60);
  st = await state();
  must(st.mode === 'play' && st.room === 'pecera', `poscréditos: no vuelve a la Pecera (modo ${st.mode}, sala ${st.room})`);
  must(st.actors.ramirez && st.actors.ramirez.room === 'pecera', 'poscréditos: Ramírez no está en la Pecera');
  await page.waitForTimeout(2500);
  await shot('poscreditos', true);
  const t2 = Date.now();
  while (Date.now() - t2 < 30000) {
    const s = await state();
    if (s.mode !== 'play') break;
    if (s.cutscene) await G(() => __game.skipCutscene());
    await page.waitForTimeout(60);
  }
  await expectLog(['¿Me he perdido algo?', 'TODA LA REDACCIÓN: «No.»'], 'poscréditos');
  must((await state()).mode === 'ending', 'última imagen: no sale la impresora');
  await G(() => { __game.game.ending.t = 7000; }); await page.waitForTimeout(150);
  await shot('impresora', true);
  // clic: avanza; luego vuelve al título
  for (let i = 0; i < 10 && (await state()).mode === 'ending'; i++) {
    const p = await G(() => __game.virtualToClient(160, 100)); await page.mouse.click(p.x, p.y); await page.waitForTimeout(700);
  }
  must((await state()).mode === 'title', 'tras la impresora no vuelve al título');
  ok('Créditos (fe de erratas, «Asignado a:» + 9.8d, plano de Aurora, hilo de Tadeo) → poscréditos (Ramírez) → impresora → título');

  // ------------------------------------------------------------ errores del motor
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
  try { await page.screenshot({ path: path.join(here, 'shots', 'paqA-fallo.png') }); } catch (_) { /* ignore */ }
}
if (consoleErrors.length) console.log('\nErrores de consola:\n  ' + consoleErrors.join('\n  '));
console.log(failed || consoleErrors.length ? '\nPAQUETE A: FALLA' : `\nPAQUETE A: OK (${n} comprobaciones)`);
await browser.close();
server.close();
process.exit(failed || consoleErrors.length ? 1 : 0);
