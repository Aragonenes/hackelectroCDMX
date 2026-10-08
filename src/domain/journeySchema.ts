import { z } from "zod";
const finite = z.number().finite();
const nonnegative = finite.nonnegative();
const fraction = nonnegative.max(1);
const coordinate = z.tuple([
  finite.min(-180).max(180),
  finite.min(-90).max(90),
]);
export const JourneySchema = z.object({
  selectedDay: nonnegative.int().max(6),
  season: z.enum(["fria", "calida", "lluvias"]),
  vehicleId: z.string().min(1).max(100),
  purchasePrice: nonnegative.max(100_000_000).nullable(),
  chargePowerConfirmed: z.boolean(),
  conditions: z.object({
    temperatureOffsetC: finite.min(-40).max(40),
    wet: z.boolean(),
    hvac: z.boolean(),
    congestion: finite.min(0.25).max(5),
    elevationScale: nonnegative.max(3),
  }),
  technical: z.object({
    massKg: finite.min(500).max(40000),
    passengerKg: finite.min(1).max(200),
    baseOccupancy: fraction,
    referenceTemperatureC: finite.min(-30).max(50),
    auxiliaryKw: nonnegative.max(100),
    hvacKwPerC: nonnegative.max(10),
    hvacDeadbandC: nonnegative.max(30),
    rollingCoefficient: nonnegative.max(0.1),
    wetRollingIncrease: nonnegative.max(2),
    driveEfficiency: finite.min(0.01).max(1),
    regenEfficiency: fraction,
    regenMaxKw: nonnegative.max(1000),
  }),
  chargeStartMinute: nonnegative.int().max(1439),
  days: z
    .array(
      z
        .object({
          name: z.string().min(1).max(50),
          mixDays: nonnegative.int().max(31),
          startMinute: nonnegative.int().max(1439),
          pauseMinutes: nonnegative.max(600),
          boardingsFactor: nonnegative.max(10),
          slots: z
            .array(
              z.object({
                weight: nonnegative.max(100),
                occupancy: nonnegative.max(2),
                durationFactor: finite.min(0.25).max(5),
              }),
            )
            .length(96),
        })
        .superRefine((d, c) => {
          if (!d.slots.some((s) => s.weight > 0))
            c.addIssue({
              code: "custom",
              message: "La distribución de abordajes requiere peso positivo.",
            });
        }),
    )
    .length(7),
  sectors: z
    .array(
      z.object({
        occupancyFactor: nonnegative.max(3),
        durationFactor: finite.min(0.25).max(5),
      }),
    )
    .length(6),
  climate: z.object({
    sourceId: z.string().min(1),
    station: z.string().min(1),
    years: z.string().min(1),
    coverage: z.string().min(1),
    profiles: z.object({
      fria: z.array(finite.min(-50).max(60)).length(24),
      calida: z.array(finite.min(-50).max(60)).length(24),
      lluvias: z.array(finite.min(-50).max(60)).length(24),
    }),
  }),
  prepared: z
    .object({
      routeId: z.string().min(1),
      cycleKm: finite.positive(),
      sampleM: finite.positive(),
      smoothing: z.string().min(1),
      terrain: z.string().min(1),
      terrainSha256: z.string().regex(/^[a-f0-9]{64}$/),
      geometrySha256: z.string().regex(/^[a-f0-9]{64}$/),
      sourceId: z.string().min(1),
      segments: z
        .array(
          z.object({
            trace: finite.int().min(1).max(2),
            sector: nonnegative.int().max(2),
            fromKm: nonnegative,
            toKm: finite.positive(),
            start: coordinate,
            end: coordinate,
            elevationStartM: finite.min(-500).max(9000),
            elevationEndM: finite.min(-500).max(9000),
          }),
        )
        .min(1)
        .max(5000),
    })
    .superRefine((p, c) => {
      let end = 0;
      for (const s of p.segments) {
        if (s.toKm <= s.fromKm || Math.abs(s.fromKm - end) > 1e-6)
          c.addIssue({
            code: "custom",
            message:
              "Los tramos deben ser positivos y consecutivos en distancia.",
          });
        end = s.toKm;
      }
      if (Math.abs(end - p.cycleKm) > 1e-6)
        c.addIssue({
          code: "custom",
          message: "El perfil no concilia la longitud preparada.",
        });
    }),
  evidence: z.record(
    z.string(),
    z.object({
      sourceId: z.string(),
      status: z.enum(["verificado", "derivado", "supuesto", "desconocido"]),
      limitation: z.string(),
    }),
  ),
});
export type Journey = z.infer<typeof JourneySchema>;
