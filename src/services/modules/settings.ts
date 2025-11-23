import { Settings } from '../../types';
import { mockSettings } from '../api/mockData';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USE_MOCK = true;
const SETTINGS_STORAGE_KEY = '@nutribreak:settings';

const getStoredSettings = async (): Promise<Settings> => {
  try {
    const stored = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return { ...mockSettings };
  } catch {
    return { ...mockSettings };
  }
};

const saveSettings = async (settings: Settings): Promise<void> => {
  try {
    await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
  }
};

export const settingsService = {
  async getSettings(): Promise<Settings> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return await getStoredSettings();
  },

  async updateSettings(data: Partial<Settings>): Promise<Settings> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const currentSettings = await getStoredSettings();
    const updatedSettings = { ...currentSettings, ...data };
    await saveSettings(updatedSettings);
    return updatedSettings;
  },
};
