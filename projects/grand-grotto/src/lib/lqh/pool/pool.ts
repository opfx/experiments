import { Container, Sprite, Texture, AnimatedSprite, Point, Text, TextStyle } from 'pixi.js';
import { CellObjectModel } from '../progress-model/cell-object-model';
import { AssetConfig } from './asset-config';
import { AnimationData } from './animation-data';
import { MathUtil } from '../util/math-util';
import { ObjectFactory } from '../interfaces';

export class Pool {
    public static instance: Pool;
    private static pools: Pool[] = [];
    private static poolConfig: AssetConfig;
    private static objectFactory: ObjectFactory;
    public static readonly EMPTY_STRING = '';
    
    private static TYPE_CONTAINER = 'TYPE_CONTAINER';
    private static TYPE_SPRITE = 'TYPE_SPRITE'; // extends CONTAINER
    private static TYPE_LAYOUT_IMAGE = 'LAYOUT_IMAGE'; // extends Sprite extends CONTAINER
    private static TYPE_TEXT = 'TYPE_Text'; // extends Sprite extends CONTAINER
    private static TYPE_ANIMATED_SPRITE = 'TYPE_ANIMATED_SPRITE'; // extends SPRITE extends CONTAINER
    private static TYPE_CELL_OBJECT_MODEL = 'TYPE_CELL_OBJECT_MODEL';

    public type: string;
    public id: string;
    public  displayObjects: Container[] = [];
    public texture: Texture;
    public textures: Texture[];
    public textureName: string;
    public textureNames: string[];
    public textureNamesId: string;

    constructor (type: string, id: string) {
        this.type = type;
        this.id = id;
    }

    public static setAssetConfig(arg: AssetConfig): void {
        Pool.poolConfig = arg;
    }

    public static setFactory(arg: ObjectFactory): void {
        this.objectFactory = arg
    }

    /**
     * @param type -examples: sprite, animated sprite, container, cell-object-model
     * @param id - textureId for single texture or array of textures OR texture name or texture name array - toString
     */
    private static getPoolByTypeAndId(type: string, id: string): Pool {
        if (type !== Pool.EMPTY_STRING && id !== null) {
            let pool: Pool;
            // A. existing instance
            for (pool of Pool.pools) {
                if (type === pool.type && id === pool.id) {
                    return pool;
                }
            }
            // B. new instance
            pool = new Pool(type, id);
            Pool.pools.push(pool);
            return pool;
        }
        return null;
    }

    // --- ---
    /** There is a weird bug: child.parent.width = 0, while child.width > 0 ! 
     *      after let child: Sprite = Pool.takeOutDisplayObjectById(textureId); 
     */
    public static createNewInstance(id: string, anchorX: number = 0.5, anchorY: number = 0.5): Sprite {
        let sprite: Sprite, name: string, textureName: string;
        const animationData: AnimationData = this.poolConfig? this.poolConfig.getAnimationData(id) : null;
        if (animationData) {
            name = animationData.textureNamesId;
            // get pool only for method pool.getTextures()
            const pool = Pool.getPoolByTypeAndId(Pool.TYPE_ANIMATED_SPRITE, animationData.textureNamesId);
            sprite = new AnimatedSprite(pool.getTextures( animationData.textureNames ));

        } else {
            name = textureName = Pool.getTextureNameById(id);
            sprite = new Sprite(Texture.from(textureName));
        }

        if (sprite) {
            sprite.anchor.set(anchorX, anchorY);
            sprite.name = name;
        }

        return sprite;
    }

    /** takeOut() Animated  sprite or Sprite by id (id in games are different form textureNames. */
    public static takeOutDisplayObjectById(id: string, anchorX: number = 0.5, anchorY: number = 0.5): Sprite {
        const animationData: AnimationData = this.poolConfig? this.poolConfig.getAnimationData(id) : null;
        if (animationData) {
            return Pool.takeOutAnimatedSprite(animationData);
        }

        return Pool.takeOutSprite(Pool.getTextureNameById(id), anchorX, anchorY);
    }

    /** decorate */
    private static getTextureNameById(id: string ): string {
        return this.poolConfig? this.poolConfig.getTextureNameById(id) : null;
    }

    /**
     * Used to be: 
     *      const sprite: Sprite = new Sprite(Texture.from( textureName ));
     *      return sprite;
     * 
     * @param textureName 
     */
    public static takeOutSprite(textureName: string, anchorX: number = 0.5, anchorY: number = 0.5): Sprite {
        const pool = Pool.getPoolByTypeAndId(Pool.TYPE_SPRITE, textureName);
        let object:Sprite = pool? pool.takeOut() as Sprite : null;
        if (pool && object === null) {
            if (!pool.texture) {
                pool.textureName = textureName;
                pool.texture = Texture.from( textureName );
            }

            if (pool.texture) {
                object = new Sprite(pool.texture);
                object.name = textureName;
                // object.cacheAsBitmap = true;
            }            
        }

        if (object) {
            object.anchor.set(anchorX, anchorY);
        }

        return object;
    }

    public static takeOutAnimatedSprite(animationData: AnimationData): AnimatedSprite {
        const textureNamesId = animationData.textureNamesId;

        const pool = Pool.getPoolByTypeAndId(Pool.TYPE_ANIMATED_SPRITE, textureNamesId);
        let object: AnimatedSprite = pool? pool.takeOut() as AnimatedSprite : null;
        if (pool && object === null) {
            if (!pool.textures) {
                pool.textureNamesId = textureNamesId;
                pool.textureNames = animationData.textureNames;
                pool.textures = pool.getTextures( animationData.textureNames );
            }

            if (pool.textures) {
                object = new AnimatedSprite(pool.textures);
                object.name = textureNamesId;
            }
        }

        if (object) {
            object.anchor.set(animationData.anchorX, animationData.anchorY);
            object.animationSpeed = animationData.animationSpeed;
            object.gotoAndStop(0);
            
            if (animationData.playOnInit) {
                // object.gotoAndPlay( MathUtil.getRandomInteger(object.totalFrames - 1, 0));
                object.play();
            }
        }

        return object;
    }

    public static getText(copy: string): Text {
        const pool = Pool.getPoolByTypeAndId(Pool.TYPE_TEXT, Pool.TYPE_TEXT);
        
        let object: Text = pool? pool.takeOut() as Text : null;   
        if (object === null) {
            const style = new TextStyle({
                fill: 0xFFFFFF,
                fontSize: 32,
                align: 'center',
                stroke: 'black',
                strokeThickness : 1
            });
            object = new Text(copy, style);

        } else {
            object.text = copy;
        }

        return object;
    }

    // --- ---
    /** Define in poolConfig if needed */
    public static takeOutCellObjectModel(type: string): CellObjectModel {
        if (Pool.poolConfig) {
            return Pool.objectFactory.createCellObjectModel(type);
        }
        return new CellObjectModel();
    }

    // --- ---
    /** var className: string = this.constructor.toString().match(/\w+/g)[1]; */
    public static takeIn(arg: Container): boolean {
        if (arg) {
            let type = Pool.EMPTY_STRING;
            let texturesId: string = arg.name; // tricki part;

            if (arg instanceof AnimatedSprite) {
                type = Pool.TYPE_ANIMATED_SPRITE;
    
            } else if (arg instanceof Text) {
                type = Pool.TYPE_TEXT;
                texturesId = Pool.TYPE_TEXT;

            } else if (arg instanceof Sprite) {
                type = Pool.TYPE_SPRITE;

            } else if (arg instanceof Container) {
                type = Pool.TYPE_CONTAINER;
                
            }

            const pool: Pool = Pool.getPoolByTypeAndId(type, texturesId);
            if (pool) {
                return pool.takeIn(arg);
            }

            return false;
        }

        return false;
    }

    public static cleanup(): void {
        while(Pool.pools.length > 0) {
            Pool.pools.pop().cleanup();
        }
    }

    // --- ---
    /**
     * Take out
     */
    private takeOut(): Container {
        if (this.displayObjects.length > 0) {
            const object = this.displayObjects.pop();

            object.x = object.y = 0;
            object.rotation = 0;
            object.scale.set(1, 1);
            object.alpha = 1;
            object.visible = true;

            return object;
        }

        return null;
    }

    /**
     * Take in
     * @param arg
     */
    private takeIn(arg: Container): boolean {
        if (arg.parent) {
            arg.parent.removeChild(arg);
        }

        if (arg instanceof AnimatedSprite) {
            (arg as AnimatedSprite).stop();
        } 

        if (this.displayObjects.indexOf(arg) === -1) {
            this.displayObjects.push(arg);
            return true;
        }

        return false;
    }

    public getTextures(arg: string[]): Texture[] {
        const textures: Texture[] = [];
        let i: number; const imax = arg.length;
        for(i = 0; i < imax; i++) {
            textures.push(Texture.from(arg[i]));
        }
        return textures;
    }

    public indexOf(arg: Container): number {
        return this.displayObjects.indexOf(arg);
    }
    
    public get length(): number {
        return this.displayObjects.length;
    }

    public cleanup(): void {
        while(this.displayObjects.length > 0) {
            this.displayObjects.pop().destroy();
        }

        while(this.textures.length > 0) {
            this.textures.pop().destroy();
        }

        if (this.texture) {
            this.texture.destroy();
        }

        Pool.poolConfig = null;
        Pool.objectFactory = null;
    }
}