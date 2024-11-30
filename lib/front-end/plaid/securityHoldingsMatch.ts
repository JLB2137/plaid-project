import { Holding, Security, SecurityHoldings} from "../../../types/types"
//matches holdings to their corresponding securities and
//organizes them based on which account holds them 
export default function securityHoldingsMatch(holdings: Holding[],securities: Security[]) {
        let securityHoldings: SecurityHoldings[] = []
        //bring in holdings
        //bring in securities

        let securityDict: { [key: string]: Security } = {};

        for(let i=0;i<securities.length;i++){
          securityDict[securities[i].security_id] = securities[i]
        }

        for(let i=0;i<holdings.length;i++){
          securityHoldings.push({...holdings[i],...securityDict[holdings[i].security_id]})
        }

        return securityHoldings
}
