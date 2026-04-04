// Child Service - Requisições relacionadas à criança

import { httpClient } from './httpClient';

export const childService = {
  // Criar nova sessão de jogo
  createSession: async (childId, gameMode) => {
    try {
      return await httpClient.post(
        '/Child/session/create',
        {
          childId,
          gameMode, // 'identify' ou 'express'
          startTime: new Date().toISOString(),
        },
        true,
        'application/json'
      );
    } catch (error) {
      console.error('Erro ao criar sessão:', error);
      throw error;
    }
  },

  // Salvar resultado de um desafio
  saveChallenge: async (sessionId, challengeData) => {
    try {
      return await httpClient.post(
        `/Child/session/${sessionId}/challenge`,
        {
          ...challengeData,
          timestamp: new Date().toISOString(),
        },
        true,
        'application/json'
      );
    } catch (error) {
      console.error('Erro ao salvar desafio:', error);
      throw error;
    }
  },

  // Finalizar sessão de jogo
  endSession: async (sessionId, sessionData) => {
    try {
      return await httpClient.post(
        `/Child/session/${sessionId}/end`,
        {
          ...sessionData,
          endTime: new Date().toISOString(),
        },
        true,
        'application/json'
      );
    } catch (error) {
      console.error('Erro ao finalizar sessão:', error);
      throw error;
    }
  },

  // Obter histórico de sessões da criança
  getSessionHistory: async (childId) => {
    try {
      return await httpClient.get(
        `/Child/${childId}/sessions`,
        true
      );
    } catch (error) {
      console.error('Erro ao obter histórico de sessões:', error);
      throw error;
    }
  },

  // Obter dados da criança
  getChildData: async (childId) => {
    try {
      return await httpClient.get(
        `/Child/${childId}`,
        true
      );
    } catch (error) {
      console.error('Erro ao obter dados da criança:', error);
      throw error;
    }
  },

  // Atualizar perfil da criança
  updateProfile: async (childId, profileData) => {
    try {
      return await httpClient.put(
        `/Child/${childId}`,
        profileData,
        true
      );
    } catch (error) {
      console.error('Erro ao atualizar perfil da criança:', error);
      throw error;
    }
  },

  // Obter próximo desafio
  getNextChallenge: async (sessionId, difficulty = 'easy') => {
    try {
      return await httpClient.get(
        `/Child/session/${sessionId}/next-challenge?difficulty=${difficulty}`,
        true
      );
    } catch (error) {
      console.error('Erro ao obter próximo desafio:', error);
      throw error;
    }
  },

  // Obter score/pontos da criança
  getScore: async (childId) => {
    try {
      return await httpClient.get(
        `/Child/${childId}/score`,
        true
      );
    } catch (error) {
      console.error('Erro ao obter score:', error);
      throw error;
    }
  },
};
