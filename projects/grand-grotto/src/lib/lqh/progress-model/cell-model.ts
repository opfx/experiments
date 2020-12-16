import { CellObjectModel } from './cell-object-model';
import { BaseModel } from './base-model';
import { Pool } from '../pool/pool';
import { Neighbor, Alias, LayerId } from '../interfaces';

const WHITE = 'white';
const GRAY = 'gray';
const BLACK = 'black';

export class CellModel extends BaseModel {
    // private static nextId2 = 0;

    // geometry
    public xi: number;
    public yi: number;
    public cellW: number;
    public cellH: number;

    // neighbor-relations
    public _left: CellModel;
    public _right: CellModel;
    public _top: CellModel;
    public _bottom: CellModel;
    // For DFS, BFS: id, traversed
    // public id2: number;
    public traversed: boolean;
    public neighbors: CellModel[];

    // guest names
    public collectableName: string;
    public baseName: string;
    public tenantName: string;
    public markName: string;
    // guest rotation
    public collectableRotation = 0;
    public baseRotation = 0;
    public tenantRotation = 0;
    public markRotation = 0;

    // list of guests
    // public guests: CellObjectModel[] = [];

    // selected
    public isSelected: boolean;
    // field shape my be not rectangular (it is just bound by rectangle))
    public isInsideField: boolean; // public isOutOfField: boolean; // data properties

    constructor (xi: number, yi: number, cellW: number, cellH : number) {
        super(); 
        
        this.xi = xi;
        this.yi = yi;

        this.cellW = cellW;
        this.cellH = cellH;

        // this.id2 = CellModel.nextId2++;

        this.x = xi * cellW
        this.y = yi * cellH

        this.startScale = 1;
        this.scale = 1;

        this.changedPosition = this.changedScale = true;
        this.changedRotation = true;
    }

    /** override */
    public initData(tempLayout: string, allowedToFill: boolean = true):void {}

    /** Initial creation of cell-0bject-models */
    public initCellObjectModels(): void {
        // console.info(this.toString(), 'initCellObjectModels()', this.baseName);
        this.addGuestByName(this.collectableName, Alias.ALIAS_2_COLLECTABLES, LayerId.LAYER_FOR_COLLECTABLES, this.collectableRotation);
        
        // ther is no liquid in the beginning
        // this.addGuestByName(this.baseName, Alias.ALIAS_3_LIQUID_BASE, LayerId.LAYER_FOR_LIQUID_BASE, this.baseRotation, 0);
        this.addGuestByName(this.baseName, Alias.ALIAS_3_BASE, LayerId.LAYER_FOR_BASES, this.baseRotation);
        this.addGuestByName(this.tenantName, Alias.ALIAS_4_MATCHING_COLORs, LayerId.LAYER_FOR_MATCHING_COLORs, this.tenantRotation);
        this.addGuestByName(this.markName, Alias.ALIAS_5_MARKS, LayerId.LAYER_FOR_MARKS, this.markRotation);
    }

    /** first update all models, than - all views */
    public update(): void {
        super.update();

        for (const cellObject of this.guests) { 
            cellObject.update();
        }
    }

    /** Override if needed */
    public get guestAbleToFall(): CellObjectModel { 
        return this.getGuestByAlias(Alias.ALIAS_4_MATCHING_COLORs);
    }
    public get isAvailableToFallIn(): boolean { return false;}
    public get isAvailableToGenerate(): boolean { return false;}

    /**
     * 
     * @param guestName 
     * @param rotation in radians
     * @param alias 
     */
    public addGuestByName(guestName: string, alias: string, layerId:string, rotation:number = 0, stateProgress: number = 1): CellObjectModel {
        if (guestName && !this.hasGuestOfAlias(alias)) {
            const cellObjectModel: CellObjectModel = Pool.takeOutCellObjectModel(guestName);

            cellObjectModel.setAliasAndName(layerId, alias, guestName, rotation, this.rotationId, stateProgress);

            this.addGuest(cellObjectModel);

            return cellObjectModel;
        }
        return null;
    }

    public addGuest(arg: BaseModel, instantPosition: boolean = true): boolean {
        const guest: CellObjectModel = arg as CellObjectModel;

        const index: number = this.guests.indexOf(arg);
        if (index === -1 && !this.hasGuestOfAlias(guest.getAlias())) {

            this.guests.push(arg);
            guest.setCellModel(this, instantPosition); // assign at once - in the init() OR with animation in falling

            if (arg.alias === Alias.ALIAS_4_MATCHING_COLORs) {
                this.color = arg.color;
            }
            return true;
        }
        return false;
    }

    /** or create a separate alis to lock, so key and lock have different alias */
    public addGuestWithoutCheck(arg: CellObjectModel, instantPosition: boolean = true): void {
        if (this.guests.indexOf(arg) === -1) {
            this.guests.push(arg); // it will be updated
            arg.setCellModel(this, instantPosition); // animation goes to Target
        }
    }

    /** remove to give to another cell' */
    public removeGuestPlus(guest: BaseModel, instantGuestSetToDestroy: boolean = false): void {
        const index: number = this.guests.indexOf(guest);
        if (index !== -1) {
            this.guests.splice(index, 1);
            (guest as CellObjectModel).cell = null;
            
            if (guest.type === this.baseName) { this.baseName = null;};
            if (guest.type === this.collectableName) { this.collectableName = null;};
            if (guest.type === this.tenantName) { 
                this.tenantName = null;
                this.color = -1;
            };
            if (guest.type === this.markName) { this.markName = null;};

            if (instantGuestSetToDestroy) {
                guest.setToDestroy();
            }
        }
    }

    /** remove to give to another cell' */
    public removeGuestToTransfer(guest: CellObjectModel): void {
        const index: number = this.guests.indexOf(guest);
        if (index !== -1) {
            this.guests.splice(index, 1);
        }
        // should add this:  
        // guest.cell = null; ?
    }
    
    public getGuestByName(arg: string): CellObjectModel {
        for (const guest of this.guests) {
            if (guest.type === arg) {
                return (guest as CellObjectModel);
            }
        }
        return null;
    }

    public getGuestByAlias(arg: string): CellObjectModel {
        for (const guest of this.guests) {
            if ((guest as CellObjectModel).getAlias() === arg) {
                return (guest as CellObjectModel);
            }
        }
        return null;
    }

    public hasGuestOfAlias(arg: string): boolean {
        return (this.getGuestByAlias(arg) !== null? true : false);
    }
    

    /** cell is in the list of matched.
     * override, might be not all guests need to change state. It called in activatedMatchedCells()
     * LIQUID is changing state from view
     */
    public changeState(state: string = null, frame: number = 0): void {
         for (const guest of this.guests) {
            if (guest.alias !== Alias.ALIAS_3_LIQUID_BASE) {
                guest.changeState(state, frame);
            }
        }
    }

    public changeStateForAlias(alias: string, state: string = null, frame: number = 0): void {
        for (const guest of this.guests) {
           if (guest.alias === alias) {
               guest.changeState(state, frame);
           }
       }
    }

    public get isAllChangesFinalized(): boolean {
        this.isChangingState = false;
        for (const guest of this.guests) {
            this.isChangingState = this.isChangingState || guest.isAllChangesFinalized;
        }
        return this.isChangingState;
    }

    /** Overriden in cell-model and field-model - where there are guests and cells */
    public addNotFinishedType(notFinishedTypes: string[]): void {
        for (const guest of this.guests) {
            guest.addNotFinishedType(notFinishedTypes);
        }
    }

    /** 1). is in  * /
    public triggerBase(): void {
        // guests.changeState();
    }*/

    // --- --- neighbors
    /** Assign two-directions links. */
    public assignLeft(arg: CellModel): void {
       this.left = arg;
       arg.right = this;
    }
    public assignTop(arg: CellModel): void {
        this.top = arg;
        arg.bottom = this;
    }

    public set left (arg: CellModel) { this._left = arg;}
    public set right (arg: CellModel) { this._right = arg;}
    public set top (arg: CellModel) { this._top = arg;}
    public set bottom (arg: CellModel) { this._bottom = arg;}

    // it's easy to setup 
    public get left (): CellModel { return (this._left && this._left.isInsideField? this._left : null);}
    public get right (): CellModel { return (this._right && this._right.isInsideField? this._right : null);}
    public get top (): CellModel { return (this._top && this._top.isInsideField? this._top : null);}
    public get bottom (): CellModel { return (this._bottom && this._bottom.isInsideField? this._bottom : null);}

    public get isCellOnFieldBorder(): boolean {
        if (this.left && this.right && this.top && this.bottom) {
            return false;
        }
        return true;
    }

    /** Matching by color */
    public isMatching(cell: CellModel): boolean {
        if (this.isInsideField 
        && cell && cell.isInsideField
        && cell.color > -1 && cell.color === this.color
        ) {
            return true;
        }
        return false;
    }

    /** get neighbors for Search */
    public getNeighbours(): Neighbor[] { 
        if (!this.neighbors) { this.neighbors = [];}
        if (!this.neighbors.length) {
            if (this.left) { this.neighbors.push(this.left);}
            if (this.right) { this.neighbors.push(this.right);}
            if (this.top) { this.neighbors.push(this.top);}
            if (this.bottom) { this.neighbors.push(this.bottom);}
        }
        return this.neighbors;
    }

    // clear if re-using field with different layout
    public clearNeighbors(): void {
        if (this.neighbors) {
            this.neighbors.length = 0;
        }
    }

    /** override if needed */
    public isLinkedTo(arg: Neighbor): boolean {
        return (this.isNeighbor(arg) 
                && (arg instanceof CellModel)
                && (arg as CellModel).isInsideField? true : false);
    }

    public isNeighbor(arg: Neighbor): boolean {
        if (arg && this.getNeighbours().indexOf(arg) !== -1) {
            return true;
        }
        return false;
    }

    // --- ---
    public get hasBrothers(): boolean {
        return false;
    }

    public get hasDestroyableBlock(): boolean { return false;}
    public get hasBlock(): boolean { return false;}
    public get hasBase(): boolean { return false;}
    public hasPowerupOfType(type: string): boolean { return false;}
    public getPowerupGuestOfType(type: string): CellObjectModel { return null;}
    /** check - means able to check by matching color. */
    public getCheck(): CellObjectModel {
        return this.getGuestByAlias(Alias.ALIAS_4_MATCHING_COLORs);
    }
    /** Rocket and bobs are colored as-well - 'colored' power-ups */
    public getCheckNoPowerUps(): CellObjectModel {
        const cellObjectModel: CellObjectModel = this.getCheck();
        return ((cellObjectModel && cellObjectModel.type.charAt(0) === 'c')? cellObjectModel : null);
    }

    // --- ---
    /** get id, traversed for Search */
    public setTraversed(arg: boolean) { this.traversed = arg;}
    public getTraversed(): boolean { return this.traversed;}
    public getId(): number { return this.id;} // this.id2;}

    // 
    public focusScaleGuests(alias: string, scaleFactor: number): void {
        for (const cellObject of this.guests) {
            if (cellObject.alias === alias) {
                cellObject.focusScale(scaleFactor);
            }
        }
    }

    // --- ---
    public clearGuests(): void {
        while (this.guests.length) {
            const guest: BaseModel = this.guests.pop();
            (guest as CellObjectModel).cell = null;
        }
    }

    public toString(): string {
        return '(CellModel  yi,xi: (' + this.yi + ', ' + this.xi + '), ' + this.getReadableColor(this.color) + ')';
    }

    protected getReadableColor(color: number): string { return '';}

    /** Overriden */
    public clear(): void {
        this.clearGuests();

        this.baseName = null;
        this.tenantName = null;
        this.collectableName = null;
        this.markName = null;

        this.color = -1;
    }

    public cleanup(): void {
        this.left = this.right = this.top = this.bottom = null;
    }
}