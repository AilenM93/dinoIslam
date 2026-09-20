# Dino Island

Primera base jugable de una aventura de lectura en español para niñas y niños de 4 a 6 años. El recorrido actual permite elegir un huevo, conocer a Minti, explorar el mapa, resolver una actividad real y guardar una recompensa en el refugio.

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
2. **Mapa:** la isla muestra la progresión futura, permite repetir el nacimiento sin borrar el avance y abre el Bosque de letras.
3. **Actividad:** escucha la palabra `SOL`, elige su letra inicial, puede equivocarse, repetir la ayuda y recibir una pista con menos opciones.
4. **Refugio:** guarda una Piedra del sol y puede repetir la misión o volver al mapa.

El progreso se guarda en `localStorage` del navegador. No existen cuentas, pagos, publicidad, rachas, clasificación ni contrarreloj.

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

## Progresión prevista

La estructura del mapa conserva cinco etapas: Nido de sonidos (discriminación del habla), Bosque de letras (letra-sonido), Puente de sílabas, Laguna de palabras y Cueva de cuentos (frases e historias). Solo se implementa una misión corta del Bosque de letras.

La primera interacción orienta la ayuda y no funciona como diagnóstico. Una futura adaptación debe observar varias respuestas, reutilizar habilidades en distintos contextos y ofrecer repetición, ejemplos o menos opciones; no debe medir dominio por velocidad.

## Alcance y límites

- El currículo completo, la grabación de audio, la animación de personaje por fotogramas y la validación con niños están pendientes.
- Las imágenes finales son renders únicos; las microanimaciones actuales son desplazamientos y transiciones realizados por el motor, no animación corporal completa.
- El rediseño pedagógico y visual del mapa queda como una fase posterior; esta revisión se concentra en el inicio narrativo.
- La recompensa decorativa es vectorial y simple, pensada como demostración del sistema.
- Este prototipo no afirma eficacia pedagógica demostrada.

Consulta [docs/ASSETS.md](docs/ASSETS.md) para el inventario visual y la procedencia de los recursos.
