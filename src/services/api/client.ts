import axios, { AxiosInstance, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from './config';
import { ApiError } from '../../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      headers: API_CONFIG.headers,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          await AsyncStorage.removeItem('authToken');
          await AsyncStorage.removeItem('user');
        }
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError): ApiError {
    if (error.response) {
      return {
        message: (error.response.data as any)?.message || 'Erro no servidor',
        status: error.response.status,
        errors: (error.response.data as any)?.errors,
      };
    } else if (error.request) {
      return {
        message: 'Sem resposta do servidor',
        status: 0,
      };
    } else {
      return {
        message: error.message || 'Erro desconhecido',
        status: 0,
      };
    }
  }

  async get<T>(url: string, config = {}): Promise<T> {
    const response = await this.api.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config = {}): Promise<T> {
    const response = await this.api.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config = {}): Promise<T> {
    const response = await this.api.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config = {}): Promise<T> {
    const response = await this.api.delete<T>(url, config);
    return response.data;
  }
}

export const api = new ApiService();
