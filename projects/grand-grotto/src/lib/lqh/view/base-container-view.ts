import { BaseModel } from '../progress-model/base-model';
import { Container, Point, AnimatedSprite, Sprite, Texture, Rectangle } from 'pixi.js';
import { Pool } from '../pool/pool';

export class BaseContainerView extends Container {
    public model:BaseModel;
    protected inAnimation: AnimatedSprite;
    protected sprite: Sprite;
    protected updatableAnimatedSprite: AnimatedSprite;
    protected outAnimation: AnimatedSprite;
    protected sfxAnimation: AnimatedSprite; // special effects animation

    public inAnimationDataId: string; // corresponds to AnimationData in pool for texture's name sequence
    public sfxAnimationDataId: string; // corresponds to AnimationData in pool for texture's name sequence
    
    public scalePoint: Point;
    protected defaultScaleFactorX = 1; 
    protected defaultScaleFactorY = 1;
    protected scaleFactor = 1;

    // protected targetX = 0; 
    // protected targetY = 0;

    public looped = false;
    protected isPlaying: boolean;
    protected skipCounter = 0; 
    public skipMax = 0;

    public hostView: BaseContainerView;
    public guests: BaseContainerView[] = [];
    
    constructor(model:BaseModel) {
        super();
        this.model = model;
        this.scalePoint = new Point(1,1);
    }

    public init(layer: Container, scalePoint: Point = null): void {
        this.model.isInited = true; // is newly added = false
    }

    /** Override */
    protected changeState(): void {}

    // don't put here model.update(): as first update all models, then - all views 
    public update():void {
        if (this.model.changedState) {
            this.changeState();
        }

        if (this.isPlaying) {
            this.nextFrameWithSkip();
        }

        this.updateGeometry();

        // move to top depth
        if (this.model.changedsetToTopDepth && this.parent) {
            this.parent.setChildIndex(this, this.parent.children.length - 1);
        }

        if (this.model.changedSetToDestroy) {
            this.removeViewAndModel();
        }

        this.model.resetChanged();
    }

    private nextFrameWithSkip(): void {
        if (this.skipMax === 0 || this.skipCounter++ > this.skipMax) {
            this.skipCounter = 0;
            this.nextFrame();
        }
    }

    /** Override if needed to set his.updatableAnimatedSprite:
     * this.updatableAnimatedSprite = this.sprite as AnimatedSprite; // destraction of base ot block
     * OR
     * this.updatableAnimatedSprite = this.inAnimation; // water
     */
    protected nextFrame(): void {
        
        if (this.updatableAnimatedSprite && this.updatableAnimatedSprite.currentFrame < this.updatableAnimatedSprite.totalFrames - 1) {
            this.updatableAnimatedSprite.gotoAndStop(this.updatableAnimatedSprite.currentFrame + 1);
        
        } else {
            if (this.looped) {
                this.updatableAnimatedSprite.gotoAndPlay(0);

            } else {
                this.onAnimationComplete();
            }
        }
    }

    /** Overriden in water with this.inAnimation === this.updatableAnimatedSprite */
    protected onAnimationComplete(): void {
        this.isPlaying = false;

        this.model.stateProgress = 1; // state progress here for water

        Pool.takeIn(this.updatableAnimatedSprite);
        this.removeMyselfOnAnimationComplete();
        
        if (this.sprite === this.updatableAnimatedSprite) {
            this.sprite = null;
        }
       this.updatableAnimatedSprite = null;
    }

    /** Override if needed. Example: overriden in WaterObjectView */
    public removeMyselfOnAnimationComplete(): void {
        this.removeViewAndModel();
    }

    /**  */
    /*final*/ public removeViewAndModel(): void {
        if (this.model.type.charAt(0) === 'p') {
            const debugPoint = 1;
        }

        this.hostView.removeGuestPlus(this);
        this.model.returnToPool();

        // Pool.takeIn(this);
        if (this.parent) { // for cell-object-view, Pool is working on it's children
            this.parent.removeChild(this);
        }
    }

    /** Override */
    public addGuest(guest: BaseContainerView): void {}
    protected removeGuestPlus(guest: BaseContainerView): void {}

    protected updateGeometry(changedPosition: boolean = false,  changedScale: boolean = false, changedRotation: boolean = false): void {
        if(changedScale || this.model.changedScale) {
            this.scalePoint.set(this.defaultScaleFactorX * this.model.scale *this.scaleFactor, this.defaultScaleFactorY * this.model.scale *this.scaleFactor);
            this.scale = this.scalePoint;
        }
        
        if(changedPosition || this.model.changedPosition) {
            this.x = this.model.x;
            this.y = this.model.y;
        }

        if(changedRotation || this.model.changedRotation) {
            this.rotation = this.model.rotation;
        }

        if (this.model.changedAlpha) {
            this.alpha = this.model.alpha;
        }

        if (this.model.changedVisible) {
            this.visible = this.model.visible;
        }

        // this.model.changedScale = this.model.changedPosition = this.model.changedRotation = false; // in caller - this.model.resetChanged()
    }
    
    //
    protected createAndInitChild(textureId: string): Sprite {
        let child: Sprite = Pool.takeOutDisplayObjectById(textureId);
        this.addChild(child);

        // weird bug - child.parent.width = 0, while child.width > 0 !
        if (this.width === 0) {
            // let debugPoint = 1;
            // const bounds: Rectangle = this.getBounds();

            /*
            // try #1 - didn't work 
            this.removeChild(child);
            child.texture = Texture.from( Pool.getTextureNameById(textureId) );
            this.addChild(child);
            debugPoint = 2;*/

            // try #2 - worked
            this.removeChild(child);
            child = Pool.createNewInstance(textureId); //new Sprite( Texture.from(Pool.getTextureNameById(textureId)));
            this.addChild(child);

            // debugPoint = 3;
        }

        return child;
    }

    // --- ---
    protected discardChild(sprite:Sprite): void {
        Pool.takeIn(sprite);
    }

    /** Ready to re-use */
    public clear(): void {
        this.isPlaying = false;

        if (this.model) {
            this.model.clear();
        }
        if (this.inAnimation) { Pool.takeIn(this.inAnimation);}
        if (this.sfxAnimation) { Pool.takeIn(this.sfxAnimation);}
        if (this.outAnimation) { Pool.takeIn(this.outAnimation);}

        this.inAnimation =
        this.sfxAnimation =
        this.outAnimation =
        this.updatableAnimatedSprite =
        this.sprite = null;

        this.hostView = null;
        this.guests.length = 0;

        // this.removeChildren(); // don't uncomment - field-view extends this as well - after first field you will have any empty next field :) 
    }
    /** Ready for garbage collection */
    public cleanup(): void {
        this.clear();
        this.model = null;
        this.removeChildren();
    }
}