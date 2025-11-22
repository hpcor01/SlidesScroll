import { MongoClient } from "mongodb";
import { storage } from "./storage";
import { InsertSlide } from "@shared/schema";

const MONGO_TEST_URI = process.env.MONGO_TEST_URI || "mongodb://localhost:27017";
const TEST_DB_NAME = "test_dbSlides";

describe("MongoDBStorage Integration Tests", () => {
  beforeAll(async () => {
    // Override client for testing with test db
    (storage as any).client = new MongoClient(MONGO_TEST_URI);
    (storage as any).dbName = TEST_DB_NAME;
    (storage as any).collection = undefined;
  });

  afterAll(async () => {
    await storage.disconnect();
  });

  beforeEach(async () => {
    const collection = await (storage as any).getCollection();
    await collection.deleteMany({});
  });

  test("createSlide inserts a new slide and returns it with an id", async () => {
    const slideData: InsertSlide = {
      texto: "Test slide text",
      assunto: "Test assunto",
      autor: "Tester"
    };
    const slide = await storage.createSlide(slideData);
    expect(slide.id).toBeDefined();
    expect(slide.texto).toBe(slideData.texto);
    expect(slide.assunto).toBe(slideData.assunto);
    expect(slide.data).toBeInstanceOf(Date);
  });

  test("getSlide returns undefined for non-existent id", async () => {
    const slide = await storage.getSlide("507f1f77bcf86cd799439011");
    expect(slide).toBeUndefined();
  });

  test("getSlide returns the slide for a valid existing id", async () => {
    const slideData: InsertSlide = { texto: "Slide 1", assunto: "Assunto 1", autor: "Tester" };
    const createdSlide = await storage.createSlide(slideData);
    const fetchedSlide = await storage.getSlide(createdSlide.id);
    expect(fetchedSlide).toBeDefined();
    expect(fetchedSlide?.id).toBe(createdSlide.id);
    expect(fetchedSlide?.texto).toBe(slideData.texto);
  });

  test("getSlides returns paginated slides and total count", async () => {
    for (let i = 0; i < 15; i++) {
      await storage.createSlide({ texto: `Slide ${i}`, assunto: "Assunto", autor: "Tester" });
    }
    const page1 = await storage.getSlides(1, 10);
    expect(page1.data.length).toBe(10);
    expect(page1.total).toBe(15);
    const page2 = await storage.getSlides(2, 10);
    expect(page2.data.length).toBe(5);
  });

  test("checkDuplicates returns high similarity matches", async () => {
    await storage.createSlide({ texto: "Hello World", assunto: "Greeting", autor: "Tester" });
    const matches = await storage.checkDuplicates("Hello World", "Greeting");
    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0].similarity).toBeGreaterThanOrEqual(0.5);
  });

  test("disconnect properly closes the client", async () => {
    await storage.disconnect();
    // After disconnection, collection should be undefined
    expect((storage as any).collection).toBeUndefined();
  });
});
