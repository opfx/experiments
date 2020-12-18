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
  private nextbutton: JButton;

  constructor(g: Game) {
    super(g, 'Victory');
    const hw = this.game.RW * 0.5;
    this.addChild(
      (this.background = new LImage(this.game, 'end_game', hw, this.game.RH * 0.5, LImage.FIT_HEIGHT, null))
    );
    this.addChild(
      (this.nextbutton = new JButton(
        this.game,
        'btnClose',
        0.6,
        this.game.RW * 0.92,
        this.game.RW * Constants.VICTORY_BUTTON_Y
      ))
    );

    this.nextbutton.addEventListener(LEvent.DEV_BUTTON, this.h_buttons.bind(this));
  }

  /** override */
  public destroy(): IContainer {
    if (this.background) {
      this.background.destroy();
    }
    this.background = null;
    if (this.nextbutton) {
      this.nextbutton.removeEventListener(LEvent.DEV_BUTTON, this.h_buttons.bind(this));
    }
    this.nextbutton = null;
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
  private h_buttons(e: LEvent): void {
    const target: JButton = (e.target as unknown) as JButton;
    switch (target) {
      case this.nextbutton:
        this.dispatch(LEvent.GO_SCREEN, 'close');
        break;
    }
  }
}
