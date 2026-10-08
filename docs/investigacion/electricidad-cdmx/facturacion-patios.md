# Facturación eléctrica aplicable a un patio de recarga

## Selección del suministro

No hay una tarifa CFE universal de "autobús eléctrico". Según tensión y demanda: PDBT (hasta 25 kW en baja tensión), GDBT (más de 25 kW en baja), GDMTO (menos de 100 kW en media), GDMTH (100 kW o más en media). Son **umbrales de clasificación**, no tarifas automáticamente asignadas a un patio. [CFE-01–04].

## Factura

Un contrato de suministro básico puede contener cargo fijo mensual, componente(s) de energía, capacidad, distribución, cargos regulados incluidos en las cuotas finales, impuestos y ajustes que correspondan. No sumar dos veces componentes ya integrados en tarifas finales. En GDMTH existen registros horarios base/intermedio/punta y medición de demanda en ventanas de 15 minutos; capacidad y distribución pueden aplicar criterios facturables diferenciados (consultar fórmulas originales de CFE-02).

Para un modelo auditable: `subtotal = cargo_fijo + sum(kwh_periodo × precio_integral_periodo) + kw_capacidad_facturable × cargo_capacidad + kw_distribucion_facturable × cargo_distribucion + otros_cargos_aplicables`, sólo si las cuotas seleccionadas no duplican componentes; después aplicar impuestos y ajustes documentados. Deben conservarse fuente, región, categoría y periodo para cada cargo.

## Ejemplo ilustrativo (NO factura)

Si 10,000 kWh se valoran a $2/kWh, el **renglón de energía** sería $20,000 antes de demanda, fijo e impuestos. El valor $2 es arbitrario y sólo explica unidades. NO representarlo como tarifa de CFE ni gasto de Metrobús.

## Evidencia mínima para una factura real

Patio y dirección, identificador disociado del contrato, periodo, tarifa, división tarifaria, kWh por franja (cuando corresponda), demanda máxima medida y facturable, conceptos de cargo, impuestos, descuentos, total pagado y aclaración de qué entidad paga el suministro. Para suministro calificado o de terceros se necesita contrato específico, no tabla de CFE básico.
