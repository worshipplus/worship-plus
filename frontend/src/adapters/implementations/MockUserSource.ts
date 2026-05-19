import type { UserSource } from "../contracts/UserSource";
import type { User } from "../../types/user";
import { mockUsers } from "../../mocks/userMocks";

export const USER_DATA: User[] = mockUsers;

export class MockUserSource implements UserSource {
  async getAll(): Promise<User[]> {
    return [...mockUsers];
  }
}
