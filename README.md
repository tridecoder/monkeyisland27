# FE DE ERRATAS

*Una aventura de cierre.* Aventura gráfica «point and click» original, al estilo de las de los noventa (9 verbos,
inventario, diálogos y duelos verbales por correo: «Responder a todos»), hecha en JavaScript sin dependencias ni
compilación: todo el arte es pixel art procedural y la música se sintetiza en el navegador.

Viernes, 18:30. Bruno Pellejo, becario desde hace seis años en el periódico ficticio **elContable.es**, tiene hasta el
cierre de las 21:00 para firmar, por fin, en papel.

> El medio, la empresa y **todos los personajes son ficticios**. Cualquier parecido con periódicos, empresas o personas
> reales es pura coincidencia.

## Jugar en local

```
node tools/serve.mjs          # http://localhost:8080/  (otro puerto: node tools/serve.mjs 9000)
```

Hace falta servirlo por HTTP (son módulos ES); vale cualquier servidor estático. Todas las rutas son relativas, así que
funciona tal cual desde una subcarpeta (por ejemplo, GitHub Pages: basta publicar la raíz del repositorio; el fichero
`.nojekyll` evita que Jekyll toque nada).

## Jugar en el iPhone (pantalla completa, en horizontal)

El Safari del iPhone no deja poner una web a pantalla completa, pero el juego se instala como una app y así se abre sin
barras del navegador:

1. Abre el juego en **Safari**.
2. Toca **Compartir** (el cuadrado con la flecha hacia arriba) y elige **«Añadir a pantalla de inicio»**.
3. Abre **Fe de erratas** desde el icono nuevo, con el móvil **en horizontal**.

La partida se guarda igual (autoguardado al cambiar de sala). En el iPad, Android y el ordenador basta con la opción
**«Pantalla completa»** del título o del menú de pausa (o la tecla **F**). En vertical se puede jugar, pero sale un aviso
para girar el móvil: en horizontal el juego ocupa todo el alto.

## Controles

- **F**: pantalla completa (ordenador).
- **Clic izquierdo** en el suelo: andar. Sobre un objeto o persona: «Ir a».
- **Verbo + objeto**: clic en un verbo y luego en el objeto, la persona o el icono del inventario.
  «Usar» y «Dar» con un objeto del inventario: verbo → objeto → destino.
- **Clic derecho** (pulsación larga en táctil): verbo por defecto (Mirar, Hablar, Ir a).
- **Clic** durante un texto: pasa al siguiente. **Esc**: salta una escena o abre el menú (guardar, cargar, velocidad
  del texto, volumen). El icono ≡ del panel también abre el menú. **1-9**: elegir opción de diálogo.
- La partida se autoguarda al cambiar de sala («Continuar» en el título) y hay 3 ranuras manuales.
- Si te atascas: **Usar el móvil** (llama la abuela y da una pista).

## Pruebas

Necesitan Node 18+ y `playwright` (con Chromium) accesible para Node.

| comando | qué hace |
|---|---|
| `node tools/test-all.mjs [--rapido] [--sala=<id>]` | **todas las pruebas** en paralelo con tabla de resumen (cada una en su propio puerto libre) |
| `node tools/sala.mjs <id>` | vista previa de una sala para los artistas: todos los actos, depuración, «ver hotspots» e informe de PNJ (rediseño: `docs/GUIA_REDISENO.md`) |
| `node tools/test-motor.mjs` | motor y kit del rediseño (pose sentada, penumbra, plano detalle, ver hotspots, objetivos táctiles) sobre una sala de demostración |
| `node tools/check.mjs` | comprobación estática del contenido (ids lógica/arte, flags, salidas, líneas de más de 80 caracteres) |
| `node tools/smoke.mjs` | prueba de humo de la interfaz (título, 10 salas, inventario, duelo, guardar/cargar, menú, créditos, táctil) |
| `node tools/walkthrough.mjs [--alt]` | la partida completa (46 pasos del guion), en el orden de la tabla o en el alternativo |
| `node tools/extras.mjs` | la partida completa con todos los extras intercalados (90 pasos) |
| `node tools/test-paquete-{a,b,c,d}.mjs` | pruebas detalladas por grupo de salas |
| `node tools/play-mouse.mjs [--solo=raton\|conexiones\|geometria]` | la partida **entera** (pasos 1-46, los cuatro duelos y el final) **solo con ratón real**, cada salida del edificio en los dos sentidos con clics reales, y la auditoría de geometría de todos los hotspots en cada acto |
| `node tools/escenas.mjs [--pasos=8,46]` | revisión de escenas: una captura por línea dicha (intro, 7.2, duelos, 7.3a, 7.3, clímax, epílogo, créditos, poscréditos) y quién habla fuera de cámara o tapado |
| `node tools/contactos.mjs [--actos=a1]` | hoja de contactos del edificio: las 10 salas en cada acto y los cuatro núcleos lado a lado (`tools/shots/rediseno/final/`) |
| `node tools/fuzz.mjs` | guardar/cargar en cada acto, perder cada duelo, y Dar/Usar todo con todo (sin callejones) |
| `node tools/contrast.mjs` | legibilidad: contraste de los colores de cada personaje sobre los fondos reales, del panel, los menús y el duelo |
| `node tools/make-icons.mjs` | regenera los iconos de la web app (`icons/`) con el propio código de dibujo del juego |
| `node tools/text-audit.mjs` | auditoría de textos (longitud, signos de apertura, nombres, horas y palabras prohibidas a la vista: «Pajarera», «Office») |
| `node tools/music-check.mjs` | comprueba las pistas de música |
| `node tools/review.mjs` | hojas de contactos para revisión visual (todas las salas por acto y los momentos clave) |
| `node tools/shot.mjs <sala> [--debug]` | captura de una sala · `node tools/actors.mjs`: hoja del reparto |

Depuración en el navegador: `?debug=1` (hotspots, suelo, consola con F3) y `?room=<sala>` (empezar en una sala).

## El edificio

Diez salas en cuatro plantas, con un mismo núcleo (escalera + ascensor) en cada una (mapa completo:
`docs/CONTENT_SCHEMA.md` §2.6; rediseño: `docs/GUIA_REDISENO.md`):

- **Planta 2:** Marketing y Comercial (con la puerta de Eventos / Sala Polivalente y el pasillo de Administración).
- **Planta 1:** la Redacción (940 px: Dirección, el Vending, la Secretaría de Redacción y, al lado, tras una puerta doble,
  la Redacción de papel / Cierre; de Dirección se pasa a la Sala Amazonas).
- **Planta 0:** el Vestíbulo (tornos). **Planta −1:** Sistemas (solo en ascensor).

## Estructura

```
index.html, style.css      página y lienzo (320×200, escalado entero)
engine/                    motor: bucle, salas, actores, caminos, diálogos, duelos, interfaz, audio, fuente bitmap
content/game.js            título, respuestas por defecto, pistas, avisos comunes
content/actors.js          el reparto · content/items.js: el inventario · content/duelo.js: datos de los duelos
content/flags.js           todos los flags · content/music.js: la música
content/rooms/<sala>.js    lógica de cada sala (textos, puzles, diálogos) · content/rooms/art/<sala>.art.js: su arte y geometría
content/escenas/           escenas largas (clímax, final y créditos)
docs/                      guion (GUION_BIBLIA.md, GUION_ADENDA.md) y referencias técnicas (CONTENT_SCHEMA.md, ART_GUIDE.md)
tools/                     servidor local, pruebas y utilidades de captura
```
