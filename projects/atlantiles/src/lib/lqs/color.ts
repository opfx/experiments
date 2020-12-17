/**
 * Created by Fundemic and handed to Ganz 06.01.2016.
 */
export class Color {
    private r: number;
    private g: number;
    private b: number;

    /** https://stackoverflow.com/questions/47622824/why-are-bitwise-operators-not-allowed-in-tslint */
    constructor(hex: number) {
        /* tslint:disable:no-bitwise */
        this.r = hex >> 16 & 0xFF;
        this.g = hex >> 8 & 0xFF;
        this.b = hex & 0xFF;
        /* tslint:enable:no-bitwise */
    }

    public randomize(rr: number, rg: number, rb: number): void {
        this.r = Math.min(255, Math.max(this.r + (Math.random() * 255) * rr, 0));
        this.g = Math.min(255, Math.max(this.g + (Math.random() * 255) * rg, 0));
        this.b = Math.min(255, Math.max(this.b + (Math.random() * 255) * rb, 0));
    }

    public get HEX(): number {
        /* tslint:disable:no-bitwise */
        return (this.r << 16 | this.g << 8 | this.b);
        /* tslint:enable:no-bitwise */
    }
}
