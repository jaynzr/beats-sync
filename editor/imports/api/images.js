import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { loggedIn } from './utils'


export const Images = new Mongo.Collection('images');
export const Thumbs = new Mongo.Collection('thumbs');

Thumbs.allow({
    insert: loggedIn,
    update: loggedIn,
    remove: loggedIn
});

Images.allow({
    insert: loggedIn,
    update: loggedIn,
    remove: loggedIn
});



