import { User } from "firebase/auth";

export async function getInvestmentsCache(user:User){

    try {
      const request = await fetch('/api/retreive-cache',{
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          jlbInvestmentsId: user,
          method: 'getInvestments'
        })
      })

      const response = await request.json()

      //setup to display holdings

      //the zero here needs to be adjusted for multiple account tokens where the tokens are greater than 1 account
      //console.log('returned investment accounts',response)
      return response

      

    } catch (error) {
      console.error("Error retreiving investment data from the interal cache API:", error);
    }
    
}