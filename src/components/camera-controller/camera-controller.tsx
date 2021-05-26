/* eslint-disable linebreak-style */
import { Component, h, Element, Method, Event, EventEmitter, Prop, State, Listen } from '@stencil/core';
import { Webcam } from '../../utils/webcam';
import { arrayBufferToBase64 } from '../../utils/utils';
import { CamOrientation } from '../../utils/webcam.types';

enum CamMode {
    /** Camera is active */
    camera,
    /** Preview of the picture when it has already been taken */
    preview,
}

/**
 * Camera controller component
 */
@Component({
    tag: 'camera-controller',
    styleUrl: 'camera-controller.css',
})
export class CameraController {

    @Element() el: HTMLCameraControllerElement;

    /** Event emitted when snap */
    @Event() picture: EventEmitter;
    /** Event emitted when cam is stoped */
    @Event() webcamStop: EventEmitter;
    /** Event emitted when back button is pushed */
    @Event() backButton: EventEmitter<void>;

    /** If true, allows taking picture from gallery */
    @Prop() allowGallery: boolean = true;
    /** If true, stops cam when back button is pushed */
    @Prop() backButtonStopCam: boolean = true;
    /** If true, shows image preview when snap */
    @Prop() showPreview: boolean = true;
    /** Video element width */
    @Prop({ mutable: true }) width: number;
    /** Video element height */
    @Prop({ mutable: true }) height: number;
    // TODO: FET prop in parent
    /** Camera selected
     * - user: front camera
     * - environtment: back camera
     */
    @Prop() orientation: CamOrientation = CamOrientation.environment;
    @Prop() isModal: boolean = false;

    @State() mode: CamMode = CamMode.camera;

    webcam: Webcam;
    videoElm: HTMLVideoElement;
    imageInput: HTMLInputElement;
    snapshot: string;
    isCamStarted = false;

    @Listen('resize', { target: 'window' })
    onResize() {
        if (this.isModal) {
            this.width = document.body.offsetWidth;
            this.height = document.body.offsetHeight;
        }
    }

    componentDidRender() {
        if (this.mode === CamMode.camera && !this.isCamStarted) {
            this.startWebcam();
        }
    }

    startWebcam() {
        const { videoElm: webcamElement } = this;
        webcamElement.classList.remove('hidden');
        this.webcam = Webcam.init(webcamElement, this.orientation, document.createElement('canvas'));
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
                    //TODO: comprovar array buffer
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

    renderGalleryButton() {
        if (this.allowGallery) {
            return (
                <ion-fab-button class="cam-button absolute righter" onClick={() => this.handleOpenGallery()}>
                    <ion-icon name="image-outline"></ion-icon>
                </ion-fab-button>
            );
        }
        return null;
    }

    // TODO: FET renderització botons camara 
    // TODO: renderització del preview
    renderCamera() {
        // console.log('renderCamera', this.width, this.height);
        return [
            <div class="relative">
                <video
                    id="video-elm"
                    class="hidden"
                    autoplay
                    playsinline
                    ref={el => this.videoElm = el}
                    width={this.width}
                    height={this.height}
                />

                <input
                    type="file"
                    alt="Imagen anexa"
                    class="hidden"
                    accept="image/x-png,image/gif,image/jpeg,image/jpg"
                    ref={el => this.imageInput = el}
                    onInput={() => this.loadImage()}
                />

                <ion-fab-button class="cam-button absolute left" onClick={() => this.handleBackButton()}>
                    <ion-icon name="caret-back"></ion-icon>
                </ion-fab-button>
                <ion-fab-button id="takePicButton" class="cam-button absolute snap-button center" onClick={() => this.takePicture()}>
                    <ion-icon class="circle" name="ellipse"></ion-icon>
                </ion-fab-button>
                {this.renderGalleryButton()}
                <ion-fab-button class="cam-button absolute right" onClick={() => this.flipCam()}>
                    <ion-icon name="camera-reverse"></ion-icon>
                </ion-fab-button>
            </div>
        ];
    }

    renderPreview() {
        return [
            <div>
                {this.renderImage()}
            </div>,
            <ion-footer class='footer'>
                <ion-button fill="clear" onClick={() => this.handleRejectPicture()}>
                    <ion-icon slot="icon-only" name="close-outline"></ion-icon>
                </ion-button>
                <ion-button fill="clear" onClick={() => this.handleAcceptPicture()}>
                    <ion-icon slot="icon-only" name="checkmark"></ion-icon>
                </ion-button>
            </ion-footer>
        ];
    }

    render() {
        return this.mode === CamMode.camera ? this.renderCamera() : this.renderPreview();
    }
}
