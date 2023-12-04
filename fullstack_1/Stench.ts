import ItemImmovable from './ItemImmovable';
import Position from './Position';

class Stench extends ItemImmovable {
    constructor(position: Position) {
        super(position);
    }
}

export default Stench;