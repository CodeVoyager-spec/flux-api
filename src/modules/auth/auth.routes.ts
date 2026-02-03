import { Router } from "express";
import { AuthController } from "./auth.controller";
import { signinSchema, signupSchema } from "./auth.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = Router();
const controller = new AuthController();

router.post("/signup", validateRequest(signupSchema), controller.signup);
router.post("/signin", validateRequest(signinSchema), controller.signin);

export default router;
