import { ScreenController } from './screen-controller';
import { Container, Graphics } from 'pixi.js';
import { Config } from '../config';

export class ScreenTransmission extends Graphics {
    public name: string;
    //private graphics: Graphics;

    private outScreen: ScreenController;
    private inScreen: ScreenController;

    private speed: number;
    private color: number;
    private counter: number;
    private isFadeIn: boolean;
    private isStarted: boolean;

    constructor(speed: number = .1, color: number = 0xcccccc) { // 0x1099bb
        super();
        this.name = 'Transmission';
        this.speed = speed / Config.FPS_MODIFIER;
        this.color = color;
    }

    public start(inScreen: ScreenController, outScreen: ScreenController): void {
        console.log(' --- [ScreenTransmission] >>> from: ' + (outScreen? outScreen.name : null) + ', to: ' + (inScreen? inScreen.name : null));
        console.log('     [ScreenTransmission] old this.outScreen: ' + (this.outScreen? this.outScreen.name : null) + ', this.inScreen: ' + (this.inScreen? this.inScreen.name : null));
        console.log('     [ScreenTransmission] state this.isStarted: ' + this.isStarted + ', this.counter: ' + this.counter);
        if (this.inScreen === inScreen) {
            if (this.isStarted) {
                console.log('     [ScreenTransmission] WARNING this.inScreen === inScreen >> RETURN');
                return;
            } else {
                inScreen.hide();
            }
        }
        this.inScreen = inScreen;
        this.outScreen = outScreen;

        if(this.isStarted) {
            if (this.counter >= 1) {
                this.counter = 1;
                this.middle();
            }

        } else {
            this.counter = 0;
            this.isFadeIn = true;
            this.isStarted = true;
        }

        this.alpha = 0;        
        this.visible = true;
    }

    public update(): void {
        this.counter += this.speed;

        if(this.counter < 1) {
            this.alpha = this.counter;
            if(this.speed + this.counter > 1) {
                this.alpha = 1;
            }
            
        } else {
            this.alpha = 2 - this.counter;
            if(this.isFadeIn) {
                this.middle();
            }
            if(this.counter > 2) {
                this.visible = false;
                this.isStarted = false;
            }
        }
    }

    public middle(): void {
        this.isFadeIn = false;
        if (this.outScreen) {
            this.outScreen.hide();
        }

        if (this.inScreen) {
            this.inScreen.show();
            this.inScreen.init();
            this.inScreen.resize(Config.artLayoutWidth, Config.artLayoutHeight, Config.adjustedLayoutWidth, Config.adjustedLayoutHeight, Config.orientation, false);

        }
        this.alpha = 1;
    }

    public redrawBack():void {
        this.clear();
        this.beginFill(this.color, 1);
        this.drawRect(Config.topLeftInternalVisibleX, Config.topLeftInternalVisibleY, Config.adjustedLayoutWidth, Config.adjustedLayoutHeight);
        this.endFill();
    }

    /** reason to add reset(): when clicking angular 'quit' button or confirmation dialog for 'quit' 
     *      - the pixiJS gpu click is triggered! 
     * Use the function when coming from angular screen. */
    public reset(): void {
        this.visible = false;
        this.isStarted = false;
    }
}