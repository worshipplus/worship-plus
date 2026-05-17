import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { EventDetailPage } from "./EventDetailPage";
import { mockEvents } from "../../mocks/eventMocks";
import { mockSetlistItems } from "../../mocks/setlistMocks";
import { EventsProvider } from "../../context/events";

function renderDetail(
  id: string,
  opts: { role?: "admin" | "ministro" | "team-member"; name?: string } = {},
) {
  return render(
    <EventsProvider>
      <MemoryRouter initialEntries={[`/events/${id}`]}>
        <Routes>
          <Route
            path="/events/:id"
            element={
              <EventDetailPage
                currentUserRole={opts.role ?? "admin"}
                currentUserName={opts.name ?? "Ana Lima"}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    </EventsProvider>,
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
    expect(screen.getAllByRole("link", { name: /youtube link/i })).toHaveLength(
      event.eventSetlist.length,
    );
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
    const draftEvent = mockEvents.find((e) => e.eventSetlist.length === 0);
    expect(draftEvent).toBeDefined();
    if (!draftEvent) return;
    renderDetail(draftEvent.id);
    expect(
      screen.getByText(/nenhuma música no event setlist/i),
    ).toBeInTheDocument();
  });

  it("admin pode adicionar música do Setlist ao Event Setlist", () => {
    const event = mockEvents[0];
    renderDetail(event.id, { role: "admin", name: "Ana Lima" });

    fireEvent.click(
      screen.getByRole("button", { name: /adicionar do setlist/i }),
    );

    const dialog = screen.getByRole("dialog", {
      name: /adicionar música do setlist/i,
    });
    fireEvent.change(within(dialog).getByRole("searchbox"), {
      target: { value: mockSetlistItems[2].title },
    });

    fireEvent.click(
      within(dialog).getByRole("button", {
        name: new RegExp(`adicionar ${mockSetlistItems[2].title}`, "i"),
      }),
    );

    expect(screen.getByText(mockSetlistItems[2].title)).toBeInTheDocument();
    expect(screen.getAllByText(/youtube link/i).length).toBeGreaterThan(0);
  });

  it("admin pode remover música do Event Setlist", () => {
    const event = mockEvents[0];
    renderDetail(event.id, { role: "admin", name: "Ana Lima" });

    const removeButtons = screen.getAllByRole("button", { name: /^remover /i });
    const firstSong = event.eventSetlist[0].title;

    fireEvent.click(removeButtons[0]);

    expect(screen.queryByText(firstSong)).not.toBeInTheDocument();
  });

  it("admin pode reordenar músicas por drag-and-drop", () => {
    const event = mockEvents.find((e) => e.eventSetlist.length >= 2);
    expect(event).toBeDefined();
    if (!event) return;

    renderDetail(event.id, { role: "admin", name: "Ana Lima" });

    const initialTitles = screen
      .getAllByTestId("event-setlist-title")
      .map((node) => node.textContent);

    const listItems = within(
      screen.getByRole("list", { name: /itens do event setlist/i }),
    ).getAllByRole("listitem");

    fireEvent.dragStart(listItems[0]);
    fireEvent.dragOver(listItems[1]);
    fireEvent.drop(listItems[1]);
    fireEvent.dragEnd(listItems[0]);

    const reorderedTitles = screen
      .getAllByTestId("event-setlist-title")
      .map((node) => node.textContent);

    expect(reorderedTitles[0]).toBe(initialTitles[1]);
    expect(reorderedTitles[1]).toBe(initialTitles[0]);
  });

  it("team-member sem ownership não pode editar Event Setlist", () => {
    const event = mockEvents[0];
    renderDetail(event.id, { role: "team-member", name: "Visitante" });

    expect(
      screen.queryByRole("button", { name: /adicionar do setlist/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/apenas admin ou owner podem editar o event setlist/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /^remover /i }),
    ).not.toBeInTheDocument();
  });
});
