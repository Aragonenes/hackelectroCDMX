import type { Result } from "../domain/schema";
import { ComparisonTable, CashTable } from "./ResultTables";
import { sections } from "./fields";
import { getValue, evidenceOf } from "./values";
import { num } from "../ui/format";
import { presentedConditions, conditionStates } from "./conditions";
import { environmentalView } from "../domain/environment";
import environmentalSources from "../../docs/desarrollo/fuentes-ambientales.json";
export default function Report({ result: r }: { result: Result }) {
  const environment = environmentalView(r, "fleet", "year");
  return (
    <article className="print-report">
      <h1>Electromovilidad CDMX 2026 · evaluación por ramal</h1>
      <p>
        {r.scenario.name} · {r.scenario.route.name}
      </p>
      <p>
        Modelo {r.modelVersion} · catálogo {r.scenario.catalog.version} ·
        horizonte 60 meses. Escenario condicionado; no certifica viabilidad
        real.
      </p>
      <h2>Comparación</h2>
      <p>
        Combustión: {r.scenario.ice.name}. Eléctrico: {r.scenario.ev.name}.
        Carga: {r.scenario.chargerCount} × {r.scenario.charger.name}.
        Financiamiento: {r.scenario.finance.name}.
      </p>
      {r.dynamic?.economicComplete === false ? (
        <p>Precio de variante desconocido; comparación financiera pendiente.</p>
      ) : (
        <ComparisonTable r={r} />
      )}
      {r.dynamic && r.scenario.schemaVersion === "2" && (
        <section>
          <h2>Jornada seleccionada y mezcla mensual</h2>
          <p>
            {r.dynamic.selected.name} · {r.scenario.journey.season} ·{" "}
            {num(r.dynamic.selected.netKwh, 2)} kWh netos ·{" "}
            {num(r.dynamic.selected.boardings, 0)} abordajes. Recorrido
            previsto; primer cruce de reserva{" "}
            {r.dynamic.selected.firstReserve
              ? `${num(r.dynamic.selected.firstReserve.km, 2)} km`
              : "sin cruce"}
            ; energía no cubierta {num(r.dynamic.selected.unmetKwh, 2)} kWh.
          </p>
          <p>
            Mezcla:{" "}
            {r.scenario.journey.days
              .map((d) => `${d.name} ${d.mixDays}`)
              .join("; ")}
            . {num(r.dynamic.monthly.km, 2)} km/unidad/mes,{" "}
            {num(r.dynamic.monthly.gridKwh, 2)} kWh comprados,{" "}
            {num(r.dynamic.monthly.boardings, 0)} abordajes. Economía y ambiente
            mensual usan esa mezcla.
          </p>
          <p>
            Faltantes:{" "}
            {r.dynamic.missing.join("; ") ||
              "sin faltantes estructurales; supuestos y comprobaciones externas pendientes"}
            .
          </p>
          <p>
            {r.scenario.journey.prepared.terrain} ·{" "}
            {r.scenario.journey.prepared.smoothing} ·{" "}
            {r.scenario.journey.climate.station} ·{" "}
            {r.scenario.journey.climate.coverage}
          </p>
          <table>
            <thead>
              <tr>
                <th>Parámetro técnico F</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(r.scenario.journey.technical).map(
                ([key, value]) => (
                  <tr key={key}>
                    <th>{key}</th>
                    <td>{num(value, 5)}</td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
          <p>
            JSON v2 conserva las 96 franjas de cada día, sectores, clima y
            elevación para reproducción. Las franjas son supuestos F, no
            mediciones de demanda.
          </p>
        </section>
      )}
      <h2>Restricciones</h2>
      <ul>
        {presentedConditions(r).map((c) => (
          <li key={c.id}>
            <strong>
              {c.label} — {conditionStates[c.status]}:
            </strong>{" "}
            {c.detail}
          </li>
        ))}
      </ul>
      <h2>Entradas y procedencia</h2>
      {sections.map((section) => (
        <section key={section.id}>
          <h3>{section.title}</h3>
          <table>
            <thead>
              <tr>
                <th scope="col">Variable</th>
                <th scope="col">Valor</th>
                <th scope="col">Unidad</th>
                <th scope="col">Evidencia / fuente / fecha</th>
              </tr>
            </thead>
            <tbody>
              {section.fields.map((f) => {
                const ev = evidenceOf(r.scenario, f.path);
                return (
                  <tr key={f.path}>
                    <th scope="row">{f.label}</th>
                    <td>
                      {r.scenario.schemaVersion === "2" &&
                      f.path === "ev.price" &&
                      r.scenario.journey.purchasePrice === null
                        ? "desconocido"
                        : num(
                            Number(getValue(r.scenario, f.path)) *
                              (f.percent ? 100 : 1),
                            6,
                          )}
                    </td>
                    <td>{f.unit}</td>
                    <td>
                      {ev.level} · {ev.nature} · {ev.sourceId} · {ev.date}
                      <br />
                      {ev.limitation}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      ))}
      <p>
        Conectores: {r.scenario.ev.connector} / {r.scenario.charger.connector}.
        Infraestructura financiada:{" "}
        {r.scenario.finance.financeInfrastructure ? "sí" : "no"}. Renta incluye
        mantenimiento: {r.scenario.finance.maintenanceIncluded ? "sí" : "no"}.
      </p>
      <h2>Flujo de caja</h2>
      {r.dynamic?.economicComplete !== false && <CashTable f={r.ev} />}
      <h2>Alcance ambiental</h2>
      <p>
        Escape: {num(r.emissions.iceCO2KgDay, 2)} kg CO₂/unidad/día.
        Electricidad: {num(r.emissions.evCO2eKgDay, 2)} kg CO₂e/unidad/día.
        Factores de alcances diferentes; sin reducción neta ni ciclo de vida.
      </p>
      <p>
        Flota de {environment.units} unidades · año = doce meses de{" "}
        {r.scenario.operation.days} días operativos. Combustible sustituido:{" "}
        {num(environment.liters, 2)} L. CO₂ por escape evitado:{" "}
        {num(environment.tailpipeCO2Kg, 2)} kg; escape eléctrico: cero. Recarga:{" "}
        {num(environment.electricityCO2eKg, 2)} kg CO₂e.
      </p>
      <ul>
        {environment.parts.map((p) => (
          <li key={p.label}>
            {p.label}: {num(p.kwh, 2)} kWh · {num(p.co2eKg, 2)} kg CO₂e.
          </li>
        ))}
      </ul>
      <p>
        Persisten partículas por desgaste. Reducir fuentes de escape es
        relevante alrededor del servicio hospitalario, sin cuantificar
        exposición ni enfermedades evitadas. Fabricación, batería y fin de vida
        no están incluidos.
      </p>
      <h2>Supuestos y límites</h2>
      <ul>
        {r.warnings.map((w) => (
          <li key={w}>{w}</li>
        ))}
      </ul>
      <h2>Referencias</h2>
      {r.scenario.catalog.sources.map((source) => (
        <p key={source.id}>
          {source.id} · {source.title} · {source.date} · {source.scope}
          <br />
          {source.url}
          <br />
          {source.license}. {source.limitation}
        </p>
      ))}
      <h3>Contexto científico ambiental</h3>
      {environmentalSources.references
        .filter((s) => s.role === "context")
        .map((s) => (
          <p key={s.id}>
            {s.id} · {s.institution} · {s.title} · {s.publication}
            <br />
            {s.url}
            <br />
            Consulta {s.consulted} · {s.locator}. {s.claim}. {s.license}.{" "}
            {s.recovery}.
          </p>
        ))}
    </article>
  );
}
