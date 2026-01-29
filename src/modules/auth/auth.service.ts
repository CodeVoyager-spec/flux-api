import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../db/schema";
import { comparePassword, hashPassword } from "../../utils/password";
import { JwtPayload, signinBody, signupBody } from "./auth.types";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";

export class AuthService {
  // Signup new user
  async signup(data: signupBody) {
    const { username, email, password } = data;

    const hashedPassword = await hashPassword(password);

    const [user] = await db
      .insert(users)
      .values({
        username,
        email,
        password: hashedPassword,
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
      throw new Error("Invalid credentials");
    }

    const validPassword = await comparePassword(password, user.password);
    if (!validPassword) {
      throw new Error("Invalid credentials");
    }

    const payload: JwtPayload = {
      userId: user.id,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return { accessToken, refreshToken };
  }

  // Refresh access token using refresh token
  // Signout by blacklisting refresh token
}
