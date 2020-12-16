export class AnimationData {
    private static readonly PNG_EXTENSION = '.png';
    public id: string;
    public textureNames: string[];
    public animationSpeed: number;
    public inverseAnimationSpeed: number;
    public textureNamesId: string;
    public playOnInit: boolean;
    public anchorX: number;
    public anchorY: number

    /**
     * 
     * @param id 
     * @param textureNames 
     * @param inverseAnimationSpeed - invert to animationSpeed in PIXI.AnimatedSprite: @default 1
     * @param anchorX 
     * @param anchorY 
     * @param addPngExtension 
     */
    constructor (id: string, textureNames: string[], inverseAnimationSpeed: number, playOnInit: boolean = false, anchorX: number = 0.5, anchorY: number = 0.5, addPngExtension: boolean = false) {
        this.id = id;
        this.textureNames = textureNames;
        this.inverseAnimationSpeed = inverseAnimationSpeed;
        this.playOnInit = playOnInit;
        this.anchorX = anchorX;
        this.anchorY = anchorY;

        if (addPngExtension) {
            this.addStringToElements(textureNames, AnimationData.PNG_EXTENSION);
        }

        this.animationSpeed = 1 / (1 + 2 * inverseAnimationSpeed);
        this.textureNamesId = this.textureNames.toString();
    }

    public get totalFrames(): number {
        return this.textureNames? this.textureNames.length : 0;
    }

    /** when 
     *  inverseAnimationSpeed = 0 - don't skip update
     *  inverseAnimationSpeed = 1 - executre every second update
     *  inverseAnimationSpeed = 2 - execute every third update
     */
    public get skipMax(): number {
        return this.inverseAnimationSpeed;
    }

    private addStringToElements(arg1: string[], str: string): void {
        let i: number; const imax = arg1.length;
        for (i = 0; i< imax; i++) {
            arg1[i] += str;
         } 
    }
}