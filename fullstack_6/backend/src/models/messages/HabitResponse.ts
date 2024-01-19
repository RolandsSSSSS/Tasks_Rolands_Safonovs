import {habit} from '../db/habit';
export interface HabitResponse {
    is_success: boolean;
    habits: habit[];
}
