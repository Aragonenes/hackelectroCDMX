import { useState } from "react";
import type { Scenario } from "../domain/schema";
import type { Journey } from "../domain/journeySchema";
import { convertToDynamic, dayNames } from "../data/journey";
export const clockTime = (minute: number) =>
  `${String(Math.floor((Math.max(0, minute) % 1440) / 60)).padStart(2, "0")}:${String(Math.floor(Math.max(0, minute) % 60)).padStart(2, "0")}${minute >= 1440 ? " (+1 día)" : ""}`;
function Input({
  label,
  value,
  onChange,
  min = 0,
  max = 100000,
  step = "any",
}: {
  label: string;
  value: number | null;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: string;
}) {
  return (
    <label className="field journey-field">
      <span>{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value !== null && Number.isFinite(value) ? value : ""}
        onChange={(e) =>
          onChange(e.target.value === "" ? NaN : Number(e.target.value))
        }
      />
    </label>
  );
}
export default function JourneyControls({
  scenario: s,
  onChange,
}: {
  scenario: Scenario;
  onChange: (s: Scenario) => void;
}) {
  const [slot, setSlot] = useState(32);
  if (s.schemaVersion === "1")
    return (
      <section className="control-group">
        <h3>Jornada por hora y tramo</h3>
        <p>
          El escenario original conserva su cálculo uniforme v1. La conversión
          añade perfiles exploratorios, terreno y clima histórico.
        </p>
        <button
          className="primary"
          disabled={s.route.id !== "M09-514"}
          onClick={() => onChange(convertToDynamic(s))}
        >
          Activar jornada dinámica
        </button>
      </section>
    );
  const j = s.journey,
    d = j.days[j.selectedDay]!;
  const change = (journey: Journey) => onChange({ ...s, journey });
  const updateDay = (values: Partial<typeof d>) =>
    change({
      ...j,
      days: j.days.map((day, i) =>
        i === j.selectedDay ? { ...day, ...values } : day,
      ),
    });
  const current = d.slots[slot]!;
  const techLabels: Record<keyof Journey["technical"], string> = {
    massKg: "Masa sin pasajeros (kg)",
    passengerKg: "Masa por pasajero (kg)",
    baseOccupancy: "Ocupación de referencia (fracción)",
    referenceTemperatureC: "Temperatura de referencia (°C)",
    auxiliaryKw: "Auxiliares de referencia (kW)",
    hvacKwPerC: "Climatización por grado (kW/°C)",
    hvacDeadbandC: "Banda térmica sin climatización (°C)",
    rollingCoefficient: "Coeficiente de rodadura",
    wetRollingIncrease: "Incremento de rodadura mojada (fracción)",
    driveEfficiency: "Eficiencia de tracción (fracción)",
    regenEfficiency: "Eficiencia de regeneración (fracción)",
    regenMaxKw: "Límite regenerativo (kW)",
  };
  return (
    <section className="control-group journey-settings">
      <h3>Perfiles de jornada · modelo 2</h3>
      <p>
        Unidad representativa; entradas F editables. Horario de línea
        secundario: 05:00–22:50 laborables, 06:00–21:45 fin de semana. La
        jornada propia se configura por día.
      </p>
      <label className="field">
        <span>Día para editar</span>
        <select
          value={j.selectedDay}
          onChange={(e) =>
            change({ ...j, selectedDay: Number(e.target.value) })
          }
        >
          {dayNames.map((name, i) => (
            <option key={name} value={i}>
              {name}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Temporada</span>
        <select
          value={j.season}
          onChange={(e) =>
            change({ ...j, season: e.target.value as Journey["season"] })
          }
        >
          <option value="fria">Fría · nov–feb</option>
          <option value="calida">Cálida · mar–may</option>
          <option value="lluvias">Lluvias · jun–oct</option>
        </select>
      </label>
      <label className="field">
        <span>Inicio de la unidad · {d.name}</span>
        <input
          type="time"
          value={clockTime(d.startMinute)}
          onChange={(e) => {
            const [h, m] = e.target.value.split(":").map(Number);
            updateDay({ startMinute: h! * 60 + m! });
          }}
        />
      </label>
      <Input
        label="Pausa entre vueltas (min)"
        value={d.pauseMinutes}
        max={600}
        onChange={(pauseMinutes) => updateDay({ pauseMinutes })}
      />
      <Input
        label="Abordajes diarios relativos a la entrada general"
        value={d.boardingsFactor}
        max={10}
        onChange={(boardingsFactor) => updateDay({ boardingsFactor })}
      />
      <p>
        {s.operation.boardings * d.boardingsFactor} abordajes previstos por
        unidad; independientes de vueltas y ocupación.
      </p>
      <label className="field">
        <span>Inicio de carga en patio</span>
        <input
          type="time"
          value={clockTime(j.chargeStartMinute)}
          onChange={(e) => {
            const [h, m] = e.target.value.split(":").map(Number);
            change({ ...j, chargeStartMinute: h! * 60 + m! });
          }}
        />
      </label>
      <Input
        label="Congestión relativa (tiempo)"
        value={j.conditions.congestion}
        min={0.25}
        max={5}
        onChange={(congestion) =>
          change({ ...j, conditions: { ...j.conditions, congestion } })
        }
      />
      <Input
        label="Ajuste de temperatura ambiente (°C)"
        value={j.conditions.temperatureOffsetC}
        min={-40}
        max={40}
        onChange={(temperatureOffsetC) =>
          change({ ...j, conditions: { ...j.conditions, temperatureOffsetC } })
        }
      />
      {(
        [
          ["wet", "Pavimento mojado"],
          ["hvac", "Climatización activa"],
        ] as const
      ).map(([key, label]) => (
        <label className="check-field" key={key}>
          <input
            type="checkbox"
            checked={j.conditions[key]}
            onChange={(e) =>
              change({
                ...j,
                conditions: { ...j.conditions, [key]: e.target.checked },
              })
            }
          />
          {label}
        </label>
      ))}
      <details>
        <summary>Mezcla mensual y perfiles de 15 minutos</summary>
        <p>
          La suma debe coincidir con {s.operation.days} días de operación.
          Actualmente: {j.days.reduce((a, d) => a + d.mixDays, 0)}.
        </p>
        {j.days.map((day, i) => (
          <Input
            key={day.name}
            label={`Días de ${day.name}`}
            value={day.mixDays}
            max={31}
            step="1"
            onChange={(mixDays) =>
              change({
                ...j,
                days: j.days.map((d, k) => (k === i ? { ...d, mixDays } : d)),
              })
            }
          />
        ))}
        <label className="field">
          <span>Franja para editar · {d.name}</span>
          <select
            value={slot}
            onChange={(e) => setSlot(Number(e.target.value))}
          >
            {d.slots.map((_, i) => (
              <option key={i} value={i}>
                {clockTime(i * 15)}–{clockTime((i + 1) * 15)}
              </option>
            ))}
          </select>
        </label>
        <p>
          Pesos horarios relativos de abordajes; se normalizan sobre servicio
          previsto. Ocupación es fracción de plazas simultáneas; no es recaudo.
        </p>
        {(
          [
            ["weight", "Peso de abordajes"],
            ["occupancy", "Ocupación (fracción de plazas)"],
            ["durationFactor", "Tiempo relativo"],
          ] as const
        ).map(([key, label]) => (
          <Input
            key={key}
            label={label}
            value={current[key]}
            min={key === "durationFactor" ? 0.25 : 0}
            max={key === "weight" ? 100 : key === "occupancy" ? 2 : 5}
            onChange={(value) =>
              updateDay({
                slots: d.slots.map((f, i) =>
                  i === slot ? { ...f, [key]: value } : f,
                ),
              })
            }
          />
        ))}
        <button
          className="secondary"
          onClick={() =>
            updateDay({ slots: d.slots.map(() => ({ ...current })) })
          }
        >
          Aplicar franja a todo este día
        </button>
      </details>
      <details>
        <summary>Sentidos y sectores</summary>
        <p>
          Seis divisiones espaciales de prueba, tres por trazo; no paradas
          verificadas.
        </p>
        {j.sectors.map((sector, i) => (
          <div key={i}>
            <b>
              Trazo {Math.floor(i / 3) + 1} · sector {(i % 3) + 1}
            </b>
            <Input
              label={`Ocupación relativa · sector ${i + 1}`}
              value={sector.occupancyFactor}
              max={3}
              onChange={(occupancyFactor) =>
                change({
                  ...j,
                  sectors: j.sectors.map((s, k) =>
                    k === i ? { ...s, occupancyFactor } : s,
                  ),
                })
              }
            />
            <Input
              label={`Tiempo relativo · sector ${i + 1}`}
              value={sector.durationFactor}
              min={0.25}
              max={5}
              onChange={(durationFactor) =>
                change({
                  ...j,
                  sectors: j.sectors.map((s, k) =>
                    k === i ? { ...s, durationFactor } : s,
                  ),
                })
              }
            />
          </div>
        ))}
      </details>
      <details>
        <summary>Parámetros técnicos y evidencia</summary>
        <p>
          Referencia neta en kWh/km con ocupación, tiempo y temperatura base
          declarados. Auxiliares se ajustan por diferencia; regeneración de
          descenso se añade sólo por desnivel.
        </p>
        {Object.entries(j.technical).map(([key, value]) => (
          <Input
            key={key}
            label={techLabels[key as keyof typeof techLabels]}
            value={value}
            min={key === "referenceTemperatureC" ? -30 : 0}
            onChange={(value) =>
              change({ ...j, technical: { ...j.technical, [key]: value } })
            }
          />
        ))}
        <Input
          label="Escala del desnivel (0 = referencia plana)"
          value={j.conditions.elevationScale}
          max={3}
          onChange={(elevationScale) =>
            change({ ...j, conditions: { ...j.conditions, elevationScale } })
          }
        />
        <p>
          {j.prepared.terrain} · {j.prepared.smoothing}
        </p>
        <p>
          {j.climate.station} · {j.climate.years} · {j.climate.coverage}
        </p>
        <Input
          label={`Temperatura del perfil a las ${Math.floor(slot / 4)}:00 (°C)`}
          value={j.climate.profiles[j.season][Math.floor(slot / 4)]!}
          min={-50}
          max={60}
          onChange={(value) =>
            change({
              ...j,
              climate: {
                ...j.climate,
                sourceId: "F-DEMO",
                profiles: {
                  ...j.climate.profiles,
                  [j.season]: j.climate.profiles[j.season].map((v, i) =>
                    i === Math.floor(slot / 4) ? value : v,
                  ),
                },
              },
              evidence: {
                ...j.evidence,
                climate: {
                  sourceId: "F-DEMO",
                  status: "supuesto",
                  limitation: "Perfil meteorológico editado por usuario.",
                },
              },
            })
          }
        />
      </details>
      <details open={j.purchasePrice === null}>
        <summary>Entradas económicas y carga de la variante</summary>
        <p>
          Un precio desconocido permanece sin resultado financiero. Introducir
          una cifra declara un supuesto; no acredita oferta.
        </p>
        <Input
          label="Precio explícito del vehículo (MXN)"
          value={j.purchasePrice}
          max={100000000}
          onChange={(price) =>
            onChange({
              ...s,
              ev: { ...s.ev, price: Number.isFinite(price) ? price : 0 },
              journey: {
                ...j,
                purchasePrice: Number.isFinite(price) ? price : null,
              },
            })
          }
        />
        <label className="check-field">
          <input
            type="checkbox"
            checked={j.chargePowerConfirmed}
            onChange={(e) =>
              change({ ...j, chargePowerConfirmed: e.target.checked })
            }
          />
          Declarar potencia actual como supuesto de carga
        </label>
      </details>
    </section>
  );
}
