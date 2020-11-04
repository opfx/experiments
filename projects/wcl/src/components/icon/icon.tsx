import { Build, Component, ComponentInterface, Element, Host, Prop, State, Watch, h } from '@stencil/core';

import { Color, Size } from './../../api';
import { getWxMode } from './../../core';
import { createColorClasses } from './../../util';

import { getName, getSvgContent, getUrl } from './util';

@Component({
  tag: 'wx-icon',
  styleUrl: 'icon.scss',
  shadow: true,
})
export class Icon implements ComponentInterface {
  private io?: IntersectionObserver;

  @Element() el!: HTMLElement;

  @State() private svgContent!: string;
  @State() private isVisible = false;

  /**
   * Specifies the label to use for accessibility. Defaults to the icon name.
   */
  @Prop({ mutable: true, reflect: true }) ariaLabel?: string;

  /**
   * Set the icon to hidden, respectively `true`, to remove it from the accessibility tree.
   */
  @Prop({ reflect: true }) ariaHidden?: string;

  /**
   * The mode determines which platform styles to use.
   */
  @Prop({ mutable: true }) mode = getWxMode();

  /**
   * Specifies which icon to use on `ios` mode.
   */
  @Prop() ios?: string;

  /**
   * Specifies which icon to use on `md` mode.
   */
  @Prop() md?: string;

  /**
   * Specifies whether the icon should horizontally flip when `dir` is `"rtl"`.
   */
  @Prop() flipRtl?: boolean;

  /**
   * The color to use for the background of the item.
   */
  @Prop() color?: Color;

  /**
   * Specifies which icon to use from the built-in set of icons.
   */
  @Prop() name?: string;

  /**
   * Specifies the exact `src` of an SVG file to use.
   */
  @Prop() src?: string;

  /**
   * A combination of both `name` and `src`. If a `src` url is detected
   * it will set the `src` property. Otherwise it assumes it's a built-in named
   * SVG and set the `name` property.
   */
  @Prop() icon?: any;

  /**
   * The icon size.
   */
  @Prop() size?: Size;

  /**
   * If enabled, wx-icon will be loaded lazily when it's visible in the viewport.
   * Default, `false`.
   */
  @Prop() lazy = false;

  /**
   * When set to `false`, SVG content that is HTTP fetched will not be checked
   * if the response SVG content has any `<script>` elements, or any attributes
   * that start with `on`, such as `onclick`.
   */
  @Prop() sanitize = true;

  /**
   * Called every time the component is connected to the DOM. When the component
   * is first connected, this method is called before componentWillLoad.
   *
   * It's important to note that this method can be called more than once, every time
   * the element is attached or moved in the DOM.
   */
  connectedCallback() {
    this.waitUntilVisible(this.el, '50px', () => {
      this.isVisible = true;
      this.loadIcon();
    });
  }

  /**
   * Called every time the component is disconnected from the DOM, ie, it can be dispatched more than once.
   *
   * DO not confuse with a "onDestroy" kind of event.
   */
  disconnectedCallback() {
    if (this.io) {
      this.io.disconnect();
      this.io = undefined;
    }
  }

  private waitUntilVisible(el: HTMLElement, rootMargin: string, cb: () => void) {
    if (Build.isBrowser && this.lazy && typeof window !== undefined && (window as any).IntersectionObserver) {
      const io = (this.io = new (window as any).IntersectionObserver(
        (data: IntersectionObserverEntry[]) => {
          if (data[0].isIntersecting) {
            io.disconnect();
            this.io = undefined;
            cb();
          }
        },
        { rootMargin }
      ));
      io.observe(el);
    } else {
      // browser does not support IntersectionObserver, so just fallback to always show it
      cb();
    }
  }

  @Watch('name')
  @Watch('src')
  @Watch('icon')
  loadIcon() {
    if (Build.isBrowser && this.isVisible) {
      const url = getUrl(this);
      if (url) {
        getSvgContent(url, this.sanitize).then((svgContent) => {
          this.svgContent = svgContent;
        });
      }
    }

    if (!this.ariaLabel && this.ariaHidden !== 'true') {
      const label = getName(this.name, this.icon, this.mode, this.ios, this.md);
      if (label) {
        this.ariaLabel = label.replace(/\-/g, ' ');
      }
    }
  }

  render() {
    const mode = this.mode || 'md';
    const flipRtl =
      this.flipRtl ||
      (this.ariaLabel &&
        (this.ariaLabel.indexOf('arrow') > -1 || this.ariaLabel.indexOf('chevron') > -1) &&
        this.flipRtl !== false);

    return (
      <Host
        role="img"
        class={createColorClasses(this.color, {
          [mode]: true,
          [`icon-${this.size}`]: !!this.size,
          'flip-rtl': !!flipRtl && (this.el.ownerDocument as Document).dir === 'rtl',
        })}
      >
        {Build.isBrowser && this.svgContent !== undefined ? (
          <div class="icon-inner" innerHTML={this.svgContent}></div>
        ) : (
          <div class="icon-inner"></div>
        )}
      </Host>
    );
  }
}
