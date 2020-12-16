import { Point } from 'pixi.js';
import { IPoint } from '../interfaces';
import { Config } from '../config';
import { LayoutImage } from './layout-image';

export class MovingImage extends LayoutImage {
    public sp: Point;
    private phase = 0;
    private scaleSS: number;
    private phaseR: number;
    private scaleR: number;
    private amp: number;

    constructor(textureName: string, px: number, py: number, scaleType: string, scale: number = 1, anchor: IPoint = LayoutImage.DEFAULT_ANCHOR) {
        super(textureName, px, py, scaleType, scale, anchor);

        this.sp = new Point(this.x, this.y);
        this.scaleSS = this.scale.x;
        this.amp = Config.RW * .007;
    }

    public setAmplitude(v: number):void {
        this.amp = Config.RW * v;
    }

    public setPosition(px: number, py: number):void {
        this.sp = new Point(isNaN(px) ? this.sp.x : px, isNaN(py) ? this.sp.y : py);
        
        this.x = this.sp.x;
        this.y = this.sp.y;
    }

    /**
     * Removed, as sprite has an anchor = (0.5, 0.5):
     *      this.x = this.sp.x +  this.textureWidth/2 * (this.scaleSS - scaleX);
     *      this.y = this.sp.y + Math.sin(this.phase) * this.amp + this.textureHeight/2 * (this.scaleSS - scaleX);
     * @param ss 
     * @param ps 
     */
    public move(ss: number, ps: number):void {
        let scaleX: number = this.scale.x;

        this.phase += ss * this.phaseR / Config.FPS_MODIFIER;
        scaleX += (this.scaleSS - scaleX) * ps * this.scaleR / Config.FPS_MODIFIER;

        this.y = this.sp.y + Math.sin(this.phase) * this.amp;
        this.scale.set(scaleX);
    }

    public init(s: number = 0):void {
        this.scaleR = Math.random() * .2 + .8;
        this.phaseR = Math.random() * .2 + .8;
        this.phase = Math.random() * 100;

        const scaleX2: number = (s >= 0) ? s : this.scaleSS;
        this.scale.set(scaleX2);
    }

    /** return texture.height * this.scaleSS;  */
    public get H(): number {
        return this.textureHeight * this.scaleSS;
    }

    /** return texture.width * this.scaleSS; */
    public get W(): number {
        return this.textureWidth * this.scaleSS;
    }
}