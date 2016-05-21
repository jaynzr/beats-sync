import angular from 'angular';
import { Meteor } from 'meteor/meteor';
import { Songs } from '../../../api/songs';
import { SongEdit } from './songEdit';
import { name as moduleName } from '../module';

import './newSong.html'


function dlgNewSongCtrl($scope, $mdDialog) {
    'ngInject'

    $scope.editable = {
        name: '',
        bpm: 100
    }

    $scope.cancel = function () {
        $mdDialog.cancel();
    }

    $scope.create = function () {
        if ($scope.editable.name.length && $scope.editable.bpm){
            $mdDialog.hide($scope.editable);
        }
    }

}



class NewSong {

    constructor($rootScope, $mdDialog) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.$rootScope = $rootScope;
    }

    newSong(ev) {
        let $mdDialog = this.$mdDialog;

        $mdDialog.show({
            controller: dlgNewSongCtrl,
            templateUrl: 'imports/ui/editor/components/newSong.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false,
            fullscreen: true
        })
        .then((song)=> {
            Meteor.call('addSong', song, (error, songId) => {
                if (!error) {
                    this.$rootScope.$broadcast('beatssync:addSong', songId);
                }
            });
        });
    }

    _show(song) {
        let $mdDialog = this.$mdDialog;

        $mdDialog.show({
            controller: SongEdit,
            controllerAs: '$ctrl',
            templateUrl: 'imports/ui/editor/components/songEdit.html',
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            fullscreen: true,
            locals: {
                song
            },
            bindToController: true
        })
        .then((song)=> {
            //console.debug(song)
        });
    }

}


const componentName = 'newSong';

const componentOptions = {
    template: `
<md-button ng-click="$ctrl.newSong($event)" class="md-fab md-primary md-raised new-song"><md-icon>queue</md-icon></md-button>
`,
    controller: NewSong
}

angular.module(moduleName).component(componentName, componentOptions)