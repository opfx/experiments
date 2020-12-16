import { CellModel } from './cell-model';
import { Point } from 'pixi.js';
import { BaseModel } from './base-model';
import { GamePlay, ObjectState, Alias } from '../interfaces';
import { MatchingController } from '../controllers/matching-controller';
import { CellObjectModel } from './cell-object-model';
import { FallingController } from '../controllers/falling-controller';
import { MoveToTargetController } from '../controllers/move-to-target-controller';
import { ReshuflleController } from '../controllers/reshuflle-controller';
import { GroupController } from '../controllers/group-controller';
import { ShakeController } from '../controllers/shake-controller';
import { Config } from '../config';
import { PathFindingController } from '../controllers/path-finding-controller';

export class FieldModel extends BaseModel {

    public gamePlay: GamePlay;

    public cells: CellModel[] = [];
    public cellsXY: CellModel[][] = [];
    protected notFinishedTypes: string[] = [];

    protected matchingController: MatchingController;
    protected fallingController: FallingController;
    protected moveToTargetController: MoveToTargetController;
    protected reshuflleController: ReshuflleController;
    protected groupController: GroupController;
    protected shakeController: ShakeController;
    protected pathFindingController: PathFindingController;
 
    public countX: number;
    public countY: number;
    public width: number;
    public height: number;
    public cellW: number;
    public cellH: number;

    constructor(gamePlay: GamePlay, countX: number, countY: number, width: number, height: number) {
        super();
        this.type = 'field-model';

        this.gamePlay = gamePlay;
        this.shakeController = new ShakeController();
        this.matchingController = new MatchingController(this.cells, this.cellsXY, this.shakeController);
        this.fallingController = new FallingController(countX, countY, this.cells, this.cellsXY);
        this.moveToTargetController = new MoveToTargetController(this.cells, this.cellsXY);
        this.reshuflleController = new ReshuflleController(this.cells, this.cellsXY, this.matchingController);
        this.groupController = new GroupController(countX, countY, this.cells, this.cellsXY);
        this.pathFindingController = new PathFindingController(this.cells);

        this.shakeController.setTarget(this);
        this.shakeController.setShakeDuration(50);

        this.countX = countX;
        this.countY = countY;

        this.width = width;
        this.height = height;

        Config.cellH = this.cellW = width / countX;
        Config.cellW = this.cellH = height / countY;
    }

    /** init field */
    public init(): void {
        let xi: number, yi: number;
        for (yi = 0; yi < this.countY; yi++) {
            if (!this.cellsXY[yi]) {
                this.cellsXY[yi] = [];
            }
            for (xi = 0; xi < this.countX; xi++) {
                this.addCellModelAt(xi, yi);
            }
        }
    }

    public initData(tempLayout: string[][], allowedToAutoFill: boolean = true):void {
        for (const cell of this.cells) {
            cell.initData(tempLayout[cell.yi][cell.xi], allowedToAutoFill);
        }
    }

    /**
     * Might be overriden. 
     * first update all models, than - all views 
     */
    public update(): void {
        for (const cell of this.cells) { cell.update();}
    }

    /** Override */
    public checkWhatIsFalling(fallingObject: CellObjectModel, cellToFallIn: CellModel): void {}

    /** add CellModel, you may override */
    private addCellModelAt(xi: number, yi: number): void {
        const cellModel: CellModel = this.getInstanceOfCellModel(xi, yi);
        cellModel.init();

        this.cells.push(cellModel);
        this.cellsXY[cellModel.yi][cellModel.xi] = cellModel;
               
        if (xi > 0) {
            this.cellsXY[yi][xi].assignLeft(this.cellsXY[yi][xi - 1]);
        }
        if (yi > 0) {
            this.cellsXY[yi][xi].assignTop(this.cellsXY[yi - 1][xi]);
        }
    }
    
    /** override */
    public getInstanceOfCellModel(xi: number, yi: number): CellModel {
        return null; //new CellModel(xi, yi, this.cellW, this.cellH);
    }

    /** override in game-field-view */
    protected setCellsAndObjects(cellModel: CellModel, tempLayout: string):void {}

    // --- ---
    /** listeners CELL_DOWN & CELL_UP */
    public onPointer(type: string, localX: number, localY: number): void { 
        this.gamePlay.executeFieldAction(type, this.getCellByPoint(localX, localY), null, 0);
    }
    
    /** get cell under coordinates */
    private getCellByPoint(x: number, y: number): CellModel {
        const xi: number = Math.min(this.cellsXY[0].length, Math.min(this.countX -1, Math.max(0, x/this.cellW)));
        const yi: number = Math.min(this.cellsXY.length, Math.min(this.countY -1, Math.max(0, y/this.cellH)));

        return this.cellsXY[Math.floor(yi)][Math.floor(xi)];
    }

    // --- ---
    public clearCellModel(cell:CellModel):void {
        cell.clearGuests();
    }

    // --- ---
    /** Get CellModel under mouse point */
    public getCellModelByPoint(p: Point): CellModel {
        const xi:number = Math.min(this.cellsXY[0].length, this.countX -1, Math.max(0, p.x/this.cellW));
        const yi:number = Math.min(this.cellsXY.length, this.countY -1, Math.max(0, p.y/this.cellH));
        return this.cellsXY[yi][xi];
    }

    public getCellModel(xi: number, yi: number):CellModel {
        if (xi >= 0 && xi < this.countX && yi >= 0 && yi < this.countY) {
            return this.cellsXY[yi][xi];
        }
        return null;
    }

    // --- ---
    public findMatchedColors(cell: CellModel): CellModel[] {
        return this.matchingController.findMatchedColors(cell);
    }

    /** 1)  triggers bonus-1: 'add all of color' to matched cells 
     *  2). triggers bonus-2: 'add all of color on line in front of me' + 'damage any blocks on my way'
     */
    public activateBonusesInMatchedCells(matchedCells: CellModel[]): CellModel[] {
        return this.matchingController.activateBonusesInMatchedCells(matchedCells);
    }
    
    /** call it here as of point's count rules */
    public activatedMatchedCells(matchedCells: CellModel[], damagedBlockCells: CellModel[]): void {
        for (const cell of matchedCells) {
            cell.changeState(); // activate, kill, damage
        }
        for (const cell of damagedBlockCells) {
            cell.changeState(); // damage block cells - they are around matched cells!
        }
    }

    /** For changing fields: If all action, triggered by state change, finished? */
    public get isAllChangesFinalized(): boolean {
        this.isChangingState = false;
        for (const cell of this.cells) {
            this.isChangingState = this.isChangingState || cell.isAllChangesFinalized;
        }
        return this.isChangingState;
    }

    /** For debugging: Overriden in cell-model and field-model - where there are guests and cells */
    public addNotFinishedType(): void {
        this.notFinishedTypes.length = 0;
        for (const cell of this.cells) {
            cell.addNotFinishedType(this.notFinishedTypes);
        }
    }

    // ---
    public focusScaleGuests(cells: CellModel[], alias: string, scaleFactor: number): void {
        for (const cell of cells) {
            cell.focusScaleGuests(alias, scaleFactor);
        }
    }

    //
    /** Collect OR release animal */
    public collectIn(cell: CellModel): CellObjectModel {
        const guest: CellObjectModel = cell.getGuestByAlias(Alias.ALIAS_2_COLLECTABLES)
        if (guest) {
            guest.changeState(ObjectState.COLLECTED);
            return guest;
        }
        return null;
    }

    /** Shake field on elimination group - big brother Treasury 2x2 cube */
    public shake(): void {
        this.shakeController.shake();
    }

    // --- ---
    public get widthNoBorder(): number { return this.cellW * this.countX;}
    public get heghtNoBorder(): number { return this.cellH * this.countY;}
    public get middleHeghtNoBorder(): number { return this.cellH * this.countY / 2;} // might be overriden in trans-field

    // --- ---
    public cleanup(): void {
        if (this.matchingController) {
            this.shakeController.cleanup();
            this.matchingController.cleanup();
            this.fallingController.cleanup();
            this.moveToTargetController.cleanup();
            this.reshuflleController.cleanup();
            this.groupController.cleanup();
            this.pathFindingController.cleanup();

            this.matchingController = null;
            this.fallingController = null;
            this.moveToTargetController = null;
            this.reshuflleController = null;
            this.groupController = null;
            this.pathFindingController = null;
        }
    }
}