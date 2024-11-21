import ''
const securityHoldingsMatch = () => {
    if(!investments){
        return (
          <div>
            <p>Loading...</p>
          </div>
        )
      }
      else{
        const securities: { [x: string]: { name?: string; ticker?:string; closePrice?: number; costBasis?: number; quantity?: number}; } = {}
        for(let k = 0;k<investments!.holdings.length;k++){
          
          let accounts = investments!.holdings[k]
          if(accounts!.securities){
            console.log('accounts',accounts)
            for(let i=0; i<accounts!.securities.length;i++){
              //console.log('accounts',accounts.securities[i])
              securities[`${accounts!.securities[i].security_id}`] = {
                name: accounts!.securities[i].name,
                ticker: accounts!.securities[i].ticker_symbol!,
                closePrice: accounts!.securities[i].close_price!
        
              }
            }
            for(let i=0; i<accounts!.holdings.length;i++){
              //console.log('here',securities[`${accounts!.holdings[i].security_id}`])
              //console.log('here2',accounts!.holdings[i].cost_basis)
              securities[`${accounts!.holdings[i].security_id}`].costBasis = accounts!.holdings[i].cost_basis
              securities[`${accounts!.holdings[i].security_id}`].quantity = accounts!.holdings[i].quantity
            }
          }
  
        }
}