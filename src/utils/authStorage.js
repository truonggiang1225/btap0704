import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_SESSION_KEY = '@nectar_auth_session';

export const getAuthSession = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(AUTH_SESSION_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error reading auth session', error);
    return null;
  }
};

export const persistAuthSession = async (sessionData) => {
  try {
    const nextSession = {
      isAuthenticated: true,
      email: sessionData.email ?? '',
      name: sessionData.name ?? '',
      zone: sessionData.zone ?? '',
      area: sessionData.area ?? '',
    };

    await AsyncStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(nextSession));
    return nextSession;
  } catch (error) {
    console.error('Error saving auth session', error);
    return null;
  }
};

export const clearAuthSession = async () => {
  try {
    await AsyncStorage.removeItem(AUTH_SESSION_KEY);
  } catch (error) {
    console.error('Error clearing auth session', error);
  }
};
