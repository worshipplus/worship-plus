import type { DomainErrorCodeValue } from "./DomainErrorCode";

export class DomainError extends Error {
  constructor(
    public readonly code: DomainErrorCodeValue,
    message: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "DomainError";
    Object.setPrototypeOf(this, DomainError.prototype);
  }
}
