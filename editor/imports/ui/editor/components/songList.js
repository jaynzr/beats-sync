import angular from 'angular';
import { Meteor } from 'meteor/meteor';

import { colors } from '../../../api/colors';
import { Songs } from '../../../api/songs';
import { name as moduleName } from '../module';

import { SongEdit } from './songEdit';
import { SectionSelector } from './sectionSelector';


import './songList.html';

class SongList {

    constructor($scope, $reactive, $mdDialog, $mdBottomSheet) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.$mdBottomSheet = $mdBottomSheet;
        $reactive(this).attach($scope);

        this.subscribe(`songs.list`);

        this.helpers({
            songs() {
                return Songs.find({});
            }
        })

        $scope.$on('beatssync:addSong', (ev, songId) => {
            let song = Songs.findOne(songId);
            this.show(song)
        })

    }

    isPlaying(song) {
        return song.current && song.play.start && song.play.value
    }

    show(song, ev) {
        if (ev) ev.stopPropagation();

        let $mdDialog = this.$mdDialog;

        $mdDialog.show({
                controller: SongEdit,
                controllerAs: '$ctrl',
                templateUrl: 'imports/ui/editor/components/songEdit.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
                fullscreen: true,
                locals: {
                    song
                },
                bindToController: true
            })
            .then((song) => {
                //console.debug(song)
            });

    }

    selectSection(song, ev) {

        this.$mdBottomSheet.show({
                templateUrl: 'imports/ui/editor/components/sectionSelector.html',
                controller: SectionSelector,
                controllerAs: '$ctrl',
                locals: {
                    song
                },
                bindToController: true
            })
            .then((selected) => {
                /*
                // logic at SectionSelector
                if (selected === false) {
                    this.pauseSong();
                }
                else {
                    this._playSection(song, selected.section);
                }*/
            });

    }

    pauseSong(ev) {
        Meteor.call('pauseSong');
    }

    _playSection(song, section) {
        Meteor.call('playSong', song._id, {
            section
        }, (error) => {
            console.debug('playSong error', error)
        })
    }

}



const componentName = 'songList';

const componentOptions = {
    templateUrl: `imports/ui/editor/components/${componentName}.html`,
    controller: SongList
}

angular.module(moduleName).component(componentName, componentOptions)
