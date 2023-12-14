export interface TodoUpdateRequest {
    session_token: string,
    todo_id: number,
    task: string
}