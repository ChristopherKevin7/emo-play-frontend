// Games Service - Requisições relacionadas aos jogos e desafios

import { httpClient } from './httpClient';

export const gamesService = {
  // Enviar resultado da fase/desafio
  submitGameResult: async (gameResultData) => {
    try {
      const response = await httpClient.post(
        '/Games/results',
        gameResultData,
        true,
        'application/json'
      );
      
      console.log('Resultado enviado com sucesso:', response);
      return response;
    } catch (error) {
      console.error('Erro ao enviar resultado do jogo:', error);
      throw error;
    }
  },

  // Obter histórico de resultados de uma criança
  getChildGameHistory: async (childId) => {
    try {
      return await httpClient.get(
        `/Games/child/${childId}/history`,
        true
      );
    } catch (error) {
      console.error('Erro ao obter histórico de jogos:', error);
      throw error;
    }
  },

  // Obter detalhes de um resultado específico
  getGameResult: async (resultId) => {
    try {
      return await httpClient.get(
        `/Games/results/${resultId}`,
        true
      );
    } catch (error) {
      console.error('Erro ao obter resultado do jogo:', error);
      throw error;
    }
  },

  // Iniciar nova sessão de jogo
  startGameSession: async (sessionData) => {
    try {
      return await httpClient.post(
        '/Games/session/start',
        sessionData,
        true,
        'application/json'
      );
    } catch (error) {
      console.error('Erro ao iniciar sessão de jogo:', error);
      throw error;
    }
  },

  // Finalizar sessão de jogo
  endGameSession: async (sessionId) => {
    try {
      return await httpClient.post(
        `/Games/session/${sessionId}/end`,
        {},
        true,
        'application/json'
      );
    } catch (error) {
      console.error('Erro ao finalizar sessão de jogo:', error);
      throw error;
    }
  },
};
