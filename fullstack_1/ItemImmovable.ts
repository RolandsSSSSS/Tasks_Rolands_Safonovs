import Item from './Item';
import Position from './Position';

class ItemImmovable extends Item {
    constructor(position: Position) {
        super(position);
    }

    static isTemporary(): boolean {
        return true;
    }
}

export default ItemImmovable;