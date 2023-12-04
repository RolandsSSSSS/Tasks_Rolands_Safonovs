import Agent from './Agent';
import Gold from './Gold';
import Pit from './Pit';
import Wumpus from './Wumpus';
import Position from './Position';
import EnumMoveDirection from './EnumMoveDirection';
import readline from 'readline';

class Game {
    private _player: Agent = new Agent({x: 0, y: 0});
    private _gold: Gold = new Gold({x: 1, y: 1});
    private _pits: Pit[] = [];
    private _wumpus: Wumpus = new Wumpus({x: 3, y: 3});
    private _mapSize!: Position;
    private _rl: readline.Interface;
    private _discoveredMap: boolean[][] = [];

    constructor(size: Position) {
        this._mapSize = size;
        this._rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
    }

    newGame(): void {
        this.initializeDiscoveredMap();
        const playerPos = this.getRandomPosition();

        this._pits = [];

        let goldPos: Position;
        let wumpusPos: Position;

        // parliecinieties, ka zelts neuzspawno uz speletaja, Wumpus vai bedrem
        do {
            goldPos = this.getRandomPosition();
        } while (this.isPitAtPosition(goldPos) || this.isWumpusAtPosition(goldPos) || this.arePositionsEqual(playerPos, goldPos));

        // parliecinieties, ka Wumpus neuzspawnojas uz speletaja, zelta vai bedrem
        do {
            wumpusPos = this.getRandomPosition();
        } while (
            this.isPitAtPosition(wumpusPos) ||
            this.isWumpusAtPosition(wumpusPos) ||
            this.arePositionsEqual(playerPos, wumpusPos) ||
            this.arePositionsEqual(goldPos, wumpusPos)
            );

        for (let i = 0; i < 3; i++) {
            let pitPos: Position;

            // parliecinieties, ka bedre neuzspawnojas uz speletaja, zelta, Wumpus vai citam bedrem
            do {
                pitPos = this.getRandomPosition();
            } while (
                this.isPitAtPosition(pitPos) ||
                this.isWumpusAtPosition(pitPos) ||
                this.arePositionsEqual(playerPos, pitPos) ||
                this.arePositionsEqual(goldPos, pitPos) ||
                this.arePositionsEqual(wumpusPos, pitPos) ||
                this._pits.some((pit) => this.arePositionsEqual(pit.getPosition(), pitPos))
                );

            const newPit = new Pit(pitPos);
            this._pits.push(newPit);
        }

        this._player = new Agent(playerPos);
        this._gold = new Gold(goldPos);
        this._wumpus = new Wumpus(wumpusPos);
    }

    movePlayer(direction: EnumMoveDirection): void {
        const newPosition = this.calculateNewPosition(this._player.getPosition(), direction);

        if (this.isValidPosition(newPosition)) {
            this._player.move(direction);
            this.updateGame();
        } else {
            console.log("You can't go out of the map!");
        }
    }

    promptUser(): void {
        this._rl.question('Enter move (u/d/l/r/n/q): ', (answer) => {
            switch (answer.toLowerCase()) {
                case 'u':
                    this.movePlayer(EnumMoveDirection.UP);
                    break;
                case 'd':
                    this.movePlayer(EnumMoveDirection.DOWN);
                    break;
                case 'l':
                    this.movePlayer(EnumMoveDirection.LEFT);
                    break;
                case 'r':
                    this.movePlayer(EnumMoveDirection.RIGHT);
                    break;
                case 'n':
                    this.newGame();
                    this.drawGame();
                    break;
                case 'q':
                    console.log('Quitting the game.');
                    this._rl.close();
                    break;
                default:
                    console.log('Invalid move. Please enter u, d, l, r, n, or q.');
                    break;
            }

            if (!this.isGameOver()) {
                this.promptUser();
            } else {
                console.log('Game Over!');
                this._rl.close();
            }
        });
    }

    calculateNewPosition(currentPos: Position, direction: EnumMoveDirection): Position {
        switch (direction) {
            case 'UP':
                return {x: currentPos.x, y: currentPos.y - 1};
            case 'DOWN':
                return {x: currentPos.x, y: currentPos.y + 1};
            case 'LEFT':
                return {x: currentPos.x - 1, y: currentPos.y};
            case 'RIGHT':
                return {x: currentPos.x + 1, y: currentPos.y};
            default:
                return currentPos;
        }
    }

    isValidPosition(pos: Position): boolean {
        return pos.x >= 0 && pos.x < this._mapSize.x && pos.y >= 0 && pos.y < this._mapSize.y;
    }

    drawGame(): void {
        console.log('Game state:');

        for (let y = 0; y < this._mapSize.y; y++) {
            let row = '';
            for (let x = 0; x < this._mapSize.x; x++) {
                let cellContent = '';

                if (!this._discoveredMap[x][y]) {
                    cellContent = '?'; // raada ja suna nav atklaata
                } else {
                    // ja suna atklata tad rada vienu no sekojosiem:
                    cellContent =
                        this._player.getPosition().x === x && this._player.getPosition().y === y
                            ? 'P'
                            : this._gold.getPosition().x === x && this._gold.getPosition().y === y
                                ? 'G'
                                : this.isPitAtPosition({x, y})
                                    ? 'O'
                                    : this._wumpus.getPosition().x === x && this._wumpus.getPosition().y === y
                                        ? 'W'
                                        : '.';
                }

                row += cellContent + ' ';
            }

            console.log(row);
        }
    }

    // private moveWumpus(): void {
    //     this._wumpus.move();
    // }

    private arePositionsEqual(pos1: Position, pos2: Position): boolean {
        return pos1.x === pos2.x && pos1.y === pos2.y;
    }

    private isWumpusAtPosition(pos: Position): boolean {
        return this.arePositionsEqual(this._wumpus.getPosition(), pos);
    }

    private updateGame(): void {
        //this.moveWumpus();
        this.updateDiscoveredMap();
        this.drawGame();
        this.checkGameState();
        this.checkAdjacentFields();
    }

    private checkAdjacentFields(): void {
        const playerPos = this._player.getPosition();
        const stench = this.isStench(playerPos);
        const wind = this.isWind(playerPos);

        console.log(`Is stench: ${stench}`);
        console.log(`Is wind: ${wind}`);
    }

    private initializeDiscoveredMap(): void {
        this._discoveredMap = [];

        for (let x = 0; x < this._mapSize.x; x++) {
            this._discoveredMap[x] = [];

            for (let y = 0; y < this._mapSize.y; y++) {
                this._discoveredMap[x][y] = false;
            }
        }
    }

    private updateDiscoveredMap(): void {
        const playerPos = this._player.getPosition();

        // atklaaj speletaja pasreizejo poziciju
        this._discoveredMap[playerPos.x][playerPos.y] = true;

        // atklaj laukumus apkart uz katru pusi pa 1, ja tie nav jau atklati
        const adjacentPositions: Position[] = [
            {x: playerPos.x - 1, y: playerPos.y},
            {x: playerPos.x + 1, y: playerPos.y},
            {x: playerPos.x, y: playerPos.y - 1},
            {x: playerPos.x, y: playerPos.y + 1},
        ];

        for (const pos of adjacentPositions) {
            if (this.isValidPosition(pos) && !this._discoveredMap[pos.x][pos.y]) {
                this._discoveredMap[pos.x][pos.y] = true;
            }
        }
    }

    private isStench(playerPos: Position): boolean {
        return (
            this.isAdjacent(playerPos, this._wumpus.getPosition()) ||
            this.isAdjacent(playerPos, this.calculateNewPosition(this._wumpus.getPosition(), <EnumMoveDirection>'up')) ||
            this.isAdjacent(playerPos, this.calculateNewPosition(this._wumpus.getPosition(), <EnumMoveDirection>'down')) ||
            this.isAdjacent(playerPos, this.calculateNewPosition(this._wumpus.getPosition(), <EnumMoveDirection>'left')) ||
            this.isAdjacent(playerPos, this.calculateNewPosition(this._wumpus.getPosition(), <EnumMoveDirection>'right'))
        );
    }

    private isWind(playerPos: Position): boolean {
        return this._pits.some((pit) => this.isAdjacent(playerPos, pit.getPosition()));
    }

    private isAdjacent(pos1: Position, pos2: Position): boolean {
        return (
            Math.abs(pos1.x - pos2.x) <= 1 &&
            Math.abs(pos1.y - pos2.y) <= 1 &&
            (pos1.x === pos2.x || pos1.y === pos2.y)
        );
    }

    private getRandomPosition(): Position {
        return {
            x: Math.floor(Math.random() * this._mapSize.x),
            y: Math.floor(Math.random() * this._mapSize.y),
        };
    }

    private checkGameState(): void {
        const playerPos = this._player.getPosition();

        // paarbauda, vai speletaajs ir uz zelta
        const isOnGold = this._gold.getPosition().x === playerPos.x && this._gold.getPosition().y === playerPos.y;

        // paarbauda, vai speletaajs ir uz kadas no bedrem
        const isOnPit = this._pits.some((pit) => pit.getPosition().x === playerPos.x && pit.getPosition().y === playerPos.y);

        // paarbauda, vai speletaajs ir uz wumpus
        const isOnWumpus = this._wumpus.getPosition().x === playerPos.x && this._wumpus.getPosition().y === playerPos.y;

        // parbauda uzvaras un zaudejuma nosacijumus
        if (isOnGold) {
            console.log('Congrats! You found the gold. You win!');
            this.newGame();
        } else if (isOnPit) {
            console.log('Oh noo! You fell into the pit. Game over!');
            this.newGame();
        } else if (isOnWumpus) {
            console.log('Oh noo! You found Wumpus. Game over!');
            this.newGame();
        }
    }

    private isPitAtPosition(pos: Position): boolean {
        return this._pits.some((pit) => pit.getPosition().x === pos.x && pit.getPosition().y === pos.y);
    }

    private isGameOver(): boolean {
        const playerPos = this._player.getPosition();

        // paarbauda, vai speletaajs ir uz kaadas no bedreem
        const isOnPit = this._pits.some((pit) => pit.getPosition().x === playerPos.x && pit.getPosition().y === playerPos.y);

        // paarbauda, vai speletaajs ir uz wumpus
        const isOnWumpus = this._wumpus.getPosition().x === playerPos.x && this._wumpus.getPosition().y === playerPos.y;

        // atgriez ja speletajs ir uzkapis uz pit vai wumpus
        return isOnPit || isOnWumpus;
    }
}
// izveidot game ar izveloto kartes lielumu
const game = new Game({x: 4, y: 4});

// sakt speli
game.promptUser();
