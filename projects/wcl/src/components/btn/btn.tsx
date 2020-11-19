import { Component, ComponentInterface, Element, Host, Prop, h } from '@stencil/core';

import { Color, Size } from '../../api';
import { getWxMode } from '../../core';
import { createColorClasses } from '../../util';

// See https://stenciljs.com/docs/properties
@Component({
  tag: 'wx-btn',
  styleUrl: './btn.scss',

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
  // @Prop({ mutable: true }) gradientname: string; // 'yellow', 'blue'; // could not set gradientType - wk-button comes with all-lower-case for camel-case
  @Prop({ mutable: true }) gradientname = 'yellow';

  /**
   * If `true`, the user cannot interact with the button.
   */
  @Prop({ reflect: true }) disabled = false;

  /**
   * The button shape.
   */
  @Prop({ reflect: true }) shape = 'round'; // shape?: 'round';

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
    const { buttonType, gradientname, mode, size, shape } = this;
    // console.log('button gradientname: ' + gradientname);
    // FIX ME
    // const TagType = href === undefined ? 'button' : ('a' as any);
    const TagType = 'button';
    return (
      <Host
        aria-disabled={this.disabled ? 'true' : null}
        class={createColorClasses(this.color, {
          [mode]: true,
          [`${buttonType}-${size}`]: true,
          [`${buttonType}-${shape}`]: shape !== undefined,
          [`${buttonType}-${gradientname}`]: gradientname !== undefined,
        })}
      >
        <TagType class="button-native">
          <slot name="icon-only"></slot>
          <slot name="start"></slot>
          <slot></slot>
          <slot name="end"></slot>
        </TagType>
      </Host>
    );
  }
}
