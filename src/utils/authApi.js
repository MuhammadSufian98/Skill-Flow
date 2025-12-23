import api from "@/utils/axiosInstance";

export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const signup = async (email, password, name, role) => {
  try {
    const response = await api.post("/auth/signup", {
      email,
      password,
      name,
      role,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const me = async () => {
  try {
    const response = await api.get("/auth/me");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logoutApi = async () => {
  try {
    const response = await api.post("/auth/logout");
    return response.data;
  } catch (error) {
    throw error;
  }
};
