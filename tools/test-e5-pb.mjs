#!/usr/bin/env node
// ENMIENDA E5 · paquete PB (Redacción): prueba con RATÓN REAL de lo que el paquete añade en `pecera`.
//   1. Apagón jugable (§2.2): Tirar el enchufe con clics → oscuridad con dos focos y Anselmo andando con la linterna;
//      nombres a oscuras al pasar el ratón; verbos a oscuras (Yoli, Anselmo, taza «NO», la salida del Vending: no sale);
//      Anselmo no se para aunque se le apunte; «Guardar» bloqueado; cierre al llegar Anselmo (≤ 12 s), al Usar el enchufe
//      y a los 12 s; cargar una partida guardada a mitad de la ventana → luz y Anselmo en su mesa; escalada n = 2.
//   2. Columna del kanban (§2.5): rotulador antes del álbum (negativa), boli muerto, álbum a Anselmo (album_validado),
//      Usar el tablero sin rotulador, tres columnas equivocadas (y «Tráeme algo…» a la tercera), SALIDA EN VALOR (con el
//      táper en la mano de Rubén) y DESCOPEADO; el otro orden (álbum antes que rotulador); guardar/cargar a mitad y al final.
//   3. Coro por acto (K01-K04), solo con Bruno cerca. 4. F4 `junto()` sin fundido (Bruno corre). 5. F9 Custodia.
//   6. La frase de Anselmo («El modelo es de fuera. El prompt es de dentro.» / «Eso lo hace nuestro.») se oye una vez.
//   node tools/test-e5-pb.mjs              (capturas en tools/shots/e5-pb-*.png)
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from './serve.mjs';

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
const consoleErrors = [];
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const FRASE = 'El modelo es de fuera. El prompt es de dentro.';

const page = await browser.newPage({ viewport: { width: 960, height: 600 } });
page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));
await page.goto(base + '?room=pecera');
await page.waitForFunction(() => window.__game && __game.state().mode === 'play');
const G = (fn, a) => page.evaluate(fn, a);
const until = async (fn, arg, ms = 8000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await G(fn, arg)) return true; await sleep(40); } return false; };
const idle = () => G(() => __game.waitIdle());
const flag = (k) => G(k => __game.getFlag(k), k);
const logHas = (t) => G(t => __game.log.some(l => String(l.text).includes(t)), t);
const logCount = (t) => G(t => __game.log.filter(l => String(l.text).includes(t)).length, t);
const shot = (n) => page.screenshot({ path: path.join(shots, `e5-pb-${n}.png`) });

// flags sin escenas de entrada que tapen lo que se prueba
const BASE = { intro_vista: true, torno_abierto: true, inigo_presentado: true, silla_libre: true, gertrudis_saludada: true,
  chaqueta_cogida: true, acto_2_iniciado: true };
async function partida(flags = {}, onces = []) {
  await G(() => __game.skipText(true));
  await G(() => __game.newGame()); await idle();
  await G(([F, O]) => { for (const [k, v] of Object.entries(F)) __game.setFlag(k, v); for (const o of O) __game.game.state.once['once:' + o] = true; },
    [{ ...BASE, ...flags }, ['pecera_viral', 'pecera_cms_entrada', 'pecera_yoli_banner', ...onces]]);
  await G(() => __game.gotoRoom('pecera', 'ascensor')); await idle();
  await G(() => { __game.skipSpeech(); __game.game.speeches.length = 0; __game.clearLog(); });
}
/** Pone la cámara de modo que se vea `id` (la cámara deja de seguir a Bruno hasta `seguir()`). */
const verA = (id) => G((id) => {
  const g = __game.game, o = __game.objects().find(o => o.id === id);
  const cx = o.kind === 'actor' ? o.x + o.w / 2 : o.x + o.w / 2;
  g.camFollow = null; g.camTarget = null; g.camX = Math.max(0, Math.min(g.room.width - 320, Math.round(cx - 160)));
}, id);
const seguir = () => G(() => { __game.game.camFollow = __game.game.G.player; });
const clicEn = async (id) => { await verA(id); await sleep(60); const c = await G(id => __game.screenPos(id), id); await page.mouse.click(c.x, c.y); };
const clicVerbo = async (v) => { const c = await G(v => __game.verbPos(v), v); await page.mouse.click(c.x, c.y); await sleep(40); };
const clicInv = async (it) => { const c = await G(i => __game.invPos(i), it); await page.mouse.click(c.x, c.y); await sleep(40); };
/** Verbo con el ratón: clic en el verbo, (en el objeto del inventario) y en el destino. */
async function raton(verbo, id, item, esperar = true) {
  await clicVerbo(verbo);
  if (item) await clicInv(item);
  await clicEn(id);
  if (esperar) { await sleep(150); await idle(); await seguir(); }
}
const opciones = () => G(() => __game.currentDialogOptions());
async function clicOpcion(texto) {
  if (!(await until(() => !!__game.currentDialogOptions()))) return false;
  await sleep(330);                                     // los primeros 250 ms de un menú no cuentan
  const o = await opciones();
  const i = o.findIndex(x => x.replace(/^› /, '') === texto || x.startsWith(texto));
  if (i < 0) return false;
  const p = await G(i => __game.optionPos(i), i);
  await page.mouse.click(p.x, p.y);
  await sleep(100);
  return true;
}
const hover = async (id) => { await verA(id); await sleep(60); const c = await G(id => __game.screenPos(id), id); await page.mouse.move(c.x, c.y); await sleep(120); return G(() => __game.game.sentenceText()); };

try {
  // ====================================================================== 0. la frase, en el código
  console.log('§0 la frase de Anselmo, entera, en un solo sitio del contenido');
  const fuentes = [];
  const walk = (d) => { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else if (f.endsWith('.js')) fuentes.push(p); } };
  walk(path.join(root, 'content'));
  const conFrase = fuentes.filter(f => fs.readFileSync(f, 'utf8').split('\n').some(l => l.includes(`'${FRASE}'`) || l.includes(`'Eso lo hace nuestro.'`)));
  ok(conFrase.length === 1 && conFrase[0].endsWith('pecera.escenas.js'), `solo pecera.escenas.js (pecera_herminia_mide) dice la frase: ${conFrase.map(f => path.relative(root, f)).join(', ')}`);

  // ====================================================================== 1. apagón jugable
  console.log('\n§2.2 apagón jugable (ratón real)');
  await partida();
  await G(() => __game.skipText(false));            // modo rápido = ventana de 0 ms: aquí, a velocidad real
  const ax0 = await G(() => __game.game.actors.anselmo_monolito.x);
  const sp0 = await G(() => __game.game.actors.anselmo_monolito.speed);
  const tc0 = Date.now();
  await raton('tirar', 'enchufe_pantalla', null, false);
  ok(await until(() => !!__game.getFlag('pecera_oscuras') && !__game.state().busy, null, 40000), `clic Tirar + enchufe → ventana a oscuras (pecera_oscuras) y control devuelto (cutscene: ${Date.now() - tc0} ms)`);
  const t0 = await G(() => __game.game.time);
  const ap = await G(() => { const g = __game.game; return { on: !!g.apagon, spots: g.apagon && g.apagon.spots.length, nombres: g.apagon && g.apagon.nombres, icp: !!(g.apagon && g.apagon.interceptar), noSave: !!g.noSave, n: __game.getFlag('apagon_n'), cms: !!__game.getFlag('cms_vivo') }; });
  ok(ap.on && ap.spots === 2 && ap.nombres && ap.icp && ap.n === 1 && !ap.cms, `apagón con dos focos, nombres e interceptor; apagon_n = 1, sin cms_vivo (${JSON.stringify(ap)})`);
  ok(await logHas('¡Estamos ciegos!') && await logHas('Ha entrado una pieza'), 'Yoli «¡Estamos ciegos!…» y «…Ha entrado una pieza…», dentro de la cutscene');
  ok(ap.noSave, '«Guardar» bloqueado durante la ventana (api.sinGuardar)');
  await G(() => __game.skipText(true));             // los verbos a oscuras, con el texto rápido (la ventana ya está abierta)
  await sleep(500);
  ok(await G(x0 => __game.game.actors.anselmo_monolito.x < x0 - 5, ax0), 'Anselmo echa a andar hacia el enchufe');
  // nombres a oscuras
  const nT = await hover('taza_no'), nO = await hover('ordenador_bruno'), nY = await hover('yoli_tendencias'), nC = await hover('coro_desarrollo'), nK = await hover('kanban');
  ok(/algo que dice que no$/.test(nT) && /algo$/.test(nO) && /alguien que cuenta$/.test(nY) && /tres sombras enfadadas$/.test(nC) && /algo con pósits$/.test(nK),
    `nombres a oscuras: «${nT}» · «${nO}» · «${nY}» · «${nC}» · «${nK}»`);
  // verbos a oscuras
  await G(() => __game.clearLog());
  await raton('hablar', 'yoli_tendencias');
  ok(await logHas('¡Chsss! Estoy contando. Diecisiete. Dieciocho.'), 'Hablar con Yoli → «¡Chsss! Estoy contando…»');
  await raton('coger', 'taza_no');
  ok(await logHas('DEV 3: No.'), 'Coger la taza «NO» → DEV 3 «No.»');
  await raton('hablar', 'anselmo_monolito');
  ok(await logHas('No me tapes la linterna. Voy a mi enchufe.'), 'Hablar con Anselmo → «No me tapes la linterna…»');
  await raton('mirar', 'pecera_a_office');
  await clicEn('pecera_a_office'); await sleep(150); await idle(); await seguir();   // un clic sin verbo: ir a la salida
  const nv = await logCount('No veo nada. Solo a Yoli'), sala = await G(() => __game.state().room);
  ok(sala === 'pecera' && nv >= 2, `Mirar / Ir a la salida del Vending → «No veo nada…» (×${nv}) y no sale (${sala})`);
  // apuntar a Anselmo con un verbo elegido: no se para
  await clicVerbo('empujar');
  await verA('anselmo_monolito'); await sleep(60);
  const xa = await G(() => __game.game.actors.anselmo_monolito.x);
  const ca = await G(() => __game.screenPos('anselmo_monolito'));
  await page.mouse.move(ca.x, ca.y);
  await sleep(1500);
  const xb = await G(() => __game.game.actors.anselmo_monolito.x);
  ok(xb < xa - 20, `con «Empujar» elegido y el ratón encima, Anselmo sigue andando (${Math.round(xa)} → ${Math.round(xb)})`);
  await G(() => { __game.game.ui.verb = null; }); await seguir();
  // captura: los dos focos con Anselmo a la vista
  await until(() => __game.game.actors.anselmo_monolito.x < 800 || !__game.getFlag('pecera_oscuras'), null, 12000);
  await G(() => { const g = __game.game; g.camFollow = null; g.camTarget = null; g.camX = 520; });
  await page.mouse.move(5, 5);
  await sleep(150); await shot('apagon');
  await G(() => { __game.game.camFollow = __game.game.G.player; });
  // cierre: Anselmo llega (≤ 12 s)
  ok(await until(() => !__game.getFlag('pecera_oscuras') && !__game.game.apagon && !__game.state().busy, null, 20000), 'la ventana se cierra sola');
  const t1 = await G(() => __game.game.time);
  const fin = await G(() => ({ n: __game.getFlag('apagon_n'), cms: !!__game.getFlag('cms_vivo'), noSave: !!__game.game.noSave, sp: __game.game.actors.anselmo_monolito.speed, nf: !!__game.game.actors.anselmo_monolito.noFreeze, x: Math.round(__game.game.actors.anselmo_monolito.x) }));
  ok(fin.n === 1 && !fin.cms && !fin.noSave && fin.sp === sp0 && !fin.nf, `cierre (Anselmo llega antes de los 12 s): luz, apagon_n 1, sin cms_vivo, se puede guardar (${JSON.stringify(fin)})`);
  ok(await logHas('¿La quieres apagada? Ese cable baja a Sistemas. Que te la apague Paco.') && !(await logHas('Si funciona, la gente se acostumbra.')), 'cierre con «…Que te la apague Paco.» (D06), sin la línea vieja');
  ok(fin.x > 1000, `Anselmo, de vuelta en su mesa (x ${fin.x})`);
  // escalada n = 2, como hoy
  await G(() => __game.clearLog());
  await G(() => __game.doVerb('tirar', 'enchufe_pantalla'));
  ok(await flag('apagon_n') === 2 && await logHas('¡Otra! ¡Ha entrado otra!') && !(await G(() => !!__game.game.apagon)) && !(await flag('pecera_oscuras')), 'segundo tirón: la escalada n = 2 de siempre (cutscene, sin ventana)');

  // --- Usar el enchufe a los 2 s
  await partida();
  await G(() => __game.skipText(false));            // modo rápido = ventana de 0 ms: aquí, a velocidad real
  await raton('tirar', 'enchufe_pantalla', null, false);
  await until(() => !!__game.getFlag('pecera_oscuras') && !__game.state().busy, null, 40000);
  await sleep(1800);
  await G(() => __game.clearLog());
  await raton('usar', 'enchufe_pantalla');
  ok(!(await flag('pecera_oscuras')) && !(await G(() => !!__game.game.apagon)) && await logHas('Que te la apague Paco.') && !(await flag('cms_vivo')) && await flag('apagon_n') === 1,
    'Usar el enchufe a los 2 s → Bruno enchufa, luz, cierre de Anselmo, sin cms_vivo');

  // --- a los 12 s (Anselmo, entretenido: no llega)
  await partida();
  await G(() => __game.skipText(false));            // modo rápido = ventana de 0 ms: aquí, a velocidad real
  await raton('tirar', 'enchufe_pantalla', null, false);
  await until(() => !!__game.getFlag('pecera_oscuras') && !__game.state().busy, null, 40000);
  const tA = await G(() => { __game.game.actors.anselmo_monolito.speed = 4; return __game.game.time; });
  await until(() => __game.game.busy > 0, null, 20000);                        // empieza el cierre (guion bloqueante)
  const tB = await G(() => __game.game.time);
  await until(() => !__game.getFlag('pecera_oscuras') && !__game.state().busy, null, 40000);
  ok(tB - tA >= 11000 && tB - tA <= 13500 && await logHas('Que te la apague Paco.') && await G(() => __game.game.actors.anselmo_monolito.speed === 54),
    `a los 12 s se cierra aunque Anselmo no haya llegado (${Math.round(tB - tA)} ms); vuelve a su paso de siempre`);

  // --- cargar a mitad de la ventana
  await partida();
  await G(() => __game.skipText(false));            // modo rápido = ventana de 0 ms: aquí, a velocidad real
  await raton('tirar', 'enchufe_pantalla', null, false);
  await until(() => !!__game.getFlag('pecera_oscuras') && !__game.state().busy, null, 40000);
  await sleep(1500);
  await G(() => { __game.game.noSave = false; __game.save(2); __game.game.noSave = true; });   // una partida guardada «a oscuras» (versión vieja)
  await G(() => __game.load(2));
  await sleep(400); await idle();
  const ld = await G(() => { const g = __game.game, a = g.actors.anselmo_monolito; return { ap: !!g.apagon, osc: !!__game.getFlag('pecera_oscuras'), n: __game.getFlag('apagon_n'), x: Math.round(a.x), sp: a.speed, nf: !!a.noFreeze, noSave: !!g.noSave, mon: __game.state().objects['pecera:monitor_yoli'] }; });
  ok(!ld.ap && !ld.osc && ld.n === 1 && ld.x > 1060 && ld.sp === 54 && !ld.nf && !ld.noSave, `cargar a mitad de la ventana → luz, Anselmo en su mesa, apagon_n se queda (${JSON.stringify(ld)})`);
  await sleep(2500);
  ok(!(await G(() => !!__game.game.apagon)) && await G(() => Math.round(__game.game.actors.anselmo_monolito.x)) > 1060, 'tras cargar, la ventana vieja no vuelve (ni PLIN ni cierre colgados)');

  // ====================================================================== 2. columna del kanban
  console.log('\n§2.5 la columna del kanban (ratón real)');
  const III = { cms_vivo: true, acto_3_iniciado: true, ruben_encontrado: true, dos_ias_vista: true, anselmo_dijo_regla: true, herminia_midio: true,
    pieza_escrita: true, discover_ganador: 'opa', taper_dado: true };
  await partida(III);
  await G(() => { __game.giveItem('rotulador_rojo'); __game.giveItem('album_eventos'); __game.giveItem('boli_muerto'); });
  await raton('usar', 'kanban', 'rotulador_rojo');
  ok(await logHas('Ni se te ocurra. De mi tablero se sale hecho o muerto.') && !(await opciones()), 'rotulador antes del álbum → «Ni se te ocurra…» (sin menú)');
  await raton('usar', 'kanban', 'boli_muerto');
  ok(await logHas('Un boli no pinta en pizarra. Este, ni en papel.'), 'boli muerto con el tablero → su línea');
  await raton('dar', 'anselmo_monolito', 'album_eventos');
  ok(await flag('album_validado') === true && !(await G(() => __game.state().inventory.includes('album_eventos'))) && await logHas('Las fotos me valen. Pero yo no escribo columnas nuevas.'),
    'álbum a Anselmo → album_validado, el álbum se lo queda él, «Las fotos me valen…»');
  await G(() => __game.takeItem('rotulador_rojo'));
  await raton('usar', 'kanban');
  ok(await logHas('Una columna nueva pide rotulador. El de Anselmo no sale de Desarrollo.'), 'Usar el tablero sin rotulador → «…pide rotulador…»');
  await G(() => __game.giveItem('rotulador_rojo'));
  const MAL = [['DESPEDIDOS', 'Eso es «muerto» con corbata.'], ['HECHO (DE VERDAD)', '«De verdad» no es un estado.'], ['FIRMAR EN PAPEL', 'Eso es tuyo. Mi tablero no es tu diario.']];
  for (const [col, linea] of MAL) {
    await raton('usar', 'kanban', 'rotulador_rojo', false);
    const o = await (async () => { await until(() => !!__game.currentDialogOptions()); return opciones(); })();
    if (col === 'DESPEDIDOS') ok(JSON.stringify(o) === JSON.stringify(['DESPEDIDOS', 'HECHO (DE VERDAD)', 'FIRMAR EN PAPEL', 'Mejor no.']), `sin rep_13 ni oyo_descopear, tres columnas y «Mejor no.»: ${JSON.stringify(o)}`);
    await clicOpcion(col);
    if (col === 'DESPEDIDOS') { await until(() => __game.state().objects['pecera:kanban'] && __game.state().objects['pecera:kanban'].state === 'mal_0', null, 3000); await verA('kanban'); await sleep(80); await shot('kanban-mal'); }
    await idle(); await seguir();
    ok(await logHas(linea) && !(await flag('posit_descopeado')) && !(await G(() => (__game.state().objects['pecera:kanban'] || {}).state)), `clic en ${col} → Anselmo la borra con la manga: «${linea}»`);
  }
  ok(await logCount('Tráeme algo que no sea ni hecho ni muerto. Eso no existe.') === 1 && await flag('pecera_columna_mal_n') === 3, '«Tráeme algo…» a la tercera, una vez');
  await raton('usar', 'kanban', 'rotulador_rojo', false);
  await clicOpcion('Mejor no.'); await idle(); await seguir();
  ok(!(await flag('posit_descopeado')) && !(await opciones()), '«Mejor no.» no hace nada');
  // guardar a mitad (álbum validado, sin columna) y seguir
  await G(() => __game.save(3));
  await G(() => { __game.setFlag('rep_13', true); __game.setFlag('oyo_descopear', true); __game.clearLog(); });
  await raton('usar', 'kanban', 'rotulador_rojo', false);
  await until(() => !!__game.currentDialogOptions());
  ok((await opciones()).includes('SALIDA EN VALOR') && (await opciones()).includes('DESCOPEADO'), 'con rep_13 y oyo_descopear, salen SALIDA EN VALOR y DESCOPEADO');
  // (en modo rápido la escena pasa entera en un instante: se espía la mano de Rubén con un setter)
  await G(() => { window.__taper = false; const r = __game.game.actors.ruben; let h = r.hold;
    Object.defineProperty(r, 'hold', { configurable: true, get: () => h, set: (v) => { h = v; if (v && v.item === 'taper_huerfano' && r.room === 'pecera') window.__taper = true; } }); });
  await clicOpcion('SALIDA EN VALOR');
  await idle();
  ok(await G(() => window.__taper), 'con taper_dado, Rubén va a la ventana con el táper en la mano');
  await idle(); await seguir();
  const s1 = await G(() => ({ pd: __game.getFlag('posit_descopeado'), rl: __game.getFlag('ruben_libre'), col: __game.getFlag('columna_kanban'), inv: __game.state().inventory }));
  ok(s1.pd && s1.rl && s1.col === 'salida' && s1.inv.includes('ticket_n1') && s1.inv.includes('rotulador_rojo'), `SALIDA EN VALOR → posit_descopeado, ruben_libre, ticket_n1, columna 'salida', el rotulador se queda (${JSON.stringify(s1)})`);
  ok(await logHas('¿Con qué has escrito eso? ...Rotulador de Comercial. De fuera.') && await logHas('Salida en valor. Ni hecho ni muerto, pero sale.')
    && await logCount('Entonces es de la casa.') === 1 && await logHas('Revocado. Fecha: hoy. Efectos: julio.') && !(await logHas('Consultoría')), 'las tres líneas del arranque (§3.5), C94, sin «Consultoría»');
  await G(() => __game.clearLog());
  await raton('mirar', 'kanban');
  ok(await logHas('Y una nueva, a rotulador: SALIDA EN VALOR. Dentro, el pósit de Rubén.'), 'Mirar el tablero → «…SALIDA EN VALOR…»');
  await raton('usar', 'kanban', 'rotulador_rojo');
  ok(await logHas('Una columna nueva por noche. La siguiente, en la próxima versión.') && !(await opciones()), 'el rotulador, otra vez: ya no hay menú');
  await verA('kanban'); await page.mouse.move(5, 5); await sleep(150); await shot('kanban-salida');
  await G(() => __game.save(4)); await G(() => __game.load(4)); await sleep(200); await idle();
  ok(await flag('columna_kanban') === 'salida' && await flag('posit_descopeado') && await flag('ruben_libre'), 'guardar/cargar con la columna escrita: se conserva');
  // la otra vía, desde la partida guardada a mitad, y el otro orden (álbum antes que rotulador)
  await G(() => __game.load(3)); await sleep(200); await idle();
  await G(() => { __game.takeItem('rotulador_rojo'); __game.setFlag('oyo_descopear', true); __game.clearLog(); });
  ok(await flag('album_validado') === true && !(await flag('posit_descopeado')) && !(await flag('columna_kanban')), 'cargar a mitad: álbum validado, sin columna');
  await raton('usar', 'kanban');
  ok(await logHas('pide rotulador'), 'álbum antes que rotulador: Usar el tablero → pide rotulador');
  await G(() => __game.giveItem('rotulador_rojo'));                            // (el rotulador, de Comercial)
  await raton('usar', 'posit_1998', 'rotulador_rojo', false);
  await until(() => !!__game.currentDialogOptions());
  ok(!(await opciones()).includes('SALIDA EN VALOR'), 'sin rep_13, no sale SALIDA EN VALOR');
  await clicOpcion('DESCOPEADO'); await idle(); await seguir();
  ok(await flag('columna_kanban') === 'descopeado' && await flag('posit_descopeado') && await logHas('Descopear. Quitar sin que se note. Eso es infraestructura.') && await logHas('Rotulador de Comercial. De fuera.'),
    'rotulador con el pósit → DESCOPEADO: columna \'descopeado\' y su arranque');
  await G(() => __game.clearLog());
  await raton('mirar', 'kanban');
  ok(await logHas('Y una nueva, a rotulador: DESCOPEADO.'), 'Mirar el tablero → «…DESCOPEADO…»');
  await verA('kanban'); await page.mouse.move(5, 5); await sleep(150); await shot('kanban-descopeado');

  // ====================================================================== 3. coro por acto, solo de cerca
  console.log('\n§5.1 el coro por acto (K01-K04), solo con Bruno cerca');
  const coro = async (x) => {
    await G(() => __game.clearLog());
    await G((x) => { const g = __game.game, p = g.player; p.x = x; p.y = 124; p.path = []; g.snapCamera(); const A = g.room.amb; A.count = 0; A.next = g.time; A.running = false; }, x);
    await sleep(1200);
    await until(() => !__game.game.room.amb.running, null, 8000);
    return G(() => __game.log.map(l => String(l.text)).filter(t => /^(DEV|CORO)/.test(t)));
  };
  const todas = async (x, n = 4) => { const out = []; for (let i = 0; i < n; i++) out.push(...await coro(x)); return out; };
  await partida({ cms_vivo: false });
  let l1 = await todas(1000, 3);
  ok(l1.some(t => t.includes('Gritando más alto')) && !l1.some(t => /lluvia|Internet|enchufó|Titulator/.test(t)), `Acto I: CMS caído y margen, sin lluvia ni Internet (K01-K02): ${l1.length} líneas`);
  await partida({ cms_vivo: true });
  const lejos = await todas(200, 3);
  ok(!lejos.length, 'Acto II, lejos del coro: el coro no habla');
  const l2 = await todas(1000, 2);
  ok(l2.includes('DEV 1: El CMS se colgaba por una pantalla. ¿Quién la enchufó?') && l2.includes('DEV 1: Yo no. Él.') && !l2.some(t => t.includes('Titulator')), 'Acto II, de cerca: K03 «¿Quién la enchufó?»');
  await partida({ cms_vivo: true, acto_3_iniciado: true, dos_ias_vista: true, anselmo_dijo_regla: true, ruben_encontrado: true, pieza_escrita: true, discover_ganador: 'opa', ruben_libre: true, posit_descopeado: true });
  const lj3 = await todas(200, 2);
  const l3 = await todas(1000, 3);
  ok(!lj3.length && l3.includes('DEV 3: Hemos sido nosotros.') && l3.includes('DEV 1: No lo repitas.') && !l3.some(t => /enchufó|margen/.test(t)), `Acto III: K04 solo de cerca (${l3.length} líneas de cerca, ${lj3.length} de lejos)`);

  // ====================================================================== 4. F4 junto() sin fundido
  console.log('\n§2.8 F4 junto() sin fundido · F9 Custodia');
  await partida({ cafetera_viral: true });
  await G(() => { delete __game.game.state.once['once:pecera_viral']; });
  await G(() => __game.gotoRoom('office', 'pecera')); await idle();
  await G(() => __game.skipText(false));
  const f4 = await G(async () => {
    const g = __game.game; let fade = 0, run = false, tp = false, px = null, dentro = false;
    const p = __game.gotoRoom('pecera', 'office');
    const t0 = performance.now();
    while (performance.now() - t0 < 9000) {
      if (dentro) fade = Math.max(fade, g.fadeLevel || 0);
      if (g.room && g.room.def.id === 'pecera' && (g.fadeLevel || 0) < 0.02) dentro = true;   // (el fundido de la puerta no cuenta)
      if (dentro && g.player) { if (px != null && Math.abs(g.player.x - px) > 40) tp = true; px = g.player.x; run = run || !!g.player.running; }
      if (__game.getFlag('cafetera_viral') && g.speeches.length && /Once mil/.test(g.speeches.map(s => s.text).join())) break;
      await new Promise(r => setTimeout(r, 16));
    }
    __game.skipText(true); await p;
    return { fade, run, tp, x: Math.round(g.player.x) };
  });
  ok(f4.fade < 0.05 && f4.run && !f4.tp, `entrar desde el Vending con la viral pendiente: sin fundido (${f4.fade.toFixed(2)}), Bruno corre, sin saltos (${JSON.stringify(f4)})`);
  // F9 Custodia: tres opciones seguidas sin volver a hablar
  await G(() => __game.skipText(true));
  await raton('hablar', 'custodia_precinto', null, false);
  await until(() => !!__game.currentDialogOptions());
  let sigue = true;
  for (const op of ['Buenas noches.', '¿Me da una libreta?', '¿Me deja un boli?', 'Para escribir.']) {
    sigue = sigue && await clicOpcion(op);
    await until(() => !!__game.currentDialogOptions() || !__game.state().busy, null, 6000);
  }
  ok(sigue && (await opciones() || []).includes('Nada, perdone.'), 'Custodia: «Buenas noches.», «¿Me da una libreta?» y «¿Me deja un boli?» → «Para escribir.» seguidas, y el menú sigue');
  await clicOpcion('Nada, perdone.'); await idle();
  ok(!(await opciones()), '«Nada, perdone.» cierra');

  // ====================================================================== 5. la frase de Anselmo, una vez
  console.log('\n§2.8 M20: la frase de Anselmo se oye entera una vez (paso 38)');
  await partida({ cms_vivo: true, rep_11: true, casilla_fuente: true, herminia_midio: false });
  await raton('hablar', 'anselmo_monolito', null, false);
  await clicOpcion('¿Y tú no usas IA?'); await until(() => !!__game.currentDialogOptions(), null, 8000);
  ok(await logHas('¿Tú de qué departamento vienes?') && !(await logHas(FRASE)), 'antes del paso 38: «¿Tú de qué departamento vienes?» (M20)');
  await clicOpcion('Me voy.'); await idle(); await seguir();
  await raton('usar', 'ordenador_bruno');
  await idle();
  await G(() => __game.skipSpeech());
  ok(await flag('herminia_midio') && await logCount(FRASE) === 1 && await logCount('Eso lo hace nuestro.') === 1, 'paso 38 (Usar el ordenador): la frase entera, una vez');
  await G(() => { delete __game.game.state.once['once:dialog:anselmo'] ; });
  await G(() => __game.newGame()); await idle();
  ok(true, '(nueva partida para el eco)');
  await partida({ cms_vivo: true, herminia_midio: true });
  await raton('hablar', 'anselmo_monolito', null, false);
  await clicOpcion('¿Y tú no usas IA?'); await until(() => !!__game.currentDialogOptions(), null, 8000);
  ok(await logHas('Ya te lo he dicho. Lo escribí yo. En mayúsculas.') && !(await logHas('El prompt es de dentro')), 'después: el eco «Ya te lo he dicho. Lo escribí yo. En mayúsculas.» (D19), sin medio prompt');
  await clicOpcion('Me voy.'); await idle();
} catch (e) {
  failures++;
  console.log('  ✗ EXCEPCIÓN: ' + (e && e.stack || e));
}
const errs = consoleErrors.concat(await G(() => (__game.errors || []).map(e => String(e.msg || e.message || e))).catch(() => []));
ok(!errs.length, `sin errores de consola${errs.length ? ': ' + errs.slice(0, 5).join(' | ') : ''}`);
await browser.close();
server.close();
console.log(`\n${checks - failures}/${checks} comprobaciones OK`);
process.exit(failures ? 1 : 0);
