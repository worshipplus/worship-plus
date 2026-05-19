import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { EventDetailPage } from "./EventDetailPage";
import { mockEvents } from "../../mocks/eventMocks";

function renderDetail(
  id: string,
  props?: {
    role?: "admin" | "ministro" | "team-member";
    name?: string;
    id?: string;
  },
) {
  return render(
    <MemoryRouter initialEntries={[`/events/${id}`]}>
      <Routes>
        <Route
          path="/events/:id"
          element={
            <EventDetailPage
              currentUserRole={props?.role}
              currentUserName={props?.name}
              currentUserId={props?.id}
            />
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe("EventDetailPage", () => {
  it("renderiza detalhe de evento encontrado", () => {
    const event = mockEvents[0];
    renderDetail(event.id);
    expect(screen.getByText(event.title)).toBeInTheDocument();
    expect(screen.getByText(event.owner)).toBeInTheDocument();
    expect(screen.getByText(event.description)).toBeInTheDocument();
  });

  it("exibe o Event Setlist com as músicas do evento", () => {
    const event = mockEvents[0];
    renderDetail(event.id);
    expect(
      screen.getByRole("heading", { name: /event setlist/i }),
    ).toBeInTheDocument();
    for (const item of event.eventSetlist) {
      expect(screen.getByText(item.title)).toBeInTheDocument();
    }
  });

  it("exibe mensagem de erro para evento não encontrado", () => {
    renderDetail("evento-inexistente-999");
    expect(screen.getByRole("alert")).toHaveTextContent(
      /evento não encontrado/i,
    );
  });

  it("exibe botão voltar para evento encontrado", () => {
    const event = mockEvents[0];
    renderDetail(event.id);
    expect(screen.getByRole("button", { name: /voltar/i })).toBeInTheDocument();
  });

  it("exibe mensagem quando o setlist está vazio", () => {
    const draftEvent = mockEvents.find(
      (event) => event.eventSetlist.length === 0,
    );
    expect(draftEvent).toBeDefined();
    if (!draftEvent) return;
    renderDetail(draftEvent.id);
    expect(screen.getByText(/nenhuma música no setlist/i)).toBeInTheDocument();
  });

  it("admin pode adicionar e remover música no Event Setlist", async () => {
    const user = userEvent.setup();
    const event = mockEvents[0];
    renderDetail(event.id, { role: "admin", name: "Ana Lima", id: "u1" });

    await user.click(screen.getByRole("button", { name: /adicionar música/i }));
    await user.type(
      screen.getByRole("searchbox", { name: /buscar músicas no setlist/i }),
      "Way Maker",
    );
    await user.click(screen.getByRole("button", { name: /^adicionar$/i }));

    expect(screen.getAllByText("Way Maker").length).toBeGreaterThan(0);
    await user.click(screen.getByRole("button", { name: /fechar busca/i }));
    await user.click(
      screen.getByRole("button", { name: /remover way maker/i }),
    );
    expect(screen.queryByText("Way Maker")).not.toBeInTheDocument();
  });

  it("owner do Event pode editar Event Setlist", () => {
    const event = mockEvents[0];
    renderDetail(event.id, {
      role: "ministro",
      name: event.owner,
      id: event.owner_id,
    });
    expect(
      screen.getByRole("button", { name: /adicionar música/i }),
    ).toBeInTheDocument();
  });

  it("usuário sem privilégio não pode editar Event Setlist", () => {
    const event = mockEvents[0];
    renderDetail(event.id, {
      role: "team-member",
      name: "Fernanda Oliveira",
      id: "u3",
    });
    expect(
      screen.queryByRole("button", { name: /adicionar música/i }),
    ).not.toBeInTheDocument();
  });

  it("permite reordenar músicas por drag-and-drop", () => {
    const event = mockEvents[0];
    renderDetail(event.id, { role: "admin", name: "Ana Lima", id: "u1" });

    const initialFirstSong = event.eventSetlist[0].title;
    const secondSong = event.eventSetlist[1].title;
    const firstSongElement = screen.getByText(initialFirstSong).closest("li");
    const secondSongElement = screen.getByText(secondSong).closest("li");
    expect(firstSongElement).toBeTruthy();
    expect(secondSongElement).toBeTruthy();
    if (!firstSongElement || !secondSongElement) return;

    fireEvent.dragStart(firstSongElement);
    fireEvent.dragOver(secondSongElement);
    fireEvent.drop(secondSongElement);

    const titlesAfterReorder = screen
      .getAllByRole("listitem")
      .map((item) => item.textContent ?? "")
      .slice(0, event.eventSetlist.length);
    expect(titlesAfterReorder[0]).toContain(secondSong);
    expect(titlesAfterReorder[1]).toContain(initialFirstSong);
  });
});
