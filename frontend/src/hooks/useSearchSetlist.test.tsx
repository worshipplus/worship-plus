import { describe, it, expect, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useSearchSetlist } from "./useSearchSetlist";
import type { DataSources } from "../context/providers";

vi.mock("../context/providers", () => ({
  useDataSources: vi.fn(),
}));

import { useDataSources } from "../context/providers";

const mockUseDataSources = vi.mocked(useDataSources);

const stubUserSource = { getAll: async () => [] };
const stubEventSource = { getAll: async () => [] };

describe("useSearchSetlist", () => {
  it("retorna loading=true inicialmente e loading=false com dados após resolução", async () => {
    const setlistSource = {
      getAll: vi.fn().mockResolvedValue([
        {
          id: "1",
          title: "Oceans",
          author: "Hillsong",
          key: "D",
          youtubeUrl: "https://www.youtube.com/watch?v=1",
          createdAt: "2024-01-01T00:00:00Z",
        },
      ]),
    };
    mockUseDataSources.mockReturnValue({
      setlistSource,
      userSource: stubUserSource,
      eventSource: stubEventSource,
    } as DataSources);

    const { result } = renderHook(() => useSearchSetlist(""));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data[0].title).toBe("Oceans");
    expect(result.current.error).toBeNull();
  });

  it("retorna error quando a source falha", async () => {
    const setlistSource = {
      getAll: vi.fn().mockRejectedValue(new Error("Erro de rede")),
    };
    mockUseDataSources.mockReturnValue({
      setlistSource,
      userSource: stubUserSource,
      eventSource: stubEventSource,
    } as DataSources);

    const { result } = renderHook(() => useSearchSetlist(""));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe("Erro de rede");
    expect(result.current.data).toHaveLength(0);
  });

  it("passa a query para o use case e retorna itens filtrados", async () => {
    const setlistSource = {
      getAll: vi.fn().mockResolvedValue([
        {
          id: "1",
          title: "Oceans",
          author: "Hillsong",
          key: "D",
          youtubeUrl: "https://www.youtube.com/watch?v=1",
          createdAt: "2024-01-01",
        },
        {
          id: "2",
          title: "Way Maker",
          author: "Sinach",
          key: "G",
          youtubeUrl: "https://www.youtube.com/watch?v=2",
          createdAt: "2024-01-02",
        },
      ]),
    };
    mockUseDataSources.mockReturnValue({
      setlistSource,
      userSource: stubUserSource,
      eventSource: stubEventSource,
    } as DataSources);

    const { result } = renderHook(() => useSearchSetlist("way"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data[0].title).toBe("Way Maker");
  });
});
