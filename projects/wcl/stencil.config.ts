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
    },
    // {
    //   type: 'docs-readme',
    // },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
};
