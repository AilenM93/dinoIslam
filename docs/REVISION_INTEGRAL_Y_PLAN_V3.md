# Revisión integral y plan de mejora V3

Fecha de revisión: 20 de septiembre de 2026

Estado analizado: versión local y versión publicada en Firebase Hosting
Resoluciones revisadas: escritorio `1440 × 900` y móvil `390 × 844`

## 1. Veredicto ejecutivo

La versión actual demuestra el recorrido técnico principal —nacimiento, mapa, actividad, recompensa, desbloqueo y refugio—, pero todavía funciona como un prototipo vertical, no como un juego educativo completo.

Las observaciones del usuario son correctas:

1. Las cinco zonas reutilizan esencialmente el mismo ejercicio de tres respuestas.
2. No existe una colección de runas como sistema jugable, inventario o galería.
3. Parte de los diseños nuevos fue generada, pero no integrada en el juego.
4. Las animaciones son interpolaciones simples de posición, escala y rotación; no transmiten acciones con suficiente calidad.
5. El desbloqueo ocurre demasiado pronto y no representa dominio ni progreso didáctico.
6. El refugio no refleja de forma convincente los logros obtenidos.

La prioridad no debe ser añadir más preguntas al mismo molde. Primero hay que corregir el modelo de contenido y progresión; después, integrar la colección, las mecánicas diferenciadas y el acabado visual.

## 2. Alcance de la revisión

La revisión se realizó desde los siguientes puntos de vista:

- Niño o niña de 4 a 6 años.
- Diseño didáctico y alfabetización inicial.
- Diseño de juego, motivación y progresión.
- Dirección de arte, interfaz y legibilidad.
- Animación y retroalimentación.
- Colección de runas y personalización del refugio.
- Accesibilidad y acompañamiento familiar.
- Arquitectura técnica, rendimiento y control de calidad.

También se recorrieron los estados de nacimiento, mapa sin progreso, mapa parcial, mapa completo, las cinco actividades, refugio y vistas móviles.

## 3. Hallazgos por punto de vista

### 3.1. Experiencia infantil

**Lo que funciona**

- La isla, Minti y los huevos crean una identidad amable.
- No hay temporizadores, clasificaciones, castigos ni pérdida de progreso.
- Los mensajes de error son neutrales.
- El mapa permite anticipar que existen lugares por descubrir.

**Lo que debe mejorar**

- Después de la primera actividad, el patrón se vuelve predecible: consigna, tres botones y respuesta.
- Algunas consignas dependen de leer palabras impresas, incluso en la zona inicial destinada a sonidos.
- Las recompensas no alteran el mundo de una forma suficientemente visible.
- Las zonas bloqueadas parecen portales repetidos colocados sobre el mapa, no partes naturales de la isla que despiertan.
- En móvil, los nombres y objetivos de las zonas no siempre están visibles antes de tocar.
- No existe una pantalla clara donde el niño pueda observar, ordenar y volver a visitar sus runas.

### 3.2. Diseño didáctico

La secuencia general —sonidos, letras, sílabas, palabras e historias— es apropiada como estructura. Sin embargo, la implementación actual no ofrece práctica suficiente ni variedad de evidencia para afirmar que una habilidad fue adquirida.

Problemas principales:

- Hay una sola misión por zona.
- Las cinco misiones usan el mismo formato de selección múltiple textual.
- El desbloqueo se produce con una única respuesta correcta.
- Se repite vocabulario, especialmente `SOL`, sin una estrategia explícita de transferencia o contraste.
- La misión de sonidos exige reconocimiento de palabras escritas y no se apoya en audio e imágenes de manera suficiente.
- La misión de historias es una frase incompleta, no una actividad de secuencia, comprensión o narración.
- No existe disminución progresiva de ayudas ni registro de dominio por habilidad.

El modelo recomendado sigue la progresión de unidades grandes a pequeñas del habla, relación sonido-letra, construcción y decodificación de palabras, y lectura de texto conectado descrita por la guía de alfabetización inicial del [Institute of Education Sciences](https://ies.ed.gov/ncee/wwc/PracticeGuide/21).

### 3.3. Diseño de juego y progresión

El mapa sí cambia visualmente al desbloquear zonas, pero el sistema actual confunde avance con dominio. Una única respuesta abre la siguiente aventura y no hay razones jugables para regresar.

Faltan:

- Variantes recurrentes por zona.
- Historial para evitar repeticiones inmediatas.
- Nivel de ayuda adaptativo.
- Dominio por habilidad y no solo una lista global de misiones completadas.
- Recompensas intermedias y transformaciones persistentes del refugio.
- Actividades repetibles después de completar una misión.

Existe además un defecto funcional: desde el refugio, `Repetir` puede abrir una misión ya completada con sus opciones deshabilitadas. El botón promete repetición, pero la actividad no se puede jugar de nuevo.

### 3.4. Dirección de arte e interfaz

La ilustración de la isla tiene más profundidad y acabado que los paneles, botones y recompensas superpuestos. Esto produce dos lenguajes visuales diferentes.

Activos nuevos todavía no integrados:

- `design/assets-v2/refuge-lagoon-empty-v2.png`
- `design/assets-v2/refuge-lagoon-v2.png`
- `design/assets-v2/reward-stone-bridge-v2.png`
- `design/assets-v2/reward-stone-echo-v2.png`
- `design/assets-v2/reward-stone-lagoon-v2.png`
- `design/assets-v2/reward-stone-story-v2.png`
- `design/assets-v2/reward-stone-sun-v2.png`
- `design/assets-v2/ui-leaf-button-v2.png`
- `design/assets-v2/ui-wood-sign-v2.png`

Problemas visibles:

- El refugio continúa usando el fondo anterior.
- Las recompensas son elipses planas dibujadas por código en lugar de los diseños generados.
- Los paneles crema y botones genéricos dominan la escena y ocultan el mundo.
- Se usan símbolos o emoji que no comparten el acabado de las ilustraciones.
- Los compañeros desbloqueados son demasiado pequeños y quedan visualmente encerrados en los indicadores florales.
- La misma pantalla de lectura se reutiliza en las cinco zonas sin identidad ambiental propia.
- El control para borrar logros parece provisional y está demasiado expuesto para un público infantil.

### 3.5. Animación y retroalimentación

Las animaciones actuales son funcionales, pero toscas porque simulan acciones completas con una imagen estática que se desplaza o rebota.

Situación actual:

- Caminar: pose estática trasladada por la pantalla.
- Celebrar: cambio de textura, rebote y fundido.
- Parpadear: cambio puntual de textura.
- Compañeros: flotación vertical genérica.
- Mundo: pocos ciclos ambientales y escasa respuesta local.

Faltan anticipación, contacto con el suelo, seguimiento de dirección, recuperación de pose y animaciones diferenciadas por personaje y contexto.

### 3.6. Colección de runas y refugio

No existe actualmente una colección de runas. Hay un arreglo de decoraciones derivado de misiones completadas, pero no hay:

- Inventario de runas.
- Estados de descubrimiento.
- Fragmentos o niveles.
- Vista de colección.
- Descripción de cada logro.
- Transformación visible progresiva del refugio.
- Relación explícita entre zona, aprendizaje, runa y decoración.

Por tanto, las piedras actuales no deben presentarse como una colección terminada.

### 3.7. Accesibilidad y familias

El lienzo de Phaser aparece para tecnologías de asistencia como una única imagen. Los controles del juego se crean con `setInteractive`, pero no tienen equivalentes DOM operables mediante teclado.

Problemas:

- Zonas, huevos, respuestas, piedras y reinicio son controles solo de puntero.
- No existe orden de foco ni foco visible dentro del juego.
- La narración depende de síntesis de voz del dispositivo y no de grabaciones consistentes.
- Algunas instrucciones dependen demasiado de sonido, color o lectura.
- Borrar logros no tiene confirmación ni barrera para adultos.

La funcionalidad interactiva debe tener equivalente de teclado, de acuerdo con [WCAG 2.2 - Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard), y un orden de foco coherente según [WCAG 2.2 - Focus Order](https://www.w3.org/WAI/WCAG22/Understanding/focus-order). Aunque WCAG establece un mínimo de `24 × 24` píxeles CSS para ciertos objetivos, este producto debe adoptar `44–48 px` como mínimo práctico infantil; véase [WCAG 2.2 - Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).

### 3.8. Arquitectura, rendimiento y QA

Hallazgos técnicos:

- El progreso solo registra misiones completadas, decoraciones e intentos globales.
- No hay progreso por zona, dominio, ayudas, historial de actividades ni inventario.
- Todos los activos se precargan al iniciar, aunque no se usen en la escena actual.
- Los activos públicos ocupan aproximadamente `45 MB`.
- El paquete JavaScript generado ronda `1.25 MB` minificado y Vite emite advertencia de tamaño.
- No hay pruebas automatizadas para selección de contenido, desbloqueo o migraciones.
- No hay regresión visual automatizada para escritorio y móvil.
- `README.md` y `docs/QA.md` describen las cinco zonas como activas y contienen afirmaciones que ya no reflejan el comportamiento actual.

## 4. Priorización de problemas

| Prioridad | Problema | Evidencia | Resultado esperado |
| --- | --- | --- | --- |
| P0 | Todas las zonas usan el mismo ejercicio | Cinco misiones, una plantilla de tres respuestas | Cada zona ofrece mecánicas y contenidos propios |
| P0 | No existe colección de runas | Sin inventario, vista ni estados | Colección visible, persistente y vinculada al refugio |
| P0 | Repetición rota | Misiones completadas abren con opciones deshabilitadas | Toda zona completada se puede jugar de nuevo |
| P0 | Desbloqueo sin dominio | Una respuesta correcta abre la siguiente zona | Desbloqueo basado en encuentros variados y evidencia mínima |
| P1 | Diseños V2 sin integrar | Refugio, runas y UI permanecen en `design/assets-v2` | Un lenguaje visual coherente en mapa, actividades y refugio |
| P1 | Animaciones genéricas | Traslaciones y rebotes de imágenes estáticas | Estados animados legibles, con peso y respuesta contextual |
| P1 | Controles no accesibles | Canvas sin equivalentes operables por teclado | Capa accesible, foco, navegación y alternativas multimodales |
| P1 | Contenido poco adecuado por etapa | Sonidos basados en texto e historia reducida a una palabra | Actividades alineadas con la habilidad de cada zona |
| P2 | Carga inicial pesada | Aproximadamente `45 MB` de activos públicos | Carga por escena y formatos optimizados |
| P2 | Documentación desactualizada | README y QA contradicen el estado real | Documentación y pruebas sincronizadas con V3 |

## 5. Modelo objetivo del producto

### 5.1. Estructura mínima de contenido

Cada una de las cinco zonas debe comenzar con:

- 3 familias de actividades diferentes.
- 4 variantes de contenido por familia.
- 12 combinaciones base por zona.
- 60 combinaciones base para la primera versión completa.

El selector de actividades debe:

1. Evitar repetir inmediatamente actividad, contenido y respuesta correcta.
2. Distribuir las posiciones de respuesta de forma equilibrada.
3. Priorizar habilidades con menos evidencia o más ayuda usada.
4. Permitir repetir una zona completada sin bloquear controles.
5. Introducir variantes nuevas antes de reciclar las ya vistas.
6. Guardar solamente identificadores y resultados, nunca el estado visual completo.

### 5.2. Criterio de dominio por zona

Una zona se considera preparada para desbloquear la siguiente cuando el niño completa:

- Al menos 3 encuentros.
- Al menos 2 familias de actividad distintas.
- Contenido diverso, sin repetir exactamente la misma variante.
- Una tendencia de ayuda estable o decreciente.

No se exige perfección ni se pierde progreso. Si hay dificultad, la zona ofrece una variante más concreta, más visual o con mayor apoyo.

### 5.3. Bucle de juego

1. Elegir una zona del mapa.
2. Recibir una actividad breve y variable.
3. Obtener retroalimentación inmediata y amable.
4. Ganar energía o un fragmento de runa.
5. Ver una transformación pequeña en el refugio o la zona.
6. Volver al mapa y elegir continuar o explorar otra actividad disponible.
7. Completar la runa de la zona y despertar el siguiente territorio.

## 6. Sistema de colección: Runas de la Isla

### 6.1. Principios

- Las recompensas dejan de ser piedras genéricas y se convierten en `Runas de la Isla`.
- Existen cinco familias, una por zona.
- Cada runa tiene tres estados: `fragmento`, `despierta` y `radiante`.
- El progreso nunca se pierde.
- No hay botín aleatorio, compras, cofres ni presión diaria.
- Una runa no se obtiene por una sola respuesta; representa práctica variada.

### 6.2. Familias propuestas

| Zona | Runa | Significado | Transformación del refugio |
| --- | --- | --- | --- |
| Nido del Eco | Runa del Eco | Escuchar y distinguir sonidos | Campanas naturales y nido musical |
| Bosque de Letras | Runa del Brote | Relacionar sonidos y letras | Árbol de letras que gana hojas |
| Puente de Sílabas | Runa del Vínculo | Unir y segmentar sílabas | Piezas del puente y senderos |
| Laguna de Palabras | Runa de la Corriente | Reconocer y construir palabras | Plantas, nenúfares y reflejos |
| Cueva de Historias | Runa de la Memoria | Ordenar y comprender relatos | Murales iluminados y constelaciones |

### 6.3. Interfaz de colección

- Acceso visible desde el mapa y desde el refugio.
- Vista principal integrada en el mundo: pedestal, árbol o mural, no una tabla administrativa.
- Cada runa muestra silueta bloqueada, fragmentos reunidos y forma completa.
- Al tocar una runa, se abre una ficha breve con nombre, zona, logro y próxima transformación.
- El códice puede existir como vista secundaria accesible para familias, pero no debe sustituir la colección gráfica.
- Los cinco activos `reward-stone-*-v2.png` se integran como base visual de las runas.

## 7. Matriz de actividades recurrentes

| Zona | Familia A | Familia B | Familia C |
| --- | --- | --- | --- |
| Nido del Eco | Elegir la imagen que empieza con el sonido escuchado | Encontrar parejas que riman | Decidir si dos sonidos son iguales o diferentes |
| Bosque de Letras | Encontrar una letra dentro del paisaje | Relacionar audio, imagen y letra | Distinguir letras visualmente parecidas |
| Puente de Sílabas | Arrastrar y unir sílabas | Marcar golpes silábicos con toques | Ordenar piezas para formar una palabra |
| Laguna de Palabras | Relacionar imagen y palabra | Encontrar la palabra intrusa | Completar una palabra con una pieza faltante |
| Cueva de Historias | Ordenar escenas | Elegir o completar una oración | Responder comprensión literal con imágenes |

Reglas de diseño:

- Cada familia necesita una interacción distinta, no solamente textos diferentes.
- Las primeras variantes se resuelven con imágenes, audio y manipulación directa.
- El texto aparece como apoyo gradual, no como única vía de comprensión.
- Cada actividad dura entre 20 y 60 segundos.
- Los errores ofrecen pista visual o auditiva antes de repetir la misma consigna.
- Las respuestas no se ordenan siempre con la correcta en la primera posición.

## 8. Rediseño visual

### 8.1. Sistema de interfaz

- Integrar `ui-wood-sign-v2.png` para títulos, nombres de zonas y mensajes importantes.
- Integrar `ui-leaf-button-v2.png` para acciones principales y variantes de estado.
- Crear estados normal, pulsado, foco, deshabilitado y completado sin perder legibilidad.
- Sustituir emoji por ilustraciones coherentes con el mundo.
- Reducir paneles rectangulares que ocultan la escena.
- Reservar tipografía grande y de alto contraste para palabras de aprendizaje.

### 8.2. Mapa

- Hacer que el bloqueo forme parte del territorio: niebla, lianas locales, puente incompleto, agua dormida o cueva oscura.
- Evitar repetir el mismo arco de lianas sobre cada punto.
- Mostrar nombre e icono de cada zona en móvil sin depender de ensayo y error.
- Dar a los compañeros espacio, escala y sombra de contacto.
- Reflejar el progreso mediante cambios ambientales, no solo un check o un icono.

### 8.3. Refugio

- Sustituir el fondo anterior por `refuge-lagoon-empty-v2.png`.
- Usar `refuge-lagoon-v2.png` como referencia del estado avanzado, no como imagen final única.
- Colocar las runas generadas en pedestales reales del entorno.
- Construir transformaciones por capas para que cada logro permanezca visible.
- Separar las opciones familiares —reinicio, sonido y movimiento— de los objetos que toca el niño.

## 9. Rediseño de animaciones

### 9.1. Estrategia recomendada

Usar spritesheets y una máquina de estados de Phaser antes de introducir herramientas más complejas como Spine o Rive. Estas últimas solo se justifican si existe un flujo artístico estable y varios personajes con deformación esquelética.

### 9.2. Estados de Minti

- `idle`: 6–8 fotogramas, respiración y cambio sutil de peso.
- `walk`: 6–8 fotogramas, dirección horizontal y sombra de contacto.
- `listen`: 4–6 fotogramas, anticipación y reacción de cabeza/orejas.
- `celebrate`: 6–10 fotogramas, anticipación, acción y recuperación.
- `think/help`: 4–6 fotogramas para pistas.
- `blink`: capa breve que no reinicia el estado principal.

### 9.3. Compañeros y entorno

- Cada compañero recibe al menos un ciclo `idle` y una reacción positiva de 2–4 fotogramas.
- El agua, luciérnagas, hojas, puente y brillo de cueva usan bucles lentos y asincrónicos.
- Las recompensas tienen entrada propia: aparición, asentamiento y destello final.
- No todos los objetos deben flotar con la misma amplitud o ritmo.

### 9.4. Movimiento reducido

- Sustituir desplazamientos amplios por cambios de pose y fundidos.
- Desactivar paralaje, sacudidas y ciclos decorativos no esenciales.
- Mantener todas las señales de éxito mediante color, forma, texto y sonido opcional.

## 10. Accesibilidad requerida

- Crear una capa DOM sincronizada con los controles de Phaser.
- Permitir teclado, mando y dispositivos de conmutación.
- Implementar foco visible y orden lógico por escena.
- Mantener objetivos táctiles prácticos de al menos `44–48 px`.
- Añadir subtítulos o transcripciones para todo audio instructivo.
- Usar narración española grabada o un paquete de audio consistente.
- No basar ninguna consigna exclusivamente en color, sonido o texto.
- Ofrecer repetición de audio y pista sin penalización.
- Proteger `Borrar logros` con pulsación larga, confirmación y acceso para adultos.
- Verificar redistribución y ampliación de texto siguiendo [WCAG 2.2 - Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) y [WCAG 2.2 - Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html).

## 11. Arquitectura técnica propuesta

### 11.1. Nuevos modelos

```ts
type ActivityDefinition = {
  id: string;
  zoneId: string;
  family: string;
  difficulty: number;
  contentTags: string[];
  interaction: string;
};

type AttemptRecord = {
  activityId: string;
  completedAt: string;
  correct: boolean;
  helpLevel: number;
};

type ZoneProgress = {
  encounters: number;
  familiesSeen: string[];
  contentSeen: string[];
  mastery: number;
  runeStage: 0 | 1 | 2 | 3;
};

type RuneInventory = Record<string, {
  fragments: number;
  stage: "locked" | "fragment" | "awakened" | "radiant";
}>;

type SessionState = {
  version: 3;
  attempts: AttemptRecord[];
  zones: Record<string, ZoneProgress>;
  runes: RuneInventory;
  refugeUnlocks: string[];
};
```

### 11.2. Servicios

- `ActivitySelector`: elige variedad, dificultad y posición de respuesta.
- `MasteryEvaluator`: decide cuándo una zona está preparada para progresar.
- `RewardService`: convierte resultados en fragmentos y transformaciones.
- `ProgressMigration`: transforma guardados anteriores a la versión 3 sin borrar logros.
- `AccessibilityBridge`: sincroniza controles Phaser con equivalentes DOM.

### 11.3. Organización de contenido

- Separar datos por zona y familia de actividad.
- Separar contenido educativo de presentación visual.
- Evitar lógica específica de cada misión dentro de una sola escena genérica.
- Crear escenas o componentes de interacción reutilizables: selección ilustrada, emparejamiento, arrastre, ordenamiento y ritmo.

### 11.4. Rendimiento

- Cargar activos por escena y descargar los no necesarios.
- Convertir fondos grandes a WebP o AVIF con fallback cuando sea necesario.
- Generar tamaños específicos para escritorio y móvil.
- No copiar conceptos o activos no usados a `public`.
- Dividir el código de actividades por carga dinámica.
- Definir presupuesto inicial: menos de `8 MB` para entrar al mapa y carga diferida del resto.

### 11.5. Pruebas

- Unitarias: selector sin repetición, equilibrio de respuestas, dominio y migración.
- Integración: completar, repetir, desbloquear, recibir runa y decorar refugio.
- Accesibilidad: teclado, foco, nombres y estados anunciados.
- Visuales: capturas de escritorio y móvil para cada escena y etapa de progreso.
- Rendimiento: peso inicial, tiempo de carga y memoria en móvil medio.

## 12. Hoja de ruta

Las estimaciones son días de ingeniería, no fechas de calendario.

### Fase 0 — Correcciones críticas y documentación (`1–2 días`)

- Corregir repetición de misiones completadas.
- Separar el reinicio infantil de la configuración familiar.
- Actualizar README y QA al estado real.
- Inventariar activos V2 y decidir cuáles son definitivos.

**Criterios de aceptación**

- Toda misión completada puede volver a jugarse.
- Ninguna documentación afirma que existe una colección aún no implementada.
- El reinicio requiere confirmación protegida.

### Fase 1 — Motor de contenido y progreso V3 (`3–5 días`)

- Implementar modelos, selector, dominio y migración.
- Cargar al menos cuatro variantes iniciales por familia prioritaria.
- Desbloquear por encuentros y diversidad, no por una respuesta.

**Criterios de aceptación**

- No se repite inmediatamente la misma actividad.
- La respuesta correcta cambia de posición.
- Los guardados V2 migran sin perder logros.
- Una zona completada sigue siendo jugable.

### Fase 2 — Runas y refugio (`3–5 días`)

- Implementar inventario y tres estados por runa.
- Integrar refugio V2 y los cinco activos de recompensa.
- Añadir acceso a colección desde mapa y refugio.
- Vincular runas con transformaciones persistentes.

**Criterios de aceptación**

- El jugador puede ver qué runas tiene y qué falta.
- Cada runa obtenida aparece físicamente en el refugio.
- El estado persiste al recargar.
- No hay azar, pérdida ni monetización.

### Fase 3 — Mecánicas diferenciadas (`8–12 días`)

- Crear selección ilustrada, emparejamiento, arrastre, orden y ritmo.
- Completar tres familias por zona y cuatro variantes por familia.
- Añadir pistas escalonadas y audio consistente.

**Criterios de aceptación**

- Las cinco zonas no se sienten como el mismo ejercicio.
- Cada zona contiene al menos dos interacciones no textuales.
- La secuencia didáctica coincide con el objetivo de la zona.
- Hay 60 combinaciones base disponibles.

### Fase 4 — Sistema visual y mapa (`4–6 días`)

- Integrar letreros, botones y estados orgánicos.
- Rediseñar bloqueos como cambios del entorno.
- Mejorar señalización móvil, escala de compañeros y composición.
- Sustituir emoji y paneles provisionales.

**Criterios de aceptación**

- Interfaz, mapa, actividades y refugio comparten el mismo acabado.
- Todas las zonas se identifican antes de tocarlas.
- Los estados bloqueado, disponible, en progreso y completo son distintos sin depender solo del color.

### Fase 5 — Animación (`5–8 días`)

- Crear spritesheets de Minti y compañeros.
- Implementar máquina de estados y sombras de contacto.
- Añadir ciclos ambientales y recompensas animadas.
- Preparar variantes de movimiento reducido.

**Criterios de aceptación**

- Caminar, escuchar y celebrar usan secuencias reales.
- Las animaciones tienen anticipación, acción y recuperación.
- Los personajes no comparten un único rebote genérico.
- El modo reducido conserva toda la información funcional.

### Fase 6 — Accesibilidad, rendimiento y QA (`4–7 días`)

- Implementar capa DOM accesible.
- Optimizar carga, imágenes y división de código.
- Añadir pruebas automatizadas y regresión visual.
- Validar dispositivos y navegadores objetivo.

**Criterios de aceptación**

- El recorrido completo funciona con teclado.
- Los controles tienen foco visible y nombres comprensibles.
- El mapa inicial cumple el presupuesto de carga acordado.
- Escritorio y móvil pasan la matriz de regresión visual.

## 13. Orden recomendado de implementación

1. Arreglar repetición y actualizar el modelo de progreso.
2. Implementar selector recurrente y primeras variantes.
3. Construir colección de runas y refugio persistente.
4. Añadir mecánicas distintas por zona.
5. Integrar completamente el sistema visual V2.
6. Producir spritesheets y animación contextual.
7. Completar accesibilidad, optimización y QA antes de publicar V3.

Este orden evita invertir en animaciones o pantallas que después tendrían que rehacerse por cambios de arquitectura.

## 14. Decisiones que deben evitarse

- No añadir más misiones dentro del mismo molde de tres botones.
- No desbloquear una zona por una única respuesta correcta.
- No llamar colección a una lista interna sin vista ni estados.
- No animar todos los personajes con el mismo balanceo vertical.
- No usar texto como única instrucción para prelectores.
- No ocultar nombres de zonas importantes en móvil.
- No exponer el borrado de progreso como control infantil inmediato.
- No publicar V3 sin recorrido móvil, teclado y regresión visual.

## 15. Definición de éxito de V3

La mejora estará completa cuando un niño pueda entrar a cualquier zona disponible, encontrar una actividad distinta a la anterior, comprenderla mediante imagen y audio, recibir ayuda sin castigo, obtener progreso visible hacia una runa y observar cómo esa runa transforma permanentemente su refugio. La experiencia deberá ser operable en móvil y teclado, conservar el progreso anterior y mantener un lenguaje visual consistente en todas las escenas.
