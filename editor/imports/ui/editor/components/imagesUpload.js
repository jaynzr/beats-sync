import angular from 'angular';
import { Meteor } from 'meteor/meteor';
import { UploadFS } from 'meteor/jalik:ufs';
import { Thumbs } from '../../../api/images';
import { ImagesStore } from '../../../api/imagesStore';
import { name as moduleName } from '../module';


import './imagesUpload.html';

class ImagesUpload {

    constructor($scope, $reactive) {
        'ngInject';

        $reactive(this).attach($scope);

        this.uploaded = [];

        this.subscribe('thumbs', () => [
            this.getReactively('files', true) || []
        ]);

        this.helpers({
            thumbs() {
                return Thumbs.find({
                    originalStore: 'images',
                    originalId: {
                        $in: this.getReactively('files', true) || []
                    }
                });
            }
        });
    }

    addImages(files) {
        if (files.length) {
            this.currentFile = files[0];

            const reader = new FileReader;

            reader.onload = this.$bindToContext((e) => {
                this.cropImgSrc = e.target.result;
                this.myCroppedImage = '';
            });

            reader.readAsDataURL(files[0]);
        } else {
            this.cropImgSrc = undefined;
        }
    }

    save() {
        upload(this.myCroppedImage, this.currentFile.name, this.$bindToContext((file) => {
            this.uploaded.push(file);

            if (!this.files || !this.files.length) {
                this.files = [];
            }
            this.files.push(file._id);

            this.reset();
        }), (e) => {
            console.log('Oops, something went wrong', e);
        });
    }

    reset() {
        this.cropImgSrc = undefined;
        this.myCroppedImage = '';
    }

}

const componentName = 'imagesUpload';

const componentOptions = {
    templateUrl: `imports/ui/editor/components/${componentName}.html`,
    controller: ImagesUpload
}

angular.module(moduleName).component(componentName, componentOptions)


/**
 * Uploads a new file
 *
 * @param  {String}   dataUrl [description]
 * @param  {String}   name    [description]
 * @param  {Function} resolve [description]
 * @param  {Function} reject  [description]
 */
function upload(dataUrl, name, resolve, reject) {
    // convert to Blob
    const blob = dataURLToBlob(dataUrl);
    blob.name = name;

    // pick from an object only: name, type and size
    const file = _.pick(blob, 'name', 'type', 'size');
    file.name = file.name.toLowerCase();

    // convert to ArrayBuffer
    blobToArrayBuffer(blob, (data) => {
        const upload = new UploadFS.Uploader({
            data,
            file,
            store: ImagesStore,
            onError: reject,
            onComplete: resolve
        });

        upload.start();
    }, reject);
}

/**
 * Converts DataURL to Blob object
 *
 * https://github.com/ebidel/filer.js/blob/master/src/filer.js#L137
 *
 * @param  {String} dataURL
 * @return {Blob}
 */
function dataURLToBlob(dataURL) {
    const BASE64_MARKER = ';base64,';

    if (dataURL.indexOf(BASE64_MARKER) === -1) {
        const parts = dataURL.split(',');
        const contentType = parts[0].split(':')[1];
        const raw = decodeURIComponent(parts[1]);

        return new Blob([raw], { type: contentType });
    }

    const parts = dataURL.split(BASE64_MARKER);
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
}

/**
 * Converts Blob object to ArrayBuffer
 *
 * @param  {Blob}       blob          Source file
 * @param  {Function}   callback      Success callback with converted object as a first argument
 * @param  {Function}   errorCallback Error callback with error as a first argument
 */
function blobToArrayBuffer(blob, callback, errorCallback) {
    const reader = new FileReader();

    reader.onload = (e) => {
        callback(e.target.result);
    };

    reader.onerror = (e) => {
        if (errorCallback) {
            errorCallback(e);
        }
    };

    reader.readAsArrayBuffer(blob);
}

