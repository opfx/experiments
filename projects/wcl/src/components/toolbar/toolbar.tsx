import { Component, ComponentInterface, Host, h } from '@stencil/core';

@Component({
  tag: 'wx-toolbar',
  styleUrl: './toolbar.scss',
  shadow: true,
})
export class ToolbarComponent implements ComponentInterface {
  render() {
    return (
      <Host>
        <div class="toolbar-background"></div>
        <div class="toolbar-container">
          <slot name="start"></slot>
          <slot name="secondary"></slot>
          <div class="toolbar-content">
            <slot></slot>
          </div>
          <slot name="primary"></slot>
          <slot name="end"></slot>
        </div>
      </Host>
    );
  }
}
