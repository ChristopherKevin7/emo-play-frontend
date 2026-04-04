// Auth Service - Autenticação, login e gerenciamento de token

import { httpClient, getToken } from './httpClient';

export const authService = {
  // Login - Autenticar usuário com email, senha e role
  login: async (email, password, role) => {
    try {
      const data = await httpClient.post(
        '/Auth/login',
        { email, password, role },
        false, // sem autenticação necessária no login
        'application/json'
      );

      // Guardar token no localStorage
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }

      // Guardar userId no localStorage
      if (data.userId) {
        localStorage.setItem('userId', data.userId);
      }

      return data;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  },

  // Logout - Limpar token e dados de autenticação
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
  },

  // Verificar se o usuário está autenticado
  isAuthenticated: () => {
    return !!getToken();
  },

  // Obter token atual
  getToken: () => {
    return getToken();
  },

  // Obter userId do localStorage
  getUserId: () => {
    return localStorage.getItem('userId');
  },

  // Refresh token (opcional, se o backend suportar)
  refreshToken: async () => {
    try {
      const data = await httpClient.post(
        '/Auth/refresh',
        {},
        true,
        'application/json'
      );

      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }

      if (data.userId) {
        localStorage.setItem('userId', data.userId);
      }

      return data;
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      // Se falhar, logout automático
      authService.logout();
      throw error;
    }
  },
};
