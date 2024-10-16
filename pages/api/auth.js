// pages/api/user/[id].js
export default function handler(req, res) {   
    
    let {method,headers,bodys} = req  

    bodys = 'Testings'
    method = 'GET'
    const envFile = process.env.client_id

  
    if (method === 'GET') {
        const data = [{ id: 1, name: 'Apple' }, { id: 2, name: 'Banana' }];
        console.log(`${envFile}`)
        const auth = async (req,res) => {
            //creates the public token
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

                let res = await public_token.json()

                console.log('res0',res)

                

                console.log('pub',public_token)
                //public token exchange
                const access_token = await fetch(`https://${process.env.env_url}/item/public_token/exchange`,{
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "client_id": `${process.env.client_id}`,
                        "secret": `${process.env.environment_secret}`,
                        "public_token": `${res.public_token}`
                      })
                  }
                )
                
                res = await access_token.json()
                console.log('access',res)

                const retrieved_balance = await fetch(`https://${process.env.env_url}/auth/get`,{
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "client_id": `${process.env.client_id}`,
                        "secret": `${process.env.environment_secret}`,
                        "access_token": `${res.access_token}`
                      })
                  })
                
                res = await retrieved_balance.json()
                console.log('retr',res)
            }

            catch(error) {
                console.log(error)
            }
            
        }
        auth()
        res.status(200).json('tested');
    
      // Handle POST request
    } else if (method === 'POST') {
        const { name } = req.body; // Assuming you send a JSON body like { name: 'Mango' }
        if (name) {
            res.status(201).json({ message: `Created new fruit: ${name}` });
        } else {
            res.status(400).json({ error: 'Name is required' });
        }

    // Handle PUT request
    } else if (method === 'PUT') {
        res.status(200).json({ message: 'Updating a resource' });

    // Handle DELETE request
    } else if (method === 'DELETE') {
        res.status(200).json({ message: 'Deleting a resource' });

    // If the method is unsupported, return 405
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  }
  