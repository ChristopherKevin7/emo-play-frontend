import React, { useState, useEffect } from 'react';
import { PsychologistDashboard } from '../components/PsychologistDashboard';
import { useGame } from '../context/GameContext';
import '../styles/DashboardPage.css';

export const DashboardPage = ({ onExit }) => {
  const { score, totalChallenges, responseTime, modelConfidence } = useGame();
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    // Simular dados da sessão baseados no estado do jogo
    setSessionData({
      id: `session_${Date.now()}`,
      createdAt: new Date(),
      results: Array.from({ length: totalChallenges }, (_, i) => ({
        id: i,
        isCorrect: i < score,
        responseTime: responseTime || Math.random() * 5000,
        modelConfidence: modelConfidence || Math.random() * 100,
      })),
    });
  }, [score, totalChallenges, responseTime, modelConfidence]);

  return (
    <div className="dashboard-page">
      <button onClick={onExit} className="exit-btn">
        ← Voltar
      </button>

      {sessionData && <PsychologistDashboard sessionData={sessionData} />}

      <div className="dashboard-actions">
        <button onClick={onExit} className="action-btn">
          Começar Nova Sessão
        </button>
      </div>
    </div>
  );
};
