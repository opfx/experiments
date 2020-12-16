import { BaseModel } from './base-model';
import { Config } from '../config';
import { IPoint, IMoveToTargetInitiator, Powerups, Alias, ICellModel } from '../interfaces';

/** Class for 'rocket' type - directed bonus */
export class CellObjectDirectionBounds {
    public xi: number;
    public yi: number;

    public startX: number;
    public endX: number; 
    public startY: number;
    public endY: number;

    public x: number;
    public y: number;
    public targetX: number;
    public targetY: number;
    // facing direction (don't use for rocket's flare as view is rotated, use only for movement direction):
    public directionX: number; // -1, 0, or 1
    public directionY: number; // -1, 0, or 1

    constructor(cell: ICellModel, rotationId: number) {
        this.init(cell, rotationId);
    }

    public init(cell: ICellModel, rotationId: number): void {
        // find bounds for using directed bonus
        switch (rotationId) {
            case 0:
                this.startX = cell.xi + 1; this.endX = Config.countX; 
                this.startY = cell.yi; this.endY = cell.yi + 1;
                this.directionX = 1; this.directionY = 0;
                    break;
            case 1:
                this.startX = cell.xi; this.endX = cell.xi + 1;
                this.startY = cell.yi + 1; this.endY = Config.countY;
                this.directionX = 0; this.directionY = 1;
                    break;
            case 2:
                this.startX = 0; this.endX = cell.xi; 
                this.startY = cell.yi; this.endY = cell.yi+ 1;
                this.directionX = -1; this.directionY = 0;
                    break;
            case -1:
                this.startX = cell.xi; this.endX = cell.xi + 1; 
                this.startY = 0; this.endY = cell.yi;
                this.directionX = 0; this.directionY = -1;
                    break;
        }
        
        // find bounds for travelling
        // index
        this.xi = cell.xi;
        this.yi = cell.yi;

        // position
        this.x = cell.x;
        this.y = cell.y;

        // (endX, endY):
        this.targetX = cell.x + cell.cellW * (this.endX - cell.xi);
        this.targetY = cell.y + cell.cellH * (this.endY - cell.yi);
    }
}

export class CellObjectModel extends BaseModel {
    public static readonly STATE_KILLED = 'STATE_KILLED';
    public static readonly STATE_DEAD = 'STATE_DEAD';
    public static readonly STATE_MOVING_TO_TARGET = 'STATE_MOVING_TO_TARGET';
    public static readonly STATE_MOVING_IN_DIRECTION = 'STATE_MOVING_IN_DIRECTION';
    public static EPSILON = 0.25; // used for moving to target
    
    public cell: ICellModel;
    public brothers: CellObjectModel[] = []; // for 'sibling-brothers' - four brothers will be representted like a one big one
    public isGroupLeader = false;
    public isInGroup = false;

    public targetX: number;
    public targetY: number;
    public dx: number;
    public dy: number;
    public absDx: number;
    public absDy: number;

    public nextRoomSpeed = 1;
    private fallSpeed = 1;
    private cellWtoTarget: number;
    private cellObjectDirectionBounds: CellObjectDirectionBounds;

    public isColorCheck = false;
    public completeMoveTotargetScope: IMoveToTargetInitiator; 

    constructor() {
        super();
    }

    /** Override */
    public setAliasAndName(layerId: string, alias :string, guestName : string, rotation: number, rotationId: number, stateProgress: number = 1): void {
        super.setAliasAndName(layerId, alias, guestName, rotation, rotationId, stateProgress);

        if (alias === Alias.ALIAS_4_MATCHING_COLORs) {
            this.isColorCheck = true;
            this.setColor();
        } else {
            this.color = -1;
        }
    }

    /** Override */
    public setColor(): void {}

    public setCellModel(arg: ICellModel, instant: boolean = true): void {
        this.cell = arg;
        this.scale = this.startScale = arg.scale;

        this.cellWtoTarget = arg.cellW * .017;
        this.moveToTarget0(arg, instant);
    }

    
    /** first update all models, than - all views */
    /* public update(): void {
        super.update();
    } */

    /** Override in super class */
    public getAlias(): string {
        return this.alias;
    }

    /** set to public as flash calls the function directly */
    public updateMoveToTarget():void {
        // if(!isSpecialAnim) {
        this.dx = this.targetX - this.x;
        this.dy = this.targetY - this.y;
        this.absDx = Math.abs(this.dx);
        this.absDy = Math.abs(this.dy);

        if (this.absDx > CellObjectModel.EPSILON || this.absDy > CellObjectModel.EPSILON) {

            //if (this.targetMovingType === FieldModel.FALLING) {
                this.moveToTargetTweenIncrement(this.dx, this.dy, this.absDx, this.absDy);
            //} ele 
            this.changedPosition = true;

            // used inversed condition! - to call complete() once!
            if (Math.abs(this.targetX - this.x) <= CellObjectModel.EPSILON && Math.abs(this.targetY - this.y) <= CellObjectModel.EPSILON) {
                this.moveToTargetTweenComplete();
            }
        }
    }

    /** override for different states.
     *  This one is for falling gems
     */
    protected moveToTargetTweenIncrement(dx: number, dy: number, absDx: number, absDy: number): void {
        const c: number = this.cellWtoTarget * this.fallSpeed;
        this.fallSpeed += 4;
        if(absDx < 0.05 && absDy < 0.05) {
            this.fallSpeed = 0;
        }

        /* if(absDy > 2) {
            const breakPoint = 5;
        } */

        if (this.fallSpeed > 4) {
            const breakPoint = 5;
            // console.log('		[Element].moveToTarget, (' + (this.cell? this.cell.yi : '-') + ', ' + (this.cell? this.cell.xi : '-') + ') fallSpeed: ' +  this.fallSpeed + ' ' + c);
        }

        this.x += 0.5 * Math.max(-c , Math.min(c, dx *  .5 * this.nextRoomSpeed)) / Config.FPS_MODIFIER; // 0.5 as spped is different in here 
        this.y += 0.5 * Math.min(c, dy *  .5 * this.nextRoomSpeed) / Config.FPS_MODIFIER;
    }

    /** override if needed */
    protected moveToTargetTweenComplete(): void {
        if (this.completeMoveTotargetScope) {
            this.completeMoveTotargetScope.onGuestReachedTargetPoint(this);
        }
    }

    /** Overriden */
    public setPosition(x: number, y: number): void {
        this.x = this.targetX = x;
        this.y = this.targetY = y;
        this.changedPosition = true;
    }

    /** Set t */
    public moveToTarget0(arg: IPoint, instant: boolean = true):void {
        if(instant) {
            this.x = this.targetX = arg.x;
            this.y = this.targetY = arg.y;
        } else {
            this.targetX = arg.x + (!this.isGroupLeader? 0 : Config.cellW/2);
            this.targetY = arg.y + (!this.isGroupLeader? 0 : Config.cellH/2);
        }
        this.changedPosition = true;
    }

    public applyPosition(): void {
        /*this.x = */this.targetX = this.cell.x + (!this.isGroupLeader? 0 : this.cell.cellW/2);
        /*this.y = */this.targetY = this.cell.y + (!this.isGroupLeader? 0 : this.cell.cellH/2); 
        this.changedPosition = true;
    }

    // --- ---
    /** Is a large gem 2x2 gem */
    public get hasBrothers(): boolean {
        return (this.brothers && this.brothers.length > 0? true : false);
    }

    public addBrother(arg: CellObjectModel): void {
        if (this.brothers.indexOf(arg) === -1) {
            this.brothers.push(arg);
        }
    }
 
    // --- --- directed bonus:
    public getCellObjectDirectionBounds(): CellObjectDirectionBounds {
        if (this.cellObjectDirectionBounds) {
            return this.cellObjectDirectionBounds;

        } else if (this.cell 
            && this.cell.hasPowerupOfType(Powerups.POWERUP_DIRECTED)) {
                return this.cellObjectDirectionBounds = new CellObjectDirectionBounds(this.cell, this.rotationId);
        }
    }

    // -- pool
    /** Used for reshuffling (no moves) only */
    public replaceColor(newColor: number): void {
    }
    
    /** now is called from view */
    public returnToPool(): void {
        if (this.cell) {
            this.cell.removeGuestPlus(this);
        }
    } 
    
     /** Override in super class */
    public reInitPoolObject(): void {
    }
    public deactivatePoolObject(): void {
    }
}