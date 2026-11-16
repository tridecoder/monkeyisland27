// OBJETIVOS, PISTAS EN TRES NIVELES Y HORA POR HITOS (plan de comedia §8). Genérico: los DATOS están en
// content/pistas.js (objetivos con sus condiciones, salas, la meta de «Mirar a Bruno», los tres niveles de la abuela y
// la tabla de la hora) y los registra content/game.js como `objetivos` y `hora`.
//
//   api.objetivo.marcar('torno')       el autor de sala marca un hito a mano (flag `obj:torno`; casi nunca hace falta:
//                                      cada objetivo ya se da por hecho con su condición `hecho`)
//   api.objetivo.hecho('torno')        ¿hecho? (marcado o su condición se cumple)
//   api.objetivo.pendientes()          ids activos y sin hacer, en el orden de la lista
//   api.objetivo.actual(sala?)         el primero pendiente asociado a la sala (por defecto, la de Bruno); si no, el 1.º
//                                      (con `acto` en los objetivos y `G.acto`, solo entre los del acto en curso)
//   api.objetivo.meta(sala?)           la línea de Bruno para «Mirar a Bruno» (plan §8.2)
//   api.objetivo.pista()               { obj, nivel 1-3, repetida } — la siguiente pista de la abuela (avanza el nivel)
//   api.objetivo.foco(id)              el jugador intenta un objetivo `opcional` (micropuzle): Bruno y la abuela hablan
//                                      de él en sus salas hasta que la abuela lo dice entero (nivel 3) o se hace
//   (objetivo).sub                     sub-estados: [{ si, niveles, meta, extra, previa }] (el primero que se cumple)
//   api.hora()                         '18:30' … '21:00' (nunca retrocede; los relojes del edificio siguen en 20:59)
const asArray = x => x == null ? [] : Array.isArray(x) ? x : [x];

const lista = (game) => asArray(game.G.objetivos);
const def = (game, id) => lista(game).find(o => o.id === id);
const C = (game) => game.condApi();
function cumple(game, c) { if (c == null) return true; try { return !!game.cond(c, C(game)); } catch (e) { game.error('objetivo: condición falló', e); return false; } }

export function hecho(game, id) {
  const o = def(game, id);
  if (!game.state) return false;
  if (game.state.flags['obj:' + id]) return true;
  return !!(o && o.hecho != null && cumple(game, o.hecho));
}
export function activo(game, o) { return cumple(game, o.activo); }
export function pendientes(game) { return lista(game).filter(o => !hecho(game, o.id) && activo(game, o)).map(o => o.id); }
// OPCIONALES Y FOCO: un objetivo `opcional: true` (un micropuzle que no hace falta para acabar) no cuenta para «Mirar a
// Bruno» ni para la abuela salvo que el jugador lo tenga «en foco» (`api.objetivo.foco(id)`, flag `obj:foco`: lo pone la
// sala cuando el jugador lo intenta). En foco y en una de sus salas, va el primero. La abuela lo suelta tras su nivel 3.
const foco = (game) => (game.state && game.state.flags['obj:foco']) || null;
const hechosPrincipales = (game) => lista(game).filter(o => !o.opcional && hecho(game, o.id)).length;
function opcionalEnFoco(game, room) {
  const f = foco(game), o = f && def(game, f);
  if (!o || !o.opcional || hecho(game, f) || !activo(game, o)) return null;
  // el foco caduca en cuanto el jugador avanza en lo principal (un objetivo más hecho desde que lo intentó)
  if (hechosPrincipales(game) > (Number(game.state.flags['obj:foco_n']) || 0)) return null;
  return room == null || enSala(o, room) ? f : null;
}
/** E8 (bloqueos): sub-estados. `sub: [{ si, niveles?, meta?, extra?, previa? }]`: el primero cuya condición se cumple
 *  sustituye esos campos del objetivo (falta X pero ya tiene Y). Devuelve el objetivo con la variante aplicada. */
export function variante(game, o) {
  if (!o || !Array.isArray(o.sub)) return o;
  const v = o.sub.find(s => cumple(game, s.si));
  return v ? { ...o, ...v, sub: undefined } : o;
}
const enSala = (o, room) => { const S = asArray(o && o.salas); return S.includes(room) || S.includes('*'); };
// crítica 3 · N2: el ACTO. Si content/game.js da `acto(view)` (el acto en curso) y un objetivo dice `acto: n` (o
// `[n, m]`: sigue valiendo en el acto m), «Mirar a Bruno» y la abuela miran primero los objetivos del acto en curso
// (los que son de ese acto, antes que los que se arrastran de otro) y solo si no queda ninguno, los demás. Así un
// objetivo viejo que siga pendiente no tapa la meta del acto.
function actoEnCurso(game) {
  const A = game.G.acto;
  if (typeof A !== 'function' || !game.state) return null;
  try { return Number(A(C(game))) || null; } catch (e) { game.error('acto() falló', e); return null; }
}
function candidatos(game) {
  const P = pendientes(game).filter(id => !def(game, id).opcional);
  const ac = actoEnCurso(game);
  if (ac == null) return P;
  const actos = (id) => asArray(def(game, id).acto);
  const propios = P.filter(id => actos(id).length && actos(id)[0] === ac);
  const arrastrados = P.filter(id => !actos(id).length || (actos(id)[0] !== ac && actos(id).includes(ac)));
  const C2 = propios.concat(arrastrados);
  return C2.length ? C2 : P;
}
export function actual(game, sala) {
  const room = sala || (game.state && game.state.room);
  const op = opcionalEnFoco(game, room);
  if (op) return op;
  const P = candidatos(game);
  return P.find(id => enSala(def(game, id), room)) || P[0] || null;
}
/** La meta en voz de Bruno (plan §8.2): la del objetivo actual (o su `meta` heredada del grupo). */
export function meta(game, sala) {
  const id = actual(game, sala);
  const o = id && variante(game, def(game, id));
  if (!o) return game.G.metaFinal || null;
  return typeof o.meta === 'function' ? o.meta(C(game)) : o.meta;
}
/** Algoritmo de la abuela (plan §8.5): objetivo de la sala → el de la llamada anterior si sigue pendiente → el primero.
 *  Mismo objetivo que la vez anterior = un nivel más (hasta 3); otro = nivel 1. Guarda `abuela_obj` / `abuela_nivel`. */
export function siguientePista(game) {
  const F = game.state.flags;
  const P = candidatos(game);                      // crítica 3 · N2: primero los del acto en curso
  const room = game.state.room;
  const aqui = opcionalEnFoco(game, room) || P.find(id => enSala(def(game, id), room));
  const id = aqui || (F.abuela_obj && P.includes(F.abuela_obj) ? F.abuela_obj : null) || P[0] || null;
  if (!id) return { obj: null, nivel: 0, repetida: false };
  const prev = F.abuela_obj, prevN = Number(F.abuela_nivel) || 0;
  // un sub-estado nuevo del mismo objetivo (ya tiene Y, ahora falta Z) vuelve a empezar por el nivel 1
  const o = def(game, id), sub = Array.isArray(o.sub) ? o.sub.findIndex(s => cumple(game, s.si)) : -1;
  const mismo = id === prev && (F['obj:abuela_sub'] ?? -1) === sub;
  const nivel = mismo ? Math.min(3, prevN + 1) : 1;
  const repetida = mismo && prevN >= 3;
  F.abuela_obj = id; F.abuela_nivel = nivel; F['obj:abuela_sub'] = sub;
  if (nivel >= 3 && F['obj:foco'] === id) delete F['obj:foco'];   // el opcional, dicho entero: vuelve lo principal
  return { obj: id, nivel, repetida, def: variante(game, def(game, id)) };
}

// ------------------------------------------------------------------ hora
const toMin = (h) => { const [a, b] = String(h).split(':').map(Number); return a * 60 + b; };
const fmt = (m) => String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
/** La hora del móvil: `game.G.hora(view)` (content/pistas.js) da 'HH:MM'; el motor la hace siempre creciente. */
export function hora(game) {
  const H = game.G.hora;
  if (typeof H !== 'function' || !game.state) return game.G.horaFija || '20:59';
  let m;
  try { m = toMin(H(C(game))); } catch (e) { game.error('hora() falló', e); return '20:59'; }
  const F = game.state.flags;
  if (!(F['obj:hora'] >= m)) F['obj:hora'] = m;
  return fmt(F['obj:hora']);
}

export function apiFor(game) {
  return {
    marcar: (id) => { if (!def(game, id)) game.error('objetivo.marcar: objetivo desconocido ' + id); game.state.flags['obj:' + id] = true; game.refreshWalkboxes(); },
    hecho: (id) => hecho(game, id),
    pendientes: () => pendientes(game),
    actual: (sala) => actual(game, sala),
    meta: (sala) => meta(game, sala),
    pista: () => siguientePista(game),
    foco: (id) => { if (!def(game, id)) { game.error('objetivo.foco: objetivo desconocido ' + id); return; } if (!hecho(game, id)) { game.state.flags['obj:foco'] = id; game.state.flags['obj:foco_n'] = hechosPrincipales(game); } },
    variante: (id) => variante(game, def(game, id)),
    lista: () => lista(game).map(o => ({ id: o.id, hecho: hecho(game, o.id), activo: activo(game, o) })),
  };
}
