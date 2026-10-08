# Verificación complementaria: electrificación y costos

**Corte documental:** 2026-10-08. **Evidencia:** fuentes oficiales y estudio ICCT anterior.

## Evidencia comprobada por servicio

- **Metrobús línea 4**: el comunicado del 5 de febrero de 2026 reporta **74 autobuses eléctricos de 124** en la línea. Esta información permite clasificar la línea como **parcialmente electrificada a esa fecha**; no identificar individualmente las 50 unidades restantes por tecnología ni situación operativa actual. La ruta Quetzalcóatl incorpora 19 unidades y forma parte del total 74; **no sumarla una segunda vez**. Fuente: [Metrobús, 2026-02-05](https://www.metrobus.cdmx.gob.mx/comunicacion/nota/BMB-050226).
- **Metrobús línea 3**: documenta autobuses eléctricos Yutong y recarga nocturna; la información consultada no es un censo diario fechado al corte. Fuente: [Metrobús, Soy Eléctrico](https://www.metrobus.cdmx.gob.mx/dependencia/acerca-de/electricoMB).
- **Centrobús, Ruta de las Heroínas Indígenas**: RTP documenta **12 autobuses eléctricos** en julio de 2026. Fuente: [RTP, 2026-07-14](https://rtp.cdmx.gob.mx/comunicacion/nota/rtp-fortalece-la-movilidad-incluyente-con-unidades-accesibles-en-el-centrobus).
- **Trolebús línea 14**: STE la documenta en su red. Es tecnología de tracción eléctrica, pero no un equivalente automático a un autobús de batería que usa cargadores de patio. Fuente: [STE](https://www.ste.cdmx.gob.mx/).
- **Ruta 1 San Fernando**: el registro histórico `M09-514` acredita la geometría histórica, **no** el combustible ni la operación vigente. No emparejar por coincidencia textual con Trolebús línea 14. Fuente: `public/data/routes-manifest.json` en el repositorio.

## Facturas y suministro

Las categorías CFE y los cargos publicados son referencias normativas. Una factura de un patio exige conocer tensión/contrato, medidor, mes, región, energía por periodos, demanda facturable, cargos regulados e impuestos aplicables. El código actual usa un costo de electricidad plano `kWh×4 MXN`, una demanda `peakKw×150 MXN/kW` y `1000 MXN/mes`; los valores están etiquetados como supuestos de demostración. No son una factura real.

**Resultado de búsqueda documental:** no se recuperó una factura pagada verificable con medidor/periodo e importe de patio de Metrobús o RTP. El estudio [ICCT 2022](https://theicct.org/publication/mexico-latam-hdv-zebra-mar22/) modela escenarios; **no prueba** qué pagó cada empresa. Los montos de inversión en autobuses/patios tampoco son costo mensual de energía.

Para obtener costos efectivamente pagados se debe solicitar copia pública de recibos y contratos con datos personales o estratégicos testados, kWh, periodos y demanda facturable. [Unidad de Transparencia de Metrobús](https://metrobus.cdmx.gob.mx/transparencia).

## Regla de clasificación

No clasificar las 995 filas históricas por palabras en el nombre, ni por coincidencias con nombres de corredores; usar identificador/operador/convenio de equivalencia verificable. Mantener `no_verificado` hasta disponer de evidencia específica; distinguir `traccion_electrica`, `bateria`, `mixta`, `combustion_verificada` y `fuera_servicio`.
