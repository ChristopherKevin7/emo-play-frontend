import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ColorblindToggle } from '../components/ColorblindToggle';
import '../styles/ChildTrailPage.css';

export const ChildTrailPage = () => {
  const navigate = useNavigate();
  const { setGameMode, startNewSession, logout, userData, points, fetchPoints } = useApp();

  // Buscar pontuação total ao entrar na tela
  useEffect(() => {
    if (userData?.id) fetchPoints(userData.id);
  }, [userData?.id]);

  const handleStartIdentify = () => {
    startNewSession();
    setGameMode('identify');
    navigate('/game/identify');
  };

  const handleStartExpress = () => {
    startNewSession();
    setGameMode('express');
    navigate('/game/express');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const phases = [
    {
      id: 1,
      icon: '/icons/challenges/reaction.png',
      title: 'Identificar Emoção',
      description: 'Veja e escolha',
      mode: 'identify',
      color: 'identify',
      locked: false,
    },
    {
      id: 2,
      icon: '/icons/challenges/expression.png',
      title: 'Fazer Emoção',
      description: 'Expresse a emoção',
      mode: 'express',
      color: 'express',
      locked: false,
    },
    {
      id: 3,
      icon: '🧪',
      title: 'Próxima Fase',
      description: 'Em desenvolvimento',
      mode: null,
      color: 'future',
      locked: true,
    },
  ];

  const handlePhaseClick = (phase) => {
    if (!phase.locked) {
      if (phase.mode === 'identify') {
        handleStartIdentify();
      } else if (phase.mode === 'express') {
        handleStartExpress();
      }
    }
  };

  return (
    <div className="child-trail-page">
      {/* Header */}
      <header className="trail-header">
        <button onClick={handleLogout} className="exit-btn">
          ← Sair
        </button>
        <div className="header-stats">
          <ColorblindToggle />
          <div className="score-section">
            <span className="star">⭐</span>
            <span className="score-value">{points} pontos</span>
          </div>
          <div className="user-section">
            <img src="/icons/ui/children.png" alt="Criança" className="user-avatar" />
            <span className="user-name">{userData?.name || 'Usuário'}</span>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <div className="trail-content">
        {/* Título */}
        <div className="trail-title-section">
          <h1 className="trail-title"><img src="/icons/challenges/mountain.png" alt="" className="trail-title-icon" /> Trilha de Desafios</h1>
          <p className="trail-subtitle">Escolha uma fase para começar</p>
        </div>

        {/* Trilha Vertical */}
        <div className="trail-track">
          {phases.map((phase, index) => (
            <div key={phase.id} className="phase-wrapper">
              {/* Card da Fase */}
              <div
                className={`phase-card phase-${phase.color} ${phase.locked ? 'locked' : 'clickable'}`}
                onClick={() => handlePhaseClick(phase)}
                role={phase.locked ? 'button' : 'link'}
                tabIndex={phase.locked ? -1 : 0}
              >
                <div className="phase-icon">
                  {phase.icon.startsWith('/') 
                    ? <img src={phase.icon} alt={phase.title} className="phase-icon-img" />
                    : phase.icon
                  }
                </div>
                <div className="phase-content">
                  <h2 className="phase-title">{phase.title}</h2>
                  <p className="phase-description">{phase.description}</p>
                </div>
                {phase.locked && <div className="lock-badge">🔒</div>}
                {!phase.locked && (
                  <button className="start-btn">Começar</button>
                )}
                {phase.locked && (
                  <p className="coming-soon">Em Breve</p>
                )}
              </div>

              {/* Linha conectora (não aparece na última fase) */}
              {index < phases.length - 1 && (
                <div className="connector-line"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Rodapé Opcional */}
      <footer className="trail-footer">
        <p>Divirta-se! Não há pressa 🎉</p>
      </footer>
    </div>
  );
};
