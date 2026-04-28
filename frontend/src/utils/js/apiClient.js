import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_DEV_API_BASE_URL,
  withCredentials: true,
});

let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
};

export const clearAuthToken = () => {
  authToken = null;
};

apiClient.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

export default apiClient;
