/**
 * Created by Fundemic and handed to Ganz 02.10.2015.
 */
import { IContainer } from '../../lqs/icontainer';
import { Button } from '../../lqs/button';
import { Game } from '../../lqs/game';
import { Loop } from '../../lqs/loop';
import { LEvent } from '../../lqs/levent';
import { LImage } from '../../lqs/limage';

export class Fail extends Loop {
    private background: LImage;
    private field: LImage;
    private replayButton: Button;
    private recordLabel: Text;
    private levelLabel: Text;

    constructor(g: Game) {
        super(g, 'Fail');

        this.addChild(this.background = new LImage(this.game, 'back_end_fail',
                    this.game.RW * .5, this.game.RH * .5, LImage.FIT_HEIGHT, null));
        this.addChild(this.field = new LImage(this.game, 'field_win', this.game.RW * .5, this.game.RH * .7, LImage.FIT_WIDTH, null));
        this.addChild(this.replayButton = new Button(this.game, 'b_pause', 1, this.game.RW * .5, this.game.RH - this.game.RW * .05));

        this.replayButton.addEventListener(LEvent.DEV_BUTTON, this.h_buttons.bind(this));
    }

    // listeners
    private  h_buttons(type: string, currentTarget: Button): void {
        switch (currentTarget) {
            case this.replayButton:
                this.dispatch(LEvent.GO_SCREEN, 'replay');
                break;
        }
    }

    /** override */
    public destroy(): IContainer {
        this.background.destroy();
        this.background.destroy();
        this.field.destroy();
        this.field.destroy();

        this.background = null;
        this.field = null;

        this.removeChildren();
        super.destroy();
        return null;
    }
}
