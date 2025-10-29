import axios from 'axios';

// URL base de tu API
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'; // ← Cambiado de 5000 a 3000

// Crea una instancia de Axios
const api = axios.create({
  baseURL: `${VITE_API_BASE_URL}/api`, // ← Nota: agregamos /api aquí
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // ← IMPORTANTE: Equivalente a credentials: 'include'
});

// Interceptor para incluir el token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);  

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('userToken');
      window.location.href = '/'; // Redirigir al login
    }
    return Promise.reject(error);
  }
);

export default api;