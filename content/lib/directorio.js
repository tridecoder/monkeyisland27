// EL DIRECTORIO CON ATAJOS (crítica 3 §9 punto 8: «el directorio de planta como ascensor rápido»).
// El tótem-directorio del vestíbulo de planta de la Redacción (`pecera.directorio_planta`, junto al núcleo, donde llegan la
// escalera y el ascensor de las otras plantas) abre la lista de las salas YA PISADAS en la partida (`state.visitadas`, la
// marca el motor al entrar en cada sala: `api.visitada(room)`), con su nombre visible oficial; al elegir una, Bruno aparece
// en su entrada de siempre y la sala corre su `onEnter` y los avisos comunes igual que por el camino largo. Es opcional:
// el recorrido de 44 pasos no lo usa.
// ENMIENDA E5 §2.7: el ASCENSOR reutiliza esta lista (`destinos`, `nombreDe`) para su submenú de atajos por planta, con
// los mismos bloqueos.
//
// BLOQUEOS (nunca deja saltarse un puzle ni una escena):
//   · solo salas visitadas, y nunca la sala en la que ya se está;
//   · todo lo que no sea el Vestíbulo pide `torno_abierto` (la misma condición que el ascensor, `plantaPermitida`);
//   · la Sala Amazonas solo en los Actos I y II: en el III se entra por su puerta de los Despachos (`entrarSala`, acta y
//     Rubén; el clímax 7.4 empieza ahí);
//   · tras el empujón (`lector_derribado`) y en el final (`juego_terminado`) el directorio no lleva a ningún sitio.
import { plantaPermitida } from './ascensor.js';

export const DIRECTORIO_COLOR = '#9FD8FF';

/** Destinos en el orden de la lista (planta 1, planta 2, planta 0, planta -1): nombre visible y entrada habitual. */
export const DESTINOS = [
  { room: 'pecera', nombre: 'Redacción', planta: 1, entry: 'ascensor' },
  { room: 'catacumba', nombre: 'Redacción de papel', planta: 1, entry: 'pecera' },
  { room: 'pajarera', nombre: 'Despachos', planta: 1, entry: 'pecera' },
  { room: 'sala_amazonas', nombre: 'Sala Amazonas', planta: 1, entry: 'pajarera' },
  { room: 'office', nombre: 'Vending', planta: 1, entry: 'pecera' },
  { room: 'ecosistema', nombre: 'Marketing y Comercial', planta: 2, entry: 'pecera' },
  { room: 'eventos', nombre: 'Eventos', planta: 2, entry: 'ecosistema' },
  { room: 'administracion', nombre: 'Administración', planta: 2, entry: 'ecosistema' },
  { room: 'vestibulo', nombre: 'Vestíbulo', planta: 0, entry: 'pecera' },
  { room: 'cpd', nombre: 'Sistemas', planta: -1, entry: 'ascensor' },
];
export const QUEDARSE = 'Nada, me quedo aquí.';
export const PRIMER_VIAJE = 'Toco un nombre y el tótem me lleva. Ni ticket, ni cita previa.';
export const SIN_DESTINO = 'Un punto rojo: «ESTÁ AQUÍ». Gracias. Me hacía falta.';   // la línea de Mirar de siempre

/** ¿Funciona el directorio ahora? (fuera tras el empujón y en el final) */
export function directorioActivo(api) {
  return !api.flag('lector_derribado') && !api.flag('juego_terminado');
}

/** ¿Se puede saltar ahora a `room` con el directorio? (ver BLOQUEOS en la cabecera) */
export function destinoAbierto(api, room) {
  if (!directorioActivo(api) || room === api.room || !api.visitada(room)) return false;
  if (!plantaPermitida(api, room)) return false;
  if (room === 'sala_amazonas' && api.flag('acto_3_iniciado')) return false;
  return true;
}

/** Destinos que ofrece ahora el directorio (los de DESTINOS que pasan `destinoAbierto`). */
export function destinos(api) {
  return DESTINOS.filter(d => destinoAbierto(api, d.room));
}

export const etiqueta = (d) => `${d.nombre} · planta ${d.planta}`;

/** Nombre visible oficial de una sala (el de DESTINOS: «Redacción», «Marketing y Comercial»…); si no está, su id.
 *  Lo usa el submenú de atajos del ascensor (E5 §2.7, §6.10). */
export function nombreDe(room) {
  const d = DESTINOS.find(d => d.room === room);
  return d ? d.nombre : String(room);
}

/** Abre la lista y, si se elige una sala, lleva a Bruno a su entrada habitual. Devuelve true si ha viajado. */
export async function usarDirectorio(api) {
  if (!directorioActivo(api)) return false;
  const lista = destinos(api);
  if (!lista.length) { await api.say(SIN_DESTINO); return false; }
  api.sfx('beep');
  const i = await api.choose([...lista.map(etiqueta), QUEDARSE], { escape: lista.length });
  if (i == null || i < 0 || i >= lista.length) return false;
  const d = lista[i];
  if (!destinoAbierto(api, d.room)) return false;           // por si algo cambió mientras el menú estaba abierto
  if (api.once('directorio_primer_viaje')) await api.say(PRIMER_VIAJE);
  api.sfx('click');
  await api.goto(d.room, d.entry);
  return true;
}
