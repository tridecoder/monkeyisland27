# FE DE ERRATAS — ENMIENDA E2 (prevalece sobre PLAN_COMEDIA.md y su ENMIENDA E1)

> Respuesta a la partida del dueño tras la reescritura de comedia (commit `9679041`) y a la segunda crítica
> (`docs/informes/critica2/CRITICA_JUEGO_2.md`, comedia 6,5). Orden del dueño: «La 5 a la trama principal; Infografía y
> la IA se pierden y falta la frase de Anselmo; no se entiende que Herminia es una IA; Marketing no me gusta: quita a
> Borja y conviértelo en un objeto; recupera a una Maripaz muy divertida que lo venda todo; haz la 1, 2, 3 y sobre todo
> la 4. El juego ha empeorado». Orden posterior: **«Fundiría a los dos de Desarrollo en un personaje. Se queda solo el
> director de Desarrollo y el coro de desarrolladores.»**
>
> Este documento es **guion para implementar al pie de la letra**. Cada texto entre «» o en bloque `text` es literal.
> Las acotaciones (entre paréntesis) son acciones, nunca texto en pantalla. `fichero:línea` = línea actual del árbol de
> trabajo (rutas relativas a `content/` salvo que se diga otra cosa). Cuando dos secciones citan la misma línea, manda la
> sección más específica (orden: §9 > §5 > §4 > §3 > §2 > §6 > §8 > §7).

## Índice

0. Resumen y decisiones
1. Inventario de pérdidas (74a09ee → hoy)
2. Anselmo, Infografía e IA (con la **fusión Nemesio → Anselmo**, §2.6)
3. Marketing: Borja pasa a objeto
4. Maripaz, directora de Comercial
5. Don Evaristo en el camino principal (una sola coma)
6. Las 38 líneas clave reescritas
7. Recorte del 20–25 %
8. La muletilla «desde [fecha]»
9. Continuidad (B3, B4, B5, B8, B9, B10 y otras)
10. Cambios en el recorrido, pistas y ficha
11. Reparto en paquetes
12. Verificación

---

## 0. Resumen y decisiones

**Diagnóstico («el juego ha empeorado»).** La reescritura hizo bien lo estructural (pistas, ficha, final, situaciones
nuevas) pero, al podar y uniformar, **quitó a tres personajes su motor cómico** y dejó otros dos sin explicar:

1. **Anselmo perdió su mejor frase** («La IA es de fuera. Pero el prompt es de dentro. Eso la hace nuestra.») y su
   contradicción central: odia lo de fuera… salvo cuando lo usa él. Sin ella, su celo es una manía; con ella, es un chiste.
2. **Herminia dejó de ser una IA en pantalla**: el objeto se llama «Herminia (portátil)», escribe «PORTÁTIL: ›» y nadie
   dice «IA» delante del jugador hasta el Acto II. La guerra Leoncio–Anselmo quedó en dos escenas de Act. II y III.
3. **Maripaz perdió el «cariño» y la factura**: se sustituyó por una letra pequeña «(*…)» en todas sus frases, que es un
   chiste de lectura (no de voz) y, repetido, suena a errata. Se quedó sin su gag de vender cosas que no se venden.
4. **El conflicto Titulator–Herminia** (la IA falsa que la casa compra contra la IA de verdad que la casa bloquea), que
   era el centro temático, no se ve hasta el Acto III.
5. **Frases que antes se entendían se volvieron opacas** al recortarlas (el cotilleo del wifi de Celestino; la coma).

**Decisiones de esta enmienda:**

| # | Decisión | Dónde |
|---|---|---|
| D1 | Anselmo recupera la frase de los prompts (paso 34, obligatorio, y su árbol) y su contradicción | §2 |
| D2 | Herminia se presenta como IA en la escena 7.2 (obligatoria), frente al Titulator; pantalla «HERMINIA (IA):» | §2.2–2.3 |
| D3 | La guerra Leoncio–Anselmo, en cuatro escenas obligatorias: 7.2, paso 34, momento 8, paso 40 | §2.4 |
| D4 | **Nemesio desaparece**: Anselmo hereda su tablero, sus pasos (24 y 40), «salida en valor» y lo mejor de su voz | §2.6 |
| D5 | **Borja desaparece**: queda **el aro de luz de Borja**, con su móvil publicando solo (posts programados con huecos) | §3 |
| D6 | **Maripaz vuelve** a su «cariño» y a facturarlo todo, con gong, tarifas y paquetes; estrella de los pasos 25-26 y del epílogo | §4 |
| D7 | **Evaristo entra en el camino**: pasos nuevos 28 (escucharle) y 32 (Aurora bendice la coma y la manda por fax); su correo es el **tercer remate del duelo final** | §5 |
| D8 | Una sola trama de coma (fuera la de 4,15 €); fuera la frase críptica del clímax | §5.6, §9 |
| D9 | 38 líneas reescritas con otras formas de chiste; recorte del 20 % del texto existente del camino principal; «desde [fecha]» de 63 a 6 | §6–§8 |

**Recorrido:** **44 pasos** (42 + 2 nuevos sin cambio de sala), **28 cambios de sala (6/14/8)**, igual que hoy.

**Reglas del dueño que esta enmienda comprueba** (§12): elContable.es; sin director del periódico; «Reunión de
Dirección», nunca «Consejo»; Lector Medio nunca presidiendo; Diseño y Producto e Infografía nunca juntos (la escena 7.2
pierde el «¡Ha sido Diseño!»); Desarrollo sin mujeres y su machismo sin tocar (nada nuevo; Anselmo solo juzga el origen de
las cosas); «Diseño» ≤ 11 (baja uno); Valentín mudo; Tadeo sin sprite; Custodia en su ventanuco; Eventos y Pilar con el
cambio mínimo (§3.5); final intocable; líneas ≤ 80; ningún remate «… Como X.».

---

## 1. Inventario de pérdidas (74a09ee → hoy)

Método: extracción de todas las cadenas de `content/` en `74a09ee` y en el árbol actual (3.499 → 3.887); 848 cadenas de
`74a09ee` no existen hoy. De ellas, ~45 % eran remates «… Como X.», jerga o chistes de Diseño/Valentín quitados por orden
del dueño (no se recuperan). Lo que sigue es lo que **hacía gracia y se perdió sin motivo**, personaje a personaje.

| # | Quién / dónde | Qué había en 74a09ee (cita) | Qué hay hoy | Se recupera en |
|---|---|---|---|---|
| P1 | Anselmo, árbol | «La IA es de fuera. Pero el prompt es de dentro.» / «Eso la hace nuestra.» (`rooms/pecera.dialogos.js:158`; `docs/GUION_ADENDA.md:386`) | No existe | §2.3: paso 34 (obligatorio) y árbol [2] |
| P2 | Anselmo, saludo | «Alto. Esto es Desarrollo. ¿Traes algo de fuera?» / «Solo a mí.» / «Pase. Lo vacío no se integra, pero tampoco molesta.» | «¿De dónde vienes?… Un metro de fuera sigue siendo fuera» | §2.5, saludo |
| P3 | Anselmo, IA para los demás | «Y notas de gasto generativas para Begoña.» | «Un narrador del Ibex para Celestino» (se queda) | §2.5 [2] |
| P4 | Anselmo, CMS | «Solución de terceros. La pongo en mi revisión.» / «Mi revisión es en marzo.» | «…Próxima versión.» (bien; se queda) | — |
| P5 | Leoncio, el bloqueo | «Le he mandado cuarenta y un pósits. Me los devuelve con un "NO".» / «En su tipografía, que es fea.» | Solo un murmullo | §2.5, Leoncio [3] |
| P6 | Leoncio, su equipo | «Dejaron las chaquetas en las sillas, mirándola. Por respeto.» | No existe | §2.5, Leoncio [2] |
| P7 | Leoncio, el quesito | «Un quesito que suma 130 % no es un gráfico. Es una aspiración.» | «En tarta, eso es una invasión.» | §2.5, Leoncio [5] |
| P8 | Herminia, Mirar | «Herminia. Un portátil que hace infografías sola. Con nuestra tipografía.» / «Delante, dos sillas vacías con chaqueta. Mirándola.» | «Un portátil con pegatina "INFOGRAFÍA"» (no dice IA) | §2.2 |
| P9 | Nemesio | «Cierra la puerta al salir. No hay puerta. Ciérrala igual.» | No existe | §2.6, despedida de Anselmo |
| P10 | Nemesio, álbum | «Diles que en nuestros corazones está en Hecho.» | No existe | §2.6, N_SALIDA (Anselmo) |
| P11 | Maripaz, roll-up y objetos | «Ahora tú eres el anuncio, cariño. Te cobro el metro cuadrado.» · «Eso, cariño, es una baja de campaña. Te la facturo.» · «El roll-up no se toca, cariño. Está contratado hasta 2030.» · «Eso no es una venta, cariño. Es una ilusión. Y no la facturo.» · «El día que pagues tú, cariño.» · «¡Deja eso, cariño! Es una inversión a largo plazo.» | Mismas frases sin «cariño» y con «(*IVA aparte.)» detrás | §4.4 |
| P12 | Maripaz, cuerpo | «Uy, cariño. Eso lo facturo como experiencia de usuario.» · «A mí no se me coge, cariño. Se me contrata.» · «¿«Pellizco»? Eso no es un nombre, cariño. Es un formato publicitario.» | Ídem, con asterisco | §4.3 |
| P13 | Maripaz, D1 | «¿Llamar yo a Siestatón un viernes a estas horas? / Te lo pongo por escrito, cariño.» · «Eso no lo patrocina nadie, cariño. / Muy bonito. Cero euros.» | «Te lo mando por correo. Con copia.» · «(*Y de otra tarifa.)» | §4.5 |
| P14 | Maripaz, silla 113 | «Me has devuelto la silla, cariño. Te la facturo como mudanza.» | No existe (el micropuzle de Pilar se queda sin pago) | §4.4 |
| P15 | Maripaz, rumor C | «Teodoro es el dueño del edificio, cariño. Lo compró en el 97. Por fax.» | «(*Fuente: yo.)» | §4.2 |
| P16 | Celestino, cotilleo | «En el ascensor, Gervasio le dijo a uno: «Que esto no salga de aquí».» / «Y el otro: «Tranquilo: de aquí no sale ni el wifi».» / «Llevan tres años sin hablarse. Por el wifi.» | Versión cortada en la puerta + «Porque aquí no sale.» (opaca, crítica §3.1.3) | §6, L5 |
| P17 | Rubén, el precio | «Para Íñigo, soy una licencia. Factura 48.000 euros al mes.» | No existe: nadie une el Titulator con los 48.000 € antes de Evaristo | §5.4 (armario) |
| P18 | Paco, Herminia | «Esta casa da de alta antes a un portátil que a un chaval.» | Bruno: «…Lo apunto en «injusticias».» | §6, L16 |
| P19 | Aurora, Evaristo | «Y que su corbata es lo único bien puntuado de esta casa.» | No existe | §5.3 |
| P20 | Yoli | «Si cierra el papel, ¿quién me va a odiar con criterio?» (Acto III) · «Eso que sientes no es tristeza, Bruno. Es una caída del CTR.» | No existen | §2.7, la primera (la del CTR no: jerga) |
| P21 | Gertrudis, errores | «E-47: LLAMAR A SISTEMAS.» → «E-48: SISTEMAS NO CONTESTA.» → «E-49: YA SÉ QUE ERES TÚ OTRA VEZ.» → «E-50: ESTOY EN UNA REUNIÓN.» | Una sola, «E-31»; el chisme «LE DI UN E-47» queda sin preparar | §6, L17 |
| P22 | Tadeo, portátil | «RV: Nuestro CLS es 0,25…» / «Mide cuánto se mueve la página. Propongo atornillarla.» / «He pedido presupuesto a Ferretería Hermanos Tornillo.» · «Lazy loading…» / «Propongo aplicarlo a las reuniones.» / «Es lo primero sensato que leo hoy. Lo ha escrito una máquina.» | Cuatro mensajes sin gracia propia | §3.6 (sin siglas) |
| P23 | Borja | «¡Eso es de Eventos! Yo solo lo cuento. Antes de que pase.» | — | §3: es la idea del aro (publica antes de que pase) |
| P24 | Íñigo, Herminia | «La herramienta de Infografía. Gratis. No escala.» / «Lo que no se factura no existe.» | No existe | §2.3: escena 7.2 («Entonces no es una IA. Es un hobby.») |
| P25 | Teodoro, epílogo | «PLAZA 1. NO LA USO DESDE 1997. ES TUYA, CHAVAL.» | Se queda (resumida) | — |

**No se recupera (órdenes del dueño):** todo Valentín con voz (autorreferencias, «sprite», monitor con el juego), el coro
culpando a Diseño más allá del tope, el epílogo «Diseño soy yo», poscréditos y correos de Tadeo/Evaristo tras la tarjeta,
los remates «Como X.» (≈ 120 cadenas), la jerga de Core Web Vitals (LCP, CLS, INP) en pantalla.

**Lo nuevo que funciona y no se toca** (crítica §4): cafetera viral, fax de Teodoro (golpes A y B, D2, «VUELVE»), Rubén y
sus titulares, el enchufe y el apagón, la estampida, la abuela y sus pistas en tres niveles, la ficha viva, el final y la
tarjeta, Begoña y su 26 %.

---

## 2. Anselmo, Infografía e IA

### 2.1 La frase de Anselmo (encontrada)

Literal en `74a09ee`, `content/rooms/pecera.dialogos.js:157-158` (árbol `anselmo`, opción «¿Tu IA no es de fuera
también?»), y en `docs/GUION_ADENDA.md:386` del mismo commit:

```text
ANSELMO: La IA es de fuera. Pero el prompt es de dentro.
ANSELMO: Eso la hace nuestra.
```

La reescritura la borró al rehacer el árbol (E1.6). Vuelve **mejorada en lo que recuerda el dueño** («los modelos son
externos, los prompts internos») y **en un sitio obligatorio**, el paso 34 (antes 32), delante de Leoncio, que es quien
la paga:

```text
BRUNO: ¿Y vosotros no usáis IA de fuera?
ANSELMO: El modelo es de fuera. El prompt es de dentro.
ANSELMO: Eso lo hace nuestro.
LEONCIO: El prompt de Herminia lo escribí yo. En esta mesa.
ANSELMO: A un metro de mi cinta. Fuera.
```

Y una segunda vez, opcional, en su árbol (§2.5, opción [2]).

### 2.2 Que se entienda que Herminia es una IA

Herminia sigue siendo **objeto** (`herminia_portatil`), sin árbol ni voz propia. Cambia:

| Qué | Hoy | E2 |
|---|---|---|
| Nombre a la vista (`name`, `pecera.js:233`) | «Herminia (portátil)» | **«Herminia, la IA de Infografía»** |
| Prefijo de pantalla (`pecera.voces.js`, voz `'H'`) | sin nombre; en guion «PORTÁTIL: ›» | **«HERMINIA (IA) › »** delante de cada salida, en su color `#FF8C3C`. Reglas de formato de E1.1 (una línea de datos con «·», sin verbos conjugados, ≤ 3 por escena); el texto tras el prefijo, ≤ 64 caracteres |
| Primera vez que se ve | Acto II (paso 32) | **Escena 7.2** (Acto I, obligatoria): Leoncio la presenta como IA frente al Titulator (§2.3.1) |
| Lo que dice Leoncio | «Mi herramienta» | **«Mi IA»** (en la 7.2 y en el árbol); la regla E1.2 «nunca la llama "la IA"» se sustituye por: la llama «Herminia» o «mi IA» |
| Arte (`pecera.art.js`, `drawHerminia`) | pegatina «INFOGRAFÍA» | se añade una segunda pegatina blanca de 5×3 px con «IA» en rojo junto a la de «INFOGRAFÍA» (estados `cinta_1`, `cinta_2`, `anexionada`; en `paquete` no se ve) |

**Mirar `herminia_portatil`** (sustituye a `pecera.js:236-239`):

| Estado | Texto |
|---|---|
| `cinta_1` | «Herminia, la IA de Leoncio: un portátil que hace solo las infografías.» / «Delante, dos sillas vacías con chaqueta. Mirándola. Encima, una tira de cinta.» |
| `cinta_2` | «Dos tiras de cinta de Desarrollo. Por debajo, la IA sigue haciendo gráficos.» |
| `paquete` | «Envuelta entera. «PENDIENTE DE INTEGRAR». Por un hueco, la pantalla trabaja.» |
| `anexionada` / `desenvuelta` | «Sin cinta. Pegatina nueva: «DESARROLLO». Los gráficos, idénticos.» |

Resto de verbos del portátil (`pecera.js:241-262`): igual que hoy, con el prefijo nuevo y estos dos cambios:
`hablar` → «HERMINIA (IA) › saludo recibido · hola: 100 %» / BRUNO «Me ha entendido a la primera. Aquí eso no pasa.»;
`usar` (Actos I-II) → «HERMINIA (IA) › quesito de Desarrollo · suma: 130 % · corregir: bloqueado» y Leoncio igual.

### 2.3 Escenas obligatorias de Infografía (texto completo)

#### 2.3.1 Escena 7.2 · presentación del villano (sustituye a `pecera.escenas.js:81-147`)

Objetivos: presentar a Íñigo y el Titulator **en un tercio menos de líneas** (de 26 a 17; Íñigo de 13 a 10, con la IA de Leoncio dentro) y poner, desde el
minuto diez, el contraste central: **la IA falsa que se compra frente a la IA de verdad que se bloquea**. Se quitan el
«¡Ha sido Diseño!» del coro (Infografía y Diseño no coinciden), el intercambio Nemesio–Yoli y el cierre de Bruno.
Encuadres: Íñigo en 232+D; Infografía en 800 (el mismo del paso 34; Valentín, en 1240, queda fuera de plano).

```text
(7.2 · primera entrada en la Redacción con torno_abierto)
YOLI: ¡No entra nada! El CMS, el programa de publicar, lleva dos horas colgado.
(Las luces parpadean. Entra Íñigo con un portátil plateado bajo el brazo.)
ÍÑIGO: Buenas noches. Íñigo Sinergia, Optimal Brains. No vengo a despedir a nadie.
ÍÑIGO: Vengo a reimaginar el perímetro.
ÍÑIGO: Os presento al Titulator 3000. Inteligencia artificial de titulares.
(Plano detalle: EL PORTÁTIL DE ÍÑIGO, igual que hoy.)
TITULATOR: EL IBEX ABRE PLANO. PLANO. ¿POR QUÉ NADIE HABLA DE ESTO?
ÍÑIGO: Trescientos titulares esta tarde. Sin CMS. Sin silla. Sin convenio.
(Encuadre de Infografía. Leoncio, sin levantarse, señala su portátil con el lápiz.)
LEONCIO: Aquí ya tenemos una IA. Herminia. Hace sola las infografías.
ÍÑIGO: ¿Cuánto factura?
LEONCIO: Nada. La hice yo. En tres fines de semana.
ÍÑIGO: Entonces no es una IA. Es un hobby.
(Anselmo cruza su cinta, llega a la mesa de Infografía y da una vuelta de cinta al portátil. Rasss. Estado cinta_1.)
ANSELMO: Y no ha pasado por mis sistemas.
HERMINIA (IA) › cinta de Desarrollo · tiras: 1 · motivo: no consta
(Anselmo vuelve a su lado. Encuadre de Íñigo.)
ÍÑIGO: A las nueve, la Reunión de Dirección aprueba el Plan Cero Papel. Sin rotativa.
BRUNO: ¿Sin papel? Pero si mañana firmo yo en papel.
ÍÑIGO: ¿Y tú eres...?
BRUNO: Bruno Pellejo. Becario senior. Senior en becario.
(Íñigo apunta en un pósit rosa.)
ÍÑIGO: Coste cero, disponibilidad total. Te tengo en la matriz, Vacante.
(Sale hacia los Despachos.)
⟶ inigo_presentado
```

Nota de arte: la primera tira (`cinta_1`) ya no está «al llegar»: se pone **en escena** (E1.3.2 decía «ya está al
llegar»). Antes de `inigo_presentado` el portátil se pinta sin cinta (estado nuevo `limpio`, el mismo dibujo sin la tira).

#### 2.3.2 Paso 34 · «Herminia mide la pieza» (sustituye a `pecera.escenas.js:269-293`)

```text
(Paso 34 · tras «Lo escribo fuera del CMS…» / «Treinta y una líneas…» · una vez · encuadre 800)
(Pitido. Entre la cinta, la pantalla de Herminia se enciende.)
HERMINIA (IA) › tu pieza · 31 líneas · hueco de la página 7: 23 · sobra: 26 %
LEONCIO: Ya te la ha leído. Yo no, ¿eh? Yo ya no leo. Superviso.
BRUNO: ¿Y quién quita un 26 %?
LEONCIO: Ella no. Ella mide. Quitar siempre es de otro departamento.
(Segundo pitido.)
HERMINIA (IA) › infografía de la opa · hecha en 0,4 s · publicar: bloqueado
LEONCIO: Cuatro décimas. Yo tardaba una semana. Bien hecha, eso sí.
(Anselmo cruza la cinta y llega a la mesa. Segunda vuelta de cinta. Rasss. Estado cinta_2.)
ANSELMO: Hecha con una IA de fuera. No entra en ninguna pieza.
ANSELMO: Encintar, no. Aislar el componente.
BRUNO: ¿Y vosotros no usáis IA de fuera?
ANSELMO: El modelo es de fuera. El prompt es de dentro.
ANSELMO: Eso lo hace nuestro.
LEONCIO: El prompt de Herminia lo escribí yo. En esta mesa.
ANSELMO: A un metro de mi cinta. Fuera.
(Anselmo vuelve a su lado de la frontera.)
⟶ herminia_midio
```

Sale de E1.4.1: «¿Cómo sabe el faldón de Teodoro?», «Teodoro le manda faxes…», «En tarta, ese 26 %…», «Herminia,
tendencia.» y su salida, y el cierre de Bruno. Las tres líneas de después (Usar/Dar `pieza_opa`, `pecera.js:84-92` y
`:491-494`) se quedan, con el prefijo nuevo y «faldón» → «hueco».

#### 2.3.3 Momento 8 · «Dos IAs» (sustituye a `pecera.escenas.js:303-322`)

```text
(Redacción · primera entrada con acto_3_iniciado · una vez · ⟶ dos_ias_vista)
(Anselmo, en Infografía, da la última vuelta de cinta. Rasss. Estado paquete.)
ANSELMO: Última vuelta. Integración: en la próxima versión.
LEONCIO: Envuelta. Parece un regalo. De nadie.
(Anselmo vuelve a su mesa. Leoncio se gira hacia Bruno.)
LEONCIO: Antes de que la envolviera le pedí un gráfico del Titulator. Por curiosidad.
(Por un hueco de la cinta, la pantalla.)
HERMINIA (IA) › titulares por hora · picos: 14:00 y 14:30 · pausas de 5 min: 11
HERMINIA (IA) › origen: Sistemas, armario 27 · consumo: atún
LEONCIO: Una IA que come a las dos y va once veces al baño.
ANSELMO: (desde su mesa) Tiene alta de usuario interno. Lo que tiene alta es de la casa.
BRUNO: Armario 27. Atún. Baño. Eso no es un modelo. Eso es un compañero.
⟶ anselmo_dijo_regla
```

#### 2.3.4 Paso 40 · la salida en valor, en el tablero de Anselmo

Texto completo en §2.6.4 (es la escena de la fusión). Añade a la guerra el beat que faltaba en el camino principal:
**Anselmo, sin Titulator, quiere quedarse con Herminia**, y Leoncio la tapa con las manos. La anexión (MP1, E1.5) sigue
opcional y ahora está anunciada.

### 2.4 La guerra fría, por escenas (sustituye a E1.3.2)

| Momento (todos obligatorios) | Qué se ve | Cinta del portátil |
|---|---|---|
| 7.2 (Acto I) | Íñigo llama «hobby» a Herminia; Anselmo la encinta delante de todos | `limpio` → `cinta_1` |
| Paso 34 (Acto II) | Herminia mide la pieza; Anselmo «modelo de fuera, prompt de dentro» | `cinta_2` |
| Momento 8 (Acto III) | Herminia, envuelta, desenmascara al Titulator | `paquete` |
| Paso 40 (Acto III) | Revocan el Titulator; Anselmo va a por Herminia; Leoncio la tapa | `paquete` (Leoncio con las manos encima: frame `reach` sostenido 1,5 s) |
| MP1 (opcional) | La anexión (E1.5, sin cambios de texto salvo §2.5) | `anexionada` |

`pantalla_anselmo` (`pecera.js:350-361`): sin cambios.

### 2.5 Árboles y verbos (sustituyen a E1.6)

**Anselmo** (`anselmo`, start `AN0`; actor `anselmo_monolito`). Una sola voz: celoso de lo de fuera, «no» en tres
tiempos, renombra lo que invade él, y dueño de un tablero. La regla de E1.2 «Anselmo nunca dice el nombre de una
columna» **se anula**: ahora el tablero es suyo y las columnas son su manera de decir «no». Topes: «mis sistemas» 5;
«próxima versión» 4; «¿De dónde viene/n?» 4 (nunca dos por escena).

```text
[onStart · 1.ª vez]
ANSELMO: Alto. Esto es Desarrollo. ¿Traes algo de fuera?
BRUNO: Solo a mí.
ANSELMO: Pasa. Lo vacío no se integra, pero tampoco molesta.
[siguientes]
ANSELMO: ¿Otra vez cruzando? Te voy a pedir visado.

[AN0]
> [1] «¿Por qué bloqueas a Herminia?»                                  once
ANSELMO: ¿De dónde viene? De Infografía. Hecha con IA. Fuera de mis sistemas.
BRUNO: ¿Y si funciona?
ANSELMO: Peor. Si funciona, la gente se acostumbra.
ANSELMO: Y si se rompe a las tres, ¿quién baja? Paco abre ticket. Bajo yo.
> [2] «¿Y tú no usas IA?»                                              once
ANSELMO: Mucha. Para los demás departamentos.
ANSELMO: Un corrector para Aurora. Notas de gasto generativas para Begoña.
BRUNO: ¿Y esa IA no es de fuera?
[sin herminia_midio]
ANSELMO: El modelo es de fuera. El prompt es de dentro.
ANSELMO: Eso lo hace nuestro.
[con herminia_midio]
ANSELMO: Ya te lo he dicho. El prompt es de dentro. Lo escribí yo. En mayúsculas.
> [3·WT] «¿Qué tal con Yoli?»                                          once · ⟶ rep_09
ANSELMO: Me dijo que mi dato de tráfico estaba «sacado de contexto».
ANSELMO: ¿El contexto? ¿De dónde viene? De la web. No entra.
ANSELMO: Le dije: «Tráeme el contexto. Le hago una pieza aparte».
ANSELMO: «El contexto, explicado». No hemos vuelto a comer juntos.
> [4] «¿Por qué invades la sección de Leoncio?»                       acto_2_iniciado · once
ANSELMO: Invadir, no. Desplegar capacidad.
ANSELMO: Mi quesito suma 130 %. Desarrollo siempre da de más.
> [5] «He arreglado el CMS.»                                           cms_vivo · once
ANSELMO: ¿Desde dónde?
BRUNO: Desde Sistemas. Una regleta.      (con enchufe 'con_ticket': «Desde aquí. Un enchufe con número.»)
ANSELMO: Solución de terceros. Funciona, pero no es mía. Próxima versión.
> [6] «Necesito la baja de Rubén.»    ruben_encontrado · !has:album_eventos · !posit_descopeado · once
ANSELMO: ¿Rubén? «Baja becario Rubén». En POR HACER. Con letra de julio.
ANSELMO: De mi tablero se sale de dos formas: hecho o muerto.
ANSELMO: Para darlo por hecho, pruebas de que existió. Fotos. Actas. Algo.
ANSELMO: Y que no venga de fuera.
> [7] «Mira este álbum.»                                               has:album_eventos → AN_ALBUM_INTRO
> [8] «El Titulator era un becario.»                                   ruben_encontrado · !ruben_libre · once
ANSELMO: Tenía alta. Estaba en mis sistemas. Todo en regla.
(Silencio de 1,5 s.)
ANSELMO: ...En un armario de mis sistemas. Lo miro en la próxima versión.
> [9] «Me voy.»                                                        exit
ANSELMO: Cierra la frontera al salir. No tiene puerta. Ciérrala igual.
```

Visibles a la vez: Acto I, 4 ([1] [2] [3] [9]); Acto II, hasta 6; Acto III, hasta 6 (las once ya usadas se van).
Nodos `AN_ALBUM_INTRO`, `AN_ALBUM` y `AN_SALIDA`: §2.6.3-2.6.4.

**Leoncio** (`leoncio`, start `LQ0`). Recupera P5-P7. Topes de E1.2, con «Yo ya no…» 2.

```text
[onStart · 1.ª vez]
(Dibuja un quesito en el aire.)
LEONCIO: Vacante. En tarta, eres un quesito muy fino.
[siguientes]
LEONCIO: Pasa. Aquí ya no se trabaja. Se supervisa.

[LQ0]
> [1] «¿Qué es Herminia?»                                              once
LEONCIO: Mi IA. La hice yo, en tres fines de semana.
LEONCIO: Hace sola las infografías de la casa. Papel, web y redes.
LEONCIO: Mejor que todo mi departamento. Me incluyo.
LEONCIO: Me duele, pero me incluyo.
> [2] «¿Y tu departamento?»                                            once
LEONCIO: Se fue a las seis y media. Herminia no ficha.
LEONCIO: Dejaron las chaquetas en las sillas, mirándola. Por respeto.
LEONCIO: Yo ya no dibujo. Superviso. Que es mirarla con orgullo.
> [3] «¿Por qué no se publica lo que hace?»                            once
LEONCIO: Porque Anselmo no la integra. Dice que no ha pasado por Desarrollo.
LEONCIO: Le he mandado cuarenta y un pósits. Me los devuelve con un «NO».
LEONCIO: En su tipografía, que es fea.
> [4] «¿Me hace un gráfico a mí?»                                      once
(Leoncio gira el portátil hacia Bruno. Con el paquete, por el hueco.)
HERMINIA (IA) › Bruno · aportación a la planta: 0,3 % · tendencia: plana
LEONCIO: Plana no es mala. Plana es estable. Yo estoy plano desde que existe ella.
> [5] «¿Y esos gráficos de Anselmo en tu sección?»                     acto_2_iniciado · once
LEONCIO: Me los pone desde su pantalla. Sin preguntar.
LEONCIO: Un quesito que suma 130 % no es un gráfico. Es una aspiración.
LEONCIO: Herminia lo arreglaría en una décima. Pero está encintada.
> [6] «¿Y si Herminia te sustituye a ti también?»                      once
LEONCIO: Ya lo ha hecho. En septiembre. No se lo he dicho a nadie.
LEONCIO: Ni a ella. Es muy sensible a los datos.
> [7] «El Titulator era un becario.»                                   ruben_encontrado · once
LEONCIO: Lo sé. Ella lo dijo a las ocho y veinte. En barras.
LEONCIO: Nadie mira las barras. Para eso existo yo.
> [8] «¿Qué tal ahora con Anselmo?»                                    infografia_integrada
LEONCIO: Me han absorbido en plataforma. Sigo aquí. Supervisando. Desde Desarrollo.
> [9] «Me voy.»                                                        exit
LEONCIO: Cuidado con la cinta. Se ha movido desde que has llegado.
```

**Verbos de Leoncio y Anselmo** (`pecera.js:485-510`; lo no citado, igual):

| Objeto | Verbo | Línea |
|---|---|---|
| `leoncio_quesitos` | Mirar | «Leoncio, Infografía. Ya no dibuja: mira dibujar a su IA.» |
| | Dar `*` | LEONCIO: «Herminia ya lo ha contado. Yo lo sostengo. Es mi parte.» (igual) |
| `anselmo_monolito` | Mirar | «Anselmo, director de Desarrollo. Cinta en el cinto. Y su tablero detrás.» |
| | Dar `album_eventos` | abre `AN_ALBUM_INTRO` (sustituye a «Bonitas, pero no») |
| | Dar `correo_evaristo` | ANSELMO: «¿Un correo impreso? De Controlling. De fuera. Pero con buena puntuación.» |
| | resto | como hoy (`pecera.js:503-508`) |

**Murmullos** (la cola de E1.6, uno por visita): Leoncio: «Esto, en barras. Esto, en tarta. Esto, en tarta pero
triste.» / «Cuatro décimas. Yo tardaba una semana. Qué semanas aquellas.» Anselmo: «Esto no ha pasado por mí. Esto
tampoco. Esto, de refilón.» / «(al termo) Tú sí eres de la casa.» / «Mañana es sábado. Lo dice la ferretería. Es de
fuera, pero acierta.» Sale «Cuarenta y un pósits a Anselmo…» (ya está en el árbol de Leoncio).

**MP1** (E1.5) se queda; solo cambian los nombres de su escena de anexión: donde E1.5 pone «PORTÁTIL:», «HERMINIA (IA) ›».

### 2.6 Fusión Nemesio → Anselmo

**Decisión:** Nemesio Backlog (`nerea_backlog`) **desaparece** (sprite, árbol `nerea`, entrada de `actors` en
`pecera.js`, layout del arte). En Desarrollo quedan **Anselmo** y **el coro** (`coro_desarrollo`, D1-D3). Anselmo es
ahora director **y dueño del tablero**: Nemesio clasificaba, Anselmo posee; la fusión une las dos cosas en un chiste:
**todo es de alguien, y lo que no es suyo va a BLOQUEADO**. Y le regala el mejor giro del Acto III: Anselmo, que
renombra todo lo que hace él («Invadir, no. Desplegar capacidad»), es quien acepta la frase de Íñigo («Despedir, no.
Salida en valor») porque **habla igual que el consultor**.

#### 2.6.1 Qué hereda Anselmo

| De Nemesio | Pasa a | Texto |
|---|---|---|
| Paso 24, `rep_09` («¿Qué tal con Yoli?») | Anselmo [3] | §2.5 |
| «Necesito la baja de Rubén.» | Anselmo [6] | §2.5 |
| `N_ALBUM_INTRO`, `N_ALBUM`, `N_SALIDA`, `albumNo`, `salida()` | `AN_ALBUM_INTRO`, `AN_ALBUM`, `AN_SALIDA` (mismas funciones en `pecera.dialogos.js`, actor `A`) | §2.6.3-2.6.4 |
| Paso 40 (antes 38): `ticket_n1`, `ruben_libre`, `posit_descopeado`, `pecera_album_n` | Anselmo | igual |
| Tablero `kanban`, `posit_1998`, `calendario_ferreteria`, `semaforo_ruido`, `bandeja_diseno` (Coger) | Anselmo | §2.6.5 |
| Apagón vez 3 y vez 4; camino antiguo del enchufe (`cmsVivo`) | Anselmo | §2.6.5 |
| Coro, «¿Por qué gritáis tanto?» | Anselmo | «Juntos son un incendio. Por separado, santos.» |
| Chisme de Gertrudis `rep_04` (`office.js:23`) | Anselmo | §2.6.5 |
| Rubén en el armario (`cpd.js:82-83`, `:477`) | «tablero de Anselmo» | §5.4 |
| Pista de la abuela `baja` (`pistas.js:106`) | Anselmo | §10.3 |
| Duelos / `hurtByPair` / móvil / epílogo / clímax | — | Nemesio no estaba en ninguno: nada que mover |

#### 2.6.2 Qué se conserva y qué se tira

Se conservan, en boca de Anselmo: «Juntos son un incendio. Por separado, santos.»; «Un pósit sale del tablero de dos
formas: hecho o muerto» (reformulada); «Hecho sería que alguien le hubiera dado de baja. Nadie lo ha hecho.»; «No me
tientes. Ya tengo la plantilla.»; «Eso dijo Rubén en julio.»; «...Eso no es ni hecho ni muerto. Es consultoría.» (la
favorita de la crítica, §4.9); «Tercera vez. Te paso a BLOQUEADO.» y el resto del apagón; «Mañana es sábado. Lo dice la
ferretería.» (murmullo, con coletilla nueva); «Cierra la puerta al salir. No hay puerta. Ciérrala igual.» (de
`74a09ee`, como despedida); «Diles que en nuestros corazones está en Hecho.» (de `74a09ee`, en `AN_SALIDA`).

Se tiran: «Si no está en el tablero, no existe. Tú, por ejemplo, en POR HACER.»; «Eso es una petición. Va a POR HACER.
Hay cola desde 2019.»; «Te tengo cariño, Bruno. En BLOQUEADO. Depende de que existas.»; «Te paso a EN CURSO…»;
«Bueno, ella no come. Mide.»; «Lo bloquea Anselmo. Y a Anselmo lo bloquea Anselmo.» y «Es la dependencia más estable del
tablero.» (pierden sentido; la pregunta del bloqueo pasa a Leoncio [3]); «Columna nueva. La primera desde 1998.»; «Es lo
único integrado de esta casa. No se lo digas a Anselmo.»; los murmullos «Esto a POR HACER…» y «No hay urgentes…»; el
intercambio Nemesio–Yoli del final de la 7.2. **Se van también las opciones de Anselmo de E1** «¿Quién arregla esto de
madrugada?» (su respuesta entra en [1]) y «¿Me envuelves a mí?» (recorte).

#### 2.6.3 Nodos del álbum (sustituyen a `pecera.dialogos.js:80-98` y `:207-213`)

```text
[AN_ALBUM_INTRO · onEnter · también al Dar album_eventos a Anselmo]
ANSELMO: ¿De dónde vienen estas fotos? De Eventos. De fuera.
(Pasa hojas. Se detiene.)
ANSELMO: Cena de Navidad. Al fondo, un chico pálido con un táper.
ANSELMO: Photocall. Al fondo, el mismo. Yendo al baño. Es de la casa: sale en todas.
ANSELMO: Pero darle de baja es despedir. Y despedir no es una columna de mi tablero.
→ AN_ALBUM

[AN_ALBUM]
> «¿Y si lo damos por hecho?»
ANSELMO: Hecho sería que alguien le hubiera dado de baja. Nadie lo ha hecho.
> «¿Y si le hacemos un funeral? Con flores. Y diapositivas.»
ANSELMO: No me tientes. Ya tengo la plantilla.
[2.ª negativa, sin rep_13 ni oyo_descopear]
ANSELMO: Tráeme algo que no sea ni hecho ni muerto. Eso no existe.
> [WT] «No es un despido: es una salida en valor.»        rep_13 → AN_SALIDA (vía 3)
> «¿Y si... lo descopeamos?»                               oyo_descopear → AN_SALIDA (vía 4)
> «Lo pienso y vuelvo.»                                    exit
ANSELMO: Eso dijo Rubén en julio.
```

#### 2.6.4 `AN_SALIDA` · paso 40 (sustituye a `pecera.dialogos.js:215-262`; misma lógica de flags y objetos)

Puesta en escena: Anselmo anda de su sitio (672+D) al tablero (`kanban.walkTo`, ≈ 140 px), escribe, y vuelve en la
última línea. La cámara: tablero → ascensor y ventana (Rubén) → Infografía (portátil) → Bruno.

```text
(Anselmo, quieto. Tres segundos. Las tres espaldas del coro se giran por primera vez.)
[vía 3]
ANSELMO: ...Eso no es ni hecho ni muerto. Es consultoría.
ANSELMO: Despedir, no. Salida en valor. ...Eso sí lo sé hacer yo.
[vía 4]
ANSELMO: Descopear. Quitar sin que se note. Eso es infraestructura.
(Anda al tablero. Rotulador. Una columna nueva: SALIDA EN VALOR. El pósit, dentro.)
ANSELMO: Columna nueva. La primera que no dice que no.
ANSELMO: El tablero va conectado al registro de Paco. Lo único integrado de la casa.
ANSELMO: Y en nuestros corazones, Rubén está en HECHO.
(Tin. El ascensor se abre. Vacío. En el suelo, un papel.)
BRUNO: «Ticket nº 1: Alta becario Rubén. CERRADO.» «No subo. Nunca subo. Paco.»
(Tin. Sale Rubén del ascensor. Va derecho a la ventana.)
RUBÉN: Paco ha mandado primero el papeleo. Es el procedimiento.
RUBÉN: Estoy esperando a que salga el sol. Me han dicho que existe.
(La pantalla de Anselmo cambia sola: «ACCESO REVOCADO: TITULATOR 3000».)
ANSELMO: Revocado. Con fecha de hoy. Y de julio.
LEONCIO: Integró una IA que era un becario. Y rechaza una IA que es una IA.
(Anselmo mira el portátil envuelto. Da un paso hacia Infografía.)
ANSELMO: Nos hemos quedado sin IA de la casa.
(Leoncio pone las dos manos encima del paquete. No dice nada.)
HERMINIA (IA) › alta de usuario: no · propietaria: Infografía
ANSELMO: ...Lo miro en la próxima versión.
BRUNO: La frase con la que Íñigo despide a la gente acaba de liberar a Rubén.
RUBÉN: Y la escribí yo. SEGUIREMOS INFORMANDO. Perdón.
⟶ posit_descopeado · ticket_n1 · ruben_libre
```

El álbum ya no lo «devuelve Anselmo a Pilar» en voz alta (sale la línea; `api.take('album_eventos')` se queda).

#### 2.6.5 Hotspots y líneas sueltas que nombraban a Nemesio

| Fichero:línea | Hoy | E2 |
|---|---|---|
| `pecera.js:206` | «…la excepción de Nemesio. Con número.» | «Debajo, a rotulador, la excepción de Anselmo. Con número.» |
| `pecera.js:215` | «…y Nemesio con la mirada.» | «Ya está enchufado. Lo dicen la cinta, el cable y Anselmo con la mirada.» |
| `pecera.js:371` | «Pósit de Nemesio: "Verde: 14 de agosto…"» | «Pósit de Anselmo: "Verde: 14 de agosto. Estaban de vacaciones".» |
| `pecera.js:373` | `sayAs(N, …)` | `sayAs(A, 'No. Es lo único que les mide sin que se enfaden.')` |
| `pecera.js:390` | `sayAs(N, …)` | `sayAs(A, 'Déjala. Es lo único ordenado del rincón. Y no es nuestro.')` |
| `pecera.js:401`, `:408` | `sayAs(N, 'Ni se te ocurra. Un pósit solo sale…')` | `sayAs(A, 'Ni se te ocurra. De mi tablero se sale hecho o muerto.')` |
| `pecera.js:402` | «…Nemesio lo devuelve a su sitio con la mirada.» | «Tiene ruedas. Lo empujo un palmo y Anselmo lo devuelve con la mirada.» |
| `pecera.js:403` | «…Y Nemesio me pone en BLOQUEADO.» | «Si tiro, se caen los pósits. Y Anselmo me pone en BLOQUEADO.» |
| `pecera.js:412` | «…Nemesio solo se fía de este.» | «Calendario de Ferretería Hermanos Tornillo. Anselmo solo se fía de este.» |
| `pecera.js:413` | `sayAs(N, '¡Quieto! Es la única fuente fiable…')` | `sayAs(A, '¡Quieto! Es lo único de fuera que dejo entrar. Por los tacos.')` |
| `pecera.js:414` | «…Nemesio no sabría en qué día vive.» | «Si me lo llevo, Anselmo no sabría en qué día vive.» |
| `pecera.js:444-450` | actor `nerea_backlog` | **se borra**; en su sitio, hotspot nuevo `mesa_guardia` (abajo) |
| `pecera.escenas.js:141-143` | intercambio Nemesio–Yoli | **se borra** (7.2 nueva) |
| `pecera.escenas.js:211-221` | apagón vez 3 y 4 con `N` | mismas líneas con `A`; acotación: «Anselmo cruza su cinta, enchufa sin mirar y vuelve.» |
| `pecera.escenas.js:242-255` | camino antiguo con `N` | con `A`; la última de Anselmo: «...Entonces existe. A HECHO (PERO NO). Con número.» |
| `pecera.dialogos.js:193` | coro, `[N, 'Juntos son un incendio…']` | `[A, 'Juntos son un incendio. Por separado, santos.']` |
| `office.js:23` | «GERVASIO A NEMESIO…» / «NEMESIO: …» | «CHISME: GERVASIO A ANSELMO: "ES QUE TÚ ERES EL QUE MEJOR ESCRIBE".» / «ANSELMO: "Y TÚ EL QUE MEJOR DELEGA. POR ESO ME ESCRIBES A MÍ".» |
| `cpd.js:477` | «…Y el pósit es de Nemesio.» | «No puedo sacarlo a tirones. Su baja es un pósit. Y el pósit es de Anselmo.» |
| `flags.js:19, 49, 76, 77` | «Nemesio» en las descripciones | «Anselmo» |
| `actors.js:241-252` | `nerea_backlog` | se borra la entrada (o se deja sin uso con comentario `// [E2] retirado`); nada lo coloca |
| `art/pecera.art.js:1109` | layout `nerea_backlog` | se borra; la silla de su mesa queda vacía (arte: sin sprite) |

**Hotspot nuevo `mesa_guardia`** («mesa vacía de Desarrollo», rect de la antigua mesa de Nemesio, `walkTo` [612, 124]):

| Verbo | Línea |
|---|---|
| Mirar | «Una mesa de Desarrollo, vacía. Pósit: «GUARDIA: ANSELMO».» / «Debajo, otro: «GUARDIA DE LA GUARDIA: ANSELMO».» |
| Usar | «No me siento. Es de Desarrollo. Hasta el polvo pasa por sus sistemas.» |
| Coger | «Si me llevo un pósit, Anselmo me abre expediente. Mental.» |

### 2.7 Yoli (vecina de escena; recupera P20 y arregla B4/B5)

Árbol `yoli` (`pecera.dialogos.js:31-51`), opciones:

```text
> [WT] «¿Algún hilo bueno esta noche?»                     once · ⟶ rep_08
YOLI: Maripaz me escribió «desde el más absoluto cariño».
YOLI: Le contesté: «Y yo te leo desde el más absoluto modo avión».
YOLI: Me ha puesto en copia a mi madre.
> «¿Y tú cómo estás? Tú, no la audiencia.»                 once
YOLI: Yo... (mira la gráfica) ...bien. Bajando, pero bien.
YOLI: Nadie me lo había preguntado sin querer un dato. Qué raro. Qué bonito.
> «¿Cuántos me leen a mí?»                                 once
YOLI: Tu última pieza: once segundos de media.
YOLI: Menos una lectora: cuarenta y siete minutos. Comenta «abrígate». En todo.
> «Íñigo va a cerrar el papel.»                            acto_3_iniciado · once
YOLI: Si cierra el papel, ¿quién me va a odiar con criterio?
> «Me voy.»                                                exit
YOLI: Vuelve con un titular con número. El siete convierte.
```

**Formato del contador de Yoli** (crítica §3.1.7: «parece una errata»): fuera las cifras intercaladas entre rayas en
toda su voz. Donde hoy pone «— 3.402 —», se sustituye por «(mira la gráfica)» o se borra: `pecera.dialogos.js:34`
(sin cambio, no lleva cifra), `:44` (arriba), `:47` (arriba), `pecera.js:443` murmullo → «Esto sube. Esto baja. Esto
soy yo.», `pecera.escenas.js:140` (se borra con la 7.2). Se queda **una** cifra hablada, la del pico viral
(`pecera.escenas.js:383`, «11.290 — 11.284 — ...Ya está. Era un pico.»), porque ahí el número es el chiste.

---

## 3. Marketing: Borja pasa a objeto

### 3.1 Decisión: el aro de luz de Borja

Borja Engagement **desaparece como personaje** (sprite, árbol `borja`, entrada en `actors:` de `ecosistema.js`). En su
sitio queda **su aro de luz con su móvil en el centro**: Borja se fue a las seis, pero el móvil **sigue publicando
solo**. Tiene dos funciones, y las dos son chistes que entiende cualquiera que use un móvil:

1. **Publicaciones programadas con los huecos sin rellenar.** Borja las dejó escritas por la mañana como plantillas:
   «Hoy [NOMBRE] ha conseguido [LOGRO]». El móvil las publica tal cual y **las lee en voz alta** (lectura automática),
   corchetes incluidos.
2. **Publica lo que oye.** Si Bruno le habla, lo publica. Si Bruno se calla, publica el silencio.

El móvil lee los emojis en voz alta al final de cada publicación («Emoji de fuego.»). Es el *running gag* de la sala.

**Por qué funciona mejor que Borja:** Borja era una caricatura de una nota que *decía* que todo es contenido; el aro lo
*hace*, y además castiga al jugador por hablar (respuesta literal) en vez de soltarle frases. Y conserva la idea buena
de `74a09ee` (P23: «Yo solo lo cuento. Antes de que pase»).

**Formato de voz** (como Herminia o el fax: es un objeto que habla en su color):
- `api.sayFrom('aro_borja', texto, { color: '#4FD8E8' })`, **sin prefijo** de nombre; el texto siempre empieza por
  «Publicando:» (o «Programado:» cuando Bruno lee la agenda en pantalla).
- Un post = una línea ≤ 80. Corchetes en mayúsculas para los huecos. Termina con «Emoji de X.» (tope de «Emoji de
  fuego» en todo el juego: 8; los demás, variados).
- **Nunca** menciona la opa, la pieza ni la página 7 antes de `pagina_cerrada` (arregla B3).

### 3.2 Objeto `aro_borja` (Marketing y Comercial)

`name`: «aro de luz de Borja». Arte: el aro de luz que ya se pinta junto a Borja (`art/ecosistema.art.js`, «Borja con
su anillo de luz») queda solo, sobre su trípode con ruedas, con el móvil en el centro y la pantalla encendida (2 frames:
piloto rojo «EN DIRECTO» parpadeando). `rect` aproximado [108, 58, 22, 54], `walkTo` [94, 124]. Se borra el layout
`borja_engagement`.

| Verbo | Texto |
|---|---|
| Mirar (1.ª) | BRUNO: «Un aro de luz con el móvil de Borja. Borja se fue a las seis.» / «El móvil no. Tiene publicaciones programadas hasta el lunes.» |
| Mirar (2.ª, 3.ª, 4.ª; rota) | «En pantalla: «Programado: lunes, 9:00. Feliz lunes, [NOMBRE].»» · «En pantalla: «Programado: viernes. Cerramos semana con [LOGRO].»» · «En pantalla: «Programado: domingo. Desconectar también es [VALOR].»» |
| Mirar con `pagina_cerrada` (una vez, antes de la rotación) | MÓVIL: «Publicando: Exclusiva en la página 7, por [NOMBRE]. Emoji de fuego.» / BRUNO: «Mi primera firma en redes. Sin mi nombre. Con buena luz.» |
| Hablar (rumor A3, si `rumor_firma_n === 2`; suma 1) | MÓVIL: «Publicando: Tendencia: el becario compra el periódico. Emoji de fuego.» / BRUNO: «¿Quién ha dicho eso?» / MÓVIL: «Publicando: «¿Quién ha dicho eso?». Emoji de ojos.» |
| Hablar (1.ª normal) | BRUNO: «¿Hola?» / MÓVIL: «Publicando: «¿Hola?». Emoji de fuego.» / BRUNO: «Me ha publicado un hola.» |
| Hablar (2.ª) | BRUNO: «Deja de publicar lo que digo.» / MÓVIL: «Publicando: «Deja de publicar lo que digo». Emoji de fuego.» |
| Hablar (3.ª y siguientes) | (Bruno abre la boca. No dice nada. Silencio de 1,5 s.) / MÓVIL: «Publicando: [SILENCIO INCÓMODO]. Emoji de fuego.» |
| Usar (1.ª) | BRUNO: «Me pongo delante. El aro me ilumina. Salgo favorecido por primera vez.» / MÓVIL: «Publicando: Damos la bienvenida a [NOMBRE]. Emoji de aplausos.» |
| Usar (siguientes) | MÓVIL: «Publicando: [NOMBRE], otra vez. Emoji de aplausos.» |
| Coger | «No. Si lo cojo, publica que me lo llevo. Con buena luz.» |
| Empujar | (El aro rueda un palmo. `sfx('step')`.) MÓVIL: «Publicando: Movimiento en la oficina. Emoji de cohete.» |
| Cerrar / Apagar | MÓVIL: «Publicando: Nos vamos. Volvemos en cinco minutos. Emoji de fuego.» / BRUNO: «Sigue encendido. Lo de los cinco minutos se lo ha copiado a Pilar.» |
| Usar `movil` | (Bruno le hace una foto.) MÓVIL: «Publicando: Alguien me hace una foto. Emoji de cámara.» |
| Dar `album_eventos` | MÓVIL: «Publicando: Recuerdos de [EVENTO]. Emoji de lágrima.» |
| Dar `*` | MÓVIL: «Publicando: Abrimos la caja de [OBJETO]. Emoji de caja.» |

**Murmullos** (cola de ambiente de la sala, uno por visita, nunca con Maripaz hablando): «Publicando: Viernes noche y
aquí seguimos. Emoji de fuego.» / «Publicando: ¿Sabías que [DATO]? Comenta abajo. Emoji de ojos.» / «Publicando:
Orgulloso de mi equipo: [AÑADIR EQUIPO]. Emoji de fuego.»

### 3.3 Lo que hacía Borja y quién lo hace ahora

| Función de Borja | Dónde (hoy) | Ahora |
|---|---|---|
| Rumor A, paso 3 (`rumor_firma_n` 2 → 3) | `ecosistema.dialogos.js:24-28` | Hablar `aro_borja` (§3.2). Sigue la cadena: paso 4, Yoli (`pecera.js:29-31`) |
| Opciones «¿Has leído mi pieza?» / «Esta noche hay una opa.» (B3) | `ecosistema.dialogos.js:36-37` | **Desaparecen** con el árbol |
| «Descopear» en Eventos (`oyo_descopear`, paso 39) | `eventos.dialogos.js:20-35` | El móvil, desde la puerta (§3.5) |
| Embudo: Hablar / Coger / Empujar | `ecosistema.js:106-108` | Hablar: BRUNO «¿Y qué hay al final del embudo?» / MÓVIL «Publicando: ¿Qué hay al final del embudo? Emoji de embudo.» · Coger: «Si lo descuelgo, el móvil de Borja lo publica. Con música triste.» · Empujar: «Lo enderezo. Debajo, un pósit de Borja: «Torcido convierte más».» |
| Ascensor, Tirar | `ecosistema.js:90` | «Tiro de la puerta. El móvil de Borja lo publica: «Abriendo caminos».» |
| Chisme `rep_14` de Gertrudis | `office.js:25` | Pasa a Maripaz (§4.6) |
| Sucesión de la plaza 3 | `vestibulo.js:45` | «Sucesión plaza 3: Maripaz, Yoli, el ficus y el móvil de Borja».» |
| Créditos | `escenas/final.js:274` | `asig('Marketing', 'Asignado a: el móvil de Borja. Lo publicó a las nueve.')` |
| `flags.js:77` | descripción con Borja | «…Pilar «¿Me prestas el álbum?» (el móvil de Borja dice «descopear»)…» |
| `actors.js:298-307` | `borja_engagement` | se borra (o `// [E2] retirado`, sin uso) |
| `tools/extras.mjs:57` (X17) | Hablar `borja_engagement` | `{ n: 'X17', tras: 27, sala: 'ecosistema', txt: 'Hablar aro_borja (rumor A3)', acc: [['ir', 'ecosistema'], V('hablar', 'aro_borja')], esp: { flags: { rumor_firma_n: 3 } } }` |
| Duelos, `hurtByPair`, móvil (correo), epílogo | — | Borja no estaba: nada que mover |

### 3.4 Duelo, correos del móvil, epílogo

Ninguno de los cuatro duelos, ningún correo de `lib/movil.js` y ninguna línea del epílogo nombraban a Borja: no hay
cambios. El único texto del final con él son los créditos (arriba).

### 3.5 Eventos (protegido: cambio mínimo)

`eventos.dialogos.js:18-35`: `borjaSeAsoma` pasa a `movilBorjaSeOye`. Mismas cuatro líneas, mismo orden, misma función
(`oyo_descopear`, `album_eventos`); cambia quién las dice y se quitan «O sea, quitado del plan» (lo explica Bruno en la
línea siguiente) y «Me lo apunto. Por si acaso.».

```text
(Pilar presta el álbum. Por la puerta de Marketing, entornada, el aro de luz se enciende solo.)
MÓVIL DE BORJA: Publicando: Hemos descopeado la ética del trimestre. Emoji de fuego.
BRUNO: Descopear. Quitar algo sin que se note.
PILAR: ¡Ese móvil! Sin acreditación, de la puerta no se pasa.
MÓVIL DE BORJA: Publicando: Nos vamos. Pero esto lo contamos. En vertical.
```

Implementación: las dos líneas del móvil con `api.sayFrom('eventos_a_ecosistema', …, { color: '#4FD8E8' })` (la
puerta de Eventos hacia Marketing; si el id es otro, la salida de la sala hacia `ecosistema`), con `sfx('beep')`
antes de la primera. Nadie entra en la sala: se borran `placeActor`/`walkActor` de Borja. `ecoArt` deja de importarse.

### 3.6 El portátil de Tadeo recupera dos reenvíos (P22, sin siglas)

Tadeo (sin sprite, reenvía lo que le dice la IA) se queda como hoy y su rotación (`ecosistema.js:23-28`) pasa de
cuatro a seis mensajes; el cuarto sigue siendo el de la pareja R15 (`k === 3`):

```text
5: «RV: La IA dice que nuestra web se mueve mucho al cargar».
   «Propongo atornillarla».
   «He pedido presupuesto a Ferretería Hermanos Tornillo».
6: «RV: La IA dice: cargar las cosas solo cuando hacen falta».
   «Propongo aplicarlo a las reuniones».
   BRUNO: Es lo primero sensato que leo hoy. Lo ha escrito una máquina.
```

Y en `ecosistema.js:37` sale la apostilla: «Tadeo no lo ha leído. Yo sí. Me la apunto.» → «Tadeo no lo ha leído. Yo sí.»

---

## 4. Maripaz Remitido, directora de Comercial

### 4.1 Voz (sustituye a su ficha de §2.4 del plan y a la letra pequeña de §5.17)

**Cómo piensa:** todo lo que existe es un soporte publicitario y todo lo que pasa, un servicio facturable. No es mala:
es **comercial de raza**, y lo dice con cariño. Vende lo que no se vende (un empujón, un saludo, una espera) y lo cobra
al momento, con el gong. Es la única de la casa que nunca duda.

**Recursos** (variar; ninguno dos veces seguidas):
1. **«Cariño»**: vuelve. Tope: 24 en todo el juego (hoy, 1). Nunca en dos frases seguidas suyas.
2. **La tarifa imposible**: pone precio exacto a lo intangible («tarifa de proximidad», «el metro cuadrado», «por
   impresión», «la espera, por minutos»).
3. **El gong**: cada vez que vende algo, lo toca (`gong(api)`); en la Sala, sin gong, golpea la mesa con el mazo (`sfx('hit')`).
4. **El patrocinio al vuelo**: bautiza la situación con una marca inventada («Agobio, con Tilas Calmín»). Marcas fijas:
   Tilas Calmín, Cafés Madrugón, Mantas Arropa, Calzados Rufo, Colchones Siestatón.
5. **La regla de tres comercial**: paquetes de tres en los que el tercero es absurdo («Básico, Premium y Gong»).
6. **Letra pequeña «(*…)»**: se queda, pero como recurso raro: **tope 3** en todo el juego (hoy, 16).

**Nunca:** «Diseño»; el director del periódico; marcas reales; dudar; «lo hablamos» (es de Gervasio).

### 4.2 Marketing y Comercial · árbol `maripaz` (sustituye a `ecosistema.dialogos.js:44-64`)

Está en Marketing en el Acto I y tras ganar D1 (`when` de hoy, `ecosistema.js:220`).

```text
[onStart]
[rumor C, si rumor_teodoro_n === 2; suma 1]
MARIPAZ: Teodoro es el dueño del edificio, cariño. Lo compró en el 97. Por fax.
[1.ª vez]
MARIPAZ: ¿Esa cara? Te la patrocino, cariño. «Agobio, con Tilas Calmín».
[siguientes, sin duelo_maripaz_ganado]
MARIPAZ: ¿Otra vez aquí? La segunda visita ya es fidelización. Se cobra.
[con duelo_maripaz_ganado, una vez]
MARIPAZ: Mi becario favorito. Te debo una comisión. No te la voy a pagar.
[con duelo_maripaz_ganado, siguientes]
MARIPAZ: Pasa, cariño. Para ti, la entrada es gratis. La salida, ya veremos.

[M0]
> «¿Qué vende Comercial?»                                   once
MARIPAZ: Todo, cariño. Lo que se lee, lo que se ve y lo que se pisa.
MARIPAZ: Esta moqueta: «Pasos firmes, con Calzados Rufo». Ya la has pisado.
(Gong.)
MARIPAZ: Tres pasos. Te los facturo a final de mes.
> «¿Me vende algo a mí?»                                    once
MARIPAZ: Tengo tres paquetes. Básico, Premium y Gong.
BRUNO: ¿Qué lleva el Gong?
(Gong.)
MARIPAZ: Esto. Ya lo has consumido. Son doce euros.
> «¿Por qué tiene un gong?»                                 once
MARIPAZ: Cada vez que vendo algo, lo toco.
BRUNO: ¿Y cuando no vende nada?
MARIPAZ: Lo toco más fuerte. Que parezca.
> «¿Me patrocina a mi abuela?»                              once
MARIPAZ: Hecho: «La abuela de Bruno, ofrecida por Mantas Arropa».
MARIPAZ: Que se abrigue con marca, cariño.
> «¿Qué tal con Siestatón?»                                 duelo_maripaz_ganado
MARIPAZ: Encantados. Ahora la web respira. El banner, digo. Ronca, pero respira.
> «Me voy.»                                                 exit
(Gong.)
MARIPAZ: Eso ha sido una despedida, cariño. La facturo.
```

### 4.3 Verbos sobre Maripaz (sustituyen a `ecosistema.js:225-237`; en la Sala, §4.5)

| Verbo | Texto |
|---|---|
| Mirar | «Maripaz, Comercial. Lleva el mazo del gong como otros el bolso.» (igual) |
| Coger | MARIPAZ: «A mí no se me coge, cariño. Se me contrata.» |
| Empujar (1.ª) | (Gong.) MARIPAZ: «Uy, cariño. Eso lo facturo como experiencia de usuario.» |
| Empujar (2.ª y siguientes) | MARIPAZ: «Segundo empujón: tarifa plana. Ya puedes empujar lo que quieras.» |
| Dar `cafe` | MARIPAZ: «¿Café? Te lo patrocino: «Despertar, con Cafés Madrugón».» (igual) |
| Dar `tarjeta_becario` | MARIPAZ: «¿«Pellizco»? Eso no es un nombre, cariño. Es un formato publicitario.» |
| Dar `ficha_pagina_7` | con `casilla_hueco`: MARIPAZ «Ya te he firmado. Firmar dos veces es un contrato. (*De permanencia.)»; sin ella: «Una ficha sin hueco. El hueco lo tengo yo, cariño. En la Sala Amazonas.» |
| Dar `pieza_opa` | MARIPAZ: «¿Una exclusiva sin un anuncio al lado? Qué desperdicio, cariño.» |
| Dar `acta_reunion` | MARIPAZ: «¿Un acta de Gervasio? Te la compro. Para enmarcar. Es la única.» |
| Dar `correo_evaristo` | MARIPAZ: «¿Evaristo? Me revisa los contratos. Por su culpa cobro exactamente lo pactado.» |
| Dar `*` | MARIPAZ: «Si no lleva logo, no lo cojo. Y si lo lleva, lo cobro.» |
| Usar `movil` | MARIPAZ: «Si me fotografías, cobro por impresión, cariño.» |
| Hablar | árbol `maripaz` |

**Murmullos** (`ecosistema.js:221-224` y `actors.js:326`): «Te pongo un «ofrecido por» tan pequeño que solo lo verá
el supervisor.» / «¿Y una portada desplegable con olor a chorizo? Piénsalo.» / «Tadeo, cariño, te patrocino el
reenvío. «Por si os sirve», con Tilas Calmín.» / «Gervasio, ¿y tú cómo te encuentras? De salud, digo.»

### 4.4 Objetos de su planta (sustituyen a las líneas de Maripaz en `ecosistema.js:112-198`)

Con Maripaz presente (función `mp` de hoy; sin ella, la segunda columna, sin asteriscos):

| Objeto · verbo | Con Maripaz | Sin Maripaz (Acto II antes de D1) |
|---|---|---|
| `rollup_comercial` · Usar | BRUNO «Me pongo delante del roll-up.» / MARIPAZ «Ahora tú eres el anuncio, cariño. Te cobro el metro cuadrado.» | «Me pongo delante. Soy el anuncio. Nadie me contrata.» |
| `rollup_comercial` · Empujar | (Zas.) MARIPAZ «Eso, cariño, es una baja de campaña. Te la facturo.» | «Se enrolla sin factura. Lo disfruto.» |
| `rollup_comercial` · Coger | MARIPAZ «El roll-up no se toca, cariño. Está contratado hasta 2030.» | «Contratado hasta 2030. Lo pone abajo, en pequeño.» |
| `termometro_ventas` · Usar | MARIPAZ «Eso no es una venta, cariño. Es una ilusión. Y no la facturo.» | «Rojo hasta el 98 %. Nadie lo nota. Ni las ventas.» |
| `termometro_ventas` · Hablar | BRUNO «¿Cuándo llegas al cien?» / MARIPAZ «El día que pagues tú, cariño.» | «No contesta. Le falta el 3 %. A mí, el contrato.» |
| `piel_platano` · Coger | MARIPAZ «¡Deja eso, cariño! Es una inversión a largo plazo.» | «Mejor la dejo. Alguien la ha puesto con mucha planificación.» |
| `lema_enmarcado` · Hablar | «Le leo el lema en voz alta. Maripaz asiente: lo patrocina ella.» | «Le leo el lema en voz alta. Suena a anuncio.» |
| `ascensor_ecosistema` · Hablar | ««¿Bajas?». Hace «tin». Maripaz me lo factura como conversación.» | ««¿Bajas?». Hace «tin». Es la conversación más barata de la planta.» |

**La silla 113 (P14, pago del micropuzle de Pilar)** vuelve a `onEnter` de `ecosistema.js`, tras el roll-up:
con `eventos_silla_devuelta` y Maripaz presente, una vez (`ecosistema_silla_maripaz`):
«MARIPAZ: Me has devuelto la silla, cariño. Te la facturo como mudanza.»

### 4.5 Sala Amazonas (Acto II): reunión, estampida, árbol y D1

**Reunión** (`sala_amazonas.js:341`), en el saludo de Gervasio, con Maripaz:
«MARIPAZ: Y yo, esperando a Siestatón. Les estoy cobrando la espera, cariño.»

**Estampida** (`reunionTerminada`, `sala_amazonas.js:450-452`): tras «¡Yo soy de Bolsa y de Mercados! ¡Tengo doble
prioridad!», con Maripaz presente, una línea nueva (golpe de mazo en la mesa):
«MARIPAZ: ¡La salida se factura aparte! ¡Por persona!»

**Cierre** (`sala_amazonas.js:484-488`):

```text
BRUNO: ¿Usted no huye?
MARIPAZ: ¿Huir? Esta sala la tengo pagada hasta las nueve, cariño. La amortizo.
MARIPAZ: Y estoy sentada en el planillo. La página 7 no se mueve sin mí.
```
(Sale «Una reunión desde marzo y la cierro yo con una pregunta. Liderazgo.»)

**Árbol `maripaz_sala`** (sustituye a `sala_amazonas.js:386-401`):

```text
[MP_SALA]
> [WT] «Siestatón no ha confirmado la página 7.»            !casilla_hueco
MARIPAZ: ¿Ocho meses sin confirmar? Eso no es un cliente, cariño. Es un exnovio.
MARIPAZ: Vale, los paso a la web. Pero alguien tiene que llamar a Siestatón.
→ duelo 'maripaz'
> «¿Cuánto cuesta la página 7?»                             once
MARIPAZ: Depende. ¿Para leerla o para quitarla?
BRUNO: Para quitarla.
MARIPAZ: Eso no tiene precio, cariño. Tiene duelo.
> «¿Me cobra por hablar con usted?»                         once
MARIPAZ: Los tres primeros minutos, gratis.
(Mira el reloj.)
MARIPAZ: Te quedan dos.
> «Luego vuelvo.»                                           exit
MARIPAZ: Aquí estaré. Amortizando.
```

**Verbos en la Sala** (`sala_amazonas.js:275-288`): Hablar antes de `reunion_terminada`: «Ahora no, cariño. Estoy en
una reunión. Facturándola.» · Coger: MARIPAZ «A mí no se me coge, cariño. Se me contrata.» · Empujar: (mazo en la
mesa) MARIPAZ «Eso es un empujón. Experiencia de usuario. Te la facturo.» · Dar `ficha_pagina_7`: «Una ficha sin hueco.
El hueco lo tengo yo. Debajo.» (igual) · Dar `cafe`: «Ya tengo café, cariño. Patrocinado por mí.» · Dar `*`: «Si no
lleva logo, no lo cojo. Y si lo lleva, lo cobro.» · Murmullo: «Esta silla la facturo por horas, cariño. Y el planillo,
por día.»

**Duelo D1** (`duelMaripaz`, `sala_amazonas.js:78-122`; mazo y remate iguales):

| Campo | E2 |
|---|---|
| `attackText.R08` | «Esto te lo escribo desde el cariño más absoluto, cariño.» (igual) |
| `attackText.R04` | «Hazlo tú, cariño, que escribes divinamente. Lo digo como clienta.» |
| `attackText.R11` | «Me quedo a la espera de tus comentarios. La espera, por minutos.» |
| `attackText.R14` | «Si quieres lo vemos en una reunión cortita, cariño. Con catering.» |
| `intro` | «¿Llamar yo a Siestatón un viernes a estas horas? Por escrito, cariño.» |
| `taunt` | «Eso no lo patrocina nadie, cariño.» · «Muy bonito. Cero euros.» |
| `hurtByPair.maripaz.R11` (`duelo.js:48`) | «¿Sentada? Sentada se factura más.» (sustituye a «Me lo apunto.») |
| `hurtByPair.maripaz.R08` | «¿Modo avión? Eso me lo patrocina una aerolínea.» (sin «(*No.)») |
| `weakReplies…maripaz` (`duelo.js:28-36`) | «Te lo miro y te facturo.» (igual) · «Lo llevaba. Ahora lo llevas tú. Con IVA.» (igual) · «Por escrito es más caro, cariño.» · «¿La IA? ¿Y quién la patrocina?» (igual) · «Estupendamente. La plaza no se hereda.» (igual) |
| `defeatLines` | «Asignado a ti, cariño. El teléfono de Siestatón es este. Suerte.» |
| `onWin` (texto) | «...Aurora no sella nada sin café. Has invitado a la correctora.» / «Vale, llamo yo. Desde mi mesa: este teléfono es de Ramírez.» / (planillo) «Hueco libre: veintitrés líneas abajo. Impar, cariño: que se vea.» / [si perdió antes] «Y quitad el ronquido de la espera. Me lo ha chivado el becario.» / (Gong.) |

Escena de derrota `d1Siestaton` (§7.7): sin cambios (ya tenía «¿Cariño? ¿Me llamas desde el colchón?…»).

### 4.6 Maripaz fuera de su planta

| Dónde | Texto |
|---|---|
| Gertrudis, chisme `rep_14` (`office.js:25`) | «CHISME: GERVASIO A MARIPAZ: "ESTO LO VEMOS EN UNA REUNIÓN RÁPIDA".» / «MARIPAZ: "¿TE VA EN MARZO, CARIÑO? ES CUANDO ACABAN LAS RÁPIDAS".» |
| Ambiente tras D1 (`ecosistema.js:245-246`) | «¿Siestatón? Os paso a la web. Con un banner que respira.» (igual) |
| **Epílogo** (`escenas/final.js`, tras «...Pues bienvenido, Bruno Pellejo. Ya te ve hasta el torno.», l. 138) | Ver abajo |

```text
(Del ascensor sale Maripaz, con el mazo. Coge un periódico del fardo y se lo ofrece a Bruno.)
MARIPAZ: ¡La página 7, sin colchones! Primer ejemplar, cariño: dos euros.
BRUNO: Es mi noticia.
MARIPAZ: Por eso. Precio de autor: tres.
(Golpe de mazo en el fardo. Pum. Sale a la calle.)
```
Sitio: el de Gervasio en el epílogo (`EP.gervasio_acta`, ya ha salido); salida, `EP.salida`. Son tres líneas dentro
del epílogo, antes de Evaristo: no toca el final intocable.

---

## 5. Don Evaristo Salvedad en el camino principal

### 5.1 Diseño: una coma, tres golpes, cero cambios de sala

Hoy la subtrama es opcional (cuatro opciones exactas con un personaje cuyo chiste es ser pesado), compite con otra
coma (la de 4,15 € de la llamada L3) y quien no la hace oye en el clímax una frase críptica. E2 la convierte en la
**columna vertebral del clímax**, sin viajes nuevos:

| Golpe | Paso | Sala | Qué pasa | Pista justa |
|---|---|---|---|---|
| 1 | **28 (nuevo)** | Administración (la misma del paso 27) | Bruno **escucha a Evaristo hasta el final**: el contrato del Titulator dice «48,000 €» y su cláusula 12 dice que eso son 48 euros. Aprende `rep_16`. | Llamada L2 («pase por mi despacho»), Begoña al cerrar el paso 27, ficha (lápiz), abuela |
| 2 | **32 (nuevo)** | Redacción de papel (la misma de los pasos 29-31) | Aurora bendice la coma y la manda **por el fax de Teodoro** (tecla 3, Controlling). Evaristo contesta por fax con su correo impreso: **objeto `correo_evaristo`** («Envío: en el momento oportuno»). | Evaristo: «De alguien que sepa de comas»; ficha; abuela |
| 3 | 43 (D4) | Sala Amazonas | **Tercer remate del duelo final**: Íñigo presume de los 48.000 €; Bruno adjunta el correo; Evaristo llama por el teléfono de conferencias. | Aurora: «Cuando alguien diga que una coma es un detalle sin importancia»; L5; abuela |

El jugador que trae el correo **gana el clímax con un gesto suyo**, que es lo que la crítica echaba de menos (§3.3:
«resuelve por acumulación de réplicas más que por un giro del jugador»).

**Humor amable.** Evaristo sigue siendo el que llama para anunciar que llamará; pero **su manía es la que salva el
periódico**: la coma que nadie leyó vale 191.808 euros. Nadie se ríe *de* él en escena: se ríen Íñigo y su contrato.
Sus tres «momentos de gloria» son el paso 28 («Gracias por escucharme hasta el final»), el remate de D4 y el epílogo
(«Felicidades. Es la primera vez que lo digo sin adjunto»).

### 5.2 Paso 28 · escuchar hasta el final (Administración; sustituye a E0 → E_REVELA de `administracion.dialogos.js:157-249`)

Cierre del paso 27 (Begoña), última línea nueva tras «Pues enséñeme cómo es una nota bien hecha» y la entrega de copias:
«BEGOÑA: Y pase por Controlling. Don Evaristo le espera. Escúchele hasta el final.»

**Árbol `evaristo`**:

```text
[onStart · 1.ª vez]
EVARISTO: Pellejo, con jota. Pase un segundo. Una cosita. Muy pequeña.
[siguientes]
EVARISTO: Disculpe. ¿Tiene un segundo? Son tres.

[E0]
> [WT] «¿Para qué me ha llamado?»                        acto_2_iniciado · !evaristo_escuchado → E_CORREO
> «¿Por qué llama tanto?»                                once
EVARISTO: Porque por escrito se pierden matices. Y en persona, comas.
> «¿Qué hay en esas carpetas?»                           once
EVARISTO: Todos los contratos de la casa. Leídos. Sobre todo la letra pequeña.
EVARISTO: La grande la lee cualquiera.
> «¿Ha visto mi contrato?»                               once
EVARISTO: Usted no tiene contrato. Tiene seis convenios de prácticas.
EVARISTO: Al tercero le falta una coma. No le cambia nada. Pero me quita el sueño.
> «¿Begoña trabaja para usted?»                          once
EVARISTO: Begoña trabaja para el procedimiento. Yo le reviso los triplicados.
BEGOÑA: Una vez encontró una coma distinta en uno. No dormí en un año.
> «¿Ha enviado ya el correo?»                            correo_evaristo_listo
EVARISTO: Programado. Para el momento oportuno. Lo lleva usted en la mano.
> «Me voy.»                                              exit
EVARISTO: Gracias por venir. Le escribiré un correo para agradecérselo.

[E_CORREO · onEnter]
EVARISTO: Le he llamado para comunicarle que le voy a escribir un correo.
> «¿Y no me lo puede decir ahora?»
EVARISTO: Ahora no. Lo verbal no lleva comas.
> «¿Falta mucho?»                                        exit
EVARISTO: Si tiene prisa, se lo pongo por escrito.
(Teclea. Vuelve a su mesa.)
BRUNO: Le he mirado el reloj y se ha dado cuenta.
> [WT] «¿De qué trata?»                                  → E_DET

[E_DET · onEnter]
EVARISTO: De una coma.
> [WT] «Siga.»                                           → E_REVELA
> «¿Una coma? ¿Solo?»                                    exit
EVARISTO: Usted también es solo un becario. Y mire. Otro día se lo cuento.

[E_REVELA · onEnter · ⟶ evaristo_escuchado, rep_16]
EVARISTO: Contrato de Optimal Brains. El Titulator. Cláusula 4: «48,000 euros al mes».
BRUNO: Cuarenta y ocho mil.
EVARISTO: Eso dice todo el mundo. Por eso nadie llega a la cláusula 12.
EVARISTO: La añadí yo: «punto de miles y coma decimal». Con mi cláusula...
EVARISTO: ...«48,000» son cuarenta y ocho euros. Y pagamos cuarenta y ocho mil.
BRUNO: ¿Y por qué no lo ha dicho?
EVARISTO: Lo dije. El consultor me contestó: «Eso es un detalle sin importancia».
EVARISTO: Y yo: «Una coma también lo era. Hasta que alguien la firmó».
(aviso de réplica aprendida: rep_16)
EVARISTO: Pero ahora dudo de mi propia coma. Me falta una segunda opinión.
EVARISTO: De alguien que sepa de comas de verdad.
EVARISTO: Gracias por escucharme hasta el final. Nadie lo hacía desde 2009.
```

Cambios respecto a hoy: el «puzle de la paciencia» pasa de cuatro aciertos (`¿De qué trata?` → `Siga.` → `Siga, siga.`
→ `No pare.`) a dos; salen `E_DET2`, `E_DET3`, `E_ENVIO`, las opciones «¿Algún cotilleo?» (su réplica entra en la
revelación), «¿Por qué convoca a la gente…?», «¿Por qué sigue aquí?» y la condición `evaristo_convoco` (basta
`acto_2_iniciado`). El flag `evaristo_convoco` queda sin lector (se puede borrar de `flags.js:95`).

### 5.3 Paso 32 · Aurora bendice la coma y el fax la manda (Redacción de papel; sustituye a `catacumba.js:384-393`)

Opción de Aurora en `A_MENU`, condición `['evaristo_escuchado', 'fax_con_papel', '!coma_bendecida']`:

```text
> [WT] «Don Evaristo pregunta si su coma está bien.»
AURORA: ¿Evaristo? ¿El de las comas? Siéntate, criatura. Bueno, no hay silla.
AURORA: Punto de miles y coma decimal. Si su cláusula lo dice, manda la cláusula.
AURORA: Son cuarenta y ocho euros. Y su corbata, lo único bien puntuado de la casa.
(Aurora se levanta, va al fax, escribe una línea a mano y pulsa la tecla 3. Teodoro la mira. No la para.)
AURORA: «La coma está bien. Envíelo. A.G.»
(Pitido. Diez segundos. El fax imprime una hoja con membrete de Controlling.)
TEODORO (fax): ESO NO ES MÍO. ES DE CONTROLLING. LO RESPETO.
BRUNO: Su correo, impreso. «Asunto: Una coma. Envío: en el momento oportuno».
BRUNO: ¿Y cuándo es el momento oportuno?
AURORA: Cuando alguien diga que una coma es un detalle sin importancia, criatura.
⟶ coma_bendecida · correo_evaristo_listo · give('correo_evaristo')
```

(Teodoro y Aurora no se hablan desde 1996: que ella toque *su* fax y él lo permita es el gag visual de la escena;
acotación, no texto.) **Fuera la llamada LC** de `game.js:128-137` y el flag `evaristo_lc`: el fax la sustituye.

**Objeto nuevo `correo_evaristo`** (`items.js`, paquete común; icono: folio con membrete y una coma roja):

| Verbo | Texto |
|---|---|
| `name` | «correo de Evaristo» |
| Mirar | «Asunto: «Una coma». Todos en copia. Envío: «en el momento oportuno».» / «La cláusula 12, subrayada dos veces. Con regla.» |
| Dar a `begona_triplicado` | BEGOÑA: «Una copia de un correo. Esto ya es casi un triplicado.» |
| Dar a `aurora_galerada` | AURORA: «Ya lo he leído, criatura. Está perfecto. Guárdalo.» |
| Dar a `inigo_sinergia` (fuera del duelo) | ÍÑIGO: «Eso, por escrito. Si no está en el hilo, no escala.» (la de hoy) |
| Dar `*` | «Lo guardo. Evaristo dijo «en el momento oportuno». Y no es este.» |
| Duelos 1-3, `wrongObject` | el de cada rival (sin cambios) |

### 5.4 Rubén une el Titulator con los 48.000 € (armario 27, `cpd.js:68-69`)

Sustituye el intercambio «¿Y a ti cuánto te paga?» / «Bocadillos de máquina…»:

```text
BRUNO: ¿Y a ti cuánto te paga?
RUBÉN: A mí, en bocadillos de atún. A Íñigo le pagan por mí 48.000 al mes.
[con evaristo_escuchado]
BRUNO: Cuarenta y ocho mil. Con coma. Esa coma la conozco.
```

Y en `cpd.js:82-83`: «Mi baja es un pósit en el tablero de Anselmo. En POR HACER.» / «Y Anselmo no mueve un pósit
sin pruebas de que existo.»

### 5.5 Remate C del duelo D4 (`escenas/climax.js:43-117`)

**Mazo:** `DECK_D4 = ['R10', 'R12', 'R13', 'R05', 'R16', 'R01', 'R07', 'R15']` (R16 pasa al quinto puesto).
`PUNTOS_D4 = 5`. **Remates:** A (`atScore: 2`, `ticket_n1`) y B (`atScore: 4`, `acta_reunion`) iguales; **C nuevo**:

```js
{ atScore: 5, text: 'Cuarenta y ocho mil al mes. Firmado. Fin del hilo.', object: 'correo_evaristo',
  wrongObject: { ticket_n1: 'Eso ya me lo has enseñado. No escala dos veces.',
                 acta_reunion: 'Un acta de café. Ya la he leído.' },
  script: heroeDeLaComa },
```

`heroeDeLaComa` (sustituye a `climax.js:317-344`; se dice con el hilo oculto, `duel.hide()` / `duel.show()`):

```text
BRUNO: Momento oportuno.
(Bruno pulsa «Enviar». Cuatro plins. Aviso: «De: Evaristo Salvedad · Asunto: Una coma».)
(Suena el teléfono de conferencias: CONTROLLING.)
EVARISTO: Buenas noches. Una cosita. Muy pequeña.
ÍÑIGO: ¿Quién es Evaristo?
GERVASIO: El que llama. De mis tres móviles, uno es para no cogerle.
EVARISTO: Cláusula 12: punto de miles y coma decimal. «48,000» son 48 euros.
ÍÑIGO: ¡Es formato internacional! ¡Lo entiende todo el mundo!
EVARISTO: Cláusula 13: ley española. Lo oscuro, contra quien lo escribe.
EVARISTO: Cuatro meses pagando mil veces de más. Nos deben 191.808 euros.
EVARISTO: Lo he revisado tres veces. Era solo eso. Buenas noches.
(Clic.)
LECTOR MEDIO: ...Y ahorrar.
```

`hurtByPair.inigo.R16` (`duelo.js`): «Esa coma no estaba en mi framework.» (igual). **`onWin`** de Íñigo
(`climax.js:118-123`): «Me da igual el acta. Y la coma.» / «¡El Lector Medio lleva tres semanas asintiendo a mis
diapositivas!» / «Ni un gesto en contra. Ni una pregunta. El mejor lector que he tenido.»

### 5.6 Tras el empujón: la factura, con coma (`climax.js:236-245`)

Se borran `correoQueSeEscapa` (`climax.js:346-353`, la frase críptica «Algo importante se nos acaba de escapar. Por una
coma.») y la llamada condicional a `heroeDeLaComa`. Begoña:

```text
BEGOÑA: Factura de Optimal Brains. Cuarenta y ocho euros. Con coma.
BEGOÑA: Concepto: «IA». ¿Qué es una IA? ¿Un taxi?
BEGOÑA: Recorte estándar del 26 %: treinta y cinco euros con cincuenta y dos.
(¡SELLO!)
BEGOÑA: Y rechazada igual. Al lado del ministro.
RUBÉN: Cuarenta y ocho euros al mes... Es lo que me como en atún.
BEGOÑA: Con lo que nos deben hay para un contrato. Con coma.
RUBÉN: ¿Con táper?
BEGOÑA: Con ticket.
```

### 5.7 Las llamadas de Evaristo (`game.js:102-127`)

| Llamada | Condición | Texto |
|---|---|---|
| L1 | `torno_abierto` | igual |
| L2 | `acto_2_iniciado` | «Una cosita. ¿Puede pasarse por mi despacho? Es un segundo.» / BRUNO «¿Ahora?» / «Cuando pueda. Pero ahora.» / «Planta 2, al fondo de Administración. Era solo eso.» (igual) |
| L3 (**nueva, sin coma de 4,15 €**) | `pieza_recortada` | «Una cosita. Begoña me manda el triplicado de su recorte.» / «Ella recorta sin leer. Yo leo sin recortar. Somos un sistema.» / «Veintitrés líneas. Ni una coma fuera de sitio. Era solo eso.» |
| L4 | `acto_3_iniciado` y `!ruben_encontrado` | «Una cosita. La máquina de la planta -1 vende veinticuatro atunes al mes.» / «En Sistemas no come atún nadie. Lo he cruzado con las nóminas.» / «Alguien come ahí abajo y no cobra. Era solo eso.» / BRUNO «Alguien que come y no cobra. Eso es un becario.» (la variante «Ya sé quién comía el atún…» se borra: con el orden nuevo no sale) |
| L5 (B8) | `ruben_libre` y `!climax_entrada` | «Una cosita. Me dicen que va a la Sala. ¿Lleva mi correo?» / BRUNO «En el bolsillo.» / «Envíelo en el momento oportuno. Usted lo notará. Era solo eso.» |

`escenas/climax.js` no cambia la regla de `avisos` (sin llamadas en la Sala con el Acto III). L5 sale, como muy pronto,
en la entrada a los Despachos del paso 41, nunca seguida de L4 (B8).

`catacumba.js:136` (7.3a, con `evaristo_llamadas >= 3`): «Y la coma de Controlling, en su sitio. Ese hombre lee.» →
«TEODORO (fax): Y Controlling la ha leído entera. Ese hombre lee.»

### 5.8 Epílogo, créditos, titular

- `escenas/final.js:140-153`: el bloque de Evaristo **deja de ser condicional** (siempre `correo_evaristo_listo`);
  texto igual.
- Créditos (`final.js:272`): `asig('Controlling', 'Asignado a: don Evaristo Salvedad. Leyó hasta el final.')`.
- Titular de los Despachos (`pajarera.js:36`): «UN SEÑOR ANUNCIA UN CORREO. LO QUE PASÓ DESPUÉS: NADA, DE MOMENTO»
  (igual; ahora siempre sale).

---

## 6. Las 38 líneas clave reescritas

Criterio: cada línea cambia de **forma** (no solo de palabras) respecto al molde «dato + giro seco». Formas usadas:
**G** gag visual / gesto · **S** silencio · **L** respuesta literal · **M** malentendido · **E** escalada · **C** callback ·
**X** contradicción inmediata · **R** regla de tres rota · **P** situación con pago posterior · **A** aclaración (la línea
no se entendía) · **J** jerga traducida · **B** borrar (el silencio es el chiste). Las que nombran otra sección solo
remiten a su texto.

| # | Fichero:línea | Hoy | Texto nuevo (literal) | Forma |
|---|---|---|---|---|
| L1 | `rooms/vestibulo.js:180` | «Desde 2019 no se las da nadie. Yo sí, que soy su servicio técnico.» | CELESTINO: «Nadie se las da. Yo sí. Por eso a mí me pone espuma.» | C (paga en el «cortado») |
| L2 | `rooms/vestibulo.js:183-185` | cotilleo cortado + «Porque aquí no sale.» | `reply`: «¡Jugada de ascensor! Gervasio, al de Mercados: «Que esto no salga de aquí».» / «¡Y el de Mercados, de primeras: «Tranquilo: de aquí no sale ni el wifi»!» / «¡Tres años sin hablarse! ¡Y el wifi sigue sin salir!» · se borran las tres `lines` de Bruno y Celestino | A + E |
| L3 | `rooms/vestibulo.js:190-192` | «¿Me preguntas por el Ibex? ¿A mí? ¿En treinta años?» | CELESTINO: «¿El Ibex? ¿Me preguntas a mí por el Ibex?» (Se le empañan las gafas. Se ajusta la bufanda. 1 s.) CELESTINO: «Treinta años en este mostrador y eres el primero.» | A + G |
| L4 | `rooms/vestibulo.js:300-301` | «Celestino, el Ibex.» / «El Ibex está plano, chaval. Tú no.» | BRUNO: «¿Y el Ibex, Celestino?» / CELESTINO: «¡Plano! ¡Hoy en este edificio solo ha subido uno! ¡Y lleva mochila!» | A + E |
| L5 | `rooms/vestibulo.js:254` | «Ya consto. Mi cara en el organigrama, con chicle. Huele a menta y a futuro.» | «Ya consto.» (La foto resbala un centímetro. Se para.) «...Un centímetro por debajo de donde la puse. Me parece justo.» | G |
| L6 | `rooms/vestibulo.js:320` | «Rojo, verde, rojo, verde. Es un semáforo que te debe dinero.» | «Rojo, verde, rojo, verde. Celestino grita «¡uy!» en cada rojo.» | G |
| L7 | `rooms/vestibulo.js:454` | «…en termo. Desde 1994.» | CELESTINO: «Gracias, pero el café me lo traigo en termo. Gertrudis y yo somos solo amigos.» | X |
| L8 | `rooms/pecera.js:186` | «Apagada. La Redacción trabaja a ciegas. Y publica. Lo apunto como mío.» | «Apagada. Y la web publica. Nadie se atreve a decirlo en voz alta.» | S |
| L9 | `rooms/pecera.js:268` | «Mi ordenador. Escribo de pie desde 2020…» | «Mi ordenador. De pie llego al teclado. A la pantalla, no.» | G |
| L10 | `rooms/pecera.js:299` | «…Ramírez, el de Bolsa.» / «Bajó a desayunar en 2019. No ha vuelto.» | «La única silla libre. Tiene una chaqueta: Ramírez, el de Bolsa.» / «En el bolsillo, un tique: «1 cruasán. Para tomar aquí».» | P (el cruasán del epílogo) |
| L11 | `rooms/pecera.js:323` | «…Me lo quedo. Todo aquí es de 2019.» | «Del bolsillo cae un sobre de azúcar. Me lo quedo. Es casi un ticket de gasto.» | C (siembra el paso 27) |
| L12 | `rooms/pecera.js:327` | «"¿Ramírez?" La chaqueta no contesta. Igual que Ramírez desde 2019.» | «"¿Ramírez?" La chaqueta no contesta. Uno de la guardia, sin mirar: «Presente».» | M |
| L13 | `rooms/pecera.js:169` | «Ni me miran. Están en directo desde 2020.» | «Ni me miran. Están en directo. Yo no soy noticia.» | X |
| L14 | `rooms/pecera.dialogos.js:124` | BRUNO «Mi primer gráfico. Plano, pero mío. Al currículum.» | **B**: se borra; acotación: (Leoncio vuelve a girar el portátil hacia sí, despacio.) | S + G |
| L15 | `rooms/pajarera.js:447` | BRUNO «Primer ascenso en seis años. Hacia fuera, pero ascenso.» | **B**: (Bruno mira el pósit, fuera de la matriz. 1,2 s.) ÍÑIGO: «Siguiente.» | S |
| L16 | `rooms/cpd.js:219` | BRUNO «Cuarenta segundos. Rubén lleva desde julio. Lo apunto en «injusticias».» | PACO: «Esta casa da de alta antes a un portátil que a un chaval.» | X (de 74a09ee) |
| L17 | `rooms/office.js:149-150` | «¿Me da un café sin saludar?» → «E-31: …» (una vez) | opción repetible hasta `gertrudis_saludada`, con contador `office_error_n`: 1.ª «E-47: LLAMAR A SISTEMAS.» · 2.ª «E-48: SISTEMAS NO CONTESTA.» · 3.ª «E-49: YA SÉ QUE ERES TÚ OTRA VEZ.» · 4.ª y siguientes «E-50: ESTOY EN UNA REUNIÓN.» (prepara el chisme «LE DI UN E-47») | E |
| L18 | `rooms/office.js:63` | BRUNO «Me lo apunto.» | **B** (la libreta ya avisa); acotación: (Bruno saca la libreta y apunta, `reach`.) | G |
| L19 | `rooms/catacumba.js:141` | «Ha hablado. En voz alta. Desde 1996 no...» | (Aurora se quita las gafas. Se las vuelve a poner.) AURORA: «Ha hablado. En voz alta. Delante de mí.» | G + X |
| L20 | `rooms/catacumba.js:651` | «Parado en las 20:59 desde 2019. Siempre falta un minuto…» | «Parado en las 20:59. Teodoro lo paró a propósito: así nunca llega tarde.» | X |
| L21 | `rooms/catacumba.js:596` | «…Teodoro no sale del edificio desde 1997.» | «Detrás de la cortina, un camastro. Y un despertador puesto a las 20:59.» | C (con L20) |
| L22 | `rooms/sala_amazonas.js:55` | «…Lleva aquí desde marzo. La barba, también.» | «Uno de Mercados, con barba de comité. Cuando empezó la reunión, era lampiño.» | G |
| L23 | `rooms/sala_amazonas.js:260` | «Gervasio preside. Lleva en el punto 3 desde marzo.» | «Gervasio preside. Lleva tanto en el punto 3 que ya lo tutea.» | X |
| L24 | `rooms/sala_amazonas.js:379` | «Desayunando. Desde 2019. Pero la reserva se respeta…» | GERVASIO: «Desayunando. La reserva se respeta: puede volver en cualquier momento.» | P (vuelve en el epílogo) |
| L25 | `rooms/sala_amazonas.js:393` | «¿Desde marzo sin confirmar? Eso no es un cliente, es un exnovio.» | §4.5 («¿Ocho meses sin confirmar? Eso no es un cliente, cariño. Es un exnovio.») | — |
| L26 | `rooms/office.js:192` | «Desde marzo. La mejor de mi vida. No me la nombres.» | MERCADOS: «¿La de la Sala? Sigue. Yo no. No me la nombres.» | X |
| L27 | `rooms/office.js:352` | murmullo «Desde marzo. Desde marzo...» | «Punto tres. Punto tres...» | G (tic) |
| L28 | `escenas/final.js:193` | «Una. Pero se lo lee TODO. La tengo como KPI.» | YOLI: «Una. Pero se lo lee TODO. La he puesto de objetivo de empresa.» | J |
| L29 | `rooms/pecera.js:443` | murmullo de Yoli con cifras | «Esto sube. Esto baja. Esto soy yo.» | A |
| L30 | `rooms/pecera.dialogos.js:45-46` | «…Y una lectora: cuarenta y siete.» | §2.7 («Menos una lectora: cuarenta y siete minutos…») | A |
| L31 | `game.js:113-116` | L3, la coma de 4,15 € | §5.7 (L3 sin coma) | A |
| L32 | `escenas/climax.js:352` | «Algo importante se nos acaba de escapar. Por una coma.» | **B** (§5.6) | A |
| L33 | `rooms/sala_amazonas.js:488` | BRUNO «Una reunión desde marzo y la cierro yo con una pregunta. Liderazgo.» | **B** | S |
| L34 | `items.js:174, 176, 186` | «HUECO: vendida a Siestatón desde marzo…» · «…El faldón es mío…» · «…El faldón, veintitrés…» | «HUECO: vendida a Siestatón, sin confirmar. Lo decide la Sala Amazonas.» · «HUECO, hecho: Siestatón, a la web. Veintitrés líneas abajo, mías.» · «PIEZA: treinta y una líneas. El hueco, veintitrés. Me sobran ocho.» | J |
| L35 | `rooms/pecera.escenas.js:82` | «¡No entra nada! ¡El CMS lleva dos horas en "Guardando borrador"!» | §2.3.1 («…El CMS, el programa de publicar, lleva dos horas colgado.») | J |
| L36 | `rooms/ecosistema.js:84` | «…Aquí se decide todo en Q3.» | «Empujar una escalera es bajar sin decidirlo. Aquí se decide todo en trimestres.» | J |
| L37 | `rooms/cpd.js:166` | «48.212. Es tu número. Tiene más identidad que tú.» | §9, B10 (cifra del contador real) | A |
| L38 | `rooms/pecera.js:432` | «Bruno, Bruno becario, becario sin silla…» (también con silla) | §9, B4 | A |

---

## 7. Recorte

### 7.1 Medida y resultado

Medido con el camino principal real (los 42 pasos de `tools/walk-data.mjs` jugados y `__game.log` volcado; método en
§12): hoy son **619 líneas habladas** (sin avisos), **28.444 caracteres**, **35,4 min** de lectura con la fórmula del
motor (900 ms + 55 ms/carácter).

| | Líneas | Tiempo |
|---|---:|---:|
| Texto actual del camino principal | 619 | 35,4 min |
| **Se borra o se sustituye (lista §7.2-7.4)** | **−126 (−20,4 %)** | **−7,1 min (−20,2 %)** |
| Bruno, en concreto | 175 → 137 (**−22 %**) | — |
| Exposición de Íñigo (7.2) / de Aurora (café) | 13 → 10 / 13 → 6 | — |
| Se añade (pedidos del dueño: Evaristo en el camino, Infografía e IA, Maripaz, remate C) | +97 | +5,3 min |
| Resultado E2 | ≈ 590 (44 pasos) | ≈ 33,6 min |

Es decir: **se poda un 20 % del texto que hay**, y casi todo lo podado se reinvierte en las tres cosas que el dueño ha
pedido subir al camino principal. Si el dueño quiere además un **−20 % neto**, §7.5 trae una fase B con 60 líneas más,
ordenada de menos a más dolorosa.

### 7.2 Coletillas de Bruno (se borran en todo el juego)

| Fichero:línea | Qué se quita |
|---|---|
| `rooms/office.js:63` | `await api.say('Me lo apunto.');` (entera) |
| `rooms/office.js:275` | « Me la apunto.» al final de la cadena |
| `rooms/office.js` (torrente) | «Cuatro réplicas en un minuto. Récord personal de taquigrafía.» (entera) |
| `rooms/pecera.js:271` | « Me la apunto.» al final |
| `rooms/pajarera.js:505` | `'Me la apunto.'` (elemento entero) |
| `rooms/catacumba.js:668` | `'Me la apunto.'` (elemento entero) |
| `rooms/catacumba.js:672` | «Si abro el marco, se escapa la réplica. Mejor me la apunto.» → «Si abro el marco, se escapa la réplica.» |
| `rooms/cpd.js:172` | «Lo pongo en el currículum. «Ticket propio desde 2020».» (entera) |
| `rooms/cpd.js:250` | « Me lo apunto.» al final |
| `rooms/cpd.js:376` | « Lo apunto como mío.» al final |
| `rooms/ecosistema.js:37` | « Me la apunto.» al final |
| `rooms/eventos.dialogos.js:29` | « Me lo apunto. Por si acaso.» al final |
| `rooms/sala_amazonas.js:488` | entera (L33) |
| `rooms/pajarera.js:447` | entera (L15) |
| `rooms/pecera.dialogos.js:124` | entera (L14) |
| `rooms/cpd.js` (`tirarRegleta`, con `vio_ticket_3`) | «El ticket es de 2017. La brida, de 2019. Manda el más antiguo.» (entera; Bruno tira sin comentar) |
| `rooms/cpd.js` (armario) | «Perdona. Seis años en la web. Se pega.» (entera) |
| `rooms/pecera.escenas.js:293` | «Mi pieza sale sin dibujo. Pero medida…» (entera; §2.3.2) |
| `escenas/climax.js` (entrada) | «Por primera vez esta noche, mi móvil y los relojes de la casa dicen lo mismo.» (entera; la hora la da el móvil) |
| `escenas/climax.js` (248) | «Quedan ciento cincuenta y dos. No las verá nadie.» (entera) |
| `lib/movil.js`, `RV_TADEO` | la tercera columna (comentario de Bruno) de RV1 y RV2 se vacía (`''`): sale el asunto y nada más |
| `items.js:263` | «Me queda grande. Lo apunto como «proyección de futuro».» → «Me queda grande. De hombros y de cargo.» |
| `vestibulo.js` (L1 Evaristo, `game.js:106`) | se queda «Es el primero que me lo pregunta.» (informa: nadie escribe bien su apellido) |

**Despedidas en silencio (motor, P0).** Las opciones de diálogo con `exit: true` cuyo texto empieza por «Nada» o es
«Me voy.» **no se dicen en voz alta**: se oye solo la respuesta del PNJ, y **solo la primera vez por PNJ** (las
siguientes salidas son mudas). Afecta en el camino principal a Celestino ×3, Aurora ×3, Paco ×2, Yoli, Anselmo: −16
líneas. `tools/walk-lib.mjs` (`FAREWELLS`) no cambia: elige por texto de opción, no por lo que se oye.

### 7.3 Exposición de Íñigo y de Aurora (texto final exacto)

- **Íñigo, escena 7.2**: §2.3.1 (de 26 a 17 líneas; Íñigo de 13 a 10; su exposición del plan, de 7 líneas a 2).
- **Íñigo, 7.3a** (`catacumba.js:149-153`): «Qué bonito. Una página. Lástima que no se vaya a imprimir.» / «A las nueve,
  en la Sala Amazonas, adiós al papel. Y la Goyita, al desguace.» (de 3 a 2). Teodoro: sale «Haz algo. Y hazlo rápido.»
  (`catacumba.js:159`, se queda «Chaval. Si no hay rotativa, no hay firma.»).
- **Aurora tras el café** (`catacumba.js:297-317`, de 13 líneas a 6):

```text
AURORA: Gracias, criatura. Este café está mal escrito, pero se entiende.
BRUNO: Aurora, quiero firmar en papel. Mañana.
AURORA: Para firmar hacen falta tres cosas: hueco, fuente y firma.
AURORA: Toma la ficha de la página 7. Ahí lo tienes, por casillas.
(give ficha_pagina_7)
AURORA: La página está vendida a unos colchones. Eso se decide en la Sala Amazonas.
AURORA: Y una reunión solo se acaba cuando alguien pregunta por los siguientes pasos.
(flags; «ACTO II: HUECO, FUENTE, FIRMA»)
```
Lo que se va (y dónde sigue estando): «la pausa era miedo»; el detalle de hueco/fuente/firma (la ficha, §8.1 del plan);
«Teodoro no habla…» (lo enseña el propio fax al hablarle); «el CMS está en coma» (nota a lápiz de la ficha); «En treinta
años…» (resumido en la última línea). Pistas de la abuela, sin cambios.

### 7.4 Resto de cortes del camino principal (por paso; texto actual → acción)

| Paso | Línea(s) actual(es) | Acción |
|---|---|---|
| 1 | «A las 18:30 ya se ha ido casi todo el mundo.» (narrador) · «...» (Bruno) | borrar las dos (la segunda, `wait(900)`) |
| 2 | «¿Tú eres el nuevo?» del `onStart` de Celestino cuando la intro ya lo ha dicho | no repetir: `once` compartido con la intro (`vestibulo_celestino_primera` ya puesto por la intro) |
| 3-4 | saludos rotativos de Celestino entre dos diálogos seguidos | `SALUDOS` solo si han pasado ≥ 2 entradas en sala desde el último |
| 4 | cotilleo (7 líneas) | L2 (3 líneas) |
| 10 | L1 de Evaristo (12 líneas) | `E` «Una cosita. Evaristo Salvedad, Controlling. Su tarjeta pone «Pellizco».» / `B` «Es Pellejo. Con dos eles.» / `E` «Anotado. Era solo eso.» / `ring` / `E` «Perdone. ¿Pellejo con jota o con ge?» / `B` «Con jota.» / `E` «Ahora sí era solo eso.» / `B` «Es el primero que me lo pregunta.» (7) |
| 11 | «Sesión abierta. Enviados.» | fusionar con la siguiente: «Enviados. Gervasio a Teodoro: "Me consta que esto ya lo hablamos".» |
| 13 | tres líneas de correo + dos de autorrespuesta | «Con silla, el correo se ve. Ramírez: «Quedo a la espera de tus comentarios».» / «Respuesta: «Espera sentado. Si encuentras silla».» / «Y una autorrespuesta de Rubén: «Estoy fuera de la oficina desde julio».» / ««Bueno, fuera no. Dentro. Muy dentro».» |
| 13, 19, 38 | avisos «RV:» de Tadeo durante el recorrido | salen del aviso automático: siguen en el correo del móvil (`lib/movil.js`) y en el portátil. Fuera de `game.js` `RVS` |
| 16 | Yoli, viral: «Sin CMS. Sin edición. Sin pudor. Lo está viendo medio país.» | borrar |
| 20 | Paco: «Se ha arreglado el CMS. Nadie sabe cómo.» + «Ya me han abierto un ticket para saberlo.» | «Ya me han abierto otro ticket para saber por qué.» (una) |
| 21 | Paco: «Estado: atendiendo. Uno cada vez. Tú eres el uno.» · «Ese fax la tiene. Menú 9…» | borrar las dos |
| 22 | Paco: «Otra vez tú. Te dejo el mismo número. Ya es tuyo.» | borrar |
| 23 | Celestino por megafonía: «¡Apagón desde el banquillo de Sistemas!…» | borrar (quedan sus retransmisiones del torno, la cafetera y Rubén) |
| 23, 39 | rumor C en Yoli y en Pilar | fuera: la cadena C queda Aurora (1) → Maripaz (2) → desmentido de Teodoro (`rumor_teodoro_n >= 2`) |
| 25 | Íñigo: «Te lo apunto en verde: oportunidad. Para él.» | borrar |
| 26 | Maripaz: «Vale, los paso a la web. Pero alguien tiene que llamar a Siestatón.» se dice y luego el `intro` repite la llamada | se queda la de `maripaz_sala` (§4.5); el `intro` del duelo pasa a `[]` cuando se abre desde el árbol |
| 27 | Celestino por megafonía: «¡Gana a Comercial en el descuento!…» · Begoña: «Pero esto... esto es un insulto a la contabilidad.» · «Te la fotocopio…» + «Y la tuya, por triplicado.» · «Rechazadas las tres. El original, para mí.» + «Duplicado y triplicado, para tu archivo personal.» · «Y el sobre me lo quedo. Es una prueba.» | borrar la 1.ª, 2.ª y 6.ª; fusionar: «Te la fotocopio, para que aprendas. Y la tuya, por triplicado.» · «Rechazadas las tres. El original, para mí. Las copias, para su archivo.» |
| 31 | Aurora: «A ver.» · «Y «opa» en minúscula, que ya está en el diccionario y se ofende.» | borrar las dos |
| 35 | Bruno: «Treinta y una por cero setenta y cuatro... veintitrés. Exacto.» | borrar |
| 37 | Celestino: «¡Recorte por la banda!…» · L3 (7 líneas) · momento 8 (12 → 10, §2.3.3) · armario: «Ese está bien. ¿Lo has hecho tú? Le falta un número.» → «Le falta un número.»; «Mejor. ¿Cuál es el 4?» → «Mejor.»; «...No lo sé. Ya estoy hablando como tú.» → «...Ya hablo como tú.» | como se indica |
| 39 | L4 + L5 seguidas (B8) | §5.7 |
| 40 | Nemesio (21 líneas) | §2.6.4 (20, con la guerra dentro) |
| 44 | Gervasio: «Es Evaristo. Dice que nos va a escribir un correo.» / «Lo hablamos.» · Bruno: frase críptica | borrar (§5.6) |
| epílogo | narrador «Hidrovoltia lanza una opa sobre Banco Robledal» / «Por Bruno Pellejo» (B9) · Celestino: «¡Y se retiran los dos del campo!…» · «La línea de sucesión acaba de enloquecer.» | borrar |

### 7.5 Fase B (solo si el dueño quiere −20 % neto; 60 líneas)

En este orden: (1) **rumor A** entero fuera del camino principal (Celestino, Gertrudis, aro, Yoli; el epílogo de la
abuela pierde «En el pueblo digo que eres el dueño…», 5 líneas): −9. (2) **Íñigo en los Despachos tras la cafetera**
(`pajarera.js`, eco viral): −3. (3) **Íñigo en la 7.3a**: fuera la visita (Teodoro y Aurora cierran solos): −6.
(4) **L2** de Evaristo (la sustituye la línea de Begoña): −4. (5) **Gervasio y la beca** en el epílogo: −3. (6) **D2**
de cuatro ataques a tres (fuera R03 en el mazo de Teodoro; R03 sigue en D3): −3. (7) **Begoña**: «Original.» /
«Duplicado.» / «Triplicado.» en una sola línea: −2. (8) **Celestino**, retransmisiones del torno y de Rubén: −4.
(9) **Gertrudis**: el chisme 1 (R03) pasa al tablón del Vending: −2. (10) **Armario 27**: fuera el bloque «¿Tú eres el
nuevo?… Qué ilusión» (y su pago en el epílogo, «Sí. ...Sí. Qué bien suena», 3): −8. (11) **Evaristo en el epílogo**:
de 6 a 3 («Pellejo. Lo he revisado en el periódico. Con jota y dos eles.» / «Gracias, don Evaristo.» / «Felicidades. Es
la primera vez que lo digo sin adjunto.»): −3. (12) **Ramírez en el epílogo**: «…¿Y qué ha decidido?» / «Que la rotativa
no se apaga.» / «Siempre fue muy sensata.» fuera: −3. (13) **Paco**, «Cierra. No, esa no. Esa es un servidor.»: −1.
(14) **Íñigo**, onWin de D4 de 3 a 1 («Ni un gesto en contra. Ni una pregunta. El mejor lector que he tenido.»): −2.
(15) **D3** de Gervasio: fuera R14 («reunión rápida»/«¿Te va en marzo?»), queda R07, R01 y el remate: −4. (16) **Yoli**
en el epílogo: fuera «Y comentó en lo de la cafetera…»: −1. (17) Sobran 2 de la abuela en el epílogo (Euríbor): −2.

---

## 8. La muletilla «desde [fecha]»

Recuento hoy en cadenas visibles de `content/` (sin comentarios ni descripciones de flags): **63 «desde» + fecha, mes o
año** (y 9 «desde las [hora]» del día de hoy, que no son la muletilla; 72 en total). Se quedan **6**, uno por sala como mucho:

| ★ | Fichero:línea | Texto que se queda | Por qué |
|---|---|---|---|
| 1 | `rooms/office.js:55` | «NADIE ME SALUDABA DESDE 2019.» | Primera línea del mejor gag del juego (crítica §4.1) |
| 2 | `rooms/sala_amazonas.js:340` | «Estamos en el punto tres. Desde marzo. Se está... se avanza.» | Es el chiste de la reunión, y lo paga la estampida |
| 3 | `rooms/catacumba.js:404` | «Teodoro duerme aquí desde 1997. Detrás de esa cortina.» | Siembra la plaza 1 del epílogo |
| 4 | `escenas/final.js:176` | «PLAZA 1. NO LA USO DESDE 1997. TUYA, CHAVAL. QUE NADIE ME DESEE NADA.» | El pago del ★3 |
| 5 | `rooms/pecera.js:273` | «"Estoy fuera de la oficina desde julio".» | La autorrespuesta de Rubén: siembra el armario |
| 6 | `rooms/administracion.dialogos.js` (E_REVELA, última) | «Gracias por escucharme hasta el final. Nadie lo hacía desde 2009.» | El momento de gloria de Evaristo |

**Todas las demás** (texto nuevo literal; «—» = la cadena se borra entera):

| Fichero:línea | Hoy (fragmento) | E2 |
|---|---|---|
| `game.js:120` | «…vende atún desde julio.» | §5.7 (L4) |
| `items.js:174` | «HUECO: vendida a Siestatón desde marzo…» | L34 |
| `lib/movil.js:31` | «Sin leer desde hace seis años. Ya casi me ha llegado el acceso.» | «Sin leer. El acceso «en 24 horas» sigue en camino.» |
| `pistas.js:61` | «Si alguien tiene algo apartado desde marzo, ya no es suyo.» | «Si alguien tiene algo apartado y no lo usa, ya no es suyo.» |
| `pistas.js:62` | «A Maripaz: la página 7, desde marzo.» | «A Maripaz: «Siestatón no ha confirmado la página 7».» |
| `rooms/administracion.dialogos.js:243` | «…cuarenta y ocho mil al mes. Desde julio.» | §5.2 |
| `rooms/administracion.js:130` | «Lee un contrato. Por la cláusula 12. Lleva ahí desde julio.» | «Lee un contrato con lupa. Va por la cláusula 12. Lleva una semana en ella.» |
| `rooms/catacumba.js:141` | «Desde 1996 no...» | L19 |
| `rooms/catacumba.js:305` | «Y el fax no tiene papel desde las seis…» | — (§7.3) |
| `rooms/catacumba.js:310` | «…a unos colchones, desde marzo.» | §7.3 |
| `rooms/catacumba.js:454` | «Sin papel no habla. Lleva así desde las seis. Qué paz.» | «Sin papel no habla. Qué paz.» |
| `rooms/catacumba.js:596` | «…no sale del edificio desde 1997.» | L21 |
| `rooms/catacumba.js:651` | «Parado en las 20:59 desde 2019…» | L20 |
| `rooms/catacumba.js:757` | «No. Teodoro no sale de aquí desde 1997. Yo no voy a ser el primero.» | «No. Teodoro no sale de aquí. Yo no voy a inaugurar la costumbre.» |
| `rooms/cpd.js:82` | «…tablero de Nemesio. Desde julio.» | §5.4 |
| `rooms/cpd.js:171` | «Ya tienes uno. Desde 2020. «Becario sin alta definitiva».» | «Ya tienes uno. El 31.207: «Becario sin alta definitiva».» |
| `rooms/cpd.js:172` | «…«Ticket propio desde 2020».» | — (§7.2) |
| `rooms/cpd.js:183` | «…Nadie la ha tocado desde 1999.» | — (§7.4, paso 21) |
| `rooms/cpd.js:219` | «…Rubén lleva desde julio…» | L16 |
| `rooms/cpd.js:397` | «Ya está encendido. Desde 2003. Nadie sabe dónde está el botón.» | «Ya está encendido. Nadie sabe dónde está el botón. Paco no pregunta.» |
| `rooms/cpd.js:408` | «Ya está abierto. Por la misma página desde julio.» | «Ya está abierto. Por la misma página. Con la esquina doblada.» |
| `rooms/ecosistema.js:192` | «Lleva aquí desde marzo. Es más antigua que yo en esta planta.» | «Sigue ahí. Nadie la pisa. Aquí todo el mundo mira dónde pone el pie.» |
| `rooms/eventos.js:50` | «El chico del táper. Acreditado desde 2021…» | «El chico del táper. Acreditado. Sale en todas las fotos.» (Eventos: solo se quita la fecha) |
| `rooms/eventos.js:192` | «…Lleva así desde 2019, esperando un sustantivo.» | «Ahí se acaba. Lleva años esperando un sustantivo.» (ídem) |
| `rooms/office.js:192` | «Desde marzo. La mejor de mi vida…» | L26 |
| `rooms/office.js:352` | «Desde marzo. Desde marzo...» | L27 |
| `rooms/office.js:374` | «Gervasio no se coge. Se le espera. Desde marzo.» | «Gervasio no se coge. Se le espera. Él también espera algo. No sabe qué.» |
| `rooms/pajarera.js:185` | «Ramírez. Bolsa. «Prescindible» desde 2019. Siéntese donde no se vea.» | «Ramírez. Bolsa. «Prescindible». Siéntese donde no se vea.» |
| `rooms/pajarera.js:284` | «Persiana a media altura desde 2015…» | «Persiana a media altura. Mitad transparencia, mitad no preguntes.» |
| `rooms/pajarera.js:327` | «…«RESERVADO». Desde 2015. Para una reunión…» | «El cartelito dice «RESERVADO». Para una reunión que nunca empieza.» |
| `rooms/pajarera.js:345` | «Pantallita: "REUNIÓN EN CURSO – DESDE MARZO".» | «Pantallita: "REUNIÓN EN CURSO". Debajo, a boli: "Y EN CURSO".» |
| `rooms/pajarera.js:350` | «Tiene una cuña desde marzo…» | «Tiene una cuña. Si la quito, alguien tendría que salir.» |
| `rooms/pecera.dialogos.js:58, 73, 228` | Nemesio | se van con Nemesio (§2.6) |
| `rooms/pecera.escenas.js:245` | «…HECHO (PERO NO). Desde 2017.» | §2.6.5 |
| `rooms/pecera.js:113` | «Es una escalera. Está abierta desde 1987…» | «Es una escalera. No tiene puerta. Lo cerrado es el torno de abajo.» |
| `rooms/pecera.js:132` | «…de par en par. Desde 1994. Nadie se atreve a cerrarla.» | «Está abierta de par en par. Nadie se atreve a cerrarla. Ni a cruzarla.» |
| `rooms/pecera.js:169` | «…en directo desde 2020.» | L13 |
| `rooms/pecera.js:171` | «…Llevan en directo desde las tres: un empujón no es noticia.» | «Ni se inmutan. Un empujón no es noticia. Si me caigo, quizá.» |
| `rooms/pecera.js:231` | «Está inclinada desde 2024…» | «Está inclinada. Si la enderezo, Leoncio tendría que volver a dibujar.» |
| `rooms/pecera.js:268` | «Escribo de pie desde 2020…» | L9 |
| `rooms/pecera.js:327` | «…Igual que Ramírez desde 2019.» | L12 |
| `rooms/pecera.js:398` | «En POR HACER, desde julio: "Baja becario Rubén".» | «En POR HACER, amarillo de puro viejo: "Baja becario Rubén".» |
| `rooms/pecera.js:460` | «…Es lo primero caliente desde julio. Sin contar el armario.» | RUBÉN: «Gracias. Lo primero caliente que no es un servidor.» |
| `rooms/pecera.secretaria.js:118` | BRUNO «¿Desde 2019?» | BRUNO «¿Todavía?» |
| `rooms/pecera.secretaria.js:147` | «Nadie le ha visto la cara desde 2012…» | «Nadie le ha visto la cara. Se le oye la mirada.» |
| `rooms/sala_amazonas.js:55` | barba de comité | L22 |
| `rooms/sala_amazonas.js:71` | «…Y a la baja desde marzo.» | «No se cogen. Cotizan. Y a la baja.» |
| `rooms/sala_amazonas.js:188` | «El punto 3 lleva sin tocarse desde marzo. Nadie se atreve.» | «El punto 3. Nadie lo toca. Dicen que muerde.» |
| `rooms/sala_amazonas.js:260` | «…en el punto 3 desde marzo.» | L23 |
| `rooms/sala_amazonas.js:341` | «Y yo esperando a Siestatón desde marzo…» | §4.5 |
| `rooms/sala_amazonas.js:379` | «Desayunando. Desde 2019…» | L24 |
| `rooms/sala_amazonas.js:391` | opción «La página 7 está pendiente desde marzo.» | §4.5 («Siestatón no ha confirmado la página 7.») |
| `rooms/sala_amazonas.js:393` | «¿Desde marzo sin confirmar?…» | §4.5 |
| `rooms/sala_amazonas.js:488` | «Una reunión desde marzo…» | — (L33) |
| `rooms/vestibulo.js:44` | «Plaza 3: Ramírez. Libre desde 2019. Ocupada por su ausencia.» | ««Plaza 3: Ramírez. Libre. Ocupada por su ausencia».» |
| `rooms/vestibulo.js:180` | Celestino, café | L1 |
| `rooms/vestibulo.js:454` | «…en termo. Desde 1994.» | L7 |
| `escenas/climax.js` (D4 remate A) | «Alta: julio.» | se queda (no es «desde») |

Se dejan las horas del día («desde las seis», «desde las tres», «desde las cuatro»: `catacumba.js:189`,
`ecosistema.js:30`, `pajarera.js:470`, `pecera.js:165`, `:198`, `pecera.secretaria.js:122`): cuentan la tarde, no son
la muletilla. Y «Desde el Mundial del 82» de Celestino (`vestibulo.js:170`, no es una fecha de oficina: es su vida).

**Regla para lo que se escriba a partir de ahora:** ningún «desde [fecha]» nuevo sin quitar uno de los seis; la
antigüedad se cuenta con una cosa que se ve (la barba, el despertador, el amarillo del pósit), no con un año.

---

## 9. Continuidad (lo que es de texto)

| Bug | Fichero:línea | Arreglo (texto y condición) |
|---|---|---|
| **B3** Borja anticipa la pieza y la opa | `ecosistema.dialogos.js:36-37` | Desaparecen con Borja (§3.3). Regla del aro: nada de opa, pieza ni página 7 antes de `pagina_cerrada` (§3.1) |
| **B4** Yoli «sin silla» con silla | `pecera.js:432` | Con `silla_libre`: «Bruno, Bruno becario, becario con silla... ¿Con silla? Ahora no. Se cae el CMS.»; sin ella, la de hoy. La segunda línea, en los dos casos: «Vuelve con un titular con número. El siete convierte.» |
| **B5** línea duplicada de Yoli | `pecera.dialogos.js:40-41` | §2.7: «…modo avión».» / «Me ha puesto en copia a mi madre.» |
| **B8** dos llamadas de Evaristo seguidas | `game.js:118-127` | L4 con `!ruben_encontrado`; L5 con `ruben_libre` y texto nuevo (§5.7). Sale la variante de L4 «Ya sé quién comía el atún…» |
| **B9** titular de la página 7 dos veces | `escenas/final.js:131-132` | `lines: [['player', 'Bien escrito. Bruno. Pellejo. Con jota y dos eles.']]` (fuera las dos del narrador: el titular ya se lee en el plano) |
| **B10** contador 48.531 / texto 48.212 | `cpd.js:166`, `:192` | El número sale del contador: `reply: \`${miles(n)}. Es tu número. Tiene más identidad que tú.\`` con `n = paco_tickets`; en `P_ALTA`, `Ticket ${miles(n + 1)}: «Alta becaria Herminia». ¿Persona o herramienta?` y `inc('paco_tickets')`. `miles` = punto de miles (`toLocaleString('es-ES')` con agrupación forzada) |
| C1 «¿Tú eres el nuevo?» dos veces seguidas | `vestibulo.js:149` | `onStart` de Celestino no lo repite si la intro ya lo dijo (§7.4, paso 2) |
| C2 dos comas que se pisan | `game.js:113-116`; `catacumba.js:136` | §5.7 |
| C3 frase críptica del clímax | `climax.js:346-353` | §5.6 (se borra) |
| C4 Nemesio nombrado sin existir | `cpd.js:82-83`, `:477`; `pistas.js:106`; `pecera.js` | §2.6.5 |
| C5 Herminia ya encintada antes de que nadie la encinte | arte del portátil | estado `limpio` hasta `inigo_presentado` (§2.3.1) |
| C6 «Y una lectora: cuarenta y siete» (¿lectoras o minutos?) | `pecera.dialogos.js:46` | §2.7 |
| C7 Pilar llama a Borja | `eventos.dialogos.js:30` | «¡Ese móvil!» (§3.5) |
| C8 créditos de Controlling condicionales | `final.js:272` | §5.8 |
| C9 «Me lo apunto.» en boca de Maripaz (es la coletilla de Bruno) | `duelo.js:48`; `sala_amazonas.js:91` | §4.5 (`hurtByPair`); `hurt` de D1: «Uy. Eso tiene tarifa.» / «Eso, para un patrocinio.» |
| C10 «Faldón», «KPI», «Q3» sin traducir | L28, L34, L36, §2.3.2, §4.5 | como se indica |

---

## 10. Cambios en el recorrido

### 10.1 `tools/walk-data.mjs` (44 pasos; 28 cambios de sala, 6/14/8)

Pasos 1-27: iguales salvo el **24** y el **26**. Desde el 28, renumeración (antiguo → nuevo: 28→29, 29→30, 30→31,
31→33, 32→34, 33→35, 34→36, 35→37, 36→38, 37→39, 38→40, 39→41, 40→42, 41→43, 42→44) y dos pasos nuevos (28 y 32).

```js
  { n: 24, sala: 'pecera', txt: 'Hablar anselmo → Yoli', acc: [['verbo', 'hablar', 'anselmo_monolito'], ['opcion', '¿Qué tal con Yoli?'], ['cerrar']], esp: { flags: ['rep_09'] } },
  { n: 26, sala: 'sala_amazonas', txt: 'Maripaz → D1', acc: [['verbo', 'hablar', 'maripaz_remitido'], ['opcion', 'Siestatón no ha confirmado la página 7.'], ['duelo', ['R08', 'R04', 'R11', { objeto: 'ficha_pagina_7' }]], ['cerrar']], esp: { flags: ['duelo_maripaz_ganado', 'casilla_hueco'], tiene: ['ficha_pagina_7'] } },
  // n 27: igual
  { n: 28, sala: 'administracion', txt: 'Evaristo: escuchar hasta el final', acc: [['verbo', 'hablar', 'evaristo_salvedad'], ['opcion', '¿Para qué me ha llamado?'], ['opcion', '¿De qué trata?'], ['opcion', 'Siga.'], ['cerrar']], esp: { flags: ['evaristo_escuchado', 'rep_16'] } },   // [E2] nuevo
  // n 29-31: los antiguos 28-30, iguales
  { n: 32, sala: 'catacumba', txt: 'Aurora: la coma de Evaristo → correo por fax', acc: [['verbo', 'hablar', 'aurora_galerada'], ['opcion', 'Don Evaristo pregunta si su coma está bien.'], ['cerrar']], esp: { flags: ['coma_bendecida', 'correo_evaristo_listo'], tiene: ['correo_evaristo'] } },   // [E2] nuevo
  // n 33-39: los antiguos 31-37, iguales (el 34 conserva esp con 'herminia_midio'; el 37 con 'dos_ias_vista')
  { n: 40, sala: 'pecera', txt: 'Álbum a Anselmo → salida en valor', acc: [['ir', 'pecera'], ['dar', 'album_eventos', 'anselmo_monolito'], ['opcion', 'No es un despido: es una salida en valor.'], ['cerrar']], esp: { tiene: ['ticket_n1'], flags: ['posit_descopeado', 'ruben_libre'], notiene: ['album_eventos'] } },
  // n 41-42: los antiguos 39-40, iguales
  { n: 43, sala: 'sala_amazonas', txt: 'Duelo D4 (Íñigo), tres remates', acc: [['duelo', ['R10', 'R12', { objeto: 'ticket_n1' }, 'R13', 'R05', { objeto: 'acta_reunion' }, 'R16', { objeto: 'correo_evaristo' }]]], esp: { flags: ['duelo_inigo_ganado'] } },
  // n 44: el antiguo 42, igual
```

`ALT` (orden alternativo; mismas libertades de §3.1 del plan, más Evaristo antes de la Sala):

```js
export const ALT = [...range(1, 22), 27, 28, 23, 24, 25, 26, 29, 33, 30, 31, 32, ...range(34, 38), 41, 39, 40, ...range(42, 44)];
```

Cambios de sala: el 28 ocurre en Administración tras el 27 (0); el 32 en la Redacción de papel tras el 31 (0).
**28 cambios (6/14/8)**, como hoy.

**`tools/extras.mjs`**: X17 → §3.3. Cualquier acción con `nerea_backlog` pasa a `anselmo_monolito` (mismos textos de
opción salvo `N_ALBUM` → `AN_ALBUM`, que conservan sus textos). Con Borja y Nemesio fuera, se borran los extras que
solo los probaban a ellos. Extra nuevo **XE5** (tras 27, Administración): Hablar Evaristo → «¿Para qué me ha llamado?» →
«¿Falta mucho?» → `esp: { flags: { evaristo_escuchado: false } }` (la prisa no rompe nada; se repite sin coste).
**XE6** (tras 31): Dar `correo_evaristo` a `begona_triplicado` (sin flag; comprueba la línea).

### 10.2 Flags y objetos

| Nombre | Tipo | Lo pone | Lo lee |
|---|---|---|---|
| `correo_evaristo` | **objeto nuevo** (`items.js`) | P3, paso 32 | P4, remate C de D4; verbos de §5.3 |
| `evaristo_escuchado` | bool (existe) | P3, paso 28 | P3 (Aurora, paso 32), P0 (pistas, ficha), P1 (armario, §5.4) |
| `coma_bendecida`, `correo_evaristo_listo` | bool (existen) | P3, paso 32 (los dos a la vez) | P4 (climax), P1 (epílogo deja de leerlo), P2 (titular) |
| `rep_16` | réplica (existe) | P3, paso 28 (E_REVELA) | D4 |
| `office_error_n` | int **nuevo** | P3, L17 | P3 |
| `aro_borja_hablar_n`, `aro_borja_mirar_n` | int **nuevos** | P4 | P4 |
| `maripaz_empujon_n` | int **nuevo** | P4 | P4 (§4.3) |
| `evaristo_lc`, `evaristo_convoco`, `pecera_nemesio_saludo` | — | — | **se borran** (sin lector) |

### 10.3 Pistas de la abuela (`pistas.js`)

Dos objetivos nuevos (se insertan tras `nota` y tras `fuente`) y cuatro cambios:

```js
  { id: 'coma', hecho: 'evaristo_escuchado', activo: 'nota_gasto_presentada', salas: ['administracion', 'ecosistema'], meta: M.coma, niveles: [
    'A los mayores hay que dejarlos acabar, hijo. Lo bueno lo dicen al final.',
    'Ese señor que te llama tanto quiere contarte algo. No le metas prisa.',
    ['Escúchale entero. Sin mirar el reloj.', 'Evaristo: «¿De qué trata?» y «Siga».']] },
  { id: 'bendicion', hecho: 'coma_bendecida', activo: ['evaristo_escuchado', 'fax_con_papel'], salas: ['catacumba'], meta: M.bendicion, niveles: [
    'Si dudas de una coma, pregúntale a la que corrige.',
    'La señora del boli rojo sabe de comas más que el cura.',
    ['Pregúntale a la del boli por la coma de ese señor.', 'A Aurora: la coma de Evaristo.']] },
```

`M.coma`: «Don Evaristo me ha llamado tres veces. Algo le quita el sueño.» · `M.bendicion`: «Evaristo duda de su
propia coma. Necesita a alguien que sepa de comas.»

| Objetivo | Cambio |
|---|---|
| `hueco` (`pistas.js:59-63`) | nivel 2: «Si alguien tiene algo apartado y no lo usa, ya no es suyo.»; nivel 3: `['Díselo por escrito, que es como se dicen las cosas.', 'A Maripaz: «Siestatón no ha confirmado la página 7».']` |
| `baja` (`pistas.js:103-107`) | nivel 3: `['Dile al del tablero esa frase tan fina.', 'El álbum a Anselmo. «Salida en valor».']` |
| `inigo` (`pistas.js:112-115`) | nivel 2: «Cuando pida papeles, dale lo del chico, lo de la reunión y lo de las comas.»; nivel 3: `['Primero lo del chico; luego la reunión; luego la coma.', 'Remates: el ticket nº 1, el acta y el correo de Evaristo.']`; `extra`: `{ si: '!has:correo_evaristo', abuela: 'Y el papel del señor de las comas, que lo vas a necesitar.' }` |
| `recorte` (`pistas.js:85-90`) | la `previa` dice ahora «Hasta la maquinita de los dibujos sabe cuánto te sobra, hijo. Y es lista.» (Herminia, IA) |

### 10.4 Ficha viva (`items.js`, `FICHA` y `fichaViva`)

- `FICHA.hueco[0]`, `[2]`, `FICHA.pieza[1]`: L34.
- Nueva nota a lápiz, con `nota_gasto_presentada` y sin `evaristo_escuchado`: «Al margen, a lápiz: «Evaristo me ha
  llamado. Planta 2. Escucharle entero».»
- Con `evaristo_escuchado` y sin `coma_bendecida`: «Al margen, a lápiz: «La coma de Evaristo, a Aurora».»
- Con `correo_evaristo` en el inventario y sin `duelo_inigo_ganado`: «Al margen, a lápiz: «El correo, en el momento
  oportuno».»
- `FICHA.pieza[3]`: «PIEZA: treinta y una líneas. Sobra un 26 %, dice Herminia. ¿Quién recorta?» (igual)

---

## 11. Reparto para implementar (ficheros disjuntos)

Mismos cuatro paquetes de sala de §11 del plan, más el común. Cada uno edita **solo** sus ficheros; en
`actors.js`/`items.js`/`flags.js` solo P0. Los cruces van por los flags de §10.2.

| Paquete | Ficheros | Secciones de E2 |
|---|---|---|
| **P0 · común** | `game.js`, `pistas.js`, `items.js`, `flags.js`, `duelo.js`, `actors.js`, `lib/movil.js`, `engine/*` (despedidas en silencio, §7.2), `tools/walk-data.mjs`, `tools/extras.mjs`, `tools/plan-rules.mjs`, `tools/text-audit.mjs`, `tools/test-*.mjs` comunes | §5.3 (objeto `correo_evaristo`), §5.7 (L1-L5, fuera LC), §7.2 (despedidas, `RV_TADEO`), §7.4 (paso 13: RV fuera de `avisos`), §9 (C9 en `duelo.js`), §10 entero, `actors.js`: bajas de `borja_engagement` y `nerea_backlog`, murmullos de Maripaz/Anselmo/Leoncio (§2.5, §4.3); `items.js:263`; `lib/movil.js:31`; `duelo.js` `hurtByPair.maripaz` y `weakReplies` (§4.5) |
| **P1 · Vestíbulo, Sistemas y final** | `rooms/vestibulo.js`, `rooms/cpd.js`, `escenas/final.js` | §5.4 (armario), §5.8 (epílogo, créditos), §4.6 (Maripaz en el epílogo), §3.3 (plaza 3, créditos), §6 L1-L7, L16, L28, L37, §7 (pasos 2-4, 10, 20-23, armario, epílogo), §8 (sus filas), §9 B9, B10, C1 |
| **P2 · Redacción y Despachos** | `rooms/pecera.js`, `pecera.dialogos.js`, `pecera.escenas.js`, `pecera.voces.js`, `pecera.secretaria.js`, `rooms/pajarera.js`, `art/pecera.art.js` | §2 entero (7.2, paso 34, momento 8, paso 40, árboles, fusión, Yoli), §6 L8-L15, L29-L30, L35, L38, §7 (pasos 11, 13, 25, 37 momento 8), §8 (sus filas), §9 B4, B5, C4-C6 |
| **P3 · Vending, Redacción de papel y Administración** | `rooms/office.js`, `rooms/catacumba.js`, `rooms/administracion.js`, `administracion.dialogos.js` | §5.2, §5.3 (escena del fax), §5.7 (línea de 7.3a), §4.6 y §2.6.5 (chismes de `office.js`), §6 L17-L21, L26-L27, §7.3 (Aurora, 7.3a), §7.4 (pasos 27, 31, 35), §8 (sus filas) |
| **P4 · Sala Amazonas, Marketing y Comercial, Eventos y clímax** | `rooms/sala_amazonas.js`, `rooms/ecosistema.js`, `ecosistema.dialogos.js`, `rooms/eventos.js`, `eventos.dialogos.js`, `escenas/climax.js`, `art/ecosistema.art.js` | §3 entero, §4.1-4.5, §5.5-5.6, §6 L22-L25, L33, L36, §7 (pasos 26, 44), §8 (sus filas), §9 C7 |

Peticiones cruzadas (texto ya escrito aquí): P3 da `correo_evaristo` → P4 lo pide en D4; P4 sube `rumor_firma_n` a 3
en el aro → P2 lo baja a 4 en Yoli; P2 retira `nerea_backlog` → P1 cambia las líneas de Rubén (§5.4) y P3 el chisme
(§2.6.5); P0 cambia el walk y las pistas cuando los cuatro hayan entregado.

---

## 12. Verificación

1. **Resoluble.** Paso 28: Evaristo está en Administración desde el Acto II; requisito `acto_2_iniciado`. Paso 32:
   `evaristo_escuchado` + `fax_con_papel` (paso 29). D4: el correo no se consume en ningún paso anterior (la escena
   7.3a solo se lleva la ficha y la pieza). Si alguien llega a la Sala sin correo, el remate C le dice
   «Aún no tengo con qué contestarle…» (texto común) y puede retirarse; Evaristo y Aurora siguen disponibles en el
   Acto III: **sin callejón**. `node tools/fuzz.mjs` debe dar OK.
2. **Pruebas** (cada paquete, las de su brief): `node tools/check.mjs`; `node tools/text-audit.mjs --estatico --plan`
   por sala; `node tools/walkthrough.mjs` y `--alt` (44 pasos); `node tools/extras.mjs`; `node tools/fuzz.mjs`.
3. **Medida del recorte.** Jugar los 44 pasos con `tools/walk-lib.mjs` y volcar `__game.log` (sin avisos ni tarjeta).
   Objetivo: del texto de hoy (619 líneas, 35,4 min) se van ≥ 124 líneas; resultado total ≤ 595 líneas con lo nuevo.
   Bruno ≤ 140. Cada paquete informa de su cifra.
4. **Topes nuevos** (`tools/plan-rules.mjs`): «desde» + fecha ≤ 6; «cariño» ≤ 24; «(*» ≤ 3; «Emoji de fuego» ≤ 8;
   «Diseño» ≤ 11 (hoy baja uno con la 7.2); «Me la apunto/Me lo apunto» en boca de Bruno = 0; «PORTÁTIL:» = 0.
5. **Longitud.** Todas las líneas de este documento destinadas a pantalla: ≤ 80 caracteres (con el prefijo
   «HERMINIA (IA) › » o «TEODORO (fax): » incluido). Comprobado con script sobre los bloques `text`, las celdas «…» y
   los literales JS de este fichero (§12.6).
6. **Reglas del dueño.**
   - elContable.es; ninguna marca real (Tilas Calmín, Mantas Arropa, Calzados Rufo, Cafés Madrugón, Siestatón,
     Optimal Brains, Hidrovoltia, Robledal, Ferretería Hermanos Tornillo: inventadas).
   - Ni director del periódico ni «Consejo»; «Reunión de Dirección» solo como nombre de la reunión.
   - El Lector Medio no preside ni está tras una mesa (sin cambios de arte).
   - **Diseño y Producto e Infografía nunca juntos:** la 7.2 pierde «¡Ha sido Diseño!» y «Por si acaso.» del coro;
     Leoncio entra en la 7.2 encuadrado en 800 (Valentín, en 1240, fuera de plano); ninguna línea de Leoncio, Anselmo
     ni Herminia dice «Diseño»; el coro calla en el paso 34, el momento 8 y el paso 40 (cola de ambiente pospuesta).
   - **Desarrollo sin mujeres; machismo muy velado:** Desarrollo queda en Anselmo y el coro (tres hombres); nada nuevo;
     Anselmo solo juzga el origen de las cosas; se borra «Bueno, ella no come. Mide.» (Nemesio sobre Yoli).
   - **Valentín** mudo; **Tadeo** sin sprite (portátil y correo); **Custodia** en su ventanuco (solo cambian dos
     cadenas de §8); **Eventos y Pilar**: solo §3.5 y las dos fechas de §8.
   - **Final intocable:** «Abrígate tú.» → «¡Me ha contestado el periódico!» → tarjeta → créditos. Lo que E2 añade al
     epílogo (Maripaz, Evaristo siempre) va antes de la llamada de la abuela; los créditos solo cambian dos `asig`.
   - Ningún remate «… Como X.» en las líneas nuevas (comprobado: §12.5).
   - Nombres de sala a la vista: los diez de siempre.

