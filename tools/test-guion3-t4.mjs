#!/usr/bin/env node
// GUION NUEVO · TANDA 4 (docs/GUION_PROPUESTA_LIMPIO.md): CIERRE Y AUDITORÍA ([P15] y lo que quedaba de la tanda 3).
//   · Seis opciones a la vez, como mucho: se recorren TODOS los árboles de diálogo en cada estado de las tres rutas
//     (canónica, --alt, --alt2), también agotando opciones en dos órdenes, y falla si alguno enseña más de seis. Las
//     opciones del camino principal (las réplicas R01–R16, «¿Y tú no usas IA?», «Creo que sé dónde está tu 112.»…) no
//     pueden quedar detrás de otra. Las cadenas se juegan con el ratón (Celestino, Custodia, Pilar en el Acto III) y se
//     fotografían los árboles más llenos.
//   · Repaso de bloqueos: en cada estado intermedio de las tres rutas, lo que la abuela manda hacer en su nivel 3 (y
//     dónde está cada réplica que falta) se puede hacer en ese momento.
//   · Pistas nuevas de la abuela: la R05 («las cartas de todos») y el manual del fax (sin el manual, antes de la R-3).
//   · Auditoría (tools/audit-guion3.mjs): ninguna línea del guion falta, ninguna difiere y no queda resto de lo quitado.
//   · Partidas viejas: el álbum ya prestado (nada da por sabida la 112), opciones gastadas guardadas por posición.
//   · El armario 27 cerrado responde en todo su alto; la trituradora junto a la mesa de Pilar (captura).
//   node tools/test-guion3-t4.mjs        (capturas en tools/shots/guion3-t4-*.png)
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from './serve.mjs';
import { createRunner, StepFail } from './walk-lib.mjs';
import { STEPS, ALT, ALT2 } from './walk-data.mjs';
import { auditar } from './audit-guion3.mjs';

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
const T0 = Date.now();
const step = (t) => console.log(`\n[${Math.round((Date.now() - T0) / 1000)} s] ` + t);
const consoleErrors = [];
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const page = await browser.newPage({ viewport: { width: 960, height: 600 } });
page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));
const G = (fn, a) => page.evaluate(fn, a);
const R = createRunner(page);
const until = async (fn, arg, ms = 8000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await G(fn, arg)) return true; await sleep(40); } return false; };
const idle = () => G(() => __game.waitIdle());
const flag = (k) => G(k => __game.getFlag(k), k);
const tiene = (i) => G(i => __game.state().inventory.includes(i), i);
const logHas = (t) => G(t => __game.log.some(l => String(l.text).includes(t)), t);
const clearLog = () => G(() => __game.clearLog());
const rapido = (on) => G(on => __game.skipText(on), on);
const shot = (n) => page.screenshot({ path: path.join(shots, `guion3-t4-${n}.png`) });
const opciones = () => G(() => __game.currentDialogOptions() || []);
const fuera = (o) => o.map(x => x.replace(/^› /, ''));
async function capturaEn(lanzar, t, nombre, ms = 60000, extra = 350) {
  await rapido(false);
  await clearLog();
  await G(lanzar);
  const visto = await until(t => __game.log.some(l => String(l.text).includes(t)), t, ms);
  if (visto) { await sleep(extra); await shot(nombre); }
  await rapido(true);
  await idle();
  return visto;
}

// ---- ratón
const verA = (id) => G((id) => {
  const g = __game.game, o = __game.objects().find(o => o.id === id) || (g.actors[id] && { x: g.actors[id].x - 10, w: 20 });
  if (!o) return;
  g.camFollow = null; g.camTarget = null; g.camX = Math.max(0, Math.min(g.room.width - 320, Math.round(o.x + o.w / 2 - 160)));
}, id);
const seguir = () => G(() => { __game.game.camFollow = __game.game.G.player; });
const clicVerbo = async (v) => { const c = await G(v => __game.verbPos(v), v); await page.mouse.click(c.x, c.y); await sleep(40); };
async function raton(verbo, id, esperar = true) {
  await clicVerbo(verbo);
  await verA(id); await sleep(60);
  const c = await G(id => __game.screenPos(id), id);
  await page.mouse.click(c.x, c.y);
  if (esperar) { await sleep(150); await idle(); await seguir(); }
}
async function hablar(id) {
  await raton('hablar', id, false);
  await until(() => !!__game.currentDialogOptions(), null, 30000); await sleep(250);
  return fuera(await opciones());
}
async function clicOpcion(texto) {
  if (!(await until(() => !!__game.currentDialogOptions(), null, 15000))) return false;
  await sleep(300);
  const o = await opciones();
  const i = o.findIndex(x => x.replace(/^› /, '') === texto || x.includes(texto));
  if (i < 0) return false;
  const p = await G(i => __game.optionPos(i), i);
  await page.mouse.click(p.x, p.y + 2);
  await sleep(150); await idle();
  return true;
}
async function salir() {
  for (let k = 0; k < 5; k++) {
    const o = await opciones(); if (!o.length) return;
    const i = o.findIndex(x => /^(› )?(Me voy|Nada|Luego vuelvo|Ahora vuelvo|Mejor no|Gracias)/.test(x));
    await G(i => __game.chooseDialog(i), i < 0 ? o.length - 1 : i); await idle();
  }
}

// ---- partidas
const paso = (n) => STEPS.find(s => s.n === n);
async function jugar(lista, cada) {
  await rapido(true);
  for (const n of lista) {
    const s = paso(n);
    for (const a of s.acc) await R.run(a);
    await idle();
    await R.check(s.esp);
    if (cada) await cada(n);
  }
}
async function nueva() { await rapido(true); await G(() => __game.newGame()); await idle(); }
const guardar = (slot) => G(s => __game.save(s), slot);
const cargar = async (slot) => { await G(s => __game.load(s), slot); await idle(); };
async function partidaVieja(slot, nuevaSlot, cambio) {
  await G(([s, n, c]) => {
    const k = __game.game.slotKey(s), d = JSON.parse(localStorage.getItem(k));
    new Function('st', c)(d.state);
    localStorage.setItem(__game.game.slotKey(n), JSON.stringify(d));
  }, [slot, nuevaSlot, cambio]);
  await cargar(nuevaSlot);
}
async function abuela(sala) {
  return G(async (sala) => {
    const g = __game.game, real = g.state.room;
    if (sala) g.state.room = sala;
    __game.clearLog(); __game.skipText(true);
    try { await __game.scene('pistas'); } finally { g.state.room = real; }
    return { abuela: __game.log.filter(l => l.who === 'abuela_remedios').map(l => String(l.text)), bruno: __game.log.filter(l => l.who === 'bruno').map(l => String(l.text)),
      obj: g.state.flags.abuela_obj, nivel: g.state.flags.abuela_nivel };
  }, sala);
}
const fin = () => G(() => __game.state().finished);
async function terminar(desde, orden = STEPS.map(s => s.n)) {
  let terminada = true;
  try { await jugar(orden.slice(orden.indexOf(desde))); } catch (e) { terminada = false; console.log('    ' + (e instanceof StepFail ? e.message : e)); }
  return terminada && !!((await fin()) && (await fin()).flags.juego_terminado);
}

// ====================================================================== en la página
/** Cuenta las opciones a la vista de cada nodo de cada árbol: con lo gastado de la partida y desde cero, agotando
 *  (una a una, como el jugador) en dos órdenes: de arriba abajo y de abajo arriba. Devuelve los nodos con más de 6. */
const CONTAR = async () => {
  const g = __game.game; if (!g.state) return [];
  const D = await import('./engine/dialog.js');
  const api = g.condApi();
  const trees = { ...g.content.dialogs };
  for (const r of Object.values(g.content.rooms)) for (const [k, d] of Object.entries(r.dialogs || {})) trees[k] = d;
  const out = [], real = g.state.dialogs;
  const txt = (o) => { try { return typeof o.text === 'function' ? o.text(api) : o.text; } catch (e) { return '?'; } };
  try {
    for (const [dId, def] of Object.entries(trees)) for (const [nId, node] of Object.entries(def.nodes || {})) {
      let max = 0, peor = null;
      for (const base0 of [real, {}]) for (const inverso of [false, true]) {
        g.state.dialogs = { ...base0 };
        for (let k = 0; k < 80; k++) {
          const v = D.opcionesVisibles(g, api, dId, nId, node);
          if (v.length > max) { max = v.length; peor = v.map(a => txt(a.o)); }
          const key = (a) => `${dId}.${nId}.${a.o.id || a.i}`;
          const lista = v.filter(a => !a.o.exit && !g.state.dialogs['elegida:' + key(a)]);
          const sig = inverso ? lista[lista.length - 1] : lista[0];
          if (!sig) break;
          if (sig.o.once) g.state.dialogs[key(sig)] = true; else g.state.dialogs['elegida:' + key(sig)] = true;
        }
      }
      if (max > 6) out.push({ k: `${dId}.${nId}`, max, peor });
    }
  } finally { g.state.dialogs = real; }
  return out;
};

/** Opciones del camino principal (y las que enseñan réplicas): nunca detrás de otra (`tras`) y, si su `if` se cumple
 *  y no se ha gastado, a la vista. [árbol, nodo, texto] */
const CAMINO = [
  ['celestino', 'C0', '¿Tiene algo para los nervios?'], ['celestino', 'C0', '¿Algún cotilleo?'],                         // R05
  ['gertrudis', 'G0', 'Buenas noches, Gertrudis.'], ['gertrudis', 'G0', 'Buenas noches otra vez.'],                         // R03 R04 R10 R14
  ['aurora', 'A_MENU', '¿Por qué no se hablan usted y Teodoro?'], ['aurora', 'A_MENU', 'Tengo dos fuentes.'],             // R02
  ['yoli', 'Y0', '¿Algún hilo bueno esta noche?'],                                                                        // R08
  ['anselmo', 'AN0', '¿Qué tal con Yoli?'], ['anselmo', 'AN0', '¿Y tú no usas IA?'], ['anselmo', 'AN0', 'Mira este álbum.'],   // R09 · la frase
  ['anselmo', 'AN0', 'Necesito la baja de Brais.'],
  ['paco', 'P', '¿Algún cotilleo del consultor?'], ['paco', 'P', '¿Qué hay en el armario 27?'],                              // R12
  ['ruben', 'R0', '¿Escribiste tú los discursos de Íñigo?'], ['ruben', 'R0', '¿Te llegaban correos de Tadeo?'],           // R13 R15
  ['ruben', 'R0', '¿De dónde es esa silla?'],
  ['evaristo', 'E0', '¿Para qué me ha llamado?'], ['evaristo', 'E0', '¿Qué quería decirme?'],                              // R16
  ['pilar', 'PE0', 'Creo que sé dónde está tu 112.'], ['pilar', 'PE0', '¿Cuántas sillas hay?'],
  ['gervasio_reunion', 'GV_REUNION', 'Bueno... ¿y cuáles son los siguientes pasos?'],
  ['begona', 'B0', 'Quiero presentar una nota de gasto.'], ['begona', 'B0', 'Necesito recortar ocho líneas.'],
  ['teodoro', 'T0', 'Quiero firmar en tu página 7.'], ['maripaz_sala', 'MP_SALA', 'Siestatón no ha confirmado la página 7.'],
  ['gervasio_puerta', 'GV_PUERTA', 'Necesito el acta de la última reunión.'], ['tele_sala', 'TV0', 'Buenas noches, Gertrudis.'],
];
const CAMINO_VISIBLE = async (camino) => {
  const g = __game.game; if (!g.state) return [];
  const D = await import('./engine/dialog.js');
  const api = g.condApi(), out = [];
  const trees = { ...g.content.dialogs };
  for (const r of Object.values(g.content.rooms)) for (const [k, d] of Object.entries(r.dialogs || {})) trees[k] = d;
  for (const [t, n, texto] of camino) {
    const node = trees[t] && trees[t].nodes[n];
    const i = node ? node.options.findIndex(o => o.text === texto) : -1;
    if (i < 0) { out.push(`${t}.${n}: no existe «${texto}»`); continue; }
    const o = node.options[i];
    if (o.tras) { out.push(`${t}.${n}: «${texto}» va detrás de otra (tras ${o.tras})`); continue; }
    if (o.once && g.state.dialogs[`${t}.${n}.${o.id || i}`]) continue;
    let base = true; try { base = g.cond(o.if, api); } catch (e) { base = false; }
    if (base && !D.opcionesVisibles(g, api, t, n, node).some(a => a.i === i)) out.push(`${t}.${n}: «${texto}» escondida`);
  }
  return out;
};

/** Lo que la abuela manda hacer (nivel 3, «Bruno al colgar») y dónde está cada réplica que falta: ¿se puede hacer ya?
 *  Devuelve los objetivos pendientes cuya indicación no se puede seguir en este estado. */
const HACIBLE = async () => {
  const g = __game.game; if (!g.state) return [];
  const O = await import('./engine/objetivos.js');
  const D = await import('./engine/dialog.js');
  const P = await import('./content/pistas.js');
  const api = g.condApi(), f = (k) => !!g.state.flags[k], has = (i) => g.state.inventory.includes(i);
  const trees = { ...g.content.dialogs };
  for (const r of Object.values(g.content.rooms)) for (const [k, d] of Object.entries(r.dialogs || {})) trees[k] = d;
  const opcion = (t, n, texto) => { const node = trees[t].nodes[n]; return D.opcionesVisibles(g, api, t, n, node).some(a => String(a.o.text) === texto); };
  const obj = (sala, id) => {
    const o = (g.content.rooms[sala].objects || []).find(o => o.id === id);
    if (!o) { const a = g.actors[id]; return !!(a && a.room === sala && a.visible !== false); }
    const st = (g.state.objects || {})[id];
    if (st && st.visible === false) return false;
    try { return o.when == null || !!g.cond(o.when, api); } catch (e) { return false; }
  };
  const actor = (sala, id) => { const a = g.actors[id]; return !!(a && a.room === sala && a.visible !== false); };
  const PRUEBA = {
    'Vestíbulo: chicle en la tarjeta, tarjeta en el organigrama, y al torno.': () => (has('chicle') || f('tarjeta_con_chicle') || opcion('celestino', 'C0', '¿Tiene algo para los nervios?')) && obj('vestibulo', 'organigrama'),
    'Redacción: Coger la chaqueta de Ramírez. Y ponérsela al Lector Medio.': () => obj('pecera', 'chaqueta_ramirez_hotspot'),
    'Despachos: Usar la chaqueta de Ramírez con el Lector Medio.': () => has('chaqueta_ramirez'),
    'Redacción: Mirar mi ordenador, ya sentado.': () => f('silla_libre') && obj('pecera', 'ordenador_bruno'),
    'Vending: hablar con Gertrudis, «Buenas noches, Gertrudis».': () => opcion('gertrudis', 'G0', 'Buenas noches, Gertrudis.'),
    'Redacción de papel: Dar el café a Aurora.': () => has('cafe'),
    'Sistemas: Tirar de la R-3 del regletero. La del pósit de Eutimio.': () => obj('cpd', 'regleta_r3') && !f('cms_vivo'),
    'Sala Amazonas: a Gervasio, «¿y cuáles son los siguientes pasos?».': () => opcion('gervasio_reunion', 'GV_REUNION', 'Bueno... ¿y cuáles son los siguientes pasos?'),
    'Sala Amazonas: a la tele, «Buenas noches, Gertrudis». Y lo de los pasos.': () => opcion('tele_sala', 'TV0', 'Buenas noches, Gertrudis.'),
    'Sala Amazonas: Usar la tele, o hablarle.': () => obj('sala_amazonas', 'tele_amazonas'),
    // (con la web caída, Maripaz contesta lo que falta: «Arréglala y te lo pongo por escrito.», y cuenta el objetivo del CMS)
    'Sala Amazonas: a Maripaz, «Siestatón no ha confirmado la página 7».': () => opcion('maripaz_sala', 'MP_SALA', 'Siestatón no ha confirmado la página 7.'),
    'Administración: nota de gasto a Begoña, con el azúcar. Y una bien hecha.': () => opcion('begona', 'B0', 'Quiero presentar una nota de gasto.') && has('sobre_azucar'),
    'Administración: escuchar a Evaristo, «¿De qué trata?» y «Siga». Y su correo.': () => opcion('evaristo', 'E0', '¿Para qué me ha llamado?') || opcion('evaristo', 'E0', '¿Qué quería decirme?'),
    'Redacción de papel: Usar las copias rechazadas con el fax.': () => has('copias_rechazadas'),
    'Redacción de papel: Dar la fotocopia de la nota a Aurora.': () => has('fotocopia_nota_direccion') && has('mensaje_fp'),
    'Redacción de papel: a Teodoro, «Quiero firmar». Remate: el manual.': () => opcion('teodoro', 'T0', 'Quiero firmar en tu página 7.') && has('manual_fax'),
    'Sistemas: el manual lo tiene Eutimio. Me lo da con su hueco, al apagar la R-3.': () => !f('cms_vivo') && !f('paco_dio_manual') && obj('cpd', 'regleta_r3'),
    'Redacción: Usar mi ordenador. A escribir.': () => obj('pecera', 'ordenador_bruno') && f('casilla_fuente'),
    'Redacción de papel: la pieza al fax, tecla 2. O en mano, a Begoña.': () => has('pieza_opa') && (f('fax_con_papel') || opcion('begona', 'B0', 'Necesito recortar ocho líneas.')),
    'Redacción de papel: Dar la ficha a Teodoro.': () => has('ficha_pagina_7') && f('fax_con_papel'),
    'Sistemas: tirar del papel continuo del 27.': () => obj('cpd', 'papel_continuo'),
    'Eventos: ver a Pilar antes de las 21:04. El álbum está en su trituradora.': () => actor('eventos', 'pilar_escaleta') && obj('eventos', 'album_trituradora'),
    'Sistemas: Mirar la silla del armario 27. O preguntarle a Brais de dónde es.': () => obj('cpd', 'silla_armario'),
    'Eventos: a Pilar, «Creo que sé dónde está tu 112». En el armario 27.': () => opcion('pilar', 'PE0', 'Creo que sé dónde está tu 112.'),
    'Redacción: Dar el álbum a Anselmo.': () => has('album_eventos'),
    'Redacción: Usar el rotulador con el kanban. «SALIDA EN VALOR».': () => has('rotulador_rojo') && f('rep_13') && obj('pecera', 'kanban'),
    'Sistemas: a Brais, «¿Escribiste tú los discursos de Íñigo?».': () => opcion('ruben', 'R0', '¿Escribiste tú los discursos de Íñigo?'),
    'Despachos: a Gervasio, que acabe de escribir. Remate: su nota de la comida.': () => opcion('gervasio_puerta', 'GV_PUERTA', 'Necesito el acta de la última reunión.') && has('fotocopia_nota_direccion'),
    'Sala Amazonas, remates: el ticket nº 1, el acta y el correo de Evaristo.': () => has('ticket_n1') && has('acta_reunion'),
    'Sala Amazonas: Empujar al Lector Medio.': () => f('duelo_inigo_ganado'),
  };
  const REP = {
    rep_01: () => obj('office', 'tablon'), rep_02: () => opcion('aurora', 'A_MENU', '¿Por qué no se hablan usted y Teodoro?'),
    rep_03: () => opcion('gertrudis', 'G0', 'Buenas noches, Gertrudis.') || opcion('gertrudis', 'G0', 'Buenas noches otra vez.'),
    rep_05: () => opcion('celestino', 'C0', '¿Algún cotilleo?'), rep_06: () => obj('catacumba', 'fax_enmarcado'),
    rep_07: () => obj('pajarera', 'ordenador_gervasio'), rep_08: () => !f('cms_vivo') || opcion('yoli', 'Y0', '¿Algún hilo bueno esta noche?'),
    rep_09: () => opcion('anselmo', 'AN0', '¿Qué tal con Yoli?'), rep_11: () => obj('pecera', 'ordenador_bruno'),
    rep_12: () => opcion('paco', 'P', '¿Algún cotilleo del consultor?'), rep_13: () => opcion('ruben', 'R0', '¿Escribiste tú los discursos de Íñigo?'),
    rep_15: () => opcion('ruben', 'R0', '¿Te llegaban correos de Tadeo?'),
    rep_16: () => opcion('evaristo', 'E0', '¿Para qué me ha llamado?') || opcion('evaristo', 'E0', '¿Qué quería decirme?'),
  };
  REP.rep_04 = REP.rep_10 = REP.rep_14 = REP.rep_03;
  const out = [];
  for (const id of O.pendientes(g)) {
    const o = g.G.objetivos.find(x => x.id === id);
    if (o.opcional) continue;
    const v = O.variante(g, o);
    const l3 = (v.niveles || o.niveles)[2][1];
    const pr = PRUEBA[l3];
    if (!pr) { out.push(`${id}: sin prueba para «${l3}»`); continue; }
    if (!pr()) out.push(`${id}: «${l3}» no se puede hacer ahora`);
    if (o.duelo) {
      const duel = g.content.duels[o.duelo] || (g.content.duels.opponents || {})[o.duelo];
      const mazo = (duel && duel.deck) || [];
      for (const r of mazo) {
        const k = 'rep_' + String(r).slice(1);
        if (f(k) || !P.DONDE[k]) continue;
        if (!REP[k] || !REP[k]()) out.push(`${id}: réplica ${r}, «${P.DONDE[k][1]}» no se puede hacer ahora`);
      }
    }
  }
  return out;
};

try {
  await page.goto(base);
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) { /* ignore */ } });
  await page.reload();
  await page.waitForFunction(() => !!window.__game && __game.state().mode === 'title');
  await R.startDismisser();

  // ====================================================================== datos y auditoría
  step('Datos: pistas nuevas de la abuela y auditoría contra la copia limpia');
  {
    const P = await import('../content/pistas.js');
    ok(P.DONDE.rep_05[0] === 'El del mostrador de abajo sabe lo que se dice en las cartas de todos.', 'R05 de la abuela: «…lo que se dice en las cartas de todos.» ([P15])');
    const firma = P.OBJETIVOS.find(o => o.id === 'firma').sub[0];
    ok(firma.si === '!has:manual_fax' && firma.niveles[1] === 'El de los cables guarda el manual de esa máquina. Arréglale lo suyo.'
      && firma.niveles[2][0] === 'Apaga la regleta que no dice lo que es, y el de los cables te da el manual.', 'el manual del fax: las pistas nuevas de la abuela ([P15])');
    const sp = P.OBJETIVOS.find(o => o.id === 'silla_pilar');
    ok(sp.niveles[1] === 'Esa silla que le falta, ¿no la has visto tú en algún sitio?' && sp.sub[1].niveles[1] === 'Esa silla que le falta la has visto tú, hijo. Con alguien encima.', 'la silla de Pilar: las dos variantes (tanda 3), literales');
    const al = P.OBJETIVOS.find(o => o.id === 'album');
    ok(al.niveles[0] === 'Para que dejen irse a alguien, hay que demostrar que estuvo.' && al.niveles[1] === 'Las fotos de las fiestas las guarda la que las organiza.', 'el álbum: las pistas (tanda 3), literales');
    const A = auditar();
    ok(A.faltan.length === 0, `auditoría (a): ninguna línea del guion falta en el juego${A.faltan.length ? ': ' + A.faltan.slice(0, 5).map(x => 'L' + x.n + ' ' + x.texto).join(' | ') : ''}`);
    ok(A.puntuacion.length === 0, `auditoría (a'): ninguna difiere en puntuación${A.puntuacion.length ? ': ' + A.puntuacion.slice(0, 5).map(x => 'L' + x.n + ' ' + x.texto).join(' | ') : ''}`);
    ok(A.restos.length === 0, `auditoría (c): ningún resto de lo quitado${A.restos.length ? ': ' + A.restos.map(x => x.f + ' ' + x.texto).join(' | ') : ''}`);
  }

  // ====================================================================== tope de seis, camino principal, bloqueos
  for (const [ruta, orden] of [['canónica', STEPS.map(s => s.n)], ['--alt', ALT], ['--alt2', ALT2]]) {
    step(`Ruta ${ruta}: en cada estado, ≤ 6 opciones en todos los árboles; el camino principal a la vista; las pistas, hacibles`);
    await nueva();
    const malos = {}, escondidas = new Set(), nohacible = new Set();
    let estados = 0;
    const mirar = async (n) => {
      estados++;
      for (const x of await G(CONTAR)) if (!malos[x.k] || malos[x.k].max < x.max) malos[x.k] = { ...x, n };
      for (const x of await G(CAMINO_VISIBLE, CAMINO)) escondidas.add(`paso ${n}: ${x}`);
      if (n !== 49) for (const x of await G(HACIBLE)) nohacible.add(`tras el paso ${n}: ${x}`);
    };
    await mirar(0);
    try { await jugar(orden, mirar); } catch (e) { ok(false, `${ruta}: la ruta se juega entera (${e instanceof StepFail ? e.message : e})`); }
    ok(!Object.keys(malos).length, `${ruta}: ${estados} estados, ningún árbol con más de seis opciones a la vez`
      + Object.values(malos).map(m => `\n      ${m.k}: ${m.max} (paso ${m.n}): ${m.peor.join(' | ')}`).join(''));
    ok(!escondidas.size, `${ruta}: las opciones del camino principal y de las réplicas nunca quedan detrás de otra` + [...escondidas].slice(0, 8).map(x => '\n      ' + x).join(''));
    ok(!nohacible.size, `${ruta}: lo que dice la abuela (nivel 3 y réplicas que faltan) se puede hacer en cada estado` + [...nohacible].slice(0, 12).map(x => '\n      ' + x).join(''));
  }

  // ====================================================================== cadenas, con el ratón
  step('Cadenas con el ratón: Celestino (el café con el torno abierto; aburrirse tras el Ibex), Custodia');
  await nueva();
  {
    let o = await hablar('celestino');
    ok(!o.includes('¿Dónde hay café en esta casa?') && o.includes('El torno no me deja pasar.') && o.includes('¿Algún cotilleo?') && !o.includes('¿Y usted no se aburre aquí?') && o.length <= 6,
      `Celestino, torno cerrado: sin el café ni «¿Y usted no se aburre…?» (${o.join(' | ')})`);
    const iIbex = o.indexOf('¿Cómo va el Ibex?');
    await clicOpcion('¿Cómo va el Ibex?');
    o = fuera(await opciones());
    ok(o.indexOf('¿Y usted no se aburre aquí?') === iIbex + 1 && o.length <= 6, `tras el Ibex, «¿Y usted no se aburre aquí?» justo debajo (${o.join(' | ')})`);
    await shot('arbol-celestino');
    await clicOpcion('¿Y usted no se aburre aquí?');
    o = fuera(await opciones());
    ok(o.indexOf('¿Cómo se consigue una plaza de garaje?') === iIbex + 1, '…y, agotada, la plaza de garaje en su hueco');
    await salir();
    await jugar([2, 4, 5, 6, 7]);
    o = await hablar('celestino');
    ok(o.includes('¿Dónde hay café en esta casa?'), 'con el torno abierto, «¿Dónde hay café en esta casa?»');
    await salir();
    await jugar([3, 8, 9]);
    await R.run(['ir', 'pecera']); await idle();
    o = await hablar('custodia_precinto');
    const iBn = o.indexOf('Buenas noches.');
    ok(iBn >= 0 && !o.includes('Por favor. Es una emergencia.') && !o.includes('¿Por qué no se le ve la cara?') && o.length <= 6, `Custodia: «Buenas noches.» y la libreta, sin sus siguientes (${o.join(' | ')})`);
    await clicOpcion('Buenas noches.');
    o = fuera(await opciones());
    ok(o.indexOf('Por favor. Es una emergencia.') === iBn, '«Buenas noches.» → «Por favor. Es una emergencia.» en el mismo hueco');
    await clicOpcion('¿Me da una libreta?');
    o = fuera(await opciones());
    ok(o.includes('¿Por qué no se le ve la cara?') && o.length <= 6, '«¿Me da una libreta?» → «¿Por qué no se le ve la cara?»');
    await shot('arbol-custodia');
    await salir();
  }

  step('Árboles llenos, a la vista: Íñigo (Acto I, tras la súplica), Eutimio (CMS caído), Aurora (una fuente), Pilar (Acto III)');
  await jugar([10, 11, 12]);
  {
    await R.run(['ir', 'pajarera']); await idle();
    const o = await hablar('inigo_sinergia');
    ok(o.length === 6 && o.includes('¿Qué es eso del armario 27?') && o.includes('¿Qué es esa matriz?') && !o.includes('¿De qué color soy yo?'), `Íñigo, Acto I tras la súplica: seis (${o.join(' | ')})`);
    await shot('arbol-inigo');
    await clicOpcion('¿Qué es esa matriz?');
    const o2 = fuera(await opciones());
    ok(o2.indexOf('¿De qué color soy yo?') === 0, 'la matriz → «¿De qué color soy yo?» en su hueco');
    await salir();
  }
  await jugar([13, 14, 15, 16, 17, 18, 30, 31, 32, 33]);
  {
    await R.run(['ir', 'cpd']); await idle();
    const o = await hablar('paco_ticket');
    ok(o.length === 6 && o.includes('¿Y por qué no va?') && o.includes('¿Algún cotilleo del consultor?') && o.includes('¿Qué hay en el armario 27?') && o.includes('¿Escuchas por la rejilla?') && !o.includes('¿Se ha caído el wifi?'),
      `Eutimio con el CMS caído: seis, con R12 y el armario 27 (${o.join(' | ')})`);
    await shot('arbol-eutimio');
    await salir();
    await R.run(['ir', 'catacumba']); await idle();
    const a = await hablar('aurora_galerada');
    ok(a.length <= 6 && a[0] === 'Tengo dos fuentes.' && !a.includes('¿Qué noticia puedo traer?') && a.includes('¿Cómo convenzo a Teodoro?') && a.includes('¿Está bien la coma de don Evaristo?'),
      `Aurora con dos fuentes y el correo: «Tengo dos fuentes.» en el hueco de la noticia; R02 gastada → «¿Cómo convenzo…?» (${a.join(' | ')})`);
    await shot('arbol-aurora');
    await salir();
  }

  // ====================================================================== la pista nueva del manual (antes de la R-3)
  step('Pista nueva: el manual del fax, con el fax con papel y el CMS aún caído (FUENTE hecha)');
  await jugar([34]);
  {
    ok(!(await flag('cms_vivo')) && !(await tiene('manual_fax')), 'estado: FUENTE hecha, fax con papel, CMS caído, sin el manual');
    await G(() => { const f = __game.game.state.flags; delete f.abuela_obj; delete f.abuela_nivel; });
    let p = await abuela('catacumba');
    p = await abuela('catacumba');
    ok(p.obj === 'firma' && p.abuela.includes('El de los cables guarda el manual de esa máquina. Arréglale lo suyo.'), `nivel 2: «El de los cables guarda el manual…» (${p.obj} ${p.nivel}: ${p.abuela.join(' / ')})`);
    const vista = await capturaEn(() => { __game.game.state.room = 'catacumba'; __game.scene('pistas'); }, 'Apaga la regleta que no dice lo que es, y el de los cables te da el manual.', 'pista-manual');
    ok(vista && await logHas('Sistemas: el manual lo tiene Eutimio. Me lo da con su hueco, al apagar la R-3.'), 'nivel 3: «Apaga la regleta…» y Bruno: «Sistemas: el manual lo tiene Eutimio…» (captura)');
    await jugar([20, 21]);
    ok(await tiene('manual_fax'), '…y se puede: apagar la R-3 da el manual');
  }

  // ====================================================================== Pilar, Acto III, con el ratón
  step('Pilar en el Acto III: el hueco compartido de las tres cadenas; «Creo que sé dónde está tu 112.» siempre a la vista');
  await jugar([23, 24, 25, 26, 27, 28, 29]);
  await R.run(['ir', 'catacumba']); await idle();
  await jugar([36, 37, 38, 39, 40, 41, 42]);
  await guardar('t4_a3');
  {
    await R.run(['ir', 'eventos']); await idle();
    await clearLog();
    let o = await hablar('pilar_escaleta');
    ok(o.length === 6 && o.includes('Creo que sé dónde está tu 112.') && o.includes('¿Me prestas el álbum?') && o.includes('¿Qué ha pedido el ponente?')
      && !o.includes('¿Cuántos eventos habéis empezado este año?') && !o.includes('¿Para qué es el photocall?'), `Pilar, Acto III con la silla vista: seis, una sola de las cadenas (${o.join(' | ')})`);
    await shot('arbol-pilar-acto3');
    const iC = o.indexOf('¿Qué ha pedido el ponente?');
    await clicOpcion('¿Qué ha pedido el ponente?');
    o = fuera(await opciones());
    ok(o[iC] === '¿Y sin papel, cómo acreditas?', 'el ponente → «¿Y sin papel, cómo acreditas?» en el mismo hueco');
    for (const t of ['¿Y sin papel, cómo acreditas?', '¿Sabes que el plan es apagar la rotativa?', '¿Estás bien, Pilar?']) await clicOpcion(t);
    o = fuera(await opciones());
    ok(o[iC] === '¿Cuántos eventos habéis empezado este año?', 'agotado el ponente, en ese hueco salen los cinco minutos');
    await salir();
  }

  // ====================================================================== partida vieja: el álbum ya prestado
  step('Partida vieja con el álbum ya prestado: nada da por sabida la 112');
  {
    await cargar('t4_a3');
    await jugar([43]);
    await guardar('t4_album');
    await partidaVieja('t4_album', 't4_vieja', "for (const k of ['eventos_falta_112','eventos_acto3_entrada','silla_112_vista','pilar_nego_album','eventos_album_dado','eventos_croqueta']) delete st.flags[k];");
    ok(await flag('eventos_album_dado') === true && await flag('eventos_falta_112') === false && await flag('silla_112_vista') === false, 'cargada: álbum salvado, pero sin «falta la 112» ni la silla vista');
    const p = await abuela('eventos');
    ok(p.obj === 'baja', `la abuela manda a enseñar el álbum (${p.obj}: ${p.abuela.join(' / ')})`);
    await R.run(['ir', 'eventos']); await idle();
    const o = await hablar('pilar_escaleta');
    ok(!o.includes('¿Me prestas el álbum?') && !o.includes('Creo que sé dónde está tu 112.') && o.length <= 6, `Pilar no ofrece ni la negativa ni la 112 (${o.join(' | ')})`);
    await salir();
    ok(await terminar(44), 'se termina');
  }

  // ====================================================================== partidas viejas: opciones gastadas por posición
  step('Partidas viejas: las opciones gastadas que se guardaban por posición siguen gastadas');
  {
    await cargar('t4_a3');
    await guardar('t4_pos');
    await partidaVieja('t4_pos', 't4_pos2', "const d = st.dialogs; for (const k of Object.keys(d)) if (/^(aurora\\.A_MENU|custodia\\.CU0|inigo\\.I0)\\./.test(k)) delete d[k]; d['aurora.A_MENU.3'] = true; d['custodia.CU0.2'] = true; d['inigo.I0.0'] = true; st.objects = st.objects || {}; st.objects['catacumba.fax'] = { ...(st.objects['catacumba.fax'] || {}), state: 'faldon' };");
    const d = await G(() => __game.game.state.dialogs);
    ok(d['aurora.A_MENU.r02'] && d['custodia.CU0.buenas'] && d['inigo.I0.matriz'] && !d['aurora.A_MENU.3'], 'migración: «aurora.A_MENU.3» → r02, «custodia.CU0.2» → buenas, «inigo.I0.0» → matriz');
    ok(await G(() => __game.game.getObjState('fax', 'catacumba').state) === 'con_papel', 'el fax en el estado viejo del faldón vuelve a «con papel»');
    await R.run(['ir', 'catacumba']); await idle();
    const a = await hablar('aurora_galerada');
    ok(!a.includes('¿Por qué no se hablan usted y Teodoro?') && a.includes('¿Cómo convenzo a Teodoro?'), `Aurora: R02 ya gastada, sale «¿Cómo convenzo a Teodoro?» (${a.join(' | ')})`);
    await salir();
  }

  // ====================================================================== pista nueva: R05
  step('Pista nueva: la R05 («las cartas de todos»), Acto III, sin la réplica');
  {
    await cargar('t4_a3');
    await jugar([43, 44, 45, 46]);
    // (el D4 tiene cartas de más: la abuela solo habla de réplicas si las que sabe Bruno no llegan; sin estas cinco, la
    // primera que falta del mazo es la R05)
    await G(() => { const f = __game.game.state.flags; for (const k of ['rep_05', 'rep_16', 'rep_01', 'rep_07', 'rep_15']) f[k] = false; delete f.abuela_obj; delete f.abuela_nivel; });
    let p = await abuela('pajarera');
    p = await abuela('pajarera');
    ok(p.obj === 'inigo' && p.abuela.includes('El del mostrador de abajo sabe lo que se dice en las cartas de todos.'), `nivel 2: «El del mostrador de abajo sabe lo que se dice en las cartas de todos.» (${p.obj} ${p.nivel}: ${p.abuela.join(' / ')})`);
    await G(() => { const f = __game.game.state.flags; f.abuela_nivel = 1; });
    const vista = await capturaEn(() => { __game.game.state.room = 'pajarera'; __game.scene('pistas'); }, 'las cartas de todos', 'pista-r05');
    ok(vista, 'la R05 de la abuela, en la llamada (captura)');
    await G(() => { for (const k of ['rep_05', 'rep_16', 'rep_01', 'rep_07', 'rep_15']) __game.game.state.flags[k] = true; });
  }

  // ====================================================================== el armario 27 y la trituradora
  step('El armario 27 cerrado responde en todo su alto; la trituradora junto a la mesa de Pilar');
  {
    await nueva();
    await jugar(STEPS.map(s => s.n).slice(0, STEPS.map(s => s.n).indexOf(21)));
    await R.run(['ir', 'cpd']); await idle();
    const caja = await G(() => { const o = __game.objects().find(o => o.id === 'armario_27_bajo'); return o && { x: o.x, y: o.y, w: o.w, h: o.h, visible: o.visible }; });
    ok(caja && caja.visible && caja.y >= 70 && caja.y + caja.h >= 92, `la caja de abajo del armario 27 existe y llega a la rendija (${JSON.stringify(caja)})`);
    await clearLog();
    await clicVerbo('mirar');
    await verA('armario_27'); await sleep(60);
    const pt = await G(() => { const g = __game.game, o = __game.objects().find(o => o.id === 'armario_27_bajo'); const c = __game.screenPos('armario_27_bajo'); return { c, name: g.pickAt(o.x + o.w / 2 - Math.round(g.camX), o.y + o.h / 2) }; });
    await page.mouse.click(pt.c.x, pt.c.y); await sleep(150); await idle(); await seguir();
    ok(await logHas('Armario 27. Hace «ñiiic, ñiiic». Por debajo asoma papel continuo.'), 'clic de Mirar en el tercio de abajo: «Armario 27. Hace «ñiiic, ñiiic»…»');
    await G(() => __game.showHotspots(4000)); await verA('armario_27'); await sleep(300);
    await shot('armario27');
    await G(() => __game.showHotspots(0));
    await cargar('t4_a3');
    await R.run(['ir', 'eventos']); await idle();
    await verA('trituradora'); await sleep(300); await page.mouse.move(2, 2); await sleep(200);
    await shot('trituradora');
    const t = await G(() => { const a = __game.objects().find(o => o.id === 'trituradora'), m = __game.objects().find(o => o.id === 'mesa_acreditaciones'); return { a, m }; });
    ok(t.a && t.m && t.a.x >= t.m.x && t.a.x + t.a.w <= t.m.x + t.m.w && t.a.y - (t.m.y + t.m.h) <= 12, `la trituradora, delante de la mesa de acreditaciones (la de Pilar) y pegada a ella (${JSON.stringify(t)})`);
  }

  const errs = await G(() => __game.errors.filter(e => !e.warn).map(e => e.msg));
  ok(!errs.length, 'sin errores del motor ' + errs.join(' | '));
} catch (e) {
  failures++;
  console.log('\n  ✗ FALLO: ' + (e instanceof StepFail ? e.message : (e && e.stack) || e));
  try {
    const log = await G(() => __game.log.slice(-12).map(l => `${l.who || '—'}: ${l.text}`));
    console.log('    últimas líneas:\n      ' + log.join('\n      '));
    await shot('fallo');
  } catch (_) { /* ignore */ }
}
if (consoleErrors.length) { failures++; console.log('\nErrores de consola:\n  ' + consoleErrors.join('\n  ')); }
console.log(failures ? `\nGUION3-T4: FALLA (${failures} de ${checks})` : `\nGUION3-T4: OK (${checks} comprobaciones)`);
await browser.close();
server.close();
process.exit(failures ? 1 : 0);
