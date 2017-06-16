import { Meteor } from 'meteor/meteor'

Meteor.methods({
  'users.fetchProfile' (selector, options) {
    return Meteor.users.findOne(selector, options, {
      fields: {
        'services': 0,
        'emails': 0,
        'private': 0,
        'profile.channel': 0
      }
    })
  }
})
