import { CamOrientation } from './webcam.types';

/**
 * Manage webcam functions
 */
export class Webcam {
    private mWebcamElement: HTMLVideoElement;
    private mFacingMode: CamOrientation;
    private mWebcamList: MediaDeviceInfo[];
    private mStreamList: MediaStream[];
    private mSelectedDeviceId: string;
    private mCanvasElement: HTMLCanvasElement;
    private mSnapSoundElement: HTMLAudioElement;

    static instance: Webcam;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

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
    static init(webcamElement: HTMLVideoElement,
        facingMode: CamOrientation = CamOrientation.user, canvasElement: HTMLCanvasElement = null, snapSoundElement: HTMLAudioElement = null) {
        let { instance } = Webcam;

        if (!instance) {
            instance = new Webcam();
        }

        instance.mWebcamElement = webcamElement;
        instance.mWebcamElement.width = instance.mWebcamElement.width || 640;
        instance.mWebcamElement.height = instance.mWebcamElement.height || instance.mWebcamElement.width * (3 / 4);
        const isValidFacingMode = facingMode === CamOrientation.environment || facingMode === CamOrientation.user;
        instance.mFacingMode = isValidFacingMode ? facingMode : CamOrientation.environment;
        instance.mWebcamList = [];
        instance.mStreamList = [];
        instance.mSelectedDeviceId = '';
        instance.mCanvasElement = canvasElement;
        instance.mSnapSoundElement = snapSoundElement;
        Webcam.instance = instance;
        return instance;
    }

    get facingMode() {
        return this.mFacingMode;
    }

    set facingMode(value) {
        this.mFacingMode = value;
    }

    get webcamList() {
        return this.mWebcamList;
    }

    get webcamCount() {
        return this.mWebcamList.length;
    }

    get selectedDeviceId() {
        return this.mSelectedDeviceId;
    }

    /**
     * Get all video input devices info
     * @param mediaDevices
     */
    getVideoInputs(mediaDevices: MediaDeviceInfo[]) {
        this.mWebcamList = [];
        mediaDevices.forEach((mediaDevice) => {
            if (mediaDevice.kind === 'videoinput') {
                this.mWebcamList.push(mediaDevice);
            }
        });
        if (this.mWebcamList.length === 1) {
            this.mFacingMode = CamOrientation.user;
        }
        return this.mWebcamList;
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
        if (this.mSelectedDeviceId === '') {
            videoConstraints.facingMode = this.mFacingMode;
        } else {
            videoConstraints.deviceId = { exact: this.mSelectedDeviceId };
        }
        constraints.video = videoConstraints;
        return constraints;
    }

    /**
     * Select camera based on facingMode
     */
    selectCamera(isFlip = false) {
        // iPhone: https://webrtc.github.io/samples/src/content/devices/input-output/
        // {deviceId: "AB927975C8778829642E82A0F73C8FC6E5CE087D", kind: "videoinput", label: "Càmera del darrere", groupId: "", toJSON: function}
        // {deviceId: "21F79D5A972EBF3041CDFF6E16A0F11F39D8B372", kind: "videoinput", label: "Càmera del davant", groupId: "", toJSON: function}
        if (isFlip && this.mSelectedDeviceId) {
            // iPhone workaround: already selected a deviceId and flip is requested
            let idx = this.webcamList.findIndex(wc => wc.deviceId === this.mSelectedDeviceId) + 1;
            idx = idx >= this.webcamList.length ? 0 : idx; // Rotate, in case more than 2 cams
            this.mSelectedDeviceId = this.webcamList[idx].deviceId;
        } else if (!this.mSelectedDeviceId) {
            const { deviceId } = this.webcamList.find(wc => (this.mFacingMode === CamOrientation.user && wc.label.toLowerCase().includes('front'))
                || (this.mFacingMode === CamOrientation.environment && wc.label.toLowerCase().includes('back'))) || this.webcamList[0];
            this.mSelectedDeviceId = deviceId;
        }
    }

    /**
     * Change Facing mode and selected camera
     */
    flip() {
        this.mFacingMode = (this.mFacingMode === CamOrientation.user) ? CamOrientation.environment : CamOrientation.user;
        this.mWebcamElement.style.transform = '';
        this.selectCamera(true);
        this.restart();
    }

    /**
     * Invert the webcam video vertically
     */
    transform() {
        if (this.mWebcamElement.style.transform === '') {
            this.mWebcamElement.style.transform = 'scale(-1,1)';
        } else {
            this.mWebcamElement.style.transform = '';
        }
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
        this.mStreamList.push(stream);
        await this.info(); // get all video input devices info
        this.selectCamera(); // select camera based on facingMode
        if (startStream) {
            this.mFacingMode = await this.stream() as CamOrientation;
            return this.mFacingMode;
        }
        return this.mSelectedDeviceId;
    }

    /**
     * Restart the Webcam
     * 1. Stop the webcam
     * 2. Start stream
     * @param startStream
     */
    async restart(startStream = true) {
        this.stop();
        if (startStream) {
            this.mFacingMode = await this.stream() as CamOrientation;
            return this.mFacingMode;
        }
        return this.mSelectedDeviceId;
    }

    /**
     * Get all video input devices info
     */
    async info() {
        const devices = await navigator.mediaDevices.enumerateDevices();
        this.getVideoInputs(devices);
        return this.mWebcamList;
    }

    /**
     * Start streaming webcam to video element
     */
    async stream() {
        const stream = await navigator.mediaDevices.getUserMedia(this.getMediaConstraints());
        this.mStreamList.push(stream);
        this.mWebcamElement.srcObject = stream;
        if (this.mFacingMode === CamOrientation.user) {
            this.mWebcamElement.style.transform = 'scale(-1,1)';
        }
        this.mWebcamElement.play();
        return this.mFacingMode;
    }

    /**
     * Stop streaming webcam
     */
    stop() {
        this.mStreamList.forEach((stream) => {
            stream.getTracks().forEach((track) => {
                track.stop();
            });
        });
    }

    /**
     * Take the picture
     */
    snap() {
        if (this.mCanvasElement != null) {
            if (this.mSnapSoundElement != null) {
                this.mSnapSoundElement.play();
            }
            this.mCanvasElement.height = this.mWebcamElement.videoHeight;
            this.mCanvasElement.width = this.mWebcamElement.videoWidth;
            const context = this.mCanvasElement.getContext('2d');
            if (this.mFacingMode === CamOrientation.user) {
                context.translate(this.mCanvasElement.width, 0);
                context.scale(-1, 1);
            }
            context.clearRect(0, 0, this.mCanvasElement.width, this.mCanvasElement.height);
            context.drawImage(this.mWebcamElement, 0, 0, this.mCanvasElement.width, this.mCanvasElement.height);
            const data = this.mCanvasElement.toDataURL('image/png');
            return data;
        }

        throw new Error('canvas element is missing');
    }
}
