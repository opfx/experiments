/**
 * Created by Fundemic and handed to Ganz 05.10.2015.
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
import { GameCell } from './game-cell';
import { Field } from './game-field';

export class TutorialOne extends Loop {
    private background: Graphics;
    private levelID: number;
    private pers: LImage;
    private frame: LImage;
    private targetLabel: LText;
    private field: Field;
    private arm: Animation;
    private animTimer: number;
    private animCursor: number;
    private lineCursor: number;
    private animCount: number;
    private blocks: number;
    private currentBlock: number;
    private line: [];
    private line2: [];
    private texts: [];
    private container: Container;
    private bonus: GameCell;
    private scaleTutorial: number;


    constructor(g: Game, f: Field, s: number) {
        super(g, 'TutorialOne');

        /*
        scaleTutorial = s;
        field = f;
        this.addChild(container = new Sprite());

        container.addChild(background = new Graphics());
        container.addChild(pers = new LImage(g, 'pers_start_2',
                            game.RW * Constants.TUTORONE_PERS_P.x,
                            game.RH * Constants.TUTORONE_PERS_P.y, s));
        container.addChild(frame = new LImage(g, 'frame_tutorial',
                            game.RW * Constants.TUTORONE_FRAME_P.x,
                            game.RH * Constants.TUTORONE_FRAME_P.y, s * Constants.TUTORONE_FRAME_S));
        frame.scale.x *= Constants.TUTORONE_FRAME_SX;

        container.addChild(targetLabel = new LText('Super', 2, frame.x,
                        frame.y + game.RW * Constants.TUTORONE_FRAME_DX, 0xffffff, Constants.TUTORONE_TARGET_S * s));
        this.addChild(arm =  new Animation(game, ['arm_1', 'arm_2']));
        arm.scale.x = arm.scale.y = s;
        arm.interactive = false;
        background.graphics.beginFill(0, .5);
        background.graphics.drawRect(0, 0, g.RW, g.RH * .5);
        background.graphics.endFill();

        const blur:BlurFilter = new BlurFilter(.5, .5, 3);
        targetLabel.filter = blur;

        texts = ['Connect the\nberries to squish\nand clear them',
            'Nice Work!\nMake longer chains to\nfill the meter faster',
            'Try a combo\nof 7+ berries!',
            'Use shining berries\nto blast the row\nor column',
            'To clear rot,\nconnect berries over it!',
                'Clear all rot\nto complete level',
            'Collect jam jars\nby letting them\nfall to the bottom!',
            'Connect berries next\nto the flies blocking your\nway to clear them out!'
        ];
        */
    }

    public setText(v: number): void {
        /*
        targetLabel.text = texts[v];
        targetLabel.x = game.RW * Constants.TUTORONE_TARGET_P.x - targetLabel.width / 2;
        targetLabel.y = game.RW * Constants.TUTORONE_TARGET_P.y - targetLabel.height / 2;
        */
    }

    public isComplete(selected: GameCell[]): boolean {
        /*
        const count = 0;
        for (let i = 0; i<selected.length; i++) {
            for (const j = 0; j<line.length; j++) {
                if (selected[i] === line[j]) {
                    count++;
                }
            }
        }

        if (count >= line.length) {
            return true;
        } else {
            return false;
        }*/
        return true;
    }
    /** override */public destroy(): IContainer {
        if (this.pers){
            this.pers.destroy();
            this.pers.destroy();
        }
        if (this.frame){
            this.frame.destroy();
            this.frame.destroy();
        }

        this.background = null;
        this.pers = this.frame = null;
        this.targetLabel = null;
        this.field = null;
        this.arm = null;
        this.line = this.line2 = this.texts = null;
        this.container = null;
        this.bonus = null;
        this.removeChildren();
        return super.destroy();
    }

    public nextBlock(): void {
        /*
        currentBlock++;
        const cell:Cell, i: number;
        arm.alpha = 0;
        alpha = 0;
        if (currentBlock <= blocks) {
            Scale = Scale;

            switch(levelID) {
                case 1:
                    line = line2;
                    for (i = 0; i<line.length; i++) {
                        cell = line[i];
                        if (cell.delta) {
                            cell.delta = null;
                            line[i] = field.getCell(cell.X, cell.Y + 1);
                        }
                    }
                    animTimer = 0;
                    animCursor = 0;
                    animCount = 5;
                    setText(1);
                    break;
                case 4:
                    line = line2;
                    for (i = 0; i<line.length; i++) {
                        cell = line[i];
                        if (cell.delta) {
                            cell.delta = null;
                            line[i] = field.getCell(cell.X, cell.Y + 1);
                        }
                    }
                    animTimer = 0;
                    animCursor = 0;
                    animCount = 5;
                    setText(3);

                    break;
                case 6:
                    setText(5);

                    line = line2;
                    for (i = 0; i<line.length; i++) {
                        cell = line[i];
                        if (cell.delta) {
                            cell.delta = null;
                            line[i] = field.getCell(cell.X, cell.Y + 1);
                        }
                    }
                    animTimer = 0;
                    animCursor = 0;
                    animCount = 5;
                    break;
            }
        } else {
            visible = false;
        }
        */
    }
    /** override */
    public update(): void {
        /*
        if (visible && alpha > 0.5) {

            const fs = field.scale.x;
            const cellW2 = field.CellW/3;
            if ( animTimer++ > Constants.TUTORIAL_ARM_TIME * 2) {
                animTimer = 0;
                animCursor++;
                if (animCursor > animCount) {
                    animCursor = 0;
                }
            }
            switch (animCursor) {
                case 0:
                    lineCursor = 1;
                    arm.currentFrame = 0;

                    break;
                case 1:
                    arm.alpha += (1 - arm.alpha) * .15;
                    arm.x += (field.x + line[0].x * fs + cellW2 - arm.x) * Constants.TUTORIAL_ARM_SPEED;
                    arm.y += (field.y + line[0].y * fs + cellW2 - arm.y) * Constants.TUTORIAL_ARM_SPEED;
                    break;
                case 2:
                    arm.alpha += (1 - arm.alpha) * .15;
                    if (animTimer > Constants.TUTORIAL_ARM_TIME) {
                        arm.currentFrame = 1;
                    }
                    break;
                case 3:
                    arm.x += (field.x + line[lineCursor].x * fs + cellW2 - arm.x) * Constants.TUTORIAL_ARM_SPEED;
                    arm.y += (field.y + line[lineCursor].y * fs + cellW2 - arm.y) * Constants.TUTORIAL_ARM_SPEED;
                    if (animTimer === Constants.TUTORIAL_ARM_TIME * 2) {
                        lineCursor++;
                        if (lineCursor < line.length) {
                            animTimer = 0;
                        } else {
                            animTimer = Constants.TUTORIAL_ARM_TIME * 2.5;
                        }
                    }
                    break;
                case 4:
                    if (animTimer > Constants.TUTORIAL_ARM_TIME) {
                        arm.currentFrame = 0;
                    }
                    break;
            }

        }*/
    }
    public initTutor(id: number): void {
        /*
        visible = true;
        arm.alpha = 0;
        alpha = 0;
        levelID = id + 1;
        const colors: [] = field.Colors;
        const deleteColor: number, i: number;
        const deleteColor2: number;

        switch (levelID) {
            case 1:
                setText(0);
                currentBlock = 1;
                blocks = 2;
                animCount = 5;
                animTimer = 0;
                animCursor = 0;
                deleteColor = Math.floor(Math.random() * colors.length);
                field.randomizeArea(colors, 0, 5, 7, 3, deleteColor);
                line = field.randomizeArea([deleteColor], 2, 6, 3, 1, -1);

                for (i = 0; i<colors.length; i++) {
                    if (colors[i] !== deleteColor) {
                        deleteColor2 = colors[i];
                        break;
                    }
                }
                field.randomizeArea(colors, 0, 0, 7, 5, deleteColor2);
                line2 = field.randomizeArea([deleteColor2], 2, 2, 2, 1, -1);
                line2[0].delta = [0, 1];
                line2[1].delta = [0, 1];
                (field.getCell(1, 0) as Cell).replaceElement(deleteColor2 + 1 + 'p');
                (field.getCell(5, 0) as Cell).replaceElement(deleteColor2 + 1 +'p');
                (field.getCell(1, 2) as Cell).replaceElement(deleteColor2 + 1 +'p');
                (field.getCell(3, 1) as Cell).replaceElement(deleteColor2 + 1 +'p');
                (field.getCell(4, 1) as Cell).replaceElement(deleteColor2 + 1 +'p');
                line2.splice(0, 0, field.getCell(1, 2));
                line2.push(field.getCell(3, 1));
                line2[3].delta = [0, 1];
                line2.push(field.getCell(4, 1));
                line2[4].delta = [0, 1];
                break;
            case 4:
                currentBlock = 1;
                blocks = 2;
                animCount = 5;
                animTimer = 0;
                animCursor = 0;
                deleteColor = Math.floor(Math.random() * colors.length);
                for (i = 0; i<colors.length; i++) {
                    if (colors[i] !== deleteColor) {
                        deleteColor2 = colors[i];
                        break;
                    }
                }
                field.randomizeArea(colors, 0, 4, 7, 5, deleteColor);
                line = field.randomizeArea([deleteColor], 1, 6, 5, 1, -1);
                line.splice(0, 0, field.getCell(0, 5));
                line.push(field.getCell(5, 7));
                (field.getCell(0, 5) as Cell).replaceElement(deleteColor + 1 + 'p');
                (field.getCell(5, 7) as Cell).replaceElement(deleteColor + 1 +  'p');
                field.randomizeArea(colors, 0, 0, 7, 4, deleteColor2);
                line2 = field.randomizeArea([deleteColor2], 4, 0, 1, 3, -1);
                line2.splice(0, 1);
                    line2.push(field.getCell(4, 3));
                (field.getCell(4, 1) as Cell).replaceElement(deleteColor2 + 1 +  'p');
                bonus = field.getCell(4, 1) as Cell;
                setText(2);
                break;
            case 6:
                currentBlock = 1;
                blocks = 2;
                animCount = 5;
                animTimer = 0;
                animCursor = 0;
                deleteColor = Math.floor(Math.random() * colors.length);
                for (i = 0; i<colors.length; i++) {
                    if (colors[i] !== deleteColor) {
                        deleteColor2 = colors[i];
                        break;
                    }
                }
                field.randomizeArea(colors, 0, 4, 7, 5, deleteColor);
                line = field.randomizeArea([deleteColor], 2, 6, 3, 1, -1);

                field.randomizeArea(colors, 0, 0, 7, 4, deleteColor2);

                line2 = field.randomizeArea([deleteColor2], 2, 2, 3, 1, -1);
                line2[0].delta = [0, 1];
                line2[1].delta = [0, 1];
                line2[2].delta = [0, 1];
                setText(4);

                break;
            case 13:
                currentBlock = 1;
                blocks = 1;
                animCount = 5;
                animTimer = 0;
                animCursor = 0;
                deleteColor = Math.floor(Math.random() * colors.length);
                field.randomizeArea(colors, 0, 4, 7, 5, deleteColor);
                setText(6);

                const item:Element = field.findItem();
                const itemCell:Cell = item.getCell() as Cell;
                field.replaceCells(itemCell, field.getCell(itemCell.X, itemCell.Y + 5) as Cell);
                line = field.randomizeArea([deleteColor], itemCell.X, item.getCell().Y + 1, 1, 3, -1);
                break;

            case 21:
                setText(7);

                currentBlock = 2;
                Scale = Scale;
                blocks = 1;
                animCount = 5;
                animTimer = 0;
                animCursor = 0;
                deleteColor = Math.floor(Math.random() * colors.length);
                field.randomizeArea(colors, 0, 0, 7, 4, deleteColor);
                line = field.randomizeArea([deleteColor], 2, 3, 3, 1, -1);
                break;
            default :
                visible = false;
                break;

        }

        Scale = Scale;
        */
    }

    public set Bonus(v: GameCell)
    {
        // bonus = v;
    }

    public get Bonus(): GameCell {
        return this.bonus;
    }

    /** override */
    public set Scale(v: number) {
        super.Scale = v;
        /*
        this.container.y = (this.currentBlock === 2 ? game.RH *.5 :0);
        */
    }
}
