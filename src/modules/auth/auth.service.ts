import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../db/schema";
import { comparePassword, hashPassword } from "../../utils/password";
import { JwtPayload, signinBody, signupBody } from "./auth.types";
import { generateAccessToken } from "../../utils/jwt";
import { AppError } from "../../utils/AppError";

export class AuthService {
  // Signup new user
  async signup(data: signupBody) {
    const { username, email, password, role } = data;

    const hashedPassword = await hashPassword(password);

    const [user] = await db
      .insert(users)
      .values({
        username,
        email,
        password: hashedPassword,
        role
      })
      .returning({
        id: users.id,
        role: users.role,
        username: users.username,
        email: users.email,
      });

    return user;
  }

  // Signin existing user
  async signin(data: signinBody) {
    const { email, password } = data;

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      throw new AppError("Invalid credentials", 404);
    }

    const validPassword = await comparePassword(password, user.password);
    if (!validPassword) {
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
