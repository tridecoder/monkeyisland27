// WebAudio chiptune sequencer + synthesized sound effects. Starts on first user gesture.

const NOTE_RE = /^([A-Ga-g])([#b]?)(-?\d)$/;
const SEMI = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

export function noteFreq(tok) {
  const m = NOTE_RE.exec(tok);
  if (!m) return null;
  let s = SEMI[m[1].toUpperCase()] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0);
  const midi = 12 * (parseInt(m[3], 10) + 1) + s;
  return 440 * Math.pow(2, (midi - 69) / 12);
}

/** Parse a channel note string into step tokens. '|' and newlines are ignored. */
export function parseNotes(notes) {
  const src = Array.isArray(notes) ? notes.join(' ') : String(notes || '');
  return src.replace(/\|/g, ' ').split(/\s+/).filter(Boolean);
}

// Built-in sound effect presets. Each is a list of layers.
// layer: { wave:'square'|'triangle'|'sawtooth'|'sine'|'noise', f:[startHz,endHz], dur, vol, at(delay), duty,
//          notes:[...], step (sec per note), filter:{type,freq}, vib }
export const SFX_PRESETS = {
  click: [{ wave: 'square', f: [1400, 900], dur: 0.03, vol: 0.12, duty: 0.25 }],
  select: [{ wave: 'square', f: [660, 660], dur: 0.04, vol: 0.1 }, { wave: 'square', f: [990, 990], dur: 0.05, vol: 0.1, at: 0.04 }],
  pickup: [{ wave: 'square', notes: ['C5', 'E5', 'G5', 'C6'], step: 0.05, vol: 0.14, duty: 0.25 }],
  drop: [{ wave: 'square', notes: ['G5', 'E5', 'C5'], step: 0.05, vol: 0.12, duty: 0.25 }],
  success: [{ wave: 'square', notes: ['C5', 'E5', 'G5', 'C6', 'G5', 'C6'], step: 0.07, vol: 0.13, duty: 0.5 }, { wave: 'triangle', notes: ['C4', 'C4', 'G3', 'C4'], step: 0.1, vol: 0.2 }],
  error: [{ wave: 'square', f: [180, 140], dur: 0.22, vol: 0.13, duty: 0.5 }],
  door: [{ wave: 'noise', dur: 0.12, vol: 0.3, filter: { type: 'lowpass', freq: 600 } }, { wave: 'triangle', f: [110, 60], dur: 0.15, vol: 0.4 }, { wave: 'square', f: [300, 420], dur: 0.25, vol: 0.03, at: 0.05, duty: 0.1 }],
  doorClose: [{ wave: 'triangle', f: [140, 50], dur: 0.12, vol: 0.5 }, { wave: 'noise', dur: 0.08, vol: 0.35, filter: { type: 'lowpass', freq: 900 } }],
  step: [{ wave: 'noise', dur: 0.03, vol: 0.08, filter: { type: 'lowpass', freq: 1200 } }],
  paper: [{ wave: 'noise', dur: 0.18, vol: 0.12, filter: { type: 'highpass', freq: 3000 } }, { wave: 'noise', dur: 0.1, vol: 0.1, at: 0.12, filter: { type: 'bandpass', freq: 5000 } }],
  typewriter: [0, 0.09, 0.15, 0.27, 0.33, 0.4].map(at => ({ wave: 'noise', dur: 0.025, vol: 0.25, at, filter: { type: 'bandpass', freq: 2600 } })).concat([{ wave: 'square', f: [2200, 2200], dur: 0.08, vol: 0.05, at: 0.5 }]),
  phone: [0, 0.5].flatMap(at => [{ wave: 'square', notes: ['E6', 'C6', 'E6', 'C6', 'E6', 'C6', 'E6', 'C6'], step: 0.04, vol: 0.07, at, duty: 0.5 }]),
  coin: [{ wave: 'square', notes: ['B5', 'E6'], step: 0.06, vol: 0.12, duty: 0.25 }],
  beep: [{ wave: 'square', f: [1200, 1200], dur: 0.08, vol: 0.08, duty: 0.5 }],
  computer: [0, 0.06, 0.12, 0.2, 0.26].map((at, i) => ({ wave: 'square', f: [600 + i * 230, 600 + i * 230], dur: 0.04, vol: 0.06, at, duty: 0.25 })),
  machine: [{ wave: 'sawtooth', f: [70, 90], dur: 1.1, vol: 0.06, vib: { rate: 18, depth: 12 } }, { wave: 'noise', dur: 1.0, vol: 0.06, filter: { type: 'bandpass', freq: 400 } }, { wave: 'square', f: [1500, 1500], dur: 0.06, vol: 0.06, at: 1.1 }],
  pour: [{ wave: 'noise', dur: 0.9, vol: 0.12, filter: { type: 'bandpass', freq: 900 } }],
  drink: [0, 0.2, 0.4].map(at => ({ wave: 'sine', f: [300, 600], dur: 0.12, vol: 0.2, at })),
  hit: [{ wave: 'noise', dur: 0.12, vol: 0.4, filter: { type: 'lowpass', freq: 2000 } }, { wave: 'triangle', f: [200, 50], dur: 0.12, vol: 0.4 }],
  whoosh: [{ wave: 'noise', dur: 0.35, vol: 0.15, filter: { type: 'bandpass', freq: 1200 } }],
  good: [{ wave: 'square', notes: ['E5', 'A5'], step: 0.07, vol: 0.12, duty: 0.25 }],
  bad: [{ wave: 'square', notes: ['C4', 'F#3'], step: 0.1, vol: 0.12, duty: 0.5 }],
  laugh: [0, 0.12, 0.24, 0.36].map((at, i) => ({ wave: 'square', f: [520 - i * 30, 420 - i * 30], dur: 0.08, vol: 0.06, at, duty: 0.3 })),
  open: [{ wave: 'square', f: [200, 520], dur: 0.12, vol: 0.05, duty: 0.2 }, { wave: 'noise', dur: 0.06, vol: 0.12, at: 0.1, filter: { type: 'lowpass', freq: 1500 } }],
  close: [{ wave: 'square', f: [520, 200], dur: 0.1, vol: 0.05, duty: 0.2 }, { wave: 'noise', dur: 0.07, vol: 0.2, at: 0.08, filter: { type: 'lowpass', freq: 900 } }],
};

export class AudioSystem {
  constructor() {
    this.ctx = null;
    this.musicVol = 0.6; this.sfxVol = 0.8;
    this.tracks = {}; this.sfxDefs = { ...SFX_PRESETS };
    this.current = null; this.currentId = null;
    this.pendingTrack = undefined;
    this.timer = null;
  }
  hasTrack(id) { return !!this.tracks[id]; }
  register(tracks = {}, sfx = {}) { Object.assign(this.tracks, tracks); Object.assign(this.sfxDefs, sfx); }
  /** Call from a user gesture. */
  unlock() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try { this.ctx = new AC(); } catch (e) { console.warn('[audio] cannot start', e); return; }
    const c = this.ctx;
    this.master = c.createGain(); this.master.gain.value = 0.9; this.master.connect(c.destination);
    this.musicBus = c.createGain(); this.musicBus.gain.value = this.musicVol; this.musicBus.connect(this.master);
    this.sfxBus = c.createGain(); this.sfxBus.gain.value = this.sfxVol; this.sfxBus.connect(this.master);
    const len = c.sampleRate;
    this.noiseBuf = c.createBuffer(1, len, c.sampleRate);
    const d = this.noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    this.waves = {};
    this.timer = setInterval(() => this.tick(), 25);
    if (this.pendingTrack !== undefined) { const t = this.pendingTrack; this.pendingTrack = undefined; this.play(t, 0.3); }
  }
  setVolumes(music, sfx) {
    this.musicVol = music; this.sfxVol = sfx;
    if (this.ctx) {
      this.musicBus.gain.setTargetAtTime(music, this.ctx.currentTime, 0.05);
      this.sfxBus.gain.setTargetAtTime(sfx, this.ctx.currentTime, 0.05);
    }
  }
  pulseWave(duty) {
    const k = duty.toFixed(3);
    if (this.waves[k]) return this.waves[k];
    const n = 48, real = new Float32Array(n), imag = new Float32Array(n);
    for (let i = 1; i < n; i++) real[i] = (2 / (i * Math.PI)) * Math.sin(i * Math.PI * duty);
    return (this.waves[k] = this.ctx.createPeriodicWave(real, imag));
  }
  osc(wave, duty) {
    const o = this.ctx.createOscillator();
    if (wave === 'square' && duty && duty !== 0.5) o.setPeriodicWave(this.pulseWave(duty));
    else o.type = wave === 'square' ? 'square' : wave;
    return o;
  }
  // ------------------------------------------------ music
  /** Play track id (null = silence) with crossfade seconds. */
  play(id, fade = 1) {
    this.requestedId = id;
    if (id === this.currentId) return;
    if (!this.ctx) { this.pendingTrack = id; this.currentId = undefined; return; }
    const c = this.ctx;
    if (this.current) {
      const old = this.current;
      old.gain.gain.cancelScheduledValues(c.currentTime);
      old.gain.gain.setValueAtTime(old.gain.gain.value, c.currentTime);
      old.gain.gain.linearRampToValueAtTime(0, c.currentTime + fade);
      old.stopAt = c.currentTime + fade;
      setTimeout(() => { try { old.gain.disconnect(); } catch (e) { /* ignore */ } }, fade * 1000 + 200);
      old.dead = true;
    }
    this.currentId = id;
    this.current = null;
    if (!id) return;
    const def = this.tracks[id];
    if (!def) {   // missing track (e.g. not composed yet): silent fallback, noted once in the console (debug level)
      this.missing = this.missing || new Set();
      if (!this.missing.has(id)) { this.missing.add(id); console.debug('[audio] pista no disponible (silencio):', id); }
      return;
    }
    const gain = c.createGain();
    gain.gain.setValueAtTime(0.0001, c.currentTime);
    gain.gain.linearRampToValueAtTime(def.vol ?? 1, c.currentTime + Math.max(0.05, fade));
    gain.connect(this.musicBus);
    const spb = def.steps || 4;
    const stepDur = 60 / (def.bpm || 120) / spb;
    const chans = (def.channels || []).map(ch => ({ ...ch, toks: parseNotes(ch.notes) }));
    const length = Math.max(...chans.map(ch => ch.toks.length), 1);
    this.current = { id, def, gain, chans, stepDur, step: 0, next: c.currentTime + 0.06, length, loop: def.loop !== false };
  }
  tick() {
    const c = this.ctx, tr = this.current;
    if (!c || !tr || tr.dead) return;
    while (tr.next < c.currentTime + 0.15) {
      if (!tr.loop && tr.step >= tr.length) { this.current = null; this.currentId = null; return; }
      for (const ch of tr.chans) {
        if (!ch.toks.length) continue;
        const i = tr.loop ? tr.step % ch.toks.length : tr.step;
        if (i >= ch.toks.length) continue;
        const tok = ch.toks[i];
        if (tok === '.' || tok === '-') continue;
        let len = 1;
        while (len < ch.toks.length && ch.toks[(i + len) % ch.toks.length] === '-') len++;
        this.playNote(tr, ch, tok, tr.next, len * tr.stepDur);
      }
      tr.step++;
      tr.next += tr.stepDur * (tr.def.swing && tr.step % 2 ? 1 + tr.def.swing : tr.def.swing && 1 - tr.def.swing || 1);
    }
  }
  playNote(tr, ch, tok, t, dur) {
    const c = this.ctx;
    const vol = (ch.vol ?? 0.15);
    if (ch.wave === 'noise' || /^[xokhs]$/.test(tok)) { this.drum(tok, t, vol, tr.gain); return; }
    const f = noteFreq(tok);
    if (!f) return;
    const o = this.osc(ch.wave || 'square', ch.duty);
    o.frequency.setValueAtTime(f * Math.pow(2, (ch.transpose || 0) / 12), t);
    if (ch.vib) { const l = c.createOscillator(), lg = c.createGain(); l.frequency.value = ch.vib.rate || 5; lg.gain.value = f * (ch.vib.depth || 0.01); l.connect(lg); lg.connect(o.frequency); l.start(t + 0.08); l.stop(t + dur + 0.05); }
    if (ch.slide) o.frequency.exponentialRampToValueAtTime(f * Math.pow(2, ch.slide / 12), t + dur);
    const g = c.createGain();
    const gate = dur * (ch.gate ?? 0.9);
    const a = ch.attack ?? 0.004, dec = ch.decay ?? 0.08, sus = ch.sustain ?? 0.65, rel = ch.release ?? 0.04;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + a);
    g.gain.linearRampToValueAtTime(vol * sus, t + a + dec);
    g.gain.setValueAtTime(vol * sus, t + Math.max(a + dec, gate));
    g.gain.linearRampToValueAtTime(0.0001, t + Math.max(a + dec, gate) + rel);
    o.connect(g); g.connect(tr.gain);
    o.start(t); o.stop(t + Math.max(a + dec, gate) + rel + 0.02);
  }
  drum(tok, t, vol, dest) {
    const c = this.ctx;
    if (tok === 'k') {
      const o = c.createOscillator(); o.type = 'sine';
      o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(40, t + 0.12);
      const g = c.createGain(); g.gain.setValueAtTime(vol * 2.2, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
      o.connect(g); g.connect(dest); o.start(t); o.stop(t + 0.18);
      return;
    }
    const src = c.createBufferSource(); src.buffer = this.noiseBuf;
    const f = c.createBiquadFilter();
    const dur = tok === 'o' || tok === 's' ? 0.12 : tok === 'h' ? 0.09 : 0.035;
    f.type = tok === 'o' || tok === 's' ? 'bandpass' : 'highpass';
    f.frequency.value = tok === 'o' || tok === 's' ? 1800 : 7000;
    const g = c.createGain(); g.gain.setValueAtTime(vol * (tok === 'o' ? 1.5 : 1), t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(f); f.connect(g); g.connect(dest);
    src.start(t, Math.random() * 0.5); src.stop(t + dur + 0.02);
  }
  // ------------------------------------------------ sfx
  sfx(name) {
    if (!this.ctx) return;
    const def = typeof name === 'string' ? this.sfxDefs[name] : name;
    if (!def) { console.debug('[audio] sfx desconocido:', name); return; }
    const c = this.ctx, t0 = c.currentTime + 0.01;
    for (const L of (Array.isArray(def) ? def : [def])) {
      const t = t0 + (L.at || 0);
      const vol = L.vol ?? 0.15;
      if (L.notes) {
        const step = L.step || 0.06;
        L.notes.forEach((n, i) => { const f = noteFreq(n); if (f) this.tone(L.wave || 'square', f, f, t + i * step, step * 0.95, vol, L.duty); });
        continue;
      }
      if (L.wave === 'noise') {
        const src = c.createBufferSource(); src.buffer = this.noiseBuf;
        const g = c.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + L.dur);
        let node = src;
        if (L.filter) { const f = c.createBiquadFilter(); f.type = L.filter.type; f.frequency.value = L.filter.freq; src.connect(f); node = f; }
        node.connect(g); g.connect(this.sfxBus);
        src.start(t, Math.random() * 0.4); src.stop(t + L.dur + 0.02);
        continue;
      }
      const [f0, f1] = L.f || [440, 440];
      this.tone(L.wave || 'square', f0, f1, t, L.dur || 0.1, vol, L.duty, L.vib);
    }
  }
  tone(wave, f0, f1, t, dur, vol, duty, vib) {
    const c = this.ctx;
    const o = this.osc(wave, duty);
    o.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t + dur);
    if (vib) { const l = c.createOscillator(), lg = c.createGain(); l.frequency.value = vib.rate; lg.gain.value = vib.depth; l.connect(lg); lg.connect(o.frequency); l.start(t); l.stop(t + dur); }
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + 0.005);
    g.gain.setValueAtTime(vol, t + dur * 0.7); g.gain.exponentialRampToValueAtTime(0.0005, t + dur);
    o.connect(g); g.connect(this.sfxBus);
    o.start(t); o.stop(t + dur + 0.02);
  }
}
