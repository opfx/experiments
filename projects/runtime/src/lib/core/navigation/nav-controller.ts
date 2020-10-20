import { Location } from '@angular/common';
import { Injectable, Optional } from '@angular/core';
import { Router, UrlSerializer, UrlTree } from '@angular/router';
import { NavigationStart } from '@angular/router';
import { NavDirection } from '@webkinz/wcl';

import { Platform } from './../providers';
import { RouterOutletDirective } from './directives/router-outlet.directive';
import { NavOptions, NavAnimationOptions, NavAnimationDirection } from './types';

@Injectable({ providedIn: 'root' })
export class NavController {
  private _animation: NavDirection = DEFAULT_ANIMATED;
  private _direction: NavDirection | 'auto' = DEFAULT_DIRECTION;
  private _guessedAnimation: NavDirection = 'forward';
  private _guessedDirection: NavDirection;
  private _topOutlet?: RouterOutletDirective;
  private _lastNavId = -1;
  private _location: Location;
  private _router: Router | undefined;
  private _serializer: UrlSerializer;

  constructor(platform: Platform, location: Location, serializer: UrlSerializer, @Optional() router?: Router) {
    this._location = location;
    this._serializer = serializer;
    this._router = router;
    if (this._router) {
      this._router.events.subscribe((ev) => {
        if (ev instanceof NavigationStart) {
          const id = ev.restoredState ? ev.restoredState.navigationId : ev.id;
          this._guessedDirection = id < this._lastNavId ? 'back' : 'forward';
          this._guessedAnimation = !ev.restoredState ? this._guessedDirection : undefined;
          this._lastNavId = this._guessedDirection === 'forward' ? ev.id : id;
        }
      });
    }
    platform.backButton.subscribeWithPriority(0, () => {
      this.pop();
    });
  }
  /**
   * This method uses Angular's [Router](https://angular.io/api/router/Router) under the hood,
   * it's equivalent to calling `this.router.navigateByUrl()`, but it's explicit about the **direction** of the transition.
   *
   * Going **forward** means that a new view is going to be pushed to the stack of the outlet (wx-router-outlet),
   * and that it will show a "forward" animation by default.
   *
   * Navigating forward can also be triggered in a declarative manner by using the `[routerDirection]` directive:
   *
   * ```html
   * <a routerLink="/path/to/page" routerDirection="forward">Link</a>
   * ```
   */
  public navigateForward(url: string | UrlTree | any[], opts: NavOptions = {}): Promise<boolean> {
    this.setDirection('forward', opts.animated, opts.animationDirection);
    return this.navigate(url, opts);
  }

  /**
   * This method uses Angular's [Router](https://angular.io/api/router/Router) under the hood,
   * it's equivalent to calling:
   *
   * ```ts
   * this.navController.setDirection('back');
   * this.router.navigateByUrl(path);
   * ```
   *
   * Going **back** means that all the views in the stack until the navigated view is found will be popped,
   * and that it will show a "back" animation by default.
   *
   * Navigating back can also be triggered in a declarative manner by using the `[routerDirection]` directive:
   *
   * ```html
   * <a routerLink="/path/to/page" routerDirection="back">Link</a>
   * ```
   */
  public navigateBack(url: string | UrlTree | any[], opts: NavOptions = {}): Promise<boolean> {
    this.setDirection('back', opts.animated, opts.animationDirection);
    return this.navigate(url, opts);
  }

  /**
   * This method uses Angular's [Router](https://angular.io/api/router/Router) under the hood,
   * it's equivalent to calling:
   *
   * ```ts
   * this.navController.setDirection('root');
   * this.router.navigateByUrl(path);
   * ```
   *
   * Going **root** means that all existing views in the stack will be removed,
   * and the navigated view will become the single view in the stack.
   *
   * Navigating root can also be triggered in a declarative manner by using the `[routerDirection]` directive:
   *
   * ```html
   * <a routerLink="/path/to/page" routerDirection="root">Link</a>
   * ```
   */
  public navigateRoot(url: string | UrlTree | any[], options: NavOptions = {}): Promise<boolean> {
    this.setDirection('root', options.animated, options.animationDirection);
    return this.navigate(url, options);
  }

  /**
   * Same as [Location](https://angular.io/api/common/Location)'s back() method.
   * It will use the standard `window.history.back()` under the hood, but featuring a `back` animation
   * by default.
   */
  public back(opts: NavAnimationOptions = { animated: true, animationDirection: 'back' }) {
    this.setDirection('back', opts.animated, opts.animationDirection);
    return this._location.back();
  }

  /**
   * This methods goes back in the context of the stack navigation.
   *
   * It recursively finds the top active `wx-router-outlet` and calls `pop()`.
   * This is the recommended way to go back when you are using `wx-router-outlet`.
   */
  public async pop() {
    let outlet = this._topOutlet;
    while (outlet) {
      if (await outlet.pop()) {
        break;
      } else {
        outlet = outlet.parentOutlet;
      }
    }
  }

  /**
   * Specifies the direction of the next navigation performed by the Angular router.
   *
   * This method does not trigger any transition, if just configures the next navigation.
   *
   * @param animated
   * @param animationDirection
   */
  public setDirection(direction: NavDirection, animated?: boolean, animationDirection?: NavAnimationDirection): void {
    this._animation = getAnimation(direction, animated, animationDirection);
    this._direction = direction;
  }

  public setTopOutlet(outlet: RouterOutletDirective): void {
    this._topOutlet = outlet;
  }

  // ///////////////////////////////////////////////////////
  // INTERNAL API

  consumeTransition() {
    let direction: NavDirection = 'root';
    let animation: NavDirection | undefined;

    if (this._direction === 'auto') {
      animation = this._guessedAnimation;
      direction = this._guessedDirection;
    } else {
      animation = this._animation;
      direction = this._direction;
    }

    // reset direction & animation
    this._animation = DEFAULT_ANIMATED;
    this._direction = DEFAULT_DIRECTION;

    return { direction, animation };
  }

  // ///////////////////////////////////////////////////////
  // IMPLEMENTATION

  private navigate(url: string | UrlTree | any[], opts: NavOptions = {}): Promise<boolean> {
    if (Array.isArray(url)) {
      return this._router.navigate(url, opts);
    }
    /**
     * navigateByUrl ignores any properties that
     * would change the url, so things like queryParams
     * would be ignored unless we create a url tree
     * More Info: https://github.com/angular/angular/issues/18798
     */
    const urlTree = this._serializer.parse(url.toString());

    if (opts.queryParams) {
      urlTree.queryParams = { ...opts.queryParams };
    }
    if (opts.fragment) {
      urlTree.fragment = opts.fragment;
    }
    return this._router.navigateByUrl(urlTree, opts);
  }
}

const getAnimation = (
  direction: NavDirection,
  animated: boolean | undefined,
  animationDirection: NavAnimationDirection | undefined
): NavAnimationDirection | undefined => {
  if (animated === false) {
    return undefined;
  }
  if (animationDirection !== undefined) {
    return animationDirection;
  }
  if (direction === 'forward' || direction === 'back') {
    return direction;
  }
  if (direction === 'root' && animated === true) {
    return 'forward';
  }
  return undefined;
};
const DEFAULT_DIRECTION = 'auto';
const DEFAULT_ANIMATED = undefined;
