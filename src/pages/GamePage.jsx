import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmotionChallenge } from '../components/EmotionChallenge';
import { ExpressionGame } from '../components/ExpressionGame';
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

  // Desafio 2 - Expressão: usa ExpressionGame com layout próprio
  if (mode === 'express') {
    return (
      <ExpressionGame
        level="easy"
        onComplete={(result) => {
          exitGame();
          navigate('/child-trail');
        }}
      />
    );
  }

  // Desafio 1 - Identificação: usa EmotionChallenge
  return (
    <div className="game-page">
      <div className="game-header">
        <button onClick={handleExit} className="exit-btn">
          ← Voltar
        </button>
        <h1>Modo: <img src="/icons/challenges/candidate.png" alt="Identificar" className="game-header-icon" /> Identificar</h1>
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
