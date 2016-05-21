import angular from 'angular';
import { Meteor } from 'meteor/meteor';

import './songEdit.html';

export class SongEdit {

    constructor($scope, $mdDialog, $mdToast) {
        'ngInject'

        this.$scope = $scope;
        this.newSection = {
            section: ''/*,
            sequence: '',
            order: -1*/
        };

        $scope.$watchCollection(
            () => {
                return this.song;
            },
            (song) => {
                if (song) {
                    this._load();
                }
            }
        )

        this.$mdDialog = $mdDialog;
        this.$mdToast = $mdToast;
    }


    _load() {
        this.editable = angular.copy(this.song);

        this.strSequence = {};

        _.forEach(this.editable.sections, (section, name) => {
            let strSequence = section.sequence.join(', ');

            this.strSequence[name] = strSequence;
        })
    }

    updateSequence(name) {
        let $mdToast = this.$mdToast;

        let section = this.editable.sections[name];
        section.sequence = this.strSequence[name].replace(/ /g, '').split(',');

        Meteor.call('saveSequence', this.song._id, {
            section: name,
            sequence: section.sequence
        }, (error) => {
                if (error) {
                    console.debug('updateSequence error', error)
                }
                else {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent(`${name} sequence updated`)
                            .position('top right')
                            .hideDelay(1000)
                    );
                }
            })
    }

    previewSequence(name) {
        let section = this.editable.sections[name];
        console.debug(section);
        section.sequence = this.strSequence[name].replace(/ /g, '').split(',');

    }

    hasSections() {
        return Object.keys(this.song.sections).length;
    }

    addSection() {
        if (this.newSection.section.length === 0) return;

        this.newSection.section = SongEdit._safeName(this.newSection.section);
        if (this.editable.sections[this.newSection.section]) return;

        this.editable.sections[this.newSection.section] =
            {
                sequence:[]
            };
        this.strSequence[this.newSection.section] = "";

        Meteor.call('addSection', this.song._id, {
            section: this.newSection.section
        })

        this.newSection = {
            section: ''/*,
            sequence: '',
            order: -1*/
        };


        /*this.newSection.order = parseInt(this.newSection.order);
        if (this.newSection.order === -1) {
            this.editable.order.push({
                section: this.newSection.section,
                duration: this.newSection.duration
            })
        }
        else {
            this.editable.order.splice(this.newSection.order, 0, {
                section: this.newSection.section,
                duration: this.newSection.duration
            })
        }*/

    }

    renameSection(name, section) {
        let $mdToast = this.$mdToast;

        section.newName = SongEdit._safeName(section.newName);
        if (section.newName.length && !this.song.sections.hasOwnProperty(section.newName)) {
            Meteor.call('renameSection',
                this.song._id,
                {
                    section: name,
                    newName: section.newName
                },
                (error)=> {
                    this.$scope.$apply(
                        () => {
                            if (!error) {

                                $mdToast.show(
                                    $mdToast.simple()
                                        .textContent(`${section.newName} renamed`)
                                        .position('top right')
                                        .hideDelay(1000)
                                );

                                this.editable.sections[section.newName] = this.editable.sections[name];
                                this.strSequence[section.newName] = this.strSequence[name];

                                delete this.editable.sections[name];
                                delete this.strSequence[name];
                            }
                            else {
                                console.debug('renameSection error', error)
                            }
                        }
                    )


                }
            )
        }
    }

    deleteSection(name) {
        if (confirm(`Are you sure you want to delete ${name}?\nYou won't be able to undo it.`)) {
            Meteor.call('deleteSection', this.song._id, name);

            delete this.editable.sections[name];
        };
    }

    reset() {
        angular.copy(this.song, this.editable);
    }

    saveDetail() {
        let $mdToast = this.$mdToast;

        if (this.editable.name.length && this.editable.bpm){
            let $mdToast = this.$mdToast;

            Meteor.call('saveSongDetail',
            this.song._id,
            {
                name: this.editable.name,
                bpm: this.editable.bpm
            }, (error) => {
                this.$scope.$apply(
                    ()=>{
                        if (error) {
                            console.debug('saveDetail error', error)
                        }
                        else {
                            $mdToast.show(
                                $mdToast.simple()
                                    .textContent(`${this.editable.name} saved`)
                                    .position('top right')
                                    .hideDelay(1000)
                            );
                        }
                    }
                )

            });
        }
    }

    deleteSong() {
        if (confirm(`Are you sure you want to delete ${this.song.name}?\nYou won't be able to undo it.`)) {
            Meteor.call('deleteSong', this.song._id, (error) => {
                if (!error) {
                    this.$mdDialog.hide({deleted: true})
                }
            })
        }
    }

    play(section) {
        let $mdToast = this.$mdToast;

        Meteor.call('playSong', this.song._id, {
            section
        }, (error) => {
            if (error) {
                console.debug('playSong error', error)
            }
            else {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent(`Playing ${section}`)
                        .position('top right')
                        .hideDelay(1000)
                );
            }
        })
    }

    pause() {
        let $mdToast = this.$mdToast;

        if (this.song.current) {
            Meteor.call('pauseSong', (error) => {
                if (error) {
                    console.debug('pauseSong error', error)
                }
                else {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent(`Paused ${this.editable.name}`)
                            .position('top right')
                            .hideDelay(1000)
                    );
                }
            });
        }
        else {
            Meteor.call('playSong', this.song._id, {}, (error) => {
                if (error) {
                    console.debug('playSong error', error)
                }
                else {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent(`Playing ${this.editable.name}`)
                            .position('top right')
                            .hideDelay(1000)
                    );
                }
            });
        }
    }

    cancel() {
        this.$mdDialog.cancel();
    }

    static _safeName(name) {
        return name.replace(/\./g, '_');
    }

}
