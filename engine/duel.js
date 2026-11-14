// "RESPONDER A TODOS" — data-driven verbal duel. See docs/CONTENT_SCHEMA.md §10 and docs/guion2/PLAN_COMEDIA.md §7.
//
// Rules implemented here (plan §7.1):
//  - only the rival attacks, with a fixed-order deck; a missed attack goes to the end of the deck. The attack is said
//    in a balloon AND stays written in the mail window as «Cuerpo: «…»» (2 lines max) while the player chooses.
//  - reply menu ≤ 5 lines, no scroll: the correct reply if learned + up to 3 other learned replies (first those of this
//    rival's deck, then any other learned one, as decoys) + exactly ONE weak reply that rotates per rival (the comodín
//    is part of that rotation). The position of the correct reply changes every round.
//  - hit = +1 (attack leaves the deck), the rival takes it with `hurtByPair[pair]` (string, list of lines or list of
//    [actor, line] pairs) or its rotating `hurt`; `onHit(api, ctl, pairId)`. A «+1» line enters the thread.
//  - miss = one more "RE:" in the subject and somebody more in copy (`ccSteps`: rival's CC → «Toda la planta» →
//    «Dirección»); the rival ALWAYS answers (taunt / its own weak answer) BEFORE the defeat is decided.
//  - finishers (remates) at given scores: replies greyed out, only [Usar objeto] / [Retirarse del hilo];
//    a wrong object only gets a line (not a miss).
//  - defeat (maxMisses): the rival's own `defeatLine` → `defeatLines` → `duel:<id>:perdido_n` + 1 → the rival's defeat
//    scene (`defeatScene` name or `onLose`) → optional `defeatHeadline` as a Titulator headline strip. Never fatal.
//    The rematch deck starts with the attack that won (flag `duel:<id>:empieza`).
//  - retiring = no consequence; the thread says «RV: Bruno ha abandonado el hilo.».
//  - nothing is learned in a duel; points always restart from 0. No autosave while a duel is open; a save made during
//    a duel restarts that duel when it is loaded (core.js `load`).
//  - HUD = mail window (63 px): De / Para / CC · Asunto (RE: RE: ...) · Cuerpo · Asignado a · «ACIERTOS 2/3 · FALLOS 1/3».
import { drawText, measure, wrap } from './font.js';
import { rect, hline, frameRect } from './draw.js';

const asArray = x => x == null ? [] : Array.isArray(x) ? x : [x];
export const MAX_REPLY_OPTIONS = 4;          // correct + 3 decoys; + 1 weak = 5 lines
export const OPTION_W = 288;                 // width of a menu line (engine/ui.js choiceLayout)

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
    defeatPrefix: 'RV: ', defeatCc: 'Dirección', defeatAssigned: 'Vacante', plusOne: null, notReady: null, defeatLine: null,
    ccSteps: ['Toda la planta', 'Dirección'], retireThread: { from: 'RV:', text: 'Bruno ha abandonado el hilo.' }, ...(D.texts || {}) };
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
  // CC that grows with every miss: rival's own CC (`ccSteps[0]` or `cc1`) → «Toda la planta» → «Dirección»
  const ccSteps = asArray(opp.ccSteps).length ? asArray(opp.ccSteps) : [opp.cc1, ...T.ccSteps].filter(Boolean);

  // ---- shared duel state (read by the HUD, the test API and finisher scripts)
  const S = {
    id, phase: 'intro', hits: 0, misses: 0, re: opp.re ?? 1, subject: opp.subject || '', cc: opp.cc || null, ccExtra: [],
    assigned: opp.assigned || 'Vacante', from: fromName, to: opp.to || T.to, style: fax ? 'fax' : 'mail',
    thread: null, result: null, finIdx: 0, body: null, target, maxMisses, round: 0,
  };
  const info = game.duelInfo = {
    id, opponent: actorId, phase: 'intro', attack: null, options: null, optionPairs: null, correctIndex: -1, weakIndex: -1, correctItem: null, body: null,
    get hits() { return S.hits; }, get misses() { return S.misses; }, get subject() { return subjectText(S); }, get assigned() { return S.assigned; },
    get cc() { return ccText(S); }, get score() { return scoreText(S); }, target, maxMisses,
  };
  const ctl = {   // handed to finisher scripts, onHit and onLose
    get hits() { return S.hits; }, get misses() { return S.misses; }, get perdidos() { return flags['duel:' + id + ':perdido_n'] || 0; },
    setAssigned: (t) => { S.assigned = t; }, setSubject: (t) => { S.subject = t; }, setCc: (t) => { S.cc = t; S.ccExtra = []; },
    setBody: (t) => { S.body = t; },
    thread: (from, text, ms = 3200) => { S.thread = { from, text, until: game.realTime + game.timedMs('hilo', `${from} ${text}`, ms) }; },
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

  const prevMusic = game.audio.requestedId ?? game.audio.currentId;
  const music = opp.music !== undefined ? opp.music : D.music;
  const hud = (g) => drawHud(g, game, S);
  game.inDialog = (game.inDialog || 0) + 1;
  game.duelActive = { id };
  let won = false;
  try {
    if (music) api.music(music, 0.6);
    // rule 11: fair warning when Bruno does not know enough replies of this deck
    const known = deck.filter(p => flags[pairs.get(p).flag]).length;
    if (T.notReady && known < Math.min(target, deck.length)) await say('player', T.notReady);
    await sayList(opp.intro);
    game.hud = hud; game.hudTop = 66;   // drawHud adjusts it to the window height
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
      S.body = attack; info.body = attack;
      await say('rival', attack);
      const opts = buildMenu(pid);
      info.options = opts.map(o => o.text);
      info.optionPairs = opts.map(o => o.pair || (o.kind === 'weak' ? 'floja' : o.kind));
      info.correctIndex = opts.findIndex(o => o.pair === pid);
      info.weakIndex = opts.findIndex(o => o.kind === 'weak' || o.kind === 'comodin');
      const i = await game.choose(opts.map(o => o.text), { duel: true });
      const ch = opts[Math.max(0, i)];
      info.options = null; info.optionPairs = null; info.correctIndex = -1; info.weakIndex = -1;
      S.round++;
      await say('player', ch.text);
      if (ch.kind === 'reply' && ch.pair === pid) {
        S.hits++; deck.shift(); api.sfx('good');
        if (T.plusOne) ctl.thread(T.plusOne.from, T.plusOne.text);
        if (opp.onHit) await opp.onHit(api, ctl, pid);
        const pending = finishers[S.finIdx];
        const ending = (!finishers.length && S.hits >= target) || (pending && S.hits >= pending.atScore);
        // §7.6: `hurtByPair` (rival or duelo.js) beats the `hurt` rotation; may make another actor speak
        const hp = (opp.hurtByPair && opp.hurtByPair[pid]) || (D.hurtByPair && D.hurtByPair[id] && D.hurtByPair[id][pid]);
        if (!ending || hp) await sayList(hp || next('hurt'));
        const cam = D.cameos && D.cameos[id];
        if (cam && S.hits === 1 && api.once('cameo:' + id)) ctl.thread(cam.from, cam.text, cam.ms);
        continue;
      }
      if (ch.kind === 'comodin' && !S.comodinUsed) {
        S.comodinUsed = true;
        await say('rival', fax && D.comodin.answerFax ? D.comodin.answerFax : (opp.comodinAnswer || D.comodin.answer));
        continue;                    // same attack again, no score change
      }
      // ---- miss: one more RE:, somebody more in copy, the rival ALWAYS answers before the defeat is decided
      S.misses++; S.re++; deck.push(deck.shift()); api.sfx('bad');
      const step = ccSteps[Math.min(S.misses, ccSteps.length) - 1];
      if (step && !S.ccExtra.includes(step) && step !== S.cc) S.ccExtra.push(step);
      if (ch.kind === 'weak') {
        const own = opp.weakAnswers && opp.weakAnswers[ch.w.text];
        await say('rival', own || (ch.w.answers && ch.w.answers[id]) || (fax && ch.w.answerFax) || ch.w.answer);
      } else if (ch.kind === 'comodin') await say('rival', D.comodin.again);
      else await say('rival', next('taunt'));
      if (S.misses >= maxMisses) { S.result = 'lost'; S.lostTo = pid; break; }
    }
    won = S.result === 'won';
    info.phase = 'end'; S.phase = 'end'; S.body = null; info.body = null;
    if (won) {
      S.assigned = opp.assignedWin || fromName;
      api.sfx('good');
      await api.wait(900);
      game.hud = null; game.hudTop = 0;
      api.setFlag('duel:' + id + ':won', true);
      delete flags['duel:' + id + ':empieza'];
      if (opp.onWin) await opp.onWin(api, ctl);
    } else if (S.result === 'retired') {
      if (T.retireThread) ctl.thread(T.retireThread.from, T.retireThread.text, 2400);
      await api.wait(900);
      game.hud = null; game.hudTop = 0;
      if (opp.onLose) await opp.onLose(api, ctl, 'retired');
    } else {
      S.defeat = true; S.ccExtra = []; S.cc = T.defeatCc; S.assigned = T.defeatAssigned;
      // §7.7: the rival's own automatic answer (`defeatLine`: string = narrator caption, or [who, line])
      const dl = opp.defeatLine !== undefined ? opp.defeatLine : T.defeatLine;
      if (dl) await sayList(typeof dl === 'string' ? [['narrator', dl]] : dl);
      await api.wait(700);
      game.hud = null; game.hudTop = 0;
      if (S.lostTo) flags['duel:' + id + ':empieza'] = S.lostTo;
      const n = api.inc('duel:' + id + ':perdido_n');
      await sayList(opp.defeatLines);
      if (opp.defeatScene) await api.scene(opp.defeatScene, { duel: id, perdidos: n, ctl });
      if (opp.onLose) await opp.onLose(api, ctl, 'lost');
      const head = typeof opp.defeatHeadline === 'function' ? opp.defeatHeadline(n, api) : opp.defeatHeadline;
      if (head) await api.titular(head, { from: opp.headlineFrom });
    }
    game.lastDuel = { id, result: S.result, hits: S.hits, misses: S.misses, perdidos: flags['duel:' + id + ':perdido_n'] || 0 };
    return won;
  } finally {
    game.inDialog = Math.max(0, (game.inDialog || 1) - 1);
    game.hud = null; game.hudTop = 0;
    game.duelInfo = null; game.duelActive = null;
    if (music) api.music(prevMusic || null, 0.8);
  }

  /** §7.1.3: correct (if learned) + ≤ 3 learned decoys (this deck first) + 1 rotating weak reply (or the comodín). */
  function buildMenu(pid) {
    const L = learned().map(p => p.id);
    const correct = L.includes(pid) ? [pid] : [];
    const rank = (x) => { const k = deck0.indexOf(x); return k >= 0 ? k : 100 + pairOrder.indexOf(x); };
    const decoys = L.filter(x => x !== pid).sort((a, b) => rank(a) - rank(b)).slice(0, MAX_REPLY_OPTIONS - correct.length);
    let reps = correct.concat(decoys).sort((a, b) => rank(a) - rank(b));
    if (reps.length > 1) { const k = S.round % reps.length; reps = reps.slice(k).concat(reps.slice(0, k)); }   // the correct one moves
    const opts = reps.map(p => ({ text: pairs.get(p).reply, pair: p, kind: 'reply' }));
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
      const j = opts.map((o, i) => (o.kind === 'reply' && o.pair !== pid ? i : -1)).filter(i => i >= 0).pop();
      if (j == null) break;
      opts.splice(j, 1);
    }
    return opts;
  }

  async function runFinisher(fin) {
    S.phase = 'finisher'; info.phase = 'finisher'; info.attack = null; info.correctItem = fin.object || null;
    S.body = fin.text; info.body = fin.text;
    await say('rival', fin.text);
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

function fit(text, maxW) {
  if (measure(text) <= maxW) return text;
  let t = text;
  while (t.length > 3 && measure(t + '...') > maxW) t = t.slice(0, -1);
  return t.trimEnd() + '...';
}

/** Mail (or fax) window at the top of the room view: 63 px with the attack written in «Cuerpo». */
function drawHud(g, game, S) {
  const fax = S.style === 'fax';
  const C = fax
    ? { bg: '#e8dfc6', bar: '#b4a68a', barText: '#3a3020', label: '#564c3e', text: '#2a2218', line: '#92856e', edge: '#4e463c', assign: '#952a24', win: '#1e5a2a', body: '#3a2a10', miss: '#952a24' }
    : { bg: '#141a30', bar: '#2c5098', barText: '#e8f0ff', label: '#94a6d4', text: '#e8ecf8', line: '#26305c', edge: '#06080f', assign: '#f2d468', win: '#9cf0a4', body: '#ffe9a8', miss: '#ff9a8a' };
  const x = 4, y = 2, w = 312;
  const subjW = w - measure('Asunto:') - 12;
  let subj = wrap(subjectText(S), subjW);
  if (subj.length > 1) subj = [fit(subj.join(' '), subjW)];       // one line: the body needs the room
  const bodyW = w - measure('Cuerpo:') - 12;
  let body = S.body ? wrap('«' + S.body + '»', bodyW) : [];
  if (body.length > 2) body = [body[0], fit(body.slice(1).join(' '), bodyW)];
  const h = 63;
  game.hudTop = y + h + 3;
  g.save(); g.globalAlpha = fax ? 0.97 : 0.94; rect(g, x, y, w, h, C.bg); g.restore();
  frameRect(g, x - 1, y - 1, w + 2, h + 2, C.edge);
  rect(g, x, y, w, 10, C.bar);
  if (fax) { for (let i = x + 2; i < x + w - 2; i += 6) rect(g, i, y + 4, 2, 1, C.line); }
  drawText(g, fax ? 'FAX · TALLERES' : 'RESPONDER A TODOS', x + 3, y - 1, C.barText, { outline: null, bold: !fax });
  // score as text (rule 12), right of the title bar
  const sc = scoreText(S);
  drawText(g, sc, x + w - 4, y - 1, fax ? C.barText : '#ffffff', { outline: null, align: 'right' });
  const row = (yy, label, value, col) => {
    drawText(g, label, x + 4, yy, C.label, { outline: null });
    const lw = measure(label) + 4;
    drawText(g, fit(value, w - lw - 8), x + 4 + lw, yy, col || C.text, { outline: null });
  };
  const cc = ccText(S);
  row(y + 9, 'De:', S.from + '   Para: ' + S.to + (cc ? '   CC: ' + cc : ''));
  row(y + 19, 'Asunto:', subj[0]);
  drawText(g, 'Cuerpo:', x + 4, y + 29, C.label, { outline: null });
  body.forEach((l, i) => drawText(g, l, x + 8 + measure('Cuerpo:'), y + 29 + i * 9, C.body, { outline: null }));
  hline(g, x + 3, y + 49, w - 6, C.line);
  drawText(g, 'Asignado a:', x + 4, y + 50, C.label, { outline: null });
  const lw = measure('Asignado a:') + 5;
  const won = S.result === 'won';
  drawText(g, fit(S.assigned, 150), x + 4 + lw, y + 50, won ? C.win : C.assign, { outline: fax ? null : '#000000', bold: true });
  // stamps: «+1» per hit and a cross per miss, right-aligned
  let rx = x + w - 6;
  for (let i = 0; i < S.maxMisses; i++) {
    const on = i < S.misses;
    rx -= 7; rect(g, rx, y + 54, 5, 5, on ? (fax ? '#952a24' : '#e86040') : C.line);
    if (on) { rect(g, rx + 1, y + 56, 3, 1, C.bg); }
  }
  rx -= 6;
  for (let i = 0; i < S.hits; i++) { const tw = measure('+1'); rx -= tw + 3; drawText(g, '+1', rx, y + 50, C.win, { outline: fax ? null : '#000000' }); }
  if (S.thread && game.realTime < S.thread.until) {
    // the reply-all thread line (cameos, «+1»): up to two lines under the window
    const t = S.thread.from + ' ' + S.thread.text;
    let tl = wrap(t, 290);
    if (tl.length > 2) tl = [tl[0], fit(tl.slice(1).join(' '), 290)];
    const tw = Math.min(300, Math.max(...tl.map(l => measure(l))) + 8);
    g.save(); g.globalAlpha = 0.85; rect(g, 160 - tw / 2, y + h + 1, tw, 11 * tl.length, fax ? '#d2c6a8' : '#0c1020'); g.restore();
    tl.forEach((l, i) => drawText(g, l, 160, y + h + 1 + i * 10, fax ? '#2a2218' : '#9cf0a4', { align: 'center', outline: null }));
    game.hudTop = y + h + 3 + 11 * tl.length;
  }
}
