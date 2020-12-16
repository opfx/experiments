import { NgZone, Injector } from '@angular/core';

import { Container, Renderer, Ticker } from 'pixi.js';
import { autoDetectRenderer } from 'pixi.js';

import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

import { AssetLoader } from './providers';

export abstract class AbstractGame {
  private mName: string;

  private mInjector: Injector;

  private mAssetLoader: AssetLoader;
  private mRenderer: Renderer;
  private mStage: Container;
  private mTicker: Ticker;

  private mActiveView$: BehaviorSubject<string>;

  constructor(name: string = '', injector: Injector) {
    this.mName = name;
    this.mInjector = injector;
    this.mActiveView$ = new BehaviorSubject<string>('boot');
  }

  get renderer(): Renderer {
    return this.mRenderer;
  }

  get activeView$(): Observable<string> {
    return this.mActiveView$;
  }

  private boot() {
    this.mAssetLoader = this.mInjector.get<AssetLoader>(AssetLoader);
    const ngZone = this.mInjector.get<NgZone>(NgZone);
    ngZone.runOutsideAngular(() => {
      this.mRenderer = autoDetectRenderer({
        backgroundColor: 0x1099bb,
        autoDensity: true,
        // , antialias: true
        resolution: window.devicePixelRatio,
      });
    });

    this.mTicker = new Ticker();
    this.mTicker.stop();
    this.mTicker.add((delta: number) => {
      this.loop(delta);
    });
    this.mStage = new Container();
  }

  public async load() {
    console.log(`${this.mName} loading...`);
    this.boot();
    this.mActiveView$.next('load');
    // this.boot();
    // this.mActiveView = 'load'; // FIXME use constants for game views; something like GameView.LOAD;
    const assetMap = new Map<string, string>();
    this.onLoad(assetMap);
    this.mAssetLoader.load(assetMap).then(() => {
      this.mActiveView$.next('ready');
    });
  }

  public init() {}

  private loop(delta: number) {
    this.onLoop();
    this.mRenderer.render(this.mStage);
  }

  protected onLoop(): void {}

  public resize() {}

  public start() {
    this.mActiveView$.next('play');
    this.mTicker.start();
  }

  public pause() {}

  public resume() {}

  /**
   * Quit the game.
   * This does not actually exit the game but only stops the game play.
   *
   */
  public quit(): void {}

  /**
   * This method should perform cleanup
   */
  public exit(): void {}

  /**
   * Provides and opportunity for subclasses to initialize the assetMap.
   *
   * @param assetMap
   */
  protected onLoad(assetMap: Map<string, string>): void {}
}
