import { Component, ComponentInterface, Host, Prop, h } from '@stencil/core';

import { Color } from '../../api';
import { getWxMode } from '../../core';
import { createColorClasses } from '../../util';
@Component({
  tag: 'wx-button',
  styleUrls: {
    ios: 'button.ios.scss',
    md: 'button.md.scss',
  },
  shadow: true,
})
export class ButtonComponent implements ComponentInterface {
  @Prop() mode = getWxMode(this);
  @Prop() color?: Color;

  render() {
    return (
      <Host
        class={createColorClasses(this.color, {
          [this.mode]: true,
        })}
      >
        <span class="button-outer">ample</span>
        <span class="button-inner">
          sample
          {/* <button class="button-native">
            <slot></slot>
          </button> */}
        </span>
      </Host>
    );
  }
}
