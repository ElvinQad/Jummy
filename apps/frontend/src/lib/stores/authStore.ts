import { create } from 'zustand';
import { api, onRefreshSuccess } from '../../lib/axios';
import { LoginFormData, RegisterFormData, AuthResponse } from '@jummy/shared-types';
import { User } from '@jummy/shared-types';
import { ToastProps } from '../ui/use-toast';

type AuthMode = 'login' | 'register';

interface AuthState {
  showAuthModal: boolean;
  isAuthenticated: boolean;
  user: User | null;
  authMode: AuthMode;
  setShowAuthModal: (show: boolean) => void;
  setIsAuthenticated: (value: boolean) => void;
  setUser: (user: User | null) => void;
  setAuthMode: (mode: AuthMode) => void;
  clearAuth: (skipLogoutRequest?: boolean) => Promise<void>;
  login: (data: LoginFormData, onSuccess?: () => void) => Promise<void>;
  register: (data: RegisterFormData, onSuccess?: () => void) => Promise<void>;
  googleAuth: (credential: string, isLogin?: boolean, onSuccess?: () => void) => Promise<void>;
  refreshToken: () => Promise<void>;
  handleAuthSuccess: (response: AuthResponse, onSuccess?: () => void) => void;
  handleAuthError: (error: any, authType: string) => Omit<ToastProps, "id">;
}

const useAuthStore = create<AuthState>((set, get) => ({
  showAuthModal: false,
  isAuthenticated: false,
  user: null,
  authMode: 'login',
  setShowAuthModal: (show) => set({ showAuthModal: show }),
  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  setUser: (user) => set({ user }),
  setAuthMode: (mode) => set({ authMode: mode }),
  clearAuth: async (skipLogoutRequest = false) => {

    try {
      if (!skipLogoutRequest && localStorage.getItem('access_token')) {
        await api.post('/auth/logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear localStorage (this will trigger storage events in other tabs)
      localStorage.clear();
      
      // Update current tab's state
      set({
        showAuthModal: false,
        isAuthenticated: false,
        user: null,
        authMode: 'login',
      });
    }
  },
  login: async (data, onSuccess) => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', data);
      get().handleAuthSuccess(response.data, onSuccess);
    } catch (error: any) {
      console.error('Login error:', error);
      throw error; // Let the component handle the error
    }
  },
  register: async (data, onSuccess) => {
    try {
      const response = await api.post<AuthResponse>('/auth/register', data);
      get().handleAuthSuccess(response.data, onSuccess);
    } catch (error: any) {
      console.error('Register error:', error);
      throw error; // Let the component handle the error
    }
  },
  handleAuthError: (error: any, authType: string) => {
    const errorData = error.response?.data;
    return {
      variant: "destructive",
      title: errorData?.error || "Authentication Error",
      description: errorData?.message || `${authType} failed. Please try again.`
    };
  },
  googleAuth: async (credential, isLogin = true, onSuccess) => {
    const endpoint = isLogin ? '/auth/google/callback' : '/auth/google/register';
    const authType = `Google ${isLogin ? 'login' : 'registration'}`;
    console.log('LOGIN TRY');
    
    try {
      const response = await api.post<AuthResponse>(endpoint, { credential });
      get().handleAuthSuccess(response.data, onSuccess);
    console.log('success');

    } catch (error: any) {

      console.error('Google auth error:', error);
      throw get().handleAuthError(error, authType);
    }
  },
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) throw new Error('No refresh token available');
      const response = await api.post<AuthResponse>('/auth/refresh', {
        refresh_token: refreshToken
      });
      const { access_token } = response.data;
      localStorage.setItem('access_token', access_token);
      onRefreshSuccess(access_token);
    } catch (error: any) {
      await get().clearAuth(true);
      throw error;
    }
  },
  handleAuthSuccess: (response: AuthResponse, onSuccess) => {
    if (!response.access_token || !response.user) {
      throw new Error('Invalid response from server');
    }
    const { access_token, refresh_token, user } = response;
    
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('user', JSON.stringify(user));
    
    // Update current tab's state
    set({
      user,
      isAuthenticated: true,
      showAuthModal: false,
    });
    
    onSuccess?.();
  },
}));

export default useAuthStore;
