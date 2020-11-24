export type Mode = 'ios' | 'md';

export interface WxConfig {
  /**
   * When it's set to `false`, disables all animation and transition across the app.
   * Can be useful to make stencil smoother in slow devices, when animations can't run smoothly.
   */
  animated?: boolean;
  /**
   * The mode determines which platform styles to use for the whole application.
   */
  mode?: Mode;

  /**
   * Wherever wcl will respond to hardware go back buttons in an Android device.
   * Defaults to `true` when wcl runs in a mobile device.
   */
  hardwareBackButton?: boolean;

  // PRIVATE configs
  inputShims?: boolean;
  // INTERNAL configs
  persistConfig?: boolean;
  _forceStatusbarPadding?: boolean;
  _testing?: boolean;
  _zoneGate?: (h: () => any) => any;
}

export interface WxGlobal {
  config?: WxConfig;
  asyncQueue?: boolean;
}

export interface WxWindow extends Window {
  wx: WxGlobal;
  __zone_symbol_requestAnimationFrame?: (ts: FrameRequestCallback) => number;
}

// prettier-ignore
export type PredefinedColors = 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'light' | 'medium' | 'dark';
export type Color = PredefinedColors | string;

export type PredefinedSizes = 'x-small' | 'small' | 'default' | 'large' | 'x-large';
export type Size = PredefinedSizes;

export type CssClassMap = { [className: string]: boolean };

export type ComponentTags = string;
export type ComponentRef = Function | HTMLElement | string | null;
export type ComponentProps = { [key: string]: any };

export interface BackButtonEventDetail {
  register(priority: number, handler: () => Promise<any> | void): void;
}

export interface AnchorInterface {
  href: string | undefined;
  target: string | undefined;
  rel: string | undefined;
  download: string | undefined;
}

export interface ButtonInterface {
  type: 'submit' | 'reset' | 'button';
  disabled: boolean;
}
