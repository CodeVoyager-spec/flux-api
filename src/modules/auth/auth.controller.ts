import { Request, Response } from "express";
import { AuthService } from "./auth.service";

export class AuthController {
  private authService = new AuthService();

  signup = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    const user = await this.authService.signup({
      username,
      email,
      password,
    });

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  };

  signin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const { accessToken, refreshToken } = await this.authService.signin({
      email,
      password,
    });

    // store refresh token in httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  };

  logout = async (_req: Request, res: Response) => {
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  };
}
