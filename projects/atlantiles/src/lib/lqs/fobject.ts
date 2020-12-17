/**
 * Created by Fundemic and handed to Ganz 07.07.2015.
 */
import { Container, Graphics, DisplayObject, Point, Sprite } from 'pixi.js';
import { IContainer } from './icontainer';
import { Game } from './game';
import { Parameter } from './parameter';

export class FObject extends Container implements IContainer {

    protected type: string;
    protected img: Sprite;
    protected layerID: number;
    protected game: Game;
    public parameters: Parameter[];

    constructor(g: Game, t: string) {
        super();

        this.type = t;
        this.game = g;
        switch (t) {
            default:
                this.addChild(this.img = new Sprite(g.assets.getTexture(this.type)));
                this.img.x = -this.img.width / 2;
                this.img.y = -this.img.height / 2;
                break;
        }
    }

    public get LayerID(): number {
        return this.layerID;
    }

    public set LayerID(v: number) {
        this.layerID = v;
    }
    public set Place(v: Point) {
        this.x = v.x;
        this.y = v.y;
    }
    public get W(): number {
        return this.img.width;
    }
    public get H(): number {
        return this.img.height;
    }
    public destroy(): IContainer {
        if (this.img) {
            this.img.destroy();
            this.removeChild(this.img);
        }
        this.img = null;
        this.game = null;
        this.img = null;
        this.type = null;
        this.removeChildren();
        return this;
    }

    public get Data(): object {
        return {x: this.x, y: this.y, t: this.type, rr: Math.round(this.rotation * 180 / Math.PI)};
    }

    public get Type(): string {
        return this.type;
    }
}
