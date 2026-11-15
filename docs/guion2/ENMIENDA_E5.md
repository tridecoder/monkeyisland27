# FE DE ERRATAS — ENMIENDA E5 (definitiva, implementable sin preguntar)

> Tercer autor, a la contra. Casa `E5_DISENO.md` (puzles) y `E5_GUION.md` (texto) contra la crítica 4
> (`docs/informes/critica4/CRITICA_JUEGO_4.md`, objetivo 7,5 → 8,5), el brief de salas, `GUIA_AUTORES.md` y el código
> de hoy (con E4 ya hecha: ráfaga S1, borrasca S2, `pecera_opa_ab` S4, `pecera_opa_ganadora` S5, epílogo S6).
> **Prevalece sobre los dos documentos de partida** en todo lo que toca. Lo que aquí no se dice de ellos, no se hace.
> **Manda el texto literal, no el número de línea** (los números son la foto de hoy). Ninguna línea nueva pasa de 80
> caracteres ni usa una fórmula con tope, «Como…», coletilla, «criatura», «chaval» ni «cariño» (comprobado con
> `plan-rules.mjs`: 77 líneas nuevas, 0 fallos).
>
> No se tocan: Eventos y Pilar (`eventos.js`, `eventos.dialogos.js`), la cadena final (`climaxEmpujon` y
> `escenas/final.js` enteros), los textos y ficheros de E4 (`pecera.titulador*.js`, `pecera.titulares.datos.js`, las
> líneas M1-M9 y O1-O21 de E4), mazos, ataques, réplicas ni remates de duelo.

## Índice
§1 Resumen y decisiones · §2 Diseño definitivo por puzle · §3 Texto definitivo de las escenas nuevas · §4 Tabla de
reescrituras · §5 Coro, Mercados, megafonía y Lector Medio · §6 Motor · §7 Recorrido (50 pasos) y alternativo ·
§8 Topes y regex · §9 Saldo y reloj · §10 Paquetes · §11 Pruebas · §12 Acta de la contra

---

## §1 · RESUMEN Y DECISIONES

| # | Puzle / bloque | Queda así (en una línea) | Cambio respecto a los autores |
|---|---|---|---|
| 1 | **Estampida** | Orden del día → Gervasio «los becarios no tienen turno… y los conectados» → Gertrudis lo reenvía → **Usar la tele** de la Sala → Gertrudis pregunta en directo → estampida → **atasco jugable** (3 vías + el anuncio a los 10 s) | Fuera el rebote «Por escrito. En marzo.», la vía de la tele en el atasco, Toni en el ascensor y Arsenio en Sistemas; **nueva pista** en la tele («wifi y rencor») y respuesta a «Usar móvil con tele»; `return 'exit'` para no gastar despedidas; sin guardar a mitad de atasco |
| 2 | **Apagón jugable + regletero** | Tirar el enchufe → oscuridad con dos focos, 12 s jugables (Anselmo cruza con la linterna) → Anselmo: «Ese cable baja a Sistemas. Que te la apague Paco.» → **regletero de cinco** por eliminación: la R-3 es la tapada con el pósit de Paco | **Fuera el paso «Mirar enchufe»** (51 → 50 pasos): la brida queda como pista extra. El regletero se resuelve por **eliminación** (no por un número dictado). El registro y el ticket 3 **no cambian** (segunda vía para el que lee). Verbos a oscuras por un **interceptor** del motor, no hotspot a hotspot |
| 3 | **Ticket 0.441** | Paco no da nada sin número; el número está en una pegatina del fax (Mirar fax, misma visita que Aurora) | Dos negativas de Paco, la segunda empuja («Todo lo que mantengo lleva mi pegatina»); la pegatina **se funde** con el Mirar del fax (una línea) |
| 4 | **Columna del kanban** | Álbum a Anselmo → «Las fotos me valen. Pero yo no escribo columnas nuevas.» → rotulador de Maripaz → Bruno escribe la columna y mueve el pósit → Anselmo: «…Rotulador de Comercial. De fuera.» / «Salida en valor. Ni hecho ni muerto, pero sale.» / «La frase la escribió Rubén. Rubén tenía alta. …Entonces es de la casa.» | **Rubén no cambia** (su «Anselmo no mueve un pósit sin pruebas» es el motivo para ir a por el álbum). Pistas nuevas en el mundo: Usar el tablero, el boli muerto y los bolis de Aurora. El rotulador se puede coger desde el Acto I (sin negativa previa) |
| 5 | **Armario 27** | Acto II: el de dentro tira más fuerte («no está distraído»); Acto III: el papel sale a chorro y Bruno lo dice al entrar | **Fuera el titular al revés** del monitor de Yoli (gasta el «prohibido = invitación» del clímax y entra en territorio de E4) y la fila de la hoja de E4 |
| 6 | **Señal tras el clímax** | Caras al cartón, tambaleo con un tercer fotograma (8°) y crujido; Celestino por megafonía a los 10, 25 y 45 s **de tiempo quieto** | Las tres líneas del guionista (decisión del director); fuera la de Íñigo; el reloj **no** se reinicia con el ratón (un jugador perdido mueve el ratón) |
| 7 | **Ascensor con atajos** | Tras elegir planta, un submenú con las salas ya pisadas de esa planta (Escape = rellano) | Primera opción con el nombre de la sala de llegada; **arreglo obligatorio en `walk-lib.mjs`** (si no, el recorrido se queda en el submenú) |
| 8 | Lote | F4 `junto()` sin teletransporte, F8 táctil, F9 Custodia, N6 Aurora; N9 nada | Sin cambios |
| 9 | **Texto** | 160 entradas del guionista: **149 aprobadas, 8 mejoradas, 3 tumbadas** (§4) + reserva R1-R3 aplicada + «Vengo a reimaginar el perímetro.» fuera | Lector Medio: asiente **sin globo**; «Posando» se queda en el manual y sale de Paco; M26 fuera |

**Decisiones del director, aplicadas:** la frase de Anselmo se oye una vez en el camino principal, en
`pecera_herminia_mide` (paso 38), y el kanban la paga como eco estructural (§2.5); Mercados = **Fermín Plazofijo,
Rogelio Diferido y Jacinto Dividendo** (rasgos del guionista; §5.2); estampida de Gertrudis por la tele; apagón en el
camino; rotulador de Comercial en el tablero; atajo en el ascensor y nada en el móvil; megafonía de Celestino; Pilar
conserva su RECHAZADO.

**Cifras:** camino principal **+7** (561 → 568, tope 576); juego entero **+3** (tope +10); reloj **≈ +3 min**
(+2 a +4); 50 pasos.

---

## §2 · DISEÑO DEFINITIVO POR PUZLE

Convención: **G** = flag global (P0/I1, `flags.js`); **L** = local de sala (en `flags` de su `buildRoom`). En cada
puzle, «Dos pistas antes de la abuela» enumera lo que el jugador encuentra solo.

### 2.1 La estampida: «Pregunta del público» (`sala_amazonas.js`, `office.js`, `catacumba.js`)

**Lógica que se deduce:** un becario no tiene turno; los conectados, sí; Gertrudis sale en todas las pantallas; la tele
de la Sala la sintoniza.

**Pasos y código:**
1. `catacumba.js` (café a Aurora, paso 16): «Y una reunión solo se acaba cuando alguien pregunta por los siguientes
   pasos.» → «Y una reunión solo se acaba cuando alguien pregunta por el punto que nadie toca.» (0 líneas).
2. `orden_del_dia.mirar` (sin `reunion_terminada`): las dos líneas de hoy + `setFlag('sala_amazonas_orden_visto')` (L).
   `orden_del_dia.usar`: «Para tocar el punto 3 hay que decirlo en voz alta, a quien preside.» (sustituye a la de
   «… Y a quien preside.»). `hablar`: «Leo el punto 3 en voz baja. Fermín se estremece.» (sustituye a «Uno de Mercados»).
3. `GV_REUNION`, opción «Bueno... ¿y cuáles son los siguientes pasos?»: `if: ['aurora_conto_pasos',
   'sala_amazonas_orden_visto', '!sala_becario_sin_turno']`. `do`:
   ```js
   await api.wait(800);                                   // las tres cabezas se levantan y vuelven a bajar
   await sayG(api, 'Los becarios no tienen turno. Pregunta la mesa... y los conectados.');
   if (aqui(api, 'mercados_2')) api.faceActor('mercados_2', 'left');   // Rogelio mira la tele (a la izquierda de la mesa; ajustar al arte)
   api.setFlag('sala_becario_sin_turno', true);           // G
   return 'exit';                                         // no gasta «Me voy.» (ver §9.1)
   ```
4. `office.js`, `dialogoGertrudis.G0`, opción nueva **antes** de «Nada. Gracias, Gertrudis.»:
   `{ text: '¿Y cuáles son los siguientes pasos?', if: ['sala_becario_sin_turno', '!gertrudis_pregunta', '!reunion_terminada'], do }`:
   `api.sfx('beep'); await parpadeo(api); await lcd(api, 'PREGUNTA SIN RESPUESTA. LA MANDO A LA PRÓXIMA PANTALLA QUE ME
   SINTONICE.'); emision(api, 1); api.setFlag('gertrudis_pregunta', true); return 'exit';`. Va por delante de
   `office_agotada` y de E-53 (es una pregunta, no un saludo). El `onStart` del Acto III no aplica (`!reunion_terminada`).
5. **La tele** (`tele_amazonas`; estados nuevos `buscando` y `gertrudis`). Una sola función `teleSegunTurno(api)` que
   llaman `usar`, `hablar`, `cerrar` de la tele y `usar` de `caja_cables`:
   - `gertrudis_pregunta && !reunion_terminada` → `api.scene('sala_tele_gertrudis')` (§3.1);
   - `sala_becario_sin_turno && !gertrudis_pregunta` → `api.setState('tele_amazonas','buscando')` 1 s y BRUNO
     ««BUSCANDO SEÑAL». Alguien con wifi y rencor la encontraría enseguida.» (pista 2, callback de «TENGO WIFI Y
     RENCOR»); luego `normal`;
   - si no, lo de hoy (rotación en `usar`, sus líneas en `hablar` y `cerrar`).
   - `'usar:movil'` (con `sala_becario_sin_turno && !reunion_terminada`): BRUNO «Desde mi móvil no me sintoniza nadie.
     Los once mil son de la cafetera.» (pista 3; el resto del juego, el genérico del móvil).
   - `onEnter`: si el estado es `buscando` o `gertrudis` y no hay escena, vuelve a `normal`.
6. **Atasco jugable** (§3.1): tras «CONVOCADA…», los tres de Mercados se encajan en la puerta, se oyen sus tres líneas
   de hoy y se **devuelve el control** con `sala_amazonas_atasco` (L) puesto. `resolverAtasco(api, via)` (cutscene):
   | Acción del jugador durante el atasco | Vía | Línea (una sola, solo se oye una vía) |
   |---|---|---|
   | Empujar a Fermín, Rogelio o Jacinto · Ir/Usar la puerta | `empujar` | BRUNO «Les doy un empujoncito. Salen los tres de golpe.» |
   | Coger `minicruasanes` · Usar `minicruasanes` con uno | `cruasan` | JACINTO «¡Ese medio cruasán es mío! ¡Lo he cobrado dos veces!» (vuelve a la bandeja; los otros dos salen; él sale el último con el cruasán) |
   | Hablar con cualquiera de los tres o con Gervasio | `hablar` | BRUNO «¿Y la próxima reunión, cuándo es?» (desbandada) |
   | Hablar con Maripaz · 10 s de tiempo quieto (`api.quieto()`) · modo rápido | `anuncio` | MARIPAZ «¡Un momento! ¡Antes de salir, un anuncio de cinco segundos!» (la de hoy, con la tableta en alto) |
   | Cualquier otra cosa | — | lo de siempre (el reloj de 10 s sigue corriendo) |
   Después, lo de hoy desde los botellines: `ctl.soltar()` (plop de uno en uno), `sala_amazonas_estampida`, el regreso
   mudo a por el medio cruasán (**solo si la vía no fue `cruasan`**), «Se levanta la sesión. Lo hablamos.»,
   `reunion_terminada`, «¿Usted no huye?» y Maripaz. `sala_amazonas_atasco` a `false`.
   - **Guardar/cargar:** con el atasco abierto, `api.sinGuardar(true)` (P0); al cerrarlo, `false`. Si aun así se carga
     una partida con `sala_amazonas_atasco` (versión vieja, autoguarda), `onEnter` lo resuelve **en silencio**: Mercados
     y Gervasio fuera, botellines tumbados, `sala_amazonas_estampida` y `reunion_terminada` a `true`, atasco a `false`.
   - **Salir:** la única salida de la Sala es la puerta atascada: Ir/Usar la puerta = vía `empujar` (Bruno no sale; se
     queda a ver la escena). No hay ascensor ni directorio en la Sala.
7. `MERCADOS_MIRAR`/`HABLAR`, nombres y murmullos: §5.2. Durante el atasco, los murmullos de cada uno son su línea del
   atasco («¡Usted primero!» Fermín · «¡No, usted, que es de Bolsa!» Rogelio · «¡Yo soy de Bolsa y de Mercados! ¡Tengo
   doble prioridad!» Jacinto): 0 líneas nuevas.

**Flags:** G `sala_becario_sin_turno` (bool · sala_amazonas · office, pistas), G `gertrudis_pregunta` (bool · office ·
sala_amazonas, pistas); L `sala_amazonas_orden_visto`, L `sala_amazonas_atasco`.

**Arte** (`art/sala_amazonas.art.js` `drawTele`): `buscando` = nieve con «BUSCANDO SEÑAL» (texto de pantalla); `gertrudis`
= el LCD verde de Gertrudis a pantalla completa (paleta del overlay de `office.art.js`), piloto rojo «EN DIRECTO» y una
taza en la esquina. Con `cafetera_viral` y sin `reunion_terminada`, un puntito verde en la esquina de la tele parpadea
cada 4 s (pista visual). Captura obligatoria: el LCD se lee y Bruno no tapa la tele.

**Dos pistas antes de la abuela (y cuántas hay):** para la pregunta a Gervasio: (1) Aurora «el punto que nadie toca»,
(2) el `onStart` de Gervasio «Estamos en el punto tres», (3) Usar el orden del día. Para Gertrudis: (1) «…y los
conectados» + Rogelio que se gira a la tele, (2) Usar/Hablar la tele («wifi y rencor»), (3) Usar el móvil con la tele
(«los once mil son de la cafetera»), (4) el puntito verde. Para la tele: (1) el LCD «LA MANDO A LA PRÓXIMA PANTALLA QUE
ME SINTONICE», (2) el piloto «EN DIRECTO» de Gertrudis, (3) la meta nueva de Bruno.

**Intentos razonables equivocados:**
| Intento | Respuesta |
|---|---|
| Hablar con Gervasio sin haber mirado el orden del día | su menú de siempre; su saludo ya dice «Estamos en el punto tres» |
| Volver a preguntar a Gervasio tras «sin turno» | la opción ya no sale; «Mirar a Bruno» da la meta nueva (`turno`) |
| Usar la tele antes de hablar con Gervasio | la rotación de siempre |
| Preguntar a Gertrudis antes que a Gervasio | la opción no está (no hay nada que reenviar) |
| Hablar con Mercados tras «sin turno» | sus líneas de rasgo (§5.2): ninguna ayuda, ninguna engaña |
| Hablar con Maripaz antes de la estampida | «Ahora no. Le estoy vendiendo el orden del día a Mercados.» (hoy) |
| Usar el móvil con la tele | «Desde mi móvil no me sintoniza nadie. Los once mil son de la cafetera.» |
| Tele con la pregunta ya enviada, en el Acto II tras la estampida | la rotación de siempre (la condición es `!reunion_terminada`) |

**Orden roto:** imposible preguntar a Gertrudis sin el «sin turno»; la tele sin `gertrudis_pregunta` no estampa; tras la
estampida todo vuelve a lo de hoy. En el Acto III la opción de Gertrudis no sale y la tele dice lo de hoy.

**Pistas de la abuela** (`pistas.js`; el objetivo `reunion` se parte):
- `reunion` (acto 2 · hecho `(api) => api.flag('sala_becario_sin_turno') || api.flag('reunion_terminada')` · salas
  `pajarera`, `sala_amazonas`): 1 «Las reuniones se acaban cuando alguien pregunta lo que nadie quiere tocar.» · 2 «En
  esa reunión tienen los puntos en una pantalla. Busca el que nadie toca.» · 3 [«Pregúntale al que preside por ese
  punto.», «Orden del día, punto 3. A Gervasio: «¿y los siguientes pasos?».»].
- `turno` **nuevo** (acto 2 · activo `sala_becario_sin_turno` · hecho `reunion_terminada` · salas `sala_amazonas`,
  `office`, `pecera` · meta `M.turno` «En esa reunión solo pregunta quien sale en la tele. Yo no salgo en nada.»): 1 «Si
  a ti no te dejan preguntar, que pregunte alguien que salga en la tele.» · 2 «Esa cafetera tan educada sale en todas las
  pantallas, hijo. Hasta en la mía.» · 3 [«Pregúntale a la cafetera lo de los pasos, y luego enciende esa tele.»,
  «Gertrudis: «¿Y los siguientes pasos?». Luego, Usar la tele de la Sala.»] · `previa` `{ si: 'gertrudis_pregunta',
  nivel: 1, abuela: 'La cafetera ya lo ha mandado. Ahora alguien tiene que sintonizarla.' }`.
- `hueco` sigue con `activo: 'reunion_terminada'`.

### 2.2 El apagón jugable y el regletero (`pecera.js`, `pecera.escenas.js`, `cpd.js`)

**Lógica:** a oscuras el CMS publica (lo ve y lo oye); Anselmo vuelve a enchufar y, por quitárselo de encima, manda al
jugador a Sistemas; allí hay cinco regletas y solo una no dice lo que es.

1. `enchufe_pantalla.tirar` sin `cms_vivo` ni `vio_ticket_3` y con `apagon_n === 0` → `pecera_apagon` n = 1 **nuevo**
   (§3.2): cutscene corta (Bruno tira; oscuridad con dos focos: el monitor de Yoli y la linterna de Anselmo, que sigue
   al actor; Yoli «¡Estamos ciegos!…»; PLIN y «…Ha entrado una pieza…», las dos de hoy **dentro de la cutscene**, para
   que nadie se las pierda) → **ventana jugable de 12 s** (L `pecera_oscuras`; `api.sinGuardar(true)`): Anselmo cruza
   de su mesa al enchufe (`walkActor` sin `await`, `api.sinCongelar(A)`); cada 2 s PLIN y el monitor parpadea en
   `publicado`. La ventana se cierra con lo primero de: Anselmo llega, el jugador Usa el enchufe, 12 s (en modo rápido,
   0) → `apagonCierre` (§3.2). Las escaladas n = 2 y n = 3 siguen como hoy (cutscenes), con el arreglo de §3.2.
2. **Verbos a oscuras** (interceptor del motor, §6.2: `api.apagon({ …, nombres: true, interceptar })`):
   | Verbo + objeto | Respuesta |
   |---|---|
   | Hablar con Yoli | YOLI «¡Chsss! Estoy contando. Diecisiete. Dieciocho.» |
   | Hablar con / Empujar a Anselmo | ANSELMO «No me tapes la linterna. Voy a mi enchufe.» |
   | Coger `taza_no` | DEV 3 «No.» |
   | Usar `enchufe_pantalla` | (Bruno enchufa) → cierra la ventana: `apagonCierre` |
   | Cualquier otro verbo, salidas, ascensor y directorio incluidos | BRUNO «No veo nada. Solo a Yoli, a la luz del monitor, contando.» (no sale) |
   Nombres al pasar el ratón (`nameDark`, texto de pantalla): `taza_no` «algo que dice que no», `coro_desarrollo` «tres
   sombras enfadadas», `kanban` «algo con pósits», `yoli_tendencias` «alguien que cuenta»; el resto, «algo» (objetos) y
   «alguien» (actores).
3. **Guardar/cargar:** sin guardar durante la ventana. Si se carga con `pecera_oscuras` (antes del `return` de
   `api.restoring` del `onEnter`): luz, Anselmo en su mesa, `pecera_oscuras` a `false`, `apagon_n` se queda; la pista
   sigue a mano (Mirar el enchufe, escaladas 2-3, abuela).
4. **Sistemas: el regletero.** El objeto conserva el id `regleta_r3` (lo citan pruebas y recorridos) y pasa a llamarse
   «regletero»: cinco regletas con brida (arte en `art/cpd.art.js`, el rect de hoy ampliado a unos 40 × 18 px; si no da
   tiempo, plano detalle con `api.detalle`). Etiquetas: R-1 NÓMINAS · R-2 ASCENSOR · R-3 tapada por un pósit amarillo de
   Paco · R-4 GERTRUDIS · R-5 NO TOCAR NUNCA (en rojo).
   - Mirar (encendido): «Cinco regletas: NÓMINAS, ASCENSOR, un pósit, GERTRUDIS y NO TOCAR NUNCA.» / «El pósit, con
     letra de Paco: «ni aunque lo diga el ticket 3».» (sustituye a las dos de hoy). Mirar (R-3 apagada): «El regletero.
     La del pósit, apagada.» / «Arriba, la Redacción trabaja a ciegas.» (sustituye a las dos de hoy; C42).
   - Tirar / Usar (con `cms_vivo` o apagada, lo de hoy) → `api.choose(['R-1 · NÓMINAS', 'R-2 · ASCENSOR', 'R-3 · (un pósit
     tapa la etiqueta)', 'R-4 · GERTRUDIS', 'R-5 · NO TOCAR NUNCA', 'Mejor no.'], { escape: 5 })` (texto de pantalla).
     Bruno se acerca, `anim reach`, clic; el fallo se vuelve a enchufar al segundo (`sfx('click')` ×2) y suma
     `cpd_regleta_mal_n` (L):
     | Elige | Qué pasa |
     |---|---|
     | R-1 | PACO (sin girarse) «Esa es la de las nóminas. Si la tocas, no cobra nadie. Tú tampoco.» |
     | R-2 | un «tin» triste por el hueco; por la rejilla, CELESTINO «¡Ascensor parado en mitad de la jugada! ¡Tiempo muerto!» (`megafonia`, `REJILLA_VOZ`) |
     | R-3 | `tirarRegleta` de hoy **sin** «No sé qué apaga esto…», **sin** la megafonía de Yoli y **sin** «Ya me han abierto otro ticket para saber por qué.» |
     | R-4 | por la rejilla, GERTRUDIS «E-55: UN SEGUNDO SIN CORRIENTE. ANOTADO CON RENCOR.» |
     | R-5 | (no tira) BRUNO «Pone «NUNCA». Paco la mira con ternura. No la toco.» |
     | Mejor no. | nada |
   - Cerrar: «Ya está cerrado. Cinco bridas lo dicen.» (C43). Empujar, Coger, Abrir y Hablar: las de hoy.
   - **Sin gate**: el regletero funciona aunque no se haya visto el apagón (quien acierta por eliminación se ahorra el
     gag; no hay acción negada que luego sea solución).
5. **El camino antiguo** (registro leído → Tirar el enchufe → Anselmo escribe «SALVO TICKET Nº 3») se queda igual. El
   registro **no cambia** (su ticket 3 nombra la R-3 y el pósit de Paco le contesta: «ni aunque lo diga el ticket 3»).
6. Mirar `enchufe_pantalla` no cambia (su brida «R-3, SISTEMAS. PACO» es una pista más, opcional). Sin flag nuevo.

**Dos pistas antes de la abuela:** (1) el cierre de Anselmo «Ese cable baja a Sistemas. Que te la apague Paco.»;
(2) la brida del enchufe; (3) en el regletero, cuatro etiquetas que no son la pantalla y un pósit que cita el ticket 3;
(4) el registro, para quien lo lea.

**Orden roto:** regletero antes que el apagón → vale (eliminación); registro antes → camino antiguo; apagón otra vez
→ escalada 2-3 de hoy; salir a oscuras → no se puede (interceptor); cargar a oscuras → §2.2.3.

**Pistas** (`cms`): 1 «La tele de tu abuelo no iba si él la miraba. Apágale algo a alguien.» (igual) · 2 «Si te la
vuelven a enchufar, apágala donde no lleguen. Sigue el cable.» · 3 [«El cable baja a los ordenadores. Apaga la regleta
que no dice lo que es.», «Sistemas: en el regletero, la R-3. La del pósit de Paco.»].

### 2.3 El ticket 0.441 (`catacumba.js`, `cpd.js`)

1. `fax.mirar` sin papel: «Un fax beige de 1992. Pantallita: «SIN PAPEL». Y sin ganas.» → «Un fax de 1992: «SIN PAPEL».
   Pegatina: «Mantenimiento: Sistemas. Ticket 0.441».» y `setFlag('vio_pegatina_fax')` (G). Con papel, las dos de hoy
   y, si aún no está el flag, lo pone (sin línea).
2. Paco `P1`, opción del fax partida en dos (las dos con `!paco_dio_manual`):
   - `{ id: 'fax', text: '¿Sabes algo del fax de la Redacción de papel?', if: ['!paco_dio_manual', '!vio_pegatina_fax'] }`
     → `const n = api.inc('cpd_paco_fax_n')` (L): n = 1 PACO «¿Qué fax? Sin número de ticket, para mí no hay fax.»;
     n ≥ 2 PACO «Todo lo que mantengo lleva mi pegatina. Ese fax también.» Sin manual.
   - `{ id: 'fax441', text: 'Ticket 0.441. El fax de Teodoro.', if: ['!paco_dio_manual', 'vio_pegatina_fax'] }` → PACO
     «0.441. De 1999. Estado: lo respetamos.» / «Toma el manual. Página 9: la respuesta automática. Mi mejor empleada.»;
     `give('manual_fax')`, `paco_dio_manual`. Fuera «Lo único de esta casa que contesta…» (−1 al tope de «lo único») y
     «…Posando.» (F6).
3. `manual_fax.mirar` (`items.js`) **no cambia**: la de «Posando» se oye una vez, al mirarlo (M19 tumbada).
4. Pistas: `firma.extra` → «El de los ordenadores no da nada sin número. Míralo en la máquina.»

**Dos pistas:** las dos negativas de Paco (la 2.ª dice «pegatina»); su `dar:*` de siempre («¿Viene con número de
ticket?»); la pegatina se ve en el Mirar que todo jugador hace del fax. **Orden roto:** preguntar antes de mirar → dos
negativas, sin bloqueo; mirar antes de que el CMS vaya → la opción buena espera a `P1` (como hoy).

### 2.4 El armario 27 (`cpd.js`; arte `art/cpd.art.js`)

1. `papel_continuo.tirar`, Actos I-II: `anim reach 380`, estado `tensa` 250 ms, `sfx('paper')`, vuelve a `asoma`,
   `shake(150, 1)`; `const n = api.inc('cpd_papel_tirones')` (L): n = 1 «Tiro un poco. Desde dentro, alguien tira más
   fuerte.»; n ≥ 2 «Desde dentro no sueltan. El de ahí no está distraído.» (siembra: en el III estará distraído).
2. Acto III sin `ruben_encontrado`: `onEnter` pone `papel_continuo: 'corre'` (estado nuevo: la tira avanza 1 px cada
   120 ms y se amontona; `sfx('typewriter')` suave). Primera entrada (`api.once('cpd_papel_chorro')`, fuera de
   `api.restoring`): BRUNO «El papel del 27 sale a chorro. El de dentro está muy ocupado.»
3. `papel_continuo.mirar` en el III (sin Rubén): la primera línea pasa a «Papel continuo, saliendo a chorro. Nadie lo
   sujeta desde dentro.» (la del borde perforado sigue igual).
4. `armario_27.tirar`: «La puerta no cede. El papel de abajo es otra cosa.» (fuera la contradicción con el papel).
5. Tirar en el III = `revelacion_ruben` de hoy (sin cambios; el «¡EH! ¡QUE ES MI BORRADOR!» ya rima).
6. **No** hay titular en el monitor de Yoli ni fila en la hoja de E4 (§12).

**Dos pistas en el III:** la línea de entrada (todo jugador), el papel que se mueve y el Mirar; la siembra del II para
quien tiró. **Pistas** (`armario`): 1 «Ese papel que sale del armario, tira de él, que no muerde.» · 2 «Antes tiraban
desde dentro. Ahora el de dentro está muy liado escribiendo.» · 3 [«Tira con ganas del papel del armario, hijo.»,
«Sistemas: tirar del papel continuo del 27.»].

### 2.5 La columna nueva (`pecera.js`, `pecera.dialogos.js`, `ecosistema.js`; `items.js`, `art/pecera.art.js`)

**Lógica:** Anselmo acepta las fotos pero no escribe novedades; una columna se escribe con rotulador; el de Anselmo no
sale de Desarrollo; en Comercial hay uno que «solo pinta objetivos». La regla de Anselmo (de fuera / de dentro, «lo que
tiene alta es de la casa») convierte la frase de Rubén, escrita con una herramienta de fuera, en «de la casa»: **es el
eco de «El modelo es de fuera. El prompt es de dentro.»**, no su repetición.

1. **El rotulador** (`ecosistema.js`, `termometro_ventas.coger`, desde `torno_abierto`, una vez; L
   `ecosistema_rotulador_dado`): con Maripaz en la sala, MARIPAZ «¿Mi rotulador de objetivos? Llévatelo. Lo que pintes,
   lo cobro como espacio.»; sin ella (Acto II antes de D1), Bruno lo coge sin decir nada (`sfx('pickup')`). `give
   ('rotulador_rojo')`. Después, Coger termómetro → lo genérico. Usar termómetro: lo de hoy.
2. **Objeto** `rotulador_rojo` (I1, `items.js`): nombre «rotulador de objetivos»; icono 24 px (rotulador rojo, capuchón,
   etiqueta «Q3»); Mirar «Rotulador rojo de Comercial. Solo ha pintado objetivos.»; el resto, genérico.
3. **Álbum a Anselmo** (`AN_ALBUM_INTRO`, por Dar o por la opción «Mira este álbum.»): igual hasta «…Y despedir no es una
   columna de mi tablero.» y después ANSELMO «Las fotos me valen. Pero yo no escribo columnas nuevas.»; `api.take
   ('album_eventos')`, `setFlag('album_validado')` (G); el kanban pinta la foto grapada al pósit de Rubén; `return
   'exit'`. **Se borra el nodo `AN_ALBUM`** (cinco opciones y tres réplicas). La opción de AN0 «Necesito la baja de
   Rubén.» pasa a `if: ['ruben_encontrado', '!has:album_eventos', '!album_validado', '!posit_descopeado']`.
4. **El tablero** (`kanban` y `posit_1998`):
   | Acción | Respuesta |
   |---|---|
   | Usar rotulador con el kanban o el pósit, sin `album_validado` | ANSELMO «Ni se te ocurra. De mi tablero se sale hecho o muerto.» (la de hoy) |
   | Usar el kanban (sin objeto) con `album_validado` y sin rotulador | BRUNO «Una columna nueva pide rotulador. El de Anselmo no sale de Desarrollo.» |
   | Usar el kanban sin `album_validado` | lo de hoy («Me escribo un pósit…») |
   | Usar `boli_muerto` con el kanban | BRUNO «Un boli no pinta en pizarra. Este, ni en papel.» |
   | Coger los bolis de Aurora (tras el boli muerto) | AURORA «Los demás están vivos; por eso no los presto.» (C86) |
   | Dar el rotulador a Anselmo | ANSELMO «¿De dónde viene? Si no lo sabes, no lo cojo.» (su `dar:*` de hoy) |
   | Usar rotulador con el kanban, con `album_validado` | Bruno va al tablero (`walkTo('kanban')`) y `api.choose(COLUMNAS)` |
   `COLUMNAS` (pantalla): «DESPEDIDOS», «HECHO (DE VERDAD)», «FIRMAR EN PAPEL», «SALIDA EN VALOR» (si `rep_13`),
   «DESCOPEADO» (si `oyo_descopear`), «Mejor no.». Con una equivocada: Bruno escribe (`anim reach`, `sfx('paper')`),
   Anselmo cruza, la borra con la manga (`anim reach`, `sfx('paper')`) y dice: DESPEDIDOS → «Eso es «muerto» con
   corbata.» · HECHO (DE VERDAD) → «"De verdad" no es un estado.» · FIRMAR EN PAPEL → «Eso es tuyo. Mi tablero no es tu
   diario.». Con `pecera_columna_mal_n` (L) = 3 y sin `rep_13` ni `oyo_descopear`, además, la de hoy «Tráeme algo que
   no sea ni hecho ni muerto. Eso no existe.». Con una buena: §3.5 (`salida(api, via)` con el arranque nuevo).
5. **`salida(api, via)`**: Bruno escribe la columna, coge el pósit de Rubén y lo cambia (`anim reach 700`), `setFlag
   ('posit_descopeado')`, `setFlag('columna_kanban', via === 3 ? 'salida' : 'descopeado')` (G, str). Fuera el paseo de
   Anselmo al tablero y su rotulador. Desde «Columna nueva. La primera que no dice que no.» todo sigue igual, salvo
   C94 («Revocado. Fecha: hoy. Efectos: julio.»). Con `taper_dado`, Rubén va a la ventana con el táper en la mano
   (`api.sostener(R, 'taper')`, 0 líneas: paga el cabo suelto de la crítica). El rotulador se queda en el inventario.
6. **Arte** (`art/pecera.art.js` `drawKanban`): la columna nueva, «SALIDA EN VALOR» o «DESCOPEADO» según
   `columna_kanban`, en rojo rotulador y con peor letra que la de Anselmo; debajo, en micro, «patrocina: Comercial»;
   foto grapada al pósit con `album_validado`. `kanban.mirar` con `posit_descopeado`: «Y una nueva, a rotulador: SALIDA
   EN VALOR. Dentro, el pósit de Rubén.» (hoy) o, con `columna_kanban === 'descopeado'`, la misma con «DESCOPEADO».

**Dos pistas antes de la abuela:** (1) Anselmo «yo no escribo columnas nuevas» (el «yo» invita); (2) Usar el tablero
(«pide rotulador; el de Anselmo no sale de Desarrollo»); (3) el boli muerto; (4) el termómetro «pintado a rotulador» que
ya se miró en Comercial. **Orden roto:** rotulador antes del álbum → vale (en el recorrido se coge antes); álbum sin
`rep_13` → solo las tres equivocadas y la línea de hoy a la tercera; rotulador antes de tiempo en el tablero → negativa
de hoy. **Callejón:** ninguno (el rotulador está siempre en Comercial y no se gasta; el ascensor con atajo deja el viaje
en ≈ 45 s).

**Pistas:** `album` igual. `baja` (hecho `album_validado`; activo con el álbum en la mano): 1 «Las fotos, enséñaselas al
que lleva la lista. Que vea que el chico existe.» · 2 «El del tablero no se cree nada sin pruebas. Ya tienes pruebas.» ·
3 [«Enséñale las fotos al del tablero.», «El álbum, a Anselmo.»]. `columna` **nuevo** (acto 3 · activo `album_validado`
· hecho `ruben_libre` · salas `pecera`, `ecosistema` · meta `M.columna` «Anselmo ya cree que Rubén existe. Lo que no hay
es columna para que se vaya.»): 1 «Si en un tablero no hay sitio para lo que quieres, hijo, haz tú el sitio.» · 2 «Una
columna nueva se escribe con rotulador. La de los anuncios tiene uno.» · 3 [«Escribe en el tablero la frase fina del
chico, y mueve tú el papelito.», «Rotulador de Maripaz y tablero de Anselmo: «SALIDA EN VALOR».»] · `extra` con
`['!rep_13', '!oyo_descopear']`: «Pero antes pregúntale al chico por los discursos de ese señor.» (la de hoy).

### 2.6 La señal tras el clímax (`escenas/climax.js` `onWin`, `sala_amazonas.js` `update`; `actors.js`, `audio.js`)

1. `duelInigo.onWin`, tras su línea: `faceActor` de Íñigo, Gervasio y Maripaz (si está) hacia el Lector Medio. 0 líneas.
2. `actors.js`: tercer fotograma `tamb3` (8°) y `tamb3j`; `TAMBALEO.frames = [4, 0, 8, 0, 4, 0, 2, 0]`. P0: receta
   `sfx('crujido')` (ruido corto filtrado, cartón).
3. `sala_amazonas.update(api, dt)`: con `duelo_inigo_ganado && !lector_derribado && climaxActivo(api)` y
   `api.quieto()`, acumula `S.quieto += dt` (estado de módulo; 0 en `onEnter`; **el ratón no lo reinicia**). Cuando
   `tambaleo(t)` pasa a `tamb3`, `sfx('crujido')`. A los 10, 25 y 45 s, una vez cada una (`api.once('sala_lector_meg_'
   + i)`), `api.megafonia('celestino', MEGAFONIA_TAMBALEO[i], { etiqueta: 'MEGAFONÍA' })` (§5.3). Nada más: la cadena
   final no cambia y el empujón sigue en `climaxEmpujon`.
4. Gervasio, Hablar tras D4 (M34): «Lo que diga el Lector Medio. Que se está... Se está moviendo.»
**Pistas** (`empujon`): sin cambios.

### 2.7 Ascensor con atajos (`content/lib/ascensor.js`, P0)
Tras elegir planta y pasar `plantaPermitida`: `const aqui = destinos(api).filter(d => d.planta === dest.n && d.room !==
dest.room)` (de `directorio.js`). Si hay alguno: `api.choose([nombreDe(dest.room), ...aqui.map(d => d.nombre)], {
escape: 0 })` (nombre de la sala de llegada: «Redacción», «Marketing y Comercial»). Cabina y frase igual; `goto` a la
elegida con su `entry`. Valen todos los bloqueos de `destinoAbierto` (pisadas, torno, Sala solo en I-II, nada tras el
empujón). En −1 y 0 no hay submenú. Cero líneas. **`walk-lib.mjs`** (I1): tras elegir la planta, si sale el submenú,
elegir la opción 0 (la sala de llegada: el BFS del recorrido ya cuenta el ascensor como arista a esa sala).

### 2.8 Lote pequeño (igual que el diseño, con dos precisiones)
- **F4** `junto(api, x, y, cam, quien)`: paneo ≤ 700 ms a quien llama (gesto + PLIN/beep), `cameraFollow`, `walkTo(x,
  y, { run: true })`. Sin fundido. Con `game.instant`, como hoy. `quien`: Yoli (`viral`, `cmsEntrada`, E4 S5), Leoncio
  (`dosIAs`, `anexion`).
- **F8** táctil: §6. **F9** Custodia: `goto: 'CU0'` en lugar de `exit` salvo «Nada, perdone.» y `CU_DA`.
- **N6** Aurora: condición `['acto_2_iniciado', rvLeido]` y, al marcar leído un RV de Tadeo con `api.room ===
  'catacumba'`, el par de Aurora en ese momento (mismo `once`). **N9**: nada.
- **M20, eco:** la rama con `herminia_midio` del árbol de Anselmo pasa a «Ya te lo he dicho. Lo escribí yo. En
  mayúsculas.» (sin repetir medio prompt). Así la frase favorita **se oye entera una sola vez**: en `pecera_herminia_mide`.

---

## §3 · TEXTO DEFINITIVO DE LAS ESCENAS NUEVAS

Voces (PLAN_COMEDIA §2): Gervasio impersonal y cortado; Gertrudis en mayúsculas de LCD; Paco con «Estado:»; Anselmo
seco, de fuera/de dentro; Celestino locutor deportivo con un registro llano; Yoli en cifras. Entre paréntesis, acciones
(nunca texto). **[N]** = línea nueva; **[=]** = existe hoy; **[S]** = sustituye a una de hoy (literal en §4.2).

### 3.1 Sala Amazonas · «Pregunta del público» (`sala_tele_gertrudis`) y atasco
```
(Usar la tele con gertrudis_pregunta. Cutscene.)
(tele: «BUSCANDO SEÑAL», nieve, 600 ms; luego estado `gertrudis`: el LCD verde a pantalla completa, piloto EN DIRECTO. beep)
(Fermín, Rogelio y Jacinto se giran a la tele; Gervasio también.)
ROGELIO      [N] ¡Se ve! ¡Por fin se ve la pantalla!
GERTRUDIS    [N] PREGUNTA DEL PÚBLICO: ¿Y CUÁLES SON LOS SIGUIENTES PASOS?        (api.sayFrom('tele_amazonas', …, { color: '#39FF14' }))
(1.200 ms de silencio; tiembla un botellín)
GERVASIO     [S] Pregunta de un conectado. Consta. Los... siguientes...
FERMÍN       [=] El siguiente paso sería...
ROGELIO      [=] ¡No lo digas!
GERVASIO     [=] Eso se podría ver en una reunión. De siguientes pasos.
JACINTO      [=] ¿Y quién la convoca?
(todos miran a la tele)
GERTRUDIS    [S] CONVOCADA. TODA LA EMPRESA EN COPIA. EMPIEZA EN CINCO MINUTITOS.
(¡estampida! sillas, dominó de botellines; los tres se encajan en la puerta: estampida({ esperar: true }))
FERMÍN       [=] ¡Usted primero!
ROGELIO      [=] ¡No, usted, que es de Bolsa!
JACINTO      [=] ¡Yo soy de Bolsa y de Mercados! ¡Tengo doble prioridad!
(fin de la cutscene; la tele sigue con Gertrudis hasta que se resuelve el atasco; sala_amazonas_atasco = true; sinGuardar(true); en modo rápido, vía anuncio sin soltar el control)
— vía empujar —   BRUNO    [N] Les doy un empujoncito. Salen los tres de golpe.
— vía cruasán —   JACINTO  [N] ¡Ese medio cruasán es mío! ¡Lo he cobrado dos veces!
— vía hablar —    BRUNO    [N] ¿Y la próxima reunión, cuándo es?
— vía anuncio —   MARIPAZ  [=] ¡Un momento! ¡Antes de salir, un anuncio de cinco segundos!
(plop, plop, plop; resto de hoy: botellines tumbados, el regreso mudo a por el cruasán salvo en la vía cruasán)
GERVASIO     [=] Se levanta la sesión. Lo hablamos.
BRUNO        [=] ¿Usted no huye?
MARIPAZ      [=] ¿Huir? Esta sala la tengo pagada hasta las nueve, cariño. La amortizo. / Y estoy sentada en el planillo. …
```
Antes, en el camino: AURORA [S] «Y una reunión solo se acaba cuando alguien pregunta por el punto que nadie toca.» ·
GERVASIO [N] «Los becarios no tienen turno. Pregunta la mesa... y los conectados.» · GERTRUDIS (Vending) [N] «PREGUNTA
SIN RESPUESTA. LA MANDO A LA PRÓXIMA PANTALLA QUE ME SINTONICE.» · BRUNO (tele, sin turno) [N] ««BUSCANDO SEÑAL». Alguien
con wifi y rencor la encontraría enseguida.» · BRUNO (móvil con tele) [N] «Desde mi móvil no me sintoniza nadie. Los once
mil son de la cafetera.» · BRUNO (Usar orden del día) [S] «Para tocar el punto 3 hay que decirlo en voz alta, a quien
preside.»

### 3.2 Redacción · el apagón (`pecera_apagon`, n = 1) y su cierre (`apagonCierre`)
```
(cutscene) Bruno, al enchufe; tira. Clic. api.apagon({ ms: 0, nombres: true, interceptar, spots: [SPOT_YOLI[0], { actor: 'anselmo_monolito', rx: 10, ry: 8 }] })
YOLI         [=] ¡Estamos ciegos! ¿Hay alguien leyendo? ¿HAY ALGUIEN AHÍ FUERA?
(PLIN; monitor en `publicado`)
YOLI         [=] ...Ha entrado una pieza. ¡Ha entrado una pieza! ¡El CMS va!
(Anselmo se levanta con la linterna del móvil y echa a andar hacia el enchufe, sin prisa. Fin de la cutscene.)
(ventana jugable ≤ 12 s; cada 2 s, PLIN y parpadeo de `publicado`; verbos del interceptor:)
  YOLI       [N] ¡Chsss! Estoy contando. Diecisiete. Dieciocho.
  ANSELMO    [N] No me tapes la linterna. Voy a mi enchufe.
  DEV 3      [N] No.                                           (Coger la taza «NO»)
  BRUNO      [N] No veo nada. Solo a Yoli, a la luz del monitor, contando.   (todo lo demás)
(apagonCierre, cutscene: Anselmo enchufa —o ya enchufó Bruno—; luz; monitor en `guardando`)
ANSELMO      [=] Ese enchufe está en mis sistemas. Desenchufar es un cambio sin revisar.
YOLI         [=] ...Ya no va.
BRUNO        [=] Iba mientras estaba apagada.
ANSELMO      [S] ¿La quieres apagada? Ese cable baja a Sistemas. Que te la apague Paco.
(Anselmo vuelve a su mesa; pecera_oscuras = false; sinGuardar(false); sinCongelar(A, false))
```
Escalada n = 3: fuera «Y mira la brida. Ese cable no acaba aquí.» (ya está dicho); se quedan «Tercera vez. Te paso a
BLOQUEADO.», C93 «Si quieres que se quede apagada, tráeme un motivo. ¿Tiene número?» y Bruno «Un motivo con número y un
cable que baja. Eso huele a Paco.» (pista del registro). n = 2, como hoy.

### 3.3 Sistemas · regletero
Mirar: «Cinco regletas: NÓMINAS, ASCENSOR, un pósit, GERTRUDIS y NO TOCAR NUNCA.» / «El pósit, con letra de Paco: «ni
aunque lo diga el ticket 3».» · Mirar apagado: «El regletero. La del pósit, apagada.» / «Arriba, la Redacción trabaja a
ciegas.» · Cerrar: «Ya está cerrado. Cinco bridas lo dicen.» · Fallos: R-1 PACO «Esa es la de las nóminas. Si la tocas,
no cobra nadie. Tú tampoco.» · R-2 CELESTINO (rejilla) «¡Ascensor parado en mitad de la jugada! ¡Tiempo muerto!» · R-4
GERTRUDIS (rejilla) «E-55: UN SEGUNDO SIN CORRIENTE. ANOTADO CON RENCOR.» · R-5 BRUNO «Pone «NUNCA». Paco la mira con
ternura. No la toco.»
R-3 (lo que queda de `tirarRegleta`):
```
(clic; piloto apagado; un segundo de nada)
CORO (rejilla)  [=] CORO: ¡Ha sido Diseño!
BRUNO           [=] (a la rejilla) He sido yo. Pero gracias.
(+318 en cuatro pitidos; cms_vivo)
PACO            [=] Trescientos dieciocho tickets nuevos. Todos dicen «el CMS ya va».
(Paco se gira por primera vez)
PACO            [=] Tengo un hueco. Uno. ¿Qué querías?
```

### 3.4 Papel y Sistemas · el ticket 0.441
BRUNO (Mirar fax) [S] «Un fax de 1992: «SIN PAPEL». Pegatina: «Mantenimiento: Sistemas. Ticket 0.441».» · PACO (sin
pegatina, 1.ª) [N] «¿Qué fax? Sin número de ticket, para mí no hay fax.» · PACO (2.ª y siguientes) [N] «Todo lo que
mantengo lleva mi pegatina. Ese fax también.» · BRUNO (opción) [N] «Ticket 0.441. El fax de Teodoro.» · PACO [S] «0.441.
De 1999. Estado: lo respetamos.» · PACO [S] «Toma el manual. Página 9: la respuesta automática. Mi mejor empleada.»

### 3.5 Redacción y Comercial · la columna
```
(Comercial, Coger termómetro, con Maripaz)
MARIPAZ   [N] ¿Mi rotulador de objetivos? Llévatelo. Lo que pintes, lo cobro como espacio.
(Redacción, Dar álbum a Anselmo: AN_ALBUM_INTRO de hoy, sus cuatro líneas, y además)
ANSELMO   [N] Las fotos me valen. Pero yo no escribo columnas nuevas.
(Usar rotulador con kanban → menú de columnas. Equivocadas: Bruno escribe; Anselmo cruza y la borra con la manga)
ANSELMO   [N] Eso es «muerto» con corbata.                    (DESPEDIDOS)
ANSELMO   [N] «De verdad» no es un estado.                    (HECHO (DE VERDAD))
ANSELMO   [N] Eso es tuyo. Mi tablero no es tu diario.        (FIRMAR EN PAPEL)
(SALIDA EN VALOR: Bruno escribe, coge el pósit de Rubén y lo cambia de columna. Las tres espaldas del coro se giran.)
(1,5 s. Anselmo se acerca, mira la columna, mira el rotulador.)
ANSELMO   [N] ¿Con qué has escrito eso? ...Rotulador de Comercial. De fuera.
ANSELMO   [S] Salida en valor. Ni hecho ni muerto, pero sale.
ANSELMO   [S] La frase la escribió Rubén. Rubén tenía alta. ...Entonces es de la casa.
ANSELMO   [=] Columna nueva. La primera que no dice que no. / El tablero va conectado al registro de Paco. / Y en nuestros corazones, Rubén está en HECHO.
(… igual que hoy: ticket nº 1, Rubén a la ventana —con el táper si taper_dado—, «Revocado. Fecha: hoy. Efectos: julio.», Leoncio, Herminia, «La frase con la que Íñigo despide…», «Y la escribí yo. SEGUIREMOS INFORMANDO. Perdón.»)
(DESCOPEADO: «¿Con qué has escrito eso? ...Rotulador de Comercial. De fuera.» / «Descopear. Quitar sin que se note. Eso es infraestructura.» [=])
```
Otras: BRUNO (Usar kanban, sin rotulador) [N] «Una columna nueva pide rotulador. El de Anselmo no sale de Desarrollo.» ·
BRUNO (boli muerto con kanban) [N] «Un boli no pinta en pizarra. Este, ni en papel.» · BRUNO (Mirar rotulador) [N]
«Rotulador rojo de Comercial. Solo ha pintado objetivos.»

Por qué así el remate: la favorita del dueño («El modelo es de fuera. El prompt es de dentro. / Eso lo hace nuestro.»)
se oye entera una vez en el paso 38. Aquí Anselmo **hace el mismo razonamiento sin decir la frase**: herramienta de
fuera, contenido de dentro, alta en regla → «de la casa». El jugador completa la simetría; nadie la explica. Un solo
golpe al final y ninguna coletilla detrás (fuera «Consultoría.» y «…Eso sí lo sé hacer yo.»).

### 3.6 Armario 27
BRUNO (Tirar papel, I-II, 1.ª) [S] «Tiro un poco. Desde dentro, alguien tira más fuerte.» · (2.ª y siguientes) [N] «Desde
dentro no sueltan. El de ahí no está distraído.» · (entrada en Sistemas en el III) [N] «El papel del 27 sale a chorro. El
de dentro está muy ocupado.» · (Mirar papel en el III) [S] «Papel continuo, saliendo a chorro. Nadie lo sujeta desde
dentro.» · (Tirar armario) [S] «La puerta no cede. El papel de abajo es otra cosa.»

### 3.7 Señal tras el clímax
Ver §5.3 (megafonía) y M34 (Gervasio).

---
## §4 · TABLA DE REESCRITURAS

### 4.0 Criterio de la contra
Cada fila se ha leído en su contexto (handler y escena) con tres preguntas: ¿la frase sin apéndice sigue teniendo
remate?, ¿la forma nueva es otro tic?, ¿suena a guionista (pariente inventado, dos chistes apilados, coletilla tras el
remate)? Resultado sobre las 160 entradas del guionista (113 C, 34 M, 4 K, 9 X): **149 aprobadas, 8 mejoradas, 3
tumbadas**. De las 113 de §2 (coletillas): 108 aprobadas, 4 mejoradas (C34, C37, C43, C69) y 1 tumbada (C97, sin objeto).
Las QUITA aguantan porque casi todas eran «frase con golpe + explicación»; las cuatro que se cambian, o no se entendían
(C37), o se oyen mucho (C69, respuesta por defecto), o cambian de objeto (C34, C43). Los suspensivos de frase cortada
nuevos son 8 en todo el juego (C76, C90, C98, M27, M28, M33, M34 y la «…y los conectados» de Gervasio), todos de
Gervasio salvo dos: por debajo de 10.

### 4.1 Entradas del guionista (literal actual → nuevo)
Manda el texto. «(×2)» en la nota del guionista = la cadena está en dos claves: se cambian las dos.

| # | Fichero | Quién | Actual (literal) | Nuevo | Veredicto | Nota |
|---|---|---|---|---|---|---|
| C01 | `rooms/vestibulo.js` | Bruno | Abajo hay una casilla que pone VACANTE. Sin cara. Con hueco de becario. | Abajo hay una casilla que pone VACANTE. Le falta una cara. | APROBADA |  |
| C02 | `rooms/vestibulo.js` | Bruno | Si tiro del organigrama, me caen treinta jefes. Y ninguno ayuda. | Si tiro del organigrama, me caen treinta jefes. | APROBADA |  |
| C03 | `rooms/vestibulo.js` | Bruno | Si me la llevo, Celestino se queda sin partido. Y yo sin portero. | Si me la llevo, Celestino se queda sin partido. | APROBADA |  |
| C04 | `rooms/vestibulo.js` | Bruno | Desde aquí se ve la moqueta. Algún día la piso. Con contrato. | Desde aquí se ve la moqueta. Algún día la piso. | APROBADA |  |
| C05 | `rooms/vestibulo.js` | Bruno | Si le quito la bufanda, narra. Y nadie quiere eso. | Si le quito la bufanda, narra. | APROBADA | el altavoz ya dice «Con la bufanda puesta no narra» |
| C06 | `rooms/vestibulo.js` | Bruno | DISEÑO Y PRODUCTO. Y colgando, mi foto. | DISEÑO Y PRODUCTO. De la rama cuelga mi foto. | APROBADA |  |
| C07 | `rooms/vestibulo.js` | Bruno | Si tiro de la rama, se cae la casilla. Y yo con ella. | Si tiro de la rama, se cae la casilla. | APROBADA |  |
| C08 | `rooms/vestibulo.js` | Bruno | A Celestino no se le empuja. Lleva galones. Y bufanda. | A Celestino no se le empuja. Lleva galones. | APROBADA |  |
| C09 | `rooms/vestibulo.js` | Celestino | Ese chicle ya es tuyo. Aquí no se aceptan devoluciones. Ni en el torno. | Ese chicle ya es tuyo. Aquí no se aceptan devoluciones. | APROBADA |  |
| C10 | `rooms/vestibulo.js` | Celestino | Dos maneras: jubilarse o un «accidente». Con comillas. | Dos maneras: jubilarse o un «accidente». | APROBADA | las comillas, con los dedos: `api.anim(C, 'reach')` antes del `reply` (pasa a `do`) |
| C11 | `rooms/pecera.js` | Bruno | Está abierta de par en par. Nadie se atreve a cerrarla. Ni a cruzarla. | Está abierta de par en par. Nadie se atreve a cerrarla. | APROBADA |  |
| C12 | `rooms/pecera.js` | Bruno | No sé usarla. Ni ella a mí. | No sé usarla. Ella a mí tampoco. | APROBADA | mismo chiste, dicho como se habla |
| C13 | `rooms/pecera.js` | Bruno | Debajo, a rotulador, la excepción de Anselmo. Con número. | Debajo, a rotulador, la excepción de Anselmo: «SALVO TICKET Nº 3». | APROBADA | «Con número» se queda solo en Anselmo (paso del enchufe) |
| C14 | `rooms/pecera.js` | Bruno | Enchufar algo más aquí sería pedirle demasiado a esa pantalla. Y a la regleta. | Enchufar algo más aquí sería pedirle demasiado a esa pantalla. | APROBADA |  |
| C15 | `rooms/pecera.js` | Bruno | Abro un documento en blanco. Me mira. Sin fuentes no escribo. | Abro un documento en blanco. Me mira. Lo cierro: sin fuentes no hay pieza. | APROBADA |  |
| C16 | `rooms/pecera.js` | Bruno | Ya está escrita. Ahora le faltan hueco, fuente y firma. Y papel. | Ya está escrita. Ahora le faltan hueco, fuente y firma. | APROBADA |  |
| C17 | `rooms/pecera.js` | Bruno | Si me siento con su chaqueta, la silla sigue siendo suya. Y yo, encima. | Si me siento con su chaqueta, la silla sigue siendo suya. | APROBADA |  |
| C18 | `rooms/pecera.js` | Bruno | Las sillas no se cogen. Se heredan. Y Ramírez sigue desayunando. | Las sillas no se cogen. Se heredan. | APROBADA | vuelve el original de E3; el cruasán ya lo siembra la tele de la Sala (C46) |
| C19 | `rooms/pecera.js` | Bruno | Si la vuelvo a colgar, la silla vuelve a ser de Ramírez. Y yo, de pie. | Si la vuelvo a colgar, la silla vuelve a ser de Ramírez. | APROBADA |  |
| C20 | `rooms/pecera.js` | Bruno | Si la dejo en la frontera, Anselmo la envuelve. Y Ramírez no vuelve. | Si la dejo en la frontera, Anselmo la envuelve. | APROBADA |  |
| C21 | `rooms/pecera.js` | Bruno | "ACCESO REVOCADO: TITULATOR 3000". Con fecha de hoy. Y de julio. | "ACCESO REVOCADO: TITULATOR 3000". La fecha está corregida a mano. | APROBADA |  |
| C22 | `rooms/pecera.js` | Bruno | Valentín Retícula, de Diseño y Producto. Cascos puestos. Sin música. | Valentín Retícula, de Diseño y Producto. El cable de los cascos no va a nada. | APROBADA | «Diseño» no cambia (sigue 1) |
| C23 | `rooms/pecera.js` | Bruno | No. Está trabajando. Si le empujo, se le mueve un píxel. Y lo nota. | No. Está trabajando. Si le empujo, se le mueve un píxel. | APROBADA |  |
| C24 | `rooms/pecera.js` | Bruno | Anselmo, director de Desarrollo. Cinta en el cinto. Y su tablero detrás. | Anselmo, director de Desarrollo. Cinta en el cinto. | APROBADA |  |
| C25 | `rooms/pecera.secretaria.js` | Bruno | La Secretaría de Redacción. Bajo la persiana, dos manos. Y una llave. | La Secretaría de Redacción. Bajo la persiana, dos manos. | APROBADA |  |
| C26 | `rooms/pecera.secretaria.js` | Bruno | Si me llevo el timbre, Custodia me apunta en el libro. Con tinta azul. | Si me llevo el timbre, Custodia me apunta en el libro. | APROBADA |  |
| C27 | `rooms/pajarera.js` | Bruno | No. Íñigo los tiene contados. Por colores. Y por horas. | No. Íñigo los tiene contados. Por colores. | APROBADA |  |
| C28 | `rooms/pajarera.js` | Bruno | "Mercados · cinco minutitos · marzo". Sin hora de salida. | "Mercados · cinco minutitos · marzo". La hora de salida, en blanco. | APROBADA |  |
| C29 | `rooms/pajarera.js` | Bruno | Con la chaqueta de Ramírez parece más medio. Y más de Bolsa. | Con la chaqueta de Ramírez parece más medio. | APROBADA |  |
| C30 | `rooms/pajarera.js` | Bruno | Ficha: "43 años. Le interesa la economía. Y ahorrar". | Ficha: "43 años. Le interesa la economía". Lo demás, tapado con celo. | APROBADA | guarda «ahorrar» para el clímax (§3, M-AHO) |
| C31 | `rooms/pajarera.js` | Bruno | No. Si se cae, se cae todo. Y todavía no toca. | Todavía no. Si se cae, se cae todo. | APROBADA | la pista (U31 de E3) se queda; cambia el orden |
| C32 | `rooms/catacumba.js` | Bruno | Vuelta a la Redacción web. Al otro lado del latón, el siglo XXI. Con escalas. | Vuelta a la Redacción web. Al otro lado del latón, el siglo XXI. | APROBADA |  |
| C33 | `rooms/catacumba.js` | Bruno | Si descuelgo una, Teodoro me mide. Con la regla. | Si descuelgo una, Teodoro me mide. | APROBADA |  |
| C34 | `rooms/catacumba.js` | Bruno | Un fax beige de 1992. Pantallita: «SIN PAPEL». Y sin ganas. | Un fax de 1992: «SIN PAPEL». Pegatina: «Mantenimiento: Sistemas. Ticket 0.441». | MEJORADA | funde la pegatina del ticket 0.441 (§2.3): el Mirar sigue siendo una sola línea |
| C35 | `rooms/catacumba.js` | Bruno | No tengo bigote que comparar. Ni contrato. | No tengo bigote que comparar. | APROBADA |  |
| C36 | `rooms/catacumba.js` | Bruno | Toc en los nudillos. El cartel no se toca. Ni se discute. | Toc en los nudillos. El cartel no se toca. | APROBADA |  |
| C37 | `rooms/catacumba.js` | Bruno | Toc en el lomo. El libro no se mueve. Y yo, tampoco. | Toc en el lomo. El libro no se mueve. | MEJORADA | «Aparto la mano antes que el libro» no se entiende; basta quitar |
| C38 | `rooms/catacumba.js` | Bruno | Teodoro señala el fax. Con mucha intención. | Teodoro no dice nada. Señala el fax. | APROBADA |  |
| C39 | `rooms/catacumba.js` | Bruno (opción) | Ya vuelvo. Con café. | Ya vuelvo con café. | APROBADA | opción de salida, sin `goto` ni flag: cambia solo el texto |
| C40 | `rooms/cpd.js` | Bruno | ...Y alguien teclea dentro. Rápido. Con faltas. | ...Y alguien teclea dentro. Rápido. | APROBADA | «Con faltas» ×3 en Sistemas → 0 |
| C41 | `rooms/cpd.js` | Bruno | Le hablo al armario vacío. Contesta el eco. Con faltas. | Le hablo al armario vacío. Contesta el eco. | APROBADA |  |
| C42 | `rooms/cpd.js` | Bruno | Arriba, la Redacción trabaja a ciegas. Y publica. | Arriba, la Redacción trabaja a ciegas. | APROBADA | pasa al Mirar del regletero con la R-3 apagada (§2.2) |
| C43 | `rooms/cpd.js` | Bruno | Ya está cerrada. Y encendida. Y con brida. | Ya está cerrado. Cinco bridas lo dicen. | MEJORADA | el objeto es ahora el regletero (§2.2) |
| C44 | `rooms/cpd.js` | Bruno | Ya está abierto. Por la misma página. Con la esquina doblada. | Ya está abierto. Por la misma página. | APROBADA |  |
| C45 | `rooms/ecosistema.js` | Bruno | Mi primera firma en redes. Sin mi nombre. Con buena luz. | Mi primera firma en redes. Pone «[NOMBRE]». | APROBADA | «Mi primer/a» no cambia (sigue 1) |
| C46 | `rooms/sala_amazonas.js` | Bruno | «ENTRADA 3»: una videollamada de 2019. Ramírez, congelado. Con cruasán. | «ENTRADA 3»: una videollamada de 2019. Ramírez, congelado a medio cruasán. | APROBADA |  |
| C47 | `rooms/ecosistema.js` | Bruno | No. Si lo cojo, publica que me lo llevo. Con buena luz. | No. Si lo cojo, publica que me lo llevo. | APROBADA |  |
| C48 | `rooms/ecosistema.js` | Bruno | Si lo descuelgo, el móvil de Borja lo publica. Con música triste. | Si lo descuelgo, el móvil de Borja lo publica. | APROBADA |  |
| C49 | `rooms/ecosistema.js` | Bruno | Le hago una foto. Me la reenvía. Con resumen. | Le hago una foto. Me la reenvía. | APROBADA |  |
| C50 | `rooms/ecosistema.js` | Bruno | No. Yo quiero una plaza de bici. Y por las buenas. | No. Yo quiero una plaza de bici. | APROBADA |  |
| C51 | `rooms/ecosistema.js` | Bruno | La planta 2 a las seis y media: moqueta, pufs y nadie. Y un gong, detrás. | La planta 2 a las seis y media: moqueta, pufs y nadie. | APROBADA | el gong se queda en el pasillo de Administración (C53) |
| C52 | `rooms/ecosistema.js` | Maripaz (mp) | Rojo hasta el 98 %. Nadie lo nota. Ni las ventas. | Rojo hasta el 98 %. Nadie lo nota. | APROBADA | el empujar del termómetro ya dice «No las ventas» |
| C53 | `rooms/administracion.js` | Bruno | El pasillo, de vuelta a Marketing. Al fondo, la impresora. Y un gong. | El pasillo, de vuelta a Marketing. Al fondo suena un gong. | APROBADA | si se quiere, `api.sfx('gong')` (Mirar pasa a función) |
| C54 | `rooms/administracion.js` | Bruno | Lleno la del original y la dejo ahí. Begoña la mira con sospecha. Sin ticket. | Lleno la del original y la dejo ahí. Begoña la mira con sospecha. | APROBADA |  |
| C55 | `rooms/administracion.js` | Bruno | Ya está en su sitio. Y bien puesta. | Ya está en su sitio. Evaristo me mira hasta que aparto la mano. | APROBADA |  |
| C56 | `rooms/administracion.js` | Bruno + Evaristo | No le llamo. Está a un metro. Y me lo cogería. | No le llamo. Está a un metro. / [Evaristo] Puede llamarme. Lo cogería. | APROBADA | la segunda, `sayEv`; Evaristo, encantado de que le llamen |
| C57 | `rooms/administracion.dialogos.js` | Bruno | RECHAZADO, en la frente. Mi primer documento oficial. Con sello. | RECHAZADO, en la frente. Mi primer documento oficial. | APROBADA | la crítica la cita como la coletilla tipo de Bruno |
| C58 | `rooms/office.js` | Bruno | Si caliento la ficha, se borran las casillas. Y la ilusión. | Si caliento la ficha, se borran las casillas. | APROBADA |  |
| C59 | `rooms/office.js` | Bruno | Pesa lo que un convenio colectivo. Con sus anexos. | Pesa lo que un convenio colectivo. | APROBADA |  |
| C60 | `rooms/office.js` | Bruno | Recalentar un café de Gertrudis delante de ella. Ni loco. | Recalentar un café de Gertrudis delante de ella. No. | APROBADA | un «No.» seco; deja «Ni loco» solo para Tadeo (ecosistema) |
| C61 | `rooms/sala_amazonas.js` | Bruno | Tiro un milímetro. Maripaz pesa más que el planillo. Y que mi contrato. | Tiro un milímetro. Maripaz pesa más que el planillo. | APROBADA |  |
| C62 | `rooms/sala_amazonas.js` | Bruno | «ENTRADA 1»: el vestíbulo. Celestino retransmite. Con bufanda. | «ENTRADA 1»: el vestíbulo. Celestino retransmite. | APROBADA |  |
| C63 | `rooms/sala_amazonas.js` | Bruno | No se cogen. Cotizan. Y a la baja. | No se cogen. Cotizan. | APROBADA |  |
| C64 | `items.js` | Bruno | Y ${n} correos de Tadeo. Todos «RV:». Ninguno leído. Ni por él. | Y ${n} correos de Tadeo. Todos «RV:». Ninguno leído. | APROBADA | plantilla `${n}`: se cambia en el código, no en una cadena fija |
| C65 | `items.js` | Bruno | Me la quito. Vuelvo a ser yo. Con mangas de camisa. | Me la quito. Vuelvo a ser yo. | APROBADA | las «mangas de camisa» se quedan en los Despachos |
| C66 | `items.js` | Bruno | La cláusula 12, subrayada dos veces. Con regla. | La cláusula 12, subrayada dos veces. | APROBADA |  |
| C67 | `items.js` | Bruno | Lo guardo. Evaristo dijo «en el momento oportuno». Y no es este. | Lo guardo. Evaristo dijo «en el momento oportuno». Aún no ha llegado. | APROBADA | dos claves con la misma cadena: se cambian las dos |
| C68 | `items.js` | Bruno | Y esperanza. | **ELIMINAR** | APROBADA | queda «La foto es de cuando tenía 23 años.», que ya duele sola |
| C69 | `game.js` | Bruno (DEFAULTS usar) | Mejor no. Todo lo que tiene cable acaba en Sistemas. Y yo detrás. | Mejor no. Todo lo que tiene cable acaba en Sistemas. | MEJORADA | es la respuesta por defecto: se oye mucho; más corta, mejor |
| C70 | `game.js` | COMBO_GAG | ¿Estás probando todo con todo? Así trabajan en Administración. Y no funciona. | ¿Estás probando todo con todo? Así trabajan en Administración. | APROBADA |  |
| C71 | `pistas.js` | Bruno (Mirar a Bruno) | Arriba no me atiende nadie mientras el CMS no vaya. Y no va. | Arriba no me atiende nadie mientras el CMS no vaya. | APROBADA |  |
| C72 | `rooms/cpd.js` | Rubén | ...Perdón. Gracias. Nadie me había traído nunca nada. Ni la baja. | ...Perdón. Gracias. Nadie me había traído nunca nada. | APROBADA | la siguiente («Lo voy a dejar vacío. Para que dure.») hace el resto |
| C73 | `rooms/cpd.js` | Rubén | ¿CUARENTA SEGUNDOS? ...Perdón. Yo también soy herramienta. Sin pegatina. | ¿CUARENTA SEGUNDOS? ...Perdón. Yo también soy herramienta. | APROBADA |  |
| C74 | `rooms/cpd.js` | Rubén | ¿Café? Gracias. Pero lo que necesito es un táper. Y la baja. | ¿Café? Gracias. Pero lo que necesito es un táper. | APROBADA | coordinar con el diseñador (cabo suelto del táper) |
| C75 | `rooms/cpd.js` | Paco | Ticket nº 1: cerrado. Por el tablero. Sin subir. | Ticket nº 1. Estado: cerrado. No he tenido que subir. | APROBADA |  |
| C76 | `rooms/cpd.js` | Paco (murmullo) | A las seis y media se va la gente. Los tickets se quedan. Y yo, con ellos. | A las seis y media se va la gente. Los tickets se quedan. Y yo... | APROBADA |  |
| C77 | `rooms/cpd.js` | Paco | Ese manual ya es tuyo. Las devoluciones van por ticket. Y tardan. | Ese manual ya es tuyo. Las devoluciones van por ticket. Estado: en cola. | APROBADA |  |
| C78 | `rooms/cpd.js` | Paco | Quédatelo. Yo ya tengo el recuerdo. Y una foto mental. | Quédatelo. Yo ya tengo el recuerdo. | APROBADA | y deja la «foto mental» a Begoña (C82 la quita también: ninguna) |
| C79 | `rooms/cpd.js` | rejilla | (Desde el 27) Alguien teclea. Con faltas. | (Desde el 27) Alguien teclea. Se equivoca. Vuelve atrás. | APROBADA | zona del armario 27: coordinar con el diseñador |
| C80 | `rooms/cpd.js` | rejilla | (Desde el 27) Ñiiic, ñiiic. Y alguien mastica. | (Desde el 27) Ñiiic, ñiiic. Alguien mastica. | APROBADA |  |
| C81 | `rooms/administracion.js` | Begoña | «Pellizco». ¿Viene a justificarse? Usted no tiene ticket. Ni foto. | «Pellizco». ¿Viene a justificarse? Usted no tiene ticket. | APROBADA |  |
| C82 | `rooms/administracion.dialogos.js` | Begoña | Las fotos mentales solo se aceptan con NIF. Y por triplicado. | Las fotos mentales solo se aceptan con NIF. | APROBADA |  |
| C83 | `rooms/administracion.dialogos.js` | Evaristo | Porque por escrito se pierden matices. Y en persona, comas. | Por escrito se pierden matices. En persona, comas. Por teléfono, nada. | APROBADA | enumeración con salvedad: y por eso llama |
| C84 | `escenas/climax.js` | Begoña | Con lo que nos deben hay para un contrato. Con coma. | Con lo que nos deben hay para un contrato. | APROBADA | «Con coma» ×2 en el clímax → 1 (la de la factura); el «¿Con táper?» / «Con ticket.» sigue funcionando |
| C85 | `rooms/catacumba.js` | Aurora | Ese libro, ni tocarlo. Se consulta aquí, de pie. Con las manos limpias. | Ese libro, ni tocarlo; se consulta aquí, de pie y con las manos limpias. | APROBADA | la frase larga es la de Aurora |
| C86 | `rooms/catacumba.js` | Aurora | Los demás están vivos. Y son míos. | Los demás están vivos; por eso no los presto. | APROBADA |  |
| C87 | `rooms/catacumba.js` | Aurora | Ha perdido usted con dos faltas, criatura. Y en cuerpo 72. | Ha perdido usted con dos faltas, en cuerpo 72; se ven desde la escalera. | APROBADA | también quita un «criatura» (§3) |
| C88 | `rooms/catacumba.js` | Teodoro (fax) | En mi página no hay erratas, chaval. Ni en los nombres. | **ELIMINAR** | APROBADA | tras «...Lo ha escrito bien.» no habla nadie: `api.wait(1200)`. También quita un «chaval» |
| C89 | `rooms/pajarera.js` | Íñigo | ¿Ve? Él sí sabe estar. Y sin chaqueta. | ¿Ve? Él sí sabe estar. | APROBADA |  |
| C90 | `rooms/pajarera.js` | Íñigo | Es generativo, autónomo y escalable. Y no pide vacaciones. | Es generativo, autónomo y escala... | APROBADA | Bruno le corta con su «¿Y qué come?» de siempre |
| C91 | `rooms/pajarera.js` | Íñigo | Eso es propiedad intelectual. Y adhesiva. | Eso es propiedad intelectual. | APROBADA | las dos claves (pósits y pósit azul) |
| C92 | `rooms/pecera.escenas.js` | Íñigo | A las nueve, la Reunión de Dirección aprueba el Plan Cero Papel. Sin rotativa. | A las nueve, la Reunión de Dirección aprueba el Plan Cero Papel. | APROBADA | Bruno contesta «¿Sin papel?»: el eco ya es suyo |
| C93 | `rooms/pecera.escenas.js` | Anselmo | Si quieres que se quede apagada, tráeme un motivo. Con número. | Si quieres que se quede apagada, tráeme un motivo. ¿Tiene número? | APROBADA | siembra el «¿Tiene número?» del paso del enchufe |
| C94 | `rooms/pecera.dialogos.js` | Anselmo | Revocado. Con fecha de hoy. Y de julio. | Revocado. Fecha: hoy. Efectos: julio. | APROBADA |  |
| C95 | `rooms/pecera.dialogos.js` | Anselmo | ¿Rubén? «Baja becario Rubén». En POR HACER. Con letra de julio. | ¿Rubén? «Baja becario Rubén». En POR HACER. Letra de julio. | APROBADA | sin «desde julio» (tope 6/6) |
| C96 | `rooms/pecera.dialogos.js` | Leoncio | Me los pone desde su pantalla. Sin preguntar. | Me los pone desde su pantalla. | APROBADA |  |
| C97 | `rooms/pecera.dialogos.js` | Bruno (opción) | ¿Y si le hacemos un funeral? Con flores. Y diapositivas. | (sin objeto) | TUMBADA | el menú AN_ALBUM desaparece (§2.5): ya no hay opción del funeral |
| C98 | `rooms/sala_amazonas.js` | Gervasio | Yo aquí solo estoy en copia. Con toda la empresa. | Yo aquí solo estoy en... en copia. | APROBADA |  |
| C99 | `actors.js` | Yoli (murmullo) | Ahí al lado imprimen lo que yo publiqué ayer. Con las faltas corregidas. | Ahí al lado imprimen lo que yo publiqué ayer. | APROBADA |  |
| C100 | `actors.js` | Aurora (murmullo) | Por esa puerta entra la web. No se limpia los pies. Ni las tildes. | Por esa puerta entra la web. No se limpia los pies. | APROBADA |  |
| C101 | `lib/ascensor.js` | ascensor | Le recordamos que lo que se dice en el ascensor no sale. Ni el wifi. | **ELIMINAR** | APROBADA | no gasta el «ni el wifi» de Celestino (carcajada 1 de la crítica) |
| C102 | `pistas.js` | abuela | Pega tu cara donde salen los jefes. Con algo que pegue. | Pega tu cara donde salen los jefes. ¿Tienes algo que pegue? | APROBADA |  |
| C103 | `pistas.js` | pista explícita | Chicle, tarjeta, organigrama. Y luego el torno. | Chicle en la tarjeta, tarjeta en el organigrama, y al torno. | APROBADA |  |
| C104 | `pistas.js` | pista explícita | «Buenas noches, Gertrudis». Y lo que pida. | Vending: «Buenas noches, Gertrudis», y darle lo que pida. | APROBADA |  |
| C105 | `pistas.js` | abuela | Presenta una cuenta mal hecha. Con lo que lleves. | Presenta una cuenta mal hecha. Lo que lleves en el bolsillo te vale. | APROBADA |  |
| C106 | `pistas.js` | pista explícita | Nota de gasto a Begoña. Con el azúcar. | Nota de gasto a Begoña, con el azúcar de justificante. | APROBADA |  |
| C107 | `pistas.js` | abuela | Escúchale entero. Sin mirar el reloj. | Escúchale entero, hijo, aunque se te enfríe la cena. | APROBADA |  |
| C108 | `pistas.js` | abuela | Las máquinas viejas, sin papel, no hablan. Dales papel. Y tú cena. | Las máquinas viejas, sin papel, no hablan. Dales papel. ¿Has cenado? | APROBADA |  |
| C109 | `pistas.js` | abuela | Contéstale mejor que él. Y luego, su máquina. | Contéstale mejor que él, y al final, lo de su máquina. | APROBADA |  |
| C110 | `pistas.js` | abuela | Escribe en tu máquina, hijo. Sin palabras raras. | Escribe en tu máquina, hijo, que lo entienda tu abuela. | APROBADA |  |
| C111 | `pistas.js` | abuela | Hasta la maquinita de los dibujos sabe cuánto te sobra, hijo. Y es lista. | Hasta la maquinita de los dibujos sabe cuánto te sobra, hijo. | APROBADA |  |
| C112 | `pistas.js` | abuela | A los que hablan mucho se les contesta corto. Y con papeles. | A los que hablan mucho se les contesta corto. | APROBADA | el nivel 2 ya dice qué papeles |
| C113 | `pistas.js` | abuela (dónde está la réplica) | Al que manda en los Despachos, mírale el ordenador. Sin que te vea. | Al que manda en los Despachos, mírale el ordenador. | APROBADA |  |
| M01 | `items.js` | Aurora | Ya lo he leído, criatura. Está perfecto. Guárdalo. | Ya lo he leído. Está perfecto. Guárdalo. | APROBADA |  |
| M02 | `rooms/catacumba.js` | Aurora | ¿Evaristo? ¿El de las comas? Siéntate, criatura. Bueno, no hay silla. | ¿Evaristo? ¿El de las comas? Siéntate. Bueno, no hay silla. | APROBADA |  |
| M03 | `rooms/catacumba.js` | Aurora | Cuando alguien diga que una coma es un detalle sin importancia, criatura. | Cuando alguien diga que una coma es un detalle sin importancia. | APROBADA |  |
| M04 | `rooms/catacumba.js` | Aurora | Llevas un anuncio en la espalda, criatura. En esta planta, no. | Llevas un anuncio en la espalda. En esta planta, no. | APROBADA |  |
| M05 | `rooms/catacumba.js` | Aurora | Ya está citada, criatura. Dos veces sería abusar de su confianza. | Ya está citada. Dos veces sería abusar de su confianza. | APROBADA |  |
| M06 | `rooms/catacumba.js` | Aurora | Otros seis folios, criatura. Con esto ya se encuaderna. | Otros seis folios. Con esto ya se encuaderna. | APROBADA |  |
| M07 | `rooms/catacumba.js` | Teodoro (fax) | ¿Qué quieres, chaval? | ¿Qué quieres? | APROBADA |  |
| M08 | `rooms/catacumba.js` | Teodoro (fax) | Chaval. La Reunión de Dirección apaga la rotativa a las nueve. | La Reunión de Dirección apaga la rotativa a las nueve. | APROBADA |  |
| M09 | `lib/celestino.js` | Celestino | ¡El chaval viste al Lector Medio! ¡Cambio de camiseta en pleno partido! | ¡Cambio de camiseta en pleno partido! ¡El Lector Medio sale con chaqueta! | APROBADA |  |
| M10 | `lib/celestino.js` | Celestino | ¡Tarjeta en Administración! ¡Por triplicado! ¡Y el chaval sigue jugando! | ¡Tarjeta en Administración! ¡Por triplicado! ¡El nuevo sigue en el campo! | APROBADA |  |
| M11 | `lib/celestino.js` | Celestino | ¡Y el chaval de Sistemas pide el cambio! ¡Sale a ver el sol! | ¡Y el de Sistemas pide el cambio! ¡Sale a ver el sol! | APROBADA |  |
| M12 | `rooms/vestibulo.js` | Celestino (Ibex) | ¡Banco Robledal se duerme en el área! ¡Así no, chaval! | ¡Banco Robledal se duerme en el área! ¡Así no, hombre, así no! | APROBADA |  |
| M13 | `rooms/vestibulo.js` | Celestino | ¡Vuelve el chaval al vestíbulo! ¡Sin balón, pero con ganas! | ¡Vuelve al vestíbulo! ¡Sin balón, pero con ganas! | APROBADA |  |
| M14 | `rooms/vestibulo.js` | Celestino | ¡Otra vez aquí! ¡Este chaval pisa más área que el portero! | ¡Otra vez aquí! ¡Pisa más área que el portero! | APROBADA |  |
| M15 | `rooms/sala_amazonas.js` | Rogelio (Mercados 2) | Se te ha congelado, chaval. | Se te ha congelado. | APROBADA |  |
| M16 | `rooms/cpd.js` | Paco | Llevas RECHAZADO en la frente. Es de Administración. Sin ticket no lo quito. | **ELIMINAR** | APROBADA | quitar el `if` entero (y su `dicho = true`): el árbol sigue igual |
| M17 | `rooms/ecosistema.dialogos.js` | Maripaz | Llevas RECHAZADO en la frente. | **ELIMINAR** | APROBADA | quitar la llamada `frente(api, MARIPAZ)` y la función; la gemela de eventos.dialogos.js (Pilar) es de sala protegida: ver §3.3 |
| M18 | `rooms/vestibulo.js` | Celestino | ¡Y el chaval aparece con tarjeta en la frente! ¡Roja! ¡Directa! | **ELIMINAR** | APROBADA | quitar el `if` (marca once `vestibulo_celestino_frente` queda sin uso: no se borra, no estorba) |
| M19 | `items.js` | Bruno (Mirar manual) | Las demás páginas son fotos del fax. Posando. | (se queda la línea actual) | TUMBADA | «Posando» se queda en Mirar el manual y sale de Paco (§2.3): F6 resuelto al revés |
| M20 | `rooms/pecera.dialogos.js` | Anselmo | El modelo es de fuera. El prompt es de dentro. / Eso lo hace nuestro. | ¿Tú de qué departamento vienes? | APROBADA | solo la rama `else` (sin herminia_midio) del árbol; la rama con herminia_midio («Ya te lo he dicho…») ya es el eco |
| M21 | `rooms/pecera.secretaria.js` | Custodia (murmullo) | Las paredes no oyen. Oigo yo. | ¿Quién anda ahí. | APROBADA | pregunta que acaba en punto (biblia §2.4) |
| M22 | `actors.js` | Lector Medio (murmullo global) | A mí lo que me interesa es la economía. Y ahorrar. | (sin murmullo: `murmurs: []`) | MEJORADA | un globo «(asiente)» es una acotación; el cartón asiente en silencio (gesto, §5.4) |
| M23 | `rooms/pajarera.js` | Lector Medio (murmullo, Despachos) | murmurs: [GRABACION] | `murmurs: []` | MEJORADA | ídem |
| M24 | `rooms/sala_amazonas.js` | Lector Medio (murmullo y Hablar, Sala, Acto III) | A mí lo que me interesa es la economía. Y ahorrar. | murmullo fuera; Hablar: gesto `asentir(api)` sin texto | MEJORADA | Gervasio sigue: «Lo que diga el Lector Medio.» / (cabecea) / «...Pues ya está decidido.» |
| M25 | `rooms/pajarera.js` | Lector Medio (opción de Gervasio en Despachos) | await api.sayAs(LM, GRABACION);                 await gv(api | `await asentir(api, LM);` (sin texto) | MEJORADA | ídem, en la opción de Gervasio de los Despachos |
| M26 | `rooms/office.js` | Gervasio (Vending) | Diecinueve años. Ni un marrón. Ni uno. | ELIMINAR | TUMBADA | chocaba con el gag de Gervasio ante Gertrudis («Buenas noches. Se dan, digo…»); en el Vending queda solo M27 |
| M27 | `rooms/office.js` | Gervasio (Vending) | Hoy me han preguntado tres veces por mi salud. Debo de estar fatal. | Sin el acta se está... Se está muy ligero. | APROBADA |  |
| M28 | `rooms/pajarera.js` | Gervasio (Despachos) | Diecinueve años. Ni un marrón. Ni uno. | Ese correo se contesta... Se contestará. | APROBADA | en Despachos se queda «Hoy me han preguntado tres veces por mi salud…», que siembra su respuesta en el duelo |
| M29 | `rooms/sala_amazonas.js` | Gervasio (Sala) | Hoy me han preguntado tres veces por mi salud. Debo de estar fatal. | **ELIMINAR** | APROBADA | en la Sala se quedan «Eso, en todo caso, lo hablamos.» y «Diecinueve años. Ni un marrón. Ni uno.» |
| M30 | `rooms/sala_amazonas.js` | Íñigo (Sala, Acto III) | Esto en verde. Esto en rosa. Esto en azul, que es excusa. / Diapositiva 248: «El viaje continúa». / ¿Y esto el Lector Medio lo entiende? Perfecto: asiente. | Si nadie pregunta, esto se aprueba solo. Es mi parte favorita. / Rotativa, en rojo. Papel, en rojo. Becario, en rosa. | APROBADA | los tres de siempre se quedan en Despachos (siembran la 248 y el asentir) |
| M31 | `rooms/sala_amazonas.js` | Íñigo (Sala) | Yo solo tomo agua con gas y sinergias. | ¿Café? Ahora no. Voy por la 247. | APROBADA |  |
| M32 | `rooms/sala_amazonas.js` | Íñigo (Sala) | Perfecto. Con esto te doy de baja más rápido. | Ya te tengo en la matriz. Abajo a la izquierda. | APROBADA |  |
| M33 | `rooms/office.js` | Gervasio (Vending) | Eso lo coges tú, que tienes la agenda más limpia. | Eso se deja... Se deja ahí. Ya se verá de quién es. | APROBADA | la de la Sala se queda |
| M34 | `rooms/sala_amazonas.js` | Gervasio (Hablar tras D4) | else if (api.flag('duelo_inigo_ganado')) await sayG(api, 'Lo que diga el Lector Medio.'); | Lo que diga el Lector Medio. Que se está... Se está moviendo. | APROBADA | el quinto «Lo que diga el Lector Medio» se vuelve señal del empujón (§6) |
| K01 | `rooms/pecera.js` | coro | Ha llovido y ha bajado el tráfico. / ¡Abrid una incidencia a la lluvia! / La lluvia no es nuestra. | **ELIMINAR** | APROBADA | la discusión entera (con su «No.» de DEV 3) |
| K02 | `rooms/pecera.js` | coro | Internet está mal hecho. / Desde el principio. | **ELIMINAR** | APROBADA | la discusión entera (con su «...Sí.» de DEV 3: el «sí» de DEV 3 se guarda para el Acto III) |
| K03 | `rooms/pecera.js` | coro, Acto II | (nueva) | [D1] El CMS se colgaba por una pantalla. ¿Quién la enchufó? / [D2] Tú. / [D1] Yo no. Él. / [D3] No. | APROBADA |  |
| K04 | `rooms/pecera.js` | coro, Acto III | (nueva) | [D2] ¿Lo del Titulator ha sido Diseño? / [D3] No. / [D3] Hemos sido nosotros. / [D1] No lo repitas. | APROBADA | entre el primer «No.» y la frase, `['wait', 1500]` |
| X01 | `actors.js` | mercados_1 | Mercados 1 | Fermín Plazofijo | APROBADA |  |
| X02 | `actors.js` | mercados_2 | Mercados 2 | Rogelio Diferido | APROBADA |  |
| X03 | `actors.js` | mercados_3 | Mercados 3 | Jacinto Dividendo | APROBADA |  |
| X04 | `rooms/sala_amazonas.js` | Bruno | Uno de Mercados, con barba de comité. Cuando empezó la reunión, era lampiño. | Fermín Plazofijo, de Mercados. Cuando empezó la reunión, era lampiño. | APROBADA |  |
| X05 | `rooms/sala_amazonas.js` | Bruno | Otro de Mercados. Mira la pantalla como a un valor refugio. | Rogelio Diferido, de Mercados. Sigue una videollamada que ya ha acabado. | APROBADA |  |
| X06 | `rooms/sala_amazonas.js` | Bruno | El tercero de Mercados. Gafas de cerca para mirar el punto tres de lejos. | Jacinto Dividendo, de Mercados. Gafas de cerca y dos dietas por reunión. | APROBADA |  |
| X07 | `rooms/sala_amazonas.js` | Fermín | Chsss. Estamos en el punto tres. | Chsss. Punto tres. Mientras no se mueva nada, yo estoy bien. | APROBADA |  |
| X08 | `rooms/sala_amazonas.js` | Jacinto | Yo propongo una reunión para ver el punto tres. Entramos cinco minutitos. | Propongo otra reunión para ver el punto tres. Yo cobro dieta por cada una. | APROBADA |  |
| X09 | `rooms/office.js` | Bruno | Uno de Mercados, en la cola del microondas. Detrás de un táper. | Fermín Plazofijo, de Mercados, en la cola del microondas. No se mueve. | APROBADA |  |

### 4.2 Sustituciones y eliminaciones del diseño y de la contra (literal actual → nuevo)

| # | Fichero | Actual (literal) | Nuevo |
|---|---|---|---|
| D01 | `rooms/catacumba.js` | Y una reunión solo se acaba cuando alguien pregunta por los siguientes pasos. | Y una reunión solo se acaba cuando alguien pregunta por el punto que nadie toca. |
| D02 | `rooms/sala_amazonas.js` | Para tocar el punto 3 hay que decirlo en voz alta. Y a quien preside. | Para tocar el punto 3 hay que decirlo en voz alta, a quien preside. |
| D03 | `rooms/sala_amazonas.js` | Leo el punto 3 en voz baja. Uno de Mercados se estremece. | Leo el punto 3 en voz baja. Fermín se estremece. |
| D04 | `rooms/sala_amazonas.js` | Los... siguientes... | Pregunta de un conectado. Consta. Los... siguientes... |
| D05 | `rooms/sala_amazonas.js` | Pues el que ha preguntado, que tiene la agenda... | (GERTRUDIS, por la tele) CONVOCADA. TODA LA EMPRESA EN COPIA. EMPIEZA EN CINCO MINUTITOS. |
| D06 | `rooms/pecera.escenas.js` | ¿Y si va sin pantalla? Peor. Si funciona, la gente se acostumbra. | ¿La quieres apagada? Ese cable baja a Sistemas. Que te la apague Paco. |
| D07 | `rooms/pecera.escenas.js` | Y mira la brida. Ese cable no acaba aquí. | **ELIMINAR** |
| D08 | `rooms/cpd.js` | Regleta R-3. Brida: «PANTALLA DE MÉTRICAS. NO TOCAR». / Debajo, a boli: «ni aunque lo diga el ticket 3». Letra de Paco. | Cinco regletas: NÓMINAS, ASCENSOR, un pósit, GERTRUDIS y NO TOCAR NUNCA. / El pósit, con letra de Paco: «ni aunque lo diga el ticket 3». |
| D09 | `rooms/cpd.js` | Regleta R-3. Piloto apagado. / Arriba, la Redacción trabaja a ciegas. Y publica. | El regletero. La del pósit, apagada. / Arriba, la Redacción trabaja a ciegas. (C42) |
| D10 | `rooms/cpd.js` | No sé qué apaga esto. Pero tiene brida. Lo importante lleva brida. | **ELIMINAR** (ahora se elige en el menú) |
| D11 | `rooms/cpd.js` | ¡ESTAMOS CIEGOS! ¿HAY ALGUIEN LEYENDO? ¿HAY ALGUIEN AHÍ FUERA? (megafonía de Yoli en `tirarRegleta`) | **ELIMINAR** (ya se oyó en el apagón) |
| D12 | `rooms/cpd.js` | Ya me han abierto otro ticket para saber por qué. | **ELIMINAR** |
| D13 | `rooms/cpd.js` | Fax de Teodoro. Ticket 0.441, de 1999. Estado: lo respetamos. / Lo único de esta casa que contesta a todos sin cabrearse... / ...es la respuesta automática. Es mi mejor empleada. / Toma el manual. Página 9. Lo demás son fotos del fax. Posando. | 0.441. De 1999. Estado: lo respetamos. / Toma el manual. Página 9: la respuesta automática. Mi mejor empleada. (opción nueva `fax441`; §2.3) |
| D14 | `rooms/cpd.js` | No tiro de algo que imprime solo. Igual es la nómina. | Tiro un poco. Desde dentro, alguien tira más fuerte. (1.ª) · Desde dentro no sueltan. El de ahí no está distraído. (2.ª+) |
| D15 | `rooms/cpd.js` | La puerta no cede. El papel que sale por debajo, a lo mejor sí. | La puerta no cede. El papel de abajo es otra cosa. |
| D16 | `rooms/cpd.js` | Papel continuo con borde perforado. (solo en el Acto III sin Rubén) | Papel continuo, saliendo a chorro. Nadie lo sujeta desde dentro. |
| D17 | `rooms/pecera.dialogos.js` | ...Ni hecho ni muerto. Consultoría. / Despedir, no. Salida en valor. ...Eso sí lo sé hacer yo. | ¿Con qué has escrito eso? ...Rotulador de Comercial. De fuera. / Salida en valor. Ni hecho ni muerto, pero sale. / La frase la escribió Rubén. Rubén tenía alta. ...Entonces es de la casa. |
| D18 | `rooms/pecera.dialogos.js` | nodo `AN_ALBUM` entero (¿Y si lo damos por hecho? · funeral · salida en valor · descopear · Lo pienso y vuelvo.; «Hecho sería que alguien le hubiera dado de baja. Nadie lo ha hecho.», «No me tientes. Ya tengo la plantilla.», «Eso dijo Rubén en julio.») | **ELIMINAR** (la línea «Tráeme algo que no sea ni hecho ni muerto. Eso no existe.» pasa al tablero) |
| D19 | `rooms/pecera.dialogos.js` | Ya te lo he dicho. El prompt es de dentro. Lo escribí yo. En mayúsculas. | Ya te lo he dicho. Lo escribí yo. En mayúsculas. |
| D20 | `rooms/catacumba.js` | Un fax beige de 1992. Pantallita: «SIN PAPEL». Y sin ganas. | Un fax de 1992: «SIN PAPEL». Pegatina: «Mantenimiento: Sistemas. Ticket 0.441». (= C34 mejorada) |
| R1 | `lib/ascensor.js` | Capacidad: ocho personas o una reunión que pudo ser un correo. | **ELIMINAR** (reserva del guionista, aplicada) |
| R2 | `rooms/administracion.dialogos.js` | Cuarenta años en esta ventanilla. He visto un ticket en sánscrito. | **ELIMINAR** (aplicada; queda la línea del sobre de azúcar) |
| R3 | `rooms/pajarera.js` | El uniforme oficial de quien dice "disruptivo" sin mover la cara. | **ELIMINAR** (aplicada; el Mirar queda en una línea) |
| R4 | `rooms/pecera.escenas.js` | Vengo a reimaginar el perímetro. | **ELIMINAR** (peor 3 de la crítica; «No vengo a despedir a nadie.» queda sola, y es mejor) |

Rubén (`cpd.js` l. 83-85) **no cambia** (el diseño proponía cambiarlo; ver §12).

---

## §5 · CORO, MERCADOS, MEGAFONÍA Y LECTOR MEDIO

### 5.1 Coro de Desarrollo (guionista §4: aprobado entero)
Arco «a quién culpan»: I a los de fuera (árbol y ambiente de hoy, sin las discusiones de la lluvia ni de Internet: K01,
K02), II a Diseño por reflejo (regleta) y unos a otros (K03), III a sí mismos (K04). Implementación tal cual el §4.2 del
guionista en `pecera.js`, con `cercaDelCoro`. Al escribir Bruno la columna buena, las tres espaldas se giran (ya está en
`salida()`): sin línea. «Diseño» 6/11.

### 5.2 Mercados: un trío
| Id | Nombre | Rasgo | Mirar (Sala) | Hablar (Sala) | Murmullo (Sala) | Atasco |
|---|---|---|---|---|---|---|
| `mercados_1` | **Fermín Plazofijo** | miedo a que algo se mueva (renta fija) | Fermín Plazofijo, de Mercados. Cuando empezó la reunión, era lampiño. | Chsss. Punto tres. Mientras no se mueva nada, yo estoy bien. | Que alguien pida sala para salir de la sala. | ¡Usted primero! |
| `mercados_2` | **Rogelio Diferido** | siempre con retraso | Rogelio Diferido, de Mercados. Sigue una videollamada que ya ha acabado. | ¿Sigue siendo marzo? | ¿Me veis la pantalla? ...¿Hola? ¿Me veis? | ¡No, usted, que es de Bolsa! |
| `mercados_3` | **Jacinto Dividendo** | quiere cobrar dos veces | Jacinto Dividendo, de Mercados. Gafas de cerca y dos dietas por reunión. | Propongo otra reunión para ver el punto tres. Yo cobro dieta por cada una. | Entramos cinco minutitos. En marzo. | ¡Yo soy de Bolsa y de Mercados! ¡Tengo doble prioridad! |
Por qué estos: «Plazofijo» es el rasgo (que nada se mueva) y no solo el sector; «Rogelio» suena a la quinta de
Gervasio, Celestino y Evaristo, y «Toni» desentona; «Dividendo» es cobrar, que es su rasgo, y «Prima» se confunde con un
pariente. En el Vending sigue Fermín (`mercados_1`, X09: «Fermín Plazofijo, de Mercados, en la cola del microondas. No se
mueve.») con su táper. Nadie se queda atrapado en el ascensor ni detrás de los armarios (fuera del diseño: §12).
Cambios: X01-X10 (§4.1), M15 («Se te ha congelado.», Rogelio).

### 5.3 Megafonía de Celestino tras el clímax (guionista §6.1, aprobada)
```js
const MEGAFONIA_TAMBALEO = [
  '¡Balón suelto en la Sala Amazonas! ¡El cartón se tambalea y nadie lo toca!',      // 10 s quieto
  'Ahí sigue. De pie, asintiendo, sin nadie que le lleve la contraria.',             // 25 s
  '...Que alguien le dé un empujón, hombre. Que esto no se acaba solo.',             // 45 s
];
```
Ninguna dice «penalti» (la paga de la tele tras el empujón sigue intacta). Tiempo **quieto** = sin escena, diálogo, menú,
móvil ni globo (`api.quieto()`); el ratón no reinicia. Con Gervasio en ese rato, M34.

### 5.4 El Lector Medio asiente (mejora de M22-M25)
El cartón no tiene más que una frase y la guarda para el clímax. Antes del clímax **no habla y no lleva globo**:
murmullos fuera (`actors.js` global, Despachos, Sala) y, donde hoy dice la grabación por orden de Gervasio (Hablar en la
Sala del III y la opción «¿Quién decide lo del Plan Cero Papel?» de los Despachos), un gesto:
```js
async function asentir(api, id = 'lector_medio') {           // local de cada sala (no es motor)
  const j = api.flag('chaqueta_en_lector') ? 'j' : '';
  api.vestir(id, 'tamb2' + j); api.sfx('paper'); await api.wait(350); api.vestir(id, null);
}
```
Gervasio: «Lo que diga el Lector Medio.» / (asentir) / «...Pues ya está decidido.». La frase entera se queda donde
siembra (chaqueta en los Despachos, Hablar en los Despachos) y paga (clímax).

---

## §6 · MOTOR (paquete P0; `engine/*` + `content/lib/ascensor.js` y `directorio.js`)

Diez cambios pequeños y aislados. Ninguno cambia el comportamiento por defecto: todo es opcional (opción nueva o API
nueva) salvo F8 (solo táctil) y el doble clic (§6.8).

| # | Fichero | API / cambio | Detalle |
|---|---|---|---|
| 6.1 | `script.js` | `api.walkTo(target, y, opts)` | `opts.run` → `game.walkActor(P(), x, y, { run: true })` (ya lo admite). Para F4 `junto()` |
| 6.2 | `efectos.js`, `ui.js`, `core.js` | `api.apagon({ …, spots: [[cx,cy,rx,ry] \| { actor, rx, ry, dy }], nombres: true, interceptar })` | (a) un foco `{ actor }` se resuelve cada fotograma en la posición del actor (`dy` por defecto −22: la mano con la linterna); (b) con `nombres`, la línea de acción enseña `def.nameDark` o «algo» (objeto) / «alguien» (actor); (c) `interceptar(api, verbo, id, item)`: `core.doVerb` la llama **antes** de cualquier verbo del jugador mientras dure el apagón; si devuelve `true`, el verbo no sigue (salidas, ascensor y directorio incluidos). `Fx.reset` (cambio de sala o carga) lo quita todo |
| 6.3 | `mover.js`, `script.js` | `api.sinCongelar(id, on = true)` | marca `a.noFreeze` (no se guarda; `false` al entrar en sala). `frozen()` devuelve `false` si `a.noFreeze`. Para que Anselmo cruce a oscuras aunque el jugador le apunte |
| 6.4 | `efectos.js` | `api.estampida(ids, { …, esperar: true })` | llegan a la puerta y se encajan (temblor sin tope de 400 vueltas mientras dure), corre `enAtasco` y **resuelve** con `ctl = { alFrente(id), soltar: async () => {…plop de uno en uno…}, activo }`. Sin `esperar`, todo igual que hoy (la demo de `test-fase0` no cambia). Si se cambia de sala o se carga, `soltar` sin animación |
| 6.5 | `script.js` | `api.quieto()` | `Fx.quiet(game)` (ningún globo, menú, diálogo, móvil, detalle, cutscene ni apagón). Para los relojes de §2.1 y §2.6 |
| 6.6 | `core.js`, `screens.js` | `api.sinGuardar(on)` | `game.noSave = on`: «Guardar» sale en gris en el menú y la autoguarda (si la hay) se salta. Se pone a `false` al cambiar de sala y al cargar |
| 6.7 | `core.js` (`pickAt`, `slopHits`) | F8, solo con `touchUI()` | mínimo de la caja crecida 20 × 16; si el toque cae en la caja crecida de un objeto pequeño y el objeto exacto es «grande» (> 4 veces el área del pequeño crecido), gana el pequeño (centro más cercano). Con ratón, nada cambia |
| 6.8 | `mover.js`, `core.js` | doble clic | (a) `isDouble` compara en coordenadas de **mundo** (`x + camX`); (b) doble clic en la franja de ≤ 28 px del borde, en sala con scroll y hacia ese lado: destino = la siguiente **parada** (`walkTo` de los objetos con `parada: true` en el layout) o el final del suelo; (c) doble clic sobre un objeto que no es salida: corre hasta su `walkTo` y hace el verbo; (d) con `player.running`, la cámara se adelanta 60 px en la dirección de la marcha |
| 6.9 | `audio.js` | `sfx('crujido')` | ruido corto filtrado (paso bajo, 120 ms), volumen como `paper` |
| 6.10 | `content/lib/ascensor.js`, `directorio.js` | submenú de atajos | §2.7. `directorio.js` exporta `nombreDe(room)`. En `ascensor.js`, además: C101 y R1 (§4) |

---

## §7 · RECORRIDO

### 7.1 Por qué 50 y no 51
El diseño traía 51 pasos. Sale «Mirar enchufe (brida R-3)» (su paso 21): el apagón ya termina con «Ese cable baja a
Sistemas. Que te la apague Paco.» y el regletero se resuelve por eliminación, así que mirar la brida es una pista más,
no un paso. Pasos de E4 renumerados: **23 → 24** (Yoli: ráfaga S1 y borrasca S2 al entrar), **34 → 38** (ordenador:
`pecera_herminia_mide` con la frase de Anselmo y `pecera_opa_ab`), **40 → 45** (entrada con `pecera_opa_ganadora`
antes de dar el álbum). E4 no cambia acciones ni flags esperados.

Coherencia con flags (comprobado paso a paso contra el código de hoy):
- 19 antes que 22 (la opción `fax441` pide `vio_pegatina_fax`); 22 pide `cms_vivo` (nodo `P1`), que pone 21.
- 20 en la Redacción: el `onEnter` no lanza escena (la viral ya saltó al cruzar en el 16; `cms_vivo` aún no está).
- 21 desde la Redacción: ascensor a −1, sin submenú. 24 vuelve por ascensor a la planta 1: el submenú (I1 en
  `walk-lib`) elige «Redacción»; al entrar, `pecera_cms_entrada` con la ráfaga de E4.
- 27 y 28 cierran con `return 'exit'`: no se gastan «Me voy.» de Gervasio ni el «E-00» de Gertrudis.
- 28: al entrar en el Vending con `cms_vivo` y `cafetera_viral` salta E-53 (hoy no estaba en el camino: se cuenta).
- 29 en modo rápido: el atasco se resuelve por la vía `anuncio` dentro de la escena (sin devolver el control).
- 41: entrada del III en la Redacción (`pecera_dos_ias`), luego Sistemas: línea «sale a chorro» y estado `corre`.
- 45: al entrar, `pecera_opa_ganadora` (E4 S5: `acto_3_iniciado`, `pieza_escrita`, sin `discover_ganador`); después
  el álbum. 46 empieza con `['ir', 'pecera']` (no-op aquí; necesario en el alternativo).

### 7.2 `tools/walk-data.mjs` (completo; formato de hoy)
```js
export const STEPS = [
  { n: 1, sala: '—', txt: '(Intro automática, 7.1)', acc: [], esp: {flags: ['intro_vista'], sala: 'vestibulo'} },
  { n: 2, sala: 'vestibulo', txt: 'Hablar celestino → nervios', acc: [['verbo', 'hablar', 'celestino'], ['opcion', '¿Tiene algo para los nervios?'], ['cerrar']], esp: {tiene: ['chicle'], flags: ['celestino_dio_chicle']} },
  { n: 3, sala: 'vestibulo', txt: 'Hablar celestino → café', acc: [['verbo', 'hablar', 'celestino'], ['opcion', '¿Dónde hay café en esta casa?'], ['cerrar']], esp: {flags: ['celestino_pista_gertrudis']} },
  { n: 4, sala: 'vestibulo', txt: 'Hablar celestino → cotilleo', acc: [['verbo', 'hablar', 'celestino'], ['opcion', '¿Algún cotilleo?'], ['cerrar']], esp: {flags: ['rep_05']} },
  { n: 5, sala: 'vestibulo', txt: 'Usar chicle con tarjeta_becario', acc: [['usar', 'chicle', 'tarjeta_becario']], esp: {flags: ['tarjeta_con_chicle'], notiene: ['chicle']} },
  { n: 6, sala: 'vestibulo', txt: 'Usar tarjeta_becario con organigrama', acc: [['usar', 'tarjeta_becario', 'organigrama']], esp: {flags: ['foto_en_organigrama']} },
  { n: 7, sala: 'vestibulo', txt: 'Usar tarjeta_becario con torno', acc: [['usar', 'tarjeta_becario', 'torno']], esp: {flags: ['torno_abierto']} },
  { n: 8, sala: 'pecera', txt: '(entrar) → escena 7.2', acc: [['ir', 'pecera']], esp: {flags: ['inigo_presentado']} },
  { n: 9, sala: 'pecera', txt: 'Coger chaqueta_ramirez_hotspot', acc: [['verbo', 'coger', 'chaqueta_ramirez_hotspot']], esp: {tiene: ['chaqueta_ramirez', 'sobre_azucar'], flags: ['chaqueta_cogida']} },
  { n: 10, sala: 'pajarera', txt: 'Usar chaqueta_ramirez con lector_medio', acc: [['ir', 'pajarera'], ['usar', 'chaqueta_ramirez', 'lector_medio']], esp: {flags: ['chaqueta_en_lector', 'silla_libre'], notiene: ['chaqueta_ramirez']} },
  { n: 11, sala: 'pajarera', txt: 'Mirar ordenador_gervasio', acc: [['verbo', 'mirar', 'ordenador_gervasio']], esp: {flags: ['rep_07']} },
  { n: 12, sala: 'pajarera', txt: 'Mirar pantalla_titulator ×3', acc: [['verbo', 'mirar', 'pantalla_titulator'], ['verbo', 'mirar', 'pantalla_titulator'], ['verbo', 'mirar', 'pantalla_titulator']], esp: {flags: ['vio_armario_27']} },
  { n: 13, sala: 'pecera', txt: 'Mirar ordenador_bruno', acc: [['ir', 'pecera'], ['verbo', 'mirar', 'ordenador_bruno']], esp: {flags: ['rep_11']} },
  { n: 14, sala: 'office', txt: 'Gertrudis: saludo + bis (cafetera viral)', acc: [['ir', 'office'], ['verbo', 'hablar', 'gertrudis'], ['opcion', 'Buenas noches, Gertrudis.'], ['opcion', 'Buenas noches otra vez.'], ['cerrar']], esp: {tiene: ['cafe'], flags: {gertrudis_saludada: true, cafetera_viral: true, 'rep_03':true, 'rep_04':true, 'rep_10':true, 'rep_14':true, chisme_indice: 4}} },
  { n: 15, sala: 'office', txt: 'Mirar tablon', acc: [['verbo', 'mirar', 'tablon']], esp: {flags: ['rep_01']} },
  { n: 16, sala: 'catacumba', txt: 'Dar cafe a aurora_galerada', acc: [['ir', 'catacumba'], ['dar', 'cafe', 'aurora_galerada'], ['cerrar']], esp: {tiene: ['ficha_pagina_7'], flags: ['aurora_conto_pasos', 'aurora_hablo_fax', 'acto_2_iniciado'], notiene: ['cafe']} },
  { n: 17, sala: 'catacumba', txt: 'Hablar aurora → Teodoro', acc: [['verbo', 'hablar', 'aurora_galerada'], ['opcion', '¿Por qué no se hablan usted y Teodoro?'], ['cerrar']], esp: {flags: ['rep_02']} },
  { n: 18, sala: 'catacumba', txt: 'Mirar fax_enmarcado', acc: [['verbo', 'mirar', 'fax_enmarcado']], esp: {flags: ['rep_06']} },
  { n: 19, sala: 'catacumba', txt: '[E5] Mirar fax → pegatina «Ticket 0.441»', acc: [['verbo', 'mirar', 'fax']], esp: {flags: ['vio_pegatina_fax']} },
  { n: 20, sala: 'pecera', txt: '[E5] Tirar enchufe_pantalla → apagón 1 (ventana a oscuras: 0 ms en modo rápido)', acc: [['ir', 'pecera'], ['verbo', 'tirar', 'enchufe_pantalla']], esp: {flags: {apagon_n: 1, cms_vivo: false}} },
  { n: 21, sala: 'cpd', txt: '[E5] Regletero → R-3 (la del pósit)', acc: [['ir', 'cpd'], ['verbo', 'tirar', 'regleta_r3'], ['opcion', 'R-3']], esp: {flags: ['cms_vivo']} },
  { n: 22, sala: 'cpd', txt: '[E5] Paco → «Ticket 0.441. El fax de Teodoro.»', acc: [['verbo', 'hablar', 'paco_ticket'], ['opcion', 'Ticket 0.441'], ['cerrar']], esp: {tiene: ['manual_fax'], flags: ['paco_dio_manual']} },
  { n: 23, sala: 'cpd', txt: 'Hablar paco → consultor (antes 22)', acc: [['verbo', 'hablar', 'paco_ticket'], ['opcion', '¿Algún cotilleo del consultor?'], ['cerrar']], esp: {flags: ['rep_12']} },
  { n: 24, sala: 'pecera', txt: 'Hablar yoli → hilo (antes 23)', acc: [['ir', 'pecera'], ['verbo', 'hablar', 'yoli_tendencias'], ['opcion', '¿Algún hilo bueno esta noche?'], ['cerrar']], esp: {flags: ['rep_08']} },
  { n: 25, sala: 'pecera', txt: 'Hablar anselmo → Yoli (antes 24)', acc: [['verbo', 'hablar', 'anselmo_monolito'], ['opcion', '¿Qué tal con Yoli?'], ['cerrar']], esp: {flags: ['rep_09']} },
  { n: 26, sala: 'sala_amazonas', txt: '[E5] Mirar orden_del_dia → el punto 3', acc: [['ir', 'sala_amazonas'], ['verbo', 'mirar', 'orden_del_dia']], esp: {flags: ['sala_amazonas_orden_visto']} },
  { n: 27, sala: 'sala_amazonas', txt: '[E5] Gervasio → «Los becarios no tienen turno»', acc: [['verbo', 'hablar', 'gervasio_acta'], ['opcion', '¿y cuáles son los siguientes pasos?'], ['cerrar']], esp: {flags: {sala_becario_sin_turno: true, reunion_terminada: false}} },
  { n: 28, sala: 'office', txt: '[E5] Gertrudis → «¿Y cuáles son los siguientes pasos?»', acc: [['ir', 'office'], ['verbo', 'hablar', 'gertrudis'], ['opcion', '¿Y cuáles son los siguientes pasos?'], ['cerrar']], esp: {flags: ['gertrudis_pregunta']} },
  { n: 29, sala: 'sala_amazonas', txt: '[E5] Usar tele → Gertrudis pregunta en directo → estampida (atasco: vía del anuncio en modo rápido)', acc: [['ir', 'sala_amazonas'], ['verbo', 'usar', 'tele_amazonas']], esp: {flags: ['reunion_terminada', 'sala_amazonas_estampida']} },
  { n: 30, sala: 'sala_amazonas', txt: 'Maripaz → D1 (pop-up antes del menú) (antes 26)', acc: [['verbo', 'hablar', 'maripaz_remitido'], ['opcion', 'Siestatón no ha confirmado la página 7.'], ['duelo', ['R08', 'R04', 'R11', {objeto: 'ficha_pagina_7'}]], ['cerrar']], esp: {flags: ['duelo_maripaz_ganado', 'casilla_hueco', 'bruno_con_banner'], tiene: ['ficha_pagina_7']} },
  { n: 31, sala: 'administracion', txt: 'Begoña: nota de gasto (antes 27)', acc: [['ir', 'administracion'], ['verbo', 'hablar', 'begona_triplicado'], ['opcion', 'Quiero presentar una nota de gasto.'], ['opcion', 'Café para entender el capitalismo.'], ['opcion', 'Lo que sea.'], ['opcion', 'Aquí tiene. Un sobre de azúcar. Es casi un ticket.'], ['opcion', 'Pues enséñeme cómo es una nota bien hecha'], ['cerrar']], esp: {tiene: ['fotocopia_nota_direccion', 'copias_rechazadas'], flags: ['nota_gasto_presentada'], notiene: ['sobre_azucar']} },
  { n: 32, sala: 'administracion', txt: 'Evaristo: escuchar hasta el final (antes 28)', acc: [['verbo', 'hablar', 'evaristo_salvedad'], ['opcion', '¿Para qué me ha llamado?'], ['opcion', '¿De qué trata?'], ['opcion', 'Siga.'], ['cerrar']], esp: {flags: ['evaristo_escuchado', 'rep_16']} },
  { n: 33, sala: 'catacumba', txt: 'Usar copias_rechazadas con fax (antes 29)', acc: [['ir', 'catacumba'], ['usar', 'copias_rechazadas', 'fax']], esp: {flags: ['fax_con_papel'], tiene: ['mensaje_fp'], notiene: ['copias_rechazadas']} },
  { n: 34, sala: 'catacumba', txt: 'Mirar mensaje_fp (antes 30)', acc: [['verbo', 'mirar', 'mensaje_fp']], esp: {flags: ['vio_borde_perforado']} },
  { n: 35, sala: 'catacumba', txt: 'Dar fotocopia a aurora → FUENTE (antes 31)', acc: [['dar', 'fotocopia_nota_direccion', 'aurora_galerada'], ['cerrar']], esp: {flags: ['casilla_fuente'], notiene: ['mensaje_fp'], tiene: ['fotocopia_nota_direccion']} },
  { n: 36, sala: 'catacumba', txt: 'Aurora: la coma de Evaristo → correo por fax (y quita el adhesivo) (antes 32)', acc: [['verbo', 'hablar', 'aurora_galerada'], ['opcion', 'Don Evaristo pregunta si su coma está bien.'], ['cerrar']], esp: {flags: {coma_bendecida: true, correo_evaristo_listo: true, bruno_con_banner: false}, tiene: ['correo_evaristo']} },
  { n: 37, sala: 'catacumba', txt: 'Teodoro → D2 (antes 33)', acc: [['verbo', 'hablar', 'teodoro_cuerpodoce'], ['opcion', 'Quiero firmar en tu página 7.'], ['duelo', ['R06', 'R02', {objeto: 'manual_fax'}]], ['cerrar']], esp: {flags: ['duelo_teodoro_ganado', 'casilla_firma']} },
  { n: 38, sala: 'pecera', txt: 'Usar ordenador_bruno (antes 34)', acc: [['ir', 'pecera'], ['verbo', 'usar', 'ordenador_bruno']], esp: {tiene: ['pieza_opa'], flags: ['pieza_escrita', 'herminia_midio']} },
  { n: 39, sala: 'catacumba', txt: 'Usar pieza_opa con fax → tecla 2 (antes 35)', acc: [['ir', 'catacumba'], ['usar', 'pieza_opa', 'fax'], ['opcion', '2: ADMINISTRACIÓN'], ['cerrar']], esp: {flags: ['pieza_recortada'], tiene: ['pieza_opa']} },
  { n: 40, sala: 'catacumba', txt: 'Dar ficha a teodoro → 7.3a (antes 36)', acc: [['dar', 'ficha_pagina_7', 'teodoro_cuerpodoce'], ['cerrar']], esp: {flags: ['pagina_cerrada', 'acto_3_iniciado'], notiene: ['ficha_pagina_7', 'pieza_opa']} },
  { n: 41, sala: 'cpd', txt: 'Redacción (momento 8) → tirar papel_continuo → 7.3 (antes 37)', acc: [['ir', 'pecera'], ['ir', 'cpd'], ['verbo', 'tirar', 'papel_continuo']], esp: {flags: ['dos_ias_vista', 'anselmo_dijo_regla', 'ruben_encontrado']} },
  { n: 42, sala: 'cpd', txt: 'Hablar ruben → discursos (antes 38)', acc: [['verbo', 'hablar', 'ruben'], ['opcion', '¿Escribiste tú los discursos de Íñigo?'], ['cerrar']], esp: {flags: ['rep_13']} },
  { n: 43, sala: 'ecosistema', txt: '[E5] Coger termometro_ventas → rotulador de objetivos', acc: [['ir', 'ecosistema'], ['verbo', 'coger', 'termometro_ventas']], esp: {tiene: ['rotulador_rojo']} },
  { n: 44, sala: 'eventos', txt: 'Pilar → álbum (antes 39)', acc: [['ir', 'eventos'], ['verbo', 'hablar', 'pilar_escaleta'], ['opcion', '¿Me prestas el álbum?'], ['cerrar']], esp: {tiene: ['album_eventos'], flags: ['oyo_descopear']} },
  { n: 45, sala: 'pecera', txt: '[E5] Álbum a Anselmo → «Las fotos me valen» (E4 S5 salta al entrar)', acc: [['ir', 'pecera'], ['dar', 'album_eventos', 'anselmo_monolito'], ['cerrar']], esp: {flags: ['album_validado', 'discover_ganador'], notiene: ['album_eventos']} },
  { n: 46, sala: 'pecera', txt: '[E5] Rotulador + kanban → SALIDA EN VALOR (Bruno mueve el pósit)', acc: [['ir', 'pecera'], ['usar', 'rotulador_rojo', 'kanban'], ['opcion', 'SALIDA EN VALOR']], esp: {tiene: ['ticket_n1', 'rotulador_rojo'], flags: {posit_descopeado: true, ruben_libre: true, columna_kanban: 'salida'}} },
  { n: 47, sala: 'pajarera', txt: 'Gervasio en la puerta → D3 (antes 41)', acc: [['ir', 'pajarera'], ['verbo', 'hablar', 'gervasio_acta'], ['opcion', 'Necesito el acta de la última reunión.'], ['duelo', ['R07', 'R01', {objeto: 'fotocopia_nota_direccion'}]], ['cerrar']], esp: {flags: ['duelo_gervasio_ganado', 'sala_abierta'], tiene: ['acta_reunion'], notiene: ['fotocopia_nota_direccion']} },
  { n: 48, sala: 'pajarera', txt: 'Usar puerta_sala → 7.4 (antes 42)', acc: [['ir', 'pajarera'], ['verbo', 'usar', 'puerta_sala']], esp: {sala: 'sala_amazonas'} },
  { n: 49, sala: 'sala_amazonas', txt: 'Duelo D4 (Íñigo), tres remates (antes 43)', acc: [['duelo', ['R10', 'R12', {objeto: 'ticket_n1'}, 'R13', 'R05', {objeto: 'acta_reunion'}, 'R16', {objeto: 'correo_evaristo'}]]], esp: {flags: ['duelo_inigo_ganado'], notiene: []} },
  { n: 50, sala: 'sala_amazonas', txt: 'Empujar lector_medio → final (antes 44)', acc: [['verbo', 'empujar', 'lector_medio']], esp: {flags: ['lector_derribado', 'juego_terminado']} },
];
```

Cabecera del fichero: «Datos del walkthrough de la ENMIENDA E5 §7 (50 pasos): E2 §10.1 + E4 (24, 38, 45) + E5
(19-22, 26-29, 43, 45-46).»

### 7.3 Ruta alternativa
```js
// E5: Begoña y Evaristo (31-32) antes de Yoli, Anselmo y la Sala (24-30); el fax y la FIRMA antes de la FUENTE (33, 37,
// 34-36); en el Acto III, el acta (47) antes del álbum, y el ROTULADOR DESPUÉS de validar el álbum (44, 45, 43, 46):
// prueba el peor caso (volver a la planta 2 con el atajo del ascensor).
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
export const ALT = [...range(1, 23), 31, 32, 24, 25, 26, 27, 28, 29, 30, 33, 37, 34, 35, 36, ...range(38, 42), 47, 44, 45, 43, 46, 48, 49, 50];
```
(50 entradas, sin repetidos. D2 en el 37 tiene R06 (18), R02 (17) y el manual (22); D3 en el 47 tiene la fotocopia; el
43 sale de la Redacción por el ascensor a la planta 2 con submenú —elige «Marketing y Comercial»— y el 46 vuelve.)

### 7.4 Extras, fuzz y play-mouse
- `extras.mjs`: el extra del apagón (X11 y los que tiren del enchufe sin ticket) espera la línea nueva de cierre; el
  del camino antiguo (registro + enchufe) no cambia. **Nuevos:** XE5-1 a XE5-4, las cuatro vías del atasco (`empujar`,
  `cruasan`, `hablar`, `anuncio` por espera); XE5-5, los cuatro fallos del regletero (R-1, R-2, R-4, R-5) y que no
  ponen `cms_vivo`; XE5-6, las tres columnas equivocadas y «Tráeme algo…» a la tercera sin `rep_13`; XE5-7, ascensor
  con atajo (Sistemas → «Redacción de papel» → sala `catacumba`, entrada `pecera`); XE5-8, Paco sin pegatina dos veces;
  XE5-9, tirar del papel en el II dos veces (sin `ruben_encontrado`); XE5-10, Usar tele con «sin turno» y sin pregunta
  («wifi y rencor») y Usar móvil con la tele; XE5-11, a oscuras: Hablar Yoli, Anselmo, Coger taza «NO», Ir a la salida
  de la Redacción (no sale).
- `fuzz.mjs`: la opción de Gervasio ya no termina la reunión (ahora pone `sala_becario_sin_turno`); el fuzz no debe
  esperar `reunion_terminada` tras ella. Añadir a su lista de verbos «Usar tele» y «Usar rotulador con kanban».
- `play-mouse.mjs` (ratón real): pasos 19-22, 26-29 (incluida una vía del atasco con clic: Empujar a Fermín), 43, 45 y
  46 (menú de columnas con clic).
- `walk-lib.mjs` (I1): submenú del ascensor (§2.7: tras elegir la planta, si hay opciones, elegir la 0).

---

## §8 · TOPES NUEVOS Y SU REGEX (`tools/plan-rules.mjs`, I1)

Comprobado hoy contra `content/` con `literales()` + `sinSoloPantalla()` + `esTexto()` del auditor (sin `art/`,
`flags.js` ni plantilla): **coletilla 174, 160 sin Eventos** (coincide con el guionista); «chaval» 22; «criatura» 13;
«RECHAZADO en la frente» 5 (4 sin Eventos).

```js
// ENMIENDA E5 §8 · la coletilla «frase + Y/Con/Sin/Ni + 1-3 palabras» (crítica 4 §4.5). Una cadena cuenta una vez.
// Las preguntas y las frases que no terminan («...») no cuentan. Hoy 160 sin Eventos → tras E5, 40.
export const COLETILLA_RE =
  /(?:[.!?…][»"”)]?\s+|^)(?:\.\.\.|…)?¡?(?:Y|Con|Sin|Ni)\s+[^\s.!?…¿]+(?:\s+[^\s.!?…¿]+){0,2}(?:\.|!+)[»"”)]?\s*$/u;

// en TOPES_E2_JUEGO:
{ re: COLETILLA_RE, max: 46, fuera: FUERA_EVENTOS, txt: 'coletilla «Y/Con/Sin/Ni + 1-3 palabras» (E5 §8)' },   // 160 → 40
{ re: /\bchaval\b/gi, max: 12, txt: '«chaval» en todo el juego (E5 §8)' },                                       // 22 → 11
{ re: /\bcriatura\b/gi, max: 6, txt: '«criatura» en todo el juego (E5 §8)' },                                   // 13 → 6
{ re: /RECHAZADO[»,]? en la frente/g, max: 2, fuera: FUERA_EVENTOS, txt: 'la frente sellada (E5 §8)' },          // 4 → 2
```
Ojo: `COLETILLA_RE` no lleva `g` (una cadena cuenta una vez); `topes` hace `match` con la regex tal cual: si el
auditor cuenta con `matchAll`, envolverla (`new RegExp(src, 'gu')` y contar 0/1 por cadena).

Y la función por personaje del guionista, `coletillaPorPersonaje(lines)` (≥ 20 líneas oídas, ≤ 10 %, sin
`lector_medio` ni Eventos), tal cual su §7, como aviso que cuenta como fallo con `--e2`. Tras E5, el más alto es
Begoña (≈ 8 %).

**Además (vigilar, sin tope):** `--recuento` informativo de «de la/esta casa» (la columna suma una a propósito) y de
Anselmo «mis sistemas» (≤ 5 oídas: el cierre del apagón ya existía, pero ahora está en el camino; si el recuento
automático pasa de 5, cambiar «Ese enchufe está en mis sistemas.» por «Ese enchufe es de Desarrollo.»).

---

## §9 · SALDO Y RELOJ

### 9.1 Camino principal (recorrido de 50 pasos, en modo rápido; unidad = cadena dicha, opciones elegidas incluidas)
Referencia: 553 + 8 de E4 = **561**. Tope **576** (+15).

| Paso | Qué | Neto |
|---|---|---:|
| 19 | Mirar fax (pegatina fundida en la misma línea) | +1 |
| 20 | Apagón: Yoli ×2 + cierre ×4 | +6 |
| — | Registro fuera del camino (5 líneas del ticket) | −5 |
| 21 | Regletero: fuera la megafonía de Yoli y «Ya me han abierto otro ticket…» (6 → 4) | −2 |
| 22 | Paco: 4 → 2 (la opción, 1 por 1) | −2 |
| 26 | Mirar orden del día | +2 |
| 27 | Gervasio «sin turno» (la opción de Bruno ya se decía) | +1 |
| 28 | Vending: E-53 al entrar + opción de Bruno + LCD | +3 |
| 29 | Tele: Rogelio + Gertrudis; dos sustituciones; anuncio (ya estaba) | +2 |
| 41 | Entrada a Sistemas en el III | +1 |
| 43 | Maripaz da el rotulador | +1 |
| 45 | «Las fotos me valen…» (+1); Bruno ya no dice «No es un despido…» en un menú (−1) | 0 |
| 46 | Arranque de la columna: 3 por 2 | +1 |
| 49-50 | Celestino a los 10 s (partida real; el recorrido no espera) | +1 |
| 37 | C88: tras «…Lo ha escrito bien.», silencio | −1 |
| 31 | R2: «Cuarenta años en esta ventanilla…» | −1 |
| 8 | R4: «Vengo a reimaginar el perímetro.» | −1 |
| | **Total** | **+7 → 568** |

Margen: 8. Si hiciera falta, por este orden: Rogelio «¡Se ve!» (−1), la 2.ª línea del orden del día (−1), la línea de
Maripaz al dar el rotulador (Bruno lo coge en silencio, −1).

### 9.2 Juego entero (cadenas que se dicen o se enseñan como texto hablado; menús de `api.choose`, nombres a oscuras y
pantallas de la tele no cuentan, como en E4 §6)
| Bloque | Neto |
|---|---:|
| Estampida: Gervasio, opción y LCD de Gertrudis, pista de la tele, móvil con tele, Rogelio, Gertrudis por la tele, 3 vías | +10 |
| Apagón: 4 verbos a oscuras; −1 «Y mira la brida» | +3 |
| Regletero: 4 fallos; −3 de `tirarRegleta` | +1 |
| Ticket 0.441: 2 negativas; Paco 4 → 2 | 0 |
| Armario: 2.º tirón, entrada del III | +2 |
| Columna: Anselmo, arranque 3 por 2, 3 equivocadas, Usar tablero, boli, Maripaz, Mirar rotulador; −8 del nodo `AN_ALBUM` | +1 |
| Señal: megafonía ×3 | +3 |
| **Diseño** | **+20** |
| Guionista §2 (C68, C88, C101 fuera; C56 +1) | −2 |
| Guionista §3 con la contra (M16-M18, M29 fuera; M19 tumbada; M20 −1; M26 fuera; M30 −1; Lector Medio sin globo −5) | −12 |
| Coro (K01-K04) | +1 |
| Reserva R1-R3 y R4 | −4 |
| **Texto** | **−17** |
| **Total del juego** | **+3** (tope +10) |

### 9.3 Reloj (jugador fluido; hoy 100-120 min)
| | min |
|---|---:|
| Texto nuevo en el camino (+7 × ≈ 2,8 s) | +0,3 |
| Ventana a oscuras (≤ 12 s) + regletero con algún fallo | +0,5 |
| Orden del día, Gervasio, ida y vuelta Sala-Vending (puertas vecinas), atasco (≤ 10 s) | +0,8 |
| Pegatina (misma visita que Aurora) | +0,1 |
| Rotulador (misma planta que Eventos) + menú de columnas | +0,6 |
| Pensar: estampida 1-1,5 · columna 1-1,5 · regletero 0,5 | +2,5 a +3,5 |
| Atajos del ascensor (≈ 6 cruces de la Redacción) y doble clic | −1,5 a −2 |
| Sin registro ni brida en el camino | −0,3 |
| **Neto** | **≈ +3 (de +2 a +4)** |
Peor caso realista (rotulador después del álbum, Paco antes de la pegatina): ≈ +4,5 min. Es un riesgo (§12.4.5); las
pistas de la abuela lo acotan.

---

## §10 · PAQUETES DE IMPLEMENTACIÓN (ficheros disjuntos)

Reglas: cada paquete edita **solo** sus ficheros; puede **crear** su prueba `tools/test-e5-<paquete>.mjs`; lo demás de
`tools/*`, `actors.js`, `items.js`, `flags.js`, `pistas.js`, `game.js`, `duelo.js` y `docs/` es del integrador. No se toca
nada de E4 (si E4 aún no está entregada en un fichero, se espera a que lo esté). Sin git.

**Orden:** `P0 ∥ I1` → `PA ∥ PB ∥ PC ∥ PD ∥ PE` → `I2`.

| Paquete | Ficheros | Qué |
|---|---|---|
| **P0 · Motor** | `engine/core.js`, `mover.js`, `script.js`, `efectos.js`, `ui.js`, `audio.js`, `screens.js`; `content/lib/ascensor.js`, `content/lib/directorio.js`; crea `tools/test-e5-motor.mjs` | §6.1-6.10 (C101 y R1 en `ascensor.js`). Su prueba: walkTo con `run`; foco que sigue a un actor; nombres a oscuras e interceptor; `sinCongelar`; `estampida({ esperar })` + `soltar` + cambio de sala; `quieto`; `sinGuardar` (menú en gris); táctil (taza «NO», monitor de Yoli, tableta, teléfono rojo, con dedo desplazado 6 px; con ratón, el de detrás); doble clic al borde → parada, con la cámara moviéndose, sobre un objeto; ascensor con submenú (ratón y dedo), Escape → rellano, Sala no sale en el III, sin submenú en −1 y 0 |
| **I1 · Altas (integrador)** | `content/flags.js`, `items.js`, `actors.js`, `pistas.js`, `game.js`, `lib/celestino.js`, `lib/movil.js`; `tools/walk-lib.mjs`, `tools/plan-rules.mjs` | Flags G: `sala_becario_sin_turno`, `gertrudis_pregunta`, `vio_pegatina_fax`, `album_validado`, `columna_kanban` (str, ''). Objeto `rotulador_rojo`. `actors.js`: X01-X03, C99, C100, M22 (sin murmullo), `tamb3`/`tamb3j` y `TAMBALEO`. `items.js`: C64-C68, M01 (M19 **no**). `game.js`: C69, C70. `pistas.js`: C71, C102-C113 y los objetivos de §2 (`reunion`, `turno`, `cms`, `armario`, `baja`, `columna`, `firma.extra`; metas `turno`, `columna`); `DONDE` no cambia. `celestino.js`: M09-M11. `movil.js`: N6 (aviso a Aurora al leer un RV en `catacumba`). `walk-lib`: submenú del ascensor. `plan-rules`: §8 |
| **PA · Sala y Vending** | `content/rooms/sala_amazonas.js`, `art/sala_amazonas.art.js`, `content/rooms/office.js`, `art/office.art.js`, `content/escenas/climax.js` (solo `onWin` y C84) | §2.1 entero (orden, Gervasio, tele, `sala_tele_gertrudis`, atasco, carga), §2.6 (`update`, crujido, megafonía, caras), §5.2 (Mercados en la Sala), §5.4 (asentir en la Sala), opción de Gertrudis. Texto: C46, C61-C63, C98, M15, M24, M29-M32, M34, X04-X08, X10, D02-D05; Vending C58-C60, M26 (fuera), M27, M33, X09; clímax C84 |
| **PB · Redacción** | `content/rooms/pecera.js`, `pecera.escenas.js`, `pecera.dialogos.js`, `pecera.secretaria.js`, `art/pecera.art.js` (no los de E4) | §2.2 apagón (n = 1 jugable, interceptor, `nameDark`, cierre, carga), §2.5 (álbum, tablero, columnas, `salida`, arte), F4 `junto()`, F9 Custodia, coro K01-K04, `parada: true` en el layout (§6.8). Texto: C11-C24, C92, C93, C94-C96, M20 + D19, M21, C25, C26, D06, D07, D17, D18, R4 |
| **PC · Sistemas y Vestíbulo** | `content/rooms/cpd.js`, `art/cpd.art.js`, `content/rooms/vestibulo.js` | §2.2 regletero (arte y menú), §2.3 Paco, §2.4 armario (estado `corre`, entrada del III). Texto: C40, C41, C43, C44, C72-C80, M16, D08-D16; Vestíbulo C01-C10, M12-M14, M18 |
| **PD · Papel y Despachos** | `content/rooms/catacumba.js`, `art/catacumba.art.js` (pegatina, 2 px), `content/rooms/pajarera.js` | D01, D20 (fax + `vio_pegatina_fax`), N6 (condición `rvLeido`), bolis (C86). Texto: C32-C39, C85-C88, M02-M08; Despachos C27-C31, C89-C91, M23, M25 (asentir), M28, R3 |
| **PE · Planta 2** | `content/rooms/ecosistema.js`, `ecosistema.dialogos.js`, `administracion.js`, `administracion.dialogos.js` | Rotulador (§2.5.1). Texto: C45, C47-C52, M17; C53-C57, C81-C83, R2 |
| **I2 · Integración** | `tools/walk-data.mjs`, `extras.mjs`, `fuzz.mjs`, `play-mouse.mjs`, `walkthrough.mjs`, `test-*.mjs` existentes, `test-all.mjs`, crea `tools/test-e5.mjs` (reúne los `test-e5-*`), `docs/guion2-impl/GUIA_AUTORES.md` (sección E5), `docs/CONTENT_SCHEMA.md` (APIs nuevas) | §7, §11; `text-audit --estatico --plan --e2 --recuento` en verde; capturas |

Dependencias: PA, PB y PC usan P0 (6.2-6.6, 6.9) e I1 (flags). PB usa `rotulador_rojo` (I1) y `columna_kanban`. PE usa
`rotulador_rojo`. Nadie más que PA toca la Sala; nadie más que PB, la Redacción.

---

## §11 · PRUEBAS

### 11.1 Se rompen a propósito y cómo quedan
| Prueba | Qué se rompe | Cómo queda |
|---|---|---|
| `walk-data`, `walkthrough`, `walkthrough --alt` | 44 pasos | 50 (§7.2-7.3) |
| `walk-lib` | el ascensor abre un submenú | elegir la opción 0 |
| `extras.mjs` | apagón (línea de cierre), XM4a sigue | §7.4 y XE5-1…11 |
| `fuzz.mjs` | Gervasio ya no termina la reunión | §7.4 |
| `play-mouse.mjs` | pasos 19-22, 26-29, 43, 45-46 | §7.4 |
| `test-fase0.mjs` | l. 151 (pistas C102, C103), l. 223 (K02) | como dice el guionista §9; la estampida de la demo **no** cambia (sin `esperar`) |
| `test-comedia-p1.mjs` | regleta (l. 198-251: Tirar ahora abre menú; Yoli por la rejilla ya no; «Ya me han abierto…» ya no; opción del fax nueva), papel en el II, C44, C75, M09, M13 | Tirar → `opcion('R-3')`; quitar las esperas de las dos líneas; Paco: Mirar fax antes, opción «Ticket 0.441»; papel II espera «alguien tira más fuerte» |
| `test-comedia-p2.mjs` | `AN_ALBUM` (l. 392-419, 503), C17, C22, C94, C97, M20 | álbum → `album_validado`; luego `usar rotulador_rojo kanban` + `SALIDA EN VALOR`; sin la opción del funeral; M20: si la prueba pregunta por la IA antes del paso 38, espera «¿Tú de qué departamento vienes?» |
| `test-comedia-p3.mjs` | l. 163 (etiqueta), 215 (`logHas('siguientes pasos')` tras el café: **ya no está**), 270 (M04), 398 (C83) | l. 215 → `logHas('el punto que nadie toca')` |
| `test-comedia-p4.mjs` | estampida (l. 277-305: la opción de Gervasio ya no estampa), C45, C63, Lector en la Sala | orden del día → Gervasio → Gertrudis (por estado) → Usar tele → vía `anuncio` por espera; Hablar al Lector en el III: sin globo y Gervasio dice sus dos líneas |
| `test-critica3.mjs` | atajo y ascensor (submenú); señal (tambaleo con tres fotogramas) | Escape del submenú → rellano; la señal sigue pasando con `tamb1`/`tamb2`/`tamb3` |
| `test-motor.mjs`, `test-movil.mjs` | doble clic que hoy acaba en el borde; holgura táctil | §6.7-6.8 |
| `test-heredado.mjs` | l. 116 (Tirar papel en el II): sigue sin `ruben_encontrado` | si mira el texto, «alguien tira más fuerte» |
| `test-e4.mjs` | si comprueba el fundido de `junto()` en S5 | sin fundido: Bruno corre (§2.8 F4) |
| `text-audit` | topes nuevos | §8 |

### 11.2 Nuevas (`tools/test-e5.mjs`; cada bloque con **ratón real** donde dice «clic»)
1. **Estampida:** (a) sin Mirar el orden del día, Gervasio no ofrece la pregunta; (b) con él, clic en la opción →
   «…y los conectados.», `sala_becario_sin_turno`, **sin** `reunion_terminada`, diálogo cerrado; (c) tele con «sin
   turno» → «wifi y rencor»; móvil con tele → «once mil»; (d) Gertrudis → `gertrudis_pregunta`, también con
   `office_agotada` y `office_e53_visto`; (e) **orden inverso**: tele antes que Gertrudis → nada; Gertrudis antes que
   Gervasio → la opción no está; (f) clic en la tele → «PREGUNTA DEL PÚBLICO», atasco abierto, control devuelto;
   (g) las cuatro vías, cada una en partida limpia: una sola línea de vía en el registro, `reunion_terminada`, Mercados
   fuera, el regreso a por el cruasán solo fuera de la vía `cruasan`; (h) **guardar** con el atasco abierto: «Guardar» en
   gris; **cargar** una partida con `sala_amazonas_atasco` forzado → resuelto en silencio; (i) Acto III: ni opción de
   Gertrudis ni tele especial.
2. **Apagón:** sin modo rápido: (a) clic en «Tirar enchufe» → `pecera_oscuras`, `game.apagon`, dos focos, Anselmo
   andando; (b) hover sobre la taza «NO» → «algo que dice que no»; sobre el ordenador de Bruno → «algo»; (c) Hablar Yoli,
   Anselmo y Coger la taza → sus líneas; Ir a la salida del Vending → no sale y dice «No veo nada…»; (d) apuntar a
   Anselmo con verbo elegido 3 s → sigue andando; (e) Usar el enchufe a los 2 s → cierre; (f) a los 12 s → luz,
   `apagon_n === 1`, la línea «Que te la apague Paco», sin `cms_vivo`; (g) guardar en la ventana: en gris; cargar con
   `pecera_oscuras` forzado → luz y Anselmo en su mesa.
3. **Regletero:** clic en cada R: R-1, R-2 y R-4 no ponen `cms_vivo` y suben `cpd_regleta_mal_n`; R-5 no se tira
   (ni sube); R-3 → `cms_vivo`, sin «¡ESTAMOS CIEGOS!» por la rejilla; antes del apagón también funciona; con el
   registro leído, el camino antiguo sigue. Captura `e5-regletero.png` (las cinco etiquetas legibles a 2× o en el plano).
4. **Ticket 0.441:** sin pegatina, dos negativas distintas y sin manual; Mirar fax → `vio_pegatina_fax`; opción
   «Ticket 0.441» → manual y las dos líneas; Mirar el manual → «Posando» una vez en toda la partida.
5. **Armario:** Acto II: Tirar ×2 → las dos líneas, sin `ruben_encontrado`; Acto III: entrar → estado `corre` y la línea
   una vez (otra entrada, no); Tirar → `revelacion_ruben`.
6. **Columna:** rotulador antes del álbum → negativa; álbum → `album_validado`, sin álbum en el inventario, la línea
   nueva; Usar tablero sin rotulador → «pide rotulador»; boli muerto → su línea; clic en DESPEDIDOS → borrada, sin
   `posit_descopeado`; sin `rep_13` ni `oyo_descopear` → tres opciones y «Tráeme algo…» a la tercera; SALIDA EN VALOR →
   `posit_descopeado`, `ruben_libre`, `ticket_n1`, `columna_kanban === 'salida'` y las tres líneas del arranque; vía 4 →
   `'descopeado'`; con `taper_dado`, Rubén sostiene el táper. Capturas `e5-kanban-salida.png`, `e5-kanban-descopeado.png`.
7. **Señal:** ganar D4 por estado, sin tocar nada: 10 s → «Balón suelto…» con etiqueta MEGAFONÍA; mover el ratón sin
   parar no lo impide; 25 s y 45 s → las otras dos; con un diálogo abierto no suena ninguna; Empujar → el final idéntico
   al de `test-comedia-p1` (mismas líneas del epílogo).
8. **Ascensor:** desde Sistemas, planta 1 → «Redacción de papel» → `catacumba`, entrada `pecera`; Escape → rellano; en
   el III no sale la Sala; desde la planta 0 y −1, sin submenú.
9. **Frase de Anselmo:** en el recorrido de 50 pasos, «El modelo es de fuera. El prompt es de dentro.» aparece **una
   vez** en el registro (paso 38) y «Entonces es de la casa.» una vez (paso 46).
10. **Lote:** F4 (entrar desde el Vending con viral pendiente: sin fundido, `game.fade` a 0, Bruno corre); F9 (tres
    opciones de Custodia seguidas sin volver a hablar); N6 (con `tadeo_rv_n = 2` sin leer, 3 min en el Papel: no; leer
    RV1 allí: sí); coro K04 con Bruno cerca y no lejos; Lector en la Sala del III sin globo.
11. **Topes:** `text-audit --estatico --plan --e2 --recuento` OK con los de §8.

---

## §12 · ACTA DE LA CONTRA (qué se cambia de cada autor y por qué)

### 12.1 Al diseñador
| Su propuesta | Queda | Por qué |
|---|---|---|
| Paso «Mirar enchufe (brida R-3)» obligatorio | **Fuera del camino** (pista opcional) | Con «mira la brida» Anselmo dictaba el sitio y la brida dictaba el número: era otro «te lo dicen». Ahora Anselmo solo dice «baja a Sistemas, que te la apague Paco» y el regletero se resuelve **por eliminación** |
| Regletero con el número en el menú y gate «Arriba, la brida tenía apellido» | Menú con las **etiquetas** (R-1 · NÓMINAS…) y sin gate | La deducción está en las etiquetas; negar el regletero antes del apagón repetiría el antipatrón F1 |
| Ticket 3 sin nombrar la regleta | **No cambia** | El pósit de Paco («ni aunque lo diga el ticket 3») le contesta: es mejor chiste con el ticket intacto, y el camino antiguo queda como segunda solución |
| Verbos a oscuras hotspot a hotspot; salir a oscuras sin resolver | **Interceptor** del motor + sin guardar + normalizar al cargar | Una sola puerta para todos los verbos; nadie sale de la sala con la luz apagada ni carga una partida a oscuras |
| «…Ha entrado una pieza» en la ventana jugable | **Dentro de la cutscene** | Es la observación clave: no puede perderse por un clic |
| Atasco con 5 vías (incluida la tele) y Toni en el ascensor, Arsenio en Sistemas | **3 vías + espera**; Mercados se van como hoy | Cada vía cuesta una línea y solo se oye una; Toni en el ascensor cruzaba la estampida con el regletero (R-2) y añadía estados que guardar |
| Opción de Gervasio que deja el diálogo abierto | `return 'exit'` en Gervasio y Gertrudis | Si no, «Me voy.» y su réplica entran en el camino (+1 sin gracia) |
| Rebote «Por escrito. En marzo.» | Fuera | La opción desaparece; la meta de Bruno ya dice qué toca |
| Una sola pista para pasar de Gervasio a Gertrudis | **Dos más**: tele «wifi y rencor» y móvil con tele «once mil» | La deducción «conectados → Gertrudis» era el salto más largo del juego; ahora hay tres pistas sin la abuela |
| Rubén cambia su línea de las pruebas por «hecho o muerto» | **Rubén no cambia** | «Anselmo no mueve un pósit sin pruebas de que existo» es el motivo para ir a por el álbum; sin ella, el álbum es un recado sin porqué |
| «Pruebas, sí. Pero columna para eso no hay. Y yo no escribo novedades.» | «Las fotos me valen. Pero yo no escribo columnas nuevas.» | La suya acababa en coletilla; el «yo» de la nueva invita a que escriba otro |
| Arranque: «…Ni hecho ni muerto. Consultoría.» + «La frase la escribió Rubén…» | «¿Con qué has escrito eso? …De fuera.» / «Salida en valor. Ni hecho ni muerto, pero sale.» / «La frase la escribió Rubén. Rubén tenía alta. …Entonces es de la casa.» | «Consultoría» era un segundo chiste apilado; el orden herramienta-de-fuera → frase-de-dentro → de la casa hace del remate el **eco** de la frase favorita sin repetirla |
| Pistas del tablero solo por la abuela | Usar tablero, boli muerto, bolis de Aurora, termómetro | Dos pistas en el mundo antes de pedir ayuda |
| Rotulador «desde `torno_abierto`» con línea de Bruno si Maripaz no está | Sin línea si no está | −1 línea; el Mirar del objeto lo explica |
| Titular al revés en el monitor de Yoli + fila de la hoja de E4 | **Fuera** | Gastaba el «prohibido = invitación» que el clímax usa con Íñigo… que también se ha quitado; el monitor y la hoja son de E4; el armario ya tiene tres pistas en el III |
| Íñigo «Que nadie toque al Lector Medio. Está validando.» a los 25 s | Fuera | Decisión del director: las tres de Celestino |
| Reloj de la señal que se reinicia con cualquier entrada | Tiempo **quieto** acumulado | Un jugador perdido mueve el ratón: con el reinicio, la ayuda no le llegaría nunca |
| Lo demás (estampida por la tele, apagón jugable, nombres a oscuras, rotulador, columnas, armario en dos actos, ascensor, doble clic, F4, F8, F9, N6) | **Aprobado** | — |

### 12.2 Al guionista
| Su propuesta | Queda | Por qué |
|---|---|---|
| 113 reescrituras de coletilla | 108 aprobadas, 4 mejoradas, 1 tumbada | C37 no se entendía; C69 es la respuesta por defecto y se oye mucho; C34 y C43 cambian de objeto; C97 se queda sin menú |
| M19 (fuera «Posando» del manual) | **Tumbada**: «Posando» se queda en el manual y sale de Paco | Paco pierde dos líneas en el camino y el gag se oye una vez, cuando el jugador mira |
| M22-M25 «(asiente)» como globo | **Gesto sin globo** | Un globo con una acotación es texto de guionista; el cartón que cabecea es el chiste, y ahorra cinco cadenas |
| M26 «(a Gertrudis) Buenas… Se dan las buenas noches. En general.» | **Fuera** | Repetía en la misma sala el gag de Gervasio ante Gertrudis |
| Eco de Anselmo «Ya te lo he dicho. El prompt es de dentro…» (sin tocar) | «Ya te lo he dicho. Lo escribí yo. En mayúsculas.» | La frase favorita se oye entera **una** vez; el eco no la repite a medias |
| Reserva R1-R3 «la decide el tercero» | **Aplicada** + R4 («Vengo a reimaginar el perímetro.») | Paga las líneas del diseño; las cuatro están entre las peores de la crítica |
| Megafonía y coro | Aprobados tal cual | — |
| Mercados | Sus rasgos y sus tres nombres | Ver §5.2 |

### 12.3 Las cinco dudas del guionista, resueltas
1. **Pilar y su RECHAZADO** (petición al director): se queda (decisión del director). Quedan Bruno, Evaristo y Pilar;
   tope «frente» ≤ 2 sin Eventos.
2. **La reserva R1-R3** («la decide el tercero»): aplicada entera, más R4.
3. **El táper de Rubén** (C74, «coordinar con el diseñador»): C74 aprobada; el cabo suelto se paga **sin texto**: con
   `taper_dado`, Rubén se va a la ventana con el táper en la mano (§2.5.5). Sigue siendo opcional, pero ya rima.
4. **La rejilla del 27** (C79, «coordinar con el diseñador»): aprobada; casa con el papel a chorro del III («Alguien
   teclea. Se equivoca. Vuelve atrás.») sin tocar el armario.
5. **Lo que la regex no ve** (integraciones con coma, C69 y C109): C69 se acorta (sin coma: no esconde nada); C109
   («Contéstale mejor que él, y al final, lo de su máquina.») es una enumeración de pasos de la abuela, no un apéndice:
   aprobada. Revisadas las 77 líneas nuevas de esta enmienda: ninguna esconde la coletilla tras una coma.

### 12.4 Riesgos que quedan
1. **El salto «conectados → Gertrudis»** sigue siendo el más largo: hay que verlo en una partida a ciegas. Si falla, se
   adelanta el nivel 2 de la abuela («Esa cafetera tan educada sale en todas las pantallas…») a la meta de Bruno.
2. **Motor** (§6): diez cambios; el interceptor y `estampida({ esperar })` son los más delicados (cambio de sala,
   carga). Están aislados tras opciones.
3. **E4 en paralelo**: PB toca `pecera.js`, `pecera.escenas.js` y `pecera.dialogos.js`, que E4 también toca. PB empieza
   cuando E4 esté entregada.
4. **Arte**: regletero legible (plan B: plano detalle), la tele con Gertrudis y la columna del kanban.
5. **Reloj**: en el peor caso realista (rotulador después del álbum y Paco antes de la pegatina) llega a ≈ +4,5 min.
6. **«mis sistemas» de Anselmo** puede pasar de 5 en el recuento automático (§8: la sustitución está escrita).
7. **Ascensor + `walk-lib`**: si I1 no llega antes que las salas, sus `test-all --sala` fallarán por el submenú.
