import { Mode } from './types';
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

  // INTERNAL configs
  persistConfig?: boolean;
  _forceStatusbarPadding?: boolean;
  _testing?: boolean;
  _zoneGate?: (h: () => any) => any;
}
