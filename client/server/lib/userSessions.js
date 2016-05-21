import {Meteor} from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { UserStatus } from 'meteor/mizzao:user-status'


Meteor.method('userSessions', function () {

    return {
        count: UserStatus.connections.find({/*userId: {$exists: false}*/ }).count()
    };

}, {
        url: 'active_sessions',
        httpMethod: 'get'
});