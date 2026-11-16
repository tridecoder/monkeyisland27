// E7 · CONTRA — el código del diseño (ENMIENDA §2 y §5), como parches literales [fichero bajo la copia, viejo, nuevo].
// Lo aplica verifica_e7.mjs en la COPIA (nunca en el repo), DESPUÉS de la tabla de texto. Cada «viejo» debe aparecer
// exactamente una vez; si no, falla. Sirve de especificación ejecutable para los paquetes.
export const PARCHES = [
  // ------------------------------------------------------------------ I1 · flags.js
  ['content/flags.js',
    `'sala_becario_sin_turno', 'gertrudis_pregunta', 'vio_pegatina_fax', 'album_validado', 'columna_kanban',\n];`,
    `'sala_becario_sin_turno', 'gertrudis_pregunta', 'vio_pegatina_fax', 'album_validado', 'columna_kanban',\n  // ENMIENDA E7 (I1)\n  'oyo_papel_begona',\n];`],
  ['content/flags.js',
    `  // también prefijos reservados del motor`,
    `  // ---------------------------------------------------------------- ENMIENDA E7 (I1)\n  oyo_papel_begona: 'bool · E7 · catacumba (Aurora, «¿De dónde saco papel…?») o administracion (Begoña, «¿Me da unos folios?») · items.js (ficha: FIRMA)',\n  // también prefijos reservados del motor`],
  // ------------------------------------------------------------------ I1 · pistas.js (metas y salas; los textos van en la tabla)
  ['content/pistas.js',
    `  hff: 'Hueco, fuente y firma. Lo pone la ficha.',`,
    `  hff: 'Hueco, fuente y firma. Lo pone la ficha.',\n  nota: 'Teodoro no habla sin papel. Y en esta casa no queda un folio sin sellar.',   // E7 F1 (N6)`],
  ['content/pistas.js',
    `{ id: 'nota', acto: 2, hecho: 'nota_gasto_presentada', activo: 'acto_2_iniciado', salas: ['ecosistema', 'administracion'], meta: M.hff, niveles: [`,
    `{ id: 'nota', acto: 2, hecho: 'nota_gasto_presentada', activo: 'acto_2_iniciado', salas: ['catacumba', 'ecosistema', 'administracion'], meta: M.nota, niveles: [   // E7 F1`],
  // ------------------------------------------------------------------ I1 · items.js (la ficha)
  ['content/items.js',
    `    'FIRMA, hecho: «Trece con espacios. Cabe.»'],`,
    `    'FIRMA, hecho: «Trece con espacios. Cabe.»'],\n  firmaPapel: 'FIRMA: el fax no tiene papel. El papel, en esta casa, sale de Begoña.',   // E7 F1 (N11), con oyo_papel_begona`],
  ['content/items.js',
    `  out.push(FICHA.firma[f('casilla_firma') ? 2 : f('fax_con_papel') ? 1 : 0]);`,
    `  out.push(f('casilla_firma') ? FICHA.firma[2] : f('fax_con_papel') ? FICHA.firma[1] : f('oyo_papel_begona') ? FICHA.firmaPapel : FICHA.firma[0]);`],
  // ------------------------------------------------------------------ PB · catacumba.js (E1)
  ['content/rooms/catacumba.js',
    `          reply: 'Contestándole. Teodoro solo respeta al que le contesta mejor que él.' },\n`,
    `          reply: 'Contestándole. Teodoro solo respeta al que le contesta mejor que él.' },\n        // E7 F1 (E1): de dónde sale el papel. Dice qué falta y dónde; no qué hacer\n        { text: '¿De dónde saco papel para el fax?', if: '!fax_con_papel', once: true,\n          reply: 'Papel, en esta casa, solo gasta Begoña. Lo devuelve por triplicado.', setFlag: 'oyo_papel_begona' },\n`],
  // ------------------------------------------------------------------ PA · administracion.dialogos.js (E2, E3, F4)
  ['content/rooms/administracion.dialogos.js',
    `export default {\n  // ---------------------------------------------------------------- §7.6.2 Begoña`,
    `/** E7 F1 (E3): se entra al impreso por el sobre de azúcar (administracion.js \`sobreANota\`): sin el saludo. */\nexport const ENTRADA = { sobre: false };\n\nexport default {\n  // ---------------------------------------------------------------- §7.6.2 Begoña`],
  ['content/rooms/administracion.dialogos.js',
    `    onStart: async (api) => { await sayBe(api, 'Son las 19:07. Te quedan ocho minutos de existencia administrativa.'); },`,
    `    onStart: async (api) => {\n      if (ENTRADA.sobre) { ENTRADA.sobre = false; return; }        // E7 F1 (E3): por el sobre, directo al impreso\n      await sayBe(api, 'Son las 19:07. Te quedan ocho minutos de existencia administrativa.');\n    },`],
  ['content/rooms/administracion.dialogos.js',
    `          { text: 'Quiero presentar una nota de gasto.', if: '!nota_gasto_presentada', goto: 'B_NOTA' },\n`,
    `          { text: 'Quiero presentar una nota de gasto.', if: '!nota_gasto_presentada', goto: 'B_NOTA' },\n          // E7 F1 (E2): el papel de esta casa sale rechazado (qué falta, no qué hacer)\n          { text: '¿Me da unos folios? Son para el fax de Teodoro.', if: ['acto_2_iniciado', '!nota_gasto_presentada', '!fax_con_papel'],\n            once: true, reply: 'Folios no doy. De esta ventanilla solo sale papel rechazado.', setFlag: 'oyo_papel_begona' },\n`],
  ['content/rooms/administracion.dialogos.js',
    `            do: async (api) => {\n              await api.anim(api.player, 'reach', 400);    // E6 B9: Bruno mira el reloj; el gesto no se explica\n              await sayEv(api, 'Si tiene prisa, se lo pongo por escrito.');\n              api.sfx('typewriter');                       // (Teclea. Vuelve a su mesa.)\n              await api.wait(700);\n            } },`,
    `            do: async (api) => {\n              await api.anim(api.player, 'reach', 700);    // E7 F4: Bruno mira el móvil (más largo)\n              await sayEv(api, 'Si tiene prisa, se lo pongo por escrito.');\n              api.faceActor(EV, 'up');                     // (De espaldas. Lo pone por escrito, de verdad.)\n              for (let i = 0; i < 3; i++) { api.sfx('typewriter'); await api.wait(380); }\n              if (api.once('administracion_evaristo_por_escrito')) api.notice('Correo nuevo de Evaristo Salvedad: «Una cosita (1 de 3)».');\n            } },`],
  // ------------------------------------------------------------------ PA · administracion.js (E3)
  ['content/rooms/administracion.js',
    `import dialogos, { recorte } from './administracion.dialogos.js';`,
    `import dialogos, { recorte, ENTRADA } from './administracion.dialogos.js';`],
  ['content/rooms/administracion.js',
    `const sayEv = (api, t) => api.sayAs(EV, t);`,
    `const sayEv = (api, t) => api.sayAs(EV, t);\n/** E7 F1 (E3): el sobre de azúcar abre el impreso de la nota (la línea de Begoña es la de siempre). */\nconst sobreANota = async (api) => {\n  await sayBe(api, '¿Un sobre de azúcar? Sin nota de gasto, esto es azúcar.');\n  if (api.flag('nota_gasto_presentada')) return;\n  ENTRADA.sobre = true;\n  try { await api.dialog('begona', 'B_NOTA'); } finally { ENTRADA.sobre = false; }\n};`],
  ['content/rooms/administracion.js',
    `        'dar:sobre_azucar': async (api) => { await sayBe(api, '¿Un sobre de azúcar? Sin nota de gasto, esto es azúcar.'); },`,
    `        'dar:sobre_azucar': sobreANota, 'usar:sobre_azucar': sobreANota,   // E7 F1 (E3)`],
  ['content/rooms/administracion.js',
    `      mirar: async (api) => { await api.say(['Una ventanilla dentro de una oficina.', 'Nadie sabe por qué. Begoña la defiende igual.']); },`,
    `      mirar: async (api) => { await api.say(['Una ventanilla dentro de una oficina.', 'Nadie sabe por qué. Begoña la defiende igual.']); },\n      'usar:sobre_azucar': sobreANota, 'dar:sobre_azucar': sobreANota,   // E7 F1 (E3)`],
  // ------------------------------------------------------------------ PC · sala_amazonas.js (tele: Usar = Hablar)
  ['content/rooms/sala_amazonas.js',
    `async function hablarTele(api) {`,
    `// E7 F2: la ventana «sin turno» (sin la pregunta del Vending y con la reunión abierta)
const sinTurno = (api) => !!api.flag('sala_becario_sin_turno') && !api.flag('gertrudis_pregunta') && !api.flag('reunion_terminada');
/** E7 F2: la tele busca señal sola; la pista «wifi y rencor» pasa a Mirar y a Cerrar (literal de hoy). */
async function teleBuscando(api) {
  api.setState('tele_amazonas', 'buscando');
  api.sfx('click');
  await api.wait(1000);
  await api.say('«BUSCANDO SEÑAL». Alguien con wifi y rencor la encontraría enseguida.');
  api.setState('tele_amazonas', 'normal');
}
async function hablarTele(api, { usar = false } = {}) {`],
  ['content/rooms/sala_amazonas.js',
    `  if (api.flag('sala_becario_sin_turno') && !api.flag('reunion_terminada')) {\n    await api.dialog('tele_sala');`,
    `  if (api.flag('sala_becario_sin_turno') && !api.flag('reunion_terminada')) {\n    if (usar) { api.setState('tele_amazonas', 'buscando'); api.sfx('click'); }   // E7 F2: Usar la enciende (nieve) y abre el árbol\n    await api.dialog('tele_sala');`],
  ['content/rooms/sala_amazonas.js',
    `async function teleSegunTurno(api, deHoy) {`,
    `async function teleSegunTurno(api, deHoy, { usar = false } = {}) {`],
  ['content/rooms/sala_amazonas.js',
    `  if (api.flag('sala_becario_sin_turno') && !api.flag('gertrudis_pregunta') && !api.flag('reunion_terminada')) {\n    api.setState('tele_amazonas', 'buscando');\n    api.sfx('click');\n    await api.wait(1000);\n    await api.say('«BUSCANDO SEÑAL». Alguien con wifi y rencor la encontraría enseguida.');\n    api.setState('tele_amazonas', 'normal');\n    return;\n  }`,
    `  if (sinTurno(api)) { if (usar) await hablarTele(api, { usar: true }); else await teleBuscando(api); return; }   // E7 F2`],
  ['content/rooms/sala_amazonas.js',
    `      mirar: async (api) => {\n        if (api.getState('tele_amazonas') === 'entrada_1')`,
    `      mirar: async (api) => {\n        if (sinTurno(api)) { await teleBuscando(api); return; }   // E7 F2: la pista, donde se mira\n        if (api.getState('tele_amazonas') === 'entrada_1')`],
  ['content/rooms/sala_amazonas.js',
    `      usar: (api) => teleSegunTurno(api, usarTele),\n      hablar: hablarTele,`,
    `      usar: (api) => teleSegunTurno(api, usarTele, { usar: true }),   // E7 F2: con «sin turno», Usar = Hablar\n      hablar: (api) => hablarTele(api),`],
  ['content/rooms/sala_amazonas.js',
    `      usar: (api) => teleSegunTurno(api, usarTele),   // «Usar con tele_amazonas: igual que Usar la tele»`,
    `      usar: (api) => teleSegunTurno(api, usarTele, { usar: true }),   // «Usar con tele_amazonas: igual que Usar la tele» (E7 F2)`],
  // ------------------------------------------------------------------ PD · pajarera.js (D3 con trozos)
  ['content/rooms/pajarera.js',
    `  intro: ['Mejor por escrito. Que conste que lo has pedido tú.'],`,
    `  // E7 · «no le pises la frase» (engine/duel.js \`aTiempo\`): Gervasio escribe a trozos; contestar antes de que acabe le
  // corta (no cuenta fallo) y el ataque vuelve a empezar. El R07 empieza como el R03 y acaba en el R07.
  aTiempo: {
    ms: 1300, escribiendo: 'escribiendo', interrumpe: 'Me has interrumpido. Se apunta.', sostener: 'movil',
    trozos: {
      R07: ['Esto se necesitaba para...', 'para cuando...', 'me consta que ya lo hablamos.'],
      R03: ['El acta se necesitaba para...', 'para...'],
      R01: ['Ya se dijo en el otro correo...', 'ese que no se leyó...'],
      R05: ['Lo del acta, entre tú y yo...', 'que no salga de esta puerta.'],
    },
  },
  intro: ['Mejor por escrito. Que conste que lo has pedido tú.'],`],
  // ------------------------------------------------------------------ PE · pecera.dialogos.js (F6: dos tiempos; la tabla quita tres cadenas)
  ['content/rooms/pecera.dialogos.js',
    `      await api.sayAs(A, 'Nos hemos quedado sin IA de la casa.');\n      // (Leoncio pone las dos manos encima del paquete. No dice nada.)\n      api.faceActor(L, 'up');\n      await api.anim(L, 'reach', 1500);\n      await talk(api, [['H', 'alta de usuario: no · propietaria: Infografía']]);\n`,
    `      await api.sayAs(A, 'Nos hemos quedado sin IA de la casa.');   // E7 F6: se queda (el gesto no se lee seguro a 320×200)\n      // (Mira el portátil, aparta la vista, lo vuelve a mirar.)\n      api.faceActor(A, 'right'); await api.wait(700); api.faceActor(A, 'left'); await api.wait(400);\n      // (Leoncio pone las dos manos encima del paquete. No dice nada.)\n      api.faceActor(L, 'up');\n      await api.anim(L, 'reach', 1500);\n      await talk(api, [['H', 'alta de usuario: no · propietaria: Infografía']]);\n      await api.wait(600);                           // E7 F6: Anselmo se va sin decir nada\n`],
];

// ------------------------------------------------------------------ P0 · engine (F3 y aTiempo)
export const MOTOR = [
  ['engine/core.js',
    `      this.itemPick = { prompt: prompt || 'Usar objeto:', resolve: id => { this.itemPick = null; res(id); this.checkIdle(); } };`,
    `      // E7 F3: al resolverse, la barra no se queda con «Usar <objeto>» (hover del inventario sin mover el ratón)\n      this.itemPick = { prompt: prompt || 'Usar objeto:', resolve: id => { this.itemPick = null; this.ui.hover = null; this.ui.sentence = null; res(id); this.checkIdle(); } };`],
  ['engine/core.js',
    `    let h = this.ui.hover;\n`,
    `    let h = this.ui.hover;\n    if (h && h.kind === 'inv' && !this.state.inventory.includes(h.id)) h = this.ui.hover = null;   // E7 F3\n`],
  // aTiempo (E7): datos del rival; todo opt-in
  ['engine/duel.js',
    `export const LARGA_MS = 1200;                // E6 §6.1: lo que se ve cortado en el cuerpo tras elegir la réplica larga`,
    `export const LARGA_MS = 1200;                // E6 §6.1: lo que se ve cortado en el cuerpo tras elegir la réplica larga
export const TROZO_MS = 1300;                // E7 \`aTiempo\`: lo mínimo entre trozo y trozo (game.timedMs lo sube si no da para leerlo)
/** E7 \`aTiempo\`: lo que dice Bruno al ser cortado: hasta el primer signo (. , : ; ? !) o las tres primeras palabras, + «...». */
export function cortada(t) {
  const s = String(t).replace(/^[¡¿«"]+/, '');
  const m = s.match(/^[^.,:;?!]+/);
  const w = s.split(/\\s+/).slice(0, 3).join(' ');
  const base = (m && m[0].length <= w.length ? m[0] : w).replace(/[.,:;?!…\\s]+$/, '');
  return base + '...';
}`],
  ['engine/duel.js',
    `  game.inDialog = (game.inDialog || 0) + 1;\n  game.duelActive = { id };\n  let won = false;`,
    `  game.inDialog = (game.inDialog || 0) + 1;\n  const activo = game.duelActive = { id };\n  const gen0 = game.gen;\n  let tl = null;                                  // E7 \`aTiempo\`: la escritura en curso { done, cancel }\n  const vivo = () => game.duelActive === activo && game.gen === gen0;\n  const paraEscritura = () => {\n    if (tl) tl.cancel = true;\n    if (S.escribiendo) { S.escribiendo = null; info.escribiendo = false; if (opp.aTiempo && opp.aTiempo.sostener) api.sostener(actorId, null); }\n  };\n  let won = false;`],
  ['engine/duel.js',
    `      info.phase = 'reply'; info.attack = pid; S.phase = 'reply';\n      S.body = attack; info.body = attack;\n      await say('rival', attack);\n`,
    `      info.phase = 'reply'; info.attack = pid; S.phase = 'reply';
      const tz = opp.aTiempo && opp.aTiempo.trozos && asArray(opp.aTiempo.trozos[pid]);
      if (tz && tz.length) {
        // E7 \`aTiempo\`: el globo dice el primer trozo; el resto se escribe en el cuerpo mientras el menú está abierto
        S.cola = true; S.body = tz[0]; info.body = tz[0];
        await say('rival', tz[0]);
        tl = { done: tz.length < 2 || game.instant, cancel: false };
        if (tl.done) { S.body = tz.join(' '); info.body = S.body; }
        else {
          const yo = tl, A = opp.aTiempo;
          S.escribiendo = A.escribiendo || '...'; info.escribiendo = true;
          if (A.sostener) api.sostener(actorId, A.sostener);
          (async () => {
            for (let k = 1; k < tz.length; k++) {
              await game.sleep(game.timedMs('duelo', tz[k], A.ms || TROZO_MS));
              if (yo.cancel || !vivo()) return;
              S.body = tz.slice(0, k + 1).join(' '); info.body = S.body; api.sfx('click');
            }
            if (yo.cancel || !vivo()) return;
            yo.done = true; S.escribiendo = null; info.escribiendo = false;
            if (A.sostener) api.sostener(actorId, null);
            game.log.push({ who: 'aviso', name: fromName, text: S.body, room: game.state && game.state.room, t: Math.round(game.time) });
          })();
        }
      } else {
        S.cola = false; tl = null;
        S.body = attack; info.body = attack;
        await say('rival', attack);
      }
`],
  ['engine/duel.js',
    `      const ch = opts[Math.max(0, i)];\n      info.options = null; info.optionPairs = null; info.correctIndex = -1; info.weakIndex = -1;\n      S.round++;`,
    `      const ch = opts[Math.max(0, i)];\n      info.options = null; info.optionPairs = null; info.correctIndex = -1; info.weakIndex = -1;
      if (tl && !tl.done) {
        // E7 \`aTiempo\`: ha contestado mientras el rival escribía. No es fallo: ni RE:, ni CC, ni mazo, ni comodín, ni ronda.
        paraEscritura(); tl = null;
        S.interrumpeN = (S.interrumpeN || 0) + 1; info.interrumpeN = S.interrumpeN; info.phase = 'interrumpido';
        await say('player', cortada(ch.text));
        await say('rival', S.interrumpeN === 1 && opp.aTiempo.interrumpe ? opp.aTiempo.interrumpe : next('taunt'));
        info.phase = 'reply';
        continue;                                   // el mismo ataque, desde el primer trozo
      }
      tl = null;
      S.round++;`],
  ['engine/duel.js',
    `  } finally {\n    game.inDialog = Math.max(0, (game.inDialog || 1) - 1);`,
    `  } finally {\n    paraEscritura();                                // E7 \`aTiempo\`: ninguna escritura sobrevive al duelo\n    game.inDialog = Math.max(0, (game.inDialog || 1) - 1);`],
  ['engine/duel.js',
    `    id, opponent: actorId, phase: 'intro', attack: null, options: null, optionPairs: null, correctIndex: -1, weakIndex: -1, correctItem: null, body: null,`,
    `    id, opponent: actorId, phase: 'intro', attack: null, options: null, optionPairs: null, correctIndex: -1, weakIndex: -1, correctItem: null, body: null,\n    escribiendo: false, interrumpeN: 0,             // E7 \`aTiempo\``],
  ['engine/duel.js',
    `  let body = S.body ? wrap(citar(S.body), bodyW) : [];\n  if (body.length > 2) body = [body[0], fit(body.slice(1).join(' '), bodyW)];`,
    `  let body = S.body ? wrap(citar(S.body), bodyW) : [];\n  if (body.length > 2) body = S.cola ? ['...' + body[body.length - 2], body[body.length - 1]]   // E7: el trozo nuevo, siempre a la vista\n    : [body[0], fit(body.slice(1).join(' '), bodyW)];`],
  ['engine/duel.js',
    `  drawText(g, sc, x + w - 4, y - 1, fax ? C.barText : '#ffffff', { outline: null, align: 'right' });`,
    `  drawText(g, sc, x + w - 4, y - 1, fax ? C.barText : '#ffffff', { outline: null, align: 'right' });
  if (S.escribiendo) {
    // E7 \`aTiempo\`: «escribiendo» + 1-3 puntos en la barra del título, entre el título y el marcador (como un chat)
    const x0 = x + 3 + measure(fax ? 'FAX · TALLERES' : 'RESPONDER A TODOS') + 8, x1 = x + w - 4 - measure(sc) - 8;
    const t = S.escribiendo + '.'.repeat(1 + Math.floor(game.realTime / 400) % 3);
    drawText(g, t, Math.round((x0 + x1 - measure(S.escribiendo + '...')) / 2), y - 1, fax ? C.barText : '#c8d8ff', { outline: null });
  }`],
];
