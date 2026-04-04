# EMO-Play - Instruções de Contexto do Projeto

## 📋 Visão Geral do Projeto

EMO-Play é um sistema gamificado de reconhecimento de emoções desenvolvido para crianças com Transtorno do Espectro Autista (TEA). O projeto é dividido em duas partes principais: um Frontend React, um Backend dotnet principal e um módulo de inteligência artificial para detecção de emoções.

### Objetivo Principal
Criar uma ferramenta interativa que ajude crianças com TEA a desenvolver habilidades de reconhecimento e expressão de emoções através de desafios gamificados.

---

## 🏗️ Arquitetura do Projeto

```
├── emo-play-frontend/          # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── WebcamCapture.jsx
│   │   │   ├── EmotionChallenge.jsx
│   │   │   └── PsychologistDashboard.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── GamePage.jsx
│   │   │   └── DashboardPage.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── context/
│   │   │   └── GameContext.jsx
│   │   ├── styles/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── App.css
│   ├── .env
│   ├── vite.config.js
│   └── package.json
│
└── .github/
    └── copilot-instructions.md         # Este arquivo
```

---

## 👥 Responsabilidades por Camada

### Frontend (React + Vite)

#### Responsabilidades Principais:
1. **Interface do Quiz Gamificado para Criança**
   - Apresentação visual atraente e amigável
   - Dois modos de jogo: "Identificar Emoção" e "Fazer Emoção"
   - Sistema de pontuação em tempo real

2. **Apresentação dos Desafios de Reconhecimento Facial**
   - Exibição da emoção-alvo
   - Feedback visual imediato (correto/incorreto)
   - Animações suaves e engajantes

3. **Captura de Imagem da Webcam**
   - Acesso à câmera do dispositivo
   - Envio da imagem para análise no Backend
   - Feedback visual durante captura

4. **Dashboard do Psicólogo**
   - Exibição de 3 métricas técnicas:
     - Taxa de Acerto: % de acertos vs. tentativas
     - Tempo de Resposta: Tempo médio por resposta (ms)
     - Índice de Confiança: Valor médio de confiança do modelo (%)
   - Aviso de isenção de responsabilidade clínica
   - Histórico de sessões

#### Componentes Principais:

- **HomePage**: Tela inicial com seleção de modo de jogo
- **GamePage**: Página durante o jogo com feedback
- **DashboardPage**: Dashboard do psicólogo com métricas
- **WebcamCapture**: Componente de captura de câmera
- **EmotionChallenge**: Lógica do desafio de emoções
- **PsychologistDashboard**: Exibição de métricas técnicas

#### Context Global (GameContext):
- Gerenciamento de sessão
- Rastreamento de pontuação
- Armazenamento de dados de resposta
- Estado global do jogo

---

## 🎮 Modos de Jogo

### 1. Modo "Identificar Emoção"
- Exibe a emoção-alvo para a criança
- A criança identifica qual emoção está vendo
- Captura imagem para verificação

### 2. Modo "Fazer Emoção"
- Mostra a emoção-alvo que a criança deve fazer
- Criança expressa a emoção
- Sistema verifica se a expressão corresponde

---

## 📊 Métricas do Dashboard

### 1. Taxa de Acerto
- **Definição**: Percentual de vezes que a emoção identificada pelo sistema corresponde à emoção-alvo
- **Cálculo**: (Respostas Corretas / Total de Respostas) × 100
- **Propósito**: Avaliar o desempenho técnico do protótipo

### 2. Tempo de Resposta
- **Definição**: Tempo decorrido entre a apresentação do estímulo e a captura da imagem
- **Cálculo**: Média de todos os tempos de resposta em milissegundos
- **Propósito**: Avaliar a velocidade de resposta do sistema

### 3. Índice de Confiança do Modelo
- **Definição**: Valor percentual retornado pelo DeepFace indicando o grau de certeza
- **Cálculo**: Média de todos os valores de confiança retornados
- **Propósito**: Avaliar a confiabilidade da detecção

### ⚠️ Isenção de Responsabilidade
Essas métricas são **estritamente técnicas** e servem para avaliar o desempenho do protótipo. **NÃO possuem finalidade de diagnóstico ou avaliação clínica.**

---

## �️ Sistema de Rotas (React Router v6)

### Configuração de Rotas

O aplicativo utiliza **React Router v6** com `BrowserRouter` para gerenciar navegação baseada em URLs. As rotas são definidas em `src/App.jsx` com proteção de acesso baseada no papel do usuário (`userRole`).

### Rotas Disponíveis

| Rota | Componente | Acesso | Descrição |
|------|-----------|--------|-----------|
| `/login` | RoleSelectionPage | Público | Tela de login e seleção de papel (Criança/Psicólogo) |
| `/child-trail` | ChildTrailPage | userRole === 'child' | Trilha gamificada com 3 fases para crianças |
| `/game/:mode` | GamePage | userRole === 'child' + gameMode ativo | Página de jogo com modo: `identify` ou `express` |
| `/psychologist` | PsychologistPage | userRole === 'psychologist' | Dashboard do psicólogo com métricas e análise |
| `/` | Redirecionamento | Todos | Redireciona baseado em userRole |
| `*` | Catch-all | Todos | Redireciona para `/` |

### Fluxo de Navegação

#### Criança
1. `/login` (RoleSelectionPage) → seleciona "Criança"
2. `/child-trail` (ChildTrailPage) → vê 3 fases gamificadas
3. Clica em **Fase 1 (Identificar)** → `/game/identify`
4. Clica em **Fase 2 (Fazer Emoção)** → `/game/express`
5. Clica em **Sair** → `/login` (logout)

#### Psicólogo
1. `/login` (RoleSelectionPage) → seleciona "Psicólogo"
2. `/psychologist` (PsychologistPage) → dashboard com métricas
3. Clica em **Logout** → `/login`

### Guarda de Rotas (Route Guards)

As rotas são protegidas verificando `userRole` do `AppContext`:

```javascript
// Exemplo de rota protegida
<Route 
  path="/child-trail" 
  element={
    userRole === 'child' ? <ChildTrailPage /> : <Navigate to="/login" />
  } 
/>
```

### Gerenciamento de Estado de Jogo

O componente `GamePage` monitora o estado `gameMode` via `useEffect`:

```javascript
useEffect(() => {
  if (!gameMode) {
    navigate('/child-trail', { replace: true });
  }
}, [gameMode, navigate]);
```

Quando o usuário clica "Voltar", `exitGame()` é chamado, setando `gameMode` para null, que dispara o redirect para `/child-trail` sem logout.

### Navegação Programática

Todos os componentes de página usam o hook `useNavigate` para navegação:

```javascript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/child-trail'); // Navegação simples
navigate('/login', { replace: true }); // Substitui histórico
```

---

## 🛠️ Stack Tecnológico

### Frontend
- **React 18+** - Biblioteca UI
- **React Router v6** - Roteamento e navegação
- **Vite** - Bundler rápido
- **CSS3** - Estilização
- **JavaScript ES6+** - Linguagem

---


## 📝 Estrutura de Dados

### Sessão de Jogo
```javascript
{
  sessionId: "session_1234567890",
  userId: "user_id",
  gameMode: "identify", // ou "express"
  startTime: "2024-01-01T10:00:00Z",
  results: [
    {
      challengeId: 1,
      targetEmotion: "Happy",
      detectedEmotion: "Happy",
      isCorrect: true,
      responseTime: 2500, // ms
      modelConfidence: 85.5, // %
      timestamp: "2024-01-01T10:00:02Z"
    }
  ]
}
```

---

## 🔌 Integração Frontend-Backend

### Fluxo de Comunicação

1. **Captura de Imagem**
   - Frontend: Captura via WebcamCapture
   - Envia para Backend via FormData

2. **Análise de Emoção**
   - Backend: Processa com DeepFace
   - Retorna: `{ emotion: "Happy", confidence: 85.5 }`

3. **Verificação de Resultado**
   - Frontend: Compara com emoção-alvo
   - Atualiza pontuação no GameContext

4. **Cálculo de Métricas**
   - Backend: Agrega dados de sessão
   - Retorna métricas ao Dashboard

---

## 🎨 Design e UX

### Paleta de Cores
- **Primária**: #667eea (Roxo)
- **Secundária**: #764ba2 (Roxo Escuro)
- **Acentuação**: #f5576c (Coral)
- **Sucesso**: #4caf50 (Verde)
- **Erro**: #f44336 (Vermelho)

### Princípios de Design
- Interface amigável para crianças
- Interface limpa e intuitiva para psicólogos
- Feedback visual imediato
- Animações suaves
- Design responsivo (mobile-first)

---

## 👨‍💻 Contribuindo

Ao fazer mudanças no projeto, mantenha:
1. A estrutura de componentes React
2. A conformidade com as métricas do dashboard
3. A acessibilidade para crianças

