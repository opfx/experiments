import { Sprite, Texture, Point } from 'pixi.js';
import { IPoint } from '../interfaces';
import { Config } from '../config';

export class LayoutImage extends Sprite {
    public static readonly DEFAULT_ANCHOR: Point = new Point(0.5, 0.5);
    public textureName: string;
    public px: number;
    public py: number;
    public scaleType: string;

    public textureWidth: number;
    public textureHeight: number;

    private startScale: number;
    public scaleX = 1;
    public scaleY = 1;
    private alignPoint: IPoint = null;

    /**
     * 
     * @param textureName 
     * @param px 
     * @param py 
     * @param scaleType 
     * @param scale 
     * @param anchor - new: default anchor is set to (0.5, 0.5)!
     * @param alignPoint - added for backward compatibility with lqs.LImage for porting flash games. To use it set anchor to top-left == {x:0, y:0} and then set alignPoint to {x:0.5, y:0.5} - So you align to center but anchor point will be at TOP-LEFT CORNER
     */
    constructor(textureName: string, px: number, py: number, scaleType: string, scale: number = 1, anchor: IPoint = LayoutImage.DEFAULT_ANCHOR, alignPoint: IPoint = null) {
        super(Texture.from(textureName));

        if (anchor !== null) {
           this.anchor.set(anchor.x, anchor.y);
        }
 
        this.textureName = textureName;
        this.px = px;
        this.py = py;
        this.scaleType = scaleType;
        this.startScale = scale;
        this.alignPoint = alignPoint;

        this.textureWidth = this.width;
        this.textureHeight = this.height;

        this.resize(Config.RW, Config.RH, Config.adjustedLayoutWidth, Config.adjustedLayoutHeight, Config.orientation, false);
    }

    public setTexture(textureName: string): void {
        if (this.textureName !== textureName) {
            this.texture = Texture.from(textureName);
            this.textureName = textureName;
        }
    }

    /**
     * 
     * @param w adjustedLayoutWidth 
     * @param h adjustedLayoutHeight
     * 
     * @param ifSetPositionAfterResize - added to turn off when resizing scrolling bacggrounds to prevent 'jump', but they should handle position themselves to prevent gaps
     */
    public resize(artLayoutWidth: number, artLayoutHeight:number, adjustedLayoutWidth: number, adjustedLayoutHeight: number, orientation: string, orientationChanged: boolean, ifSetPositionAfterResize: boolean = true): void {
        let scaleX = 1,  scaleY = 1;

        switch (this.scaleType) {
            case LayoutImageType.FIT_HEIGHT:
                this.scaleX = this.scaleY = artLayoutHeight / this.textureHeight;
                    break;

            case LayoutImageType.FIT_WIDTH:
                scaleX = scaleY = artLayoutWidth / this.textureWidth;
                    break;

            case LayoutImageType.FIT_TO_RECT:
                scaleY = artLayoutHeight / this.textureHeight;
                scaleX = artLayoutWidth / this.textureWidth;
                    break;

            case LayoutImageType.FIT_TO_RECT2:
            case LayoutImageType.FIT_TO_MAX_SIZE:
                // scaleX = scaleY = Math.max(artLayoutWidth / this.textureWidth, artLayoutHeight / this.textureHeight);
                // temporary when container is'nt scaled
                scaleX = scaleY = Math.max(artLayoutWidth / this.textureWidth, artLayoutHeight / this.textureHeight);
                    break;

            // --- ABS SCALE
            case LayoutImageType.EXTERNAL_SCALE:
                    scaleX = scaleY = this.startScale;
                    break;
            case LayoutImageType.NO_SCALE:
                    scaleX = scaleY = 1;
                    break;
                    
            // --- 
            case LayoutImageType.FIT_ALL_HEIGHT:
                this.scaleX = this.scaleY = adjustedLayoutHeight / this.textureHeight;
                    break;

            case LayoutImageType.FIT_ALL_WIDTH:
                scaleX = scaleY = adjustedLayoutWidth / this.textureWidth;
                    break;

            case LayoutImageType.FIT_TO_ALL_RECT:
                scaleY = adjustedLayoutHeight / this.textureHeight;
                scaleX = adjustedLayoutWidth / this.textureWidth;
                    break;

            case LayoutImageType.FIT_TO_ALL_MAX_SIZE:
                // scaleX = scaleY = Math.max(adjustedLayoutWidth / this.textureWidth, adjustedLayoutHeight / this.textureHeight);
                // temporary when container is'nt scaled
                scaleX = scaleY = Math.max(adjustedLayoutWidth / this.textureWidth, adjustedLayoutHeight / this.textureHeight);
                    break;


        }

        this.scaleTo(scaleX, scaleY);
        
        if (ifSetPositionAfterResize) {
            this.x = this.px;
            this.y = this.py;

            // align using current size after scaling
            if (this.alignPoint) {
                this.x = this.px - this.alignPoint.x * this.width;
                this.y = this.py - this.alignPoint.y * this.height;
            }
        }
    }

    public scaleTo(scaleX: number, scaleY: number) {
        this.scaleX = scaleX;
        this.scaleY = scaleY;

        this.scale.set(scaleX, scaleY);
    }
}

export enum LayoutImageType {
    ORIGIN_Y = 'ORIGIN_Y',
    ORIGIN = 'ORIGIN',
    FIT_HEIGHT = 'FIT_HEIGHT',
    FIT_WIDTH = 'FIT_WIDTH',
    FIT_TO_RECT = 'FIT_TO_RECT',
    FIT_TO_RECT2 = 'FIT_TO_RECT2',
    FIT_TO_MAX_SIZE = 'FIT_TO_MAX_SIZE',
    EXTERNAL_SCALE = 'EXTERNAL_SCALE',
    FIT_ALL_HEIGHT = 'FIT_ALL_HEIGHT',
    FIT_ALL_WIDTH = 'FIT_ALL_WIDTH',
    FIT_TO_ALL_RECT = 'FIT_TO_ALL_RECT',
    FIT_TO_ALL_MAX_SIZE = 'FIT_TO_ALL_MAX_SIZE',
    NO_SCALE = 'NO_SCALE',
}