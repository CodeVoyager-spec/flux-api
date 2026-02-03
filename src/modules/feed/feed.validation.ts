import { z } from "zod";

export const feedQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1, "Page must be >= 1").default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
  }),
});
