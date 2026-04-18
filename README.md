# 📖 README - EMO-Play Frontend

## 🎯 Descrição

EMO-Play é um aplicativo React gamificado para exercitar reconhecimento e expressão de emoções. Este é o frontend da aplicação, desenvolvido com React + Vite.

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 16+ e npm
- Backend FastAPI executando em `http://localhost:5000`

### Instalação

```bash
# Instalar dependências
npm install

# Criar arquivo .env (se não existir)
cp .env.example .env

# Executar em desenvolvimento
npm run dev
```

A aplicação será aberta em `http://localhost:5173`

### Build para Produção

```bash
npm run build
npm run preview
```

## 📁 Estrutura do Projeto

```
src/
├── components/           # Componentes reutilizáveis
│   ├── WebcamCapture.jsx
│   ├── EmotionChallenge.jsx
│   └── PsychologistDashboard.jsx
├── pages/               # Páginas principais
│   ├── HomePage.jsx
│   ├── GamePage.jsx
│   └── DashboardPage.jsx
├── services/            # Serviços API
│   └── api.js
├── context/             # Estado global
│   └── GameContext.jsx
├── styles/              # CSS dos componentes
├── App.jsx              # Componente principal
└── main.jsx             # Entry point
```

## 🎮 Como Usar

1. **Página Inicial**: Escolha entre dois modos
2. **Modo Identificar**: Identifique qual emoção você vê
3. **Modo Fazer Emoção**: Expresse a emoção solicitada
4. **Dashboard**: Visualize suas métricas técnicas

## 🔧 Configuração de Ambiente

Arquivo `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

## 📦 Dependências Principais

- React 18
- Vite 4
- CSS3 com variáveis

## 🎨 Customização

### Adicionar Novas Emoções

Edite `src/components/EmotionChallenge.jsx`:
```javascript
const EMOTIONS = ['Happy', 'Sad', 'Angry', 'Surprised', 'Neutral', 'Disgusted', 'Afraid'];
```

### Mudar Cores

Edite variáveis CSS em `src/App.css`:
```css
:root {
  --color-primary: #667eea;
  --color-secondary: #764ba2;
  /* ... */
}
```

## 🐛 Troubleshooting

### Câmera não funciona
- Verifique permissões do navegador
- Chrome requer HTTPS em produção
- Tente recarregar a página

### Erro de conexão com Backend
- Verifique se o Backend está rodando
- Confirme a `VITE_API_URL` em `.env`
- Verificar CORS no Backend

## 📚 Recursos Adicionais

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [MDN - Web APIs](https://developer.mozilla.org/en-US/docs/Web/API)

## 📄 Licença

Este projeto é parte do trabalho de conclusão de curso em Engenharia da Computação.

## 👨‍💻 Desenvolvimento

### Scripts Disponíveis

```bash
npm run dev      # Iniciar servidor de desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview do build
npm run lint     # Verificar código (se ESLint configurado)
```

---

**Desenvolvido com ❤️ para crianças com TEA**

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
