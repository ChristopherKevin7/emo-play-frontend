import React, { createContext, useContext, useState, useCallback } from 'react';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [sessionId, setSessionId] = useState(null);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [score, setScore] = useState(0);
  const [totalChallenges, setTotalChallenges] = useState(0);
  const [gameMode, setGameMode] = useState(null); // 'identify' ou 'express'
  const [responseTime, setResponseTime] = useState(null);
  const [detectedEmotion, setDetectedEmotion] = useState(null);

  const startNewSession = useCallback(() => {
    const newSessionId = `session_${Date.now()}`;
    setSessionId(newSessionId);
    setScore(0);
    setTotalChallenges(0);
    setGameMode(null);
    return newSessionId;
  }, []);

  const loadChallenge = useCallback((emotion) => {
    setCurrentChallenge({
      targetEmotion: emotion,
      startTime: Date.now(),
    });
    setResponseTime(null);
    setDetectedEmotion(null);
  }, []);

  const recordResponse = useCallback((detectedEmo) => {
    if (currentChallenge) {
      const responseTimeMs = Date.now() - currentChallenge.startTime;
      setResponseTime(responseTimeMs);
      setDetectedEmotion(detectedEmo);

      // Verifica se acertou
      if (detectedEmo.toLowerCase() === currentChallenge.targetEmotion.toLowerCase()) {
        setScore((prevScore) => prevScore + 1);
      }
      setTotalChallenges((prev) => prev + 1);
    }
  }, [currentChallenge]);

  const resetSession = useCallback(() => {
    setSessionId(null);
    setCurrentChallenge(null);
    setScore(0);
    setTotalChallenges(0);
    setGameMode(null);
    setResponseTime(null);
    setDetectedEmotion(null);
  }, []);

  const value = {
    sessionId,
    currentChallenge,
    score,
    totalChallenges,
    gameMode,
    responseTime,
    detectedEmotion,
    startNewSession,
    loadChallenge,
    recordResponse,
    resetSession,
    setGameMode,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
