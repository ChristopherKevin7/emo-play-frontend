import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import '../styles/RoleSelectionPage.css';

export const RoleSelectionPage = () => {
  const navigate = useNavigate();
  const { login, authLoading, authError } = useApp();
  const [activeTab, setActiveTab] = useState('child');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLocalError('');

    // Validação básica
    if (!email || !password) {
      setLocalError('Por favor, preencha email e senha');
      return;
    }

    if (!email.includes('@')) {
      setLocalError('Por favor, insira um email válido');
      return;
    }

    try {
      await login(email, password, activeTab);
      
      // Navegar para a página apropriada após login bem-sucedido
      if (activeTab === 'child') {
        navigate('/child-trail');
      } else if (activeTab === 'psychologist') {
        navigate('/psychologist');
      }
    } catch (error) {
      // Erro já foi setado no context
      console.error('Erro ao fazer login:', error);
      // O authError será exibido no UI
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setLocalError('');
  };

  // Usar erro do context ou do estado local
  const displayError = localError || authError;

  return (
    <div className="role-selection-page">
      <div className="role-selection-wrapper">
        {/* Lado Esquerdo - Informações do Projeto */}
        <div className="left-section">
          <div className="left-content">
            <h1 className="project-title">EMO-PLAY</h1>
            <p className="impact-phrase">Vamos aprender emoções brincando!</p>
            <div className="decorative-element"></div>
          </div>
        </div>

        {/* Lado Direito - Formulário de Login */}
        <div className="right-section">
          <div className="login-container">
            {/* Abas */}
            <div className="tabs-container">
              <button
                className={`tab ${activeTab === 'child' ? 'active' : ''}`}
                onClick={() => handleTabChange('child')}
                disabled={authLoading}
              >
                👧 Criança
              </button>
              <button
                className={`tab ${activeTab === 'psychologist' ? 'active' : ''}`}
                onClick={() => handleTabChange('psychologist')}
                disabled={authLoading}
              >
                👨‍⚕️ Psicólogo
              </button>
            </div>

            {/* Mensagem de Erro */}
            {displayError && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                <p>{displayError}</p>
              </div>
            )}

            {/* Formulário */}
            <form className="login-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={authLoading}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Senha</label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={authLoading}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="login-btn"
                disabled={authLoading}
              >
                {authLoading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            <p className="login-footer">
              {activeTab === 'child'
                ? 'Vou participar dos desafios de emoções'
                : 'Vou acompanhar as métricas técnicas de desempenho'}
            </p>
          </div>
        </div>
      </div>

      <footer className="role-footer">
        <p>Desenvolvido para crianças com TEA</p>
      </footer>
    </div>
  );
};
