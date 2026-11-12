# CONTENT_SCHEMA — authoring reference for FE DE ERRATAS

Authoritative reference for writing content on this engine. Everything here matches the code in `engine/`,
`content/lib/room.js` and the tools. The script is `docs/GUION_BIBLIA.md` (the "bible"); art helpers are in
`docs/ART_GUIDE.md`. Section 17 is the checklist for room authors (**Guía para autores de sala**).

- Language: all player-facing text is **Spanish**. The bitmap font supports `áéíóúüñÁÉÍÓÚÜÑ¿¡«»€ºª✓→×·—` and common
  punctuation. `“”` become `"`, `’` becomes `'`, `…` becomes `...`. Unknown characters render as `?`.
- Plain ES modules, no build step. Import with **relative** paths (`'../lib/room.js'` from `content/rooms/`,
  `'../../engine/draw.js'` from `content/rooms/`, `'../../../engine/draw.js'` from `content/rooms/art/`).
- Screen 320×200. Room viewport 320×144 (y 0–143); UI panel y 144–199. Rooms may be wider than 320 (`pecera` is 640).
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

Seven people work in parallel: four room authors (packages **A–D** of bible §9.1) and three background artists.
Every file has exactly one owner, so nobody ever edits the same file.

| file(s) | owner |
|---|---|
| `content/rooms/<id>.js` — room **logic** | the package writer of that room (A: `vestibulo`, `cpd` · B: `pecera`, `pajarera` · C: `office`, `catacumba` · D: `ecosistema`, `administracion`, `sala_amazonas`) |
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
content/index.js                    single registration point — already registers the 9 rooms (shared)
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

The 9 rooms (`vestibulo`, `pecera`, `office`, `catacumba`, `pajarera`, `sala_amazonas`, `ecosistema`,
`administracion`, `cpd`) exist as working stubs: every exit of bible §3.0 works (**all unlocked for now**, with a
`// TODO <package>: ... Bloqueo pendiente` comment where the lock goes), every hotspot id of §3 is present on both sides,
NPCs stand in place. **Extra files never need `index.js`**: import them from your room file
(`import dialogos from './pecera.dialogos.js'` and spread them into `dialogs`), and register scenes/duels through
your room's `scenes` / `duels` (they become global).

`content/index.js` (for reference):
```js
export default {
  game, actors: [actors], items: [items], duels: [duelo], flags: [flags],
  rooms: [vestibulo, pecera, office, catacumba, pajarera, sala_amazonas, ecosistema, administracion, cpd],
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
  width: 320,                       // 640 for pecera
  scale: { yFar: 100, far: 0.86, yNear: 142, near: 1.0 },   // or a number, or (y) => scale
  walkboxes: [{ id: 'suelo', poly: [[4, 104], [316, 104], [318, 142], [2, 142]] }],
  entries: { pecera: [160, 108, 'down'], cpd: [278, 112, 'down'] },   // named after the room you come FROM
  layout,
  draw(g, view, t) {},              // static background, painted once (cached)
  animate(g, view, t) {},           // every frame, behind actors
  foreground(g, view, t) {},        // painted once, over actors
  overlay(g, view, t) {},           // every frame, over everything
  dynamic: false,                   // true if draw/foreground read flags (view.flag)
};
```
Art-side object keys: `rect` | `poly`, `walkTo`, `face`, `walk`, `priority`, `layer`, `zy`, `cache`, `cachePad`,
`draw` **or** `sprites` (one draw function per object **state**, plus `default`). Art-side NPC keys: `at`
(`[x, y, dir]`, y = feet), `walkTo`, `face`, `positions` (`{ name: { at, walkTo?, face? } }`).
Art may **read** flags (`view.flag('cms_vivo')`, `view.state`), never change them.

### 2.3 What `buildRoom(logic, art)` does
- Copies the art's room-level keys (`width`, `scale`, `walkboxes`, `entries`, `draw`, `animate`, `foreground`,
  `overlay`) into the room; `dynamic` = logic **or** art.
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
- `ambient: [{ every: [9000, 16000], if: '!acto_3_iniciado', run: async (api) => {...} }]` — non-blocking, only when
  the player is idle; their speech cannot be skipped.
- `walkboxes` can be toggled from the logic with `api.setWalkbox(id, on)` — the art must give the box that `id`
  (agree on the name in the room's logic header comment).

---

## 3. game.js (shared)

What the shared `content/game.js` provides (you use it, you don't edit it):

| key | what |
|---|---|
| `id: 'fe_de_erratas'`, `player: 'bruno'`, `startRoom: 'vestibulo'`, `startEntry: 'inicio'` | |
| `startInventory` | `tarjeta_becario`, `libreta_replicas`, `movil` (bible §4) |
| `onStart` | runs `api.scene('intro')` — the intro §7.1 is package A's scene in `vestibulo.js` |
| `defaults` | bible §8.2: 5 lines per verb, **rotating in order** (not random). Item-on-item with no combo uses the `usar` list. After 10 consecutive failed item combinations, Bruno says the §8.6 line instead |
| `idle` | §8.6: after 60 s without input, Bruno's fourth-wall line |
| `saveMessages`, `saveFirstLine` | §8.6: «Guardando...» ×3 (original, duplicado, triplicado) and Begoña's line the first time |
| `difficulty` | §8.6: decorative menu item (Normal / Difícil / Cierre en viernes) |
| `quitConfirm` | §8.6: «¿Seguro que quiere salir? [ Sí ] [ Lo hablamos ]» |
| `learnReply` | §5.5: notice «Réplica apuntada en la libreta.» + sfx `good`, shown only the first time (see `api.learnReply`) |
| `scenes.pistas` | §5.6: the grandmother's hints (Usar `movil`): +1 `abuela_llamadas`, rotating greeting, first matching hint, «Abrígate.» |
| `afterEnter`, `scenes.avisos` | **Automatic notices** (addendum §2), see «Avisos» below |
| `startFlags` | the 28 flags of addendum 6.2 initialised: counters `0`, booleans `false` |
| `title`, `ending`, `credits` | title screen (front page), credits shell with the «Fe de erratas» box and Gertrudis' LCD (§14) |
| `music` | imports `content/music.js` |

### Avisos (addendum §2): incoming calls and «RV:» notices — common, nobody has to call them
After the `onEnter` of **every** room the engine runs `game.afterEnter`, which plays the scene `avisos`
(`content/game.js`): **at most one notice per room entry** — first the next Evaristo call (L1…L5, counter
`evaristo_llamadas`) whose condition holds, otherwise the next Tadeo mail (RV1…RV5, counter `tadeo_rv_n`). They come in
numeric order and wait for their condition; they never set bible flags (L2 sets `evaristo_convoco`). They do **not** play
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
`murmurAfterMs` (default 20000).

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
  murmurColor: '#c8c4d8',
  desc: 'Texto de Mirar.',         // = handlers.mirar
  pickup: 'planillo',              // = handlers.coger: reach anim, give item, hide object, sfx
  pickupText: '...',
  exit: { room: 'pecera', entry: 'catacumba', sfx: 'door' },   // = handlers.ir (entry defaults to this room id)
  handlers: { ... },               // §6
  walk: false, walkTo: [x, y], face: 'up', priority: 0,         // usually in the art; the logic may override
}
```
Art keys (in `layout[id]`): `rect` / `poly`, `walkTo`, `face`, `walk`, `priority`, `layer` (`'back'` | `'sorted'` |
`'front'`), `zy`, `cache`, `cachePad`, `draw(g, view, t)` or `sprites: { <state>: fn, default: fn }`.

**Exits and locks.** Keep `exit: { room }` on every exit hotspot (the walkthrough's travel and `check.mjs` read the
exit graph). Put the lock in `handlers.ir`, which runs before the `exit` shortcut:
```js
{ id: 'torno', name: 'torno', exit: { room: 'pecera' }, handlers: {
    ir: async (api) => { if (!api.flag('torno_abierto')) { await api.say('...'); return; } await api.goto('pecera'); },
    'usar:tarjeta_becario': async (api) => { ... } } }
```
Clicking an exit with no verb is «Ir a <exit>». If "Usar/Abrir puerta" should also move, add those handlers.

Object state & visibility are saved (`state.objects['room.id']`). Other rooms' objects: `'room.objId'`.

---

## 5. Actors

### 5.1 Definitions (`content/actors.js`, shared)
All characters of bible §2 with their exact ids, names and text colours:
`bruno` (player), `celestino`, `yoli_tendencias`, `nerea_backlog`, `teodoro_cuerpodoce`, `aurora_galerada`,
`gervasio_acta`, `begona_triplicado`, `borja_engagement`, `maripaz_remitido`, `paco_ticket`, `inigo_sinergia`,
`ruben`, `abuela_remedios` (**phone only**: never placed in a room; `api.sayAs('abuela_remedios', ...)` shows her text at
the top), `ramirez` (post-credits only), and the two "objects with character", which are actors so that their text
appears above them in their colour: `gertrudis` (LCD `#39FF14`, custom sprite, `defaultVerb: 'hablar'`) and
`lector_medio` (the Lector Medio, a marketing buyer-persona cardboard standee: stock-photo smile, blue jumper, folded
newspaper, chest card «LECTOR MEDIO · 43 años…», taped speaker; recording colour `#CCCCCC`; variants `chaqueta` when
`chaqueta_en_lector`, `caido` when `lector_derribado`, chosen automatically).
**Addendum cast** (adenda §1/§11.2): sprite characters `leoncio_quesitos` (`#00C2A8`), `anselmo_monolito` (`#D96CFF`),
`evaristo_salvedad` (`#B5A642`) and the cameo `valentin_reticula` (`#E0E0FF`). **Sprite-less presences** only give a
speaking name/colour to `api.sayAs` (flag `presence` in the definition, `hotspot: false`, never placed in a room):
`custodia_precinto` (`#C04E7A`), `tadeo_adjunto` (`#FFCC99`), `herminia` (`#00C2A8`), `coro_desarrollo` (CORO), `dev_1`,
`dev_2`, `dev_3` (`#7FFFD4`; the balloon text carries the prefix «DEV 1: …»), `altavoz_ibex` (ALTAVOZ, `#CCCCCC`). The
hotspot that represents a presence is an **object** of the room with the same id (e.g. `office.custodia_precinto`) whose
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
| `hairPencil` | colour | pencil/pen through a bun (Nerea, Aurora) |
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
`api.skipping` (cutscene being skipped / test fast mode), `api.comboFails`, `api.game` (raw engine, avoid).

### Speech
| | |
|---|---|
| `await api.say(text \| [lines], opts?)` | Bruno speaks; arrays = consecutive balloons |
| `await api.sayAs(actorId, text \| [lines], opts?)` | another actor (above its head if in the room, else at the top) |
| `await api.sayFrom(objId, text \| [lines], opts?)` | an **object** speaks: text above the object in `opts.color` or the object's `color` (LCD, fax, torno LED, TV) |
| `await api.narrate(text \| [lines], opts?)` | narrator/caption («rótulo») at the top (`game.narratorColor`) |
| `await api.sayRandom([lines])` | |
| `api.notice(text, { color, ms })` | non-blocking notice at the bottom of the room view |

`opts`: `{ ms, color, width }`. Duration ≈ 0.9 s + 55 ms/char × text speed. Every line goes to `__game.log`
(`who` = actor id, object id for `sayFrom`, `'narrador'`, `'aviso'` for notices).

### Movement & animation
`api.walkTo(x, y | [x,y] | 'objOrActorId')`, `api.walkActor(id, ...)`, `api.face(dir|target)`,
`api.faceActor(id, dir|target)`, `api.placeActor(id, room, x, y, dir?)`, `api.actorPos(id)`,
`api.anim(id, name, ms=600)`, `api.cameraTo(x)`, `api.cameraFollow(id?)`, `api.show(id)` / `api.hide(id)` /
`api.isVisible(id)` (objects and actors), `api.refreshActors()` (re-apply `when` presence now).

### Time & effects
`api.wait(ms)`, `api.fadeOut(ms)`, `api.fadeIn(ms)`, `api.shake(ms, px)`, `api.sfx(name|def)`, `api.music(id|null, fade)`.

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
| `await api.ending(opts?)` | credits; resolves when back at the title |
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

---

## 10. Duelos: «Responder a todos»

The engine implements bible §6.2/§6.8; shared data is in `content/duelo.js`; **each rival is defined by the author of
its room** in the logic file's `duels` (ids: `maripaz` D1 in `ecosistema`, `teodoro` D2 in `catacumba`, `gervasio`
D3 in `office`, `inigo` D4 in `sala_amazonas`).

### Rules (what the engine does)
- The rival always attacks, with its `deck` **in order**. Bruno's menu = every learned pair (flags `rep_XX`, in pair
  order R01…R14) + the 3 weak replies + the comodín. Nothing is filtered by rival and **nothing is learned in a duel**.
- Correct reply: +1 point, the attack leaves the deck, the thread shows «planta.vestibulo@: +1. Totalmente de acuerdo
  con Bruno.», the rival says its next `hurt` line (rotating) — or `duelo.js hurtByPair[<duel id>][<pair>]` when defined (addendum 7.2: Íñigo on R15/R16); `duelo.js cameos[<duel id>]` (Tadeo, addendum 7.4) enters the thread once after the first hit.
- Miss (wrong learned reply → next `taunt`; weak reply → `answers[<duel id>]` if present, else `answerFax` for `style: 'fax'`, else `answer`; a weak reply may carry `offOnce: [actor, line]`, heard the first time in the whole game): one more
  `RE:` in the subject, the attack goes to the **end** of the deck. 3 misses (`maxMisses`) = defeat.
- Comodín: first use per duel → rival's «Te espero.» (Teodoro: «Enviado desde mi fax...»), same attack again, no score
  change; second use = miss with «Llevas toda la noche con el móvil. Ya no te creo.».
- Before starting, if Bruno knows fewer replies of the deck than the points needed, he says «Aún no tengo con qué
  contestarle. Debería cotillear más.» (the duel starts anyway).
- Normal win at `winScore` (default 3): «Asignado a:» changes to the rival (`assignedWin`, default `from`), sfx `good`,
  flag `duel:<id>:won`, then `onWin`.
- **Finishers (remates)**: when points reach a finisher's `atScore`, the rival says its `text`; the replies turn grey
  and only **[Usar objeto]** (opens the inventory picker) and **[Retirarse del hilo]** remain. Right object → its
  `script`; then the duel ends (win) if it was the last finisher (or `end: true`), otherwise continues. Wrong object →
  the wrong-object line (not a miss): `finisher.wrongObject[item]` → `opp.wrongObject[item]` →
  `duelo.js wrongObject[<id>][item]` → `opp.wrongObject['*']` → `wrongObject[<id>]['*']` → `wrongObject['*']`.
  [Retirarse del hilo] = defeat without punishment.
- Defeat (3 misses or retiring): subject becomes `RV: RE: ...`, «CC: Dirección», a narrator caption says «RESPUESTA AUTOMÁTICA DE
  DIRECCIÓN: «Lo que diga Gervasio.»», «Asignado a: Vacante», the window closes, the rival says `defeatLines`, then `onLose(api, ctl,
  'lost' | 'retired')`. Points always restart from 0 next time. Never fatal.
- `await api.duel(id)` returns `true` only on victory. `__game.state().lastDuel = { id, result, hits, misses }`.

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
    attackText: {},                          // optional { R10: 'different wording' } (normally not used: same words!)
    intro: ['Perfecto. Te lo pongo por escrito.'],       // before the window opens: strings (rival) or [who, line]
    hurt: ['Ese input no lo tenía en el framework.', 'Interesante. Lo pongo en azul.'],   // rotate in order
    taunt: ['Ese input no escala.', 'Rosa. Emociones. Siguiente.'],
    comodinAnswer: undefined,                // override «Te espero.»
    wrongObject: {},                         // rival-level wrong-object lines (id → line, '*' → any)
    wrongObjectKey: 'inigo',                 // which column of duelo.js wrongObject to use (default: duel id)
    finishers: [
      { atScore: 2, text: 'El Titulator es una inversión de 48.000 € al mes. Perfectamente auditada.', object: 'ticket_n1',
        wrongObject: { acta_consejo: 'Un acta. Muy analógico. Luego la leemos.' },
        script: async (api, duel) => { /* Rubén enters... */ } },          // duel continues (not the last)
      { atScore: 4, text: 'Esto ya lo ha decidido el Consejo.', object: 'acta_consejo',
        wrongObject: { ticket_n1: 'Eso ya me lo has enseñado. No escala dos veces.' },
        script: async (api, duel) => { /* ... */ } },                       // last one: Bruno wins
    ],
    defeatLines: ['Asignado a Vacante. Llama tú a la rotativa.', ['player', 'Ni hablar. Lo vuelvo a intentar.']],
    onHit: async (api, duel) => {},          // after every correct reply (instead of nothing)
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
depend on a room: Usar `movil` (hints) and «Usar móvil con cualquier cosa», the libreta's list of learned replies,
Mirar `mensaje_fp` → `vio_borde_perforado`, **Usar chicle con tarjeta_becario** (P01b → `tarjeta_con_chicle`, the gum
is used up), «Usar sobre_azucar con café» (§8.1). Everything else involving an item is a handler on the room object or
NPC (§6). Ids: `tarjeta_becario`, `libreta_replicas`, `movil`, `chicle`, `cafe`, `chaqueta_ramirez`, `sobre_azucar`,
`ficha_pagina_7`, `planillo`, `copias_rechazadas`, `fotocopia_nota_direccion`, `mensaje_fp`, `manual_fax`,
`pieza_opa`, `album_borja`, `posit_baja_ruben`, `ticket_n1`, `acta_consejo`.

Item definition keys: `name` (string or `(view) => string`), `icon(g, x, y, view, variant)` (28×18 box, outlined
automatically), `iconKey(view) => string` (icon variant, part of the cache key: tarjeta without photo, ficha's ticks,
pieza recortada), `defaultVerb`, `desc`, `handlers`, `combine: { otherItem: handler }`.
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

Title screen, credits background and the credits list are in `content/game.js` (shared; the final credits text is
package A's job: describe it in your report). `api.ending()` shows the credits (`game.ending`: music `m_creditos`,
newspaper background, Gertrudis' LCD «E-00: HOY SÍ...», «FIN»); a click fast-forwards; at the end a click returns to
the title. Credits entries: `'text'`, `''` (blank), `{ text, title: true }`, `{ text, color }`.

---

## 15. Testing & tools

| command | what |
|---|---|
| `node tools/serve.mjs 8080` | static server → `http://localhost:8080/` |
| `node tools/shot.mjs <room> [entry] [--debug] [--x=<roomX>] [--scale=3]` | screenshot of a room → `tools/shots/room-<room>[-debug].png`; prints content errors and **buildRoom warnings** (exit 1 if any) |
| `node tools/check.mjs` | static check: imports, logic/art ids, files, exits/entries, undeclared flags, unknown items/actors/replies, duel decks; warnings for lines > 80 chars. **Must pass before you hand over** |
| `node tools/smoke.mjs` | full UI smoke test (title, 9 rooms, inventory, sample duel, save/load, menu, credits, debug, touch) |
| `node tools/walkthrough.mjs [--alt] [--hasta=N] [--lento]` | bible §5.4 step by step (data in the file); stops at the first failing step and says why. Fails while rooms are unfinished: expected |
| `node tools/extras.mjs [--hasta=X10] [--lento]` | walkthrough 5.4 + the «extras» X1…X26 of addendum §12 interleaved (data in the file; fails at the first unimplemented X step: expected). Shares `walk-data.mjs` / `walk-lib.mjs` with the walkthrough; both **dismiss the automatic notices** and keep going |
| `node tools/actors.mjs` | cast contact sheet → `tools/shots/actores.png` (sprite-less presences as colour cards) |

URL parameters: `?debug=1` (walkboxes, hotspots with ids, actor boxes, coordinates, console: `goto sala [entrada]`,
`give item`, `giveall`, `take item`, `flag nombre [valor-json]`, `verb verbo obj [item]`, `state`, `fast [off]`, or
JS with `g` = engine; F2 overlay, F3 console) · `?room=<id>&entry=<entry>` (new game directly in a room, no intro) ·
`?autostart=1`.

`window.__game`: `state()` → `{ mode, room, busy, cutscene, inventory, flags, objects, actors, player, dialog,
dialogDisabled, pickItem, duel: { id, opponent, phase ('intro'|'reply'|'finisher'|'pick'|'end'), attack, options,
correctIndex, correctItem, hits, misses, subject, assigned } | null, lastDuel, learnedReplies, notices, sentence,
hover, camX, music, menu, speaking, aviso }` · `newGame()` · `gotoRoom(id, entry?)` · `doVerb(verb, objId, itemId?)` ·
`currentDialogOptions()` · `chooseDialog(i)` · `chooseText(substr)` · `chooseItem(id|null)` (duel inventory picker) ·
`giveAll()` · `scene(name)` · `waitIdle()` · `skipText(true)` · `skipSpeech()` (close the current balloon, like a click) · `log` · `clearLog()` · `giveItem/takeItem/setFlag/getFlag`
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
