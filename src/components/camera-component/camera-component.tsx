import { modalController } from '@ionic/core';
import { Component, h, Method, State, Event, EventEmitter, Prop, Listen, Element } from '@stencil/core';
import { CamMode } from './types';

@Component({
    tag: 'camera-component',
    styleUrl: 'camera-component.css',
    shadow: true,
})
export class CameraComponent {

    @Element() el;

    /** Event emitted when snap */
    @Event() picture: EventEmitter;
    /** Event emitted when cam stop */
    @Event() webcamStop: EventEmitter;
    /** Event emitted when back button is pushed */
    @Event() backButton: EventEmitter<void>;

    /** If true, shows image preview when snap */
    @Prop() showPreview: boolean = true;
    /** If true, stops cam when back button is pushed */
    @Prop() backButtonStopCam: boolean = true;
    /** Camera mode */
    @Prop({ mutable: true }) camMode?: CamMode;

    @State() isRenderCam = false;
    @State() urlB64: any;

    camController: HTMLCameraControllerElement;
    imageInput: HTMLInputElement;
    modal: HTMLIonModalElement;

    componentDidLoad() {
        if (this.camMode) {
            this.open(this.camMode);
        }
    }

    @Listen('resize', { target: 'window' })
    onResize() {
        switch (this.camMode) {
            case CamMode.modal:
                this.camController.setAttribute('height', window.innerHeight.toString());
                this.camController.setAttribute('width', window.innerWidth.toString());

            case CamMode.embedded:
            default:
                this.camController.setAttribute('height', this.el.parentElement.offsetHeight.toString());
                this.camController.setAttribute('width', this.el.parentElement.offsetWidth.toString());
        }
    }

    /**
     * Method to open the camera
     * @param camMode Defaults to embedded
     */
    @Method()
    async open(camMode?: CamMode) {
        this.camMode = camMode;
        switch (this.camMode) {
            case CamMode.modal:
                // TODO: not working
                // this.webcam = this.getCamComponent();

                this.camController = document.createElement('camera-controller');
                this.camController.addEventListener('picture', (e: any) => this.picture.emit(e.detail.snapshot));
                this.camController.addEventListener('backButton', () => { this.modal.closest('ion-modal').dismiss(); this.backButton.emit(); });
                this.camController.addEventListener('webcamStop', () => this.webcamStop.emit());

                this.modal = await modalController.create({
                    component: this.camController,
                    cssClass: 'camera-modal',
                    backdropDismiss: false,
                    componentProps: {
                        showPreview: this.showPreview,
                        backButtonStopCam: this.backButtonStopCam,
                    }
                });
                await this.modal.present();
                break;

            case CamMode.embedded:
            default:
                this.isRenderCam = true;
                break;
        }

        this.onResize();
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
                ref={el => this.camController = el}
                showPreview={this.showPreview}
                backButtonStopCam={this.backButtonStopCam}
            // onPicture={(e) => this.picture.emit(e.detail.snapshot)}
            // onBackButton={() => this.backButton.emit()}
            // onWebcamStop={() => this.webcamStop.emit()}
            />
        );
    }

    render() {
        return this.isRenderCam ? this.renderCam : null;
    }
}
