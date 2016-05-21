import angular from 'angular';
import { Accounts } from 'meteor/accounts-base';
import { name as moduleName } from '../module';

import './register.html';

class Register {
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

    register() {
        Accounts.createUser(this.credentials,
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

const name = 'register';

const componentOptions = {
    templateUrl: `imports/ui/editor/controllers/${name}.html`,
    controller: Register,
    controllerAs: name
}

angular.module(moduleName).component(name, componentOptions)
