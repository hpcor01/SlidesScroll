import { Router } from "express";
import User from "../models/User.js";
import { auth, adminOnly } from "../middlewares/auth.js";

const router = Router();

router.get("/", auth, adminOnly, async (req, res) => {
    const users = await User.find();
    res.json(users);
});

router.post("/", auth, adminOnly, async (req, res) => {
    const user = await User.create(req.body);
    res.status(201).json(user);
});

export default router;
