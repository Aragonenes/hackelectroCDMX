export const mxn = (v: number) =>
  !Number.isFinite(v)
    ? "Desconocido"
    : new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        maximumFractionDigits: 0,
      }).format(v);
export const num = (v: number, digits = 1) =>
  Number.isFinite(v)
    ? new Intl.NumberFormat("es-MX", { maximumFractionDigits: digits }).format(
        v,
      )
    : Number.isNaN(v)
      ? "Desconocido"
      : "Sin potencia";
