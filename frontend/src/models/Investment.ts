export enum InvestmentType {
  CRYPTOCURRENCY = "cryptocurrency",
  CDB = "cdb",
  STOCKS = "stocks",
  MUTUAL_FUND = "mutual_fund"
}

export interface Investment {
  id: string;
  investment_type: InvestmentType;
  asset_name: string;
  symbol?: string;
  quantity: number;
  purchase_price: number;
  current_price: number;
  current_value: number;
  profit_loss: number;
  profit_loss_percentage: number;
  purchase_date: string;
}

export interface CreateInvestment {
  investment_type: InvestmentType;
  asset_name: string;
  symbol?: string;
  quantity: number;
  purchase_price: number;
}

export interface PortfolioSummary {
  total_invested: number;
  current_value: number;
  total_profit_loss: number;
  total_profit_loss_percentage: number;
  investments_by_type: Array<{
    type: string;
    invested: number;
    current_value: number;
    count: number;
    profit_loss: number;
    profit_loss_percentage: number;
  }>;
}

export interface CryptoCurrency {
  symbol: string;
  name: string;
  current_price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap: number;
  volume_24h: number;
}

export interface CDBOption {
  id: string;
  name: string;
  bank_name: string;
  interest_rate: number;
  minimum_investment: number;
  maturity_months: number;
  type: string;
  description: string;
}