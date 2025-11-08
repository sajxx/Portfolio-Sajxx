import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:5000";

const TOKEN_KEY = "portfolio_admin_token";
let inMemoryToken = null;
const listeners = new Set();

const notify = (token) => {
  listeners.forEach((listener) => {
    try {
      listener(token);
    } catch (error) {
      console.error("authStore listener error", error);
    }
  });
};

const client = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const applyToken = (token) => {
  inMemoryToken = token;
  if (token) {
    client.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete client.defaults.headers.common.Authorization;
  }
};

export const authStore = {
  getToken() {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem(TOKEN_KEY);
    }
    return inMemoryToken;
  },
  setToken(token) {
    applyToken(token);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(TOKEN_KEY, token);
    }
    notify(token);
  },
  clearToken() {
    applyToken(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(TOKEN_KEY);
    }
    notify(null);
  },
  hydrate() {
    if (typeof window !== "undefined") {
      const existing = window.localStorage.getItem(TOKEN_KEY);
      if (existing) {
        applyToken(existing);
        notify(existing);
      }
    }
  },
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }
};

authStore.hydrate();

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.message;
    if (message) {
      console.error("API error:", message);
    }
    if (error?.response?.status === 401) {
      authStore.clearToken();
    }
    return Promise.reject(error);
  }
);

export const api = {
  async getProfile() {
    const { data } = await client.get("/api/profile");
    return data;
  },
  async getProjects(params) {
    const { data } = await client.get("/api/projects", { params });
    return data;
  },
  async getSkills(params) {
    const { data } = await client.get("/api/skills", { params });
    return data;
  },
  async getAchievements(params) {
    const { data } = await client.get("/api/achievements", { params });
    return data;
  },
  async submitContact(payload) {
    const { data } = await client.post("/api/contact", payload);
    return data;
  },
  async adminLogin(password) {
    const { data } = await client.post("/api/auth/login", { password });
    return data;
  },
  async refreshToken() {
    const { data } = await client.post("/api/auth/refresh");
    return data;
  },
  async updateProfile(payload) {
    const { data } = await client.put("/api/profile", payload);
    return data;
  },
  async createProject(payload) {
    const { data } = await client.post("/api/projects", payload);
    return data;
  },
  async updateProject(id, payload) {
    const { data } = await client.put(`/api/projects/${id}`, payload);
    return data;
  },
  async deleteProject(id) {
    await client.delete(`/api/projects/${id}`);
  },
  async createSkill(payload) {
    const { data } = await client.post("/api/skills", payload);
    return data;
  },
  async updateSkill(id, payload) {
    const { data } = await client.put(`/api/skills/${id}`, payload);
    return data;
  },
  async deleteSkill(id) {
    await client.delete(`/api/skills/${id}`);
  },
  async createAchievement(payload) {
    const { data } = await client.post("/api/achievements", payload);
    return data;
  },
  async updateAchievement(id, payload) {
    const { data } = await client.put(`/api/achievements/${id}`, payload);
    return data;
  },
  async deleteAchievement(id) {
    await client.delete(`/api/achievements/${id}`);
  },
  async getMessages(params) {
    const { data } = await client.get("/api/contact", { params });
    return data;
  },
  async updateMessageStatus(id, status) {
    const { data } = await client.patch(`/api/contact/${id}/status`, { status });
    return data;
  },
  async deleteMessage(id) {
    await client.delete(`/api/contact/${id}`);
  },
};

export default client;
