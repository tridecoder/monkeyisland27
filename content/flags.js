// FLAGS GLOBALES de FE DE ERRATAS (biblia §5.5 y §9.2). ARCHIVO COMPARTIDO: no lo edita ningún autor de sala.
//
// Formato: nombre: 'tipo · lo pone (paquete · sala · cuándo) · lo leen'.
// Todos son booleanos salvo los marcados `int`.
// - En modo depuración (?debug=1) el motor avisa en consola ([flags] ...) cuando un script, una condición o el arte
//   lee o pone un flag que no está aquí ni en los `flags` locales de una sala.
// - Flags LOCALES de una sala (que nadie más lee): decláralos en tu archivo de lógica, `flags: { <sala>_algo: 'comentario' }`,
//   con el prefijo del id de la sala (p. ej. `office_microondas_visto`). Si un flag cruza de sala, NO lo inventes:
//   pídelo al jefe de guion (va en la biblia §5.5 y aquí).
// - Prefijos reservados del motor: `duel:<id>:won|perdido_n|empieza|floja`, `walkbox:<sala>.<id>`, `obj:<objetivo>`,
//   `ambient:<sala>.<id>` (no hace falta declararlos).
// - `node tools/check.mjs` comprueba estáticamente que todo flag usado en content/ existe.

const reps = {};
const repInfo = {
  rep_01: 'C · office · Mirar tablon', rep_02: 'C · catacumba · Aurora A3', rep_03: 'C · office · chisme nº 1 de Gertrudis',
  rep_04: 'C · office · chisme nº 2', rep_05: 'A · vestibulo · Celestino C4', rep_06: 'C · catacumba · Mirar fax_enmarcado',
  rep_07: 'B · pajarera · Mirar ordenador_gervasio (C también en el Acto III)', rep_08: 'B · pecera · Yoli Y2 (con cms_vivo)',
  rep_09: 'B · pecera · Anselmo [3] «¿Qué tal con Yoli?» (E2 §2.6; antes Nemesio)', rep_10: 'C · office · chisme nº 3', rep_11: 'B · pecera · Mirar ordenador_bruno (con silla_libre)',
  rep_12: 'A · cpd · Paco P3 (con cms_vivo)', rep_13: 'A · cpd · Rubén R2 (Acto III)', rep_14: 'C · office · chisme nº 4',
  // adenda 7.1 (R15/R16; Íñigo D4 al final del mazo)
  rep_15: 'P1 · cpd · Rubén «¿Te llegaban correos de Tadeo?» (plan §5.12; antes, portátil de Tadeo)',   // [P1]
  rep_16: 'P3 · administracion · Evaristo E_REVELA, paso 28 (E2 §5.2)',
};
for (const [k, v] of Object.entries(repInfo)) reps[k] = `bool · ${v} (con api.learnReply('${k}')) · módulo de duelo, libreta_replicas`;

// Flags de la adenda (§6.2): se inicializan en game.js `startFlags` (contadores a 0, booleanos a false).
export const ADENDA_FLAGS = [
  'evaristo_llamadas', 'evaristo_convoco', 'evaristo_escuchado',   // [E2: retirar en integración] evaristo_convoco (evaristo_lc ya no se inicializa) 'coma_bendecida', 'correo_evaristo_listo', 'tadeo_rv_n',
  'portatil_tadeo_n', 'anselmo_dijo_regla', 'herminia_de_alta', 'infografia_integrada',
  'custodia_regla', 'boli_muerto_cogido', 'custodia_ablandada', 'planta_oyo', 'planta_empujada_n',
  'rejilla_n', 'hoja_reservas_n', 'tele_n', 'rumor_firma_n', 'rumor_teodoro_n',   // [E2: retirar en integración] rumor_firma_n, planta_oyo
  'cuadro_plazas_n', 'piel_platano_n', 'rep_15', 'rep_16',
  // ENMIENDA E2 §10.2 (altas): contadores a 0 y booleanos a false desde el principio
  'office_error_n', 'aro_borja_hablar_n', 'aro_borja_mirar_n', 'maripaz_empujon_n', 'maripaz_popup_n',
  'ecosistema_interstitial', 'pantalla_comercial_n', 'bruno_con_banner',
];

export default {
  // ---------------------------------------------------------------- Acto I
  intro_vista: 'bool · A · vestibulo · fin de la intro 7.1 · A (no repetir intro)',
  celestino_dio_chicle: 'bool · A · vestibulo · Celestino C2 · A (ocultar C2), pistas',
  celestino_pista_gertrudis: 'bool · A · vestibulo · Celestino C3 · pistas (A)',
  tarjeta_con_chicle: 'bool · común (items.js) · Usar chicle con tarjeta_becario, en cualquier sala · A (organigrama, Mirar tarjeta)',
  foto_en_organigrama: 'bool · A · vestibulo · P01c · A (torno, Mirar organigrama y tarjeta)',
  torno_abierto: 'bool · A · vestibulo · P01d · A (ascensor), B (escena villano), pistas',
  inigo_presentado: 'bool · B · pecera · fin de la escena 7.2 · B',
  chaqueta_cogida: 'bool · B · pecera · P04a · B (ocultar hotspot de la chaqueta, sprite de la silla)',
  chaqueta_en_lector: 'bool · B · pajarera · P04b · B (sprite y Mirar del Lector Medio), D (Lector Medio en la Sala), A (poscréditos); actors.js (variante del Lector Medio)',
  silla_libre: 'bool · B · pajarera · P04b · B (ordenador_bruno, silla_ramirez), pistas',
  vio_ticket_3: 'bool · A · cpd · Mirar registro_tickets · B (enchufe_pantalla), pistas',
  cms_vivo: 'bool · B · pecera · P05b · A (Paco, contador), B (Yoli, Anselmo, pantalla), pistas',
  gertrudis_saludada: 'bool · C · office · primer «Buenas noches» · C, pistas, B (titular)',
  chisme_indice: 'int · C · office · +1 por saludo · C',
  aurora_conto_pasos: 'bool · C · catacumba · P03 · D (opción «siguientes pasos» de Gervasio), pistas',

  // ---------------------------------------------------------------- Acto II
  acto_2_iniciado: 'bool · C · catacumba · P03 · todos (ambiente por acto), pistas',
  aurora_hablo_fax: 'bool · C · catacumba · Aurora A2 o Hablar a Teodoro sin papel · pistas',
  reunion_terminada: 'bool · D · sala_amazonas · P06a · D (Sala vacía, planillo_mesa), B (Gervasio en la Pajarera, ordenador_gervasio, puerta_sala)',
  duelo_maripaz_ganado: 'bool · D · ecosistema · fin D1 · D (árbol de Maripaz)',
  casilla_hueco: 'bool · D · ecosistema · fin D1 · A (Mirar ficha), C (cierre), pistas',
  nota_gasto_presentada: 'bool · D · administracion · P08 · D (Begoña), pistas, B (titular)',
  bruno_sellado_frente: 'bool · D · administracion · concepto «Varios.» (opcional) · todos, opcional',
  fax_con_papel: 'bool · C · catacumba · P09 · C (Teodoro habla, duelo D2), pistas',
  vio_borde_perforado: 'bool · común (items.js) · Mirar mensaje_fp · A (Mirar papel_continuo)',
  casilla_fuente: 'bool · C · catacumba · P10a · B (ordenador_bruno), A (Mirar ficha), C (cierre), pistas',
  pieza_escrita: 'bool · B · pecera · P10b · D (Begoña), C (Teodoro), B, pistas',
  pieza_recortada: 'bool · D · administracion · P11 · C (cierre), A (Mirar pieza), pistas',
  paco_dio_manual: 'bool · A · cpd · Paco P2 · A (ocultar opción), C (remate D2), pistas',
  duelo_teodoro_ganado: 'bool · C · catacumba · fin D2 · C',
  casilla_firma: 'bool · C · catacumba · fin D2 con ficha, o Dar ficha tras ganar · A (Mirar ficha), C (cierre), pistas',
  pagina_cerrada: 'bool · C · catacumba · P12b · C, pistas',

  // ---------------------------------------------------------------- Acto III
  acto_3_iniciado: 'bool · C · catacumba · P12b · A (papel_continuo, armario_27), B (puerta_sala, Pajarera vacía), C (Gervasio en el Office), D (Sala del clímax), pistas',
  vio_armario_27: 'bool · B · pajarera · 3.ª Mirar a pantalla_titulator · B (Íñigo I4), pistas',
  titulator_mirar_n: 'int · B · pajarera · +1 por Mirar pantalla_titulator · B',
  ruben_encontrado: 'bool · A · cpd · P13 · A, D (Pilar de Eventos; album_eventos_hotspot), B (Anselmo [6] y [8]), pistas',
  oyo_descopear: 'bool · P4 · eventos · Pilar «¿Me prestas el álbum?» (el móvil de Borja dice «descopear», E2 §3.5) · P2 (opción «¿Y si... lo descopeamos?» de Anselmo, AN_ALBUM)',
  posit_descopeado: 'bool · B · pecera · P14b · B (Mirar kanban)',
  ruben_libre: 'bool · A · cpd · P14c · B (Rubén en la Pecera, puerta_sala), A (armario vacío), D (escena 7.4), pistas; actors.js (murmullos)',
  duelo_gervasio_ganado: 'bool · C · office · fin D3 · C',
  sala_abierta: 'bool · C · office · fin D3 · B (puerta_sala), pistas',
  duelo_inigo_ganado: 'bool · D · sala_amazonas · fin D4 · D (Empujar lector_medio), A (escena final)',
  lector_derribado: 'bool · D · sala_amazonas · P16b · D (escena final), A (7.5); actors.js (variante del Lector Medio, caído)',
  juego_terminado: 'bool · A · fin de créditos · todos (bloqueo de input), pistas',

  // ---------------------------------------------------------------- opcionales y contadores
  profecia_leida: 'bool · A · cpd · Tirar ventilador (opcional) · C (línea opcional de Teodoro)',
  abuela_llamadas: 'int · común (game.js) · +1 por Usar movil · game.js (saludo de la abuela)',
  celestino_ibex_n: 'int · A · vestibulo · +1 por entrada · A',
  paco_tickets: 'int · A · cpd · +1 por entrada; +318 al entrar la 1.ª vez tras cms_vivo · A (contador_tickets)',

  // ---------------------------------------------------------------- ADENDA «guiños de la casa» (§6.2): todos opcionales
  // (el walkthrough 5.4 no lee ninguno). Contadores = int, valor inicial 0; booleanos, false.
  evaristo_llamadas: 'int · A · común (avisos, game.js) · +1 por llamada de Evaristo (2.1) · A (cola de avisos, saludo de la abuela), C (línea opcional de 7.3a, ≥ 3)',
  // [E2: retirar en integración] sin lector en E2 (§10.2): la L2 se ha eliminado; mientras Administración (P3) lo lea,
  // game.js lo pone solo al entrar en una sala con acto_2_iniciado (puente; ver content/game.js `puenteE2`)
  evaristo_convoco: 'bool · P0 · game.js (puente E2: con acto_2_iniciado) · P3 (E0, opción 1, hasta reescribirla)',
  evaristo_escuchado: 'bool · P3 · administracion · E_REVELA, paso 28 (E2 §5.2) · P3 (Aurora, paso 32), P0 (pistas, ficha), P1 (armario, §5.4)',
  coma_bendecida: 'bool · P3 · catacumba · Aurora, paso 32 (E2 §5.3; a la vez que correo_evaristo_listo) · P3 (E0), P4 (clímax), P0 (pistas, ficha)',
  correo_evaristo_listo: 'bool · P3 · catacumba · paso 32, con give(correo_evaristo) (E2 §5.3) · P3 (E0 «¿Ha enviado ya el correo?»), P4 (clímax), P2 (titular); P1 (epílogo) deja de leerlo',
  // [E2: retirar en integración] la llamada LC ya no existe (E2 §5.3: el fax la sustituye); nadie lo pone
  evaristo_lc: 'bool · (retirado en E2) · nadie · nadie',
  tadeo_rv_n: 'int · P0 · game.js (sin aviso, E2 §7.4: llegan solos al correo al entrar en sala) · RV: que ya han llegado · P0 (Mirar movil, correo del móvil), P3 (murmullo de Aurora)',
  portatil_tadeo_n: 'int · D · ecosistema · +1 por Mirar portatil_tadeo · D',
  anselmo_dijo_regla: 'bool · P2 · pecera · momento 8 «Dos IAs» (E1.4.2) · P1 (Paco P_ALTA, MP1)',
  herminia_de_alta: 'bool · P1 · cpd · Paco P_ALTA «Herramienta.» (MP1) · P2 (anexión, Rubén en la Redacción, titular)',
  infografia_integrada: 'bool · B · pecera · AN_HERMINIA · B (cinta, pantalla, Leoncio, coro), A (epílogo, créditos)',
  custodia_regla: 'bool · C · office · CU_PARAQUE opción 4 · C (bolis_aurora, CU_CADAVER, Aurora)',
  boli_muerto_cogido: 'bool · C · catacumba · Coger bolis_aurora · C (no se vuelve a dar)',
  custodia_ablandada: 'bool · C · office · CU_DA · C (CU_DONDE), B (titular), A (créditos)',
  planta_oyo: 'bool · A · vestibulo · Hablar planta_plastico · A (Mirar planta; arranque del rumor A) · [E2: retirar en integración si no tiene otro lector] (fase B (1))',
  planta_empujada_n: 'int · A · vestibulo · +1 por Empujar planta_plastico · A',
  rejilla_n: 'int · A · cpd · +1 por Usar rejilla_cpd · A',
  hoja_reservas_n: 'int · B · pajarera · +1 por Mirar hoja_reservas · B',
  tele_n: 'int · D · sala_amazonas · +1 por Usar tele_amazonas / caja_cables · D',
  rumor_firma_n: 'int · A, C, D, B · lo suma quien cuenta el rumor A (8.1) · el siguiente de la cadena, A (epílogo, ≥ 4) · [E2: retirar en integración] (fase B (1): el rumor A desaparece)',
  rumor_teodoro_n: 'int · C, B, D · lo suma quien cuenta el rumor C (8.3) · el siguiente de la cadena, C (Teodoro, = 3)',
  cuadro_plazas_n: 'int · A · vestibulo · +1 por Mirar cuadro_plazas · A',
  piel_platano_n: 'int · D · ecosistema · +1 por Mirar piel_platano · D',

  // ---------------------------------------------------------------- EVENTOS: la Sala Polivalente (`eventos`, adenda §13)
  // Los tres contadores conservan su nombre de cuando Pilar vivía en el Ecosistema (ids intactos por encargo de dirección).
  ecosistema_entradas_n: 'int · D · eventos · +1 por entrada en la Sala Polivalente (rota la frase de Pilar con el ¡FLASH!) · D',
  ecosistema_sillas_n: 'int · D · eventos · +1 por «¿Cuántas sillas hay?» (Pilar) · D (crisis de la silla 113, murmullos)',
  ecosistema_gong_n: 'int · D · eventos · +1 por Usar/Empujar gong · D',
  eventos_silla_devuelta: 'bool · D · eventos · devolver silla_torcida a Comercial (micro-puzle opcional) · D (Pilar, Maripaz en ecosistema, arte)',
  eventos_croqueta: 'bool · D · eventos · Pilar regala la croqueta (premio del micro-puzle) · D (catering, Pilar)',

  // ---------------------------------------------------------------- ascensor con botonera (content/lib/ascensor.js)
  ascensor_viajes_n: 'int · común (lib/ascensor.js) · +1 por viaje en ascensor · rotación de las frases del ascensor',
  ascensor_negativas_n: 'int · común (lib/ascensor.js) · +1 por planta denegada · rotación de las negativas',

  // ---------------------------------------------------------------- el móvil de Bruno (content/lib/movil.js)
  movil_leidos: 'int · común (lib/movil.js) · bits de los correos leídos en el móvil (0-4 RV: de Tadeo, 8-10 fijos) · el menú del móvil',

  // ---------------------------------------------------------------- PLAN DE COMEDIA §3.4 (altas; las bajas, cuando las
  // salas dejen de usarlos). Los pone/lee cada paquete; el motor solo pone duel:<id>:* (no hace falta declararlos).
  cafetera_viral: 'bool · P3 · office · Gertrudis, 1.er saludo · P2 (Yoli, Íñigo), P1 (torno, epílogo), P0 (abuela, hitos)',
  cafetera_en_directo: 'bool · P3 · office · Gertrudis, el bis · P3 (3.er saludo, Vending con cms_vivo)',
  apagon_n: 'int · P2 · pecera · Tirar enchufe_pantalla sin vio_ticket_3 · P2 (escalada del apagón, titular)',
  bruno_con_chaqueta: 'bool · P0 · items.js · Usar chaqueta_ramirez sin destino · P2 (Redacción, Despachos), P0 (sprite de Bruno)',
  mercados_huido: 'bool · P3 · office · mercados_1 → «siguientes pasos» · P3 (táper), P2 (titular)',
  taper_dado: 'bool · P1 · cpd · Dar taper_huerfano a ruben · P1 (titular reactivo)',
  teodoro_intentos_n: 'int · P3 · catacumba · hablar/dar/usar con Teodoro sin fax_con_papel · P3 (el fax vomita la tarde)',
  fax_tecla_n: 'int · P3 · catacumba · teclas 1 y 3 del fax · P3 (Teodoro, Evaristo)',
  // [P2] ENMIENDA E1.4.5 (Redacción): paso 32 y momento 8
  herminia_midio: 'bool · P2 · pecera · paso 32, escena «Herminia mide la pieza» · P0 (ficha, abuela Recorte), P2 (portátil, Leoncio)',
  dos_ias_vista: 'bool · P2 · pecera · momento 8 «Dos IAs» (1.ª entrada con acto_3_iniciado) · P2 (Mirar portátil), extras',
  // ---------------------------------------------------------------- ENMIENDA E2 §10.2 (altas)
  office_error_n: 'int · P3 · office · L17: «¿Me da un café sin saludar?» antes de gertrudis_saludada (E-47…E-50) · P3',
  aro_borja_hablar_n: 'int · P4 · ecosistema · +1 por Hablar aro_borja (§3.2: 1.ª, 2.ª, 3.ª y siguientes) · P4',
  aro_borja_mirar_n: 'int · P4 · ecosistema · +1 por Mirar aro_borja (§3.2: rotación de la agenda) · P4',
  maripaz_empujon_n: 'int · P4 · ecosistema · +1 por Empujar a Maripaz (§4.4: 1.ª y siguientes) · P4',
  maripaz_popup_n: 'int · P4 · sala_amazonas · +1 por pop-up antes del menú de Maripaz (§4.2.1: X de 3 px, 1 px, sin X) · P4',
  ecosistema_interstitial: 'bool · P4 · ecosistema · el anuncio antes de entrar, una vez (§4.2.4) · P4',
  pantalla_comercial_n: 'int · P4 · ecosistema · +1 por Mirar pantalla_comercial (§4.4) · P4',
  bruno_con_banner: 'bool · P4 · sala_amazonas · gana D1 (adhesivo «SU ANUNCIO AQUÍ», §4.2.3) → false: P3 (Aurora lo despega, §4.2.6) · P0 (actors.js: variante con_banner de Bruno), P2 (Yoli, Gervasio), P3 (Aurora)',
  climax_entrada: 'bool · P4 · climax · entrada en el clímax (opcional: la hora del móvil pasa a 20:59) · P0 (hora)',
  abuela_obj: 'str · P0 · game.js pistas (engine/objetivos.js) · objetivo de la última pista · la abuela',
  abuela_nivel: 'int · P0 · game.js pistas · nivel 1-3 de la última pista · la abuela',
  // también prefijos reservados del motor: obj:<objetivo> (api.objetivo.marcar), obj:hora, ambient:<sala>.<id>

  // ---------------------------------------------------------------- réplicas del duelo (§6.3 + adenda 7.1)
  ...reps,
};
