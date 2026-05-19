import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { EventDetailPage } from "./EventDetailPage";
import { mockEvents } from "../../mocks/eventMocks";
import { AuthProvider } from "../../context/auth";

function renderDetail(id: string) {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[`/events/${id}`]}>
        <Routes>
          <Route path="/events/:id" element={<EventDetailPage />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
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
    const draftEvent = mockEvents.find((e) => e.eventSetlist.length === 0);
    expect(draftEvent).toBeDefined();
    if (!draftEvent) return;
    renderDetail(draftEvent.id);
    expect(screen.getByText(/nenhuma música no setlist/i)).toBeInTheDocument();
  });
});
