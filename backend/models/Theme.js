import mongoose from "mongoose";

const ThemeSchema = new mongoose.Schema(
  {
    slide: {
      data: { type: String, required: true },
      assunto: { type: String, required: true },
      texto: { type: String, required: true }
    },
    autor: { type: String, required: true }
  },
  {
    collection: "colTema" // Usa sua collection existente
  }
);

export default mongoose.model("Theme", ThemeSchema);
