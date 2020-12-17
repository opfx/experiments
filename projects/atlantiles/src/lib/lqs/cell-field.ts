/**
 * Created by Fundemic and handed to Ganz 24.08.2015.
 */
import { Container, Graphics, DisplayObject, Point, InteractionEvent } from 'pixi.js';
import { IContainer } from './icontainer';
import { Game } from './game';
import { LEvent } from './levent';
import { Loop } from './loop';
import { Cell } from './cell';
import { CellObject } from './cell-object';

export class CellField extends Loop {

    // protected cellClass: Class;
    protected countX: number;
    protected countY: number;
    protected cellW: number;
    protected cellH: number;
    protected cellsXY: Cell[][];
    protected cells: Cell[];
    protected cellScale: number;
    protected cellContainer: Container;
    protected layers: Container[];
    protected HELPER_POINT: Point = new Point();

    constructor(g: Game, cx: number, cy: number, /*cc: Class,*/ count: number, cw = NaN, ch = NaN) {
        super(g, 'CellField');

        // this.cellClass = cc;
        this.countX = cx;
        this.countY = cy;
        this.cellW = cw || g.RW / cx;
        this.cellH = ch || g.RW / cy;
        this.cells = [];
        this.cellsXY = [];
        this.addChild(this.cellContainer = new Container());

        this.layers = [];
        for (let i = 0; i < count; i++) {
            const layer: Container = new Container();
            this.addChild(layer);
            this.layers.push(layer);
        }

        this.interactive = true;
        this.buttonMode = true;
        this
        // set the mousedown and touchstart callback...
        .on('mousedown', this.h_touch.bind(this)) // onButtonDown)
        .on('touchstart', this.h_touch.bind(this)) // onButtonDown)
        // set the mouseup and touchend callback...
        .on('mouseup', this.h_touch.bind(this)) // onButtonUp)
        .on('touchend', this.h_touch.bind(this)); // onButtonUp)
    }

    /** overriden */
    public init(): void {
        super.init();

        let row: Cell[];
        for (let i = 0; i < this.countY; i++) {
            this.cellsXY.push(row = []);
        }

        for (let i = 0; i < this.countY; i++) {
            for (let j = 0; j < this.countX; j++) {
                const cell: Cell = this.newCell(this.game, j, i, this.cellW, this.cellH);
                this.addCell(cell, this.cellW, this.cellH);
                // row.push(cell);
            }
        }

        this.cellScale = this.cells[0].Scale;
    }

    /** Override */
    public newCell(game: Game, i: number, j: number, cellW: number, cellH: number): Cell
    {
        return new Cell(game, i, j, cellW, cellH);
    }

    /** add - delete object */
    public addObject(t: string, cell: Cell, params: object = null): CellObject {
        return null;
    }

    public delObject(co: CellObject): CellObject {
        if (co){
            co.getCell().delObject(co);
            if (co.parent) {
                co.parent.removeChild(co.destroy() as unknown as Container);
            }
            return co.destroy() as CellObject;
        }
        this.removeChildren();
        return null;
    }


    /** get Cell */
    public getCell(xi: number, yi: number): Cell {
        return this.cellsXY[yi][xi];
    }

    /** get Element */
    public getElement(t: string, arr: string[] = null): CellObject {
        for (const cell of this.cells) {
            const guests: CellObject[] = cell.getGuests();
            if (arr) {
                for (const g of guests) {
                    if (arr.indexOf(g.Type) >= 0) { return g; }
                }
            } else {
                for (const g of guests) {
                    if (g.Type === t) { return g; }
                }
            }
        }

        return null;
    }

    public addCell(cell: Cell, cellW: number, cellH: number): void {
        this.cells.push(cell);
        this.cellsXY[cell.Y][cell.X] = cell;
        this.cellContainer.addChild(cell);
        cell.x = cell.X * cellW;
        cell.y = cell.Y * cellH;
    }

    public clearCell(cell: Cell): void {
        const guests: CellObject[] = cell.getGuests();
        while (guests.length) {
            this.delObject(guests[0]);
        }
    }

    public get CellW(): number {
        return this.cellW;
    }
    public get H(): number {
        return this.countY * this.cellH;
    }
    public get W(): number {
        return this.countX * this.cellW;
    }
    public get CountY(): number {
        return this.countY;
    }
    public get CountX(): number {
        return this.countX;
    }
    public get CellScale(): number {
        return this.cellScale;
    }

    // listeners
    public getCellByPoint(p: Point): Cell {
        const xi = Math.min(this.cellsXY[0].length, Math.min(this.countX - 1, Math.max(0, p.x / this.cellW)));
        const yi = Math.min(this.cellsXY.length, Math.min(this.countY - 1, Math.max(0, p.y / this.cellH)));

        return this.cellsXY[yi][xi];
    }

    private  h_touch(event: InteractionEvent, interactionEventTargetName: string, screenLocalPoint: Point /* e: TouchEvent */): void {
        const target: any = event.target;
        event.data.getLocalPosition(target, this.HELPER_POINT);

        const cell: Cell = this.getCellByPoint(this.HELPER_POINT);

        switch (event.type) {
            case 'mousedown':
            case 'touchstart':
                // this.dispatchEvent(LEvent.CELL_DOWN, new LEvent(LEvent.CELL_DOWN, cell));
                this.dispatchEvent(LEvent.CELL_DOWN, cell);
                break;

            case 'mouseup':
            case 'touchend':
                // this.dispatchEvent(LEvent.CELL_UP, new LEvent(LEvent.CELL_UP, cell));
                this.dispatchEvent(LEvent.CELL_UP, cell);
                break;
        }
    }

    public clear(): void {
        for (const layer of  this.layers) {
            while (layer.children.length > 0) {
                const object = layer.getChildAt(0) as CellObject;
                object.destroy();
                layer.removeChild(object);
            }
        }
        for (const cell of this.cells) {
            cell.clear();
        }
    }

    /** overriden */
    public destroy(): IContainer {
        this
        .off('mousedown', this.h_touch.bind(this)) // onButtonDown)
        .off('touchstart', this.h_touch.bind(this)) // onButtonDown)
        .off('mouseup', this.h_touch.bind(this)) // onButtonUp)
        .off('touchend', this.h_touch.bind(this)); // onButtonUp)

        this.layers = null;
        this.cellsXY = null;
        this.cells = null;
        this.cellContainer = null;
        return super.destroy();
    }
}
