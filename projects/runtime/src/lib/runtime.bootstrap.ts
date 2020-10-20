import { NgZone } from '@angular/core';
import { WxWindow, WxGlobal } from '@webkinz/wcl';
import { applyPolyfills, defineCustomElements } from '@webkinz/wcl/loader';

import { raf } from './util/raf';

let initialized = false;
export const bootstrap = (doc: Document, zone: NgZone) => {
  return (): Promise<void> => {
    // return Promise.resolve();
    return bootstrapWcl(doc, zone);
  };
};
export const bootstrapWcl = (doc: Document, zone: NgZone) => {
  const win: WxWindow | undefined = doc.defaultView as any;
  if (!win || typeof (window as any) === 'undefined') {
    return Promise.resolve();
  }
  if (initialized) {
    console.warn(`@webkinz/runtime was already initialized. Make sure RuntimeModule.forRoot() is called only once.`);
    return Promise.resolve();
  }
  console.log(`@webkinz/runtime is starting`);
  initialized = true;
  const wx: WxGlobal = (win.wx = win.wx || {});
  wx.config = {
    _zoneGate: (h: any) => zone.run(h),
  };

  const aelFn =
    '__zone_symbol_addEventListener' in (doc.body as any) ? '__zone_symbol_addEventListener' : 'addEventListener';

  return applyPolyfills().then(() => {
    return defineCustomElements(win, {
      exclude: [],
      syncQueue: true,
      raf,
      jmp: (h: any) => zone.runOutsideAngular(h),
      ael(el, eventName, cb, opts) {
        (<any>el)[aelFn](eventName, cb, opts);
      },
      rel(el, eventName, cb, opts) {
        el.removeEventListener(eventName, cb, opts);
      },
    });
  });
};
