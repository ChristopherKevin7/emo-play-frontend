# Exemplo de Objeto de Sessão de Jogo

## Estrutura Completa Para POST /api/GameSession

### Exemplo 1: Modo IDENTIFY (Identificar Emoção)
```json
{
  "childId": "550e8400-e29b-41d4-a716-446655440000",
  "gameMode": "identify",
  "levelId": "medium",
  "startTime": "2024-01-15T10:30:00Z",
  "endTime": "2024-01-15T10:35:45Z",
  "totalDuration": 345000,
  "results": [
    {
      "challengeNumber": 1,
      "targetEmotion": "Happiness",
      "detectedEmotion": "Happiness",
      "isCorrect": true,
      "responseTime": 2500,
      "confidence": 92.5,
      "timestamp": "2024-01-15T10:30:05Z"
    },
    {
      "challengeNumber": 2,
      "targetEmotion": "Sadness",
      "detectedEmotion": "Sadness",
      "isCorrect": true,
      "responseTime": 3100,
      "confidence": 88.3,
      "timestamp": "2024-01-15T10:30:10Z"
    },
    {
      "challengeNumber": 3,
      "targetEmotion": "Anger",
      "detectedEmotion": "Fear",
      "isCorrect": false,
      "responseTime": 2800,
      "confidence": 45.2,
      "timestamp": "2024-01-15T10:30:15Z"
    },
    {
      "challengeNumber": 4,
      "targetEmotion": "Surprise",
      "detectedEmotion": "Surprise",
      "isCorrect": true,
      "responseTime": 2200,
      "confidence": 95.1,
      "timestamp": "2024-01-15T10:30:20Z"
    },
    {
      "challengeNumber": 5,
      "targetEmotion": "Disgust",
      "detectedEmotion": "Disgust",
      "isCorrect": true,
      "responseTime": 2900,
      "confidence": 87.6,
      "timestamp": "2024-01-15T10:30:25Z"
    },
    {
      "challengeNumber": 6,
      "targetEmotion": "Fear",
      "detectedEmotion": "Fear",
      "isCorrect": true,
      "responseTime": 3200,
      "confidence": 91.4,
      "timestamp": "2024-01-15T10:30:30Z"
    }
  ],
  "statistics": {
    "totalChallenges": 6,
    "correctAnswers": 5,
    "accuracyRate": 83.33,
    "averageResponseTime": 2783,
    "averageConfidence": 86.02,
    "minResponseTime": 2200,
    "maxResponseTime": 3200
  }
}
```

### Exemplo 2: Modo EXPRESS (Expressar Emoção com Câmera)
```json
{
  "childId": "550e8400-e29b-41d4-a716-446655440000",
  "gameMode": "express",
  "levelId": "easy",
  "startTime": "2024-01-15T10:40:00Z",
  "endTime": "2024-01-15T10:45:30Z",
  "totalDuration": 330000,
  "results": [
    {
      "challengeNumber": 1,
      "targetEmotion": "Happiness",
      "detectedEmotion": "Happiness",
      "isCorrect": true,
      "responseTime": 4500,
      "confidence": 85.2,
      "imagePath": "/captures/session_123/challenge_1.jpg",
      "timestamp": "2024-01-15T10:40:10Z"
    },
    {
      "challengeNumber": 2,
      "targetEmotion": "Sadness",
      "detectedEmotion": "Sadness",
      "isCorrect": true,
      "responseTime": 5200,
      "confidence": 82.7,
      "imagePath": "/captures/session_123/challenge_2.jpg",
      "timestamp": "2024-01-15T10:40:20Z"
    },
    {
      "challengeNumber": 3,
      "targetEmotion": "Anger",
      "detectedEmotion": "Anger",
      "isCorrect": true,
      "responseTime": 4800,
      "confidence": 88.1,
      "imagePath": "/captures/session_123/challenge_3.jpg",
      "timestamp": "2024-01-15T10:40:30Z"
    },
    {
      "challengeNumber": 4,
      "targetEmotion": "Surprise",
      "detectedEmotion": "Sadness",
      "isCorrect": false,
      "responseTime": 5100,
      "confidence": 52.3,
      "imagePath": "/captures/session_123/challenge_4.jpg",
      "timestamp": "2024-01-15T10:40:40Z"
    },
    {
      "challengeNumber": 5,
      "targetEmotion": "Disgust",
      "detectedEmotion": "Disgust",
      "isCorrect": true,
      "responseTime": 4900,
      "confidence": 86.5,
      "imagePath": "/captures/session_123/challenge_5.jpg",
      "timestamp": "2024-01-15T10:40:50Z"
    },
    {
      "challengeNumber": 6,
      "targetEmotion": "Fear",
      "detectedEmotion": "Fear",
      "isCorrect": true,
      "responseTime": 5400,
      "confidence": 80.9,
      "imagePath": "/captures/session_123/challenge_6.jpg",
      "timestamp": "2024-01-15T10:41:00Z"
    }
  ],
  "statistics": {
    "totalChallenges": 6,
    "correctAnswers": 5,
    "accuracyRate": 83.33,
    "averageResponseTime": 4983,
    "averageConfidence": 82.62,
    "minResponseTime": 4500,
    "maxResponseTime": 5400
  }
}
```

---

## Descrição dos Campos

### Campos Principais
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `childId` | UUID | ID da criança logada |
| `gameMode` | string | Modo do jogo: `"identify"` ou `"express"` |
| `levelId` | string | Nível escolhido: `"easy"`, `"medium"` ou `"hard"` |
| `startTime` | ISO 8601 | Timestamp de início da sessão |
| `endTime` | ISO 8601 | Timestamp de fim da sessão |
| `totalDuration` | number | Duração total em milissegundos |

### Array Results
Cada desafio dentro da sessão com:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `challengeNumber` | number | Número do desafio (1-6) |
| `targetEmotion` | string | Emoção correta esperada |
| `detectedEmotion` | string | Emoção detectada/selecionada |
| `isCorrect` | boolean | Se a resposta estava correta |
| `responseTime` | number | Tempo em ms entre exibição e resposta |
| `confidence` | number | Confiança da detecção (0-100%) |
| `imagePath` | string | Caminho da imagem capturada (apenas express) |
| `timestamp` | ISO 8601 | Timestamp exato da resposta |

### Statistics
Agregações calculadas ao final:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `totalChallenges` | number | Total de desafios (sempre 6) |
| `correctAnswers` | number | Quantidade de respostas corretas |
| `accuracyRate` | number | Percentual de acertos (0-100) |
| `averageResponseTime` | number | Tempo médio de resposta em ms |
| `averageConfidence` | number | Confiança média da detecção |
| `minResponseTime` | number | Tempo mínimo de resposta |
| `maxResponseTime` | number | Tempo máximo de resposta |

---

## Endpoint Backend Recomendado

### POST /api/GameSession

**Request Body:**
```json
{
  "childId": "550e8400-e29b-41d4-a716-446655440000",
  "gameMode": "identify",
  "levelId": "medium",
  "startTime": "2024-01-15T10:30:00Z",
  "endTime": "2024-01-15T10:35:45Z",
  "totalDuration": 345000,
  "results": [...],
  "statistics": {...}
}
```

**Response Success (201):**
```json
{
  "sessionId": "60d5ec49c1234567890abcde",
  "childId": "550e8400-e29b-41d4-a716-446655440000",
  "gameMode": "identify",
  "levelId": "medium",
  "createdAt": "2024-01-15T10:35:45Z",
  "message": "Sessão de jogo salva com sucesso"
}
```

**Response Error (400):**
```json
{
  "error": "Dados inválidos",
  "details": "Faltam campos obrigatórios"
}
```

---

## Mapeamento de Emoções

As 6 emoções padrão são:
- `Happiness` - Feliz 😊
- `Sadness` - Triste 😢
- `Anger` - Raiva 😠
- `Surprise` - Surpresa 😮
- `Disgust` - Nojo 🤢
- `Fear` - Medo 😨

---

## Notas de Implementação

1. **Timestamps**: Use ISO 8601 (ex: `2024-01-15T10:30:00Z`)
2. **Response Times**: Capture desde quando o estímulo é exibido até a resposta
3. **Confidence**: Para modo identify (cliques), simule 70-95%. Para express, venha do DeepFace
4. **Statistics**: Calculadas no frontend antes de enviar para otimizar requisição
5. **Image Paths**: Salvar capturas no servidor e incluir caminho no objeto
6. **Duration Total**: `endTime - startTime` em milissegundos
