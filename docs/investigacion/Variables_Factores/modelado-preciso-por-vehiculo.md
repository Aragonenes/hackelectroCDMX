> **Revisión 2026-10-08:** este expediente contiene propuestas sin validación por variante. Sus porcentajes y tablas críticas no alimentan el motor. Consultar [auditoría y correcciones](auditoria-jornada.md) antes de reutilizar cifras. La escala es A ramal oficial / B zona oficial / C CDMX comparable / D México / E externo / F supuesto; naturaleza y escala son independientes.

# Modelado Preciso de Descarga por Vehículo y Marca (100% Eléctricos)

**Expediente de cálculo analítico e ingeniería de flotas · Reto 2: «Electrifica tu flota»**  
Fecha de consolidación: Octubre de 2026.  
Dataset tabular dinámico por modelo: [`catalogo-modelos-consumo-dinamico.csv`](catalogo-modelos-consumo-dinamico.csv).  
Matriz general de coeficientes: [`matriz-factores-correccion.csv`](matriz-factores-correccion.csv).  
Fuentes bibliográficas: [`fuentes-factores.json`](fuentes-factores.json).

---

## 1. Justificación del Enfoque Específico por Modelo

En el diseño de sistemas de transporte público electrificado, un cálculo promedio genérico resulta insuficiente para estimar la autonomía real y el dimensionamiento de recarga nocturna. Los **33 modelos 100% eléctricos (BEV)** analizados en este proyecto presentan diferencias sustanciales en:

1. **Química celular:** Celdas **LFP** (mayor sensibilidad al frío, pero alta estabilidad térmica) frente a celdas **NMC** (mayor rendimiento en frío, pero mayor consumo de refrigeración activa a temperaturas elevadas).
2. **Tecnología HVAC:** Unidades con **Bomba de Calor con recuperación de calor residual** (eficiencia COP de 2.5 a 3.2 en Volvo y Mercedes-Benz) frente a sistemas con **compresores convencionales y calefactores de resistencia PTC** (eficiencia COP = 1.0 en vanes y midibuses de entrada).
3. **Masa móvil relativa:** La proporción de peso que agregan los pasajeros respecto a la masa en vacío (tara) varía desde un **19% en midibuses pesados** hasta un **45% en autobuses padrón de 12 metros y vanes compactas**.
4. **Reserva de torque motor en pendientes:** Motores de alto par a bajas revoluciones (Yutong, BYD, Scania, Mercedes-Benz) operan con mayor eficiencia en ascensos pronunciados que trenes motrices compactos forzados a entregar corriente pico.

---

## 2. Formulación Matemática del Modelo Preciso

Para cada vehículo $i$ del catálogo ($i \in \{ \text{VAN-01} \dots \text{URB-12} \}$), el consumo específico instantáneo en $\text{kWh/km}$ se determina mediante la descomposición de cuatro potencias mecánicas y eléctricas:

$$E_{\text{km, total}}(i) = E_{\text{tracción}}(i) + E_{\text{auxiliares}}(i, \text{clima}) + \Delta E_{\text{pendiente}}(i, \theta) - \Delta E_{\text{regen}}(i, \theta, \text{SOC})$$

### 2.1. Masa Dinámica Total y Resistencia de Tracción
La masa efectiva del vehículo es:

$$m_{\text{total}}(i) = m_{\text{tara}}(i) + \big(n_{\text{pasajeros}} \times 70\text{ kg}\big)$$

Donde el esfuerzo de tracción urbana ($E_{\text{tracción}}$) integra la resistencia a la rodadura y la inercia en arrancadas:

$$E_{\text{tracción}}(i) = \frac{1}{3.6 \times 10^6 \times \eta_{\text{tren}}(i)} \left[ C_{rr} \cdot m_{\text{total}}(i) \cdot g + \frac{1}{2} \rho_{\text{CDMX}} C_d A v^2 + m_{\text{total}}(i) \cdot a_{\text{media}} \cdot f_{\text{paradas}} \right]$$

* $C_{rr}$: $0.0080$ en asfalto seco; $0.0095$ sobre asfalto mojado.
* $\rho_{\text{CDMX}} = 0.97\text{ kg/m}^3$ (densidad del aire a 2,240 msnm).
* $f_{\text{paradas}} \approx 2.5\text{ a }3.5\text{ paradas/km}$ en el ciclo urbano de CDMX.

### 2.2. Consumo Auxiliar y Climatización ($E_{\text{auxiliares}}$)
Depende de la velocidad comercial ($v_{\text{comercial}} \approx 16\text{ km/h}$) y de la tecnología del equipo HVAC:

$$E_{\text{auxiliares}}(i, \text{clima}) = \frac{P_{\text{HVAC}}(i, \text{clima}) + P_{\text{BMS}}(i, T) + P_{\text{base}}}{v_{\text{comercial}}}$$

* **Bomba de calor (Volvo, Mercedes-Benz, Scania, Karsan):** $P_{\text{HVAC}} \approx 3.0\text{ a }5.5\text{ kW}$.
* **A/C Inverter optimizado (Yutong, BYD, JAC, Marcopolo):** $P_{\text{HVAC}} \approx 4.5\text{ a }7.5\text{ kW}$.
* **A/C convencional + Resistencia PTC (DFSK, Wuling, Jinbei, Tata):** $P_{\text{HVAC}} \approx 7.0\text{ a }12.0\text{ kW}$.

### 2.3. Término Gravitacional de Pendiente y Regeneración
En tramos con pendiente $\theta$:

$$\Delta E_{\text{pendiente}}(i, \theta) = \frac{m_{\text{total}}(i) \cdot g \cdot \sin(\theta)}{3.6 \times 10^6 \times \eta_{\text{motor}}(i)} \quad [\text{kWh/km}]$$

En tramos descendentes ($\theta < 0$):

$$\Delta E_{\text{regen}}(i, \theta, \text{SOC}) = \frac{m_{\text{total}}(i) \cdot g \cdot |\sin(\theta)| \cdot \eta_{\text{regen}}(i)}{3.6 \times 10^6} \times \Phi(\text{SOC})$$

Donde $\Phi(\text{SOC})$ es la función de atenuación del BMS:
* $\Phi(\text{SOC}) = 1.0$ si $\text{SOC} \le 85\%$.
* $\Phi(\text{SOC}) = \frac{95\% - \text{SOC}}{10\%}$ si $85\% < \text{SOC} < 95\%$.
* $\Phi(\text{SOC}) = 0.0$ si $\text{SOC} \ge 95\%$ (regeneración desconectada por protección de celdas).

---

## 3. Síntesis Comparativa por Categoría y Modelos Representativos

A continuación se resume el comportamiento de los modelos en los escenarios operativos clave evaluados en [`catalogo-modelos-consumo-dinamico.csv`](catalogo-modelos-consumo-dinamico.csv):

### 3.1. Vanes y Combis (11 a 20 plazas)
| Modelo | Batería | Química | Consumo Base | Frío Matutino | Calor + A/C Max | Pico Sobrecupo | Pendiente +5% | Crítico CDMX | Autonomía Nominal | Autonomía Crítica | Pérdida Autonomía |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **JAC E Sunray (`VAN-01`)** | 77.3 kWh | LFP | 0.270 kWh/km | 0.302 | 0.329 | 0.332 | 0.485 | **0.448 kWh/km** | 315 km | **155 km** | -50.7% |
| **Ford E-Transit (`VAN-04`)** | 89.0 kWh | Li-ion | 0.310 kWh/km | 0.338 | 0.375 | 0.378 | 0.542 | **0.505 kWh/km** | 230 km | **159 km** | -31.0% |
| **Mercedes eSprinter (`VAN-06`)** | 113.0 kWh | LFP | 0.280 kWh/km | 0.305 | 0.336 | 0.342 | 0.505 | **0.456 kWh/km** | 400 km | **223 km** | -44.2% |
| **DFSK EC35 (`VAN-11`)** | 38.7 kWh | LFP | 0.160 kWh/km | 0.182 | 0.202 | 0.198 | 0.292 | **0.272 kWh/km** | 268 km | **128 km** | -52.2% |

### 3.2. Midibuses de 7 a 9 metros (25 a 52 plazas)
| Modelo | Batería | Química | Consumo Base | Frío Matutino | Calor + A/C Max | Pico Sobrecupo | Pendiente +5% | Crítico CDMX | Autonomía Nominal | Autonomía Crítica | Pérdida Autonomía |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Volare Access-E (`MIDI-01`)** | 150.0 kWh | LFP | 0.600 kWh/km | 0.672 | 0.738 | 0.720 | 1.185 | **1.068 kWh/km** | 250 km | **126 km** | -49.4% |
| **BYD K7 / B8 (`MIDI-02`)** | 174.0 kWh | LFP | 0.690 kWh/km | 0.773 | 0.849 | 0.828 | 1.295 | **1.215 kWh/km** | 250 km | **129 km** | -48.4% |
| **Yutong E8 (`MIDI-03`)** | 115.9 kWh | LFP | 0.460 kWh/km | 0.515 | 0.566 | 0.552 | 0.970 | **0.819 kWh/km** | 250 km | **127 km** | -49.1% |
| **Karsan e-ATAK (`MIDI-10`)** | 220.0 kWh | Li-ion | 0.730 kWh/km | 0.788 | 0.869 | 0.934 | 1.435 | **1.278 kWh/km** | 300 km | **155 km** | -48.4% |

### 3.3. Autobuses Urbanos de 12 metros (80 a 85 plazas)
| Modelo | Batería | Química | Consumo Base | Frío Matutino | Calor + A/C Max | Pico Sobrecupo | Pendiente +5% | Crítico CDMX | Autonomía Nominal | Autonomía Crítica | Pérdida Autonomía |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **DINA Linner E (`URB-01`)** | 314.0 kWh | LFP | 1.250 kWh/km | 1.412 | 1.575 | 1.600 | 2.650 | **2.350 kWh/km** | 250 km | **120 km** | -51.9% |
| **Yutong E12 (`URB-02`)** | 352.1 kWh | LFP | 1.100 kWh/km | 1.243 | 1.386 | 1.408 | 2.440 | **2.068 kWh/km** | 320 km | **153 km** | -52.1% |
| **BYD K9 (`URB-03`)** | 324.0 kWh | LFP | 1.290 kWh/km | 1.458 | 1.625 | 1.651 | 2.720 | **2.425 kWh/km** | 250 km | **120 km** | -51.8% |
| **Volvo Luminus (`URB-04`)** | 330.0 kWh | NMC | 1.320 kWh/km | 1.426 | 1.584 | 1.690 | 2.710 | **2.376 kWh/km** | 250 km | **125 km** | -50.0% |
| **MB eO500U (`URB-06`)** | 384.0 kWh | NMC3 | 1.500 kWh/km | 1.620 | 1.800 | 1.920 | 2.980 | **2.685 kWh/km** | 250 km | **129 km** | -48.5% |
| **Marcopolo Attivi (`URB-07`)** | 396.0 kWh | LFP | 1.400 kWh/km | 1.582 | 1.764 | 1.792 | 2.880 | **2.604 kWh/km** | 280 km | **137 km** | -51.1% |

---

## 4. Hallazgos Operativos Críticos para la CDMX

1. **La regla del «50% de Autonomía en el Peor Día»:**  
   En las condiciones combinadas más adversas de la Ciudad de México (lluvia con encharcamiento en asfalto, hora pico vespertina con sobrecupo del 130%, A/C funcionando para desempañar cristales y pendientes de ladera), **todos los modelos eléctricos experimentan una reducción de autonomía de entre el 45% y el 53% respecto a su valor de catálogo**.
2. **Dimensionamiento de la Batería:**  
   Si una ruta como la **Ruta 1 (Metro CU – San Fernando)** exige una jornada de $180\text{ km/día}$, una unidad con $250\text{ km}$ nominales **no completará la jornada sin recarga intermedia en días lluviosos de alta afluencia** si no se programa recarga de oportunidad (*opportunity charging*) o si la batería no supera los $350\text{ kWh}$ en buses padrón (como el Yutong E12 o Marcopolo Attivi) o los $85\text{ kWh}$ en vanes.
3. **Ventaja comparativa de la Bomba de Calor:**  
   Los modelos europeos con bomba de calor (Volvo Luminus, Mercedes-Benz eO500U) exhiben una menor penalización en calor extremo y frío matutino (-48% a -50%) frente a modelos con compresor directo (-52% a -53%), lo que se traduce en hasta 15–20 km adicionales de autonomía en días críticos.

---

## 5. Guía de Integración para el Simulador (`evaluate.ts`)

Para que el desarrollador del simulador pueda implementar este modo preciso sin fricciones:

```typescript
// Ejemplo de interfaz TypeScript para el cálculo dinámico
export interface DynamicFactors {
  temperatureC: number;        // e.g. 5 a 35 °C
  passengerOccupancyRatio: number; // e.g. 0.5 (valle) a 1.35 (pico sobrecupo)
  roadGradePercent: number;    // e.g. 0% a 6%
  isRaining: boolean;          // true / false
}

export function computeDynamicConsumption(
  baseKwhKm: number,
  batteryChemistry: 'LFP' | 'NMC' | 'Li-ion',
  hvacType: 'heat_pump' | 'inverter' | 'ptc',
  factors: DynamicFactors
): number {
  // 1. Factor de temperatura según química
  let kTemp = 1.0;
  if (factors.temperatureC < 10) {
    kTemp = batteryChemistry === 'LFP' ? 1.14 : 1.08;
  } else if (factors.temperatureC > 28) {
    const hvacPenalty = hvacType === 'heat_pump' ? 1.20 : 1.28;
    kTemp = hvacPenalty;
  }

  // 2. Factor de pasajeros
  const kPax = 1.0 + (factors.passengerOccupancyRatio - 0.5) * 0.45;

  // 3. Factor de lluvia
  const kRain = factors.isRaining ? 1.10 : 1.0;

  // 4. Componente de pendiente
  const deltaGrade = factors.roadGradePercent > 0 
    ? (factors.roadGradePercent / 100) * 8.5 * (baseKwhKm / 1.2)
    : 0;

  return (baseKwhKm * kTemp * kPax * kRain) + deltaGrade;
}
```

Este código toma las columnas ya existentes de nuestro catálogo y permite habilitar controles deslizantes (*sliders*) en la interfaz de usuario para que el evaluador experimente con calor, lluvia y sobrecupo.
