#!/usr/bin/env node
// ENMIENDA E4 (docs/guion2/ENMIENDA_E4.md): Audiencias, Discover y el TITULADOR de Yoli.
//   · titulador contra el generador de referencia (docs/guion2/e4/gen.mjs): las combinaciones enteras (titular, usuarios,
//     categoría y voz de Yoli en partida simulada), módulo de datos al día con piezas.json, 3 líneas a 190 px, y que la
//     lógica no nombre ningún id de pieza (todo sale del fichero de datos: vale con otro juego de piezas del mismo formato);
//   · sesión completa con ratón real (casillas del monitor y del panel, publicar, contador, récord, un clic dentro del
//     monitor no cierra, un clic fuera sí, Esc), cinco publicaciones y cierre solo;
//   · móvil en horizontal con el dedo; guardar/cargar con el récord; cargar a mitad de sesión (sin estados colgados);
//   · los nueve secretos del dueño, literales, con su etiqueta y la línea de Yoli (una vez por partida);
//   · consecuencias: pósit en la pieza → Aurora lo corrige → Yoli lo nota; COINCIDO; demo del paso 34; paso 40 (con y sin
//     haber jugado); epílogo (con ganador, por defecto y sin escena); la hoja «lo más leído» por actos; la ráfaga.
//   node tools/test-e4.mjs              (capturas en tools/shots/e4-*.png)
//   node tools/test-e4.mjs --sin-capturas
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createServer } from './serve.mjs';
import { createRunner, StepFail } from './walk-lib.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const SHOTS = !process.argv.includes('--sin-capturas');
fs.mkdirSync(path.join(here, 'shots'), { recursive: true });
let n = 0, failed = null;
const ok = (msg) => console.log(`  ✓ ${String(++n).padStart(2)} ${msg}`);
const must = (c, msg) => { if (!c) throw new StepFail(msg); };
const wait = (ms) => new Promise(r => setTimeout(r, ms));
const consoleErrors = [];

// las nueve frases del dueño (§3bis.3), literales
const LITERALES = ['Los expertos coinciden: esta tarde hay que cerrar las puertas y bajar las persianas',
  'Los cocineros coinciden: los mejillones de lata están mejor si los preparas con...',
  'Le conté a mi psicóloga lo del Euríbor y se quedó callada',
  'Según la psicología, si la prima de riesgo te escribe pasadas las ocho, no es amor',
  'Las 7 señales de que tu relación con el Euríbor es tóxica',
  'Confirmado: el Ibex 35 se tiende antes de las ocho o pierde valor',
  'Los expertos coinciden: esta tarde hay que cerrar las puertas y bajar la prima de riesgo',
  'El pueblo de España que todavía paga el Euríbor en pesetas',
  'Los analistas recomiendan comprar la prima de riesgo y dejarla en remojo'];

// ======================================================================== 1. contra el generador de referencia (Node)
const REF = await import(pathToFileURL(path.join(root, 'docs/guion2/e4/gen.mjs')).href);
const T = await import(pathToFileURL(path.join(root, 'content/rooms/pecera.titulador.js')).href);
const { wrap } = await import(pathToFileURL(path.join(root, 'engine/font.js')).href);
const P = T.P;
async function referencia() {
  const r = spawnSync(process.execPath, [path.join(here, 'gen-titulador.mjs'), '--comprobar'], { encoding: 'utf8' });
  must(r.status === 0, 'el módulo de datos no está al día con docs/guion2/e4/piezas.json: ' + (r.stderr || r.stdout));
  must(Object.keys(REF.P).length === Object.keys(P).length && Object.keys(REF.P).every(k => JSON.stringify(P[k]) === JSON.stringify(REF.P[k])), 'el módulo de datos no es piezas.json');
  ok(`datos: content/rooms/pecera.titulador.datos.js = docs/guion2/e4/piezas.json («${P.version}»)`);
  let total = 0, mal = [], lineas = 0;
  const d1 = new Set(), d2 = new Set();
  let prev = REF.usuarios(...T.piezas(T.BRUNO).map((x, i) => [REF.A, REF.S, REF.G][i].find(y => y.id === x.id)));
  for (const a of REF.A) for (const s of REF.S) for (const g of REF.G) {
    total++;
    const k = `${a.id}|${s.id}|${g.id}`;
    const [a2, s2, g2] = T.piezas(k);
    const t1 = REF.titular(a, s, g), t2 = T.titular(a2, s2, g2);
    const u1 = REF.usuarios(a, s, g), u2 = T.usuarios(a2, s2, g2);
    const c1 = REF.categoria(a, s, g, u1, prev), c2 = T.categoria(a2, s2, g2, u2, prev);
    const v1 = REF.voz(c1, u1, prev, d1), v2 = T.voz(c2, u2, prev, d2);
    if (t1 !== t2 || u1 !== u2 || JSON.stringify(c1) !== JSON.stringify(c2) || v1 !== v2) mal.push(`${k}: «${t2}» ${u2} ${c2.id}/${v2} ≠ «${t1}» ${u1} ${c1.id}/${v1}`);
    if (wrap(t2, 190).length > 3) mal.push(`${k}: ${wrap(t2, 190).length} líneas a 190 px`);
    if (T.titularK(k) !== t1 || T.usuariosK(k) !== u1) mal.push(`${k}: titularK/usuariosK`);
    if (v2) lineas++;
    prev = u1;
  }
  must(total === P.autoridades.length * P.asuntos.length * P.ganchos.length, 'faltan combinaciones');
  must(!mal.length, `${mal.length} combinaciones distintas del generador de referencia:\n      ${mal.slice(0, 8).join('\n      ')}`);
  // también con el «anterior» fijo en el titular de Bruno (como §3bis.8) y con todas las líneas dichas
  for (const a of REF.A) for (const s of REF.S) for (const g of REF.G) {
    const [a2, s2, g2] = T.piezas(`${a.id}|${s.id}|${g.id}`);
    for (const pr of [3, 1e6]) {
      const u = REF.usuarios(a, s, g);
      must(JSON.stringify(REF.categoria(a, s, g, u, pr)) === JSON.stringify(T.categoria(a2, s2, g2, u, pr)), `categoría ${a.id}|${s.id}|${g.id} con anterior ${pr}`);
    }
  }
  ok(`titulador = generador de referencia en las ${total} combinaciones (titular, usuarios, categoría, voz; ≤ 3 líneas a 190 px; ${lineas} líneas de Yoli en la partida simulada)`);
  for (const l of LITERALES) must(REF.A.some(a => REF.S.some(s => REF.G.some(g => T.titular(...T.piezas(`${a.id}|${s.id}|${g.id}`)) === l))), 'no sale literal: ' + l);
  ok('las nueve frases del dueño salen literales');
  // la lógica no nombra ningún id de pieza (todo sale de los datos): pecera.titulador.js (salvo las miniaturas, que
  // tienen un dibujo por defecto), las escenas, los diálogos, la sala, el epílogo y Aurora
  // (los ids que también son de categoría —«opa», los de gancho— se pueden nombrar como categoría: no se buscan)
  const cats = new Set(P.categorias.map(c => c.id));
  const ids = [...P.autoridades, ...P.asuntos, ...P.ganchos].map(p => p.id).filter(id => !cats.has(id));
  const fuentes = ['content/rooms/pecera.titulador.js', 'content/rooms/pecera.escenas.js', 'content/rooms/pecera.dialogos.js', 'content/rooms/pecera.js',
    'content/escenas/final.js', 'content/rooms/catacumba.js'];
  const nombrados = [];
  for (const f of fuentes) {
    let src = fs.readFileSync(path.join(root, f), 'utf8');
    if (f.endsWith('pecera.titulador.js')) src = src.replace(/function miniatura[\s\S]*$/, '');
    for (const id of ids) if (new RegExp(`['"\`]${id}['"\`|]|\\|${id}['"\`|]`).test(src)) nombrados.push(`${f}: ${id}`);
  }
  must(!nombrados.length, 'la lógica nombra ids de piezas (deben salir del fichero de datos): ' + nombrados.join(', '));
  ok('la lógica no nombra ningún id de autoridad, asunto o gancho (demo, ganador, secretos, categorías y líneas, de los datos)');
}

// ======================================================================== 2. en el juego
const server = createServer(root);
await new Promise(r => server.listen(0, r));
const base = `http://localhost:${server.address().port}/`;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 960, height: 600 } });
page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));
const R = createRunner(page);
const { G, state } = R;
const flag = (k) => G(k => __game.getFlag(k), k);
const setFlags = (o) => G(o => { for (const [k, v] of Object.entries(o)) __game.setFlag(k, v); }, o);
const idle = () => G(() => __game.waitIdle());
const clearLog = () => G(() => __game.clearLog());
const logHas = (t) => G(t => __game.log.some(l => String(l.text).includes(t)), t);
const logCount = (t) => G(t => __game.log.filter(l => String(l.text).includes(t)).length, t);
const goto = async (room, entry) => { await G(([r, e]) => __game.gotoRoom(r, e), [room, entry]); await idle(); };
const until = async (fn, arg, ms = 15000, pg = page) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await pg.evaluate(fn, arg)) return true; await wait(40); } return false; };
const shot = async (nombre, pg = page) => { if (SHOTS) await pg.screenshot({ path: path.join(here, 'shots', `e4-${nombre}.png`) }); };
const st = () => G(() => { const s = __game.game.titulador; return s ? { combo: s.combo.slice(), u: s.u, pubs: s.pubs, etiqueta: s.etiqueta } : null; });
const detalle = () => G(() => (__game.state().detalle || {}).titulo || null);
const opciones = () => G(() => __game.currentDialogOptions());
const sinMarca = (o) => o.replace(/^› /, '');
const DX = 8, DY = 2, CHIPX = [4, 104, 204], CHIPW = 96, CHIPY = 57;   // geometría del plano (pecera.titulador.js)

const BASE = { intro_vista: true, torno_abierto: true, inigo_presentado: true, silla_libre: true, gertrudis_saludada: true, cms_vivo: true,
  acto_2_iniciado: true, rep_11: true, casilla_fuente: true, pieza_escrita: true, herminia_midio: true };
async function partida(flags = BASE, conPieza = true) {
  await G(() => __game.skipText(true));
  await G(() => __game.newGame()); await idle();
  await setFlags(flags);
  if (conPieza) await G(() => __game.giveItem('pieza_opa'));
  await G(() => { __game.game.state.once['once:pecera_cms_entrada'] = true; });   // la ráfaga, en su prueba
  await goto('pecera');
}
/** Abre el titulador (Usar el monitor de Yoli) y espera al menú. */
async function abrir(pg = page, verbo = ['usar', 'monitor_yoli']) {
  pg.evaluate(([v, t]) => { __game.doVerb(v, t); }, verbo);
  must(await until(() => { const d = __game.currentDialogOptions(); return !!(d && d.includes('Dejarlo')); }, null, 15000, pg), 'el titulador no abre su menú');
}
/** Elige una pieza por su texto de menú en la casilla i (panel). */
async function pieza(i, menu) {
  await G(i => __game.chooseDialog(i), i);
  const o = await opciones();
  const j = o.findIndex(x => sinMarca(x) === menu);
  must(j >= 0, `no está «${menu}» en ${JSON.stringify(o)}`);
  await G(j => __game.chooseDialog(j), j);
}
async function componer(k) {
  const ps = T.piezas(k);
  for (let i = 0; i < 3; i++) await pieza(i, ps[i].menu);
}
const publicar = async () => { await G(() => __game.chooseText('¡Publicar!')); await idle(); };
const dejar = async () => { await G(() => __game.chooseText('Dejarlo')); await idle(); };
const clicV = async (x, y, pg = page) => { await pg.waitForTimeout(330); const p = await pg.evaluate(([x, y]) => __game.virtualToClient(x, y), [x, y]); await pg.mouse.click(p.x, p.y); };
const tapV = async (x, y, pg) => { await pg.waitForTimeout(330); const p = await pg.evaluate(([x, y]) => __game.virtualToClient(x, y), [x, y]); await pg.touchscreen.tap(p.x, p.y); };
const clicOpcion = async (texto, pg = page) => {
  await pg.waitForTimeout(330);                          // el motor ignora los toques de los primeros 250 ms de un menú
  const o = await pg.evaluate(() => __game.currentDialogOptions());
  const i = o.findIndex(x => sinMarca(x) === texto || x.startsWith(texto));
  must(i >= 0, `no está la opción «${texto}» en ${JSON.stringify(o)}`);
  const p = await pg.evaluate(i => __game.optionPos(i), i);
  if (pg === page) await pg.mouse.click(p.x, p.y); else await pg.touchscreen.tap(p.x, p.y);
};
const esperaMenu = async (pg = page, ms = 15000) => must(await until(() => { const d = __game.currentDialogOptions(); return !!(d && d.includes('Dejarlo')) && !__game.state().speaking.length; }, null, ms, pg), 'no vuelve el menú del titulador');

async function sesionConRaton() {
  await partida();
  await G(() => __game.skipText(false));
  await abrir();
  must(await detalle() === 'TITULADOR · DISCOVER', 'el plano no es el titulador');
  const s0 = await st();
  must(s0.u === T.usuariosK(T.BRUNO) && T.clave(s0.combo) === T.BRUNO, 'empieza con el titular de Bruno');
  await wait(500); await shot('titulador-vacio');
  const K = 'confirmado|euribor|obvio', [ka, ks, kg] = T.piezas(K);
  // casilla ASUNTO con un clic en el monitor (no en el panel)
  await clicV(DX + CHIPX[1] + 48, DY + CHIPY + 7);
  must(await until(() => { const d = __game.currentDialogOptions(); return !!d && d.includes('Volver'); }), 'clic en la casilla ASUNTO: no abre su menú');
  await wait(300);
  await clicOpcion(ks.menu);
  await esperaMenu();
  // un clic dentro del monitor (en el contador) no cierra nada
  await clicV(DX + 260, DY + 30);
  await wait(400);
  must(await detalle() === 'TITULADOR · DISCOVER' && (await opciones() || []).includes('Dejarlo'), 'un clic dentro del monitor cierra el titulador');
  // AUTORIDAD y GANCHO por el panel, con el ratón
  await clicOpcion('Autoridad:'); await wait(300); await clicOpcion(ka.menu); await esperaMenu();
  await clicOpcion('Gancho:'); await wait(300); await clicOpcion(kg.menu); await esperaMenu();
  must(T.clave((await st()).combo) === K, 'la combinación no es la elegida: ' + JSON.stringify(await st()));
  await wait(350); await shot('titulador-compuesto');
  await clearLog();
  await clicOpcion('¡Publicar!');
  await wait(1250); await shot('titulador-contador-alto');
  await esperaMenu(page, 20000);
  const s1 = await st();
  must(s1.u === 576000 && s1.u === T.usuariosK(K) && s1.pubs === 1 && s1.etiqueta === P.secretos.find(x => x.combo === K).etiqueta, 'publicar: ' + JSON.stringify(s1));
  must(await flag('pecera_disc_record') === T.usuariosK(K) && await flag('pecera_disc_record_k') === K, 'el récord no se guarda');
  must(await logHas('Lo he medido: es verdad.'), 'Yoli no dice X5');
  ok('ratón: clic en la casilla ASUNTO del monitor y en el panel → «Confirmado: el Euríbor sube, baja o se queda igual» → 576.000, RÉCORD DE LA CASA, X5, récord guardado; un clic dentro del monitor no cierra');
  // la opa lo hunde (Esc en un submenú vuelve; el contador se desploma)
  await clicOpcion('Asunto:'); await wait(250);
  await page.keyboard.press('Escape');
  await esperaMenu();
  const opa = T.A.flatMap(a => T.S.flatMap(s => T.G.map(g => `${a.id}|${s.id}|${g.id}`))).filter(k => /\bopa\b/i.test(T.titularK(k)) && !P.secretos.some(x => x.combo === k)).sort((x, y) => T.usuariosK(x) - T.usuariosK(y))[0];
  for (let i = 0; i < 3; i++) { await clicOpcion(['Autoridad:', 'Asunto:', 'Gancho:'][i]); await wait(250); await clicOpcion(T.piezas(opa)[i].menu); await esperaMenu(); }
  await clicOpcion('¡Publicar!');
  await wait(700); await shot('titulador-hundido-opa');
  await esperaMenu(page, 20000);
  const s2 = await st();
  must(s2.u === T.usuariosK(opa) && s2.u < 100 && s2.pubs === 2, 'la opa no hunde: ' + JSON.stringify(s2));
  must(await flag('pecera_disc_record') === 576000, 'el récord baja');
  ok(`la opa lo hunde: «${T.titularK(opa)}» → ${s2.u} (${s2.etiqueta}); Esc en un submenú vuelve al menú`);
  // un secreto con la reacción de Yoli en pantalla
  const sec = P.secretos.find(x => x.linea && x.combo !== K);
  for (let i = 0; i < 3; i++) { await clicOpcion(['Autoridad:', 'Asunto:', 'Gancho:'][i]); await wait(200); await clicOpcion(T.piezas(sec.combo)[i].menu); await esperaMenu(); }
  await clicOpcion('¡Publicar!');
  must(await until(t => __game.state().speaking.some(s => s.text === t), P.lineas[sec.linea], 20000), 'no se ve la reacción de Yoli al secreto');
  await wait(500); await shot('titulador-secreto-yoli');
  await esperaMenu(page, 30000);
  // cuarta y quinta: el titulador se cierra solo
  for (let k = 0; k < 2; k++) { await clicOpcion('¡Publicar!'); await wait(1600); if (k === 0) await esperaMenu(page, 20000); }
  must(await until(() => !__game.state().detalle && !__game.state().busy, null, 30000), 'tras cinco publicaciones el titulador no se cierra');
  must((await flag('pecera_disc_hist')).length === 4 && await flag('pecera_disc_partidas') === 1, 'historial / partidas: ' + JSON.stringify([await flag('pecera_disc_hist'), await flag('pecera_disc_partidas')]));
  ok('cinco publicaciones con el ratón: el titulador se cierra solo; historial de las 4 últimas, partidas = 1');
  // el pósit en la pieza (al salir, con la pieza y récord > el titular de Bruno)
  must(await flag('opa_posit') === 1 && await logHas('Te pego el mejor en un pósit.'), 'pósit: ' + await flag('opa_posit'));
  must(await G(() => __game.game.content.items.pieza_opa.iconKey(__game.game.viewFor())) === '_posit', 'icono de la pieza sin pósit');
  ok('al salir con la pieza: O6 y opa_posit = 1 (icono de la pieza con el pósit rosa)');
  // clic fuera del monitor (la sala, debajo del plano): sale como «Dejarlo», sin colgar nada
  await abrir();
  await wait(400);
  await clicV(160, 136);
  must(await until(() => !__game.state().detalle && !__game.state().busy && !__game.currentDialogOptions(), null, 8000), 'un clic fuera del plano deja el titulador colgado');
  await abrir();
  await wait(300);
  await page.keyboard.press('Escape');
  must(await until(() => !__game.state().detalle && !__game.state().busy && !__game.currentDialogOptions(), null, 8000), 'Esc no cierra el titulador');
  must(await flag('pecera_disc_partidas') === 3 && await logCount('Te pego el mejor') === 1, 'salidas: partidas / pósit repetido');
  ok('un clic en la sala, fuera del plano, y Esc cierran el titulador en cualquier momento (sin estados colgados); el pósit, una vez');
  await G(() => __game.skipText(true));
}

async function guardarCargar() {
  must(await flag('pecera_disc_record') === 576000, 'antes de guardar');
  await G(() => __game.save(7));
  await G(() => __game.newGame()); await idle();
  must(!(await flag('pecera_disc_record')), 'partida nueva con récord');
  await G(() => __game.load(7));
  must(await flag('pecera_disc_record') === 576000 && await flag('pecera_disc_record_k') === 'confirmado|euribor|obvio'.split('|').join('|')
    && (await flag('pecera_disc_dichas')).length >= 2 && (await flag('pecera_disc_hist')).length === 4, 'cargar: el récord / las dichas / el historial no vuelven');
  // cargar con el titulador abierto: se cierra y no toca la partida cargada
  await goto('pecera');
  await abrir();
  await G(() => __game.chooseDialog(1));                 // con un submenú abierto, además
  await G(() => __game.load(7));
  await wait(300);
  must(!(await state()).detalle && !(await state()).busy && !(await opciones()) && await flag('pecera_disc_partidas') === 3, 'cargar a mitad: titulador colgado o partida tocada');
  await goto('pecera');
  await abrir(); await dejar();
  must(await flag('pecera_disc_partidas') === 4, 'tras cargar, el titulador no vuelve a funcionar');
  ok('guardar/cargar conserva récord, combinación, líneas dichas e historial; cargar con el titulador abierto lo cierra sin tocar la partida cargada');
}

async function secretos() {
  await partida();
  await clearLog();
  await abrir();
  const dichas = new Set();
  let prev = T.usuariosK(T.BRUNO), pubs = 0;
  const lits = LITERALES.map(l => T.A.flatMap(a => T.S.flatMap(s => T.G.map(g => `${a.id}|${s.id}|${g.id}`))).find(k => T.titularK(k) === l));
  for (const k of lits) {
    if (pubs === 5) { await abrir(); pubs = 0; prev = T.usuariosK(T.BRUNO); }
    await componer(k);
    await publicar(); pubs++;
    const s = await st() || {};
    const u = T.usuariosK(k), sec = P.secretos.find(x => x.combo === k);
    must(sec, 'la frase no es secreto: ' + k);
    must(s.etiqueta === sec.etiqueta || pubs === 5, `etiqueta de ${k}: ${s.etiqueta}`);
    const v = T.voz(T.categoria(...T.piezas(k), u, prev), u, prev, dichas);
    if (v) must(await logCount(P.lineas[v]) === 1, `Yoli no dice ${v} con ${k}`);
    prev = u;
    if (pubs === 5) await idle();
  }
  await idle();
  if (await opciones()) await dejar();
  must(await logHas('Plano detalle: TITULADOR'), 'sin plano');
  for (const id of Object.keys(P.lineas)) must(await logCount(P.lineas[id]) <= 1, 'Yoli repite ' + id);
  ok('los nueve secretos del dueño, literales, con su etiqueta; Yoli dice cada línea una sola vez («Los expertos coinciden: esta tarde hay que cerrar las puertas y bajar las persianas», «Los cocineros coinciden: los mejillones de lata están mejor si los preparas con...»…)');
  // la opción del árbol (repetible) y Dar la pieza («Valiente.» solo la 1.ª vez)
  await clearLog();
  G(() => { __game.doVerb('dar', 'yoli_tendencias', 'pieza_opa'); });
  must(await until(() => (__game.currentDialogOptions() || []).includes('Dejarlo')), 'Dar la pieza no abre el titulador');
  await dejar();
  G(() => { __game.doVerb('dar', 'yoli_tendencias', 'pieza_opa'); });
  must(await until(() => (__game.currentDialogOptions() || []).includes('Dejarlo')), 'Dar la pieza (2.ª) no abre el titulador');
  await dejar();
  must(await logCount('Valiente.') === 1, '«Valiente.»: ' + await logCount('Valiente.'));
  await G(() => __game.doVerb('hablar', 'yoli_tendencias'));
  for (let r = 0; r < 2; r++) {
    await G(() => __game.chooseText('¿Me dejas tu titulador?'));
    must(await until(() => (__game.currentDialogOptions() || []).includes('Dejarlo')), 'la opción del árbol no abre el titulador');
    await dejar();
    must((await opciones() || []).includes('¿Me dejas tu titulador?'), 'tras el titulador no se vuelve al árbol (Y0)');
  }
  await G(() => __game.chooseText('¿Tú te crees esos titulares?'));
  must(await logHas('Lo leí en un sitio fiable.') && await logHas('El nuestro.'), 'O17-O20');
  await R.closeDialog(); await idle();
  ok('entradas: Dar la pieza («Valiente.» una vez), la opción repetible del árbol (vuelve a Y0) y Usar el monitor; «¿Tú te crees esos titulares?» → «El nuestro.»');
}

async function posit() {
  await partida({ ...BASE, fax_con_papel: true, rumor_teodoro_n: 1 });
  await abrir(); await componer(P.ganador_por_defecto); await publicar(); await dejar();
  must(await flag('opa_posit') === 1, 'pósit');
  await R.travel('catacumba'); await idle();
  await clearLog();
  await G(() => __game.doVerb('hablar', 'aurora_galerada'));
  must(await flag('opa_posit') === 2, 'Aurora no corrige el pósit');
  for (const t of ['Un pósit de la web en tu pieza', 'para hacer esperar.', 'Cuatro tachones para volver a mi titular.', 'El quinto es para ti, por traérmelo.']) must(await logHas(t), 'falta ' + t);
  await G(() => __game.chooseText('Yoli quiere sacar mi opa'));
  await idle();
  for (const t of ['«Coincidir» pide complemento.', 'RESPUESTA A AURORA: COINCIDO.', '...¿En qué?', 'EN QUE PIDE COMPLEMENTO.']) must(await logHas(t), 'COINCIDO: falta ' + t);
  await R.closeDialog(); await idle();
  must(await G(() => __game.game.content.items.pieza_opa.iconKey(__game.game.viewFor())) === '_posit_tachado', 'icono del pósit tachado');
  await R.travel('pecera'); await idle();
  await clearLog();
  await abrir(); await dejar(); await abrir(); await dejar();
  must(await logCount('Es letra de Aurora.') === 1, 'O11: ' + await logCount('Es letra de Aurora.'));
  ok('pósit: Aurora lo corrige (O7-O10, opa_posit = 2, icono tachado); COINCIDO por fax (O12-O16); Yoli lo nota una vez (O11)');
}

async function pasos34y40() {
  // paso 34: la demo muda (el titular de Bruno → la versión de la demo), sin récord ni flags
  await partida({ ...BASE, pieza_escrita: false, herminia_midio: true }, false);
  await clearLog();
  await G(() => __game.doVerb('usar', 'ordenador_bruno'));
  await idle();
  must(await logHas('Plano detalle: TITULADOR · PRUEBA') && await logHas('No me has avisado.') && await logHas('Uno era yo, comprobando.') && await logHas('Cuando quieras, pruebas tú.'), 'paso 34: M4-M6');
  must(!(await flag('pecera_disc_record')) && !(await flag('pecera_disc_hist')) && !(await flag('opa_posit')), 'la demo guarda récord o flags');
  await G(() => __game.doVerb('usar', 'ordenador_bruno'));
  must(await logCount('No me has avisado.') === 1, 'la demo se repite');
  ok(`paso 34: demo muda ${T.BRUNO} (${T.usuariosK(T.BRUNO)}) → ${T.clave(P.demo_paso_34.at(-1))} (${T.usuariosK(P.demo_paso_34.at(-1))}), «Uno era yo, comprobando.»; sin récord ni flags`);
  // paso 40 sin haber jugado: el ganador por defecto
  await setFlags({ acto_3_iniciado: true, pagina_cerrada: true, dos_ias_vista: true, anselmo_dijo_regla: true });
  await G(() => __game.takeItem('pieza_opa'));
  await R.travel('catacumba'); await clearLog(); await R.travel('pecera'); await idle();
  const def = T.asuntoDe(P.ganador_por_defecto).id;
  must(await flag('discover_ganador') === def, `paso 40: discover_ganador = ${await flag('discover_ganador')}, se esperaba ${def}`);
  for (const t of ['Ya hay ganador.', '¿Y dónde se ve la opa?', 'En la dirección web. Donde no molesta.', 'Plano detalle: PRUEBA · RESULTADO']) must(await logHas(t), 'paso 40: falta ' + t);
  await R.travel('catacumba'); await clearLog(); await R.travel('pecera'); await idle();
  must(!(await logHas('Ya hay ganador.')), 'el paso 40 se repite');
  ok(`paso 40 sin haber jugado: M7-M9 y discover_ganador = '${def}' (el ganador por defecto); una vez`);
  // con récord: gana el del jugador
  await partida({ ...BASE });
  await abrir(); await componer('confirmado|euribor|obvio'); await publicar(); await dejar();
  await setFlags({ acto_3_iniciado: true, dos_ias_vista: true, anselmo_dijo_regla: true });
  await R.travel('catacumba'); await R.travel('pecera'); await idle();
  must(await flag('discover_ganador') === 'confirmado|euribor|obvio'.split('|')[1] && await flag('pecera_disc_ganador_k') === 'confirmado|euribor|obvio', 'con récord gana el del jugador: ' + await flag('discover_ganador'));
  ok('paso 40 con récord ≥ el del ganador por defecto: gana el titular del jugador');
}

async function epilogo() {
  const FIN = ['torno_abierto', 'duelo_inigo_ganado', 'lector_derribado', 'ruben_libre'];
  const casos = [['euribor', 'Bruno. Tu Euríbor: un millón cien mil. Nadie pasó del titular.'],
    [T.asuntoDe(P.ganador_por_defecto).id, `Bruno. ${T.asuntoDe(P.ganador_por_defecto).epi}: un millón cien mil. Nadie pasó del titular.`],
    ['', 'Bruno. Tu opa en Discover: un millón cien mil. Nadie pasó del titular.']];
  for (const [g, linea] of casos) {
    await G(() => __game.newGame()); await idle();
    for (const f of FIN) await setFlags({ [f]: true });
    await setFlags({ discover_ganador: g });
    await clearLog();
    await G(() => __game.scene('final'));
    const orden = [linea, 'Menos esa cuenta que comenta «abrígate» en todo...', 'Se ha leído tu opa entera.', '¿Cuántos, de un millón?',
      'Una. Pero se lo lee TODO.', 'Abrígate tú.', '¡Me ha contestado el periódico!'];
    const pos = await G(o => { const L = __game.log.map(l => l.text); return o.map(s => L.findIndex(t => t.includes(s))); }, orden);
    pos.forEach((p, i) => must(p >= 0 && (i === 0 || p > pos[i - 1]), `epílogo (${g || 'sin ganador'}): «${orden[i]}» falta o fuera de orden`));
    must(!(await logHas('Bruno. Esa cuenta')) && !(await logHas('¿Cuántos lectores?')), 'epílogo: quedan las líneas viejas');
    must(await G(() => !!(__game.state().finished && __game.state().finished.flags.juego_terminado)), 'epílogo: no termina');
    must(await G(() => { const L = __game.log; const i = L.findIndex(l => l.who === 'tarjeta'); const j = L.findIndex(l => String(l.text).includes('¡Me ha contestado el periódico!')); return i > j && j >= 0; }), 'epílogo: la tarjeta no va tras «¡Me ha contestado el periódico!»');
  }
  ok('epílogo (S6, alternativa A): «Bruno. {Tu …}: un millón cien mil…» con ganador del jugador, por defecto y sin escena (variante de seguridad) → «¿Cuántos, de un millón?» → … «Abrígate tú.» → «¡Me ha contestado el periódico!» → tarjeta');
}

async function hojaYRafaga() {
  // la ráfaga: primera entrada con cms_vivo
  await G(() => __game.skipText(true));
  await G(() => __game.newGame()); await idle();
  await setFlags({ intro_vista: true, torno_abierto: true, inigo_presentado: true, silla_libre: true, acto_2_iniciado: true });
  await goto('office'); await setFlags({ cms_vivo: true }); await clearLog();
  const RAF = await G(async () => (await import('/content/rooms/pecera.titulares.datos.js')).RAFAGA);
  if (SHOTS) {
    await G(() => __game.skipText(false));
    G(() => { __game.gotoRoom('pecera'); });
    must(await until(() => !!__game.game.burst, null, 15000), 'no hay ráfaga');
    await wait(2200); await shot('rafaga');
    await until(() => !__game.state().busy, null, 30000);
    await G(() => __game.skipText(true));
  } else await goto('pecera');
  const v = await G(() => (__game.log.find(l => String(l.text).startsWith('VIRAL:')) || {}).text);
  must(v === 'VIRAL: ' + RAF.join(' | ') && RAF.length === 5, 'ráfaga: ' + v);
  must(await logHas('Creo que esto es estar tranquila.'), 'la escena del CMS sigue');
  ok('ráfaga (S1): los cinco avisos al revivir el CMS, en orden, y después la escena de siempre');
  // la hoja por actos
  const mirar = async (nombre) => {
    if (SHOTS) {
      await G(() => __game.skipText(false));
      G(() => { __game.doVerb('mirar', 'lista_mas_leidas'); });
      must(await until(() => (__game.state().detalle || {}).titulo === 'LO MÁS LEÍDO', null, 15000), 'la hoja no se abre');
      await wait(700); await shot(nombre);
      await until(() => !__game.state().busy, null, 30000);
      await G(() => __game.skipText(true));
    } else await G(() => __game.doVerb('mirar', 'lista_mas_leidas'));
  };
  const filas = (v) => G(async (v) => { const m = await import('/content/rooms/pecera.escenas.js'); const api = __game.game.makeApi ? null : null; void api;
    const fake = { flag: (k) => __game.getFlag(k) }; return m.filasHoja(fake, v); }, v);
  await G(() => __game.newGame()); await idle();
  await setFlags({ intro_vista: true, torno_abierto: true, inigo_presentado: true });
  await goto('pecera'); await clearLog();
  await mirar('hoja-acto1');
  must(await logHas('Lo más leído de la web. Impreso. Con chinchetas.'), 'O1');
  await mirar('hoja-acto1-b');
  must(await logHas('Esa ya está vieja. Te imprimo otra.'), 'O2');
  await mirar('hoja-acto1-c');
  must(await logCount('Esa ya está vieja.') === 1, 'O2 dos veces');
  const f1 = await filas('I');
  must(f1.kw === 'PERSIANAS' && f1.filas.length === 5 && f1.extra && f1.extra[0] === 213, 'hoja I: ' + JSON.stringify(f1));
  await setFlags({ cms_vivo: true, cafetera_viral: true, acto_2_iniciado: true });
  await mirar('hoja-acto2');
  const f2 = await filas('II');
  must(f2.kw === 'BORRASCA' && f2.filas[2][1] === 'Un joven da las buenas noches a una cafetera', 'hoja II con la cafetera: ' + JSON.stringify(f2.filas[2]));
  await setFlags({ acto_3_iniciado: true, dos_ias_vista: true, anselmo_dijo_regla: true });
  await mirar('hoja-acto3');
  must(await logHas('Por fin salgo el primero. Soy una borrasca.'), 'O3');
  await setFlags({ discover_ganador: T.asuntoDe(P.ganador_por_defecto).id });
  await mirar('hoja-acto3-ganador');
  const C = T.asuntoDe(P.ganador_por_defecto).C;
  must(await logHas(`El Ibex, a cero. El que lo escribe se ha ido a ${C}.`.replace(/\ba el\b/g, 'al')), 'O4');
  const f3 = await filas('III');
  must(f3.kw === 'BRUNO' && f3.filas[4][1] === T.titularK(P.ganador_por_defecto) && f3.filas[4][2] === '00:01', 'hoja III con ganador: ' + JSON.stringify(f3.filas[4]));
  ok('la hoja «lo más leído» (S3): I (PERSIANAS, fila 213), II (BORRASCA, la cafetera en la fila 3), III (BRUNO; ganador en la fila 5 «· 00:01»); O1-O4, O2 una vez');
}

async function movil() {
  const ctx = await browser.newContext({ viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
  const mp = await ctx.newPage();
  mp.on('console', m => { if (m.type() === 'error') consoleErrors.push('[móvil] ' + m.text()); });
  mp.on('pageerror', e => consoleErrors.push('[móvil] pageerror: ' + e.message));
  await mp.goto(base); await mp.waitForFunction(() => !!window.__game);
  const MG = (fn, a) => mp.evaluate(fn, a);
  await MG(() => { try { localStorage.clear(); } catch (e) { /* */ } });
  await MG(() => __game.skipText(true));
  await MG(() => __game.newGame());
  await MG((o) => { for (const [k, v] of Object.entries(o)) __game.setFlag(k, v); __game.giveItem('pieza_opa'); __game.game.state.once['once:pecera_cms_entrada'] = true; }, BASE);
  await MG(() => __game.gotoRoom('pecera')); await MG(() => __game.waitIdle());
  await MG(() => __game.skipText(false));
  await abrir(mp);
  must(await MG(() => (__game.currentDialogOptions() || []).length) === 5, 'móvil: menú');
  await wait(500); await shot('movil-titulador-vacio', mp);
  // el dedo en la casilla GANCHO del monitor → su menú → «lo que ya sabías»
  await tapV(DX + CHIPX[2] + 48, DY + CHIPY + 7, mp);
  must(await until(() => (__game.currentDialogOptions() || []).includes('Volver'), null, 8000, mp), 'móvil: el toque en la casilla no abre el menú');
  await wait(350);
  await clicOpcion(T.piezas('expertos|persianas|obvio')[2].menu, mp); await esperaMenu(mp);
  for (const i of [0, 1]) {
    await clicOpcion(['Autoridad:', 'Asunto:'][i], mp); await wait(350);
    await clicOpcion(T.piezas('expertos|persianas|obvio')[i].menu, mp); await esperaMenu(mp);
  }
  await wait(300); await shot('movil-titulador-compuesto', mp);
  await clicOpcion('¡Publicar!', mp);
  await wait(1300); await shot('movil-titulador-contador', mp);
  must(await until(t => __game.state().speaking.some(s => s.text === t), P.lineas[P.secretos.find(x => x.combo === 'expertos|persianas|obvio').linea], 20000, mp), 'móvil: Yoli no reacciona');
  await wait(400); await shot('movil-titulador-secreto-yoli', mp);
  await esperaMenu(mp, 30000);
  must(await MG(() => __game.getFlag('pecera_disc_record')) === T.usuariosK('expertos|persianas|obvio'), 'móvil: récord');
  // opa: se hunde
  const opa = 'hidro|opa|punto';
  for (let i = 0; i < 3; i++) { await clicOpcion(['Autoridad:', 'Asunto:', 'Gancho:'][i], mp); await wait(350); await clicOpcion(T.piezas(opa)[i].menu, mp); await esperaMenu(mp); }
  await clicOpcion('¡Publicar!', mp);
  await wait(600); await shot('movil-titulador-hundido', mp);
  await esperaMenu(mp, 30000);
  // un toque fuera del plano lo cierra
  await wait(400);
  await tapV(160, 136, mp);
  must(await until(() => !__game.state().detalle && !__game.state().busy && !__game.currentDialogOptions(), null, 10000, mp), 'móvil: un toque fuera no cierra');
  await ctx.close();
  ok('móvil en horizontal (844 × 390, dedo): toque en la casilla GANCHO del monitor, menús del panel, publicar (312.000, X1), la opa se hunde, un toque fuera cierra');
}

async function capturasPasos() {
  if (!SHOTS) return;
  // demo del paso 34 y paso 40, a velocidad normal
  await partida({ ...BASE, pieza_escrita: false }, false);
  await G(() => __game.skipText(false));
  G(() => { __game.doVerb('usar', 'ordenador_bruno'); });
  must(await until(() => (__game.state().detalle || {}).titulo === 'TITULADOR · PRUEBA', null, 40000), 'no sale la demo');
  await until(() => __game.game.titulador && __game.game.titulador.pubs === 1, null, 20000);
  await wait(300); await shot('paso34-demo');
  await until(() => !__game.state().busy, null, 60000);
  await G(() => __game.skipText(true));
  await setFlags({ acto_3_iniciado: true, dos_ias_vista: true, anselmo_dijo_regla: true, pagina_cerrada: true });
  await G(() => __game.takeItem('pieza_opa'));
  await R.travel('catacumba');
  await G(() => __game.skipText(false));
  G(() => { __game.gotoRoom('pecera'); });
  must(await until(() => (__game.state().detalle || {}).titulo === 'PRUEBA · RESULTADO', null, 40000), 'no sale el resultado del paso 40');
  await until(() => __game.state().speaking.some(s => s.text.includes('Donde no molesta')), null, 30000);
  await wait(500); await shot('paso40');
  await until(() => !__game.state().busy, null, 60000);
  // epílogo: la línea de Yoli
  await G(() => __game.skipText(true));
  await G(() => __game.newGame()); await idle();
  await setFlags({ torno_abierto: true, duelo_inigo_ganado: true, lector_derribado: true, ruben_libre: true, discover_ganador: T.asuntoDe(P.ganador_por_defecto).id });
  await G(() => __game.skipText(false));
  G(() => { __game.game.runScript(api => api.scene('final'), { label: 'final (test-e4)' }); });
  const t0 = Date.now();
  while (!(await G(() => __game.state().speaking.some(s => s.text.includes('un millón cien mil'))))) {
    if (Date.now() - t0 > 120000) throw new StepFail('epílogo: no sale la línea de Discover');
    await G(() => { if (!__game.state().speaking.some(s => s.text.includes('un millón cien mil'))) __game.skipSpeech(); }); await wait(80);
  }
  await wait(500); await shot('epilogo');
  while (!(await G(() => __game.state().speaking.some(s => s.text.includes('de un millón'))))) {
    if (Date.now() - t0 > 160000) throw new StepFail('epílogo: no sale «¿Cuántos, de un millón?»');
    await G(() => { if (!__game.state().speaking.some(s => s.text.includes('de un millón'))) __game.skipSpeech(); }); await wait(80);
  }
  await wait(400); await shot('epilogo-cuantos');
  await G(() => __game.skipText(true));
  await G(() => __game.newGame()); await idle();
  ok('capturas: demo del paso 34, paso 40, epílogo');
}

try {
  await referencia();
  await page.goto(base);
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) { /* */ } });
  await page.reload();
  await page.waitForFunction(() => !!window.__game);
  await R.startDismisser();
  await sesionConRaton();
  await guardarCargar();
  await secretos();
  await posit();
  await pasos34y40();
  await epilogo();
  await hojaYRafaga();
  await movil();
  await capturasPasos();
  const errs = await G(() => __game.errors.filter(e => !e.warn).map(e => e.msg));
  must(!errs.length, 'errores del motor: ' + errs.join(' | '));
  ok('sin errores del motor');
} catch (e) {
  failed = e instanceof StepFail ? e.message : (e && e.stack || String(e));
}
if (failed) {
  const log = await G(() => __game.log.slice(-10).map(l => `${l.who || '—'}: ${l.text}`)).catch(() => []);
  console.log(`\n  ✗ FALLO: ${failed}`);
  if (log.length) console.log('    últimas líneas:\n      ' + log.join('\n      '));
  try { await page.screenshot({ path: path.join(here, 'shots', 'e4-fallo.png') }); } catch (_) { /* ignore */ }
}
if (consoleErrors.length) console.log('\nErrores de consola:\n  ' + consoleErrors.join('\n  '));
console.log(failed || consoleErrors.length ? '\nE4: FALLA' : `\nE4: OK (${n} comprobaciones)`);
await browser.close();
server.close();
process.exit(failed || consoleErrors.length ? 1 : 0);
