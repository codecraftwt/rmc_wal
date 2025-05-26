import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = AsyncStorage; 

export const setToken = async (token) => {
  try {
    console.log('Saving token to AsyncStorage:', token);
    await AsyncStorage.setItem('authToken', token);
    console.log('Token saved successfully');
  } catch (error) {
    console.error('Error setting token:', error);
  }
};


export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    return token || null;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('authToken');
  } catch (error) {
    console.error('Error removing token:', error);
  }
};
