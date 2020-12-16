import { Sprite, Texture, Container } from 'pixi.js';
import { IButtonClickHandler } from '../interfaces';

export class ContainerButton extends Container {
    public textureName: string;
    private downScale: number;
    private overScale: number;
    private upScale: number;

    protected isDown: boolean;
    protected isOver: boolean;
    protected isEnabled: boolean;

    public id: string;
    protected buttonClickHandler: IButtonClickHandler;

    constructor(id: string, buttonClickHandler: IButtonClickHandler, downScale: number = 1, overScale: number = NaN, upScale: number = NaN) {
        super();
        this.id = id;
        this.buttonClickHandler = buttonClickHandler;

        downScale = isNaN(overScale) ? downScale * .92 :  downScale;
        overScale = overScale || downScale * 1.08;
        upScale = upScale || downScale;
        this.downScale = downScale;
        this.overScale = overScale;
        this.upScale = upScale;

        this.isEnabled = true;
        // button is using one image and scale for indicating it's state - make anchor point in center
        this.scale.set(upScale);

        this.interactive = true;
        this.buttonMode = true;

        this
        // Mouse & touch events are normalized into
        // the pointer* events for handling different
        // button events.
            .on('pointerdown', this.onButtonDown)
            .on('pointerup', this.onButtonUp)
            .on('pointerupoutside', this.onButtonUp)
            .on('pointerover', this.onButtonOver)
            .on('pointerout', this.onButtonOut);
    
        // Use mouse-only events
        // .on('mousedown', onButtonDown)
        // .on('mouseup', onButtonUp)
        // .on('mouseupoutside', onButtonUp)
        // .on('mouseover', onButtonOver)
        // .on('mouseout', onButtonOut)
    
        // Use touch-only events
        // .on('touchstart', onButtonDown)
        // .on('touchend', onButtonUp)
        // .on('touchendoutside', onButtonUp)
    }

    private onButtonDown(): void {
        if (this.isEnabled) {
            this.isDown = true;
            // this.texture = textureButtonDown;
            this.scale.set(this.downScale);
            this.alpha = 1;
        }
    }
    
    /** arg is InteractionEvent */
    private onButtonUp(arg): void {
        if (this.isEnabled) {
            this.isDown = false;

            // isOver or Device
            // if (this.isOver) {
            if (arg.type === 'pointerup') {
                // this.texture = textureButtonOver;
                this.scale.set(this.overScale);
                // execute
                this.execute();
             
            // 'pointerupoutside'
            } else {
                // this.texture = textureButton;
                this.scale.set(this.upScale);

            }
        }
    }
    
    private onButtonOver(): void {
        if (this.isEnabled) {
            this.isOver = true;
            if (this.isDown) {
                return;
            }
            // this.texture = textureButtonOver;
            this.scale.set(this.overScale);
        }
    }
    
    private onButtonOut(): void {
        if (this.isEnabled) {
            this.isOver = false;
            if (this.isDown) {
                return;
            }
            // this.texture = textureButton;
            this.scale.set(this.upScale);
        }
    }

    private execute(): void {
        if (this.buttonClickHandler) {
            this.buttonClickHandler.executeButtonClick(this.id);
        }
    }
}