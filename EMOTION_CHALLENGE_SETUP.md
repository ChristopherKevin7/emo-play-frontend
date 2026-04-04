# 🎮 Guia de Configuração - Quiz de Identificação de Emoções

## 📋 Resumo do Projeto

O componente `EmotionChallenge` foi reformulado para apresentar um quiz interativo com 3 níveis de dificuldade, onde a criança identifica emoções em imagens clicando em botões indicadores.

## 🏗️ Estrutura de Pastas Criada

```
public/emotions/
├── easy/              # Personagens Caricatos (✅ Pronto)
│   ├── Anger_1.png
│   ├── Disgust_1.png
│   ├── Fear_1.png
│   ├── Happiness_1.png
│   ├── Sadness_1.png
│   └── Surprise_1.png
│
├── medium/            # Personagens 3D (✅ Pronto)
│   ├── Anger_2.png
│   ├── Disgust_2.png
│   ├── Fear_2.png
│   ├── Happiness_2.png
│   ├── Sadness_2.png
│   └── Surprise_2.png
│
└── hard/              # Pessoas Reais (⏳ Aguardando Imagens)
    ├── Anger_3.png
    ├── Disgust_3.png
    ├── Fear_3.png
    ├── Happiness_3.png
    ├── Sadness_3.png
    └── Surprise_3.png
```

## 🎯 Emoções Suportadas (6 no Total)

| Emoção | Emoji | Arquivo Base | Status |
|--------|-------|--------------|--------|
| Felicidade | 😊 | `Happiness_[nivel].png` | ✅ |
| Tristeza | 😢 | `Sadness_[nivel].png` | ✅ |
| Raiva | 😠 | `Anger_[nivel].png` | ✅ |
| Surpresa | 😮 | `Surprise_[nivel].png` | ✅ |
| Nojo | 🤢 | `Disgust_[nivel].png` | ✅ |
| Medo | 😨 | `Fear_[nivel].png` | ✅ |

## ⚙️ Como Funciona o Quiz

### Fluxo de Jogo (3 Estados)

1. **Seleção de Nível** (`levelSelect`)
   - Exibe 3 botões: Fácil, Médio, Difícil
   - Cada nível tem descrição e ícone
   - Clicar inicia os 6 desafios do nível

2. **Desafio** (`challenge`)
   - Exibe uma imagem de emoção
   - 6 botões com emoções (texto + emoji)
   - Criança clica no botão correspondente à imagem
   - Contador mostra: "Desafio X/6"

3. **Resultado** (`result`)
   - ✨ Correto! (fundo verde)
   - ❌ Incorreto (fundo vermelho)
   - Mostra emoção selecionada e a correta
   - Botão "Próximo" ou "Voltar para Níveis"

### Características

- ✅ Cada emoção aparece uma vez por nível (não se repete)
- ✅ Ordem aleatória
- ✅ Feedback visual imediato
- ✅ Suporte para níveis futuros (fácil expansão)
- ✅ Design responsivo (mobile-friendly)

## 📝 Como Adicionar Imagens do Nível 3 (Pessoas Reais)

### Passo 1: Preparar as Imagens
1. Reúna 6 imagens de pessoas reais expressando emoções
2. Uma imagem para cada emoção: Happiness, Sadness, Anger, Surprise, Disgust, Fear

### Passo 2: Renomear as Imagens
Renomeie no padrão exato: `{EMOTION}_3.png`

**Exemplo:**
- `Happiness_3.png`
- `Sadness_3.png`
- `Anger_3.png`
- `Surprise_3.png`
- `Disgust_3.png`
- `Fear_3.png`

### Passo 3: Adicionar Arquivos
Copie todos os 6 arquivos para:
```
public/emotions/hard/
```

### Passo 4: Pronto! ✅
Nenhuma alteração de código necessária. O sistema carregará as imagens automaticamente ao selecionar "Difícil".

## 🔧 Modificações Realizadas

### 1. **EmotionChallenge.jsx**
   - Removida: Captura de webcam (modo antigo)
   - Adicionado: Sistema de 3 níveis
   - Adicionado: Grid de 6 emoções com botões clicáveis
   - Adicionado: Lógica de acerto/erro por clique

### 2. **EmotionChallenge.css**
   - Novo: Estilos para seletor de nível
   - Novo: Grid responsivo de botões de emoção
   - Novo: Animações de resultado
   - Novo: Media queries para mobile

### 3. **Estrutura de Assets**
   - Criado: `public/emotions/` com subpastas por nível
   - Reorganizado: Imagens _1 e _2 para as pastas corretas

## 🚀 Próximas Etapas

- [ ] Adicionar imagens do nível 3 (Pessoas Reais)
- [ ] Testar no navegador
- [ ] Ajustar feedback visual conforme necessário
- [ ] Integrar com dashboard de psicólogo (se aplicável)

## 💡 Dicas de Uso

- **Para Desenvolvedores**: O mapeamento de emoções está em `EMOTION_MAP` - fácil adicionar novas emoções
- **Para Crianças**: Interface colorida, emojis grandes e feedback visual claro
- **Para Psicólogos**: Rastreamento de pontuação integrado com AppContext

## ❓ Dúvidas ou Melhorias?

Consulte o arquivo de contexto do projeto: `.github/copilot-instructions.md`
