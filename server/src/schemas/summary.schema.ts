import { z } from "zod";

export const summaryQuerySchema = z
  .object({
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
  })
  .refine((d) => !d.from || !d.to || d.to > d.from, {
    message: "'to' must be after 'from'",
  });