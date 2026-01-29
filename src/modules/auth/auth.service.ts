import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../db/schema";
import { comparePassword, hashPassword } from "../../utils/password";
import { JwtPayload, signinBody, signupBody } from "./auth.types";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";

export class AuthService {
  async signup(data: signupBody) {
    const { username, email, password } = data;
    // hash password and save user to DB
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
      });

    return user;
  }

  async signin(data: signinBody) {
    const { email, password } = data;

    // check user + generate JWT
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
}
