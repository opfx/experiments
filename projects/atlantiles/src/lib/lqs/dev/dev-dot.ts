import { Graphics, Point } from 'pixi.js';

/**
 * ...
 * @author Nebesniy
 */
export class DevDot extends Graphics
{
    private lastPlace: Point;
    private isSelected: boolean;
    private down: Point;
    public IsDown: boolean;

    constructor() {
        super();
        this.down = new Point();
        this.lastPlace = new Point();

        this.alpha = 0.8;
        this.redraw();
    }

    public redraw(): void {
        this.clear();
        (this.isSelected) ? this.lineStyle(2, 0xFF1A1F, 0.7) : this.lineStyle(1, 0xFFFFFF, 0.7);
        this.beginFill(0xE2E2E2);
        this.drawCircle(0, 0, 4);
        this.endFill();
    }

    public set LastPlace(v: Point) {
        this.lastPlace = v;
    }

    public get LastPlace(): Point {
        return this.lastPlace;
    }

    public get Down(): Point {
        return this.down;
    }

    public set Selected(v: boolean) {
        this.isSelected = v;
        this.down = new Point(this.x, this.y);
        this.redraw();
    }

    public get Selected(): boolean {
        return this.isSelected;
    }

    // Listeners
    public get Place(): Point {
        return new Point(this.x, this.y);
    }
}
