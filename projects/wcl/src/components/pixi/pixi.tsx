import { Component, ComponentInterface, Element, Host, Prop, h } from '@stencil/core';
// import { autoDetectRenderer } from '@pixi/core';
// import { Renderer } from '@pixi/core';
import { autoDetectRenderer } from 'pixi.js';
import { Container, Renderer, Text, Ticker } from 'pixi.js';
// import { getWxMode } from './../../core';

@Component({
  tag: 'wx-pixi',
  styleUrl: './pixi.scss',
  shadow: true,
})
export class PixiComponent implements ComponentInterface {
  private mRenderer: Renderer;
  private mTicker: Ticker;

  @Element() el!: HTMLElement;

  @Prop() stage: Container;

  @Prop() loop: (delta: number) => void;

  /**
   * The component is about to load and it has not
   * rendered yet.
   *
   * This is the best place to make any data updates
   * before the first render.
   *
   * componentWillLoad will only be called once.
   */
  componentWillLoad(): void {
    this.mRenderer = autoDetectRenderer({
      backgroundColor: 0x1099bb,
      autoDensity: true,
      antialias: true,
      resolution: window.devicePixelRatio, // Math.min(window.devicePixelRatio, 3)
    });

    if (!this.stage) {
      this.stage = new Container();
      const defaultText = new Text('Pixi', { fontFamily: 'Webkinz Medium', fontSize: 50 });
      defaultText.position.set(50, 50);
      this.stage.addChild(defaultText);
    }

    this.mTicker = new Ticker();
    this.mTicker.add((delta: number) => {
      this.doLoop(delta);
    });
    this.el.shadowRoot.appendChild(this.mRenderer.view);

    setTimeout(() => {
      this.mRenderer.render(this.stage);
      this.mTicker.start();
    }, 3000);
  }

  // componentDidLoad() {

  // }

  // connectedCallback() {}

  // disconnectedCallback() {

  // }

  doLoop(delta: number) {
    // console.log('[pixi.tsx], delta: ' + delta);
    if (this.loop) {
      this.loop(delta);
    }
    this.mRenderer.render(this.stage);
  }

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
