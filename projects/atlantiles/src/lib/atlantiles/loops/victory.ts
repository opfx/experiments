/**
 * Created by Fundemic and handed to Ganz 02.10.2015.
 */
import { IContainer } from '../../lqs/icontainer';
import { Game } from '../../lqs/game';
import { LImage } from '../../lqs/limage';
import { Loop } from '../../lqs/loop';
import { LEvent } from '../../lqs/levent';
import { JButton } from '../../lqs/jbutton';
import { Constants } from '../data/constants';
import { AtlantilesGame } from '../atlantiles.game';

export class Victory extends Loop {
  private background: LImage;
  private closeButton: JButton;

  constructor(g: Game) {
    super(g, 'Victory');
    const hw = this.game.RW * 0.5;
    this.addChild(
      (this.background = new LImage(this.game, 'end-game-background', hw, this.game.RH * 0.5, LImage.FIT_HEIGHT, null))
    );

    // s value is taken from game-play constructor 
    const s = this.game.RH / Constants.UI_HEIGHT_SCALING_FACTOR * Constants.GAMEPLAY_SCALE;
    
    this.addChild(
      (this.closeButton = new JButton(
        this.game,
        'btnClose',
        s * Constants.GAMEPLAY_CLOSE_SCALE, // 0.6,
        this.game.RW * 0.92,
        this.game.RW * Constants.VICTORY_BUTTON_Y
      ))
    );

    this.closeButton.addEventListener(LEvent.DEV_BUTTON, this.h_buttons.bind(this));
  }

  /** override */
  public destroy(): IContainer {
    if (this.background) {
      this.background.destroy();
    }
    this.background = null;
    if (this.closeButton) {
      this.closeButton.removeEventListener(LEvent.DEV_BUTTON, this.h_buttons.bind(this));
    }
    this.closeButton = null;
    this.removeChildren();
    return super.destroy();
  }

  /** override */
  public init(): void {
    super.init();
    const g: AtlantilesGame = this.game as AtlantilesGame;
    this.game.stopSound('theme');
  }

  // listeners
  // private h_buttons(e: LEvent): void { // doesn't work - target as undefined
  private h_buttons(type: string, currentTarget: JButton): void {
    // const target: JButton = (e.target as unknown) as JButton;
    switch (currentTarget) {
      case this.closeButton:
        this.dispatchEvent(LEvent.GO_SCREEN, 'close', this); // doesn't work- will not have target
        break;
    }
  }
}
