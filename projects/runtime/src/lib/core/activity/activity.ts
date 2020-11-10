import { Component, Injector } from '@angular/core';
import { OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';

import { Intent } from './../intent';

import { ActivityManager } from './activity-manager';

@Component({ selector: 'wx-activity', template: `` })
export class Activity implements OnInit, OnDestroy {
  private mActivityManager: ActivityManager;

  protected readonly destroyed = new Subject<void>();

  constructor(injector: Injector) {
    this.mActivityManager = injector.get<ActivityManager>(ActivityManager);
  }

  // //////////////////////////////////////////////////////
  // Properties

  /**
   * Returns the ActivityManager associated with this activity.
   */
  get manager(): ActivityManager {
    return this.mActivityManager;
  }

  // //////////////////////////////////////////////////////
  // API

  public startActivity(intent: Intent): void {
    this.mActivityManager.startActivity(this, intent);
  }

  public finish(): void {
    this.mActivityManager.finishActivity(this);
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
