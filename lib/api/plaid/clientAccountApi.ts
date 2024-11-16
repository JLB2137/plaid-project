import { User } from "firebase/auth";

export async function getBalances(user:User){

    try {
      const request = await fetch('/api/plaid-account-data',{
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          jlbInvestmentsId: user,
          method: 'getBalance'
        })
      })

      const response = await request.json()

      
      return response

    } catch (error) {
      console.error("Error exchanging public token:", error);
    }
    
}

export async function getInvestmentHoldings(user:User){

    try {
      const request = await fetch('/api/plaid-account-data',{
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          jlbInvestmentsId: user,
          method: 'getInvestmentHoldings'
        })
      })

      const response = await request.json()

      //setup to display holdings

      //the zero here needs to be adjusted for multiple account tokens where the tokens are greater than 1 account
      //console.log('returned investment accounts',response)
      return response

      

    } catch (error) {
      console.error("Error exchanging public token:", error);
    }
    
}

export async function deleteAccount(user:User){
    //the accountID to delete will need to be passed and no longer be static
    try {
      const request = await fetch('/api/plaid-account-data',{
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          jlbInvestmentsId: user,
          method: 'deleteAccount',
          accountID: "QxwLZbjjrAcVv4a13VqPT4EM7B8lKxtGoe7KE"
        })
      })

      const response = await request.json()

      //setup to display holdings

      //the zero here needs to be adjusted for multiple account tokens where the tokens are greater than 1 account
      
      console.log('deleted account response',response)

    } catch (error) {
      console.error("error deleting account:", error);
    }
    
}

  