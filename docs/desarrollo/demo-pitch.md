# Demo de Ruta 1 para el pitch

El botón **Activar jornada dinámica** del mapa carga el caso preparado para la presentación. Si ya hay una jornada activa, usar **Configurar → Cargar demo para el pitch** o **Reiniciar demo del pitch**. La conversión ordinaria de un escenario v1 continúa disponible en Configurar; el JSON v1 conserva su cálculo original.

La demo utiliza la geometría histórica Metro CU–San Fernando–Huipulco, el terreno preparado y el clima horario existentes. Sus entradas operativas y económicas son F: tres unidades, ocho vueltas de 75 minutos de referencia, pausas de cinco minutos, jornada disponible de 14 horas, 420 abordajes diarios de referencia por unidad, dos operadores por unidad y capital propio de $1,500,000 para la flota. La carga de patio comienza a las 20:00, con diez horas presupuestadas, cargadores de 22 kW, sitio de 90 kW y admisión de 30 kW supuesta para la referencia KINGO. Abordajes y recaudo no aumentan al cambiar vueltas.

Con estas entradas sólo **Energía y reserva** incumple las condiciones calculadas. El lunes previsto requiere aproximadamente 49.27 kWh en 170.86 km y termina con 12.3% de batería frente a una reserva de 15%. Las comprobaciones externas permanecen pendientes; el escenario no acredita acuerdos o inversión.

El vehículo inicial sigue siendo KINGO: cargar la demo cambia operación, demanda, carga y capital, conservando esa referencia para presentar el problema de reserva. La tarjeta de batería lo identifica como **Pitch · referencia inicial** y enlaza a **Comparar vehículos**. Evaluar combinaciones propone opciones; sólo **Aplicar al simulador** cambia el vehículo del mapa. Los modelos elegidos del catálogo se identifican como **Pitch · vehículo elegido**. Reiniciar la demo recupera el KINGO y las entradas iniciales.

## Catálogo para la presentación

Los 33 identificadores y nombres provienen del [catálogo documental](../investigacion/modelos/catalogo-vehiculos-electricos-combustion.csv). Batería, consumo, plazas y masa se toman de su [preparación auditada](datos-jornada.md), conservando carácter de propuesta F y las limitaciones de variante. Los originales de investigación no se modifican. El escenario guarda su propio catálogo y evidencia `F-PITCH` para reproducirlo.

Los datos que faltaban se completan **sólo en el catálogo de esta demo** con supuestos explícitos:

| Clase   | Precio ilustrativo, redondeado a $10,000 | Potencia admitida | Mantenimiento | Seguro mensual |
| ------- | ---------------------------------------- | ----------------- | ------------- | -------------- |
| Van     | $950,000 + $8,500 por kWh nominal        | 30 kW             | $1/km         | $1,800         |
| Midibús | $1,800,000 + $9,500 por kWh nominal      | 90 kW             | $1.50/km      | $2,800         |
| Urbano  | $3,000,000 + $10,000 por kWh nominal     | 180 kW            | $2.50/km      | $4,500         |

Estas fórmulas facilitan comparar el prototipo; no son cotizaciones, regresiones comerciales ni especificaciones verificadas. Los conectores desconocidos conservan su comprobación pendiente. Seleccionar un modelo en escenarios ordinarios conserva precio desconocido cuando no hay una entrada explícita.

## Recorrido sugerido

1. Activar la demo y mostrar las cards: batería, modelo/plazas, pasajeros y condiciones de la jornada.
2. Abrir **Operación → Condiciones**: una condición calculada por resolver.
3. Ir a **Economía → Alternativas → Evaluar combinaciones**. Se evalúan 33 eléctricos × 4 cargadores × 5 esquemas financieros × 3 cantidades de cargadores: **1,980 combinaciones**. El catálogo completo se puede desplegar en el mismo panel.
4. Revisar tres vehículos distintos, con reserva al cierre, capital, margen mensual e ingreso protegido. En la preparación de esta demo aparecen Mercedes-Benz eSprinter, Joylong E6 y Maxus eDeliver 9, con cierres aproximados de 36.1%, 18.4% y 17.3% el lunes y sin aportación adicional en sus combinaciones seleccionadas.
5. Pulsar **Aplicar al simulador**. Se conserva la jornada, tarifa, personal y recaudo; el mapa y los demás resultados actualizan el vehículo. Las condiciones calculadas quedan favorables y las comprobaciones externas siguen visibles.

La búsqueda calcula una trayectoria por vehículo y vuelve a calcular la carga y las finanzas para cada combinación. Retiene resúmenes durante la búsqueda y sólo prepara resultados completos para las tres opciones finales, con progreso y cancelación. La clasificación financiera conserva capital, inversión, deuda, ingreso objetivo y reservas por separado. No se fija un resultado favorable en la interfaz: editar las entradas puede volver a producir restricciones.
