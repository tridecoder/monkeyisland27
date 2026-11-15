// SALA `pecera` — BANCO DE TITULARES FIJOS (ENMIENDA E4 §5): la ráfaga de avisos al revivir el CMS (S1) y la hoja
// impresa «LO MÁS LEÍDO» (S3) en sus versiones por acto. Datos, a mano (lista cerrada del guion); los lee
// ./pecera.escenas.js. Todo lo de este fichero SOLO SE VE (avisos y filas de una hoja): no son líneas habladas
// (tools/plan-rules.mjs SOLO_PANTALLA los deja fuera de los topes de fórmula y del límite de 80 caracteres).
// La impresora corta cada titular a 34 caracteres y añade «...» (el corte lo hace el dibujo, no estos datos).
// @solo-pantalla:inicio
/** Los 24 titulares fijos (§5), con su número del guion. `corto`: la versión de la ráfaga (≤ 2 líneas en 132 px). */
export const FIJOS = {
  F1: { t: 'Los expertos coinciden: esta tarde hay que cerrar las puertas y bajar las persianas', corto: 'Los expertos coinciden: esta tarde hay que...' },
  F2: { t: 'Atención si tienes una moneda de 2 euros con un árbol: vale 2 euros', corto: 'La moneda de 2 euros con un árbol: vale 2 euros' },
  F3: { t: 'Adiós a la freidora de aire: el electrodoméstico que arrasa es una freidora', corto: 'Adiós a la freidora de aire: llega una freidora' },
  F4: { t: 'Confirmado: el lunes vuelve a ser lunes' },
  F5: { t: 'El Ibex cierra plano' },
  F6: { t: 'El pueblo de España que todavía paga el Euríbor en pesetas' },
  F7: { t: 'Los cocineros coinciden: los mejillones de lata están mejor si los preparas con...' },
  F8: { t: 'Ni 19 ni 21 grados: la temperatura del salón para ahorrar sin pasar frío (20)' },
  F9: { t: 'Qué significa que tu gato duerma sobre el extracto bancario, según la psicología' },
  F10: { t: 'Cómo doblar la prima de riesgo: el método de los hoteles' },
  F11: { t: 'Un economista explica por qué nunca debes guardar el pan en la nevera' },
  F12: { t: 'Un hombre de 104 años revela su secreto: no ha mirado el Ibex ni una vez' },
  F13: { t: 'Me multaron por llevar la prima de riesgo sin cinturón: así lo recurrí' },
  F14: { t: 'La borrasca ya tiene nombre: Bruno llega con fuerza y los expertos piden bajar las...' },
  F15: { t: 'Los expertos avisan: el Euríbor subirá, bajará o se quedará igual' },
  F16: { t: 'Qué es una opa y por qué no te afecta' },
  F17: { t: 'La moneda de 2 euros con el Euríbor que vale una fortuna' },
  F18: { t: 'Tráfico avisa: esta noche cortan la A-6 para que pase el Euríbor' },
  // reservas (§5: sustituyen a una fila si el dueño lo prefiere)
  F19: { t: 'Si te despiertas a las 3:33, el Euríbor te está diciendo esto' },
  F20: { t: 'Las personas que miran el Ibex antes de desayunar tienen esto en común' },
  F21: { t: 'Tráfico retira el carné al IPC por ir a 140' },
  F22: { t: 'Si naciste entre 1950 y 2010, esto te interesa' },
  F23: { t: 'Los cocineros coinciden: la opa de Hidrovoltia, doce minutos a 180 grados' },
  F24: { t: 'Le conté a mi psicóloga lo del Euríbor y se quedó callada' },
};
/** S1: la ráfaga al revivir el CMS (paso 23), en este orden; el quinto (el Ibex) echa al primero. */
export const RAFAGA = ['F1', 'F2', 'F3', 'F4', 'F5'].map(k => FIJOS[k].corto || FIJOS[k].t);
/** S3: filas de la hoja por versión ([número, titular, lecturas]). La fila 3 de la II cambia con `cafetera_viral` y la 5
 *  de la III con el ganador (ver pecera.escenas.js `filasHoja`). `extra`: fila suelta encima del Ibex. */
export const HOJA = {
  I: { kw: 'PERSIANAS', filas: [['F1', 312000], ['F6', 21600], ['F7', 19400], ['F8', 14250], ['F9', 9870]], extra: [213, 'F10', 4] },
  II: { kw: 'BORRASCA', filas: [['F1', 298000], ['F2', 41300], ['F11', 9410], ['F12', 7230], ['F13', 5120]] },
  III: { kw: 'BRUNO', filas: [['F14', 402000], ['F15', 88100], ['F16', 31700], ['F17', 24900], ['F18', 17600]] },
};
/** La fila 3 de la hoja II con la cafetera viral (§4.1). */
export const FILA_CAFETERA = ['Un joven da las buenas noches a una cafetera', 11302];
/** La última fila de todas las hojas (F5): «214 · El Ibex cierra plano · 3, 2, 1… 0». */
export const FILA_IBEX = 214;
// @solo-pantalla:fin
