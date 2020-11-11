import { Component, ComponentInterface, Element, Host, h } from '@stencil/core';

@Component({
  tag: 'wx-toolbar',
  styleUrl: './toolbar.scss',
  shadow: true,
})
export class Toolbar implements ComponentInterface {
  @Element() el!: HTMLWxToolbarElement;
  componentWillLoad() {
    let buttons = Array.from(this.el.querySelectorAll('wx-buttons'));
    const firstButtons = buttons.find((buttonsEl) => {
      return buttonsEl.slot === 'start';
    });
    if (firstButtons) {
      firstButtons.classList.add('buttons-start-slot');
    }
    buttons = buttons.reverse();
    const lastButtons = buttons.find((buttonsEl) => {
      return buttonsEl.slot === 'end';
    });
    if (lastButtons) {
      lastButtons.classList.add('buttons-end-slot');
    }
  }

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
