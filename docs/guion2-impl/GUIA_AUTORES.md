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
- Menú ≤ 5 (correcta + señuelos + 1 floja que rota), ataque escrito en la ventana (el móvil de Bruno con la app de
  correo; el fax en D2), marcador de puntos estilo juego de lucha, «En copia» que crece, la floja se contesta siempre,
  revancha que empieza por la carta que ganó, sin autoguardado. Ver «Duelo: la presentación» al final.
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
| `cpd.js` (Eutimio, P3) | Cita la réplica vieja de R12 («…no pasa la ITV»): ahora es «Puestas. Ahora se ve perfectamente que no hay carretera.» | P1 |
| `ecosistema.js` (portátil de Tadeo) | Cita la vieja R15 («Normal. Se lo has preguntado tú»): ahora es «Lo sé. Me lo ha contado ella. Se llama Brais.» (y se aprende con Brais, §7.3) | P4 / P1 |
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
  4,15 €), L4 con `!ruben_encontrado` (se pierde si Brais aparece antes), L5 nueva con `ruben_libre` y
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

### E2.5 Reglas de texto nuevas (fallo desde la integración: `test-all` pasa `--plan --e2`)

`node tools/text-audit.mjs --estatico` enseña, además de lo de siempre, un bloque **ENMIENDA E2** que **no cuenta como
fallo** (ni con `--plan`) hasta que el integrador pase `--e2`:
- en todo el juego (todas las cadenas de `content/`): «desde [fecha]» ≤ 6, «cariño» ≤ 20 (integración; sin Eventos), «(*» = 0, «interstitial» ≤ 2,
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

### E2.7 Retirado en la integración de E2

Ya no queda nada marcado `// [E2: retirar en integración]`: fuera los actores `nerea_backlog` y `borja_engagement`, los
flags `evaristo_lc`, `evaristo_convoco`, `rumor_firma_n` y `planta_oyo` (y el puente `puenteE2` de `game.js`), y los topes
de Nemesio y Borja de `plan-rules.mjs`. `migrarPartida` los borra de las partidas guardadas (con las posiciones de los
dos actores) y deshace una `coma_bendecida` sin `correo_evaristo_listo`. El recorrido es el de 44 pasos (`walk-data.mjs`),
`text-audit` va con `--plan --e2` en `test-all` y el tope global de «cariño» es 20 (sin contar Eventos).

---

## E3. ENMIENDA E3 — fórmulas de remate y segundo registro de Maripaz

> Guion: `docs/guion2/ENMIENDA_E3.md` (revisión 2, aplicada). Prevalece sobre el plan, E1 y E2 solo en lo que toca.

### E3.1 Topes nuevos (fallo con `--e2`; `test-all` ya pasa `--plan --e2`)

En todo el juego, contados en las cadenas literales de `content/` (`TOPES_E2_JUEGO` de `tools/plan-rules.mjs`). **Eventos
(`eventos.js`, `eventos.dialogos.js`) no cuenta** (`fuera`, como «cariño»): ni se reescribe ni suma.

| Fórmula | Tope | Tras E3 | Ejemplo de lo que cuenta |
|---|---|---|---|
| «lo único / la única / el único / su única…» | 8 | 6 | «Es lo único de esta planta que…», «ERES EL ÚNICO» |
| «X no se coge. Se Y.» (con punto, dos puntos, punto y coma o coma) | 6 | 5 | «Las sillas no se cogen. Se heredan.» |
| «primera vez» | 5 | 4 | «Es la primera vez que…» |
| «Mi primer/a…» | 6 | 5 | «Mi primer documento oficial» |
| «No es X. Es Y.» (la cuarta fórmula) | 12 | 10 | «Eso no es una pregunta, criatura. Es una sentencia.» |
| «factur…» | 11 | 9 | «Te la facturo.» |

Margen de 1-2 en cada uno: **una línea nueva con cualquiera de estas fórmulas casi seguro sobra**. Remata con la
situación, no con el molde (formas de E3 §3.1: lógica propia del personaje, acción con consecuencia, consecuencia absurda,
precisión absurda, detalle concreto, pista escondida, cortesía con el objeto, rebaja, fuera de registro, callback…).
Siguen al límite exacto de E2 «desde [fecha]» (6/6) y «Emoji de fuego» (8/8).

Para ver cuántas lleva cada tope (pasen o no): `node tools/text-audit.mjs --estatico --recuento`.

El auditor (`esTexto()`) ya no se salta las frases sin tildes, eñes ni comas (antes no veía «Un fax enmarcado no se coge.
Se hereda.»): una línea ASCII también cuenta para los topes, los «Como X.» y las palabras vetadas. Excepción: el campo
`apodo:` de la tabla `SALA` de `content/lib/edificio.js` (ids internos, nada lo enseña).

### E3.2 Maripaz: segundo registro acotado

- **Maripaz lee el periódico y la pieza, nunca a Bruno.** Nada de Maripaz dice «te leo», «leyéndote», «seis años» ni
  promete leerle: quien lee a Bruno es la abuela, y es el final del juego.
- Lo dice en su idioma comercial, sin ternura: leer es encontrar el hueco y el anuncio vecino; un elogio es una tasación
  («vale un faldón entero»), nunca «es lo mejor».
- Dosis: seis líneas en su boca (murmullo B20, Dar el acta B14, la opción `once` «¿Usted se lee el periódico?» de su árbol
  y M1: Dar `pieza_opa` en Marketing, con variante recortada y respuesta repetida de eje), ninguna en el duelo. El resto,
  eje (inventario publicitario).

### E3.3 Crítica 3 §9.8-9.9 y E3 P8 (lo que ya está hecho; no lo dupliquéis)

- **Atajo de desplazamiento (§9.8)**: el tótem-directorio del vestíbulo de planta de la Redacción
  (`pecera.directorio_planta`, ahora «directorio con atajos») abre con un clic, Usar o Mirar la lista de las salas **ya
  pisadas** (nombre visible oficial y planta) y lleva a Bruno a la entrada de siempre de la elegida
  (`content/lib/directorio.js`: `DESTINOS`, `destinoAbierto`, `usarDirectorio`). Bloqueos: ni la sala actual ni una sin
  pisar; todo menos el Vestíbulo pide `torno_abierto`; la Sala Amazonas solo antes del Acto III (en el III se entra por su
  puerta: acta, Brais y clímax); tras el empujón, nada. La sala de destino corre su `onEnter` y los avisos como siempre: si
  vuestra sala tiene una escena de entrada, también salta por el atajo. Salas pisadas: `api.visitada(room)` /
  `api.visitadas()` (las marca el motor; se guardan con la partida). Línea nueva (una, la primera vez): «Toco un nombre y
  el tótem me lleva. Ni ticket, ni cita previa.». El doble clic / doble toque en una salida ya existía (`engine/mover.js`).
  Los dos, en «Cómo se juega».
- **Semáforo (E3 P8)**: Hablar con `semaforo_ruido` lo pone en verde un segundo y vuelve al rojo; el globo de Bruno sale a
  sus pies para no tapar la luz (`api.say(texto, { at: [x, 141] })`).
- **Señal del empujón (§9.9)**: ganado D4, el Lector Medio se tambalea solo cada 3,2 s (variantes `tamb1`/`tamb2` de
  `content/actors.js`); «Mirar a Bruno» dice la meta nueva del objetivo `empujon` («El Lector Medio se tambalea. Un
  empujoncito y deja de asentir.»); las tres pistas de la abuela ya iban de «empujoncito» a «cartón» a «Empujar al Lector
  Medio.». El final no cambia.
- Pruebas: `node tools/test-critica3.mjs` (atajo con ratón y dedo, bloqueos, guardar/cargar, semáforo, señal); capturas en
  `tools/shots/e3b-*.png`.

---

## E4. ENMIENDA E4 — Audiencias (Yoli), Discover y el titulador

> Guion: `docs/guion2/ENMIENDA_E4.md` (aprobado; epílogo con la alternativa A). Prueba: `node tools/test-e4.mjs`
> (en `test-all`); capturas en `tools/shots/e4-*.png`.

### E4.1 Dónde vive cada cosa

| Qué (E4) | Fichero |
|---|---|
| El titulador (§3bis): bucle, fórmula, dibujo, al salir (pósit) | `content/rooms/pecera.titulador.js` (`titulador(api, { demo })`) |
| Las piezas (autoridades, asuntos, ganchos, plantillas, especiales, afinidades, secretos, categorías, líneas de Yoli, demo del paso 34, ganador por defecto) | `content/rooms/pecera.titulador.datos.js` — **generado**, no se edita |
| Los 24 titulares fijos (§5): la ráfaga y la hoja «lo más leído» por acto | `content/rooms/pecera.titulares.datos.js` |
| S1 ráfaga, S3 hoja (`mirarHoja`, `hojaTop`, `filasHoja`), S4 `pecera_opa_ab`, S5 `pecera_opa_ganadora` | `content/rooms/pecera.escenas.js` |
| S2 borrasca, árbol de Yoli (O5, O17-O20, M3) | `content/rooms/pecera.dialogos.js` |
| Hotspot `lista_mas_leidas`, Usar `monitor_yoli`, Dar `pieza_opa` a Yoli, murmullo O21, entrada del paso 40 | `content/rooms/pecera.js` + `art/pecera.art.js` |
| S7 COINCIDO y S8 `corregirPosit` | `content/rooms/catacumba.js` |
| S6 epílogo (`lineaDiscover`) | `content/escenas/final.js` |
| Flags `discover_ganador` (str, '') y `opa_posit` (int, 0); icono de la pieza con pósit | `content/flags.js`, `content/game.js` (`startFlags` con `str`), `content/items.js` |
| Plano que se toca (`detalle({ click })`), menú con `inicio` | `engine/detalle.js`, `engine/core.js`, `engine/ui.js` |

### E4.2 Sustituir el juego de piezas del titulador (otra vuelta de la mesa)

1. Dejar el `piezas.json` nuevo (mismo formato) y su `gen.mjs` de referencia en `docs/guion2/e4/`.
2. `node tools/gen-titulador.mjs` → reescribe `content/rooms/pecera.titulador.datos.js` (comprueba que la demo, el ganador,
   los secretos y las líneas casan con las piezas; `--comprobar` solo mira si está al día).
3. `node tools/test-e4.mjs` → compara TODAS las combinaciones con el `gen.mjs` nuevo (titular, usuarios, categoría y voz),
   las nueve frases del dueño literales, ≤ 3 líneas a 190 px, y que la lógica no nombre ids de pieza. Si cambian las
   nueve frases del dueño, se cambian en `LITERALES` de la prueba.
4. `node tools/text-audit.mjs --estatico --plan --e2 --recuento` → las líneas de Yoli (`lineas`) pasan por todos los topes.

No hace falta tocar la lógica: la demo del paso 34 es `demo_paso_34` (su primera combinación es el titular de Bruno, la
categoría «honesto»), el ganador por defecto es `ganador_por_defecto` (el umbral del paso 40 son sus usuarios), las
categorías de gancho son las que dicen `si: "gancho <id>"`, y «Tus mejillones» del epílogo y «se ha ido a {los
mejillones}» de la hoja salen de `asuntos[].epi` y `asuntos[].C`. Solo si `gen.mjs` cambia de reglas (una marca nueva en
las plantillas, otra condición de categoría) hay que copiar el cambio en `pecera.titulador.js`. Un asunto nuevo sin
miniatura propia lleva un periódico genérico (las miniaturas de §3bis.5 se dibujan por id en `miniatura()`).

### E4.3 Textos que solo se ven

Los titulares, menús y etiquetas del titulador y los 24 fijos no son líneas habladas. En los dos ficheros de datos van
entre `// @solo-pantalla:inicio` y `// @solo-pantalla:fin`; `tools/plan-rules.mjs` (`SOLO_PANTALLA`) y `tools/check.mjs`
se saltan ese bloque para los topes «en todo el juego» y el límite de 80 caracteres, y SOLO en esos ficheros. Las palabras
vetadas a la vista y los «Como X.» se siguen comprobando dentro. Lo que dice Yoli al publicar queda fuera del bloque.
Un fichero de datos nuevo con textos de pantalla se declara en `SOLO_PANTALLA` (y se marca su bloque).

### E4.4 Decisiones de implementación (dudas de §8 y otras)

- **§8.1 Orden de entradas del Acto III:** la anexión (XE3) antes que el ganador, como dice el documento (XE4 no cambia).
  Si el ganador no llega, el epílogo usa la variante de seguridad («Tu opa en Discover»).
- **§8.2 Clic fuera del menú:** un toque DENTRO del monitor no cierra (el plano se queda el clic: `detalle({ click })`) y
  en una casilla abre su menú; un toque en la sala, fuera del plano, Esc o «Dejarlo» lo cierran. Cargar partida con el
  titulador abierto lo cierra sin tocar la partida cargada (`game.gen`).
- **§8.3 Strings en flags:** `discover_ganador` y `pecera_disc_record_k` son `str`; `startFlags` pone `''` a los `str`.
  Local nuevo `pecera_disc_ganador_k` (la combinación ganadora fijada en el paso 40, para la hoja III).
- El plano mide 304 × 102 (el motor limita el ancho a 304) y lleva una fila de tres casillas tocables; el contador va a
  escala 2 (con 576.000, 62 px) y la etiqueta debajo. El menú principal es compacto (5 filas al tacto, sin scroll) y cada
  submenú se abre enseñando la pieza elegida (`choose({ inicio })`). «¡Publicar!» dice cuántas quedan.
- Los globos van 2 px más abajo bajo un plano con rótulo (`hudTop`: +15, antes +13) para no tapar el rótulo.
- La demo del paso 34 se rotula «TITULADOR · PRUEBA» (es la prueba A/B de Yoli) y no guarda nada.
- Versiones tachadas del paso 40 si el jugador no ha publicado: la demo y los secretos por debajo del ganador, de menos a
  más (las cuatro últimas). La hoja de lo más leído mide 300 px de ancho (no 220) para que la letra sea la del juego.

## E5. ENMIENDA E5 — puzles de situación, poda de coletillas y nombres nuevos

> Guion: `docs/guion2/ENMIENDA_E5.md` (definitiva). Paquetes P0 (motor) ∥ I1 (altas) → PA ∥ PB ∥ PC ∥ PD ∥ PE (salas) →
> I2 (recorridos, pruebas, documentación). Prueba: `node tools/test-e5.mjs` (en `test-all`); capturas en
> `tools/shots/e5-*.png`. APIs nuevas del motor, con su tabla: `docs/CONTENT_SCHEMA.md` §7, «ENMIENDA E5».

### E5.0 Nombres: Eutimio y Brais (ids históricos `paco` y `ruben`)

Por decisión del dueño, posterior a la enmienda, **Paco** (Sistemas) se llama **Eutimio** y **Rubén** (el becario del
armario 27, el Titulator) se llama **Brais** (pasó antes por **Zacarías**). Solo cambia lo que se ve y se oye: el `name` de los actores, las
líneas, las pantallas, las pistas de la abuela, la tarjeta FE DE ERRATAS y el arte con el nombre dibujado (la etiqueta
de la brida y el pósit del regletero, «…EUTIMIO»; el pósit del kanban, «BAJA / BRAIS»). **Los ids NO cambian**:
el actor sigue siendo `paco_ticket` y `ruben`; los flags, `ruben_libre`, `ruben_encontrado`, `paco_dio_manual`,
`paco_tickets`, `cpd_paco_fax_n`…; la escena `revelacion_ruben`; las funciones (`revelacionRuben`, `nidoRuben`,
`drawPacoDesk`) y las descripciones de flags. Escribid el nombre nuevo en todo texto nuevo y el id viejo en el código.
Los documentos históricos (`docs/guion2/*.md`, `docs/informes/*`, `docs/GUION_BIBLIA.md`) siguen con los nombres viejos.
`text-audit` vigila las tildes de los nombres y avisa de «Zacarías», «Zacarias», «Rubén» o «Paco» sobrantes.

### E5.1 Dónde vive cada cosa

| Qué (E5) | Fichero |
|---|---|
| Motor: `walkTo`/`walkActor` con `{ run }`, apagón con focos que siguen a un actor, `nameDark` e interceptor, `sinCongelar`, `estampida({ esperar })`, `quieto`, `sinGuardar`, `sfx('crujido')`, holgura táctil, doble clic con `parada` | `engine/*` (P0); prueba `tools/test-e5-motor.mjs` |
| Ascensor con atajos (submenú tras la planta; `nombreDe`) | `content/lib/ascensor.js`, `content/lib/directorio.js` |
| Flags G `sala_becario_sin_turno`, `gertrudis_pregunta`, `vio_pegatina_fax`, `album_validado`, `columna_kanban` (str); objeto `rotulador_rojo`; Mercados con nombre; `tamb3`; `MEGAFONIA_TAMBALEO`; `AURORA_RV` (N6); objetivos `reunion`, `turno`, `cms`, `armario`, `baja`, `columna` | `content/flags.js`, `items.js`, `actors.js`, `lib/celestino.js`, `lib/movil.js`, `pistas.js` (I1) |
| Estampida por la tele: orden del día, «sin turno», tele (`teleSegunTurno`), `sala_tele_gertrudis`, atasco jugable (`resolverAtasco`: empujar / cruasán / hablar / anuncio), señal tras D4 (`update`) | `content/rooms/sala_amazonas.js` (+ arte), `content/escenas/climax.js` (`onWin`) |
| La pregunta de Gertrudis («¿Y cuáles son los siguientes pasos?») | `content/rooms/office.js` |
| Apagón jugable (`pecera_apagon` n = 1, `aOscuras`, `apagonCierre`), columna del kanban (`salida(api, via)`, `COLUMNAS`), coro K01-K04, F4 `junto()`, F9 Custodia | `content/rooms/pecera.escenas.js`, `pecera.dialogos.js`, `pecera.js`, `pecera.secretaria.js`, `art/pecera.art.js` |
| Regletero (menú de cinco, `planoRegletero`), ticket 0.441 (`fax`/`fax441`), armario 27 en dos actos (`corre`) | `content/rooms/cpd.js`, `art/cpd.art.js` |
| Pegatina del fax (`vio_pegatina_fax`), N6 (`rvLeido`), el Lector asiente sin globo | `content/rooms/catacumba.js`, `pajarera.js` |
| El rotulador de objetivos (`termometro_ventas.coger`); Begoña sin «¿Usted ha sido feliz alguna vez?» | `content/rooms/ecosistema.js`, `administracion.dialogos.js` |

### E5.2 Reglas nuevas de texto (`--e5`; `test-all` pasa `--plan --e2 --e5`)

- Coletilla «frase + Y/Con/Sin/Ni + 1-3 palabras» (`COLETILLA_RE` de `tools/plan-rules.mjs`): ≤ 46 cadenas sin Eventos,
  y ≤ 10 % de lo que dice cada personaje con ≥ 20 líneas oídas (sin el Lector Medio ni Eventos).
- «chaval» ≤ 12, «criatura» ≤ 6, «RECHAZADO en la frente» ≤ 2 (sin Eventos). Recuento informativo de «de la/esta casa»
  y de «mis sistemas» de Anselmo (si pasa de 5 oídas, «Ese enchufe está en mis sistemas.» → «Ese enchufe es de
  Desarrollo.»).
- Ninguna línea nueva con «Como…», coletilla, «criatura», «chaval» ni «cariño». Textos de pantalla (menú del regletero,
  columnas del kanban, nombres a oscuras, la tele) no son líneas habladas.
- Comprobar: `node tools/text-audit.mjs --estatico --plan --e2 --e5 --recuento` (con `--sala=<id>` para una sala).

### E5.3 El recorrido de 50 pasos y las pruebas

- `tools/walk-data.mjs` = §7.2 (50 pasos) y `ALT` = §7.3. Pasos nuevos: 19 (pegatina), 20 (apagón; en modo rápido la
  ventana dura 0), 21 (regletero: `['opcion', 'R-3']`), 22 (`Ticket 0.441`), 26-29 (orden del día, Gervasio «sin
  turno», Gertrudis, la tele; en modo rápido el atasco se resuelve por la vía del anuncio dentro de la escena), 43
  (rotulador), 45 (álbum → `album_validado`; E4 S5 al entrar) y 46 (rotulador + kanban → SALIDA EN VALOR).
- `walk-lib`: el submenú del ascensor se resuelve con la opción 0; en `esp.flags`, `'*'` = solo «puesto» (para flags de
  texto como `discover_ganador`).
- `extras.mjs` (100 pasos): los X de E2 renumerados (el apagón del XM2 ya va tras el paso 20) y XE5-1…11 (cuatro vías
  del atasco desde la misma partida guardada, fallos del regletero, columnas equivocadas sin `rep_13`, ascensor con
  atajo, Eutimio sin pegatina, papel del 27 en el II, tele «wifi y rencor» y móvil, a oscuras).
- `play-mouse.mjs` juega los 50 pasos con ratón real (submenú del ascensor con clic, ventana a oscuras con Hablar a
  Yoli, menú del regletero, Empujar a Fermín en el atasco, menú de columnas, megafonía tras D4) y deja capturas
  `tools/shots/e5-raton-*.png`.
- `fuzz.mjs`: puntos de guardado del nuevo recorrido (27-29 sin `reunion_terminada`), Usar/Hablar la tele y Usar el
  rotulador con el kanban sueltos.
- `test-e5.mjs`: las seis pruebas de paquete y, además, la frase de Anselmo una sola vez en el camino (paso 38) y
  «…Entonces es de la casa.» una vez (paso 46), la medida del camino principal (§9.1) y el ascensor desde Sistemas.

### E5.4 Decisiones de la integración (I2)

- Vending: al **cargar** una partida, el LCD de Gertrudis queda como se guardó (`office_emision` ya no se pone a 0 en
  `api.restoring`); si no, guardar tras la pregunta de Gertrudis y cargar no dejaba el estado idéntico (fuzz, paso 28).
- Sistemas: el hotspot `armarios` llega ahora hasta el regletero (`rect` 66 × 46): el regletero ampliado de E5 lo
  solapaba un 91 % (regla R2 de la auditoría de geometría, máx. 30 %). El pósit del regletero mide 2 px más para «…EUTIMIO»
  y el pósit de la baja del kanban, «BAJA / BRAIS» (dos renglones; con «ZACARÍAS» eran tres: «ZACA- / RÍAS»).
- `play-mouse`: el clic de Empujar a Fermín en el atasco se repite si cae en el marco (los tres tiemblan encajados).
- `plan-rules`: «ticket» seguido de número («Ticket 0.441», la opción del fax de E5 §3.4) no cuenta para el tope de
  «ticket» de Bruno, como ya no contaban «Ticket nº 1» ni el apellido de Eutimio.
- Los nombres a oscuras y el `parada` se declaran en la lógica de la sala (`content/lib/room.js` no copia esas claves
  del arte; no se ha ampliado `ART_OBJ_KEYS`).
- Pruebas antiguas al día con los textos de §4 (C17, C22, C44, C63, C72-C75, C94, D06-D17, M04, M09, M13, M20, K02,
  R4, C83, C45, C102-C103) y con los puzles nuevos (regletero con menú, ticket 0.441, columna, estampida por la tele,
  N6 con `rvLeido`, submenú del ascensor con Escape → rellano, `tamb3`).

## E6. ENMIENDA E6 — remate seco, duelos con cuerpo, apagón y atasco que se ven

> Guion: `docs/guion2/ENMIENDA_E6.md` (revisión 2, la contra). Paquetes P0 (motor) ∥ I1 (comunes) → PA ∥ PB ∥ PC ∥ PD ∥
> PE ∥ PF (salas y titulador) → I2 (recorridos, pruebas, documentación). Tablas de trabajo en `docs/guion2/e6/`
> (`tabla.mjs`: lo que SÍ se aplica; `tumbadas.md`: lo que NO; `nuevos.mjs`; `verifica.mjs`). Prueba: `node
> tools/test-e6.mjs` (en `test-all`); capturas en `tools/shots/e6-*.png`. APIs: `docs/CONTENT_SCHEMA.md` §7
> «ENMIENDA E6» y §10 (`cabe`).

### E6.1 Dónde vive cada cosa

| Qué (E6) | Fichero |
|---|---|
| `cabe` del duelo (la réplica que tiene que caber; la larga nunca es fallo), etiqueta `tag` en `choose` (el «COMODÍN»), N4 (Mirar a Bruno gana al hotspot de debajo), N5 (Hablar con el actor tapado por Bruno), N11 (táctil a DPR 1) | `engine/duel.js`, `engine/core.js`, `engine/ui.js` (P0); prueba `tools/test-e6-motor.mjs` |
| L4 tras abrir el armario («Se llama Brais.»), «Hablar con Bruno» = su meta, Valentín `casco_fuera`, «...CABE.» en la R09, pistas `turno` y `columna`, `SIN_DESTINO`, bajas de murmullos de `actors.js` (§4.3), topes de §8 y `--e6`, `walk-lib` con `'R09:larga'` | `content/game.js`, `actors.js`, `duelo.js`, `pistas.js`, `lib/directorio.js`, `tools/plan-rules.mjs`, `tools/text-audit.mjs`, `tools/walk-lib.mjs` (I1) |
| La tele de la Sala sintoniza a Gertrudis (árbol `tele_sala`, `hablarTele`, `teleGertrudis(api, { sintonizada })`), el atasco anunciado (plano de la puerta, los tres se giran, «¿Necesitan ayuda?», anuncio a los 20 s; Mirar = N2) | `content/rooms/sala_amazonas.js` (PA) |
| El corte de Sistemas «MIENTRAS, EN LA REDACCIÓN» (R-3 sin apagón previo; `cpd_corte_visto`; `planoRedaccionOscuras`; `PLIN` copiado), B8 | `content/rooms/cpd.js`, `art/cpd.art.js` (PC) |
| Camino del registro con las dos de Yoli (`cmsVivo`), «Dos IAs» sin Bruno, N11 de Anselmo y el gesto del rotulador, Valentín con globo «…», coro «D3: No.» a 6 | `content/rooms/pecera*.js` (PB) |
| D2 de tres asaltos con `cabe` (R09 corta «Tráeme el contexto.»), D3 con la R03 segunda («El acta se necesitaba para... para...») | `content/rooms/catacumba.js`, `pajarera.js` (PD) |
| El rotulador colgado del cordel (hotspot `rotulador_cordel`, 3×9 px tras la integración), B9 | `content/rooms/ecosistema.js`, `art/ecosistema.art.js`, `administracion.dialogos.js` (PE) |
| La 5.ª publicación espera («Dejarlo»); la casa del titulador `CASA = 225000`: pie «LA CASA: 225.000» y, al batirla, «LA CASA: 225.000 · TÚ: n» en oro con fogonazo, temblor y `sfx('good')` una sola vez (`once:pecera_casa_batida`) | `content/rooms/pecera.titulador.js` (PF; piezas y fórmula intactas) |

### E6.2 Reglas de texto nuevas (`--e6`; `test-all` pasa `--plan --e2 --e5 --e6`, también con `--sala`)

- **Remate seco** (`esRemateSeco` de `tools/plan-rules.mjs`): cadena de ≥ 2 frases cuya última frase tiene 1-3 palabras
  y acaba en «.» o «!» (no cuentan preguntas, frases cortadas ni cadenas de una frase; sin `music.js`). Tope: ≤ 17,9 %
  de las cadenas del juego (era 16,5 % en E6; E7 §7 lo sube con la restauración). Aviso (no fallo): un fichero de sala
  por encima del 26 % (era 22 %; sin Eventos ni los datos del titulador). Ver E7.2.
- Topes en cadenas: «táper» ≤ 17, año 19xx/20xx ≤ 35, «Huele a 2019» ≤ 1, «Diecinueve años» ≤ 4, «Lo que diga el Lector
  Medio» ≤ 5, «Era solo eso» ≤ 5; en el código de la Redacción, «D3: No.» (`['D3', 'No.']` y `['D3', '...No.']`) ≤ 6.
- Aviso: **duplicados audibles** (cadena > 25 caracteres en dos salas distintas, sin las de `DUP_PERMITIDAS`). Si una
  frase tiene que vivir en dos salas, decídelo y apúntala allí con el motivo.
- Una sola golpe por línea: cortar = quitar el remate apilado y dejar la frase; nada de coletilla tras el remate. Las
  reescrituras van por la tabla; no se reescribe para ganar décimas.
- Comprobar: `node tools/text-audit.mjs --estatico --plan --e2 --e5 --e6 --recuento` (con `--sala=<id>` para una sala).
  Al cerrar E6: remate seco 514 de 3.558 = 14,4 %; táper 17; años 33; «Huele a 2019» 1; «Diecinueve años» 4; «Lo que
  diga el Lector Medio» 5; «Era solo eso» 5; «D3: No.» 6; ninguna sala > 22 % (la peor, `ecosistema.js`, 21,7 %); 0
  duplicados audibles.

### E6.3 El recorrido de 49 pasos y las pruebas

- `tools/walk-data.mjs` = §7.2 (49 pasos) y `ALT` = §7.3. El 28 funde los 28-29 de E5: Hablar tele → «Buenas noches,
  Gertrudis.» → «¿Y cuáles son los siguientes pasos?» (en modo rápido el atasco se resuelve por la vía del anuncio). 36:
  D2 `['R06', 'R02', 'R09', {objeto: 'manual_fax'}]` (la R09 la corta). 46: D3 `['R07', 'R03', …]`. La L4 suena al
  entrar en Marketing y Comercial (42). El corte de Sistemas no sale en el camino (el apagón del 20 va antes).
- `extras.mjs` (107 pasos): X renumerados; las cuatro vías del atasco desde el paso 27 (el atasco llega por la tele;
  anuncio a los 20 s); XE6-1 el corte (R-3 sin apagón), XE6-2 el camino del registro con Yoli, XE6-3 la vía del Vending
  entera, XE6-4 D2 con la larga dos veces (0 fallos) y XE6-5 «Nada. Gracias, Gertrudis.» en la tele.
- `play-mouse.mjs`: la tele con clics, el atasco anunciado y Empujar a Fermín (esperando a que Bruno llegue andando),
  D2 con la larga y la corta, D3, el rotulador cogido del cordel; capturas `tools/shots/e6-raton-*.png` tomadas antes de
  pasar cada globo. `--hasta=N` para depurar.
- `fuzz.mjs`: puntos de guardado del recorrido de 49; Hablar tele, Coger/Usar/Mirar el rotulador del cordel sueltos.
- `test-e6.mjs`: las ocho de paquete y las propias (§11.2.6-7, el 28 sin Vending, duelos, COMODÍN en D1, medida y topes).

### E6.4 Decisiones de la integración (I2)

- §4.3: fuera de los genéricos del Titulator de Despachos «EL IBEX ABRE PLANO…» (vive en la escena 7.2) y de sus
  hazañas «BECARIO LLAMA A UN COLCHÓN…» (vive en la Sala, titular de la derrota de D1). La razón repetida («Son nueve
  razones…») se busca por el titular, no por el índice.
- `DUP_PERMITIDAS` añade «Lo que diga el Lector Medio.»: M25 (opción de la puerta de Despachos) y M24 (Hablar con el
  Lector en la Sala con Gervasio delante) se quedan las dos por la tabla de tics de §2.8.
- El rotulador colgado pasa de 2×7 a 3×9 px (capucha con brillo y etiqueta blanca): a tamaño de juego el de 2×7 se leía
  como otra raya del termómetro. El hotspot no cambia.
- Medida del camino principal (49 pasos, modo rápido, mismo método que E5): 553 líneas · 26.316 caracteres · 32,4 min
  (E5: 552 · 26.533 · 32,6). §9.1 preveía −2: no contaba que en el recorrido de E5 la L4 se perdía (ahora suena: +4) ni
  que la grabación de Gervasio no salía en modo rápido, y contaba E-53 como una línea (eran tres, más el titular del
  viaje al Vending). Se cumple el tope de §1 (+6). Remate seco en el camino: 97 de 553 (17,5 %).
- Atasco anunciado (§2.2): tras girarse los tres, **Bruno da hasta 44 px hacia la puerta** y la mira antes de «¿Necesitan
  ayuda?» (sin texto nuevo). La Sala mide 320 px y no hay travelling: sin ese paso, la pregunta salía en la otra punta
  de la sala y no se veía a quién iba dirigida.
- `play-mouse`: en el atasco el clic de Empujar va al centro del grupo (cualquiera de los tres resuelve la vía); a Fermín
  solo se le podía pinchar en el borde de su caja y, con el temblor, el clic caía en la puerta de detrás. Y espera a que
  Bruno llegue andando (cruzar la Sala no pone el juego «ocupado»; otro clic en el panel cancelaba el paseo).
- `text-audit`: si el recorrido falla, dice el paso y sale con 1 (antes moría con una excepción sin capturar: era el
  «crash» del text-audit de `test-all` a media ronda, con el walk-data de E5 contra el D2 de tres asaltos). `--progreso`
  enseña por dónde va. El prefijo de quien habla por fax («TEODORO (fax): ») no cuenta para las 80 columnas (N7 tiene 68
  caracteres; con el prefijo, 83). Lo mismo en la medida del camino de `test-e5`/`test-e6`.
- Herramientas con números de paso fijos, al recorrido de 49: `text-audit` (los 9 verbos en 13, 29 y 45), `sala.mjs` y
  `contactos.mjs` (a2 = 29, a3 = 39, a3r = 40, a3b = 45), `play-mouse` (geometría y conexiones), `fuzz`. Con los de E5
  (…46) `text-audit` y `sala.mjs sala_amazonas` se **colgaban**: el paso 46 de E6 ya es D3 ganada y entrar en la Sala
  arranca el clímax, cuyo menú de D4 espera para siempre (test-all lo mataba a los 900 s).
- `test-e4`: `clicOpcion` espera a que la opción esté en pantalla y a que el menú lleve más de 320 ms abierto (el motor
  ignora a propósito los toques de sus primeros 250 ms) en vez de una espera fija: era el fallo intermitente del submenú
  del titulador con siete pruebas a la vez. No es una carrera del juego.
- En las capturas con ratón, «¡P=licar!» es la cruz del cursor del juego encima del texto (comprobado con el cursor
  fuera: `tools/shots/e6-i2-publicar-*.png`); no es un fallo del menú.
- Pruebas antiguas al día con §4.1 y §11.1 (`test-comedia-p1…p4`, `smoke` L3/L4/L5, `test-fase0` E346, `test-e5` con el
  recorrido de 49); `test-comedia-p2` ya no pregunta por `nerea_backlog`: comprueba que en la Redacción, de Desarrollo,
  solo están Anselmo y el coro.

## E7. ENMIENDA E7 — entrada al nudo, la tele, el duelo de Gervasio y los golpes que vuelven

> Guion: `docs/guion2/ENMIENDA_E7.md` (la contra, aprobada). Todo el texto que cambia está en UNA tabla,
> `docs/guion2/e7/tabla_e7.mjs` (110 filas `{id, fichero, actual, nuevo|null, origen, motivo}` y 18 altas); el código del
> diseño y del motor, como parches literales, en `docs/guion2/e7/contra/disenio_patch.mjs` (34). Pruebas:
> `node tools/test-e7-motor.mjs` y `node tools/test-e7.mjs` (las dos en `test-all`); capturas `tools/shots/e7-*.png`.
> API nueva: `aTiempo` del duelo (`docs/CONTENT_SCHEMA.md` §10).

### E7.1 Dónde vive cada cosa

| Qué (E7) | Fichero |
|---|---|
| `aTiempo` del duelo («escribiendo…» en la barra del título, interrumpir no es fallo, `cortada`, `TROZO_MS`), F3 (la barra no se queda con «Usar <objeto>» tras adjuntar) | `engine/duel.js`, `engine/core.js` |
| Gervasio escribe a trozos (`dueloGervasio.aTiempo`; R07 acortado a 71 caracteres; `attackText` se queda de respaldo) | `content/rooms/pajarera.js` |
| El nudo: Aurora «¿De dónde saco papel para el fax?» (N1-N2), Begoña «¿Me da unos folios?…» (N3-N4), el sobre de azúcar abre el impreso (`ENTRADA`, `sobreANota`, con Dar y con Usar en Begoña o la ventanilla), «Importe cero» (N5), F4 | `rooms/catacumba.js`, `rooms/administracion.js`, `rooms/administracion.dialogos.js` |
| `oyo_papel_begona`; `M.nota` (N6) y `nota` también en `catacumba`; la ficha `FICHA.firmaPapel` (N11) y el margen N9; pistas `nota`, `turno` n3, `acta` | `content/flags.js`, `content/pistas.js`, `content/items.js` |
| La tele: `sinTurno`, `teleBuscando`, `hablarTele(api, { usar })` — Usar tele / caja de cables = Hablar; «wifi y rencor» con Mirar y Cerrar | `content/rooms/sala_amazonas.js` |
| F6: la escena de Anselmo en dos tiempos (sin las tres explicaciones; se queda «Nos hemos quedado sin IA de la casa.») | `content/rooms/pecera.dialogos.js` |
| Topes de §7 y el aviso por personaje (`REMATE_PERSONAJE_AVISO`, `rematePorPersonaje`) | `tools/plan-rules.mjs`, `tools/text-audit.mjs` |

### E7.2 Criterio de la restauración y topes

- **Un remate corto que es el golpe se queda; se cortan chistes apilados, coletillas que comentan y explicaciones.**
  Vuelve el original de E6 solo si es *claramente* mejor: recupera un golpe que gira la frase («Suben.», «Estoy de
  miedo.», «Lo dejo abierto.»), deshace una fusión que enterraba el golpe («214 respuestas.», «Es de plástico.»,
  «Rojo.») o quita un tic («, por X.», punto y coma en boca de alguien). No vuelve un segundo chiste apilado, una
  coletilla que comenta, un cambio de puntuación sin golpe ganado ni nada del hilo de «abrígate».
- **Vetos que no se tocan:** «Y un comentario: «abrígate». La cuenta de siempre.» (Yoli, escena viral) se queda
  EXACTAMENTE como está; E103 no vuelve (el final cita su forma de hoy); `content/escenas/final.js` no se toca.
- **Topes nuevos** (E7 §7): remate seco ≤ **17,9 %** de las cadenas (con E7: 585 de 3.565 = 16,4 %); aviso por fichero de
  sala **26 %** (la peor, `ecosistema.js`, 24,6 %); ningún otro tope sube.
- **Aviso por personaje** (nunca fallo): sobre lo OÍDO (`text-audit` completo; `rematePorPersonaje` de
  `tools/plan-rules.mjs`), quien diga ≥ 20 líneas distintas no debería pasar del 30 % de remate seco. Fuera el fax
  (Teodoro: es formato), el Lector Medio, los avisos y Eventos. Con E7, el más alto es Gervasio (≈ 26 %). Si salta, se
  mira a ese personaje: no se reescribe para ganar décimas.
- Comprobar: `node tools/text-audit.mjs --estatico --plan --e2 --e5 --e6 --recuento` (el aviso por personaje sale en el
  `text-audit` completo, sección «[E7] Remate seco por personaje»).

### E7.3 Recorridos y pruebas

- `walk-data.mjs`: los 49 pasos no cambian (solo el texto de 45 y 46). En modo rápido D3 no escribe a trozos: la frase
  entera de golpe (y al registro como aviso: la comprobación de la R03 de `test-e6` y `play-mouse` sigue valiendo).
- `walk-lib.mjs` (`--lento`) y `play-mouse.mjs` esperan a que Gervasio acabe de escribir antes de contestar.
- `extras.mjs`: XE5-10 con Mirar tele; XE7-T1/T2 (Usar tele y caja de cables), XE7-N2 (Aurora, ficha, folios), XE7-N1
  (el sobre con Dar y con Usar en la ventanilla), XE7-N3 («Importe cero»), XE7-F4 (sin aviso la segunda vez).
- Pruebas de E6 que comprueban la tabla de E6 (`test-e6-pc`, `-pd`) se saltan las filas que E7 sustituye.

### E7.4 Decisiones de la integración (I2)

- En modo rápido, la frase entera de D3 también va al registro como aviso (la enmienda solo la registraba al acabar de
  escribirse; sin esto, en modo rápido el registro solo tenía el primer trozo y `test-e6` no encontraba «El acta se
  necesitaba para... para...»). No se oye ni suma topes.
- Esc durante la escritura abre la pausa y la congela (§5.1.6); cargar o empezar partida desde la pausa mata la tarea
  (`game.gen`).


## Bloqueos («puertas ocultas») — lo que responde el juego cuando falta algo

> Prueba: `node tools/test-bloqueos.mjs` (en `test-all`); capturas `tools/shots/bloqueos-*.png`.

- **Regla**: una opción de diálogo o una acción del camino principal no se esconde tras un requisito que nada anuncia.
  La opción está y quien contesta dice qué falta (o quién lo tiene), sin dar la solución masticada. Solo se esconden
  las preguntas que Bruno no puede hacer sin saber algo (el número del ticket, la coma de Evaristo, la frase de la
  columna); la lista blanca, con el motivo, está en `EXCEPCIONES` de la prueba.
- **Pistas por sub-estado** (`content/pistas.js`): `sub: [{ si, niveles?, meta?, extra?, previa? }]`; el primero que se
  cumple sustituye esos campos (`engine/objetivos.js` `variante`; `api.objetivo.variante(id)`). Nivel 1 sugiere, 2 dice
  quién o dónde, 3 = [abuela, Bruno al colgar con sitio, objeto y verbo].
- **Objetivos opcionales** (`opcional: true`, p. ej. `boli`): no cuentan para la abuela ni «Mirar a Bruno» salvo en
  foco: la sala llama a `api.objetivo.foco('<id>')` cuando el jugador lo intenta. El foco vale en las salas del objetivo
  hasta que la abuela lo dice entero (nivel 3) o el jugador avanza un objetivo principal.
- **Réplicas que faltan**: la abuela solo dice «Me faltan réplicas.» si las que sabe Bruno no llegan para ganar (D3 y D4
  tienen cartas de más).
- `migrarPartida` (content/game.js): estampida cortada → reunión terminada; `gertrudis_pregunta` sin «sin turno» → sin
  turno; `herminia_midio` → `pecera_prompt_oido` (la frase de Anselmo ya oída).

## Coherencia — lo que el juego da por hecho tiene que haber pasado

> Prueba: `node tools/test-coherencia.mjs` (en `test-all`); capturas `tools/shots/coherencia-*.png` y
> `tools/shots/gervasio-insiste-*.png`.

- **Regla**: ninguna línea u opción presupone un suceso que la partida no ha tenido (una llamada, un correo, que alguien
  dijo algo, que algo está arreglado); y todo lo que un personaje o un aviso anuncia, pasa (o es claramente su manera de
  hablar). Ante la duda, condición o variante de texto.
- **La L2 de Evaristo vuelve** (`content/game.js` `LLAMADAS`): al empezar el Acto II, en cualquier sala menos
  Administración; se salta con `evaristo_escuchado`. Marca `evaristo_convoco = 'llamada'`; Begoña, al cerrar la nota,
  `'begona'` si nadie le había convocado. «¿Para qué me ha llamado?» pide `evaristo_convoco`; sin él, «¿Qué quería
  decirme?» (nodo `E_COSITA`, mismas opciones). La L5 («¿Lleva mi correo?») pide `has:correo_evaristo`.
- **Correos que llegan**: un correo que se anuncia con aviso se entrega con `llegaCorreoEvaristo(api, id)` de
  `content/lib/movil.js` (bandeja + aviso en la misma función; flag `evaristo_correos`). No escribáis
  `api.notice('Correo nuevo…')` a mano: la prueba lo busca. Lo que Evaristo promete de palabra, `prometerGracias(api)`
  (llega en la entrada siguiente, desde `avisos`).
- **Insistir también resuelve**: Gervasio y «¿y cuáles son los siguientes pasos?» (`sala_amazonas_insiste_n`): 1.ª, la
  tele se enciende sola; 2.ª, señala la pantalla y la tele parpadea; 3.ª, la tele recoge la pregunta (la escena de siempre).
- `migrarPartida`: partidas sin `evaristo_convoco` (de antes de que volviera la L2): convocadas por Begoña si ya pasó la
  nota; la L2 se da por pasada si ya es tarde para ella (Begoña, la L3 o el Acto III); si no, suena en su sitio.

## Duelo: la presentación («Responder a todos» en el móvil)

> Diseño: `docs/guion2/duelo/DUELO_REDISENO.md` con las decisiones del director (fuera «Le toca a:»/«Asignado a:»;
> se entra al correo por el móvil; cabecera de duelo; lo que está en juego como pregunta y sello). Motor:
> `engine/duel.js` (`drawHud`, `sobres`, `retroOffset`); prueba: `node tools/test-duelo-ui.mjs` (en `test-all`);
> capturas `tools/shots/duelo-ui-*.png`. El esqueleto (parejas, aciertos/fallos, remates, `cabe`, `aTiempo`, comodín,
> retirarse) y lo que leen las pruebas (`duelInfo.subject/cc/score/assigned/body`) NO cambian.

- **Campos nuevos del rival** (`duels.<id>`, todos opcionales; detalle en `docs/CONTENT_SCHEMA.md` §10):
  `pregunta` (lo que está en juego, ≤ 34 caracteres, en el centro de la cabecera), `veredicto: { verbo, gana, pierde }`
  (el sello del final), `enCopia` (quién entra en copia tras el 1.º, 2.º y 3.º fallo), `sostener` (lo que lleva en la
  mano el rival durante el hilo; Bruno lleva el `movil` salvo por fax), `puesta(api, ctl)` (antes de abrir la ventana:
  el rival a la vista, de frente a Bruno) y `recoger(api, resultado, ctl)` (al perder o retirarse: vuelve a su sitio).
- **Datos comunes** (`content/duelo.js`): `masUno` (quién da cada «+1», por duelo y en orden: gente que está en la casa
  en ese momento), `cameos.inigo.quien` (Tadeo, como notificación), `texts.app/you/enCopia/escribiendo/libreta/ayuda`.

| Duelo | Pregunta | Veredicto (gana / pierde) | «+1» | En copia |
|---|---|---|---|---|
| D1 Maripaz | ¿Quién llama a Siestatón? | LLAMA: MARIPAZ / LLAMA: B. POLLEJO | Celestino, Yoli, Gertrudis | Siestatón, la planta, toda la empresa |
| D2 Teodoro (fax) | ¿Quién firma la página 7? | FIRMA: TEODORO / FIRMA: EL DE LA WEB | Begoña, Celestino, Yoli | Aurora, la planta, toda la empresa |
| D3 Gervasio | ¿Quién redacta el acta? | REDACTA: GERVASIO / REDACTA: EL BECARIO | Eutimio, Anselmo | sus tres móviles, la planta, toda la empresa |
| D4 Íñigo | ¿Quién apaga la rotativa? | APAGA: NADIE / APAGA: VACANTE | Yoli, Eutimio, Aurora, Begoña, Celestino (+ Tadeo) | Optimal, la planta, toda la empresa |

- **D1, planteamiento** (solo antes del primer D1; las revanchas, no): tras las dos líneas de Maripaz, ella rodea la mesa
  hasta delante de Bruno (`SITIO_D1 = [140, 130]`), levanta la tableta (`tabletaAlLado`, que no le tapa la cara) y dice
  «Eso, por escrito. Con copia a todos.»; ¡ding! y un sobre junto a cada presente; Bruno saca el móvil: «Estamos a un
  metro.»; Maripaz: «Por eso. Lo que no está en copia no ha pasado.». Durante el duelo sigue ahí; al perder o retirarse
  vuelve a su silla. **Camino principal: +3 líneas** (553 → 556; los topes de `test-e5`, `test-e6` y `test-e7` siguen
  valiendo: ≤ 576, ≤ 558 y ≤ 559).
- **Aviso al aprender una réplica**: «Réplica apuntada. Para el próximo «responder a todos».» (`content/game.js`).
- Al acertar no hay frase verde: notificación «Celestino: +1» dentro del móvil, destello verde, un punto del rival se
  apaga y el rival da un paso atrás. Al fallar: destello rojo, temblor, un punto de Bruno se apaga, Bruno da un paso
  atrás y crece «En copia: …». `cabe`, `aTiempo`, comodín y retirarse no apagan puntos ni destellan.
- La ayuda gris «Contesta con la réplica que la desmonte.» sale solo en el primer duelo de la partida (flag de motor
  `duel:ayuda`, que se pone con el primer acierto o al terminar ese duelo).
- Colores de la ventana: `COL` y `PARES_CONTRASTE` de `engine/duel.js` (los comprueba `tools/contrast.mjs`).

## Guion nuevo · tanda 1 (docs/GUION_PROPUESTA_LIMPIO.md: [P5], [P7], [P8], [P9], [P10], [P13] y sueltos de [P14]/[P15])

> Prueba: `node tools/test-guion3-t1.mjs` (en `test-all`); capturas `tools/shots/guion3-t1-*.png`.

- **El periódico se llama El Incontable** (web y rótulos: `elincontable.es`, `ELINCONTABLE.ES`). El nombre viejo no
  queda en `content/`, `engine/`, `tools/`, `index.html` ni README; `text-audit` lo vigila. La única forma sin «in» que
  se dice es el chiste del logo («queda «elcontable.es». Una gestoría.»). Letras del Vestíbulo: `logo()` de
  `art/vestibulo.art.js` (el «in» cuelga torcido de un tornillo).
- **Réplicas**: las nueve nuevas están en `content/duelo.js` (`pairs`) y en la escena donde se aprende cada una; las
  voces de ataque, en el bloque de cada rival (`attackText`; Íñigo ya tiene las suyas en `escenas/climax.js`). Un
  `hurtByPair` puede ser una función `(duel) => líneas | null` (la R07 de Íñigo solo tras el remate del acta).
- **Aprender perdiendo** (`duelo.js pistas`, `engine/duel.js`): se entra a cualquier duelo; cada ataque sin su réplica
  apunta en la libreta la nota de Bruno de `pistas.js DONDE` (flag `libreta_pistas`, un bit por pareja), con el aviso
  «Pista apuntada en la libreta.» y un pósit sobre la pestaña LIBRETA mientras el menú está abierto; al perder, «Me
  faltan réplicas. Están apuntadas en la libreta.»; «Mirar libreta» las enseña en gris; `learnReply` las borra. Si
  cambia dónde se aprende una réplica, se cambia `DONDE` y vale para la abuela y para la libreta.
- **Gervasio más rápido** (`aTiempo.rapido` de `pajarera.js`): tras un ataque escrito entero, dos tramos y pausas × 0,6;
  el que Bruno le pisa vuelve a ir lento.
- **Apagón**: 12 s la primera vez (Anselmo cruza); del segundo en adelante, 5 s a oscuras con el mismo interceptor y
  luego la escalada de siempre (`cierreRepeticion` de `pecera.escenas.js`).
- **Pop-up de papel**: `paginaComercial` (faldón, robapáginas, cuatro módulos, línea gris) y `paginaPopup` (el colchón
  de cartulina troquelada que se levanta, `POPUP_MS`) en `art/sala_amazonas.art.js`; dos `api.detalle` seguidos.
