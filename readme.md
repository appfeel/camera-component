# Vainilla JavaScript Camera Component

A pure Javascript camera component, made with Stencil.js.

# API

## Vainilla Javascript

### Install

Include the following script on the html page:

```html
<script type="module" src="https://unpkg.com/camera-component/dist/camera-component/camera-component.esm.js"></script>
```

### Camera controller

This is the low level camera controller. Will emit an event when picture is ready in Base64.

```html
<!DOCTYPE html>
<html>

<header>
    <script type="module" src="https://unpkg.com/camera-component/dist/camera-component/camera-component.esm.js"></script>
</header>

<body>
    <camera-controller id="cam"></camera-controller>
</body>

<script>
    const cam = document.getElementById('cam');
    cam.addEventListener('picture', (e) => console.log('Picture in base 64:', e.detail.snapshot));
    cam.addEventListener('backButton', () => console.log('backButton'));
    cam.addEventListener('webcamStop', () => console.log('webcamStop'));
</script>
</html>
```

See [documentation on Github](src/components/camera-controller/readme.md) or [complete example](examples/camera-controller.html)

### Camera component


```html
    <camera-component id="camComponent" show-preview="true"></camera-component>
    <button onclick="openCamComponent">Open the camera</button>
    <script>
        const camComponent = document.getElementById('cam');
        camComponent.addEventListener('picture', (e) => console.log('Picture in base 64:', e.detail.snapshot));
        camComponent.addEventListener('backButton', () => console.log('backButton'));
        camComponent.addEventListener('webcamStop', () => console.log('webcamStop'));
        camComponent.open();
    </script>
```

See [documentation on Github](src/components/camera-component/readme.md) or [complete example](examples/camera-component.html)


### Camera input

```html

```
