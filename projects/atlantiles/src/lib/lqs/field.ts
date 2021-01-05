/**
 * Created by Fundemic and handed to Ganz 07.07.2015.
 */
import { Container, Graphics, DisplayObject, Point } from 'pixi.js';
import { IContainer } from './icontainer';
import { Game } from './game';
import { FObject } from './fobject';

export class Field extends Container implements IContainer{
    protected objects: FObject[][] = [];
    protected layers: Container[] = [];

    protected w: number;
    protected h: number;
    protected countX: number;
    protected countY: number;
    protected game: Game;

    constructor(g: Game, layerCount: number) {
        super();

        this.game = g;

        for (let i = 0; i < layerCount; i++) {
            this.layers.push(this.addChild(new Container()) as Container);
            this.objects.push([]);
        }
    }

    public clear(): void {
        for (let i = 0; i < this.layers.length; i++) {
            for (let o = 0; o < this.objects[i].length; o++) {
                this.delObject(this.objects[i][o]);
                o--;
            }
        }
    }

    public init(cx: number, cy: number): void {
        this.w = this.width;
        this.h = this.height;
        this.countX = cx;
        this.countY = cy;
    }

    public destroy(): IContainer {
        if (this.layers) {
            let id = 0;
            for (const layer of this.layers) {
                this.objects[id] = [];
                while (layer.children.length > 0) {
                    layer.removeChild(layer.getChildAt(0).destroy() as unknown as DisplayObject);
                }
                id++;
            }
        }
        this.game = null;
        this.objects = null;
        this.layers = null;
        this.removeChildren();
        return this;
    }

    public addObject(type: string, lid = 0): FObject {
        const o: FObject = new FObject(this.game, type);
        (this.getChildAt(lid) as Container).addChild(o);
        this.objects[lid].push(o);
        return o;
    }
    public getLayer(i: number): Container {
        return this.layers[i];
    }
    public delObject(o: FObject): void {
        const layer: Container = (o.parent as Container);
        const lid = this.getChildIndex(layer);
        if (lid >= 0) {
            const array: FObject[] = this.objects[lid];
            array.splice(array.indexOf(o), 1);
            layer.removeChild(o.destroy() as unknown as DisplayObject);
        }
    }
    public get H(): number {
        return this.h;
    }
    public get W(): number {
        return this.w;
    }

    public setData(v: object): void {

    }
    public getData(): object {
        const o: object = {};
        return o;
    }
}
