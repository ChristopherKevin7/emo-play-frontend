import React from 'react';
import { useGame } from '../context/GameContext';
import '../styles/HomePage.css';

export const HomePage = ({ onSelectMode }) => {
  const { startNewSession } = useGame();

  const handleSelectMode = (mode) => {
    startNewSession();
    onSelectMode(mode);
  };

  return (
    <div className="home-page">
      <div className="welcome-container">
        <h1 className="title">🎮 EMO-PLAY</h1>
        <p className="subtitle">Desafio de Reconhecimento de Emoções</p>

        <div className="mode-container">
          <div className="mode-card identify-card">
            <h2>Identificar Emoção</h2>
            <p className="description">
              Você verá um rosto expressando uma emoção. Tente identificar qual emoção é!
            </p>
            <button
              onClick={() => handleSelectMode('identify')}
              className="mode-btn identify-btn"
            >
              Começar 👁️
            </button>
          </div>

          <div className="mode-card express-card">
            <h2>Fazer Emoção</h2>
            <p className="description">
              O desafio será apresentar uma emoção específica. Mostre sua criatividade! 🎭
            </p>
            <button
              onClick={() => handleSelectMode('express')}
              className="mode-btn express-btn"
            >
              Começar 🎭
            </button>
          </div>
        </div>
      </div>

      <footer className="home-footer">
        <p>Desenvolvido para crianças com TEA</p>
      </footer>
    </div>
  );
};
