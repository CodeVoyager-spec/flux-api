import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { catchAsync } from "../../utils/catchAsync";

export class AuthController {
  private authService = new AuthService();

  // Signup new user
  signup = catchAsync(async (req: Request, res: Response) => {
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
  });

  // Signin existing user
  signin = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const { accessToken, refreshToken } = await this.authService.signin({
      email,
      password,
    });

    // Store refresh token in httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  });

  // Refresh access token using refresh token

  // Signout and blacklist refresh token
  signout = catchAsync(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      res.clearCookie("refreshToken");
    }
    res.json({ message: "Logged out successfully" });
  });
}
