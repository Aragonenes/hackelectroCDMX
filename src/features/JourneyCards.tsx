import type { Result } from "../domain/schema";
import { journeyAt } from "../domain/journey";
import { clockTime } from "./JourneyControls";
import { num } from "../ui/format";
import { Battery } from "lucide-react";
import { VehicleIcon } from "./MapSymbols";
import { isPitchScenario } from "../data/pitch";
export default function JourneyCards({
  result: r,
  minute,
  stale,
}: {
  result: Result;
  minute: number;
  stale: boolean;
}) {
  if (!r.dynamic || r.scenario.schemaVersion !== "2") return null;
  const d = r.dynamic.selected,
    j = r.scenario.journey,
    p = journeyAt(d, minute),
    soc = p.soc * 100;
  return (
    <div className="dynamic-cards">
      <section
        className="map-card journey-battery-card"
        aria-label="Batería de la jornada"
      >
        <div className="map-card-heading">
          <b>Batería</b>
          <span className="map-simulation">
            {stale
              ? "Resultado anterior"
              : isPitchScenario(r.scenario)
                ? "Demo del pitch"
                : "Escenario simulado"}
          </span>
        </div>
        <div className="journey-card-reading">
          <Battery
            className="journey-battery-icon"
            size={23}
            aria-hidden="true"
          />
          <b className="journey-reading">{num(soc, 1)}%</b>
          <span>SOC · reserva {num(r.scenario.energy.socMin * 100, 0)}%</span>
        </div>
        <div
          className="map-battery-meter"
          role="meter"
          aria-label="SOC de la jornada"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={soc}
        >
          <span style={{ width: `${soc}%` }} />
          <i style={{ left: `${r.scenario.energy.socMin * 100}%` }} />
        </div>
        <p>
          Tramo {num(p.netKwh, 3)} kWh · cierre {num(d.socEnd * 100, 1)}%
          {d.firstReserve ? " · invade reserva" : " · reserva protegida"}
          {d.firstExhaustion ? " · energía insuficiente" : ""}.
        </p>
        <div className="journey-vehicle">
          <VehicleIcon category={r.scenario.ev.category} />
          <b className="journey-vehicle-name">{r.scenario.ev.name}</b>
        </div>
        <p className="journey-event">
          {p.kind === "service"
            ? `Vuelta ${p.cycle} de ${r.scenario.operation.cycles} · ${num(p.km, 1)} km del día`
            : p.kind === "additional"
              ? "Adicionales · ubicación desconocida"
              : "Pausa de la unidad"}
        </p>
        <p className="journey-consumed">
          {num(p.kwh, 2)} kWh consumidos · {r.scenario.ev.capacity} plazas de
          prueba
        </p>
        <a href="#/operacion/energia">Energía y recarga</a>
      </section>
      <section
        className="map-card journey-detail-card"
        aria-label="Pasajeros de la jornada"
      >
        <div className="map-card-heading">
          <b>Pasajeros</b>
          <span>
            {clockTime(Math.floor(p.minute / 15) * 15)} · {d.name}
          </span>
        </div>
        <div className="journey-card-reading">
          <b className="journey-reading">
            {num(p.occupancy, 1)} / {r.scenario.ev.capacity}
          </b>
          <span>plazas simultáneas</span>
        </div>
        <p>
          {num(p.boardings, 0)} / {num(d.boardings, 0)} abordajes acumulados del
          escenario.
        </p>
        <a href="#/configurar">Perfiles de servicio</a>
      </section>
      <section
        className="map-card journey-detail-card"
        aria-label="Condiciones de la jornada"
      >
        <div className="map-card-heading">
          <b>Condiciones</b>
          <span>
            {j.conditions.wet ? "Mojado" : "Seco"} · climatización{" "}
            {j.conditions.hvac ? "activa" : "apagada"}
          </span>
        </div>
        <div className="journey-card-reading">
          <b className="journey-reading">{num(p.temperatureC, 1)} °C</b>
          <span>ambiente</span>
        </div>
        <p>
          {p.kind === "service"
            ? `${num(p.elevationM, 0)} m · pendiente ${num(p.slope * 100, 1)}%`
            : "Elevación y pendiente desconocidas."}
        </p>
        <p>
          Desnivel +{num(p.effects.gradeKwh, 3)} · auxiliares{" "}
          {num(p.effects.auxiliaryDeltaKwh, 3)} kWh frente a referencia.
        </p>
        <a href="#/operacion/energia">Explicación y fuentes</a>
      </section>
    </div>
  );
}
