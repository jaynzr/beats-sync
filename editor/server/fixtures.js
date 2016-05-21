import { Meteor } from 'meteor/meteor';
import { Songs } from '../imports/api/songs';
import { colors } from '../imports/api/colors';

Meteor.startup(() => {
  if (Songs.find().count() === 0) {
    const songs = [{
      'name': 'Boom Boom Boom Boom',
      'current': true,
      'play': {
        start: 100,
        type: 'section',
        value: 'verse 1'
      },
      'bpm': 200,
      'sections': {
          'verse 1': {
              'sequence': [colors.random(), colors.random(), colors.random(), colors.random()]
          },
          'verse 2': {
              'sequence': [colors.random(), colors.random(), colors.random()]
          },
          'chorus': {
              'sequence': ['random', 'random']
          }
      },
      'order': [
          {
              'section': 'verse 1',
              'duration': 20
          },
          {
              'section': 'verse 2',
              'duration': 20
          },
          {
              'section': 'chorus',
              'duration': 30
          }
      ]
    }];

    songs.forEach((song) => {
      Songs.insert(song)
    });
  }
});