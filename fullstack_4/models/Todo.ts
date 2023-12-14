import {User} from "./User";

export interface Todo {
    todo_id: number,
    task: string,
    user_id: number,
    updated: string,
    is_deleted: boolean

    user?: User;
}