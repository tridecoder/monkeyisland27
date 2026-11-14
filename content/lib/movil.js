// EL MÓVIL DE BRUNO (objeto `movil`, `solo: true`): «Usar móvil» (o Usar móvil con Bruno, clic derecho, doble toque)
// abre el primer plano del móvil en MODO APLICACIÓN (engine/phone.js) con su menú en el panel:
//   · «Llamar a la abuela»   → la escena de pistas de siempre (content/game.js `pistas`, líneas sin cambios)
//   · «Correo (N sin leer)»  → la bandeja: los «RV:» de Tadeo que ya han llegado (E2: ya no hay aviso; llegan solos) y
//                              tres correos fijos de la casa; del más nuevo al más viejo; se leen de uno en uno
//   · «Llamadas perdidas»    → la eterna de la abuela y las de Evaristo hasta ahora
//   · «Guardar el móvil»     → cierra (también Esc o un toque en la sala)
// Leer un correo solo toca `movil_leidos` (bits de leídos): no suma contadores de la biblia ni de la adenda.
// La hora de la barra de estado es la de la historia, por hitos (plan §8.4: content/pistas.js `horaMovil`, api.hora()):
// 18:30 → 21:00; los relojes del edificio siguen parados en las 20:59.
// Seguro: el móvil no se guarda, se retira al acabar el guion (aunque falle) y al cargar; en modo rápido, todo es instantáneo.

/** Los «RV:» de Tadeo (adenda §2.2; plan §5.16): condición, asunto (lo que dice Tadeo) y el comentario de Bruno ('' = sin
 *  comentario). ENMIENDA E2 §7.4: ya NO son avisos; llegan solos al correo al entrar en una sala con su condición
 *  (content/game.js cuenta los llegados en `tadeo_rv_n`). E2 §7.2: RV1 y RV2 sin comentario de Bruno. */
export const RV_TADEO = [   // plan §5.16: tres, sin siglas
  ['inigo_presentado', 'RV: Cómo hacer que la web cargue en la mitad de tiempo (40 págs.)!!', ''],
  ['acto_2_iniciado', 'RV: RV: RV: La IA dice que la web va más rápida sin lo más grande!!', ''],
  ['acto_3_iniciado', 'RV x5: Reflexión sobre armarios: "AYÚDAME ESTOY EN EL ARMARIO 27"', 'Lo ha visto toda la empresa. Y nadie lo ha leído.'],
];

/** Correos fijos (siempre en la bandeja, al fondo): bit de leído, remitente, quién «habla» el texto, fecha, asunto, cuerpo. */
const FIJOS = [
  { bit: 8, de: 'Eventos', who: 'pilar_escaleta', fecha: '3 mar.', asunto: '¡Empezamos en 5 minutos!',
    cuerpo: ['Recordatorio: la presentación empieza en 5 minutos.', 'Enviado el 3 de marzo. Reenviado cada cinco minutos desde entonces.'],
    bruno: 'Enviado el 3 de marzo. No he ido. Ya no sé si llego tarde o si no empieza.' },
  { bit: 9, de: 'Administración', who: 'begona_triplicado', fecha: 'ayer', asunto: 'Nota de gasto RECHAZADA (se adjunta duplicado)',
    cuerpo: ['Su nota «Café para pensar» queda RECHAZADA.', 'Motivo: pensar no es un gasto deducible. Triplicado, por correo interno.'],
    bruno: '«Pensar no es deducible». Lo enmarco. Mi primer documento oficial.' },
  { bit: 10, de: 'elContable.es', who: null, fecha: 'hace 6 años', asunto: '¡Bienvenido a elContable.es, Bruno!',
    cuerpo: ['¡Bienvenido, Bruno! Tu acceso estará listo en 24 horas.', 'Mientras, lee el libro de estilo: página 1 de 900. Un abrazo, Personal.'],
    bruno: 'Sin leer. El acceso «en 24 horas» sigue en camino.' },                 // E2 §8
];
const COLOR_SISTEMA = '#c8d0e8';

const num = (api, f) => Number(api.flag(f) || 0);
const leido = (api, bit) => ((num(api, 'movil_leidos') >> bit) & 1) === 1;
const marcar = (api, bit) => { if (!leido(api, bit)) api.setFlag('movil_leidos', num(api, 'movil_leidos') | (1 << bit)); };

/** La bandeja: los RV: que ya han llegado (del más nuevo al más viejo) y, debajo, los fijos. */
function bandeja(api) {
  const n = Math.min(num(api, 'tadeo_rv_n'), RV_TADEO.length);
  const out = [];
  for (let i = n - 1; i >= 0; i--) {
    const [, asunto, bruno] = RV_TADEO[i];
    out.push({ bit: i, de: 'Tadeo Adjunto', who: 'tadeo_adjunto', fecha: 'hoy', asunto: asunto.replace(/^((RV: )+|RV x\d: )/, ''), completo: asunto, cuerpo: [asunto], bruno });
  }
  return out.concat(FIJOS);
}
const sinLeer = (api) => bandeja(api).filter(c => !leido(api, c.bit)).length;
const corto = (t, n = 34) => (t.length > n ? t.slice(0, n - 1).trimEnd() + '…' : t);

async function pantallaInicio(api) {
  const u = sinLeer(api);
  await api.phone.app({ title: 'Móvil de Bruno', rows: [
    { text: 'Abuela', sub: 'Llamar', icon: '#2ec060' },
    { text: u ? `Correo (${u})` : 'Correo', sub: u ? 'sin leer' : 'al día', icon: '#4ab0ff', dot: u > 0 },
    { text: 'Llamadas', sub: 'perdidas', icon: '#d83a2a' },
  ] });
  return u;
}

async function leerCorreo(api, c) {
  await api.phone.app({ title: c.de, caller: c.who, rows: null, body: [`${c.fecha} · ${c.completo || c.asunto}`] });
  marcar(api, c.bit);
  for (const l of c.cuerpo) await api.phone.read(c.who, l, c.who ? {} : { color: COLOR_SISTEMA });
  if (c.bruno) await api.say(c.bruno);
}

async function correo(api) {
  for (let guard = 0; guard < 40; guard++) {
    const L = bandeja(api);
    const u = L.filter(c => !leido(api, c.bit)).length;
    await api.phone.app({ title: u ? `Correo (${u})` : 'Correo', rows: L.map(c => ({ text: c.de, sub: c.asunto, dot: !leido(api, c.bit) })) });
    const opts = L.map(c => `${leido(api, c.bit) ? '' : '* '}${c.de}: ${corto(c.asunto)}`).concat(['Volver']);   // «*» = sin leer
    const i = await api.choose(opts, { escape: L.length });
    if (i < 0 || i >= L.length) return;
    await leerCorreo(api, L[i]);
  }
}

async function llamadas(api) {
  const ev = Math.min(num(api, 'evaristo_llamadas'), 6);   // E2 §5.7: L1, L3, L4, L5 (las partidas antiguas pueden llevar hasta 6)
  const rows = [{ text: 'Abuela', sub: 'perdida · siempre', icon: '#d83a2a' }];
  for (let i = ev; i >= 1; i--) rows.push({ text: 'Evaristo', sub: i === ev ? 'contestada · hoy' : 'contestada', icon: '#F0F0A8' });
  await api.phone.app({ title: 'Llamadas', rows });
  await api.say(ev ? ['Una perdida de la abuela. Siempre hay una.', ev === 1 ? 'Y una de Evaristo. Era solo eso.' : `Y ${ev} de Evaristo. Todas eran solo eso.`]
    : 'Una perdida de la abuela. Siempre hay una.');
  const i = await api.choose(['Devolver la llamada a la abuela', 'Volver'], { escape: 1 });
  return i === 0;
}

/** «Usar móvil»: el menú. Devuelve cuando Bruno guarda el móvil. */
export async function menuMovil(api) {
  try {
    for (let guard = 0; guard < 40; guard++) {
      const u = await pantallaInicio(api);
      const i = await api.choose(['Llamar a la abuela', u ? `Correo (${u} sin leer)` : 'Correo', 'Llamadas perdidas', 'Guardar el móvil'], { escape: 3 });
      if (i === 0) { await api.phone.close(); await api.scene('pistas'); return; }
      if (i === 1) { await correo(api); continue; }
      if (i === 2) { if (await llamadas(api)) { await api.phone.close(); await api.scene('pistas'); return; } continue; }
      return;                                                         // «Guardar el móvil», Esc o un toque fuera
    }
  } finally { if (api.phone.active) await api.phone.close(); }
}
