// Export central de todos os serviços
// Isso permite importar de um único lugar: import { authService, childService, ... } from '../services'

export { authService } from './auth';
export { userService } from './user';
export { emotionService } from './emotion';
export { childService } from './child';
export { psychologistService } from './psychologist';
export { gamesService } from './games';
export { metricsService } from './metrics';
export { httpClient, getToken, getHeaders, API_BASE_URL } from './httpClient';
