import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../api/client';
import { ENDPOINTS } from '../api/config';
import { AuthResponse, User } from '../../types';

const USE_MOCK = true;

const MOCK_USERS = [
  {
    email: 'teste@fiap.com',
    password: '123456',
    user: {
      id: '1',
      name: 'Usuário Teste',
      email: 'teste@fiap.com',
      workType: 'remote' as const,
      dietaryPreferences: ['vegetariano'],
      wellnessGoals: ['Melhorar bem-estar', 'Aumentar produtividade'],
      createdAt: new Date().toISOString(),
    },
  },
  {
    email: 'admin@fiap.com',
    password: 'admin',
    user: {
      id: '2',
      name: 'Administrador',
      email: 'admin@fiap.com',
      workType: 'hybrid' as const,
      dietaryPreferences: [],
      wellnessGoals: ['Reduzir estresse'],
      createdAt: new Date().toISOString(),
    },
  },
];

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockUser = MOCK_USERS.find(
        (u) => u.email === email && u.password === password
      );

      if (!mockUser) {
        throw new Error('Email ou senha inválidos');
      }

      const response: AuthResponse = {
        token: 'mock-token-' + Date.now(),
        user: mockUser.user,
      };

      await AsyncStorage.setItem('authToken', response.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));

      return response;
    }

    const response = await api.post<AuthResponse>(ENDPOINTS.auth.login, {
      email,
      password,
    });

    await AsyncStorage.setItem('authToken', response.token);
    await AsyncStorage.setItem('user', JSON.stringify(response.user));

    return response;
  },

  async signup(
    name: string,
    email: string,
    password: string,
    workType: string,
    dietaryPreferences: string[],
    wellnessGoals: string[]
  ): Promise<AuthResponse> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newUser: User = {
        id: String(Date.now()),
        name,
        email,
        workType: workType as any,
        dietaryPreferences,
        wellnessGoals,
        createdAt: new Date().toISOString(),
      };

      const response: AuthResponse = {
        token: 'mock-token-' + Date.now(),
        user: newUser,
      };

      await AsyncStorage.setItem('authToken', response.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));

      return response;
    }

    const response = await api.post<AuthResponse>(ENDPOINTS.auth.signup, {
      name,
      email,
      password,
      workType,
      dietaryPreferences,
      wellnessGoals,
    });

    await AsyncStorage.setItem('authToken', response.token);
    await AsyncStorage.setItem('user', JSON.stringify(response.user));

    return response;
  },

  async logout(): Promise<void> {
    try {
      await api.post(ENDPOINTS.auth.logout);
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
    }
  },

  async getStoredUser(): Promise<User | null> {
    const userStr = await AsyncStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  async getStoredToken(): Promise<string | null> {
    return await AsyncStorage.getItem('authToken');
  },

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getStoredToken();
    return !!token;
  },
};
