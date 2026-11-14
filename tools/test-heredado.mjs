#!/usr/bin/env node
// COMPROBACIONES HEREDADAS de los tests de paquete antiguos (tools/test-paquete-a/b/c/d.mjs, retirados en la integración
// de la reescritura de comedia: los sustituyen tools/test-comedia-p1..p4.mjs). Aquí queda lo que esos tests comprobaban
// y sigue teniendo sentido con el guion nuevo y que ningún test de comedia cubre:
//   · Vestíbulo: torno y ascensor cerrados sin torno_abierto (sin camino físico al interior), tarjeta sin foto ni chicle.
//   · Ascensor con botonera: los 12 trayectos (-1, 0, 1, 2), planta actual marcada, llegada por su puerta, onEnter,
//     «quedarse» y las negativas sin torno_abierto.
//   · Sistemas: el armario 27 sigue abierto (y Rubén dentro) tras guardar y cargar.
//   · Planta 2: la puerta de Marketing lleva a Eventos (Sala Polivalente) con su música.
//   · Partidas guardadas antiguas (plan §3.4): planillo y pósit de baja retirados, flags muertos fuera.
//   node tools/test-heredado.mjs
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
const flag = (k) => G(k => __game.getFlag(k), k);
const setFlag = (k, v = true) => G(([k, v]) => __game.setFlag(k, v), [k, v]);
const verb = (v, t, i) => G(([v, t, i]) => __game.doVerb(v, t, i), [v, t, i || null]);
const idle = () => G(() => __game.waitIdle());
const logHas = (txt) => G(t => __game.log.some(l => String(l.text).includes(t)), txt);
const clearLog = () => G(() => __game.clearLog());
const roomOf = async (id) => { const a = (await state()).actors[id]; return a && a.visible !== false ? a.room : null; };
const goto = async (room, entry) => { await G(([r, e]) => __game.gotoRoom(r, e), [room, entry]); await idle(); };
const opts = () => G(() => __game.currentDialogOptions());
async function opcion(t) { await chooseByText(t); await idle(); }

try {
  await page.goto(base);
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) { /* ignore */ } });
  await page.reload();
  await page.waitForFunction(() => !!window.__game, null, { timeout: 30000 });
  await G(() => __game.skipText(true));
  await R.startDismisser();
  console.log('Comprobaciones heredadas de los tests de paquete antiguos\n');

  // ------------------------------------------------------------ vestíbulo: bloqueos sin torno_abierto (antes paquete A)
  await G(() => __game.newGame());
  await idle();
  must((await state()).room === 'vestibulo', 'la partida no empieza en el vestíbulo');
  await verb('ir', 'torno');
  must((await state()).room === 'vestibulo', 'el torno deja pasar sin torno_abierto');
  await verb('ir', 'ascensor_vestibulo');
  must((await state()).room === 'vestibulo' && !(await opts()), 'el ascensor del vestíbulo deja pasar (o abre la botonera) sin torno_abierto');
  const geo = await G(() => {
    const g = __game.game, w = g.room.walk, L = g.room.def.layout, p = g.player;
    const reach = (pt) => { const path = w.findPath([p.x, p.y], pt); const e = path[path.length - 1] || [p.x, p.y]; return Math.hypot(e[0] - pt[0], e[1] - pt[1]) < 3; };
    return { lift: reach(L.ascensor_vestibulo.walkTo), stairs: reach(L.vestibulo_a_redaccion.walkTo), gate: w.boxes.find(b => b.id === 'paso_torno').enabled };
  });
  must(!geo.lift && !geo.stairs && !geo.gate, `vestíbulo: con el torno cerrado se puede llegar al interior (${JSON.stringify(geo)})`);
  await verb('usar', 'torno', 'tarjeta_becario');
  await verb('usar', 'organigrama', 'tarjeta_becario');
  must(!(await flag('torno_abierto')) && !(await flag('foto_en_organigrama')), 'la tarjeta sin chicle ni foto cambia flags');
  ok('Vestíbulo: torno y ascensor cerrados sin torno_abierto (sin camino físico); tarjeta sin chicle ni foto no cambia nada');

  // ------------------------------------------------------------ ascensor con botonera (antes paquete A)
  await setFlag('torno_abierto', true); await setFlag('inigo_presentado', true);   // la escena 7.2 no interrumpe
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
    const st = await state();
    must(st.room === to, `ascensor ${from} → ${to}: acabo en ${st.room}`);
    const L = await G(r => __game.game.content.rooms[r].art.entries.ascensor, to);
    must(Math.abs(st.player.x - L[0]) < 2, `ascensor ${from} → ${to}: no salgo por la puerta del ascensor`);
    if (to === 'cpd') must((await flag('paco_tickets')) === t0 + 1, 'ascensor → Sistemas: el onEnter de Sistemas no suma el ticket');
  }
  await goto('pecera', 'ascensor');
  await verb('usar', 'ascensor_pecera'); await opcion('Nada, me quedo en esta planta.');
  must((await state()).room === 'pecera', 'ascensor: «quedarse» me ha movido');
  await setFlag('torno_abierto', false);
  for (const to of ['cpd', 'ecosistema']) {
    await verb('usar', 'ascensor_pecera'); await opcion(FLOORS[to][1]);
    must((await state()).room === 'pecera', `bloqueo del ascensor hacia ${to}: sin torno_abierto me ha llevado`);
  }
  await setFlag('torno_abierto', true);
  ok('Ascensor: 12 trayectos, planta actual marcada, llegada por su puerta, onEnter, «quedarse» y negativas sin torno');

  // ------------------------------------------------------------ el Lector Medio nunca preside (antes paquete D; orden del dueño)
  const lectorEn = async (room) => { await goto(room); return G((room) => { const a = __game.game.actors.lector_medio; return { at: a && a.room === room ? [Math.round(a.x), Math.round(a.y)] : null, layout: __game.game.content.rooms[room].art.layout }; }, room); };
  const pj = await lectorEn('pajarera'), mesa = pj.layout && pj.layout.mesa_direccion && pj.layout.mesa_direccion.rect;
  must(pj.at && mesa && (pj.at[0] < mesa[0] - 10 || pj.at[0] > mesa[0] + mesa[2] + 10), `Despachos: el Lector Medio, tras la mesa grande (${JSON.stringify(pj.at)} / ${JSON.stringify(mesa)})`);
  ok('El Lector Medio, en los Despachos, lejos de la mesa grande');

  // ------------------------------------------------------------ armario 27 tras guardar y cargar (antes paquete A)
  for (const f of ['torno_abierto', 'acto_2_iniciado', 'cms_vivo', 'acto_3_iniciado', 'pagina_cerrada', 'vio_borde_perforado', 'dos_ias_vista', 'anselmo_dijo_regla']) await setFlag(f);
  await goto('cpd');
  must((await G(() => __game.objects().find(o => o.id === 'armario_27').state)) === 'cerrado', 'armario_27: cerrado antes de la revelación');
  await verb('tirar', 'papel_continuo');
  await idle();
  must(await flag('ruben_encontrado'), 'Tirar papel_continuo no pone ruben_encontrado');
  await G(() => __game.save('t_armario')); await G(() => __game.load('t_armario')); await idle();
  must((await G(() => __game.objects().find(o => o.id === 'armario_27').state)) === 'abierto' && (await roomOf('ruben')) === 'cpd', 'armario_27 abierto (y Rubén) tras guardar y cargar');
  ok('Sistemas: el armario 27 sigue abierto, con Rubén, tras guardar y cargar');

  // ------------------------------------------------------------ el Lector Medio en la Sala del clímax: nunca en la cabecera
  for (const f of ['sala_abierta', 'chaqueta_en_lector']) await setFlag(f);
  const sa = await lectorEn('sala_amazonas'), L = sa.layout || {};
  const preside = (L.gervasio_acta && L.gervasio_acta.preside && L.gervasio_acta.preside.at) || [286, 101];
  const od = L.orden_del_dia && L.orden_del_dia.rect;
  must(sa.at && Math.hypot(sa.at[0] - preside[0], sa.at[1] - preside[1]) >= 60, `Sala Amazonas: el Lector Medio a menos de 60 px de la cabecera (${JSON.stringify(sa.at)})`);
  must(sa.at[1] >= 104, `Sala Amazonas: el Lector Medio con los pies por encima de y 104 (${sa.at[1]})`);
  if (od) must(sa.at[0] >= od[0] - 40 && sa.at[0] <= od[0] + od[2] + 40, `Sala Amazonas: el Lector Medio lejos de la pantalla (${JSON.stringify(sa.at)} / ${JSON.stringify(od)})`);
  ok('El Lector Medio en la Sala (Acto III): a ≥ 60 px de la cabecera, junto a la pantalla, pies en y ≥ 104');

  // ------------------------------------------------------------ planta 2 → Eventos (antes paquete D)
  await goto('ecosistema');
  await clearLog();
  const puerta = await G(() => (__game.game.content.rooms.ecosistema.objects || []).find(o => o.exit && o.exit.room === 'eventos'));
  must(!!puerta, 'Marketing y Comercial no tiene salida a Eventos');
  await verb('ir', puerta.id); await idle();
  must((await state()).room === 'eventos', 'la puerta de Marketing no lleva a Eventos');
  must(await G(() => __game.game.audio.requestedId === 'm_eventos' || __game.game.audio.currentId === 'm_eventos'), 'Eventos sin su música');
  ok('Planta 2: la puerta de Marketing lleva a Eventos, con su música');

  // ------------------------------------------------------------ migración de partidas guardadas (plan §3.4)
  await G(() => {
    const k = __game.game.slotKey('t_vieja');
    const st = JSON.parse(JSON.stringify(__game.game.state));
    st.inventory = st.inventory.concat(['planillo', 'posit_baja_ruben']);
    st.flags.bandeja_diseno_abierta = true; st.flags.rumor_atun_n = 2; st.flags.leoncio_acepta_alta = true; st.flags.ruben_libre = false;
    localStorage.setItem(k, JSON.stringify({ v: 3, date: Date.now(), roomName: 'x', state: st }));
  });
  await G(() => __game.load('t_vieja')); await idle();
  const mig = await state();
  must(!mig.inventory.includes('planillo') && !mig.inventory.includes('posit_baja_ruben'), `migración: siguen los objetos retirados (${mig.inventory})`);
  must(mig.inventory.includes('ticket_n1') && mig.flags.ruben_libre === true, 'migración: el pósit de baja no se convierte en ticket_n1 + ruben_libre');
  must(!('bandeja_diseno_abierta' in mig.flags) && !('rumor_atun_n' in mig.flags) && !('leoncio_acepta_alta' in mig.flags), 'migración: siguen flags retirados');
  ok('Partida antigua: fuera planillo y pósit (→ ticket_n1 + ruben_libre) y los flags retirados');

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
  try { await page.screenshot({ path: path.join(here, 'shots', 'heredado-fallo.png') }); } catch (_) { /* ignore */ }
}
if (consoleErrors.length) console.log('\nErrores de consola:\n  ' + consoleErrors.join('\n  '));
console.log(failed || consoleErrors.length ? '\nHEREDADO: FALLA' : `\nHEREDADO: OK (${n} comprobaciones)`);
await browser.close();
server.close();
process.exit(failed || consoleErrors.length ? 1 : 0);
