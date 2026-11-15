#!/usr/bin/env node
// ENMIENDA E6 §2.7 (paquete PF · Titulador): la quinta publicación se lee como las demás y sale por «Dejarlo»; el pie
// enseña LA CASA (225.000) y, al batirla, «· TÚ: n» en oro con fogonazo, temblor y sonido (una sola vez, sin línea nueva
// de Yoli). Con ratón real (960 × 600) y con el dedo en móvil horizontal (844 × 390).
//   node tools/test-e6-pf.mjs              (capturas en tools/shots/e6-pf-*.png)
//   node tools/test-e6-pf.mjs --sin-capturas
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
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

const T = await import(pathToFileURL(path.join(root, 'content/rooms/pecera.titulador.js')).href);
const P = T.P, CASA = T.CASA;
const DX = 8, DY = 2, DW = 304, DH = 102;                       // el plano (pecera.titulador.js)
const NORMAL = 'cocineros|mejillones|obvio';                    // 291.600, sin secreto
const OTRA = 'expertos|persianas|corte';                        // 260.000, sin secreto
const SECRETA = 'expertos|persianas|obvio';                     // 312.000, secreto
must(T.usuariosK(NORMAL) > CASA && T.usuariosK(OTRA) > CASA && T.usuariosK(SECRETA) > CASA, 'las combinaciones de prueba no baten la casa');
must(!P.secretos.some(x => x.combo === NORMAL || x.combo === OTRA) && P.secretos.some(x => x.combo === SECRETA), 'secretos de prueba mal elegidos');
// cinco combinaciones por debajo de la casa, todas distintas (para que cada publicación cambie algo)
const BAJAS = [];
for (const a of T.A) for (const s of T.S) for (const g of T.G) {
  const k = `${a.id}|${s.id}|${g.id}`, u = T.usuariosK(k);
  if (u > 300 && u < 100000 && !P.secretos.some(x => x.combo === k) && !BAJAS.some(b => b.split('|')[1] === s.id) && BAJAS.length < 5) BAJAS.push(k);
}
must(BAJAS.length === 5, 'no hay cinco combinaciones bajas');

const server = createServer(root);
await new Promise(r => server.listen(0, r));
const base = `http://localhost:${server.address().port}/`;
const browser = await chromium.launch();
const BASE = { intro_vista: true, torno_abierto: true, inigo_presentado: true, silla_libre: true, gertrudis_saludada: true, cms_vivo: true,
  acto_2_iniciado: true, rep_11: true, casilla_fuente: true, pieza_escrita: true, herminia_midio: true };

/** Un «jugador»: página + utilidades (ratón o dedo). */
async function jugador({ movil = false } = {}) {
  const ctx = movil
    ? await browser.newContext({ viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 })
    : await browser.newContext({ viewport: { width: 960, height: 600 } });
  const pg = await ctx.newPage();
  const tag = movil ? '[móvil] ' : '';
  pg.on('console', m => { if (m.type() === 'error') consoleErrors.push(tag + m.text()); });
  pg.on('pageerror', e => consoleErrors.push(tag + 'pageerror: ' + e.message));
  await pg.goto(base); await pg.waitForFunction(() => !!window.__game);
  const R = createRunner(pg);
  const G = (fn, a) => pg.evaluate(fn, a);
  const J = {
    pg, R, G, movil,
    flag: (k) => G(k => __game.getFlag(k), k),
    idle: () => G(() => __game.waitIdle()),
    until: async (fn, arg, ms = 20000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await pg.evaluate(fn, arg)) return true; await wait(40); } return false; },
    opciones: () => G(() => __game.currentDialogOptions()),
    detalle: () => G(() => (__game.state().detalle || {}).titulo || null),
    st: () => G(() => { const s = __game.game.titulador; return s ? { combo: s.combo.slice(), u: s.u, pubs: s.pubs, etiqueta: s.etiqueta } : null; }),
    logCount: (t) => G(t => __game.log.filter(l => String(l.text).includes(t)).length, t),
    shot: async (nombre) => { if (SHOTS) await pg.screenshot({ path: path.join(here, 'shots', `e6-pf-${nombre}.png`) }); },
    // sonidos y temblor, para ver la celebración
    async espiar() {
      await G(() => {
        window.__sfx = []; window.__shakes = 0;
        if (window.__espiando) return;
        window.__espiando = true;
        const a = __game.game.audio, f = a.sfx.bind(a);
        a.sfx = (...x) => { window.__sfx.push(typeof x[0] === 'string' ? x[0] : 'nota'); return f(...x); };
        const gm = __game.game, sh = gm.shake.bind(gm);
        gm.shake = (...x) => { window.__shakes++; return sh(...x); };
      });
    },
    buenos: () => G(() => window.__sfx.filter(s => s === 'good').length),
    temblores: () => G(() => window.__shakes),
    async partida(flags = BASE) {
      await G(() => __game.skipText(true));
      await G(() => __game.newGame()); await J.idle();
      await G(o => { for (const [k, v] of Object.entries(o)) __game.setFlag(k, v); __game.giveItem('pieza_opa'); __game.game.state.once['once:pecera_cms_entrada'] = true; }, flags);
      await G(() => __game.gotoRoom('pecera')); await J.idle();
      await G(() => __game.skipText(false));
      await J.espiar();
    },
    async abrir() {
      pg.evaluate(() => { __game.doVerb('usar', 'monitor_yoli'); });
      must(await J.until(() => { const d = __game.currentDialogOptions(); return !!(d && d.includes('Dejarlo')); }, null, 15000), 'el titulador no abre su menú');
    },
    /** Clic o toque en una opción (por el principio de su texto) o en un punto virtual. */
    async opcion(txt) {
      await pg.waitForTimeout(330);
      const o = await J.opciones();
      const i = (o || []).findIndex(x => x.replace(/^› /, '').startsWith(txt));
      must(i >= 0, `no está «${txt}» en ${JSON.stringify(o)}`);
      const p = await G(i => __game.optionPos(i), i);
      if (movil) await pg.touchscreen.tap(p.x, p.y); else await pg.mouse.click(p.x, p.y);
    },
    async punto(x, y) {
      await pg.waitForTimeout(330);
      const p = await G(([x, y]) => __game.virtualToClient(x, y), [x, y]);
      if (movil) await pg.touchscreen.tap(p.x, p.y); else await pg.mouse.click(p.x, p.y);
    },
    async menuVuelve(ms = 40000) {
      must(await J.until(() => { const d = __game.currentDialogOptions(); return !!(d && d.includes('Dejarlo') && d.length > 1) && !__game.state().speaking.length; }, null, ms), 'no vuelve el menú del titulador');
    },
    async componer(k) {
      const ps = T.piezas(k), st = await J.st();
      for (let i = 0; i < 3; i++) {
        if (st.combo[i] === ps[i].id) continue;
        await J.opcion(['Autoridad:', 'Asunto:', 'Gancho:'][i]);
        await wait(300);
        await J.opcion(ps[i].menu);
        await J.menuVuelve();
      }
    },
    /** Compone y publica con el ratón/dedo; deja el menú de vuelta (salvo la quinta). */
    async publica(k, { quinta = false } = {}) {
      await J.componer(k);
      await J.opcion('¡Publicar!');
      if (quinta) must(await J.until(() => (__game.currentDialogOptions() || []).join('|') === 'Dejarlo', null, 40000), 'tras la 5.ª no se ofrece solo «Dejarlo»');
      else await J.menuVuelve();
    },
    /** Píxeles de oro del pie en el búfer virtual (izquierda: x 12..140; centro: 150..230). */
    oro: (x0, x1) => G(([a, b]) => {
      const buf = __game.game.buf, c = buf.getContext('2d');
      const d = c.getImageData(a, 2 + 102 - 7, b - a, 5).data;
      let m = 0;
      for (let i = 0; i < d.length; i += 4) if (d[i] > 220 && d[i + 1] > 190 && d[i + 1] < 235 && d[i + 2] > 90 && d[i + 2] < 150) m++;
      return m;
    }, [x0, x1]),
    cerrar: () => ctx.close(),
  };
  return J;
}
const OROIZQ = [12, 150], OROCEN = [165, 225];

// ======================================================================== 1. cinco publicaciones normales
async function cinco(J, etiqueta) {
  await J.partida();
  await J.abrir();
  must(await J.detalle() === 'TITULADOR · DISCOVER', 'el plano no es el titulador');
  must(await J.oro(...OROCEN) > 0 && await J.oro(...OROIZQ) === 0, 'antes de publicar: «RÉCORD» (oro) en el centro y las instrucciones a la izquierda');
  await J.publica(BAJAS[0]);
  must((await J.st()).pubs === 1, 'primera publicación');
  must(await J.oro(...OROIZQ) === 0, 'LA CASA (sin batir) no es oro');
  await wait(400); await J.shot(`pie-meta${etiqueta}`);
  for (let k = 1; k < 4; k++) await J.publica(BAJAS[k]);
  must((await J.st()).pubs === 4 && await J.detalle() === 'TITULADOR · DISCOVER', 'cuatro publicaciones');
  await J.publica(BAJAS[4], { quinta: true });
  const s5 = await J.st();
  must(s5.pubs === 5 && s5.u === T.usuariosK(BAJAS[4]) && s5.etiqueta, 'la 5.ª no ha acabado: ' + JSON.stringify(s5));
  await wait(3000);                                                      // la quinta se queda: no se cierra a ~1,2 s
  must((await J.st() || {}).pubs === 5 && await J.detalle() === 'TITULADOR · DISCOVER' && (await J.opciones()).join('|') === 'Dejarlo', 'la 5.ª publicación se cierra sola');
  must(await G_noHabla(J), 'Yoli sigue hablando 3 s después: la línea no se ha podido leer');
  await J.shot(`quinta${etiqueta}`);
  await J.opcion('Dejarlo');
  must(await J.until(() => !__game.state().detalle && !__game.state().busy && !__game.currentDialogOptions(), null, 8000), '«Dejarlo» no cierra el titulador tras la 5.ª');
  must(await J.flag('pecera_disc_partidas') === 1 && (await J.flag('pecera_disc_hist')).length === 4, 'partidas / historial');
  must(await J.flag('pecera_casa_batida') !== true && !(await J.G(() => __game.game.state.once['once:pecera_casa_batida'])), 'sin batir la casa, no hay celebración');
  must(await J.buenos() === 0, 'sonó «good» sin batir la casa');
}
const G_noHabla = async (J) => J.G(() => !__game.state().speaking.length);

// ======================================================================== 2. batir la casa (normal y secreta)
async function batirNormal(J) {
  await J.partida();
  await J.abrir();
  await J.publica(BAJAS[0]);
  await J.componer(NORMAL);
  const t0 = await J.temblores();
  await J.opcion('¡Publicar!');
  must(await J.until(() => window.__sfx.includes('good'), null, 20000), 'no suena «good» al batir la casa');
  await J.shot(`celebracion${J.movil ? '-movil' : ''}`);
  must(await J.temblores() > t0, 'no tiembla');
  await J.menuVuelve();
  const st = await J.st();
  must(st.u === T.usuariosK(NORMAL) && await J.flag('pecera_disc_record') === 291600 && await J.flag('pecera_disc_record_k') === NORMAL, 'récord 291.600: ' + JSON.stringify(st));
  must(await J.G(() => __game.game.state.once['once:pecera_casa_batida'] === true), 'falta la marca «pecera_casa_batida»');
  must(await J.buenos() === 1, '«good» no suena exactamente una vez');
  // sin línea nueva de Yoli: solo las que le tocan a la combinación (voz de la fórmula)
  const lineas = Object.values(P.lineas);
  const dichas = await J.G(() => __game.log.filter(l => l.who === 'yoli_tendencias').map(l => l.text));
  must(dichas.every(l => lineas.includes(l)), 'Yoli dice algo que no es de sus líneas: ' + JSON.stringify(dichas));
  must(dichas.length <= 2, 'Yoli habla de más al batir la casa: ' + JSON.stringify(dichas));
  must(await J.oro(...OROIZQ) > 0 && await J.oro(...OROCEN) === 0, 'el pie no enseña «LA CASA: 225.000 · TÚ: n» en oro (y sin RÉCORD duplicado)');
  await wait(2300); await J.shot(`pie-tu${J.movil ? '-movil' : ''}`);
  // una segunda combinación que bate la casa: ni fogonazo ni sonido otra vez
  await J.publica(OTRA);
  must(await J.buenos() === 1, 'la celebración se repite');
  await J.opcion('Dejarlo');
  must(await J.until(() => !__game.state().detalle && !__game.state().busy, null, 8000), 'no sale');
}

async function batirSecreta(J) {
  await J.partida();
  await J.abrir();
  await J.componer(SECRETA);
  await J.opcion('¡Publicar!');
  const sec = P.secretos.find(x => x.combo === SECRETA);
  must(await J.until(t => __game.state().speaking.some(s => s.text === t), P.lineas[sec.linea], 30000), 'Yoli no dice la línea del secreto');
  must(await J.buenos() === 1, 'la celebración de la casa no suena con un secreto');
  await J.menuVuelve();
  must(await J.oro(...OROIZQ) > 0, 'sin «· TÚ» tras el secreto');
  const dichas = await J.G(() => __game.log.filter(l => l.who === 'yoli_tendencias').length);
  must(dichas === 1, 'Yoli dice ' + dichas + ' líneas con el secreto (1 esperada)');
  await J.opcion('Dejarlo');
  must(await J.until(() => !__game.state().detalle && !__game.state().busy, null, 8000), 'no sale');
}

// ======================================================================== 3. guardar / cargar con el récord; salir a mitad
async function guardarCargar(J) {
  await J.partida();
  await J.abrir();
  await J.publica(NORMAL);
  await J.opcion('Dejarlo');
  must(await J.until(() => !__game.state().detalle && !__game.state().busy, null, 8000), 'no sale');
  must(await J.flag('pecera_disc_record') === 291600, 'récord antes de guardar');
  await J.G(() => __game.save(6));
  await J.G(() => __game.newGame()); await J.idle();
  must(!(await J.flag('pecera_disc_record')) && !(await J.G(() => __game.game.state.once['once:pecera_casa_batida'])), 'partida nueva con récord o con la casa batida');
  await J.G(() => __game.load(6)); await J.idle();
  must(await J.flag('pecera_disc_record') === 291600 && await J.G(() => __game.game.state.once['once:pecera_casa_batida'] === true), 'cargar: récord o «casa batida» no vuelven');
  await J.espiar();
  await J.G(() => __game.gotoRoom('pecera')); await J.idle();
  await J.abrir();
  await J.publica(BAJAS[0]);
  must(await J.oro(...OROIZQ) > 0, 'cargada la partida, el pie no enseña «· TÚ» con el récord guardado');
  await J.publica(NORMAL);
  must(await J.buenos() === 0, 'tras cargar, la casa se «bate» otra vez');
  // salir a mitad: Esc con 2 publicaciones hechas, cuenta una partida y no deja nada colgado
  const partidas = await J.flag('pecera_disc_partidas');
  await J.pg.keyboard.press('Escape');
  must(await J.until(() => !__game.state().detalle && !__game.state().busy && !__game.currentDialogOptions(), null, 8000), 'Esc a mitad deja el titulador colgado');
  must(await J.flag('pecera_disc_partidas') === partidas + 1, 'salir a mitad no cuenta la partida');
  // cargar con el titulador a medias (2.ª publicación) lo cierra sin tocar la partida cargada
  await J.abrir();
  await J.publica(BAJAS[1]);
  await J.G(() => __game.load(6));
  await wait(400);
  must(!(await J.G(() => __game.state().detalle)) && !(await J.opciones()) && await J.flag('pecera_disc_partidas') === 1, 'cargar a mitad: titulador colgado o partida tocada');
}

async function salidas5(J) {
  // en la quinta, Esc y un clic fuera también salen (como «Dejarlo»)
  for (const como of ['esc', 'fuera']) {
    await J.partida();
    await J.abrir();
    for (let k = 0; k < 4; k++) await J.publica(BAJAS[k]);
    await J.publica(BAJAS[4], { quinta: true });
    await wait(500);
    if (como === 'esc') await J.pg.keyboard.press('Escape'); else await J.punto(160, 136);
    must(await J.until(() => !__game.state().detalle && !__game.state().busy && !__game.currentDialogOptions(), null, 8000), `la 5.ª no sale con ${como}`);
    must(await J.flag('pecera_disc_partidas') === 1, `${como}: partidas`);
  }
}

// ======================================================================== ejecución
try {
  const M = await jugador();
  await M.pg.evaluate(() => { try { localStorage.clear(); } catch (e) { /* */ } });
  await M.pg.reload(); await M.pg.waitForFunction(() => !!window.__game);
  await M.R.startDismisser();
  await cinco(M, '');
  ok('ratón: cinco publicaciones; la quinta, con su cifra, etiqueta y línea de Yoli, sigue abierta 3 s después con solo «Dejarlo» (ya no se cierra a ~1,2 s); «Dejarlo» sale; pie con «LA CASA: 225.000»');
  await batirNormal(M);
  ok('ratón: batir la casa con una combinación normal (cocineros·mejillones·obvio, 291.600): «good», temblor y fogonazo una sola vez; pie en oro «LA CASA: 225.000 · TÚ: 291.600»; sin línea nueva de Yoli; la segunda (260.000) no repite');
  await batirSecreta(M);
  ok('ratón: batir la casa con una secreta (expertos·persianas·obvio, 312.000): celebración, línea del secreto y nada más');
  await guardarCargar(M);
  ok('guardar/cargar conserva récord y «casa batida» (el pie sigue en oro y no se repite); salir a mitad con Esc cuenta la partida; cargar a mitad cierra sin tocar nada');
  await salidas5(M);
  ok('la quinta sale también con Esc y con un clic fuera del plano');
  await M.cerrar();

  const D = await jugador({ movil: true });
  await D.pg.evaluate(() => { try { localStorage.clear(); } catch (e) { /* */ } });
  await D.R.startDismisser();
  await cinco(D, '-movil');
  ok('móvil horizontal con el dedo: cinco publicaciones, la quinta queda abierta hasta tocar «Dejarlo»');
  await batirNormal(D);
  ok('móvil horizontal con el dedo: batir la casa (una vez) y pie con «· TÚ»');
  await batirSecreta(D);
  ok('móvil horizontal con el dedo: batir la casa con una secreta');
  await salidas5(D);
  ok('móvil: la quinta sale con Esc y con un toque fuera del plano');
  await D.cerrar();
  if (consoleErrors.length) throw new StepFail('errores de consola');
} catch (e) {
  failed = e instanceof StepFail ? e.message : (e && e.stack || String(e));
}
if (failed) console.log(`\n  ✗ FALLO: ${failed}`);
if (consoleErrors.length) console.log('\nErrores de consola:\n  ' + consoleErrors.join('\n  '));
console.log(failed || consoleErrors.length ? '\nE6-PF: FALLA' : `\nE6-PF: OK (${n} comprobaciones)`);
await browser.close();
server.close();
process.exit(failed || consoleErrors.length ? 1 : 0);
