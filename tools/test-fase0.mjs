#!/usr/bin/env node
// PRUEBA DE LOS SISTEMAS COMUNES DEL PLAN DE COMEDIA (paquete P0, docs/guion2/PLAN_COMEDIA.md §7-§9 y §4): registra en
// caliente la sala de demostración tools/demo-fase0.js y comprueba, con capturas en tools/shots/fase0-*.png:
//   · duelo: ataque escrito en la ventana, menú ≤ 5, marcador en texto, CC que crece, contestación de la floja antes de
//     la derrota, línea y escena de derrota propias, titular, revancha, hurtByPair con otro actor, onHit con la pareja,
//     guardar dentro del duelo → cargar lo reanuda, sin autoguardado en el duelo, y en iPhone horizontal todo cabe;
//   · objetivos: la ficha viva (tres estados), «Mirar a Bruno» con la meta, api.objetivo; pistas de la abuela en tres
//     niveles sin repetir llamada; hora del móvil por hitos (siempre creciente);
//   · ambiente: nunca encima de un globo / menú / aviso, máximo por visita, reglas por defecto (60-120 s, 3);
//   · movimiento: doble clic en salida = salir ya; doble clic en el suelo = correr (≥ 2×); mantener pulsado = seguir;
//     los paseos de guion no corren; un PNJ que anda se para mientras se le apunta;
//   · efectos: apagón, estampida, megafonía (y Celestino por la megafonía del ascensor), viral, titular, tarjeta final,
//     Bruno con la chaqueta de Ramírez (variante por flag y api.vestir); sin selector de dificultad;
//   · ENMIENDA E2: despedidas una sola vez, pop-up de la X menguante y anuncio con cuenta atrás (capturas
//     tools/shots/e2-fase0-*.png), api.pantalla con «HERMINIA (IA) › », Bruno con el adhesivo (y con la chaqueta),
//     objetivos «coma» y «bendicion», notas a lápiz de la ficha, objeto correo_evaristo y migración de partidas.
//   node tools/test-fase0.mjs
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
const wait = (ms) => new Promise(r => setTimeout(r, ms));

async function open(ctxOpts = { viewport: { width: 960, height: 600 } }) {
  const ctx = await browser.newContext(ctxOpts);
  const page = await ctx.newPage();
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));
  await page.goto(base + '?room=pecera');
  await page.waitForFunction(() => window.__game && __game.state().mode === 'play');
  await page.evaluate(() => { __game.skipText(true); return __game.waitIdle(); });
  await page.evaluate(() => __game.skipText(false));
  await page.evaluate(async (base) => {
    const m = await import(base + 'tools/demo-fase0.js');
    const g = __game.game, R = m.default;
    g.content.rooms[R.id] = R;
    Object.assign(g.content.flags, R.flags || {});
    Object.assign(g.content.scenes, R.scenes || {});
    for (const [k, o] of Object.entries(R.duels || {})) g.content.duels.opponents[k] = { id: k, ...o };
    for (const p of R.actors) { const a = g.actors[p.id]; const L = R.layout[p.id]; a.room = R.id; a.x = L.at[0]; a.y = L.at[1]; a.dir = L.at[2]; a.visible = true; a.path = []; }
    window.__demo = R;
  }, base);
  const G = (fn, a) => page.evaluate(fn, a);
  const enter = async (entry = 'pecera') => { await G(e => __game.gotoRoom('demo_fase0', e), entry); };
  await enter();
  return { ctx, page, G, enter };
}
const shot = (page, name) => page.screenshot({ path: path.join(shots, `fase0-${name}.png`) });
const until = async (G, fn, arg, ms = 20000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await G(fn, arg)) return true; await wait(40); } return false; };
const click = async (page, G, x, y) => { const p = await G(([x, y]) => __game.virtualToClient(x, y), [x, y]); await page.mouse.click(p.x, p.y); };

try {
  console.log('Sistemas comunes del plan de comedia (tools/demo-fase0.js)\n');
  const { page, G, enter } = await open();

  // ================================================================ duelo
  console.log('Duelo «Responder a todos» (plan §7)');
  await G(() => { for (const f of ['rep_05', 'rep_03', 'rep_13', 'rep_01', 'rep_07', 'rep_08', 'rep_09', 'rep_12']) __game.setFlag(f, true); __game.clearLog(); });
  G(() => __game.doVerb('hablar', 'paco_ticket'));
  ok(await until(G, () => __game.state().duel && __game.state().dialog), 'Hablar con Paco abre el duelo de la demo');
  let st = await G(() => __game.state());
  ok(st.dialog.length <= 5 && st.duel.correctIndex >= 0 && st.duel.weakIndex === st.dialog.length - 1, `menú ≤ 5 opciones: la correcta + señuelos + 1 floja (${st.dialog.length}: ${JSON.stringify(st.dialog)})`);
  ok(st.duel.body === 'Esto, entre tú y yo. Que no salga de la rejilla.' && st.duel.score === 'ACIERTOS 0/3 · FALLOS 0/3', `el ataque (paráfrasis) queda escrito en la ventana y el marcador en texto: «${st.duel.body}» · ${st.duel.score}`);
  ok(await G(() => __game.game.hud != null), 'la ventana de correo sigue abierta con el menú');
  await wait(250); await shot(page, 'duelo-ataque-menu');
  // guardar dentro del duelo: sin autoguardado; la ranura recuerda el duelo; cargar lo reanuda
  const autoAntes = await G(() => localStorage.getItem(__game.game.slotKey('auto')));
  await G(() => __game.game.autosave());
  ok(await G(a => localStorage.getItem(__game.game.slotKey('auto')) === a, autoAntes), 'sin autoguardado con un duelo abierto (§7.1.14)');
  await G(() => __game.save(3));
  ok(await G(() => JSON.parse(localStorage.getItem(__game.game.slotKey(3))).state.duelPendiente === 'demo'), 'una partida guardada en el duelo lo apunta (duelPendiente)');
  await G(() => __game.chooseDialog(__game.state().duel.correctIndex));
  ok(await G(() => __game.state().flags.demo_fase0_hit === 'R05'), 'acierto: onHit recibe la pareja (R05)');
  await until(G, () => __game.state().dialog);
  await G(() => __game.chooseDialog(__game.state().duel.weakIndex));
  await until(G, () => __game.state().dialog);
  st = await G(() => __game.state());
  ok(st.duel.cc === 'Sistemas' && st.duel.score === 'ACIERTOS 1/3 · FALLOS 1/3', `1.er fallo: el CC del rival (${st.duel.cc}) · ${st.duel.score}`);
  await G(() => __game.chooseDialog(__game.state().duel.weakIndex));
  await until(G, () => __game.state().dialog);
  st = await G(() => __game.state());
  ok(st.duel.cc === 'Sistemas, Toda la planta', `2.º fallo: «Toda la planta» en copia (${st.duel.cc})`);
  await wait(200); await shot(page, 'duelo-cc-crece');
  // cargar la partida guardada dentro del duelo: el duelo vuelve a empezar (no se cae a la sala)
  await G(() => __game.skipText(true));
  await G(() => __game.load(3));
  ok(await until(G, () => __game.state().duel && __game.state().dialog), 'cargar una partida guardada en el duelo lo REANUDA (crítica §6.5)');
  st = await G(() => __game.state());
  ok(st.duel.hits === 0 && st.duel.misses === 0 && st.duel.attack === 'R05', 'el duelo reanudado empieza de 0 (ataque R05)');
  // derrota: tres flojas; la contestación de la tercera se oye antes de la línea de derrota propia; escena y titular
  await G(() => __game.clearLog());
  let ultima = null;
  for (let i = 0; i < 3; i++) {
    await until(G, () => __game.state().dialog);
    ultima = await G(() => { const s = __game.state(); return s.dialog[s.duel.weakIndex]; });
    if (ultima.startsWith('Enviado desde')) i--;
    await G(() => __game.chooseDialog(__game.state().duel.weakIndex));
  }
  await G(() => __game.waitIdle());
  st = await G(() => __game.state());
  ok(st.lastDuel.result === 'lost' && st.flags['duel:demo:perdido_n'] === 1, 'tres fallos = derrota; duel:demo:perdido_n = 1');
  const orden = await G(t => { const w = __game.game.content.duels.weakReplies.find(x => x.text === t); const L = __game.log.map(l => l.text);
    return [L.indexOf(w.answer), L.findIndex(x => x.startsWith('RESPUESTA AUTOMÁTICA DE SISTEMAS')), L.indexOf('Ticket 48.213. Para ti.'), L.findIndex(x => x.startsWith('UN BECARIO PIERDE'))]; }, ultima);
  ok(orden.every((v, i) => v >= 0 && (i === 0 || v > orden[i - 1])), `orden: contestación de la floja → línea de derrota propia → escena de derrota → titular (${orden})`);
  ok(st.flags.demo_fase0_derrota === 1, 'la escena de derrota (defeatScene) se ha ejecutado');
  ok(!!st.flags['duel:demo:empieza'], `la revancha empezará por el ataque que ganó (${st.flags['duel:demo:empieza']})`);
  // capturas en directo de la escena de derrota y el titular
  await G(() => __game.skipText(false));
  G(() => __game.doVerb('hablar', 'paco_ticket'));
  await until(G, () => __game.state().dialog);
  ok(await G(() => __game.state().duel.attack === __game.state().flags['duel:demo:empieza']), 'revancha: el mazo empieza por esa carta');
  // (sin esperar a «idle»: la última elección no vuelve hasta que acaban la derrota, la escena y el titular)
  for (let i = 0; i < 3; i++) { await until(G, () => __game.state().dialog); const w = await G(() => { const s = __game.state(); return s.dialog[s.duel.weakIndex]; }); if (w.startsWith('Enviado desde')) i--; await G(() => { __game.game.choice.resolve(__game.state().duel.weakIndex); }); await wait(300); }
  ok(await page.waitForFunction(() => __game.game.speeches.some(s => s.text === 'Otra vez. Ticket duplicado.'), null, { polling: 25, timeout: 90000 }).then(() => true, () => false), 'la escena de derrota escala con duel:<id>:perdido_n');
  await shot(page, 'duelo-escena-derrota');
  ok(await page.waitForFunction(() => __game.game.speeches.some(s => s.style === 'titular'), null, { polling: 25, timeout: 30000 }).then(() => true, () => false), 'el titular de derrota sale como franja de titular');
  await wait(150); await shot(page, 'duelo-titular-derrota');
  await G(() => __game.skipText(true)); await G(() => __game.waitIdle());
  // victoria con hurtByPair de otro actor (Celestino está en la sala)
  await G(() => { __game.setFlag('duel:demo:empieza', 'R05'); __game.clearLog(); });
  G(() => __game.doVerb('hablar', 'paco_ticket'));
  for (let i = 0; i < 3; i++) { await until(G, () => __game.state().dialog); await G(() => __game.chooseDialog(__game.state().duel.correctIndex)); }
  await G(() => __game.waitIdle());
  ok(await G(() => __game.state().lastDuel.result === 'won'), 'el duelo de la demo se gana con tres aciertos');
  ok(await G(() => { const L = __game.log; const i = L.findIndex(l => l.who === 'paco_ticket' && l.text === 'Eso lo escribió alguien brillante.'); return i >= 0 && L[i + 1] && L[i + 1].who === 'celestino' && L[i + 1].text === 'Yo. Perdón.'; }), 'hurtByPair con otro actor: Paco encaja y Celestino remata (§7.6, Rubén en D4)');

  // ================================================================ ficha, meta, pistas, hora
  console.log('\nObjetivo, pistas y hora (plan §8)');
  await G(() => __game.newGame());
  await G(() => __game.waitIdle());
  const meta = (await G(() => { __game.clearLog(); return __game.doVerb('mirar', 'bruno').then(() => __game.log.filter(l => l.who === 'bruno').map(l => l.text)); }));
  ok(meta.includes('Seis años aquí y el torno no sabe quién soy. Tengo que constar en algo.'), `Mirar a Bruno en el vestíbulo: la meta del torno (${meta})`);
  // pistas: cuatro llamadas seguidas = niveles 1, 2, 3 (+ Bruno al colgar) y 3 de nuevo, nunca dos llamadas iguales
  const llamada = async () => G(async () => { __game.clearLog(); await __game.scene('pistas'); return __game.log.filter(l => l.who === 'abuela_remedios' || l.who === 'bruno').map(l => (l.who === 'bruno' ? 'B: ' : 'A: ') + l.text); });
  const L1 = await llamada(), L2 = await llamada(), L3 = await llamada(), L4 = await llamada();
  ok(L1.includes('A: En el pueblo, el que no sale en la foto no existe. Ponte en la foto.'), 'llamada 1: nivel 1 (metáfora)');
  ok(L2.includes('A: Si el torno no te conoce, preséntate en ese cuadro de caras.'), 'llamada 2: nivel 2 (concreta)');
  ok(L3.includes('A: Pega tu cara donde salen los jefes. Con algo que pegue.') && L3[L3.length - 1] === 'B: Chicle, tarjeta, organigrama. Y luego el torno.', 'llamada 3: nivel 3 y Bruno dice la acción AL COLGAR');
  ok(L3.includes('A: El del mostrador siempre está mascando algo. Pídeselo.'), 'nivel 3: la línea extra (sin chicle)');
  ok(L4.includes('A: Te lo digo otra vez, hijo, que no comes.'), 'llamada 4: nivel 3 repetido con «Te lo digo otra vez»');
  const quita = (L) => L.filter(x => !/^A: (¿Bruno\?|Hijo, ¿ya|Te llamo porque)/.test(x)).join('|');
  ok(quita(L1) !== quita(L2) && quita(L2) !== quita(L3) && quita(L3) !== quita(L4), 'nunca dos llamadas seguidas idénticas');
  ok([L1, L2, L3, L4].every(L => L.filter(x => x.startsWith('A: ')).pop() === 'A: Abrígate.'), 'cada llamada acaba en «Abrígate.»');
  // captura de la secuencia: una llamada de cada nivel con el móvil abierto (en vivo)
  await G(() => { __game.setFlag('abuela_obj', null); __game.setFlag('abuela_nivel', 0); __game.skipText(false); });
  for (const [n, txt] of [[1, 'En el pueblo'], [2, 'Si el torno'], [3, 'Pega tu cara']]) {
    G(() => __game.scene('pistas'));
    await until(G, t => __game.game.speeches.some(s => s.text.startsWith(t)), txt, 15000);
    await wait(250); await shot(page, `pista-nivel-${n}`);
    await G(() => __game.skipText(true)); await G(() => __game.waitIdle()); await G(() => __game.skipText(false));
  }
  // por sala y objetivo: en el Acto II, en Sistemas toca el CMS; en Administración, la nota de gasto
  await G(() => { for (const f of ['torno_abierto', 'inigo_presentado', 'silla_libre', 'rep_11', 'gertrudis_saludada', 'acto_2_iniciado']) __game.setFlag(f, true); __game.skipText(true); });
  await G(() => __game.gotoRoom('cpd'));
  let Lc = await llamada();
  ok(Lc.includes('A: La tele de tu abuelo no iba si él la miraba. Apágale algo a alguien.'), 'en Sistemas, la pista del CMS (objetivo de la sala)');
  await G(() => __game.gotoRoom('administracion'));
  Lc = await llamada();
  ok(Lc.includes('A: ¿Has hecho la cuenta de gastos? Hazla mal. Te enseñan una buena.'), 'en Administración, la de la nota de gasto (nivel 1 al cambiar de objetivo)');
  ok(await G(() => __game.game.condApi().objetivo.actual('cpd') === 'cms'), 'api.objetivo.actual(sala)');
  await G(() => __game.game.condApi().objetivo.marcar('cms'));
  ok(await G(() => __game.game.condApi().objetivo.hecho('cms') && !__game.game.condApi().objetivo.pendientes().includes('cms')), 'api.objetivo.marcar / hecho / pendientes');
  // la ficha viva
  await G(() => { __game.giveItem('ficha_pagina_7'); __game.setFlag('cms_vivo', false); __game.game.state.flags['obj:cms'] = false; });
  const ficha = () => G(async () => { __game.clearLog(); await __game.doVerb('mirar', 'ficha_pagina_7'); return __game.log.filter(l => l.who === 'bruno').map(l => l.text); });
  let F = await ficha();
  ok(F[0] === 'Ficha de la página 7. Hueco, fuente, firma.' && F.includes('HUECO: vendida a Siestatón, sin confirmar. Lo decide la Sala Amazonas.') && F.includes('FUENTE: dos fuentes, dice Aurora. Tengo cero.') && F.includes('FIRMA: Teodoro solo habla por fax. Y el fax no tiene papel.') && F.includes('Al margen, a lápiz: «Arriba no me atiende nadie. El CMS está en coma».'), 'ficha (estado inicial): casillas pendientes y la nota al margen');
  const icon0 = await G(() => __game.game.content.items.ficha_pagina_7.iconKey(__game.game.viewFor()));
  await G(() => { for (const f of ['reunion_terminada', 'fax_con_papel', 'cms_vivo', 'casilla_fuente', 'pieza_escrita']) __game.setFlag(f, true); __game.giveItem('fotocopia_nota_direccion'); });
  F = await ficha();
  ok(F.includes('HUECO: la reunión ha acabado. Maripaz no. Sigue sentada en el planillo.') && F.includes('FUENTE, hecho: una anónima y otra con IVA.') && F.includes('FIRMA: el fax ya habla. Ahora hay que ganárselo contestando.') && F.includes('PIEZA: treinta y una líneas. El hueco, veintitrés. Me sobran ocho.') && !F.some(x => x.startsWith('Al margen')), 'ficha (a medias): lo hecho, corto; lo pendiente, qué falta; la pieza');
  const icon1 = await G(() => __game.game.content.items.ficha_pagina_7.iconKey(__game.game.viewFor()));
  ok(icon0 !== icon1, `el icono de la ficha refleja el progreso (${icon0} → ${icon1})`);
  await G(() => { __game.skipText(false); __game.game.runScript(a => a.say(['FUENTE, hecho: una anónima y otra con IVA.'])); });
  await wait(400); await shot(page, 'ficha-viva');
  await G(() => { __game.skipText(true); return __game.waitIdle(); });
  await G(() => { for (const f of ['casilla_hueco', 'casilla_firma', 'pieza_recortada']) __game.setFlag(f, true); });
  F = await ficha();
  ok(F.includes('HUECO, hecho: Siestatón, a la web. Veintitrés líneas abajo, mías.') && F.includes('FIRMA, hecho: «Trece con espacios. Cabe.»') && F.includes('PIEZA: veintitrés líneas. Lista para Teodoro.'), 'ficha (completa): tres casillas hechas y la pieza lista');
  // la hora, por hitos
  await G(() => __game.newGame()); await G(() => __game.waitIdle());
  const hora = () => G(() => __game.game.condApi().hora());
  ok(await hora() === '18:30', 'hora del móvil al empezar: 18:30');
  await G(() => __game.setFlag('torno_abierto', true));
  ok(await hora() === '18:41', 'torno_abierto: 18:41');
  await G(async () => { __game.skipText(false); __game.game.runScript(a => a.game.content.items.movil.handlers.usar(a)); });
  await until(G, () => __game.state().phone && __game.state().dialog);
  await wait(500); await shot(page, 'movil-1841');
  await G(() => __game.chooseText('Guardar el móvil')); await G(() => __game.waitIdle());
  await G(() => { for (const f of ['acto_2_iniciado', 'casilla_hueco', 'cms_vivo']) __game.setFlag(f, true); });
  ok(await hora() === '19:32', `Acto II: 19:07 + 20 por casilla + 5 con CMS = 19:32 (${await hora()})`);
  await G(() => __game.setFlag('acto_3_iniciado', true));
  ok(await hora() === '20:22', 'acto_3_iniciado: 20:22');
  await G(() => __game.setFlag('acto_3_iniciado', false));
  ok(await hora() === '20:22', 'la hora nunca retrocede');
  await G(async () => { __game.game.runScript(a => a.game.content.items.movil.handlers.usar(a)); });
  await until(G, () => __game.state().phone && __game.state().dialog);
  await wait(500); await shot(page, 'movil-2022');
  await G(() => __game.chooseText('Guardar el móvil')); await G(() => { __game.skipText(true); return __game.waitIdle(); });
  { const src = fs.readFileSync(path.join(here, '..', 'content', 'lib', 'movil.js'), 'utf8');
    ok(!src.includes('Son las 20:59') && !src.includes('de 412'), 'el móvil ya no dice «Son las 20:59» ni «página 1 de 412» (crítica §5 y §9.1)'); }

  // ================================================================ ambiente
  console.log('\nAmbiente (plan §5.14)');
  await G(() => __game.gotoRoom('pecera'));
  const R = await G(() => { const A = __game.game.room.amb; return { max: A.max, falta: Math.round(A.next - __game.game.time) }; });
  ok(R.max === 3 && R.falta >= 59000 && R.falta <= 121000, `reglas por defecto en la Redacción: máx. 3 por visita, la 1.ª a los 60-120 s (${R.falta} ms)`);
  await G(() => { __game.skipText(false); __game.clearLog(); });
  await enter();
  ok(await until(G, () => __game.log.some(l => l.text === 'Internet está mal hecho.'), null, 6000), 'la sala solo da las líneas: el motor las dice');
  // nunca encima de un globo: Bruno habla justo cuando toca la siguiente discusión
  await until(G, () => !__game.game.room.amb.running, null, 15000);
  const solape = await G(async () => {
    const g = __game.game; g.room.amb.next = g.time + 200; let bad = 0, ambientes = 0;
    g.runScript(a => a.say(['Hablo yo un rato largo, sin que nadie me pise.', 'Y sigo un poco más, por si acaso.']));
    const t0 = performance.now();
    while (performance.now() - t0 < 12000) {
      const amb = g.speeches.filter(s => s.ambient), real = g.speeches.filter(s => !s.ambient);
      if (amb.length && real.length) bad++;
      if (amb.length) ambientes++;
      await new Promise(r => setTimeout(r, 30));
    }
    return { bad, ambientes };
  });
  ok(solape.bad === 0, `el ambiente nunca sale encima de un globo (muestras con dos globos: ${solape.bad})`);
  ok(solape.ambientes > 0, 'la discusión pospuesta sale en cuanto hay silencio');
  const conMenu = await G(async () => {
    const g = __game.game; await __game.waitIdle(); g.room.amb.next = g.time; const n0 = g.log.length;
    const p = g.choose(['Uno', 'Dos']); await new Promise(r => setTimeout(r, 1500));
    const hablo = g.log.slice(n0).some(l => l.text && /margen|cuarta|lluvia|tráfico|incidencia/.test(l.text));
    g.choice.resolve(0); await p; return hablo;
  });
  ok(!conMenu, 'con un menú abierto el ambiente espera');
  ok(await until(G, () => (__game.state().flags['ambient:demo_fase0.coro_demo'] || 0) >= 3 && !__game.game.room.amb.running, null, 20000), 'salen las tres discusiones de la visita');
  await wait(4500);
  ok(await G(() => !__game.log.some(l => l.text === 'Esta no sale: es la cuarta.') && __game.game.room.amb.count === 3), 'máximo 3 por visita (la cuarta no sale)');
  await G(() => __game.skipText(true));

  // ================================================================ movimiento
  console.log('\nMovimiento (crítica §4.2)');
  await G(() => __game.skipText(false));
  const vel = async (doble) => {
    await G(() => { const p = __game.game.player; p.x = 80; p.y = 124; p.path = []; __game.game.snapCamera(); });
    await wait(80);
    await click(page, G, 290, 124); if (doble) { await wait(90); await click(page, G, 290, 124); }
    const x0 = await G(() => __game.game.player.x); await wait(600); const x1 = await G(() => __game.game.player.x);
    const run = await G(() => !!__game.game.player.running);
    await until(G, () => !__game.game.player.path.length, null, 6000);
    return { v: (x1 - x0) / 0.6, run };
  };
  const andar = await vel(false), correr = await vel(true);
  ok(!andar.run && correr.run && correr.v >= 2 * andar.v, `doble clic en el suelo = correr (${Math.round(andar.v)} → ${Math.round(correr.v)} px/s)`);
  await G(() => { const p = __game.game.player; p.x = 80; p.y = 124; p.path = []; __game.game.snapCamera(); __game.game.walkActor(p.id, 300, 124, { run: true }); });
  await wait(250); await shot(page, 'correr');
  await until(G, () => !__game.game.player.path.length, null, 6000);
  // mantener pulsado: Bruno sigue al puntero
  const pA = await G(() => __game.virtualToClient(150, 126)), pB = await G(() => __game.virtualToClient(280, 130));
  await page.mouse.move(pA.x, pA.y); await page.mouse.down(); await wait(150);
  for (let k = 0; k <= 10; k++) { await page.mouse.move(pA.x + (pB.x - pA.x) * k / 10, pA.y + (pB.y - pA.y) * k / 10); await wait(60); }
  await wait(400);
  const sigue = await G(() => { const p = __game.game.player; const e = p.path.length ? p.path[p.path.length - 1] : [p.x, p.y]; return Math.abs(e[0] - (280 + Math.round(__game.game.camX))) < 12; });
  await page.mouse.up();
  ok(sigue, 'mantener pulsado y arrastrar: Bruno sigue al puntero');
  // paseo de guion: nunca corre
  ok(await G(async () => { const g = __game.game; let corrio = false; const p = g.runScript(async a => { const w = a.walkTo(200, 124); corrio = g.player.running; await w; }); await p; return !corrio; }), 'los paseos de guion (api.walkTo) no corren');
  // doble clic en una salida: sale ya
  await G(() => { const g = __game.game, p = g.player; p.x = 200; p.y = 124; p.path = []; g.camX = 0; g.camTarget = null; });
  await wait(150);
  const puerta = await G(() => { const o = __game.objects().find(o => o.id === 'puerta_izq'); return [o.screenX, o.screenY]; });
  const t0 = Date.now();
  await click(page, G, puerta[0], puerta[1]); await wait(100); await click(page, G, puerta[0], puerta[1]);
  ok(await until(G, () => __game.state().room === 'pecera', null, 1500), `doble clic en la salida: sale ya (${Date.now() - t0} ms; andando eran ~2,6 s)`);
  await G(() => __game.waitIdle());
  await enter();
  // un PNJ que anda se queda quieto mientras se le apunta (verbo elegido)
  const quieto = await G(async () => {
    const g = __game.game; const y = g.actors.yoli_tendencias; y.x = 240; y.y = 126; y.room = 'demo_fase0';
    g.runScript(a => a.walkActor('yoli_tendencias', 520, 126), { blocking: false });
    await new Promise(r => setTimeout(r, 200)); g.ui.verb = 'hablar'; const x0 = y.x;
    await new Promise(r => setTimeout(r, 500)); const x1 = y.x; g.ui.verb = null;
    await new Promise(r => setTimeout(r, 400)); return { x0, x1, x2: y.x };
  });
  ok(quieto.x0 === quieto.x1 && quieto.x2 > quieto.x1, `PNJ andando: se para con un verbo elegido y sigue después (${JSON.stringify(quieto)})`);

  // ================================================================ efectos de situación
  console.log('\nEfectos de situación (plan §4, §9)');
  await G(() => { __game.skipText(false); __game.clearLog(); });
  G(() => __game.scene('demo_apagon'));
  await until(G, () => !!__game.game.apagon); await wait(500);
  ok(await G(() => !!__game.game.apagon), 'apagón: la sala a oscuras');
  await shot(page, 'apagon');
  ok(await until(G, () => !__game.game.apagon, null, 4000), 'apagón: vuelve la luz sola (ms)');
  G(() => __game.scene('demo_estampida'));
  ok(await until(G, () => __game.log.some(l => l.text === '¡Usted primero!'), null, 10000), 'estampida: atasco en la puerta con su línea');
  await shot(page, 'estampida-atasco');
  await G(() => __game.waitIdle());
  ok(await G(() => ['gervasio_acta', 'yoli_tendencias', 'anselmo_monolito'].every(id => __game.game.actors[id].room === null)), 'estampida: salen los tres (de uno en uno)');
  await G(() => __game.scene('demo_megafonia'));
  ok(await G(() => __game.log.some(l => l.who === 'celestino' && l.tag === 'MEGAFONÍA')), 'megafonía: la voz de Celestino sin Celestino en pantalla');
  G(() => __game.scene('demo_viral'));
  await until(G, () => !!__game.game.burst); await wait(1300);
  await shot(page, 'viral');
  await G(() => __game.waitIdle());
  G(() => __game.scene('demo_titular'));
  await until(G, () => __game.game.speeches.some(s => s.style === 'titular')); await wait(200);
  await shot(page, 'titular');
  await G(() => __game.skipSpeech()); await G(() => __game.waitIdle());
  // Bruno con la chaqueta de Ramírez
  await G(() => { __game.giveItem('chaqueta_ramirez'); });
  await G(() => __game.doVerb('usar', 'chaqueta_ramirez'));
  await G(() => __game.skipSpeech()); await G(() => __game.skipText(true)); await G(() => __game.waitIdle()); await G(() => __game.skipText(false));
  ok(await G(() => __game.state().flags.bruno_con_chaqueta === true && __game.game.spriteOf(__game.game.player) === __game.game.player.variants.con_chaqueta), 'Usar la chaqueta: bruno_con_chaqueta y el sprite cambia');
  await G(() => { const p = __game.game.player; p.x = 330; p.y = 128; p.dir = 'down'; __game.game.snapCamera(); });
  await wait(300); await shot(page, 'bruno-chaqueta');
  await G(() => { __game.takeItem('chaqueta_ramirez'); });
  ok(await G(() => __game.game.spriteOf(__game.game.player) === __game.game.player.sprite), 'sin la chaqueta en el inventario, Bruno vuelve a su ropa');
  await G(() => __game.game.condApi().vestir('bruno', 'con_chaqueta'));
  ok(await G(() => __game.game.spriteOf(__game.game.player) === __game.game.player.variants.con_chaqueta && __game.state().actors.bruno.variante === 'con_chaqueta'), 'api.vestir: variante por guion (se guarda)');
  await G(() => __game.game.condApi().vestir('bruno', null));
  // la tarjeta final: fija al menos 6 s
  G(() => __game.scene('demo_tarjeta'));
  await until(G, () => !!__game.game.card); await wait(800);
  await shot(page, 'tarjeta-fe-de-erratas');
  await click(page, G, 160, 100);
  ok(await G(() => !!__game.game.card), 'la tarjeta no se cierra con un clic antes de 6 s');
  await wait(5600); await click(page, G, 160, 100);
  ok(await until(G, () => !__game.game.card, null, 2000), 'tras 6 s, un clic la cierra');
  // Celestino por la megafonía del ascensor
  await G(() => __game.newGame()); await G(() => __game.waitIdle());
  await G(() => { __game.setFlag('torno_abierto', true); __game.setFlag('cms_vivo', true); __game.clearLog(); });
  await G(() => __game.gotoRoom('pecera'));
  G(() => __game.doVerb('usar', 'ascensor_pecera'));
  await until(G, () => __game.state().dialog);
  await G(() => __game.chooseText('-1'));
  await G(() => __game.waitIdle());
  // E2 §7.4: el hito del apagón (cms_vivo) ya no se narra; narra el más reciente que queda (el torno)
  ok(await G(() => __game.log.some(l => l.who === 'celestino' && l.tag === 'MEGAFONÍA' && l.text === '¡Vacante supera al torno! ¡Por la banda! ¡Con chicle! ¡Qué técnica!')
    && !__game.log.some(l => /Apagón desde el banquillo/.test(l.text))), 'ascensor: Celestino narra la última hazaña por la megafonía (§4.7; E2: sin el apagón)');
  // sin selector de dificultad
  await G(() => __game.game.toggleMenu()); await wait(150);
  ok(await G(() => !(__game.game.menu.layout || []).some(it => /Dificultad/.test(it.label))), 'el menú de pausa ya no tiene el selector de dificultad (crítica §6.7)');
  await G(() => __game.game.toggleMenu());

  // ================================================================ ENMIENDA E2 (paquete común)
  console.log('\nENMIENDA E2: despedidas, anuncios, pantalla con prefijo, adhesivo de Bruno, pistas, migración');
  await G(() => __game.newGame()); await G(() => { __game.skipText(true); return __game.waitIdle(); });
  await page.evaluate(async (base) => {          // la demo otra vez (newGame recoloca a los actores)
    const g = __game.game, R = window.__demo;
    for (const p of R.actors) { const a = g.actors[p.id]; const L = R.layout[p.id]; a.room = R.id; a.x = L.at[0]; a.y = L.at[1]; a.dir = L.at[2]; a.visible = true; a.path = []; }
  }, base);
  await enter();
  // §7.2 despedidas una sola vez (el `do` corre igual)
  const despedida = async (pre) => {
    await G(() => { __game.clearLog(); });
    G(() => __game.doVerb('hablar', 'celestino'));
    await until(G, () => __game.state().dialog);
    if (pre) { await G(t => __game.chooseText(t), pre); await until(G, () => __game.state().dialog); }
    await G(() => __game.chooseText('Me voy.')); await G(() => __game.waitIdle());
    return G(() => __game.log.map(l => l.text));
  };
  let Ld = await despedida();
  ok(Ld.includes('Me voy.') && Ld.includes('Abrígate, que refresca.') && Ld.includes('¡Y cierra al salir!') && (await G(() => __game.state().flags.demo_fase0_despedidas)) === 1,
    'despedida, 1.ª vez: se oye entera (Bruno, la respuesta y lo que dice su `do`)');
  Ld = await despedida('¿Qué tal el Ibex?');
  ok(Ld.includes('Plano, chaval.') && !Ld.includes('Me voy.') && !Ld.includes('Abrígate, que refresca.') && !Ld.includes('¡Y cierra al salir!')
    && (await G(() => __game.state().flags.demo_fase0_despedidas)) === 2, 'despedida, 2.ª vez: cierra en silencio y su `do` se ejecuta igual (contador 2)');
  ok(await G(() => __game.game.state.dialogs['despedida_oida:demo_desp.Me voy.'] === true && !Object.keys(__game.state().flags).some(k => k.startsWith('despedida_oida'))), 'la marca es interna (state.dialogs), no un flag');
  // §4.2.1 el pop-up de la X menguante
  await G(() => __game.skipText(false));
  G(() => __game.scene('demo_popup'));
  ok(await until(G, () => __game.state().detalle && __game.state().detalle.cerrarX === 3), 'pop-up 1.ª vez: la X mide 3 px');
  await wait(700); await page.screenshot({ path: path.join(shots, 'e2-fase0-popup-x3.png') });
  await G(() => { __game.skipText(true); return __game.waitIdle(); }); await G(() => __game.skipText(false));
  G(() => __game.scene('demo_popup'));
  ok(await until(G, () => __game.state().detalle && __game.state().detalle.cerrarX === 1), 'pop-up 2.ª vez: la X es un punto (1 px)');
  await wait(700); await page.screenshot({ path: path.join(shots, 'e2-fase0-popup-x1.png') });
  await G(() => { __game.skipText(true); return __game.waitIdle(); }); await G(() => __game.skipText(false));
  G(() => __game.scene('demo_popup'));
  ok(await until(G, () => __game.state().detalle && __game.state().detalle.cerrarX === 0 && __game.state().detalle.cuenta === 3000), 'pop-up 3.ª vez: sin X y con cuenta atrás de 3 s');
  await wait(900);
  ok(await G(() => __game.state().detalle.bloqueado), 'durante la cuenta atrás el plano está bloqueado');
  await click(page, G, 160, 100); await wait(200);
  ok(await G(() => !!__game.state().detalle), 'un clic durante la cuenta atrás no lo cierra');
  await page.screenshot({ path: path.join(shots, 'e2-fase0-popup-cuenta.png') });
  await until(G, () => !__game.state().detalle.bloqueado, null, 4000);
  await click(page, G, 160, 100);
  ok(await until(G, () => !__game.state().detalle, null, 1500), 'acabada la cuenta atrás, un clic lo cierra');
  await G(() => __game.waitIdle());
  // §4.2.4 el anuncio antes de entrar
  G(() => __game.scene('demo_anuncio'));
  await until(G, () => !!__game.state().detalle); await wait(1500);
  await click(page, G, 160, 100); await wait(200);
  ok(await G(() => !!__game.state().detalle && __game.state().detalle.titulo === 'ANUNCIO'), 'anuncio antes de entrar: el clic no lo cierra antes de los 5 s');
  await page.screenshot({ path: path.join(shots, 'e2-fase0-anuncio-cuenta.png') });
  await until(G, () => !__game.state().detalle || !__game.state().detalle.bloqueado, null, 5000); await wait(300);
  await page.screenshot({ path: path.join(shots, 'e2-fase0-anuncio-saltar.png') });
  await click(page, G, 160, 100);
  ok(await until(G, () => !__game.state().detalle, null, 1500), 'tras la cuenta atrás («Saltar anuncio ›»), un clic lo cierra');
  await G(() => __game.waitIdle());
  // §2.2 la pantalla de Herminia con su prefijo
  await G(() => __game.clearLog());
  G(() => __game.scene('demo_herminia'));
  ok(await until(G, () => __game.game.speeches.some(s => s.text === 'HERMINIA (IA) › saludo recibido · hola: 100 %' && s.color === '#FF8C3C')), 'api.pantalla: «HERMINIA (IA) › …» en su color (#FF8C3C)');
  await wait(400); await page.screenshot({ path: path.join(shots, 'e2-fase0-herminia.png') });
  await G(() => { __game.skipText(true); return __game.waitIdle(); }); await G(() => __game.skipText(false));
  ok(await G(() => __game.log.some(l => l.who === 'herminia_portatil' && l.text === 'HERMINIA (IA) › quesito de Desarrollo · suma: 130 %')), 'api.pantalla: un texto que ya empieza por «›» no duplica el signo');
  // §4.2.3 el adhesivo en la espalda de Bruno (variante por flag, combinable con la chaqueta)
  const spr = () => G(() => { const g = __game.game, p = g.player; return Object.entries(p.variants).find(([, v]) => v === g.spriteOf(p))?.[0] || null; });
  await page.mouse.move(2, 2);                    // que el cursor no tape a Bruno en las capturas
  await G(() => { __game.setFlag('bruno_con_banner', true); const p = __game.game.player; p.x = 330; p.y = 128; p.dir = 'up'; __game.game.snapCamera(); });
  const brunoClip = async (name) => {               // recorte ampliado (la ventana va a 3×) alrededor de Bruno
    const c = await G(() => { const p = __game.game.player; return __game.virtualToClient(p.x - __game.game.camX, p.y); });
    await page.screenshot({ path: path.join(shots, `e2-fase0-${name}-zoom.png`), clip: { x: Math.max(0, c.x - 60), y: Math.max(0, c.y - 200), width: 120, height: 210 } });
  };
  ok(await spr() === 'con_banner', 'bruno_con_banner: Bruno sale con el adhesivo (variante con_banner)');
  await wait(300); await page.screenshot({ path: path.join(shots, 'e2-fase0-bruno-banner-espalda.png') }); await brunoClip('bruno-banner-espalda');
  await G(() => { __game.game.player.dir = 'left'; }); await wait(300); await page.screenshot({ path: path.join(shots, 'e2-fase0-bruno-banner-perfil.png') }); await brunoClip('bruno-banner-perfil');
  await G(() => { __game.giveItem('chaqueta_ramirez'); __game.setFlag('bruno_con_chaqueta', true); __game.game.player.dir = 'up'; });
  ok(await spr() === 'con_chaqueta_banner', 'con la chaqueta de Ramírez: chaqueta y adhesivo a la vez (con_chaqueta_banner)');
  await wait(300); await page.screenshot({ path: path.join(shots, 'e2-fase0-bruno-banner-chaqueta.png') }); await brunoClip('bruno-banner-chaqueta');
  await G(() => __game.setFlag('bruno_con_banner', false));
  ok(await spr() === 'con_chaqueta', 'Aurora lo despega (bruno_con_banner = false): solo la chaqueta');
  await G(() => { __game.setFlag('bruno_con_chaqueta', false); __game.takeItem('chaqueta_ramirez'); __game.game.player.dir = 'down'; });
  // §10.3-10.4 pistas y ficha de la coma
  await G(() => { __game.skipText(true); for (const f of ['torno_abierto', 'inigo_presentado', 'silla_libre', 'rep_11', 'gertrudis_saludada', 'acto_2_iniciado', 'cms_vivo', 'reunion_terminada', 'casilla_hueco', 'nota_gasto_presentada']) __game.setFlag(f, true); __game.giveItem('ficha_pagina_7'); });
  ok(await G(() => __game.game.condApi().objetivo.actual('administracion') === 'coma' && __game.game.condApi().objetivo.meta('administracion') === 'Don Evaristo me ha llamado tres veces. Algo le quita el sueño.'), 'objetivo nuevo «coma» (paso 28) en Administración, con su meta');
  F = await ficha();
  ok(F.includes('Al margen, a lápiz: «Evaristo me ha llamado. Planta 2. Escucharle entero».'), 'ficha: nota a lápiz de Evaristo (sin escuchar)');
  await G(() => { __game.setFlag('evaristo_escuchado', true); __game.setFlag('fax_con_papel', true); __game.setFlag('casilla_fuente', true); });   // (va tras «fuente» en la lista)
  ok(await G(() => __game.game.condApi().objetivo.actual('catacumba') === 'bendicion'), 'objetivo nuevo «bendicion» (paso 32) en la Redacción de papel');
  F = await ficha();
  ok(F.includes('Al margen, a lápiz: «La coma de Evaristo, a Aurora».'), 'ficha: «La coma de Evaristo, a Aurora»');
  await G(() => { __game.setFlag('coma_bendecida', true); __game.setFlag('correo_evaristo_listo', true); __game.giveItem('correo_evaristo'); });
  F = await ficha();
  ok(F.includes('Al margen, a lápiz: «El correo, en el momento oportuno».'), 'ficha: «El correo, en el momento oportuno» (con el correo en el inventario)');
  await G(async () => { __game.clearLog(); await __game.doVerb('mirar', 'correo_evaristo'); });
  ok(await G(() => __game.log.some(l => l.text === 'Asunto: «Una coma». Todos en copia. Envío: «en el momento oportuno».')), 'objeto nuevo correo_evaristo: Mirar');
  // §10.2 migración de partidas guardadas (llamadas antiguas y la LC)
  const mig = await G(() => __game.game.G.migrarPartida({ flags: { evaristo_llamadas: 3, evaristo_lc: true, correo_evaristo_listo: true }, inventory: [], once: {} }));
  ok(mig.once['once:evaristo_L1'] && !mig.once['once:evaristo_L3'] && mig.inventory.includes('correo_evaristo') && !('evaristo_lc' in mig.flags) && mig.flags.coma_bendecida,
    `migración: L1 oída, L3 pendiente, el correo pasa a objeto y fuera evaristo_lc (${JSON.stringify(mig.once)})`);
  await G(() => { __game.skipText(false); });

  // ================================================================ iPhone horizontal: el duelo cabe
  console.log('\nTáctil (iPhone horizontal): el duelo cabe');
  const T = await open({ viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true, deviceScaleFactor: 3 });
  await T.G(() => { for (const f of ['rep_05', 'rep_03', 'rep_13', 'rep_01', 'rep_07', 'rep_08', 'rep_09', 'rep_06']) __game.setFlag(f, true); });
  await T.G(() => { __game.game.mouse.touch = true; });
  T.G(() => __game.doVerb('hablar', 'paco_ticket'));
  await until(T.G, () => __game.state().duel && __game.state().dialog);
  await wait(400);
  const geo = await T.G(() => { const g = __game.game; const lines = g.choice.layout || []; return { lines: lines.length, scroll: g.choice.maxScroll, hudTop: g.hudTop, n: g.choice.options.length }; });
  ok(geo.lines <= 5 && geo.scroll === 0, `iPhone: el menú del duelo cabe sin scroll (${geo.lines} líneas, scroll ${geo.scroll})`);
  ok(geo.hudTop <= 70, `iPhone: la ventana de correo ocupa la franja de arriba (${geo.hudTop} px de 144)`);
  await shot(T.page, 'iphone-duelo');
  await T.ctx.close();

  ok(!consoleErrors.length, `sin errores de consola${consoleErrors.length ? ': ' + consoleErrors.slice(0, 5).join(' | ') : ''}`);
} catch (e) {
  failures++; console.log('  ✗ EXCEPCIÓN: ' + (e && e.stack || e));
} finally {
  await browser.close(); server.close();
}
console.log(`\n${failures ? `✗ FALLAN ${failures} de ${checks}` : `TODO OK (${checks} comprobaciones)`}`);
process.exit(failures ? 1 : 0);
