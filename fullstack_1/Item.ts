import Position from './Position';

class Item {
    protected _position: Position;

    constructor(position: Position) {
        this._position = position;
    }

    getPosition(): Position {
        return this._position;
    }

    static isDeadly(): boolean {
        return false;
    }

    static isVictory(): boolean {
        return false;
    }
}

export default Item;