import { BaseContainerView } from './base-container-view';
import { BaseModel } from '../progress-model/base-model';
import { CellObjectModel } from '../progress-model/cell-object-model';
import { Sprite, Point, Container, AnimatedSprite } from 'pixi.js';
import { Pool } from '../pool/pool';

export class CellObjectView extends BaseContainerView {
    public cellObjectModel: CellObjectModel;
 
    constructor(model: BaseModel) {
        super(model);
        this.cellObjectModel = model as CellObjectModel;
    }

    public update(): void {
        const changedTexture: boolean = this.model.changedTexture;
        
        super.update();

        if (changedTexture) {
            this.changeTextureInSameLayer();
        }
    }

    /** Override */
    public init(layer: Container, scalePoint: Point): void {
        super.init(layer);

        this.sprite = this.createAndInitChild(this.cellObjectModel.type);

        if (this.cellObjectModel.sfxAnimationDataId) {
            this.sfxAnimation = this.createAndInitChild(this.cellObjectModel.sfxAnimationDataId) as AnimatedSprite;
        }

        this.defaultScaleFactorX = scalePoint.x;
        this.defaultScaleFactorY = scalePoint.y;
        this.updateGeometry(true, true, true);
    }

    /**
     * Restrictions:
     *      1. layer-parent should be the same 
     *      2. It just another color - so all sfAnimation, etc. stays the same
     */
    private changeTextureInSameLayer(): void {
        Pool.takeIn(this.sprite);
        this.sprite = this.createAndInitChild(this.cellObjectModel.type);
    }

    /** Overriden */
    public clear(): void {
        super.clear();
    }

    public cleanup(): void {
        super.cleanup();
        this.cellObjectModel = null;
    }
}