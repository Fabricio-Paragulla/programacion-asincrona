import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const authClient = axios.create({
  baseURL: import.meta.env.VITE_BEECEPTOR_URL
});

authClient.interceptors.request.use((config) => {
  const store = useAuthStore();
  if (store.token) {
    config.headers.Authorization = `Bearer ${store.token}`;
  }
  return config;
});

authClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const store = useAuthStore();
    if (error.response?.status === 401 || error.response?.status === 403) {
      store.logout();
      alert("⚠️ Tu sesión ha expirado. Por seguridad, inicia sesión de nuevo.");
      window.location.href = '/login'; // Redirigir al inicio
    }
    return Promise.reject(error);
  }
);

export default authClient;