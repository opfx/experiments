import { Point, Rectangle, filters } from 'pixi.js';
import { IContainer } from '../../lqs/icontainer';
import { Game } from '../../lqs/game';
import { Loop } from '../../lqs/loop';
import { Field } from './game-field';
import { LImage } from '../../lqs/limage';
import { JButton } from '../../lqs/jbutton';
import { LText } from '../../lqs/ltext';
import { Constants } from '../data/constants';
import { GameCell } from './game-cell';
import { Element } from './element';
import { LEvent } from '../../lqs/levent';
import { TextButton } from '../../lqs/dev/text-button';
import { RewardData } from '../data/reward-data';
import { Variable } from '../../lqs/variable';
import { Config } from '../data/config';
import { ILevel, GameLevels, IAtlantilesData } from '../data/game-levels';
import { GameEvent } from '../../lqs/game-event';

export class GamePlay extends Loop {
    private static readonly NO_LEVELS = -1;

    private lastInterval: any = null; // NodeJS.Timeout = null;
    private field: Field;

    private levelID: number;
    private backgroundImage: LImage;
    private startLevelPoints: number;
    private labelOutOfTime: LImage;
    private labelCongratultions: LImage;
    private levelData: IAtlantilesData;
    private levels: ILevel[];
    private firstElem: GameCell;
    private timeField: LImage;
    private scoreField: LImage;
    private levelField: LImage;
    private cashField: LImage;
    private timeLabel: LText;
    private bonusLabel: LText;
    private scoreLabel: LText;
    private levelLabel: LText;
    private cashLabel: LText;
    private buttonBack: JButton;
    private buttonHint: JButton;
    private buttonShowAll: JButton;
    private lastHints: Element[] = [];
    private isShowAll = false;
    private isHint = false;
    private score: Variable;
    private timer = -1;
    private baseScore: number;
    private timeBonusMin: number;
    private timeBonusMax: number;
    private endTimer: number;
    private hintMult: number;
    private showAllMult: number;
    private isOver: boolean;
    private isEnd: boolean;
    private isFinished: boolean;

    private lTextPoints1: LText;
    private lTextPoints2: LText;
    private lTextBonus: LText;

    private soundOn: JButton;
    private soundOff: JButton;
    private resultFlagPrivate = RewardData.GAME_RESULT_USER_QUIT;

    // private h_timerBinded: () => void;

    constructor(game: Game) {
        super(game, 'GamePlay');
        this.levelID = 0;
        this.score = new Variable(0);

        this.startLevelPoints = 0;
        const half = .5;
        this.addChild(this.backgroundImage = new LImage(this.game, 'background', 0, 0,  LImage.FIT_WIDTH, new Point(0, 0)));
        this.addChild(this.field = new Field(this.game));
        this.backgroundImage.y = (this.game.RH - this.backgroundImage.height) / 2;
        const hh = this.game.RH * Constants.GAMEPLAY_DH;
        const s2 =  Constants.GAMEPLAY_SCALE_2;
        const s = this.game.RH / Constants.UI_HEIGHT_SCALING_FACTOR * Constants.GAMEPLAY_SCALE;
        this.addChild(this.timeField = new LImage(this.game, 'PanelTime', hh * .5, hh, s, new Point(0, half)));
        this.addChild(this.levelField = new LImage(this.game, 'PanelLevel',
                        this.timeField.x + this.timeField.width * Constants.GAMEPLAY_PANEL_LEVEL_W, hh, s * s2, new Point(0, half)));
        this.addChild(this.cashField = new LImage(this.game, 'PanelCash',
                        this.game.RW - hh * Constants.GAMEPLAY_PANEL_CASH_H, hh, s, new Point(1, half)));
        this.addChild(this.scoreField = new LImage(this.game, 'PanelScore', 0, hh, s * s2, new Point(1, half)));
        this.addChild(this.buttonBack = new JButton(this.game, 'btnClose', s * Constants.GAMEPLAY_CLOSE_SCALE, this.game.RW - hh, hh));

        // tslint:disable-next-line: max-line-length
        this.addChild(this.soundOff = new JButton(this.game, 'sound_off', s * Constants.GAMEPLAY_CLOSE_SCALE, this.game.RW / 2, this.game.RH - hh)); // , this.game.RW - hh, hh));
         // tslint:disable-next-line: max-line-length
        this.addChild(this.soundOn = new JButton(this.game, 'sound_on', s * Constants.GAMEPLAY_CLOSE_SCALE, this.game.RW / 2, this.game.RH - hh));

        /*
        if (SoundManager.getInstance().isBackgroundMusicMuted) {
            this.soundOn.visible = false;
        }*/

        // s * Constants.GAMEPLAY_SOUND_SCALE
        this.scoreField.x = this.cashField.x - this.scoreField.width * Constants.GAMEPLAY_PANEL_LEVEL_W;

        const tc = Constants.GAMEPLAY_TEXT_SIZE3 * s;
        this.addChild(this.bonusLabel = new LText('time', 2, 0, 0, 0xffffff, tc * Constants.GAMEPLAY_TEXT_SCALE));
        this.addChild(this.timeLabel = new LText('time', 2, 0, 0, 0xffffff, tc * Constants.GAMEPLAY_TEXT_SCALE));
        this.addChild(this.scoreLabel = new LText('0', 2, 0, 0, 0xffffff, tc  * Constants.GAMEPLAY_TEXT_SCALE));
        this.addChild(this.levelLabel = new LText('1', 2, 0, 0, 0xffffff, tc  * Constants.GAMEPLAY_TEXT_SCALE));
        this.addChild(this.cashLabel = new LText('0', 2, 0, 0, 0xffffff, tc  * Constants.GAMEPLAY_TEXT_SCALE));

        this.field.addListener(LEvent.CELL_DOWN, this.h_field.bind(this));

        this.addChild(this.buttonShowAll = new JButton(this.game, 'btnShowAll', s,
                        this.game.RH * Constants.GAMEPLAY_HINT_DELTA, this.game.RH - hh));
        this.addChild(this.buttonHint = new JButton(this.game, 'btnHint', s,
                        this.game.RW - this.game.RH  * Constants.GAMEPLAY_HINT_DELTA, this.game.RH - hh));

        // const byteArray : object = new com.webkinz.subApplications.atlantiles.fundemic.EmbeddedAssets.levels;
        this.levelData = new GameLevels().data.AtlantilesData;
        this.levels = this.levelData.AtlantilesLevels.gameboard;


        const blur = .1;
        const blurP = 3;
        /*
        this.levelLabel.filter = new BlurFilter(blur, blur, blurP);
        this.timeLabel.filter = new BlurFilter(blur, blur, blurP);
        this.scoreLabel.filter = new BlurFilter(blur, blur, blurP);
        this.cashLabel.filter = new BlurFilter(blur, blur, blurP);
        */
        const blurFilter: filters.BlurFilter = new filters.BlurFilter();
        blurFilter.blur = blur;
        blurFilter.padding = blurP;
        this.levelLabel.filters = this.timeLabel.filters = this.scoreLabel.filters = this.cashLabel.filters = [blurFilter];

        this.field.init();
        this.field.scale.x = this.field.scale.y = Constants.GAMEPLAY_FIELD_SCALE;

        this.addChild(this.labelOutOfTime = new LImage(this.game, 'OutOfTime', this.game.RW * half, this.game.RH * half, s, null));
        this.addChild(this.labelCongratultions = new LImage(this.game, 'Congratulations',
                        this.game.RW * half, this.game.RH * half, s, null));
        this.addChild(this.lTextBonus = new LText('BONUS', 2, 0, 0, 0xffffff, tc * 2));

        this.labelCongratultions.interactive = this.labelOutOfTime.interactive  = false;
        this.buttonBack.addListener(LEvent.DEV_BUTTON_CLICK, this.h_buttons.bind(this));
        this.soundOff.addListener(LEvent.DEV_BUTTON_CLICK, this.h_buttons.bind(this));
        this.soundOn.addListener(LEvent.DEV_BUTTON_CLICK, this.h_buttons.bind(this));
        this.buttonHint.addListener(LEvent.DEV_BUTTON_CLICK, this.h_buttons.bind(this));
        this.buttonShowAll.addListener(LEvent.DEV_BUTTON_CLICK, this.h_buttons.bind(this));
        this.updateLabels();

        this.addChild(this.lTextPoints1 = new LText('Points', 1, this.game.RW * half, this.game.RH * half, 0xffffff, tc));
        this.addChild(this.lTextPoints2 = new LText('Points', 1, this.game.RW * half, this.game.RH * half, 0xffffff, tc));

        this.lTextPoints1.visible = this.lTextPoints2.visible = false;

        if (Config.isCE) {
            const cheatBTN: TextButton = new TextButton('SKIP', 2, 0x555555, this.game.RW * (half / 2), this.game.RH * .91);
            this.addChild(cheatBTN);
            cheatBTN.addListener(LEvent.DEV_BUTTON_DOWN, this.h_cheat.bind(this));
        }
    }

    /** override */
    public init(): void {
        super.init();
        this.bonusLabel.visible = false;
        this.endTimer = 0;
        this.labelCongratultions.alpha = 0;
        this.isFinished = false;
        this.isEnd = false;
        this.lTextBonus.visible = false;
        this.lTextBonus.alpha = this.labelOutOfTime.alpha = 0;

        this.isOver = false;
        this.timeLabel.text = '0';

        this.field.clear();
        if (this.levelID === GamePlay.NO_LEVELS) {
            this.baseScore = Constants.GAMEPLAY_CLASSIC_BASE;
            this.timeBonusMin = Constants.GAMEPLAY_CLASSIC_BONUS_MIN;
            this.timeBonusMax = Constants.GAMEPLAY_CLASSIC_BONUS_MAX;
            this.hintMult = Constants.GAMEPLAY_CLASSIC_HINT_1;
            this.showAllMult = Constants.GAMEPLAY_CLASSIC_HINT_2;
            this.field.full();
            this.levelField.visible = this.levelLabel.visible = false;

        } else {
            this.levelField.visible = this.levelLabel.visible = true;

            const data: ILevel = this.levels[this.levelID];
            this.field.Data = data;

            this.baseScore = Math.floor(data.baseScore);
            this.timeBonusMax = Math.floor(data.timeBonusMax);
            this.timeBonusMin = Math.floor(data.timeBonusMin);
            this.hintMult = data.hintScoreMultiplier;
            this.showAllMult = data.showAllScoreMultiplier;
            this.levelLabel.text = 'Level ' + (this.levelID + 1);
        }

        this.field.fill();
        this.field.solveLevel();

        const rect: Rectangle = this.field.getBound();
        const s = this.field.scale.x;
        this.field.x = -rect.x * s + (this.game.RW - rect.width * s) / 2;
        this.field.y = -rect.y * s + (this.game.RH - rect.height * s) / 2;

        if (this.lastInterval !== null || this.lastInterval !== undefined) {
            clearInterval(this.lastInterval);
            this.lastInterval = null;
        }

        this.timer = 0;
        this.lastInterval = setInterval(/*this.h_timerBinded =*/ this.h_timer.bind(this), 1000);

        this.timeLabel.text = '' + (this.timeBonusMax - this.timer);

        this.updateLabels();
    }
    public returnPoints(): void {
        this.score.Value = this.startLevelPoints;
        this.scoreLabel.text = this.score.Value + '';
    }
    public clearPoints(): void {
        this.score.Value = 0;
        this.scoreLabel.text = '0';
    }
    public levelEnd(): void {
        if (this.isOver) {
            this.isEnd = true;
            this.endTimer = Constants.GAMEPLAY_END_TIMER;
            this.timeLabel.text = '0';
            this.updateLabels();
            this.labelOutOfTime.alpha = 0;
            this.game.stopSound('theme');
            this.game.playSound('Game_lost_break_crashing', false, this.game.SOUND);
        } else {
            this.endTimer = Constants.GAMEPLAY_END_TIMER;
            this.isFinished = true;
            this.lTextBonus.visible = true;
            this.lTextBonus.alpha = 0;
            this.game.stopSound('theme');
            this.game.playSound('triumphant', false, this.game.SOUND);
            this.startLevelPoints = this.score.Value += (this.timeBonusMax - this.timer);
            this.scoreLabel.text = this.score.Value + '';

            this.lTextBonus.text = '+' + (this.timeBonusMax - this.timer) + ' BONUS';
            this.lTextBonus.x = (this.game.RW - this.lTextBonus.width) / 2;
            this.lTextBonus.y = (this.game.RH - this.lTextBonus.height) * Constants.GAMEPLAY_BONUS_DY;
            this.updateLabels();
        }
        if (this.lastInterval !== null || this.lastInterval !== undefined) {
            clearInterval(this.lastInterval);
            this.lastInterval = null;
        }
    }

    /** override */
    public update(): void {
        if (this.visible) {
            this.field.update();
            this.lTextPoints1.y -= this.game.RH * Constants.GAMEPLAY_POINTS_LABEL_SPEED_Y;
            this.lTextPoints2.y -= this.game.RH * Constants.GAMEPLAY_POINTS_LABEL_SPEED_Y;

            this.lTextPoints1.alpha =
                this.lTextPoints2.alpha += (0 - this.lTextPoints2.alpha) * Constants.GAMEPLAY_POINTS_LABEL_SPEED_ALPHA;

            if (this.lTextPoints1.alpha <= 0) {
                this.lTextPoints1.visible = this.lTextPoints2.visible = false;
            }

            if (this.isFinished) {
                this.labelOutOfTime.alpha = 0;
                if (this.endTimer-- === 0) {
                    if (this.levelID === GamePlay.NO_LEVELS) {
                        this.dispatchEvent(LEvent.GO_SCREEN, 'finishedClassic', this); //  (LEvent.GO_SCREEN, 'finishedClassic');
                    } else {
                        this.dispatchEvent(LEvent.GO_SCREEN, 'finished', this); // (LEvent.GO_SCREEN, 'finished')
                    }
                }

                this.lTextBonus.alpha = this.labelCongratultions.alpha += (1 - this.labelCongratultions.alpha)
                                            * Constants.GAMEPLAY_POINTS_CONGRATULTIONS_SPEED_ALPHA;

            } else if (this.isEnd) {
                this.labelOutOfTime.alpha += (1 - this.labelOutOfTime.alpha) * Constants.GAMEPLAY_POINTS_CONGRATULTIONS_SPEED_ALPHA;
                if (this.endTimer-- === 0) {
                    this.dispatchEvent(LEvent.GO_SCREEN, 'gameOver', this); // (LEvent.GO_SCREEN, 'this.gameOver');
                }
            }
        }
    }

    public updateLabels(): void {
        const half = 2;
        const tc = Constants.GAMEPLAY_TEXTLABEL_SCALE;
        this.timeLabel.x = this.timeField.x + this.timeField.width * Constants.GAMEPLAY_TEXTLABEL_X[0] - this.timeLabel.width / 2;
        this.cashLabel.x = this.cashField.x + this.cashField.width * Constants.GAMEPLAY_TEXTLABEL_X[1] - this.cashLabel.width / 2;
        this.scoreLabel.x = this.scoreField.x + this.scoreField.width * Constants.GAMEPLAY_TEXTLABEL_X[2] - this.scoreLabel.width / 2;
        this.levelLabel.x = this.levelField.x + this.levelField.width * Constants.GAMEPLAY_TEXTLABEL_X[3] - this.levelLabel.width / 2;

        this.timeLabel.y = this.timeField.y + this.timeField.height / half - this.timeLabel.height * tc;
        this.cashLabel.y = this.cashField.y + this.cashField.height / half - this.cashLabel.height * tc;
        this.scoreLabel.y = this.scoreField.y + this.scoreField.height / half - this.scoreLabel.height * tc;
        this.levelLabel.y = this.levelField.y + this.levelField.height / half - this.levelLabel.height * tc;
    }

    public getLevelID(): number {
        return this.levelID;
    }

    public setLevelID(id: number): void {
        this.levelID = id;
    }

    private  hasNoLevels(): boolean {
        return (this.levelID === GamePlay.NO_LEVELS);
    }

    private  addScore(e1: Element, e2: Element): number {
        let s: number;
        const mult = Math.max(e2.Cost, e1.Cost);

        switch (mult) {
            case 1:
                s = Math.floor(this.baseScore * this.showAllMult);
                break;
            case 2:
                s = Math.floor(this.baseScore * this.hintMult);
                break;
            case 3:
                s = this.baseScore;
                break;
        }

        this.field.clearCost();
        /*
        if (this.isShowAll) {
            s = Math.floor(this.baseScore * this.showAllMult);
        } else
        if (this.isHint) {
            s = Math.floor(this.baseScore * this.hintMult)
        } else {
            s = this.baseScore;
        }
        //*/
        this.score.Value += s;
        this.isShowAll = false;
        this.isHint = false;
        this.scoreLabel.text = this.score.Value + '';

        this.cashLabel.text = String(Math.floor (Math.floor(this.score.Value) * Constants.CASH_RATIO));
        this.updateLabels();
        return s;
    }

    // listeners
    private  h_timer(): void {
        this.timer++;
        this.timeLabel.text = '' + (this.timeBonusMax - this.timer);
        this.updateLabels();
        if (!this.isEnd || !this.isFinished) {
            if (this.timer > this.timeBonusMax) {
                this.isOver = true;
                this.labelOutOfTime.texture = this.game.getTexture('OutOfTime');
                this.resultFlagPrivate = RewardData.GAME_RESULT_TIMEOUT;
                this.levelEnd();

                clearInterval(this.lastInterval);
                this.lastInterval = null;
            }
        }
    }

    /*
    private  h_touch(e: TouchEvent): void {
        const touches: Touch[] = e.touches;
        for (const t of touches) {
            switch (t.phase) {
                case TouchPhase.ENDED:
                    break;
            }
        }
    }*/

    // we are using js 'emit()', not pixiJS '.on'
    // private  h_field(type: string, event: LEvent): void {
    private  h_field(args: any[]): void {
        // let cell: GameCell = event.Data as GameCell;

        const type: string = args[0];
        const cell: GameCell = args[1];

        if (this.isEnd || this.isFinished) { return; }
        switch (type) {
            case Field.EVENT_UPDATE_LABELS:
                this.updateLabels();
                break;

            case LEvent.CELL_DOWN:
                    this.field.drawLine(true);
                    for (const lh of this.lastHints) {
                        lh.Hinted = false;
                    }
                    this.lastHints = [];
                    if (this.firstElem === null || this.firstElem === undefined) {
                        if (cell.getElement()) {
                            this.firstElem = cell;
                            this.firstElem.Selected = true;
                            this.game.playSound('select', false, this.game.SOUND);
                        }

                    } else {

                        if (this.firstElem === cell) {
                            this.firstElem.Selected = false;

                            this.game.playSound('deselect', false, this.game.SOUND);
                            this.firstElem = null;
                        } else {
                            if (this.field.solveCell(this.firstElem, cell))
                            {
                                this.firstElem.Selected = false;
                                const s = this.addScore(this.firstElem.getElementSolved(), cell.getElementSolved());
                                this.field.drawLine();
                                const sf = this.field.scale.x;
                                const w = cell.width * sf / 2;
                                const h = cell.height * sf / 2;
                                this.lTextPoints1.text = '+' + s;
                                this.lTextPoints2.text = '+' + s;
                                this.lTextPoints1.x = cell.x * sf + this.field.x + w - this.lTextPoints1.width / 2;
                                this.lTextPoints1.y = cell.y * sf + this.field.y + h;
                                this.lTextPoints2.x = this.firstElem.x * sf + this.field.x + w - this.lTextPoints1.width / 2;
                                this.lTextPoints2.y = this.firstElem.y * sf + this.field.y + h;
                                this.lTextPoints1.visible = this.lTextPoints2.visible = true;

                                this.lTextPoints2.alpha = this.lTextPoints1.alpha = 1;
                                this.firstElem = null;
                                this.game.playSound('green_line_bing_1', false, this.game.SOUND);
                                if (this.field.CountOfElements === 0) {
                                    if (this.hasNoLevels()) {
                                        // the user has finished a level of this.the Quick mode, no trophy to be awarded
                                        this.resultFlagPrivate = RewardData.GAME_RESULT_USER_QUIT; // = 0
                                    }
                                    this.levelEnd();
                                }
                                this.lastHints = this.field.getAllHints(false);
                                if (this.lastHints) {
                                    if (this.lastHints.length === 0) {
                                        this.isOver = true;
                                        this.labelOutOfTime.texture = this.game.getTexture('OutOfMoves');
                                        if (this.hasNoLevels()) {
                                            this.resultFlagPrivate = RewardData.GAME_RESULT_LOST_NO_LEVELS;
                                        } else {
                                            this.resultFlagPrivate = RewardData.GAME_RESULT_LOST_WITH_LEVELS;
                                        }
                                        this.levelEnd();
                                    }
                                }
                            } else {
                                if (cell.getElement()) {
                                    this.firstElem.Selected = false;
                                    this.game.playSound('select', false, this.game.SOUND);
                                    this.game.playSound('error', false, this.game.SOUND);
                                    cell.Selected = true;
                                    this.firstElem = cell;
                                }
                            }

                        }
                    }
                    break;
        }

    }

    public get gameScore(): number {
        return this.score.Value;
    }

    public get resultFlag(): number {
        return this.resultFlagPrivate;
    }

    public set resultFlag(value: number) {
        this.resultFlagPrivate = value;
    }

    // private  h_buttons(e: LEvent): void {
    private  h_buttons(type: string, currentTarget: JButton): void {
        if (this.isOver) { return; }

        this.game.playSound('buttonSound', false, this.game.SOUND);

        // const currentTarget = e.currentTarget as unknown as JButton;
        switch (currentTarget) {
                case this.buttonShowAll:
                    this.game.playSound('hint', false, this.game.SOUND);

                    this.field.drawLine(true);
                    this.isShowAll = true;
                    //  this.field.solveLevel(); return;
                    this.lastHints = this.field.getAllHints();
                    if (this.lastHints) {
                        if (this.lastHints.length === 0) {
                            while (this.field.getAllHints().length === 0) {
                                this.field.randomizeOnce();
                            }
                        } else {
                            for (const lh of this.lastHints) {
                                lh.setCost(1);
                                lh.Hinted = true;
                            }
                        }
                    }

                    break;

                case this.buttonBack:
                    if (this.levelID !== GamePlay.NO_LEVELS) {
                        // this.startLevelPoints = this.score.Value;
                    }

                    clearInterval(this.lastInterval);
                    this.lastInterval = null;

                     // const gameEndEvent: GameEvent = new GameEvent(GameEvent.GAME_END, false, false, this.score.Value);
                    // Constants.EVENT_DISPATCHER.dispatchEvent(this.gameEndEvent);

                    this.dispatchEvent(LEvent.GO_SCREEN, 'menu_back', this);
                    break;

                case this.soundOn:
                    // const gameMuteEvent: GameEvent = new GameEvent(GameEvent.GAME_MUTE, false, false, this.score.Value);
                    // Constants.EVENT_DISPATCHER.dispatchEvent(this.gameMuteEvent);
                    this.game.muteSounds(true);

                    this.soundOn.visible = false;
                    this.soundOff.visible = true;
                    break;

                case this.soundOff:
                    // const gameMuteEvent2: GameEvent = new GameEvent(GameEvent.GAME_MUTE, false, false, this.score.Value);
                    // Constants.EVENT_DISPATCHER.dispatchEvent(this.gameMuteEvent2);
                    this.game.muteSounds(false);

                    this.soundOn.visible = true;
                    this.soundOff.visible = false;
                    break;

                case this.buttonHint:
                    this.game.playSound('hint', false, this.game.SOUND);

                    this.field.drawLine(true);
                    this.isHint = true;
                    if (this.lastHints) {
                        for (const lh of this.lastHints) {
                            lh.Hinted = false;
                        }
                    }
                    this.lastHints = this.field.getAllHints();
                    if (this.lastHints) {
                        if (this.lastHints.length === 0) {
                            while (this.field.getAllHints().length === 0) {
                                this.field.randomizeOnce();
                            }
                        } else {
                            const i = Math.floor(Math.random() * this.lastHints.length / 2) * 2;
                            for (let li = 0; li < 2; li++) {
                                this.lastHints[li + i].setCost(2);
                                this.lastHints[li + i].Hinted = true;
                            }
                        }
                    }

                    break;
        }
    }

    private  h_cheat(e: LEvent): void {
        this.levelEnd();
    }

    /** override */
    public set Scale(v: number) {
        
        const scaleX = this.game.MW / this.backgroundImage.texture.width / this.game.scale.x;
        const scaleY = this.game.MH / this.backgroundImage.texture.height / this.game.scale.y;
        this.backgroundImage.Scale = Math.max(scaleX, scaleY); // scaleX;

        this.backgroundImage.x = (this.game.RW - this.backgroundImage.width) / 2;
        this.backgroundImage.y = (this.game.RH - this.backgroundImage.height) / 2;

        this.buttonShowAll.x = this.game.RH * Constants.GAMEPLAY_HINT_DELTA;
        this.buttonHint.x = this.game.RW - this.game.RH  * Constants.GAMEPLAY_HINT_DELTA;

        const hh = this.game.RH * Constants.GAMEPLAY_DH;
        this.buttonHint.y = this.buttonShowAll.y =  this.game.RH - hh;

        this.soundOff.x = this.soundOn.x = this.game.RW / 2;
        this.soundOff.y = this.soundOn.y = this.game.RH - hh;

        const rect: Rectangle = this.field.getBound();
        if (rect) {
            const s = this.field.scale.x;
            this.field.x = -rect.x * s + (this.game.RW - rect.width * s) / 2;
            this.field.y = -rect.y * s + (this.game.RH - rect.height * s) / 2;
        }


        this.timeField.y = hh - this.timeField.height / 2;
        this.levelField.y = hh - this.levelField.height / 2;
        this.cashField.y =  hh - this.cashField.height / 2;
        this.scoreField.y =  hh - this.scoreField.height / 2;


        this.labelOutOfTime.x = (this.game.RW - this.labelOutOfTime.width) / 2;
        this.labelOutOfTime.y = (this.game.RH - this.labelOutOfTime.height) / 2;

        this.labelCongratultions.x = (this.game.RW - this.labelCongratultions.width) / 2;
        this.labelCongratultions.y = (this.game.RH - this.labelCongratultions.height) / 2;

        this.lTextBonus.x = (this.game.RW - this.lTextBonus.width) / 2;
        this.lTextBonus.y = (this.game.RH - this.lTextBonus.height) * Constants.GAMEPLAY_BONUS_DY;

        this.timeField.x = hh * .5;
        this.levelField.x = this.timeField.x + this.timeField.width * Constants.GAMEPLAY_PANEL_LEVEL_W;
        this.cashField.x = this.game.RW - hh * Constants.GAMEPLAY_PANEL_CASH_H - this.cashField.width;
        this.scoreField.x = this.cashField.x - this.scoreField.width * Constants.GAMEPLAY_PANEL_LEVEL_W;

        this.buttonBack.x = this.game.RW - hh;
        this.buttonBack.y = hh;

        this.updateLabels();
    }

    /** override */
    public destroy(): IContainer {
        clearInterval(this.lastInterval);

        if (this.field){
            this.field.removeListener(LEvent.CELL_UP, this.h_field);
            this.field.removeListener(LEvent.CELL_DOWN, this.h_field);
            this.field.removeListener(Field.EVENT_UPDATE_LABELS, this.h_field);
        }

        // this.off('mousedown', this.h_touch).off('touchstart', this.h_touch);

        if (this.buttonBack){
            this.buttonBack.removeListener(LEvent.DEV_BUTTON_CLICK, this.h_buttons.bind(this));
        }

        if (this.buttonHint) {
            this.buttonHint.removeListener(LEvent.DEV_BUTTON_CLICK, this.h_buttons.bind(this)); }
        if (this.buttonShowAll) {
            this.buttonShowAll.removeListener(LEvent.DEV_BUTTON_CLICK, this.h_buttons.bind(this)); }

        if (this.timeField){
            this.timeField.destroy();
            this.timeField.destroy();
        }
        if (this.scoreField){
            this.scoreField.destroy();
            this.scoreField.destroy();
        }
        if (this.levelField){
            this.levelField.destroy();
            this.levelField.destroy();
        }
        if (this.cashField){
            this.cashField.destroy();
            this.cashField.destroy();
        }
        if (this.labelOutOfTime){
            this.labelOutOfTime.destroy();
            this.labelOutOfTime.destroy();
        }
        if (this.labelCongratultions){
            this.labelCongratultions.destroy();
            this.labelCongratultions.destroy();
        }
        if (this.backgroundImage){
            this.backgroundImage.destroy();
            this.backgroundImage.destroy();
        }

        this.field = null;
        this.backgroundImage = null;

        this.labelOutOfTime = null;
        this.labelCongratultions = null;
        this.levelData = null;
        this.levels = null;
        this.firstElem = null;
        this.timeField = null;
        this.scoreField = null;
        this.levelField = null;
        this.cashField = null;
        this.timeLabel = null;
        this.bonusLabel = null;
        this.scoreLabel = null;
        this.levelLabel = null;
        this.cashLabel = null;
        this.buttonBack = null;
        this.buttonHint = null;
        this.buttonShowAll = null;
        this.lastHints = null;
        this.score = null;
        this.lTextPoints1 = null;
        this.lTextPoints2 = null;
        this.lTextBonus = null;
        this.removeChildren();
        return super.destroy();
    }
}
