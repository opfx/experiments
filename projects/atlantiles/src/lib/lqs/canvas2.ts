/**
 * Created by Fundemic and handed to Ganz 29.09.2016.
 */
import { Graphics, Point } from 'pixi.js';

export class Canvas2 extends Graphics {
    private lineTick: number;
    private lineColor: number;
    private lineAlpha: number;
    private startPos: Point;

    constructor() {
        super();
    }

    /** override */
    public lineTo(px: number, py: number): Graphics {
        const t2 = this.lineTick / 2;
        this.beginFill(this.lineColor, this.lineAlpha);
        this.drawRect(this.startPos.x - t2, this.startPos.y - t2, (px - this.startPos.x) + t2, (py - this.startPos.y) + t2);
        this.startPos = new Point(px, py);
        return this;
    }

    /** override */
    public moveTo(px: number, py: number): Graphics {
        this.startPos = new Point(px, py);
        return this;
    }

    public lineStyle(t: number, lc: number, la: number): Graphics {
        this.lineTick = t;
        this.lineColor = lc;
        this.lineAlpha = la;
        return this;
    }
}

