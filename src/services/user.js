// User Service - Gerenciamento de dados do usuário

import { httpClient } from './httpClient';

export const userService = {
  // Obter dados completos do usuário pelo ID
  getUserById: async (userId) => {
    try {
      return await httpClient.get(
        `/Users/${userId}`,
        true // com autenticação
      );
    } catch (error) {
      console.error('Erro ao obter dados do usuário:', error);
      throw error;
    }
  },

  // Atualizar perfil do usuário
  updateProfile: async (userId, profileData) => {
    try {
      return await httpClient.put(
        `/Users/${userId}`,
        profileData,
        true
      );
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  },

  // Obter preferências do usuário
  getPreferences: async (userId) => {
    try {
      return await httpClient.get(
        `/Users/${userId}/preferences`,
        true
      );
    } catch (error) {
      console.error('Erro ao obter preferências:', error);
      throw error;
    }
  },

  // Salvar preferências do usuário
  savePreferences: async (userId, preferences) => {
    try {
      return await httpClient.post(
        `/Users/${userId}/preferences`,
        preferences,
        true,
        'application/json'
      );
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
      throw error;
    }
  },

  // Obter foto de perfil
  getProfilePhoto: async (userId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/Users/${userId}/photo`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ao obter foto: ${response.status}`);
      }

      return response.blob();
    } catch (error) {
      console.error('Erro ao obter foto de perfil:', error);
      throw error;
    }
  },

  // Upload de foto de perfil
  uploadProfilePhoto: async (userId, photoFile) => {
    try {
      const formData = new FormData();
      formData.append('photo', photoFile);

      return await httpClient.post(
        `/Users/${userId}/photo`,
        formData,
        true,
        'multipart/form-data'
      );
    } catch (error) {
      console.error('Erro ao fazer upload de foto:', error);
      throw error;
    }
  },

  // Obter lista de crianças cadastradas (para psicólogos)
  getChildren: async () => {
    try {
      return await httpClient.get(
        '/Users/children',
        true
      );
    } catch (error) {
      console.error('Erro ao obter lista de crianças:', error);
      throw error;
    }
  },

  // Criar nova criança
  createChild: async (childData) => {
    try {
      return await httpClient.post(
        '/Users',
        {
          name: childData.name,
          email: childData.email,
          password: childData.password,
          role: 1,
        },
        true
      );
    } catch (error) {
      console.error('Erro ao criar criança:', error);
      throw error;
    }
  },

  // Deletar conta do usuário
  deleteAccount: async (userId) => {
    try {
      return await httpClient.delete(
        `/Users/${userId}`,
        true
      );
    } catch (error) {
      console.error('Erro ao deletar conta:', error);
      throw error;
    }
  },
};
