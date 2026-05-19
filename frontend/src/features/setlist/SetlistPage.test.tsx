import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { SetlistPage } from "./SetlistPage";
import { mockSetlistItems } from "../../mocks/setlistMocks";

describe("SetlistPage", () => {
  it("renderiza a lista com dados mockados", () => {
    render(<SetlistPage userRole="admin" />);
    for (const item of mockSetlistItems) {
      expect(screen.getByText(item.title)).toBeInTheDocument();
    }
  });

  it("admin vê o botão Adicionar", () => {
    render(<SetlistPage userRole="admin" />);
    expect(
      screen.getByRole("button", { name: /adicionar/i }),
    ).toBeInTheDocument();
  });

  it("ministro vê o botão Adicionar", () => {
    render(<SetlistPage userRole="ministro" />);
    expect(
      screen.getByRole("button", { name: /adicionar/i }),
    ).toBeInTheDocument();
  });

  it("team-member não vê o botão Adicionar", () => {
    render(<SetlistPage userRole="team-member" />);
    expect(
      screen.queryByRole("button", { name: /adicionar/i }),
    ).not.toBeInTheDocument();
  });

  it("team-member não vê botões de editar e remover", () => {
    render(<SetlistPage userRole="team-member" />);
    expect(
      screen.queryByRole("button", { name: /editar/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /remover/i }),
    ).not.toBeInTheDocument();
  });

  it("exibe erro ao tentar salvar sem youtubeUrl", () => {
    render(<SetlistPage userRole="admin" />);
    fireEvent.click(screen.getByRole("button", { name: /adicionar/i }));

    const dialog = screen.getByRole("dialog");
    const titleInput = within(dialog).getByLabelText(/título/i);
    const authorInput = within(dialog).getByLabelText(/autor/i);

    fireEvent.change(titleInput, { target: { value: "Minha Música" } });
    fireEvent.change(authorInput, { target: { value: "Autor Teste" } });

    fireEvent.click(within(dialog).getByRole("button", { name: /salvar/i }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      /link do youtube é obrigatório/i,
    );
  });

  it("exibe erro de URL inválida do YouTube", () => {
    render(<SetlistPage userRole="admin" />);
    fireEvent.click(screen.getByRole("button", { name: /adicionar/i }));

    const dialog = screen.getByRole("dialog");
    const titleInput = within(dialog).getByLabelText(/título/i);
    const authorInput = within(dialog).getByLabelText(/autor/i);
    const urlInput = within(dialog).getByLabelText(/link do youtube/i);

    fireEvent.change(titleInput, { target: { value: "Minha Música" } });
    fireEvent.change(authorInput, { target: { value: "Autor Teste" } });
    fireEvent.change(urlInput, {
      target: { value: "https://naoeyoutube.com" },
    });

    fireEvent.click(within(dialog).getByRole("button", { name: /salvar/i }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      /link válido do youtube/i,
    );
  });

  it("remove item da lista ao clicar em remover", () => {
    render(<SetlistPage userRole="admin" />);
    const firstItem = mockSetlistItems[0];
    expect(screen.getByText(firstItem.title)).toBeInTheDocument();

    const removeButtons = screen.getAllByRole("button", { name: /^remover /i });
    fireEvent.click(removeButtons[0]);

    expect(screen.queryByText(firstItem.title)).not.toBeInTheDocument();
  });

  it("adiciona novo item com dados válidos", () => {
    render(<SetlistPage userRole="admin" />);
    fireEvent.click(screen.getByRole("button", { name: /adicionar/i }));

    const dialog = screen.getByRole("dialog");
    fireEvent.change(within(dialog).getByLabelText(/título/i), {
      target: { value: "Nova Música" },
    });
    fireEvent.change(within(dialog).getByLabelText(/autor/i), {
      target: { value: "Novo Autor" },
    });
    fireEvent.change(within(dialog).getByLabelText(/link do youtube/i), {
      target: { value: "https://www.youtube.com/watch?v=abc123" },
    });

    fireEvent.click(within(dialog).getByRole("button", { name: /salvar/i }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByText("Nova Música")).toBeInTheDocument();
  });

  it("filtra itens pelo campo de busca", () => {
    render(<SetlistPage userRole="admin" />);
    const searchInput = screen.getByRole("searchbox");
    fireEvent.change(searchInput, {
      target: { value: mockSetlistItems[0].title },
    });

    expect(screen.getByText(mockSetlistItems[0].title)).toBeInTheDocument();
    expect(
      screen.queryByText(mockSetlistItems[1].title),
    ).not.toBeInTheDocument();
  });
});
