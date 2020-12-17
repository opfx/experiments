/**
 * Created by Fundemic and handed to Ganz 14.09.2015.
 */
import { Point, Sprite } from 'pixi.js';
import { IContainer } from './icontainer';
import { Game } from './game';

export class LImage extends Sprite implements IContainer {
    public static readonly FIT_WIDTH = -1;
    public static readonly FIT_HEIGHT = -2;
    public static readonly FIT_TO_MAX_SIZE = -3;
    public static readonly FIT_TO_RECT = -4;
    public static readonly ORIGIN = -5;
    public static readonly ORIGIN_Y = -6;

    private game: Game;
    private point: Point;

    constructor(g: Game, tn: string, px: number, py: number, s: number, anchor: Point = null) {
        super(g.assets.getTexture(tn));

        this.game = g;
        if (s < 0) {
            switch (s) {
                case LImage.ORIGIN_Y:
                    this.scale.x = this.scale.y = g.RH / g.H;
                    break;

                case LImage.ORIGIN:
                    this.scale.x = this.scale.y = g.RW / g.W;
                    break;

                case LImage.FIT_HEIGHT:
                    this.scale.x = this.scale.y = g.RH / this.height;
                    break;

                case LImage.FIT_TO_RECT:
                    this.scale.y = g.RH / this.height;
                    this.scale.x = g.RW / this.width;
                    break;

                case LImage.FIT_WIDTH:
                    this.scale.x = this.scale.y = g.RW / this.width;
                    break;

                case LImage.FIT_TO_MAX_SIZE:
                    this.scale.x = this.scale.y = Math.max(g.RW / this.width, g.RH / this.height);
                    break;
            }

        } else {
            this.scale.x = this.scale.y = s;
        }

        if (anchor) {
            this.x = px - anchor.x * this.width;
            this.y = py - anchor.y * this.height;
        } else {
            this.x = px - .5 * this.width;
            this.y = py - .5 * this.height;
        }
        this.point = new Point(this.x, this.y);
    }

    public setTexture(t: string): void {
        this.texture = this.game.assets.getTexture(t);
    }

    public destroy(): IContainer {
        this.game = null;
        this.point = null;

        return this;
    }

    public set Start(v: Point) {
        this.point = v;
    }

    public get Start(): Point {
        return this.point;
    }

    public get Scale(): number {
        return this.scale.x;
    }

    public set Scale(v: number) {
        this.scale.x = this.scale.y = v;
    }
}
