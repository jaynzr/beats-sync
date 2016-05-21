import angular from 'angular';
import { UserStatus } from 'meteor/mizzao:user-status'
import { TimeSync } from 'meteor/mizzao:timesync';


import { name as componentsModuleName } from '../imports/ui/components';

angular.module('beatssync', [
    componentsModuleName
])

.config(['$compileProvider', function($compileProvider) {
    $compileProvider.debugInfoEnabled(false);

}])

;


let monitor = setInterval(function() {

    if (TimeSync.isSynced()) {
        clearInterval(monitor);

        UserStatus.startMonitor({
            threshold: 600000
        });

        monitor = setInterval(function() {
                UserStatus.pingMonitor();
            }, 300000) // 5min
    }
    TimeSync.resync()

}, 5000);
