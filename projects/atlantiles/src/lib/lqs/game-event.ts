/**
 * Created by Fundemic and handed to Ganz 03.07.2015.
 */
export class GameEvent extends Event {
    public static readonly GAME_MUTE = 'GAME_MUTE';
    public static readonly GAME_END = 'GAME_END';

    private pBoolean1: boolean;
    private pBoolean2: boolean;
    private pScore: number;

    constructor(type: string, boolean1: boolean, boolean2: boolean, score: number) {
        super(type);
        this.pScore = score;
        this.pBoolean1 = boolean1;
        this.pBoolean2 = boolean2;
    }

    public get score(): number {
        return this.pScore;
    }

    public get boolean1(): boolean {
        return this.pBoolean1;
    }

    public get boolean2(): boolean {
        return this.pBoolean2;
    }
}
