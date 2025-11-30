const mongoose = require('mongoose');

// Schema do Usuário (Collection: colUser)
const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // Mantendo ID string para compatibilidade com frontend atual
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['ADMIN', 'USER'], default: 'USER' }
}, { collection: 'colUser' });

// Schema do Slide/Artigo (Collection: colSlide)
const slideSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  subject: { type: String, required: true },
  text: { type: String, required: true },
  authorId: { type: String, required: true },
  authorName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  type: { type: String, enum: ['TEXT', 'PPTX'], default: 'TEXT' },
  fileName: { type: String } // Apenas para arquivos PPTX
}, { collection: 'colSlide' });

const User = mongoose.model('User', userSchema);
const Slide = mongoose.model('Slide', slideSchema);

module.exports = { User, Slide };