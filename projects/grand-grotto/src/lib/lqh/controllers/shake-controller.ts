import { BaseModel } from '../progress-model/base-model';
import { Config } from '../config';

export class ShakeController {

    private shakeTime = 50;
    private shakeTimer = 0;

    private target: BaseModel;
    private targetX: number;
    private targetY: number;
    private targetRotation: number;

    constructor() {
    }

    public setTarget(target: BaseModel):void {
        this.target = target;
        this.targetX = target.x;
        this.targetY = target.y;
        this.targetRotation = target.rotation;
    }

    public setShakeDuration(arg: number): void {
        this.shakeTime = arg * Config.FPS_MODIFIER;
    }

    public shake(): void {
        this.shakeTimer = this.shakeTime;
    }

    public update(): void {
        if(this.shakeTimer > 0 && this.target) {
            this.shakeTimer--;

            const d2: number = Math.random() * Config.RW * .05 * this.shakeTimer / this.shakeTime;
            const d1: number = Math.random() * Config.RH * .05 * this.shakeTimer / this.shakeTime;
            
            // this.target.x = Math.floor(this.targetX + Math.random() * d1 - d1/2);
            // this.target.y = Math.floor(this.targetY + Math.random() * d2 - d2/2);
            this.target.setPosition(Math.floor(this.targetX + Math.random() * d1 - d1/2), Math.floor(this.targetY + Math.random() * d2 - d2/2))
        }
    }

    public cleanup(): void {
        this.target = null;
    }
}