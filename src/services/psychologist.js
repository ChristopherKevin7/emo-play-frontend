// Psychologist Service - Requisições relacionadas ao psicólogo

import { httpClient } from './httpClient';

export const psychologistService = {
  // Obter métricas de uma sessão
  getSessionMetrics: async (sessionId) => {
    try {
      return await httpClient.get(
        `/Psychologist/session/${sessionId}/metrics`,
        true
      );
    } catch (error) {
      console.error('Erro ao obter métricas da sessão:', error);
      throw error;
    }
  },

  // Obter relatório detalhado de uma criança
  getChildReport: async (childId) => {
    try {
      return await httpClient.get(
        `/Psychologist/child/${childId}/report`,
        true
      );
    } catch (error) {
      console.error('Erro ao obter relatório da criança:', error);
      throw error;
    }
  },

  // Obter todas as crianças vinculadas ao psicólogo
  getChildren: async (psychologistId) => {
    try {
      return await httpClient.get(
        `/Psychologist/${psychologistId}/children`,
        true
      );
    } catch (error) {
      console.error('Erro ao obter lista de crianças:', error);
      throw error;
    }
  },

  // Obter histórico de sessões de uma criança
  getChildSessions: async (childId, filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const queryString = params.toString() ? `?${params.toString()}` : '';

      return await httpClient.get(
        `/Psychologist/child/${childId}/sessions${queryString}`,
        true
      );
    } catch (error) {
      console.error('Erro ao obter histórico de sessões:', error);
      throw error;
    }
  },

  // Obter análise de progresso
  getProgressAnalysis: async (childId, dateRange = {}) => {
    try {
      const params = new URLSearchParams(dateRange);
      const queryString = params.toString() ? `?${params.toString()}` : '';

      return await httpClient.get(
        `/Psychologist/child/${childId}/progress${queryString}`,
        true
      );
    } catch (error) {
      console.error('Erro ao obter análise de progresso:', error);
      throw error;
    }
  },

  // Obter estatísticas gerais do psicólogo
  getDashboardStats: async (psychologistId) => {
    try {
      return await httpClient.get(
        `/Psychologist/${psychologistId}/dashboard`,
        true
      );
    } catch (error) {
      console.error('Erro ao obter estatísticas do dashboard:', error);
      throw error;
    }
  },

  // Exportar relatório em PDF
  exportReport: async (childId, format = 'pdf') => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/Psychologist/child/${childId}/export`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Accept': format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ao exportar relatório: ${response.status}`);
      }

      return response.blob();
    } catch (error) {
      console.error('Erro ao exportar relatório:', error);
      throw error;
    }
  },

  // Adicionar nota/observação sobre uma criança
  addNote: async (childId, noteData) => {
    try {
      return await httpClient.post(
        `/Psychologist/child/${childId}/notes`,
        {
          ...noteData,
          createdAt: new Date().toISOString(),
        },
        true,
        'application/json'
      );
    } catch (error) {
      console.error('Erro ao adicionar nota:', error);
      throw error;
    }
  },

  // Obter notas de uma criança
  getNotes: async (childId) => {
    try {
      return await httpClient.get(
        `/Psychologist/child/${childId}/notes`,
        true
      );
    } catch (error) {
      console.error('Erro ao obter notas:', error);
      throw error;
    }
  },

  // Comparar desempenho entre crianças
  compareChildren: async (childIds = []) => {
    try {
      return await httpClient.post(
        '/Psychologist/compare-children',
        { childIds },
        true,
        'application/json'
      );
    } catch (error) {
      console.error('Erro ao comparar crianças:', error);
      throw error;
    }
  },
};
