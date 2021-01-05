import { Container, Graphics, DisplayObject, Point, Sprite, Text, Texture } from 'pixi.js';
import { IContainer } from '../../lqs/icontainer';
import { Preloader } from '../../lq/preloader';
import { AssetData } from '../../lqs/interfaces';

export class Assets extends Preloader implements IContainer {
    public removes: string[];
    public pets: string[];

    constructor() {
        super();
    }

    /*
     * images = ['webkinz', 'loading', 'background', 'logo', 'btnClassic', 'btnInstructions', 'btnSettings', 'btnPlay', 'end_game'
     *              , 'menu_back', 'i1', 'i2', 'btnClose',
     *      'settings_01', 'settings_02', 'settings_back', 'empty',
     *      'sound_off', 'sound_on', 'music_off', 'music_on', 'btnHint', 'btnShowAll'
     *      , 'PanelCash', 'PanelLevel', 'Congratulations',
     *       'PanelScore', 'PanelTime', 'OutOfTime', 'OutOfMoves'];
     */
    public init(assetData?: AssetData): Assets {
        
        this.pets = [];
        this.removes = [];

        for (let i = 1; i < 12; i++) {
            this.removes.push('Remove_' + (i < 10 ? '0' : '') + i); // images.push(removes[i-1]);
        }

        for (let i = 1; i < 10; i++) {
            this.pets.push('AtlanteanArtifacts_' + i); // images.push('AtlanteanArtifacts_' + i);
        }

        for (let i = 1; i < 10; i++) {
            this.pets.push('UnderWaterFurniture_' + i); // images.push('UnderWaterFurniture_' + i);
        }

        for (let i = 1; i < 18; i++) {
            this.pets.push('UnderWaterPets_' + i); // images.push('UnderWaterPets_' + i);
        }

        return this;
    }

    /** get copy of pet's names - texture names. copy as it is changed. */
    public getPetsCopy(): string[]
    {
        return this.pets.slice();
    }

    /** get texture from png(by name) or from spritesheet(by spritesheet name and sub-texture name) */
    public getTexture(name: string, baseTextureId: string = 'tiles'): Texture
    {
        return super.getTexture(name, baseTextureId);
    }

    /** override */public destroy(): IContainer {
        this.removeChildren();
        return super.destroy();
    }
}
