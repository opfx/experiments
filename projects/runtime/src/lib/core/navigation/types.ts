import { ComponentRef } from '@angular/core';
import { NavigationExtras } from '@angular/router';

export type NavAnimationDirection = 'forward' | 'back';

export interface NavAnimationOptions {
  animated?: boolean;
  animationDirection?: NavAnimationDirection;
}

export type NavOptions = NavAnimationOptions & NavigationExtras;

export interface RouteView {
  id: number;
  url: string;
  stackId: string | undefined;
  element: HTMLElement;
  ref: ComponentRef<any>;
  savedData?: any;
  savedNavExtras?: NavigationExtras;
  unbindEventListeners: () => void;
}
