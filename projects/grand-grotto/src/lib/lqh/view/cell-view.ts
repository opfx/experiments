import { BaseContainerView } from './base-container-view';
import { CellModel } from '../progress-model/cell-model';
import { Sprite, Point, Container } from 'pixi.js';
import { Pool } from '../pool/pool';
import { CellObjectView } from './cell-object-view';
import { CellObjectModel } from '../progress-model/cell-object-model';

export class CellView extends BaseContainerView {
    public cellModel: CellModel;

    public borderCellTextureName: string; // every cell which is on the border of field would have extra image if value is provided
    public cellBackgroundTextureName: string; // every cell which is inside field would have one if value is provided
    private backgroundSprite: Sprite
    private borderSprite: Sprite;

    // public guests: CellObjectView[] = [];
     
    constructor(model: CellModel) {
        super(model);
        this.cellModel = model;
    }
    
    public init(borderLayer: Container): void {
        if (this.cellModel.isInsideField) {
            // console.info('[cell-view] init() at', this.cellModel.yi, this.cellModel.xi, this.cellModel.isInsideField);
            super.init(borderLayer);

            // background sprite
            if (this.cellBackgroundTextureName) {
                this.addChild( this.backgroundSprite = Pool.takeOutSprite(this.cellBackgroundTextureName));
            }

            // border sprite
            if (this.cellModel.isCellOnFieldBorder && this.borderCellTextureName && borderLayer) {
                borderLayer.addChild( this.borderSprite = Pool.takeOutSprite(this.borderCellTextureName));
            }

            // scale between model's cellW, cellH and texture from texture atlas: 
            this.defaultScaleFactorX = this.cellModel.cellW / this.backgroundSprite.width;
            this.defaultScaleFactorY = this.cellModel.cellH / this.backgroundSprite.height;

            this.updateGeometry(true, true, true);

            if (this.borderSprite) {
                //                 
                this.borderSprite.scale = this.scalePoint;

                this.borderSprite.x = this.x;
                this.borderSprite.y = this.y;
            }
        }
    }

    /** initNewGuests is called in field-view for init() and update() */
    public update(): void {
        super.update();
        for (const guest of this.guests) {
            guest.update();
        }
    }

   public initGuests(alias: string, layer: Container):void {
        const cellObjectModel: CellObjectModel = this.cellModel.getGuestByAlias(alias);
        if (cellObjectModel && !cellObjectModel.isInited) {
     
            const cellObjectView: CellObjectView = this.getNewCellObjectView(cellObjectModel);
            layer.addChild(cellObjectView);

            cellObjectView.init(layer, this.scalePoint);
            this.addGuest(cellObjectView);
        }
    }

    /** Override */
    public getNewCellObjectView(cellObjectModel): CellObjectView {
        return new CellObjectView(cellObjectModel);
    }

    /** Overriden
     *  old signature: public addGuest(cellObjectView: CellObjectView):void {
     */
    // public addGuest(guest: CellObjectView):void {
    public addGuest(guest: BaseContainerView): void {
        const index: number = this.guests.indexOf(guest as CellObjectView);
        if (index === -1 ) { 
            this.guests.push(guest as CellObjectView);
            guest.hostView = this;

        }
    }
    /** Overriden.
     *     IT MIGHT BE A PT-FALL, but let's try: as connection of cell-view and cellObject-view might be longer than cell-model and celObject-model
     *      let's add removing model-guest relationship here as well in the way not to get endless recursion 
     */
    protected removeGuestPlus(guest: BaseContainerView): void {
        const index: number = this.guests.indexOf(guest as CellObjectView);
        if (index !== -1 ) { 
            this.guests.splice(index, 1);

            if (guest.model && guest.hostView.model instanceof CellModel) {
                (guest.hostView.model as CellModel).removeGuestPlus(guest.model);
            }

            guest.hostView = null;
        }
    }

    public getGuestByModel(model: CellObjectModel): CellObjectView {
        for (const guest of this.guests) {
            if (guest.model === model) {
                return guest as CellObjectView;
            }
        }
        return null;
    }

    // --- ---
    public get xi(): number { return this.model? this.cellModel.xi : undefined; }
    public get yi(): number { return this.model? this.cellModel.yi : undefined; }

    // --- ---
    public clearGuests(): void {
        while (this.guests.length) {
            const guest: BaseContainerView = this.guests.pop();
            guest.clear();

            if (guest.parent) {
                guest.parent.removeChild(guest);
            }
        }
    }

    /** Overriden */
    public clear(): void {
        super.clear();

        if (this.cellModel.isInsideField) {
            Pool.takeIn(this.backgroundSprite);
            Pool.takeIn(this.borderSprite); // even if parent is different

            this.backgroundSprite = null;
            this.borderSprite = null;

            this.clearGuests();
        }
    }
}