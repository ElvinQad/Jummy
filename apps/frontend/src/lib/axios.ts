import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Helper function to check if the request is auth-related
const isAuthRequest = (url?: string) => {
  const authPaths = ['/auth/login', '/auth/register', '/auth/google/callback', '/auth/google/register'];
  return url && authPaths.some(path => url.includes(path));
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // For auth-related endpoints, immediately reject with the error
    if (isAuthRequest(originalRequest?.url)) {
      return Promise.reject(error);
    }

    // Handle token refresh for other 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // If token refresh is already in progress, queue the request
        return new Promise((resolve, reject) => {
          refreshSubscribers.push((token: string) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;

      const refreshPromise = new Promise((resolve, reject) => {
        refreshSubscribers.push((token: string) => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          resolve(api(originalRequest));
        });
      });

      try {
        const event = new CustomEvent('token:refresh');
        window.dispatchEvent(event);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }

      return refreshPromise;
    }

    return Promise.reject(error);
  }
);

export const onRefreshSuccess = (token: string) => {
  isRefreshing = false; // Reset the flag after refreshing
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


