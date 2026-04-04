import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmotionChallenge } from '../components/EmotionChallenge';
import { useApp } from '../context/AppContext';
import '../styles/GamePage.css';

export const GamePage = ({ mode }) => {
  const navigate = useNavigate();
  const { score, totalChallenges, exitGame, gameMode } = useApp();

  // Se gameMode for null, redireciona para child-trail
  useEffect(() => {
    if (!gameMode) {
      navigate('/child-trail', { replace: true });
    }
  }, [gameMode, navigate]);

  const handleExit = () => {
    exitGame();
    navigate('/child-trail');
  };

  // Se gameMode for null, não renderiza nada (será redirecionado)
  if (!gameMode) {
    return null;
  }

  return (
    <div className="game-page">
      <div className="game-header">
        <button onClick={handleExit} className="exit-btn">
          ← Voltar
        </button>
        <h1>Modo: {mode === 'identify' ? '👁️ Identificar' : '🎭 Fazer Emoção'}</h1>
        <div className="game-info">
          Pontos: {score}/{totalChallenges}
        </div>
      </div>

      <div className="game-content">
        <EmotionChallenge mode={mode} />
      </div>
    </div>
  );
};
