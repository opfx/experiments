import { CellModel } from '../progress-model/cell-model';
import { GameConfig } from '../../data/game-config';
import { ShakeController } from './shake-controller';
import { CellObjectModel, CellObjectDirectionBounds } from '../progress-model/cell-object-model';
import { SoundController } from './sound-controller';
import { Powerups, Neighbor } from '../interfaces';

export class MatchingController {
    private cells: CellModel[] = [];
    private cellsXY: CellModel[][] = [];

    private searchQueue: CellModel[] = [];
    private selectedCells: CellModel[] = [];
    private damagedBlockCells: CellModel[] = [];
    private maxLengthSelectedCells: CellModel[] = [];
    private sortedCells: CellModel[] = [];
    public matchedLength2Sets: CellModel[] = [];

    public shakeController: ShakeController;

    private countX;

    constructor(cells: CellModel[], cellsXY: CellModel[][], shakeController: ShakeController) {
        this.cells = cells;
        this.cellsXY = cellsXY;
        this.shakeController = shakeController;
    }

    // --- ---
    public findMatchedColors(cell0: CellModel): CellModel[] {
        this.selectedCells.length = 0;
        this.searchQueue.length = 0;

        // const search: DfsBfs = DfsBfs.getInstance();
        let cell: CellModel;
        for (cell of this.cells) { 
            cell.visited = false;
        }

        this.searchQueue.push(cell0); // simple BFS
        cell0.visited = true;

        while (this.searchQueue.length > 0) {
            cell = this.searchQueue.pop();
            this.selectedCells.push(cell);

            for (const neighbour of cell.getNeighbours()) {
                const neighbourCell = neighbour as CellModel;
                
                if (neighbourCell && !neighbourCell.visited && cell.isMatching(neighbourCell)) {
                    this.searchQueue.push(neighbourCell);
                    neighbourCell.visited = true;
                   
                }
            }
        }

        return this.selectedCells;
    }

    /** Get only close neighbours of different color */
    public getCloseNeighboursOfDifferentColor(cell: CellModel): CellModel[] {
        this.selectedCells.length = 0;
        
        const neighbours: Neighbor[]= cell.getNeighbours()
        for (const neighbour of neighbours) {
            const neighbourCell = neighbour as CellModel;
            
            if (neighbourCell && !cell.isMatching(neighbourCell)) {
                this.selectedCells.push(neighbourCell);             
            }
        }
        return this.selectedCells;
    }

    /** Find biggest combination - use to 'bless' OR to 'shuffle' if none */
    public findBiggestMatchedSet(ifSearchForMatchedSets2: boolean = false): CellModel[] {
        this.maxLengthSelectedCells.length = 0;
        this.selectedCells.length = 0;
        this.searchQueue.length = 0;
        this.matchedLength2Sets.length = 0;

        // const search: DfsBfs = DfsBfs.getInstance();
        let cell: CellModel;
        for (cell of this.cells) {
            if (!cell.isInsideField 
                || cell.color === -1
            ) {
                cell.visited = true;
            } else {
                cell.visited = false;
            }
        }

        for (const cell0 of this.cells) {
            if (cell0.visited) {
                continue;
            }

            this.searchQueue.push(cell0); // simple BFS
            cell0.visited = true;
            this.selectedCells.length = 0;

            // find set of one color starting with cell0 and matching it's color
            while (this.searchQueue.length > 0) {
                cell = this.searchQueue.pop();
                this.selectedCells.push(cell);
    
                for (const neighbour of cell.getNeighbours()) {
                    const neighbourCell = neighbour as CellModel;
                    
                    if (neighbourCell && !neighbourCell.visited && cell.isMatching(neighbourCell)) {
                        this.searchQueue.push(neighbourCell);
                        neighbourCell.visited = true;
                       
                    }
                }
            }

            // if search for all sets of 2
            if (ifSearchForMatchedSets2 && this.selectedCells.length === 2) {
                const ii = this.matchedLength2Sets.length;
                this.matchedLength2Sets.push(this.selectedCells[0]);
                this.matchedLength2Sets.push(this.selectedCells[1]);
                // + as it was in original: + one in reversed order
                this.matchedLength2Sets.push(this.selectedCells[1]);
                this.matchedLength2Sets.push(this.selectedCells[0]);
                // console.log('[matching-controller].findBiggestMatchedSet() ' + this.selectedCells[0].toString());
                // console.log('[matching-controller].findBiggestMatchedSet() ' + this.selectedCells[1].toString());
                // console.log('[matching-controller].findBiggestMatchedSet() ' + this.selectedCells[1].toString());
                // console.log('[matching-controller].findBiggestMatchedSet() ' + this.selectedCells[0].toString());
            }

            // if found bigger - move over
            if (this.selectedCells.length > this.maxLengthSelectedCells.length) {
                this.maxLengthSelectedCells.length = 0;
                while (this.selectedCells.length > 0) {
                    this.maxLengthSelectedCells.push(this.selectedCells.pop());
                }
            }
        }

        console.log('[matching-controller] --- this.maxLengthSelectedCells.length: ' + this.maxLengthSelectedCells.length);
        return this.sortOnIndex(this.maxLengthSelectedCells);
    }

    private sortOnIndex(cellSet: CellModel[]): CellModel[] {
        this.countX = this.cellsXY[0].length;
        this.sortedCells.length = 0;

        let j: number, i: number, indexUnsorted: number;
        const jmax: number = cellSet.length;
        for (j = 0; j <jmax; j++) {
            indexUnsorted = this.getCellIndex(cellSet[j]);

            // imax = this.sortedCells.length;
            for (i = 0; i < j; i++) {
                if (indexUnsorted < this.getCellIndex(this.sortedCells[i])) {
                    break;
                }
            }

            this.sortedCells.splice(i, 0, cellSet[j]);
        }

        return this.sortedCells;
    }

    private getCellIndex(cell: CellModel): number {
        return cell.xi + cell.yi * this.countX;
    }

    /** Add additional tiles.
     *  1)  triggers bonus-1: 'add all of color' to matched cells 
     *  2). triggers bonus-2: 'add all of color on line in front of me' + 'damage any blocks on my way'
     */
    public activateBonusesInMatchedCells(matchedCells: CellModel[]): CellModel[] {
        this.damagedBlockCells.length = 0;
        let isUsedPowerUpOfAllColor = false;
        let powerupCellObject : CellObjectModel;

        for (const cell of matchedCells) {
        
            // blocks around
            for (const neighbour of cell.getNeighbours()) {
                const neighbourCell = neighbour as CellModel;
                // if (neighbourCell.hasDestroyableBlock && this.damagedBlockCells.indexOf(neighbourCell) === -1) {
                if (neighbourCell.hasDestroyableBlock) { // add same damaged blocks twice
                    this.damagedBlockCells.push(neighbourCell);
                }
            }

            // direction bonuses
            powerupCellObject = cell.getPowerupGuestOfType(Powerups.POWERUP_DIRECTED);
            if (powerupCellObject) {
                this.shakeController.shake();

                const dirBounds : CellObjectDirectionBounds = powerupCellObject.getCellObjectDirectionBounds();
                this.addCellsOnPathOfRocket(cell, dirBounds.startX, dirBounds.endX, dirBounds.startY, dirBounds.endY, matchedCells, this.damagedBlockCells);
            }


            // all-color-matched bonuses
            if (!isUsedPowerUpOfAllColor && cell.hasPowerupOfType(Powerups.POWERUP_ALL_OF_COLOR)) {
                
                isUsedPowerUpOfAllColor = true;
                this.shakeController.shake();

                for (const tryCell of this.cells) {
                    if (tryCell.color === cell.color && matchedCells.indexOf(tryCell) === -1) {
                        matchedCells.push(tryCell);
                    }
                }
            }

            // sounds
            if (powerupCellObject) {
                SoundController.getInstance().playSound('rocket_fly');
                // if (isBonus) SoundController.getInstance().playSound('bonus_firecracker_activate');
            }
            if (isUsedPowerUpOfAllColor) {
                SoundController.getInstance().playSound('bomb_explode');
            }
        }

        return this.damagedBlockCells;
    }

    /** add  */
    private addCellsOnPathOfRocket(cell: CellModel, startX: number, endX: number, startY: number, endY: number, matchedCells: CellModel[], damagedBlockCells: CellModel[]): void {
        let yi: number, xi: number;
        for (yi = startY; yi < endY; yi++) {
            for (xi = startX; xi < endX; xi++) {
                const cellOnWay = this.getCellModelAt(xi, yi);
                // colors is on the way
                if (cellOnWay.color !== -1) {
                    if (matchedCells.indexOf(cellOnWay) === -1)
                    matchedCells.push(cellOnWay);

                // destroyable block is on the way
                // } else if (cellOnWay.hasDestroyableBlock && damagedBlockCells.indexOf(cellOnWay) === -1) {
                } else if (cellOnWay.hasDestroyableBlock) {
                    damagedBlockCells.push(cellOnWay);
                }
            }
        }
    }

    private getCellModelAt(xi: number, yi: number):CellModel {
        if (xi >= 0 && xi < GameConfig.countX && yi >= 0 && yi < GameConfig.countY) {
            return this.cellsXY[yi][xi];
        }
        return null;
    }

    public cleanup(): void {
        this.cells = null;
        this.cellsXY = null;
        this.shakeController = null;

        if (this.searchQueue !== null) {
            this.searchQueue.length = 0;
            this.selectedCells.length = 0;
            this.damagedBlockCells.length = 0;
            this.maxLengthSelectedCells.length = 0;
            this.sortedCells.length = 0;
            this.matchedLength2Sets.length = 0;
        }

        this.searchQueue = null;
        this.selectedCells = null;
        this.damagedBlockCells = null;
        this.maxLengthSelectedCells = null;
        this.sortedCells = null;
        this.matchedLength2Sets = null;
    }
}