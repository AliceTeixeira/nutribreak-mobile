export const API_CONFIG = {
  baseURL: 'https://nutribreak-api-16762.azurewebsites.net',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const ENDPOINTS = {
  users: {
    list: '/api/v1/users',
    create: '/api/v1/users',
    get: (id: string) => `/api/v1/users/${id}`,
    update: (id: string) => `/api/v1/users/${id}`,
    delete: (id: string) => `/api/v1/users/${id}`,
  },
  breakRecords: {
    list: '/api/v1/break-records',
    create: '/api/v1/break-records',
    get: (id: string) => `/api/v1/break-records/${id}`,
    update: (id: string) => `/api/v1/break-records/${id}`,
    delete: (id: string) => `/api/v1/break-records/${id}`,
  },
  meals: {
    list: '/api/v1/meals',
    create: '/api/v1/meals',
    get: (id: string) => `/api/v1/meals/${id}`,
    update: (id: string) => `/api/v1/meals/${id}`,
    delete: (id: string) => `/api/v1/meals/${id}`,
  },
};
