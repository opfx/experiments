export interface Animation {
  id: string | undefined;
  parentAnimation: Animation | undefined;
  elements: HTMLElement[];
  childAnimations: Animation[];

  /**
   * Play the animation.
   *
   * If the `sync` option is `true`, the animation will play synchronously. This is equivalent with running
   * the animation with a duration of 0ms.
   */
  play(opts?: AnimationPlayOptions): Promise<void>;

  /**
   * Pauses the animation.
   */
  pause(): void;

  /**
   * Stops the animation and resets all elements to their initial state.
   */
  stop(): void;

  /**
   * Destroys the animation and all its children.
   */
  destroy(): void;

  progressStart(forceLinearEasing: boolean, step?: number): void;
  progressStep(step: number): void;
  progressEnd(playTo: 0 | 1 | undefined, step: number, duration: number): void;

  from(property: string, value: any): Animation;
  to(property: string, value: any): Animation;
  fromTo(property: string, fromValue: any, toValue): Animation;

  /**
   * Sets the keyframes for the animation.
   */
  keyframes(keyframes: AnimationKeyFrames): Animation;

  /**
   * Group one or more animation together to be controlled by the parent animation.
   */
  addAnimation(animation: Animation | Animation[]): Animation;

  /**
   * Adds one or more elements to the animation.
   */
  addElement(el: Element | Element[] | Node | Node[] | NodeList): Animation;

  /**
   * Set the number of times the animation cycle should be played before stopping.
   */
  iterations(iterations: number): Animation;

  /**
   * Sets how the animation applies styles to its elements before and after the animation's execution.
   */
  fill(fill: AnimationFill | undefined): Animation;

  /**
   * Sets whether the animation should play forwards, backward or alternating back and forth.
   */
  direction(direction: AnimationDirection | undefined): Animation;

  /**
   * Sets the length of time the animation takes to complete one cycle.
   */
  duration(duration: number | undefined): Animation;

  /**
   * Sets how the animation progresses through the duration of each cycle.
   */
  easing(easing: string | undefined): Animation;

  /**
   * Sets when and animation starts(in milliseconds).
   */
  delay(delay: number | undefined): Animation;

  /**
   * Returns an array with the animation's keyframes.
   */
  getKeyframes(): AnimationKeyFrames;

  /**
   * Returns the animation's direction.
   */
  getDirection(): AnimationDirection;

  /**
   * Returns the animation's fill.
   */
  getFill(): AnimationFill;

  /**
   * Gets the animation's delay in milliseconds.
   */
  getDelay(): number;

  /**
   * Gets the number of iterations the animation will run.
   */
  getIterations(): number;

  /**
   * Returns the animation's easing.
   */
  getEasing(): string;

  /**
   * Returns the animation's duration in milliseconds.
   */
  getDuration(): number;

  /**
   * Returns the raw Web Animations object for all elements in this Animation.
   *
   * This method will return an empty array on platforms that do not support the Web Animations API.
   */
  getWebAnimations(): any[];

  /**
   * Specifies a function that performs a DOM read to be executed after the animation's end.
   */
  afterAddRead(readFn: () => void): Animation;

  /**
   * Specifies a function that performs a DOM write to be executed after the animation's end.
   */
  afterAddWrite(writeFn: () => void): Animation;

  /**
   * Clears CSS inline style from the animation's elements after the it ends.
   */
  afterClearStyles(properties: string[]): Animation;

  /**
   * Set CSS inline styles to animation's elements after it ends.
   */
  afterStyles(styles: { [property: string]: any }): Animation;

  /**
   * Adds CSS class(es) to the animation's elements after it ends.
   */
  afterAddClass(className: string | string[]): Animation;

  /**
   * Remove CSS class from the animation's elements after the it ends.
   */
  afterRemoveClass(className: string | string[]): Animation;

  /**
   * Specifies a function that performs a DOM read to be executed before it start.
   */
  beforeAddRead(readFn: () => void): Animation;

  /**
   * Specifies a function that performs a DOM write to be executed before it starts.
   */
  beforeAddWrite(writeFn: () => void): Animation;

  /**
   * Clears CSS inline style from the animation's elements before it starts.
   */
  beforeClearStyles(properties: string[]): Animation;

  /**
   * Set CSS inline styles to animation's elements before it starts.
   */
  beforeStyles(styles: { [property: string]: any }): Animation;

  /**
   * Adds CSS class(es) to the animation's elements before it starts.
   */
  beforeAddClass(className: string | string[]): Animation;

  /**
   * Remove CSS class from the animation's elements before it starts.
   */
  beforeRemoveClass(className: string | string[]): Animation;

  /**
   * Add a callback to be executed when the animation ends.
   */
  onFinish(cb: AnimationLifecycle, opts?: AnimationCallbackOptions): Animation;
}
export type AnimationLifecycle = (currentStep: 0 | 1, animation: Animation) => void;
export type AnimationKeyFrames = [AnimationKeyFrameEdge, AnimationKeyFrameEdge] | AnimationKeyFrame[];
export type AnimationStyles = Record<string, any>;

export interface AnimationCallbackOptions {
  oneTimeCallback: boolean;
}

export interface AnimationKeyFrame extends AnimationStyles {
  offset: number;
}

export interface AnimationKeyFrameEdge extends AnimationStyles {
  offset?: number;
}

export interface AnimationPlayOptions {
  sync: boolean;
}

export type AnimationPlayTo = 'start' | 'end';
export type AnimationDirection = 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
export type AnimationFill = 'auto' | 'none' | 'forwards' | 'backwards' | 'both';
export type AnimationBuilder = (baseEl, opts?: any) => Animation;
