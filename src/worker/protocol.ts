import type { VehicleEnergyComparison } from "../domain/compareJourneys";
import type { Scenario, Result, SearchResult } from "../domain/schema";
import type { RevenueStressPoint } from "../domain/financialAnalysis";
import type { SensitivitySeries } from "../domain/explore";
export type Request =
  | {
      type:
        "evaluate" | "search" | "sensitivity" | "revenue-stress" | "compare";
      id: number;
      scenario: Scenario;
    }
  | { type: "cancel-comparison"; id: number }
  | { type: "cancel"; id: number }
  | { type: "cancel-sensitivity"; id: number }
  | { type: "cancel-revenue-stress"; id: number };
export type Response =
  | { type: "compared"; id: number; vehicles: VehicleEnergyComparison[] }
  | {
      type: "comparison-progress" | "sensitivity-progress";
      id: number;
      tested: number;
      total: number;
    }
  | { type: "revenue-stress"; id: number; points: RevenueStressPoint[] }
  | { type: "evaluated"; id: number; result: Result }
  | { type: "searched"; id: number; result: SearchResult }
  | { type: "sensitivity"; id: number; points: SensitivitySeries[] }
  | { type: "progress"; id: number; tested: number; total: number }
  | {
      type: "error";
      id: number;
      operation:
        "evaluate" | "search" | "sensitivity" | "revenue-stress" | "compare";
      error: string;
    };
/** Una respuesta anterior nunca puede reemplazar el escenario más reciente. */
export class RequestGate {
  private current = 0;
  next() {
    return ++this.current;
  }
  accepts(id: number) {
    return id === this.current;
  }
  invalidate() {
    this.current++;
  }
}
