import { Router } from "express";
import * as timeLog from "../controllers/timelog.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { timerSchema } from "../schemas/timelog.schema";

const router = Router();

router.use(requireAuth);

router.post("/start", validate(timerSchema), timeLog.start);
router.post("/stop", validate(timerSchema), timeLog.stop);
router.get("/", timeLog.list);
router.delete("/:id", timeLog.remove);

export default router;