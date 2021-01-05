import { Component, Injector } from '@angular/core';
import { GameActivity } from './game.activity';
import { Text } from 'pixi.js';
import { AtlantilesGame } from './atlantiles/atlantiles.game';
import { Assets } from './atlantiles/data/assets';
import { SoundController } from './lq/sound-controller';

@Component({
  selector: 'wx-atlantiles',
  template: `<wx-game></wx-game>`,
  styles: [],
})
export class AtlantilesActivity extends GameActivity {
  private gamePlay: AtlantilesGame;
  private startScreenWidth = 800; // will be set and keep value until this.gamePlay is created
  private startScreenHeight = 600; // will be set and keep value until this.gamePlay is created

  constructor(injector: Injector) {
    super('Atlantiles Game', injector);
  }

  /** const assetMap: Map<string, string> = new Map<string, string>(); */
  protected onLoad(assetMap: Map<string, string>) {
    // fonts
    assetMap.set('font1', 'assets/fonts/font1.fnt');
    assetMap.set('font2', 'assets/fonts/font2.fnt');
    assetMap.set('font3', 'assets/fonts/font3.fnt');

    // png
    assetMap.set('background', 'assets/png/background.png');
    assetMap.set('end-game-background', 'assets/png/end_game.png');
    assetMap.set('instructions-1', 'assets/png/i1.png');
    assetMap.set('instructions-2', 'assets/png/i2.png');
    assetMap.set('loading', 'assets/png/loading.png');
    assetMap.set('game-logo', 'assets/png/logo.png');
    assetMap.set('menu_back', 'assets/png/menu_back.png');
    assetMap.set('webkinz-logo', 'assets/png/webkinz.png');

    // sound
    /* assetMap.set('backgroundMusic', 'assets/mp3/theme.mp3');
    assetMap.set('atlantiles_music_a', 'assets/mp3/atlantiles_music_a.mp3');
    assetMap.set('atlantiles_music_b', 'assets/mp3/atlantiles_music_b.mp3');
    assetMap.set('atlantiles_music_c', 'assets/mp3/atlantiles_music_c.mp3');
    assetMap.set('atlantiles_softer_no_main', 'assets/mp3/atlantiles_softer_no_main.mp3');
    assetMap.set('button', 'assets/mp3/button.mp3');
    assetMap.set('deselect', 'assets/mp3/deselect.mp3');
    assetMap.set('error', 'assets/mp3/error.mp3');
    assetMap.set('Game_lost_break_crashing', 'assets/mp3/Game_lost_break_crashing.mp3');
    assetMap.set('green_line_bing_1', 'assets/mp3/green_line_bing_1.mp3');
    assetMap.set('green_line_bing_2', 'assets/mp3/green_line_bing_2.mp3');
    assetMap.set('green_line_bing_3', 'assets/mp3/green_line_bing_3.mp3');
    assetMap.set('green_line_bing_4', 'assets/mp3/green_line_bing_4.mp3');
    assetMap.set('hint', 'assets/mp3/hint.mp3');
    assetMap.set('select', 'assets/mp3/select.mp3');
    assetMap.set('triumphant', 'assets/mp3/triumphant.mp3');
    assetMap.set('underwater', 'assets/mp3/underwater.mp3'); 
    */
    SoundController.getInstance().addAudio('assets/mp3/theme.mp3');
    SoundController.getInstance().add('atlantiles_music_a', 'assets/mp3/atlantiles_music_a.mp3');
    SoundController.getInstance().add('atlantiles_music_b', 'assets/mp3/atlantiles_music_b.mp3');
    SoundController.getInstance().add('atlantiles_music_c', 'assets/mp3/atlantiles_music_c.mp3');
    SoundController.getInstance().add('atlantiles_softer_no_main', 'assets/mp3/atlantiles_softer_no_main.mp3');
    SoundController.getInstance().add('button', 'assets/mp3/button.mp3');
    SoundController.getInstance().add('deselect', 'assets/mp3/deselect.mp3');
    SoundController.getInstance().add('error', 'assets/mp3/error.mp3');
    SoundController.getInstance().add('Game_lost_break_crashing', 'assets/mp3/Game_lost_break_crashing.mp3');
    SoundController.getInstance().add('green_line_bing_1', 'assets/mp3/green_line_bing_1.mp3');
    SoundController.getInstance().add('green_line_bing_2', 'assets/mp3/green_line_bing_2.mp3');
    SoundController.getInstance().add('green_line_bing_3', 'assets/mp3/green_line_bing_3.mp3');
    SoundController.getInstance().add('green_line_bing_4', 'assets/mp3/green_line_bing_4.mp3');
    SoundController.getInstance().add('hint', 'assets/mp3/hint.mp3');
    SoundController.getInstance().add('select', 'assets/mp3/select.mp3');
    SoundController.getInstance().add('triumphant', 'assets/mp3/triumphant.mp3');
    SoundController.getInstance().add('underwater', 'assets/mp3/underwater.mp3');

    // spritesheet
    assetMap.set('tiles', 'assets/spritesheet/tiles.json');

    // text
    assetMap.set('levels-data', 'assets/json/levels.json');
  }

  protected initAfterAssetLoaded(): void {
    // const text = new Text('Atlantiles Game');
    // this.mStage.addChild(text);

    this.gamePlay = new AtlantilesGame();
    this.gamePlay.start(new Assets().init(), 800, 600, this.startScreenWidth, this.startScreenHeight);
    this.mStage.addChild(this.gamePlay);
  }

  protected onLoop(delta: number): void {
    this.gamePlay.update(delta);
  }

  public resize(w: number, h: number): void {
    super.resize(w, h);
    if (this.gamePlay) {
      this.gamePlay.resize(w, h, w, h);
    } else {
      this.startScreenWidth = w;
      this.startScreenHeight = h;
    }
  }

  public exit(): void {
    this.gamePlay.cleanup();
    this.gamePlay = null;
  }
}
