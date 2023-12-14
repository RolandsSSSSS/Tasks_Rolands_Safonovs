export interface UserRegisterResponse {
    is_success: boolean,
    confirmationUrl?: string,
    error?: string
}