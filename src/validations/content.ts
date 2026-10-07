import { z } from "zod";

export const contentTypeSchema = z.enum(["project", "article", "note"]);

export const editorialStatusSchema = z.enum([
  "draft",
  "pending_review",
  "rejected",
  "published",
  "archived",
]);

export const visibilitySchema = z.enum(["public", "private"]);

export const contentBaseSchema = z.object({
  type: contentTypeSchema,
  slug: z
    .string()
    .trim()
    .min(2, "O slug deve ter pelo menos 2 caracteres")
    .max(160, "O slug deve ter no máximo 160 caracteres")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "O slug deve estar em formato kebab-case"),
  title: z
    .string()
    .trim()
    .min(3, "O título deve ter pelo menos 3 caracteres")
    .max(240, "O título deve ter no máximo 240 caracteres"),
  summary: z
    .string()
    .trim()
    .min(5, "O resumo deve ter pelo menos 5 caracteres")
    .max(1000, "O resumo deve ter no máximo 1000 caracteres"),
  visibility: visibilitySchema.default("public"),
});

export const projectMetadataSchema = z.object({
  repositoryUrl: z.string().url("URL de repositório inválida").max(255).optional().or(z.literal("")),
  liveUrl: z.string().url("URL do projeto inválida").max(255).optional().or(z.literal("")),
  techStack: z.array(z.string().trim().min(1)).default([]),
  architectureNotes: z.string().optional(),
  challenges: z.string().optional(),
});

export const articleMetadataSchema = z.object({
  body: z.string().trim().min(10, "O artigo deve conter pelo menos 10 caracteres"),
  readingMinutes: z.number().int().positive().optional(),
  canonicalUrl: z.string().url("URL canônica inválida").max(255).optional().or(z.literal("")),
});

export const noteMetadataSchema = z.object({
  body: z.string().trim().min(1, "A nota não pode ser vazia"),
});

export type ContentBaseInput = z.infer<typeof contentBaseSchema>;
export type ProjectMetadataInput = z.infer<typeof projectMetadataSchema>;
export type ArticleMetadataInput = z.infer<typeof articleMetadataSchema>;
export type NoteMetadataInput = z.infer<typeof noteMetadataSchema>;
