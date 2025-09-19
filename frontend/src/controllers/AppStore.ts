import { create } from 'zustand';
import { User } from '../models/User';
import { AccountBalance, CreditCard } from '../models/Account';
import { Transaction } from '../models/Transaction';
import AuthController from './AuthController';
import AccountController from './AccountController';
import TransactionController from './TransactionController';

interface AppState {
  // Auth state
  isAuthenticated: boolean;
  user: User | null;
  authLoading: boolean;
  
  // Account state
  balance: AccountBalance | null;
  creditCards: CreditCard[];
  
  // Transaction state
  transactions: Transaction[];
  transactionsLoading: boolean;
  
  // UI state
  showBalance: boolean;
  
  // Actions
  login: (cpf: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  refreshCreditCards: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
  toggleBalanceVisibility: () => void;
  createTransaction: (transactionData: any) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  isAuthenticated: false,
  user: null,
  authLoading: true,
  balance: null,
  creditCards: [],
  transactions: [],
  transactionsLoading: false,
  showBalance: true,
  
  // Actions
  login: async (cpf: string, password: string) => {
    try {
      set({ authLoading: true });
      const authResponse = await AuthController.login({ cpf, password });
      set({ 
        isAuthenticated: true, 
        user: authResponse.user,
        authLoading: false 
      });
      
      // Load user data after login
      await get().refreshBalance();
      await get().refreshCreditCards();
      await get().refreshTransactions();
    } catch (error) {
      set({ authLoading: false });
      throw error;
    }
  },
  
  logout: async () => {
    await AuthController.logout();
    set({
      isAuthenticated: false,
      user: null,
      balance: null,
      creditCards: [],
      transactions: [],
      authLoading: false
    });
  },
  
  initializeAuth: async () => {
    try {
      set({ authLoading: true });
      const isAuth = await AuthController.isAuthenticated();
      
      if (isAuth) {
        const user = await AuthController.getStoredUser();
        set({ 
          isAuthenticated: true, 
          user,
          authLoading: false 
        });
        
        // Load user data
        await get().refreshBalance();
        await get().refreshCreditCards();
        await get().refreshTransactions();
      } else {
        set({ authLoading: false });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ 
        isAuthenticated: false,
        user: null,
        authLoading: false 
      });
    }
  },
  
  refreshBalance: async () => {
    try {
      const balance = await AccountController.getAccountBalance();
      set({ balance });
    } catch (error) {
      console.error('Failed to refresh balance:', error);
    }
  },
  
  refreshCreditCards: async () => {
    try {
      const creditCards = await AccountController.getCreditCards();
      set({ creditCards });
    } catch (error) {
      console.error('Failed to refresh credit cards:', error);
    }
  },
  
  refreshTransactions: async () => {
    try {
      set({ transactionsLoading: true });
      const transactions = await TransactionController.getTransactions(20, 0);
      set({ transactions, transactionsLoading: false });
    } catch (error) {
      console.error('Failed to refresh transactions:', error);
      set({ transactionsLoading: false });
    }
  },
  
  toggleBalanceVisibility: () => {
    set((state) => ({ showBalance: !state.showBalance }));
  },
  
  createTransaction: async (transactionData: any) => {
    try {
      await TransactionController.createTransaction(transactionData);
      // Refresh data after creating transaction
      await get().refreshBalance();
      await get().refreshTransactions();
    } catch (error) {
      throw error;
    }
  }
}));