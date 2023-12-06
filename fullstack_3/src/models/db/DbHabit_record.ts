import {DbHabit} from "./DbHabit";

export interface DbHabit_record
{
    habit_record_id: number;
    habit_id: number;
    created: Date;

    habit?: DbHabit
}