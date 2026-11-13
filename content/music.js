// FE DE ERRATAS - music tracks for the chiptune sequencer (see docs/CONTENT_SCHEMA.md#music).
// Each token is one step (steps = steps per beat). '.' rest, '-' hold, drums: k kick, o snare, x hat, h open hat.
// All melodies are original. Leitmotif of the game: the "hook" rises a minor third then a fourth
// (A4 C5 F5 in F major) and is reused, in other keys and moods, in most room tracks.
//
// Small helpers keep the bass/chord channels in sync with the progression of every track:
//   line(prog, tpl, oct)  tpl tokens: R root, T third, F fifth, S seventh, O octave, L fifth below (bass register)
//                         or, with oct (e.g. 4), digits 0..3 = chord tones (root, 3rd, 5th, 7th/octave).
//                         A bar written 'Gm+C7' holds two chords (each uses the first half of tpl).

const PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const pcOf = r => (PC[r[0]] + (r[1] === '#' ? 1 : r[1] === 'b' ? -1 : 0) + 12) % 12;
const toMidi = n => { const m = /^([A-G][#b]?)(-?\d)$/.exec(n); return 12 * (+m[2] + 1) + pcOf(m[1]); };
const toNote = m => NAMES[((m % 12) + 12) % 12] + (Math.floor(m / 12) - 1);
const isNote = t => /^[A-G][#b]?-?\d$/.test(t);
/** transpose a note string by n semitones */
const tp = (s, n) => (n ? s.split(/\s+/).map(t => (isNote(t) ? toNote(toMidi(t) + n) : t)).join(' ') : s);
/** transpose a chord name ('Gm+C7') by n semitones */
const tpc = (name, n) => name.split('+').map(p => {
  const m = /^([A-G][#b]?)(.*)$/.exec(p);
  return NAMES[(pcOf(m[1]) + n + 120) % 12] + m[2];
}).join('+');
const QUAL = { '': [0, 4, 7], m: [0, 3, 7], 7: [0, 4, 7, 10], m7: [0, 3, 7, 10], M7: [0, 4, 7, 11], dim: [0, 3, 6, 9] };
function chord(name, oct) {
  const m = /^([A-G][#b]?)(.*)$/.exec(name);
  const iv = QUAL[m[2]], pc = pcOf(m[1]);
  const base = 36 + pc, top = 12 * (oct + 1) + pc;
  const b = { R: toNote(base), T: toNote(base + iv[1]), F: toNote(base + iv[2]), S: toNote(base + (iv[3] ?? 12)), O: toNote(base + 12), L: toNote(base - 5) };
  const t = [0, 1, 2, 3].map(i => toNote(top + (iv[i] ?? 12)));
  return { b, t };
}
function line(prog, tpl, oct) {
  const toks = tpl.trim().split(/\s+/), out = [];
  for (const entry of prog) {
    const parts = entry.split('+'), per = toks.length / parts.length;
    parts.forEach(nm => {
      const c = chord(nm, oct ?? 4);
      for (const t of toks.slice(0, parts.length > 1 ? per : toks.length)) {
        if (oct === undefined && c.b[t]) out.push(c.b[t]);
        else if (oct !== undefined && /^\d$/.test(t)) out.push(c.t[+t] ?? c.t[0]);
        else out.push(t);
      }
    });
    out.push('|');
  }
  return out.join(' ');
}
const bass = (prog, tpl) => line(prog, tpl);
const comp = (prog, tpl, oct = 4) => line(prog, tpl, oct);
const J = bars => bars.join(' | ');
/** drum bars: base pattern, with `fill` on every `every`-th bar */
const dr = (n, base, fill, every = 4) => J(Array.from({ length: n }, (_, i) => ((i + 1) % every === 0 ? fill : base)));
/** the same bar repeated, optionally with different bars at given indices */
const bars = (n, base, special = {}) => J(Array.from({ length: n }, (_, i) => special[i] ?? base));

// ---------------------------------------------------------------------------------------------- main theme (F major)
const TA = [
  'A4 C5 F5 - - A5 G5 F5',
  'E5 - C5 - . C5 D5 E5',
  'D5 - F5 - Bb4 - D5 F5',
  'E5 - - - . C5 E5 G5',
  'A5 - F5 - . A5 G5 F5',
  'D5 - F5 - A5 - G5 F5',
  'D5 - Bb4 - E5 - C5 .',
  'F5 - - - - - . .',
];
const TB = [
  'D5 - F5 - A5 - F5 D5',
  'Bb5 - G5 - D5 - Bb4 D5',
  'E5 - G5 - Bb5 - G5 E5',
  'A5 - F5 - C5 - A4 C5',
  'D5 - F5 - Bb5 - A5 G5',
  'Bb5 - G5 - E5 - G5 Bb5',
  'A5 - F5 - C5 . A4 C5',
  'G4 - Bb4 - C5 - . .',
];
const TA2 = [...TA.slice(0, 5), 'D5 - F5 - A5 - F5 A5', 'Bb5 - A5 - G5 - E5 -', 'F5 - - - - - . .'];
const PA = ['F', 'F', 'Bb', 'C7', 'F', 'Dm', 'Gm+C7', 'F'];
const PB = ['Dm', 'Gm', 'C7', 'F', 'Bb', 'Gm+C7', 'F+C7', 'C7'];
const TIT_PROG = [...PA, ...PB, ...PA];

// ---------------------------------------------------------------------------------------------- tracks
const tracks = {
  // 24 bars, 118 bpm. Calypso-ish A/B/A' with typewriter hats and a carriage-return fill.
  m_titulo: {
    bpm: 118, steps: 2, vol: 0.9,
    channels: [
      { wave: 'square', duty: 0.25, vol: 0.095, vib: { rate: 5, depth: 0.003 }, notes: J([...TA, ...TB, ...TA2]) },
      { wave: 'square', duty: 0.125, vol: 0.045, gate: 0.35, notes: comp(TIT_PROG, '. 0 . 1 . 2 . 1') },
      { wave: 'triangle', vol: 0.22, notes: bass(TIT_PROG, 'R . . F . . O .') },
      { wave: 'noise', vol: 0.05, notes: dr(24, 'k . x . o . x x', 'k . x . o o o h', 8) },
    ],
  },

  // rainy lobby, sleepy guard: slow, soft, the hook yawns in D minor.
  m_vestibulo: (() => {
    const prog = ['Dm', 'Dm', 'Bb', 'A7', 'Dm', 'Gm', 'A7', 'Dm', 'Bb', 'Bb', 'Gm', 'A7', 'Dm', 'Gm', 'A7+Dm', 'Dm'];
    return {
      bpm: 76, steps: 2, vol: 0.8,
      channels: [
        { wave: 'triangle', vol: 0.13, attack: 0.03, vib: { rate: 4, depth: 0.004 }, notes: J([
          'A4 - - - C5 - D5 -', 'F5 - - - E5 - D5 -', 'D5 - - - Bb4 - - -', 'C#5 - - - A4 - . .',
          'A4 - - - C5 - D5 -', 'G5 - - - D5 - Bb4 -', 'C#5 - E5 - A5 - G5 -', 'F5 - - - - - . .',
          'D5 - - - F5 - Bb5 -', 'Bb5 - A5 - F5 - D5 -', 'G5 - - - D5 - Bb4 -', 'C#5 - D5 - E5 - . .',
          'A4 - - - C5 - D5 -', 'G5 - F5 - D5 - Bb4 -', 'E5 - C#5 - D5 - - -', 'D5 - - - - - . .']) },
        { wave: 'sine', vol: 0.06, gate: 0.5, notes: comp(prog, '0 . 1 . 2 . 1 .') },
        { wave: 'triangle', vol: 0.2, notes: bass(prog, 'R - - - F - - -') },
        { wave: 'noise', vol: 0.03, notes: bars(16, '. . x . . x . .', { 0: 'k . x . . x . .', 4: 'k . x . . x . .', 8: 'k . x . . x . x', 12: 'k . x . . x . .', 15: 'k . . . . . . .' }) },
      ],
    };
  })(),

  // web newsroom: nervous staccato arpeggios, metrics pings, relentless hats.
  m_pecera: (() => {
    const prog = ['Am', 'Am', 'F', 'G', 'Am', 'Am', 'F', 'E7', 'Dm', 'Dm', 'Am', 'Am', 'F', 'G', 'E7', 'E7'];
    return {
      bpm: 160, steps: 2, vol: 0.8,
      channels: [
        { wave: 'square', duty: 0.125, vol: 0.075, gate: 0.5, notes: J([
          'A4 E5 A4 E5 C5 E5 A4 .', 'A4 E5 A4 E5 D5 C5 B4 .', 'A4 C5 F5 . A4 C5 F5 .', 'G5 . D5 G5 . D5 B4 .',
          'A4 E5 A4 E5 C5 E5 A5 .', 'A5 . G5 . E5 . C5 .', 'A4 C5 F5 . A5 . F5 C5', 'G#4 B4 E5 . G#5 . E5 B4',
          'D5 F5 A5 F5 D5 F5 A5 F5', 'D5 F5 A5 F5 E5 D5 C5 .', 'C5 E5 A5 E5 C5 E5 A5 E5', 'C5 E5 A5 . G5 E5 C5 .',
          'A4 C5 F5 C5 A4 C5 F5 C5', 'B4 D5 G5 D5 B4 D5 G5 D5', 'G#4 B4 E5 B4 G#4 B4 E5 .', 'G#4 B4 D5 E5 . D5 B4 G#4']) },
        { wave: 'square', duty: 0.5, vol: 0.03, gate: 0.4, notes: comp(prog, '. 0 . 1 . 2 . 1') },
        { wave: 'triangle', vol: 0.2, gate: 0.6, notes: bass(prog, 'R R O R R O R O') },
        { wave: 'noise', vol: 0.045, notes: dr(16, 'k x x x o x x x', 'k x o x o o o h') },
        { wave: 'sine', vol: 0.035, gate: 0.3, notes: bars(16, '. . . . . . . .', { 1: '. . . E5 . . . .', 3: '. . . . . . E5 A5', 5: '. . . E5 . . . .', 7: '. . . . . . E5 A5', 9: '. . . E5 . . . .', 11: '. . . . . . E5 A5', 13: '. . . E5 . . . .', 15: '. . . . E5 . A5 E5' }) },
      ],
    };
  })(),

  // break room: lazy bossa in C, hook as a shrug (E G C).
  m_office: (() => {
    const prog = ['CM7', 'A7', 'Dm7', 'G7', 'CM7', 'A7', 'Dm7', 'G7', 'Em7', 'A7', 'Dm7', 'G7', 'FM7', 'Em7+A7', 'Dm7', 'G7'];
    return {
      bpm: 100, steps: 2, vol: 0.85,
      channels: [
        { wave: 'square', duty: 0.25, vol: 0.07, gate: 0.85, attack: 0.01, notes: J([
          'E5 - . G5 - . C5 -', 'C#5 - . E5 - . G5 -', 'F5 - . A5 - . D5 -', 'B4 - D5 - F5 - . .',
          'E5 - . G5 - . B4 -', 'C#5 - . E5 - . A4 -', 'D5 - . F5 - . C5 -', 'B4 - . D5 - . G4 -',
          'G4 - . B4 - . E5 -', 'E5 - . C#5 - . A4 -', 'F5 - . D5 - . A4 -', 'D5 - . B4 - . G4 -',
          'A4 - . C5 - . E5 -', 'G5 - E5 - C#5 - A4 -', 'D5 - . F5 - . A5 -', 'G5 - . D5 - . B4 -']) },
        { wave: 'sine', vol: 0.07, gate: 0.5, notes: comp(prog, '. 1 . 2 3 . 2 .') },
        { wave: 'triangle', vol: 0.22, notes: bass(prog, 'R . . F R . . F') },
        { wave: 'noise', vol: 0.035, notes: bars(16, 'k . . x . . x .', { 1: '. . x . . x . x', 3: '. . x . . x . x', 5: '. . x . . x . x', 7: '. . x . . x . x', 9: '. . x . . x . x', 11: '. . x . . x . x', 13: '. . x . . x . x', 15: '. . x . . x . x' }) },
      ],
    };
  })(),

  // print newsroom: a dignified waltz in D minor/F major, typewriter ticks on the off beats.
  m_catacumba: (() => {
    const prog = ['Dm', 'Dm', 'A7', 'Dm', 'Gm', 'Dm', 'A7', 'Dm', 'F', 'F', 'C7', 'F', 'Bb', 'Gm', 'A7', 'A7'];
    return {
      bpm: 126, steps: 2, vol: 0.85,
      channels: [
        { wave: 'square', duty: 0.25, vol: 0.09, vib: { rate: 5, depth: 0.004 }, notes: J([
          'D5 - F5 - A5 -', 'G5 - F5 - E5 -', 'E5 - C#5 - A4 -', 'D5 - - - . .',
          'Bb5 - G5 - D5 -', 'F5 - D5 - A4 -', 'C#5 - E5 - G5 -', 'F5 - - - . .',
          'C5 - F5 - A5 -', 'G5 - F5 - E5 -', 'E5 - G5 - Bb5 -', 'A5 - - - F5 -',
          'D5 - F5 - Bb5 -', 'Bb5 - A5 - G5 -', 'E5 - A5 - G5 -', 'F5 - E5 - C#5 -']) },
        { wave: 'square', duty: 0.5, vol: 0.04, gate: 0.4, notes: comp(prog, '. . 1 . 2 .') },
        { wave: 'triangle', vol: 0.2, notes: bass(prog, 'R . . . F .') },
        { wave: 'noise', vol: 0.04, notes: dr(16, 'k . x . x .', 'k . x . x x') },
      ],
    };
  })(),

  // management floor: pompous brass fanfare in Bb with organ-ish doubling.
  m_pajarera: (() => {
    const prog = ['Bb', 'Bb', 'F', 'Bb', 'Eb', 'Eb', 'Bb', 'F7', 'Gm', 'Cm', 'F7', 'F7', 'Bb', 'Eb', 'F7', 'Bb'];
    const lead = J([
      'D5 - F5 - Bb5 - - -', 'A5 - Bb5 - A5 - F5 -', 'C5 - F5 - A5 - - -', 'G5 - F5 - D5 - Bb4 -',
      'Eb5 - G5 - Bb5 - - -', 'Bb5 - Ab5 - G5 - Eb5 -', 'D5 - F5 - G5 - Bb5 -', 'A5 - G5 - F5 - Eb5 -',
      'G5 - D5 - Bb4 - D5 -', 'Eb5 - G5 - Eb5 - C5 -', 'A5 - F5 - Eb5 - C5 -', 'A4 - C5 - Eb5 - . .',
      'D5 - F5 - Bb5 - - -', 'Bb5 - G5 - Eb5 - G5 -', 'C5 - Eb5 - A5 - G5 -', 'D5 - - - Bb4 - . .']);
    return {
      bpm: 92, steps: 2, vol: 0.85,
      channels: [
        { wave: 'square', duty: 0.5, vol: 0.085, gate: 0.8, notes: lead },
        { wave: 'sawtooth', vol: 0.03, transpose: -12, gate: 0.8, notes: lead },
        { wave: 'triangle', vol: 0.07, notes: comp(prog, '1 - - - 2 - - -') },
        { wave: 'triangle', vol: 0.22, notes: bass(prog, 'R . O . R . O .') },
        { wave: 'noise', vol: 0.05, notes: dr(16, 'k . o . k . o .', 'k . o . k k o h') },
      ],
    };
  })(),

  // meeting room: elevator muzak, vibraphone and brushes in Eb, hook as a polite nod (G Bb Eb).
  m_sala_amazonas: (() => {
    const prog = ['EbM7', 'Cm7', 'Fm7', 'Bb7', 'EbM7', 'Cm7', 'Fm7+Bb7', 'EbM7', 'AbM7', 'Gm7', 'Fm7', 'Bb7', 'Gm7', 'C7', 'Fm7+Bb7', 'EbM7+Bb7'];
    return {
      bpm: 88, steps: 2, vol: 0.8,
      channels: [
        { wave: 'sine', vol: 0.13, attack: 0.005, decay: 0.3, sustain: 0.35, release: 0.2, vib: { rate: 5.5, depth: 0.004 }, notes: J([
          'G4 - Bb4 - Eb5 - - -', 'G5 - Eb5 - C5 - Bb4 -', 'Ab4 - C5 - F5 - - -', 'F5 - D5 - Ab4 - Bb4 -',
          'Bb4 - D5 - G5 - - -', 'Eb5 - G5 - Bb4 - C5 -', 'Ab4 - C5 - D5 - F5 -', 'Eb5 - - - . . . .',
          'C5 - Eb5 - G5 - - -', 'Bb4 - D5 - F5 - D5 -', 'Ab4 - C5 - Eb5 - C5 -', 'D5 - F5 - Ab5 - - -',
          'G4 - Bb4 - D5 - F5 -', 'E5 - G5 - Bb4 - - -', 'F5 - C5 - D5 - Ab4 -', 'G4 - Bb4 - F5 - D5 -']) },
        { wave: 'triangle', vol: 0.05, gate: 0.6, notes: comp(prog, '. . 1 . . . 2 .') },
        { wave: 'triangle', vol: 0.18, notes: bass(prog, 'R . T . F . T .') },
        { wave: 'noise', vol: 0.018, notes: bars(16, 'x . x . x . x .') },
      ],
    };
  })(),

  // marketing & sales: upbeat corporate jingle in G, hook as a mission statement (B D G).
  m_ecosistema: (() => {
    const prog = ['G', 'D', 'Em', 'C', 'G', 'D', 'C', 'D', 'Em', 'C', 'G', 'D', 'C', 'D', 'G', 'G'];
    return {
      bpm: 128, steps: 2, vol: 0.85,
      channels: [
        { wave: 'square', duty: 0.25, vol: 0.09, gate: 0.75, notes: J([
          'B4 D5 G5 - . G5 A5 G5', 'F#5 - D5 - . D5 E5 F#5', 'G5 - E5 - . E5 F#5 G5', 'E5 - G5 - E5 - C5 -',
          'B4 D5 G5 - . G5 A5 G5', 'F#5 - A5 - F#5 - D5 -', 'E5 - G5 - A5 - G5 -', 'A4 - D5 - F#5 - . .',
          'G5 - B4 - E5 - G5 -', 'G5 - E5 - C5 - E5 -', 'D5 - G5 - B5 - A5 G5', 'A5 - F#5 - D5 - A4 -',
          'G4 - C5 - E5 - G5 -', 'A4 - D5 - F#5 - A5 -', 'B4 D5 G5 - B5 - G5 -', 'G5 - - - . . . .']) },
        { wave: 'square', duty: 0.5, vol: 0.035, gate: 0.4, notes: comp(prog, '. 0 . 1 . 0 . 1') },
        { wave: 'triangle', vol: 0.22, gate: 0.6, notes: bass(prog, 'R . R . R . R .') },
        { wave: 'noise', vol: 0.05, notes: dr(16, 'k x o x k x o x', 'k x o x o o o h') },
      ],
    };
  })(),

  // events room (Sala Polivalente): the main hook (A C F) as a brass-like fanfare over a snare roll that keeps
  // building up... and the loop ends on a held C7 that never resolves: always five minutes from starting.
  m_eventos: (() => {
    const prog = ['F', 'F', 'Bb', 'C7', 'F', 'F', 'Bb', 'C7', 'Dm', 'Bb', 'F', 'C7', 'Bb', 'C7', 'Bb', 'C7'];
    const lead = J([
      'A4 C5 F5 - - . . .', 'A4 C5 F5 - A5 - G5 -', 'F5 - D5 - Bb4 - . .', 'C5 - E5 - G5 - - -',
      'A4 C5 F5 - - . . .', 'A4 C5 F5 - C6 - A5 -', 'Bb5 - F5 - D5 - . .', 'E5 - G5 - Bb5 - - -',
      'D5 F5 A5 - - . A5 -', 'Bb5 - F5 - D5 - . .', 'A4 C5 F5 - A5 - C6 -', 'Bb5 - G5 - E5 - C5 -',
      'D5 - F5 - Bb5 - . .', 'C5 - E5 - G5 - Bb5 -', 'D5 - F5 - Bb5 - D6 -', 'C6 - - - - - - -']);
    return {
      bpm: 112, steps: 2, vol: 0.85,
      channels: [
        { wave: 'square', duty: 0.25, vol: 0.085, gate: 0.85, notes: lead },
        { wave: 'sawtooth', vol: 0.022, transpose: -12, gate: 0.7, notes: lead },
        { wave: 'square', duty: 0.125, vol: 0.035, gate: 0.4, notes: comp(prog, '0 . 1 . 2 . 1 .') },
        { wave: 'triangle', vol: 0.21, gate: 0.6, notes: bass(prog, 'R . R . F . R .') },
        { wave: 'noise', vol: 0.05, notes: dr(16, 'k . x . o . x .', 'o o o o o o o o') },
      ],
    };
  })(),

  // administration: slow bureaucratic march in C minor, staccato "stamp" lead.
  m_administracion: (() => {
    const prog = ['Cm', 'Cm', 'G7', 'Cm', 'Fm', 'Cm', 'G7', 'Cm', 'Ab', 'Fm', 'G7', 'G7', 'Cm', 'Fm', 'G7', 'Cm'];
    return {
      bpm: 84, steps: 2, vol: 0.85,
      channels: [
        { wave: 'square', duty: 0.5, vol: 0.085, gate: 0.5, notes: J([
          'G4 - Bb4 - Eb5 - . .', 'D5 - C5 - Bb4 - . .', 'B4 - D5 - F5 - . .', 'Eb5 - D5 - C5 - . .',
          'Ab4 - C5 - F5 - . .', 'G5 - Eb5 - C5 - . .', 'D5 - F5 - G5 - B4 -', 'C5 - - - . . . .',
          'C5 - Eb5 - Ab5 - . .', 'Ab5 - F5 - C5 - . .', 'B4 - D5 - F5 - G5 -', 'F5 - D5 - B4 - . .',
          'G4 - Bb4 - Eb5 - . .', 'Ab4 - C5 - F5 - . .', 'B4 - D5 - F5 - G5 -', 'Eb5 - D5 - C5 - . .']) },
        { wave: 'square', duty: 0.125, vol: 0.035, gate: 0.4, notes: comp(prog, '. 1 . 2 . 1 . 2') },
        { wave: 'triangle', vol: 0.22, gate: 0.6, notes: bass(prog, 'R . F . R . F .') },
        { wave: 'noise', vol: 0.05, notes: dr(16, 'k . o . k . o .', 'k . o . o . o o') },
      ],
    };
  })(),

  // server basement: eerie drone on D, tritone pad, sparse bleeps (the hook is hidden in them), server fan hiss.
  m_cpd: (() => {
    const droneRoots = ['D2', 'D2', 'D2', 'D2', 'D#2', 'D#2', 'D2', 'D2', 'D2', 'D2', 'G#2', 'G#2', 'D#2', 'D2', 'D2', 'D2'];
    const padRoots = ['G#3', 'G#3', 'G#3', 'G#3', 'A3', 'A3', 'G#3', 'G#3', 'G#3', 'G#3', 'D3', 'D3', 'A3', 'G#3', 'G#3', 'G#3'];
    return {
      bpm: 90, steps: 2, vol: 0.8,
      channels: [
        { wave: 'square', duty: 0.125, vol: 0.05, gate: 0.3, notes: J([
          '. . . . . . . .', 'D5 . . . F5 . . .', '. . . . A#5 . . .', '. . . . . . . .',
          'C#5 . . . E5 . . .', 'G5 . . . . . A#4 .', 'D5 . . . F5 . . .', '. . . . A#5 . . .',
          '. . . . . . . .', 'F#5 . . . . . . .', 'G#5 . . . C5 . . .', '. . . . . . F#5 .',
          'E5 . . . . . G5 .', 'D5 . F5 . A#5 . . .', '. . . . . . . .', '. . . . . . D5 .']) },
        { wave: 'sine', vol: 0.05, attack: 0.3, release: 0.3, notes: J(padRoots.map(n => n + ' - - - - - - -')) },
        { wave: 'triangle', vol: 0.2, vib: { rate: 3, depth: 0.004 }, notes: J(droneRoots.map(n => n + ' - - - - - - -')) },
        { wave: 'square', duty: 0.5, vol: 0.03, gate: 0.2, notes: bars(16, '. . . . . . . .', { 0: 'D4 . D4 . . D4 . .', 1: 'D4 . D4 . . D4 . .', 4: 'D4 . . D4 . . D4 .', 5: 'D4 . . D4 . . D4 .', 8: 'A3 . D4 . . D4 . .', 9: 'D4 . D4 . . D4 . .', 12: 'D4 D4 . D4 . . D4 .', 13: 'D4 . D4 . . D4 . .' }) },
        { wave: 'noise', vol: 0.015, notes: bars(16, 'x . x . x . x .') },
      ],
    };
  })(),

  // email duel: tense tango/duel groove in G minor.
  m_duelo: (() => {
    const prog = ['Gm', 'Gm', 'D7', 'Gm', 'Cm', 'Gm', 'D7', 'D7', 'Eb', 'Cm', 'D7', 'Gm', 'Cm', 'Gm', 'D7+Gm', 'D7'];
    return {
      bpm: 132, steps: 2, vol: 0.85,
      channels: [
        { wave: 'square', duty: 0.25, vol: 0.09, gate: 0.6, notes: J([
          'D5 . F5 . Bb5 . A5 G5', 'G5 . F5 . D5 - - .', 'A4 . D5 . F#5 . A5 .', 'G5 - - - . . . .',
          'C5 . Eb5 . G5 . Eb5 .', 'Bb4 . D5 . G5 . D5 .', 'A4 . C5 . F#5 . E5 D5', 'F#5 - - - . . . .',
          'Bb4 . Eb5 . G5 . Eb5 .', 'G5 . Eb5 . C5 . . .', 'A4 . D5 . F#5 . A5 .', 'Bb5 . A5 . G5 . D5 .',
          'C5 . Eb5 . G5 . Bb5 .', 'D5 . F5 . Bb5 . A5 G5', 'A5 . F#5 . G5 - - .', 'F#5 . . D5 . . A4 .']) },
        { wave: 'square', duty: 0.125, vol: 0.04, gate: 0.35, notes: comp(prog, '. 1 . . 2 . . 1') },
        { wave: 'triangle', vol: 0.22, gate: 0.6, notes: bass(prog, 'R . . R . . R .') },
        { wave: 'noise', vol: 0.05, notes: dr(16, 'k . o x k . o x', 'k x o x o o o h') },
      ],
    };
  })(),

  // climax: the main theme in G at 152 bpm, doubled, with a driving arpeggio and four-on-the-floor pulse.
  m_climax: (() => {
    const prog = [...PA, ...PB].map(c => tpc(c, 2));
    const lead = tp(J([...TA, ...TB]), 2);
    return {
      bpm: 152, steps: 2, vol: 0.9,
      channels: [
        { wave: 'square', duty: 0.25, vol: 0.09, gate: 0.8, notes: lead },
        { wave: 'square', duty: 0.5, vol: 0.03, transpose: -12, gate: 0.8, notes: lead },
        { wave: 'square', duty: 0.125, vol: 0.04, gate: 0.45, notes: comp(prog, '0 1 2 1 0 1 2 1', 4) },
        { wave: 'triangle', vol: 0.22, gate: 0.6, notes: bass(prog, 'R R O R R O R O') },
        { wave: 'noise', vol: 0.055, notes: dr(16, 'k x o x k x o x', 'k x o x o o o h') },
      ],
    };
  })(),

  // final: slow, warm reprise in F. Same hook, soft pulse, sine doubling, a long resolved last note.
  m_final: (() => {
    const prog = [...PA, ...PB];
    const lead = J([...TA, ...TB.slice(0, 7), 'F5 - - - - - - -']);
    const finalProg = [...prog.slice(0, 15), 'F'];
    return {
      bpm: 76, steps: 2, vol: 0.9,
      channels: [
        { wave: 'square', duty: 0.5, vol: 0.07, attack: 0.02, gate: 0.95, vib: { rate: 5, depth: 0.004 }, notes: lead },
        { wave: 'sine', vol: 0.07, transpose: -12, attack: 0.03, gate: 0.95, notes: lead },
        { wave: 'sine', vol: 0.045, gate: 0.6, notes: comp(finalProg, '0 1 2 1 0 1 2 1', 4) },
        { wave: 'triangle', vol: 0.2, notes: bass(finalProg, 'R - - - F - - -') },
        { wave: 'noise', vol: 0.025, notes: bars(16, 'k . . . . . x .', { 15: 'k . . . . . . .' }) },
      ],
    };
  })(),

  // credits: full celebratory reprise, A B in F then A B up a tone (32 bars), full band.
  m_creditos: (() => {
    const p1 = [...PA, ...PB], p2 = p1.map(c => tpc(c, 2));
    const prog = [...p1, ...p2];
    const l1 = J([...TA, ...TB]);
    const lead = l1 + ' | ' + tp(l1, 2);
    return {
      bpm: 132, steps: 2, vol: 0.9,
      channels: [
        { wave: 'square', duty: 0.25, vol: 0.095, vib: { rate: 5, depth: 0.003 }, notes: lead },
        { wave: 'sawtooth', vol: 0.025, transpose: -12, gate: 0.8, notes: lead },
        { wave: 'square', duty: 0.125, vol: 0.045, gate: 0.35, notes: comp(prog, '. 0 . 1 . 2 . 1') },
        { wave: 'triangle', vol: 0.22, notes: bass(prog, 'R . R F R . O F') },
        { wave: 'noise', vol: 0.055, notes: dr(32, 'k x o x k x o x', 'k x o x o o o h', 4) },
        { wave: 'sine', vol: 0.04, gate: 0.4, notes: comp(prog, '2 . . . . . . .', 4) },
      ],
    };
  })(),
};

export default {
  ...tracks,
  // aliases kept so older content that still uses the demo ids keeps working
  titulo: tracks.m_titulo,
  pasillo: tracks.m_pecera,
  despacho: tracks.m_pajarera,
  duelo: tracks.m_duelo,
  final: tracks.m_final,
};
