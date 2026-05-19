import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { EventsPage } from "./EventsPage";
import { mockEvents } from "../../mocks/eventMocks";

function renderEventsPage() {
  return render(
    <MemoryRouter>
      <EventsPage userRole="admin" />
    </MemoryRouter>,
  );
}

describe("EventsPage", () => {
  it("renderiza a lista de eventos com dados mockados", () => {
    renderEventsPage();
    for (const event of mockEvents) {
      expect(screen.getByText(event.title)).toBeInTheDocument();
    }
  });

  it("filtro 'Todos' exibe todos os eventos", () => {
    renderEventsPage();
    const todoBtn = screen.getByRole("button", { name: /todos/i });
    fireEvent.click(todoBtn);
    for (const event of mockEvents) {
      expect(screen.getByText(event.title)).toBeInTheDocument();
    }
  });

  it("filtro 'Próximos' exibe somente eventos futuros", () => {
    renderEventsPage();
    const proximosBtn = screen.getByRole("button", { name: /próximos/i });
    fireEvent.click(proximosBtn);

    const now = new Date();
    const futureEvents = mockEvents.filter((e) => new Date(e.date) >= now);
    const pastEvents = mockEvents.filter((e) => new Date(e.date) < now);

    for (const event of futureEvents) {
      expect(screen.getByText(event.title)).toBeInTheDocument();
    }
    for (const event of pastEvents) {
      expect(screen.queryByText(event.title)).not.toBeInTheDocument();
    }
  });

  it("card de evento contém título e nome do owner", () => {
    renderEventsPage();
    // Pick an event with a unique owner name in the mock data
    const uniqueOwnerEvent = mockEvents.find((e) => e.owner === "Ana Lima");
    expect(uniqueOwnerEvent).toBeDefined();
    if (!uniqueOwnerEvent) return;
    expect(screen.getByText(uniqueOwnerEvent.title)).toBeInTheDocument();
    expect(screen.getByText(uniqueOwnerEvent.owner)).toBeInTheDocument();
  });

  it("exibe badge de status nos cards", () => {
    renderEventsPage();
    expect(
      screen.getAllByText(/agendado|rascunho|finalizado/i).length,
    ).toBeGreaterThan(0);
  });
});
