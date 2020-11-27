import { Component, ComponentInterface, Element, Host, h } from '@stencil/core';
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
  private mStage: Container;
  private mTicker: Ticker;
  @Element() el!: HTMLElement;

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
    this.mStage = new Container();
    const defaultText = new Text('Pixi', { fontFamily: 'Webkinz Medium', fontSize: 50 });
    defaultText.position.set(50, 50);
    this.mStage.addChild(defaultText);

    this.mTicker = new Ticker();
    // this.mTicker.autoStart = false;
    // this.mTicker.stop();
    this.mTicker.add((/*delta: number*/) => {
      this.loop(/*delta*/);
    });

    this.el.shadowRoot.appendChild(this.mRenderer.view);
    setTimeout(() => {
      this.mRenderer.render(this.mStage);
      this.mTicker.start();
    }, 3000);
  }

  // componentDidLoad() {

  // }

  // connectedCallback() {}

  // disconnectedCallback() {

  // }

  private loop(/*delta: number*/) {
    this.mRenderer.render(this.mStage);
  }

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
