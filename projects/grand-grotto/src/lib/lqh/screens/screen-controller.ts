import { Layout } from './layout';
import { IBaseAndScreenController } from '../interfaces';
import { Container } from 'pixi.js';

export class ScreenController {
    public container: Container;
    public layout: Layout;
    public baseController: IBaseAndScreenController;
    protected inited = false;
    public name: string;

    constructor(baseController: IBaseAndScreenController, name: string) {
        this.baseController = baseController;
        this.name = name;
        this.container = new Container();
    }

    protected createLayout(): void {}
    public init(): void { 
        this.inited = true;
        if (this.layout) {
            this.layout.init();
        }        
    }

    public update(delta: number): void {
        if (this.layout) {
            this.layout.update();
        }
    }

    public hide(): void {
        this.container.visible = false;
        if (this.layout) {
            this.layout.visible = false;
        }
    }

    public show(): void {
        this.container.visible = true;
        if (this.layout) {
            this.layout.visible = true;
        }
    }

    public resize(artLayoutWidth: number, artLayoutHeight: number, adjustedLayoutWidth: number, adjustedLayoutHeight: number, orienataion: string, orienationChanged: boolean): void {
        if (this.layout) {
            this.layout.resize(artLayoutWidth, artLayoutHeight, adjustedLayoutWidth, adjustedLayoutHeight, orienataion, orienationChanged);
        }
    }

    /** with base-controoler */
    public addEventListener(baseController: IBaseAndScreenController): void  {
        this.baseController = baseController;
    }
    public dispatchEvent(callerId: string, eventType: string): void {
        if (this.baseController) {
            this.baseController.execute(callerId, eventType);
        }
    }

    /** listener for layout */
    public execute(callerId: string, eventType: string): void {
        this.dispatchEvent(callerId, eventType);
    }

    public cleanup(): void {
        this.inited = false;

        if (this.layout) {
            this.layout.cleanup();
        }

        this.container.removeChildren();
        this.container.destroy();

        this.layout = null;
        this.baseController = null;
        this.container = null;
    }
}