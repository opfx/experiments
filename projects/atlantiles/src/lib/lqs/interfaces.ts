import { Container, Graphics, DisplayObject, Point } from 'pixi.js';

export interface AssetData
{
    assetMap: {
        fonts?: AssetResource[]
        skin?: AssetResource[],
        sound: SoundResource[],
        lipCharacterSequence?: LipCharacterResource[],
        spritesheet: AssetResource[],
        text?: AssetResource[],
    };
}

export interface AssetResource
{
    assetName: string;
    source: string;
}

export interface SoundResource extends AssetResource
{
    isAudio?: boolean;
}

export interface LipCharacterResource extends AssetResource
{
    sequenceSource: string;
}


export interface IParameterValue
{
    n: string; // name
    v: number; // value
    mi?: number; // minValue
    ma?: number; // maxValue
}

export interface IPosition
{
    object: DisplayObject;
    parent: Container;
    point: Point;
}

export interface IContainer
{
    destroy(): IContainer;
}
