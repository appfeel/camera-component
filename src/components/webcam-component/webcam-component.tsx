import { alertController, modalController } from '@ionic/core';
import { Component, h, State } from '@stencil/core';

@Component({
    tag: 'webcam-component',
    styleUrl: 'webcam-component.css',
    shadow: true,
})

export class WebcamComponent {

    @State() urlB64: any;

    webcam: HTMLAppCameraElement;
    imageInput: HTMLInputElement;
    modal: HTMLIonModalElement;

    loadImage() {
        if (this.imageInput.files && this.imageInput.files[0]) {
            const reader = new FileReader();
            reader.onloadend = (e) => {
                this.urlB64 = e.target.result;
            };
            reader.readAsDataURL(this.imageInput.files[0]);
        }
    }

    async handlePictureReady(e: CustomEvent<any>) {
        const { snapshot } = e.detail;
        const alert = await alertController.create({
            cssClass: 'my-custom-class',
            header: 'Picture',
            message: `<img src='${snapshot}' alt='picture' style='width: 30px; heigth: 30px'>`,
            buttons: [{
                text: 'Accept',
                role: 'accept',
                handler: () => {
                    this.webcam.stopWebcam();
                    this.urlB64 = snapshot;
                    this.modal.closest('ion-modal').dismiss();
                },
            },
            {
                text: 'Cancel',
                role: 'cancel',
                cssClass: 'secondary',
                handler: () => { },
            }],
        });

        await alert.present();
    }

    /**
     * https://github.com/ionic-team/ionic-framework/issues/new?assignees=&labels=&template=bug_report.md&title=bug%3A+
     */
    getCamComponent(): HTMLAppCameraElement {
        return <app-camera
            onPicture={(e: any) => this.handlePictureReady(e)}
            onBackButton={() => this.modal.closest('ion-modal').dismiss()} />;
    }

    async handleTakePhoto() {
        this.webcam = document.createElement('app-camera');
        this.webcam.addEventListener('picture', (e: any) => this.handlePictureReady(e));
        this.webcam.addEventListener('backButton', () => { this.modal.closest('ion-modal').dismiss(); this.webcam.stopWebcam(); });

        // this.webcam = this.getCamComponent();
        this.modal = await modalController.create({
            component: this.webcam,
            cssClass: 'camera-modal',
            backdropDismiss: false,
        });
        await this.modal.present();
    }

    handleOpenGallery() {
        this.imageInput.value = '';
        this.imageInput.click();
    }

    renderImage() {
        if (!this.urlB64) {
            return <p>No image yet</p>
        }
        return <img class="picture" src={this.urlB64} alt="picture" />;
    }

    render() {
        return (
            <div>
                {this.renderImage()}
                <input
                    type="file"
                    alt="Imagen anexa"
                    class="hidden"
                    accept="image/x-png,image/gif,image/jpeg,image/jpg"
                    ref={el => this.imageInput = el}
                    onInput={() => this.loadImage()}
                />
                <ion-button onClick={() => this.handleTakePhoto()}>
                    <ion-icon slot="icon-only" name="camera-outline" />
                </ion-button>
                <ion-button onClick={() => this.handleOpenGallery()}>
                    <ion-icon slot="icon-only" name="image-outline" />
                </ion-button>
            </div>
        );
    }
}
