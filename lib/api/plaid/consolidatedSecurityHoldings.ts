import { ConsolidatedSecurityHoldings, Holding, Security, SecurityHoldings} from "../../../types/types"
//matches holdings to their corresponding securities and
//organizes them based on which account holds them 
export default function consolidatedSecurityHoldings(securityHoldingsByInstitution: [SecurityHoldings[]]) {
        
      let consolidatedHoldings = []
        //bring in holdings
        //bring in securities

        let securityDict: { [key: string]: ConsolidatedSecurityHoldings } = {};

        for(let i=0; i<securityHoldingsByInstitution.length;i++){
          for(let j=0;j<securityHoldingsByInstitution[i].length;j++){
            if(securityDict[securityHoldingsByInstitution[i][j].security_id]){
              //adjust cost basis to new avg price using //quantity+quantity=>
              //quantity1/total*price + quantity2/total*price
            }
          }
        }

        for(let i=0;i<holdings.length;i++){
          securityHoldings.push({...holdings[i],...securityDict[holdings[i].security_id]})
        }

        return securityHoldings
}
