import axios from "axios";

// Use import.meta.env instead of process.env in Vite
// For development - use localhost backend
// For production - use your production backend URL
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // ✅ moved timeout here
  headers: {
    "Content-Type": "application/json",
  },
});

// Create separate axios instance for ISBNdb API calls (without auth interceptor)
const isbnApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token for regular API calls only
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("userToken");
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
  createQuotes: (requestId, quoteData) =>
    api.post(`/api/requests/${requestId}/quotes`, quoteData),
  getUserQuotes: () => api.get("/api/quotes/users/my-quotes"), // For users to see quotes on their requests
  getMyQuotes: () => api.get("/api/quotes/my-quotes"),
  getAllQuotes: () => api.get("/api/quotes"),
  getMyQuotesById: (id) => api.get(`/api/quotes/${id}`),
};

export const responsesAPI = {
  createResponse: (responseData) => api.post("/api/responses", responseData),
  getMyResponses: () => api.get("/api/responses/my-responses"),
  acceptResponse: (id) => api.patch(`/api/responses/${id}/accept`),
};

export const booksAPI = {
  getAll: () => api.get("/api/books"),
  getBook: (id) => api.get(`/api/books/${id}`),
  createBook: (bookData) => api.post("/api/books", bookData),
  updateBook: (id, bookData) => api.put(`/api/books/${id}`, bookData),
  deleteBook: (id) => api.delete(`/api/books/${id}`),
  searchBook: (searchTerm) => api.get(`/api/books/search?title=${searchTerm}`),
};

export const requestsAPI = {
  getAll: () => api.get("/api/requests"),
  getById: (id) => api.get(`/api/requests/${id}`),
  create: (requestData) => api.post("/api/requests", requestData),
  update: (id, requestData) => api.put(`/api/requests/${id}`, requestData),
  delete: (id) => api.delete(`/api/requests/${id}`),
  getMyRequests: () => api.get("/api/requests/my-requests"),
};

export const isbnAPI = {
  searchBooks: (query) =>
    api.get(`api/books/search?q=${encodeURIComponent(query)}`),
  getBookByISBN: (isbn) => api.get(`api/books/isbn/${isbn}`),
};

export default api;
