import type { VehicleEnergyComparison as Comparison } from "../domain/compareJourneys";
import { num } from "../ui/format";
export default function VehicleEnergyComparison({
  vehicles,
  running,
  progress,
  error,
  onStart,
  onCancel,
  onSelect,
}: {
  vehicles: Comparison[] | null;
  running: boolean;
  progress: { tested: number; total: number };
  error: string;
  onStart: () => void;
  onCancel: () => void;
  onSelect: (id: string) => void;
}) {
  return (
    <section className="panel">
      <h3>Comparación energética de 33 modelos</h3>
      <p>
        Mis­ma jornada, perfiles y condiciones. Los parámetros por variante son
        supuestos F de la auditoría; precios y carga comercial permanecen
        desconocidos.
      </p>
      <button className="secondary" onClick={running ? onCancel : onStart}>
        {running ? "Cancelar comparación" : "Comparar 33 modelos"}
      </button>
      {running && (
        <p role="status">
          Calculando {progress.tested} de {progress.total} modelos…
        </p>
      )}
      {error && <p role="alert">{error}</p>}
      {vehicles && (
        <div
          className="table-scroll"
          role="region"
          aria-label="Comparación energética desplazable"
          tabIndex={0}
        >
          <table>
            <thead>
              <tr>
                <th>Vehículo · F</th>
                <th>kWh/jornada</th>
                <th>SOC cierre</th>
                <th>Primer cruce de reserva</th>
                <th>kWh/mes unidad</th>
                <th>Economía</th>
                <th>Elegir</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.id}>
                  <th scope="row">
                    {v.id} · {v.name}
                  </th>
                  <td>{num(v.netKwh, 2)}</td>
                  <td>{num(v.socEnd * 100, 1)}%</td>
                  <td>
                    {v.firstReserveKm === null
                      ? "Sin cruce"
                      : `${num(v.firstReserveKm, 1)} km`}
                  </td>
                  <td>{num(v.monthlyGridKwh, 1)}</td>
                  <td>Precio desconocido</td>
                  <td>
                    <button
                      className="text-button"
                      onClick={() => onSelect(v.id)}
                    >
                      Usar {v.id}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
