import { api } from '../api/client';
import { ENDPOINTS } from '../api/config';
import { BreakRecord, Break } from '../../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockBreaks } from '../api/mockData';

const USE_MOCK = false;
const BREAKS_STORAGE_KEY = '@nutribreak:breaks';

const mapBreakRecordToBreak = (record: BreakRecord): Break => {
  return {
    id: record.id || '',
    userId: record.userId,
    type: (record.type === 'long' ? 'long' : 'short') as 'short' | 'long',
    duration: record.durationMinutes,
    scheduledFor: new Date().toISOString(),
    skipped: false,
  };
};

const getStoredBreaks = async (): Promise<Break[]> => {
  try {
    const stored = await AsyncStorage.getItem(BREAKS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return [...mockBreaks];
  } catch {
    return [...mockBreaks];
  }
};

const saveBreaks = async (breaks: Break[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(BREAKS_STORAGE_KEY, JSON.stringify(breaks));
  } catch (error) {
  }
};

export const breakService = {
  async getAllBreaks(): Promise<Break[]> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return await getStoredBreaks();
    }

    const userStr = await AsyncStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    if (!user || !user.id) {
      return await getStoredBreaks();
    }

    try {
      const breakRecordsResponse = await api.get<BreakRecord[] | { data?: BreakRecord[]; items?: BreakRecord[] }>(ENDPOINTS.breakRecords.list);
      const breakRecords: BreakRecord[] = Array.isArray(breakRecordsResponse)
        ? breakRecordsResponse
        : (breakRecordsResponse as any).data || (breakRecordsResponse as any).items || [];
      
      const breaks = breakRecords
        .filter((record: BreakRecord) => record.userId === user.id)
        .map(mapBreakRecordToBreak);
      
      await saveBreaks(breaks);
      return breaks;
    } catch (error: any) {
      if (error.status === 500 || error.status === 0) {
        return await getStoredBreaks();
      }
      return await getStoredBreaks();
    }
  },

  async createBreak(data: {
    type: string;
    duration: number;
    scheduledFor: string;
  }): Promise<Break> {
    const userStr = await AsyncStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const userId = user?.id || 'local-user';

    const newBreak: Break = {
      id: String(Date.now()),
      userId,
      type: data.type as any,
      duration: data.duration,
      scheduledFor: data.scheduledFor,
      skipped: false,
    };

    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const breaks = await getStoredBreaks();
      breaks.unshift(newBreak);
      await saveBreaks(breaks);
      return newBreak;
    }

    if (!user || !user.id) {
      const breaks = await getStoredBreaks();
      breaks.unshift(newBreak);
      await saveBreaks(breaks);
      return newBreak;
    }

    try {
      const breakRecordData: Omit<BreakRecord, 'id'> = {
        userId: user.id,
        durationMinutes: data.duration,
        type: data.type,
        energyLevel: 5,
        screenTimeMinutes: 0,
      };

      const breakRecord = await api.post<BreakRecord>(
        ENDPOINTS.breakRecords.create,
        breakRecordData
      );
      const createdBreak = mapBreakRecordToBreak(breakRecord);
      
      const breaks = await getStoredBreaks();
      breaks.unshift(createdBreak);
      await saveBreaks(breaks);
      
      return createdBreak;
    } catch (error: any) {
      const breaks = await getStoredBreaks();
      breaks.unshift(newBreak);
      await saveBreaks(breaks);
      return newBreak;
    }
  },

  async completeBreak(id: string): Promise<Break> {
    try {
      if (!USE_MOCK) {
        const breakRecord = await api.get<BreakRecord>(ENDPOINTS.breakRecords.get(id));
        const updated = mapBreakRecordToBreak(breakRecord);
        updated.completedAt = new Date().toISOString();
        const breaks = await getStoredBreaks();
        const index = breaks.findIndex((b) => b.id === id);
        if (index !== -1) {
          breaks[index] = updated;
        } else {
          breaks.unshift(updated);
        }
        await saveBreaks(breaks);
        return updated;
      }
    } catch (error) {
    }
    
    const breaks = await getStoredBreaks();
    const breakItem = breaks.find((b) => b.id === id);
    if (breakItem) {
      breakItem.completedAt = new Date().toISOString();
      breakItem.skipped = false;
      await saveBreaks(breaks);
      return breakItem;
    }
    
    const newBreak: Break = {
      id,
      userId: 'local-user',
      type: 'short',
      duration: 15,
      scheduledFor: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      skipped: false,
    };
    breaks.unshift(newBreak);
    await saveBreaks(breaks);
    return newBreak;
  },

  async skipBreak(id: string): Promise<Break> {
    try {
      if (!USE_MOCK) {
        const breakRecord = await api.get<BreakRecord>(ENDPOINTS.breakRecords.get(id));
        const updated = mapBreakRecordToBreak(breakRecord);
        updated.skipped = true;
        const breaks = await getStoredBreaks();
        const index = breaks.findIndex((b) => b.id === id);
        if (index !== -1) {
          breaks[index] = updated;
        } else {
          breaks.unshift(updated);
        }
        await saveBreaks(breaks);
        return updated;
      }
    } catch (error) {
    }
    
    const breaks = await getStoredBreaks();
    const breakItem = breaks.find((b) => b.id === id);
    if (breakItem) {
      breakItem.skipped = true;
      await saveBreaks(breaks);
      return breakItem;
    }
    
    const newBreak: Break = {
      id,
      userId: 'local-user',
      type: 'short',
      duration: 15,
      scheduledFor: new Date().toISOString(),
      skipped: true,
    };
    breaks.unshift(newBreak);
    await saveBreaks(breaks);
    return newBreak;
  },

  async deleteBreak(id: string): Promise<void> {
    try {
      if (!USE_MOCK) {
        await api.delete(ENDPOINTS.breakRecords.delete(id));
      }
    } catch (error) {
    } finally {
      const breaks = await getStoredBreaks();
      const filtered = breaks.filter((b) => b.id !== id);
      await saveBreaks(filtered);
    }
  },
};
