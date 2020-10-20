import { Location } from '@angular/common';
import { ComponentRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavDirection } from '@webkinz/wcl';

import { bindLifecycleEvents } from './../../../wcl';
import { NavController } from './../nav-controller';
import { RouteView } from './../types';
import { getUrl, computeStackId, insertView } from './util';

export class StackController {
  private _containerEl: HTMLWxRouterOutletElement;
  private _router: Router;
  private _navCtrl: NavController;
  private _location: Location;
  private _zone: NgZone;

  private _activeView: RouteView | undefined;
  private _views: RouteView[] = [];
  private _nextId = 0;

  private _runningTask?: Promise<any>;
  private _skipTransition = false;

  constructor(
    containerEl: HTMLWxRouterOutletElement,
    router: Router,
    navCtrl: NavController,
    location: Location,
    zone: NgZone
  ) {
    this._containerEl = containerEl;
    this._router = router;
    this._navCtrl = navCtrl;
    this._location = location;
    this._zone = zone;
  }

  // ///////////////////////////////////////////////////////
  // API

  public createView(ref: ComponentRef<any>, activatedRoute: ActivatedRoute): RouteView {
    const url = getUrl(this._router, activatedRoute);
    const element = (ref && ref.location && ref.location.nativeElement) as HTMLElement;

    const unbindEventListeners = bindLifecycleEvents(this._zone, ref.instance, element);
    return {
      id: this._nextId++,
      url,
      stackId: computeStackId(undefined, url),
      element,
      ref,
      unbindEventListeners,
    };
  }

  public setActiveView(view: RouteView) {
    let { direction, animation } = this._navCtrl.consumeTransition();
    const enteringView = view;
    const leavingView = this._activeView;
    // FIXME for tabs
    const tabSwitch = false;

    const viewSnapshot = this._views.slice();

    const router = this._router as any;

    let currentNavigation = router.getCurrentNavigation();

    // if the navigation action sets replaceUrl:true then the item from the views stack needs to be removed
    if (currentNavigation && currentNavigation.extras && currentNavigation.extras.replaceUrl) {
      if (this._views.length > 0) {
        this._views.splice(-1, 1);
      }
    }

    const reused = this._views.includes(enteringView);
    const views = this.insertView(enteringView, direction);

    if (!reused) {
      enteringView.ref.changeDetectorRef.detectChanges();
    }

    // wait until the previous transitions finish
    return this._zone.runOutsideAngular(() => {
      return this.wait(() => {
        return this.transition(enteringView, leavingView, animation, this.canGoBack(1), false)
          .then(() => cleanupAsync(enteringView, views, viewSnapshot, this._location))
          .then(() => ({ enteringView, direction, animation, tabSwitch }));
      });
    });
  }

  public getExistingView(activatedRoute: ActivatedRoute): RouteView | undefined {
    const activatedUrlKey = getUrl(this._router, activatedRoute);
    const view = this._views.find((vw) => vw.url === activatedUrlKey);
    if (view) {
      view.ref.changeDetectorRef.reattach();
    }
    return view;
  }

  public destroy(): void {
    this._containerEl = undefined;
    this._views.forEach(destroyView);
    this._activeView = undefined;
    this._views = [];
  }

  public canGoBack(depth: number, stackId = this.getActiveStackId()): boolean {
    return this.getStack(stackId).length > depth;
  }

  public pop(depth: number, stackId = this.getActiveStackId()) {
    return this._zone.run(() => {
      const views = this.getStack(stackId);
      if (views.length <= depth) {
        return Promise.resolve(false);
      }

      const view = views[views.length - depth - 1];
      let url = view.url;

      const viewSavedData = view.savedData;
      if (viewSavedData) {
        const primaryOutlet = viewSavedData.get('primary');
        if (primaryOutlet && primaryOutlet.route && primaryOutlet.route._routerState) {
          const routerState = primaryOutlet.route._routerState;
          if (routerState.snapshot && routerState.snapshot.url) {
            url = primaryOutlet.route._routerState.snapshot.url;
          }
        }
      }

      return this._navCtrl.navigateBack(url, view.savedNavExtras).then(() => true);
    });
  }

  public getActiveStackId(): string | undefined {
    return this._activeView ? this._activeView.stackId : undefined;
  }

  public getStack(stackId: string | undefined): RouteView[] {
    return this._views.filter((vw) => vw.stackId === stackId);
  }

  // ///////////////////////////////////////////////////////
  // IMPLEMENTATION

  private insertView(enteringView: RouteView, direction: NavDirection) {
    this._activeView = enteringView;
    this._views = insertView(this._views, enteringView, direction);
    return this._views.slice();
  }

  private transition(
    enteringView: RouteView | undefined,
    leavingView: RouteView | undefined,
    direction: any,
    showGoBack,
    progressAnimation: boolean
  ): Promise<boolean> {
    if (this._skipTransition) {
      this._skipTransition = false;
      return Promise.resolve(false);
    }
    if (leavingView === enteringView) {
      return Promise.resolve(false);
    }

    const enteringEl = enteringView ? enteringView.element : undefined;
    const leavingEl = leavingView ? leavingView.element : undefined;
    const containerEl = this._containerEl;

    if (enteringEl && enteringEl !== leavingEl) {
      enteringEl.classList.add('wx-view');
      enteringEl.classList.add('wx-view-invisible');
      if (enteringEl.parentElement !== containerEl) {
        containerEl.appendChild(enteringEl);
      }
      if ((containerEl as any).commit) {
        return containerEl.commit(enteringEl, leavingEl, {
          deepWait: true,
          duration: direction === undefined ? 0 : undefined,
          direction,
          showGoBack,
          progressAnimation,
        });
      }
    }
    return Promise.resolve(false);
  }

  private async wait<T>(task: () => Promise<T>): Promise<T> {
    if (this._runningTask !== undefined) {
      await this._runningTask;
      this._runningTask = undefined;
    }
    const promise = (this._runningTask = task());
    return promise;
  }
}

const cleanupAsync = (
  activeView: RouteView,
  newViews: RouteView[],
  oldViews: RouteView[],
  location: Location
): Promise<void> => {
  if (typeof (requestAnimationFrame as any) === 'function') {
    return new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        cleanup(activeView, newViews, oldViews, location);
        resolve();
      });
    });
  }
  return Promise.resolve();
};
const cleanup = (activeView: RouteView, newViews: RouteView[], oldViews: RouteView[], location: Location) => {
  // destroy all views that were present in the oldViews but are no longer present in the newViews
  oldViews.filter((view) => !newViews.includes(view)).forEach(destroyView);

  newViews.forEach((view) => {
    // if the user navigated multiple times in rapid succession,
    // make sure a view is not preemptively detached while in mid-transition
    // in this case we don't care about query params or fragments as it will
    // the same view regardless
    const locationWithoutParams = location.path().split('?')[0];
    const locationWithoutFragment = locationWithoutParams.split('#')[0];

    if (view !== activeView && view.url !== locationWithoutFragment) {
      view.element.setAttribute('aria-hidden', 'true');
      view.element.classList.add('wx-view-hidden');
      view.ref.changeDetectorRef.detach();
    }
  });
};

const destroyView = (view: RouteView | undefined) => {
  if (view) {
    view.ref.destroy();
    view.unbindEventListeners();
  }
};
