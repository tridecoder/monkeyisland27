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

## ENMIENDA E2 — paquete común (P0) entregado

Detalle para los autores en `docs/guion2-impl/GUIA_AUTORES.md` §E2. Resumen: motor (despedidas una sola vez,
`api.detalle` con `cerrarX` / `cuenta` / `bloqueo`, `api.pantalla` con los prefijos de `game.js` `pantallas`, adhesivo
`backSign` del muñeco y variantes `con_banner` / `con_chaqueta_banner` de Bruno, `game.mudo`); datos (llamadas L1, L3,
L4, L5; RV sin aviso; objeto `correo_evaristo`; ficha y pistas de la coma; altas de §10.2; migración de partidas);
`plan-rules.mjs` / `text-audit.mjs` con los topes de E2 §12.4 y el aviso de §7.6 como avisos (`--e2` para que fallen).
**Pendiente de la integración (tras P1-P4):** `walk-data.mjs` (44 pasos) y `extras.mjs` de §10.1; retirar lo marcado
`// [E2: retirar en integración]` (Nemesio, Borja, `evaristo_lc`, `evaristo_convoco` y su puente, `rumor_firma_n`,
`planta_oyo`); pasar `--e2` en `test-all`.

## ENMIENDA E2 — integración (P0 + P1-P4)

**Hecho**
- **Recorrido de 44 pasos** (`tools/walk-data.mjs`, E2 §10.1 con las acciones de los informes): Anselmo en 24 y 40,
  Maripaz y su pop-up en 26 (`bruno_con_banner`), Evaristo en 28 y 32 (Aurora quita el adhesivo), mazos de la fase B en
  33, 41 y 43 (tres remates). `ALT` de §10.1. `walkthrough`, `--alt`, `fuzz`, `text-audit` y `play-mouse` lo usan.
- **Extras** (`tools/extras.mjs`, 79 pasos): fuera X3, —14, X17, X18, X19, X21, X25 y —LC; X1 con
  `vestibulo_planta_oyo`; XE1 con «HERMINIA (IA) › »; XM2 sin `evaristo_convoco`; XM7 con «Siestatón no ha confirmado la
  página 7.» (y el 1.er pop-up); rumor C: Aurora 1 → Maripaz 2 (—C3) → desmentido de Teodoro (—T0); nuevos XP4a (aro de
  Borja ×3 tras el anuncio de entrada), XP4b (pantalla de Comercial), XE5 (prisa con Evaristo, sin coste) y XE6 (el
  correo de Evaristo a Begoña, que no se gasta; va tras el 33 porque el correo se recibe en el 32).
- **play-mouse sin modo rápido**: los anuncios de Maripaz se cierran como un jugador (clic en la «×» de 3 px y de 1 px;
  sin «×», un clic durante «Podrá cerrar en 3» que no la cierra y otro al acabar); el 26 abre el pop-up tres veces antes
  de la D1; el anuncio de entrada de Marketing (paso 39, de camino a Eventos) se comprueba igual. Espera de `settle`
  hasta 4 min (el paso 44 con epílogo y créditos pasa del minuto y medio).
- **Bajas**: actores `nerea_backlog` y `borja_engagement`; flags `evaristo_convoco`, `evaristo_lc`, `rumor_firma_n`,
  `planta_oyo`; el puente `puenteE2`; los topes de Nemesio y Borja. `migrarPartida` los borra de las partidas (también
  `pecera_nemesio_saludo` y las posiciones guardadas de los dos actores) y deshace una `coma_bendecida` sin
  `correo_evaristo_listo` (petición de P3). `coma_bendecida`, `correo_evaristo_listo` y `tadeo_rv_n` estaban dentro de
  un comentario en `ADENDA_FLAGS` y no se inicializaban: ahora sí.
- **text-audit con `--plan --e2`** en `test-all` (los topes de E2 son fallo). «cariño»: tope global 20 sin contar
  Eventos (hoy 15); Maripaz recupera seis de E2 §4 (exnovio, `defeatLines` de D1, «A mí no se me coge», roll-up ×2,
  «Pellizco»). Recuentos: «desde [fecha]» 6/6, «(*» 0, «interstitial» 1/2, «pop-up» 5/8, «Emoji de fuego» 8/8,
  «PORTÁTIL:» 0, «Diseño» (cadenas) 7/11.
- **Eventos**: el rumor C de Pilar vuelve (sus dos líneas de antes) como gag suelto: una vez, con el Acto II empezado,
  marca local `once:eventos_pilar_rumor`; ya no suma a la cadena. El «CLS de Tadeo» de la cuenta atrás se queda (E2 no
  lo nombra).
- **Costuras**: desmentido de Teodoro con `rumor_teodoro_n ≥ 2` (la cadena ya no pasa por Yoli ni Pilar: con ≥ 3 nunca
  salía); reacción de Gervasio al adhesivo también en la Sala (misma marca que la de Despachos); adhesivo del sprite de
  5×4 a 7×5 de espaldas y de 2×4 a 3×5 de perfil; el 5.º «¿De dónde viene?» de Anselmo (anexión) pasa a
  «¿Procedencia?»; meta de la coma sin «tres veces» (en el paso 28 solo ha sonado la L1); fuera la línea de Yoli «Sin
  CMS. Sin edición. Sin pudor…» (E2 §7.4, paso 16, seguía en la escena viral).
  Topes que el `text-audit` completo encontró: «criatura» de Aurora 9 → 6 (fuera en «Deja el cartel», «Dime» y
  «Lleva toda la tarde contestándote»; se quedan las literales de E2) y Bruno ya no dice «cinco minutos» sin comillas
  (aro de Borja: «Lo de «faltan cinco minutos» se lo ha copiado a Pilar.»).
- **Pruebas**: `node tools/test-all.mjs` 17/17 en verde (809 s), sin errores de consola. Capturas revisadas en
  `tools/shots/e2-int-*.png`.
- **Medida del recorte** (E2 §12.3; el recorrido jugado con sus herramientas, `__game.log` sin avisos ni tarjeta):
  `main` (42 pasos) 619 líneas, 28.444 caracteres, 35,4 min, Bruno 175 → E2 (44 pasos) 553 líneas, 26.458 caracteres,
  32,5 min, Bruno 155: −66 líneas (−10,7 %), −2,9 min (−8,2 %).

**Abierto**
- El objetivo de §12.3 (≤ 545 líneas y Bruno ≤ 135) no se alcanza: faltan 8 líneas y 20 de Bruno (sus líneas cuentan
  las opciones elegidas en el recorrido).
- «Diseño e Infografía nunca en la misma escena» se sigue comprobando por línea; por escena, a mano (7.2, paso 34,
  momento 8, paso 40 y anexión no los juntan).
- El nombre del periódico real solo se comprueba con `MARCA_VETADA=<expresión>` en el entorno (no vive en el repo).
