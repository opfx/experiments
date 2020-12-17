/**
 * Created by Fundemic and handed to Ganz 10.07.2015.
 */
import { Point, Sprite } from 'pixi.js';
import { IContainer } from './icontainer';
import { Game } from './game';
import { DevButton } from './dev/dev-button';

export class Button extends DevButton implements IContainer {
    protected img: Sprite;
    protected sp: Point;
    protected phase: Point;

    constructor(g: Game, tname: string, s = 1, px = 0, py = 0, ds = 1, os: number=NaN, us: number=NaN) {
        super (isNaN(os) ? ds * .92 :  ds, os || ds * 1.08, us || ds);

        this.addChild(this.img = new Sprite(g.assets.getTexture(tname)));
        this.img.scale.x = this.img.scale.y = s;
        this.img.x = -this.img.width / 2;
        this.img.y = -this.img.height / 2;
        this.x = px;
        this.y = py;
        this.phase = new Point(Math.random(), Math.random());
        this.sp = new Point(this.x, this.y);
    }

    public setPosition(px: number, py: number): void {
        this.sp = new Point(px, py);
    }

    public init(): void {
        this.phase = new Point();
    }

    public move(ax = 0, ay = 0): void {
        if (!this.isDown) {
            this.scale.x = this.scale.y += (1 - this.scale.x) * .1;
            this.x += (this.sp.x + Math.sin(this.phase.x) * ax - this.x) * .1;
            this.y += (this.sp.y + Math.sin(this.phase.y) * ay - this.y) * .1;

            this.phase.x += 0.1;
            this.phase.y += 0.1;
        }

    }

    public get Scale(): number {
        return this.scale.x;
    }

    public set Scale(v: number) {
        this.scale.x = this.scale.y = v;
    }

    /** override */public destroy(): IContainer {
        if (this.img){
            this.img.destroy();
        }
        this.img = null;
        this.removeChildren();
        return super.destroy();
    }
}
