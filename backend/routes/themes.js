import { Router } from "express";
import Theme from "../models/Theme.js";
import { auth, adminOnly } from "../middlewares/auth.js";

const router = Router();

// Todos podem visualizar
router.get("/", auth, async (req, res) => {
    const temas = await Theme.find().sort({ _id: -1 });
    res.json(temas);
});

// Todos podem criar
router.post("/", auth, async (req, res) => {

    // autor automático:
    req.body.autor = req.user.username;

    const novo = await Theme.create(req.body);
    res.status(201).json(novo);
});

// Apenas admin pode editar
router.put("/:id", auth, adminOnly, async (req, res) => {
    const tema = await Theme.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(tema);
});

// Apenas admin pode excluir
router.delete("/:id", auth, adminOnly, async (req, res) => {
    await Theme.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

export default router;
