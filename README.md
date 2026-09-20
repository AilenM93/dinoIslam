# Dino Island

Primera base jugable de una aventura de lectura en español para niñas y niños de 4 a 6 años. El recorrido permite elegir un huevo, conocer a Minti, explorar cinco aventuras de lectura y decorar el refugio con las piedras obtenidas.

## Ejecutar

Requisitos: Node.js 20.19+ o 22.12+.

```bash
npm install
npm run dev
```

La dirección local predeterminada es `http://127.0.0.1:5173`. Para comprobar la versión de producción:

```bash
npm run build
npm run preview
```

## Firebase Hosting

La configuración de Hosting publica la carpeta `dist` y redirige las rutas de la aplicación a `index.html`.

```bash
npm run build
firebase login
firebase use --add
firebase deploy --only hosting
```

El identificador del proyecto seleccionado por `firebase use --add` se guarda en `.firebaserc`. No se deben guardar contraseñas, claves privadas ni tokens en el repositorio.

## Recorrido incluido

1. **Nacimiento:** una entrada narrativa recorre la isla, conduce al nido y permite abrir uno de tres huevos distintos para conocer a Minti.
2. **Mapa:** las cinco zonas están activas, muestran sus misiones y marcan con un visto las aventuras completadas.
3. **Actividades:** Nido de sonidos, Bosque de letras, Puente de sílabas, Laguna de palabras y Cueva de cuentos ofrecen una misión breve con ayuda hablada, repetición y pistas tras varios intentos.
4. **Refugio:** cada misión entrega una piedra distinta. Las piedras aparecen integradas sobre el camino del refugio y se pueden tocar para recordar qué logro representan.

El progreso se guarda en `localStorage` del navegador. La versión actual migra automáticamente el avance anterior y conserva la Piedra del sol ya conseguida. No existen cuentas, pagos, publicidad, rachas, clasificación ni contrarreloj.

## Tecnología y estructura

- Phaser 3 para escenas, interacción táctil/ratón, transiciones y microanimaciones.
- TypeScript y Vite para una base reproducible y ampliable.
- `src/game/content.ts` separa el contenido educativo de las escenas.
- `src/game/progress.ts` contiene el guardado local versionado.
- `src/game/settings.ts` gestiona ayuda hablada, ambiente sintetizado, anuncios y reducción de movimiento.

La voz usa provisionalmente `SpeechSynthesis` del navegador y los sonidos de ambiente, ave y cascarón se sintetizan con Web Audio después del primer gesto. Pueden variar entre dispositivos y no sustituyen una narración ni un diseño sonoro grabados y revisados. La actividad reproduce palabras completas; no usa nombres de letras como si fueran fonemas.

La opción de movimiento reducido reemplaza el acercamiento y las sacudidas intensas por fundidos. El huevo elegido y el resto del progreso se conservan en el navegador.

Capturas del inicio: [escritorio](docs/screenshots/intro-start-desktop.png) y [formato vertical](docs/screenshots/intro-start-mobile.png).

La matriz de comprobaciones está en [docs/QA.md](docs/QA.md).

## Progresión activa

La estructura del mapa incluye cinco etapas jugables: Nido de sonidos (discriminación del habla), Bosque de letras (letra-sonido), Puente de sílabas, Laguna de palabras y Cueva de cuentos (frases e historias). Cada etapa contiene una primera misión corta y una piedra de logro propia.

La primera interacción orienta la ayuda y no funciona como diagnóstico. Una futura adaptación debe observar varias respuestas, reutilizar habilidades en distintos contextos y ofrecer repetición, ejemplos o menos opciones; no debe medir dominio por velocidad.

## Alcance y límites

- Más misiones por etapa, la grabación de audio, la animación de personaje por fotogramas y la validación con niños están pendientes.
- Las imágenes finales son renders únicos; las microanimaciones actuales son desplazamientos y transiciones realizados por el motor, no animación corporal completa.
- Las cinco primeras misiones requieren una revisión pedagógica con especialistas y pruebas con familias antes de considerarse contenido final.
- Las recompensas decorativas son vectoriales y ampliables; ya forman una colección persistente dentro del escenario del refugio.
- Este prototipo no afirma eficacia pedagógica demostrada.

Consulta [docs/ASSETS.md](docs/ASSETS.md) para el inventario visual y la procedencia de los recursos.
