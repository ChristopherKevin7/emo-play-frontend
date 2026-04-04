import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import '../styles/WebcamCapture.css';

export const WebcamCapture = forwardRef(({ onCapture, isCapturing = false }, ref) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  // Função para parar a câmera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraReady(false);
  };

  // Expõe método para fechar a câmera
  useImperativeHandle(ref, () => ({
    stopCamera,
  }), []);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
        });

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraReady(true);
        }
      } catch (error) {
        console.error('Erro ao acessar câmera:', error);
      }
    };

    startCamera();

    // Cleanup: fechar câmera ao desmontar
    return () => {
      stopCamera();
    };
  }, []);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      canvasRef.current.toBlob((blob) => {
        if (onCapture) {
          onCapture(blob);
        }
      }, 'image/jpeg');
    }
  };

  return (
    <div className="webcam-capture">
      <div className="camera-container">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className={`video-stream ${isCapturing ? 'capturing' : ''}`}
        />
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          style={{ display: 'none' }}
        />
        {!isCameraReady && <div className="loading">Ativando câmera...</div>}
      </div>
      <button
        onClick={captureImage}
        disabled={!isCameraReady || isCapturing}
        className="capture-btn"
      >
        {isCapturing ? 'Capturando...' : 'Capturar Foto'}
      </button>
    </div>
  );
});

WebcamCapture.displayName = 'WebcamCapture';
