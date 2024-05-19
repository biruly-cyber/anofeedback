import { z } from "zod";

export const accpetMessageSchema = z.object({
  acceptMessage: z.boolean()
});
