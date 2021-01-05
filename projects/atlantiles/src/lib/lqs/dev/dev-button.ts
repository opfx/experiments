/**
 * Created by Fundemic and handed to Ganz 25.08.2015.
 */
import { Container } from 'pixi.js';
import { IContainer } from '.././icontainer';
import { LEvent } from '.././levent';

export class DevButton extends Container implements IContainer {
    protected isOver: boolean;
    protected isDown: boolean;
    protected isEnabled: boolean;
    protected isSelected: boolean;
    protected downScale: number;
    protected upScale: number;
    protected overScale: number;
    private lastScale: number;

    constructor(ds = .99, os =  1.1, us = 1) {
        super();

        this.isSelected = false;
        this.downScale = ds;
        this.overScale = os;
        this.upScale = us;
        this.scale.x = this.scale.y = this.upScale;

        // this.isEnabled = true;
        this.Enabled = true;
    }

    protected  redraw(): void {}

    public get Selected(): boolean { return this.isSelected; }

    public set Selected(v: boolean) {
        this.isSelected = v;
        this.redraw();
    }

    public set IsDown(v: boolean) {
        this.isDown = v;
    }

    public get Enabled(): boolean {
        return this.isEnabled;
    }

    public set Enabled(v: boolean) {
        this.isEnabled = v;
        this.alpha = this.isEnabled ? 1 : .3;

        this.interactive = v;
        this.buttonMode = v;

        // this.on('added', (d: DisplayObject) => void {} );
        // Mouse & touch events are normalized into
        // the pointer* events for handling different
        // button events.
        if (this.isEnabled)
        {
            this
            // set the mousedown and touchstart callback...
            .on('mousedown', this.onButtonDown)
            .on('touchstart', this.onButtonDown)

            // set the mouseup and touchend callback...
            .on('mouseup', this.onButtonUp)
            .on('touchend', this.onButtonUp)
            .on('mouseupoutside', this.onButtonUp)
            .on('touchendoutside', this.onButtonUp)

            // set the mouseover callback...
            .on('mouseover', this.onButtonOver)
            // set the mouseout callback...
            .on('mouseout', this.onButtonOut);

            // you can also listen to click and tap events :
            // .on('click', this.onClick)
            // .on('tap', this.onClick);
        }else
        {
            this
            .off('mousedown', this.onButtonDown)
            .off('touchstart', this.onButtonDown)
            .off('mouseup', this.onButtonUp)
            .off('touchend', this.onButtonUp)
            .off('mouseupoutside', this.onButtonUp)
            .off('touchendoutside', this.onButtonUp)
            .off('mouseover', this.onButtonOver)
            .off('mouseout', this.onButtonOut);
        }
    }

    /** https://codepen.io/ulx/pen/YZWYja */
    protected onButtonDown(): void {
        // console.log('[dev-button].onButtonDown()');

        /*
        this.isdown = true;
        this.texture = textureButtonDown;
        this.alpha = 1;
        */

        this.isOver = true;
        this.IsDown = true;
        this.scale.x = this.scale.y = this.downScale;
        this.emit(LEvent.DEV_BUTTON_DOWN, LEvent.DEV_BUTTON_DOWN, this);
    }

    protected onButtonUp(): void {
        /*
        this.isdown = false;
        if (this.isOver) {
           this.texture = textureButtonOver;
        }
        else {
            this.texture = textureButton;
        }
        */

       this.IsDown = false;
       if (this.isOver && this.isEnabled) {
           this.emit(LEvent.DEV_BUTTON, LEvent.DEV_BUTTON, this); // (new LEvent(LEvent.DEV_BUTTON));
       }
       this.emit(LEvent.DEV_BUTTON_CLICK, LEvent.DEV_BUTTON_CLICK, this); // new LEvent(LEvent.DEV_BUTTON_CLICK)

       this.isOver = false;
       this.scale.x = this.scale.y = this.upScale;
    }

    /*protected onClick(): void
    {
    }*/

    protected onButtonUpOutside(): void {
        this.IsDown = false;
        this.isOver = false;
        this.scale.x = this.scale.y = this.upScale;
    }

    protected onButtonOver(): void {
        /*
        this.isOver = true;
        if (this.isdown) {
            return;
        }
        this.texture = textureButtonOver;
        */

       this.isOver = true;
       this.scale.x = this.scale.y = this.overScale;
    }

    protected onButtonOut(): void {
        /*
        this.isOver = false;
        if (this.isdown) {
            return;
        }
        this.texture = textureButton;
        */
        this.isOver = false;
        this.scale.x = this.scale.y = this.upScale;
    }

    /** Decorators for as3 addEventListener, removeEventListener, dispatchEvent */
    public addEventListener(type: string, callback: (event: Event) => void ): void
    {
       this.addListener(type, callback);
    }

    public removeEventListener(type: string, callback: (event: Event) => void ): void
    {
        this.removeListener(type, callback);
    }

    protected dispatchEvent(type: string | symbol): void {
        this.emit(type, arguments);
    }

    // listeners
    /*
    protected  h_touch(e: TouchEvent): void {
        const touches: Touch[] = e.touches;
        for (const t of touches) {
            // console.log(t.phase + " " +  e.getTouch(this, TouchPhase.HOVER) + " " + e.getTouch(this, TouchPhase.MOVED));
            switch (t.phase) {
                case TouchPhase.HOVER:
                case TouchPhase.MOVED:
                    const HELPER_POINT: Point = new Point(t.globalX, t.globalY);
                    this.globalToLocal(HELPER_POINT, HELPER_POINT);
                    if (this.hitTest(HELPER_POINT) !== null) {
                        if (this.isDown) {
                            this.isOver = true;
                            this.scale.x = this.scale.y = this.downScale;
                        } else {
                            this.isOver = true;
                            this.scale.x = this.scale.y = this.overScale;
                        }
                    } else {
                        this.isOver = false;
                        this.scale.x = this.scale.y = this.upScale;
                    }
                    break;
                case TouchPhase.BEGAN:
                    this.isOver = true;
                    this.IsDown = true;
                    this.scale.x = this.scale.y = this.downScale;
                    this.emit(new LEvent(LEvent.DEV_BUTTON_DOWN));
                    break;
                case TouchPhase.ENDED:
                    this.IsDown = false;
                    if (this.isOver && this.isEnabled) {
                        this.emit(new LEvent(LEvent.DEV_BUTTON));
                    }
                    this.emit(new LEvent(LEvent.DEV_BUTTON_CLICK));

                    this.isOver = false;
                    this.scale.x = this.scale.y = this.upScale;
                    break;
            }
        }
    }*/

    public destroy(): IContainer {
        // removeEventListener('click', this.h_touch);
        return this;
    }
}
