

/**
 * Created by Fundemic and handed to Ganz 7 / 2 / 2015.
 */
import { Point } from 'pixi.js';

export class Constants {
    public static readonly MENU_SCALE = .49;
    public static readonly ELEM_SCALE = 1.4;
    public static readonly CELL_SCALE1 = .87;
    public static readonly CELL_SCALE2 = .81;
    public static readonly CELL_SCALE = 1.38;
    public static readonly CELL_COUNT_X = 16 + 2;
    public static readonly CELL_COUNT_Y = 8 + 2;
    public static readonly INSTRUCTIONS_Y: number[] = [.25, .61];
    public static readonly INSTRUCTION_SCALE = 1.3;
    public static readonly STARTMENU_LOGO_DW = 1.02;
    public static readonly STARTMENU_SCALE = .8;
    public static readonly STARTMENU_LOGO_DH = .3;
    public static readonly STARTMENU_BUTTONS_1: Point = new Point(.32, .69);
    public static readonly STARTMENU_BUTTONS_2: Point = new Point(.68, .89);

    public static readonly FIELD_BLUR_ALPHA_SPEED = .03;
    public static readonly SETTINGS_SCALE = .4;
    public static readonly GAMEPLAY_SCALE = .43;
    public static readonly GAMEPLAY_SCALE_2 = 1.41;


    public static readonly INSTRUCTIONS_BACK_Y = 1.27;
    public static readonly INSTRUCTIONS_I_SCALE = .34;

    public static readonly GAMEPLAY_TEXT_SIZE3 = 10;
    public static readonly GAMEPLAY_DH = .07;
    public static readonly GAMEPLAY_POINTS_CONGRATULTIONS_SPEED_ALPHA = .08;
    public static readonly GAMEPLAY_POINTS_LABEL_SPEED_ALPHA = .01;
    public static readonly GAMEPLAY_POINTS_LABEL_SPEED_Y = .001;
    public static readonly GAMEPLAY_PANEL_LEVEL_W =  1.03;
    public static readonly GAMEPLAY_CLOSE_SCALE =  1.2;
    public static readonly GAMEPLAY_SOUND_SCALE =  1.2;
    public static readonly GAMEPLAY_TEXT_SCALE =  1.5;
    public static readonly GAMEPLAY_HINT_DELTA =  .13;
    public static readonly GAMEPLAY_FIELD_SCALE =  .7;
    public static readonly GAMEPLAY_BONUS_DY =  .52;
    public static readonly GAMEPLAY_END_TIMER = 100;
    public static readonly GAMEPLAY_CLASSIC_BASE = 42;
    public static readonly GAMEPLAY_CLASSIC_BONUS_MIN = 250;
    public static readonly GAMEPLAY_CLASSIC_BONUS_MAX = 500;
    public static readonly GAMEPLAY_CLASSIC_HINT_1 = .4;
    public static readonly GAMEPLAY_TEXTLABEL_SCALE = .65; // .56 for y-position, see GamePlay and LText
    public static readonly GAMEPLAY_PANEL_CASH_H = 1.6;
    public static readonly GAMEPLAY_TEXTLABEL_X: number[] = [ .58, .61, .5, .5];
    public static readonly GAMEPLAY_CLASSIC_HINT_2 = .2;


    public static readonly SETTINGS_BACK_S = 2;


    public static readonly TUTORONE_PERS_P: Point = new Point(.23, .27);
    public static readonly TUTORONE_FRAME_P: Point = new Point(.67, .17);
    public static readonly TUTORONE_TARGET_P: Point = new Point(.7, .24);
    public static readonly TUTORONE_FRAME_S = 1.45;
    public static readonly TUTORONE_FRAME_SX = 1.1;
    public static readonly TUTORONE_FRAME_DX = 0.05;
    public static readonly TUTORONE_TARGET_S = 14;

    public static readonly VICTORY_BUTTON_Y = .075;

    public static readonly TUTORIAL_PERS_Y = .4;
    public static readonly TUTORIAL_FIELD_Y = .65;
    public static readonly TUTORIAL_DELTA_Y = .05;
    public static readonly TUTORIAL_BUBBLE_Y = .75;
    public static readonly TUTORIAL_LABEL_S = 17.5;
    public static readonly TUTORIAL_TEXT_SX = .9;
    public static readonly TUTORIAL_TIMER = 85;
    public static readonly TUTORIAL_FADE_OUT_SPEED = .15;
    public static readonly TUTORIAL_FADE_OUT_THRESHOLD = .15;

    public static readonly CELLS_IN_ROW = 7;
    public static readonly GAME_POINTS: string = 'points';
    public static readonly GAME_ITEMS: string = 'items';
    public static readonly GAME_DIRTS: string = 'dirts';
    public static readonly TUTORIAL_ARM_TIME = 10;
    public static readonly TUTORIAL_ARM_SPEED = 0.2;

    public static readonly PAUSE_POS_ELEMENTS: number[][] = [[.36, .14], [.77, .40] , [ .5, .735]];

    // public static readonly EVENT_DISPATCHER: EventDispatcher = new EventDispatcher();
    public static readonly TOTAL_LEVELS = 8;
    public static WEBKINZ_CORE_OFFSET_X: number;
    public static WEBKINZ_CORE_OFFSET_Y: number;
    public static CASH_RATIO = 1 / 200;

    public static readonly UI_HEIGHT_SCALING_FACTOR = 655;
}
