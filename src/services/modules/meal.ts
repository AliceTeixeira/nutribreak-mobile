import { api } from '../api/client';
import { ENDPOINTS } from '../api/config';
import { Meal } from '../../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USE_MOCK = false;

export const mealService = {
  async getAllMeals(): Promise<Meal[]> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return [];
    }

    const userStr = await AsyncStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    if (!user || !user.id) {
      throw new Error('Usuário não autenticado. Faça login novamente.');
    }

    try {
      const mealsResponse = await api.get<Meal[] | { data?: Meal[]; items?: Meal[] }>(ENDPOINTS.meals.list);
      const meals = Array.isArray(mealsResponse)
        ? mealsResponse
        : (mealsResponse as any).data || (mealsResponse as any).items || [];
      
      return meals.filter((meal) => meal.userId === user.id);
    } catch (error: any) {
      if (error.status === 500 || error.status === 0) {
        return [];
      }
      throw error;
    }
  },

  async getMealById(id: string): Promise<Meal> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const meal: Meal = {
        id,
        userId: '1',
        title: 'Refeição Teste',
        calories: 500,
        timeOfDay: 'lunch',
      };
      return meal;
    }

    return await api.get<Meal>(ENDPOINTS.meals.get(id));
  },

  async createMeal(data: {
    title?: string;
    calories: number;
    timeOfDay?: string;
  }): Promise<Meal> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newMeal: Meal = {
        id: String(Date.now()),
        userId: '1',
        title: data.title,
        calories: data.calories,
        timeOfDay: data.timeOfDay,
      };
      return newMeal;
    }

    const userStr = await AsyncStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    if (!user || !user.id) {
      throw new Error('Usuário não autenticado. Faça login novamente.');
    }

    const mealData: Omit<Meal, 'id'> = {
      userId: user.id,
      title: data.title,
      calories: data.calories,
      timeOfDay: data.timeOfDay,
    };

    return await api.post<Meal>(ENDPOINTS.meals.create, mealData);
  },

  async updateMeal(id: string, data: Partial<Meal>): Promise<Meal> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const updatedMeal: Meal = {
        id,
        userId: '1',
        title: data.title,
        calories: data.calories || 0,
        timeOfDay: data.timeOfDay,
      };
      return updatedMeal;
    }

    const updateData: Partial<Meal> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.calories !== undefined) updateData.calories = data.calories;
    if (data.timeOfDay !== undefined) updateData.timeOfDay = data.timeOfDay;

    return await api.put<Meal>(ENDPOINTS.meals.update(id), updateData);
  },

  async deleteMeal(id: string): Promise<void> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return;
    }

    await api.delete(ENDPOINTS.meals.delete(id));
  },
};

