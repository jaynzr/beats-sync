import angular from 'angular';
import { Meteor } from 'meteor/meteor';


import './sectionSelector.html';

export class SectionSelector {

    constructor($scope, $mdBottomSheet) {
        'ngInject'

        this.$mdBottomSheet = $mdBottomSheet;
        this.keepOpen = true;
        this.$scope = $scope;

    }

    select(section) {
        this._playSection(this.song, section);

        if (!this.keepOpen) {
            this.$mdBottomSheet.hide({ section })
        }
    }

    pause() {
        this._pauseSong();

        if (!this.keepOpen){
            this.$mdBottomSheet.hide(false);
        }
    }

    cancel() {
        this.$mdBottomSheet.cancel();
    }

    _pauseSong(ev) {
        Meteor.call('pauseSong', (error) => {
            this.$scope.$apply(()=>{
                if (error){
                    console.debug('playSong error', error)
                }
            });
        });
    }

    _playSection(song, section) {
        Meteor.call('playSong', song._id, {
            section
        }, (error) => {
            this.$scope.$apply(()=>{
                if (error){
                    console.debug('playSong error', error)
                }
            });
        })
    }

}
