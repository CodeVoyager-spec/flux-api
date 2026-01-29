import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { catchAsync } from "../../utils/catchAsync";

export class AuthController {
  private authService = new AuthService();

  // Signup new user
  signup = catchAsync(async (req: Request, res: Response) => {
    const { username, email, password, role } = req.body;

    const user = await this.authService.signup({
      username,
      email,
      password,
      role,
    });

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  });

  // Signin existing user
  signin = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const { accessToken } = await this.authService.signin({
      email,
      password,
    });
    res.json({ accessToken });
  });

}
