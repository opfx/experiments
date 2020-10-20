import { Build, writeTask } from '@stencil/core';

import { Animation, AnimationBuilder, NavDirection } from '../../api';
import { LIFECYCLE_DID_ENTER, LIFECYCLE_DID_LEAVE, LIFECYCLE_WILL_ENTER, LIFECYCLE_WILL_LEAVE } from '../../api';

import { TransitionOptions, TransitionResult } from './types';

const iosTransitionAnimation = () => import('./ios-transition');
const mdTransitionAnimation = () => import('./md-transition');

export const transition = (opts: TransitionOptions) => {
  return new Promise((resolve, reject) => {
    writeTask(() => {
      anteTransition(opts);
      execTransition(opts).then(
        result => {
          if (result.animation) {
            result.animation.destroy();
          }
          postTransition(opts);
          resolve(result);
        },
        error => {
          postTransition(opts);
          reject(error);
        }
      );
    });
  });
};

// /////////////////////////////////////////////////////////
// IMPLEMENTATION

const anteTransition = (opts: TransitionOptions): void => {
  const enteringEl = opts.enteringEl;
  const leavingEl = opts.leavingEl;

  setZIndex(enteringEl, leavingEl, opts.direction);

  if (opts.showGoBack) {
    enteringEl.classList.add('can-go-back');
  } else {
    enteringEl.classList.remove('can-go-back');
  }
  setViewHidden(enteringEl, false);
  if (leavingEl) {
    setViewHidden(leavingEl, false);
  }
};

const execTransition = async (opts: TransitionOptions): Promise<TransitionResult> => {
  const animationBuilder = await getAnimationBuilder(opts);
  const ani = animationBuilder && Build.isBrowser ? execWithAnimation(animationBuilder, opts) : execSansAnimation(opts);
  return ani;
};

const postTransition = (opts: TransitionOptions): void => {
  const enteringEl = opts.enteringEl;
  const leavingEl = opts.leavingEl;
  enteringEl.classList.remove('wx-view-invisible');
  if (leavingEl) {
    leavingEl.classList.remove('wx-view-invisible');
  }
};

const execWithAnimation = async (animationBuilder: AnimationBuilder, opts: TransitionOptions): Promise<TransitionResult> => {
  await waitForReady(opts, true);

  const animation = animationBuilder(opts.baseEl, opts);

  fireWillEvents(opts.enteringEl, opts.leavingEl);

  const didComplete = await playTransition(animation, opts);

  if (opts.progressCallback) {
    opts.progressCallback(undefined);
  }

  if (didComplete) {
    fireDidEvents(opts.enteringEl, opts.leavingEl);
  }

  return { isComplete: true, animation };
};
const execSansAnimation = async (opts: TransitionOptions): Promise<TransitionResult> => {
  await waitForReady(opts, false);

  fireWillEvents(opts.enteringEl, opts.leavingEl);
  fireDidEvents(opts.enteringEl, opts.leavingEl);

  return { isComplete: true };
};

const playTransition = (animation: Animation, opts: TransitionOptions): Promise<boolean> => {
  const progressCallback = opts.progressCallback;
  const promise = new Promise<boolean>(resolve => {
    animation.onFinish((currentStep: any) => resolve(currentStep === 1));
  });

  // start the actual transition
  if (progressCallback) {
    // this must be a swipe to go back, just get the transition ready
    // kick off the swipe animation start
    animation.progressStart(true);
    progressCallback(animation);
  } else {
    animation.play();
  }
  return promise;
};

const waitForReady = async (opts: TransitionOptions, defaultDeep: boolean): Promise<void> => {
  const deep = opts.deepWait !== undefined ? opts.deepWait : defaultDeep;
  const promises = deep
    ? [deepReady(opts.enteringEl), deepReady(opts.leavingEl)]
    : [shallowReady(opts.enteringEl), shallowReady(opts.leavingEl)];
  await Promise.all(promises);
  // await notifyViewReady(opts.viewIsReady, opts.enteringEl);
};

// const notifyViewReady = async (viewIsReady: undefined | ((enteringEl: HTMLElement) => Promise<any>), enteringEl: HTMLElement) => {
//   if (viewIsReady) {
//     await viewIsReady(enteringEl);
//   }
// };

const shallowReady = (el: any | undefined): Promise<any> => {
  if (el && el.componentOnReady) {
    return el.componentOnReady();
  }
  return Promise.resolve();
};

const deepReady = async (el: any): Promise<void> => {
  if (el) {
    if (el.componentOnReady) {
      const stencilEl = await el.componentOnReady();
      if (stencilEl) {
        return;
      }
    }
    await Promise.all(Array.from(el.children).map(deepReady));
  }
};

const getAnimationBuilder = async (opts: TransitionOptions): Promise<any | undefined> => {
  if (!opts.leavingEl || !opts.animated || opts.duration === 0) {
    return undefined;
  }
  if (opts.animationBuilder) {
    return opts.animationBuilder;
  }

  const getAnimation =
    opts.mode === 'ios' ? (await iosTransitionAnimation()).iosTransitionAnimation : (await mdTransitionAnimation()).mdTransitionAnimation;

  return getAnimation;
};

const fireWillEvents = (enteringEl: HTMLElement, leavingEl: HTMLElement): void => {
  fireEvent(enteringEl, LIFECYCLE_WILL_ENTER);
  fireEvent(leavingEl, LIFECYCLE_WILL_LEAVE);
};
const fireDidEvents = (enteringEl: HTMLElement | undefined, leavingEl: HTMLElement | undefined): void => {
  fireEvent(enteringEl, LIFECYCLE_DID_ENTER);
  fireEvent(leavingEl, LIFECYCLE_DID_LEAVE);
};
const fireEvent = (el: HTMLElement | undefined, eventName: string): void => {
  if (!el) {
    return;
  }
  const ev = new CustomEvent(eventName, { bubbles: false, cancelable: false });
  el.dispatchEvent(ev);
};

const setViewHidden = (el: HTMLElement, hidden: boolean) => {
  if (hidden) {
    el.setAttribute('aria-hidden', 'true');
    el.classList.add('wx-view-hidden');
  } else {
    el.hidden = false;
    el.removeAttribute('aria-hidden');
    el.classList.remove('wx-view-hidden');
  }
};

const setZIndex = (enteringEl: HTMLElement | undefined, leavingEl: HTMLElement | undefined, direction: NavDirection | undefined) => {
  if (enteringEl !== undefined) {
    let zIndex = '101';
    if (direction === 'back') {
      // zIndex = '99';
      zIndex = '100';
    }
    enteringEl.style.zIndex = zIndex;
  }
  if (leavingEl !== undefined) {
    leavingEl.style.zIndex = '100';
  }
};
