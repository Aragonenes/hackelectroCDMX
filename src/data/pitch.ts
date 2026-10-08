import { defaultScenario } from "./defaults";
import { convertToDynamic, journeyVehicles } from "./journey";
import { assumed } from "./catalog";
import {
  DynamicScenarioSchema,
  type Scenario,
  type Vehicle,
} from "../domain/schema";

export const PITCH_SOURCE = "F-PITCH";
const pitchEvidence = (limitation: string) => ({
  ...assumed(limitation),
  sourceId: PITCH_SOURCE,
  date: "2026-10-08",
  scope: "Demo del pitch · Ruta 1",
});

export const isPitchScenario = (s: Scenario) =>
  s.schemaVersion === "2" &&
  s.journey.evidence.pitch?.sourceId === PITCH_SOURCE;

/** Entradas F completas para presentar el prototipo; no ofertas ni datos operativos. */
export function createPitchScenario() {
  const s = convertToDynamic(defaultScenario());
  const evidence = pitchEvidence(
    "Entrada ilustrativa para la demo; editable y sin validación del ramal.",
  );
  s.operation = {
    ...s.operation,
    cycleMinutes: 75,
    serviceHours: 14,
    boardings: 420,
  };
  s.energy = { ...s.energy, chargeHours: 10, siteKw: 90 };
  s.economy = { ...s.economy, ownCapital: 1_500_000, support: 0 };
  s.charger = structuredClone(s.catalog.chargers.find((c) => c.id === "ac22")!);
  s.ev = {
    ...s.ev,
    maxChargeKw: 30,
    evidence: { ...s.ev.evidence, maxChargeKw: evidence },
  };
  s.journey.chargeStartMinute = 20 * 60;
  s.journey.days = s.journey.days.map((d) => ({ ...d, pauseMinutes: 5 }));
  s.journey.evidence.pitch = {
    sourceId: PITCH_SOURCE,
    status: "supuesto",
    limitation:
      "Demo con una condición calculada por resolver: energía y reserva. Conserva comprobaciones externas pendientes.",
  };
  s.journey.evidence.chargeStartMinute = {
    sourceId: PITCH_SOURCE,
    status: "supuesto",
    limitation: "Carga de patio a las 20:00, propuesta para la demo.",
  };
  for (const path of [
    "operation.cycleMinutes",
    "operation.serviceHours",
    "operation.boardings",
    "energy.chargeHours",
    "energy.siteKw",
    "economy.ownCapital",
    "economy.support",
  ])
    s.evidence[path] = { ...evidence };

  const pricing = {
    van: {
      base: 950_000,
      perKwh: 8500,
      maxChargeKw: 30,
      maintenance: 1,
      insurance: 1800,
      length: 5.9,
    },
    minibus: {
      base: 1_800_000,
      perKwh: 9500,
      maxChargeKw: 90,
      maintenance: 1.5,
      insurance: 2800,
      length: 8,
    },
    urban: {
      base: 3_000_000,
      perKwh: 10_000,
      maxChargeKw: 180,
      maintenance: 2.5,
      insurance: 4500,
      length: 12,
    },
  };
  const vehicles: Vehicle[] = journeyVehicles.map((record) => {
    const category = record.category as Vehicle["category"];
    const cost = pricing[category],
      p = record.parameters;
    const price =
      Math.round((cost.base + p.batteryKwh.value * cost.perKwh) / 10_000) *
      10_000;
    return {
      id: record.id,
      name: record.name,
      category,
      fuel: "electricidad",
      capacity: p.capacity.value,
      advertisedCapacity: p.capacity.value,
      batteryKwh: p.batteryKwh.value,
      consumption: p.consumption.value,
      price,
      maxChargeKw: cost.maxChargeKw,
      connector: "unknown",
      includedChargerKw: 0,
      maintenancePerKm: cost.maintenance,
      insuranceMonth: cost.insurance,
      lengthM: cost.length,
      evidence: Object.fromEntries(
        Object.keys(s.ev.evidence).map((key) => [
          key,
          pitchEvidence(
            [
              "capacity",
              "advertisedCapacity",
              "batteryKwh",
              "consumption",
            ].includes(key)
              ? "Propuesta F del catálogo documental de 33 modelos; variante y condiciones no verificadas."
              : "Precio, potencia o costo F preparado para el pitch; no cotización comercial.",
          ),
        ]),
      ),
    };
  });
  s.catalog.vehicles = [
    ...s.catalog.vehicles.map((v) => (v.id === s.ev.id ? s.ev : v)),
    ...vehicles,
  ];
  s.catalog.sources.push({
    id: PITCH_SOURCE,
    title: "Demo del pitch · catálogo y entradas F de Ruta 1",
    url: "https://github.com/Aragonenes/hackelectroCDMX/blob/main/docs/desarrollo/demo-pitch.md",
    date: "2026-10-08",
    scope: "F · prototipo de presentación",
    license: "MIT código / CC BY 4.0 documentación propia",
    limitation:
      "33 modelos del expediente; precios, potencia, costos y operación ilustrativos. No ofertas ni viabilidad acreditada.",
  });
  return DynamicScenarioSchema.parse(s);
}
