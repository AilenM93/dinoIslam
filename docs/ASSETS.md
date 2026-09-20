# Inventario de recursos visuales

## Definitivos para el prototipo

| Archivo | Uso | Estado |
| --- | --- | --- |
| `public/assets/minti-mascot.png` | Mascota verde menta, crema y coral con transparencia | Final del prototipo |
| `public/assets/nest-clearing-background.png` | Claro de selva con un único nido integrado y la isla al fondo | Final del prototipo |
| `public/assets/egg-mint-intact.png` / `egg-mint-open.png` | Huevo azul con hojas y su cascarón abierto | Final del prototipo |
| `public/assets/egg-sun-intact.png` / `egg-sun-open.png` | Huevo amarillo con motivo solar y su cascarón abierto | Final del prototipo |
| `public/assets/egg-coral-intact.png` / `egg-coral-open.png` | Huevo negro carbón con detalles grises y su cascarón abierto | Final del prototipo |
| `public/assets/foliage-left.png` / `foliage-right.png` | Cortinas de vegetación para el paso de la isla al nido | Final del prototipo |
| `public/assets/island-background.png` | Fondo panorámico para nacimiento, mapa y actividad | Final del prototipo |
| `public/assets/refuge-background.png` | Fondo panorámico del refugio | Final del prototipo |
| `public/assets/concept-master.png` | Lámina aprobada de cuatro escenas | Referencia maestra, no se usa como interfaz |
| `public/assets/hatching-nest.png` | Primer concepto de huevo y nido | Referencia heredada, ya no se carga en la experiencia |

Las letras, palabras, botones, marcadores y la Piedra del sol se dibujan en tiempo real para mantener texto nítido y adaptar la interfaz a distintas pantallas.

## Provisionales

- Ayuda hablada mediante la voz disponible en el navegador.
- Ambiente de brisa, llamada de ave y sonido de cascarón sintetizados con Web Audio.
- Microanimación de espera por interpolación de posición y escala.
- Iconos emoji del árbol y del altavoz, dependientes del sistema.

## Propuesta visual v2 — pendiente de integración

| Archivo | Uso previsto | Estado |
| --- | --- | --- |
| `design/assets-v2/island-adventure-map-v2.png` | Mapa panorámico con Nido, Bosque, Puente, Laguna y Cueva integrados físicamente | Candidato aprobado para revisión |
| `design/assets-v2/island-adventure-map-mobile-v2.png` | Composición vertical del mismo recorrido para teléfonos | Candidato aprobado para revisión |
| `design/assets-v2/ui-wood-sign-v2.png` | Superficie orgánica para nombres y mensajes breves | Candidato, fondo transparente |
| `design/assets-v2/ui-leaf-button-v2.png` | Botón principal con acabado vegetal y soporte de madera | Candidato, fondo transparente |
| `design/assets-v2/ui-stone-control-v2.png` | Base circular para sonido, movimiento, inicio y accesibilidad | Candidato, fondo transparente |
| `design/assets-v2/map-zone-locked-vines-v2.png` | Vegetación y niebla para representar una zona todavía dormida | Candidato, fondo transparente |
| `design/assets-v2/character-nest-listener-v2.png` | Compañero del Nido de sonidos, especializado en escucha | Candidato, fondo transparente |
| `design/assets-v2/character-forest-guide-v2.png` | Compañera del Bosque de letras, observadora de formas | Candidato, fondo transparente |
| `design/assets-v2/character-bridge-builder-v2.png` | Compañero del Puente de sílabas, constructor paciente | Candidato, fondo transparente |
| `design/assets-v2/character-lagoon-guide-v2.png` | Compañera de la Laguna de palabras, guía de significados | Candidato, fondo transparente |
| `design/assets-v2/character-cave-storyteller-v2.png` | Compañero de la Cueva de cuentos, narrador con luz de cristal | Candidato, fondo transparente |
| `design/assets-v2/refuge-lagoon-v2.png` | Concepto inicial del segundo refugio con colección de muestra | Referencia de composición |
| `design/assets-v2/refuge-lagoon-empty-v2.png` | Segundo refugio desbloqueable con estantes vacíos para logros reales | Candidato preferido para revisión |
| `design/assets-v2/reward-stone-echo-v2.png` | Piedra del Nido de sonidos con ondas talladas | Candidato, fondo transparente |
| `design/assets-v2/reward-stone-sun-v2.png` | Piedra del Bosque de letras con sol tallado | Candidato, fondo transparente |
| `design/assets-v2/reward-stone-bridge-v2.png` | Piedra del Puente de sílabas con puente tallado | Candidato, fondo transparente |
| `design/assets-v2/reward-stone-lagoon-v2.png` | Piedra de la Laguna de palabras con agua tallada | Candidato, fondo transparente |
| `design/assets-v2/reward-stone-story-v2.png` | Piedra de la Cueva de cuentos con libro tallado | Candidato, fondo transparente |
| `public/assets/minti-listen-v2.png` | Pose de escucha atenta de Minti | Integrado en las actividades |
| `public/assets/minti-walk-v2.png` | Pose de exploración y avance de Minti | Integrado en el mapa y la transición de aventura |
| `public/assets/minti-celebrate-v2.png` | Pose de celebración de Minti | Integrado en las respuestas correctas |
| `public/assets/minti-rest-v2.png` | Pose horizontal de descanso para los refugios | Integrado en el refugio |
| `public/assets/minti-blink-v2.png` | Fotograma de parpadeo para la presentación de Minti | Integrado en el piloto de animación |
| `design/assets-v2/map-zone-awaken-v2.png` | Floración y luciérnagas para la animación de desbloqueo | Candidato, fondo transparente |

Estos archivos no sustituyen todavía los recursos activos. Se conservan con el sufijo `v2` hasta aprobar composición, legibilidad, estados de desbloqueo y adaptación táctil.

## Pendientes

- Narración y palabras grabadas, editadas y revisadas en español.
- Hojas de animación cuadro a cuadro para ampliar caminar y celebrar; el piloto actual usa cambios de pose e interpolaciones.
- Fondos propios para las zonas futuras del mapa.
- Ilustraciones de vocabulario validadas y recompensas decorativas ampliables.

## Prompts usados

Se utilizó la lámina `concept-master.png` como referencia de estilo en las generaciones originales con la herramienta integrada de imágenes:

1. **Mascota:** cría de dinosaurio de cuerpo completo, verde menta, vientre crema, protuberancias coral, ojos marrones grandes, acabado 3D de película infantil y fondo realmente transparente.
2. **Huevo/nido:** huevo crema moteado empezando a romperse, nido tejido, hojas tropicales, formas redondeadas, luz dorada y fondo realmente transparente.
3. **Isla:** vista elevada panorámica 16:9, mar turquesa, bosque redondeado, volcán amable, cascada, senderos y claros, sin personajes, texto ni interfaz.
4. **Refugio:** escenario 16:9 junto a una laguna, cama de hojas en árbol curvo, flores coral, piedras redondeadas, atardecer cálido, sin personajes, texto ni interfaz.

En los cuatro casos se pidió conservar el volumen suave, la paleta tropical y el acabado de animación infantil de la referencia, sin marcas de agua.

Para la nueva introducción también se usaron `island-background.png` y el concepto anterior del nido como referencias de continuidad. Se generaron por separado:

1. **Claro del nido:** una sola composición horizontal con el nido físicamente integrado en musgo, tres huecos visibles, luz cálida coherente y cascada al fondo, sin huevos, personajes ni interfaz.
2. **Huevos enteros:** tres recortes transparentes distintos —azul con hojas, amarillo con sol y negro carbón con detalles grises— con sombras de contacto suaves y la misma perspectiva.
3. **Cascarones abiertos:** tres recortes transparentes que conservan exactamente los colores y motivos de cada huevo para sustituirlo después del toque.
4. **Vegetación de transición:** capas transparentes izquierda y derecha de hojas tropicales, flores coral y helechos para crear el acercamiento al claro.

Todos los recursos nuevos se pidieron sin texto, marcas de agua ni elementos de interfaz, con formas redondeadas, volumen suave y luz compatible con la isla existente.
