# Diccionario e ingestión

CSV UTF-8 y cabecera en cada archivo. `fuentes.csv` contiene `id` estable, organización, título, URL, consulta, alcance y limitación. `inventario-electrificacion.csv` relaciona cada servicio con `fuente_id`; sin unidades por ruta comprobadas, celda vacía. `evidencia-costos.csv` separa `tipo=inversión de capital` de tarifa eléctrica. `tarifas-cfe-esquema.csv` enumera categorías sin adivinar importes. `facturas-verificadas.csv` es tabla sin registros hasta obtener recibos.

Para un backend usar identificadores de fuente como claves foráneas, almacenar `fecha_reporte` como fecha de afirmación y mantener NULL para desconocido. Normalizar posteriormente tablas de patio, contrato, lectura, conceptos de factura y servicio; una fila de línea no implica una ruta geográfica de SEMOVI.

Validación obligatoria: unidades MXN/kWh vs MXN/kW-mes, no sumar inversión a gasto operativo, no compartir totales de tarifa con sus componentes por segunda vez, no atribuir cifras de líneas a ramales y nunca convertir "sin verificar" en "combustión".
