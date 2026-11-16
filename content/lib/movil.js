// EL MÓVIL DE BRUNO (objeto `movil`, `solo: true`): «Usar móvil» (o Usar móvil con Bruno, clic derecho, doble toque)
// abre el primer plano del móvil en MODO APLICACIÓN (engine/phone.js) con su menú en el panel:
//   · «Llamar a la abuela»   → la escena de pistas de siempre (content/game.js `pistas`, líneas sin cambios)
//   · «Correo (N sin leer)»  → la bandeja: los «RV:» de Tadeo que ya han llegado (E2: ya no hay aviso; llegan solos), los
//                              de Evaristo que ha anunciado un aviso ([coherencia]) y tres correos fijos de la casa;
//                              del más nuevo al más viejo; se leen de uno en uno
//   · «Llamadas perdidas»    → la eterna de la abuela y las de Evaristo hasta ahora
//   · «Guardar el móvil»     → cierra (también Esc o un toque en la sala)
// Leer un correo solo toca `movil_leidos` (bits de leídos): no suma contadores de la biblia ni de la adenda.
// La hora de la barra de estado es la de la historia, por hitos (plan §8.4: content/pistas.js `horaMovil`, api.hora()):
// 18:30 → 21:00; los relojes del edificio siguen parados en las 20:59.
// Seguro: el móvil no se guarda, se retira al acabar el guion (aunque falle) y al cargar; en modo rápido, todo es instantáneo.

import { decir } from '../../engine/efectos.js';

/** Los «RV:» de Tadeo (adenda §2.2; plan §5.16): condición, asunto (lo que dice Tadeo) y el comentario de Bruno ('' = sin
 *  comentario). ENMIENDA E2 §7.4: ya NO son avisos; llegan solos al correo al entrar en una sala con su condición
 *  (content/game.js cuenta los llegados en `tadeo_rv_n`). E2 §7.2: RV1 y RV2 sin comentario de Bruno. */
export const RV_TADEO = [   // plan §5.16: tres, sin siglas
  ['inigo_presentado', 'RV: Cómo hacer que la web cargue en la mitad de tiempo (40 págs.)!!', ''],
  ['acto_2_iniciado', 'RV: RV: RV: La IA dice que la web va más rápida sin lo más grande!!', ''],
  ['acto_3_iniciado', 'RV x5: Reflexión sobre armarios: "AYÚDAME ESTOY EN EL ARMARIO 27"', 'Lo ha visto toda la empresa. Y nadie lo ha leído.'],
];

/** [coherencia] Los correos de don Evaristo: cada uno que el juego anuncia con un aviso LLEGA a la bandeja en ese
 *  momento (sin leer). «Una cosita» va en tres partes: la 1 la escribe en «¿Falta mucho?» (administracion.dialogos.js);
 *  la 2 y la 3 llegan solas en las dos entradas en sala siguientes (content/game.js `avisos`), o antes si Bruno le
 *  vuelve a meter prisa. «Agradecimiento» es el que promete de palabra al despedirse (o al darle algo): llega en la
 *  entrada siguiente. Nada de esto es el `correo_evaristo` de la trama (impreso por el fax, asunto «Una coma»). */
export const CORREOS_EVARISTO = {
  1: { bit: 3, asunto: 'Una cosita (1 de 3)', cuerpo: ['Estimado señor Pellejo, con jota:', 'Lo que le quiero comunicar no cabe en un correo. Va en tres.'],
    bruno: 'Una cosita muy pequeña. En tres entregas.' },
  2: { bit: 4, asunto: 'Una cosita (2 de 3)', cuerpo: ['Es sobre una coma.', 'Sigue en el próximo.'],
    bruno: 'Me lo está dando por entregas. Y yo, enganchado.' },
  3: { bit: 5, asunto: 'Una cosita (3 de 3)', cuerpo: ['Fin.', 'Atentamente, Evaristo Salvedad. Controlling.'],
    bruno: 'Tres correos. Ni una errata. Ni un dato.' },
  G: { bit: 6, asunto: 'Agradecimiento', cuerpo: ['Gracias por pasar por Controlling.', 'Su visita ha durado once minutos. Ninguno sobraba.'],
    bruno: 'Me da las gracias por escrito. Aquí no me las dan ni de palabra.' },
};
export const DE_EVARISTO = 'Evaristo Salvedad';
const tokens = (api) => String(api.flag('evaristo_correos') || '').split(',').filter(Boolean);
/** ¿Ha llegado ya el correo `id` de Evaristo? */
export const correoLlegado = (api, id) => tokens(api).some(t => t.split('@')[0] === String(id));
/** ¿Ha prometido Evaristo el de agradecimiento (o ya ha llegado)? */
export const graciasPrometidas = (api) => tokens(api).some(t => t === 'g' || t.startsWith('G@'));
/** El correo `id` llega a la bandeja AHORA, sin leer, con su aviso. Devuelve false si ya estaba. */
export function llegaCorreoEvaristo(api, id) {
  const C = CORREOS_EVARISTO[id];
  if (!C || correoLlegado(api, id)) return false;
  const t = tokens(api).filter(x => !(id === 'G' && x === 'g'));
  t.push(`${id}@${num(api, 'tadeo_rv_n')}`);
  api.setFlag('evaristo_correos', t.join(','));
  api.notice(`Correo nuevo de ${DE_EVARISTO}: «${C.asunto}».`);
  return true;
}
/** Evaristo promete de palabra el correo de agradecimiento: llega en la entrada en sala siguiente. */
export function prometerGracias(api) {
  if (graciasPrometidas(api)) return false;
  api.setFlag('evaristo_correos', [...tokens(api), 'g'].join(','));
  return true;
}
/** Al entrar en una sala (content/game.js `avisos`): llega como mucho UN correo pendiente de Evaristo. */
export function correoPendienteEvaristo(api) {
  if (correoLlegado(api, 1) && !correoLlegado(api, 2)) return llegaCorreoEvaristo(api, 2);
  if (correoLlegado(api, 2) && !correoLlegado(api, 3)) return llegaCorreoEvaristo(api, 3);
  if (tokens(api).includes('g')) return llegaCorreoEvaristo(api, 'G');
  return false;
}

/** Correos fijos (siempre en la bandeja, al fondo): bit de leído, remitente, quién «habla» el texto, fecha, asunto, cuerpo. */
const FIJOS = [
  { bit: 8, de: 'Eventos', who: 'pilar_escaleta', fecha: '3 mar.', asunto: '¡Empezamos en 5 minutos!',
    cuerpo: ['Recordatorio: la presentación empieza en 5 minutos.', 'Enviado el 3 de marzo. Reenviado cada cinco minutos desde entonces.'],
    bruno: 'Enviado el 3 de marzo. No he ido. Ya no sé si llego tarde o si no empieza.' },
  { bit: 9, de: 'Administración', who: 'begona_triplicado', fecha: 'ayer', asunto: 'Nota de gasto RECHAZADA (se adjunta duplicado)',
    cuerpo: ['Su nota «Café para pensar» queda RECHAZADA.', 'Motivo: pensar no es un gasto deducible. Triplicado, por correo interno.'],
    bruno: '«Pensar no es deducible». Lo enmarco.' },
  { bit: 10, de: 'elContable.es', who: null, fecha: 'hace 6 años', asunto: '¡Bienvenido a elContable.es, Bruno!',
    cuerpo: ['¡Bienvenido, Bruno! Tu acceso estará listo en 24 horas.', 'Mientras, lee el libro de estilo: página 1 de 900. Un abrazo, Personal.'],
    bruno: 'Sin leer. El acceso «en 24 horas» sigue en camino.' },                 // E2 §8
];
const COLOR_SISTEMA = '#c8d0e8';

const num = (api, f) => Number(api.flag(f) || 0);
const leido = (api, bit) => ((num(api, 'movil_leidos') >> bit) & 1) === 1;
const marcar = (api, bit) => { if (!leido(api, bit)) api.setFlag('movil_leidos', num(api, 'movil_leidos') | (1 << bit)); };

/** La bandeja: los RV: de Tadeo y los de Evaristo que ya han llegado (del más nuevo al más viejo) y, debajo, los fijos. */
export function bandeja(api) {
  const n = Math.min(num(api, 'tadeo_rv_n'), RV_TADEO.length);
  const ev = tokens(api).filter(t => t.includes('@')).map(t => { const [id, k] = t.split('@'); return { id, k: Number(k) || 0 }; });
  const evaristo = (k) => ev.filter(e => e.k === k && CORREOS_EVARISTO[e.id]).map(({ id }) => {
    const C = CORREOS_EVARISTO[id];
    return { bit: C.bit, de: DE_EVARISTO, who: 'evaristo_salvedad', fecha: 'hoy', asunto: C.asunto, cuerpo: C.cuerpo, bruno: C.bruno };
  });
  const cron = [...evaristo(0)];                                    // en orden de llegada
  for (let i = 0; i < n; i++) {
    const [, asunto, bruno] = RV_TADEO[i];
    cron.push({ bit: i, de: 'Tadeo Adjunto', who: 'tadeo_adjunto', fecha: 'hoy', asunto: asunto.replace(/^((RV: )+|RV x\d: )/, ''), completo: asunto, cuerpo: [asunto], bruno });
    cron.push(...evaristo(i + 1));
  }
  return cron.reverse().concat(FIJOS);
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
  if (c.who === 'tadeo_adjunto') await avisoAurora(api);
}

/** ENMIENDA E5 §2.8 · N6: al leer un «RV:» de Tadeo en la Redacción de papel, Aurora suelta en ese momento su par de
 *  ambiente (`aurora_tadeo` de content/rooms/catacumba.js), con el MISMO contador (`ambient:catacumba.aurora_tadeo`):
 *  si ya lo dijo, no lo repite; si lo dice aquí, el ambiente ya no lo dirá. Las líneas y la condición son de la sala. */
export const AURORA_RV = { sala: 'catacumba', ambiente: 'aurora_tadeo' };
async function avisoAurora(api) {
  const g = api.game;
  if (api.room !== AURORA_RV.sala || !g.room || !g.actors.aurora_galerada) return;
  const am = (g.room.ambient || []).find(a => a.def && a.def.id === AURORA_RV.ambiente);
  if (!am || am.running) return;
  const key = `ambient:${AURORA_RV.sala}.${AURORA_RV.ambiente}`;
  if ((g.state.flags[key] || 0) >= 1) return;
  let ok = true;
  try { ok = !am.def.if || api.cond(am.def.if); } catch (e) { ok = false; }
  const list = am.def.discusiones || (am.def.lineas ? [am.def.lineas] : null);
  if (!ok || !list || !list.length) return;
  g.state.flags[key] = 1;
  const lines = typeof list[0] === 'function' ? list[0](api) : list[0];
  await decir(api, lines, am.def.voces || {});
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
  await api.say(ev ? ['Una perdida de la abuela.', ev === 1 ? 'Y una de Evaristo. Era solo eso.' : `Y ${ev} de Evaristo. Todas eran solo eso.`]
    : 'Una perdida de la abuela.');
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
