import { Component, Injector } from '@angular/core';
import { OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';

import { Intent } from './../intent';

import { ActivityManager } from './activity-manager';

@Component({ selector: 'wx-activity', template: `` })
export class Activity implements OnInit, OnDestroy {
  private activityManager: ActivityManager;

  protected readonly destroyed = new Subject<void>();

  constructor(injector: Injector) {
    this.activityManager = injector.get<ActivityManager>(ActivityManager);
  }

  public startActivity(intent: Intent): void {
    this.activityManager.startActivity(this, intent);
  }

  public finish(): void {
    this.activityManager.finishActivity(this);
  }

  // //////////////////////////////////////////////////////
  // Lifecycle

  public ngOnInit(): void {
    this.create();
  }
  public ngOnDestroy(): void {
    this.destroy();
  }

  public wxViewWillEnter(): void {
    console.log(`will enter`);
  }

  public wxViewDidEnter(): void {
    console.log(`did enter`);
  }

  public wxViewWillLeave(): void {
    console.log(`will leave`);
  }

  public wxViewDidLeave(): void {
    console.log('did leave');
  }

  private create(): void {
    this.onCreate();
  }
  private destroy(): void {
    this.onDestroy();
    this.destroyed.next();
    this.destroyed.complete();
  }

  protected onCreate(): void {}
  protected onDestroy(): void {}
}
