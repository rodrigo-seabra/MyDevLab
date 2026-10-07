import { z } from "zod";

export const tagSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "O nome da tag deve ter pelo menos 2 caracteres")
    .max(60, "O nome da tag deve ter no máximo 60 caracteres"),
  slug: z
    .string()
    .trim()
    .min(2, "O slug da tag deve ter pelo menos 2 caracteres")
    .max(60, "O slug da tag deve ter no máximo 60 caracteres")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "O slug da tag deve estar em formato kebab-case"),
});

export type TagInput = z.infer<typeof tagSchema>;
