import { UploadFS } from 'meteor/jalik:ufs';
import { Images, Thumbs } from './images';

/*export const ThumbsStore = new UploadFS.store.GridFS({
    collection: Thumbs,
    name: 'thumbs',
    transformWrite(from, to, fileId, file) {
        const gm = require('gm');

        gm(from, file.name)
            .resize(128, 228)
            .gravity('Center')
            .extent(128, 128)
            .quality(75)
            .stream()
            .pipe(to);
    }
});

export const ImagesStore = new UploadFS.store.GridFS({
    collection: Images,
    name: 'images',
    transformWrite(from, to, fileId, file) {
        const gm = require('gm');

        gm(from, file.name)
            .resize(414, 736)
            .quality(80)
            .stream()
            .pipe(to);
    },
    filter: new UploadFS.Filter({
        contentTypes: ['image/*']
    }),
    copyTo: [
        ThumbsStore
    ]
});*/

export const ThumbsStore = new UploadFS.store.Local({
    collection: Thumbs,
    name: 'thumbs',
    path: `${Meteor.settings.public.uploads}/thumbs`,
    mode: '0744', // directory permissions
    writeMode: '0744', // file permissions
    transformWrite(from, to, fileId, file) {
        const gm = require('gm');

        gm(from, file.name)
            .gravity('Center')
            .crop(414, 414)
            .resize(128, 128)
            .extent(128, 128)
            .quality(95)
            .stream()
            .pipe(to);
    }
});

export const ImagesStore = new UploadFS.store.Local({
    collection: Images,
    name: 'images',
    path: `${Meteor.settings.public.uploads}/images`,
    mode: '0755', // directory permissions
    writeMode: '0744', // file permissions
    transformWrite(from, to, fileId, file) {
        const gm = require('gm');

        gm(from, file.name)
            .resize(414, 736)
            .gravity('Center')
            .extend(414, 736)
            .quality(95)
            .stream()
            .pipe(to);
    },
    filter: new UploadFS.Filter({
        contentTypes: ['image/*']
    }),
    copyTo: [
        ThumbsStore
    ]
});
