import { CellObjectModel } from '../progress-model/cell-object-model';
import { CellModel } from '../progress-model/cell-model';
import { ICollectFalling } from '../interfaces';

export class FallingController {
    private cells: CellModel[];
    private cellsXY: CellModel[][];
    private countX: number;
    private countY: number;

    constructor(countX: number, countY: number, cells: CellModel[], cellsXY: CellModel[][]) {
        this.countX = countX;
        this.countY = countY;
        this.cells = cells;
        this.cellsXY = cellsXY;
    }

    /**
     * 
     * @param gameField - to check what is falling, examples: fish , key in water
     * @param updateNum 
     * @param dx 
     * @param dy 
     * @param exceptionType 
     */
    public findObjectsToFall(gameField: ICollectFalling, updateNum: number, dx: number, dy: number, exceptionType: string = null): boolean {
        let isFalling = false;
        let cellIsFalling: boolean
        for (const cell of this.cells) {
            const fallingObject: CellObjectModel = cell.guestAbleToFall;
            if (fallingObject && fallingObject.type !== exceptionType) {
                const cellToFallIn = this.getDownCellStartingWith(cell.xi + dx, cell.yi + dy, (dx === 0? true : false));
                
                // treat group in tryMoveObject() via group leader
                if (fallingObject.isGroupLeader 
                    || (!fallingObject.isInGroup && cellToFallIn)) {

                    cellIsFalling = this.tryMoveObject(fallingObject, cellToFallIn, updateNum);
                    
                    // check if key or collectable is falling into water
                    if (cellIsFalling) {
                        gameField.checkWhatIsFalling(fallingObject, cellToFallIn);
                    }

                    isFalling = cellIsFalling || isFalling;
                }
            }
        }
        return isFalling;
    }

    // --- ---
    // added as of 'brothers'
    private tryMoveObject(fallingObject: CellObjectModel, cellToFallIn: CellModel, updateNum: number): boolean {
        if(fallingObject.isInGroup) {
            if (!fallingObject.isGroupLeader) {
                return; // treat as a group at once
            }
            
            const brothers: CellObjectModel[] = fallingObject.brothers;

            // original code: cell is able to fallDown only vertically and one cell (no side falling and falling through gaps?)
            const cb1: CellModel = brothers[2].cell as CellModel;
            const cb2: CellModel = brothers[3].cell as CellModel;
            
            if (cb1 === null || cb2 === null || brothers[0].cell === null || brothers[1].cell === null) {
                console.log(' __ERROR__ [falling-controller].tryMoveObject() for brothers');
                let debug = 1; // Might be whether their view life circle come to an end earlier?
                
                for (const brother of brothers) {
                    if (brother.cell === null) {
                        console.log('  ERROR  [falling-controller].tryMoveObject() brother with null cell: ' + brother.toString());
                        debug = 2;
                    } else {
                        console.log('  ERROR  [falling-controller].tryMoveObject() brother with cell: ' + brother.toString() + ', cell: ' + brother.cell.toString());
                        debug = 3;
                    }
                }
                debug = 4;
                return;
            }

            if (cb1 && cb2 
                && cb1.yi < this.countY - 1 
                && this.cellsXY[cb1.yi + 1][cb1.xi].isAvailableToFallIn
                && this.cellsXY[cb2.yi + 1][cb2.xi].isAvailableToFallIn) {

                    // for (const brother of brothers) {
                    for (let i = brothers.length - 1; i >= 0; i--) { // start from end as it will not be able to add guest with the same  alias
                        const brother: CellObjectModel = brothers[i];
                        this.moveObjectTo(brother, this.cellsXY[brother.cell.yi + 1][brother.cell.xi]);
                    }
                    return true;
            } 
        } else {
            if (cellToFallIn) {
            // console.log(updateNum + ' [falling-controller].tryMoveObject() from:', fallingObject.cell.toString(), ', to:', cellToFallIn.toString());
            this.moveObjectTo(fallingObject, cellToFallIn);
                return true;
            }
        }
        return false;
    }
    
    /** Fall */
    private moveObjectTo(fallingObject: CellObjectModel, cellToFallIn: CellModel): void {
        fallingObject.cell.removeGuestPlus(fallingObject);

        cellToFallIn.addGuest(fallingObject, false); //so it will take time to get into position -- animation
        
        // as per flash game:
        fallingObject.updateMoveToTarget();
    }

    /** find cell to fall to. */
    private getDownCellStartingWith(xi: number, yi: number, isVertical: boolean): CellModel {
        let cellTo: CellModel = this.getCellModel(xi, yi);

        // if there is a gap in field
        while (isVertical && cellTo && !cellTo.isInsideField) {
            cellTo = this.getCellModel(xi, ++yi);
        }

        return (cellTo && cellTo.isAvailableToFallIn? cellTo : null);
    }

    private getCellModel(xi: number, yi: number):CellModel {
        if (xi >= 0 && xi < this.countX && yi >= 0 && yi < this.countY) {
            return this.cellsXY[yi][xi];
        }
        return null;
    }

    public cleanup(): void {
        this.cells = null;
        this.cellsXY = null;
    }
}