// src/services/mockDB.ts
const API_URL = import.meta.env.VITE_API_URL;

async function request(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}/${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Erro na requisição");
  }

  return res.json();
}

export const mockDB = {
  // 🔹 Autenticação
  login: (data: { username: string; password: string }) =>
    request("users/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // 🔹 Usuários
  getUsers: () => request("users"),
  createUser: (data: any) =>
    request("users", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateUser: (id: string, data: any) =>
    request(`users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteUser: (id: string) =>
    request(`users/${id}`, {
      method: "DELETE",
    }),

  // 🔹 Slides
  getSlides: () => request("slides"),
  createSlide: (data: any) =>
    request("slides", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateSlide: (id: string, data: any) =>
    request(`slides/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteSlide: (id: string) =>
    request(`slides/${id}`, {
      method: "DELETE",
    }),
};
