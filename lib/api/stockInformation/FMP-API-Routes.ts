export const pricing = async (ticker: string, fromDate:string, toDate:string, APIKEY:string) => {
    //dates are formated as such YYYY-MM-DD
    const request = await fetch(
      `https://financialmodelingprep.com/api/v3/historical-price-full/${ticker}?from=${fromDate}&to=${toDate}&apikey=${APIKEY}`,
      {
        method: "GET",
      }
    );

    const response = await request.json()
  
    return response
};

export const cashflow = async (ticker: string, APIKEY:string) => {
    const request = await fetch(
      `https://financialmodelingprep.com/api/v3/cash-flow-statement/${ticker}?period=annual&apikey=${APIKEY}`,
      {
        method: "GET",
      }
    );

    const response = await request.json();
  
    return response
};





export const income = async (ticker: string, APIKEY:string) => {
    const request = await fetch(
        `https://financialmodelingprep.com/api/v3/income-statement/${ticker}?period=annual&apikey=${APIKEY}`,
        {
        method: "GET",
        }
    );

    const response = request.json();
  
    return response
};


export const balance = async (ticker: string, APIKEY:string) => {
    const request = await fetch(
        `https://financialmodelingprep.com/api/v3/balance-sheet-statement/${ticker}?period=annual&apikey=${APIKEY}`,
        {
        method: "GET",
        }
    );

    const response = await request.json();
  
    return response
};
