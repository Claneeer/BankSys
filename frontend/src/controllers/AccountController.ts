import axios from 'axios';
import AuthController from './AuthController';
import { Account, CreditCard, AccountBalance } from '../models/Account';

const API_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

class AccountController {
  async getAccountBalance(): Promise<AccountBalance> {
    try {
      const headers = await AuthController.getAuthHeaders();
      const response = await axios.get(`${API_BASE_URL}/api/accounts/balance`, { headers });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to get account balance');
    }
  }

  async getCreditCards(): Promise<CreditCard[]> {
    try {
      const headers = await AuthController.getAuthHeaders();
      const response = await axios.get(`${API_BASE_URL}/api/accounts/credit-cards`, { headers });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to get credit cards');
    }
  }

  async updateBalance(amount: number, operation: 'add' | 'subtract'): Promise<{ new_balance: number }> {
    try {
      const headers = await AuthController.getAuthHeaders();
      const response = await axios.post(`${API_BASE_URL}/api/accounts/update-balance`, 
        { amount, operation }, 
        { headers }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to update balance');
    }
  }
}

export default new AccountController();