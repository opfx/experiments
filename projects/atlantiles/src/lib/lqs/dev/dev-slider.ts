/**
 * Created by Fundemic and handed to Ganz 07.09.2015.
 */
import { Container, Graphics, DisplayObject, Point, Text, InteractionEvent, InteractionData } from 'pixi.js';
import { IContainer } from '.././icontainer';
import { LEvent } from '.././levent';

export class DevSlider extends Container implements IContainer {
    public static readonly INT_TYPE = 1;
    public static readonly FLOAT_TYPE = 0;
    private static HELPER_POINT: Point = new Point();

    private back: Graphics;
    private cursorlocal: Graphics;
    private color1 = 0x556677;
    private color2 = 0xaaffbb;
    private W: number;
    private H: number;
    private cursorPoint: Point;
    private downPoint: Point;
    private label: Text;
    private value: number;
    private text: string;

    private maxvalue: number;
    private minvalue: number;
    private valueType: number;


    constructor(w: number, h: number, px: number, py: number, t: string, min = 0, max = 1,
                vt = DevSlider.FLOAT_TYPE) {
        super();
        this.W = w;
        this.H = h;

        this.x = px;
        this.y = py;

        this.maxvalue = max;
        this.minvalue = min;
        this.valueType = vt;

        this.addChild(this.back = new Graphics());

        // const format: TextFormat = new TextFormat( 'fundemicFont', Math.floor(h * .9), 0xffffff); // Color.WHITE);
        const format: object = {fontFamily: 'fundemicFont', fontSize: Math.floor(h * .9), fill: 0xffffff, align: 'center'};
        this.addChild(this.label =  new Text(this.text = t, format));

        this.addChild(this.cursorlocal = new Graphics());
        // this.label.autoSize = TextFieldAutoSize.BOTH_DIRECTIONS;
        this.label.y = h * .1;
        this.redraw();

        this.alpha = 0.9;

        // add touchstart, touchend, touchendoutside, touchmove
        this.cursorlocal
            .on('mousedown', this.h_touch.bind(this))
            .on('mouseup', this.h_touch.bind(this))
            .on(' mouseupoutside', this.h_touch.bind(this));
        this.Value = 0;
    }

    protected  redraw(): void {
        let g: Graphics = this.back;
        g.clear();
        g.beginFill(this.color1, 1);
        g.drawRect(0, 0, this.W, this.H);
        g.endFill();

        g = this.cursorlocal;
        g.clear();
        g.beginFill(this.color2, .5);
        g.drawRect(1, 1, this.W * .2, this.H - 2);
        g.endFill();
    }

    public get Value(): number {
        return this.value;
    }

    public set Value(v: number) {
        if (this.valueType === 0) { this.value = v; }
        else { this.value = Math.floor(v / this.valueType) * this.valueType; }

        this.cursorlocal.x = (this.W - this.cursorlocal.width - 2) * ((this.value - this.minvalue) / (this.maxvalue - this.minvalue));
        const str: string = this.value.toString();

        this.label.text = this.text + ' ' + str.substr(0, Math.min(str.length, 7));
        this.label.x = (this.W - this.label.width) / 2;
    }

    // listeners
    // protected  h_touch(e: TouchEvent): void {
    /**
     * to fix see:
     *      https://pixijs.download/dev/docs/PIXI.DisplayObject.html#event:mousedown
     *      https://pixijs.download/dev/docs/PIXI.InteractionData.html
     */
    protected  h_touch(event: InteractionEvent): void 
    {
        const target: DisplayObject = event.target; // currentTarget
        const interactionData: InteractionData = event.data;
        const globalPoint: Point = interactionData.global;
        const localPoint: Point = interactionData.getLocalPosition(target, DevSlider.HELPER_POINT, globalPoint);

        switch (event.type) {
            case 'mousemoved':

                this.cursorlocal.x = this.cursorPoint.x + (DevSlider.HELPER_POINT.x - this.downPoint.x);
                this.cursorlocal.x = Math.max(Math.min(this.cursorlocal.x, this.W - this.cursorlocal.width - 2), 0);
                this.Value = (this.cursorlocal.x / (this.W - this.cursorlocal.width - 2))
                                                    * ((this.maxvalue - this.minvalue)) + this.minvalue;

                this.emit(LEvent.SLIDER_CHANGE, this.Value); // this.emit(LEvent.SLIDER_CHANGE, t); // const t of touches
                break;

            case 'mousedown':
                this.alpha = 1;

                this.downPoint = DevSlider.HELPER_POINT;
                this.cursorPoint = new Point(this.cursorlocal.x, this.cursorlocal.y);
                this.cursorlocal.on('mousemove', this.h_touch.bind(this));
                break;

            case 'mouseup':
                this.alpha = .9;
                this.downPoint = null;
                this.cursorPoint = null;
                this.cursorlocal.off('mousemove', this.h_touch.bind(this));
                break;
        }
    }

    public destroy(): IContainer {
        this.cursorlocal
        .off('mousedown', this.h_touch.bind(this))
        .off('mouseup', this.h_touch.bind(this))
        .off(' mouseupoutside', this.h_touch.bind(this));

        this.back = null;
        this.label = null;
        this.cursorlocal = null;
        this.downPoint = this.cursorPoint = null;
        return this;
    }
}
