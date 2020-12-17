/**
 * Created by Fundemic and handed to Ganz 24.08.2015.
 */
import { Container, Point, Rectangle, filters } from 'pixi.js';
import { IContainer } from '../../lqs/icontainer';
import { Canvas2 } from '../../lqs/canvas2';
import { Cell } from '../../lqs/cell';
import { CellField } from '../../lqs/cell-field';
import { Game } from '../../lqs/game';
import { Constants } from '../data/constants';
import { GameCell } from './game-cell';
import { Element } from './element';
import { CellObject } from '../../lqs/cell-object';
import { ILevel } from '../data/game-levels';
import { Assets } from '../data/assets';

export class Field extends CellField {
    public static readonly EVENT_UPDATE_LABELS = 'EVENT_UPDATE_LABELS';

    private elementCount: number;
    private countOfPets: number;
    private boundRect: Rectangle;
    private isDevMode: boolean;
    private lineSprite: Canvas2;
    private startCell: GameCell;
    private endCell: GameCell;
    private lastFirst: GameCell;
    private lastSecond: GameCell;
    private blurSprite: Container;
    private lastXML: ILevel;

    /** 'countOfRandomize' was added by Fundemics to fix http://jira.ganz.com/browse/ARCG-4921
     * Sometimes, when you reach Level 7, the tiles are all grayed out except for tile blocks.
     */
    private countOfRandomize = 0;

    constructor(g: Game, isDev: boolean = false) {
        super(g, Constants.CELL_COUNT_X, Constants.CELL_COUNT_Y,
                1, g.RH / (Constants.CELL_COUNT_Y) * Constants.CELL_SCALE, g.RH / (Constants.CELL_COUNT_Y) * Constants.CELL_SCALE);

        this.isDevMode = isDev;
        this.addChild(this.blurSprite = new Container());
        this.blurSprite.addChild(this.lineSprite = new Canvas2());

    }

    /** override */
    public update(): void {
        this.blurSprite.alpha += (0 - this.blurSprite.alpha) * Constants.FIELD_BLUR_ALPHA_SPEED;
        for (const cell of this.cells) {
            if (cell instanceof GameCell)
            {
                const elem: Element = cell.getAnyElement();
                if (elem) {
                    elem.animate();
                    if (elem.IsDead) {
                        this.blurSprite.visible = false;
                        this.delObject(elem);
                    }
                }
            }
        }
    }

    public getAllHints(isAll: boolean = true): Element[] {
        const hints: Element[] = [];
        const all: Element[] = [];
        let cellElement: Element;
        let targetElement: Element;
        let cell1: GameCell;
        let cell2: GameCell;

        const elems: Element[] = [];
        let elem: Element;
        for (const cell of this.cells) {
            if (cell instanceof GameCell)
            {
                elem = cell.getElement();
                if (elem) {
                    elems.push(elem);
                }
            }
        }

        if (elems.length === 0) {
            return null;
        }

        const l = elems.length;

        for (let i = 0; i < l; i++) {
            cellElement = elems[i];
            if (cellElement) {
                all.push(cellElement);
                for (let j = i + 1; j < l; j++) {
                    targetElement = elems[j];
                    if (targetElement) {
                        cell1 = cellElement.getCell() as GameCell;
                        cell2 = targetElement.getCell() as GameCell;
                        if (targetElement.Type === cellElement.Type) {
                            if (targetElement.alpha === 1 && targetElement.alpha === 1) {
                                if (this.findPath(cell1, cell2)) {
                                    if (hints.indexOf(cellElement) < 0 && hints.indexOf(targetElement) < 0 ) {
                                        hints.push(cellElement);
                                        hints.push(targetElement);
                                        if (!isAll) { return hints; }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        return hints;
    }

    /** override */
    public addCell(cell: Cell, cellW: number, cellH: number): void {
        this.cells.push(cell);
        const b = 1;
        this.cellsXY[cell.Y][cell.X] = cell;
        const a = 1;
        this.cellContainer.addChild(cell);
        cell.x = cell.X * cellW;
        cell.y = cell.Y * cellH * Constants.CELL_SCALE1;
    }

    /** override */
    public init(): void {
        if (this.cells.length === 0) {
            this.cellW = this.cellH * Constants.CELL_SCALE2;
            super.init();
        }

    }

    public getNeightbors(c: Cell): Element[] {
        const arr: Element[] = [];
        arr.push((this.cellsXY[c.Y][c.X - 1] as GameCell).getElement());
        arr.push((this.cellsXY[c.Y - 1][c.X] as GameCell).getElement());
        arr.push((this.cellsXY[c.Y][c.X + 1] as GameCell).getElement());
        arr.push((this.cellsXY[c.Y + 1][c.X] as GameCell).getElement());
        return arr;
    }

    public findPath(c: GameCell, to: GameCell): boolean {
        this.lastFirst = this.lastSecond = null;
        const targetElement: Element = to.getGuests()[0] as Element;
        this.startCell = c;
        this.endCell = to;

        const arr1: GameCell[] = [];
        const arr2: GameCell[] = [];
        const prev: GameCell = this.cellsXY[c.Y][c.X] as GameCell;
        let prevCell: GameCell = this.cellsXY[c.Y][c.X] as GameCell;
        let next1Cell: GameCell;
        let dx: number;
        let dy: number;
        let p: Point;
        let n: Element;

        for (let i = 0; i < 4; i++) {
            p = this.getSide(i);  dx = p.x; dy = p.y;
            prevCell = prev;
            n = (this.cellsXY[prev.Y + dy][prev.X + dx] as GameCell).getElement();
            if (n === null ) {
                while (true) {
                    if (arr1.indexOf(prevCell) < 0) {
                        arr1.push(prevCell);
                    }
                    if (!(prevCell.Y + dy >= 0 && prevCell.Y + dy < this.countY)) {
                        break;
                    }
                    if (this.cellsXY[prevCell.Y + dy]) {
                        if (prevCell.X + dx >= 0 && prevCell.X + dx < this.countX) {
                            next1Cell = this.cellsXY[prevCell.Y + dy][prevCell.X + dx] as GameCell;
                        } else {
                            break;
                        }
                        if (next1Cell) {
                            const elem: Element = next1Cell.getElement();
                            if (elem) {
                                if (elem === targetElement) {
                                    this.lastFirst = null;
                                    return true;
                                } else {
                                    break;
                                }
                            } else {
                                this.pushToArr2(arr2, next1Cell, arr1, dx, dy);
                                prevCell = next1Cell;
                                // lastFirst = prevCell;
                            }
                        } else {
                            break;
                        }
                    } else {
                        break;
                    }
                }
            } else
            if (targetElement === n) {
                this.lastFirst = null;
                return true;
            }
        }
        //  if (isCan === false) return false;

        const arrL: GameCell[] = [];
        for (const cell of arr2) {
            if (this.findLine(cell, targetElement, arrL)) {
                this.lastSecond = cell;
                return true;
            }
        }
        return false;
    }

    public drawLine(isClear: boolean = false): void {
        const g: Canvas2 = this.lineSprite;
        if (isClear) {
            g.clear();  // this.blurSprite.unflatten();
            return;
        }
        this.blurSprite.alpha = 1;
        this.blurSprite.visible = true;
        const c2 = 0xFFE730;
        const c = 0xFA9300;
        const s = 17;
        const s2 = 6;
        const w = this.startCell.width / 2;
        const h = this.startCell.height / 2;
        let last: GameCell;

        last = this.startCell;
        g.clear();
        g.lineStyle(this.scale.x, c, .0);
        g.drawCircle(this.startCell.x + w / 2, this.startCell.y + h / 2, .1);
        g.drawCircle(this.endCell.x + w / 2, this.endCell.y + h / 2, .1);
        g.lineStyle(s * this.scale.x, c, 1);


        if (this.lastSecond) {
            this.lastFirst = this.lastSecond.neightbor;
            if (this.distance(new Point(this.lastFirst.x, this.lastFirst.y), new Point(this.endCell.x, this.endCell.y))
                < this.distance(new Point(this.lastSecond.x, this.lastSecond.y), new Point(this.endCell.x, this.endCell.y))) {
                this.lastSecond = null;
            }
        }

        g.moveTo(this.startCell.x + w, this.startCell.y + h);
        if (this.lastFirst) {
            g.lineTo(this.lastFirst.x + w, this.lastFirst.y + h);
            g.lineStyle(s2 * this.scale.x, c2, 1);
            g.moveTo(last.x + w, last.y + h);
            g.lineTo(this.lastFirst.x + w, this.lastFirst.y + h);
            last = this.lastFirst;
        }
        g.lineStyle(s * this.scale.x, c, 1);

        if (this.lastSecond) {
            g.lineTo(this.lastSecond.x + w, this.lastSecond.y + h);
            g.moveTo(last.x + w, last.y + h);
            g.lineStyle(s2 * this.scale.x, c2, 1);
            g.lineTo(this.lastSecond.x + w, this.lastSecond.y + h);
            last = this.lastSecond;
        }
        g.lineStyle(s * this.scale.x, c, 1);
        g.lineTo(this.endCell.x + w, this.endCell.y + h);
        g.moveTo(last.x + w, last.y + h);
        g.lineStyle(s2 * this.scale.x, c2, 1);
        g.lineTo(this.endCell.x + w, this.endCell.y + h);

        const blurFilter: filters.BlurFilter = new filters.BlurFilter();
        blurFilter.blur = 1.5; // blurAmount;
        blurFilter.padding = 0.5; // 3;
        this.blurSprite.filters = [blurFilter];
        // this.lineSprite.filter = new BlurFilter(3, 3, 3);
        // this.blurSprite.unflatten();
        // this.blurSprite.flatten();
    }

    protected distance(p1: Point, p2: Point): number
    {
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) +  Math.pow(p1.y - p2.y, 2));
    }

    public findLine(c: GameCell, targetElement: Element, arrL: GameCell[]): boolean {
        let dx: number;
        let dy: number;
        let p: Point;
        let next2Cell: GameCell;
        let prevCell: GameCell;
        const prev: GameCell = this.cellsXY[c.Y][c.X] as GameCell;

        for (let i = 0; i < 4; i++) {
            p = this.getSide(i);  dx = p.x; dy = p.y;
            prevCell = prev;
            while (true) {
                if (!(prevCell.Y + dy >= 0 && prevCell.Y + dy < this.countY)) {
                    break;
                }
                if (this.cellsXY[prevCell.Y + dy]) {
                    if (prevCell.X + dx >= 0 && prevCell.X + dx < this.countX) {
                        next2Cell = this.cellsXY[prevCell.Y + dy][prevCell.X + dx] as GameCell;
                    } else {
                        break;
                    }
                    if (next2Cell) {
                        const elem: Element = next2Cell.getElement();
                        if (elem){
                            if (elem === targetElement) {
                                return true;
                            } else {
                                break;
                            }
                        } else {
                            prevCell = next2Cell;
                        }
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }
        }
        return false;
    }

    public getSide(i: number): Point {
        return new Point((i === 1 || i === 3) ? 0 : ((i === 0) ? -1 : 1), (i === 0 || i === 2) ? 0 : ((i ===  1) ? -1 : 1));
    }

    public pushToArr2(arr2: GameCell[], c: GameCell, arr1: GameCell[], ddx: number, ddy: number): void {
        let dx: number;
        let dy: number;
        let p: Point;
        let next2Cell: GameCell;
        let prevCell: GameCell;

        for (let i = 0; i < 4; i++) {
            p = this.getSide(i);  dx = p.x; dy = p.y;
            // if (Math.abs(dx) === Math.abs(ddx)) continue;
            // if (Math.abs(dy) === Math.abs(ddy)) continue;
            prevCell = this.cellsXY[c.Y][c.X] as GameCell;

            while (true) {
                if (!(prevCell.Y + dy >= 0 && prevCell.Y + dy < this.countY)) {
                    break;
                }
                if (this.cellsXY[prevCell.Y + dy]) {
                    if (prevCell.X + dx >= 0 && prevCell.X + dx < this.countX) {
                        next2Cell = this.cellsXY[prevCell.Y + dy][prevCell.X + dx] as GameCell;
                    } else {
                        break;
                    }
                    if (next2Cell) {
                        const elem: Element = next2Cell.getElement();
                        if (elem) {
                            break;
                        } else {
                            if (arr2.indexOf(next2Cell) < 0) {
                                if (arr1.indexOf(next2Cell) < 0) {
                                    arr2.push(next2Cell);
                                    next2Cell.neightbor = c;
                                }
                            }
                            prevCell = next2Cell;
                        }
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }
        }
    }

    public clearCost(): void {
        for (const c of this.cells) {
            if (c instanceof GameCell)
            {
                const e: Element = c.getElement();
                if (e) {
                    e.setCost(3);
                }
            }
        }
    }

    public solveCell(first: GameCell, target: GameCell): boolean {
        let solvedCell: GameCell;
        if (first !== target) {
            if (first.visible) {
                if (first.alpha === 1 && target.alpha === 1) {
                    if (first.compare(target)) {
                        if (this.findPath(first, target)) {
                            solvedCell = first;
                        }
                    }
                }
            }
        }

        if (solvedCell) {
            this.elementCount -= 2;
            (target.kill());
            (solvedCell.kill());
            return true;
        }
        return false;
    }

    public get CountOfElements(): number {
        return this.elementCount;
    }

    public solveLevel(): void {
        console.log('solve level ');

        this.countOfRandomize = 0;

        let hints: Element[];
        let count = 0;

        while (count < this.elementCount) {
            hints = this.getAllHints();
            if (hints) {
                for (const h of hints) {
                    h.IsSolved = true;
                    count++;
                }
                if (hints.length === 0) {
                    this.countOfRandomize++;
                    this.randomizeOnce();
                    if (this.countOfRandomize > 100) {
                        this.clear();
                        this.Data = this.lastXML;
                        this.fill();
                        console.log('RERANDOM');
                        this.solveLevel();
                        return;
                        break;
                    }
                }
            } else {
                break;
            }
        }


        for (const c of this.cells) {
            if (c instanceof GameCell)
            {
                const e: Element = c.getElementSolved();
                if (e) {
                    e.IsSolved = false;
                }
            }
        }

        console.log('solved ' + this.countOfRandomize);
    }

    public randomizeOnce(): void {
        let elem: Element;
        let r = Math.random() * this.cells.length;
        let e1: Element = null;
        let e2: Element = null;

        for (let i = 0; i < 5; i++) {
            while (e1 === null) {
                elem = (this.cells[r] instanceof GameCell) ? (this.cells[r] as GameCell).getElement() : null;
                if (elem) {
                    if (!elem.IsEmpty) {
                        e1 = elem;
                    } else {
                        r++;
                        if (r === this.cells.length) {
                            r = 0;
                        }
                    }
                } else {
                    r++;
                    if (r === this.cells.length) {
                        r = 0;
                    }
                }
            }

            r = Math.random() * this.cells.length;
            while (e2 === null) {
                elem = (this.cells[r] as GameCell).getElement();
                if (elem) {
                    if (elem !== e1 && !elem.IsEmpty) {
                        e2 = elem;
                    } else {
                        r++;
                        if (r === this.cells.length) {
                            r = 0;
                        }
                    }
                } else {
                    r++;
                    if (r === this.cells.length) {
                        r = 0;
                    }
                }
            }

            const t: string = e1.Type;
            e1.swap(e2.Type);
            e2.swap(t);
        }
    }

    public fill(): void {
        this.elementCount = 0;
        const pets: string[] = (this.game.assets as Assets).getPetsCopy();
        const elems: string[] = [];
        let id: number;
        let pet: string;

        while (elems.length < this.countOfPets) {
            const ec = elems.length;
            id = Math.floor(pets.length * Math.random());
            pet = pets[id];

            if (pet === null) {
                pet = elems[Math.floor(Math.random() * elems.length)];
                for (let j = 0; j < 2; j++) {
                    elems.splice(Math.floor(elems.length * Math.random()), 0, pet);
                }
            } else {
                pets.splice(id, 1);
                for (let i = 0; i < 4; i++) {
                    if (elems.length < this.countOfPets) {
                        elems.splice(Math.floor(elems.length * Math.random()), 0, pet);
                    }
                }
            }

        }
        id = 0;

        this.elementCount = elems.length;
        let row: Cell[];
        for (let iy = 0; iy < this.cellsXY.length; iy++) {
            row = this.cellsXY[iy];
            for (let ix = row.length - 1; ix >= 0; ix--) {
                const c: GameCell = row[ix] as GameCell;
                if (iy === 0 || iy === this.cellsXY.length - 1 || ix === 0 || ix === row.length - 1) {
                    c.alpha = 0;
                } else {
                    if (c.visible) {
                        if (c.alpha === 1) {
                            this.addObject(elems[id], c);
                            id++;
                        } else {
                            if (c.alpha === .5) {
                                c.alpha = .99;
                                this.addObject('empty', c);
                            }
                        }
                    }
                }
            }
        }

    }

    /** Overriden */
    public newCell(game: Game, i: number, j: number, cellW: number, cellH: number): Cell
    {
        return new GameCell(game, i, j, cellW, cellH);
    }

    /** override */
    public addObject(t: string, cell: Cell, params: object = null): Element {
        const layerID = 0;
        let object: Element;
        const elemType: string = t;
        const s = Constants.ELEM_SCALE;

        object = new Element(this.game, elemType, this.cellScale * .7 * s);
        this.layers[layerID].addChild(object);
        object.setCell(cell);
        object.applyPosition();
        cell.setObject(object);


        if (t === 'empty') {
            object.Type = 'empty' + cell.X + cell.Y;
            object.IsEmpty = true;
        }

        return object;
    }

    public full(): void {
        for (const cell of this.cells) {
            cell.visible = true;
        }
        this.countOfPets = ((this.countX - 2) * (this.countY - 2));
        this.boundRect = new Rectangle(0, 0, this.countX - 1, this.countY - 2);
    }

    /** override */
    public getCellByPoint(p: Point): Cell {
        const xi = Math.min(this.cellsXY[0].length, Math.min(this.countX - 1, Math.max(0, p.x / this.cellW)));
        const yi = Math.min(this.cellsXY.length, Math.min(this.countY - 1, Math.max(0, p.y / this.cellH / Constants.CELL_SCALE1)));

        return this.cellsXY[Math.floor(yi)][Math.floor(xi)];
    }

    public set Data(level: ILevel) {
        this.lastXML = level;
        const rows: number[][] = level.row;
        let elems: number[];

        let minX = Constants.CELL_COUNT_X;
        let minY = Constants.CELL_COUNT_Y;
        let maxX = 0;
        let maxY = 0;
        let addI = 0;
        let isCanFound = false;
        let isFound = false;
        let count = 0;

        for (let i = 0; i < this.countY + addI - 2; i++) {
            elems = rows[i - addI];
            isFound = false;

            // const columns: string = row.columns; // .columns;
            // const elems: string[] = columns.split(',');

            for (let e = 0; e < this.countX - 1; e++) {
                const cell: GameCell = this.cellsXY[i - addI + 1][e + 1] as GameCell;
                cell.visible = elems[e] === 1;
                cell.alpha = 1;

                if (elems[e] === 2) {
                    cell.visible = true;
                    cell.alpha = .5;
                }

                if (elems[e] === 1) {
                    count++;
                    isFound = true;
                    isCanFound = true;
                    minX = Math.min(e, minX);
                    minY = Math.min(i, minY);
                    maxX = Math.max(e, maxX);
                    maxY = Math.max(i, maxY);
                }
            }

            if (!isFound && !isCanFound) {
                addI++; i++;
            }
        }

        this.countOfPets = count;
        this.boundRect = new Rectangle(minX + 2, minY - 1 - addI * 1.2, maxX, maxY);
    }

    public getBound(): Rectangle {
        if (this.boundRect) {
            return new Rectangle((this.boundRect.x) * this.cellW,
                                (0) * this.cellH,
                                (this.boundRect.width - this.boundRect.x + 1) * this.cellW,
                                (this.boundRect.height + 1 - this.boundRect.y) * this.cellH);
        } else {
            return null;
        }
    }

    /** override */
    public clear(): void {
        super.clear();
        for (const cell of this.cells) {
            cell.alpha = 1;
            cell.visible = false;
            const guests: CellObject[] = cell.getGuests();

            for (const g of guests) {
                this.delObject(g);
            }
            cell.clear();
        }
    }

    /** override */
    public destroy(): IContainer {
        this.lineSprite = null;
        this.startCell = null;
        this.endCell = null;
        this.lastFirst = null;
        this.lastSecond = null;
        this.blurSprite = null;
        this.removeChildren();
        return super.destroy();
    }
}
