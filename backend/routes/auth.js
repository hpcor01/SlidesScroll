import { Router } from "express";
import User from "../models/User.js";

const router = Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  if (user.password !== password) {
    return res.status(401).json({ error: "Senha incorreta" });
  }

  res.json({
    message: "Login realizado com sucesso",
    user: {
      id: user._id,
      username: user.username,
      email: user.usermail,
      level: user.level
    }
  });
});

export default router;
