import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:5000";

const client = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.message;
    if (message) {
      console.error("API error:", message);
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
};

export default client;
