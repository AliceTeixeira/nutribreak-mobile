import { api } from '../api/client';
import { ENDPOINTS } from '../api/config';
import { Recommendation } from '../../types';
import { mockRecommendations } from '../api/mockData';

const USE_MOCK = true;

export const recommendationService = {
  async getRecommendations(): Promise<Recommendation[]> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return [...mockRecommendations];
    }
    return await api.get<Recommendation[]>(ENDPOINTS.recommendations.list);
  },

  async generateRecommendations(): Promise<Recommendation[]> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const newRec: Recommendation = {
        id: String(Date.now()),
        userId: '1',
        type: 'snack',
        title: 'Lanche Saudável',
        description: 'Coma uma fruta ou castanhas para manter energia.',
        scheduledFor: new Date(Date.now() + 900000).toISOString(),
        completed: false,
      };
      mockRecommendations.unshift(newRec);
      return [newRec];
    }
    return await api.post<Recommendation[]>(ENDPOINTS.recommendations.generate);
  },

  async completeRecommendation(id: string): Promise<Recommendation> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const rec = mockRecommendations.find((r) => r.id === id);
      if (rec) {
        rec.completed = true;
        return rec;
      }
      throw new Error('Recomendação não encontrada');
    }
    return await api.put<Recommendation>(`${ENDPOINTS.recommendations.list}/${id}/complete`, {
      completed: true,
    });
  },
};
