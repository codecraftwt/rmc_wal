// AxiosInstance.js
import axios from 'axios';
import {baseURL} from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const instance = axios.create({
  baseURL: `${baseURL}`,
   headers: {
    'Content-Type': 'multipart/form-data', 
  },
});

// instance.interceptors.request.use(
//   async config => {
//     try {
//       const token = await AsyncStorage.getItem('authToken');
//       console.log('Token from AsyncStorage --->', token);
//       if (token) {
//         config.headers.Authorization = `${token}`;
//       }
//     } catch (error) {
//       console.error('Failed to attach token', error);
//     }
//     return config;
//   },
//   error => Promise.reject(error),
// );

// export default instance;

instance.interceptors.request.use(
  async config => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = token.trim();
      }
    } catch (error) {
      console.error('Failed to attach token', error);
      throw error;
    }
    return config;
  },
  error => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  },
);

export default instance;
