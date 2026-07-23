import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});


let isRefreshing = false;
let failedQueue = [];


const processQueue = (error) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });

  failedQueue = [];
};



api.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const originalRequest = error.config;


    // Network error
    if (!error.response) {
      return Promise.reject(error);
    }


    const status = error.response.status;


    const isAuthRoute =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register") ||
      originalRequest.url?.includes("/auth/refresh-token") ||
      originalRequest.url?.includes("/auth/logout");


    // Do not refresh on auth routes
    if (isAuthRoute) {
      return Promise.reject(error);
    }


    // Only handle 401
    if (status !== 401) {
      return Promise.reject(error);
    }


    // Prevent infinite loop
    if (originalRequest._retry) {
      return Promise.reject(error);
    }


    originalRequest._retry = true;



    // If another refresh request is already running
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve,
          reject,
        });
      })
      .then(() => {
        return api(originalRequest);
      })
      .catch((err) => {
        return Promise.reject(err);
      });
    }



    isRefreshing = true;


    try {

      // Refresh token request
      await api.post("/auth/refresh-token");


      processQueue(null);


      // Retry original failed request
      return api(originalRequest);


    } catch (refreshError) {


      processQueue(refreshError);


      return Promise.reject(refreshError);


    } finally {

      isRefreshing = false;

    }

  }
);



export default api;
