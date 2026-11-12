// Pantalla completa y móvil (problema 6 del director: jugar en el iPhone, en horizontal, sin barras del navegador).
//  - Escritorio, Android, iPad: Fullscreen API (+ screen.orientation.lock('landscape') donde exista). Tecla F.
//  - iPhone Safari NO tiene Fullscreen API para elementos: el juego es una web app instalable (manifest.webmanifest +
//    metas apple-mobile-web-app-*). Si se pulsa «Pantalla completa» en Safari (no instalada), sale un panel que explica
//    «Compartir → Añadir a pantalla de inicio» y abrirla desde el icono con el móvil en horizontal.
//  - Lo usan screens.js (opción del título y del menú de pausa, panel de ayuda) y core.js (tecla F, tamaño del lienzo).

const doc = () => document;
export function isIOS() {
  const ua = navigator.userAgent || '';
  return /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}
export function isIPhone() { return /iPhone|iPod/.test(navigator.userAgent || ''); }
/** ¿Abierta como app instalada (sin interfaz del navegador)? */
export function isStandalone() {
  try {
    if (navigator.standalone) return true;
    return ['fullscreen', 'standalone'].some(m => window.matchMedia && window.matchMedia(`(display-mode: ${m})`).matches);
  } catch (e) { return false; }
}
export function fullscreenSupported() {
  const d = doc();
  return !!(d.fullscreenEnabled || d.webkitFullscreenEnabled) && !isIPhone();
}
export function isFullscreen() {
  const d = doc();
  return !!(d.fullscreenElement || d.webkitFullscreenElement) || isStandalone();
}
/** Etiqueta de la opción de menú según el estado. */
export function fullscreenLabel() {
  if (isStandalone()) return 'Pantalla completa: sí (app)';
  const d = doc();
  return (d.fullscreenElement || d.webkitFullscreenElement) ? 'Salir de pantalla completa' : 'Pantalla completa';
}
/** Alterna pantalla completa. En iPhone sin instalar abre el panel de ayuda (game.iosHelp). Devuelve lo que hizo. */
export async function toggleFullscreen(game) {
  const d = doc();
  if (isStandalone()) { game.notice && game.notice('Ya estás a pantalla completa.'); return 'standalone'; }
  if (!fullscreenSupported()) {
    if (isIOS()) { game.iosHelp = { at: game.realTime }; return 'ios-help'; }
    game.notice && game.notice('Este navegador no permite pantalla completa.');
    return 'unsupported';
  }
  try {
    if (d.fullscreenElement || d.webkitFullscreenElement) {
      if (d.exitFullscreen) await d.exitFullscreen(); else if (d.webkitExitFullscreen) d.webkitExitFullscreen();
      return 'exit';
    }
    const el = d.documentElement;
    if (el.requestFullscreen) await el.requestFullscreen({ navigationUI: 'hide' });
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    try { if (screen.orientation && screen.orientation.lock) await screen.orientation.lock('landscape'); } catch (e) { /* no se puede bloquear: da igual */ }
    return 'enter';
  } catch (e) {
    game.notice && game.notice('No se pudo poner a pantalla completa.');
    return 'error';
  }
}

/** Pista «gira el móvil» (HTML, no bloquea): visible en vertical en pantallas táctiles. */
export function updateRotateHint() {
  const el = doc().getElementById('rotate-hint');
  if (!el) return;
  const coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  const portrait = window.innerHeight > window.innerWidth;
  el.hidden = !(coarse && portrait);
}
