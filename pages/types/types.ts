import { ObjectId } from "mongodb";

export interface UserData {
    _id: ObjectId;
    user_id: string;
    access_tokens: string[];
}

export interface UserCheck {
    encryptedUserID: string;
    newUser: boolean;
}
