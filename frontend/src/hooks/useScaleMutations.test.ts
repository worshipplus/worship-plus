import { describe, it, expect } from "vitest";
import { useScaleMutations } from "./useScaleMutations";
import type { Event } from "../types/event";
import type { User } from "../types/user";

const users: User[] = [
  {
    id: "u1",
    name: "Admin",
    email: "admin@test.com",
    role: "admin",
    primaryScaleRole: "Teclado",
    secondaryScaleRoles: ["Vocais"],
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "u2",
    name: "Membro",
    email: "membro@test.com",
    role: "team-member",
    primaryScaleRole: "Violão",
    secondaryScaleRoles: ["Vocais"],
    createdAt: "2024-01-01T00:00:00Z",
  },
];

const openEvent: Event = {
  id: "ev1",
  title: "Culto",
  date: "2030-01-01T10:00:00Z",
  status: "scheduled",
  owner: "Admin",
  owner_id: "u1",
  description: "Evento de teste",
  eventSetlist: [],
  scale: [{ id: "sc1", userId: "u2", userName: "Membro", papel: "Violão" }],
};

describe("useScaleMutations", () => {
  it("sugere papel principal ao adicionar integrante sem papel informado", () => {
    const { addToScale } = useScaleMutations("admin", "u1", users);
    const result = addToScale(
      { ...openEvent, scale: [] },
      "u2",
      "Membro",
      undefined,
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.entry.papel).toBe("Violão");
    expect(result.domainEvent).toBe("MemberRoleSetInEvent");
  });

  it("atualiza para papel permitido quando autorizado", () => {
    const { updateScaleRole } = useScaleMutations("admin", "u1", users);
    const result = updateScaleRole(openEvent, "u2", "Vocais");

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.entry.papel).toBe("Vocais");
    expect(result.domainEvent).toBe("MemberRoleUpdatedInEvent");
  });

  it("mapeia DOMAIN-013 para status 400", () => {
    const { updateScaleRole } = useScaleMutations("admin", "u1", users);
    const result = updateScaleRole(openEvent, "u2", "Bateria");

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.statusCode).toBe(400);
    expect(result.code).toBe("DOMAIN-013");
  });

  it("mapeia DOMAIN-005 para status 403 ao team-member editar terceiro", () => {
    const { updateScaleRole } = useScaleMutations("team-member", "u3", users);
    const result = updateScaleRole(openEvent, "u2", "Vocais");

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.statusCode).toBe(403);
    expect(result.code).toBe("DOMAIN-005");
    expect(result.domainEvent).toBe("RoleChangeDenied");
  });

  it("mapeia DOMAIN-014 para status 409 em Event Locked", () => {
    const { updateScaleRole } = useScaleMutations("admin", "u1", users);
    const result = updateScaleRole(
      { ...openEvent, status: "locked" },
      "u2",
      "Vocais",
    );

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.statusCode).toBe(409);
    expect(result.code).toBe("DOMAIN-014");
    expect(result.domainEvent).toBe("LockedEventMutationBlocked");
  });
});
