# Auditoría para el simulador de jornada · 2026-10-08

El expediente recibido no acredita fichas de las 33 variantes ni condiciones de ensayo de su consumo comercial. Se conservan los identificadores VAN-01–11, MIDI-01–10 y URB-01–12. La auditoría por parámetro está en `src/data/journey-vehicles.json`: batería, tara, capacidad, consumo y HVAC propuestos se clasifican F/supuesto; precio, conector y potencia de carga permanecen desconocidos. No se sustituyen precios faltantes por estimaciones ocultas. La comparación energética puede ejecutarse con estos supuestos visibles; la economía requiere declarar las entradas faltantes. Las seis referencias del catálogo v1 conservan su contrato y evidencia.

## Incidencias

- SRC-VF-05: los [metadatos de Crossref](https://api.crossref.org/works/10.3390/en15145120) identifican a Tang, Xi y Fan y el artículo *A Modified Geometry-Based MIMO Channel Model for Tunnel Scattering Communication Environments*. El DOI no respalda temperatura ni consumo de autobuses. Se descarta para calibración.
- SRC-VF-01–04 y 06–09: títulos específicos, variantes, páginas y porcentajes no se acreditaron con los enlaces del expediente. Se conservan como búsquedas pendientes y contexto externo E, sin aplicar porcentajes atribuidos. Un sitio comercial genérico no acredita una ficha técnica ni los límites de regeneración de un modelo.
- SRC-VF-10: el portal SIMAT sí ofrece registros meteorológicos, pero el título propuesto y los extremos térmicos del expediente no se validaron. La nueva derivación J-MET usa registros y cobertura declarados.
- Capacidad nominal de una van de carga no demuestra plazas homologadas de pasajeros. HVAC, química y tara requieren variante. La autonomía propuesta no permite inferir simultáneamente consumo neto y capacidad útil.
- Los consumos negativos de descenso y porcentajes de pérdida de autonomía de la tabla son propuestas no calibradas. No se incorporan como mediciones ni se multiplican sus factores en cascada.

## Corrección dimensional

Trabajo gravitacional: `masa_kg × 9.80665_m/s² × desnivel_m / 3 600 000_J/kWh`. Para expresar pendiente por km, `desnivel_m = pendiente_fracción × distancia_km × 1000`. Eliminar fórmulas que dividan por 3.6 millones usando km sin convertirlos a metros. Altitud absoluta no agrega trabajo gravitacional; sólo el desnivel. La ocupación agrega masa respecto a una condición base declarada.

La referencia energética ya es neta. El motor suma únicamente diferencias de auxiliares frente al tiempo/condición base y trabajo por desnivel; no vuelve a descontar una regeneración de frenado incluida en el consumo neto. La recuperación de descenso se limita por trabajo disponible, eficiencia, potencia y espacio de batería. Coeficientes de rodadura, masa por pasajero, eficiencia, auxiliares y climatización son F editables.

## Horario y demanda

[Moovit, PDF p. 1–2](https://appassets.mvtdev.com/map/188/l/822/336644108.pdf), consulta 2026-10-08: 05:00–22:50 lunes–viernes y 06:00–21:45 sábado–domingo. Referencia secundaria, sin fecha de levantamiento ni comprobación del servicio actual. No se conserva el PDF por derechos reservados.

[INEGI EOD 2017, metodología y cuestionario](https://www.inegi.org.mx/rnm/index.php/catalog/533/related-materials): movilidad metropolitana histórica en martes, miércoles o jueves y sábado. No acredita aforo horario actual ni perfiles por sector del ramal. Las franjas de 15 minutos iniciales del simulador son F, con picos diseñados para explorar condiciones; no se presentan como estimación EOD. Domingo y diferencias entre días son supuestos F explícitos. Abordajes que generan ingreso y ocupación simultánea son entradas independientes. Cambiar vueltas no aumenta automáticamente abordajes.
