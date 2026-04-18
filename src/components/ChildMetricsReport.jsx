import React, { useState } from 'react';
import '../styles/ChildMetricsReport.css';

// Mapa de traduções de emoções do inglês para português
const EMOTION_TRANSLATIONS = {
  'Happy': 'Feliz',
  'Happiness': 'Feliz',
  'Sad': 'Triste',
  'Sadness': 'Triste',
  'Angry': 'Raiva',
  'Anger': 'Raiva',
  'Surprised': 'Surpresa',
  'Surprise': 'Surpresa',
  'Fearful': 'Medo',
  'Fear': 'Medo',
  'Disgusted': 'Nojo',
  'Disgust': 'Nojo',
};

// Mapa de traduções de níveis
const LEVEL_TRANSLATIONS = {
  'easy': 'Fácil',
  'medium': 'Médio',
  'hard': 'Difícil',
};

// Função para traduzir emoção
const translateEmotion = (emotionEnglish) => {
  return EMOTION_TRANSLATIONS[emotionEnglish] || emotionEnglish;
};

// Função para traduzir nível
const translateLevel = (levelEnglish) => {
  return LEVEL_TRANSLATIONS[levelEnglish?.toLowerCase()] || levelEnglish;
};

// Mapa de cores por nível
const LEVEL_COLORS = {
  'easy': '#2563EB',      // azul
  'medium': '#F59E0B',    // Amarelo
  'hard': '#7C3AED',      // roxo
};

// Função para obter cor do nível
const getLevelColor = (level) => {
  return LEVEL_COLORS[level?.toLowerCase()] || '#667eea';
};

// Componente do Gráfico de Progresso
const ProgressChart = ({ historicAttempts }) => {
  if (!historicAttempts || historicAttempts.length === 0) {
    return <p className="chart-no-data">Sem dados disponíveis para o gráfico</p>;
  }

  // Ordenar por data (mais antigo primeiro para visualizar progressão correta)
  const sortedAttempts = [...historicAttempts].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Configurações do gráfico
  const padding = 50;
  const chartWidth = 600;
  const chartHeight = 300;
  const graphWidth = chartWidth - padding * 2;
  const graphHeight = chartHeight - padding * 2;

  // Usar escala fixa de 0 a 100
  const minAccuracy = 0;
  const maxAccuracy = 100;
  const accuracyRange = 100;

  // Calcular posições dos pontos
  const points = sortedAttempts.map((attempt, index) => {
    const x = padding + (index / (sortedAttempts.length - 1 || 1)) * graphWidth;
    const normalizedAccuracy = (attempt.accuracyRate - minAccuracy) / accuracyRange;
    const y = padding + graphHeight - normalizedAccuracy * graphHeight;
    return {
      x,
      y,
      ...attempt,
    };
  });

  return (
    <div className="chart-container">
      <svg 
        width={chartWidth} 
        height={chartHeight} 
        className="progress-chart"
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid e eixos */}
        <line 
          x1={padding} 
          y1={padding} 
          x2={padding} 
          y2={chartHeight - padding} 
          stroke="#ddd" 
          strokeWidth="2"
        />
        <line 
          x1={padding} 
          y1={chartHeight - padding} 
          x2={chartWidth - padding} 
          y2={chartHeight - padding} 
          stroke="#ddd" 
          strokeWidth="2"
        />

        {/* Labels dos eixos */}
        <text x={padding - 20} y={padding - 10} fontSize="12" fill="#666">100%</text>
        <text x={padding - 30} y={chartHeight - padding + 15} fontSize="12" fill="#666">0%</text>

        {/* Linhas de grade horizontais com labels a cada 25% */}
        {[0, 25, 50, 75, 100].map((value) => {
          const y = chartHeight - padding - (value / 100) * graphHeight;
          return (
            <g key={`grid-${value}`}>
              <line 
                x1={padding} 
                y1={y} 
                x2={chartWidth - padding} 
                y2={y} 
                stroke="#f0f0f0" 
                strokeWidth="1"
                strokeDasharray="4,4"
              />
              <text x={padding - 40} y={y + 4} fontSize="11" fill="#999" textAnchor="end">
                {`${value}%`}
              </text>
            </g>
          );
        })}

        {/* Pontos do gráfico */}
        {points.map((point, index) => (
          <g key={`point-${index}`}>
            {/* Linha conectando os pontos */}
            {index < points.length - 1 && (
              <line
                x1={point.x}
                y1={point.y}
                x2={points[index + 1].x}
                y2={points[index + 1].y}
                stroke="#ddd"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
            )}
            {/* Ponto */}
            <circle
              cx={point.x}
              cy={point.y}
              r="6"
              fill={getLevelColor(point.level)}
              stroke="white"
              strokeWidth="2"
              className="chart-point"
            />
            {/* Tooltip ao hover */}
            <title>
              {`${new Date(point.date).toLocaleDateString('pt-BR')}\n${point.accuracyRate.toFixed(2)}%\nNível: ${translateLevel(point.level)}`}
            </title>
          </g>
        ))}
      </svg>

      {/* Legenda */}
      <div className="chart-legend">
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: LEVEL_COLORS.easy }}></span>
          <span>Fácil</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: LEVEL_COLORS.medium }}></span>
          <span>Médio</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: LEVEL_COLORS.hard }}></span>
          <span>Difícil</span>
        </div>
      </div>
    </div>
  );
};

const ChallengeMetricsCard = ({ challengeName, challengeData }) => {
  const [activeTab, setActiveTab] = useState('list'); // 'list' ou 'chart'

  if (!challengeData) {
    return (
      <div className="challenge-metrics-card disabled">
        <h3>{challengeName}</h3>
        <p className="no-data-message">A criança ainda não realizou este desafio</p>
      </div>
    );
  }

  const { accuracyRate, averageResponseTimeMs, emotionBreakdown, totalSessions, progressTrend, historicAttempts } = challengeData;

  // Ordenar historicAttempts por data (mais recente primeiro)
  const sortedHistoricAttempts = historicAttempts && historicAttempts.length > 0
    ? [...historicAttempts].sort((a, b) => new Date(b.date) - new Date(a.date))
    : [];

  return (
    <div className="challenge-metrics-card">
      <h3>{challengeName}</h3>
      
      <div className="metrics-summary">
        <div className="metric-item">
          <span className="metric-label">Taxa de Acerto</span>
          <span className="metric-value">{(accuracyRate * 100).toFixed(2)}%</span>
        </div>
        
        <div className="metric-item">
          <span className="metric-label">Tempo Médio de Resposta</span>
          <span className="metric-value">{averageResponseTimeMs.toFixed(0)}ms</span>
        </div>
        
        <div className="metric-item">
          <span className="metric-label">Total de Sessões</span>
          <span className="metric-value">{totalSessions}</span>
        </div>
      </div>

      {emotionBreakdown && Object.keys(emotionBreakdown).length > 0 && (
        <div className="emotion-breakdown">
          <h4>Análise por Emoção</h4>
          <div className="emotion-grid">
            {Object.entries(emotionBreakdown).map(([emotion, data]) => (
              <div key={emotion} className="emotion-item">
                <div className="emotion-name">{translateEmotion(emotion)}</div>
                <div className="emotion-stats">
                  <span className="stat">Tentativas: {data.attempts}</span>
                  <span className="stat">Corretas: {data.correctAttempts}</span>
                  <span className={`stat accuracy ${data.accuracy === 1 ? 'perfect' : data.accuracy > 0.5 ? 'good' : 'needs-work'}`}>
                    Acurácia: {(data.accuracy * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(historicAttempts && historicAttempts.length > 0) || (progressTrend && progressTrend.length > 0) ? (
        <div className="progress-section">
          <div className="progress-header">
            <h4>Tendência de Progresso</h4>
            <div className="tabs">
              <button
                className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
                onClick={() => setActiveTab('list')}
              >
                📋 Lista
              </button>
              <button
                className={`tab-btn ${activeTab === 'chart' ? 'active' : ''}`}
                onClick={() => setActiveTab('chart')}
              >
                📊 Gráfico
              </button>
            </div>
          </div>

          {activeTab === 'list' ? (
            <div className="progress-list">
              {sortedHistoricAttempts && sortedHistoricAttempts.length > 0 ? (
                // Exibir histórico de tentativas se disponível
                sortedHistoricAttempts.map((attempt, index) => (
                  <div key={index} className="progress-item">
                    <div className="progress-details">
                      <span className="date">
                        {new Date(attempt.date).toLocaleDateString('pt-BR')} às {new Date(attempt.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="level">
                        Nível: {translateLevel(attempt.level)}
                      </span>
                    </div>
                    <span className="accuracy">
                      {attempt.accuracyRate.toFixed(2)}%
                    </span>
                  </div>
                ))
              ) : (
                // Fallback para progressTrend se historicAttempts não estiver disponível
                progressTrend.map((trend, index) => (
                  <div key={index} className="progress-item">
                    <span className="date">
                      {new Date(trend.date).toLocaleDateString('pt-BR')}
                    </span>
                    <span className="accuracy">
                      {(trend.accuracy * 100).toFixed(2)}%
                    </span>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="chart-tab-content">
              {sortedHistoricAttempts && sortedHistoricAttempts.length > 0 ? (
                <ProgressChart historicAttempts={sortedHistoricAttempts} />
              ) : (
                <p className="chart-no-data">Sem dados de histórico disponíveis para o gráfico</p>
              )}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export const ChildMetricsReport = ({ metricsData, childName }) => {
  if (!metricsData) {
    return (
      <div className="child-metrics-report">
        <p className="no-data">Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className="child-metrics-report">
      <div className="challenges-container">
        <ChallengeMetricsCard 
          challengeName="🎯 Desafio 1 - Identificação"
          challengeData={metricsData.desafio_1}
        />
        
        <ChallengeMetricsCard 
          challengeName="🎭 Desafio 2 - Expressão"
          challengeData={metricsData.desafio_2}
        />
      </div>
    </div>
  );
};
