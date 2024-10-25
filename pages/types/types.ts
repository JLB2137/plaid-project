import { NextApiRequest } from "next";

export interface UserData {
    user_id: string
    access_tokens: [string]
}
