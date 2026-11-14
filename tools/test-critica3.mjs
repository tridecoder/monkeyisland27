#!/usr/bin/env node
// ARREGLOS DE LA CRÍTICA 3 (docs/informes/critica3/CRITICA_JUEGO_3.md §7, fallos N1-N11, y el punto 7 de §9):
//   · N1  Usar el ordenador (sentado) da la réplica R11 como Mirar, una sola vez; la abuela dice dónde está cada réplica
//         que falta para el duelo del objetivo (nivel 2: la primera; nivel 3: Bruno, sitio y objeto) en los cuatro duelos.
//   · N2  «Mirar a Bruno» dice la meta del acto en curso (Actos II y III), aunque quede pendiente un objetivo viejo.
//   · N3  el fax enmarcado de la Redacción de papel: todo su rectángulo es suyo (nadie delante, Aurora tampoco).
//   · N4  Usar la tarjeta con la rama del organigrama = con el organigrama.
//   · N5  la salida de los Despachos a la Redacción se llama «Redacción».
//   · N6  el ambiente guarda un margen tras cerrar una conversación (`trasDialogo`).
//   · N7  retirarse del hilo: Bruno lo dice y el hilo queda en el registro.
//   · N8  ganar a Maripaz con la ficha sellada por Teodoro: «Sellada por Teodoro».
//   · N9  la libreta: «…» fuera y “…” dentro (nunca «… «…» …»).
//   · N10 el titular de la derrota de un duelo es del Titulator (no de Bruno) en el registro.
//   · N11 el coro de Desarrollo solo habla con Bruno cerca de su mesa.
//   · §9.7 revanchas de Maripaz sin pop-up (solo antes del primer intento).
//   node tools/test-critica3.mjs
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from './serve.mjs';
import { createRunner, StepFail } from './walk-lib.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
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
const { G, state, chooseByText } = R;

let n = 0, failed = null;
const ok = (msg) => console.log(`  ✓ ${String(++n).padStart(2)} ${msg}`);
const must = (c, msg) => { if (!c) throw new StepFail(msg); };
const wait = (ms) => new Promise(r => setTimeout(r, ms));
const flag = (k) => G(k => __game.getFlag(k), k);
const setFlags = (o) => G(o => { for (const [k, v] of Object.entries(o)) __game.setFlag(k, v); }, o);
const verb = (v, t, i) => G(([v, t, i]) => __game.doVerb(v, t, i), [v, t, i || null]);
const idle = () => G(() => __game.waitIdle());
const clearLog = () => G(() => __game.clearLog());
const logCount = (txt) => G(t => __game.log.filter(l => String(l.text).includes(t)).length, txt);
const goto = async (room, entry) => { await G(([r, e]) => __game.gotoRoom(r, e), [room, entry]); await idle(); };
const until = async (fn, arg, ms = 15000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await G(fn, arg)) return true; await wait(40); } return false; };
const brunoDice = async () => G(async () => { __game.clearLog(); await __game.doVerb('mirar', 'bruno'); return __game.log.filter(l => l.who === 'bruno').map(l => l.text); });
const llamada = () => G(async () => { __game.clearLog(); await __game.scene('pistas'); return __game.log.filter(l => l.who === 'abuela_remedios' || l.who === 'bruno').map(l => (l.who === 'bruno' ? 'B: ' : 'A: ') + l.text); });
const DONDE = (rep) => G(async (r) => { const m = await import('/content/pistas.js'); return m.DONDE[r]; }, rep);

const BASE_ACTO2 = { torno_abierto: true, inigo_presentado: true, silla_libre: true, gertrudis_saludada: true, acto_2_iniciado: true };

/** Tres llamadas seguidas a la abuela en `sala` (empezando en nivel 1): [L1, L2, L3]. */
async function tresLlamadas(sala) {
  await goto(sala);
  await setFlags({ abuela_obj: null, abuela_nivel: 0 });
  return [await llamada(), await llamada(), await llamada()];
}

/** Un duelo abierto con api.duel: contesta bien hasta el remate y entonces `alRemate` ('retirarse' | id de objeto). */
async function jugarDuelo(id, alRemate) {
  G(i => { __game.game.runScript(api => api.duel(i), { label: 'test' }); }, id);
  for (let k = 0; k < 60; k++) {
    await idle();
    const st = await state();
    if (!st.duel) return;
    if (st.duel.phase === 'reply' && st.dialog) await G(() => __game.chooseDialog(__game.state().duel.correctIndex));
    else if (st.duel.phase === 'finisher' && st.dialog) {
      if (alRemate === 'retirarse') await chooseByText('[Retirarse del hilo]');
      else { await chooseByText('[Usar objeto]'); await G(o => __game.chooseItem(o), alRemate); }
    } else await wait(30);
  }
  await idle();
  must(!(await state()).duel, `el duelo ${id} no termina`);
}

// ================================================================== §9.8 atajo · E3 P8 semáforo · §9.9 señal del empujón
const shot = (nombre) => page.screenshot({ path: path.join(here, 'shots', `e3b-${nombre}.png`) });
const opciones = () => G(() => __game.currentDialogOptions());
const dir = () => G(async () => { const m = await import('/content/lib/directorio.js'); return { PRIMER_VIAJE: m.PRIMER_VIAJE, QUEDARSE: m.QUEDARSE }; });
/** Abre el directorio con un verbo y devuelve las opciones (sin elegir). */
async function abrirDirectorio(v = 'usar') {
  G(([v]) => __game.doVerb(v, 'directorio_planta'), [v]);
  await until(() => !!__game.state().dialog || (!__game.state().busy && __game.state().room !== 'pecera'), null, 8000);
  return opciones();
}
async function atajoSemaforoSenal() {
  const D = await dir();
  await G(() => __game.newGame()); await idle();
  must(JSON.stringify((await state()).visitadas) === '["vestibulo"]', `partida nueva: visitadas ${JSON.stringify((await state()).visitadas)}`);
  await setFlags({ torno_abierto: true, inigo_presentado: true, intro_vista: true });
  await goto('pecera');
  // 1. solo salas pisadas (y nunca la actual)
  let o = await abrirDirectorio();
  must(JSON.stringify(o) === JSON.stringify(['Vestíbulo · planta 0', D.QUEDARSE]), `directorio recién llegado: ${JSON.stringify(o)}`);
  await chooseByText(D.QUEDARSE); await idle();
  must((await state()).room === 'pecera', 'quedarse cambia de sala');
  ok('§9.8: el directorio solo ofrece las salas ya pisadas (Vestíbulo), nunca la actual; «Nada, me quedo aquí.» no viaja');
  // 2. Acto II: Despachos, Sala Amazonas y Sistemas pisados; el Vending no
  await setFlags({ acto_2_iniciado: true, silla_libre: true, gertrudis_saludada: true });
  for (const r of ['pajarera', 'sala_amazonas', 'cpd', 'pecera']) await goto(r);
  await clearLog();
  o = await abrirDirectorio('ir');
  for (const want of ['Despachos · planta 1', 'Sala Amazonas · planta 1', 'Vestíbulo · planta 0', 'Sistemas · planta -1']) must(o.includes(want), `falta «${want}» en ${JSON.stringify(o)}`);
  must(!o.some(t => /Vending|Marketing|Eventos|Administración|papel/.test(t)), `ofrece una sala no pisada: ${JSON.stringify(o)}`);
  await chooseByText('Sistemas'); await idle();
  let st = await state();
  const entCpd = await G(() => { const e = __game.game.content.rooms.cpd.entries.ascensor; return Array.isArray(e) ? e : [e.x, e.y]; });
  must(st.room === 'cpd' && st.player.x === entCpd[0] && st.player.y === entCpd[1], `Sistemas: sala ${st.room} en ${st.player.x},${st.player.y} (entrada ${entCpd})`);
  must(await logCount(D.PRIMER_VIAJE) === 1 && D.PRIMER_VIAJE.length <= 80, 'primer viaje: falta la línea de Bruno');
  ok(`§9.8: Acto II: ofrece Despachos, Sala Amazonas, Sistemas y Vestíbulo (no el Vending, sin pisar); a Sistemas por su entrada; «${D.PRIMER_VIAJE}»`);
  // 3. segunda vez, sin línea; la sala de destino corre su onEnter (la Sala Amazonas)
  await goto('pecera'); await clearLog();
  o = await abrirDirectorio();
  await chooseByText('Sala Amazonas'); await idle();
  must((await state()).room === 'sala_amazonas' && await logCount(D.PRIMER_VIAJE) === 0, 'segundo viaje: repite la línea o no llega');
  ok('§9.8: el segundo viaje, en silencio (la línea solo la primera vez)');
  // 4. bloqueos: Acto III sin Sala Amazonas; torno cerrado; tras el empujón, nada
  await setFlags({ acto_3_iniciado: true, dos_ias_vista: true });
  await goto('pecera');
  o = await abrirDirectorio();
  must(o.includes('Despachos · planta 1') && !o.some(t => t.startsWith('Sala Amazonas')), `Acto III: ${JSON.stringify(o)}`);
  await chooseByText(D.QUEDARSE); await idle();
  const bloqueos = await G(async () => {
    const m = await import('/content/lib/directorio.js');
    const g = __game.game, f = g.state.flags;
    const api = { room: 'pecera', flag: (k) => f[k], visitada: (r) => g.state.visitadas.includes(r) };
    const out = {};
    out.salaActo3 = m.destinoAbierto(api, 'sala_amazonas');
    out.noPisada = m.destinoAbierto(api, 'eventos');
    f.torno_abierto = false; out.tornoCpd = m.destinoAbierto(api, 'cpd'); out.tornoVest = m.destinoAbierto(api, 'vestibulo'); f.torno_abierto = true;
    f.acto_3_iniciado = false; out.salaActo2 = m.destinoAbierto(api, 'sala_amazonas'); f.acto_3_iniciado = true;
    f.lector_derribado = true; out.final = m.destinos(api).length; f.lector_derribado = false;
    return out;
  });
  must(!bloqueos.salaActo3 && !bloqueos.noPisada && !bloqueos.tornoCpd && bloqueos.tornoVest && bloqueos.salaActo2 && bloqueos.final === 0, 'bloqueos: ' + JSON.stringify(bloqueos));
  await setFlags({ lector_derribado: true });
  await clearLog();
  await G(() => __game.doVerb('usar', 'directorio_planta'));
  must(!(await opciones()) && (await state()).room === 'pecera', 'tras el empujón el directorio sigue abriendo la lista');
  await setFlags({ lector_derribado: false });
  ok('§9.8: no deja saltar a una sala sin pisar ni a la Sala Amazonas en el Acto III (se entra por su puerta); sin torno, solo el Vestíbulo; tras el empujón, nada');
  // 5. guardar / cargar (y partidas de antes del directorio)
  await G(() => __game.save('e3b'));
  await G(() => __game.newGame()); await idle();
  must((await state()).visitadas.length === 1, 'partida nueva tras guardar: visitadas no se reinicia');
  await G(() => __game.load('e3b'));
  st = await state();
  must(['pajarera', 'sala_amazonas', 'cpd', 'pecera', 'vestibulo'].every(r => st.visitadas.includes(r)) && st.room === 'pecera', `cargar: visitadas ${JSON.stringify(st.visitadas)}`);
  o = await abrirDirectorio();
  must(o.includes('Despachos · planta 1') && o.includes('Sistemas · planta -1'), `tras cargar: ${JSON.stringify(o)}`);
  await chooseByText(D.QUEDARSE); await idle();
  const vieja = await G(async () => {
    const m = await import('/content/game.js');
    const st = { room: 'catacumba', inventory: [], flags: { torno_abierto: true, acto_2_iniciado: true, vio_ticket_3: true }, once: {} };
    m.default.migrarPartida(st);
    return st.visitadas;
  });
  must(['vestibulo', 'catacumba', 'pecera', 'office', 'cpd'].every(r => vieja.includes(r)) && !vieja.includes('eventos'), 'partida vieja: ' + JSON.stringify(vieja));
  ok('§9.8: guardar/cargar conserva las salas pisadas; una partida de antes del directorio las deduce de la trama');
  // 6. con el ratón (sin verbo: «Ir a directorio con atajos») y elegir con clic; captura del menú
  await setFlags({ acto_3_iniciado: false, dos_ias_vista: false });
  await G(() => __game.skipText(false));
  const p0 = await G(() => __game.screenPos('directorio_planta'));
  must(await G(() => __game.objects().find(o => o.id === 'directorio_planta').name === 'directorio con atajos'), 'el hotspot no se llama «directorio con atajos»');
  await page.mouse.click(p0.x, p0.y);
  must(await until(() => !!__game.state().dialog, null, 8000), 'clic en el directorio: no se abre la lista');
  await wait(400);
  await shot('atajo-menu-escritorio');
  const iDesp = (await opciones()).indexOf('Despachos · planta 1');
  const po = await G(i => __game.optionPos(i), iDesp);
  await page.mouse.click(po.x, po.y);
  must(await until(() => __game.state().room === 'pajarera' && !__game.state().busy, null, 8000), 'clic en «Despachos»: no viaja');
  ok('§9.8: con el ratón: clic en el directorio (sin verbo) → lista; clic en «Despachos» → los Despachos');
  // táctil (iPhone en horizontal)
  const ctx = await browser.newContext({ viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
  const mp = await ctx.newPage();
  mp.on('console', m => { if (m.type() === 'error') consoleErrors.push('[móvil] ' + m.text()); });
  mp.on('pageerror', e => consoleErrors.push('[móvil] pageerror: ' + e.message));
  await mp.goto(base); await mp.waitForFunction(() => !!window.__game);
  const MG = (fn, a) => mp.evaluate(fn, a);
  const muntil = async (fn, ms = 8000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await MG(fn)) return true; await wait(60); } return false; };
  await MG(() => { try { localStorage.clear(); } catch (e) { /* */ } });
  await MG(() => __game.skipText(true));
  await MG(() => __game.newGame());
  await MG(() => { for (const [k, v] of Object.entries({ torno_abierto: true, inigo_presentado: true, intro_vista: true })) __game.setFlag(k, v); __game.game.state.visitadas.push('cpd', 'pajarera'); });
  await MG(() => __game.gotoRoom('pecera'));
  await MG(() => __game.skipText(false));
  await MG(() => __game.waitIdle());
  const t0 = await MG(() => __game.screenPos('directorio_planta'));
  await mp.touchscreen.tap(t0.x, t0.y);
  must(await muntil(() => !!__game.state().dialog), 'táctil: el toque en el directorio no abre la lista');
  await wait(450);
  await mp.screenshot({ path: path.join(here, 'shots', 'e3b-atajo-menu-movil.png') });
  must(await MG(() => __game.state().room === 'pecera'), 'táctil: el toque que abre la lista ya ha elegido algo');
  const iSis = (await MG(() => __game.currentDialogOptions())).indexOf('Sistemas · planta -1');
  const tp = await MG(i => __game.optionPos(i), iSis);
  await mp.touchscreen.tap(tp.x, tp.y);
  must(await muntil(() => __game.state().room === 'cpd' && !__game.state().busy), 'táctil: el toque en «Sistemas» no viaja');
  await ctx.close();
  ok('§9.8: táctil: un toque en el directorio abre la lista (sin elegir nada) y otro en «Sistemas» lleva a Sistemas');

  // ------------------------------------------------------------ E3 P8: el semáforo se pone verde un segundo
  await G(() => __game.skipText(true));
  await goto('pecera');
  await G(() => __game.doVerb('ir', 'semaforo_ruido'));
  await G(() => __game.skipText(false));
  await until(() => { const g = __game.game, s = (window.__camS = window.__camS || []); s.push(Math.round(g.camX)); return s.length > 8 && s.slice(-8).every(x => x === s[s.length - 1]); }, null, 6000);   // cámara quieta
  await G(() => { window.__camS = null; });
  await page.mouse.move(5, 5);
  must(await G(() => __game.game.getObjState('semaforo_ruido', 'pecera').state) === 'rojo', 'semáforo: no empieza en rojo');
  await shot('semaforo-antes');
  G(() => __game.doVerb('hablar', 'semaforo_ruido'));
  must(await until(() => __game.game.getObjState('semaforo_ruido', 'pecera').state === 'verde', null, 3000), 'Hablar al semáforo: no se pone verde');
  const tVerde = Date.now();
  await wait(250);
  await shot('semaforo-durante');
  must(await until(() => __game.game.getObjState('semaforo_ruido', 'pecera').state === 'rojo', null, 3000), 'el semáforo no vuelve al rojo');
  const dur = Date.now() - tVerde;
  const globo = await G(() => __game.state().speaking.some(s => s.text.startsWith('"Shhh"')));
  await idle();
  must(dur >= 700 && dur <= 1800 && globo, `semáforo: verde ${dur} ms (globo aún en pantalla: ${globo})`);
  must(await G(() => __game.game.getObjState('semaforo_ruido', 'pecera').state) === 'rojo', 'semáforo: acaba en verde');
  ok(`E3 P8: Hablar al semáforo: verde ${dur} ms con el globo en pantalla y vuelta al rojo`);

  // ------------------------------------------------------------ §9.9 señal del empujón
  await G(() => __game.skipText(true));
  await setFlags({ acto_3_iniciado: true, dos_ias_vista: true, sala_abierta: true, ruben_libre: true, chaqueta_en_lector: true,
    climax_entrada: true, sala_amazonas_climax_visto: true });
  await G(() => __game.giveItem('acta_reunion')); await G(() => __game.giveItem('ticket_n1'));
  await setFlags({ duelo_inigo_ganado: true });          // (sin ganar, entrar lanza el clímax)
  await goto('sala_amazonas');
  const variantes = async (ms) => G(async (ms) => {
    const g = __game.game, a = g.actors.lector_medio, vs = new Set(), t0 = performance.now();
    while (performance.now() - t0 < ms) {
      const sp = g.spriteOf(a);
      vs.add(Object.entries(a.variants).find(([, v]) => v === sp)?.[0] || 'base');
      await new Promise(r => setTimeout(r, 30));
    }
    return [...vs].sort();
  }, ms);
  // sin ganar D4: quieto
  await setFlags({ duelo_inigo_ganado: false });
  let vs = await variantes(3600);
  must(JSON.stringify(vs) === '["chaqueta"]', 'antes de ganar D4 ya se tambalea: ' + JSON.stringify(vs));
  await setFlags({ duelo_inigo_ganado: true });
  await idle();
  vs = await variantes(3600);
  must(vs.includes('chaqueta') && vs.includes('tamb1j') && vs.includes('tamb2j'), 'ganado D4 no se tambalea: ' + JSON.stringify(vs));
  // captura en pleno tambaleo
  await G(() => __game.skipText(false));
  await page.mouse.move(5, 5);
  await wait(1500);
  await shot('senal-quieto');
  await G(() => { __game.game.actors.lector_medio.variante = 'tamb1j'; });     // el fotograma más inclinado, fijo para la foto
  await wait(200);
  await shot('senal-tambaleo');
  await G(() => { __game.game.actors.lector_medio.variante = null; });
  await G(() => __game.skipText(true));
  const meta = await brunoDice();
  const M = await G(async () => (await import('/content/pistas.js')).OBJETIVOS.find(o => o.id === 'empujon'));
  must(meta.includes('El Lector Medio se tambalea. Un empujoncito y deja de asentir.'), '«Mirar a Bruno» tras D4: ' + JSON.stringify(meta));
  const ll = await tresLlamadas('sala_amazonas');
  must(ll[0].some(l => l.includes('empujoncito')) && ll[1].some(l => l.includes('cartón')) && ll[2].some(l => l.includes('Empújalo')) && ll[2].some(l => l === 'B: Empujar al Lector Medio.'),
    'la abuela no apunta al cartón y a Empujar: ' + JSON.stringify(ll));
  await setFlags({ lector_derribado: true });
  vs = await variantes(3400);
  must(JSON.stringify(vs) === '["caido"]', 'derribado sigue tambaleándose: ' + JSON.stringify(vs));
  await setFlags({ lector_derribado: false });
  ok(`§9.9: ganado D4 el Lector Medio se tambalea solo (quieto antes; caído, quieto); «Mirar a Bruno»: «${M.meta}»; la abuela: empujoncito → cartón → «Empujar al Lector Medio.»`);
  await G(() => __game.skipText(true));
}

try {
  await page.goto(base);
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) { /* ignore */ } });
  await page.reload();
  await page.waitForFunction(() => !!window.__game, null, { timeout: 30000 });
  await G(() => __game.skipText(true));
  await R.startDismisser();
  console.log('Arreglos de la crítica 3 (N1-N11 y revanchas de Maripaz)\n');
  await G(() => __game.newGame());
  await idle();

  // ------------------------------------------------------------ N4 rama del organigrama
  await G(() => __game.giveItem('tarjeta_becario'));
  await setFlags({ tarjeta_con_chicle: true });
  await verb('usar', 'rama_diseno', 'tarjeta_becario');
  must(await flag('foto_en_organigrama') === true, 'N4: Usar tarjeta con la rama del organigrama no pega la foto');
  ok('N4: Usar la tarjeta (con chicle) con la rama del organigrama pega la foto, igual que con el organigrama');

  // ------------------------------------------------------------ N1 Usar el ordenador = Mirar (una vez)
  await setFlags({ torno_abierto: true, inigo_presentado: true, silla_libre: true });
  await goto('pecera');
  await clearLog();
  await verb('usar', 'ordenador_bruno');
  must(await flag('rep_11') === true, 'N1: Usar el ordenador sentado no da rep_11');
  must(await logCount('Respuesta: «Espera sentado. Si encuentras silla».') === 1, 'N1: Usar el ordenador no enseña el correo de Ramírez');
  await verb('usar', 'ordenador_bruno'); await verb('mirar', 'ordenador_bruno');
  must(await logCount('Respuesta: «Espera sentado. Si encuentras silla».') === 1, 'N1: el correo de Ramírez se repite (debe salir una sola vez)');
  ok('N1: Usar el ordenador (sentado) da la réplica R11 como Mirar; una sola vez');

  // ------------------------------------------------------------ N2 Mirar a Bruno por acto (con objetivos viejos pendientes)
  await setFlags({ ...BASE_ACTO2, rep_11: false });
  const M = await G(async () => { const m = await import('/content/pistas.js'); return Object.fromEntries(m.OBJETIVOS.map(o => [o.id, o.meta])); });
  for (const sala of ['pecera', 'vestibulo', 'catacumba']) {
    await goto(sala);
    const d = await brunoDice();
    must(!d.includes(M.correo) && !d.includes(M.silla), `N2: en el Acto II (${sala}) Bruno dice una meta del Acto I: ${JSON.stringify(d)}`);
  }
  await goto('pecera');
  let d = await brunoDice();
  must(d.includes(M.cms), `N2: Acto II en la Redacción, sin CMS: «${M.cms}» (dice ${JSON.stringify(d)})`);
  ok('N2: Acto II con R11 sin aprender: «Mirar a Bruno» ya no dice «Tengo silla…», dice la meta del acto');
  await setFlags({ acto_3_iniciado: true });           // CMS, coma y R11 siguen pendientes
  for (const sala of ['pecera', 'vestibulo', 'administracion', 'cpd']) {
    await goto(sala);
    d = await brunoDice();
    must(d.includes(M.armario), `N2: Acto III (${sala}): se esperaba «${M.armario}» (dice ${JSON.stringify(d)})`);
  }
  ok('N2: Acto III (CMS, coma y R11 pendientes): «Mirar a Bruno» dice la meta del Acto III en todas partes');
  await setFlags({ acto_3_iniciado: false });

  // ------------------------------------------------------------ N1 la abuela dice dónde está cada réplica que falta
  await setFlags({ reunion_terminada: true, rep_08: false, rep_04: true, rep_14: true, rep_11: false });
  let [, L2, L3] = await tresLlamadas('sala_amazonas');
  const d08 = await DONDE('rep_08'), d11 = await DONDE('rep_11');
  must(L2.includes('A: ' + d08[0]), `N1: nivel 2 (D1) sin la primera réplica que falta (R08): ${JSON.stringify(L2)}`);
  must(L3.includes('B: Me faltan réplicas.') && L3.includes('B: ' + d08[1]) && L3.includes('B: ' + d11[1]), `N1: nivel 3 (D1): Bruno no dice dónde están R08 y R11: ${JSON.stringify(L3)}`);
  must(!L3.some(l => l.includes('Cotillea, que es gratis')), 'N1: sigue la pista vaga «Cotillea, que es gratis»');
  await setFlags({ rep_08: true });
  [, L2, L3] = await tresLlamadas('sala_amazonas');
  must(L3.includes('B: ' + d11[1]) && !L3.includes('B: ' + d08[1]), `N1: nivel 3 (D1) con solo R11 pendiente: ${JSON.stringify(L3)}`);
  must(d11[1].includes('ordenador'), 'N1: el nivel 3 de R11 no nombra el ordenador');
  await setFlags({ rep_11: true });
  [, L2, L3] = await tresLlamadas('sala_amazonas');
  must(!L3.includes('B: Me faltan réplicas.') && !L2.some(l => Object.values({ d08, d11 }).some(x => l === 'A: ' + x[0])), `N1: con todas las réplicas, la abuela sigue mandando a buscarlas: ${JSON.stringify(L3)}`);
  ok('N1: D1 (Maripaz): nivel 2 la abuela dice dónde está la que falta; nivel 3 Bruno nombra sitio y objeto de cada una');
  // D2 (Teodoro, objetivo firma): falta R06 (el fax enmarcado)
  await setFlags({ nota_gasto_presentada: true, fax_con_papel: true, casilla_fuente: true, rep_06: false, rep_02: true, rep_09: true });
  [, L2, L3] = await tresLlamadas('catacumba');
  const d06 = await DONDE('rep_06');
  must(L2.includes('A: ' + d06[0]) && L3.includes('B: ' + d06[1]), `N1: D2 sin R06: ${JSON.stringify(L3)}`);
  await setFlags({ rep_06: true });
  ok('N1: D2 (Teodoro): falta R06 → «' + d06[1] + '»');
  // D3 (Gervasio, objetivo acta): falta R07 (el ordenador de Gervasio)
  await setFlags({ acto_3_iniciado: true, ruben_encontrado: true, posit_descopeado: true, ruben_libre: true, rep_07: false, rep_01: true, rep_03: true, rep_05: true });
  [, L2, L3] = await tresLlamadas('pajarera');
  const d07 = await DONDE('rep_07');
  must(L2.includes('A: ' + d07[0]) && L3.includes('B: ' + d07[1]), `N1: D3 sin R07: ${JSON.stringify(L3)}`);
  ok('N1: D3 (Gervasio): falta R07 → «' + d07[1] + '»');
  // D4 (Íñigo, objetivo inigo): faltan R15 y R16
  await setFlags({ sala_abierta: true, rep_07: true, rep_10: true, rep_12: true, rep_13: true, rep_15: false, rep_16: false });
  [, L2, L3] = await tresLlamadas('pajarera');   // (en la Sala, sala_abierta lanza el clímax)
  const d15 = await DONDE('rep_15'), d16 = await DONDE('rep_16');
  must(L2.includes('A: ' + d16[0]) && L3.includes('B: ' + d16[1]) && L3.includes('B: ' + d15[1]), `N1: D4 sin R15 ni R16: ${JSON.stringify(L3)}`);
  ok('N1: D4 (Íñigo): faltan R16 y R15 → Evaristo y Rubén, con sitio y objeto');

  // ------------------------------------------------------------ N5 salida de los Despachos
  const nombre = await G(() => (__game.game.content.rooms.pajarera.objects || []).find(o => o.id === 'pajarera_a_pecera').name);
  must(nombre === 'Redacción', `N5: la salida de los Despachos se llama «${nombre}»`);
  ok('N5: la salida de los Despachos a la Redacción se llama «Redacción» (como las demás salidas)');

  // ------------------------------------------------------------ N9 la libreta, comillas
  await G(() => __game.newGame()); await idle();
  await setFlags({ rep_09: true, rep_01: true });
  await verb('usar', 'libreta_replicas');
  const lib = await G(() => __game.currentDialogOptions());
  must(lib && lib.includes('«Tráeme el contexto. Le hago una pieza aparte: “El contexto, explicado”.»'), `N9: la libreta no cambia las comillas de dentro: ${JSON.stringify(lib)}`);
  must(lib.every(o => (o.match(/«/g) || []).length <= 1), `N9: comillas «» anidadas en la libreta: ${JSON.stringify(lib)}`);
  await chooseByText('[Cerrar la libreta]'); await idle();
  ok('N9: la libreta cita con «…» y lo de dentro con “…”');

  // ------------------------------------------------------------ N3 el fax enmarcado, despejado
  await setFlags({ torno_abierto: true, inigo_presentado: true, acto_2_iniciado: true });
  await goto('catacumba');
  const fax = await G(() => {
    const g = __game.game, r = g.room.def.layout.fax_enmarcado.rect; let suyos = 0, total = 0; const otros = {};
    for (let y = r[1]; y < r[1] + r[3]; y++) for (let x = r[0]; x < r[0] + r[2]; x++) {
      const t = g.pickAt(x - Math.round(g.camX), y); total++;
      if (t && t.id === 'fax_enmarcado') suyos++; else otros[t ? t.id : '—'] = (otros[t ? t.id : '—'] || 0) + 1;
    }
    const a = g.actors.aurora_galerada;
    return { suyos, total, otros, aurora: a && a.room === 'catacumba' && a.visible };
  });
  must(fax.aurora, 'N3: Aurora no está en la Redacción de papel');
  must(fax.suyos === fax.total, `N3: el fax enmarcado no es suyo en ${fax.total - fax.suyos} de ${fax.total} puntos (${JSON.stringify(fax.otros)})`);
  await clearLog();
  const fr = await G(() => __game.game.room.def.layout.fax_enmarcado.rect);
  await G(([x, y]) => __game.doVerb('mirar', __game.game.pickAt(x - Math.round(__game.game.camX), y).id), [fr[0] + (fr[2] >> 1), fr[1] + (fr[3] >> 1)]);
  must(await flag('rep_06') === true, 'N3: Mirar el centro del fax enmarcado no da R06');
  ok(`N3: el fax enmarcado es suyo en ${fax.total} de ${fax.total} puntos (con Aurora en la sala); su centro da R06`);

  // ------------------------------------------------------------ N6 margen del ambiente tras cerrar una conversación
  await setFlags({ tadeo_rv_n: 1, 'ambient:catacumba.aurora_tadeo': 0 });
  await G(() => __game.skipText(false));
  G(() => { __game.game.runScript(api => api.dialog({ id: 'test_n6', actor: 'aurora_galerada', nodes: { a: { options: [{ text: 'Adiós.', exit: true, silent: true }] } } }), { label: 'test' }); });
  await until(() => !!__game.currentDialogOptions());
  await G(() => __game.chooseDialog(0));
  await G(() => { const g = __game.game; g.speeches.slice().forEach(s => g.endSpeech(s)); g.room.amb.count = 0; g.room.amb.next = g.time; });
  await wait(2500);
  must(await logCount('Dos exclamaciones de cierre') === 0, 'N6: el ambiente de Aurora suena justo al cerrar un diálogo');
  await G(() => { const g = __game.game; g.finDialogo = g.time - 60000; g.room.amb.next = g.time; });
  must(await until(() => __game.log.some(l => String(l.text).includes('Dos exclamaciones de cierre')), null, 8000), 'N6: pasado el margen, el ambiente de Aurora no sale');
  await G(() => __game.skipText(true)); await idle();
  ok('N6: tras cerrar un diálogo el ambiente espera su margen (trasDialogo); pasado el margen, sale');

  // ------------------------------------------------------------ N11 el coro, solo cerca
  await goto('pecera');
  const coro = await G(() => {
    const g = __game.game, api = g.condApi(), am = g.room.def.ambient.find(a => a.id === 'coro'), p = g.player, x0 = p.x;
    const r = g.room.def.layout.coro_desarrollo.rect, cx = r[0] + r[2] / 2;
    const en = (x) => { p.x = x; return g.cond(am.if, api); };
    const out = { cerca: en(cx), borde: en(cx - 190), lejos: en(cx - 260), otraPunta: en(100), cx };
    p.x = x0; return out;
  });
  must(coro.cerca && coro.borde && !coro.lejos && !coro.otraPunta, `N11: umbral del coro mal (${JSON.stringify(coro)})`);
  await G(() => __game.skipText(false));
  const sinCoro = await G(async () => {
    const g = __game.game; g.player.x = 90; g.player.path = []; g.snapCamera(); g.finDialogo = -1e9;
    const n0 = g.log.length;
    for (let k = 0; k < 3; k++) { g.room.amb.count = 0; g.room.amb.next = g.time; await new Promise(r => setTimeout(r, 1400)); }
    return g.log.slice(n0).filter(l => /^DEV [123]: /.test(String(l.text))).map(l => l.text);
  });
  must(!sinCoro.length, `N11: el coro habla desde la otra punta: ${JSON.stringify(sinCoro)}`);
  await G(() => { const g = __game.game; g.speeches.slice().forEach(s => g.endSpeech(s)); });
  await G(x => { const g = __game.game; g.player.x = x; g.player.path = []; g.snapCamera(); }, Math.round(coro.cx));
  const conCoro = await G(async () => {
    const g = __game.game; const n0 = g.log.length;
    for (let k = 0; k < 6; k++) {
      g.room.amb.count = 0; g.room.amb.next = g.time;
      await new Promise(r => setTimeout(r, 1500));
      if (g.log.slice(n0).some(l => /^DEV [123]: /.test(String(l.text)))) return true;
    }
    return false;
  });
  await G(() => __game.skipText(true)); await idle();
  must(conCoro, 'N11: con Bruno junto a su mesa el coro no habla');
  ok(`N11: el coro solo habla con Bruno a ≤ 200 px de su mesa (x ${Math.round(coro.cx)}); desde la otra punta, nada`);

  // ------------------------------------------------------------ D1 en la Sala: N10, revancha sin pop-up, N7, N8
  await G(() => __game.newGame()); await idle();
  await setFlags({ ...BASE_ACTO2, reunion_terminada: true, rep_08: true, rep_04: true, rep_11: true, rep_14: true });
  await G(() => __game.giveItem('ficha_pagina_7'));
  await goto('sala_amazonas');
  // N10: perder D1 → el titular es del Titulator
  await clearLog();
  G(() => { __game.game.runScript(api => api.duel('maripaz'), { label: 'test' }); });
  await until(() => !!__game.state().duel);
  await R.loseDuel();
  const tit = await G(() => __game.log.filter(l => String(l.text).includes('BECARIO LLAMA A UN COLCHÓN')).map(l => l.who));
  must(tit.length === 1 && tit[0] !== 'bruno' && tit[0] === 'titulator', `N10: el titular de la derrota lo dice ${JSON.stringify(tit)}`);
  ok('N10: el titular de la derrota de D1 queda en el registro como del Titulator, no de Bruno');
  // revancha: sin pop-up
  const pn0 = (await flag('maripaz_popup_n')) || 0;
  await clearLog();
  await verb('hablar', 'maripaz_remitido');
  must(((await flag('maripaz_popup_n')) || 0) === pn0 && await logCount('Plano detalle: PUBLICIDAD') === 0, 'revancha de D1: sigue saliendo el pop-up');
  must(!!(await G(() => __game.currentDialogOptions())), 'revancha de D1: no se abre el árbol de Maripaz');
  await chooseByText('Luego vuelvo.'); await idle();
  ok('§9.7: tras perder D1, hablar con Maripaz va directo al árbol (sin pop-up obligatorio)');
  // N7: retirarse en el remate
  await clearLog();
  await jugarDuelo('maripaz', 'retirarse');
  const ret = await G(() => __game.log.map(l => `${l.who}:${l.text}`));
  must(ret.some(l => l === 'aviso:RV: Bruno ha abandonado el hilo.'), `N7: «RV: Bruno ha abandonado el hilo.» no queda en el registro: ${JSON.stringify(ret.slice(-4))}`);
  const lineaRet = await G(() => __game.game.content.duels.texts.retireLine);
  must(ret.some(l => l === 'bruno:' + lineaRet) && lineaRet.length <= 80, `N7: Bruno no dice nada al retirarse: ${JSON.stringify(ret.slice(-4))}`);
  must(await flag('casilla_hueco') !== true && (await state()).lastDuel.result === 'retired', 'N7: retirarse cambia el resultado');
  ok(`N7: retirarse del hilo: «RV: Bruno ha abandonado el hilo.» en el registro y Bruno: «${lineaRet}»`);
  // N8: ganar D1 con la ficha sellada por Teodoro
  await setFlags({ casilla_firma: true, duelo_teodoro_ganado: true });
  await clearLog();
  await jugarDuelo('maripaz', 'ficha_pagina_7');
  must(await flag('casilla_hueco') === true, 'N8: no se gana D1 con la ficha');
  must(await logCount('Ficha de la página 7. Sellada por Teodoro. Impar.') === 1 && await logCount('Sellada por Aurora') === 0, 'N8: con el sello de Teodoro, Bruno sigue diciendo «Sellada por Aurora»');
  must(await logCount('Aurora no sella nada sin café') === 0, 'N8: Maripaz sigue hablando del sello de Aurora');
  ok('N8: ganada D2 antes que D1, el remate dice «Sellada por Teodoro» (y Maripaz no habla del café de Aurora)');

  await atajoSemaforoSenal();

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
  try { await page.screenshot({ path: path.join(here, 'shots', 'critica3-fallo.png') }); } catch (_) { /* ignore */ }
}
if (consoleErrors.length) console.log('\nErrores de consola:\n  ' + consoleErrors.join('\n  '));
console.log(failed || consoleErrors.length ? '\nCRÍTICA 3: FALLA' : `\nCRÍTICA 3: OK (${n} comprobaciones)`);
await browser.close();
server.close();
process.exit(failed || consoleErrors.length ? 1 : 0);
