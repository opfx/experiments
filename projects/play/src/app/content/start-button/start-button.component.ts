import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'wx-start-button',
  template: `
    <slot name="top"></slot>
    <slot name="middle"></slot>
    <slot name="bottom"></slot>
    <slot name="minimize"></slot>
    <slot></slot>
  `,
  encapsulation: ViewEncapsulation.ShadowDom,
  styleUrls: [`./start-button.component.scss`],
})
export class StartButtonComponent {}
