import { CellModel } from '../progress-model/cell-model';
import { MathUtil } from '../util/math-util';
import { CellObjectModel } from '../progress-model/cell-object-model';
import { MatchingController } from './matching-controller';
import { SoundController } from './sound-controller';
import { Config } from '../config';

export class ReshuflleController {
    private readonly RESHUFFLE_TIME = 100 * Config.FPS_MODIFIER; // use 50 for debugging
    private readonly FAST_RESHUFFLE_TIME = 50 * Config.FPS_MODIFIER;
    private readonly FAST_RESHUFFLE_HALF_TIME = this.FAST_RESHUFFLE_TIME / 2;

    private cells: CellModel[];
    private cellsXY: CellModel[][];
    private matchingController: MatchingController;
    private matchedLength2Sets: CellModel[];

    private reshuffling = false;
    private reshuffleAnimTimer: number;
    private reshuffleTimer: number; // regular time to check
    private fastReshuffleTimer: number; // reshuffle when we just reshuffled (as we add one combination only) - and there may be just one combinations

    constructor(cells: CellModel[], cellsXY: CellModel[][], matchingController: MatchingController) {
        this.cells = cells;
        this.cellsXY = cellsXY;
        this.matchingController = matchingController;

        this.resetReshuffleTimers();
    }

    /* Is checked in update routine of field-model
     */
    private checkTimerForReshuffle(): void {
        if (--this.reshuffleTimer === 0) {
            this.checkIfNeedForReshufle();
            this.resetReshuffleTimers();
        }
    }

    /* 
     * in original there is also: 
     *       if(!isCellFallen) { checkIfNeedForReshufle(); } // actually called 'reshuffle()'
     */
    public checkFastTimerForReshuffle(): void {
        if (--this.fastReshuffleTimer === 0) {
            this.checkIfNeedForReshufle();
            this.resetReshuffleTimers();
        }

    }

    public resetReshuffleTimers(): void {
        this.reshuffleTimer = this.RESHUFFLE_TIME; // GameConfig.RESHUFFLE_TIMER;
        this.fastReshuffleTimer = this.FAST_RESHUFFLE_TIME; //GameConfig.RESHUFFLE_TIMER;
    }

    // --- ---
    /** The routine - exactly as it was */
    private checkIfNeedForReshufle(): void {
        const matchedCells: CellModel[] = this.matchingController.findBiggestMatchedSet(true);
        if (matchedCells.length < 3) {
        // if (!this.reshuffling) {
            this.matchedLength2Sets = this.matchingController.matchedLength2Sets;

            // if (this.matchedLength2Sets.length === 0) {
                this.addOneRandom();
            // }

            this.start();
            SoundController.getInstance().playSound('gems_drop');
        }
    }

    private start(): void {
        this.reshuffling = true;
        this.reshuffleAnimTimer = this.FAST_RESHUFFLE_TIME;
    }

    private stop(): void {
        this.reshuffling = false;

    }

    /**
     * @return is reshuffling in process
     */
    public update(): boolean {
        if (!this.reshuffling) {
            this.checkTimerForReshuffle();

        } else { // if ( this.reshuffling) {
            // const centerCell: Point = new Point(W/2, H/2);
            const centerCellX: number = (Config.countX - 1) / 2 * Config.cellW; // centerCell.x;
            const centerCellY: number = (Config.countY - 1) / 2 * Config.cellH; // centerCell.y;

            for (const cell of this.cells) {
                const object: CellObjectModel = cell.getCheck();
                if(object) {
                    if(this.reshuffleAnimTimer > this.FAST_RESHUFFLE_HALF_TIME) {
                        object.setPosition(
                            object.x + (centerCellX - object.x) * .15,
                            object.y + (centerCellY - object.y) * .15);
                    } else {
                        object.moveToTarget0(cell, false);
                    }
                }

                /* FOR fallDownWaitTimer = 2; !
                const guests: CellObjectModel[] = cell.getGuests();
                for (const g1 of guests) {
                    g1.animate();
                    if(g1.IsDead) {
                        delObject(g1);
                        fallDownWaitTimer = 2;
                    }
                } */
            }

            if(this.reshuffleAnimTimer === this.FAST_RESHUFFLE_HALF_TIME) {
                this.reshuffleChecks(this.matchedLength2Sets);
            }

            if(this.reshuffleAnimTimer === 0) {
                this.stop();
            }

            this.reshuffleAnimTimer--;
        }

        return this.reshuffling;
    }

    /** difference, game had an Array with every cell 'twice' in order:
     *   [0]	com.webkinz.subApplications.grandGrotto.loops.Cell (@a71f791)	
     *   [1]	com.webkinz.subApplications.grandGrotto.loops.Cell (@a71f6a1)	
     *   [2]	com.webkinz.subApplications.grandGrotto.loops.Cell (@a71f6a1)	
     *   [3]	com.webkinz.subApplications.grandGrotto.loops.Cell (@a71f791)	
     */
    public reshuffleChecks(arr2elems: CellModel[]): void {
        /* moved to matchingController:
        // let's do it as in original - each element is there twicw + order?
        let i: number; const imax = arr2elems? arr2elems.length : 0;
        for (i = 0; i< imax; i++) {}
        */

        while(arr2elems.length > 0) {
            const ally: CellModel = MathUtil.getRandomArrayMember(arr2elems);
            arr2elems.splice(arr2elems.indexOf(ally), 1);

            if(this.addOneAlly(ally)) {
                console.log('[ReshuffleController] replaced');
                return;
            } else {
                console.log('[ReshuffleController] NOT replaced arr2elems.length: ' + arr2elems.length);
            }
        }
        console.log('[ReshuffleController] NO MOVES !!!!');
    }

    private addOneAlly(cell: CellModel): boolean {
        const differentColorNeighbors: CellModel[] = this.matchingController.getCloseNeighboursOfDifferentColor(cell);

        if(differentColorNeighbors.length > 0) {

            const cellR: CellModel= MathUtil.getRandomArrayMember(differentColorNeighbors);
            const elem: CellObjectModel = cellR.getCheckNoPowerUps(); // colored, but not power up

            const old: string = cellR.toString();
            if (elem) { // it might be powerup, not gem
                elem.replaceColor(cell.color);
                // console.log('   [reshuflle-controller].addOneAlly() from: ' + old + ', to: ' + cellR.toString());

                return true;
            } else {
                console.log(' [reshuflle-controller].addOneAlly() not added elem: ' + cell.getCheck());
            }
        }

        console.log(' [reshuflle-controller].addOneAlly() not added at: ' + cell.toString() + ', differentColorNeighbors.length: ' + differentColorNeighbors.length);
        return false;
    }

    /** Replace one color randomly */
    public addOneRandom():void {
        const imax = this.cells.length;
        let index2: number = MathUtil.getRandomInteger(imax - 1, 0);

        let isReplaced = false;
        while(!isReplaced) {
            const cell: CellModel = this.cells[index2];
            const elem: CellObjectModel = cell.getCheckNoPowerUps(); // colored, but not power up

            if(elem) {
                let index = -1;
                while(index === -1 || index === elem.color ) { // while -1 OR same as old color
                    index = MathUtil.getRandomArrayMember(Config.colorsEnabled) + 1; // "+ 1" - as per game data
                }

                const old: string = cell.toString();

                isReplaced = true;
                elem.replaceColor(index);

                // console.log('[reshuflle-controller].addOneRandom() from: ' + old + ', to: ' + cell.toString());

            // loop index2
            } else if (++index2 >= imax - 1) {
                index2 = 0;
            }

        }
    }

    public cleanup(): void {
        this.cells = null;
        this.cellsXY = null;
        this.matchingController = null;
    }
}