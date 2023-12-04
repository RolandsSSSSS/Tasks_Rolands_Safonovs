import Actor from './Actor';
import Position from './Position';
import EnumMoveDirection from './EnumMoveDirection';

class Agent extends Actor {
    constructor(position: Position) {
        super(position);
    }

    move(direction: EnumMoveDirection): void {
        super.move(direction);
    }
}

export default Agent;