#!/usr/bin/env node
// Test del paquete P4 de la reescritura de comedia (docs/guion2/PLAN_COMEDIA.md §11 P4): Sala Amazonas (reunión,
// estampida, Maripaz y D1 con Siestatón), Marketing y Comercial (Borja, portátil de Tadeo, Maripaz), Eventos (aro de luz,
// «descopear» traducido) y clímax (la hora, la floja «siguientes pasos», Rubén, Celestino por la tele, el 26 % de Begoña).
//   node tools/test-comedia-p4.mjs            (modo rápido)
//   node tools/test-comedia-p4.mjs --shots    además guarda capturas en tools/shots/comedia-p4-*.png
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
const shot = async (name) => {
  if (!args.shots) return;
  await G(() => __game.skipText(false));
  await page.waitForTimeout(350);
  await page.screenshot({ path: path.join(shotsDir, `comedia-p4-${name}.png`) });
  await G(() => __game.skipText(true));
};
/** Captura a mitad de una escena (sin modo rápido): lanza `fn` sin esperar, espera `ms` y fotografía. */
async function shotDuring(name, fn, ms) {
  if (!args.shots) { await fn(); return; }
  await G(() => __game.skipText(false));
  const p = fn();
  if (typeof ms === 'string') {
    for (let i = 0; i < 600 && !(await logHas(ms)); i++) await page.waitForTimeout(50);
    await page.waitForTimeout(600);
  } else await page.waitForTimeout(ms);
  await page.screenshot({ path: path.join(shotsDir, `comedia-p4-${name}.png`) });
  await G(() => __game.skipText(true));
  await p;
  await G(() => __game.waitIdle());
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
const D4_REPS = { rep_10: true, rep_12: true, rep_13: true, rep_05: true, rep_01: true, rep_07: true, rep_15: true };
const ACTO3 = { torno_abierto: true, inigo_presentado: true, chaqueta_en_lector: true, silla_libre: true, acto_2_iniciado: true,
  aurora_conto_pasos: true, reunion_terminada: true, casilla_hueco: true, duelo_maripaz_ganado: true, acto_3_iniciado: true,
  pagina_cerrada: true, ruben_encontrado: true, oyo_descopear: true, ruben_libre: true, sala_abierta: true, duelo_gervasio_ganado: true };

try {
  await page.goto(base);
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) { /* ignore */ } });
  await page.reload();
  await page.waitForFunction(() => !!window.__game);
  await G(() => __game.skipText(true));
  await R.startDismisser();
  await fresh();
  await setFlags({ torno_abierto: true, inigo_presentado: true });

  // ================================================================ SALA AMAZONAS · Acto I
  step('Sala Amazonas, Acto I: Mercados son tres actores; Maripaz sigue en Marketing');
  await G(() => __game.gotoRoom('sala_amazonas'));
  for (const m of ['mercados_1', 'mercados_2', 'mercados_3']) ok((await inRoom(m)) === 'sala_amazonas', `${m} en la sala (actor)`);
  ok(!(await G(() => __game.game.room.def.objects.some(o => o.id === 'figurantes_mercados'))), 'fuera el objeto figurantes_mercados');
  ok((await inRoom('maripaz_remitido')) !== 'sala_amazonas', 'Acto I: Maripaz no está en la Sala');
  await verb('hablar', 'mercados_2');
  ok(await logHas('¿Sigue siendo marzo?') >= 1, 'Hablar a uno de Mercados');
  for (let i = 0; i < 5; i++) await verb('usar', 'tele_amazonas');
  ok(await logHas('Herminia') === 0 && await logHas('PLAN CERO PAPEL') === 1, 'tele: fuera «Alguien ha enchufado aquí a Herminia»');
  await verb('coger', 'tele_amazonas');
  ok(await logHas('antes que Mercados') === 1, 'tele, coger (§6.3)');

  // ================================================================ Acto II: reunión, Maripaz, estampida
  step('Acto II: reunión con Maripaz sentada en el planillo; «siguientes pasos» → estampida (§4.4, §5.9)');
  await setFlags({ acto_2_iniciado: true, aurora_conto_pasos: true, chaqueta_en_lector: true });
  await give('ficha_pagina_7');
  await G(() => __game.gotoRoom('pajarera'));
  await G(() => __game.gotoRoom('sala_amazonas'));
  ok((await inRoom('maripaz_remitido')) === 'sala_amazonas', 'Acto II: Maripaz en la Sala');
  ok(await G(() => __game.objects().some(o => o.id === 'planillo_bajo_maripaz' && o.visible)), 'planillo_bajo_maripaz a la vista');
  await verb('mirar', 'maripaz_remitido');
  ok(await logHas('Lo incuba. Con patrocinio.') === 1, 'Mirar Maripaz');
  await verb('hablar', 'maripaz_remitido');
  ok(await logHas('Estoy en una reunión. Facturándola.') === 1 && !(await state()).dialog, 'antes de la estampida, Maripaz no atiende');
  await verb('coger', 'planillo_bajo_maripaz');
  ok(await logHas('Se negocia.') === 1, 'Coger el planillo: «Se negocia.»');
  await shot('sala-reunion');
  await verb('hablar', 'gervasio_acta');
  ok(await logHas('Se está... se avanza.') === 1 && await logHas('El café, patrocinado.') === 1, 'onStart: Gervasio + Maripaz + Mercados');
  await choose('¿Qué se decide aquí?');
  ok(await logHas('Asiente mucho.') === 1, '[1] con chaqueta_en_lector: Ramírez asiente');
  await choose('¿Puedo presidir yo un rato?');
  ok(await logHas('Gervasio, que es el becario.') === 1 && await logHas('se ofrecía muy rápido') === 1, '[3] presidir');
  await choose('¿Y si votamos si votamos?');
  ok(await logHas('Secundo.') >= 1, '[4] votar si votamos');
  if (args.shots) {
    await shotDuring('estampida', async () => { await choose('¿y cuáles son los siguientes pasos?'); }, '¡No, usted, que es de Bolsa!');
  } else await choose('¿y cuáles son los siguientes pasos?');
  await G(() => __game.waitIdle());
  ok((await flag('reunion_terminada')) === true, 'paso 25 → reunion_terminada');
  ok(await logHas('¡Usted primero!') === 1 && await logHas('¡Tengo doble prioridad!') === 1, 'atasco en la puerta (enAtasco)');
  ok(await logHas('Se levanta la sesión. Lo hablamos.') === 1, 'Gervasio levanta la sesión');
  for (const m of ['mercados_1', 'mercados_2', 'mercados_3']) ok((await inRoom(m)) !== 'sala_amazonas', `${m} ha huido`);
  ok((await inRoom('gervasio_acta')) !== 'sala_amazonas', 'Gervasio ha salido el último');
  ok((await inRoom('maripaz_remitido')) === 'sala_amazonas' && await logHas('La amortizo.') === 1, 'Maripaz no huye: «La amortizo.»');
  ok(await logHas('Liderazgo.') === 1, 'remate de Bruno');
  ok((await G(() => __game.game.getObjState('botellines', 'sala_amazonas').state)) === 'tumbados', 'botellines tumbados tras la estampida');
  ok(!(await G(() => __game.game.room.walk.boxes.find(b => b.id === 'fondo').enabled)), 'el pasillo del fondo vuelve a cerrarse');
  await shot('sala-tras-estampida');

  // ================================================================ D1
  step('D1 en la Sala: tres derrotas con Siestatón (escala) y victoria (§7.7, §5.9)');
  await setFlags({ rep_08: true, rep_04: true, rep_11: true });
  for (let n = 1; n <= 3; n++) {
    await G(() => __game.clearLog());
    await verb('hablar', 'maripaz_remitido');
    await choose('La página 7 está pendiente desde marzo.');
    const st = await state();
    ok(st.duel && st.duel.id === 'maripaz', `D1 abierto (${n})`);
    if (n === 1) {
      ok(st.duel.attack === 'R08' && await logHas('Te lo mando por correo. Con copia.') === 1, 'entrada de D1 y ataque R08');
      await shot('duelo-d1');
    }
    if (n === 1 && args.shots) {
      for (let i = 0; i < 2; i++) await pickWeak();
      await shotDuring('d1-siestaton', async () => { await pickWeak(); }, 'Le atenderemos en sueños.');
    } else for (let i = 0; i < 3; i++) await pickWeak();
    await G(() => __game.waitIdle());
    ok((await flag('duel:maripaz:perdido_n')) === n, `perdido_n = ${n}`);
    ok(await logHas('Te llamamos nosotros.') === 1, `línea de derrota (${n})`);
    if (n === 1) ok(await logHas('Le atenderemos en sueños.') === 1 && await logHas('Me han puesto un ronquido en espera.') === 1, '1.ª derrota: Siestatón al teléfono');
    if (n === 2) ok(await logHas('Por eso bostezamos.') === 1 && await logHas('Ahora roncan dos.') === 1, '2.ª derrota: ronquido a dos voces');
    if (n === 3) ok(await logHas('tarifa de proximidad') === 1 && await logWho('¿Me llamas desde el colchón?') === 'maripaz_remitido', '3.ª derrota: Maripaz a tres metros');
    ok(await logHas('EL COLCHÓN NO LO COGE') === 1, `titular de derrota (${n})`);
  }
  await G(() => __game.clearLog());
  await verb('hablar', 'maripaz_remitido');
  await choose('La página 7 está pendiente desde marzo.');
  await R.playDuel(['R08', 'R04', 'R11', { objeto: 'ficha_pagina_7' }]);
  await G(() => __game.waitIdle());
  let st = await state();
  ok(st.flags.duelo_maripaz_ganado && st.flags.casilla_hueco && st.inventory.includes('ficha_pagina_7'), 'paso 26: duelo_maripaz_ganado, casilla_hueco; la ficha se queda');
  ok(await logHas('Sellada por Aurora. Impar.') === 1 && await logHas('Has invitado a la correctora.') === 1, 'remate con la ficha y victoria nueva');
  ok(await logHas('Y quitad el ronquido de la espera.') === 1, 'tras perder alguna vez: el ronquido');
  ok((await inRoom('maripaz_remitido')) !== 'sala_amazonas', 'Maripaz se va de la Sala');
  ok(!(await G(() => __game.objects().some(o => o.id === 'planillo_bajo_maripaz' && o.visible))), 'el planillo ya no está');

  // ================================================================ MARKETING Y COMERCIAL
  step('Marketing y Comercial: Maripaz de vuelta, Borja (4 opciones), portátil de Tadeo, asistente');
  await G(() => __game.gotoRoom('ecosistema'));
  ok((await inRoom('maripaz_remitido')) === 'ecosistema', 'tras D1, Maripaz vuelve a Marketing y Comercial');
  ok(await G(() => (__game.game.room.def.ambient || []).some(a => a.id === 'maripaz_siestaton')), 'su llamada de ambiente (una vez)');
  await verb('hablar', 'maripaz_remitido');
  ok(!(await opts()).includes('La página 7 está pendiente desde marzo.') && (await opts()).includes('¿Qué tal con Siestatón?'), 'Maripaz en Marketing: sin D1');
  await choose('Me voy.');
  await verb('hablar', 'borja_engagement');
  ok(JSON.stringify(await opts()) === JSON.stringify(['¿Qué hacéis en Marketing?', '¿Has leído mi pieza?', 'Esta noche hay una opa.', 'Me voy.']), 'Borja: cuatro opciones (§5.16)');
  await choose('¿Has leído mi pieza?');
  ok(await logHas('Lo he compartido. Es más rápido.') === 1, 'Borja: «Lo he compartido»');
  await choose('Me voy.');
  await verb('empujar', 'borja_engagement');
  ok(await logHas('engagement orgánico') === 1, 'Empujar a Borja');
  await G(() => __game.clearLog());
  for (let i = 0; i < 4; i++) await verb('mirar', 'portatil_tadeo');
  ok(await logHas('lo más pesado de la web es el logo') === 1 && await logHas('Adjunto pantallazo') === 1 && !(await flag('rep_15')), 'portátil: cuatro mensajes, sin R15 antes de Rubén');
  ok(await G(() => !__game.log.some(l => /LCP|CLS|INP|Core Web/.test(l.text))), 'portátil sin siglas');
  await setFlags({ ruben_encontrado: true });
  for (let i = 0; i < 4; i++) await verb('mirar', 'portatil_tadeo');
  ok((await flag('rep_15')) === true && await logHas('Lo sé. Me lo ha contado ella. Se llama Rubén') === 1, 'con Rubén encontrado: R15 nueva');
  await setFlags({ ruben_encontrado: false });
  await verb('hablar', 'portatil_tadeo');
  ok((await opts()).length === 3, 'asistente: tres opciones');
  await choose('¿Lees lo que te reenvía?');
  ok(await logHas('No. Él tampoco.') === 1, 'asistente: «No. Él tampoco.»');
  await choose('Adiós.');
  ok(await logHas('¡Excelente despedida!') === 1, 'asistente: despedida');
  await verb('empujar', 'ecosistema_a_administracion');
  ok(await logHas('Ya va él solo.') === 1, 'pasillo (§6.3)');
  await shot('marketing');

  step('Acto II antes de D1: Maripaz no está en Marketing');
  await setFlags({ casilla_hueco: false });
  await G(() => __game.gotoRoom('administracion'));
  await G(() => __game.gotoRoom('ecosistema'));
  ok((await inRoom('maripaz_remitido')) !== 'ecosistema', 'sin casilla_hueco, Maripaz no está en Marketing');
  await G(() => __game.clearLog());
  await verb('hablar', 'termometro_ventas');
  ok(await G(() => !__game.log.some(l => l.who === 'maripaz_remitido')), 'sin Maripaz, el termómetro no lo contesta ella');
  await setFlags({ casilla_hueco: true });

  // ================================================================ EVENTOS
  step('Eventos: solo el aro de luz y «descopear» traducido');
  await G(() => __game.gotoRoom('eventos'));
  await verb('coger', 'aro_luz');
  ok(await logHas('Mañana la Redacción amanecería con su cara de verdad.') === 1, 'aro de luz: sin «la Pecera»');
  await setFlags({ ruben_encontrado: true, acto_3_iniciado: true });
  await G(() => __game.clearLog());
  await verb('hablar', 'pilar_escaleta');
  await choose('¿Me prestas el álbum?');
  await R.closeDialog();
  ok(await logHas('O sea, quitado del plan. Con cariño.') === 1 && await logHas('Quitar algo sin que se note.') === 1, 'borjaSeAsoma: «descopear», traducido');
  ok((await flag('oyo_descopear')) === true && (await state()).inventory.includes('album_eventos'), 'paso 37 sigue igual');

  // ================================================================ CLÍMAX
  step('Clímax: la hora, la floja «siguientes pasos» con Gervasio escondido, Rubén, Celestino, el 26 %');
  await fresh();
  await setFlags({ ...ACTO3, ...D4_REPS, 'duel:inigo:floja': 2 });
  await give('ticket_n1', 'acta_reunion');
  await G(() => __game.clearLog());
  await enterClimax();
  ok((await flag('climax_entrada')) === true, 'climax_entrada');
  ok(await logHas('mi móvil y los relojes de la casa dicen lo mismo') === 1, 'línea de la hora (§8.4)');
  // R10, R12, remate A (entra Rubén) y R13: la floja del cuarto asalto es «siguientes pasos»
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
      window.__probe.push({ who: (who && who.id) || who || (opts && opts.who), text, gervasioVisible: ger.visible, agachado: !!g.state.flags.sala_amazonas_gervasio_agachado,
        lector: { room: lec.room, visible: lec.visible, caido: g.spriteOf(lec) === lec.variants.caido }, tele: g.getObjState('tele_amazonas', 'sala_amazonas').state });
      return g.__speakOrig(who, text, opts);
    };
  });
  if (args.shots) {
    await G(() => __game.skipText(false));
    const i = st.duel.weakIndex;
    const pr = G(i => __game.chooseDialog(i), i);
    for (let k = 0; k < 400 && !(await logHas('Diapositiva 312')); k++) await page.waitForTimeout(50);
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(shotsDir, 'comedia-p4-d4-siguientes-pasos.png') });
    await G(() => __game.skipText(true));
    await pr;
  } else await G(i => __game.chooseDialog(i), st.duel.weakIndex);
  let probe = await G(() => window.__probe);
  const p312 = probe.find(p => String(p.text).includes('Diapositiva 312'));
  ok(p312 && !p312.gervasioVisible && p312.agachado, 'Gervasio se agacha tras su sillón mientras Íñigo contesta');
  ok(await logHas('«Siguientes pasos de los siguientes pasos».') === 1, 'Íñigo: «Siguientes pasos de los siguientes pasos»');
  ok(await G(() => __game.game.actors.gervasio_acta.visible) && !(await flag('sala_amazonas_gervasio_agachado')), 'Gervasio vuelve a asomar');
  ok((await state()).duel.misses === 1, 'la floja cuenta como fallo');
  // resto del duelo: contesta lo que llegue y remata con los objetos
  const pairs = await G(() => Object.fromEntries(__game.game.content.duels.pairs.map(p => [p.id, p.reply])));
  for (let g = 0; g < 40; g++) {
    st = await state();
    if (!st.duel) break;
    if (!st.dialog && !st.pickItem) { await page.waitForTimeout(30); continue; }
    if (st.duel.phase === 'reply') await G(k => __game.chooseDialog(k), st.dialog.indexOf(pairs[st.duel.attack]));
    else if (st.duel.phase === 'finisher') { await choose('[Usar objeto]'); await G(id => __game.chooseItem(id), (await logHas('Hola. Soy la inversión.')) ? 'acta_reunion' : 'ticket_n1'); }
  }
  await G(() => __game.waitIdle());
  ok((await flag('duelo_inigo_ganado')) === true, 'D4 ganado');
  ok(await logHas('Yo. Perdón.') === 1 && await logWho('Yo. Perdón.') === 'ruben', 'hurtByPair R13: Rubén reclama la autoría');
  await G(() => { window.__probe = []; });
  await shot('climax-antes-empujon');
  if (args.shots) {
    await shotDuring('climax-celestino-tele', async () => { await verb('empujar', 'lector_medio'); }, '¡Que lo mire el árbitro!');
  } else await verb('empujar', 'lector_medio');
  await G(() => __game.waitIdle());
  probe = await G(() => window.__probe);
  await G(() => { const g = __game.game; if (g.__speakOrig) { g.speak = g.__speakOrig; delete g.__speakOrig; } });
  const finEsc = probe.findIndex(p => p.text === 'Eso es el papel.');
  const cel = probe.slice(0, finEsc).filter(p => p.who === 'celestino');
  if (cel.length !== 2) console.log('    (probe) ' + JSON.stringify(probe.slice(0, 12).map(p => [p.who, p.text])));
  ok(cel.length === 2 && cel[0].text.startsWith('¡Al suelo el Lector Medio!'), 'Celestino retransmite por la tele (2 líneas)');
  ok(cel.every(p => p.tele === 'entrada_1' && p.lector.caido && p.lector.visible && p.lector.room === 'sala_amazonas'), 'tele en «ENTRADA 1» y el Lector caído a la vista');
  const arb = probe.findIndex(p => p.text === '...Lo que diga el árbitro.');
  const lmed = probe.findIndex(p => p.text === 'Lo que diga el Lector Medio.');
  const fase1 = probe.findIndex(p => p.text === '...¿Y quién ha validado la fase 1?');
  ok(lmed >= 0 && arb > lmed && fase1 > arb, 'orden: «Lo que diga el Lector Medio» → Celestino → «el árbitro» → «la fase 1»');
  ok(await logHas('Recorte estándar del 26 %: 35.520 euros.') === 1 && await logHas('Y rechazada igual. Al lado del ministro.') === 1, 'Begoña: el 26 % a la factura');
  ok(await logHas('Rechazada. Va a la pared.') === 0, 'fuera la línea vieja de Begoña');
  ok((await flag('lector_derribado')) === true && (await flag('juego_terminado')) === true, 'empujón → final');

  // ================================================================ D4 perdido: sin titular
  step('D4 perdido: línea de derrota nueva y sin titular');
  await fresh();
  await setFlags({ ...ACTO3, ...D4_REPS, 'duel:inigo:floja': 0 });
  await give('ticket_n1', 'acta_reunion');
  await enterClimax();
  await G(() => __game.clearLog());
  for (let i = 0; i < 3; i++) await pickWeak();
  await G(() => __game.waitIdle());
  st = await state();
  ok(!st.duel && st.lastDuel.result === 'lost', 'D4 perdido');
  ok(await logHas('Asignado a Vacante. Llama tú a la rotativa.') === 1 && await logHas('Ni hablar.') >= 1, 'derrota §7.7');
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
