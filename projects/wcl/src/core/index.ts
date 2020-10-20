import { getMode, setMode } from '@stencil/core';

import { Mode } from '../api';

import { config, configFromSession, configFromURL, saveConfig } from './config';
import { isPlatform, setupPlatforms } from './platform';

export * from './platform';
export * from './config';

declare const Context: any;

let defaultMode: any;

export const getWxMode = (ref?: any): Mode => {
  return (ref && getMode(ref)) || defaultMode;
};

export default () => {
  console.log('@webkinz/wcl is starting');

  const doc = document;
  const win = window;

  Context.config = config; // this does not seem used

  const wx = ((win as any).wx = (win as any).wx || {});

  // setup platforms
  setupPlatforms(win);

  // create the configuration
  const configObj = {
    ...configFromSession(win),
    persistConfig: false,
    ...wx.config,
    ...configFromURL(win),
  };

  config.reset(configObj);
  if (config.getBoolean('persistConfig')) {
    saveConfig(win, configObj);
  }

  wx.config = config;

  // initialize the defaultMode
  defaultMode = doc.documentElement.getAttribute('mode') || (isPlatform(win, 'ios') ? 'ios' : 'md');
  defaultMode = config.get('mode', defaultMode);
  wx.mode = defaultMode;

  doc.documentElement.setAttribute('mode', defaultMode);
  doc.documentElement.classList.add(defaultMode);

  if (config.getBoolean('_testing')) {
    config.set('animated', false);
  }

  setMode((el: HTMLElement) => {
    while (el) {
      const elMode = (el as any).mode || el.getAttribute('mode');
      if (elMode) {
        return elMode;
      }
      el = el.parentElement;
    }
    return defaultMode;
  });
};
