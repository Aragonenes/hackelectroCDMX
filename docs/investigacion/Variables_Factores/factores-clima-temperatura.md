> **Revisión 2026-10-08:** este expediente contiene propuestas sin validación por variante. Sus porcentajes y tablas críticas no alimentan el motor. Consultar [auditoría y correcciones](auditoria-jornada.md) antes de reutilizar cifras. La escala es A ramal oficial / B zona oficial / C CDMX comparable / D México / E externo / F supuesto; naturaleza y escala son independientes.

# Factores Ambientales: Clima, Temperatura y Lluvia en la Descarga de Baterías

**Expediente de investigación técnica · Reto 2: «Electrifica tu flota»**  
Fecha de consolidación: Octubre de 2026.  
Ubicación del dataset tabular paramétrico: [`matriz-factores-correccion.csv`](matriz-factores-correccion.csv).  
Fuentes bibliográficas y expedientes oficiales: [`fuentes-factores.json`](fuentes-factores.json).

---

## 1. Justificación y Problemática Operativa

En los modelos simplificados de simulación de flotas de transporte público, suele asumirse un consumo unitario constante expresado en $\text{kWh/km}$ (por ejemplo, $0.27\text{ kWh/km}$ para una van o $1.20\text{ kWh/km}$ para un autobús padrón de 12 metros). Sin embargo, en la operación real en entornos metropolitanos como la Ciudad de México, el consumo energético de un vehículo eléctrico a batería (BEV) está gobernado por dos frentes altamente sensibles a las condiciones meteorológicas:

1. **La física electroquímica de las celdas:** La temperatura de la celda altera la viscosidad del electrolito, la movilidad iónica del litio y la resistencia interna ($R_{\text{int}}$), modificando la capacidad útil accesible y las pérdidas por efecto Joule ($I^2 R$).
2. **La demanda parásita de los sistemas auxiliares (HVAC):** El acondicionamiento térmico de la cabina de pasajeros (calefacción en madrugadas frías o aire acondicionado en tardes calurosas) y el circuito de refrigeración líquida del paquete de baterías (BTMS - *Battery Thermal Management System*) se alimentan directamente de la batería de tracción de alto voltaje.
3. **Resistencia a la rodadura bajo lluvia:** La presencia de una película de agua sobre el asfalto incrementa la resistencia hidrodinámica de las llantas y activa equipos auxiliares continuos (limpiaparabrisas, luces antiniebla y desempañador térmico de cristales).

---

## 2. Comportamiento Electroquímico de las Celdas según Temperatura

La gran mayoría de los vehículos de transporte colectivo analizados en el catálogo del proyecto (Yutong, BYD, JAC, Foton, Zhongtong, King Long) utilizan química **LFP (Fosfato de Hierro y Litio)** debido a su elevada estabilidad térmica, seguridad contra embalamiento térmico (*thermal runaway*) y vida útil de más de 3,500 a 5,000 ciclos. Modelos específicos (como Volvo Luminus o Mercedes-Benz eO500U) emplean químicas **NMC (Níquel-Manganeso-Cobalto)**.

```
       Consumo
       Energético
       (kWh/km)
          ^
          |      Curva en "U" del Consumo vs Temperatura
     Alto |   \                                         /
          |    \                                       /
          |     \                                     /
    Medio |      \                                   /
          |       \           Ventana Óptima        /
     Bajo |        \_________ (18°C a 24°C) _______/
          +-------------------------------------------------->
             0°C       10°C       20°C       30°C      40°C
                              Temperatura Ambiente
```

### 2.1. Frío y Bajas Temperaturas (0 °C a 12 °C)
Aunque la Ciudad de México no experimenta inviernos árticos, en las madrugadas (04:30 a 07:00 h, horario en que sale la primera corrida de transporte) en zonas altas del sur y poniente (Tlalpan, San Fernando, Cuajimalpa, Ajusco) las temperaturas oscilan frecuentemente entre **3 °C y 9 °C**.

* **Aumento de la resistencia interna:** A temperaturas inferiores a 10 °C, la conductividad iónica en el electrolito líquido de las celdas LFP decae significativamente. La resistencia interna se incrementa entre un 25% y un 45% respecto a los 25 °C (Gao et al., 2022; CATL, 2023).
* **Pérdida temporal de capacidad entregable:** Al demandar corriente durante una aceleración, la mayor resistencia genera una caída de tensión (*voltage drop* $\Delta V = I \cdot R_{\text{int}}$) más pronunciada. El BMS detecta que el voltaje de corte inferior se alcanza prematuramente, reduciendo la energía neta extraíble entre un **8% y un 15%**, aunque la carga química permanezca en la celda.
* **Restricción de frenado regenerativo:** Las celdas frías son muy susceptibles a la sedimentación de litio metálico (*lithium plating*) sobre el ánodo de grafito durante cargas a alta corriente. Por ello, el BMS restringe severamente la tasa C del frenado regenerativo por debajo de 10 °C, desperdiciando energía cinética que debe ser disipada por los frenos mecánicos de fricción.

### 2.2. Ventana Óptima de Operación (18 °C a 24 °C)
Es la temperatura promedio de diseño considerada en los protocolos internacionales de prueba (SAE J1634, UITP E-SORT):
* La movilidad de los iones de litio entre electrodos es óptima.
* La resistencia interna de la celda es mínima.
* No se requiere calefacción ni enfriamiento forzado de cabina ni de celdas.
* **Factor de corrección:** $K_{\text{temp}} = 1.00$ (consumo nominal de ficha técnica).

### 2.3. Calor Elevado y Radiación Solar (28 °C a 36 °C)
En los meses de abril a junio en la Ciudad de México, el efecto de «isla de calor urbano» en avenidas congestionadas eleva la temperatura sobre el pavimento por encima de los 32 °C – 35 °C:
* **Enfriamiento activo de la batería (BTMS):** Para mantener las celdas por debajo de su límite de degradación acelerada (típicamente 35 °C – 40 °C), el sistema activa bombas de refrigerante líquido y compresores de ciclo de refrigeración dedicados a la batería, consumiendo entre $1.5\text{ kW}$ y $4.0\text{ kW}$ de potencia eléctrica continua.
* **Aceleración de degradación por calor:** Operar sistemáticamente por encima de 35 °C sin adecuado enfriamiento acelera el crecimiento de la capa SEI (*Solid Electrolyte Interphase*) y la pérdida de litio activo (envejecimiento por calendario).

---

## 3. Impacto del Sistema de Climatización de Cabina (HVAC)

El sistema de calefacción, ventilación y aire acondicionado (HVAC) representa el mayor consumidor auxiliar de un autobús eléctrico, pudiendo explicar entre el **20% y el 40% del consumo total de energía** (NREL, 2022; Altoona Bus Testing, 2023).

### 3.1. Pruebas de Laboratorio y Dinamómetro (Altoona Bus Research Center)
En las pruebas estandarizadas de la FTA realizadas por Penn State University sobre dinamómetros de chasis de gran rodillo:
* Un autobús eléctrico estándar de 12 metros con consumo base de tracción de $1.20\text{ kWh/km}$ eleva su consumo a **$1.55 – 1.70\text{ kWh/km}$** al operar el sistema de aire acondicionado a plena capacidad en ciclo urbano (*Adhattan / Orange County Transit Cycle*).
* Esto representa un **incremento del 28% al 38%** en la tasa de consumo y una reducción equivalente en la autonomía máxima disponible.

### 3.2. Dinámica de Transporte Público en CDMX: Apertura Frecuente de Puertas
A diferencia de un vehículo particular que mantiene un volumen cerrado de aire, un vehículo de transporte público en CDMX (como Ruta 1 o un corredor troncal):
* Abre puertas cada 250 a 450 metros en promedio para ascenso y descenso de pasaje.
* Cada apertura de puertas de 15 a 30 segundos renueva entre el 40% y el 70% del volumen de aire climatizado del salón de pasajeros por convección natural con el exterior.
* El compresor de A/C opera en un régimen de ciclo continuo al 100% de potencia para intentar restablecer la temperatura de consigna (típicamente ajustada a 22 °C – 24 °C).

---

## 4. Efecto de Pavimento Mojado y Lluvia Intensa

Durante la temporada de lluvias en la CDMX (junio a octubre), las precipitaciones vespertinas impactan la operación de la flota mediante tres mecanismos físicos concurrentes:

1. **Incremento en la Resistencia a la Rodadura ($C_{rr}$):**
   * Sobre pavimento seco, el coeficiente de resistencia a la rodadura de neumáticos comerciales de autobús oscila entre $C_{rr} \approx 0.0075$ y $0.0090$.
   * Sobre pavimento con película de agua (1 a 3 mm de espesor), el neumático debe desalojar agua a través de las estrías de la banda de rodamiento (resistencia hidrodinámica de desplazamiento), incrementando el esfuerzo resistente entre un **6% y un 11%** (Ejsmont et al., 2021).
   * En encharcamientos severos (charcos de 3 a 6 cm frecuentes en vialidades como Calzada de Tlalpan o Periférico Sur), el impacto hidrodinámico directo eleva el consumo puntual de tracción hasta un **18%**.

2. **Cargas Eléctricas Auxiliares Adicionales:**
   * Motor de limpiaparabrisas continuo: $150 – 300\text{ W}$.
   * Desempañador eléctrico térmico de parabrisas y cristales laterales (*defroster* PTC): $1,500 – 3,000\text{ W}$.
   * Alumbrado completo (faros principales, luces de gálibo y niebla): $250 – 400\text{ W}$.
   * En una jornada de lluvia con tráfico lento (velocidad comercial reducida a 10–12 km/h), estas cargas auxiliares fijas por hora se distribuyen entre muy pocos kilómetros recorridos, elevando el ratio de $\text{kWh/km}$ consumidos.

3. **Modulación del Frenado Regenerativo por Seguridad:**
   * Los sistemas de control de estabilidad electrónica (ESP) y frenos antibloqueo (EBS) de fabricantes como Knorr-Bremse, WABCO o Bosch modulan o reducen la intensidad del frenado regenerativo en superficies de baja adherencia ($\mu < 0.4$) para prevenir el bloqueo de las ruedas motrices traseras y el efecto tijera o sobreviraje.
   * La energía que no puede ser absorbida por regeneración segura se transfiere al frenado mecánico o se reduce el par de retención.

---

## 5. Factores de Corrección Paramétricos Recomendados

Para su incorporación en el motor del simulador, se definen los siguientes factores multiplicadores consolidados ($K_{\text{clima}}$):

| Escenario Climático | Temperatura Ambiente | Estado de Pavimento | Auxiliares Activos | Factor $K_{\text{clima}}$ (Van) | Factor $K_{\text{clima}}$ (Midibús) | Factor $K_{\text{clima}}$ (Autobús 12m) | Variación de Consumo |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Condición Base Nominal** | 20 °C – 23 °C | Seco | Solo ventilación mínima | **1.00** | **1.00** | **1.00** | 0% (Ficha oficial) |
| **Madrugada Fría CDMX** | 5 °C – 9 °C | Seco | Desempañador bajo | **1.10** | **1.12** | **1.15** | +10% a +15% |
| **Tarde Cálida Moderada** | 25 °C – 28 °C | Seco | A/C a media potencia | **1.08** | **1.12** | **1.15** | +8% a +15% |
| **Ola de Calor / Tarde Calurosa** | 30 °C – 35 °C | Seco | A/C a máxima potencia + BTMS | **1.20** | **1.26** | **1.32** | +20% a +32% |
| **Lluvia Moderada Continua** | 16 °C – 19 °C | Mojado | Limpiaparabrisas + Luces + Desempañador | **1.12** | **1.16** | **1.20** | +12% a +20% |
| **Tormenta con Encharcamiento y Tráfico** | 14 °C – 18 °C | Encharcado | A/C desempañado + Limpiaparabrisas + Luces | **1.22** | **1.28** | **1.35** | +22% a +35% |

---

## 6. Referencias en Formato APA (7.ª edición)

* Contemporary Amperex Technology Co., Limited. (2023). *Lithium Iron Phosphate (LFP) Battery Cell Specification and Thermal Management Operational Envelope*. CATL Commercial Vehicle Powertrain Division. [https://www.catl.com/en/commercial/bus/](https://www.catl.com/en/commercial/bus/)
* Ejsmont, J., Ronowski, G., & Taryma, S. (2021). Effects of road surface wetness, water film thickness and weather conditions on tire rolling resistance and EV energy efficiency. *Measurement*, 178, 109812. [https://doi.org/10.1016/j.measurement.2021.109812](https://doi.org/10.1016/j.measurement.2021.109812)
* Eudy, L., Jeffers, M., & Kelly, K. (2022). *Financial and Operational Evaluation of Battery Electric Transit Buses: Lessons from Real-World In-Service Testing* (Technical Report NREL/TP-5400-81423). National Renewable Energy Laboratory, U.S. Department of Energy. [https://www.nrel.gov/docs/fy22osti/81423.pdf](https://www.nrel.gov/docs/fy22osti/81423.pdf)
* Gao, Z., Lin, Z., Franzese, O., & Stelling, P. (2022). Impact of ambient temperature and driving dynamics on the energy consumption of battery electric buses in real-world public transport. *Energies*, 15(14), 5120. [https://doi.org/10.3390/en15145120](https://doi.org/10.3390/en15145120)
* Larson Transportation Institute. (2023). *Bus Testing Program: Comprehensive Energy Economy and Range Testing on Heavy-Duty Electric Transit Buses*. Penn State University & Federal Transit Administration. [https://www.altoonabustest.psu.edu/](https://www.altoonabustest.psu.edu/)
* Society of Automotive Engineers. (2021). *Battery Electric Vehicle Energy Consumption and Range Test Procedure* (SAE Standard J1634_202107). SAE International. [https://www.sae.org/standards/content/j1634_202107/](https://www.sae.org/standards/content/j1634_202107/)
