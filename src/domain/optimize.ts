import { selectJourneyVehicle } from "../data/journey";
import {
  ScenarioSchema,
  type Scenario,
  type SearchResult,
  type Alternative,
} from "./schema";
import { evaluateScenario } from "./evaluate";
import { evaluateDynamic } from "./evaluateJourney";
import { prepareJourneys } from "./journey";
import { financial } from "./finance";
export class SearchCancelled extends Error {
  constructor() {
    super("Búsqueda cancelada");
  }
}
export async function findConditions(
  input: Scenario,
  options: {
    cancelled?: () => boolean;
    progress?: (tested: number, total: number) => void;
  } = {},
): Promise<SearchResult> {
  const s = ScenarioSchema.parse(input);
  const pitch =
    s.schemaVersion === "2" && s.journey.evidence.pitch?.sourceId === "F-PITCH";
  const catalogVehicles =
    s.schemaVersion === "2" && !s.catalog.vehicles.some((v) => v.id === s.ev.id)
      ? [...s.catalog.vehicles, s.ev]
      : s.catalog.vehicles;
  const vehicles = catalogVehicles
    .filter(
      (v) =>
        v.fuel === "electricidad" &&
        (!pitch || v.evidence.price?.sourceId === "F-PITCH"),
    )
    .map((v) => (v.id === s.ev.id ? s.ev : v));
  const chargers = s.catalog.chargers.map((c) =>
    c.id === s.charger.id ? s.charger : c,
  );
  const finances = s.catalog.finances.map((f) =>
    f.id === s.finance.id ? s.finance : f,
  );
  const total =
    vehicles.length * chargers.length * finances.length * s.operation.fleet;
  const current = evaluateScenario(s);
  const thresholds = {
    maxBatteryConsumption: current.usableKwh / current.dailyKm,
    minimumAverageSiteKw:
      (current.dailyGridKwh * s.operation.fleet) / s.energy.chargeHours,
    monthlyOperatingGap:
      current.dynamic?.economicComplete === false
        ? NaN
        : Math.max(
            0,
            current.ev.operatingMonth +
              current.ev.protectedMonth +
              s.economy.monthlyReserve * s.operation.fleet -
              current.ev.months[0]!.revenue,
          ),
  };
  const result: SearchResult = {
    vehicleCount: vehicles.length,
    feasibleVehicleCount: 0,
    alternatives: [],
    tested: 0,
    rejected: {},
    limitExceeded: total > 10000,
    thresholds,
  };
  if (result.limitExceeded) return result;
  // Conservar resúmenes financieros; las trayectorias completas sólo se calculan
  // para las opciones finales, evitando retener miles de jornadas en memoria.
  const winners: (Pick<Alternative, "scenario" | "support"> & {
    economicCost: number;
    ownRequired: number;
  })[] = [];
  const vehicleScenarios = new Map(
    vehicles.map((ev) => [
      ev.id,
      s.schemaVersion === "2" && ev.id !== s.ev.id
        ? selectJourneyVehicle(s, ev.id)
        : s,
    ]),
  );
  const reject = (id: string) => {
    result.rejected[id] = (result.rejected[id] ?? 0) + 1;
  };
  for (const ev of vehicles) {
    const vehicleScenario = vehicleScenarios.get(ev.id)!;
    const trajectory =
      vehicleScenario.schemaVersion === "2"
        ? prepareJourneys(vehicleScenario)
        : undefined;
    for (const charger of chargers)
      for (const finance of finances)
        for (
          let chargerCount = 1;
          chargerCount <= s.operation.fleet;
          chargerCount++
        ) {
          if (options.cancelled?.()) throw new SearchCancelled();
          const candidate: Scenario = {
            ...vehicleScenario,
            ev,
            charger,
            finance,
            chargerCount,
            economy: { ...s.economy, support: 0 },
          };
          const baseline =
            candidate.schemaVersion === "2"
              ? evaluateDynamic(candidate, trajectory)
              : evaluateScenario(candidate);
          result.tested++;
          const failures = baseline.constraints.filter(
            (c) =>
              c.status === "fail" && !["initial", "monthly"].includes(c.id),
          );
          if (baseline.dynamic?.economicComplete === false) {
            reject("economic-data");
          } else if (failures.length) {
            for (const c of failures) reject(c.id);
          } else {
            const max = Math.ceil(
              (baseline.ev.capex +
                s.economy.initialReserve * s.operation.fleet) *
                100,
            );
            const at = (cents: number) =>
              financial(
                {
                  ...candidate,
                  operation: baseline.dynamic
                    ? {
                        ...candidate.operation,
                        boardings:
                          baseline.dynamic.monthly.boardings /
                          candidate.operation.days,
                      }
                    : candidate.operation,
                  economy: { ...candidate.economy, support: cents / 100 },
                },
                ev,
                baseline.ev.operatingMonth,
                true,
                baseline.dynamic?.monthly.km,
              );
            const valid = (cents: number) => {
              const f = at(cents);
              return (
                f.ownRequired <= s.economy.ownCapital && f.minMonthlyCash >= 0
              );
            };
            if (!valid(max)) reject("monthly");
            else {
              let lo = 0,
                hi = max;
              while (lo < hi) {
                const mid = Math.floor((lo + hi) / 2);
                if (valid(mid)) hi = mid;
                else lo = mid + 1;
              }
              const funded = {
                ...candidate,
                economy: { ...candidate.economy, support: lo / 100 },
              };
              const evaluation = at(lo);
              winners.push({
                scenario: funded,
                support: lo / 100,
                economicCost: evaluation.economicCost,
                ownRequired: evaluation.ownRequired,
              });
            }
          }
          if (result.tested % 10 === 0) {
            options.progress?.(result.tested, total);
            await new Promise<void>((resolve) => setTimeout(resolve, 0));
          }
        }
  }
  winners.sort(
    (a, b) =>
      a.support - b.support ||
      a.economicCost - b.economicCost ||
      a.ownRequired - b.ownRequired ||
      `${a.scenario.ev.id}-${a.scenario.charger.id}-${a.scenario.finance.id}-${a.scenario.chargerCount}`.localeCompare(
        `${b.scenario.ev.id}-${b.scenario.charger.id}-${b.scenario.finance.id}-${b.scenario.chargerCount}`,
      ),
  );
  result.feasibleVehicleCount = new Set(
    winners.map((w) => w.scenario.ev.id),
  ).size;
  const shown = new Set<string>();
  for (const winner of winners) {
    if (pitch && shown.has(winner.scenario.ev.id)) continue;
    if (options.cancelled?.()) throw new SearchCancelled();
    const evaluation = evaluateScenario(winner.scenario);
    if (!evaluation.passes) {
      reject("monthly");
      continue;
    }
    result.alternatives.push({
      scenario: winner.scenario,
      result: evaluation,
      support: winner.support,
    });
    shown.add(winner.scenario.ev.id);
    if (result.alternatives.length === 3) break;
  }
  options.progress?.(result.tested, total);
  return result;
}
