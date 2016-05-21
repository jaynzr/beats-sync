import { Meteor } from 'meteor/meteor'
import { Songs } from './songs'
import { Thumbs, Images } from './images'

if (Meteor.isServer) {

    Meteor.publish('songs.list', function() {
        if (!this.userId) {
            return this.ready();
        }

        return Songs.find({});
    })

    Meteor.publish('song.current', function() {
        return Songs.find({ current: true });
    })


    Meteor.publish('thumbs', function(ids) {
        if (!this.userId) {
            return this.ready();
        }

        return Thumbs.find({
            originalStore: 'images',
            originalId: {
                $in: ids
            }
        });
    });

    Meteor.publish('images', function() {
        if (!this.userId) {
            return this.ready();
        }
        
        return Images.find({});
    });


}
