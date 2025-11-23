import { Recommendation } from '../../types';
import { mockRecommendations } from '../api/mockData';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USE_MOCK = true;
const RECOMMENDATIONS_STORAGE_KEY = '@nutribreak:recommendations';

const getStoredRecommendations = async (): Promise<Recommendation[]> => {
  try {
    const stored = await AsyncStorage.getItem(RECOMMENDATIONS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return [...mockRecommendations];
  } catch {
    return [...mockRecommendations];
  }
};

const saveRecommendations = async (recommendations: Recommendation[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(RECOMMENDATIONS_STORAGE_KEY, JSON.stringify(recommendations));
  } catch (error) {
  }
};

export const recommendationService = {
  async getRecommendations(): Promise<Recommendation[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return await getStoredRecommendations();
  },

  async generateRecommendations(): Promise<Recommendation[]> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const recommendations = await getStoredRecommendations();
    
    const newRec: Recommendation = {
      id: String(Date.now()),
      userId: '1',
      type: 'snack',
      title: 'Lanche Saudável',
      description: 'Coma uma fruta ou castanhas para manter energia.',
      scheduledFor: new Date(Date.now() + 900000).toISOString(),
      completed: false,
    };
    
    recommendations.unshift(newRec);
    await saveRecommendations(recommendations);
    return [newRec];
  },

  async completeRecommendation(id: string): Promise<Recommendation> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const recommendations = await getStoredRecommendations();
    const rec = recommendations.find((r) => r.id === id);
    
    if (rec) {
      rec.completed = true;
      await saveRecommendations(recommendations);
      return rec;
    }
    
    throw new Error('Recomendação não encontrada');
  },
};
