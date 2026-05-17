/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import App from "./App";

describe("PRD-005 event flow", () => {
  afterEach(() => {
    cleanup();
  });

  it("shows validation messages when required fields are missing", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Criar evento" }));

    expect(screen.getByText("Informe o título do evento.")).toBeInTheDocument();
    expect(
      screen.getByText("Informe a data e hora do evento."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Informe a descrição do evento."),
    ).toBeInTheDocument();
  });

  it("allows admin to create a draft event and change the owner", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText("Título"), "Culto da Virada");
    await user.type(screen.getByLabelText("Data e hora"), "2026-12-31T22:00");
    await user.type(
      screen.getByLabelText("Descrição"),
      "Evento especial com contagem regressiva e celebração da igreja.",
    );
    await user.selectOptions(screen.getByLabelText(/Owner/), "user-minister");
    await user.click(screen.getByRole("button", { name: "Criar evento" }));

    const detailSection = screen
      .getByRole("heading", { name: "Culto da Virada" })
      .closest("section");

    expect(
      screen.getByText(
        "Evento criado em rascunho com owner definido por Admin como Lucas Pereira.",
      ),
    ).toBeInTheDocument();
    expect(detailSection).not.toBeNull();
    expect(
      within(detailSection as HTMLElement).getByText("Lucas Pereira"),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Rascunho").length).toBeGreaterThan(0);
  });

  it("keeps owner locked to the minister when the current user is not admin", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.selectOptions(
      screen.getByLabelText("Usuário atual"),
      "user-minister",
    );

    expect(screen.queryByLabelText("Owner")).not.toBeInTheDocument();
    expect(
      screen.getByText("Lucas Pereira", { selector: ".readonly-field" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Owner definido automaticamente como o usuário criador.",
      ),
    ).toBeInTheDocument();
  });

  it("shows automatic owner feedback when a minister creates an event", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.selectOptions(
      screen.getByLabelText("Usuário atual"),
      "user-minister",
    );
    await user.type(screen.getByLabelText("Título"), "Culto de Oração");
    await user.type(screen.getByLabelText("Data e hora"), "2026-06-10T20:00");
    await user.type(
      screen.getByLabelText("Descrição"),
      "Encontro semanal com foco em oração e ministrações espontâneas.",
    );
    await user.click(screen.getByRole("button", { name: "Criar evento" }));

    const detailSection = screen
      .getByRole("heading", { name: "Culto de Oração" })
      .closest("section");
    const ownerGroup =
      detailSection && within(detailSection).getByText("Owner").closest("div");

    expect(
      screen.getByText(
        "Evento criado em rascunho com owner definido automaticamente como Lucas Pereira.",
      ),
    ).toBeInTheDocument();
    expect(detailSection).not.toBeNull();
    expect(ownerGroup).not.toBeNull();
    expect(ownerGroup as HTMLElement).toHaveTextContent("Lucas Pereira");
  });

  it("blocks team member from creating events or editing the event setlist", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.selectOptions(
      screen.getByLabelText("Usuário atual"),
      "user-team-member",
    );

    expect(screen.getByRole("button", { name: "Criar evento" })).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Adicionar música" }),
    ).toBeDisabled();
    expect(
      screen.getByText(/Team Member não pode criar Event/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/não é Admin nem owner do evento selecionado/i),
    ).toBeInTheDocument();
  });

  it("adds, reorders with drag and drop, and removes songs from the event setlist", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Adicionar música" }));
    await user.type(screen.getByLabelText("Buscar no Setlist"), "santo");
    await user.click(screen.getByRole("button", { name: "Adicionar" }));

    const setlist = screen.getByRole("list", { name: "Event Setlist" });
    const orderedTitlesBefore = within(setlist)
      .getAllByRole("heading", { level: 3 })
      .map((heading) => heading.textContent);

    expect(orderedTitlesBefore).toEqual([
      "Graça Sobre Graça",
      "Oceans",
      "Santo Pra Sempre",
    ]);
    expect(screen.getAllByText("YouTube Link").length).toBeGreaterThan(2);

    const listItems = within(setlist).getAllByRole("listitem");
    fireEvent.dragStart(listItems[2]);
    fireEvent.dragEnter(listItems[0]);
    fireEvent.dragOver(listItems[0]);
    fireEvent.drop(listItems[0]);
    fireEvent.dragEnd(listItems[2]);

    const orderedTitlesAfterDrop = within(setlist)
      .getAllByRole("heading", { level: 3 })
      .map((heading) => heading.textContent);

    expect(orderedTitlesAfterDrop).toEqual([
      "Santo Pra Sempre",
      "Graça Sobre Graça",
      "Oceans",
    ]);

    await user.click(
      screen.getByRole("button", { name: "Remover Santo Pra Sempre" }),
    );

    expect(
      screen.queryByRole("heading", { name: "Santo Pra Sempre" }),
    ).not.toBeInTheDocument();
  });
});
