// pages/api/user/[id].js

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  let access_token = req.body.access_token;
  try {
    const retrieved_balance = await fetch(
      `https://${process.env.env_url}/auth/get`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: `${process.env.client_id}`,
          secret: `${process.env.environment_secret}`,
          access_token: `${access_token}`,
        }),
      }
    );

    let result = await retrieved_balance.json();

    return result;
  } catch (error) {
    console.log(error);
  }
}
