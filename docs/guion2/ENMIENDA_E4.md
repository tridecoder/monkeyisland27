# ENMIENDA E4 · Audiencias (Yoli), Discover y el titulador

> Jefe de guion. Destila G1-G4 (`scratchpad/audiencias/G1.md` … `G4.md`) con el criterio del director y los dos
> cambios de encargo del dueño (minijuego de titulares; piezas que se multiplican). Implementable sin preguntar.
> Todo vive en ficheros de P2 (`pecera*.js`, `art/pecera.art.js`) salvo: Aurora y Teodoro (`catacumba.js`, P3), el
> epílogo (`escenas/final.js`, P1, alternativa A aprobada por el dueño: S6) y tres flags globales (`flags.js`, P0).
> No cambia soluciones, flags existentes ni los 44 pasos. Cadena final intocable: no se toca.
>
> Verificado con scripts en `scratchpad/audiencias/tit/`: `piezas.mjs` (tablas y fórmula, las de §3bis.3, idénticas),
> `gen.mjs` (combinaciones al azar), `all.mjs` (las 540 combinaciones: largo y topes del auditor), `lineas.mjs` (las
> 52 líneas habladas de este documento: ≤ 80 caracteres, ninguna fórmula con tope, sin «criatura» ni «chaval»), `wr.mjs`
> (cuántas líneas ocupa cada titular en pantalla). Resultado: 0 fallos.
> **Titulador (§3bis):** las piezas definitivas son de la mesa de guionistas. Se verifican con
> `scratchpad/audiencias/titulador/gen.mjs --todas` (1.344 combinaciones, 0 fallos), y la cata y las tiradas están en
> `titulador/VEREDICTO.md`. Los scripts de `tit/` valen para el resto del documento.

---

## §1 · Tesis de Yoli

1. **Quién es:** la que paga las nóminas. Hace Discover **en minúscula y en voz baja**: servicio, autoridad prestada y
   gancho cortado. El Titulator (Rubén) sigue siendo el cebo EN MAYÚSCULAS. Rubén grita. Yoli susurra.
2. **Qué quiere:** que suba. Es empírica, no cínica. Es buena en lo suyo y se cree lo que publica («Lo leí en un sitio
   fiable.» «¿Cuál?» «El nuestro.»). Esta noche quiere dos cosas: colocar la exclusiva de Bruno y que le pongan
   nombre a la borrasca, porque «sin nombre no la pincha nadie».
3. **Por qué hace gracia:** su lógica es aplastante y siempre acierta. Como la exclusiva no se puede filtrar, prueba
   «los que no dicen nada», y le presta a Bruno su **titulador**. Ahí el jugador descubre jugando la ley de la casa:
   cuanto menos dice un titular, más gente entra. La opa menguante la ejecuta el propio jugador: para subir tiene que
   ir quitándole la opa a su titular. El récord absoluto de la casa es «Confirmado: el Euríbor sube, baja o se queda
   igual». Nadie dice que eso esté mal. Yoli lo celebra («Lo he medido: es verdad.»).

---

## §2 · Qué entra de quién y qué se cae

| Pieza | De | Decisión | Por qué |
|---|---|---|---|
| Discover en minúscula frente al Titulator en mayúscula | G1-G4 | **Entra** | Acuerdo de los cuatro: dos oficios que no se pisan |
| La opa menguante (siembra 23 → prueba 34 → ganador 40 → paga) | G4 | **Entra, es la columna** | Es trama, no gag suelto. Ahora la escalera la sube el jugador en el titulador |
| «En la dirección web. Donde no molesta.» | G4 | **Entra** (paso 40) | Mejor remate de los cuatro informes, y se ve en pantalla a la vez |
| Dar la pieza: test A/B con barras (G1), grupo de control (G2), retitular (G3), versiones (G4) | G1-G4 | **Fundidas en el TITULADOR** (§3bis) | El dueño pidió minijuego. De G1 quedan las barras y el marco que tiembla. De G2, el pósit que Aurora devuelve al original. De G3, las franjas en minúscula. De G4, la escalera. |
| «Tres lectores. Uno era yo, comprobando.» | G1 | **Entra** (paso 34) | El titular honesto da 3, y lo dice ella |
| Hoja «lo más leído» impresa, con chinchetas, como único ranking | G1+G3 | **Entra** (soporte elegido) | Ya está pintada. Impresa en un periódico económico ya es chiste. Sirve desde el Acto I. Yoli reimprime cada vez que la miras (gag físico) |
| Tablero en el monitor (G4) / monitor con ranking (G2) | G2, G4 | **Se cae como ranking**; el monitor pasa a ser el titulador | Una sola pieza de ranking. El monitor ya tiene trabajo |
| Ibex que baja de lectores al mirar (3, 2, 1… 0) | G4 | **Entra en la hoja** | Gag mudo que evoluciona |
| Bruno en el top por la cafetera | G1, G3 | **Entra** (hoja, Acto II, solo se ve) | Sin línea: lo cuenta la hoja |
| Ráfaga de avisos al revivir el CMS | G1 | **Entra** (paso 23, 0 líneas) | Camino principal, gratis |
| Borrasca sin nombre como rasgo | G3 | **Entra**: siembra en el paso 23 y nombre en la hoja del Acto III (ya no es asunto del titulador) | El director la quiere como rasgo |
| Borrasca «Bruno» en el epílogo | G3 | **Se cae del epílogo**; su paga pasa a la hoja del Acto III | Solo cabe una paga en el epílogo |
| Paga del epílogo «¿Cuántos, de un millón?» «Una.» | G4 | **Entra** (S6; aprobada por el dueño) | Cumple las tres condiciones |
| COINCIDO / EN QUE PIDE COMPLEMENTO | G4 | **Entra** (contrapunto de papel 1) | Teodoro y Aurora no se hablan y por fin son dos expertos que coinciden. En gramática |
| Aurora corrige el pósit hasta devolver el titular original | G2 | **Entra**, con «Los dos puntos se inventaron…» de G3 (contrapunto 2) | Paga del titulador en papel |
| Fax de Teodoro midiendo «Los expertos coinciden» (22 caracteres) | G1 | Se cae | Ya hay dos momentos de papel, que es el tope |
| «¿Quiénes son los expertos?» (tertulianos / debate) | G1, G2, G4 | Se cae | Lo resuelven COINCIDO y un murmullo («Primero, que coincidan.») |
| «¿Tú te crees esos titulares?» → «El nuestro.» | G2 | **Entra** | Lo pide el director: Yoli se cree lo que publica |
| `Y_DISC` entero, Custodia pionera, tostadora | G2 | Se cae | Presupuesto. El titulador enseña la lógica jugando |
| «La lata es economía doméstica», «¿Quién decide…?» | G3 | Se cae | Lo cuenta el titulador sin explicarlo |
| Yoli enseña a Rubén a susurrar | G3 | Se cae | Caro y con «X no se Y. Se Z.» (tope) |
| Rubén «hora clave» | G1 | Se cae | Presupuesto |
| Gertrudis «LOS EXPERTOS DE YOLI SOMOS EL MICROONDAS Y YO» | G4 | Se cae | Presupuesto. Se deja anotado para la mesa |
| Maripaz «faldón a Conservas Marea Baja» | G4 | Se cae | No hace falta cruzarla |
| «El truco de la abuela» | G3 | **Fuera del juego** | Orden del director |
| «Google Discover» | G4 | No se dice ni se escribe | «Discover» basta |

---

## §3 · Situaciones paso a paso

Constantes de `pecera.escenas.js`: `Y`, `PLIN`, `YOLI_EN = [719, 116]`, `junto(api, x, y, cam)` y `encuadre`
(exportar `encuadre`). Las coordenadas de arte van en la sala de 800 px; `mover` les suma `D = 410`.

### S1 · Ráfaga de la cola del CMS (CAMINO PRINCIPAL, paso 23, 0 líneas) — `pecera.escenas.js`, `cmsEntrada`
Va dentro del `cutscene`, después de `junto(...)` y `api.face('right')` y antes de `api.anim(Y, 'reach', 900)`:
```js
api.setState('monitor_yoli', 'publicado');
await api.viral({ avisos: RAFAGA, color: '#7aff7a', cada: 420, ms: 3600, sfx: PLIN });   // sin contador: la pantalla está negra
api.setState('monitor_yoli', null);
```
`RAFAGA` = los cinco avisos de §5 (F1 a F5, en su versión corta), en ese orden. Cada uno ocupa como mucho
dos líneas en los 132 px del aviso (medido). Como la ráfaga enseña cuatro a la vista, el quinto (el Ibex) echa al
primero y la economía llega la última. El resto de `cmsEntrada` no cambia.

### S2 · Siembra de la borrasca y de Discover (CAMINO PRINCIPAL, paso 23) — `pecera.dialogos.js`, `yoli`
```js
onStart: async (api) => {
  if (api.once('pecera_yoli_borrasca')) {
    api.faceActor(Y, 'up');                                   // (le habla al monitor)
    await api.sayAs(Y, 'Ponle nombre. Venga. Ponle nombre a la borrasca.');
    api.faceActor(Y, api.player);
    await api.sayAs(Y, ['Hola Bruno, Bruno becario, becario elContable, cuánto cobra un becario.',
      'Perdona. Sin nombre no la pincha nadie. La borrasca, digo.']);
  } else await api.sayAs(Y, ['Hola Bruno, Bruno becario, becario elContable, cuánto cobra un becario.', 'Perdona, me sale solo.']);
},
```
La despedida (`Me voy.`, `exit`; se oye una sola vez, que es la del paso 23) cambia el texto: siembra de la opa menguante.

### S3 · La hoja «LO MÁS LEÍDO» (VISUAL, opcional, Actos I-III) — `art/pecera.art.js` + `pecera.js`
- **Hotspot** en `layout`, dentro de `mover({...})`: `lista_mas_leidas: { rect: [285, 46, 20, 18], walkTo: [292, 122],
  face: 'up', priority: 2 }`, sin `draw`: el fondo ya pinta la hoja «TOP» (`rect(g, 286, 47, 18, 16)`). Se solapa 2 px
  con `monitor_yoli` y 0 con el reloj.
- **Objeto** `{ id: 'lista_mas_leidas', name: 'lo más leído', handlers: { mirar } }`: solo `mirar`. Los demás verbos
  van al genérico (0 líneas).
- **Mirar** (local `pecera_top_n` += 1):
  1. Si `n >= 2`: `api.anim(Y, 'reach', 500); api.sfx('paper');` (Yoli arranca la hoja y clava otra sin mirar). Solo
     con `n === 2`, antes del plano, Yoli dice O2.
  2. `await api.detalle({ titulo: 'LO MÁS LEÍDO', w: 220, h: 100, color: '#FF78B8', draw: hojaTop(version, ibex),
     lines })`, con `lines`:
     - `n === 1` → `[['player', O1]]`;
     - Acto III y `api.once('pecera_top_borrasca')` → `[['player', O3]]`;
     - si no, Acto III con `discover_ganador` y `api.once('pecera_top_ibex0')` → `[['player', O4(ganador)]]`;
     - si no, sin líneas (`ms: 2400`).
  3. `version` = `'III'` con `acto_3_iniciado`, `'II'` con `cms_vivo` y `'I'` en el resto. `ibex` = `Math.max(1, 4 - n)`
     antes del Acto III; en el Acto III, `0` si hay `discover_ganador` y `1` si no.
- **`hojaTop`** (en `pecera.escenas.js`; `rect`, `frameRect` y `label` de `engine/draw.js`; `drawText` y `measure` de
  `engine/font.js`): folio blanco (`PAL.paper[7]`), filete rosa, chinchetas roja y azul en las esquinas. Cabecera:
  `LO MÁS LEÍDO · ${api.hora()} · KW: ${kw}`, con `kw` PERSIANAS en I, BORRASCA en II y BRUNO en III. Debajo, cinco filas
  `n · titular · lecturas`. **La impresora corta cada titular a 34 caracteres y le añade «...»**: todos los del top
  acaban en puntos suspensivos. Después, una fila «···» y la última, en gris: `214 · El Ibex cierra plano · ${ibex}`.
  Las filas de cada versión están en §5 (columna «Ubicación»). En la versión II, con `cafetera_viral`, la fila 3 es
  «Un joven da las buenas noches a una cafetera · 11.302». En la III, con ganador, la fila 5 es el titular ganador con
  «· 00:01».

### S4 · Prueba A/B en el monitor (CAMINO PRINCIPAL, paso 34) — escena nueva `pecera_opa_ab`
En `pecera.js`, `ordenador_bruno.usar`, justo después de `if (!api.flag('herminia_midio')) await
api.scene('pecera_herminia_mide');`, va `await api.scene('pecera_opa_ab');`.
```js
async function opaAB(api) {
  if (!api.once('pecera_opa_ab')) return;
  await api.cutscene(async (api) => {
    await encuadre(api, 720);
    api.faceActor(Y, api.player);
    await api.sayAs(Y, M4);                                   // «No me has avisado…»
    await titulador(api, { demo: [['hidro', 'robledal', 'punto'], ['meteorologos', 'robledal', 'corte']] });   // mudo
    await api.sayAs(Y, [M5, M6]);                             // «Tu titular: tres…» · «Te dejo mi titulador…»
  });
  api.cameraFollow();
}
```
La demo abre el titulador (§3bis) con el titular de Bruno (3 usuarios). Espera 1.200 ms. El cursor cambia las tres
casillas de una en una (400 ms cada una, `sfx('click')`) hasta dejar «Los meteorólogos ponen fecha a la llegada de Banco Robledal: será el...» (`meteorologos·robledal·corte`),
publica y el contador sube de 3 a 9.500. El plano se cierra a los 1.500 ms. La demo no guarda récord ni pone flags.
Coste: +3 líneas.

### S5 · El ganador (CAMINO PRINCIPAL, paso 40) — escena nueva `pecera_opa_ganadora`
- **`onEnter` de `pecera.js`**: va justo **después** de la línea de `pecera_anexion` y **antes** de la de
  `cms_entrada`:
  `if (api.flag('acto_3_iniciado') && api.flag('pieza_escrita') && !api.flag('discover_ganador')) { await
  api.scene('pecera_opa_ganadora'); return; }`.
  En el recorrido, la entrada del paso 37 es la de `pecera_dos_ias` y la del paso 40 es esta. Con el extra XE3
  (`herminia_de_alta`) la anexión va antes y esta escena espera a la siguiente entrada. Por eso el epílogo tiene una
  variante de seguridad.
- **Escena**:
  1. `junto(api, 690, 124, 700)`. Yoli se levanta de un salto (`anim(Y, 'reach', 600)`) y suenan tres `PLIN`.
  2. Yoli: M7.
  3. `api.detalle({ titulo: 'PRUEBA · RESULTADO', w: 296, h: 110, x: 12, y: 4, color: '#FF78B8', draw: resultado }, …)`.
     Arriba, en `micro` y **tachadas en rojo**, hasta cuatro versiones con sus usuarios: las cuatro últimas que
     publicó el jugador (`pecera_disc_hist`) o, si no jugó, las de `VERSIONES_DEFECTO`. La fila de Bruno va en gris
     con un candado: «Hidrovoltia lanza una opa sobre Banco Robledal · 3». Abajo, grande y con una coronita de píxeles,
     el **ganador**: el récord del jugador si es ≥ 243.000; si no, «Los cocineros coinciden: los mejillones de lata
     están mejor si los preparas con...» (243.000). Debajo del ganador, en `micro` gris, la URL
     `elcontable.es/mercados/hidrovoltia-lanza-una-opa-sobre-banco-robledal`, con «opa» en rojo.
     El cuerpo espera 1.500 ms en silencio y luego Bruno dice M8 y Yoli dice M9.
  4. `api.setFlag('discover_ganador', idAsuntoDelGanador)` ('mejillones' por defecto).
- No toca el paso 40: después de la escena, Bruno da el álbum a Anselmo igual. Coste: +3 líneas.

### S6 · Paga (epílogo) — `escenas/final.js` (alternativa A, aprobada por el dueño; +1 línea)
He leído `content/escenas/final.js` (l. 185-197) y confirmo las tres condiciones del director:
(a) La línea de Yoli sobre la cuenta que comenta «abrígate» **ya está hoy** en el epílogo (l. 190). Esto solo la remata.
(b) **No adelanta** quién es la lectora. Sigue siendo «Una.», como hoy.
(c) Queda **antes y fuera** de la cadena intocable. El bloque de Yoli termina con su salida (l. 196). Después vienen la
llamada de la abuela, «Abrígate tú.», «¡Me ha contestado el periódico!», la tarjeta y los créditos, y nada de eso se toca.

| Actual | Nuevo |
|---|---|
| — | YOLI: Bruno. {Tus mejillones}: un millón cien mil. Nadie pasó del titular. |
| YOLI: Bruno. Esa cuenta que comenta «abrígate» en todo... | YOLI: Menos esa cuenta que comenta «abrígate» en todo... |
| YOLI: Se ha leído tu opa entera. Cuarenta y siete minutos. La portada dura nueve. | igual |
| BRUNO: ¿Cuántos lectores? | BRUNO: ¿Cuántos, de un millón? |
| YOLI: Una. Pero se lo lee TODO. La he puesto de objetivo de empresa. | igual |
| YOLI: Y desde esta noche, otro. Comenta «gracias por sacarme». En mayúsculas. | igual |

`{Tus mejillones}` sale de la columna «Epílogo» del asunto `discover_ganador` (§3bis.3). Por defecto son los mejillones.
Si el jugador batió el récord, es el suyo («Tu Euríbor», «Tus persianas»…). Si no hay `discover_ganador` (el extra XE3
sin vuelta a la Redacción), la línea es «Bruno. Tu opa en Discover: un millón cien mil. Nadie pasó del titular.»
(medidas: de 61 a 70 caracteres).

### S7 · Contrapunto de papel 1: COINCIDO (opcional) — `catacumba.js`, `A_MENU`, antes de «Nada, Aurora. Gracias.»
```js
{ text: 'Yoli quiere sacar mi opa con «los expertos coinciden».', once: true, if: ['pieza_escrita', 'fax_con_papel'],
  do: async (api) => {
    await aurora(api, '¿Coinciden en qué? «Coincidir» pide complemento.');
    await imprime(api, 1);                                     // (el fax se pone a escribir solo)
    await fax(api, `${api.hora()}. Respuesta a Aurora: coincido.`);
    await api.wait(900);                                       // (Aurora se quita las gafas)
    await aurora(api, '...¿En qué?');
    await fax(api, 'En que pide complemento.');
  } },
```
(Rima con la hoja atrasada que ya existe, «18:01. Respuesta a Aurora: ya lo sé.»)

### S8 · Contrapunto de papel 2: el pósit vuelve al original (opcional) — `catacumba.js`
Requisito: `opa_posit === 1` (lo pone el titulador al salir, §3bis.6) y Bruno lleva la `pieza_opa`. Va en una función
`corregirPosit(api)`. Se llama al principio de `hablarAurora` (después de `quitarAdhesivo` y antes del rumor) y al
principio de `'dar:pieza_opa'` de Aurora. Mismo patrón que `quitarAdhesivo`:
```js
await aurora(api, O7);                                         // «Un pósit de la web en tu pieza…»
await aurora(api, O8);                                         // «Los dos puntos se inventaron…»
for (let i = 0; i < 4; i++) { api.sfx('click'); await api.anim(AUR, 'reach', 260); }   // cuatro tachones; escribe encima
await api.say(O9);                                             // «Cuatro tachones para volver a mi titular.»
await aurora(api, O10);                                        // «Cinco. El quinto es para ti, por traérmelo.»
api.setFlag('opa_posit', 2);
```
**Vuelta en la Redacción**: la siguiente vez que Bruno abre el titulador (por cualquier entrada) con `opa_posit === 2`,
Yoli dice O11 antes del plano, una sola vez (`api.once('pecera_yoli_posit')`).
Arte (P0, `items.js`, opcional): `iconKey` de `pieza_opa` añade `posit` (cuadradito `#FF78B8` en la esquina) con
`opa_posit === 1` y `posit_tachado` (el mismo cuadradito con dos rayas rojas) con `opa_posit === 2`.

### S9 · Yoli: árbol y murmullo (opcional)
En el árbol, dos opciones nuevas (§4.2). En los murmullos de Yoli de `pecera.js` (son los que mandan en la sala),
una línea más, O21.

---

## §3bis · EL TITULADOR (pieza central, opcional, invitado desde el camino principal)

### 3bis.1 · Qué es
Es el monitor de Yoli a pantalla grande. Arriba se ve una **tarjeta de Discover** con el titular que se está
componiendo. Encima de todo, un **contador enorme de USUARIOS CONCURRENTES** que, al publicar, sube o se desploma con
animación, y debajo una **gráfica** con las publicaciones de la sesión. El jugador compone con tres casillas, que son
**AUTORIDAD** (12 piezas), **ASUNTO** (14) y **GANCHO** (8): 1.344 titulares, todos gramaticales y comprobados con
script. Publica cinco veces por sesión (unos 60-90 s), puede salir cuando quiera, no puede perder y puede repetir. Se
guarda el récord.
**La regla que nadie explica:** cuanto menos dice el titular, más usuarios. La palabra «opa» lo hunde. El titular de
Bruno da 3. Decirlo todo («punto final») da casi nada. El máximo absoluto de la casa (576.000) es «Confirmado: el
Euríbor sube, baja o se queda igual»: una noticia económica que no dice nada.

### 3bis.2 · Entradas, flujo y controles
- **Disponible con `pieza_escrita`** (siempre hay `cms_vivo`). Hay tres entradas que llaman a `titulador(api)`:
  1. **Dar `pieza_opa` a Yoli.** La 1.ª vez (`api.once('pecera_yoli_valiente')`), antes del plano, va la línea de hoy
     «¿Sin número en el titular? ¿Sin "lo que nadie te cuenta"? Valiente.».
  2. **Opción del árbol** «¿Me dejas tu titulador?» (`if: 'pieza_escrita'`, repetible: tiene `if`, cumple §7.6).
     Después del titulador, `return 'Y0'`.
  3. **Usar `monitor_yoli`** con `pieza_escrita`. Sin `pieza_escrita` se queda la línea de hoy («¡Quieto!…»).
  La invitación en el camino principal es M6 (paso 34), y antes la siembra M3 (paso 23).
- **Fichero nuevo `content/rooms/pecera.titulador.js`** (lógica y dibujo) y **`content/rooms/pecera.titulador.datos.js`**
  (solo las tablas de §3bis.3 y §3bis.5: lo que pulirá la mesa de guionistas).
- **Bucle** (con el plano abierto; menús con `api.choose`, que ya funcionan con ratón, táctil, Esc y scroll):
```js
export async function titulador(api, { demo } = {}) {
  const st = nuevoEstado();                         // combo = ['hidro','robledal','punto'], u = 3, serie = [3], pubs = 0
  await api.detalle({ titulo: 'TITULADOR · DISCOVER', x: 4, y: 4, w: 312, h: 104, color: '#FF78B8', oscurecer: 0.6,
                      draw: (g, r, t) => drawTitulador(g, r, t, st) }, async (api) => {
    if (demo) { await jugarDemo(api, st, demo); return; }
    while (st.pubs < 5 && api.game.detalle) {
      const i = await api.choose([`Autoridad: ${pieza(0, st).menu}`, `Asunto: ${pieza(1, st).menu}`,
        `Gancho: ${pieza(2, st).menu}`, '¡Publicar!', 'Dejarlo'], { escape: 4 });
      if (i < 0 || i === 4) break;
      if (i < 3) {
        const L = TABLAS[i];
        const j = await api.choose([...L.map(p => (p.id === st.combo[i] ? '› ' : '') + p.menu), 'Volver'], { escape: L.length });
        if (j >= 0 && j < L.length) { st.combo[i] = L[j].id; api.sfx('click'); }
        continue;
      }
      await publicar(api, st);
    }
    if (st.pubs >= 5) await api.wait(1200);
  });
  await alSalir(api, st);                           // récord, historial y pósit (3bis.6)
}
```
  La tarjeta se actualiza en cuanto cambia una casilla. El contador solo cambia al **publicar**. Si un clic fuera del
  menú cerrara el plano, `api.game.detalle` queda a `null` y el bucle sale como con «Dejarlo». Hay que comprobarlo en la
  prueba (§7).
- **`publicar(api, st)`**:
  1. `u = usuarios(...)`, `cat = categoria(st, u)` (3bis.4) y `st.anim = { de: st.u, a: u, t0: null }` (el dibujo fija
     `t0` en su primer fotograma).
  2. `api.sfx(u > st.u ? PLIN : 'bad')` y `await api.wait(1400)` (lo que dura la animación).
  3. `st.u = u`, `st.serie.push(u)`, `st.pubs++`, `st.etiqueta = cat.etiqueta`. Al historial (local `pecera_disc_hist`,
     las 4 últimas, `[a, s, g, u]`).
  4. Si `u > récord`: `st.recordFlash = true` y se guarda (`pecera_disc_record`, `pecera_disc_record_k`).
  5. Reacción de Yoli (`voz()` de §3bis.4): si la categoría (o el secreto) tiene línea y no se ha dicho en la partida
     (local `pecera_disc_dichas`, una lista de ids), `await api.sayAs(Y, linea)` y se apunta. Si solo tiene etiqueta,
     o su línea ya se dijo, prueba C7 o C8 según suba o baje. Si tampoco queda esa, la reacción es muda:
     `api.anim(Y, 'reach', 300)`.
  6. **La Redacción reacciona sin texto** con `u >= 200.000`: `api.shake(150, 1)`, tres `PLIN` seguidos y
     `api.anim(Y, 'reach', 400)`. Con `u <= 40`: `api.sfx('bad')` y nada más.
- **Modo rápido** (`api.game.instant`): sin esperas ni animación. Las pruebas usan los textos del menú.

### 3bis.3 · Fórmula exacta y tablas de piezas (en `pecera.titulador.datos.js`)
> Juego de piezas definitivo de la segunda vuelta de la mesa (juez: `scratchpad/audiencias/titulador/VEREDICTO.md`). La
> fuente de verdad es `scratchpad/audiencias/titulador/piezas.json` (lo genera `titulador/v2/construir.py`) y el código
> de referencia es `titulador/gen.mjs` (`titular`, `usuarios`, `categoria`, `voz`), que se copia tal cual. `node gen.mjs
> --todas` comprueba las 1.344 combinaciones: 0 pasan de 3 líneas a 190 px (`wrap` del motor), y no hay marcas sin
> rellenar, contracciones sin hacer, concordancias rotas ni topes del auditor (más «abuel», «abrig», «director»,
> «Consejo», «Diseño» e «Infograf»). Mediana de 63 caracteres, el 95 % con ≤ 80 y el más largo con 96. El menú más largo
> tiene 25.

**Criterio del dueño (manda sobre todo lo demás):** cada plantilla es un **titular de Discover real y reconocible,
calcado, con un solo hueco**. El término económico entra en el sitio del objeto habitual y se dice con total seriedad,
sin chiste añadido. Por eso las autoridades son secciones de Discover (psicología, pareja, cocina, nutrición, hogar,
pueblos, el tiempo, Tráfico…) y no personajes. Los moldes de economía de verdad no sirven: con un asunto económico se
quedan en noticia real. Fuera: fuentes entre paréntesis, «tu madre», horóscopo, grupo de la familia, carta de lectora y
escenas con parientes.

**Usuarios** = `B(asunto) × k(autoridad) × k(gancho) × afinidades × 0,05 si el titular contiene la palabra «opa»`.
Después se redondea: si es < 100, entero con **mínimo 3** («Uno era yo, comprobando»); si es < 10.000, a la decena;
si no, a la centena. En pantalla, con punto de miles (`miles()` de `lib/kit.js`).

**Montaje del titular** (clave `a|s|g`):
1. Si la clave está en ESPECIALES, ese texto.
2. Si no, la plantilla `autoridad.t[gancho]`.
3. Las marcas se rellenan con el asunto: `{S}` el asunto con artículo · `{C}` forma corta · `{P}` lo/la/los/las · `{E}`
   o/a/os/as · `{N}` '' o 'n' (verbo en plural) · `{s}` '' o 's' (adjetivo en plural).
4. «a el» → «al», «de el» → «del» y mayúscula inicial.

**AUTORIDAD** (12). Cada una es una sección real de Discover y escribe cada gancho con un molde real de esa sección.

| id | Menú | k | Sección (de dónde sale el molde) |
|---|---|---|---|
| hidro | Hidrovoltia lanza una opa | 0,02 | la noticia de verdad: dice algo y hunde |
| expertos | Los expertos coinciden | 2 | esta tarde hay que bajarlo todo |
| psicologia | Según la psicología | 1,7 | todo dice algo de ti |
| pareja | Amor y pareja | 1,8 | todo es una relación |
| cocineros | Los cocineros coinciden | 1,8 | todo se cocina |
| confirmado | Confirmado | 1,2 | todo se confirma |
| pueblo | El pueblo de España | 1,5 | allí todo es como antes |
| analistas | Los analistas recomiendan | 0,7 | todo es inversión |
| nutricionista | Una nutricionista avisa | 1,5 | todo se come |
| hogar | Ni lejía ni vinagre | 1,5 | todo se limpia |
| meteorologos | Los meteorólogos avisan | 1,9 | el parte del tiempo |
| trafico | Tráfico avisa | 1,6 | todo se multa |

**Plantillas por autoridad × gancho** (96, literales; cada una, un molde con UN hueco `{S}`):

**hidro** · «Hidrovoltia lanza una opa»

| gancho | plantilla |
|---|---|
| corte | Opa de Hidrovoltia: qué pasa con {S} si no... |
| obvio | Hidrovoltia lanza una opa sobre {S}: esto es lo que debes saber |
| punto | Hidrovoltia lanza una opa sobre {S}. |
| senales | Si tienes {S}, esto es lo que te ofrece Hidrovoltia en su opa |
| probe | Tengo {S} y Hidrovoltia lanza una opa: qué hago |
| prisa | Opa de Hidrovoltia sobre {S}: tienes hasta el viernes para vender |
| curioso | Qué es una opa y por qué Hidrovoltia quiere {S} |
| truco | Cómo saber si la opa de Hidrovoltia sobre {S} te afecta |

**expertos** · «Los expertos coinciden»

| gancho | plantilla |
|---|---|
| corte | Los expertos avisan: nunca metas {S} en el lavavajillas porque... |
| obvio | Los expertos coinciden: esta tarde hay que cerrar las puertas y bajar {S} |
| punto | Los expertos recomiendan ventilar {S} diez minutos al día. |
| senales | Las 5 señales de que {S} tiene{N} humedad, según los expertos |
| probe | Purgué {S} como dicen los expertos y esto es lo que pasó |
| prisa | Los expertos piden purgar {S} antes de encender la calefacción |
| curioso | Por qué los expertos recomiendan dormir con {S} abiert{E} |
| truco | El truco de los expertos para secar {S} sin secadora |

**psicologia** · «Según la psicología»

| gancho | plantilla |
|---|---|
| corte | Qué significa soñar con {S}, según la psicología: es señal de... |
| obvio | Si piensas en {S} antes de dormir, esto es lo que significa |
| punto | La psicología lo confirma: tu relación con {S} es dependencia emocional. |
| senales | Las 7 señales de que tu relación con {S} es tóxica |
| probe | Le conté a mi psicóloga lo de {S} y se quedó callada |
| prisa | Según la psicología, si {S} te escribe{N} pasadas las ocho, no es amor |
| curioso | Las personas que hablan con {S} tienen esto en común, según la psicología |
| truco | La técnica japonesa para dejar de pensar en {S} |

**pareja** · «Amor y pareja»

| gancho | plantilla |
|---|---|
| corte | {S} te ha{N} dejado: los 5 pasos para... |
| obvio | Si {S} hace{N} esto, no te quiere{N} |
| punto | Los españoles piensan en {S} una media de 14 veces al día. |
| senales | Cómo saber si {S} te quiere{N}: 5 señales |
| probe | Dejé a {S} hace un año y esto es lo que aprendí |
| prisa | La regla de los tres días: cuánto esperar para escribir a {S} |
| curioso | Por qué {S} te deja{N} en visto, según la ciencia |
| truco | Cómo olvidar a {S} en 21 días |

**cocineros** · «Los cocineros coinciden»

| gancho | plantilla |
|---|---|
| corte | Los cocineros coinciden: {S} está{N} mejor si {P} preparas con... |
| obvio | Los cocineros coinciden: {S} se hace{N} mejor a fuego lento |
| punto | Los cocineros coinciden: {S} se sala{N} al final. |
| senales | Las 5 señales de que {S} se ha{N} puesto mal{E} |
| probe | Los cocineros coinciden: {S} nunca se lava{N} antes de cocinar{P} |
| prisa | Los cocineros coinciden: descongela {S} la noche antes |
| curioso | Los cocineros nunca piden {S} en un restaurante: este es el motivo |
| truco | El truco de los cocineros para que {S} quede{N} jugos{E} |

**confirmado** · «Confirmado»

| gancho | plantilla |
|---|---|
| corte | Confirmado: {S} se puede{N} meter en el microondas si... |
| obvio | Confirmado: {S} sube{N}, baja{N} o se queda{N} igual |
| punto | Confirmado: {S} caduca{N} el 14 de marzo. |
| senales | Confirmado: {S} encoge{N} si {P} lavas con agua caliente |
| probe | Confirmado: {S} va{N} al contenedor amarillo |
| prisa | Confirmado: {S} se tiende{N} antes de las ocho o pierde{N} valor |
| curioso | Confirmado: {S} no se puede{N} congelar |
| truco | Confirmado: {S} se lava{N} a 30 grados |

**pueblo** · «El pueblo de España»

| gancho | plantilla |
|---|---|
| corte | El pueblo de España donde {S} se hereda{N} de padres a... |
| obvio | El pueblo de España donde {S} se sigue{N} haciendo a mano |
| punto | El pueblo de España que vive sin {S} desde la Edad Media. |
| senales | Los 5 pueblos de España donde todavía no ha{N} llegado {S} |
| probe | Dejé la ciudad por un pueblo sin {S} y esto es lo que pasó |
| prisa | El pueblo de España que regala {S} si te empadronas antes de diciembre |
| curioso | El pueblo de España que todavía paga {S} en pesetas |
| truco | El pueblo de España donde la gente vive cien años gracias a {S} |

**analistas** · «Los analistas recomiendan»

| gancho | plantilla |
|---|---|
| corte | Los analistas recomiendan sacar {S} del horno antes de que... |
| obvio | Los analistas recomiendan guardar {S} en un lugar fresco y seco |
| punto | Los analistas fijan el precio objetivo de {S} en 4,10 euros el kilo. |
| senales | Las 3 señales de que {S} está{N} madur{E}, según los analistas |
| probe | Llevo un año comprando {S} a granel y esto es lo que he ahorrado |
| prisa | Los analistas recomiendan recoger {S} antes de que llueva |
| curioso | Por qué los analistas guardan {S} en la nevera |
| truco | Los analistas recomiendan comprar {S} y dejar{P} en remojo |

**nutricionista** · «Una nutricionista avisa»

| gancho | plantilla |
|---|---|
| corte | Una nutricionista avisa: {S} tiene{N} más azúcar que... |
| obvio | Qué le pasa a tu cuerpo si comes {S} todos los días |
| punto | Una nutricionista desaconseja comer {S}. |
| senales | Las 5 señales de que tu cuerpo necesita {S} |
| probe | Comí {S} todos los días durante un mes y esto pasó |
| prisa | El mejor momento del día para tomar {S}, según una nutricionista |
| curioso | Una nutricionista avisa: nunca cenes {S} |
| truco | Una nutricionista revela cómo comer {S} sin engordar |

**hogar** · «Ni lejía ni vinagre»

| gancho | plantilla |
|---|---|
| corte | Ni lejía ni vinagre: el truco para limpiar {S} es... |
| obvio | Ni lejía ni vinagre: así se limpia{N} {S} |
| punto | Ni lejía ni vinagre: {S} se blanquea{N} con bicarbonato. |
| senales | Las 5 señales de que hay que tirar {S} |
| probe | Metí {S} en el congelador y esto es lo que pasó |
| prisa | Cada cuánto hay que lavar {S}, según los expertos |
| curioso | El error que todos cometemos al tender {S} |
| truco | El truco de la bola de papel de aluminio para {S} |

**meteorologos** · «Los meteorólogos avisan»

| gancho | plantilla |
|---|---|
| corte | Los meteorólogos ponen fecha a la llegada de {S}: será el... |
| obvio | Los meteorólogos avisan: {S} entra{N} por Galicia este fin de semana |
| punto | {S} dejará{N} hasta 40 litros por metro cuadrado. |
| senales | {S} llega{N} con fuerza: estas son las zonas afectadas |
| probe | Las imágenes de {S} a su paso por Cuenca |
| prisa | Alerta naranja por {S} en media España |
| curioso | Llega el veranillo de {S}: hasta cuándo durará |
| truco | Adiós a {S}: los meteorólogos confirman el cambio a partir del jueves |

**trafico** · «Tráfico avisa»

| gancho | plantilla |
|---|---|
| corte | Los radares de Tráfico ya detectan {S} y la multa es de... |
| obvio | Tráfico aclara si {S} puede{N} viajar en la baca del coche |
| punto | Tráfico confirma: {S} puede{N} ir en el asiento de delante. |
| senales | Tráfico avisa: si ves {S} en la carretera, reduce la velocidad |
| probe | Me multaron por llevar {S} sin cinturón: así lo recurrí |
| prisa | Tráfico avisa: a partir de enero, {S} tendrá{N} que pasar la ITV |
| curioso | La pegatina de {S} que Tráfico te exigirá en el parabrisas |
| truco | Cómo saber si Tráfico te ha multado por {S}: el truco |

**ASUNTO** (14: 2 de casa y 12 de economía, la doméstica incluida).

| id | Menú = {S} | {C} | {P} {E} {N} {s} | dominio | B | Epílogo |
|---|---|---|---|---|---|---|
| persianas | las persianas | las persianas | las · as · n · s | casa | 40.000 | Tus persianas |
| mejillones | los mejillones de lata | los mejillones | los · os · n · s | casa | 36.000 | Tus mejillones |
| hacienda | Hacienda | Hacienda | la · a · — · — | eco | 10.000 | Tu Hacienda |
| hipoteca | la hipoteca | la hipoteca | la · a · — · — | eco | 9.000 | Tu hipoteca |
| nomina | la nómina | la nómina | la · a · — · — | eco | 8.500 | Tu nómina |
| euribor | el Euríbor | el Euríbor | lo · o · — · — | eco | 8.000 | Tu Euríbor |
| plazofijo | el plazo fijo | el plazo fijo | lo · o · — · — | eco | 3.000 | Tu plazo fijo |
| robledal | Banco Robledal | Banco Robledal | lo · o · — · — | eco | 2.000 | Tu Robledal |
| prima | la prima de riesgo | la prima | la · a · — · — | eco | 1.200 | Tu prima de riesgo |
| deuda | la deuda pública | la deuda | la · a · — · — | eco | 700 | Tu deuda pública |
| pib | el PIB | el PIB | lo · o · — · — | eco | 500 | Tu PIB |
| ipc | el IPC | el IPC | lo · o · — · — | eco | 400 | Tu IPC |
| ibex | el Ibex 35 | el Ibex | lo · o · — · — | eco | 60 | Tu Ibex |
| opa | la opa de Hidrovoltia | la opa | la · a · — · — | eco | 600 (× 0,05 por la palabra) | — (no puede ganar) |

**GANCHO** (8)

| id | Menú | k | Molde |
|---|---|---|---|
| corte | «...» (cortar) | 2,5 | el gancho cortado del molde |
| obvio | lo que ya sabías | 3 | el molde que no dice nada |
| punto | decirlo todo | 0,05 | el dato (hunde) |
| senales | las señales | 2,2 | lista o test: «las 5 señales», «cómo saber si» |
| probe | lo probé yo | 2 | testimonio: «esto es lo que pasó» |
| prisa | antes de que sea tarde | 1,6 | plazo u hora |
| curioso | lo que no sabías | 1,8 | curiosidad: «este es el motivo», «tienen esto en común» |
| truco | el truco | 1,7 | el truco o la técnica |

**AFINIDADES** (se multiplican): cocineros + mejillones ×1,5 · expertos + persianas ×1,3 · confirmado + euribor + obvio ×20 · psicologia + euribor ×1,3 · nutricionista + mejillones ×1,3.

**ESPECIALES** (texto propio):
- `hogar|persianas|prisa` → «Cada cuánto hay que lavar las persianas, según los analistas»
- `confirmado|mejillones|probe` → «Confirmado: los mejillones de lata cotizan en el contenedor amarillo»
- `nutricionista|mejillones|truco` → «Los mejillones de lata, el nuevo valor refugio, según una nutricionista»
- `nutricionista|mejillones|corte` → «Una nutricionista avisa: los mejillones de lata cotizan más que...»
- `nutricionista|mejillones|obvio` → «Qué le pasa a tu hipoteca si comes mejillones de lata todos los días»
- `cocineros|mejillones|senales` → «Las 5 señales de que los mejillones de lata van a subir, según los cocineros»
- `hogar|persianas|curioso` → «El error que todos cometemos al declarar las persianas»
- `hogar|persianas|obvio` → «Ni lejía ni vinagre: así se amortizan las persianas»
- `hogar|persianas|senales` → «Las 5 señales de que hay que refinanciar las persianas»
- `hogar|mejillones|obvio` → «Ni lejía ni vinagre: así se amortizan los mejillones de lata»
- `hogar|mejillones|senales` → «Las 5 señales de que hay que refinanciar los mejillones de lata»
- `cocineros|mejillones|punto` → «Los cocineros coinciden: los mejillones de lata no se cocinan.»
- `cocineros|mejillones|obvio` → «Los cocineros coinciden: los mejillones de lata se hacen mejor en la lata»
- `nutricionista|mejillones|punto` → «Una nutricionista desaconseja comer los mejillones de lata con la lata.»
- `hogar|persianas|punto` → «Ni lejía ni vinagre: las persianas se limpian bajándolas.»
- `hogar|mejillones|punto` → «Ni lejía ni vinagre: los mejillones de lata se limpian con su propio caldo.»
- `expertos|persianas|corte` → «Los expertos coinciden: esta tarde hay que cerrar las puertas y bajar las...»
- `hidro|opa|punto` → «Hidrovoltia lanza una opa sobre su propia opa.»

**Muletillas medidas en las 1.344** (tope: un 15 %): corte 12,5 % · «expertos» 9,4 % · «señal(es)» 8,3 % · «esto es lo
que / esto pasó» 8,3 % · «Hacienda» 7,1 % (es un asunto) · «el truco» 5,2 % · «psicolog» 4,2 % · «las ocho» 2,1 % · «en el
cajón», «tu madre», «tu banco» y «(fuente:» 0 %. **Lo sentimental** (Según la psicología y Amor y pareja) es el 16,7 % de
las combinaciones. Sale al menos una vez en el 60 % de las partidas de cinco, y el gancho «las señales» (test de revista)
aparece en todas las autoridades. **Hidrovoltia** solo hace su papel: todas sus plantillas dicen «opa», así que todas
dicen algo y se hunden.

**Hitos de la escala** (calculados): titular de Bruno `hidro·robledal·punto` = **3** · lo máximo con «opa» = 180 · demo
del paso 34 `meteorologos·robledal·corte` = **9.500** · mejillones del dueño = **243.000** (el ganador por defecto) ·
persianas del dueño = 312.000 · «Le conté a mi psicóloga lo del Euríbor…» = 35.400 · **RÉCORD = 576.000** («Confirmado:
el Euríbor sube, baja o se queda igual»). Reparto de las 1.344: 92 por debajo de 10 usuarios, 128 entre 10 y 99, 202
entre 100 y 999, 424 entre 1.000 y 9.999, 378 entre 10.000 y 99.999, y 120 de 100.000 en adelante.

**Las nueve frases del dueño salen literales:** persianas y prima de riesgo (`expertos·…·obvio`), mejillones
(`cocineros·mejillones·corte`), «Le conté a mi psicóloga lo del Euríbor y se quedó callada» (`psicologia·euribor·probe`),
«…si la prima de riesgo te escribe pasadas las ocho, no es amor» (`psicologia·prima·prisa`), «Las 7 señales de que tu
relación con el Euríbor es tóxica» (`psicologia·euribor·senales`), «Confirmado: el Ibex 35 se tiende antes de las ocho o
pierde valor» (`confirmado·ibex·prisa`), «El pueblo de España que todavía paga el Euríbor en pesetas»
(`pueblo·euribor·curioso`) y «Los analistas recomiendan comprar la prima de riesgo y dejarla en remojo»
(`analistas·prima·truco`). Todas son secreto.

**Comprobación** (Anexo A): cata a ciegas de 180 (V1, V2 y el juego anterior) y diez tiradas de 100 con semilla nueva. La
última, con las piezas en su versión final (semilla 81953), dio **65 % de treses y 2 % de unos**.

### 3bis.4 · Resultado: etiqueta en pantalla (solo se ve) y reacción de Yoli (se dice una vez por partida)
La categoría se elige por este orden y vale la primera que se cumpla. La **etiqueta** siempre se ve y no cuenta como
línea. **Yoli** dice la línea de la categoría si la tiene y no la ha dicho aún en la partida. Si la categoría solo
tiene etiqueta, o su línea ya se dijo, dice C7 (si el contador ha subido) o C8 (si ha bajado), siempre que no la haya
dicho. Si no queda ninguna, la reacción es muda (`api.anim(Y, 'reach', 300)`). En total son **14 líneas habladas**
(7 de categoría y 7 de secreto) y se apuntan en `pecera_disc_dichas`. La borrasca ya no es asunto, así que C4 sale y
se queda solo en la trama (M2). Código: `categoria()` y `voz()` de `titulador/gen.mjs`.

| # | Categoría | Condición | Etiqueta (pantalla) | Yoli |
|---|---|---|---|---|
| 1 | secreto | la combinación está en secretos | (la del secreto) | (la del secreto) |
| 2 | honesto | hidro|robledal|punto | TITULAR DE PAPEL | C1 «Tres otra vez. Ya nos conocemos los tres.» |
| 3 | opa | el titular contiene la palabra «opa» | SOLO LOS DE HIDROVOLTIA | C2 «Han entrado los de Hidrovoltia. A mirarse.» |
| 4 | dato | gancho punto | DICHO. NADIE ENTRA | C3 «Lo has contado todo. Ya no hace falta entrar.» |
| 5 | pico | u >= 200.000 | PICO DE LA NOCHE | C6 «No dice nada y lo lee media España. Me tiembla el párpado.» |
| 6 | corazon | autoridad psicologia o pareja y asunto de economía | ECONOMÍA, SECCIÓN CORAZÓN | (solo etiqueta) |
| 7 | economia | asunto de economía y u < 20.000 | SECCIÓN DE ECONOMÍA | C5 «Economía. Lo leen los de Bolsa. Los dos.» |
| 8 | corte | gancho corte | LOS PUNTOS TRABAJAN | (solo etiqueta) |
| 9 | obvio | gancho obvio | VERDAD COMO UN TEMPLO | (solo etiqueta) |
| 10 | senales | gancho senales | SEÑALES INEQUÍVOCAS | (solo etiqueta) |
| 11 | probe | gancho probe | LE PASÓ A ALGUIEN | (solo etiqueta) |
| 12 | prisa | gancho prisa | ANTES DE LAS OCHO (SON LAS 20:59) | (solo etiqueta) |
| 13 | curioso | gancho curioso | NADIE LO SABÍA | (solo etiqueta) |
| 14 | truco | gancho truco | TRUCO DE TODA LA VIDA | (solo etiqueta) |
| 15 | sube | u > anterior | SUBE | C7 «Sube. No sé qué has quitado, pero quítalo más.» |
| 16 | baja | u < anterior | SE DESPLOMA | C8 «Baja. Has dicho algo, ¿verdad?» |
| 17 | igual | u = anterior | NI SUBE NI BAJA | (solo etiqueta) |

**SECRETOS** (11: 7 con línea y 4 que solo tienen etiqueta) · combinación (usuarios) · titular → etiqueta · Yoli
- `expertos|persianas|obvio` (312.000) «Los expertos coinciden: esta tarde hay que cerrar las puertas y bajar las persianas» → CLÁSICO DE LAS SIETE · X1 «El de todas las tardes. Lo saco a las siete. Nunca falla.»
- `cocineros|mejillones|corte` (243.000) «Los cocineros coinciden: los mejillones de lata están mejor si los preparas con...» → CON... (NADIE SABE QUÉ) · X2 «¿Con qué? No lo sabe nadie. Por eso lo leen.»
- `cocineros|opa|corte` (140) «Los cocineros coinciden: la opa de Hidrovoltia está mejor si la preparas con...» → COCINA DE ALTAS FINANZAS · X4 «Ciento cuarenta cocineros. Ninguno sabe qué es una opa.»
- `confirmado|euribor|obvio` (576.000) «Confirmado: el Euríbor sube, baja o se queda igual» → RÉCORD DE LA CASA · X5 «Sube, baja o se queda igual. Lo he medido: es verdad.»
- `psicologia|euribor|probe` (35.400) «Le conté a mi psicóloga lo del Euríbor y se quedó callada» → SE QUEDÓ CALLADA · X7 «Callada. Cobra sesenta euros la hora y se ha quedado callada.»
- `psicologia|prima|prisa` (3.260) «Según la psicología, si la prima de riesgo te escribe pasadas las ocho, no es amor» → NO ES AMOR · X8 «Pasadas las ocho. Aquí siempre son las 20:59. Estamos a salvo.»
- `pueblo|euribor|curioso` (21.600) «El pueblo de España que todavía paga el Euríbor en pesetas» → EN PESETAS · X9 «En pesetas. No sabe nadie cuánto es, y por eso entran.»
- `psicologia|euribor|senales` (38.900) «Las 7 señales de que tu relación con el Euríbor es tóxica» → RELACIÓN TÓXICA (A TIPO VARIABLE) · (solo etiqueta)
- `confirmado|ibex|prisa` (120) «Confirmado: el Ibex 35 se tiende antes de las ocho o pierde valor» → TENDIDO ANTES DE LAS OCHO · (solo etiqueta)
- `expertos|prima|obvio` (7.200) «Los expertos coinciden: esta tarde hay que cerrar las puertas y bajar la prima de riesgo» → PUERTAS CERRADAS, PRIMA BAJADA · (solo etiqueta)
- `analistas|prima|truco` (1.430) «Los analistas recomiendan comprar la prima de riesgo y dejarla en remojo» → EN REMOJO DESDE ANOCHE · (solo etiqueta)

### 3bis.5 · Dibujo (`drawTitulador(g, r, t, st)`; ventana de 312 × 104)
- Fondo `PAL.blue[0]`. **Tarjeta Discover** en (x+6, y+5, 220, 46): papel `#f4efe2`, miniatura de 24 × 24 a la
  izquierda y el titular con `drawText`/`wrap` a 190 px, como mucho 3 líneas (medido con las 1.344: caben). Debajo,
  en `micro`: «elContable.es · hace 1 min».
  - La miniatura es un icono por asunto de 24 px, hecho con `rect`: lamas (persianas), lata (mejillones), casita con
    «%» (hipoteca), sobre (nómina), «%» (Euríbor), hucha (plazo fijo), sello rojo (Hacienda), columnas (banco), «%» con
    flecha arriba (prima), pagaré (deuda pública), barras (PIB), cesta (IPC), flecha plana (Ibex), maletín (opa).
- **Contador** en la columna derecha (x+232 … x+306): `micro` «USUARIOS CONCURRENTES». Debajo, el número a escala 2
  si mide ≤ 70 px y en negrita a escala 1 si no. Durante la animación interpola `de → a` en 1.400 ms con
  `easeOutCubic`. Si sube, va en verde (`#7aff7a`) y los dígitos «ruedan». Si baja, va en rojo, cae de golpe y el
  número tiembla 1 px durante 300 ms. Debajo, la etiqueta de la categoría en rosa y «RÉCORD: n». Con
  `recordFlash`, un marco dorado parpadea 2 s alrededor del número.
- **Gráfica** (x+6, y+56, 300, 34): eje Y logarítmico, con altura `log10(u + 1) / log10(600.000)` y una línea
  punteada de «100.000». Hay un punto por publicación (verde si sube, rojo si baja) y el tramo nuevo se dibuja con
  la animación. Con u ≤ 40 el tramo cae hasta el suelo con un pequeño rebote.
- **Pie** (y+94): cinco puntos `●●●○○` (publicaciones) a la derecha. A la izquierda, en `micro`: «Elige. Publica.
  Discover decide.» (instrucciones; solo se ven).

### 3bis.6 · Al salir (`alSalir`)
- Suma `pecera_disc_partidas`.
- **Pósit**: si Bruno lleva la `pieza_opa`, el récord es > 3 y `opa_posit === 0`, `api.anim(Y, 'reach', 500)`,
  `sfx('paper')`, Yoli dice O6 y se pone `opa_posit = 1`. El texto del pósit es el titular del récord. Solo puede
  pasar entre los pasos 34 y 36, que es cuando Bruno tiene la pieza. Aurora está a una puerta (S8).
- Récord, historial y ganador: ver S5 y la hoja (S3).

### 3bis.7 · Flags
- **Globales (P0, `flags.js`; ADENDA_FLAGS con valor inicial)**:
  - `discover_ganador`: `str · P2 · pecera · paso 40, pecera_opa_ganadora (id del asunto ganador; '' sin escena) · P1 final.js, P2 hoja`;
  - `opa_posit`: `int · P2 pecera titulador (1) · P3 catacumba Aurora (2) · P2, P3, P0 items (icono)`.
- **Locales de `pecera`**: `pecera_top_n` (int), `pecera_disc_record` (int), `pecera_disc_record_k` (str `a|s|g`),
  `pecera_disc_hist` (lista), `pecera_disc_dichas` (lista), `pecera_disc_partidas` (int). Los `once`
  (`pecera_yoli_borrasca`, `pecera_opa_ab`, `pecera_yoli_valiente`, `pecera_yoli_posit`, `pecera_top_borrasca`,
  `pecera_top_ibex0`) no se declaran.
- **Ninguno** de los flags del recorrido cambia.

### 3bis.8 · Quince ejemplos (calculados con `titulador/gen.mjs`; el «anterior» es 3)
| Combinación | Usuarios | Titular | Etiqueta · Yoli |
|---|---|---|---|
| hidro·robledal·punto | 3 | Hidrovoltia lanza una opa sobre Banco Robledal. | TITULAR DE PAPEL · C1 |
| cocineros·opa·corte | 140 | Los cocineros coinciden: la opa de Hidrovoltia está mejor si la preparas con... | COCINA DE ALTAS FINANZAS · X4 |
| expertos·opa·obvio | 180 | Los expertos coinciden: esta tarde hay que cerrar las puertas y bajar la opa de Hidrovoltia | SOLO LOS DE HIDROVOLTIA · C2 |
| confirmado·ibex·prisa | 120 | Confirmado: el Ibex 35 se tiende antes de las ocho o pierde valor | TENDIDO ANTES DE LAS OCHO · C7 |
| analistas·prima·truco | 1.430 | Los analistas recomiendan comprar la prima de riesgo y dejarla en remojo | EN REMOJO DESDE ANOCHE · C7 |
| psicologia·prima·prisa | 3.260 | Según la psicología, si la prima de riesgo te escribe pasadas las ocho, no es amor | NO ES AMOR · X8 |
| meteorologos·robledal·corte | 9.500 | Los meteorólogos ponen fecha a la llegada de Banco Robledal: será el... | SECCIÓN DE ECONOMÍA · C5 |
| expertos·prima·obvio | 7.200 | Los expertos coinciden: esta tarde hay que cerrar las puertas y bajar la prima de riesgo | PUERTAS CERRADAS, PRIMA BAJADA · C7 |
| pueblo·euribor·curioso | 21.600 | El pueblo de España que todavía paga el Euríbor en pesetas | EN PESETAS · X9 |
| psicologia·euribor·probe | 35.400 | Le conté a mi psicóloga lo del Euríbor y se quedó callada | SE QUEDÓ CALLADA · X7 |
| psicologia·euribor·senales | 38.900 | Las 7 señales de que tu relación con el Euríbor es tóxica | RELACIÓN TÓXICA (A TIPO VARIABLE) · C7 |
| cocineros·mejillones·corte | 243.000 | Los cocineros coinciden: los mejillones de lata están mejor si los preparas con... | CON... (NADIE SABE QUÉ) · X2 |
| expertos·persianas·obvio | 312.000 | Los expertos coinciden: esta tarde hay que cerrar las puertas y bajar las persianas | CLÁSICO DE LAS SIETE · X1 |
| confirmado·euribor·obvio | 576.000 | Confirmado: el Euríbor sube, baja o se queda igual | RÉCORD DE LA CASA · X5 |
| nutricionista·hacienda·senales | 33.000 | Las 5 señales de que tu cuerpo necesita Hacienda | SEÑALES INEQUÍVOCAS · C7 |

---

## §4 · Todas las líneas

### 4.1 · Tabla (fichero · texto actual → texto nuevo)
**Camino principal**

| Id | Fichero | Texto actual | Texto nuevo |
|---|---|---|---|
| M1 | pecera.dialogos.js `yoli.onStart` (1.ª vez) | — | NUEVA · YOLI: Ponle nombre. Venga. Ponle nombre a la borrasca. |
| M2 | ídem (1.ª vez) | Perdona, me sale solo. | YOLI: Perdona. Sin nombre no la pincha nadie. La borrasca, digo. (las siguientes veces, la de hoy) |
| M3 | ídem `Y0` · Me voy. | Vuelve con un titular con número. El siete convierte. | YOLI: Y cuando escribas algo, avísame. Te lo coloco en Discover. Con expertos. («El siete convierte» se queda en el saludo sin CMS, `pecera.js`) |
| — | pecera.escenas.js `cmsEntrada` | — | ráfaga de 5 avisos (solo se ven) |
| M4 | pecera.escenas.js `pecera_opa_ab` | — | NUEVA · YOLI: No me has avisado. Te la he leído por encima del hombro. |
| M5 | ídem | — | NUEVA · YOLI: Tu titular: tres. Uno era yo, comprobando. |
| M6 | ídem | — | NUEVA · YOLI: Te dejo mi titulador. Cuando quieras, pruebas tú. |
| M7 | pecera.escenas.js `pecera_opa_ganadora` | — | NUEVA · YOLI: ¡Bruno! Ya hay ganador. A las 00:01 le meto tu opa dentro. |
| M8 | ídem | — | NUEVA · BRUNO: ¿Y dónde se ve la opa? |
| M9 | ídem | — | NUEVA · YOLI: En la dirección web. Donde no molesta. |
| E1-E3 | escenas/final.js | ver S6 | ver S6 |

**Opcional**

| Id | Fichero | Texto actual | Texto nuevo |
|---|---|---|---|
| O1 | pecera.js `lista_mas_leidas` mirar 1.ª | — | BRUNO: Lo más leído de la web. Impreso. Con chinchetas. |
| O2 | ídem 2.ª | — | YOLI: Esa ya está vieja. Te imprimo otra. |
| O3 | ídem Acto III, 1.ª | — | BRUNO: Por fin salgo el primero. Soy una borrasca. |
| O4 | ídem Acto III con ganador | — | BRUNO: El Ibex, a cero. El que lo escribe se ha ido a {los mejillones}. (`{…}` = asunto ganador, con «a el» → «al») |
| — | pecera.js Yoli `dar:pieza_opa` | ¿Sin número en el titular? ¿Sin "lo que nadie te cuenta"? Valiente. | se queda (1.ª vez) y abre el titulador |
| O5 | pecera.dialogos.js `Y0` | — | OPCIÓN · ¿Me dejas tu titulador? |
| C1-C3, C5-C8 | pecera.titulador.datos.js | — | las siete de §3bis.4 (las etiquetas solo se ven). C4 sale del titulador: la borrasca ya no es asunto y su línea se queda en la trama (M2) |
| X1, X2, X4, X5, X7, X8, X9 | ídem | — | las siete de §3bis.4 (X7, X8 y X9 son nuevas; X3 y X6 salen). Los otros cuatro secretos solo tienen etiqueta |
| O6 | pecera.titulador.js `alSalir` | — | YOLI: Te pego el mejor en un pósit. Por si cambias de idea en la escalera. |
| O7 | catacumba.js `corregirPosit` | — | AURORA: Un pósit de la web en tu pieza; lo leo dos veces y no me entero. |
| O8 | ídem | — | AURORA: Los dos puntos se inventaron para explicar, no para hacer esperar. |
| O9 | ídem | — | BRUNO: Cuatro tachones para volver a mi titular. |
| O10 | ídem | — | AURORA: Cinco. El quinto es para ti, por traérmelo. |
| O11 | pecera.titulador.js (vuelta) | — | YOLI: ¿Quién te ha tocado el pósit? Es letra de Aurora. Qué profesional. Qué miedo. |
| O12 | catacumba.js `A_MENU` | — | OPCIÓN · Yoli quiere sacar mi opa con «los expertos coinciden». |
| O13 | ídem | — | AURORA: ¿Coinciden en qué? «Coincidir» pide complemento. |
| O14 | ídem | — | TEODORO (fax): {hora}. RESPUESTA A AURORA: COINCIDO. |
| O15 | ídem | — | AURORA: ...¿En qué? |
| O16 | ídem | — | TEODORO (fax): EN QUE PIDE COMPLEMENTO. |
| O17 | pecera.dialogos.js `Y0` | — | OPCIÓN · ¿Tú te crees esos titulares? |
| O18 | ídem | — | YOLI: Bajo las persianas todas las tardes. Lo leí en un sitio fiable. |
| O19 | ídem | — | BRUNO: ¿Cuál? |
| O20 | ídem | — | YOLI: El nuestro. |
| O21 | pecera.js murmullos de Yoli | — | «Los expertos coinciden»... Ya buscaré expertos. Primero, que coincidan. |

### 4.2 · Árbol de Yoli resultante (`pecera.dialogos.js`)
```js
yoli: {
  actor: Y, start: 'Y0',
  onStart: /* S2 (§3) */,
  nodes: { Y0: { options: [
    { text: '¿Algún hilo bueno esta noche?', once: true, reply: [/* las tres de hoy */], do: async (api) => { api.learnReply('rep_08'); } },
    { text: '¿Y tú cómo estás? Tú, no la audiencia.', once: true, do: /* hoy */ },
    { text: '¿Cuántos me leen a mí?', once: true, reply: [/* las dos de hoy */] },
    { text: '¿Tú te crees esos titulares?', once: true,
      do: async (api) => talk(api, [[Y, 'Bajo las persianas todas las tardes. Lo leí en un sitio fiable.'], ['B', '¿Cuál?'], [Y, 'El nuestro.']]) },
    { text: '¿Me dejas tu titulador?', if: 'pieza_escrita', do: async (api) => { await titulador(api); return 'Y0'; } },
    { text: 'Íñigo va a cerrar el papel.', once: true, if: 'acto_3_iniciado', reply: 'Si cierra el papel, ¿quién me va a odiar con criterio?' },
    { text: 'Me voy.', exit: true, reply: 'Y cuando escribas algo, avísame. Te lo coloco en Discover. Con expertos.' },
  ] } },
},
```
Como mucho hay 7 opciones a la vista (en el Acto III, con nada gastado). El menú desplaza.
**Murmullos de Yoli** (`pecera.js`, actor `Y`; son los que mandan en la sala):
`['Esto sube. Esto baja. Esto soy yo.', 'Busco "el Contable" y salen gestorías. Nos ganan. Tienen horario.',
'«Los expertos coinciden»... Ya buscaré expertos. Primero, que coincidan.']`.

---

## §5 · Banco de 24 titulares fijos (solo se ven) y dónde va cada uno

Lista cerrada. Criterio del dueño: cada uno es un titular de Discover real y reconocible, calcado, con una sola sustitución
y dicho con toda seriedad. En la hoja, la impresora los corta a 34 caracteres más «...». En la ráfaga van en su versión
corta (medidas: ninguna pasa de 2 líneas en los 132 px del aviso). Ninguno dice «abrígate» ni nombra a la abuela, y todos
pasan los topes del auditor (`titulador/v2/fijos.mjs`). La hoja II, con `cafetera_viral`, sigue poniendo en la fila 3 «Un
joven da las buenas noches a una cafetera». La hoja III, con ganador, pone en la fila 5 el titular ganador.

| # | Titular | De | Molde real del que sale | Ubicación |
|---|---|---|---|---|
| F1 | Los expertos coinciden: esta tarde hay que cerrar las puertas y bajar las persianas | dueño | «Los expertos coinciden: …» (servicio) | ráfaga 1 («Los expertos coinciden: esta tarde hay que...») · hoja I y II, fila 1 · secreto X1 (versión corta: «Los expertos coinciden: esta tarde hay que...») |
| F2 | Atención si tienes una moneda de 2 euros con un árbol: vale 2 euros | G4 (rescate) | «La moneda de 2 euros con X que vale una fortuna» (monedas) | ráfaga 2 · hoja II, fila 2 (versión corta: «La moneda de 2 euros con un árbol: vale 2 euros») |
| F3 | Adiós a la freidora de aire: el electrodoméstico que arrasa es una freidora | G4 (rescate) | «Adiós a X: el electrodoméstico que la sustituye» (hogar) | ráfaga 3 (versión corta: «Adiós a la freidora de aire: llega una freidora») |
| F4 | Confirmado: el lunes vuelve a ser lunes | G4 (rescate) | «Confirmado: X vuelve en enero» (servicio) | ráfaga 4 |
| F5 | El Ibex cierra plano | guion | la noticia de verdad | ráfaga 5 · última fila de todas las hojas (214 · lecturas 3, 2, 1… 0) |
| F6 | El pueblo de España que todavía paga el Euríbor en pesetas | dueño (también combinación) | «El pueblo de España donde todavía se paga en pesetas» (pueblos) | hoja I, fila 2 |
| F7 | Los cocineros coinciden: los mejillones de lata están mejor si los preparas con... | dueño | «Los cocineros coinciden: X está mejor si lo preparas con…» (cocina) | hoja I, fila 3 · ganador por defecto (paso 40) · secreto X2 |
| F8 | Ni 19 ni 21 grados: la temperatura del salón para ahorrar sin pasar frío (20) | G4 (rescate) | «Ni X ni Y: la temperatura ideal para ahorrar» (ahorro) | hoja I, fila 4 |
| F9 | Qué significa que tu gato duerma sobre el extracto bancario, según la psicología | G4 | «Qué significa que tu gato duerma sobre ti, según la psicología» (mascotas) | hoja I, fila 5 |
| F10 | Cómo doblar la prima de riesgo: el método de los hoteles | G3 (rehecho) | «Cómo doblar una sábana bajera: el método de los hoteles» (hogar) | hoja I, fila 213 (encima del Ibex) |
| F11 | Un economista explica por qué nunca debes guardar el pan en la nevera | G3 (rescate) | «Un nutricionista explica por qué nunca debes guardar el pan en la nevera» (alimentación) | hoja II, fila 3 (sin cafetera viral) |
| F12 | Un hombre de 104 años revela su secreto: no ha mirado el Ibex ni una vez | G3 (rescate) | «Un hombre de 104 años revela su secreto: …» (longevidad) | hoja II, fila 4 |
| F13 | Me multaron por llevar la prima de riesgo sin cinturón: así lo recurrí | M1 (rescate; también combinación) | «Me multaron por…: así lo recurrí» (DGT) | hoja II, fila 5 |
| F14 | La borrasca ya tiene nombre: Bruno llega con fuerza y los expertos piden bajar las... | G3 | «La borrasca ya tiene nombre: X llega con fuerza» (tiempo) | hoja III, fila 1 (paga de la borrasca, con O3) |
| F15 | Los expertos avisan: el Euríbor subirá, bajará o se quedará igual | G3 | «Los expertos avisan: lo que pasará con X» (economía de casa) | hoja III, fila 2 |
| F16 | Qué es una opa y por qué no te afecta | G1 (rescate) | «Qué es X y por qué te afecta» (explicador) | hoja III, fila 3 |
| F17 | La moneda de 2 euros con el Euríbor que vale una fortuna | juez («Atención si tienes», que sale del titulador) | «La moneda de 2 euros con X que vale una fortuna» (monedas) | hoja III, fila 4 |
| F18 | Tráfico avisa: esta noche cortan la A-6 para que pase el Euríbor | M1/juez (Tráfico) | «Tráfico avisa: esta noche cortan la A-6» (DGT) | hoja III, fila 5 (sin ganador; con ganador, el ganador) |
| F19 | Si te despiertas a las 3:33, el Euríbor te está diciendo esto | G2 (rehecho) | «Si te despiertas a las 3:33, tu cuerpo te está diciendo esto» (bienestar) | reserva |
| F20 | Las personas que miran el Ibex antes de desayunar tienen esto en común | G1 (rehecho) | «Las personas que… tienen esto en común» (psicología) | reserva |
| F21 | Tráfico retira el carné al IPC por ir a 140 | juez (Tráfico) | «Tráfico retira el carné a un conductor por ir a 140» (DGT) | reserva |
| F22 | Si naciste entre 1950 y 2010, esto te interesa | G4 | «Si naciste entre 1960 y 1975, esto te interesa» (pensiones) | reserva |
| F23 | Los cocineros coinciden: la opa de Hidrovoltia, doce minutos a 180 grados | M3 (rescate) | «X, doce minutos a 180 grados» (cocina) | reserva |
| F24 | Le conté a mi psicóloga lo del Euríbor y se quedó callada | dueño (también combinación) | «Le conté a mi psicóloga lo de X y se quedó callada» (testimonio) | reserva (hoja III, fila 3, si el dueño la prefiere a F16) |

La fila del Ibex va en todas las hojas: «214 · El Ibex cierra plano · 3/2/1… 0» (F5). Las reservas sustituyen a una fila
si el dueño lo prefiere. Lo que se cae del banco anterior: el botón de la lavadora (B9), el notario (B14), las 3:33 y las
toallas tal cual (vuelven rehechos con una sustitución: F19 y F20), el cambio de hora a las 20:59 (B17), el fontanero
(B19), el desayuno perfecto (B24) y Siestatón (B25). Ninguno de esos tenía sustitución económica.

---

## §6 · Saldo de líneas

| Camino principal | Añade | Quita | Neto |
|---|---|---|---|
| Paso 23 · borrasca (M1; M2 sustituye) y despedida (M3 sustituye) | 1 | 0 | +1 |
| Paso 23 · ráfaga | 0 (solo se ve) | 0 | 0 |
| Paso 34 · `pecera_opa_ab` (M4-M6) | 3 | 0 | +3 |
| Paso 40 · `pecera_opa_ganadora` (M7-M9) | 3 | 0 | +3 |
| Epílogo (S6) | 1 | 0 (dos sustituidas) | +1 |
| **Total** | | | **+8** (tope 8) |

| Opcional | Neto |
|---|---|
| Hoja de lo más leído (O1-O4) | +4 |
| Titulador: opción O5 + 7 categorías + 7 secretos + pósit O6 | +16 |
| Pósit en papel: Aurora y Bruno (O7-O10) + vuelta de Yoli (O11) | +5 |
| COINCIDO (O12-O16) | +5 |
| «¿Tú te crees esos titulares?» (O17-O20) | +4 |
| Murmullo (O21) | +1 |
| **Total** | **+35** |

**Por qué +35 (por encima de 30, dentro del +36 autorizado):** el minijuego necesita sus reacciones para que el
resultado también sea chiste. Por eso se pagan 14 líneas de reacción, el tope que fijó el director para categorías y
secretos. Cada una se dice una sola vez por partida y
las repeticiones son mudas, así que en una sesión normal se oyen entre 4 y 6.
Lo que solo se ve no cuenta: 1.344 titulares, 27 etiquetas (16 de categoría y 11 de secreto), 3 hojas, 5 avisos y los
planos de los pasos 34 y 40. Si hay que bajar a 30, se cortan por este orden: X9, O21, O11, C8 y O2 (X9 se queda
como secreto con solo etiqueta).

---

## §7 · Pruebas que habrá que tocar

| Fichero | Qué | Cadena |
|---|---|---|
| `tools/test-comedia-p2.mjs` l. 263-266 | La despedida del árbol con CMS cambia | quitar «Vuelve con un titular con número. El siete convierte.» de la lista de `musts` de «Yoli E2 §2.7» y poner «Te lo coloco en Discover. Con expertos.» (la l. 241, B4 sin CMS, **no** cambia) |
| ídem | Primera charla: el `onStart` cambia | si alguna prueba busca «Perdona, me sale solo.» en la 1.ª charla, ahora es «Perdona. Sin nombre no la pincha nadie. La borrasca, digo.» (hoy ninguna lo busca) |
| ídem (nuevo bloque) | Titulador | con `pieza_escrita`: Dar `pieza_opa` a Yoli → «Valiente.»; elegir «Asunto: …» → «el Euríbor», «Autoridad: …» → «Confirmado», «Gancho: …» → «lo que ya sabías», «¡Publicar!» → el log tiene «Lo he medido: es verdad.» y `pecera_disc_record === 576000`; un clic fuera del menú no cuelga el bucle; «Dejarlo» cierra |
| ídem (nuevo) | Pasos 34 y 40 | después de Usar `ordenador_bruno`: «Uno era yo, comprobando.». Al entrar en el Acto III con `dos_ias_vista`: «Donde no molesta.» y `discover_ganador === 'mejillones'` |
| ídem, bloque del Acto III (l. ~331) | Una entrada nueva con `pieza_escrita` y `acto_3_iniciado` hace saltar `pecera_opa_ganadora` | si el bloque espera otra escena en esa entrada, poner antes `discover_ganador` o tenerlo en cuenta |
| `tools/extras.mjs` XE4 | La anexión tiene prioridad sobre el ganador: **no cambia** | — |
| `tools/test-comedia-p1.mjs` (epílogo, l. ~392-413) | Epílogo (S6) | si comprueba «Bruno. Esa cuenta…» o «¿Cuántos lectores?», cambiar a «Menos esa cuenta…» y «¿Cuántos, de un millón?» («objetivo de empresa» no cambia) |
| `tools/test-comedia-p3.mjs` | COINCIDO y el pósit | opción nueva en `A_MENU`. Con `opa_posit = 1` y la pieza: hablar con Aurora → «para hacer esperar.» y `opa_posit === 2` |
| `tools/walk-data.mjs` | **sin cambios** (ningún paso cambia de acción ni de flag esperado) | — |
| `node tools/check.mjs` | flags nuevos | declarar `discover_ganador`, `opa_posit` (P0) y los locales de `pecera` |
| `node tools/text-audit.mjs --estatico --recuento` | topes | los 1.344 titulares y las 14 reacciones ya pasan los regex del auditor (`titulador/gen.mjs --todas`); las otras líneas, `lineas.mjs`. «Diseño», «cariño», «único», «primera vez», «desde [fecha]», «No es X. Es Y.»: 0 nuevos |

---

## §8 · Dudas de implementación

El epílogo está decidido (alternativa A, en S6) y la alternativa B queda descartada.
1. **Orden de las entradas del Acto III.** La anexión (extra XE3) va **antes** que el ganador para no romper XE4. Si el
   dueño prefiere que el ganador salga siempre en el paso 40, hay que cambiar XE4 y aceptar que la anexión se vaya a la
   entrada siguiente, que puede no llegar.
2. **¿Se cierra el plano con un clic fuera del menú?** El bucle lo aguanta (`api.game.detalle`), pero conviene probarlo
   con ratón y con el dedo. Si se cierra solo, se puede pasar `bloqueo` muy alto, o un `cerrarX: 0` más ese bloqueo.
3. **Strings en flags** (`discover_ganador`, `pecera_disc_record_k`): `pajarera` ya guarda listas, así que deberían
   funcionar. Si `check.mjs` pide tipo, se declaran `str`.

---

## Anexo A · Comprobación de las piezas del titulador

Detalle completo en `scratchpad/audiencias/titulador/VEREDICTO.md`.
1. **Cata a ciegas** de 180 titulares barajados sin origen: 60 de V1, 60 de V2 y 60 del juego anterior, todos con semillas
   nuevas. Se puntuó con el criterio del dueño («¿podría ser real cambiando una palabra?»): V1 da 8 % de treses y 68 % de
   unos, V2 18 % y 58 %, y el juego anterior 7 % y 75 %. Notas en `vuelta2/cata/`.
2. **Seis tiradas de 100 al azar**, cada una con semilla nueva y con las piezas culpables reescritas entre una y otra:

| Tirada | Semilla | 3 | 1 | Qué se cambió después |
|---|---|---|---|---|
| 1 | 31877 | 32 % | 33 % | Los moldes de economía de verdad con un asunto de economía son noticias reales: se rehacen Hidrovoltia, los expertos, los analistas y Confirmado con moldes de casa |
| 2 | 44203 | 40 % | 14 % | Datos («decirlo todo») reescritos y error de «con más el Euríbor» corregido (esa tirada no cuenta) |
| 3 | 58821 | 46 % | 8 % | Sale el lunes y entra Hacienda; se reescriben la prisa y el obvio de Hidrovoltia y el corte de los analistas |
| 4 | 73019 | 54 % | 4 % | Salen los tipos de interés (0 treses de 9) y entra el plazo fijo; se rehacen cinco plantillas de 2 |
| 5 | 86117 | 55 % | 5 % | Los cinco unos eran persianas o mejillones en su molde natural: entran nueve especiales para esas parejas |
| **6** | **95561** | **61 %** | **1 %** | **Final, con las piezas en su versión final** |
| 7 | 39187 | 61 % | 3 % | Retoque del dueño. Hidrovoltia vuelve a ser solo «la que dice algo y hunde» (fuera el corte, el regalo y la estafa de eléctrica). Entran los meteorólogos en lugar de «Atención si tienes», con k 1,9 para que la demo siga en 9.500. Después se arreglan tres unos (lavar las persianas, el contenedor amarillo de los mejillones y «cambiar el IPC»), así que esta tirada no cuenta |
| 8 | 52463 | 55 % | 3 % | Hidrovoltia saca 0 de 6 y Tráfico 1 de 9: se rehacen el corte y el truco de Tráfico y el testimonio de los meteorólogos |
| 9 | 67741 | 57 % | 3 % | Hidrovoltia saca 2 de 13 y el pueblo 1 de 6: se rehacen las señales y el corte de Hidrovoltia, el corte del pueblo y el obvio de Tráfico |
| **10** | **81953** | **65 %** | **2 %** | **Final, con las piezas en su versión final** |

Las tres tiradas posteriores al retoque, con semillas distintas, dieron 55 %, 57 % y 65 %: con 100 titulares la cifra oscila
unos ±5 puntos. El objetivo se cumple en la última, pero la media de las tres está en torno al 59 %.
