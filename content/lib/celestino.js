// CELESTINO NARRA A BRUNO (plan de comedia §4.7). ARCHIVO COMPARTIDO (paquete común): los textos son del plan.
// Lista de hitos en orden; el MÁS RECIENTE aún no narrado se narra en el siguiente de estos sitios:
//   (a) al entrar en el Vestíbulo  → la sala (P1) llama a `narrarHito(api)` en su onEnter (globo de Celestino);
//   (b) en cada viaje de ascensor  → content/lib/ascensor.js ya lo hace, por megafonía, en lugar de la frase de rotación;
//   (c) la rejilla de Sistemas     → la sala (P1) puede usar `hitoPendiente(api)` / `narrarHito(api, { via: 'megafonia' })`.
// Al narrar uno, los anteriores ya conseguidos se dan por narrados (nunca se cuentan hazañas viejas). Sin hito
// pendiente devuelve false y la sala dice lo de siempre (el Ibex, la frase del ascensor).
export const CELESTINO = 'celestino';
// ENMIENDA E2 §7.4 (pasos 23, 27 y 37): fuera los hitos del apagón (cms_vivo), de D1 (casilla_hueco) y del recorte
// (pieza_recortada). Las retransmisiones del torno y de Rubén en el Vestíbulo (fase B (8)) son de la sala (P1).
export const HITOS = [
  ['torno_abierto', '¡Vacante supera al torno! ¡Por la banda! ¡Con chicle! ¡Qué técnica!'],
  ['chaqueta_en_lector', '¡El chaval viste al Lector Medio! ¡Cambio de camiseta en pleno partido!'],
  ['cafetera_viral', '¡Buenas noches a la cafetera! ¡Juego limpio! ¡Eso no se veía desde el 82!'],
  ['reunion_terminada', '¡Desbandada en la Sala Amazonas! ¡Mercados se retira al vestuario!'],
  ['nota_gasto_presentada', '¡Tarjeta en Administración! ¡Por triplicado! ¡Y el chaval sigue jugando!'],
  ['casilla_firma', '¡Teodoro le da la firma! ¡Un fax de cabeza! ¡Golazo de papel!'],
  ['ruben_encontrado', '¡Sale un chaval del banquillo de Sistemas! ¡Cuatro meses calentando!'],
  ['ruben_libre', '¡Y el chaval de Sistemas pide el cambio! ¡Sale a ver el sol!'],
];
const narrado = (api, flag) => !!(api.game.state.once && api.game.state.once['once:hito_celestino:' + flag]);

/** El hito más reciente conseguido y aún sin narrar: { flag, texto } o null. No marca nada. */
export function hitoPendiente(api) {
  for (let i = HITOS.length - 1; i >= 0; i--) {
    const [flag, texto] = HITOS[i];
    if (!api.flag(flag)) continue;
    return narrado(api, flag) ? null : { flag, texto, i };
  }
  return null;
}
/** Narra el hito pendiente (y da por narrados los anteriores). opts.via: 'globo' (Celestino en la sala, por defecto) |
 *  'megafonia' (api.megafonia; `blocking` como se pida). Devuelve true si ha narrado algo. */
export async function narrarHito(api, opts = {}) {
  const h = hitoPendiente(api);
  if (!h) return false;
  for (let i = 0; i <= h.i; i++) if (api.flag(HITOS[i][0])) api.once('hito_celestino:' + HITOS[i][0]);
  if (opts.via === 'megafonia') await api.megafonia(CELESTINO, h.texto, { blocking: opts.blocking ?? true });
  else await api.sayAs(CELESTINO, h.texto);
  return true;
}
