import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { RoleSelectionPage } from './pages/RoleSelectionPage';
import { ChildTrailPage } from './pages/ChildTrailPage';
import { GamePage } from './pages/GamePage';
import { PsychologistPage } from './pages/PsychologistPage';
import './App.css';

function AppContent() {
  const { userRole, gameMode } = useApp();

  return (
    <Routes>
      {/* Página de seleção de role (login) */}
      <Route path="/login" element={<RoleSelectionPage />} />

      {/* Rotas da criança */}
      <Route path="/child-trail" element={
        userRole === 'child' ? <ChildTrailPage /> : <Navigate to="/login" />
      } />
      
      {/* Rota do jogo - apenas valida se é criança, o GamePage cuida do resto */}
      <Route path="/game/:mode" element={
        userRole === 'child' ? <GamePage mode={gameMode} /> : <Navigate to="/login" />
      } />

      {/* Rotas do psicólogo */}
      <Route path="/psychologist" element={
        userRole === 'psychologist' ? <PsychologistPage /> : <Navigate to="/login" />
      } />

      {/* Rota padrão - redireciona baseado no role */}
      <Route path="/" element={
        userRole === 'child' ? <Navigate to="/child-trail" /> :
        userRole === 'psychologist' ? <Navigate to="/psychologist" /> :
        <Navigate to="/login" />
      } />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <div className="App">
          <AppContent />
        </div>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
