/**
 * Created by Fundemic and handed to Ganz 23.09.2015.
 */
import { Point, Texture, AnimatedSprite } from 'pixi.js';
import { IContainer } from './icontainer';
import { Game } from './game';

export class Animation extends AnimatedSprite implements IContainer {
    public static readonly EVENT_LOOP = 'EVENT_LOOP';

    private frames: Texture[];
    private animTime: number;
    private animTimer: number;
    private texNames: string[];
    private loopCount: number;
    private sp: Point;

    constructor(g: Game, frames: Texture[], texNames: string[], at = 0) {
        super(frames);

        this.texNames = texNames;
        this.animTimer = at;

        this.loopCount = 0;
        this.animTime = 0;
        // this.currentFrame = 0;
    }

    /*
    public static  fromAtlas(g: Game, tname: string, xmlClass: Class, at = 0): Animation {
        const xml: XML = XML(new xmlClass());
        const atlas: TextureAtlas = new TextureAtlas(g.getTexture(tname), xml);

        const movie: Animation = new Animation(g, null, at, atlas.getTextures(tname + "_"));
        atlas.destroy();
        return movie;
    } */

    public setPosition(px: number, py: number): void {
        this.sp = new Point(px, py);
    }

    public animate(maxFrame = -1): void {
        if (this.animTime++ > this.animTimer) {
            this.animTime = 0;
            if (maxFrame > 0) {
                if (this.currentFrame === maxFrame) {
                    this.gotoAndStop(0); // this.currentFrame = 0;
                    this.loopCount++;

                } else {
                   this.nextFrame();
                }
            } else {
                this.nextFrame();
            }

        }
    }

    public getCurrentTextureName(): string {
        return this.texNames[this.currentFrame];
    }

    public getTextureName(frameID: number): string {
        return this.texNames[frameID];
    }

    public set AnimTime(v: number) {
        this.animTime = v;
    }

    public get LoopCount(): number {
        return this.loopCount;
    }

    /*public get totalFrames(): number {
        return frames.length;
    }*/

    public get Scale(): number {
        return this.scale.x;
    }

    public set Scale(v: number) {
        this.scale.set(v, v);
    }

    public nextFrame(): void {
        if (this.currentFrame < this.totalFrames - 1) {
            this.gotoAndStop(this.currentFrame + 1); // this.currentFrame++;

        } else {
            this.gotoAndStop(0); // this.currentFrame = 0;
            this.loopCount++;
            this.emit(Animation.EVENT_LOOP); // dispatchEvent(new LEvent(Animation.EVENT_LOOP));
        }
    }

    public set StartPosition(p: Point) {
        this.sp = p;
        this.x = p.x;
        this.y = p.y;
    }

    public get StartPosition(): Point {
        return this.sp;
    }

    public destroy(): IContainer {
        this.frames.length = 0;
        this.texNames = null;
        return this;
    }
}
