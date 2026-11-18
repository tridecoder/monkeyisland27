// "RESPONDER A TODOS" — data-driven verbal duel. See docs/CONTENT_SCHEMA.md §10 and docs/guion2/PLAN_COMEDIA.md §7.
//
// Rules implemented here (plan §7.1):
//  - only the rival attacks, with a fixed-order deck; a missed attack goes to the end of the deck. The attack is said
//    in a balloon («escribiendo…» in the window while it is said) AND then stays written in the window as
//    «Maripaz › Todos: «…»» (2 lines max) while the player chooses; Bruno's answer replaces it as «Tú › Todos: «…»».
//  - reply menu ≤ 5 lines, no scroll: the correct reply if learned + up to 3 other learned replies (first those of this
//    rival's deck, then any other learned one, as decoys) + exactly ONE weak reply that rotates per rival (the comodín
//    is part of that rotation). The position of the correct reply changes every round.
//  - hit = +1 (attack leaves the deck), the rival takes it with `hurtByPair[pair]` (string, list of lines or list of
//    [actor, line] pairs) or its rotating `hurt`; `onHit(api, ctl, pairId)`. On screen: one of the rival's dots goes
//    out, the frame flashes green, the rival steps back and a NOTIFICATION «Celestino: +1» drops into the phone
//    (`masUno[<duel id>]` of content/duelo.js, one per hit, in order).
//  - miss = one more "RE:" in the subject and somebody more in copy (`ccSteps`: rival's CC → «Toda la planta» →
//    «Toda la empresa»); the rival ALWAYS answers (taunt / its own weak answer) BEFORE the defeat is decided. On
//    screen: one of Bruno's dots goes out, red flash, the window shakes, Bruno steps back and «En copia: …» grows
//    (`enCopia` of the rival; by default the short form of `ccSteps`).
//  - finishers (remates) at given scores: replies greyed out, only [Usar objeto] / [Retirarse del hilo];
//    a wrong object only gets a line (not a miss).
//  - defeat (maxMisses): the rival's own `defeatLine` → `defeatLines` → `duel:<id>:perdido_n` + 1 → the rival's defeat
//    scene (`defeatScene` name or `onLose`) → optional `defeatHeadline` as a Titulator headline strip. Never fatal.
//    The rematch deck starts with the attack that won (flag `duel:<id>:empieza`).
//  - retiring = no consequence; the thread says «RV: Bruno ha abandonado el hilo.» and Bruno says `retireLine`.
//  - nothing is learned in a duel; points always restart from 0. No autosave while a duel is open; a save made during
//    a duel restarts that duel when it is loaded (core.js `load`).
//  - E6 §6.1 `cabe: { <pairId>: { max, corta, noCabe } }` (rival): with that pair learned, its attack offers the reply
//    twice, the long one (`pair.reply`, optionPairs 'larga') and the short one (`corta`, the winning one, correctIndex).
//    The long one NEVER counts as a miss: the body shows it cut at `max` chars + «—» for 1.2 s, the rival answers
//    (`noCabe` the 1st time, its `taunt` rotation afterwards) and the same attack comes again.
//  - E6 §6.2: the comodín carries the menu tag «COMODÍN» (`choose` option `{ text, tag }`).
//  - HUD (rediseño «Responder a todos», docs/guion2/duelo/DUELO_REDISENO.md + decisiones del director): Bruno's phone,
//    landscape, sliding up from the pocket (the fax of Talleres for `style: 'fax'`): app bar «Correo» + «En copia: …»;
//    a fighting-game header (the rival and «Tú», each with dots: `target` for the rival, `maxMisses` for Bruno; a hit
//    puts out a rival dot, a miss one of Bruno's) with what is at stake as a question in the middle (`pregunta`);
//    the body; in the first duel of the game a grey help line until the first hit. At the end the answer is STAMPED
//    on the window (`veredicto`: «LLAMA: MARIPAZ» green / «LLAMA: B. POLLEJO» red). Above the reply menu, the tab
//    «LIBRETA · réplicas oídas por la casa». The old «RE:», CC, «Asignado a» and «ACIERTOS 2/3 · FALLOS 1/3» are
//    still computed (duelInfo.subject / cc / assigned / score) but no longer drawn.
//  - [P7] aprender perdiendo (`D.pistas` de content/duelo.js: { flag, aviso, repaso, de(pair) }): se entra siempre, sepa
//    Bruno las réplicas que sepa. Cada ataque recibido sin su réplica apunta en la libreta (bit de la pareja en el flag
//    `pistas.flag`, en el orden de `pairs`) dónde se aprende (`de(pair)`): la primera vez, aviso `pistas.aviso`; mientras
//    el menú está abierto, la pista se ve en un pósit sobre la pestaña LIBRETA. Al perder, si alguna pista de este mazo
//    sigue apuntada, Bruno dice `pistas.repaso`. Las pistas se borran al aprender la réplica (api.learnReply).
//  - [P8] `aTiempo.rapido: { tramos, pausa }`: en cuanto un ataque se ha escrito entero sin que Bruno le pise, los
//    siguientes llegan en `tramos` tramos (los trozos del final, juntos) y con las pausas × `pausa`; si Bruno le pisa,
//    ese ataque vuelve al ritmo lento (trozos y pausas de siempre) hasta que lo deje acabar.
//  - staging: `puesta(api, ctl)` (before the window opens: walk the rival to where it is seen whole) and
//    `recoger(api, result, ctl)` (lost / retired, right after the window closes); `sostener` = what the rival holds
//    during the thread (Bruno holds his phone, except by fax).
import { drawText, measure, wrap, citar } from './font.js';
import { rect, hline, vline, frameRect, px } from './draw.js';
import { getFrame } from './sprites.js';
import { SFX as PHONE_SFX, rrect } from './phone.js';

const asArray = x => x == null ? [] : Array.isArray(x) ? x : [x];
/** «En copia: …» en corto (los `ccSteps` largos de siempre). */
const CC_CORTO = { 'Colchones Siestatón': 'Siestatón', 'Toda la planta': 'la planta', 'Toda la empresa': 'toda la empresa',
  'Optimal Brains & Partners': 'Optimal', 'Sus tres móviles': 'sus tres móviles' };
const ccCorto = (t) => CC_CORTO[t] || t;
export const MAX_REPLY_OPTIONS = 4;          // correct + 3 decoys; + 1 weak = 5 lines
export const OPTION_W = 288;                 // width of a menu line (engine/ui.js choiceLayout)
export const COMODIN_TAG = 'COMODÍN';        // E6 §6.2: etiqueta del comodín en el menú (micro, gris, a la derecha)
export const LARGA_MS = 1200;                // E6 §6.1: lo que se ve cortado en el cuerpo tras elegir la réplica larga
export const TROZO_MS = 1300;
export const SLIDE_MS = 380;                 // el móvil sale del bolsillo (el fax baja) antes del primer ataque
export const VEREDICTO_MS = 1500;            // lo que dura el sello del veredicto sobre la ventana
export const TOAST_MS = 2200;                // la notificación «Celestino: +1»
const FX_MS = 450;                           // destello del marco (verde / rojo)
const SELLO = [{ wave: 'noise', dur: 0.09, vol: 0.32, filter: { type: 'lowpass', freq: 900 } }, { wave: 'square', f: [110, 55], dur: 0.12, vol: 0.13 }];                // E7 `aTiempo`: lo mínimo entre trozo y trozo (game.timedMs lo sube si no da para leerlo)
/** E7 `aTiempo`: lo que dice Bruno al ser cortado: hasta el primer signo (. , : ; ? !) o las tres primeras palabras, + «...». */
export function cortada(t) {
  const s = String(t).replace(/^[¡¿«"]+/, '');
  const m = s.match(/^[^.,:;?!]+/);
  const w = s.split(/\s+/).slice(0, 3).join(' ');
  const base = (m && m[0].length <= w.length ? m[0] : w).replace(/[.,:;?!…\s]+$/, '');
  return base + '...';
}

/** Lines a duel datum may hold: 'line' (rival) · ['line', 'line'] (rival) · [who, line] · [[who, line], ...].
 *  `who` = 'player' | 'narrator' | 'rival' | 'obj:<object>' | an actor id. */
function linesOf(v, isWho) {
  if (v == null) return [];
  if (typeof v === 'string') return [['rival', v]];
  if (Array.isArray(v) && v.length === 2 && typeof v[0] === 'string' && typeof v[1] === 'string' && isWho(v[0])) return [v];
  if (Array.isArray(v)) return v.flatMap(x => (Array.isArray(x) ? [x] : [['rival', x]]));
  return [];
}

export async function runDuel(game, api, idOrDef) {
  const D = game.content.duels;
  const opp = typeof idOrDef === 'object' ? idOrDef : D.opponents[idOrDef];
  const id = typeof idOrDef === 'object' ? (idOrDef.id || 'duelo') : idOrDef;
  if (!opp) { game.error('Duelo desconocido: ' + idOrDef); return false; }
  const T = { to: 'Todos', useObject: '[Usar objeto]', retire: '[Retirarse del hilo]', pickPrompt: 'Adjuntar al hilo:',
    defeatPrefix: 'RV: ', defeatCc: 'Toda la empresa', defeatAssigned: 'Vacante', notReady: null, defeatLine: null,
    app: 'Correo', faxApp: 'FAX · TALLERES', you: 'Tú', enCopia: 'En copia:', escribiendo: 'escribiendo', libreta: null, ayuda: null,
    ccSteps: ['Toda la planta', 'Toda la empresa'], retireThread: { from: 'RV:', text: 'Bruno ha abandonado el hilo.' }, ...(D.texts || {}) };
  const pairs = new Map((D.pairs || []).map(p => [p.id, p]));
  const pairOrder = (D.pairs || []).map(p => p.id);
  const flags = game.state.flags;
  const learned = () => (D.pairs || []).filter(p => flags[p.flag]);
  const actorId = opp.actor || id;
  const oppActor = game.actors[actorId];
  const fromName = opp.from || (oppActor && oppActor.name) || id;
  const deck0 = asArray(opp.deck).filter(p => { if (!pairs.has(p)) game.error(`duelo ${id}: pareja desconocida ${p}`); return pairs.has(p); });
  const deck = deck0.slice();
  // rule 9 (rematch): the deck starts with the attack that won last time
  const first = flags['duel:' + id + ':empieza'];
  if (first && deck.includes(first)) while (deck[0] !== first) deck.push(deck.shift());
  const finishers = asArray(opp.finishers).slice().sort((a, b) => a.atScore - b.atScore);
  const target = finishers.length ? finishers[finishers.length - 1].atScore : (opp.winScore || 3);
  const maxMisses = opp.maxMisses || 3;
  const fax = opp.style === 'fax';
  const rot = { hurt: 0, taunt: 0 };
  const next = (k) => { const l = asArray(opp[k]); return l.length ? l[rot[k]++ % l.length] : null; };
  // CC that grows with every miss: rival's own CC (`ccSteps[0]` or `cc1`) → «Toda la planta» → «Toda la empresa»
  const ccSteps = asArray(opp.ccSteps).length ? asArray(opp.ccSteps) : [opp.cc1, ...T.ccSteps].filter(Boolean);
  const defs = game.content.actors || {};
  const rivalName = opp.fromShort || (defs[actorId] && defs[actorId].name) || fromName;
  const playerId = game.G.player || 'bruno';
  // «En copia: …» que crece con cada fallo (en corto) y quién da cada «+1» (content/duelo.js `masUno`: ids de actor o { name, color })
  const enCopia = (asArray(opp.enCopia).length ? asArray(opp.enCopia) : ccSteps.map(ccCorto)).slice(0, maxMisses);
  const masUno = asArray((D.masUno || {})[id]).map(q => (typeof q === 'string' ? { name: (defs[q] && defs[q].name) || q, color: defs[q] && defs[q].color } : q));
  const ver = opp.veredicto || {};
  const veredicto = (ok) => `${ver.verbo || 'ASIGNADO'}: ${ok ? (ver.gana || rivalName.toUpperCase()) : (ver.pierde || String(opp.assigned || T.defeatAssigned).toUpperCase())}`;

  // ---- shared duel state (read by the HUD, the test API and finisher scripts)
  const S = {
    id, phase: 'intro', hits: 0, misses: 0, re: opp.re ?? 1, subject: opp.subject || '', cc: opp.cc || null, ccExtra: [],
    assigned: opp.assigned || 'Vacante', from: fromName, to: opp.to || T.to, style: fax ? 'fax' : 'mail',
    thread: null, result: null, finIdx: 0, body: null, target, maxMisses, round: 0,
    // rediseño: lo que se pinta (el resto de S sigue para duelInfo y las pruebas)
    actorId, playerId, rivalName, pregunta: opp.pregunta || opp.subject || '', tecleando: false, sender: 'rival', mine: null,
    toast: null, fx: null, t0: game.time, copia: [], veredicto: null, ayuda: !flags['duel:ayuda'], T,
  };
  const info = game.duelInfo = {
    id, opponent: actorId, phase: 'intro', attack: null, options: null, optionPairs: null, correctIndex: -1, weakIndex: -1, correctItem: null, body: null,
    escribiendo: false, interrumpeN: 0,             // E7 `aTiempo`
    veredicto: null,                                // rediseño: el texto del sello al terminar («LLAMA: MARIPAZ»)
    get hits() { return S.hits; }, get misses() { return S.misses; }, get subject() { return subjectText(S); }, get assigned() { return S.assigned; },
    get cc() { return ccText(S); }, get score() { return scoreText(S); }, target, maxMisses,
  };
  const ctl = {   // handed to finisher scripts, onHit and onLose
    get hits() { return S.hits; }, get misses() { return S.misses; }, get perdidos() { return flags['duel:' + id + ':perdido_n'] || 0; },
    get remates() { return S.finIdx; },             // remates ya resueltos (para un `hurtByPair` que dependa de ellos)
    setAssigned: (t) => { S.assigned = t; }, setSubject: (t) => { S.subject = t; }, setCc: (t) => { S.cc = t; S.ccExtra = []; },
    setBody: (t) => { S.body = t; },
    // una línea del hilo (cameos, retirada): como NOTIFICACIÓN en el móvil, «Nombre: texto»
    thread: (from, text, ms = 3200) => { toast(String(from).replace(/:$/, ''), text, null, game.timedMs('hilo', `${from} ${text}`, ms)); },
    hide: () => { game.hud = null; }, show: () => { game.hud = hud; },
  };

  const inRoom = (who) => { const a = game.actors[who]; return !!(a && game.room && a.room === game.room.def.id); };
  const say = async (who, line) => {
    if (line == null) return;
    if (Array.isArray(line)) { [who, line] = line; }
    if (who === 'player') await api.say(line);
    else if (who === 'narrator') await api.narrate(line);
    else if (who === 'rival' || who === actorId) { if (opp.say) await opp.say(api, line); else await api.sayAs(actorId, line); }
    else if (typeof who === 'string' && who.startsWith('obj:')) await api.sayFrom(who.slice(4), line);
    else if (inRoom(who)) await api.sayAs(who, line);          // another actor (Rubén in D4) only if he is in the room
  };
  const isWho = (w) => ['player', 'narrator', 'rival'].includes(w) || w.startsWith('obj:') || !!game.actors[w];
  const sayList = async (list) => { for (const [w, l] of linesOf(list, isWho)) await say(w, l); };

  function toast(name, text, color, ms = TOAST_MS) { S.toast = { name, text, color: color || '#9cf0a4', t0: game.time, ms }; }
  /** Paso atrás de quien encaja el golpe: se aparta del otro (engine/core.js drawActor lo dibuja desplazado). */
  const retroceso = (who, other) => {
    const a = game.actors[who], o = game.actors[other];
    if (!a || !game.room || a.room !== game.room.def.id || game.instant) return;
    a.retro = { t0: game.time, ms: 460, dx: (o && o.x > a.x ? -3 : 3) };
  };
  const yoSostengo = { player: false, rival: false };
  const soltar = () => {
    if (yoSostengo.player) { api.sostener(playerId, null); yoSostengo.player = false; }
    if (yoSostengo.rival) { api.sostener(actorId, null); yoSostengo.rival = false; }
  };
  const prevMusic = game.audio.requestedId ?? game.audio.currentId;
  const music = opp.music !== undefined ? opp.music : D.music;
  const hud = (g) => drawHud(g, game, S);
  game.inDialog = (game.inDialog || 0) + 1;
  const activo = game.duelActive = { id };
  const gen0 = game.gen;
  let tl = null;                                  // E7 `aTiempo`: la escritura en curso { done, cancel }
  const vivo = () => game.duelActive === activo && game.gen === gen0;
  const paraEscritura = () => {
    if (tl) tl.cancel = true;
    if (S.escribiendo) { S.escribiendo = null; info.escribiendo = false; if (opp.aTiempo && opp.aTiempo.sostener) api.sostener(actorId, null); }
  };
  let won = false;
  try {
    if (music) api.music(music, 0.6);
    // [P7] ya no hay aviso de «faltan réplicas» al entrar: se aprende perdiendo (pistas en la libreta)
    await sayList(opp.intro);
    // el rival, a la vista y de frente (D1: Maripaz rodea la mesa); los dos con el aparato en la mano
    if (opp.puesta) await opp.puesta(api, ctl);
    if (!fax) { api.sostener(playerId, 'movil'); yoSostengo.player = true; }
    if (opp.sostener) { api.sostener(actorId, opp.sostener); yoSostengo.rival = true; }
    // el móvil sale del bolsillo (o el fax baja por la ranura) y ya está abierto cuando llega el primer ataque
    S.t0 = game.time;
    game.hud = hud; game.hudTop = hudBottom(S) + 3;
    api.sfx(fax ? 'paper' : PHONE_SFX.pick);
    await game.sleep(SLIDE_MS);
    let guard = 0;
    while (guard++ < 300) {
      // ---- finisher pending?
      const fin = finishers[S.finIdx];
      if (fin && S.hits >= fin.atScore) {
        const r = await runFinisher(fin);
        if (r === 'retire') { S.result = 'retired'; break; }
        if (r === 'won') { S.result = 'won'; break; }
        continue;                    // finisher solved, duel continues
      }
      if (!finishers.length && S.hits >= target) { S.result = 'won'; break; }
      if (!deck.length) { S.result = S.hits >= target ? 'won' : 'lost'; break; }
      // ---- rival attacks with the first card of the deck; the attack stays written in the window
      const pid = deck[0], pair = pairs.get(pid);
      const attack = (opp.attackText && opp.attackText[pid]) || pair.attack;
      info.phase = 'reply'; info.attack = pid; S.phase = 'reply';
      let tz = opp.aTiempo && opp.aTiempo.trozos && asArray(opp.aTiempo.trozos[pid]);
      // [P8] tras un ataque escrito entero sin pisarle, en `tramos` tramos y con pausas más cortas (salvo el que le pisó)
      const RA = opp.aTiempo && opp.aTiempo.rapido;
      const rapido = !!(RA && tz && tz.length > 1 && S.enteroOido && S.lentoPid !== pid);
      if (rapido) { const n = Math.max(1, RA.tramos || 2); if (tz.length > n) tz = tz.slice(0, n - 1).concat([tz.slice(n - 1).join(' ')]); }
      const pausa = rapido ? (RA.pausa ?? 0.6) : 1;
      info.rapido = rapido; info.tramos = tz && tz.length ? tz.length : 0;
      S.sender = 'rival'; S.mine = null;
      if (tz && tz.length) {
        // E7 `aTiempo`: el globo dice el primer trozo; el resto se escribe en el cuerpo mientras el menú está abierto
        S.cola = true; S.body = tz[0]; info.body = tz[0];
        await say('rival', tz[0]);
        llega();
        tl = { done: tz.length < 2 || game.instant, cancel: false };
        if (tl.done) {
          S.body = tz.join(' '); info.body = S.body;
          if (tz.length > 1) S.enteroOido = true;
          // (modo rápido: la frase entera, de golpe; va al log como aviso igual que cuando acaba de escribirse)
          if (tz.length > 1) game.log.push({ who: 'aviso', name: fromName, text: S.body, room: game.state && game.state.room, t: Math.round(game.time) });
        }
        else {
          const yo = tl, A = opp.aTiempo;
          S.escribiendo = A.escribiendo || '...'; info.escribiendo = true;
          if (A.sostener) api.sostener(actorId, A.sostener);
          (async () => {
            for (let k = 1; k < tz.length; k++) {
              await game.sleep(Math.round(game.timedMs('duelo', tz[k], A.ms || TROZO_MS) * pausa));
              if (yo.cancel || !vivo()) return;
              S.body = tz.slice(0, k + 1).join(' '); info.body = S.body; api.sfx('click');
            }
            if (yo.cancel || !vivo()) return;
            yo.done = true; S.escribiendo = null; info.escribiendo = false; S.enteroOido = true;
            if (A.sostener) api.sostener(actorId, null);
            game.log.push({ who: 'aviso', name: fromName, text: S.body, room: game.state && game.state.room, t: Math.round(game.time) });
          })();
        }
      } else {
        S.cola = false; tl = null;
        S.body = attack; info.body = attack;
        S.tecleando = true;                       // «Maripaz › Todos: escribiendo…» mientras lo dice
        try { await say('rival', attack); } finally { S.tecleando = false; }
        llega();
      }
      apuntarPista(pid);                              // [P7] sin la réplica: dónde se aprende, a la libreta
      const opts = buildMenu(pid);
      info.options = opts.map(o => o.text);
      // E6 §6.1 (b): con `cabe`, la larga dice 'larga' y `correctIndex` apunta a la corta (la que gana)
      info.optionPairs = opts.map(o => o.kind === 'larga' ? 'larga' : (o.pair || (o.kind === 'weak' ? 'floja' : o.kind)));
      info.correctIndex = opts.findIndex(o => o.pair === pid && o.kind === 'reply');
      info.weakIndex = opts.findIndex(o => o.kind === 'weak' || o.kind === 'comodin');
      // E6 §6.2: el comodín lleva la etiqueta «COMODÍN» en el menú (solo se pinta; lo que se dice es `text`)
      const i = await game.choose(opts.map(o => o.kind === 'comodin' ? { text: o.text, tag: COMODIN_TAG } : o.text), { duel: true });
      const ch = opts[Math.max(0, i)];
      info.options = null; info.optionPairs = null; info.correctIndex = -1; info.weakIndex = -1;
      if (tl && !tl.done) {
        // E7 `aTiempo`: ha contestado mientras el rival escribía. No es fallo: ni RE:, ni CC, ni mazo, ni comodín, ni ronda.
        paraEscritura(); tl = null;
        S.interrumpeN = (S.interrumpeN || 0) + 1; info.interrumpeN = S.interrumpeN; info.phase = 'interrumpido';
        S.lentoPid = pid;                           // [P8] le ha pisado: este ataque vuelve al ritmo lento
        await say('player', cortada(ch.text));
        await say('rival', S.interrumpeN === 1 && opp.aTiempo.interrumpe ? opp.aTiempo.interrumpe : next('taunt'));
        info.phase = 'reply';
        continue;                                   // el mismo ataque, desde el primer trozo
      }
      tl = null;
      if (S.lentoPid === pid) S.lentoPid = null;      // [P8] lo ha dejado acabar: vuelve el ritmo que tocara
      S.pista = null;
      S.round++;
      S.sender = 'player'; S.mine = ch.text;          // «Tú › Todos: «…»» mientras Bruno lo dice
      await say('player', ch.text);
      if (ch.kind === 'larga') {
        // E6 §6.1 (c): la réplica larga no cabe. Nunca suma fallo: ni `misses`, ni RE:, ni CC, ni se mueve el mazo.
        // El fax (o el correo) enseña 1,2 s lo que cabe, cortado a `max` caracteres; el rival contesta y repite el ataque.
        const cb = ch.cabe;
        api.sfx('paper');
        const cut = (fax ? ch.text.toUpperCase() : ch.text).slice(0, cb.max) + '—';
        S.body = cut; info.body = cut; info.phase = 'larga'; S.mine = cut;
        await api.wait(LARGA_MS);
        S.body = attack; info.body = attack; info.phase = 'reply'; S.sender = 'rival'; S.mine = null;
        S.largaN = (S.largaN || 0) + 1;
        info.largaN = S.largaN;
        await say('rival', S.largaN === 1 && cb.noCabe ? cb.noCabe : next('taunt'));
        continue;
      }
      if (ch.kind === 'reply' && ch.pair === pid) {
        S.hits++; deck.shift(); api.sfx('good');
        // en pantalla: un punto del rival se apaga, el marco destella en verde, el rival da un paso atrás y entra el «+1»
        S.fx = { k: 'hit', t0: game.time };
        const q = masUno[(S.hits - 1) % Math.max(1, masUno.length)];
        if (q) { toast(q.name, '+1', q.color); api.sfx(PHONE_SFX.ding); }
        retroceso(actorId, playerId);
        flags['duel:ayuda'] = true;                     // la ayuda del primer duelo se va con el primer acierto
        if (opp.onHit) await opp.onHit(api, ctl, pid);
        const pending = finishers[S.finIdx];
        const ending = (!finishers.length && S.hits >= target) || (pending && S.hits >= pending.atScore);
        // §7.6: `hurtByPair` (rival or duelo.js) beats the `hurt` rotation; may make another actor speak
        let hp = (opp.hurtByPair && opp.hurtByPair[pid]) || (D.hurtByPair && D.hurtByPair[id] && D.hurtByPair[id][pid]);
        if (typeof hp === 'function') hp = hp(ctl) || null;      // una reacción que depende del duelo (p. ej. de los remates)
        if (!ending || hp) await sayList(hp || next('hurt'));
        const cam = D.cameos && D.cameos[id];
        if (cam && S.hits === 1 && api.once('cameo:' + id)) {
          const cd = defs[cam.quien];
          toast(cam.from || (cd && cd.name) || cam.quien, cam.text, cd && cd.color, game.timedMs('hilo', cam.text, cam.ms || 3200));
          api.sfx(PHONE_SFX.ding);
        }
        continue;
      }
      if (ch.kind === 'comodin' && !S.comodinUsed) {
        S.comodinUsed = true;
        await say('rival', fax && D.comodin.answerFax ? D.comodin.answerFax : (opp.comodinAnswer || D.comodin.answer));
        continue;                    // same attack again, no score change
      }
      // ---- miss: one more RE:, somebody more in copy, the rival ALWAYS answers before the defeat is decided
      S.misses++; S.re++; deck.push(deck.shift()); api.sfx('bad');
      // en pantalla: un punto de Bruno se apaga, destello rojo y temblor, Bruno da un paso atrás y entra más gente en copia
      S.fx = { k: 'miss', t0: game.time }; S.copia = enCopia.slice(0, S.misses);
      retroceso(playerId, actorId);
      const step = ccSteps[Math.min(S.misses, ccSteps.length) - 1];
      if (step && !S.ccExtra.includes(step) && step !== S.cc) S.ccExtra.push(step);
      if (ch.kind === 'weak') {
        const own = opp.weakAnswers && opp.weakAnswers[ch.w.text];
        const ans = own || (ch.w.answers && ch.w.answers[id]) || (fax && ch.w.answerFax) || ch.w.answer;
        // una contestación de varias líneas (['línea 1', 'línea 2']) la dice entera el rival; [who, line] sigue valiendo
        if (Array.isArray(ans) && ans.every(x => typeof x === 'string') && !isWho(ans[0])) { for (const l of ans) await say('rival', l); }
        else await say('rival', ans);
      } else if (ch.kind === 'comodin') await say('rival', D.comodin.again);
      else await say('rival', next('taunt'));
      if (S.misses >= maxMisses) { S.result = 'lost'; S.lostTo = pid; break; }
    }
    won = S.result === 'won';
    info.phase = 'end'; S.phase = 'end'; info.body = null;
    flags['duel:ayuda'] = true;                       // la ayuda solo sale en el primer duelo de la partida
    // el veredicto: lo que estaba en juego, estampado sobre la ventana (verde si gana Bruno, rojo si pierde)
    const sellar = async (ok) => {
      S.veredicto = { text: veredicto(ok), ok, t0: game.time }; info.veredicto = S.veredicto.text;
      api.sfx(SELLO); api.sfx(ok ? 'good' : 'bad');
      game.shake(140, 1);
    };
    if (won) {
      S.assigned = opp.assignedWin || fromName;
      await sellar(true);
      await api.wait(VEREDICTO_MS);
      game.hud = null; game.hudTop = 0; soltar();
      api.setFlag('duel:' + id + ':won', true);
      delete flags['duel:' + id + ':empieza'];
      if (opp.onWin) await opp.onWin(api, ctl);
    } else if (S.result === 'retired') {
      if (T.retireThread) {
        ctl.thread(T.retireThread.from, T.retireThread.text, 2400);
        game.log.push({ who: 'aviso', name: null, text: `${T.retireThread.from} ${T.retireThread.text}`, room: game.state && game.state.room, t: Math.round(game.time) });
      }
      // crítica 3 · N7: Bruno lo dice (una línea; la del rival `retireLine` manda sobre la común `texts.retireLine`)
      const rl = opp.retireLine !== undefined ? opp.retireLine : T.retireLine;
      if (rl) await say('player', rl);
      await api.wait(900);
      game.hud = null; game.hudTop = 0; soltar();
      if (opp.recoger) await opp.recoger(api, 'retired', ctl);
      if (opp.onLose) await opp.onLose(api, ctl, 'retired');
    } else {
      S.defeat = true; S.ccExtra = []; S.cc = T.defeatCc; S.assigned = T.defeatAssigned; S.copia = enCopia.slice();
      await sellar(false);
      await api.wait(VEREDICTO_MS - 300);
      // §7.7: the rival's own automatic answer (`defeatLine`: string = narrator caption, or [who, line])
      const dl = opp.defeatLine !== undefined ? opp.defeatLine : T.defeatLine;
      if (dl) await sayList(typeof dl === 'string' ? [['narrator', dl]] : dl);
      await api.wait(500);
      game.hud = null; game.hudTop = 0; soltar();
      if (opp.recoger) await opp.recoger(api, 'lost', ctl);
      if (S.lostTo) flags['duel:' + id + ':empieza'] = S.lostTo;
      const n = api.inc('duel:' + id + ':perdido_n');
      await sayList(opp.defeatLines);
      if (opp.defeatScene) await api.scene(opp.defeatScene, { duel: id, perdidos: n, ctl });
      if (opp.onLose) await opp.onLose(api, ctl, 'lost');
      const head = typeof opp.defeatHeadline === 'function' ? opp.defeatHeadline(n, api) : opp.defeatHeadline;
      // crítica 3 · N10: el titular de la derrota es del Titulator, no de Bruno (registro: who 'titulator')
      if (head) await api.titular(head, { from: opp.headlineFrom || 'titulator' });
      // [P7] Bruno repasa: le faltaban réplicas de este mazo y están apuntadas en la libreta
      const PL = D.pistas;
      if (PL && PL.repaso && deck0.some(p => !flags[pairs.get(p).flag] && pistaApuntada(p))) await say('player', PL.repaso);
    }
    game.lastDuel = { id, result: S.result, hits: S.hits, misses: S.misses, perdidos: flags['duel:' + id + ':perdido_n'] || 0 };
    return won;
  } finally {
    paraEscritura();                                // E7 `aTiempo`: ninguna escritura sobrevive al duelo
    if (vivo()) soltar();
    game.inDialog = Math.max(0, (game.inDialog || 1) - 1);
    game.hud = null; game.hudTop = 0;
    game.duelInfo = null; game.duelActive = null; game.duelVista = null; game.duelCaja = null;
    game.finDialogo = game.time;                      // crítica 3 · N6: margen del ambiente (engine/efectos.js)
    if (music) api.music(prevMusic || null, 0.8);
  }

  /** [P7] ¿Está apuntada en la libreta la pista de la pareja `p`? (bit de su orden en `pairs`) */
  function pistaApuntada(p) {
    const PL = D.pistas, b = pairOrder.indexOf(p);
    return !!(PL && b >= 0 && (Number(flags[PL.flag]) || 0) & (1 << b));
  }
  /** [P7] Ataque recibido sin su réplica: apunta en la libreta dónde se aprende (aviso la primera vez) y la enseña en
   *  el pósit de la pestaña mientras el menú está abierto. */
  function apuntarPista(pid) {
    const PL = D.pistas, pair = pairs.get(pid);
    S.pista = null; info.pista = null;
    if (!PL || flags[pair.flag]) return;
    const txt = typeof PL.de === 'function' ? PL.de(pair) : null;
    if (!txt) return;
    S.pista = txt; info.pista = txt;
    if (pistaApuntada(pid)) return;
    flags[PL.flag] = (Number(flags[PL.flag]) || 0) | (1 << pairOrder.indexOf(pid));
    if (PL.aviso) game.notice(PL.aviso, { color: PL.color });
  }

  /** El correo del rival acaba de llegar: «¡ding!» y un sobre junto a cada presente (en el fax, el papel). */
  function llega() {
    if (fax) { api.sfx('paper'); return; }
    api.sfx(PHONE_SFX.ding);
    sobres(game, { ms: 900, excluir: [actorId] });
  }

  /** §7.1.3: correct (if learned) + ≤ 3 learned decoys (this deck first) + 1 rotating weak reply (or the comodín). */
  function buildMenu(pid) {
    const L = learned().map(p => p.id);
    const correct = L.includes(pid) ? [pid] : [];
    const rank = (x) => { const k = deck0.indexOf(x); return k >= 0 ? k : 100 + pairOrder.indexOf(x); };
    const decoys = L.filter(x => x !== pid).sort((a, b) => rank(a) - rank(b)).slice(0, MAX_REPLY_OPTIONS - correct.length);
    let reps = correct.concat(decoys).sort((a, b) => rank(a) - rank(b));
    if (reps.length > 1) { const k = S.round % reps.length; reps = reps.slice(k).concat(reps.slice(0, k)); }   // the correct one moves
    let opts = reps.map(p => ({ text: pairs.get(p).reply, pair: p, kind: 'reply' }));
    // E6 §6.1 (a): `opp.cabe[pid]` = { max, corta, noCabe }. Si la correcta está aprendida, sale dos veces: la larga
    // (`pair.reply`, kind 'larga') y la corta (`corta`, kind 'reply', la que gana). Larga primero en rondas pares.
    const cb = opp.cabe && opp.cabe[pid];
    if (cb && correct.length) {
      const larga = { text: pairs.get(pid).reply, pair: pid, kind: 'larga', cabe: cb };
      const corta = { text: cb.corta, pair: pid, kind: 'reply' };
      opts = opts.flatMap(o => o.pair === pid ? (S.round % 2 === 0 ? [larga, corta] : [corta, larga]) : [o]);
    }
    const pool = asArray(D.weakReplies).filter(w => !w.only || asArray(w.only).includes(id)).map(w => ({ text: w.text, kind: 'weak', w }));
    if (D.comodin && !(S.comodinUsed && pool.length)) pool.push({ text: D.comodin.text, kind: 'comodin' });
    if (pool.length) {
      const k = 'duel:' + id + ':floja';
      const n = flags[k] || 0;
      flags[k] = n + 1;
      opts.push(pool[n % pool.length]);
    }
    // ≤ 5 LINES without scroll (a long reply wraps to two): decoys go first, never the correct one or the weak one
    const lines = () => opts.reduce((n, o) => n + wrap(o.text, OPTION_W).length, 0);
    while (lines() > 5) {
      const j = opts.map((o, i) => (o.kind === 'reply' && o.pair !== pid ? i : -1)).filter(i => i >= 0).pop();   // never the larga
      if (j == null) break;
      opts.splice(j, 1);
    }
    return opts;
  }

  async function runFinisher(fin) {
    S.phase = 'finisher'; info.phase = 'finisher'; info.attack = null; info.correctItem = fin.object || null;
    S.body = fin.text; info.body = fin.text; S.sender = 'rival'; S.mine = null;
    S.tecleando = true;
    try { await say('rival', fin.text); } finally { S.tecleando = false; }
    llega();
    for (let g2 = 0; g2 < 100; g2++) {
      const greyed = learned().map(p => ({ text: p.reply, disabled: true })).slice(0, 3);
      const opts = greyed.concat([{ text: T.useObject }, { text: T.retire }]);
      info.options = opts.map(o => o.text);
      info.correctIndex = greyed.length;
      const i = await game.choose(opts, { duel: true });
      info.options = null;
      if (i === greyed.length + 1) return 'retire';
      if (i !== greyed.length) continue;
      info.phase = 'pick';
      const item = await game.pickItem(T.pickPrompt);
      info.phase = 'finisher';
      if (!item) continue;
      if (item === fin.object) {
        S.finIdx++;
        info.phase = 'finisher-script';
        if (fin.script) await fin.script(api, ctl);
        const last = S.finIdx >= finishers.length;
        return (fin.end ?? last) ? 'won' : 'continue';
      }
      const W = D.wrongObject || {};
      const key = opp.wrongObjectKey || id;
      const line = (fin.wrongObject && fin.wrongObject[item]) || (opp.wrongObject && opp.wrongObject[item])
        || (W[key] && W[key][item]) || (fin.wrongObject && fin.wrongObject['*']) || (opp.wrongObject && opp.wrongObject['*']) || (W[key] && W[key]['*']) || W['*'] || '...';
      await say('rival', line);
    }
    return 'retire';
  }
}

function subjectText(S) {
  return (S.defeat ? 'RV: ' : '') + 'RE: '.repeat(Math.max(0, S.re)) + S.subject;
}
function ccText(S) { return [S.cc, ...S.ccExtra].filter(Boolean).join(', '); }
export function scoreText(S) { return `ACIERTOS ${Math.min(S.hits, S.target)}/${S.target} · FALLOS ${Math.min(S.misses, S.maxMisses)}/${S.maxMisses}`; }

function fit(text, maxW, o = {}) {
  if (measure(text, o) <= maxW) return text;
  let t = text;
  while (t.length > 3 && measure(t + '...', o) > maxW) t = t.slice(0, -1);
  return t.trimEnd() + '...';
}

// ------------------------------------------------------------------ dibujo (rediseño «Responder a todos»)
/** Colores de la ventana: el móvil (correo) y el fax de Talleres. tools/contrast.mjs comprueba `PARES_CONTRASTE`. */
export const COL = {
  mail: { body: '#17151f', bodyHi: '#4c4a62', bodyLo: '#0c0b12', screen: '#10142a', bar: '#22305a', barLine: '#4a6ab0', barText: '#ffffff',
    text: '#e8ecf8', rival: '#ffe9a8', mine: '#a8e0ff', label: '#9aa4c8', pregunta: '#ffe070', copia: '#ff9a8a', line: '#2a3460',
    dotOn: '#ffffff', dotOff: '#3a4268', toastBg: '#eef2fb', toastText: '#141a30', hit: '#5cff70', miss: '#ff4a3a', you: '#a8e0ff' },
  fax: { body: '#c9bd9c', bodyHi: '#f4ecd6', bodyLo: '#8a7e62', screen: '#e8dfc6', bar: '#d6cbae', barLine: '#92856e', barText: '#2a2218',
    text: '#2a2218', rival: '#3a2a10', mine: '#1e3a6a', label: '#564c3e', pregunta: '#7a1e18', copia: '#7a1e18', line: '#b0a284',
    dotOn: '#2a2218', dotOff: '#b8aa8c', toastBg: '#f6f0de', toastText: '#2a2218', hit: '#1e8a3a', miss: '#c8302a', you: '#1e3a6a' },
  sello: { ok: '#4ae070', okBg: '#06140a', no: '#ff5a48', noBg: '#1a0604' },
  libreta: { bg: '#1c1834', edge: '#4a4470', text: '#c8bce8' },
  pista: { bg: '#f2e08a', edge: '#8a6a18', text: '#2a1e08', sombra: '#000000' },     // [P7] el pósit de la libreta
};
export const PARES_CONTRASTE = [
  ['duelo: barra «Correo» / En copia', COL.mail.barText, COL.mail.bar], ['duelo: en copia', COL.mail.copia, COL.mail.bar],
  ['duelo: pregunta', COL.mail.pregunta, COL.mail.screen], ['duelo: ataque', COL.mail.rival, COL.mail.screen],
  ['duelo: réplica de Bruno («Tú»)', COL.mail.mine, COL.mail.screen], ['duelo: escribiendo / ayuda', COL.mail.label, COL.mail.screen],
  ['duelo: texto', COL.mail.text, COL.mail.screen], ['duelo: notificación', COL.mail.toastText, COL.mail.toastBg],
  ['fax: barra', COL.fax.barText, COL.fax.bar], ['fax: en copia', COL.fax.copia, COL.fax.bar], ['fax: pregunta', COL.fax.pregunta, COL.fax.screen],
  ['fax: ataque', COL.fax.rival, COL.fax.screen], ['fax: réplica', COL.fax.mine, COL.fax.screen], ['fax: etiqueta', COL.fax.label, COL.fax.screen],
  ['fax: notificación', COL.fax.toastText, COL.fax.toastBg],
  ['duelo: sello ganado', COL.sello.ok, COL.sello.okBg], ['duelo: sello perdido', COL.sello.no, COL.sello.noBg],
  ['duelo: pestaña LIBRETA', COL.libreta.text, COL.libreta.bg],
  ['duelo: pista apuntada (pósit)', COL.pista.text, COL.pista.bg],
];

const ease = {
  outBack: (k) => { const c1 = 0.9, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); },
  outCubic: (k) => 1 - Math.pow(1 - k, 3),
};
// geometría (px de pantalla): el móvil apaisado ocupa la franja de arriba; debajo, la sala entera a la vista
const WX = 3, WY = 1, WW = 314;
const BEZ_L = 10, BEZ_R = 8, BEZ_V = 3;
const ROW_BAR = 10, ROW_VS = 12, ROW_BODY = 20, ROW_AYUDA = 11;
/** Alto de la ventana: barra + marcador + separador + cuerpo (2 líneas) + la línea de ayuda (solo el primer duelo). */
const winH = (S) => BEZ_V * 2 + ROW_BAR + 1 + ROW_VS + 1 + ROW_BODY + 2 + (S.ayuda ? ROW_AYUDA : 0);
/** La y del borde inferior de la ventana (sin la animación de entrada). */
export function hudBottom(S) { return WY + winH(S); }

/** Un punto del marcador (5×5): encendido = vida, apagado = gastada. `flash` = se acaba de apagar. */
function dot(g, cx, cy, on, col, off, flash) {
  const pat = ['.###.', '#####', '#####', '#####', '.###.'];
  if (flash) { rect(g, cx - 3, cy - 1, 7, 3, flash); rect(g, cx - 1, cy - 3, 3, 7, flash); }   // el que se acaba de apagar: estalla
  for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) {
    if (pat[r][c] !== '#') continue;
    const ring = r === 0 || r === 4 || c === 0 || c === 4;
    if (on) px(g, cx - 2 + c, cy - 2 + r, col);
    else if (ring || flash) px(g, cx - 2 + c, cy - 2 + r, flash || off);
  }
  if (on) px(g, cx - 1, cy - 1, '#ffffff');
}
/** Cabeza del actor (recorte de su sprite, 12×10), para el marcador. */
const topes = new WeakMap();
function cabeza(g, game, id, x, y) {
  const a = game.actors[id];
  if (!a) return;
  try {
    const cv = getFrame(game.spriteOf(a), 'idle', 'down', 0).canvas;
    let top = topes.get(cv);
    if (top == null) {                       // primera fila con algo pintado (el pelo)
      const d = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data;
      top = 0;
      outer: for (let yy = 0; yy < cv.height; yy++) for (let xx = 0; xx < cv.width; xx++) if (d[(yy * cv.width + xx) * 4 + 3] > 0) { top = yy; break outer; }
      topes.set(cv, top);
    }
    const w = Math.min(12, cv.width - 2);
    g.drawImage(cv, Math.max(0, ((cv.width - w) >> 1)), top + 2, w, 10, x, y, w, 10);   // del pelo a la boca
  } catch (e) { /* sin sprite: sin cabeza */ }
}

/** Ventana del duelo: el móvil de Bruno (apaisado) con la app de correo, o el fax de Talleres. */
function drawHud(g, game, S) {
  const fax = S.style === 'fax';
  const C = fax ? COL.fax : COL.mail;
  const T = S.T || {};
  const t = game.time;
  const h = winH(S);
  game.hudTop = WY + h + 3;
  game.duelPositTop = null;
  // entrada: el móvil sube desde abajo (del bolsillo); el fax baja por la ranura
  const k = Math.max(0, Math.min(1, (t - S.t0) / SLIDE_MS));
  let oy = fax ? Math.round(-(h + 4) * (1 - ease.outCubic(k))) : Math.round((200 - WY) * (1 - ease.outBack(k)));
  const fx = S.fx && t - S.fx.t0 < FX_MS ? S.fx.k : null;
  const sacudida = S.fx && S.fx.k === 'miss' && t - S.fx.t0 < 260 ? (Math.floor((t - S.fx.t0) / 45) % 2 ? 1 : -1) : 0;
  const x = WX + sacudida, y = WY + oy, w = WW;
  game.duelCaja = { x: WX, y: WY, w: WW, h };
  // ---- cuerpo del aparato
  if (fax) {
    rect(g, x, y, w, h, C.screen);
    for (let i = y + 3; i < y + h - 2; i += 6) { rect(g, x + 3, i, 3, 3, C.bodyLo); rect(g, x + w - 6, i, 3, 3, C.bodyLo); }   // agujeros del papel continuo
    vline(g, x + 8, y, h, C.line); vline(g, x + w - 9, y, h, C.line);
    frameRect(g, x - 1, y - 1, w + 2, h + 2, '#4e463c');
  } else {
    g.save(); g.globalAlpha = 0.45; rrect(g, x + 2, y + 2, w, h, '#000000', 4); g.restore();
    rrect(g, x, y, w, h, C.body, 4);
    hline(g, x + 4, y + 1, w - 8, C.bodyHi); vline(g, x + 1, y + 4, h - 8, C.bodyHi); hline(g, x + 4, y + h - 2, w - 8, C.bodyLo);
    rect(g, x + 3, y + (h >> 1) - 8, 2, 16, '#08070c');                       // altavoz (móvil en horizontal)
    rect(g, x + 4, y + 5, 3, 3, '#08070c'); px(g, x + 5, y + 6, '#3a4a90');  // cámara
    rect(g, x + 60, y - 1, 14, 1, '#5a5870'); rect(g, x + 80, y - 1, 8, 1, '#5a5870');   // botones
  }
  const sx = x + BEZ_L, sy = y + BEZ_V, sw = w - BEZ_L - BEZ_R, sh = h - BEZ_V * 2;
  if (!fax) rect(g, sx, sy, sw, sh, C.screen);
  // golpe: el borde de la pantalla destella (verde acierto, rojo fallo)
  if (fx) { frameRect(g, sx - 1, sy - 1, sw + 2, sh + 2, fx === 'hit' ? C.hit : C.miss); frameRect(g, x - 1, y - 1, w + 2, h + 2, fx === 'hit' ? C.hit : C.miss); }
  g.save(); g.beginPath(); g.rect(sx, sy, sw, sh); g.clip();
  // ---- barra de la app: [sobre] Correo ........ En copia: Siestatón, la planta [batería]
  rect(g, sx, sy, sw, ROW_BAR, C.bar); hline(g, sx, sy + ROW_BAR, sw, C.barLine);
  const ix = sx + 3, iy = sy + 2;
  if (fax) { rect(g, ix, iy, 6, 7, '#fff8e8'); hline(g, ix + 1, iy + 2, 4, '#8a7a5a'); hline(g, ix + 1, iy + 4, 4, '#8a7a5a'); }
  else { rect(g, ix, iy + 1, 9, 6, '#e8f0ff'); for (let q = 0; q < 4; q++) { px(g, ix + 1 + q, iy + 2 + q, '#22305a'); px(g, ix + 7 - q, iy + 2 + q, '#22305a'); } }
  const app = fax ? T.faxApp : T.app;
  drawText(g, app, ix + 12, sy - 1, C.barText, { outline: null, bold: true });
  let bx = sx + sw - 4;
  if (!fax) {                                                                // batería casi muerta (la de siempre)
    bx -= 11; rect(g, bx, sy + 3, 9, 5, C.barText); rect(g, bx + 1, sy + 4, 7, 3, '#10101a'); rect(g, bx + 1, sy + 4, 1, 3, '#ff5040'); rect(g, bx + 9, sy + 4, 1, 3, C.barText);
    for (let q = 0; q < 4; q++) rect(g, bx - 10 + q * 2, sy + 8 - q * 2, 1, 1 + q * 2, q < 3 ? C.barText : '#4a5070');
    bx -= 17;
  }
  if (S.copia && S.copia.length) {
    const x0 = ix + 12 + measure(app, { bold: true }) + 10;
    const nuevo = fx === 'miss';
    const txt = fit(`${T.enCopia} ${S.copia.join(', ')}`, bx - x0);
    drawText(g, txt, bx, sy - 1, nuevo ? (fax ? C.copia : '#ffd0c8') : C.copia, { outline: null, align: 'right', bold: nuevo });
  }
  // ---- marcador de duelo: [cabeza] Maripaz ●●●   ¿Quién llama a Siestatón?   ●●● Tú [cabeza]
  const vy = sy + ROW_BAR + 1;
  const ra = game.actors[S.actorId], pa = game.actors[S.playerId];
  const brunoIzq = !ra || !pa || pa.x <= ra.x;
  const lados = [
    { id: S.playerId, name: T.you, col: C.you, n: S.maxMisses, out: Math.min(S.defeat ? S.maxMisses : S.misses, S.maxMisses), flash: fx === 'miss' && C.miss },
    { id: S.actorId, name: S.rivalName, col: fax ? C.label : ((game.content.actors[S.actorId] || {}).color || C.rival), n: S.target, out: Math.min(S.hits, S.target), flash: fx === 'hit' && C.hit },
  ];
  if (!brunoIzq) lados.reverse();
  const anchoLado = [0, 0];
  lados.forEach((L, i) => {
    const izq = i === 0;
    const nw = measure(L.name, { bold: true });
    const dotsW = L.n * 7 - 2;
    const total = 12 + 3 + nw + 4 + dotsW;
    anchoLado[i] = total;
    let cx = izq ? sx + 3 : sx + sw - 3 - total;
    const piezas = izq ? ['cab', 'nom', 'dots'] : ['dots', 'nom', 'cab'];
    for (const p of piezas) {
      if (p === 'cab') { cabeza(g, game, L.id, cx, vy + 1); cx += 15; }
      else if (p === 'nom') { drawText(g, L.name, cx, vy, L.col, { outline: null, bold: true }); cx += nw + 4; }
      else {
        // las vidas se gastan desde dentro (el lado del centro) hacia fuera, como la barra de un juego de lucha
        for (let d = 0; d < L.n; d++) {
          const idx = izq ? L.n - 1 - d : d;          // posición contada desde el centro
          const on = idx >= L.out;
          dot(g, cx + 2 + d * 7, vy + 6, on, L.col, C.dotOff, L.flash && !on && idx === L.out - 1 ? L.flash : null);
        }
        cx += dotsW + 3;
      }
    }
  });
  // lo que se ve, para las pruebas (tools/test-duelo-ui.mjs): puntos, pregunta, copia, notificación, sello, ayuda
  const lado = (id) => { const L = lados.find(q => q.id === id); return { total: L.n, apagados: L.out, izquierda: lados[0] === L }; };
  game.duelVista = {
    style: S.style, rival: lado(S.actorId), bruno: lado(S.playerId), pregunta: S.pregunta, app: fax ? T.faxApp : T.app,
    copia: S.copia && S.copia.length ? `${T.enCopia} ${S.copia.join(', ')}` : null,
    remitente: (S.sender === 'player' && S.mine) ? T.you : S.rivalName, tecleando: !!S.tecleando, escribiendo: !!S.escribiendo,
    notificacion: S.toast && t - S.toast.t0 < S.toast.ms && !S.veredicto ? `${S.toast.name}: ${S.toast.text}` : null,
    destello: fx, veredicto: S.veredicto ? { text: S.veredicto.text, ok: S.veredicto.ok } : null,
    ayuda: !!(S.ayuda && T.ayuda && S.hits === 0 && !S.veredicto), libreta: !!(game.choice && S.phase === 'reply' && T.libreta && !S.veredicto),
    pista: (game.choice && S.phase === 'reply' && S.pista && !S.veredicto) ? S.pista : null,
    caja: { x: WX, y: WY, w: WW, h }, entrando: k < 1,
  };
  const qx0 = sx + 3 + anchoLado[0] + 8, qx1 = sx + sw - 3 - anchoLado[1] - 8;
  const preg = fit(S.pregunta, qx1 - qx0, { bold: true });
  drawText(g, preg, Math.round((qx0 + qx1) / 2), vy, C.pregunta, { outline: null, bold: true, align: 'center' });
  hline(g, sx + 2, vy + ROW_VS, sw - 4, C.line);
  // ---- cuerpo: «Maripaz › Todos: escribiendo…» / «Maripaz › Todos: «ataque»» / «Tú › Todos: «réplica»»
  const by = vy + ROW_VS + 1;
  const mine = S.sender === 'player' && S.mine;
  const who = `${mine ? T.you : S.rivalName} › ${S.to}:`;
  const whoCol = mine ? C.mine : lados.find(L => L.id === S.actorId).col;
  drawText(g, who, sx + 3, by, whoCol, { outline: null, bold: true });
  const tx = sx + 3 + measure(who, { bold: true }) + 4, bodyW = sx + sw - 3 - tx;
  const puntos = '.'.repeat(1 + Math.floor(t / 400) % 3);
  if (!mine && S.tecleando) drawText(g, T.escribiendo + puntos, tx, by, C.label, { outline: null });
  else {
    const txt = mine ? S.mine : S.body;
    let lines = txt ? wrap(citar(txt), bodyW) : [];
    if (lines.length > 2) lines = (S.cola && !mine) ? ['...' + lines[lines.length - 2], lines[lines.length - 1]] : [lines[0], fit(lines.slice(1).join(' '), bodyW)];
    lines.forEach((l, i) => drawText(g, l, tx, by + i * 10, mine ? C.mine : C.rival, { outline: null }));
    if (!mine && S.escribiendo) {
      // E7 `aTiempo`: sigue escribiendo, detrás de lo que lleva escrito (o en la línea de abajo)
      const e = S.escribiendo + puntos, last = lines.length ? lines[lines.length - 1] : '';
      const ex = tx + measure(last) + 6;
      if (lines.length && ex + measure(S.escribiendo + '...') <= sx + sw - 3) drawText(g, e, ex, by + (lines.length - 1) * 10, C.label, { outline: null });
      else if (lines.length < 2) drawText(g, e, tx, by + lines.length * 10, C.label, { outline: null });
      else drawText(g, e, sx + sw - 3, by + 10, C.label, { outline: null, align: 'right' });
    }
  }
  // ---- la ayuda del primer duelo de la partida (hasta el primer acierto)
  if (S.ayuda && T.ayuda && S.hits === 0 && !S.veredicto) drawText(g, T.ayuda, sx + 3, by + ROW_BODY, C.label, { outline: null });
  if (!fax) grieta(g, sx + sw - 1, sy + sh - 1);
  // ---- la notificación «Celestino: +1» (cae desde arriba de la pantalla, como en un móvil)
  if (S.toast && t - S.toast.t0 < S.toast.ms && !S.veredicto) {
    const N = S.toast, age = t - N.t0;
    const txt = fit(`${N.name}: ${N.text}`, sw - 30);
    const nw = measure(txt) + 18, nh = 13;
    const enter = Math.min(1, age / 150), leave = Math.max(0, (age - (N.ms - 150)) / 150);
    const ny = Math.round(sy + 1 - (nh + 3) * (1 - ease.outCubic(enter)) - (nh + 3) * leave);
    const nx = Math.round(sx + (sw - nw) / 2);
    rect(g, nx, ny, nw, nh, C.toastBg);
    frameRect(g, nx, ny, nw, nh, N.color || C.hit);
    rect(g, nx + 4, ny + 3, 5, 5, N.color || C.hit);
    drawText(g, txt, nx + 12, ny, C.toastText, { outline: null });
  }
  g.restore();
  // ---- el veredicto: la respuesta a la pregunta, estampada con un golpe de sello
  if (S.veredicto) {
    const V = S.veredicto, age = t - V.t0;
    const sc = age < 110 ? 1 + 1.3 * (1 - age / 110) : 1;
    const col = V.ok ? COL.sello.ok : COL.sello.no, bg = V.ok ? COL.sello.okBg : COL.sello.noBg;
    const tw = measure(V.text, { bold: true }) * 2 + 16, th = 34;
    g.save();
    g.translate(Math.round(x + w / 2), Math.round(y + h / 2));
    g.rotate(-0.06); g.scale(sc, sc);
    if (age < 110) g.globalAlpha = Math.max(0.2, age / 110);
    g.globalAlpha *= 0.92; rect(g, -tw / 2, -th / 2, tw, th, bg); g.globalAlpha = age < 110 ? Math.max(0.2, age / 110) : 1;
    frameRect(g, -tw / 2, -th / 2, tw, th, col); frameRect(g, -tw / 2 + 2, -th / 2 + 2, tw - 4, th - 4, col); frameRect(g, -tw / 2 + 3, -th / 2 + 3, tw - 6, th - 6, col);
    drawText(g, V.text, 0, -th / 2 + 3, col, { outline: null, bold: true, scale: 2, align: 'center' });
    g.restore();
  }
  // ---- la pestaña de la libreta, encima del menú de réplicas
  if (game.choice && S.phase === 'reply' && T.libreta && !S.veredicto) {
    const L = COL.libreta, tw2 = measure(T.libreta) + 10;
    rect(g, 2, 134, tw2, 10, L.bg); frameRect(g, 2, 134, tw2, 11, L.edge); rect(g, 3, 143, tw2 - 2, 2, L.bg);
    drawText(g, T.libreta, 7, 132, L.text, { outline: null });
    // [P7] sin la réplica de este ataque: la pista apuntada (dónde se aprende), en un pósit pegado encima de la pestaña
    if (S.pista) {
      const P = COL.pista, ls = wrap(S.pista, 296).slice(0, 3);
      const pw = Math.max(...ls.map(l => measure(l))) + 10, ph = ls.length * 10 + 3, py = 133 - ph;
      g.save(); g.globalAlpha = 0.5; rect(g, 4, py + 2, pw, ph, P.sombra); g.restore();
      rect(g, 2, py, pw, ph, P.bg); frameRect(g, 2, py, pw, ph, P.edge);
      rect(g, 2, py, 3, ph, P.edge);                                           // el filo engomado del pósit
      ls.forEach((l, i) => drawText(g, l, 8, py - 1 + i * 10, P.text, { outline: null }));
      game.duelPositTop = py;
    }
  }
}

/** La pantalla rota de siempre (la del móvil de las llamadas), en la esquina de abajo a la derecha. */
function grieta(g, x, y) {
  const c1 = '#d8def0', c2 = '#7d86a8';
  for (const [a, b, c, d, col] of [[0, 0, -9, -5, c1], [0, 0, -4, -8, c2], [-5, -3, -12, -4, c2], [-3, -5, -5, -9, c1]]) {
    const n = Math.max(Math.abs(c - a), Math.abs(d - b));
    for (let i = 0; i <= n; i++) px(g, Math.round(x + a + (c - a) * i / n), Math.round(y + b + (d - b) * i / n), col);
  }
}

// ------------------------------------------------------------------ el «¡ding!» en la sala y el paso atrás
/** Un sobre parpadea junto a cada presente de la sala (menos `excluir`): el correo «a todos» ha llegado. */
export function sobres(game, opts = {}) {
  if (!game.room || game.instant) return;
  game.sobres = { t0: game.time, ms: opts.ms || 900, excluir: asArray(opts.excluir) };
}
export function drawSobres(g, game) {
  const Sb = game.sobres, t = game.time;
  if (!Sb || t - Sb.t0 > Sb.ms || !game.room) { game.sobres = null; return; }
  if (Math.floor((t - Sb.t0) / 150) % 2) return;
  const cam = Math.round(game.camX || 0), top = game.hud ? game.hudTop : 0;
  for (const a of Object.values(game.actors)) {
    if (a.room !== game.room.def.id || !a.visible || Sb.excluir.includes(a.id)) continue;
    const b = game.actorBox(a);
    let ex = Math.round(b.x + b.w / 2) - cam - 4, ey = Math.round(b.y) - 9;
    if (ey < top) { ex = Math.round(b.x + b.w) - cam + 1; ey = Math.max(top, Math.round(b.y) + 1); }   // con la ventana abierta, al lado de la cabeza
    rect(g, ex - 1, ey - 1, 11, 8, '#2a1c04');
    rect(g, ex, ey, 9, 6, '#ffe070');
    for (let q = 0; q < 4; q++) { px(g, ex + 1 + q, ey + 1 + q, '#8a5a10'); px(g, ex + 7 - q, ey + 1 + q, '#8a5a10'); }
  }
}
/** Desplazamiento (px) del paso atrás de `a.retro` = { t0, ms, dx }: sale rápido, se queda y vuelve. */
export function retroOffset(game, a) {
  const R = a.retro, k = (game.time - R.t0) / R.ms;
  if (!(k >= 0) || k >= 1) { a.retro = null; return 0; }
  const f = k < 0.2 ? k / 0.2 : k < 0.55 ? 1 : 1 - (k - 0.55) / 0.45;
  return Math.round(R.dx * f);
}
