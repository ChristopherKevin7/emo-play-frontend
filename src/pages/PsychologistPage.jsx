import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChildMetricsReport } from '../components/ChildMetricsReport';
import { AddChildDialog } from '../components/AddChildDialog';
import { useApp } from '../context/AppContext';
import { userService, metricsService } from '../services';
import '../styles/PsychologistPage.css';

export const PsychologistPage = () => {
  const navigate = useNavigate();
  const { logout, userData } = useApp();
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [selectedChildData, setSelectedChildData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Buscar lista de crianças ao montar o componente
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        setLoading(true);
        setError(null);
        const childrenList = await userService.getChildren();
        setChildren(childrenList);
        
        // Selecionar primeira criança automaticamente
        if (childrenList.length > 0) {
          await handleChildSelect(childrenList[0]);
        }
      } catch (err) {
        console.error('Erro ao buscar crianças:', err);
        setError('Erro ao carregar lista de crianças');
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, []);

  // Ao selecionar uma criança, buscar dados de métricas
  const handleChildSelect = async (child) => {
    try {
      setSelectedChild(child);
      setLoading(true);
      
      // Buscar métricas da criança pelo endpoint /Metrics/child/{childId}
      const metricsData = await metricsService.getChildMetrics(child.id);
      setSelectedChildData(metricsData);
    } catch (err) {
      console.error('Erro ao buscar métricas da criança:', err);
      setError('Erro ao carregar métricas da criança');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleChildAdded = (newChild) => {
    // Adicionar nova criança à lista
    setChildren((prevChildren) => [...prevChildren, newChild]);
    
    // Selecionar a nova criança automaticamente
    handleChildSelect(newChild);
  };

  return (
    <div className="psychologist-page">
      {/* Header */}
      <header className="psychologist-header">
        <button onClick={handleLogout} className="exit-btn">
          ← Sair
        </button>
        <h1>Dashboard do Psicólogo</h1>
        <div className="psychologist-user-section">
          <img src="/icons/ui/psychologist.png" alt="Psicólogo" className="user-avatar" />
          <span className="user-name">{userData?.name || 'Psicólogo'}</span>
        </div>
      </header>

      <div className="psychologist-container">
        {/* Painel de Crianças */}
        <div className="children-panel">
          <div className="children-panel-header">
            <h2>Crianças Cadastradas</h2>
            <button 
              className="btn-add-child"
              onClick={() => setShowAddDialog(true)}
              title="Adicionar nova criança"
            >
              + Adicionar
            </button>
          </div>
          
          {loading && !selectedChild && (
            <div className="loading-message">Carregando crianças...</div>
          )}

          <div className="children-list">
            {children.map((child) => (
              <div
                key={child.id}
                className={`child-card ${selectedChild?.id === child.id ? 'active' : ''}`}
                onClick={() => handleChildSelect(child)}
              >
                <img src="/icons/ui/children.png" alt="Criança" className="child-avatar" />
                <div className="child-info">
                  <div className="child-name">{child.name}</div>
                  <div className="child-email">{child.email}</div>
                </div>
                <button className="view-report-btn">Visualizar Relatório</button>
              </div>
            ))}

            {!loading && children.length === 0 && (
              <div className="empty-message">Nenhuma criança cadastrada</div>
            )}
          </div>
        </div>

        {/* Painel de Relatório */}
        <div className="report-panel">
          {selectedChild ? (
            <>
              <div className="report-header">
                <h2>Relatório de {selectedChild.name}</h2>
                <div className="report-info">
                  <span>ID: {selectedChild.id.substring(0, 8)}...</span>
                  <span>Criado em: {new Date(selectedChild.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>

              {loading && <div className="loading-message">Carregando relatório...</div>}

              {error && !loading && <div className="error-message">⚠️ {error}</div>}

              {selectedChildData && !loading && (
                <ChildMetricsReport metricsData={selectedChildData} childName={selectedChild.name} />
              )}

              {!loading && !selectedChildData && !error && (
                <div className="empty-report">Selecione uma criança para visualizar o relatório</div>
              )}
            </>
          ) : (
            <div className="empty-report">Selecione uma criança para visualizar o relatório</div>
          )}
        </div>
      </div>

      {/* Dialog para adicionar criança */}
      <AddChildDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onChildAdded={handleChildAdded}
      />
    </div>
  );
};
