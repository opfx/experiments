import { Text, Container, Point } from 'pixi.js';
import { CellModel } from '../progress-model/cell-model';
import { Pool } from '../pool/pool';
import { GameConfig } from '../../data/game-config';
import { CellObjectModel } from '../progress-model/cell-object-model';

export class CostTextController {
    private costLayer: Container;
    private costs: Text[] = [];
    private phases: number[] = [];
    private costsX: number[] = [];
    private cellWW: number;
    private scalePoint = new Point();

    constructor(costLayer: Container) {
        this.costLayer = costLayer;
        //this.cellWW = cellWW;
    }

    public update(): void {
        let t: number; let tmax = this.costs.length;
        for(t = 0; t < tmax; t++) {
            const cost: Text = this.costs[t];
            cost.x = this.costsX[t] + Math.sin(this.phases[t]) * this.cellWW * .25 *GameConfig.FPS_REVERSE_MODIFIER_COST;
            cost.y -= this.cellWW * .02 *GameConfig.FPS_REVERSE_MODIFIER_COST;
            this.phases[t] += 0.2 *GameConfig.FPS_REVERSE_MODIFIER_COST;

            cost.alpha += (0 - cost.alpha) * .025 *GameConfig.FPS_REVERSE_MODIFIER_COST; // flash: (0 - cost.alpha) * .05 

            if(cost.alpha < .02) {
                // removeChild(cost);
                this.costs.splice(t, 1);
                this.phases.splice(t, 1);
                this.costsX.splice(t, 1);
                t--; tmax--;
                
                Pool.takeIn(cost);
            }
        }
    }

    public showCost(cell: CellModel, costValue: number): void {
        this.cellWW = cell.cellW;

        if(costValue > 0) {
            const isGroupCost = costValue >= GameConfig.BIG_CHECK_COST? true : false;

            // const text:Text = game.getText('' + costValue, cell.x, cell.y, (c>= C.BIG_CHECK_COST ? 8.4: 6) * cellScale); // new Text
            const text :Text = Pool.getText('' + costValue);

            text.anchor.set(0.5, 0.5);
            text.x = cell.x - 0.25 * cell.cellW; // text.x = cell.x - 0.75 * cell.cellW;
            text.y = cell.y - 0.25 * cell.cellH; // text.y = cell.y - 0.75 * cell.cellH;

            const factor: number = (isGroupCost ? 8.4: 6) / 6; // devided by 6 to have scale close to 1, so it will be not scaling - but by text font - not to be too blurred
            const scale = cell.scale * factor;
            this.scalePoint.set(scale, scale);
            text.scale = this.scalePoint;
            
            this.costLayer.addChild(text);

            this.costs.push(text);
            this.phases.push(Math.PI * 2 * Math.random());

            let xx: number  = text.x - text.width/2 + this.cellWW/2;
            text.y += this.cellWW/2;

            if(isGroupCost) {
                xx += this.cellWW; // xx += this.cellWW/2;
                text.y += this.cellWW/2;
            }
            this.costsX.push(xx);
        }
    }

    // --- ---
    public clear(): void {
        while(this.costs.length > 0) {
            // this.costs.pop().destroy();
            Pool.takeIn(this.costs.pop());
        }

        this.costLayer.removeChildren();
    }

    public cleanup(): void {
        this.clear();
        this.costLayer = null;
    }
}