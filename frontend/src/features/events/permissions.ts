import type { Event, UserRole } from "../../types/event";

export function canViewEvent(
  event: Pick<Event, "status" | "owner">,
  userRole: UserRole,
  currentUserName: string,
): boolean {
  if (event.status !== "draft") return true;
  if (userRole !== "team-member") return true;
  return event.owner === currentUserName;
}
