import { Container, Text, TextStyle, Point } from 'pixi.js';
import { IBaseAndScreenController } from '../interfaces';

export class Layout extends Container {
    public screenController: IBaseAndScreenController;
    
    protected readonly centerAnchor: Point = new Point(0.5, 0.5);
    private style0 = new TextStyle({
        fill: 0xFFFFFF,
        fontSize: 64,
        align: 'center',
        fontWeight: 'bold'
    });

    constructor(screenController: IBaseAndScreenController) {
        super();
        this.screenController = screenController;
    }

    protected create(): void {
        this.createLayout();
        this.createEtc();
    }

    protected createLayout(): void {}
    protected createEtc(): void {}
    
    public init(): void {}
    public update(): void {}
    public resize(artLayoutWidth: number, artLayoutHeight: number, adjustedLayoutWidth: number, adjustedLayoutHeight: number, orienataion: string, orienationChanged: boolean): void {}

    /**
     * 
     * @param eventType to parent
     */
    public dispatchEvent(callerId: string, eventType: string): void {
        if (this.screenController) {
            this.screenController.execute(callerId, eventType);
        }
    }

    /** interface IButtonClickHandler
     * from children
     */
    public executeButtonClick(buttonId: string) {} 
    
    public cleanup(): void {
        this.removeChildren();

        this.screenController = null;
    }

    /* */
    protected createText(text: string, px: number, py: number, scale: number, color: number = 0, style: TextStyle = this.style0, anchor: Point = null): Text {
        style.fill = color
        if (style.fill !== color) {
            style = style.clone();
            style.fill = color;
        }
        const textSprite:Text = new Text(text, style);

        if (anchor) {
            textSprite.anchor.set(anchor.x, anchor.y);
        }

        textSprite.scale.set(scale, scale);
        textSprite.x = px;
        textSprite.y = py;

        return textSprite;
    }
}