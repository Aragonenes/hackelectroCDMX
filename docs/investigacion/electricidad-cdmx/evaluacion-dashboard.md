# Auditoría del costo eléctrico del dashboard

Código inspeccionado: `src/data/defaults.ts` y `src/domain/evaluate.ts`, rama `main` del repositorio `itsebasvz/hackelectroCDMX`.

Parámetros iniciales: `electricityPrice = 4` MXN/kWh, `demandPrice = 150` MXN/(kW·mes), `fixedElectricity = 1000` MXN/mes y `efficiency = 0.9`. Todos son supuestos de demostración, no factura acreditada.

`dailyGridKwh = dailyBatteryKwh / efficiency`. La parte eléctrica del costo mensual modelado es: `dailyGridKwh × electricityPrice × days × fleet + charge.peakKw × demandPrice + fixedElectricity`.

**Hallazgo:** el componente de pico `charge.peakKw` no equivale necesariamente a la demanda facturable de CFE; GDMTH calcula capacidad y distribución con reglas distintas. Tampoco se separan kWh por periodo, ni consta la tarifa/región real del sitio o el tratamiento de IVA.

**Recomendación estable:** mantener el modo exploratorio; agregar un adaptador de facturación que reciba categoría, región, mes, kWh por periodo, demandas medidas/facturables, impuestos y fuente del comprobante. Evitar mostrar un "precio CFE real de Ruta 1" antes de contar con suministro identificado.

Fuentes: CFE-01, CFE-02, CFE-03, CFE-04 (`fuentes.csv`).
