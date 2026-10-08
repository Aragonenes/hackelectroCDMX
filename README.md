# hackelectroCDMX · Electrifica tu flota

Simulador para explorar la electrificación del transporte por ramal en CDMX. Sigue una jornada sobre el mapa y conecta **batería, pasajeros, pendiente, recarga, costos y emisiones** para comparar opciones que mantengan el servicio y los ingresos presupuestados.

Prototipo del equipo **Aragonenes** para el **Reto 2 del Electro Hackathon CDMX**.

**[Probar el simulador](https://electrohackaragonenes.vercel.app)** · [Guía de la demo](docs/desarrollo/demo-pitch.md) · [Documentación](docs/README.md)

## Qué puedes explorar

El caso de partida es **Ruta 1 · Metro CU–San Fernando–Huipulco**, sobre geometría histórica oficial. Cambiar el día, el vehículo o las condiciones actualiza una misma jornada calculada y sus resultados técnicos, económicos y ambientales.

| Área           | Qué permite hacer                                                                                                                           |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Configurar** | Editar vehículos, jornada, perfiles de pasajeros, congestión, temporada, carga y supuestos económicos.                                      |
| **Operación**  | Reproducir el recorrido, seguir el SOC, encontrar el primer cruce de reserva y revisar recarga, pendientes y condiciones del servicio.      |
| **Economía**   | Comparar costos y combinaciones de vehículos, cargadores y financiamiento, distinguiendo capital propio, apoyo adicional y pagos mensuales. |
| **Ambiente**   | Consultar combustible, CO₂ de escape y CO₂e asociado a la electricidad de recarga por unidad o flota y por día, mes o año.                  |

La comparación energética incluye **33 modelos eléctricos** del catálogo documental. La búsqueda de alternativas muestra progreso, admite cancelación y permite aplicar una opción al mapa. Archivos y Fuentes reúnen guardado local, exportaciones y evidencia; los escenarios pueden conservarse como JSON con checksum, CSV e informe imprimible.

## Probar la demo

1. [Abrir el prototipo](https://electrohackaragonenes.vercel.app) y pulsar **Activar jornada dinámica**. Si ya hay un escenario activo, cargar o reiniciar la demo desde el final de **Configurar**.
2. Reproducir la jornada y observar batería, ocupación y pendiente. El KINGO es la referencia inicial: el caso preparado deja una condición calculada por resolver, **Energía y reserva**.
3. Abrir **Economía → Alternativas → Evaluar combinaciones**. La demo compara 1,980 combinaciones de 33 vehículos, cuatro cargadores, cinco esquemas financieros y tres cantidades de cargadores.
4. Pulsar **Aplicar al simulador** en una alternativa y revisar el vehículo elegido, la reserva al cierre y sus costos. Cambiar parámetros permite explorar otros resultados.

La [guía del pitch](docs/desarrollo/demo-pitch.md) explica las entradas y el recorrido completo. El caso preparado utiliza **supuestos editables** para presentar el prototipo; los resultados se calculan con el mismo motor que evalúa los demás escenarios.

## Evidencia y alcance

El proyecto combina investigación pública, datos preparados, cálculos derivados y supuestos identificados. La geometría de Ruta 1 tiene fecha interna de 2022; la elevación procede de terreno INEGI y los perfiles de temperatura utilizan registros históricos de Pedregal. Los perfiles de demanda y los datos económicos de la demo son exploratorios.

La herramienta ayuda a identificar condiciones y comparar escenarios. Una inversión real requiere validar demanda, configuración del vehículo, patio, carga, financiamiento y acuerdos de operación. El consumo no está calibrado con mediciones actuales del ramal. CO₂ de escape y CO₂e de recarga conservan alcances distintos; el prototipo no calcula una reducción neta ni emisiones de ciclo de vida.

| Referencia                                                                                                      | Contenido                                                                      |
| --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| [Guía del evaluador](docs/desarrollo/README.md)                                                                 | Uso, arquitectura y publicación.                                               |
| [Metodología del motor](docs/desarrollo/metodologia-motor.md) y [jornada v2](docs/desarrollo/modelo-jornada.md) | Balances, restricciones, mezcla mensual y compatibilidad con escenarios v1.    |
| [Datos preparados](docs/desarrollo/datos-jornada.md)                                                            | Terreno, clima, cobertura y preparación reproducible.                          |
| [Documento maestro de Ruta 1](docs/documento-maestro-ruta1.md)                                                  | Evidencia y propuesta de transición con protección del servicio y del ingreso. |
| [Catálogo de vehículos](docs/investigacion/modelos/README.md)                                                   | Modelos, parámetros y referencias documentales.                                |
| [Índice documental](docs/README.md)                                                                             | Expedientes de Ruta 1 y Latinoamérica, fuentes, inventarios y licencias.       |

## Ejecutar en local

Requiere **Node.js 22.12 o posterior de la rama 22.x** y npm.

```bash
git clone https://github.com/Aragonenes/hackelectroCDMX.git
cd hackelectroCDMX
npm ci
npm run dev
```

Abrir la dirección que muestra Vite, normalmente `http://localhost:5173`.

Para compilar y servir la versión de producción:

```bash
npm run build
npm run preview -- --port 4173
```

Abrir `http://localhost:4173`. El motor, catálogos, geometrías y tipografía están incluidos localmente. Las teselas del mapa base de OpenStreetMap requieren internet.

## Arquitectura

**React + TypeScript + Vite**, con **MapLibre** para el mapa y **ECharts** para las gráficas. El motor puro se ejecuta en un **Web Worker**; la reproducción utiliza trayectorias precalculadas. La aplicación guarda escenarios en el navegador y funciona sin backend, cuentas ni base de datos.

```text
.
├── src/domain/       Motor, contratos y cálculos técnicos y financieros
├── src/data/         Catálogos, escenarios y perfiles preparados
├── src/worker/       Evaluación, búsqueda, progreso y cancelación
├── src/features/     Mapa, editor, resultados y exportaciones
├── src/ui/           Componentes compartidos y formato
├── public/data/      Geometrías y procedencia publicables
├── data/             Tablas de investigación
├── docs/             Metodología, guías, fuentes y expedientes
├── scripts/          Preparación de datos, extracción y avisos de licencias
└── tests/            Recorridos de navegador
```

El [diseño](DESIGN.md) y la [guía del mapa](docs/desarrollo/redisenio-mapa.md) documentan composición, accesibilidad y navegación. La [metodología](docs/desarrollo/metodologia-motor.md) explica las ecuaciones y sus límites.

## Verificación y colaboración

```bash
npm run check
npx playwright install chromium
npm run test:e2e
npm run format:check
```

Estos comandos comprueban tipos, pruebas, compilación, recorridos de navegador y formato. Los cambios se organizan en commits modulares con **Conventional Commits en español**. Consultar [AGENTS.md](AGENTS.md) para las instrucciones del proyecto.

La documentación histórica puede regenerarse con `python scripts/extraer_documentos.py`. Requiere Python 3, Poppler y los cuatro PDF originales conservados localmente; esos insumos no vienen incluidos en un clon de GitHub. [Fuentes locales y condiciones](docs/contexto/fuentes-locales.md).

## Licencias

**[PolyForm Noncommercial 1.0.0](LICENSE)** para código propio y **[CC BY-NC 4.0](docs/LICENSE.md)** para documentación original del equipo. Los avisos describen los usos permitidos y el tratamiento de las versiones anteriores publicadas bajo MIT y CC BY 4.0. Los materiales de terceros conservan sus licencias y atribuciones.

Los cuatro PDF históricos, sus reproducciones y otros materiales sin permiso de redistribución verificado permanecen excluidos de Git. El [inventario](docs/inventario.json), las referencias y los registros de procedencia permiten identificar las fuentes conservadas. [Alcance de las licencias](docs/contexto/licencia-proyecto.md).
