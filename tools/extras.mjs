#!/usr/bin/env node
// Walkthrough de EXTRAS: reproduce el recorrido de la ENMIENDA E6 (walk-data.mjs, 49 pasos) INTERCALANDO los pasos X de
// la tabla del plan §3.5 (con la ENMIENDA E1.9, E2 §10.1 —XE5, XE6—, los informes E2 de P1-P4, E5 §7.4 —XE5-1…11— y
// E6 §11.1 —XE6-1…5— y E7 §6 —XE7-…—) en su sitio (`tras: N` = justo
// después del paso N; `tras: 'XE3'` = después de ese paso X).
//   node tools/extras.mjs              todo, hasta la tarjeta FE DE ERRATAS y los créditos
//   node tools/extras.mjs --hasta=XE3  se para (con éxito) tras ese paso X (o tras el paso numérico, p. ej. --hasta=20)
//   node tools/extras.mjs --lento      sin modo rápido y con capturas
// Tras cada paso se comprueban sus resultados. Las llamadas de Evaristo (E2: L1, L3, L4, L5), los «RV:» de Tadeo y los rumores
// salen solos (entrar en salas / Hablar): el test cierra el globo y sigue (walk-lib.mjs `startDismisser`) y comprueba los
// CONTADORES en los puntos de control (filas «—»).
// Acciones y formato de `esp`: ver la cabecera de walkthrough.mjs; además `['perder']` (pierde el duelo abierto con flojas)
// y `esp.log: ['texto', …]` (cada texto debe salir en el registro durante ese paso; `who:texto` exige además quién lo dice).
// E5: `['guardar', hueco]` / `['cargar', hueco]` (para probar varias vías desde el mismo punto y volver al recorrido),
// `['lento']` / `['rapido']` (texto real o modo rápido) y `['esperar', cond, ms]` (salta globos hasta que `cond`, una
// expresión JS sobre `__game`, sea cierta). `esp.nolog` = textos que NO deben salir en el paso.
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from './serve.mjs';
import { STEPS } from './walk-data.mjs';
import { createRunner, StepFail } from './walk-lib.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const args = Object.fromEntries(process.argv.slice(2).filter(a => a.startsWith('--')).map(a => { const [k, v] = a.slice(2).split('='); return [k, v ?? true]; }));

const V = (verbo, obj) => ['verbo', verbo, obj];
const O = (t) => ['opcion', t];
const SALIR = ['cerrar'];
// ------------------------------------------------------------------ plan §3.5 + E1.9 + E2 §10.1 (y los informes E2 P1-P4)
// `tras` = paso del recorrido de 49 pasos de E6 (walk-data.mjs); renumerados desde E5 (E6 §7.1: el 28 y el 29 se funden).
const X = [
  // Vestíbulo (se quedan; E2 fase B (1): sin rumor A, la planta solo se acuerda de que le hablaste)
  { n: 'X1', tras: 7, sala: 'vestibulo', txt: 'Hablar planta_plastico (flag local; sin rumor A)', acc: [V('hablar', 'planta_plastico')], esp: { flags: ['vestibulo_planta_oyo'] } },
  { n: 'X2', tras: 7, sala: 'vestibulo', txt: 'Empujar planta_plastico', acc: [V('empujar', 'planta_plastico')], esp: { flags: { planta_empujada_n: 1 } } },
  { n: 'X4', tras: 7, sala: 'vestibulo', txt: 'Mirar rama_diseno · Usar altavoz_ibex', acc: [V('mirar', 'rama_diseno'), V('usar', 'altavoz_ibex')], esp: {} },
  { n: 'X4b', tras: 7, sala: 'vestibulo', txt: 'Mirar cuadro_plazas ×3 · Hablar celestino → plaza de garaje', acc: [V('mirar', 'cuadro_plazas'), V('mirar', 'cuadro_plazas'), V('mirar', 'cuadro_plazas'), V('hablar', 'celestino'), O('¿Cómo se consigue una plaza de garaje?'), SALIR], esp: { flags: { cuadro_plazas_n: 3 } } },
  // §4.3 Ramírez ha vuelto
  { n: 'XM3a', tras: 9, sala: 'pecera', txt: 'Usar chaqueta_ramirez (sin destino): Bruno se la pone', acc: [V('usar', 'chaqueta_ramirez')], esp: { flags: { bruno_con_chaqueta: true }, tiene: ['chaqueta_ramirez'] } },
  { n: 'XM3b', tras: 'XM3a', sala: 'pajarera', txt: '(entrar en Despachos) → Íñigo le confunde; Bruno se la quita', acc: [['ir', 'pajarera']], esp: { flags: { bruno_con_chaqueta: false }, tiene: ['chaqueta_ramirez'] } },
  { n: '—13', tras: 13, sala: 'pecera', txt: 'Control: la llamada L1 ya salió (en la primera entrada sin escena)', acc: [], esp: { flags: { evaristo_llamadas: 1 } } },
  // E1.9 · XE1: Leoncio y Herminia (E2 §2.2: la pantalla dice «HERMINIA (IA) › »)
  { n: 'XE1', tras: 13, sala: 'pecera', txt: 'Hablar leoncio_quesitos → «¿Me hace un gráfico a mí?» (sale la pantalla de Herminia)', acc: [V('hablar', 'leoncio_quesitos'), O('¿Me hace un gráfico a mí?'), SALIR], esp: { log: ['herminia_portatil:HERMINIA (IA) › Bruno · aportación a la planta'] } },
  { n: 'XM1', tras: 15, sala: 'pecera', txt: '(entrar en la Redacción) → reacción viral de Yoli', acc: [['ir', 'pecera']], esp: { flags: ['cafetera_viral'] } },
  // §4.2 el apagón (sin el ticket nº 3: escalada, sin CMS)
  { n: 'XM2', tras: 20, sala: 'pecera', txt: 'Tirar enchufe_pantalla ×2 más tras el apagón 1 del paso 20 (sin el ticket nº 3): escalada n = 2 y 3; E2: sin L2', acc: [['ir', 'pecera'], V('tirar', 'enchufe_pantalla'), V('tirar', 'enchufe_pantalla')], esp: { flags: { apagon_n: 3, cms_vivo: false, evaristo_llamadas: 1 }, log: ['Te paso a BLOQUEADO.', 'Eso huele a Eutimio.'] } },
  { n: 'XE2', tras: 20, sala: 'pecera', txt: 'Hablar anselmo_monolito → «¿Por qué invades la sección de Leoncio?»', acc: [V('hablar', 'anselmo_monolito'), O('¿Por qué invades la sección de Leoncio?'), SALIR], esp: {} },
  { n: '—17', tras: 17, sala: 'catacumba', txt: 'Control: A_MENU llevó antes el rumor C1 (Aurora)', acc: [], esp: { flags: { rumor_teodoro_n: 1 } } },
  { n: 'X6', tras: 20, sala: 'pecera', txt: 'Custodia → «¿Me deja un boli?» → «¿Y cómo se consigue un boli aquí?»', acc: [['ir', 'pecera'], V('hablar', 'custodia_precinto'), O('¿Me deja un boli?'), O('¿Y cómo se consigue un boli aquí?'), SALIR], esp: { flags: ['custodia_regla'] } },
  { n: 'X11', tras: 23, sala: 'cpd', txt: 'Usar rejilla_cpd ×2 (E2 §7.4: el hito del apagón ya no se narra; sin hito pendiente, las dos cuentan)', acc: [V('usar', 'rejilla_cpd'), V('usar', 'rejilla_cpd')], esp: { flags: { rejilla_n: 2 } } },
  { n: '—24', tras: 24, sala: 'pecera', txt: 'Control: Yoli ya no lleva el rumor C (E2 §7.4): sigue en 1', acc: [], esp: { flags: { rumor_teodoro_n: 1 } } },
  { n: 'X9', tras: 25, sala: 'pecera', txt: 'Abrir bandeja_diseno (sin flag cruzado)', acc: [V('abrir', 'bandeja_diseno')], esp: { flags: { pecera_bandeja_abierta: true } } },
  { n: 'X11b', tras: 25, sala: 'pecera', txt: 'Hablar valentin_reticula ×2 (cameo mudo: «Está en la bandeja.»)', acc: [V('hablar', 'valentin_reticula'), V('hablar', 'valentin_reticula')], esp: { log: ['valentin_reticula:Está en la bandeja.'] } },
  // §7.7 perder D1 una vez (la revancha la gana el paso 30); E2 §4.2.1: el pop-up sale antes del menú (1.ª vez)
  { n: 'XM7', tras: 28, sala: 'sala_amazonas', txt: 'Maripaz (pop-up 1.º) → D1 perdido (tres flojas)', acc: [V('hablar', 'maripaz_remitido'), O('Siestatón no ha confirmado la página 7.'), ['perder'], SALIR], esp: { flags: { 'duel:maripaz:perdido_n': 1, casilla_hueco: false, maripaz_popup_n: 1 } } },
  // §4.4 el fugitivo de Mercados y el táper (tras ganar D1, para no romper el paso 30)
  { n: 'XM4a', tras: 29, sala: 'office', txt: 'Hablar mercados_1 → «¿Y cuáles son los siguientes pasos?» · Coger taper_suelo', acc: [['ir', 'office'], V('hablar', 'mercados_1'), O('¿Y cuáles son los siguientes pasos?'), SALIR, V('coger', 'taper_suelo')], esp: { flags: ['mercados_huido'], tiene: ['taper_huerfano'] } },
  // E2 §3 y §4.4 (P4): Marketing y Comercial tras D1: el anuncio de entrada, el aro de Borja, la pantalla y el rumor C2
  { n: 'XP4a', tras: 30, sala: 'ecosistema', txt: '(entrar: anuncio de 5 s) · Hablar aro_borja ×3', acc: [['ir', 'ecosistema'], V('hablar', 'aro_borja'), V('hablar', 'aro_borja'), V('hablar', 'aro_borja')], esp: { flags: { aro_borja_hablar_n: 3, ecosistema_interstitial: true } } },
  { n: 'XP4b', tras: 30, sala: 'ecosistema', txt: 'Mirar pantalla_comercial (plano detalle de la portada)', acc: [V('mirar', 'pantalla_comercial')], esp: { flags: { pantalla_comercial_n: 1 } } },
  { n: '—C3', tras: 30, sala: 'ecosistema', txt: 'Hablar maripaz_remitido (de vuelta en Marketing tras D1) → rumor C2', acc: [V('hablar', 'maripaz_remitido'), SALIR], esp: { flags: { rumor_teodoro_n: 2 } } },
  { n: 'X18b', tras: 30, sala: 'administracion', txt: 'Hablar begona_triplicado → «¿Le han pedido algo raro hoy?»', acc: [['ir', 'administracion'], V('hablar', 'begona_triplicado'), O('¿Le han pedido algo raro hoy?'), SALIR], esp: {} },
  // E2 §10.1 · XE5: la prisa no rompe nada (se repite sin coste); el paso 32 escucha entero después
  { n: 'XE5', tras: 30, sala: 'administracion', txt: 'Evaristo → «¿Para qué me ha llamado?» → «¿Falta mucho?»', acc: [V('hablar', 'evaristo_salvedad'), O('¿Para qué me ha llamado?'), O('¿Falta mucho?'), SALIR], esp: { flags: { evaristo_escuchado: false } } },
  { n: 'X20', tras: 32, sala: 'catacumba', txt: 'Coger bolis_aurora', acc: [V('coger', 'bolis_aurora')], esp: { tiene: ['boli_muerto'], flags: ['boli_muerto_cogido'] } },
  // E6 §11.1 · XE6-4: D2 con la réplica larga dos veces (nunca es fallo) y la corta; luego se carga y el paso 36 gana como siempre
  { n: 'XE6-4', tras: 35, sala: 'catacumba', txt: '[E6] D2: R06, R02, R09 larga ×2 («NO CABE…», taunt; 0 fallos), R09 corta, manual', acc: [['guardar', 'xe6_35'], V('hablar', 'teodoro_cuerpodoce'), O('Quiero firmar en tu página 7.'), ['duelo', ['R06', 'R02', 'R09:larga', 'R09:larga', 'R09', { objeto: 'manual_fax' }]], ['sinFallos'], SALIR], esp: { flags: ['duelo_teodoro_ganado', 'casilla_firma'], log: ['NO CABE. REPITA EN TREINTA Y OCHO.', 'bruno:Tráeme el contexto.', '...CABE.'] } },
  { n: 'XE6-4b', tras: 'XE6-4', sala: 'catacumba', txt: '[E6] (cargar la partida del paso 35)', acc: [['cargar', 'xe6_35']], esp: { flags: { duelo_teodoro_ganado: false, coma_bendecida: true } } },
  // E2 §10.1 · XE6: el correo de Evaristo a Begoña (no se gasta: es el tercer remate de D4)
  { n: 'XE6', tras: 36, sala: 'administracion', txt: 'Dar correo_evaristo a begona_triplicado (no se gasta)', acc: [['ir', 'administracion'], ['dar', 'correo_evaristo', 'begona_triplicado'], SALIR], esp: { tiene: ['correo_evaristo'], log: ['begona_triplicado:Una copia de un correo. Esto ya es casi un triplicado.'] } },
  { n: '—T0', tras: 36, sala: 'catacumba', txt: 'Control: T0 llevó antes el desmentido C de Teodoro (cadena Aurora → Maripaz → Teodoro)', acc: [], esp: { flags: { rumor_teodoro_n: 2, catacumba_desmentido_c: true } } },
  // §4.5 el fax de teclas
  { n: 'XM5', tras: 37, sala: 'catacumba', txt: 'Usar pieza_opa con fax → «1: GOYITA», de nuevo → «3: CONTROLLING»', acc: [['ir', 'catacumba'], ['usar', 'pieza_opa', 'fax'], O('1: GOYITA'), SALIR, ['usar', 'pieza_opa', 'fax'], O('3: CONTROLLING'), SALIR], esp: { flags: { fax_tecla_n: 2, pieza_recortada: false } } },
  { n: 'X23', tras: 39, sala: 'pecera', txt: 'Dar boli_muerto a custodia_precinto → «Para apuntar lo que me digan.» (E137)', acc: [['ir', 'pecera'], ['dar', 'boli_muerto', 'custodia_precinto'], O('Para apuntar lo que me digan.'), SALIR], esp: { flags: ['custodia_ablandada', 'dos_ias_vista'], notiene: ['boli_muerto'] } },
  { n: 'X24', tras: 39, sala: 'pecera', txt: 'Custodia → «¿Dónde está...?» → «¿Dónde está Ramírez?» → «Ya está.»', acc: [V('hablar', 'custodia_precinto'), O('¿Dónde está...?'), O('¿Dónde está Ramírez?'), O('Ya está.'), SALIR], esp: { log: ['Desayunando.'] } },
  { n: 'XM4b', tras: 40, sala: 'cpd', txt: 'El táper huérfano, a Brais (se entrega en la escena del armario si Bruno lo lleva)', acc: [], esp: { flags: ['taper_dado'], notiene: ['taper_huerfano'] } },
  // E1.5 / E1.9 · MP1 «Alta en cuarenta segundos» y la anexión
  { n: 'XE3', tras: 41, sala: 'cpd', txt: 'Eutimio → «¿Me das de alta a una becaria? Se llama Herminia.» → «Herramienta.»', acc: [V('hablar', 'paco_ticket'), O('¿Me das de alta a una becaria? Se llama Herminia.'), O('Herramienta.'), SALIR], esp: { flags: ['herminia_de_alta'] } },
  { n: 'XE4', tras: 'XE3', sala: 'pecera', txt: '(entrar en la Redacción) → anexión', acc: [['ir', 'pecera']], esp: { flags: ['infografia_integrada'] } },
  { n: 'X16', tras: 43, sala: 'ecosistema', txt: 'Mirar portatil_tadeo ×4 (con Brais encontrado: la réplica R15)', acc: [['ir', 'ecosistema'], V('mirar', 'portatil_tadeo'), V('mirar', 'portatil_tadeo'), V('mirar', 'portatil_tadeo'), V('mirar', 'portatil_tadeo')], esp: { flags: { portatil_tadeo_n: 4, rep_15: true } } },
  // ------------------------------------------------------------------ ENMIENDA E5 §7.4 (XE5-1…11)
  // XE5-11 · a oscuras (ventana real; los verbos con el texto rápido): Yoli, Anselmo, la taza «NO» y la salida al Vending
  // (no sale). Se vuelve a la partida guardada antes del apagón para que el paso 20 lo haga como siempre.
  { n: 'XE5-11', tras: 19, sala: 'pecera', txt: '[E5] A oscuras: Hablar Yoli · Hablar Anselmo · Coger taza «NO» · Ir al Vending (no sale)', acc: [['guardar', 'xe5_19'], ['ir', 'pecera'], ['oscuras'], V('hablar', 'yoli_tendencias'), V('hablar', 'anselmo_monolito'), V('coger', 'taza_no'), V('ir', 'pecera_a_office')], esp: { sala: 'pecera', flags: { pecera_oscuras: true, apagon_n: 1 }, log: ['yoli_tendencias:¡Chsss! Estoy contando.', 'anselmo_monolito:No me tapes la linterna. Voy a mi enchufe.', 'No.', 'No veo nada. Solo a Yoli, a la luz del monitor, contando.'] } },
  { n: 'XE5-11b', tras: 'XE5-11', sala: 'catacumba', txt: '[E5] (cargar la partida de antes del apagón)', acc: [['cargar', 'xe5_19']], esp: { sala: 'catacumba', flags: { apagon_n: false, pecera_oscuras: false, vio_pegatina_fax: true } } },
  // XE6-1 · el corte «MIENTRAS, EN LA REDACCIÓN»: regletero → R-3 sin apagón previo (apagon_n = 0): plano, Yoli y coro
  { n: 'XE6-1', tras: 'XE5-11b', sala: 'cpd', txt: '[E6] Regletero → R-3 sin apagón previo: corte «MIENTRAS, EN LA REDACCIÓN»', acc: [['guardar', 'xe6_19'], ['ir', 'cpd'], V('tirar', 'regleta_r3'), O('R-3')], esp: { flags: { cms_vivo: true, cpd_corte_visto: true }, log: ['yoli_tendencias:¡Estamos ciegos! ¿Hay alguien leyendo? ¿HAY ALGUIEN AHÍ FUERA?', '...Ha entrado una pieza. ¡Ha entrado una pieza! ¡El CMS va!', '¡Ha sido Diseño!'] } },
  // XE6-2 · el camino del registro (ticket 3 + Tirar enchufe): a oscuras, Yoli dice sus dos líneas
  { n: 'XE6-2', tras: 'XE6-1', sala: 'pecera', txt: '[E6] Camino del registro: Mirar registro (ticket 3) → Tirar enchufe: Yoli, a oscuras', acc: [['cargar', 'xe6_19'], ['ir', 'cpd'], V('mirar', 'registro_tickets'), ['ir', 'pecera'], V('tirar', 'enchufe_pantalla')], esp: { flags: { vio_ticket_3: true, cms_vivo: true, cpd_corte_visto: false }, log: ['yoli_tendencias:¡Estamos ciegos! ¿Hay alguien leyendo? ¿HAY ALGUIEN AHÍ FUERA?', 'yoli_tendencias:...Ha entrado una pieza. ¡Ha entrado una pieza! ¡El CMS va!'], nolog: ['Plano detalle: MIENTRAS'] } },
  { n: 'XE6-2b', tras: 'XE6-2', sala: 'catacumba', txt: '[E6] (cargar la partida del paso 19)', acc: [['cargar', 'xe6_19']], esp: { sala: 'catacumba', flags: { cms_vivo: false, vio_ticket_3: false, apagon_n: false } } },
  // XE5-5 · los cuatro fallos del regletero (R-1, R-2, R-4 suben la cuenta; R-5 no se tira) y ninguno pone cms_vivo
  { n: 'XE5-5', tras: 20, sala: 'cpd', txt: '[E5] Regletero: R-1, R-2, R-4 y R-5 (fallos; sin cms_vivo)', acc: [['ir', 'cpd'], V('tirar', 'regleta_r3'), O('R-1'), V('tirar', 'regleta_r3'), O('R-2'), V('tirar', 'regleta_r3'), O('R-4'), V('tirar', 'regleta_r3'), O('R-5')], esp: { flags: { cms_vivo: false, cpd_regleta_mal_n: 3 }, log: ['Esa es la de las nóminas.', '¡Ascensor parado en mitad de la jugada!', 'gertrudis:E-55: UN SEGUNDO SIN CORRIENTE.', 'Pone «NUNCA».'] } },
  // XE5-8 · Eutimio sin pegatina, dos veces (se quita la pegatina vista para probarlo y se vuelve a la partida)
  { n: 'XE5-8', tras: 21, sala: 'cpd', txt: '[E5] Eutimio sin pegatina ×2: dos negativas y sin manual', acc: [['guardar', 'xe5_21'], ['flag', 'vio_pegatina_fax', false], V('hablar', 'paco_ticket'), O('¿Sabes algo del fax'), SALIR, V('hablar', 'paco_ticket'), O('¿Sabes algo del fax'), SALIR], esp: { notiene: ['manual_fax'], flags: { paco_dio_manual: false }, log: ['¿Qué fax? Sin número de ticket, para mí no hay fax.', 'Todo lo que mantengo lleva mi pegatina. Ese fax también.'] } },
  { n: 'XE5-8b', tras: 'XE5-8', sala: 'cpd', txt: '[E5] (cargar)', acc: [['cargar', 'xe5_21']], esp: { flags: ['vio_pegatina_fax', 'cms_vivo'] } },
  // XE5-9 · el papel del 27 en el Acto II, dos tirones (sin Brais)
  { n: 'XE5-9', tras: 23, sala: 'cpd', txt: '[E5] Tirar papel_continuo ×2 en el Acto II', acc: [V('tirar', 'papel_continuo'), V('tirar', 'papel_continuo')], esp: { flags: { ruben_encontrado: false, cpd_papel_tirones: 2 }, log: ['Tiro un poco. Desde dentro, alguien tira más fuerte.', 'Desde dentro no sueltan. El de ahí no está distraído.'] } },
  // XE5-7 · ascensor con atajo: Sistemas → planta 1 → «Redacción de papel» (llega por la Redacción)
  { n: 'XE5-7', tras: 23, sala: 'catacumba', txt: '[E5] Ascensor con atajo: Sistemas → Planta 1 → «Redacción de papel»', acc: [['ascensor', 'Planta 1', 'Redacción de papel']], esp: { sala: 'catacumba' } },
  // XE5-10 · la tele con «sin turno» y sin la pregunta: «wifi y rencor» (E7 F2: con Mirar; Usar abre el árbol); el móvil con la tele: «once mil»
  { n: 'XE5-10', tras: 27, sala: 'sala_amazonas', txt: '[E5, E7] Mirar tele (sin turno, sin pregunta) · Usar móvil con tele', acc: [V('mirar', 'tele_amazonas'), ['usar', 'movil', 'tele_amazonas']], esp: { flags: { reunion_terminada: false }, log: ['Alguien con wifi y rencor la encontraría enseguida.', 'Desde mi móvil no me sintoniza nadie. Los once mil son de la cafetera.'] } },
  // XE5-1…4 · las cuatro vías del atasco, cada una desde la misma partida (tras el paso 27; E6: el atasco llega por la
  // tele, §2.3); al final, se vuelve a ella y el paso 28 hace la estampida del recorrido (vía del anuncio en modo rápido)
  { n: 'XE5-1', tras: 27, sala: 'sala_amazonas', txt: '[E5] Atasco, vía empujar (Empujar a Fermín)', acc: [['guardar', 'xe5_27'], ['ir', 'sala_amazonas'], ['atasco'], V('empujar', 'mercados_1')], esp: { flags: { reunion_terminada: true, sala_amazonas_estampida: true, sala_amazonas_atasco: false }, log: ['Les doy un empujoncito. Salen los tres de golpe.', 'Se levanta la sesión. Lo hablamos.'], nolog: ['¡Ese medio cruasán es mío!', '¿Y la próxima reunión, cuándo es?', 'un anuncio de cinco segundos'] } },
  { n: 'XE5-2', tras: 'XE5-1', sala: 'sala_amazonas', txt: '[E5] Atasco, vía cruasán (Coger mini-cruasanes)', acc: [['cargar', 'xe5_27'], ['ir', 'sala_amazonas'], ['atasco'], V('coger', 'minicruasanes')], esp: { flags: { reunion_terminada: true, sala_amazonas_atasco: false }, log: ['¡Ese medio cruasán es mío! ¡Lo he cobrado dos veces!'], nolog: ['Les doy un empujoncito.', '¿Y la próxima reunión, cuándo es?', 'un anuncio de cinco segundos'] } },
  { n: 'XE5-3', tras: 'XE5-2', sala: 'sala_amazonas', txt: '[E5] Atasco, vía hablar (Hablar a Rogelio)', acc: [['cargar', 'xe5_27'], ['ir', 'sala_amazonas'], ['atasco'], V('hablar', 'mercados_2')], esp: { flags: { reunion_terminada: true, sala_amazonas_atasco: false }, log: ['¿Y la próxima reunión, cuándo es?'], nolog: ['Les doy un empujoncito.', '¡Ese medio cruasán es mío!', 'un anuncio de cinco segundos'] } },
  { n: 'XE5-4', tras: 'XE5-3', sala: 'sala_amazonas', txt: '[E6] Atasco, vía anuncio (20 s sin hacer nada, texto real; antes, «¿Necesitan ayuda?»)', acc: [['cargar', 'xe5_27'], ['ir', 'sala_amazonas'], ['atasco'], ['lento'], ['esperar', "__game.getFlag('reunion_terminada') && !__game.state().busy", 40000], ['rapido']], esp: { flags: { reunion_terminada: true, sala_amazonas_atasco: false }, log: ['¡Un momento! ¡Antes de salir, un anuncio de cinco segundos!'], nolog: ['Les doy un empujoncito.', '¡Ese medio cruasán es mío!', '¿Y la próxima reunión, cuándo es?'] } },
  { n: 'XE5-4b', tras: 'XE5-4', sala: 'sala_amazonas', txt: '[E6] (cargar la partida del paso 27 para seguir el recorrido)', acc: [['cargar', 'xe5_27']], esp: { sala: 'sala_amazonas', flags: { sala_becario_sin_turno: true, gertrudis_pregunta: false, reunion_terminada: false } } },
  // ------------------------------------------------------------------ ENMIENDA E6 §11.1 (XE6-1…5)
  // XE6-5 · la tele con «sin turno»: «Buenas noches, Gertrudis.» y «Nada. Gracias, Gertrudis.» (la tele vuelve a normal)
  { n: 'XE6-5', tras: 'XE5-4b', sala: 'sala_amazonas', txt: '[E6] Hablar tele → «Buenas noches, Gertrudis.» → «Nada. Gracias, Gertrudis.»', acc: [V('hablar', 'tele_amazonas'), O('Buenas noches, Gertrudis.'), O('Nada. Gracias, Gertrudis.'), ['estado', 'tele_amazonas', 'normal']], esp: { flags: { gertrudis_pregunta: false, reunion_terminada: false }, log: ['tele_amazonas:BUENAS NOCHES, SALA AMAZONAS.', 'tele_amazonas:E-00: DE NADA. ESO TAMBIÉN SE DICE.'] } },
  // XE6-3 · la vía del Vending entera: la pregunta en el Vending → Hablar tele en la Sala → la escena, sin el árbol
  { n: 'XE6-3', tras: 'XE6-5', sala: 'sala_amazonas', txt: '[E6] Vía del Vending: pregunta a Gertrudis → Hablar tele → escena sin árbol', acc: [['guardar', 'xe6_27'], ['ir', 'office'], V('hablar', 'gertrudis'), O('¿Y cuáles son los siguientes pasos?'), SALIR, ['ir', 'sala_amazonas'], V('hablar', 'tele_amazonas')], esp: { flags: ['gertrudis_pregunta', 'reunion_terminada', 'sala_amazonas_estampida'], log: ['PREGUNTA DEL PÚBLICO'], nolog: ['BUENAS NOCHES, SALA AMAZONAS.'] } },
  { n: 'XE6-3b', tras: 'XE6-3', sala: 'sala_amazonas', txt: '[E6] (cargar la partida del paso 27)', acc: [['cargar', 'xe6_27']], esp: { sala: 'sala_amazonas', flags: { gertrudis_pregunta: false, reunion_terminada: false } } },
  // ------------------------------------------------------------------ ENMIENDA E7 §6 (XE7-…)
  // XE7-T1 / T2 · con «sin turno», Usar la tele (o la caja de cables) = Hablar: el árbol de la tele y la estampida
  { n: 'XE7-T1', tras: 'XE6-3b', sala: 'sala_amazonas', txt: '[E7] Usar tele → árbol → «Buenas noches, Gertrudis.» → «¿Y cuáles son los siguientes pasos?»', acc: [['guardar', 'xe7_27'], V('usar', 'tele_amazonas'), O('Buenas noches, Gertrudis.'), O('¿Y cuáles son los siguientes pasos?')], esp: { flags: ['gertrudis_pregunta', 'reunion_terminada', 'sala_amazonas_estampida'], log: ['tele_amazonas:BUENAS NOCHES, SALA AMAZONAS.', 'PREGUNTA DEL PÚBLICO'], nolog: ['wifi y rencor'] } },
  { n: 'XE7-T1b', tras: 'XE7-T1', sala: 'sala_amazonas', txt: '[E7] (cargar la partida del paso 27)', acc: [['cargar', 'xe7_27']], esp: { sala: 'sala_amazonas', flags: { gertrudis_pregunta: false, reunion_terminada: false } } },
  { n: 'XE7-T2', tras: 'XE7-T1b', sala: 'sala_amazonas', txt: '[E7] Usar caja de cables → el mismo árbol → estampida', acc: [V('usar', 'caja_cables'), O('Buenas noches, Gertrudis.'), O('¿Y cuáles son los siguientes pasos?')], esp: { flags: ['gertrudis_pregunta', 'reunion_terminada'], log: ['tele_amazonas:BUENAS NOCHES, SALA AMAZONAS.'] } },
  { n: 'XE7-T2b', tras: 'XE7-T2', sala: 'sala_amazonas', txt: '[E7] (cargar la partida del paso 27)', acc: [['cargar', 'xe7_27']], esp: { sala: 'sala_amazonas', flags: { gertrudis_pregunta: false, reunion_terminada: false } } },
  // XE7-N2 · el papel del fax: Aurora (N1-N2), la ficha (N11 y N9) y Begoña (N3-N4; la opción no vuelve)
  { n: 'XE7-N2', tras: 16, sala: 'catacumba', txt: '[E7] Aurora «¿De dónde saco papel para el fax?» · Mirar ficha · Begoña «¿Me da unos folios?»', acc: [['guardar', 'xe7_16'], V('hablar', 'aurora_galerada'), O('¿De dónde saco papel para el fax?'), SALIR, V('mirar', 'ficha_pagina_7'), ['ir', 'administracion'], V('hablar', 'begona_triplicado'), O('¿Me da unos folios? Son para el fax de Teodoro.'), ['sinOpcion', '¿Me da unos folios?'], SALIR], esp: { flags: ['oyo_papel_begona'], log: ['aurora_galerada:Papel, en esta casa, solo gasta Begoña. Lo devuelve por triplicado.', 'bruno:FIRMA: el fax no tiene papel. El papel, en esta casa, sale de Begoña.', 'bruno:Al margen, a lápiz: «CMS en coma. Sistemas no atiende a nadie».', 'begona_triplicado:Folios no doy. De esta ventanilla solo sale papel rechazado.'] } },
  { n: 'XE7-N2b', tras: 'XE7-N2', sala: 'catacumba', txt: '[E7] (cargar la partida del paso 16)', acc: [['cargar', 'xe7_16']], esp: { sala: 'catacumba', flags: { oyo_papel_begona: false } } },
  // XE7-N1 · el sobre de azúcar abre el impreso (sin el saludo de Begoña) y la nota sale por ahí (alternativa al paso 30)
  { n: 'XE7-N1', tras: 29, sala: 'administracion', txt: '[E7] Dar sobre a Begoña → impreso (sin «Son las 19:07…») → la nota entera por ahí', acc: [['guardar', 'xe7_29'], ['ir', 'administracion'], ['dar', 'sobre_azucar', 'begona_triplicado'], O('Café para entender el capitalismo.'), O('Lo que sea.'), O('Aquí tiene. Un sobre de azúcar. Es casi un ticket.'), O('Pues enséñeme cómo es una nota bien hecha'), SALIR], esp: { flags: ['nota_gasto_presentada'], tiene: ['fotocopia_nota_direccion', 'copias_rechazadas'], log: ['begona_triplicado:¿Un sobre de azúcar? Sin nota de gasto, esto es azúcar.', 'begona_triplicado:Uno: concepto. Dos: importe. Tres: justificante.'], nolog: ['Son las 19:07.'] } },
  { n: 'XE7-N1b', tras: 'XE7-N1', sala: 'administracion', txt: '[E7] (cargar) · Usar sobre con la ventanilla → el impreso → «Importe cero» (N5) → B0 con la nota', acc: [['cargar', 'xe7_29'], ['ir', 'administracion'], ['usar', 'sobre_azucar', 'ventanilla'], ['conOpcion', 'Café para entender el capitalismo.'], O('Nada. Importe cero. No he gastado nada.'), ['conOpcion', 'Quiero presentar una nota de gasto.'], SALIR], esp: { flags: { nota_gasto_presentada: false }, log: ['¿Un sobre de azúcar? Sin nota de gasto, esto es azúcar.', 'bruno:Un trámite bien hecho, y ni un papel. Lo pongo en «logros».'], nolog: ['Son las 19:07.'] } },
  // XE7-N3 · «Importe cero» por el menú de siempre: aprobada, y ni un papel (N5); B0 conserva la nota
  { n: 'XE7-N3', tras: 'XE7-N1b', sala: 'administracion', txt: '[E7] (cargar) Begoña → nota → «Importe cero» → N5; la nota sigue en el menú', acc: [['cargar', 'xe7_29'], ['ir', 'administracion'], V('hablar', 'begona_triplicado'), O('Quiero presentar una nota de gasto.'), O('Nada. Importe cero. No he gastado nada.'), ['conOpcion', 'Quiero presentar una nota de gasto.'], SALIR], esp: { flags: { nota_gasto_presentada: false }, log: ['begona_triplicado:Son las 19:07.', 'bruno:Un trámite bien hecho, y ni un papel. Lo pongo en «logros».'] } },
  { n: 'XE7-N3b', tras: 'XE7-N3', sala: 'administracion', txt: '[E7] (cargar la partida del paso 29)', acc: [['cargar', 'xe7_29']], esp: { flags: { nota_gasto_presentada: false } } },
  // XE7-F4 · «¿Falta mucho?»: Evaristo se va a escribir; el aviso del correo, solo la primera vez
  { n: 'XE7-F4', tras: 'XE5', sala: 'administracion', txt: '[E7] Evaristo → «¿Falta mucho?» (2.ª vez: [coherencia] la parte 2, no la 1 otra vez)', acc: [['enLog', 'aviso:Correo nuevo de Evaristo Salvedad: «Una cosita (1 de 3)».'], ['marca'], V('hablar', 'evaristo_salvedad'), O('¿Para qué me ha llamado?'), O('¿Falta mucho?'), SALIR, ['noDesdeMarca', '«Una cosita (1 de 3)»'], ['enLog', 'aviso:Correo nuevo de Evaristo Salvedad: «Una cosita (2 de 3)».']], esp: { flags: { evaristo_escuchado: false } } },
  // XE5-6 · sin rep_13 ni oyo_descopear: las tres columnas equivocadas y «Tráeme algo…» a la tercera
  { n: 'XE5-6', tras: 44, sala: 'pecera', txt: '[E5] Columnas equivocadas ×3 sin rep_13 ni oyo_descopear', acc: [['guardar', 'xe5_45'], ['flag', 'rep_13', false], ['flag', 'oyo_descopear', false], ['usar', 'rotulador_rojo', 'kanban'], O('DESPEDIDOS'), ['usar', 'rotulador_rojo', 'kanban'], O('HECHO (DE VERDAD)'), ['usar', 'rotulador_rojo', 'kanban'], O('FIRMAR EN PAPEL')], esp: { flags: { posit_descopeado: false, pecera_columna_mal_n: 3 }, log: ['Eso es «muerto» con corbata.', '«De verdad» no es un estado.', 'Eso es tuyo. Mi tablero no es tu diario.', 'Tráeme algo que no sea ni hecho ni muerto.'] } },
  { n: 'XE5-6b', tras: 'XE5-6', sala: 'pecera', txt: '[E5] (cargar)', acc: [['cargar', 'xe5_45']], esp: { flags: ['album_validado', 'rep_13', 'oyo_descopear'] } },
  // E2 §5.7 + E6 §2.5: L1, L3 y L4 han sonado (la L4 ya no se pierde: suena en la primera entrada sin escena DESPUÉS de
  // abrir el armario, y Bruno contesta «Se llama Brais.»); la L5 espera a la siguiente entrada con ruben_libre. Los tres
  // RV de Tadeo, ya en el correo (sin aviso).
  { n: '—45', tras: 45, sala: 'pecera', txt: 'Control: L1, L2 ([coherencia]), L3 y L4 («Se llama Brais.») han sonado (L5 pendiente); los tres RV, en el correo', acc: [['enLog', 'evaristo_salvedad:Planta 2, al fondo de Administración.'], ['enLog', 'bruno:Se llama Brais.'], ['enLog', 'Alguien come ahí abajo y no cobra.']], esp: { flags: { evaristo_llamadas: 4, tadeo_rv_n: 3, evaristo_convoco: 'llamada' } } },
];
const hasta = args.hasta ?? null;
const order = [];
const after = (n) => { for (const x of X) if (x.tras === n) { order.push(x); after(x.n); } };
for (const s of STEPS) { order.push(s); after(s.n); }
const sueltos = X.filter(x => !order.includes(x));
if (sueltos.length) { console.log('Pasos X sin sitio: ' + sueltos.map(x => x.n).join(', ')); process.exit(1); }
const stopIdx = hasta == null ? order.length : order.findIndex(s => String(s.n) === String(hasta)) + 1 || order.length;

const server = createServer(path.resolve(here, '..'));
await new Promise(r => server.listen(0, r));
const base = `http://localhost:${server.address().port}/`;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 960, height: 600 } });
const consoleErrors = [];
page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));
const R = createRunner(page);
const { run, check, state, G } = R;

// Acciones propias de los extras de E5 (guardar/cargar, texto real, esperar, el atasco, la ventana a oscuras, el ascensor)
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
async function hastaQue(cond, ms = 40000) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    if (await G((c) => { if (new Function('return ' + c)()) return true; if (__game.game.speeches.length) __game.skipSpeech(); return false; }, cond)) return;
    await sleep(80);
  }
  throw new StepFail(`no se cumplió a tiempo: ${cond}`);
}
let marcaLog = 0;
const EXTRA = {
  guardar: (k) => G((k) => { __game.save(k); }, k),
  cargar: async (k) => { await G((k) => __game.load(k), k); await G(() => { __game.skipSpeech(); return __game.waitIdle(); }); },
  flag: (k, v) => G(([k, v]) => __game.setFlag(k, v), [k, v]),
  lento: () => G(() => __game.skipText(false)),
  rapido: () => G(() => __game.skipText(true)),
  esperar: (cond, ms) => hastaQue(cond, ms),
  /** E6 §2.3: Hablar con la tele («sin turno»): «Buenas noches, Gertrudis.» y, a velocidad real (en modo rápido el atasco
   *  se resuelve solo con el anuncio), «¿Y cuáles son los siguientes pasos?» hasta que el atasco queda abierto, Bruno ha
   *  preguntado «¿Necesitan ayuda?» y el control vuelve; luego, modo rápido para la vía. */
  atasco: async () => {
    const log0 = await G(() => __game.log.length);
    await run(['verbo', 'hablar', 'tele_amazonas']);
    await R.chooseByText('Buenas noches, Gertrudis.');
    await G(() => __game.skipText(false));
    await R.chooseByText('¿Y cuáles son los siguientes pasos?');
    await hastaQue("__game.getFlag('sala_amazonas_atasco') && !__game.state().busy");
    await G(() => __game.skipText(true));
    const ayuda = await G((k) => __game.log.slice(k).some(l => l.who === 'bruno' && l.text === '¿Necesitan ayuda?'), log0);
    if (!ayuda) throw new StepFail('el atasco no se anunció: falta «¿Necesitan ayuda?» de Bruno');
  },
  /** El texto ha salido en algún momento de la partida (`who:texto` exige además quién lo dice). */
  enLog: async (t) => {
    const L = await G(() => __game.log.map(l => `${l.who}:${l.text}`));
    if (!L.some(l => (t.includes(':') ? l.startsWith(t) : l.includes(t)))) throw new StepFail(`no ha salido en la partida: ${t}`);
  },
  /** E7: el menú de diálogo abierto (no) tiene una opción que contiene ese texto. */
  sinOpcion: async (t) => {
    await G(() => __game.waitIdle());
    const op = await G(() => __game.currentDialogOptions() || []);
    if (op.some(o => o.includes(t))) throw new StepFail(`la opción «${t}» sigue en el menú: ${JSON.stringify(op)}`);
  },
  conOpcion: async (t) => {
    await G(() => __game.waitIdle());
    const op = await G(() => __game.currentDialogOptions() || []);
    if (!op.some(o => o.includes(t))) throw new StepFail(`falta la opción «${t}» en el menú: ${JSON.stringify(op)}`);
  },
  /** E7: marca el registro; `noDesdeMarca` falla si el texto sale después de la marca. */
  marca: async () => { marcaLog = await G(() => __game.log.length); },
  noDesdeMarca: async (t) => {
    if (await G(([k, t]) => __game.log.slice(k).some(l => String(l.text).includes(t)), [marcaLog, t])) throw new StepFail(`ha vuelto a salir: ${t}`);
  },
  /** Estado visual de un objeto de la sala. */
  estado: async (id, want) => {
    const st = await G((id) => __game.game.getObjState(id).state, id);
    if (st !== want) throw new StepFail(`${id}: estado ${st}, se esperaba ${want}`);
  },
  /** E6 §5.1: el último duelo se ganó sin un solo fallo (la réplica larga nunca suma). */
  sinFallos: async () => {
    const d = await G(() => __game.state().lastDuel);
    if (!d || d.result !== 'won' || d.misses !== 0) throw new StepFail(`duelo: ${JSON.stringify(d)}; se esperaba ganado con 0 fallos`);
  },
  /** Tirar del enchufe a velocidad real (en modo rápido la ventana dura 0) hasta que la ventana a oscuras está abierta. */
  oscuras: async () => {
    await G(() => { __game.skipText(false); __game.doVerb('tirar', 'enchufe_pantalla'); });
    await hastaQue("__game.getFlag('pecera_oscuras') && !__game.state().busy");
    await G(() => __game.skipText(true));
  },
  /** Ascensor de la sala actual → planta (texto) → submenú de atajos (texto). */
  ascensor: async (planta, sala) => {
    const id = await G(() => (__game.objects().find(o => /^ascensor_/.test(o.id)) || {}).id);
    if (!id) throw new StepFail('no hay ascensor en esta sala');
    await G((id) => __game.doVerb('usar', id), id);
    await R.chooseByText(planta);
    await R.chooseByText(sala);
  },
};

let lastOk = '—', failed = null, done = 0;
try {
  await page.goto(base);
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) { /* ignore */ } });
  await page.reload();
  await page.waitForFunction(() => !!window.__game);
  if (!args.lento) await G(() => __game.skipText(true));
  await R.startDismisser();
  await G(() => __game.newGame());
  console.log('Walkthrough de extras (plan de comedia §3.5 + E1.9 + E2 §10.1 + E5 §7.4 + E6 §11.1): recorrido de 49 pasos (E6) + pasos X intercalados\n');
  for (const s of order.slice(0, stopIdx)) {
    try {
      const log0 = await G(() => __game.log.length);
      for (const a of s.acc) await (EXTRA[a[0]] ? EXTRA[a[0]](...a.slice(1)) : run(a));
      await G(() => __game.waitIdle());
      await check(s.esp);
      if (s.esp.log) {
        const L = await G((k) => __game.log.slice(k).map(l => `${l.who}:${l.text}`), log0);
        const faltan = s.esp.log.filter(t => !L.some(l => (t.includes(':') && !t.startsWith('«') ? l.startsWith(t) : l.includes(t))));
        if (faltan.length) throw new StepFail(`no salió en pantalla: ${JSON.stringify(faltan)}`);
      }
      if (s.esp.nolog) {
        const L = await G((k) => __game.log.slice(k).map(l => `${l.who}:${l.text}`), log0);
        const sobran = s.esp.nolog.filter(t => L.some(l => l.includes(t)));
        if (sobran.length) throw new StepFail(`no debía salir: ${JSON.stringify(sobran)}`);
      }
      console.log(`  ✓ ${String(s.n).padStart(4)} [${s.sala}] ${s.txt}`);
      lastOk = s.n; done++;
      if (args.lento) await page.screenshot({ path: path.join(here, 'shots', `extras-${String(s.n).replace(/\W/g, '_')}.png`) });
    } catch (e) {
      if (!(e instanceof StepFail)) throw e;
      failed = { s, msg: e.message };
      break;
    }
  }
} catch (e) {
  failed = failed || { s: null, msg: 'error del script: ' + (e && e.stack || e) };
}
if (failed) {
  const st = await state().catch(() => null);
  const log = await G(() => __game.log.slice(-6).map(l => `${l.who || '—'}: ${l.text}`)).catch(() => []);
  console.log(`\n  ✗ ${failed.s ? `PASO ${failed.s.n} [${failed.s.sala}] ${failed.s.txt}` : 'FALLO'}`);
  console.log(`    motivo: ${failed.msg}`);
  if (st) console.log(`    contexto: sala=${st.room} inventario=[${st.inventory.join(', ')}] diálogo=${JSON.stringify(st.dialog)} aviso=${st.aviso}`);
  if (log.length) console.log('    últimas líneas:\n      ' + log.join('\n      '));
  fs.mkdirSync(path.join(here, 'shots'), { recursive: true });
  try { await page.screenshot({ path: path.join(here, 'shots', 'extras-fallo.png') }); console.log('    captura: tools/shots/extras-fallo.png'); } catch (_) { /* ignore */ }
}
if (consoleErrors.length) console.log('\nErrores de consola:\n  ' + consoleErrors.join('\n  '));
console.log(failed ? `\nÚltimo paso correcto: ${lastOk} (${done} de ${stopIdx}).` : `\nEXTRAS COMPLETO (${done} pasos)`);
await browser.close();
server.close();
process.exit(failed || consoleErrors.length ? 1 : 0);
