import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Users,
} from "lucide-react";
import type { Result, Constraint } from "../domain/schema";
import { focusParameter } from "./Controls";
import { mxn } from "../ui/format";
import {
  presentedConditions,
  conditionStates,
  conditionParameters,
} from "./conditions";
export default function Diagnostic({
  result: r,
  stale,
  onSearch,
  onParameter = focusParameter,
}: {
  result: Result | null;
  stale: boolean;
  onSearch: () => void;
  onParameter?: (path: string) => void;
}) {
  if (!r)
    return (
      <aside className="diagnostic-panel" aria-label="Diagnóstico">
        <h2>Preparando tu evaluación…</h2>
      </aside>
    );
  const conditions = presentedConditions(r);
  const failures = conditions.filter((c) => c.status === "fail");
  const pending = conditions.filter((c) => c.status === "pending");
  const render = (items: Constraint[]) => (
    <ul className="diagnostic-checks">
      {items.map((c) => (
        <li key={c.id} className={c.status} data-condition={c.id}>
          <div className="condition-heading">
            <div>
              {c.status === "fail" ? (
                <AlertCircle size={17} aria-hidden="true" />
              ) : c.status === "pending" ? (
                <HelpCircle size={17} aria-hidden="true" />
              ) : (
                <CheckCircle2 size={17} aria-hidden="true" />
              )}
              <strong>{c.label}</strong>
            </div>
            <span className="condition-state">{conditionStates[c.status]}</span>
          </div>
          {r.dynamic && ["battery", "charging", "schedule"].includes(c.id) ? (
            <ul className="condition-day-details">
              {c.detail.split(" · ").map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          ) : (
            <p>{c.detail}</p>
          )}
          {conditionParameters[c.id] && (
            <button
              className="text-button"
              onClick={() =>
                onParameter(
                  c.id === "monthly" && r.scenario.finance.kind === "lease"
                    ? "finance.leasePerUnitMonth"
                    : conditionParameters[c.id]!,
                )
              }
            >
              Revisar parámetro <ArrowRight size={14} />
            </button>
          )}
        </li>
      ))}
    </ul>
  );
  return (
    <aside className="diagnostic-panel" aria-label="Diagnóstico del escenario">
      <header className="diagnostic-summary">
        <span className="eyebrow">LO QUE NOS DICE EL ESCENARIO</span>
        <h2>
          {failures.length
            ? "Hay condiciones por resolver"
            : "Los cálculos son favorables"}
        </h2>
        <p>
          Con estos parámetros,{" "}
          {failures.length
            ? `${failures.length} condiciones no se cumplen.`
            : "se cumplen las condiciones calculadas."}{" "}
          Quedan {pending.length} condiciones por confirmar.
        </p>
      </header>
      {stale && (
        <p className="stale-note">
          Resultado anterior. Corrige las entradas o espera el nuevo cálculo.
        </p>
      )}
      <div className="diagnostic-actions">
        <div className="protected-note">
          <Users size={18} aria-hidden="true" />
          <div>
            <b>
              {r.scenario.operation.operators * r.scenario.operation.fleet}{" "}
              personas presupuestadas
            </b>
            <p>
              Objetivo: {mxn(r.scenario.economy.incomeGoal)} al mes por
              operador. El flujo debe poder sostenerlo; no es un salario
              comprobado.
            </p>
          </div>
        </div>
        <button className="primary" onClick={onSearch} disabled={stale}>
          Explorar alternativas <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
      <div className="diagnostic-sections">
        <section aria-label="Condiciones calculadas">
          <h3>Condiciones calculadas</h3>
          {render(conditions.filter((c) => c.status !== "pending"))}
        </section>
        <section aria-label="Comprobaciones externas">
          <h3>Comprobaciones externas</h3>
          {render(conditions.filter((c) => c.status === "pending"))}
        </section>
      </div>
    </aside>
  );
}
