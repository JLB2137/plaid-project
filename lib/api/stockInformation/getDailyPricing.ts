export async function getDailyPricingClient(ticker:string,timePeriod:string,interval:string){
    try {
        const request = await fetch('/api/stock-data',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            method: 'pricing',
            ticker: ticker,
            range: timePeriod, //should be replaced w 1y
            interval: interval //should be replaced w 1d etc
          })
        })
  
        const response = await request.json()
  
        //console.log('resp',response)
  
        return response
  
      }catch(error){
        console.log(error)
      }
}

export async function getCompanyFinancialsClient(ticker:string){
  try {
      const request = await fetch('/api/stock-data',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method: 'financials',
          ticker: ticker,
        })
      })

      const response = await request.json()

      //console.log('resp',response)

      return response

    }catch(error){
      console.log(error)
    }
}