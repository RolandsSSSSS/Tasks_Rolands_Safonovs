import {DbUser} from "./DbUser";

export interface DbSession
{
    device_uuid: string;
    session_id: number;
    is_valid: boolean;
    user_id: number;
    token: string;

    user?: DbUser;
}