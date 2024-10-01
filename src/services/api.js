import axios from 'axios';

// Criação da instância de Axios
const api = axios.create({
  baseURL: 'http://localhost:3001',  // A URL base do backend
});

// Interceptor para adicionar o token JWT nas requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');  // Pega o access token do localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;  // Adiciona o access token no cabeçalho Authorization
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de resposta para lidar com tokens expirados
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se o erro for 401 (não autorizado), tenta renovar o access token
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh_token');  // Pega o refresh token do localStorage

      try {
        // Faz uma requisição ao backend para renovar o access token
        const response = await axios.post('http://localhost:3001/api/auth/refresh', {
          refresh_token: refreshToken,
        });

        const newAccessToken = response.data.access_token;
        localStorage.setItem('token', newAccessToken);  // Atualiza o novo access token no localStorage

        // Atualiza o cabeçalho da requisição original e repete a requisição
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        console.error('Erro ao renovar o token', err);
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
