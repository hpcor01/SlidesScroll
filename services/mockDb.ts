import { Article, Role, User } from '../src/types';

const API_URL = 'https://slides-backend-hu6m.onrender.com/api';

export const getUsers = async (): Promise<User[]> => {
  const res = await fetch(`${API_URL}/users`);
  return res.json();
};

export const saveUser = async (user: User): Promise<void> => {
  await fetch(`${API_URL}/users`, {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify(user)
  });
};


export const deleteUser = async (id: string): Promise<void> => {
  await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });

};


export const getArticles = async (): Promise<Article[]> => {
  const res = await fetch(`${API_URL}/slides`);
  return res.json();

};


export const saveArticle = async (article: Article): Promise<void> => {
  await fetch(`${API_URL}/slides`, {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify(article)
  });

};


export const deleteArticle = async (id: string): Promise<void> => {
  await fetch(`${API_URL}/slides/${id}`, { method: 'DELETE' });

};
