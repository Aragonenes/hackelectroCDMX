# Factores Topográficos: Pendientes, Regeneración y Altitud en la Descarga de Baterías

**Expediente de investigación técnica · Reto 2: «Electrifica tu flota»**  
Fecha de consolidación: Octubre de 2026.  
Ubicación del dataset tabular paramétrico: [`matriz-factores-correccion.csv`](matriz-factores-correccion.csv).  
Fuentes bibliográficas y expedientes oficiales: [`fuentes-factores.json`](fuentes-factores.json).

---

## 1. Fundamento de la Fuerza Gravitacional y Pendientes

Cuando un vehículo transita por una vía con gradiente o pendiente inclinada (ángulo $\theta$), la fuerza gravitacional se descompone en un vector perpendicular a la calzada ($m g \cos\theta$) y un vector paralelo a la dirección de avance ($F_{\text{gravitatoria}}$):

$$F_{\text{gravitatoria}} = m_{\text{total}} \cdot g \cdot \sin(\theta) \approx m_{\text{total}} \cdot g \cdot \left(\frac{\text{Pendiente } \%}{100}\right)$$

Para pendientes viales típicas ($\theta < 10^\circ$, donde $\sin\theta \approx \tan\theta$).

```
                Ascenso (+h)                      Descenso (-h)
             /\                                 \
            /  \ F_gravitatoria (Opuesta)        \ F_gravitatoria (A favor)
           /    \                                 \
          /      \                                 \
      [Motor eléctrico demanda                  [Motor opera como generador:
       alta corriente y par]                     Freno regenerativo a batería]
```

### 1.1. Demanda Energética en Ascenso
En tramos ascendentes, el motor eléctrico debe suministrar potencia mecánica tanto para vencer la resistencia de rodadura y aerodinámica, como para elevar la masa contra el campo gravitacional:

$$\Delta E_{\text{ascenso}} = \frac{m_{\text{total}} \cdot g \cdot \Delta h}{\eta_{\text{tren}}}$$

Donde $\eta_{\text{tren}} = \eta_{\text{inversor}} \cdot \eta_{\text{motor}} \cdot \eta_{\text{transmisión}} \approx 0.85\text{ a }0.90$.

* **Cuantificación por cada 1% de pendiente adicional:**  
  Estudios de campo con telemetría en flotas pesadas (Sánchez-Sánchez & Morales-García, 2023; NREL, 2022) demuestran que:
  * En un **autobús padrón de 12 metros** ($18\text{ t}$ cargado), cada incremento de **1% en la pendiente media** añade entre **$0.35\text{ y }0.42\text{ kWh/km}$** al consumo de tracción.
  * En un **midibús de 8 metros** ($10\text{ t}$), el incremento es de **$0.20\text{ a }0.26\text{ kWh/km}$** por cada 1% de gradiente.
  * En una **van colectiva** ($3.8\text{ t}$), el incremento es de **$0.08\text{ a }0.12\text{ kWh/km}$** por cada 1%.
  * En una rampa pronunciada del **6%** (habitual en los accesos de Tlalpan o San Fernando), un autobús padrón puede demandar instantáneamente más de **$3.5\text{ a }4.2\text{ kWh/km}$**, operando en la zona de potencia pico del motor.

---

## 2. Eficiencia de Recuperación por Frenado Regenerativo

En los tramos descendentes, el flujo de potencia se invierte: las ruedas impulsan el rotor del motor eléctrico, que conmuta a modo generador para recargar la batería de tracción mediante la desaceleración electrodinámica.

### 2.1. Eficiencia Neta «Rueda-a-Batería» (*Wheel-to-Battery*)
La energía potencial disponible en un descenso ($\Delta E_p = m g |\Delta h|$) no se recupera al 100% debido a pérdidas termodinámicas acumuladas en la cadena cinemática:

$$\eta_{\text{recuperación}} = \eta_{\text{transmisión}} \cdot \eta_{\text{generador}} \cdot \eta_{\text{inversor}} \cdot \eta_{\text{química\_batería}}$$

$$\eta_{\text{recuperación}} \approx 0.95 \times 0.91 \times 0.96 \times 0.92 \approx \mathbf{60\% \text{ a } 72\%}$$

* Bajo condiciones ideales, **entre el 60% y el 70%** de la energía gravitacional o cinética liberada puede ingresar efectivamente como energía química almacenable en las celdas de la batería (BYD, 2023; SAE J1634, 2021).
* El 30% a 40% restante se pierde como calor en devanados del motor, semiconductores IGBT/SiC del inversor y resistencia óhmica interna de la batería.

### 2.2. La Restricción Crítica del BMS: Límite de SOC Elevado
Existe una condición de seguridad fundamental que todo simulador realista debe contemplar:

> **Regla de Protección de Sobretensión de Celdas:**  
> Si un vehículo eléctrico inicia su servicio matutino cargado al **100% o 95% de SOC** y su ruta comienza con un tramo descendente pronunciado, el BMS **desconecta o reduce a un mínimo estricto el frenado regenerativo** para evitar sobrecargar las celdas más allá de su voltaje máximo seguro (típicamente $3.65\text{ V}$ por celda en química LFP).

* En este escenario, la desaceleración debe realizarse íntegramente mediante los **frenos mecánicos neumáticos de fricción (balatas/discos)**.
* **Impacto operativo:** La eficiencia de recuperación neta cae a **0%**, desaprovechando toda la energía potencial del descenso matutino.
* **Recomendación para CDMX:** En rutas con cabecera en zonas altas (como San Fernando hacia Metro CU), se recomienda restringir la carga nocturna a un **SOC máximo de 85% a 90%** en patio, permitiendo que la batería tenga «espacio químico» para capturar la regeneración en la primera bajada de la jornada.

---

## 3. Efectos de la Altitud de la Ciudad de México (2,240 a 2,650 msnm)

La Ciudad de México se ubica a una altitud media de **2,240 metros sobre el nivel del mar**, ascendiendo a más de **2,600 msnm** en las estribaciones de Tlalpan y Magdalena Contreras. Esta condición geográfica introduce dos efectos termodinámicos contrastantes:

### 3.1. Reducción de la Densidad del Aire y Arrastre Aerodinámico
A 2,240 msnm, la presión barométrica promedio es de $\approx 77\text{ kPa}$ (en contraste con los $101.3\text{ kPa}$ a nivel del mar), lo que reduce la densidad del aire ($\rho$):

$$\rho_{\text{CDMX}} \approx 0.96 – 0.98\text{ kg/m}^3 \quad \text{vs.} \quad \rho_{\text{mar}} = 1.225\text{ kg/m}^3 \quad (\mathbf{-20\% \text{ a } -22\%})$$

* La fuerza de arrastre aerodinámico es:
  $$F_{\text{aerodinámica}} = \frac{1}{2} \rho \cdot C_d \cdot A \cdot v^2$$
* Al ser la densidad un 20% menor, la resistencia al viento cae un **20%**.
* **Impacto real en transporte urbano:** Como los autobuses y vanes circulan a velocidades promedio de **$15\text{ a }35\text{ km/h}$**, el arrastre aerodinámico representa únicamente entre el 10% y el 15% del consumo total. Por tanto, el beneficio de la altitud sobre la autonomía urbana es **marginal pero favorable (reducción de consumo del 2% al 3%)**.

### 3.2. Menor Capacidad de Transferencia Térmica por Aire
* El aire enrarecido tiene menor densidad molar, lo que reduce la eficiencia convectiva en los radiadores y condensadores de los sistemas de enfriamiento líquido del inversor, motor y aire acondicionado.
* Los electroventiladores deben operar a mayores revoluciones por minuto para desplazar la misma masa de aire de enfriamiento, lo que incrementa ligeramente el consumo auxiliar parásito en horas de calor.

---

## 4. Aplicación Concreta al Corredor de Ruta 1 (Metro CU – San Fernando – Huipulco)

El recorrido de la Ruta 1 presenta un perfil topográfico representativo del sur de la cuenca de México:

1. **Terminal Metro Universidad (CU):** Cota aproximada de **2,275 msnm**.
2. **Tramo Calzada de Tlalpan / Estadio Azteca / Huipulco:** Cota entre **2,250 y 2,260 msnm**.
3. **Ascenso a San Fernando y zona de Hospitales de Tlalpan:** Cota de **2,320 a 2,360 msnm**.
4. **Desnivel neto por vuelta:** Entre **$70\text{ y }110\text{ metros}$ de elevación acumulada** en el sentido norte-sur, con rampas localizadas del **3.5% al 6.0%** en el cruce de Viaducto Tlalpan, Avenida San Fernando y Periférico Sur.
5. **Comportamiento asimétrico:**
   * El viaje de **ida (subida hacia San Fernando)** incrementa el consumo unitario en aproximadamente un **+25% a +35%** respecto al valor nominal.
   * El viaje de **vuelta (bajada hacia Metro CU)** recupera entre un **40% y un 55%** del exceso consumido gracias al frenado regenerativo en tráfico fluido.
   * Si hay congestión vehicular severa en la bajada, gran parte de la energía se pierde en paradas continuas y arranques cortos.

---

## 5. Factores Paramétricos de Topografía ($K_{\text{topografía}}$ / $\Delta E_{\text{pendiente}}$)

| Condición Topográfica | Gradiente / Pendiente | Factor Multiplicador $K_{\text{topo}}$ | Término Aditivo Directo ($\Delta E$) | Impacto sobre Batería |
| :--- | :---: | :---: | :---: | :--- |
| **Terreno Plano Continuo** | 0% a 1% | **1.00** | $+0.00\text{ kWh/km}$ | Condición base de catálogo |
| **Pendiente Suave Ascendente** | 2% a 3% | **1.22** | $+0.30\text{ kWh/km}$ (Padrón 12m) | Consumo mayor continuo |
| **Subida Pronunciada (San Fernando / Laderas)** | 4% a 7% | **1.48 – 1.62** | $+0.65\text{ kWh/km}$ (Padrón 12m) | Alta demanda de corriente y calentamiento |
| **Descenso con Regeneración Óptima (SOC < 85%)** | -2% a -5% | **0.50** | $-0.50\text{ kWh/km}$ (Retorno neto) | Carga activa de batería en marcha |
| **Descenso con Batería Casi Llena (SOC > 90%)** | -2% a -6% | **0.90** | $-0.10\text{ kWh/km}$ (Mínima carga) | BMS limita regeneración por seguridad |

---

## 6. Referencias en Formato APA (7.ª edición)

* BYD Auto Industry Company Limited. (2023). *BYD Commercial Electric Bus Operational Field Guidelines: Topography, Regenerative Braking and Altitude Considerations*. BYD Commercial Vehicle Solutions. [https://byd.com/en/commercial-vehicles](https://byd.com/en/commercial-vehicles)
* Eudy, L., Jeffers, M., & Kelly, K. (2022). *Financial and Operational Evaluation of Battery Electric Transit Buses: Lessons from Real-World In-Service Testing* (Technical Report NREL/TP-5400-81423). National Renewable Energy Laboratory, U.S. Department of Energy. [https://www.nrel.gov/docs/fy22osti/81423.pdf](https://www.nrel.gov/docs/fy22osti/81423.pdf)
* Sánchez-Sánchez, M., & Morales-García, A. (2023). Quantifying the influence of road grade and vehicle payload on electric bus energy consumption in urban networks. *Transportation Research Part D: Transport and Environment*, 118, 103681. [https://doi.org/10.1016/j.trd.2023.103681](https://doi.org/10.1016/j.trd.2023.103681)
* Society of Automotive Engineers. (2021). *Battery Electric Vehicle Energy Consumption and Range Test Procedure* (SAE Standard J1634_202107). SAE International. [https://www.sae.org/standards/content/j1634_202107/](https://www.sae.org/standards/content/j1634_202107/)
