# Verificación del recorrido

## Matriz manual

| Vista | Resolución | Comprobaciones |
| --- | --- | --- |
| Escritorio panorámico | 2042 × 1216 | Tres huevos apoyados en sus huecos, huevo central en el plano frontal, eclosión y salida al mapa |
| Móvil vertical | 390 × 844 | Tres huevos visibles sin recorte, alineación con los huecos, título, controles y botón final |
| Captura de escritorio | 1440 × 900 | Pantalla inicial, escala del fondo, título, controles y botón Comenzar |
| Captura vertical | 500 × 932 | Pantalla inicial, recorte del fondo, título, controles y botón Comenzar |

## Aventuras y logros

- Las cinco zonas del mapa se presentan como botones activos y accesibles mediante su marcador o su etiqueta.
- Cada zona abre su propio enunciado, opciones, ayuda hablada, pista y recompensa.
- Una respuesta correcta marca la zona como completada y añade una piedra única a la colección.
- El refugio coloca las piedras obtenidas sobre el camino del escenario; los espacios sin completar solo muestran musgo.
- Al tocar una piedra se anuncia su nombre y la zona de procedencia.
- El guardado versión 2 migra el progreso versión 1 y conserva la Piedra del sol cuando ya estaba obtenida.

## Alineación del nido

Los huevos ya no usan porcentajes genéricos de pantalla. Sus puntos de apoyo se calculan desde los tres huecos del recurso `nest-clearing-background.png`, por lo que conservan la relación con el fondo cuando cambia la proporción de la ventana. El hueco central está deliberadamente más bajo porque pertenece al plano frontal del nido.

Se comprobó la eclosión en el mismo punto de apoyo: el huevo elegido se sustituye por su cascarón correspondiente y Minti aparece detrás del cascarón sin saltar a otra posición.

## Regresión

- Repetición del nacimiento desde el mapa sin borrar el progreso.
- Restauración del huevo elegido después de recargar.
- Variante con movimiento reducido.
- Continuidad hacia el mapa, las cinco actividades y el refugio.
- Compilación de producción y consola del navegador sin errores.

## Capturas

- `docs/screenshots/intro-start-desktop.png`
- `docs/screenshots/intro-start-mobile.png`

Las capturas disponibles documentan la pantalla inicial. La alineación del nido se verificó manualmente en las dos primeras resoluciones de la matriz.
