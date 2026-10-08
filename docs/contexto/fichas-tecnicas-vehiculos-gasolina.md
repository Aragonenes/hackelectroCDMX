# Fichas Técnicas de Vehículos Equivalentes de Gasolina (ICE CDMX)

**Catálogo técnico, especificaciones de motorización a gasolina, equivalencias operativas y citas en formato APA (7.ª edición).**  
Fecha de consolidación: Octubre de 2026.  
Fichas técnicas de vehículos eléctricos asociadas: [`fichas-tecnicas-vehiculos.md`](fichas-tecnicas-vehiculos.md).  
Dataset tabular dedicado a gasolina: [`docs/investigacion/modelos/catalogo-vehiculos-gasolina.csv`](../investigacion/modelos/catalogo-vehiculos-gasolina.csv).  
Dataset tabular comparativo general (EV vs. ICE): [`docs/investigacion/modelos/catalogo-vehiculos-electricos-combustion.csv`](../investigacion/modelos/catalogo-vehiculos-electricos-combustion.csv).  
Análisis comparativo de ingeniería y equivalencias: [`docs/investigacion/modelos/README.md`](../investigacion/modelos/README.md).

---

## 1. Declaración de Atribución y Contexto Operativo en CDMX

En el sistema de transporte público concesionado de la Ciudad de México y su zona metropolitana, los **vehículos con motorización a gasolina** han desempeñado un papel central y numéricamente dominante en dos segmentos operacionales clave:

1. **Vanes y Combis Colectivas de Ruta (11 a 16 plazas):** A diferencia de las flotas de transporte masivo o de carga pesada que emplean diésel, las rutas capilares, ramales alimentadores y zonas de ladera de la CDMX (como Tlalpan, Xochimilco, Magdalena Contreras, Álvaro Obregón y Gustavo A. Madero) operan mayoritariamente con vanes a gasolina (principalmente Nissan NV350 Urvan y Toyota Hiace, seguidas de plataformas comerciales Ford Transit, Foton View, King Long Kingo y Jinbei). Los concesionarios eligen históricamente motores a gasolina por:
   * **Menor costo de adquisición inicial (CAPEX)** frente a las opciones turbodiésel o eléctricas.
   * **Facilidad y bajo costo de mantenimiento preventivo y correctivo:** Disponibilidad universal de refacciones, talleres mecánicos zonales y ausencia de sistemas complejos de postratamiento de gases (SCR/Urea/DPF).
   * **Desempeño en pendientes y ciclos de arranque y parada cortos:** Motores atmosféricos o turbo de respuesta rápida sin los problemas de saturación de filtros de partículas diésel en recorridos de baja velocidad promedio (12 a 18 km/h).

2. **Chasis y Microbuses Tradicionales Concesionados (23 a 28 plazas):** El parque vehicular histórico de microbuses en CDMX (que dio origen a rutas concesionadas como la **Ruta 1**) se estructuró a partir de chasis coraza comerciales de tres toneladas y media con motores V8 de gasolina (Chevrolet C3500 con motor 350 / 5.7L y Dodge Ram 3500 con motor Magnum 5.9L), muchos de los cuales incorporaron posteriormente conversiones a Gas LP para reducir el costo del combustible.

> [!NOTE]
> **Propiedad Intelectual y Uso Académico:**  
> Los datos técnicos, cilindradas, potencias, curvas de torque y dimensiones referenciadas en este documento han sido recopilados de manuales de taller, catálogos B2B y especificaciones técnicas oficiales de los Fabricantes de Equipo Original (OEM) citados. Su inclusión en este repositorio tiene fines exclusivos de investigación académica, modelación de TCO (Costo Total de Propiedad) y diseño de políticas públicas para el *Electro Hackathon CDMX 2026*.

---

## 2. Matriz Resumen de Vehículos Equivalentes de Gasolina

La siguiente tabla sintetiza las especificaciones técnicas de los vehículos con motor a gasolina analizados en el catálogo, junto con su equivalente 100% eléctrico (BEV) y su indicador de desempeño en ciclo urbano para CDMX:

| ID | Modelo (Vehículo de Gasolina) | Segmento | Motor / Cilindrada | Potencia (hp / kW) | Torque (Nm) | Plazas | Rendimiento CDMX (km/L) | Consumo (L/100km) | Emisiones CO₂ directas (g/km) | Modelo Eléctrico Equivalente (BEV) |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **GAS-01** | **Nissan NV350 Urvan Pasajeros (Vehículo de Gasolina)** | Van Colectiva | 2.5L 4L QR25DE | 142 hp / 106 kW | 213 Nm | 15 | 8.2 km/L | 12.2 L/100km | 285 g/km | JAC E Sunray / Foton e-View |
| **GAS-02** | **Toyota Hiace Pasajeros 3.5L V6 (Vehículo de Gasolina)** | Van Colectiva | 3.5L V6 7GR-FKS | 277 hp / 207 kW | 351 Nm | 14 | 7.5 km/L | 13.3 L/100km | 312 g/km | Maxus eDeliver 9 / JAC E Sunray |
| **GAS-03** | **Toyota Hiace Pasajeros 2.7L (Vehículo de Gasolina)** | Van Colectiva | 2.7L 4L 2TR-FE | 164 hp / 122 kW | 245 Nm | 14 | 8.0 km/L | 12.5 L/100km | 292 g/km | Foton e-View / Jinbei Haise EV |
| **GAS-04** | **Ford Transit Pasajeros 3.5L V6 (Vehículo de Gasolina)** | Van Alta Capacidad | 3.5L V6 PFDi | 275 hp / 205 kW | 355 Nm | 15 | 7.8 km/L | 12.8 L/100km | 300 g/km | Ford E-Transit (VAN-04) |
| **GAS-05** | **Foton View CS2 Pasajeros (Vehículo de Gasolina)** | Van Colectiva | 2.4L 4L 4G69S4N | 130 hp / 97 kW | 200 Nm | 16 | 9.0 km/L | 11.1 L/100km | 260 g/km | Foton e-View CS2 (VAN-02) |
| **GAS-06** | **King Long Kingo Pasajeros (Vehículo de Gasolina)** | Van Colectiva | 2.4L 4L 4RB2 | 139 hp / 104 kW | 217 Nm | 16 | 7.5 km/L | 13.3 L/100km | 312 g/km | King Long Kingo EV / Gree Minibús |
| **GAS-07** | **Joylong A6 Pasajeros Larga (Vehículo de Gasolina)** | Van Gran Capacidad | 2.4L 4L 4RB2 | 139 hp / 102 kW | 217 Nm | 20 | 8.5 km/L | 11.8 L/100km | 275 g/km | Joylong E6 (VAN-08) |
| **GAS-08** | **Jinbei Haise H2 Techo Alto (Vehículo de Gasolina)** | Van Colectiva | 2.2L 4L V19 | 106 hp / 78 kW | 180 Nm | 15 | 8.2 km/L | 12.2 L/100km | 285 g/km | Jinbei Haise EV (VAN-09) |
| **GAS-09** | **SAIC-GM-Wuling Rongguang (Vehículo de Gasolina)** | Micro-Van Capilar | 1.5L 4L L3C | 99 hp / 73 kW | 135 Nm | 11 | 13.5 km/L | 7.4 L/100km | 173 g/km | Wuling EV50 (VAN-10) |
| **GAS-10** | **DFSK C37 Minivan Pasajeros (Vehículo de Gasolina)** | Micro-Van Capilar | 1.5L 4L DK15 | 115 hp / 85 kW | 148 Nm | 11 | 12.8 km/L | 7.8 L/100km | 183 g/km | DFSK EC35 (VAN-11) |
| **GAS-11** | **Chevrolet Express Passenger 4.3L V6 (Vehículo de Gasolina)** | Van Pesada | 4.3L V6 EcoTec3 | 276 hp / 206 kW | 404 Nm | 15 | 6.8 km/L | 14.7 L/100km | 344 g/km | Maxus eDeliver 9 / MB eSprinter |
| **GAS-12** | **RAM ProMaster Pasajeros 3.6L V6 (Vehículo de Gasolina)** | Van Techo Alto | 3.6L V6 Pentastar | 280 hp / 209 kW | 352 Nm | 15 | 7.2 km/L | 13.9 L/100km | 325 g/km | Ford E-Transit / JAC E Sunray |
| **GAS-13** | **Chevrolet C3500 Coraza Tradicional (Vehículo de Gasolina)** | Microbús CDMX | 5.7L V8 350 / Vortec | 190 hp / 142 kW | 407 Nm | 28 | 3.5 km/L | 28.6 L/100km | 668 g/km | BYD K7 / Volare Access-E / Yutong E8 |
| **GAS-14** | **Dodge Ram Custom 3500 Colectivo (Vehículo de Gasolina)** | Microbús CDMX | 5.9L V8 Magnum 360 | 230 hp / 172 kW | 447 Nm | 28 | 3.3 km/L | 30.3 L/100km | 708 g/km | BYD K7 / Zhongtong 8m |
| **GAS-15** | **Ford F-350 Super Duty Chasis (Vehículo de Gasolina)** | Microbús CDMX | 5.4L V8 Triton | 260 hp / 194 kW | 475 Nm | 28 | 3.2 km/L | 31.3 L/100km | 730 g/km | Volare Access-E / King Long XMQ6850 |
| **GAS-16** | **JAC Sunray Pasajeros 2.0T (Vehículo de Gasolina)** | Van Colectiva | 2.0L 4L HFC4GA3 Turbo | 190 hp / 140 kW | 290 Nm | 17 | 8.0 km/L | 12.5 L/100km | 292 g/km | JAC E Sunray Eléctrica (VAN-01) |
| **GAS-17** | **Volkswagen Crafter Pasajeros 2.0 TSI (Vehículo de Gasolina)** | Van Gran Capacidad | 2.0L 4L EA888 TSI | 177 hp / 130 kW | 350 Nm | 16 | 8.2 km/L | 12.2 L/100km | 285 g/km | Maxus eDeliver 9 / MB eSprinter |
| **GAS-18** | **Maxus G10 Pasajeros 2.0T (Vehículo de Gasolina)** | Van Colectiva | 2.0L 4L 20L4E TGI Turbo | 224 hp / 165 kW | 345 Nm | 11 | 8.5 km/L | 11.8 L/100km | 275 g/km | Maxus eDeliver 9 / Peugeot e-Traveller |

---

## 3. Fichas Técnicas Detalladas y Citas Bibliográficas en Formato APA (7.ª Edición)

### A. Vanes y Comerciales Ligeros a Gasolina (Colectivos y Alimentadores de CDMX)

#### 1. **Nissan NV350 Urvan Pasajeros (Vehículo de Gasolina)**
* **Referencia APA (7.ª edición):**  
  Nissan Mexicana S.A. de C.V. (2026). *Nissan NV350 Urvan Pasajeros: Ficha técnica oficial, motorizaciones y capacidades comerciales*. Nissan México. Recuperado en octubre de 2026, de [https://www.nissan.com.mx/vehiculos/comerciales/urvan-pasajeros.html](https://www.nissan.com.mx/vehiculos/comerciales/urvan-pasajeros.html)
* **Especificaciones Técnicas de Ingeniería:**
  * **Motor y Cilindrada:** QR25DE, 2,488 cc (2.5 litros), 4 cilindros en línea, 16 válvulas DOHC, sistema CVTC (Control Variable de Apertura de Válvulas).
  * **Alimentación y Combustible:** Inyección electrónica secuencial multipunto; Gasolina regular (87 octanos mín.).
  * **Potencia Neta:** 142 hp (106 kW) @ 5,600 rpm.
  * **Torque Neto:** 213 Nm (157 lb-pie) @ 4,400 rpm.
  * **Transmisión:** Manual de 5 velocidades sincronizadas hacia adelante y reversa; tracción trasera (RWD).
  * **Capacidad de Pasajeros:** 14 a 15 plazas sentadas (versión comercial amplia).
  * **Tanque de Combustible:** 65 litros.
  * **Dimensiones (Largo × Ancho × Alto):** 5,230 mm × 1,880 mm × 2,285 mm; Distancia entre ejes: 2,940 mm.
  * **Consumo Urbano Estimado (CDMX):** 8.2 km/L (12.2 L/100km) en ciclo mixto con paradas frecuentes.
  * **Emisiones de Escape:** 285 g CO₂/km; Certificación NOM-042-SEMARNAT / EPA Tier 2.
  * **Equivalente BEV en el Proyecto:** JAC E Sunray (VAN-01) y Foton e-View CS2 (VAN-02).
  * **Relevancia Operativa en CDMX:** Es el modelo numéricamente más extendido en el transporte concesionado colectivo de la CDMX y Estado de México. Sustituye y complementa microbuses en zonas de calles estrechas y pendientes altas.

---

#### 2. **Toyota Hiace Pasajeros 3.5L V6 y 2.7L (Vehículo de Gasolina)**
* **Referencia APA (7.ª edición):**  
  Toyota Motor Sales de México, S. de R.L. de C.V. (2026). *Toyota Hiace Pasajeros: Especificaciones técnicas de tren motriz, dimensiones y seguridad*. Toyota México. Recuperado en octubre de 2026, de [https://www.toyota.mx/modelo/hiace](https://www.toyota.mx/modelo/hiace)
* **Especificaciones Técnicas de Ingeniería:**
  * **Motor y Cilindrada:** 
    * *Variante V6 (Generación actual H300):* 7GR-FKS, 3,456 cc (3.5 litros), V6 a 60°, 24 válvulas DOHC con VVT-iW y VVT-i dual.
    * *Variante 4L (Generación H200 tradicional):* 2TR-FE, 2,694 cc (2.7 litros), 4 cilindros en línea, 16 válvulas DOHC con VVT-i.
  * **Alimentación y Combustible:** Inyección mixta directa D-4S (en 3.5L) e inyección multipunto EFI; Gasolina regular.
  * **Potencia Neta:** 
    * 3.5L V6: 277 hp (207 kW) @ 6,000 rpm.
    * 2.7L 4L: 164 hp (122 kW) @ 5,200 rpm.
  * **Torque Neto:** 
    * 3.5L V6: 351 Nm (259 lb-pie) @ 4,600 rpm.
    * 2.7L 4L: 245 Nm (181 lb-pie) @ 4,000 rpm.
  * **Transmisión:** Manual de 6 velocidades o automática secuencial de 6 velocidades; tracción trasera (RWD).
  * **Capacidad de Pasajeros:** 13 a 14 plazas en configuración de pasajeros de fábrica (ampliada informalmente a 16 o 17 en rutas concesionadas).
  * **Tanque de Combustible:** 70 litros (H200) / 65 litros (H300).
  * **Dimensiones (Largo × Ancho × Alto):** 5,915 mm × 1,950 mm × 2,280 mm; Distancia entre ejes: 3,860 mm.
  * **Consumo Urbano Estimado (CDMX):** 7.5 km/L (13.3 L/100km) en versión V6; 8.0 km/L (12.5 L/100km) en versión 2.7L.
  * **Emisiones de Escape:** 312 g CO₂/km (V6) / 292 g CO₂/km (4L); Certificación Euro V / NOM-042.
  * **Equivalente BEV en el Proyecto:** Maxus eDeliver 9 (VAN-03) y JAC E Sunray (VAN-01).
  * **Relevancia Operativa en CDMX:** Es el referente de confiabilidad estructural y reventa en el gremio de transportistas concesionados; alta resistencia a la fatiga mecánica en topografía irregular.

---

#### 3. **Ford Transit Pasajeros 3.5L V6 (Vehículo de Gasolina)**
* **Referencia APA (7.ª edición):**  
  Ford Motor Company México. (2026). *Ford Transit Pasajeros Gasolina: Ficha de ingeniería comercial y tren motriz PFDi V6*. Ford Pro México. Recuperado en octubre de 2026, de [https://www.ford.mx/camiones/transit/pasajeros/](https://www.ford.mx/camiones/transit/pasajeros/)
* **Especificaciones Técnicas de Ingeniería:**
  * **Motor y Cilindrada:** 3.5L PFDi Duratec 35, 3,496 cc (3.5 litros), 6 cilindros en V, 24 válvulas DOHC, control Ti-VCT.
  * **Alimentación y Combustible:** Inyección Dual (inyección en puerto multipunto + inyección directa en cilindro); Gasolina regular.
  * **Potencia Neta:** 275 hp (205 kW) @ 6,250 rpm.
  * **Torque Neto:** 355 Nm (262 lb-pie) @ 4,000 rpm.
  * **Transmisión:** Automática SelectShift de 10 velocidades con selector de modo de arrastre y pendiente.
  * **Capacidad de Pasajeros:** 15 plazas homologadas de fábrica.
  * **Tanque de Combustible:** 95 litros (capacidad extendida para jornada completa sin recarga intermedia).
  * **Dimensiones (Largo × Ancho × Alto):** 5,982 mm × 2,059 mm × 2,530 mm (techo medio/alto).
  * **Consumo Urbano Estimado (CDMX):** 7.8 km/L (12.8 L/100km) en tráfico urbano denso.
  * **Emisiones de Escape:** 300 g CO₂/km; Certificación EPA Tier 3 / Euro VI.
  * **Equivalente BEV en el Proyecto:** Ford E-Transit Pasajeros (VAN-04) — Comparación directa sobre la misma plataforma y chasis de carrocería unificada.
  * **Relevancia Operativa en CDMX:** Utilizada comúnmente en rutas de empresas para transporte de personal corporativo y en ramales de transporte colectivo ejecutivo en calzadas primarias de CDMX (Calzada de Tlalpan, Insurgentes Sur).

---

#### 4. **Foton View CS2 Pasajeros 2.4L (Vehículo de Gasolina)**
* **Referencia APA (7.ª edición):**  
  Foton Motor México. (2026). *Foton View CS2 Pasajeros: Ficha técnica y catálogo de transporte colectivo*. Foton México División Comerciales. Recuperado en octubre de 2026, de [https://foton.mx/view-cs2/](https://foton.mx/view-cs2/)
* **Especificaciones Técnicas de Ingeniería:**
  * **Motor y Cilindrada:** Mitsubishi 4G69S4N, 2,378 cc (2.4 litros), 4 cilindros en línea, 16 válvulas SOHC con tecnología MIVEC.
  * **Alimentación y Combustible:** Inyección electrónica multipunto MPI; Gasolina regular.
  * **Potencia Neta:** 130 hp (97 kW) @ 5,250 rpm.
  * **Torque Neto:** 200 Nm @ 2,500 – 3,500 rpm.
  * **Transmisión:** Manual de 5 velocidades con palanca al tablero; tracción trasera (RWD).
  * **Capacidad de Pasajeros:** 16 plazas comerciales.
  * **Tanque de Combustible:** 65 litros.
  * **Dimensiones (Largo × Ancho × Alto):** 5,380 mm × 1,920 mm × 2,285 mm; Distancia entre ejes: 3,110 mm.
  * **Consumo Urbano Estimado (CDMX):** 9.0 km/L (11.1 L/100km).
  * **Emisiones de Escape:** 260 g CO₂/km; Certificación Euro V.
  * **Equivalente BEV en el Proyecto:** Foton e-View CS2 EV (VAN-02).
  * **Relevancia Operativa en CDMX:** Alternativa asiática de menor costo inicial a la Toyota Hiace, comercializada directamente en México con soporte de ensamble local.

---

#### 5. **King Long Kingo Pasajeros 2.4L (Vehículo de Gasolina)**
* **Referencia APA (7.ª edición):**  
  Xiamen King Long United Automotive Industry Co., Ltd. (2026). *King Long Kingo Passenger Van: Gasoline Powertrain Specification Sheet*. King Long Commercial Vehicles México. Recuperado en octubre de 2026, de [https://www.king-long.com/kingo-van](https://www.king-long.com/kingo-van)
* **Especificaciones Técnicas de Ingeniería:**
  * **Motor y Cilindrada:** XCE 4RB2 (derivado de plataforma Toyota 2RZ/3RZ), 2,438 cc (2.4 litros), 4 cilindros en línea, 16 válvulas DOHC.
  * **Alimentación y Combustible:** Inyección electrónica secuencial BOSCH; Gasolina regular.
  * **Potencia Neta:** 139 hp (104 kW) @ 4,800 rpm.
  * **Torque Neto:** 217 Nm @ 2,600 – 3,200 rpm.
  * **Transmisión:** Manual de 5 velocidades hacia adelante.
  * **Capacidad de Pasajeros:** 15 a 16 plazas comerciales.
  * **Tanque de Combustible:** 70 litros.
  * **Dimensiones (Largo × Ancho × Alto):** 5,470 mm × 1,880 mm × 2,285 mm.
  * **Consumo Urbano Estimado (CDMX):** 7.5 km/L (13.3 L/100km).
  * **Emisiones de Escape:** 312 g CO₂/km; Certificación Euro IV / Euro V.
  * **Equivalente BEV en el Proyecto:** Incluido expresamente en el código del simulador del proyecto (`kingo-gas` en `src/data/catalog.ts`) frente a `kingo-ev`.
  * **Relevancia Operativa en CDMX:** Unidad diseñada para competir de forma directa en el segmento de transporte colectivo concesionado con arquitectura modular tipo Hiace.

---

#### 6. **Joylong A6 Pasajeros Larga 2.4L (Vehículo de Gasolina)**
* **Referencia APA (7.ª edición):**  
  Jiangsu Joylong Automobile Co., Ltd. (2026). *Joylong A6 Commercial Passenger Minibus: Engine and Chassis Technical Parameters*. Joylong Automobile Global. Recuperado en octubre de 2026, de [http://www.joylong.cn/en/product-a6.html](http://www.joylong.cn/en/product-a6.html)
* **Especificaciones Técnicas de Ingeniería:**
  * **Motor y Cilindrada:** 4RB2 Gasolina, 2,438 cc (2.4 litros), 4 cilindros en línea, DOHC.
  * **Alimentación y Combustible:** Inyección electrónica multipunto; Gasolina regular.
  * **Potencia Neta:** 139 hp (102 kW) @ 4,600 – 5,000 rpm.
  * **Torque Neto:** 217 Nm @ 2,800 – 3,200 rpm.
  * **Transmisión:** Manual de 5 velocidades.
  * **Capacidad de Pasajeros:** 18 a 20 plazas (carrocería extendida de 6 metros).
  * **Tanque de Combustible:** 70 litros.
  * **Dimensiones (Largo × Ancho × Alto):** 5,990 mm × 1,880 mm × 2,285 mm; Distancia entre ejes: 3,720 mm.
  * **Consumo Urbano Estimado (CDMX):** 8.5 km/L (11.8 L/100km).
  * **Emisiones de Escape:** 275 g CO₂/km; Certificación Euro IV / Euro V.
  * **Equivalente BEV en el Proyecto:** Joylong E6 (VAN-08).
  * **Relevancia Operativa en CDMX:** Representa la capacidad máxima posible en una van comercial (hasta 20 plazas sentadas), sirviendo de puente directo entre la combi tradicional y el microbús corto.

---

#### 7. **Jinbei Haise H2 Techo Alto 2.2L (Vehículo de Gasolina)**
* **Referencia APA (7.ª edición):**  
  Renault-Brilliance Jinbei Automotive Co., Ltd. (2026). *Jinbei Haise H2 High-Roof Commercial Van: Technical Leaflet*. Jinbei Auto Global. Recuperado en octubre de 2026, de [https://www.jinbei.com/haise-h2/](https://www.jinbei.com/haise-h2/)
* **Especificaciones Técnicas de Ingeniería:**
  * **Motor y Cilindrada:** Xinchen Power V19, 2,237 cc (2.2 litros), 4 cilindros en línea, 8 válvulas SOHC.
  * **Alimentación y Combustible:** Inyección electrónica monopunto/multipunto BOSCH; Gasolina regular.
  * **Potencia Neta:** 106 hp (78 kW) @ 4,600 rpm.
  * **Torque Neto:** 180 Nm @ 2,400 – 2,800 rpm.
  * **Transmisión:** Manual de 5 velocidades.
  * **Capacidad de Pasajeros:** 15 plazas.
  * **Tanque de Combustible:** 65 litros.
  * **Dimensiones (Largo × Ancho × Alto):** 5,350 mm × 1,690 mm × 2,225 mm.
  * **Consumo Urbano Estimado (CDMX):** 8.2 km/L (12.2 L/100km).
  * **Emisiones de Escape:** 285 g CO₂/km; Certificación Euro IV.
  * **Equivalente BEV en el Proyecto:** Jinbei Haise EV (VAN-09).
  * **Relevancia Operativa en CDMX:** Clon mecánico histórico de la Toyota Hiace de cuarta generación (H100), con un costo operativo sumamente reducido y piezas intercambiables en mercado secundario.

---

#### 8. **SAIC-GM-Wuling Rongguang Pasajeros 1.5L (Vehículo de Gasolina)**
* **Referencia APA (7.ª edición):**  
  SAIC-GM-Wuling Automobile Co., Ltd. (2026). *Wuling Rongguang Standard and Extended Passenger Van: Powertrain & Emissions Data*. SGMW Global. Recuperado en octubre de 2026, de [https://www.wuling.com/rongguang.html](https://www.wuling.com/rongguang.html)
* **Especificaciones Técnicas de Ingeniería:**
  * **Motor y Cilindrada:** L3C / LAR, 1,485 cc (1.5 litros), 4 cilindros en línea, 16 válvulas DOHC con DVVT (Doble Apertura Variable de Válvulas).
  * **Alimentación y Combustible:** Inyección electrónica multipunto; Gasolina regular.
  * **Potencia Neta:** 99 hp (73 kW) @ 5,800 rpm.
  * **Torque Neto:** 135 Nm @ 3,600 – 4,000 rpm.
  * **Transmisión:** Manual de 5 velocidades; tracción trasera (RWD) con eje rígido y muelles.
  * **Capacidad de Pasajeros:** 9 a 11 plazas en configuración compacta.
  * **Tanque de Combustible:** 45 litros.
  * **Dimensiones (Largo × Ancho × Alto):** 4,490 mm × 1,615 mm × 1,900 mm; Distancia entre ejes: 3,050 mm.
  * **Consumo Urbano Estimado (CDMX):** 13.5 km/L (7.4 L/100km).
  * **Emisiones de Escape:** 173 g CO₂/km; Certificación Euro V / China V.
  * **Equivalente BEV en el Proyecto:** Wuling EV50 / Rongguang EV (VAN-10).
  * **Relevancia Operativa en CDMX:** Combi capilar de bajo consumo para colonias de alta pendiente y andadores donde un microbús de 8 metros o una van ancha de 2 metros no puede circular o girar.

---

#### 9. **DFSK C37 Minivan Pasajeros 1.5L (Vehículo de Gasolina)**
* **Referencia APA (7.ª edición):**  
  Dongfeng Sokon Motor Co., Ltd. (2026). *DFSK C37 Passenger Minivan: Specifications and Technical Guide*. DFSK Commercial Vehicles. Recuperado en octubre de 2026, de [https://www.dfsk.com/c37-minivan](https://www.dfsk.com/c37-minivan)
* **Especificaciones Técnicas de Ingeniería:**
  * **Motor y Cilindrada:** DK15-06, 1,498 cc (1.5 litros), 4 cilindros en línea, 16 válvulas DOHC con VVT.
  * **Alimentación y Combustible:** Inyección electrónica multipunto secuencial; Gasolina regular.
  * **Potencia Neta:** 115 hp (85 kW) @ 6,000 rpm.
  * **Torque Neto:** 148 Nm @ 2,800 – 3,600 rpm.
  * **Transmisión:** Manual de 5 velocidades.
  * **Capacidad de Pasajeros:** 11 plazas.
  * **Tanque de Combustible:** 55 litros.
  * **Dimensiones (Largo × Ancho × Alto):** 4,500 mm × 1,680 mm × 2,000 mm; Distancia entre ejes: 3,050 mm.
  * **Consumo Urbano Estimado (CDMX):** 12.8 km/L (7.8 L/100km).
  * **Emisiones de Escape:** 183 g CO₂/km; Certificación Euro V.
  * **Equivalente BEV en el Proyecto:** DFSK EC35 Pasajeros (VAN-11).
  * **Relevancia Operativa en CDMX:** Utilizada en circuitos barriales de corta distancia (recorridos menores a 6 km por ciclo) y enlace directo entre estaciones de Metro terminales y colonias periféricas.

---

#### 10. **Chevrolet Express Passenger Van 4.3L V6 (Vehículo de Gasolina)**
* **Referencia APA (7.ª edición):**  
  General Motors de México, S. de R.L. de C.V. (2026). *Chevrolet Express Pasajeros: Manual técnico de tren motriz EcoTec3 4.3L V6*. GM Fleet México. Recuperado en octubre de 2026, de [https://www.chevrolet.com.mx/flotillas/express-pasajeros](https://www.chevrolet.com.mx/flotillas/express-pasajeros)
* **Especificaciones Técnicas de Ingeniería:**
  * **Motor y Cilindrada:** 4.3L EcoTec3 LV1, 4,300 cc (4.3 litros), V6 a 90°, válvulas en culata (OHV) con bloque de aluminio y desactivación activa de cilindros.
  * **Alimentación y Combustible:** Inyección directa de gasolina (Direct Injection); Gasolina regular.
  * **Potencia Neta:** 276 hp (206 kW) @ 5,200 rpm.
  * **Torque Neto:** 404 Nm (298 lb-pie) @ 3,900 rpm.
  * **Transmisión:** Automática Hydra-Matic de 8 velocidades con modo de remolque.
  * **Capacidad de Pasajeros:** 12 a 15 plazas homologadas de uso rudo.
  * **Tanque de Combustible:** 117 litros.
  * **Dimensiones (Largo × Ancho × Alto):** 6,200 mm × 2,012 mm × 2,149 mm (chasis extendido 3500).
  * **Consumo Urbano Estimado (CDMX):** 6.8 km/L (14.7 L/100km).
  * **Emisiones de Escape:** 344 g CO₂/km; Certificación EPA Tier 3 / NOM-042.
  * **Equivalente BEV en el Proyecto:** Maxus eDeliver 9 (VAN-03) y Mercedes-Benz eSprinter (VAN-06).
  * **Relevancia Operativa en CDMX:** Histórico modelo de transporte colectivo concesionado y privado en vialidades de alta afluencia; robusto chasis de largueros independientes tipo camión.

---

#### 11. **RAM ProMaster Pasajeros 3.6L Pentastar V6 (Vehículo de Gasolina)**
* **Referencia APA (7.ª edición):**  
  Stellantis México, S.A. de C.V. (2026). *RAM ProMaster Pasajeros y Ventanas: Guía de especificaciones de tren motriz Pentastar V6*. RAM Commercial México. Recuperado en octubre de 2026, de [https://www.ram.com.mx/promaster/](https://www.ram.com.mx/promaster/)
* **Especificaciones Técnicas de Ingeniería:**
  * **Motor y Cilindrada:** Pentastar V6 3.6L, 3,604 cc (3.6 litros), V6 a 60°, 24 válvulas DOHC con VVT dual.
  * **Alimentación y Combustible:** Inyección electrónica multipunto secuencial; Gasolina regular.
  * **Potencia Neta:** 280 hp (209 kW) @ 6,400 rpm.
  * **Torque Neto:** 352 Nm (260 lb-pie) @ 4,400 rpm.
  * **Transmisión:** Automática TorqueFlite de 9 velocidades; tracción delantera (FWD) con piso de carga plano y bajo.
  * **Capacidad de Pasajeros:** 15 plazas.
  * **Tanque de Combustible:** 90 litros.
  * **Dimensiones (Largo × Ancho × Alto):** 5,998 mm × 2,050 mm × 2,525 mm.
  * **Consumo Urbano Estimado (CDMX):** 7.2 km/L (13.9 L/100km).
  * **Emisiones de Escape:** 325 g CO₂/km; Certificación Euro VI / EPA Tier 2.
  * **Equivalente BEV en el Proyecto:** Ford E-Transit (VAN-04) y JAC E Sunray (VAN-01).
  * **Relevancia Operativa en CDMX:** La configuración de tracción delantera le otorga una de las alturas de piso más bajas del segmento, facilitando el ascenso y descenso de usuarios sin requerir estribos elevados.

---

### B. Microbuses Tradicionales Concesionados de CDMX (Vehículos de Gasolina y Bi-combustible Gas LP)

#### 12. **Chevrolet C3500 Coraza / Microbús Tradicional CDMX (Vehículo de Gasolina / Gas LP)**
* **Referencia APA (7.ª edición):**  
  General Motors de México, S. de R.L. de C.V. (1998/2026). *Chasis Comercial Cabina Chevrolet C35 / C3500: Manual de servicio, tren motriz Small Block 350 / Vortec 5.7L y aplicaciones para transporte colectivo urbano*. Archivo Técnico Histórico General Motors México. Cita y consulta en octubre de 2026.
* **Especificaciones Técnicas de Ingeniería:**
  * **Motor y Cilindrada:** Chevrolet Small Block 350 / Vortec 5700 (L31), 5,733 cc (5.7 litros), 8 cilindros en V a 90°, 16 válvulas en culata (OHV), bloque y cabezas de hierro colado.
  * **Alimentación y Combustible:** Carburador Rochester Quadrajet de 4 gargantas (modelos anteriores a 1993) o Inyección TBI/Vortec secuencial (modelos 1993–2000); Gasolina regular con adaptación típica de carburador/mezclador a Gas Licuado de Petróleo (Gas LP).
  * **Potencia Neta:** 190 a 210 hp (142 a 157 kW) @ 4,000 – 4,400 rpm.
  * **Torque Neto:** 407 Nm (300 – 325 lb-pie) @ 2,400 – 2,800 rpm.
  * **Transmisión:** Manual de 4 o 5 velocidades (SM465 / NV4500) con embrague de servicio pesado; tracción trasera (RWD) con eje dual trasero (Dually).
  * **Capacidad de Pasajeros:** 23 a 28 asientos según carrocería (CATOSA, Casabus, Rekis, San Roberto), con sobrecupo de hasta 40 pasajeros en horas pico.
  * **Tanque de Combustible:** Tanque original de gasolina de 95 a 120 litros (o tanque cilíndrico de Gas LP de 180 a 240 litros bajo chasis).
  * **Peso Bruto Vehicular (PBV):** 5,500 a 6,500 kg (con carrocería y pasaje completo).
  * **Consumo Urbano Estimado (CDMX):** 3.5 km/L de gasolina (28.6 L/100km) en ciclo real urbano con topes, pendientes y arranque continuo; ~2.8 a 3.0 km/L equivalente en Gas LP.
  * **Emisiones de Escape:** 668 g CO₂/km en gasolina (además de elevadas emisiones de hidrocarburos no quemados HC y monóxido de carbono CO debido a desgaste mecánico acumulado y falta de catalizadores funcionales).
  * **Equivalente BEV en el Proyecto:** BYD K7 / B8 (MIDI-02), Volare Access-E (MIDI-01) y Yutong E8 (MIDI-03).
  * **Relevancia Operativa en CDMX:** Es el microbús paradigmático que dominó el programa «Ruta 100 ➔ Transporte Concesionado» a partir de 1989–1995. Corresponde al material rodante original que las políticas de chatarrización de la SEMOVI buscan sustituir por autobuses y midibuses eléctricos o de bajas emisiones.

---

#### 13. **Dodge Ram Custom 3500 Colectivo CDMX (Vehículo de Gasolina / Gas LP)**
* **Referencia APA (7.ª edición):**  
  Chrysler de México, S.A. (1996/2026). *Chasis Ram Custom 3500 y Ram Van 350: Especificaciones de ingeniería, motor Magnum 360 5.9L V8 y aplicaciones de transporte público concesionado*. Archivo Histórico Chrysler México / Stellantis. Cita y consulta en octubre de 2026.
* **Especificaciones Técnicas de Ingeniería:**
  * **Motor y Cilindrada:** Chrysler Magnum 360 (5.9L), 5,895 cc (5.9 litros), 8 cilindros en V, 16 válvulas OHV.
  * **Alimentación y Combustible:** Inyección electrónica multipunto secuencial (SMPI); Gasolina regular y conversión a Gas LP.
  * **Potencia Neta:** 230 hp (172 kW) @ 4,400 rpm.
  * **Torque Neto:** 447 Nm (330 lb-pie) @ 3,200 rpm.
  * **Transmisión:** Manual New Process de 5 velocidades o automática HD 47RE; tracción trasera con eje rígido Dana 70 o 80.
  * **Capacidad de Pasajeros:** 25 a 28 plazas sentadas en carrocería de microbús.
  * **Consumo Urbano Estimado (CDMX):** 3.3 km/L (30.3 L/100km) en gasolina; 2.6 km/L en Gas LP.
  * **Emisiones de Escape:** 708 g CO₂/km en gasolina; sin certificación ambiental moderna (Norma NOM-041/042 previa a Euro III).
  * **Equivalente BEV en el Proyecto:** BYD K7 (MIDI-02) y Zhongtong 8m (MIDI-04).
  * **Relevancia Operativa en CDMX:** Segundo chasis en volumen del programa de microbuses en CDMX durante los años 90 y principios de 2000, conocido por su gran capacidad de ascenso en pendientes pero alto consumo volumétrico de combustible.

---

#### 14. **Ford F-350 / F-450 Super Duty Chasis Colectivo CDMX (Vehículo de Gasolina)**
* **Referencia APA (7.ª edición):**  
  Ford Motor Company México. (2004/2026). *Chasis Cabina Ford F-350 y F-450 Super Duty: Especificaciones para carrozado de pasaje urbano y motorización Triton 5.4L V8*. Archivo Histórico Ford Pro México. Cita y consulta en octubre de 2026.
* **Especificaciones Técnicas de Ingeniería:**
  * **Motor y Cilindrada:** Ford Triton 5.4L Modular V8, 5,408 cc (5.4 litros), 8 cilindros en V, 16 a 24 válvulas SOHC.
  * **Alimentación y Combustible:** Inyección electrónica secuencial EFI; Gasolina regular.
  * **Potencia Neta:** 260 hp (194 kW) @ 4,500 rpm.
  * **Torque Neto:** 475 Nm (350 lb-pie) @ 2,500 rpm.
  * **Transmisión:** Manual ZF de 5/6 velocidades o automática TorqShift de 5 velocidades.
  * **Capacidad de Pasajeros:** 26 a 28 plazas sentadas.
  * **Consumo Urbano Estimado (CDMX):** 3.2 km/L (31.3 L/100km).
  * **Emisiones de Escape:** 730 g CO₂/km en gasolina.
  * **Equivalente BEV en el Proyecto:** Volare Access-E (MIDI-01) y King Long XMQ6850 (MIDI-06).
  * **Relevancia Operativa en CDMX:** Utilizado extensamente en zonas montañosas y de ladera en Cuajimalpa, Tlalpan y Magdalena Contreras debido a la solidez de sus ejes delanteros rígidos Dana 60 Monobeam.

---

#### 15. **JAC Sunray Pasajeros 2.0T (Vehículo de Gasolina)**
* **Referencia APA (7.ª edición):**  
  Anhui Jianghuai Automobile Group Corp., Ltd. (2026). *JAC Sunray Commercial Passenger Van: Technical Specification Sheet & Gasoline Turbo Powertrain*. JAC Motors International. Recuperado en octubre de 2026, de [https://www.jac.com.cn/](https://www.jac.com.cn/)
* **Especificaciones Técnicas de Ingeniería:**
  * **Motor y Cilindrada:** HFC4GA3-3D Turbo, 1,997 cc (2.0 litros), 4 cilindros en línea, 16 válvulas DOHC con turbocompresor e intercooler.
  * **Alimentación y Combustible:** Inyección electrónica secuencial multipunto con sobrealimentación turbo; Gasolina regular.
  * **Potencia Neta:** 190 hp (140 kW) @ 5,200 rpm.
  * **Torque Neto:** 290 Nm @ 1,800 – 4,000 rpm.
  * **Transmisión:** Manual LC6T32 de 6 velocidades; tracción trasera (RWD).
  * **Capacidad de Pasajeros:** 17 plazas.
  * **Tanque de Combustible:** 80 litros.
  * **Consumo Urbano Estimado (CDMX):** 8.0 km/L (12.5 L/100km).
  * **Emisiones de Escape:** 292 g CO₂/km; Certificación Euro V.
  * **Equivalente BEV en el Proyecto:** JAC E Sunray Eléctrica (VAN-01) — Comparación directa sobre la misma plataforma y carrocería de 5.99 m.
  * **Relevancia Operativa en CDMX:** Homólogo directo a gasolina en la misma línea de ensamble de Giant Motors en Ciudad Sahagún / México.

---

#### 16. **Volkswagen Crafter Pasajeros 2.0 TSI (Vehículo de Gasolina)**
* **Referencia APA (7.ª edición):**  
  Volkswagen Vehículos Comerciales México. (2026). *Volkswagen Crafter Pasajeros y Chasis: Datos técnicos de ingeniería y motorizaciones comerciales*. Volkswagen de México. Recuperado en octubre de 2026, de [https://www.vwcomerciales.com.mx/crafter](https://www.vwcomerciales.com.mx/crafter)
* **Especificaciones Técnicas de Ingeniería:**
  * **Motor y Cilindrada:** EA888 2.0 TSI, 1,984 cc (2.0 litros), 4 cilindros en línea, 16 válvulas DOHC, turboalimentado con inyección directa TSI.
  * **Alimentación y Combustible:** Inyección directa estratificada TSI; Gasolina regular / Premium.
  * **Potencia Neta:** 177 hp (130 kW) @ 5,000 rpm.
  * **Torque Neto:** 350 Nm @ 1,500 – 3,500 rpm.
  * **Transmisión:** Automática de 8 velocidades con convertidor de par o manual de 6 velocidades.
  * **Capacidad de Pasajeros:** 16 plazas en configuración de transporte colectivo intermedio.
  * **Tanque de Combustible:** 75 litros.
  * **Consumo Urbano Estimado (CDMX):** 8.2 km/L (12.2 L/100km).
  * **Emisiones de Escape:** 285 g CO₂/km; Certificación Euro 6d.
  * **Equivalente BEV en el Proyecto:** Maxus eDeliver 9 (VAN-03) y Mercedes-Benz eSprinter (VAN-06).
  * **Relevancia Operativa en CDMX:** Van europea de alta rigidez torsional y sistemas avanzados de asistencia a la conducción para transporte metropolitano.

---

#### 17. **Maxus G10 Pasajeros 2.0T (Vehículo de Gasolina)**
* **Referencia APA (7.ª edición):**  
  SAIC Maxus Automotive Co., Ltd. (2026). *Maxus G10 Commercial MPV and Passenger Van: Engine Technical Parameters*. SAIC Motor Global. Recuperado en octubre de 2026, de [https://www.saicmaxus.com/](https://www.saicmaxus.com/)
* **Especificaciones Técnicas de Ingeniería:**
  * **Motor y Cilindrada:** SAIC 20L4E TGI, 1,995 cc (2.0 litros), 4 cilindros en línea, 16 válvulas DOHC, turbocargado con inyección directa TGI.
  * **Alimentación y Combustible:** Inyección directa de gasolina TGI con doble árbol de levas variable; Gasolina regular.
  * **Potencia Neta:** 224 hp (165 kW) @ 5,500 rpm.
  * **Torque Neto:** 345 Nm @ 2,000 – 4,000 rpm.
  * **Transmisión:** Automática ZF de 6 velocidades; tracción trasera (RWD).
  * **Capacidad de Pasajeros:** 11 plazas.
  * **Tanque de Combustible:** 75 litros.
  * **Consumo Urbano Estimado (CDMX):** 8.5 km/L (11.8 L/100km).
  * **Emisiones de Escape:** 275 g CO₂/km; Certificación Euro V / Euro VI.
  * **Equivalente BEV en el Proyecto:** Maxus eDeliver 9 (VAN-03) y Peugeot e-Traveller (VAN-07).
  * **Relevancia Operativa en CDMX:** Servicio colectivo ejecutivo, circuitos de salud/hospitalarios y traslados de personal programados.

---

## 4. Comparativa Energética, Ambiental y Económica: Gasolina vs. Electrificación

El contraste técnico entre la operación con vehículos a gasolina y su transición a unidades 100% eléctricas a batería (BEV) arroja los siguientes principios termodinámicos y financieros:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   BALANCE ENERGÉTICO EN CICLO URBANO CDMX                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  VAN A GASOLINA (Urvan / Hiace)                                             │
│  Consumo: 12.5 L gasolina / 100 km                                          │
│  Contenido energético térmico: 12.5 L × 8.9 kWh/L = 111.25 kWh / 100 km     │
│  Eficiencia del ciclo Otto en ciudad: ~18% (pérdidas por calor, ralentí)    │
│  Energía útil a la rueda: ~20.0 kWh / 100 km                                │
│                                                                             │
│  VAN 100% ELÉCTRICA (JAC E Sunray / e-Transit)                              │
│  Consumo de batería: 22.0 – 28.0 kWh / 100 km                               │
│  Eficiencia motriz + regeneración: ~85%                                     │
│  Ahorro neto de energía primaria: > 75% de reducción energética             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1. Costo Operativo por Kilómetro (OPEX Energético)
* **Gasolina Regular (Magna a $23.68 MXN/L):**
  * Para una van colectiva (8.0 km/L): **$2.96 MXN por kilómetro**.
  * Para un microbús tradicional (3.5 km/L): **$6.77 MXN por kilómetro**.
* **Electricidad (Tarifa CFE Comercial / Media Tensión GDMTO a ~$2.50 – $3.80 MXN/kWh):**
  * Para una van eléctrica (0.27 kWh/km): **$0.81 – $1.02 MXN por kilómetro** (~65% a 72% de ahorro en gasto de energía).
  * Para un midibús eléctrico (0.60 kWh/km): **$1.80 – $2.28 MXN por kilómetro** (~66% a 73% de ahorro frente al microbús de gasolina).

### 2. Emisiones Locales y Salud Pública
* **Gases de Efecto Invernadero (GEI):** Un microbús a gasolina de 5.7L emite más de **660 g CO₂/km**, mientras que un midibús eléctrico emite **0 g CO₂/km directos en tubo de escape** (y reduce las emisiones de ciclo de vida en más de un 60% considerando el factor de emisión de la red eléctrica mexicana de 0.444 kg CO₂/kWh).
* **Contaminantes Criterio:** Los motores a gasolina en rutas con más de 15 años de antigüedad carecen de convertidores catalíticos de tres vías eficientes, liberando altas concentraciones de monóxido de carbono (CO), óxidos de nitrógeno (NOx) e hidrocarburos volátiles (COVs) directamente a nivel de banqueta en zonas de alta exposición humana como la Zona de Hospitales en San Fernando (Ruta 1).

---

## 5. Clasificación de la Evidencia según la Metodología del Proyecto

En concordancia con la escala de trazabilidad **A–F** definida en [`docs/investigacion/ruta1/metodologia-ruta1.md`](../investigacion/ruta1/metodologia-ruta1.md):

* **Nivel D (Oficial / Catálogos Comerciales Nacionales e Internacionales):**
  * Especificaciones de cilindrada, potencia máxima (hp/kW), torque neto (Nm), tipo de inyección, número de plazas comerciales, dimensiones exteriores y capacidad de tanque de combustible obtenidas de manuales y fichas técnicas de los fabricantes (Nissan, Toyota, Ford, GM, Chrysler, Foton, King Long, Joylong, DFSK, SGMW).
* **Nivel F (Derivado / Modelación Exploratoria):**
  * Rendimientos en ciclo urbano para la Ciudad de México (km/L y L/100km): Calculados considerando un factor de castigo del 25% al 35% respecto a los rendimientos ideales de laboratorio para reflejar las condiciones reales de CDMX (altitud de 2,240 msnm, paradas continuas por ascenso/descenso, topes y velocidad comercial promedio de 14 km/h).
  * Emisiones específicas de CO₂ directas (g/km): Derivadas estequiométricamente sobre la base de 2,338 gramos de CO₂ emitidos por cada litro de gasolina consumido.

---

## 6. Documentos Vinculados

* **Fichas técnicas de modelos eléctricos:** [`docs/contexto/fichas-tecnicas-vehiculos.md`](fichas-tecnicas-vehiculos.md).
* **Dataset dedicado de vehículos de gasolina (CSV):** [`docs/investigacion/modelos/catalogo-vehiculos-gasolina.csv`](../investigacion/modelos/catalogo-vehiculos-gasolina.csv).
* **Dataset maestro de vehículos EV vs. ICE (CSV):** [`docs/investigacion/modelos/catalogo-vehiculos-electricos-combustion.csv`](../investigacion/modelos/catalogo-vehiculos-electricos-combustion.csv).
* **Expediente de ingeniería y análisis de equivalencias:** [`docs/investigacion/modelos/README.md`](../investigacion/modelos/README.md).
* **Expediente técnico de Ruta 1 (Metro CU – San Fernando):** [`docs/investigacion/ruta1/evaluacion-viabilidad-ruta1.md`](../investigacion/ruta1/evaluacion-viabilidad-ruta1.md).
