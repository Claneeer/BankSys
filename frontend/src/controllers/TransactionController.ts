import axios from 'axios';
import AuthController from './AuthController';
import { 
  Transaction, CreateTransaction, PixPayment, 
  TransactionAnalytics, TransactionType, TransactionCategory 
} from '../models/Transaction';

const API_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

class TransactionController {
  async createTransaction(transactionData: CreateTransaction): Promise<Transaction> {
    try {
      const headers = await AuthController.getAuthHeaders();
      const response = await axios.post(`${API_BASE_URL}/api/transactions/`, transactionData, { headers });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to create transaction');
    }
  }

  async getTransactions(
    limit: number = 50, 
    skip: number = 0,
    category?: TransactionCategory,
    transactionType?: TransactionType
  ): Promise<Transaction[]> {
    try {
      const headers = await AuthController.getAuthHeaders();
      const params: any = { limit, skip };
      if (category) params.category = category;
      if (transactionType) params.transaction_type = transactionType;
      
      const response = await axios.get(`${API_BASE_URL}/api/transactions/`, { 
        headers, 
        params 
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to get transactions');
    }
  }

  async sendPix(pixData: PixPayment): Promise<Transaction> {
    try {
      const headers = await AuthController.getAuthHeaders();
      const response = await axios.post(`${API_BASE_URL}/api/transactions/pix`, pixData, { headers });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to send PIX');
    }
  }

  async getAnalytics(months: number = 6): Promise<TransactionAnalytics> {
    try {
      const headers = await AuthController.getAuthHeaders();
      const response = await axios.get(`${API_BASE_URL}/api/transactions/analytics`, { 
        headers,
        params: { months }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to get analytics');
    }
  }

  async seedSampleData(): Promise<{ message: string }> {
    try {
      const headers = await AuthController.getAuthHeaders();
      const response = await axios.post(`${API_BASE_URL}/api/transactions/seed-data`, {}, { headers });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to seed data');
    }
  }
}

export default new TransactionController();