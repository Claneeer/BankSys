import { create } from 'zustand';
import axios from 'axios';

interface Account {
  balance: number;
  available_balance: number;
  account_number: string;
}

interface CreditCard {
  id: string;
  card_number: string;
  card_name: string;
  credit_limit: number;
  available_limit: number;
  current_balance: number;
  due_date: string;
  minimum_payment: number;
}

interface Transaction {
  id: string;
  transaction_type: string;
  category: string;
  amount: number;
  description: string;
  merchant_name?: string;
  recipient_name?: string;
  transaction_date: string;
  status: string;
  balance_after?: number;
}

interface BankState {
  account: Account | null;
  creditCards: CreditCard[];
  transactions: Transaction[];
  isLoading: boolean;
  showBalance: boolean;
  
  // Actions
  fetchAccountData: () => Promise<void>;
  fetchCreditCards: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  createSampleData: () => Promise<void>;
  toggleBalanceVisibility: () => void;
  refreshAllData: () => Promise<void>;
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://bankplus-digital.preview.emergentagent.com';

export const useBankStore = create<BankState>((set, get) => ({
  account: null,
  creditCards: [],
  transactions: [],
  isLoading: false,
  showBalance: true,

  fetchAccountData: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/accounts/balance`);
      set({ account: response.data });
    } catch (error) {
      console.error('Error fetching account data:', error);
    }
  },

  fetchCreditCards: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/accounts/credit-cards`);
      set({ creditCards: response.data });
    } catch (error) {
      console.error('Error fetching credit cards:', error);
    }
  },

  fetchTransactions: async () => {
    try {
      set({ isLoading: true });
      const response = await axios.get(`${API_BASE_URL}/api/transactions/?limit=50`);
      set({ transactions: response.data, isLoading: false });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      set({ isLoading: false });
    }
  },

  createSampleData: async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/transactions/seed-data`);
      // Refresh all data after creating sample data
      await get().refreshAllData();
    } catch (error) {
      console.error('Error creating sample data:', error);
      throw new Error('Erro ao criar dados de exemplo');
    }
  },

  toggleBalanceVisibility: () => {
    set(state => ({ showBalance: !state.showBalance }));
  },

  refreshAllData: async () => {
    await Promise.all([
      get().fetchAccountData(),
      get().fetchCreditCards(),
      get().fetchTransactions(),
    ]);
  },
}));