import { act } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import toast from "react-hot-toast";
import useProcesses from "./useProcesses";
import processService from "../services/processService";

jest.mock("../services/processService", () => ({
  __esModule: true,
  default: {
    listAll: jest.fn(),
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
    const mockItems = [{ _id: "1" }, { _id: "2" }];
    processService.listAll.mockResolvedValue(mockItems);

    const { result } = renderHook(() => useProcesses());

    // Al inicio se espera estado de carga.
    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(processService.listAll).toHaveBeenCalledTimes(1);
    expect(result.current.items).toEqual(mockItems);
    expect(result.current.error).toBeNull();
  });

  test("expone pagination derivada de la carga completa", async () => {
    const mockItems = [{ _id: "1" }, { _id: "2" }];
    processService.listAll.mockResolvedValue(mockItems);

    const { result } = renderHook(() => useProcesses());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.pagination).toEqual({
      page: 1,
      limit: 2,
      total: 2,
      totalPages: 1,
    });
  });

  test("no dispara fetch automatico cuando autoFetch=false y permite refresh manual", async () => {
    processService.listAll.mockResolvedValue([{ _id: "3" }]);

    const { result } = renderHook(() => useProcesses({ autoFetch: false }));

    expect(processService.listAll).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);

    // Ejecuta el refresh dentro de act para sincronizar updates del hook.
    await act(async () => {
      await result.current.refresh();
    });

    expect(processService.listAll).toHaveBeenCalledTimes(1);
    expect(result.current.items).toEqual([{ _id: "3" }]);
  });

  test("setea error, limpia items y muestra toast cuando falla", async () => {
    const fetchError = new Error("network error");
    processService.listAll.mockRejectedValue(fetchError);

    const { result } = renderHook(() => useProcesses());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.items).toEqual([]);
    expect(result.current.error).toBe(fetchError);
    expect(toast.error).toHaveBeenCalledWith("No se pudieron cargar los registros");
  });

  test("soporta respuesta de array sin romper", async () => {
    const mockItems = [{ _id: "1" }];
    processService.listAll.mockResolvedValue(mockItems);

    const { result } = renderHook(() => useProcesses());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.items).toEqual(mockItems);
  });
});
