import axios from "axios";

// Use import.meta.env instead of process.env in Vite
// For development - use localhost backend
// For production - use your production backend URL
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post("/api/auth/login", credentials),
  register: (userData) => api.post("/api/auth/register", userData),
  getProfile: () => api.get("/api/auth/profile"),
};

export const quotesAPI = {
  createRequest: (bookData) => api.post("/quotes", bookData),
  getMyRequests: () => api.get("/quotes/my-requests"),
  getAllRequests: () => api.get("/quotes"),
  getRequest: (id) => api.get(`/quotes/${id}`),
};

export const responsesAPI = {
  createResponse: (responseData) => api.post("/responses", responseData),
  getMyResponses: () => api.get("/responses/my-responses"),
  acceptResponse: (id) => api.patch(`/responses/${id}/accept`),
};

export default api;
