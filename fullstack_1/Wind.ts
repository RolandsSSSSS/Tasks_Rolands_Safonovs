import ItemImmovable from './ItemImmovable';
import Position from './Position';

class Wind extends ItemImmovable {
    constructor(position: Position) {
        super(position);
    }
}

export default Wind;