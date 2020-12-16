import { AnimationData } from './animation-data';

export class AssetConfig {
    public animationDatas: AnimationData[] = [];

    constructor() {
    }
    
    /** Get Animation data. */
    public getAnimationData(id: string): AnimationData {
        for (const animation of this.animationDatas) {
            if (animation.id === id) {
                return animation;
            }
        }
        return null;
    }

    /** override */
    public getTextureNameById(texturesId: string): string {
        return null;
    }
}