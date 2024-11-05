import { ObjectId } from "mongodb";

export interface UserData {
    _id: ObjectId;
    user_id: string;
    access_tokens: string[];
}

export interface UserCheck {
    encryptedUserID: string;
    newUser: boolean;
}

// Account Type
export type InvestmentAccount = {
    account_id: string;
    balances: {
      available?: number;
      current: number;
      iso_currency_code?: string;
      limit?: number;
      unofficial_currency_code?: string;
    };
    mask?: string;
    name: string;
    official_name?: string;
    subtype: string; // e.g., '401k', 'brokerage'
    type: string; // e.g., 'investment'
  };
  
  // Holding Type
  export type InvestmentHolding = {
    account_id: string;
    security_id: string;
    quantity: number;
    institution_value: number;
    institution_price: number;
    cost_basis?: number;
    iso_currency_code?: string;
    unofficial_currency_code?: string;
  };
  
  // Security Type
  export type InvestmentSecurity = {
    security_id: string;
    isin?: string;
    cusip?: string;
    sedol?: string;
    ticker_symbol?: string;
    name: string;
    type: string; // e.g., 'stock', 'mutual fund'
    close_price?: number;
    close_price_as_of?: string;
    iso_currency_code?: string;
    unofficial_currency_code?: string;
    institution_id?: string;
    institution_security_id?: string;
  };
  
  // Main Investment Holdings Response Type
  export type InvestmentHoldingsResponse = {
    accounts: InvestmentAccount[];
    holdings: InvestmentHolding[];
    securities: InvestmentSecurity[];
  };
  
