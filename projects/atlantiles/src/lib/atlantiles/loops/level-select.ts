/**
 * Created by Fundemic and handed to Ganz 17.08.2015.
 */
import { Point, Graphics, Container } from 'pixi.js';
import { IContainer } from '../../lqs/icontainer';
import { Game } from '../../lqs/game';
import { LText } from '../../lqs/ltext';
import { LImage } from '../../lqs/limage';
import { Button } from '../../lqs/button';
import { LevButton } from './lev-button';
import { Loop } from '../../lqs/loop';
import { LEvent } from '../../lqs/levent';
import { TextButton } from '../../lqs/dev/text-button';

export class LevelSelect extends Loop {
    private l_buttons: LevButton[];
    private b_add: LevButton;
    private b_save: TextButton;
    private b_back: Button;
    private background: LImage;
    private container: Container;
    private touchMask: Graphics;
    private label: LText;
    private downPoint: Point;
    private isMoved: boolean;
    private CY: number;
    private MY: number;
    private MINY: number;

    constructor(g: Game) {
        super(g, 'LevelSelect');
        /*
        l_buttons = new <LevButton>[];
        CY = 0;
        const d = game.RW * .005;
        const s = game.RW/game.W;
        this.addChild(background = new LImage(game, 'back_1', game.RW * .5, game.RH * .5, LImage.FIT_HEIGHT, null));
        this.addChild(b_back = new Button(game, 'b_back', s, game.RW * .2, game.RW * .1));
        this.addChild(label = new LText('LEVELS', 1, game.RW * .3, game.RW * .03, 0xffffff, s * 8.5));
        label.x = (game.RW  * .92 - label.width);
        this.addChild(container = new Sprite());
        container.addChild(touchMask = new Graphics());

        container.y = MINY = game.RW * .2;
        this.addChild(b_save = new TextButton('SAVE', 1.6, 0x884515, game.RW - d * 2 - b_back.width, d, 'topRight'));
        b_save.visible = false;

        addEventListener('click', h_mouse);
        container.addEventListener('click', h_container);
        b_back.addEventListener(LEvent.DEV_BUTTON, h_buttons);
        b_save.addEventListener(LEvent.DEV_BUTTON, h_buttons);
        */
    }

    /** override */
    public destroy(): IContainer {
        /*
        for (let i = 0; i<l_buttons.length; i++) {
            l_buttons[i].removeEventListener(LEvent.DEV_BUTTON, h_levels);
        }
        if (b_add) {
            b_add.removeEventListener(LEvent.DEV_BUTTON, h_buttons);
        }

        b_back.removeEventListener(LEvent.DEV_BUTTON, h_buttons);
        b_save.removeEventListener(LEvent.DEV_BUTTON, h_buttons);
        l_buttons = null;
        b_back = null;
        b_save = null;
        b_add = null;
        */
        this.removeChildren();
        return super.destroy();
    }

    /** override */
    public init(): void {
        super.init();
/*
        const g:AtlantilesFundemic = game as AtlantilesFundemic;
        isMoved = false;
        while(l_buttons.length) {
            container.removeChild(l_buttons[0]);
            l_buttons[0].removeEventListener(LEvent.DEV_BUTTON, h_levels);
            l_buttons.splice(0, 1);
        }

        const data: object = game.SETTINGS;
        const levels: [] = data.levels;
        const level:LevButton;
        const yi: number;
        const xi: number;
        const countOnRow = 4;
        const lastUlocked = -1;
        const s = game.RW/game.W * .6;
        for (let i = 0; i<levels.length; i++) {
            const l: [] = g.getLevel(i);
            yi = i/countOnRow;
            xi = i - yi * countOnRow;
            level = new LevButton(game, (i + 1), s, game.RW * .17 + game.RW * .225 * xi, game.RW * .225* yi + game.RW * .1);
            container.addChild(level);
            level.addEventListener(LEvent.DEV_BUTTON, h_levels);
            l_buttons.push(level);
            if (l[1].Value === 1) {
                lastUlocked = i;
                level.setAsUnlocked(true);
            }
        }

        if (lastUlocked < levels.length - 1) {
            l_buttons[lastUlocked + 1].setAsActive(true);
        }
        yi = (levels.length)/countOnRow;
        xi = (levels.length) - yi * countOnRow;
        if (!b_add) {
            container.addChild(b_add = new LevButton(game, (i + 1), s,
                game.RW * .17 + game.RW * .225 * xi, game.RW * .225 * yi + game.RW * .1));
            b_add.addEventListener(LEvent.DEV_BUTTON, h_buttons);
        }
        b_add.visible = game.DEV;
        b_add.x = game.RW * .1 + game.RW * .1 * xi;
        b_add.y = game.RH * .1 * yi + game.RH * .1;

        MY = level.y + level.height;
        touchMask.graphics.clear();
        touchMask.graphics.beginFill(0, .0);
        touchMask.graphics.drawRect(0, 0, game.RW, level.y + level.height);
        touchMask.graphics.endFill();

    }

    // listeners
    private  h_mouse(e: TouchEvent): void {
        /*
        const touches:Vector.<Touch> = e.touches;
        for (const t:Touch of this.touches) {
            switch (t.phase) {
                case TouchPhase.ENDED:
                    downPoint = null;
                    isMoved = false;
                    break;
            }
        }*/
    }
    private  h_container(e: TouchEvent): void {
        /*
        const touches:Vector.<Touch> = e.touches;
        const HELPER_POINT: Point;
        for (const t:Touch of this.touches) {
            switch (t.phase) {
                case TouchPhase.MOVED:
                    HELPER_POINT = new Point(t.globalX, t.globalY);
                    globalToLocal(HELPER_POINT, HELPER_POINT);
                    if (downPoint) {
                        if (Math.abs(HELPER_POINT.y - downPoint.y) > game.RW * .025) {
                            isMoved = true;
                        }
                    }
                    if (isMoved) {
                        container.y = Math.min(MINY,  Math.max(game.RH-MY, CY + (HELPER_POINT.y - downPoint.y)));
                        container.clipRect = new Rectangle(0, -container.y + MINY - game.RW * .01, game.RW, game.RH - CY);
                    }
                    break;
                case TouchPhase.BEGAN:
                    CY = container.y;
                    HELPER_POINT = new Point(t.globalX, t.globalY);
                    globalToLocal(HELPER_POINT, HELPER_POINT);
                    downPoint = HELPER_POINT;
                    break;
            }
        }*/
    }
    private  h_levels(e: LEvent): void {
        /*
        if (!isMoved) {
            const t:LevButton = e.target as LevButton;
            const id = Math.floor(t.ID) - 1;
            this.dispatchEvent(LEvent.GO_SCREEN, {c:'start', id:id});
        }*/
    }
    private  h_buttons(e: LEvent): void {
        /*
        switch (e.target) {
            case b_save:
                game.save(game.SETTINGS_SLOT, game.SETTINGS);
                break;
            case b_add:
                game.SETTINGS.levels.push({});
                this.dispatchEvent(LEvent.GO_SCREEN, {c:'add', id:game.SETTINGS.levels.length-1});
                break;
            case b_back:
                this.dispatchEvent(LEvent.GO_SCREEN, {c:'back'});
                break;
        }*/
    }
}
