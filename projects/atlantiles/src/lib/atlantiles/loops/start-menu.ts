/**
 * Created by Fundemic and handed to Ganz 7 / 2 / 2015.
 */
import { Point } from 'pixi.js';
import { IContainer } from '../../lqs/icontainer';
import { Game } from '../../lqs/game';
import { LImage } from '../../lqs/limage';
import { Loop } from '../../lqs/loop';
import { LEvent } from '../../lqs/levent';
import { JButton } from '../../lqs/jbutton';
import { Constants } from '../data/constants';

export class StartMenu extends Loop {
    private buttonPlay: JButton;
    private buttonClassic: JButton;
    // private buttonSettings: JButton;
    // private buttonInstructions: JButton;
    private background: LImage;
    private logo: LImage;

    constructor(g: Game) {
        super(g, 'StartMenu');

        const hh = this.game.RH * .5;
        const hw = this.game.RW * .5;

        const originalLogoWidth = g.assets.getTexture('game-logo').width;
        const logoScale = this.game.RW * .6 / originalLogoWidth;

        this.addChild(this.background = new LImage(this.game, 'menu_back', hw, hh, LImage.FIT_WIDTH, null));
        this.addChild(this.logo = new LImage(this.game, 'game-logo', hw * Constants.STARTMENU_LOGO_DW, 0, logoScale, new Point(0.5, .5)));

        const ss = Constants.STARTMENU_SCALE;
        this.addChild(this.buttonPlay = new JButton(this.game, 'btnPlay',
                        this.logo.scale.x * ss, this.game.RW * Constants.STARTMENU_BUTTONS_2.x,
                        this.game.RH * Constants.STARTMENU_BUTTONS_2.y));
        this.addChild(this.buttonClassic = new JButton(this.game, 'btnClassic',
                        this.logo.scale.x * ss, this.game.RW * Constants.STARTMENU_BUTTONS_1.x,
                        this.game.RH * Constants.STARTMENU_BUTTONS_2.y));


        this.buttonPlay.addEventListener(LEvent.DEV_BUTTON, this.h_buttons.bind(this));
        this.buttonClassic.addEventListener(LEvent.DEV_BUTTON, this.h_buttons.bind(this));
    }
    /** override */public init(): void {
        super.init();
        this.game.stopSound('theme');
    }

    // listeners
    // private h_buttons(e: LEvent): void {
    private h_buttons(type: Event, target: JButton): void {
        // const target: JButton = e.target as unknown as JButton;
        switch (target) {
            case this.buttonClassic:
                this.game.playSound('buttonSound', 0, this.game.SOUND);
                this.dispatchEvent(LEvent.GO_SCREEN, 'classic', this); // (LEvent.GO_SCREEN, 'classic');
                break;

            case this.buttonPlay:
                this.game.playSound('buttonSound', 0, this.game.SOUND);
                this.dispatchEvent(LEvent.GO_SCREEN, 'play', this);
                break;
        }

        this.game.playSound('underwater', true, this.game.MUSIC);
    }
    /** override */
    public set Scale(v: number) {
        // this.background.Scale = this.game.MW / this.background.texture.width / this.game.scale.x;
        const scaleX = this.game.MW / this.background.texture.width / this.game.scale.x;
        const scaleY = this.game.MH / this.background.texture.height / this.game.scale.y;
        this.background.Scale = Math.max(scaleX, scaleY); // scaleX;
        this.background.x = (this.game.RW - this.background.width) / 2;
        this.background.y = (this.game.RH - this.background.height) / 2;
        
        this.logo.Scale = Math.min(scaleX, scaleY);
        this.logo.x = (this.game.RW - this.logo.width) / 2;
        this.logo.y = this.game.RH * Constants.STARTMENU_LOGO_DH - this.logo.height / 2;

        this.buttonPlay.y = this.buttonClassic.y = this.game.RH * Constants.STARTMENU_BUTTONS_1.y;

        this.buttonPlay.x =  this.game.RW * Constants.STARTMENU_BUTTONS_2.x;
        this.buttonClassic.x =  this.game.RW * Constants.STARTMENU_BUTTONS_1.x;
    }

    /** override */
    public destroy(): IContainer {
        if (this.buttonPlay){
            this.buttonPlay.removeEventListener(LEvent.DEV_BUTTON, this.h_buttons.bind(this));
        }

        if (this.buttonClassic) {
            this.buttonClassic.removeEventListener(LEvent.DEV_BUTTON, this.h_buttons.bind(this));
        }

        if (this.background){
            this.background.destroy();
        }

        if (this.logo){
            this.logo.destroy();
            this.logo.destroy();
        }

        this.buttonPlay = null;
        // this.buttonSettings =  null;
        this.background = null;
        this.buttonClassic = null;
        this.logo = null;
        this.removeChildren();
        return super.destroy();
    }
}
