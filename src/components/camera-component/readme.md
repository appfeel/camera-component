# API camera-component



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute              | Description                                                      | Type                                                | Default                      |
| ------------------- | ---------------------- | ---------------------------------------------------------------- | --------------------------------------------------- | ---------------------------- |
| `allowGallery`      | `allow-gallery`        | If true, allows taking picture from gallery                      | `boolean`                                           | `true`                       |
| `backButtonStopCam` | `back-button-stop-cam` | If true, stops cam when back button is pushed                    | `boolean`                                           | `true`                       |
| `orientation`       | `orientation`          | Camera selected - user: front camera - environtment: back camera | `CamOrientation.environment \| CamOrientation.user` | `CamOrientation.environment` |
| `showPreview`       | `show-preview`         | If true, shows image preview when snap                           | `boolean`                                           | `true`                       |


## Events

| Event        | Description                              | Type                |
| ------------ | ---------------------------------------- | ------------------- |
| `backButton` | Event emitted when back button is pushed | `CustomEvent<void>` |
| `picture`    | Event emitted when snap                  | `CustomEvent<any>`  |
| `webcamStop` | Event emitted when cam stop              | `CustomEvent<any>`  |


## Methods

### `start(camMode?: CamMode) => Promise<void>`

Method to open the camera

#### Returns

Type: `Promise<void>`



### `stop() => Promise<void>`

Method to stop the camera

#### Returns

Type: `Promise<void>`




## Dependencies

### Depends on

- [camera-controller](../camera-controller)

### Graph
```mermaid
graph TD;
  camera-component --> camera-controller
  camera-controller --> ion-fab-button
  camera-controller --> ion-icon
  camera-controller --> ion-footer
  camera-controller --> ion-button
  ion-fab-button --> ion-icon
  ion-fab-button --> ion-ripple-effect
  ion-button --> ion-ripple-effect
  style camera-component fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
