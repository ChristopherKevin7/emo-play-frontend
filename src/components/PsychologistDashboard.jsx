import React, { useState, useEffect } from 'react';
import '../styles/PsychologistDashboard.css';

export const PsychologistDashboard = ({ sessionData }) => {
  const [metrics, setMetrics] = useState({
    hitRate: 0,
    avgResponseTime: 0,
    avgConfidence: 0,
  });

  useEffect(() => {
    if (sessionData && sessionData.results && sessionData.results.length > 0) {
      const { results } = sessionData;

      // Calcular Taxa de Acerto
      const correctCount = results.filter((r) => r.isCorrect).length;
      const hitRate = (correctCount / results.length) * 100;

      // Calcular Tempo Médio de Resposta
      const totalResponseTime = results.reduce((acc, r) => acc + (r.responseTime || 0), 0);
      const avgResponseTime = totalResponseTime / results.length;

      // Calcular Índice de Confiança Médio
      const totalConfidence = results.reduce((acc, r) => acc + (r.modelConfidence || 0), 0);
      const avgConfidence = totalConfidence / results.length;

      setMetrics({
        hitRate: hitRate.toFixed(2),
        avgResponseTime: avgResponseTime.toFixed(2),
        avgConfidence: avgConfidence.toFixed(2),
      });
    }
  }, [sessionData]);

  return (
    <div className="psychologist-dashboard">
      <h1>Dashboard do Psicólogo</h1>
      <p className="disclaimer">
        ⚠️ Essas métricas são estritamente técnicas e servem para avaliar o desempenho do protótipo.
        Não possuem finalidade de diagnóstico ou avaliação clínica.
      </p>

      <div className="metrics-container">
        <div className="metric-card">
          <h2>Taxa de Acerto</h2>
          <div className="metric-value">{metrics.hitRate}%</div>
          <p className="metric-description">
            Percentual de vezes que a emoção identificada corresponde à emoção-alvo
          </p>
        </div>

        <div className="metric-card">
          <h2>Tempo de Resposta</h2>
          <div className="metric-value">{metrics.avgResponseTime}ms</div>
          <p className="metric-description">
            Tempo médio decorrido entre a apresentação do estímulo e a captura da imagem
          </p>
        </div>

        <div className="metric-card">
          <h2>Índice de Confiança</h2>
          <div className="metric-value">{metrics.avgConfidence}%</div>
          <p className="metric-description">
            Valor percentual médio retornado pelo modelo, indicando o grau de certeza da predição
          </p>
        </div>
      </div>

      {sessionData?.createdAt && (
        <div className="session-info">
          <p><strong>ID da Sessão:</strong> {sessionData.id}</p>
          <p><strong>Data:</strong> {new Date(sessionData.createdAt).toLocaleString()}</p>
          <p><strong>Total de Desafios:</strong> {sessionData.results?.length || 0}</p>
        </div>
      )}
    </div>
  );
};
