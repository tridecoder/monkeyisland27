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
