export interface Account {
  id: string;
  account_number: string;
  account_type: string;
  balance: number;
  available_balance: number;
  credit_limit?: number;
}

export interface CreditCard {
  id: string;
  card_number: string;
  card_name: string;
  credit_limit: number;
  available_limit: number;
  current_balance: number;
  due_date: string;
  minimum_payment: number;
}

export interface AccountBalance {
  balance: number;
  available_balance: number;
  account_number: string;
}