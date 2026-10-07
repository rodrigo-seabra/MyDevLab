import { describe, expect, it } from "vitest";
import {
  articleMetadataSchema,
  contentBaseSchema,
  projectMetadataSchema,
} from "@/validations/content";

describe("content validations", () => {
  describe("contentBaseSchema", () => {
    it("valida conteúdo base com slug em kebab-case", () => {
      const result = contentBaseSchema.safeParse({
        type: "project",
        slug: "meu-primeiro-projeto",
        title: "Meu Primeiro Projeto",
        summary: "Um resumo detalhado sobre o projeto técnico.",
        visibility: "public",
      });
      expect(result.success).toBe(true);
    });

    it("rejeita slug com caracteres inválidos ou espaços", () => {
      const result = contentBaseSchema.safeParse({
        type: "project",
        slug: "Meu Projeto Com Espaço",
        title: "Meu Projeto",
        summary: "Resumo do projeto",
      });
      expect(result.success).toBe(false);
    });

    it("rejeita tipo desconhecido de conteúdo", () => {
      const result = contentBaseSchema.safeParse({
        type: "podcast",
        slug: "podcast-ep-1",
        title: "Episódio 1",
        summary: "Resumo do podcast",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("projectMetadataSchema", () => {
    it("valida metadados de projeto com links válidos", () => {
      const result = projectMetadataSchema.safeParse({
        repositoryUrl: "https://github.com/example/repo",
        liveUrl: "https://example.com",
        techStack: ["Next.js", "TypeScript", "PostgreSQL"],
        architectureNotes: "Arquitetura baseada em Server Components.",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("articleMetadataSchema", () => {
    it("valida artigo com corpo adequado", () => {
      const result = articleMetadataSchema.safeParse({
        body: "# Conteúdo completo do artigo técnico em Markdown.",
        readingMinutes: 5,
      });
      expect(result.success).toBe(true);
    });

    it("rejeita artigo com corpo vazio", () => {
      const result = articleMetadataSchema.safeParse({
        body: "",
      });
      expect(result.success).toBe(false);
    });
  });
});
