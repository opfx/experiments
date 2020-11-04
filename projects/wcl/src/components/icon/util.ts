import { getAssetPath } from '@stencil/core';

import { Icon } from './icon';

let CACHED_MAP: Map<string, string>;

export const getIconMap = (): Map<string, string> => {
  if (typeof window === undefined) {
    return new Map();
  }

  if (!CACHED_MAP) {
    const win = window as any;
    win.wxicons = win.wxicons || {};
    CACHED_MAP = win.wxicons.map = win.wxicons.map || new Map();
  }
  return CACHED_MAP;
};

export const addIcons = (icons: { [name: string]: string }) => {
  const map = getIconMap();
  Object.keys(icons).forEach((name) => map.set(name, icons[name]));
};

export const getUrl = (i: Icon) => {
  let url = getSrc(i.src);
  if (url) {
    return url;
  }

  url = getName(i.name, i.icon, i.mode, i.ios, i.md);
  if (url) {
    return getNamedUrl(url);
  }

  if (i.icon) {
    url = getSrc(i.icon);
    if (url) {
      return url;
    }
    url = getSrc(i.icon[i.mode]);
    if (url) {
      return url;
    }
  }
  return null;
};

export const getNamedUrl = (iconName: string) => {
  const url = getIconMap().get(iconName);
  if (url) {
    return url;
  }
  return getAssetPath(`/assets/icon/${iconName}.svg`);
};

export const getName = (
  iconName: string | undefined,
  icon: string | undefined,
  mode: string | undefined,
  ios: string | undefined,
  md: string | undefined
) => {
  mode = (mode && toLower(mode)) === 'ios' ? 'ios' : 'md';

  // if an icon was passed in using the 'ios' or 'md' attributes,
  // set the iconName to whatever was passed
  if (ios && mode === 'ios') {
    iconName = toLower(ios);
  }
  if (md && mode === 'md') {
    iconName = toLower(md);
  }

  if (!iconName && icon && !isSrc(icon)) {
    iconName = icon;
  }
  if (isStr(iconName)) {
    iconName = toLower(iconName);
  }

  if (!isStr(iconName) || iconName.trim() === '') {
    return null;
  }

  // only allow alpha characters and dash
  const invalidChars = iconName.replace(/[a-z]|-|\d/gi, '');
  if (invalidChars !== '') {
    return null;
  }
  return iconName;
};

export const getSrc = (src: string | undefined) => {
  if (isStr(src)) {
    src = src.trim();
    if (isSrc(src)) {
      return src;
    }
  }
  return null;
};
// ////////////////////////////////////////////////////////
// request

const ioniconContent = new Map<string, string>();
const requests = new Map<string, Promise<any>>();

export const getSvgContent = (url: string, sanitize: boolean): Promise<string> => {
  return new Promise((resolve) => {
    if (ioniconContent.has(url)) {
      resolve(ioniconContent.get(url));
    } else {
      getSvgContentA(url, sanitize).then(() => {
        const svgContent = ioniconContent.get(url);
        resolve(svgContent);
      });
    }
  });
};

export const getSvgContentA = (url: string, sanitize: boolean) => {
  // see if we already have a request for this url
  let req = requests.get(url);

  if (!req) {
    if (typeof fetch !== 'undefined' && typeof document !== 'undefined') {
      // we don't already have a request
      req = fetch(url).then((rsp) => {
        if (rsp.ok) {
          return rsp.text().then((svgContent) => {
            if (svgContent && sanitize !== false) {
              svgContent = validateSvgContent(svgContent);
            }
            ioniconContent.set(url, svgContent || '');
          });
        }
        ioniconContent.set(url, '');
      });

      // cache for the same requests
      requests.set(url, req);
    } else {
      // set to empty for ssr scenarios and resolve promise
      ioniconContent.set(url, '');
      return Promise.resolve();
    }
  }

  return req;
};

// ////////////////////////////////////////////////////////
// Validation

const validateSvgContent = (svgContent: string) => {
  const div = document.createElement('div');
  div.innerHTML = svgContent;

  // setup this way to ensure it works on our buddy IE
  for (let i = div.childNodes.length - 1; i >= 0; i--) {
    if (div.childNodes[i].nodeName.toLowerCase() !== 'svg') {
      div.removeChild(div.childNodes[i]);
    }
  }

  // must only have 1 root element
  const svgElm = div.firstElementChild;
  if (svgElm && svgElm.nodeName.toLowerCase() === 'svg') {
    const svgClass = svgElm.getAttribute('class') || '';
    svgElm.setAttribute('class', (svgClass + ' s-ion-icon').trim());

    // root element must be an svg
    // lets double check we've got valid elements
    // do not allow scripts
    if (isValid(svgElm as any)) {
      return div.innerHTML;
    }
  }
  return '';
};

const isValid = (elm: HTMLElement) => {
  if (elm.nodeType === 1) {
    if (elm.nodeName.toLowerCase() === 'script') {
      return false;
    }

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < elm.attributes.length; i++) {
      const val = elm.attributes[i].value;
      if (isStr(val) && val.toLowerCase().indexOf('on') === 0) {
        return false;
      }
    }

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < elm.childNodes.length; i++) {
      if (!isValid(elm.childNodes[i] as any)) {
        return false;
      }
    }
  }
  return true;
};

export const isSrc = (str: string) => str.length > 0 && /(\/|\.)/.test(str);

export const isStr = (val: any): val is string => typeof val === 'string';

export const toLower = (val: string) => val.toLowerCase();
