import angular from 'angular';
import { Meteor } from 'meteor/meteor';

import { name as moduleName } from '../module';


class UsersCount {

    constructor($scope, $http, $interval) {
        'ngInject';

        this.$interval = $interval;
        this.$http = $http;

        if (window.location.port === "3002") {
            this.loc = `${window.location.protocol}//${window.location.hostname}:3000/active_sessions`
        }
        else {
            this.loc = '/active_sessions'
        }

        this.check_proc = $interval(() => {
            this.getCount();
        }, 60000);

    }

    $onInit() {
        this.getCount();
    }

    getCount() {
        this.$http.get(this.loc)
            .success((res) => {
                this.connections = res.count
            })
    }

    $onDestroy() {
        if (this.check_proc) {
            this.$interval.cancel(this.check_proc);
        }
    }

}


const componentName = 'usersCount';

const componentOptions = {
    template: `
<a ng-click="$ctrl.getCount()">{{ $ctrl.connections }}</a>
`,
    controller: UsersCount
}

angular.module(moduleName).component(componentName, componentOptions)