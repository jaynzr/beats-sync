import angular from 'angular';
import { Meteor } from 'meteor/meteor';
import { name as moduleName } from '../module';

import './login.html';


class Login {
    constructor($scope, $reactive, $location) {
        'ngInject';

        this.$location = $location;

        $reactive(this).attach($scope);

        this.credentials = {
            email: '',
            password: ''
        };

        this.error = '';
    }

    login() {
        Meteor.loginWithPassword(this.credentials.email, this.credentials.password,
            this.$bindToContext((err) => {
                if (err) {
                    this.error = err;
                } else {
                    this.$location.path('/editor')
                }
            })
        );
    }
}

const name = 'login';

const componentOptions = {
    templateUrl: `imports/ui/editor/controllers/${name}.html`,
    controller: Login,
    controllerAs: name
}

angular.module(moduleName).component(name, componentOptions)
