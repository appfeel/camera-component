/* eslint-disable jsx-a11y/media-has-caption, linebreak-style */
import { Component, h, Element, Method, Event, EventEmitter, Prop, State } from '@stencil/core';

import camIcon from '../../assets/icons/camera-reverse.svg';
import backIcon from '../../assets/icons/caret-back.svg';
import ellipse from '../../assets/icons/ellipse.svg';
import galleryIcon from '../../assets/icons/image-outline.svg';
import { Webcam } from '../../utils/webcam';
import { CamOrientation } from '../../utils/webcam.types';
import { CamMode } from '../camera-component/types';

enum ViewMode {
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
    @Prop() allowGallery = true;
    /** If true, stops cam when back button is pushed */
    @Prop() backButtonStopCam = true;
    /** If true, shows image preview when snap */
    @Prop() showPreview = true;
    /** Video element width */
    @Prop({ mutable: true }) width: number;
    /** Video element height */
    @Prop({ mutable: true }) height: number;
    /** Selected camera
     * - user: front camera
     * - environtment: back camera
     */
    @Prop() orientation: CamOrientation = CamOrientation.environment;
    /** Camera mode */
    @Prop() camMode: CamMode;

    @State() mode: ViewMode = ViewMode.camera;

    webcam: Webcam;
    videoElm: HTMLVideoElement;
    imageInput: HTMLInputElement;
    snapshot: string;
    isCamStarted = false;

    componentDidRender() {
        if (this.mode === ViewMode.camera && !this.isCamStarted) {
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
     * @returns void
     */
    @Method()
    async stopWebcam() {
        this.webcam.stop();
        this.webcamStop.emit();
        this.isCamStarted = false;
    }

    /**
     * Switch between front and back cam
     * @returns void
     */
    @Method()
    async flipCam() {
        this.webcam.flip();
    }

    /**
     * Captures the picture
     * Emits picture event
     * @returns void
     */
    @Method()
    async takePicture() {
        this.snapshot = this.webcam.snap();
        const { snapshot } = this;
        if (this.showPreview) {
            this.stopWebcam();
            this.mode = ViewMode.preview;
        } else {
            this.picture.emit({ snapshot });
        }
    }

    /**
     * Change the video element size
     * @param width
     * @param height
     * @returns void
     */
    @Method()
    async resize(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    loadImage() {
        if (this.imageInput.files && this.imageInput.files[0]) {
            const reader = new FileReader();
            reader.onloadend = (e) => {
                if (e.target.result instanceof ArrayBuffer) {
                    this.snapshot = e.target.result[0].toString();
                } else {
                    this.snapshot = e.target.result.toString();
                }
                if (this.showPreview) {
                    this.stopWebcam();
                    this.mode = ViewMode.preview;
                } else {
                    this.picture.emit({ snapshot: this.snapshot });
                }
            };
            reader.readAsDataURL(this.imageInput.files[0]);
        }
    }

    handleAcceptPicture() {
        const { snapshot } = this;
        this.picture.emit({ snapshot });
    }

    handleRejectPicture() {
        this.mode = ViewMode.camera;
    }

    handleBackButton() {
        if (this.backButtonStopCam) {
            this.stopWebcam();
        }
        this.backButton.emit();
    }

    handleOpenGallery() {
        this.imageInput.value = '';
        this.imageInput.click();
    }

    renderImage() {
        return <img class="picture" src={this.snapshot} alt="Render preview" />;
    }

    renderGalleryButton() {
        if (this.allowGallery) {
            return (
                <div class="cam-button absolute right100" onClick={() => this.handleOpenGallery()}>
                    <img class="lateral-icon" src={galleryIcon} alt="" />
                </div>
            );
        }
        return null;
    }

    renderCamera() {
        return [
            <div class="relative">
                <video
                    id="video-elm"
                    class="hidden"
                    autoplay
                    playsinline
                    ref={el => (this.videoElm = el)}
                    width={this.width}
                    height={this.height}
                />

                <input
                    type="file"
                    alt="Imagen anexa"
                    class="hidden"
                    accept="image/x-png,image/gif,image/jpeg,image/jpg"
                    ref={el => (this.imageInput = el)}
                    onInput={() => this.loadImage()}
                />

                <div class="cam-button absolute left" onClick={() => this.handleBackButton()}>
                    <img class="lateral-icon back-icon" src={backIcon} alt="" />
                </div>
                <div id="takePicButton" class="cam-button absolute snap-button center" onClick={() => this.takePicture()}>
                    <img class="circle" src={ellipse} alt="" />
                </div>
                {this.renderGalleryButton()}
                <div class="cam-button absolute right20" onClick={() => this.flipCam()}>
                    <img class="lateral-icon flip-icon" src={camIcon} alt="" />
                </div>
            </div>,
        ];
    }

    renderPreview() {
        return [
            this.renderImage(),
            <ion-footer class="footer">
                <ion-button fill="clear" onClick={() => this.handleRejectPicture()}>
                    <ion-icon slot="icon-only" name="close-outline" />
                </ion-button>
                <ion-button fill="clear" onClick={() => this.handleAcceptPicture()}>
                    <ion-icon slot="icon-only" name="checkmark" />
                </ion-button>
            </ion-footer>,
        ];
    }

    render() {
        return this.mode === ViewMode.camera ? this.renderCamera() : this.renderPreview();
    }
}
