import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider, useAuth } from './core/providers';
import {
  LoginScreen,
  SignupScreen,
  DashboardScreen,
  MoodScreen,
  BreaksScreen,
  RecommendationsScreen,
  SettingsScreen,
} from './screens';
import { Loading } from './components';
import { COLORS } from './styles';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.border,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: () => null, // Adicione ícones depois
        }}
      />
      <Tab.Screen
        name="Mood"
        component={MoodScreen}
        options={{
          tabBarLabel: 'Humor',
          tabBarIcon: () => null,
        }}
      />
      <Tab.Screen
        name="Breaks"
        component={BreaksScreen}
        options={{
          tabBarLabel: 'Pausas',
          tabBarIcon: () => null,
        }}
      />
      <Tab.Screen
        name="Recommendations"
        component={RecommendationsScreen}
        options={{
          tabBarLabel: 'Dicas',
          tabBarIcon: () => null,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Config',
          tabBarIcon: () => null,
        }}
      />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading message="Inicializando..." />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={MainTabs} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer
        onReady={() => {
        }}
      >
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
