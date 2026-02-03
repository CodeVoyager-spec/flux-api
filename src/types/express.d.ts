import type { UserRole } from "../../db/schema";

declare global {
  namespace Express {
    interface Request {
      user?: Readonly<{
        id: string;
        role: UserRole;
      }>;
    }
  }
}

export {};
