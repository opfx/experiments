import { Component, ComponentInterface, Event, EventEmitter, Host, Listen, Prop, h } from '@stencil/core';

import { getWxMode } from './../../core';

@Component({
  tag: 'wx-backdrop',
  styleUrl: './backdrop.scss',
  shadow: true,
})
export class Backdrop implements ComponentInterface {
  /**
   * If `true` the backdrop will be visible.
   */
  @Prop() visible = true;

  /**
   * If `true`, the backdrop will can be clicked and will emit the `wxBackdropTap` event.
   */
  @Prop() tappable = true;

  /**
   * If `true`, the backdrop will stop propagation on tap.
   */
  @Prop() stopPropagation = true;

  /**
   * Emitted when the backdrop is tapped.
   */
  @Event() wxBackdropTap!: EventEmitter<void>;

  @Listen('click', { passive: false, capture: true })
  protected onMouseDown(ev: TouchEvent) {
    if (this.stopPropagation) {
      ev.preventDefault();
      ev.stopPropagation();
    }
    if (this.tappable) {
      this.wxBackdropTap.emit();
    }
  }

  render() {
    const mode = getWxMode();
    return (
      <Host
        tabIndex="-1"
        class={{
          [mode]: true,
          'backdrop-hide': !this.visible,
          'backdrop-not-tappable': !this.tappable,
        }}
      ></Host>
    );
  }
}
