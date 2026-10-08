import { evaluateLegacy } from "./evaluate";
import { prepareJourneys, type JourneyResults } from "./journey";
import type { DynamicScenario, Result } from "./schema";
export function evaluateDynamic(s: DynamicScenario): Result {
  const days = prepareJourneys(s),
    selected = days[s.journey.selectedDay]!;
  const monthly: JourneyResults["monthly"] = {
    km: 0,
    serviceKm: 0,
    batteryKwh: 0,
    additionalKwh: 0,
    gridKwh: 0,
    liters: 0,
    boardings: 0,
    peakKw: 0,
  };
  for (const d of days) {
    const count = s.journey.days[d.day]!.mixDays;
    monthly.km += d.km * count;
    monthly.serviceKm += d.serviceKm * count;
    monthly.batteryKwh += d.netKwh * count;
    monthly.additionalKwh += d.additionalKwh * count;
    monthly.gridKwh += (d.netKwh / s.energy.efficiency) * count;
    monthly.liters += d.liters * count;
    monthly.boardings += d.boardings * count;
    if (count > 0) monthly.peakKw = Math.max(monthly.peakKw, d.charge.peakKw);
  }
  const missing = [
    ...(s.journey.purchasePrice === null
      ? ["Precio de adquisición de la variante seleccionada"]
      : []),
    ...(!s.journey.chargePowerConfirmed
      ? ["Potencia de carga: declarar valor o supuesto"]
      : []),
  ];
  const economicComplete = s.journey.purchasePrice !== null;
  const r = evaluateLegacy(
    {
      ...s,
      schemaVersion: "1",
      modelVersion: "1.0.0",
      ev: { ...s.ev, price: s.journey.purchasePrice ?? 0 },
    },
    {
      dailyBatteryKwh: selected.netKwh,
      workHours: selected.workHours,
      dailyKm: selected.km,
      monthlyBatteryKwh: monthly.batteryKwh,
      monthlyGridKwh: monthly.gridKwh,
      monthlyKm: monthly.km,
      monthlyLiters: monthly.liters,
      monthlyBoardings: monthly.boardings,
      peakKw: monthly.peakKw,
    },
  );
  const operating = days.filter((d) => s.journey.days[d.day]!.mixDays > 0);
  const replace = (id: string, pass: boolean, detail: string) => {
    const c = r.constraints.find((c) => c.id === id)!;
    c.status = pass ? "pass" : "fail";
    c.detail = detail;
  };
  replace(
    "battery",
    operating.every((d) => !d.firstReserve && !d.firstExhaustion),
    operating
      .map(
        (d) =>
          `${d.name}: ${d.netKwh.toFixed(2)} kWh; ${d.firstReserve ? `primer cruce de reserva a ${(d.firstReserve.minute / 60).toFixed(2)} h` : "reserva protegida"}${d.firstExhaustion ? "; energía agotada" : ""}`,
      )
      .join(" · "),
  );
  replace(
    "charging",
    s.journey.chargePowerConfirmed &&
      operating.every((d) => d.charge.hours <= d.chargeWindowHours + 1e-9),
    operating
      .map(
        (d) =>
          `${d.name}: ${Number.isFinite(d.charge.hours) ? d.charge.hours.toFixed(2) : "sin potencia"} h / ventana ${d.chargeWindowHours.toFixed(2)} h`,
      )
      .join(" · ") +
      (!s.journey.chargePowerConfirmed ? " · Potencia no declarada." : ""),
  );
  replace(
    "schedule",
    operating.every((d) => d.scheduleFits),
    operating
      .map(
        (d) =>
          `${d.name}: ${d.workHours.toFixed(2)} h; cierre ${(d.endMinute / 60).toFixed(2)} h; ${d.scheduleFits ? "cabe" : "excede jornada, turno u horario secundario"}`,
      )
      .join(" · "),
  );
  replace(
    "capacity",
    s.ev.capacity >= s.operation.requiredCapacity &&
      s.ice.capacity >= s.operation.requiredCapacity &&
      operating.every((d) => d.peakOccupancy <= s.ev.capacity + 1e-9),
    `Máxima ocupación prevista ${Math.max(...operating.map((d) => d.peakOccupancy)).toFixed(1)} / ${s.ev.capacity} plazas; referencia y plazas requeridas ${s.operation.requiredCapacity}.`,
  );
  const headway = Math.max(
    ...operating.map(
      (d) =>
        d.frames
          .filter((f) => f.kind === "service")
          .reduce((sum, f) => sum + f.durationMinutes, 0) /
        s.operation.cycles /
        s.operation.fleet,
    ),
  );
  replace(
    "frequency",
    headway <= s.operation.maxHeadwayMinutes,
    `${headway.toFixed(1)} min teóricos en el perfil más lento; no despacho medido.`,
  );
  if (!economicComplete) {
    for (const id of ["initial", "monthly"]) {
      const c = r.constraints.find((c) => c.id === id)!;
      c.status = "pending";
      c.detail =
        "Precio desconocido. Introduce una entrada explícita para evaluar economía.";
    }
    r.ev = {
      ...r.ev,
      capex: NaN,
      upfront: NaN,
      ownRequired: NaN,
      principal: NaN,
      payment: NaN,
      months: [],
      minMonthlyCash: NaN,
      economicCost: NaN,
      costPerKm: NaN,
      interestTotal: NaN,
      debtRemaining: NaN,
      residual: NaN,
    };
  }
  const factor = (s.ice.fuel === "diesel" ? 10.18 : 8.887) / 3.785411784;
  return {
    ...r,
    scenario: s,
    modelVersion: "2.0.0",
    dynamic: { days, selected, monthly, economicComplete, missing },
    headway,
    charge: selected.charge,
    socEnd: selected.socEnd,
    socTimeline: [
      { hour: 0, soc: s.energy.socMax },
      ...selected.frames.map((f) => ({
        hour: (f.endMinute - selected.startMinute) / 60,
        soc: f.socEnd,
      })),
    ],
    passes: economicComplete && r.constraints.every((c) => c.status !== "fail"),
    emissions: {
      iceCO2KgDay: selected.liters * factor,
      evCO2eKgDay:
        (selected.netKwh / s.energy.efficiency) * s.energy.gridFactor,
      comparable: false,
    },
    warnings: [
      "Jornada v2 exploratoria; ocupación, abordajes, congestión y coeficientes F editables, sin aforos actuales.",
      "Trayectoria prevista. El primer cruce de reserva y el agotamiento permanecen registrados aunque haya regeneración posterior.",
      "Terreno CEM 4.0, no rasante medida; temperatura ambiente PED 2023 con cobertura parcial, no batería ni clima actual.",
      "Abordajes independientes de vueltas. Economía y ambiente mensual usan la mezcla reconciliada; cada día operativo verifica batería, servicio y recarga.",
      "Energía, demanda y cargo fijo son costos exploratorios; sin facturación horaria CFE. CO₂ de escape y CO₂e eléctrico conservan alcances distintos.",
      ...missing.map((m) => `Faltante: ${m}.`),
      ...r.warnings.filter((w) => !w.includes("Cálculo agregado")),
    ],
  };
}
