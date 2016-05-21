import angular from 'angular';
import { Meteor } from 'meteor/meteor';

import { name as moduleName } from '../module';

import './editorApp.html';

class EditorApp {

    constructor() {
        'ngInject';

    }

}

const name = 'editorApp';

const componentOptions = {
  templateUrl: `imports/ui/editor/controllers/${name}.html`,
  controller: EditorApp,
  controllerAs: name
}

angular.module(moduleName).component(name, componentOptions)
