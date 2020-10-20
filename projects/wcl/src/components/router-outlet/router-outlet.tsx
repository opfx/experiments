import { Component, ComponentInterface, Element, Event, EventEmitter, Method, Prop, Watch, h } from '@stencil/core';

import { AnimationBuilder } from './../../api';
import { RouterOutletOptions } from './../../api';
import { config, getWxMode } from './../../core';
import { Gesture, SwipeGestureHandler } from './../../util/gesture';
import { transition } from './../../util/transition';

@Component({
  tag: 'wx-router-outlet',
  styleUrl: 'router-outlet.scss',
  shadow: true
})
export class RouterOutlet implements ComponentInterface {
  // private activeEl: HTMLElement | undefined;
  // private activeComponent: any;
  private gesture?: Gesture;
  private _waitPromise?: Promise<void>;

  @Element() el!: HTMLElement;

  /**
   * The mode determines which platform style to use.
   */
  @Prop({ mutable: true }) mode = getWxMode(this);

  // /** @internal */
  // @Prop() delegate?: FrameworkDelegate;

  /**
   * If `true`, the router-outlet will animate the transition of components.
   */
  @Prop() animated = true;

  /**
   * By default the router-outlet animates transition between pages based in the mode (ios or material design).
   * However, this property allows to create custom transition using `AnimateBuilder` functions.
   */
  @Prop() animationBuilder?: AnimationBuilder;

  /** @internal */
  @Prop() swipeHandler?: SwipeGestureHandler;

  @Watch('swipeHandler')
  swipeHandlerChanged() {
    if (this.gesture) {
      this.gesture.enable(this.swipeHandler !== undefined);
    }
  }

  @Event() wxNavWillLoad!: EventEmitter<void>;
  @Event({ bubbles: false }) wxNavWillChange!: EventEmitter<void>;
  @Event({ bubbles: false }) wxNavDidChange!: EventEmitter<void>;

  // ///////////////////////////////////////////////////////
  // ComponentInterface
  /**
   * Called every time the component is connected to the DOM.
   * When the component is first connected, this method is called before `componentWillLoad`.
   */
  async connectedCallbackx() {
    // this.gesture = (await import('./../../util/gesture/swipe-back')).createSwipeBackGesture();
    this.swipeHandlerChanged();
  }

  /**
   * Called once just after the component is first connected to the DOM.
   */
  componentWillLoad() {
    this.wxNavWillLoad.emit();
  }

  /**
   * Called every time the component is disconnected from the DOM.
   */
  disconnectedCallback() {
    if (this.gesture) {
      this.gesture.destroy();
      this.gesture = undefined;
    }
  }

  // ///////////////////////////////////////////////////////
  // API
  @Method()
  async commit(enteringEl: HTMLElement, leavingEl: HTMLElement, opts: any): Promise<boolean> {
    const unlock = await this.lock();
    let changed = false;
    try {
      changed = await this.transition(enteringEl, leavingEl, opts);
    } catch (e) {
      console.error(e);
    }
    unlock();
    return changed;
  }

  // ///////////////////////////////////////////////////////
  // IMPLEMENTATION

  private async transition(enteringEl: HTMLElement, leavingEl: HTMLElement | undefined, opts: RouterOutletOptions = {}) {
    if (leavingEl === enteringEl) {
      return false;
    }
    this.wxNavWillChange.emit();

    const animated = this.animated && config.getBoolean('animated', true);
    await transition({
      mode: this.mode,
      animated,
      animationBuilder: this.animationBuilder,
      enteringEl,
      leavingEl,
      baseEl: this.el,
      progressCallback: undefined,
      ...opts
    });

    this.wxNavDidChange.emit();
    return true;
  }

  private async lock() {
    const p = this._waitPromise;
    let resolve!: () => void;
    this._waitPromise = new Promise(r => (resolve = r));
    if (p !== undefined) {
      await p;
    }
    return resolve;
  }
  // ///////////////////////////////////////////////////////
  // RENDER
  render() {
    return <slot></slot>;
  }
}
