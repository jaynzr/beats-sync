import angular from 'angular';
import ngMaterial from 'angular-material';
import { TimeSync } from 'meteor/mizzao:timesync';

import { name as componentsModuleName } from '../imports/ui/components';
import { name as controllerModuleName } from '../imports/ui/editor'



angular.module('beatssync-editor', [
    componentsModuleName,
    controllerModuleName,
    require('angular-route'),
    ngMaterial
])

.config(function($compileProvider, $routeProvider, $locationProvider) {
    'ngInject'

    $routeProvider

        .when('/editor', {
        template: '<editor-app></editor-app>'
    })

    .when('/editor/login', {
        template: '<login></login>'
    })

    .when('/editor/register', {
        template: '<register></register>'
    })

    .when('/editor/images', {
        template: '<images-library></images-library>'
    })

    .otherwise('/editor');

    $locationProvider.html5Mode(true);

    $compileProvider.debugInfoEnabled(false);

})


.controller('AuthWatchCtrl', function($scope, $location) {
    'ngInject';

    $scope.$watch(
        () => {
            return !!Meteor.userId();
        },
        (isLoggedIn) => {
            if (!isLoggedIn) {
                $location.path('/editor/login')
            }
        }
    )
})
;

let monitor = setInterval(function() {

    if (TimeSync.isSynced()) {
        clearInterval(monitor);
    }
    TimeSync.resync();

}, 5000);
