import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'wcl',
  globalScript: 'src/core/index.ts',
  plugins: [sass({})],
  outputTargets: [
    {
      type: 'angular',
      componentCorePackage: '@webkinz/wcl',
      directivesProxyFile: './../runtime/src/lib/wcl/components/proxies.ts',
      directivesUtilsFile: './../runtime/src/lib/wcl/components/proxies-utils.ts',
      directivesArrayFile: './../runtime/src/lib/wcl/components/proxies-list.ts',
    },
    {
      type: 'dist',
      esmLoaderPath: '../loader',
      copy: [
        // need to inject the css into runtime from this target because
        // the angular output target does not support copy
        { src: './../css', dest: './../../../runtime/css', warn: true },
        { src: './theme', dest: './../../../runtime/theme', warn: true },
        { src: './assets', dest: './../../../runtime/src/assets', warn: true },
      ],
    },
    // {
    //   type: 'docs-readme',
    // },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
      copy: [{ src: './css', dest: './../www/css', warn: true }],
    },
  ],
  devServer: {
    reloadStrategy: 'pageReload',
    openBrowser: false,
    logRequests: true,
  },
};
