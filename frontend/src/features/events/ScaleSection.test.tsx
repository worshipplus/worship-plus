import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ScaleSection } from "./ScaleSection";
import type { ScaleEntry } from "../../types/event";
import type { User } from "../../types/user";

const mockScale: ScaleEntry[] = [
  { id: "sc1", userId: "u3", userName: "Fernanda Oliveira", papel: "Vocais" },
  { id: "sc2", userId: "u4", userName: "Ricardo Mendes", papel: "Guitarra" },
];

const mockAvailableUsers: User[] = [
  {
    id: "u5",
    name: "Juliana Castro",
    email: "juliana@worshipplus.app",
    role: "team-member",
    createdAt: "2024-01-20T12:00:00Z",
  },
];

function renderScale(
  overrides: Partial<Parameters<typeof ScaleSection>[0]> = {},
) {
  const defaults = {
    scale: mockScale,
    canEdit: false,
    availableUsers: mockAvailableUsers,
    onAdd: vi.fn().mockReturnValue(null),
    onRemove: vi.fn(),
    onEditPapel: vi.fn(),
  };
  return render(<ScaleSection {...defaults} {...overrides} />);
}

describe("ScaleSection — leitura (Team Member)", () => {
  it("exibe seção de escala com heading", () => {
    renderScale();
    expect(
      screen.getByRole("heading", { name: /escala/i }),
    ).toBeInTheDocument();
  });

  it("exibe integrantes e papéis na escala", () => {
    renderScale();
    expect(screen.getByText("Fernanda Oliveira")).toBeInTheDocument();
    expect(screen.getByText("Vocais")).toBeInTheDocument();
    expect(screen.getByText("Ricardo Mendes")).toBeInTheDocument();
    expect(screen.getByText("Guitarra")).toBeInTheDocument();
  });

  it("exibe badge 'Somente leitura' para team-member", () => {
    renderScale({ canEdit: false });
    expect(screen.getByText(/somente leitura/i)).toBeInTheDocument();
  });

  it("não exibe botões de edição/remoção para team-member", () => {
    renderScale({ canEdit: false });
    expect(
      screen.queryByRole("button", { name: /adicionar/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /editar papel/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /remover/i }),
    ).not.toBeInTheDocument();
  });

  it("exibe mensagem de escala vazia", () => {
    renderScale({ scale: [] });
    expect(
      screen.getByText(/nenhum integrante na escala/i),
    ).toBeInTheDocument();
  });
});

describe("ScaleSection — edição (Admin / Owner)", () => {
  it("exibe botão Adicionar para usuário com canEdit=true", () => {
    renderScale({ canEdit: true });
    expect(
      screen.getByRole("button", { name: /adicionar integrante/i }),
    ).toBeInTheDocument();
  });

  it("exibe botões de editar e remover por integrante", () => {
    renderScale({ canEdit: true });
    const editButtons = screen.getAllByRole("button", {
      name: /editar papel/i,
    });
    const removeButtons = screen.getAllByRole("button", { name: /remover/i });
    expect(editButtons).toHaveLength(mockScale.length);
    expect(removeButtons).toHaveLength(mockScale.length);
  });

  it("chama onRemove ao clicar em Remover integrante", async () => {
    const onRemove = vi.fn();
    renderScale({ canEdit: true, onRemove });
    const btn = screen.getByRole("button", {
      name: /remover fernanda oliveira/i,
    });
    await userEvent.click(btn);
    expect(onRemove).toHaveBeenCalledWith("sc1");
  });

  it("abre modal de adicionar ao clicar no botão Adicionar", async () => {
    renderScale({ canEdit: true });
    await userEvent.click(
      screen.getByRole("button", { name: /adicionar integrante/i }),
    );
    expect(
      screen.getByRole("dialog", { name: /adicionar integrante/i }),
    ).toBeInTheDocument();
  });

  it("chama onAdd ao confirmar adição de integrante", async () => {
    const onAdd = vi.fn().mockReturnValue(null);
    renderScale({ canEdit: true, onAdd });
    await userEvent.click(
      screen.getByRole("button", { name: /adicionar integrante/i }),
    );
    const dialog = screen.getByRole("dialog", {
      name: /adicionar integrante/i,
    });
    const userSelect = within(dialog).getByLabelText(/integrante/i);
    await userEvent.selectOptions(userSelect, "u5");
    const confirmBtn = within(dialog).getByRole("button", {
      name: /^adicionar$/i,
    });
    await userEvent.click(confirmBtn);
    expect(onAdd).toHaveBeenCalledWith(
      "u5",
      "Juliana Castro",
      expect.any(String),
    );
  });

  it("abre modal de editar papel ao clicar em Editar papel", async () => {
    renderScale({ canEdit: true });
    const editBtn = screen.getAllByRole("button", { name: /editar papel/i })[0];
    await userEvent.click(editBtn);
    expect(
      screen.getByRole("dialog", { name: /editar papel/i }),
    ).toBeInTheDocument();
  });

  it("chama onEditPapel ao confirmar edição de papel", async () => {
    const onEditPapel = vi.fn();
    renderScale({ canEdit: true, onEditPapel });
    const editBtn = screen.getAllByRole("button", { name: /editar papel/i })[0];
    await userEvent.click(editBtn);
    const dialog = screen.getByRole("dialog", { name: /editar papel/i });
    const papelSelect = within(dialog).getByLabelText(/papel/i);
    await userEvent.selectOptions(papelSelect, "Baixo");
    await userEvent.click(
      within(dialog).getByRole("button", { name: /salvar/i }),
    );
    expect(onEditPapel).toHaveBeenCalledWith("sc1", "Baixo");
  });

  it("fecha modal de adicionar ao clicar Cancelar", async () => {
    renderScale({ canEdit: true });
    await userEvent.click(
      screen.getByRole("button", { name: /adicionar integrante/i }),
    );
    const dialog = screen.getByRole("dialog", {
      name: /adicionar integrante/i,
    });
    await userEvent.click(
      within(dialog).getByRole("button", { name: /cancelar/i }),
    );
    expect(
      screen.queryByRole("dialog", { name: /adicionar integrante/i }),
    ).not.toBeInTheDocument();
  });
});
