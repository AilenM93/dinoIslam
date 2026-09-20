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

## Pendientes

- Narración y palabras grabadas, editadas y revisadas en español.
- Hojas de animación de Minti: espera, caminar, celebrar, escuchar y descansar.
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
