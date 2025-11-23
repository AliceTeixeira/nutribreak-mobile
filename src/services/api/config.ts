export const API_CONFIG = {
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
    logout: '/auth/logout',
  },
  user: {
    profile: '/user/profile',
    update: '/user/update',
  },
  mood: {
    list: '/mood',
    create: '/mood',
    update: '/mood',
    delete: '/mood',
  },
  recommendations: {
    list: '/recommendations',
    generate: '/recommendations/generate',
  },
  breaks: {
    list: '/breaks',
    create: '/breaks',
    complete: '/breaks/complete',
  },
  settings: {
    get: '/settings',
    update: '/settings',
  },
};
