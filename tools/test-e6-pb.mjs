#!/usr/bin/env node
// ENMIENDA E6 · paquete PB (Redacción): prueba con RATÓN REAL de lo que el paquete cambia en `pecera`.
//   1. §2.1.4 camino del registro (`cmsVivo`, Tirar enchufe con vio_ticket_3): a oscuras, Yoli dice sus dos líneas antes del coro.
//   2. §2.5.1 / B2: «Dos IAs» acaba en la regla de Anselmo; Bruno no saca la conclusión y mira hacia el ascensor.
//   3. §2.6 B1: la columna (SALIDA EN VALOR) sin la explicación de Bruno; Brais, «SEGUIREMOS INFORMANDO.» a secas.
//   4. §2.9.2-3: Usar el tablero con el álbum validado y sin rotulador → Anselmo (N11); el gesto del rotulador; intentos fuera
//      de orden (tablero y rotulador antes del álbum); guardar/cargar a mitad.
//   5. B6, B7, K1-K6 (coro sin «D3: No.» de más; Coger el coro → «Yo no. Él.»), E344 (tótem con SIN_DESTINO), X5, X6, E070.
//   6. §6.5: Valentín mudo (variante `casco_fuera`, globo «…» sin palabras; ni una palabra suya en la primera charla).
//   7. La frase de Anselmo («El modelo es de fuera. El prompt es de dentro.» / «Eso lo hace nuestro.»), entera y una vez,
//      en el paso obligatorio (Usar mi ordenador → pecera_herminia_mide).
//   node tools/test-e6-pb.mjs              (capturas en tools/shots/e6-pb-*.png)
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
// la línea del tótem vive en content/lib/directorio.js (I1, E344): se lee de allí, sin copiarla
const SIN_DESTINO = fs.readFileSync(path.join(root, 'content/lib/directorio.js'), 'utf8').match(/export const SIN_DESTINO = '([^']+)'/)[1];

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
const logIdx = (t) => G(t => __game.log.findIndex(l => String(l.text).includes(t)), t);
const logDe = (who) => G(w => __game.log.filter(l => l.who === w).map(l => String(l.text)), who);
const shot = (n) => page.screenshot({ path: path.join(shots, `e6-pb-${n}.png`) });

const BASE = { intro_vista: true, torno_abierto: true, inigo_presentado: true, silla_libre: true, gertrudis_saludada: true,
  chaqueta_cogida: true, acto_2_iniciado: true };
/** Partida nueva en la Redacción con `flags`; con `limpiar`, el registro empieza tras las escenas de entrada. */
async function partida(flags = {}, { limpiar = true, onces = [] } = {}) {
  await G(() => __game.skipText(true));
  await G(() => __game.newGame()); await idle();
  await G(([F, O]) => { for (const [k, v] of Object.entries(F)) __game.setFlag(k, v); for (const o of O) __game.game.state.once['once:' + o] = true; },
    [{ ...BASE, ...flags }, ['pecera_viral', 'pecera_cms_entrada', 'pecera_yoli_banner', ...onces]]);
  await G(() => __game.clearLog());
  await G(() => __game.gotoRoom('pecera', 'ascensor')); await idle();
  if (limpiar) await G(() => { __game.skipSpeech(); __game.game.speeches.length = 0; __game.clearLog(); });
}
const verA = (id) => G((id) => {
  const g = __game.game, o = __game.objects().find(o => o.id === id);
  const cx = o.x + o.w / 2;
  g.camFollow = null; g.camTarget = null; g.camX = Math.max(0, Math.min(g.room.width - 320, Math.round(cx - 160)));
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
const opciones = () => G(() => __game.currentDialogOptions());
async function clicOpcion(texto) {
  if (!(await until(() => !!__game.currentDialogOptions()))) return false;
  await sleep(330);
  const o = await opciones();
  const i = o.findIndex(x => x.replace(/^› /, '') === texto || x.startsWith(texto));
  if (i < 0) return false;
  const p = await G(i => __game.optionPos(i), i);
  await page.mouse.click(p.x, p.y);
  await sleep(100);
  return true;
}
const III = { cms_vivo: true, acto_3_iniciado: true, ruben_encontrado: true, dos_ias_vista: true, anselmo_dijo_regla: true, herminia_midio: true,
  pieza_escrita: true, discover_ganador: 'opa' };

try {
  // ====================================================================== 0. código
  console.log('§0 en el código');
  const src = ['pecera.js', 'pecera.escenas.js', 'pecera.dialogos.js', 'pecera.secretaria.js'].map(f => fs.readFileSync(path.join(root, 'content/rooms', f), 'utf8')).join('\n');
  const fuera = ['Huele a 2019', 'Eso es un compañero', 'despide a la gente', 'Me ha entendido a la primera', 'Nadie lo hizo', 'Una columna nueva pide rotulador',
    'Mi parte favorita', 'Desde hoy.', 'Me han mirado', 'Y la escribí yo'];   // E7: vuelven «Me hacía falta», «Ayuda bastante», «¡Otra! ¡Ha entrado otra!» y «Nos ganan. Tienen horario»
  const quedan = fuera.filter(t => src.includes(t));
  ok(!quedan.length, `fuera de los ficheros de PB: ${fuera.length} cadenas (quedan: ${quedan.join(' · ') || 'ninguna'})`);
  ok(/import \{[^}]*SIN_DESTINO[^}]*\} from '\.\.\/lib\/directorio\.js'/.test(src) && !src.includes('«ESTÁ AQUÍ»'), 'E344: el tótem importa SIN_DESTINO (sin copia de la cadena)');
  const conFrase = [];
  const walk = (d) => { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else if (f.endsWith('.js') && fs.readFileSync(p, 'utf8').includes(`'${FRASE}'`)) conFrase.push(path.relative(root, p)); } };
  walk(path.join(root, 'content'));
  // [bloqueos] la frase vuelve al árbol de Anselmo (pecera.dialogos.js); la escena la dice entera solo si no se oyó
  ok(conFrase.length === 2 && conFrase.some(f => f.endsWith('pecera.escenas.js')) && conFrase.some(f => f.endsWith('pecera.dialogos.js')) && src.includes(`[A, '${FRASE}'], [A, 'Eso lo hace nuestro.']`), `la frase de Anselmo, entera, en el árbol y en la escena (${conFrase.join(', ')})`);

  // ====================================================================== 1. camino del registro con Yoli
  console.log('\n§2.1.4 camino del registro: Tirar enchufe con vio_ticket_3 (ratón real)');
  await partida({ vio_ticket_3: true, cms_vivo: false });
  await G(() => __game.skipText(false));
  await raton('tirar', 'enchufe_pantalla', null, false);
  ok(await until(() => !!__game.game.apagon && __game.game.speeches.some(s => /Estamos ciegos/.test(s.text)), null, 20000), 'a oscuras, Yoli: «¡Estamos ciegos!…» (en pantalla)');
  await page.mouse.move(5, 5); await sleep(300); await shot('registro-ciegos');
  await G(() => __game.skipText(true)); await idle(); await seguir();
  // [P11] fuera el camino del ticket nº 3: con el registro leído es el apagón de siempre (Yoli ciega, la pieza que entra a
  // oscuras y la pista de Anselmo); ni «A HECHO (PERO NO)» ni el CMS desde arriba
  const iC = await logIdx('¡Estamos ciegos! ¿Hay alguien leyendo? ¿HAY ALGUIEN AHÍ FUERA?'), iP = await logIdx('...Ha entrado una pieza. ¡Ha entrado una pieza! ¡El CMS va!'),
    iT = await logIdx('...Entonces existe. A HECHO (PERO NO).'), iE = await logIdx('Que te la apague Eutimio.');
  ok(iC >= 0 && iC < iP && iP < iE && iT < 0, `[P11] orden: Yoli ciega → «…Ha entrado una pieza…» → «Que te la apague Eutimio.»; sin «A HECHO (PERO NO)» (${[iC, iP, iE, iT].join(' · ')})`);
  ok(await flag('cms_vivo') === false && await flag('apagon_n') === 1 && !(await G(() => !!__game.game.apagon)), '[P11] sin cms_vivo, apagón 1 y luz');

  // ====================================================================== 2. dos IAs
  console.log('\n§2.5.1 «Dos IAs» sin la conclusión de Bruno');
  await partida({ cms_vivo: true, acto_3_iniciado: true, ruben_encontrado: true, herminia_midio: true, pieza_escrita: true, discover_ganador: 'opa' }, { limpiar: false });
  ok(await flag('dos_ias_vista') && await logHas('Tiene alta de usuario interno. Lo que tiene alta es de la casa.'), 'la escena acaba en la regla de Anselmo');
  ok(!(await logHas('compañero')) && !(await logHas('Armario 27. Atún.')) && (await logDe('bruno')).length === 0, 'Bruno no dice nada en la escena (fuera «…Eso es un compañero.»)');
  ok(await G(() => __game.game.player.dir) === 'right', 'Bruno mira hacia el ascensor (dir right)');
  ok(await logHas('Antes de que la envolviera le pedí un gráfico del Titulator.'), 'E129 (E7: tercera del autor)');

  // ====================================================================== 3. tablero y columna
  console.log('\n§2.9.2-3 y §2.6 B1: tablero, rotulador y columna (ratón real)');
  await partida({ ...III, taper_dado: true });
  await raton('usar', 'kanban');
  ok(await logHas('Me escribo un pósit: "Firmar en papel". Lo pego en POR HACER.') && !(await logHas('Desde hoy')), 'fuera de orden: Usar el tablero sin álbum → el pósit «Firmar en papel» (X6, sin «Desde hoy.»)');
  await G(() => { __game.giveItem('rotulador_rojo'); __game.giveItem('album_eventos'); });
  await raton('usar', 'kanban', 'rotulador_rojo');
  ok(await logHas('Ni se te ocurra. De mi tablero se sale hecho o muerto.') && !(await opciones()), 'fuera de orden: rotulador antes del álbum → Anselmo se niega, sin menú');
  await G(() => __game.takeItem('rotulador_rojo'));
  await G(() => __game.clearLog());
  await G(() => { window.__clicks = 0; const a = __game.game.audio, f = a.sfx.bind(a); a.sfx = (n) => { if (n === 'click') window.__clicks++; return f(n); }; });
  await raton('dar', 'anselmo_monolito', 'album_eventos');
  const iF = await logIdx('Las fotos me valen. Pero yo no escribo columnas nuevas.');
  ok(await flag('album_validado') === true && iF >= 0 && iF === (await G(() => __game.log.length)) - 1 && await G(() => window.__clicks) >= 1,
    'álbum validado; tras «Las fotos me valen…», gesto sin línea (click del rotulador)');
  // [guion3 t4] N11 («Mi rotulador no sale de Desarrollo…») era inalcanzable: el rotulador llega siempre con el D1, antes del
  // Acto III. Se ha quitado; en su lugar, que el código ya no la tiene
  ok(!fs.readFileSync(path.join(root, 'content/rooms/pecera.js'), 'utf8').includes('Mi rotulador no sale de Desarrollo'), '[P15] fuera N11, la línea inalcanzable de Anselmo sin rotulador');
  // la columna
  await G(() => { __game.giveItem('rotulador_rojo'); __game.setFlag('rep_13', true); __game.clearLog(); });
  await raton('usar', 'kanban', 'rotulador_rojo', false);
  await until(() => !!__game.currentDialogOptions());
  await clicOpcion('SALIDA EN VALOR'); await idle(); await seguir();
  const br = await logDe('ruben');
  ok(await flag('ruben_libre') && br.at(-1) === 'SEGUIREMOS INFORMANDO.' && !(await logHas('despide a la gente')) && !(await logHas('Y la escribí yo')), `columna: sin la explicación de Bruno; Brais cierra con «SEGUIREMOS INFORMANDO.» (${JSON.stringify(br)})`);
  ok(await G(() => __game.game.actors.ruben.dir) === 'left', 'Brais se gira hacia la columna (left)');
  ok(await logHas('Eutimio ha mandado primero el papeleo. Es el procedimiento.'), 'E118 (E7: vuelve el original)');

  // ====================================================================== 4. sueltas de la sala
  console.log('\n§2.6 B6/B7, §4.2 coro, E344, E070');
  await partida({ cms_vivo: true });
  await raton('coger', 'coro_desarrollo');
  ok(await logHas('DEV 1: Yo no. Él.') && !(await logHas('DEV 3: No.')), 'K3: Coger el coro → DEV 1 «Yo no. Él.»');
  await G(() => { __game.giveItem('cafe'); __game.giveItem('sobre_azucar'); __game.clearLog(); });
  await raton('dar', 'coro_desarrollo', 'cafe');
  ok(await logHas('Café de fuera.') && !(await logHas('DEV 3')), 'K2: Dar café al coro, sin «D3: No.»');
  await G(() => __game.clearLog());
  await raton('dar', 'coro_desarrollo', 'sobre_azucar');
  ok(await logHas('Alguien de fuera.') && !(await logHas('DEV 3')), 'K4: Dar otra cosa al coro, sin «D3: No.»');
  await G(() => __game.clearLog());
  await raton('coger', 'taza_no');
  ok(await logHas('DEV 3: No.'), 'la taza «NO» conserva su «No.» (de los que se quedan)');
  await G(() => __game.clearLog());
  await raton('hablar', 'herminia_portatil');
  ok(await logHas('saludo recibido · hola: 100 %') && !(await logHas('Aquí eso no pasa')) && (await logDe('bruno')).length === 0, 'B6: Hablar con Herminia → la pantalla, sin comentario de Bruno');
  await G(() => __game.clearLog());
  await raton('mirar', 'posit_1998');
  ok((await logDe('bruno')).at(-1) === 'Está en HECHO (PERO NO).', 'B7: Mirar el pósit de 1998 → «Está en HECHO (PERO NO).»');
  await G(() => __game.clearLog());
  await raton('mirar', 'directorio_planta', null, false);
  await until(() => !!__game.currentDialogOptions() || !__game.state().busy, null, 6000);
  if (await opciones()) { await clicOpcion('Nada, me quedo aquí.'); }
  await idle(); await seguir();
  ok(await logHas(SIN_DESTINO) && /Me hacía falta\.$/.test(SIN_DESTINO), `E344 (E7: con «Me hacía falta»): Mirar el tótem → «${SIN_DESTINO}»`);
  await G(() => __game.clearLog());
  await raton('empujar', 'pecera_a_vestibulo');
  ok((await logDe('bruno')).at(-1) === 'Empujar a alguien escaleras abajo sería una salida en valor. No.', 'E070 (E7: vuelve el «No.»)');
  await G(() => __game.clearLog());
  await G(() => { __game.setFlag('herminia_midio', true); __game.setFlag('pieza_recortada', true); __game.giveItem('pieza_opa'); });
  await raton('usar', 'herminia_portatil', 'pieza_opa');
  ok((await logDe('leoncio_quesitos')).at(-1) === 'Cabe. Ni ella ni yo hemos tocado nada.', 'X5: «Cabe. Ni ella ni yo hemos tocado nada.»');

  // ====================================================================== 5. Valentín
  console.log('\n§6.5 Valentín, cameo mudo (ratón real)');
  await partida({ cms_vivo: true });
  await G(() => { window.__vest = []; const v = __game.game.actors.valentin_reticula; let x = v.variante;
    Object.defineProperty(v, 'variante', { configurable: true, get: () => x, set: (n) => { x = n; window.__vest.push(n || null); } }); });
  await G(() => __game.skipText(false));
  await raton('hablar', 'valentin_reticula', null, false);
  ok(await until(() => __game.game.actors.valentin_reticula.variante === 'casco_fuera' && __game.game.speeches.some(s => s.text === '…'), null, 45000), 'se quita el casco (casco_fuera) y sale el globo «…»');
  await page.mouse.move(5, 5); await shot('valentin');
  const pos = await G(() => { const g = __game.game; return { b: Math.round(g.player.x), v: Math.round(g.actors.valentin_reticula.x), dv: g.actors.valentin_reticula.dir }; });
  ok(pos.b < pos.v - 8 && pos.dv === 'left', `Bruno a su izquierda y Valentín mirándole (${JSON.stringify(pos)})`);
  await G(() => __game.skipText(true)); await idle(); await seguir();
  const vl = await logDe('valentin_reticula');
  ok(vl.every(t => t === '…') && await logHas('...Nada. Perdone.') && await G(() => !__game.game.actors.valentin_reticula.variante), `sin palabras (${JSON.stringify(vl)}); vuelve a ponerse el casco`);
  ok(JSON.stringify(await G(() => window.__vest)) === JSON.stringify(['casco_fuera', null]), 'vestir: casco_fuera → null');
  await G(() => __game.save(6)); await G(() => __game.load(6)); await idle();
  await G(() => __game.clearLog());
  await raton('hablar', 'valentin_reticula');
  ok((await logDe('valentin_reticula')).at(-1) === 'Está en la bandeja.' && await G(() => !__game.game.actors.valentin_reticula.variante), 'tras guardar/cargar, la 2.ª: «Está en la bandeja.» (con el casco puesto)');

  // ====================================================================== 6. la frase de Anselmo en el paso obligatorio
  console.log('\nLa frase de Anselmo, entera y una vez (Usar mi ordenador → pecera_herminia_mide)');
  await partida({ cms_vivo: true, rep_11: true, casilla_fuente: true, herminia_midio: false });
  await raton('usar', 'ordenador_bruno');
  await idle();
  const fr = await G(() => __game.log.map(l => String(l.text)));
  const i1 = fr.indexOf(FRASE), i2 = fr.indexOf('Eso lo hace nuestro.');
  ok(await flag('herminia_midio') && await logCount(FRASE) === 1 && await logCount('Eso lo hace nuestro.') === 1 && i2 === i1 + 1, 'paso 37: la frase entera, una vez, seguida');
  // [P11] «Herminia mide la pieza» se recorta: fuera E124 («Encintar…») y E125 («Ya te la ha leído…»); «A un metro…» queda
  ok(!(await logHas('Encintar, no: aislar el componente.')) && !(await logHas('Ya te la ha leído.')) && await logHas('A un metro de mi cinta. Fuera.'), '[P11] escena corta: sin E124 ni E125; «A un metro de mi cinta. Fuera.»');
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
