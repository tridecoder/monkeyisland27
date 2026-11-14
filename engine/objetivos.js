// OBJETIVOS, PISTAS EN TRES NIVELES Y HORA POR HITOS (plan de comedia §8). Genérico: los DATOS están en
// content/pistas.js (objetivos con sus condiciones, salas, la meta de «Mirar a Bruno», los tres niveles de la abuela y
// la tabla de la hora) y los registra content/game.js como `objetivos` y `hora`.
//
//   api.objetivo.marcar('torno')       el autor de sala marca un hito a mano (flag `obj:torno`; casi nunca hace falta:
//                                      cada objetivo ya se da por hecho con su condición `hecho`)
//   api.objetivo.hecho('torno')        ¿hecho? (marcado o su condición se cumple)
//   api.objetivo.pendientes()          ids activos y sin hacer, en el orden de la lista
//   api.objetivo.actual(sala?)         el primero pendiente asociado a la sala (por defecto, la de Bruno); si no, el 1.º
//   api.objetivo.meta(sala?)           la línea de Bruno para «Mirar a Bruno» (plan §8.2)
//   api.objetivo.pista()               { obj, nivel 1-3, repetida } — la siguiente pista de la abuela (avanza el nivel)
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
const enSala = (o, room) => { const S = asArray(o && o.salas); return S.includes(room) || S.includes('*'); };
export function actual(game, sala) {
  const room = sala || (game.state && game.state.room);
  const P = pendientes(game);
  return P.find(id => enSala(def(game, id), room)) || P[0] || null;
}
/** La meta en voz de Bruno (plan §8.2): la del objetivo actual (o su `meta` heredada del grupo). */
export function meta(game, sala) {
  const id = actual(game, sala);
  const o = id && def(game, id);
  if (!o) return game.G.metaFinal || null;
  return typeof o.meta === 'function' ? o.meta(C(game)) : o.meta;
}
/** Algoritmo de la abuela (plan §8.5): objetivo de la sala → el de la llamada anterior si sigue pendiente → el primero.
 *  Mismo objetivo que la vez anterior = un nivel más (hasta 3); otro = nivel 1. Guarda `abuela_obj` / `abuela_nivel`. */
export function siguientePista(game) {
  const F = game.state.flags;
  const P = pendientes(game);
  const room = game.state.room;
  const aqui = P.find(id => enSala(def(game, id), room));
  const id = aqui || (F.abuela_obj && P.includes(F.abuela_obj) ? F.abuela_obj : null) || P[0] || null;
  if (!id) return { obj: null, nivel: 0, repetida: false };
  const prev = F.abuela_obj, prevN = Number(F.abuela_nivel) || 0;
  const nivel = id === prev ? Math.min(3, prevN + 1) : 1;
  const repetida = id === prev && prevN >= 3;
  F.abuela_obj = id; F.abuela_nivel = nivel;
  return { obj: id, nivel, repetida, def: def(game, id) };
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
    lista: () => lista(game).map(o => ({ id: o.id, hecho: hecho(game, o.id), activo: activo(game, o) })),
  };
}
