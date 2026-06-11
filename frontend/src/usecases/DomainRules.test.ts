import { describe, it, expect } from "vitest";
import { DomainError } from "../domain/errors/DomainError";
import { DomainErrorCode } from "../domain/errors/DomainErrorCode";
import { AddSetlistItemUseCase } from "./setlist/AddSetlistItemUseCase";
import { EditSetlistItemUseCase } from "./setlist/EditSetlistItemUseCase";
import { RemoveSetlistItemUseCase } from "./setlist/RemoveSetlistItemUseCase";
import { CreateEventUseCase } from "./event/CreateEventUseCase";
import { AddToEventSetlistUseCase } from "./event/AddToEventSetlistUseCase";
import { RemoveFromEventSetlistUseCase } from "./event/RemoveFromEventSetlistUseCase";
import { AddToScaleUseCase } from "./scale/AddToScaleUseCase";
import { RemoveFromScaleUseCase } from "./scale/RemoveFromScaleUseCase";
import { UpdateScaleMemberRoleUseCase } from "./scale/UpdateScaleMemberRoleUseCase";
import type { Event } from "../types/event";
import type { User } from "../types/user";
import type { SetlistFormData } from "../types/setlist";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function expectDomainError(fn: () => unknown, code: string) {
  try {
    fn();
    throw new Error("Expected DomainError to be thrown, but none was.");
  } catch (err) {
    expect(err).toBeInstanceOf(DomainError);
    expect((err as DomainError).code).toBe(code);
  }
}

const validSetlistForm: SetlistFormData = {
  title: "Oceans",
  author: "Hillsong United",
  key: "D",
  youtubeUrl: "https://www.youtube.com/watch?v=dy9nwe9_xzw",
};

const allUsers: User[] = [
  {
    id: "u1",
    name: "Ana Lima",
    email: "ana@test.com",
    role: "admin",
    primaryScaleRole: "Teclado",
    secondaryScaleRoles: ["Vocais"],
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "u2",
    name: "Carlos Souza",
    email: "carlos@test.com",
    role: "ministro",
    primaryScaleRole: "Violão",
    secondaryScaleRoles: ["Vocais", "Guitarra"],
    createdAt: "2024-01-02T00:00:00Z",
  },
  {
    id: "u3",
    name: "Fernanda Oliveira",
    email: "fernanda@test.com",
    role: "team-member",
    primaryScaleRole: "Vocais",
    secondaryScaleRoles: ["Backing Vocal"],
    createdAt: "2024-01-03T00:00:00Z",
  },
];

const openEvent: Event = {
  id: "ev1",
  title: "Culto de Adoração",
  date: "2031-10-20T09:00:00Z",
  status: "scheduled",
  owner: "Carlos Souza",
  owner_id: "u2",
  description: "Culto de adoração.",
  eventSetlist: [],
  scale: [],
};

const lockedEvent: Event = { ...openEvent, status: "locked" };

const openEventWithScaleMember: Event = {
  ...openEvent,
  scale: [
    {
      id: "sc-member",
      userId: "u3",
      userName: "Fernanda Oliveira",
      papel: "Vocais",
    },
  ],
};

const songInEvent = {
  id: "s1",
  title: "Oceans",
  author: "Hillsong United",
  key: "D",
  youtubeUrl: "https://www.youtube.com/watch?v=dy9nwe9_xzw",
  createdAt: "2024-01-01T00:00:00Z",
};

const eventWithSong: Event = {
  ...openEvent,
  eventSetlist: [
    {
      id: "s1",
      title: songInEvent.title,
      author: songInEvent.author,
      key: songInEvent.key,
      youtubeUrl: songInEvent.youtubeUrl,
    },
  ],
};

// ---------------------------------------------------------------------------
// DOMAIN-001 — Apenas admin e ministro podem editar Setlist
// ---------------------------------------------------------------------------

describe("DOMAIN-001: Autorização para editar Setlist", () => {
  it("team-member não pode adicionar item ao Setlist", () => {
    expectDomainError(
      () =>
        new AddSetlistItemUseCase().execute("team-member", validSetlistForm),
      DomainErrorCode.UNAUTHORIZED_SETLIST,
    );
  });

  it("team-member não pode editar item do Setlist", () => {
    expectDomainError(
      () =>
        new EditSetlistItemUseCase().execute("team-member", validSetlistForm),
      DomainErrorCode.UNAUTHORIZED_SETLIST,
    );
  });

  it("team-member não pode remover item do Setlist", () => {
    expectDomainError(
      () => new RemoveSetlistItemUseCase().execute("team-member"),
      DomainErrorCode.UNAUTHORIZED_SETLIST,
    );
  });

  it("admin pode adicionar item ao Setlist", () => {
    const result = new AddSetlistItemUseCase().execute(
      "admin",
      validSetlistForm,
    );
    expect(result.title).toBe("Oceans");
  });

  it("ministro pode adicionar item ao Setlist", () => {
    const result = new AddSetlistItemUseCase().execute(
      "ministro",
      validSetlistForm,
    );
    expect(result.title).toBe("Oceans");
  });
});

// ---------------------------------------------------------------------------
// DOMAIN-002 — Apenas admin e ministro podem criar Event
// ---------------------------------------------------------------------------

describe("DOMAIN-002: Autorização para criar Event", () => {
  it("team-member não pode criar Event", () => {
    expectDomainError(
      () =>
        new CreateEventUseCase().execute(
          "team-member",
          "Fernanda Oliveira",
          {
            title: "Novo Evento",
            date: "2031-10-20T10:00",
            description: "Desc",
            ownerName: "Fernanda Oliveira",
          },
          allUsers,
        ),
      DomainErrorCode.UNAUTHORIZED_CREATE_EVENT,
    );
  });

  it("ministro pode criar Event com si mesmo como owner", () => {
    const result = new CreateEventUseCase().execute(
      "ministro",
      "Carlos Souza",
      {
        title: "Novo Evento",
        date: "2031-10-20T10:00",
        description: "Desc",
        ownerName: "Carlos Souza",
      },
      allUsers,
    );
    expect(result.title).toBe("Novo Evento");
    expect(result.status).toBe("draft");
  });
});

// ---------------------------------------------------------------------------
// DOMAIN-003 — Apenas admin pode alterar Owner
// ---------------------------------------------------------------------------

describe("DOMAIN-003: Autorização para editar Owner", () => {
  it("ministro não pode alterar owner para outra pessoa", () => {
    expectDomainError(
      () =>
        new CreateEventUseCase().execute(
          "ministro",
          "Carlos Souza",
          {
            title: "Evento",
            date: "2031-10-20T10:00",
            description: "Desc",
            ownerName: "Ana Lima",
          },
          allUsers,
        ),
      DomainErrorCode.UNAUTHORIZED_EDIT_OWNER,
    );
  });

  it("admin pode definir qualquer owner", () => {
    const result = new CreateEventUseCase().execute(
      "admin",
      "Ana Lima",
      {
        title: "Evento",
        date: "2031-10-20T10:00",
        description: "Desc",
        ownerName: "Carlos Souza",
      },
      allUsers,
    );
    expect(result.owner).toBe("Carlos Souza");
  });
});

// ---------------------------------------------------------------------------
// DOMAIN-004 — Apenas admin ou Owner do Event pode editar Event Setlist
// ---------------------------------------------------------------------------

describe("DOMAIN-004: Autorização para editar Event Setlist", () => {
  it("team-member não pode adicionar música ao Event Setlist", () => {
    expectDomainError(
      () =>
        new AddToEventSetlistUseCase().execute(
          "team-member",
          "Fernanda Oliveira",
          openEvent,
          songInEvent,
        ),
      DomainErrorCode.UNAUTHORIZED_EDIT_EVENT_SETLIST,
    );
  });

  it("ministro que não é owner não pode adicionar ao Event Setlist", () => {
    expectDomainError(
      () =>
        new AddToEventSetlistUseCase().execute(
          "ministro",
          "Ana Lima",
          openEvent,
          songInEvent,
        ),
      DomainErrorCode.UNAUTHORIZED_EDIT_EVENT_SETLIST,
    );
  });

  it("owner do Event pode adicionar ao Event Setlist", () => {
    const result = new AddToEventSetlistUseCase().execute(
      "ministro",
      "Carlos Souza",
      openEvent,
      songInEvent,
    );
    expect(result.title).toBe("Oceans");
  });

  it("team-member não pode remover música do Event Setlist", () => {
    expectDomainError(
      () =>
        new RemoveFromEventSetlistUseCase().execute(
          "team-member",
          "Fernanda Oliveira",
          openEvent,
        ),
      DomainErrorCode.UNAUTHORIZED_EDIT_EVENT_SETLIST,
    );
  });
});

// ---------------------------------------------------------------------------
// DOMAIN-005 — Apenas admin ou Owner pode editar Escala
// ---------------------------------------------------------------------------

describe("DOMAIN-005: Autorização para editar Escala", () => {
  it("team-member não pode adicionar à Escala", () => {
    expectDomainError(
      () =>
        new AddToScaleUseCase().execute(
          "team-member",
          "u3",
          openEvent,
          "u3",
          "Fernanda Oliveira",
          "Vocais",
          allUsers,
        ),
      DomainErrorCode.UNAUTHORIZED_EDIT_SCALE,
    );
  });

  it("ministro que não é owner não pode adicionar à Escala", () => {
    expectDomainError(
      () =>
        new AddToScaleUseCase().execute(
          "ministro",
          "u1",
          openEvent,
          "u3",
          "Fernanda Oliveira",
          "Vocais",
          allUsers,
        ),
      DomainErrorCode.UNAUTHORIZED_EDIT_SCALE,
    );
  });

  it("owner do Event pode adicionar à Escala", () => {
    const result = new AddToScaleUseCase().execute(
      "ministro",
      "u2",
      openEvent,
      "u3",
      "Fernanda Oliveira",
      "Vocais",
      allUsers,
    );
    expect(result.userName).toBe("Fernanda Oliveira");
  });

  it("team-member não pode editar papel de terceiros na Escala", () => {
    expectDomainError(
      () =>
        new UpdateScaleMemberRoleUseCase().execute(
          "team-member",
          "u4",
          openEventWithScaleMember,
          "u3",
          "Backing Vocal",
          allUsers,
        ),
      DomainErrorCode.UNAUTHORIZED_EDIT_SCALE,
    );
  });

  it("team-member não pode remover da Escala", () => {
    expectDomainError(
      () =>
        new RemoveFromScaleUseCase().execute("team-member", "u3", openEvent),
      DomainErrorCode.UNAUTHORIZED_EDIT_SCALE,
    );
  });
});

// ---------------------------------------------------------------------------
// DOMAIN-006 — Link YouTube inválido
// ---------------------------------------------------------------------------

describe("DOMAIN-006: Validação de link do YouTube", () => {
  it("rejeita URL vazia", () => {
    expectDomainError(
      () =>
        new AddSetlistItemUseCase().execute("admin", {
          ...validSetlistForm,
          youtubeUrl: "",
        }),
      DomainErrorCode.INVALID_YOUTUBE_URL,
    );
  });

  it("rejeita URL que não é do YouTube", () => {
    expectDomainError(
      () =>
        new AddSetlistItemUseCase().execute("admin", {
          ...validSetlistForm,
          youtubeUrl: "https://vimeo.com/123456",
        }),
      DomainErrorCode.INVALID_YOUTUBE_URL,
    );
  });

  it("aceita URL youtu.be", () => {
    const result = new AddSetlistItemUseCase().execute("admin", {
      ...validSetlistForm,
      youtubeUrl: "https://youtu.be/dy9nwe9_xzw",
    });
    expect(result.youtubeUrl).toBe("https://youtu.be/dy9nwe9_xzw");
  });
});

// ---------------------------------------------------------------------------
// DOMAIN-007 — Campos obrigatórios no Setlist
// ---------------------------------------------------------------------------

describe("DOMAIN-007: Campos obrigatórios no Setlist", () => {
  it("rejeita título vazio", () => {
    const err = (() => {
      try {
        new AddSetlistItemUseCase().execute("admin", {
          ...validSetlistForm,
          title: "",
        });
      } catch (e) {
        return e;
      }
    })() as DomainError;
    expect(err.code).toBe(DomainErrorCode.SETLIST_REQUIRED_FIELDS);
    expect(err.details?.field).toBe("title");
  });

  it("rejeita autor vazio", () => {
    const err = (() => {
      try {
        new AddSetlistItemUseCase().execute("admin", {
          ...validSetlistForm,
          author: "",
        });
      } catch (e) {
        return e;
      }
    })() as DomainError;
    expect(err.code).toBe(DomainErrorCode.SETLIST_REQUIRED_FIELDS);
    expect(err.details?.field).toBe("author");
  });
});

// ---------------------------------------------------------------------------
// DOMAIN-008 — Campos obrigatórios no Event
// ---------------------------------------------------------------------------

describe("DOMAIN-008: Campos obrigatórios no Event", () => {
  it("rejeita título vazio no Event", () => {
    const err = (() => {
      try {
        new CreateEventUseCase().execute(
          "admin",
          "Ana Lima",
          {
            title: "",
            date: "2031-10-20T10:00",
            description: "Desc",
            ownerName: "Ana Lima",
          },
          allUsers,
        );
      } catch (e) {
        return e;
      }
    })() as DomainError;
    expect(err.code).toBe(DomainErrorCode.EVENT_REQUIRED_FIELDS);
    expect(err.details?.field).toBe("title");
  });

  it("rejeita descrição vazia no Event", () => {
    const err = (() => {
      try {
        new CreateEventUseCase().execute(
          "admin",
          "Ana Lima",
          {
            title: "Evento",
            date: "2031-10-20T10:00",
            description: "",
            ownerName: "Ana Lima",
          },
          allUsers,
        );
      } catch (e) {
        return e;
      }
    })() as DomainError;
    expect(err.code).toBe(DomainErrorCode.EVENT_REQUIRED_FIELDS);
    expect(err.details?.field).toBe("description");
  });

  it("rejeita ownerName que não existe em allUsers", () => {
    const err = (() => {
      try {
        new CreateEventUseCase().execute(
          "admin",
          "Ana Lima",
          {
            title: "Evento",
            date: "2031-10-20T10:00",
            description: "Desc",
            ownerName: "Usuário Inexistente",
          },
          allUsers,
        );
      } catch (e) {
        return e;
      }
    })() as DomainError;
    expect(err.code).toBe(DomainErrorCode.EVENT_REQUIRED_FIELDS);
    expect(err.details?.field).toBe("owner");
  });
});

// ---------------------------------------------------------------------------
// DOMAIN-009 — Data inválida no Event
// ---------------------------------------------------------------------------

describe("DOMAIN-009: Data inválida no Event", () => {
  it("rejeita data no formato incorreto", () => {
    expectDomainError(
      () =>
        new CreateEventUseCase().execute(
          "admin",
          "Ana Lima",
          {
            title: "Evento",
            date: "não-é-uma-data",
            description: "Desc",
            ownerName: "Ana Lima",
          },
          allUsers,
        ),
      DomainErrorCode.INVALID_EVENT_DATE,
    );
  });

  it("aceita data ISO válida", () => {
    const result = new CreateEventUseCase().execute(
      "admin",
      "Ana Lima",
      {
        title: "Evento",
        date: "2031-10-20T10:00:00",
        description: "Desc",
        ownerName: "Ana Lima",
      },
      allUsers,
    );
    expect(result.date).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// DOMAIN-010 — Música duplicada no Event Setlist
// ---------------------------------------------------------------------------

describe("DOMAIN-010: Música duplicada no Event Setlist", () => {
  it("rejeita música já presente no Event Setlist", () => {
    expectDomainError(
      () =>
        new AddToEventSetlistUseCase().execute(
          "admin",
          "Ana Lima",
          eventWithSong,
          songInEvent,
        ),
      DomainErrorCode.DUPLICATE_SETLIST_ITEM,
    );
  });

  it("permite adicionar música diferente", () => {
    const anotherSong = {
      ...songInEvent,
      id: "s99",
      title: "Good Good Father",
      youtubeUrl: "https://www.youtube.com/watch?v=CqybaIHere4",
    };
    const result = new AddToEventSetlistUseCase().execute(
      "admin",
      "Ana Lima",
      eventWithSong,
      anotherSong,
    );
    expect(result.title).toBe("Good Good Father");
  });
});

// ---------------------------------------------------------------------------
// DOMAIN-011 — Integrante inexistente na Escala
// ---------------------------------------------------------------------------

describe("DOMAIN-011: Integrante inexistente na Escala", () => {
  it("rejeita userId que não existe em allUsers", () => {
    expectDomainError(
      () =>
        new AddToScaleUseCase().execute(
          "admin",
          "u1",
          openEvent,
          "u999",
          "Usuário Fantasma",
          "Vocais",
          allUsers,
        ),
      DomainErrorCode.USER_NOT_FOUND_IN_SCALE,
    );
  });
});

// ---------------------------------------------------------------------------
// DOMAIN-012 — Event não encontrado
// ---------------------------------------------------------------------------

describe("DOMAIN-012: Event não encontrado", () => {
  it("AddToEventSetlist rejeita event undefined", () => {
    expectDomainError(
      () =>
        new AddToEventSetlistUseCase().execute(
          "admin",
          "Ana Lima",
          undefined,
          songInEvent,
        ),
      DomainErrorCode.EVENT_NOT_FOUND,
    );
  });

  it("AddToScale rejeita event undefined", () => {
    expectDomainError(
      () =>
        new AddToScaleUseCase().execute(
          "admin",
          "u1",
          undefined,
          "u3",
          "Fernanda",
          "Vocais",
          allUsers,
        ),
      DomainErrorCode.EVENT_NOT_FOUND,
    );
  });

  it("RemoveFromScale rejeita event undefined", () => {
    expectDomainError(
      () => new RemoveFromScaleUseCase().execute("admin", "u1", undefined),
      DomainErrorCode.EVENT_NOT_FOUND,
    );
  });
});

// ---------------------------------------------------------------------------
// DOMAIN-013 — Papel inválido na Escala
// ---------------------------------------------------------------------------

describe("DOMAIN-013: Papel inválido na Escala", () => {
  it("sugere papel principal quando papel não é informado", () => {
    const result = new AddToScaleUseCase().execute(
      "admin",
      "u1",
      openEvent,
      "u2",
      "Carlos Souza",
      undefined,
      allUsers,
    );
    expect(result.papel).toBe("Violão");
  });

  it("permite atualizar para papel secundário do integrante", () => {
    const result = new UpdateScaleMemberRoleUseCase().execute(
      "admin",
      "u1",
      openEventWithScaleMember,
      "u3",
      "Backing Vocal",
      allUsers,
    );
    expect(result.papel).toBe("Backing Vocal");
  });

  it("rejeita papel fora da lista permitida", () => {
    expectDomainError(
      () =>
        new AddToScaleUseCase().execute(
          "admin",
          "u1",
          openEvent,
          "u3",
          "Fernanda Oliveira",
          "Presidente",
          allUsers,
        ),
      DomainErrorCode.INVALID_SCALE_ROLE,
    );
  });

  it("aceita papel da lista permitida", () => {
    const result = new AddToScaleUseCase().execute(
      "admin",
      "u1",
      openEvent,
      "u1",
      "Ana Lima",
      "Teclado",
      allUsers,
    );
    expect(result.papel).toBe("Teclado");
  });

  it("rejeita papel que o integrante não possui", () => {
    expectDomainError(
      () =>
        new AddToScaleUseCase().execute(
          "admin",
          "u1",
          openEvent,
          "u3",
          "Fernanda Oliveira",
          "Bateria",
          allUsers,
        ),
      DomainErrorCode.INVALID_SCALE_ROLE,
    );
  });

  it("rejeita cadastro com papel secundário duplicado", () => {
    const usersWithDuplicatedSecondaryRole: User[] = [
      ...allUsers.slice(0, 2),
      {
        ...allUsers[2],
        secondaryScaleRoles: ["Backing Vocal", "Backing Vocal"],
      },
    ];

    expectDomainError(
      () =>
        new AddToScaleUseCase().execute(
          "admin",
          "u1",
          openEvent,
          "u3",
          "Fernanda Oliveira",
          "Vocais",
          usersWithDuplicatedSecondaryRole,
        ),
      DomainErrorCode.INVALID_SCALE_ROLE,
    );
  });
});

// ---------------------------------------------------------------------------
// DOMAIN-014 — Event Locked bloqueia mutações
// ---------------------------------------------------------------------------

describe("DOMAIN-014: Event Locked não aceita mutações", () => {
  it("bloqueio ao adicionar música a Event Locked", () => {
    expectDomainError(
      () =>
        new AddToEventSetlistUseCase().execute(
          "admin",
          "Ana Lima",
          lockedEvent,
          songInEvent,
        ),
      DomainErrorCode.EVENT_LOCKED,
    );
  });

  it("bloqueio ao remover música de Event Locked", () => {
    expectDomainError(
      () =>
        new RemoveFromEventSetlistUseCase().execute(
          "admin",
          "Ana Lima",
          lockedEvent,
        ),
      DomainErrorCode.EVENT_LOCKED,
    );
  });

  it("bloqueio ao adicionar à Escala de Event Locked", () => {
    expectDomainError(
      () =>
        new AddToScaleUseCase().execute(
          "admin",
          "u1",
          lockedEvent,
          "u3",
          "Fernanda Oliveira",
          "Vocais",
          allUsers,
        ),
      DomainErrorCode.EVENT_LOCKED,
    );
  });

  it("bloqueio ao remover da Escala de Event Locked", () => {
    expectDomainError(
      () => new RemoveFromScaleUseCase().execute("admin", "u1", lockedEvent),
      DomainErrorCode.EVENT_LOCKED,
    );
  });

  it("bloqueio ao editar papel em Escala de Event Locked", () => {
    expectDomainError(
      () =>
        new UpdateScaleMemberRoleUseCase().execute(
          "admin",
          "u1",
          { ...lockedEvent, scale: openEventWithScaleMember.scale },
          "u3",
          "Backing Vocal",
          allUsers,
        ),
      DomainErrorCode.EVENT_LOCKED,
    );
  });
});
