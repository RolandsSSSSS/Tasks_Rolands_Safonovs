import Item from './Item';
import Position from './Position';

class Gold extends Item {
    constructor(position: Position) {
        super(position);
    }

    static isVictory() {
        return true;
    }
}

export default Gold;