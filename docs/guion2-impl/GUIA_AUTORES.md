# Guía para los autores de sala — reescritura de comedia (paquetes P1-P4)

> Paquete común (P0) entregado. Esta guía es la lista de comprobación de los cuatro guionistas-implementadores que
> reescriben las salas según `docs/guion2/PLAN_COMEDIA.md` (con su **ENMIENDA E1**). Referencia técnica completa:
> `docs/CONTENT_SCHEMA.md` (§2.4 ambiente, §7 API, §10 duelos). Demo de todo lo nuevo: `tools/demo-fase0.js`.

## 0. Reparto (ENMIENDA E1 de la dirección)

- **Leoncio y Anselmo se quedan como personajes con voz** (árbol, murmullos, líneas). No se borran ni se funden con
  Nemesio; donde el plan diga «fuera Leoncio/Anselmo», manda la enmienda.
- **Herminia pasa a OBJETO**: el portátil de Leoncio (`herminia_portatil`). Puede enseñar texto en su pantalla
  (`api.sayFrom('herminia_portatil', …)` o un estado de dibujo), pero **no tiene árbol ni habla como personaje**
  (nada de `api.sayAs('herminia', …)`). El actor `herminia` sigue declarado en `actors.js` hasta que el paquete que la
  usa la deje sin líneas; después se retira (pedidlo al paquete común).
- Lo demás del reparto (§2.1 del plan) vale como está escrito.

## 1. Lo que NO podéis tocar

Archivos compartidos (paquete común; si necesitáis algo, se pide, no se edita):
`engine/*`, `content/game.js`, `content/actors.js`, `content/items.js`, `content/flags.js`, `content/duelo.js`,
`content/pistas.js`, `content/music.js`, `content/index.js`, `content/lib/*` (incluidos `movil.js`, `ascensor.js`,
`celestino.js`), `tools/walk-data.mjs`, `tools/walk-lib.mjs`, `tools/extras.mjs`, `tools/plan-rules.mjs`,
`tools/text-audit.mjs`, `tools/test-fase0.mjs`, `docs/CONTENT_SCHEMA.md`, `docs/guion2/*`.

Cada paquete edita **solo** sus archivos de sala (§11 del plan) y su `tools/test-paquete-*.mjs`. El bloque de datos
del duelo de vuestra sala (`duels: { … }`) es vuestro: el paquete común solo le ha añadido `cc1`, `defeatLine` y
`defeatHeadline` (los textos de §7.4 y §7.7).

## 2. APIs que debéis usar (en vez de inventar la vuestra)

### Objetivo (§8.1-8.2) — normalmente no tenéis que hacer nada
- Cada objetivo de `content/pistas.js` se da por hecho con **su flag** (`torno_abierto`, `silla_libre`, `cms_vivo`,
  `reunion_terminada`, `casilla_hueco`, `pieza_recortada`, `ruben_libre`, `sala_abierta`…). Si vuestra sala pone ese
  flag, la ficha, «Mirar a Bruno», la abuela y la hora se actualizan solas.
- Si un hito no tiene flag propio: `api.objetivo.marcar('<id>')`. Consultas: `api.objetivo.hecho(id)`,
  `api.objetivo.actual()`, `api.objetivo.meta()`.
- La ficha viva (`ficha_pagina_7`) y «Mirar a Bruno» ya dicen los textos del plan. No los dupliquéis en la sala.

### Pistas de la abuela (§8.5)
- Están TODAS en `content/pistas.js` (tres niveles por objetivo, extras). La llamada la hace el móvil. No escribáis
  pistas en vuestras salas. Si una pista no casa con vuestro texto nuevo, pedid el cambio al paquete común.
- Las salas de cada objetivo (`salas`) usan los ids de sala actuales; si una escena cambia de sala (D1 en la Sala
  Amazonas, Gervasio en los Despachos), avisad para ajustar `salas`.

### Hora (§8.4)
- El móvil marca la hora de la historia (18:30 → 21:00 por hitos): `api.hora()`.
- **Los relojes del edificio siguen parados en las 20:59** (es un chiste): pintadlos con `wallClock` (20:59 por
  defecto) y no los cambiéis.
- Cualquier «Son las…» que no sea un reloj de pared: `` `Son las ${api.hora()}.` ``. Begoña («Aquí siempre son las
  19:07») y los relojes parados son chistes y se quedan.
- Para que el móvil marque 20:59 al entrar en el clímax basta con el flag de siempre (`sala_amazonas_climax_visto`)
  o `climax_entrada` (P4).

### Ambiente (§5.14, coro de Desarrollo y cualquier `ambient`)
- Dad **solo las líneas**; el motor decide cuándo (60-120 s, máx. 3 por visita, nunca encima de un globo, menú,
  aviso, móvil, plano detalle o duelo; si Bruno empieza a hablar, la discusión se corta y espera):
  ```js
  ambient: [{ id: 'coro', if: '!lector_derribado', voces: { D1: { from: 'coro_desarrollo', prefijo: 'D1: ' }, … },
              discusiones: [ [['D1', '¡Se ha caído el CMS!'], ['D2', '¡Hay que levantarlo!']], … ] }],
  ```
  Orden fijo y, al acabar la lista, silencio el resto de la partida (`orden: 'rotar'` para que vuelva a empezar).
  Reglas propias de la sala: `ambientRules: { max: 3, every: [60000, 120000] }`. **Fuera los `setInterval`** y los
  `every` cortos.

### Duelo (§7) — el motor ya hace las reglas
- Menú ≤ 5 (correcta + señuelos + 1 floja que rota), ataque escrito en la ventana, marcador «ACIERTOS 2/3 · FALLOS
  1/3», CC que crece, la floja se contesta siempre, revancha que empieza por la carta que ganó, sin autoguardado.
- Lo vuestro, en el bloque `duels.<id>`: `attackText` (las paráfrasis de §7.4), `intro`, `taunt` (§7.5), `hurt`,
  `hurtByPair` propio si queréis (los de §7.6 ya están en `content/duelo.js`), `finishers` (remates), `onWin`, y la
  **derrota**: `defeatLine` (ya puesta), `defeatScene: '<escena>'` (la consecuencia cómica, ≤ 6 líneas, < 15 s; recibe
  `{ duel, perdidos, ctl }` para escalar con la 2.ª y 3.ª derrota) y `defeatHeadline` (ya puesto; quitadlo en D4).
- `onHit(api, duel, pareja)` si una pareja concreta tiene consecuencia en la sala.
- Las parejas R03, R04, R09, R12, R14, R15 ya tienen la réplica nueva en `content/duelo.js`: **la línea de vuestra
  sala que enseña cada réplica debe citar el texto nuevo** (lista en §5).

### Efectos de situación (§4) — genéricos, con demo
| Momento | API |
|---|---|
| Ramírez ha vuelto (4.3) | `Usar chaqueta_ramirez` ya pone `bruno_con_chaqueta` y Bruno sale con la chaqueta (actors.js `con_chaqueta`). En sala: leer el flag. `api.vestir(id, variante)` para otras variantes |
| El apagón (4.2) | `await api.apagon({ ms: 3000, spots: [[x, y, rx, ry]] })` (vuelve la luz sola; `api.apagon(false)`) |
| Los siguientes pasos (4.4) | `await api.estampida(['mercados_1', 'mercados_2', 'mercados_3'], { puerta: [x, y], enAtasco: async (api) => {…} })` (los tres actores de Mercados se piden al paquete común en `actors.js`) |
| Celestino narra (4.7) | `import { narrarHito } from '../lib/celestino.js'`; en el Vestíbulo: `await narrarHito(api)`; la megafonía del ascensor ya lo hace; voz por un altavoz: `api.megafonia('celestino', texto)` |
| La cafetera viral (4.1) | `api.viral({ avisos: [...], contador: [3418, 11302], etiqueta: 'en directo' })` |
| Dos titulares (4.6) | `await api.titular('UN BECARIO VIVE EN UN ARMARIO…', { who: 'ruben' })` (franja de titular; Bruno contagiado: sin `who`) |
| Final (§9) | `await api.tarjeta({ titulo: 'FE DE ERRATAS', lineas: [...], minMs: 6000 })` y después `api.ending({ credits })`; nada más tras los créditos |

### Movimiento (la Redacción de 1.270 px)
Ya está en el motor: doble clic en una salida = salir ya; doble clic en el suelo = correr; mantener pulsado = seguir
al puntero. Vuestros paseos de guion (`api.walkTo`, `api.walkActor`) no cambian. Un PNJ que paseéis con un guion no
bloqueante se para solo mientras el jugador le apunta.

## 3. Reglas de texto (las comprueba `tools/text-audit.mjs`)
- ≤ 80 caracteres por línea; «¿ ¡» de apertura; nombres con tilde.
- **Ningún remate «… Como X.»** (§6.1); palabras vetadas a la vista: Pecera, Catacumba, Pajarera, Office, Ecosistema,
  CPD, Consejo, «director del periódico», LCP, Core Web Vitals, INP (§12.2).
- Topes de muletilla por personaje (§2.4): «cariño» de Maripaz ≤ 8, «Lo hablamos» de Gervasio ≤ 5, «Diseño» ≤ 11 en
  todo el juego, etc. (`tools/plan-rules.mjs` `TOPES`). Por ahora son **avisos**; cuando todos los paquetes hayan
  entregado, el integrador pasará `--plan` y contarán como fallo.

## 4. Cómo probar vuestra sala
```
node tools/check.mjs                                 # ids, flags declarados, salidas, líneas > 80
node tools/text-audit.mjs --estatico --sala=pecera   # «Como…» y palabras vetadas de vuestros archivos (segundos)
node tools/test-all.mjs --sala=pecera                # todo lo que toca a esa sala (motor, geometría, fuzz, walkthroughs…)
node tools/test-paquete-b.mjs                        # vuestro test de paquete (actualizadlo con lo nuevo)
node tools/sala.mjs pecera                           # vista previa de la sala en todos los actos
node tools/test-fase0.mjs                            # los sistemas comunes (no debería romperse por vuestra sala)
```
Los walkthroughs (`walkthrough.mjs`, `extras.mjs`) usan los datos de hoy hasta que el integrador ponga los de §3.2 del
plan: si vuestro cambio rompe un paso antiguo a propósito, anotadlo en vuestra entrega para el integrador.
Flags nuevos de §3.4 ya declarados en `content/flags.js` (`cafetera_viral`, `apagon_n`, `bruno_con_chaqueta`,
`mercados_huido`, `taper_dado`, `teodoro_intentos_n`, `fax_tecla_n`, `climax_entrada`…). Si necesitáis otro que cruce de
sala, se pide; los locales, con el prefijo de vuestra sala en `flags` de la lógica.

## 5. Pendientes del paquete común que caen en vuestras salas (crítica y plan)
| Sala / archivo | Qué | Paquete |
|---|---|---|
| `cpd.js` (Paco, P3) | Cita la réplica vieja de R12 («…no pasa la ITV»): ahora es «Puestas. Ahora se ve perfectamente que no hay carretera.» | P1 |
| `ecosistema.js` (portátil de Tadeo) | Cita la vieja R15 («Normal. Se lo has preguntado tú»): ahora es «Lo sé. Me lo ha contado ella. Se llama Rubén.» (y se aprende con Rubén, §7.3) | P4 / P1 |
| `office.js` | Chismes de Gertrudis que enseñan R03, R04, R10, R14: deben citar las réplicas nuevas; segundo café inútil (crítica §9.5) | P3 |
| `pecera.js` | Coro cada 14-24 s con `setInterval`/`every` (ya lo limita el motor; reducir a las 4 discusiones); el ascensor nombra a Valentín antes de conocerle (crítica §5); «Pecera» a la vista | P2 |
| `pecera.dialogos.js` | «Es lo más bonito…» ×2 (crítica §10.1.11); árbol de Valentín | P2 |
| `eventos.js` | «la Pecera» en boca de Bruno (aro de luz, §6.3) | P4 |
| `catacumba.js` | «Novecientas páginas» (el móvil ya dice «página 1 de 900»); coger los bolis sin texto (crítica §10.1.12) | P3 |
| `sala_amazonas.js` | Estampida invisible y planillo sin señal (crítica §10.1.8) → §4.4 con `api.estampida` | P4 |
| Todas | Los remates «Como…» y palabras vetadas que lista `node tools/text-audit.mjs --estatico` | todas |
| `content/lib/movil.js`, `RV_TADEO` | De cinco a tres RV sin siglas (§5.16): lo hace el integrador junto con `walk-data`/`extras` (cambian los contadores) | integrador |

---

## E2. ENMIENDA E2 — lo que el paquete común (P0) ya ha dejado hecho para los paquetes de sala

> Guion vigente: `docs/guion2/ENMIENDA_E2.md` (revisión 2; prevalece sobre el plan y E1). Reparto de ficheros: §11 de E2.
> Cada paquete edita SOLO sus salas y su `tools/test-comedia-p<n>.mjs`. En `actors.js`, `items.js` y `flags.js`,
> **solo P0** (E2 §11): si os falta algo, pedidlo; no lo añadáis vosotros.

### E2.1 APIs nuevas (con ejemplo; demo en `tools/demo-fase0.js`, prueba en `tools/test-fase0.mjs`)

| Qué (E2) | API | Ejemplo |
|---|---|---|
| Despedidas una sola vez (§7.2) | **Automático** en `engine/dialog.js`: una opción `exit: true` se oye entera la 1.ª vez que se elige (marca por árbol y opción: `despedida_oida:<árbol>.<id o texto>`); las siguientes cierran en silencio y su `do` se ejecuta igual (las líneas que diga, calladas). `siempre: true` en la opción (o `despedidasSiempre: true` en el árbol) para que se oiga siempre | `{ text: 'Me voy.', exit: true, do: async (api) => { gong(api); await api.sayAs(MP, '¿Seguro que quieres salir? Era una pregunta. Y un anuncio.'); } }` → la 2.ª vez suena el gong y no se dice nada |
| Pop-up de la X menguante (§4.2.1) | `api.detalle({ …, cerrarX: px })`: el motor pinta la «×» de `px` (3 = aspa en un cuadradito; 1 = un punto; 0 = sin X) encima de vuestro dibujo | `const n = api.inc('maripaz_popup_n');`<br>`await api.detalle({ titulo: 'PUBLICIDAD', w: 150, h: 60, draw: popupComercial, cerrarX: n === 1 ? 3 : n === 2 ? 1 : 0, ...(n >= 3 ? { cuenta: { ms: 3000, texto: 'Podrá cerrar en {n}' } } : {}) }, n < 3 ? async (api) => { … líneas de §4.2.1 … } : undefined);` |
| Anuncio antes de entrar (§4.2.4) | `api.detalle({ …, cuenta: { ms, texto, fin }, ms })`: cuenta atrás pintada por el motor («Podrá continuar en 5… 1», luego `fin`); el clic NO lo cierra antes de `cuenta.ms` (`bloqueo`); Esc y el modo rápido, sí | `await api.detalle({ titulo: 'ANUNCIO', w: 200, h: 70, draw: interstitialComercial, ms: 5200, cuenta: { ms: 5000, texto: 'Podrá continuar en {n}', fin: 'Saltar anuncio ›' } });` |
| Ayudas de dibujo de anuncios | `import { cuentaAtras, dibujarX } from '../../engine/detalle.js'` (si vuestro dibujo quiere su propia cuenta o más X) | `drawText(g, String(cuentaAtras(t, 5000)), …)` |
| Pantalla de Herminia (§2.2) | `api.pantalla(objeto, texto | [líneas], opts?)`: como `sayFrom`, con el prefijo y el color registrados en `content/game.js` → `pantallas` (`herminia_portatil` → «HERMINIA (IA) › », #FF8C3C). Un texto que ya empieza por «›» no duplica el signo | `await api.pantalla('herminia_portatil', 'tu pieza · 31 líneas · hueco de la página 7: 23 · sobra: 26 %');` → «HERMINIA (IA) › tu pieza · …». En `pecera.voces.js` (P2): `'H'` → `api.pantalla('herminia_portatil', text, opts)` y fuera `PORTATIL` |
| Aro de Borja / vídeo de Comercial (§3, §4.4) | `api.pantalla('aro_borja', 'Publicando: …')` (#4FD8E8, sin prefijo), `api.pantalla('eventos_a_ecosistema', …)` desde Eventos (§3.5), `api.pantalla('pantalla_comercial', '¡COLCHONES SIESTATÓN! …')` (#FF8A60). El objeto tiene que existir en vuestra sala | — |
| Adhesivo en la espalda (§4.2.3) | **Automático** por flag: `api.setFlag('bruno_con_banner', true)` (P4, al ganar D1) → Bruno lleva el adhesivo (variante `con_banner`; con la chaqueta de Ramírez, `con_chaqueta_banner`: chaqueta + adhesivo). Se ve de espaldas y de perfil. P3 lo quita: `api.setFlag('bruno_con_banner', false)` | No uséis `api.vestir` para esto (un `vestir` explícito manda sobre el flag) |
| Número con punto de miles (§9 B10) | `import { miles } from '../lib/kit.js'` | `` `${miles(n)}. Es tu número…` `` (48531 → «48.531»; también 1.234) |
| Gong de Maripaz | ya existe: `import { gong } from '../escenas/planta_noble.js'` (`gong(api)`); el mazo en la mesa, `api.sfx('hit')` | — |

`__game.state().detalle` da ahora `{ titulo, cerrarX, cuenta, bloqueado }` para vuestras pruebas. Al abrirse un plano detalle se cortan los
murmullos y el ambiente que estuvieran en pantalla (nada habla por debajo del anuncio).

### E2.2 Datos comunes ya cambiados (no los dupliquéis en la sala)

- **Llamadas de Evaristo** (`content/game.js`, §5.7): L1 recortada (7 líneas, §7.4 paso 10), L3 nueva (sin la coma de
  4,15 €), L4 con `!ruben_encontrado` (se pierde si Rubén aparece antes), L5 nueva con `ruben_libre` y
  `!climax_entrada`. **Fuera la L2 y la LC** (`evaristo_lc`). Una llamada por entrada, como siempre.
- **RV de Tadeo** (§7.4, paso 13): ya **no son aviso**; llegan solos al correo del móvil (`tadeo_rv_n` cuenta los
  llegados). RV1 y RV2 sin comentario de Bruno (§7.2). El portátil de Tadeo (P4) sigue igual.
- **Correo del móvil** (`lib/movil.js`): «Sin leer. El acceso «en 24 horas» sigue en camino.» (§8).
- **Celestino narra** (`lib/celestino.js`): fuera los hitos de `cms_vivo`, `casilla_hueco` y `pieza_recortada` (§7.4).
- **Objeto nuevo `correo_evaristo`** (`items.js`, §5.3): icono, Mirar, Dar a Begoña / Aurora / Íñigo (si el PNJ no está,
  lo dice Bruno) y `dar:*` «Lo guardo. Evaristo dijo «en el momento oportuno». Y no es este.». Lo da **P3** en el paso
  32 con `api.give('correo_evaristo')`; lo pide **P4** en el remate C de D4 (`object: 'correo_evaristo'`). Los «Dar» a
  Anselmo y a Maripaz (§2.5, §4.4) van en sus salas (`'dar:correo_evaristo'` en el PNJ, que manda sobre el del objeto).
- **Ficha viva** (`items.js`): L34 (hueco y pieza) y las tres notas a lápiz de la coma (§10.4). «Mi exclusiva…» dice
  «El hueco tiene veintitrés».
- **Chaqueta de Ramírez**: «Me queda grande. De hombros y de cargo.» (§7.2).
- **Pistas** (`pistas.js`, §10.3): objetivos nuevos `coma` (hecho `evaristo_escuchado`; salas administracion,
  ecosistema) y `bendicion` (hecho `coma_bendecida`; catacumba); cambios en `hueco`, `baja` (Anselmo), `inigo` (tres
  remates + extra sin correo) y `recorte` («Y es lista.»). «Mirar a Bruno» dice sus metas.
- **Duelo** (`duelo.js`): `hurtByPair.maripaz` (R08, R11) y la floja «por escrito» de Maripaz (§4.3, sin «(*…)» ni
  «Me lo apunto»). R16 se aprende en E_REVELA (paso 28). **Los mazos son vuestros**: D2 `['R06', 'R02', 'R09']` remate
  en `atScore: 2` (P3), D3 `['R07', 'R01', 'R03', 'R05']` remate en `atScore: 2` (P2), D4 de §5.5 (P4).
- **Actores** (`actors.js`): murmullos de Maripaz (§4.4), Leoncio y Anselmo (§2.5, Anselmo hereda «Mañana es sábado…»)
  y Yoli sin cifras (L29); variantes `con_banner` / `con_chaqueta_banner` de Bruno.

### E2.3 Quién ya no existe y cómo referirse a su sustituto

| Ya no existe | Sustituto | Notas |
|---|---|---|
| Nemesio (`nerea_backlog`, árbol `nerea`) | **Anselmo** (`anselmo_monolito`, árbol `anselmo` con `AN_ALBUM_INTRO`, `AN_ALBUM`, `AN_SALIDA`) | El id `nerea_backlog` sigue declarado en `actors.js` **solo** para que la Redacción y el recorrido de 42 pasos no se rompan: `// [E2: retirar en integración]`. P2 lo quita de `pecera.js` (actors, arte, diálogos); P1 y P3 dejan de nombrarlo (§2.6.5, §5.4) |
| Borja (`borja_engagement`, árbol `borja`) | **El aro de luz con su móvil** (`aro_borja`, objeto de Marketing de P4; voz con `api.pantalla('aro_borja', …)`) y, desde Eventos, `api.pantalla('eventos_a_ecosistema', …)` | Declarado aún en `actors.js` con `// [E2: retirar en integración]` (Marketing, Eventos y el extra X17 lo usan). En créditos: «el móvil de Borja» |
| La llamada L2 y la LC de Evaristo | Begoña le manda a Controlling (paso 27, P3); Aurora y el fax (paso 32, P3) | `evaristo_convoco` y `evaristo_lc` quedan sin poner; `game.js` pone `evaristo_convoco` con `acto_2_iniciado` mientras Administración lo lea (**puente**, `// [E2: retirar en integración]`) |
| «PORTÁTIL: ›» | «HERMINIA (IA) › » vía `api.pantalla` | tope 0 de «PORTÁTIL:» |
| Rumor A (`rumor_firma_n`, `planta_oyo`) | — (fase B (1)) | Siguen declarados hasta que nadie los lea; en `game.js` `FLAGS_E2_PENDIENTES` para borrarlos de las partidas en la integración |

### E2.4 Flags cruzados (§10.2; todos declarados ya en `content/flags.js`, con su valor inicial en `startFlags`)

| Flag | Lo pone | Lo lee |
|---|---|---|
| `evaristo_escuchado`, `rep_16` | P3 · administracion · E_REVELA (paso 28) | P3 (Aurora, paso 32), P0 (pistas, ficha), P1 (armario, §5.4) |
| `coma_bendecida`, `correo_evaristo_listo` + objeto `correo_evaristo` | P3 · catacumba · paso 32 (los tres a la vez) | P4 (clímax, remate C), P3 (E0 «¿Ha enviado ya el correo?»), P2 (titular), P0 (ficha, pistas) |
| `bruno_con_banner` | P4 · sala_amazonas · gana D1 (→ true); P3 · Aurora (→ false) | P0 (sprite), P2 (Yoli, Gervasio, una vez cada uno), P3 (Aurora) |
| `oyo_descopear` | P4 · eventos · el móvil de Borja dice «descopear» (§3.5) | P2 (AN_ALBUM, vía 4) |
| `posit_descopeado`, `ticket_n1`, `ruben_libre` | P2 · pecera · AN_SALIDA (paso 40) | P1, P4, P0 (hora, pistas) |
| `office_error_n` | P3 · office · L17 | P3 |
| `aro_borja_hablar_n`, `aro_borja_mirar_n`, `maripaz_empujon_n`, `maripaz_popup_n`, `ecosistema_interstitial`, `pantalla_comercial_n` | P4 | P4 |

Estos seis últimos son **globales** (declarados en `flags.js`): no los volváis a declarar como locales de sala
(`check.mjs` da error si un flag local ya es global).

### E2.5 Reglas de texto nuevas (avisos hasta la integración)

`node tools/text-audit.mjs --estatico` enseña, además de lo de siempre, un bloque **ENMIENDA E2** que **no cuenta como
fallo** (ni con `--plan`) hasta que el integrador pase `--e2`:
- en todo el juego (todas las cadenas de `content/`): «desde [fecha]» ≤ 6, «cariño» ≤ 14, «(*» = 0, «interstitial» ≤ 2,
  «pop-up» ≤ 8, «Emoji de fuego» ≤ 8, «PORTÁTIL:» = 0, «Diseño» ≤ 11;
- por personaje (en la partida automática): «Me la/lo apunto» de Bruno = 0; Anselmo «mis sistemas» ≤ 5, «próxima
  versión» ≤ 4, «¿De dónde viene/n?» ≤ 4; Leoncio «Yo ya no» ≤ 2; Maripaz M1 ≤ 5, M2 ≤ 4, M3 ≤ 3, M4 ≤ 3;
- §7.6: opciones del menú principal sin `once`, sin `if`, sin `exit` y fuera de la lista de repetibles
  (`REPETIBLES_E2` en `tools/plan-rules.mjs`).
El tope «cariño» de Maripaz en `TOPES` (este sí cuenta con `--plan`) sube de 8 a 14 (E2 §4.1).

### E2.6 Pruebas que se rompen a propósito hasta la integración

- `tools/walk-data.mjs`, `walkthrough.mjs`, `extras.mjs`, `fuzz.mjs`, `play-mouse.mjs` y `text-audit.mjs` siguen con
  el recorrido de **42 pasos** (el de 44 lo pone el integrador cuando las cuatro salas existan, §10.1). Pasos antiguos
  que se romperán por vuestros cambios, y es esperable (anotadlo en vuestro informe):
  - 24 y 38 (`nerea_backlog`) → nuevos 24 y 40 con `anselmo_monolito` (P2);
  - 26 (opción «La página 7 está pendiente desde marzo.») → «Siestatón no ha confirmado la página 7.» (P4; también
    `fuzz.mjs` y el extra XM7);
  - 31 (D2 con R03) → 33 sin R03 (P3); 39 (D3 con R14) → 41 sin R14 (P2); 41 (D4) → 43 con el tercer remate (P4);
  - extras X17 (Borja), XE1 (`PORTÁTIL: ›`), X9 (`bandeja_diseno` de Nemesio), X19 (cuatro «Siga») y los de rumor A
    (X3, —14, X25) cuando quitéis la cadena A.
- Ya ajustados por P0 (cambios deliberados del paquete común): `extras.mjs` XM2 (sin L2: `evaristo_llamadas: 1`),
  —LC (ya no hay LC), X11 (sin hito del apagón: `rejilla_n: 2`), —38 (`evaristo_llamadas: 2`); `smoke.mjs` (avisos de
  E2); `test-fase0.mjs` (ficha, hito del ascensor, estampida con Anselmo y la sección E2).
- Los `test-comedia-p<n>.mjs` son vuestros: los que comprueban textos que E2 cambia (p. ej. P2 con «PORTÁTIL: ›» y
  Nemesio, P3 con «E-31», P4 con «desde marzo») tendréis que actualizarlos.

### E2.7 Lo que queda marcado `// [E2: retirar en integración]`

`actors.js` (`nerea_backlog`, `borja_engagement`), `flags.js` (`evaristo_lc`, `evaristo_convoco`, `rumor_firma_n`,
`planta_oyo`), `game.js` (`puenteE2` y `FLAGS_E2_PENDIENTES`), `plan-rules.mjs` (topes de Nemesio y Borja).
