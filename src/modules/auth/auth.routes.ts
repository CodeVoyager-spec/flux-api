import { Router } from "express";
import { AuthController } from "./auth.controller";
import { signinSchema, signupSchema } from "./auth.validation";
import { validate } from "../../middlewares/validate.middleware";

const router = Router();
const controller = new AuthController();

router.post("/signup", validate(signupSchema), controller.signup);
router.post("/signin", validate(signinSchema), controller.signin);

export default router;
