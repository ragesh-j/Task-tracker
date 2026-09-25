import { Router } from "express";
import * as ai from "../controllers/ai.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { suggestSchema } from "../schemas/ai.schema";

const router = Router();
router.post("/suggest", requireAuth, validate(suggestSchema), ai.suggest);
export default router;