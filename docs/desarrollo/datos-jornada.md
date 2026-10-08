# Datos preparados de jornada

Preparación 2026-10-08. La geometría M09-514 procede de los dos trazos históricos SEMOVI 2022 y mantiene 20.340012617 km, sin cerrar huecos ni añadir conectores.

## Terreno

El visor oficial [INEGI CEM](https://www.inegi.org.mx/app/geo2/elevacionesmex/) respondió `api/versiones` con CEM 4.0 y `api/resoluciones?version=2` con `cem4_workespace:cem15m_3857`. Se recuperó por WCS un recorte de 15 m en EPSG:4326, bbox `-99.188,19.289,-99.143,19.330`. El GeoTIFF tiene 324 × 295 celdas; valor NoData 32767. Hash del terreno y de la geometría en `src/data/journey-route.json`. CEM 4.0 sí se recuperó; no se sustituyó por 3.0.

Se interpolan coordenadas a 50 m de distancia geodésica, preservando el último punto de cada trazo. Elevación por interpolación bilineal de centros de celda; se rechaza NoData. Suavizado con media móvil centrada de cinco muestras (hasta 250 m), ventana truncada en extremos, sin mezclar trazos. 407 segmentos. El trabajo gravitacional usa diferencia de alturas suavizadas; la altitud absoluta sólo es contexto. Resolución de terreno y separación de muestras no representan precisión de rasante. Tres sectores por trazo son divisiones espaciales F, no tramos operativos verificados.

## Temperatura

Se consultaron el [índice de meteorología SIMAT](https://aire.cdmx.gob.mx/default.php?opc=%27aKBhnmI=%27&opcion=Zw==) y su CSV horario 2023. Estación PED, Pedregal, coordenadas −99.204136, 19.325146, altitud publicada 2326 m (catálogo de estaciones). Se selecciona TMP numérica entre −30 y 50 °C. 3379 registros válidos de 8760 horas posibles; cobertura parcial explícita. `fuentes-jornada.json` conserva hash y conteos por hora/temporada. No se conservan los originales meteorológicos externos.

Media aritmética por hora civil tal como figura en CSV y temporada diseñada: fría nov–feb, cálida mar–may, lluvias jun–oct. Las 72 celdas tienen observaciones; no se imputaron faltantes. La forma horaria es una derivación histórica de esa cobertura, no pronóstico ni temperatura de batería. Pavimento mojado y climatización no se inferirán de temporada ni de TMP. El CSV agregado REDMET del portal CDMX fue examinado y descartado para esta derivación porque sólo tiene fechas diarias sin estación u hora.

## Reproducción

```sh
python3 scripts/preparar-jornada.py --terrain /tmp/ruta1-cem4.tif --weather /tmp/meteo2023.csv
```

Requiere Python y Pillow. Las descargas son entradas explícitas; el script no hace solicitudes de red. Archivos preparados se incluyen en el JSON v2 para recalcular sin servicios externos. La auditoría de vehículos conserva los 33 ID con estado por parámetro, sin tomar porcentajes críticos del expediente como evidencia. Los perfiles de servicio iniciales son F editables. `docs/inventario.json` mantiene únicamente cuatro PDF históricos.
