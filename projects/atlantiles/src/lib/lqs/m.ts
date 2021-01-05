/**
 * Created by Fundemic and handed to Ganz 15.09.2015.
 */
import { Point } from 'pixi.js';

export class M {
    constructor() {
    }

    // math
    public static  Sign(value: number): number {
        return value / (Math.abs(value));
    }

    public static  mid(p1: Point, p2: Point, c: number): Point {
        return new Point(p1.x + (p2.x - p1.x) * c, p1.y + (p2.y - p1.y) * c);
    }

    // text
    public static format1(v: string): string {
        if (v.length <= 3) { return v; }
        return v.substr(0, v.length - 3) + ',' + v.substr(v.length - 3, 3);
    }
}
