import {DbUser} from "./DbUser";

export interface DbHabit
{
    habit_id: number;
    user_id: number;
    label: string;
    is_deleted: boolean;
    created: Date;

    user?: DbUser;
}