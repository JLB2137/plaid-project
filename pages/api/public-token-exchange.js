// pages/api/user/[id].js
export default async function handler(req, res) {   
        try {
            const public_token =  await fetch(`https://${process.env.env_url}/sandbox/public_token/create`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "client_id": `${process.env.client_id}`,
                    "secret": `${process.env.environment_secret}`,
                    "institution_id": "ins_20",
                    "initial_products": ["auth"],
                    "options": {
                        "webhook": "https://www.genericwebhookurl.com/webhook"
                    }
                })
                }
            )

            let result = await public_token.json()

            console.log('resultofPublic Token',result)

            res.status(200).json({ public_token: result });
        }
            
        catch(error){
            console.log(error)
        }

}