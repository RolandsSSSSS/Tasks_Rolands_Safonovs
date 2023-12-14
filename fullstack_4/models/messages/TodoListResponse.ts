import {Todo} from "../Todo";

export interface TodoListResponse {
    is_success: boolean,
    todos: Todo[],
}