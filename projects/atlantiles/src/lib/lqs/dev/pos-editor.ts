/**
 * Created by Fundemic and handed to Ganz 27.01.2016.
 */
import { Container, Graphics, DisplayObject, Point } from 'pixi.js';
import { IContainer } from '.././icontainer';
import { LEvent } from '.././levent';

export class PosEditor extends Loop {
        private background: Graphics;
        private editedLoop:Loop;
        private b_save:TextButton;
        private dots:Vector.<DevDot>;
        private editedPositions: [];
        private lastDot:DevDot;
        public PosEditor(g: Game) {
            super(g, 'PosEditor');

            this.addChild(background = new Graphics());
                    background.graphics.beginFill(0x000000, 0.5);
                    background.graphics.drawRect(0, 0, game.RW, game.RH);
                    background.graphics.endFill();

            this.addChild(b_save = new TextButton('SAVE', 1, 0x256123, game.RW * .9, game.RH * .05, 'center'));
            dots = new <DevDot>[];
            addEventListener('click', h_back);
            b_save.addEventListener(LEvent.DEV_BUTTON, h_buttons);
        }
        /** override */public update(): void {
            editedLoop.applyPositions();
        }

        public initLoop(l:Loop): void {
            visible = true;
            editedLoop = l;
            while(dots.length) {
                removeChild(dots[0]);
                dots.splice(0, 1);
            }

            editedPositions = l.Positions;

            for (const pos: object of this.editedPositions) {
                const dot:DevDot = new DevDot();
                this.addChild(dot);
                dots.push(dot);
                dot.x = pos.parent.x + pos.parent.width * pos.point.x;
                dot.y = pos.parent.y + pos.parent.height * pos.point.y;
                dot.visible = pos.object.visible;
                dot.addEventListener('click', h_dots);
            }
        }

        // listeners
        private  h_back(e:TouchEvent): void {
            const touches:Vector.<Touch> = e.touches;
            for (const t:Touch of this.touches) {
                switch (t.phase) {
                    case TouchPhase.MOVED:
                    case TouchPhase.HOVER:
                        if (lastDot) {
                            const HELPER_POINT: Point = new Point(t.globalX, t.globalY);
                            this.globalToLocal(HELPER_POINT, HELPER_POINT);
                            lastDot.x = HELPER_POINT.x;
                            lastDot.y = HELPER_POINT.y;

                            const id = dots.indexOf(lastDot);
                            const pos: object = editedPositions[id];
                            pos.point.x = (lastDot.x - pos.parent.x)/pos.parent.width;
                            pos.point.y = (lastDot.y - pos.parent.y)/pos.parent.height;
                        }
                        break;
                    case TouchPhase.ENDED:
                        if (lastDot) lastDot.Selected = false;
                        lastDot = null;
                        break;
                    case TouchPhase.BEGAN:
                        break;
                }
            }
        }
        private  h_dots(e:TouchEvent): void {
            const touches:Vector.<Touch> = e.touches;
            for (const t:Touch of this.touches) {
                switch (t.phase) {
                    case TouchPhase.ENDED:
                        if (lastDot) lastDot.Selected = false;
                        lastDot = null;
                        break;
                    case TouchPhase.BEGAN:
                        lastDot = e.currentTarget as DevDot;
                        lastDot.Selected = true;
                        break;
                }
            }
        }
        private  h_buttons(e:LEvent): void {
            switch (e.target) {
                case b_save:
                    if (Framework.getTop().visible) {
                        Framework.getTop().visible = false;
                    } else {
                        game.saveParameters();
                        const input: Text = Framework.getTop().getChildAt(0) as Text;
                        input.visible = true; Framework.getTop().visible = true;
                        input.text = Json.encode(game.PARAMETERS);
                    }

                    break;
            }
        }
    }
}
