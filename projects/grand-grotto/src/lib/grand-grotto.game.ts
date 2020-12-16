import { Injectable, Injector } from '@angular/core';
import { AbstractGame } from './abstract-game';

@Injectable()
export class GrandGrottoGame extends AbstractGame {
  constructor(injector: Injector) {
    super('Grand Grotto', injector);
  }
  protected onLoad(assetMap: Map<string, string>) {
    // const assetMap: Map<string, string> = new Map<string, string>();

    assetMap.set('levels', 'assets/data/levels.json');
  }
}
