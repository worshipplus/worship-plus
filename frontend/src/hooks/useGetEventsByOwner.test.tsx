import { describe, it, expect, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useGetEventsByOwner } from "./useGetEventsByOwner";
import type { DataSources } from "../context/providers";

vi.mock("../context/providers", () => ({
  useDataSources: vi.fn(),
}));

import { useDataSources } from "../context/providers";

const mockUseDataSources = vi.mocked(useDataSources);

const stubSetlistSource = { getAll: async () => [] };
const stubUserSource = { getAll: async () => [] };

describe("APP-001/APP-004: Resilência de hook em falha de rede", () => {
  it("retorna loading=false e error preenchido quando source rejeita", async () => {
    const eventSource = {
      getAll: vi.fn().mockRejectedValue(new Error("Falha de rede")),
    };
    mockUseDataSources.mockReturnValue({
      eventSource,
      setlistSource: stubSetlistSource,
      userSource: stubUserSource,
    } as DataSources);

    const { result } = renderHook(() => useGetEventsByOwner());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe("Falha de rede");
    expect(result.current.data).toHaveLength(0);
  });

  it("não mantém loading=true após erro (tela não fica travada)", async () => {
    const eventSource = {
      getAll: vi.fn().mockRejectedValue(new Error("Timeout")),
    };
    mockUseDataSources.mockReturnValue({
      eventSource,
      setlistSource: stubSetlistSource,
      userSource: stubUserSource,
    } as DataSources);

    const { result } = renderHook(() => useGetEventsByOwner());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toHaveLength(0);
  });
});
