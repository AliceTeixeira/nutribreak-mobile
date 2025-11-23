import { api } from '../api/client';
import { ENDPOINTS } from '../api/config';
import { MoodEntry } from '../../types';

const USE_MOCK = true;
let mockMoods: MoodEntry[] = [
  {
    id: '1',
    userId: '1',
    mood: 'good',
    energyLevel: 7,
    screenTime: 6,
    date: new Date(Date.now() - 86400000).toISOString(),
    notes: 'Dia produtivo',
  },
  {
    id: '2',
    userId: '1',
    mood: 'excellent',
    energyLevel: 9,
    screenTime: 4,
    date: new Date().toISOString(),
  },
];

export const moodService = {
  async getAllMoods(): Promise<MoodEntry[]> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return [...mockMoods];
    }
    return await api.get<MoodEntry[]>(ENDPOINTS.mood.list);
  },

  async createMood(data: {
    mood: string;
    energyLevel: number;
    screenTime: number;
    notes?: string;
  }): Promise<MoodEntry> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newMood: MoodEntry = {
        id: String(Date.now()),
        userId: '1',
        mood: data.mood as any,
        energyLevel: data.energyLevel,
        screenTime: data.screenTime,
        date: new Date().toISOString(),
        notes: data.notes,
      };
      mockMoods.unshift(newMood);
      return newMood;
    }
    return await api.post<MoodEntry>(ENDPOINTS.mood.create, data);
  },

  async updateMood(id: string, data: Partial<MoodEntry>): Promise<MoodEntry> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const index = mockMoods.findIndex((m) => m.id === id);
      if (index !== -1) {
        mockMoods[index] = { ...mockMoods[index], ...data };
        return mockMoods[index];
      }
      throw new Error('Mood não encontrado');
    }
    return await api.put<MoodEntry>(`${ENDPOINTS.mood.update}/${id}`, data);
  },

  async deleteMood(id: string): Promise<void> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      mockMoods = mockMoods.filter((m) => m.id !== id);
      return;
    }
    return await api.delete(`${ENDPOINTS.mood.delete}/${id}`);
  },
};
