import { Component } from '@angular/core';
import { OnInit, OnDestroy } from '@angular/core';

import { Intent } from './../intent';

@Component({ selector: 'wx-activity', template: `` })
export class Activity implements OnInit, OnDestroy {
  //   private mName: string;

  public startActivity(intent: Intent): void {}

  public finish(): void {}

  public ngOnInit(): void {}
  public ngOnDestroy(): void {}
}
