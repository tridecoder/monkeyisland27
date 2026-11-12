// PAQUETE D · «Planta noble y Dirección» — utilidades comunes de MIS salas (ecosistema, administracion, sala_amazonas).
// Dueño: paquete D. Solo efectos de puesta en escena (sonidos inline y destellos); no pone flags.

// ---- sonidos inline (api.sfx acepta definiciones; ver engine/audio.js)
export const SFX = {
  flash: [{ wave: 'noise', dur: 0.05, vol: 0.22, filter: { type: 'highpass', freq: 6000 } },
    { wave: 'sine', f: [2600, 3400], dur: 0.16, vol: 0.06, at: 0.02 }],
  gong: [{ wave: 'sine', f: [112, 104], dur: 1.8, vol: 0.28 }, { wave: 'triangle', f: [224, 210], dur: 1.3, vol: 0.12 },
    { wave: 'sine', f: [337, 330], dur: 0.9, vol: 0.05 }],
  sello: [{ wave: 'noise', dur: 0.08, vol: 0.3, filter: { type: 'lowpass', freq: 900 } }, { wave: 'square', f: [90, 60], dur: 0.08, vol: 0.12 }],
  plin: { notes: ['E6', 'B6'], step: 0.07, wave: 'triangle', vol: 0.1 },
  plof: [{ wave: 'noise', dur: 0.25, vol: 0.32, filter: { type: 'lowpass', freq: 500 } }, { wave: 'sine', f: [140, 50], dur: 0.25, vol: 0.2 }],
  botellines: { notes: ['C6', 'G5', 'E6', 'A5', 'D6', 'F5', 'B5'], step: 0.05, wave: 'triangle', vol: 0.07 },
  rotativa: [{ wave: 'noise', dur: 1.6, vol: 0.16, filter: { type: 'lowpass', freq: 220 } }, { wave: 'square', f: [55, 58], dur: 1.6, vol: 0.05, duty: 0.3 }],
  sillas: [{ wave: 'noise', dur: 0.12, vol: 0.2, filter: { type: 'bandpass', freq: 700 } },
    { wave: 'noise', dur: 0.1, vol: 0.18, filter: { type: 'bandpass', freq: 500 }, at: 0.14 },
    { wave: 'noise', dur: 0.14, vol: 0.2, filter: { type: 'bandpass', freq: 600 }, at: 0.3 }],
};

/** Capa temporal sobre la vista de la sala (coordenadas de pantalla). Respeta el HUD del duelo si lo hay. */
function overlay(api, paint) {
  const g = api.game;
  const prev = g.hud;
  g.hud = (ctx) => { if (prev) prev(ctx); paint(ctx); };
  return () => { g.hud = prev; };
}

/** ¡FLASH! del photocall de Eventos (Pilar Escaleta): chasquido y destello blanco de un instante. */
export async function flash(api) {
  api.sfx(SFX.flash);
  if (api.skipping) return;
  const off = overlay(api, (ctx) => { ctx.save(); ctx.globalAlpha = 0.75; ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 320, 144); ctx.restore(); });
  await api.wait(70);
  off();
}

/** ¡GONG! de Maripaz. */
export function gong(api) { api.sfx(SFX.gong); api.shake(260, 1); }

/** ¡SELLO! de Begoña. */
export function sello(api) { api.sfx(SFX.sello); api.shake(120, 1); }

/** Fundido a blanco (clímax). Devuelve la función que retira el blanco. */
export async function fundidoBlanco(api, ms = 900) {
  let a = 0;
  const off = overlay(api, (ctx) => { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 320, 144); ctx.restore(); });
  if (!api.skipping) {
    const steps = 12;
    for (let i = 1; i <= steps; i++) { a = i / steps; await api.wait(ms / steps); }
  }
  a = 1;
  return off;
}

/** Contador de rotación local: suma 1 y devuelve el índice (0, 1, 2...) que toca. */
export function rota(api, flag) { return api.inc(flag) - 1; }
