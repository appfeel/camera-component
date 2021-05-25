/* eslint-disable linebreak-style */
import { Component, h, Element, Method, Event, EventEmitter, Listen, Prop, State } from '@stencil/core';
import { Webcam } from '../../utils/webcam';
import { arrayBufferToBase64 } from '../../utils/utils';

/**
 * Webcam component
 */

enum CamMode {
    /** Camera is active */
    camera,
    /** Preview of the picture when it has already been taken */
    preview,
}
@Component({
    tag: 'camera-controller',
    styleUrl: 'camera-controller.css',
})

export class CameraController {

    @Element() el: HTMLElement;

    /** Event emitted when snap */
    @Event() picture: EventEmitter;
    /** Event emitted when cam is stoped */
    @Event() webcamStop: EventEmitter;
    /** Event emitted when back button is pushed */
    @Event() backButton: EventEmitter<void>;

    /** If true, stops cam when back button is pushed */
    @Prop() backButtonStopCam: boolean = true;
    /** If true, shows image preview when snap */
    @Prop() showPreview: boolean = true;

    @State() mode: CamMode = CamMode.camera;

    webcam: Webcam;
    webcamElement: HTMLVideoElement;
    imageInput: HTMLInputElement;
    snapshot: string;
    isCamStarted = false;

    componentDidRender() {
        if (this.mode === CamMode.camera && !this.isCamStarted) {
            this.startWebcam();
        }
    }

    @Listen('resize', { target: 'window' })
    onResize() {
        this.webcamElement.setAttribute('height', this.el.parentElement.offsetHeight.toString());
        this.webcamElement.setAttribute('width', this.el.parentElement.offsetWidth.toString());
    }

    startWebcam() {
        const { webcamElement } = this;
        webcamElement.classList.remove('hidden');
        this.onResize();
        this.webcam = Webcam.init(webcamElement, 'user', document.createElement('canvas'));
        this.webcam.start();
        this.isCamStarted = true;
    }

    /**
     * Stop the webcam
     * Emits webcamStop event
     */
    @Method()
    async stopWebcam() {
        this.webcam.stop();
        this.webcamStop.emit();
        this.isCamStarted = false;
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
        const snapshot = this.snapshot;
        if (this.showPreview) {
            this.stopWebcam();
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
                if (e.target.result instanceof ArrayBuffer) {
                    console.log('Snapshot is arraybuffer', e.target.result);
                    this.snapshot = `image/base64;data:${arrayBufferToBase64(e.target.result)}`;
                } else {
                    this.snapshot = e.target.result.toString();
                }
                if (this.showPreview) {
                    this.mode = CamMode.preview;
                } else {
                    this.picture.emit({ snapshot: this.snapshot });
                }
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

            <input
                type="file"
                alt="Imagen anexa"
                class="hidden"
                accept="image/x-png,image/gif,image/jpeg,image/jpg"
                ref={el => this.imageInput = el}
                onInput={() => this.loadImage()}
            />,

            <ion-fab-button class="cam-button absolute left" onClick={() => this.handleBackButton()}>
                <ion-icon name="caret-back"></ion-icon>
            </ion-fab-button>,
            <ion-fab-button id="takePicButton" class="cam-button absolute snap-button center" onClick={() => this.takePicture()}>
                <ion-icon class="circle" name="ellipse"></ion-icon>
            </ion-fab-button>,
            <ion-fab-button class="cam-button absolute righter" onClick={() => this.handleOpenGallery()}>
                <ion-icon name="image-outline"></ion-icon>
            </ion-fab-button>,
            <ion-fab-button class="cam-button absolute right" onClick={() => this.flipCam()}>
                <ion-icon name="camera-reverse"></ion-icon>
            </ion-fab-button>
        ];
    }

    renderPreview() {
        return [
            <div>
                {this.renderImage()}
            </div>,
            <ion-footer class='footer'>
                <ion-button onClick={() => this.handleAcceptPicture()}>
                    <ion-icon slot="icon-only" name="checkmark"></ion-icon>
                </ion-button>
                <ion-button onClick={() => this.handleRejectPicture()}>
                    <ion-icon slot="icon-only" name="cancel"></ion-icon>
                </ion-button>
            </ion-footer>
        ]
    }

    render() {
        return this.mode === CamMode.camera ? this.renderCamera() : this.renderPreview();
    }
}
