import { journeyVehicles, selectJourneyVehicle } from "../data/journey";
import { prepareJourneys } from "./journey";
import type { DynamicScenario } from "./schema";
export interface VehicleEnergyComparison {
  id: string;
  name: string;
  netKwh: number;
  socEnd: number;
  firstReserveKm: number | null;
  capacity: number;
  monthlyGridKwh: number;
  economicState: "faltan entradas" | "supuestos completos";
  technicalState: "supuesto F";
}
export async function compareJourneys(
  s: DynamicScenario,
  cancelled: () => boolean,
  progress: (tested: number, total: number) => void,
): Promise<VehicleEnergyComparison[] | null> {
  const output: VehicleEnergyComparison[] = [];
  for (const vehicle of journeyVehicles) {
    if (cancelled()) return null;
    const candidate = selectJourneyVehicle(s, vehicle.id),
      days = prepareJourneys(candidate),
      selected = days[s.journey.selectedDay]!;
    output.push({
      id: vehicle.id,
      name: vehicle.name,
      netKwh: selected.netKwh,
      socEnd: selected.socEnd,
      firstReserveKm: selected.firstReserve?.km ?? null,
      capacity: candidate.ev.capacity,
      monthlyGridKwh: days.reduce(
        (sum, d) =>
          sum +
          (d.netKwh / candidate.energy.efficiency) *
            candidate.journey.days[d.day]!.mixDays,
        0,
      ),
      economicState:
        candidate.journey.purchasePrice === null
          ? "faltan entradas"
          : "supuestos completos",
      technicalState: "supuesto F",
    });
    progress(output.length, journeyVehicles.length);
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
  }
  return cancelled() ? null : output;
}
