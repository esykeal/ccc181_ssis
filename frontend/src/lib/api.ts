import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true, 
});

api.interceptors.request.use(
  (config) => {
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
