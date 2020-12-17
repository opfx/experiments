/**
 * Created by Fundemic and handed to Ganz 01.10.2015.
 */
import { Point, Graphics, Container, filters } from 'pixi.js';
import { IContainer } from '../../lqs/icontainer';
import { Game } from '../../lqs/game';
import { LText } from '../../lqs/ltext';
import { LImage } from '../../lqs/limage';
import { Loop } from '../../lqs/loop';
import { LEvent } from '../../lqs/levent';
import { Constants } from '../data/constants';

export class Tutorial extends Loop {
    private background: LImage;
    private pers: LImage;
    private field: LImage;
    private field2: LImage;
    private bubble: LImage;
    private bubbleIcon: LImage;
    private label: LText;
    private label2: LText;

    private isTutor: boolean;
    private isFinished: boolean;
    private isEnd: boolean;
    private timer: number;

    constructor(g: Game, s: number) {
        super(g, 'Tutorial');

        this.visible = true;
        const hw = this.game.RW * .5;
        const hh = this.game.RH * .5;
        this.addChild(this.background = new LImage(this.game, 'back_t1', hw, hh, LImage.FIT_HEIGHT, new Point(.5, .5)));

        this.addChild(this.pers = new LImage(this.game, 'pers_start_1', hw, this.game.RH * Constants.TUTORIAL_PERS_Y, s, null));
        this.addChild(this.field = new LImage(this.game, 'this.field_tutorial', hw,
                        this.game.RH * Constants.TUTORIAL_FIELD_Y, s, null));
        this.addChild(this.field2 = new LImage(this.game, 'this.field_tutorial', hw,
                        this.game.RH * Constants.TUTORIAL_FIELD_Y + this.field.height * 1.1, s, null));
        this.addChild(this.bubble = new LImage(this.game, 'this.bubble', this.game.RW * Constants.TUTORIAL_BUBBLE_Y,
                        this.pers.y + this.game.RW * Constants.TUTORIAL_DELTA_Y, s, null));
        this.addChild(this.bubbleIcon = new LImage(this.game, 'icon_1_3', this.game.RW * Constants.TUTORIAL_BUBBLE_Y,
                        this.pers.y + this.game.RW * Constants.TUTORIAL_DELTA_Y, s, null));
        this.addChild(this.label = new LText('Super', 2, this.field.x, this.field.y + this.game.RW * Constants.TUTORIAL_DELTA_Y,
                                            0xffffff, Constants.TUTORIAL_LABEL_S * s));
        this.addChild(this.label2 = new LText('Super', 2, this.field2.x, this.field2.y + this.game.RW * Constants.TUTORIAL_DELTA_Y,
                                            0xffffff, Constants.TUTORIAL_LABEL_S * s));
        this.label.scale.x *= Constants.TUTORIAL_TEXT_SX;

        const blurFilter: filters.BlurFilter = new filters.BlurFilter(); // blur: BlurFilter = new BlurFilter(.5, .5, 3);
        blurFilter.blur = .5; // blurAmount;
        blurFilter.padding = 3;
        this.label.filters = this.label2.filters = [blurFilter]; // this.label.filter = this.label2.filter = blur;
    }

    /** override */
    public update(): void {
        if (this.visible) {
            if (this.isTutor) {
                if (this.timer-- < 0) {
                    this.timer = -1;
                    this.alpha += (0 - this.alpha) * Constants.TUTORIAL_FADE_OUT_SPEED;
                    if (this.alpha < Constants.TUTORIAL_FADE_OUT_THRESHOLD) {
                        this.visible = false;
                        this.isTutor = false;
                    }
                }
            }
            if (this.isFinished) {
                this.alpha += (1 - this.alpha) * Constants.TUTORIAL_FADE_OUT_SPEED;
                if (this.timer-- === 0) {
                    this.isEnd = false;
                    this.dispatch(LEvent.GO_SCREEN, 'finished');
                }
            }

            if (this.isEnd) {
                this.alpha += (1 - this.alpha) * Constants.TUTORIAL_FADE_OUT_SPEED;
                if (this.timer-- === 0) {
                    this.isEnd = false;
                    this.dispatch(LEvent.GO_SCREEN, 'end');
                }
            }
        }
    }

    public initFinished(): void {
        this.isFinished = true;
        this.isTutor = false;
        this.isEnd = false;
        this.label.text = 'Level Complete';
        this.game.stopSound('theme');
        this.game.playSound('victory', false, this.game.SOUND);
        // label2.text = 'Lives Bonus +' + M.format1(1500 * (this.game as AtlantilesFundemic).Lives + '');
        this.field2.visible = this.label2.visible = true;
        this.visible = true;
        this.alpha = 0;
        this.timer = Constants.TUTORIAL_TIMER;
        this.label.x = (this.game.RW - this.label.width) / 2;
        this.label2.x = (this.game.RW - this.label2.width) / 2;
        this.bubble.visible = this.bubbleIcon.visible = false;
        this.pers.visible = true;

    }

    public initEnd(): void {
        this.game.stopSound('theme');
        this.game.playSound('loss', false, this.game.SOUND);
        this.field2.visible = this.label2.visible = false;

        this.isFinished = false;
        this.isTutor = false;
        this.isEnd = true;
        this.visible = true;
        this.label.text = 'Out Of Moves';
        this.label.x = (this.game.RW - this.label.width) / 2;
        this.alpha = 0;

        this.timer = Constants.TUTORIAL_TIMER;
        this.bubble.visible = this.bubbleIcon.visible = this.pers.visible = false;
    }

    public initTutor(str: string, gameType: string, skin: number): void {
        this.field2.visible = this.label2.visible = false;

        this.isFinished = false;
        this.isTutor = true;
        this.isEnd = false;
        this.visible = true;
        this.alpha = 1;
        this.timer = Constants.TUTORIAL_TIMER;
        this.bubble.visible = this.bubbleIcon.visible = this.pers.visible = true;
        this.label.text = str;
        this.label.x = (this.game.RW - this.label.width) / 2;

        switch (gameType) {
            case Constants.GAME_POINTS:
                this.bubbleIcon.setTexture('star');
                this.pers.setTexture('pers_start_' + 3);
                this.background.setTexture('back_t' + 3);
                break;
            case Constants.GAME_ITEMS:
                this.bubbleIcon.setTexture('icon_2_1');
                this.pers.setTexture('pers_start_' + 1);
                this.background.setTexture('back_t' + 1);
                break;
            case Constants.GAME_DIRTS:
                this.bubbleIcon.setTexture('icon_1_' + skin);
                this.pers.setTexture('pers_start_' + 2);
                this.background.setTexture('back_t' + 2);
                break;
        }
    }

    /** override */
    public destroy(): IContainer {
        if (this.background){
            this.background.destroy();
            this.background.destroy();
        }
        if (this.pers){
            this.pers.destroy();
            this.pers.destroy();
        }
        if (this.field){
            this.field.destroy();
            this.field.destroy();
        }
        if (this.field2){
            this.field2.destroy();
            this.field2.destroy();
        }
        if (this.bubble){
            this.bubble.destroy();
            this.bubble.destroy();
        }
        if (this.bubbleIcon){
            this.bubbleIcon.destroy();
            this.bubbleIcon.destroy();
        }

        this.field2 = this.background = this.pers = this.field = this.bubble = this.bubble = null;
        this.label2 = this.label = null;
        this.removeChildren();
        return super.destroy();
    }
}
