import { SimpleRest } from 'meteor/simple:rest'
import { JsonRoutes } from 'meteor/simple:json-routes'
import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {
    // restriction doesnt seems to work.
    SimpleRest.configure({
        collections: []
    });

    if (process.env.NODE_ENV !== 'PRODUCTION') {
        JsonRoutes.setResponseHeaders({
            "Cache-Control": "no-store",
            "Pragma": "no-cache",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
        });
    }

}
