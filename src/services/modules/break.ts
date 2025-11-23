import { api } from '../api/client';
import { ENDPOINTS } from '../api/config';
import { Break } from '../../types';
import { mockBreaks } from '../api/mockData';

const USE_MOCK = true;

export const breakService = {
  async getAllBreaks(): Promise<Break[]> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return [...mockBreaks];
    }
    return await api.get<Break[]>(ENDPOINTS.breaks.list);
  },

  async createBreak(data: {
    type: string;
    duration: number;
    scheduledFor: string;
  }): Promise<Break> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newBreak: Break = {
        id: String(Date.now()),
        userId: '1',
        type: data.type as any,
        duration: data.duration,
        scheduledFor: data.scheduledFor,
        skipped: false,
      };
      mockBreaks.unshift(newBreak);
      return newBreak;
    }
    return await api.post<Break>(ENDPOINTS.breaks.create, data);
  },

  async completeBreak(id: string): Promise<Break> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const breakItem = mockBreaks.find((b) => b.id === id);
      if (breakItem) {
        breakItem.completedAt = new Date().toISOString();
        breakItem.skipped = false;
        return breakItem;
      }
      throw new Error('Pausa não encontrada');
    }
    return await api.put<Break>(`${ENDPOINTS.breaks.complete}/${id}`, {
      completedAt: new Date().toISOString(),
      skipped: false,
    });
  },

  async skipBreak(id: string): Promise<Break> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const breakItem = mockBreaks.find((b) => b.id === id);
      if (breakItem) {
        breakItem.skipped = true;
        return breakItem;
      }
      throw new Error('Pausa não encontrada');
    }
    return await api.put<Break>(`${ENDPOINTS.breaks.list}/${id}`, {
      skipped: true,
    });
  },
};
