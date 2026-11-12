// PAQUETE B · ayudas de voz para la Pecera y la Pajarera (archivo propio del paquete B; no es común).
// `talk(api, [[quién, texto], ...])` dice una secuencia de globos con el hablante correcto:
//   'B'                      Bruno
//   'D1' 'D2' 'D3' 'CORO'    el coro de Desarrollo (presencia sin sprite): el texto sale encima del hotspot
//                            `coro_desarrollo` con su prefijo «DEV 1: …» / «CORO: …» (adenda 1.7), color #7FFFD4
//   'H'                      Herminia: rótulo en la pantalla del portátil de Leoncio (#00C2A8)
//   'T'                      Titulator: titular en el portátil de Íñigo (Pajarera, #B6FF4D)
//   'narr'                   rótulo de narrador
//   'sfx'                    efecto de sonido (el texto es el nombre del sfx)
//   'wait'                   pausa (el texto son milisegundos)
//   cualquier otro           id de actor → api.sayAs
export const PREFIX = { D1: 'DEV 1: ', D2: 'DEV 2: ', D3: 'DEV 3: ', CORO: 'CORO: ' };

export async function talk(api, lines) {
  for (const [who, text, opts] of lines) {
    if (who === 'B') await api.say(text, opts);
    else if (PREFIX[who]) await api.sayFrom('coro_desarrollo', PREFIX[who] + text, opts);
    else if (who === 'H') await api.sayFrom('herminia_portatil', text, opts);
    else if (who === 'T') await api.sayFrom('pantalla_titulator', text, opts);
    else if (who === 'narr') await api.narrate(text, opts);
    else if (who === 'sfx') api.sfx(text);
    else if (who === 'wait') await api.wait(Number(text) || 300);
    else await api.sayAs(who, text, opts);
  }
}

/** Handler que dice una secuencia (para `handlers: { mirar: seq([...]) }`). */
export const seq = (lines) => async (api) => talk(api, lines);

/** ¿Está ese actor en la sala actual? */
export const here = (api, id) => { const p = api.actorPos(id); return !!(p && p.room === api.room); };

/** Valor numérico de un contador (los contadores pueden estar sin inicializar en partidas abiertas con ?room=). */
export const num = (api, f) => Number(api.flag(f) || 0);
