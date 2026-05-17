import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { EventCreatePage } from "./EventCreatePage";
import { EventDetailPage } from "./EventDetailPage";
import { EventsProvider } from "../../context/events";

function renderCreatePage(
  role: "admin" | "ministro" | "team-member",
  name: string,
) {
  return render(
    <EventsProvider>
      <MemoryRouter initialEntries={["/events/new"]}>
        <Routes>
          <Route
            path="/events/new"
            element={
              <EventCreatePage currentUserRole={role} currentUserName={name} />
            }
          />
          <Route
            path="/events/:id"
            element={
              <EventDetailPage currentUserRole={role} currentUserName={name} />
            }
          />
        </Routes>
      </MemoryRouter>
    </EventsProvider>,
  );
}

describe("EventCreatePage", () => {
  it("team-member não pode criar Event", () => {
    renderCreatePage("team-member", "Visitante");
    expect(screen.getByRole("alert")).toHaveTextContent(
      /apenas admin e ministro podem criar event/i,
    );
  });

  it("ministro cria Event com owner automático e status rascunho", () => {
    renderCreatePage("ministro", "Carlos Souza");

    fireEvent.change(screen.getByLabelText(/título/i), {
      target: { value: "Event de teste" },
    });
    fireEvent.change(screen.getByLabelText(/data e hora/i), {
      target: { value: "2099-12-25T19:30" },
    });
    fireEvent.change(screen.getByLabelText(/descrição/i), {
      target: { value: "Descrição de teste" },
    });

    fireEvent.click(screen.getByRole("button", { name: /criar event/i }));

    expect(screen.getByText("Event de teste")).toBeInTheDocument();
    expect(screen.getByText("Carlos Souza")).toBeInTheDocument();
    expect(screen.getByText(/rascunho/i)).toBeInTheDocument();
  });

  it("admin pode alterar owner ao criar Event", () => {
    renderCreatePage("admin", "Ana Lima");

    fireEvent.change(screen.getByLabelText(/título/i), {
      target: { value: "Event com owner alterado" },
    });
    fireEvent.change(screen.getByLabelText(/data e hora/i), {
      target: { value: "2099-11-20T20:00" },
    });
    fireEvent.change(screen.getByLabelText(/descrição/i), {
      target: { value: "Descrição do event" },
    });
    fireEvent.change(screen.getByLabelText(/^owner/i), {
      target: { value: "Carlos Souza" },
    });

    fireEvent.click(screen.getByRole("button", { name: /criar event/i }));

    expect(screen.getByText("Event com owner alterado")).toBeInTheDocument();
    expect(screen.getByText("Carlos Souza")).toBeInTheDocument();
  });

  it("exibe erros quando campos obrigatórios não são preenchidos", () => {
    renderCreatePage("admin", "Ana Lima");

    fireEvent.click(screen.getByRole("button", { name: /criar event/i }));

    const alerts = screen.getAllByRole("alert");
    expect(alerts.length).toBeGreaterThan(0);
    expect(
      within(
        screen.getByLabelText(/formulário de criação de event/i)
          .parentElement as HTMLElement,
      ).getByText(/título é obrigatório/i),
    ).toBeInTheDocument();
  });
});
