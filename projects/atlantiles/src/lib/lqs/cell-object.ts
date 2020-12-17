import { Sprite, Container } from 'pixi.js';
import { Cell } from './cell';
import { IContainer } from './icontainer';

/**
 * Created by Fundemic and handed to Ganz 24.08.2015.
 */
export class CellObject extends Container implements IContainer {
    protected cell: Cell;
    protected cellType: string;
    protected img: Sprite;
    protected alias: number;

    constructor(t: string, s: number) {
        super();

        this.cellType = t;
    }

    public applyPosition(): void {
        this.x = this.cell.x + this.cell.width / 2;
        this.y = this.cell.y + this.cell.height / 2;
    }
    public setCell(c: Cell): void {
        this.cell = c;
    }
    public getCell(): Cell {
        return this.cell;
    }
    public destroy(): IContainer {
        if (this.img){
            this.img.destroy(); // this.img.destroy();
        }
        this.img = null;
        this.cell = null;
        this.cellType = null;
        this.removeChildren();
        return this;
    }

    public set Type(v: string) {
        this.cellType = v;
    }
    public get Type(): string {
        return this.cellType;
    }
    public get Alias(): number {
        return this.alias;
    }

}
