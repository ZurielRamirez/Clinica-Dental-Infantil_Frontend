import axios from 'axios';

// 1. Instancia base de Axios con la URL base de Laravel Sanctum API
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// 2. Interceptor de Peticiones (Request): Adjunta el Token Bearer si existe
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Interceptor de Respuestas (Response): Manejo Global de Errores (401, 403, 500, etc.)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      // Si el token expiró o es inválido (Unauthenticated)
      if (status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirigir al login si la ruta no es pública
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }

      // Si no tiene permisos para realizar una acción
      if (status === 403) {
        console.error('No tienes permisos suficientes para realizar esta acción.');
      }

      // Error interno del servidor
      if (status === 500) {
        console.error('Error interno del servidor. Intenta de nuevo más tarde.');
      }
    }

    return Promise.reject(error);
  }
);

export default api;