import { Component, ComponentInterface, Element, Event, EventEmitter, Host, Prop, h } from '@stencil/core';

import { AnchorInterface, ButtonInterface } from '../../api';
import { Color, Size } from '../../api';
import { getWxMode } from '../../core';
import { createColorClasses } from '../../util';

@Component({
  tag: 'wx-button',
  styleUrl: './button.scss',
  shadow: true,
})
export class Button implements ComponentInterface, AnchorInterface, ButtonInterface {
  private inToolbar = false;
  @Element() el!: HTMLElement;

  /**
   * The type of button.
   */
  @Prop({ mutable: true }) buttonType = 'button';

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

  /**
   * If `true`, the user cannot interact with the button.
   */
  @Prop({ reflect: true }) disabled = false;

  /**
   * Set to `"block"` for a full-width button or to `"full"` for a full-width button
   * without left and right borders.
   */
  @Prop({ reflect: true }) expand?: 'full' | 'block';

  /**
   * Set to `"clear"` for a transparent button, to `"outline"` for a transparent
   * button with a border, or to `"solid"`. The default style is `"solid"` except inside of
   * a toolbar, where the default is `"clear"`.
   */
  @Prop({ reflect: true, mutable: true }) fill?: 'clear' | 'outline' | 'solid' | 'default';

  /**
   * This attribute instructs browsers to download a URL instead of navigating to
   * it, so the user will be prompted to save it as a local file. If the attribute
   * has a value, it is used as the pre-filled file name in the Save prompt
   * (the user can still change the file name if they want).
   */
  @Prop() download: string | undefined;

  /**
   * Contains a URL or a URL fragment that the hyperlink points to.
   * If this property is set, an anchor tag will be rendered.
   */
  @Prop() href: string | undefined;

  /**
   * The mode determines which platform style to use.
   */
  @Prop({ mutable: true }) mode = getWxMode(this);

  /**
   * Specifies the relationship of the target object to the link object.
   * The value is a space-separated list of [link types](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types).
   */
  @Prop() rel: string | undefined;

  /**
   * The button shape.
   */
  @Prop({ reflect: true }) shape?: 'round';

  /**
   * The button size.
   */
  @Prop({ reflect: true }) size?: Size;

  /**
   * If `true`, activates a button with a heavier font weight.
   */
  @Prop() strong = false;

  /**
   * Specifies where to display the linked URL.
   * Only applies when an `href` is provided.
   * Special keywords: `"_blank"`, `"_self"`, `"_parent"`, `"_top"`.
   */
  @Prop() target: string | undefined;

  /**
   * The type of the button.
   */
  @Prop() type: 'submit' | 'reset' | 'button' = 'button';

  /**
   * Emitted when the button has focus.
   */
  @Event() wxFocus!: EventEmitter<void>;

  /**
   * Emitted when the button loses focus.
   */
  @Event() wxBlur!: EventEmitter<void>;

  private get hasIconOnly(): boolean {
    return !!this.el.querySelector('[slot="icon-only"]');
  }

  componentWillLoad(): void {
    this.inToolbar = !!this.el.closest('wx-buttons');
  }

  private onClick = (): void => {};

  private onBlur = (): void => {
    this.wxBlur.emit();
  };

  private onFocus = (): void => {
    this.wxFocus.emit();
  };

  render(): any {
    const TagType = this.href === undefined ? 'button' : 'a';
    const { expand } = this;
    let fill = this.fill;
    if (fill === undefined) {
      fill = this.inToolbar ? 'clear' : 'solid';
    }

    let shape = this.shape;

    let size = this.size;
    // if(size === undefined) {
    //   //
    // }

    const attrs =
      TagType === 'button'
        ? { type: this.type }
        : { download: this.download, href: this.href, rel: this.rel, target: this.target };
    return (
      <Host
        onClick={this.onClick}
        aria-disabled={this.disabled ? 'true' : null}
        class={createColorClasses(this.color, {
          [this.mode]: true,
          [this.buttonType]: true,
          [`${this.buttonType}-${expand}`]: expand !== undefined,
          [`${this.buttonType}-${shape}`]: shape !== undefined,
          [`${this.buttonType}-${size}`]: size !== undefined,
          [`${this.buttonType}-${fill}`]: true,
          'button-has-icon-only': this.hasIconOnly,
          'button-disabled': this.disabled,
          'wx-activatable': true,
          'wx-focusable': true,
        })}
      >
        <TagType
          {...attrs}
          class="button-native"
          part="native"
          disabled={this.disabled}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
        >
          <span class="button-inner">
            <slot name="icon-only"></slot>
            <slot name="start"></slot>
            <slot></slot>
            <slot name="end"></slot>
          </span>
        </TagType>
      </Host>
    );
  }
}
