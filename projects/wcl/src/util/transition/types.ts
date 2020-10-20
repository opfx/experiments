import { Animation, NavOptions } from '../../api';

export interface TransitionOptions extends NavOptions {
  progressCallback?: (ani: Animation | undefined) => void;
  baseEl: any;
  enteringEl: HTMLElement;
  leavingEl: HTMLElement | undefined;
}
export interface TransitionResult {
  isComplete: boolean;
  animation?: Animation;
}
