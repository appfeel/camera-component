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
        const {snapshot} = e.detail; 
        const alert = await alertController.create({
            cssClass: 'my-custom-class',
            header: 'Picture',
            message: `<img src='${snapshot}' alt='picture' style='width: 30px; heigth: 30px'>`,
            buttons: [{
                text: 'Accept',
                role: 'accept',
                handler: () => {
                    this.webcam.close();
                    this.modal.closest('ion-modal').dismiss(snapshot);
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

    
    async handleTakePhoto() {
        this.webcam = document.createElement('app-camera');
        this.webcam.addEventListener('picture', (e: any) => this.handlePictureReady(e));
        this.webcam.addEventListener('closed', () => this.modal.closest('ion-modal').dismiss(this.urlB64));
        this.modal = await modalController.create({
            component: this.webcam,
            cssClass: 'camera-modal',
            backdropDismiss: false,
        });
        await this.modal.present();
        const { data } = await this.modal.onDidDismiss();
        this.urlB64 = data;
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
