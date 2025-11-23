import { api } from '../api/client';
import { ENDPOINTS } from '../api/config';
import { Settings } from '../../types';
import { mockSettings } from '../api/mockData';

const USE_MOCK = true;
let currentSettings = { ...mockSettings };

export const settingsService = {
  async getSettings(): Promise<Settings> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { ...currentSettings };
    }
    return await api.get<Settings>(ENDPOINTS.settings.get);
  },

  async updateSettings(data: Partial<Settings>): Promise<Settings> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      currentSettings = { ...currentSettings, ...data };
      return { ...currentSettings };
    }
    return await api.put<Settings>(ENDPOINTS.settings.update, data);
  },
};
