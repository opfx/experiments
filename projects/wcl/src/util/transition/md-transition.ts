import { Animation } from './../../api';
import { createAnimation } from './../animation';
import { TransitionOptions } from './types';
import { getWxViewElement } from './util';

export const mdTransitionAnimation = (_: HTMLElement, opts: TransitionOptions): Animation => {
  const OFF_BOTTOM = '40px';
  const CENTER = '0px';

  const backDirection = opts.direction === 'back';
  const enteringEl = opts.enteringEl;
  const leavingEl = opts.leavingEl;

  const wxViewEl = getWxViewElement(enteringEl);

  const rootTransition = createAnimation();

  rootTransition
    .addElement(wxViewEl)
    .fill('both')
    .beforeRemoveClass('wx-view-invisible');

  // animate the component itself
  if (backDirection) {
    rootTransition.duration(opts.duration || 200).easing('cubic-bezier(0.47,0,0.745,0.715)');
  } else {
    rootTransition
      .duration(opts.duration || 280)
      .easing('cubic-bezier(0.36,0.66,0.04,1)')
      .fromTo('transform', `translateY(${OFF_BOTTOM})`, `translateY(${CENTER})`)
      .fromTo('opacity', 0.01, 1);
  }

  // setup the leaving view
  if (leavingEl && backDirection) {
    rootTransition.duration(opts.duration || 200).easing('cubic-bezier(0.47,0,0.745,0.715)');

    const leavingPage = createAnimation();
    leavingPage
      .addElement(getWxViewElement(leavingEl))
      .afterStyles({ display: 'none' })
      .fromTo('transform', `translateY(${CENTER})`, `translateY(${OFF_BOTTOM})`)
      .fromTo('opacity', 1, 0);

    rootTransition.addAnimation(leavingPage);
  }

  return rootTransition;
};
