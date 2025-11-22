import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // This is CRITICAL
});

// Add request interceptor to debug
api.interceptors.request.use(
  (config) => {
    // Only set Content-Type to JSON if we're not sending FormData
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }
    console.log("Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor to debug
api.interceptors.response.use(
  (response) => {
    console.log("Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error("Response error:", error.response?.status, error.config?.url);
    return Promise.reject(error);
  }
);

export default api;
