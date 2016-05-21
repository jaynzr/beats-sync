import { Mongo } from 'meteor/mongo';
import { loggedIn } from './utils'

export const Songs = new Mongo.Collection('songs');

Songs.allow({
    insert: loggedIn,
    update: loggedIn,
    remove: loggedIn
});
