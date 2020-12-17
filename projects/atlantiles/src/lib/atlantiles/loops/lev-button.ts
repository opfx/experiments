/**
 * Created by Fundemic and handed to Ganz 02.10.2015.
 */
import { IContainer } from '../../lqs/icontainer';
import { Game } from '../../lqs/game';
import { Button } from '../../lqs/button';
import { LText } from '../../lqs/ltext';

export class LevButton extends Button {
    private label: LText;
    private id: number;
    private game: Game;

    constructor(g: Game, i: number, s: number, px: number, py: number) {
        super(g, 'lock', s, px, py, .95);

        this.id = i;
        this.game = g;
        this.addChild(this.label = new LText(this.id + '', 1, px , py, 0x111111, s * 12));
        this.label.x = this.img.x - this.label.width / 2 + this.img.width / 2;
        this.label.y = this.img.y - this.label.height / 2 + this.img.height / 2;
        this.label.alpha = .7;
        this.isEnabled = false;
    }

    public setAsUnlocked(v: boolean): void {
        this.isEnabled = true;
        // this.label.style.fill = 0xffffff;
        this.label.alpha = 1;
        this.img.texture = this.game.assets.getTexture('unlock');
    }

    public setAsActive(v: boolean): void {
        this.isEnabled = true;
        // this.label.style.fill = 0xffffff;
        this.label.alpha = 1;
    }

    public get ID(): number {
        return this.id;
    }

    /** override */
    public destroy(): IContainer {
        this.label = null;
        this.game = null;
        this.removeChildren();
        return super.destroy();
    }
}
