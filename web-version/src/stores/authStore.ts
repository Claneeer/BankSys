import { create } from 'zustand';
import axios from 'axios';

interface User {
  id: string;
  cpf: string;
  full_name: string;
  email: string;
  phone: string;
  profile_image?: string;
  biometric_enabled: boolean;
  created_at: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  
  // Actions
  login: (cpf: string, password: string) => Promise<void>;
  logout: () => void;
  initializeAuth: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://bankplus-digital.preview.emergentagent.com';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  token: null,

  login: async (cpf: string, password: string) => {
    try {
      set({ isLoading: true });
      
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        cpf,
        password
      });

      const { access_token, user } = response.data;
      
      // Store in localStorage
      localStorage.setItem('banksys_token', access_token);
      localStorage.setItem('banksys_user', JSON.stringify(user));
      
      // Update state
      set({
        user,
        token: access_token,
        isAuthenticated: true,
        isLoading: false
      });

      // Set default axios header
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
    } catch (error: any) {
      set({ isLoading: false });
      throw new Error(error.response?.data?.detail || 'Erro ao fazer login');
    }
  },

  logout: () => {
    localStorage.removeItem('banksys_token');
    localStorage.removeItem('banksys_user');
    delete axios.defaults.headers.common['Authorization'];
    
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false
    });
  },

  initializeAuth: async () => {
    try {
      const token = localStorage.getItem('banksys_token');
      const userStr = localStorage.getItem('banksys_user');
      
      if (token && userStr) {
        const user = JSON.parse(userStr);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Verify token is still valid
        try {
          await axios.get(`${API_BASE_URL}/api/auth/me`);
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          // Token invalid, clear storage
          get().logout();
        }
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
    }
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));