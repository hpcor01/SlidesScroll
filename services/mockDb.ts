import { Article, Role, User } from '../types';

// NOTA: Para usar o Backend Real criado em `backend/server.js`:
// 1. Rode o servidor backend (node backend/server.js)
// 2. Descomente as chamadas fetch abaixo e remova o código localStorage.

const USERS_COLLECTION = 'dbSlides.colUser';
const SLIDES_COLLECTION = 'dbSlides.colSlide';
const API_URL = 'http://localhost:5000/api';


export const getUsers = async (): Promise<User[]> => {
  // IMPLEMENTAÇÃO REAL:
  // const res = await fetch(`${API_URL}/users`);
  // return res.json();

  // MOCK:
  const stored = localStorage.getItem(USERS_COLLECTION);
  if (!stored) {
    localStorage.setItem(USERS_COLLECTION, JSON.stringify(initialUsers));
    return Promise.resolve(initialUsers);
  }
  return Promise.resolve(JSON.parse(stored));
};

export const saveUser = async (user: User): Promise<void> => {
  // IMPLEMENTAÇÃO REAL:
  await fetch(`${API_URL}/users`, {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify(user)
  });


export const deleteUser = async (id: string): Promise<void> => {
  // IMPLEMENTAÇÃO REAL:
  await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });

export const getArticles = async (): Promise<Article[]> => {
  // IMPLEMENTAÇÃO REAL:
  const res = await fetch(`${API_URL}/slides`);
  return res.json();

export const saveArticle = async (article: Article): Promise<void> => {
  // IMPLEMENTAÇÃO REAL:
  await fetch(`${API_URL}/slides`, {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify(article)
  });


export const deleteArticle = async (id: string): Promise<void> => {
  // IMPLEMENTAÇÃO REAL:
  await fetch(`${API_URL}/slides/${id}`, { method: 'DELETE' });