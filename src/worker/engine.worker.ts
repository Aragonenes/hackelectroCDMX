import { compareJourneys } from "../domain/compareJourneys";
import { evaluateScenario } from "../domain/evaluate";
import { findConditions, SearchCancelled } from "../domain/optimize";
import type { Request, Response } from "./protocol";
import { sensitivity } from "../domain/explore";
import { revenueStress } from "../domain/financialAnalysis";
let comparisonId = 0;
let revenueStressId = 0;
let searchId = 0;
let sensitivityId = 0;
const send = (response: Response) => self.postMessage(response);
self.onmessage = async (event: MessageEvent<Request>) => {
  const request = event.data;
  if (request.type === "cancel-comparison") {
    comparisonId = request.id;
    return;
  }
  if (request.type === "cancel") {
    searchId = request.id;
    return;
  }
  if (request.type === "cancel-sensitivity") {
    sensitivityId = request.id;
    return;
  }
  if (request.type === "cancel-revenue-stress") {
    revenueStressId = request.id;
    return;
  }
  try {
    if (request.type === "evaluate")
      send({
        type: "evaluated",
        id: request.id,
        result: evaluateScenario(request.scenario),
      });
    else if (request.type === "compare") {
      if (request.scenario.schemaVersion !== "2")
        throw new Error("Activa la jornada dinámica para comparar.");
      comparisonId = request.id;
      const vehicles = await compareJourneys(
        request.scenario,
        () => comparisonId !== request.id,
        (tested, total) =>
          send({ type: "comparison-progress", id: request.id, tested, total }),
      );
      if (vehicles && comparisonId === request.id)
        send({ type: "compared", id: request.id, vehicles });
    } else if (request.type === "revenue-stress") {
      revenueStressId = request.id;
      const points = await revenueStress(
        request.scenario,
        () => revenueStressId !== request.id,
      );
      if (points && revenueStressId === request.id)
        send({ type: "revenue-stress", id: request.id, points });
    } else if (request.type === "sensitivity") {
      sensitivityId = request.id;
      const points = await sensitivity(
        request.scenario,
        () => sensitivityId !== request.id,
        (tested, total) =>
          send({ type: "sensitivity-progress", id: request.id, tested, total }),
      );
      if (points && sensitivityId === request.id)
        send({ type: "sensitivity", id: request.id, points });
    } else {
      searchId = request.id;
      const result = await findConditions(request.scenario, {
        cancelled: () => searchId !== request.id,
        progress: (tested, total) =>
          send({ type: "progress", id: request.id, tested, total }),
      });
      if (searchId === request.id)
        send({ type: "searched", id: request.id, result });
    }
  } catch (error) {
    if (!(error instanceof SearchCancelled))
      send({
        type: "error",
        operation: request.type,
        id: request.id,
        error:
          error instanceof Error
            ? error.message
            : "No fue posible completar el cálculo.",
      });
  }
};
