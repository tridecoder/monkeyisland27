# FE DE ERRATAS · Reescritura de comedia — Propuesta de ESTRUCTURA

**Writers' room, silla de estructura y puzles** · 13-11-2026 · Documento de trabajo para dirección y para las otras
dos sillas. Lo que aquí se propone afecta al grafo de puzles, al reparto y a la puesta en escena. Las líneas de diálogo
que escribo son de estructura (las que hacen que un puzle sea un chiste); el pulido de voz fino es de la silla de
diálogo. Ninguna línea hablada pasa de 80 caracteres. Nada de lo que aquí hay está implementado.

---

## Resumen en una página

- **Lo que de verdad cansa del Acto II** no son los tres objetivos en paralelo, sino que **ninguno se resuelve donde se
  plantea** y que hay un **cuarto objetivo escondido** (el CMS) que bloquea a dos de los tres. Medido: 24 cambios de sala
  en el Acto II; **15 de ellos (63 %) son recados, repeticiones o un candado de permiso**.
- **Propuesta:** cada objetivo se resuelve en **una sola escena-situación**: la reunión acaba y Maripaz se queda sentada
  encima del planillo (el duelo es allí mismo); el CMS se arregla bajando a Sistemas, donde está Paco; Gertrudis suelta los
  cuatro chismes de golpe; el recorte del 26 % viaja por fax; la baja de Rubén se consigue con la frase de despedir de
  Íñigo y el ticket sube solo en el ascensor; Gervasio guarda la puerta de la Sala.
- **Resultado:** el walkthrough pasa de **46 pasos y 42 cambios de sala** (41 según el crítico) a **44 pasos y 28
  cambios**; el Acto II, de **24 a 14** (−42 %). Los cuatro puzles con «¡ajá!» siguen intactos en su lógica.
- **Reparto:** de 24 voces a 17 con nombre. Se van Leoncio, Anselmo y Borja; Herminia pasa a objeto; Anselmo se funde en
  Nemesio; Valentín queda en un solo intercambio; Custodia y Tadeo se quedan como presencias opcionales y recortadas. Los
  nueve guiños de la casa siguen vivos en forma mínima, y tres de ellos pasan a estar **dentro** del camino crítico.
- **Objetivo siempre claro:** la ficha de la página 7 como lista viva, «Mirar a Bruno» dice la meta, el Titulator anuncia
  solo tus hazañas al pasar, el móvil marca la hora por hitos y **la abuela da tres niveles de pista por objetivo**,
  eligiendo el objetivo de la sala donde estás (57 pistas escritas en §D.5).
- **Duelo:** el ataque se queda escrito en la ventana, el menú tiene como mucho 5 líneas, los rivales parafrasean (hay que
  entender, no reconocer), cada fallo añade a alguien al CC, cada duelo tiene remate con objeto y **perder tiene una
  escena de consecuencia cómica propia** y una ayuda pequeña para la revancha.
- **Final:** termina en la abuela («¡Me ha contestado el periódico!») y en la fe de erratas como última imagen. Fuera «Diseño
  soy yo», fuera los créditos para Diseño, fuera el poscréditos; Ramírez y la impresora pasan dentro.

---

## A. Diagnóstico estructural (datos propios)

### A.1 Cómo he medido

- **Cambios de sala:** búsqueda en anchura sobre el grafo real de salidas (`exit:` de cada sala) más el ascensor (una
  arista entre cualquier par de las cuatro plantas con botonera, `content/lib/ascensor.js`), aplicada a los `['ir', sala]`
  de `tools/walk-data.mjs` en orden, más la puerta de la Sala del paso 44. Es el mismo grafo que recorre
  `tools/walk-lib.mjs:38`.
- **Líneas y tiempo por personaje:** he jugado el walkthrough de 46 pasos con Playwright en modo rápido y he volcado
  `__game.log` (cada `speak` del motor, `engine/core.js:566`) paso a paso. Tiempo = fórmula del motor
  `max(1100, 900 + 55·caracteres)` ms (`engine/core.js:560`). El modo rápido no dispara los ambientes temporizados, así que
  el coro de Desarrollo sale con menos líneas que en la medición del crítico (9 frente a 33); el resto cuadra con él.
- **Hotspots y reparto por sala:** `__game.game.content.rooms` en el navegador.
- **Líneas fuera del camino:** el corpus del crítico (`docs/informes/critica/datos/corpus_lineas.json`, 2.930 líneas) por
  rangos de archivo:línea de cada subtrama.

### A.2 Cambios de sala por acto (solución actual)

| Acto | Pasos | Cambios (mío) | Cambios (crítico) | Entradas en la Redacción |
|---|---|---:|---:|---:|
| I | 1-16 | 6 | 6 | 3 |
| II | 17-37 | **24** | 24 | **9** |
| III | 38-46 | 12 | 11 | 4 |
| **Total** | 46 | **42** | 41 | 16 |

La diferencia en el III es la puerta de la Sala Amazonas del paso 44, que yo cuento como cambio.

### A.3 El Acto II, paso a paso

| Paso | Acción | Cambios | Tipo |
|---:|---|---:|---|
| 17-19 | Aurora (rep_02, fax), fax enmarcado | 0 | avance en sitio |
| 20 | Gertrudis «Buenas noches» ×3 | 2 | **repetición** (la misma opción tres veces) |
| 21 | Mirar registro de tickets (Sistemas) | 2 | **candado de permiso** (ida) |
| 22 | Tirar del enchufe (Redacción) | 1 | candado (vuelta) |
| 23-24 | Yoli rep_08, Nemesio rep_09 | 0 | avance en sitio |
| 25-26 | Paco: manual y rep_12 (Sistemas) | 1 | **viaje de información** (otra vez a Sistemas) |
| 27-28 | «Siguientes pasos», planillo | 3 | escena + recogida |
| 29 | Dar planillo a Maripaz → D1 | 3 | **recado** (Sala → planta 2) |
| 30 | Nota de gasto (Administración) | 1 | escena (la mejor del juego) |
| 31-33 | Copias al fax, dos fuentes | 3 | escena |
| 34 | Escribir la pieza | 1 | avance |
| 35 | D2 Teodoro | 1 | escena |
| 36 | Dar pieza a Begoña | 3 | **recado** (Redacción de papel → planta 2) |
| 37 | Dar ficha a Teodoro | 3 | **recado de vuelta** |

**15 de los 24 cambios del Acto II (63 %) son recado, repetición, candado o viaje de información.** En todo el juego, 11
de 46 pasos (24 %) son de ese tipo y concentran **22 de los 42 cambios (52 %)**: en el Acto III, la cadena álbum → Nemesio
→ pósit → Paco (pasos 40-42, 5 cambios) y «buscar a Gervasio al Vending» (paso 43, 2 cambios).

**Patrón:** todos los recados del Acto II nacen de que **el obstáculo y su solución viven en plantas distintas**: el hueco
se libera en la Sala Amazonas (planta 1) pero lo firma Maripaz (planta 2); la fuente nace en Administración (planta 2) pero
se cierra en la Redacción de papel (planta 1), y el recorte vuelve a subir a la planta 2. Administración se visita dos
veces (8 cambios entre ida y vuelta) y Sistemas otras dos.

### A.4 La Redacción

- 1.270 px, **26 objetos + 7 PNJ + 6 salidas** (39 cosas clicables). Del camino crítico solo salen **5**: la chaqueta, el
  ordenador de Bruno, el enchufe, Yoli y Nemesio (15 %).
- Posiciones reales (`content/rooms/art/pecera.art.js:1014-1068`, con el desplazamiento de 410 px de
  `content/lib/edificio.js:105`): núcleo y puertas a la izquierda (0-560); la mesa de Bruno y Yoli hacia x 720-790;
  Infografía 798-890; Nemesio en x 1.008 y el coro en 1.028-1.080; Diseño y Valentín 1.094-1.270.
- **El dato que importa:** el camino crítico obliga dos veces a ir hasta x 1.008 (Nemesio, pasos 24 y 41). Los últimos
  260 px no sirven para nada del camino. El problema no es solo el largo de la sala: es que **lo imprescindible está
  desperdigado** y lo prescindible (coro, Diseño) está en medio de un trayecto obligatorio.

### A.5 Reparto en el camino crítico (sin ambientes)

| Personaje | Líneas | Segundos | % del tiempo de lectura |
|---|---:|---:|---:|
| Bruno | 156 | 466 | 26,7 |
| Íñigo | 44 | 146 | 8,4 |
| Aurora | 32 | 115 | 6,6 |
| Rubén | 30 | 101 | 5,8 |
| Begoña | 29 | 96 | 5,5 |
| Teodoro (fax + voz) | 25 | 90 | 5,2 |
| Yoli | 22 | 81 | 4,6 |
| Paco | 22 | 76 | 4,3 |
| Evaristo (llamadas) | 22 | 75 | 4,3 |
| Celestino | 24 | 72 | 4,1 |
| Gervasio | 20 | 66 | 3,8 |
| Nemesio | 17 | 62 | 3,6 |
| Gertrudis | 12 | 44 | 2,5 |
| Abuela | 11 | 40 | 2,3 |
| Maripaz | 12 | 39 | 2,2 |
| Pilar | 7 | 28 | 1,6 |
| Tadeo | 5 | 22 | 1,2 |
| Coro de Desarrollo | 9 | 21 | 1,2 (6 de las 9, en el epílogo) |
| Borja | 2 | 7 | 0,4 |
| Ramírez | 1 | 2 | 0,1 |
| **Leoncio, Anselmo, Valentín, Custodia, Herminia** | **0** | **0** | **0** |

Total de lectura medido: 29,1 min. **El último texto del coro en el camino crítico es «Enhorabuena, Diseño»**, y la última
frase del juego antes de los créditos es de Bruno sobre Diseño (`content/escenas/final.js:178-187`).

### A.6 Lo que vive fuera del camino

| Subtrama | Líneas en el corpus | En el camino |
|---|---:|---:|
| Coro de Desarrollo (13 discusiones, 4 «de fondo», árbol, hotspots) | 120 | 9 |
| Custodia (Secretaría) | 108 | 0 |
| Anselmo (árbol, frontera, pantalla) | 81 | 0 |
| Tadeo (portátil, asistente, RV) | 60 | 5 |
| Valentín (árbol, monitor, bandeja) | 57 | 0 |
| Leoncio + Herminia | 47 | 0 |
| **Suma de las subtramas «de la casa»** | **473 (16 % del corpus)** | **14** |
| Eventos (sala + Pilar) | 244 | 7 |

En todo el juego hay 122 objetos con hotspot (sin contar salidas); el camino crítico usa 14 (11 %). Eventos usa uno
(Pilar) de 18, y no me importa: es una sala de recreo que dirección protege. Lo que sí importa es que **la sala nudo, la
Redacción, tenga su 85 % de hotspots en subtramas que no tocan la historia**.

Menciones de «Diseño» en el corpus: **46** (16 en `pecera.js`, 13 en `pecera.dialogos.js`, 6 en `final.js`, 3 en
`vestibulo.js`, 3 en `duelo.js`, el resto sueltas).

### A.7 Dónde coincido con el crítico y dónde no

**Coincido** en: el Acto II es el problema; la abuela es plana (y añado la causa: `content/game.js:76` devuelve la primera
pista de una lista fija, así que en el Acto II, si la silla quedó pendiente, insiste en la silla aunque estés en la planta
2); el duelo es reconocimiento 1:1; el coro y Valentín son ruido; el final se lo lleva Diseño; Leoncio, Anselmo y Herminia
son una subtrama completa que no toca la historia.

**No coincido, o matizo:**

1. **Tres objetivos en paralelo no son el problema.** Son la mejor idea estructural del juego («Hueco, Fuente, Firma» se
   entiende y se recuerda). El problema es que cada uno exige cruzar el edificio dos veces y que hay un cuarto objetivo
   oculto (el CMS) del que dependen Yoli, Nemesio y Paco, y por tanto D1 y D2. Lo arreglo haciendo cada objetivo local, no
   quitando objetivos.
2. **La Redacción no hay que partirla en dos salas.** Basta con que todo lo imprescindible quede antes de x 900 (mover a
   Nemesio es un dato de `layout`, no arte nuevo) y con salidas de doble clic. Acortarla a ~1.000 px es una segunda fase.
3. **Nemesio no es olvidable: es estructural.** Es la llave de la baja de Rubén. Le falta voz, no peso. Absorbe a Anselmo.
4. **Custodia se queda**, opcional y sin oráculo: su escena del boli muerto es de las más graciosas y cuesta poco. Lo que
   sobra es su segunda función de pistas (`CU_DONDE`).
5. **El café de Gertrudis (P2, «trivial») se queda trivial.** Es el puzle tutorial del Acto I. Lo que cambio es lo que pasa
   después de resolverlo (§F2).
6. **El duelo no necesita más asaltos**: tres aciertos más un remate con objeto en cada duelo basta, si el ataque se lee y
   hay que entenderlo. Lo que sí falta es que perder signifique algo.
7. Cuento 42 cambios y no 41: la puerta de la Sala Amazonas en el paso 44 es un cambio de sala.

---

## B. Plan de reparto

### B.1 Todos los personajes con voz

| Personaje (id) | Decisión | Motivo | Qué se conserva | Coste |
|---|---|---|---|---|
| Bruno (`bruno`) | **Se queda** | Protagonista. | — | — |
| Celestino (`celestino`) | **Se queda** | Abre y cierra; «¿Tú eres el nuevo?» es el mejor running gag. | Ibex narrado como fútbol. | — |
| Abuela Remedios (`abuela_remedios`) | **Se queda, crece** | Corazón del juego y sistema de pistas. | Todo; pistas nuevas (§D.5). | `game.js` `pistas` (M). |
| Íñigo (`inigo_sinergia`) | **Se queda** | Villano. Le doy dos líneas propias y que su eufemismo libere a Rubén (§F4). | Matriz, pósit rosa, 247. | Datos. |
| Yoli (`yoli_tendencias`) | **Se queda** | Rep_08; reacción al CMS. | Autocompletado de buscador como marca de voz. | — |
| Nemesio (`nerea_backlog`) | **Se queda y absorbe a Anselmo** | Llave de la baja de Rubén. | Las 4 mejores líneas de Anselmo (B.3). | Árbol `nerea` (M). |
| Teodoro (`teodoro_cuerpodoce`) | **Se queda** | Habla por fax: la voz más reconocible. | Todo. | — |
| Aurora (`aurora_galerada`) | **Se queda** | Da los objetivos. | Todo. Su monólogo absorbe «¿Cómo convenzo a Teodoro?». | `catacumba.js` A_CAFE (S). |
| Gertrudis (`gertrudis`) | **Se queda** | Café y chismes. | Escena nueva del torrente (§F2). | `office.js` (S). |
| Gervasio (`gervasio_acta`) | **Se queda; en el Acto III guarda la puerta de la Sala** | Quita el viaje al Vending. | «Lo hablamos» pasa a ser **solo suyo**. | `pajarera.js`, `office.js` (M). |
| Begoña (`begona_triplicado`) | **Se queda** | La mejor escena del juego. Gana voz por fax (§F5). | Todo. | — |
| Evaristo (`evaristo_salvedad`) | **Se queda** | El guiño que mejor se integra. | Llamadas L1-L5, clímax A/B; MP2 se cierra por llamada. | `administracion.dialogos.js`, `game.js` (S). |
| Maripaz (`maripaz_remitido`) | **Se queda; en el Acto II está en la reunión** | El duelo D1 pasa a la Sala Amazonas (§F1). | Patrocina todo; absorbe el rumor de Borja. | `sala_amazonas.js`, arte de la Sala (M). |
| Borja (`borja_engagement`) | **Se va** | 2 líneas en el camino; su función era decir «descopear», que desaparece. | Su rumor A3 pasa a Maripaz; su chiste de marketing queda en el embudo y la pizarra. | Actor, árbol, `borjaSeAsoma` (M). |
| Pilar (`pilar_escaleta`) | **Se queda (protegida)** | Eventos gusta mucho. | Todo; presta el álbum sin que entre Borja. | `eventos.dialogos.js:20-36` (S). |
| Paco (`paco_ticket`) | **Se queda** | Sistemas; el CMS se arregla en su sala. | Registro con 3 tickets; «nunca subo». | `cpd.js` (M). |
| Rubén (`ruben`) | **Se queda** | El giro. | Todo. | — |
| Lector Medio (`lector_medio`) | **Se queda** | Objeto con grabación; clímax. | Todo. | — |
| Ramírez (`ramirez`) | **Se queda; del poscréditos al epílogo** | El final termina en la abuela. | «¿Me he perdido algo?». | `final.js` (S). |
| Leoncio (`leoncio_quesitos`) | **Se va** | 0 líneas en el camino; su subtrama no toca la historia. | Su mesa vacía con chaqueta; tres líneas reasignadas (B.3). | Actor, árbol, MP1 (M). |
| Herminia (`herminia`, `herminia_portatil`) | **Pasa a objeto** | Se fue Infografía a las 18:30; su herramienta no. | Portátil con voz en rótulos; contesta R15 en el hilo de Tadeo. | Hotspot (S). |
| Anselmo (`anselmo_monolito`) | **Se funde en Nemesio** | 0 líneas en el camino. | «Peor. Si funciona, la gente se acostumbra.»; la pantalla de acceso. | Actor, árbol, frontera (M). |
| Valentín (`valentin_reticula`) | **Cameo de un intercambio** | Dedicatoria; autoelogio; destripa el giro. | Mirar + Hablar de 3 líneas, sin árbol, chiste a su costa. | Árbol, monitor (S). |
| Custodia (`custodia_precinto`) | **Se queda, opcional y sin oráculo** | Funciona como escena; sobra como segundo sistema de pistas. | MP3 entero; fuera `CU_DONDE`. | `pecera.secretaria.js` (S). |
| Tadeo (`tadeo_adjunto`) | **Voz de objeto** | Ya lo es; sobra jerga. | Portátil (4 mensajes), 3 RV, asistente con 3 opciones. | `ecosistema.js`, `lib/movil.js` (S). |
| Coro DEV 1-3 (`coro_desarrollo`) | **Figurantes, a un tercio** | Ruido. | 4 discusiones, árbol de 3 opciones, dos «¡Ha sido Diseño!» con escena. | `pecera.js:46-84, 493-497` (S). |
| Redactores de Mercados (`figurantes_mercados`) | **Se quedan y ganan escena** | Son la estampida (§F1). | — | Datos. |
| Voces de objeto (torno, altavoz, Titulator, fax, walkie, proyector, armario 27) | **Se quedan** | Baratas y graciosas. | El altavoz del Ibex se queda: es de Celestino. | — |

**Quedan 17 personajes con nombre y voz** (contando a Custodia, Tadeo y Valentín como presencias), frente a 24.

### B.2 Una voz por personaje (regla para la silla de diálogo)

Cada personaje tiene **una manera de ver el mundo** y **un recurso verbal** que nadie más usa. Las muletillas compartidas
se reparten: «Lo hablamos» es solo de Gervasio; «cariño», como mucho una vez por escena de Maripaz; «Me lo apunto», solo
cuando Bruno aprende una réplica.

| Personaje | Ve el mundo como… | Recurso verbal propio | Ejemplo |
|---|---|---|---|
| Celestino | un partido de fútbol | narra en directo | «¡Hidrovoltia se lanza a por el Robledal! ¡Eso es opa, árbitro!» |
| Yoli | una barra de búsqueda | autocompleta lo que dice | «Bruno, Bruno becario, becario sin silla, silla gratis cerca de mí.» |
| Nemesio | un tablero kanban | clasifica todo en columnas | «Eso, a BLOQUEADO. Tú, a EN CURSO. El café, a HECHO (PERO NO).» |
| Teodoro | una página por medir | cuenta caracteres | «Bruno Pellejo. Trece con espacios. Cabe.» |
| Aurora | un texto por corregir | corrige lo que acabas de decir | «Se dice "detrás de mí", criatura. Y siéntate. Bueno, no hay silla.» |
| Gertrudis | una deuda de modales | códigos de error y rencor | «E-49: YA SÉ QUE ERES TÚ OTRA VEZ.» |
| Gervasio | algo que delegar | delega hasta la frase | «Eso lo terminas tú, que tienes la frase más limpia.» |
| Begoña | un procedimiento | hora exacta y triplicado | «Son las 19:07. Le quedan ocho minutos de existencia administrativa.» |
| Evaristo | una coma fuera de sitio | «Una cosita» y «Era solo eso» | «Una cosita. Muy pequeña. Era solo eso.» |
| Maripaz | un espacio publicitario | patrocina cada frase | «Este silencio te lo patrocina Colchones Siestatón.» |
| Pilar | una cuenta atrás | todo está a cinco minutos | «¡Acreditado! Empezamos en cinco minutos.» |
| Paco | un ticket | numera todo; nunca sube | «Tu problema ya tiene número: el 48.212.» |
| Rubén | un titular de clic | se le escapan titulares | «SEGUIREMOS INFORMANDO. Perdón. Se me escapa.» |
| Íñigo | una matriz 2x2 | verbos de consultoría | «No os despido: os desapalanco del organigrama.» |
| Abuela | un nieto sin comer | no escucha y abriga | «¿Has comido? Se te nota en la voz que no has comido.» |
| Custodia | una sentencia | pregunta sin interrogación | «¿Para qué.» |

Dos líneas nuevas propias para Íñigo (le faltaban): en los `hurt` de D4, «Eso no estaba en mi matriz. Voy a necesitar una
tercera dimensión.»; y en los Despachos, al Mirarle en el Acto II, «Yo no despido a nadie. Lo decide la hoja de cálculo.
Yo solo la leo en voz alta.» (esta última, como dos globos).

### B.3 Los guiños de la casa en forma mínima

| # | Guiño (petición de dirección) | Hoy | Forma mínima propuesta | ¿En el camino? |
|---|---|---|---|---|
| 1 | Infografía con IA contra Desarrollo | Leoncio, Herminia, Anselmo, cinta que avanza, MP1 de 4 pasos | **Tres piezas:** (a) en el registro de Paco, *Ticket nº 2: «Alta herramienta Herminia (Infografía)». Denegado. Motivo: «No ha pasado por Desarrollo». Firmado: Nemesio*, justo debajo del ticket de Rubén, pendiente desde julio (§F3); (b) la pantalla de Desarrollo, «ACCESO DENEGADO: HERMINIA / ACCESO CONCEDIDO: TITULATOR 3000 (USUARIO INTERNO)»; (c) el portátil de Herminia en la mesa vacía de Infografía, con su chaqueta delante. Nemesio dice la mejor de Anselmo si le preguntas: «Peor. Si funciona, la gente se acostumbra.» | **Sí** (a): se lee en Sistemas para arreglar el CMS. |
| 2 | El de negocio que reenvía lo que dice la IA | Tadeo: 9 mensajes con LCP y CWV, asistente de 6 opciones, 5 RV | Portátil con 4 mensajes **sin siglas** («La IA dice que lo más pesado de la web es el logo. Propongo quitar el logo»), asistente de 3 opciones, 3 RV. R15 se aprende en su hilo y **contesta Herminia**: el guiño 1 le responde al 2. El último RV («AYÚDAME ESTOY EN EL ARMARIO 27») sigue siendo pista del Acto III. | Sí (el RV del armario). |
| 3 | Controlling y la última coma | Evaristo, MP2 con ida y vuelta | Igual, pero MP2 se cierra **por teléfono**: tras hablar con Aurora, Evaristo llama él (§C.5). Sin viaje de vuelta. | Llamadas, sí. |
| 4 | Desarrolladores ruidosos que culpan a Diseño | 13 discusiones cada 14-24 s, árbol de 8 opciones, bandeja, Valentín, epílogo, créditos | **Un tercio:** 4 discusiones (una sola sobre Diseño) cada 60-120 s, máx. 3 por visita, nunca con otro globo; árbol de 3 opciones; los dos «¡Ha sido Diseño!» con escena (7.2 y el CMS, ahora por la rejilla); la bandeja, un solo Mirar; *Ticket nº 3: reportado por Diseño y Producto, 2017*. ~14 menciones de «Diseño» en todo el juego, frente a 46. | Sí (7.2 y CMS). |
| 5 | La secretaria temible | Custodia: 108 líneas, MP3 + oráculo | MP3 entero («Boli muerto, boli nuevo… Ya ha firmado. Ya lo ha usado. Devuélvamelo.»); fuera `CU_DONDE`; su saludo secreto a Gertrudis por la rejilla se queda. | No (opcional). |
| 6 | Guerra de salas | Reserva de Ramírez, carteles, tele de 5 entradas, proyector en la 247 | Proyector 247/248 (es del clímax), hoja de reservas, carteles; la tele baja a 3 entradas (fuera la de Herminia). | Sí (247). |
| 7 | Rumores | 4 cadenas (A firma, B atún, C Teodoro, D plaza) | **2 cadenas:** A (paga en la abuela: «Si lo dice mucha gente, sale») y C (paga en «ESTOY MAQUETADO»). Fuera B (el atún ya lo cuenta Evaristo) y D. El paso de Borja en A lo dice Maripaz. | No. |
| 8 | Plazas de garaje | Cuadro, porra, piel de plátano, yunque, floja de la salud, rumor D, remate de la plaza 1 | Todo salvo el rumor D. El remate de la plaza 1 se acorta (§G). | Remate, sí. |
| 9 | Eventos (protegido) | Sala propia, Pilar, álbum, silla 113, croqueta | **Intacto.** Solo se va Borja de la escena del álbum. Los créditos acaban en Eventos y de ahí a la fe de erratas (§G). | Sí (álbum). |
| — | Cameo de Valentín | Árbol de 8 opciones, monitor con la aventura, epílogo, créditos | Mirar y un Hablar de 3 líneas (abajo). Fuera monitor, árbol y créditos. Bruno deja de nombrarle antes de conocerle (`pecera.js:146`). | No. |
| — | Machismo de Desarrollo, velado | 4 escenas «de fondo» | Una sola, la de Yoli («Le he explicado a Yoli su artículo de SEO… Es que lo escribí yo»), una vez por partida, sin comentario, sin opción, sin objeto. | No. |

**El cameo de Valentín, entero:**

```
BRUNO: Valentín Retícula, director de Diseño y Producto. Cascos sin música.
VALENTÍN: Un segundo, que estoy centrando un punto.
BRUNO: ¿Desde cuándo?
VALENTÍN: Desde las seis y media. Está centrado. Es que no me lo creo.
```

**Líneas de Leoncio y Anselmo que se salvan** (reasignadas): «Un quesito que suma 130 % no es un gráfico. Es una
aspiración.» → Mirar la pantalla de Desarrollo en el Acto II; «Peor. Si funciona, la gente se acostumbra.» y «Cuando algo
se rompe a las tres de la mañana, ¿quién baja?» / «Paco abre un ticket. Bajo yo.» (dos globos) → Nemesio; «Integró una IA que era un
becario. Y rechaza una IA que es una IA.» → Bruno, al leer el registro en el Acto III (si vuelve a Mirarlo).

### B.4 Coste de implementación por cambio

| Cambio | Ids / archivos | Flags que mueren o nacen | Pruebas afectadas | Esfuerzo |
|---|---|---|---|---|
| Fuera Leoncio y MP1 | `leoncio_quesitos` (actors.js, pecera.js:469-478, pecera.dialogos.js:95-137), `mesa_dibujo`, `cpd.js:142-143, 159-170` (P_ALTA), `final.js:159, 212, 362`, titular `herminia_de_alta` (pajarera.js:27) | mueren `leoncio_acepta_alta`, `herminia_de_alta`, `infografia_integrada`, `rep_15` cambia de fuente (mismo flag) | test-paquete-a 194, 214, 362; test-paquete-b 209-220, 280; extras X5, X8, X10, X12, X13; contrast.mjs:77 | M |
| Anselmo → Nemesio | `anselmo_monolito`, `frontera_carrocero`, `cartel_frontera`, `pantalla_anselmo` (se queda como «pantalla de Desarrollo»), árbol AN, `lib/edificio.js` (1 mención) | muere `anselmo_dijo_regla` | test-paquete-b 209-216; extras X7 | M |
| Herminia a objeto | `herminia_portatil` se queda; el actor `herminia` se queda solo para el color | — | contrast.mjs (sigue) | S |
| Valentín a cameo | árbol `valentin` fuera, `monitor_valentin` fuera, `pecera.js:146-147` | — | test-paquete-a 171; test-paquete-b 113-128; smoke 207-213; extras X11b | S |
| Coro a un tercio | `pecera.js:46-84` (13→4 + 1 de fondo), `pecera.js:495` (`every: [60000, 120000]`, máx. 3, sin globos bloqueantes), árbol `coro` (8→3), fuera CO_BANDEJA y CO_HERMINIA, `bandeja_diseno` solo Mirar | muere `bandeja_diseno_abierta` | test-paquete-b 94-106; extras X9, X13 | S |
| Fuera Borja | `borja_engagement` (ecosistema.js:228-245, ecosistema.dialogos.js:25-52), `eventos.dialogos.js:20-36, 73`, rumor A3 → Maripaz | muere `oyo_descopear` | test-paquete-d 71-72, 124-125, 145-147, 238-263; extras X17, X17b | M |
| Custodia sin oráculo | `pecera.secretaria.js:113-136` fuera | — | test-paquete-c 179-180, 318; extras X24 | S |
| Tadeo sin jerga | `ecosistema.js:20-32`, `ecosistema.dialogos.js:79-112`, `lib/movil.js:13-19` | `tadeo_rv_n` máx. 3 | test-paquete-d (RV), extras (contadores) | S |
| Rumores B y D fuera | `cpd.js:106-112, 177-179`, `pecera.js:35-43`, `pajarera.js:281-284`, `vestibulo.js:124-126` | mueren `rumor_atun_n`, `rumor_plaza_n` | extras X14, X15, X17b, X23b, X25b, X26, controles —25 | S |
| Todos | `content/flags.js` (`ADENDA_FLAGS` y declaraciones) | ver §C.6 | `node tools/check.mjs` | S |

Partidas guardadas antiguas: los flags muertos se ignoran al cargar; si el inventario trae `planillo` o
`posit_baja_ruben`, se retiran y se ponen los flags equivalentes (una función de migración en la carga, M).

---

## C. Reestructura del Acto II (y lo que arrastra a los Actos I y III)

### C.1 Tres principios

1. **Cada objetivo se resuelve en la sala donde se plantea.** Si hace falta otra sala, la segunda visita trae una escena
   nueva, no una entrega.
2. **Ningún candado de permiso.** Si el jugador sabe la solución, funciona. Las pistas empujan; no se exige haberlas leído.
3. **Todo trayecto que queda tiene un encuentro.** Al cruzar una sala que ya conoces, algo ha cambiado por lo que hiciste
   (§C.5).

### C.2 Qué se elimina, qué se funde

| Hoy | Propuesta | Ahorro |
|---|---|---:|
| Paso 20: Gertrudis ×3 en el Acto II | Los 4 chismes salen de golpe en el primer saludo del Acto I (§F2) | 2 cambios, 1 paso |
| Pasos 21-22: leer el registro en Sistemas y volver a tirar del enchufe | La pantalla cuelga de la **regleta R-3, en Sistemas**: lees el registro y tiras allí mismo; el grito sube por la rejilla (§F3) | 1 cambio |
| Pasos 25-26: segunda visita a Sistemas para Paco | Paco atiende en la misma visita, nada más volver el CMS | 2 cambios |
| Paso 18: «¿Cómo convenzo a Teodoro?» | Lo dice Aurora en su monólogo del café | 1 paso |
| Pasos 28-29: coger el planillo y bajarlo a Maripaz | Maripaz está en la reunión y no huye: el duelo es allí (§F1) | 3 cambios, 1 objeto |
| Pasos 36-37: subir la pieza a Begoña y volver | Se manda por el fax de Teodoro, tecla 2: Begoña recorta a distancia (§F5). Subir sigue valiendo | 5 cambios |
| Pasos 40-42: álbum → Nemesio con «descopear» → pósit a Paco | «Salida en valor» delante del tablero; el ticket sube solo en el ascensor (§F4) | 1 cambio, 1 paso, 1 objeto |
| Paso 43: buscar a Gervasio en el Vending | Gervasio guarda la puerta de la Sala; el duelo D3 es en los Despachos | 3 cambios |

### C.3 El walkthrough nuevo, completo

Formato de `tools/walk-data.mjs`. «Cambios» = cambios de sala del paso. La columna «Pista» es lo que hay en pantalla para
deducirlo (además de la abuela, §D.5). Los textos de opción nuevos van entre comillas latinas.

**ACTO I** (igual que hoy salvo el paso 14)

| n | Sala | Acción | Cambios | Pista |
|---:|---|---|---:|---|
| 1 | Vestíbulo | (Intro 7.1) | 0 | — |
| 2 | Vestíbulo | Hablar Celestino → «¿Tiene algo para los nervios?» | 0 | Mirar Celestino: «un chicle que no descansa». |
| 3 | Vestíbulo | Hablar Celestino → «¿Dónde hay café en esta casa?» | 0 | «Tengo hasta las nueve.» |
| 4 | Vestíbulo | Hablar Celestino → «¿Algún cotilleo?» (rep_05) | 0 | — |
| 5 | Vestíbulo | Usar chicle con tarjeta | 0 | «Necesito algo que pegar. Por ejemplo, mi cara.» |
| 6 | Vestíbulo | Usar tarjeta con organigrama | 0 | Torno: «USUARIO NO CONSTA EN ORGANIGRAMA.» |
| 7 | Vestíbulo | Usar tarjeta con torno | 0 | «BIENVENIDO, VACANTE.» |
| 8 | Redacción | (entrar) → escena 7.2 | 1 | — |
| 9 | Redacción | Coger chaqueta de Ramírez | 0 | Silla: «La única silla libre. Tiene una chaqueta.» |
| 10 | Despachos | Usar chaqueta con Lector Medio | 1 | Yoli: «…que sea para dejarla en alguien con más autoridad que una silla.» Perchero, corregido: «Aquí colgada no asiente nadie.» |
| 11 | Despachos | Mirar ordenador de Gervasio (rep_07) | 0 | — |
| 12 | Despachos | Mirar pantalla del Titulator ×3 (armario 27) | 0 | Se rompe sola a la tercera. |
| 13 | Redacción | Mirar mi ordenador (rep_11) | 1 | «De pie no se ve.» |
| 14 | Vending | Hablar Gertrudis → «Buenas noches, Gertrudis.» → café **y los 4 chismes** (rep_03, 04, 10, 14) | 1 | Celestino: «Dale las buenas noches.» |
| 15 | Vending | Mirar tablón (rep_01) | 0 | — |
| 16 | Redacción de papel | Dar café a Aurora → ficha de la página 7; **ACTO II** | 2 | Cartel: «NO HABLO ANTES DEL CAFÉ.» |

**ACTO II**

| n | Sala | Acción | Cambios | Pista |
|---:|---|---|---:|---|
| 17 | Redacción de papel | Hablar Aurora → «¿Por qué no se hablan usted y Teodoro?» (rep_02) | 0 | — |
| 18 | Redacción de papel | Mirar fax enmarcado (rep_06) | 0 | — |
| 19 | Sistemas | Hablar Paco → «¿Y por qué no va?» | 2 | Aurora: «el CMS está en coma». Yoli, al pasar: «¡No entra nada!». Enchufe de la Redacción: brida «R-3, CPD. Paco». |
| 20 | Sistemas | Mirar registro de tickets | 0 | Paco: «Está todo en el registro. Nadie lo lee.» |
| 21 | Sistemas | Tirar de la regleta R-3 → CMS (§F3) | 0 | Ticket nº 3: «Se alimenta de la regleta R-3 de este CPD.» |
| 22 | Sistemas | Hablar Paco → «¿Sabes algo del fax de la Redacción de papel?» → manual | 0 | Aurora: el fax de Teodoro. |
| 23 | Sistemas | Hablar Paco → «¿Algún cotilleo del consultor?» (rep_12) | 0 | — |
| 24 | Redacción | Hablar Yoli → «¿Algún hilo bueno esta noche?» (rep_08) | 1 | Ahora atiende (pantalla apagada). |
| 25 | Redacción | Hablar Nemesio → «¿Qué tal con Yoli?» (rep_09) | 0 | — |
| 26 | Sala Amazonas | Hablar Gervasio → «Bueno… ¿y cuáles son los siguientes pasos?» → estampida (§F1) | 2 | Aurora (café) y el orden del día: «3. Siguientes pasos. Sin tocar desde marzo.» |
| 27 | Sala Amazonas | Hablar Maripaz → «La página 7 está pendiente desde marzo.» → D1 (remate: ficha) → **HUECO** | 0 | Maripaz: «Estoy sentada en el planillo.» Ficha: «Vendida a Siestatón desde marzo.» |
| 28 | Administración | Hablar Begoña → nota de gasto (P08, igual que hoy) → fotocopia + copias | 4 | Ficha: «FUENTE: dos fuentes». Mensaje F.P. todavía no existe: la pista es la abuela y la pared de notas rechazadas. |
| 29 | Redacción de papel | Usar copias rechazadas con fax → mensaje de F.P. | 3 | Fax: «SIN PAPEL». Begoña: «Duplicado y triplicado, para tu archivo personal.» |
| 30 | Redacción de papel | Mirar mensaje de F.P. | 0 | — |
| 31 | Redacción de papel | Dar mensaje de F.P. a Aurora → **FUENTE** (la fotocopia vuelve a Bruno) | 0 | Aurora: «Con una fuente se hace un rumor. Con dos, una noticia.» |
| 32 | Redacción de papel | Hablar Teodoro → «Quiero firmar en tu página 7.» → D2 (remate: manual) → **FIRMA** | 0 | Fax ya con papel. |
| 33 | Redacción | Usar mi ordenador → pieza | 1 | Aurora: «Ahora escríbela. En tu ordenador, fuera del CMS.» |
| 34 | Redacción de papel | Dar pieza a Teodoro → «Me sobran ocho. Recortar es cosa de arriba. Tecla 2.» | 1 | Ficha: «PIEZA: 31 líneas. Faldón: 23.» |
| 35 | Redacción de papel | Usar pieza con fax → recorte del 26 % por fax (§F5) | 0 | Fax: «Marcación rápida: 2, ADMINISTRACIÓN». Cartel de Administración (visto en el 28). |
| 36 | Redacción de papel | Dar ficha a Teodoro → escena 7.3a; **ACTO III** | 0 | — |

**ACTO III**

| n | Sala | Acción | Cambios | Pista |
|---:|---|---|---:|---|
| 37 | Sistemas | Tirar papel continuo → escena 7.3 | 2 | Súplica del Titulator (paso 12), L4 de Evaristo (atún), último RV de Tadeo. |
| 38 | Sistemas | Hablar Rubén → «¿Escribiste tú los discursos de Íñigo?» (rep_13) | 0 | Rubén: «Mi baja es un pósit en el tablero de Nemesio.» |
| 39 | Eventos | Hablar Pilar → «¿Me prestas el álbum?» | 2 | Rubén: «La de Eventos. Pero salgo al fondo.» |
| 40 | Redacción | Dar álbum a Nemesio → «No es una baja: es una salida en valor.» → ticket nº 1 por el ascensor; Rubén libre (§F4) | 2 | Nemesio: «Despido es otra columna.» Libreta: «No es un despido: es una salida en valor.» |
| 41 | Despachos | Hablar Gervasio (en la puerta de la Sala) → «Necesito el acta de la última reunión.» → D3 (remate: fotocopia de su nota) → acta | 1 | Gervasio: «Sin acta de la anterior no se abre la siguiente.» Aurora: «Gervasio no ha escrito un acta en su vida.» |
| 42 | Sala Amazonas | Usar puerta de la Sala → 7.4 | 1 | — |
| 43 | Sala Amazonas | D4 Íñigo (remates: ticket nº 1 y acta) | 0 | — |
| 44 | Sala Amazonas | Empujar al Lector Medio → final | 0 | Íñigo: «lleva tres semanas asintiendo»; abuela. |

En `walk-data.mjs`, por ejemplo:

```js
{ n: 21, sala: 'cpd', txt: 'Tirar regleta_cpd', acc: [['verbo', 'tirar', 'regleta_cpd']],
  esp: { flags: ['cms_vivo'] } },
{ n: 27, sala: 'sala_amazonas', txt: 'Hablar maripaz_remitido → D1', acc: [['verbo', 'hablar', 'maripaz_remitido'],
  ['opcion', 'La página 7 está pendiente desde marzo.'], ['duelo', ['R08', 'R04', 'R11', { objeto: 'ficha_pagina_7' }]],
  ['cerrar']], esp: { flags: ['duelo_maripaz_ganado', 'casilla_hueco'] } },
{ n: 35, sala: 'catacumba', txt: 'Usar pieza_opa con fax', acc: [['usar', 'pieza_opa', 'fax']],
  esp: { flags: ['pieza_recortada'], tiene: ['pieza_opa'] } },
{ n: 40, sala: 'pecera', txt: 'Dar album_eventos a nerea_backlog → salida en valor', acc: [['ir', 'pecera'],
  ['dar', 'album_eventos', 'nerea_backlog'], ['opcion', 'No es una baja: es una salida en valor.'], ['cerrar']],
  esp: { flags: ['posit_descopeado', 'ruben_libre'], tiene: ['ticket_n1'], notiene: ['album_eventos'] } },
```

Orden alternativo (para `walkthrough.mjs --alt`): tras el 23, subir en ascensor de Sistemas a la planta 2 (Begoña) antes
de la Sala: **13 cambios** en el Acto II. Todo el Acto II es libre de orden salvo dos dependencias: el CMS antes de D1 y
D2 (réplicas y manual), y la nota de gasto antes del fax.

### C.4 Recuento antes y después

| Acto | Pasos hoy | Pasos nuevos | Cambios hoy | Cambios nuevos | Entradas en la Redacción hoy → nuevo |
|---|---:|---:|---:|---:|---|
| I | 16 | 16 | 6 | 6 | 3 → 3 |
| II | 21 | 20 | **24** | **14** | 9 → 5 |
| III | 9 | 8 | 12 | 8 | 4 → 2 |
| **Total** | **46** | **44** | **42** | **28** | 16 → 10 |

Recados, repeticiones y candados: de 11 pasos (22 cambios) a **2** (el café a Aurora, que es el tutorial del Acto I, y el
álbum, que es la excusa para visitar Eventos y trae escena): **4 cambios**.

### C.5 Cada trayecto que queda, convertido en algo

| Trayecto | Qué pasa al cruzar |
|---|---|
| Redacción de papel → Redacción → Sistemas (paso 19) | Yoli grita su CMS; el coro le contesta «¡Diseño!» desde el fondo. El obstáculo se ve antes de que nadie lo explique. |
| Sistemas → Redacción (paso 24) | La sala ha cambiado: pantalla apagada, Yoli ciega y habladora, el titular «ALGUIEN DESENCHUFA UNA PANTALLA…» en el móvil (RV de Tadeo). |
| Redacción → Despachos → Sala (paso 26) | Al cruzar los Despachos, **el Titulator anuncia solo la última hazaña** (§D.3), sin bloquear. Íñigo, en el sofá: «Vacante. Ya me han contado lo del sótano.» |
| Sala → … → Administración (paso 28) | En Marketing y Comercial, Maripaz ya ha vuelto y está al teléfono: «¿Siestatón? Os paso a la web. Con un banner que respira.» Es el final de D1, visto de pasada. Al llegar a Administración salta L2 de Evaristo. |
| Administración → … → Redacción de papel (paso 29) | Al pasar por la Redacción, Yoli: «Bruno, Bruno becario, becario con papeles, papeles rechazados…» |
| Redacción ↔ Redacción de papel (33-34) | Al salir del ordenador, Nemesio mueve un pósit «EXCLUSIVA BRUNO» a EN CURSO sin mirarle. |
| Redacción de papel → Sistemas (37) | Es el arranque del Acto III: el armario hace «ñiiic» más fuerte; Paco: «Desde que has subido el CMS, el 27 teclea el doble.» |
| Sistemas → Eventos (39) | El ascensor; ¡FLASH! de Pilar al entrar (protegido). |
| Eventos → Redacción (40) | El coro tiene puesto el álbum en una pantalla: «¿Quién es ese del fondo?» «Diseño.» (única discusión de Diseño en el Acto III). |
| Redacción → Despachos → Sala (41-42) | Gervasio en la puerta: el obstáculo es una persona en el camino, no un recado. |

**MP2 de Evaristo sin viaje de vuelta.** Tras «Don Evaristo pregunta si su coma está bien» con Aurora, la siguiente entrada
en una sala dispara una llamada nueva (se añade a `LLAMADAS` en `game.js`, condición `coma_bendecida`):

```
EVARISTO: Una cosita. ¿Le ha dicho algo Aurora? Llevo diez minutos junto al teléfono.
BRUNO: Que una coma bien puesta no espera.
EVARISTO: ...Entonces lo envío. En el momento oportuno. Con todos en copia.
EVARISTO: Era solo eso. Y gracias. Esto sí lo digo sin adjunto.
```

(pone `correo_evaristo_listo`; la opción E_ENVIO de `administracion.dialogos.js:236-247` se queda como alternativa).

### C.6 Flags y objetos que cambian

| Elemento | Hoy | Propuesta | Dónde |
|---|---|---|---|
| `chisme_indice` | +1 por saludo | Llega a 4 en el primer saludo (los 4 chismes); los siguientes saludos dan relleno | `office.js:53-78` |
| `cafe` (2.º) | Se da otro si no lo llevas | Solo con el primer saludo: `if (!api.flag('gertrudis_saludada'))` | `office.js:62` |
| `regleta_cpd` (objeto nuevo) | — | Hotspot en Sistemas; Tirar pone `cms_vivo` | `cpd.js` + `art/cpd.art.js` |
| `vio_ticket_3` | Candado del enchufe | Solo informativo (pistas) | `pecera.js:199` |
| `cms_vivo` | Lo pone `enchufe_pantalla` | Lo pone `regleta_cpd`; el enchufe de la Redacción enseña la brida y, si tiras, lo arranca igual (no hay candado) | `cpd.js`, `pecera.js:195-212` |
| Escena `pecera_cms_vivo` | Al tirar en la Redacción | Se divide: el grito por la rejilla en Sistemas y la primera entrada en la Redacción con `cms_vivo` (Yoli ciega, sin el coro) | `pecera.escenas.js:147-162` |
| `aurora_hablo_fax` | Opción A2 | Lo pone A_CAFE | `catacumba.js:157-183` |
| `sala_amazonas_orden_visto` (local, nuevo) | — | Mirar el orden del día también desbloquea «siguientes pasos» | `sala_amazonas.js:80-92, 227` |
| Maripaz | Siempre en Marketing y Comercial | En la Sala con `acto_2_iniciado && !casilla_hueco`; en Marketing el resto | `sala_amazonas.js`, `ecosistema.js:246` (`when`), arte de la Sala |
| `planillo` (objeto) y `planillo_mesa` | Se coge y se da | **Desaparecen**; el planillo está debajo de Maripaz (dibujo) | `items.js:257-260`, `sala_amazonas.js:93-98`, `ecosistema.js:254-257` |
| D1 | `ecosistema` | En `sala_amazonas` (mismo id `maripaz`; remate con `ficha_pagina_7`) | `ecosistema.js:67-90` → `sala_amazonas.js` |
| `fotocopia_nota_direccion` | La gasta Aurora | Aurora solo grapa el fax; la fotocopia vuelve y es el remate de D3 | `catacumba.js:199-200` |
| `pieza_recortada` | Solo Begoña en persona | También Usar `pieza_opa` con `fax` (con `fax_con_papel`) | `catacumba.js:420-461` |
| `oyo_descopear` | Llave de Nemesio | **Muere**; la llave es `rep_13` | `pecera.dialogos.js:68`, `eventos.dialogos.js:73` |
| `posit_descopeado` | Pósit despegado | Se queda el id: «pósit movido a SALIDA EN VALOR» | `pecera.dialogos.js:72-91`, kanban |
| `posit_baja_ruben` (objeto) | Se lleva a Paco | **Desaparece**; el tablero «avisa» a Sistemas | `items.js:297-300`, `cpd.js:81-99` |
| `ticket_n1` | Lo da Paco | Llega en el ascensor a la Redacción | escena nueva en `pecera.dialogos.js` |
| `ruben_libre` | Lo pone Paco | Lo pone la escena de la salida en valor | `cpd.js:89` → `pecera.dialogos.js` |
| Gervasio, Acto III | En el Vending | En los Despachos, junto a `puerta_sala`; tras D3 se va al Vending (allí queda su gag con Gertrudis) | `pajarera.js:294`, `office.js:275`, `art/pajarera.art.js` |
| `duel:<id>:perdido_n` (nuevo, int) | — | Lo suma el motor en cada derrota | `engine/duel.js` |
| `abuela_obj`, `abuela_nivel` (nuevos) | `abuela_llamadas` | Pista por objetivo y nivel | `game.js:40-80` |
| Mueren | — | `anselmo_dijo_regla`, `leoncio_acepta_alta`, `herminia_de_alta`, `infografia_integrada`, `bandeja_diseno_abierta`, `rumor_atun_n`, `rumor_plaza_n`, `oyo_descopear` | `flags.js` |

Opciones que cambian de texto (el walkthrough busca por texto): Paco, «¿Sabes algo del fax de la Catacumba?» →
«…de la Redacción de papel?» (además, «Catacumba» no es un nombre visible).

### C.7 La Redacción: orden espacial y atajos

- **Fase 1, sin arte:** Nemesio pasa a la mesa vacía de Infografía, junto al borde del kanban (`layout.nerea_backlog.at`
  de [598+410, 114] a ~[434+410, 114]; es la posición que hoy ocupa Leoncio). Todo lo imprescindible queda entre x 0 y
  x 900. El coro y Diseño quedan al fondo, para quien quiera.
- **Salidas de doble clic** y corte inmediato si la salida está a más de 320 px (motor, `engine/walk.js`), como propone el
  crítico: con 9 entradas en la Redacción en lugar de 16, el ahorro se multiplica.
- **Fase 2, con arte:** quitar la franja de Infografía (mesa de dibujo, frontera, cartel: ~94 px) y la de Anselmo (~60 px) y
  plegar Diseño en una esquina sin monitor (~110 px): la sala queda en **~1.000 px**.

---

## D. Objetivo siempre claro

Cuatro capas, de la más pasiva a la más activa: la ficha (qué), Bruno (qué y por qué), el Titulator (qué acabas de hacer)
y la abuela (cómo).

### D.1 La ficha de la página 7 como lista viva

Mirar la ficha (`items.js:243-256`) devuelve una línea por casilla, con el estado del sub-objetivo. Una casilla hecha se
dice en una línea corta; las tres pendientes siempre dicen qué falta y dónde.

```
BRUNO: Ficha de la página 7.
BRUNO: HUECO [ ] Vendida a Siestatón desde marzo. Se decide en la Sala Amazonas.
BRUNO: HUECO [ ] La reunión ha acabado. Maripaz no. Sigue sentada en el planillo.
BRUNO: HUECO [✓] Siestatón, a la web. El faldón es mío: 23 líneas.
BRUNO: FUENTE [ ] Dos fuentes, dice Aurora. Tengo cero.
BRUNO: FUENTE [ ] Tengo la nota de Gervasio. Me falta otra que diga lo mismo.
BRUNO: FUENTE [✓] Grapadas. Una anónima y otra con IVA.
BRUNO: FIRMA [ ] Teodoro solo habla por fax. Y el fax no tiene papel.
BRUNO: FIRMA [ ] El fax ya habla. Ahora hay que ganárselo.
BRUNO: FIRMA [✓] «Bruno Pellejo. Trece con espacios. Cabe.»
BRUNO: Al margen, a lápiz: «Arriba no me atiende nadie. El CMS está en coma.»
BRUNO: PIEZA: 31 líneas. El faldón tiene 23. Me sobran ocho.
BRUNO: PIEZA: 23 líneas. Lista para Teodoro.
```

(Se dice el título, las tres casillas en su estado y, si procede, la nota al margen y la línea de la pieza.)

**En el Acto III** Teodoro se queda la ficha, así que en la escena 7.3a, antes de que entre Íñigo, Teodoro devuelve a
Bruno la **galerada de la página 7** (objeto nuevo `galerada_pagina_7`; icono procedural, S): «Llévatela, chaval. Si
apagan la rotativa, que vean lo que apagan.» Mirarla es la lista del Acto III:

```
BRUNO: La galerada de la página 7. Mi nombre, en plomo. Bueno, en tóner.
BRUNO: ROTATIVA [ ] La Reunión de Dirección la apaga a las nueve.
BRUNO: Para entrar: el acta de la última reunión [ ]
BRUNO: Para ganar: algo que demuestre qué es el Titulator [ ]
```

### D.2 «Mirar a Bruno»: la meta en su voz

Hoy, Mirar a Bruno es un chiste fijo (`actors.js:197`). Propuesta: dice **qué quiere ahora** (nunca cómo; eso es de la
abuela), según el primer objetivo activo de §D.5, con su chiste.

| Objetivo | Bruno |
|---|---|
| Torno | «Seis años aquí y el torno no sabe quién soy. Tengo que constar en algo.» |
| Silla | «Necesito sentarme. Seis años de pie: ya tengo las rodillas de becario senior.» |
| Correo | «Tengo silla. Ahora puedo mirar mi ordenador como un adulto.» |
| Café | «La correctora no habla antes del café. Necesito un café que no sea para mí.» |
| CMS | «Arriba no me atiende nadie mientras el CMS no vaya. Y no va.» |
| Hueco / Fuente / Firma | «Hueco, fuente y firma. Lo pone la ficha. La ficha manda.» |
| Acto III | «A las nueve apagan la rotativa. Y con ella, mi nombre.» |
| Clímax | «Respondo a todos. Es lo único que sé hacer bien.» |

### D.3 El titular reactivo

El Titulator ya comenta tus hazañas si lo Miras (`pajarera.js:19-30`). Propuesta: **al entrar en los Despachos**, si hay
una hazaña nueva, la pantalla pita y la dice sola, como globo no bloqueante (los avisos de `afterEnter` ya hacen algo
parecido). El jugador que pasa por allí tres veces en el Acto II recibe tres veces la confirmación de su progreso. Entradas
nuevas o cambiadas (fuera las de Herminia y Custodia):

| Flag | Titular |
|---|---|
| `cms_vivo` | «UN BECARIO APAGA LA REDACCIÓN DESDE EL SÓTANO. ARRIBA, NI SE ENTERAN» |
| `reunion_terminada` | «UN BECARIO PREGUNTA POR LOS SIGUIENTES PASOS. HAY HERIDOS» (se queda) |
| `casilla_hueco` | «UNA COMERCIAL SE QUEDA SOLA EN UNA REUNIÓN. Y FACTURA LA SALA» |
| `duel:maripaz:perdido_n ≥ 1` | «BECARIO LLAMA A UN COLCHÓN UN VIERNES. EL COLCHÓN NO LO COGE» |
| `casilla_firma` | «UN HOMBRE QUE SOLO HABLA POR FAX SE CONTESTA A SÍ MISMO. LLORA» |
| `pieza_recortada` | «BEGOÑA RECORTA A DISTANCIA. LA CONCLUSIÓN, EN PARADERO DESCONOCIDO» |

### D.4 La hora, por hitos

El móvil deja de marcar siempre 20:59 (`lib/movil.js:25` es el primer error que encontró el crítico). Marca la hora de la
historia, que avanza por hitos; los relojes del edificio siguen parados en las 20:59.

| Hito | Hora en el móvil |
|---|---|
| Intro | 18:30 |
| `torno_abierto` | 18:41 |
| `acto_2_iniciado` | **19:07** (la de Begoña: por fin coinciden) |
| cada casilla | +25 min |
| `acto_3_iniciado` | 20:22 |
| `ruben_libre` | 20:44 |
| `sala_abierta` | 20:53 |
| Entrada en el clímax | **20:59**: «Por primera vez esta noche, mi móvil y los relojes de la casa coinciden.» |
| «Goyita. Tira.» | 21:00 |

La línea del correo de Eventos (`lib/movil.js:25`) pasa a ser: «Hace ocho meses que faltan cinco minutos. Ya casi es la
hora.»

### D.5 La abuela: tres niveles por objetivo

**Algoritmo** (sustituye a `content/game.js:42-79`):

1. Candidatos = objetivos activos y no hechos (tabla de abajo).
2. Elegido = el primer candidato **asociado a la sala donde está Bruno**; si no hay, el último que se pidió
   (`abuela_obj`); si no, el primero de la lista.
3. Si el elegido es distinto del de la última llamada, nivel 1; si es el mismo, nivel siguiente, hasta 3.
4. Nivel 1 sutil (metáfora de abuela), 2 clara (abuela concreta), 3 explícita (dice la acción) más el «extra» si falta un
   requisito. Si se vuelve a llamar en el nivel 3, antepone «Te lo digo otra vez, hijo, que no comes.»: nunca se repite
   una llamada idéntica.
5. El saludo rota (como hoy) y siempre acaba en «Abrígate.».

**Las pistas, completas:**

| Objetivo · hecho cuando · activo cuando · salas | Nivel 1 (sutil) | Nivel 2 (clara) | Nivel 3 (explícita) |
|---|---|---|---|
| **Torno** · `torno_abierto` · siempre · Vestíbulo | En el pueblo, el que no sale en la foto no existe. Ponte en la foto. | Si el torno no te conoce, preséntate en ese cuadro de caras. | Pega tu foto en el organigrama con algo que pegue. Y luego, el torno. |
| extra (sin chicle) | | | El del mostrador siempre está mascando algo. Pídeselo. |
| **Silla** · `silla_libre` · `inigo_presentado` · Redacción, Despachos | ¿Estás de pie? Siéntate, hijo. La silla es del que llega. | Si la silla tiene chaqueta, que la lleve otro. Uno que no se mueva. | Ponle esa chaqueta al señor de cartón de los despachos. |
| **Correo** · `rep_11` · `silla_libre` · Redacción | Ahora que estás sentado, mira lo tuyo. Que nunca lo miras. | En el ordenador tendrás cartas sin abrir. Como en el buzón. | Mira tu ordenador, hijo. Con silla, ya se ve. |
| **Café** · `gertrudis_saludada` · `inigo_presentado` · Vending, Redacción | ¿Has saludado a todo el mundo? A las máquinas también. | La cafetera esa no da café por botones. Lo da por educación. | Dale las buenas noches a la cafetera. En alto. |
| **Aurora** · `acto_2_iniciado` · `has:cafe` · Redacción de papel | Los que corrigen siempre están cansados. Como tu abuelo. | A la señora del cartel no le hables: dale. Primero el café. | Dale el café a la señora que corrige. La del boli en el moño. |
| **CMS** · `cms_vivo` · `acto_2_iniciado` · Redacción, Sistemas | Cuando en casa no va nada, hay algo enchufado mirándolo todo. | Eso se arregla abajo, donde los cables. Lo pone en un papel. | Baja a Sistemas, lee el registro de tickets y tira de la regleta. |
| **Reunión** · `reunion_terminada` · `acto_2_iniciado` · Despachos, Sala | Las reuniones se acaban cuando alguien pregunta qué hay que hacer. | Ve a esa reunión de marzo y pregunta lo del punto tres. | Pregúntale a Gervasio por los siguientes pasos. En la Sala. |
| **Hueco** · `casilla_hueco` · `reunion_terminada` · Sala | La que se queda sentada es que quiere que le hables. | Si alguien tiene algo apartado desde marzo, ya no es suyo. | Dile a Maripaz que la página 7 lleva pendiente desde marzo. |
| extra (faltan réplicas de D1) | | | Y antes apúntate contestaciones, hijo. Cotillea, que es gratis. |
| **Nota de gasto** · `nota_gasto_presentada` · `acto_2_iniciado` · Marketing y Comercial, Administración | ¿Has hecho la cuenta de gastos? Hazla mal. Te enseñan una buena. | La de la ventanilla enseña las buenas si le das una mala. | Presenta una nota de gasto en Administración. Con el azúcar. |
| **Papel del fax** · `fax_con_papel` · `nota_gasto_presentada` · Redacción de papel | Las máquinas viejas son como yo: sin papel no dicen nada. | Ese papel que te rechazaron por detrás está en blanco. | Mete las copias rechazadas en el fax de Teodoro. |
| **Fuente** · `casilla_fuente` · `fax_con_papel` · Redacción de papel | Lo que cuenta una vecina no me lo creo hasta que lo cuenta otra. | Tienes un papel del fax y otro de la ventanilla. Dos vecinas. | Dale el fax de F.P. a Aurora. Con la nota de Gervasio son dos. |
| **Firma** · `casilla_firma` · `fax_con_papel` · Redacción de papel | El que no contesta, contesta solo. Como el contestador de tu tío. | Si el del fax se pone terco, que le conteste su propia máquina. | Gánale el duelo a Teodoro y usa el manual del fax. Página 9. |
| extra (sin manual) | | | El manual lo tiene el de los ordenadores. Pregúntale por el fax. |
| **Pieza** · `pieza_escrita` · `casilla_fuente` · Redacción | ¿Y has escrito ya? Siéntate en tu silla y escribe. | Lo de escribir, en tu mesa. Que te ha costado la silla. | Usa tu ordenador en la Redacción. Ya tienes fuentes. |
| **Recorte** · `pieza_recortada` · `pieza_escrita` · Redacción de papel, Administración | Si te sobra, recorta por abajo. Como los pantalones. | La de la ventanilla no lee: recorta. Mándaselo. | Mándale la pieza a Begoña por el fax. Tecla 2. O súbesela. |
| **Cierre** · `pagina_cerrada` · las tres casillas y `pieza_recortada` · todas | ¿Y a qué esperas para darle los papeles al señor del fax? | Tienes las tres cosas, hijo. Llévalas a quien manda. | Dale la ficha de la página 7 a Teodoro. Ya está todo. |
| **Armario** · `ruben_encontrado` · `acto_3_iniciado` · Sistemas | Si de un armario sale papel, es que alguien escribe dentro. | Esos titulares tan raros salen de abajo. Del armario. | Baja a Sistemas y tira del papel continuo del armario 27. |
| **Álbum** · `has:album_eventos` o `posit_descopeado` · `ruben_encontrado` · Eventos, Sistemas | Para que dejen irse a alguien, hay que demostrar que estuvo. | Las fotos de las fiestas las guarda la que las organiza. | Pídele el álbum a Pilar, en Eventos. Rubén sale al fondo. |
| **Baja** · `ruben_libre` · `has:album_eventos` · Redacción | A los que echan con palabras bonitas se les saca con las mismas. | Ese chico te dio una frase de despedir sin despedir. Úsala. | Dale el álbum a Nemesio y dile que es una salida en valor. |
| extra (sin `rep_13`) | | | Pero antes pregúntale a Rubén por los discursos de ese señor. |
| **Acta** · `sala_abierta` · `acto_3_iniciado` · Despachos | En una reunión manda el que escribe el acta. Que la escriba otro. | El de la puerta quiere un acta. Y que no se sepa con quién comió. | Gánale el duelo a Gervasio. Y enséñale su nota de gasto. |
| **Íñigo** · `duelo_inigo_ganado` · clímax activo · Sala | A los que hablan mucho se les contesta corto. Y con papeles. | Cuando pida papeles, dale el ticket de ese chico y el acta. | En los remates usa el ticket nº 1 y luego el acta. |
| **Empujón** · `lector_derribado` · `duelo_inigo_ganado` · Sala | A los que nunca dicen nada, hijo, un empujoncito. Con educación. | Ese de cartón lleva semanas diciendo que sí. Que diga otra cosa. | Empuja al Lector Medio. Es de cartón: no se hace daño. |

(57 líneas. La llamada que menciona a Evaristo, `game.js:73-75`, se queda.)

---

## E. El duelo «Responder a todos», rediseñado

### E.1 Del problema a la solución

| Problema (crítico §4.5) | Solución | Dónde |
|---|---|---|
| El ataque desaparece al abrir el menú | El ataque se queda escrito como **cuerpo del correo** en la ventana hasta que eliges | `engine/duel.js` `drawHud` |
| 18-19 opciones con scroll | **Máximo 5 líneas**, sin scroll | `duel.js:90-95` |
| La réplica correcta es la frase que ya oíste | Cada rival **parafrasea** el tópico a su manera: hay que entenderlo | `opp.attackText` (ya existe, `duel.js:89`) |
| Puntos en cuadraditos de 3 px | Marcador en texto y CC que crece | `drawHud` |
| Tres asaltos sin escalada | 3 aciertos + **remate con objeto en los cuatro duelos** | datos de cada sala |
| Perder no cuesta nada | **Escena de consecuencia** propia + titular + ayuda en la revancha | `opp.onLose`, `duel.js:138-145` |
| La floja se corta en la derrota | Se dice la contestación antes de cerrar | `duel.js:119-125` |
| «Lo que diga Gervasio» al perder contra Gervasio | Línea de derrota propia por rival | `texts.defeatLine` → `opp.defeatLine` |
| Cargar dentro de un duelo | Sin autoguardado con `game.duelInfo` activo | motor |

### E.2 Reglas exactas

1. **Ataque.** El rival ataca con la primera carta de su mazo (orden fijo; un ataque fallado pasa al final). El ataque se
   dice en globo y queda escrito en la ventana como `Cuerpo: «…»` (dos líneas como mucho) mientras dura el menú.
2. **Paráfrasis.** Cada rival dice cada tópico con sus palabras (`attackText[par]`, tabla E.3). La libreta apunta la
   réplica y, debajo, el tópico en una línea («Cuando te escriben "desde el cariño"»). Las réplicas no cambian: son los
   chistes.
3. **Menú.** Como mucho 5 líneas: hasta **4 réplicas aprendidas que estén en el mazo de ese rival** (si sabes la correcta,
   siempre está; el resto, las siguientes del mazo que sepas, en orden de mazo, así que la posición de la buena cambia en
   cada asalto) y **1 floja**, que rota por rival y tiene contestación propia. El comodín «Enviado desde mi móvil» es una
   de las flojas y conserva su efecto de la primera vez (no suma ni resta).
4. **Acierto.** +1; el rival encaja con su línea propia; una línea de «+1» en el hilo.
5. **Fallo.** Una «RE:» más en el asunto y **alguien más en copia**: 1.º fallo, el CC del rival (tabla); 2.º, «toda la
   planta»; 3.º, «Dirección» y derrota.
6. **Remate.** Al llegar a 3 aciertos (D4: a 2 y a 4) el rival lanza un remate; las réplicas se apagan y solo quedan
   `[Adjuntar objeto]` y `[Retirarse del hilo]`. Un objeto equivocado tiene línea propia y no cuenta como fallo.
7. **Victoria** = 3 aciertos + remate (D4: 4 aciertos + 2 remates).
8. **Derrota.** El rival contesta la última respuesta, dice su línea de derrota, y se juega la **consecuencia** (E.4):
   escena de ≤ 6 líneas, titular del Titulator y suma de `duel:<id>:perdido_n`. Nunca se pierde nada del inventario.
9. **Revancha.** Hablar otra vez con el rival. El mazo empieza por el ataque que te ganó, y la libreta lo marca con un
   asterisco: «Esta me la metió Maripaz».
10. **Retirarse.** Sin consecuencia. En el hilo: «RV: Bruno ha abandonado el hilo.»
11. **Aviso previo.** Si sabes menos réplicas del mazo que las que hacen falta, Bruno lo dice antes (como hoy,
    `duel.js:70-71`).
12. **Duración objetivo:** D1 ≈ 60 s, D2 ≈ 75 s, D3 ≈ 60 s, D4 ≈ 120 s.

### E.3 Mazos, paráfrasis y remates

| Duelo | Mazo | CC del 1.er fallo | Remate (objeto) |
|---|---|---|---|
| D1 Maripaz (Sala Amazonas) | R08, R04, R11, R14 | Colchones Siestatón | «¿Y quién me firma que esa página es de la redacción, cariño?» → `ficha_pagina_7` |
| D2 Teodoro (fax) | R06, R02, R03, R09 | Aurora | «Esto está cerrado. Y lo que está cerrado no tiene respuesta.» → `manual_fax` (como hoy) |
| D3 Gervasio (Despachos) | R07, R01, R14, R03, R05 | sus tres móviles | «Yo con Hidrovoltia no he comido en mi vida. Ni cenado.» → `fotocopia_nota_direccion` |
| D4 Íñigo (Sala) | R10, R12, R13, R05, R01, R07, R15, R16 | Optimal Brains & Partners | `ticket_n1` a 2 y `acta_reunion` a 4 (como hoy) |

**Paráfrasis por rival** (`attackText`):

| Par | Maripaz | Teodoro (fax) | Gervasio | Íñigo |
|---|---|---|---|---|
| R01 | — | — | Como ya te dije en el otro correo, ese que no has leído… | Como ya expuse en la diapositiva 12, que nadie ha mirado… |
| R02 | — | Con todo el respeto que me merece la web. Que es poco. | — | — |
| R03 | — | Esta firma la quería ver ayer. Y anteayer, en plomo. | El acta la necesito para ayer. Bueno, para cuando puedas. Ayer. | — |
| R04 | Hazlo tú, que escribes divinamente. Lo digo como clienta. | — | — | — |
| R05 | — | — | Lo del acta, entre tú y yo. Que no salga de esta puerta. | Esto es confidencial. Que no salga de la sala. Ni del Q3. |
| R06 | — | ¿Y esto quién te lo confirma, chaval? ¿Tu móvil? | — | — |
| R07 | — | — | Esto ya lo hablamos tú y yo. Me consta. Lo hablamos. | Esto ya lo alineamos en su día. Me consta. |
| R08 | Esto te lo escribo desde el cariño más absoluto, cariño. | — | — | — |
| R09 | — | Ese dato lo has sacado de contexto. Y de la web, que es peor. | — | — |
| R10 | — | — | — | Estamos evaluando todos los escenarios. En una matriz. |
| R11 | Me quedo a la espera de tus comentarios. Facturando. | — | — | — |
| R12 | — | — | — | Aquí hay que mirar con luces largas. Visión de carretera. |
| R13 | — | — | — | Nadie se va a la calle. Os vais a una salida en valor. |
| R14 | Si quieres lo vemos en una reunión cortita. Con catering. | — | Mira, esto lo vemos en una reunión de cinco minutitos. | — |
| R15 | — | — | — | He validado el plan con la IA. Está de acuerdo conmigo. |
| R16 | — | — | — | Lo de la coma es un detalle sin importancia. |

**Flojas con contestación propia** (sustituyen a la contestación común de `duelo.js:29-31`):

| Floja | Maripaz | Teodoro | Gervasio | Íñigo |
|---|---|---|---|---|
| «Te lo miro y te digo.» | Eso me dijo Siestatón en marzo, cariño. | Eso, en papel, no se dice. Se firma. | Perfecto. Lo hablamos. Ah, no, que eso lo digo yo. | Perfecto. Te pongo en azul. Excusas. |
| «¿Eso no lo llevaba otro departamento?» | Lo llevaba. Ahora te lo patrocino a ti. | Otro departamento es la web. Por eso no va. | Lo llevaba yo. Por eso lo llevas tú. | Ya no hay departamentos. Hay cuadrantes. |
| «Eso es cosa de Diseño.» | Diseño no me compra espacio, cariño. | DISEÑO ME MANDA LAS PÁGINAS A SU HORA. NO COMO OTROS. | Diseño se fue a las seis y media. Con todo hecho. Qué raro. | Diseño entrega a tiempo. No sé en qué cuadrante ponerlos. |

### E.4 Perder con consecuencia

| Duelo | Línea de derrota | Consecuencia (escena corta) | Titular |
|---|---|---|---|
| D1 | Asignado a ti, cariño. El teléfono de Siestatón es este. | Bruno llama, en primer plano del móvil. CONTESTADOR: «Siestatón. Descanse. Su llamada nos importa. Mañana.» BRUNO: «Le he dejado un mensaje a un colchón.» MARIPAZ: «¿Ves? Cliente difícil. Cuando quieras, pierdes otra vez.» | «BECARIO LLAMA A UN COLCHÓN UN VIERNES. EL COLCHÓN NO LO COGE» |
| D2 | Lo que está cerrado no se abre. Vuelve cuando sepas escribir. | El fax escupe «VUELVE» en cuerpo 72, una letra por hoja, seis hojas. AURORA: «Ha perdido usted con dos faltas, criatura. Y en cuerpo 72.» | «UN BECARIO RECIBE SEIS FOLIOS PARA UNA PALABRA. LA PALABRA, CRUEL» |
| D3 | Asignada a ti. El acta, digo. | Bruno escribe el acta él mismo: «Acuerdos: uno, perder un duelo.» GERVASIO: «Un acta escrita por un becario no es un acta. Es un diario.» Se la devuelve. | «UN BECARIO REDACTA UN ACTA. DIRECCIÓN LA ARCHIVA EN "DIARIOS"» |
| D4 | Asignado a Vacante. Llama tú a la rotativa. | Íñigo le acerca el teléfono de conferencias. BRUNO: «Ni hablar.» ÍÑIGO mueve su pósit de «Ideal» a «Prescindible» y vuelve a la 247: «Siguiente.» | (no hay Titulator en el Acto III; lo comenta Yoli si se vuelve) |

La consecuencia dura menos de 15 s y siempre termina con el rival invitando a la revancha. La ayuda (regla 9) evita que
la segunda derrota sea por la misma carta.

### E.5 La ventana

```
┌ RESPONDER A TODOS ─────────────────── ACIERTOS 2/3 · FALLOS 1/3 ┐
│ De: Maripaz Remitido    Para: Todos    CC: Colchones Siestatón    │
│ Asunto: RE: RE: Llamar a Siestatón para pasarlos a la web          │
│ Cuerpo: «Si quieres lo vemos en una reunión cortita. Con catering.»│
│ Asignado a: B. Pollejo                                    +1  +1  ✗ │
└────────────────────────────────────────────────────────────────────┘
```

Altura: 45 px hoy (`duel.js:211`) → 63 px con la línea del cuerpo; el menú de 5 líneas cabe debajo sin solaparse en
320×200.

### E.6 Cambios en `engine/duel.js` (orientativos)

- `S.body` = texto del ataque; `drawHud` lo pinta con `wrap` a 2 líneas, entre Asunto y Asignado.
- Líneas 90-95: `opts` = aprendidas ∩ `deck` original (cortadas a 4, con la correcta asegurada) + 1 floja de
  `opp.weak[rot]` o `D.weakReplies[rot]`.
- Línea 119: tras `S.misses++`, `S.cc = opp.ccSteps[S.misses - 1]`; **mover la contestación de la floja antes** del
  `if (S.misses >= maxMisses)`.
- Líneas 139-145: `opp.defeatLine` antes de `T.defeatLine`; `api.inc('duel:' + id + ':perdido_n')`; `opp.onLose` hace la
  consecuencia; al volver, el mazo se rota para empezar por la carta que ganó.
- Barra: «ACIERTOS h/obj · FALLOS m/3» en texto (además de los sellos).

### E.7 Un duelo completo, jugado (D1, primera vez, ganado con un fallo)

Bruno sabe R08, R04, R11, R14 (y otras siete que no son de este mazo y **no salen**).

```
(La Sala Amazonas, vacía tras la estampida. Maripaz, sentada sobre el planillo.)
BRUNO: La página 7 está pendiente desde marzo.
MARIPAZ: ¿Desde marzo sin confirmar? Eso no es un cliente, es un exnovio.
MARIPAZ: Vale, los paso a la web. Pero alguien tiene que llamar a Siestatón.
MARIPAZ: Te lo pongo por escrito. Patrocinado.
```

**Asalto 1.** Ventana: Asunto «RE: Llamar a Colchones Siestatón para pasarlos a la web» · ACIERTOS 0/3 · FALLOS 0/3.

```
MARIPAZ: Esto te lo escribo desde el cariño más absoluto, cariño.
```

Cuerpo: «Esto te lo escribo desde el cariño más absoluto, cariño.» Menú:

```
1. Y yo te leo desde el más absoluto modo avión.
2. Y tú el que mejor delega. Cada uno con su don.
3. Espera sentado. Si encuentras silla.
4. O en un correo de una línea. Este. De nada.
5. Te lo miro y te digo.
```

```
BRUNO: Y yo te leo desde el más absoluto modo avión.
(+1. Hilo: «planta.vestibulo@: +1. Totalmente de acuerdo con Bruno.»)
MARIPAZ: Uy. Eso tiene tarifa.
```

**Asalto 2.** ACIERTOS 1/3.

```
MARIPAZ: Hazlo tú, que escribes divinamente. Lo digo como clienta.
```

El jugador duda y elige la 4.

```
BRUNO: O en un correo de una línea. Este. De nada.
MARIPAZ: Muy bonito. Cero euros.
(Fallo. Asunto: «RE: RE: Llamar…». CC: Colchones Siestatón. FALLOS 1/3.)
```

**Asalto 3.** El ataque fallado pasa al final del mazo.

```
MARIPAZ: Me quedo a la espera de tus comentarios. Facturando.
BRUNO: Espera sentado. Si encuentras silla.
MARIPAZ: (mira su silla, mira el planillo, no se levanta) Me lo apunto para un patrocinio.
```

(Esa acotación es de dirección: Maripaz se queda quieta; el chiste lo hace la imagen, no una línea.)

**Asalto 4.** ACIERTOS 2/3.

```
MARIPAZ: Si quieres lo vemos en una reunión cortita. Con catering.
BRUNO: O en un correo de una línea. Este. De nada.
(+1. ACIERTOS 3/3.)
```

**Remate.**

```
MARIPAZ: ¿Y quién me firma que esa página es de la redacción, cariño?
(Las réplicas se apagan. Bruno: [Adjuntar objeto] → café.)
MARIPAZ: Un café no es un contrato. Bueno, a veces. Pero este no.
(Bruno: [Adjuntar objeto] → ficha de la página 7.)
BRUNO: Ficha de la página 7. Sellada por Aurora. Impar: se ve mucho.
MARIPAZ: ...Aurora no sella nada sin café. Has invitado a la correctora.
MARIPAZ: Vale, llamo yo. Desde mi mesa, que el teléfono de aquí es de Dirección.
(«Asignado a: Maripaz Remitido», en verde. Gong lejano.)
MARIPAZ: Hueco libre. Faldón de 23 líneas. Impar, cariño: que se vea.
```

Sale `casilla_hueco`. Duración estimada: 62 s con la lectura del motor y 6 s por decisión.

**La misma partida, perdida** (tres fallos): tras el tercero, Maripaz contesta la floja, dice «Asignado a ti, cariño. El
teléfono de Siestatón es este.», se juega la llamada al contestador (E.4), y al Hablar otra vez el primer ataque es el
que ganó Maripaz, con su asterisco en la libreta.

---

## F. Cinco recados convertidos en chiste de situación

Cada uno sustituye un recado o una repetición medidos en §A.3. Todas las líneas habladas, ≤ 80 caracteres.

### F1. La estampida (sustituye a «coger el planillo y bajarlo a Maripaz», pasos 27-29)

**Escena jugable.** Sala Amazonas, Acto II. Gervasio preside; tres redactores de Mercados; **Maripaz sentada al fondo de
la mesa**; mini-cruasanes, catorce botellines en fila, el orden del día en la pantalla.

**Pasos.** (opcional) Mirar orden del día → Hablar Gervasio → «Bueno… ¿y cuáles son los siguientes pasos?» → la
estampida → Hablar Maripaz → «La página 7 está pendiente desde marzo.» → D1.

**Qué se ve.** Tras la pregunta, un segundo de silencio y las tres cabezas de Mercados se levantan a la vez. Luego
quince segundos de slapstick: sillas que giran solas, los mini-cruasanes en arco, un botellín que cae y arrastra a los
otros trece en dominó, los tres redactores en fila hacia la puerta; el último vuelve, coge medio cruasán y sale. Gervasio
sale el último, con sus tres móviles en la mano. Maripaz no se ha movido.

```
GERVASIO: Estamos en el punto tres. Llevamos en el punto tres desde marzo.
MARIPAZ: Y yo esperando a Siestatón desde marzo. El café lo patrocino yo.
BRUNO: Bueno... ¿y cuáles son los siguientes pasos?
(Silencio. Las tres cabezas de Mercados se levantan a la vez.)
GERVASIO: Los... siguientes...
MERCADOS 1: ¡Tengo un directo!
MERCADOS 2: ¡Se me enfría el Ibex!
MERCADOS 3: ¡Tengo el coche en doble fila desde marzo!
(Estampida. El dominó de botellines. El cruasán.)
GERVASIO: (desde la puerta, con un móvil en cada mano) Lo hablamos.
(Portazo. Silencio. Maripaz, sentada.)
BRUNO: ¿Usted no huye?
MARIPAZ: Esta sala la tengo pagada hasta las nueve, cariño. La amortizo.
MARIPAZ: Y estoy sentada en el planillo. La página 7 no se mueve sin mí.
BRUNO: Se han dejado catorce botellines. Y una comercial.
```

Mirar el orden del día después: «Todo tachado. Hasta "Siguientes pasos". Alguien lloraba.» (se queda,
`sala_amazonas.js:82`). Mirar la mesa: «Debajo de Maripaz asoma el planillo. Página 7: COLCHONES SIESTATÓN.»

### F2. El torrente de Gertrudis (sustituye a «Buenas noches» ×3 del paso 20)

**Escena jugable.** Vending, Acto I. Es el mismo paso 14 de siempre; lo que cambia es lo que pasa después.

**Qué se ve.** El LCD verde, que hasta ahora daba errores, se acelera: los chismes se encadenan, cada vez más rápido;
Bruno escribe en la libreta cada vez más deprisa (animación `reach` repetida); el aviso «Réplica apuntada en la libreta»
sale cuatro veces seguidas; al final, Bruno se sacude la mano.

```
BRUNO: Buenas noches, Gertrudis.
GERTRUDIS: NADIE ME SALUDABA DESDE 2019.
(Muele. Pita. Cae un vaso.)
GERTRUDIS: CORTADO. DE QUÉ, NO SE PREGUNTA.
GERTRUDIS: SIETE AÑOS SIN QUE NADIE ME HABLE. TENGO COSAS GUARDADAS.
GERTRUDIS: CHISME: EL DE BOLSA A YOLI: "ESTO LO NECESITABA PARA AYER".
GERTRUDIS: YOLI: "AYER ESTABA CON LO DE ANTEAYER. PÍDESELO A MAÑANA".
BRUNO: Me lo apunto.
GERTRUDIS: CHISME: GERVASIO A NEMESIO: "ES QUE TÚ ERES EL QUE MEJOR ESCRIBE".
GERTRUDIS: NEMESIO: "Y TÚ EL QUE MEJOR DELEGA. CADA UNO CON SU DON".
BRUNO: Me lo apun...
GERTRUDIS: CHISME: ÍÑIGO A PACO: "ESTAMOS ANALIZANDO TODAS LAS OPCIONES".
GERTRUDIS: PACO: "O SEA, QUE NO SABÉIS QUÉ HACER, PERO EN TABLA DINÁMICA".
BRUNO: Más despacio, que escribo a mano.
GERTRUDIS: NO. ME HAS SALUDADO. AHORA ME AGUANTAS.
GERTRUDIS: CHISME: MARIPAZ A BEGOÑA: "ESTO LO VEMOS EN UNA REUNIÓN RÁPIDA".
GERTRUDIS: BEGOÑA: "O EN UN CORREO DE UNA LÍNEA. ESTE. DE NADA".
BRUNO: (sacudiendo la mano) Llevo una réplica por dedo.
GERTRUDIS: CHISME: LA PLANTA DEL VESTÍBULO ES DE PLÁSTICO.
BRUNO: Ese no me sirve para nada.
GERTRUDIS: YA. ESE ERA PARA MÍ. QUÉ DESCANSO.
```

Saludos siguientes: «BUENAS NOCHES, VACANTE. CAFÉ, UNO POR PERSONA NUEVA. TÚ YA ERES DE LA CASA.» y un chisme de relleno.
Se acaba el segundo café inútil (crítico, error 5). Los chismes de R03 y R14 cambian de protagonista porque Borja se va.

### F3. Apagar la Redacción desde el sótano (sustituye al candado ticket → enchufe y a la doble visita a Sistemas)

**Escena jugable.** Sistemas, Acto II. Paco de espaldas, frente a sus monitores; el contador LED; el registro; **la regleta
R-3** (hotspot nuevo) con una brida y una etiqueta; la rejilla del suelo.

**Pasos.** Hablar Paco → «¿Y por qué no va?» → Mirar registro → Tirar regleta → Hablar Paco (ya atiende).

**Qué se ve.** Al tirar: clac; las luces de un armario se apagan; un segundo de nada; por la rejilla del suelo llega,
amortiguado y en el color de Yoli, el grito de arriba. El contador LED salta de 48.212 a 48.530 de golpe, con un pitido
por cada centena. Paco no se ha girado.

```
PACO: No atiendo. Tengo 312 tickets que dicen «el CMS no va».
PACO: Y uno que dice «el CMS no va, URGENTE». Es el mismo, con mayúsculas.
BRUNO: ¿Y por qué no va?
PACO: Si lo supiera, tendría 311. Está todo en el registro. Nadie lo lee.
(Mirar registro de tickets)
BRUNO: Ticket nº 1, julio: «Alta becario Rubén». Pendiente.
BRUNO: Ticket nº 2: «Alta herramienta Herminia, de Infografía». Denegado.
BRUNO: Motivo: «No ha pasado por Desarrollo». Firmado: Nemesio.
BRUNO: Ticket nº 3, 2017: «El CMS se cuelga con la pantalla de la Redacción».
BRUNO: «Se alimenta de la regleta R-3 de este CPD. Propuesta: apagarla.»
BRUNO: Reportado por Diseño y Producto. Estado: no prioritario.
(Mirar regleta)
BRUNO: Regleta R-3. Brida: «PANTALLA DE DIRECCIÓN. NO TOCAR».
BRUNO: Debajo, a boli: «ni aunque lo diga el ticket 3». Letra de Paco.
(Tirar regleta)
BRUNO: El ticket 3 es de 2017. La brida, de 2019. Manda el más antiguo.
(Clac. Silencio. Por la rejilla, de muy lejos:)
YOLI: ¡ESTAMOS CIEGOS! ¿HAY ALGUIEN LEYENDO? ¿HAY ALGUIEN AHÍ FUERA?
CORO: ¡Ha sido Diseño!
BRUNO: (a la rejilla) He sido yo. Pero gracias.
(El contador salta. Bip, bip, bip, bip.)
PACO: Trescientos dieciocho tickets nuevos. Todos dicen «el CMS ya va».
PACO: Se ha arreglado el CMS. Nadie sabe cómo.
PACO: Ya me han abierto un ticket para saberlo.
PACO: (se gira por primera vez) Tengo un hueco. Uno. ¿Qué querías?
```

Si el jugador tira de la regleta sin leer el registro, funciona igual (sin candado): falta solo la línea del ticket 3, y
Bruno dice «No sé qué he apagado. Pero arriba alguien grita de alegría. Creo.». El enchufe de la Redacción, antes, en dos
globos: «Cinta: "NO DESENCHUFAR". Y una brida que baja por la pared.» / «Etiqueta: "R-3, CPD. Paco".»

### F4. La salida en valor (sustituye a «descopear» + Dar pósit a Paco, pasos 40-42)

**Escena jugable.** Redacción, Acto III, junto al kanban (Nemesio ya en la mesa de Infografía, §C.7). Bruno lleva el álbum
de Pilar y ha oído a Rubén decir que la frase de Íñigo es suya.

**Pasos.** Dar álbum a Nemesio → (opciones) «No es una baja: es una salida en valor.»

**Qué se ve.** Nemesio hojea el álbum clasificando cada foto en voz alta. Cuando oye la frase, se queda quieto tres
segundos; las tres espaldas del coro se giran por primera vez en el juego. Nemesio dibuja con rotulador una columna nueva
en el tablero (`posit_descopeado` cambia el dibujo del kanban: columna «SALIDA EN VALOR»), mueve el pósit, y suena un pitido
en toda la planta. Al fondo, el ascensor hace «tin» y se abre vacío; en el suelo, un papel. Segundo «tin»: sale Rubén, con
un táper vacío, y va derecho a la ventana.

```
NEMESIO: A ver. Cena de Navidad. Al fondo, un chico pálido. Con táper.
NEMESIO: Photocall. Al fondo, el mismo. Yendo al baño.
NEMESIO: Existió. Existe. Va mucho al baño. Eso, a HECHO.
NEMESIO: Pero su pósit sigue en POR HACER. Un pósit sale hecho o muerto.
NEMESIO: Darle de baja no es hecho. Es despido. Y despido es otra columna.
BRUNO: ¿Y si le hacemos un funeral? Con flores. Y diapositivas.
NEMESIO: No me tientes. Ya tengo la plantilla.
BRUNO: No es una baja: es una salida en valor.
(Nemesio, quieto. Tres segundos. Las espaldas del coro se giran.)
NEMESIO: ...Eso no es ni hecho ni muerto.
NEMESIO: Es consultoría.
(Rotulador. Una columna nueva: SALIDA EN VALOR. El pósit, dentro.)
NEMESIO: Columna nueva. La primera desde 1998.
NEMESIO: El tablero está integrado con el registro de Paco.
NEMESIO: Es lo único integrado de esta casa. No se lo digas a nadie.
(Tin. El ascensor se abre. Vacío. En el suelo, un papel.)
BRUNO: «Ticket nº 1: Alta becario Rubén. CERRADO. No subo. Nunca subo. Paco.»
(Tin. Sale Rubén. Va a la ventana.)
RUBÉN: Paco ha mandado primero el papeleo. Es el procedimiento.
RUBÉN: Estoy esperando a que salga el sol. Me han dicho que existe.
BRUNO: La frase con la que Íñigo despide a la gente acaba de liberar a Rubén.
RUBÉN: Y la escribí yo. SEGUIREMOS INFORMANDO. Perdón.
```

Si Bruno aún no sabe `rep_13`, la opción no sale y Nemesio cierra: «Tráeme algo que no sea ni hecho ni muerto. Y no
existe.» (pista doble con la abuela, §D.5). El funeral sigue de opción-chiste.

### F5. El recorte por fax (sustituye a «subir la pieza a Begoña y volver», pasos 36-37)

**Escena jugable.** Redacción de papel, Acto II, con el fax ya con papel y la pieza escrita.

**Pasos.** Dar pieza a Teodoro → Mirar fax (opcional) → Usar pieza con fax.

**Qué se ve.** Bruno pulsa la tecla 2; el fax traga las 31 líneas; diez segundos de silencio con Teodoro mirando el fax
como un padre en un paritorio; timbre; el fax escupe la pieza más corta, con sello. Al pasar a cualquier sala salta L3 de
Evaristo (la coma del 415), que ahora llega con más sentido: el recorte ha viajado por fax y Evaristo lo ha leído en el
triplicado.

```
TEODORO: Treinta y una líneas. El faldón tiene veintitrés.
TEODORO: Me sobran ocho. No recorto: yo solo mido.
TEODORO: Recortar es cosa de la ventanilla de arriba. Tecla 2.
(Mirar fax)
BRUNO: Marcación rápida: 1, GOYITA. 2, ADMINISTRACIÓN. 3, F.P.
BRUNO: En la tecla 3, a boli: «no contesta, imprime».
(Usar pieza con fax)
BRUNO: Tecla 2. Treinta y una líneas, rumbo a Begoña.
(El fax traga. Silencio. Diez segundos. Timbre.)
BEGOÑA: ADMINISTRACIÓN. RECIBIDO A LAS 19:07. COMO TODO.
BEGOÑA: TODA PIEZA SUFRE EL RECORTE ESTÁNDAR DEL 26 %. SIN EXCEPCIONES.
BEGOÑA: RECORTO POR ABAJO. SE PIERDE LA CONCLUSIÓN, QUE NO LA LEE NADIE.
(Sale la pieza, más corta, con sello rojo.)
BRUNO: Treinta y una por cero setenta y cuatro... veintitrés. Exacto.
BEGOÑA: NI UNA LÍNEA MÁS. NI UN CÉNTIMO MENOS. EL ORIGINAL, PARA MÍ.
TEODORO: Veintitrés. Cabe. Begoña recorta a distancia. Como las nóminas.
AURORA: Ojalá alguien recortara sin leer. Ah, que lo hace.
```

(Las líneas de Begoña salen del fax con su color y el prefijo «ADMINISTRACIÓN (fax):», igual que Teodoro.) Darle la pieza
a Begoña en persona sigue funcionando (`administracion.js:150-153`): el puzle no cambia de lógica, cambia de cartero.

---

## G. Epílogo y créditos

### G.1 Estructura

| Hoy (`final.js`) | Propuesta |
|---|---|
| Vestíbulo: Rubén, Íñigo, Gervasio, periódico, Celestino, [Evaristo], plaza, abuela | Igual, **más Ramírez** (antes del garaje), plaza acortada, abuela **al final** con un golpe nuevo |
| Redacción: Yoli y el KPI, [infografía], coro, «Diseño soy yo», cuarta pared | **Fuera.** El KPI de la lectora pasa a una línea de créditos; la cuarta pared, fuera |
| Créditos con 4 líneas de Diseño, Infografía, Valentín | Créditos sin Diseño; termina en Eventos y en la **fe de erratas como última imagen** |
| Poscréditos (Ramírez) e impresora «BANDEJA 2» | Ramírez, dentro del epílogo; la impresora, una línea de créditos |

Duración: el epílogo de hoy son 67 líneas (≈ 3 min, crítico §3.9); este, ≈ 43 (≈ 2 min).

### G.2 Epílogo, línea a línea

```
(Rótulo) Sábado, 6:00.
(Vestíbulo. Amanecer en la puerta de la calle. Celestino, Rubén, Bruno.)
RUBÉN: ¿Sigue gobernando el mismo?
CELESTINO: ¿Tú eres el nuevo?
RUBÉN: Sí.
(Sale Íñigo del ascensor con su caja de cartón: pósits, matriz, la taza.)
CELESTINO: ¿Íñigo? ¿El becario de marzo del 98? ¡Te dejaste la taza!
ÍÑIGO: ...Me la quedo.
GERVASIO: Íñigo. Hay una beca en Mercados. Lo hablamos.
ÍÑIGO: ¿Cuándo?
GERVASIO: Ahora. Lo estamos hablando, ¿no?
(Salen los dos.)
CELESTINO: Ha llegado la furgoneta del polígono. Recién salidos.
(Plano detalle: la página 7.)
BRUNO: Bien escrito. Bruno. Pellejo. Con jota y dos eles.
CELESTINO: ¡Hidrovoltia se lanza a por el Robledal! ¡Eso es opa, árbitro!
BRUNO: Celestino, que la noticia es mía.
CELESTINO: ¿Tú eres el nuevo?
[solo con correo_evaristo_listo]
EVARISTO: Pellejo. Lo he revisado en el periódico. Con jota y dos eles.
EVARISTO: Le escribiré un correo para felicitarle.
BRUNO: ¿Y si me lo dice ahora?
EVARISTO: (piensa. Mucho.) ...Felicidades. La primera vez que lo digo sin adjunto.
[fin del bloque]
(Se abre la puerta de la calle. Entra Ramírez, con un cruasán.)
RAMÍREZ: Buenos días. ¿Me he perdido algo?
CELESTINO: ¿Tú eres el nuevo?
RAMÍREZ: Ramírez. De Bolsa. Bajé a desayunar.
CELESTINO: Tu chaqueta lleva toda la noche en una reunión. Asintiendo.
RAMÍREZ: ¿Y qué ha decidido?
CELESTINO: Que la rotativa no se apaga.
RAMÍREZ: Siempre fue muy sensata.
(Ramírez sube. Celestino saca un fax del mostrador.)
CELESTINO: Esto ha llegado por fax. De la Redacción de papel. Para ti.
CELESTINO: «PLAZA 1. NO LA USO DESDE 1997. ES TUYA, CHAVAL.»
BRUNO: No tengo coche.
CELESTINO: La línea de sucesión acaba de enloquecer.
(Suena el móvil. Primer plano: ABUELA.)
ABUELA: ¿Bruno? ¿Has comido?
BRUNO: Abuela. Salgo en el papel. Página 7. Con mi nombre bien escrito.
ABUELA: Ay, hijo. El papel lo dejé en 2011, que me manchaba el sofá.
BRUNO: ...
ABUELA: Yo te leo todas las mañanas en el móvil. Te pongo un corazoncito.
BRUNO: ¿En todo?
ABUELA: En todo. Hasta en lo del Euríbor.
ABUELA: No lo entiendo, pero lo escribes muy bonito.
[solo con rumor_firma_n ≥ 4]
ABUELA: En el pueblo digo que eres el dueño. Que suena más.
BRUNO: Abuela...
ABUELA: Los rumores, en el pueblo, son como el periódico. Si lo dice mucha gente, sale.
[fin del bloque]
ABUELA: Y te pongo «abrígate». Que nunca contestas.
(Bruno teclea con el pulgar. En el móvil: «Bruno Pellejo ha respondido: Abrígate tú.»)
ABUELA: ...¡Me ha contestado! ¡Me ha contestado el periódico!
(Fundido a negro.)
```

El último golpe es de la abuela y es un chiste de situación: ella cree que le ha contestado el periódico, y en cierto modo
tiene razón. La línea larga de los rumores se parte en dos globos («Los rumores, en el pueblo, son como el periódico.» /
«Si lo dice mucha gente, sale.»).

### G.3 Créditos, línea a línea

Mismo motor (`api.credits`), mismo fondo de periódico que sube y el LCD de Gertrudis arriba («E-00: HOY SÍ. DISFRUTADLO,
QUE NO SE REPITE.»). Se quita el hilo de Tadeo de la esquina (`final.js:235-240`), que hoy entra justo encima del final.

```
FE DE ERRATAS
Una aventura de cierre

Guion · Asignado a: el equipo de guion
Puzles y duelos · Asignado a: quien no se escaqueó
Motor y pegamento · Asignado a: Sistemas (ticket nº 4)
Fondos · Asignado a: tres artistas con tipómetro
Música · Asignado a: un secuenciador de onda cuadrada
[hueco: plano de Aurora leyendo la fe de erratas, quitándose las gafas, desmayándose sobre el Libro de Estilo]
Audiencia · Asignado a: una lectora. Cuarenta y siete minutos por pieza.
Controlling · Asignado a: el único que leyó hasta el final.   [o: un correo que nadie quiso oír]
Reenvíos · «RV: ¿Esto lo ha escrito la IA?!!» · «RE: No. Un becario.»
Impresión · Asignado a: la impresora de la tercera. Bandeja 2: instalada.
Infografía · Asignado a: Herminia (alta pendiente de revisión, en marzo).
Salas · Asignado a: Ramírez (viernes, 20:59, recurrente).
Rumores · Asignado a: el ficus del vestíbulo (micrófono de 1994).
Material · Asignado a: Custodia Precinto. Devuélvanle el boli.
Plazas de garaje · Asignado a: Bruno Pellejo (plaza 1, sin coche).

Ninguna rotativa fue apagada durante el desarrollo de este juego.

Sala Polivalente · Cuenta atrás: 00:04:59. Por fin empezamos.
Era la presentación de una fe de erratas.
La primera de la historia con photocall.

┌─────────────────────────────── FE DE ERRATAS ───────────────────────────────┐
  En la edición de ayer, donde decía «inteligencia artificial»
  debía decir «Rubén».
  Donde decía «Por Bruno Pellejo»
  debía decir «Por Bruno Pellejo».
  Lamentamos el acierto.
└──────────────────────────────────────────────────────────────────────────────┘
Gracias por jugar. Abrígate.
FIN
```

El recuadro de la fe de erratas pasa del principio (`final.js:199-205`, con su marco en `creditsDraw`) al final: se queda
quieto en el centro (`holdY`) hasta el clic, y el clic vuelve al título. No hay poscréditos ni impresora después. Eventos,
que dirección protege, es el puente hacia la última imagen. **Desaparecen**: «Errores: Diseño (que no fue)», «Diseño y
Producto: Entregado a las 18:29», «Dirección de arte: Valentín Retícula», «Marketing: Borja», y la cuarta pared de Bruno.
«Diseño y Producto» e «Infografía» no aparecen juntos (solo sale Infografía). El ticket de «Motor y pegamento» pasa al nº
4 porque el nº 2 es ahora el de Herminia (§F3).

---

## H. Lo que no tocaría y los riesgos del plan

### H.1 No tocaría

- **El arranque:** intro 7.1 entera, el torno con la foto («BIENVENIDO, VACANTE»), Celestino.
- **Los cuatro «¡ajá!»:** la foto en la VACANTE; las copias rechazadas como papel del fax (y toda la nota de gasto de
  Begoña, `administracion.dialogos.js:54-135`); el recorte del 26 % (cambia el cartero, no la lógica); Rubén como
  Titulator (escena 7.3 y sus pistas: súplica, atún, RV).
- **La llamada de la abuela del final** (todas sus líneas actuales) y la fe de erratas («Lamentamos el acierto»).
- **Los titulares reactivos** (solo se amplían y salen solos al pasar).
- **El arte de las salas**, salvo la regleta, el planillo bajo Maripaz y la columna nueva del kanban.
- **Teodoro solo habla por fax**, «Goyita. Tira.», el teléfono rojo.
- **El clímax:** la 247, el empujón, el reverso «Atrezo – Focus group 2014», la factura de Begoña, el héroe de la coma.
- **Eventos entero** y Pilar.
- **Los nueve verbos**, los relojes del edificio en las 20:59, «¿Tú eres el nuevo?», las llamadas de Evaristo.

### H.2 Riesgos

| Riesgo | Por qué | Mitigación |
|---|---|---|
| Se pierde complicidad con el equipo | Se van tres retratados (Leoncio, Anselmo, Borja) y Valentín queda en tres líneas | Cada guiño sobrevive en forma mínima (§B.3) y tres pasan al camino crítico; enseñar el plan a los retratados antes de cortar |
| La planta 2 se queda vacía en el Acto II | Maripaz se muda a la Sala y Borja se va | Maripaz vuelve a Marketing tras D1 y se la ve al teléfono al pasar (§C.5); el Acto I conserva la planta tal cual |
| El recorte por fax toca un puzle protegido | Cambia cómo llega la pieza a Begoña | Ir en persona sigue valiendo; la deducción (el cartel del 26 %) es la misma; probarlo con jugadores antes de quitar nada |
| Los 4 chismes en el Acto I | Se adelanta el aprendizaje de réplicas | Es una escena, no un trámite; el Acto II sigue enseñando 5 réplicas (rep_02, 06, 08, 09, 12) |
| El menú corto facilita el duelo | Con 4 réplicas, acertar al azar es 1/4 | Paráfrasis (hay que entender), CC que escala y remates; medirlo en pruebas: objetivo, ≤ 1 derrota por duelo en primera partida |
| «Salida en valor» puede no deducirse | Es una llave verbal | Tres pistas en pantalla (Nemesio: «despido es otra columna»; Rubén: «Mía»; libreta) + la abuela; el funeral como opción falsa que orienta |
| Gervasio en la puerta de los Despachos | Hay que colocarle sin tapar la puerta ni el atril | Posición nueva en `art/pajarera.art.js` y revisión con `tools/sala.mjs pajarera` |
| La hora que avanza contradice los relojes | Puede leerse como error | La contradicción se convierte en el chiste del clímax (20:59 en los dos) |
| Pruebas: casi todo el juego cambia de número de paso | `walk-data.mjs` pasa de 46 a 44 pasos | Reescribir `walk-data.mjs`; revisar los números fijos de `walkthrough.mjs` (ALT), `play-mouse.mjs:283-369`, `escenas.mjs`, `fuzz.mjs`, `review.mjs` (planillo) y la tabla X de `extras.mjs` |
| Partidas guardadas antiguas | Objetos y flags que desaparecen | Migración al cargar (§B.4) |
| El coro, menos frecuente, puede no oírse | Cada 60-120 s | Sus dos momentos buenos (7.2 y la rejilla) son escenas, no ambiente |

**Orden de trabajo recomendado** (de más retorno a menos coste): 1) epílogo y créditos (S); 2) coro, Valentín y el
`setInterval` del ambiente (S); 3) abuela por objetivo (M); 4) duelo: cuerpo visible, menú corto, flojas, derrota (M);
5) Gertrudis, CMS en Sistemas, D1 en la Sala, recorte por fax, Gervasio en la puerta, salida en valor (M-L, con
`walk-data.mjs` nuevo); 6) reparto (Leoncio, Anselmo, Borja, rumores B y D) (M); 7) Redacción a ~1.000 px (L, arte).
