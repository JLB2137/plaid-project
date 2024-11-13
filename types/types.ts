import { ObjectId } from "mongodb";

export interface AppContextProps {
  signInStatus: string;
  setSignInStatus: (status:string) => void;
}

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

  export type InvestmentHoldingsApiResponse = {
    holdings: InvestmentHoldingsResponse[]
    message: string
  };

  export type UserAccounts = {
      id: string
      name: string
      mask: string
      type: string
      subtype: string
      verification_status: string
  }

  export type AccountInformationSchema = {
    user_id: string;
    accounts: UserAccounts[]
  }

  export type InvestmentAccounts = {
      institution: string;
      access_token: string
      account_ids: string[]
  }

export interface GetBalancesResponse {
  accounts: Account[];
  item: BalanceItem;
  request_id: string;
}

export interface Balances {
  available: number | null;
  current: number;
  iso_currency_code: string | null;
  unofficial_currency_code: string | null;
  limit?: number | null; // For credit accounts, this may contain the account's limit
}

export interface AccountBase {
  account_id: string;
  balances: Balances;
  mask: string | null;
  name: string;
  official_name: string | null;
  subtype: string; // E.g., "checking", "savings", "credit card", etc.
  type: string; // E.g., "depository", "credit", "loan", etc.
}

export interface Account extends AccountBase {
  account_id: string;
  balances: {
    available: number | null;
    current: number;
    iso_currency_code: string | null;
    unofficial_currency_code: string | null;
    limit?: number | null; // For credit accounts, may contain the account's limit
  };
  mask: string | null;
  name: string;
  official_name: string | null;
  subtype: string;
  type: string;
}

export interface BalanceItem {
  // Represents information about the Plaid Item associated with the response
  item_id: string;
  institution_id: string | null;
  webhook: string | null;
  error: null | Error;
  // Other item fields as needed
}

  
