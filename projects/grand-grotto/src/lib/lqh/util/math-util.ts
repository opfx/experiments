export class MathUtil {
    constructor() {}
    
    public static getRandomInteger(max: number, min: number = 1): number {
        return Math.floor(Math.random() * (max + 1 - min)) + Math.floor(min);
    }

    public static getRandomArrayMember(array: any[]): any {
        // return (array && array.length > 0? array[MathUtil.getRandomInteger(MathUtil.getRandomInteger(array.length - 1, 0))] : null);
        return (array && array.length > 0? array[ Math.floor( Math.random() * array.length) ] : null);
    }

    public static isInList(list: string[], arg: string): boolean {
        return (list.indexOf(arg) === -1? false : true);
    }

    public static isInListAndHasHigherPrioruty(arg: string, oldValue: string, priorityList: string[]): boolean {
        const index = priorityList.indexOf(arg);
        const oldIndex = priorityList.indexOf(oldValue);
        if (index !== -1 || index > oldIndex) {
            return true;
        }
        return false;
    }

    public static isLenearInside(x: number, xMin: number, xMax: number): boolean {
        return (xMin <= x && x <= xMax? true : false);
    }

    public static isLenearStrictlyInside(x: number, xMin: number, xMax: number): boolean {
        return (xMin < x && x < xMax? true : false);
    }
    
    public static getDistance(point1: any, point2: any): number {
        return Math.sqrt((point2.x - point1.x) * (point2.x - point1.x) + (point2.y - point1.y) * (point2.y - point1.y));
    }

    public static getDistanceSquare(point1: any, point2: any): number {
        return (point2.x - point1.x) * (point2.x - point1.x) + (point2.y - point1.y) * (point2.y - point1.y);
    }

    /**
     * Assume that ref (anchor) point of sprites are TL corner
     * @param sprite1 
     * @param sprite2 
     */
    public static alignByCenter(sprite1: any, sprite2: any): void {
        if (sprite2 && sprite1) {
            sprite2.x = sprite1.x + (sprite1.width - sprite2.width)/2;
            sprite2.y = sprite1.y + (sprite1.height - sprite2.height)/2;
        }
    }

    /** interpolate between (x0, x1) */
    public static interpolate(t: number, x0: number, x1: number): number {
        t = Math.max(0, Math.min(1, t));
        return x0 + t * (x1 - x0);
    }
}