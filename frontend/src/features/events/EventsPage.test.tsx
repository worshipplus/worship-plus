import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { EventsPage } from "./EventsPage";
import { mockEvents } from "../../mocks/eventMocks";
import { EventsProvider } from "../../context/events";

function renderEventsPage(
  role: "admin" | "ministro" | "team-member" = "admin",
) {
  return render(
    <EventsProvider>
      <MemoryRouter>
        <EventsPage userRole={role} />
      </MemoryRouter>
    </EventsProvider>,
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
    const uniqueOwnerEvent = mockEvents.find((e) => e.owner === "Ana Oliveira");
    expect(uniqueOwnerEvent).toBeDefined();
    if (!uniqueOwnerEvent) return;
    expect(screen.getByText(uniqueOwnerEvent.title)).toBeInTheDocument();
    expect(screen.getByText(uniqueOwnerEvent.owner)).toBeInTheDocument();
  });

  it("exibe badge de status nos cards", () => {
    renderEventsPage();
    expect(
      screen.getAllByText(/agendado|rascunho|locked event/i).length,
    ).toBeGreaterThan(0);
  });

  it("admin e ministro veem ação de criar event", () => {
    const adminRender = renderEventsPage("admin");
    expect(
      screen.getByRole("button", { name: /criar event/i }),
    ).toBeInTheDocument();
    adminRender.unmount();

    renderEventsPage("ministro");
    expect(
      screen.getByRole("button", { name: /criar event/i }),
    ).toBeInTheDocument();
  });

  it("team-member vê ação desabilitada com explicação", () => {
    renderEventsPage("team-member");
    const button = screen.getByRole("button", {
      name: /criar event indisponível/i,
    });
    expect(button).toBeDisabled();
    expect(
      screen.getByText(/apenas admin e ministro podem criar event/i),
    ).toBeInTheDocument();
  });
});
