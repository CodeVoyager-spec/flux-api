import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../db/schema";
import { comparePassword, hashPassword } from "../../utils/password";
import { JwtPayload, SigninBody, SignupBody } from "./auth.types";
import { generateAccessToken } from "../../utils/jwt";
import { AppError } from "../../utils/AppError";

export class AuthService {
  // Signup new user
  async signup(data: SignupBody) {
    const { username, email, password, role } = data;

    const hashedPassword = await hashPassword(password);

    const [user] = await db
      .insert(users)
      .values({
        username,
        email,
        password: hashedPassword,
        role,
      })
      .returning({
        id: users.id,
        role: users.role,
        username: users.username,
        email: users.email,
        createdAt: users.createdAt,
      });

    return user;
  }

  // Signin existing user
  async signin(data: SigninBody) {
    const { email, password } = data;

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      throw new AppError("Invalid credentials", 404);
    }

    if (!user.isVerified) {
      throw new AppError("Your accont is not varified", 403);
    }

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      throw new AppError("Invalid credentials", 401);
    }

    const payload: JwtPayload = {
      userId: user.id,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);

    return { accessToken };
  }
}
