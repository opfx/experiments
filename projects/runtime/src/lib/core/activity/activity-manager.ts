import { Injectable, Injector } from '@angular/core';
import { Router, Route, Routes, ChildActivationEnd, RouterEvent } from '@angular/router';

import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

import { Intent } from './../intent';
import { NavController } from './../navigation';

import { Activity } from './activity';
import { ActivityInfo } from './activity-info';

@Injectable({ providedIn: 'root' })
export class ActivityManager {
  private mInjector: Injector;
  private mNavCtrl: NavController;
  private mRouter: Router;
  private mRoutes: Routes;
  private mActivities$: BehaviorSubject<ActivityInfo[]>;

  constructor(injector: Injector) {
    this.mInjector = injector;
    this.mNavCtrl = injector.get<NavController>(NavController);
    this.mRouter = injector.get<Router>(Router);
    this.mActivities$ = new BehaviorSubject<ActivityInfo[]>([]);

    this.mRouter.events.subscribe((routerEvent: RouterEvent) => {
      // if (routerEvent instanceof ChildActivationEnd) {
      //   if (routerEvent.snapshot.routeConfig.path === 'content') {
      //     const activitiesInfo: ActivityInfo[] = [];
      //     const loadedConfig = (routerEvent.snapshot.routeConfig as any)._loadedConfig;
      //     const childrenRoutes = loadedConfig.routes[0].children;
      //     for (const route of childrenRoutes) {
      //       let intentFilter = {};
      //       if (route.data && route.data.intentFilter) {
      //         intentFilter = route.data.intentFilter;
      //       }
      //       const activityInfo = { name: route.path, label: route.path, intentFilter };
      //       activitiesInfo.push(activityInfo);
      //     }
      //     this.mActivities$.next(activitiesInfo);
      //   }
      // }
    });
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

  public getActivities(): Observable<ActivityInfo[]> {
    return this.mActivities$;
  }

  public queryActivities(intent: Intent): Observable<ActivityInfo[]> {
    return new Observable((subscriber) => {
      subscriber.next([
        { name: 'arcade', label: 'Arcade' },
        { name: 'kinzpost', label: 'Kinzpost' },
      ]);
      const tearDown = () => {
        console.log('teardown called');
      };
      return tearDown;
    });
  }
}
