> **Revisión 2026-10-08:** este expediente contiene propuestas sin validación por variante. Sus porcentajes y tablas críticas no alimentan el motor. Consultar [auditoría y correcciones](auditoria-jornada.md) antes de reutilizar cifras. La escala es A ramal oficial / B zona oficial / C CDMX comparable / D México / E externo / F supuesto; naturaleza y escala son independientes.

# Factores de Ocupación: Carga de Pasajeros y Horas Pico en la Descarga de Baterías

**Expediente de investigación técnica · Reto 2: «Electrifica tu flota»**  
Fecha de consolidación: Octubre de 2026.  
Ubicación del dataset tabular paramétrico: [`matriz-factores-correccion.csv`](matriz-factores-correccion.csv).  
Fuentes bibliográficas y expedientes oficiales: [`fuentes-factores.json`](fuentes-factores.json).

---

## 1. Justificación y Fundamento Físico de la Masa Móvil

En la dinámica longitudinal de un vehículo urbano, la masa total ($m_{\text{total}}$) es la suma de la masa del vehículo en vacío (tara o *curb weight*, $m_{\text{tara}}$) más la masa agregada por el pasaje transportado ($m_{\text{pasajeros}}$):

$$m_{\text{total}} = m_{\text{tara}} + n_{\text{pasajeros}} \times \bar{m}_{\text{pasajero}}$$

Donde el estándar internacional (UITP / SAE / DOT) fija una masa promedio por usuario de **$\bar{m}_{\text{pasajero}} = 68\text{ a }75\text{ kg}$** (considerando ropa y equipaje de mano).

En un ciclo de conducción urbano como el de la Ciudad de México —caracterizado por aceleraciones y frenadas frecuentes (con paradas cada 250 a 400 metros, topes, semáforos e intersecciones)—, la masa actúa sobre dos fuerzas mecánicas directas:

1. **Fuerza Inercial de Aceleración:**
   $$F_{\text{inercia}} = m_{\text{total}} \cdot a \cdot (1 + \lambda_{\text{rotacional}})$$
   Donde $\lambda_{\text{rotacional}} \approx 0.08\text{ a }0.12$ representa la inercia de masas rotativas (ruedas, rotores eléctricos, transmisión).  
   La energía cinética requerida para acelerar de 0 a la velocidad de crucero ($v$) es directamente proporcional a la masa:
   $$E_{\text{cinética}} = \frac{1}{2} m_{\text{total}} v^2$$
2. **Fuerza de Resistencia a la Rodadura:**
   $$F_{\text{rodadura}} = C_{rr} \cdot m_{\text{total}} \cdot g \cdot \cos(\theta)$$
   Donde $C_{rr}$ es el coeficiente de fricción por deformación del neumático, $g = 9.81\text{ m/s}^2$ y $\theta$ el ángulo de inclinación de la calzada.

---

## 2. Peso en Vacío vs. Capacidad Bruta en las Categorías de CDMX

El porcentaje en que el pasaje modifica la masa total del vehículo varía dramáticamente según el porte de la unidad:

| Categoría | Modelo Representativo | Masa en Vacío / Tara ($m_{\text{tara}}$) | Plazas Nominales | Masa de Pasajeros (100% Plazas @ 70 kg) | Incremento de Masa Relativo | Sobrecupo en Hora Pico CDMX (130%) | Masa Máxima en Pico |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Van Colectiva** | JAC E Sunray / Ford E-Transit | 2,750 kg | 15–17 plazas | +1,190 kg | **+43.3%** | 21 pasajeros (+1,470 kg) | 4,220 kg |
| **Midibús Urbano** | BYD K7 / King Long XMQ6850 | 8,200 kg | 28 plazas | +1,960 kg | **+23.9%** | 38 pasajeros (+2,660 kg) | 10,860 kg |
| **Autobús Padrón 12m** | Yutong E12 / BYD K9 | 13,200 kg | 85 plazas (sent.+par.) | +5,950 kg | **+45.1%** | 105 pasajeros (+7,350 kg) | 20,550 kg |

### Hallazgo Clave de Ingeniería:
* En las **vanes colectivas** y en los **autobuses de 12 metros**, el pasaje representa entre el **30% y el 36% del peso bruto vehicular total**.
* En consecuencia, operar un autobús de 12 metros lleno en hora pico exige mover **7.3 toneladas adicionales** en cada arranque de semáforo en comparación con la unidad vacía que sale del patio.

---

## 3. Pruebas Experimentales y Normativas (UITP E-SORT y Altoona)

### 3.1. Protocolo E-SORT de la UITP (International Association of Public Transport)
La UITP clasifica los ciclos de prueba normalizados en función del lastre y la velocidad:
* **E-SORT 1 (Heavy Urban):** Velocidad comercial de $12\text{ km/h}$, paradas cada 250 m, lastre fijado al 50% de la capacidad de diseño.
* **E-SORT 2 (Easy Urban):** Velocidad comercial de $18\text{ km/h}$, paradas cada 400 m, lastre al 50%.
* Los fabricantes comúnmente publican consumos medidos con el vehículo a **media carga (50% de capacidad)** o incluso en condiciones de prueba con **lastre mínimo**.
* **Desviación real:** Cuando la unidad entra al servicio público en horario punta con el 100% de asientos ocupados y usuarios de pie, el consumo específico de tracción se incrementa entre un **18% y un 24%** respecto a la cifra nominal de catálogo (UITP, 2021).

### 3.2. Mediciones del Centro de Ensayos de Altoona (FTA / Penn State University)
Las pruebas dinamométricas pesadas comparan sistemáticamente:
1. **Curb Weight (Masa en Vacío):** Solo el operador.
2. **Seated Load Weight (SLW):** Asientos ocupados al 100%, sin pasajeros de pie.
3. **Gross Vehicle Weight (GVW):** Capacidad máxima legal (asientos + usuarios de pie permitidos).

En los reportes de prueba de autobuses eléctricos de 12 metros (Altoona, 2023):
* El consumo medio en ciclo urbano con **Curb Weight** promedia **$1.05\text{ kWh/km}$**.
* Con **SLW (35–40 plazas sentadas)**, el consumo sube a **$1.22\text{ kWh/km}$** (+16.2%).
* Con **GVW (carga total)**, el consumo sube a **$1.46\text{ kWh/km}$** (+39.0% respecto al vehículo vacío).
* En promedio empírico, cada **tonelada métrica adicional** incrementa el consumo de tracción entre **$0.065\text{ y }0.095\text{ kWh/km}$** en ciclos urbanos con paradas cada 300 metros.

---

## 4. El Fenómeno del Sobrecupo en las Horas Pico de la CDMX

En el transporte concesionado y corredores metropolitanos de la Ciudad de México, la demanda no se distribuye de manera uniforme durante las 16 a 18 horas de servicio diario:

```
    Afluencia de
    Pasajeros (%)
       140% |             /\                        /\     Sobrecupo
            |            /  \                      /  \    (125% - 140%)
       100% |-----------/----\--------------------/----\-- Capacidad Nominal
            |          /      \                  /      \
        50% |  ______ /        \ ______________ /        \ ___ Valle (35% - 50%)
            | /                                               \
         0% +---------------------------------------------------->
            05:00    07:30    10:00    14:00   18:30    21:30   23:30  Horario
                     (Pico Matutino)           (Pico Vespertino)
```

1. **Pico Matutino (06:30 a 09:30 h) y Vespertino (17:30 a 20:30 h):**
   * En Ruta 1 (San Fernando – Metro CU) y ramales colectivos de Tlalpan/Coyoacán, las unidades operan con índices de hacinamiento de **125% a 140% de la capacidad nominal**.
   * Una van de 15 plazas viaja frecuentemente con 20–22 usuarios (pasajeros de pie o en pasillo).
   * Un midibús de 28 asientos transporta de 35 a 42 pasajeros en horas punta.
   * La masa máxima supera el límite de diseño de fábrica, forzando al motor a demandar picos de potencia de aceleración cercanos a la potencia pico (*peak power* kW) en lugar de la potencia continua nominal.

2. **Horarios Valle (10:30 a 13:30 h) y Nocturno (21:30 a 23:30 h):**
   * La ocupación decae a entre 25% y 40% de la capacidad sentada.
   * La masa móvil se reduce sustancialmente, logrando que el consumo unitario sea inferior al valor de catálogo (factor $K_{\text{pasajeros}} \approx 0.90\text{ a }0.94$).

---

## 5. Matriz de Factores de Corrección Paramétricos ($K_{\text{pasajeros}}$)

Para que el simulador pueda ajustar el consumo según el perfil horario o el promedio ponderado de la jornada:

| Escenario de Ocupación | Porcentaje de Capacidad | Van Colectiva ($K_{\text{pasajeros}}$) | Midibús ($K_{\text{pasajeros}}$) | Autobús 12m ($K_{\text{pasajeros}}$) | Impacto sobre Autonomía | Observación Operativa |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Vacío / Traslado a Patio** | 0% (solo chofer) | **0.88** | **0.85** | **0.82** | +14% a +18% | Viajes de posicionamiento sin pasaje |
| **Valle Ligero / Nocturno** | 25% a 35% | **0.94** | **0.92** | **0.90** | +6% a +10% | Pasaje sentado parcial |
| **Media Carga (Calibración base)** | 50% | **1.00** | **1.00** | **1.00** | 0% (Línea base) | Condición nominal E-SORT 2 |
| **Plena Carga Nominal** | 100% | **1.14** | **1.18** | **1.22** | -12% a -18% | Cupo oficial cubierto (asientos + de pie) |
| **Hora Pico CDMX con Sobrecupo** | 125% a 140% | **1.22** | **1.28** | **1.35** | -18% a -26% | Hacinamiento crítico en horas de mayor demanda |

---

## 6. Referencias en Formato APA (7.ª edición)

* International Association of Public Transport. (2021). *Standardised On-Road Test Cycles (SORT and E-SORT): Protocol for Comparative Energy Consumption Evaluation in Urban Buses*. UITP Bus Committee. [https://www.uitp.org/publications/sort-standardised-on-road-test-cycles/](https://www.uitp.org/publications/sort-standardised-on-road-test-cycles/)
* Larson Transportation Institute. (2023). *Bus Testing Program: Comprehensive Energy Economy and Range Testing on Heavy-Duty Electric Transit Buses*. Penn State University & Federal Transit Administration. [https://www.altoonabustest.psu.edu/](https://www.altoonabustest.psu.edu/)
* Sánchez-Sánchez, M., & Morales-García, A. (2023). Quantifying the influence of road grade and vehicle payload on electric bus energy consumption in urban networks. *Transportation Research Part D: Transport and Environment*, 118, 103681. [https://doi.org/10.1016/j.trd.2023.103681](https://doi.org/10.1016/j.trd.2023.103681)
* Society of Automotive Engineers. (2021). *Battery Electric Vehicle Energy Consumption and Range Test Procedure* (SAE Standard J1634_202107). SAE International. [https://www.sae.org/standards/content/j1634_202107/](https://www.sae.org/standards/content/j1634_202107/)
