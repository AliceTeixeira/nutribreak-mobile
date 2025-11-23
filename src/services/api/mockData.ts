import { Recommendation, Break, Settings } from '../../types';

export let mockRecommendations: Recommendation[] = [
  {
    id: '1',
    userId: '1',
    type: 'hydration',
    title: 'Beba Água',
    description: 'Mantenha-se hidratado! Beba um copo de água agora.',
    scheduledFor: new Date(Date.now() + 1800000).toISOString(),
    completed: false,
  },
  {
    id: '2',
    userId: '1',
    type: 'break',
    title: 'Pausa para Alongamento',
    description: 'Faça 5 minutos de alongamento para relaxar os músculos.',
    duration: 5,
    scheduledFor: new Date(Date.now() + 3600000).toISOString(),
    completed: false,
  },
  {
    id: '3',
    userId: '1',
    type: 'meal',
    title: 'Almoço Balanceado',
    description: 'Salada verde com proteína magra e carboidrato complexo.',
    scheduledFor: new Date(Date.now() - 3600000).toISOString(),
    completed: true,
  },
];

export let mockBreaks: Break[] = [
  {
    id: '1',
    userId: '1',
    type: 'short',
    duration: 5,
    scheduledFor: new Date(Date.now() + 1800000).toISOString(),
    skipped: false,
  },
  {
    id: '2',
    userId: '1',
    type: 'long',
    duration: 15,
    scheduledFor: new Date(Date.now() + 7200000).toISOString(),
    skipped: false,
  },
  {
    id: '3',
    userId: '1',
    type: 'short',
    duration: 5,
    scheduledFor: new Date(Date.now() - 3600000).toISOString(),
    completedAt: new Date(Date.now() - 3300000).toISOString(),
    skipped: false,
  },
];

export const mockSettings: Settings = {
  userId: '1',
  notificationsEnabled: true,
  breakReminders: true,
  hydrationReminders: true,
  workStartTime: '09:00',
  workEndTime: '18:00',
  breakFrequency: 60,
};
