#!/usr/bin/env node
// Walkthrough de EXTRAS: reproduce el recorrido de la ENMIENDA E2 (walk-data.mjs, 44 pasos) INTERCALANDO los pasos X de
// la tabla del plan §3.5 (con la ENMIENDA E1.9, E2 §10.1 —XE5, XE6— y los informes E2 de P1-P4) en su sitio (`tras: N` = justo
// después del paso N; `tras: 'XE3'` = después de ese paso X).
//   node tools/extras.mjs              todo, hasta la tarjeta FE DE ERRATAS y los créditos
//   node tools/extras.mjs --hasta=XE3  se para (con éxito) tras ese paso X (o tras el paso numérico, p. ej. --hasta=20)
//   node tools/extras.mjs --lento      sin modo rápido y con capturas
// Tras cada paso se comprueban sus resultados. Las llamadas de Evaristo (E2: L1, L3, L4, L5), los «RV:» de Tadeo y los rumores
// salen solos (entrar en salas / Hablar): el test cierra el globo y sigue (walk-lib.mjs `startDismisser`) y comprueba los
// CONTADORES en los puntos de control (filas «—»).
// Acciones y formato de `esp`: ver la cabecera de walkthrough.mjs; además `['perder']` (pierde el duelo abierto con flojas)
// y `esp.log: ['texto', …]` (cada texto debe salir en el registro durante ese paso; `who:texto` exige además quién lo dice).
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from './serve.mjs';
import { STEPS } from './walk-data.mjs';
import { createRunner, StepFail } from './walk-lib.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const args = Object.fromEntries(process.argv.slice(2).filter(a => a.startsWith('--')).map(a => { const [k, v] = a.slice(2).split('='); return [k, v ?? true]; }));

const V = (verbo, obj) => ['verbo', verbo, obj];
const O = (t) => ['opcion', t];
const SALIR = ['cerrar'];
// ------------------------------------------------------------------ plan §3.5 + E1.9 + E2 §10.1 (y los informes E2 P1-P4)
// `tras` = paso del recorrido de 44 pasos de E2 (walk-data.mjs).
const X = [
  // Vestíbulo (se quedan; E2 fase B (1): sin rumor A, la planta solo se acuerda de que le hablaste)
  { n: 'X1', tras: 7, sala: 'vestibulo', txt: 'Hablar planta_plastico (flag local; sin rumor A)', acc: [V('hablar', 'planta_plastico')], esp: { flags: ['vestibulo_planta_oyo'] } },
  { n: 'X2', tras: 7, sala: 'vestibulo', txt: 'Empujar planta_plastico', acc: [V('empujar', 'planta_plastico')], esp: { flags: { planta_empujada_n: 1 } } },
  { n: 'X4', tras: 7, sala: 'vestibulo', txt: 'Mirar rama_diseno · Usar altavoz_ibex', acc: [V('mirar', 'rama_diseno'), V('usar', 'altavoz_ibex')], esp: {} },
  { n: 'X4b', tras: 7, sala: 'vestibulo', txt: 'Mirar cuadro_plazas ×3 · Hablar celestino → plaza de garaje', acc: [V('mirar', 'cuadro_plazas'), V('mirar', 'cuadro_plazas'), V('mirar', 'cuadro_plazas'), V('hablar', 'celestino'), O('¿Cómo se consigue una plaza de garaje?'), SALIR], esp: { flags: { cuadro_plazas_n: 3 } } },
  // §4.3 Ramírez ha vuelto
  { n: 'XM3a', tras: 9, sala: 'pecera', txt: 'Usar chaqueta_ramirez (sin destino): Bruno se la pone', acc: [V('usar', 'chaqueta_ramirez')], esp: { flags: { bruno_con_chaqueta: true }, tiene: ['chaqueta_ramirez'] } },
  { n: 'XM3b', tras: 'XM3a', sala: 'pajarera', txt: '(entrar en Despachos) → Íñigo le confunde; Bruno se la quita', acc: [['ir', 'pajarera']], esp: { flags: { bruno_con_chaqueta: false }, tiene: ['chaqueta_ramirez'] } },
  { n: '—13', tras: 13, sala: 'pecera', txt: 'Control: la llamada L1 ya salió (en la primera entrada sin escena)', acc: [], esp: { flags: { evaristo_llamadas: 1 } } },
  // E1.9 · XE1: Leoncio y Herminia (E2 §2.2: la pantalla dice «HERMINIA (IA) › »)
  { n: 'XE1', tras: 13, sala: 'pecera', txt: 'Hablar leoncio_quesitos → «¿Me hace un gráfico a mí?» (sale la pantalla de Herminia)', acc: [V('hablar', 'leoncio_quesitos'), O('¿Me hace un gráfico a mí?'), SALIR], esp: { log: ['herminia_portatil:HERMINIA (IA) › Bruno · aportación a la planta'] } },
  { n: 'XM1', tras: 15, sala: 'pecera', txt: '(entrar en la Redacción) → reacción viral de Yoli', acc: [['ir', 'pecera']], esp: { flags: ['cafetera_viral'] } },
  // §4.2 el apagón (sin el ticket nº 3: escalada, sin CMS)
  { n: 'XM2', tras: 18, sala: 'pecera', txt: 'Tirar enchufe_pantalla ×3 (sin el ticket nº 3); E2: sin L2', acc: [['ir', 'pecera'], V('tirar', 'enchufe_pantalla'), V('tirar', 'enchufe_pantalla'), V('tirar', 'enchufe_pantalla')], esp: { flags: { apagon_n: 3, cms_vivo: false, evaristo_llamadas: 1 } } },
  { n: 'XE2', tras: 18, sala: 'pecera', txt: 'Hablar anselmo_monolito → «¿Por qué invades la sección de Leoncio?»', acc: [V('hablar', 'anselmo_monolito'), O('¿Por qué invades la sección de Leoncio?'), SALIR], esp: {} },
  { n: '—17', tras: 17, sala: 'catacumba', txt: 'Control: A_MENU llevó antes el rumor C1 (Aurora)', acc: [], esp: { flags: { rumor_teodoro_n: 1 } } },
  { n: 'X6', tras: 18, sala: 'pecera', txt: 'Custodia → «¿Me deja un boli?» → «¿Y cómo se consigue un boli aquí?»', acc: [['ir', 'pecera'], V('hablar', 'custodia_precinto'), O('¿Me deja un boli?'), O('¿Y cómo se consigue un boli aquí?'), SALIR], esp: { flags: ['custodia_regla'] } },
  { n: 'X11', tras: 22, sala: 'cpd', txt: 'Usar rejilla_cpd ×2 (E2 §7.4: el hito del apagón ya no se narra; sin hito pendiente, las dos cuentan)', acc: [V('usar', 'rejilla_cpd'), V('usar', 'rejilla_cpd')], esp: { flags: { rejilla_n: 2 } } },
  { n: '—23', tras: 23, sala: 'pecera', txt: 'Control: Yoli ya no lleva el rumor C (E2 §7.4): sigue en 1', acc: [], esp: { flags: { rumor_teodoro_n: 1 } } },
  { n: 'X9', tras: 24, sala: 'pecera', txt: 'Abrir bandeja_diseno (sin flag cruzado)', acc: [V('abrir', 'bandeja_diseno')], esp: { flags: { pecera_bandeja_abierta: true } } },
  { n: 'X11b', tras: 24, sala: 'pecera', txt: 'Hablar valentin_reticula ×2 (cameo mudo: «Está en la bandeja.»)', acc: [V('hablar', 'valentin_reticula'), V('hablar', 'valentin_reticula')], esp: { log: ['valentin_reticula:Está en la bandeja.'] } },
  // §7.7 perder D1 una vez (la revancha la gana el paso 26); E2 §4.2.1: el pop-up sale antes del menú (1.ª vez)
  { n: 'XM7', tras: 25, sala: 'sala_amazonas', txt: 'Maripaz (pop-up 1.º) → D1 perdido (tres flojas)', acc: [V('hablar', 'maripaz_remitido'), O('Siestatón no ha confirmado la página 7.'), ['perder'], SALIR], esp: { flags: { 'duel:maripaz:perdido_n': 1, casilla_hueco: false, maripaz_popup_n: 1 } } },
  // §4.4 el fugitivo de Mercados y el táper (tras ganar D1, para no romper el paso 26)
  { n: 'XM4a', tras: 26, sala: 'office', txt: 'Hablar mercados_1 → «¿Y cuáles son los siguientes pasos?» · Coger taper_suelo', acc: [['ir', 'office'], V('hablar', 'mercados_1'), O('¿Y cuáles son los siguientes pasos?'), SALIR, V('coger', 'taper_suelo')], esp: { flags: ['mercados_huido'], tiene: ['taper_huerfano'] } },
  // E2 §3 y §4.4 (P4): Marketing y Comercial tras D1: el anuncio de entrada, el aro de Borja, la pantalla y el rumor C2
  { n: 'XP4a', tras: 27, sala: 'ecosistema', txt: '(entrar: anuncio de 5 s) · Hablar aro_borja ×3', acc: [['ir', 'ecosistema'], V('hablar', 'aro_borja'), V('hablar', 'aro_borja'), V('hablar', 'aro_borja')], esp: { flags: { aro_borja_hablar_n: 3, ecosistema_interstitial: true } } },
  { n: 'XP4b', tras: 27, sala: 'ecosistema', txt: 'Mirar pantalla_comercial (plano detalle de la portada)', acc: [V('mirar', 'pantalla_comercial')], esp: { flags: { pantalla_comercial_n: 1 } } },
  { n: '—C3', tras: 27, sala: 'ecosistema', txt: 'Hablar maripaz_remitido (de vuelta en Marketing tras D1) → rumor C2', acc: [V('hablar', 'maripaz_remitido'), SALIR], esp: { flags: { rumor_teodoro_n: 2 } } },
  { n: 'X18b', tras: 27, sala: 'administracion', txt: 'Hablar begona_triplicado → «¿Le han pedido algo raro hoy?»', acc: [['ir', 'administracion'], V('hablar', 'begona_triplicado'), O('¿Le han pedido algo raro hoy?'), SALIR], esp: {} },
  // E2 §10.1 · XE5: la prisa no rompe nada (se repite sin coste); el paso 28 escucha entero después
  { n: 'XE5', tras: 27, sala: 'administracion', txt: 'Evaristo → «¿Para qué me ha llamado?» → «¿Falta mucho?»', acc: [V('hablar', 'evaristo_salvedad'), O('¿Para qué me ha llamado?'), O('¿Falta mucho?'), SALIR], esp: { flags: { evaristo_escuchado: false } } },
  { n: 'X20', tras: 29, sala: 'catacumba', txt: 'Coger bolis_aurora', acc: [V('coger', 'bolis_aurora')], esp: { tiene: ['boli_muerto'], flags: ['boli_muerto_cogido'] } },
  // E2 §10.1 · XE6: el correo de Evaristo a Begoña (no se gasta: es el tercer remate de D4)
  { n: 'XE6', tras: 33, sala: 'administracion', txt: 'Dar correo_evaristo a begona_triplicado (no se gasta)', acc: [['ir', 'administracion'], ['dar', 'correo_evaristo', 'begona_triplicado'], SALIR], esp: { tiene: ['correo_evaristo'], log: ['begona_triplicado:Una copia de un correo. Esto ya es casi un triplicado.'] } },
  { n: '—T0', tras: 33, sala: 'catacumba', txt: 'Control: T0 llevó antes el desmentido C de Teodoro (cadena Aurora → Maripaz → Teodoro)', acc: [], esp: { flags: { rumor_teodoro_n: 2, catacumba_desmentido_c: true } } },
  // §4.5 el fax de teclas
  { n: 'XM5', tras: 34, sala: 'catacumba', txt: 'Usar pieza_opa con fax → «1: GOYITA», de nuevo → «3: CONTROLLING»', acc: [['ir', 'catacumba'], ['usar', 'pieza_opa', 'fax'], O('1: GOYITA'), SALIR, ['usar', 'pieza_opa', 'fax'], O('3: CONTROLLING'), SALIR], esp: { flags: { fax_tecla_n: 2, pieza_recortada: false } } },
  { n: 'X23', tras: 36, sala: 'pecera', txt: 'Dar boli_muerto a custodia_precinto → «Para apuntar lo que me digan. Sin grabadora.»', acc: [['ir', 'pecera'], ['dar', 'boli_muerto', 'custodia_precinto'], O('Para apuntar lo que me digan. Sin grabadora.'), SALIR], esp: { flags: ['custodia_ablandada', 'dos_ias_vista'], notiene: ['boli_muerto'] } },
  { n: 'X24', tras: 36, sala: 'pecera', txt: 'Custodia → «¿Dónde está...?» → «¿Dónde está Ramírez?» → «Ya está.»', acc: [V('hablar', 'custodia_precinto'), O('¿Dónde está...?'), O('¿Dónde está Ramírez?'), O('Ya está.'), SALIR], esp: { log: ['Desayunando.'] } },
  { n: 'XM4b', tras: 37, sala: 'cpd', txt: 'El táper huérfano, a Rubén (se entrega en la escena del armario si Bruno lo lleva)', acc: [], esp: { flags: ['taper_dado'], notiene: ['taper_huerfano'] } },
  // E1.5 / E1.9 · MP1 «Alta en cuarenta segundos» y la anexión
  { n: 'XE3', tras: 38, sala: 'cpd', txt: 'Paco → «¿Me das de alta a una becaria? Se llama Herminia.» → «Herramienta.»', acc: [V('hablar', 'paco_ticket'), O('¿Me das de alta a una becaria? Se llama Herminia.'), O('Herramienta.'), SALIR], esp: { flags: ['herminia_de_alta'] } },
  { n: 'XE4', tras: 'XE3', sala: 'pecera', txt: '(entrar en la Redacción) → anexión', acc: [['ir', 'pecera']], esp: { flags: ['infografia_integrada'] } },
  { n: 'X16', tras: 39, sala: 'ecosistema', txt: 'Mirar portatil_tadeo ×4 (con Rubén encontrado: la réplica R15)', acc: [['ir', 'ecosistema'], V('mirar', 'portatil_tadeo'), V('mirar', 'portatil_tadeo'), V('mirar', 'portatil_tadeo'), V('mirar', 'portatil_tadeo')], esp: { flags: { portatil_tadeo_n: 4, rep_15: true } } },
  // E2 §5.7: L1 y L3 han sonado; la L4 se pierde (Rubén aparece antes de otra entrada sin escena); la L5 espera a la
  // siguiente entrada con ruben_libre. Los tres RV de Tadeo, ya en el correo (sin aviso).
  { n: '—40', tras: 40, sala: 'pecera', txt: 'Control: L1 y L3 ya han sonado (L4 perdida, L5 pendiente); los tres RV, en el correo', acc: [], esp: { flags: { evaristo_llamadas: 2, tadeo_rv_n: 3 } } },
];
const hasta = args.hasta ?? null;
const order = [];
const after = (n) => { for (const x of X) if (x.tras === n) { order.push(x); after(x.n); } };
for (const s of STEPS) { order.push(s); after(s.n); }
const sueltos = X.filter(x => !order.includes(x));
if (sueltos.length) { console.log('Pasos X sin sitio: ' + sueltos.map(x => x.n).join(', ')); process.exit(1); }
const stopIdx = hasta == null ? order.length : order.findIndex(s => String(s.n) === String(hasta)) + 1 || order.length;

const server = createServer(path.resolve(here, '..'));
await new Promise(r => server.listen(0, r));
const base = `http://localhost:${server.address().port}/`;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 960, height: 600 } });
const consoleErrors = [];
page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));
const R = createRunner(page);
const { run, check, state, G } = R;

let lastOk = '—', failed = null, done = 0;
try {
  await page.goto(base);
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) { /* ignore */ } });
  await page.reload();
  await page.waitForFunction(() => !!window.__game);
  if (!args.lento) await G(() => __game.skipText(true));
  await R.startDismisser();
  await G(() => __game.newGame());
  console.log('Walkthrough de extras (plan de comedia §3.5 + E1.9 + E2 §10.1): recorrido de 44 pasos + pasos X intercalados\n');
  for (const s of order.slice(0, stopIdx)) {
    try {
      const log0 = await G(() => __game.log.length);
      for (const a of s.acc) await run(a);
      await G(() => __game.waitIdle());
      await check(s.esp);
      if (s.esp.log) {
        const L = await G((k) => __game.log.slice(k).map(l => `${l.who}:${l.text}`), log0);
        const faltan = s.esp.log.filter(t => !L.some(l => (t.includes(':') && !t.startsWith('«') ? l.startsWith(t) : l.includes(t))));
        if (faltan.length) throw new StepFail(`no salió en pantalla: ${JSON.stringify(faltan)}`);
      }
      console.log(`  ✓ ${String(s.n).padStart(4)} [${s.sala}] ${s.txt}`);
      lastOk = s.n; done++;
      if (args.lento) await page.screenshot({ path: path.join(here, 'shots', `extras-${String(s.n).replace(/\W/g, '_')}.png`) });
    } catch (e) {
      if (!(e instanceof StepFail)) throw e;
      failed = { s, msg: e.message };
      break;
    }
  }
} catch (e) {
  failed = failed || { s: null, msg: 'error del script: ' + (e && e.stack || e) };
}
if (failed) {
  const st = await state().catch(() => null);
  const log = await G(() => __game.log.slice(-6).map(l => `${l.who || '—'}: ${l.text}`)).catch(() => []);
  console.log(`\n  ✗ ${failed.s ? `PASO ${failed.s.n} [${failed.s.sala}] ${failed.s.txt}` : 'FALLO'}`);
  console.log(`    motivo: ${failed.msg}`);
  if (st) console.log(`    contexto: sala=${st.room} inventario=[${st.inventory.join(', ')}] diálogo=${JSON.stringify(st.dialog)} aviso=${st.aviso}`);
  if (log.length) console.log('    últimas líneas:\n      ' + log.join('\n      '));
  fs.mkdirSync(path.join(here, 'shots'), { recursive: true });
  try { await page.screenshot({ path: path.join(here, 'shots', 'extras-fallo.png') }); console.log('    captura: tools/shots/extras-fallo.png'); } catch (_) { /* ignore */ }
}
if (consoleErrors.length) console.log('\nErrores de consola:\n  ' + consoleErrors.join('\n  '));
console.log(failed ? `\nÚltimo paso correcto: ${lastOk} (${done} de ${stopIdx}).` : `\nEXTRAS COMPLETO (${done} pasos)`);
await browser.close();
server.close();
process.exit(failed || consoleErrors.length ? 1 : 0);
