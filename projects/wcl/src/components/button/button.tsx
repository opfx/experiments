import { Component, ComponentInterface, Element, Host, Prop, h } from '@stencil/core';

import { Color, Size } from '../../api';
import { getWxMode } from '../../core';
import { createColorClasses } from '../../util';

@Component({
  tag: 'wx-button',
  styleUrls: {
    ios: 'button.scss',
    md: 'button.scss',
  },
  shadow: true,
})
export class ButtonComponent implements ComponentInterface {
  @Element() el!: HTMLElement;

  /**
   * The type of button.
   */
  @Prop({ mutable: true }) buttonType = 'button';

  @Prop() mode = getWxMode(this);
  @Prop() color?: Color;

  /**
   * If `true`, the user cannot interact with the button.
   */
  @Prop({ reflect: true }) disabled = false;

  /**
   * The button size.
   */
  @Prop({ reflect: true }) size: Size = 'default';

  /*
    <Host
    ...
    <span class="button-outer">ample</span>
        <span class="button-inner">
          sample
          {/* <button class="button-native">
            <slot></slot>
          </button> * /}
        </span>
    </Host>
   */
  render() {
    const { buttonType, mode, size } = this;
    //FIX ME
    // const TagType = href === undefined ? 'button' : ('a' as any);
    const TagType = 'button';
    return (
      <Host
        aria-disabled={this.disabled ? 'true' : null}
        class={createColorClasses(this.color, {
          [mode]: true,
          [`${buttonType}-${size}`]: true,
        })}
      >
        <TagType class="button-native yellow regular">
          <img src="assets/icon/menu/icon-arcade.svg" class="icon-position"></img>
        </TagType>
      </Host>
    );
  }
}
