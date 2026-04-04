// Emotion Service - Detecção e análise de emoções

import { httpClient } from './httpClient';

export const emotionService = {
  // Analisar imagem e detectar emoção
  analyzeEmotion: async (imageData, mode = 'identify') => {
    try {
      const response = await httpClient.post(
        `/Emotion/analyze`,
        imageData,
        true,
        'application/octet-stream'
      );

      return response;
    } catch (error) {
      console.error('Erro ao analisar emoção:', error);
      throw error;
    }
  },

  // Detectar emoção no modo "Identificar"
  detectIdentifyMode: async (imageBlobUrl) => {
    try {
      const response = await fetch(imageBlobUrl);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append('image', blob, 'emotion.jpg');
      formData.append('mode', 'identify');

      return await httpClient.post(
        '/Emotion/detect-identify',
        formData,
        true,
        'multipart/form-data'
      );
    } catch (error) {
      console.error('Erro ao detectar emoção (Identify):', error);
      throw error;
    }
  },

  // Detectar emoção no modo "Expressar"
  detectExpressMode: async (imageBlobUrl, targetEmotion) => {
    try {
      const response = await fetch(imageBlobUrl);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append('image', blob, 'emotion.jpg');
      formData.append('targetEmotion', targetEmotion);
      formData.append('mode', 'express');

      return await httpClient.post(
        '/Emotion/detect-express',
        formData,
        true,
        'multipart/form-data'
      );
    } catch (error) {
      console.error('Erro ao detectar emoção (Express):', error);
      throw error;
    }
  },

  // Obter lista de emoções suportadas
  getSupportedEmotions: async () => {
    try {
      return await httpClient.get('/Emotion/supported', true);
    } catch (error) {
      console.error('Erro ao obter emoções suportadas:', error);
      throw error;
    }
  },

  // Capturar imagem da webcam e enviar para análise
  captureAndAnalyze: async (imageBlobUrl) => {
    try {
      const response = await fetch(imageBlobUrl);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append('image', blob, 'emotion.jpg');

      return await httpClient.post(
        '/Emotion/capture-analyze',
        formData,
        true,
        'multipart/form-data'
      );
    } catch (error) {
      console.error('Erro ao capturar e analisar:', error);
      throw error;
    }
  },
};
