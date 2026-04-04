import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { WebcamCapture } from './WebcamCapture';
import '../styles/EmotionChallenge.css';

// Mapeamento de emoções para arquivos de imagem
const EMOTION_MAP = {
  'Happiness': 'Happiness',
  'Sadness': 'Sadness',
  'Anger': 'Anger',
  'Surprise': 'Surprise',
  'Disgust': 'Disgust',
  'Fear': 'Fear',
};

const EMOTION_BUTTONS = [
  { key: 'Happiness', label: 'Feliz' },
  { key: 'Sadness', label: 'Triste' },
  { key: 'Anger', label: 'Raiva' },
  { key: 'Surprise', label: 'Surpresa' },
  { key: 'Disgust', label: 'Nojo' },
  { key: 'Fear', label: 'Medo' },
];

const LEVELS = {
  easy: { id: 'easy', name: 'Fácil', description: 'Personagens Caricatos', icon: '🎨' },
  medium: { id: 'medium', name: 'Médio', description: 'Personagens 3D', icon: '🎭' },
  hard: { id: 'hard', name: 'Difícil', description: 'Pessoas Reais', icon: '👤' },
};

// Função para gerar mensagem baseada em porcentagem
const getFeedbackMessage = (percentage) => {
  if (percentage === 100) return '🌟 Perfeito! Você acertou todas as emoções!';
  if (percentage >= 80) return '🎉 Excelente! Você está indo muito bem!';
  if (percentage >= 60) return '👏 Muito bom! Você está aprendendo bem!';
  if (percentage >= 40) return '💪 Bom esforço! Continue praticando!';
  return '🌱 Continue tentando! Você vai melhorar!';
};

export const EmotionChallenge = ({ mode = 'identify' }) => {
  const { score, totalChallenges, recordResponse } = useApp();
  
  const [gameState, setGameState] = useState(mode === 'express' ? 'challenge' : 'levelSelect'); // levelSelect | challenge | phase-complete
  const [currentLevel, setCurrentLevel] = useState(mode === 'express' ? 'medium' : null);
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [currentImagePath, setCurrentImagePath] = useState(null);
  const [usedEmotions, setUsedEmotions] = useState(new Set());
  const [challengeCount, setChallengeCount] = useState(0);
  const [selectedButton, setSelectedButton] = useState(null); // Botão selecionado para feedback visual
  const [isEvaluating, setIsEvaluating] = useState(false); // Flag para desabilitar cliques durante feedback
  const [phaseResults, setPhaseResults] = useState([]); // Array com resultados de cada pergunta
  const [isCapturing, setIsCapturing] = useState(false);

  // Effect para iniciar desafio direto no modo express
  useEffect(() => {
    if (mode === 'express' && currentLevel === 'medium' && challengeCount === 0) {
      startNewChallenge('medium', new Set());
    }
  }, []);

  // Função para carregar a imagem da emoção
  const loadEmotionImage = (level, emotion) => {
    const emotionFile = EMOTION_MAP[emotion];
    const fileNum = level === 'easy' ? '1' : level === 'medium' ? '2' : level === 'hard' ? '3' : '0';
    const imagePath = `/emotions/${level}/${emotionFile}_${fileNum}.png`;
    setCurrentImagePath(imagePath);
  };

  // Seleciona nível
  const selectLevel = (levelId) => {
    setCurrentLevel(levelId);
    setUsedEmotions(new Set());
    setChallengeCount(0);
    setPhaseResults([]); // Resetar resultados da fase
    startNewChallenge(levelId, new Set());
  };

  // Inicia novo desafio
  const startNewChallenge = (level, used) => {
    const availableEmotions = EMOTION_BUTTONS.filter(e => !used.has(e.key));
    
    if (availableEmotions.length === 0) {
      // Fase completa - mostrar feedback final
      setGameState('phase-complete');
      return;
    }

    const randomEmotion = availableEmotions[Math.floor(Math.random() * availableEmotions.length)];
    setCurrentEmotion(randomEmotion.key);
    
    // Para modo identify, carrega a imagem. Para express, não precisa
    if (mode === 'identify') {
      loadEmotionImage(level, randomEmotion.key);
    }
    
    const newUsed = new Set(used);
    newUsed.add(randomEmotion.key);
    setUsedEmotions(newUsed);
    setChallengeCount(prev => prev + 1);
    
    setGameState('challenge');
    setSelectedButton(null);
    setIsEvaluating(false);
  };

  // Responde ao clique de emoção (modo identify)
  const handleEmotionClick = (selectedEmotion) => {
    if (isEvaluating) return; // Evitar múltiplos cliques durante avaliação
    
    setIsEvaluating(true);
    setSelectedButton(selectedEmotion);
    
    const isCorrect = selectedEmotion === currentEmotion;
    
    // Adicionar resultado à fase
    setPhaseResults(prev => [...prev, {
      target: currentEmotion,
      selected: selectedEmotion,
      isCorrect,
    }]);

    // Delay de 1 segundo antes de ir para próximo
    setTimeout(() => {
      if (usedEmotions.size < EMOTION_BUTTONS.length) {
        startNewChallenge(currentLevel, usedEmotions);
      } else {
        // Todas as 6 emoções foram mostradas
        setGameState('phase-complete');
      }
    }, 1000);
  };

  // Callback de captura (modo express)
  const handleCapture = async (blob) => {
    setIsCapturing(true);
    
    try {
      // Simular análise - em produção isso iria para o backend
      // Por agora, simulamos como se acertou (você pode expandir isso depois)
      const isCorrect = true; // Isso deveria vir do backend
      
      // Adicionar resultado à fase
      setPhaseResults(prev => [...prev, {
        target: currentEmotion,
        selected: currentEmotion, // Simulado
        isCorrect,
      }]);

      // Delay antes de próximo desafio
      setTimeout(() => {
        setIsCapturing(false);
        if (usedEmotions.size < EMOTION_BUTTONS.length) {
          startNewChallenge(currentLevel, usedEmotions);
        } else {
          setGameState('phase-complete');
        }
      }, 1000);
    } catch (error) {
      console.error('Erro ao processar captura:', error);
      setIsCapturing(false);
    }
  };

  // ===== RENDERIZAÇÃO: Seletor de nível =====
  if (gameState === 'levelSelect') {
    return (
      <div className="emotion-challenge">
        <h1>🎮 {mode === 'identify' ? '👀 Quiz de Emoções' : '🎭 Estúdio de Expressão'}</h1>
        <p className="score">Pontuação Total: {score}/{totalChallenges}</p>
        
        <div className="level-selector">
          <p className="level-title">Escolha o Nível de Dificuldade:</p>
          <div className="levels-grid">
            {Object.values(LEVELS).map((level) => (
              <button
                key={level.id}
                className="level-btn"
                onClick={() => selectLevel(level.id)}
              >
                <span className="level-icon">{level.icon}</span>
                <span className="level-name">{level.name}</span>
                <span className="level-desc">{level.description}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ===== RENDERIZAÇÃO: Modo Identify (Ver e Escolher) =====
  if (gameState === 'challenge' && mode === 'identify') {
    return (
      <div className="emotion-challenge">
        <div className="challenge-header">
          <h1>👀 Qual emoção você vê?</h1>
          <span className="level-badge">{LEVELS[currentLevel].name} - Desafio {challengeCount}/6</span>
        </div>

        <div className="emotion-image-container">
          <img 
            src={currentImagePath} 
            alt="Emotion" 
            className="emotion-image"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
          />
          <div className="image-placeholder" style={{ display: 'none' }}>
            <p>Imagem não disponível</p>
          </div>
        </div>

        <div className="emotion-buttons-grid">
          {EMOTION_BUTTONS.map((emotion) => {
            const isSelected = selectedButton === emotion.key;
            let buttonClass = 'emotion-btn';
            
            if (isSelected && isEvaluating) {
              const isCorrect = emotion.key === currentEmotion;
              buttonClass += isCorrect ? ' feedback-correct' : ' feedback-incorrect';
            }
            
            return (
              <button
                key={emotion.key}
                className={buttonClass}
                onClick={() => handleEmotionClick(emotion.key)}
                disabled={isEvaluating}
              >
                <span className="emotion-label">{emotion.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ===== RENDERIZAÇÃO: Modo Express (Câmera) =====
  if (gameState === 'challenge' && mode === 'express') {
    const emotionLabel = EMOTION_BUTTONS.find(e => e.key === currentEmotion)?.label || currentEmotion;
    
    return (
      <div className="emotion-challenge express-mode">
        <div className="challenge-header">
          <h1>🎭 Faça a expressão abaixo!</h1>
          <span className="level-badge">{LEVELS[currentLevel].name} - Desafio {challengeCount}/6</span>
        </div>

        <div className="emotion-target">
          <span className="emotion-target-label">Mostre a emoção:</span>
          <span className="emotion-target-name">{emotionLabel}</span>
        </div>

        <WebcamCapture 
          onCapture={handleCapture} 
          isCapturing={isCapturing}
        />

        <p className="capture-hint">Posicione seu rosto bem e capture quando estiver pronto!</p>
      </div>
    );
  }

  // ===== RENDERIZAÇÃO: Feedback final da fase =====
  if (gameState === 'phase-complete') {
    const totalChallenges = phaseResults.length;
    const correctAnswers = phaseResults.filter(r => r.isCorrect).length;
    const percentage = Math.round((correctAnswers / totalChallenges) * 100);
    const feedbackMessage = getFeedbackMessage(percentage);

    return (
      <div className="emotion-challenge">
        <div className="phase-complete-container">
          <h1>🎉 Fase Concluída!</h1>
          
          <div className="phase-feedback">
            <div className="score-box">
              <span className="score-label">Acertos:</span>
              <span className="score-value">{correctAnswers}/{totalChallenges}</span>
            </div>
            
            <div className="percentage-box">
              <span className="percentage-label">Desempenho:</span>
              <span className="percentage-value">{percentage}%</span>
            </div>
            
            <p className="feedback-message">{feedbackMessage}</p>
            
            <div className="correct-answers">
              <h3>Emoções que você acertou:</h3>
              <div className="correct-list">
                {phaseResults.map((result, idx) => (
                  <div 
                    key={idx} 
                    className={`result-item ${result.isCorrect ? 'correct' : 'incorrect'}`}
                  >
                    <span className="result-icon">{result.isCorrect ? '✓' : '✗'}</span>
                    <span className="result-text">{result.target}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setGameState('levelSelect')} 
            className="back-btn"
          >
            Voltar para Níveis
          </button>
        </div>
      </div>
    );
  }

  return null;
};
