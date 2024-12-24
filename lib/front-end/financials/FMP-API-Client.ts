//needs to be converted into a class structure

export async function clientPricing(ticker:string){
  
    try {
      const request = await fetch('/api/stock-data',{
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          method: 'pricing',
          ticker: ticker,
          startDate: '2021-04-10', //should be adjusted
          endDate: '2024-04-10', //should be adjusted
        })
      })
      const response = await request.json()
      console.log('response client side',response)
      return response
    } catch (error) {
      console.error("Error Accessing Client API for Pricing", error);
    }
};

export async function clientIncome(ticker:string){
  
    try {
      const request = await fetch('/api/stock-data',{
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
            method: 'income',
            ticker: ticker,
        })
      })
      const response = await request.json()
      return response
    } catch (error) {
      console.error("Error Accessing Client API for Income", error);
    }
};

export async function clientBalance(ticker:string){
  
    try {
      const request = await fetch('/api/stock-data',{
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
            method: 'balance',
            ticker: ticker,
        })
      })
      const response = await request.json()
      return response
    } catch (error) {
      console.error("Error Accessing Client API for Balances", error);
    }
};

export async function clientCashflow(ticker:string){
  
    try {
      const request = await fetch('/api/stock-data',{
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
            method: 'balance',
            ticker: ticker,
        })
      })

      const response = await request.json()
      return response
    } catch (error) {
      console.error("Error Accessing Client API for Cashflow", error);
    }
};