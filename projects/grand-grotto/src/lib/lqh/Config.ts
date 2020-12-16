export class Config {
    public static readonly LANDSCAPE_ORIENTATION: string = 'LANDSCAPE_ORIENTATION';
    public static readonly PORTRAIT_ORIENTATION: string = 'PORTRAIT_ORIENTATION';
    public static readonly FPS_MODIFIER = 2; //as original game update fires 2 times slower
    public static RW: number; // adjustedLayoutWidth
    public static RH: number; // adjustedLayoutHeight
    public static W: number; // game art screen width
    public static H: number; // game art screen height

    public static artLayoutWidth: number; // game art screen width
    public static  artLayoutHeight: number; // game art screen height
    public static artSizeDevicePixelRatioFactor: number; // device pixel ration as was not .3 but 1/3

    public static colorsEnabled: number[];

    public static screenWidth: number; // screen width
    public static screenHeight: number; // screen height

    // either RW = adjustedLayoutWidth or RH = adjustedLayoutHeight
    public static adjustedLayoutWidth: number; // RW + extra width if fit in height (scaleY < scale) 
    public static adjustedLayoutHeight: number; // RH + extra height if fit in width
    public static extraWidthInternal: number;
    public static extraHeightInternal: number;
    public static topLeftInternalVisibleX = 0;
    public static topLeftInternalVisibleY = 0;

    public static scale: number; // scle of art screens
    public static orientation: string; // screen orientation
    public static get isLandscape(): boolean { return (Config.orientation === Config.LANDSCAPE_ORIENTATION? true : false);}

    // set min not 0:
    public static cellH = 1;
    public static cellW = 1;
    public static countX = 1;
    public static countY = 1;
    public static fieldScale = 0.92;

    public static isTutorialOn = false; // true;
    public static startingLivesGranted = 3;

    public static TEXT_COLOR_BLUE = 0x009EB4;
}