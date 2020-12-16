import { LayoutImage, LayoutImageType } from '../../lqh/screens/layout-image';
import { Container, Sprite } from 'pixi.js';
import { ContainerButton } from '../../lqh/view/container-button';
import { IButtonClickHandler } from '../../lqh/interfaces';

export class SpriteButton extends ContainerButton {
    private container: Container;
    private sprite: Sprite;

    constructor(textureName: string, id: string, buttonClickHandler: IButtonClickHandler, px: number, py: number, scale: number) {
        super(id, buttonClickHandler);

        this.x = px;
        this.y = py;

        this.addChild(this.container = new Container());
        this.container.addChild(this.sprite = new LayoutImage(textureName, 0, 0, LayoutImageType.EXTERNAL_SCALE, scale));
    }
}