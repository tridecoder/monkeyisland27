#!/usr/bin/env node
// Test del paquete P4 (ENMIENDA E2, docs/guion2/ENMIENDA_E2.md §11 P4): Sala Amazonas (reunión, estampida con el anuncio
// de Maripaz, pop-up de la X menguante, página 7 según Comercial, D1 y el adhesivo «SU ANUNCIO AQUÍ»), Marketing y
// Comercial (sin Borja: su aro de luz con el móvil que publica solo; el anuncio antes de entrar; el monitor de Comercial;
// el árbol y los verbos de Maripaz; el portátil de Tadeo con seis reenvíos), Eventos («¡Ese móvil!», `once` de §7.6) y
// clímax (D4 con R16 y el tercer remate: Evaristo llama por el teléfono de conferencias; la factura con coma).
//   node tools/test-comedia-p4.mjs            (modo rápido; comprueba también los planos detalle sin modo rápido)
//   node tools/test-comedia-p4.mjs --shots    además guarda capturas en tools/shots/e2-p4-*.png
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from './serve.mjs';
import { createRunner, StepFail } from './walk-lib.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const args = Object.fromEntries(process.argv.slice(2).filter(a => a.startsWith('--')).map(a => { const [k, v] = a.slice(2).split('='); return [k, v ?? true]; }));
const shotsDir = path.join(here, 'shots');
fs.mkdirSync(shotsDir, { recursive: true });

const server = createServer(path.resolve(here, '..'));
await new Promise(r => server.listen(0, r));
const base = `http://localhost:${server.address().port}/`;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 960, height: 600 } });
const consoleErrors = [];
page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));
const G = (fn, arg) => page.evaluate(fn, arg);
const state = () => G(() => __game.state());
const R = createRunner(page);

let pass = 0, failN = 0;
const ok = (c, msg) => { if (c) { pass++; console.log('  ✓ ' + msg); } else { failN++; console.log('  ✗ ' + msg); } };
const step = (t) => console.log('\n' + t);
const logHas = (t) => G(t => __game.log.filter(l => String(l.text).includes(t)).length, t);
const logWho = (t) => G(t => (__game.log.find(l => String(l.text).includes(t)) || {}).who, t);
const flag = (k) => G(k => { const f = __game.state().finished; return __game.game.state ? __game.getFlag(k) : (f ? f.flags[k] : undefined); }, k);
const setFlags = (o) => G(o => { for (const [k, v] of Object.entries(o)) __game.setFlag(k, v); }, o);
const give = (...ids) => G(ids => ids.forEach(i => __game.giveItem(i)), ids);
const verb = (v, t, i) => G(([v, t, i]) => __game.doVerb(v, t, i || null), [v, t, i]);
const opts = () => G(() => __game.currentDialogOptions());
const choose = (t) => R.chooseByText(t);
const inRoom = async (id) => { const a = (await state()).actors[id]; return a && a.room; };
const snap = (name) => page.screenshot({ path: path.join(shotsDir, `e2-p4-${name}.png`) });
const shot = async (name) => {
  if (!args.shots) return;
  await G(() => __game.skipText(false));
  await page.waitForTimeout(350);
  await snap(name);
  await G(() => __game.skipText(true));
};
async function esperaLog(t, ms = 15000) { for (let i = 0; i < ms / 40 && !(await logHas(t)); i++) await page.waitForTimeout(40); }
/** Captura a mitad de una escena (sin modo rápido): lanza `fn` sin esperar, espera a que salga `texto` y fotografía. */
async function shotDuring(name, fn, texto, extraMs = 600, maxMs = 60000) {
  if (!args.shots) { await fn(); return; }
  await G(() => __game.skipText(false));
  const p = fn();
  await esperaLog(texto, maxMs);
  await page.waitForTimeout(extraMs);
  await snap(name);
  await G(() => __game.skipText(true));
  await p;
  await G(() => __game.waitIdle());
}
/** Un plano detalle visto SIN modo rápido (siempre, con o sin --shots): lanza `fn`, espera a que se abra el plano
 *  `titulo` (y, si se pide, a que salga `texto`), comprueba, fotografía y termina en modo rápido. Devuelve el estado
 *  del plano al abrirse y lo que devuelva `alAbrir`. */
async function duranteDetalle(fn, { titulo, texto = null, esperaMs = 700, shotName = null, alAbrir = null } = {}) {
  await G(() => __game.skipText(false));
  const p = fn();
  let d = null;
  for (let i = 0; i < 700; i++) { d = (await state()).detalle; if (d && (!titulo || d.titulo === titulo)) break; d = null; await page.waitForTimeout(25); }
  let extra = null;
  if (d) {
    if (texto) await esperaLog(texto, 12000);
    await page.waitForTimeout(esperaMs);
    if (alAbrir) extra = await alAbrir();
    if (shotName && args.shots) await snap(shotName);
  }
  await G(() => __game.skipText(true));
  await p;
  await G(() => __game.waitIdle());
  return { d, extra };
}
async function pickWeak() {
  for (let k = 0; k < 3; k++) {
    const st = await state();
    const i = st.duel.weakIndex;
    const comodin = st.dialog[i].startsWith('Enviado desde');
    await G(i => __game.chooseDialog(i), i);
    if (!comodin) return;
  }
}
async function fresh() { await G(() => __game.newGame()); await G(() => __game.waitIdle()); }
async function enterClimax() {
  await G(() => { __game.gotoRoom('sala_amazonas'); });
  for (let i = 0; i < 300; i++) { const s = await state(); if (s.duel && s.dialog) return; await page.waitForTimeout(40); }
  throw new Error('el clímax no abre el duelo D4');
}
const D4_REPS = { rep_10: true, rep_12: true, rep_13: true, rep_05: true, rep_16: true, rep_01: true, rep_07: true, rep_15: true };
const ACTO3 = { torno_abierto: true, inigo_presentado: true, chaqueta_en_lector: true, silla_libre: true, acto_2_iniciado: true,
  aurora_conto_pasos: true, reunion_terminada: true, casilla_hueco: true, duelo_maripaz_ganado: true, acto_3_iniciado: true,
  pagina_cerrada: true, ruben_encontrado: true, oyo_descopear: true, ruben_libre: true, sala_abierta: true, duelo_gervasio_ganado: true,
  evaristo_escuchado: true, coma_bendecida: true, correo_evaristo_listo: true };

try {
  await page.goto(base);
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) { /* ignore */ } });
  await page.reload();
  await page.waitForFunction(() => !!window.__game);
  await G(() => __game.skipText(true));
  await R.startDismisser();
  await fresh();
  await setFlags({ torno_abierto: true, inigo_presentado: true });

  // ================================================================ MARKETING Y COMERCIAL · Acto I
  step('Marketing y Comercial, Acto I: el anuncio antes de entrar (§4.2.4), sin Borja (§3)');
  await G(() => __game.gotoRoom('administracion'));
  await G(() => __game.clearLog());
  {
    const { d, extra } = await duranteDetalle(() => G(() => __game.gotoRoom('ecosistema', 'administracion')), {
      titulo: 'ANUNCIO', esperaMs: 1300,
      alAbrir: async () => {
        const st0 = (await state()).detalle;
        if (args.shots) await snap('interstitial');
        await page.mouse.click(480, 300);                     // un clic NO lo cierra durante la cuenta atrás
        await page.waitForTimeout(150);
        const st1 = (await state()).detalle;
        if (args.shots) { await page.waitForTimeout(3700); await snap('interstitial-saltar'); }
        return { st0, sigue: !!st1 };
      } });
    ok(d && d.titulo === 'ANUNCIO' && d.cuenta === 5000 && d.bloqueado, 'plano «ANUNCIO»: cuenta atrás de 5 s, bloqueado');
    ok(extra && extra.sigue, 'un clic no salta el anuncio antes de los 5 s');
  }
  ok(await logHas('Bienvenido a Comercial. Podrás pasar en cinco segundos.') === 1 && await logHas('Se llama interstitial. Son ingresos.') === 1, 'Maripaz: «Se llama interstitial. Son ingresos.»');
  ok((await flag('ecosistema_interstitial')) === true, 'ecosistema_interstitial');
  {
    const a = (await state()).actors.maripaz_remitido;
    ok(a.room === 'ecosistema' && Math.abs(a.x - 328) < 3, 'Maripaz vuelve a su mesa');
  }
  await G(() => __game.gotoRoom('pecera'));
  await G(() => __game.clearLog());
  await G(() => __game.gotoRoom('ecosistema'));
  ok(await logHas('Se llama interstitial') === 0, 'el anuncio de entrada sale una vez');
  ok(!(await state()).actors.borja_engagement || (await inRoom('borja_engagement')) !== 'ecosistema', 'Borja ya no está en Marketing');
  ok(await G(() => __game.objects().some(o => o.id === 'aro_borja' && o.visible)), 'el aro de luz de Borja (objeto) a la vista');

  step('El aro de luz de Borja: publica solo (§3.2)');
  await G(() => __game.clearLog());
  await verb('mirar', 'aro_borja');
  ok(await logHas('Borja se fue a las seis.') === 1 && await logHas('publicaciones programadas hasta el lunes') === 1, 'Mirar (1.ª)');
  await verb('mirar', 'aro_borja');
  ok(await logHas('Programado: lunes, 9:00. Feliz lunes, [NOMBRE].') === 1, 'Mirar (2.ª): plantilla sin rellenar');
  ok(await logHas('página 7') === 0, 'sin pagina_cerrada no menciona la página 7 (B3)');
  if (args.shots) await shotDuring('aro-hola', async () => { await verb('hablar', 'aro_borja'); }, 'Publicando: «¿Hola?». Emoji de fuego.', 500);
  else await verb('hablar', 'aro_borja');
  ok(await logHas('Publicando: «¿Hola?». Emoji de fuego.') === 1 && await logWho('Publicando: «¿Hola?»') === 'aro_borja', 'Hablar (1.ª): publica lo que oye (voz del aro)');
  await verb('hablar', 'aro_borja');
  ok(await logHas('Publicando: «Deja de publicar lo que digo». Emoji de fuego.') === 1, 'Hablar (2.ª)');
  if (args.shots) await shotDuring('aro-silencio', async () => { await verb('hablar', 'aro_borja'); }, '[SILENCIO INCÓMODO]', 500);
  else await verb('hablar', 'aro_borja');
  ok(await logHas('Publicando: [SILENCIO INCÓMODO]. Emoji de fuego.') === 1, 'Hablar (3.ª): publica el silencio');
  ok((await flag('aro_borja_hablar_n')) === 3 && (await flag('aro_borja_mirar_n')) === 2, 'contadores del aro');
  await verb('usar', 'aro_borja');
  await verb('usar', 'aro_borja');
  ok(await logHas('Damos la bienvenida a [NOMBRE]') === 1 && await logHas('[NOMBRE], otra vez. Emoji de aplausos.') === 1, 'Usar (1.ª y 2.ª)');
  await verb('empujar', 'aro_borja');
  await verb('cerrar', 'aro_borja');
  ok(await logHas('Emoji de cohete.') === 1 && await logHas('se lo ha copiado a Pilar') === 1, 'Empujar y Cerrar');
  await verb('hablar', 'embudo_marketing');
  ok(await logHas('Publicando: ¿Qué hay al final del embudo? Emoji de embudo.') === 1, 'el embudo: lo publica el móvil');
  await setFlags({ pagina_cerrada: true });
  await verb('mirar', 'aro_borja');
  ok(await logHas('Exclusiva en la página 7, por [NOMBRE]. Emoji de fuego.') === 1 && await logHas('Sin mi nombre. Con buena luz.') === 1, 'con pagina_cerrada: la exclusiva, una vez');
  await setFlags({ pagina_cerrada: false });

  step('El monitor de Comercial (§4.4) y el árbol de Maripaz');
  await G(() => __game.clearLog());
  {
    const { d } = await duranteDetalle(() => verb('mirar', 'pantalla_comercial'), { titulo: 'LA PORTADA, SEGÚN COMERCIAL', texto: 'Un anuncio. Otro.', esperaMs: 500, shotName: 'portada-comercial' });
    ok(d && d.titulo === 'LA PORTADA, SEGÚN COMERCIAL', 'Mirar (1.ª): plano detalle de la portada');
  }
  ok(await logHas('Una línea de noticia. Otro anuncio.') === 1, 'Mirar (1.ª): «Un anuncio. Otro. Un vídeo…»');
  await verb('mirar', 'pantalla_comercial');
  ok(await logHas('«Se ve demasiado».') === 1 && (await flag('pantalla_comercial_n')) === 2, 'Mirar (2.ª): el pósit');
  if (args.shots) await shotDuring('video-solo', async () => { await verb('usar', 'pantalla_comercial'); }, '¡COLCHONES SIESTATÓN!', 400);
  else await verb('usar', 'pantalla_comercial');
  ok(await logWho('¡COLCHONES SIESTATÓN! ¡DUERMA COMO NUNCA!') === 'pantalla_comercial' && await logHas('Tiene más iniciativa que yo.') === 1, 'Usar: el vídeo se pone solo');
  await verb('cerrar', 'pantalla_comercial');
  ok(await logHas('Se abre otro vídeo.') === 1, 'Cerrar: la X de un píxel');
  await setFlags({ rumor_teodoro_n: 1 });
  await verb('hablar', 'maripaz_remitido');
  ok(await logHas('Lo compró en el 97. Por fax.') === 1 && (await flag('rumor_teodoro_n')) === 2, 'rumor C: Maripaz lo sube de 1 a 2');
  ok(await logHas('«Agobio, con Tilas Calmín».') === 1, 'saludo (1.ª vez)');
  ok(JSON.stringify(await opts()) === JSON.stringify(['¿Qué vende Comercial?', '¿Me vende algo a mí?', 'La web va muy lenta.',
    'Mi abuela dice que no encuentra las noticias.', '¿Por qué tiene un gong?', 'Me voy.']), 'árbol M0 (§4.4)');
  await choose('La web va muy lenta.');
  ok(await logHas('Eso te lo arreglo con un pop-up, cariño.') === 1 && await logHas('mientras lo cierras, no te das cuenta') === 1, '«Eso te lo arreglo con un pop-up»');
  await choose('¿Qué vende Comercial?');
  ok(await logHas('Branded content: una noticia que es un anuncio, pero no lo dice.') === 1, 'branded content');
  await choose('¿Me vende algo a mí?');
  ok(await logHas('Ya lo has consumido. Son doce euros.') === 1, 'el paquete Gong');
  ok(!(await opts()).includes('La web va muy lenta.'), 'las opciones son `once`');
  await choose('Me voy.');
  ok(await logHas('Era una pregunta. Y un anuncio.') === 1, 'despedida');
  await verb('hablar', 'maripaz_remitido');
  ok(await logHas('En la web eso se llama fidelización.') === 1, 'saludo (siguientes)');
  await R.closeDialog();
  await verb('empujar', 'maripaz_remitido');
  await verb('empujar', 'maripaz_remitido');
  ok(await logHas('se llama «interacción». Te la facturo.') === 1 && await logHas('tarifa plana') === 1 && (await flag('maripaz_empujon_n')) === 2, 'Empujar (1.ª con gong; 2.ª, tarifa plana)');
  await verb('usar', 'maripaz_remitido');
  ok(await logHas('Has hecho clic en un anuncio.') === 1, 'Usar: clic en un anuncio');
  await verb('usar', 'rollup_comercial');
  ok(await logHas('Ahora tú eres el anuncio, cariño. Te cobro el metro cuadrado.') === 1, 'roll-up con Maripaz');
  await verb('hablar', 'termometro_ventas');
  ok(await logHas('Cuando la noticia ocupe una línea. Vamos por dos.') === 1, 'termómetro con Maripaz');
  await give('correo_evaristo');
  await verb('dar', 'maripaz_remitido', 'correo_evaristo');
  ok(await logHas('Por él cobro lo pactado. Qué pena.') === 1, 'Dar correo_evaristo a Maripaz');
  await G(() => __game.takeItem ? __game.takeItem('correo_evaristo') : null);
  ok(await G(() => !__game.log.some(l => String(l.text).includes('(*'))), 'sin letra pequeña «(*…)»');

  step('Portátil de Tadeo: seis reenvíos (§3.6)');
  await G(() => __game.clearLog());
  for (let i = 0; i < 6; i++) await verb('mirar', 'portatil_tadeo');
  ok(await logHas('Ferretería Hermanos Tornillo') === 1 && await logHas('Propongo aplicarlo a las reuniones') === 1 && await logHas('Lo ha escrito una máquina.') === 1, 'reenvíos 5 y 6');
  ok(!(await flag('rep_15')), 'sin R15 antes de Rubén');
  await setFlags({ ruben_encontrado: true });
  for (let i = 0; i < 4; i++) await verb('mirar', 'portatil_tadeo');
  ok((await flag('rep_15')) === true && await logHas('Tadeo no lo ha leído. Yo sí.') === 1 && await logHas('Me la apunto') === 0, 'R15 con Rubén; sin «Me la apunto»');
  await setFlags({ ruben_encontrado: false });
  await shot('marketing');

  step('Silla 113 (§4.4) y Acto II antes de D1');
  await setFlags({ eventos_silla_devuelta: true });
  await G(() => __game.gotoRoom('pecera'));
  await G(() => __game.clearLog());
  await G(() => __game.gotoRoom('ecosistema'));
  ok(await logHas('Ya le he puesto un anuncio en el respaldo.') === 1, 'la silla 113, pagada');
  await setFlags({ acto_2_iniciado: true });
  await G(() => __game.gotoRoom('administracion'));
  await G(() => __game.gotoRoom('ecosistema'));
  ok((await inRoom('maripaz_remitido')) !== 'ecosistema', 'Acto II sin casilla_hueco: Maripaz no está en Marketing');
  await G(() => __game.clearLog());
  await verb('usar', 'rollup_comercial');
  await verb('hablar', 'termometro_ventas');
  ok(await G(() => !__game.log.some(l => l.who === 'maripaz_remitido')) && await logHas('Nadie me contrata.') === 1, 'sin Maripaz, contesta Bruno');
  await setFlags({ acto_2_iniciado: false });

  // ================================================================ SALA AMAZONAS · Acto I
  step('Sala Amazonas, Acto I: Mercados; L22, fechas de §8');
  await G(() => __game.gotoRoom('sala_amazonas'));
  for (const m of ['mercados_1', 'mercados_2', 'mercados_3']) ok((await inRoom(m)) === 'sala_amazonas', `${m} en la sala (actor)`);
  ok((await inRoom('maripaz_remitido')) !== 'sala_amazonas', 'Acto I: Maripaz no está en la Sala');
  await G(() => __game.clearLog());
  await verb('mirar', 'mercados_1');
  await verb('coger', 'mercados_2');
  await verb('mirar', 'orden_del_dia');
  await verb('mirar', 'gervasio_acta');
  ok(await logHas('Cuando empezó la reunión, era lampiño.') === 1 && await logHas('Cotizan. Y a la baja.') === 1, 'L22 y «Cotizan. Y a la baja.»');
  ok(await logHas('Dicen que muerde.') === 1 && await logHas('que ya lo tutea') === 1, 'orden del día y L23');
  ok(await G(() => !__game.log.some(l => /desde (marzo|2019)/i.test(l.text))), 'sin «desde marzo/2019»');

  // ================================================================ Acto II: reunión, Maripaz, estampida
  step('Acto II: reunión con Maripaz sentada en el planillo; «siguientes pasos» → estampida con anuncio (§4.3)');
  await setFlags({ acto_2_iniciado: true, aurora_conto_pasos: true, chaqueta_en_lector: true });
  await give('ficha_pagina_7');
  await G(() => __game.gotoRoom('pajarera'));
  await G(() => __game.gotoRoom('sala_amazonas'));
  ok((await inRoom('maripaz_remitido')) === 'sala_amazonas', 'Acto II: Maripaz en la Sala');
  await G(() => __game.clearLog());
  await verb('mirar', 'maripaz_remitido');
  ok(await logHas('con una tableta llena de anuncios') === 1, 'Mirar Maripaz');
  await verb('hablar', 'maripaz_remitido');
  ok(await logHas('Le estoy vendiendo el orden del día a Mercados.') === 1 && !(await state()).dialog && !(await flag('maripaz_popup_n')), 'antes de la estampida: sin pop-up ni menú');
  await verb('empujar', 'maripaz_remitido');
  ok(await logHas('Te la cobro.') === 1, 'Empujar (mazo)');
  await verb('dar', 'maripaz_remitido', 'ficha_pagina_7');
  ok(await logHas('Debajo. Con banners.') === 1, 'Dar la ficha');
  await verb('coger', 'planillo_bajo_maripaz');
  ok(await logHas('Se negocia.') === 1, 'Coger el planillo');
  await shot('sala-reunion');
  await verb('hablar', 'gervasio_acta');
  ok(await logHas('Mientras, le vendo el punto tres a Mercados.') === 1, 'onStart de la reunión: Maripaz vende el punto tres');
  await choose('¿Quién tiene reservada la sala?');
  ok(await logHas('puede volver en cualquier momento') === 1, 'L24');
  const estampida = async () => { await choose('¿y cuáles son los siguientes pasos?'); };
  if (args.shots) await shotDuring('estampida-anuncio', estampida, '¡Antes de salir, un anuncio de cinco segundos!', 700);
  else await estampida();
  await G(() => __game.waitIdle());
  ok((await flag('reunion_terminada')) === true, 'paso 25 → reunion_terminada');
  ok(await logHas('¡Tengo doble prioridad!') === 1 && await logHas('¡Un momento! ¡Antes de salir, un anuncio de cinco segundos!') === 1, 'el anuncio de la estampida');
  ok(await G(() => { const a = __game.game.actors.maripaz_remitido; return !a.hold; }), 'Maripaz baja la tableta');
  for (const m of ['mercados_1', 'mercados_2', 'mercados_3']) ok((await inRoom(m)) !== 'sala_amazonas', `${m} ha huido`);
  ok(await logHas('¿Huir? Esta sala la tengo pagada hasta las nueve, cariño. La amortizo.') === 1, 'cierre: «¿Huir?… La amortizo.»');
  ok(await logHas('Liderazgo.') === 0, 'fuera L33');

  // ================================================================ pop-up y página 7
  step('El pop-up de la X menguante (§4.2.1) y la página 7 según Comercial (§4.2.2)');
  await G(() => __game.clearLog());
  {
    const { d } = await duranteDetalle(() => verb('hablar', 'maripaz_remitido'), { titulo: 'PUBLICIDAD', texto: 'La X mide un píxel.', esperaMs: 500, shotName: 'popup-1' });
    ok(d && d.cerrarX === 3 && !d.cuenta, 'pop-up 1: X de 3 px');
  }
  ok(await logHas('¿Dónde se cierra esto?') === 1 && await logHas('La semana pasada medía dos. Optimizamos.') === 1, 'pop-up 1: «Optimizamos.»');
  ok(JSON.stringify(await opts()) === JSON.stringify(['Siestatón no ha confirmado la página 7.', '¿Qué hace usted con el planillo?',
    '¿Y si la gente no quiere anuncios?', 'Luego vuelvo.']), 'árbol maripaz_sala (§4.3)');
  {
    const { d } = await duranteDetalle(() => choose('¿Qué hace usted con el planillo?'), { titulo: 'PÁGINA 7 · PROPUESTA DE COMERCIAL', texto: '¿La noticia?', esperaMs: 400, shotName: 'pagina7' });
    ok(!!d, 'plano detalle: PÁGINA 7 · PROPUESTA DE COMERCIAL');
  }
  ok(await logHas('Se ve demasiado. Estoy en ello.') === 1, '«Se ve demasiado. Estoy en ello.»');
  await choose('¿Y si la gente no quiere anuncios?');
  ok(await logHas('No la encuentran.') === 1, '«No la encuentran.»');
  await choose('Luego vuelvo.');
  ok(await logHas('Si me cierras, vuelvo a aparecer.') === 1, 'despedida');
  {
    const { d } = await duranteDetalle(() => verb('hablar', 'maripaz_remitido'), { titulo: 'PUBLICIDAD', texto: 'Ahora la X es un punto.', esperaMs: 400, shotName: 'popup-2' });
    ok(d && d.cerrarX === 1, 'pop-up 2: la X es un punto (1 px)');
  }
  ok(await logHas('Un punto muy bien situado.') === 1, 'pop-up 2: «Un punto muy bien situado.»');
  ok(JSON.stringify(await opts()) === JSON.stringify(['Siestatón no ha confirmado la página 7.', 'Luego vuelvo.']), 'las `once` ya no salen');
  await choose('Luego vuelvo.');

  // ================================================================ D1
  step('D1 en la Sala: tres derrotas (pop-up con cuenta atrás) y victoria con el adhesivo (§4.3, §4.2.3)');
  await setFlags({ rep_08: true, rep_04: true, rep_11: true });
  for (let n = 1; n <= 3; n++) {
    await G(() => __game.clearLog());
    if (n === 1) {
      const { d, extra } = await duranteDetalle(() => verb('hablar', 'maripaz_remitido'), { titulo: 'PUBLICIDAD', esperaMs: 1100, shotName: 'popup-3-cuenta',
        alAbrir: async () => { await page.mouse.click(480, 300); await page.waitForTimeout(120); return !!(await state()).detalle; } });
      ok(d && d.cerrarX === 0 && d.cuenta === 3000 && d.bloqueado, 'pop-up 3: sin X, «Podrá cerrar en 3», bloqueado');
      ok(extra === true, 'pop-up 3: un clic no lo cierra durante la cuenta atrás');
    } else await verb('hablar', 'maripaz_remitido');
    await choose('Siestatón no ha confirmado la página 7.');
    const st = await state();
    ok(st.duel && st.duel.id === 'maripaz', `D1 abierto (${n})`);
    if (n === 1) {
      ok(st.duel.attack === 'R08' && await logHas('Es un exnovio.') === 1 && await logHas('Te lo pongo por escrito. Con banner.') === 0, 'entrada desde el árbol (sin intro del duelo)');
      ok(st.duel.subject.includes('(contiene publicidad)'), 'asunto: «(contiene publicidad)»');
      await shot('duelo-d1');
    } else ok(await logHas('Te lo pongo por escrito. Con banner.') === 1, `revancha (${n}): «Te lo pongo por escrito. Con banner.»`);
    for (let i = 0; i < 3; i++) await pickWeak();
    await G(() => __game.waitIdle());
    ok((await flag('duel:maripaz:perdido_n')) === n, `perdido_n = ${n}`);
    ok(await logHas('«Cierre este anuncio para leer la respuesta».') === 1 && await logHas('Antes, un anuncio.') === 1, `derrota (${n})`);
    if (n === 3) ok(await logHas('tarifa de proximidad') === 1, '3.ª derrota: Maripaz a tres metros');
  }
  ok((await flag('maripaz_popup_n')) === 5, 'maripaz_popup_n = 5');
  await G(() => __game.clearLog());
  await verb('hablar', 'maripaz_remitido');
  await choose('Siestatón no ha confirmado la página 7.');
  const ganar = () => R.playDuel(['R08', 'R04', 'R11', { objeto: 'ficha_pagina_7' }]);
  if (args.shots) await shotDuring('adhesivo-pegado', ganar, 'Tenías la espalda desaprovechada.', 500, 90000);
  else await ganar();
  await G(() => __game.waitIdle());
  let st = await state();
  ok(st.flags.duelo_maripaz_ganado && st.flags.casilla_hueco && st.flags.bruno_con_banner, 'paso 26: duelo_maripaz_ganado, casilla_hueco, bruno_con_banner');
  ok(await logHas('¿Y quién me firma que esa página es noticia y no un hueco para anuncios?') === 1 && await logHas('Sellada por Aurora. Impar.') === 1, 'remate con la ficha');
  ok(await logHas('Siestatón, a la web. Allí caben en todas partes.') === 1 && await logHas('Y sin un banner. Me duele.') === 1, 'victoria (§4.3)');
  ok(await logHas('Tenías la espalda desaprovechada.') === 1 && await logHas('Y quitad el ronquido de la espera.') === 1, 'el adhesivo y el ronquido');
  ok(await G(() => { const g = __game.game; return g.spriteOf(g.player) === g.player.variants.con_banner; }), 'Bruno lleva el adhesivo (variante con_banner)');
  ok((await inRoom('maripaz_remitido')) !== 'sala_amazonas', 'Maripaz se va de la Sala');
  if (args.shots) {
    await G(() => __game.game.runScript(async (api) => { await api.walkTo(150, 128); api.face('left'); }, { label: 'test' }));
    await G(() => __game.waitIdle());
    await shot('adhesivo-perfil');
    await G(() => __game.game.runScript(async (api) => { api.face('up'); }, { label: 'test' }));
    await shot('adhesivo-espalda');
  }

  step('Marketing tras D1: comisión y Siestatón');
  await G(() => __game.gotoRoom('ecosistema'));
  ok((await inRoom('maripaz_remitido')) === 'ecosistema', 'tras D1, Maripaz vuelve a Marketing y Comercial');
  await G(() => __game.clearLog());
  await verb('hablar', 'maripaz_remitido');
  ok(await logHas('Mi becario favorito. Te debo una comisión.') === 1, 'saludo con duelo_maripaz_ganado');
  await choose('¿Qué tal con Siestatón?');
  ok(await logHas('Hasta en la X de cerrar.') === 1, '«¿Qué tal con Siestatón?»');
  await R.closeDialog();
  ok(await logHas('Era una pregunta. Y un anuncio.') === 0, 'despedida oída solo la primera vez (E2 §7.2)');

  // ================================================================ EVENTOS
  step('Eventos (protegida): «¡Ese móvil!» y `once` de §7.6');
  await G(() => __game.gotoRoom('eventos'));
  ok((await inRoom('borja_engagement')) !== 'eventos', 'Borja no entra en Eventos');
  await setFlags({ ruben_encontrado: true, acto_3_iniciado: true });
  await G(() => __game.clearLog());
  await verb('hablar', 'pilar_escaleta');
  await choose('¿Para qué es el photocall?');
  await choose('¿Hay catering?');
  const o = await opts();
  ok(!o.includes('¿Para qué es el photocall?') && !o.includes('¿Hay catering?'), 'photocall y catering, `once`');
  if (args.shots) await shotDuring('eventos-movil', async () => { await choose('¿Me prestas el álbum?'); }, 'Hemos descopeado la ética del trimestre', 400);
  else await choose('¿Me prestas el álbum?');
  await G(() => __game.waitIdle());
  ok(await logWho('Hemos descopeado la ética del trimestre') === 'eventos_a_ecosistema', 'el móvil de Borja, oído por la puerta');
  ok(await logHas('¡Ese móvil! Sin acreditación, de la puerta no se pasa.') === 1 && await logHas('Pero esto lo contamos. En vertical.') === 1, '«¡Ese móvil!» (C7)');
  ok(await logHas('Me lo apunto') === 0 && await logHas('O sea, quitado del plan') === 0, 'fuera las dos coletillas');
  ok((await flag('oyo_descopear')) === true && (await state()).inventory.includes('album_eventos'), 'paso 37/39 igual (oyo_descopear, álbum)');
  await R.closeDialog().catch(() => {});

  // ================================================================ CLÍMAX
  step('Clímax: D4 con R16 y tres remates; Evaristo llama a la sala (§5.5)');
  await fresh();
  await setFlags({ ...ACTO3, ...D4_REPS, 'duel:inigo:floja': 2 });
  await give('ticket_n1', 'acta_reunion', 'correo_evaristo');
  await G(() => __game.clearLog());
  await enterClimax();
  ok((await flag('climax_entrada')) === true, 'climax_entrada');
  ok(await logHas('mi móvil y los relojes de la casa dicen lo mismo') === 0, 'fuera la coletilla de la hora (§7.2)');
  ok((await state()).duel.target === 5, 'D4: cinco aciertos (PUNTOS_D4 = 5)');
  {
    const pairs0 = await G(() => Object.fromEntries(__game.game.content.duels.pairs.map(p => [p.id, p.reply])));
    for (const pid of ['R10', 'R12']) { const s0 = await state(); await G(k => __game.chooseDialog(k), s0.dialog.indexOf(pairs0[pid])); }
    await choose('[Usar objeto]'); await G(() => __game.chooseItem('ticket_n1'));
    const s1 = await state(); await G(k => __game.chooseDialog(k), s1.dialog.indexOf(pairs0.R13));
  }
  st = await state();
  ok(st.dialog[st.duel.weakIndex] === '¿Y cuáles son los siguientes pasos?', 'la floja de D4: «¿Y cuáles son los siguientes pasos?»');
  await G(() => {
    const g = __game.game; window.__probe = [];
    if (!g.__speakOrig) g.__speakOrig = g.speak.bind(g);
    g.speak = (who, text, opts) => {
      const ger = g.actors.gervasio_acta, lec = g.actors.lector_medio;
      window.__probe.push({ who: (who && who.id) || who || (opts && opts.who), text, tag: opts && opts.tag, hud: !!g.hud, gervasioVisible: ger.visible,
        agachado: !!g.state.flags.sala_amazonas_gervasio_agachado,
        lector: { room: lec.room, visible: lec.visible, x: lec.x, caido: g.spriteOf(lec) === lec.variants.caido }, tele: g.getObjState('tele_amazonas', 'sala_amazonas').state });
      return g.__speakOrig(who, text, opts);
    };
  });
  await G(i => __game.chooseDialog(i), st.duel.weakIndex);
  let probe = await G(() => window.__probe);
  const p312 = probe.find(p => String(p.text).includes('Diapositiva 312'));
  ok(p312 && !p312.gervasioVisible && p312.agachado, 'Gervasio se agacha tras su sillón mientras Íñigo contesta');
  // resto: R05, remate B (acta), R16, remate C (primero un objeto equivocado; luego el correo)
  const pairs = await G(() => Object.fromEntries(__game.game.content.duels.pairs.map(p => [p.id, p.reply])));
  let probadoMal = false;
  for (let g = 0; g < 60; g++) {
    st = await state();
    if (!st.duel) break;
    if (!st.dialog && !st.pickItem) { await page.waitForTimeout(30); continue; }
    if (st.duel.phase === 'reply') await G(k => __game.chooseDialog(k), st.dialog.indexOf(pairs[st.duel.attack]));
    else if (st.duel.phase === 'finisher') {
      const want = st.duel.correctItem;
      if (want === 'correo_evaristo' && !probadoMal) {
        probadoMal = true;
        ok(await logHas('Cuarenta y ocho mil al mes. Firmado. Fin del hilo.') === 1, 'remate C: «Cuarenta y ocho mil al mes. Firmado. Fin del hilo.»');
        await choose('[Usar objeto]'); await G(() => __game.chooseItem('ticket_n1'));
        await G(() => __game.waitChoice());
        ok(await logHas('Eso ya me lo has enseñado. No escala dos veces.') === 1, 'remate C: objeto equivocado (ticket)');
        continue;
      }
      await choose('[Usar objeto]');
      if (want === 'correo_evaristo' && args.shots) {
        await G(() => __game.skipText(false));
        const pr = G(() => __game.chooseItem('correo_evaristo'));
        await esperaLog('Nos deben 191.808 euros.'); await page.waitForTimeout(500); await snap('evaristo-191808');
        await G(() => __game.skipText(true)); await pr;
      } else await G(id => __game.chooseItem(id), want);
    }
  }
  await G(() => __game.waitIdle());
  ok((await flag('duelo_inigo_ganado')) === true, 'D4 ganado con el tercer remate');
  probe = await G(() => window.__probe);
  const ev = probe.filter(p => p.who === 'evaristo_salvedad');
  ok(ev.length === 5 && ev.every(p => p.tag === 'CONTROLLING'), 'Evaristo, por el teléfono de conferencias (CONTROLLING), 5 líneas');
  ok(ev.every(p => !p.hud), 'el hilo del correo, oculto mientras habla Evaristo');
  ok(await logHas('Momento oportuno.') === 1 && await logHas('«48,000» son 48 euros.') === 1 && await logHas('Nos deben 191.808 euros.') === 1, 'remate C: la coma');
  ok(await logHas('¡Es formato internacional! ¡Lo entiende todo el mundo!') === 1 && await logWho('...Y ahorrar.') === 'lector_medio', 'Íñigo protesta; el Lector Medio: «...Y ahorrar.»');
  ok(await logHas('El mejor lector que he tenido.') === 1 && await logHas('Me da igual el acta') === 0, 'onWin de Íñigo en una línea (fase B (14))');
  const lec0 = ev[0] && ev[0].lector;
  ok(lec0 && lec0.room === 'sala_amazonas' && lec0.visible && !lec0.caido && lec0.x < 150, 'el Lector Medio, de pie junto a la pantalla (no preside)');
  await G(() => { window.__probe = []; });
  await shot('climax-antes-empujon');
  if (args.shots) await shotDuring('climax-empujon', async () => { await verb('empujar', 'lector_medio'); }, '¡Que lo mire el árbitro!');
  else await verb('empujar', 'lector_medio');
  await G(() => __game.waitIdle());
  probe = await G(() => window.__probe);
  await G(() => { const g = __game.game; if (g.__speakOrig) { g.speak = g.__speakOrig; delete g.__speakOrig; } });
  const cel = probe.filter(p => p.who === 'celestino' && p.tag === 'ENTRADA 1');   // (luego, el epílogo: otra escena)
  ok(cel.length === 2 && cel.every(p => p.tele === 'entrada_1' && p.lector.caido && p.lector.visible), 'el empujón se ve: Lector caído a la vista, Celestino por la tele');
  ok(await logHas('Factura de Optimal Brains. Cuarenta y ocho euros. Con coma.') === 1 && await logHas('treinta y cinco euros con cincuenta y dos') === 1, 'Begoña: la factura, con coma (§5.6)');
  ok(await logHas('Es lo que me como en atún.') === 1 && await logHas('Con ticket.') === 1, 'Rubén y Begoña: «¿Con táper?» «Con ticket.»');
  ok(await logHas('Algo importante se nos acaba de escapar') === 0 && await logHas('Quedan ciento cincuenta y dos') === 0, 'fuera la frase críptica y la coletilla');
  ok((await flag('lector_derribado')) === true && (await flag('juego_terminado')) === true, 'empujón → final');

  step('Clímax sin el correo: el remate C no tiene callejón (retirarse)');
  await fresh();
  await setFlags({ ...ACTO3, ...D4_REPS });
  await give('ticket_n1', 'acta_reunion');
  await enterClimax();
  for (let g = 0; g < 60; g++) {
    st = await state();
    if (!st.duel) break;
    if (!st.dialog && !st.pickItem) { await page.waitForTimeout(30); continue; }
    if (st.duel.phase === 'reply') await G(k => __game.chooseDialog(k), st.dialog.indexOf(pairs[st.duel.attack]));
    else if (st.duel.phase === 'finisher') {
      if (st.duel.correctItem === 'correo_evaristo') { await choose('[Retirarse del hilo]'); continue; }
      await choose('[Usar objeto]'); await G(id => __game.chooseItem(id), st.duel.correctItem);
    }
  }
  await G(() => __game.waitIdle());
  st = await state();
  ok(!st.duel && st.lastDuel.result === 'retired' && !st.flags.duelo_inigo_ganado, 'sin correo: se retira; ni gana ni se bloquea');

  // ================================================================ D4 perdido: sin titular
  step('D4 perdido: línea de derrota y sin titular');
  await fresh();
  await setFlags({ ...ACTO3, ...D4_REPS, 'duel:inigo:floja': 0 });
  await give('ticket_n1', 'acta_reunion', 'correo_evaristo');
  await enterClimax();
  await G(() => __game.clearLog());
  for (let i = 0; i < 3; i++) await pickWeak();
  await G(() => __game.waitIdle());
  st = await state();
  ok(!st.duel && st.lastDuel.result === 'lost', 'D4 perdido');
  ok(await logHas('Asignado a Vacante. Llama tú a la rotativa.') === 1, 'derrota §7.7');
  ok(await G(() => !__game.log.some(l => l.style === 'titular' || /BECARIO/.test(l.text))), 'sin titular en D4');
} catch (e) {
  failN++;
  console.log('\n  ✗ ERROR: ' + (e instanceof StepFail ? e.message : (e && e.stack || e)));
  const st = await state().catch(() => null);
  const log = await G(() => __game.log.slice(-10).map(l => `${l.who || '—'}: ${l.text}`)).catch(() => []);
  if (st) console.log(`    contexto: sala=${st.room} diálogo=${JSON.stringify(st.dialog)} duelo=${JSON.stringify(st.duel)}`);
  if (log.length) console.log('    últimas líneas:\n      ' + log.join('\n      '));
}

const gameErrors = await G(() => __game.errors.filter(e => !e.warn).map(e => e.msg || e.message || String(e))).catch(() => []);
ok(gameErrors.length === 0, 'sin errores del motor' + (gameErrors.length ? ': ' + JSON.stringify(gameErrors) : ''));
ok(consoleErrors.length === 0, 'sin errores de consola' + (consoleErrors.length ? ':\n    ' + consoleErrors.join('\n    ') : ''));
console.log(`\nCOMEDIA P4: ${pass} OK, ${failN} fallos`);
await browser.close();
server.close();
process.exit(failN ? 1 : 0);
