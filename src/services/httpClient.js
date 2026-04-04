// HTTP Client Base - Configurações e funções reutilizáveis

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Obter token do localStorage
export const getToken = () => localStorage.getItem('authToken');

// Headers padrão com ou sem autenticação
export const getHeaders = (includeAuth = true, contentType = 'application/json') => {
  const headers = {
    'Content-Type': contentType,
  };
  
  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// Função para lidar com respostas de erro
const handleErrorResponse = (response, data) => {
  // Se receber 401, o token é inválido/expirado - limpar
  if (response.status === 401) {
    console.warn('Token inválido ou expirado - removendo...');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    // Redirecionar para login se necessário
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
  
  throw new Error(data.message || `Erro HTTP: ${response.status}`);
};

// Função wrapper para requisições
export const httpClient = {
  get: async (endpoint, auth = true) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(auth),
    });
    
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      handleErrorResponse(response, data);
    }
    
    return response.json();
  },

  post: async (endpoint, body, auth = true, contentType = 'application/json') => {
    const headers = getHeaders(auth, contentType);
    
    const fetchOptions = {
      method: 'POST',
      headers,
    };

    if (contentType === 'application/json') {
      fetchOptions.body = JSON.stringify(body);
    } else {
      fetchOptions.body = body; // Para FormData ou Blob
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);
    
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      handleErrorResponse(response, data);
    }
    
    return response.json();
  },

  put: async (endpoint, body, auth = true) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(auth),
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      handleErrorResponse(response, data);
    }
    
    return response.json();
  },

  delete: async (endpoint, auth = true) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(auth),
    });
    
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      handleErrorResponse(response, data);
    }
    
    return response.json();
  },
};
