import { stringify } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';

import { Loader } from 'pixi.js';
@Injectable()
export class AssetLoader {
  private mHandler: Loader;

  constructor() {
    this.mHandler = Loader.shared;
  }

  public load(assetMap: Map<string, string>): Promise<void> {
    assetMap.forEach((val: string, key: string) => {
      this.mHandler.add(key, val);
    });
    return new Promise((resolve, reject) => {
      this.mHandler.onError.add(() => {
        reject();
      });
      this.mHandler.onComplete.add(() => {
        resolve();
      });
      this.mHandler.load();
    });
  }
}
