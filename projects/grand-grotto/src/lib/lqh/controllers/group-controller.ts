
import { CellObjectModel } from '../progress-model/cell-object-model';
import { CellModel } from '../progress-model/cell-model';

/** 'Treasure' controller - group of four becomes one big diamond */
export class GroupController {
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

    public makeGroupOfFour():void {
        for(let i = 0; i < this.countX-1; i++) {
            for(let j = 0; j < this.countY-1; j++) {

                const startCell: CellModel = this.cellsXY[j][i];
                const elem: CellObjectModel = startCell.getCheckNoPowerUps();
                 
                if(elem) {
                    const color: number = elem.color;
                    const rightElem: CellObjectModel = this.cellsXY[j][i+1].getCheckNoPowerUps();
                    const botElem: CellObjectModel = this.cellsXY[j+1][i].getCheckNoPowerUps();
                    const rightBotElem: CellObjectModel = this.cellsXY[j+1][i+1].getCheckNoPowerUps();
                     
                    if(!elem.hasBrothers
                        && rightElem && rightElem.color === color && !rightElem.hasBrothers
                        && botElem && botElem.color === color && !botElem.hasBrothers
                        && rightBotElem && rightBotElem.color === color && !rightBotElem.hasBrothers) {
                            this.craftCube(elem, rightElem, rightBotElem, botElem);
                    }
                }
            }
        }
    }

    /** put brothers in cell-model OR cell-object-model? */
    private craftCube(e1: CellObjectModel, e2: CellObjectModel, e3: CellObjectModel, e4: CellObjectModel):void {
        e1.isGroupLeader = true;
        e1.isInGroup = true;
        e2.isInGroup = true;
        e3.isInGroup = true;
        e4.isInGroup = true;

        this.addBrothers(e1, e1, e2, e3, e4);
        this.addBrothers(e2, e1, e2, e3, e4);
        this.addBrothers(e3, e1, e2, e3, e4);
        this.addBrothers(e4, e1, e2, e3, e4);

        e1.scaleFactor = 2;
        e1.setScale(e1.scale * e1.scaleFactor, true); // e1.scaleX = e1.scaleY *= 2;
        e2.setVisible(false); e3.setVisible(false); e4.setVisible(false); // e2.visible = e3.visible = e4.visible = false;
        e1.applyPosition(); // e1.changedPosition = true; // 
    }

    private addBrothers(target: CellObjectModel, e1: CellObjectModel, e2: CellObjectModel, e3: CellObjectModel, e4: CellObjectModel):void {
        target.addBrother(e1);
        target.addBrother(e2);
        target.addBrother(e3);
        target.addBrother(e4);
    } 

    public cleanup(): void {
        this.cells = null;
        this.cellsXY = null;
    }
}