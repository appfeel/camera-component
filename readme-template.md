# Vainilla JavaScript Camera Component

A pure Javascript camera component, made with Stencil.js.

# Install
## Vanilla JS

Include the following script on the html page:

```html
<script type="module" src="https://unpkg.com/camera-component/dist/camera-component/camera-component.esm.js"></script>
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

```jsx
import { camera-component } from 'camera-component';

const CamComponent = () => {
    return <camera-component />
}

export default CamComponent;
```


## Angular

```ts
//app.module.ts
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { camera-component } from 'camera-component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    camera-component
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

```ts
// app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})
export class AppComponent {
  constructor(){
    
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
import { camera-component } from 'camera-component';

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

See [documentation on Github](src/components/camera-component/readme.md) or [complete example](examples/camera-component.html)

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

See [documentation on Github](src/components/camera-controller/readme.md) or [complete example](examples/camera-controller.html)

# API

