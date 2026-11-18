#!/usr/bin/env node
// GUION NUEVO · TANDA 1 (docs/GUION_PROPUESTA_LIMPIO.md): lo que no depende de reestructurar la historia.
//   [P13] El Incontable: ni rastro del nombre viejo; letras del Vestíbulo (el «in» suelto), Coger/Hablar/Mirar del logo,
//         título, tarjeta del titulador, correo de bienvenida, Yoli («becario incontable» y su murmullo), Begoña.
//   [P9]  nueve réplicas nuevas (tres con ataque nuevo): parejas, voces de ataque de los cuatro rivales, reacciones
//         (`hurtByPair`, también las «opcionales»), la `cabe` de la R09, el tercer trozo de la R03 y cada escena donde se
//         aprenden (Celestino, Gertrudis, ordenador de Gervasio, Yoli, Anselmo, ordenador de Bruno, Aurora, Brais).
//   [P10] papel y web: «sin faldón», roll-up, anuncio por palabras y el pop-up DE PAPEL (dos planos detalle).
//   [P7]  aprender perdiendo: se entra sin réplicas; el ataque sin réplica apunta la pista (aviso + pósit + libreta); al
//         perder, «Me faltan réplicas. Están apuntadas en la libreta.»; la pista se borra al aprender; revancha; D4: la
//         puerta deja salir a cotillear y Hablar con Íñigo vuelve a abrir el duelo.
//   [P8]  Gervasio: tras un ataque escuchado entero, dos tramos y pausas más cortas; si le pisa, ese ataque vuelve lento.
//   [P5]  apagón: 12 s la primera vez (test-e5-pb) y 5 s en las repeticiones.
//   [P14]/[P15] sueltos: Celestino en pasado, «¿Evaristo? ¿Otra vez?», primera línea del registro, sin el crédito de Borja.
//   Partidas guardadas del juego anterior (sin `libreta_pistas`) a mitad de cada acto: cargan y se sigue jugando.
// Los duelos, el pop-up y el apagón se juegan con RATÓN real (clics en el menú y en la sala), sin modo rápido.
//   node tools/test-guion3-t1.mjs            (capturas en tools/shots/guion3-t1-*.png)
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from './serve.mjs';
import { createRunner, StepFail } from './walk-lib.mjs';
import { STEPS } from './walk-data.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const shots = path.join(here, 'shots');
fs.mkdirSync(shots, { recursive: true });
const server = createServer(root);
await new Promise(r => server.listen(0, r));
const base = `http://localhost:${server.address().port}/`;
const browser = await chromium.launch();
let failures = 0, checks = 0;
const ok = (c, m) => { checks++; if (c) console.log('  ✓ ' + m); else { failures++; console.log('  ✗ ' + m); } };
const T0 = Date.now();
const step = (t) => console.log(`\n[${Math.round((Date.now() - T0) / 1000)} s] ` + t);
const consoleErrors = [];
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const page = await browser.newPage({ viewport: { width: 960, height: 600 } });
page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));
const G = (fn, a) => page.evaluate(fn, a);
const R = createRunner(page);
const until = async (fn, arg, ms = 8000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await G(fn, arg)) return true; await sleep(40); } return false; };
const idle = () => G(() => __game.waitIdle());
const state = () => G(() => __game.state());
const flag = (k) => G(k => __game.getFlag(k), k);
const logHas = (t) => G(t => __game.log.some(l => String(l.text).includes(t)), t);
const logCount = (t) => G(t => __game.log.filter(l => String(l.text).includes(t)).length, t);
const clearLog = () => G(() => __game.clearLog());
const rapido = (on) => G(on => __game.skipText(on), on);
const shot = (n) => page.screenshot({ path: path.join(shots, `guion3-t1-${n}.png`) });
const verb = (v, t, i) => G(([v, t, i]) => __game.doVerb(v, t, i || null), [v, t, i]);

// ---- ratón
const verA = (id) => G((id) => {
  const g = __game.game, o = __game.objects().find(o => o.id === id);
  if (!o) return;
  g.camFollow = null; g.camTarget = null; g.camX = Math.max(0, Math.min(g.room.width - 320, Math.round(o.x + o.w / 2 - 160)));
}, id);
const seguir = () => G(() => { __game.game.camFollow = __game.game.G.player; });
const clicEn = async (id) => { await verA(id); await sleep(60); const c = await G(id => __game.screenPos(id), id); await page.mouse.click(c.x, c.y); };
const clicVerbo = async (v) => { const c = await G(v => __game.verbPos(v), v); await page.mouse.click(c.x, c.y); await sleep(40); };
const clicInv = async (it) => { const c = await G(i => __game.invPos(i), it); await page.mouse.click(c.x, c.y); await sleep(40); };
async function raton(verbo, id, item, esperar = true) {
  await clicVerbo(verbo);
  if (item) await clicInv(item);
  await clicEn(id);
  if (esperar) { await sleep(150); await idle(); await seguir(); }
}
/** Clic en la opción `i` del menú que está en pantalla (espera a que el menú lleve > 250 ms abierto). */
async function clicIndice(i) {
  await sleep(330);
  const p = await G(i => __game.optionPos(i), i);
  await page.mouse.click(p.x, p.y);
  await sleep(120);
}
async function clicOpcion(texto) {
  if (!(await until(() => !!__game.currentDialogOptions(), null, 15000))) return false;
  const o = await G(() => __game.currentDialogOptions());
  const i = o.findIndex(x => x.replace(/^› /, '') === texto || x.startsWith(texto));
  if (i < 0) return false;
  await clicIndice(i);
  return true;
}
/** Avanza los globos (como clics) hasta que haya un menú del duelo en pantalla (o termine el duelo). */
async function hastaMenuDuelo(ms = 30000) {
  const t0 = Date.now();
  let visto = !!(await state()).duel;
  while (Date.now() - t0 < ms) {
    const s = await state();
    if (!s.duel) { if (visto) return null; await sleep(60); continue; }
    visto = true;
    if (s.dialog && (s.duel.phase === 'reply' || s.duel.phase === 'finisher')) return s;
    if (s.pickItem) return s;
    await sleep(60);
  }
  return null;
}

// ---- partidas
const SAVES = {};
/** Partida nueva en modo rápido jugando el recorrido canónico hasta el paso `n` (incluido). */
async function jugarHasta(n, desde = 1) {
  await rapido(true);
  if (desde === 1) { await G(() => __game.newGame()); await idle(); }
  for (const s of STEPS.filter(s => s.n >= desde && s.n <= n)) {
    for (const a of s.acc) await R.run(a);
    await idle();
    await R.check(s.esp);
  }
}
const guardar = (slot) => G(s => __game.save(s), slot);
const cargar = async (slot) => { await G(s => __game.load(s), slot); await idle(); };

try {
  await page.goto(base);
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) { /* ignore */ } });
  await page.reload();
  await page.waitForFunction(() => !!window.__game && __game.state().mode === 'title');
  await sleep(900);
  await shot('titulo');
  await R.startDismisser();

  // ====================================================================== [P13] estático
  step('[P13] El Incontable: ni rastro del nombre viejo en content/, engine/, index.html, tools/ ni README');
  {
    const malos = [];
    const mira = (p) => {
      const t = fs.readFileSync(p, 'utf8');
      t.split('\n').forEach((l, i) => { if (/el ?C[o]ntable|[Ee]l C[o]ntable\b|ELCONT[A]BLE|\bC[o]ntable\b/.test(l)) malos.push(`${path.relative(root, p)}:${i + 1}`); });
    };
    const walk = (d) => { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (f === 'shots' || f === 'node_modules') continue; if (fs.statSync(p).isDirectory()) walk(p); else if (/\.(m?js|html|md|json|webmanifest)$/.test(f)) mira(p); } };
    for (const d of ['content', 'engine', 'tools']) walk(path.join(root, d));
    for (const f of ['index.html', 'README.md', 'manifest.webmanifest']) mira(path.join(root, f));
    ok(!malos.length, `sin el nombre viejo del periódico (${malos.slice(0, 6).join(', ') || 'ninguno'})`);
    // [P16] la rotativa se llama la Benita (los ids técnicos, como `teclaGoyita`, no cambian)
    const viejaRot = [];
    const miraRot = (d) => { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (f === 'shots') continue; if (fs.statSync(p).isDirectory()) miraRot(p); else if (/\.m?js$/.test(f)) fs.readFileSync(p, 'utf8').split('\n').forEach((l, i) => { if (/\bG[o]yita\b|\bG[O]YITA\b/.test(l)) viejaRot.push(`${path.relative(root, p)}:${i + 1}`); }); } };
    for (const d of ['content', 'engine', 'tools']) miraRot(path.join(root, d));
    ok(!viejaRot.length, `[P16] la rotativa, «Benita» en todo el juego (${viejaRot.join(', ') || 'sin el nombre viejo'})`);
    const art = fs.readFileSync(path.join(root, 'content/rooms/art/vestibulo.art.js'), 'utf8');
    ok(/text: 'elincontable\.es'/.test(art) && /\['i', xi, 1\], \['n', xn, 2\]/.test(art), 'letras del Vestíbulo: «elincontable.es» con el «in» descolgado');
    const tit = fs.readFileSync(path.join(root, 'content/rooms/pecera.titulador.js'), 'utf8');
    ok(tit.includes("'ELINCONTABLE.ES · HACE 1 MIN'") && tit.includes("'elincontable.es/mercados/'"), 'tarjeta del titulador y dirección de Discover');
    const gm = fs.readFileSync(path.join(root, 'content/game.js'), 'utf8');
    ok(gm.includes("'elincontable.es · Sáb. · Pág. 7'"), 'portada del título: «elincontable.es · Sáb. · Pág. 7»');
  }

  // ====================================================================== Acto I con ratón donde importa
  step('[P13] [P15] [P9] Vestíbulo: el logo, Celestino en pasado y el cotilleo de correo (R05)');
  await jugarHasta(1);
  await G(() => { __game.skipSpeech(); __game.clearLog(); });
  await rapido(false);
  await raton('mirar', 'logo_pared', null, false);
  await until(() => __game.log.some(l => String(l.text).includes('«elincontable.es»')), null, 8000);
  await sleep(400); await seguir();
  await shot('vestibulo-logo');
  await rapido(true); await idle();
  await verb('mirar', 'logo_pared'); await verb('coger', 'logo_pared'); await verb('hablar', 'logo_pared'); await verb('empujar', 'logo_pared');
  for (const t of ['Letras de metal: «elincontable.es». Al «in» le falta un tornillo.', 'Un periódico económico que se llama El Incontable.',
    'Es lo más honesto que ha hecho nunca un periódico económico.', 'Si me llevo el «in», queda «elcontable.es». Una gestoría.',
    '«Buenas noches, Incontable». El «in» se mueve un poco. Lo tomo como un sí.', 'No llego. Y si llego, el «in» se cae con todo su tornillo.'])
    ok(await logHas(t), `logo: «${t}»`);
  await jugarHasta(4, 2);
  ok(await logHas('Nadie se las da. Yo se las daba. Me ponía espuma.'), 'Celestino (café), en pasado');
  for (const t of ['¡Jugada de correo! Gervasio, responder a todos: «Que esto no salga de aquí».',
    '¡Contesta Mercados, a todos: «Me lo estás diciendo en un responder a todos»!', '¡Me llegó hasta a mí! ¡Y yo soy un mostrador!'])
    ok(await logHas(t), `Celestino R05: «${t}»`);
  ok(!(await logHas('wifi')), 'sin el wifi del chisme viejo');
  await jugarHasta(10, 5);

  step('[P9] Despachos: el ordenador de Gervasio (R07) · Redacción: el ordenador de Bruno con el borrador (R11)');
  await clearLog();
  await jugarHasta(11, 11);
  for (const t of ['Teodoro, por fax escaneado: "¿En qué acta consta?".', 'No hay respuesta. Gervasio no ha escrito un acta en su vida.'])
    ok(await logHas(t), `ordenador de Gervasio: «${t}»`);
  await jugarHasta(12, 12);
  await guardar('t1_acto1');                            // partida del Acto I (para la migración)
  await R.run(['ir', 'pecera']); await idle();
  await G(() => { __game.skipSpeech(); __game.clearLog(); });
  await rapido(false);
  await raton('mirar', 'ordenador_bruno', null, false);
  await until(() => __game.log.some(l => String(l.text).includes('En borradores, mi respuesta')), null, 20000);
  await sleep(500);
  await shot('ordenador-borrador');
  await rapido(true); await idle(); await seguir();
  for (const t of ['Con silla, el correo se ve. Ramírez, en 2019: «¿Has podido verlo?».', 'En borradores, mi respuesta: «Poder, he podido».',
    'Nunca la mandé. La apunto.', 'Y una autorrespuesta de Brais: «Estoy fuera de la oficina desde julio».'])
    ok(await logHas(t), `ordenador de Bruno: «${t}»`);
  ok(await flag('rep_11'), 'R11 aprendida');
  await verb('mirar', 'ordenador_bruno');
  ok(await logHas('Bandeja de entrada. Ramírez sigue preguntando si he podido.'), 'Mirar (después): «Ramírez sigue preguntando si he podido.»');
  await verb('coger', 'ordenador_bruno');
  ok(await logHas('Es de El Incontable. Lo pone una pegatina. Con mi nombre mal escrito.'), 'Coger el ordenador: «Es de El Incontable…»');

  step('[P9] [P15] Vending: Gertrudis sin coletilla y los chismes nuevos (R03, R04; R14 con Begoña)');
  await clearLog();
  await jugarHasta(16, 14);
  for (const t of ['NADIE ME SALUDABA DESDE 2019.', 'CHISME: GERVASIO A YOLI: "ESTO LO NECESITABA PARA... PARA... PARA AYER".',
    'YOLI: "AYER FUE CUANDO EMPEZASTE LA FRASE".', 'CHISME: MARIPAZ A ANSELMO: "HAZLO TÚ, QUE TE VA A DAR MUCHA VISIBILIDAD".',
    'ANSELMO: "SI VALIERA ALGO, ME LA COBRARÍAS".', 'CHISME: GERVASIO A BEGOÑA: "ESTO LO VEMOS EN UNA REUNIÓN RÁPIDA".',
    'BEGOÑA: "¿TE VA EN MARZO? ES CUANDO ACABAN LAS RÁPIDAS".'])
    ok(await logHas(t), `Gertrudis: «${t}»`);
  ok(!(await logHas('CARIÑO')) && !(await logHas('EL DE BOLSA')), 'sin «CARIÑO» ni «el de Bolsa» en los chismes');

  step('[P9] Redacción de papel: Aurora y 1996 (R02); el fax enmarcado (R06, el de siempre)');
  await clearLog();
  await jugarHasta(17, 17);
  for (const t of ['En 1996 me mandó un fax que empezaba «Corrígeme si me equivoco».', 'Le contesté: «Con mucho gusto: te equivocas».',
    'No me ha vuelto a dirigir la palabra. Han sido treinta años muy buenos.'])
    ok(await logHas(t), `Aurora: «${t}»`);
  await G(() => { __game.skipSpeech(); __game.clearLog(); });
  await rapido(false);
  await raton('mirar', 'fax_enmarcado', null, false);
  await until(() => __game.log.some(l => String(l.text).includes('Un fax enmarcado')), null, 20000);
  await sleep(500);
  await shot('fax-enmarcado');
  await rapido(true); await idle(); await seguir();
  ok(await flag('rep_06') && await logHas('Un fax enmarcado: «¿Esto lo has contrastado?».'), 'fax enmarcado: R06 de siempre');
  await jugarHasta(23, 19);

  step('[P9] [P13] Redacción: Yoli («becario incontable», R08) y Anselmo (R09, larga y corta)');
  await clearLog();
  await jugarHasta(25, 24);
  for (const t of ['Hola Bruno, Bruno becario, becario incontable, cuánto cobra un becario.', 'Le contesté: «Se nota. Has puesto a mi jefe en copia».',
    'Ahora ha puesto en copia a mi madre.', 'Yoli dijo que mi dato de tráfico estaba «sacado de contexto».',
    'Le contesté: «Claro que lo saqué. El contexto no cabía en la pieza».', 'Como no lo entendió, se lo resumí: «Lo saqué yo. No cabía».',
    'No hemos vuelto a comer juntos.'])
    ok(await logHas(t), `Redacción: «${t}»`);
  const murmYoli = await G(() => JSON.stringify(__game.game.content.rooms.pecera.actors.find(a => a.id === 'yoli_tendencias') || {}));
  ok(murmYoli.includes('\\"Incontable\\": cero búsquedas al mes.') && !murmYoli.includes('gestorías'), 'murmullo de Yoli: «"Incontable": cero búsquedas al mes.»');
  await guardar('t1_acto2');                            // partida del Acto II (para la migración)
  await jugarHasta(28, 26);
  await guardar('t1_antes_d1');

  // ====================================================================== [P10] el pop-up de papel
  step('[P10] Sala Amazonas: «¿Qué hace usted con el planillo?» → módulos y línea gris; luego el pop-up de cartulina');
  await G(() => { __game.skipSpeech(); __game.clearLog(); });
  await rapido(false);
  await raton('hablar', 'maripaz_remitido', null, false);
  ok(await clicOpcion('¿Qué hace usted con el planillo?'), 'opción del planillo, con un clic');
  ok(await until(() => { const d = __game.state().detalle; return !!d && d.titulo === 'PÁGINA 7 · PROPUESTA DE COMERCIAL'; }, null, 20000), 'primer plano detalle: la página según Comercial');
  await until(() => __game.log.some(l => String(l.text).includes('¿Ves esa línea gris?')), null, 15000);
  await sleep(300);
  ok(await G(() => __game.game.detalle && __game.game.detalle.draw && __game.game.detalle.draw.name) === 'paginaComercial', 'plano 1: faldón, robapáginas, cuatro módulos y la línea gris');
  await shot('planillo-modulos');
  await until(() => __game.log.some(l => String(l.text).includes('Se ve demasiado. Por eso lleva pop-up.')), null, 20000);
  ok(await until(() => __game.game.detalle && __game.game.detalle.draw && __game.game.detalle.draw.name === 'paginaPopup', null, 20000), 'plano 2: se abre el pop-up de cartulina');
  await sleep(1100);
  await shot('planillo-popup');
  await rapido(true); await idle();
  await R.closeDialog();
  ok(await logHas('Se ve demasiado. Por eso lleva pop-up.') && !(await logHas('Estoy en ello.')), 'Maripaz: «Se ve demasiado. Por eso lleva pop-up.»');
  ok(await logCount('Plano detalle: PÁGINA 7 · PROPUESTA DE COMERCIAL') === 2, 'dos planos detalle seguidos');
  const sala = await G(() => JSON.stringify(__game.game.content.rooms.sala_amazonas.actors.find(a => a.id === 'maripaz_remitido') || {}));
  ok(sala.includes('Entre esta silla y aquella cabe un roll-up. Lo he medido.') && sala.includes('Esta reunión, con un pop-up al principio, ya sería rentable.'), 'murmullos de Maripaz: roll-up (y el pop-up de la reunión)');

  // ====================================================================== [P9] D1 con ratón
  step('[P9] D1 con ratón: voces nuevas de R04 y R11, réplicas nuevas en el menú, reacciones nuevas; «sin faldón»');
  await cargar('t1_antes_d1');
  await G(() => { __game.skipSpeech(); __game.clearLog(); });
  await rapido(false);
  await raton('hablar', 'maripaz_remitido', null, false);
  ok(await clicOpcion('Siestatón no ha confirmado la página 7.'), 'D1 con un clic');
  const jugadas = { R08: 0, R04: 0, R11: 0 };
  let menuShot = false, remate = false;
  for (let k = 0; k < 20; k++) {
    const s = await hastaMenuDuelo(40000);
    if (process.env.T1_DEBUG) console.log('    [d1]', s && JSON.stringify({ ph: s.duel.phase, at: s.duel.attack, ci: s.duel.correctIndex }), s ? '' : JSON.stringify(await state().then(x => ({ duel: x.duel, room: x.room, dialog: x.dialog, last: x.lastDuel }))));
    if (!s) break;
    if (s.duel.phase === 'reply') {
      if (!menuShot && s.duel.attack === 'R04') { await sleep(400); await shot('d1-menu-replicas'); menuShot = true; }
      const want = await G(id => __game.game.content.duels.pairs.find(p => p.id === id).reply, s.duel.attack);
      ok(s.dialog.includes(want), `D1 ${s.duel.attack}: «${want}» en el menú`);
      await clicIndice(s.duel.correctIndex);
      jugadas[s.duel.attack] = (jugadas[s.duel.attack] || 0) + 1;
    } else if (s.duel.phase === 'finisher' && s.dialog) {
      await clicOpcion('[Usar objeto]');
      await until(() => __game.state().pickItem, null, 5000);
      await G(() => __game.chooseItem('ficha_pagina_7'));
      remate = true;
    }
  }
  await rapido(true); await idle();
  ok(remate && await flag('duelo_maripaz_ganado'), 'D1 ganado con clics');
  for (const t of ['Hazlo tú, que te va a dar mucha visibilidad. Te pongo junto al banner.', '¿Has podido ver mi correo? El vídeo dura veinte segundos. No se salta.',
    'Te escribo desde el cariño más absoluto. Con un banner en la firma.', 'Uy. Esa copia iba oculta.', 'Tienes razón. Mañana sale con tarifa.',
    'Pues te lo vuelvo a poner. Sin poder saltarlo.', 'Hueco libre: veintitrés líneas. Impar, y sin faldón.'])
    ok(await logHas(t), `D1: «${t}»`);
  ok(!(await logHas('modo avión')) && !(await logHas('Sentado se ven')), 'sin las reacciones viejas');
  await R.closeDialog().catch(() => {});

  // ====================================================================== D2 (R02, R09)
  step('[P9] D2: «CORRÍGEME SI ME EQUIVOCO…», «DATO SACADO DE CONTEXTO…», la R09 larga no cabe y la corta sí');
  await clearLog();
  await jugarHasta(35, 30);
  await R.run(['verbo', 'hablar', 'teodoro_cuerpodoce']);
  await R.run(['opcion', 'Quiero firmar en tu página 7.']);
  await R.playDuel(['R06', 'R02', 'R09:larga', 'R09', { objeto: 'manual_fax' }]);
  await idle(); await R.closeDialog().catch(() => {});
  for (const t of ['CORRÍGEME SI ME EQUIVOCO: LA WEB NO ES UN PERIÓDICO.', 'DATO SACADO DE CONTEXTO. CONTESTA EN UNA LÍNEA: TREINTA Y OCHO CARACTERES.',
    'Claro que lo saqué. El contexto no cabía en la pieza.', 'NO CABE. REPITA EN TREINTA Y OCHO.', 'Lo saqué yo. No cabía.', '...CABE.', 'ESO ME LO DIJO ELLA. EN 1996.'])
    ok(await logHas(t), `D2: «${t}»`);
  ok(await flag('duelo_teodoro_ganado'), 'D2 ganado');
  await jugarHasta(41, 37);
  ok(await logHas('«¿A cuántos días por año?».') && await flag('rep_13'), 'Brais: «¿A cuántos días por año?» (R13)');
  await verb('mirar', 'registro_tickets');
  ok(await logHas('Este registro lo empezó Eutimio en julio. El contador lleva la otra numeración.'), '[P14] registro de tickets: la primera línea nueva');
  await guardar('t1_acto3');                             // partida del Acto III (para la migración)
  await jugarHasta(45, 42);
  await guardar('t1_antes_d3');

  // ====================================================================== [P8] D3 con ratón, a tiempo real
  step('[P8] [P9] D3 con ratón: el primer ataque, lento y entero; los siguientes, en dos tramos; si le pisa, ese ataque vuelve lento');
  await G(() => { __game.skipSpeech(); __game.clearLog(); });
  await rapido(false);
  await R.run(['ir', 'pajarera']); await idle();
  await raton('hablar', 'gervasio_acta', null, false);
  ok(await clicOpcion('Necesito el acta de la última reunión.'), 'D3 con un clic');
  // 1.er ataque (R07): lento, tres trozos; se deja acabar
  let s = await hastaMenuDuelo(40000);
  ok(s && s.duel.attack === 'R07' && s.duel.tramos === 3 && !s.duel.rapido, `R07, el primero: tres trozos, lento (${s && s.duel.tramos})`);
  await until(() => !__game.state().duel.escribiendo, null, 20000);
  await clicIndice((await state()).duel.correctIndex);
  // 2.º (R03): rápido, dos tramos; Bruno le pisa → ese ataque vuelve a empezar lento
  s = await hastaMenuDuelo(40000);
  ok(s && s.duel.attack === 'R03' && s.duel.rapido && s.duel.tramos === 2, `R03 tras uno entero: dos tramos, rápido (${s && s.duel.tramos})`);
  const tR = Date.now();
  await until(() => !__game.state().duel.escribiendo, null, 20000);
  const rapidoMs = Date.now() - tR;
  ok(await G(() => __game.state().duel.body) === 'El acta se necesitaba para... para... para ayer.', 'la R03 acaba en «para ayer.»');
  // (vuelta atrás: se carga y se le pisa la R03)
  await rapido(true);
  await cargar('t1_antes_d3');
  await G(() => { __game.skipSpeech(); __game.clearLog(); });
  await rapido(false);
  await R.run(['ir', 'pajarera']); await idle();
  await raton('hablar', 'gervasio_acta', null, false);
  await clicOpcion('Necesito el acta de la última reunión.');
  await hastaMenuDuelo(40000);
  await until(() => !__game.state().duel.escribiendo, null, 20000);
  await clicIndice((await state()).duel.correctIndex);
  s = await hastaMenuDuelo(40000);
  ok(s && s.duel.rapido, 'R03 llega en dos tramos');
  await clicIndice(s.duel.correctIndex);               // le pisa la frase
  await until(() => __game.log.some(l => String(l.text).includes('Me has interrumpido. Se apunta.')), null, 15000);
  s = await hastaMenuDuelo(40000);
  ok(s && s.duel.attack === 'R03' && !s.duel.rapido && s.duel.tramos === 3, `pisada: la R03 vuelve a empezar lenta, en tres trozos (${s && s.duel.tramos})`);
  const tL = Date.now();
  await until(() => !__game.state().duel.escribiendo, null, 20000);
  const lentoMs = Date.now() - tL;
  ok(lentoMs > rapidoMs + 400, `lenta tarda más que rápida (${lentoMs} ms frente a ${rapidoMs} ms)`);
  await shot('d3-para-ayer');
  await clicIndice((await state()).duel.correctIndex);
  s = await hastaMenuDuelo(40000);
  if (s && s.duel.phase === 'finisher') {
    await clicOpcion('[Usar objeto]');
    await until(() => __game.state().pickItem, null, 5000);
    await G(() => __game.chooseItem('fotocopia_nota_direccion'));
  }
  await rapido(true); await idle(); await R.closeDialog().catch(() => {});
  ok(await flag('duelo_gervasio_ganado'), 'D3 ganado con clics');
  ok(await logHas('La frase se... se empezó en plazo.') && await logHas('Ayer fue cuando empezaste la frase.'), 'R03: réplica nueva y su reacción');

  // ====================================================================== D4 y el final
  step('[P9] [P14] [P15] D4: Íñigo con voz propia; «¿Evaristo? ¿Otra vez?»; créditos sin el móvil de Borja');
  await clearLog();
  await jugarHasta(49, 47);
  for (const t of ['Estamos analizando todas las opciones. Con un framework propio.', 'Hay que poner las luces largas, Vacante. Visión 2030.',
    'Vacante, no es un despido: es una salida en valor.', 'Esto, entre nosotros, es confidencial. Que no salga de esta sala.',
    'Eso es un detalle sin importancia, Vacante. No escala.', '¿A cuántos días por año?', 'Eso es una filtración. Lo pongo en rojo.',
    'Me lo estás diciendo en un responder a todos.', '¿Evaristo? ¿Otra vez?'])
    ok(await logHas(t), `D4: «${t}»`);
  ok(!(await logHas('¿Quién es Evaristo?')), 'sin «¿Quién es Evaristo?»');
  { const fin = fs.readFileSync(path.join(root, 'content/escenas/final.js'), 'utf8');
    ok(!fin.includes('el móvil de Borja. Lo publicó a las nueve.') && fin.includes("asig('Reenvíos', 'Asignado a: Tadeo Adjunto. La IA estaba de acuerdo.')"), 'créditos: fuera el del móvil de Borja ([P15])'); }
  ok(await logHas('Abrígate tú.') && await logHas('¡Me ha contestado el periódico!'), 'la cadena final sigue');

  // ====================================================================== [P7] D1 sin réplicas, con ratón
  step('[P7] D1 sin réplicas: se entra; el ataque sin réplica apunta la pista; al perder, el repaso; la libreta; revancha');
  await cargar('t1_antes_d1');
  await G(() => { for (const k of ['rep_08', 'rep_04', 'rep_11', 'rep_14']) __game.setFlag(k, false); __game.setFlag('libreta_pistas', 0); __game.skipSpeech(); __game.clearLog(); });
  await rapido(false);
  await raton('hablar', 'maripaz_remitido', null, false);
  ok(await clicOpcion('Siestatón no ha confirmado la página 7.'), 'D1 sin ninguna réplica de su mazo: se entra');
  s = await hastaMenuDuelo(40000);
  ok(!(await logHas('Aún no tengo con qué contestarle')), 'sin el aviso viejo de «faltan réplicas»');
  ok(s && s.duel.attack === 'R08' && s.duel.correctIndex === -1, 'R08 sin su réplica: el menú trae lo que sabe y la floja');
  const DONDE08 = await G(() => import('/content/pistas.js').then(m => m.DONDE.rep_08[1]));
  ok(s && s.duel.pista === DONDE08, `la pista del ataque: «${DONDE08}»`);
  ok(await until(() => __game.state().notices.includes('Pista apuntada en la libreta.'), null, 3000), 'aviso: «Pista apuntada en la libreta.»');
  ok((await flag('libreta_pistas') & (1 << 7)) !== 0, 'libreta_pistas: el bit de la R08');
  await sleep(250);
  const vista = await G(() => JSON.parse(JSON.stringify(__game.game.duelVista)));
  ok(vista && vista.pista === DONDE08 && vista.libreta, 'en pantalla: el pósit de la pista sobre la pestaña LIBRETA');
  await shot('d1-pista-apuntada');
  for (let k = 0; k < 8; k++) {
    s = await hastaMenuDuelo(40000);
    if (!s) break;
    if (s.duel.phase === 'reply') await clicIndice(s.duel.weakIndex);
    else if (s.dialog) await clicOpcion('[Retirarse del hilo]');
  }
  await until(() => !__game.state().duel, null, 30000);
  ok(await until(() => __game.log.some(l => String(l.text).includes('Me faltan réplicas. Están apuntadas en la libreta.')), null, 60000), 'al perder: «Me faltan réplicas. Están apuntadas en la libreta.»');
  await rapido(true); await idle();
  const bits = await flag('libreta_pistas');
  ok((bits & (1 << 7)) && (bits & (1 << 3)), `pistas de R08 y R04 apuntadas (bits ${bits})`);
  // la libreta (Mirar), con las pistas en gris
  await clearLog();
  await rapido(false);
  const pl = G(() => __game.doVerb('mirar', 'libreta_replicas'));
  await until(() => !!__game.currentDialogOptions(), null, 15000);
  await sleep(400);
  const lib = await state();
  ok(lib.dialog && lib.dialog.includes(DONDE08) && lib.dialogDisabled.includes(lib.dialog.indexOf(DONDE08)), 'libreta: la pista de la R08, en gris (no se elige)');
  await shot('libreta-pistas');
  await G(() => __game.chooseDialog(__game.currentDialogOptions().length - 1));
  await pl; await rapido(true); await idle();
  // se aprende la R08: la pista se borra
  // (la opción de Yoli es `once` y ya se eligió en el recorrido: se aprende con la misma llamada que usa la sala)
  await G(() => __game.game.runScript(x => x.learnReply('rep_08'), { label: 'test' })); await idle();
  ok(await flag('rep_08') && !((await flag('libreta_pistas')) & (1 << 7)), 'aprendida la R08: su pista sale de la libreta');
  // revancha: se vuelve a entrar
  await R.run(['ir', 'sala_amazonas']);
  await R.run(['verbo', 'hablar', 'maripaz_remitido']);
  await R.run(['opcion', 'Siestatón no ha confirmado la página 7.']);
  ok(!!(await state()).duel, 'revancha: el duelo se vuelve a abrir');
  await R.loseDuel();
  ok(!(await state()).duel && (await state()).room === 'sala_amazonas', 'perder otra vez no deja sin salida (sigue en la Sala)');

  // ====================================================================== [P7] D4 sin réplicas
  step('[P7] D4 sin réplicas: se entra, se pierde, «Le vuelvo a hablar…» y el repaso; la puerta deja salir; Hablar con Íñigo lo reabre');
  await cargar('t1_antes_d3');
  await jugarHasta(46, 46);
  await G(() => { for (const k of ['rep_10', 'rep_12', 'rep_13', 'rep_05', 'rep_16', 'rep_01', 'rep_07', 'rep_15']) __game.setFlag(k, false); __game.clearLog(); });
  await R.run(['ir', 'pajarera']);
  await R.run(['verbo', 'usar', 'puerta_sala']);
  ok(await until(() => !!__game.state().duel, null, 20000), 'el clímax abre el D4 sin réplicas');
  await R.loseDuel();
  ok(await logHas('Le vuelvo a hablar. Un consultor siempre tiene un hueco en la agenda.') && await logHas('Me faltan réplicas. Están apuntadas en la libreta.'), 'derrota del D4: «Le vuelvo a hablar…» y el repaso');
  ok(!(await logHas('Tengo que cotillear más')), 'sin la línea vieja «Tengo que cotillear más»');
  await clearLog();
  await R.run(['ir', 'pajarera']);
  ok((await state()).room === 'pajarera' && await logHas('Vuelvo enseguida. La 247 no se va a mover.'), 'la puerta deja salir a cotillear');
  await G(() => { __game.doVerb('usar', 'puerta_sala'); });          // (sin esperar: volver a entrar reabre el duelo)
  ok(await until(() => !!__game.state().duel, null, 30000), 'al volver a la Sala, el D4 se reabre');
  await R.loseDuel();
  await G(() => { __game.doVerb('hablar', 'inigo_sinergia'); });
  ok(await until(() => !!__game.state().duel, null, 30000), 'Hablar con Íñigo vuelve a abrir el D4');
  await R.loseDuel();

  // ====================================================================== [P5] el apagón de 5 s
  step('[P5] Apagón: la repetición deja 5 s a oscuras (la primera, 12 s: test-e5-pb)');
  await rapido(true);
  await G(() => __game.newGame()); await idle();
  await G(() => { for (const k of ['intro_vista', 'torno_abierto', 'inigo_presentado', 'silla_libre', 'gertrudis_saludada', 'chaqueta_cogida', 'acto_2_iniciado']) __game.setFlag(k, true);
    for (const o of ['pecera_viral', 'pecera_cms_entrada', 'pecera_yoli_banner']) __game.game.state.once['once:' + o] = true; });
  await G(() => __game.gotoRoom('pecera', 'ascensor')); await idle();
  await verb('tirar', 'enchufe_pantalla'); await idle();
  ok(await flag('apagon_n') === 1 && !(await flag('pecera_oscuras')), 'primer apagón (modo rápido: ventana de 0 ms)');
  await G(() => { __game.skipSpeech(); __game.clearLog(); });
  await rapido(false);
  await raton('tirar', 'enchufe_pantalla', null, false);
  ok(await until(() => !!__game.getFlag('pecera_oscuras') && !__game.state().busy, null, 40000), 'segundo apagón: ventana a oscuras jugable');
  const t5 = Date.now();
  await shot('apagon-repeticion');
  await raton('hablar', 'yoli_tendencias', null, false);
  ok(await until(() => __game.log.some(l => String(l.text).includes('Estoy contando')), null, 4000), 'a oscuras: Hablar con Yoli → «¡Chsss! Estoy contando…»');
  await until(() => __game.game.busy > 0 && !__game.game.apagon?.interceptar, null, 15000);
  const dur = Date.now() - t5;
  ok(dur >= 3500 && dur <= 7500, `la ventana se cierra a los ~5 s (${dur} ms)`);
  await until(() => !__game.getFlag('pecera_oscuras') && !__game.state().busy, null, 40000);
  ok(await logHas('¡Otra! ¡Ha entrado otra!') && await logHas('Ya. Pero si no lo veo entrar, no cuenta.') && await flag('apagon_n') === 2, 'la escalada n = 2 de siempre, al cerrarse');
  await rapido(true); await seguir();

  // ====================================================================== partidas del juego anterior
  step('Partidas guardadas del juego anterior (sin `libreta_pistas`) a mitad de cada acto: cargan y se sigue');
  for (const [slot, sig, nom] of [['t1_acto1', 13, 'Acto I (tras el paso 12)'], ['t1_acto2', 26, 'Acto II (tras el paso 25)'], ['t1_acto3', 42, 'Acto III (tras el paso 41)']]) {
    await G(([s]) => {
      const k = __game.game.slotKey(s), d = JSON.parse(localStorage.getItem(k));
      delete d.state.flags.libreta_pistas;
      localStorage.setItem(k + '_viejo', JSON.stringify(d));
    }, [slot]);
    await cargar(slot + '_viejo');
    ok(await flag('libreta_pistas') === 0, `${nom}: carga y la libreta empieza sin pistas`);
    let sigue = true;
    try { await jugarHasta(sig, sig); } catch (e) { sigue = false; console.log('    ' + e.message); }
    ok(sigue, `${nom}: el paso ${sig} se juega`);
  }

  const errs = await G(() => __game.errors.filter(e => !e.warn).map(e => e.msg));
  ok(!errs.length, 'sin errores del motor ' + errs.join(' | '));
} catch (e) {
  failures++;
  console.log('\n  ✗ FALLO: ' + (e instanceof StepFail ? e.message : (e && e.stack) || e));
  try {
    const log = await G(() => __game.log.slice(-10).map(l => `${l.who || '—'}: ${l.text}`));
    console.log('    últimas líneas:\n      ' + log.join('\n      '));
    await shot('fallo');
  } catch (_) { /* ignore */ }
}
if (consoleErrors.length) { failures++; console.log('\nErrores de consola:\n  ' + consoleErrors.join('\n  ')); }
console.log(failures ? `\nGUION3-T1: FALLA (${failures} de ${checks})` : `\nGUION3-T1: OK (${checks} comprobaciones)`);
await browser.close();
server.close();
process.exit(failures ? 1 : 0);
