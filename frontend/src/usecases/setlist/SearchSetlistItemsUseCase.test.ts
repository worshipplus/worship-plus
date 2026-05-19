import { describe, it, expect } from "vitest";
import { SearchSetlistItemsUseCase } from "./SearchSetlistItemsUseCase";
import type { SetlistSource } from "../../adapters/contracts/SetlistSource";
import type { SetlistItem } from "../../types/setlist";

const testItems: SetlistItem[] = [
  {
    id: "1",
    title: "Oceans",
    author: "Hillsong United",
    key: "D",
    youtubeUrl: "https://www.youtube.com/watch?v=dy9nwe9_xzw",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    title: "Reckless Love",
    author: "Cory Asbury",
    key: "E",
    youtubeUrl: "https://www.youtube.com/watch?v=Sc6SSHuZvQE",
    createdAt: "2024-01-02T00:00:00Z",
  },
  {
    id: "3",
    title: "Way Maker",
    author: "Sinach",
    key: "G",
    youtubeUrl: "https://www.youtube.com/watch?v=inju9m_QjeQ",
    createdAt: "2024-01-03T00:00:00Z",
  },
];

const source: SetlistSource = {
  getAll: async () => testItems,
};

describe("SearchSetlistItemsUseCase", () => {
  it("retorna todos os itens quando a query está vazia", async () => {
    const result = await new SearchSetlistItemsUseCase(source).execute("");
    expect(result).toHaveLength(3);
  });

  it("filtra itens pelo título (case insensitive)", async () => {
    const result = await new SearchSetlistItemsUseCase(source).execute(
      "oceans",
    );
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Oceans");
  });

  it("filtra itens pelo autor", async () => {
    const result = await new SearchSetlistItemsUseCase(source).execute("Cory");
    expect(result).toHaveLength(1);
    expect(result[0].author).toBe("Cory Asbury");
  });

  it("retorna lista vazia para query sem correspondência", async () => {
    const result = await new SearchSetlistItemsUseCase(source).execute(
      "ZZZinexistente",
    );
    expect(result).toHaveLength(0);
  });

  it("ignora espaços em branco na query", async () => {
    const result = await new SearchSetlistItemsUseCase(source).execute(
      "   way   ",
    );
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Way Maker");
  });
});
