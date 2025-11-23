import { api } from '../api/client';
import { ENDPOINTS } from '../api/config';
import { BreakRecord, MoodEntry } from '../../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USE_MOCK = false;
const MOODS_STORAGE_KEY = '@nutribreak:moods';

const mapBreakRecordToMoodEntry = (record: BreakRecord & { createdAt?: string; date?: string }): MoodEntry => {
  return {
    id: record.id || '',
    userId: record.userId,
    mood: (record.mood as any) || 'neutral',
    energyLevel: record.energyLevel,
    screenTime: record.screenTimeMinutes,
    date: record.date || record.createdAt || new Date().toISOString(),
  };
};

const mapMoodEntryToBreakRecord = (
  data: {
    mood: string;
    energyLevel: number;
    screenTime: number;
    notes?: string;
  },
  userId: string
): Omit<BreakRecord, 'id'> => {
  return {
    userId,
    durationMinutes: 15,
    type: 'short',
    mood: data.mood,
    energyLevel: data.energyLevel,
    screenTimeMinutes: data.screenTime,
  };
};

const getStoredMoods = async (): Promise<MoodEntry[]> => {
  try {
    const stored = await AsyncStorage.getItem(MOODS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveMoods = async (moods: MoodEntry[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(MOODS_STORAGE_KEY, JSON.stringify(moods));
  } catch (error) {
  }
};

export const moodService = {
  async getAllMoods(): Promise<MoodEntry[]> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return await getStoredMoods();
    }

    const userStr = await AsyncStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    if (!user || !user.id) {
      return await getStoredMoods();
    }

    try {
      const breakRecordsResponse = await api.get<BreakRecord[] | { data?: BreakRecord[]; items?: BreakRecord[] }>(ENDPOINTS.breakRecords.list);
      const breakRecords = Array.isArray(breakRecordsResponse)
        ? breakRecordsResponse
        : (breakRecordsResponse as any).data || (breakRecordsResponse as any).items || [];
      
      const moods = breakRecords
        .filter((record) => record.userId === user.id)
        .map(mapBreakRecordToMoodEntry);
      
      await saveMoods(moods);
      return moods;
    } catch (error: any) {
      if (error.status === 500 || error.status === 0) {
        return await getStoredMoods();
      }
      return await getStoredMoods();
    }
  },

  async createMood(data: {
    mood: string;
    energyLevel: number;
    screenTime: number;
    notes?: string;
  }): Promise<MoodEntry> {
    const userStr = await AsyncStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const userId = user?.id || 'local-user';

    const newMood: MoodEntry = {
      id: String(Date.now()),
      userId,
      mood: data.mood as any,
      energyLevel: data.energyLevel,
      screenTime: data.screenTime,
      date: new Date().toISOString(),
      notes: data.notes,
    };

    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const moods = await getStoredMoods();
      moods.unshift(newMood);
      await saveMoods(moods);
      return newMood;
    }

    if (!user || !user.id) {
      const moods = await getStoredMoods();
      moods.unshift(newMood);
      await saveMoods(moods);
      return newMood;
    }

    try {
      const breakRecordData = mapMoodEntryToBreakRecord(data, user.id);
      const breakRecord = await api.post<BreakRecord>(
        ENDPOINTS.breakRecords.create,
        breakRecordData
      );
      const createdMood = mapBreakRecordToMoodEntry(breakRecord);
      
      const moods = await getStoredMoods();
      moods.unshift(createdMood);
      await saveMoods(moods);
      
      return createdMood;
    } catch (error: any) {
      const moods = await getStoredMoods();
      moods.unshift(newMood);
      await saveMoods(moods);
      return newMood;
    }
  },

  async updateMood(id: string, data: Partial<MoodEntry>): Promise<MoodEntry> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const updatedMood: MoodEntry = {
        id,
        userId: '1',
        mood: (data.mood as any) || 'neutral',
        energyLevel: data.energyLevel || 5,
        screenTime: data.screenTime || 0,
        date: new Date().toISOString(),
        notes: data.notes,
      };
      return updatedMood;
    }

    const updateData: Partial<BreakRecord> = {};
    if (data.mood) updateData.mood = data.mood;
    if (data.energyLevel !== undefined) updateData.energyLevel = data.energyLevel;
    if (data.screenTime !== undefined) updateData.screenTimeMinutes = data.screenTime;

    const breakRecord = await api.put<BreakRecord>(
      ENDPOINTS.breakRecords.update(id),
      updateData
    );

    return mapBreakRecordToMoodEntry(breakRecord);
  },

  async deleteMood(id: string): Promise<void> {
    try {
      if (!USE_MOCK) {
        await api.delete(ENDPOINTS.breakRecords.delete(id));
      }
    } catch (error) {
    } finally {
      const moods = await getStoredMoods();
      const filtered = moods.filter((m) => m.id !== id);
      await saveMoods(filtered);
    }
  },
};
