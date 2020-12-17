/**
 * Created by Fundemic and handed to Ganz 25.08.2015.
 */
import { Texture } from 'pixi.js';
import { Animation } from '../../lqs/animation';
import { IContainer } from '../../lqs/icontainer';
import { Game } from '../../lqs/game';
import { Cell } from '../../lqs/cell';
import { CellObject } from '../../lqs/cell-object';
import { Assets } from '../data/assets';

export class Element extends CellObject {

    private mov: Animation;
    private game: Game; // AtlantilesFundemic;
    private isHinted: boolean;
    private isKilled: boolean;
    private hintPhase: number;
    private isDead: boolean;
    private isEmpty: boolean;
    private isSolved: boolean;
    private minCost: number;

    constructor(g: Game, t: string, s: number) {
        super(t, s);

        this.minCost = 3;

        this.game = g; // as AtlantilesFundemic;
        this.addChild(this.img = g.getImage(t));
        this.addChild(this.mov = g.newAnimation((g.assets as Assets).removes));

        this.mov.alpha = .5;
        this.mov.scale.x = this.mov.scale.y = this.img.scale.x = this.img.scale.y = s;
        this.img.x = -this.img.width / 2;
        this.img.y = -this.img.height / 2;
        this.mov.x = -this.mov.width / 2;
        this.mov.y = -this.mov.height / 2;
        this.mov.visible = false;

        this.hintPhase = 0;
    }

    public swap(v: string): void {
        this.cellType = v;
        const tex: Texture = this.game.getTexture(v);
        this.img.texture = tex;
    }

    public animate(): void {
        if (this.isHinted) {
            this.hintPhase += .08;
            this.mov.alpha = Math.sin(this.hintPhase) * .2 + .3;
        }
        if (this.isKilled && !this.isDead) {
            if (this.mov.alpha > 0.99) {
                this.img.visible = false;
                this.mov.animate();
                if (this.mov.currentFrame === this.mov.totalFrames - 1) {
                    this.isDead = true;
                }
            } else {
                this.mov.alpha += .1;
            }
        }
    }

    public get IsEmpty(): boolean {
        return this.isEmpty;
    }

    public set IsEmpty(v: boolean) {
        this.isEmpty =  v;
    }

    public set IsSolved(v: boolean) {
        this.isSolved = v;
        this.alpha = this.isSolved ? .5 : 1;
    }

    public get IsSolved(): boolean {
        return this.isSolved;
    }

    /** override */public setCell(c: Cell): void {
        this.cell = c;
    }

    /** override */public applyPosition(): void {
        this.x = this.cell.x + this.cell.width / 2;
        this.y = this.cell.y + this.cell.height / 2;
    }

    public setCost(v: number): void {
        if ( this.minCost === 1) {
            return;
        } else {
            this.minCost = v;
        }
    }

    public get Cost(): number {
        return  this.minCost;
    }

    public set Hinted(v: boolean) {
        if (this.mov) {
            this.isHinted = v;
            this.mov.visible = v;
            this.hintPhase = Math.random() * Math.PI;
        }
    }

    public get IsKilled(): boolean {
        return this.isKilled;
    }

    public get IsDead(): boolean {
        return this.isDead;
    }

    public get Scale(): number {
        if (this.img) { return this.img.scale.x;
        } else { return this.mov.scale.x; }
    }

    public set Selected(v: boolean) {
        this.mov.visible = v;
        this.mov.alpha = .5;
    }

    public kill(): void {
        this.isKilled = true;
        this.isHinted = false;
        this.isSolved = false;
        this.mov.alpha = 0;
        this.mov.visible = true;
    }

    /** override */
    public destroy(): IContainer {
        this.mov = null;
        this.game = null;
        this.removeChildren();
        return super.destroy();
    }
}
