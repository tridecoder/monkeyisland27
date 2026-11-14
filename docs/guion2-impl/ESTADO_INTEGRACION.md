# Estado de la integración — reescritura de comedia (P0 + P1-P4)

Integración de los cuatro paquetes de sala sobre el paquete común, según `docs/guion2/PLAN_COMEDIA.md` (con la
ENMIENDA E1) y las peticiones de los informes de P1-P4.

## Hecho

**Motor**
- `engine/font.js`: glifo «›» (la pantalla del portátil de Herminia: «PORTÁTIL: › …»).
- `engine/duel.js`: una contestación de floja escrita como lista de líneas (`['…', '…']`) la dice entera el rival
  (antes se tomaba como `[quién, línea]` y no se oía nada). El CC que crece acaba en «Toda la empresa».
- `engine/core.js`: `G.migrarPartida(state)` en cada carga; cuando acaba el último guion bloqueante, la cámara vuelve a
  seguir a Bruno (la escena viral de la Redacción la dejaba clavada y no se podía llegar a la puerta del Cierre).
- `engine/efectos.js`: en la estampida, `atasco.alFrente(id)` adelanta un paso al que habla (nadie le tapa).

**Contenido común**
- `content/game.js`: llamada **LC** de Evaristo (§5.13; prioridad, pone `correo_evaristo_listo`, cuenta en
  `evaristo_llamadas`, hasta 6); migración de partidas (§3.4); abuela: línea previa del nivel 1 de Recorte con
  `herminia_midio` (E1.4.1); dos respuestas por defecto sin «ticket» y una sin «Dirección».
- `content/pistas.js`: `salas` de acta (`pajarera`), hueco (`sala_amazonas`) y armario (+ `pecera`, momento 8); la
  silla cuenta desde el torno; meta propia de Bruno para álbum y baja.
- `content/items.js`: ficha viva con «Sobra un 26 %, dice Herminia»; fuera `planillo` y `posit_baja_ruben`.
- `content/flags.js`: fuera `leoncio_acepta_alta`, `bandeja_diseno_abierta`, `rumor_atun_n`, `rumor_plaza_n`,
  `gertrudis_error_indice`; alta `evaristo_lc`; descripciones al día.
- `content/actors.js`: fuera el actor `herminia`; murmullos de Leoncio y Anselmo (E1.6), Yoli (§5.4) y Nemesio sin
  «Diseño»; Valentín sin murmullos (cameo mudo); variantes `bruno.con_bufanda` y `celestino.sin_bufanda` (epílogo).
- `content/lib/movil.js`: `RV_TADEO` de cinco a tres, sin siglas (§5.16); llamadas perdidas hasta 6.

**Salas (costuras)**: ver el informe final de integración (lista de costuras y líneas tocadas).

**Pruebas**
- `tools/walk-data.mjs`: recorrido de 42 pasos (§3.2 + E1.4.4) y orden `ALT`; `walkthrough.mjs` comprueba además el
  final (Abrígate tú → periódico → tarjeta → créditos).
- `tools/extras.mjs`: tabla §3.5 + E1.9 + informes (81 pasos), con `['perder']` y `esp.log`.
- `tools/test-paquete-a/b/c/d.mjs` retirados; los sustituyen `tools/test-comedia-p1..p4.mjs`, y lo que aún valía de los
  antiguos va en `tools/test-heredado.mjs`. `test-all.mjs` los lanza (y el mapa por sala apunta a ellos).
- `text-audit --plan` dentro de `test-all` (las reglas del plan son fallo). Reglas nuevas en `tools/plan-rules.mjs`:
  «Dirección» solo en «Reunión de Dirección»; Diseño e Infografía nunca en la misma línea; el nombre del periódico real
  en ningún fichero del repositorio; muletillas citadas entre comillas no cuentan; Eventos (protegida) fuera del tope de
  muletillas de Bruno.
- fuzz, play-mouse, smoke, review y text-audit al recorrido nuevo.

## Abierto

- «Diseño y Infografía nunca en la misma escena» se comprueba por línea, no por escena (se revisó a mano: 7.2, anexión,
  momento 8 y `P_ALTA` no los juntan).
- `fax_tecla_n` lo leen las pruebas; la sala usa sus flags locales (`catacumba_tecla1/3`) para Teodoro y Evaristo.
- El tope de «Diseño» (≤ 11) cuenta las líneas que se oyen en una partida automática; las ramas raras no se cuentan.
- `tools/review.mjs` y `tools/escenas.mjs` (fuera de `test-all`) no se han vuelto a ejecutar enteros.
