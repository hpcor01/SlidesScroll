import { type Slide, type InsertSlide, type DuplicateMatch } from "@shared/schema";
import { randomUUID } from "crypto";
import stringSimilarity from "string-similarity";

export interface IStorage {
  getSlides(page: number, perPage: number): Promise<{ data: Slide[]; total: number }>;
  getSlide(id: string): Promise<Slide | undefined>;
  createSlide(slide: InsertSlide): Promise<Slide>;
  checkDuplicates(texto: string, assunto?: string): Promise<DuplicateMatch[]>;
}

export class MemStorage implements IStorage {
  private slides: Map<string, Slide>;

  constructor() {
    this.slides = new Map();
  }

  async getSlides(page: number, perPage: number): Promise<{ data: Slide[]; total: number }> {
    const allSlides = Array.from(this.slides.values()).sort((a, b) => 
      new Date(b.data).getTime() - new Date(a.data).getTime()
    );

    const total = allSlides.length;
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const data = allSlides.slice(start, end);

    return { data, total };
  }

  async getSlide(id: string): Promise<Slide | undefined> {
    return this.slides.get(id);
  }

  async createSlide(insertSlide: InsertSlide): Promise<Slide> {
    const id = randomUUID();
    const slide: Slide = {
      ...insertSlide,
      id,
      data: new Date(),
    };
    this.slides.set(id, slide);
    return slide;
  }

  async checkDuplicates(texto: string, assunto?: string): Promise<DuplicateMatch[]> {
    const allSlides = Array.from(this.slides.values());
    const matches: DuplicateMatch[] = [];

    for (const slide of allSlides) {
      const textoSimilarity = stringSimilarity.compareTwoStrings(
        texto.toLowerCase().trim(),
        slide.texto.toLowerCase().trim()
      );

      let assuntoSimilarity = 0;
      if (assunto && assunto.length > 0) {
        assuntoSimilarity = stringSimilarity.compareTwoStrings(
          assunto.toLowerCase().trim(),
          slide.assunto.toLowerCase().trim()
        );
      }

      const combinedSimilarity = assunto 
        ? (textoSimilarity * 0.7 + assuntoSimilarity * 0.3)
        : textoSimilarity;

      if (combinedSimilarity >= 0.5) {
        matches.push({
          slide,
          similarity: combinedSimilarity,
        });
      }
    }

    return matches.sort((a, b) => b.similarity - a.similarity);
  }
}

export const storage = new MemStorage();
