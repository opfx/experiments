
/**
 * Created by Fundemic and handed to Ganz 24.08.2015.
 */
import { Container } from 'pixi.js';
import { IContainer } from '../../lqs/icontainer';
import { Game } from '../../lqs/game';
import { Cell } from '../../lqs/cell';
import { Element } from './element';
import { Constants } from '../data/constants';

export class GameCell extends Cell {
    private img: Container;
    public neightbor: GameCell;

    constructor(g: Game, i: number, j: number, w: number, h: number) {
        super(g, i, j, w, h);
        const id: string = (((j * Constants.CELLS_IN_ROW + i) % 2 === 0) ? '2' : '1');
        this.addChild(this.img = g.getImage('Remove_11'));
        this.img.scale.x = this.img.scale.y = h / this.img.height;
    }



    public compare(c: GameCell): boolean {
        if (c.getGuests().length === 0) { return false; }
        return (c.getGuests()[0] as Element).Type === (this.guests[0] as Element).Type;
    }

    public kill(): Element {
        this.alpha = .99;
        (this.guests[0] as Element).kill();
        return this.guests[0] as Element;
    }

    public get IsElement(): boolean {
        return this.guests.length > 0;
    }

    /** override */
    public get Scale(): number {
        return this.img.scale.x;
    }

    public getElementSolved(): Element {
        if (this.guests.length === 0) {
            return null;
        }
        return this.guests[0] as Element;
    }

    public getAnyElement(): Element {
        let elem: Element;
        if (this.guests.length === 0) {
            return null;
        } else {
            elem = this.guests[0] as Element;
            if (elem.IsSolved) {
                return null;
            }
        }

        return this.guests[0] as Element;
    }

    public getElement(): Element {
        let elem: Element;
        if (this.guests.length === 0) {
            return null;

        } else {
            elem = this.guests[0] as Element;
            if (elem.IsSolved || elem.IsKilled) {
                return null;
            }
        }

        return this.guests[0] as Element;
    }

    /** override */
    public set Selected(v: boolean) {
        if (this.alpha === 1) {
            super.Selected = v;
            for (const g of this.guests) {
                (g as Element).Selected = v;
            }
        }
    }

    /** override */
    public destroy(): IContainer {
        this.img.destroy();
        this.img = null;
        this.neightbor = null;
        this.removeChildren();
        return super.destroy();
    }
}
