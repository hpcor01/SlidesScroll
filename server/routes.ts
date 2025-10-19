import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSlideSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/slides", async (req, res) => {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const perPage = Math.max(1, Math.min(100, parseInt(req.query.perPage as string) || 10));

      const { data, total } = await storage.getSlides(page, perPage);
      const totalPages = Math.ceil(total / perPage);

      res.json({
        data,
        total,
        page,
        perPage,
        totalPages,
      });
    } catch (error) {
      console.error("Erro ao buscar slides:", error);
      res.status(500).json({ error: "Erro ao buscar slides" });
    }
  });

  app.get("/api/slides/check-duplicate", async (req, res) => {
    try {
      const texto = req.query.texto as string;
      const assunto = req.query.assunto as string;

      if (!texto || texto.length < 20) {
        return res.json({ isDuplicate: false, matches: [] });
      }

      const matches = await storage.checkDuplicates(texto, assunto);
      
      res.json({
        isDuplicate: matches.length > 0,
        matches,
      });
    } catch (error) {
      console.error("Erro ao verificar duplicatas:", error);
      res.status(500).json({ error: "Erro ao verificar duplicatas" });
    }
  });

  app.post("/api/slides", async (req, res) => {
    try {
      const validatedData = insertSlideSchema.parse(req.body);
      const slide = await storage.createSlide(validatedData);
      
      res.status(201).json(slide);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Dados inválidos", details: error.errors });
      }
      
      console.error("Erro ao criar slide:", error);
      res.status(500).json({ error: "Erro ao criar slide" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
