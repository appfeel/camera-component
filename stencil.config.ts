import { Config } from '@stencil/core';
import { readFileSync } from 'fs';

export const config: Config = {
  namespace: 'webcam-component',
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
        cert: readFileSync('./ssl/cert.pem', 'utf-8'),
        key: readFileSync('./ssl/key-open.pem', 'utf-8'),
    },
  },
};
