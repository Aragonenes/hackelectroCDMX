import type { ChargeResult, DynamicScenario } from "./schema";
import { charging } from "./charging";
export interface JourneyFrame {
  minute: number;
  endMinute: number;
  cycle: number;
  fraction: number;
  endFraction: number;
  kind: "service" | "pause" | "additional";
  trace: number;
  sector: number;
  km: number;
  endKm: number;
  elevationM: number;
  slope: number;
  temperatureC: number;
  occupancy: number;
  durationMinutes: number;
  requiredKwh: number;
  regenKwh: number;
  netKwh: number;
  cumulativeKwh: number;
  socStart: number;
  socEnd: number;
  socAfterDemand: number;
  unmetKwh: number;
  boardings: number;
  effects: {
    referenceKwh: number;
    massKwh: number;
    wetKwh: number;
    auxiliaryDeltaKwh: number;
    gradeKwh: number;
  };
}
export interface JourneyCrossing {
  minute: number;
  km: number;
  cycle: number;
  fraction: number;
}
export interface DayJourney {
  day: number;
  name: string;
  frames: JourneyFrame[];
  km: number;
  serviceKm: number;
  netKwh: number;
  requiredKwh: number;
  regenKwh: number;
  unmetKwh: number;
  additionalKwh: number;
  liters: number;
  boardings: number;
  workHours: number;
  startMinute: number;
  endMinute: number;
  batteryCapacityKwh: number;
  socEnd: number;
  peakOccupancy: number;
  firstReserve: JourneyCrossing | null;
  firstExhaustion: JourneyCrossing | null;
  charge: ChargeResult;
  chargeWindowHours: number;
  scheduleFits: boolean;
}
export interface JourneyResults {
  days: DayJourney[];
  selected: DayJourney;
  monthly: {
    km: number;
    serviceKm: number;
    batteryKwh: number;
    additionalKwh: number;
    gridKwh: number;
    liters: number;
    boardings: number;
    peakKw: number;
  };
  economicComplete: boolean;
  missing: string[];
}
const G = 9.80665;
const cache = new Map<string, Omit<DayJourney, "boardings">[]>();
/** Reutiliza trayectoria técnica entre precios, capital, recaudo y día seleccionado. */
export function prepareJourneys(s: DynamicScenario): DayJourney[] {
  const j = s.journey,
    t = j.technical,
    capacity = s.ev.batteryKwh * s.energy.soh;
  const key = JSON.stringify({
    j: {
      ...j,
      selectedDay: 0,
      purchasePrice: null,
      vehicleId: "",
      chargePowerConfirmed: false,
      evidence: {},
      days: j.days.map((d) => ({ ...d, boardingsFactor: 0, mixDays: 0 })),
    },
    o: {
      cycles: s.operation.cycles,
      cycleMinutes: s.operation.cycleMinutes,
      emptyRatio: s.operation.emptyRatio,
      emptySpeedKmh: s.operation.emptySpeedKmh,
      handlingHours: s.operation.handlingHours,
      serviceHours: s.operation.serviceHours,
      operators: s.operation.operators,
      maxShiftHours: s.operation.maxShiftHours,
      fleet: s.operation.fleet,
    },
    e: {
      efficiency: s.energy.efficiency,
      soh: s.energy.soh,
      socMin: s.energy.socMin,
      socMax: s.energy.socMax,
      chargeHours: s.energy.chargeHours,
      siteKw: s.energy.siteKw,
      otherSiteKw: s.energy.otherSiteKw,
      taperSoc: s.energy.taperSoc,
      taperFactor: s.energy.taperFactor,
    },
    ev: {
      battery: s.ev.batteryKwh,
      capacity: s.ev.capacity,
      consumption: s.ev.consumption,
      maxChargeKw: s.ev.maxChargeKw,
    },
    charger: s.charger,
    chargerCount: s.chargerCount,
  });
  let prepared = cache.get(key);
  if (!prepared) {
    prepared = j.days.map((d, day) => {
      const frames: JourneyFrame[] = [];
      let minute = d.startMinute,
        km = 0,
        soc = s.energy.socMax,
        cumulative = 0;
      let firstReserve: JourneyCrossing | null = null,
        firstExhaustion: JourneyCrossing | null = null;
      const scale = s.route.cycleKm / j.prepared.cycleKm;
      const add = (
        kind: JourneyFrame["kind"],
        cycle: number,
        fraction: number,
        endFraction: number,
        length: number,
        baseMinutes: number,
        trace: number,
        sector: number,
        elevationM: number,
        dh: number,
      ) => {
        const slot =
          d.slots[Math.floor((((minute % 1440) + 1440) % 1440) / 15)]!;
        const sectorProfile = j.sectors[(trace - 1) * 3 + sector] ?? {
          occupancyFactor: 1,
          durationFactor: 1,
        };
        const durationMinutes =
          baseMinutes *
          (kind === "service"
            ? slot.durationFactor *
              sectorProfile.durationFactor *
              j.conditions.congestion
            : 1);
        const temperatureC =
          j.climate.profiles[j.season][Math.floor(minute / 60) % 24]! +
          j.conditions.temperatureOffsetC;
        const occupancy =
          kind === "service"
            ? slot.occupancy * sectorProfile.occupancyFactor * s.ev.capacity
            : 0;
        const mass = t.massKg + occupancy * t.passengerKg;
        const referenceMass =
          t.massKg + t.baseOccupancy * s.ev.capacity * t.passengerKg;
        const referenceKwh = length * s.ev.consumption;
        const massKwh =
          kind === "service"
            ? ((mass - referenceMass) *
                G *
                t.rollingCoefficient *
                length *
                1000) /
              3600000 /
              t.driveEfficiency
            : 0;
        const wetKwh = j.conditions.wet
          ? (mass *
              G *
              t.rollingCoefficient *
              t.wetRollingIncrease *
              length *
              1000) /
            3600000 /
            t.driveEfficiency
          : 0;
        const hvac = j.conditions.hvac
          ? t.hvacKwPerC *
            Math.max(
              0,
              Math.abs(temperatureC - t.referenceTemperatureC) -
                t.hvacDeadbandC,
            )
          : 0;
        // La referencia neta ya contiene auxiliares; se añade sólo su diferencia.
        const auxiliaryDeltaKwh =
          (t.auxiliaryKw * (durationMinutes - baseMinutes)) / 60 +
          (hvac * durationMinutes) / 60 +
          (kind === "pause" ? (t.auxiliaryKw * durationMinutes) / 60 : 0);
        const potential = (mass * G * dh) / 3600000;
        const gradeKwh = Math.max(0, potential) / t.driveEfficiency;
        const requiredKwh = Math.max(
          0,
          referenceKwh + massKwh + wetKwh + auxiliaryDeltaKwh + gradeKwh,
        );
        const socStart = soc;
        const crossing = (threshold: number): JourneyCrossing => {
          const f = requiredKwh
            ? Math.max(
                0,
                Math.min(1, ((socStart - threshold) * capacity) / requiredKwh),
              )
            : 0;
          return {
            minute: minute + durationMinutes * f,
            km: km + length * f,
            cycle,
            fraction: fraction + (endFraction - fraction) * f,
          };
        };
        if (
          !firstReserve &&
          socStart - requiredKwh / capacity < s.energy.socMin - 1e-10
        )
          firstReserve = crossing(s.energy.socMin);
        if (!firstExhaustion && requiredKwh > socStart * capacity + 1e-10)
          firstExhaustion = crossing(0);
        const unmetKwh = Math.max(0, requiredKwh - socStart * capacity);
        const drained = Math.max(0, socStart * capacity - requiredKwh);
        const regenKwh = Math.min(
          Math.max(0, -potential) * t.regenEfficiency,
          (t.regenMaxKw * durationMinutes) / 60,
          Math.max(0, s.energy.socMax * capacity - drained),
        );
        soc = (drained + regenKwh) / capacity;
        const netKwh = requiredKwh - regenKwh;
        cumulative += netKwh;
        frames.push({
          minute,
          endMinute: minute + durationMinutes,
          cycle,
          fraction,
          endFraction,
          kind,
          trace,
          sector,
          km,
          endKm: km + length,
          elevationM,
          slope: length ? dh / (length * 1000) : 0,
          temperatureC,
          occupancy,
          durationMinutes,
          requiredKwh,
          regenKwh,
          netKwh,
          cumulativeKwh: cumulative,
          socStart,
          socEnd: soc,
          socAfterDemand: drained / capacity,
          unmetKwh,
          boardings: 0,
          effects: {
            referenceKwh,
            massKwh,
            wetKwh,
            auxiliaryDeltaKwh,
            gradeKwh,
          },
        });
        minute += durationMinutes;
        km += length;
      };
      for (let cycle = 1; cycle <= s.operation.cycles; cycle++) {
        for (const seg of j.prepared.segments) {
          const length = (seg.toKm - seg.fromKm) * scale;
          add(
            "service",
            cycle,
            seg.fromKm / j.prepared.cycleKm,
            seg.toKm / j.prepared.cycleKm,
            length,
            (s.operation.cycleMinutes * length) / s.route.cycleKm,
            seg.trace,
            seg.sector,
            seg.elevationStartM,
            (seg.elevationEndM - seg.elevationStartM) *
              j.conditions.elevationScale,
          );
        }
        if (cycle < s.operation.cycles && d.pauseMinutes > 0)
          add("pause", cycle, 1, 1, 0, d.pauseMinutes, 0, 0, 0, 0);
      }
      const additional =
        s.route.cycleKm * s.operation.cycles * s.operation.emptyRatio;
      if (additional > 0)
        add(
          "additional",
          s.operation.cycles,
          1,
          1,
          additional,
          (additional / s.operation.emptySpeedKmh) * 60,
          0,
          0,
          0,
          0,
        );
      if (s.operation.handlingHours > 0)
        add(
          "pause",
          s.operation.cycles,
          1,
          1,
          0,
          s.operation.handlingHours * 60,
          0,
          0,
          0,
          0,
        );
      const sum = (field: "requiredKwh" | "regenKwh" | "unmetKwh") =>
        frames.reduce((sum, f) => sum + f[field], 0);
      const netKwh = sum("requiredKwh") - sum("regenKwh");
      const open = day < 5 ? 300 : 360,
        close = day < 5 ? 1370 : 1305;
      // Carga siguiente en patio: no coincide con servicio aunque éste se retrase.
      let chargeStart = j.chargeStartMinute;
      while (chargeStart < d.startMinute) chargeStart += 1440;
      const chargeWindowHours = Math.max(
        0,
        Math.min(
          s.energy.chargeHours,
          (d.startMinute + 1440 - Math.max(minute, chargeStart)) / 60,
        ),
      );
      const workHours = (minute - d.startMinute) / 60;
      return {
        day,
        name: d.name,
        frames,
        km,
        serviceKm: km - additional,
        netKwh,
        requiredKwh: sum("requiredKwh"),
        regenKwh: sum("regenKwh"),
        unmetKwh: sum("unmetKwh"),
        additionalKwh: frames
          .filter((f) => f.kind !== "service")
          .reduce((sum, f) => sum + f.netKwh, 0),
        liters: km / s.ice.consumption,
        workHours,
        batteryCapacityKwh: capacity,
        startMinute: d.startMinute,
        endMinute: minute,
        socEnd: soc,
        peakOccupancy: Math.max(...frames.map((f) => f.occupancy)),
        firstReserve,
        firstExhaustion,
        charge: charging(s, Math.max(0, netKwh)),
        chargeWindowHours,
        scheduleFits:
          d.startMinute >= open &&
          minute <= close &&
          workHours <= s.operation.serviceHours &&
          workHours / s.operation.operators <= s.operation.maxShiftHours,
      };
    });
    if (cache.size >= 16) cache.delete(cache.keys().next().value!);
    cache.set(key, prepared);
  }
  // Recaudo independiente de vueltas: redistribuye el mismo total diario entre eventos de servicio.
  return prepared.map((day, index) => {
    const target = s.operation.boardings * j.days[index]!.boardingsFactor;
    const weights = day.frames.map((f) =>
      f.kind === "service"
        ? j.days[index]!.slots[Math.floor((f.minute % 1440) / 15)]!.weight *
          f.durationMinutes
        : 0,
    );
    const sum = weights.reduce((a, b) => a + b, 0);
    let boardings = 0;
    const frames = day.frames.map((f, i) => {
      boardings += sum ? (target * weights[i]!) / sum : 0;
      return { ...f, boardings };
    });
    return {
      ...day,
      liters: day.km / s.ice.consumption,
      boardings: sum ? target : 0,
      frames,
    };
  });
}
export function journeyAt(day: DayJourney, minute: number) {
  const frames = day.frames;
  let low = 0,
    high = frames.length - 1;
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (frames[mid]!.endMinute < minute) low = mid + 1;
    else high = mid;
  }
  const f = frames[low]!;
  const ratio = Math.max(
    0,
    Math.min(1, (minute - f.minute) / (f.durationMinutes || 1)),
  );
  const previous = low ? frames[low - 1]! : null;
  // Primero se demanda energía; después se recupera la energía de descenso.
  return {
    ...f,
    segmentKm: f.endKm - f.km,
    minute,
    fraction: f.fraction + (f.endFraction - f.fraction) * ratio,
    km: f.km + (f.endKm - f.km) * ratio,
    kwh:
      (previous?.cumulativeKwh ?? 0) +
      f.requiredKwh * ratio -
      (ratio >= 1 ? f.regenKwh : 0),
    soc:
      ratio >= 1
        ? f.socEnd
        : Math.max(
            0,
            f.socStart - (f.requiredKwh / day.batteryCapacityKwh) * ratio,
          ),
    boardings:
      (previous?.boardings ?? 0) +
      (f.boardings - (previous?.boardings ?? 0)) * ratio,
  };
}
