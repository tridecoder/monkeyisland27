#!/usr/bin/env node
// PRUEBA DE BLOQUEOS («puertas ocultas»): lo que un jugador que va a su aire se encuentra cuando le falta algo.
// Sale con 1 si algo falla. Capturas en tools/shots/bloqueos-*.png. Cuatro partes:
//   1. requisitos  Para cada paso del recorrido (walk-data.mjs, 45 pasos), el estado justo antes del paso; se quita UNO
//                  a uno cada requisito (cada flag que pusieron los pasos anteriores y cada objeto ganado) y se repite la
//                  acción. Si el paso deja de salir, el juego tiene que haber contestado algo: ni silencio, ni la respuesta
//                  genérica (content/game.js `DEFAULTS`), ni una opción de diálogo que no está sin que nada lo diga. Las
//                  excepciones van en EXCEPCIONES, con el motivo (lista corta: estados imposibles y preguntas que no se
//                  pueden hacer sin saber algo que el juego enseña en otro sitio, con la respuesta que orienta).
//   2. pistas      Datos: cada objetivo de content/pistas.js y cada sub-estado (`sub`) con tres niveles, ≤ 80 caracteres,
//                  el 3 con [abuela, Bruno] y la línea de Bruno con un sitio y un objeto o persona reales. Recorrido: el
//                  objetivo que elige el motor en la sala de cada paso es el que bloquea (ESPERADO), la abuela habla de
//                  ese y «Mirar a Bruno» dice su meta. Sub-estados construidos a mano (falta X pero ya tiene Y).
//   3. dueño       Los tres casos del dueño, con ratón: la reunión (la pregunta siempre está; cada eslabón responde), la
//                  frase de Anselmo (en su árbol; en la escena, el eco) y el boli muerto (cada «no» dice qué falta;
//                  pistas del opcional).
//   4. antiguas    Partidas guardadas de antes de E5-E7 y del guion anterior a [P11] (`migrarPartida`): cargan y siguen.
//   node tools/test-bloqueos.mjs [--solo=requisitos,pistas,duenio,antiguas] [--paso=27,28]
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from './serve.mjs';
import { STEPS } from './walk-data.mjs';
import { createRunner, FAREWELLS, StepFail } from './walk-lib.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const shots = path.join(here, 'shots'); fs.mkdirSync(shots, { recursive: true });
const args = Object.fromEntries(process.argv.slice(2).filter(a => a.startsWith('--')).map(a => { const [k, v] = a.slice(2).split('='); return [k, v ?? true]; }));
const solo = args.solo ? String(args.solo).split(',') : null;
const toca = (k) => !solo || solo.includes(k);
const soloPasos = args.paso ? String(args.paso).split(',').map(Number) : null;
const { DEFAULTS, COMBO_GAG } = await import('../content/game.js');
const GENERICAS = new Set([...Object.values(DEFAULTS).flat(), COMBO_GAG]);
const { OBJETIVOS } = await import('../content/pistas.js');

const server = createServer(root);
await new Promise(r => server.listen(0, r));
const base = `http://localhost:${server.address().port}/`;
const browser = await chromium.launch();
let failures = 0, checks = 0;
const ok = (c, m) => { checks++; if (c) console.log('  ✓ ' + m); else { failures++; console.log('  ✗ ' + m); } };
const errs = [];
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const norm = s => String(s).toLowerCase().replace(/[«»"“”'’]/g, '').replace(/\s+/g, ' ').trim();

// ---------------------------------------------------------------- 1. excepciones justificadas (paso:requisito → motivo)
const EXCEPCIONES = {
  '17:acto_2_iniciado': 'estado imposible (el paso 17 va tras el café); antes del café el árbol es A_SIN_CAFE y cada opción contesta con el golpecito',
  // ([P11] fuera 22: «Ticket 0.441» ya no es un paso; y 23 ya no pide el CMS: Eutimio atiende siempre)
  '30:has:sobre_azucar': 'sin justificante, Begoña lo pide («¿Y el justificante?») y está «Lo busco y vuelvo.»; pista `nota` (el azúcar)',
  '31:acto_2_iniciado': 'estado imposible (Evaristo, en el Acto II)',
  '43:ruben_encontrado': 'Eventos no se toca: antes de encontrar a Brais el álbum no tiene motivo y Pilar lo dice al cogerlo («Pídemelo con un motivo»)',
  '45:rep_13': 'la columna se escribe con una frase oída (Brais o Eventos): sin ella, al primer borrón Anselmo dice «Tráeme algo que no sea ni hecho ni muerto…» y la pista `columna` manda a Brais',
  '46:acto_3_iniciado': 'estado imposible (Gervasio en la puerta, Acto III)',
};
// pasos que esperan una opción de diálogo de un árbol que solo existe con el requisito: se miran como «opción ausente»
// salvo que estén en EXCEPCIONES

// ---------------------------------------------------------------- 2. pistas: lo esperado en la sala de cada paso
const ESPERADO = {};
const pon = (o, ...ns) => ns.forEach(n => { ESPERADO[n] = o; });
pon('torno', 2, 3, 4, 5, 6, 7); pon('silla', 8, 9, 10); pon('correo', 11, 12, 13); pon('cafe', 14); pon('aurora', 15, 16);
// [P11] el CMS es la condición del HUECO: su objetivo cuenta desde que Maripaz lo dice (en el recorrido canónico, la
// R-3 va antes que la Sala: Maripaz no llega a decirlo y la abuela manda a la reunión). Fuera los pasos 19, 22, 35 y 42.
pon('nota', 17, 18); pon('reunion', 20, 21, 23, 24, 25, 26, 27); pon('turno', 28); pon('hueco', 29);
pon('nota', 30); pon('coma', 31); pon('papel_fax', 32); pon('fuente', 33, 34); pon('firma', 36);
pon('pieza', 37); pon('recorte', 38); pon('cierre', 39); pon('armario', 40); pon('album', 41, 43); pon('baja', 44);
pon('columna', 45); pon('acta', 46); pon('inigo', 47, 48);

// ---------------------------------------------------------------- utilidades de página
async function nuevaPagina() {
  const ctx = await browser.newContext({ viewport: { width: 960, height: 600 } });
  const page = await ctx.newPage();
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', e => errs.push('pageerror: ' + e.message));
  await page.goto(base);
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) { /* */ } });
  await page.reload();
  await page.waitForFunction(() => !!window.__game);
  const G = (fn, a) => page.evaluate(fn, a);
  return { ctx, page, G };
}
async function escape(R) {
  for (let k = 0; k < 30; k++) {
    await R.G(() => __game.waitIdle());
    const st = await R.state();
    if (st.pickItem) { await R.G(() => __game.chooseItem(null)); continue; }
    if (st.duel && st.dialog) {
      const i = st.duel.phase === 'reply' ? st.duel.weakIndex : st.dialog.findIndex(o => o === '[Retirarse del hilo]');
      await R.G(i => __game.chooseDialog(i), i < 0 ? st.dialog.length - 1 : i); continue;
    }
    if (st.dialog) {
      let i = FAREWELLS.map(f => st.dialog.findIndex(o => norm(o).startsWith(f))).find(x => x >= 0);
      if (i == null || i < 0) i = st.dialog.length - 1;
      await R.G(i => __game.chooseDialog(i), i); continue;
    }
    return true;
  }
  return false;
}
/** El recorrido en modo rápido, guardando el estado JUSTO ANTES de cada paso (texto de la ranura de guardado). */
async function instantaneas(R) {
  const snaps = {};
  await R.G(() => __game.skipText(true));
  await R.startDismisser();
  await R.G(() => __game.newGame());
  for (const s of STEPS) {
    snaps[s.n] = await R.G(() => { __game.save(9); return localStorage.getItem(__game.game.slotKey(9)); });
    if (s.n === STEPS[STEPS.length - 1].n) break;          // el último acaba la partida (créditos): basta con el estado de antes
    for (const a of s.acc) await R.run(a);
    await R.G(() => __game.waitIdle());
    await R.check(s.esp);
  }
  return snaps;
}
async function restaurar(R, txt) {
  await escape(R);
  // sin esperar a la carga entera: al cargar en el clímax (pasos 48-49) la entrada abre el duelo D4 y espera al jugador
  await R.G((d) => { localStorage.setItem(__game.game.slotKey(9), d); window.__cargado = false; __game.load(9).then(() => { window.__cargado = true; }); }, txt);
  for (let k = 0; k < 400; k++) {
    if (await R.G(() => window.__cargado || (!!__game.game.choice && __game.game.mode === 'play'))) break;
    await R.G(() => __game.skipSpeech()); await sleep(30);
  }
}

let snaps = null, P0 = null, R0 = null;
async function base0() {
  if (snaps) return;
  P0 = await nuevaPagina();
  R0 = createRunner(P0.page);
  snaps = await instantaneas(R0);
}

try {
  // ====================================================================== 1. requisitos quitados uno a uno
  if (toca('requisitos')) {
    console.log('1 · cada paso del recorrido, con cada requisito quitado: el juego contesta y orienta');
    await base0();
    const R = R0;
    const init = await R.G(() => JSON.parse(JSON.stringify(__game.game.G.startFlags || {})));
    const malos = [], vistos = new Set();
    let pruebas = 0, requisitos = 0;
    for (const s of STEPS) {
      if (s.n < 2 || (soloPasos && !soloPasos.includes(s.n))) continue;
      const st0 = JSON.parse(snaps[s.n]).state;
      const prev = STEPS.filter(p => p.n < s.n);
      const fl = new Set();
      for (const p of prev) { const f = p.esp.flags; for (const k of Array.isArray(f) ? f : Object.keys(f || {})) if (st0.flags[k]) fl.add(k); }
      const usados = s.acc.flatMap(a => a[0] === 'usar' || a[0] === 'dar' ? [a[1]] : a[0] === 'verbo' ? [a[2]] : []);   // (el objeto que se usa o se mira)
      const items = new Set();
      for (const p of prev) for (const i of p.esp.tiene || []) if (st0.inventory.includes(i) && !usados.includes(i)) items.add(i);
      for (const q of [...[...fl].map(f => ({ f })), ...[...items].map(i => ({ i }))]) {
        pruebas++;
        const req = q.f || ('has:' + q.i), clave = `${s.n}:${req}`;
        await restaurar(R, snaps[s.n]);
        await R.G(([q, init]) => { if (q.f) __game.setFlag(q.f, init[q.f] === undefined ? false : init[q.f]); else __game.takeItem(q.i); __game.clearLog(); }, [q, init]);
        let fallo = null;
        try { for (const a of s.acc) await R.run(a); await R.G(() => __game.waitIdle()); await R.check(s.esp); } catch (e) { fallo = e instanceof StepFail ? e.message : 'EXCEPCIÓN ' + e.message; }
        if (!fallo) continue;                                   // no era requisito de este paso
        requisitos++;
        const hab = (await R.G(() => __game.log.map(l => ({ who: l.who, text: String(l.text) })))).filter(l => l.who && !['aviso', 'tarjeta'].includes(l.who));
        const tipo = /^EXCEPCIÓN/.test(fallo) ? 'excepción del script' : !hab.length ? 'silencio' : hab.every(l => GENERICAS.has(l.text)) ? 'respuesta genérica'
          : /no existe la opción/.test(fallo) ? 'opción ausente' : null;
        if (!tipo) continue;
        if (EXCEPCIONES[clave]) { vistos.add(clave); continue; }
        malos.push(`${clave} (${tipo}): ${fallo.slice(0, 120)}${hab.length ? ' · «' + hab.slice(-2).map(l => l.text).join(' | ') + '»' : ''}`);
      }
    }
    console.log(`  (${pruebas} pruebas; ${requisitos} requisitos de verdad)`);
    ok(!malos.length, `ningún requisito quitado deja silencio, la genérica o una opción que no está sin aviso${malos.length ? ':\n      ' + malos.join('\n      ') : ''}`);
    if (!soloPasos) {
      const sobran = Object.keys(EXCEPCIONES).filter(k => !vistos.has(k));
      ok(!sobran.length, `la lista blanca no tiene entradas que ya no hacen falta${sobran.length ? ': ' + sobran.join(', ') : ''}`);
    }
  }

  // ====================================================================== 2. pistas
  if (toca('pistas')) {
    console.log('\n2 · pistas de la abuela y «Mirar a Bruno»');
    // datos
    const T0 = await nuevaPagina();
    await T0.G(() => __game.newGame());
    const nombres = await T0.G(() => {
      const c = __game.game.content;
      const salas = Object.values(c.rooms).map(r => r.name).filter(Boolean);
      const cosas = [...Object.values(c.actors || {}).map(a => a.name), ...Object.values(c.items).map(i => i.name),
        ...Object.values(c.rooms).flatMap(r => (r.objects || []).map(o => o.name))].filter(Boolean);
      return { salas, cosas };
    });
    await T0.ctx.close();
    const cosas = [...new Set(nombres.cosas.flatMap(n => [n, ...String(n).split(/[\s,]+/).filter(w => w.length >= 5)]))];
    const malos = [];
    const revisa = (id, etiqueta, N) => {
      if (!Array.isArray(N) || N.length !== 3) { malos.push(`${etiqueta}: no tiene tres niveles`); return; }
      const [n1, n2, n3] = N;
      if (typeof n1 !== 'string' || typeof n2 !== 'string' || !Array.isArray(n3) || n3.length !== 2) { malos.push(`${etiqueta}: forma de los niveles`); return; }
      for (const t of [n1, n2, ...n3]) if (t.length > 80) malos.push(`${etiqueta}: > 80 «${t}»`);
      if (new Set([n1, n2, n3[0]]).size < 3) malos.push(`${etiqueta}: dos niveles iguales`);
      const b = n3[1];
      if (!nombres.salas.some(s => b.includes(s))) malos.push(`${etiqueta}: el nivel 3 de Bruno no dice el sitio («${b}»)`);
      if (!cosas.some(c => b.toLowerCase().includes(String(c).toLowerCase()))) malos.push(`${etiqueta}: el nivel 3 de Bruno no nombra un objeto o persona («${b}»)`);
    };
    let n = 0;
    for (const o of OBJETIVOS) {
      revisa(o.id, o.id, o.niveles); n++;
      if (typeof o.meta === 'string' && o.meta.length > 80) malos.push(`${o.id}: meta > 80`);
      for (const s of o.sub || []) {
        if (s.niveles) { revisa(o.id, `${o.id} [${[].concat(s.si).join(' ')}]`, s.niveles); n++; }
        if (s.meta && s.meta.length > 80) malos.push(`${o.id}: meta del sub-estado > 80`);
      }
    }
    ok(!malos.length, `${OBJETIVOS.length} objetivos, ${n} juegos de niveles: tres niveles, ≤ 80, el 3 con sitio y objeto o persona${malos.length ? ':\n      ' + malos.join('\n      ') : ''}`);
    ok(OBJETIVOS.some(o => o.id === 'boli' && o.opcional), 'el boli muerto tiene su objetivo, marcado opcional');

    // recorrido: el objetivo de la sala, la abuela y «Mirar a Bruno»
    await base0();
    const R = R0, G = R.G;
    const mal2 = [];
    for (const s of STEPS) {
      if (!ESPERADO[s.n] || (soloPasos && !soloPasos.includes(s.n))) continue;
      const ir = s.acc.find(a => a[0] === 'ir');
      const sala = ir ? ir[1] : s.sala;
      await restaurar(R, snaps[s.n]);
      const r = await G(async (sala) => {
        const m = await import('./engine/objetivos.js');
        const g = __game.game;
        const actual = m.actual(g, sala), meta = m.meta(g, sala);
        const real = g.state.room;
        g.state.room = sala;
        const P = m.siguientePista(g);
        g.state.room = real;
        return { actual, meta, abuela: P.obj, n1: P.def && (Array.isArray(P.def.niveles) ? P.def.niveles[0] : null) };
      }, sala);
      if (r.actual !== ESPERADO[s.n]) mal2.push(`paso ${s.n} [${sala}]: elige «${r.actual}», bloquea «${ESPERADO[s.n]}»`);
      if (r.abuela !== r.actual) mal2.push(`paso ${s.n} [${sala}]: la abuela habla de «${r.abuela}» y Bruno de «${r.actual}»`);
      if (!r.meta || r.meta === 'Hueco, fuente y firma. Lo pone la ficha.') mal2.push(`paso ${s.n}: la meta no dice qué toca («${r.meta}»)`);
    }
    ok(!mal2.length, `en la sala de cada paso, el objetivo que bloquea; la abuela y «Mirar a Bruno», del mismo; ninguna meta vaga${mal2.length ? ':\n      ' + mal2.join('\n      ') : ''}`);

    // sub-estados construidos a mano: [descripción, flags, inventario (+), inventario (−), sala, objetivo, sub esperado (si) o null]
    const A2 = { intro_vista: true, torno_abierto: true, inigo_presentado: true, silla_libre: true, gertrudis_saludada: true, acto_2_iniciado: true, aurora_conto_pasos: true, rep_11: true, cms_vivo: true };
    const A3 = { ...A2, nota_gasto_presentada: true, evaristo_escuchado: true, fax_con_papel: true, casilla_fuente: true, coma_bendecida: true, casilla_firma: true, casilla_hueco: true,
      reunion_terminada: true, sala_becario_sin_turno: true, pieza_escrita: true, pieza_recortada: true, pagina_cerrada: true, acto_3_iniciado: true, ruben_encontrado: true };
    const SUBS = [
      ['silla, sin la chaqueta', { intro_vista: true, torno_abierto: true, inigo_presentado: true }, [], ['chaqueta_ramirez'], 'pecera', 'silla', null],
      ['silla, con la chaqueta', { intro_vista: true, torno_abierto: true, inigo_presentado: true, chaqueta_cogida: true }, ['chaqueta_ramirez'], [], 'pajarera', 'silla', 'has:chaqueta_ramirez'],
      ['reunión, sin mirar el orden del día', A2, [], [], 'sala_amazonas', 'reunion', null],
      ['reunión, con el orden del día mirado', { ...A2, sala_amazonas_orden_visto: true }, [], [], 'sala_amazonas', 'reunion', 'sala_amazonas_orden_visto'],
      ['turno, sin turno', { ...A2, sala_becario_sin_turno: true }, [], [], 'sala_amazonas', 'turno', null],
      ['turno, en el Vending', { ...A2, sala_becario_sin_turno: true }, [], [], 'office', 'turno', null],
      ['turno, con la pregunta de Gertrudis', { ...A2, sala_becario_sin_turno: true, gertrudis_pregunta: true }, [], [], 'sala_amazonas', 'turno', 'gertrudis_pregunta'],
      // [P11] fuera «turno, con el atasco» (ya no es jugable) y «columna sin rotulador» (llega con el D1)
      // [P11] el CMS, condición del HUECO: antes de oír a Maripaz, la reunión; tras su negativa, el CMS (también en la Sala)
      ['CMS caído, sin haber oído a Maripaz', { ...A2, cms_vivo: false }, [], [], 'pecera', 'reunion', null],
      ['CMS caído, tras el aviso de Maripaz (Redacción)', { ...A2, cms_vivo: false, maripaz_pide_web: true }, [], [], 'pecera', 'cms', null],
      ['CMS caído, tras la negativa de Maripaz (Sala)', { ...A2, cms_vivo: false, maripaz_pide_web: true, sala_becario_sin_turno: true, reunion_terminada: true }, [], [], 'sala_amazonas', 'cms', null],
      ['CMS caído, en Sistemas', { ...A2, cms_vivo: false, maripaz_pide_web: true }, [], [], 'cpd', 'cms', null],
      ['hueco, con la web', { ...A2, sala_becario_sin_turno: true, reunion_terminada: true, maripaz_pide_web: true }, [], [], 'sala_amazonas', 'hueco', null],
      ['firma, sin el manual', { ...A2, nota_gasto_presentada: true, fax_con_papel: true, evaristo_escuchado: true, casilla_fuente: true }, [], ['manual_fax'], 'catacumba', 'firma', '!has:manual_fax'],
      ['firma, sin el manual y con el CMS caído', { ...A2, cms_vivo: false, nota_gasto_presentada: true, fax_con_papel: true, evaristo_escuchado: true, casilla_fuente: true }, [], ['manual_fax'], 'catacumba', 'firma', '!has:manual_fax'],
      ['firma, con el manual', { ...A2, nota_gasto_presentada: true, fax_con_papel: true, evaristo_escuchado: true, casilla_fuente: true }, ['manual_fax'], [], 'catacumba', 'firma', null],
      ['columna, sin la frase', { ...A3, album_validado: true }, [], ['rotulador_rojo'], 'pecera', 'columna', '!rep_13 !oyo_descopear'],
      ['columna, con «descopear» y rotulador', { ...A3, album_validado: true, oyo_descopear: true }, ['rotulador_rojo'], [], 'pecera', 'columna', '!rep_13'],
      ['columna, con todo', { ...A3, album_validado: true, rep_13: true }, ['rotulador_rojo'], [], 'pecera', 'columna', null],
      ['boli, sin la regla (en foco)', { ...A2, 'obj:foco': 'boli', 'obj:foco_n': 99 }, [], [], 'catacumba', 'boli', '!custodia_regla'],
      ['boli, con la regla', { ...A2, custodia_regla: true, 'obj:foco': 'boli', 'obj:foco_n': 99 }, [], [], 'pecera', 'boli', null],
      ['boli, con el boli muerto', { ...A2, custodia_regla: true, boli_muerto_cogido: true, 'obj:foco': 'boli', 'obj:foco_n': 99 }, ['boli_muerto'], [], 'pecera', 'boli', 'has:boli_muerto'],
    ];
    const T = await nuevaPagina();
    await T.G(() => __game.skipText(true));
    const mal3 = [];
    for (const [desc, F, mas, menos, sala, obj, si] of SUBS) {
      const r = await T.G(async ([F, mas, menos, sala]) => {
        await __game.newGame();
        for (const [k, v] of Object.entries(F)) __game.setFlag(k, v);
        for (const i of mas) __game.giveItem(i);
        for (const i of menos) __game.takeItem(i);
        const m = await import('./engine/objetivos.js');
        const g = __game.game;
        const real = g.state.room; g.state.room = sala;
        const actual = m.actual(g, sala), meta = m.meta(g, sala);
        const v = actual && m.variante(g, g.G.objetivos.find(o => o.id === actual));
        const P = m.siguientePista(g);
        g.state.room = real;
        return { actual, meta, n1: v && v.niveles[0], abuela: P.obj };
      }, [F, mas, menos, sala]);
      const o = OBJETIVOS.find(o => o.id === obj);
      const want = si == null ? o : (o.sub || []).find(s => [].concat(s.si).join(' ') === si);
      const n1 = want && (want.niveles || o.niveles)[0];
      const meta = (want && want.meta) || o.meta;
      if (r.actual !== obj) mal3.push(`${desc}: elige «${r.actual}» (esperado «${obj}»)`);
      else if (r.n1 !== n1) mal3.push(`${desc}: nivel 1 «${r.n1}» (esperado «${n1}»)`);
      else if (r.meta !== meta) mal3.push(`${desc}: meta «${r.meta}» (esperada «${meta}»)`);
      else if (r.abuela !== obj) mal3.push(`${desc}: la abuela habla de «${r.abuela}»`);
    }
    ok(!mal3.length, `${SUBS.length} sub-estados: el objetivo, su variante, la meta y la abuela${mal3.length ? ':\n      ' + mal3.join('\n      ') : ''}`);
    // el opcional no tapa lo principal: sin foco, el boli no sale; el foco caduca al avanzar
    const op = await T.G(async () => {
      await __game.newGame();
      const F = { intro_vista: true, torno_abierto: true, inigo_presentado: true, silla_libre: true, gertrudis_saludada: true, acto_2_iniciado: true, aurora_conto_pasos: true, rep_11: true, custodia_regla: true };
      for (const [k, v] of Object.entries(F)) __game.setFlag(k, v);
      const m = await import('./engine/objetivos.js');
      const g = __game.game;
      const sinFoco = m.actual(g, 'catacumba');
      m.apiFor(g).foco('boli');
      const conFoco = m.actual(g, 'catacumba');
      __game.setFlag('cms_vivo', true);                       // avanza en lo principal
      const caducado = m.actual(g, 'catacumba');
      return { sinFoco, conFoco, caducado };
    });
    ok(op.sinFoco !== 'boli' && op.conFoco === 'boli' && op.caducado !== 'boli', `el opcional solo en foco y hasta que se avanza en lo principal (${JSON.stringify(op)})`);
    // la abuela no dice «Me faltan réplicas» si las que sabe bastan para ganar (D3 y D4 tienen cartas de más)
    const rep = await T.G(async () => {
      await __game.newGame();
      const F = { intro_vista: true, torno_abierto: true, inigo_presentado: true, acto_2_iniciado: true, acto_3_iniciado: true, sala_abierta: true, ruben_libre: true,
        rep_10: true, rep_12: true, rep_13: true, rep_05: true, rep_16: true };
      for (const [k, v] of Object.entries(F)) __game.setFlag(k, v);
      __game.giveItem('ticket_n1'); __game.giveItem('acta_reunion'); __game.giveItem('correo_evaristo');
      __game.game.state.room = 'sala_amazonas';
      const L = [];
      for (let k = 0; k < 3; k++) { __game.clearLog(); await __game.scene('pistas'); L.push(...__game.log.map(l => l.text)); }
      return L;
    });
    ok(!rep.includes('Me faltan réplicas.'), 'D4 con las cinco réplicas que hacen falta (sin R01, R07, R15): la abuela no dice «Me faltan réplicas.»');
    await T.ctx.close();
  }

  // ====================================================================== 3. los tres casos del dueño, con ratón
  if (toca('duenio')) {
    console.log('\n3 · los tres casos del dueño (ratón real)');
    const ACTO1 = { intro_vista: true, torno_abierto: true, inigo_presentado: true, silla_libre: true, chaqueta_cogida: true, chaqueta_en_lector: true, ecosistema_interstitial: true };
    const ACTO2 = { ...ACTO1, gertrudis_saludada: true, cafetera_viral: true, cafetera_viral_vista: true, acto_2_iniciado: true, aurora_conto_pasos: true, aurora_hablo_fax: true,
      chisme_indice: 4, cafetera_en_directo: true, office_e53_visto: true, office_agotada: true, cms_vivo: true, rep_11: true };
    async function abrir(flags, room, entry, inv = []) {
      const T = await nuevaPagina();
      const { page, G } = T;
      await G(() => { __game.skipText(true); return __game.newGame(); });
      await G((F) => { for (const [k, v] of Object.entries(F)) __game.setFlag(k, v); }, flags);
      await G((inv) => { for (const i of inv) __game.giveItem(i); }, inv);
      await G(([r, e]) => __game.gotoRoom(r, e), [room, entry]);
      await G(() => { __game.skipSpeech(); return __game.waitIdle(); });
      await G(() => { __game.skipText(false); __game.skipSpeech(); __game.game.speeches.length = 0; __game.clearLog(); });
      const until = async (fn, arg, ms = 15000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await G(fn, arg)) return true; await sleep(50); } return false; };
      const verA = (id) => G((id) => {
        const g = __game.game, o = __game.objects().find(o => o.id === id) || (g.actors[id] && { x: g.actors[id].x - 10, w: 20 });
        if (!o) return; const cx = o.x + o.w / 2;
        g.camFollow = null; g.camTarget = null; g.camX = Math.max(0, Math.min(g.room.width - 320, Math.round(cx - 160)));
      }, id);
      const seguir = () => G(() => { __game.game.camFollow = __game.game.G.player; });
      // clic de verbo, (objeto) y destino; luego deja correr el texto (lo salta a clics, como un jugador con prisa)
      const raton = async (verbo, id, item) => {
        const v = await G(v => __game.verbPos(v), verbo); await page.mouse.click(v.x, v.y); await sleep(60);
        if (item) { const c = await G(i => __game.invPos(i), item); await page.mouse.click(c.x, c.y); await sleep(60); }
        await verA(id); await sleep(80);
        const c = await G(id => __game.screenPos(id), id); await page.mouse.click(c.x, c.y);
        await sleep(150);
      };
      const pasar = async (ms = 30000) => {       // clics en el texto hasta que haya menú o nada
        const t0 = Date.now();
        while (Date.now() - t0 < ms) {
          const st = await G(() => ({ choice: !!__game.game.choice, busy: __game.state().busy, sp: __game.game.speeches.some(s => s.blocking), cut: __game.game.cutscene > 0 }));
          if (st.choice) { await sleep(320); return 'menu'; }
          if (!st.busy && !st.sp && !st.cut) return 'libre';
          await G(() => __game.skipSpeech()); await sleep(90);
        }
        return 'tiempo';
      };
      const opciones = () => G(() => __game.currentDialogOptions() || []);
      const clicOpcion = async (txt) => {
        if (!(await until(() => !!__game.currentDialogOptions()))) return false;
        await sleep(320);
        const i = (await opciones()).findIndex(o => o.includes(txt));
        if (i < 0) return false;
        const p = await G(i => __game.optionPos(i), i); await page.mouse.click(p.x, p.y + 2); await sleep(150); return true;
      };
      const salir = async () => { for (let k = 0; k < 4 && (await opciones()).length; k++) { const o = await opciones(); const i = o.findIndex(x => /^(Me voy|Nada|Luego|Ya está)/.test(x)); await clicOpcion(o[i < 0 ? o.length - 1 : i]); await pasar(); } };
      const logHas = (t) => G(t => __game.log.some(l => String(l.text).includes(t)), t);
      const logCount = (t) => G(t => __game.log.filter(l => String(l.text) === t).length, t);
      const flag = (k) => G(k => __game.getFlag(k), k);
      const shot = (name) => page.screenshot({ path: path.join(shots, `bloqueos-${name}.png`) });
      return { ...T, until, raton, pasar, opciones, clicOpcion, salir, logHas, logCount, flag, shot, seguir };
    }

    // ---- 3a. la reunión
    console.log('  a) la reunión');
    {
      const T = await abrir(ACTO2, 'sala_amazonas', 'pajarera', ['ficha_pagina_7']);
      await T.raton('hablar', 'gervasio_acta'); await T.pasar();
      const o = await T.opciones();
      ok(o.some(x => x.includes('siguientes pasos')), `sin Mirar el orden del día, la pregunta está (${JSON.stringify(o)})`);
      await T.shot('reunion-pregunta');
      await T.clicOpcion('siguientes pasos'); await T.pasar();
      ok(await T.flag('sala_becario_sin_turno') && await T.logHas('Los becarios no tienen turno. Pregunta la mesa... y los conectados.'), '«Los becarios no tienen turno… y los conectados» (sala_becario_sin_turno)');
      await T.G(() => __game.clearLog());
      await T.raton('hablar', 'gervasio_acta'); await T.pasar();
      await T.clicOpcion('siguientes pasos'); await T.pasar();
      ok(await T.logHas('Las preguntas de los conectados entran por la pantalla, cuando hay señal.'), 'repetida: Gervasio señala la pantalla («…entran por la pantalla, cuando hay señal.»)');
      await T.G(() => __game.clearLog());
      await T.raton('hablar', 'mercados_2'); await T.pasar();
      ok(await T.logHas('Yo pregunto por la tele. Cuando hay señal.'), 'Rogelio (el conectado) señala la tele');
      await T.raton('mirar', 'tele_amazonas'); await T.pasar();
      ok(await T.logHas('wifi y rencor'), 'Mirar la tele: «wifi y rencor» (Gertrudis)');
      // la abuela y Mirar a Bruno, de lo mismo
      const meta = await T.G(async () => { __game.clearLog(); await __game.doVerb('mirar', 'bruno'); return __game.log.filter(l => l.who === 'bruno').map(l => l.text); });
      ok(meta.includes('En esa reunión solo pregunta quien sale en la tele. Yo no salgo en nada.'), `Mirar a Bruno: la meta del turno (${meta})`);
      await T.raton('hablar', 'tele_amazonas'); await T.pasar();
      ok((await T.opciones()).includes('Buenas noches, Gertrudis.'), 'Hablar con la tele: «Buenas noches, Gertrudis.»');
      await T.clicOpcion('Buenas noches, Gertrudis.'); await T.pasar();
      await T.clicOpcion('¿Y cuáles son los siguientes pasos?');
      ok(await T.until(() => __game.getFlag('sala_amazonas_atasco') === true || __game.getFlag('reunion_terminada') === true, null, 60000), 'la tele pregunta, estampida y atasco');
      await T.pasar(30000);
      await T.shot('reunion-atasco');
      if (await T.flag('sala_amazonas_atasco')) { await T.raton('empujar', 'mercados_2'); }
      ok(await T.until(() => __game.getFlag('reunion_terminada') === true, null, 60000), 'el atasco se resuelve: reunion_terminada');
      await T.ctx.close();
      // Acto I: la pregunta está y dice qué falta (una página)
      const T1 = await abrir(ACTO1, 'sala_amazonas', 'pajarera');
      await T1.raton('hablar', 'gervasio_acta'); await T1.pasar();
      await T1.clicOpcion('siguientes pasos'); await T1.pasar();
      ok(await T1.logHas('Los siguientes pasos los pide quien trae página. ¿Tú traes página?') && !(await T1.flag('sala_becario_sin_turno')), 'Acto I: «¿Tú traes página?» (sin turno no se pone)');
      await T1.ctx.close();
    }
    // ---- 3b. la frase de Anselmo
    console.log('  b) la frase de Anselmo');
    {
      const FRASE = 'El modelo es de fuera. El prompt es de dentro.';
      const T = await abrir(ACTO1, 'pecera', 'ascensor');
      await T.raton('hablar', 'anselmo_monolito'); await T.pasar();
      ok((await T.opciones()).includes('¿Y tú no usas IA?'), 'desde el Acto I, Anselmo ofrece «¿Y tú no usas IA?»');
      await T.clicOpcion('¿Y tú no usas IA?'); await T.pasar();
      ok(await T.logCount(FRASE) === 1 && await T.logCount('Eso lo hace nuestro.') === 1 && await T.flag('pecera_prompt_oido'), '«¿Y esa IA no es de fuera?» → la frase entera, en el árbol');
      await T.shot('anselmo-frase');
      await T.salir(); await T.seguir();
      // la escena del paso 37, después: el eco
      await T.G((F) => { for (const [k, v] of Object.entries(F)) __game.setFlag(k, v); __game.clearLog(); }, { ...ACTO2, casilla_fuente: true });
      await T.raton('usar', 'ordenador_bruno');
      ok(await T.until(() => __game.getFlag('herminia_midio') === true, null, 60000), 'paso 37: Herminia mide la pieza');
      await T.pasar(60000);
      // [P11] la escena se recorta: si ya la oyó, ni la frase ni el eco («lo de dentro» no se repite); «A un metro…», siempre
      ok(await T.logCount(FRASE) === 0 && !(await T.logHas('Lo que cuenta es lo de dentro.')) && await T.logHas('A un metro de mi cinta. Fuera.'), 'en la escena, ni la frase otra vez ni el eco; «A un metro de mi cinta. Fuera.»');
      await T.ctx.close();
      // sin haberla oído en el árbol, la escena la dice entera; luego el árbol, el eco
      const T2 = await abrir({ ...ACTO2, casilla_fuente: true }, 'pecera', 'ascensor');
      await T2.G(() => __game.skipText(true));
      await T2.G(() => __game.doVerb('usar', 'ordenador_bruno'));
      ok(await T2.logCount(FRASE) === 1 && await T2.logCount('Eso lo hace nuestro.') === 1, 'sin oírla antes: la escena la dice entera');
      await T2.G(() => { __game.clearLog(); return __game.doVerb('hablar', 'anselmo_monolito'); });
      await T2.G(() => __game.chooseText('¿Y tú no usas IA?'));
      ok(await T2.logHas('Ya te lo he dicho. Lo escribí yo. En mayúsculas.') && await T2.logCount(FRASE) === 0, 'después, en el árbol: el eco');
      await T2.ctx.close();
    }
    // ---- 3c. el boli muerto
    console.log('  c) el boli muerto');
    {
      const T = await abrir(ACTO1, 'catacumba', 'pecera');
      await T.raton('coger', 'bolis_aurora'); await T.pasar();
      ok(await T.logHas('¡Au! Me ha corregido la mano. En rojo.') && !(await T.G(() => __game.state().inventory.includes('boli_muerto'))), 'antes del café y sin saber de Custodia: el golpecito');
      await T.G(() => { __game.setFlag('custodia_regla', true); __game.clearLog(); });
      await T.raton('coger', 'bolis_aurora'); await T.pasar();
      ok(await T.logHas('¡Au! Sin café, Aurora no suelta ni a sus muertos.'), 'antes del café con la regla de Custodia: «Sin café…» (qué falta)');
      await T.ctx.close();
      const T2 = await abrir(ACTO2, 'catacumba', 'pecera');
      await T2.raton('coger', 'bolis_aurora'); await T2.pasar();
      ok(await T2.logHas('Un boli muerto solo le sirve a Custodia. Y a ti no te lo ha pedido.'), 'tras el café sin la regla: Aurora dice quién pide un boli muerto');
      const L = await T2.G(async () => { __game.skipText(true); __game.clearLog(); await __game.scene('pistas'); return __game.log.map(l => l.text); });
      ok(L.includes('Un boli gastado no le sirve a nadie, hijo. Bueno, a una sí.'), 'la abuela, tras intentarlo: la pista del boli (sin la regla)');
      await T2.G(() => __game.skipText(false));
      await T2.G(() => __game.gotoRoom('pecera', 'catacumba')); await T2.pasar();
      await T2.raton('hablar', 'custodia_precinto'); await T2.pasar();
      await T2.clicOpcion('¿Me deja un boli?'); await T2.pasar();
      await T2.clicOpcion('Para firmar en papel. En la página 7.'); await T2.pasar();
      ok(await T2.logHas('La firma de la página 7 se la gana con Teodoro, no con un boli.'), 'Custodia: el boli no hace falta para firmar');
      await T2.clicOpcion('¿Me deja un boli?'); await T2.pasar();
      await T2.clicOpcion('¿Y cómo se consigue un boli aquí?'); await T2.pasar();
      ok(await T2.flag('custodia_regla'), '«¿Y cómo se consigue un boli aquí?» → la regla');
      await T2.salir();
      await T2.G(() => __game.gotoRoom('catacumba', 'pecera')); await T2.pasar();
      await T2.raton('coger', 'bolis_aurora'); await T2.pasar();
      ok(await T2.G(() => __game.state().inventory.includes('boli_muerto')), 'con la regla y tras el café: el boli muerto');
      const L2 = await T2.G(async () => { __game.skipText(true); __game.clearLog(); await __game.scene('pistas'); return __game.log.map(l => l.text); });
      ok(L2.includes('Ese boli sin tinta, llévaselo a la que lo pidió.'), 'la abuela, con el boli: llévaselo a Custodia (sub-estado nuevo: vuelve al nivel 1)');
      await T2.G(() => __game.skipText(false));
      await T2.G(() => __game.gotoRoom('pecera', 'catacumba')); await T2.pasar();
      await T2.raton('dar', 'custodia_precinto', 'boli_muerto'); await T2.pasar();
      await T2.clicOpcion('Para apuntar lo que me digan.'); await T2.pasar(30000);
      ok(await T2.flag('custodia_ablandada') && !(await T2.G(() => __game.state().inventory.includes('boli_muerto'))), 'Dar el boli muerto → «Para apuntar lo que me digan.» → custodia_ablandada');
      await T2.shot('boli-custodia');
      await T2.ctx.close();
    }
  }

  // ====================================================================== 4. partidas antiguas
  if (toca('antiguas')) {
    console.log('\n4 · partidas guardadas de antes de E5-E7');
    const T = await nuevaPagina();
    const { G } = T;
    await G(() => { __game.skipText(true); return __game.newGame(); });
    const A2 = { intro_vista: true, torno_abierto: true, inigo_presentado: true, silla_libre: true, chaqueta_cogida: true, chaqueta_en_lector: true, gertrudis_saludada: true,
      acto_2_iniciado: true, cms_vivo: true, rep_11: true };
    const cargar = (st) => G(async (st) => {
      const d = { v: 1, date: Date.now(), roomName: 'antigua', state: st };
      localStorage.setItem(__game.game.slotKey(8), JSON.stringify(d));
      await __game.load(8); __game.skipSpeech(); await __game.waitIdle(); __game.clearLog();
      return __game.state().flags;
    }, st);
    const estado = (flags, room, inv) => ({ room, flags, inventory: ['tarjeta_becario', 'libreta_replicas', 'movil', ...inv], objects: {}, actors: {}, once: {} });
    // (a) antes de E5: Acto II sin `aurora_conto_pasos` ni el orden del día mirado, en la Sala
    let F = await cargar(estado({ ...A2 }, 'sala_amazonas', ['ficha_pagina_7']));
    await G(() => __game.doVerb('hablar', 'gervasio_acta'));
    let o = await G(() => __game.currentDialogOptions() || []);
    const ia = o.findIndex(x => x.includes('siguientes pasos'));
    if (ia >= 0) await G(i => __game.chooseDialog(i), ia);
    await G(() => __game.waitIdle());
    ok(ia >= 0 && await G(() => __game.getFlag('sala_becario_sin_turno') === true), 'antes de E5 (sin aurora_conto_pasos ni orden del día): la pregunta a Gervasio sigue la cadena');
    await escape(createRunner(T.page));
    // (b) una estampida cortada: Mercados fuera, la reunión sin terminar
    F = await cargar(estado({ ...A2, sala_becario_sin_turno: true, gertrudis_pregunta: true, sala_amazonas_estampida: true }, 'sala_amazonas', ['ficha_pagina_7']));
    ok(F.reunion_terminada === true, 'estampida a medias (sala_amazonas_estampida sin reunion_terminada) → reunión terminada');
    await G(() => __game.doVerb('hablar', 'maripaz_remitido'));
    o = await G(() => __game.currentDialogOptions() || []);
    ok(o.some(x => x.includes('Siestatón no ha confirmado')), `y Maripaz ya negocia (D1) (${JSON.stringify(o)})`);
    await escape(createRunner(T.page));
    // (c) E5 a medias: la pregunta mandada desde el Vending de una versión vieja sin «sin turno», con apagon_n 3 y la pieza medida
    F = await cargar(estado({ ...A2, cms_vivo: false, gertrudis_pregunta: true, apagon_n: 3, herminia_midio: true, casilla_fuente: true }, 'pecera', []));
    ok(F.sala_becario_sin_turno === true && F.pecera_prompt_oido === true, 'gertrudis_pregunta sin «sin turno» → sin turno; herminia_midio → la frase ya oída');
    await G(() => __game.doVerb('tirar', 'enchufe_pantalla'));
    let L = await G(() => __game.log.map(l => String(l.text)));
    // [P11] del tercer tirón en adelante, solo el gesto (Yoli enchufa sin levantar la vista): sin texto, y la luz vuelve
    ok(!L.some(t => GENERICAS.has(t)) && await G(() => __game.getFlag('apagon_n') === 4 && !__game.getFlag('pecera_oscuras') && !__game.getFlag('cms_vivo')), `apagon_n 3 sin CMS: Tirar del enchufe, el gesto (apagón 4, sin la genérica)`);
    await G(() => { __game.clearLog(); return __game.doVerb('hablar', 'anselmo_monolito'); });
    await G(() => __game.chooseText('¿Y tú no usas IA?'));
    L = await G(() => __game.log.map(l => String(l.text)));
    ok(L.includes('Ya te lo he dicho. Lo escribí yo. En mayúsculas.') && !L.includes('El modelo es de fuera. El prompt es de dentro.'), 'y Anselmo dice el eco, no la frase otra vez');
    await escape(createRunner(T.page));
    // (d) con el atasco guardado a medias (de una versión que dejaba guardar): se resuelve al entrar
    F = await cargar(estado({ ...A2, sala_becario_sin_turno: true, gertrudis_pregunta: true, sala_amazonas_atasco: true }, 'sala_amazonas', []));
    ok(F.reunion_terminada === true && !F.sala_amazonas_atasco, 'atasco guardado → resuelto al cargar');
    // ---- [P11] guion nuevo, tanda 2: partidas del juego anterior a mitad de cada bloque que cambia
    const inv = () => G(() => __game.state().inventory);
    // (estas se hablan con PNJ fijos (Eutimio, Aurora): la ranura lleva las colocaciones de una partida nueva, como una de verdad)
    const ACT0 = await G(async () => { await __game.newGame(); __game.game.syncState(); const a = JSON.parse(JSON.stringify(__game.game.state.actors)); delete a.bruno; return a; });
    const estadoT2 = (flags, room, inv) => ({ ...estado(flags, room, inv), actors: ACT0 });
    // (e) el CMS arreglado por el camino viejo del ticket nº 3 (sin la R-3) y sin el manual (la pegatina sin pedir)
    F = await cargar(estadoT2({ ...A2, vio_ticket_3: true, vio_pegatina_fax: true }, 'cpd', []));
    ok((await inv()).includes('manual_fax') && F.paco_dio_manual === true && await G(() => __game.game.getObjState('regleta_r3').state === 'apagada'),
      '[P11] CMS por el ticket nº 3 y sin manual → recibe el manual; la R-3, apagada (no se repite la escena)');
    await G(() => { __game.clearLog(); return __game.doVerb('hablar', 'paco_ticket'); });
    o = await G(() => __game.currentDialogOptions() || []);
    ok(!o.some(x => /fax|0\.441/.test(x)) && o.includes('¿Algún cotilleo del consultor?'), '[P11] y Eutimio, sin las opciones del fax');
    await escape(createRunner(T.page));
    // (f) con el manual por la vía vieja («Ticket 0.441», opciones gastadas en el árbol P1): un solo manual; el árbol sigue
    F = await cargar({ ...estado({ ...A2, vio_pegatina_fax: true, paco_dio_manual: true, rep_12: true }, 'cpd', ['manual_fax']), dialogs: { 'paco.P1.fax441': true, 'paco.P1.consultor': true } });
    ok((await inv()).filter(i => i === 'manual_fax').length === 1 && await G(() => !!__game.game.state.dialogs['paco.P.consultor']), '[P11] manual por la vía vieja: uno solo; las opciones gastadas se conservan');
    // (g) Evaristo escuchado y la coma con Aurora a medias (sin el correo, que era ella quien lo imprimía)
    F = await cargar(estadoT2({ ...A2, nota_gasto_presentada: true, evaristo_escuchado: true, rep_16: true, evaristo_convoco: 'llamada' }, 'catacumba', ['copias_rechazadas', 'fotocopia_nota_direccion', 'ficha_pagina_7']));
    ok((await inv()).includes('correo_evaristo') && F.correo_evaristo_listo === true && !F.coma_bendecida, '[P11] la coma a medias → recibe el correo (la coma con Aurora queda opcional)');
    await G(() => __game.doVerb('hablar', 'aurora_galerada'));
    o = await G(() => __game.currentDialogOptions() || []);
    ok(o.includes('¿Está bien la coma de don Evaristo?') && !o.some(x => x.startsWith('Don Evaristo pregunta')), '[P11] y la opción nueva, aunque el fax no tenga papel');
    await escape(createRunner(T.page));
    // (h) el D1 ganado sin el rotulador (se cogía del termómetro): llega con la carga
    F = await cargar(estado({ ...A2, sala_becario_sin_turno: true, reunion_terminada: true, duelo_maripaz_ganado: true, casilla_hueco: true, acto_3_iniciado: true }, 'pecera', []));
    ok((await inv()).includes('rotulador_rojo'), '[P11] D1 ganado sin el rotulador → lo recibe (el kanban del Acto III no se queda sin él)');
    // (i) con el rotulador del termómetro en el Acto I: carga y no hay otro
    F = await cargar(estado({ intro_vista: true, torno_abierto: true, inigo_presentado: true, ecosistema_rotulador_dado: true }, 'ecosistema', ['rotulador_rojo']));
    await G(() => { __game.clearLog(); return __game.doVerb('coger', 'termometro_ventas'); });
    ok((await inv()).filter(i => i === 'rotulador_rojo').length === 1 && !(await G(() => __game.objects().some(o => o.id === 'rotulador_cordel' && o.visible))), '[P11] rotulador cogido del termómetro: sigue uno; el cordel, vacío');
    // (j) la L3 pendiente (pieza recortada) y la L5 (Brais libre, con el correo): no suenan
    F = await cargar({ ...estado({ ...A2, nota_gasto_presentada: true, evaristo_escuchado: true, evaristo_llamadas: 2, pieza_escrita: true, pieza_recortada: true, correo_evaristo_listo: true }, 'catacumba', ['correo_evaristo']), once: { 'once:evaristo_L1': true, 'once:evaristo_L2': true } });
    await G(() => __game.gotoRoom('pecera', 'catacumba'));
    await G(() => __game.gotoRoom('pajarera', 'pecera'));
    L = await G(() => __game.log.map(l => String(l.text)));
    ok(!L.some(t => t.includes('Begoña me manda el triplicado')) && !L.some(t => t.includes('¿Lleva mi correo?')), '[P11] L3 y L5 pendientes de una partida vieja: no suenan');
    await T.ctx.close();
  }
} catch (e) {
  failures++;
  console.log('  ✗ EXCEPCIÓN: ' + (e && e.stack || e));
}
if (P0) await P0.ctx.close().catch(() => {});
ok(!errs.length, `sin errores de consola${errs.length ? ': ' + errs.slice(0, 5).join(' | ') : ''}`);
await browser.close();
server.close();
console.log(failures ? `\nBLOQUEOS: FALLAN ${failures} de ${checks}` : `\nBLOQUEOS: TODO OK (${checks} comprobaciones)`);
process.exit(failures ? 1 : 0);
