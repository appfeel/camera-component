import { CamOrientation } from "./webcam.types";

/**
 * Manage webcam functions
 */
export class Webcam {

    private _webcamElement: HTMLVideoElement;
    private _facingMode: CamOrientation;
    private _webcamList: MediaDeviceInfo[];
    private _streamList: MediaStream[];
    private _selectedDeviceId: string;
    private _canvasElement: HTMLCanvasElement;
    private _snapSoundElement: HTMLAudioElement;

    static instance: Webcam;

    private constructor() {
    }

    /**
     * Get the Webcam instance
     */
    static getInstance() {
        if (!Webcam.instance) {
            throw new Error('Webcam is not yet initialized');
        }
        return Webcam.instance;
    }

    /**
     * Initialize the Webcam instace
     * @param webcamElement 
     * @param facingMode 
     * @param canvasElement 
     * @param snapSoundElement 
     */
    static init(webcamElement: HTMLVideoElement, facingMode: CamOrientation = CamOrientation.user, canvasElement: HTMLCanvasElement = null, snapSoundElement: HTMLAudioElement = null) {
        let { instance } = Webcam;

        if (!instance) {
            instance = new Webcam();
        }
        
        instance._webcamElement = webcamElement;
        instance._webcamElement.width = instance._webcamElement.width || 640;
        instance._webcamElement.height = instance._webcamElement.height || instance._webcamElement.width * (3 / 4);
        // TODO: FET si no és ni user ni environment ==> environment
        if (facingMode !== CamOrientation.environment && facingMode !== CamOrientation.user) {
            facingMode = CamOrientation.environment;
        }
        instance._facingMode = facingMode;
        instance._webcamList = [];
        instance._streamList = [];
        instance._selectedDeviceId = '';
        instance._canvasElement = canvasElement;
        instance._snapSoundElement = snapSoundElement;
        Webcam.instance = instance;
        return instance;
    }

    get facingMode() {
        return this._facingMode;
    }

    set facingMode(value) {
        this._facingMode = value;
    }

    get webcamList() {
        return this._webcamList;
    }

    get webcamCount() {
        return this._webcamList.length;
    }

    get selectedDeviceId() {
        return this._selectedDeviceId;
    }

    /**
     * Get all video input devices info
     * @param mediaDevices 
     */
    getVideoInputs(mediaDevices: MediaDeviceInfo[]) {
        this._webcamList = [];
        mediaDevices.forEach((mediaDevice) => {
            if (mediaDevice.kind === 'videoinput') {
                this._webcamList.push(mediaDevice);
            }
        });
        if (this._webcamList.length == 1) {
            this._facingMode = CamOrientation.user;
        }
        return this._webcamList;
    }

    /**
     * Get media constraints
     */
    getMediaConstraints(): MediaStreamConstraints {
        const constraints: MediaStreamConstraints = {
            video: {},
            audio: false,
        };
        const videoConstraints: MediaTrackConstraints = {};
        if (this._selectedDeviceId == '') {
            videoConstraints.facingMode = this._facingMode;
        } else {
            videoConstraints.deviceId = { exact: this._selectedDeviceId };
        }
        videoConstraints.aspectRatio = this._webcamElement.width / this._webcamElement.height;
        constraints.video = videoConstraints;
        return constraints;
    }

    /**
     * Select camera based on facingMode
     */
    selectCamera() {
        const { deviceId } = this.webcamList.find(wc =>
            (this._facingMode == CamOrientation.user && wc.label.toLowerCase().includes('front'))
            || (this._facingMode == CamOrientation.environment && wc.label.toLowerCase().includes('back'))) || {};
        this._selectedDeviceId = deviceId;
    }

    /**
     * Change Facing mode and selected camera
     */
    flip() {
        this._facingMode = (this._facingMode == CamOrientation.user) ? CamOrientation.environment : CamOrientation.user;
        this._webcamElement.style.transform = '';
        this.restart();
    }

    /**
     * 1. Get permission from user
     * 2. Get all video input devices info
     * 3. Select camera based on facingMode
     * 4. Start stream
     * @param startStream 
     */
    async start(startStream = true) {
        this.stop();
        const stream = await navigator.mediaDevices.getUserMedia(this.getMediaConstraints()); // get permisson from user
        this._streamList.push(stream);
        await this.info(); // get all video input devices info
        this.selectCamera(); // select camera based on facingMode
        if (startStream) {
            this._facingMode = await this.stream() as CamOrientation;
            return this._facingMode;
        } else {
            return this._selectedDeviceId;
        }
    }

    /**
     * Restart the Webcam
     * 1. Stop the webcam
     * 2. Select camera based on facingMode
     * 3. Start stream
     * @param startStream
     */
    async restart(startStream = true) {
        this.stop();
        this.selectCamera(); // select camera based on facingMode
        if (startStream) {
            this._facingMode = await this.stream() as CamOrientation;
            return this._facingMode;
        } else {
            return this._selectedDeviceId;
        }
    }

    /**
     * Get all video input devices info
     */
    async info() {
        const devices = await navigator.mediaDevices.enumerateDevices();
        this.getVideoInputs(devices);
        return this._webcamList;
    }

    /**
     * Start streaming webcam to video element
     */
    async stream() {
        const stream = await navigator.mediaDevices.getUserMedia(this.getMediaConstraints());
        this._streamList.push(stream);
        this._webcamElement.srcObject = stream;
        if (this._facingMode == CamOrientation.user) {
            this._webcamElement.style.transform = 'scale(-1,1)';
        }
        this._webcamElement.play();
        return this._facingMode;
    }

    /**
     * Stop streaming webcam
     */
    stop() {
        this._streamList.forEach((stream) => {
            stream.getTracks().forEach((track) => {
                track.stop();
            });
        });
    }

    /**
     * Take the picture
     */
    snap() {
        if (this._canvasElement != null) {
            if (this._snapSoundElement != null) {
                this._snapSoundElement.play();
            }
            // TODO: dimensions de la imatge
            this._canvasElement.height = this._webcamElement.scrollHeight;
            this._canvasElement.width = this._webcamElement.scrollWidth;
            const context = this._canvasElement.getContext('2d');
            if (this._facingMode == CamOrientation.user) {
                context.translate(this._canvasElement.width, 0);
                context.scale(-1, 1);
            }
            context.clearRect(0, 0, this._canvasElement.width, this._canvasElement.height);
            context.drawImage(this._webcamElement, 0, 0, this._canvasElement.width, this._canvasElement.height);
            const data = this._canvasElement.toDataURL('image/png');
            return data;
        }

        throw 'canvas element is missing';
    }
}
