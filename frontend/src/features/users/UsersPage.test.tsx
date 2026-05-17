import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { UsersPage } from "./UsersPage";
import { mockUsers } from "../../mocks/userMocks";
import type { User } from "../../types/user";

vi.mock("../../context/auth", () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from "../../context/auth";

const mockUseAuth = vi.mocked(useAuth);

function makeSetCurrentUser() {
  return vi.fn();
}

function setupUser(user: User | null) {
  mockUseAuth.mockReturnValue({
    currentUser: user,
    setCurrentUser: makeSetCurrentUser(),
  });
}

const adminUser = mockUsers.find((u) => u.role === "admin")!;
const ministroUser = mockUsers.find((u) => u.role === "ministro")!;
const memberUser = mockUsers.find((u) => u.role === "team-member")!;

beforeEach(() => {
  setupUser(adminUser);
});

describe("UsersPage — Admin", () => {
  it("Admin vê botão Novo Usuário", () => {
    render(<UsersPage />);
    expect(
      screen.getByRole("button", { name: /novo usuário/i }),
    ).toBeInTheDocument();
  });

  it("Admin vê botões Editar Privilégio para outros usuários", () => {
    render(<UsersPage />);
    const editButtons = screen.getAllByRole("button", {
      name: /editar privilégio/i,
    });
    expect(editButtons.length).toBeGreaterThan(0);
    // Admin does not see edit button for themselves
    expect(editButtons.length).toBe(mockUsers.length - 1);
  });

  it("Admin não vê botão Editar Privilégio para si mesmo", () => {
    render(<UsersPage />);
    const selfButton = screen.queryByRole("button", {
      name: new RegExp(`editar privilégio de ${adminUser.name}`, "i"),
    });
    expect(selfButton).not.toBeInTheDocument();
  });
});

describe("UsersPage — Ministro", () => {
  beforeEach(() => {
    setupUser(ministroUser);
  });

  it("Ministro não vê botão Novo Usuário", () => {
    render(<UsersPage />);
    expect(
      screen.queryByRole("button", { name: /novo usuário/i }),
    ).not.toBeInTheDocument();
  });

  it("Ministro não vê botões Editar Privilégio", () => {
    render(<UsersPage />);
    expect(
      screen.queryByRole("button", { name: /editar privilégio/i }),
    ).not.toBeInTheDocument();
  });
});

describe("UsersPage — Team Member", () => {
  beforeEach(() => {
    setupUser(memberUser);
  });

  it("Team Member não vê botão Novo Usuário", () => {
    render(<UsersPage />);
    expect(
      screen.queryByRole("button", { name: /novo usuário/i }),
    ).not.toBeInTheDocument();
  });

  it("Team Member não vê botões Editar Privilégio", () => {
    render(<UsersPage />);
    expect(
      screen.queryByRole("button", { name: /editar privilégio/i }),
    ).not.toBeInTheDocument();
  });
});

describe("UsersPage — Cadastro de novo usuário", () => {
  beforeEach(() => {
    setupUser(adminUser);
  });

  it("Admin cadastra novo usuário com todos os campos e ele aparece na lista", () => {
    render(<UsersPage />);

    fireEvent.click(screen.getByRole("button", { name: /novo usuário/i }));

    const dialog = screen.getByRole("dialog", { name: /novo usuário/i });

    fireEvent.change(within(dialog).getByLabelText(/nome/i), {
      target: { value: "Novo Teste" },
    });
    fireEvent.change(within(dialog).getByLabelText(/e-mail/i), {
      target: { value: "novo@teste.com" },
    });
    fireEvent.click(within(dialog).getByRole("button", { name: /salvar/i }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByText("Novo Teste")).toBeInTheDocument();
    expect(screen.getByText("novo@teste.com")).toBeInTheDocument();
  });

  it("Exibe erro ao tentar salvar sem nome", () => {
    render(<UsersPage />);
    fireEvent.click(screen.getByRole("button", { name: /novo usuário/i }));
    const dialog = screen.getByRole("dialog", { name: /novo usuário/i });
    fireEvent.change(within(dialog).getByLabelText(/e-mail/i), {
      target: { value: "teste@teste.com" },
    });
    fireEvent.click(within(dialog).getByRole("button", { name: /salvar/i }));
    expect(screen.getByRole("alert")).toHaveTextContent(/nome é obrigatório/i);
  });

  it("Exibe erro com e-mail inválido", () => {
    render(<UsersPage />);
    fireEvent.click(screen.getByRole("button", { name: /novo usuário/i }));
    const dialog = screen.getByRole("dialog", { name: /novo usuário/i });
    fireEvent.change(within(dialog).getByLabelText(/nome/i), {
      target: { value: "Usuário Teste" },
    });
    fireEvent.change(within(dialog).getByLabelText(/e-mail/i), {
      target: { value: "invalido" },
    });
    fireEvent.click(within(dialog).getByRole("button", { name: /salvar/i }));
    expect(screen.getByRole("alert")).toHaveTextContent(/e-mail válido/i);
  });
});

describe("UsersPage — Lista de usuários", () => {
  it("Exibe todos os usuários mockados com nome, email e badge de privilégio", () => {
    render(<UsersPage />);
    for (const user of mockUsers) {
      expect(screen.getByText(user.name)).toBeInTheDocument();
      expect(screen.getByText(user.email)).toBeInTheDocument();
    }
    expect(screen.getAllByText("Admin").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Ministro").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Membro").length).toBeGreaterThan(0);
  });
});
