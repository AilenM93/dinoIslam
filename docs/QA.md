# Verificación del recorrido

## Tipografía — 22 de septiembre de 2026

- Baloo 2 en encabezados y Nunito en lectura/controles, servidas desde el propio despliegue.
- Compilación de producción correcta, con archivos WOFF2 locales y licencias incluidas.
- Inspección visual del Nido de sonidos (emparejamiento) en 1049 × 912 y 390 × 844: título, seis tarjetas, instrucciones y botón de audio visibles sin recortes.
- El inicio de Phaser espera la carga de los pesos utilizados; incluye comprobación de carga con caracteres españoles y fuente de reserva si falla una descarga.

## Escenarios por zona — 22 de septiembre de 2026

- Recorrido local a través del mapa en 1049 × 912: nido, bosque, puente, laguna y cueva muestran su fondo propio y su compañero junto a Minti.
- Bosque en 390 × 844 y 375 × 667: pregunta, emparejamiento y audio visibles; encuadre del suelo ajustado para apoyar los personajes en el entorno.
- Emparejamiento completado en bosque y laguna; elección completada en laguna; respuesta incorrecta y salida durante secuencia comprobadas en cueva.
- Recompensa sustituye las tarjetas; Otra actividad conserva el entorno y cambia el contenido; Mapa permite salir antes o después de completar.
- Tres contenidos distintos completados en laguna desbloquean la cueva y conservan los fragmentos al cambiar de escena.
- Consola del navegador sin errores durante ese recorrido. Los intentos de QA quedan en el guardado local del navegador utilizado.
- Esta verificación no sustituye una prueba exhaustiva de las veinte actividades ni la revisión pedagógica del contenido.

## Matriz manual

| Vista | Resolución | Comprobaciones |
| --- | --- | --- |
| Escritorio panorámico | 2042 × 1216 | Tres huevos apoyados en sus huecos, huevo central en el plano frontal, eclosión y salida al mapa |
| Móvil vertical | 390 × 844 | Tres huevos visibles sin recorte, alineación con los huecos, título, controles y botón final |
| Captura de escritorio | 1440 × 900 | Pantalla inicial, escala del fondo, título, controles y botón Comenzar |
| Captura vertical | 500 × 932 | Pantalla inicial, recorte del fondo, título, controles y botón Comenzar |

## Aventuras y logros

- La primera zona está abierta; cada zona posterior despierta al dominar la anterior.
- Cada zona rota entre cuatro actividades iniciales sin repetir inmediatamente la última.
- Las respuestas de selección cambian de posición, las secuencias exigen tocar las piezas en orden y los emparejamientos mezclan ambas columnas.
- Tres contenidos diferentes producen tres fragmentos y vuelven radiante la runa de la zona.
- El refugio V2 muestra las runas obtenidas, sus tres indicadores de fragmentos y siluetas para las pendientes.
- Al tocar una runa se anuncia su nombre, estado y zona de procedencia.
- El guardado versión 3 migra las versiones 1 y 2, incluidos los identificadores de misiones reemplazadas.
- Una actividad ya completada continúa siendo jugable.

## Alineación del nido

Los huevos ya no usan porcentajes genéricos de pantalla. Sus puntos de apoyo se calculan desde los tres huecos del recurso `nest-clearing-background.png`, por lo que conservan la relación con el fondo cuando cambia la proporción de la ventana. El hueco central está deliberadamente más bajo porque pertenece al plano frontal del nido.

Se comprobó la eclosión en el mismo punto de apoyo: el huevo elegido se sustituye por su cascarón correspondiente y Minti aparece detrás del cascarón sin saltar a otra posición.

## Regresión

- Repetición del nacimiento desde el mapa sin borrar el progreso.
- Restauración del huevo elegido después de recargar.
- Variante con movimiento reducido.
- Continuidad hacia el mapa, las cinco actividades y el refugio.
- Compilación de producción y consola del navegador sin errores.
- Rotación entre actividades de una misma zona.
- Secuencia táctil correcta e incorrecta en escritorio y móvil.
- Emparejamiento correcto e incorrecto en escritorio y móvil.
- Persistencia de fragmentos, runas radiantes y dominio después de recargar.
- Confirmación en dos pasos antes de borrar los logros.

## Capturas

- `docs/screenshots/intro-start-desktop.png`
- `docs/screenshots/intro-start-mobile.png`

Las capturas disponibles documentan la pantalla inicial. La alineación del nido se verificó manualmente en las dos primeras resoluciones de la matriz.
