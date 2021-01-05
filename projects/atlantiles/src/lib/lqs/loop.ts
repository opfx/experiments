import { Container, Graphics, DisplayObject, Point } from 'pixi.js';
import { IContainer } from './icontainer';
import { Game } from './game';
import { LEvent } from './levent';

export interface IPosition
{
    object: DisplayObject;
    parent: Container;
    point: Point;
}

export class Loop extends Container implements IContainer {
    protected back: Graphics;
    protected game: Game;
    protected positions: IPosition[] = [];
    // private listenersLocal: ((event: LEvent) => void)[] = [];

    constructor(game: Game, name: string, color = -1) {
        super();

        this.game = game;
        this.name = name;

        if (this.game === null)
        {
            this.game = (this as unknown) as Game;
        }

        if (color >= 0) {
            this.addChild(this.back = new Graphics());
            this.back.beginFill(color, 1);
            this.back.drawRect(0, 0, this.game.W, this.game.H);
            this.back.endFill();
        }

        this.visible = false;
    }

    public init(): void {
        this.visible = true;
    }

    public update(delta: number): void {}
    public go_back(): void {}

    public addPositions(ac: DisplayObject[], parent: Container): void {
        for (const child of ac) {
            this.addPosition(child, parent);
        }
    }

    public addPosition(c: DisplayObject, p: Container): void {
        this.positions.push({object: c, parent: p, point: new Point()});
    }

    public get Name(): string {
        return name;
    }

    public get Scale(): number {
        return this.scale.x;
    }

    public set Scale(v: number) {
        this.scale.set(v);

        if (this.back) {
            if (this.game.scaleType === 1) {
                this.back.scale.y = this.game.MH / this.game.H / v;
            } else {
                this.back.scale.x = this.game.MW / this.game.W / v;
            }
        }
    }

    public get Positions(): IPosition[] {
        return this.positions;
    }

    public applyPositions(): void {
        for (const pos of this.positions) {
            pos.object.x = pos.parent.x + pos.parent.width * pos.point.x;
            pos.object.y = pos.parent.y + pos.parent.height * pos.point.y;
        }
    }

    public set PositionsData(v: number[][]) {
        for (const pos of this.positions) {
            const id = this.positions.indexOf(pos);
            if (id !== -1) { // if (v[id]) {
                pos.point = new Point(v[id][0], v[id][1]);
            }
        }
    }

    public get PositionsData(): number[][] {
        const arr: number[][] = [];
        for (const pos of this.positions) {
            arr.push([pos.point.x, pos.point.y]);
        }
        return arr;
    }

    public removeAll(container: Container): Container {
        while (container.children.length > 0) {
            const child: DisplayObject = container.getChildAt(0);

            if (child.hasOwnProperty('destroy')) {
                child.destroy();
            }

            if (child instanceof Container) {
                this.removeAll(child as Container);
            }
            container.removeChild(child);
        }
        return this;
    }

    /** Decorators for as3 addEventListener, removeEventListener, dispatchEvent */
    public addEventListener(type: string, callback: (event: Event) => void ): void
    {
       this.addListener(type, callback);
    }

    public removeEventListener(type: string, callback: (event: Event) => void ): void
    {
        this.removeListener(type, callback);
    }

    protected dispatchEvent(type: string | symbol, ...rest: unknown[]): void {
    // protected dispatchEvent(type: string | symbol, event: LEvent): void {
        this.emit(type, arguments);
    }

    public dispatch(type: string, data: string | object = null): void {
        this.emit(type, arguments); // dispatchEvent(new LEvent(t, data));
    }

    /** Destroy */
    public destroy(): IContainer {
        this.removeAll(this);

        this.game = null;
        this.back = null;
        this.scale.set(1);
        this.removeChildren();
        return this;
    }

}
