import type { Result } from "./schema";
import { energyBudget } from "./explore";
export type EnvironmentalScope = "unit" | "fleet";
export type EnvironmentalPeriod = "day" | "month" | "year";
/** Transformaciones de resultados diarios, sin cambiar factores ni simular degradación. */
export function environmentalView(
  r: Result,
  scope: EnvironmentalScope,
  period: EnvironmentalPeriod,
) {
  const units = scope === "fleet" ? r.scenario.operation.fleet : 1;
  const days =
    period === "day"
      ? 1
      : r.scenario.operation.days * (period === "year" ? 12 : 1);
  const scale = units * days;
  const energy = energyBudget(r);
  const factor = r.scenario.energy.gridFactor;
  const dynamicMonth = r.dynamic && period !== "day" ? r.dynamic.monthly : null;
  const monthScale = units * (period === "year" ? 12 : 1);
  const parts = [
    {
      label: "Energía para servicio",
      kwh: dynamicMonth
        ? ((dynamicMonth.batteryKwh - dynamicMonth.additionalKwh) / days) *
          (period === "year" ? 12 : 1)
        : energy.service,
    },
    {
      label: "Recorridos adicionales",
      kwh: dynamicMonth
        ? (dynamicMonth.additionalKwh / days) * (period === "year" ? 12 : 1)
        : energy.additional,
    },
    {
      label: "Pérdidas de carga",
      kwh: dynamicMonth
        ? ((dynamicMonth.gridKwh - dynamicMonth.batteryKwh) / days) *
          (period === "year" ? 12 : 1)
        : r.dailyGridKwh - r.dailyBatteryKwh,
    },
  ].map((part) => ({
    ...part,
    kwh: part.kwh * scale,
    co2eKg: part.kwh * factor * scale,
  }));
  return {
    units,
    days,
    scale,
    parts,
    liters: dynamicMonth
      ? dynamicMonth.liters * monthScale
      : r.dailyLiters * scale,
    tailpipeCO2Kg: dynamicMonth
      ? dynamicMonth.liters *
        monthScale *
        ((r.scenario.ice.fuel === "diesel" ? 10.18 : 8.887) / 3.785411784)
      : r.emissions.iceCO2KgDay * scale,
    electricTailpipeCO2Kg: 0,
    electricityCO2eKg: dynamicMonth
      ? dynamicMonth.gridKwh * monthScale * factor
      : r.emissions.evCO2eKgDay * scale,
    gridKwh: dynamicMonth
      ? dynamicMonth.gridKwh * monthScale
      : r.dailyGridKwh * scale,
  };
}
