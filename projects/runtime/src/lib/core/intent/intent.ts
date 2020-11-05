import { URI } from './../../util';

import { ActionDefs } from './action-defs';

export class Intent {
  public static readonly ACTION: ActionDefs = new ActionDefs();

  private type;

  private mUri: URI;

  public constructor(action: string = Intent.ACTION.DEFAULT, uriOrType: string | URI = null) {
    this.type = action.toLowerCase();
    if (typeof uriOrType === 'string') {
      uriOrType = new URI(uriOrType);
    }
    if (uriOrType instanceof URI) {
      this.mUri = uriOrType;
    }
  }

  get action(): string {
    return this.type;
  }

  get uri(): URI {
    return this.mUri;
  }
}
