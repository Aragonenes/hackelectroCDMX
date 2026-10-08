import {
  DynamicScenarioSchema,
  type Scenario,
  type DynamicScenario,
  type Source,
} from "../domain/schema";
import prepared from "./journey-route.json";
import climate from "./journey-climate.json";
import vehicles from "./journey-vehicles.json";
import { assumed } from "./catalog";
export const journeyVehicles = vehicles;
export const dayNames = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];
export const journeySources: Source[] = [
  {
    id: "J-CEM",
    title: "INEGI CEM 4.0 · terreno de 15 m",
    url: "https://www.inegi.org.mx/app/geo2/elevacionesmex/",
    date: "Consulta 2026-10-08",
    scope: "B · terreno CDMX, derivación sobre ramal histórico",
    license: "INEGI libre uso con reconocimiento de fuente; derivación propia",
    limitation:
      "Muestreo a 50 m, bilineal y media móvil de 5 muestras. Terreno, no rasante medida. Hash en perfil preparado.",
  },
  {
    id: "J-MET",
    title: "SIMAT REDMET · Pedregal TMP horario 2023",
    url: "https://aire.cdmx.gob.mx/descargas/Opendata/anuales_horarios/meteorologia_2023.csv",
    date: "2023; consulta 2026-10-08",
    scope: "B · estación PED, entorno del ramal",
    license: "Referencia oficial; original no redistribuido",
    limitation:
      climate.coverage +
      " Temperatura ambiente, no batería; no determina pavimento.",
  },
  {
    id: "J-EOD",
    title: "INEGI EOD 2017 · metodología",
    url: "https://www.inegi.org.mx/rnm/index.php/catalog/533/related-materials",
    date: "2017; consulta 2026-10-08",
    scope: "C · metropolitana histórica",
    license: "Referencia INEGI",
    limitation:
      "Martes, miércoles o jueves y sábado; no aforos del ramal. Perfiles iniciales F diseñados.",
  },
  {
    id: "J-SCHEDULE",
    title: "Moovit · horario secundario Ruta 1",
    url: "https://appassets.mvtdev.com/map/188/l/822/336644108.pdf",
    date: "Consulta 2026-10-08; sin fecha de levantamiento",
    scope: "Ramal; referencia secundaria",
    license: "Derechos reservados; no PDF incorporado",
    limitation:
      "05:00–22:50 laborables, 06:00–21:45 fin de semana; no servicio actual acreditado.",
  },
  {
    id: "J-AUDIT",
    title: "Auditoría de 33 propuestas de vehículos",
    url: "https://github.com/Aragonenes/hackelectroCDMX/blob/main/docs/investigacion/Variables_Factores/auditoria-jornada.md",
    date: "2026-10-08",
    scope: "F · supuestos editables por parámetro",
    license: "CC BY 4.0 trabajo propio",
    limitation:
      "Variante, tara, plazas, HVAC y consumo no acreditados. Precio, conector y carga desconocidos.",
  },
];
/** Conversión explícita posterior a lectura/checksum v1; conserva sus entradas financieras. */
export function convertToDynamic(s: Scenario): DynamicScenario {
  if (s.schemaVersion === "2") return s;
  if (s.route.id !== prepared.routeId)
    throw new Error(
      "El perfil dinámico preparado corresponde a Metro CU–San Fernando–Huipulco. Selecciona ese ramal.",
    );
  const categoryMass = { van: 2800, minibus: 8000, urban: 13000 };
  const j = {
    selectedDay: 0,
    season: "calida" as const,
    vehicleId: s.ev.id,
    purchasePrice: s.ev.price,
    chargePowerConfirmed: true,
    conditions: {
      temperatureOffsetC: 0,
      wet: false,
      hvac: true,
      congestion: 1,
      elevationScale: 1,
    },
    technical: {
      massKg: categoryMass[s.ev.category],
      passengerKg: 75,
      baseOccupancy: 0.5,
      referenceTemperatureC: 20,
      auxiliaryKw: 0.4,
      hvacKwPerC: 0.08,
      hvacDeadbandC: 3,
      rollingCoefficient: 0.009,
      wetRollingIncrease: 0.1,
      driveEfficiency: 0.9,
      regenEfficiency: 0.6,
      regenMaxKw: 30,
    },
    chargeStartMinute: 21 * 60,
    days: dayNames.map((name, i) => ({
      name,
      mixDays: [4, 4, 4, 4, 4, 4, 2][i]!,
      startMinute: i < 5 ? 360 : 420,
      pauseMinutes: 0,
      boardingsFactor: i < 5 ? 1 : i === 5 ? 0.85 : 0.7,
      slots: Array.from({ length: 96 }, (_, slot) => {
        const hour = slot / 4;
        const peak =
          i < 5
            ? Math.exp(-(((hour - 8) / 1.5) ** 2)) +
              Math.exp(-(((hour - 18) / 2) ** 2))
            : Math.exp(-(((hour - 13) / 3) ** 2));
        return {
          weight: 0.2 + peak,
          occupancy: 0.25 + peak * 0.4,
          durationFactor: 0.85 + peak * 0.5,
        };
      }),
    })),
    sectors: [1, 0.8, 1.1, 0.9, 1.1, 0.8].map((occupancyFactor) => ({
      occupancyFactor,
      durationFactor: 1,
    })),
    climate: structuredClone(climate),
    prepared: structuredClone(prepared),
    evidence: Object.fromEntries(
      [
        "technical",
        "profiles",
        "sectors",
        "conditions",
        "chargeStartMinute",
      ].map((k) => [
        k,
        {
          sourceId: "J-AUDIT",
          status: "supuesto" as "supuesto" | "derivado",
          limitation:
            "Parámetro F editable; no aforo, oferta ni calibración por vehículo.",
        },
      ]),
    ),
  };
  let remaining = s.operation.days;
  j.days.forEach((day, i) => {
    day.mixDays =
      Math.floor(s.operation.days / 7) + (i < s.operation.days % 7 ? 1 : 0);
    remaining -= day.mixDays;
  });
  void remaining;
  j.evidence.prepared = {
    sourceId: "J-CEM",
    status: "derivado",
    limitation: prepared.smoothing,
  };
  j.evidence.climate = {
    sourceId: "J-MET",
    status: "derivado",
    limitation: climate.coverage,
  };
  return DynamicScenarioSchema.parse({
    ...structuredClone(s),
    schemaVersion: "2",
    modelVersion: "2.0.0",
    journey: j,
    catalog: {
      ...s.catalog,
      sources: [...s.catalog.sources, ...journeySources],
    },
  });
}
export function selectJourneyVehicle(
  s: DynamicScenario,
  id: string,
): DynamicScenario {
  const record = journeyVehicles.find((v) => v.id === id);
  if (!record) {
    const ev = s.catalog.vehicles.find(
      (v) => v.id === id && v.fuel === "electricidad",
    );
    if (!ev) return s;
    return {
      ...s,
      ev: structuredClone(ev),
      journey: {
        ...s.journey,
        vehicleId: id,
        purchasePrice: ev.price,
        chargePowerConfirmed: true,
        technical: {
          ...s.journey.technical,
          massKg: { van: 2800, minibus: 8000, urban: 13000 }[ev.category],
        },
      },
    };
  }
  const p = record.parameters;
  const ev = {
    ...s.ev,
    id: record.id,
    name: record.name + " · variante supuesta",
    category: record.category as DynamicScenario["ev"]["category"],
    batteryKwh: p.batteryKwh.value,
    capacity: p.capacity.value,
    advertisedCapacity: p.capacity.value,
    consumption: p.consumption.value,
    price: 0,
    maxChargeKw: s.ev.maxChargeKw,
    connector: "unknown" as const,
    includedChargerKw: 0,
    evidence: Object.fromEntries(
      Object.keys(s.ev.evidence).map((k) => [
        k,
        assumed(
          "Propuesta F del catálogo de jornada; variante y prueba no acreditadas.",
        ),
      ]),
    ),
  };
  return {
    ...s,
    ev,
    journey: {
      ...s.journey,
      vehicleId: id,
      purchasePrice: null,
      chargePowerConfirmed: false,
      technical: { ...s.journey.technical, massKg: p.massKg.value },
    },
  };
}
