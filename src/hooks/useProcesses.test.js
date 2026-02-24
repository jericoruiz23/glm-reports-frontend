import { act } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import toast from "react-hot-toast";
import useProcesses from "./useProcesses";
import processService from "../services/processService";

jest.mock("../services/processService", () => ({
  __esModule: true,
  default: {
    list: jest.fn(),
  },
}));

jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
  },
}));

describe("useProcesses", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("carga procesos automaticamente cuando autoFetch=true", async () => {
    processService.list.mockResolvedValue([{ _id: "1" }, { _id: "2" }]);

    const { result } = renderHook(() => useProcesses());

    // Al inicio se espera estado de carga.
    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(processService.list).toHaveBeenCalledTimes(1);
    expect(result.current.items).toEqual([{ _id: "1" }, { _id: "2" }]);
    expect(result.current.error).toBeNull();
  });

  test("no dispara fetch automatico cuando autoFetch=false y permite refresh manual", async () => {
    processService.list.mockResolvedValue([{ _id: "3" }]);

    const { result } = renderHook(() => useProcesses({ autoFetch: false }));

    expect(processService.list).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);

    // Ejecuta el refresh dentro de act para sincronizar updates del hook.
    await act(async () => {
      await result.current.refresh();
    });

    expect(processService.list).toHaveBeenCalledTimes(1);
    expect(result.current.items).toEqual([{ _id: "3" }]);
  });

  test("setea error, limpia items y muestra toast cuando falla", async () => {
    const fetchError = new Error("network error");
    processService.list.mockRejectedValue(fetchError);

    const { result } = renderHook(() => useProcesses());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.items).toEqual([]);
    expect(result.current.error).toBe(fetchError);
    expect(toast.error).toHaveBeenCalledWith("No se pudieron cargar los registros");
  });
});
