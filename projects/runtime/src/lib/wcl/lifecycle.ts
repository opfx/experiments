import { NgZone } from '@angular/core';

import { LIFECYCLE_DID_ENTER, LIFECYCLE_DID_LEAVE } from '@webkinz/wcl';
import { LIFECYCLE_WILL_ENTER, LIFECYCLE_WILL_LEAVE, LIFECYCLE_WILL_UNLOAD } from '@webkinz/wcl';

const lifecycle = [
  LIFECYCLE_WILL_ENTER,
  LIFECYCLE_WILL_LEAVE,
  LIFECYCLE_DID_ENTER,
  LIFECYCLE_DID_LEAVE,
  LIFECYCLE_WILL_UNLOAD,
];
export const bindLifecycleEvents = (zone: NgZone, instance: any, element: HTMLElement) => {
  return zone.run(() => {
    const unbindEventListeners = lifecycle
      .filter((eventName) => typeof instance[eventName] === 'function')
      .map((eventName) => {
        const handler = (ev: any) => instance[eventName](ev.detail);
        element.addEventListener(eventName, handler);
        return () => element.removeEventListener(eventName, handler);
      });
    return () => unbindEventListeners.forEach((fn) => fn());
  });
};
