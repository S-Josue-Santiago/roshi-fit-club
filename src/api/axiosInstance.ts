import axios from 'axios';

// Crea una instancia de Axios con una URL base.
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // OK si tu backend usa 5000
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;