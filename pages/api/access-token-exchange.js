// pages/api/user/[id].js
export default async function handler(req, res) {
       let public_token = req.public_token
    try {
        const access_token = await fetch(`https://${process.env.env_url}/item/public_token/exchange`,{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "client_id": `${process.env.client_id}`,
                "secret": `${process.env.environment_secret}`,
                "public_token": `${public_token}`
              })
          }
        )

        let result = await access_token.json()
        return result
    }
        
    catch(error){
        console.log(error)
    }

}