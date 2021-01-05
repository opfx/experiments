/**
 * Created by Fundemic and handed to Ganz 7 / 2 / 2015.
 */
import { Injectable } from '@angular/core';

import { IContainer } from '../lqs/icontainer';
import { Game } from '../lqs/game';
import { LEvent } from '../lqs/levent';
import { Constants } from './data/constants';
import { StartMenu } from './loops/start-menu';
import { GamePlay } from './loops/game-play';
import { Instructions } from './loops/instructions';
import { Settings } from './loops/settings';
import { Victory } from './loops/victory';
import { Variable } from '../lqs/variable';
import { Loop } from '../lqs/loop';
import { RewardData } from './data/reward-data';
import { Assets } from './data/assets';

@Injectable()
export class AtlantilesGame extends Game {
  private startmenu: StartMenu;
  private gameplay: GamePlay;
  private instructions: Instructions;
  private settings: Settings;
  private victory: Victory;
  private levelID: Variable;
  public TUTORIAL = true;

  constructor() {
    // super('Atlantiles', null, '', null, Game.LANDSCAPE_ORIENTATION); // Constants.LEVELS
    super('Atlantiles', null, null, Game.LANDSCAPE_ORIENTATION);

    this.levelID = new Variable(0);
    this.PLAYER_SLOT = name + 'p3';
    this.SETTINGS_SLOT = name + 's3';
  }

  /** override */
  public build(): void {
    super.build();

    this.addLoop((this.startmenu = new StartMenu(this)));
    this.addLoop((this.gameplay = new GamePlay(this)));
    this.addLoop((this.victory = new Victory(this)));
    this.addLoop((this.settings = new Settings(this)));
    this.addLoop((this.instructions = new Instructions(this)));

    this.victory.addEventListener(LEvent.GO_SCREEN, this.h_loops.bind(this));
    this.gameplay.addEventListener(LEvent.GO_SCREEN, this.h_loops.bind(this));
    this.startmenu.addEventListener(LEvent.GO_SCREEN, this.h_loops.bind(this));
    this.settings.addEventListener(LEvent.GO_SCREEN, this.h_loops.bind(this));
    this.instructions.addEventListener(LEvent.GO_SCREEN, this.h_loops.bind(this));

    this.SETTINGS = this.game.load(this.game.SETTINGS_SLOT) || { levels: [] };

    // gameplay.setLevelID(levelID.Value);
    this.levelID.Value = 0;
    this.gameplay.clearPoints();
    this.screenTo([this.startmenu], []);
  }

  public getAllPets(): string[] {
    return (this.assets as Assets).pets.slice();
  }

  public getPetName(v: number): string {
    return (this.assets as Assets).pets[v];
  }

  public hasLevels(): boolean {
    return this.gameplay.getLevelID() !== -1;
  }

  public getLastLevelID(): number {
    return this.hasLevels() ? this.levelID.Value : 0;
  }

  public get score(): number {
    return this.gameplay.gameScore;
  }

  public get resultFlag(): number {
    return this.gameplay.resultFlag;
  }

  public stopGame(): void {
    // do stuff to end and cleanup game
  }

  // private  h_loops(e: LEvent): void {
  private h_loops(args: unknown[]): void {
    // type: string, currentTarget: Loop): void {
    // const currentTarget: Loop = e.currentTarget as unknown as Loop;
    const type: string = args[1] as string;
    const currentTarget: Loop = args[2] as Loop;

    switch (currentTarget) {
      case this.instructions:
        switch (type) {
          case 'back':
            this.screenTo([this.startmenu], [this.instructions]);
            break;
        }
        break;

      case this.victory:
        switch (type) {
          case 'close':
            // this.gameplay.setLevelID(0);
            // this.screenTo([this.startmenu], [this.victory]);

            // const closeGameEndEvent: GameEvent = new GameEvent( GameEvent.GAME_END, false, false, this.gameplay.gameScore);
            // Constants.EVENT_DISPATCHER.dispatchEvent(closeGameEndEvent);
            this.screenTo([this.startmenu], [this.gameplay]);
            break;
        }
        break;

      case this.gameplay:
        switch (type) {
          case 'menu_back':
            // const menuBackGameEndEvent: GameEvent = new GameEvent(GameEvent.GAME_END, false, false, this.gameplay.gameScore);
            // Constants.EVENT_DISPATCHER.dispatchEvent(menuBackGameEndEvent);

            this.screenTo([this.startmenu], [this.gameplay]);
            break;

          case 'gameOver':
            // const gameOverGameEndEvent: GameEvent = new GameEvent(GameEvent.GAME_END, false, false, this.gameplay.gameScore);
            // Constants.EVENT_DISPATCHER.dispatchEvent(gameOverGameEndEvent);

            this.screenTo([this.startmenu], [this.gameplay]);
            break;

          case 'finishedClassic':
            this.screenTo([this.victory], [this.gameplay]);
            break;

          case 'finished':
            if (this.levelID.Value === Constants.TOTAL_LEVELS - 1) {
              this.gameplay.resultFlag = RewardData.GAME_RESULT_WON;
              this.screenTo([this.victory], [this.gameplay]);
            } else {
              this.levelID.Value++;
              this.gameplay.setLevelID(this.levelID.Value);
              this.screenTo([this.gameplay], [this.gameplay]);
            }
            break;
        }
        break;

      case this.settings:
        switch (type) {
          case 'close':
            this.screenTo([this.startmenu], [this.settings]);
            break;
        }
        break;

      case this.startmenu:
        switch (type) {
          case 'instructions':
            this.screenTo([this.instructions], [this.startmenu]);
            break;

          case 'settings':
            this.screenTo([this.settings], [this.startmenu]);
            break;

          case 'classic':
            this.gameplay.setLevelID(-1);
            this.gameplay.clearPoints();
            this.screenTo([this.gameplay], [this.startmenu]);
            break;

          case 'play':
            this.gameplay.setLevelID(this.levelID.Value);
            this.gameplay.returnPoints();
            this.screenTo([this.gameplay], [this.startmenu]);
            break;
        }
        break;
    }
  }

  /** override */
  public destroy(): IContainer {
    super.destroy();

    if (this.victory) {
      this.victory.removeEventListener(LEvent.GO_SCREEN, this.h_loops.bind(this));
    }
    if (this.gameplay) {
      this.gameplay.removeEventListener(LEvent.GO_SCREEN, this.h_loops.bind(this));
    }
    if (this.startmenu) {
      this.startmenu.removeEventListener(LEvent.GO_SCREEN, this.h_loops.bind(this));
    }
    if (this.instructions) {
      this.instructions.removeEventListener(LEvent.GO_SCREEN, this.h_loops.bind(this));
    }
    if (this.settings) {
      this.settings.removeEventListener(LEvent.GO_SCREEN, this.h_loops.bind(this));
    }

    if (this.levelID) {
      this.levelID.destroy();
    }

    this.instructions = null;
    this.settings = null;
    this.victory = null;
    this.startmenu = null;
    this.gameplay = null;
    this.levelID = null;

    this.removeChildren();
    return super.destroy();
  }
}
