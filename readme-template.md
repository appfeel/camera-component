# JavaScript Camera Component

A Javascript camera component, made with Stencil.js. This is a web component and as such, it does not depend on any framework.

Anyhow it works well with Angular, React, Vue, Stencil, JQuery, any other unimaginable framework or none at all.

# Quick example

See [example in examples folder](https://github.com/appfeel/camera-component/blob/master/examples/camera-component.html)

```html
<script type="module" src="https://unpkg.com/camera-component/dist/camera-component/camera-component.esm.js"></script>
<script nomodule src="https://unpkg.com/camera-component/dist/camera-component/camera-component.js"></script>

<camera-component id="cam" show-preview="true"></camera-component>
<button onclick="cam.start()">Open the camera in embedded mode</button>
<button onclick="cam.start(1)">Open the camera in a modal</button>
<script>
    const cam = document.getElementById('cam');
    cam.addEventListener('picture', (e) => console.log('Picture in base 64:', e.detail));
    cam.addEventListener('backButton', () => console.log('backButton'));
    cam.addEventListener('webcamStop', () => console.log('webcamStop'));
</script>
```

# Install
## JS without any framework

Include the following scripts on the html page:

```html
<script type="module" src="https://unpkg.com/camera-component/dist/camera-component/camera-component.esm.js"></script>
<script nomodule src="https://unpkg.com/camera-component/dist/camera-component/camera-component.js"></script>
```

## Frameworks

Install using npm
```sh
npm install camera-component --save
```

or yarn
```sh
yarn add camera-component
```

## React

```js
// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { applyPolyfills, defineCustomElements } from 'camera-component/loader';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

applyPolyfills().then(() => {
  defineCustomElements(window);
});
```

```jsx
// App.jsx
import React from 'react';
import 'camera-component';

const App = () => {
    return <camera-component />
}

export default App;
```


## Angular

```ts
// app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
```

```ts
// main.ts
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { applyPolyfills, defineCustomElements } from 'camera-component/loader';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
applyPolyfills().then(() => {
  defineCustomElements()
})
```

```ts
// app.component.ts
import {Component, ElementRef, ViewChild} from '@angular/core';

import 'camera-component';

@Component({
    selector: 'app-home',
    template: `<camera-component #cam></camera-component>`,
    styleUrls: ['./home.component.scss'],
})
export class AppComponent {

    @ViewChild('cam') camComponent: ElementRef<HTMLCamComponentElement>;

    async onAction() {
        await this.camComponent.nativeElement.camComponentMethod();
    }
}
```

```html
// app.component.html
<camera-component />
```

## Stencil

```tsx
import { Component } from '@stencil/core';
import 'camera-component';

@Component({
  tag: 'camera',
  styleUrl: 'camera.scss'
})
export class Camera {

render() {
    return (
      <camera-component />
    );
  }
}
```


# Quick start: Camera component

This is the camera component, ready to start the cam. It works in two different modes: embedded or in a modal.

```html
<camera-component id="cam" show-preview="true"></camera-component>
<button onclick="cam.start()">Open the camera in embedded mode</button>
<button onclick="cam.start(1)">Open the camera in a modal</button>
<script>
    const cam = document.getElementById('cam');
    cam.addEventListener('picture', (e) => console.log('Picture in base 64:', e.detail));
    cam.addEventListener('backButton', () => console.log('backButton'));
    cam.addEventListener('webcamStop', () => console.log('webcamStop'));
</script>
```

See [documentation on Github](https://github.com/appfeel/camera-component/blob/master/src/components/camera-component/readme.md) or [complete example](https://github.com/appfeel/camera-component/blob/master/examples/camera-component.html)

# Quick start: Camera controller

This is the low level camera controller.

```html
<camera-controller id="cam"></camera-controller>
<button onclick="cam.flipCam()">Flip</button>
<button onclick="cam.takePicture()">Take picture</button>
<button onclick="cam.stopWebcam()">Stop cam</button>
<script>
    const cam = document.getElementById('cam');
    cam.addEventListener('picture', (e) => console.log('Picture in base 64:', e.detail.snapshot));
    cam.addEventListener('backButton', () => console.log('backButton'));
    cam.addEventListener('webcamStop', () => console.log('webcamStop'));
</script>
```

See [documentation on Github](https://github.com/appfeel/camera-component/blob/master/src/components/camera-controller/readme.md) or [complete example](https://github.com/appfeel/camera-component/blob/master/examples/camera-controller.html)

# API

