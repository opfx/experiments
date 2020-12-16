import { Config } from '../config';
import { ScreenController } from './screen-controller';
import { Container } from 'pixi.js';
import { ScreenTransmission } from './transmission';

export class BaseController {
    private screens0: Screen[] = [];
    private isBuilded: boolean;
    protected container: Container;
    protected loops: ScreenController[] = [];
    protected transmission: ScreenTransmission;

    protected artLayoutWidth: number;
    protected artLayoutHeight: number;
    protected displayScreenWidth: number;
    protected displayScreenHeight: number;

    protected scaleX = 1.0;
    protected scaleY = 1.0;
    protected minScale = 1.0;
    protected maxScale = 1.0;

    /** we are about to scale to minScale to make all visible, but we will have an extra width or extra height 
     *      - due to aspect ratio change or orientation change */
    protected scale = 1.0;
    protected adjustedLayoutWidth: number;
    protected adjustedLayoutHeight: number;
    
    protected extraWidthExternal: number;
    protected extraHeightExternal: number;

    protected orientation: string = null;
    protected orienationChanged: boolean;

    constructor(stage: Container, artLayoutWidth: number, artLayoutHeight: number) {
        Config.RW = Config.adjustedLayoutWidth = Config.W = this.artLayoutWidth = artLayoutWidth;
        Config.RH = Config.adjustedLayoutHeight = Config.H = this.artLayoutHeight = artLayoutHeight;
        
        Config.artLayoutWidth = artLayoutWidth;
        Config.artLayoutHeight = artLayoutHeight;
        Config.artSizeDevicePixelRatioFactor = 1/3 /0.3;

        stage.addChild(this.container = new Container());
    }

    protected build(): void {
        if (!this.isBuilded) {
            this.isBuilded = true;
            this.container.addChild(this.transmission = new ScreenTransmission());
        }
    }

    public start(displayScreenWidth: number, displayScreenHeight: number):void {
    }

    public resize(displayScreenWidth: number, displayScreenHeight: number): void {
        Config.screenWidth = this.displayScreenWidth = displayScreenWidth;
        Config.screenHeight = this.displayScreenHeight = displayScreenHeight;

        const newOrientation: string = this.displayScreenWidth >= this.displayScreenHeight? Config.LANDSCAPE_ORIENTATION : Config.PORTRAIT_ORIENTATION;
        this.orienationChanged = this.orientation && this.orientation !== newOrientation? true : false;
        Config.orientation =  this.orientation = newOrientation;
        
        this.scaleX = this.displayScreenWidth / this.artLayoutWidth;
        this.scaleY = this.displayScreenHeight / this.artLayoutHeight;

        this.minScale = Math.min(this.scaleX, this.scaleY);
        this.maxScale = Math.max(this.scaleX, this.scaleY);

        Config.scale = this.scale = this.minScale; //fit everythimng.
        
        // let's make scale external, so screen will be operate in old dimensions: this.artLayoutWidth x this.artLayoutHeight, but with extra this.extraWidthInternal OR this.extraHeightInternal
        this.extraWidthExternal = this.displayScreenWidth - this.artLayoutWidth * this.scale;
        this.extraHeightExternal = this.displayScreenHeight - this.artLayoutHeight * this.scale
        Config.extraWidthInternal = this.displayScreenWidth / this.scale - this.artLayoutWidth;
        Config.extraHeightInternal = this.displayScreenHeight / this.scale - this.artLayoutHeight;
        Config.topLeftInternalVisibleX = - Config.extraWidthInternal/2;
        Config.topLeftInternalVisibleY = - Config.extraHeightInternal/2;

        /*Config.RW =*/ Config.adjustedLayoutWidth = this.adjustedLayoutWidth = this.artLayoutWidth * this.scaleX / this.scale; // this.adjustedLayoutWidth = this.artLayoutWidth + this.extraWidthInternal;
        /*Config.RH =*/ Config.adjustedLayoutHeight = this.adjustedLayoutHeight = this.artLayoutHeight * this.scaleY / this.scale; // this.adjustedLayoutHeight = this.artLayoutHeight + this.extraHeightInternal;

        this.resizeVisibleLoops();
    }

    protected resizeVisibleLoops(): void {
        if (this.transmission.visible) {
            this.transmission.redrawBack();
        }
        for (const controller of this.loops) {
            if (controller.container.visible) { // commented as of first one transition
                controller.resize(Config.artLayoutWidth, Config.artLayoutHeight, this.adjustedLayoutWidth, this.adjustedLayoutHeight, this.orientation, this.orienationChanged);
            }
        }
    }

    public addLoop(s: ScreenController, at: number = -1): ScreenController {
        this.loops.push(s);

        if(at >= 0) {
            this.container.addChildAt(s.container, at);
        } else {
            this.container.addChild(s.container);
        }

        this.container.setChildIndex(this.transmission, this.container.children.length - 1);

        s.container.visible = false;
        s.addEventListener(this);

        this.container.setChildIndex(this.transmission, this.container.children.length - 1);

        return s;
    }

    public screenTo(screenController: ScreenController, out: ScreenController):void {
        this.transmission.redrawBack();
        this.transmission.start(screenController, out);
    }

    /** overriden: first update all models, than - all views */
    public update(delta: number):void {
        for (const controller of this.loops) {
            if (controller.container.visible) {
                controller.update(delta);
            }
        }

        if (this.transmission.visible) { 
            this.transmission.update();
        }
    }

    /** listener for screen-conrellers */
    public execute(callerId: string, eventType: string): void {}

    public loadParameters(): void {}
    public saveParameters():void {}
}