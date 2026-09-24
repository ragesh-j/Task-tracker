import { z } from "zod";

export const timerSchema = z.object({
  taskId: z.string().uuid("Invalid task id"),
});