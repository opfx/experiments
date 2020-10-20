import { AnimationBuilder } from './animation';
import { Mode } from './types';
export type NavDirection = 'back' | 'forward' | 'root';

export interface RouterOutletOptions {
  animated?: boolean;
  animationBuilder?: AnimationBuilder;
  duration?: number;
  direction?: NavDirection;
  deepWait?: boolean;
  easing?: string;
  keyboardClose?: boolean;
  mode?: Mode;
  progressAnimation?: boolean;
  showGoBack?: boolean;
  skipIfBusy?: boolean;
}

export interface NavOptions extends RouterOutletOptions {}
