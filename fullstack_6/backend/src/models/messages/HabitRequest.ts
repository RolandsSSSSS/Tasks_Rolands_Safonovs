import {habit} from '../db/habit';
export interface HabitRequest {
    session_token: string;
    habits: habit[];
    modified: number;
}
