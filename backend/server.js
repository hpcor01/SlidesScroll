const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { User, Slide } = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = "mongodb+srv://sysdba:LFpxAegi7gMZuHlT@eightcluster.nblda.mongodb.net/dbSlides?retryWrites=true&w=majority&appName=eightCluster";

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully to dbSlides'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Rotas de Usuários ---

// Listar Usuários
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Criar/Atualizar Usuário
app.post('/api/users', async (req, res) => {
  try {
    const { id, username, password, role } = req.body;
    // Upsert: Atualiza se existir, cria se não
    const user = await User.findOneAndUpdate(
      { id: id },
      { username, password, role },
      { new: true, upsert: true }
    );
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Deletar Usuário
app.delete('/api/users/:id', async (req, res) => {
  try {
    await User.deleteOne({ id: req.params.id });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- Rotas de Slides ---

// Listar Slides
app.get('/api/slides', async (req, res) => {
  try {
    const slides = await Slide.find().sort({ createdAt: -1 });
    res.json(slides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Criar Slide
app.post('/api/slides', async (req, res) => {
  try {
    const slideData = req.body;
    const newSlide = new Slide(slideData);
    await newSlide.save();
    res.status(201).json(newSlide);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Deletar Slide
app.delete('/api/slides/:id', async (req, res) => {
  try {
    await Slide.deleteOne({ id: req.params.id });
    res.json({ message: 'Slide deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});