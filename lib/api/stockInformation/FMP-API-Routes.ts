export const historicalPricing = async (ticker: string, APIKEY:string, fromDate:string, toDate:string) => {
    //dates are formated as such YYYY-MM-DD
    const request = await fetch(
      `https://financialmodelingprep.com/api/v3/historical-price-full/AAPL?from=${fromDate}&to=${toDate}&apikey=${APIKEY}`,
      {
        method: "GET",
      }
    );

    const response = request.json();
  
    return response
};

export const historicalCashFlow = async (ticker: string, APIKEY:string) => {
    const request = await fetch(
      `https://financialmodelingprep.com/api/v3/cash-flow-statement/${ticker}?period=annual&apikey=${APIKEY}`,
      {
        method: "GET",
      }
    );

    const response = request.json();
  
    return response
};





export const historicalIncomeStatements = async (ticker: string, APIKEY:string) => {
    const request = await fetch(
        `https://financialmodelingprep.com/api/v3/income-statement/${ticker}?period=annual&apikey=${APIKEY}`,
        {
        method: "GET",
        }
    );

    const response = request.json();
  
    return response
};


export const historicalBalanceStatements = async (ticker: string, APIKEY:string) => {
    const request = await fetch(
        `https://financialmodelingprep.com/api/v3/balance-sheet-statement/${ticker}?period=annual&apikey=${APIKEY}`,
        {
        method: "GET",
        }
    );

    const response = request.json();
  
    return response
};
