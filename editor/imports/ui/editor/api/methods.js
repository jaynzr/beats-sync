import {Meteor} from 'meteor/meteor';
import {Songs} from '../../../api/songs';


function playSong(songId, fields) {

    if (!this.userId) {
        throw new Meteor.Error(400, 'You have to be logged in!');
    }

    fields = fields || {};

    Songs.update(
        {current: true},
        {
            $set: {
                current: false
            }
        }
    );

    let $set = {current: true};

    $set['play.start'] = fields.start && fields.start || Date.now();

    if (fields.section) {
        $set['play.value'] = fields.section;
        $set['play.type'] = 'section';
    }

    Songs.update(songId, {
        $set
    })
}

function pauseSong() {

    if (!this.userId) {
        throw new Meteor.Error(400, 'You have to be logged in!');
    }

    Songs.update(
        {current: true},
        {
            $set: {
                current: false
            }
        }
    );
}

function addSong(fields) {

    if (!this.userId) {
        throw new Meteor.Error(400, 'You have to be logged in!');
    }

    let song = {
      'name': fields.name,
      'current': false,
      'play': {
        start: 100,
        type: 'section',
        value: ''
      },
      'bpm': fields.bpm || 200,
      'sections': fields.sections || {},
      'order': []
    }

    return Songs.insert(
        song
    )

}

function deleteSong(songId) {
    return Songs.remove(songId)
}

function addSection(songId, fields) {
    if (!this.userId) {
        throw new Meteor.Error(400, 'You have to be logged in!');
    }

    $set = {};
    $set[`sections.${fields.section}`] = {sequence: fields.sequence || []};

    Songs.update(
        songId,
        {
            $set
        }
    )

}

function saveSongDetail(songId, fields) {
    if (!this.userId) {
        throw new Meteor.Error(400, 'You have to be logged in!');
    }

    $set = fields;

    Songs.update(
        songId,
        {
            $set
        }
    )
}

function saveSequence(songId, fields) {
    if (!this.userId) {
        throw new Meteor.Error(400, 'You have to be logged in!');
    }

    $set = {};
    $set[`sections.${fields.section}.sequence`] = fields.sequence

    Songs.update(
        songId,
        {
            $set
        }
    )
}

function renameSection(songId, fields) {
    if (!this.userId) {
        throw new Meteor.Error(400, 'You have to be logged in!');
    }

    $rename = {}
    $rename[`sections.${fields.section}`] = `sections.${fields.newName}`

    Songs.update(
        songId,
        {
            $rename
        }
    )

    $set = {
        'play.value': fields.newName
    }

    Songs.update(
        {
            _id: songId,
            'play.value': fields.section
        },
        {
            $set: {
                'play.value': fields.newName
            }
        }
    )
}

function deleteSection(songId, section) {
    if (!this.userId) {
        throw new Meteor.Error(400, 'You have to be logged in!');
    }

    $unset = {};
    $unset[`sections.${section}`] = "";

    Songs.update(
        songId,
        {
            $unset
        }
    )
}

Meteor.methods({
    playSong,
    pauseSong,
    addSong,
    deleteSong,
    saveSequence,
    addSection,
    saveSongDetail,
    deleteSection,
    renameSection
});
