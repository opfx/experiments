import { Build, Component, ComponentInterface, Element, Host, h } from '@stencil/core';

import { isPlatform } from '../../api';
import { config } from '../../core';
import { getWxMode } from '../../core';

@Component({
  tag: 'wx-app',
  styleUrl: './app.scss',
})
export class App implements ComponentInterface {
  @Element() el!: HTMLElement;

  componentDidLoad(): void {
    if (Build.isBrowser) {
      wxAppRequestIdleCallback(() => {
        const isHybrid = isPlatform(window, 'hybrid');
        if (config.getBoolean('inputShims') && needsInputShims()) {
          console.warn('Input shims are needed but are not implemented!');
        }
        if (config.getBoolean('hardwareBackButton', isHybrid)) {
          console.warn('Hardware back button is not implemented!');
        }
      });
    }
  }

  render() {
    const mode = getWxMode(this);
    return <Host class={{ [mode]: true, 'wx-page': true }}></Host>;
  }
}

const needsInputShims = () => {
  return isPlatform(window, 'ios') && isPlatform(window, 'mobile');
};

const wxAppRequestIdleCallback = (callback: () => void) => {
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(callback);
  } else {
    setTimeout(callback, 32);
  }
};
