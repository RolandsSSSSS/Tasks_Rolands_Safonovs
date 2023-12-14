export interface User {
    user_id: number,
    username: string,
    password: string,
    email: string,
    is_confirmed: boolean,
    confirmation_uuid: string,
    session_token: string
}