import { CellModel } from '../progress-model/cell-model';
import { MathUtil } from '../util/math-util';
import { GameConfig } from '../../data/game-config';
import { Alias } from '../interfaces';

export class MoveToTargetController {
    private cells: CellModel[];
    private cellsXY: CellModel[][];
    private inCell: CellModel;
    private outCell: CellModel;

    private isDraining: boolean; // type of animation
    public isRunning: boolean; // state of animator
    public isFinished: boolean; // state of animator
    public startAnimTimer: number;
    private cellW: number;
    private cellH: number;

    constructor(cells: CellModel[], cellsXY: CellModel[][]) {
        this.cells = cells;
        this.cellsXY = cellsXY;
    }

    public setInOutCells(inCell: CellModel, outCell: CellModel): void {
        this.inCell = inCell;
        this.outCell = outCell;
  
        this.cellW = inCell.cellW;
        this.cellH = inCell.cellH;
    }

    /** Next room Animation - room is complete (out cell is opened) - drain remainin cells in outCell. */
    public start(isDraining: boolean): void {
        this.isDraining = isDraining;

        if (isDraining && !this.isRunning) {
            this.startAnimTimer = 3 * GameConfig.FPS_MODIFIER;
            this.startDrainingAnim(); // start next room animation

        } else if (!isDraining) {
            this.startFinishNextRoomAnim();
        }

        this.isRunning = true;
        this.isFinished = false;
    }

    /** flash: isFinishNextRoomAnim
     *      const inCell: Point = new Point(cellIn.x + w/2, cellIn.y);
     *      const inCellX: number = this.inCell.x;
     *      onst inCellY: number = this.inCell.y;
     *      cellObject.x += (inCellX - cellObject.x) * .23;
     *      cellObject.y += (inCellY - cellObject.y) * .23;
     */
    public preInitForFinishNextRoomAnim(): void {
        for (const cell of this.cells) {
            const cellObject = cell.getGuestByAlias(Alias.ALIAS_4_MATCHING_COLORs);

            if(cellObject) {
                // cellObject.setPosition(this.inCell.x, this.inCell.y);
                cellObject.moveToTarget0(this.inCell, true);
                
                cellObject.setScale(0, false); // set isRecoveringScale to false - otherwise, scale will recover due to 'click' scale recovering
                // cellObject.setVisible(false);
            }
        }
    }

    public update(): void {
        if (this.isDraining) {
            this.updateStartNextRoomAnim();
        } else {
            this.updateFinishNextRoomAnim();
        }
    }

    /** To start draining reset nextRoomSpeed
     * flaSH: isStartNextRoomAnim = true; >> startNextRoomAnim()
     */
    private startDrainingAnim(): void {
        for (const cell of this.cells) {
            const cellObject = cell.getGuestByAlias(Alias.ALIAS_4_MATCHING_COLORs);
            if(cellObject) {
                cellObject.nextRoomSpeed = 1;
            }
        }
    }

    private startFinishNextRoomAnim(): void {
        for (const cell of this.cells) {
            const cellObject = cell.getGuestByAlias(Alias.ALIAS_4_MATCHING_COLORs);
            if(cellObject) {
                cellObject.nextRoomSpeed = Math.random();
                cellObject.moveToTarget0(cell, false);
           }
        }
    }

    /** flash: isStartNextRoomAnim */
    private updateStartNextRoomAnim(): void {
        /* if (this.outCell === null || this.outCell === undefined) { // there was a problem with TransitionField coming here
            const d = 1;
            this.finish();
        } */

        const targetX: number = this.outCell.x; // this.outCell.x + this.cellW/2;
        const targetY: number = this.outCell.y + this.cellH * 0.25;;

        let cellForScale: CellModel;
        if(this.startAnimTimer > 0) { // startAnimTimer to point first to other point
            this.startAnimTimer--;
            cellForScale = this.cellsXY[0][4];
        } else {
            cellForScale = this.outCell;
        }

        let factor: number;
        let dx: number, dy: number, maxDif = 0;
        for (const cell of this.cells) {
            const cellObject = cell.getGuestByAlias(Alias.ALIAS_4_MATCHING_COLORs);
            if(cellObject) {

                if(cellObject.type.charAt(0) !== 'r' ) { // if(!object.IsRocket) {
                    if(cellObject.nextRoomSpeed === 1) {
                        cellObject.nextRoomSpeed = Math.random();
                    }
                    cellObject.nextRoomSpeed += (1 - cellObject.nextRoomSpeed) * .02;
                    factor = .13 * cellObject.nextRoomSpeed / GameConfig.FPS_MODIFIER;

                    dx = (targetX - cellObject.x);
                    dy = (targetY - cellObject.y);
                    maxDif = Math.max(Math.abs(dx), Math.abs(dy), maxDif);

                    cellObject.x = cellObject.targetX += dx * factor; // (targetX - cellObject.x) * .13 * cellObject.nextRoomSpeed;
                    cellObject.y = cellObject.targetY += dy * factor; // (targetY - cellObject.y) * .13 * cellObject.nextRoomSpeed;
                    cellObject.changedPosition = true;

                    cellObject.scale += 
                            (Math.min(cellObject.hasBrothers? 2 : 1,
                                    MathUtil.getDistance(cellObject, cellForScale)/(this.cellW * 2))
                            - cellObject.scale) * .3 / GameConfig.FPS_MODIFIER;
                    cellObject.changedScale = true;
                }
            }
        }

        if (this.startAnimTimer <= 0 && maxDif < 1) {
            this.finish();
        }
    }

    private updateFinishNextRoomAnim(): void {
        let dx: number, dy: number, maxDif = 0;
        let isScaleRecovering: boolean;
        for (const cell of this.cells) {
            const cellObject = cell.getGuestByAlias(Alias.ALIAS_4_MATCHING_COLORs);
            if(cellObject) {
                dx = Math.abs(cell.x - cellObject.x);
                dy = Math.abs(cell.y - cellObject.y);
                maxDif = Math.max(dx, dy, maxDif);
                isScaleRecovering = true; // (dx < 1 && dy < 1? true : false);

                cellObject.nextRoomSpeed += (1 - cellObject.nextRoomSpeed) * .01;
                // replace hasBrothers with isInGroup (?)
                cellObject.setScale(cellObject.scale + ((cellObject.hasBrothers ? 2 : 1) - cellObject.scale) * .2, isScaleRecovering);
            }
        }

        if (maxDif < 1) {
            this.finish();
        }
    }

    private finish(): void {
        this.isRunning = false;
        this.isFinished = true;
    }

    public reset(): void {
        this.isRunning = false;
        this.isFinished = false;
    }

    public cleanup(): void {
        this.cells = null;
        this.cellsXY = null;
        this.inCell = null;
        this.outCell = null;
    }
}