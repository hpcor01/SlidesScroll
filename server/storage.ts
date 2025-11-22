import { type Slide, type InsertSlide, type DuplicateMatch } from "@shared/schema";
import { MongoClient, ObjectId } from "mongodb";

export interface IStorage {
  getSlides(page: number, perPage: number): Promise<{ data: Slide[]; total: number }>;
  getSlide(id: string): Promise<Slide | undefined>;
  createSlide(slide: InsertSlide): Promise<Slide>;
  checkDuplicates(texto: string, assunto?: string): Promise<DuplicateMatch[]>;
  disconnect(): Promise<void>;
}

class MongoDBStorage implements IStorage {
  private client: MongoClient;
  private dbName: string;
  private collectionName: string;
  private collection: any;

  constructor() {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is required");
    }
    this.client = new MongoClient(process.env.MONGO_URI);
    this.dbName = "dbSlides";
    this.collectionName = "colTema";
  }

  private async getCollection() {
    if (!this.collection) {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      this.collection = db.collection(this.collectionName);
    }
    return this.collection;
  }

  async getSlides(page: number, perPage: number): Promise<{ data: Slide[]; total: number }> {
    const collection = await this.getCollection();
    const total = await collection.countDocuments();
    const slides = await collection
      .find()
      .sort({ data: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .toArray();

    const data = slides.map((doc: any) => ({
      ...doc,
      id: doc._id.toString(),
      _id: undefined,
    }));

    return { data, total };
  }

  async getSlide(id: string): Promise<Slide | undefined> {
    const collection = await this.getCollection();
    const doc = await collection.findOne({ _id: new ObjectId(id) });
    if (!doc) return undefined;
    return {
      ...doc,
      id: doc._id.toString(),
      _id: undefined,
    };
  }

  async createSlide(insertSlide: InsertSlide): Promise<Slide> {
    const collection = await this.getCollection();
    const slideToInsert = {
      ...insertSlide,
      data: new Date(),
    };
    const result = await collection.insertOne(slideToInsert);
    return {
      ...slideToInsert,
      id: result.insertedId.toString(),
    };
  }

  async checkDuplicates(texto: string, assunto?: string): Promise<DuplicateMatch[]> {
    const collection = await this.getCollection();
    const slides = await collection.find().toArray();

    const stringSimilarity = (a: string, b: string) => {
      a = a.toLowerCase().trim();
      b = b.toLowerCase().trim();

      if (!a || !b) return 0;
      let matches = 0;
      const minLen = Math.min(a.length, b.length);

      for (let i = 0; i < minLen; i++) {
        if (a[i] === b[i]) matches++;
      }
      return matches / Math.max(a.length, b.length);
    };

    const matches: DuplicateMatch[] = [];
    for (const slide of slides) {
      const textoSimilarity = stringSimilarity(texto, slide.texto);
      let assuntoSimilarity = 0;
      if (assunto && assunto.length > 0) {
        assuntoSimilarity = stringSimilarity(assunto, slide.assunto);
      }
      const combinedSimilarity = assunto
        ? textoSimilarity * 0.7 + assuntoSimilarity * 0.3
        : textoSimilarity;

      if (combinedSimilarity >= 0.5) {
        matches.push({
          slide: {
            ...slide,
            id: slide._id.toString(),
            _id: undefined,
          },
          similarity: combinedSimilarity,
        });
      }
    }
    matches.sort((a, b) => b.similarity - a.similarity);
    return matches;
  }

  /**
   * Disconnects the MongoClient connection
   */
  async disconnect(): Promise<void> {
    await this.client.close();
    this.collection = undefined;
  }
}

export const storage = new MongoDBStorage();
