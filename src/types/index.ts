export interface User {
  id: string;
  name: string;
  email: string;
  workType: 'remote' | 'hybrid' | 'onsite';
  dietaryPreferences: string[];
  wellnessGoals: string[];
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface MoodEntry {
  id: string;
  userId: string;
  mood: 'excellent' | 'good' | 'neutral' | 'tired' | 'exhausted';
  energyLevel: number;
  screenTime: number;
  date: string;
  notes?: string;
}

export interface Recommendation {
  id: string;
  userId: string;
  type: 'break' | 'meal' | 'snack' | 'hydration';
  title: string;
  description: string;
  duration?: number;
  scheduledFor: string;
  completed: boolean;
}

export interface Break {
  id: string;
  userId: string;
  type: 'short' | 'long';
  duration: number;
  scheduledFor: string;
  completedAt?: string;
  skipped: boolean;
}

export interface Settings {
  userId: string;
  notificationsEnabled: boolean;
  breakReminders: boolean;
  hydrationReminders: boolean;
  workStartTime: string;
  workEndTime: string;
  breakFrequency: number;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}
