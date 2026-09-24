import { Router } from "express";
import * as summary from "../controllers/summary.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/today", requireAuth, summary.today);

export default router;