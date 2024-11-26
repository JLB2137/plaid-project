import { ConsolidatedSecurityHoldings, SecurityHoldings} from "../../../types/types"
//matches holdings to their corresponding securities and
//organizes them based on which account holds them 
export default function consolidatedSecurityHoldings(securityHoldingsByInstitution: SecurityHoldings[][]) {
        
        let securitiesDict: { [key: string]: ConsolidatedSecurityHoldings } = {};
        //iterate through all institutions and their holdings in double loop
        for(let i=0; i<securityHoldingsByInstitution.length;i++){
          for(let j=0;j<securityHoldingsByInstitution[i].length;j++){
            if(securitiesDict[securityHoldingsByInstitution[i][j].security_id] && securitiesDict[securityHoldingsByInstitution[i][j].security_id].cost_basis){
              //adjust cost basis to new avg price using //quantity+quantity=>
              //quantity1/total*price + quantity2/total*price
              const newCostBasis = securityHoldingsByInstitution[i][j].cost_basis! + securitiesDict[securityHoldingsByInstitution[i][j].security_id].cost_basis!
              const newQuantity = securitiesDict[securityHoldingsByInstitution[i][j].security_id].quantity + securityHoldingsByInstitution[i][j].quantity
              securitiesDict[securityHoldingsByInstitution[i][j].security_id].cost_basis = newCostBasis
              securitiesDict[securityHoldingsByInstitution[i][j].security_id].quantity = newQuantity
            }else{
              securitiesDict[securityHoldingsByInstitution[i][j].security_id] = securityHoldingsByInstitution[i][j]
            }
          }
        }

        return securitiesDict
}
