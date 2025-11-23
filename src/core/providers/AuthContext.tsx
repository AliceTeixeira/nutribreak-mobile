import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../../services/modules/auth';
import { User } from '../../types';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    name: string,
    email: string,
    password: string,
    workType: string,
    dietaryPreferences: string[],
    wellnessGoals: string[]
  ) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredUser();
  }, []);

  async function loadStoredUser() {
    try {
      const storedUser = await authService.getStoredUser();
      if (storedUser && storedUser.id) {
        setUser(storedUser);
      } else {
        await authService.logout();
        setUser(null);
      }
    } catch (error) {
      await authService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const response = await authService.login(email, password);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  }

  async function signUp(
    name: string,
    email: string,
    password: string,
    workType: string,
    dietaryPreferences: string[],
    wellnessGoals: string[]
  ) {
    try {
      const response = await authService.signup(
        name,
        email,
        workType
      );
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  }

  async function signOut() {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        isAuthenticated: !!(user && user.id),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
