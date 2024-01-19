import {Body, Post, Route} from "tsoa";
import {update} from "lodash";
import {HabitRequest} from "../models/messages/HabitRequest";
import {HabitResponse} from "../models/messages/HabitResponse";
import {UserLoginResponse} from "../models/messages/UserLoginResponse";


@Route("habits")
export class ControllerHabits {

    @Post('update')
    public async update(@Body() request: HabitRequest): Promise<HabitResponse> {
        let result = {
            is_success: false,
            habits: [],
        } as HabitResponse;

        console.log('update habits');
        console.log(request);

        return result;

    }
}
