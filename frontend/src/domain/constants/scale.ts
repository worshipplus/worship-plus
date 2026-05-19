export const ALLOWED_PAPEIS = [
  "Vocais",
  "Guitarra",
  "Violão",
  "Baixo",
  "Bateria",
  "Teclado",
  "Backing Vocal",
  "Técnico de Som",
  "Outro",
] as const;

export type Papel = (typeof ALLOWED_PAPEIS)[number];
