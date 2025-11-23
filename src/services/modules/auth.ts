import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../api/client';
import { ENDPOINTS } from '../api/config';
import { AuthResponse, User } from '../../types';

const USE_MOCK = false;

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockUser: User = {
        id: '1',
        name: 'Usuário Teste',
        email: 'teste@fiap.com',
        workMode: 'remote',
      };
      const response: AuthResponse = {
        token: 'mock-token-' + Date.now(),
        user: mockUser,
      };
      await AsyncStorage.setItem('authToken', response.token || '');
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
      return response;
    }

    try {
      const usersResponse = await api.get<User[] | { data?: User[]; items?: User[] }>(ENDPOINTS.users.list);
      const users = Array.isArray(usersResponse) 
        ? usersResponse 
        : (usersResponse as any).data || (usersResponse as any).items || [];
      
      const user = users.find((u: User) => u.email === email);
      
      if (!user) {
        throw new Error('Email ou senha inválidos');
      }

      const response: AuthResponse = {
        user,
      };

      await AsyncStorage.setItem('authToken', response.token || '');
      await AsyncStorage.setItem('user', JSON.stringify(response.user));

      return response;
    } catch (error: any) {
      if (error.message) {
        throw error;
      }
      throw new Error('Erro ao fazer login. Tente novamente.');
    }
  },

  async signup(
    name: string,
    email: string,
    workMode: string
  ): Promise<AuthResponse> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const newUser: User = {
        id: String(Date.now()),
        name,
        email,
        workMode,
      };
      const response: AuthResponse = {
        token: 'mock-token-' + Date.now(),
        user: newUser,
      };
      await AsyncStorage.setItem('authToken', response.token || '');
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
      return response;
    }

    const workModeMap: Record<string, string> = {
      'remote': 'Remoto',
      'hybrid': 'Híbrido',
      'onsite': 'Presencial',
    };

    const userData = {
      name,
      email,
      workMode: workModeMap[workMode] || workMode,
    };

    try {
      const createResponse = await api.post<{ id: string }>(ENDPOINTS.users.create, userData);
      
      if (!createResponse.id) {
        throw new Error('Erro ao criar usuário: ID não retornado');
      }

      const user = await this.getUserById(createResponse.id);

      const response: AuthResponse = {
        user,
      };

      await AsyncStorage.setItem('authToken', response.token || '');
      await AsyncStorage.setItem('user', JSON.stringify(response.user));

      return response;
    } catch (error: any) {
      if (error.message) {
        throw error;
      }
      throw new Error('Erro ao criar conta. Tente novamente.');
    }
  },

  async logout(): Promise<void> {
    try {
    } catch (error) {
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
    const user = await this.getStoredUser();
    return !!(user && user.id);
  },

  async getUserById(id: string): Promise<User> {
    return await api.get<User>(ENDPOINTS.users.get(id));
  },

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return await api.put<User>(ENDPOINTS.users.update(id), data);
  },
};
