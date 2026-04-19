import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { emotionService } from '../services';
import '../styles/ExpressionGame.css';

const EMOTIONS = [
  {
    name: 'happy',
    ptBR: 'Feliz',
    emoji: '😄',
    hint: 'Mostre os dentes e sorria bem!',
  },
  {
    name: 'sad',
    ptBR: 'Triste',
    emoji: '😢',
    hint: 'Faça uma cara de choro, com boca caída',
  },
  {
    name: 'angry',
    ptBR: 'Raiva',
    emoji: '😠',
    hint: 'Franza a testa e aperte os olhos',
  },
  {
    name: 'surprise',
    ptBR: 'Surpresa',
    emoji: '😮',
    hint: 'Abra bem os olhos e a boca',
  },
  {
    name: 'fear',
    ptBR: 'Medo',
    emoji: '😨',
    hint: 'Abra os olhos e tensione o rosto',
  },
  {
    name: 'disgust',
    ptBR: 'Nojo',
    emoji: '🤢',
    hint: 'Faça cara de quem sentiu algo ruim',
  },
];

const FRAMES_PER_CAPTURE = 3;
const FRAME_INTERVAL_MS = 250;

export const ExpressionGame = ({ onComplete, level = 'easy' }) => {
  const { userData } = useApp();

  // Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Estados
  const [currentEmotionIndex, setCurrentEmotionIndex] = useState(0);
  const [capturedAttempts, setCapturedAttempts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureFrame, setCaptureFrame] = useState(0); // 0 = idle, 1-3 = frame sendo capturado
  const [gameComplete, setGameComplete] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [phaseStartTime, setPhaseStartTime] = useState(null);
  const [flashActive, setFlashActive] = useState(false);
  const challengeStartTimeRef = useRef(null); // Cronômetro por emoção individual

  // Inicializar webcam
  useEffect(() => {
    initializeCamera();
    setPhaseStartTime(Date.now());
    challengeStartTimeRef.current = Date.now();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { min: 640, ideal: 640 },
          height: { min: 480, ideal: 480 },
        },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      setError('Falha ao acessar a câmera. Verifique as permissões.');
      console.error('Erro ao acessar câmera:', err);
    }
  };

  // Capturar um único frame do vídeo
  const captureOneFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL('image/jpeg', 0.9).split(',')[1]; // retorna só base64 sem header
  }, []);

  // Captura múltipla: 3 frames com intervalo de 250ms
  const captureMultipleFrames = async () => {
    if (!videoRef.current || !canvasRef.current || isCapturing) return;

    setIsCapturing(true);
    const frames = [];

    try {
      for (let i = 0; i < FRAMES_PER_CAPTURE; i++) {
        setCaptureFrame(i + 1);
        setFlashActive(true);

        const frame = captureOneFrame();
        if (frame) frames.push(frame);

        // Flash visual
        setTimeout(() => setFlashActive(false), 100);

        // Esperar intervalo entre capturas (exceto na última)
        if (i < FRAMES_PER_CAPTURE - 1) {
          await new Promise((resolve) => setTimeout(resolve, FRAME_INTERVAL_MS));
        }
      }

      setCaptureFrame(0);

      // Armazenar attempt com múltiplas imagens
      const currentEmotion = EMOTIONS[currentEmotionIndex];
      const elapsed = challengeStartTimeRef.current ? Date.now() - challengeStartTimeRef.current : 0;
      const newAttempts = [
        ...capturedAttempts,
        {
          targetEmotion: currentEmotion.name,
          images: frames,
          responseTime: elapsed,
        },
      ];
      setCapturedAttempts(newAttempts);

      // Se capturou todas as 6 emoções, enviar para API
      if (newAttempts.length === EMOTIONS.length) {
        await submitExpressionResults(newAttempts);
      } else {
        setCurrentEmotionIndex((prev) => prev + 1);
        challengeStartTimeRef.current = Date.now(); // Reinicia cronômetro para próxima emoção
      }
    } catch (err) {
      setError('Erro ao capturar imagens. Tente novamente.');
      console.error('Erro na captura múltipla:', err);
    } finally {
      setIsCapturing(false);
      setCaptureFrame(0);
      setFlashActive(false);
    }
  };

  // Enviar resultados para API via emotionService
  const submitExpressionResults = async (attempts) => {
    setIsLoading(true);
    try {
      const payload = {
        userId: userData?.id,
        attempts: attempts.map((a) => ({
          targetEmotion: a.targetEmotion,
          images: a.images,
          responseTime: a.responseTime || 0,
        })),
      };

      const analysisResults = await emotionService.batchAnalyzeEmotions(payload);

      const processedResults = processAnalysisResults(analysisResults);
      setResults(processedResults);
      setGameComplete(true);
    } catch (err) {
      setError('Erro ao enviar resultados. Tente novamente.');
      console.error('Erro no envio:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Mapa de tradução de emoções do backend
  const EMOTION_LABEL = {
    happy: 'Feliz',
    sad: 'Triste',
    angry: 'Raiva',
    surprise: 'Surpresa',
    fear: 'Medo',
    disgust: 'Nojo',
    neutral: 'Neutro',
    contempt: 'Desprezo',
  };

  const translateEmotion = (name) => EMOTION_LABEL[name?.toLowerCase()] || name;

  // Processar resultados da análise (novo formato do backend)
  const processAnalysisResults = (analysisResults) => {
    const responseTime = Date.now() - phaseStartTime;

    return {
      totalAttempts: analysisResults.total,
      correctAttempts: analysisResults.correct,
      accuracy: (analysisResults.accuracy * 100).toFixed(2),
      responseTime,
      emotionResults: analysisResults.results,
      message: analysisResults.message,
      level,
    };
  };

  // Retornar para fase anterior
  const handleReturn = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    onComplete?.({ success: false });
  };

  // ==================== RENDERIZAÇÃO ====================

  // Tela de resultados
  if (gameComplete && results) {
    return (
      <div className="expression-game-container">
        <div className="game-results">
          <h2>🎉 Desafio Concluído!</h2>

          <div className="results-summary">
            <div className="result-stat">
              <span className="stat-label">Acertos</span>
              <span className="stat-value">
                {results.correctAttempts}/{results.totalAttempts}
              </span>
            </div>
            <div className="result-stat">
              <span className="stat-label">Acurácia</span>
              <span className="stat-value">{results.accuracy}%</span>
            </div>
            <div className="result-stat">
              <span className="stat-label">Tempo Total</span>
              <span className="stat-value">{(results.responseTime / 1000).toFixed(1)}s</span>
            </div>
          </div>

          <div className="emotions-breakdown">
            <h3>Detalhes por Emoção</h3>
            <div className="emotion-results-grid">
              {results.emotionResults.map((result, idx) => {
                const emotionData = EMOTIONS.find(e => e.name === result.targetEmotion) || EMOTIONS[idx];
                const topPrediction = result.topPredictions?.[0];
                return (
                  <div
                    key={idx}
                    className={`emotion-result ${result.isCorrect ? 'correct' : 'incorrect'}`}
                  >
                    <div className="result-emotion">
                      {emotionData.emoji} {emotionData.ptBR}
                    </div>
                    <div className="result-detected">
                      Detectado: {translateEmotion(topPrediction?.emotion)} ({(topPrediction?.score * 100).toFixed(1)}%)
                    </div>
                    {result.topPredictions?.length > 1 && (
                      <div className="result-predictions">
                        {result.topPredictions.slice(1).map((pred, i) => (
                          <span key={i} className="prediction-tag">
                            {translateEmotion(pred.emotion)}: {(pred.score * 100).toFixed(1)}%
                          </span>
                        ))}
                      </div>
                    )}
                    <div className={`result-status ${result.isCorrect ? 'status-correct' : 'status-incorrect'}`}>
                      {result.isCorrect ? '✓ Correto' : '✗ Incorreto'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button className="btn-continue" onClick={() => onComplete?.({ success: true, results })}>
            Continuar
          </button>
        </div>
      </div>
    );
  }

  // Tela de loading
  if (isLoading) {
    return (
      <div className="expression-game-container">
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Calculando resultado...</p>
        </div>
      </div>
    );
  }

  // Jogo em andamento
  const currentEmotion = EMOTIONS[currentEmotionIndex];
  const progressPercentage = (currentEmotionIndex / EMOTIONS.length) * 100;

  return (
    <div className="expression-game-container">
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Fechar</button>
        </div>
      )}

      <div className="expression-game-header">
        <h2><img src="/icons/challenges/expression.png" alt="" className="game-title-icon" /> Expressar Emoções</h2>
        <div className="progress">
          <span className="progress-text">{currentEmotionIndex + 1}/6</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
          </div>
        </div>
      </div>

      <div className="expression-game-content">
        <div className="video-section">
          <div className="video-container">
            <video ref={videoRef} autoPlay playsInline muted className="video-feed" />
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {/* Guia visual do rosto */}
            <div className="face-overlay"></div>

            {/* Flash de captura */}
            {flashActive && <div className="capture-flash"></div>}

            {/* Indicador de frame durante captura */}
            {isCapturing && (
              <div className="capture-indicator">
                📸 {captureFrame}/{FRAMES_PER_CAPTURE}
              </div>
            )}
          </div>
        </div>

        <div className="emotion-instruction">
          <h3>Faça uma cara de:</h3>
          <div className="emotion-display">
            <span className="emotion-emoji">{currentEmotion.emoji}</span>
            <span className="emotion-name">{currentEmotion.ptBR}</span>
          </div>
          <p className="emotion-hint">{currentEmotion.hint}</p>
        </div>

        <div className="capture-controls">
          <button
            className={`btn-capture ${isCapturing ? 'capturing' : ''}`}
            onClick={captureMultipleFrames}
            disabled={!cameraActive || isCapturing || isLoading}
          >
            {isCapturing ? `📸 Capturando... ${captureFrame}/${FRAMES_PER_CAPTURE}` : '📸 Capturar Expressão'}
          </button>
        </div>

        <div className="captured-emotions">
          <h4>Emoções Capturadas:</h4>
          <div className="captured-list">
            {EMOTIONS.map((emotion, idx) => (
              <div
                key={idx}
                className={`captured-item ${
                  idx < currentEmotionIndex ? 'done' : idx === currentEmotionIndex ? 'current' : 'pending'
                }`}
              >
                <span className="captured-emoji">{emotion.emoji}</span>
                {idx < currentEmotionIndex && <span className="check">✓</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <button className="btn-return" onClick={handleReturn}>
        ← Voltar
      </button>
    </div>
  );
};
