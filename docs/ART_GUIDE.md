# ART_GUIDE — procedural pixel art for FE DE ERRATAS

There are **no image files** in this project. Every pixel is drawn by code onto low-resolution canvases with the
helpers in `engine/draw.js`, then the whole 320×200 frame is upscaled with nearest-neighbour. The target look is an
early-90s VGA point-and-click: a limited, coherent palette; ordered dithering for gradients and shadows; soft banded
light; dense, believable clutter; and readable silhouettes. The building is the newspaper **elContable.es** («el
Contable»), on a Friday evening (clocks stopped at 20:59, closing at 21:00; the game runs Friday 18:30 → 21:00). Room descriptions: bible `docs/GUION_BIBLIA.md` §3.
Section 9 is the checklist for background artists (**Guía para artistas de fondo**).

> **REDISEÑO VISUAL EN CURSO.** El contrato vinculante para repintar las 10 salas (paquetes P1-P4, archivos de cada uno,
> núcleo de ascensor y escalera, zonas de la Pecera, nombres visibles —«Dirección», nunca «Pajarera»—, puesta en escena
> de los PNJ, reglas de texto y de estados, lista de comprobación) está en **`docs/GUIA_REDISENO.md`**. El kit común de
> señalética y arquitectura es `content/lib/kit.js` (§10 de esta guía) y lo nuevo del motor (pose sentada, penumbra,
> plano detalle, walkboxes con forma, «ver hotspots») está en §10.2. Vista previa: `node tools/sala.mjs <sala>`.

```js
// from content/rooms/art/<id>.art.js
import { PAL, rect, gradV, wall, floorTiles, cityWindow, desk, glow, vignette } from '../../../engine/draw.js';
```

## 0. Your file and the rules
Each room is two files glued by ids (details: `docs/CONTENT_SCHEMA.md` §2):

| file | owner | contains |
|---|---|---|
| `content/rooms/art/<id>.art.js` | **you** (background artist) | width, scale, walkboxes, entries, `draw`/`animate`/`foreground`/`overlay`, `layout` |
| `content/rooms/<id>.js` | the room's writer | names, texts, handlers, states, NPC presence (`when`), dialogs, duels |

- **Never edit** shared files: `engine/*`, `content/lib/*`, `content/game.js`, `items.js`, `actors.js`, `duelo.js`,
  `flags.js`, `index.js`, the room logic files, or another artist's art file. A useful new helper goes **in your own
  art file**; if several rooms need it or you need an engine change, describe it in your final report.
- **Never rename, add or remove a `layout` key** on your own: the ids are the bible §3 hotspot ids and must match the
  logic file exactly (`buildRoom` warns, `node tools/check.mjs` fails). If the art needs a new hotspot, agree it with
  the room's writer (and mention it in your report).
- Characters (`content/actors.js`) and inventory icons (`content/items.js`) are already finished and shared. You draw
  rooms, props and the per-state looks of room objects.
- **Redesign:** during the redesign each package owns its rooms' logic AND art files (table in `docs/GUIA_REDISENO.md`
  §1); `content/lib/kit.js` and `content/lib/edificio.js` are shared (import them, don't edit them).

## 0.1 The art file contract
```js
const layout = {
  // objects / hotspots / exits — geometry (required) + optional drawing
  fax: { rect: [86, 70, 24, 14],            // or poly: [[x, y], ...]   (room coordinates)
         walkTo: [98, 112], face: 'up',     // where Bruno stands to act on it, and where he looks
         priority: 0, walk: true,           // optional: overlap priority; false = act from where he is
         layer: 'back', zy: undefined,      // 'back' (behind actors) | 'sorted' (z-sorted by zy) | 'front'
         cache: true, cachePad: 16,         // render once per state (static props)
         sprites: {                         // one drawing per object STATE (the writer lists them in `states`)
           sin_papel: (g, view, t) => { ... },
           con_papel: (g, view, t) => { ... },
           default: (g, view, t) => { ... },
         },
         // or draw: (g, view, t) => { ... }   a single drawing; view.state / view.flag('x') are read-only
       },
  // NPCs — where they stand (feet) and where Bruno stands to talk
  teodoro_cuerpodoce: { at: [112, 104, 'down'], walkTo: [132, 114], face: 'left' },
  gervasio_acta: { at: [84, 106, 'right'], positions: { preside: { at: [84, 106, 'right'] }, rincon: { at: [296, 110, 'left'] } } },
};
export default {
  room: '<id>', width: 320,                 // pecera: 800 (scrolls)
  scale: { yFar: 100, far: 0.86, yNear: 142, near: 1.0 },
  walkboxes: [{ id: 'suelo', poly: [...] }],
  entries: { office: [28, 118, 'right'] },  // one per room you can come FROM, named after it
  layout,
  draw(g, view, t) {}, animate(g, view, t) {}, foreground(g, view, t) {}, overlay(g, view, t) {},
  dynamic: false,                           // true if draw/foreground read flags
};
```
- Hotspots that are just part of the painted background need only `rect`/`poly` + `walkTo` + `face`.
- A drawing that changes with the story goes in `sprites` (by object state) or reads `view.flag(...)` in a `draw`.
  Flags you may read are the ones in `content/flags.js` (e.g. `cms_vivo` → the metrics screen goes dark). If the
  static `draw` reads flags, set `dynamic: true`.
- The stubs call `drawPlaceholderRoom` / `drawLayoutPlaceholders` (from `content/lib/room.js`): replace the whole
  `draw` with your painting. The dashed boxes are only a guide to where the writer expects each hotspot.
- NPC positions: the people are drawn by the engine; you only give `at` (feet, direction) and, if the writer uses
  named positions (`pos`), the `positions` map. Gertrudis (coffee machine) and the cardboard Lector Medio are actors too:
  place them with `at` like a person (their feet = the base of the machine / the cut-out).
- Walkboxes the writer toggles (`api.setWalkbox(id, on)`) need the agreed `id`. A walkbox may also carry `when`
  (`{ id: 'paso_torno', when: 'torno_abierto', poly }`): the engine enables it only while the condition holds. Use it
  to make barriers physical (the vestíbulo turnstiles: `entrada` | `paso_torno` | `interior`).
- Barriers that run front-to-back (the turnstile line) must be split into `layer: 'sorted'` pieces with their own `zy`
  so people in front of / behind each piece are occluded correctly (see `torno`, `torno_bancada` in the vestíbulo).
- Talkable NPCs must stay readable: head, shoulders and torso visible (≥ 80 %, checked by `tools/play-mouse.mjs`):
  keep counters/desks low in front of them, and give dark-clad NPCs a lighter backdrop (Paco's partition in the CPD).

## 1. Canvas & coordinates
- Screen 320×200. The room viewport is **320×144** (y 0–143). Rooms can be wider (`width`), the camera scrolls.
- All helpers take **room coordinates**, integers, top-left origin. They use `fillRect` only — no anti-aliasing.
- `draw(g)` of a room is painted **once** into a cached layer → you can afford per-pixel loops there
  (a full 640×144 dithered gradient costs a few ms). Things drawn every frame (`animate`, object `draw` without
  `cache: true`) should stay small.

## 2. Palette (`PAL`)
Each entry is a ramp **dark → light**. Pick 3–5 ramps per room and stick to them; use `ink` for the darkest
accents and `shadow` for dithered shadows.

| ramp | use | | ramp | use |
|---|---|---|---|---|
| `ink[0..3]` | near-black, outlines, deep shadow | | `night[0..7]` | night sky, cool shadows, blue light |
| `dusk[0..7]` | sunset sky, warm purple→orange | | `wood[0..7]` | furniture, floors, panelling |
| `green[0..7]` | institutional walls | | `teal[0..7]` | glass, tiles, cold accents |
| `paper[0..7]` | paper, beige plastic, plaster | | `metal[0..7]` | steel, greys, cabinets |
| `red[0..6]` | brick, red plastic, carpets | | `leaf[0..7]` | plants |
| `skin[0..6]` | reference skin tones | | `gold[0..6]` | brass, lamps, lit windows |
| `crt[0..6]` | green monitor text | | `blue[0..7]` | blue objects, day sky |
| `purple[0..6]` | wallpaper, night buildings | | `black`, `white`, `light`, `shadow` | singles |

Colour utilities: `mix(a, b, t)`, `shade(hex, amt)` (amt < 0 darkens towards cool purple, > 0 lightens towards warm
light — the house lighting model), `ramp3(hex)` → `[dark, base, light]`, `hexToRgb`, `rgbToHex`.

## 3. Lighting & perspective conventions
- **Light comes from the upper left** (window/ceiling). Light edges: top and left; dark edges: bottom and right.
  `bevel()` and the paper doll follow this.
- **Floor line** (wall meets floor) around **y = 92–100**. Ceiling strip y 0–16. Wainscot/panelling ~y 68–96.
- Floors use a **vanishing point** at the room centre, above the wall (`vpy` 10–30): `floorTiles`, `floorPlanks`.
  For side walls (office rooms) draw trapezoids with `poly()` from the screen edge to the back-wall corners.
- Walkboxes start 3–6 px below the floor line so feet never overlap the wall. Typical `scale`:
  `{ yFar: 100, far: 0.85, yNear: 142, near: 1.0 }` (a doll is ~55 px tall at 1.0).
- **Darkness over a room with people in it** (Act III penumbra, a blackout): use the art key `penumbra(view, t)`, never
  an `overlay` that paints over the actors (they would turn into «holograms», audit #1). The engine darkens the room
  except the spots and keeps the actors at 22 % of the darkness (layout `luz: 1` = not at all). §10.2.
- Shadows: `shadowEllipse` under every free-standing prop and character (the engine does characters).
  Darken where walls meet floors (`ditherOverlay(..., PAL.ink[0], 0.4)` on a 3–4 px strip) and the room edges
  (`vignette`). Light: `glow` for lamps/windows (banded translucent, smooth), `lightCone` for spotlights;
  use dithered `lightPool` only for small, crunchy highlights.
- Text in the art (signs, mastheads) uses the game font through `label()` / `signPlate()`; keep it short and
  original (no real brands or logos).

## 4. Helper catalogue (`engine/draw.js`)

### Primitives
| helper | description |
|---|---|
| `px(g, x, y, c)` | one pixel |
| `rect(g, x, y, w, h, c)` / `hline(g, x, y, w, c)` / `vline(g, x, y, h, c)` | filled rect / lines |
| `frameRect(g, x, y, w, h, c)` | 1 px outline |
| `line(g, x0, y0, x1, y1, c, thick = 1)` | Bresenham line |
| `poly(g, pts, fill)` | scanline polygon; `fill` = colour or `(x, y) => colour \| null` |
| `ellipse(g, cx, cy, rx, ry, fill)` | filled ellipse; `fill` may be `(x, y, d) => colour` (d = 0 centre … 1 edge) |
| `paint(g, x, y, w, h, fn)` | per-pixel fill with `fn(x, y) → colour \| null` (null = leave) |
| `bevel(g, x, y, w, h, base, light?, dark?)` | box with lit top/left and dark bottom/right edges |
| `label(g, text, x, y, colour, opts)` | text with the game font, no outline (`opts.outline`, `bold`, `align`, `scale`) |
| `measureText(text)` | width in px |

### Dithering & gradients
| helper | description |
|---|---|
| `bayer(x, y)` | 4×4 ordered-dither threshold (0..1) at an absolute pixel |
| `ditherPick(x, y, ramp, t)` | colour from `ramp` at position t∈[0,1] with dithering between steps — the core of every gradient |
| `dither(g, x, y, w, h, c1, c2, t)` | two-colour pattern; t = share of c2 |
| `ditherOverlay(g, x, y, w, h, c, t)` | sprinkle `c` over existing pixels at density t (dithered shadows) |
| `gradV(g, x, y, w, h, ramp, reverse?)` / `gradH(...)` | dithered vertical / horizontal gradient across a ramp |
| `noise(g, x, y, w, h, c, density, seed)` | deterministic speckle (plaster, carpet, grain) |
| `glaze(g, x, y, w, h, c, alpha)` | translucent rectangle (smooth tint) |
| `glow(g, cx, cy, rx, ry, c, alpha, bands = 5)` | banded translucent light blob (lamps, windows, halos) |
| `lightPool(g, cx, cy, rx, ry, c, strength)` | dithered light ellipse |
| `lightCone(g, x, y, topW, bottomW, h, c, strength)` | banded light cone (lamps) |
| `shadowEllipse(g, cx, cy, rx, ry, strength)` | dithered contact shadow |
| `fadeRows(g, x, y, w, h, c, alphaTop, alphaBottom, bands)` | smooth banded vertical darkening |
| `vignette(g, w, h, strength, c, x0, y0)` | banded darkening of the borders |
| `rng(seed)` / `hash2(x, y, seed)` | deterministic randomness (same picture every time) |

### Architecture
| helper | description |
|---|---|
| `wall(g, x, y, w, h, ramp, { topDark, grain, seed })` | painted plaster wall (gradient + grain) |
| `wainscot(g, x, y, w, h, ramp = PAL.wood, { panel })` | wooden panelling with rail |
| `baseboard(g, x, y, w, h = 4, ramp)` | skirting board |
| `ceiling(g, x, y, w, h, { ramp, spacing, offset, lampW, on })` | ceiling strip with fluorescent fixtures |
| `fluorescent(g, x, y, w, on)` | one tube fixture |
| `floorTiles(g, { x, y, w, h, vpx, vpy, tile, rowPx, colors:[a,b], colors3, grout, far, fade })` | perspective checker/linoleum |
| `floorPlanks(g, { x, y, w, h, vpx, vpy, plank, ramp, seed, far, fade })` | perspective wooden floor |
| `rug(g, [tl, tr, br, bl], ramp, { border })` | carpet as a perspective quad |
| `cityWindow(g, x, y, w, h, { sky: 'dusk'\|'night'\|'day', seed, city, blinds, blindsDown, mullions, frame })` | window with skyline, lit windows, reflections, frame and sill |
| `door(g, x, y, w, h, { ramp, frame, glass, glassRamp, sign, signColor, knob: 'left'\|'right', open, inside })` | panelled door, optional frosted glass with text, or open (dark) |
| `signPlate(g, x, y, text, { ramp, color })` | small bevelled sign; returns width |

### Furniture & props
| helper | description |
|---|---|
| `desk(g, x, y, w, h, { ramp, depth, drawers, drawersBoth, kneeHole })` | desk seen front-above; returns `{ topY }` |
| `monitor(g, x, y, { on, screen: 'text'\|'blue', t, w, h, keyboard, kbdX, cursor })` | beige CRT + keyboard (pass `t` for the blinking cursor) |
| `deskLamp(g, x, y, { color, on })` | returns `{ lx, ly }` (bulb position for `lightCone`) |
| `telephone(g, x, y, { color, ringing })` | |
| `mug(g, x, y, { color, full, logo })` | |
| `papers(g, x, y, w, { n, seed })` | scattered sheets |
| `newspaperStack(g, x, y, w, n)` / `newspaperPage(g, x, y, w, h, { seed, accent })` | stacks / a tiny front page |
| `framed(g, x, y, w, h, inner(g, x, y, w, h), { ramp })` | picture frame with drop shadow |
| `bookshelf(g, x, y, w, h, { ramp, seed, shelves })` | random books |
| `filingCabinet(g, x, y, w, h, { ramp, drawers, open })` | `open` = drawer index pulled out |
| `corkboard(g, x, y, w, h, { seed, notes })` | pinned notes |
| `wallClock(g, cx, cy, r, timeHours)` | |
| `plant(g, x, y, { size, seed, leaves, potW, leaf, pot })` | potted plant (x, y = bottom centre of pot) |
| `officeChair(g, x, y, { color, back })` | |
| `trashBin(g, x, y, { w, h, full })` | wire bin |
| `extinguisher(g, x, y)` / `waterCooler(g, x, y)` | |

Write new reusable props in your own art file; if several rooms need them, propose (in your report) moving them
into `engine/draw.js`. Gertrudis' chrome and the cut-out Lector Medio in `content/actors.js` are examples of
`defineSprite` / paper-doll drawing with these helpers.

## 5. Recipe: a room in 10 steps
1. Ceiling strip (`gradV` dark ramp + `fluorescent`s) y 0–16.
2. Back wall (`wall`) with a lighter top; optional `wainscot` + `baseboard` along the floor line.
3. Floor (`floorTiles` / `floorPlanks` / `rug`) from the floor line to 144; vanishing point centred.
4. Side walls (offices) as `poly` trapezoids with `ditherPick` gradients.
5. Big shapes: windows, doors, shelves, cabinets. Then medium props: frames, boards, plants.
6. Small clutter: papers, mugs, cables, stickers (3–6 px details sell the scene).
7. Contact shadows under everything that touches the floor; dark strip at the wall/floor seam.
8. Light: `glow` under lamps/windows, then `vignette(g, width, 144, 0.4–0.7)`.
9. Interactive or state-dependent things go into **layout entries** with `sprites` per state or `draw` (`cache: true` if static).
10. Occluders in front of actors (pillars, desk fronts, plants) → `foreground` (always on top) or objects with
    `layer: 'sorted'` and a `zy` baseline (sorted with the actors' feet).

## 6. Characters
The cast is finished (`content/actors.js`, shared): paper dolls with signature silhouettes and colours, plus custom
sprites for Gertrudis and the cardboard Lector Medio. Review them with `node tools/actors.mjs` (→ `tools/shots/actores.png`).
Typical sizes at scale 1: ~55 px tall; plan furniture so a person at the back (scale ≈0.86) and at the front (≈1.0)
looks plausible next to desks and doors. Leave the top ~45 px of the view readable: speech balloons and the duel's
mail window («Responder a todos», y 2–47) are drawn there.

## 7. Item icons
Icons are in `content/items.js` (shared, finished): `icon(g, 0, 0)` draws inside **28×18**; a dark outline is added
automatically.

## 8. Previewing & screenshots
- Browser: `node tools/serve.mjs 8080`, then `http://localhost:8080/?room=<id>` (add `&debug=1` for walkboxes, hotspots
  with ids, coordinates under the mouse; `&entry=<entry>` to choose where Bruno appears). In the debug console:
  `flag cms_vivo true` to see a state, `goto <room> [entry]`.
- Headless: `node tools/shot.mjs <roomId> [entry] [--debug] [--x=<roomX>] [--scale=3]` → `tools/shots/room-<roomId>.png`
  (`--x` moves Bruno/camera along wide rooms such as `pecera`). It prints content errors and logic/art id mismatches
  (exit 1 if any).
- `node tools/check.mjs` must say `CHECK: OK`; `node tools/smoke.mjs` screenshots every room (`tools/shots/sala-<id>.png`).
- **`node tools/sala.mjs <sala>`** (redesign): the room in every act state (clean, debug with walkboxes / hotspots /
  talk-spot diamonds / the y = 45 balloon line, and «ver hotspots»), panorama of wide rooms, a contact sheet and the
  NPC visibility report → `tools/shots/sala/<sala>/`. `node tools/test-all.mjs --sala=<sala>` runs every test that
  concerns your room in parallel.

## 9. Guía para artistas de fondo (checklist)
1. Lee la descripción del fondo de tu sala en la biblia §3 (y las columnas Mirar: dicen qué debe verse) y la tabla
   «Estados por acto» de §3.0 (quién está y qué cambia).
2. Edita **solo** `content/rooms/art/<sala>.art.js`. No cambies ids ni añadas/quites claves de `layout` sin el autor de
   la lógica; nada de archivos compartidos (§0).
3. Sustituye `draw` por tu fondo (receta §5). Paleta coherente (3–5 rampas), luz desde arriba a la izquierda, línea de
   suelo y≈92–100, viñeta. Textos en carteles con la fuente del juego (cortos, sin marcas reales: el periódico es
   elContable.es y las empresas son las inventadas de la biblia §0).
4. Ajusta cada entrada de `layout` a tu dibujo: `rect`/`poly` generoso (≥ 8×8), `walkTo` dentro del suelo y `face`.
   Los objetos que cambian (fax sin/con papel, silla con/sin chaqueta, pantalla encendida/apagada, puerta OCUPADO…)
   van con `sprites` por estado o con `draw` que lee `view.flag(...)` — pregunta al autor los nombres de los estados.
5. PNJ: `at` (pies) donde la biblia los sitúa; `walkTo` para hablarles; `positions` si el autor usa varias.
6. `walkboxes` que no metan los pies en muebles; `entries` con una por cada sala vecina (§3.0, nombradas como esa sala);
   `scale` para que un personaje al fondo mida ≈0,85 y delante ≈1,0. `pecera` mide 800 de ancho (640 + la zona de Diseño y Producto con el ascensor).
7. Oclusores (columnas, mostradores, plantas) en `foreground` o como entradas con `layer: 'sorted'` y `zy`.
8. Comprueba: `node tools/shot.mjs <sala> --debug` (y sin `--debug`), `node tools/check.mjs` sin errores, sin errores de
   consola; la sala se lee a 1× (prueba del guiño); nada importante bajo los 45 px superiores.
9. Si necesitas un helper en `engine/draw.js` o un cambio en el motor: escríbelo en tu archivo o descríbelo en tu informe.

## 10. Rediseño: kit común y motor (resumen; el contrato completo está en `docs/GUIA_REDISENO.md`)

### 10.1 Kit (`content/lib/kit.js`, compartido) — `import * as kit from '../../lib/kit.js';`
| helper | qué pinta |
|---|---|
| `kit.PLANTA`, `kit.DEPTO` | código de color: banda de placa por planta (P−1 azul, P0 verde, P1 verde agua, P2 lila) y acento por departamento (`c`, rampa `suelo`) |
| `kit.micro(g, txt, x, y, c, { align, sombra })`, `kit.microW`, `kit.microLineas` | microfuente 3×5 canónica (4 px por carácter, tildes y Ñ; sin «¿¡»). Sustituye a las tres copias de `lib-oficina.js`, `lib-vestibulo-micro.js`, `lib-catacumba-util.js` (que siguen funcionando) |
| `kit.texto(g, txt, x, y, w, h, { color, align, fuente })`, `kit.cabe(txt, w, h)` | texto ENTERO sobre su soporte: fuente del juego si cabe, si no 3×5 partido por palabras; si no cabe ni así lo apunta en `kit.registro.problemas` (la auditoría falla) |
| `kit.placa(g, x, y, txt, { planta, flecha: '<' '>' '^' 'v', sub, depto })`, `kit.placaSala(g, x, y, roomId, { flecha })` | LA placa de destino del edificio (13 px; 19 con `sub`); `placaSala` usa el nombre llano de `content/lib/edificio.js` (`pajarera` → «DESPACHOS»); una placa por acceso, todas a la misma altura, nunca apiladas (vestíbulo de planta de la Redacción, `docs/GUIA_REDISENO.md` §6) |
| `kit.rotuloDepto(g, x, y, depto, { texto, colgado })`, `kit.rotuloZona(g, cx, y, depto)` | rótulo de departamento colgado del techo (filete de color arriba), centrado en su zona |
| `kit.umbral(g, x, y, w, h, color)`, `kit.marcoPuerta(g, x, y, w, h)`, `kit.huecoAbierto(...)`, `kit.peldanos(g, x, yBase, w, 'baja' \| 'sube')` | felpudo del color del destino, marco metálico común (la hoja la pintas tú), puerta abierta, tres peldaños de medio nivel (Vending ↔ Catacumba) |
| `kit.ascensor(g, x, y, w, h, planta)`, `kit.escalera(g, x, y, w, h, 'sube' \| 'baja')`, **`kit.nucleo(g, room, FL)`** | el núcleo completo e idéntico en las 4 plantas (devuelve la geometría `nucleoGeom` para `layout` y `entries`) |
| `kit.zonaSuelo(g, x0, x1, FL, depto, { vpx, vpy, borde })`, `kit.sueloZona(g, quad, ramp)`, `kit.filete(g, x0, x1, y, depto)`, `kit.pilastra(g, x, yTop, FL)`, `kit.mampara(...)` | las cuatro capas que delimitan una zona: suelo con canto de goma, filete de pared, pilastra en el cambio, mampara baja |
| `kit.cantoVivo(g, x, y, w, h)` | el lenguaje de lo interactivo: 1 px de luz cálida arriba-izquierda + 2 px de sombra de contacto (lo decorado no lo lleva) |
| `kit.registro` | caja de cada placa/rótulo/texto pintado: la auditoría comprueba que estén enteros y dentro de la sala |

Ejemplo completo (núcleo, zonas, placas, mesa con walkbox en U, PNJ sentado y tras la mesa, penumbra): `tools/demo-rediseno.js`.

### 10.2 Motor
| qué | en el arte | notas |
|---|---|---|
| pose sentada | NPC `at: [x, y, dir], pose: 'sentado' \| 'tras_mesa'` (también en `positions`) | `y` = pies en el suelo; `tras_mesa` = de la cadera arriba, el mueble delante tapa el resto (objeto `layer: 'sorted'` con `zy` mayor, o `foreground`) |
| penumbra | `penumbra(view, t) → { color, alpha, spots: [[cx, cy, rx, ry], { rect }], actor, actores } \| null`; NPC `luz: 0..1` | se oscurece todo menos los focos; los actores, al 22 % |
| walkbox con forma | varios polígonos (unión); `scale` propia por walkbox | se puede estar detrás, delante y a la cabecera de un mueble; ordénalo con `layer: 'sorted'` + `zy` |
| oclusores | `foreground` · `layer: 'front'` · `layer: 'sorted'` + `zy` · `prop: true` | nunca tapan una cara ni > 20 % de cabeza+torso de quien habla |
| ver hotspots | — (automático) | lo interactivo debe verse sin él; con él, se resalta con el canto vivo y el nombre; los rótulos no se pisan (se apartan y llevan línea guía) |
| tamaño mínimo | — (automático: 12×10 ratón, 16×12 táctil) | aun así, dibuja lo interactivo ≥ 12×10 (regla R1 de la auditoría) |
| `rediseno: true` | en el `export default` del arte | activa las reglas estrictas de la auditoría para tu sala |
