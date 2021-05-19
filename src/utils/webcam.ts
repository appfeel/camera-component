export class Webcam {

    private _webcamElement: any;
    private _facingMode: string;
    private _webcamList: any[];
    private _streamList: any[];
    private _selectedDeviceId: string;
    private _canvasElement: any;
    private _snapSoundElement: any;

    static instance: Webcam;

    private constructor() {
    }

    // constructor(webcamElement, facingMode = 'user', canvasElement = null, snapSoundElement = null) {
    //     this._webcamElement = webcamElement;
    //     this._webcamElement.width = this._webcamElement.width || 640;
    //     this._webcamElement.height = this._webcamElement.height || this._webcamElement.width * (3 / 4);
    //     this._facingMode = facingMode;
    //     this._webcamList = [];
    //     this._streamList = [];
    //     this._selectedDeviceId = '';
    //     this._canvasElement = canvasElement;
    //     this._snapSoundElement = snapSoundElement;
    // }

    static getInstance() {
        if (!Webcam.instance) {
            throw new Error('Webcam is not yet initialized');
        }
        return Webcam.instance;
    }

    static init(webcamElement: HTMLVideoElement, facingMode: 'environment' | 'user' = 'user', canvasElement: HTMLCanvasElement = null, snapSoundElement: HTMLAudioElement = null) {
        let { instance } = Webcam;

        if (!instance) {
            instance = new Webcam();
        }
        
        instance._webcamElement = webcamElement;
        instance._webcamElement.width = instance._webcamElement.width || 640;
        instance._webcamElement.height = instance._webcamElement.height || instance._webcamElement.width * (3 / 4);
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

    /* Get all video input devices info */
    getVideoInputs(mediaDevices) {
        this._webcamList = [];
        mediaDevices.forEach((mediaDevice) => {
            if (mediaDevice.kind === 'videoinput') {
                this._webcamList.push(mediaDevice);
            }
        });
        if (this._webcamList.length == 1) {
            this._facingMode = 'user';
        }
        return this._webcamList;
    }

    /* Get media constraints */
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
        constraints.video = videoConstraints;
        return constraints;
    }

    /* Select camera based on facingMode */
    selectCamera() {
        const { deviceId } = this.webcamList.find(wc =>
            (this._facingMode == 'user' && wc.label.toLowerCase().includes('front'))
            || (this._facingMode == 'environment' && wc.label.toLowerCase().includes('back'))) || {};
        this._selectedDeviceId = deviceId;
    }

    /* Change Facing mode and selected camera */
    flip() {
        this._facingMode = (this._facingMode == 'user') ? 'environment' : 'user';
        this._webcamElement.style.transform = '';
        this.restart();
    }

    /*
      1. Get permission from user
      2. Get all video input devices info
      3. Select camera based on facingMode
      4. Start stream
    */
    async start(startStream = true) {
        this.stop();
        const stream = await navigator.mediaDevices.getUserMedia(this.getMediaConstraints()); // get permisson from user
        this._streamList.push(stream);
        const webcams = await this.info(); // get all video input devices info
        this.selectCamera(); // select camera based on facingMode
        console.log(webcams);
        if (startStream) {
            this._facingMode = await this.stream() as string;
            console.log(this._facingMode);
            return this._facingMode;
        } else {
            return this._selectedDeviceId;
        }
    }

    async restart(startStream = true) {
        this.stop();
        const stream = await navigator.mediaDevices.getUserMedia(this.getMediaConstraints()); // get permisson from user
        this._streamList.push(stream);
        const webcams = await this.info(); // get all video input devices info
        this.selectCamera(); // select camera based on facingMode
        console.log(webcams);
        if (startStream) {
            // Peta quan entra a this.stream()
            console.log('restart')
            const facingMode = await this.stream();
            console.log(facingMode);
            // this._facingMode = await this.stream() as string;
            // console.log(this._facingMode);
            return this._facingMode;
        } else {
            return this._selectedDeviceId;
        }
    }

    /* Get all video input devices info */
    async info() {
        return new Promise((resolve, reject) => {
            navigator.mediaDevices.enumerateDevices()
                .then((devices) => {
                    this.getVideoInputs(devices);
                    resolve(this._webcamList);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    /* Start streaming webcam to video element */
    // async stream() {
    //     return new Promise((resolve, reject) => {
    //         navigator.mediaDevices.getUserMedia(this.getMediaConstraints())
    //             .then((stream) => {
    //                 this._streamList.push(stream);
    //                 this._webcamElement.srcObject = stream;
    //                 if (this._facingMode == 'user') {
    //                     this._webcamElement.style.transform = 'scale(-1,1)';
    //                 }
    //                 this._webcamElement.play();
    //                 resolve(this._facingMode);
    //             })
    //             .catch((error) => {
    //                 console.log(error);
    //                 reject(error);
    //             });
    //     });
    // }

    async stream() {
        const stream = await navigator.mediaDevices.getUserMedia(this.getMediaConstraints());
        this._streamList.push(stream);
        this._webcamElement.srcObject = stream;
        if (this._facingMode == 'user') {
            this._webcamElement.style.transform = 'scale(-1,1)';
        }
        this._webcamElement.play();
        return this._facingMode;
    }

    /* Stop streaming webcam */
    stop() {
        this._streamList.forEach((stream) => {
            stream.getTracks().forEach((track) => {
                track.stop();
            });
        });
    }

    snap() {
        if (this._canvasElement != null) {
            if (this._snapSoundElement != null) {
                this._snapSoundElement.play();
            }
            this._canvasElement.height = this._webcamElement.scrollHeight;
            this._canvasElement.width = this._webcamElement.scrollWidth;
            const context = this._canvasElement.getContext('2d');
            if (this._facingMode == 'user') {
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
