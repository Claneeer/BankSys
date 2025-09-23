import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginCredentials, RegisterData, AuthResponse, User } from '../models/User';

const API_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

// Simple storage fallback for web
const webStorage = {
  async setItem(key: string, value: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  },
  async getItem(key: string) {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  },
  async removeItem(key: string) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  }
};

// Use web storage on web, AsyncStorage on mobile
const storage = typeof window !== 'undefined' ? webStorage : AsyncStorage;

// Simple storage fallback for web
const webStorage = {
  async setItem(key: string, value: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  },
  async getItem(key: string) {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  },
  async removeItem(key: string) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  }
};

// Use web storage on web, AsyncStorage on mobile
const storage = typeof window !== 'undefined' ? webStorage : AsyncStorage;

class AuthController {
  private token: string | null = null;

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('🔐 AuthController login called with:', credentials.cpf);
      console.log('🌐 API URL:', API_BASE_URL);
      
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, credentials);
      const authData: AuthResponse = response.data;
      
      console.log('✅ Login API response received:', { user: authData.user.full_name });
      
      // Store token
      this.token = authData.access_token;
      await storage.setItem('auth_token', authData.access_token);
      await storage.setItem('user_data', JSON.stringify(authData.user));
      
      console.log('✅ Token and user data stored');
      
      return authData;
    } catch (error: any) {
      console.error('❌ Login error:', error);
      throw new Error(error.response?.data?.detail || 'Login failed');
    }
  }

  async register(userData: RegisterData): Promise<User> {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, userData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Registration failed');
    }
  }

  async logout(): Promise<void> {
    this.token = null;
    await storage.removeItem('auth_token');
    await storage.removeItem('user_data');
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const token = await this.getToken();
      if (!token) return null;

      const response = await axios.get(`${API_BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      return response.data;
    } catch (error) {
      await this.logout(); // Clear invalid token
      return null;
    }
  }

  async getToken(): Promise<string | null> {
    if (this.token) return this.token;
    
    try {
      const token = await storage.getItem('auth_token');
      this.token = token;
      return token;
    } catch (error) {
      return null;
    }
  }

  async getStoredUser(): Promise<User | null> {
    try {
      const userDataStr = await storage.getItem('user_data');
      return userDataStr ? JSON.parse(userDataStr) : null;
    } catch (error) {
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  // Helper method to get headers with auth token
  async getAuthHeaders(): Promise<{ Authorization: string } | {}> {
    const token = await this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

export default new AuthController();