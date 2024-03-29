/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { CamOrientation } from "./utils/webcam.types";
import { CamMode } from "./components/camera-component/types";
export namespace Components {
    interface CameraComponent {
        /**
          * If true, allows taking picture from gallery
         */
        "allowGallery": boolean;
        /**
          * If true, stops cam when back button is pushed
         */
        "backButtonStopCam": boolean;
        /**
          * Camera selected - user: front camera - environtment: back camera
         */
        "orientation": CamOrientation;
        /**
          * If true, shows image preview when snap
         */
        "showPreview": boolean;
        /**
          * Method to open the camera
          * @param camMode Defaults to embedded
          * @returns void
         */
        "start": (camMode?: CamMode) => Promise<void>;
        /**
          * Method to stop the camera
          * @returns void
         */
        "stop": () => Promise<void>;
    }
    interface CameraController {
        /**
          * If true, allows taking picture from gallery
         */
        "allowGallery": boolean;
        /**
          * If true, stops cam when back button is pushed
         */
        "backButtonStopCam": boolean;
        /**
          * Camera mode
         */
        "camMode": CamMode;
        /**
          * Switch between front and back cam
          * @returns void
         */
        "flipCam": () => Promise<void>;
        /**
          * Video element height
         */
        "height": number;
        /**
          * Selected camera - user: front camera - environtment: back camera
         */
        "orientation": CamOrientation;
        /**
          * Change the video element size
          * @param width
          * @param height
          * @returns void
         */
        "resize": (width: number, height: number) => Promise<void>;
        /**
          * If true, shows image preview when snap
         */
        "showPreview": boolean;
        /**
          * Stop the webcam Emits webcamStop event
          * @returns void
         */
        "stopWebcam": () => Promise<void>;
        /**
          * Captures the picture Emits picture event
          * @returns void
         */
        "takePicture": () => Promise<void>;
        /**
          * Video element width
         */
        "width": number;
    }
}
export interface CameraComponentCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLCameraComponentElement;
}
export interface CameraControllerCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLCameraControllerElement;
}
declare global {
    interface HTMLCameraComponentElement extends Components.CameraComponent, HTMLStencilElement {
    }
    var HTMLCameraComponentElement: {
        prototype: HTMLCameraComponentElement;
        new (): HTMLCameraComponentElement;
    };
    interface HTMLCameraControllerElement extends Components.CameraController, HTMLStencilElement {
    }
    var HTMLCameraControllerElement: {
        prototype: HTMLCameraControllerElement;
        new (): HTMLCameraControllerElement;
    };
    interface HTMLElementTagNameMap {
        "camera-component": HTMLCameraComponentElement;
        "camera-controller": HTMLCameraControllerElement;
    }
}
declare namespace LocalJSX {
    interface CameraComponent {
        /**
          * If true, allows taking picture from gallery
         */
        "allowGallery"?: boolean;
        /**
          * If true, stops cam when back button is pushed
         */
        "backButtonStopCam"?: boolean;
        /**
          * Event emitted when back button is pushed
         */
        "onBackButton"?: (event: CameraComponentCustomEvent<void>) => void;
        /**
          * Event emitted when snap
         */
        "onPicture"?: (event: CameraComponentCustomEvent<any>) => void;
        /**
          * Event emitted when cam stop
         */
        "onWebcamStop"?: (event: CameraComponentCustomEvent<any>) => void;
        /**
          * Camera selected - user: front camera - environtment: back camera
         */
        "orientation"?: CamOrientation;
        /**
          * If true, shows image preview when snap
         */
        "showPreview"?: boolean;
    }
    interface CameraController {
        /**
          * If true, allows taking picture from gallery
         */
        "allowGallery"?: boolean;
        /**
          * If true, stops cam when back button is pushed
         */
        "backButtonStopCam"?: boolean;
        /**
          * Camera mode
         */
        "camMode"?: CamMode;
        /**
          * Video element height
         */
        "height"?: number;
        /**
          * Event emitted when back button is pushed
         */
        "onBackButton"?: (event: CameraControllerCustomEvent<void>) => void;
        /**
          * Event emitted when snap
         */
        "onPicture"?: (event: CameraControllerCustomEvent<any>) => void;
        /**
          * Event emitted when cam is stoped
         */
        "onWebcamStop"?: (event: CameraControllerCustomEvent<any>) => void;
        /**
          * Selected camera - user: front camera - environtment: back camera
         */
        "orientation"?: CamOrientation;
        /**
          * If true, shows image preview when snap
         */
        "showPreview"?: boolean;
        /**
          * Video element width
         */
        "width"?: number;
    }
    interface IntrinsicElements {
        "camera-component": CameraComponent;
        "camera-controller": CameraController;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "camera-component": LocalJSX.CameraComponent & JSXBase.HTMLAttributes<HTMLCameraComponentElement>;
            "camera-controller": LocalJSX.CameraController & JSXBase.HTMLAttributes<HTMLCameraControllerElement>;
        }
    }
}
