import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Intent } from './../intent';

import { NavController } from './../navigation';

import { Activity } from './activity';

@Injectable({ providedIn: 'root' })
export class ActivityManager {
  private mInjector: Injector;
  private mNavCtrl: NavController;
  private mRouter: Router;

  constructor(injector: Injector) {
    this.mInjector = injector;
    this.mNavCtrl = injector.get<NavController>(NavController);
  }

  public startActivity(activity: Activity, intent: Intent): void {
    console.log(`starting activity ${intent.uri}`);

    const url = intent.uri.toString().replace('content://', 'content/');

    let navDirection = 'forward';

    switch (navDirection) {
      case 'forward':
        this.mNavCtrl.navigateForward(url, { skipLocationChange: true });
        break;
      case 'root':
        this.mNavCtrl.navigateRoot(url, { skipLocationChange: true });
        break;
    }
  }

  public finishActivity(activity: Activity): void {
    console.log(`finishing activity`);
    this.mNavCtrl.pop();
  }
}
