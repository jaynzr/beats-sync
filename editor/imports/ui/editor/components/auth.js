import angular from 'angular';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { name as moduleName } from '../module';

import './auth.html';

const name = 'auth';

class Auth {
  constructor($scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    this.helpers({
      isLoggedIn() {
        return !!Meteor.userId();
      },
      currentUser() {
        return Meteor.user();
      }
    });
  }

  logout() {
    Accounts.logout();
  }
}

function DisplayNameFilter(user) {
  if (!user) {
    return '';
  }

  if (user.profile && user.profile.name) {
    return user.profile.name;
  }

  if (user.emails) {
    return user.emails[0].address;
  }

  return user;
}


const componentName = 'auth';

const componentOptions = {
    templateUrl: `imports/ui/editor/components/${componentName}.html`,
    controller: Auth,
    controllerAs: componentName
}

angular.module(moduleName)
    .component(componentName, componentOptions)
    .filter('displayNameFilter', () => {
        return DisplayNameFilter;
    })
