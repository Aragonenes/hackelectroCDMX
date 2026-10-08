import { useMemo } from "react";
import type { Result } from "../domain/schema";
import { clockTime } from "./JourneyControls";
import { journeyAt } from "../domain/journey";
import { num } from "../ui/format";
export default function JourneyProfiles({
  result: r,
  cursor,
  onSeek,
}: {
  result: Result;
  cursor: number | null;
  onSeek: (minute: number) => void;
}) {
  const day = r.dynamic?.selected;
  const series = useMemo(() => {
    if (!day) return [];
    const frames = day.frames.filter(
      (_, i) => i % Math.max(1, Math.floor(day.frames.length / 300)) === 0,
    );
    return [
      {
        label: "SOC (%)",
        values: frames.map((f) => ({ x: f.endMinute, y: f.socEnd * 100 })),
      },
      {
        label: "Ocupación simultánea (pasajeros)",
        values: frames.map((f) => ({ x: f.minute, y: f.occupancy })),
      },
      {
        label: "Elevación del terreno (m)",
        values: frames
          .filter((f) => f.kind === "service")
          .map((f) => ({ x: f.minute, y: f.elevationM })),
      },
    ];
  }, [day]);
  if (!day) return null;
  const minute = Math.max(
    day.startMinute,
    Math.min(day.endMinute, cursor ?? day.startMinute),
  );
  const point = journeyAt(day, minute);
  return (
    <section className="panel journey-profiles">
      <h3>Jornada de {day.name} · perfiles sincronizados</h3>
      <p>
        {clockTime(minute)} · {num(point.km, 1)} km · {num(point.soc * 100, 1)}%
        SOC · {num(point.occupancy, 1)} pasajeros.{" "}
        {point.kind === "additional"
          ? "Adicionales sin ubicación conocida."
          : "Recorrido previsto del escenario."}
      </p>
      <label className="field">
        <span>Cursor de los perfiles</span>
        <input
          type="range"
          min={day.startMinute}
          max={day.endMinute}
          step="1"
          value={minute}
          onChange={(e) => onSeek(Number(e.target.value))}
          aria-valuetext={clockTime(minute)}
        />
      </label>
      {series.map((s) => {
        const min = Math.min(...s.values.map((v) => v.y)),
          max = Math.max(...s.values.map((v) => v.y));
        const x = (v: number) =>
          20 +
          ((v - day.startMinute) / (day.endMinute - day.startMinute)) * 560;
        const y = (v: number) => 115 - ((v - min) / (max - min || 1)) * 90;
        return (
          <figure key={s.label}>
            <figcaption>
              {s.label} · {num(min, 1)}–{num(max, 1)}
            </figcaption>
            <svg
              viewBox="0 0 600 140"
              role="img"
              aria-label={`${s.label}, desde ${clockTime(day.startMinute)} hasta ${clockTime(day.endMinute)}`}
            >
              <line x1="20" y1="115" x2="580" y2="115" stroke="#777" />
              <polyline
                points={s.values.map((v) => `${x(v.x)},${y(v.y)}`).join(" ")}
                fill="none"
                stroke="#9D2148"
                strokeWidth="2"
              />
              <line
                x1={x(minute)}
                x2={x(minute)}
                y1="15"
                y2="120"
                stroke="#266CB4"
                strokeDasharray="4 4"
              />
              <text x="20" y="137" fontSize="12">
                {clockTime(day.startMinute)}
              </text>
              <text x="520" y="137" fontSize="12">
                {clockTime(day.endMinute)}
              </text>
            </svg>
          </figure>
        );
      })}
      <div
        className="table-scroll"
        role="region"
        aria-label="Jornadas semanales desplazables"
        tabIndex={0}
      >
        <table>
          <thead>
            <tr>
              <th>Día</th>
              <th>kWh</th>
              <th>Horas</th>
              <th>Recarga / ventana</th>
              <th>Reserva</th>
            </tr>
          </thead>
          <tbody>
            {r.dynamic!.days.map((d) => (
              <tr key={d.day}>
                <th>{d.name}</th>
                <td>{num(d.netKwh, 2)}</td>
                <td>{num(d.workHours, 2)}</td>
                <td>
                  {num(d.charge.hours, 2)} / {num(d.chargeWindowHours, 2)} h
                </td>
                <td>
                  {d.firstReserve
                    ? `${clockTime(d.firstReserve.minute)} · ${num(d.firstReserve.km, 1)} km`
                    : "Protegida"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Referencia, masa, auxiliares, pavimento y desnivel explican la energía
        requerida; recuperación aceptada se resta una vez. Abordajes y plazas
        simultáneas son independientes.
      </p>
    </section>
  );
}
