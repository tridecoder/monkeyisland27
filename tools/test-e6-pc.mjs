#!/usr/bin/env node
// PRUEBA DEL PAQUETE PC DE LA ENMIENDA E6 (Sistemas y Vestíbulo: docs/guion2/ENMIENDA_E6.md §2.1, §2.6 B8, §4.1 y
// X2/X3/X11), con RATÓN REAL (clic en verbo, en el objeto y en la opción; clics para pasar los globos; Esc de teclado).
// `window.__game` solo prepara el estado (flags del acto) y comprueba resultados. Capturas en tools/shots/e6-pc-*.png.
// Cubre:
//   1 corte «MIENTRAS, EN LA REDACCIÓN» sin apagón previo (apagon_n = 0): R-3 → plano detalle con ese título, las dos
//     líneas de Yoli (en orden, antes del coro), coro, +318, `cms_vivo`, `cpd_corte_visto`; dura ≈ 7 s sin tocar nada;
//     captura antes y después de «PUBLICADO»
//   2 con apagón previo (apagon_n = 1, el camino principal): sin corte ni Yoli
//   3 intentos fuera de orden: R-1/R-2/R-4/R-5 y «Mejor no.» antes de la R-3 no cortan; con `cpd_corte_visto` ya puesto
//     (p. ej. tras cargar), no se repite
//   4 saltarlo con Esc: el plano se cierra, el resto de la cinemática acaba (coro, `cms_vivo`, Eutimio se gira), no se abre
//     el menú y el control vuelve; nada colgado
//   5 guardar/cargar: guardar antes de la R-3, hacer el corte, cargar → sin `cms_vivo` ni `cpd_corte_visto` y la R-3
//     encendida; repetir → el corte vuelve a salir una vez; guardar después y cargar → todo puesto, sin corte
//   6 camino del registro: Mirar el registro (ticket 3) y luego el regletero → corte. El camino antiguo de la Redacción
//     (enchufe con `vio_ticket_3`, `pecera.escenas.js` `cmsVivo`) es de PB: se comprueba si ya está hecho, si no se avisa
//   7 armario 27 (B8): en la revelación, con `evaristo_escuchado`, ya no sale «Cuarenta y ocho mil. Con coma…»
//   8 §4.1 de cpd.js y vestibulo.js: ninguna «actual» queda y todas las «nuevas» están (contra docs/guion2/e6/tabla.mjs);
//     el torno sin foto ya no dice «Consto en la web» (E028)
//   node tools/test-e6-pc.mjs
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from './serve.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const shots = path.join(here, 'shots');
fs.mkdirSync(shots, { recursive: true });
const server = createServer(path.resolve(here, '..'));
await new Promise(r => server.listen(0, r));
const base = `http://localhost:${server.address().port}/`;
const browser = await chromium.launch();
let failures = 0, checks = 0;
const ok = (c, m) => { checks++; if (c) console.log('  ✓ ' + m); else { failures++; console.log('  ✗ ' + m); } };
const consoleErrors = [];
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
class Fail extends Error {}
const fail = (m) => { throw new Fail(m); };

const page = await browser.newPage({ viewport: { width: 960, height: 600 } });
page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));
const G = (fn, a) => page.evaluate(fn, a);
const wait = (ms) => page.waitForTimeout(ms);
const st = () => G(() => __game.state());
const flag = (k) => G(k => __game.getFlag(k), k);
/** Estado de un objeto de la sala (getObjState del motor; la clave del guardado lleva la sala delante). */
const ost = (id) => G(id => __game.game.getObjState(id).state, id);
const norm = s => String(s).toLowerCase().replace(/[«»"“”'’]/g, '').replace(/\s+/g, ' ').trim();
const shot = (name) => page.screenshot({ path: path.join(shots, `e6-pc-${name}.png`) });
const logTexts = () => G(() => __game.log.map(l => l.text));
const logHas = async (s) => (await logTexts()).some(t => String(t).includes(s));
const logCount = async (s) => (await logTexts()).filter(t => String(t).includes(s)).length;

// ------------------------------------------------------------------ ratón real (como tools/play-mouse.mjs)
const SAFE = [302, 147];
async function vclick(x, y, button = 'left') {
  const p = await G(([x, y]) => __game.virtualToClient(x, y), [x, y]);
  await page.mouse.move(p.x, p.y); await wait(35);
  await page.mouse.click(p.x, p.y, { button }); await wait(45);
}
/** Deja correr el juego pasando cada globo con un clic real; vuelve con menú abierto o con el juego libre. */
async function settle(timeout = 60000, onDetalle = null) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeout) {
    const s = await G(() => { const g = __game.game; return { mode: g.mode, busy: g.busy > 0 || !!g.acting, choice: !!g.choice, speaking: g.speeches.filter(x => x.blocking).length, detalle: g.detalle ? g.detalle.titulo : null }; });
    if (s.detalle && onDetalle) { const f = onDetalle; onDetalle = null; await f(s.detalle); }
    if (s.choice) return s;
    if (!s.busy) { await wait(60); if (!(await G(() => __game.game.busy || __game.game.acting || __game.game.choice))) return s; continue; }
    if (s.speaking) { await wait(140); await vclick(...SAFE); continue; }
    await wait(80);
  }
  fail('settle: tiempo agotado');
}
async function pointFor(id) {
  const r = await G((id) => {
    const g = __game.game, cam = Math.round(g.camX);
    const o = __game.objects().find(o => o.id === id && o.visible !== false);
    if (!o) return { missing: true };
    const cx = o.x + o.w / 2; let best = null, bd = Infinity;
    for (let y = Math.max(0, Math.floor(o.y)); y < Math.min(144, o.y + o.h); y++) for (let x = Math.max(cam, Math.floor(o.x)); x < Math.min(cam + 320, o.x + o.w); x++) {
      const t = g.pickAt(x - cam, y);
      if (t && t.id === id) { const d = Math.hypot(x - cx, y - (o.y + o.h * 0.5)); if (d < bd) { bd = d; best = [x - cam, y]; } }
    }
    return best ? { pt: best } : { covered: true };
  }, id);
  if (r.missing) fail(`«${id}» no está en la sala`);
  if (r.covered) fail(`«${id}» está tapado: ningún píxel lo elige`);
  return r.pt;
}
async function clickVerb(v) { const p = await G(v => { const i = __game.game.verbs.findIndex(x => x.id === v); return [[6, 57, 107][Math.floor(i / 3)] + 10, [157, 171, 185][i % 3] + 6]; }, v); await vclick(...p); }
async function verbOn(v, id, onDetalle) { await settle(); const pt = await pointFor(id); await clickVerb(v); await vclick(...pt); return settle(60000, onDetalle); }
async function chooseOption(want) {
  await settle();
  for (let k = 0; k < 30; k++) {
    const r = await G((want) => {
      const g = __game.game, ch = g.choice; if (!ch) return { none: true };
      const nrm = s => String(s).toLowerCase().replace(/[«»"“”'’]/g, '').replace(/\s+/g, ' ').trim();
      const i = ch.options.findIndex(o => nrm(o).includes(nrm(want)));
      if (i < 0) return { notfound: ch.options };
      const lines = ch.layout; if (!lines) return { wait: true };
      if (ch.escape != null && g.realTime - ch.t0 < 320) return { wait: true };
      const li = lines.findIndex(l => l.opt === i), sc = ch.scroll || 0;
      if (li < sc) return { arrow: [310, 152] };
      if (li >= sc + 5) return { arrow: [310, 186] };
      return { pt: [24, 145 + (li - sc) * 10 + 6] };
    }, want);
    if (r.none) fail(`no hay opciones en pantalla para «${want}»`);
    if (r.notfound) fail(`no existe la opción «${want}»: ${JSON.stringify(r.notfound)}`);
    if (r.wait) { await wait(60); continue; }
    if (r.pt) { await vclick(...r.pt); return settle(); }
    await vclick(...r.arrow);
  }
  fail(`no llego a la opción «${want}»`);
}
async function options() { await settle(); return G(() => __game.currentDialogOptions()); }
async function closeMenu() {
  for (let k = 0; k < 4; k++) {
    const o = await options(); if (!o) return;
    const f = o.find(x => /^me voy|^ahora vuelvo|^mejor no/i.test(norm(x)));
    if (!f) fail('sin despedida: ' + JSON.stringify(o));
    await chooseOption(f);
  }
}
/** Partida nueva en Sistemas con los flags dados (sin escenas de entrada que tapen). */
async function fresh(flags, room = 'cpd') {
  await page.goto(base + '?room=vestibulo');
  await page.waitForFunction(() => window.__game && __game.state().mode === 'play');
  await G(() => { __game.skipText(true); return __game.waitIdle(); });
  await G((F) => { for (const [k, v] of Object.entries(F)) __game.setFlag(k, v); }, flags);
  await G(([r]) => __game.gotoRoom(r, 'ascensor'), [room]);
  await G(() => { __game.skipSpeech(); return __game.waitIdle(); });
  await G(() => { __game.skipText(false); __game.clearLog(); });
}


const ACTO2 = { intro_vista: true, torno_abierto: true, inigo_presentado: true, acto_2_iniciado: true, silla_libre: true,
  gertrudis_saludada: true, cafetera_viral: true, cafetera_viral_vista: true, chaqueta_cogida: true, chaqueta_en_lector: true,
  aurora_conto_pasos: true, aurora_hablo_fax: true };
const CORTE = 'MIENTRAS, EN LA REDACCIÓN';
const Y1 = '¡Estamos ciegos! ¿Hay alguien leyendo? ¿HAY ALGUIEN AHÍ FUERA?';
const Y2 = '...Ha entrado una pieza. ¡Ha entrado una pieza! ¡El CMS va!';
const titulo = () => G(() => (__game.game.detalle ? __game.game.detalle.titulo : null));
const corteAbierto = async () => (await titulo()) === CORTE;
const logIdx = async (s) => (await logTexts()).findIndex(t => String(t).includes(s));
/** Abre el regletero con clics y elige `r` con un clic, sin esperar a que acabe lo que venga. */
async function regleteroElige(r) {
  for (let k = 0; k < 3; k++) {
    await verbOn('tirar', 'regleta_r3');
    await settle();
    if (await G(() => !!__game.game.choice)) break;
    await wait(300);
  }
  const pt = await G((want) => {
    const ch = __game.game.choice; const i = ch.options.findIndex(o => o.startsWith(want));
    const li = ch.layout.findIndex(l => l.opt === i); return [24, 145 + (li - (ch.scroll || 0)) * 10 + 6];
  }, r);
  await wait(400);
  await vclick(...pt);
}
async function esperaCorte(ms = 4000) { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await corteAbierto()) return true; await wait(40); } return false; }
async function idle() { await G(() => __game.waitIdle()); }

try {
  // ================================================================ 1 · corte sin apagón previo
  console.log('§2.1 Corte «MIENTRAS, EN LA REDACCIÓN» (Acto II, sin apagón previo)');
  await fresh(ACTO2);
  ok(!(await flag('apagon_n')) && !(await flag('cpd_corte_visto')), 'partida sin apagón jugable (apagon_n = 0)');
  await regleteroElige('R-3');
  const abre = await esperaCorte();
  const t0 = Date.now();
  ok(abre, `R-3 → plano detalle «${CORTE}»`);
  ok(await flag('cpd_corte_visto') === true, 'cpd_corte_visto se pone al empezar el corte');
  ok((await ost('regleta_r3')) === 'apagada' && !(await flag('cms_vivo')), 'durante el corte: la R-3 apagada y el CMS aún sin volver');
  await wait(1700); await shot('corte-ciegos');
  // sin tocar nada: las líneas avanzan solas; captura con PUBLICADO
  for (let i = 0; i < 200 && !(await logHas(Y2)); i++) await wait(50);
  await wait(900); await shot('corte-publicado');
  while (await corteAbierto() && Date.now() - t0 < 20000) await wait(50);
  const dur = Date.now() - t0;
  ok(dur >= 5000 && dur <= 10000, `el corte dura ≈ 7-9 s sin tocar nada (${(dur / 1000).toFixed(1)} s)`);
  await settle();
  let s = await st();
  const i1 = await logIdx(Y1), i2 = await logIdx(Y2), ic = await logIdx('CORO: ¡Ha sido Diseño!');
  ok(i1 >= 0 && i2 > i1 && ic > i2, `las dos líneas de Yoli, en orden y antes del coro (${i1} < ${i2} < ${ic})`);
  const quien = await G((t) => __game.log.filter(l => l.text === t).map(l => l.who), Y1);
  ok(quien.length === 1 && quien[0] === 'yoli_tendencias', `la dice Yoli (log: ${JSON.stringify(quien)}), una sola vez`);
  ok(await logHas('Plano detalle: ' + CORTE), 'el registro apunta el plano');
  ok(s.flags.cms_vivo && await logHas('Trescientos dieciocho tickets nuevos') && await logHas('Tengo un hueco. Uno.'), 'después, como hoy: cms_vivo, los +318 y Eutimio que se gira');
  ok(!s.detalle && s.mode === 'play' && !(await G(() => __game.game.busy)), 'el plano se cierra y vuelve el control');

  // ================================================================ 3b · no se repite (ya visto)
  console.log('\n§2.1 No se repite: con cpd_corte_visto (y apagon_n = 0)');
  await fresh({ ...ACTO2, cpd_corte_visto: true });
  await regleteroElige('R-3');
  ok(!(await esperaCorte(2500)), 'sin corte');
  await settle();
  ok((await flag('cms_vivo')) && !(await logHas('Estamos ciegos')), 'cms_vivo, sin Yoli');

  // ================================================================ 2 · con apagón previo
  console.log('\n§2.1 Con apagón previo (apagon_n = 1, camino principal)');
  await fresh({ ...ACTO2, apagon_n: 1 });
  await regleteroElige('R-3');
  ok(!(await esperaCorte(2500)), 'sin corte');
  await settle();
  s = await st();
  ok(s.flags.cms_vivo && !s.flags.cpd_corte_visto && !(await logHas('Estamos ciegos')) && !(await logHas('Plano detalle: ' + CORTE)), 'cms_vivo; sin Yoli ni plano; cpd_corte_visto sin poner');
  ok(await logHas('CORO: ¡Ha sido Diseño!'), 'la rejilla, como hoy');

  // ================================================================ 3 · fuera de orden
  console.log('\n§2.1 Intentos fuera de orden (antes de la R-3)');
  await fresh(ACTO2);
  for (const r of ['R-1', 'R-2', 'R-4', 'R-5', 'Mejor no.']) {
    await G(() => __game.clearLog());
    await regleteroElige(r);
    const c = await esperaCorte(1800);
    await settle();
    ok(!c && !(await flag('cpd_corte_visto')) && !(await flag('cms_vivo')), `${r}: sin corte`);
  }

  // ================================================================ 5 · guardar/cargar (de la misma partida)
  console.log('\n§2.1 Guardar y cargar');
  await G(() => __game.save('e6pc'));
  await regleteroElige('R-3');
  ok(await esperaCorte(), 'el corte sale tras los fallos');
  await settle();
  ok(await flag('cms_vivo') && await flag('cpd_corte_visto'), 'acabado: cms_vivo y cpd_corte_visto');
  await G(() => __game.save('e6pc2'));
  await G(() => __game.load('e6pc'));
  s = await st();
  ok(!s.flags.cms_vivo && !s.flags.cpd_corte_visto && (await ost('regleta_r3')) === 'encendida' && !s.detalle, 'cargar la de antes: sin cms_vivo ni cpd_corte_visto, la R-3 encendida, sin plano');
  await G(() => __game.clearLog());
  await regleteroElige('R-3');
  ok(await esperaCorte(), 'repetir tras cargar: el corte vuelve a salir');
  await settle();
  ok(await logCount(Y1) === 1 && await flag('cms_vivo'), 'una sola vez, y cms_vivo');
  await G(() => __game.load('e6pc2'));
  s = await st();
  ok(s.flags.cms_vivo && s.flags.cpd_corte_visto && (await ost('regleta_r3')) === 'apagada' && !s.detalle, 'cargar la de después: todo puesto, sin plano');
  await G(() => __game.clearLog());
  await verbOn('tirar', 'regleta_r3');
  ok(await logHas('Ya está apagada.') && !(await logHas('Estamos ciegos')), 'Tirar otra vez tras cargar: la de hoy, sin corte');

  // ================================================================ 4 · saltar con Esc
  console.log('\n§2.1 Saltar el corte con Esc');
  await fresh(ACTO2);
  await regleteroElige('R-3');
  ok(await esperaCorte(), 'el corte está abierto');
  await wait(800);
  await page.keyboard.press('Escape');
  await wait(300);
  await idle();
  s = await st();
  ok(!s.detalle && !s.menu, 'Esc: el plano se cierra y no abre el menú');
  ok(s.flags.cms_vivo && s.flags.cpd_corte_visto && (await ost('regleta_r3')) === 'apagada', 'Esc: el estado queda completo (cms_vivo, cpd_corte_visto, R-3 apagada)');
  ok(await logHas('CORO: ¡Ha sido Diseño!') && await logHas('Tengo un hueco. Uno.'), 'Esc: el resto de la cinemática acaba (coro y Eutimio)');
  ok(s.mode === 'play' && !(await G(() => __game.game.busy || __game.game.cutscene)), 'Esc: vuelve el control');
  await G(() => __game.clearLog());
  await verbOn('mirar', 'regleta_r3');
  ok(await logHas('El regletero. La del pósit, apagada.'), 'después de saltarlo, el juego sigue: Mirar el regletero');
  // la Redacción, de vuelta: con luz y el CMS vivo (estado de hoy tras la regleta)
  await G(() => __game.skipText(true));
  await G(() => __game.gotoRoom('pecera', 'ascensor'));
  await G(() => { __game.skipSpeech(); return __game.waitIdle(); });
  s = await st();
  ok(s.room === 'pecera' && !(await G(() => !!__game.game.apagon)), 'volver a la Redacción: con luz');
  await G(() => __game.skipText(false));

  // ================================================================ 6 · camino del registro
  console.log('\n§2.1 Camino del registro');
  await fresh(ACTO2);
  await verbOn('mirar', 'registro_tickets');
  ok(await flag('vio_ticket_3') && await logHas('Nº 3: «El CMS se cuelga con la pantalla de la Redacción».'), 'Mirar registro: ticket 3 (E270, sin año) y vio_ticket_3');
  await regleteroElige('R-3');
  ok(await esperaCorte(), 'con el registro leído y sin apagón, el regletero corta a la Redacción');
  await settle();
  ok(await flag('cms_vivo') && await logCount(Y1) === 1, 'cms_vivo y Yoli una vez');
  // [P11] fuera el camino alternativo del ticket nº 3: con el registro leído, el enchufe da el apagón de siempre
  await fresh({ ...ACTO2, vio_ticket_3: true }, 'pecera');
  await G(() => __game.skipText(true));
  await G(async () => { await __game.doVerb('tirar', 'enchufe_pantalla'); await __game.waitIdle(); });
  await G(() => __game.skipText(false));
  ok(!(await flag('cms_vivo')) && (await flag('apagon_n')) === 1 && await logHas(Y1) && !(await logHas('SALVO TICKET')), '[P11] con el registro leído, Tirar del enchufe: el apagón (el CMS no vuelve desde arriba)');

  // ================================================================ 7 · armario 27 (B8)
  console.log('\n§2.6 B8 · el armario 27');
  await fresh({ ...ACTO2, acto_3_iniciado: true, pagina_cerrada: true, dos_ias_vista: true, anselmo_dijo_regla: true, evaristo_escuchado: true, cms_vivo: true, cpd_cms_sumado: true });
  await G(() => __game.skipText(true));
  await verbOn('tirar', 'papel_continuo');
  await G(() => { __game.skipSpeech(); return __game.waitIdle(); });
  await G(() => __game.skipText(false));
  ok(await flag('ruben_encontrado') && await logHas('A mí, en bocadillos de atún. A Íñigo le pagan por mí 48.000 al mes.'), 'revelación: Brais dice lo de los 48.000');
  ok(!(await logHas('Con coma')) && !(await logHas('Eso es un compañero')), 'sin «Cuarenta y ocho mil. Con coma…» (B8) ni «…compañero» (B2)');
  // [P14] la foto: «Solo salgo de fondo, en las de Eventos.» (antes «Bueno, una. En Eventos. Al fondo.», E244 tumbada)
  ok(await logHas('Mi baja está en un pósit del tablero de Anselmo, en POR HACER.') && await logHas('Nadie me ha hecho nunca una foto. Solo salgo de fondo, en las de Eventos.'), 'X11 aplicada; [P14] la foto, en las de Eventos');
  await G(async () => { await __game.doVerb('hablar', 'ruben'); });
  await G(() => __game.chooseText('Ahora vuelvo'));
  await G(() => __game.waitIdle());

  // ================================================================ 8 · §4.1 en los ficheros
  console.log('\n§4.1 Filas de cpd.js y vestibulo.js (tabla.mjs)');
  const { T, TUMBADAS } = await import('../docs/guion2/e6/tabla.mjs');
  const leer = (f) => fs.readFileSync(path.resolve(here, '../content', f), 'utf8');
  // ENMIENDA E7 (tabla_e7.mjs) restaura o cambia algunas de estas filas: las que E7 sustituye ya no son de E6
  const E7 = new Set((await import('../docs/guion2/e7/tabla_e7.mjs')).filas.map(r => r.fichero + '|' + r.actual));
  // guion nuevo, tanda 2 ([P14]): E251 («No me muevo» → «No me voy») y E244 (la foto de Eventos) cambian otra vez
  const G3 = new Set(['E251', 'E244']);
  const filas = T.filter(r => /rooms\/(cpd|vestibulo)\.js$/.test(r[0]) && !E7.has(r[0] + '|' + r[2]) && !G3.has(r[4]));
  const deE7 = T.filter(r => /rooms\/(cpd|vestibulo)\.js$/.test(r[0])).length - filas.length;
  const q = (t) => "'" + t.replace(/'/g, "\\'") + "'";
  const malA = filas.filter(r => leer(r[0]).includes(q(r[1])));
  const malN = filas.filter(r => r[2] !== null && !leer(r[0]).includes(q(r[2])));
  ok(filas.length + deE7 === 43 && !malA.length, `${filas.length} filas (+ ${deE7} que cambia E7): ninguna «actual» queda${malA.length ? ': ' + malA.map(r => r[4]).join(', ') : ''}`);
  ok(!malN.length, `todas las «nuevas» están${malN.length ? ': faltan ' + malN.map(r => r[4]).join(', ') : ''}`);
  const tumb = TUMBADAS.filter(r => /rooms\/(cpd|vestibulo)\.js$/.test(r[0]) && !G3.has(r[4]));
  const malT = tumb.filter(r => !leer(r[0]).includes(q(r[1])));
  ok(!malT.length, `las ${tumb.length} tumbadas siguen con su original${malT.length ? ': ' + malT.map(r => r[4]).join(', ') : ''}`);
  const cpdSrc = leer('rooms/cpd.js');
  // [P11] Eutimio tiene un solo árbol (antes P0 y P1): la clave cambiada está una vez
  ok((cpdSrc.match(/Me entero de todo\. No arreglo nada\.'/g) || []).length === 1 && !cpdSrc.includes("'Me entero de todo.'"), 'X3: la clave cambiada (un solo árbol, [P11])');
  // E028: el torno sin foto
  await fresh({ ...ACTO2, torno_abierto: false }, 'vestibulo');
  await G(() => { __game.giveItem('tarjeta_becario'); });
  await G(() => __game.clearLog());
  await G(async () => { await __game.doVerb('usar', 'torno', 'tarjeta_becario'); });
  await settle();
  ok(await logHas('USUARIO NO CONSTA EN ORGANIGRAMA.') && !(await logHas('Consto en la web')), 'E028: el torno sin foto, y Bruno calla');
  await G(() => __game.clearLog());
  await verbOn('mirar', 'celestino');
  ok(await logHas('Celestino, el conserje, con la bufanda del Ibex.'), 'E025 con ratón real (Mirar a Celestino)');
} catch (e) {
  failures++;
  console.log('  ✗ ABORTADO: ' + (e instanceof Fail ? e.message : e.stack));
  await shot('fallo').catch(() => {});
}

const errs = consoleErrors.filter(e => !/favicon/i.test(e));
ok(!errs.length, `sin errores de consola${errs.length ? ': ' + errs.slice(0, 5).join(' | ') : ''}`);
const gerr = await G(() => (__game.errors || []).map(e => String(e.msg || e))).catch(() => []);
ok(!gerr.length, `sin errores del juego${gerr.length ? ': ' + gerr.slice(0, 5).join(' | ') : ''}`);
console.log(`\n${checks - failures}/${checks} comprobaciones OK`);
await browser.close();
server.close();
process.exit(failures ? 1 : 0);
