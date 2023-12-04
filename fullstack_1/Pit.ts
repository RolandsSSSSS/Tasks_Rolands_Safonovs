import Item from './Item';
import Position from './Position';

class Pit extends Item {
    constructor(position: Position) {
        super(position);
    }

    static isDeadly(): boolean {
        return true;
    }
}

export default Pit;