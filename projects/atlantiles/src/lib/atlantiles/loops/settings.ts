/**
 * Created by Fundemic and handed to Ganz 28.09.2015.
 */
import { Point, Graphics, Container } from 'pixi.js';
import { Game } from '../../lqs/game';
import { LImage } from '../../lqs/limage';
import { Loop } from '../../lqs/loop';
import { LEvent } from '../../lqs/levent';
import { JButton } from '../../lqs/jbutton';
import { IContainer } from '../../lqs/icontainer';
import { Constants } from '../data/constants';

export class Settings extends Loop {
    private settings_back: LImage;
    private b_back: JButton;
    private b_music_on: JButton;
    private b_music_off: JButton;
    private b_sound_on: JButton;
    private b_sound_off: JButton;

    private i_music_on: JButton;
    private i_music_off: JButton;
    private i_sound_on: JButton;
    private i_sound_off: JButton;

    private container: Container;
    private back_image: LImage;

    constructor(g: Game) {
        super(g, 'pause');
        const hw = this.game.RW * .5;
        let hh = this.game.RH * .5;

        const s = Constants.SETTINGS_SCALE;
        this.addChild(this.back_image = new LImage(g, 'background', hw, hh, LImage.FIT_WIDTH));
        this.addChild(this.container = new Container());
        this.container.addChild(this.settings_back = new LImage(g, 'this.settings_back', 0, 0, s));

        this.container.addChild(this.b_back =
            new JButton(this.game, 'btnClose', s * Constants.SETTINGS_BACK_S, 0, this.settings_back.y + this.settings_back.height));

        const ss = s;
        hh = this.settings_back.height;
        const yy = this.settings_back.y + this.settings_back.height * .7;
        const xx = this.settings_back.x;
        this.container.addChild(this.b_music_off = new JButton(this.game, 'settings_01', ss * 2,
            xx + hh * Constants.PAUSE_POS_ELEMENTS[1][0], this.settings_back.y + yy + hh * Constants.PAUSE_POS_ELEMENTS[0][1], 1, 1, 1));
        this.container.addChild(this.b_music_on = new JButton(this.game, 'settings_02', ss * 2,
            xx + hh * Constants.PAUSE_POS_ELEMENTS[1][0], this.settings_back.y + yy + hh * Constants.PAUSE_POS_ELEMENTS[0][1], 1, 1, 1));
        this.container.addChild(this.b_sound_off = new JButton(this.game, 'settings_01', ss * 2,
            xx + hh * Constants.PAUSE_POS_ELEMENTS[1][0], this.settings_back.y + yy + hh * Constants.PAUSE_POS_ELEMENTS[1][1], 1, 1, 1));
        this.container.addChild(this.b_sound_on = new JButton(this.game, 'settings_02', ss * 2,
            xx + hh * Constants.PAUSE_POS_ELEMENTS[1][0], this.settings_back.y + yy + hh * Constants.PAUSE_POS_ELEMENTS[1][1], 1, 1, 1));


        this.container.addChild(this.i_music_off = new JButton(this.game, 'music_off', ss,
            xx + hh * Constants.PAUSE_POS_ELEMENTS[0][0], this.settings_back.y + yy + hh * Constants.PAUSE_POS_ELEMENTS[0][1], 1, 1, 1));
        this.container.addChild(this.i_music_on = new JButton(this.game, 'music_on', ss,
            xx + hh * Constants.PAUSE_POS_ELEMENTS[0][0], this.settings_back.y + yy + hh * Constants.PAUSE_POS_ELEMENTS[0][1], 1, 1, 1));
        this.container.addChild(this.i_sound_off = new JButton(this.game, 'sound_off', ss,
            xx + hh * Constants.PAUSE_POS_ELEMENTS[0][0], this.settings_back.y + yy + hh * Constants.PAUSE_POS_ELEMENTS[1][1], 1, 1, 1));
        this.container.addChild(this.i_sound_on = new JButton(this.game, 'sound_on', ss,
            xx + hh * Constants.PAUSE_POS_ELEMENTS[0][0], this.settings_back.y + yy + hh * Constants.PAUSE_POS_ELEMENTS[1][1], 1, 1, 1));

        this.b_back.addEventListener(LEvent.DEV_BUTTON, this.h_buttons.bind(this));
        this.i_sound_on.addEventListener(LEvent.DEV_BUTTON, this.h_buttons.bind(this));
        this.i_sound_off.addEventListener(LEvent.DEV_BUTTON, this.h_buttons.bind(this));
        this.i_music_off.addEventListener(LEvent.DEV_BUTTON, this.h_buttons.bind(this));
        this.i_music_on.addEventListener(LEvent.DEV_BUTTON, this.h_buttons.bind(this));

        this.b_sound_on.addEventListener(LEvent.DEV_BUTTON, this.h_buttons.bind(this));
        this.b_sound_off.addEventListener(LEvent.DEV_BUTTON, this.h_buttons.bind(this));
        this.b_music_off.addEventListener(LEvent.DEV_BUTTON, this.h_buttons.bind(this));
        this.b_music_on.addEventListener(LEvent.DEV_BUTTON, this.h_buttons.bind(this));

    }
    /** override */public destroy(): IContainer {
        if (this.b_back) {
            this.b_back.removeEventListener(LEvent.DEV_BUTTON, this.h_buttons.bind(this)); }
        if (this.i_sound_on) {
            this.i_sound_on.removeEventListener(LEvent.DEV_BUTTON, this.h_buttons.bind(this)); }
        if (this.i_sound_off) {
            this.i_sound_off.removeEventListener(LEvent.DEV_BUTTON, this.h_buttons.bind(this)); }
        if (this.i_music_off) {
            this.i_music_off.removeEventListener(LEvent.DEV_BUTTON, this.h_buttons.bind(this)); }
        if (this.i_music_on) {
            this.i_music_on.removeEventListener(LEvent.DEV_BUTTON, this.h_buttons.bind(this)); }
        if (this.b_sound_on) {
            this.b_sound_on.removeEventListener(LEvent.DEV_BUTTON, this.h_buttons.bind(this)); }
        if (this.b_sound_off) {
            this.b_sound_off.removeEventListener(LEvent.DEV_BUTTON, this.h_buttons.bind(this)); }
        if (this.b_music_off) {
            this.b_music_off.removeEventListener(LEvent.DEV_BUTTON, this.h_buttons.bind(this)); }
        if (this.b_music_on) {
            this.b_music_on.removeEventListener(LEvent.DEV_BUTTON, this.h_buttons.bind(this)); }

        if (this.settings_back){
            this.settings_back.destroy();
            this.settings_back.destroy();
        }

        if (this.back_image){
            this.back_image.destroy();
            this.back_image.destroy();
        }

        this.settings_back = null;
        this.b_back =
        this.b_music_on =
        this.b_music_off =
        this.b_sound_on =
        this.b_sound_off =
        this.i_music_on =
        this.i_music_off =
        this.i_sound_on =
        this.i_sound_off  = null;
        this.removeChildren();
        return super.destroy();
    }

    /** override */
    public init(): void {
        super.init();

        this.i_music_on.visible = this.b_music_on.visible = this.game.MUSIC;
        this.i_music_off.visible = this.b_music_off.visible = !this.game.MUSIC;
        this.i_sound_on.visible = this.b_sound_on.visible = this.game.SOUND;
        this.i_sound_off.visible = this.b_sound_off.visible = !this.game.SOUND;
    }

    // listeners
    private  h_buttons(e: LEvent): void {
        this.game.playSound('buttonSound', 0, this.game.SOUND);

        const target: JButton = e.target as unknown as JButton;

        switch (target) {
            case this.b_music_on:
            case this.i_music_on:
                this.game.MUSIC = false;
                this.game.stopSound('theme');
                this.game.stopSound('underwater');
                break;

            case this.b_music_off:
            case this.i_music_off:
                this.game.MUSIC = true;
                // this.game.playSound('theme', true, this.game.MUSIC);
                //  this.game.playSound('underwater', true, this.game.MUSIC);
                break;

            case this.b_sound_on:
            case this.i_sound_on:
                this.game.SOUND = false;
                break;

            case this.b_sound_off:
            case this.i_sound_off:
                this.game.SOUND = true;
                break;

            case this.b_back:
                this.dispatchEvent(LEvent.GO_SCREEN, 'close');
                break;
        }

        this.i_music_on.visible = this.b_music_on.visible = this.game.MUSIC;
        this.i_music_off.visible = this.b_music_off.visible = !this.game.MUSIC;
        this.i_sound_on.visible = this.b_sound_on.visible = this.game.SOUND;
        this.i_sound_off.visible = this.b_sound_off.visible = !this.game.SOUND;
    }

    /** override */
    public set Scale(v: number) {
        this.back_image.Scale = this.game.MW / this.back_image.texture.width / this.game.scale.x;
        this.back_image.x = (this.game.RW - this.back_image.width) / 2;
        this.back_image.y = (this.game.RH - this.back_image.height) / 2;

        this.container.x = this.game.RW * .5;
        this.container.y = this.game.RH * .5;
    }
}
