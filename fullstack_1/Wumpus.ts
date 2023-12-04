import Actor from './Actor';
import Position from './Position';
import EnumMoveDirection from './EnumMoveDirection';

class Wumpus extends Actor {
    constructor(position: Position) {
        super(position);
    }

    static isDeadly(): boolean {
        return true;
    }

    move(): void {
        const directions = Object.values(EnumMoveDirection);
        const randomDirection = directions[Math.floor(Math.random() * directions.length)];
        super.move(randomDirection);
    }

    getPosition(): Position {
        return super.getPosition();
    }
}

export default Wumpus;