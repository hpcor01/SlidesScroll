import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import themeRoutes from "./routes/themes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexão MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB conectado com sucesso"))
  .catch((err) => console.error("Erro ao conectar no Mongo:", err));

// Rotas
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/temas", themeRoutes);

// Render exige isso
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor rodando na porta " + PORT));
