export async function getDailyPricing(ticker:string,timePeriod:string,interval:string){
    try {
        const request = await fetch('/api/stock-data',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ticker: ticker,
            range: timePeriod, //should be replaced w 1y etc
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