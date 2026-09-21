import { z } from "zod";

export const contactMessageSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  message: z.string().trim().min(10).max(5000),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
