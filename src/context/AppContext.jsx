import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authService, userService } from '../services';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Auth state
  const [userRole, setUserRole] = useState(null); // 'child' | 'psychologist' | null
  const [userData, setUserData] = useState(null); // { id, email, name, role }
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Game state
  const [sessionId, setSessionId] = useState(null);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [score, setScore] = useState(0);
  const [totalChallenges, setTotalChallenges] = useState(0);
  const [gameMode, setGameMode] = useState(null); // 'identify' ou 'express'
  const [responseTime, setResponseTime] = useState(null);
  const [detectedEmotion, setDetectedEmotion] = useState(null);
  const [sessionResults, setSessionResults] = useState([]);

  // Accessibility
  const [colorblindMode, setColorblindMode] = useState(() => localStorage.getItem('colorblindMode') === 'true');

  // Points
  const [points, setPoints] = useState(0);

  useEffect(() => {
    if (colorblindMode) {
      document.documentElement.setAttribute('data-colorblind', 'true');
    } else {
      document.documentElement.removeAttribute('data-colorblind');
    }
    localStorage.setItem('colorblindMode', colorblindMode);
  }, [colorblindMode]);

  const toggleColorblindMode = useCallback(() => setColorblindMode(prev => !prev), []);

  const fetchPoints = useCallback(async (userId) => {
    try {
      const data = await userService.getUserPoints(userId);
      // Backend pode retornar { points: N } ou apenas N
      const value = typeof data === 'number' ? data : (data?.points ?? data?.totalPoints ?? 0);
      setPoints(value);
      return value;
    } catch {
      // Falha silenciosa — não bloqueia a UI
    }
  }, []);

  const addPoints = useCallback((amount) => {
    if (amount > 0) setPoints(prev => prev + amount);
  }, []);

  // Login function - integrado com o backend
  const login = useCallback(async (email, password, role) => {
    setAuthLoading(true);
    setAuthError(null);
    
    // Limpar token e dados antigos ANTES de fazer novo login
    // Isso previne que o token de outra conta seja usado
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    setToken(null);
    setUserData(null);
    setUserRole(null);
    
    try {
      const response = await authService.login(email, password, role);
      
      // Guardar token e userId
      setToken(response.token);
      setUserRole(role);

      // Buscar dados completos do usuário na API
      try {
        const fullUserData = await userService.getUserById(response.userId);
        
        setUserData({
          id: response.userId,
          email: fullUserData.email,
          name: fullUserData.name,
          role: fullUserData.role,
          isActive: fullUserData.isActive,
          createdAt: fullUserData.createdAt,
          updatedAt: fullUserData.updatedAt,
        });
      } catch (userDataError) {
        console.warn('Erro ao buscar dados completos do usuário:', userDataError);
        // Usar dados do login se não conseguir buscar dados completos
        setUserData({
          id: response.userId,
          email: response.email,
          name: response.name || 'Usuário',
          role: role,
        });
      }
      
      setAuthLoading(false);
      return response;
    } catch (error) {
      const errorMessage = error.message || 'Erro ao fazer login. Verifique suas credenciais.';
      setAuthError(errorMessage);
      setAuthLoading(false);
      throw error;
    }
  }, []);

  const selectRole = useCallback((role) => {
    setUserRole(role);
  }, []);

  // Função para atualizar dados do usuário
  const updateUserData = useCallback(async (userId) => {
    try {
      const fullUserData = await userService.getUserById(userId);
      
      setUserData({
        id: fullUserData.id,
        email: fullUserData.email,
        name: fullUserData.name,
        role: fullUserData.role,
        isActive: fullUserData.isActive,
        createdAt: fullUserData.createdAt,
        updatedAt: fullUserData.updatedAt,
      });
      
      return fullUserData;
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
      throw error;
    }
  }, []);

  const startNewSession = useCallback(() => {
    const newSessionId = `session_${Date.now()}`;
    setSessionId(newSessionId);
    setScore(0);
    setTotalChallenges(0);
    setGameMode(null);
    setSessionResults([]);
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

      const isCorrect = detectedEmo.toLowerCase() === currentChallenge.targetEmotion.toLowerCase();
      
      if (isCorrect) {
        setScore((prevScore) => prevScore + 1);
      }
      
      setTotalChallenges((prev) => prev + 1);
      
      // Adicionar ao histórico
      setSessionResults((prev) => [...prev, {
        targetEmotion: currentChallenge.targetEmotion,
        detectedEmotion: detectedEmo,
        isCorrect,
        responseTime: responseTimeMs,
        timestamp: new Date().toISOString(),
      }]);
    }
  }, [currentChallenge]);

  const exitGame = useCallback(() => {
    setCurrentChallenge(null);
    setGameMode(null);
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUserRole(null);
    setUserData(null);
    setToken(null);
    setSessionId(null);
    setCurrentChallenge(null);
    setScore(0);
    setTotalChallenges(0);
    setGameMode(null);
    setResponseTime(null);
    setDetectedEmotion(null);
    setSessionResults([]);
    setAuthError(null);
    setPoints(0);
  }, []);

  const value = {
    // Auth
    token,
    userData,
    userRole,
    authLoading,
    authError,
    login,
    selectRole,
    updateUserData,
    logout,

    // Session management
    sessionId,
    startNewSession,

    // Game state
    currentChallenge,
    loadChallenge,
    score,
    totalChallenges,
    gameMode,
    setGameMode,
    recordResponse,
    exitGame,

    // Current response data
    responseTime,
    detectedEmotion,

    // Session history
    sessionResults,

    // Accessibility
    colorblindMode,
    toggleColorblindMode,

    // Points
    points,
    fetchPoints,
    addPoints,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};


export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
