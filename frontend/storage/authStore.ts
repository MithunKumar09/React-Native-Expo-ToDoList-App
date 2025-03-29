// frontend/storage/authStore.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  email: string | null;
  username: string | null;
  isAuthenticated: boolean;
  starredTasks: Record<string, { starredTime: number }>;
  toggleStar: (taskId: string, fetchTasks: () => void) => Promise<void>;
  setAuth: (data: { token: string; refreshToken: string; email: string; username: string }) => void;
  restoreAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  refreshToken: null,
  email: null,
  username: null,
  isAuthenticated: false,
  starredTasks: {},

  toggleStar: async (taskId, fetchTasks) => {
    const { starredTasks } = get();
    let updatedStarredTasks = { ...starredTasks };

    if (starredTasks[taskId]) {
      delete updatedStarredTasks[taskId]; // Unstar the task
    } else {
      updatedStarredTasks[taskId] = { starredTime: Date.now() }; // Star with timestamp
    }

    await AsyncStorage.setItem('starredTasks', JSON.stringify(updatedStarredTasks));
    set({ starredTasks: updatedStarredTasks });

    // Refresh the task list after toggling
    fetchTasks();
  },

  setAuth: async ({ token, refreshToken, email, username }) => {
    try {
      await SecureStore.setItemAsync('authToken', token);
      await SecureStore.setItemAsync('refreshToken', refreshToken);
      await AsyncStorage.setItem('userEmail', email);
      await AsyncStorage.setItem('username', username);
      
      set({ token, refreshToken, email, username, isAuthenticated: true });
    } catch (error) {
      console.error('Error storing authentication data:', error);
    }
  },

  restoreAuth: async () => {
    console.log('(NOBRIDGE) LOG  Restoring Auth...');
    const token = await SecureStore.getItemAsync('authToken');
    const refreshToken = await SecureStore.getItemAsync('refreshToken');
    const email = await AsyncStorage.getItem('userEmail');
    const username = await AsyncStorage.getItem('username');
    const starredTasks = await AsyncStorage.getItem('starredTasks');
    
    console.log('(NOBRIDGE) LOG  Retrieved from SecureStore:', { token, refreshToken });
    console.log('(NOBRIDGE) LOG  Retrieved from AsyncStorage:', { email, username });
    
    if (token && refreshToken && email && username) {
        console.log('(NOBRIDGE) LOG  Restoring user authentication...');
        set({ token, refreshToken, email, username, isAuthenticated: true, starredTasks: starredTasks ? JSON.parse(starredTasks) : {} });
    } else {
        console.log('(NOBRIDGE) LOG  No stored auth data found.');
        set({ token: null, refreshToken: null, email: null, username: null, isAuthenticated: false });
    }
    
  },

  logout: async () => {
    try {
      await SecureStore.deleteItemAsync('authToken');
      await SecureStore.deleteItemAsync('refreshToken');
      await AsyncStorage.removeItem('userEmail');
      await AsyncStorage.removeItem('username');
      
      set({ token: null, refreshToken: null, email: null, username: null, isAuthenticated: false });
    } catch (error) {
      console.error('Error clearing authentication data:', error);
    }
  },
}));
