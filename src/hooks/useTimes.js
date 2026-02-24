import { useCallback } from "react";
import useProcesses from "./useProcesses";

export default function useTimes() {
  const { items, loading, error, refresh } = useProcesses();

  const compararEtaEnvioElectronico = useCallback((proceso) => {
    const automatico = proceso?.automatico;
    if (!automatico) return null;

    const dias = automatico.diasHabilesRealEtaEnvioElectronico;
    if (dias == null) return null;

    const regimen = String(proceso?.inicio?.regimen ?? "");
    const transporte = proceso?.postembarque?.tipoTransporte ?? "";

    if (regimen === "10" && transporte === "AEREO") {
      return dias > 1 ? "Atrasado" : "A tiempo";
    }

    return null;
  }, []);

  const calcularFueraTiempo = useCallback((automatico) => {
    if (!automatico) return "-";

    const d1 = automatico.diasHabilesRealEtaEnvioElectronico;
    const d2 = automatico.diasLabEnvioElectronicoSalidaAutorizada;
    const total = automatico.diasLabEtaSalidaAutorizada;

    if (d1 == null && d2 == null && total == null) return "-";

    if ((d1 ?? 0) > 3 || (d2 ?? 0) > 5 || (total ?? 0) > 7) {
      return "Atrasado";
    }

    return "A tiempo";
  }, []);

  return {
    items,
    loading,
    error,
    refresh,
    compararEtaEnvioElectronico,
    calcularFueraTiempo,
  };
}
