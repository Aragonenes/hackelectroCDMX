> **Revisión 2026-10-08:** este expediente contiene propuestas sin validación por variante. Sus porcentajes y tablas críticas no alimentan el motor. Consultar [auditoría y correcciones](auditoria-jornada.md) antes de reutilizar cifras. La escala es A ramal oficial / B zona oficial / C CDMX comparable / D México / E externo / F supuesto; naturaleza y escala son independientes.

# Expediente de Variables y Factores que Modulan la Descarga de Baterías

**Investigación técnica y paramétrica · Reto 2: «Electrifica tu flota»**  
Fecha de consolidación: Octubre de 2026.  
Ubicación del dataset tabular: [`matriz-factores-correccion.csv`](matriz-factores-correccion.csv).  
Registro de fuentes y citas en formato APA: [`fuentes-factores.json`](fuentes-factores.json).

---

## 1. Propósito de este Expediente

Este expediente proporciona la **evidencia física, empírica y normativa** que explica por qué la descarga de las baterías de una flota de vehículos eléctricos no es un proceso lineal ni constante en condiciones reales de la Ciudad de México.

Su objetivo es **alimentar la futura evolución del simulador técnico-financiero del proyecto**, permitiendo pasar de un modelo estático lineal ($E = \text{km} \times \text{consumo}$) a un modelo paramétrico sensible al entorno operativo sin alterar la lógica de negocio actual.

---

## 2. Mapa Documental del Expediente

El expediente se compone de tres monografías técnicas exhaustivas, una matriz tabular de coeficientes y un catálogo JSON de fuentes oficiales:

```
docs/investigacion/Variables_Factores/
├── README.md                           <- Este documento (guía general y formulación matemática)
├── modelado-preciso-por-vehiculo.md    <- Modelado detallado modelo por modelo de los 33 vehículos BEV
├── catalogo-modelos-consumo-dinamico.csv <- Dataset CSV con consumo dinámico y pérdida de autonomía por modelo
├── factores-clima-temperatura.md       <- Análisis de temperatura, química LFP/NMC, HVAC y lluvia
├── factores-pasajeros-ocupacion.md     <- Masa rodante, inercia urbana, sobrecupo y horas pico
├── factores-topografia-pendientes.md   <- Trabajo gravitacional, regeneración y altitud de CDMX
├── matriz-factores-correccion.csv      <- Dataset general con factores cuantitativos de corrección K
└── fuentes-factores.json               <- Catálogo estructurado con citas APA y DOI/URLs oficiales
```

---

## 3. Síntesis de las Variables Analizadas

### 3.1. Clima, Temperatura y Climatización (HVAC)
* **Química celular (LFP):** A temperaturas bajas (madrugadas de 5 °C – 9 °C en zonas altas de CDMX), la resistencia interna sube de 25% a 45%, limitando la regeneración y reduciendo la capacidad útil inmediata entre un 8% y un 15%.
* **HVAC (Aire Acondicionado):** En tardes calurosas (30 °C – 35 °C), el compresor de A/C representa entre el **20% y el 35% del consumo total de energía** (NREL, 2022; Altoona, 2023), exacerbado por la apertura de puertas en paradas continuas cada 300 metros.
* **Lluvia y Pavimento Mojado:** La resistencia a la rodadura ($C_{rr}$) aumenta entre 6% y 11% por película hidrodinámica de agua, sumado al consumo de limpiaparabrisas, faros y desempañador (+10% a +18% de consumo neto).

### 3.2. Carga de Pasajeros y Horas Pico
* **Masa inercial:** En una van o un autobús de 12 metros, el pasaje representa entre el **30% y el 45% del peso bruto vehicular total**.
* **Sobrecupo en CDMX:** En horarios punta matutino y vespertino, el sobrecupo alcanza de **125% a 140% de la capacidad nominal**. En un ciclo de aceleraciones constantes, este lastre incrementa la tasa de descarga en tracción entre un **+18% y un +35%** respecto al valor nominal de catálogo.
* **Horarios valle:** A media carga (50% de ocupación), la unidad se desempeña en su punto de calibración base ($K_{\text{pasajeros}} = 1.00$).

### 3.3. Topografía, Desnivel y Regeneración
* **Gradiente ascendente:** Cada **+1% de pendiente media** eleva el consumo en **$0.35\text{ a }0.42\text{ kWh/km}$** en autobuses padrón de 12 metros y en **$0.08\text{ a }0.12\text{ kWh/km}$** en vanes colectivas.
* **Freno regenerativo:** Recupera entre el **60% y el 70%** de la energía gravitacional en descensos, **siempre y cuando el SOC inicial no supere el 85%–90%**, umbral donde el BMS desactiva la regeneración para proteger las celdas de sobrevoltajes destructivos.
* **Altitud CDMX (2,240 msnm):** La reducción del 20% en la densidad del aire disminuye el arrastre aerodinámico, favoreciendo ligeramente la autonomía en un 2%–3% a velocidades urbanas.

---

## 4. Formulación Matemática Propuesta para el Simulador

Para cuando los desarrolladores del proyecto decidan integrar estas variables en el motor [`src/domain/evaluate.ts`](../../src/domain/evaluate.ts), la fórmula unificada de ajuste de consumo por kilómetro es:

$$Consumo_{\text{ajustado}} (\text{kWh/km}) = \Big( Consumo_{\text{base}} \times K_{\text{clima}} \times K_{\text{pasajeros}} \times K_{\text{lluvia}} \Big) + \Delta E_{\text{pendiente}}$$

Donde:
* **$Consumo_{\text{base}}$:** Consumo nominal registrado en el catálogo (`catalogo-vehiculos-electricos-combustion.csv`).
* **$K_{\text{clima}}$:** Coeficiente de temperatura y uso de A/C ($0.98\text{ a }1.32$).
* **$K_{\text{pasajeros}}$:** Coeficiente según nivel de ocupación ($0.82\text{ a }1.35$).
* **$K_{\text{lluvia}}$:** Coeficiente de fricción y auxiliares por agua ($1.00\text{ a }1.18$).
* **$\Delta E_{\text{pendiente}}$:** Término aditivo por desnivel topográfico del ramal ($\text{kWh/km}$ adicional en subida o saldo negativo en descenso).

---

## 5. Matriz Resumen de Coeficientes Multiplicadores

Los valores tabulados en [`matriz-factores-correccion.csv`](matriz-factores-correccion.csv) se resumen en los siguientes rangos de ingeniería:

| Dominio | Condición Operativa | Factor $K$ (Van) | Factor $K$ (Midibús) | Factor $K$ (Padrón 12m) | Impacto sobre Autonomía | Fuente Principal |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| **Temperatura** | Madrugada fría (5 °C – 9 °C) | 1.10 | 1.12 | 1.15 | -9% a -13% | NREL / Oak Ridge (2022) |
| **Temperatura** | Ventana óptima (18 °C – 24 °C) | 1.00 | 1.00 | 1.00 | 0% (Línea base) | UITP E-SORT / CATL (2023) |
| **Temperatura** | Ola de calor / A/C máximo (30 °C – 35 °C) | 1.20 | 1.26 | 1.32 | -17% a -24% | Altoona Bus Testing (2023) |
| **Pasajeros** | Unidad vacía (solo chofer) | 0.88 | 0.85 | 0.82 | +12% a +18% | UITP E-SORT (2021) |
| **Pasajeros** | Media carga (50% plazas) | 1.00 | 1.00 | 1.00 | 0% (Base nominal) | SAE J1634 (2021) |
| **Pasajeros** | Hora pico con sobrecupo (130%) | 1.22 | 1.28 | 1.35 | -18% a -26% | Altoona / U. de Sevilla (2023) |
| **Topografía** | Pendiente suave ascendente (+2% a +3%) | 1.15 | 1.22 | 1.28 | -13% a -22% | U. de Sevilla (2023) |
| **Topografía** | Rampa pronunciada (+4% a +7%) | 1.35 | 1.48 | 1.62 | -26% a -38% | BYD Field Guidelines (2023) |
| **Topografía** | Descenso regenerativo óptimo (SOC < 85%) | 0.55 | 0.50 | 0.48 | +45% a +52% energía | BYD / SAE J1634 (2021) |
| **Meteorología** | Pavimento mojado / Lluvia moderada | 1.06 | 1.08 | 1.10 | -6% a -9% | Ejsmont et al. (2021) |
| **Meteorología** | Tormenta intensa con encharcamiento | 1.15 | 1.18 | 1.22 | -13% a -18% | Ejsmont / INECC (2023) |
| **Altitud** | Altitud CDMX (2,240 msnm) | 0.98 | 0.97 | 0.97 | +2% a +3% aerodinámico | SAE J1634 (2021) |

---

## 6. Procedencia y Nivel de Evidencia

Conforme a la metodología general de investigación abierta del proyecto ([`docs/investigacion/ruta1/metodologia-ruta1.md`](../ruta1/metodologia-ruta1.md)):
* **Nivel B (Estudios Académicos y Ensayos de Organismos Internacionales):** Todas las mediciones dinamométricas de HVAC, resistencia a la rodadura en mojado, peso por pasajero y fórmulas de gradiente proceden de reportes oficiales de NREL, UITP, SAE, Penn State (Altoona) y artículos indexados con revisión por pares.
* **Nivel D (Documentación Técnica OEM):** Especificaciones de operación térmica de celdas LFP provienen de CATL y directrices de regeneración y altitud provienen de BYD Commercial Vehicles.
