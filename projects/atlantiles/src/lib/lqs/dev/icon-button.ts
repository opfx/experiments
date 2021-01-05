/**
 * Created by Fundemic and handed to Ganz 08.07.2015.
 */
import { Graphics, Sprite } from 'pixi.js';
import { IContainer } from '.././icontainer';
import { Game } from '.././game';
import { DevButton } from './dev-button';

export class IconButton extends DevButton implements IContainer {
    private readonly size = 40;
    private type: string;
    private img: Sprite;
    private shape: Graphics;

    private borderColor: number;

    constructor(g: Game, t: string, px: number, py: number, c = 0x00cc00, align: string = 'center', isSquare: boolean = true) {
        super();
        this.borderColor = c;
        this.type = t;

        switch (t) {
            default:
                this.addChild(this.img = new Sprite(g.assets.getTexture(this.type)));
                if (this.img.height > this.size) {
                    this.img.scale.x = this.img.scale.y = this.size / this.img.height;
                }

                break;
        }
        this.addChild(this.shape = new Graphics());

        this.x = px;
        this.y = py;
        if (align === 'center') {
            this.shape.x = this.img.x = -this.img.width / 2;
            this.shape.y = this.img.y = - this.img.height / 2;
        }

        this.shape.lineStyle(3, 0x000000, .5);
        this.shape.drawRect(0, 0, this.size, this.size);
    }

    public getImage(): Sprite {
        return this.img;
    }

    /* override */
    protected  redraw(): void {
        this.shape.clear();
        if (this.isSelected) {
            this.shape.lineStyle(5, this.borderColor , 1);
        } else {
            this.shape.lineStyle(3, 0x000000, .5);
        }
        this.shape.drawRect(0, 0, this.size, this.size);
    }

    public get Type(): string {
        return this.type;
    }

    /* override */
    public destroy(): IContainer {
        this.type = null;
        this.img = null;
        this.shape = null;
        return super.destroy();
    }
}
