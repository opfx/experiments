/** It's a model. Introduced for porting Fundemic mini-framework.
 *  Change: separation from view. It's a pool design, so check changes in update().
 *  Animation doesn't adjust to device play speed. 
 * 
 *  Idea of animation is that cell-object-model is a state-machine and will a list of animations
 */
export enum AnimationState {
    PENDING = 'AnimationView.notCreatedYet',
    ACTIVE = 'AnimationView.isActive',
    DISCARDED = 'AnimationView.finishedAndDiscarded'
}

export class AnimationModel {
    // some vars are public, please don't change those values, use them only like getters:

    // init
    public animationId: string; // Asset Config
    public totalFrames: number;
    public currentFrame: number;
    public playing: boolean;
    public looped: boolean;
    public reversed: boolean;
    // additional property 
    public maskId: string; // Asset Config

    // life circle: view-pending, view-active, view-discarded
    public state = AnimationState.PENDING; // so you may create 'sleeping' animation: model is create, view is not created
    public completed: boolean;
    public loopCount: number;

    public frameChanged: boolean;

    public skipMax: number;
    private skipCounter: number;

    constructor() {
    }

    public init(animationId: string, totalFrames: number, skipMax: number = 0, currentFrame: number = 0, playing: boolean = true, looped: boolean = false, reversed: boolean = false): void {
        this.animationId = animationId;
        this.totalFrames = totalFrames;
        this.currentFrame = currentFrame;
        this.playing = playing;
        this.looped = looped;
        this.reversed = reversed;

        this.loopCount = 0;
        this.completed = false;

        this.frameChanged = false;

        this.skipMax = skipMax;
        this.skipCounter = 0;
    }

    public update(): void {
        if (this.state !== AnimationState.PENDING 
            && this.playing) {
                
            this.updateAfterSkipSomeUpades();
        }
    }

    // --- ---
    /** called from view */
    public resetChanged(): void { this.frameChanged = false;}

    public play(): void { this.playing = true;}
    public stop(): void { this.playing = false;}

    /** called from model */
    public gotoAndPlay(frame: number): void {
        this.goto(frame);
        this.play();
    }

    public gotoAndStop(frame: number): void {
        this.goto(frame);
    }

    private goto(frame: number): void {
        frame = Math.max(0, frame);
        frame = frame % this.totalFrames; // instead of Math.min
        if (this.currentFrame !== frame) {
            this.currentFrame = frame;
            this.frameChanged = true;
        }
    }

    // --- ---
    private updateAfterSkipSomeUpades(): void {
        if (this.skipMax === 0 || this.skipCounter++ > this.skipMax) {
            this.skipCounter = 0;

            if (!this.reversed) {
                this.nextFrame();
            } else {
                this.previousFrame();
            }
        }
    }

    private nextFrame(): void {
        if (this.currentFrame < this.totalFrames - 1) {
            this.currentFrame++;
        
        } else {
            if (this.looped) {
                this.currentFrame = 0;
                this.loopCount++;

            } else {
                this.playing = false;
                this.completed = true;
            }
        }

        this.frameChanged = true;
    }

    private previousFrame(): void {
        if (this.currentFrame > 0) {
            this.currentFrame--;
        
        } else {
            if (this.looped) {
                this.currentFrame = this.totalFrames - 1;
                this.loopCount++;

            } else {
                this.playing = false;
                this.completed = true;
            }
        }

        this.frameChanged = true;
    }

    // --- ---
    /** cleanup should be empty as class should not have any references. */
    public cleanup(): void {}
}