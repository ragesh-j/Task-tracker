import { Router } from "express";
import * as task from "../controllers/task.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createTaskSchema, updateTaskSchema } from "../schemas/task.schema";

const router = Router();

router.use(requireAuth);

router.post("/", validate(createTaskSchema), task.create);
router.get("/", task.list);
router.get("/:id", task.getOne);
router.patch("/:id", validate(updateTaskSchema), task.update);
router.delete("/:id", task.remove);

export default router;