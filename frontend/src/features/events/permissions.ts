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

export function canEditEventSetlist(
  event: Pick<Event, "status" | "owner">,
  userRole: UserRole,
  currentUserName: string,
): boolean {
  if (event.status === "locked") return false;
  return userRole === "admin" || event.owner === currentUserName;
}

export function canEditScale(
  event: Pick<Event, "status" | "owner_id">,
  userRole: UserRole,
  currentUserId: string,
): boolean {
  if (event.status === "locked") return false;
  return userRole === "admin" || currentUserId === event.owner_id;
}
