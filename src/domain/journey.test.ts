import { describe, expect, it } from "vitest";
import { defaultScenario } from "../data/defaults";
import { convertToDynamic, selectJourneyVehicle } from "../data/journey";
import { evaluateScenario } from "./evaluate";
import { prepareJourneys, journeyAt } from "./journey";
import { ScenarioSchema } from "./schema";
import { serializeScenario, parseScenario } from "../features/files";
function flat() {
  const s = convertToDynamic(defaultScenario());
  s.operation.cycles = 1;
  s.operation.handlingHours = 0;
  s.operation.emptyRatio = 0;
  s.operation.cycleMinutes = 60;
  s.operation.serviceHours = 14;
  s.journey.conditions = {
    temperatureOffsetC: 0,
    wet: false,
    hvac: false,
    congestion: 1,
    elevationScale: 0,
  };
  s.journey.days.forEach((d) => {
    d.pauseMinutes = 0;
    d.slots = d.slots.map(() => ({
      weight: 1,
      occupancy: 0.5,
      durationFactor: 1,
    }));
  });
  s.journey.sectors = s.journey.sectors.map(() => ({
    occupancyFactor: 1,
    durationFactor: 1,
  }));
  return s;
}
describe("Jornada por tramos", () => {
  it("reproduce referencia plana y unidades del balance", () => {
    const s = flat(),
      d = prepareJourneys(s)[0]!;
    expect(d.netKwh).toBeCloseTo(s.route.cycleKm * s.ev.consumption, 8);
    expect(d.workHours).toBeCloseTo(1, 8);
    expect(d.requiredKwh - d.regenKwh).toBeCloseTo(d.netKwh, 10);
  });
  it("cuantifica subida por masa y desnivel; altitud absoluta no consume", () => {
    const s = flat();
    s.journey.conditions.elevationScale = 1;
    const segment = {
      ...s.journey.prepared.segments[0]!,
      fromKm: 0,
      toKm: s.journey.prepared.cycleKm,
      elevationStartM: 2300,
      elevationEndM: 2400,
    };
    s.journey.prepared.segments = [segment];
    const base = s.route.cycleKm * s.ev.consumption;
    const mass = s.journey.technical.massKg + s.ev.capacity * 0.5 * 75;
    expect(prepareJourneys(s)[0]!.netKwh - base).toBeCloseTo(
      (mass * 9.80665 * 100) / 3600000 / 0.9,
      8,
    );
    s.journey.prepared.segments[0]!.elevationStartM += 1000;
    s.journey.prepared.segments[0]!.elevationEndM += 1000;
    expect(prepareJourneys(s)[0]!.netKwh - base).toBeCloseTo(
      (mass * 9.80665 * 100) / 3600000 / 0.9,
      8,
    );
  });
  it("limita descenso por trabajo disponible, potencia y espacio; nunca supera SOC máximo", () => {
    const s = flat();
    s.journey.conditions.elevationScale = 1;
    s.ev.consumption = 0.01;
    s.journey.prepared.segments = [
      {
        ...s.journey.prepared.segments[0]!,
        fromKm: 0,
        toKm: s.journey.prepared.cycleKm,
        elevationStartM: 2600,
        elevationEndM: 2300,
      },
    ];
    let d = prepareJourneys(s)[0]!;
    expect(d.regenKwh).toBeCloseTo(d.requiredKwh, 9);
    expect(d.socEnd).toBeCloseTo(s.energy.socMax, 9);
    s.journey.technical.regenMaxKw = 0.05;
    d = prepareJourneys(s)[0]!;
    expect(d.regenKwh).toBeCloseTo(0.05, 9);
  });
  it("registra primer cruce aunque un descenso recupere; cursor concilia reserva", () => {
    const s = flat();
    s.journey.conditions.elevationScale = 1;
    s.energy.socMin = 0.89;
    const half = s.journey.prepared.cycleKm / 2,
      seg = s.journey.prepared.segments[0]!;
    s.journey.prepared.segments = [
      {
        ...seg,
        fromKm: 0,
        toKm: half,
        elevationStartM: 2300,
        elevationEndM: 2450,
      },
      {
        ...seg,
        fromKm: half,
        toKm: 2 * half,
        elevationStartM: 2450,
        elevationEndM: 2300,
      },
    ];
    const d = prepareJourneys(s)[0]!;
    expect(d.firstReserve?.km).toBeLessThan(half);
    expect(journeyAt(d, d.firstReserve!.minute).soc).toBeCloseTo(
      s.energy.socMin,
      8,
    );
    expect(d.regenKwh).toBeGreaterThan(0);
  });
  it("agotamiento no genera batería negativa ni borra energía no cubierta", () => {
    const s = flat();
    s.ev.batteryKwh = 1;
    const d = prepareJourneys(s)[0]!;
    expect(d.firstExhaustion).not.toBeNull();
    expect(d.unmetKwh).toBeGreaterThan(0);
    expect(d.socEnd).toBe(0);
    expect(d.netKwh).toBeCloseTo(
      (s.energy.socMax - d.socEnd) * d.batteryCapacityKwh + d.unmetKwh,
      8,
    );
  });
  it("pausas y adicionales son eventos independientes sin ubicación inventada", () => {
    const s = flat();
    s.operation.cycles = 2;
    s.operation.emptyRatio = 0.1;
    s.journey.days[0]!.pauseMinutes = 20;
    const d = prepareJourneys(s)[0]!;
    expect(d.frames.filter((f) => f.kind === "additional")).toHaveLength(1);
    expect(d.frames.find((f) => f.kind === "additional")!.trace).toBe(0);
    expect(d.workHours).toBeGreaterThan(2.33);
    expect(d.km).toBeCloseTo(2 * s.route.cycleKm * 1.1, 8);
  });
  it("día, sector, clima y congestión cambian una trayectoria; abordajes no crecen con vueltas", () => {
    const s = flat(),
      base = prepareJourneys(s)[0]!;
    s.operation.cycles = 2;
    expect(prepareJourneys(s)[0]!.boardings).toBe(base.boardings);
    s.journey.conditions.congestion = 3;
    const d = prepareJourneys(s)[0]!;
    expect(d.netKwh).toBeGreaterThan(2 * base.netKwh);
    expect(d.workHours).toBeGreaterThan(base.workHours);
    s.journey.conditions.hvac = true;
    s.journey.conditions.temperatureOffsetC = 20;
    expect(prepareJourneys(s)[0]!.netKwh).toBeGreaterThan(d.netKwh);
    s.journey.days[6]!.slots.forEach((slot) => (slot.occupancy = 1.5));
    s.journey.selectedDay = 6;
    const r = evaluateScenario(s);
    expect(r.constraints.find((c) => c.id === "capacity")?.status).toBe("fail");
  });
  it("mezcla reconcilia recaudo y energía sin utilizar sólo el día seleccionado", () => {
    const s = flat(),
      r = evaluateScenario(s),
      m = r.dynamic!.monthly;
    expect(m.boardings).toBeCloseTo(
      s.journey.days.reduce(
        (a, d) => a + d.mixDays * s.operation.boardings * d.boardingsFactor,
        0,
      ),
      8,
    );
    expect(r.ev.months[0]!.revenue).toBeCloseTo(
      m.boardings * s.operation.fare * s.operation.fleet,
      2,
    );
    s.journey.selectedDay = 6;
    expect(evaluateScenario(s).ev.months).toEqual(r.ev.months);
    s.journey.days[0]!.mixDays++;
    expect(ScenarioSchema.safeParse(s).success).toBe(false);
  });
  it("comprueba recarga y jornada por cada perfil operativo", () => {
    const s = flat();
    s.journey.days[6]!.slots.forEach((slot) => (slot.durationFactor = 5));
    s.operation.serviceHours = 2;
    const r = evaluateScenario(s);
    expect(r.constraints.find((c) => c.id === "schedule")?.status).toBe("fail");
    s.energy.siteKw = 0;
    expect(
      evaluateScenario(s).constraints.find((c) => c.id === "charging")?.status,
    ).toBe("fail");
  });
  it("un precio desconocido no produce un resultado financiero", () => {
    const s = selectJourneyVehicle(flat(), "VAN-01");
    const r = evaluateScenario(s);
    expect(r.dynamic!.economicComplete).toBe(false);
    expect(r.ev.months).toEqual([]);
    expect(r.ev.economicCost).toBeNaN();
  });
  it("v1 conserva versión y cálculo; v2 conserva perfil y checksum; migración explícita", async () => {
    const v1 = defaultScenario(),
      r = evaluateScenario(v1);
    expect(r.modelVersion).toBe("1.0.0");
    expect(r.dailyBatteryKwh).toBe(
      v1.route.cycleKm *
        v1.operation.cycles *
        (1 + v1.operation.emptyRatio) *
        v1.ev.consumption,
    );
    const old = await parseScenario(await serializeScenario(v1));
    expect(old).toEqual(v1);
    const v2 = convertToDynamic(old),
      encoded = await serializeScenario(v2);
    expect(await parseScenario(encoded)).toEqual(v2);
    const corrupt = JSON.parse(encoded);
    corrupt.scenario.journey.prepared.segments[0].elevationStartM += 1;
    await expect(parseScenario(JSON.stringify(corrupt))).rejects.toThrow(
      "checksum",
    );
  });
});
