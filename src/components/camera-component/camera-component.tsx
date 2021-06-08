import { modalController } from '@ionic/core';
import { Component, h, Method, State, Event, EventEmitter, Prop, Element, Listen } from '@stencil/core';

import { CamOrientation } from '../../utils/webcam.types';
import { CamMode } from './types';

/**
 * Camera component, this is the main component.
 */
@Component({
    tag: 'camera-component',
    styleUrl: 'camera-component.css',
    shadow: true,
})
export class CameraComponent {
    @Element() el: HTMLCameraComponentElement;

    /** Event emitted when snap */
    @Event({ bubbles: true, cancelable: true, composed: true }) picture: EventEmitter;
    /** Event emitted when cam stop */
    @Event({ bubbles: true, cancelable: true, composed: true }) webcamStop: EventEmitter;
    /** Event emitted when back button is pushed */
    @Event({ bubbles: true, cancelable: true, composed: true }) backButton: EventEmitter<void>;

    /** If true, shows image preview when snap */
    @Prop() showPreview = true;
    /** If true, allows taking picture from gallery */
    @Prop() allowGallery = true;
    /** If true, stops cam when back button is pushed */
    @Prop() backButtonStopCam = true;
    /** Camera selected
     * - user: front camera
     * - environtment: back camera
     */
    @Prop() orientation: CamOrientation = CamOrientation.environment;

    @State() camMode?: CamMode;
    @State() isRenderCam = false;

    camController: HTMLCameraControllerElement;
    imageInput: HTMLInputElement;
    modal: HTMLIonModalElement;
    isStarted = false;

    componentDidLoad() {
        if (this.camMode) {
            this.start(this.camMode);
        }
    }

    @Listen('resize', { target: 'window' })
    onResize() {
        if (this.isStarted) {
            switch (this.camMode) {
                case CamMode.modal:
                    this.camController.resize(window.innerWidth, window.innerHeight);
                    break;
                case CamMode.embedded:
                default:
                    this.camController.resize(this.el.parentElement.offsetWidth, this.el.parentElement.offsetHeight);
            }
        }
    }

    /**
     * Method to open the camera
     * @param camMode Defaults to embedded
     * @returns void
     */
    @Method()
    async start(camMode?: CamMode) {
        if (!this.isStarted) {
            this.isStarted = true;
            this.camMode = camMode;
            switch (this.camMode) {
                case CamMode.modal:
                    // TODO: not working
                    // this.webcam = this.getCamComponent();
                    this.camController = document.createElement('camera-controller');
                    this.camController.addEventListener('picture', (e: CustomEvent) => this.picture.emit(e.detail.snapshot));
                    this.camController.addEventListener('backButton', () => {
                        this.modal.closest('ion-modal').dismiss();
                        this.backButton.emit();
                        this.isStarted = false;
                    });
                    this.camController.addEventListener('webcamStop', () => this.webcamStop.emit());

                    this.modal = await modalController.create({
                        component: this.camController,
                        cssClass: 'camera-modal',
                        backdropDismiss: false,
                        componentProps: {
                            showPreview: this.showPreview,
                            backButtonStopCam: this.backButtonStopCam,
                            width: window.innerWidth,
                            height: window.innerHeight,
                            allowGallery: this.allowGallery,
                            orientation: this.orientation,
                            camMode: this.camMode,
                        },
                    });
                    this.modal.style.position = 'fixed';
                    await this.modal.present();
                    this.onResize();
                    break;

                case CamMode.embedded:
                default:
                    this.isRenderCam = true;
                    break;
            }
        }
        // If stop is called before start process ends
        if (!this.isStarted) {
            await this.stop();
        }
    }

    /**
     * Method to stop the camera
     * @returns void
     */
    @Method()
    async stop() {
        if (this.isStarted) {
            this.isStarted = false;
            switch (this.camMode) {
                case CamMode.modal:
                    if (this.modal) {
                        await this.modal.closest('ion-modal').dismiss();
                        this.modal = undefined;
                    }
                    break;

                case CamMode.embedded:
                default:
                    this.isRenderCam = false;
                    break;
            }
        }
    }

    /**
     * https://github.com/ionic-team/ionic-framework/issues/new?assignees=&labels=&template=bug_report.md&title=bug%3A+
     */
    // getCamComponent(): HTMLAppCameraElement {
    //     return <app-camera
    //         onPicture={(e: any) => this.handlePictureReady(e)}
    //         onBackButton={() => {
    //             // this.modal.closest('ion-modal').dismiss();
    //             return true;
    //         }} />;
    // }

    renderCam() {
        return (
            <camera-controller
                ref={(el) => {
                    this.camController = el;
                    this.onResize();
                }}
                showPreview={this.showPreview}
                backButtonStopCam={this.backButtonStopCam}
                width={this.el.parentElement.offsetWidth}
                height={this.el.parentElement.offsetHeight}
                onBackButton={() => { this.isRenderCam = false; this.isStarted = false; }}
                allowGallery={this.allowGallery}
                orientation={this.orientation}
                camMode={this.camMode}
            />
        );
    }

    render() {
        return this.isRenderCam ? this.renderCam() : null;
    }
}
