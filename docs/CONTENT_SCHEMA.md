# CONTENT_SCHEMA — authoring reference for FE DE ERRATAS

Authoritative reference for writing content on this engine. Everything here matches the code in `engine/`,
`content/lib/room.js` and the tools. The script is `docs/GUION_BIBLIA.md` (the "bible"); art helpers are in
`docs/ART_GUIDE.md`. Section 17 is the checklist for room authors (**Guía para autores de sala**).

- Language: all player-facing text is **Spanish**. The bitmap font supports `áéíóúüñÁÉÍÓÚÜÑ¿¡«»€ºª✓→×·—` and common
  punctuation. `“”` become `"`, `’` becomes `'`, `…` becomes `...`. Unknown characters render as `?`.
- Plain ES modules, no build step. Import with **relative** paths (`'../lib/room.js'` from `content/rooms/`,
  `'../../engine/draw.js'` from `content/rooms/`, `'../../../engine/draw.js'` from `content/rooms/art/`).
- Screen 320×200. Room viewport 320×144 (y 0–143); UI panel y 144–199. Rooms may be wider than 320 (`pecera` is 1270, `eventos` 512, `ecosistema` 432).
- Bible rules that the tools enforce: ids in `snake_case` without accents; **no spoken line over 80 characters**
  (`tools/check.mjs` warns); a bible ` // ` means two separate lines (two balloons); stage directions in brackets
  are never shown as text.

## Contents
0. [Team rules: who owns which file](#0-team-rules-who-owns-which-file)
1. [File layout & registration](#1-file-layout--registration)
2. [A room = logic file + art file](#2-a-room--logic-file--art-file)
3. [game.js (shared)](#3-gamejs-shared)
4. [Objects / hotspots](#4-objects--hotspots)
5. [Actors](#5-actors)
6. [Handlers & the fallback chain](#6-handlers--the-fallback-chain)
7. [Script API](#7-script-api)
8. [Conditions](#8-conditions)
9. [Dialogs](#9-dialogs)
10. [Duelos: «Responder a todos»](#10-duelos-responder-a-todos)
11. [Inventory items (shared)](#11-inventory-items-shared)
12. [Flags, state & saving](#12-flags-state--saving)
13. [Music & sound effects](#13-music--sound-effects)
14. [Title, ending & credits](#14-title-ending--credits)
15. [Testing & tools](#15-testing--tools)
16. [Conventions & pitfalls](#16-conventions--pitfalls)
17. [Guía para autores de sala (checklist)](#17-guía-para-autores-de-sala-checklist)

---

## 0. Team rules: who owns which file

> **REDISEÑO VISUAL (vigente):** el reparto de archivos de los cuatro paquetes de salas (P1 `vestibulo`+`cpd`, P2
> `pecera`+`pajarera`, P3 `office`+`catacumba`+`administracion`, P4 `sala_amazonas`+`ecosistema`+`eventos`), el
> contrato del edificio y las reglas de arte están en **`docs/GUIA_REDISENO.md`** (manda sobre la tabla de abajo).
> El kit común es `content/lib/kit.js` y el contrato de datos `content/lib/edificio.js` (compartidos, solo lectura).

Seven people work in parallel: four room authors (packages **A–D** of bible §9.1) and three background artists.
Every file has exactly one owner, so nobody ever edits the same file.

| file(s) | owner |
|---|---|
| `content/rooms/<id>.js` — room **logic** | the package writer of that room (A: `vestibulo`, `cpd` · B: `pecera`, `pajarera` · C: `office`, `catacumba` · D: `ecosistema`, `eventos`, `administracion`, `sala_amazonas`) |
| `content/rooms/<id>.*.js`, `content/escenas/<name>.js` — extra logic files (dialogs, scenes) | the writer who creates them (prefix them with your room id / a unique name) |
| `content/rooms/art/<id>.art.js` — room **art + geometry** | the background artist of that room |
| `content/game.js`, `content/items.js`, `content/actors.js`, `content/duelo.js`, `content/flags.js`, `content/index.js`, `content/lib/*`, `engine/*`, `tools/*` | **shared — nobody edits them** |
| `content/music.js` | the composer |
| `docs/GUION_BIBLIA.md`, `docs/writers-room/*` | the head writer |

**If you need a change in a shared file** (a new global flag, an engine feature, a fix in an item, an actor's look),
do **not** edit it: describe the change in your final report (file, what, why) and work around it locally meanwhile
(local flags, a helper in your own file). Room-only flags go in your logic file's `flags` (§12).

The logic file and the art file of a room are glued by **ids** (bible §3): the logic owns names, text and behaviour;
the art owns pixels and coordinates. If the two sides disagree on an id, `buildRoom` warns and `tools/check.mjs` fails.

---

## 1. File layout & registration

```
index.html, style.css               entry point
engine/                             the engine (shared)
content/index.js                    single registration point — already registers the 10 rooms (shared)
content/game.js                     title, defaults §8.2, hints §5.6, fourth wall §8.6, credits shell, automatic notices `avisos` (shared)
content/actors.js                   the whole cast §2 (shared)
content/items.js                    the 19 inventory items (18 of §4 + `boli_muerto` of addendum 6.1) + item-on-item combos (shared)
content/duelo.js                    duel data §6: 16 pairs (14 + R15/R16 of the addendum), 5 weak replies, comodín, wrong-object lines, hurtByPair, cameos (shared)
content/flags.js                    every global flag §5.5 (shared)
content/music.js                    music tracks (composer)
content/lib/room.js                 buildRoom(logic, art) + placeholder helpers (shared)
content/rooms/<id>.js               room LOGIC (package writer)
content/rooms/art/<id>.art.js       room ART + GEOMETRY (background artist)
content/rooms/<id>.<algo>.js        optional extra logic files of that room (writer), imported by the room file
content/escenas/<nombre>.js         optional scene files (writer), imported by a room file
content/rooms/_plantilla.js         annotated example of a logic file (not registered)
content/rooms/art/_plantilla.art.js annotated example of an art file (not registered)
```

The 10 rooms (`vestibulo`, `pecera`, `office`, `catacumba`, `pajarera`, `sala_amazonas`, `ecosistema`, `eventos`
(the Sala Polivalente of Eventos, 512 px wide, next door to `ecosistema`), `administracion`, `cpd`) exist as working stubs: every exit of bible §3.0 works (**all unlocked for now**, with a
`// TODO <package>: ... Bloqueo pendiente` comment where the lock goes), every hotspot id of §3 is present on both sides,
NPCs stand in place. **Extra files never need `index.js`**: import them from your room file
(`import dialogos from './pecera.dialogos.js'` and spread them into `dialogs`), and register scenes/duels through
your room's `scenes` / `duels` (they become global).

`content/index.js` (for reference):
```js
export default {
  game, actors: [actors], items: [items], duels: [duelo], flags: [flags],
  rooms: [vestibulo, pecera, office, catacumba, pajarera, sala_amazonas, ecosistema, eventos, administracion, cpd],
  dialogs: [], music: [], sfx: [],
};
```
Merging: `items`, `actors`, `dialogs`, `music`, `sfx` maps are shallow-merged in order. Duel data: `pairs` and
`weakReplies` are concatenated; `opponents` = `duels` of `duelo.js` + every room's `duels`. Scenes = `game.scenes`
+ every room's `scenes` (a duplicate name warns). Known flags = `flags.js` + every room's local `flags`.

On load the engine validates references (start room, player, actor placements, `pickup` items, exit rooms **and exit
entries**, duel actors) and prints warnings as `[contenido] ...`; they are also in `__game.errors` with `warn: true`.

---

## 2. A room = logic file + art file

### 2.1 Logic file (`content/rooms/<id>.js`, package writer)
```js
import { buildRoom } from '../lib/room.js';
import art from './art/<id>.art.js';

export default buildRoom({
  id: '<id>',                       // = file name = bible §3 id
  name: 'Nombre visible',           // save slots
  music: 'm_<id>',                  // default 'm_<id>'; null = silence; a track that doesn't exist yet = silence
  flags: { <id>_algo: 'comentario' },   // LOCAL flags (§12): only this room reads them; prefix '<id>_'
  objects: [                        // §4 — every hotspot/exit id of bible §3 for this room
    { id: 'torno', name: 'torno', exit: { room: 'pecera' }, when: undefined, state: undefined, states: [],
      desc: undefined, pickup: undefined, handlers: { mirar: '...', 'usar:tarjeta_becario': async (api) => {} } },
  ],
  actors: [                         // §5.2 — NPCs that can be in this room
    { id: 'celestino', when: undefined, pos: undefined, name: undefined, handlers: { hablar: async (api) => api.dialog('celestino') } },
  ],
  dialogs: {},                      // §9 (room-local; looked up before global dialogs)
  duels: {},                        // §10 — rivals defined by this room (global ids: maripaz, teodoro, gervasio, inigo)
  scenes: {},                       // named scenes, global: api.scene('<name>') from anywhere
  defaults: {},                     // per-verb fallback lines for this room (§6)
  ambient: [],                      // random background events (§2.4)
  dynamic: false,                   // true = the art's draw() depends on flags: repaint after every setFlag/inc/setState
  async onEnter(api) {},            // every entry, also after loading a save: must be idempotent
  async onExit(api) {},             // before leaving (not on load)
  update(api, dt) {},               // optional, every frame; keep it cheap
}, art);
```

### 2.2 Art file (`content/rooms/art/<id>.art.js`, background artist)
```js
const layout = {
  // OBJECTS / EXITS (same ids as the logic): geometry + optional drawing
  torno:  { rect: [136, 50, 48, 50], walkTo: [160, 106], face: 'up' },        // or poly: [[x,y], ...]
  fax:    { rect: [86, 70, 24, 14], walkTo: [98, 112], face: 'up', cache: true,
            sprites: { sin_papel: (g, view, t) => {...}, con_papel: (g) => {...}, default: (g) => {...} } },
  // NPCs (same ids as the logic `actors`): where they stand and where Bruno stands to talk
  celestino:     { at: [232, 104, 'down'], walkTo: [222, 116], face: 'right' },
  gervasio_acta: { at: [84, 106, 'right'], positions: { preside: { at: [84, 106, 'right'] }, rincon: { at: [296, 110, 'left'] } } },
};
export default {
  room: '<id>',
  width: 320,                       // 1270 for pecera
  scale: { yFar: 100, far: 0.86, yNear: 142, near: 1.0 },   // or a number, or (y) => scale
  walkboxes: [{ id: 'suelo', poly: [[4, 104], [316, 104], [318, 142], [2, 142]] }],
  entries: { pecera: [160, 108, 'down'], cpd: [278, 112, 'down'] },   // named after the room you come FROM
  layout,
  draw(g, view, t) {},              // static background, painted once (cached)
  animate(g, view, t) {},           // every frame, behind actors
  foreground(g, view, t) {},        // painted once, over actors
  overlay(g, view, t) {},           // every frame, over everything (effects; NOT to darken actors: use penumbra)
  penumbra(view, t) {},             // every frame: { color, alpha, spots, actor, actores } | null (§2.7)
  dynamic: false,                   // true if draw/foreground read flags (view.flag)
  rediseno: false,                  // true = redesigned room: the geometry audit applies the strict redesign rules
};
```
Art-side object keys: `rect` | `poly`, `walkTo`, `face`, `walk`, `priority`, `layer`, `zy`, `cache`, `cachePad`,
`draw` **or** `sprites` (one draw function per object **state**, plus `default`). Art-side NPC keys: `at`
(`[x, y, dir]`, y = feet), `walkTo`, `face`, `pose` (`'sentado'` | `'tras_mesa'`), `luz` (penumbra exemption 0..1),
`positions` (`{ name: { at, walkTo?, face?, pose?, luz? } }`). Walkboxes may carry `scale` (§2.7).
Art may **read** flags (`view.flag('cms_vivo')`, `view.state`), never change them.

### 2.3 What `buildRoom(logic, art)` does
- Copies the art's room-level keys (`width`, `scale`, `walkboxes`, `entries`, `draw`, `animate`, `foreground`,
  `overlay`, `penumbra`) into the room; `dynamic` = logic **or** art. NPC layout `pose` / `luz` (and per position) go
  to the placement.
- For every logic object, merges its `layout[id]`: `rect` → `x, y, w, h`; `poly`; the art keys listed above (a key
  set by the logic wins); `sprites` → a `draw` that picks `sprites[state]` (or `sprites.default`). If the logic
  declares `states: [...]`, sprites for unknown states warn.
- For every logic actor placement, takes `x, y, dir` from `layout[id].at`, plus `walkTo`, `face`, `positions`.
- **Warns** (`[sala <id>] ...` in the console, collected in `roomWarnings` → `tools/check.mjs` fails) when an id is on
  one side only. A logic object with no art gets a **visible placeholder**: a pink dashed box with its id near the top
  of the room, drawn in front, so it is still clickable and testable.
- Exits: `exit: { room }` without `entry` uses the current room id as entry (so `entries` are named after the room
  you come from). `music` defaults to `'m_<id>'`. Defaults for missing art: placeholder background, a full-width
  walkbox, `entries.default`.
- The merged room keeps `art` and `layout` (read-only) in case a script needs a coordinate:
  `api.placeActor('inigo_sinergia', 'pecera', ...art.layout.inigo_sinergia.at)` (import `art` in your logic file).

### 2.4 Room keys reference
- Drawing functions get **room coordinates** (x 0…`width`, y 0…143). `t` = game time (ms). `view` =
  `{ flags, flag(name), has(itemId), objState(objId), state, visible, t }`.
- `draw`/`foreground` are cached: if they depend on flags, set `dynamic: true` (art or logic) or call `api.repaint()`.
  Prefer state-dependent visuals in objects (`sprites` per state; drawn every frame).
- Actor `y` is the **feet**. Floor line y≈92–100, walkboxes start a few px below. Z-order: actors and `layer:'sorted'`
  objects sort by feet/baseline (`zy`).
- `ambient: [...]` — ambient chatter. **One shared scheduler** (`engine/efectos.js`, plan §5.14) decides WHEN: never
  while there is another balloon, a menu, a notice, the phone, a close-up, a duel or a card on screen (it waits and
  goes out as soon as there is silence; a real line that starts cuts an ambient balloon), **60-120 s** between two
  interventions and **at most 3 per visit** (re-entering the room resets the count). Per-room rules:
  `ambientRules: { every: [60000, 120000], max: 3, first: [min, max] }` (`first` = delay of the first one; default
  `every`). An entry's own `every` is ignored. The author supplies only the LINES:
  ```js
  ambientRules: { max: 3 },
  ambient: [
    { id: 'coro', if: '!lector_derribado', orden: 'fijo',          // 'fijo' (default): in order, then silence for the
      voces: { D1: { from: 'coro_desarrollo', prefijo: 'D1: ' },    //   rest of the game · 'rotar': loops
               D2: { from: 'coro_desarrollo', prefijo: 'D2: ' }, D3: { from: 'coro_desarrollo', prefijo: 'D3: ' } },
      discusiones: [
        [['D1', '¡Se ha caído el CMS!'], ['D2', '¡Hay que levantarlo!'], ['D3', 'No.']],
        (api) => [['D1', 'Ha llovido y ha bajado el tráfico.'], ['D2', '¡Abrid una incidencia a la lluvia!']],
      ] },
    { if: 'acto_2_iniciado', run: async (api) => { await api.sayAs('aurora_galerada', '...'); } },   // still valid
  ],
  ```
  Who: `'B'`/`'player'` (Bruno), an actor id, `'obj:<object>'` (sayFrom), `'narrador'`, `'wait'` (ms), `'sfx'`, or a
  key of `voces` (`{ from: actorOrObject, prefijo, color }` or an actor id). Progress is saved in the engine flag
  `ambient:<room>.<id>`. The same line format is `await api.decir(lines, voces)` anywhere.
- `walkboxes` can be toggled from the logic with `api.setWalkbox(id, on)` — the art must give the box that `id`
  (agree on the name in the room's logic header comment).
- **Conditional walkboxes:** a walkbox may carry `when` (a condition, §8): `{ id: 'paso_torno', when: 'torno_abierto',
  poly: [...] }`. The engine enables it only while the condition holds, re-evaluating on room entry (and load), after
  every `setFlag`/`inc` and whenever a blocking script ends (`Game.refreshWalkboxes`, cheap: rebuilds only on change).
  An explicit `api.setWalkbox(id, on)` for the same box wins over its `when`. Use it to make a barrier physical: in the
  `vestibulo`, the street side (`entrada`) and the inner lobby with the lift (`interior`) only connect through the
  turnstile lane (`paso_torno`), so before `torno_abierto` Bruno cannot walk to the lift at all (an unreachable
  approach point makes him walk to the closest reachable spot, then the handler answers). `?debug=1` draws disabled
  walkboxes in red.

### 2.5 The lift (`content/lib/ascensor.js`)
One lift with a floor panel joins four rooms: -1 `cpd`, 0 `vestibulo`, 1 `pecera`, 2 `ecosistema` (`PLANTAS`; the Sala Polivalente `eventos` is reached from `ecosistema` through its door). Each of
those rooms declares its lift object with `ascensorObjeto(id, extraHandlers, bloqueo?)` (Ir a / Usar / Abrir →
`usarAscensor(api)`: `api.choose` with the four floors, the current one greyed «(aquí)», plus «Nada, me quedo en esta
planta.»), and its art has the entry `ascensor` (where Bruno appears). `plantaPermitida(api, room)` applies the same
condition as the old route to that room (-1, 1, 2: `torno_abierto`; 0: always); a refused floor answers with a line
and does not travel. A ride: door sfx, fade, a cabin `hud` with the floor counter, one rotating lift line (narrator,
`ascensor_viajes_n`), then `api.goto(room, 'ascensor')`: the destination's `onEnter` and the automatic notices run as
for any entry. Lift objects carry `ascensor: { planta, label }` (no `exit`): `tools/check.mjs` and the test travel helpers
(`walk-lib.mjs`, `play-mouse.mjs`) add lift edges to the exit graph and pick the floor by its label.

### 2.6 Mapa del edificio (plantas y conexiones: arte, guion y botonera coinciden)
Fuente única de la geografía (biblia §3.0, adenda §14, `content/lib/edificio.js`, órdenes de dirección 1-3 del cierre del
rediseño). Toda placa, indicador de ascensor y escalera debe cuadrar con esto; una salida nueva se añade aquí primero.
Las placas son las del kit (`kit.placaSala`: banda con el número y el color de la planta, nombre llano, flecha); los
apodos (Pecera, Catacumba, Ecosistema) solo en boca de los personajes; «Pajarera», «Office» y «Nerea» no se ven nunca (son ids); la sala `pajarera` se llama «Despachos».

| planta | salas (id → nombre visible) | cómo se llega / se sale |
|---|---|---|
| **2** (lila) | `ecosistema` → Marketing y Comercial · `eventos` → Eventos / Sala Polivalente · `administracion` → Administración | `ecosistema` (432 px): a la IZQUIERDA el NÚCLEO (x 0-96): escalera que BAJA (placa «1 REDACCIÓN ▼», `ecosistema_a_pecera`) y ascensor «2»; puerta doble con ojos de buey (placa «2 EVENTOS», x 194-238) → `eventos`; al fondo a la derecha el pasillo (placa «2 ADMINISTRACIÓN ►», x 384-430) → `administracion`. |
| **1** (verde agua) | `pecera` → Redacción · `catacumba` → Redacción de papel / Cierre · `office` → Vending · `pajarera` → Despachos · `sala_amazonas` → Sala Amazonas | `pecera` (1270 px): a la IZQUIERDA el NÚCLEO (x 0-96): escalera que SUBE (placa «2 MARKETING ▲», arriba), escalera que BAJA (placa «0 VESTÍBULO ▼», abajo) y ascensor «1»; VESTÍBULO DE PLANTA (x 96-344, un hueco y una placa por acceso, a la misma altura): tótem-directorio (x 100-148); frente de cristal «1 DESPACHOS / SALA DE REUNIONES >» (x 168-224) → `pajarera` → `puerta_sala` («1 AMAZONAS / SALA DE REUNIONES») → `sala_amazonas`; arco abierto «1 VENDING» (x 260-316) → `office` (sala sin más salidas); zona de papel (x 344-580): la Secretaría de Redacción en su hueco (placa «SECRETARÍA», ventanuco x 370-406) y la PUERTA DOBLE abierta (x 490-550, placa «1 REDACCIÓN / DE PAPEL · CIERRE», umbral de latón) → `catacumba`, al MISMO nivel (por dentro, placa «1 REDACCIÓN ◄ / REDACCIÓN WEB»). |
| **0** (verde) | `vestibulo` → Vestíbulo | puerta de la calle (no se sale) · línea de tornos (el carril delantero, «AVERIADO») · a la DERECHA, detrás de los tornos, el NÚCLEO (x 224-320): escalera que SUBE (placa «1 REDACCIÓN ▲», `vestibulo_a_redaccion` / `torno`) y ascensor «0». Con el torno cerrado, el núcleo queda al otro lado (walkbox condicional `paso_torno`). |
| **−1** (azul) | `cpd` → Sistemas | a la IZQUIERDA el NÚCLEO: ascensor «−1» y la caja de escalera CERRADA («SOLO EVACUACIÓN», sin hotspot): solo se llega en ascensor. |

```
P2   núcleo[▼ escalera · ascensor 2] [ecosistema: Marketing · puerta EVENTOS · Comercial · pasillo] ─┬─ [eventos]
                                                                                                    └─ [administracion]
P1   núcleo[▲ ▼ escaleras · ascensor 1] [pecera: vestíbulo de planta · zona de papel · Web … Diseño]
            ├─ cristal DESPACHOS ─ [pajarera] ─ puerta AMAZONAS ─ [sala_amazonas]
            ├─ arco VENDING ─ [office]                          (sin más salidas)
            └─ puerta doble (umbral de latón, mismo nivel) ─ [catacumba]   (sin más salidas)
P0   [vestibulo: calle · tornos] ─torno─ núcleo[▲ escalera · ascensor 0]
P−1  núcleo[ascensor −1 · escalera cerrada] [cpd]
```
Entradas (se llaman como la sala de origen; Bruno aparece dentro del suelo, delante de la salida de vuelta):
`pecera.entries` = `vestibulo`/`ecosistema` [31, 112] (pie de las escaleras), `ascensor` [69, 110], `pajarera` [196, 110],
`office` [288, 110], `catacumba` [520, 110]; `catacumba.entries.pecera` [32, 116]; `office.entries.pecera` [30, 112];
`vestibulo.entries.pecera` [289, 112] (pie de la escalera, detrás de los tornos), `ascensor`/`cpd` [251, 110];
`ecosistema.entries.pecera` [31, 112], `ascensor` [69, 110], `eventos` [216, 114], `administracion` [404, 116].
`tools/smoke.mjs` comprueba plantas, escaleras y vecindad; `tools/play-mouse.mjs --solo=conexiones` recorre cada salida en
los dos sentidos con clics reales y mide dónde se aparece.

### 2.7 Redesign engine features (art side) — details in `docs/GUIA_REDISENO.md` §13
- **Seated pose** (`engine/pose.js`): NPC layout `at: [x, y, dir], pose: 'sentado'` (torso lowered, lap and calves;
  in profile, thigh forward) or `'tras_mesa'` (hip up only, no shadow: the furniture in front —`layer: 'sorted'` with a
  larger `zy`, or `foreground`— hides the rest). Also in `positions`. The pose applies while the actor stands still at
  that placement point; walking stands him up. Scripts: `api.pose(id, pose)` (§7). `actorBox` (clicks, balloons)
  follows the pose. `__game.state().poses` lists the poses in the current room.
- **Penumbra** (`penumbra(view, t)` in the art, every frame): returns `null` or `{ color = '#080c24', alpha = 0.45,
  spots: [[cx, cy, rx, ry, k?], { rect: [x, y, w, h], k? }], borde = 0.55, actor = 0.78, actores: { id: k } }`. It
  darkens everything already drawn (background, objects, actors, `foreground`) EXCEPT the spots (soft edge) and the
  actors, which keep `actor` (0.78 → they only get 22 % of the darkness); per actor: `actores`, the layout `luz`, or
  `api.luz(id, k)` (1 = never darkened). Drawn before `overlay` and `layer: 'front'` objects.
- **Shaped walkboxes**: several polygons (their union is the floor) — U shapes, notches, a strip behind a table. The
  path goes around; sort the furniture with `layer: 'sorted'` + `zy`. A walkbox may have its own `scale`
  (`{ yFar, far, yNear, near }` or a number) that wins over the room's inside it (`Game.roomScale(y, x)`).
- **Minimum hit size**: a click/tap that hits nothing picks a small object whose box, grown (centred) to 12×10 (mouse)
  or 16×12 (touch), contains the point (nearest centre wins). Dialog/duel option rows are 14 px high on touch screens.
- **«Ver hotspots»**: panel eye button (x 287-302, y 144-155), pause menu «Ver objetos de la sala (H)», key **H**
  (1.5 s), hold **Space**, long press on an empty spot (touch). `Game.showHotspots(ms, hold)`; `__game.showHotspots()`
  returns the highlighted list.

> **Rediseño (D1, contrato vigente para el repintado):** un solo NÚCLEO (ascensor + escalera) idéntico en las cuatro
> plantas, a la izquierda de `pecera`, `ecosistema` y `cpd` y a la derecha (tras los tornos) del `vestibulo`; Catacumba
> AL LADO de la Redacción y al mismo nivel (orden de dirección 2; anula la D6); Ecosistema a 400 px; la Pecera reordenada. Coordenadas, entradas y salidas que cambian:
> `docs/GUIA_REDISENO.md` §3 y §9 (datos en `content/lib/edificio.js`). Las diez salas ya están rediseñadas y la tabla
> de §2.6 describe el edificio construido. Única conexión que cambió: la Redacción de papel (`catacumba`) se abre a la
> Redacción (`pecera`) y ya no al Vending (`office`).

## 3. game.js (shared)

What the shared `content/game.js` provides (you use it, you don't edit it):

| key | what |
|---|---|
| `id: 'fe_de_erratas'`, `player: 'bruno'`, `startRoom: 'vestibulo'`, `startEntry: 'inicio'` | |
| `startInventory` | `tarjeta_becario`, `libreta_replicas`, `movil` (bible §4) |
| `onStart` | runs `api.scene('intro')` — the intro §7.1 is package A's scene in `vestibulo.js` |
| `defaults` | bible §8.2 (with the plan §6.2 rewrites, no «Como…» endings): 5 lines per verb, **rotating in order** (not random). Item-on-item with no combo uses the `usar` list. After 10 consecutive failed item combinations, Bruno says the §8.6 line instead |
| `idle` | §8.6: after 60 s without input, Bruno's fourth-wall line |
| `saveMessages`, `saveFirstLine` | §8.6: «Guardando...» ×3 (original, duplicado, triplicado) and Begoña's line the first time |
| `quitConfirm` | §8.6: «¿Seguro que quiere salir? [ Sí ] [ Lo hablamos ]» |
| `learnReply` | §5.5: notice «Réplica apuntada en la libreta.» + sfx `good`, shown only the first time (see `api.learnReply`) |
| `scenes.pistas` | plan §8.5: the grandmother's hints in three levels per objective (Usar `movil` → Llamar a la abuela), texts in `content/pistas.js`; see §7 «Objetivos, pistas y hora» |
| `objetivos`, `hora`, `metaFinal` | plan §8: the objectives list and the phone time function (`content/pistas.js`), read by `engine/objetivos.js` (`api.objetivo`, `api.hora()`) |
| `afterEnter`, `scenes.avisos` | **Automatic notices** (addendum §2), see «Avisos» below |
| `migrarPartida(state)` | plan §3.4: called by the engine on **every** load (idempotent), after its own position migrations: removes retired items (`planillo`; `posit_baja_ruben` → `ticket_n1` + `ruben_libre`) and retired flags; E2: old Evaristo calls (counter) → per-call marks, `correo_evaristo_listo` → item `correo_evaristo`; a `coma_bendecida` without `correo_evaristo_listo` is undone (step 32 can be played); drops `evaristo_lc`, `evaristo_convoco`, `rumor_firma_n`, `planta_oyo`, `pecera_nemesio_saludo` and the saved positions of the retired actors `nerea_backlog` / `borja_engagement` |
| `pantallas` | E2: objects that «speak» with a fixed prefix/colour, used by `api.pantalla(obj, text)`: `herminia_portatil` → «HERMINIA (IA) › » #FF8C3C; `aro_borja`, `eventos_a_ecosistema` #4FD8E8; `pantalla_comercial` #FF8A60 |
| `startFlags` | the 28 flags of addendum 6.2 initialised: counters `0`, booleans `false` |
| `title`, `ending`, `credits` | title screen (front page), credits shell with the «Fe de erratas» box and Gertrudis' LCD (§14) |
| `music` | imports `content/music.js` |

### Avisos (addendum §2): incoming calls and «RV:» notices — common, nobody has to call them
After the `onEnter` of **every** room the engine runs `game.afterEnter`, which plays the scene `avisos`
(`content/game.js`): **at most one notice per room entry**. **ENMIENDA E2 §5.7:** only Evaristo's calls L1
(`torno_abierto`), L3 (`pieza_recortada`), L4 (`acto_3_iniciado` and `!ruben_encontrado`; lost if Rubén is found first)
and L5 (`ruben_libre` and `!climax_entrada`); L2 and the LC are gone (counter `evaristo_llamadas` = calls heard; each
call also leaves `once:evaristo_L<n>`). Tadeo's «RV:» mails are **no longer notices** (E2 §7.4): they arrive silently in
the phone's mailbox when their condition holds (`tadeo_rv_n` = arrived). Calls come in order and wait for their
condition; they never set bible flags (the E2 bridge for `evaristo_convoco` was removed at integration). They do **not** play
when the entry already ran a scene / dialog / duel / cutscene (the engine counts `api.scene` (except `avisos`/`pistas`),
`api.dialog`, `api.duel`, `api.cutscene` during `onEnter`), when loading a save, in `sala_amazonas` with
`acto_3_iniciado`, or after `juego_terminado`. Consequences for room authors:
- A room whose entry triggers a story scene **must run it from `onEnter`** so the engine sees it and skips the notice.
  Don't call `api.scene('avisos')` yourself unless you want a notice after something custom: it is idempotent per entry
  (`game.avisoEntryN`).
- Texts are literal from the addendum (calls speak as `evaristo_salvedad`, RV as `tadeo_adjunto`, always at the top of
  the screen). While one plays `__game.state().aviso === true`; a click closes each balloon. Closing a call balloon very
  early the first time in the game triggers «No se puede colgar a Evaristo…» (once).
- Mirar `movil` (with `tadeo_rv_n` ≥ 1), Mirar `libreta_replicas` («[N] de 16») and the grandmother's extra greeting
  (once, first call with `evaristo_llamadas` ≥ 2, before the hint) are already in `items.js` / `game.js`.

Other game-level options the engine understands: `narratorColor`, `noWalkVerbs`, `autosave`, `verbs`, `walkVerb`,
`prepUsar`, `prepDar`, `playerHotspot` (default true: the player sprite is clickable if its actor has `handlers`),
`murmurAfterMs` (default 20000), `speechBacking` (`{ color, alpha }` of the dark band drawn under every spoken line,
default `SPEECH_BACKING` in `engine/core.js`, 80 %; `null` removes it; checked by `tools/contrast.mjs`).

**Screen & mobile** (`engine/fullscreen.js`): «Pantalla completa» in the title and pause menus and the **F** key use the
Fullscreen API (+ `screen.orientation.lock('landscape')`); on iPhone Safari (no Fullscreen API) the option shows a panel
explaining how to install the web app (`manifest.webmanifest`, apple-mobile-web-app metas, `icons/`). The canvas fits
the safe area (`viewport-fit=cover` + `env(safe-area-inset-*)` padding on `#stage`), integer scale on desktop, full-height
nearest-neighbour scale on high-density touch screens; a non-blocking «gira el móvil» hint shows in portrait.

---

## 4. Objects / hotspots

Logic keys (in `content/rooms/<id>.js`):
```js
{
  id: 'fax',                       // unique in the room; global key 'catacumba.fax'
  name: 'fax',                     // sentence line; may be (view) => string
  state: 'sin_papel',              // initial state (any JSON value); api.setState('fax', 'con_papel')
  states: ['sin_papel', 'con_papel'],   // documents the states the art may draw (sprites); checked by buildRoom
  visible: true,                   // initial visibility (api.show/hide; saved)
  when: 'acto_3_iniciado',         // condition (§8), evaluated EVERY FRAME: hidden + not clickable while false
  hotspot: true,                   // false = decorative only
  defaultVerb: 'mirar',            // right-click verb (default: 'ir' for exits, else 'mirar')
  color: '#D9CFA6',                // text colour when the object "speaks" (api.sayFrom)
  murmurs: ['¿Sigue siendo marzo?'],   // optional §8.5 murmurs (hover 0.7 s / 20 s idle in the room)
  murmurColor: '#E0CCA4',
  desc: 'Texto de Mirar.',         // = handlers.mirar
  pickup: 'planillo',              // = handlers.coger: reach anim, give item, hide object, sfx
  pickupText: '...',
  exit: { room: 'pecera', tipo: 'puerta_doble', entry: 'catacumba', sfx: 'door' },   // = handlers.ir (entry defaults to this room id)
  handlers: { ... },               // §6
  walk: false, walkTo: [x, y], face: 'up', priority: 0,         // usually in the art; the logic may override
}
```
Art keys (in `layout[id]`): `rect` / `poly`, `walkTo`, `face`, `walk`, `priority`, `layer` (`'back'` | `'sorted'` |
`'front'`), `zy`, `cache`, `cachePad`, `draw(g, view, t)` or `sprites: { <state>: fn, default: fn }`, `prop: true` (the drawing is furniture that hides actors' legs —
a counter, a desk—: it is painted even while the hotspot is hidden or its `when` is false; `view.visible` tells).

**Exits and locks.** Keep `exit: { room }` on every exit hotspot (the walkthrough's travel and `check.mjs` read the
exit graph). Put the lock in `handlers.ir`, which runs before the `exit` shortcut:
```js
{ id: 'torno', name: 'torno', exit: { room: 'pecera' }, handlers: {
    ir: async (api) => { if (!api.flag('torno_abierto')) { await api.say('...'); return; } await api.goto('pecera'); },
    'usar:tarjeta_becario': async (api) => { ... } } }
```
Clicking an exit with no verb is «Ir a <exit>». If "Usar/Abrir puerta" should also move, add those handlers.

**Exit type (`exit.tipo`, required).** Every exit declares what the player SEES: `escalera`, `arco`, `cristal`,
`puerta`, `puerta_doble`, `pasillo` or `torno` (`content/lib/edificio.js` `TIPOS_SALIDA`). A connection must look the same
from both rooms: `tools/check.mjs` fails if the types A→B and B→A differ (the one-way `torno` aside), or if an opening
without a leaf (`arco`, `pasillo`, `escalera`) is named «puerta…» or plays the `door` sfx. Current map: vestíbulo ↔
Redacción and Redacción ↔ Marketing `escalera`; Redacción ↔ Vending `arco`; Redacción ↔ Despachos `cristal`; Redacción ↔
Redacción de papel `puerta_doble` (open); Despachos ↔ Sala Amazonas `puerta` (wedged open; shut only in Act III until the
climax); Marketing ↔ Eventos `puerta_doble` (ajar, portholes); Marketing ↔ Administración `pasillo`.

Object state & visibility are saved (`state.objects['room.id']`). Other rooms' objects: `'room.objId'`.

---

## 5. Actors

### 5.1 Definitions (`content/actors.js`, shared)
All characters of bible §2 with their exact ids, names and text colours:
`bruno` (player), `celestino`, `yoli_tendencias`, `teodoro_cuerpodoce`, `aurora_galerada`,
`gervasio_acta`, `begona_triplicado`, `maripaz_remitido`, `paco_ticket`, `inigo_sinergia`, `anselmo_monolito`, `leoncio_quesitos`,
`ruben` (E2: `nerea_backlog` —Nemesio, merged into Anselmo— and `borja_engagement` —now the `aro_borja` object of Marketing— no longer exist), `abuela_remedios` (**phone only**: never placed in a room; `api.sayAs('abuela_remedios', ...)` shows her text at
the top), `ramirez` (post-credits only), and the two "objects with character", which are actors so that their text
appears above them in their colour: `gertrudis` (LCD `#39FF14`, custom sprite, `defaultVerb: 'hablar'`) and
`lector_medio` (the Lector Medio, a marketing buyer-persona cardboard standee: stock-photo smile, blue jumper, folded
newspaper, chest card «LECTOR MEDIO · 43 años…», taped speaker; recording colour `#CCCCCC`; variants `chaqueta` when
`chaqueta_en_lector`, `caido` when `lector_derribado`, chosen automatically).
**Addendum cast** (adenda §1/§11.2/§13): sprite characters `pilar_escaleta` (Eventos, `#A8F07A`), `leoncio_quesitos` (`#3CE0C6`), `anselmo_monolito` (`#E496FF`),
`evaristo_salvedad` (`#F0F0A8`) and the cameo `valentin_reticula` (`#C0E8FF`). **Sprite-less presences** only give a
speaking name/colour to `api.sayAs` (flag `presence` in the definition, `hotspot: false`, never placed in a room):
`custodia_precinto` (`#A0A0FF`), `tadeo_adjunto` (`#FFCC99`), `herminia` (`#FF8C3C`), `coro_desarrollo` (CORO), `dev_1`,
`dev_2`, `dev_3` (`#7FFFD4`; the balloon text carries the prefix «DEV 1: …»), `altavoz_ibex` (ALTAVOZ, `#CCCCCC`). The
hotspot that represents a presence is an **object** of the room with the same id (e.g. `pecera.custodia_precinto`) whose
`color` is declared in the stub, so `api.sayFrom('custodia_precinto', '…')` draws the text above it in its colour.
Contact sheet: `node tools/actors.mjs` → `tools/shots/actores.png`.

```js
ejemplo: {
  name: 'Ejemplo', color: '#ffffff', speed: 66,
  doll: { ... } /* or */ sprite: customSprite,
  scale: undefined,                // fixed scale (ignores the room's perspective)
  defaultVerb: undefined, hotspot: true,
  handlers: { ... },               // global handlers; room placements override per key
  murmurs: [...] | (view) => [...] | null,          // §8.5
  variants: { key: { doll: {...} } | { sprite } },  // alternative looks
  variant: (view) => 'key' | null,                  // which variant to draw now
  drawExtra: (g, actor, t) => {},
}
```
The player `bruno` has handlers (`mirar`, `usar:tarjeta_becario`, §8.6): its sprite is clickable (lowest priority).

### 5.2 Placement in a room (logic `actors`)
```js
actors: [
  { id: 'gervasio_acta',
    when: ['reunion_terminada', '!acto_3_iniciado'],   // presence condition (§8); omit = always here
    pos: 'mesa' /* or (view) => 'rincon' */,           // named position from the art's layout[id].positions
    name: undefined, walkTo: undefined, face: undefined, defaultVerb: 'hablar',
    handlers: { hablar: async (api) => api.dialog('gervasio_pajarera'), 'dar:planillo': '...' } },
]
```
- Position (`x, y, dir`, `walkTo`, `face`) comes from the art (`layout[id].at`, `.positions`).
- **Presence with `when`** is re-evaluated when entering the room (also after loading) and **whenever a blocking script
  ends**: true → the actor is moved into this room at its (named) position if it wasn't here; false → removed from
  this room. Several rooms can list the same actor with mutually exclusive `when`s (Gervasio: sala_amazonas /
  pajarera / office / sala again). Placements **without** `when` give the actor's initial room (first one wins).
- Inside a scene, move people explicitly: `api.walkActor`, `api.placeActor(id, room, x, y, dir)`, `api.hide/show(id)`,
  and call `api.refreshActors()` if you change flags mid-scene and want the cast updated before the script ends.
- Actor placements and positions are saved.

### 5.3 Paper doll parameters (`doll`)
All optional; colours are hex; shading is derived.

| key | values | notes |
|---|---|---|
| `skin`, `hair`, `eyes` | colour | |
| `hairStyle` | `short` `parted` `long` `bob` `bald` `balding` `ponytail` `bun` `curly` `afro` `mohawk` `spiky` `buzz` `cowlick` `combover` `bouffant` `quiff` `highponytail` `mane` `curlybun` | |
| `hairStreak` | colour | streaks (Yoli's fuchsia) |
| `hairPencil` | colour | pencil/pen through a bun (Aurora) |
| `shirt`, `jacket`, `vest`, `stripes` | colour \| null | `untucked: true` = shirt hanging out (no belt) |
| `sleeves` | `'long'` \| `'short'` | |
| `tie`, `bowtie`, `scarf`, `scarfStripe` | colour \| null | |
| `badge` + `badges` | colour + count | lanyard with N badges (Borja: 9) |
| `suspenders`, `cuffs`, `armbands`, `bracelets`, `sleeveNotes` | colour \| null | tirantes, ink on cuffs, manguitos, pulseras, pósits on the sleeve |
| `emblem`, `crumbs`, `dots`, `epaulettes`, `keys` | colour \| null | chest patch, crumbs, dotted dress, galón, keys on the belt |
| `hood`, `neckphones`, `headset`, `earpiece`, `headphones`, `backpack` | colour \| null | |
| `pocketItem` + `pocketKind` | colour + `pen` \| `ruler` \| `phones` \| `radio` | |
| `prop` + `propColor` | `folder` `camera` `mallet` `stamps` `postits` `eyedrops` `laptop` `phone` | held item |
| `pants`, `skirt`, `shoes` | colour | |
| `glasses`, `glassesColor`, `glassesChain`, `glassesTape` | `round` `square` `sun` `half` `thick` | |
| `beard` | `full` `goatee` `stubble` `long` | `mustache: true` |
| `eyebags`, `pencil` (+ `pencilColor`) | bool | |
| `hat`, `hatColor` | `cap` `fedora` `beanie` `visor` | |
| `earrings`, `lipstick` | colour | |
| `height` (0.85–1.15), `build` (`slim` \| `normal` \| `athletic` (normal shoulders, slim waist) \| `heavy`), `belly`, `outline` | | |
| `tieDots` | colour | little marks on the tie (Evaristo's commas) |
| `loupe` | colour | magnifier hanging from a cord on the chest (Evaristo) |

Animations: `idle` (blinks), `walk` (4), `talk` (3, automatic while speaking), `reach` (`api.anim(id, 'reach', ms)`).
Directions `down`, `up`, `right` (`left` mirrored). Custom sprites: `defineSprite({ w, h, ox, oy, headY, hitW, anims,
dirs, outline, shadow, draw(g, anim, dir, frame) })` from `engine/sprites.js`.

---

## 6. Handlers & the fallback chain

Keys: `'mirar'`, `'coger'`, … (verb; `'ir'` = walking to it) · `'usar:<item>'` / `'dar:<item>'` · `'usar:*'`,
`'dar:*'` · `'*'` (any verb except `ir`) · on **items** only: `'usar:<targetId>'` and `'usar:*'`.
Values: `async (api) => {}` · `'texto'` (Bruno says it) · `['a', 'b']` (random) · `{obj}` in strings = target name.

With an item (`Usar chicle con tarjeta_becario`, `Dar café a Aurora`):
1. `target.handlers['verb:item']` → 2. `items[item].handlers['verb:targetId']` → 3. item-on-item `usar`:
`items[item].combine[target]`, `items[target].combine[item]` → 4. `target.handlers['verb:*']`,
`items[item].handlers['verb:*']` → 5. `target.handlers['*']` → 6. `room.defaults[key]`, `room.defaults['*']`,
`game.defaults[key]` (`game.defaults.usar` for combos), `game.defaults['*']` (`key` = verb, or `'combine'`).

Without an item: `target.handlers[verb]` → shortcuts (`desc`, `pickup`, `exit`) → `target.handlers['*']` (not for
`ir`) → `ir` stops here → room defaults → game defaults.

Actor targets merge handlers from the actor definition and the room placement (placement wins per key).
**Item used on a room object or NPC = handler on that object/NPC in your room** (`'usar:copias_rechazadas'` on `fax`,
`'dar:cafe'` on `aurora_galerada`). The shared `items.js` only has item-level behaviour (§11).

---

## 7. Script API

Every handler, hook, dialog callback, scene and ambient runs as `async (api) => {}`. Always `await` things that take
time. Blocking scripts lock input; errors are caught and logged (`[motor] Error en script [...]`), input is released.

### Context
`api.room`, `api.verb`, `api.obj` / `api.target`, `api.item`, `api.player`, `api.flags` (prefer `flag`/`setFlag`),
`api.skipping` (cutscene being skipped / test fast mode), `api.restoring` (true inside `onEnter` when a save is being loaded: skip per-entry gags and counters), `api.comboFails`, `api.game` (raw engine, avoid).

### Speech
| | |
|---|---|
| `await api.say(text \| [lines], opts?)` | Bruno speaks; arrays = consecutive balloons |
| `await api.sayAs(actorId, text \| [lines], opts?)` | another actor (above its head if in the room, else at the top) |
| `await api.sayFrom(objId, text \| [lines], opts?)` | an **object** speaks: text above the object in `opts.color` or the object's `color` (LCD, fax, torno LED, TV) |
| `await api.pantalla(objId, text \| [lines], opts?)` | E2: like `sayFrom` with the prefix and colour registered in `game.js` `pantallas` (`api.pantalla('herminia_portatil', 'hola: 100 %')` → «HERMINIA (IA) › hola: 100 %»); a leading «›» is not doubled; `opts.prefijo`/`opts.color` override |
| `await api.narrate(text \| [lines], opts?)` | narrator/caption («rótulo») at the top (`game.narratorColor`) |
| `await api.sayRandom([lines])` | |
| `api.notice(text, { color, ms })` | non-blocking notice at the bottom of the room view |

`opts`: `{ ms, color, width }`. Duration ≈ 0.9 s + 55 ms/char × text speed. Every line goes to `__game.log`
(`who` = actor id, object id for `sayFrom`, `'narrador'`, `'aviso'` for notices).

### Llamadas de teléfono (`api.phone`, `engine/phone.js`)
**Toda llamada del juego usa el primer plano del móvil** de Bruno (grieta en la esquina, pantalla con el nombre, cronómetro,
icono verde «en llamada» y retrato animado de quien llama; la sala se oscurece detrás). El móvil se desliza por el lado
contrario al de Bruno; el texto de quien llama sale en un globo con marco de su color y un piquito que apunta al retrato;
Bruno habla sobre Bruno (con el móvil en la oreja) y los demás globos se acomodan en el hueco libre.
| | |
|---|---|
| `await api.phone.open({ caller, label?, outgoing?, ringMs?, side? })` | `caller` = id de actor (su `portrait`, o la cabeza de su sprite si no tiene). Entrante: suena, vibra y Bruno descuelga; `outgoing: true`: Bruno llama («Llamando...») |
| `await api.phone.say(text \| [lines], opts?)` | habla quien llama (anclado al móvil). `api.say` sigue siendo Bruno |
| `await api.phone.close()` | pitidos de colgar, «fin de llamada» y el móvil se desliza fuera |
| `await api.phone.call(opts, async (api) => {...})` | `open` + cuerpo + `close` garantizado (también si el cuerpo lanza). **Úsalo siempre que puedas** |
| `api.phone.active`, `api.phone.caller` | estado |
| `await api.phone.app({ title, rows: [{ text, sub?, dot?, icon?, color? }], body?: [líneas], caller? })` | MODO APLICACIÓN (sin llamada): abre el móvil, o cambia su pantalla, con una lista o un texto. El menú se elige con `api.choose(opciones, { escape: i })` en el panel |
| `await api.phone.read(who, text \| [lines], opts?)` | un globo anclado al móvil (el texto de un correo); `who` = id de actor o `null` |
| `await api.choose(options, { escape })` | (general) `escape` = la opción que eligen Esc y un toque en la sala fuera del móvil; los toques de los primeros 250 ms no cuentan (doble toque seguro). Al cargar partida, un menú con `escape` se cierra por ella |
Retratos: `portrait(g, w=72, h=54, { mouth: 0..2, blink, t })` en la definición del actor (ver `content/lib/retratos.js`: Abuela y
Evaristo). Cualquier `sayAs(caller)` con el móvil abierto se ancla solo al móvil. El móvil se retira siempre: al cerrar, con
Esc (cinemática saltada), en modo rápido (`skipText`, instantáneo), al terminar el script que lo abrió aunque falle, y al
cargar partida. `__game.state().phone` = `{ caller, label, state: 'ring'|'talk'|'hang'|'out', side }` o `null`; el log
recibe avisos `Llamada de X` / `Cuelga: X`. Llamadas del juego: intro, `pistas` (Usar móvil), epílogo (`final.js`) y los avisos
L1–L5 de Evaristo (`game.js`). Los correos «RV:» de Tadeo no son llamadas (siguen con globo y aviso).

### Movement & animation
`api.walkTo(x, y | [x,y] | 'objOrActorId')`, `api.walkActor(id, ...)`, `api.face(dir|target)`,
`api.faceActor(id, dir|target)`, `api.placeActor(id, room, x, y, dir?)`, `api.actorPos(id)`,
`api.anim(id, name, ms=600)`, `api.cameraTo(x)` (when the last blocking script ends, the camera follows the player again),
`api.cameraFollow(id?)`, `api.show(id)` / `api.hide(id)` /
`api.isVisible(id)` (objects and actors), `api.refreshActors()` (re-apply `when` presence now).

### Poses, light and held objects (redesign)
| | |
|---|---|
| `api.pose(id, pose)` | `'sentado'` \| `'tras_mesa'` \| `'de_pie'` (force standing) \| `null` (back to the pose of its placement). Saved. Walking clears an explicit sitting pose |
| `api.luz(id, k)` | exemption from the room `penumbra`: 0 = darkened like the background … 1 = never; `null` = the room's default. Saved |
| `api.sostener(id, itemId \| { draw(g, x, y, s, dir) } \| null)` | object in the hand (an inventory icon at half scale, or your own drawing). Released when the blocking script that set it ends; not saved |

### Plano detalle (close-up insert, `engine/detalle.js`)
`await api.detalle({ draw(g, r, t, k), w = 150, h = 84, x?, y? = 8, titulo, color, lines, ms = 1800, oscurecer = 0.45 }, async (api) => {...}?)`
— a framed, enlarged insert over the room (screen coordinates; `r = { x, y, w, h }`, clipped; `t` = ms since it
opened; `k` = opening 0..1) with an optional caption tab. Balloons go below it (`hudTop`). It stays open while its
`lines` are said (`[who, text]` with who = actor id, `'player'`/`'B'` or `'narrador'`; a plain string = narrator) and/or
its body runs; with neither, for `ms` or until a click / «.». Esc (skipped cutscene) and fast mode resolve it at once;
it always closes when the script that opened it ends (even on an exception) and on loading a save (never saved). The
log gets `aviso: Plano detalle: <titulo>`; `__game.state().detalle = { titulo, cerrarX, cuenta, bloqueado } | null`.
Used by the 7.2 Titulator.
**Ads (ENMIENDA E2 §4.2):** `bloqueo: ms` (a click / «.» cannot close it before; Esc and fast mode can),
`cuenta: { ms, texto: 'Podrá continuar en {n}', fin: 'Saltar anuncio ›' }` (the engine paints the countdown at the
bottom right; implies `bloqueo: cuenta.ms`; without `ms` it stays `cuenta.ms + 1500`), `cerrarX: px` (the engine paints
the close «×» of that size in the top-right corner; 1-2 px = a dot; 0 = none). Helpers exported by `engine/detalle.js`:
`cuentaAtras(t, ms)`, `dibujarX(g, x, y, px, color)`, `bloqueado(game)`. Demo: `tools/demo-fase0.js` (`demo_popup`,
`demo_anuncio`).

### Time & effects
`api.wait(ms)`, `api.fadeOut(ms)`, `api.fadeIn(ms)`, `api.shake(ms, px)`, `api.sfx(name|def)`, `api.music(id|null, fade)`.

### Efectos de situación (plan de comedia §4 y §9, `engine/efectos.js`; demo: `tools/demo-fase0.js`)
| | |
|---|---|
| `await api.apagon({ ms: 3000, alpha: 0.88, color, spots: [[cx, cy, rx, ry]], actor: 0.25, parpadeo: true })` | the room goes dark (same painting as the penumbra: `spots` = screens that stay lit, `actor` = how much actors are spared). With `ms` it resolves when the light comes back; `ms: 0` keeps it until `api.apagon(false)`. Example (§4.2): `await api.apagon({ ms: 3000 }); await api.sayAs('nerea_backlog', 'Pone «NO DESENCHUFAR».')` |
| `await api.estampida(ids, { puerta: [x, y], atascoMs: 900, gap: 120, destino: null, prisa: 1.8, enAtasco: async (api, atasco) => {} })` | several actors flee through one door: they hurry there, get stuck in the frame (±3 px, shake 300 ms, `enAtasco` lines meanwhile; `atasco.alFrente(id)` puts the one who speaks a step in front so nobody covers him) and pop out one by one (`destino`: room id or `null` = gone). §4.4: `await api.estampida(['mercados_1', 'mercados_2', 'mercados_3'], { puerta: [24, 112], enAtasco: async (api) => { await api.sayAs('mercados_1', '¡Usted primero!'); } })` |
| `await api.megafonia(actorId, text \| [lines], { blocking: false, etiqueta: 'MEGAFONÍA', y: 44, sfx })` | an actor's voice through a speaker (lift, building): balloon at the top in his colour with a «MEGAFONÍA» tag above (not part of the 80 chars), the actor needn't be in the room; non-blocking unless asked. The log gets `who` = actor id and `tag: 'MEGAFONÍA'` |
| `api.viral({ avisos: [...], contador: [3418, 11302], etiqueta: 'en directo', cada: 260, ms: 3200, color, sfx })` | burst of phone-like notifications in the top-right corner and an optional counter that jumps (`saltos: 3`). Non-blocking; `await` it to wait for the end |
| `await api.titular(text, { who, from, blocking, ms })` | the line is drawn as a **newspaper headline strip** (paper, bold black, red rule); `who` = actor (default Bruno: his headlines while «contagiado», §4.6), `from` = an object (the Titulator screen). Logged like any line |
| `await api.tarjeta({ titulo: 'FE DE ERRATAS', lineas: [...], minMs: 6000, boli: true, pie, draw(g, t), music })` | static full-screen card over everything (the final «fe de erratas», §9): it cannot be closed before `minMs`; then a click closes it. Instant in fast mode |
| `api.vestir(actorId, variante \| null)` | explicit sprite variant (one of the actor's `variants`), saved with the game; `null` = back to `variant(view)`. Bruno has `con_chaqueta` (automatic with `bruno_con_chaqueta` + the jacket in the inventory: `Usar chaqueta_ramirez` sets it, §4.3) |
| `await api.decir([[who, text], ...], voces?)` | says a sequence in the ambient line format (§2.4) |

Short credits without post-credits (§9): `await api.tarjeta({...})` and then `await api.ending({ credits: [...] })` —
the ending returns to the title after a click; nothing runs after it.

### Objetivos, pistas y hora (plan §8, `engine/objetivos.js`; datos en `content/pistas.js`)
The objectives list (`content/pistas.js` `OBJETIVOS`: id, `hecho` condition, `activo` condition, `salas`, `meta`,
three hint levels, `extra`) is shared data; **each objective is done by its own flag**, so room authors normally do
nothing. The ficha (`ficha_pagina_7`) is a living checklist (`content/items.js` `fichaViva`), «Mirar a Bruno» says the
current goal, and the grandmother (Usar móvil → Llamar a la abuela) gives hints in three levels.
| | |
|---|---|
| `api.objetivo.marcar('hueco')` | marks a milestone by hand (engine flag `obj:<id>`), for a goal without its own flag |
| `api.objetivo.hecho(id)` · `api.objetivo.pendientes()` · `api.objetivo.lista()` | queries (`lista()` = `[{ id, hecho, activo }]`) |
| `api.objetivo.actual(sala?)` | first pending objective of that room (default: Bruno's), else the first pending one |
| `api.objetivo.meta(sala?)` | Bruno's goal line for «Mirar a Bruno» |
| `api.objetivo.pista()` | `{ obj, nivel, repetida, def }`: next grandmother hint (advances `abuela_obj` / `abuela_nivel`); used by `game.js pistas` |
| `api.hora()` | the story time on the phone: `'18:30'` → `'21:00'` by milestones (§8.4), never goes back. **Building clocks stay at 20:59** (draw them with `wallClock`, default 20:59). Use it for any «Son las…» that is not a wall clock: `await api.say(\`Son las ${api.hora()}.\`)` |

Hint algorithm (§8.5): objective of the room → the previous call's if still pending → the first pending; same
objective as last time = one level more (1 metaphor → 2 concrete → 3: the grandmother's line and, after hanging up,
Bruno says the action); a repeated level 3 starts with «Te lo digo otra vez, hijo, que no comes.»; every call ends in
«Abrígate.»; the first call with `cafetera_viral` tells the viral video once.

### Celestino narra (plan §4.7, `content/lib/celestino.js`)
`await narrarHito(api, { via: 'globo' | 'megafonia' })` narrates the most recent milestone not yet told (and marks the
older ones); returns false if there is none. `hitoPendiente(api)` peeks. The lift already does it by megafonía
instead of its rotating phrase; the Vestíbulo (P1) calls it on entry.

### Movement (engine/mover.js)
Double click / double tap on an **exit** Bruno is walking to = he is there at once and leaves; double click on the
**floor** = he runs (×2.2, small hop); **holding** the button (or dragging a finger on the floor) = he follows the
pointer. Scripted walks (`api.walkTo`, `api.walkActor`) never run. A NPC walking under a non-blocking script waits
while the player has a verb/item selected or the pointer over him, and a walking NPC's click box is 4 px larger.

### Inventory
`api.give(id)`, `api.take(id)`, `api.has(id)`, `api.inventory()`.

### Flags & state
`api.flag(name)`, `api.setFlag(name, value = true)`, `api.inc(name, by = 1)`, `api.once(key)` (true only the first
time, saved), `api.cond(c)`, `api.getState(objId)`, `api.setState(objId, v)`, `api.setWalkbox(id, on)`, `api.repaint()`.

### Duels
| | |
|---|---|
| `api.learnReply('rep_07')` | teaches a reply: sets the flag and, **only the first time**, shows «Réplica apuntada en la libreta.» + sfx `good`. `'R07'` is also accepted. Returns true if it was new |
| `api.knowsReply('rep_07')` | |
| `const won = await api.duel('maripaz')` | runs a duel (§10). Also `api.duel({ id, ...inline definition })` |
| `const id = await api.pickItem(prompt)` | inventory picker in the panel; resolves with an item id or `null` |

### Flow
| | |
|---|---|
| `await api.goto(roomId, entryId?)` | change room (onExit, fade, onEnter, autosave); the script continues in the new room |
| `await api.dialog(dialogId, nodeId?)` | §9 |
| `const i = await api.choose(['a', { text: 'b', disabled: true }])` | options in the panel; disabled = grey, not selectable |
| `await api.scene(name, ...args)` | run a named scene registered by any room (`scenes`) or game.js. A missing scene only warns (stubs) |
| `await api.cutscene(async (api) => {})` | skippable with Esc |
| `await api.credits(opts?)` | credits INSIDE the game: scrolls `opts.credits`, resolves by itself when the text is gone and the game stays in `'play'` (same room), so the script can go on (post-credits). Instant in fast mode |
| `await api.ending(opts?)` | the end: credits/last image; a click at the end returns to the title. The finished game's state stays in `__game.state().finished` |
| `api.background(fn)`, `await api.run(fn)`, `await api.defaultResponse()` | |
| `api.random(arr)`, `api.pick(arr)`, `api.log(...)` | |

---

## 8. Conditions

Used by dialog options (`if`), objects and actor placements (`when`), ambient events (`if`) and `api.cond()`:
`'nombre'` (truthy) · `'!nombre'` · `'has:item'` / `'!has:item'` · `'nombre=valor'` (`String(flag) === 'valor'`) ·
`['a', '!b', 'has:c']` (all) · `(api) => boolean` (any logic; in `when` of objects the argument is a script api).
In debug mode, reading or setting an undeclared flag warns (§12).

---

## 9. Dialogs

Room-local `dialogs` (looked up first) or global maps. `api.dialog('id')`. 5 visible lines, scroll arrows if more.
```js
dialogs: {
  celestino: {
    actor: 'celestino', start: 'C0', onStart: async (api) => {}, onEnd: async (api) => {},
    nodes: {
      C0: {
        onEnter: async (api) => {},          // may return a node id or 'exit'
        fallback: undefined,                 // node if no option is available (else the dialog ends)
        options: [
          { text: '¿Tiene algo para los nervios?', if: '!celestino_dio_chicle', reply: 'Chicle. Para los nervios del cierre.',
            do: async (api) => { api.give('chicle'); }, setFlag: 'celestino_dio_chicle' },
          { text: '¿Algún cotilleo?', once: true, lines: [['celestino', '...'], ['player', '...'], ['narrator', '...']],
            do: async (api) => { api.learnReply('rep_05'); } },
          { text: 'Nada, Celestino.', exit: true, reply: 'Nada es lo que más entra por ese torno.' },
        ],
      },
    },
  },
},
```
Option order: player line (unless `silent`; `say` overrides the text) → `reply` (by `replyBy` or `actor`) → `lines`
→ `do()` → `setFlag` → navigation (`do` returning a node id wins; `'exit'`/`exit: true` ends; else `goto`; else stay).
`once` is tracked per `dialogId.nodeId.(option.id || index)`. Bible «(se queda)» = no `once`; options that "disappear"
= `once: true` or an `if`. **Use the bible's option text verbatim**: the walkthrough selects options by text.

**Farewells are heard once (ENMIENDA E2 §7.2, engine).** An option with `exit: true` is said in full (player line,
`reply`, `lines` and whatever its `do` says) only the **first** time that option is chosen in that tree; afterwards the
dialog closes silently: nothing is said, but `do` still runs (effects, sfx, flags) with its lines muted (`game.mudo`).
The mark is internal and per tree and option (`game.state.dialogs['despedida_oida:<tree id>.<option id or text>']`, saved
with the game; not a flag), so a sub-node exit such as «Mejor no.» is not muted because «Me voy.» was already heard. Opt out with
`siempre: true` on the option (a farewell with plot effects that must be heard) or `despedidasSiempre: true` on the tree.
**Repeatable options (E2 §7.6):** every option is `once` unless it advances the plot while not done (with its `if`),
is a declared rotating one, is a state one or is an exit; `node tools/text-audit.mjs --estatico` lists the others.

---

## 10. Duelos: «Responder a todos»

The engine implements bible §6.2/§6.8; shared data is in `content/duelo.js`; **each rival is defined by the author of
its room** in the logic file's `duels` (ids: `maripaz` D1 in `ecosistema`, `teodoro` D2 in `catacumba`, `gervasio`
D3 in `office`, `inigo` D4 in `sala_amazonas`).

### Rules (what the engine does) — plan de comedia §7
- The rival always attacks, with its `deck` **in order** (rematch: it starts with the card that won last time, flag
  `duel:<id>:empieza`). The attack (or its paraphrase `attackText[pair]`) is said in a balloon **and stays written in
  the window** as `Cuerpo: «…»` while the player chooses.
- **Menu ≤ 5 lines, no scroll**: the correct reply if learned + up to 3 other learned replies (first those of this
  deck, then others, as decoys; a long reply that wraps costs a decoy) + **one weak reply** that rotates per rival
  (engine flag `duel:<id>:floja`; the comodín is part of the rotation). The position of the correct one changes every
  round. Nothing is learned in a duel. On touch screens the duel menu uses 5 rows of 11 px (no scroll).
- Correct reply: +1, the attack leaves the deck, «+1» line in the thread, `onHit(api, duel, pairId)`, then the rival
  takes it with `hurtByPair[pair]` (rival or `duelo.js hurtByPair[<duel id>][<pair>]`; a string, a list of strings or
  a list of `[actor, line]` — another actor, e.g. Rubén in D4, speaks only if he is in the room) or its `hurt` rotation.
- Miss: one more `RE:`, somebody more in copy (`cc1` / `ccSteps[0]` = the rival's own CC, then «Toda la planta», then
  «Dirección»), the attack goes to the end of the deck, and the rival **always** answers (wrong learned reply → `taunt`;
  weak reply → `opp.weakAnswers[text]` → `answers[<duel id>]` → `answerFax` → `answer`) **before** the defeat is decided.
- Comodín: first use per duel → no score change, same attack again; second use = miss.
- Score as text in the title bar: `ACIERTOS 2/3 · FALLOS 1/3` (plus the stamps). Window: 63 px.
- Fair warning before starting if Bruno knows fewer replies of the deck than needed (unchanged).
- Win: «Asignado a:» → the rival, flag `duel:<id>:won`, `onWin`.
- Finishers (remates): unchanged — replies greyed out, **[Usar objeto]** / **[Retirarse del hilo]**; wrong object =
  a line, not a miss.
- **Defeat** (`maxMisses`): the rival's `defeatLine` (string = narrator caption, or `[who, line]`; default the
  «Lo que diga Gervasio» caption) → window closes → `duel:<id>:perdido_n` + 1 → `defeatLines` → the **defeat scene**
  `defeatScene: '<scene name>'` (called with `{ duel, perdidos, ctl }`) and/or `onLose(api, duel, 'lost')` (`duel.perdidos`
  = defeats so far) → `defeatHeadline` (string or `(n) => string`) shown as a headline strip (`api.titular`). Never
  takes anything from the inventory.
- Retiring: no consequence (no `perdido_n`), thread «RV: Bruno ha abandonado el hilo.», `onLose(api, duel, 'retired')`.
- **No autosave while a duel is open.** A save made during a duel (only possible by the test API) remembers it: loading
  it **restarts that duel from 0** (with the notice «Se retoma el hilo.»), it never drops the player in the room.
- `await api.duel(id)` returns `true` only on victory. `__game.state().lastDuel = { id, result, hits, misses, perdidos }`;
  while open, `__game.state().duel` = `{ attack, body, options, optionPairs, correctIndex, weakIndex, cc, score, … }`.

### Rival definition (in your room's `duels`)
```js
duels: {
  inigo: {
    actor: 'inigo_sinergia',                 // who speaks (should be in the room)
    from: 'Íñigo Sinergia',                  // «De:» (default: actor name)
    to: 'Todos', cc: null,                   // optional
    subject: 'Plan Cero Papel – Llamar a la rotativa para apagarla',   // without «RE: »; the engine shows «RE: » + subject
    re: 1,                                   // initial number of «RE:» (default 1)
    assigned: 'Vacante (perfil ideal)',      // initial «Asignado a:»
    assignedWin: 'Íñigo Sinergia',           // «Asignado a:» when Bruno wins (default `from`)
    deck: ['R10', 'R12', 'R13', 'R05', 'R01', 'R07'],   // bible §6.4, in order
    winScore: 3,                             // ignored when there are finishers (the last finisher ends it)
    maxMisses: 3,
    style: 'mail',                           // 'fax' = fax-paper window + answerFax lines (Teodoro)
    say: undefined,                          // async (api, line) => {} custom speaking (e.g. Teodoro through the fax)
    attackText: {},                          // plan §7.4: the rival's PARAPHRASE of each attack { R10: '...' }
    cc1: 'Optimal Brains & Partners',        // CC added on the 1st miss (then «Toda la planta», «Dirección»); or ccSteps: [...]
    weakAnswers: {},                         // optional { 'Te lo miro y te digo.': 'own answer' } (else duelo.js answers[id])
    hurtByPair: {},                          // optional { R13: [['inigo_sinergia', '...'], ['ruben', 'Yo. Perdón.']] }
    intro: ['Perfecto. Te lo pongo por escrito.'],       // before the window opens: strings (rival) or [who, line]
    hurt: ['Ese input no lo tenía en el framework.', 'Interesante. Lo pongo en azul.'],   // rotate in order
    taunt: ['Ese input no escala.', 'Rosa. Emociones. Siguiente.'],
    comodinAnswer: undefined,                // override «Te espero.»
    wrongObject: {},                         // rival-level wrong-object lines (id → line, '*' → any)
    wrongObjectKey: 'inigo',                 // which column of duelo.js wrongObject to use (default: duel id)
    finishers: [
      { atScore: 2, text: 'El Titulator es una inversión de 48.000 € al mes. Perfectamente auditada.', object: 'ticket_n1',
        wrongObject: { acta_reunion: 'Un acta. Muy analógico. Luego la leemos.' },
        script: async (api, duel) => { /* Rubén enters... */ } },          // duel continues (not the last)
      { atScore: 4, text: 'Esto ya lo ha decidido la Reunión de Dirección.', object: 'acta_reunion',
        wrongObject: { ticket_n1: 'Eso ya me lo has enseñado. No escala dos veces.' },
        script: async (api, duel) => { /* ... */ } },                       // last one: Bruno wins
    ],
    defeatLines: ['Asignado a Vacante. Llama tú a la rotativa.', ['player', 'Ni hablar. Lo vuelvo a intentar.']],
    onHit: async (api, duel, pairId) => {},  // after every correct reply (receives the matched pair)
    defeatLine: 'RESPUESTA AUTOMÁTICA DE OPTIMAL BRAINS: «Gracias por su feedback.»',   // the rival's own (§7.7)
    defeatScene: 'inigo_derrota',            // scene of the comic consequence (≤ 6 lines, < 15 s): (api, { duel, perdidos, ctl })
    defeatHeadline: (n) => 'UN BECARIO ...', // Titulator headline after the scene (string or function of the defeat count)
    onWin: async (api, duel) => { api.setFlag('duelo_inigo_ganado', true); },
    onLose: async (api, duel, result) => {},
    music: undefined,                        // default 'm_duelo' (duelo.js); previous music restored after
  },
},
```
`duel` (the control object handed to `script`/`onWin`/`onHit`): `hits`, `misses`, `setAssigned(text)`,
`setSubject(text)`, `setCc(text)`, `thread(from, text)`, `hide()` / `show()` (the mail window, e.g. during a
finisher cutscene).
Start a duel from a dialog option: `{ text: 'Quiero firmar en tu página 7.', do: async (api) => { await api.duel('teodoro'); return 'exit'; } }`.
**Result flags of bible §5.5** (`duelo_maripaz_ganado`, `casilla_hueco`, …) are set by your `onWin`.

---

## 11. Inventory items (shared)

`content/items.js` has the 18 items of bible §4 plus `boli_muerto` (#19, addendum 6.1) (ids, names, icons, Mirar with states) and the behaviour that does not
depend on a room: Usar `movil` (the PHONE MENU, `content/lib/movil.js`: call the grandmother = hints, read the e-mail,
missed calls) and «Usar móvil con cualquier cosa» (refusal), the libreta's list of learned replies,
Mirar `mensaje_fp` → `vio_borde_perforado`, **Usar chicle con tarjeta_becario** (P01b → `tarjeta_con_chicle`, the gum
is used up), «Usar sobre_azucar con café» (§8.1). Everything else involving an item is a handler on the room object or
NPC (§6). Ids: `tarjeta_becario`, `libreta_replicas`, `movil`, `chicle`, `cafe`, `chaqueta_ramirez`, `sobre_azucar`,
`ficha_pagina_7`, `planillo`, `copias_rechazadas`, `fotocopia_nota_direccion`, `mensaje_fp`, `manual_fax`,
`pieza_opa`, `album_eventos`, `posit_baja_ruben`, `ticket_n1`, `acta_reunion`.

Item definition keys: `name` (string or `(view) => string`), `icon(g, x, y, view, variant)` (28×18 box, outlined
automatically), `iconKey(view) => string` (icon variant, part of the cache key: tarjeta without photo, ficha's ticks,
pieza recortada), `defaultVerb`, `desc`, `handlers`, `combine: { otherItem: handler }`, **`solo: true`** (an item used
on its own: «Usar» + its icon, a click on the icon with no verb, right-click/long press and a double tap all run its `usar`
handler AT ONCE, without the «Usar X con…» step; «Usar X con Bruno» is the same as «Usar X»; «Usar X con otra cosa» and
«Dar X a alguien» keep working as usual. In the game: `movil` and `libreta_replicas`. Engine: `Game.isSolo(id)`).
Anti-dead-end rule (§4): an item is only removed (`api.take`) by its correct use; `cafe` is infinite (Gertrudis).

---

## 12. Flags, state & saving

- **Global flags**: `content/flags.js` is the single list (bible §5.5: name, type, who sets, who reads). Don't invent
  cross-room flags: ask the head writer (they go in the bible and in `flags.js`).
- **Local flags**: declare them in your logic file, `flags: { <roomid>_algo: 'comentario' }`, prefixed with your room
  id. Only your room reads them.
- Debug mode (`?debug=1`) warns in the console (`[flags] flag no declarado ...`) when a script, a condition or the art
  reads or sets an undeclared flag. `node tools/check.mjs` checks the sources statically.
- Engine-reserved: `duel:<id>:won`, `walkbox:<room>.<id>`; `api.once` uses its own store.
- Saved automatically: room, inventory, flags, object states/visibility, actor rooms/positions/visibility, dialog
  `once`, `api.once` keys, play time. Not saved: running scripts. `onEnter` must be idempotent.
- Slots: 3 manual + `auto` (autosave on every room change). Pause menu: Esc or ≡.

---

## 13. Music & sound effects

Tracks are referenced by id: `m_<roomid>` (default room music), `m_titulo`, `m_duelo` (all duels), `m_climax`,
`m_final`, `m_creditos`. `content/music.js` belongs to the composer — **don't edit it**. A missing track id plays
silence (no error), so rooms can reference their track before it exists. Change music from scripts with
`api.music('m_climax')`. Track format and sfx presets: see the comments in `engine/audio.js` (`bpm`, `steps`,
`channels` of notes `C4 . - | k x o h`). Built-in sfx: `click select pickup drop success error door doorClose step
paper typewriter phone coin beep computer machine pour drink hit whoosh good bad laugh open close`; custom ones via
`game.sfx` (shared) or `api.sfx({ ...layers })` inline.

---

## 14. Title, ending & credits

Title screen and the common credits background are in `content/game.js` (`game.ending`: music `m_creditos`, newspaper
background `draw`, Gertrudis' LCD as `overlay` — drawn over the text —, `topY`); the credits list, the post-credits
scene and the last image are in `content/escenas/final.js`. `api.credits(opts)` scrolls the list and returns to the
game by itself; `api.ending(opts)` ends the game (a click fast-forwards; at the end a click returns to the title).
`opts`: `credits`, `draw(g, t)`, `overlay(g, t)`, `speed`, `startY`, `holdY`, `holdMs`, `topY`, `textW`, `theEnd`, `music`. Credits entries: `'text'`, `''` (blank), `{ text, title: true }`, `{ text, color }`.

---

## 15. Testing & tools

- `node tools/test-fase0.mjs` — the shared systems of the comedy plan on the demo room `tools/demo-fase0.js`
  (duel, objective, hints, clock, ambient, movement, situation effects, iPhone duel layout); screenshots `tools/shots/fase0-*.png`.
- `node tools/text-audit.mjs --estatico [--plan] [--sala=<id>]` — static pass of the comedy-plan rules (`tools/plan-rules.mjs`):
  «… Como X.» endings and forbidden visible words; the full run adds the catchphrase caps (§2.4). Warnings unless `--plan`.

| command | what |
|---|---|
| `node tools/serve.mjs 8080` | static server → `http://localhost:8080/` |
| `node tools/shot.mjs <room> [entry] [--debug] [--x=<roomX>] [--y=<roomY>] [--flags=a,b=1] [--verb=hablar:id] [--scale=3]` | screenshot of a room → `tools/shots/room-<room>[-debug].png`; prints content errors and **buildRoom warnings** (exit 1 if any) |
| `node tools/check.mjs` | static check: imports, logic/art ids, files, exits/entries, undeclared flags, unknown items/actors/replies, duel decks; warnings for lines > 80 chars. **Must pass before you hand over** |
| `node tools/test-all.mjs [--rapido] [--sala=<id>] [--solo=a,b] [--jobs=3]` | **every test** in parallel (each tool uses its own free port) with a summary table; logs in `tools/shots/test-all/`. `--rapido` samples the slow parts (≈ 2-3 min); `--sala` runs what concerns that room |
| `node tools/sala.mjs <id> [--actos=a0,a1,…] [--escala=2] [--estricto]` | the artists' preview: the room in every act state (a0 start … a3b Rubén free) clean / debug / «ver hotspots», panorama of wide rooms, contact sheet and the NPC visibility + talk-spot report → `tools/shots/sala/<id>/` |
| `node tools/test-motor.mjs` | redesign engine + kit test on the throwaway demo room `tools/demo-rediseno.js` (poses, U walkbox, per-area scale, penumbra, detalle, ver hotspots, hit-slop, 14 px touch rows, held object, kit registry) and, in the real game, «ver hotspots» in the 10 rooms and Gervasio seated |
| `node tools/smoke.mjs [--rapido]` | full UI smoke test (title, 10 rooms, inventory, sample duel, save/load, menu, credits, debug, touch); `--rapido` skips the real-time phone part and the device viewports |
| `node tools/test-movil.mjs` | Bruno's phone (`solo` item) with a real mouse and finger: Usar+icon, icon alone, «Usar móvil con Bruno», right-click, double tap on iPhone landscape; the mail (reading only touches `movil_leidos`), the grandmother call, Esc / tap outside, load with the menu open |
| `node tools/walkthrough.mjs [--alt] [--hasta=N] [--lento]` | comedy plan §3.2 (42 steps, data in `walk-data.mjs`, `ALT` = the alternative order) step by step up to the FE DE ERRATAS card and the credits; stops at the first failing step and says why |
| `node tools/extras.mjs [--hasta=XE3] [--lento]` | the 42 steps + the «extras» of plan §3.5 / E1.9 interleaved (X1…, XM1-XM7, XE1-XE4 and counter checkpoints; `['perder']` loses the open duel; `esp.log` checks lines on screen). Shares `walk-data.mjs` / `walk-lib.mjs` with the walkthrough; both **dismiss the automatic notices** and keep going |
| `node tools/play-mouse.mjs [--solo=raton\|geometria] [--vis]` | Act I + duel D1 with REAL mouse events only (incl. the vestíbulo barrier: the lift is unreachable before `torno_abierto`, reachable after; the lift panel by clicks), and the geometry audit: every hotspot/NPC of every room in every act has its approach point on the floor, reachable from every entry, is not fully covered by another hotspot, and every talkable NPC shows ≥ 80 % of head+torso (silhouette render) with ≥ 120 px of own click area — also **with Bruno standing at its talk spot** (talk spots go to the SIDE of the NPC, never in front) (`--vis` prints the figures). Shared with `tools/sala.mjs` (`tools/geo-audit.mjs`), plus the redesign rules R1-R5 (≥ 12×10, overlaps ≤ 30 %, talk spot ≥ 24 px, kit signs whole, inside the room): errors in rooms whose art has `rediseno: true` (or with `--estricto`), warnings elsewhere (`--avisos` lists them); `--sala=a,b` limits the audit |
| `node tools/fuzz.mjs [--solo=guardar\|duelos\|objetos] [--sala=a,b] [--rapido]` | save/load in every act and play on to the end; lose every duel once; Dar/Usar every item on every NPC and hotspot (no exceptions, no stuck dialogs, list of consumed items) |
| `node tools/contrast.mjs [--todo]` | legibility: WCAG contrast of every speaker colour against its outline and against the real background of every room under the speech band (`SPEECH_BACKING`), same-room speakers distinguishable, and all UI / menu / duel text colours ≥ 4.5:1 |
| `node tools/make-icons.mjs` | regenerates the web-app icons `icons/icon-{180,192,512}.png` from the game's own drawing code (the only image files in the project) |
| `node tools/text-audit.mjs [--plan]` | every line said in a full game + all 9 verbs on everything: > 80 chars, balloons over 3 rows, missing ¿ ¡, names, clock times, and staging: whoever says a line is not hidden (> 20 % of head+torso) by another actor standing in front |
| `node tools/review.mjs [--solo=salas\|momentos]` | contact sheets for visual review → `tools/shots/review/` |
| `node tools/actors.mjs` | cast contact sheet → `tools/shots/actores.png` (sprite-less presences as colour cards) |

URL parameters: `?debug=1` (walkboxes, hotspots with ids, actor boxes, coordinates, console: `goto sala [entrada]`,
`give item`, `giveall`, `take item`, `flag nombre [valor-json]`, `verb verbo obj [item]`, `state`, `fast [off]`, or
JS with `g` = engine; F2 overlay, F3 console) · `?room=<id>&entry=<entry>` (new game directly in a room, no intro) ·
`?autostart=1`.

`window.__game`: `state()` → `{ mode, room, busy, cutscene, inventory, flags, objects, actors, player, dialog, detalle, hotspotsShown, poses,
dialogDisabled, pickItem, duel: { id, opponent, phase ('intro'|'reply'|'finisher'|'pick'|'end'), attack, options,
correctIndex, correctItem, hits, misses, subject, assigned } | null, lastDuel, learnedReplies, notices, sentence,
hover, camX, music, menu, speaking, aviso, finished }` · `newGame()` · `gotoRoom(id, entry?)` · `doVerb(verb, objId, itemId?)` ·
`currentDialogOptions()` · `chooseDialog(i)` · `chooseText(substr)` · `chooseItem(id|null)` (duel inventory picker) ·
`giveAll()` · `scene(name)` · `showHotspots(ms?)` · `waitIdle()` · `skipText(true)` · `skipSpeech()` (close the current balloon, like a click) · `log` · `clearLog()` · `giveItem/takeItem/setFlag/getFlag`
· `save(slot)` / `load(slot)` · `skipCutscene()` · `errors` · `objects()` · `screenPos(id)`, `verbPos(verb)`,
`invPos(item)`, `optionPos(i)`, `virtualToClient(x, y)`, `roomPointToClient(x, y)`.

---

## 16. Conventions & pitfalls

- Ids: lowercase ASCII `snake_case`, **exactly** as in the bible. Never rename one (bible §9.3).
- The newspaper is **elContable.es** («el Contable»). No real brands anywhere (bible §0); when copying bible text that
  names the medium, use this name.
- Object names lowercase ("pantalla del Ibex"); people capitalised.
- Always `await` speech/walks. Don't `api.goto` from `onEnter`/`onExit` of the same room without a guard.
- `onEnter` runs on every entry and after loading: guard one-time scenes with `api.once()` or a flag.
- Lines ≤ 80 characters; a bible ` // ` = two lines: `api.say(['línea 1', 'línea 2'])`.
- Teodoro never speaks aloud (only on the red phone): his lines come out of the fax — `api.sayAs('teodoro_cuerpodoce', ...)`
  or `api.sayFrom('fax', 'TEODORO (fax): ...', { color: '#D9CFA6' })`, pick one and be consistent. Gertrudis' LCD is
  `api.sayAs('gertrudis', 'MAYÚSCULAS')`.
- Write only lines of your package's characters (bible §9.3.4); shared characters (Gervasio, Íñigo, Lector Medio, Rubén)
  use the same id/colour everywhere.
- Every visible thing needs at least a Mirar (bible lines, otherwise the §8.2 defaults answer).

---

## 17. Guía para autores de sala (checklist)

> **Reescritura de comedia (2026-11):** la lista de comprobación vigente para los paquetes P1-P4 es
> `docs/guion2-impl/GUIA_AUTORES.md` (APIs de objetivo, pistas, hora, ambiente, duelo y efectos; qué no tocar; cómo
> probar). Lo de abajo sigue valiendo para lo que no contradiga esa guía.


1. Lee en la biblia: §0, tu sala en §3, tus puzles en §5.2, tus filas de §5.4 y §5.5, tus árboles en §7, tus duelos en
   §6.4–6.5 y §9 (qué cruza con otros paquetes).
2. Edita **solo** `content/rooms/<tu-sala>.js` (y archivos nuevos tuyos: `content/rooms/<tu-sala>.<algo>.js`,
   `content/escenas/<nombre>.js`, importados desde tu sala). Nunca los compartidos (§0). No toques el arte: si necesitas
   un hotspot nuevo o mover uno, pídeselo al artista de tu sala (y dilo en tu informe).
3. Cada hotspot de §3 ya está con su id y su `name`: añade `desc`/`handlers` con las líneas de la biblia. Las salidas:
   deja `exit: { room }` y pon el bloqueo en `handlers.ir` (§4); borra el comentario `TODO ... Bloqueo pendiente`.
4. PNJ: completa `when` según la tabla «Estados por acto» de §3.0 y sus `handlers` (Hablar → `api.dialog`).
5. Flags: solo los de `content/flags.js` (los que tu paquete pone según §5.5) o locales con prefijo de sala.
   Las réplicas se enseñan con `api.learnReply('rep_XX')`.
6. Duelos (C y D): defínelos en `duels` de tu sala con el mazo y las líneas de §6.4/6.5; `onWin` pone los flags de §5.5.
7. Escenas largas: en `scenes` (otras salas las lanzan con `api.scene('nombre')`). La intro es `intro` (A).
8. Textos: opciones de diálogo **literales** de la biblia (el walkthrough las busca por texto); ≤ 80 caracteres.
9. Prueba: `node tools/shot.mjs <sala> --debug`, `?room=<sala>&debug=1` en el navegador, `node tools/check.mjs`
   (sin errores), `node tools/walkthrough.mjs` (debe pasar al menos tus pasos o fallar en uno de otro paquete) y
   `node tools/smoke.mjs`.
10. Si necesitas un cambio en un archivo compartido o en el motor: **no lo hagas**; descríbelo en tu informe final.
