/**
 * Created by Fundemic and handed to Ganz 7 / 2 / 2015.
 */
import { Graphics, Text } from 'pixi.js';
import { IContainer } from '.././icontainer';
import { DevButton } from './dev-button';

export class TextButton extends DevButton implements IContainer {
    private back: Graphics;
    private label: Text;
    private color: number;
    private selectedColor: number;

    constructor(t: string, s = 1, c = 0, px = 0, py = 0, align: string = 'center', sc = 0xffffff) {
        super(1.1);

        this.selectedColor = sc;
        this.color = c;
        this.addChild(this.back = new Graphics());

        const format: object = {fontFamily: 'fundemicFont', fontSize: Math.floor(12 * s), fill: 0xffffff, align: 'center'};

        this.addChild(this.label =  new Text(t, format));
        this.label.x = this.label.y = 23;
        // this.label.scale.x = this.label.scale.y = s;

        this.redraw();

        this.x = px;
        this.y = py;
        let dx = 0;
        let dy = 0;
        switch (align) {
            case 'left':
                dx = this.width / 2;
                dy = this.height / 2;
                break;
            case 'topRight':
                dx =  -this.width / 2;
                dy =  this.height / 2;
                break;
            case 'botRight':
                dx =  - this.width / 2;
                dy =  - this.height / 2;
                break;
            case 'center':
                dx = 0; // - right;
                dy = 0; // - bottom;
                break;
        }

        this.back.x = this.label.x = -this.label.width / 2 + dx;
        this.back.y = this.label.y = -this.label.height / 2 + dy;
    }

    /** override */
    protected  redraw(): void {
        this.back.clear();
        if (this.isSelected) {
            // this.back.graphics.lineStyle(1, this.selectedColor, 1);
        }
        this.back.beginFill(this.color, 1);
        this.back.drawRect(-5, -5, this.label.width + 10, this.label.height + 10);
        this.back.endFill();
    }

    public get Label(): string {
        return this.label.text;
    }

    /** override */
    public destroy(): IContainer {
        this.label.destroy();
        this.back.destroy();
        this.label = null;
        this.back = null;
        return super.destroy();
    }
}
