# app-camera



<!-- Auto Generated Below -->


## Events

| Event        | Description | Type               |
| ------------ | ----------- | ------------------ |
| `picture`    |             | `CustomEvent<any>` |
| `webcamStop` |             | `CustomEvent<any>` |


## Methods

### `close() => Promise<void>`



#### Returns

Type: `Promise<void>`



### `flipCam() => Promise<void>`



#### Returns

Type: `Promise<void>`



### `takePicture() => Promise<void>`



#### Returns

Type: `Promise<void>`




## Dependencies

### Used by

 - [camera-component](../camera-component)

### Depends on

- ion-fab
- ion-fab-button
- ion-icon

### Graph
```mermaid
graph TD;
  app-camera --> ion-fab
  app-camera --> ion-fab-button
  app-camera --> ion-icon
  ion-fab-button --> ion-icon
  ion-fab-button --> ion-ripple-effect
  camera-component --> app-camera
  style app-camera fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
