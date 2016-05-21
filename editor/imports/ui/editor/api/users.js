import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';


Accounts.validateNewUser(function (user) {
    if (!Meteor.userId()) {
        // TODO: admin roles if necessary
        throw new Meteor.Error(403, "Only admin can create accounts");
    }

    return true;
});