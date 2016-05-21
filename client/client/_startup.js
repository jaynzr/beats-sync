import { SimpleRest } from 'meteor/simple:rest'
import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {
    // restriction doesnt seems to work.
    SimpleRest.configure({
        collections: []
    });
}