import { Config } from '@stencil/core';
import { readFileSync } from 'fs';

// Generate self signed certificate:
// openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
// With password:
// openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365

export const config: Config = {
  buildEs5: 'prod',
  extras: {
    cssVarsShim: true,
    dynamicImportShim: true,
    shadowDomShim: true,
    safari10: true,
    scriptDataOpts: true,
    appendChildSlotFix: false,
    cloneNodeFix: false,
    slotChildNodesFix: true,
  },
  namespace: 'camera-component',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements-bundle',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
  devServer: {
    reloadStrategy: 'pageReload',
    https: {
        // Generate self signed certificate:
        // openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
        // With password:
        // openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365
        // chrome://flags/#allow-insecure-localhost --> enable
        cert: readFileSync('./ssl/cert.pem', 'utf-8'),
        key: readFileSync('./ssl/key.pem', 'utf-8'),
    },
  },
};
