import { BaseContainerView } from './base-container-view';
import { BaseModel } from '../progress-model/base-model';
import { FieldModel } from '../progress-model/field-model';
import { CellModel } from '../progress-model/cell-model';
import { CellView } from './cell-view';
import { Container, Point } from 'pixi.js';
import { CellObjectModel } from '../progress-model/cell-object-model';
import { CostTextController } from '../controllers/cost-text-controller';
import { CellObjectView } from './cell-object-view';
import { Alias, LayerId, FieldAction } from '../interfaces';

export class FieldView extends BaseContainerView {

    public maskedContainer: Container; // introduced not to mask 'designs' in TransitionalFieldView

    public designLayer: Container;
    public borderLayer: Container;
    public cellLayer: Container;
    public liquidLayer: Container;
    public collectableLayer: Container;
    public baseLayer: Container;
    public coloredTenantsLayer: Container; 
    public markLayer: Container;
    public costLayer: Container;
    public layers: Container[] = [];
    protected costTextController: CostTextController;
    private inited = false;
    
    public fieldModel: FieldModel;
    private cellViews: CellView[] = []
    private cellsXY: CellView[][] = []; // add for debug

    constructor(model:BaseModel, useContainerForMask: boolean = false) {
        super(model);
        this.fieldModel = model as FieldModel;

        if (!useContainerForMask) {
            this.maskedContainer = this; // don't created additional display tree member if not needed
        } else {
            this.maskedContainer = new Container();
            this.addChild(this.maskedContainer);
        }

        this.addListeners();
    }

    /** overriden */
    public init():void {
        super.init(null);

        if (!this.inited) {
            this.inited = true;

            this.designLayer = this.addViewLayer(LayerId.LAYER_FOR_FIELD_DECORATION, this, 0);
            this.borderLayer = this.addViewLayer(LayerId.LAYER_FOR_FIELD_BORDERS, this.maskedContainer);
            this.cellLayer = this.addViewLayer(LayerId.LAYER_FOR_CELL_BACKGROUNDS, this.maskedContainer);
            this.collectableLayer = this.addViewLayer(LayerId.LAYER_FOR_COLLECTABLES, this.maskedContainer);
            this.liquidLayer = this.addViewLayer(LayerId.LAYER_FOR_LIQUID_BASE, this.maskedContainer);
            this.baseLayer = this.addViewLayer(LayerId.LAYER_FOR_BASES, this.maskedContainer);
            this.coloredTenantsLayer = this.addViewLayer(LayerId.LAYER_FOR_MATCHING_COLORs, this.maskedContainer);
            this.markLayer = this.addViewLayer(LayerId.LAYER_FOR_MARKS, this.maskedContainer);
            this.costLayer = this.addViewLayer(LayerId.LAYER_FOR_TEXT_COST, this.maskedContainer);
            
            this.costTextController = new CostTextController(this.costLayer);
        
            let i:number; const imax: number = this.fieldModel.cells.length;
            for (i=0; i<imax; i++) {
                this.createAndSetupCell(this.fieldModel.cells[i]);
            }

            // this.cellsXY
            for (i=0; i<imax; i++) {
                const cellView: CellView = this.cellViews[i];
                if (!this.cellsXY[cellView.cellModel.yi]) {
                    this.cellsXY[cellView.cellModel.yi] = [];
                }
                this.cellsXY[cellView.cellModel.yi][cellView.cellModel.xi] = cellView;
            }
        }

        // create border, background and guests
        for (const cellView of this.cellViews) {
            cellView.init(this.borderLayer);
            this.initNewGuests(cellView); // called here as guest's parents are children of field-view
        }
    }

    // --- ---
    /** overriden: first update all models, than - all views */
    public update():void {
        super.update();
        
        this.costTextController.update();

        for (const cell of this.cellViews) {
            if (cell.cellModel.isInsideField) {
                this.initNewGuests(cell); // called here as guest's parents are children of field-view
                cell.update();
            }
        }
    }

    // --- ---
    /** Maintain order yourself */
    public addViewLayer(aliasName:string, parent: Container, depth: number = NaN): Container  {
        const layer: Container = new Container();
        layer.name = aliasName;

        if (isNaN(depth)) {
            parent.addChild(layer);
        } else {
            parent.addChildAt(layer, 0);
        }
        this.layers.push(layer);
    
        return layer;
    }

    /** Create cell view with provided model */
    public createAndSetupCell(cellModel: CellModel): CellView {
        const cellView: CellView = this.createCellView(cellModel);

        // console.info('[field-view] createAndSetupCell() at', cellModel.yi, cellModel.xi);

        this.cellLayer.addChild(cellView);
        this.cellViews.push(cellView);
        
        return cellView;
    }

    private initNewGuests(cellView: CellView): void {
        cellView.initGuests( Alias.ALIAS_3_LIQUID_BASE, this.liquidLayer);
        cellView.initGuests( Alias.ALIAS_3_BASE, this.baseLayer);
        cellView.initGuests( Alias.ALIAS_2_COLLECTABLES, this.collectableLayer);
        cellView.initGuests( Alias.ALIAS_4_MATCHING_COLORs, this.coloredTenantsLayer);
        cellView.initGuests( Alias.ALIAS_5_MARKS, this.markLayer);
    }

    /** might be overriden for a type */
    public createCellView(cellModel: CellModel): CellView {
        return new CellView(cellModel);
    }

    // --- ---
    private onPointer(arg: any): void {
        const global: Point = arg.data.global;
        const type = arg.type === 'pointerdown'? FieldAction.CELL_DOWN : FieldAction.CELL_UP; 
        
        // this.fieldModel.onPointer(type, global.x, global.y);
        // this.fieldModel.onPointer(type, global.x - this.x, global.y - this.y);
        // WORKING before re-sizing: this.fieldModel.onPointer(type, global.x - this.x + this.fieldModel.cellW/2, global.y - this.y + this.fieldModel.cellH/2);

        //
        const point: Point = new Point();
        arg.data.getLocalPosition(this, point, arg.data.global);
        this.fieldModel.onPointer(type, point.x + this.fieldModel.cellW/2, point.y + this.fieldModel.cellH/2);
    }

    private addListeners(): void {
        // Opt-in to interactivity
        this.interactive = true;
        // Shows hand cursor
        this.buttonMode = true;
        // Pointers normalize touch and mouse
        this.on('pointerdown', this.onPointer);
        this.on('pointerup', this.onPointer);
    }

    // --- --- debug methods
    public getViewAtCellXY(x: number, y: number): CellView {
        return this.getViewAtCellJI(Math.floor(x/this.fieldModel.cellW), Math.floor(y/this.fieldModel.cellH));
    }

    /** to find assign in wrong way */
    public getViewAtCellJI(xi: number, yi: number): CellView {
        for (const cell of this.cellViews) {
            for (const guest of cell.model.guests) {
                if ((guest as CellObjectModel).cell.xi === xi && (guest as CellObjectModel).cell.yi === yi) {
                    return cell;
                }
            }
        }
        return null;
    }

    /** to find assign in wrong way */
    public getViewsAtCellJI(xi: number, yi: number): CellView[] {
        const temp: CellView[] = []
        for (const cell of this.cellViews) {
            for (const guest of cell.model.guests) {
                if ((guest as CellObjectModel).cell.xi === xi && (guest as CellObjectModel).cell.yi === yi) {
                    temp.push(cell);
                }
            }
        }
        return temp;
    }


    public getViewAtIndex(xi: number, yi: number): CellView {
        return this.cellsXY[yi][xi];
    }

    public getGuestViewAtIndexAndModel(xi: number, yi: number, guestModel: CellObjectModel): CellObjectView {
        return this.cellsXY[yi][xi].getGuestByModel(guestModel);
    }

    public showCost(cell: CellModel, cost: number): void {
        this.costTextController.showCost(cell, cost);
    }

    // --- ---
    public clearCost(): void {
        if (this.costTextController) {
            this.costTextController.clear();
        }
    }

    /** Overriden. clear for reuse - replay */
    public clear(): void {
        super.clear();

        this.clearCost();
        for (const cell of this.cellViews) {
            cell.clear();
        }

        this.cleanupChildren(this.borderLayer, 'this.borderLayer');
        // this.clearChildren(this.cellLayer, 'this.cellLayer'); // can't re
        this.cleanupChildren(this.collectableLayer, 'this.collectableLayer');
        this.cleanupChildren(this.liquidLayer, 'this.liquidLayer'); 
        this.cleanupChildren(this.baseLayer, 'this.baseLayer'); 
        this.cleanupChildren(this.coloredTenantsLayer, 'this.coloredTenantsLayer');
        this.cleanupChildren(this.markLayer, 'this.markLayer');
    }

    private cleanupChildren(layer: Container, alias: string): void {
        if (layer && layer.children.length > 0) {
            // console.info('[FieldView].clear, ' + alias + '.children.length: ' + layer.children.length);
            
            // layer.removeChildren();
            for (const child of layer.children) {
                if (child instanceof BaseContainerView) {
                    child.cleanup();
                }
            }
        }
    }

    /** cleanup for garbage-collection - quit the game completely */
    public cleanup(): void {
        this.clear();
        while(this.layers.length > 0) {
            const layer: Container = this.layers.pop();

            this.cleanupChildren(layer, null);

            layer.removeChildren();
            if (layer.parent) {
                layer.parent.removeChild(layer);
            }
        }
    }
}