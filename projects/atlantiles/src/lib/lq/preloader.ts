/**
 * Created by Fundemic and handed to Ganz 5/7 / 2015.
 */
import { Container, Loader, Sprite, Texture, IResourceDictionary, LoaderResource, Spritesheet, BaseTexture } from 'pixi.js';
import { IContainer } from '../lqs/icontainer';
// import { IOnComplete } from '../app-controller';
import { AssetData, AssetResource, SoundResource } from '../lqs/interfaces';
import { SoundController } from './sound-controller';

/** https://pixijs.download/dev/docs/PIXI.Loader.html */
export class Preloader extends Container implements IContainer {

    public static readonly PROGRESS: string = 'PROGRESS';
    private static readonly EMPTY = '';
    private static readonly DOT_PNG = '.png';

    private res = ''; // '@3x';
    private handler: Loader;
    private assetMap: Map<string, string>;

    protected images: Sprite[];
    protected sounds: [];
    protected audios: [];
    protected bitmaps: [];
    protected textures: Texture[];
    // protected game: Game;

    protected nameArray: string[] = [];

    constructor(/*g: Game = null*/) {
        super();

        this.handler = Loader.shared;

        // this.game = g;
        this.textures = [];
        this.audios = [];
        this.bitmaps = [];
    }

    public getResource(resource: string): LoaderResource {
        return this.handler.resources[resource];
    }

    public get resources(): IResourceDictionary {
        return this.handler.resources;
    }

    /** get texture from png(by name) or from spritesheet(by spritesheet name and sub-texture name) */
    public getTexture(name: string, baseTextureId: string = 'tiles'): Texture
    {
        // texture from png:
        let texture: Texture = this.getTexture2(name);

        // texture from spritesheet:
        if (!texture) {
            name = name + (name.indexOf(Preloader.DOT_PNG) === -1 ? Preloader.DOT_PNG : Preloader.EMPTY);
            texture = this.getTextureFromSpriteSheet(name, baseTextureId);
        }

        return texture;
    }

    public getTextureFromSpriteSheet(name: string, baseTextureId: string): Texture
    {
        // from cache
        // const sheet: Spritesheet = Loader.shared.resources[baseTextureId].spritesheet;
        const sheet: Spritesheet = this.handler.resources[baseTextureId].spritesheet;

        // from resource
        const resource: LoaderResource = this.handler.resources[baseTextureId];
        const frames: any[] = sheet.data.frames;
        for (let i = 0; i < frames.length; i++)
        {
            if (frames[i].filename === name)
            {
                return sheet.textures[i];
            }
        }

        return null;
    }

    /** get Texture from loaded png file. */
    public getTexture2(name: string): Texture
    {
        const resource: LoaderResource = this.handler.resources[name];
        if (resource) {
            return resource.texture; // this.handler.resources[name][texturteName] as Texture;
        }
        return null;
    }

    /** load, if there are severral spritesheets, sub-textures must have different names, which is different in room.  */
    /* public getTexture3(name: string): Texture
    {
        return Texture.from(name); // this.handler.resources[name][texturteName] as Texture;
    }*/

    /** Get textures for animation from array of names. */
    public getTexturesByNames(textureNames: string[]): Texture[]
    {
        const frames: Texture[] = [];
        for (const a of textureNames) {
            frames.push(this.getTexture(a));
        }
        return frames;
    }

    /* public getTextures2(arg: string[]): Texture[] {
        const textures: Texture[] = [];
        let i: number; const imax = arg.length;
        for (i = 0; i < imax; i++) {
            textures.push(Texture.from(arg[i]));
        }
        return textures;
    }*/

    /**
     * this.handler.reset(); from https://www.html5gamedevs.com/topic/42153-pixiloader-how-to-clear-resources-up/
     *  
     *  The best way to be is to make your own system based on SCENES. 
     * When you load the scene, load its resources. When you change the scene, move all resources that are used in new one to another loader and destroy all the stuff in old loader. 
     * If you make your own scene system, you'll be able to move it between games later, that way you wont need to fix the same bug twice. 
     */
    public destroy(): IContainer
    {
        this.removeChildren();

        for (const key in this.handler.resources)
        {
            if (this.handler.resources[key].texture instanceof Texture)
            {
                this.handler.resources[key].texture.baseTexture.destroy();
            }
        }
        this.handler.reset();

        if (this.textures) {
            for (const texture of this.textures) {
                if (texture) {
                    texture.destroy();
                    // texture = null;
                }
            }
            this.textures.length = 0;
        }
        this.sounds = null;
        this.images = null;
        this.audios = null;

        return this;
    }
}
