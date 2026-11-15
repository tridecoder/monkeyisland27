# FE DE ERRATAS — ENMIENDA E6 (ronda corta, para llevar el juego de 8,0 a 8,5)

> Autor: diseñador-guionista. **Borrador para revisión a la contra.** Base: crítica 5
> (`docs/informes/critica5/CRITICA_JUEGO_5.md`, cambios 1-6 de su §8, más 7-10), brief de salas con E2 y E5,
> `ENMIENDA_E5.md`, `ENMIENDA_E4.md`, `GUIA_AUTORES.md` y el código de hoy. Prevalece sobre E5 en lo que toca; lo que
> no se dice aquí, no cambia.
>
> **Manda el texto literal, no el número de línea** (los números son la foto de hoy, con el renombre ya aplicado:
> el becario es **Brais** (id `ruben`) y el de Sistemas **Eutimio** (id `paco_ticket`); hoy no queda ningún «Zacarías» en
> `content/`). Todas las cadenas «actual» de §4 y de §3 se han comprobado con script (`…/scratchpad/e6/verifica.mjs`):
> **371 de 371 existen literalmente hoy**; 15 contienen el nombre nuevo (marcadas **N** en §4).
>
> Lección del dueño que rige el texto: un solo golpe, natural; nada de parientes inventados, chistes apilados ni
> coletilla tras el remate. Donde se podía elegir, se ha elegido **quitar** antes que **reescribir**, y **gesto o
> silencio** antes que línea.
>
> No se tocan: Eventos y Pilar (`eventos*.js`), la cadena final (`climaxEmpujon`, `escenas/final.js`), las piezas y la
> fórmula del titulador (`pecera.titulador.datos.js`), las réplicas de los duelos (`duelo.js` `pairs`), los remates de
> los duelos ni el resultado del clímax. Nada adelanta que la abuela es la lectora («Comenta «abrígate»» se queda tal
> cual en su sitio, solo fundida). Herminia sigue siendo objeto; Desarrollo, solo Anselmo y el coro; Maripaz, inventario
> publicitario; Diseño e Infografía nunca juntos; sin director. La frase de Anselmo («El modelo es de fuera. El prompt es
> de dentro.» / «Eso lo hace nuestro.») sigue oyéndose una vez en el paso 38 (no se toca `pecera_herminia_mide`).

## Índice
§1 Resumen · §2 Diseño por punto · §3 Textos nuevos · §4 Tabla de reescrituras · §5 Duelos · §6 Motor e interfaz ·
§7 Recorrido · §8 Topes y regex · §9 Saldo y reloj · §10 Paquetes · §11 Pruebas · §12 Decisiones para el dueño

---

## §1 · RESUMEN

| # | Punto | Queda así | Coste |
|---|---|---|---|
| 1 | **Apagón siempre (N2)** | El regletero sigue sin gate. Si la R-3 se apaga **sin apagón previo**, corte de ≈ 7 s **«MIENTRAS, EN LA REDACCIÓN»** (plano detalle a oscuras: monitor de Yoli, linterna de Anselmo) con las dos líneas de Yoli de hoy; luego la rejilla («¡Ha sido Diseño!») como hoy. El camino del registro (enchufe con el ticket 3) también oscurece y oye a Yoli | 0 líneas nuevas |
| 2 | **Atasco que se anuncia (N3)** | Al encajarse: plano de 1 s sobre la puerta, los tres se giran hacia Bruno y él pregunta **«¿Necesitan ayuda?»**; nadie contesta; vuelve el control. Mirar a cualquiera describe el atasco. El anuncio de Maripaz espera **20 s** | +2 |
| 3 | **Sin ida y vuelta (Sala ↔ Vending)** | Con «sin turno», **Hablar con la tele**: «Buenas noches, Gertrudis.» → la tele la sintoniza → «BUENAS NOCHES, SALA AMAZONAS. ¿QUÉ PREGUNTA EL PÚBLICO?» → «¿Y cuáles son los siguientes pasos?» → la escena de hoy («PREGUNTA DEL PÚBLICO…»). La vía del Vending sigue valiendo entera | +4 cadenas, 0 en el camino |
| 4 | **Duelos con cuerpo** | **Teodoro 2 → 3 asaltos**: el tercero exige que la réplica **quepa en 38 caracteres**; el menú ofrece la R09 larga (el fax la corta: «NO CABE») y la corta («Tráeme el contexto.»). **Gervasio 2 → 3**: su tercer ataque se queda a medias («El acta se necesitaba para... para...») y la R03 se la termina. Ninguna réplica nueva que aprender | +2 cadenas; +4 en el camino |
| 5 | **Armario sin masticar (N6)** | Fuera «Eso no es un modelo. Eso es un compañero.». La llamada de los atunes pasa a **después** de abrir el armario y Bruno contesta «Se llama Brais.» | −1 |
| 6 | **Bruno deja de explicar (N7)** | Fuera la línea de la columna y otras **8** de Bruno que rematan o explican el gag de otro (lista en §2.6) | −7 |
| 7 | **Titulador** | La 5.ª publicación **espera** como las demás (menú «Dejarlo»). Pie con meta: **«LA CASA: 312.000»** (el «clásico de las siete»); al batirla, el pie pasa a «LA CASA: 576.000 · TÚ» con fogonazo | 0 |
| 8 | **Remate seco** | Regex en §8. **727 → 408 cadenas (20,2 % → 11,4 %)**; camino principal 20,9 % → 15,9 %. Táper 32 → 14; año 64 → 29; «Huele a 2019» 3 → 1; «D3: No.» 11 → 6; «Diecinueve años» 9 → 4; duplicados decididos uno a uno | −12 |
| 9 | **Rotulador** | El termómetro dice dónde cuelga el rotulador; Anselmo, al negarse, pide uno «de fuera»; la abuela habla del objeto en el nivel 1 | 0 |
| 10 | **Interfaz** | N4 (Mirar a Bruno gana al hotspot de debajo), N5 (Hablar con un actor tapado por Bruno), N8 (Valentín: casco fuera, globo «…»), comodín marcado, N11 (DPR 1 táctil) | 0 |

**Cifras:** camino principal **+3** (tope +6), juego **−9** (tope 0), reloj **≈ +0,3 min** (tope +2), **49 pasos** (el 28 y
el 29 de E5 se funden).

---

## §2 · DISEÑO POR PUNTO

Convención: **G** flag global (`flags.js`), **L** local de sala. «Hoy» = el código actual.

### 2.1 El apagón se ve siempre (N2) — `cpd.js`, `art/cpd.art.js`, `pecera.escenas.js`

**Diagnóstico.** `cpd.js:125` `usarRegletero` deja tirar de la R-3 sin mirar `apagon_n` (E5 §2.2.4 «sin gate», a
propósito). `cpd.js:158` `tirarRegleta` pone `cms_vivo` y la Redacción nunca se queda a oscuras: quien lee el registro o
acierta por eliminación no ve nunca a Yoli ciega (crítica §4.3.4). Además, el camino antiguo (`pecera.escenas.js:383`
`cmsVivo`, registro leído + Tirar enchufe) oscurece pero calla a Yoli.

**Por qué así y no un gate.** Un regletero que no responde hasta haber tirado del enchufe es una acción negada que luego
es solución (F1 de la crítica 4) y castiga al que deduce. El corte premia la deducción **y** enseña el gag. Es lo que
propone la crítica y lo único que garantiza «siempre» sin recado.

**Paso a paso (PC).**
1. `tirarRegleta(api)`, tras `api.setState('regleta_r3', 'apagada')` y el `api.wait(1100)` («un segundo de nada»), y antes
   de la rejilla del coro:
   ```js
   if (!(api.flag('apagon_n') > 0) && !api.flag('cpd_corte_visto')) { api.setFlag('cpd_corte_visto', true); await corteRedaccion(api); }
   ```
   (L `cpd_corte_visto`: 'bool · PC · E6 §2.1 · ya se vio el corte de la Redacción a oscuras'.)
2. `corteRedaccion(api)` (nuevo, dentro de la cinemática de `tirarRegleta`):
   ```js
   const C = { pub: false, t0: null };
   await api.detalle({ titulo: 'MIENTRAS, EN LA REDACCIÓN', w: 244, h: 98, y: 4, color: '#8ec4ff', oscurecer: 0.85,
     draw: (g, r, t) => planoRedaccionOscuras(g, r, t, C) }, async (api) => {
     const voz = { blocking: true, etiqueta: '', sfx: false, y: 70 };
     await api.megafonia('yoli_tendencias', '¡Estamos ciegos! ¿Hay alguien leyendo? ¿HAY ALGUIEN AHÍ FUERA?', voz);
     api.sfx(PLIN); C.pub = true;                                  // el monitor pasa a PUBLICADO
     await api.megafonia('yoli_tendencias', '...Ha entrado una pieza. ¡Ha entrado una pieza! ¡El CMS va!', voz);
   });
   ```
   Las dos cadenas son las de hoy (`pecera.escenas.js:251-253`): 0 líneas nuevas. `PLIN` es el sfx de la Redacción
   (exportarlo de `pecera.escenas.js` o copiar su receta). Con `game.instant`, el plano se abre y se cierra sin espera
   (como todos los `detalle`).
3. `planoRedaccionOscuras(g, r, t, C)` en `art/cpd.art.js`: fondo casi negro; arriba, la pantalla de métricas apagada
   (rectángulo gris muy oscuro con su marco); a la izquierda, el **monitor de Yoli** (40 × 26) que ilumina un óvalo y la
   silueta de Yoli (pelo y hombros, 3 colores); dentro del monitor, «GUARDANDO…» y, con `C.pub`, «PUBLICADO» en verde que
   parpadea cada 400 ms; a la derecha, un **cono de linterna** (elipse 22 × 12, amarillo pálido al 35 %) que avanza 1 px
   cada 60 ms hacia el monitor: Anselmo cruzando. Sin texto hablado dentro del dibujo.
4. **Camino antiguo** (`cmsVivo`, registro leído): tras `api.apagon({ ms: 0, spots: SPOT_YOLI }); await api.wait(400);`
   añadir `await api.sayAs(Y, '¡Estamos ciegos! ¿Hay alguien leyendo? ¿HAY ALGUIEN AHÍ FUERA?');` y, tras
   `api.setState('monitor_yoli', 'publicado')`, `api.sfx(PLIN); await api.sayAs(Y, '...Ha entrado una pieza. ¡Ha entrado
   una pieza! ¡El CMS va!');` (antes del `apagon(false)`). Mismas cadenas: 0 nuevas.
5. Nada cambia en el camino principal: el paso 20 hace el apagón jugable antes del regletero (`apagon_n` = 1), así que el
   corte no salta.

**Intentos equivocados.** R-1, R-2, R-4, R-5: los de hoy (no cortan). Regletero después del apagón: hoy. Volver a la
Redacción tras el corte: con luz, pantalla apagada, CMS vivo (estado de hoy tras la regleta) y `pecera_cms_entrada`
salta como siempre. Cargar a mitad: no se puede guardar dentro de una cinemática; el flag `cpd_corte_visto` solo se pone
al empezar el corte.

**Pistas.** Sin cambios (`cms`).

**Cómo se prueba.** Partida en el paso 19 sin apagón: ir a Sistemas, Tirar regletero → R-3: `detalle.titulo ===
'MIENTRAS, EN LA REDACCIÓN'`, en el log las dos líneas de Yoli por megafonía, luego «CORO: ¡Ha sido Diseño!», `cms_vivo`.
Con `apagon_n` = 1: no hay corte. Camino del registro: Yoli dice sus dos líneas. Captura del plano: se lee el monitor.

### 2.2 El atasco se anuncia (N3) — `sala_amazonas.js`

**Diagnóstico.** `sala_amazonas.js:669-676`: tras las tres líneas del atasco, la cinemática acaba y devuelve el control
sin gesto; `ATASCO_ANUNCIO_S = 10` (`:620`) y el `update` (`:561-568`) resuelve con Maripaz a los 10 s quietos. A ciegas
nadie sabe que puede actuar (crítica N3).

**Paso a paso (PA).**
1. `ATASCO_ANUNCIO_S = 20`.
2. Al final de `teleGertrudis`, dentro de la cinemática y tras `enAtasco` (las tres líneas de hoy):
   ```js
   api.cameraTo(PUERTA[0] + 30); api.shake(200, 1);            // plano de la puerta, 1 s: los tres tiemblan encajados
   await api.wait(700);
   for (const id of MERC) if (aqui(api, id)) api.faceActor(id, api.player);   // se giran hacia Bruno, sin soltarse
   await api.say('¿Necesitan ayuda?');                          // nadie contesta
   await api.wait(600);
   api.cameraFollow();
   ```
   (En modo rápido, igual que hoy: vía `anuncio` sin soltar el control; la línea de Bruno sí se dice.)
3. Con `sala_amazonas_atasco`, **Mirar** a Fermín, Rogelio o Jacinto (`mercadosActor.handlers.mirar` pasa a función):
   «Los tres de Mercados, encajados en el marco, sin ceder un palmo.» (nueva, una para los tres).
4. Las cuatro vías no cambian (`resolverAtasco`). Que se descubran: (a) **empujar** — la pregunta de Bruno y el plano
   de la puerta; Ir/Usar la puerta también; (b) **hablar** — el verbo por defecto sobre un actor es Hablar: el primer clic
   derecho/doble toque sobre cualquiera de los tres ya resuelve; (c) **cruasán** — los minicruasanes siguen en la mesa y
   su Mirar de hoy («…no llegan»); (d) **anuncio** — esperar 20 s o Hablar con Maripaz.

**Por qué esta línea.** Es una pregunta de becario servicial, no explica nada ni hace chiste; la falta de respuesta es el
chiste (y la invitación). Si la contra la quiere fuera: gesto solo (los tres se giran hacia Bruno) y nada más.

**Cómo se prueba.** Ratón real: tras la estampida, `detalle` cerrado, log con «¿Necesitan ayuda?», control devuelto; a
los 19 s sin tocar, `sala_amazonas_atasco` sigue; a los 21 s, vía `anuncio`. Las cuatro vías desde la misma partida (XE5-1…4
con la espera nueva).

### 2.3 Sin ida y vuelta al Vending — `sala_amazonas.js` (+ `pistas.js`)

**Diagnóstico.** Hoy la pregunta solo se le hace a Gertrudis en el Vending (`office.js:158-166`), y la tele de la Sala solo
«estampa» con `gertrudis_pregunta` (`sala_amazonas.js:54`). Seis cambios de sala (crítica §3, punto 7).

**Lógica que se conserva.** «Pregunta la mesa... y los conectados» → quién está conectado: la cafetera viral, que «sale
en todas las pantallas» → la tele la encuentra si la llamas como a ella se la llama: **con educación** (la regla del
Acto I: «no da café por botones, lo da por educación»). La que pregunta en directo sigue siendo la cafetera.

**Paso a paso (PA).**
1. `tele_amazonas.hablar` deja de ir por `teleSegunTurno` y pasa a `hablarTele(api)`:
   ```js
   async function hablarTele(api) {
     if (api.flag('sala_amazonas_atasco')) { await api.sayFrom('tele_amazonas', CONVOCADA, GERTRUDIS_TV); return; }
     if (api.flag('gertrudis_pregunta') && !api.flag('reunion_terminada')) { await api.scene('sala_tele_gertrudis'); return; }
     if (api.flag('sala_becario_sin_turno') && !api.flag('reunion_terminada')) {
       await api.dialog('tele_sala');
       if (api.flag('gertrudis_pregunta')) await api.scene('sala_tele_gertrudis', { sintonizada: true });
       else api.setState('tele_amazonas', 'normal');
       return;
     }
     // hoy: «¿Me veis la pantalla?»… + Rogelio «Se te ha congelado.»
   }
   ```
2. Árbol nuevo `tele_sala` (en `dialogs` de la Sala; `actor: null`, globo de Bruno; sin saludo):
   - **TV0**: `{ text: 'Buenas noches, Gertrudis.', do }` → `api.setState('tele_amazonas','buscando'); api.sfx('click');
     await api.wait(600); api.setState('tele_amazonas','gertrudis'); api.sfx('beep'); await api.sayFrom('tele_amazonas',
     'BUENAS NOCHES, SALA AMAZONAS. ¿QUÉ PREGUNTA EL PÚBLICO?', GERTRUDIS_TV); return 'TV1';` ·
     `{ text: '¿Me veis la pantalla?', do }` → `await api.wait(800); if (aqui(api,'mercados_2')) await sayMe(api, 2, 'Se te
     ha congelado.');` (cadena de hoy) · `{ text: 'Nada.', exit: true }` (silenciosa).
   - **TV1** (Gertrudis en pantalla): `{ text: '¿Y cuáles son los siguientes pasos?', do }` →
     `api.setFlag('gertrudis_pregunta', true); return 'exit';` · `{ text: 'Nada, gracias.', exit: true, do }` →
     `await api.sayFrom('tele_amazonas', 'E-00: DE NADA. ESO TAMBIÉN SE DICE.', GERTRUDIS_TV);` (cadena de hoy).
   - Fuera de la ventana «sin turno» (antes de Gervasio o tras la estampida) no hay árbol: Hablar tele = lo de hoy.
3. `teleGertrudis(api, opts = {})`: con `opts.sintonizada`, se salta los 600 ms de «BUSCANDO SEÑAL» (la tele ya está en
   `gertrudis`); el resto, idéntico («¡Se ve!…», «PREGUNTA DEL PÚBLICO…», estampida, atasco).
4. **El Vending sigue valiendo**: la opción de `office.js` y su LCD («…LA MANDO A LA PRÓXIMA PANTALLA QUE ME SINTONICE.»)
   no cambian; con `gertrudis_pregunta`, Usar **o** Hablar tele lanza la escena directamente (como hoy). Si el jugador
   pregunta primero en el Vending y luego habla con la tele, no ve el árbol (la condición de `hablarTele` va antes).
5. Usar la tele con «sin turno» (sin pregunta) sigue diciendo «Alguien con wifi y rencor la encontraría enseguida.»
   (pista que ahora lleva a las dos vías). Usar móvil con la tele: igual.

**Intentos equivocados.** «Buenas noches, Gertrudis.» antes de hablar con Gervasio: el árbol no existe; Hablar tele = hoy.
«Nada, gracias.» en TV1: la tele vuelve a `normal`; volver a hablarle repite TV0 (sin pista nueva). En el Acto III: hoy.

**Pistas (`turno`).** 1 y 2 igual. 3 → [«A esa tele dale las buenas noches, como a la cafetera, y pregúntale.»,
«Hablar con la tele: «Buenas noches, Gertrudis». Y lo de los pasos.»] (filas de §4). `previa` igual.

**Cómo se prueba.** Paso 28 nuevo (§7): Hablar tele, dos opciones, la escena y el atasco; nunca se pisa el Vending.
Extra XE6-3: la vía del Vending entera (pregunta en el Vending → Hablar tele → escena sin árbol).

### 2.4 Duelos con cuerpo — ver §5 (tablas completas)

**Diagnóstico (código).** `catacumba.js:585-605` y `pajarera.js:221-237`: los dos duelos tienen **remate a los dos
aciertos** (`atScore: 2`). La crítica cuenta «2 y 1 asaltos»; el código dice 2 y 2 (en el de Gervasio el
`hurtByPair.R07` «Me consta que... Bueno. Se constaba.» suena a cierre y el segundo asalto pasa sin peso: es probable
que lo contara así). Los dos suben a **3**, cada uno con un gag de situación y **sin réplica nueva que aprender**: R09
(Anselmo, paso 25) y R03 (Gertrudis, paso 14) ya están en la libreta antes de cada duelo en los dos recorridos.

### 2.5 Desmasticar el armario 27 (N6) — `pecera.escenas.js`, `game.js`

**Diagnóstico.** `pecera.escenas.js:471` (Bruno: «Armario 27. Atún. Baño. Eso no es un modelo. Eso es un compañero.») y
`game.js:131-135` (L4, con `['acto_3_iniciado', '!ruben_encontrado']`: suena al entrar en Sistemas **antes** de abrir).

**Paso a paso.**
1. PB: borrar la línea de Bruno de `dosIAs`. La escena acaba en Anselmo «Tiene alta de usuario interno. Lo que tiene
   alta es de la casa.» (la regla que paga la columna); después, `api.wait(800)` y Bruno mira hacia la puerta del
   ascensor (`api.face('right')`), sin línea. Las dos líneas de Herminia y la de Leoncio se quedan (son la sospecha; la
   conclusión la saca el jugador).
2. I1: L4 pasa a `llamada('L4', ['ruben_encontrado', '!ruben_libre'], …, 'ruben_libre')`, con las líneas de §4
   («Una cosita. La máquina de la planta -1 vende veinticuatro atunes al mes.» / «En Sistemas no come atún nadie. Lo he
   cruzado con las nóminas.» / «Alguien come ahí abajo y no cobra.» / BRUNO «Se llama Brais.»). En el camino suena al
   entrar en Marketing y Comercial (paso 43, ahora 42). Si el jugador libera a Brais sin cambiar de sala, se pierde
   (`salta`), como hoy.
3. Pistas `armario`: sin cambios.

**Cómo se prueba.** Paso 41: el log no contiene «Eso es un compañero» ni «atunes»; paso 42: contiene «Se llama Brais.».

### 2.6 Bruno deja de explicar (N7 y general)

Barrido: script que busca, en todo `content/` salvo Eventos y E4, una línea de Bruno **inmediatamente después** de otro
hablante (arrays de `talk`/`seq` y `sayAs`→`say` consecutivos) y las que empiezan por «Eso es / O sea / Entonces» (salida
completa en el material de trabajo). De 41 candidatas, **9** rematan o explican el gag ajeno:

| # | Fichero:línea | Texto literal (Bruno) | Qué se hace |
|---|---|---|---|
| B1 | `pecera.dialogos.js:350` | La frase con la que Íñigo despide a la gente acaba de liberar a Brais. | ELIMINAR. Brais, en la ventana, se gira hacia la columna y dice «SEGUIREMOS INFORMANDO.» (sin «Y la escribí yo.» ni «Perdón.») |
| B2 | `pecera.escenas.js:471` | Armario 27. Atún. Baño. Eso no es un modelo. Eso es un compañero. | ELIMINAR (§2.5) |
| B3 | `game.js:135` | Alguien que come y no cobra. Eso es un becario. | «Se llama Brais.» (tras abrir el armario, §2.5) |
| B4 | `pajarera.js:198` | Aquí manda el que asiente. Y va en mangas de camisa. | ELIMINAR: tras «¿Ve? Él sí sabe estar.», Bruno se quita la chaqueta (la `anim` que ya hay) |
| B5 | `pajarera.js:372` | Azul. Excusas. Íñigo le ha puesto en excusas. | ELIMINAR (el pósit azul ya lo dice; el código de colores lo explica Íñigo) |
| B6 | `pecera.js:302` | Me ha entendido a la primera. Aquí eso no pasa. | ELIMINAR: la pantalla de Herminia («saludo recibido · hola: 100 %») es el chiste |
| B7 | `pecera.js:478` | Está en HECHO (PERO NO). Nadie lo hizo. | «Está en HECHO (PERO NO).» |
| B8 | `cpd.js:86` | Cuarenta y ocho mil. Con coma. Esa coma la conozco. | «Cuarenta y ocho mil.» (repite la cifra, pensando; la coma la une el jugador) |
| B9 | `administracion.dialogos.js:193` | Le he mirado el reloj y se ha dado cuenta. | ELIMINAR; el gesto va antes: `api.anim(api.player, 'reach', 400)` (mira el reloj) justo antes del «Si tiene prisa…» de Evaristo |

Se quedan, con motivo: «He sido yo. Pero gracias.» (contesta, no explica; carcajada), «...Ya hablo como tú.»
(carcajada), «Pero se lo bebe.» (narra una acción), «La X mide un píxel.» (prepara el remate de Maripaz), «No he
preguntado nada.» (prepara el del torno), «Un motivo con número y un cable que baja. Eso huele a Eutimio.» (pista
necesaria para quien no lee el registro), «Es el primero que me lo pregunta.» (verdad de personaje), «Yo la sigo viendo.»
(ternura). Además se quita «Consto en la web. 4.112 veces.» (`vestibulo.js:305`: tercera vez del «4.112»; Bruno mira el
torno en silencio).

### 2.7 Titulador (N1 y meta) — `pecera.titulador.js` (solo lógica y dibujo; piezas y fórmula intactas)

**Diagnóstico.** `pecera.titulador.js:146-172`: el bucle sale al llegar a `PUBLICACIONES` y espera `api.wait(1200)`; el
contador anima 1.400 ms (`ANIM_MS`) y la etiqueta sale al final: la quinta no se lee. El pie (`:345-356`) enseña
«RÉCORD: n» (el del jugador) sin referencia.

**Paso a paso (PF).**
1. Sustituir `if (st.pubs >= PUBLICACIONES && vivo()) await api.wait(1200);` por
   `if (st.pubs >= PUBLICACIONES && vivo()) await api.choose(['Dejarlo'], { escape: 0, duel: true });`
   (el plano se queda abierto como tras cualquier otra publicación, con su cifra, etiqueta y voz de Yoli, hasta que el
   jugador lo cierra; Esc, clic fuera o «Dejarlo»). En modo rápido, `choose` resuelve al momento como siempre.
2. Meta: `CASA = usuariosK('expertos|persianas|obvio')` (312.000, el «clásico de las siete»; se calcula, no se escribe) y
   `MAX = usuariosK('confirmado|euribor|obvio')` (576.000, el secreto cuya etiqueta ya es «RÉCORD DE LA CASA»). Pie: a
   la izquierda, «ELIGE. PUBLICA. DISCOVER DECIDE.» solo hasta la primera publicación; después, **«LA CASA: 312.000»**
   (micro, `#8a96c8`). Si `pecera_disc_record > CASA`, «LA CASA: 576.000 · TÚ» en oro, y la primera vez que se supera
   (`api.once('pecera_casa_batida')`), fogonazo de 2 s (el del récord) y `api.shake(150, 1)`. La voz de Yoli es la que
   ya tiene el secreto (X5), una vez: no se añade línea.
3. Nada más: la ley de E4 («cuanto menos dice, más entra») se descubre buscando lo que bate al clásico.

**Cómo se prueba.** `test-e4`: tras la 5.ª publicación, `game.titulador.pubs === 5` y el plano sigue abierto 3 s después;
`choose` ofrece «Dejarlo». Con `confirmado|euribor|obvio`, el pie dice «· TÚ». Las comparaciones con `gen.mjs` no cambian.

### 2.8 El remate seco — §4 (tabla) y §8 (regex)

**Medida.** Cadena con ≥ 2 frases cuya **última frase** tiene 1-3 palabras y acaba en punto o exclamación. Frase = lo que
empieza tras «. ! ? …» (con su cierre de comillas) y espacio **y por mayúscula, «¡», «« », comillas o cifra** (así
«Grita «¡uy!» en cada rojo» no se parte). No cuentan: preguntas, frases cortadas («...»), cadenas de una frase. Cadenas:
las de `plan-rules` (`literales` sin `art/`, `flags.js`, plantilla ni bloques `@solo-pantalla`) **y sin `music.js`**
(261 «cadenas» que son notas: «A4 C5 F5 - -» contaban como texto). Hoy: **727 de 3.591 = 20,2 %** (la crítica, con otro
extractor, 21,8 %). Camino principal (registro de la partida automática): **119 de 570 = 20,9 %**.

**Criterio.** Se ha bajado sobre todo en salas de paso (Vestíbulo, Vending, Despachos, planta 2), Mirar/Coger/Empujar
y respuestas por defecto (`game.js`: 6 de 6 con remate). Formas usadas: **quitar el remate** cuando lo anterior ya tiene
golpe (la mayoría: la coletilla tras el remate); **fundir** en una frase cuando el remate es información; **acción o
silencio** cuando el remate explicaba; **otro** cuando el chiste era del de al lado. Se conservan las de voz: Teodoro por
fax (25 de 32), Gertrudis en LCD (7), Celestino narrando, los «Cabe.», «Es un cargo.», «Me has hecho daño», «Una anónima
y otra con IVA. Me vale.», «Han sido treinta años muy buenos», etc.

**Resultado** (con §3 incluida): **408 de 3.587 = 11,4 %** (sin Eventos: 678 → 359). Camino principal ≈ **15,9 %**
(90 de 567, antes de las líneas nuevas de duelo). Queda **margen para que la contra devuelva hasta ≈ 130** remates que
considere voz, sin pasar del 15 %.

**Tics** (cadenas, mismo corpus):

| Tic | Hoy | Tras E6 | Tope §8 | Qué se queda |
|---|---:|---:|---:|---|
| «táper» | 32 | **14** | 15 | Los que pagan: «¿Me traes un táper, ya que vas?», el titular «TÁPER DETECTADO…», «¿TRAES TÁPER?», la opción «¿Y el táper?», «¿Café? Gracias. Pero lo que necesito es un táper.», el nombre y el Mirar del objeto, «¿Con táper?» del clímax, el del epílogo y los 5 de Eventos (protegidos) |
| Año 19xx/20xx | 64 | **29** | 35 | Los que pagan o son dato: pósit 1998, plaza 1 de 1997, fax de 1992 y de 1996, coma de 2009, ticket 0.441 de 1999, focus group 2014, micrófono de 1994, «NADIE ME SALUDABA DESDE 2019», titulares 2026, los de `final.js` y Eventos |
| «Huele a 2019» | 3 | **1** | 1 | El Mirar de la chaqueta (`items.js`) |
| «D3: No.» | 11 | **6** | 6 | Coro A1, coro A3 («¿Lo del Titulator ha sido Diseño? — No.»), Coger y Usar la taza, «...No.» con el café, a oscuras |
| «Diecinueve años» | 9 | **3** | 4 | onWin de D3 y la de Gervasio tras el empujón (clímax y Sala: el mismo texto en dos ramas); la copia de `actors.js` se va con los duplicados |
| «Lo que diga el Lector Medio» | 7 | **5** | 5 | Opción de Despachos ×2 (M25 con el gesto, y su variante del Acto III), clímax, M34 y M24 |
| «Era solo eso» | 7 | **3** | 4 | L1 («Ahora sí era solo eso.»), L5, el de la factura en el clímax |

**Murmullos y frases duplicadas.** 82 cadenas de > 25 caracteres aparecen en dos o más sitios (173 apariciones). Casi
todas son **copias de código**, no repeticiones que se oigan: la lista por defecto de `actors.js` repite la que la sala
ya declara en el `placement` (y el motor usa la de la sala), o dos verbos del mismo objeto comparten respuesta. Decisión
uno a uno en §4.3; resumen: **21** son copias `actors.js` ↔ sala (se borran de `actors.js`: la frase vive en su sala);
**27** son dos verbos o dos ramas del mismo objeto o escena (una constante; se oye una vez por gesto); **8** son datos del
duelo que el clímax reutiliza (por diseño); **1** es `DONDE` (tres réplicas que se aprenden en el mismo sitio); **7** ya
cambian en §4.1; las **18** restantes **se quedan en una sola sala** (Maripaz ×3, Lector Medio, «Diecinueve años», «ESTÁ
AQUÍ», dos titulares, el sol de Brais, el móvil genérico…), con la sala que se queda escrita en §4.3.

### 2.9 Rotulador: segunda pista en el mundo — `ecosistema.js`, `art/ecosistema.art.js`, `pecera.js`, `pistas.js`

**Diagnóstico.** Una sola pista vista 40 minutos antes («pintado a rotulador», `ecosistema.js:281`); la abuela, nivel 1,
habla de la idea, no del objeto (`pistas.js:139`); el atasco de la crítica (6 min, 2 pistas).

**Paso a paso.**
1. PE: Mirar `termometro_ventas`, segunda línea: sin `ecosistema_rotulador_dado`, «El rotulador cuelga al lado, de un
   cordel, como el boli de un banco.»; con él, la de hoy («El 3 % que falta se lo lleva el gong de al lado.»). Arte: un
   rotulador rojo de 2 × 7 px colgando de un cordel de 1 px junto al termómetro mientras no se haya cogido (se ve desde el
   Acto I).
2. PB: `kanban.usar` sin objeto, con `album_validado` y sin `rotulador_rojo`: en lugar de Bruno («Una columna nueva pide
   rotulador. El de Anselmo no sale de Desarrollo.») habla **Anselmo**, sin levantarse: «Mi rotulador no sale de
   Desarrollo. Que te lo preste alguien de fuera.» Es su lógica (de fuera / de dentro) y prepara su «…Rotulador de
   Comercial. De fuera.» de la columna.
3. Además, en `AN_ALBUM_INTRO`, tras «Las fotos me valen. Pero yo no escribo columnas nuevas.», gesto sin línea: Anselmo
   tapa su rotulador (`api.sfx('click')`) y se lo guarda en el cinto (`api.anim(A, 'reach', 300)`).
4. I1: pista 1 → «En esa pizarra se escribe con rotulador, hijo, y no con el de ese señor.»; pista 2 → «La de los anuncios
   pinta sus objetivos a rotulador: pídeselo.»; la 3, igual.

**Cómo se prueba.** Con el álbum validado y sin rotulador, Usar kanban → habla `anselmo_monolito`. Mirar termómetro sin
el rotulador cogido: «cordel». Abuela en `columna`, nivel 1: contiene «rotulador».

### 2.10 Lote de interfaz — §6

---

## §3 · TEXTOS NUEVOS

Todas pasan `plan-rules` (≤ 80, sin coletilla, sin «Como…», sin fórmulas con tope, sin «cariño/criatura/chaval») y no son
remate seco (comprobado con `verifica.mjs`).

| Id | Quién | Texto | Dónde |
|---|---|---|---|
| N1 | BRUNO | ¿Necesitan ayuda? | Sala, fin de la cinemática del atasco (§2.2) |
| N2 | BRUNO (Mirar a uno de Mercados, con el atasco) | Los tres de Mercados, encajados en el marco, sin ceder un palmo. | §2.2 |
| N3 | GERTRUDIS (en la tele, `GERTRUDIS_TV`) | BUENAS NOCHES, SALA AMAZONAS. ¿QUÉ PREGUNTA EL PÚBLICO? | §2.3 |
| N4 | BRUNO (opción) | Buenas noches, Gertrudis. | §2.3 (el mismo texto que en el Vending) |
| N5 | BRUNO (opción) | ¿Y cuáles son los siguientes pasos? | §2.3 (ídem) |
| N6 | BRUNO (opción de salida) | Nada, gracias. | §2.3; contesta la tele con «E-00: DE NADA. ESO TAMBIÉN SE DICE.» (de hoy) |
| N7 | TEODORO (`attackText.R09` de D2; sustituye a «DATO SIN CONTEXTO. Y DE LA WEB, QUE ES PEOR.») | DATO SIN CONTEXTO. CONTESTA EN UNA LÍNEA: TREINTA Y OCHO CARACTERES. | §5.1 |
| N8 | BRUNO (réplica corta de R09, solo en D2) | Tráeme el contexto. | §5.1 |
| N9 | TEODORO (la réplica larga, 1.ª vez) | NO CABE. REPITA EN TREINTA Y OCHO. | §5.1 |
| N10 | GERVASIO (`attackText.R03` de D3; sustituye a «El acta se necesitaba para ayer. Por alguien. No digo quién.») | El acta se necesitaba para... para... | §5.2 |
| N11 | ANSELMO (Usar tablero sin rotulador; sustituye a la de Bruno) | Mi rotulador no sale de Desarrollo. Que te lo preste alguien de fuera. | §2.9 |
| — | BRUNO (L4, sustituye a «Alguien que come y no cobra. Eso es un becario.») | Se llama Brais. | §2.5 |
| — | BRAIS (sustituye a «Y la escribí yo. SEGUIREMOS INFORMANDO. Perdón.») | SEGUIREMOS INFORMANDO. | §2.6 B1 |
| — | Textos de pantalla (no son líneas) | «MIENTRAS, EN LA REDACCIÓN» · «LA CASA: 312.000» / «LA CASA: 576.000 · TÚ» · «COMODÍN» | §2.1, §2.7, §6 |

Reutilizadas sin cambio (0 cadenas): las dos de Yoli del apagón (corte y camino del registro), «Se te ha congelado.»,
«E-00: DE NADA. ESO TAMBIÉN SE DICE.», «...CABE.» (movida de R02 a R09 en D2).

---

## §4 · TABLA DE REESCRITURAS

**Manda el texto.** Columna «R» = la actual cuenta como remate seco; «N» = contiene el nombre nuevo (Brais/Eutimio).
«(n claves)» en la nota = la misma cadena está en varios sitios del fichero: se cambian todas salvo que la nota diga una
línea. Comprobación: `node …/scratchpad/e6/verifica.mjs` (371/371 existen hoy; 0 problemas).

Excepciones de clave: **E-pajarera «Lo que diga el Lector Medio.»** se borra **solo** en `grabacion` (`pajarera.js:186`,
con su «...Pues ya está decidido.»: fuera la llamada entera); en la opción de `gervasio_puerta` se queda.
«El 3 % que falta se lo lleva el gong de al lado.» se cambia **solo sin `ecosistema_rotulador_dado`** (§2.9).

### 4.1 Reescrituras (371)

| # | Fichero | Actual (literal) | Nuevo | R/N | Nota |
|---|---|---|---|---|---|
| E001 | `game.js` | Lo miro con intensidad de periodista sin cenar. No descubro nada. | Lo miro con intensidad de periodista sin cenar, y no descubro nada. | R | defecto |
| E002 | `game.js` | Visto. Ni una errata. Sospechoso. | Visto. No tiene ni una errata, y eso aquí da que pensar. | R | defecto |
| E003 | `game.js` | No me contesta. Bueno, no me ha llamado Pellizco. Algo es algo. | No me contesta. Por lo menos no me ha llamado Pellizco. | R | defecto |
| E004 | `game.js` | No se abre. Lo apunto como «acceso restringido». Suena a ascenso. | No se abre. Lo apunto como «acceso restringido», que suena a ascenso. | R | defecto |
| E005 | `game.js` | Cerrado. Hay una pegatina: «No forzar». Me ha convencido. | Cerrado, con una pegatina que pone «No forzar», y no lo fuerzo. | R | defecto |
| E006 | `game.js` | No pienso empujar eso. Saldría en el próximo comité. En diapositiva. | No pienso empujar eso. Saldría en una diapositiva del próximo comité. | R | defecto |
| E007 | `game.js` | No veo cómo. El manual lo tiene alguien que se jubiló en 2011. | No veo cómo. El manual se lo llevó alguien al jubilarse. |  | defecto · año |
| E008 | `game.js` | Anotado. Era solo eso. | Anotado. | R | L1 · «Era solo eso» ×9 → 5 |
| E009 | `game.js` | Veintitrés líneas. Ni una coma fuera de sitio. Era solo eso. | Veintitrés líneas, y ni una coma fuera de sitio. | R | L3 · «Era solo eso» |
| E010 | `game.js` | Alguien come ahí abajo y no cobra. Era solo eso. | Alguien come ahí abajo y no cobra. | R | L4 movida tras abrir el armario (§2.5) |
| E011 | `game.js` | Alguien que come y no cobra. Eso es un becario. | Se llama Brais. |  | L4: Bruno ya no explica (§2.6); una frase |
| E012 | `game.js` | Ella recorta sin leer. Yo leo sin recortar. Somos un sistema. | Ella recorta sin leer y yo leo sin recortar, y nos entendemos. | R | L3 |
| E013 | `rooms/vestibulo.js` | El cuadro de llaves del garaje. Doce plazas. Ciento doce aspirantes. | El cuadro de llaves del garaje: doce plazas y ciento doce aspirantes. | R | fundir |
| E014 | `rooms/vestibulo.js` | El ascensor está al otro lado del torno. Le saludo desde aquí. Por si acaso. | El ascensor está al otro lado del torno. Le saludo desde aquí. | R | quitar el remate |
| E015 | `rooms/vestibulo.js` | Tú pregúntame por el Ibex de vez en cuando. Por si acaso. | Tú pregúntame por el Ibex de vez en cuando. | R | quitar |
| E016 | `rooms/vestibulo.js` | Le hablo al organigrama. Treinta caras y ninguna me contesta. Es un comité. | Le hablo al organigrama. Treinta caras, y no me contesta ninguna. | R | coletilla tras el remate |
| E017 | `rooms/vestibulo.js` | Escribo «Más becarios con contrato». La ranura la escupe. Polvo y principios. | Escribo «Más becarios con contrato» y la ranura me lo escupe. | R | dos chistes apilados |
| E018 | `rooms/vestibulo.js` | Una radio de bolsillo. Retransmite la bolsa de las cinco y media. En diferido. | Una radio de bolsillo. Retransmite en diferido la bolsa de las cinco y media. | R | fundir |
| E019 | `rooms/vestibulo.js` | Un paragüero con tres paraguas. Ninguno es mío. | Un paragüero con tres paraguas que no son de nadie. | R | una frase |
| E020 | `rooms/vestibulo.js` | Etiqueta: «SEGURIDAD — NO RETIRAR». Sigue encendido. | Etiqueta: «SEGURIDAD — NO RETIRAR». El piloto sigue encendido. | R | concreto |
| E021 | `rooms/vestibulo.js` | La riego con la mirada. No necesita más. Es de plástico. | La riego con la mirada. Es de plástico: no necesita más. | R | remate dentro |
| E022 | `rooms/vestibulo.js` | Le pregunto qué hay que hacer para tener plaza. El cuadro calla. Sabe cosas. | Le pregunto qué hace falta para tener plaza. El cuadro calla, como quien sabe. | R | una frase final larga |
| E023 | `rooms/vestibulo.js` | Treinta años en este mostrador. El mostrador, cuarenta. Tiene peor rodilla. | Treinta años en este mostrador, y el mostrador tiene peor rodilla que yo. | R | murmullo: coletilla; vive solo aquí |
| E024 | `rooms/vestibulo.js` | Hoy tres me han preguntado por mi salud. Con mucho interés. Estoy de miedo. | Hoy tres me han preguntado por mi salud, con mucho interés. | R | coletilla |
| E025 | `rooms/vestibulo.js` | Celestino, el conserje. Bufanda del Ibex. | Celestino, el conserje, con la bufanda del Ibex. | R | fundir |
| E026 | `rooms/vestibulo.js` | Le tiro de la bufanda. Grita «¡fuera de juego!». Lo dejo. | Le tiro de la bufanda y grita «¡fuera de juego!». | R | quitar |
| E027 | `rooms/vestibulo.js` | Pidieron a alguien en 2021. Llego tarde, pero llego. | Pidieron a alguien hace años. Llego tarde, pero llego. |  | año |
| E028 | `rooms/vestibulo.js` | Consto en la web. 4.112 veces. | **ELIMINAR** | R | «4.112» ×3 → 2; el torno ya dice USUARIO NO CONSTA: silencio |
| E029 | `rooms/vestibulo.js` | ¡Táper rechazado! ¡Ese táper busca a alguien con hambre de verdad! | ¡Rechazado en el mostrador! ¡Eso busca a alguien con hambre de verdad! |  | táper |
| E030 | `rooms/office.js` | Nevera con imanes y un cartel: «ETIQUETAD VUESTROS TUPPERS». Nadie lo hace. | Nevera con imanes y un cartel: «ETIQUETAD VUESTROS TUPPERS». | R | el cartel es el chiste |
| E031 | `rooms/office.js` | No. Dentro duerme un yogur de 2019. Respeto. | No la abro: dentro duerme el yogur del tablón. | R | año · remate |
| E032 | `rooms/office.js` | Le queda una bolsa de pipas. Caducada en 2019. Sigue ahí. La admiro. | Le queda una bolsa de pipas caducada. Lleva años a punto de caer. | R | año · dos remates |
| E033 | `rooms/office.js` | Pulso la B4. Las pipas se asoman y se quedan colgando. Las animo. Nada. | Pulso la B4. Las pipas se asoman y se quedan colgando, pensándoselo. | R | quitar |
| E034 | `rooms/office.js` | La empujo un poco. La bolsa se asoma. Se lo piensa. Se queda. | La empujo un poco. La bolsa se asoma y vuelve a su sitio. | R | acción |
| E035 | `rooms/office.js` | Le pregunto si tiene algo para los nervios. Me ofrece pipas. Es un sí. | Le pregunto si tiene algo para los nervios. Me enseña las pipas. | R | un golpe |
| E036 | `rooms/office.js` | Se abre con llave. La llave la tiene Custodia. Las pipas, también. | Se abre con llave. La llave la tiene Custodia. | R | coletilla |
| E037 | `rooms/office.js` | Recalentar un café de Gertrudis delante de ella. No. | No pienso recalentar un café de Gertrudis delante de ella. | R | una frase |
| E038 | `rooms/office.js` | Le pregunto qué le pasa con Gertrudis. Pita. Un minuto entero. | Le pregunto qué le pasa con Gertrudis. Pita durante un minuto entero. | R | fundir |
| E039 | `rooms/office.js` | Darle café a la máquina de enfrente de Gertrudis. Sería una provocación. | Darle café a la máquina de enfrente de Gertrudis sería una provocación. | R | una frase |
| E040 | `rooms/office.js` | Un hilo impreso: «RE: RE: RE: ¿De quién es el yogur?». 214 respuestas. | Un hilo impreso, «RE: RE: RE: ¿De quién es el yogur?», con 214 respuestas. | R | fundir |
| E041 | `rooms/office.js` | Mi primera firma en papel no va a ser en una hoja de riesgos. Me niego. | Mi primera firma en papel no va a ser en una hoja de riesgos. | R | quitar |
| E042 | `rooms/office.js` | La taza del Foro de Innovación no se mueve. Ha echado raíces. Disruptivas. | La taza del Foro de Innovación ha echado raíces en el escurridor. | R | coletilla tras el remate |
| E043 | `rooms/office.js` | Tirar un café de Gertrudis por el fregadero. Me oiría. Lo sé. | Si tiro un café de Gertrudis por el fregadero, me oye desde ahí. | R | una frase |
| E044 | `rooms/office.js` | Una hoja: «PORRA: ¿QUIÉN DEJA ANTES SU PLAZA?». Cinco euros. | Una hoja: «PORRA: ¿QUIÉN DEJA ANTES SU PLAZA? CINCO EUROS». | R | dentro del cartel |
| E045 | `rooms/office.js` | Apuesto por mí. Cuota: «no consta». Doblo la apuesta. Sigue sin constar. | Apuesto cinco euros por mí. En la cuota pone «no consta». | R | dos remates |
| E046 | `rooms/office.js` | Gertrudis. Cafetera de 2009. Tiene pantalla y carácter. Lo segundo, más. | Gertrudis, la cafetera. Tiene pantalla y bastante más carácter. | R | año · coletilla |
| E047 | `rooms/office.js` | Pulso el botón del café. Me mira. Así no. Habrá que hablarle. | Pulso el botón del café. Me mira y espera a que la salude. | R | pista sin remate |
| E048 | `rooms/office.js` | Fermín Plazofijo, de Mercados, en la cola del microondas. No se mueve. | Fermín Plazofijo, de Mercados, en la cola del microondas. | R | el apellido ya es el chiste |
| E049 | `rooms/office.js` | Gervasio, delante de Gertrudis. Ella no le sirve. Él no la saluda. Del todo. | Gervasio, delante de Gertrudis. Ella no le sirve y él no la saluda. | R | coletilla |
| E050 | `rooms/office.js` | Diecinueve años en la casa. Y no consto. | A mí la máquina no me reconoce. Lo tengo hablado con Sistemas. | R | «Diecinueve años» ×10 → 3 |
| E051 | `rooms/office.js` | Diecinueve años esperando cosas. Se me da bien. | Esperar cosas se me da bien. |  | «Diecinueve años» |
| E052 | `rooms/office.js` | Diecinueve años sin moverse de su sitio. No voy a ser yo quien empiece. | Lleva toda la tarde sin moverse de su sitio. No voy a ser yo quien empiece. |  | «Diecinueve años» |
| E053 | `rooms/office.js` | Eso ya no es mío. Se ha delegado. En ti. | Eso ya no es mío. Se ha delegado en ti. | R | coletilla |
| E054 | `rooms/office.js` | Un ticket. Eso es de Sistemas. Se les reenvía. | Un ticket es de Sistemas, y a Sistemas se le reenvía. | R | una frase |
| E055 | `rooms/office.js` | Chsss. Aquí la cola tiene orden. Me siento seguro. | Chsss. Aquí la cola tiene orden. | R | quitar |
| E056 | `rooms/office.js` | Para cerrar un arco hace falta una puerta y un presupuesto. No hay ninguno. | Para cerrar un arco hace falta una puerta y un presupuesto. | R | quitar |
| E057 | `rooms/office.js` | NO SE ADMITEN DEVOLUCIONES. NI SENTIMIENTOS. | NO SE ADMITEN DEVOLUCIONES. | R | coletilla (dos claves: se cambian las dos) |
| E058 | `rooms/office.js` | NO ACEPTO TARJETAS. NI SOBORNOS. SOLO MODALES. | NO ACEPTO TARJETAS NI SOBORNOS: SOLO MODALES. | R | dos claves |
| E059 | `rooms/office.js` | NO ACEPTO RÉPLICAS. SOLO SALUDOS. | NO ACEPTO RÉPLICAS, SOLO SALUDOS. | R | fundir |
| E060 | `rooms/office.js` | NO SIRVO EN TÁPER. TENGO UN NOMBRE QUE MANTENER. | NO SIRVO PARA LLEVAR. TENGO UN NOMBRE QUE MANTENER. |  | táper (dos claves) |
| E061 | `rooms/office.js` | Un yogur de 2019 con nombre: «RAMÍREZ». Lo respetan más que a la chaqueta. | Un yogur con nombre: «RAMÍREZ». Lo respetan más que a la chaqueta. |  | año |
| E062 | `rooms/office.js` | El yogur de Ramírez. Caducó en 2019. Dijo que volvía antes. | El yogur de Ramírez. Dijo que volvía antes de que caducara. |  | año |
| E063 | `rooms/office.js` | Tazas de eventos. La del «Foro de Innovación 2017» tiene moho innovador. | Tazas de eventos. La del «Foro de Innovación» tiene moho innovador. |  | año |
| E064 | `rooms/office.js` | Un táper sin nombre. Lo adopto. Es lo primero que tengo a mi cargo. | Lo adopto. Es lo primero que tengo a mi cargo. |  | táper (el nombre del objeto ya lo dice) |
| E065 | `rooms/office.js` | Mi táper se queda conmigo. En el currículum: «Personal a cargo: 1». | Se queda conmigo. En el currículum: «Personal a cargo: 1». |  | táper |
| E066 | `rooms/office.js` | Meto mi táper. Ah, no: no tengo táper. Tengo nervios, y no se enfrían. | No tengo nada que calentar. Solo nervios, y esos no se enfrían. |  | táper ×2 |
| E067 | `rooms/office.js` | Un táper sin nombre, en el suelo. Vacío. Su dueño ha elegido la libertad. | En el suelo, vacío y sin nombre. Su dueño ha elegido la libertad. |  | táper |
| E068 | `rooms/office.js` | Su táper, no. Todavía. Hay que esperar a que suelte la presa. | Lo suyo, no, todavía. Hay que esperar a que suelte la presa. |  | táper |
| E069 | `rooms/pecera.js` | Abajo espera el torno. Ya no me da miedo. Un poco. | Abajo espera el torno. Ya casi no me da miedo. | R | coletilla |
| E070 | `rooms/pecera.js` | Empujar a alguien escaleras abajo sería una salida en valor. No. | Empujar a alguien escaleras abajo sería una salida en valor. | R | quitar el «No.» |
| E071 | `rooms/pecera.js` | Pulso el botón. Viene enseguida. Me emociono un poco. No estoy acostumbrado. | Pulso el botón y viene enseguida. No estoy acostumbrado a eso. | R | dos remates → uno |
| E072 | `rooms/pecera.js` | Lectores concurrentes: 3.418. Se refresca cada segundo. Igual que Yoli. | Lectores concurrentes: 3.418. Se refresca cada segundo, igual que Yoli. | R | fundir |
| E073 | `rooms/pecera.js` | Ya está fuera. Y el CMS, dentro. Que siga así. | Ya está fuera, y el CMS, dentro. | R | coletilla |
| E074 | `rooms/pecera.js` | La cinta dice NO DESENCHUFAR. No dice NO COGER. Pero se sobreentiende. | La cinta dice NO DESENCHUFAR. No dice NO COGER, pero se sobreentiende. | R | fundir |
| E075 | `rooms/pecera.js` | Una taza con costra de café de la crisis de la deuda. Debería cotizar. | Una taza con costra de café de la crisis de la deuda. | R | quitar |
| E076 | `rooms/pecera.js` | Delante, dos sillas vacías con chaqueta. Mirándola. | Delante, dos sillas vacías con chaqueta, mirándola. | R | fundir |
| E077 | `rooms/pecera.js` | Ella lo arreglaría en una décima. No la dejan. Él lo publica. | Ella lo arreglaría en una décima, pero no la dejan, y él lo publica así. | R | Leoncio: una frase |
| E078 | `rooms/pecera.js` | Herminia no sale de esta mesa. Fuera está Anselmo. | Herminia no sale de esta mesa: fuera está Anselmo. | R | fundir |
| E079 | `rooms/pecera.js` | Y Brais sigue fuera de la oficina. Bueno, dentro. Muy dentro. | Y Brais sigue fuera de la oficina. Bueno, dentro de un armario. | R N | coletilla |
| E080 | `rooms/pecera.js` | Treinta y una líneas. Sin adjetivos. Bueno, con uno. | Treinta y una líneas, sin adjetivos salvo uno. | R | una frase |
| E081 | `rooms/pecera.js` | Si me siento con su chaqueta en la mano, Ramírez vuelve. Es tradición. | Si me siento con su chaqueta en la mano, Ramírez vuelve: es tradición. | R | fundir |
| E082 | `rooms/pecera.js` | La arrimo a mi mesa. Primera silla en seis años. Huele a 2019. | La arrimo a mi mesa. Es la primera silla que tengo en seis años. | R | «Huele a 2019» una sola vez (la chaqueta) |
| E083 | `rooms/pecera.js` | Me siento. Me levanto. Me vuelvo a sentar. Es que puedo. | Me siento, me levanto y me vuelvo a sentar, porque puedo. | R | una frase |
| E084 | `rooms/pecera.js` | No me la pongo aún. Primero la descuelgo. Hay un orden. | No me la pongo aún: primero hay que descolgarla. | R | quitar |
| E085 | `rooms/pecera.js` | Cinta de carrocero en el suelo. La frontera de Desarrollo. Recta, de momento. | Cinta de carrocero en el suelo: la frontera de Desarrollo, recta de momento. | R | fundir |
| E086 | `rooms/pecera.js` | Le pregunto por Herminia. Me pide credenciales. Las de Anselmo. | Le pregunto por Herminia. Me pide las credenciales de Anselmo. | R | fundir |
| E087 | `rooms/pecera.js` | Semáforo de ruido de Prevención. Rojo. | Semáforo de ruido de Prevención, en rojo. | R | fundir |
| E088 | `rooms/pecera.js` | Una taza que pone "NO". Es de la tercera espalda. La define. | Una taza que pone "NO". Es de la tercera espalda. | R | coletilla |
| E089 | `rooms/pecera.js` | Una bandeja: "ENTREGAS DE DISEÑO Y PRODUCTO". Llena hasta arriba. | Una bandeja, "ENTREGAS DE DISEÑO Y PRODUCTO", llena hasta arriba. | R | fundir |
| E090 | `rooms/pecera.js` | Está en HECHO (PERO NO). Nadie lo hizo. | Está en HECHO (PERO NO). | R | Bruno explica la columna (§2.6) |
| E091 | `rooms/pecera.js` | Si me llevo un pósit, Anselmo me abre expediente. Mental. | Si me llevo un pósit, Anselmo me abre un expediente mental. | R | fundir |
| E092 | `rooms/pecera.js` | Ahí fuera hay un mundo real. Sin contador de lectores. Qué descanso. | Ahí fuera hay un mundo real, sin contador de lectores. | R | coletilla |
| E093 | `rooms/pecera.js` | ¿Escrita fuera del CMS? Sistema paralelo. Te abro expediente. Mental. | ¿Escrita fuera del CMS? Sistema paralelo. Te abro un expediente mental. | R | eco de la anterior, sin coletilla |
| E094 | `rooms/pecera.js` | Gracias. Herminia dice que es mi quinto. Me lo ha puesto en barras. Suben. | Gracias. Herminia dice que es mi quinto, y me lo ha puesto en barras. | R | coletilla |
| E095 | `rooms/pecera.js` | Tres casillas. Herminia lo pinta en semáforo. Estás en ámbar. | Tres casillas. Herminia lo pinta en semáforo y te pone en ámbar. | R | fundir |
| E096 | `rooms/pecera.js` | Me ha entendido a la primera. Aquí eso no pasa. | **ELIMINAR** |  | Bruno remata la pantalla de Herminia (§2.6): silencio |
| E097 | `rooms/pecera.js` | No. Si la dejo aquí, la leen en 2033. Con sello de LEÍDO (PERO NO). | No. Si la dejo aquí, le ponen el sello de LEÍDO (PERO NO). |  | año |
| E098 | `rooms/pecera.js` | «Entregado a las 18:29». Y al fondo, de 2017, una hoja con una flecha. | «Entregado a las 18:29». Y al fondo, una hoja con una flecha. |  | año |
| E099 | `rooms/pecera.dialogos.js` | La frase con la que Íñigo despide a la gente acaba de liberar a Brais. | **ELIMINAR** |  N | N7: Bruno explica la columna |
| E100 | `rooms/pecera.dialogos.js` | Y la escribí yo. SEGUIREMOS INFORMANDO. Perdón. | SEGUIREMOS INFORMANDO. | R | sin la línea de Bruno: despedida de titular, sin «Perdón» |
| E101 | `rooms/pecera.dialogos.js` | Perdona. Sin nombre no la pincha nadie. La borrasca, digo. | Perdona. Sin nombre propio, una borrasca no la pincha nadie. | R | coletilla |
| E102 | `rooms/pecera.dialogos.js` | Nadie me lo había preguntado sin querer un dato. Qué raro. Qué bonito. | Nadie me lo había preguntado sin querer un dato. | R | dos remates: queda la verdad |
| E103 | `rooms/pecera.dialogos.js` | Menos una lectora: cuarenta y siete minutos. Comenta «abrígate». En todo. | Menos una lectora: cuarenta y siete minutos, y comenta «abrígate» en todo. | R | fundir (no adelanta nada) |
| E104 | `rooms/pecera.dialogos.js` | Y cuando escribas algo, avísame. Te lo coloco en Discover. Con expertos. | Y cuando escribas algo, avísame, que te lo coloco en Discover. | R | coletilla Con |
| E105 | `rooms/pecera.dialogos.js` | Pasa. Aquí ya no se trabaja. Se supervisa. | Pasa. Aquí ya no se trabaja: se supervisa. | R | fundir |
| E106 | `rooms/pecera.dialogos.js` | Mejor que todo mi departamento. Me incluyo. | Mejor que todo mi departamento, y me incluyo. | R | fundir |
| E107 | `rooms/pecera.dialogos.js` | Dejaron las chaquetas en las sillas, mirándola. Por respeto. | Dejaron las chaquetas en las sillas, mirándola, por respeto. | R | fundir |
| E108 | `rooms/pecera.dialogos.js` | Un quesito que suma 130 %. Yo los hacía de 100. Vieja escuela. | Un quesito que suma 130 %. Yo los hacía de 100. | R | coletilla |
| E109 | `rooms/pecera.dialogos.js` | Lo sé. Ella lo dijo a las ocho y veinte. En barras. | Lo sé. Ella lo dijo a las ocho y veinte, en barras. | R | fundir |
| E110 | `rooms/pecera.dialogos.js` | Me han absorbido en plataforma. Sigo aquí. Supervisando. Desde Desarrollo. | Me han absorbido en plataforma. Sigo aquí, supervisando desde Desarrollo. | R | dos remates |
| E111 | `rooms/pecera.dialogos.js` | Y si se rompe a las tres, ¿quién baja? Eutimio abre ticket. Bajo yo. | Y si se rompe a las tres, ¿quién baja? Eutimio abre el ticket y bajo yo. | R N | fundir |
| E112 | `rooms/pecera.dialogos.js` | Solución de terceros. Funciona, pero no es mía. Próxima versión. | Solución de terceros. Funciona, pero no es mía. | R | «próxima versión» ×5 → 4 |
| E113 | `rooms/pecera.dialogos.js` | Tenía alta. Estaba en mis sistemas. Todo en regla. | Tenía alta y estaba en mis sistemas. | R | coletilla |
| E114 | `rooms/pecera.dialogos.js` | Cierra la frontera al salir. No tiene puerta. Ciérrala igual. | Cierra la frontera al salir. Que no tenga puerta no es excusa. | R | remate → lógica de Anselmo |
| E115 | `rooms/pecera.dialogos.js` | ¿De dónde vienen estas fotos? De Eventos. De fuera. | ¿De dónde vienen estas fotos? De Eventos, que es de fuera. | R | fundir |
| E116 | `rooms/pecera.dialogos.js` | Juntos son un incendio. Por separado, santos. | Juntos son un incendio, y por separado, dos santos. | R | fundir |
| E117 | `rooms/pecera.dialogos.js` | Con el navegador. Con los lectores. Con la lluvia. | Con el navegador, con los lectores y con la lluvia. | R | coro: una frase |
| E118 | `rooms/pecera.dialogos.js` | Eutimio ha mandado primero el papeleo. Es el procedimiento. | Eutimio ha mandado primero el papeleo, por procedimiento. | R N | fundir |
| E119 | `rooms/pecera.dialogos.js` | Cena de Navidad. Al fondo, un chico pálido con un táper. | Cena de Navidad. Al fondo, un chico pálido, comiendo de pie. |  | táper |
| E120 | `rooms/pecera.escenas.js` | Armario 27. Atún. Baño. Eso no es un modelo. Eso es un compañero. | **ELIMINAR** |  | N6: la conclusión la saca el jugador |
| E121 | `rooms/pecera.escenas.js` | Trescientos titulares esta tarde. Sin CMS. Sin silla. Sin convenio. | Trescientos titulares esta tarde, sin CMS, sin silla y sin convenio. | R | coletilla Sin ×3 |
| E122 | `rooms/pecera.escenas.js` | Ya. Pero no lo veía entrar. Eso no cuenta. | Ya. Pero si no lo veo entrar, no cuenta. | R | fundir |
| E123 | `rooms/pecera.escenas.js` | ...Entonces existe. A HECHO (PERO NO). Con número. | ...Entonces existe. A HECHO (PERO NO), con su número. | R | coletilla Con |
| E124 | `rooms/pecera.escenas.js` | Ya te la ha leído. Yo no, ¿eh? Yo ya no leo. Superviso. | Ya te la ha leído. Yo no, ¿eh? Yo ya solo superviso. | R | remate |
| E125 | `rooms/pecera.escenas.js` | Encintar, no. Aislar el componente. | Encintar, no: aislar el componente. | R | fundir |
| E126 | `rooms/pecera.escenas.js` | El prompt de Herminia lo escribí yo. En esta mesa. | El prompt de Herminia lo escribí yo, en esta mesa. | R | fundir |
| E127 | `rooms/pecera.escenas.js` | A un metro de mi cinta. Fuera. | A un metro de mi cinta, fuera. | R | fundir |
| E128 | `rooms/pecera.escenas.js` | Envuelta. Parece un regalo. De nadie. | Envuelta. Parece un regalo que no es de nadie. | R | coletilla |
| E129 | `rooms/pecera.escenas.js` | Antes de que la envolviera le pedí un gráfico del Titulator. Por curiosidad. | Antes de que la envolviera le pedí un gráfico del Titulator, por curiosidad. | R | fundir |
| E130 | `rooms/pecera.escenas.js` | Quitar, no. Absorber en plataforma. | Quitar, no: absorber en plataforma. | R | fundir |
| E131 | `rooms/pecera.escenas.js` | Me han anexionado. Pero integrada, que es lo que quería. Creo. | Me han anexionado. Pero integrada, que es lo que quería. | R | coletilla |
| E132 | `rooms/pecera.escenas.js` | Por un segundo te he respetado. Ha sido raro. Bonito, pero raro. | Por un segundo te he respetado, y ha sido raro. | R | coletilla tras el remate |
| E133 | `rooms/pecera.escenas.js` | Esa ya está vieja. Te imprimo otra. | Esa ya está vieja; te imprimo otra. | R | fundir |
| E134 | `rooms/pecera.escenas.js` | Lo más leído de la web. Impreso. Con chinchetas. | Lo más leído de la web, impreso y clavado con chinchetas. | R | coletilla Con |
| E135 | `rooms/pecera.escenas.js` | Ticket nº 3, de 2017: «El CMS se cuelga con esta pantalla». | Ticket nº 3: «El CMS se cuelga con esta pantalla». |  | año |
| E136 | `rooms/pecera.secretaria.js` | Su abuela que venga. Con su muerto. | Que venga su abuela con su muerto. | R | una frase |
| E137 | `rooms/pecera.secretaria.js` | Para apuntar lo que me digan. Sin grabadora. | Para apuntar lo que me digan. | R | opción: coletilla Sin |
| E138 | `rooms/pecera.secretaria.js` | Para tenerlo. Por si acaso. | Para tenerlo, por si acaso. | R | opción |
| E139 | `rooms/pecera.secretaria.js` | Un muerto sin que se lo pida. Qué raro. | Un muerto sin que se lo pida. No me había pasado nunca. | R | remate |
| E140 | `rooms/pecera.secretaria.js` | Ya ha firmado. Ya lo ha usado. Devuélvamelo. | Ya ha firmado y ya lo ha usado: devuélvamelo. | R | fundir |
| E141 | `rooms/pecera.secretaria.js` | Él desayuna despacio. Yo apunto rápido. | Él desayuna despacio y yo apunto rápido. | R | fundir |
| E142 | `rooms/pecera.secretaria.js` | Ochenta y tres bolis. Los tengo contados. Los que faltan. | Ochenta y tres bolis. Los que faltan los tengo contados. | R | remate dentro |
| E143 | `rooms/pecera.secretaria.js` | Gertrudis me debe catorce. No cuenta. | Gertrudis me debe catorce, pero no cuenta. | R | fundir |
| E144 | `rooms/pecera.secretaria.js` | Abierta dos dedos. Lo que cabe un boli. Siguiente. | Abierta dos dedos, lo que cabe un boli. | R | coletilla |
| E145 | `rooms/pecera.secretaria.js` | Lo leo dos veces. Sigo sin merecer nada. Coherente. | Lo leo dos veces y sigo sin merecer nada. | R | coletilla |
| E146 | `rooms/pajarera.js` | Aquí manda el que asiente. Y va en mangas de camisa. | **ELIMINAR** |  | Bruno explica a Íñigo (§2.6): Bruno se quita la chaqueta (la acción que ya hay) |
| E147 | `rooms/pajarera.js` | Azul. Excusas. Íñigo le ha puesto en excusas. | **ELIMINAR** |  | Bruno explica el código de colores (§2.6) |
| E148 | `rooms/pajarera.js` | Otra vez: «ARMARIO 27». Los titulares no se repiten. Las personas, sí. | Otra vez «ARMARIO 27». Los titulares no se repiten; las personas, sí. | R | fundir |
| E149 | `rooms/pajarera.js` | Sin acta de la anterior no se abre la siguiente. Es el reglamento. | Sin acta de la anterior no se abre la siguiente, por reglamento. | R | fundir |
| E150 | `rooms/pajarera.js` | OCUPADO hasta 2031. Llamar a esta puerta es pedir una prórroga. | OCUPADO. Llamar a esta puerta es pedir una prórroga. |  | año |
| E151 | `rooms/pajarera.js` | La silla de Ramírez queda libre. Por tradición, es mía. Por antigüedad, también. | La silla de Ramírez queda libre. Por tradición, me toca a mí. | R | coletilla |
| E152 | `rooms/pajarera.js` | «Acuerdos: uno, perder otro duelo». Mi segunda acta. Ya tengo archivo. | «Acuerdos: uno, perder otro duelo». Es mi segunda acta. | R | coletilla |
| E153 | `rooms/pajarera.js` | «Acuerdos: uno, perder un duelo». Ya está. Mi primera acta. | «Acuerdos: uno, perder un duelo». Ya está: es mi primera acta. | R | fundir |
| E154 | `rooms/pajarera.js` | Le hago gestos al tótem del vestíbulo. Me contesta: «AQUÍ». Ya lo sé. | Le hago gestos al tótem del vestíbulo y me contesta: «AQUÍ». | R | coletilla |
| E155 | `rooms/pajarera.js` | Empujo el cristal. Desde la Redacción parece que pido auxilio. Un poco sí. | Empujo el cristal. Desde la Redacción parece que pido auxilio. | R | coletilla |
| E156 | `rooms/pajarera.js` | No. Íñigo los tiene contados. Por colores. | No. Íñigo los tiene contados por colores. | R | fundir |
| E157 | `rooms/pajarera.js` | Me pego uno verde en el pecho: "Oportunidad". Nadie lo ve. | Me pego uno verde en el pecho: "Oportunidad". | R | quitar |
| E158 | `rooms/pajarera.js` | En "Ideal" hay un solo pósit: "VACANTE". Soy el empleado perfecto. No existo. | En "Ideal" hay un solo pósit: "VACANTE". Soy el empleado perfecto. | R | coletilla tras el remate |
| E159 | `rooms/pajarera.js` | Me siento. Me hundo. Huele a consultor. Me levanto. | Me siento, me hundo, huele a consultor y me levanto. | R | una frase |
| E160 | `rooms/pajarera.js` | No toques el modelo. Se enfría. | No toques el modelo, que se enfría. | R | fundir |
| E161 | `rooms/pajarera.js` | Le pregunto quién le escribe los titulares. Parpadea. En mayúsculas. | Le pregunto quién le escribe los titulares y parpadea en mayúsculas. | R | fundir |
| E162 | `rooms/pajarera.js` | Cuidado, que es una licencia. Cuarenta y ocho mil al mes. Una inversión. | Cuidado, que es una licencia de cuarenta y ocho mil al mes. | R | coletilla |
| E163 | `rooms/pajarera.js` | ¿El informe en blanco? Se queda. Está validado. | ¿El informe en blanco? Se queda, que está validado. | R | fundir |
| E164 | `rooms/pajarera.js` | Si la dejo en esta mesa, la validan. En blanco. | Si la dejo en esta mesa, la validan en blanco. | R | fundir |
| E165 | `rooms/pajarera.js` | Cerrada por dentro. Se oye pasar una diapositiva. Muy despacio. | Cerrada por dentro. Se oye pasar una diapositiva, muy despacio. | R | fundir |
| E166 | `rooms/pajarera.js` | Todos los relojes marcan las 20:59. La sala es de Ramírez. Siempre. | Todos los relojes marcan las 20:59, y la sala es de Ramírez. | R | coletilla |
| E167 | `rooms/pajarera.js` | Me apunto: "Bruno · firmar en papel · hoy". Lo tacho yo. Por si acaso. | Me apunto: "Bruno · firmar en papel · hoy". Ya lo tacharé yo. | R | coletilla |
| E168 | `rooms/pajarera.js` | Lo dejo. Que Evaristo se entere por escrito. Le gustará. | Lo dejo. Que Evaristo se entere por escrito, que le gusta más. | R | remate |
| E169 | `rooms/pajarera.js` | Le pongo una coma al pósit: "PESADO, BAJO IMPACTO". Mejora. | Le pongo una coma al pósit: "PESADO, BAJO IMPACTO". | R | quitar |
| E170 | `rooms/pajarera.js` | Y algo de atún. Lo estamos optimizando. | Y algo de atún, que lo estamos optimizando. | R | atún antes de tiempo: más suave |
| E171 | `rooms/pajarera.js` | Te invento uno: «Vacante (histórico)». Enhorabuena. | Te invento uno: «Vacante (histórico)». | R | coletilla |
| E172 | `rooms/pajarera.js` | Cero. Los marrones se... se reparten. Muy bien repartidos. | Cero. Los marrones se... se reparten. | R | coletilla |
| E173 | `rooms/pajarera.js` | Se firmó un acuse de recibo. En 2007. | Una vez se firmó un acuse de recibo. | R | año |
| E174 | `rooms/pajarera.js` | Se agradece la iniciativa igual. Se archiva. | Se agradece la iniciativa igual, y se archiva. | R | fundir |
| E175 | `rooms/pajarera.js` | Ese correo se contesta... Se contestará. | Ese correo se contesta... se contestará. | R | una frase cortada |
| E176 | `rooms/pajarera.js` | El Lector Medio. Cartón pluma a tamaño real. Lo encargó Marketing en 2014. | El Lector Medio: cartón pluma a tamaño real, encargado por Marketing. |  | año (dos claves) |
| E177 | `rooms/pajarera.js` | Lo que diga el Lector Medio. | **ELIMINAR** |  | en `grabacion` (l. 186, con «...Pues ya está decidido.»): fuera la llamada entera; M25 se queda en la opción |
| E178 | `rooms/pajarera.js` | UN REDACTOR DE MERCADOS HUYE DEL VENDING. DEJA UN TÁPER Y UN VACÍO | UN REDACTOR DE MERCADOS HUYE DEL VENDING Y DEJA ATRÁS SU CENA |  | táper (titular) |
| E179 | `rooms/sala_amazonas.js` | No se enciende. El mando lo tiene alguien de Mercados. En el Vending. | No se enciende. El mando lo tiene alguien de Mercados, en el Vending. | R | fundir |
| E180 | `rooms/sala_amazonas.js` | Uy. Eso tiene tarifa. | Uy, eso tiene tarifa. | R | fundir |
| E181 | `rooms/sala_amazonas.js` | Asignado a ti, cariño. El teléfono de Siestatón es este. Antes, un anuncio. | Asignado a ti, cariño. El teléfono de Siestatón es este, después del anuncio. | R | coletilla |
| E182 | `rooms/sala_amazonas.js` | Hueco libre: veintitrés líneas. Impar. Y sin un banner. Me duele. | Hueco libre: veintitrés líneas impares, y sin un banner. | R | dos remates |
| E183 | `rooms/sala_amazonas.js` | Se ve demasiado. Estoy en ello. | Se ve demasiado; estoy en ello. | R | fundir |
| E184 | `rooms/sala_amazonas.js` | Me han puesto un ronquido en espera. Cuelgo. Vuelvo con Maripaz. | Me han puesto un ronquido en espera. Cuelgo y vuelvo con Maripaz. | R | fundir |
| E185 | `rooms/sala_amazonas.js` | Bienvenido otra vez. Su llamada nos importa. Por eso bostezamos. | Bienvenido otra vez. Su llamada nos importa, por eso bostezamos. | R | fundir |
| E186 | `rooms/sala_amazonas.js` | Si la cierro, esto se convierte en una reunión de verdad. No me atrevo. | Si la cierro, esto se convierte en una reunión de verdad. | R | quitar |
| E187 | `rooms/sala_amazonas.js` | Diapositiva 247 de 400: «Sinergias exponenciales: el viaje». No hay vuelta. | Diapositiva 247 de 400: «Sinergias exponenciales: el viaje». | R | quitar |
| E188 | `rooms/sala_amazonas.js` | Lo empujo un poco. Zumba. La 247 aguanta. | Lo empujo un poco. Zumba, y la 247 aguanta. | R | fundir |
| E189 | `rooms/sala_amazonas.js` | Si lo apago, Íñigo presenta a oscuras. Lo haría igual. | Si lo apago, Íñigo presenta a oscuras, y lo haría igual. | R | fundir |
| E190 | `rooms/sala_amazonas.js` | Todo tachado. Hasta «Siguientes pasos». Alguien lloraba. | Todo tachado, hasta «Siguientes pasos». La tinta está corrida. | R | concreto |
| E191 | `rooms/sala_amazonas.js` | El punto 3. Nadie lo toca. Dicen que muerde. | El punto 3. Nadie lo toca: dicen que muerde. | R | fundir |
| E192 | `rooms/sala_amazonas.js` | Asoma un borde del planillo. Página 7: «Colchones Siestatón». Encima, Maripaz. | Asoma un borde del planillo, «Colchones Siestatón», y encima está Maripaz. | R | remate |
| E193 | `rooms/sala_amazonas.js` | Lo empujo hacia dentro. Maripaz se acomoda encima. Ha ganado terreno. | Lo empujo hacia dentro y Maripaz se acomoda encima. | R | coletilla |
| E194 | `rooms/sala_amazonas.js` | Catorce botellines por los suelos. Uno sigue en pie. Es de Mercados. | Catorce botellines por los suelos. Uno sigue en pie, el de Mercados. | R | fundir |
| E195 | `rooms/sala_amazonas.js` | Los alineo. Catorce en fila. Parecen un comité. | Los alineo. Catorce en fila parecen un comité. | R | fundir |
| E196 | `rooms/sala_amazonas.js` | La apago. Se enciende sola en «BUSCANDO SEÑAL». No se rinde. | La apago y se enciende sola en «BUSCANDO SEÑAL». | R | coletilla |
| E197 | `rooms/sala_amazonas.js` | Si me llevo un cable, alguien no podrá presentar. Tentador. No. | Si me llevo un cable, alguien no podrá presentar, y eso es tentador. | R | remate |
| E198 | `rooms/sala_amazonas.js` | Diecinueve años. Ni un marrón. Ni uno. | **ELIMINAR** | R | murmullo de la Sala: queda «Eso, en todo caso, lo hablamos.» («Diecinueve años») |
| E199 | `rooms/sala_amazonas.js` | Gervasio no se mueve. Diecinueve años esquivando marrones dan estabilidad. | Gervasio no se mueve. Esquivar marrones da mucha estabilidad. |  | «Diecinueve años» |
| E200 | `rooms/sala_amazonas.js` | ¿Cogerme? Antes, el formulario de contacto, cariño. Catorce campos. | ¿Cogerme? Antes, el formulario de contacto, cariño: catorce campos. | R | fundir |
| E201 | `rooms/sala_amazonas.js` | Una ficha sin hueco. El hueco lo tengo yo. Debajo. Con banners. | Una ficha sin hueco. El hueco lo tengo yo, aquí debajo. | R | dos remates |
| E202 | `rooms/sala_amazonas.js` | ¿Evaristo? Me revisa los contratos. Por él cobro lo pactado. Qué pena. | ¿Evaristo? Me revisa los contratos, y por él cobro solo lo pactado. | R | coletilla (dos salas: se cambian las dos) |
| E203 | `rooms/sala_amazonas.js` | Junto a la pantalla, el Lector Medio, con la chaqueta de Ramírez. Asiente. | Junto a la pantalla, el Lector Medio, con la chaqueta de Ramírez, asintiendo. | R | fundir |
| E204 | `rooms/sala_amazonas.js` | Junto a la pantalla, el Lector Medio. Asiente. | Junto a la pantalla, el Lector Medio, asintiendo. | R | fundir |
| E205 | `rooms/sala_amazonas.js` | Lo levanto un poco. Pesa lo que un folio. Asiente igual. | Lo levanto un poco. Pesa lo que un folio, y asiente igual. | R | fundir |
| E206 | `rooms/sala_amazonas.js` | Seguimos en el punto tres. Se avanza. | Seguimos en el punto tres, y se avanza. | R | fundir |
| E207 | `rooms/sala_amazonas.js` | Y Ramírez, que ha vuelto. Asiente mucho. | Y Ramírez, que ha vuelto y asiente mucho. | R | fundir |
| E208 | `rooms/sala_amazonas.js` | Para eso. Muy bien visto. Se toma nota. | Para eso. Muy bien visto, se toma nota. | R | fundir |
| E209 | `rooms/sala_amazonas.js` | Se decide... Se está decidiendo. Lo que diga el Lector Medio. | Se decide... Se está decidiendo por quien corresponda. |  | «Lo que diga el Lector Medio» ×8 → 5 |
| E210 | `rooms/sala_amazonas.js` | Nadie se ha quejado. No la encuentran. | Nadie se ha quejado porque no la encuentran. | R | fundir |
| E211 | `rooms/sala_amazonas.js` | Eso se podría ver en una reunión. De siguientes pasos. | Eso se podría ver en una reunión de siguientes pasos. | R | una frase |
| E212 | `rooms/catacumba.js` | Lo pienso. En este fax, un número mal marcado también llega. A otro. | Lo pienso. En este fax, un número mal marcado llega igual, a otra planta. | R | coletilla |
| E213 | `rooms/catacumba.js` | De Controlling. Ni lo mido. Lo respeto. | Lo de Controlling ni lo mido, por respeto. | R | dos claves |
| E214 | `rooms/catacumba.js` | Si firma uno de la web, el papel se acaba. Lo sé. Lo noto. | Si firma uno de la web, el papel se acaba. | R | dos remates |
| E215 | `rooms/catacumba.js` | ¿«Nota del autor: tengo sueño»? La escribí yo. En 1998. | ¿«Nota del autor: tengo sueño»? La escribí yo, una noche de cierre. | R | año |
| E216 | `rooms/catacumba.js` | La máquina de Leoncio respeta el cuerpo 9. Lo he medido. Nueve. | La máquina de Leoncio respeta el cuerpo 9. Lo he medido con el tipómetro. | R | remate |
| E217 | `rooms/catacumba.js` | Sin papel no habla. Qué paz. | Sin papel no habla. Es su mejor época. | R | «Qué paz» ×2 → 1 |
| E218 | `rooms/catacumba.js` | Doce folios. Ya tengo una obra completa. En una palabra. | Doce folios para una sola palabra: ya tengo obra completa. | R | una frase |
| E219 | `rooms/catacumba.js` | La ficha, después. Primero, contéstame. Si puedes. | La ficha, después. Primero contéstame, si puedes. | R | fundir |
| E220 | `rooms/catacumba.js` | Ya lo intentó Teodoro en 2009. La web entró igual. Por el fax. | Ya lo intentó Teodoro. La web entró igual, por el fax. | R | año · coletilla |
| E221 | `rooms/catacumba.js` | Le digo adiós a 1994. 1994 no contesta: está maquetando. | Le digo adiós al papel. No contesta: está maquetando. |  | año |
| E222 | `rooms/catacumba.js` | Esta puerta separa 1994 del clic. No se toca. | No la cojo: esta puerta separa el papel del clic. | R | año · remate |
| E223 | `rooms/catacumba.js` | La mesa de Teodoro. Muy ordenada. | La mesa de Teodoro, ordenada al milímetro. | R | fundir |
| E224 | `rooms/catacumba.js` | Galeradas colgadas como jamones. Curadas en tinta. | Galeradas colgadas como jamones. | R | coletilla tras el remate |
| E225 | `rooms/catacumba.js` | Corro la cortina. Teodoro la vuelve a abrir sin mirar. Vigila el fax. | Corro la cortina. Teodoro la vuelve a abrir sin dejar de mirar el fax. | R | fundir |
| E226 | `rooms/catacumba.js` | La ficha no se faxea. Se sella. | La ficha no va por fax: la quiere sellar él. | R | fórmula «no se X. Se Y» (−1) |
| E227 | `rooms/catacumba.js` | Un tipómetro: la regla de medir texto. Teodoro lo lleva encima. Duerme con él. | Un tipómetro, la regla de medir texto. Teodoro no se lo quita ni para dormir. | R | remate |
| E228 | `rooms/catacumba.js` | Lo empujo un centímetro. Teodoro lo devuelve a su sitio. Exacto. | Lo empujo un centímetro. Teodoro lo devuelve a su sitio exacto. | R | fundir |
| E229 | `rooms/catacumba.js` | Jefes de cierre en blanco y negro. Todos con bigote. | Jefes de cierre en blanco y negro, todos con bigote. | R | fundir |
| E230 | `rooms/catacumba.js` | Ya lo he contrastado: está enmarcado. Más contraste, imposible. | Ya lo he contrastado: está enmarcado. | R | coletilla tras el remate |
| E231 | `rooms/catacumba.js` | Lo abro por cualquier página: «Así no se dice». Tiene razón. Siempre. | Lo abro por cualquier página y pone «Así no se dice». | R | dos remates |
| E232 | `rooms/catacumba.js` | ¡Au! Me ha corregido la mano. En rojo. | ¡Au! Me ha corregido la mano en rojo. | R | fundir |
| E233 | `rooms/catacumba.js` | Toc en la tableta. La tableta calla. Aurora, también. | Toc en la tableta. No contesta, y Aurora tampoco. | R | fundir |
| E234 | `rooms/catacumba.js` | La desenchufé con el boli. Rojo. | La desenchufé con el boli rojo. | R | fundir |
| E235 | `rooms/catacumba.js` | Dos líneas. Cabe en un faldón. Y sobra. | Dos líneas. Cabe en un faldón. | R | coletilla Y |
| E236 | `rooms/catacumba.js` | Un táper. Vacío. Cabe todo. No lo quiero. | Vacío le cabe todo, y en mi mesa no cabe. | R | táper · remates |
| E237 | `rooms/catacumba.js` | Aurora, correctora. Tiene un boli rojo clavado en el moño. Por si acaso. | Aurora, correctora. Tiene un boli rojo clavado en el moño. | R | coletilla |
| E238 | `rooms/catacumba.js` | Un táper no se faxea. Aunque esté vacío. Sobre todo si está vacío. | Eso no se faxea, y vacío todavía menos. |  | táper |
| E239 | `rooms/catacumba.js` | Una. En 1989. Una coma después de «sin embargo» que no puse. | Una. Una coma después de «sin embargo» que no puse. |  | año |
| E240 | `rooms/catacumba.js` | La manta de cuadros es de Teodoro. Los cuadros, de 1997. | La manta de cuadros de Teodoro, doblada en cuatro como un pliego. |  | año |
| E241 | `rooms/catacumba.js` | Es un fax de 1992. Pesa lo que pesa una década. | Pesa lo que pesa una década. |  | año (ya lo dice el Mirar) |
| E242 | `rooms/catacumba.js` | Un fax enmarcado de 2003: «¿Esto lo has contrastado?». | Un fax enmarcado: «¿Esto lo has contrastado?». |  | año |
| E243 | `rooms/cpd.js` | Perdón. Se me escapa. Brais. Becario de verano. Del verano pasado. | Perdón, se me escapa. Soy Brais, el becario del verano pasado. | R N | «Perdón» · coletilla |
| E244 | `rooms/cpd.js` | Nadie me ha hecho nunca una foto. Bueno, una. En Eventos. Al fondo. | Nadie me ha hecho nunca una foto. Bueno, una en Eventos, al fondo. | R | fundir |
| E245 | `rooms/cpd.js` | Pone «NUNCA». Eutimio la mira con ternura. No la toco. | Pone «NUNCA», y Eutimio la mira con ternura. Esa no la toco. | R N | queda uno (es el no-tirar) |
| E246 | `rooms/cpd.js` | Si lo supiera, tendría 311. Está todo en el registro. Nadie lo lee. | Si lo supiera, tendría 311. Está todo en el registro, que no lo lee nadie. | R | pista: más suave |
| E247 | `rooms/cpd.js` | En 2011. Sigo en cola. | **ELIMINAR** | R | año · coletilla: «...Me lo abrí yo.» ya cierra |
| E248 | `rooms/cpd.js` | Herramientas, por el otro circuito. El rápido. | Herramientas, por el otro circuito, el rápido. | R | fundir |
| E249 | `rooms/cpd.js` | Lo dejo abierto. Total, uno más. | Lo dejo abierto, total, por uno más. | R | fundir |
| E250 | `rooms/cpd.js` | ...Esa es mía. Perdón. | ...Esa es mía. | R | «Perdón» ×20 |
| E251 | `rooms/cpd.js` | ...Perdón. Te espero. No me muevo. No puedo. | ...Perdón. Te espero aquí, que no me puedo mover. | R | dos remates |
| E252 | `rooms/cpd.js` | El ascensor. En el sótano, el «tin» suena más bajito. Por respeto. | El ascensor. En el sótano, el «tin» suena más bajito, por respeto. | R | fundir |
| E253 | `rooms/cpd.js` | Empujo uno. Eutimio carraspea. Paro. Eutimio para. Nos entendemos. | Empujo uno. Eutimio carraspea. Paro, y Eutimio para. | R N | coletilla |
| E254 | `rooms/cpd.js` | Pesan como un servidor. Porque son servidores. | Pesan como un servidor, porque son servidores. | R | fundir |
| E255 | `rooms/cpd.js` | Tiro de un cable. Eutimio carraspea a seis metros. Lo suelto. | Tiro de un cable. Eutimio carraspea a seis metros y lo suelto. | R N | fundir |
| E256 | `rooms/cpd.js` | Brais ya no está. La matricial sigue imprimiendo. Por respeto. | Brais ya no está, y la matricial sigue imprimiendo. | R N | «Por respeto» ×3 → 1 |
| E257 | `rooms/cpd.js` | Lo empujo hacia dentro. El armario lo vuelve a sacar. Insiste. | Lo empujo hacia dentro. El armario lo vuelve a sacar, con insistencia. | R | fundir |
| E258 | `rooms/cpd.js` | La empujo con el pie. El piloto ni parpadea. Tiene brida. | La empujo con el pie. El piloto ni parpadea: tiene brida. | R | fundir |
| E259 | `rooms/cpd.js` | Ya está encendido. Nadie sabe dónde está el botón. Eutimio no pregunta. | Ya está encendido. Nadie sabe dónde está el botón. | R N | coletilla |
| E260 | `rooms/cpd.js` | Le hablo. Me contesta con prosa. Ventilada. | Le hablo y me contesta con prosa ventilada. | R | fundir |
| E261 | `rooms/cpd.js` | La salida, con letra de Eutimio. Apretando mucho. | La salida, con letra de Eutimio, apretando mucho. | R N | fundir |
| E262 | `rooms/cpd.js` | Si lo cierro, Brais no sale ni en el libro. Lo dejo abierto. | Si lo cierro, Brais no sale ni en el libro. | R N | quitar |
| E263 | `rooms/cpd.js` | No tiene botones. Sube uno cada vez que entro. Soy una incidencia. | No tiene botones. Sube uno cada vez que entro: soy una incidencia. | R | fundir |
| E264 | `rooms/cpd.js` | Ticket nº 1, julio: «Alta becario Brais». Estado: cerrado. Por fin. | Ticket nº 1, julio: «Alta becario Brais». Estado: cerrado. | R N | coletilla |
| E265 | `rooms/cpd.js` | Y al final, de hoy: «Alta becaria Herminia». Cuarenta segundos. De la casa. | Y al final, de hoy: «Alta becaria Herminia», en cuarenta segundos. | R | «de la casa» fuera de Anselmo |
| E266 | `rooms/cpd.js` | Muevo una bola. Rueda por dentro. Eutimio tenía razón. | Muevo una bola y rueda por dentro, como decía Eutimio. | R N | fundir |
| E267 | `rooms/cpd.js` | Me abrió un ticket con márgenes. Lo tengo enmarcado. | Me abrió un ticket con márgenes, y lo tengo enmarcado. | R | fundir |
| E268 | `rooms/cpd.js` | Ahí salgo. Al fondo. Siempre al fondo. Es mi encuadre. | Ahí salgo, al fondo, como en todas. | R | coletilla |
| E269 | `rooms/cpd.js` | Firmo: «Bruno. Entrada: 2020. Salida: —». Quedo igual que Brais. | Firmo: «Bruno. Entrada: hace seis años. Salida: —». |  N | año · coletilla |
| E270 | `rooms/cpd.js` | Nº 3, 2017: «El CMS se cuelga con la pantalla de la Redacción». | Nº 3: «El CMS se cuelga con la pantalla de la Redacción». |  | año |
| E271 | `rooms/cpd.js` | Ahí abajo hay cables de 1997. Y un bocadillo de 2003. | Ahí abajo hay cables viejos y medio bocadillo. |  | años ×2 |
| E272 | `rooms/cpd.js` | ...Perdona. Hola. ¿Traes táper? | ...Perdona. Hola. Es que aquí abajo no hay microondas. |  | táper ×2 → 1 (queda el titular) |
| E273 | `rooms/cpd.js` | ¿ES UN TÁPER? | ¿ES COMIDA? |  | táper |
| E274 | `rooms/cpd.js` | Al armario no. El táper es para alguien que coma. | Al armario no. Esto es para alguien que coma. |  | táper |
| E275 | `rooms/cpd.js` | Un táper sin nombre. Ticket abierto: «Táper huérfano». Estado: tuyo. | Ticket abierto: «objeto huérfano». Estado: tuyo. |  | táper ×2 |
| E276 | `rooms/cpd.js` | Cuarenta y ocho mil. Con coma. Esa coma la conozco. | Cuarenta y ocho mil. |  | Bruno explica la coma (§2.6): repite la cifra y basta |
| E277 | `rooms/ecosistema.js` | Debajo: «Propongo quitar el logo. Por si os sirve!!». Enviado a todos. | Debajo: «Propongo quitar el logo. Por si os sirve!!», enviado a todos. | R | fundir |
| E278 | `rooms/ecosistema.js` | Tadeo no lo ha leído. Yo sí. | Tadeo no lo ha leído; yo, sí. | R | fundir |
| E279 | `rooms/ecosistema.js` | Ya está cerrado. Por fin descansa. La impresora, no. | Ya está cerrado, y por fin descansa. | R | coletilla |
| E280 | `rooms/ecosistema.js` | Lo cierro. Se abre solo. | Lo cierro y se abre solo. | R | fundir |
| E281 | `rooms/ecosistema.js` | Un anuncio. Otro. Un vídeo. Una línea de noticia. Otro anuncio. | Un anuncio, otro, un vídeo, una línea de noticia y otro anuncio. | R | enumeración |
| E282 | `rooms/ecosistema.js` | Un anuncio antes de entrar. Se llama interstitial. Son ingresos. | Un anuncio antes de entrar se llama interstitial, y son ingresos. | R | fundir |
| E283 | `rooms/ecosistema.js` | Me meto en el embudo. Salgo por abajo convertido. En becario. | Me meto en el embudo y salgo por abajo convertido en becario. | R | fundir |
| E284 | `rooms/ecosistema.js` | Me pongo delante. Soy el anuncio. Nadie me contrata. | Me pongo delante. Soy el anuncio, y nadie me contrata. | R | fundir |
| E285 | `rooms/ecosistema.js` | Se enrolla solo. Sin testigos. Lo disfruto. | Se enrolla solo y sin testigos. | R | dos remates |
| E286 | `rooms/ecosistema.js` | Debajo escribo «¿Y qué es?». Se borra solo. Por vergüenza. | Debajo escribo «¿Y qué es?» y se borra solo. | R | coletilla |
| E287 | `rooms/ecosistema.js` | Me ubico. Me hundo. Me desubico. | Me ubico, me hundo y me desubico. | R | una frase |
| E288 | `rooms/ecosistema.js` | Lo cojo. Lo abrazo. Lo dejo. No tengo piso. | Lo cojo, lo abrazo y lo dejo, que no tengo piso. | R | uno |
| E289 | `rooms/ecosistema.js` | Si lo descuelgo, detrás habrá un módulo. Mejor no mirar. | Si lo descuelgo, detrás habrá un módulo. | R | quitar |
| E290 | `rooms/ecosistema.js` | Me pongo al lado. Soy una oportunidad. Nadie me compra. | Me pongo al lado. Soy una oportunidad que no compra nadie. | R | eco del roll-up, una frase |
| E291 | `rooms/ecosistema.js` | Le leo el lema en voz alta. Suena a anuncio. | Le leo el lema en voz alta y suena a anuncio. | R | fundir |
| E292 | `rooms/ecosistema.js` | Dentro hay un folio de 2016 que pone «PRUEBA». Superada. | Dentro hay un folio que pone «PRUEBA». | R | año · coletilla |
| E293 | `rooms/ecosistema.js` | Le pregunto por la bandeja 2. Se calla. Lleva años callándoselo. | Le pregunto por la bandeja 2, y se lo sigue callando. | R | remate |
| E294 | `rooms/ecosistema.js` | Mejor no. Ahora está en paz. La impresora, no. | Mejor no. Ahora está en paz. | R | coletilla (repetida) |
| E295 | `rooms/ecosistema.js` | Lo empujo un centímetro. Reenvía «RV: Me han movido». A todos. | Lo empujo un centímetro y reenvía «RV: Me han movido» a todos. | R | fundir |
| E296 | `rooms/ecosistema.js` | ¡Deja eso! Lleva un adhesivo de patrocinio. Por debajo. | ¡Deja eso! Lleva un adhesivo de patrocinio por debajo. | R | fundir |
| E297 | `rooms/ecosistema.js` | ¿Cogerme? Rellena antes el formulario. Catorce campos. Ocho obligatorios. | ¿Cogerme? Rellena antes el formulario: catorce campos, ocho obligatorios. | R | fundir |
| E298 | `rooms/ecosistema.js` | Línea nueve: «Hidrovoltia, a por el Robledal». Quita el sueño. Siestatón. | Línea nueve: «Hidrovoltia, a por el Robledal». Eso quita el sueño. | R | coletilla |
| E299 | `rooms/ecosistema.js` | ¿Evaristo? Me revisa los contratos. Por él cobro lo pactado. Qué pena. | ¿Evaristo? Me revisa los contratos, y por él cobro solo lo pactado. | R | coletilla (las dos salas) |
| E300 | `rooms/ecosistema.js` | Me lo quedo cinco segundos. Lo que dura un anuncio. Toma. | Me lo quedo cinco segundos, lo que dura un anuncio, y te lo devuelvo. | R | una frase |
| E301 | `rooms/ecosistema.js` | El roll-up no se toca. Está contratado hasta 2030. | El roll-up no se toca: está contratado. |  | año (el pequeño de abajo lo dice) |
| E302 | `rooms/ecosistema.js` | Rojo hasta el 98 %. Nadie lo nota. | Rojo hasta el 98 %, y no lo nota nadie. | R | fundir |
| E303 | `rooms/ecosistema.js` | El 3 % que falta se lo lleva el gong de al lado. | El rotulador cuelga al lado, de un cordel, como el boli de un banco. |  | §2.9: pista del rotulador en el mundo (antes de cogerlo; después, la de hoy) |
| E304 | `rooms/ecosistema.dialogos.js` | Es contarle una historia. De una marca. Que paga. | Es contarle una historia de una marca que paga. | R | una frase |
| E305 | `rooms/ecosistema.dialogos.js` | Lo toco más fuerte. Que parezca. | Lo toco más fuerte, para que parezca. | R | fundir |
| E306 | `rooms/ecosistema.dialogos.js` | ¿Seguro que quieres salir? Era una pregunta. Y un anuncio. | ¿Seguro que quieres salir? Era una pregunta patrocinada. | R | coletilla Y |
| E307 | `rooms/ecosistema.dialogos.js` | Teodoro es el dueño del edificio. Lo compró en el 97. Por fax. | **ELIMINAR** | R | crítica peores 10: rumor que no paga (Pilar no se toca) |
| E308 | `rooms/administracion.js` | Si cierro el pasillo, Begoña me pide el F-3 de Pasillos. Por triplicado. | Si cierro el pasillo, Begoña me pide el F-3 de Pasillos por triplicado. | R | fundir |
| E309 | `rooms/administracion.js` | Le pregunto la hora al cartel. Las 19:07. Es coherente. | Le pregunto la hora al cartel: las 19:07. | R | coletilla |
| E310 | `rooms/administracion.js` | Tiro de una esquina. Se recorta sola. Un 26 %. Exacto. | Tiro de una esquina y se recorta sola, un 26 % exacto. | R | remates ×2 |
| E311 | `rooms/administracion.js` | Tres tazas vacías. Una por copia. | Tres tazas vacías, una por copia. | R | fundir |
| E312 | `rooms/administracion.js` | «EJEMPLARES». Once notas bien hechas en cuarenta años. Una por cuatrienio. | «EJEMPLARES»: once notas bien hechas en cuarenta años. | R | coletilla |
| E313 | `rooms/administracion.js` | Se ha ido todo el mundo. Yo cierro a las 19:15. Por principios. | Se ha ido todo el mundo. Yo cierro a las 19:15, por principios. | R | fundir |
| E314 | `rooms/administracion.js` | ¿Fotos? En esta ventanilla, fotocopias. Por triplicado. | ¿Fotos? En esta ventanilla, fotocopias por triplicado. | R | fundir |
| E315 | `rooms/administracion.js` | Me pongo detrás para empujarla. Me da número de turno. El uno. | Me pongo detrás para empujarla y me da el número uno de turno. | R | fundir |
| E316 | `rooms/administracion.js` | Don Evaristo Salvedad, Controlling. Corbata de comas. Lupa al cuello. | Don Evaristo Salvedad, Controlling, con corbata de comas y lupa al cuello. | R | fundir |
| E317 | `rooms/administracion.js` | Gracias. ¿Lleva ticket? No lo digo yo. Lo diría Begoña. | Gracias. ¿Lleva ticket? No lo pregunto yo, lo preguntaría Begoña. | R | fundir |
| E318 | `rooms/administracion.js` | Gracias. Lo leo y le escribo. Un correo. Muy pequeño. | Gracias. Lo leo y le escribo un correo muy pequeño. | R | fundir |
| E319 | `rooms/administracion.js` | Ese cristal es de 1986. Aguantó una auditoría. Te aguanta a ti. | Ese cristal aguantó una auditoría. Te aguanta a ti. |  | año |
| E320 | `rooms/administracion.dialogos.js` | El 26 %. Por abajo. Sin excepciones. | El 26 %, por abajo y sin excepciones. | R | fundir |
| E321 | `rooms/administracion.dialogos.js` | Eso es autoestima. Y no desgrava. | Eso es autoestima, y no desgrava. | R | fundir |
| E322 | `rooms/administracion.dialogos.js` | Pellejo, con jota. Pase un segundo. Una cosita. Muy pequeña. | Pellejo, con jota. Pase un segundo, que es una cosita muy pequeña. | R | «Una cosita» ×8 |
| E323 | `rooms/administracion.dialogos.js` | Lleva «RECHAZADO» en la frente. Bien centrado. Begoña tiene pulso. | Lleva «RECHAZADO» en la frente, bien centrado: Begoña tiene pulso. | R | fundir |
| E324 | `rooms/administracion.dialogos.js` | Un sobre de azúcar. Caducado en 2021. Del bolsillo de Ramírez, por el olor. | Un sobre de azúcar caducado, del bolsillo de Ramírez, por el olor. |  | año |
| E325 | `rooms/administracion.dialogos.js` | Gracias por escucharme hasta el final. Nadie lo hacía desde 2009. | Gracias por escucharme hasta el final. La gente suele colgar en la coma. |  | año · «desde [fecha]» −1 |
| E326 | `rooms/administracion.dialogos.js` | Le he mirado el reloj y se ha dado cuenta. | **ELIMINAR** |  | Bruno explica (§2.6): Bruno mira el reloj ANTES (anim), sin línea |
| E327 | `items.js` | Me la pongo. Por probar. Huele a 2019 y a cruasán. | Me la pongo por probar. Huele a cruasán de máquina. |  | «Huele a 2019» una vez (queda la del Mirar) |
| E328 | `items.js` | Sobre de azúcar caducado en 2021. Pone «Cafetería». Es casi un ticket. | Sobre de azúcar caducado. Pone «Cafetería». Es casi un ticket. |  | año |
| E329 | `items.js` | Mi móvil. Una llamada perdida de la abuela. Siempre hay una. | Mi móvil, con una llamada perdida de la abuela, que siempre hay una. | R | fundir |
| E330 | `items.js` | Echarle azúcar al café de Gertrudis es corregirla. No me atrevo. | Echarle azúcar al café de Gertrudis es corregirla. | R | quitar |
| E331 | `items.js` | Duplicado y triplicado de mi nota de gasto. Sello: RECHAZADA. Dos veces. | Duplicado y triplicado de mi nota de gasto, con dos sellos de RECHAZADA. | R | fundir |
| E332 | `items.js` | La primera acta en diecinueve años. Tiene dos faltas. Aurora lloraría. | La primera acta en diecinueve años, con dos faltas. | R | coletilla |
| E333 | `items.js` | Ya lo he leído. Está perfecto. Guárdalo. | Ya lo he leído y está perfecto. | R | una frase |
| E334 | `items.js` | Siempre yendo al baño. Siempre con un táper. | Siempre yendo al baño, siempre en una esquina de la foto. |  | táper |
| E335 | `actors.js` | ¿Hay alguien? ¿Traéis táper? | ¿Hay alguien? ¿Me traéis algo de comer? |  | táper |
| E336 | `lib/movil.js` | Una perdida de la abuela. Siempre hay una. | Una perdida de la abuela, que siempre hay una. | R | fundir (dos claves) |
| E337 | `lib/movil.js` | Y una de Evaristo. Era solo eso. | También una de Evaristo. | R | «Era solo eso» |
| E338 | `lib/movil.js` | «Pensar no es deducible». Lo enmarco. | «Pensar no es deducible», que lo voy a enmarcar. | R | fundir |
| E339 | `lib/ascensor.js` | Este ascensor no consta en el organigrama. Funciona igual. O por eso. | Este ascensor no consta en el organigrama, y funciona igual. | R | coletilla |
| E340 | `lib/ascensor.js` | Optimal Brains propone sustituirme por una escalera. Más escalable. | Optimal Brains propone sustituirme por una escalera, más escalable. | R | fundir |
| E341 | `lib/ascensor.js` | Si al abrir oye un gong, alguien ha vendido algo. No se asuste. | Si al abrir oye un gong, alguien ha vendido algo. | R | quitar |
| E342 | `lib/ascensor.js` | Planta 1: usuario no consta en organigrama. Pruebe a constar. | Planta 1: usuario no consta en organigrama. | R | quitar |
| E343 | `lib/ascensor.js` | Planta 2: se requiere acreditación. Pilar tiene seis. Usted, ninguna. | Planta 2: se requiere acreditación, y usted no tiene ninguna. | R | coletilla |
| E344 | `lib/directorio.js` | Un punto rojo: «ESTÁ AQUÍ». Gracias. Me hacía falta. | Un punto rojo: «ESTÁ AQUÍ». Me hacía falta saberlo. | R | queda uno (dos ficheros) |
| E345 | `pistas.js` | Hueco, fuente y firma. Lo pone la ficha. La ficha manda. | Hueco, fuente y firma, que lo pone la ficha. | R | meta |
| E346 | `pistas.js` | El del mostrador siempre está mascando algo. Pídeselo. | El del mostrador siempre está mascando algo: pídeselo. | R | fundir |
| E347 | `pistas.js` | Mirar mi ordenador. Sentado. | Mirar mi ordenador, sentado. | R | fundir |
| E348 | `pistas.js` | Dale las buenas noches a la cafetera. En alto. | Dale las buenas noches a la cafetera, en alto. | R | fundir |
| E349 | `pistas.js` | Tienes un papel del fax y otro de la ventanilla. Dos vecinas. | Tienes un papel del fax y otro de la ventanilla: dos vecinas. | R | fundir |
| E350 | `pistas.js` | Mi ordenador. A escribir. | Mi ordenador, a escribir. | R | fundir |
| E351 | `pistas.js` | Al señor del fax llévale los papeles. De mi parte. | Al señor del fax llévale los papeles de mi parte. | R | fundir |
| E352 | `pistas.js` | A los que nunca dicen nada, hijo, un empujoncito. Con educación. | A los que nunca dicen nada, hijo, un empujoncito con educación. | R | fundir |
| E353 | `pistas.js` | La del boli rojo y el del fax no se hablan. Pregúntale por qué. | La del boli rojo y el del fax no se hablan; pregúntale por qué. | R | fundir |
| E354 | `pistas.js` | Vending: «Buenas noches, Gertrudis». El primer chisme. | Vending: «Buenas noches, Gertrudis», el primer chisme. | R | fundir |
| E355 | `pistas.js` | A esa cafetera salúdala otra vez, hijo. Le quedan chismes. | A esa cafetera salúdala otra vez, hijo, que le quedan chismes. | R | fundir (tres claves) |
| E356 | `pistas.js` | Encima de la mesa del fax hay un papel con marco. Léelo. | Encima de la mesa del fax hay un papel con marco: léelo. | R | fundir |
| E357 | `pistas.js` | Despachos: Mirar el ordenador de Gervasio. Los enviados. | Despachos: Mirar el ordenador de Gervasio, los enviados. | R | fundir |
| E358 | `pistas.js` | El de los cables sabe cosas del señor del traje. Pregúntale. | El de los cables sabe cosas del señor del traje; pregúntale. | R | fundir |
| E359 | `pistas.js` | El chico del armario escribía los discursos. Pregúntale. | El chico del armario escribía los discursos; pregúntale. | R | fundir |
| E360 | `pistas.js` | Si en un tablero no hay sitio para lo que quieres, hijo, haz tú el sitio. | En esa pizarra se escribe con rotulador, hijo, y no con el de ese señor. |  | §2.9: pista 1 sobre el objeto |
| E361 | `pistas.js` | Una columna nueva se escribe con rotulador. La de los anuncios tiene uno. | La de los anuncios pinta sus objetivos a rotulador: pídeselo. |  | §2.9: pista 2 |
| E362 | `pistas.js` | Pregúntale a la cafetera lo de los pasos, y luego enciende esa tele. | A esa tele dale las buenas noches, como a la cafetera, y pregúntale. |  | §2.3: la tele |
| E363 | `pistas.js` | Gertrudis: «¿Y los siguientes pasos?». Luego, Usar la tele de la Sala. | Hablar con la tele: «Buenas noches, Gertrudis». Y lo de los pasos. |  | §2.3 |
| E364 | `duelo.js` | Lo llevaba. Ahora lo llevas tú. Con IVA. | Lo llevaba. Ahora lo llevas tú, con IVA. | R | floja de Maripaz: coletilla |
| E365 | `duelo.js` | Te lo estoy poniendo por escrito. Es un correo. | Te lo estoy poniendo por escrito: es un correo. | R | floja |
| E366 | `duelo.js` | Por escrito es más caro. Lleva anuncio. | Por escrito es más caro, porque lleva anuncio. | R | floja |
| E367 | `duelo.js` | Yo no tengo plaza. Tengo chófer. Es escalable. | Yo no tengo plaza. Tengo chófer, que es escalable. | R | floja |
| E368 | `duelo.js` | ¿Un boli? Yo firmo con el dedo. En la tableta. | ¿Un boli? Yo firmo con el dedo, en la tableta. | R | fundir |
| E369 | `duelo.js` | ¿Me vas a llamar? Estoy aquí. A dos metros. | ¿Me vas a llamar? Estoy aquí, a dos metros. | R | fundir |
| E370 | `duelo.js` | ESO ME LO DIJO ELLA. EN 1996. | ESO ME LO DIJO ELLA EN 1996. | R | fundir (el año paga: el fax de 1996) |
| E371 | `duelo.js` | TODO. Perdón. Se me escapa. | TODO. Se me escapa todo. | R | «Perdón» |

### 4.2 El coro: «D3: No.» de 11 a 6 (cambios en secuencias; literal del código)

| # | Fichero | Actual | Nuevo | Nota |
|---|---|---|---|---|
| K1 | `rooms/pecera.js` | `['D1', 'Yo no. Él.'], ['D3', 'No.']]]` | `['D1', 'Yo no. Él.']]]` | K: acaba en «Yo no. Él.» |
| K2 | `rooms/pecera.js` | `'dar:cafe': seq([['CORO', '¿De quién es?'], ['B', 'De Gertrudis.'], ['D1', 'Café de fuera.'], ['D3', 'No.']])` | `'dar:cafe': seq([['CORO', '¿De quién es?'], ['B', 'De Gertrudis.'], ['D1', 'Café de fuera.']])` |  |
| K3 | `rooms/pecera.js` | `coger: seq([['D3', 'No.']]), ⏎ 'dar:*'` | `coger: seq([['D2', 'Estamos trabajando.']]), ⏎ 'dar:*'` | coger el coro (la taza sigue con su «No.») |
| K4 | `rooms/pecera.js` | `['D2', 'Alguien de fuera.'], ['D3', 'No.']]` | `['D2', 'Alguien de fuera.']]` |  |
| K5 | `rooms/pecera.dialogos.js` | `['D2', '¡Pues ahora sí!'], ['D3', 'No.']]` | `['D2', '¡Pues ahora sí!']]` |  |
| K6 | `rooms/pecera.escenas.js` | `['D2', '¿Viene a por el yogur?'], ['D3', 'No.']]` | `['D2', '¿Viene a por el yogur?']]` |  |

### 4.3 Cadenas duplicadas (> 25 caracteres, en dos o más sitios): decisión una a una

| Veces | Cadena | Dónde (hoy) | Decisión |
|---:|---|---|---|
| 2 | Respondo a todos. Por fin algo que sé hacer. | actors.js:224 pistas.js:29 | vive en pistas.js; se borra de la lista por defecto de actors.js (la sala ya la declara) |
| 2 | Si me preguntan por el Ibex, digo que va. | actors.js:238 rooms/vestibulo.js:450 | vive en el Vestíbulo; fuera de actors.js |
| 2 | Esto sube. Esto baja. Esto soy yo. | actors.js:257 rooms/pecera.js:525 | vive en rooms/pecera.js; se borra de la lista por defecto de actors.js (la sala ya la declara) |
| 2 | Busco "el Contable" y salen gestorías. Nos ganan. Tienen horario. | actors.js:259 rooms/pecera.js:525 | vive en rooms/pecera.js; se borra de la lista por defecto de actors.js (la sala ya la declara) |
| 2 | CUERPO 9. INTERLINEADO 10. CORAZÓN 12. | actors.js:269 rooms/catacumba.js:673 | vive en rooms/catacumba.js; se borra de la lista por defecto de actors.js (la sala ya la declara) |
| 2 | GOYITA, ¿ME OYES? TÚ AGUANTA. | actors.js:269 rooms/catacumba.js:673 | vive en rooms/catacumba.js; se borra de la lista por defecto de actors.js (la sala ya la declara) |
| 2 | Eso, en todo caso, lo hablamos. | actors.js:296 rooms/sala_amazonas.js:376 | vive en rooms/sala_amazonas.js; se borra de la lista por defecto de actors.js (la sala ya la declara) |
| 2 | Diecinueve años. Ni un marrón. Ni uno. | actors.js:296 rooms/sala_amazonas.js:376 | fuera de la Sala (§4) y de actors.js: no se oye en ninguna sala |
| 2 | Hoy me han preguntado tres veces por mi salud. Debo de estar fatal. | actors.js:296 rooms/pajarera.js:418 | vive en Despachos; fuera de actors.js |
| 2 | Original. Duplicado. Triplicado. Original. Duplicado... | actors.js:304 rooms/administracion.js:153 | vive en rooms/administracion.js; se borra de la lista por defecto de actors.js (la sala ya la declara) |
| 2 | Las 19:07. Qué rápido pasa la tarde. No pasa. | actors.js:304 rooms/administracion.js:153 | vive en rooms/administracion.js; se borra de la lista por defecto de actors.js (la sala ya la declara) |
| 2 | Cinco minutos. Siempre cinco minutos. Es mi zona horaria. | actors.js:315 rooms/eventos.js:291 | vive en rooms/eventos.js; se borra de la lista por defecto de actors.js (la sala ya la declara) |
| 2 | 48.213... 48.214... Esto no para. | actors.js:335 rooms/cpd.js:518 | vive en rooms/cpd.js; se borra de la lista por defecto de actors.js (la sala ya la declara) |
| 2 | No, mamá, el wifi no se ha caído. Has dejado de merecerlo. | actors.js:335 rooms/cpd.js:518 | vive en rooms/cpd.js; se borra de la lista por defecto de actors.js (la sala ya la declara) |
| 2 | Esto en verde. Esto en rosa. Esto en azul, que es excusa. | actors.js:343 rooms/pajarera.js:407 | vive en rooms/pajarera.js; se borra de la lista por defecto de actors.js (la sala ya la declara) |
| 2 | Diapositiva 248: «El viaje continúa». | actors.js:343 rooms/pajarera.js:407 | vive en rooms/pajarera.js; se borra de la lista por defecto de actors.js (la sala ya la declara) |
| 2 | ¿Y esto el Lector Medio lo entiende? Perfecto: asiente. | actors.js:344 rooms/pajarera.js:408 | vive en rooms/pajarera.js; se borra de la lista por defecto de actors.js (la sala ya la declara) |
| 2 | Esto, en barras. Esto, en tarta. Esto, en tarta pero triste. | actors.js:385 rooms/pecera.js:72 | vive en rooms/pecera.js; se borra de la lista por defecto de actors.js (la sala ya la declara) |
| 2 | Cuatro décimas. Yo tardaba una semana. Qué semanas aquellas. | actors.js:385 rooms/pecera.js:74 | vive en rooms/pecera.js; se borra de la lista por defecto de actors.js (la sala ya la declara) |
| 2 | Esto no ha pasado por mí. Esto tampoco. Esto, de refilón. | actors.js:396 rooms/pecera.js:73 | vive en rooms/pecera.js; se borra de la lista por defecto de actors.js (la sala ya la declara) |
| 2 | (al termo) Tú sí eres de la casa. | actors.js:396 rooms/pecera.js:75 | vive en rooms/pecera.js; se borra de la lista por defecto de actors.js (la sala ya la declara) |
| 2 | Mañana es sábado. Lo dice la ferretería. Es de fuera, pero acierta. | actors.js:397 rooms/pecera.js:76 | vive en rooms/pecera.js; se borra de la lista por defecto de actors.js (la sala ya la declara) |
| 2 | Estupendamente. La plaza no se hereda. | duelo.js:43 duelo.js:44 | mismo fichero: dos verbos o dos ramas del mismo objeto/escena; no es murmullo repetido. Una constante |
| 4 | ¿Y cuáles son los siguientes pasos? | duelo.js:45 escenas/climax.js:100 rooms/office.js:158 rooms/office.js:208 | duelo (datos comunes) y clímax: la misma réplica/floja, por diseño |
| 3 | Me alegra que lo preguntes. Diapositiva 312. | duelo.js:45 duelo.js:46 escenas/climax.js:40 | duelo (datos comunes) y clímax: la misma réplica/floja, por diseño |
| 2 | «Siguientes pasos de los siguientes pasos». | duelo.js:46 escenas/climax.js:105 | duelo (datos comunes) y clímax: la misma réplica/floja, por diseño |
| 2 | Interesante. Lo pongo en azul. | duelo.js:58 escenas/climax.js:62 | duelo (datos comunes) y clímax: la misma réplica/floja, por diseño |
| 2 | Eso ya me lo has enseñado. No escala dos veces. | escenas/climax.js:83 escenas/climax.js:90 | mismo fichero: dos verbos o dos ramas del mismo objeto/escena; no es murmullo repetido. Una constante |
| 2 | Ni un gesto en contra. Ni una pregunta. El mejor lector que he tenido. | escenas/climax.js:110 rooms/sala_amazonas.js:454 | duelo (datos comunes) y clímax: la misma réplica/floja, por diseño |
| 2 | ¿Vacante? Esto es una Reunión de Dirección. Los becarios no tienen voz. | escenas/climax.js:141 rooms/sala_amazonas.js:455 | duelo (datos comunes) y clímax: la misma réplica/floja, por diseño |
| 2 | Perfecto. Te lo pongo por escrito. | escenas/climax.js:150 escenas/climax.js:160 | mismo fichero: dos verbos o dos ramas del mismo objeto/escena; no es murmullo repetido. Una constante |
| 2 | A mí lo que me interesa es la economía. Y ahorrar. | escenas/climax.js:212 rooms/pajarera.js:18 | duelo (datos comunes) y clímax: la misma réplica/floja, por diseño |
| 4 | Lo que diga el Lector Medio. | escenas/climax.js:214 rooms/pajarera.js:186 rooms/pajarera.js:478 rooms/sala_amazonas.js:430 | se queda en Despachos (opción, M25) y en el clímax; fuera de `grabacion` (§4) |
| 2 | Diecinueve años y nadie lo había preguntado. | escenas/climax.js:228 rooms/sala_amazonas.js:387 | duelo (datos comunes) y clímax: la misma réplica/floja, por diseño |
| 2 | No le hago fotos. Luego me pide derechos de imagen. | items.js:281 rooms/sala_amazonas.js:356 | genérico del móvil (items.js); la tele lo usa de reserva: importar, no copiar |
| 3 | Eso, por escrito. Si no está en el hilo, no escala. | items.js:380 rooms/sala_amazonas.js:460 rooms/sala_amazonas.js:461 | tres claves del mismo personaje en la misma sala (Íñigo, `dar:*` y dos `usar:`): una constante; se oye por objeto, no por sala |
| 2 | Lo guardo. Evaristo dijo «en el momento oportuno». Aún no ha llegado. | items.js:381 items.js:382 | mismo fichero: dos verbos o dos ramas del mismo objeto/escena; no es murmullo repetido. Una constante |
| 2 | Un punto rojo: «ESTÁ AQUÍ». Gracias. Me hacía falta. | lib/directorio.js:35 rooms/pecera.js:182 | una sola frase en los dos sitios (§4); el tótem de la Redacción usa la de `directorio.js` (importarla, no copiarla) |
| 2 | Una perdida de la abuela. Siempre hay una. | lib/movil.js:110 lib/movil.js:111 | reescrita en §4 (todas las claves) |
| 3 | A esa cafetera salúdala otra vez, hijo. Le quedan chismes. | pistas.js:171 pistas.js:177 pistas.js:181 | reescrita en §4 (todas las claves) |
| 3 | Vending: saludar otra vez a Gertrudis. Suelta todos los chismes. | pistas.js:171 pistas.js:177 pistas.js:181 | DONDE: tres réplicas que se aprenden en el mismo sitio; correcto |
| 2 | Ni se le ocurra. Si le empuja, vuelve a empezar la cláusula 12. | rooms/administracion.js:134 rooms/administracion.js:203 | mismo fichero: dos verbos o dos ramas del mismo objeto/escena; no es murmullo repetido. Una constante |
| 2 | Bruno Pellejo. Trece con espacios. Cabe. | rooms/catacumba.js:90 rooms/catacumba.js:614 | la firma: dos ramas (dar ficha / ganar D2); se oye una vez |
| 2 | Necesito a alguien que recorte sin leer. | rooms/catacumba.js:214 rooms/catacumba.js:226 | dos ramas del fax (tecla 2): una vez |
| 2 | De Controlling. Ni lo mido. Lo respeto. | rooms/catacumba.js:317 rooms/catacumba.js:823 | reescrita en §4 (todas las claves) |
| 2 | ESTOY FUERA DE LA OFICINA HASTA QUE EL PAPEL DEJE DE EXISTIR. | rooms/catacumba.js:548 rooms/catacumba.js:554 | la respuesta automática del fax: dos ramas del mismo remate; correcto |
| 2 | Café de la web. Sabe a clic. | rooms/catacumba.js:603 rooms/catacumba.js:810 | mismo fichero: dos verbos o dos ramas del mismo objeto/escena; no es murmullo repetido. Una constante |
| 2 | Ese teléfono no se toca. Es nuestro. | rooms/catacumba.js:708 rooms/catacumba.js:709 | mismo fichero: dos verbos o dos ramas del mismo objeto/escena; no es murmullo repetido. Una constante |
| 2 | Las fuentes, a Aurora. Yo solo mido. | rooms/catacumba.js:818 rooms/catacumba.js:819 | mismo fichero: dos verbos o dos ramas del mismo objeto/escena; no es murmullo repetido. Una constante |
| 2 | ¿Qué hay en el armario 27? | rooms/cpd.js:230 rooms/cpd.js:255 | opción de menú en dos nodos: correcto |
| 2 | No escucho. Oigo. Escuchar sería abrir un ticket. | rooms/cpd.js:236 rooms/cpd.js:264 | mismo fichero: dos verbos o dos ramas del mismo objeto/escena; no es murmullo repetido. Una constante |
| 2 | Me entero de todo. No arreglo nada. Es el equilibrio. | rooms/cpd.js:236 rooms/cpd.js:264 | mismo fichero: dos verbos o dos ramas del mismo objeto/escena; no es murmullo repetido. Una constante |
| 2 | Cierra al salir. La puerta, no el servidor. | rooms/cpd.js:237 rooms/cpd.js:266 | mismo fichero: dos verbos o dos ramas del mismo objeto/escena; no es murmullo repetido. Una constante |
| 2 | Armario 27. Hace «ñiiic, ñiiic». Por debajo asoma papel continuo. | rooms/cpd.js:403 rooms/cpd.js:404 | dos ramas del Mirar: correcto |
| 2 | Ni loco. La reenvía a todos, con resumen y sin leer. | rooms/ecosistema.js:347 rooms/ecosistema.js:348 | mismo fichero: dos verbos o dos ramas del mismo objeto/escena; no es murmullo repetido. Una constante |
| 2 | Has hecho clic en un anuncio. Ahora te sigo toda la noche. | rooms/ecosistema.js:373 rooms/sala_amazonas.js:409 | se queda en Comercial (Usar Maripaz); en la Sala, Usar Maripaz → «¡Uy! Si me mueves a mí, se mueve la página 7.» (su Empujar) |
| 2 | ¿Toda esta noticia sin un anuncio en medio? Se ve demasiado. | rooms/ecosistema.js:388 rooms/sala_amazonas.js:414 | se queda en Comercial (M3); en la Sala, `dar:pieza_opa` cae en su `dar:*` |
| 2 | ¿Evaristo? Me revisa los contratos. Por él cobro lo pactado. Qué pena. | rooms/ecosistema.js:400 rooms/sala_amazonas.js:415 | Maripaz la dice en Comercial; en la Sala, `dar:correo_evaristo` → «Si no lleva logo, no lo cojo. Y si lo lleva, lo cobro.» (su `dar:*`): una sola sala |
| 2 | Está pegada con cinta americana. A la pared y al tiempo. | rooms/eventos.js:178 rooms/eventos.js:179 | mismo fichero: dos verbos o dos ramas del mismo objeto/escena; no es murmullo repetido. Una constante |
| 2 | Despego una esquina. Debajo pone «POR CONFIRMAR». La vuelvo a pegar. | rooms/eventos.js:186 rooms/eventos.js:187 | mismo fichero: dos verbos o dos ramas del mismo objeto/escena; no es murmullo repetido. Una constante |
| 2 | NO SE ADMITEN DEVOLUCIONES. NI SENTIMIENTOS. | rooms/office.js:347 rooms/office.js:348 | reescrita en §4 (todas las claves) |
| 2 | NO ACEPTO TARJETAS. NI SOBORNOS. SOLO MODALES. | rooms/office.js:350 rooms/office.js:351 | reescrita en §4 (todas las claves) |
| 2 | NO SIRVO EN TÁPER. TENGO UN NOMBRE QUE MANTENER. | rooms/office.js:354 rooms/office.js:355 | reescrita en §4 (todas las claves) |
| 2 | Ni la rozo. En la pantalla ya pone: «ANOTADO». | rooms/office.js:358 rooms/office.js:359 | mismo fichero: dos verbos o dos ramas del mismo objeto/escena; no es murmullo repetido. Una constante |
| 2 | Si le empujo, pierde el sitio en la cola. Sería lo más cruel que he hecho. | rooms/office.js:373 rooms/office.js:374 | mismo fichero: dos verbos o dos ramas del mismo objeto/escena; no es murmullo repetido. Una constante |
| 2 | BECARIO LLAMA A UN COLCHÓN UN VIERNES. EL COLCHÓN NO LO COGE | rooms/pajarera.js:33 rooms/sala_amazonas.js:157 | titular: se queda en la Sala (la llamada a Siestatón); fuera de los genéricos de Despachos |
| 2 | EL IBEX ABRE PLANO. PLANO. ¿POR QUÉ NADIE HABLA DE ESTO? | rooms/pajarera.js:50 rooms/pecera.escenas.js:132 | titular: se queda en la escena 7.2; fuera de los genéricos de Despachos |
| 2 | Alucinaciones. Es normal en modelos tan avanzados. | rooms/pajarera.js:107 rooms/pajarera.js:437 | mismo fichero: dos verbos o dos ramas del mismo objeto/escena; no es murmullo repetido. Una constante |
| 2 | Eso es propiedad intelectual. | rooms/pajarera.js:294 rooms/pajarera.js:373 | mismo fichero: dos verbos o dos ramas del mismo objeto/escena; no es murmullo repetido. Una constante |
| 2 | El Lector Medio. Cartón pluma a tamaño real. Lo encargó Marketing en 2014. | rooms/pajarera.js:383 rooms/pajarera.js:385 | reescrita en §4 (todas las claves) |
| 2 | No. Ya lleva celo. Dos adhesivos en un lector es golpe de Estado. | rooms/pajarera.js:391 rooms/sala_amazonas.js:441 | se queda en Despachos; en la Sala (Acto III) el Lector ya no lleva celo a la vista: «Usar adhesivo» → defecto |
| 2 | Ese anuncio en la espalda... se agradece. Pero lo hablamos. | rooms/pajarera.js:467 rooms/sala_amazonas.js:386 | ya es `once` compartido (`pajarera_gervasio_banner`): se oye una vez; correcto |
| 2 | Hola Bruno, Bruno becario, becario elContable, cuánto cobra un becario. | rooms/pecera.dialogos.js:47 rooms/pecera.dialogos.js:49 | mismo fichero: dos verbos o dos ramas del mismo objeto/escena; no es murmullo repetido. Una constante |
| 2 | El Titulator era un becario. | rooms/pecera.dialogos.js:115 rooms/pecera.dialogos.js:165 | mismo fichero: dos verbos o dos ramas del mismo objeto/escena; no es murmullo repetido. Una constante |
| 2 | Estoy esperando a que salga el sol. Me han dicho que existe. | rooms/pecera.dialogos.js:326 rooms/pecera.js:535 | la dice Brais en la ventana (columna) y luego es su murmullo en la Redacción: se queda la de la escena; el murmullo pasa a «¿El sol también va con ticket?» (ya está en su lista) |
| 3 | Ni se te ocurra. De mi tablero se sale hecho o muerto. | rooms/pecera.js:89 rooms/pecera.js:463 rooms/pecera.js:479 | mismo fichero: dos verbos o dos ramas del mismo objeto/escena; no es murmullo repetido. Una constante |
| 2 | No se puede. La han integrado en un paquete. | rooms/pecera.js:116 rooms/pecera.js:295 | mismo fichero: dos verbos o dos ramas del mismo objeto/escena; no es murmullo repetido. Una constante |
| 2 | ¡Eh! Eso es infraestructura. | rooms/pecera.js:313 rooms/pecera.js:389 | mismo fichero: dos verbos o dos ramas del mismo objeto/escena; no es murmullo repetido. Una constante |
| 2 | Un boli no pinta en pizarra. Este, ni en papel. | rooms/pecera.js:475 rooms/pecera.js:482 | mismo fichero: dos verbos o dos ramas del mismo objeto/escena; no es murmullo repetido. Una constante |
| 2 | Boca abajo en el suelo, delante de la mesa. | rooms/sala_amazonas.js:423 rooms/sala_amazonas.js:428 | mismo fichero: dos verbos o dos ramas del mismo objeto/escena; no es murmullo repetido. Una constante |
| 2 | USUARIO NO CONSTA EN ORGANIGRAMA. | rooms/vestibulo.js:95 rooms/vestibulo.js:304 | mismo fichero: dos verbos o dos ramas del mismo objeto/escena; no es murmullo repetido. Una constante |
| 2 | Si salgo ahora, mi abuela se entera por otro. | rooms/vestibulo.js:259 rooms/vestibulo.js:260 | mismo fichero: dos verbos o dos ramas del mismo objeto/escena; no es murmullo repetido. Una constante |

---

## §5 · DUELOS

### 5.1 D2 · Teodoro (`catacumba.js` `dueloTeodoro`; `duelo.js` `hurtByPair.teodoro`) — de 2 a 3 asaltos

**El gag: que quepa.** El tercer ataque pide contestar en una línea de fax de 38 caracteres (los mismos «treinta y ocho»
de su `taunt` de hoy). En el menú, la R09 aparece **dos veces**: entera (71 caracteres) y recortada por el propio Bruno.
Si elige la entera, el fax la imprime cortada a media palabra y Teodoro la devuelve; si elige la corta, cabe. Es el tema
del juego (el recorte del 26 %, «TRECE CON ESPACIOS. CABE.») y prepara la firma: el jugador aprende, jugando, que en esa
página solo existe lo que cabe.

| Campo | Hoy | E6 |
|---|---|---|
| `deck` | `['R06', 'R02', 'R09']` | igual (la R09 ya se jugaba solo si se fallaba) |
| `finishers[0].atScore` | 2 | **3** |
| `attackText.R06` | ¿CONTRASTADO? FUENTES. NÚMERO. | igual |
| `attackText.R02` | CON TODO EL RESPETO QUE ME MERECE LA WEB. QUE ES POCO. | igual |
| `attackText.R09` | DATO SIN CONTEXTO. Y DE LA WEB, QUE ES PEOR. | **DATO SIN CONTEXTO. CONTESTA EN UNA LÍNEA: TREINTA Y OCHO CARACTERES.** |
| `cabe` (nuevo, §6.1) | — | `{ R09: { max: 38, corta: 'Tráeme el contexto.', noCabe: 'NO CABE. REPITA EN TREINTA Y OCHO.' } }` |
| `hurtByPair.teodoro.R06` | LA MEDIA FUENTE ERA YO. NO LO REPITAS. | igual |
| `hurtByPair.teodoro.R02` | ['ESO ME LO DIJO ELLA. EN 1996.', '...CABE.'] | **'ESO ME LO DIJO ELLA EN 1996.'** (el «...CABE.» pasa a la R09) |
| `hurtByPair.teodoro.R09` | — | **'...CABE.'** (se dice aunque sea el último acierto: `hp` manda) |
| Remate | «Esto está cerrado. Y lo que está cerrado no tiene respuesta.» + manual (página 9) | igual |

**Asaltos (camino):** R06 → «Con dos fuentes y media…» (de hoy) · R02 → «Gracias por avisar antes de faltármelo.» (de hoy) ·
R09 → **«Tráeme el contexto.»** → «...CABE.» · remate → manual → bucle de autorrespuestas → firma (de hoy).
**Réplica larga:** Bruno la dice entera; `sfx('paper')`; el cuerpo de la ventana muestra 1,2 s «TRÁEME EL CONTEXTO. LE
HAGO UNA PIEZA APAR—»; Teodoro: «NO CABE. REPITA EN TREINTA Y OCHO.». La **primera vez** no cuenta (el ataque se repite,
como el comodín); la segunda es fallo y Teodoro contesta con su `taunt`.
**Dónde se aprende:** nada nuevo. R06 (paso 18), R02 (17), R09 (25: Anselmo «¿Qué tal con Yoli?»); la versión corta la
ofrece el propio menú. En el recorrido alternativo, R09 (25) también va antes del duelo (32 → 36).
**DONDE y pistas:** `DONDE.rep_09` ya existe; `firma` igual (la abuela dice dónde está la R09 si falta).

### 5.2 D3 · Gervasio (`pajarera.js` `dueloGervasio`; `duelo.js` `hurtByPair.gervasio`) — de 2 a 3 asaltos

**El gag: le terminas la frase.** Gervasio no acaba sus frases; el tercer ataque se queda en el aire («para... para...») y
la R03 («Ayer no puedo. Te miro hueco para anteayer.») es a la vez la respuesta y el final de su frase. Sin línea de
reacción: el remate («Yo con Hidrovoltia no he comido en mi vida.») entra justo detrás, que es su forma de huir.

| Campo | Hoy | E6 |
|---|---|---|
| `deck` | `['R07', 'R01', 'R03', 'R05']` | igual |
| `winScore` / `finishers[0].atScore` | 2 / 2 | **3 / 3** |
| `attackText.R07` | Esto ya se... se habló. Me consta. Lo hablamos. | igual |
| `attackText.R01` | Ya se dijo en el otro correo. Ese que no se leyó... | igual |
| `attackText.R03` | El acta se necesitaba para ayer. Por alguien. No digo quién. | **El acta se necesitaba para... para...** |
| `attackText.R05` | Lo del acta, entre tú y yo. Que no salga de esta puerta. | igual (cuarta carta: solo con un fallo) |
| `hurtByPair.gervasio` | R07, R14 | igual (R03 sin línea: es el último acierto y va al remate) |
| Remate | fotocopia de la comida con Hidrovoltia | igual |

**Asaltos (camino):** R07 («A ti te consta…») → «Me consta que... Bueno. Se constaba.» · R01 («Lo leímos todos…») → su
`hurt` de hoy · R03 → remate → acta.
**Dónde se aprende:** R07 (paso 11), R01 (15), R03 (14, Gertrudis). Nada nuevo.

### 5.3 Comodín marcado
El comodín («Enviado desde mi móvil, disculpa la brevedad.») lleva en el menú la etiqueta **COMODÍN** (micro, gris,
alineada a la derecha; §6.2). Las reglas no cambian (la primera vez no cuenta; la segunda, sí). Así el jugador distingue
el comodín de las flojas (crítica §5.3).

### 5.4 Saldo de los duelos
Cadenas: +2 (N8, N9; N7 y N10 sustituyen). Camino: D2 +2 (ataque y réplica; el «...CABE.» cambia de sitio), D3 +2
(ataque y réplica) = **+4**. Reloj: ≈ +40 s.

---

## §6 · MOTOR E INTERFAZ (P0)

| # | Fichero | Cambio |
|---|---|---|
| 6.1 | `engine/duel.js` (`buildMenu`, bucle principal) | **`opp.cabe[pid]`** (`{ max, corta, noCabe }`): si la pareja `pid` está aprendida, la opción correcta se sustituye por dos: `{ text: corta, pair: pid, kind: 'reply' }` y `{ text: pair.reply, pair: pid, kind: 'larga' }` (orden: la larga primero en rondas pares, la corta en impares; la regla de ≤ 5 líneas quita señuelos antes). `info.optionPairs` da `'larga'` para la larga. Al elegir la larga: `say('player', texto)`, `api.sfx('paper')`, `S.body = MAY(texto.slice(0, max)) + '—'` durante 1.200 ms, `say('rival', noCabe)`; la primera vez por duelo (`S.largaUsada`) **no cuenta** (`continue`, como el comodín); después, fallo normal (taunt). |
| 6.2 | `engine/duel.js`, `engine/ui.js` (`drawChoice`) | Opciones como objeto `{ text, tag }`: el comodín sale con `tag: 'COMODÍN'`. `drawChoice` pinta la etiqueta en micro, `#8a8a9a`, a la derecha de la línea (si no cabe, la línea se acorta con «…»; el texto que se **dice** sigue siendo `text`). `info.options` sigue dando solo los textos (pruebas). |
| 6.3 | `engine/core.js` `pickAt` (N4) | Con `ui.verb === 'mirar'` y sin objeto en la mano, si el punto cae en la caja de Bruno (sin los 4 px de los pies) y **no** en la de otro actor, gana Bruno (`actorTarget(player)`) a cualquier objeto o salida. Con otros verbos, como hoy. El rótulo al pasar el ratón dice «Mirar a Bruno». |
| 6.4 | `engine/core.js` `pickAt` (N5) | Con `ui.verb === 'hablar'`: si el punto cae en la caja de Bruno y hay un actor cuya caja **crecida 6 px** contiene el punto, gana ese actor (el de detrás). Y `actors.js` `bruno.handlers.hablar` = el mismo que `mirar` (la meta): «Hablar con Bruno» nunca calla. |
| 6.5 | `content/rooms/pecera.js` + `actors.js` (N8) | Valentín: antes de la pregunta, `api.faceActor(V, api.player)`; tras ella, `api.sfx('click')`, `api.vestir(V, 'casco_fuera')` (variante nueva en `actors.js`: un auricular en la mano, cabeza ladeada 1 px) y `await api.sayAs(V, '…', { ms: 1400 })` (globo con puntos suspensivos: gesto, no palabra; no cuenta como línea); luego «...Nada. Perdone.» de hoy, `api.vestir(V, null)`, `sfx('click')`. Bruno se coloca a su izquierda (`walkTo` del actor) para no taparle. Si la variante no da tiempo, basta el globo «…». |
| 6.6 | `engine/core.js` `resize` (N11) | En pantallas táctiles, si la escala entera deja más de un 3 % de hueco, usar la fraccionaria también con DPR 1: la condición `coarse && dpr >= 2 && s / fit < 0.97` pasa a `coarse && s / fit < 0.97`. Escritorio, igual. |
| 6.7 | `tools/walk-lib.mjs` (I1) | En la acción `duelo`, un id de pareja elige la opción con `optionPairs[i] === id` (la corta en D2); `'larga'` nunca se elige salvo que la lista lo pida (`'R09:larga'`, para las pruebas). |

---

## §7 · RECORRIDO

### 7.1 Qué cambia
- El 28 y el 29 de E5 se funden en **28** (Hablar con la tele en la Sala): **49 pasos**. Los de después bajan uno.
- 36 (D2) con tres réplicas; 46 (D3) con tres.
- El 41 (antes 41: Sistemas) ya no oye a Evaristo: la L4 suena al entrar en Comercial (42).
- El corte de la Redacción no aparece en el camino (el apagón del paso 20 va antes del regletero).
- Coherencia: en 28, `sala_becario_sin_turno` (27) abre el árbol de la tele; en modo rápido, la escena resuelve el
  atasco por la vía del anuncio (como hoy). El Vending no se pisa en el Acto II después del 14 (E-53 ya no se oye en el
  camino: −1, contado en §9).

### 7.2 `tools/walk-data.mjs` (completo)
Cabecera: «Datos del walkthrough de la ENMIENDA E6 §7 (49 pasos): E5 + 28 (tele en la Sala, antes 28-29), 36 y 46 (duelos
de tres asaltos).»
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
  { n: 22, sala: 'cpd', txt: '[E5] Eutimio → «Ticket 0.441. El fax de Teodoro.»', acc: [['verbo', 'hablar', 'paco_ticket'], ['opcion', 'Ticket 0.441'], ['cerrar']], esp: {tiene: ['manual_fax'], flags: ['paco_dio_manual']} },
  { n: 23, sala: 'cpd', txt: 'Hablar paco → consultor (antes 22)', acc: [['verbo', 'hablar', 'paco_ticket'], ['opcion', '¿Algún cotilleo del consultor?'], ['cerrar']], esp: {flags: ['rep_12']} },
  { n: 24, sala: 'pecera', txt: 'Hablar yoli → hilo (antes 23)', acc: [['ir', 'pecera'], ['verbo', 'hablar', 'yoli_tendencias'], ['opcion', '¿Algún hilo bueno esta noche?'], ['cerrar']], esp: {flags: ['rep_08']} },
  { n: 25, sala: 'pecera', txt: 'Hablar anselmo → Yoli (antes 24)', acc: [['verbo', 'hablar', 'anselmo_monolito'], ['opcion', '¿Qué tal con Yoli?'], ['cerrar']], esp: {flags: ['rep_09']} },
  { n: 26, sala: 'sala_amazonas', txt: '[E5] Mirar orden_del_dia → el punto 3', acc: [['ir', 'sala_amazonas'], ['verbo', 'mirar', 'orden_del_dia']], esp: {flags: ['sala_amazonas_orden_visto']} },
  { n: 27, sala: 'sala_amazonas', txt: '[E5] Gervasio → «Los becarios no tienen turno»', acc: [['verbo', 'hablar', 'gervasio_acta'], ['opcion', '¿y cuáles son los siguientes pasos?'], ['cerrar']], esp: {flags: {sala_becario_sin_turno: true, reunion_terminada: false}} },
  { n: 28, sala: 'sala_amazonas', txt: '[E6] Hablar tele → «Buenas noches, Gertrudis» → «¿Y cuáles son los siguientes pasos?» → estampida (atasco: anuncio en modo rápido) (antes 28-29)', acc: [['verbo', 'hablar', 'tele_amazonas'], ['opcion', 'Buenas noches, Gertrudis.'], ['opcion', '¿Y cuáles son los siguientes pasos?']], esp: {flags: ['gertrudis_pregunta', 'reunion_terminada', 'sala_amazonas_estampida'], sala: 'sala_amazonas'} },
  { n: 29, sala: 'sala_amazonas', txt: 'Maripaz → D1 (pop-up antes del menú) (E5 30)', acc: [['verbo', 'hablar', 'maripaz_remitido'], ['opcion', 'Siestatón no ha confirmado la página 7.'], ['duelo', ['R08', 'R04', 'R11', {objeto: 'ficha_pagina_7'}]], ['cerrar']], esp: {flags: ['duelo_maripaz_ganado', 'casilla_hueco', 'bruno_con_banner'], tiene: ['ficha_pagina_7']} },
  { n: 30, sala: 'administracion', txt: 'Begoña: nota de gasto (E5 31)', acc: [['ir', 'administracion'], ['verbo', 'hablar', 'begona_triplicado'], ['opcion', 'Quiero presentar una nota de gasto.'], ['opcion', 'Café para entender el capitalismo.'], ['opcion', 'Lo que sea.'], ['opcion', 'Aquí tiene. Un sobre de azúcar. Es casi un ticket.'], ['opcion', 'Pues enséñeme cómo es una nota bien hecha'], ['cerrar']], esp: {tiene: ['fotocopia_nota_direccion', 'copias_rechazadas'], flags: ['nota_gasto_presentada'], notiene: ['sobre_azucar']} },
  { n: 31, sala: 'administracion', txt: 'Evaristo: escuchar hasta el final (E5 32)', acc: [['verbo', 'hablar', 'evaristo_salvedad'], ['opcion', '¿Para qué me ha llamado?'], ['opcion', '¿De qué trata?'], ['opcion', 'Siga.'], ['cerrar']], esp: {flags: ['evaristo_escuchado', 'rep_16']} },
  { n: 32, sala: 'catacumba', txt: 'Usar copias_rechazadas con fax (E5 33)', acc: [['ir', 'catacumba'], ['usar', 'copias_rechazadas', 'fax']], esp: {flags: ['fax_con_papel'], tiene: ['mensaje_fp'], notiene: ['copias_rechazadas']} },
  { n: 33, sala: 'catacumba', txt: 'Mirar mensaje_fp (E5 34)', acc: [['verbo', 'mirar', 'mensaje_fp']], esp: {flags: ['vio_borde_perforado']} },
  { n: 34, sala: 'catacumba', txt: 'Dar fotocopia a aurora → FUENTE (E5 35)', acc: [['dar', 'fotocopia_nota_direccion', 'aurora_galerada'], ['cerrar']], esp: {flags: ['casilla_fuente'], notiene: ['mensaje_fp'], tiene: ['fotocopia_nota_direccion']} },
  { n: 35, sala: 'catacumba', txt: 'Aurora: la coma de Evaristo → correo por fax (y quita el adhesivo) (E5 36)', acc: [['verbo', 'hablar', 'aurora_galerada'], ['opcion', 'Don Evaristo pregunta si su coma está bien.'], ['cerrar']], esp: {flags: {coma_bendecida: true, correo_evaristo_listo: true, bruno_con_banner: false}, tiene: ['correo_evaristo']} },
  { n: 36, sala: 'catacumba', txt: '[E6] Teodoro → D2: tres asaltos; R09 en la versión que cabe (E5 37)', acc: [['verbo', 'hablar', 'teodoro_cuerpodoce'], ['opcion', 'Quiero firmar en tu página 7.'], ['duelo', ['R06', 'R02', 'R09', {objeto: 'manual_fax'}]], ['cerrar']], esp: {flags: ['duelo_teodoro_ganado', 'casilla_firma']} },
  { n: 37, sala: 'pecera', txt: 'Usar ordenador_bruno (E5 38)', acc: [['ir', 'pecera'], ['verbo', 'usar', 'ordenador_bruno']], esp: {tiene: ['pieza_opa'], flags: ['pieza_escrita', 'herminia_midio']} },
  { n: 38, sala: 'catacumba', txt: 'Usar pieza_opa con fax → tecla 2 (E5 39)', acc: [['ir', 'catacumba'], ['usar', 'pieza_opa', 'fax'], ['opcion', '2: ADMINISTRACIÓN'], ['cerrar']], esp: {flags: ['pieza_recortada'], tiene: ['pieza_opa']} },
  { n: 39, sala: 'catacumba', txt: 'Dar ficha a teodoro → 7.3a (E5 40)', acc: [['dar', 'ficha_pagina_7', 'teodoro_cuerpodoce'], ['cerrar']], esp: {flags: ['pagina_cerrada', 'acto_3_iniciado'], notiene: ['ficha_pagina_7', 'pieza_opa']} },
  { n: 40, sala: 'cpd', txt: 'Redacción (momento 8) → tirar papel_continuo → 7.3 (E5 41)', acc: [['ir', 'pecera'], ['ir', 'cpd'], ['verbo', 'tirar', 'papel_continuo']], esp: {flags: ['dos_ias_vista', 'anselmo_dijo_regla', 'ruben_encontrado']} },
  { n: 41, sala: 'cpd', txt: 'Hablar ruben → discursos (E5 42)', acc: [['verbo', 'hablar', 'ruben'], ['opcion', '¿Escribiste tú los discursos de Íñigo?'], ['cerrar']], esp: {flags: ['rep_13']} },
  { n: 42, sala: 'ecosistema', txt: '[E5] Coger termometro_ventas → rotulador de objetivos (E5 43)', acc: [['ir', 'ecosistema'], ['verbo', 'coger', 'termometro_ventas']], esp: {tiene: ['rotulador_rojo']} },
  { n: 43, sala: 'eventos', txt: 'Pilar → álbum (E5 44)', acc: [['ir', 'eventos'], ['verbo', 'hablar', 'pilar_escaleta'], ['opcion', '¿Me prestas el álbum?'], ['cerrar']], esp: {tiene: ['album_eventos'], flags: ['oyo_descopear']} },
  { n: 44, sala: 'pecera', txt: '[E5] Álbum a Anselmo → «Las fotos me valen» (E4 S5 salta al entrar) (E5 45)', acc: [['ir', 'pecera'], ['dar', 'album_eventos', 'anselmo_monolito'], ['cerrar']], esp: {flags: {album_validado: true, discover_ganador: '*'}, notiene: ['album_eventos']} },
  { n: 45, sala: 'pecera', txt: '[E5] Rotulador + kanban → SALIDA EN VALOR (Bruno mueve el pósit) (E5 46)', acc: [['ir', 'pecera'], ['usar', 'rotulador_rojo', 'kanban'], ['opcion', 'SALIDA EN VALOR']], esp: {tiene: ['ticket_n1', 'rotulador_rojo'], flags: {posit_descopeado: true, ruben_libre: true, columna_kanban: 'salida'}} },
  { n: 46, sala: 'pajarera', txt: '[E6] Gervasio en la puerta → D3: tres asaltos (E5 47)', acc: [['ir', 'pajarera'], ['verbo', 'hablar', 'gervasio_acta'], ['opcion', 'Necesito el acta de la última reunión.'], ['duelo', ['R07', 'R01', 'R03', {objeto: 'fotocopia_nota_direccion'}]], ['cerrar']], esp: {flags: ['duelo_gervasio_ganado', 'sala_abierta'], tiene: ['acta_reunion'], notiene: ['fotocopia_nota_direccion']} },
  { n: 47, sala: 'pajarera', txt: 'Usar puerta_sala → 7.4 (E5 48)', acc: [['ir', 'pajarera'], ['verbo', 'usar', 'puerta_sala']], esp: {sala: 'sala_amazonas'} },
  { n: 48, sala: 'sala_amazonas', txt: 'Duelo D4 (Íñigo), tres remates (E5 49)', acc: [['duelo', ['R10', 'R12', {objeto: 'ticket_n1'}, 'R13', 'R05', {objeto: 'acta_reunion'}, 'R16', {objeto: 'correo_evaristo'}]]], esp: {flags: ['duelo_inigo_ganado'], notiene: []} },
  { n: 49, sala: 'sala_amazonas', txt: 'Empujar lector_medio → final (E5 50)', acc: [['verbo', 'empujar', 'lector_medio']], esp: {flags: ['lector_derribado', 'juego_terminado']} },
];
```

### 7.3 Ruta alternativa
```js
// E6: como E5, renumerado (Begoña y Evaristo antes de la Sala; fax y FIRMA antes de la FUENTE; en el III, acta antes del
// álbum y rotulador después: peor caso). La vía del Vending para la pregunta se prueba en extras (XE6-3).
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
export const ALT = [...range(1, 23), 30, 31, 24, 25, 26, 27, 28, 29, 32, 36, 33, 34, 35, ...range(37, 41), 46, 43, 44, 42, 45, 47, 48, 49];
```
(49 entradas, sin repetidos. D2 en el 36 tiene R06 (18), R02 (17), R09 (25) y el manual (22); D3 en el 46 tiene R07 (11),
R01 (15), R03 (14) y la fotocopia (30).)

---

## §8 · TOPES Y REGEX (`tools/plan-rules.mjs`)

```js
// ENMIENDA E6 §8 · REMATE SECO: cadena de ≥ 2 frases cuya última frase tiene 1-3 palabras y acaba en «.» o «!».
// Frase = tras [.!?…] (+ cierre »"”') y espacio, empezando por mayúscula, ¡, «, " o cifra. No cuentan las preguntas, las
// frases cortadas («...», «…») ni las cadenas de una frase. Hoy 727 de 3.591 (20,2 %); tras E6, 408 (11,4 %).
export const REMATE_SECO_RE = /[.!?…][»"”')]*\s+(?=[¡«"(]*[\p{Lu}\p{N}])[¡«"(]*(?:[\p{L}\p{N}][\p{L}\p{N}'’,%.\-]*\s*){1,3}(?:\.|!+)[»"”')]*\s*$/u;
const frasesE6 = (t) => t.trim().split(/(?<=[.!?…][»"”')]*)\s+(?=[¡¿«"(]*[\p{Lu}\p{N}])/u).filter(Boolean);
export const esRemateSeco = (t) => frasesE6(t).length >= 2 && !/(?:\.\.\.|…)[»"”')]*\s*$/.test(t) && !/\?[»"”')]*\s*$/.test(t)
  && REMATE_SECO_RE.test(t.trim());
const FUERA_MUSICA = /[\\/]music\.js$/;

// TOPES_E6_JUEGO (mismas cadenas que TOPES_E5_JUEGO, + `fuera` de music.js). `pct`: tope sobre el total de cadenas.
export const TOPES_E6_JUEGO = [
  { test: esRemateSeco, pct: 0.15, fuera: FUERA_MUSICA, txt: 'remate seco (E6 §8): ≤ 15 % de las cadenas' },          // 20,2 % → 11,4 %
  { re: /t[áa]per/i, porCadena: true, max: 15, txt: '«táper» (E6 §8)' },                                             // 32 → 14
  { re: /\b(?:19|20)\d\d\b/, porCadena: true, max: 35, fuera: FUERA_MUSICA, txt: 'año 19xx/20xx (E6 §8)' },         // 64 → 29
  { re: /Huele a 2019/, porCadena: true, max: 1, txt: '«Huele a 2019» (E6 §8)' },                                    // 3 → 1
  { re: /Diecinueve años/, porCadena: true, max: 4, txt: '«Diecinueve años» (E6 §8)' },                              // 9 → 3
  { re: /Lo que diga el Lector Medio/, porCadena: true, max: 5, txt: '«Lo que diga el Lector Medio» (E6 §8)' },      // 7 → 5
  { re: /Era solo eso/, porCadena: true, max: 4, txt: '«Era solo eso» (E6 §8)' },                                    // 7 → 3
];
// Aviso (no fallo): remate seco por fichero de sala > 20 % (salvo Eventos y los datos del titulador).
export const REMATE_SALA_AVISO = { pct: 0.20, fuera: /eventos|titulador\.datos/ };
// Sobre el CÓDIGO (sin comentarios), no sobre cadenas: «D3: No.» ≤ 6 (cuenta ['D3', 'No.'] y ['D3', '...No.']).
export const TOPES_E6_FUENTE = [
  { re: /\[\s*'D3'\s*,\s*'(?:\.\.\.)?No\.'\s*\]/g, max: 6, ficheros: /content[\\/]rooms[\\/]pecera/, txt: '«D3: No.» (E6 §8)' },   // 11 → 6
];
// Duplicados audibles: cadena > 25 caracteres en dos ficheros de SALA distintos (sin actors.js, pistas.js, duelo.js,
// escenas/climax.js ni las ramas declaradas en DUP_PERMITIDAS) → aviso.
export const DUP_PERMITIDAS = ['Bruno Pellejo. Trece con espacios. Cabe.', '¿Y cuáles son los siguientes pasos?', 'Buenas noches, Gertrudis.'];
```
Cambios en `cuentaJuego`: aceptar `test` (función) además de `re`; con `pct`, `hits.length / base > pct` falla (`base` =
cadenas del mismo filtro). `text-audit --recuento` enseña los nuevos y `--e6` los hace fallo (`test-all` pasa
`--plan --e2 --e5 --e6`). El tope de coletilla de E5 (46) sigue.

---

## §9 · SALDO Y RELOJ

### 9.1 Camino principal (recorrido de 49 pasos en modo rápido; hoy 570 cadenas medidas)
| Qué | Neto |
|---|---:|
| 28: Bruno «Buenas noches…» + Gertrudis en la tele + la pregunta; fuera E-53 al entrar en el Vending, la opción y el LCD del Vending | 0 |
| 28: «¿Necesitan ayuda?» | +1 |
| 36: D2, tercer asalto (ataque + réplica; «...CABE.» cambia de sitio) | +2 |
| 46: D3, tercer asalto (ataque + réplica) | +2 |
| 41: fuera «Eso no es un modelo. Eso es un compañero.» | −1 |
| 45: fuera «La frase con la que Íñigo despide…» (la de Brais se queda, más corta) | −1 |
| 42: L4 (4 → 4: «Era solo eso» fuera de la de Evaristo; Bruno «Se llama Brais.») | 0 |
| §4 en el camino: 34 cadenas cambian de forma, ninguna más se elimina | 0 |
| **Total** | **+3** (tope +6) |

### 9.2 Juego entero (cadenas que se dicen; menús, rótulos y pantallas no cuentan)
| Bloque | Neto |
|---|---:|
| §4: eliminadas (4.112, Herminia, 2 de Bruno de la columna y el armario, chaqueta, código de colores, grabación ×2, Diecinueve años, «En 2011», rumor de Maripaz, reloj) | −12 |
| §4.2: «D3: No.» (5 fuera; 1 sustituida) | −5 |
| Atasco: N1, N2 | +2 |
| Tele: N3, N4, N5, N6 | +4 |
| Duelos: N8, N9 | +2 |
| Apagón, rotulador, L4, titulador, interfaz | 0 |
| **Total** | **−9** (tope 0) |

### 9.3 Reloj (jugador fluido)
| | min |
|---|---:|
| Sin ida y vuelta Sala ↔ Vending (dos cruces de pasillo y una entrada con aviso) | −0,8 |
| Atasco: hasta 10 s más para quien espera; el que actúa, igual | +0,1 |
| D2 y D3, un asalto más cada uno | +0,7 |
| Titulador: la 5.ª se lee (≈ 3 s × 2 sesiones) | +0,1 |
| Corte de la Redacción (solo quien va primero al regletero) | +0,1 |
| Texto: −1 en el camino y muchas líneas más cortas | −0,1 |
| Rotulador mejor señalado (menos atasco en el Acto III) | −0,5 a −1 |
| **Neto** | **≈ −0,4 a +0,3** (tope +2) |

---

## §10 · PAQUETES (ficheros disjuntos) + integrador

**Orden:** `P0 ∥ I1` → `PA ∥ PB ∥ PC ∥ PD ∥ PE ∥ PF` → `I2`. Nada de git. Cada paquete aplica sus filas de §4 (por fichero).

| Paquete | Ficheros | Qué |
|---|---|---|
| **P0 · Motor** | `engine/duel.js`, `engine/ui.js`, `engine/core.js`; crea `tools/test-e6-motor.mjs` | §6.1 (cabe), §6.2 (etiqueta), §6.3 (N4), §6.4 (N5, parte de motor), §6.6 (N11). Prueba: duelo de demo con `cabe` (larga gratis la 1.ª vez, fallo la 2.ª), etiqueta del comodín en `info`, Mirar a Bruno sobre un hotspot (ratón real), Hablar con un actor detrás de Bruno, `resize` táctil a DPR 1 |
| **I1 · Comunes** | `content/game.js`, `items.js`, `actors.js`, `pistas.js`, `duelo.js`, `lib/movil.js`, `lib/ascensor.js`, `lib/directorio.js`; `tools/plan-rules.mjs`, `tools/walk-lib.mjs` | §4 de esos ficheros; L4 (§2.5); `hurtByPair.teodoro` (§5.1); `bruno.handlers.hablar` y variante `casco_fuera` de Valentín (§6.4-6.5); listas duplicadas de `actors.js` (§4.3); pistas `turno` y `columna` (§2.3, §2.9); §8; §6.7 |
| **PA · Sala** | `content/rooms/sala_amazonas.js`, `art/sala_amazonas.art.js`, `content/rooms/office.js` | §2.2, §2.3 (árbol `tele_sala`, `hablarTele`, `teleGertrudis({ sintonizada })`), Mirar de Mercados en el atasco; §4 de los dos ficheros |
| **PB · Redacción** | `content/rooms/pecera.js`, `pecera.escenas.js`, `pecera.dialogos.js`, `pecera.secretaria.js`, `art/pecera.art.js` | §2.1.4 (`cmsVivo` con Yoli), §2.5.1, §2.6 (B1, B2, B6, B7), §2.9.2-3, §6.5, §4.2 (coro) y §4 de esos ficheros |
| **PC · Sistemas y Vestíbulo** | `content/rooms/cpd.js`, `art/cpd.art.js`, `content/rooms/vestibulo.js` | §2.1 (corte, `planoRedaccionOscuras`), B8; §4 |
| **PD · Papel y Despachos** | `content/rooms/catacumba.js`, `content/rooms/pajarera.js` | §5.1 y §5.2 (bloques `duels`), B4, B5; §4 |
| **PE · Planta 2** | `content/rooms/ecosistema.js`, `ecosistema.dialogos.js`, `administracion.js`, `administracion.dialogos.js`, `art/ecosistema.art.js` | §2.9.1 (termómetro y cordel), B9; §4 |
| **PF · Titulador** | `content/rooms/pecera.titulador.js` | §2.7 (solo lógica y dibujo del pie) |
| **I2 · Integración** | `tools/walk-data.mjs`, `extras.mjs`, `fuzz.mjs`, `play-mouse.mjs`, `walkthrough.mjs`, `test-*.mjs` existentes, `test-all.mjs`; crea `tools/test-e6.mjs`; `docs/guion2-impl/GUIA_AUTORES.md` (sección E6), `docs/CONTENT_SCHEMA.md` (`cabe`, `tag`) | §7, §11; `text-audit --estatico --plan --e2 --e5 --e6 --recuento` en verde; capturas `tools/shots/e6-*.png` (corte, atasco, tele, D2 con la larga cortada, pie del titulador, Valentín) |

Dependencias: PD usa 6.1; PA usa nada del motor nuevo; PB usa la variante de I1; PC exporta o copia `PLIN`.

---

## §11 · PRUEBAS

### 11.1 Se rompen a propósito (comprobado con grep en `tools/`) y cómo quedan
| Prueba | Qué se rompe | Cómo queda |
|---|---|---|
| `walk-data`, `walkthrough` (y `--alt`) | 50 pasos; 28-29; D2 y D3 | 49 (§7) |
| `play-mouse.mjs` | paso 28 en el Vending; espera de 10 s del atasco | paso 28 con clic en la tele y en las dos opciones; Empujar a Fermín tras «¿Necesitan ayuda?» |
| `fuzz.mjs` | puntos de guardado 27-29 | 27-28; añadir «Hablar tele» suelto |
| `extras.mjs` | XE5-1…4 (atasco: la vía `anuncio` por espera pasa a 20 s); «Para apuntar lo que me digan. Sin grabadora.»; L4 | esperas de 21 s; texto nuevo; L4 tras `ruben_encontrado`. Nuevos: XE6-1 corte de la Redacción (regletero sin apagón), XE6-2 camino del registro con Yoli, XE6-3 la vía del Vending entera, XE6-4 D2 con la larga dos veces (gratis/fallo), XE6-5 «Nada, gracias.» en la tele |
| `smoke.mjs` | defectos de `game.js` («acceso restringido», «No forzar»), L3 («Era solo eso»), `atScore`, L4, Valentín | textos de §4; `atScore: 3`; Valentín con globo «…» |
| `test-comedia-p1.mjs` | murmullo de Celestino, «En 2011…», «Herramientas…», «Cuarenta y ocho mil. Con coma…», L4, Valentín | textos de §4 y §2.6 |
| `test-comedia-p2.mjs` | 24 cadenas de la Redacción (Leoncio, Anselmo, Yoli, Herminia «Me ha entendido…») | textos de §4 |
| `test-comedia-p3.mjs` | «Diecinueve años esperando cosas…», «¡Au!…», «Pellejo, con jota…», «…desde 2009.», «Le he mirado el reloj…», mazo de D2 | textos de §4; D2 con R09 |
| `test-comedia-p4.mjs` | «Se ve demasiado…», «Tadeo no lo ha leído…», «Línea nueve…», `gertrudis_pregunta`, comodín | textos; la pregunta puede llegar por la tele |
| `test-e4.mjs` | «Esa ya está vieja…», «Lo más leído…», quinta publicación | textos; tras la 5.ª, `choose(['Dejarlo'])` |
| `test-e5-pa.mjs` | «Lo que diga el Lector Medio.» (grabación), atasco a 10 s | 20 s; la grabación ya no la comenta Gervasio |
| `test-e5-pc.mjs` | «Pone «NUNCA»…» | texto de §4 |
| `test-e5-pd.mjs` | «No. Íñigo los tiene contados…», «Ese correo se contesta…», «Diecinueve años. Ni un marrón…» | textos de §4 |
| `test-e5-pe.mjs` | «Línea nueve…», «Rojo hasta el 98 %…», sobre de azúcar | textos de §4 |
| `test-e5.mjs` | medida del camino principal (§9.1 de E5) | 573 (570 + 3) |
| `test-fase0.mjs` | «El del mostrador siempre está mascando algo. Pídeselo.» | texto de §4 |
| `test-critica3.mjs`, `test-e5-motor.mjs`, `test-motor.mjs` | `pickAt` con verbo Mirar sobre Bruno | Mirar sobre Bruno + hotspot → Bruno (antes, el hotspot) |
| `test-movil.mjs` | táctil a DPR 1 | el lienzo ocupa ≥ 97 % del alto en 844 × 390 |
| `text-audit` | topes nuevos | §8 |

### 11.2 Nuevas (`tools/test-e6.mjs`, ratón real donde dice «clic»)
1. **Apagón siempre:** partida en el 19 sin tirar del enchufe → Sistemas, clic en el regletero, R-3 → plano «MIENTRAS, EN
   LA REDACCIÓN», las dos de Yoli, coro, `cms_vivo`, `cpd_corte_visto`. Con `apagon_n` = 1, sin plano. Con `vio_ticket_3`
   y Tirar enchufe, Yoli dice sus dos líneas. Captura.
2. **Atasco:** tras la estampida, «¿Necesitan ayuda?» en el log, control devuelto; Mirar a Jacinto → N2; a los 19 s sigue
   el atasco; a los 21 s, anuncio. Las otras tres vías con clic.
3. **Tele:** con «sin turno», clic Hablar tele → «Buenas noches, Gertrudis.» → N3 → la pregunta → escena y atasco; ningún
   cambio de sala. Con `gertrudis_pregunta` desde el Vending: Hablar tele → escena sin árbol. Antes de Gervasio: sin árbol.
4. **D2:** el menú del tercer ataque trae la larga y la corta; la larga la 1.ª vez no suma fallo y el cuerpo enseña el
   corte; la corta gana y suena «...CABE.»; marcador «ACIERTOS 3/3».
5. **D3:** tercer ataque «El acta se necesitaba para... para...»; R03 gana; remate.
6. **Armario:** en 41 no hay «compañero» ni «atunes»; en 42, «Se llama Brais.».
7. **Columna:** sin «despide a la gente»; Brais «SEGUIREMOS INFORMANDO.».
8. **Titulador:** cinco publicaciones con clic; 3 s después el plano sigue abierto; pie «LA CASA: 312.000»; con el secreto,
   «· TÚ».
9. **Rotulador:** Mirar termómetro (cordel); con el álbum validado y sin rotulador, Usar kanban → habla Anselmo; abuela
   nivel 1 de `columna` contiene «rotulador».
10. **Interfaz:** Mirar + clic en Bruno sobre la cinta → meta; Hablar + clic en Leoncio tapado → árbol de Leoncio;
    Valentín: globo «…» y variante; menú de D1 con la etiqueta COMODÍN.
11. **Medida:** `esRemateSeco` ≤ 15 % en todo el juego; los topes de §8; camino principal = 573 ± 2.

---

## §12 · DECISIONES PARA EL DUEÑO

1. **Gervasio y Teodoro a 3 asaltos** (no Gervasio a 2: ya tiene 2 en el código; la crítica contó 1). Si se prefiere
   comedido de verdad, Gervasio puede quedarse en 2 y llevarse solo el ataque a medias (cambiar R07 o R01 por la versión
   «para... para...»).
2. **La línea «¿Necesitan ayuda?»** o solo gesto (los tres se giran hacia Bruno). Recomiendo la línea: es la única pista
   inequívoca de que se puede actuar.
3. **El remate seco al 11,4 %**: deja margen para que la contra devuelva hasta ≈ 130 remates que sean voz. Si el dueño
   prefiere menos cambios de texto, se puede aplicar solo §4 de salas de paso y respuestas por defecto (≈ 15 %).
4. **El récord de la casa** es el «clásico de las siete» (312.000) y solo lo bate el secreto del Euríbor (576.000). Si se
   quiere una meta alcanzable sin el secreto, usar el tercero (291.600) como «casa».
5. **Valentín**: globo «…» (gesto) frente a mudo del todo. El dueño pidió cameo mudo; «…» no es palabra, pero lo marco.
