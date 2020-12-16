import { Container, Point, Graphics, Text, TextStyle } from 'pixi.js';
import { CheatCalls } from '../interfaces';

export class CheatView extends Container {
    public containers: Container[] = [];
    public cheatCalls: CheatCalls;

    constructor(stage: Container, labels: string[], cheatCalls: CheatCalls) {
        super();
        this.cheatCalls = cheatCalls;

        this.init(labels);
        stage.addChild(this);
    }

    /** ['Prev Level', 'Next Level', 'Next Field', 'Get Trophy'] */
    private init(labels: string[]):void {
        // 1.
        for (const label of labels) {
            this.containers.push( this.getSimpleButton(140, 30, 1, label));
        }

        //2.
        this.alignToEnd(this.containers);

        //3.
        for (const container of this.containers) {
            this.addChild(container);

            // Opt-in to interactivity
            container.interactive = true;

            // Shows hand cursor
            container.buttonMode = true;

            // Pointers normalize touch and mouse
            container.on('pointerdown', this.onClick);
        }
    }

    private onClick(event: any): void {
        const cheatView: CheatView = this.parent as CheatView;
        let i: number; const imax = cheatView.containers.length;
        for (i = 0; i < imax; i++) {
            if (event.target === cheatView.containers[i]) {
                cheatView.cheatCalls.cheatClickAtIndex(i);
            }
        }
    }

    /** Horizontal box x-align */
    private alignToEnd(containers: Container[]): void {
        let i: number; const imax = containers.length;
        for (i = 1; i < imax; i++) {
            containers[i].x = containers[i - 1].x + containers[i - 1].width * ( 1 + 0.05);
        }
    }

    /** Pixi rectangle and text field */
    private getSimpleButton(bgWidth: number, bgHeight: number, scale :number, copy: string): Container {
        const container = new Container();

        const graphics = new Graphics();
        graphics.beginFill(0x555555, 0.5);
        graphics.drawRect(0, 0, bgWidth, bgHeight);
        graphics.endFill();

        const style = new TextStyle({
            fill: 0xFFFFFF
        });

        const basicText = new Text(copy, style);
        basicText.x = (graphics.width - graphics.width) * .5;
        basicText.y = 0;

        container.addChild(graphics);
        container.addChild(basicText);
        container.scale = new Point(scale, scale);

        return container;
    }

    public cleanup(): void {
        if (this.parent) {
            this.parent.removeChild(this);
        }
        this.cheatCalls = null;
    }
}