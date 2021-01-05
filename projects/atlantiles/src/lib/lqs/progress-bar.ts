import { Container, Graphics, DisplayObject, Point, Sprite } from 'pixi.js';
import { IContainer } from './icontainer';
import { Game } from './game';
import { LEvent } from './levent';

export class ProgressBar extends Sprite
{
    private mBackground: Graphics;
    private mBar: Graphics;

    constructor(width: number, height: number)
    {
        super();
        this.init(width, height);
    }

    private  init(width: number, height: number): void
    {
        const padding = height * 0.2;
        const cornerRadius = padding * 2;

        // create black rounded box for background

        this.mBackground = new Graphics();
        this.mBackground.beginFill(0x0, 0.5);
        this.mBackground.drawRoundedRect(0, 0, width, height, cornerRadius);
        this.mBackground.endFill();
        this.addChild(this.mBackground);

        // create progress bar shape

        const barWidth: number  = width  - 2 * padding;
        const barHeight = height - 2 * padding;

        const barMatrix: Matrix = new Matrix();
        barMatrix.createGradientBox(barWidth, barHeight, Math.PI / 2);

        this.mBar = new Graphics();
        this.mBar.beginGradientFill(GradientType.LINEAR,
            [0xeeeeee, 0xaaaaaa], [1, 1], [0, 255], barMatrix);

        this.mBar.drawRect(0, 0, barWidth, barHeight);
        this.mBar.x = padding;
        this.mBar.y = padding;
        this.mBar.scale.x = 0.0;
        this.addChild(this.mBar);
    }

    public get ratio(): number { return this.mBar.scale.x; }

    public set ratio(value: number)
    {
        this.mBar.scale.x = Math.max(0.0, Math.min(1.0, value));
    }

    public destroy(): Sprite {
        this.removeChild(this.mBar);
        this.removeChild(this.mBackground);

        this.mBar = null;
        this.mBackground = null;
        this.removeChildren();
        return this;
    }
}