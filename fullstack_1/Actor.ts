import Position from './Position';
import EnumMoveDirection from './EnumMoveDirection';

class Actor {
    protected _position: Position;

    constructor(position: Position) {
        this._position = position;
    }

    getPosition(): Position {
        return this._position;
    }

    setPosition(newPosition: Position): void {
        this._position = newPosition;
    }

    move(direction: EnumMoveDirection): void {
        switch (direction) {
            case EnumMoveDirection.UP:
                this._position.y -= 1;
                break;
            case EnumMoveDirection.DOWN:
                this._position.y += 1;
                break;
            case EnumMoveDirection.LEFT:
                this._position.x -= 1;
                break;
            case EnumMoveDirection.RIGHT:
                this._position.x += 1;
                break;
        }
    }
}

export default Actor;