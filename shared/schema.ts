import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const slides = pgTable("slides", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assunto: text("assunto").notNull(),
  texto: text("texto").notNull(),
  autor: text("autor").notNull(),
  data: timestamp("data").notNull().defaultNow(),
});

export const insertSlideSchema = createInsertSchema(slides).omit({
  id: true,
  data: true,
});

export type InsertSlide = z.infer<typeof insertSlideSchema>;
export type Slide = typeof slides.$inferSelect;

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface DuplicateMatch {
  slide: Slide;
  similarity: number;
}

export interface DuplicateCheckResponse {
  isDuplicate: boolean;
  matches: DuplicateMatch[];
}
