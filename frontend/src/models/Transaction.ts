export enum TransactionType {
  DEBIT = "debit",
  CREDIT = "credit", 
  PIX_SENT = "pix_sent",
  PIX_RECEIVED = "pix_received",
  BILL_PAYMENT = "bill_payment",
  TRANSFER = "transfer",
  MOBILE_TOPUP = "mobile_topup",
  INVESTMENT = "investment",
  LOAN_PAYMENT = "loan_payment"
}

export enum TransactionCategory {
  FOOD = "food",
  TRANSPORT = "transport",
  SHOPPING = "shopping",
  ENTERTAINMENT = "entertainment",
  BILLS = "bills",
  HEALTH = "health",
  EDUCATION = "education",
  INVESTMENT = "investment",
  TRANSFER = "transfer",
  OTHER = "other"
}

export interface Transaction {
  id: string;
  transaction_type: TransactionType;
  category: TransactionCategory;
  amount: number;
  description: string;
  merchant_name?: string;
  recipient_name?: string;
  transaction_date: string;
  status: string;
  balance_after?: number;
}

export interface CreateTransaction {
  transaction_type: TransactionType;
  category?: TransactionCategory;
  amount: number;
  description: string;
  merchant_name?: string;
  pix_key?: string;
  recipient_name?: string;
  receipt_image?: string;
}

export interface PixPayment {
  pix_key: string;
  amount: number;
  description: string;
  recipient_name: string;
}

export interface TransactionAnalytics {
  total_income: number;
  total_expenses: number;
  monthly_spending: Array<{month: string; amount: number}>;
  category_breakdown: Array<{category: string; amount: number}>;
  top_merchants: Array<{merchant: string; amount: number}>;
}