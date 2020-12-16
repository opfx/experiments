import { AnimationModel } from './animation-model';

export class BaseModel {
    private static nextId = 0;
    public id: number;
  
    public x = 0;
    public y = 0;

    protected startScale = 1.0;
    public scaleFactor = 1.0;
    public scale = 1.0;
    public rotation = 0;
    public alpha = 1;
    public visible = true;
    public frame = 0;
    public rotationId = 0; // rotationId of POWERUP_DIRECTED

    // neigbor search
    public visited = false;
    public color = -1;

    public isInited = false; // set to true in view.init()! - model was added but not view - newly created model without view
    public changedPosition: boolean;
    public changedScale: boolean;
    public changedRotation: boolean;
    public changedAlpha: boolean;
    public changedVisible: boolean;
    public changedFrame: boolean;
    public changedState: boolean;
    public changedTexture: boolean;
    public changedSetToDestroy: boolean;
    public changedsetToTopDepth: boolean;
    public stateProgress = 0.0; // for example watering or flashing cellObject, but 'in' should set it to 1 itself
    public isChangingState: boolean;

    public scaleRecoverSpeed = 0.1; // 0.2
    public isScaleRecovering = true;

    public layerId: string; // parent layer Id
    public alias: string; // union of types
    public type: string; // type, texture name, state
    public sfxAnimationDataId: string;
    
    public progressSpeed = 0.0; //
    public extraProgress = 0.0;
    public isLooped = false; 
    public loopCount = 0;

    // list of guests
    public guests: BaseModel[] = [];
    public hostModel: BaseModel;
    public state: string;
    public changeStateCount = 0;
    // stages of life-circle, it's somehow close to state
    public isActivated = false;
    public isCompleted = false;

    // new AnimationModel[]: private as will be populated in sub-classes
    private animations: AnimationModel[] = [];

    constructor() {
        this.id = BaseModel.nextId++;
    }

    public init():void {}
    
    /** update */
    public update():void {
        /* for (const animation of this.animations) {
            animation.update();
        }*/

        this.updateMoveToTarget();

        if (this.isScaleRecovering && this.scale !== this.startScale * this.scaleFactor) {
            this.scale += (this.startScale * this.scaleFactor -  this.scale) * this.scaleRecoverSpeed;
            this.changedScale = true;
        }
    }
    
    /** reset all changed.. */
    public resetChanged(): void {
        this.changedPosition = false;
        this.changedScale = false;
        this.changedRotation = false;
        this.changedAlpha = false;
        this.changedVisible = false;

        this.changedState = false;
        this.changedFrame = false;
        this.changedTexture = false;

        this.changedsetToTopDepth = false;
        // this.changedSetToDestroy = false; don't reset! // options: a).destroy guest; b).don't destroy guest 
    }

    protected updateMoveToTarget():void {}

    public setAliasAndName(layerId: string, alias :string, guestName : string, rotation: number, rotationId: number, stateProgress: number = 1): void {
        this.layerId = layerId;
        this.alias = alias;
        this.type = guestName;
        this.stateProgress = stateProgress;
        this.rotation = rotation;
        this.rotationId = rotationId;
    }

    /** Override in cell-object-model */
    public setPosition(x: number, y: number): void {
        if (this.x !== x || this.y !== y) {
            this.x = x;
            this.y = y;
            this.changedPosition = true;
        }
    }

    public setRotation(arg: number):void {
        if (this.rotation !== arg) {
            this.rotation = arg;
            this.changedRotation = true;
        }
    }

    public setScale(arg: number, isScaleRecovering: boolean):void {
        this.isScaleRecovering = isScaleRecovering;

        if (this.scale !== arg) {
            this.scale = arg;
            this.changedScale = true;
        }
    }

    public setAlpha(arg: number):void {
        if (this.alpha !== arg) {
            this.alpha = arg;
            this.changedAlpha = true;
        }
    }
    
    public setVisible(arg: boolean):void {
        if (this.visible !== arg) {
            this.visible = arg;
            this.changedVisible = true;
        }
    }

    /** override */
    public changeState(state: string = null, frame: number = 0): void {
        this.state = state;
        this.changeStateCount++;
        this.changedState = true;
        this.stateProgress = 0;

        if (frame !== 0) {
            this.frame = frame;
            this.changedFrame = true;
        } 
    }

    /** Override */
    public addGuest(arg: BaseModel, instantPosition: boolean = true): boolean { return false;}
    public removeGuestPlus(guest: BaseModel): void {}

    /** move view to top in it's parent. */
    public setToTopDepth(): void {
        this.changedsetToTopDepth = true;
    }

    /** move view to top in it's parent. */
    public setToDestroy(): void {
        this.changedSetToDestroy = true;
    }

    /** for path-finding */
    public isOpenForPath(): boolean { return false;}

    // --- ---
    /** Overriden in cell-model and field-model, model change was made, but action takes time. If there are guests - check all guests */
    public get isAllChangesFinalized(): boolean {
        // return (this.stateProgress === 1? true : false)
        if (this.stateProgress === 1) {
            return true;
        }
        return false;
    }

    /** Overriden in cell-model and field-model - where there are guests and cells */
    public addNotFinishedType(notFinishedTypes: string[]): void {
        if (this.stateProgress !== 1) {
            notFinishedTypes.push(this.type);
        }
    }

    /** Commented until figuring out what to do with animation alpha (in update), x,y (in setup), see base-in-out-object-view */
    protected addAnimation(arg: AnimationModel): void {
        // this.animations.push(arg);
    }

    protected getAnimationById(arg: string): AnimationModel {
        for (const animation of this.animations) {
            if (animation.animationId === arg) { 
                return animation;
            }
        }
        return null
    }

    public focusScale(scaleFactor: number) {
        this.scale = this.startScale * this.scaleFactor * scaleFactor;
        this.changedScale = true;
    }

    public getCost(factor: number): number { return 0;} // override
    
    public toString(): string {
        return '(BaseModel)';
    }

   /** Override */
    public returnToPool(): void {} // overriden in CellObjectModel
    // public reInitPoolObject() {}
    public deactivatePoolObject(): void {}

    public clear(): void {}
    public cleanup(): void {}
}