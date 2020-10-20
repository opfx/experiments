import { AnimationKeyFrames } from './../../api';

/**
 * Web Animations requires hyphenated css properties to written
 * in camelCase when animating.
 */
export const processKeyframes = (keyframes: AnimationKeyFrames): AnimationKeyFrames => {
  keyframes.forEach(keyframe => {
    for (const key in keyframe) {
      if (keyframe.hasOwnProperty(key)) {
        const val = keyframe[key];
        if (key === 'easing') {
          const newKey = 'animation-timing-function';
          keyframe[newKey] = val;
          delete keyframe[key];
        } else {
          const newKey = convertCamelCaseToHyphen(key);
          if (newKey !== key) {
            keyframe[newKey] = val;
            delete keyframe[key];
          }
        }
      }
    }
  });
  return keyframes;
};

const convertCamelCaseToHyphen = (str: string) => {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
};

let animationPrefix: string | undefined;

export const getAnimationPrefix = (el: HTMLElement): string => {
  if (animationPrefix === undefined) {
    const supportsNoPrefix = (el.style as any).animationName !== undefined;
    const supportsWebkitPrefix = (el.style as any).webkitAnimationName !== undefined;
    animationPrefix = !supportsNoPrefix && supportsWebkitPrefix ? '-webkit-' : '';
  }
  return animationPrefix;
};

export const setStyleProperty = (el: HTMLElement, name: string, value: string | null): void => {
  const prefix = name.startsWith('animation') ? getAnimationPrefix(el) : '';
  el.style.setProperty(prefix + name, value);
};

export const removeStyleProperty = (el: HTMLElement, name: string): void => {
  const prefix = name.startsWith('animation') ? getAnimationPrefix(el) : '';
  el.style.removeProperty(prefix + name);
};

export const animationEnd = (el: HTMLElement, cb: (ev?: TransitionEvent) => void) => {
  let unRegTrans: (() => void) | undefined;
  const opts: any = { passive: true };
  const unregister = () => {
    if (unRegTrans) {
      unRegTrans();
    }
  };

  const onTransitionEnd = (ev: Event) => {
    if (el === ev.target) {
      unregister();
      cb(ev as TransitionEvent);
    }
  };

  if (el) {
    el.addEventListener('webkitAnimationEnd', onTransitionEnd, opts);
    el.addEventListener('animationend', onTransitionEnd, opts);

    unRegTrans = () => {
      el.removeEventListener('webkitAnimationEnd', onTransitionEnd, opts);
      el.removeEventListener('animationend', onTransitionEnd, opts);
    };
  }
  return unregister;
};

export const generateKeyframeRules = (keyframes: any[] = []) => {
  return keyframes
    .map(keyframe => {
      const offset = keyframe.offset;
      const frameString = [];
      for (const property in keyframe) {
        if (keyframe.hasOwnProperty(property) && property !== 'offset') {
          frameString.push(`${property}: ${keyframe[property]};`);
        }
      }
      return `${offset * 100}%{ ${frameString.join(' ')} }`;
    })
    .join(' ');
};

const keyframeIds: string[] = [];

export const generateKeyframeName = (keyframeRules: string) => {
  let index = keyframeIds.indexOf(keyframeRules);
  if (index < 0) {
    index = keyframeIds.push(keyframeRules) - 1;
  }
  return `wx-animation-${index}`;
};

export const getStyleContainer = (el: HTMLElement) => {
  const rootNode = el.getRootNode() as any;
  return rootNode.head || rootNode;
};

export const createKeyframeStylesheet = (keyframeName: string, keyframeRules: string, el: HTMLElement): HTMLElement => {
  const styleContainer = getStyleContainer(el);
  const keyframePrefix = getAnimationPrefix(el);

  const existingStyleSheet = styleContainer.querySelector(`#${keyframeName}`);
  if (existingStyleSheet) {
    return existingStyleSheet;
  }

  const stylesheet = (el.ownerDocument || document).createElement('style');
  stylesheet.id = keyframeName;
  stylesheet.textContent = `@${keyframePrefix}keyframes ${keyframeName} { ${keyframeRules} } @${keyframePrefix}keyframes ${keyframeName}-alt { ${keyframeRules} }`;

  styleContainer.appendChild(stylesheet);
  return stylesheet;
};

export const addClassToArray = (classes: string[] = [], className: string | string[] | undefined): string[] => {
  if (className !== undefined) {
    const classNameToAppend = Array.isArray(className) ? className : [className];
    return [...classes, ...classNameToAppend];
  }
  return classes;
};
