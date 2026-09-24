import { Router } from "express";
import * as auth from "../controllers/auth.controller";
import { validate } from "../middleware/validate.middleware";
import { requireAuth } from "../middleware/auth.middleware";
import { signupSchema, loginSchema } from "../schemas/auth.schema";

const router = Router();

router.post("/signup", validate(signupSchema), auth.signup);
router.post("/login", validate(loginSchema), auth.login);
router.post("/logout", auth.logout);
router.get("/me", requireAuth, auth.me);

export default router;