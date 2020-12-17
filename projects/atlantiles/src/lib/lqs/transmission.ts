/**
 * Created by Fundemic and handed to Ganz 5/8 / 2015.
 */
import { Graphics } from 'pixi.js';
import { IContainer } from './icontainer';
import { Game } from './game';
import { Loop } from './loop';

export class Transmission extends Loop {
    protected out: Loop[];
    protected screens: Loop[];
    protected speed: number;
    protected counter: number;
    protected isFadeIn: boolean;
    protected color: number;

    constructor(g: Game, s = .1, c = 1813466) {
        super(g, 'Transmission');
        this.color = c;
        this.addChild(this.back = new Graphics());
        this.redrawBack();
        this.speed = s;
    }

    public redrawBack(): void {
        const g: Graphics = this.back;
        g.clear();
        g.beginFill(1813466, 1);
        g.drawRect(0, 0, this.game.RW, this.game.RH);
        g.endFill();
    }

    public start(s: Loop[], o: Loop[]): void {
        this.screens = s;
        this.out = o;
        this.isFadeIn = true;
        this.alpha = 0;
        this.counter = 0;
        this.visible = true;
        // this.x = this.y = 0;
    }

    /** override */
    public update(): void {
        this.counter += this.speed;
        if (this.counter < 1) {
            this.alpha = this.counter;

        } else {
            if (this.isFadeIn) {
                this.isFadeIn = false;
                for (const o of this.out) {
                    o.visible = false;
                }
                for (const s of this.screens) {
                    s.init();
                }
            }
            this.alpha = 2 - this.counter;
            if (this.counter > 2) {
                this.visible = false;
            }
        }
    }

    public set Speed(v: number) {
        this.speed = v;
    }

    /** override */
    public set Scale(v: number) {
        this.redrawBack();
    }

    /** override */public destroy(): IContainer {
        if (this.out)
        {
            this.out.length = 0;
        }
        if (this.screens)
        {
            this.screens.length = 0;
        }
        this.removeChildren();
        return super.destroy();
    }
}
