/**
 * Created by Fundemic and handed to Ganz 31.10.2015.
 */
import { IContainer } from '../../lqs/icontainer';
import { Game } from '../../lqs/game';
import { LImage } from '../../lqs/limage';
import { Loop } from '../../lqs/loop';
import { LEvent } from '../../lqs/levent';
import { JButton } from '../../lqs/jbutton';
import { Constants } from '../data/constants';

export class Instructions extends Loop {
    private buttonback: JButton;
    private logo: LImage;
    private background: LImage;
    private i1: LImage;
    private i2: LImage;

    constructor(g: Game) {
        super(g, 'Instructions');
        const hh = this.game.RH * .5;
        const hw = this.game.RW * .5;
        const s = this.game.RH / this.game.H * Constants.INSTRUCTION_SCALE;

        this.addChild(this.background = new LImage(this.game, 'this.background', hw, hh, LImage.FIT_WIDTH, null));

        this.addChild(this.i1 = new LImage(this.game, 'i1', hw,
            this.game.RH * Constants.INSTRUCTIONS_Y[0], s * Constants.INSTRUCTIONS_I_SCALE, null));
        this.addChild(this.i2 = new LImage(this.game, 'i2', hw,
            this.game.RH * Constants.INSTRUCTIONS_Y[1], s * Constants.INSTRUCTIONS_I_SCALE, null));

        this.addChild(this.buttonback = new JButton(this.game, 'btnClose', s * .6,
            hw, this.i2.y + this.i2.height *  Constants.INSTRUCTIONS_BACK_Y));

        this.buttonback.addEventListener(LEvent.DEV_BUTTON, this.h_buttons.bind(this));
    }

    // listeners
    private  h_buttons(e: LEvent): void {
        this.game.playSound('buttonSound', 0, this.game.SOUND);
        this.dispatchEvent(LEvent.GO_SCREEN, 'back');
    }

    /** override */
    public set Scale(v: number) {
        this.background.Scale = this.game.MW / this.background.texture.width / this.game.scale.x;
        this.background.x = (this.game.RW - this.background.width) / 2;
        this.background.y = (this.game.RH - this.background.height) / 2;

        this.i1.x = this.i2.x = (this.game.RW - this.i1.width) / 2;
        this.buttonback.x = this.game.RW * .5;
    }

    /** override */
    public destroy(): IContainer {
        if (this.buttonback){
            this.buttonback.removeEventListener(LEvent.DEV_BUTTON, this.h_buttons.bind(this));
        }
        if (this.logo){
            this.logo.destroy();
            this.logo.destroy();
        }
        if (this.background){
            this.background.destroy();
            this.background.destroy();
        }
        if (this.i1){
            this.i1.destroy();
            this.i1.destroy();
        }
        if (this.i2){
            this.i2.destroy();
            this.i2.destroy();
        }

        this.background = this.logo = this.i1 = this.i2 = null;
        this.buttonback = null;

        this.removeChildren();
        return null;
    }
}
