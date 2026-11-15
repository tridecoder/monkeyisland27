# E5 · DISEÑO DE PUZLES Y SITUACIONES (parte de diseño)

> Diseñador de aventuras. Responde a la crítica 4 (`docs/informes/critica4/CRITICA_JUEGO_4.md`: prioridades 1, 2, 4, 5,
> 6, 7, 10; fallos F1-F4, F8, F9; N6, N9) para pasar de 7,5 a 8,5. Da por hecha la E4 (`docs/guion2/ENMIENDA_E4.md`):
> titulador, hoja «LO MÁS LEÍDO», ráfaga, escenas `pecera_opa_ab` y `pecera_opa_ganadora`.
> La parte de texto (coletillas, coro, muletillas) es de otro guionista. Aquí van **situaciones, puzles, flags, pistas,
> arte y líneas guía**. El texto fino lo pule el guionista, pero cada línea guía ya pasa ≤ 80 caracteres y los topes
> del auditor (comprobado con `scratchpad/e5/lineas.mjs`: 71 líneas y 0 fallos).
>
> Reglas que se respetan: Eventos y Pilar no se tocan. La cadena final no se toca: el empujón y todo lo de después
> siguen igual. Nada adelanta a la abuela lectora. Herminia sigue siendo objeto. En Desarrollo solo están Anselmo y el
> coro. Maripaz solo habla de inventario. Diseño e Infografía no coinciden en plano. No sale el director. Saldo de
> líneas del camino principal: **+13** (tope +15), en §9.

## Índice
0. Resumen en una tabla
1. La estampida como puzle (prioridad 1)
2. El armario 27 (F1)
3. La señal tras el clímax (F2)
4. El Acto III pide algo: la columna nueva (prioridad 7)
5. Escenas largas de situación: el apagón y Mercados (prioridad 4)
6. De «te lo dicen y lo haces» a deducción (16 pasos)
7. Menos viajes: el ascensor con atajos y el doble clic (prioridad 5, F3)
8. Lote pequeño: F4, F8, F9, N6, N9
9. Recorrido nuevo completo, saldo de líneas y reloj
10. Riesgos
11. Orden de recorte (impacto / coste)
12. Decisiones del dueño

---

## 0. Resumen

| # | Hoy | Pasa a ser | Coste |
|---|---|---|---|
| 1 | Aurora dicta «siguientes pasos» y se elige en el menú de Gervasio | Gervasio no da turno a un becario: solo a «los de la mesa y los conectados». Bruno le hace la pregunta a Gertrudis, que la reenvía «a la próxima pantalla que la sintonice». En la Sala, Usar tele: Gertrudis sale en la tele y pregunta en directo. Estampida, con un atasco jugable | +5 líneas · arte de la tele · 3 flags |
| 2 | «Tirar papel continuo» se niega en el II y es la solución del III | La negativa siembra («alguien tira desde dentro»). En el III el papel sale a chorro porque el de dentro está ocupado; el monitor de Yoli escupe «…NO TIRES DEL PAPEL: ES MI BORRADOR». Pistas accionables | +2 · estado de arte `corre` |
| 3 | Tras D4, silencio y un tambaleo de 4° | Las caras se giran al cartón, el tambaleo crece y cruje. A los 9 s, Celestino por megafonía. A los 25 s, Íñigo: «Que nadie toque al Lector Medio» | +1 · variante `tamb3` |
| 4 | Álbum → elegir «salida en valor» en un menú | Anselmo acepta las pruebas pero no tiene columna. Bruno coge el rotulador de objetivos de Maripaz (planta 2, mismo viaje que el álbum), escribe él la columna en el kanban y mueve él el pósit | +3 · objeto nuevo |
| 5 | Apagón opcional; Mercados sin nombre | El apagón entra en el camino principal y deja **jugar a oscuras** unos 12 s. Mercados se llaman Severiano Plazo, Toni Diferido y Arsenio Prima, y el atasco de la puerta se resuelve con lo que haga el jugador | (incluido en 1 y 6) |
| 6 | 6 de deducción y 10 de «te lo dicen» | 10 y 6: estampida, regleta (apagón → brida → regletero de 5), manual del fax por número de ticket y columna del kanban | regletero (arte) |
| 7 | Atajos solo en el tótem de la planta 1; el doble clic se para en el borde | El ascensor ofrece las salas ya pisadas de cada planta (reutiliza `directorio.js`). El doble clic en el borde corre hasta la siguiente «parada» con la cámara adelantada; el doble clic en un objeto corre hasta él | motor (mover) |
| 8 | F4, F8, F9, N6, N9 | `junto()` sin teletransporte; holgura táctil mayor que gana al fondo; Custodia no cierra; Aurora solo comenta un RV leído; N9 ya está resuelto en pantalla | pequeño |

---

## 1. LA ESTAMPIDA COMO PUZLE DE VERDAD

### (a) Diagnóstico
- `content/rooms/catacumba.js:363-365`: Aurora dice «Y una reunión solo se acaba cuando alguien pregunta por los
  siguientes pasos.» y pone `aurora_conto_pasos`.
- `content/rooms/sala_amazonas.js:438-439`: con ese flag, Gervasio ofrece «Bueno... ¿y cuáles son los siguientes
  pasos?», que lanza `reunionTerminada` (l. 497-563) sin condición. Es la frase de Aurora, copiada.
- `content/pistas.js:64-67`: el nivel 3 repite la frase.
- Lo que ya existe y no se usa: `tele_amazonas` («PULSAR ENTRADA 3. NO, LA 2. NO», `sala_amazonas.js:277-293`), los
  murmullos de Mercados «¿Me veis la pantalla? ...¿Hola? ¿Me veis?» (l. 70), Gertrudis «CON TODO LO QUE TENGA PANTALLA.
  TENGO WIFI Y RENCOR.» (`office.js:69`), el vídeo viral que le llega hasta a la abuela (`pistas.js:176-181`) y el
  orden del día, que es una pantalla («El punto 3. Nadie lo toca. Dicen que muerde.», l. 243-244).

### Alternativas valoradas
| | Idea | A favor | En contra | Veredicto |
|---|---|---|---|---|
| A | **Gertrudis pregunta por la tele** (la que propone el crítico). Bruno no tiene turno; los conectados, sí. Gertrudis lo reenvía todo a cualquier pantalla. La tele de la Sala la sintoniza | Usa cinco cosas que ya existen. Paga el hilo viral y el «¿Me veis la pantalla?». El jugador lo provoca y lo **ve** en la Sala. Es de dos salas y tiene dos pistas independientes | Un viaje de ida y vuelta Sala-Vending (son puertas vecinas del núcleo de la planta 1: unos 30 s) | **Elegida** |
| B | **El rotulador de Pilar en el orden del día** | Físico | Toca Eventos y Pilar, que están **prohibidos**. Además el orden del día es una pantalla, no un papel | Descartada |
| C | **Un banner de Maripaz en el orden del día**: Bruno compra un hueco publicitario («PATROCINADO: ¿Y CUÁLES SON LOS SIGUIENTES PASOS?») | Muy de Maripaz (inventario). Ningún viaje | Se resuelve hablando con ella: otra vez un menú. Además le quita fuerza a su duelo, que viene justo después | Reserva, si el dueño no quiere el viaje |
| D | **Celestino por megafonía** (Bruno le pasa la pregunta como «hazaña») | Personaje fuerte | Celestino ya narra hitos; la megafonía no es «conectado» y no tiene lógica de turno. Además se gasta antes de tiempo la paga de la tele en el clímax | Descartada |

### (b) Diseño (A): «Pregunta del público»

**Lógica que el jugador deduce:** (1) en esta reunión un becario no tiene turno; (2) los que salen en la tele sí lo
tienen (Mercados lleva toda la tarde mirando a la pantalla); (3) Gertrudis sale en todas las pantallas; (4) si se le
pregunta lo que nadie contesta, ella lo reenvía; (5) la tele de la Sala puede sintonizarla.

Paso a paso:
1. **Aurora (sustitución, 0 líneas)**, `catacumba.js:364`: «Y una reunión solo se acaba cuando alguien pregunta por el
   punto que nadie toca.» Ya no da la frase: da el sitio donde está.
2. **Orden del día** (`sala_amazonas.js:241-245`): Mirar, como hoy (2 líneas), y además pone el local
   `sala_amazonas_orden_visto`. Ahí está «3. Siguientes pasos. Nadie lo toca».
3. **Gervasio** (`GV_REUNION`): la opción «Bueno... ¿y cuáles son los siguientes pasos?» pasa a pedir
   `['aurora_conto_pasos', 'sala_amazonas_orden_visto', '!sala_becario_sin_turno']`. Su `do` ya **no** lanza la estampida:
   - `api.wait(800)`: las tres cabezas de Mercados se levantan y vuelven a bajar.
   - GERVASIO: «Los becarios no tienen turno. Preguntan los de la mesa... y los conectados.»
   - Toni Diferido (`mercados_2`) se gira hacia la tele (`faceActor`) sin decir nada.
   - `setFlag('sala_becario_sin_turno', true)`. Mirar a Bruno cambia de meta (ver (c)).
   - Si se vuelve a preguntar (opción nueva `if: 'sala_becario_sin_turno'`, sin `once`): GERVASIO «Por escrito. En marzo.»
     (opcional).
4. **Gertrudis** (`office.js`, `dialogoGertrudis.G0`): opción nueva **antes** de «Nada. Gracias, Gertrudis.»:
   `{ text: '¿Y cuáles son los siguientes pasos?', if: ['sala_becario_sin_turno', '!gertrudis_pregunta', '!reunion_terminada'] }`.
   `do`: `api.sfx('beep')`, parpadeo (`parpadeo(api)`), LCD: «PREGUNTA SIN RESPUESTA. LA MANDO A LA PRÓXIMA PANTALLA QUE ME
   SINTONICE.», `emision(api, 1)` (piloto EN DIRECTO encendido) y `setFlag('gertrudis_pregunta', true)`. Funciona aunque
   esté «agotada» (`office_agotada`) o después de E-53: es una pregunta, no un saludo.
5. **La tele** (`usarTele`, `sala_amazonas.js:33-36`): si `gertrudis_pregunta && !reunion_terminada`, se ignora la
   rotación y se lanza la escena nueva `sala_tele_gertrudis` (si no, la rotación de siempre). La entrada 4 «BUSCANDO SEÑAL»
   de la rotación pasa a ser, con `cafetera_viral`, «ENTRADA 4: «BUSCANDO SEÑAL». La busca con más ganas que yo.» (igual)
   + en el arte el piloto verde de Gertrudis parpadeando en la esquina: es la pista visual.
6. **Escena `sala_tele_gertrudis`** (cutscene):
   - `setState('tele_amazonas', 'buscando')`, 600 ms; `setState('tele_amazonas', 'gertrudis')`, `sfx('beep')`.
   - TONI DIFERIDO: «¡Se ve! ¡Por fin se ve la pantalla!» (paga su murmullo de toda la tarde).
   - GERTRUDIS por la tele (`api.sayFrom('tele_amazonas', …, { color: '#39FF14' })`): «PREGUNTA DEL PÚBLICO: ¿Y CUÁLES
     SON LOS SIGUIENTES PASOS?»
   - Sigue `reunionTerminada` con dos sustituciones (0 líneas netas):
     - l. 500 «Los... siguientes...» → GERVASIO: «Pregunta de un conectado. Consta. Los... siguientes...»
     - l. 509 «Pues el que ha preguntado, que tiene la agenda...» → GERTRUDIS por la tele: «CONVOCADA. CON TODA LA EMPRESA
       EN COPIA. Y CAFÉ.» (la estampida sale de ahí: Gertrudis ha convocado la reunión de siguientes pasos).
   - Estampida y **atasco jugable** (§5.2).
   - Al final: `setState('tele_amazonas', 'normal')`, `emision` de Gertrudis a 0 (lo pone `office.onEnter`, que ya lo hace).
7. Fuera de la secuencia, `onEnter` de la Sala deja la tele en `normal` como hoy (l. 490).

**Flags.** Globales (P0, `flags.js`): `sala_becario_sin_turno` (bool · sala_amazonas · lo leen office y pistas) y
`gertrudis_pregunta` (bool · office · lo leen sala_amazonas y pistas). Locales de la Sala: `sala_amazonas_orden_visto`
y `sala_amazonas_atasco` (§5.2).

**Arte.** `art/sala_amazonas.art.js` `drawTele`: dos estados nuevos. `buscando` es nieve con «BUSCANDO SEÑAL». En
`gertrudis`, el LCD verde de Gertrudis llena la pantalla con piloto rojo «EN DIRECTO» y una taza en la esquina; se
reutiliza la paleta del overlay de `office.art.js`. En los Actos I-II, con `cafetera_viral`, la esquina de la tele
lleva un puntito verde que parpadea cada 4 s.

### (c) Pistas de la abuela (`pistas.js`): el objetivo `reunion` se parte en dos
- `reunion` (hecho `sala_becario_sin_turno || reunion_terminada`; salas `pajarera`, `sala_amazonas`):
  1. «Las reuniones se acaban cuando alguien pregunta lo que nadie quiere tocar.»
  2. «Mira el papel de los puntos, hijo. El que nadie toca.»
  3. [«Pregúntale al que preside por ese punto.», «Orden del día, punto 3. A Gervasio: «¿y los siguientes pasos?».»]
- `turno` **nuevo** (acto 2, activo `sala_becario_sin_turno`, hecho `reunion_terminada`; salas `sala_amazonas`,
  `office`, `pecera`; meta nueva `M.turno`: «En esa reunión solo pregunta quien sale en la tele. Yo no salgo en nada.»):
  1. «Si a ti no te dejan preguntar, que pregunte alguien que salga en la tele.»
  2. «Esa cafetera tan educada sale en todas las pantallas, hijo. Hasta en la mía.»
  3. [«Pregúntale a la cafetera lo de los pasos. Y luego enciende esa tele.», «Gertrudis: «¿Y los siguientes pasos?». Luego, Usar la tele de la Sala.»]
  - `previa` con `gertrudis_pregunta` en el nivel 1: «La cafetera ya lo ha mandado. Ahora alguien tiene que mirarla.»
- `hueco` sigue activo con `reunion_terminada`, igual que hoy.

### (d) Líneas guía
Las de arriba. Murmullo nuevo de Toni Diferido con `sala_becario_sin_turno`: «¿Me veis la pantalla? ...¿Hola?» (ya
existe: se mueve a él). Opcional: Hablar con la tele con la pregunta cargada → «Sigue buscando señal. La mía no, la
de la cafetera.»

### (e) Cómo se prueba
- `tools/test-e5.mjs` (nuevo), bloque «estampida»: (1) sin `sala_amazonas_orden_visto` no aparece la opción; (2) con
  ella, Gervasio contesta «…y los conectados.», queda `sala_becario_sin_turno` y **no** queda `reunion_terminada`;
  (3) Gertrudis, opción nueva → `gertrudis_pregunta`; (4) Usar tele → el log tiene «PREGUNTA DEL PÚBLICO» y
  `reunion_terminada`; (5) en el orden inverso (tele antes que Gertrudis) la tele rota como siempre y no hay estampida;
  (6) partida con `office_agotada` y `office_e53_visto`: la opción de Gertrudis sigue funcionando.
- `tools/test-fase0.mjs` (estampida con Anselmo): cambiar a `sala_tele_gertrudis`.
- Captura `tools/shots/e5-tele-gertrudis.png`: el LCD se lee y Bruno no tapa la tele.

---

## 2. EL ARMARIO 27 (F1)

### (a) Diagnóstico
- `content/rooms/cpd.js:362`: en los Actos I-II, Tirar papel continuo → «No tiro de algo que imprime solo. Igual es la
  nómina.» La puerta del armario dice (l. 345) «El papel que sale por debajo, a lo mejor sí.»: la invitación está en
  la puerta y la negativa en el papel. Se contradicen.
- `cpd.js:332`: Mirar el armario en el III dice «alguien teclea dentro», pero no invita a tirar.
- `content/pistas.js:114-117`: los niveles 1-2 repiten lo que el jugador ya sabe; solo el 3 da la acción.
- La súplica «AYÚDAME ESTOY EN EL ARMARIO 27» está en el Acto I (`pajarera.js:69-121`, paso 12) y en el móvil, como RV3
  mudo del III (`lib/movil.js:19`). En el Acto III no está en ningún sitio a la vista.
- `pecera.escenas.js:320-326` (`pecera_dos_ias`, camino principal del III): Herminia dice «origen: Sistemas, armario 27».
  Es la invitación más fuerte que hay hoy, y no dice cómo.

### (b) Diseño: la negativa siembra y el Acto III explica por qué ahora sí
**Lógica:** en el Acto II el de dentro está quieto y tira del papel hacia sí. En el III, Íñigo le tiene escribiendo
los discursos de la Reunión a toda máquina (el papel «sale a chorro»), así que no sujeta su borrador.

1. **Acto II, Tirar papel continuo** (`cpd.js:362`, sustitución): `anim('bruno','reach',380)`,
   `setState('papel_continuo','tensa')`, 250 ms, `sfx('paper')`, el papel se recoge hacia dentro (`asoma`), `shake(150,1)`.
   - 1.ª vez: «Tiro un poco y alguien tira desde dentro. Más fuerte. Y mastica.»
   - siguientes: «Desde dentro no sueltan. El de ahí no está distraído.»
   - Local `cpd_papel_tirones` (int).
2. **Acto III, papel a chorro**: con `acto_3_iniciado && !ruben_encontrado`, el `onEnter` de `cpd` pone el estado nuevo
   `papel_continuo: 'corre'`. Es una animación: la tira avanza 1 px cada 120 ms y se amontona en el suelo, y la matricial
   suena (`sfx('typewriter')` en bucle suave desde `animate`). La 1.ª entrada del III (`api.once('cpd_papel_chorro')`),
   antes del control: BRUNO «El papel del 27 sale a chorro. El de dentro está muy ocupado.»
   - Mirar papel continuo (III): «Papel continuo, saliendo a chorro. Nadie lo sujeta desde dentro.»
3. **Monitor de Yoli en el camino principal del III** (`pecera_dos_ias`, después de la línea de Herminia «origen:
   Sistemas, armario 27»): `api.titular('AYÚDAME ESTOY EN EL ARMARIO 27. NO TIRES DEL PAPEL: ES MI BORRADOR', { from:
   'monitor_yoli' })`. La cámara (840) ya enseña el monitor (694). Es una pista al revés, con la voz del Titulator: pide
   socorro y prohíbe justo lo que hay que hacer. Cuando Bruno tira, sale «¡EH! ¡QUE ES MI BORRADOR!» (`cpd.js:40`), que
   ya existe y ahora rima.
4. **Lo de la E4**:
   - **Ráfaga (paso 23, Acto II): NO.** Con el Acto II invitaría a volver a Sistemas cuando todavía no se puede, y
     rompería la ley de E4 (Yoli en minúscula; el Titulator, en su franja).
   - **Hoja «LO MÁS LEÍDO», versión III: SÍ (opcional).** Con `acto_3_iniciado && !ruben_encontrado`, la fila 4 (F17)
     pasa a ser «AYÚDAME ESTOY EN EL ARMARIO 27... · 3» (tres lecturas: nadie la lee). Con `ruben_encontrado`, vuelve
     F17. Fichero `pecera.titulares.datos.js`. Cero líneas.
   - **Monitor/titulador: SÍ, en el plano de `pecera_dos_ias`** (punto 3). El titulador no: no es Discover.
5. Se quita la contradicción de la puerta: `armario_27.tirar` → «La puerta no cede. El papel de abajo es otra cosa.»

### (c) Pistas (`armario`)
1. «Ese papel que sale del armario, tira de él, que no muerde.»
2. «Antes tiraban desde dentro. Ahora el de dentro está muy liado escribiendo.»
3. [«Tira del papel continuo del armario, hijo. Con ganas.», «Sistemas: tirar del papel continuo del 27.»]

### (d) Líneas guía
Las de arriba. Tope de Bruno: dos líneas nuevas (entrada del III y titular). Las del Acto II sustituyen.

### (e) Cómo se prueba
- `test-e5`: (1) Acto II: Tirar papel → «desde dentro», sin `ruben_encontrado`; (2) Acto III: entrar en `cpd` → estado
  `corre` y la línea, una vez; (3) Tirar → `revelacion_ruben` como hoy; (4) `pecera_dos_ias` deja en el log
  «NO TIRES DEL PAPEL».
- Partida a ciegas corta (guion de Playwright del crítico): probar Tirar en el II y medir si en el III se repite sin
  pista.

---

## 3. LA SEÑAL TRAS EL CLÍMAX (F2)

### (a) Diagnóstico
- `content/escenas/climax.js:108-111`: `onWin` pone `duelo_inigo_ganado` y dice una línea. Después, nada.
- `content/actors.js:144-153, 483-491`: tambaleo de 4° y 2° cada 3,2 s. No suena y apenas se ve.
- `sala_amazonas.js:364-367`: el empujón solo funciona con `duelo_inigo_ganado`. La cadena intocable empieza en
  `climaxEmpujon` (`climax.js:179`) y sigue en `final.js`. **Nada de eso cambia.**

### (b) Diseño: tres escalones, sin tocar la cadena
1. **Al ganar** (`onWin`, después de la línea de Íñigo): `faceActor(INIGO, LECTOR)`, `faceActor(GERV, LECTOR)` y los de
   la sala que estén. Todos miran al cartón. Cero líneas.
2. **Tambaleo con sonido**: `tambaleo(t)` de `actors.js` gana un tercer fotograma `tamb3` (8°). El ciclo pasa a
   4° → 8° → 4° → 2° y, en el pico, `sfx('crujido')` (cartón: ruido corto filtrado; `engine/audio.js`, receta nueva). Lo
   dispara el `update` de la Sala (abajo), no el dibujo.
3. **`update(api, dt)` de `sala_amazonas`** (el hook ya existe, `core.js:1091`). Si `duelo_inigo_ganado &&
   !lector_derribado && climaxActivo(api)` y no hay `busy`, `cutscene`, diálogo ni menú:
   - lleva un reloj propio (`sala_amazonas_espera_ms`, local, no se guarda) que se pone a cero con cualquier acción del
     jugador (`api.game.idleMs` sirve: ya lo reinicia `inputActivity`);
   - a los **9 s**, una vez (`api.once('sala_lector_celestino')`): `api.megafonia('celestino', '¡Se tambalea el Lector
     Medio! ¡Nadie se atreve! ¡Falta el último toque!', { etiqueta: 'MEGAFONÍA' })`. Es la voz del edificio. La imagen
     llega después, en el empujón (la tele se enciende sola con ENTRADA 1): de la voz se pasa a la imagen, y la paga
     crece;
   - a los **25 s**, una vez: ÍÑIGO «Que nadie toque al Lector Medio. Está validando.» Es la invitación clásica: lo
     prohibido;
   - nada más. «Mirar a Bruno» y la abuela siguen como hoy.
4. Opcional, para que Celestino tenga cara: Mirar `tele_amazonas` con `duelo_inigo_ganado` → «Ahí está la cámara de la
   tele. Celestino lo ve todo. Hasta esto.»

### (c) Pistas (`empujon`): sin cambios (ya escalan bien).

### (d) Líneas guía
CELESTINO (megafonía): «¡Se tambalea el Lector Medio! ¡Nadie se atreve! ¡Falta el último toque!» · ÍÑIGO: «Que nadie
toque al Lector Medio. Está validando.»

### (e) Cómo se prueba
- `test-e5` sin modo rápido: ganar D4 por estado (`__game.setFlag`), esperar 10 s → el log tiene «Falta el último
  toque» con etiqueta MEGAFONÍA; esperar 26 s → «Está validando»; Empujar → el final igual que hoy (mismas líneas que
  `test-comedia-p1`, epílogo).
- Con cualquier clic a los 5 s, el contador se reinicia (no salta a los 9 s).

---

## 4. EL ACTO III PIDE ALGO: «LA COLUMNA NUEVA»

### (a) Diagnóstico
- `cpd.js:83-85` (Rubén): «Mi baja es un pósit en el tablero de Anselmo… Y Anselmo no mueve un pósit sin pruebas…
  Nadie me ha hecho nunca una foto. Bueno, una. En Eventos. Al fondo.»
- `pecera.dialogos.js:155-173` (`AN_ALBUM_INTRO` / `AN_ALBUM`): con el álbum, un menú con cuatro opciones. La buena es
  la réplica de Rubén escrita literal («No es un despido: es una salida en valor.», `if: 'rep_13'`). `salida()`
  (l. 216-285) hace todo Anselmo.
- `pistas.js:122-126`: el nivel 3 da la frase.
- El Acto III de hoy: tirar, preguntar, pedir el álbum, elegir la frase, duelo y empujar. Nada se combina.

### (b) Diseño: Bruno escribe la columna y mueve el pósit él mismo
**Lógica:** (1) del tablero de Anselmo «se sale hecho o muerto» (Rubén lo cuenta y Anselmo lo repite); (2) Anselmo
acepta las fotos como prueba, pero no escribe columnas nuevas; (3) para una columna hace falta algo que pinte en el
tablero, y el rotulador de objetivos del termómetro de Maripaz ya pinta (Usar termómetro: «Le pinto un poquito más de
rojo.», `ecosistema.js:263`); (4) el nombre de la columna es la frase que despide sin despedir, que escribió Rubén.
Objetos de **dos plantas**: el álbum y el rotulador de la 2, la frase de la −1 y el tablero de la 1. El rotulador está
en Marketing y Comercial, la sala de llegada de la planta 2, de camino a Eventos: **no añade viaje**.

1. **Rubén, siembra** (`cpd.js:83-85`, 3 líneas por 3): «Mi baja es un pósit en el tablero de Anselmo. En POR HACER.» /
   «De ese tablero se sale hecho o muerto. Y yo no soy ninguna de las dos.» / «Nadie me ha hecho nunca una foto. Bueno,
   una. En Eventos. Al fondo.» (Se quita «Y Anselmo no mueve un pósit sin pruebas…»: lo dirá Anselmo.)
2. **El rotulador** (`ecosistema.js`, `termometro_ventas`): Coger (desde `torno_abierto`, solo una vez) →
   MARIPAZ: «¿Mi rotulador de objetivos? Llévatelo. Lo que pintes, lo cobro como espacio.» → `give('rotulador_rojo')`
   y el local `ecosistema_rotulador_dado`. Si Maripaz no está (Acto II antes de D1), lo dice Bruno: «Me llevo el
   rotulador. Maripaz lo cobrará en cuanto vuelva.» Usar termómetro con el rotulador ya en la mano: la línea de hoy.
3. **Objeto nuevo** `rotulador_rojo` (`items.js`, P0): nombre «rotulador de objetivos», icono de 24 px (rotulador rojo
   con capuchón y etiqueta «Q3»). Mirar: «El rotulador del termómetro de Comercial. Pinta objetivos. En rojo.»
   `usar:*`: «Con esto solo se pintan objetivos. Aquí no veo ninguno.» `dar:maripaz_remitido`: «Quédatelo. Ya te lo
   cobraré por impresiones.» (opcional).
4. **Dar álbum a Anselmo** (`AN_ALBUM_INTRO`, igual hasta «…Y despedir no es una columna de mi tablero.»), y después una
   línea nueva: ANSELMO «Pruebas, sí. Pero columna para eso no hay. Y yo no escribo novedades.» Ahí se pone
   `album_validado` (global, P0). **Anselmo se queda el álbum** (`take`) y grapa la foto del fondo al pósit de Rubén:
   el kanban pinta un cuadradito de foto en el pósit (`album_validado`). Se borra el nodo `AN_ALBUM` (menú de cuatro).
   Lo que quede del menú (funeral, «damos por hecho») pasa a ser texto de las opciones fallidas del punto 5.
5. **Usar `rotulador_rojo` con `kanban`** (o con `posit_1998`), `pecera.js`:
   - sin `album_validado`: ANSELMO (`tirar` del kanban de hoy) «Ni se te ocurra. De mi tablero se sale hecho o muerto.»
   - con `album_validado`: Bruno se acerca (`walkTo('kanban')`) y sale un menú (`api.choose`) de «¿Qué columna escribo?»:
     `DESPEDIDOS` · `HECHO (DE VERDAD)` · `FIRMAR EN PAPEL` · `SALIDA EN VALOR` (si `rep_13`) · `DESCOPEADO` (si
     `oyo_descopear`) · «Mejor no.». Con las equivocadas, Bruno escribe (anim, `sfx('paper')`), Anselmo lo borra con la
     manga y suelta su línea (abajo). Con una buena, Bruno escribe, **coge el pósit de Rubén y lo cambia de columna**
     (`anim reach 700`, `setFlag('posit_descopeado')`, `setFlag('columna_kanban', 'salida' | 'descopeado')`) y empieza
     `salida(api, via)` con el arranque cambiado:
     - ANSELMO: «¡Eh! ¿Con qué has escrito eso? ...Rotulador de Comercial. De fuera.»
     - vía 3: ANSELMO «...Salida en valor. Ni hecho ni muerto. Consultoría.» / «La frase la escribió Rubén. Rubén tenía
       alta. ...Entonces es de la casa.» (sustituye a «Despedir, no. Salida en valor. ...Eso sí lo sé hacer yo.»)
     - vía 4: ANSELMO «Descopear. Quitar sin que se note. Eso es infraestructura.» (igual que hoy).
     - El resto de `salida()` sigue igual desde «Columna nueva. La primera que no dice que no.», menos el paseo de Anselmo
       al tablero y el rotulador, que ahora hace Bruno. El rotulador se queda en el inventario: lo usa el epílogo.
   - Sin `rep_13` ni `oyo_descopear`, el menú solo trae las tres equivocadas. A la tercera, Anselmo: «Tráeme algo que no
     sea ni hecho ni muerto. Eso no existe.» (la línea de hoy, `albumNo`).
6. **Arte**: `art/pecera.art.js` `drawKanban`: la columna nueva con dos textos, `SALIDA EN VALOR` o `DESCOPEADO` según
   `columna_kanban`, en rojo de rotulador y con una letra peor que la de Anselmo, y debajo, en micro, «patrocina:
   Comercial» (gag mudo de Maripaz). Pósit con foto grapada (`album_validado`).
7. **Epílogo (opcional, P1; fuera de la cadena)**: si `columna_kanban`, Maripaz no tiene que decir nada; el banner a
   rotulador de su periódico ya existe (`final.js`, cabecera).

**Flags (P0).** `album_validado` (bool · pecera · pistas, kanban) y `columna_kanban` (str · pecera · arte). Objeto
`rotulador_rojo`. Local `ecosistema_rotulador_dado`.

**Reloj.** El rotulador se coge en la planta 2 junto con el álbum. Lo que se añade: unos 15 s para cogerlo, unos 30 s
de menú en el kanban y lo que tarde en pensarlo el jugador (de 1 a 2 min). En el peor caso, si llega al kanban sin
rotulador, un viaje más a la planta 2, de unos 45 s con el atajo del ascensor (§7). **Acto III: entre +1 y +3 min.**

### (c) Pistas
- `album`: igual (Eventos).
- `baja` (hecho `album_validado`; activo con el álbum en la mano o `ruben_encontrado`): igual que hoy, con el nivel 3
  cambiado: [«Enséñale las fotos al del tablero.», «El álbum, a Anselmo.»].
- `columna` **nuevo** (acto 3, activo `album_validado`, hecho `ruben_libre`, sala `pecera`; meta `M.columna`: «Anselmo
  ya cree que Rubén existe. Lo que no hay es columna para que se vaya.»):
  1. «Si en un tablero no hay sitio para lo que quieres, hijo, haz tú el sitio.»
  2. «Una columna nueva se escribe con rotulador. La de los anuncios tiene uno.»
  3. [«Escribe en el tablero la frase fina del chico. Y mueve tú el papelito.», «Rotulador de Maripaz + tablero de Anselmo: «SALIDA EN VALOR».»]
  - `extra` con `['!rep_13', '!oyo_descopear']`: «Pero antes pregúntale al chico por los discursos de ese señor.»
    (la de hoy).

### (d) Líneas guía (fallos del kanban)
`DESPEDIDOS` → «Eso es "muerto" con corbata. Bórralo.» · `HECHO (DE VERDAD)` → «"De verdad" no es un estado. Bórralo.»
· `FIRMAR EN PAPEL` → «Eso es tuyo. Mi tablero no es tu diario.» Dejo un gancho para el guionista del coro: al
escribir la columna buena, las tres espaldas se giran. La línea, si la hay, es suya.

### (e) Cómo se prueba
- `test-e5`: (1) Rotulador sin álbum → negativa, sin flags; (2) álbum → `album_validado`, el álbum sale del inventario;
  (3) rotulador + `DESPEDIDOS` → no hay `posit_descopeado`; (4) `SALIDA EN VALOR` → `posit_descopeado`, `ruben_libre`,
  `ticket_n1`, `columna_kanban === 'salida'`; (5) sin `rep_13` ni `oyo_descopear` → solo tres opciones y la línea a la
  tercera; (6) vía 4 → `columna_kanban === 'descopeado'`.
- Las capturas `e5-kanban-salida.png` y `e5-kanban-descopeado.png` (el texto cabe en la columna).
- `tools/sala.mjs pecera`: Valentín (1240) no sale en el plano del kanban.

---

## 5. ESCENAS LARGAS DE SITUACIÓN (ACTOS II-III)

### 5.1 El apagón, en el camino principal y **jugable a oscuras**

**(a) Diagnóstico.** `pecera.escenas.js:183-235` (`apagonEscena`): la escalada de tres apagones existe, pero es
opcional. El camino principal va directo a Sistemas, y el registro dice qué regleta tirar (`cpd.js:416-423`, «Va a la
regleta R-3 de Sistemas. Apagarla»). Además la brida de la regleta dice «PANTALLA DE MÉTRICAS» (`cpd.js:376`). La
crítica: «la regleta R-3 es un puzle trivial».

**(b) Diseño: cadena de deducción (Redacción → Sistemas)**
1. **La pista para empezar** ya está: la meta de `cms` y el nivel 1 de la abuela («Apágale algo a alguien»), la pantalla
   de métricas que se refresca «igual que Yoli» y el enchufe con «NO DESENCHUFAR». Lo nuevo: el ticket nº 3 del registro
   **ya no nombra la regleta**: «Nº 3, 2017: «El CMS se cuelga con la pantalla de la Redacción». «Solución: apagarla».
   Estado: no prioritario.» (`cpd.js:421`). El registro sigue siendo opcional y una segunda pista.
2. **Tirar `enchufe_pantalla` (1.ª vez, sin `vio_ticket_3`)** → `apagonEscena` n = 1, rehecha en tres tiempos:
   - **Cutscene corta**: Bruno tira, `api.apagon({ ms: 0, spots: [SPOT_YOLI, { actor: 'anselmo_monolito', rx: 10, ry: 8 }] })`
     (punto de luz que sigue a un actor: ampliar `engine/efectos.js` `apagon` para que `spots` acepte `{ actor, rx, ry }`).
     YOLI: «¡Estamos ciegos! ¿Hay alguien leyendo? ¿HAY ALGUIEN AHÍ FUERA?»
   - **Ventana jugable de hasta 12 s** (`api.setFlag('pecera_oscuras', true)`; se acaba la cutscene). Anselmo se levanta
     con la linterna del móvil y cruza **sin prisa** desde su mesa (1082) hasta el enchufe (606): `walkActor` sin
     `await`, `speed` 30, marcado `noFreeze` para que no se pare cuando el jugador le apunte (`engine/mover.js`
     `frozen`, excepción por bandera del actor). Mientras tanto:
     - cada 2 s, `PLIN` y el monitor de Yoli parpadea en `publicado`: el CMS publica a oscuras. Es la observación clave;
     - YOLI, una vez, a los 3 s: «...Ha entrado una pieza. ¡Y otra! ¡El CMS va!»;
     - **nombres a oscuras**: con `pecera_oscuras`, la línea de acción enseña `nameDark` si el objeto lo trae
       (ampliación pequeña de `engine/ui.js`, la etiqueta del hover). `ordenador_bruno` «algo que zumba»,
       `taza_abandonada` «algo pegajoso», `taza_no` «algo que dice que no», `kanban` «algo con pósits»,
       `coro_desarrollo` «tres sombras enfadadas», `yoli_tendencias` «alguien que cuenta»;
     - verbos con texto propio (opcionales, no son del camino): Mirar `monitor_yoli` «PUBLICADO. PUBLICADO. PUBLICADO.
       A oscuras, el CMS vuela.»; Hablar con Yoli «¡Chsss! Estoy contando. Diecisiete. Dieciocho.»; Hablar con/Empujar a
       Anselmo «No me deslumbres. Voy a mi enchufe.»; Coger `taza_no` D3: «No.»; cualquier otro Mirar «No veo nada.
       Solo el monitor de Yoli. Y a Yoli, pestañeando.»; **Usar enchufe** (enchufarlo él) acaba la ventana antes;
     - la ventana se cierra cuando llega Anselmo, cuando el jugador enchufa o a los 12 s (el `update` de `pecera`). Con
       `game.instant`, 0 ms.
   - **Cutscene de cierre**: Anselmo enchufa (`luzVuelve`), `pecera_oscuras` a `false`. ANSELMO «Ese enchufe está en mis
     sistemas. Desenchufar es un cambio sin revisar.» / YOLI «...Ya no va.» / BRUNO «Iba mientras estaba apagada.» /
     ANSELMO **«¿La quieres apagada? Pues mira la brida. Ese cable no acaba aquí.»** (sustituye a «¿Y si va sin
     pantalla? Peor…», que repetía su línea del árbol AN0).
   - Los apagones n = 2 y n = 3 siguen como hoy (opcionales). En n = 3 se quita «Y mira la brida…» (ya lo dijo la 1.ª).
3. **Mirar `enchufe_pantalla`** (las 2 líneas de hoy: «…Etiqueta de la brida: «R-3, SISTEMAS. PACO».») → pone
   `vio_brida_r3` (global, P0).
4. **Sistemas: el regletero.** El objeto `regleta_r3` (**se queda el id** para no romper pruebas) pasa a llamarse
   «regletero»: un panel de **cinco regletas** con brida y etiqueta (arte nuevo en `art/cpd.art.js`, el rect actual
   ampliado a unos 40 × 18 px):
   R-1 «NÓMINAS» · R-2 «ASCENSOR» · R-3, con un pósit de Paco encima que tapa la etiqueta · R-4 «GERTRUDIS» · R-5 «NO TOCAR
   NUNCA».
   - Mirar: «Cinco regletas: NÓMINAS, ASCENSOR, un pósit, GERTRUDIS y NO TOCAR NUNCA.» / «El pósit, con letra de Paco:
     "ni aunque lo diga el ticket 3".» Ahí está la **segunda pista independiente**, para quien leyó el registro.
   - Tirar / Usar → `api.choose(['R-1', 'R-2', 'R-3', 'R-4', 'R-5', 'Mejor no'])`. Sin `vio_brida_r3` ni `vio_ticket_3`,
     antes del menú, BRUNO: «Cinco regletas y ninguna dice "pantalla". Arriba, la brida tenía apellido.»
   - **Fallos con gag** (cada uno se vuelve a enchufar al momento; local `cpd_regleta_mal_n`):
     - R-1: PACO «Esa es la de las nóminas. Si la tocas, no cobra nadie. Tú tampoco.»
     - R-2: suena un «tin» triste por el hueco. Por la rejilla, antes de la estampida, CELESTINO «¡Ascensor parado en
       mitad de la jugada! ¡Tiempo muerto!»; después, TONI DIFERIDO «¿Hola? ¿Se me oye? Soy Toni, de Mercados. No sé en
       qué planta vivo.» (§5.2)
     - R-4: por la rejilla, GERTRUDIS «E-55: ME HAN DESENCHUFADO EN DIRECTO.»
     - R-5: BRUNO «Pone "NUNCA". Paco la mira con ternura. No la toco.» (no se tira)
   - **R-3** → `tirarRegleta` de hoy (`cpd.js:107-134`), menos la megafonía de Yoli «¡ESTAMOS CIEGOS!…» (ya se oyó en el
     apagón: −1) y «Ya me han abierto otro ticket para saber por qué.» de Paco (−1).
5. **Camino antiguo** (registro leído + Tirar el enchufe → Anselmo escribe la excepción): se queda como **segunda
   solución**. Es justo: quien lee el registro tiene otra puerta.

**(c) Pistas (`cms`)**
1. «La tele de tu abuelo no iba si él la miraba. Apágale algo a alguien.» (igual)
2. «Si te lo vuelven a enchufar, apágalo donde no lleguen. Sigue el cable.»
3. [«La etiqueta del cable dice cuál. Abajo, donde los enchufes de los ordenadores.», «Brida del enchufe: R-3.
   Sistemas: regletero, la R-3.»]

**(e) Cómo se prueba.** `test-e5` sin modo rápido: (1) Tirar enchufe → `pecera_oscuras`, `game.apagon` y Anselmo
andando; (2) durante la ventana, Mirar `monitor_yoli` → «A oscuras, el CMS vuela.»; (3) hover sobre `taza_no` →
«algo que dice que no»; (4) a los 12 s: luz, `apagon_n === 1`, la última línea de Anselmo, sin `cms_vivo`; (5) Usar
enchufe a los 2 s también cierra; (6) en el regletero, R-1, R-2 y R-4 no ponen `cms_vivo` y suben `cpd_regleta_mal_n`;
R-3 pone `cms_vivo`; (7) apuntar a Anselmo con el ratón no lo congela. Capturas `e5-apagon-1.png` (oscuridad con dos
focos) y `e5-regletero.png` (las cinco etiquetas se leen a 2×).

### 5.2 Mercados: nombre, rasgo, atasco jugable y adónde van

**(a) Diagnóstico.** `content/actors.js:435-452`: «Mercados 1/2/3». `sala_amazonas.js:516-525`: el atasco es una
cutscene de 900 ms con tres líneas. Crítica 3 §9.12 y crítica 4 §4.4: «Siguen sin nombre ni rasgo».

**(b) Diseño**
| id | Nombre (`name` en `actors.js`) | Rasgo | Mirar (sustituye `MERCADOS_MIRAR`) | Adónde va tras la estampida |
|---|---|---|---|---|
| `mercados_1` | **Severiano Plazo** | Le crece la barba con cada reunión (largo plazo) | «Severiano Plazo, de Mercados. Cuando empezó la reunión, era lampiño.» | Cola del microondas del Vending (ya existe; suelta el táper) |
| `mercados_2` | **Toni Diferido** | Todo le llega con retraso de señal; vive pendiente de «¿me veis la pantalla?» | «Toni Diferido, de Mercados. Todo le llega con tres segundos de retraso.» | **Encerrado en el ascensor**: el 1.er viaje tras la estampida, la cabina dice su línea en vez de la frase que toque (§5.1, R-2) |
| `mercados_3` | **Arsenio Prima** | De Bolsa y de Mercados: «doble prioridad». Vuelve a por el medio cruasán | «Arsenio Prima, de Bolsa y de Mercados. Doble cargo, doble prioridad.» | Detrás de los armarios de Sistemas: entrada nueva de la rejilla «(Detrás del armario 12) Chsss. Aquí no convoca nadie.» |

Los murmullos de hoy (l. 70) se reparten: «¿Me veis la pantalla?…» → Toni; «Que alguien pida sala para salir de la
sala.» → Arsenio; «Entramos cinco minutitos. En marzo.» → Severiano.

**El atasco jugable** (`reunionTerminada`, l. 516-525): el `enAtasco` de `api.estampida` ya no dura 900 ms. Encaja a los
tres en la puerta, pone `sala_amazonas_atasco` y **devuelve el control** (cierra la cutscene; el resto del guion se
ejecuta en `resolverAtasco(api, via)`). Mientras tanto, los murmullos de Mercados (`murmurs` con `sala_amazonas_atasco`)
dicen en bucle «¡Usted primero!» / «¡No, usted, que es de Bolsa!» / «¡Tengo doble prioridad!». Los botellines siguen en
el suelo. Cómo se resuelve (una línea cada vía, y solo se oye una):
- Empujar a cualquiera de los tres → BRUNO «Empujo un poco. Salen los tres de golpe. ¡Plop!»
- Usar `minicruasanes` con uno, o Coger `minicruasanes` → ARSENIO «¡Mi medio cruasán! ¡Tengo doble prioridad!»: se da la
  vuelta y los otros dos salen. El «plop» del cruasán de hoy (l. 533-546) pasa a ser esta vía.
- Hablar con uno → BRUNO «¿Y la próxima reunión, cuándo es?» → salen en desbandada.
- Usar la tele → GERTRUDIS «SE RUEGA SALIR POR ORDEN DE CARGO.» → se recolocan y salen.
- Nada en 10 s → el «¡Un momento! ¡Antes de salir, un anuncio de cinco segundos!» de Maripaz (ya existe) y salen.
Después, `resolverAtasco` sigue con lo de hoy desde la l. 530 (botellines, Gervasio levanta la sesión, «¿Usted no
huye?» y Maripaz). En modo rápido sale por la vía del anuncio.

**(e) Cómo se prueba.** En `test-e5`, las cinco vías: con cada una, `reunion_terminada`, Mercados fuera, una sola línea
de vía en el log. Sin errores si se sale de la Sala con el atasco abierto: `onEnter` lo resuelve por la vía del anuncio
antes de pintar.

### 5.3 (Acto III) La columna nueva
Ver §4. Es la tercera situación: un menú de columnas con fallos que tienen gracia y Anselmo borrando con la manga.

---

## 6. LOS 16 PASOS-PUZLE: DE «TE LO DICEN» A DEDUCCIÓN

Se cuentan los pasos del recorrido de hoy (`tools/walk-data.mjs`) que piden decidir algo. Quedan fuera los duelos y las
réplicas sueltas.

| # | Paso (hoy) | Sala | Hoy | Por qué | E5 | Cómo |
|---|---|---|---|---|---|---|
| 1 | 2 · chicle a Celestino | vestibulo | DICEN | se pide | DICEN | — (tutorial) |
| 2 | 5-7 · chicle + tarjeta + organigrama | vestibulo | DED | — | DED | — |
| 3 | 9-10 · chaqueta → Lector Medio | pecera/pajarera | DED | — | DED | — |
| 4 | 13 · Mirar mi ordenador sentado | pecera | DICEN | la meta lo dice | DICEN | — |
| 5 | 14 · saludar a Gertrudis | office | DICEN | Celestino y el pósit | DICEN | — |
| 6 | 16 · café a Aurora | catacumba | DICEN | cartel | DICEN | — |
| 7 | 19-20 · registro + regleta R-3 | cpd | DICEN | el ticket nombra la regleta | **DED** | §5.1: apagón → brida → regletero de cinco |
| 8 | 21 · manual del fax (opción a Paco) | cpd | DICEN | opción de menú con el tema | **DED** | ver abajo: Paco solo atiende números de ticket |
| 9 | 25 · siguientes pasos | sala | DICEN | Aurora dicta | **DED** | §1 |
| 10 | 27 · nota de gasto con azúcar | admin | DED | — | DED | — |
| 11 | 29 · copias rechazadas al fax | catacumba | DED | — | DED | — |
| 12 | 31 · dos fuentes a Aurora | catacumba | DED | dos papeles de dos plantas | DED | — |
| 13 | 32 · la coma de Evaristo a Aurora | catacumba | DICEN | la opción sale sola | DICEN | (posible E6: Evaristo da una fotocopia de la cláusula) |
| 14 | 35 · pieza al fax, tecla 2 | catacumba | DED | 26 % → la que recorta | DED | — |
| 15 | 37 · tirar papel continuo | cpd | DICEN | solo con la pista 3 (antipatrón) | DICEN (pero justo) | §2: ya invita; sigue siendo una acción |
| 16 | 39-40 · álbum + «salida en valor» | eventos/pecera | DICEN | menú con la réplica | **DED** | §4 |

**Hoy: 6 de deducción y 10 de «te lo dicen». Con E5: 10 y 6.** Se convierten **cuatro**: 7, 8, 9 y 16. El 15 deja de
ser una trampa.

**El paso 8, el manual del fax por número de ticket (sin recado nuevo):**
- (a) `cpd.js:178-182`: la opción «¿Sabes algo del fax de la Redacción de papel?» da el manual sin más.
- (b) Es el carácter de Paco: solo existe lo que tiene número («¿Viene con número de ticket? Pues no lo veo.»,
  `cpd.js:461`).
  1. `catacumba.js:671`, Mirar `fax` sin papel: se añade la segunda línea «Pegatina: «Mantenimiento: Sistemas. Ticket
     0.441».» y se pone `vio_pegatina_fax` (global, P0). Con papel también, una vez.
  2. `cpd.js` P1: la opción del fax pide `!paco_dio_manual`. Sin `vio_pegatina_fax`: PACO «¿El fax? ¿Qué ticket? Sin
     número no lo encuentro. Ni lo busco.» (no se da el manual). Con `vio_pegatina_fax` el texto de la opción es «Ticket
     0.441. El fax de Teodoro.», y la respuesta: «0.441. De 1999. Estado: lo respetamos. Ahí va el manual.» / «Página 9:
     la respuesta automática. Es mi mejor empleada.» Se quitan «Lo único de esta casa que contesta…» (que además gasta
     el tope de «lo único») y «…Posando.» (F6 de la crítica, la de las dos veces seguidas).
  3. `manual_fax`, Mirar (`items.js`): se queda «Lo demás son fotos del fax. Posando.» (la que se oye una vez).
- (c) Pistas: el `extra` de `firma` pasa a decir «El de los ordenadores no da nada sin número. Míralo en la máquina.».
- (e) `test-e5`: sin pegatina no hay manual; con ella, sí, y salen las dos líneas nuevas.

---

## 7. MENOS VIAJES (F3)

### 7.1 Atajos desde el ascensor, en todas las plantas
- (a) `content/lib/ascensor.js:85-115`: el menú lleva al rellano de cada planta (`goto(dest.room, 'ascensor')`).
  `content/lib/directorio.js` (tótem) solo está en la planta 1. El dueño **no** quiere atajos en el móvil.
- (b) `usarAscensor`, después de elegir planta y de los bloqueos:
  ```js
  import { destinos, etiqueta } from './directorio.js';
  const aqui = destinos(api).filter(d => d.planta === dest.n && d.room !== dest.room);   // ya pisadas, abiertas, otra sala
  let final = { room: dest.room, entry: 'ascensor' };
  if (aqui.length) {
    const j = await api.choose([`${dest.label.split(' · ')[0]} · rellano`, ...aqui.map(d => d.nombre)], { escape: 0 });
    if (j > 0) final = { room: aqui[j - 1].room, entry: aqui[j - 1].entry };
  }
  … cabina y frase igual … await api.goto(final.room, final.entry);
  ```
  - Valen todos los bloqueos de `destinoAbierto` (salas pisadas, el torno, la Sala solo en los Actos I-II, nada tras el
    empujón): **no deja saltarse ninguna escena**.
  - El submenú solo sale si hay a dónde ir (como mucho cuatro en la planta 1 y dos en la 2, sin flechas en el móvil).
  - Escape lleva al rellano: el uso de siempre no cambia. Cero líneas (la cabina dice su frase o el hito de Celestino,
    como hoy).
  - Lo que se ahorra en el recorrido: Sistemas → Redacción de papel, Sistemas → Despachos o Sala, Planta 2 → Redacción
    de papel y Planta 2 → Redacción (kanban) se hacen sin cruzar los 1.270 px. Son unos 6 cruces menos, de 10 a 15 s
    cada uno.
- (e) `test-critica3.mjs` (atajo): añadir el ascensor desde `cpd` → «Redacción de papel» → sala `catacumba` con entrada
  `pecera`; Escape → rellano; la Sala Amazonas no sale en el Acto III.

### 7.2 El doble clic que llega
- (a) `engine/core.js:1585`: el destino es el punto pulsado (`x + camX`). Como solo se puede pulsar dentro de la
  pantalla, correr se para en el borde. `engine/mover.js:19-25`: `isDouble` compara en coordenadas de pantalla, y la
  cámara se ha movido entre un clic y otro.
- (b) Tres cambios en `engine/mover.js` y uno en `core.js`:
  1. **Doble clic en la franja del borde** (≤ 28 px del borde izquierdo o derecho) en una sala con scroll, hacia ese
     lado: el destino pasa a ser la **siguiente parada** del mundo en esa dirección. Las paradas son las `walkTo` de los
     objetos que la sala marque con `parada: true` en el layout y, si no hay, el final del suelo andable. Redacción:
     `directorio_planta`, `pecera_a_catacumba`, `ordenador_bruno`, `monitor_yoli`, `herminia_portatil`, `kanban`,
     `ventana`. Despachos y Sistemas, sin paradas (el final del suelo).
  2. **Cámara adelantada al correr**: con `player.running`, el objetivo de la cámara se adelanta 60 px en la dirección
     de la marcha (`core.js`, cámara que sigue al jugador). Se ve hacia dónde se va.
  3. **`isDouble` en coordenadas de mundo** (`x + camX`, guardado en `L`). Así el segundo clic cuenta aunque la cámara
     se haya movido.
  4. **Doble clic sobre un objeto que no es salida**: Bruno corre hasta su `walkTo` y hace «Ir a» (o el verbo elegido).
     Hoy solo funciona con las salidas.
- (e) `test-motor.mjs`: (1) doble clic en x = 310 desde el núcleo de la Redacción → Bruno acaba en la parada siguiente
  (`monitor_yoli` o la que toque), no en camX + 310; (2) con la cámara moviéndose, dos clics a 300 ms siguen contando como
  doble; (3) doble clic sobre `kanban` → corre (`running`) y llega. `test-movil.mjs`: lo mismo con doble toque.

### 7.3 Orden de recados
El orden del Acto II ya cambia de planta lo justo (1 → −1 → 1 → 2 → 1). Con E5:
- el apagón va en la Redacción, de camino de Aurora (Papel, puerta vecina) al ascensor de Sistemas: no añade viaje;
- la pegatina del fax se mira en la Redacción de papel, en la misma visita que Aurora;
- la ida y vuelta Sala → Vending → Sala es por las puertas vecinas del núcleo (x 168 y 260): unos 30 s;
- en el Acto III, rotulador y álbum en la misma visita a la planta 2.
No se toca más el orden: no se gana ningún viaje sin romper la cadena de réplicas de D1.

---

## 8. LOTE PEQUEÑO

### F4 · Bruno recolocado sin transición
- (a) `pecera.escenas.js:54-66` `junto()`: si Bruno está a más de 150 px, fundido y `placeActor` (lo usan `viral`,
  `cmsEntrada`, `dosIAs`, `anexion` y E4 S5 `pecera_opa_ganadora`; llamadas desde `pecera.js:559-565`).
- (b) `junto(api, x, y, cam)` nuevo, cuando Bruno está lejos: (1) `api.cameraTo(cam)` con paneo visible (≤ 700 ms) hasta
  quien llama, que hace un gesto (`anim(quien,'reach',400)` y un `PLIN` o un `beep`); (2) `api.cameraFollow()`; (3)
  `await api.walkTo(x, y, { run: true })`. **Ampliación del motor**: `api.walkTo` acepta `{ run }` y lo pasa a
  `walkActor` (`engine/script.js:145`), que ya lo admite. Con la cámara adelantada (§7.2) se ve llegar a Bruno. Con
  `game.instant`, como hoy. El parámetro nuevo `quien` es Yoli para `viral`, `cmsEntrada` y S5, y Leoncio para
  `dosIAs` y `anexion`. Cero líneas.
- (e) `test-e5`: entrar desde el Vending con `cafetera_viral` pendiente → Bruno no cambia de x hasta que corre, la
  cámara pasa por x ≈ 700 y no hay fundido (`game.fade` sigue a 0). Captura del primer fotograma tras entrar.

### F8 · Puntos calientes pequeños en el móvil
- (a) `engine/core.js:779-805` ya tiene holgura: los objetos pequeños crecen hasta 16 × 12 al tacto. Pero **solo si el
  toque no cae en otro objeto**. La taza «NO» (13 × 14, sobre la mesa del coro), el monitor de Yoli (22 × 13, sobre su
  mesa), la tableta del corrector (14 × 12) y el teléfono rojo pierden contra el objeto grande de detrás. Además, 12 px
  virtuales en un teléfono horizontal son unos 23 px CSS: menos que un dedo.
- (b) En `pickAt` / `slopHits`, solo al tacto (`touchUI()`): (1) el mínimo sube a **20 × 16**; (2) si el objeto
  exacto es «grande» (más de 4 veces el área del pequeño crecido) y el toque cae en la caja crecida de un objeto pequeño,
  **gana el pequeño** (el de centro más cercano). Con ratón, nada cambia. `tools/geo-audit.mjs` añade una lista de
  objetos con caja efectiva menor de 20 × 16 al tacto o tapada por otro (aviso, no fallo).
- (e) `test-movil.mjs`: tocar el centro de `taza_no`, `monitor_yoli`, la tableta y `telefono_rojo` con un dedo simulado
  (pointerType touch) y desplazado 6 px → sale el objeto pequeño. Con ratón, el mismo punto desplazado da el de detrás.

### F9 · Custodia cierra tras cada pregunta
- (a) `pecera.secretaria.js:35, 48, 58-78`: `exit: true` en «¿Me da una libreta?», «¿Usted sabe dónde está todo?» y
  las cuatro de `CU_PARAQUE`.
- (b) Se cambian por `goto: 'CU0'` («¿Y cómo se consigue un boli aquí?» también: después vuelve al menú). Se quedan
  `exit` en «Nada, perdone.» y en `CU_DA` (que es el final del micropuzle). `once` donde ya lo había. Cero líneas.
- (e) `test-e5`: abrir Custodia, elegir tres opciones seguidas sin volver a hablar; el diálogo sigue abierto.

### N6 · Aurora comenta un RV que no se ha leído
- (a) `catacumba.js:851-853`: ambiente con `tadeo_rv_n ≥ 1`. Los RV llegan mudos al buzón (`lib/movil.js:12-20`).
- (b) Condición nueva: `['acto_2_iniciado', rvLeido]`, con `rvLeido = (api) => (Number(api.flag('movil_leidos')) & 0b11)
  !== 0 || (api.flag('portatil_tadeo_n') || 0) >= 1` (RV1 o RV2 leídos en el móvil, o el portátil de Tadeo mirado).
  Mejor aún, si se lee un RV de Tadeo **estando en la Redacción de papel** (`lib/movil.js`, al marcar leído; con
  `api.room === 'catacumba'`), Aurora dice el par en ese momento, por encima del hombro (`api.once('aurora_tadeo')`, el
  mismo `once` que el ambiente). Cero líneas.
- (e) `test-e5`: con `tadeo_rv_n = 2` y sin leer, en catacumba 3 min, no está la línea; leer RV1 allí, sí.

### N9 · Comillas « » dentro de « »
- (a) La crítica cita `content/duelo.js:19` (R09: `…aparte: «El contexto, explicado».`). En la fuente no hay ninguna
  cadena con « » anidadas: lo comprobé con un barrido de todas las cadenas de `content/` (0 casos). El anidamiento
  solo aparecía al **citar** la réplica, y eso ya lo resuelve `engine/font.js:201` `citar()`, que pasa las « » de
  dentro a “ ” (usado en `engine/duel.js:305` y en la libreta, `items.js:17`). **Está resuelto en pantalla.** Lo que la
  crítica vio es la fuente, no lo que sale en pantalla.
- (b) Pulido opcional: (1) escribir R09 con “ ” en la fuente para que una lectura estática no vuelva a marcarlo; (2) la
  fuente pinta “ ” como " (`ALIASES` de `font.js:137`). Si el dueño quiere la jerarquía de la RAE en pantalla, dos
  glifos nuevos de 3 × 3 para “ y ”.
- (e) Una regla en `text-audit --estatico`: ninguna cadena con « dentro de « (hoy, 0).

---

## 9. RECORRIDO NUEVO, SALDO DE LÍNEAS Y RELOJ

### 9.1 Recorrido para `tools/walk-data.mjs` (51 pasos; hoy, 44)
Las acciones van con el formato de hoy. «=» quiere decir igual que el paso antiguo entre paréntesis.

| n | Sala | Paso | Acciones | Espera |
|---:|---|---|---|---|
| 1-15 | — | = (1-15) | = | = |
| 16 | catacumba | = (16) café a Aurora | = | = (`aurora_conto_pasos`) |
| 17 | catacumba | = (17) | = | = |
| 18 | catacumba | = (18) | = | = |
| **19** | catacumba | Mirar fax (pegatina) | `['verbo','mirar','fax']` | `flags: ['vio_pegatina_fax']` |
| **20** | pecera | Tirar enchufe → apagón 1 | `['ir','pecera'], ['verbo','tirar','enchufe_pantalla']` | `flags: { apagon_n: 1, cms_vivo: false, pecera_oscuras: false }` |
| **21** | pecera | Mirar enchufe (brida R-3) | `['verbo','mirar','enchufe_pantalla']` | `flags: ['vio_brida_r3']` |
| **22** | cpd | Regletero → R-3 | `['ir','cpd'], ['verbo','tirar','regleta_r3'], ['opcion','R-3']` | `flags: ['cms_vivo']` |
| 23 | cpd | Paco → «Ticket 0.441. El fax de Teodoro.» (21) | `['verbo','hablar','paco_ticket'], ['opcion','Ticket 0.441. El fax de Teodoro.'], ['cerrar']` | `tiene: ['manual_fax']` |
| 24 | cpd | = (22) consultor | = | = |
| 25 | pecera | = (23) Yoli | = | = |
| 26 | pecera | = (24) Anselmo | = | = |
| **27** | sala_amazonas | Mirar orden del día | `['ir','sala_amazonas'], ['verbo','mirar','orden_del_dia']` | `flags: ['sala_amazonas_orden_visto']` |
| **28** | sala_amazonas | Gervasio → sin turno | `['verbo','hablar','gervasio_acta'], ['opcion','¿y cuáles son los siguientes pasos?'], ['cerrar']` | `flags: { sala_becario_sin_turno: true, reunion_terminada: false }` |
| **29** | office | Gertrudis → la pregunta | `['ir','office'], ['verbo','hablar','gertrudis'], ['opcion','¿Y cuáles son los siguientes pasos?'], ['cerrar']` | `flags: ['gertrudis_pregunta']` |
| **30** | sala_amazonas | Usar tele → estampida (atasco: vía del anuncio en modo rápido) | `['ir','sala_amazonas'], ['verbo','usar','tele_amazonas']` | `flags: ['reunion_terminada']` |
| 31 | sala_amazonas | = (26) D1 Maripaz | = | = |
| 32-41 | — | = (27-36) | = | = (41 → `acto_3_iniciado`) |
| 42 | cpd | = (37) Redacción (dos IAs) → tirar papel | = | = + log «NO TIRES DEL PAPEL» |
| 43 | cpd | = (38) Rubén, discursos | = | = |
| **44** | ecosistema | Coger termómetro → rotulador | `['ir','ecosistema'], ['verbo','coger','termometro_ventas']` | `tiene: ['rotulador_rojo']` |
| 45 | eventos | = (39) álbum | = | = |
| **46** | pecera | Álbum a Anselmo → pruebas sí, columna no | `['ir','pecera'], ['dar','album_eventos','anselmo_monolito'], ['cerrar']` | `flags: ['album_validado'], notiene: ['album_eventos']` (E4 S5 salta al entrar) |
| **47** | pecera | Rotulador + kanban → SALIDA EN VALOR | `['usar','rotulador_rojo','kanban'], ['opcion','SALIDA EN VALOR']` | `tiene: ['ticket_n1'], flags: { posit_descopeado: true, ruben_libre: true, columna_kanban: 'salida' }` |
| 48-51 | — | = (41-44) | = | = |

**ALT** (el orden alternativo de hoy, rehecho):
`[...range(1, 26), 32, 33, 27, 28, 29, 30, 31, 34, 38, 35, 36, 37, ...range(39, 43), 48, 44, 45, 46, 47, ...range(49, 51)]`.
Ojo: el 48 (D3) antes que el 44-47 vale, porque D3 no pide `ruben_libre`.

Cambios en `extras.mjs`: el que tira del papel en el Acto II (si lo hay) espera «desde dentro»; el del enchufe con
ticket (camino antiguo) sigue igual; extras nuevos XE5-1…5 con las vías del atasco, XE5-6 con los fallos del regletero,
XE5-7 con los fallos del kanban y XE5-8 con el ascensor con atajo. `fuzz.mjs`: la opción vieja de Gervasio ya no
estampa. `play-mouse.mjs`: los pasos 19-22, 27-30, 44 y 46-47.

### 9.2 Saldo de líneas del camino principal
Referencia: 553 de hoy + 8 de E4 = **561**. Tope: **576**.

| Punto | Añade | Quita | Neto |
|---|---:|---:|---:|
| 1 Estampida: Gervasio sin turno, Gertrudis, Toni, pregunta en la tele, una vía del atasco | 5 | 0 (dos sustituciones) | **+5** |
| 1 Mirar orden del día (dos líneas que ya existen, ahora en el camino) | 2 | 0 | **+2** |
| 5.1 Apagón 1 (6) + Mirar enchufe (2) − registro (5) | 8 | 5 | **+3** |
| 5.1 Regletero: fuera la megafonía de Yoli y una línea de Paco | 0 | 2 | **−2** |
| 6 Manual: pegatina (+1); Paco, de 4 a 2 (−2) | 1 | 2 | **−1** |
| 2 Armario: Bruno al entrar en el III + titular en `pecera_dos_ias` | 2 | 0 | **+2** |
| 4 Columna: Maripaz (rotulador), Anselmo «columna no hay» y «¿Con qué…? De fuera» (la vía 3 sustituye) | 3 | 0 | **+3** |
| 3 Celestino a los 9 s (cuenta en una partida real; el recorrido automático no espera) | 1 | 0 | **+1** |
| **Total** | | | **+13 → 574** |

Margen: 2 líneas. Si hace falta más, en este orden: la línea de Toni «¡Se ve!» (−1), el titular de `pecera_dos_ias`
(−1; queda la entrada en Sistemas) y la 2.ª línea del orden del día (−1; el punto 3 ya se lee en la 1.ª).

### 9.3 Reloj estimado (jugador fluido)
| | Tiempo |
|---|---:|
| Texto nuevo (13 líneas × ~2,8 s, con la fórmula del motor) | +0,6 min |
| Ventana a oscuras, regletero, mirar pegatina y enchufe | +0,5 min |
| Ida y vuelta Sala-Vending + atasco | +0,7 min |
| Rotulador + kanban (sin pensar) | +0,7 min |
| Pensar los puzles nuevos (estampida 1-2 min, columna 1-2 min, regleta 0,5 min) | +2,5 a +4,5 min |
| Atajos del ascensor (~6 cruces) y doble clic | −1,5 a −2 min |
| Registro (ya no hace falta) | −0,2 min |
| **Neto** | **≈ +2 a +4 min** (de 100-120 a ≈ 103-124) |

Acto III por separado: entre +1 y +3 min (lo que se pedía: 3-4 como máximo).

---

## 10. RIESGOS
1. **Estampida que no se ve venir**: si el jugador no relaciona «los conectados» con Gertrudis, se atasca en el mejor
   gag. Hay redundancia: la meta nueva, los niveles 1-2 de la abuela, el piloto verde de la tele y el «¿Me veis la
   pantalla?» de Toni. Hay que probarlo a ciegas con alguien que no haya jugado.
2. **Gertrudis «agotada» o «sin público»** (`office_agotada`, E-53): la opción nueva tiene que ganar a esos estados.
   Está cubierto en la prueba 1(e)6.
3. **La ventana a oscuras y `Mov.frozen`**: si el jugador apunta a Anselmo, hoy Anselmo se queda quieto
   (`engine/mover.js:66-72`). Hace falta `noFreeze` y el tope de 12 s. Si no, puede no volver la luz.
4. **Atasco jugable y salir de la sala**: `onEnter` tiene que resolverlo. Hay que probar guardar y cargar con
   `sala_amazonas_atasco` puesto (la regla: no se guarda; al cargar, `resolverAtasco('anuncio')` en modo silencioso).
5. **Saldo justo** (+13 de 15). Si el guionista de texto añade algo en el camino principal, hay que compensar
   (§9.2).
6. **Pruebas que se rompen** (a propósito): `walk-data`, `walkthrough`, `extras`, `fuzz`, `play-mouse`, `test-fase0`
   (estampida), `test-comedia-p1` (armario y regleta), `test-comedia-p2` (Anselmo `AN_ALBUM`), `test-comedia-p3` (Paco y
   el manual), `test-comedia-p4` (Sala), `test-critica3` (atajo). Hay que ponerlas al día en el mismo cambio.
7. **El motor se toca** (`engine/*` está vedado a los autores de sala): `walkTo({ run })`, focos que siguen a un actor,
   `nameDark`, holgura táctil y el doble clic. Son cinco cambios pequeños y aislados. Lo tiene que aprobar el dueño o
   hacerlo el integrador.
8. **E4**: `junto()` cambia para S5. La fila del armario en la hoja III y el titular en `pecera_dos_ias` conviven con la
   ráfaga y el titulador sin tocarlos.
9. **Que Maripaz entre en Desarrollo**: solo entra su rotulador y una palabra en micro. Maripaz no pisa la Redacción,
   así que no hay conflicto con «en Desarrollo solo Anselmo y el coro».
10. **Arte**: el regletero (40 × 18 a 2× y legible), la tele con Gertrudis y la columna del kanban son lo más caro. Si no
    da tiempo, el regletero puede ser un plano detalle (`api.detalle`) con las cinco etiquetas, sin cambiar la sala.

## 11. ORDEN DE RECORTE (más impacto por menos coste, primero)
1. **F2, señal tras el clímax** (§3): alto impacto, coste mínimo.
2. **F1, armario 27** (§2): alto, mínimo.
3. **F9 Custodia + N6 Aurora** (§8): bajo, casi gratis.
4. **F4 `junto()` sin teletransporte** (§8): medio, bajo.
5. **El manual por número de ticket** (§6): medio, bajo.
6. **Atajos del ascensor** (§7.1): alto, bajo (reutiliza el directorio).
7. **Estampida con Gertrudis y la tele** (§1): muy alto, medio.
8. **La columna nueva del kanban** (§4): alto, medio.
9. **El doble clic hasta la parada** (§7.2): medio-alto, medio (motor).
10. **Mercados con nombre + atasco jugable** (§5.2): medio, medio. Los nombres solos cuestan 0 y van siempre.
11. **Apagón jugable + regletero** (§5.1): alto, alto (arte y motor). Versión barata: el apagón 1 en el camino
    principal sin ventana jugable, más el regletero como plano detalle.
12. **F8 táctil** (§8): medio, medio.
13. **N9**: nada que hacer (pulido opcional).

## 12. DECISIONES QUE TIENE QUE TOMAR EL DUEÑO
1. **Estampida: ¿la de Gertrudis por la tele (A) o la del banner de Maripaz (C)?** La A cuesta una ida y vuelta de unos
   30 s por la planta 1 y es la que propone el crítico. Recomiendo la A.
2. **¿El apagón en el camino principal, y el ticket 3 sin nombrar la regleta?** Cambia una pista que existía (el
   registro deja de ser la vía principal) y pide arte nuevo (el regletero).
3. **¿El rotulador de Maripaz en el tablero de Anselmo?** Es un objeto de Comercial que acaba en Desarrollo, y Anselmo
   lo acepta porque «la frase la escribió Rubén, que tenía alta». Toca la regla de la casa de «de fuera / de dentro».
4. **Recorrido de 51 pasos** (hoy 44) y saldo de +13 líneas (de 15).
5. **Celestino por megafonía antes de la tele del empujón**: adelanta su voz unos segundos. La imagen sigue siendo la
   paga.
6. **Nombres de Mercados**: Severiano Plazo, Toni Diferido y Arsenio Prima.
7. **Titular al revés en el monitor de Yoli** («…NO TIRES DEL PAPEL: ES MI BORRADOR»): ¿invitación justa o demasiado
   directa? Si es demasiado, se queda solo la línea de Bruno al entrar en Sistemas.
8. **Permiso para cinco cambios pequeños en `engine/*`** (§10.7).
