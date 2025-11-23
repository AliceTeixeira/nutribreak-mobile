export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Mood: undefined;
  Breaks: undefined;
  Recommendations: undefined;
  Settings: undefined;
};

export type RootNavigationParamList = RootStackParamList & AuthStackParamList & MainTabParamList;
