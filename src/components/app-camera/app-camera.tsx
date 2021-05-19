/* eslint-disable linebreak-style */
import { Component, h, Element, Method, Event, EventEmitter, State, Listen } from '@stencil/core';
import { Webcam } from '../../utils/webcam';

@Component({
    tag: 'app-camera',
    styleUrl: 'app-camera.css',
})

export class Camera {
    private webcam: Webcam;

    @Element() el: HTMLElement;

    @Event() picture: EventEmitter;
    @Event() closed: EventEmitter;
    
    @State() screenHeight: number = window.innerHeight;
    @State() screenWidth: number = window.innerWidth;
    
    webcamElement: HTMLVideoElement;

    // TODO: not working
    @Listen('orientationchange', { target: 'window' })
    onOrientationChange() {
        console.log('holaaaaa')
        this.screenHeight = window.innerHeight;
        this.screenWidth = window.innerWidth;
    }

    componentDidRender() {
        this.startWebcam();
    }

    startWebcam() {
        const { webcamElement } = this;
        webcamElement.classList.remove('hidden');
        this.webcamElement.setAttribute('width', this.screenWidth.toString());
        this.webcamElement.setAttribute('height', this.screenHeight.toString());
        this.webcam = Webcam.init(webcamElement, 'user', document.createElement('canvas'));
        this.webcam.start();
    }

    stopWebcam() {
        this.webcam.stop();
        this.closed.emit();
    }

    @Method()
    async close() {
        this.webcam.stop();
    }

    @Method()
    async flipCam() {
        // TODO
        this.webcam.flip();
    }

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
                <ion-fab-button onClick={() => this.stopWebcam()}>
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
