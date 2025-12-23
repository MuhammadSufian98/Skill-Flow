import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
  withCredentials: true, // cookies / sessions
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* =========================
   REQUEST INTERCEPTOR
========================= */
api.interceptors.request.use(
  (config) => {
    // Example: attach token if you store it
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================
   RESPONSE INTERCEPTOR
========================= */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Global error handling
    if (error.response) {
      const { status } = error.response;

      // Optional: auto logout on 401
      if (status === 401 && typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        // window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
