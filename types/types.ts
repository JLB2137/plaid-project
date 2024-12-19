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
  export type Holding = {
    account_id: string;
    security_id: string;
    institution_price: number;
    institution_price_as_of: string | null; // Format: date
    institution_price_datetime: string | null; // Format: ISO 8601 date-time
    institution_value: number;
    cost_basis: number | null;
    quantity: number;
    iso_currency_code: string | null; // ISO-4217 currency code
    unofficial_currency_code: string | null; // Unofficial currency code
    vested_quantity: number | null;
    vested_value: number | null;
  };

  export type SecurityHoldings = Security & Holding

  export type ConsolidatedSecurityHoldings = Security & {
    cost_basis: number | null;
    quantity: number;
    vested_quantity: number | null;
    vested_value: number | null;
  }
  
  export type Holdings = Holding[];
  
  
  // Security Type
  export type Security = {
      security_id: string; // A unique, Plaid-specific identifier for the security.
      isin?: string | null; // 12-character ISIN, globally unique securities identifier.
      cusip?: string | null; // 9-character CUSIP, North American securities identifier.
      sedol?: string | null; // 7-character SEDOL, UK securities identifier.
      institution_security_id?: string | null; // Identifier given to the security by the institution.
      institution_id?: string | null; // Plaid institution_id associated with institution_security_id.
      proxy_security_id?: string | null; // ID of another security resembling this one.
      name?: string | null; // A descriptive name for the security.
      ticker_symbol?: string | null; // Trading symbol or short identifier.
      is_cash_equivalent?: boolean | null; // Indicates if the security is treated as cash.
      type?: 
        | "cash"
        | "cryptocurrency"
        | "derivative"
        | "equity"
        | "etf"
        | "fixed income"
        | "loan"
        | "mutual fund"
        | "other"
        | null; // Type of security.
      close_price?: number | null; // Price at the close of the previous trading session.
      close_price_as_of?: string | null; // Date for which close_price is accurate (format: date).
      update_datetime?: string | null; // Date and time close_price is accurate (format: date-time).
      iso_currency_code?: string | null; // ISO-4217 currency code of the price.
      unofficial_currency_code?: string | null; // Unofficial currency code (e.g., cryptocurrencies).
      market_identifier_code?: string | null; // ISO-10383 Market Identifier Code.
      sector?: string | null; // Sector classification of the security.
      industry?: string | null; // Industry classification of the security.
      option_contract?: {
        contract_type: "put" | "call"; // Type of option contract.
        expiration_date: string; // Expiration date of the contract (format: date).
        strike_price: number; // Strike price of the contract.
        underlying_security_ticker: string; // Ticker of the underlying security.
      } | null; // Details about the option security.
    };
    
  
  // Main Investment Holdings Response Type
  export type InvestmentHoldingsResponse = {
    error_code?: any;
    accounts: InvestmentAccount[];
    holdings: Holding[];
    securities: Security[];
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

export interface ChartData {
  chart: {
    result: {
      meta: {
        currency: string;
        symbol: string;
        exchangeName: string;
        fullExchangeName: string;
        instrumentType: string;
        firstTradeDate: number;
        regularMarketTime: number;
        hasPrePostMarketData: boolean;
        gmtoffset: number;
        timezone: string;
        exchangeTimezoneName: string;
        regularMarketPrice: number;
        fiftyTwoWeekHigh: number;
        fiftyTwoWeekLow: number;
        regularMarketDayHigh: number;
        regularMarketDayLow: number;
        regularMarketVolume: number;
        longName: string;
        shortName: string;
        chartPreviousClose: number;
        previousClose: number;
        scale: number;
        priceHint: number;
        currentTradingPeriod: {
          pre: TradingPeriod;
          regular: TradingPeriod;
          post: TradingPeriod;
        };
        tradingPeriods: {
          pre: TradingPeriod[][];
          regular: TradingPeriod[][];
          post: TradingPeriod[][];
        };
        dataGranularity: string;
        range: string;
        validRanges: string[];
      };
      timestamp: number[];
      indicators: {
        quote: {
          low: number[];
          close: number[];
          open: number[];
          high: number[];
          volume: number[];
        }[];
      };
    }[];
    error: null | string;
  };
}

export interface TradingPeriod {
  timezone: string;
  start: number;
  end: number;
  gmtoffset: number;
}

export interface PricingErrorResponse {
  error: boolean;
  message: {
    chart: {
      result: null;
      error: {
        code: string;
        description: string;
      };
    };
  };
}



  
