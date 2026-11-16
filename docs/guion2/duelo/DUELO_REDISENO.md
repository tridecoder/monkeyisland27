# «Responder a todos»: rediseño de la presentación y el arranque del duelo

Encargo: que el primer duelo (D1, Maripaz, Sala Amazonas) se entienda solo, que haga gracia y que la pantalla deje de
parecer caótica. No cambia el esqueleto del duelo: réplicas aprendidas, pareja ataque→réplica, aciertos y fallos,
remate con objeto, `cabe`, `aTiempo`, mazos y las parejas de `content/duelo.js`.

Las capturas son reales. Las tomé de un prototipo montado en una copia del repo
(`…/scratchpad/duelo/proto`, diff completo en `…/scratchpad/duelo/prototipo.diff`, 153 líneas añadidas). El repo no se
ha tocado. Están en `…/scratchpad/duelo/shots/` y el script que las saca es `…/scratchpad/duelo/cap.mjs`. Las «antes»
son de una copia del árbol tomada hoy. Ruta base: `/tmp/claude-0/-home-user/9ff6df9a-ef7e-5fcd-8c2a-38c4f58ddcea/scratchpad/duelo/`.

---

## §1 Diagnóstico: qué ve y qué entiende hoy un jugador nuevo

Captura anotada: `shots/antes-d1-anotada.png` (y `antes-d1-menu.png`, `antes-d1-fallo.png`, `antes-d1-movil.png`).

Así se vive hoy, paso a paso:

1. **Bruno le habla a Maripaz.** Primero sale el pop-up de la X menguante y luego el árbol. Bruno elige «Siestatón no ha
   confirmado la página 7.» y ella contesta con dos líneas habladas («…Es un exnovio.» / «…alguien tiene que llamarles.»).
   *Lo que entiende el jugador:* estamos hablando.
2. **Sin transición**, cambia la música y una ventana azul de 63 px tapa el tercio superior de la sala. **Maripaz queda
   detrás:** está sentada al fondo de la mesa y solo asoma el pelo bajo el borde (marca 8 de la captura).
   *Lo que entiende:* «se ha abierto una interfaz». Nadie ha escrito nada y no hay ningún móvil, así que el correo no
   tiene autor visible.
3. **En la ventana hay nueve cosas a la vez:**
   - Título «RESPONDER A TODOS» (1).
   - Marcador «ACIERTOS 0/3 · FALLOS 0/3» (2).
   - De/Para (3).
   - Un asunto largo y cortado con «…» (4).
   - El cuerpo (5).
   - «Asignado a: B. Pollejo» (6).
   - Unos cuadraditos (7).

   Debajo, cinco frases sin rótulo (9). Nada dice cuál es lo importante. El ataque, que es lo único que hay que leer,
   ocupa la línea 5 con el mismo tamaño y peso que «De:».
   *Lo que entiende:* «tengo que elegir una frase»… pero ¿por qué estas frases? ¿Qué es «Asignado a»? ¿Qué son los
   cuadrados?
4. **Elige.** Bruno dice la réplica en voz alta. Así que no la escribe: la ficción del correo se rompe en el primer turno.
5. **Si acierta:**
   - suena `good`;
   - aparece un «+1» verde diminuto junto a los cuadrados;
   - el marcador sube;
   - durante 3,2 s sale bajo la ventana «planta.vestibulo@: +1. Totalmente de acuerdo con Bruno.» en verde.

   *Lo que entiende:* nada de esa línea. Es la queja literal del dueño («un mensaje en verde que no sé a qué se
   refiere»). La firma es una dirección inventada, sin cara y sin presentar. Además compite en tiempo con la línea de
   Maripaz que encaja el golpe, y que es lo gracioso.
6. **Si falla:** sale un «RE:» más en el asunto, un «CC: Colchones Siestatón» en la fila del remitente y un cuadradito
   rojo. Son tres señales en tres sitios distintos para un solo hecho. El chiste de que el hilo crece y se suma gente
   está, pero hay que buscarlo.
7. **«Asignado a: B. Pollejo»** es en realidad lo que está en juego: quién llama a Siestatón. Al ganar cambia a
   «Maripaz Remitido». Pero nadie lo dice, está en la última fila y lleva el mismo amarillo que el cuerpo. Es la mejor
   idea de la pantalla y no se ve.

**Mi lectura del diagnóstico del director: de acuerdo, con un matiz.** El problema no es que sobren elementos, es que
cada elemento cuenta una cosa distinta en un sitio distinto. De todo lo que hay se pueden sacar tres ideas, y solo tres:

- **Qué me han escrito** (el ataque).
- **Qué está en juego** (el marrón y a quién le toca).
- **Cómo voy** (gente que me da la razón y gente que se entera de mi ridículo).

Todo lo demás es decorado de correo que no informa. Y falta lo previo: **la broma no está planteada.** El jugador nunca
ve a nadie sacar un móvil para contestar a quien tiene delante. Sin esa imagen, la ventana es una interfaz rara, no un
chiste.

---

## §2 El planteamiento en ficción

### Alternativas consideradas

- **A. «Por escrito, que conste».** Maripaz, que lo tiene a un metro, saca la tableta y le asigna el marrón por correo
  con copia a todos. Suenan los móviles y Bruno señala lo obvio. Usa lo que ya está en pantalla: ella ya tiene «una
  tableta llena de anuncios» (`tabletaEnAlto`, ya dibujada para la estampida), y el «alguien tiene que llamarles» ya está
  dicho. Coste: 3 líneas.
- **B. Gervasio de notario.** Gervasio, jefe intermedio y experto en no mojarse, dicta la costumbre: «Eso, por correo.
  Con copia a todos.» Explica que es una norma de la casa, no una manía de Maripaz. Pero Gervasio no siempre está en la
  Sala en ese momento (en mi prueba no estaba). Además gastaría su tono antes de su propio duelo (D3) y añade un
  personaje a la escena. Coste: 4-5 líneas y condiciones.
- **C. Muda.** Ella teclea, suenan los móviles y Bruno mira el suyo, sin diálogo. Es barata, pero sin la réplica de
  Bruno no hay golpe: se ve el gesto y no la incongruencia.

### Elegida: A, con el gesto de C

Es lo que se ve en `shots/despues-d1-intro-1.png`, `-intro-2.png` y `-intro-3.png`.

Se mantienen las dos líneas actuales de Maripaz y se añaden **tres líneas** (2 de Maripaz y 1 de Bruno) más tres
gestos:

| # | Quién / qué | Texto o acción |
|---|---|---|
| — | Maripaz (ya existe) | «¿Ocho meses sin confirmar? Eso no es un cliente, cariño. Es un exnovio.» |
| — | Maripaz (ya existe) | «Los paso a la web, que allí cabe todo. Pero alguien tiene que llamarles.» |
| g1 | gesto | Levanta la tableta (`api.sostener(MARIPAZ, tabletaEnAlto)`). |
| 1 | Maripaz | **«Eso, por escrito. Con copia a todos.»** |
| g2 | gesto | `click` `click` y `beep`: el «¡ding!» suena en el bolsillo de Bruno, y en el de cada presente parpadea un sobre sobre la cabeza (si está Gervasio, son sus tres móviles). Bruno saca el móvil (`sostener('bruno','movil')`). |
| 2 | Bruno | **«Estamos a un metro.»** |
| 3 | Maripaz | **«Por eso. Lo que no está en copia no ha pasado.»** |
| g3 | ventana | Entra la ventana, ya con «Maripaz › Todos: escribiendo…», y el primer ataque llega como correo. |

Por qué funciona:

- El primer ataque de su mazo (R08) es «Te escribo desde el cariño más absoluto. Con un banner en la firma.» y ahora es
  literal: **le está escribiendo**. El banner en la firma remata que para Comercial un correo a toda la casa son
  impresiones, sin tener que explicarlo.
- La línea 3 es la filosofía de la casa en ocho palabras. Le da sentido después a «Que conste que lo has pedido tú»
  (Gervasio, D3) y a «Te lo pongo por escrito» (Íñigo, D4) sin tocarlas.

Comprobaciones de texto: las tres líneas tienen menos de 40 caracteres y ninguna usa fórmulas con tope (ni «No es X. Es
Y.», ni «primera vez», ni «factur…», ni «Como…»). Tampoco añaden ningún «cariño».

**Revanchas:** se quedan como están. `INTRO_REVANCHA` («¿Llamar yo a Siestatón un viernes? Te lo pongo por escrito.»)
ya vale, y no se repite el «a un metro».

### Sembrar la costumbre antes del primer duelo (0 líneas nuevas)

El Acto I ya tiene la semilla dispersa:

- El primer «RV:» de Tadeo llega al móvil.
- La genérica «Hablarle a eso sería como responder a todos: posible, pero imperdonable» (`content/game.js:20`).
- Yoli: «…Me ha puesto en copia a mi madre.» Es justo el hilo que enseña la R08, y además con Maripaz.

Para que el jugador sepa desde el paso 4 para qué sirve la libreta, propongo **un solo cambio de texto (no es una línea
hablada)**: el aviso de réplica aprendida (`content/game.js:400`, `learnReply.notice`).

- Hoy: «Réplica apuntada en la libreta.»
- Propuesto: **«Réplica apuntada. Para el próximo "responder a todos".»**

Sale en cuanto Celestino cuenta lo del ascensor, una hora de juego antes del D1, y nombra el duelo antes de que exista.

### Variación en los otros tres arranques (sin repetir el chiste)

- **D2, Teodoro.** Ya está hecho: no le habla a Bruno, le contesta **por fax** desde dos metros («¿Tú? ¿El de la web?
  ¿En mi página? Contesta.»). El chiste se da la vuelta: él no está a un metro, está a 1996. 0 líneas.
- **D3, Gervasio.** «Mejor por escrito. Que conste que lo has pedido tú.» (ya existe) mientras saca el móvil
  (`sostener: 'movil'`, ya existe). La variación está en su forma de escribir: a trozos y con «escribiendo…». 0 líneas.
- **D4, Íñigo.** «Perfecto. Te lo pongo por escrito.» (ya está en la escena de entrada). Si se quiere una vuelta de
  tuerca, va en §6 como opcional: la ventana con piel de diapositiva. 0 líneas.

---

## §3 El primer asalto que enseña

No hace falta un asalto guiado. El D1 ya empieza con el ataque más fácil del juego y solo hay que dejar que se lea.

1. **El ataque llega como correo, no como rótulo.** Mientras Maripaz lo dice en su globo, la ventana pone «Maripaz ›
   Todos: escribiendo…» (`shots/despues-d1-ataque-escribiendo.png`). Cuando termina, suena el «¡ding!» y el texto queda
   en el cuerpo, en amarillo y a dos líneas (`despues-d1-menu.png`). Se aprende lo que se oye = lo que me han escrito.
2. **Las réplicas tienen procedencia.** Encima del menú hay una pestaña fija: **«LIBRETA · réplicas oídas por la
   casa»** (`despues-d1-menu.png`, abajo a la izquierda). No es una línea de diálogo ni ocupa una opción. Dice de dónde
   salen las frases y por qué solo están esas.
3. **La correcta es evidente para quien estaba atento.** R08 («desde el cariño más absoluto») contra «Y yo te leo desde
   el más absoluto modo avión». La réplica imita la forma del ataque, igual que en Monkey Island. Además, Yoli la contó
   hablando *de Maripaz*. Es el mejor primer asalto posible y ya es el primero del mazo: no se toca.
4. **Bruno contesta en el mismo idioma.** Al elegir, el cuerpo pasa a «Tú › Todos: «Y yo te leo…»» en azul claro
   mientras Bruno lo dice (`despues-d1-replica.png`). El jugador ve que ha *contestado al hilo*, no que ha dicho una
   frase.
5. **El resultado se ve sin leer** (§5): el marco destella en verde, se rellena el primer «+1» y entra el aviso
   «Celestino: +1»; Maripaz encaja (`despues-d1-acierto.png`).
6. **Cuánto falta:** tres huecos «+1» desde el principio. Uno lleno es «uno de tres», sin números.
7. **Qué pasa si fallo:** a la derecha están desde el principio, en gris, «CC: Siestatón · Planta · Empresa». Antes de
   fallar ya se ve quién se va a enterar. El primer fallo enciende «Siestatón» en rojo (`despues-d1-fallo.png`).

Opcional (+1 línea, no la recomiendo): antes del primer menú de la partida, Bruno dice «Para esto llevo la libreta.».
Con la pestaña sobra.

---

## §4 La pantalla nueva

Comparativas antes/después:

- Escritorio: `shots/comp-d1-menu.png`, `comp-d1-fallo.png`.
- Móvil horizontal (844×390): `comp-d1-movil.png`.
- Secuencia completa del D1 nuevo: `shots/secuencia-d1-despues.png`. Muestra la entrada, el escribiendo, el menú, la
  réplica, el acierto, el fallo y el menú siguiente.

### Maqueta (320×200; la ventana pasa de 63 a 43 px)

```text
┌──────────────────────────────────────────────────────────────────────┐ y 2
│ ✉ Llamar a Siestatón                          Le toca a: ▐B. Pollejo▌│ barra: EL MARRÓN y A QUIÉN LE CAE
│ Maripaz › Todos: «Te escribo desde el cariño más absoluto. Con       │ cuerpo: EL ATAQUE (amarillo, 2 líneas)
│                   un banner en la firma.»                            │   (o «Tú › Todos: …» al contestar)
│──────────────────────────────────────────────────────────────────────│
│ [+1][+1][+1]                         CC: [Siestatón][Planta][Empresa]│ pie: a favor · quién se entera
└──────────────────────────────────────────────────────────────────────┘ y 45
                                                     ┌──────────────┐
                                                     │■ Celestino: +1│  aviso al acertar (1,8 s)
                                                     └──────────────┘
          (sala visible: rival y Bruno con el móvil en la mano)
┌ LIBRETA · réplicas oídas por la casa ┐
│ Y yo te leo desde el más absoluto modo avión.                        │ menú (sin cambios)
│ …                                                                    │
```

### Qué se queda, qué se va y qué se simplifica

| Elemento hoy | Decisión | Por qué |
|---|---|---|
| Título «RESPONDER A TODOS» | **Se va** de la ventana. | La ficción ya lo ha planteado. El nombre del duelo queda para la música, el registro y la documentación. |
| «De: Maripaz Remitido» | **Se simplifica** a «Maripaz › Todos:» delante del cuerpo, con el color del personaje. | Quién escribe y a quién, pegado a lo que escribe. «› Todos» mantiene el «Para: Todos» en tres caracteres. |
| «Para: Todos» | Queda dentro de «› Todos». | |
| «Asunto: RE: …(contiene pu…» | **Se simplifica** a la barra: el marrón en corto (`marron`, campo nuevo opcional del rival; si falta, `subject`). | El asunto *es* el marrón. Cortado con «…» no servía. |
| «RE: RE: RE:» que crece | **Se va de la pantalla** (sigue en `duelInfo.subject` para las pruebas). | Repetía lo que ya dice el CC. Tres señales para un solo fallo era la mitad del caos. |
| Cuerpo | **Se queda y gana jerarquía.** Es la primera línea legible, dos líneas en amarillo. Mientras el rival habla, «escribiendo…»; al contestar Bruno, «Tú › Todos: …». | Es lo único que hay que leer para jugar. |
| «Asignado a: B. Pollejo» | **Se queda, se explica y sube a la barra:** «Le toca a: [B. Pollejo]», en una pastilla roja. Al ganar, «Le toca a: [Maripaz]» en verde. | Es lo que está en juego. «Le toca a» se entiende sin saber qué es un ticket, y se mantiene el «Pollejo» mal escrito (el chiste de siempre). |
| «ACIERTOS 0/3 · FALLOS 0/3» | **Se va de la pantalla** (sigue en `duelInfo.score`). | Lo sustituyen los huecos y la escalera de CC, que dicen lo mismo con forma. |
| Cuadraditos y «+1» sueltos | **Se convierten en** tres huecos «+1» (gris → verde) a la izquierda. | Cuánto llevo y cuánto falta, de un vistazo. En D4 son cinco. |
| «CC:» que aparece al fallar | **Se convierte en el contador de fallos:** «CC: [Siestatón][Planta][Empresa]», visible desde el principio en gris; cada fallo enciende uno en rojo. El último es la derrota. | Une tres señales (RE:, CC y cuadradito rojo) en una sola que *es* el chiste: cada fallo, se entera más gente. |
| Línea verde del hilo | **Se convierte en aviso de notificación** (ver abajo). | |
| Rival tapado | **Se arregla:** 43 px en vez de 63, y el rival con su tableta o su móvil en la mano. | `despues-d1-menu.png`: Maripaz se ve entera sobre la mesa, con la tableta en alto. En D3 y D4 se ve a todos. |

**La línea verde.** Se va como frase y vuelve **con forma de notificación**: un aviso pequeño que entra deslizándose
por la derecha bajo la ventana. Lleva un cuadrado del color del remitente y dice **«Celestino: +1»**, sin frase.

- Usa el mismo lenguaje que la ráfaga de notificaciones que el juego ya enseña en la escena viral (`efectos.js
  drawBurst`), así que el jugador ya sabe leerla.
- Quien da el +1 es alguien a quien el jugador conoce: Celestino, Yoli, Gertrudis… Dato nuevo `masUno` en
  `content/duelo.js`, en orden por acierto.
- El chiste deja de estar en un texto ilegible y pasa a ser visual: «toda la casa mirando el hilo y dándote la razón,
  con nombre». No compite con la línea de Maripaz porque no hay nada que leer.
- El cameo de Tadeo en D4 («RV: Resumen IA: todos de acuerdo»!!) usa el mismo aviso, con su texto a dos líneas.
- El «RV: Bruno ha abandonado el hilo.» de la retirada también puede ir como aviso; en el registro sigue igual.

**El rival se ve y reacciona en el personaje.** Los dos sostienen el aparato durante todo el hilo: Bruno su `movil`
(icono del inventario), Maripaz su `tabletaEnAlto`, Gervasio su móvil y Teodoro el fax de siempre. La reacción
(§5) va en el marco, en un temblor y en la línea del rival.

**Móvil táctil** (`shots/comp-d1-movil.png`): es el mismo lienzo de 320×200 escalado, así que la ventana no cambia. El
menú compacto táctil (5×11 px) ya existe y la pestaña de la libreta cae fuera de la zona de toque. Nada nuevo es
interactivo, así que no hay objetivos táctiles nuevos.

---

## §5 Acierto y fallo: qué pasa exactamente

| Momento | Pantalla | Sonido | Personajes |
|---|---|---|---|
| El rival ataca | Cuerpo «Rival › Todos: escribiendo…». Al acabar el globo, el texto entra en el cuerpo y un sobre parpadea 0,9 s sobre cada presente. | `beep` (el «¡ding!») | El rival habla con el aparato en la mano (`talk`). |
| Bruno contesta | Cuerpo «Tú › Todos: «réplica»» en azul claro. | — | Bruno lo dice con el móvil en la mano. |
| **Acierto** | El marco destella **verde** 0,45 s; se llena un hueco «+1» (el nuevo, en verde claro); entra el aviso «Nombre: +1» 1,8 s. | `good`, luego `beep` del aviso. | El rival encaja: `hurtByPair` o `hurt`, sin cambios. Propuesta: un paso atrás del rival de 2 px durante 300 ms (el golpe que llega). |
| **Fallo** | El marco destella **rojo**; se enciende el siguiente chip de CC (el nuevo, en rojo claro); temblor de pantalla de 220 ms y 1 px. | `bad` | El rival contesta siempre (la floja o la burla, sin cambios). Propuesta: paso atrás de Bruno. |
| `cabe` (D2, larga) | El cuerpo enseña la réplica cortada en 38 + «—» durante 1,2 s, como hoy. **Sin destello ni chip**: no es fallo. | `paper` | Teodoro: «NO CABE…» |
| `aTiempo` (D3, interrumpe) | Sigue «escribiendo…» a la derecha del cuerpo y el trozo nuevo a la vista, como hoy. **Sin destello ni chip.** | `click` | «Me has interrumpido. Se apunta.» |
| Comodín, 1.ª vez | Sin destello ni chip. | — | «Te espero.» |
| Remate | Se llenan los «+1»; el cuerpo enseña el remate del rival; réplicas en gris y [Usar objeto]. | — | — |
| **Victoria** | «Le toca a» pasa a **[Maripaz]** en verde: el marrón ha cambiado de manos. | `good` | `onWin`, sin cambios. |
| **Derrota** | Los tres chips en rojo y «Le toca a: [Vacante]». | — | `defeatLine`, escena y titular, sin cambios. |

Así, sin leer nada, verde y lleno es que voy bien, y rojo y encendido es que se entera más gente. Y siempre se ve
quién se queda el marrón.

---

## §6 Los otros duelos

Capturas: `shots/comp-d2.png`, `comp-d3.png`, `comp-d4.png`.

**D2, Teodoro por fax.** Es la misma ventana con piel de papel (beige, filete de puntos y un icono de hoja en lugar del
sobre).

- Cuerpo en mayúsculas («Teodoro › Todos: «¿CONTRASTADO? FUENTES. NÚMERO.»»).
- «Le toca a: [EL DE LA WEB]» en rojo tinta.
- `CC: [Aurora][Planta][Empresa]`: el primer fallo pone en copia a la persona con la que no se habla. Ese es el chiste
  del D2, ahora visible desde el principio.
- Aquí sí tiene sentido que no hable: el «fax» del rival sigue siendo su voz (`say` del rival). No hay sobres sobre las
  cabezas (en Talleres no hay móviles) ni `sostener`.
- Los +1 de los avisos, en tinta: «Aurora: +1», «LA GOYITA: +1», «Celestino: +1».
- `cabe` intacto: la larga se ve cortada en el cuerpo y no destella ni enciende chip.

**D3, Gervasio con «escribiendo…».**

- «Le toca a: [Vacante (becario)]». El marrón en corto: «Redactar el acta de la última Reunión».
- «escribiendo…» pasa de la barra de título (donde hoy compite con el marcador) a la derecha del cuerpo, al lado de lo
  que se está escribiendo. Es más claro.
- `CC: [Sus 3 móviles][Planta][Empresa]`. Ver encenderse «Sus 3 móviles» es el mejor chiste de su CC.
- `aTiempo` intacto: el cuerpo sigue mostrando el trozo nuevo con «...» delante y los dos huecos «+1» (`winScore 2`).

**D4, Íñigo en el clímax.** Mismo lenguaje con cinco huecos «+1» y `CC: [Optimal][Planta][Empresa]`.

- Hoy el D4 arranca con «CC: Toda la empresa» fijo. En la ventana nueva ese CC inicial no se pinta: la escalera manda
  (decisión 3).
- Gervasio, Brais y Maripaz siguen visibles (la ventana baja de 63 a 43 px y deja a la vista la fila de presentes), y
  reciben el «¡ding!» con un sobre sobre la cabeza.
- El cameo de Tadeo, como aviso.
- Opcional, no lo he prototipado: en D4 la ventana con **piel de diapositiva** («DIAPOSITIVA 248») sobre el proyector
  colgado en la 247. Es el consultor que lo proyecta todo, también el hilo. Coste: una paleta y un título.

Nada de esto toca `buildMenu`, `cabe`, `aTiempo`, los mazos, `finishers` ni los textos de `duelo.js`.

---

## §7 Coste, pruebas y tandas

### Ficheros

| Fichero | Qué | Tamaño |
|---|---|---|
| `engine/duel.js` | `drawHud` nuevo (≈ 100 líneas; el del prototipo está en `…/duelo/hud2.js`). Estado `S` con `sender`, `mine`, `chips`, `toast`, `fx`, `ding`, `marron`, `fromShort`, `fromColor` y `masUno`. Ganchos en 5 sitios: el ataque llega con «escribiendo», Bruno contesta en el cuerpo, `toast` y `fx` al acertar, `fx` y `shake` al fallar, y el cameo como aviso. `sostener` de los dos al abrir. `hudTop` 66 → 46. **`duelInfo` no cambia** (`subject`, `cc`, `score` y `body` siguen calculándose igual). | ≈ +130 / −70 |
| `content/duelo.js` | `masUno` (nuevo, 4 listas de nombre y color). `texts.plusOne` deja de usarse (se puede borrar). | +7 |
| `content/rooms/sala_amazonas.js` | Las 3 líneas y los 3 gestos de §2 en `MP_SALA`; en `duelMaripaz`, `marron: 'Llamar a Siestatón'` y `sostener: tabletaEnAlto`. **Ojo: hoy lo está tocando otro agente.** | +8 |
| `content/rooms/catacumba.js`, `pajarera.js`, `content/escenas/climax.js` | `marron:` en corto (1 línea cada uno). Opcional: `ccChips`. | +3 |
| `content/game.js` | El aviso de `learnReply` (§2): solo cambia un texto. **Lo está tocando otro agente.** | ±1 |
| `docs/CONTENT_SCHEMA.md` §10 | `marron`, `sostener`, `ccChips` y `masUno`. | — |

**Líneas nuevas en el camino principal: 3** (D1 de primeras: «Eso, por escrito. Con copia a todos.», «Estamos a un
metro.» y «Por eso. Lo que no está en copia no ha pasado.»). Un texto cambia: el aviso de réplica. Cero líneas en D2,
D3 y D4. Nada pasa por los topes de fórmulas del auditor.

### Pruebas

- **No cambian** las que leen `duelInfo`: `smoke` («ACIERTOS 0/2…», «RE: RE:»), `test-fase0` (`cc`, `score`),
  `test-e6-motor`, `test-e6-pd`, `test-e7-motor`, `test-e7` (`subject`, `cc`) y `test-comedia-p4` («(contiene
  publicidad)» en `subject`). El prototipo conserva esos campos: `info.body` sigue teniendo el ataque desde el principio.
- **`test-critica3` N7** busca en el registro «aviso:RV: Bruno ha abandonado el hilo.». Si la retirada pasa a aviso, se
  sigue escribiendo en `game.log` igual.
- **`test-comedia-p4` D1:** el orden del registro gana tres líneas antes del primer ataque. Su comprobación «entrada
  desde el árbol» busca «Es un exnovio.» y sigue valiendo. Añadir:
  - «Estamos a un metro.» una sola vez y solo antes de la primera derrota;
  - que en la revancha no salga.
- **`text-audit`**: las 3 líneas nuevas (≤ 80, sin vetadas). Pasar `--estatico --plan --e2 --e5 --e6 --recuento` sobre
  `sala_amazonas`.
- **Prueba nueva**, en `test-e6-motor` o un `test-duelo-hud`: `S.chips` = `ccSteps` en corto, de largo `maxMisses`; el
  `toast` sale al acertar y no con `cabe`, `aTiempo` ni el comodín; `fx` no salta en larga ni en interrupción.
- **Capturas a regenerar:** `tools/shots/*duelo*`, `e6-pd-d2-*`, `e7-d3-*`, `fase0-duelo-*`, `paquete-d-duelo-*` y
  `comedia-p4-duelo-d1` (solo el aspecto).
- `walk-data`, `walkthrough`, `extras`, `play-mouse` y `fuzz`: sin cambios. El paso 29 elige por id de pareja y en modo
  rápido las 3 líneas son instantáneas.

### Tandas (por impacto y coste)

1. **Tanda 1: lo que arregla la queja.** Tiene que esperar a que el otro agente suelte `sala_amazonas.js` y `game.js`.
   - (a) `drawHud` nuevo con barra, cuerpo y pie, la escalera de CC y los huecos «+1». Fuera la línea verde.
   - (b) `hudTop` a 46: el rival se ve.
   - (c) Las 3 líneas y los gestos del D1.
   - (d) La pestaña «LIBRETA».
   - Solo `engine/duel.js`, `content/duelo.js` (`masUno`) y `sala_amazonas.js`. Medio día con capturas.
2. **Tanda 2: pulido.**
   - El aviso «+1» con nombre (si en la tanda 1 se deja un aviso genérico «+1»).
   - Los sobres sobre los presentes.
   - El paso atrás del golpe.
   - `marron` en los otros tres rivales.
   - El texto del aviso de `learnReply`.
   - La retirada como aviso.
   - Opcional: la piel de diapositiva del D4.

---

## §8 Decisiones para el dueño

1. **El planteamiento del D1:** ¿valen las tres líneas («Eso, por escrito. Con copia a todos.» / «Estamos a un metro.»
   / «Por eso. Lo que no está en copia no ha pasado.»)? ¿O lo prefiere mudo (solo la tableta y el «¡ding!»)?
2. **«Le toca a:»** en lugar de «Asignado a:». ¿Le parece bien? ¿Se mantiene el «B. Pollejo» mal escrito?
3. **El CC como contador de fallos** (Siestatón → Planta → Empresa, visible desde el principio), sin «RE: RE:» ni
   «ACIERTOS 0/3 · FALLOS 0/3» en pantalla. En D4 esto quita el «CC: Toda la empresa» fijo del arranque.
4. **La línea verde se convierte en aviso «Celestino: +1»** con gente conocida (¿quién da los +1 en cada duelo?). La
   alternativa es quitarla del todo y dejar solo el hueco verde.
5. **La pestaña «LIBRETA · réplicas oídas por la casa»** sobre el menú y el aviso de `learnReply` que nombra el
   «responder a todos». ¿Le valen las dos, una o ninguna?
