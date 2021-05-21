/* eslint-disable linebreak-style */
import { Component, h, Element, Method, Event, EventEmitter, Listen, Prop, State } from '@stencil/core';
import { Webcam } from '../../utils/webcam';

/**
 * Webcam component
 */

 enum CamMode {
     camera,
     preview,
 }
@Component({
    tag: 'camera-controller',
    styleUrl: 'camera-controller.css',
})

export class CameraController {
    private webcam: Webcam;

    @Element() el: HTMLElement;

    /** Event emitted when snap */
    @Event() picture: EventEmitter;
    /** Event emitted when cam stop */
    @Event() webcamStop: EventEmitter;
    /** Event emitted when back button is pushed */
    @Event() backButton: EventEmitter<void>;

    /**  */
    @Prop() backButtonStopCam = true;

    webcamElement: HTMLVideoElement;
    imageInput: HTMLInputElement;
    @State() mode: CamMode = CamMode.camera;
    snapshot: any;
    showPreview: boolean = true;

    @Listen('resize', { target: 'window' })
    onResize() {
        this.webcamElement.setAttribute('height', window.innerHeight.toString());
        this.webcamElement.setAttribute('width', window.innerWidth.toString());
    }

    componentDidRender() {
        if (this.mode === CamMode.camera) {
            this.startWebcam();
        }
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
        if (this.backButtonStopCam) {
            this.stopWebcam();
        }
        this.backButton.emit();
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
        this.snapshot = this.webcam.snap();
        const snapshot = this.snapshot
        if (this.showPreview) {
            this.mode = CamMode.preview;
        } else {
            this.picture.emit({ snapshot });
        }
    }

    handleAcceptPicture() {
        const snapshot = this.snapshot;
        this.picture.emit({ snapshot });
    }

    handleRejectPicture() {
        this.mode = CamMode.camera;
    }

    handleOpenGallery() {
        this.imageInput.value = '';
        this.imageInput.click();
    }

    loadImage() {
        if (this.imageInput.files && this.imageInput.files[0]) {
            const reader = new FileReader();
            reader.onloadend = (e) => {
                this.snapshot = e.target.result;
            };
            reader.readAsDataURL(this.imageInput.files[0]);
        }
    }

    renderImage() {
        return <img class="picture" src={this.snapshot} alt="picture" />;
    }

    renderCamera() {
        return [
            <video
                id="webcam"
                class="hidden"
                autoplay
                playsinline
                ref={el => this.webcamElement = el}
            />,
            
            <ion-fab-button class="boton fixed left" onClick={() => this.handleBackButton()}>
                <ion-icon name="caret-back"></ion-icon>
            </ion-fab-button>,
            <ion-fab-button id="takePicButton" class="boton fixed snap-button center" onClick={() => this.takePicture()}>
                <ion-icon class="circle" name="ellipse"></ion-icon>
            </ion-fab-button>,
            <ion-fab-button class="boton fixed righter" onClick={() => this.handleOpenGallery()}>
                <ion-icon name="image-outline"></ion-icon>
            </ion-fab-button>,
            <ion-fab-button class="boton fixed right" onClick={() => this.flipCam()}>
                <ion-icon name="camera-reverse"></ion-icon>
            </ion-fab-button>
        ];
    }

    renderPreview() {
        return [
            <div>
                {this.renderImage()}
            </div>,
            <input
                type="file"
                alt="Imagen anexa"
                class="hidden"
                accept="image/x-png,image/gif,image/jpeg,image/jpg"
                ref={el => this.imageInput = el}
                onInput={() => this.loadImage()}
            />,
            <ion-button onClick={() => this.handleAcceptPicture()}>Accept</ion-button>,
            <ion-button onClick={() => this.handleRejectPicture()}>Cancel</ion-button>
        ]
    }

    render() {
        return this.mode === CamMode.camera ? this.renderCamera() : this.renderPreview();
    }
}
