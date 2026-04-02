import { db } from "../../config/database";
import { UserEntity } from "./entities";
import { authQueries } from "./queries";

export class AuthRepository {
  async findByEmail(email: string): Promise<UserEntity | null> {
    const result = await db.query<UserEntity>(authQueries.findByEmail, [email]);
    return result.rows[0] ?? null;
  }

  async createUser(email: string, passwordHash: string): Promise<UserEntity> {
    const result = await db.query<UserEntity>(authQueries.createUser, [email, passwordHash]);
    return result.rows[0];
  }
}
