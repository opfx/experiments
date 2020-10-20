import { Location } from '@angular/common';
import { Attribute, Directive, Optional, Output, SkipSelf } from '@angular/core';
import { Injector, NgZone, ComponentFactoryResolver, EventEmitter } from '@angular/core';
import { ComponentRef, ElementRef, ViewContainerRef } from '@angular/core';
import { OnInit, OnDestroy } from '@angular/core';
import { Type, AbstractType, InjectionToken } from '@angular/core';
import { ActivatedRoute, ChildrenOutletContexts, OutletContext, PRIMARY_OUTLET, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, filter, switchMap } from 'rxjs/operators';

import { NavController } from './../nav-controller';
import { StackController } from './../stack';
import { RouteView } from './../types';

// tslint:disable-next-line:directive-selector -- disables https://angular.io/guide/styleguide#style-02-06
@Directive({ selector: 'wx-router-outlet', exportAs: 'outlet', inputs: ['animated', 'animation', 'swipeGesture'] })
export class RouterOutletDirective implements OnInit, OnDestroy {
  nativeEl: HTMLWxRouterOutletElement;

  private _name: string;
  private _parentContexts: ChildrenOutletContexts;
  private _activated: ComponentRef<any> | null = null;
  private _activatedView: RouteView | null = null;
  private _activatedRoute: ActivatedRoute | null = null;

  // keep the latest activated route in a subject for the proxy routes to switch map to
  private _activatedRoute$ = new BehaviorSubject<{ component: any; activatedRoute: ActivatedRoute } | null>(null);
  private _activatedRouteProxies = new WeakMap<any, ActivatedRoute>();

  private _resolver: ComponentFactoryResolver;
  private _location: ViewContainerRef;
  private _swipeGesture?: boolean;

  private _navCtrl: NavController;
  private _stackCtrl: StackController;

  @Output() stackEvents = new EventEmitter<any>();
  // tslint:disable-next-line:no-output-rename
  @Output('activate') activateEvents = new EventEmitter<any>();
  // tslint:disable-next-line:no-output-rename
  @Output('deactivate') deactivateEvents = new EventEmitter<any>();

  constructor(
    @Attribute('name') name: string,
    @Optional() @Attribute('tabs') tabs: string,
    injector: Injector,
    @SkipSelf() @Optional() readonly parentOutlet?: RouterOutletDirective
  ) {
    this.nativeEl = injector.get<ElementRef>(ElementRef).nativeElement;
    this._name = name || PRIMARY_OUTLET;
    if (tabs === 'true') {
      console.error('RouterOutletDirective:tabs is not implemented');
    }
    this._location = injector.get<ViewContainerRef>(ViewContainerRef);
    this._navCtrl = injector.get<NavController>(NavController);
    this._resolver = injector.get<ComponentFactoryResolver>(ComponentFactoryResolver);
    const location: Location = injector.get<Location>(Location);
    const router: Router = injector.get<Router>(Router);
    const zone: NgZone = injector.get<NgZone>(NgZone);

    this._stackCtrl = new StackController(this.nativeEl, router, this._navCtrl, location, zone);

    this._parentContexts = injector.get<ChildrenOutletContexts>(ChildrenOutletContexts);
    this._parentContexts.onChildOutletCreated(this._name, this as any);
  }
  ngOnInit(): void {
    if (!this._activated) {
      // if the outlet was not instantiated at the time the route got activated
      // it needs to be populated when it is initialized
      const ctx = this.context;
      if (ctx && ctx.route) {
        this.activateWith(ctx.route, ctx.resolver || null);
      }
      if ((this.nativeEl as any).componentOnReady) {
        this.nativeEl.componentOnReady().then(() => {
          if (this._swipeGesture === undefined) {
          }
        });
      }
    }
  }
  ngOnDestroy(): void {
    this._stackCtrl.destroy();
  }

  // ///////////////////////////////////////////////////////
  // API

  /**
   * Called when the `RouteReuseStrategy` instructs to detach the subtree
   */
  public detach(): ComponentRef<any> {
    throw new Error('incompatible reuse strategy');
  }

  /**
   * Called when the `RouteReuseStrategy` instructs to re-attach a previously detached subtree
   */
  public attach(_ref: ComponentRef<any>, _activatedRoute: ActivatedRoute) {
    throw new Error('incompatible reuse strategy');
  }

  public deactivate(): void {
    if (this._activated) {
      if (this._activatedView) {
        const context = this.context;
        this._activatedView.savedData = new Map(context.children['contexts']);

        // ensure we are saving the NavigationExtras data
        // otherwise will be lost
        this._activatedView.savedNavExtras = {};
        if (context.route) {
          const contextSnapshot = context.route.snapshot;

          this._activatedView.savedNavExtras.queryParams = contextSnapshot.queryParams;
          this._activatedView.savedNavExtras.fragment = contextSnapshot.fragment;
        }
      }
      const c = this.component;
      this._activatedView = null;
      this._activated = null;
      this._activatedRoute = null;
      this.deactivateEvents.emit(c);
    }
  }

  public activateWith(activatedRoute: ActivatedRoute, resolver: ComponentFactoryResolver | null): void {
    if (this.isActivated) {
      throw new Error('Cannot activate an already activated outlet.');
    }
    this._activatedRoute = activatedRoute;

    let cmpRef: any;
    let enteringView = this._stackCtrl.getExistingView(activatedRoute);
    if (enteringView) {
      cmpRef = this._activated = enteringView.ref;
      const savedData = enteringView.savedData;
      if (savedData) {
        // self-restore
        this.context.children['contexts'] = savedData;
      }
      this.updateActivatedRouteProxy(cmpRef.instance, activatedRoute);
    } else {
      const snapshot = (activatedRoute as any)._futureSnapshot;
      const component = snapshot.routeConfig.component as any;
      resolver = resolver || this._resolver;

      const factory = resolver.resolveComponentFactory(component);
      const childContexts = this._parentContexts.getOrCreateContext(this._name).children;

      // create a proxy that will maintain all future updates for the component
      // over its lifecycle in the stack
      const component$ = new BehaviorSubject<any>(null);
      const activatedRouteProxy = this.createActivatedRouteProxy(component$, activatedRoute);

      const injector = new OutletInjector(activatedRouteProxy, childContexts, this._location.injector);
      cmpRef = this._activated = this._location.createComponent(factory, this._location.length, injector);

      // once component was created push to local subject supplied to the proxy
      component$.next(cmpRef.instance);

      enteringView = this._stackCtrl.createView(this._activated, activatedRoute);

      // store the reference to the proxy by component
      this._activatedRouteProxies.set(cmpRef.instance, activatedRouteProxy);
      this._activatedRoute$.next({ component: cmpRef.instance, activatedRoute });
    }
    this._activatedView = enteringView;
    this._stackCtrl.setActiveView(enteringView).then((data) => {
      this._navCtrl.setTopOutlet(this);
      this.activateEvents.emit(cmpRef.instance);
      this.stackEvents.emit(data);
    });
  }

  public pop(depth = 1, stackId?: string): Promise<boolean> {
    return this._stackCtrl.pop(depth, stackId);
  }

  // ///////////////////////////////////////////////////////
  // PROPERTIES

  public get context(): OutletContext {
    // tslint:disable-next-line:no-non-null-assertion
    return this._parentContexts.getContext(this._name)!;
  }

  public get component(): object {
    if (!this._activated) {
      throw new Error('Outlet is not activated');
    }
    return this._activated.instance;
  }

  get isActivated(): boolean {
    return !!this._activated;
  }

  public set swipeGesture(swipe: boolean) {
    this._swipeGesture = swipe;
    //FIXME
    //this.nativeEl.swipeHandler = swipe?{}:undefined;
    this.nativeEl.swipeHandler = undefined;
  }

  // ///////////////////////////////////////////////////////
  // IMPLEMENTATION

  private createActivatedRouteProxy(component$: Observable<any>, activatedRoute: ActivatedRoute): ActivatedRoute {
    const proxy: any = new ActivatedRoute();

    proxy._futureSnapshot = (activatedRoute as any)._futureSnapshot;
    proxy._routerState = (activatedRoute as any)._routerState;
    proxy.snapshot = activatedRoute.snapshot;
    proxy.outlet = activatedRoute.outlet;
    proxy.component = activatedRoute.component;

    // Setup wrappers for the observables so consumers don't have to worry about switching to new observables as the state updates
    (proxy as any)._paramMap = this.proxyObservable(component$, 'paramMap');
    (proxy as any)._queryParamMap = this.proxyObservable(component$, 'queryParamMap');
    proxy.url = this.proxyObservable(component$, 'url');
    proxy.params = this.proxyObservable(component$, 'params');
    proxy.queryParams = this.proxyObservable(component$, 'queryParams');
    proxy.fragment = this.proxyObservable(component$, 'fragment');
    proxy.data = this.proxyObservable(component$, 'data');

    return proxy as ActivatedRoute;
  }

  /**
   * Create a wrapped observable that will switch to the latest activated route matched by the given component
   */
  private proxyObservable(component$: Observable<any>, path: string): Observable<any> {
    return component$.pipe(
      // First wait until the component instance is pushed
      filter((component) => !!component),
      switchMap((component) =>
        this._activatedRoute$.pipe(
          filter((current) => current !== null && current.component === component),
          switchMap((current) => current && (current.activatedRoute as any)[path]),
          distinctUntilChanged()
        )
      )
    );
  }

  /**
   * Updates the activated route proxy for the given component to the new incoming router state.
   */
  private updateActivatedRouteProxy(component: any, activatedRoute: ActivatedRoute): void {
    const proxy = this._activatedRouteProxies.get(component);
    if (!proxy) {
      throw new Error(`Could not find activated route proxy for view`);
    }

    (proxy as any)._futureSnapshot = (activatedRoute as any)._futureSnapshot;
    (proxy as any)._routerState = (activatedRoute as any)._routerState;
    proxy.snapshot = activatedRoute.snapshot;
    proxy.outlet = activatedRoute.outlet;
    proxy.component = activatedRoute.component;

    this._activatedRoute$.next({ component, activatedRoute });
  }
}

class OutletInjector implements Injector {
  constructor(
    private _route: ActivatedRoute,
    private _childContexts: ChildrenOutletContexts,
    private _parent: Injector
  ) {}
  get(token: any, notFoundValue?: any): any {
    if (token === ActivatedRoute) {
      return this._route;
    }

    if (token === ChildrenOutletContexts) {
      return this._childContexts;
    }

    // tslint:disable-next-line
    return this._parent.get(token, notFoundValue);
  }
  //   get<T>(token: Type<T> | InjectionToken<T> | AbstractType<T>, notFoundValue?: T, flags?: any): T {
  //       if(token === ActivatedRoute) {
  //           return this.route;
  //       }
  //     return this._parent.get<T>(token, notFoundValue);
  //   }
}
