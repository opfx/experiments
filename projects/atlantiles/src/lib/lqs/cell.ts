import { Point, Container } from 'pixi.js';
import { IContainer } from './icontainer';
import { CellObject } from './cell-object';
import { Game } from './game';

export class Cell extends Container implements IContainer {
    private xi: number;
    private yi: number;
    private isSelected: boolean;
    protected guests: CellObject[];

    constructor(g: Game, i: number, j: number, w: number, h: number) {
        super();

        this.xi = i;
        this.yi = j;
        this.guests = [];
    }

    public get Scale(): number
    {
        return 1;
    }

    public getAlias(alias: number): CellObject
    {
        for (const g of this.guests)
        {
            if (g.Alias === alias) {
                return g;
            }
        }
        return null;
    }

    public delObject(o: CellObject): void
    {
        this.guests.splice(this.guests.indexOf(o), 1);
    }

    public setObject(o: CellObject): void
    {
        this.guests.push(o);
    }

    public getGuests(): CellObject[] {
        return this.guests;
    }

    public destroy(): IContainer
    {
        this.guests.length = 0;
        this.removeChildren();
        return this;
    }

    public get Place(): Point { return new Point(this.x, this.y); }
    public get X(): number { return this.xi; }
    public get Y(): number { return this.yi; }

    public get Selected(): boolean { return this.isSelected; }
    public set Selected(v: boolean) { this.isSelected = v; }

    public clear(): void
    {
        this.guests = [];
    }
}
