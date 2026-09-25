import { z } from "zod";

export const suggestSchema = z.object({
  input: z.string().trim().min(1, "Enter a task first").max(300),
});