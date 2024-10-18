import { NextApiRequest } from "next";

export interface AccessTokenExchange {
    req: {} | null;
    res: {
        public_token: string;
        request_id: string;
    }
}

export interface CreatePublicToken {
    req: {} | null;
    res: {
        access_token: string;
        item_id: string;
        request_id: string;
    }
}

export interface CreateLinkToken {
    req: {} | null;
    res: {
        expiration: string;
        link_token: string;
        request_id: string;
    }
}

export interface LinkToken {
    expiration: string | null;
    link_token: string;
    request_id: string | null;
}
