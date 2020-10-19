import { ActionDefs } from './action-defs';

export class Intent {
  public static readonly ACTION: ActionDefs = new ActionDefs();

  private type;

  public constructor() {
    this.type = Intent.ACTION.DEFAULT;
  }

  get action(): string {
    return this.type;
  }
}
