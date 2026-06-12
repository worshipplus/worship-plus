import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { EventsPage } from "./EventsPage";
import { EVENT_DATA } from "../../adapters/implementations/MockEventSource";
import { USER_DATA } from "../../adapters/implementations/MockUserSource";

vi.mock("../../hooks/useGetEventsByOwner", () => ({
  useGetEventsByOwner: vi.fn(),
}));
vi.mock("../../hooks/useGetAllUsers", () => ({
  useGetAllUsers: vi.fn(),
}));

import { useGetEventsByOwner } from "../../hooks/useGetEventsByOwner";
import { useGetAllUsers } from "../../hooks/useGetAllUsers";

const mockUseGetEventsByOwner = vi.mocked(useGetEventsByOwner);
const mockUseGetAllUsers = vi.mocked(useGetAllUsers);

beforeEach(() => {
  mockUseGetEventsByOwner.mockReturnValue({
    data: EVENT_DATA,
    loading: false,
    error: null,
  });
  mockUseGetAllUsers.mockReturnValue({
    data: USER_DATA,
    loading: false,
    error: null,
  });
});

function renderEventsPage({
  userRole = "admin",
  currentUserName = "Ana Lima",
}: {
  userRole?: "admin" | "ministro" | "team-member";
  currentUserName?: string;
} = {}) {
  return render(
    <MemoryRouter>
      <EventsPage userRole={userRole} currentUserName={currentUserName} />
    </MemoryRouter>,
  );
}

describe("EventsPage", () => {
  it("renderiza a lista de eventos com dados mockados", () => {
    renderEventsPage();
    for (const event of EVENT_DATA) {
      expect(screen.getByText(event.title)).toBeInTheDocument();
    }
  });

  it("filtro 'Todos' exibe todos os eventos", () => {
    renderEventsPage();
    const todoBtn = screen.getByRole("button", { name: /todos/i });
    fireEvent.click(todoBtn);
    for (const event of EVENT_DATA) {
      expect(screen.getByText(event.title)).toBeInTheDocument();
    }
  });

  it("filtro 'Próximos' exibe somente eventos futuros", () => {
    renderEventsPage();
    const proximosBtn = screen.getByRole("button", { name: /próximos/i });
    fireEvent.click(proximosBtn);

    const now = new Date();
    const futureEvents = EVENT_DATA.filter((e) => new Date(e.date) >= now);
    const pastEvents = EVENT_DATA.filter((e) => new Date(e.date) < now);

    for (const event of futureEvents) {
      expect(screen.getByText(event.title)).toBeInTheDocument();
    }
    for (const event of pastEvents) {
      expect(screen.queryByText(event.title)).not.toBeInTheDocument();
    }
  });

  it("card de evento contém título e nome do owner", () => {
    renderEventsPage();
    const uniqueOwnerEvent = EVENT_DATA.find((e) => e.owner === "Ana Lima");
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

  it("team-member não pode criar Event", () => {
    renderEventsPage({ userRole: "team-member" });
    const createButton = screen.getByRole("button", { name: /criar event/i });
    expect(createButton).toBeDisabled();
    expect(createButton).toHaveAttribute(
      "title",
      "Somente Admin e Ministro podem criar Event.",
    );
  });

  it("team-member não visualiza Event em rascunho de outro Owner", () => {
    renderEventsPage({ userRole: "team-member", currentUserName: "Ana Lima" });
    expect(
      screen.queryByText("Culto de Células — Rascunho"),
    ).not.toBeInTheDocument();
  });

  it("team-member visualiza Event em rascunho quando for o Owner", () => {
    renderEventsPage({
      userRole: "team-member",
      currentUserName: "Carlos Souza",
    });
    expect(screen.getByText("Culto de Células — Rascunho")).toBeInTheDocument();
  });

  it("admin cria Event em rascunho com owner automático", async () => {
    const user = userEvent.setup();
    renderEventsPage({ userRole: "admin", currentUserName: "Ana Lima" });

    await user.click(screen.getByRole("button", { name: /criar event/i }));
    await user.type(screen.getByLabelText(/título/i), "Novo Event de Teste");
    await user.type(screen.getByLabelText(/data\/hora/i), "2031-10-20T10:30");
    await user.type(
      screen.getByLabelText(/descrição/i),
      "Descrição do novo evento de teste.",
    );
    const dialog = screen.getByRole("dialog", { name: /criar event/i });
    await user.click(
      within(dialog).getByRole("button", { name: /^criar event$/i }),
    );

    const newEventCard = screen.getByRole("button", {
      name: /ver detalhes de novo event de teste/i,
    });
    expect(screen.getByText("Novo Event de Teste")).toBeInTheDocument();
    expect(within(newEventCard).getByText("Ana Lima")).toBeInTheDocument();
    expect(within(newEventCard).getByText("Rascunho")).toBeInTheDocument();
  });

  it("admin pode alterar owner na criação", async () => {
    const user = userEvent.setup();
    renderEventsPage({ userRole: "admin", currentUserName: "Ana Lima" });

    await user.click(screen.getByRole("button", { name: /criar event/i }));
    await user.type(
      screen.getByLabelText(/título/i),
      "Event com Owner Alterado",
    );
    await user.type(screen.getByLabelText(/data\/hora/i), "2031-10-21T10:30");
    await user.type(screen.getByLabelText(/descrição/i), "Descrição");
    await user.selectOptions(screen.getByLabelText(/owner/i), "Carlos Souza");
    const dialog = screen.getByRole("dialog", { name: /criar event/i });
    await user.click(
      within(dialog).getByRole("button", { name: /^criar event$/i }),
    );

    const createdEventCard = screen.getByRole("button", {
      name: /ver detalhes de event com owner alterado/i,
    });
    expect(screen.getByText("Event com Owner Alterado")).toBeInTheDocument();
    expect(
      within(createdEventCard).getByText("Carlos Souza"),
    ).toBeInTheDocument();
  });
});
