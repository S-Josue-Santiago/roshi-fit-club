import axios from 'axios';

// Crea una instancia de Axios con una URL base.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para incluir el token JWT en cada request
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

export default api;