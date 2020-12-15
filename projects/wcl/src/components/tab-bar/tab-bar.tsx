import { Component, ComponentInterface, Element, Event, EventEmitter, Host, Listen, h } from '@stencil/core';
import { Prop, State, Watch } from '@stencil/core';

import { Color } from './../../api';
import { getWxMode } from './../../core';
import { createColorClasses } from './../../util';
import { TabBarChangedEventDetail } from './types';

@Component({
  tag: 'wx-tab-bar',
  styleUrls: {
    ios: './style/tab-bar.ios.scss',
    md: './style/tab-bar.md.scss',
  },
  shadow: true,
})
export class TabBar implements ComponentInterface {
  @Element() el!: HTMLElement;

  @State() keyboardVisible = false;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

  /**
   * The selected tab component
   */
  @Prop() selectedTab?: string;
  @Watch('selectedTab')
  selectedTabChanged() {
    if (this.selectedTab !== undefined) {
      this.wxTabBarChanged.emit({
        tab: this.selectedTab,
      });
    }
  }

  /**
   * If `true`, the tab bar will be translucent.
   * Only applies when the mode is `"ios"` and the device supports
   * [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility).
   */
  @Prop() translucent = false;

  /** @internal */
  @Event() wxTabBarChanged!: EventEmitter<TabBarChangedEventDetail>;

  @Listen('keyboardWillHide', { target: 'window' })
  protected onKeyboardWillHide() {
    setTimeout(() => (this.keyboardVisible = false), 50);
  }

  @Listen('keyboardWillShow', { target: 'window' })
  protected onKeyboardWillShow() {
    if (this.el.getAttribute('slot') !== 'top') {
      this.keyboardVisible = true;
    }
  }

  // /////////////////////////////////////////////////////////////////////////////////////////
  // ComponentInterface
  componentWillLoad(): void {
    this.selectedTabChanged();
  }

  render() {
    const { color, translucent, keyboardVisible } = this;
    const mode = getWxMode(this);

    return (
      <Host
        role="tablist"
        aria-hidden={keyboardVisible ? 'true' : null}
        class={createColorClasses(color, {
          [mode]: true,
          'tab-bar-translucent': translucent,
          'tab-bar-hidden': keyboardVisible,
        })}
      >
        <slot></slot>
      </Host>
    );
  }
}
