// Metrics Service - Requisições relacionadas às métricas e análises

import { httpClient } from './httpClient';

export const metricsService = {
  // Obter métricas completas de uma criança
  getChildMetrics: async (childId) => {
    try {
      const response = await httpClient.get(
        `/Metrics/child/${childId}`,
        true
      );

      console.log('Métricas da criança obtidas:', response);
      return response;
    } catch (error) {
      console.error('Erro ao obter métricas da criança:', error);
      throw error;
    }
  },

  // Obter métricas de um desafio específico
  getChallengeMetrics: async (childId, challengeNumber) => {
    try {
      return await httpClient.get(
        `/Metrics/child/${childId}/challenge/${challengeNumber}`,
        true
      );
    } catch (error) {
      console.error(`Erro ao obter métricas do desafio ${challengeNumber}:`, error);
      throw error;
    }
  },

  // Obter progresso temporal de um desafio
  getChallengeProgress: async (childId, challengeNumber) => {
    try {
      return await httpClient.get(
        `/Metrics/child/${childId}/challenge/${challengeNumber}/progress`,
        true
      );
    } catch (error) {
      console.error(`Erro ao obter progresso do desafio ${challengeNumber}:`, error);
      throw error;
    }
  },

  // Obter análise de emoções específica
  getEmotionAnalysis: async (childId, challengeNumber, emotion) => {
    try {
      return await httpClient.get(
        `/Metrics/child/${childId}/challenge/${challengeNumber}/emotion/${emotion}`,
        true
      );
    } catch (error) {
      console.error(`Erro ao obter análise da emoção ${emotion}:`, error);
      throw error;
    }
  },

  // Gerar relatório PDF
  generateReport: async (childId) => {
    try {
      return await httpClient.get(
        `/Metrics/child/${childId}/report/pdf`,
        true,
        'application/pdf'
      );
    } catch (error) {
      console.error('Erro ao gerar relatório PDF:', error);
      throw error;
    }
  },
};
