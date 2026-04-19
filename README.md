# EMO-Play - Frontend

Frontend do sistema **EMO-Play**, uma aplicacao gamificada de reconhecimento e expressao de emocoes desenvolvida para criancas com Transtorno do Espectro Autista (TEA).

Desenvolvido como parte do Trabalho de Conclusao de Curso em Engenharia da Computacao.

---

## Tecnologias

- **React 18** com hooks
- **React Router v6** para navegacao
- **Vite** como bundler
- **CSS3** para estilizacao (sem frameworks externos)

---

## Pre-requisitos

- Node.js 18+
- Backend .NET em execucao em `http://localhost:5000`

---

## Instalacao e Execucao

```bash
# Instalar dependencias
npm install

# Executar em desenvolvimento
npm run dev
```

Acesse em `http://localhost:5173`

```bash
# Build para producao
npm run build

# Preview do build
npm run preview
```

---

## Configuracao de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Estrutura do Projeto

```
src/
|-- components/
|   |-- EmotionChallenge.jsx      # Desafio 1 - Identificar emocao
|   |-- ExpressionGame.jsx        # Desafio 2 - Expressar emocao via webcam
|   |-- WebcamCapture.jsx         # Componente de captura de camera
|   |-- ChildMetricsReport.jsx    # Relatorio de metricas para o psicologo
|   |-- PsychologistDashboard.jsx # Dashboard do psicologo
|   |-- AddChildDialog.jsx        # Dialog para cadastro de crianca
|-- pages/
|   |-- RoleSelectionPage.jsx     # Login e selecao de papel
|   |-- ChildTrailPage.jsx        # Trilha de desafios da crianca
|   |-- GamePage.jsx              # Pagina de jogo (roteamento de modos)
|   |-- PsychologistPage.jsx      # Pagina principal do psicologo
|   |-- DashboardPage.jsx         # Dashboard de metricas
|-- context/
|   |-- AppContext.jsx            # Estado global (autenticacao, sessao, jogo)
|   |-- GameContext.jsx           # Estado do jogo
|-- services/
|   |-- httpClient.js             # Cliente HTTP base com autenticacao
|   |-- auth.js                   # Servico de autenticacao
|   |-- emotion.js                # Servico de analise de emocoes
|   |-- child.js                  # Servico de gerenciamento de criancas
|   |-- psychologist.js           # Servico do psicologo
|   |-- user.js                   # Servico de usuarios
|   |-- index.js                  # Exportacoes centralizadas
|-- styles/                       # CSS por componente/pagina
|-- App.jsx                       # Rotas principais
|-- main.jsx                      # Entry point
public/
|-- icons/
    |-- ui/                       # Icones de interface (children, psychologist, happy)
    |-- challenges/               # Icones dos desafios (reaction, expression, mountain, candidate)
    |-- emotions/                 # Imagens de emocoes por dificuldade (easy, medium, hard)
```

---

## Fluxo de Navegacao

### Crianca
1. `/login` -> seleciona "Crianca"
2. `/child-trail` -> trilha com as fases disponiveis
3. `/game/identify` -> Desafio 1 (identificar emocao em imagem)
4. `/game/express` -> Desafio 2 (expressar emocao via webcam)

### Psicologo
1. `/login` -> seleciona "Psicologo"
2. `/psychologist` -> dashboard com lista de criancas e relatorio de metricas

---

## Modos de Jogo

### Desafio 1 - Identificar
- Exibe imagem de uma emocao em 3 niveis de dificuldade (1 estrela Facil / 2 estrelas Medio / 3 estrelas Dificil)
- Crianca escolhe entre 6 opcoes de emocao
- Tempo de resposta por emocao registrado individualmente
- Resultado enviado para `/api/Games/results`

### Desafio 2 - Expressar
- Crianca deve expressar a emocao solicitada para a webcam
- 3 frames capturados por emocao (intervalo de 250ms)
- Tempo de resposta por emocao registrado individualmente
- Analise enviada para `/api/emotion/batch-analyze`

---

## Relatorio do Psicologo

O relatorio exibe metricas tecnicas separadas por desafio:

- **Taxa de acerto media**
- **Tempo medio de resposta (ms)**
- **Total de sessoes**
- **Analise por emocao** (tentativas, acertos, acuracia)
- **Tendencia de progresso** com historico expansivel por sessao

As metricas sao estritamente tecnicas e nao possuem finalidade diagnostica ou clinica.

---

## Scripts Disponiveis

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build para producao
npm run preview  # Preview do build
npm run lint     # Verificacao de codigo
```