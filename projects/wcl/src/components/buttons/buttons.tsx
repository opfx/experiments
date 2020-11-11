import { Component, ComponentInterface, Host, Prop, h } from '@stencil/core';

import { getWxMode } from './../../core';

@Component({
  tag: 'wx-buttons',
  styleUrl: './buttons.scss',
  scoped: true,
})
export class Buttons implements ComponentInterface {
  /**
   * If true, buttons will disappear when its
   * parent toolbar has fully collapsed if the toolbar
   * is not the first toolbar. If the toolbar is the
   * first toolbar, the buttons will be hidden and will
   * only be shown once all toolbars have fully collapsed.
   *
   */
  @Prop() collapse = false;

  render() {
    const mode = getWxMode(this);
    return <Host class={{ [mode]: true, ['buttons-collapse']: this.collapse }}></Host>;
  }
}
