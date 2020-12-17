/**
 * Created by Fundemic and handed to Ganz 28.09.2015.
 */
import { Text, BitmapText } from 'pixi.js';

/** https://www.adammarcwilliams.co.uk/creating-bitmap-text-pixi/ */

/** Old Starling 1.0:
 *   const font:BitmapFont = Text.getBitmapFont("fundemicFont" + f);
 *   font.smoothing = TextureSmoothing.NONE;
 *   super(22, 22, t, 'fundemicFont' + f, 12, 0xffffff);
 */
// export class LText extends Text { // Pixi.Text
export class LText extends BitmapText {
    constructor(text: string, fontIndex: number, px: number, py: number, color: number, scale: number) {

        // const fontSize0 = 12 * scale * 0.45; // as3 and Pixi.Text
        const fontSize0 = 12 * scale * 0.5;

        // tslint:disable-next-line: max-line-length
        // AS3: const format: object = {fontFamily: 'fundemicFont' + fontIndex, fontSize: fontSize0, fill: color || 0xffffff, align: 'center'};
        // Pixi.Text: const format: object = {fontName: 'font' + fontIndex, fontSize: fontSize0, fill: color || 0xffffff, align: 'center'};
        const format: any = {fontName: 'font' + fontIndex, fontSize: fontSize0, align: 'center'};
        super(text, format);

        this.x = px;
        this.y = py - 2; // is overriden in GamePlay, search for Constants.GAMEPLAY_TEXTLABEL_SCALE
   }
}
