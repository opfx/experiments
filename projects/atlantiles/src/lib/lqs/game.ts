import { Texture, Sprite } from 'pixi.js';
import { Loop } from './loop';
import { Preloader } from '../lq/preloader';
import { Transmission } from '../lqs/transmission';
import { Animation } from './animation';
import { SoundController } from '../lq/sound-controller';

export class Game extends Loop {

    public static readonly CHANGED = 'CHANGED';
    public static readonly PORTRAIT_ORIENTATION = 0;
    public static readonly LANDSCAPE_ORIENTATION = 1;
    public static readonly BOTH_ORIENTATION = 2;

    public SOUND = true;
    public MUSIC = true;

    public W: number;
    public H: number;
    public RH: number;
    public RW: number;
    public MH: number;
    public MW: number;
    public startS: number;
    public scaleType: number;
    public PAUSED: boolean;
    // tslint:disable: no-inferrable-types
    public MUTED: boolean = false;
    public assets: Preloader; // Assets; //
    public DEV: false;

    public PLAYER_SLOT: string;
    public SETTINGS_SLOT: string;
    public PARAMETES_SLOT: string;

    public SETTINGS: object;
    public PLAYER: object;
    public PARAMETERS: object;

    // protected memory: Memory;
    protected volumes: [];
    protected channels: [];
    protected isBuilded: boolean;
    protected loops: Loop[];

    protected transmission: Transmission;
    // protected transmissionClass: Class;
    protected orientationType: number;


    constructor(name: string, gd: string = null, pd: string = null, ot = Game.PORTRAIT_ORIENTATION) {
        super(null, name);

        this.orientationType = ot;
        this.loops = [];
        this.channels = [];
        // this.memory = new Memory(gd, pd);

        this.visible = true;
    }

    public loadParameters(): void {
        const params: any = this.load(this.PARAMETES_SLOT);
        if (params.positions) {
            for (const l of this.loops) {
                for (const p of params.positions) {
                    if (p.n === l.Name) {
                        l.PositionsData = p.p;
                    }
                }
            }
        }
    }

    public saveParameters(): void {
        const params: any = this.PARAMETERS = {positions: []};

        for (const l of this.loops) {
            if (l.Name !== 'PosEditor') {
                params.positions.push({n: l.Name, p: l.PositionsData});
            }
        }
        this.save(this.PARAMETES_SLOT, params);
    }

    public start(a: Preloader, w: number, h: number, mw: number, mh: number): void {
        this.RW = this.W = w;
        this.RH = this.H = h;
        this.MW = mw;
        this.MH = mh;
        console.log('GAME: [' + w + ',' + h + '] WINDOW: [' + this.game.MW + ',' + this.game.MH + ']');

        this.assets = a;
        // this.System.pauseForGCIfCollectionImminent(0);
        // this.System.gc();


        this.startS = this.scale.x;
        // Framework.getTop().scale.x = Framework.getTop().scale.y = this.scale.x;
        this.build();
        this.resize(mw, mh, mw, mh);

        if (this.MUTED)
        {
            SoundController.getInstance().resumeAudio();
        }else
        {
            SoundController.getInstance().playAudio();
        }
    }

    public build(): void {
        this.isBuilded = true;
        this.addLoop(this.transmission = new Transmission(this)); // this.addLoop(this.transmission = new transmissionClass(this));

        // addEventListener(starling.events.Event.ENTER_FRAME, h_update);
        // this.stage.addEventListener(starling.events.KeyboardEvent.KEY_DOWN, this.h_keyboard);
    }

    public reposition(): void {
        for (const l of this.loops) {
            l.Scale = this.scale.x;
            l.x = (this.MW / this.scale.x - this.RW) / 2;
            l.y = (this.MH / this.scale.x - this.RH) / 2;
        }
    }

    public screenTo(screens: Loop[], out: Loop[]): void {
        this.transmission.start(screens, out);
    }

    public addLoop(l: Loop): Loop {
        this.loops.push(l);
        this.addChild(l);
        // l.addEventListener(Game.CHANGED, this.h_changed);
        return l;
    }

    public load(slot: string): any {
        /* const obj: any = this.memory.load(slot);
        if (obj) {
            return obj;
        }
        if (this.PARAMETES_SLOT === slot) {
            obj = this.memory.getParamData();
        }
        if (this.SETTINGS_SLOT === slot) {
            obj = this.memory.getGameData();
        }
        return obj; */
    }

    public save(slot: string, obj: object): void {
        // memory.save(slot, obj);
    }

    public unpause(): void {
        // const muteEvent: GameEvent = new GameEvent(GameEvent.GAME_MUTE, false, false);
        // muteEvent.flag = false;
        // Constants.EVENT_DISPATCHER.dispatchEvent(muteEvent);
        this.muteSounds(false);
        this.PAUSED = false;
    }

    public pause(): void {
        // const muteEvent: GameEvent = new GameEvent(GameEvent.GAME_MUTE, false, false);
        // muteEvent.flag = true;
        // Constants.EVENT_DISPATCHER.dispatchEvent(muteEvent);
        this.muteSounds(true);
        this.PAUSED = true;
    }

    public resize(mw: number, mh: number, rmw: number, rmh: number): void {
        const sw = rmw / this.W;
        const sh = rmh / this.H;
        this.RW = this.W;
        this.RH = this.H;

        if (sw > sh) {
            this.scaleType = 2;
            this.scale.x = this.scale.y = sh;
            switch (this.orientationType) {
                case Game.LANDSCAPE_ORIENTATION:
                    this.RW = rmw / sh;
                    break;
                case Game.PORTRAIT_ORIENTATION:
                    break;
            }
        } else {
            this.scaleType = 1;
            this.scale.x = this.scale.y = sw;
            switch (this.orientationType) {
                case Game.LANDSCAPE_ORIENTATION:
                    break;
                case Game.PORTRAIT_ORIENTATION:
                    this.RH = rmh / sw;
                    break;
            }
        }

        this.MW = rmw;
        this.MH = rmh;

        this.reposition();

        // clipRect = new Rectangle((MW / this.scale.x - RW) / 2, (MH / this.scale.x - RH) / 2, RW, RH);
        // this.mask = new Graphics( this.RW, this.RH);
        // this.mask.x = (this.MW / this.scale.x - this.RW) / 2;
        // this.mask.y = (this.MH / this.scale.x - this.RH) / 2;
    }

    /** override */
    public update(delta: number): void {
        if (this.isBuilded && !this.PAUSED) {
            for (const l of this.loops) {
                if (l.visible) { l.update(delta); }
            }
        }
    }

    public muteSounds(v: boolean): void {
        // const muteEvent: GameEvent = new GameEvent(GameEvent.GAME_MUTE, false, false);
        if (v && this.MUTED === false) {
            // muteEvent.flag = true;
            this.MUTED = true;
            SoundController.getInstance().pauseAudio();
        }
        if (!v && this.MUTED === true) {
            // muteEvent.flag = false;
            this.MUTED = false;
            SoundController.getInstance().resumeAudio();
        }
    }

    public stopSound(n: string): void {
    }

    public playSound(n: string, loop: boolean | number, flag: boolean | number, volume = -1): void {
        if (flag) {
            if (n.length > 0){
                SoundController.getInstance().playSound(n, Boolean(loop));
            }
        }
    }

    public getTexture(name: string): Texture {
        return this.assets.getTexture(name);
    }

    public getImage(name: string): Sprite {
        return new Sprite(this.getTexture(name));
    }

    public newAnimation(textureNames: string[], at = 0): Animation
    {
        return new Animation(this, this.assets.getTexturesByNames(textureNames), textureNames, at);
    }

    // listeners
    /* private h_update(e: any): void { // } starling.events.Event): void {
        this.update();
    }*/

    private h_changed(e: any): void { // starling.events.Event): void {
    }

    protected h_focus(e: any): void { // : flash.events.Event): void {
        switch (e.type) {
            case 'deactivate': // flash.events.Event.DEACTIVATE:
                this.pause();
                break;
            case 'activate': // flash.events.Event.ACTIVATE:
                this.unpause();
                break;
        }
    }

    protected h_keydown(e: any): void { // : flash.events.KeyboardEvent): void {
        if (e.keyCode === 'back') { // Keyboard.BACK) {
            for (const l of this.loops) {
                if (l.visible) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    l.go_back();
                }
            }
        }
        else if (e.keyCode === 'home') { //  Keyboard.HOME) {
            // handle the button press here.
        }
        else if (e.keyCode === 'menu') { //  Keyboard.MENU) {
            // handle the button press here.
        }
    }

    /*
    private static h_keyboard(e:starling.events.KeyboardEvent): void {
        if (e.keyCode === Keyboard.SPACE)
            Starling.current.showStats = !Starling.current.showStats;
        else if (e.keyCode === Keyboard.X)
            Starling.context.destroy();
    }*/

    public cleanup(): void {
        /*
        CONFIG::air{
            NativeApplication.nativeApplication.removeEventListener(flash.events.Event.ACTIVATE, h_focus);
            NativeApplication.nativeApplication.removeEventListener(flash.events.Event.DEACTIVATE, h_focus);
        }*/
        SoundController.getInstance().stopAudio();
        this.MUTED = true;

        while (this.loops.length) {
            // this.loops[0].removeEventListener(Game.CHANGED, this.h_changed);
            this.removeChild(this.loops[0]);
            (this.loops[0]).destroy();
            this.loops.splice(0, 1);
        }

        this.assets.destroy();

        this.removeAll(this);
        this.loops = null;
        this.assets = null;
        this.PLAYER_SLOT = null;
        this.SETTINGS_SLOT = null;
        this.SETTINGS = this.PLAYER = null;
        // memory = null;
        this.transmission = null;
        // transmissionClass = null;

        this.destroy();

        if (this.parent)
        {
            this.parent.removeChild(this);
        }
        this.removeChildren();
    }
}
