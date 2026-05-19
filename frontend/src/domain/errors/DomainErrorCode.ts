export const DomainErrorCode = {
  /** Apenas admin e ministro podem editar Setlist */
  UNAUTHORIZED_SETLIST: "DOMAIN-001",
  /** Apenas admin e ministro podem criar Event */
  UNAUTHORIZED_CREATE_EVENT: "DOMAIN-002",
  /** Apenas admin pode alterar Owner */
  UNAUTHORIZED_EDIT_OWNER: "DOMAIN-003",
  /** Apenas admin ou Owner do Event pode editar Event Setlist */
  UNAUTHORIZED_EDIT_EVENT_SETLIST: "DOMAIN-004",
  /** Apenas admin ou Owner do Event pode editar Escala */
  UNAUTHORIZED_EDIT_SCALE: "DOMAIN-005",
  /** Música exige link YouTube válido */
  INVALID_YOUTUBE_URL: "DOMAIN-006",
  /** title, author e youtubeUrl são obrigatórios no Setlist */
  SETLIST_REQUIRED_FIELDS: "DOMAIN-007",
  /** title, date, description e owner são obrigatórios no Event */
  EVENT_REQUIRED_FIELDS: "DOMAIN-008",
  /** Event deve ter data válida em formato parseável */
  INVALID_EVENT_DATE: "DOMAIN-009",
  /** Música já presente no Event Setlist */
  DUPLICATE_SETLIST_ITEM: "DOMAIN-010",
  /** Usuário não existe na base carregada */
  USER_NOT_FOUND_IN_SCALE: "DOMAIN-011",
  /** Event não encontrado por id */
  EVENT_NOT_FOUND: "DOMAIN-012",
  /** Papel não pertence à lista permitida pelo domínio */
  INVALID_SCALE_ROLE: "DOMAIN-013",
  /** Event Locked não aceita alterações de conteúdo */
  EVENT_LOCKED: "DOMAIN-014",
} as const;

export type DomainErrorCodeValue =
  (typeof DomainErrorCode)[keyof typeof DomainErrorCode];
