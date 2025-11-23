import { z } from "zod";

// Schema usado para inserir um slide
export const insertSlideSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  order: z.number(),
  imageUrl: z.string().url(),
});

// Tipo derivado para inserção
export type InsertSlide = z.infer<typeof insertSlideSchema>;

// Tipo usado pelo sistema de duplicatas
export interface DuplicateMatch {
  id: string;
  similarity: number;
}
