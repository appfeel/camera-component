/* eslint-disable linebreak-style */
import { Component, h, Element, Method, Event, EventEmitter, Listen } from '@stencil/core';
import { Webcam } from '../../utils/webcam';

/**
 * Webcam component
 */
@Component({
    tag: 'app-camera',
    styleUrl: 'app-camera.css',
})

export class Camera {
    private webcam: Webcam;

    @Element() el: HTMLElement;

    /** Event emitted when snap */
    @Event() picture: EventEmitter;
    /** Event emitted when cam stop */
    @Event() webcamStop: EventEmitter;
    /** 
     * Event emitted when back button push
     * Return true to keep cam open
     * */
    @Event() backButton: EventEmitter<boolean>;
    
    webcamElement: HTMLVideoElement;

    @Listen('resize', { target: 'window' })
    onResize() {
        this.webcamElement.setAttribute('height', window.innerHeight.toString());
        this.webcamElement.setAttribute('width', window.innerWidth.toString());
    }

    componentDidRender() {
        this.startWebcam();
    }

    startWebcam() {
        const { webcamElement } = this;
        webcamElement.classList.remove('hidden');
        this.webcamElement.setAttribute('width', window.innerWidth.toString());
        this.webcamElement.setAttribute('height', window.innerHeight.toString());
        this.webcam = Webcam.init(webcamElement, 'user', document.createElement('canvas'));
        this.webcam.start();
    }
    
    /**
     * Stop the webcam
     * Emits webcamStop event
     */
    @Method()
    async stopWebcam() {
        this.webcam.stop();
        this.webcamStop.emit();
    }

    handleBackButton() {
        const isButtonPush: boolean = true;
        if (!this.backButton.emit(isButtonPush)) {
            this.stopWebcam();
        }
    }

    /**
     * Switch between front and back cam
     */
    @Method()
    async flipCam() {
        this.webcam.flip();
    }

    /**
     * Captures the picture
     * Emits picture event
     */
    @Method()
    async takePicture() {
        const snapshot = this.webcam.snap();
        this.picture.emit({ snapshot });
    }

    render() {
        return [
            <video
                id="webcam"
                class="hidden"
                autoplay
                playsinline
                ref={el => this.webcamElement = el}
            />,
            <ion-fab vertical="bottom" horizontal="start" slot="fixed">
                <ion-fab-button onClick={() => this.handleBackButton()}>
                    <ion-icon name="caret-back"></ion-icon>
                </ion-fab-button>
            </ion-fab>,
            <ion-fab vertical="bottom" horizontal="center" slot="fixed">
                <ion-fab-button id="takePicButton" class="snap-button" onClick={() => this.takePicture()}>
                    <ion-icon class="circle" name="ellipse"></ion-icon>
                </ion-fab-button>
            </ion-fab>,
            <ion-fab vertical="bottom" horizontal="end" slot="fixed">
                <ion-fab-button onClick={() => this.flipCam()}>
                    <ion-icon name="camera-reverse"></ion-icon>
                </ion-fab-button>
            </ion-fab>
        ];
    }
}
